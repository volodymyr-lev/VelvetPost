
import React from "react";
import styles from "../styles/Shipments.module.css";
import { getShipmentById } from "../api/ShipmentsApi";
export default function Shipments(){
    const [searchTerm, setSearchTerm] = React.useState("");

    const [shipment, setShipment] = React.useState(null);

    const handleSearch = async () => {
        try{
            await fetchShipment();
            console.log(shipment);
        } catch(error) {
            console.error("Помилка під час пошуку: ", error);
        }
    }

    const fetchShipment = async () => {
        const shipmentData = await getShipmentById(searchTerm);
        setShipment(shipmentData);
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <div className={styles.searchContainerLeft}>
                    <span className={styles.searchLabel}>
                        Пошук відправлення за <span style={{color: '#a472ff'}}>ID</span>
                    </span>
                </div>
                <div className={styles.searchContainerRight}>
                    {shipment && (
                    <button
                        className={styles.editButton}
                    >
                        <ion-icon name="create-outline"></ion-icon>
                        Редагувати
                    </button>)}

                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="Введіть ID"
                        onChange={(e) => 
                            {
                                setSearchTerm(e.target.value)
                            }}
                        />
                    <button 
                        className={styles.searchButton}
                        onClick={handleSearch}
                        >Пошук</button>
                </div>
            </div>

            {shipment !== null ? (
                <div className={styles.shipmentContainer}>
                    <div className={styles.shipmentCard}>
                        <div className={styles.shipmentCardHeader}>
                            <h3 className={styles.shipmentCardTitle}>Відправлення</h3>
                            <span className={styles.shipmentCardId}>ID: {shipment.id}</span>
                        </div>
                    <div className={styles.shipmentCardContent}>
                        <div className={styles.shipmentCardPeople}>
                            <p>
                                Відпарвник - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.senderName}
                                </span>
                            </p>
                            <p>
                                Отримувач - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.receiverName}
                                </span>
                            </p>
                        </div>

                        <div className={styles.shipmentCardPostOffices}>
                            <p>
                                Прямує з - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.fromPostOfficeName}
                                </span>
                            </p>
                            <p>
                                Прямує до - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.toPostOfficeName}
                                </span>
                            </p>
                        </div>

                        <div className={styles.shipmentCardTime}>
                            <p>
                                Дата відправлення - 
                                <span className={styles.shipmentCardHighlight}>
                                    {new Date(shipment.createdAt).toLocaleString().replace(/\//g, "-")}
                                </span>
                            </p>
                            <p>
                                Дата прибуття - 
                                <span className={styles.shipmentCardHighlight}>
                                    {(shipment.deliveredAt=== null) ? "Не доставлено" : new Date(shipment.deliveredAt).toLocaleString().replace(/\//g, "-")}
                                </span>
                            </p>
                        </div>

                        <div className={styles.shipmentCardStatus}>
                            <p>
                                Статус - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.status}
                                </span>
                            </p>
                        </div>
                        <div className={styles.shipmentCardPrice}>
                            <p>
                                Ціна - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.price} грн
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            ) : (
                <div className={styles.shipmentContainer}>
                    <div className={styles.enterIdContainer}>
                        <h3 className={styles.enterIdTitle}>Введіть ID відправлення</h3>
                        <p className={styles.enterIdText}>
                            Щоб переглянути деталі відправлення, введіть його ID у полі пошуку вище.
                        </p>
                    </div>
                </div>
            )}


            {shipment?.parcel === null ? (
                <div className={styles.unChainContainer}>
                    <ion-icon name="unlink-outline"></ion-icon>
                </div>
            ) : (
                <div className={styles.chainContainer}>
                    <ion-icon name="link-outline"></ion-icon>
                </div>
            )
            }

            {shipment !== null && shipment?.parcel !== null ? (
                <div className={styles.parcelContainer}>
                    <div className={styles.parcelCardHeader}>
                        <h3 className={styles.parcelCardTitle}>Відправлення</h3>
                        <span className={styles.parcelCardId}>ID: {shipment?.parcel.id}</span>
                    </div>

                    <div className={styles.parcelCardContent}>
                        <div className={styles.parcelCardIcon}>
                            {shipment?.parcel.type === "Посилка" ? (
                                <ion-icon name="cube-outline"></ion-icon>
                            ) : shipment?.parcel.type === "Лист" ? (
                                <ion-icon name="mail-outline"></ion-icon>
                            ) : shipment?.parcel.type === "Бандероль" ? (
                                <ion-icon name="cube-outline"></ion-icon>
                            ) : shipment?.parcel.type === "Секограма" ? (
                                <ion-icon name="glasses-outline"></ion-icon>
                            ) : (
                                <ion-icon name="cube-outline"></ion-icon>
                            )}
                        </div>


                        <div className={styles.parcelCard}>
                            <p>
                                Вага - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.parcel.weight} кг
                                </span>
                            </p>
                            <p>
                                Тип відправлення - 
                                <span className={styles.shipmentCardHighlight}>
                                    {shipment.parcel.type}
                                </span>
                            </p>
                        </div>
                    </div>

                </div>
            ) : (
                <div className={styles.parcelContainer}>
                    <div className={styles.enterIdContainer}>
                        <p className={styles.enterIdText}>
                            {shipment?.parcel === null ? "Відправлення не має посилки" : "Нема відправлення - нема посилки."}
                        </p>
                    </div>
                </div>
            )}

        </div>
    )
}