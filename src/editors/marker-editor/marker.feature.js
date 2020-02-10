import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

export class MarkerFeature extends Feature {
  constructor(point) {
    super(new Point(point));

    super.setStyle(new Style({
      image: new Icon({
        scale: 0.6,
        src: './assets/icons/marker_icon.png'
      }),
      // text: new Text({
      //   text: 'Some place',
      //   fill: new Fill({color: '#5264ae'})
      // })
    }))
  }
}