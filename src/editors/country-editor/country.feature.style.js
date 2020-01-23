import { Fill, Stroke, Style, Text } from 'ol/style';

const featureTextStyle = (label) => {
	return new Text({
		font: '12px Arial',
		backgroundFill: new Fill({color: 'white'}),
		backgroundStroke: new Stroke({color: '#e7e7e7'}),
		padding: [5,2,2,5],
		rotateWithView: true,
		text: label,
		overflow: true
	})
}

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

export const baseFeatureStyle = (R, G, B, label, showLabel = false) => {
  return () => {
    const polygonStyle = new Style({
      fill: new Fill({
        color:  `rgba(${R}, ${G}, ${B}, 0.8)`,
      }),
    });

    const textStyle = new Style({
      text: featureTextStyle(label),
      geometry: feature => featureGeometry(feature)
    })

    return showLabel ? [polygonStyle, textStyle] : [polygonStyle];
  }
}

export const selectedFeatureStyle = (R, G, B, label, showLabel = false) => {
  return () => {
    const polygonStyle = new Style({
      fill: new Fill({
        color:  `rgba(${R}, ${G}, ${B}, 0.8)`,
      }),
      stroke: new Stroke({
        color: `rgba(${R}, ${G}, ${B}, 1)`,
        width: 3
      }),
    })
    
    const textStyle = new Style({
      text: featureTextStyle(label),
      geometry: feature => featureGeometry(feature)
    })

    return showLabel ? [polygonStyle, textStyle] : [polygonStyle];
  }
}

const featureGeometry = feature => {
  const geometry = feature.getGeometry();

  return geometry.getType() === 'MultiPolygon' ? 
    getMaxPolygon(geometry.getPolygons()).getInteriorPoint() : 
    geometry.getInteriorPoint();
}

function getMaxPolygon(polygons) {
  let maxPolygon = polygons.shift();

  polygons.forEach(polygon => {
    if (polygon.getArea() > maxPolygon.getArea()) {
      maxPolygon = polygon;
    }
  })

  return maxPolygon;
}