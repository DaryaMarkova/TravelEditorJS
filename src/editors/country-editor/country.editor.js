import { CountryEditorControlPanel, COUNTRY_EDITOR_CONTROL_PANEL_EVENTS } from './country.control.panel.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { serializer } from './serializer.js';

export class MapCountryEditor {
  constructor(map) {
    this.map = map; 
    this.control = new CountryEditorControlPanel(map, '#country-editor-control-panel');
		this.bindEvents();
  }

  bindEvents() {
    this.map.on(MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY, () => {
      const features = this.findFeatures(this.map.pixelClickedAt);
      const [selected] = features;

      selected.set('created', true);
      selected.setStyle(selected.baseStyle);
      serializer.serializeFeature(selected);
    })

    this.map.on('click', event => {
      const point = event.pixel;
      this.selectedFeatures = this.findFeatures(point).filter(ft => ft.get('created') === true);

      if (this.selectedFeatures.length < 1) {
        this.control.close();
      }

      this.selectFeatures(this.selectedFeatures);
    });

    this.control.on(COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE, ({feature}) => {
      serializer.serializeFeature(feature);
    })
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.vectorSource = new VectorSource({
      features: serializer.getFeatureCollection()
    });

    this.map.addLayer(new VectorLayer({
			source: this.vectorSource
		}))
		
    this.map.addControl(this.control);
  }
  
  findFeatures(point) {
    return this.map.getFeaturesAtPixel(
      point, {
        layerFilter: layer => layer.getSource() === this.vectorSource
      }
    );
  }

  selectFeatures(features) {
    if (features.length > 0) {
      this.control.applyToFeature(...features);
    }

    // ????
    this.vectorSource.getFeatures().filter(ft => ft.get('created') === true).forEach(ft => {
			const newStyle = features.includes(ft) ? ft.activeStyle : ft.baseStyle;
			ft.setStyle(newStyle);
    })
  }
}

export const MAP_COUNTRY_EDITOR_EVENTS = {
  SELECT_COUNTRY: 'MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY'
}