from flask import Flask, jsonify, request
import pymongo
import pandas as pd
import os
from dotenv import load_dotenv
from bson import ObjectId
from flask_cors import CORS
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
load_dotenv()
CORS(app)

# MongoDB setup
mongodb_uri = os.getenv('MONGODB_URI')
db_name = "BookHeaven"
user_collections = "users"
books_collections = "books"
orders_collections = "orders"

client = pymongo.MongoClient(mongodb_uri)
db = client[db_name]
user_collection = db[user_collections]
books_collection = db[books_collections]
orders_collection = db[orders_collections]

# Prepare product data
cursor = books_collection.find({})
products = [{
    '_id': str(book['_id']),
    'title': book['title'],
    'description': book.get('description', '').strip(),
    'url': book.get('url', ''),
    'author': book.get('author', ''),
    'price': book.get('price', 0)
} for book in cursor]

df_products = pd.DataFrame(products)
df_products = df_products[df_products['description'] != '']

if df_products.empty:
    raise ValueError("No valid product descriptions found for TF-IDF vectorization.")

tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(df_products['description'])

nn_model = NearestNeighbors(n_neighbors=4, metric='cosine', algorithm='brute')
nn_model.fit(tfidf_matrix)

def get_recommendations(user_id):
    try:
        print(f"\nFetching recommendations for user: {user_id}")

        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            print("User not found.")
            return []

        print("User found.")
        orders_cursor = orders_collection.find({"user": ObjectId(user_id)})
        orders = list(orders_cursor)

        book_ids_from_orders = []
        for order in orders:
            books = order.get("books", [])
            if isinstance(books, list):
                book_ids_from_orders.extend(str(book_id) for book_id in books)
            elif isinstance(books, ObjectId):
                book_ids_from_orders.append(str(books))

        print("Book IDs from orders:", book_ids_from_orders)

        favorites = user.get('favorites', [])
        print("Favorites:", favorites)

        book_ids = set(book_ids_from_orders)
        book_ids.update(favorites)
        print("Combined user book IDs:", book_ids)

        if not book_ids:
            print("No book IDs found from orders or favorites.")
            return []

        user_products = df_products[df_products['_id'].isin(book_ids)]
        print("User product matches found:", len(user_products))

        if user_products.empty:
            print("No matching product descriptions for user.")
            return []

        user_tfidf_matrix = tfidf.transform(user_products['description'])
        distances, indices = nn_model.kneighbors(user_tfidf_matrix)

        recommended_indices = indices.flatten()
        recommended_indices = list(set(idx for idx in recommended_indices if idx < len(df_products)))

        recommended_products = df_products.iloc[recommended_indices].to_dict('records')
        recommended_products = [
            product for product in recommended_products
            if product['_id'] not in book_ids
        ]

        print("Recommendations generated:", len(recommended_products))
        return recommended_products

    except Exception as e:
        print("Error while generating recommendations:", str(e))
        return []

@app.route("/recommendation_api/<string:user_id>", methods=['GET', "HEAD"])
def recommendations(user_id):
    recommended_products = get_recommendations(user_id)
    return jsonify({'recommended_products': recommended_products})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)