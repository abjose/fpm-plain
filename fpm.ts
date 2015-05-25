/// <reference path="jquery.d.ts" />
/// <reference path="Graph.ts" />
/// <reference path="User.ts" />
/// <reference path="GraphDrawer.ts" />
/// <reference path="InputManager.ts" />
/// <reference path="NodeRegistry.ts" />
/// <reference path="ViewRect.ts" />
/// <reference path="TextBox.ts" />

/*
BUGS
- don't zoom when scrolling textarea
- screwing up a bit when multiple selections and resize one
- janky panning - maybe panning flag not being adhered to properly in 
  inputmanager?

TODO NOW
- make IM constructor less hairy, put things into functions...
- really need to flesh out GraphNode? at least add move_to, draw, clear...
  or make this a separate class that things inherit from too, like Interactable
  and Drawable
- make everything (except registry) ID-based
- *** add stuff related to tagging... and improve graph-adding so can filter ***
- think about textarea markdown -> html stuff


- TOOLBAR 2DU
- hook up back button
- re-add dbl-click to add element - use InputManager
- when adding graph, ask for ID in popup dialog? if exists, will go there
- check dropdown menu option when adding element


FOR DATABASE
- just get something minimal working, so can update mongodb?
  will probably have to do URL stuff after all, but maybe in a less hacky way

guess you need to switch to using IDs FOR SURE in graph, and then
you'll just use MongoDB's IDs for those.
then just need to have global app stuff visible - for db queries at least, 
want to just get from db the right document
will probably want each textbox to be a document? then have local cache thing
most mongo code will probably be in the Registry...
then, later, can have RESTful interface for positioning / statefulness
just update manually, then if GET that know where to go

think easiest schema is just to have Nodes with id_ and something like 'data'
which is just a json object
convenient if have different schema for everything but seems overcomplicated






MONGO PLANS
- Project has id, title, tags, (what else?), graph (or nodes + edges?), 
  default_view
- Nodes have location, size, data
  at some point in future, use location for spatial querying in mongo
- example nodes: ProjectLink, TextBox

TODO for this:
- switch registry to all id-based (if not already)
- make a mongoose schema for Project and Node
- might need to change local stuff a bit - ideally registry can deal with 
  pure results from mongodb
- modify registry get and put to query/update db
- maybe have something else like a 'save' function that will persist
  everything in the registry (just in case) - can later do diffs or something
- I guess things like TextBoxes could just have a way of update-ing themselves
  in the registry? Like when they lose focus could let registry know, registry
  would then update db if necessary


I guess worth separating into MVC
so probably need to shift away from static GraphDrawer
have view thing that will check to see when model changes, will update text
or de-render self, ...


maybe call projects 'collections' instead?



TODO:
- maybe selection box you can drag out, select all of interior...
- use arrow keys to move to adjacent nodes?
- switch lots of things to using ids (particularly graph)
- add a little toolbar that maybe shows 'breadcrumbs' and also lets you switch
  'tools' (like create new graph (set filters, etc.), node, drawing, etc.)
  potential tools:
  ` selection box
  ` "navigation" tool (like 4 directional arrow symbol, for pan/zoom nav)
  ` graph?
  ` texbox
  ` drawing
  ` edge???? maybe not

LATER:
- add some tagging stuff - at least project/path titles...
- should have a 'DONE' collection
- should have paths displayed by project tag or something - whole path can be 
  highlighted when clicked?
- allow graph to update itself given diff
- add pictures and drawings :O
- maybe change the background color... change all the colors...blue and green
- fancy linking - make it so you can set ViewParams via address bar so can link
  maybe add GetURL to User
  need to intercept links: http://cross-browser.com/toys/link_interception.php
  get URL with document.location.href
  use history.replaceState to update URL
- consider converting back button to 'snail trail'/breadcrumbs or whatever

Potential better structure...
- move more global event handlers to graphdrawer?
- still have graph object, can construct/'reset' with json and update with diffs
- have mixins? Renderable and Movable? or just make part of graphnode
- have graphdrawer, takes graph
- make view part of graphdrawer


nodes won't always fit nicely into a grouping...how to have edges
going between layers of hierarchy without making things too
complicated?

if I have 
project 1: BECOME MINIMALLY SELF-SUFFICIENT
build rv -> get monthly expenses to $500 -> find land -> start farm -> ...
project 2: DEMOCRATIZE MEANS OF AUTOMATION
make simulator -> translate simulator to reality -> write polemics -> ...

problem is: if want to imply a 'weak ordering' between project 1 and 2 in the
sense that you think of things happening in that order but there's no strict
dependency, how do you do that?
I think you should just not have edges between them
or have edges, but have separate links to parts of both projects that you can
start whenever somewhere else, so code knows when to add them to global TODO


important things to work on soon for FPM:

- add ToJSON and FromJSON (maybe default constructor) and FromDiff? to graph
- after improving structure/splitting up files, add hierarchical nodes 
  (i.e. link to other JSON descriptions of graphs)
- stuff to help with TODOs
-- figure out tagging - maybe just have #TODO blahblah somewhere
-- filtering stuff - don't just make something that shows TODOs in hardcoded 
   way, nicer if can add new node and apply filters to it, can see everything 
   with particular tags or TODO or whatever... Might be worth coming up with 
   different way of displaying, like could display as just a list instead of 
   a graph...
   Although would be cool if go into "path view mode" that would show you 
   paths... and then maybe your TODO list could be a big "wall" of nodes moving
   to the right, all with no prereqs on leftmost side, then each (merged) path 
   moving right
   Though not sure you want to be so insistent on always showing graphs...
This could basically just consist of generating a new graph and
displaying them... so maybe that would actually be pretty easy.  Just
need a nice central repository, and maybe modify graphs to refer by ID
to the central repo?  And for the central repo can have some filtering
stuff, to allow to get things TODO, by tag, etc...can index on these
things at some point.


Probably less important stuff
- markdown-to-html stuff
- grab images of graph to display on hierarchical nodes (html2canvas fun)
*/

