var map = L.map('map').setView([37.8, -7.82], 8);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	id: 'examples.map-20v6611k'
}).addTo(map);

omnivore.kml('rede-convergir-db.xml').addTo(map);