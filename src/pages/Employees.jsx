import React, { useEffect, useState } from "react";
import styles from "../styles/Employees.module.css";
import { getPotsOfficeEmpoyees, getTerminalEmployees } from "../api/employeesApi";
import { EmployeeCard } from "../components/EmployeeCard";
import { AddEmployeeModal } from "../components/AddEmployeeModal";

export default function Employees() {
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("postOfficesSearch");
    const [isVisible, setIsVisible] = useState(false);
    const [postOfficeEmployees, setPostOfficeEmployees] = useState([]);
    const [terminalEmployees, setTerminalEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            const poE = await getPotsOfficeEmpoyees();
            const tE = await getTerminalEmployees();

            console.log("Post Office Employees: ", poE);
            console.log("Terminal Employees: ", tE);

            setPostOfficeEmployees(poE);
            setTerminalEmployees(tE);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const filterEmployees = (employees) =>{
        if (!searchValue.trim()) return employees;

        const searchLower = searchValue.toLowerCase();
        return employees.filter(employee =>
            employee.employee?.firstName?.toLowerCase().includes(searchLower) ||
            employee.employee?.lastName?.toLowerCase().includes(searchLower) ||
            employee.employee?.email?.toLowerCase().includes(searchLower) ||
            (employee.employee?.position && employee.employee.position.toLowerCase().includes(searchLower)) ||
            (employee.postOffice?.name && employee.postOffice.name.toLowerCase().includes(searchLower)) ||
            (employee.terminal?.name && employee.terminal.name.toLowerCase().includes(searchLower))
        );
        
    }

    const displayEmployees = searchType === "postOfficesSearch" 
        ? filterEmployees(postOfficeEmployees)
        : filterEmployees(terminalEmployees);

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.headerTopRow}>
                    <h1 className={styles.headerTitle}>Працівники</h1>
                    <button onClick={()=>{setIsVisible(true)}} className={styles.addButton}>📋Додати</button>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="🔍 Пошук працівника..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className={styles.searchTypeContainer}>
                    <span className={styles.headerText}>Виберіть тип пошуку:</span>

                    <div className={styles.radioButtonsAndTexts}>
                        <div className={styles.radioButtonOption}>
                            <label className={styles.radioButtonText}>
                                <input
                                    type="radio"
                                    name="searchType"
                                    value="postOfficesSearch"
                                    checked={searchType === "postOfficesSearch"}
                                    onChange={(e) => setSearchType(e.target.value)}
                                />
                                Поштові відділення     
                            </label>
                        </div>

                        <div className={styles.radioButtonOption}>
                            <label className={styles.radioButtonText}>
                                <input
                                    type="radio"
                                    name="searchType"
                                    value="terminalsSearch"
                                    checked={searchType === "terminalsSearch"}
                                    onChange={(e) => setSearchType(e.target.value)}
                                />
                                Термінали
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentContainer}>
                {displayEmployees.length > 0 ? (
                    <div className={styles.employeeGrid}>
                        {displayEmployees.map((employee) => (
                            <EmployeeCard key={employee.id} employee={employee} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.noResults}>
                        {searchValue ? (
                            <p>Немає працівників, які відповідають пошуковому запиту "{searchValue}"</p>
                        ) : (
                            <p>Немає доступних працівників</p>
                        )}
                    </div>
                )}
            </div>
            
            {isVisible && (
                <AddEmployeeModal setIsVisible={setIsVisible} refresh={fetchEmployees}/>
            )}
        </div>
    );
}