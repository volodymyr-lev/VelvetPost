import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { getPostOffices, fetchCoordinatesFromPostOffices } from "../api/postOfficesApi";
import { setKey, setLanguage, setRegion} from "react-geocode";
import "leaflet/dist/leaflet.css";
import "../styles/Profile.css"
import ClientProfile from "../components/ClientProfile";
import AdminProfile from "../components/AdminProfile";
import PostOfficeEmployeeProfile from "../components/PostOfficeEmployeeProfile";
import TerminalEmployeeProfile from "../components/TerminalEmployeeProfile";

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
//Geocode conf
setKey(googleApiKey);
setLanguage("uk");
setRegion("ua");



export default function Profile(){
    const [postOffices, setPostOffices] = useState([]);

    const profile = JSON.parse(localStorage.getItem("profile"));
    console.log(profile);

    useEffect(() => {
        const map = document.querySelector('.leaflet-container')
        if(map === null) return;
        if (map) {
            map.addEventListener('load', () => {
                map.style.transition = "all 0.5s ease";
            });
        }


        const fetchPostOfficesWithCords = async () => {
            try{
                const po = await getPostOffices(); 
                const officesWithCoords = await fetchCoordinatesFromPostOffices(po);
                setPostOffices(officesWithCoords);
            } catch(error) {
                console.error("Помилка при отриманні поштових відділень:", error);
            }
        }

        fetchPostOfficesWithCords();
    }, []);

    return(
        <div className="container">
            {localStorage.getItem("role")==="Client" && (
                <ClientProfile profile={profile} postOffices={postOffices}/>
            )}
            {localStorage.getItem("role")==="Admin" && (
                <AdminProfile profile={profile}/>
            )}
            {localStorage.getItem("role")==="PostOfficeEmployee" && (
                <PostOfficeEmployeeProfile profile={profile}/>
            )}
            {localStorage.getItem("role")==="TerminalEmployee" && (
                <TerminalEmployeeProfile profile={profile}/>
            )}
        </div>
    )
}