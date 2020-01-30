import Feature from 'ol/Feature';
import {
	emptyFeatureStyle, 
  baseFeatureStyle, 
	selectedFeatureStyle,
} from './country.feature.style.js';

export class CountryFeature extends Feature {
	// TODO: this constructor is so ugly
	constructor(feature) {
		super(feature.getProperties())
		super.setId(feature.getId());

		const color = feature.get('color') || '0,123,255';
		const showLabel = feature.get('showLabel') || false;

		super.set('activeStyle', selectedFeatureStyle(color, feature.get('name'), showLabel));
		super.set('baseStyle', baseFeatureStyle(color, feature.get('name'), showLabel));
		super.set('showLabel', showLabel);
		super.set('color', color);

		const defaultStyle = feature.get('created') ? this.baseStyle : emptyFeatureStyle();
		super.setStyle(defaultStyle);
	}

	get baseStyle() {
		return super.get('baseStyle');
	}

	get activeStyle() {
		return super.get('activeStyle');
	}

	// style: {color, showLabel}
	set baseStyle(style) {
		const color = style.color || super.get('color'), show = style.showLabel || super.get('showLabel');
		const baseStyle = baseFeatureStyle(color, super.get('name'), show);
		super.set('baseStyle', baseStyle);
	} 

	// style: {color, showLabel}
	set activeStyle(style) {
		const color = style.color || super.get('color'), show = style.showLabel || super.get('showLabel');
		const activeStyle = selectedFeatureStyle(color, super.get('name'), show);
		super.set('activeStyle', activeStyle);
	}

	renderBasic() {
		this.setStyle(this.baseStyle);
	}

	renderActive() {
		this.setStyle(this.activeStyle);
	}
}