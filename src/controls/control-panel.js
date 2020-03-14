import { Control } from 'ol/control';
// map control panel
export class ControlPanel extends Control {
	constructor(elemId) {
		super({element: document.querySelector(elemId)})
	}
}