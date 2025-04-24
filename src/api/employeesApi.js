

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

