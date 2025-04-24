import React, { useEffect, useState } from "react";

import { deleteTerminal, getTerminals, updateTerminal } from "../api/terminalsApi";
import {AddTerminalModal} from "../components/AddTerminalModal";


export default function Terminals(){
    const [terminals, setTerminals] = useState([]);
    const [selectedTerminal, setSelectedTerminal] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        type: "",
    })

    const [isVisible, setIsVisible] = useState(false);

    const fetchTerminals = async ()=>{
        try{
            const t = await getTerminals();
            setTerminals(t);
            console.log(t);
        } catch(error) {
            console.error("Помилка під час отримання терміналів: ", error);
        }
    }

    useEffect(()=>{
        fetchTerminals();
    }, []);

    const handleSelect = (terminal) => {
        setSelectedTerminal(terminal);
        setFormData({
            name: terminal.name,
            address: terminal.address,
            city: terminal.city,
            type: terminal.type,
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
            const updated = { ...selectedTerminal, ...formData };
            await updateTerminal(updated.id, updated);
            console.log("Успішно оновлено.");
            await fetchTerminals();
        } catch(error){
            console.error("Помилка під час збереження: ", error);
        }
    }
    
    const handleDelete = async ()=>{
        try{
            const id = selectedTerminal.id;
            console.log("Deleting ", id);
            await deleteTerminal(id);
            console.log("Видалено.");
            await fetchTerminals();
        } catch(error) {
            console.error("Помилка під час видалення: ", error);
        }
    }

    return (
        <div className="container">
            <div className="sidebar">
                <div className="sidebar-title-container">
                    <h3 className="sidebar-title">Термінали</h3>
                    <button onClick={()=>{setIsVisible(true)}} className="add">📋Додати</button>
                </div>
                <ul className="sidebar-list">
                    {terminals.map((t)=>(
                        <li className={selectedTerminal?.id === t.id ? "sidebar-item active" : "sidebar-item"} key = {t.id} onClick={()=>handleSelect(t)}>
                            {t.name || "Без назви"} – {t.city}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="details">
                <h3 className="details-title">Інформація про термінал</h3>
                {selectedTerminal ? (
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
                            Тип:
                            <input
                                className="form-input"
                                type="text"
                                name="type"
                                value={formData.type}
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
                <AddTerminalModal setIsVisible={setIsVisible} refresh={fetchTerminals}/>
            )}
        </div>
    )
}