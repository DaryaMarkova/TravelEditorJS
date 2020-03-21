import { Control } from 'ol/control';
import $ from 'jquery';

export class ContextMenuControl extends Control {
	constructor(elemId, map) {
		super({element: document.querySelector(elemId)})
		this.map = map;
		this.root$ = $('.travel-map__context-menu');
		this.button$ = $('#travel-map__context-menu-button');
		this.bindEvents();
	}

	bindEvents() {
		this.map.getViewport().addEventListener('contextmenu', event => {
			event.preventDefault();

			const pixel = this.map.getEventPixel(event);
			
			this.root$.css({left: `${pixel[0]}px`, top: `${pixel[1]}px`});
			this.button$.trigger('click');
		})
	}
}