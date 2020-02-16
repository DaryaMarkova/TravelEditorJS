import { Style, Icon } from 'ol/style';

export const baseMarkerStyle = (scaleValue, sourceImage='./assets/icons/markers/icon3.png') => {
	return new Style({
		image: new Icon({
			scale: scaleValue,
			src: sourceImage
		})
	})
}

export const selectedMarkerStyle = (scaleValue, sourceImage='./assets/icons/markers/icon3.png') => {
	return new Style({
		image: new Icon({
			scale: scaleValue,
			src: sourceImage
		})
	})
}