import { Fill, Stroke, Style } from 'ol/style';

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

export const baseFeatureStyle = (R, G, B) => {
  return new Style({
    fill: new Stroke({
      color:  `rgba(${R}, ${G}, ${B}, 0.8)`
    }),
  });
}

export const selectedFeatureStyle = (R, G, B) => {
  return new Style({
    fill: new Stroke({
      color:  `rgba(${R}, ${G}, ${B}, 0.8)`
    }),
    stroke: new Stroke({
      color: `rgba(${R}, ${G}, ${B}, 1)`,
      width: 3
    })
  });
}