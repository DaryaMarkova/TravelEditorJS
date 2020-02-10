import $ from 'jquery/dist/jquery';
import { ContextMenuControl } from '../../../controls/map.context.menu';

export class MarkerContextMenu extends ContextMenuControl {
  constructor(map) {
    super(map);

    this.map = map;

    this.menu$ = $('.marker-editor-context-menu');
    this.items$ = this.menu$.find('.dropdown-item');
    this.createItem$ = this.items$.eq(0);
  }

  apply() {
    super.root$.prepend(this.menu$);
    this.bindEvents();
    return this;
  }

  bindEvents() {
    this.createItem$.on('click', () => {
      this.map.dispatchEvent(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER);
      super.close();
    })
  }
}

export const MARKER_EDITOR_CONTEXT_MENU_EVENTS = {
  ADD_MARKER: 'MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER'
}