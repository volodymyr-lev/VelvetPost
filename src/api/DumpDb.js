import axios from "axios";


export const DumpDb = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get("https://localhost:7047/api/DatabaseExport/export", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: "blob"
        });

        return response;
    } catch (error) {
        console.error("Error fetching dump database: ", error);
        throw error;
    }
}