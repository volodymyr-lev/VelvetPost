import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email === "" || formData.password === "") {
            alert("Заповніть всі поля!");
        } else {
            const userData = {
                email: formData.email,
                password: formData.password
            }

            try{
                const response = await axios.post(
                    "https://localhost:7047/api/Auth/login",
                    userData
                )

                const { token, role, type, profile } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("userType", type);
                localStorage.setItem("profile", JSON.stringify(profile));

                window.location.href = "/";

                console.log("Авторизація успішна:", response.data);
            } catch(error) {
                console.error("Помилка під час авторизації:", error);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Увійти</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Пароль"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Увійти</button>
                </form>

                <p className="login-note">
                    Ще не маєш акаунту? <NavLink to="/register">Зареєструйся</NavLink>
                </p>
            </div>
        </div>
    );
}
