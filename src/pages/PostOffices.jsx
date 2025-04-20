import React, { useEffect, useState } from "react";


import "../styles/PostOffices.css"
import { fetchCoordinatesFromPostOffices, getPostOffices } from "../api/postOfficesApi";


export default function PostOffices(){
    const [postOffices, setPostOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [newOffice, setNewOffice] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phoneNumber: "",
        terminalId: -1
    })

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
            console.log(`Going to update ${selectedOffice} with ${formData}`);
            //await updatePostOffice(updated.id, updated);
        } catch(error){
            console.error("Помилка під час збереження: ", error);
        }
    }
    
    const handleDelete = async ()=>{
        try{
            const id = selectedOffice.id;
            console.log("Deleting ", id);
            // await deletePostOffice(id);
        } catch(error) {
            console.error("Помилка під час видалення: ", error);
        }
    }

    const handleAdd = async ()=>{
        try{
            const newPost = newOffice;
            console.log("Creating ", newPost);
            // await createPostOffice(newPost);
        } catch(error) {
            console.error("Помилка під час видалення: ", error);
        }
    }

    return (
        <div className="container">
            <div className="sidebar">
                <h3 className="sidebar-title">Відділення</h3>
                <ul className="sidebar-list">
                    {postOffices.map((office)=>(
                        <li className={selectedOffice?.id === office.id ? "sidebar-item active" : "sidebar-item"} key = {office.id} onClick={()=>handleSelect(office)}>
                            {office.name || "Без назви"} – {office.city}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="details">
                <h3 classname="details-title">Інформація про відділення</h3>
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
                                name="phoneNumber"
                                value={formData.terminalId}
                                onChange={handleChange}
                            />
                        </label>
                        <div className="buttons">
                            <button onClick={handleSave} className="save">💾 Зберегти</button>
                            <button onClick={handleSave} className="delete">🗑 Видалити</button>
                        </div>
                    </div>
                ) : (
                    <p className="details-nochoice">Оберіть відділення зліва</p>
                )}
            </div>
        </div>
    )
}