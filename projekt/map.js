    
window.onload = function() {
        // WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center : [47.654, 13.370],
            zoom : 8
        });

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        // Punkte des Stadtspaziergangs als verschiedenfarbige Marker mit Popup hinzufügen
 var iconByCategory = {
            1: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
            2: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
        };
        // Punkte des Stadtspaziergangs als Marker mit Popup hinzufügen
        var punkteSpaziergang = L.geoJSON(window.spotMarker, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        shadowUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-shadow.png',
                        iconUrl: iconByCategory[feature.properties.KATEGORIE]
                    })
                });
            }
        }).bindPopup(function(layer) {
			var note = '<h3>' + layer.feature.properties.NAME + '</h3>';
			note += '<h4>' + layer.feature.properties.BEMERKUNG + '</h4>';
			note += '<h5>' + "Object ID: " + layer.feature.properties.OBJECTID + '</h5>';
			note += '<h5>' + "Kategorie: " + layer.feature.properties.KATEGORIE + '</h5>';
            return note;
					
        }).addTo(map);

        // Ausschnitt auf Punkte des Stadtspaziergangs setzen
        // map.fitBounds(punkteSpaziergang.getBounds());

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }).addTo(map);
};