module fpm {
  export class ViewParams {
    constructor(public x: number, public y: number,
		public w: number, public h: number) {}

    copy() { return new ViewParams(this.x, this.y, this.w, this.h); }
  }

  // this could slowly evolve into (part of) a 'User'
  export class ViewRect {
    view: ViewParams;  // area to draw
    draw: ViewParams;  // area to draw to
    user: User;
    
    constructor(user: User) {
      this.view = new ViewParams(0, 0, 500, 500);
      this.draw = new ViewParams(0, 0, 500, 500);
      this.user = user;
      var self = this;

      // $(function(){
      // 	$(document).keydown(function(e){
      // 	  //console.log(e.keyCode);
      // 	  switch (e.keyCode) {
      // 	  case 37: // left
      // 	    self.view.x -= 10;
      // 	    break;
      // 	  case 38: // up
      // 	    self.view.y -= 10;
      // 	    break;
      // 	  case 39: // right
      // 	    self.view.x += 10;
      // 	    break;
      // 	  case 40: // down
      // 	    self.view.y += 10;
      // 	    break;
      // 	  }
      // 	  gd.update(self.user);
      // 	});
      // });

      $(function(){
	$(document).on('wheel', function(e){
	  if (e.originalEvent.deltaY < 0) {
	    self.zoom_center(0.9);
	  } else {
	    self.zoom_center(1.1);
	  }
	  gd.update(self.user);
	});
      });
    }

    set_view(view: ViewParams) {
      this.view = view;
    }

    move_to(x: number, y: number) {
      this.view.x = x; this.view.y = y;
    }
    
    world_to_screen(x: number, y: number) {
      var scale = this.get_scale();
      return {x: (x - this.view.x) * scale.x,
	      y: (y - this.view.y) * scale.y,
	      w: scale.x, h: scale.y};
    }
    
    screen_to_world(x: number, y: number) {
      var scale = this.get_scale();
      return {x: x / scale.x + this.view.x,
	      y: y / scale.y + this.view.y,
	      w: 1 / scale.x, h: 1 / scale.y};
    }
    
    zoom_center(scale_factor: number) {
      var center = this.get_view_center();
      this.view.w *= scale_factor;
      this.view.h *= scale_factor;
      this.view.x = center.x - this.view.w / 2;
      this.view.y = center.y - this.view.h / 2;
    }
    
    get_view_center() {
      return {x: this.view.x + this.view.w / 2,
	      y: this.view.y + this.view.h / 2};
    }

    // consider adding two versions, for screen->world and vice-versa
    get_scale() {  // should be called like "scale_to_render" or something
      return {x: this.draw.w/this.view.w,
	      y: this.draw.h/this.view.h};
    }
  }
}
