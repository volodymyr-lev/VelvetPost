import { useState, useEffect } from "react";
import styles from "../styles/ClientCreateShipment.module.css";
import { getPostOffices } from "../api/postOfficesApi";
import { createShipment, getClientByPhoneNumber } from "../api/ClientsApi";
import { useNavigate } from "react-router-dom";

export default function ClientCreateShipment() {
    // State for form data
    const [formData, setFormData] = useState({
        fromCity: "",
        fromOffice: "",
        toCity: "",
        toOffice: "",
        recipientPhone: "",
    });

    // State for displaying retrieved data
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("profile"))
    );
    const [recipient, setRecipient] = useState(null);
    const [errors, setErrors] = useState({});
    const [postOffices, setPostOffices] = useState([]);
    const [cities, setCities] = useState([]);
    const [offices, setOffices] = useState([]);

    const navigate = useNavigate();

    const fetchPostOffices = async () => {
        const data = await getPostOffices();
        setPostOffices(data);

        const cityList = [];
        const officeList = {};
        data.forEach((office) => {
            if (!cityList.includes(office.city)) {
                cityList.push(office.city);
            }
            if (!officeList[office.city]) {
                officeList[office.city] = [];
            }

            officeList[office.city].push({
                id: office.id,
                address: `${office.name}, ${office.address}`
            });
        });

        setCities(cityList.sort());  
        setOffices(officeList);

        console.log("Post offices:", officeList);
    }


    useEffect(() => {
        try{
            fetchPostOffices();
        } catch(error) {
            console.error("Помилка при отриманні поштових відділень:", error);
        }
    },[]);


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));

        if (name === "fromCity") {
        setFormData(prev => ({ ...prev, fromOffice: "" }));
        } else if (name === "toCity") {
        setFormData(prev => ({ ...prev, toOffice: "" }));
        }
    };

    const fetchRecipient = async () => {
        if (formData.recipientPhone.length < 10) {
            setErrors(prev => ({ ...prev, recipientPhone: "Введіть коректний номер телефону" }));
            setRecipient(null);
            return;
        }


        try{
            const clientByPhone = await getClientByPhoneNumber(formData.recipientPhone);
            setRecipient(clientByPhone);
            setErrors(prev => ({ ...prev, recipientPhone: null }));
        } catch(error) {
            setErrors(prev => ({ ...prev, recipientPhone: "Користувача не знайдено" }));
        }
    };

    // Submit form handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!formData.fromCity) newErrors.fromCity = "Оберіть місто відправлення";
        if (!formData.fromOffice) newErrors.fromOffice = "Оберіть відділення відправлення";
        if (!formData.toCity) newErrors.toCity = "Оберіть місто отримання";
        if (!formData.toOffice) newErrors.toOffice = "Оберіть відділення отримання";
        if (!recipient) newErrors.recipientPhone = "Оберіть отримувача";
        
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        try{
            console.log(currentUser);
            console.log(recipient);

            const shipmentData = {
                senderId: Number(currentUser.id),
                receiverId: Number(recipient.id),
                fromPostOfficeId: Number(formData.fromOffice),
                toPostOfficeId: Number(formData.toOffice),
            };

            const result = await createShipment(shipmentData);
            console.log("Відправлення створено:", result);

            navigate("/client-my-shipments");
        } catch(error) {
            console.error("Помилка при створенні відправлення:", error);
        }
    };

    return (
        <div className={styles.container}>
        <div className={styles.card}>
            <div className={styles.cardHeader}>
            <h2>Створити відправлення</h2>
            </div>

            <div className={styles.cardBody}>
            <form onSubmit={handleSubmit}>
                {/* Sender information */}
                <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Відправник</h3>
                <div className={styles.infoCard}>
                    <p className={styles.userName}>{currentUser.firstName} {currentUser.lastName}</p>
                    <p className={styles.userPhone}>{currentUser.phone}</p>
                </div>
                </div>
                
                {/* Location selection */}
                <div className={styles.locationGrid}>
                {/* From location */}
                <div>
                    <h3 className={styles.sectionTitle}>Звідки</h3>
                    <div className={styles.inputGroup}>
                    <div>
                        <label className={styles.inputLabel}>Місто</label>
                        <select
                        name="fromCity"
                        value={formData.fromCity}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.fromCity ? styles.error : ''}`}
                        >
                        <option value="">Оберіть місто</option>
                        {cities.map(city => (
                            <option key={`from-${city}`} value={city}>{city}</option>
                        ))}
                        </select>
                        {errors.fromCity && <p className={styles.errorText}>{errors.fromCity}</p>}
                    </div>
                    
                    <div>
                        <label className={styles.inputLabel}>Відділення</label>
                        <select
                        name="fromOffice"
                        value={formData.fromOffice}
                        onChange={handleChange}
                        disabled={!formData.fromCity}
                        className={`${styles.select} ${errors.fromOffice ? styles.error : ''} ${!formData.fromCity ? styles.disabled : ''}`}
                        >
                        <option value="">Оберіть відділення</option>
                        {formData.fromCity && offices[formData.fromCity].map(office => (
                            <option key={`from-office-${office.id}`} value={office.id}>
                            {office.address}
                            </option>
                        ))}
                        </select>
                        {errors.fromOffice && <p className={styles.errorText}>{errors.fromOffice}</p>}
                    </div>
                    </div>
                </div>
                
                {/* To location */}
                <div>
                    <h3 className={styles.sectionTitle}>Куди</h3>
                    <div className={styles.inputGroup}>
                    <div>
                        <label className={styles.inputLabel}>Місто</label>
                        <select
                        name="toCity"
                        value={formData.toCity}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.toCity ? styles.error : ''}`}
                        >
                        <option value="">Оберіть місто</option>
                        {cities.map(city => (
                            <option key={`to-${city}`} value={city}>{city}</option>
                        ))}
                        </select>
                        {errors.toCity && <p className={styles.errorText}>{errors.toCity}</p>}
                    </div>
                    
                    <div>
                        <label className={styles.inputLabel}>Відділення</label>
                        <select
                        name="toOffice"
                        value={formData.toOffice}
                        onChange={handleChange}
                        disabled={!formData.toCity}
                        className={`${styles.select} ${errors.toOffice ? styles.error : ''} ${!formData.toCity ? styles.disabled : ''}`}
                        >
                        <option value="">Оберіть відділення</option>
                        {formData.toCity && offices[formData.toCity].map(office => (
                            <option key={`to-office-${office.id}`} value={office.id}>
                            {office.address}
                            </option>
                        ))}
                        </select>
                        {errors.toOffice && <p className={styles.errorText}>{errors.toOffice}</p>}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Recipient information */}
                <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Отримувач</h3>
                <div className={styles.searchBox}>
                    <div className={styles.searchField}>
                    <label className={styles.inputLabel}>Номер телефону</label>
                    <input
                        type="text"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleChange}
                        placeholder="+380XXXXXXXXX"
                        className={`${styles.input} ${errors.recipientPhone ? styles.error : ''}`}
                    />
                    {errors.recipientPhone && <p className={styles.errorText}>{errors.recipientPhone}</p>}
                    </div>
                    <button
                    type="button"
                    onClick={fetchRecipient}
                    className={styles.actionButton}
                    >
                    Знайти
                    </button>
                </div>
                
                {recipient && (
                    <div className={styles.infoCard}>
                    <p className={styles.userName}>{recipient.firstName} {recipient.lastName}</p>
                    <p className={styles.userPhone}>{recipient.phoneNumber}</p>
                    </div>
                )}
                </div>
                
                {/* Weight and price calculation */}
                <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Розрахунок вартості</h3>
                <div className={styles.searchBox}>
                    <h3>Розрахунок вартості виконується у відділенні залежно від ваги посилки.</h3>  
                </div>
                </div>
                
                {/* Submit button */}
                <div className={styles.formFooter}>
                <button
                    type="submit"
                    className={styles.submitButton}
                >
                    Створити відправлення
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}