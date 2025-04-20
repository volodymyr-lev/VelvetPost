import L from 'leaflet';
import VPMarker from "../assets/VPMarker.svg"

const MapMarker = new L.Icon({
    iconUrl: VPMarker,
    iconAnchor: [25,50],
    popupAnchor: [0,-50],
    iconSize: [50, 50],
});

export {MapMarker};