module fpm {
  export class GraphDrawer {
    // TODO: add a 'view'
    
    //elements: any[];
    
    constructor() {
      //this.elements = [];
    }

    draw_nodes(g: Graph) {
      // TODO: Add stuff like keeping a list of elements that you just update
      // rather than redoing each time.

      // just delete the old elements for now
      //var element = document.getElementById("element-id");
      //element.parentNode.removeChild(element);

      var node_ids = Object.keys(g.nodes);
      for (var i = 0; i < node_ids.length; i++) {
	//var node = g.nodes[node_ids[i]];
	// ehhhh don't do this with jquery....
	//var text_area = document.createElement("textarea");
	//text_area.style
	//document.appendChild(text_area);
      }
    }

    draw_edges(g: Graph) {
      var canvas = document.getElementById('myCanvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect (0, 0, canvas.width, canvas.height );
      var node_ids = Object.keys(g.nodes);
      for (var i = 0; i < node_ids.length; i++) {
	var node1 = g.nodes[node_ids[i]];
	var edge_ids = Object.keys(g.edges[node_ids[i]]);
	for (var j = 0; j < edge_ids.length; j++) {
	  var node2 = g.nodes[edge_ids[j]];
	  this.draw_edge(node1, node2, ctx);
	}
      }
    }

    draw_edge(node1, node2, ctx) {
      // this is pretty inefficient
      ctx.beginPath();
      var p1 = viewrect.world_to_screen(node1.x, node1.y);
      var p2 = viewrect.world_to_screen(node2.x, node2.y);
      ctx.moveTo(p1.x + node1.w * p1.sx / 2, p1.y + node1.h * p1.sy / 2);
      ctx.lineTo(p2.x + node2.w * p2.sx / 2, p2.y + node2.h * p2.sy / 2);
      ctx.stroke();
      this.draw_arrow(node1, node2, ctx);
    }

    draw_arrow(node1, node2, ctx) {
      // drawing arrow for edge from node1 to node2
      // get intersection and transform to screen coords
      var pt = this.arrow_pt(node1, node2);
      pt = viewrect.world_to_screen(pt.x, pt.y);
      // rotate and translate to arrow_pt and desired angle    
      ctx.save();
      ctx.beginPath();
      ctx.translate(pt.x, pt.y);
      console.log(this.arrow_angle(node1, node2));
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
