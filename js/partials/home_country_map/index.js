/**
 * entry point for the country map on the home page partial bundle
 */
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';


var positron = L.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}
);

var baseLayers = {
    'CartoDB Positron': positron
};


let map = L.map('home_country_map',  {
    touchZoom: false,
    scrollWheelZoom: false,
    attributionControl: false
}).setView([mapContext.latitude, mapContext.longitude], mapContext.zoom);

let overlayMaps = {};

mapContext.markers.forEach(
    markerSet => {
        let icon = L.divIcon({
            className: markerSet.icon.className || 'map-marker',
            iconSize: markerSet.icon.iconSize || [20, 20]
        });
        let markers = markerSet.items.map(
            item => L.marker(
                [item.latitude, item.longitude],
                {icon: icon}
            ).addTo(map).bindPopup(item.popup)
        );
        overlayMaps[markerSet.label] = L.layerGroup(markers).addTo(map);
    }
);
L.control.layers({}, overlayMaps).addTo(map);
positron.addTo(map);