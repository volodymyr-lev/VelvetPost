import React, { useEffect, useState } from "react";
import { getClientById } from "../api/ClientsApi";
import styles from "../styles/ClientMyShipments.module.css";
import { getShipmentById } from "../api/ShipmentsApi";
import { getPostOfficeById } from "../api/postOfficesApi";

export default function ClientMyShipments() {
    const [client, setClient] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [toPostOffice, setToPostOffice] = useState(null);
    const [fromPostOffice, setFromPostOffice] = useState(null);

    const [sendOrReceive, setSendOrReceive] = useState("Я");

    const sortByDate = () =>{
        if (client && client.shipments) {
            client.shipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setClient({ ...client });
        }
    }

    const sortByStatus = () =>{
        if (client && client.shipments) {
            client.shipments.sort((a, b) => a.status.localeCompare(b.status));
            setClient({ ...client });
        }
    }


    const fetchClientShipments = async () => {
        try {
            setLoading(true);
            const clnt = await getClientById(JSON.parse(localStorage.getItem("profile")).id);
            
            let shpmnts = [];

            await Promise.all(clnt.shipments.map(async (shipment) => {
                const shp = await getShipmentById(shipment.id);
                shpmnts.push(shp);
            }));
            
            clnt.shipments = shpmnts;

            clnt.shipments.sort((a, b) => {
                if (a.status === "Доставлено" && b.status !== "Доставлено") return 1;
                if (a.status !== "Доставлено" && b.status === "Доставлено") return -1;
                
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setClient(clnt);
            console.log(clnt);
            
            if (clnt.shipments && clnt.shipments.length > 0) {
                setSelectedShipment(clnt.shipments[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error while fetching client:", error);
            setError("Помилка при завантаженні даних");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientShipments();
    }, []);


    const getPostOfficesOfShipment = async (shipment) => {
        if (shipment) {
            const toPostOffice = await getPostOfficeById(shipment.toPostOfficeId);
            const fromPostOffice = await getPostOfficeById(shipment.fromPostOfficeId);
            setFromPostOffice(fromPostOffice);
            setToPostOffice(toPostOffice);
        }
    }
    useEffect(() => {
        getPostOfficesOfShipment(selectedShipment);
    }, [selectedShipment]);

    const getStatusColor = (status) => {
        switch (status) {
        case "Доставлено":
            return styles.statusDelivered;
        case "В дорозі":
            return styles.statusInTransit;
        case "Очікує відправлення":
            return styles.statusPending;
        default:
            return styles.statusDefault;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
        <div className={styles.leftContainer}>
            <div className={styles.leftContainerTitle}>
                <h2>Мої відправлення</h2>

                <div className={styles.sendOrReceiveContainer}>
                <button 
                    className={styles.sendOrReceiveButton} 
                    onClick={() => {
                        setSendOrReceive(prev => prev === "Я" ? "Вам" : "Я");
                    }}
                >
                    {sendOrReceive === "Я" ? (
                        <ion-icon name="arrow-up-outline"></ion-icon>
                    ) : (
                        <ion-icon name="arrow-down-outline"></ion-icon>
                    )}
                </button>
                </div>

                <div className={styles.sortButtons}>
                    <button className={styles.sortButton} onClick={sortByDate}>За датою</button>
                    <button className={styles.sortButton} onClick={sortByStatus}>За статусом</button>
                </div>
            </div>

            <div className={styles.leftContainerContent}>
            {loading ? (
                <div className={styles.loadingIndicator}>Завантаження...</div>
            ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
            ) : client && client.shipments && client.shipments.length > 0 ? (
                <ul className={styles.shipmentsList}>
                    {client.shipments.filter(shipment => 
                        sendOrReceive === "Я" 
                            ? shipment.senderId === client.id 
                            : shipment.receiverId === client.id
                        ).map((shipment, index) => (
                        <li 
                            key={index} 
                            className={`${styles.shipmentCard} ${selectedShipment?.id === shipment.id ? styles.selectedShipment : ''}`}
                            onClick={() => setSelectedShipment(shipment)}
                        >
                            <div className={styles.shipmentCardHeader}>
                                <h3>№ {shipment.id}</h3>
                                <span className={`${styles.statusBadge} ${getStatusColor(shipment.status)}`}>
                                {shipment.status}
                                </span>
                            </div>
                            <div className={styles.shipmentCardDetails}>
                                <p className={styles.shipmentDate}>
                                    {formatDate(shipment.createdAt)}
                                </p>
                                <p className={styles.shipmentRoute}>
                                    {shipment.fromPostOfficeName} → {shipment.toPostOfficeName}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={styles.emptyState}>
                <p>У вас немає відправлень</p>
                </div>
            )}
            </div>
        </div>

        <div className={styles.rightContainer}>
            {selectedShipment ? (
            <div className={styles.shipmentDetails}>
                <div className={styles.shipmentDetailsHeader}>
                <h2>Деталі відправлення</h2>
                <span className={`${styles.statusBadge} ${getStatusColor(selectedShipment.status)}`}>
                    {selectedShipment.status}
                </span>
                </div>
                
                <div className={styles.detailsContainer}>
                <div className={styles.detailsSection}>
                    <h3>Загальна інформація</h3>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Номер відправлення:</span>
                        <span className={styles.detailValue}>№ {selectedShipment.id}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Дата створення:</span>
                        <span className={styles.detailValue}>{formatDate(selectedShipment.createdAt)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Дата доставки:</span>
                        <span className={styles.detailValue}>
                            {selectedShipment.deliveredAt?formatDate(selectedShipment.deliveredAt) : "Не доставлено"}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Ім'я відправника:</span>
                        <span className={styles.detailValue}>
                            {selectedShipment.senderName}
                        </span>
      
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Ім'я отримувача:</span>
                        <span className={styles.detailValue}>
                            {selectedShipment.receiverName}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Вартість доставки:</span>
                        <span className={styles.detailValue}>
                            {selectedShipment.price} грн
                        </span>
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h3>Маршрут</h3>
                    <div className={styles.routeInfo}>
                    <div className={styles.routePoint}>
                        <div className={styles.routeMarker}>A</div>
                        <div>
                            <p className={styles.routeAddress}>
                                {fromPostOffice ? fromPostOffice.name : "Поштове відділення не знайдено"}
                                
                            </p>

                            <p className={styles.routeAddressDetails}>
                                {fromPostOffice ? fromPostOffice.city + ", " + fromPostOffice.address : "Поштове відділення не знайдено"}
                            </p>
                        </div>
                    </div>
                    
                    <div className={styles.routeConnector}>
                        <div className={styles.routeLine}></div>
                    </div>
                    
                    <div className={styles.routePoint}>
                        <div className={styles.routeMarker}>B</div>
                        <div>
                        <p className={styles.routeAddress}>
                            {toPostOffice ? toPostOffice.name : "Поштове відділення не знайдено"}
                        </p>
                        <p className={styles.routeAddressDetails}>
                            {toPostOffice ? toPostOffice.city + ", " + toPostOffice.address : "Поштове відділення не знайдено"}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h3>Інформація про вантаж</h3>
                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Вага:</span>
                    <span className={styles.detailValue}>
                        {selectedShipment.parcel !== null ? selectedShipment.parcel.weight + " кг": "Вантаж вітсутній"} 
                    </span>
                    </div>
                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Тип вантажу:</span>
                    <span className={styles.detailValue}>
                        {selectedShipment.parcel !== null ? selectedShipment.parcel.type : "Вантаж вітсутній"}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            ) : (
            <div className={styles.noSelectionState}>
                <p>Оберіть відправлення зі списку для перегляду деталей</p>
            </div>
            )}
        </div>
        </div>
    );
}