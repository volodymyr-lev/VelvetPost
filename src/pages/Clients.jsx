// src\pages\Clients.jsx
import React, { useState } from "react";
import styles from "../styles/Clients.module.css";
import { getClientByEmail, getClientById } from "../api/ClientsApi";

export default function Clients() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("email");
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [clientDetails, setClientDetails] = useState(null);
    const [isClosing, setIsClosing] = useState(false);


    const searchClient = async () => {
        setIsSearching(true);
        setError("");

        try {
            if (searchType === "email" && !searchTerm.includes('@')) {
                throw new Error("Невірний формат email");
            }
            if (searchType === "id" && searchTerm.trim() === "") {
                throw new Error("ID клієнта не може бути порожнім");
            }

            let clnt = null;
            if(searchType === "email") {
                clnt = await getClientByEmail(searchTerm);
                setSearchResult(clnt);
            } else {
                clnt = await getClientById(searchTerm);
                setSearchResult(clnt);
            }
            console.log(clnt);
        } catch (error) {
            setError(error.message || "Помилка при пошуку клієнта");
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchClient();
    };

    const showClientDetails = (client) => {
        setClientDetails(client);
    };

    const handleCloseDetails = () => {
        setIsClosing(true);
        setTimeout(() => {
            setClientDetails(null);
            setIsClosing(false);
        }, 500);
    };

    // Обчислюємо класи для основного контейнера
    const containerClassName = `${styles.container} ${clientDetails ? styles.containerShifted : styles.containerNormal}`;

    return (
        <div className={styles.page}>
            <div className={containerClassName}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerTopRow}>
                        <h1 className={styles.headerTitle}>Пошук клієнтів</h1>
                    </div>

                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchTypeContainer}>
                            <span className={styles.headerText}>Пошук за:</span>

                            <div className={styles.radioButtonsAndTexts}>
                                <div className={styles.radioButtonOption}>
                                    <label className={styles.radioButtonText}>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            value="email"
                                            checked={searchType === "email"}
                                            onChange={() => setSearchType("email")}
                                        />
                                        Email
                                    </label>
                                </div>

                                <div className={styles.radioButtonOption}>
                                    <label className={styles.radioButtonText}>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            value="id"
                                            checked={searchType === "id"}
                                            onChange={() => setSearchType("id")}
                                        />
                                        ID клієнта
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.searchInputContainer}>
                            <input
                                className={styles.searchInput}
                                type={searchType === "email" ? "email" : "text"}
                                placeholder={searchType === "email" ? "🔍 Введіть email клієнта..." : "🔍 Введіть ID клієнта..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                className={styles.searchButton}
                                disabled={isSearching}
                            >
                                {isSearching ? "Пошук..." : "Пошук"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.contentContainer}>
                    {error && (
                        <div className={styles.errorMessage}>
                            <ion-icon name="alert-circle"></ion-icon>
                            <span>{error}</span>
                        </div>
                    )}

                    {searchResult && !error && (
                        <div className={`${styles.resultCard} ${styles.fadeIn}`}>
                            <div className={styles.resultHeader}>
                                <h2>Інформація про клієнта</h2>
                                <div className={styles.idBadge}>ID: {searchResult.id}</div>
                            </div>
                            
                            <div className={styles.resultContent}>
                                <div className={styles.clientInfoRow}>
                                    <div className={styles.infoGroup}>
                                        <label>Ім'я</label>
                                        <span>{searchResult.firstName}</span>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Прізвище</label>
                                        <span>{searchResult.lastName}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.clientInfoRow}>
                                    <div className={styles.infoGroup}>
                                        <label>Email</label>
                                        <span>{searchResult.email}</span>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Телефон</label>
                                        <span>{searchResult.phoneNumber}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.infoGroup} style={{ width: "100%" }}>
                                    <label>Адреса</label>
                                    <span>{searchResult.city}, {searchResult.address}</span>
                                </div>
                                
                                <div className={styles.clientInfoRow}>
                                    <div className={styles.infoGroup}>
                                        <label>Дата реєстрації</label>
                                        <span>{new Date(searchResult.creationDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>Остання активність</label>
                                        {searchResult.shipments.length === 0 ? (
                                            <span>Користувач ще не робив замовлень</span>
                                        ) : (
                                            <span>Замовлення номер: {searchResult.shipments.at(-1).id}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <button 
                                    className={styles.detailsButton}
                                    onClick={() => showClientDetails(searchResult)}
                                >
                                    Детальніше
                                </button>
                            </div>
                        </div>
                    )}

                    {!searchResult && !error && !isSearching && (
                        <div className={styles.noResults}>
                            <div className={styles.searchIllustration}>🔎</div>
                            <p>Введіть email або ID клієнта для пошуку</p>
                        </div>
                    )}
                </div>
            </div>

            {clientDetails && (
                <div className={`${styles.clientDetailsContainer} ${isClosing ? styles.clientInfoClosing : ''}`}>
                    <div className={styles.clientDetailsHeader}>
                        <h2 className={styles.clientDetailsTitle}>Детальна інформація</h2>
                        <button className={styles.closeButton} onClick={handleCloseDetails}>
                            <ion-icon name="close"></ion-icon>
                        </button>
                    </div>

                    <div className={styles.clientDetailsContent}>
                        <div className={styles.clientProfile}>
                            <div className={styles.avatarPlaceholder}>
                                {clientDetails.firstName[0]}{clientDetails.lastName[0]}
                            </div>
                            <div className={styles.clientName}>
                                {clientDetails.firstName} {clientDetails.lastName}
                            </div>
                            <div className={styles.clientStatus}>
                                Активний клієнт
                            </div>
                        </div>

                        <div className={styles.clientContact}>
                            <div className={styles.contactItem}>
                                <ion-icon name="mail"></ion-icon>
                                <span>{clientDetails.email}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <ion-icon name="call"></ion-icon>
                                <span>{clientDetails.phoneNumber}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <ion-icon name="location"></ion-icon>
                                <span>{clientDetails.city}, {clientDetails.address}</span>
                            </div>
                        </div>

                        <div className={styles.orderSection}>
                            <h3>Історія замовлень</h3>
                            {clientDetails.shipments.map((order) => (
                                <div key={order.id} className={styles.orderItem}>
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderId}>{order.id}</span>
                                        <span className={styles.orderDate}>{order.date}</span>
                                    </div>
                                    <div className={styles.orderDetails}>
                                        <div className={styles.orderStatus}>
                                            <span>Статус:</span>
                                            <span className={styles.statusBadge}>{order.status}</span>
                                        </div>
                                        <div className={styles.orderAmount}>
                                            <span>Сума:</span>
                                            <span className={styles.amountValue}>{order.amount} грн</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}