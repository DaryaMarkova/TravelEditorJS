import GeoJSON from 'ol/format/GeoJSON';
import data from 'data/countries.json';
import { dbService } from 'services/db.service';
import { CountryFeature } from 'editors/country-editor/feature';

export class CountrySerializer {
	constructor() {
		this.format = new GeoJSON({dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
	}

	async getFeatureCollection() {
		const serializedList = await dbService.getDataFromStore('Countries');
		
		if (serializedList.length < 1) {
			return this.format.readFeatures(data).map(feature => new CountryFeature(feature));
		}

		// return serializedList.map(it => {
    //   const deserialized = this.getDeserializedFeature(it);
    //   return new CountryFeature(deserialized);
    // })
	}

	async serializeFeature() {

	}

	getSerializedFeature(feature) {

	}

	getDeserializedFeature(feature) {
		
	}
}


