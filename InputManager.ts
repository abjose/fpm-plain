module fpm {

  export class InputManager {

    selected;
    pressed;
    
    constructor() {
      var self = this;
      this.selected = {};
      this.pressed = {};

      // $(function(){
      // 	$(document).mousemove(function(e){
      // 	  if (e.target.type != 'textarea') {
      // 	    var mouse_x = e.pageX;
      // 	    var mouse_y = e.pageY;
      // 	    new fpm.TextBox({
      // 	      id: "node"+Math.random(),
      // 	      x: mouse_x, y: mouse_y, w: 150, h: 150,
      // 	      text: "New textbox!",
      // 	    });
      // 	  }
      // 	});
      // });

      $(function(){
	$(document).mousedown(function(e){
	  self.pressed['mouse'] = true;
	  
	  if (e.target.type != 'textarea') {
	    self.clear_selection();
	  }

	  var ids = Object.keys(self.selected);
	  for (var i = 0; i < ids.length; ++i) {
	    var node = self.selected[ids[i]];
	    var box_x = parseInt($(node.text_area).css("left"))
	    var box_y = parseInt($(node.text_area).css("top"))
	    var mouse_x = e.pageX;// + 'px';
	    var mouse_y = e.pageY;// + 'px';
	    node.x_offset = mouse_x - box_x;
	    node.y_offset = mouse_y - box_y;
	  }

	  gd.update(graph);
	});
      });

      // screwing up a bit when multiple selections and resize one
      
      $(function(){
	$(document).mouseup(function(e){
	  delete self.pressed['mouse'];
	  // how can you this won't run before textbox version (meaning
	  // textbox wouldn't highlight)?
	  gd.update(graph);
	});
      });

      $(function(){
	$(document).mousemove(function(e){
	  if (self.is_pressed('mouse')) {
	    var mouse_x = e.pageX; var mouse_y = e.pageY;
	    var ids = Object.keys(self.selected);
	    for (var i = 0; i < ids.length; ++i) {
	      var node = self.selected[ids[i]];
	      if (node.editing) continue;
	      node.move_to(mouse_x - node.x_offset, mouse_y - node.y_offset);
	    }
	    gd.update(graph);
	  }
	});
      });

      // TODO: move these (and other ones) to their own functions so constructor
      // isn't enormous.
      $(function(){
      	$(document).keydown(function(e){
      	  //console.log(e.keyCode);
      	  switch (e.keyCode) {
	  case 16: // shift
	    self.pressed['shift'] = true;
	    break;
	  case 17: // control
	    self.pressed['ctrl'] = true;
	    break;
      	  }
      	});
      });

      $(function(){
      	$(document).keyup(function(e){
      	  //console.log(e.keyCode);
      	  switch (e.keyCode) {
	  case 16: // shift
	    delete self.pressed['shift'];
	    break;
	  case 17: // control
	    delete self.pressed['ctrl'];
	    break;

      	  }
      	});
      });

      
    }

    is_pressed(button: string) {
      return button in this.pressed;
    }

    is_selected(node) {
      return node.id in this.selected;
    }
    
    add_selection(node) {
      this.selected[node.id] = node;
    }

    remove_selection(node) {
      delete this.selected[node.id];
    }

    clear_selection() {
      this.selected = {};
    }

    conditional_clear_selection(node) {
      if (!im.is_pressed('shift')) {
	if (Object.keys(this.selected).length == 1 ||
	    !(node.id in this.selected)) {
	  this.clear_selection();
	}
      }
    }

    get_selected() {
      return Object.keys(this.selected);
    }
    
  }
}

