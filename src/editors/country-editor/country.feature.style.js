import { Fill, Stroke, Style, Text } from 'ol/style';

export const featureTextStyle = (label, zoom = 1) => {
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

export const baseFeatureStyle = (R, G, B, label, zoom) => {
  return new Style({
    fill: new Fill({
			color:  `rgba(${R}, ${G}, ${B}, 0.8)`,
		}),
		text: featureTextStyle(label, zoom)
  });
}

export const selectedFeatureStyle = (R, G, B, label, zoom) => {
  return new Style({
    fill: new Fill({
			color:  `rgba(${R}, ${G}, ${B}, 0.8)`,
    }),
    stroke: new Stroke({
      color: `rgba(${R}, ${G}, ${B}, 1)`,
      width: 3
		}),
		text: featureTextStyle(label, zoom)
  });
}
// geometry: function(feature) {
// 	var retPoint;

// 	if (feature.getGeometry().getType() === 'MultiPolygon') {
// 		retPoint =  getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
// 	} else if (feature.getGeometry().getType() === 'Polygon') {
// 		retPoint = feature.getGeometry().getInteriorPoint();
// 	}
	
// 	return retPoint;
// }
function getMaxPoly(polys) {
  var polyObj = [];
  // now need to find which one is the greater and so label only this
  for (var b = 0; b < polys.length; b++) {
    polyObj.push({ poly: polys[b], area: polys[b].getArea() });
  }
  polyObj.sort(function (a, b) { return a.area - b.area });

  return polyObj[polyObj.length - 1].poly;
 }