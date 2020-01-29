import GeoJSON from 'ol/format/GeoJSON';
import { CountryFeature } from './country.feature';

class CountrySerializer {
  constructor() {
    this.format = new GeoJSON();
  }
  
  // TODO: mock method, redo
  getFeatureCollection() {
    const serializedList = JSON.parse(localStorage.getItem('countryFeatures'));
    
    return serializedList.map(feature => {
      const deserialized = this.getDeserializedFeature(feature);
      return new CountryFeature(deserialized);
    });
  }

  // TODO: mock method, redo
  serializeFeatures(features) {
    // it's a fake method
    const serializedList = features.map(feature => this.getSerializedFeature(feature));
    localStorage.setItem('countryFeatures', JSON.stringify(serializedList));
  }

  /*
    feature: CountryFeature -> Feature
    returns: short serialized feature object
  */
  getSerializedFeature(feature) {
    const serializedObject = this.format.writeFeatureObject(feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })

    return {
      ...serializedObject, 
      properties: {
        ...serializedObject.properties,
        showLabel: feature.showLabel || false,
        color: feature.color
      }
    }
  }
  
  /*
    feature: getSerializedFeature() short object
    returns: ol.Feature
  */
  getDeserializedFeature(feature) {
    const deserializedObject = this.format.readFeature(JSON.stringify(feature));
    return deserializedObject;

    // deep clone there or another way 
    return {
      ...deserializedObject, 
      color: feature.properties ? feature.properties.color : null, 
      showLabel: feature.properties ? feature.properties.showLabel : null
    };
  }
}

export const serializer = new CountrySerializer();