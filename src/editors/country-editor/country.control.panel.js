import { Control } from 'ol/control';
import $ from 'jquery/dist/jquery';

export class CountryEditorControlPanel extends Control {
  constructor(map, elemId) {
    super({
      element: document.querySelector(elemId), 
      target: document.querySelector('#control-panel .card .card-body')
    });

    this.map = map;
    this.elem$ = $(elemId);
    this.title$ = this.elem$.find('#country-title-field');
    this.switcher$ = this.elem$.find('.btn-colored');
    this.elem$.hide();
    this.bindEvents();
  }

  bindEvents() {
    this.switcher$.on('click', ({target}) => {
      const rgbValue = $(target).attr('rgb');
      this.dispatchEvent({
        type: COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED,
        color: rgbValue
      })
    })
  }

  open(countryFeature) {
    this.feature = countryFeature;
    this.title$.val(this.feature.get('name'));
    this.elem$.slideDown(300);
  }

  close() {
    this.elem$.slideUp(200);
  }
}

export const COUNTRY_EDITOR_CONTROL_PANEL_EVENTS = {
  STYLE_CHANGED: 'COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED'
}