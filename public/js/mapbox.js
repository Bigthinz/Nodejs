 /*es-lint-disable*/
 console.log('heya here comes mapbox :D');
 const locations = JSON.parse(document.getElementById('map').dataset.location);

 mapboxgl.workerUrl = "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl-csp-worker.js";
 mapboxgl.accessToken = 'pk.eyJ1IjoiYmlndGhpbnoiLCJhIjoiY2s2YXdwcHdxMDltcTNscDluMXI5dDJ2dCJ9.-H1bTCDQ_x6vy6Y7VKcGAw';
 var map = new mapboxgl.Map({
     container: 'map',
     style: 'mapbox://styles/bigthinz/ckg9yhiaa14cj19p9w67fwd36'
 });