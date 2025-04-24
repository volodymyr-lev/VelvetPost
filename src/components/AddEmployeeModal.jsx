
import React from "react";
import styles from "../styles/AddEmployeeModal.module.css";
import { createEmployee } from "../api/employeesApi";

export const AddEmployeeModal = ({setIsVisible, refresh })=>{
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        position: "",
        depId: "",
        depType: "postOffice",
        password: "",
        confirmPassword: "",
    });
    
    const [radioValue, setRadioValue] = React.useState("postOffice");
    
    // PARSE DEP ID TO NUMBER WHEN SUBMITTING FORM
    const handleAdd = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.position || !formData.depId || !formData.password || !formData.confirmPassword) {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Паролі не співпадають.");
            return;
        }
        try{
            const createE = async ()=>{
                const e = { ...formData, depId: Number(formData.depId) };
                await createEmployee(e);
                console.log("Створено.");
                await refresh();
                setIsVisible(false);
            }

            createE();
        } catch(error) {
            console.error("Помилка під час створення: ", error);
        }
    }
    return(
        <>    
            <div className={styles.back} onClick={() => setIsVisible(false)} />

            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.header}>Додати працівника</h2>
                    </div>

                    <p className={styles.depChooseHeader}>
                        Виберіть куди призначити працівника:
                    </p>

                    <div className={styles.depChoose}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="postOffice"
                                checked={radioValue === "postOffice"}
                                onChange={(e) => {
                                    setRadioValue(e.target.value)
                                    setFormData({ ...formData, depType: e.target.value });
                                }}
                            />              
                            Відділення
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="terminal"
                                checked={radioValue === "terminal"}
                                onChange={(e) => {
                                    setRadioValue(e.target.value)
                                    setFormData({ ...formData, depType: e.target.value });
                                }}
                            />
                            Термінал
                        </label>
                    </div>

                    <p className={styles.dataHeader}> 
                        Введіть дані працівника:
                    </p>

                    <div className={styles.modalContent}>
                        <div className={styles.dataForm}>
                            <div className={styles.dataFormName}>
                                <label className={styles.formLabel}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Ім'я"
                                    />
                                </label>

                                <label className={styles.formLabel}>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Прізвище"
                                    />
                                </label>
                            </div>

                            <div className={styles.dataFormEmailPhone}>
                                <label className={styles.formLabel}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Email"
                                    />
                                </label>

                                <label className={styles.formLabel}>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Номер телефону"
                                    />
                                </label>
                            </div>
                            

                            <div classNmae={styles.dataFormPosId}>
                            <label className={styles.formLabel}>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className={styles.inputField}
                                    placeholder="Посада"
                                />
                            </label>
                        
                           
                            <label className={styles.formLabel}>
                                <input
                                    type="text"
                                    name="depId"
                                    value={formData.depId}
                                    onChange={(e) => setFormData({ ...formData, depId: e.target.value })}
                                    className={styles.inputField}
                                    placeholder={radioValue === "postOffice" ? "ID відділення" : "ID термінала"}
                                />
                            </label>
                            </div>
                            
                            <div className={[styles.dataFormWide, styles.dataFormPassword].join(" ")}>
                                <label
                                    className={styles.formLabel}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Пароль"
                                    />
                                </label>
                            </div>

                            <div className={styles.dataFormWide}>
                                <label
                                    className={styles.formLabel}>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={styles.inputField}
                                        placeholder="Підтвердження паролю"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className={styles.modalActions}>
                        <button className={styles.saveButton} onClick={() => {
                            handleAdd();
                        }}>
                            Додати
                        </button>

                        <button
                            className={styles.cancelButton}
                            onClick={() => setIsVisible(false)}
                        >
                            Відміна
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}