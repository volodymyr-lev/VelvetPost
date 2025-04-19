import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Register.css";
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Паролі не співпадають!");
        } else {
            console.log(formData);

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address,
                password: formData.password,
            }

            try{
                const response = await axios.post(
                    "https://localhost:7047/api/Auth/register",
                    userData
                )
                console.log("Реєстрація успішна:", response.data);

            }  catch (error) {
                console.error("Помилка під час реєстрації:", error);
                alert("Щось пішло не так. Спробуй ще раз.");
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Зареєструватися</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group inline-group">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="Ім’я"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Прізвище"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            placeholder="Номер телефону"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            placeholder="Адреса"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group inline-group">
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
                    </div>

                    <button type="submit">Зареєструватися</button>
                </form>

                <p className="register-note">
                    Вже є акаунт? <NavLink to="/login">Увійти</NavLink>
                </p>
            </div>
        </div>
    );
}
