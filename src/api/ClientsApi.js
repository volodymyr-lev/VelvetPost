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


export const getClientByPhoneNumber = async (phoneNumber) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Clients/by-phone/${phoneNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching client by phone number: ", error);
        throw error;
    }
}


export const createShipment = async (shipment) => {
    const token = localStorage.getItem("token");
    
    try {
        const response = await axios.post(`https://localhost:7047/api/Clients/client-create-shipment`, shipment, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating shipment: ", error);
        throw error;
    }
}
