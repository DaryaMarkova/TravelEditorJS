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
    this.description$ = this.elem$.find('#country-description-field');
    this.colorSwitcher$ = this.elem$.find('.btn-colored');
    this.labelSwitcher$ = this.elem$.find('#country-label-switch')
    this.elem$.hide();
    this.bindEvents();
  }

  bindEvents() {
    this.colorSwitcher$.on('click', ({target}) => {
      const value = $(target).attr('rgb');

      this.feature.set('color', value);
      this.feature.activeStyle = { color: value }; 
      this.feature.baseStyle = { color: value };
      this.feature.renderActive();
    
      this.notifyChanged();     
    });

    this.labelSwitcher$.on('click', ({target}) => {
      const checked = $(target).is(':checked');

      this.feature.set('showLabel', checked);
      this.feature.activeStyle = { showLabel: checked }; 
      this.feature.baseStyle = {  showLabel: checked };
      this.feature.renderActive();
      this.notifyChanged();
    })

    //  TODO: add throttling
    this.description$.on('input', _ => {
      this.feature.set('description', this.description$.val());
      this.notifyChanged()
    });
  }

  applyToFeature(feature) {
    this.feature = feature;
    this.readProperties(feature);
    this.open();
  }

  notifyChanged() {
    this.dispatchEvent({
      type: COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE,
      feature: this.feature
    })
  }

  readProperties(feature) {
    this.title$.val(feature.get('name'));
    this.description$.val(feature.get('description'));
    this.labelSwitcher$.prop("checked", !!feature.get('showLabel')); 
  }

  open() {
    this.elem$.slideDown(300);
  }

  close() {
    this.elem$.slideUp(200);
  }
}

export const COUNTRY_EDITOR_CONTROL_PANEL_EVENTS = {
  UPDATE_FEATURE: 'COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE'
}