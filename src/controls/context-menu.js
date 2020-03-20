import { Control } from 'ol/control';

export class ContextMenuControl extends Control {
	constructor(elemId) {
		super({element: document.querySelector(elemId)})
		// root$, triggerButton$
	}
}