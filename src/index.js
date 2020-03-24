import 'ol/ol.css';
import 'styles/style.scss';
import 'material-design-lite/dist/material.teal-red.min.css';
import 'material-design-lite/dist/material.min.js';
import 'material-design-icons/iconfont/material-icons.css';

import { Map, View } from 'ol';
import { OSM } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import { defaults as defaultControls } from 'ol/control';
import { ControlPanel } from 'controls/control-panel';
import { ContextMenuControl } from 'controls/context-menu';

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  target: 'travel-map',
  view: new View({
    center: [0, 0],
    projection: 'EPSG:3857',
    zoom: 1
	}),
	controls: defaultControls().extend([
		new ControlPanel('.travel-map__control-panel')
	])
});

map.addControl(new ContextMenuControl('.travel-map__context-menu', map))
