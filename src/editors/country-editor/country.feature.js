import Feature from 'ol/Feature';
import {
	emptyFeatureStyle, 
  baseFeatureStyle, 
	selectedFeatureStyle,
	featureTextStyle 
} from './country.feature.style.js';

export class CountryFeature extends Feature {
	constructor(feature) {
		super(feature.getProperties())
		
		super.setId(feature.getId());
		super.set('activeStyle', selectedFeatureStyle(0, 123, 255, feature.get('name')));
		super.set('baseStyle', baseFeatureStyle(0, 123, 255, feature.get('name')));
		super.setStyle(emptyFeatureStyle()) 
	}

	get baseStyle() {
		return super.get('baseStyle');
	}

	get activeStyle() {
		return super.get('activeStyle');
	}

	set baseStyle({color, zoom}) {
		if (!color) {
			const baseStyle = this.baseStyle;
			baseStyle.setText(featureTextStyle(this.get('name'), zoom));
			super.set('baseStyle', baseStyle);
			return;
		}

		const [r, g, b] = color.split(','); 
		const baseStyle = baseFeatureStyle(r, g, b, super.get('name'), zoom);
		super.set('baseStyle', baseStyle);
	} 

	set activeStyle({color, zoom}) {
		if (!color) {
			const activeStyle = this.activeStyle;
			activeStyle.setText(featureTextStyle(this.get('name'), zoom));
			super.set('activeStyle', activeStyle);
			return;
		}

		const [r, g, b] = color.split(',');
		const activeStyle = selectedFeatureStyle(r, g, b, super.get('name'), zoom);
		super.set('activeStyle', activeStyle);
	}
}