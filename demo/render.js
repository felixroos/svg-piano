import {
  renderKeys,
  totalDimensions,
  defaultOptions,
  getPoints
} from '../keyboard.js';

window.onload = function() {
  renderPiano(document.getElementById('pianoA'), {
    keyCount: 36
  });

  renderPiano(document.getElementById('pianoB'), {
    keyCount: 24,
    palette: ['#F3EBCD', '#13110B']
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 24,
    palette: ['darkblue', 'lightblue'],
    lowerHeight: 0,
    upperHeight: 16
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 12,
    scaleX: 0.5,
    scaleY: 0.5,
    strokeWidth: 1
  });
};

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
      'style',
      `fill:${key.fill};stroke:${key.stroke};stroke-width:${key.strokeWidth}`
    );
    svg.appendChild(polygon);
  });
  container.appendChild(svg);
}
