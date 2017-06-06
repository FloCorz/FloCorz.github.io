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
            center : [47.049282, 12.577037],
            zoom : 11
        });

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

		// Höhenprofil control hinzufügen
        var profileControl = L.control.elevation({
            position : 'bottomright',
            theme : 'purple-theme'
        });
        profileControl.addTo(map);
		
		var gpxTrackGroup = L.featureGroup().addTo(map);
						
		//Gruppe für die farbige Linie nach Steigung vorbereiten
		var coloredLineGroup = L.featureGroup().addTo(map);
	
				
		// Funktion zum Laden eines Tracks
		function loadTrack(gpxFile) {
		// Etappen Info anzeigen
		console.log("etappeninfo:", window.ETAPPENINFO);
		console.log("info:", window.ETAPPENINFO[gpxFile]);
		console.log("Kurztext:", window.ETAPPENINFO[gpxFile].Kurztext);
		document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[gpxFile].Kurztext;
		document.getElementById("Streckenbeschreibung").innerHTML = window.ETAPPENINFO[gpxFile].Streckenbeschreibung;
		
		gpxTrackGroup.clearLayers();
		coloredLineGroup.clearLayers();
		
					// GPX Track laden
					gpxEtappeO6 = omnivore.gpx('data/'+ gpxFile).addTo(gpxTrackGroup);

					// nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
					gpxEtappeO6.on('ready', function () {
						// Popup hinzufügen
						var markup = '<h3> Adlerweg-Etappe O6: Matrei in Osttirol - Sudetendeutsche Hütte </h3>';
						markup += '<p>Ausgehend vom Matreier Tauernhaus verläuft diese Etappe am Osttiroler Adlerweg bis zur Sudetendeutschen Hütte.</p>'
						markup += '<li>Ausgangspunkt: Matreier Tauernhaus</li>';
						markup += '<li>Endpunkt: Sudetendeutsche Hütte</li>';
						markup += '<li>Höhenmeter bergauf: 1250</li>';
						markup += '<li>Höhenmeter bergab: 100</li>';
						markup += '<li>Höchster Punkt: 2656</li>';
						markup += '<li>Schwierigkeitsgrad: mittelschwierig</li>';
						markup += '<li>Streckenlänge (in km): 8</li>';
						markup += '<li>Gehzeit (in Stunden): 4</li>';
						markup += '<li>Einkehrmöglichkeiten: Steiner Alm & Sudetendeutsche Hütte</li>';
						markup += '<li><a href="http://www.tirol.at/reisefuehrer/sport/wandern/wandertouren/a-adlerweg-etappe-o6-matrei-in-osttirol-sudetendeutsche-huette">Weitere Informationen</a></li>';
						gpxEtappeO6.bindPopup(markup, { maxWidth : 450 });

						// Ausschnitt setzen
						map.fitBounds(gpxEtappeO6.getBounds());
						
						// Höhenprofil erzeugen
						profileControl.clear();
						gpxEtappeO6.eachLayer(function(layer) {
							profileControl.addData(layer.feature);
				
						//var pts =
						//console.log(layer.feature.geometry.coordinates)
						var pts = layer.feature.geometry.coordinates;
						
						for (var i=1; i < pts.length; i += 1) {		//i ++ geht eins nach vorne; i += x geht x nach vorne
						//console.log(pts[i]);	//aktueller Punkt
						//console.log(pts[i-1]);	//vorheriger Punkt
						
						//Entfernung bestimmen
						var dist = map.distance(
							[ pts [i][1],pts[i][0] ],
							[ pts [i-1][1],pts[i-1][0] ]
						).toFixed(0);
						//console.log(dist);
						
						var delta = pts [i][2] - pts [i-1][2];
						console.log(delta, "Höhenmeter auf", dist,"m Strecke");
						
						var rad = Math.atan(delta/dist);
						var deg = (rad*(180/Math.PI)).toFixed(1);
						//console.log(deg);
						
						//var rot = ["#ab2524", "#a02128", "#a1232b", "#8d1d2c", "#701f29", "#5e2028"];
						//var gruen = ["#42EB00", "#38C400", "#288F00", "#195700", "#0A2400"];
						//colorbrewer2.org
						
						//rot http://colorbrewer2.org/?type=sequential&scheme=YlOrRd&n=6
						//['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']
						
						//grün http://colorbrewer2.org/?type=sequential&scheme=BuGn&n=6
						//['#edf8fb','#ccece6','#99d8c9','#66c2a4','#2ca25f','#006d2c']
						
						var farbe;
						switch(true) { // checks if condition is true, not for certain values of a variable
						case (deg >= 20) :  farbe = "#bd0026"; break;
						case (deg >= 15) :  farbe = "#f03b20"; break;
						case (deg >= 10) :  farbe = "#fd8d3c"; break;
						case (deg >= 5) :  farbe = "#feb24c"; break;
						case (deg >= 1) :  farbe = "#fed976"; break;
						case (deg >= -1) :  farbe = "yellow"; break;
						case (deg >= -5) :  farbe = "#d9f0a3"; break;
						case (deg >=-10) :  farbe = "#addd8e"; break;
						case (deg >=-15) :  farbe = "#78c679"; break;
						case (deg >= -20) :  farbe = "#31a354"; break;
						case (deg < -20) :  farbe = "#006837"; break;
						}
						//console.log(deg,farbe);
						
						//Linie zeichnen
						var pointA = new L.LatLng(pts [i][1],pts[i][0]);
						var pointB = new L.LatLng(pts [i-1][1],pts[i-1][0]);
						var pointList = [pointA, pointB];
		   
						var firstpolyline = new L.Polyline(pointList, {
							color: farbe,
							weight: 6,
							opacity: 1,
							smoothFactor: 1

						});
			
				firstpolyline.addTo(coloredLineGroup);
						
						};
					});
				});
				
		};		

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        },{
			"Steigungen" : coloredLineGroup
        }).addTo(map);
		
		//zwischen einzelnen Etappen wählen
		var etappenSelektor = document.getElementById("etappen");
		//console.log("Selector", etappenSelektor);
		etappenSelektor.onchange = function(evt) {
		console.log("Change event:", evt);
		console.log("GPX Track laden: ", etappenSelektor[etappenSelektor.selectedIndex].value);
		loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		};
		loadTrack("AdlerwegEtappe01.gpx");

        // leaflet-hash aktivieren
        var hash = new L.Hash(map);

		//Icon von mapicons.mapsmarker.com herunterladen
		var huts = [
				L.marker([47.030306, 12.548986], {title:"Steiner Alm", icon: L.icon ({iconUrl: 'icons/hut.png', iconAnchor:[14, 30]}) }),  					//Steiner Alm 			47.030306, 12.548986
				L.marker([47.049335, 12.576691], {title:"Sudetendeutsche Hütte", icon: L.icon ({iconUrl: 'icons/hut.png', iconAnchor:[14, 30]}) }),  					//Sudetendeutsche Hütte 	47.049335, 12.576691
			];
			
		var hutsLayer = L.featureGroup();
		for (var i=0; i<huts.length; i++) {
			hutsLayer.addLayer(huts[i]);
		}
		// hutsLayer.addTo(map);
		map.on("zoomend", function() {
			if (map.getZoom() >= 13) {
				map.addLayer(hutsLayer);
			} else {
				map.removeLayer(hutsLayer);
				}
		});
	
		var StartZiel = [
					L.marker([47.01048879589804, 12.539693778463448], {title:"Start", icon: L.icon ({iconUrl: 'icons/start.png', iconAnchor:[14, 30]}) }), 							//Start
					L.marker([47.04933874772476, 12.576509786193457], {title:"Ziel", icon: L.icon ({iconUrl: 'icons/finish.png', iconAnchor:[14, 30]}) }), 							//Zeil
			];
		
		var StartZielLayer = L.featureGroup();
		for (var i=0; i<StartZiel.length; i++) {
			StartZielLayer.addLayer(StartZiel[i]);
		}
		// hutsLayer.addTo(map);
		map.on("zoomend", function() {
			if (map.getZoom() >= 13) {
				map.addLayer(StartZielLayer);
			} else {
				map.removeLayer(StartZielLayer);
				}
		});
};