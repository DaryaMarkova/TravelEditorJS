import $ from 'jquery/dist/jquery';
import { MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS } from "./controls/context.menu";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { MarkerFeature } from "./marker.feature";
import { Overlay } from "ol";

export class MapMarkerEditor {
  constructor(map) {
    this.map = map;
    this.contextMenu = new MarkerContextMenu(map).apply();
  }

  bindEvents() {
  
    this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
      // adding marker 
      const point = this.map.getCoordinateFromPixel(this.map.pixelClickedAt)
      const marker = new MarkerFeature(point);
      // overlay generator
      const parent$ = $('marker-overlay-container'), 
        pattern$ = $('.marker-label-overlay').eq(0), 
        overlay$ = pattern$.clone(); 
      
      overlay$.text('Some place');
      parent$.append(overlay$);

      const overlay = new Overlay({
        element: overlay$.get(0),
        positioning: 'center-center',
        position: point
      })

      this.vectorSource.addFeature(marker);
      this.map.addOverlay(overlay);
    })
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.vectorSource = new VectorSource({
      features: []
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.vectorLayer.setZIndex(1);
    this.map.addLayer(this.vectorLayer);
    this.bindEvents();
  }
}