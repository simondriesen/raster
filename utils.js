function hideUselessTiles(layer) {
  layer.redraw();

  const tiles = document.querySelectorAll(".leaflet-tile-container .leaflet-tile");
  const firstTile = tiles[0];
  const splitSrc = firstTile.src.split('/');
  const startX = Number(splitSrc[4]) - 1;
  const startY = Number(splitSrc[5].replace('.png', '')) - 1;

  const visibleTileUrls = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      visibleTileUrls.push(
        `https://tile.openstreetmap.org/${splitSrc[3]}/${startX + x}/${startY + y}.png`,
      );
    }
  }

  const invisibleTiles = Array.from(tiles).filter(tile => !visibleTileUrls.includes(tile.src));
  invisibleTiles.forEach((tile => tile.style.display = 'none'));
}

function showAllTiles() {
  const tiles = document.querySelectorAll(".leaflet-tile-container .leaflet-tile");
  tiles.forEach((tile => tile.style.display = ''));
}

export {
  hideUselessTiles,
  showAllTiles,
}