import React, { useEffect, useState } from "react";
import styles from "../styles/Employees.module.css";
import { getPotsOfficeEmpoyees, getTerminalEmployees } from "../api/employeesApi";
import { EmployeeCard } from "../components/EmployeeCard";
import { AddEmployeeModal } from "../components/AddEmployeeModal";
import { updateEmployee, deleteEmployee } from "../api/employeesApi";

export default function Employees() {
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("postOfficesSearch");
    const [isVisible, setIsVisible] = useState(false);
    const [postOfficeEmployees, setPostOfficeEmployees] = useState([]);
    const [terminalEmployees, setTerminalEmployees] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [employeeChangeForm, setEmployeeChangeForm] = useState({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        position: "",
        depId: "",
        depType: selectedEmployee?.postOffice ? "postOffice" : "terminal",
    });

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
            (employee.terminal?.name && employee.terminal.name.toLowerCase().includes(searchLower)) ||
            (employee.postOffice?.city && employee.postOffice.city.toLowerCase().includes(searchLower)) ||
            (employee.terminal?.city && employee.terminal.city.toLowerCase().includes(searchLower)) 
        );
        
    }

    const displayEmployees = searchType === "postOfficesSearch" 
        ? filterEmployees(postOfficeEmployees)
        : filterEmployees(terminalEmployees);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSave = async () => {
        employeeChangeForm.depId = Number(employeeChangeForm.depId);
        employeeChangeForm.id = Number(employeeChangeForm.id);

        console.log("Saving employee: ", employeeChangeForm);

        try{
            await updateEmployee(employeeChangeForm.id, employeeChangeForm);
            console.log("Employee updated successfully.");
            await fetchEmployees();
        } catch (error) {
            console.error("Error updating employee: ", error);
        }
    }

    const handleDelete = async () => {
        employeeChangeForm.id = Number(employeeChangeForm.id);

        console.log("Deleting employee: ", employeeChangeForm);

        try{
            await deleteEmployee(employeeChangeForm.id, employeeChangeForm.depType);
            console.log("Employee deleted successfully.");
            await fetchEmployees();
        } catch (error) { 
            console.error("Error deleting employee: ", error);
        }
    }

    return (
        <div className={styles.page}>
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
                            {displayEmployees.map((employee, index) => (
                                <EmployeeCard 
                                    key={employee.employeeId} 
                                    employee={employee}
                                    onClick={() => {
                                        setSelectedEmployee(employee)
                                        setEmployeeChangeForm({
                                            id: employee.employee.id,
                                            firstName: employee.employee.firstName,
                                            lastName: employee.employee.lastName,
                                            email: employee.employee.email,
                                            phoneNumber: employee.employee.phoneNumber,
                                            position: employee.employee.position,
                                            depId: employee.postOffice?.id || employee.terminal?.id,
                                            depType: employee.postOffice ? "postOffice" : "terminal",
                                        });
                                    }}
                                    className={`${styles.cardAppear}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                />
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

            {selectedEmployee && (
                <div className={styles.employeeInfoContainer}>
                    <div className={styles.employeeInfoHeader}>
                        <h2 className={styles.employeeInfoTitle}>Редагувати працівника</h2>
                        <button className={styles.closeButton} onClick={() => setSelectedEmployee(null)}>
                            <ion-icon name="close"></ion-icon>
                        </button>
                    </div>

                    <div className={styles.employeeInfoContent}>
                        <label>Ім'я:</label>
                        <input
                            type="text"
                            value={employeeChangeForm.firstName}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    firstName: e.target.value,
                                })
                            }
                        />

                        <label>Прізвище:</label>
                        <input
                            type="text"
                            value={employeeChangeForm.lastName}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    lastName: e.target.value,
                                })
                            }
                        />

                        <label>Email:</label>
                        <input
                            type="email"
                            value={employeeChangeForm.email}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    email: e.target.value,
                                })

                            }
                        />

                        <label>Телефон:</label>
                        <input
                            type="text"
                            value={employeeChangeForm.phoneNumber}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    phoneNumber: e.target.value,
                                })
                            }
                        />

                        <label>Посада:</label>
                        <input
                            type="text"
                            value={employeeChangeForm.position}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    position: e.target.value,
                                })
                            }
                        />

                        <label>ID Відділення/Термінала:</label>
                        <input
                            type="text"
                            value={employeeChangeForm.depId}
                            onChange={(e) =>
                                setEmployeeChangeForm({
                                    ...employeeChangeForm,
                                    depId: e.target.value,
                                })
                            }
                        />

                        <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
                            <button className={styles.saveButton} onClick={handleSave}>
                                💾 Зберегти
                            </button>
                            <button className={styles.deleteButton} onClick={handleDelete}>
                                🗑️ Видалити
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}