import { renderPiano } from '../keyboard.js';

window.onload = function() {
  renderPiano(document.getElementById('pianoA'), {
    colorize: [
      { keys: ['C3', 'E3', 'G3'], color: 'lightblue' },
      { keys: ['C4'], color: 'cyan' },
      { keys: ['A4'], color: 'yellow' }
    ]
  });

  renderPiano(document.getElementById('pianoB'), {
    palette: ['#F3EBCD', '#13110B'],
    range: ['B1', 'F5']
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 26,
    palette: ['darkblue', 'lightblue'],
    lowerHeight: 0,
    upperHeight: 16
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 14,
    scaleX: 0.5,
    scaleY: 0.5,
    strokeWidth: 1
  });
};
