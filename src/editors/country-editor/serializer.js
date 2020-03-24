import GeoJSON from 'ol/format/GeoJSON';
import data from 'data/countries.json';
import { dbService } from 'services/db.service';
import { CountryFeature } from 'editors/country-editor/feature';

export class CountrySerializer {
	constructor() {
		this.format = new GeoJSON({dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
	}

	async getFeatureCollection() {

	}

	async serializeFeature() {

	}

	getSerializedFeature(feature) {

	}

	getDeserializedFeature(feature) {
		
	}
}


