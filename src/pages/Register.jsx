import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Паролі не співпадають!");
        } else {
            console.log("Реєстрація успішна!");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Зареєструватися</h2>
                <form className="register-form" onSubmit={handleSubmit}>
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
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder="Підтвердження паролю"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Зареєструватися</button>
                </form>

                <p className="register-note">
                    Вже є акаунт? <NavLink to="/login">Увійти</NavLink>
                </p>
            </div>
        </div>
    );
}
