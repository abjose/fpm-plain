module fpm {
  export class TextBox implements GraphNode {
    id: string;
    x: number; y: number; w: number; h: number;
    text: string;
    text_area: any; // ...
    x_offset: number; y_offset: number;
    dragging: boolean;
    editing: boolean;

    constructor(args) {
      this.id = args.id;
      this.x = args.x; this.y = args.y;
      this.w = args.w; this.h = args.h;
      this.text = args.text;

      this.x_offset = 0; this.y_offset = 0;
      this.dragging = false;
      this.editing = false;

      var textbox = this;

      this.text_area = $('<textarea>').css({
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
	  var box_x = parseInt($(this).css("left"))
	  var box_y = parseInt($(this).css("top"))
	  var mouse_x = e.pageX;// + 'px';
	  var mouse_y = e.pageY;// + 'px';
	  textbox.x_offset = mouse_x - box_x;
	  textbox.y_offset = mouse_y - box_y;
	  textbox.dragging = true;
	}
      });

      $(this.text_area).mouseup(function(e) {
	textbox.dragging = false;
	textbox.w = parseInt($(this).css("width"))
	textbox.h = parseInt($(this).css("height"))
	test_redraw_lines();
      });

      $(this.text_area).dblclick(function(e) {
	textbox.editing = true;
	$(this).focus();
      });

      $(this.text_area).blur(function() {
	textbox.editing = false;
      });

      $(this.text_area).mousemove(function(e) {
	if (textbox.dragging) {
	  var mouse_x = e.pageX;// + 'px';
	  var mouse_y = e.pageY;// + 'px';
	  textbox.move_to(mouse_x - textbox.x_offset,
			  mouse_y - textbox.y_offset);
	}
      });

      $('#myDiv').append(this.text_area);
    }

    draw_scaled() {
      var scaled = this.calculate_scaled();
      $(this.text_area).css({
	"left": scaled.x+'px', "top": scaled.y+'px',
	"transform": "scale("+scaled.w+","+scaled.h+")"​});
    }

    calculate_scaled() {
      var scale = viewrect.get_scale();
      return {x: (this.x - viewrect.vx) * scale.x,
	      y: (this.y - viewrect.vy) * scale.y,
	      w: scale.x, h: scale.y};
    }

    move_to(x: number, y: number) {
      // Kinda annoying - need to store translated coords for canvas
      // wait...pretty sure you're doing something wrong
      // really necessary to go in both directions?
      var pt = viewrect.screen_to_world(x, y);
      this.x = pt.x; this.y = pt.y;
      // Passed coords are in screen coordinates, so pass to css directly.
      $(this.text_area).css({"left": x+'px', "top": y+'px'});
    }
  }
}
