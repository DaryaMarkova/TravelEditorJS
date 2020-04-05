import { Feature }  from 'ol';
import { emptyFeatureStyle, baseFeatureStyle, selectedFeatureStyle } from './styles';
export class CountryFeature extends Feature {
	constructor(feature) {
		super(feature.getProperties());
		super.setId(feature.getId())
	}	
}