// *************************************************

// TODO: really need to have a 'draw' method instead of doing in constructor
// probably pass graphdrawer to TextBox so can register redraws better?


var registry = new fpm.NodeRegistry();

var the_graph = new fpm.Graph({
  id: "graph1", x: 350, y: 200, w: 80, h: 50, graph: the_other_graph,
});
var the_other_graph = new fpm.Graph({
  id: "graph2", x: 350, y: 200, w: 80, h: 50, graph: the_graph,
});

var n1 = new fpm.TextBox({
  id: "node1", x: 10, y: 10, w: 50, h: 250,
  text: "Hello, how are you doing today?",
  graph: the_graph,
});
var n2 = new fpm.TextBox({
  id: "node2", x: 100, y: 80, w: 250, h: 50,
  text: "I'm doing quite well, thank you very much!",
  graph: the_graph,
});
var n3 = new fpm.TextBox({
  id: "node3", x: 160, y: 170, w: 150, h: 150,
  text: "Fortunately, I am a robot.",
  graph: the_graph,
});
//var viewrect = new fpm.ViewRect();

registry.add(n1);
registry.add(n2);
registry.add(n3);
registry.add(the_graph);
registry.add(the_other_graph);

the_graph.add_node(n1);
the_graph.add_node(n2);
the_graph.add_node(n3);
the_graph.add_node(the_other_graph);
the_graph.add_edge(n1, n2);
the_graph.add_edge(n1, n3);
the_graph.add_edge(n2, n1);
the_graph.add_edge(n3, n2);

the_other_graph.add_node(n1);
the_other_graph.add_node(n2);
the_other_graph.add_node(n3);
the_other_graph.add_node(the_graph);
the_other_graph.add_edge(n1, n2);
the_other_graph.add_edge(n2, n1);
the_other_graph.add_edge(n2, n3);
the_other_graph.add_edge(n3, n2);
the_other_graph.add_edge(n3, n1);
the_other_graph.add_edge(n1, n3);

var user = new fpm.User();
user.set_graph(the_graph);

var gd = new fpm.GraphDrawer();
var im = new fpm.InputManager(user);


gd.update(user);



