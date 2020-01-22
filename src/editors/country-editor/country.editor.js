import GeoJSON from 'ol/format/GeoJSON';
import countriesData from './../../data/countries.geo.json';
import { CountryEditorControlPanel, COUNTRY_EDITOR_CONTROL_PANEL_EVENTS } from './country.control.panel.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { CountryFeature } from './country.feature';
import throttle from 'lodash/throttle';

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

    this.control.on(COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED, data => {
      this.selectedFeatures.forEach(ft => {
				ft.activeStyle = {color: data.color};
				ft.baseStyle = {color: data.color};
				ft.setStyle(ft.activeStyle);
			});
    })

    const mapView = this.map.getView();
    mapView.on('change:resolution', throttle(() => {
        const zoom = parseInt(mapView.getZoom());
        const [feature] = this.selectedFeatures || [];
        
        if (!feature) {
          return;
        }

        feature.baseStyle = {zoom};
        feature.activeStyle = {zoom}; 

    }, 300));
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

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
      this.control.open(...features);
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