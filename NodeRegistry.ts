module fpm {
  export class NodeRegistry {
    nodes;
    
    constructor() {
      this.nodes = {};  // lol
    }

    get(id) {
      return this.nodes[id];
    }

    add(node) {
      this.nodes[node.id] = node;
    }
  }
}
