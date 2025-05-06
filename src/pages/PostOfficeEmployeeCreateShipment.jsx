import { useState, useEffect } from "react";
import styles from "../styles/PostOfficeEmployeeCreateShipment.module.css";
import { getPostOffices } from "../api/postOfficesApi";
import { createShipment, getClientByPhoneNumber } from "../api/ClientsApi";
import { useNavigate } from "react-router-dom";
import { setDefaults } from "react-geocode";
import { createShipmentWithParcel } from "../api/employeesApi";

export default function PostOfficeEmployeeCreateShipment() {
    // State for form data
    const [formData, setFormData] = useState({
        fromCity: "",
        fromOffice: "",
        toCity: "",
        toOffice: "",
        recipientPhone: "",
        senderPhone: "",
        weight: 0,
        type: "",
        price: 0
    });

    // State for displaying retrieved data
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("profile"))
    );
    const [sender, setSender] = useState(null);
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
            [name]: name === "weight" ? Number(value) : value
        }));

        if (name === "fromCity") {
            setFormData(prev => ({ ...prev, fromOffice: "" }));
        } else if (name === "toCity") {
            setFormData(prev => ({ ...prev, toOffice: "" }));
        }
    };

    const fetchSender = async () => {
        if (formData.senderPhone.length < 10) {
            setErrors(prev => ({ ...prev, recipientPhone: "Введіть коректний номер телефону" }));
            setSender(null);
            return;
        }

        try{
            const clientByPhone = await getClientByPhoneNumber(formData.senderPhone);
            setSender(clientByPhone);
            setErrors(prev => ({ ...prev, senderPhone: null }));
        }
        catch(error) {
            setErrors(prev => ({ ...prev, senderPhone: "Користувача не знайдено" }));
        }
    }

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
        const newErrors = {};
        if (!formData.fromCity) newErrors.fromCity = "Оберіть місто відправлення";
        if (!formData.fromOffice) newErrors.fromOffice = "Оберіть відділення відправлення";
        if (!formData.toCity) newErrors.toCity = "Оберіть місто отримання";
        if (!formData.toOffice) newErrors.toOffice = "Оберіть відділення отримання";
        if (!formData.weight) newErrors.toOffice = "Задайте вагу";
        if (!formData.type) newErrors.toOffice = "Оберіть тип";
        if (!recipient) newErrors.recipientPhone = "Оберіть отримувача";
        if (!sender) newErrors.senderPhone = "Оберіть відправника";
        
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        try{
            await setFormData({
                ...formData,
                fromOffice: Number(formData.fromOffice),
                toOffice: Number(formData.toOffice),
                weight: Number(formData.weight),
                price: (Number(formData.weight) < 10) ? 75 : Number(formData.weight) * 10,
            })

            const shipmentData = {
                fromCity: formData.fromCity,
                fromOffice: Number(formData.fromOffice),
                toCity: formData.toCity,
                toOffice: Number(formData.toOffice),
                recipientPhone: formData.recipientPhone,
                senderPhone: formData.senderPhone,
                weight: Number(formData.weight),
                type: formData.type,
                price: (Number(formData.weight) < 10) ? 75 : Number(formData.weight) * 10,
            };

            console.log("Form data:", shipmentData);
            const result = await createShipmentWithParcel(shipmentData);
            console.log("Відправлення створено:", result);
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
                    <h3 className={styles.sectionTitle}>Отримувач</h3>
                    <div className={styles.searchBox}>
                        <div className={styles.searchField}>
                            <label className={styles.inputLabel}>Номер телефону</label>
                            <input
                                type="text"
                                name="senderPhone"
                                value={formData.senderPhone}
                                onChange={handleChange}
                                placeholder="+380XXXXXXXXX"
                                className={`${styles.input} ${errors.senderPhone ? styles.error : ''}`}
                            />
                            {errors.senderPhone && <p className={styles.errorText}>{errors.senderPhone}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={fetchSender}
                            className={styles.actionButton}
                        >
                        Знайти
                        </button>
                    </div>
                    
                    {sender && (
                        <div className={styles.infoCard}>
                        <p className={styles.userName}>{sender.firstName} {sender.lastName}</p>
                        <p className={styles.userPhone}>{sender.phoneNumber}</p>
                        </div>
                    )}

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
                        <h3>Вартість: {formData.weight < 10 ? 75: formData.weight*10} грн.</h3> 
                    </div>
                    </div>
                    
                    {/* Submit button */}
                    <div className={styles.formFooter}>
                    </div>
                </form>
                </div>
            </div>

            <div className={styles.parcelCard}>
                <div className={styles.parcelCardHeader}>
                <h2>Посилка</h2>
                </div>

                <div className={styles.parcelCardContent}>
                    {/* parcel weigth and type inputs*/}
                    <div className={styles.parcelInputGroup}>
                        <label className={styles.inputLabel}>Вага</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="Введіть вагу"
                            className={`${styles.input} ${errors.weight ? styles.error : ''}`}
                        />
                        {errors.weight && <p className={styles.errorText}>{errors.weight}</p>}

                        <label className={styles.inputLabel}>Тип</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="" disabled>Виберіть тип</option>
                            <option value="Посилка">Посилка</option>
                            <option value="Лист">Лист</option>
                            <option value="Секограма">Секограма</option>
                            <option value="Бандероль">Бандероль</option>
                        </select>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button className={styles.createButton} onClick={()=>{handleSubmit()}}>
                            Створити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}