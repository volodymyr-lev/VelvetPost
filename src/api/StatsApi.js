import axios from "axios";

export const getStatsByPostOfficeId = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Stats/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching stats by Post Office ID: ", error);
        throw error;
    }
}