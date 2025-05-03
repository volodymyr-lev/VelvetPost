import React, { useState, useEffect } from "react";
import styles from "../styles/EditShipmentModal.module.css";
import { editShipment } from "../api/ShipmentsApi";

export default function EditShipmentModal({ shipment, setIsModalOpen, onSave }) {
    const [form, setForm] = useState({
        senderId: shipment.senderId,
        receiverId: shipment.receiverId,
        fromPostOfficeId: shipment.fromPostOfficeId,
        toPostOfficeId: shipment.toPostOfficeId,
        parcelId: (shipment.parcel !== null) ? shipment.parcel.id : null,
        createdAt: shipment.createdAt,
        deliveredAt: shipment.deliveredAt || null,
        status: shipment.status,
        price: shipment.price,
        parcelWeight: shipment.parcel?.weight || null,
        parcelType: shipment.parcel?.type || null
    });

    useEffect(() => {
        setForm({
            senderId: shipment.senderId,
            receiverId: shipment.receiverId,
            fromPostOfficeId: shipment.fromPostOfficeId,
            toPostOfficeId: shipment.toPostOfficeId,
            parcelId: (shipment.parcel !== null) ? shipment.parcel.id : null,
            createdAt: shipment.createdAt,
            deliveredAt: shipment.deliveredAt || null,
            status: shipment.status,
            price: shipment.price,
            parcelWeight: shipment.parcel?.weight || null,
            parcelType: shipment.parcel?.type || null
        });
    }, [shipment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            console.log(form);
            if(shipment.parcel !== null && form.parcelId === "")
            {
                form.parcelId = null;
            }

            await editShipment(shipment.id, form);

            onSave();
            setIsModalOpen(false);

        } catch (error) {
            console.error("Помилка при збереженні:", error);
        }
    };

    return (
        <div className={styles.modalBackdrop}
             onClick={() => setIsModalOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.editShipment}>Редагувати відправлення</h2>

                {/* Група: Відправник/Отримувач */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>Відправник (SenderId):</label>
                        <input name="senderId" value={form.senderId} onChange={handleChange} />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Отримувач (ReceiverId):</label>
                        <input name="receiverId" value={form.receiverId} onChange={handleChange} />
                    </div>
                </div>

                {/* Група: Відділення відправлення/отримання */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>Звідки (FromPostOfficeId):</label>
                        <input name="fromPostOfficeId" value={form.fromPostOfficeId} onChange={handleChange} />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Куди (ToPostOfficeId):</label>
                        <input name="toPostOfficeId" value={form.toPostOfficeId} onChange={handleChange} />
                    </div>
                </div>

                {/* ID Посилки */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>ID Посилки (ParcelID):</label>
                        <input 
                            className = {styles.longFieldStyle}
                            name="parcelId" 
                            value={form.parcelId} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                {/* Група: Дати */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>Дата створення (CreatedAt):</label>
                        <input name="createdAt" type="datetime-local" value={form.createdAt.slice(0,16)} onChange={handleChange} />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Дата доставки (DeliveredAt):</label>
                        <input name="deliveredAt" type="datetime-local" value={form.deliveredAt ? form.deliveredAt.slice(0,16) : ""} onChange={handleChange} />
                    </div>
                </div>

                {/* Група: Статус і ціна */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>Статус:</label>
                        <select name="parcelStatus" value={form.status} onChange={handleChange}>
                            <option value="" disabled>Виберіть тип</option>
                            <option value="Очікує пакунок">Очікує пакунок</option>
                            <option value="Очікує відправки">Очікує відправки</option>
                            <option value="В дорозі">В дорозі</option>
                            <option value="Прибув до відділення">Прибув до відділення</option>
                            <option value="Врученний">Врученний</option>
                        </select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Ціна (грн):</label>
                        <input name="price" type="number" value={form.price} onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.parcelTitleContainer}>
                    <h3 className={styles.parcelTitle}>Посилка</h3>
                </div>

                {/* Група: Вага і тип посилки */}
                <div className={styles.formGroup}>
                    <div className={styles.fieldContainer}>
                        <label>Вага (кг):</label>
                        <input 
                            name="parcelWeight" 
                            type="number" 
                            value={form.parcelWeight} 
                            onChange={handleChange} 
                            placeholder="Введіть вагу" 
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Тип посилки:</label>
                        <select name="parcelType" value={(shipment.parcel===null && form.parcelWeight === null)?"":form.parcelType} onChange={handleChange}>
                            <option value="" disabled>Виберіть тип</option>
                            <option value="Посилка">Посилка</option>
                            <option value="Лист">Лист</option>
                            <option value="Бандероль">Бандероль</option>
                            <option value="Секограма">Секограма</option>
                        </select>
                    </div>
                </div>

                <div className={styles.modalButtons}>
                    <button onClick={handleSave}>Зберегти</button>
                    <button onClick={() => {setIsModalOpen(false)}}>Скасувати</button>
                </div>
            </div>
        </div>
    );
}