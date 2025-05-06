import React, { useState, useEffect } from "react";
import styles from "../styles/PostOfficeEmployeeShipments.module.css";
import { getPostOfficeShipments } from "../api/postOfficesApi";

export default function PostOfficeEmployeeShipments() {
    const mockShipments = [
        { id: "SP001", status: "В дорозі", sender: "Іван Петренко", receiver: "Марія Коваленко", 
          address: "вул. Шевченка 10, кв. 5", weight: "2.3 кг", created: "2025-05-01" },
        { id: "SP002", status: "Очікує отримувача", sender: "Олена Гриценко", receiver: "Василь Мороз", 
          address: "вул. Франка 25, кв. 12", weight: "1.1 кг", created: "2025-05-02" },
        { id: "SP003", status: "Очікує отримувача", sender: "Петро Сидоренко", receiver: "Анна Лисенко", 
          address: "вул. Лесі Українки 7, кв. 3", weight: "0.8 кг", created: "2025-05-03" },
        { id: "SP004", status: "В дорозі", sender: "Сергій Мельник", receiver: "Тетяна Бойко", 
          address: "вул. Сагайдачного 15, кв. 20", weight: "3.5 кг", created: "2025-05-04" },
        { id: "SP005", status: "В дорозі", sender: "Наталія Шевчук", receiver: "Дмитро Ковальчук", 
          address: "вул. Хрещатик 44, кв. 7", weight: "1.7 кг", created: "2025-05-05" },
    ];

    const [shipments, setShipments] = useState(mockShipments);
    const [filteredShipments, setFilteredShipments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("В дорозі");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedShipment, setSelectedShipment] = useState(null);

    const fetchShipments = async () =>{
    
        try{
            const poId = JSON.parse(localStorage.getItem("profile")).postOfficeId;

            const ships = await getPostOfficeShipments(Number(poId));
            setShipments(ships); 
            
            console.log("Shipments: ", ships);
        } catch(error) {
            console.error("Error fetching shipments: ", error);
        }
    }

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('uk-UA', options);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const formattedTime = date.toLocaleTimeString('uk-UA', timeOptions);
        return `${formattedDate} ${formattedTime}`;
    }

    useEffect(() => {
        fetchShipments();
    }, []);

    useEffect(() => {
        let filtered = shipments.filter(shipment => 
            shipment.status === selectedStatus &&
            (searchQuery === "" || shipment.id.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredShipments(filtered);
    }, [shipments, selectedStatus, searchQuery]);

    const handleStatusChange = (shipmentId, newStatus) => {
        const updatedShipments = shipments.map(shipment => {
            if (shipment.id === shipmentId) {
                return { ...shipment, status: newStatus };
            }
            return shipment;
        });
        setShipments(updatedShipments);
        setSelectedShipment(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h2 className={styles.title}>Відправлення у відділенні</h2>
                <div className={styles.filterContainer}>
                    <div className={styles.statusToggle}>
                        <button 
                            className={`${styles.statusButton} ${styles.statusButtonLeft} ${selectedStatus === "В дорозі" ? styles.statusButtonActive : ""}`}
                            onClick={() => setSelectedStatus("В дорозі")}
                        >
                            В дорозі
                        </button>
                        <button 
                            className={`${styles.statusButton} ${styles.statusButtonRight} ${selectedStatus === "Очікує отримувача" ? styles.statusButtonActive : ""}`}
                            onClick={() => setSelectedStatus("Очікує отримувача")}
                        >
                            Очікує отримувача
                        </button>
                    </div>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Пошук за ID відправлення..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className={styles.clearButton}
                                onClick={() => setSearchQuery("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.shipmentsList}>
                    {filteredShipments.length > 0 ? (
                        filteredShipments.map(shipment => (
                            <div 
                                key={shipment.id}
                                className={`${styles.shipmentCard} ${selectedShipment && selectedShipment.id === shipment.id ? styles.shipmentCardSelected : ""}`}
                                onClick={() => setSelectedShipment(shipment)}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.shipmentId}>ID: {shipment.id}</span>
                                    <span className={styles.shipmentDate}>{parseDate(shipment.createdAt)}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <p>Отримувач: {shipment.receiverName}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noShipments}>
                            {searchQuery ? "Відправлень за вашим запитом не знайдено" : "Відправлень немає"}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.right}>
                {selectedShipment ? (
                    <div className={styles.detailsContainer}>
                        <h3 className={styles.detailsTitle}>Інформація про відправлення</h3>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailsRow}>
                                <span className={styles.detailsLabel}>ID відправлення:</span>
                                <span className={styles.shipmentId}>{selectedShipment.id}</span>
                            </div>
                            <div className={styles.detailsRow}>
                                <span className={styles.detailsLabel}>Статус:</span>
                                <span className={selectedShipment.status === "В дорозі" ? styles.statusInTransit : styles.statusWaiting}>
                                    {selectedShipment.status}
                                </span>
                            </div>
                            <div className={styles.detailsRow}>
                                <span className={styles.detailsLabel}>Дата створення:</span>
                                <span>{parseDate(selectedShipment.createdAt)}</span>
                            </div>
                            <div className={styles.detailsRow}>
                                <span className={styles.detailsLabel}>Вага:</span>
                                <span>{selectedShipment.parcel.weight} кг</span>
                            </div>
                            <div className={styles.sectionDivider}>
                                <h4 className={styles.sectionTitle}>Відправник</h4>
                                <p>{selectedShipment.senderName}</p>
                            </div>
                            <div className={styles.sectionDivider}>
                                <h4 className={styles.sectionTitle}>Отримувач</h4>
                                <p>{selectedShipment.receiverName}</p>
                                <p className={styles.detailsLabel}>{selectedShipment.address}</p>
                            </div>
                            <div>
                                {selectedShipment.status === "В дорозі" ? (
                                    <button 
                                        className={`${styles.actionButton} ${styles.receiveButton}`}
                                        onClick={() => handleStatusChange(selectedShipment.id, "Очікує отримувача")}
                                    >
                                        Отримали у відділенні
                                    </button>
                                ) : (
                                    <button 
                                        className={`${styles.actionButton} ${styles.deliverButton}`}
                                        onClick={() => handleStatusChange(selectedShipment.id, "Доставлено")}
                                    >
                                        Доставлено
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.detailsPlaceholder}>
                        <div className={styles.placeholderIcon}>📦</div>
                        <p>Виберіть відправлення зі списку для перегляду деталей</p>
                    </div>
                )}
            </div>
        </div>
    );
}
