module fpm {
  export class TextBox implements GraphNode {
    id: string;
    x: number; y: number; w: number; h: number;
    text: string;
    text_area: any; // ...
    x_offset: number; y_offset: number;
    editing: boolean;
    graph: Graph;

    constructor(args) {
      this.id = args.id;
      this.x = args.x; this.y = args.y;
      this.w = args.w; this.h = args.h;
      this.text = args.text;
      this.graph = args.graph;

      this.x_offset = 0; this.y_offset = 0;
      this.editing = false;

      var textbox = this;

      this.text_area = $('<textarea>').css({
	"id": this.id,
	"position": "absolute",
	"left": this.x,
	"top": this.y,
	"width": this.w,
	"height": this.h,
	"transform-origin": "0% 0%",
      }).val(this.text);

      $(this.text_area).mousedown(function(e) {
	if (!textbox.editing) {
	  e.preventDefault();
	  im.notify_click(textbox);
	}
      });

      $(this.text_area).mouseup(function(e) {
	textbox.w = parseInt($(this).css("width"))
	textbox.h = parseInt($(this).css("height"))
      });

      $(this.text_area).dblclick(function(e) {
	textbox.editing = true;
	$(this).focus();
      });

      $(this.text_area).blur(function() {
	textbox.editing = false;
      });
      
      $('#myDiv').append(this.text_area);
    }

    draw(view: ViewRect) {  // should be graph?
      var scaled = view.world_to_screen(this.x, this.y);
      var color = 'black';
      if (im.is_selected(this)) {
	color = 'red';
      }
      $(this.text_area).css({
	"left": scaled.x+'px', "top": scaled.y+'px',
	"transform": "scale("+scaled.w+","+scaled.h+")"​,
	"border-color": color});
    }

    clear() {
      $(this.text_area).remove();
      // memory leak?
      // need to remove from graph and stuff
      // or consider having separate 'hide' and 'remove' fncs
    }

    move_to(x: number, y: number, view: ViewRect) {
      var pt = user.view.screen_to_world(x, y);
      this.x = pt.x; this.y = pt.y;
    }
  }
}
