import Feature from 'ol/Feature';
import {
	emptyFeatureStyle, 
  baseFeatureStyle, 
	selectedFeatureStyle,
} from './country.feature.style.js';
import Overlay from 'ol/Overlay';
import { featureGeometry } from './country.feature.style';
import $ from 'jquery/dist/jquery';

// TODO: rewrite
export class CountryFeature extends Feature {
	constructor(feature) {
		super(feature.getProperties())		
		this.init(feature);
	}

	init(feature) {
		const id = feature.getId(), color = feature.get('color') || '0,123,255', name = feature.get('name');
		const showLabel = feature.get('showLabel') || false;
		const baseStyle = baseFeatureStyle(color, name, showLabel);
		const defaultStyle = feature.get('created') ? baseStyle : emptyFeatureStyle();

		super.setId(id);
		super.setProperties({
			'activeStyle': selectedFeatureStyle(color, name, showLabel),
			'baseStyle': baseStyle,
			'showLabel': showLabel,
			'color': color
		});

		super.setStyle(defaultStyle);
		this.createOverlay();
	}

	// TODO - move to separate fabric
	createOverlay() {
		const container$ = $('.country-overlays-container');
		const overlay$ = $('.country-label-overlay');
		const overlayId =  `country-label-overlay_${this.getId()}`;
		const featureOverlay$ = overlay$.clone();

		featureOverlay$.attr('id', overlayId);
		featureOverlay$.text(this.get('name'));

		container$.append(featureOverlay$);
		
		this.overlay = new Overlay({
			element: document.getElementById(overlayId),
			position: featureGeometry(this).getCoordinates(),
			positioning: 'center-center'
		});
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

	clear() {
		super.set('created', false);
		super.set('showLabel', false);
		super.setStyle(emptyFeatureStyle());
	}
}