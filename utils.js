let div;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function swapElements(arr, i1, i2) {
  let temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
  return arr;
}

function setup(layer, lostTileId, tilePositions) {
  layer.redraw();

  const tiles = document.querySelectorAll(".leaflet-tile-container .leaflet-tile");
  const firstTile = tiles[0];
  const splitSrc = firstTile.src.split('/');
  const startX = Number(splitSrc[4]) - 1;
  const startY = Number(splitSrc[5].replace('.png', '')) - 1;

  const visibleTiles = [];
  let lostTile;
  let failed = false;

  let tileId = 1;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const url = `https://tile.openstreetmap.org/${splitSrc[3]}/${startX + x}/${startY + y}.png`;
      const tile = Array.from(tiles).find(tile => tile.src === url);
      if (tile) {
        tile.id = tileId;
        tile.position = tilePositions[tileId - 1];
        if (!lostTileId || tileId !== lostTileId) {
          visibleTiles.push(tile);
        } else lostTile = tile;
      } else failed = true;
      tileId++;
    }
  }

  if (failed) return;

  let transforms;
  if (!lostTileId) {
    transforms = visibleTiles.map(tile => tile.style.transform);
    const Xs = visibleTiles.map((tile) => {
      return Number(transforms[tile.position - 1].split(', ')[0].replace('translate3d(', '').replace('px', ''));
    });
    const Ys = visibleTiles.map((tile) => {
      return Number(transforms[tile.position - 1].split(', ')[1].replace('px', ''));
    });
    const highestX = Math.max(...Xs);
    const highestY = Math.max(...Ys);
    lostTile = visibleTiles.find(tile => {
      return tile.style.transform.includes(`${highestX}px, ${highestY}px`);
    });
    lostTileId = Number(lostTile.id);
  }

  transforms = [...visibleTiles, lostTile].map(tile => tile.style.transform);
  [...visibleTiles, lostTile].forEach((tile) => {
    tile.style.transform = transforms[tile.position - 1];
    const tileX = transforms[tile.position - 1].split(', ')[0].replace('translate3d(', '').replace('px', '');
    const tileY = transforms[tile.position - 1].split(', ')[1].replace('px', '');
    tile.tileX = Number(tileX);
    tile.tileY = Number(tileY);
  });

  const invisibleTiles = Array.from(tiles).filter(tile => ![...visibleTiles, lostTile].map(tile => tile.src).includes(tile.src));
  lostTile.classList.add("lost-tile");
  invisibleTiles.forEach((tile => tile.style.display = 'none'));

  const container = visibleTiles[0].parentNode;
  if (div) div.parentNode.removeChild(div);
  div = document.createElement("div");
  const tileHeight = Number(visibleTiles[0].style.height.replace('px', ''));
  div.id = 'puzzle-background';
  div.style.transform = transforms[0];
  div.style.height = `${tileHeight*3}px`;
  div.style.width = `${tileHeight*3}px`;
  div.style.background = 'white';
  div.style.position = 'absolute';
  div.style.zIndex = -1;
  container.appendChild(div);

  return { visibleTiles, lostTile, lostTileId };
}

function showAllTiles() {
  const tiles = document.querySelectorAll(".leaflet-tile-container .leaflet-tile");
  tiles.forEach((tile => tile.style.display = ''));
}

function moveTile(e, visibleT, lostT, tilePositions) {
  const lostTile = lostT;
  const visibleTiles = visibleT;
  let newTilePositions = tilePositions;
  const { x, y } = e.layerPoint;
  const tileHeight = Number(visibleTiles[0].style.height.replace('px', ''));
  const tile = visibleTiles.find((tile) => {
    const { tileX, tileY } = tile;
    return x >= tileX && x <= tileX + tileHeight
      && y >= tileY && y <= tileY + tileHeight;
  });

  if (!tile) return { visibleTiles, lostTile, tilePositions };

  if (((lostTile.tileX - tile.tileX === tileHeight || tile.tileX - lostTile.tileX === tileHeight) && lostTile.tileY === tile.tileY)
    || (lostTile.tileY - tile.tileY === tileHeight || tile.tileY - lostTile.tileY === tileHeight) && lostTile.tileX === tile.tileX) {
    const oldTransform = tile.style.transform;
    const oldPosition = tile.position;
    const oldTileX = tile.tileX;
    const oldTileY = tile.tileY;
    newTilePositions = swapElements(newTilePositions, newTilePositions.indexOf(tile.position), newTilePositions.indexOf(lostTile.position));

    tile.style.transform = lostTile.style.transform;
    tile.position = lostTile.position;
    tile.tileX = lostTile.tileX;
    tile.tileY = lostTile.tileY;
    lostTile.style.transform = oldTransform;
    lostTile.position = oldPosition;
    lostTile.tileX = oldTileX;
    lostTile.tileY = oldTileY;
  }

  const newVisibleTiles = [
    ...visibleTiles.filter(t => t.id !== tile.id),
    tile
  ];

  if (JSON.stringify(tilePositions) === '[1,2,3,4,5,6,7,8,9]') {
    alert('YOU WON!');
  }

  return {
    lostTile,
    visibleTiles: newVisibleTiles,
    tilePositions: newTilePositions,
  }
}

export {
  setup,
  showAllTiles,
  moveTile,
  randomIntFromInterval,
  shuffleArray,
}