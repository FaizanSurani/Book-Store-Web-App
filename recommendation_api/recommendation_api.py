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

# Retrieve books and include all relevant fields
cursor = books_collection.find({})
products = [{
    '_id': str(book['_id']),
    'title': book['title'],
    'description': book.get('description', ''),
    'url': book.get('url', ''),  
    'author': book.get('author', ''), 
    'price': book.get('price', 0)
} for book in cursor]

df_products = pd.DataFrame(products)
df_products = df_products[df_products['description'].str.strip() != '']

if df_products.empty:
    raise ValueError("No valid product descriptions found for TF-IDF vectorization.")

tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(df_products['description'])

nn_model = NearestNeighbors(n_neighbors=4, metric='cosine', algorithm='brute')
nn_model.fit(tfidf_matrix)

def get_recommendations(user_id):
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            return []

        orders = orders_collection.find({"user": ObjectId(user_id)})
        book_ids_from_orders = [order['books'] for order in orders]
        book_ids_from_orders = [str(book_id) for book_id in book_ids_from_orders]

        favorites = user.get('favorites', [])
        book_ids = set(book_ids_from_orders)
        book_ids.update(favorites)

        if not book_ids:
            return []

        user_products = df_products[df_products['_id'].isin(book_ids)]

        if user_products.empty:
            return []

        user_tfidf_matrix = tfidf.transform(user_products['description'])

        distances, indices = nn_model.kneighbors(user_tfidf_matrix)

        recommended_indices = indices.flatten()
        if recommended_indices.size == 0:
            return []

        recommended_indices = list(set(idx for idx in recommended_indices if idx < len(df_products)))

        recommended_products = df_products.iloc[recommended_indices].to_dict('records')
        recommended_products = [product for product in recommended_products if product['_id'] not in book_ids]

        return recommended_products

    except Exception as e:
        return []

@app.route("/recommendations/<string:user_id>", methods=['GET'])
def recommendations(user_id):
    recommended_products = get_recommendations(user_id)
    return jsonify({'recommended_products': recommended_products})

if __name__ == '__main__':
    app.run(port=3000, debug=True)
