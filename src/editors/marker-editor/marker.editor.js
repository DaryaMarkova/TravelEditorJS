import { MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS } from "./controls/context.menu";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { MarkerFeature } from "./marker.feature";

export class MapMarkerEditor {
  constructor(map) {
    this.map = map;
    this.contextMenu = new MarkerContextMenu(map).apply();
  }

  bindEvents() {
    this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
      const point = this.map.getCoordinateFromPixel(this.map.pixelClickedAt)
      const marker = new MarkerFeature(point);

      this.vectorSource.addFeature(marker);
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