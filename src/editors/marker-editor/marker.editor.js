import { MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS } from "./controls/context.menu";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Translate, Select } from "ol/interaction";
import { MarkerFeature } from "./marker.feature";
import { easeMarkerIn, easeMarkerOut } from './animations';
import { selectedMarkerStyle, baseMarkerStyle } from './marker.feature.style';
import { MarkerEditorControlPanel } from "./controls/marker.control.panel";

export class MapMarkerEditor {
  constructor(map) {
    this.map = map;
		this.contextMenu = new MarkerContextMenu(map).apply();
		this.control = new MarkerEditorControlPanel(map, '#marker-editor-control-panel');
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.vectorSource = new VectorSource({
      features: []
		});
		
		this.vectorSource.set('markerSource', true);

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.vectorLayer.setZIndex(1);
		this.vectorLayer.set('markerSource', true);

    this.map.addLayer(this.vectorLayer);

    this.select = new Select({
      layers: [this.vectorLayer],
      style: selectedMarkerStyle(1)
    })

    this.map.addInteraction(this.select);
		this.map.addInteraction(new Translate({features: this.select.getFeatures()}))
		this.map.addControl(this.control);
		this.bindEvents();
	}
	
	bindEvents() {
		// creation new marker
    this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
			const pixel = this.map.pixelClickedAt, 
				point = this.map.getCoordinateFromPixel(pixel),
				marker = new MarkerFeature(point);
			
			easeMarkerIn(this.map, marker, () => this.map.addOverlay(marker.overlay));

			this.vectorSource.addFeature(marker);
			this.contextMenu.close()
		});

		// removing marker
		this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_MARKER, () => {
			easeMarkerOut(this.map, this.selectedMarker, () => {
				this.map.removeOverlay(this.selectedMarker.overlay);
				this.vectorSource.removeFeature(this.selectedMarker);
			}, this.selectedMarker.get('source'));
		});

		// selection marker
		this.select.on('select', () => {
			const selected = this.select.getFeatures().getArray()[0];

			if (!selected) {
				const newSource = this.selectedMarker.get('source');

				this.selectedMarker.setStyle(baseMarkerStyle(0.8, newSource));
				this.control.close();
				return;
			}

			const source = selected.get('source');

			if (source) {
				selected.setStyle(selectedMarkerStyle(1, source));
			}

			this.selectedMarker = selected;
			this.control.apply(selected);
		});
  }
}