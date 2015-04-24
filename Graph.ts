module fpm {
  export interface GraphNode {
    id: string;
    // not sure want these - maybe just get_center()?
    x: number; y: number; w: number; h: number;
    // want func like move_to?
    graph: Graph;  // parent graph
  }

  export class Graph implements GraphNode {
    // GraphNode stuff - mostly for when graph is being shown as a node.
    id: string;
    x: number; y: number; w: number; h: number;
    x_offset: number; y_offset: number;
    // Graph-y stuff.
    nodes;
    edges;  // Track edges separately to make GraphNode more minimal.
    default_view: ViewParams;
    graph: Graph;
    text_area;  // LOL PLS CHANGE, html_element?

    constructor(args) {
      this.id = args.id;
      this.x = args.x; this.y = args.y; this.w = args.w; this.h = args.h;
      this.x_offset = 0; this.y_offset = 0;
      
      this.nodes = {};
      this.edges = {};
      // probably make this private
      this.default_view = new ViewParams(0, 0, 500, 500);
    }
    
    add_node(node: GraphNode) {
      this.nodes[node.id] = node;
    }

    remove_node(node: GraphNode) {
      delete this.nodes[node.id];
      delete this.edges[node.id];
    }

    // switch to using IDs?
    add_edge(n1: GraphNode, n2: GraphNode) {
      if (n1.id in this.nodes && n2.id in this.nodes) {
	if (this.edges[n1.id] == undefined) {
	  this.edges[n1.id] = {};
	}
	this.edges[n1.id][n2.id] = true;
      } else {
	console.log("Tried to create an edge when both nodes didn't exist.");
      }
    }

    remove_edge(n1: GraphNode, n2: GraphNode) {
      delete this.edges[n1.id][n2.id];
    }

    successors(node: GraphNode) {
      // return node ids
      var node_edges = this.edges[node.id];
      if (node_edges == undefined) return [];
      return Object.keys(node_edges);
    }
    
    edge_exists(n1: GraphNode, n2: GraphNode) {
      return this.successors(n1).indexOf(n2.id) != -1;
    }

    draw(view: ViewRect) {
      if (this.text_area == undefined) {
	var self = this;
	this.text_area = $('<div>').css({
	  "position": "absolute",
	  "left": this.x,
	  "top": this.y,
	  "width": this.w,
	  "height": this.h,
	  "transform-origin": "0% 0%",
	});//.val(this.id);

	$(this.text_area).mousedown(function(e) {
	  im.notify_click(self);
	});
	
	$('#myDiv').append(this.text_area);
      }

      var scaled = view.world_to_screen(this.x, this.y);
      var color = 'black';
      if (im.is_selected(this)) {
	color = 'red';
      }
      $(this.text_area).css({
	"left": scaled.x+'px', "top": scaled.y+'px',
	"transform": "scale("+scaled.w+","+scaled.h+")"​,
	"background-color": color});
    }

    move_to(x: number, y: number, view: ViewRect) {
      var pt = user.view.screen_to_world(x, y);
      this.x = pt.x; this.y = pt.y;
    }

    clear() {
      $(this.text_area).remove();
    }
    
  }
}
