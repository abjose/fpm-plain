module fpm {
  export class GraphDrawer {
    
    constructor() {}

    update(user: User) {
      this.draw_edges(user.get_graph(), user.view);
      this.draw_nodes(user.get_graph(), user.view);
    }

    draw_nodes(graph: Graph, view: ViewRect) {
      var node_ids = Object.keys(graph.nodes);
      for (var i = 0; i < node_ids.length; i++) {
	var node = graph.nodes[node_ids[i]];
	node.draw(view);
      }
    }

    clear_nodes(graph: Graph) {
      var node_ids = Object.keys(graph.nodes);
      for (var i = 0; i < node_ids.length; i++) {
	// DO THIS THROUGH REGISTRY!!
	var node = graph.nodes[node_ids[i]];
	node.clear();
      }
    }

    draw_edges(graph: Graph, view: ViewRect) {
      var canvas = document.getElementById('myCanvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var node_ids = Object.keys(graph.nodes);
      for (var i = 0; i < node_ids.length; i++) {
	var node1 = graph.nodes[node_ids[i]];
	var edge_ids = graph.successors(node1);
	for (var j = 0; j < edge_ids.length; j++) {
	  var node2 = graph.nodes[edge_ids[j]];
	  this.draw_edge(node1, node2, ctx, view);
	}
      }
    }

    draw_edge(node1, node2, ctx, view: ViewRect) {
      // this is pretty inefficient
      ctx.beginPath();
      var p1 = view.world_to_screen(node1.x, node1.y);
      var p2 = view.world_to_screen(node2.x, node2.y);
      ctx.moveTo(p1.x + node1.w * p1.w / 2, p1.y + node1.h * p1.h / 2);
      ctx.lineTo(p2.x + node2.w * p2.w / 2, p2.y + node2.h * p2.h / 2);
      ctx.stroke();
      this.draw_arrow(node1, node2, ctx, view);
    }

    draw_arrow(node1, node2, ctx, view: ViewRect) {
      // get intersection and transform to screen coords
      var pt = this.arrow_pt(node1, node2);
      pt = view.world_to_screen(pt.x, pt.y);
      // rotate and translate to arrow_pt and desired angle    
      ctx.save();
      ctx.beginPath();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(this.arrow_angle(node1, node2));
      // draw arrow
      ctx.moveTo(0, 0);
      ctx.lineTo(-15,  6);
      ctx.lineTo(-15, -6);
      ctx.fill();    
      ctx.restore();   
    }

    arrow_pt(node1, node2) {
      // get center of both nodes
      // consider having get_center...
      var c1 = {x: node1.x + node1.w / 2, y: node1.y + node1.h / 2};
      var c2 = {x: node2.x + node2.w / 2, y: node2.y + node2.h / 2};

      var p1; var p2; var e1; var e2;
      // branch on relative location of centers (reduce to two intersections)
      if (c1.x > c2.x) {
	// intersection might be on right edge of node2
	e1 = {x: node2.x + node2.w, y: node2.y};
	e2 = {x: node2.x + node2.w, y: node2.y + node2.h};
	p1 = this.line_intersection(c1, c2, e1, e2);
      } else {
	// intersection might be on left edge of node2
	e1 = {x: node2.x, y: node2.y};
	e2 = {x: node2.x, y: node2.y + node2.h};
	p1 = this.line_intersection(c1, c2, e1, e2);
      }
      if (c1.y < c2.y) {
	// intersection might be on top edge of node2
	e1 = {x: node2.x, y: node2.y};
	e2 = {x: node2.x + node2.w, y: node2.y};
	p2 = this.line_intersection(c1, c2, e1, e2);
      } else {
	// intersection might be on bottom edge of node2
	e1 = {x: node2.x, y: node2.y + node2.h};
	e2 = {x: node2.x + node2.w, y: node2.y + node2.h};
	p2 = this.line_intersection(c1, c2, e1, e2);
      }

      // check to see which possibility is more likely
      var p1_score = ((Math.abs(p1.x - c2.x) - node2.w/2) +
		      (Math.abs(p1.y - c2.y) - node2.h/2));
      var p2_score = ((Math.abs(p2.x - c2.x) - node2.w/2) +
		      (Math.abs(p2.y - c2.y) - node2.h/2));

      if (p1_score < p2_score) return p1;
      return p2;
    }
    
    line_intersection(a, b, c, d) {
      // According to wikipedia, find the line between a-b and c-d
      // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
      var numer_x = (a.x*b.y - a.y*b.x) * (c.x - d.x) -
	(a.x - b.x) * (c.x*d.y - c.y*d.x);
      var numer_y = (a.x*b.y - a.y*b.x) * (c.y - d.y) -
	(a.y - b.y) * (c.x*d.y - c.y*d.x);
      var denom = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
      if (Math.abs(denom) < 0.0001) return undefined;
      // ... other edge cases
      return {x: numer_x / denom, y: numer_y / denom};
    }

    arrow_angle(node1, node2) {
      var c1 = {x: node1.x + node1.w / 2, y: node1.y + node1.h / 2};
      var c2 = {x: node2.x + node2.w / 2, y: node2.y + node2.h / 2};
      return Math.atan2(c2.y - c1.y, c2.x - c1.x);
    }
  }
}
