
import React, {useState, useEffect, createContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token) {
            setIsAuthenticated(true);
        }
    },[]);

    const login = (token, role, type, profile) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role", role);
		localStorage.setItem("userType", type);
		localStorage.setItem("profile", JSON.stringify(profile));
		setIsAuthenticated(true);
	};

    const logout = () => {
		localStorage.clear();
		setIsAuthenticated(false);
	};

    return (
        <AuthContext.Provider valye = {{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}