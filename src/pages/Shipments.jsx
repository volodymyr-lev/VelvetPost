
import React from "react";
import styles from "../styles/Shipments.module.css";
import { getShipmentById } from "../api/ShipmentsApi";
export default function Shipments(){
    const [searchTerm, setSearchTerm] = React.useState("");
    const [shipment, setShipment] = React.useState([]);

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
        console.log(shipmentData);
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
            <div className={styles.shipmentContainer}>

            </div>
            <div className={styles.parcelContainer}>

            </div>
        </div>
    )
}