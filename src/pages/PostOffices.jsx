import React, { useEffect, useState } from "react";


import "../styles/PostOffices.css"
import { deletePostOffice, fetchCoordinatesFromPostOffices, getPostOffices, updatePostOffice } from "../api/postOfficesApi";
import { AddPostOfficeModal } from "../components/AddPostOfficeModal";


export default function PostOffices(){
    const [postOffices, setPostOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phoneNumber: "",
        terminalId: -1
    })
    const [isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
        const fetchPostOffices = async ()=>{
            try{
                const po = await getPostOffices();
                const officesWithCoords = await fetchCoordinatesFromPostOffices(po);
                setPostOffices(officesWithCoords);
                console.log(officesWithCoords);
            } catch(error) {
                console.error("Помилка під час отримання відділень: ", error);
            }
        }

        fetchPostOffices();
    }, []);

    const handleSelect = (office) => {
        setSelectedOffice(office);
        setFormData({
            name: office.name,
            address: office.address,
            city: office.city,
            phoneNumber: office.phoneNumber,
            terminalId: office.terminalId
        })
    }

    const handleChange = (e) => {
        setFormData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try{
            const updated = { ...selectedOffice, ...formData };
            await updatePostOffice(updated.id, updated);
            console.log("Успішно оновлено.");
        } catch(error){
            console.error("Помилка під час збереження: ", error);
        }
    }
    
    const handleDelete = async ()=>{
        try{
            const id = selectedOffice.id;
            console.log("Deleting ", id);
            await deletePostOffice(id);
            console.log("Видалено.");
        } catch(error) {
            console.error("Помилка під час видалення: ", error);
        }
    }

    return (
        <div className="container">
            <div className="sidebar">
                <div className="sidebar-title-container">
                    <h3 className="sidebar-title">Відділення</h3>
                    <button onClick={()=>{setIsVisible(true)}} className="add">📋Додати</button>
                </div>
                <ul className="sidebar-list">
                    {postOffices.map((office)=>(
                        <li className={selectedOffice?.id === office.id ? "sidebar-item active" : "sidebar-item"} key = {office.id} onClick={()=>handleSelect(office)}>
                            {office.name || "Без назви"} – {office.city}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="details">
                <h3 className="details-title">Інформація про відділення</h3>
                {selectedOffice ? (
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
                        <div className="buttons">
                            <button onClick={handleSave} className="save">💾 Зберегти</button>
                            <button onClick={handleDelete} className="delete">🗑 Видалити</button>
                        </div>
                    </div>
                ) : (
                    <p className="details-nochoice">Оберіть відділення зліва</p>
                )}
            </div>

            {isVisible && (
                <AddPostOfficeModal setIsVisible={setIsVisible}/>
            )}
        </div>
    )
}