
module fpm {
  export interface GraphNode {
    id: string;
    // not sure want these - maybe just get_center()?
    x: number; y: number;
    w: number; h: number;
    // want func like move_to?
  }

  export class Graph {
    nodes;
    edges;  // Track edges separately to make GraphNode more minimal.
    
    constructor() {
      this.nodes = {};
      this.edges = {};
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
  }
}
