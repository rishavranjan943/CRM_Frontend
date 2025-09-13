import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);

  if (token) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
