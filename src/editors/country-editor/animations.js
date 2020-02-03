import { easeIn } from 'ol/easing';
import { unByKey } from 'ol/Observable';
import { baseFeatureStyle } from './country.feature.style';

export function easeFeatureIn(map, feature) {
  const start = new Date().getTime();
  let listenerKey;

  function animate(event, duration = 200) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    const opacity = easeIn(elapsed / duration);

    if (opacity > 0.8) {
      unByKey(listenerKey);
      return;
    }
    
    const style = baseFeatureStyle(
      feature.get('color'), 
      feature.get('name'), 
      feature.get('showLabel'), 
      opacity
    );

    feature.setStyle(style);

    map.render();
  }

  map.render();
  listenerKey = map.on('postcompose', animate);
}