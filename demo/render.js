import { renderPiano } from '../keyboard.js';

window.onload = function() {
  renderPiano(document.getElementById('pianoA'), {
    colorize: [
      { keys: ['C3', 'E3', 'G3'], color: 'lightblue' },
      { keys: ['C4'], color: 'cyan' },
      { keys: ['A4'], color: 'yellow' }
    ],
    labels: {
      C3: '1',
      Eb3: 'b3',
      G3: '5',
      Bb3: 'b7'
    }
  });

  renderPiano(document.getElementById('pianoB'), {
    palette: ['#F3EBCD', '#13110B'],
    range: ['B1', 'F5'],
    labels: {
      C3: '1',
      Eb3: 'b3',
      G3: '5',
      Bb3: 'b7'
    }
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 26,
    palette: ['darkblue', 'lightblue'],
    lowerHeight: 0,
    upperHeight: 16,
    labels: {
      C3: '1',
      Eb3: 'b3',
      G3: '5',
      Bb3: 'b7'
    },
    topLabels: true
  });
  renderPiano(document.getElementById('pianoB'), {
    keyCount: 14,
    scaleX: 4,
    scaleY: 4,
    strokeWidth: 1,
    range:['C3','C4'],
    labels: {
      C3: '1',
      Eb3: 'b3',
      G3: '5',
      Bb3: 'b7'
    }
  });
};
