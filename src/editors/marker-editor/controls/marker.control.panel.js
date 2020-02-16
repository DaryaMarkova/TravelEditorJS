import $ from 'jquery/dist/jquery';
import { Control } from 'ol/control';
import { easeMarkerIn } from '../animations';
import { baseMarkerStyle } from '../marker.feature.style';

export class MarkerEditorControlPanel extends Control {
	constructor(map, elemId) {
		super({
			element: document.querySelector(elemId),
			target: document.querySelector('#control-panel .card .card-body')
		})

		this.map = map;
		this.elem$ = $(elemId);
		this.label$ = this.elem$.find('#marker-input-label');
		this.images$ = this.elem$.find('.marker-preview-img');
		this.elem$.hide();
		this.bindEvents();
	}

	bindEvents() {
		this.label$.on('input', ({target}) => {
			// TODO: throttle value
			const label = $(target).val();
			this.overlay$.text(label);
		});

		this.images$.on('click', ({target}) => {
			const src = $(target).attr('src');
			this.feature.set('source', src);
			easeMarkerIn(this.map, this.feature, () => {}, src);
		});
	}

	apply(feature) {
		if (!feature)
			return;

		this.feature = feature;
		this.overlay$ = $(this.feature.overlay.element).find('.marker-label-overlay');
		this.open();
	}

	open() {
    this.elem$.slideDown(300);
  }

  close() {
    this.elem$.slideUp(200);
  }
}
