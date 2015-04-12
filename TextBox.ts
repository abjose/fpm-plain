module fpm {
  export class TextBox implements GraphNode {
    id: string;
    x: number; y: number; w: number; h: number;
    text: string;
    text_area: any; // ...
    x_offset: number; y_offset: number;
    editing: boolean;

    constructor(args) {
      this.id = args.id;
      this.x = args.x; this.y = args.y;
      this.w = args.w; this.h = args.h;
      this.text = args.text;

      this.x_offset = 0; this.y_offset = 0;
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
	  // Kinda like without preventDefault, can edit immediately.
	  // but selection issues...
	  e.preventDefault();
	  im.conditional_clear_selection(textbox);
	  im.add_selection(textbox);
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

    draw() {
      var scaled = this.calculate_scaled();
      var color = 'black';
      if (im.is_selected(this)) {
	color = 'red';
      }
      $(this.text_area).css({
	"left": scaled.x+'px', "top": scaled.y+'px',
	"transform": "scale("+scaled.w+","+scaled.h+")"​,
	"border-color": color});
    }

    calculate_scaled() {
      var scale = viewrect.get_scale();
      return {x: (this.x - viewrect.vx) * scale.x,
	      y: (this.y - viewrect.vy) * scale.y,
	      w: scale.x, h: scale.y};
    }

    move_to(x: number, y: number) {
      var pt = viewrect.screen_to_world(x, y);
      this.x = pt.x; this.y = pt.y;
    }
  }
}
