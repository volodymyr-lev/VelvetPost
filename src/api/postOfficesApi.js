import axios from "axios";
import {fromAddress} from "react-geocode";

export const getPostOffices = async ()=>{

    const token = localStorage.getItem("token");

    try{
        const responce = await axios.get("https://localhost:7047/api/PostOffices", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return responce.data;
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