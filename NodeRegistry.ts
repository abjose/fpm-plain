module fpm {

  export class NodeRegistry {

    nodes;
    
    constructor() {
      this.nodes = {};  // lol
    }

    get(id) {
      return this.nodes[id];
    }

    set(id, object) {
      this.nodes[id] = object;
    }
  }
  
}
