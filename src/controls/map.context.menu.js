import { Control } from 'ol/control';
import $ from 'jquery/dist/jquery';
import { CountryFeature } from '../editors/country-editor/country.feature';

export class ContextMenuControl extends Control {
  constructor(map, elemId) {
    super({element: document.querySelector(elemId)});
    
    this.map = map;
    this.viewport = map.getViewport();
    this.left = 0;
    this.top = 0;
    this.elem$ = $(elemId);
    this.items$ = this.elem$.find('.dropdown-item');
    this.bindEvents();
  }

  bindEvents() {
    this.viewport.addEventListener('contextmenu', event => {
      const pixel = this.map.getEventPixel(event);
      this.open(pixel[0], pixel[1]);

      this.map.dispatchEvent({
        type: 'POINT_CLICKED',
        point: pixel
      });
      // TODO: do not very like this approach to be honest
      const features = this.map.getFeaturesAtPixel(pixel);
      
      if (features.find(ft => ft instanceof CountryFeature && ft.get('created'))) {
        this.items$.eq(0).text('Remove');
        this.items$.eq(0).attr('add', 0);
      } else {
        this.items$.eq(0).text('Add country');
        this.items$.eq(0).attr('add', 1);
      }
    });

    // add listener and if there's 
    this.items$.on('click', event => {
      const target = $(event.target);

      if (target.hasClass('select-country-item')) {
        if (+target.attr('add')) {
          this.dispatchEvent(MAP_CONTEXT_MENU_EVENTS.COUNTRY_OPTION_SELECTED);
        } else {
          this.dispatchEvent(MAP_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY_OPTION_SELECTED);
        }
      }
      
      this.close();
    })

    this.map.on('click', () => {
      if (this.opened) {
        this.close();
      }
    })
  }

  open(x, y) {
    this.opened = true;
    this.elem$.css({
      opacity: 0,
      height: 0,
      left: `${x + 5}px`,
      top: `${y + 5}px`
    });

    this.elem$.animate({
      opacity: 1,
      height: `${100}px`,
    }, 200)
  }

  close() {
    this.opened = false;
    this.elem$.animate({
      opacity: 0,
      height: 0,
      // width: 0
    }, 200)
  }
}

export const MAP_CONTEXT_MENU_EVENTS = {
  COUNTRY_OPTION_SELECTED: 'MAP_CONTEXT_MENU_EVENTS.COUNTRY_OPTION_SELECTED',
  REMOVE_COUNTRY_OPTION_SELECTED: 'MAP_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY_OPTION_SELECTED'
}