import React, { useState } from "react";
import { createPostOffice } from "../api/postOfficesApi";
import "../styles/AddPostOfficeModal.css"

export const AddPostOfficeModal = ({setIsVisible})=>{
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phoneNumber: "",
        terminalId: -1
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleAdd = () =>{
        try{
            const createPO = async ()=>{
                const po = formData;
                await createPostOffice(po);
                console.log("Створено.");
            }

            createPO();

        } catch(error) {
            console.error("Помилка під час видалення: ", error);
        }
    }

    return (
        <>
            <div className="back" onClick={() => setIsVisible(false)} />

            <div className="centered">
                <div className="modal">
                    <div className="modal-header">
                        <h5 className="header">Додати відділення</h5>
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
                                Номер телефону:
                                <input
                                    className="form-input"
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="form-label">
                                ID терміналу:
                                <input
                                    className="form-input"
                                    type="text"
                                    name="terminalId"
                                    value={formData.terminalId}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className="actions">
                            <button className="save-button" onClick={() => {handleAdd()}}>
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

