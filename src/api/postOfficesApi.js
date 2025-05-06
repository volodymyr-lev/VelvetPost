import axios from "axios";
import {fromAddress} from "react-geocode";

export const getPostOffices = async ()=>{

    const token = localStorage.getItem("token");

    try{
        const response = await axios.get("https://localhost:7047/api/PostOffices", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.error("Помилка під час отримання поштових відділень: ", error);
    }
}

export const fetchCoordinatesFromPostOffices = async (postOffices) =>{
    const results = await Promise.all(
        postOffices.map(async (postOffice) => {
            const fullAddress = `${postOffice.city}, ${postOffice.address}`;
            try{
                const responce = await fromAddress(fullAddress);
                const {lat, lng} = responce.results[0].geometry.location;
                return {
                    ...postOffice,
                    coordinates: { lat, lng }
                };

            } catch (error) {
                console.error(`Помилка геокодування: ${fullAddress}`, error);
                return null;
            }
        })
    )

    return results.filter(Boolean);
}

export const updatePostOffice = async (id, updated)=>{
    try{
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `https://localhost:7047/api/PostOffices/${id}`,
            updated,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data;
    } catch(error) {
        console.error("Помилка при оновленні: ", error);
        return null;
    }
}

export const deletePostOffice = async (id)=>{
    try{
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `https://localhost:7047/api/PostOffices/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data;
    } catch(error) {
        console.error("Помилка при видаленні: ", error);
        return null
    } 
}

export const createPostOffice = async (postOffice) =>{
    try{
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `https://localhost:7047/api/PostOffices/create`,
            postOffice,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data;
    } catch (error) {
        console.log("Помилка при створенні: ", error);
        return null;
    }
}

export const getPostOfficeById = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/PostOffices/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    }
    catch (error) {
        console.error("Error fetching post office by ID: ", error);
        throw error;
    }
}



export const getPostOfficeShipments = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/PostOffices/${id}/shipments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments for post office: ", error);
        throw error;
    }
}