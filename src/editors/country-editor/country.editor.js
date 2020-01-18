import GeoJSON from 'ol/format/GeoJSON';
import countriesData from './../../data/countries.geo.json';
import { CountryEditorControlPanel, COUNTRY_EDITOR_CONTROL_PANEL_EVENTS } from './country.control.panel.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { 
  emptyFeatureStyle, 
  baseFeatureStyle, 
  selectedFeatureStyle 
} from './country.feature.style.js';

/*
ft -> countryFeature(
	drawBase, drawActive, drawDefault
)
*/
export class MapCountryEditor {
  constructor(map) {
    this.map = map; 
    this.defaultStyle = emptyFeatureStyle();
    this.baseStyle = baseFeatureStyle(0, 123, 255);
    this.activeStyle = selectedFeatureStyle(0, 123, 255);
    this.featureStyles = {
      'Polygon': this.defaultStyle,
      'MultiPolygon': this.defaultStyle
    }

		this.control = new CountryEditorControlPanel(map, '#country-editor-control-panel');
		this.bindEvents();
  }

  bindEvents() {
		// добавить страну на карту впервые
    this.map.on(MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY, () => {
      const features = this.findFeatures(this.map.pixelClickedAt);
      features.forEach(ft => {
				ft.created = true;
				ft.setStyle(ft.get('baseStyle'))
			}); 
    })
		// выделить выбранную страну
    this.map.on('click', event => {
      const point = event.pixel;

      this.selectedFeatures = this.findFeatures(point).filter(ft => ft.created === true);

      if (this.selectedFeatures.length < 1) {
        this.control.close();
      }

      this.selectFeatures(this.selectedFeatures);
    })

    // изменить стиль выбранной страны или прочие характеристики
    this.control.on(COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED, data => {
      this.selectedFeatures.forEach(ft => {
				const [r,g,b] = data.color.split(',');
				const activeStyle = selectedFeatureStyle(r, g, b);
				const baseStyle = baseFeatureStyle(r, g, b);
				
				ft.setStyle(activeStyle);

				ft.set('activeStyle', activeStyle);
				ft.set('baseStyle', baseStyle);
			});
    })
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.vectorSource = new VectorSource({
      features: (new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      })).readFeatures(countriesData).map(ft => {
				ft.set('activeStyle', this.activeStyle);
				ft.set('baseStyle',this.baseStyle);
				return ft;
			})
    });

    this.map.addLayer(new VectorLayer({
      source: this.vectorSource,
      style: feature  => this.featureStyles[feature.getGeometry().getType()]
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
			const newStyle = features.includes(ft) ? ft.get('activeStyle') : ft.get('baseStyle');
			ft.setStyle(newStyle);
    })
  }
}

export const MAP_COUNTRY_EDITOR_EVENTS = {
  SELECT_COUNTRY: 'MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY'
}