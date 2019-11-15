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
  strokeWidth: 1,
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

/** computes keyCount and keyOffset from range array ([SPN,SPN]) */
export function rangeOptions(range) {
  const pitches = range.map(note => note.slice(0, -1));
  const first = keyboard.find(key => key.pitches.includes(pitches[0]));
  const last = keyboard.find(key => key.pitches.includes(pitches[1]));
  const offsetLeft = keyboard.indexOf(first);
  const offsetRight = 12 - keyboard.indexOf(last);
  const octaves = range.map(note => parseInt(note.slice(note.length - 1)));
  const keyCount =
    (octaves[1] - octaves[0] + 1) * 12 - offsetLeft - offsetRight + 1;
  return { keyCount, keyOffset: offsetLeft };
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
  if (options.range) {
    options = {
      ...options,
      ...rangeOptions(options.range)
    };
  }
  let {
    keyCount,
    scaleY,
    scaleX,
    visibleKeys,
    lowerWidth,
    strokeWidth,
    keyOffset,
    colorize
  } = options;

  return Array(keyCount + keyOffset)
    .fill(0)
    .map((key, index, _keys) => keySizes[index % 12])
    .map((key, index, _keys) => {
      const octave = getOctave(index, options.range, keyOffset);
      const notes = key.pitches.map(pitch => pitch + octave);
      return {
        index,
        notes,
        fill: getColorization(notes, colorize) || key.fill,
        strokeWidth: key.strokeWidth,
        stroke: key.stroke,
        upperHeight: key.upperHeight * scaleY,
        lowerHeight: key.lowerHeight * scaleY,
        upperWidth: upperWidth(key, index, keyOffset, keyCount) * scaleX,
        lowerWidth: key.lowerWidth * scaleX,
        upperOffset: upperOffset(key, index, keyOffset, keyCount) * scaleX,
        visible:
          !visibleKeys ||
          !!key.pitches.find(pitch => visibleKeys.includes(pitch)),
        offsetX:
          getKeyOffset(index, _keys, lowerWidth, keyOffset) * scaleX +
          Math.ceil(strokeWidth / 2)
      };
    })
    .filter(key => key.index >= keyOffset);
}

export function getOctave(index, range, keyOffset) {
  const overflow = Math.floor(index / 12);
  const octaves = range.map(note => parseInt(note.slice(note.length - 1)));
  const octave = overflow + octaves[0];
  return octave;
}

export function getColorization(notes, colorize) {
  if (!colorize) {
    return null;
  }
  const match = colorize.find(
    color => !!color.keys.find(key => notes.includes(key))
  );
  return match ? match.color : null;
}

export function upperWidth(key, index, offset, keyCount) {
  const isFirst = index => index === offset;
  const isLast = index => index === keyCount + offset - 1;
  if (isFirst(index)) {
    return key.upperWidth + key.upperOffset;
  }
  if (isLast(index)) {
    return key.lowerWidth - key.upperOffset;
  }
  return key.upperWidth;
}

function upperOffset(key, index, keyOffset, keyCount) {
  const isFirst = index => index === keyOffset;
  if (isFirst(index)) {
    return 0;
  }
  return key.upperOffset;
}

export function whiteIndex(index) {
  return (
    Array(index % 12)
      .fill(0)
      .filter((_, i) => !accidentals.includes(i)).length +
    Math.floor(index / 12) * 7
  );
}

export function getKeyOffset(index, keys, lowerWidth, keyOffset = 0) {
  const wi = whiteIndex(index);
  const oi = whiteIndex(keyOffset);
  let firstOffset = keys[keyOffset].upperOffset;
  if (accidentals.includes(keyOffset % 12)) {
    const whiteKeyBefore = keyboard[(keyOffset + 12 - 1) % 12];
    firstOffset -=
      lowerWidth - (whiteKeyBefore.upperWidth + whiteKeyBefore.upperOffset);
  }
  return !accidentals.includes(index % 12)
    ? wi * lowerWidth - oi * lowerWidth
    : keys
        .slice(keyOffset, index)
        .reduce((sum, _key, _index) => sum + _key.upperWidth, 0) + firstOffset;
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
    scaleX * lowerWidth * whiteIndex(keyCount + 1),
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
  ];
}

export function getTextPosition(key) {
  const {
    offsetX,
    upperOffset,
    upperWidth,
    upperHeight,
    lowerHeight
  } = defaultOptions(key);
  return [offsetX + upperOffset + upperWidth / 2, upperHeight + lowerHeight];
}

export function renderPiano(container, _options) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const options = defaultOptions(_options);

  const keys = renderKeys(options);
  const dimensions = totalDimensions(options);
  const svg = document.createElementNS(xmlns, 'svg');

  svg.setAttributeNS(
    null,
    'viewBox',
    '0 0 ' + dimensions[0] + ' ' + dimensions[1]
  );
  svg.setAttributeNS(null, 'style', 'margin:0');
  svg.setAttributeNS(null, 'width', dimensions[0]);
  svg.setAttributeNS(null, 'height', dimensions[1]);

  keys.forEach(key => {
    const points = getPoints(key)
      .map(p => p.join(','))
      .join(' ');
    const polygon = document.createElementNS(xmlns, 'polygon');
    polygon.setAttributeNS(null, 'points', points);
    polygon.setAttributeNS(
      null,
      'class',
      key.notes.reduce(
        (classes, note, index) => classes + (index ? ' ' : '') + 'key-' + note,
        ''
      )
    );
    polygon.setAttributeNS(
      null,
      'style',
      `fill:${key.fill};stroke:${key.stroke};stroke-width:${key.strokeWidth}`
    );
    svg.appendChild(polygon);
  });
  container.appendChild(svg);
}
