import $ from 'jquery/dist/jquery';
import { Control } from 'ol/control';

export class ContextMenuControl extends Control {
  constructor(map) {
    super({element: document.querySelector('#context-menu')});
    this.contextMenu$ = $('#context-menu');
    this.items$ = this.contextMenu$.find('.dropdown-item');
    this.map = map;
    this.left = 0; this.top = 0;
  }

  apply() {
    this.bindEvents();
    return this;
  }

  bindEvents() {
    this.map.getViewport().addEventListener('contextmenu', event => {
      event.preventDefault();
      
			const pixel = this.map.getEventPixel(event);
      this.map.pixelClickedAt = pixel;

      this.open(pixel);

      this.map.dispatchEvent({
        type: MAP_CONTEXT_MENU_EVENTS.CONTEXT_MENU_CALLED,
        point: pixel
      });
    })

    this.map.on('click', () => {
      if (this.opened) {
        this.close();
      }
    })
  }

  open(point) {
    const [x, y] = point;

    this.opened = true;
    this.contextMenu$.css({opacity: 0, height: 0, left: `${x + 5}px`, top: `${y + 5}px`});
		this.contextMenu$.animate({opacity: 1, height: `${100}px`}, 200)
  }

  close() {
    this.opened = false;
		this.contextMenu$.animate({opacity: 0, height: 0}, 200)
  }

  get root$() {
    return this.contextMenu$.find('.card');
  }
}

export const MAP_CONTEXT_MENU_EVENTS = {
  CONTEXT_MENU_CALLED: 'MAP_CONTEXT_MENU_EVENTS.CONTEXT_MENU_CALLED'
}