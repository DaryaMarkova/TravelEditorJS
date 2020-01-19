import { Fill, Stroke, Style, Text } from 'ol/style';

//TODO: dynamic change text size depending on map zoom
export const emptyFeatureStyle = () => {
  return new Style({
    stroke: new Stroke({
      color: 'rgba(0,0,0,0)'
    }),
    fill: new Fill({
      color: 'rgba(0,0,0,0)'
		})
  });
}

export const baseFeatureStyle = (R, G, B, label) => {
  return new Style({
    fill: new Stroke({
      color:  `rgba(${R}, ${G}, ${B}, 0.8)`
		}),
		text: new Text({
			font: '16px Arial',
			backgroundFill: new Fill({color: 'white'}),
			backgroundStroke: new Stroke({color: '#e7e7e7'}),
			padding: [5,5,5,8],
			rotateWithView: true,
			text: label,
			overflow: true
		})
  });
}

export const selectedFeatureStyle = (R, G, B, label) => {
  return new Style({
    fill: new Stroke({
      color:  `rgba(${R}, ${G}, ${B}, 0.8)`
    }),
    stroke: new Stroke({
      color: `rgba(${R}, ${G}, ${B}, 1)`,
      width: 3
		}),
		text: new Text({
			font: '16px Arial',
			backgroundFill: new Fill({color: 'white'}),
			backgroundStroke: new Stroke({color: '#e7e7e7'}),
			padding: [5,5,5,8],
			rotateWithView: true,
			text: label,
			overflow: true
		})
  });
}