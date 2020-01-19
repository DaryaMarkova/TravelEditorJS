import 'bootstrap/dist/css/bootstrap.min.css';
import 'ol/ol.css';
import 'jquery/dist/jquery.slim';
import './styles/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import { ContextMenuControl, MAP_CONTEXT_MENU_EVENTS } from './controls/map.context.menu';
import { MapCountryEditor, MAP_COUNTRY_EDITOR_EVENTS } from './editors/country-editor/country.editor';
import { defaults as defaultControls } from 'ol/control';
import { MapControlPanel } from './controls/map.control.panel';
import { MapZoomControl } from './controls/map.zoom';

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    projection: 'EPSG:3857',
    zoom: 1
  }),
  controls: defaultControls().extend([
    new MapControlPanel(this, '#control-panel'),
    new MapZoomControl(this, '#map-zoomer'),
  ])
});

new MapCountryEditor(map).apply();

const contextMenu = new ContextMenuControl(map, '#context-menu');
contextMenu.on(MAP_CONTEXT_MENU_EVENTS.COUNTRY_OPTION_SELECTED, 
  () => map.dispatchEvent(MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY)
);
map.addControl(contextMenu);

const viewport = map.getViewport();

viewport.addEventListener('contextmenu', event => {
  event.preventDefault();
  const pixel = map.getEventPixel(event);
  map.pixelClickedAt = pixel; // TODO: looks awful
})

map.on("pointermove", function(event) {
  const pixel = map.getEventPixel(event.originalEvent);
  const hitted = map.hasFeatureAtPixel(pixel);
  viewport.style.cursor = hitted ? 'pointer' : '';
})