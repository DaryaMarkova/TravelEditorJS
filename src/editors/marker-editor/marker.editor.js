import { MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS } from "./controls/context.menu";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Translate, Select } from "ol/interaction";
import { MarkerFeature } from "./marker.feature";
import { easeMarkerIn } from './animations';
import { selectedMarkerStyle } from './marker.feature.style';

export class MapMarkerEditor {
  constructor(map) {
    this.map = map;
		this.contextMenu = new MarkerContextMenu(map).apply();
  }

  bindEvents() {
    this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
      const pixel = this.map.pixelClickedAt, point = this.map.getCoordinateFromPixel(pixel);
			const marker = new MarkerFeature(point);
			
			easeMarkerIn(this.map, marker, () => {
				this.map.addOverlay(marker.overlay);
			});

			this.vectorSource.addFeature(marker);
			this.contextMenu.close()
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
      style: selectedMarkerStyle(1.1)
    })

    this.map.addInteraction(this.select);
		this.map.addInteraction(new Translate({features: this.select.getFeatures()}))
    this.bindEvents();
  }
}