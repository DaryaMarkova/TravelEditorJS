import Feature from 'ol/Feature';
import {
	emptyFeatureStyle, 
  baseFeatureStyle, 
	selectedFeatureStyle,
} from './country.feature.style.js';

export class CountryFeature extends Feature {
	constructor(feature) {
		super(feature.getProperties())
		
		super.setId(feature.getId());
		super.set('activeStyle', selectedFeatureStyle(0, 123, 255, feature.get('name')));
		super.set('baseStyle', baseFeatureStyle(0, 123, 255, feature.get('name')));
		super.setStyle(emptyFeatureStyle()) 
		this.color = '0,123,255';
	}

	get baseStyle() {
		return super.get('baseStyle');
	}

	get activeStyle() {
		return super.get('activeStyle');
	}

	// style: {color, showLabel}
	set baseStyle(style) {
		const color = style.color || this.color, show = style.showLabel || this.showLabel;
		const [r, g, b] = color.split(','); 
		const baseStyle = baseFeatureStyle(r, g, b, super.get('name'), show);
		super.set('baseStyle', baseStyle);
	} 

	// style: {color, showLabel}
	set activeStyle(style) {
		const color = style.color || this.color, show = style.showLabel || this.showLabel;
		const [r, g, b] = color.split(',');
		const activeStyle = selectedFeatureStyle(r, g, b, super.get('name'), show);
		super.set('activeStyle', activeStyle);
	}

	renderBasic() {
		this.setStyle(this.baseStyle);
	}

	renderActive() {
		this.setStyle(this.activeStyle);
	}
}