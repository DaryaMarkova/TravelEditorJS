import { Fill, Stroke, Style, Text } from 'ol/style';

export const emptyFeatureStyle = () => {
  return new Style({
    stroke: new Stroke({color: 'rgba(0,0,0,0)'}),
    fill: new Fill({color: 'rgba(0,0,0,0)'})
  });
}

export const baseFeatureStyle = (color, opacity = 0.8) => {
	return new Style({
		fill: new Fill({
			color:  `rgba(${color}, ${opacity})`,
		})
	});
}

export const selectedFeatureStyle = color => {
	return new Style({
		fill: new Fill({color:  `rgba(${color}, 1)`}),
		stroke: new Stroke({
			color: 'rgba(255, 255, 255, 1)',
      width: 2
		})
	});
}

