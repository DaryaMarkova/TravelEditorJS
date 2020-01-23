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
    this.colorSwitcher$ = this.elem$.find('.btn-colored');
    this.labelSwitcher$ = this.elem$.find('#country-label-switch')
    this.elem$.hide();
    this.bindEvents();
  }

  bindEvents() {
    this.colorSwitcher$.on('click', ({target}) => {
      const value = $(target).attr('rgb');

      this.dispatchEvent({
        type: COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED,
        color: value,
        status: this.feature.showLabel
      })
    });

    this.labelSwitcher$.on('click', ({target}) => {
      const checked = $(target).is(':checked');

      this.dispatchEvent({
        type: COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.SHOW_LABEL_CHANGED,
        status: checked,
        color:  this.feature.color
      })
    })
  }

  open(countryFeature) {
    this.feature = countryFeature;
    this.title$.val(this.feature.get('name'));
    this.labelSwitcher$.prop("checked", !!this.feature.showLabel); 
    this.elem$.slideDown(300);
  }

  close() {
    this.elem$.slideUp(200);
  }
}

export const COUNTRY_EDITOR_CONTROL_PANEL_EVENTS = {
  STYLE_CHANGED: 'COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.STYLE_CHANGED',
  SHOW_LABEL_CHANGED: 'COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.SHOW_LABEL_CHANGED'
}