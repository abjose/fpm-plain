module fpm {
  export class User {
    current_graph_id;
    stored_views;  // [id] -> view_param
    view: ViewRect;

    constructor() {
      this.stored_views = {};
      this.current_graph_id = "";
      this.view = new ViewRect(this);
    }

    set_graph(graph: Graph) {
      if (!(graph.id in this.stored_views)) {
	this.stored_views[graph.id] = graph.default_view.copy();
      }
      this.view.set_view(this.stored_views[graph.id]);
      this.current_graph_id = graph.id;
    }

    get_graph() {
      return registry.get(this.current_graph_id);
    }
  }
}
