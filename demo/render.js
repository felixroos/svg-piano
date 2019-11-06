import { renderPiano } from '../keyboard.js';

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
