import GeoJSON from 'ol/format/GeoJSON';
import { dbService } from '../../services/db.service.js';

export class MarkerSerializer {
  constructor() {
    this.format = new GeoJSON({
      featureProjection: 'EPSG:3857'
    });
  }

  getSerializedFeature(feature) {
    const serializedObject =  this.format.writeFeatureObject(feature);

    return {
      ...serializedObject,
      properties: {
        source: feature.get('source')
      }
    }
  }

  async serializeFeature(feature) {
    const store = await dbService.getStore('Markers', 'readwrite'), 
      request = store.add(this.getSerializedFeature(feature));
    
      return new Promise((resolve, reject) => {
        request.onsuccess = event => {
          const id = event.target.result;
          feature.setId(id);
          resolve(id);
        };
        request.onerror = event => reject(null)
      })
  }
}