

// POST Office employees

import axios from "axios";

export const getPotsOfficeEmpoyees = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get("https://localhost:7047/api/PostOfficeEmployees", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching post office employees: ", error);
        throw error;
    }
}




// Termial employees
export const getTerminalEmployees = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get("https://localhost:7047/api/TerminalEmployees", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching terminal employees: ", error);
        throw error;
    }
}



// Create new employee
export const createEmployee = async (employee) => {
    const token = localStorage.getItem("token");

    try {
        let response = null;
        if(employee.depType === "postOffice"){
            response = await axios.post("https://localhost:7047/api/PostOfficeEmployees", employee, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else if(employee.depType === "terminal") {
            response = await axios.post("https://localhost:7047/api/TerminalEmployees", employee, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            throw new Error("Invalid depType. Must be either 'postOffice' or 'terminal'.");
        }

        return response.data;
    } catch (error) {
        console.error("Error creating employee: ", error);
        throw error;
    }
}


// update employee
export const updateEmployee = async (id, formData) => {
    const token = localStorage.getItem("token");

    try {
        let response = null;
        if(formData.depType === "postOffice"){
            response = await axios.put(`https://localhost:7047/api/PostOfficeEmployees/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else if(formData.depType === "terminal") {
            response = await axios.put(`https://localhost:7047/api/TerminalEmployees/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            throw new Error("Invalid depType. Must be either 'postOffice' or 'terminal'.");
        }

        return response.data;
    } catch (error) {
        console.error("Error updating employee: ", error);
        throw error;
    }
}
    
export const deleteEmployee = async (id, depType) => {
    const token = localStorage.getItem("token");

    try {
        let response = null;
        if(depType === "postOffice"){
            response = await axios.delete(`https://localhost:7047/api/PostOfficeEmployees/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else if(depType === "terminal") {
            response = await axios.delete(`https://localhost:7047/api/TerminalEmployees/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            throw new Error("Invalid depType. Must be either 'postOffice' or 'terminal'.");
        }

        return response.data;
    } catch (error) {
        console.error("Error deleting employee: ", error);
        throw error;
    }
}




// PostOfficeEmployeeCreateShipmentWithParcel
export const createShipmentWithParcel = async (shipment) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post("https://localhost:7047/api/PostOfficeEmployees/CreateShipmentWithParcel", shipment, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating shipment with parcel: ", error);
        throw error;
    }
}