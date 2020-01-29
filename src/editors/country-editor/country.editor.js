import GeoJSON from 'ol/format/GeoJSON';
import countriesData from './../../data/countries.geo.json';
import { CountryEditorControlPanel } from './country.control.panel.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { CountryFeature } from './country.feature';
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
			
      features.forEach(ft => {
				ft.created = true;
				ft.setStyle(ft.baseStyle)
      }); 
    })

    this.map.on('click', event => {
      const point = event.pixel;
      this.selectedFeatures = this.findFeatures(point).filter(ft => ft.created === true);

      if (this.selectedFeatures.length < 1) {
        this.control.close();
      }

      this.selectFeatures(this.selectedFeatures);
    })
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    // use service for reading features either from cashe or data file firstly
    this.vectorSource = new VectorSource({
      features: (new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
			})).readFeatures(countriesData).map(ft => new CountryFeature(ft))
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

    this.vectorSource.getFeatures().filter(ft => ft.created === true).forEach(ft => {
			const newStyle = features.includes(ft) ? ft.activeStyle : ft.baseStyle;
			ft.setStyle(newStyle);
    })
  }
}

export const MAP_COUNTRY_EDITOR_EVENTS = {
  SELECT_COUNTRY: 'MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY'
}