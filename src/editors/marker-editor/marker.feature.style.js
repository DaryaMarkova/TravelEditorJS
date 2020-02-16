import { Style, Icon } from 'ol/style';

export const baseMarkerStyle = (scaleValue) => {
	return new Style({
		image: new Icon({
			scale: scaleValue,
			src: './assets/icons/markers/icon3.png'
		})
	})
}

export const selectedMarkerStyle = (scaleValue) => {
	return new Style({
		image: new Icon({
			scale: scaleValue,
			src: './assets/icons/markers/icon1.png'
		})
	})
}