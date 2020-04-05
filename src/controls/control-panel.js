import { Control } from 'ol/control';

export class ControlPanel extends Control {
	constructor(elemId) {
		super({element: document.querySelector(elemId)})
	}
}