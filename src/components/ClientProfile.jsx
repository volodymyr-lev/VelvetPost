
import React from "react";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { MapMarker } from "./MapMarker";
import "../styles/ClientProfile.css"

const ukraineBounds = [
    [44.386, 22.137],
    [52.379, 40.265]
]

const accessToken = import.meta.env.VITE_JAWG_ACCESS_TOKEN;

export default function ClientProfile({profile, postOffices}) {
    return (
        <>
            <div className="profile-container">
                <h2 className="profile-container-title">Ваші дані</h2>
                <div>
                    <p className="profile-container-text">
                        Вас звати: <span className="profile-container-info">{profile.firstName} {profile.lastName}</span>
                    </p>
                    <p className="profile-container-text">
                        Ви з міста: <span className="profile-container-info">{profile.city}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваша адреса: <span className="profile-container-info">{profile.address}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш номер телефону: <span className="profile-container-info">{profile.phone}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш email: <span className="profile-container-info">{profile.email}</span>
                    </p>
                    <p className="profile-container-text">
                        Ваш ID в нашій системі: <span className="profile-container-info">{profile.id}</span>
                    </p>
                </div>
            </div>

            <div className="map-container">
                <h2 className="profile-container-title">Карта наших відділень</h2>
                <div className="map-container-map">
                    <MapContainer 
                        center={[50.4501, 30.5234]} 
                        zoom={6}
                        minZoom={6}
                        maxZoom={18}
                        maxBounds={ukraineBounds} 
                        zoomControl={false}
                    >
                        <TileLayer
                            url={`https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${accessToken}`}
                            attribution='&copy; <a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {postOffices.map((postOffice, index)=>{
                            if(postOffice.coordinates){
                                return (
                                    <Marker
                                        key={index}
                                        position={[postOffice.coordinates.lat, postOffice.coordinates.lng]}
                                        icon={MapMarker}
                                    >
                                        <Popup className="custom-popup">
                                            <strong>{postOffice.city}</strong><br />
                                            <p>{postOffice.name}</p> 
                                            <p>{postOffice.address}</p>
                                        </Popup>

                                    </Marker>
                                )
                            }

                            return null;
                        })}
                    </MapContainer>
                </div>
            </div>
        </>
    )
}