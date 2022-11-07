import { setup, showAllTiles, moveTile, randomIntFromInterval, shuffleArray } from './utils.js';

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
  maxBoundsViscosity: 1,
});

let lostTileId = null;
const tilePositions = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

let visibleTiles;
let lostTile;

const setTiles = (layer) => {
  const tiles = setup(layer, lostTileId, tilePositions);
  if (!tiles) return;
  visibleTiles = tiles.visibleTiles;
  lostTile = tiles.lostTile;
  lostTileId = tiles.lostTileId;
}

layer.once('load', () => setTiles(layer));
map.on("movestart", () => showAllTiles());
map.on("zoomstart", () => showAllTiles());

map.on("moveend", () => setTiles(layer));
map.on("zoomend", () => setTiles(layer));

map.on("click", (e) => {
  const tiles = moveTile(e, visibleTiles, lostTile, tilePositions);
  visibleTiles = tiles.visibleTiles;
  lostTile = tiles.lostTile;
});