import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

export class MarkerFeature extends Feature {
  constructor(point) {
    super(new Point(point));

    super.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 0.9],
        scale: 1,
        src: './assets/icons/marker_icon2.png'
      }),
      // text: new Text({
      //   text: 'Some place',
      //   fill: new Fill({color: '#5264ae'})
      // })
    }))
  }
}