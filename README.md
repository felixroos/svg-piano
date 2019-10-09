# SVG Piano

![piano](https://upload.wikimedia.org/wikipedia/commons/4/48/Pianoteilung.svg)

This lib includes the rendering logic for a [correctly sized piano](https://de.wikipedia.org/wiki/Datei:Pianoteilung.svg).

## Demo

- [React Demo](https://stackblitz.com/edit/piano-keyboard?file=Keyboard.js)
- [Svelte Demo](https://svelte.dev/repl/95387840d35344508ede3de361b149ea?version=3.12.1)
- see demo folder for usage with plain js ```npm run start``` to run 

## Options

- scaleX: changes scaling in x direction
- scaleY: changes scaling in y direction
- upperHeight: px height of upper area
- lowerHeight: px height of lower area
- strokeWidth: border width in px
- stroke: stroke style
- palette: array to customize color with format ```['black', 'white']```
- visibleKeys: which keys should be visible? shows all if not specified

## Todo

- custom start
- custom colors
- labels
- build as web component using stencil