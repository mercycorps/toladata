/**
 * entry point for the country map on the home page partial bundle
 */
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import * as topojson from 'topojson-client';
import bordersjson from '../data/mc_country_borders.topojson';

//const bordersjson = require('../data/mc_country_borders.topojson');



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

function style(feat, i) {
    var styling = {}
    if (feat.properties.ISO2 == mapContext.code) {
        styling.fillColor = 'blue';
        styling.fillOpacity = .2;
        styling.color = 'blue';
        styling.opacity = .6;
    } else {
        styling.color = 'gray';
        styling.opacity = .6;
        styling.fillColor = '#E3E3E3';
        styling.fillOpacity = .4;
    }
    //console.log(feat.properties.ISO2);
    //console.log(mapContext.userCountryCodes);
    styling.weight = 1;
    return styling;
}

function highlightFeature(e) {
    let layer = e.target;
    let styling = style(layer.feature);
    styling.fillOpacity = styling.fillOpacity * 2;
    styling.opacity = 1;
    layer.setStyle(styling);
}

function resetHighlight(e) {
    let layer = e.target;
    layer.setStyle(style(layer.feature));
}

function zoomToFeature(e) {
    if (e.target.feature.properties.ISO2 == mapContext.code) {
        // nothing should happen here I think?
    } else if (mapContext.userCountryCodes[e.target.feature.properties.ISO2]) {
        window.location.href = mapContext.userCountryCodes[e.target.feature.properties.ISO2];
    } else {
        // nothing should happen here either I guess
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

let geoborders = topojson.feature(bordersjson, bordersjson.objects.world_borders_output);

let geojson = L.geoJson(geoborders, {style: style, onEachFeature: onEachFeature}).addTo(map);


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