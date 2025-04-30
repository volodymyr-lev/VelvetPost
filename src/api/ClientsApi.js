import axios from "axios";

export const getClientByEmail = async (email) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Clients/by-email/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching client by email: ", error);
        throw error;
    }
}

export const getClientById = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching client by ID: ", error);
        throw error;
    }
}