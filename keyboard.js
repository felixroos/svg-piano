// https://de.wikipedia.org/wiki/Datei:Pianoteilung.svg
export const keyboard = [
  {
    pitches: ['C', 'B#'],
    upperOffset: 0,
    upperWidth: 15.05
  },
  {
    pitches: ['Db', 'C#'],
    upperOffset: 0,
    upperWidth: 12.7
  },
  {
    pitches: ['D'],
    upperOffset: 4.15,
    upperWidth: 15.3
  },
  {
    pitches: ['Eb', 'D#'],
    upperOffset: 0,
    upperWidth: 12.7
  },
  {
    pitches: ['E'],
    upperOffset: 8.55,
    upperWidth: 15.05
  },
  {
    pitches: ['F', 'E#'],
    upperOffset: 0,
    upperWidth: 13.95
  },
  {
    pitches: ['Gb', 'F#'],
    upperOffset: 0,
    upperWidth: 12.7
  },
  {
    pitches: ['G'],
    upperOffset: 3.05,
    upperWidth: 14.2
  },
  {
    pitches: ['Ab', 'G#'],
    upperOffset: 0,
    upperWidth: 12.7
  },
  {
    pitches: ['A'],
    upperOffset: 6.35,
    upperWidth: 14.2
  },
  {
    pitches: ['Bb', 'A#'],
    upperOffset: 0,
    upperWidth: 12.7
  },
  {
    pitches: ['B', 'Cb'],
    upperOffset: 9.65,
    upperWidth: 13.95
  }
];

export const accidentals = [1, 3, 6, 8, 10];

export const _defaultOptions = {
  scaleX: 1,
  scaleY: 1,
  lowerWidth: 23.6,
  palette: ['#39383D', '#F2F2EF'],
  stroke: '#39383D',
  strokeWidth: 2,
  offsetY: 2,
  offsetX: 0,
  upperHeight: 100,
  lowerHeight: 45,
  keyCount: 88,
  range: ['A0', 'C8']
}; // visibleKeys

export function defaultOptions(options) {
  return Object.assign({}, _defaultOptions, options);
}

export function getKeySizes(options) {
  const {
    lowerHeight,
    upperHeight,
    lowerWidth,
    strokeWidth,
    palette,
    stroke
  } = defaultOptions(options);
  return keyboard.map((key, index) =>
    Object.assign(key, {
      // add black/white specific props > black keys have no lower part
      upperHeight,
      lowerHeight: accidentals.includes(index) ? 0 : lowerHeight,
      lowerWidth: accidentals.includes(index) ? key.upperWidth : lowerWidth,
      fill: accidentals.includes(index) ? palette[0] : palette[1],
      stroke,
      strokeWidth
    })
  );
}

export function renderKeys(options) {
  options = defaultOptions(options);
  const keySizes = getKeySizes(options);
  let {
    keyCount,
    scaleY,
    scaleX,
    visibleKeys,
    lowerWidth,
    strokeWidth,
  } = options;
  return Array(keyCount)
    .fill(0)
    .map((key, index, _keys) => keySizes[index % 12])
    .map((key, index, _keys) => ({
      fill: key.fill,
      strokeWidth: key.strokeWidth,
      stroke: key.stroke,
      upperHeight: key.upperHeight * scaleY,
      lowerHeight: key.lowerHeight * scaleY,
      upperWidth: key.upperWidth * scaleX,
      lowerWidth: key.lowerWidth * scaleX,
      upperOffset: key.upperOffset * scaleX,
      visible:
        !visibleKeys ||
        !!key.pitches.find(pitch => visibleKeys.includes(pitch)),
      offsetX: keyOffset(index, _keys, lowerWidth) * scaleX + strokeWidth
    }));
  // fill =!visible ? 'rgba(100,100,100,0.3): key.fill
}

export function whiteIndex(index) {
  return (
    Array(index % 12)
      .fill(0)
      .filter((_, i) => !accidentals.includes(i)).length +
    Math.floor(index / 12) * 7
  );
}

export function keyOffset(index, keys, lowerWidth) {
  const wi = whiteIndex(index);
  return !accidentals.includes(index % 12)
    ? wi * lowerWidth
    : keys
        .slice(0, index)
        .reduce((sum, _key, _index) => sum + _key.upperWidth, 0);
}

export function totalDimensions(options) {
  let {
    scaleX,
    scaleY,
    lowerWidth,
    keyCount,
    lowerHeight,
    upperHeight,
    strokeWidth
  } = defaultOptions(options);
  return [
    scaleX * lowerWidth * whiteIndex(keyCount),
    (lowerHeight + upperHeight) * scaleY
  ].map(c => Math.round(c + strokeWidth * 2)); // >svg adds stroke around actual widths
}

export function getPoints(key, round = true) {
  const {
    upperOffset,
    offsetX,
    offsetY,
    upperHeight,
    lowerHeight,
    upperWidth,
    lowerWidth
  } = defaultOptions(key);
  const totalHeight = lowerHeight + upperHeight;
  return [
    [upperOffset + offsetX, offsetY],
    [upperOffset + offsetX, upperHeight + offsetY],
    [offsetX, upperHeight + offsetY],
    [offsetX, totalHeight + offsetY],
    [lowerWidth + offsetX, totalHeight + offsetY],
    [lowerWidth + offsetX, upperHeight + offsetY],
    [upperWidth + upperOffset + offsetX, upperHeight + offsetY],
    [upperWidth + upperOffset + offsetX, offsetY]
  ];//.map(p => p.map(c => (round ? Math.floor(c) : c)));
}
