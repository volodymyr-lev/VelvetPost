import React, { useEffect } from "react";
import styles from "../styles/PostOfficeEmployeeProfile.module.css";
import { getPostOfficeById } from "../api/postOfficesApi";
import PostOfficeSVG from "../assets/postOffice.svg";

export default function PostOfficeEmployeeProfile({ profile }) {
    const [postOffice, setPostOffice] = React.useState(null);
    
    const getPostOfficeInfo = async () => {
        try{
            const po = await getPostOfficeById(profile.postOfficeId);
            setPostOffice(po);
            console.log("Post office info: ", po);
        } catch(error) {
            console.error("Помилка при отриманні інформації про відділення:", error);
        }
    }
    
    useEffect(() => {
        getPostOfficeInfo();
    },[])
    
    return (
        <>
            <div className="profile-container">
                <h2 className="profile-container-title">Ваші дані</h2>
                <div>
                    <p className="profile-container-text">
                        Вас звати: <span className="profile-container-info">{profile.firstName} {profile.lastName}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш номер телефону: <span className="profile-container-info">{profile.phone}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш email: <span className="profile-container-info">{profile.email}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваша посада: <span className="profile-container-info">{profile.position}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш ID в нашій системі: <span className="profile-container-info">{profile.id}</span>
                    </p>
                </div>
            </div>
            
            <div className="map-container">
                <h2 className="profile-container-title">Ваше відділення</h2>
                <div className={styles.postOfficeContainer}>
                    <div className={styles.postOfficeImgContainer}>
                        <img src={PostOfficeSVG} alt="Post Office" className={styles.postOfficeImage}/>
                    </div>
                    
                    {postOffice && (
                        <div className={styles.postOfficeInfo}>
                            <h3 className={styles.postOfficeName}>{postOffice.name}</h3>
                            
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>ID відділення:</span>
                                    <span className={styles.infoValue}>{postOffice.id}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Місто:</span>
                                    <span className={styles.infoValue}>{postOffice.city}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Адреса:</span>
                                    <span className={styles.infoValue}>{postOffice.address}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Телефон:</span>
                                    <span className={styles.infoValue}>{postOffice.phoneNumber}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Працівників:</span>
                                    <span className={styles.infoValue}>
                                        {postOffice.employeeCount ? postOffice.employeeCount : "Немає даних"}
                                    </span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Вхідні відправлення:</span>
                                    <span className={styles.infoValue}>
                                        {postOffice.incomingShipmentsCount ? postOffice.incomingShipmentsCount : "Немає даних"}
                                    </span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Вихідні відправлення:</span>
                                    <span className={styles.infoValue}>
                                        {postOffice.outgoingShipmentsCount ? postOffice.outgoingShipmentsCount : "Немає даних"}
                                    </span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>ID терміналу:</span>
                                    <span className={styles.infoValue}>{postOffice.terminalId}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}