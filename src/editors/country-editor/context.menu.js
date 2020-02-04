import { Control } from "ol/control";
import { CountryFeature } from "./country.feature";

export class ContextMenuControl extends Control {
  constructor(map) {
    super({element: document.querySelector('.country-editor-context-menu')});
    this.map = map;
    this.menu$ = $('.country-editor-context-menu');
    this.items$ = this.menu$.find('dropdown-item');
  }

  bindEvents() {
    this.map.on('POINT_CLICKED', ({point}) => {
      const features = this.map.getFeaturesAtPixel(point).find(
        feature => feature instanceof CountryFeature && feature.get('created')
      );

      if (features) {
        // TODO
      } else {
        // TODO
      }
    })
  }
}