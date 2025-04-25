import React from "react";
import styles from "../styles/EmployeeCard.module.css";

export const EmployeeCard = ({ employee, onClick, className, style }) => {
    return (
    <div className={`${styles.card} ${className}`} onClick={onClick} style={style}>
        <div className={styles.avatar}>
            {employee.employee.firstName.charAt(0)}{employee.employee.lastName.charAt(0)}
        </div>
        <div className={styles.content}>
            <h3 className={styles.name}>
                {employee.employee.firstName} {employee.employee.lastName}
            </h3>
            <p className={styles.position}>{employee.employee.position}</p>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{employee.employee.email}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Телефон:</span>
                    <span className={styles.detailValue}>{employee.employee.phoneNumber}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Місце:</span>
                    <span className={styles.detailValue}>
                        {employee.postOffice
                        ? `${employee.postOffice.name} – ${employee.postOffice.city}`
                        : employee.terminal
                        ? `${employee.terminal.name} – ${employee.terminal.city}`
                        : "Не призначено"}
                    </span>
                </div>
            </div>
        </div>
    </div>
    );
};