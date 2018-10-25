import React from 'react';
import L from "leaflet";
import { Map, Marker, TileLayer } from 'react-leaflet';

const MapComponent = (props) => {
    const showMarker = (position, url, id) => {
        const myIcon = L.divIcon({html: `<img src='${url}' class='map-thumbnail' />`}); //create new marker with dog photo instead of icon
        return (
            <Marker position={position} icon={myIcon} key={id}>
            </Marker>
        );
    }

    return (
        <Map center={[25, -30.09]} zoom={1} > 
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />          
        { props.markers.map((marker) => { //loop through markers and check if they have latitudes
            if( marker.latitude !== 0 ){
                return showMarker([marker.latitude, marker.longitude], marker.url, marker.id);
            } else { 
                return false; 
            }
        }) }                   
        </Map>
    );

}

export default MapComponent;