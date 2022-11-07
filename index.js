import { hideUselessTiles, showAllTiles } from './utils.js';

const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 19,
    attribution: (
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      + ' &copy; <a href="https://twitter.com/SimonDriesen">Simon Driesen</a>'
      + ' <a href="https://twitter.com/search?q=%2330DayMapChallenge&src=hashtag_click">#30DayMapChallenge</a>'
      + ' Raster'
    )
});

const map = L.map('map', {
  center: [51.61163868085794, 1.4282226562500002],
  zoom: 7,
  layers: [layer],
  zoomControl: false,
});

layer.once('load', () => hideUselessTiles(layer));
map.on("movestart", () => showAllTiles());
map.on("zoomstart", () => showAllTiles());

map.on("moveend", () => hideUselessTiles(layer));
map.on("zoomend", () => hideUselessTiles(layer));

// map.on("mouseup", () => console.log(map.getCenter(), map.getZoom()));