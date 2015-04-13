module fpm {

  export class ViewRect {
    vx: number; vy: number; vw: number; vh: number;  // view rect
    rx: number; ry: number; rw: number; rh: number;  // render rect
    
    constructor() {
      this.vx = 0; this.vy = 0;
      this.vw = 500; this.vh = 500;
      this.rx = 0; this.ry = 0;
      this.rw = 500; this.rh = 500;
      var view = this;

      $(function(){
	$(document).keydown(function(e){
	  //console.log(e.keyCode);
	  switch (e.keyCode) {
	  case 37: // left
	    view.vx -= 10;
	    break;
	  case 38: // up
	    view.vy -= 10;
	    break;
	  case 39: // right
	    view.vx += 10;
	    break;
	  case 40: // down
	    view.vy += 10;
	    break;
	  // case 173: // -
	  //   view.zoom_center(0.9);
	  //   break;
	  // case 61:  // +
	  //   view.zoom_center(1.1);
	  //   break;
	  }
	  gd.update(graph);
	});
      });

      $(function(){
	$(document).on('wheel', function(e){
	  if (e.originalEvent.deltaY < 0) {
	    view.zoom_center(0.9);
	  } else {
	    view.zoom_center(1.1);
	  }
	  gd.update(graph);
	});
      });


      // hmm, just add move_to to viewrect? or translate
      // need to store original click position in inputhandler
      // so maybe just do most of this in inputhandler
      
      // $(function(){
      // 	$(document).mousemove(function(e){
      // 	  if (e.target.type != 'textarea' && im.is_pressed('mouse')) {
	    
      // 	    var mouse_x = e.pageX;
      // 	    var mouse_y = e.pageY;
      // 	    var pt = viewrect.screen_to_world(e.pageX, e.pageY);
      // 	    var w = 150; var h = 150;
      // 	    graph.add_node(new fpm.TextBox({
      // 	      id: "node"+Math.random(),
      // 	      x: pt.x - w/2, y: pt.y - h/2, w: w, h: h,
      // 	      text: "New textbox!",
      // 	    }));
      // 	    gd.update(graph);
      // 	  }
      // 	});
      // });

      
    }

    move_to(x: number, y: number) {
      this.vx = x; this.vy = y;
    }
    
    world_to_screen(x: number, y: number) {
      var scale = this.get_scale();
      return {x: (x - this.vx) * scale.x,
	      y: (y - this.vy) * scale.y,
	      sx: scale.x, sy: scale.y};
    }
    
    screen_to_world(x: number, y: number) {
      var scale = this.get_scale();
      return {x: x / scale.x + this.vx,
	      y: y / scale.y + this.vy,
	      sx: 1 / scale.x, sy: 1 / scale.y};
    }
    
    //scale_at_point(x: number, y: number, scale: number) {}
    zoom_center(scale_factor: number) {
      var center = this.get_view_center();
      this.vw *= scale_factor;
      this.vh *= scale_factor;
      this.vx = center.x - this.vw / 2;
      this.vy = center.y - this.vh / 2;
      //this.y = 2 * this.y / this.h + 1 - scale_factor;
    }
    
    get_view_center() {
      return {x: this.vx + this.vw / 2, y: this.vy + this.vh / 2};
    }

    // consider adding two versions, for screen->world and vice-versa
    get_scale() {  // should be called like "scale_to_render" or something
      return {x: this.rw/this.vw, y: this.rh/this.vh};
    }
  }

}
