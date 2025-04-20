import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {

    console.log(localStorage);
    const role = localStorage.getItem("role");
    
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}
