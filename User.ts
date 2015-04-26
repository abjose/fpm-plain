module fpm {
  export class User {
    graph_stack: string[];  // stack of graph ids
    stored_views;  // [id] -> view_param
    view: ViewRect;
    
    constructor() {
      this.stored_views = {};
      this.graph_stack = [];
      this.view = new ViewRect(this);
    }

    set_graph(graph: Graph) {
      if (!(graph.id in this.stored_views)) {
	this.stored_views[graph.id] = graph.default_view.copy();
      }
      this.view.set_view(this.stored_views[graph.id]);
      // TODO: 'pop back' to ID if already in garph_stack
      this.graph_stack.push(graph.id);
    }

    get_graph() {
      return registry.get(this.graph_stack[this.graph_stack.length-1]);
    }

    pop_graph() {
      if (this.graph_stack.length > 0) {
	this.graph_stack.pop();
      }
    }
  }
}
