import { easeIn } from 'ol/easing';
import { unByKey } from 'ol/Observable';
import { baseMarkerStyle } from './marker.feature.style';

export function easeMarkerIn(map, feature, onComplete, source) {
	const start = new Date().getTime();
	let listenerKey;
	
	function animate(event, duration = 300) {
		const frameState = event.frameState;
		const elapsed = frameState.time - start;
		const scale = easeIn(elapsed / duration);

		feature.setStyle(baseMarkerStyle(scale, source));

		if (scale >= 1) {
			feature.setStyle(baseMarkerStyle(1, source));
			unByKey(listenerKey);
			onComplete.call();
			return;
		}

		map.render();
	}

	map.render();
	listenerKey = map.on('postcompose', animate);
}
