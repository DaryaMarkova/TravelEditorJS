import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { CountrySerializer } from './serializer.js';
import { easeFeatureIn, easeFeatureOut } from './animations.js';
import { COUNTRY_EDITOR_CONTEXT_MENU_EVENTS, CountryContextMenuControl } from './controls/context.menu.js';
import { CountryEditorControlPanel, COUNTRY_EDITOR_CONTROL_PANEL_EVENTS } from './controls/country.control.panel.js';

export class MapCountryEditor {
  constructor(map) {
    this.map = map; 
    this.control = new CountryEditorControlPanel(map, '#country-editor-control-panel');
    this.contextMenu = new CountryContextMenuControl(map).apply();
    this.serializer = new CountrySerializer();

		this.bindEvents();
  }

  bindEvents() {
    this.map.on(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.CREATE_COUNTRY, () => {
      // creation new country here
      const features = this.findFeatures(this.map.pixelClickedAt);
      const [selected] = features;

      if (!selected) {
        return;
      }

      selected.set('created', true);
      easeFeatureIn(this.map, selected);

      this.serializer.serializeFeature(selected);
    })

    this.map.on(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY, () => {
      // removing country
      const features = this.findFeatures(this.map.pixelClickedAt);
      const [selected] = features;

      if (!selected) {
        return;
      }

      selected.clear();
      easeFeatureOut(this.map, selected);
      this.serializer.serializeFeature(selected);
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
      this.serializer.serializeFeature(feature);
    })
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.serializer.getFeatureCollection().then(features => {
      this.vectorSource = new VectorSource({
        features: features
      });
  
      this.map.addLayer(new VectorLayer({
        source: this.vectorSource
      }))
      
      this.map.addControl(this.control);
    });
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

    // выделяем выбранную фичу и снимаем выделение с остальных
    this.vectorSource.getFeatures().filter(ft => ft.get('created') === true).forEach(ft => {
			const newStyle = features.includes(ft) ? ft.activeStyle : ft.baseStyle;
			ft.setStyle(newStyle);
    })
  }
}

export const MAP_COUNTRY_EDITOR_EVENTS = {
  ADD_COUNTRY: 'MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY',
  REMOVE_COUNTRY: 'MAP_COUNTRY_EDITOR_EVENTS.REMOVE_COUNTRY'
}