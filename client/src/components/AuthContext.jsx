import React, { createContext, useReducer } from "react";

const initialState = {
  isLoggedIn: false,
  role: "user",
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, isLoggedIn: false };
    case "CHANGE_ROLE":
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = () => {
    dispatch({ type: "LOGIN" });
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  const changeRole = (role) => {
    dispatch({ type: "CHANGE_ROLE", payload: role });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, changeRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export default AuthProvider;
