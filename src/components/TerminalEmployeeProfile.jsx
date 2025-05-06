import React, { useEffect } from "react";
import styles from "../styles/TerminalEmployeeProfile.module.css";
import { getTerminalById } from "../api/terminalsApi";
import PostOfficeSVG from "../assets/postOffice.svg";

export default function TerminalEmployeeProfile({profile}){
    const [terminal, setTerminal] = React.useState(null);
    
    const getTerminalInfo = async () => {
        try{
            const t = await getTerminalById(profile.terminalId);
            setTerminal(t);
            console.log("Terminal info: ", t);
        } catch(error) {
            console.error("Помилка при отриманні інформації про термінал:", error);
        }
    }
    
    useEffect(() => {
        getTerminalInfo();
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
                <h2 className="profile-container-title">Ваш термінал</h2>
                <div className={styles.postOfficeContainer}>
                    <div className={styles.postOfficeImgContainer}>
                        <img src={PostOfficeSVG} alt="Post Office" className={styles.postOfficeImage}/>
                    </div>
                    
                    {terminal && (
                        <div className={styles.postOfficeInfo}>
                            <h3 className={styles.postOfficeName}>{terminal.name}</h3>
                            
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>ID терміналу:</span>
                                    <span className={styles.infoValue}>{terminal.id}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Місто:</span>
                                    <span className={styles.infoValue}>{terminal.city}</span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Адреса:</span>
                                    <span className={styles.infoValue}>{terminal.address}</span>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Тип:</span>
                                    <span className={styles.infoValue}>{terminal.type}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}