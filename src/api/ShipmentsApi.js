import axios from "axios";

export const getShipmentById = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Shipments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching shipment by ID: ", error);
        throw error;
    }

}


export const editShipment = async (id, updated) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.put(`https://localhost:7047/api/Shipments/${id}`, updated, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error updating shipment: ", error);
        throw error;
    }
}