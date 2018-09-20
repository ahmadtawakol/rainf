# rainf

> Javascript raindrops generator


* All modern browsers are supported (Tested in Chrome, Firefox, Opera, Safari, IE9+ and Edge).

### Install

#### npm:

```bash
npm i ahmadtawakol/rainf --save
```

### Usage

Include rainf with script tag:

```html
<script src="rainf.min.js"></script>
```

Or use modules:

```javascript
// ES6
import rainf from 'rainf';

// Commonjs
var rainf = require('rainf');

```

Simply init rainf like this:

```javascript
rainf.init({
	size: 1,
	amount: 50
});
```

### Default Options

Argument | Type | Default Value | Description
:---: | :---: | :---: | ---
**dom** | *HTMLDomElement, String* | *document.body* | The element that raindrops canvas append to.
**amount** | *Number* | *100* | Number of raindrops displayed at a time.
**size** | *Number* | *1* | Size of raindrops.
**speed** | *Number* | *45* | Vertical speed of raindrops. The larger, the raindrops drop faster.
**color** | *String* | *'#fff'* | Color of raindrops. This option accepts HEX or RGB color code, such as "#fff", "#ffffff", "rgb(255,255,255)".
**opacity** | *Number* | *0.5* | The opacity of raindrops.
**zIndex** | *Number* | *null* | Position of the canvas layer. Set the layer front or back by changing this value.

### More Examples

```javascript
var rain = rainf.init();

// Adjust width and height of window:
window.onresize = function() {
  rain.resize();
};

// Reset the Rainf object and regenerate raindrops:
rain.reset();

// reset the Rainf object with new options:
rain.setOptions({
	amount: 80
});

// Change the vertical speed ( This will not reset the Rainf object )
rain.speed(2);
```

### Licence

rainf is open source and released under the MIT Licence.

Copyright (c) 2018 ahmadtawakol
