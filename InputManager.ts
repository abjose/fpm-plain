module fpm {
  export class InputManager {
    selected;
    pressed;
    init_drag_x: number; init_drag_y: number;
    init_vx: number; init_vy: number;
    panning;
    user: User; // ??
    
    constructor(user: User) {
      var self = this;
      this.user = user;
      this.selected = {};
      this.pressed = {};
      this.init_drag_x = 0; this.init_drag_y = 0;
      this.init_vx = 0; this.init_vy = 0;
      this.panning = false;

      $(function(){
	$(document).mousedown(function(e){
	  self.pressed['mouse'] = true;
	  self.init_drag_x = e.pageX;
	  self.init_drag_y = e.pageY;
	  self.init_vx = self.user.view.view.x;
	  self.init_vy = self.user.view.view.y;

	  //if (e.target.type != 'textarea') {
	  if (e.target.parentElement == null ||
	      e.target.parentElement.id != 'myDiv') {  // todo: bad
	    self.clear_selection();
	    self.panning = true;
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

	  gd.update(self.user);
	});
      });
      
      $(function(){
	$(document).mouseup(function(e){
	  delete self.pressed['mouse'];
	  self.panning = false;
	  // how can you this won't run before textbox version (meaning
	  // textbox wouldn't highlight)?
	  gd.update(self.user);
	});
      });

      $(function(){
	$(document).mousemove(function(e){
	  if (self.is_pressed('mouse')) {
	    var mouse_x = e.pageX; var mouse_y = e.pageY;
	    // TODO: would prefer not to use this.panning
	    // but...actually... should probably add a 'dragging' flag too
	    //if (e.target.type == 'textarea' && !self.panning) {
	    if (!self.panning &&
		e.target.parentElement != null && // todo: bad
		e.target.parentElement.id == 'myDiv') {  
	      //if (e.target.type != undefined && !self.panning) {
	      // weird, even when you set to != text area, still drags a bit...
	      // yes, and if you're dragging somethign and slip off
	      // without lifting mouse, will pan...
	      var selected_ids = self.get_selected();
	      for (var i = 0; i < selected_ids.length; ++i) {
		var node = self.selected[selected_ids[i]];
		if (node.editing != undefined && node.editing) continue;
		node.move_to(mouse_x - node.x_offset, mouse_y - node.y_offset,
			     self.user.view);
	      }
	    } else {
	      var scale = self.user.view.get_scale();
	      var world_dx = (e.pageX - self.init_drag_x) / scale.x;
	      var world_dy = (e.pageY - self.init_drag_y) / scale.y;
	      self.user.view.move_to(self.init_vx - world_dx,
				     self.init_vy - world_dy);
	    }
	    gd.update(self.user);
	  }
	});
      });

      // TODO: move these (and other ones) to their own functions so constructor
      // isn't enormous.
      $(function() {
      	$(document).keydown(function(e){
      	  //console.log(e.keyCode);
      	  switch (e.keyCode) {
	  case 16: // shift
	    self.pressed['shift'] = true;
	    break;
	  case 17: // control
	    self.pressed['ctrl'] = true;
	    break;
	  case 46: // delete
	    self.pressed['delete'] = true;
	    var selection = Object.keys(self.selected);
	    for (var i = 0; i < selection.length; ++i) {
	      var node = self.selected[selection[i]];
	      if ((node.editing != undefined && !node.editing) ||
		  (node.editing == undefined)) {
		node.clear();
	      }
	    }
	    break;
      	  }
      	});
      });

      $(function() {
      	$(document).keyup(function(e){
      	  //console.log(e.keyCode);
      	  switch (e.keyCode) {
	  case 16: // shift
	    delete self.pressed['shift'];
	    break;
	  case 17: // control
	    delete self.pressed['ctrl'];
	    break;
	  case 46: // delete
	    delete self.pressed['delete'];
	    break;
      	  }
      	});
      });

      // handle 'back'
      $(function(){
	$("#back").click(function(e){
	  console.log("back!");
	  var old_graph_id = user.pop_graph();
	  if (old_graph_id != undefined) {
	    gd.clear_nodes(registry.get(old_graph_id));
	    gd.update(user);
	  }
	});
      });

      $(function(){
	$(document).dblclick(function(e){
	  console.log($("#ToolChoice option:selected").text());
	  // need to have mapping from tool to actual tool
	});
      });
      
      /*
      $(function(){
	$(document).dblclick(function(e){
	  if (e.target.type != 'textarea') {
	    // prevent something in textbox instead of checking target?
	    var mouse_x = e.pageX;
	    var mouse_y = e.pageY;
	    var pt = viewrect.screen_to_world(e.pageX, e.pageY);
	    var w = 150; var h = 150;
	    graph.add_node(new fpm.TextBox({
	      id: "node"+Math.random(),
	      x: pt.x - w/2, y: pt.y - h/2, w: w, h: h,
	      text: "New textbox!",
	    }));
	    gd.update(graph);
	  }
	});
      });
      */

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

    notify_click(node: GraphNode) {
      if (this.is_pressed('ctrl')) {
	var selected = this.get_selected();
	if (selected.length == 1) {
	  var pred = this.selected[selected[0]];  // ugh pls switch to ids
	  if (!node.graph.edge_exists(pred, node)) {
	    node.graph.add_edge(pred, node);
	  } else {
	    node.graph.remove_edge(pred, node);
	  }
	}
      } else {
	this.conditional_clear_selection(node);
	this.add_selection(node);
      }
    }
  }
}


