import $ from 'jquery/dist/jquery';
import { MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS } from "./controls/context.menu";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Translate, Select } from "ol/interaction";
import { MarkerFeature } from "./marker.feature";
import { Overlay } from "ol";
import { Style, Icon } from 'ol/style';

export class MapMarkerEditor {
  constructor(map) {
    this.map = map;
    this.contextMenu = new MarkerContextMenu(map).apply();
  }

  bindEvents() {
  
    this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
      // adding marker 
      const pixel = this.map.pixelClickedAt, point = this.map.getCoordinateFromPixel(pixel);
      const marker = new MarkerFeature(point);
      // overlay generator
      const parent$ = $('marker-overlay-container'), 
        pattern$ = $('.marker-label-overlay').eq(0), 
        overlay$ = pattern$.clone(); 
      
      overlay$.text('Some place');
      parent$.append(overlay$);

      marker.overlay = new Overlay({
        element: overlay$.get(0),
        className: 'animated-overlay',
        position: this.map.getCoordinateFromPixel( [pixel[0], pixel[1] + 30]),
        positioning: 'center-center'
      });

      marker.on('change', _ => {
        const coordinates = marker.getGeometry().getCoordinates(), 
          pixel = this.map.getPixelFromCoordinate(coordinates);

        marker.overlay.setPosition(this.map.getCoordinateFromPixel([pixel[0], pixel[1] + 30]));
      })

      this.vectorSource.addFeature(marker);
      this.map.addOverlay(marker.overlay);
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

    this.select = new Select({
      layers: [this.vectorLayer],
      style: new Style({
        image: new Icon({
          scale: 0.7,
          src: './assets/icons/marker_icon.png'
        })
      })
    })

    this.map.addInteraction(this.select);
    this.map.addInteraction(new Translate({features: this.select.getFeatures()}))
    this.bindEvents();
  }
}