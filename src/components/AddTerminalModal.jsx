import React, { useState } from "react";
import { createTerminal } from "../api/terminalsApi";
import "../styles/AddTerminalModal.css"

export const AddTerminalModal = ({setIsVisible, refresh })=>{
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        type: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const isFormValid = () => {
        return formData.name && formData.address && formData.city && formData.type;
    };

    const handleAdd = () =>{
        if (!isFormValid()) {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }
        try{
            const createT = async ()=>{
                const t = formData;
                await createTerminal(t);
                console.log("Створено.");
                await refresh();
                setIsVisible(false);
            }

            createT();

        } catch(error) {
            console.error("Помилка під час створення: ", error);
        }
    }

    return (
        <>
            <div className="back" onClick={() => setIsVisible(false)} />

            <div className="centered">
                <div className="modal">
                    <div className="modal-header">
                        <h5 className="header">Додати термінал</h5>
                    </div>

                    <button className="close-button" onClick={() => setIsVisible(false)}>
                        x
                    </button>

                    <div className="modal-content">
                        <div className="form">
                            <label className="form-label">
                                Назва:
                                <input
                                    className="form-input"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="form-label">
                                Місто:
                                <input
                                    className="form-input"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="form-label">
                                Адреса:
                                <input
                                    className="form-input"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="form-label">
                                Тип
                                <input
                                    className="form-input"
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className="actions">
                            <button className="save-button" onClick={() => {
                                handleAdd();
                                setIsVisible(false)
                            }}>
                                Додати
                            </button>

                            <button
                                className="cancel-button"
                                onClick={() => setIsVisible(false)}
                                >
                                Відміна
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

