import GeoJSON from 'ol/format/GeoJSON';
import countriesData from './../../data/countries.geo.json';
import { CountryFeature } from './country.feature';

// this is mock survie which uses localStorage
class CountrySerializer {
  constructor() {
    this.format = new GeoJSON({
      dataProjection: 'EPSG:4326', 
      featureProjection: 'EPSG:3857'
    });
  }
  
  getFeatureCollection() {
    const serialized = localStorage.getItem('countryFeatures');
    
    if (!serialized) {
      const features = this.format.readFeatures(countriesData).map(feature => new CountryFeature(feature));
      this.serializeFeatures(features);
      return features;
    }

    const features = JSON.parse(serialized);
  
    return features.map(feature => {
      const deserialized = this.getDeserializedFeature(feature);
      return new CountryFeature(deserialized);
    });
  }

  serializeFeature(feature) {
    const serializedList = JSON.parse(localStorage.getItem('countryFeatures'));
    const index = serializedList.findIndex(ft => ft.id === feature.getId());

    serializedList[index] = this.getSerializedFeature(feature);
    localStorage.setItem('countryFeatures', JSON.stringify(serializedList))
  }

  serializeFeatures(features) {
    const serializedList = features.map(feature => this.getSerializedFeature(feature));
    localStorage.setItem('countryFeatures', JSON.stringify(serializedList));
  }

  getSerializedFeature(feature) {
    const serializedObject = this.format.writeFeatureObject(feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })

    return serializedObject;
  }
  
 
  getDeserializedFeature(feature) {
    const deserializedObject = this.format.readFeature(JSON.stringify(feature));
    return deserializedObject;
  }
}

export const serializer = new CountrySerializer();