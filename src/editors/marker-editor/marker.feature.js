import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { MarkerOverlayBuilder } from './controls/marker.overlay';

export class MarkerFeature extends Feature {
  constructor(point) {
		super(new Point(point));
		this.overlay = MarkerOverlayBuilder.getOverlay(point);

		this.on('change', function() {
			this.overlay.setPosition(this.getGeometry().getCoordinates())
		});

		this.set('source', './assets/icons/markers/icon3.png');
  }
}