/// <reference path="Graph.ts" />
/// <reference path="GraphDrawer.ts" />
/// <reference path="InputManager.ts" />
/// <reference path="ViewRect.ts" />
/// <reference path="TextBox.ts" />

/*

TODO NOW
- move view into graphdrawer (i.e. construct it there...)
  then maybe pass view to things when drawing

TODO:
- add key handler stuff so can have multiple keys pressed at once
- fix mousemove event so not specific to textareas - if dragging, will
  drag all textareas that are selected. This will be like 'highlighting' and
  also fix issues with when you drag too fast.
  same with mouse release
- allow graph to update itself given diff?
- get dragging to pay attention to mousemoves outside of textareas
- get lines to redraw on zooming and panning around
- scale everything in graph, not just stuff hardcoded
- would be nice if could select multiple things (show selection with a div?
  or on canvas?) and drag them all around...
- allow connecting nodes with right click or something
- make sure to update graph description as you're building the graph
- MAKE STRUCTURE WAY FUCKING BETTER
- add pictures and drawings :O
- switch to dragging + zooming by scroll? but make sure still scrolls
  text area when you scroll in them...
- new nodes should appear centered at click


Potential better structure...
- move more global event handlers to graphdrawer?
- still have graph object, can construct/'reset' with json and update with diffs
- have mixins? Renderable and Movable? or just make part of graphnode
- have graphdrawer, takes graph
- make view part of graphdrawer
- just draw all dem nodes
- move this shit to the html file so don't have to recompile



nodes won't always fit nicely into a grouping...how to have edges
going between layers of hierarchy without making things too
complicated?

like if I have group 1:
BECOME MINIMALLY SELF-SUFFICIENT
make rv -> get monthly expenses to $500 -> make farm -> find land -> ...

and group 2:
DEMOCRATIZE MEANS OF AUTOMATION
make simulator -> translate simulator to reality -> write polemics -> ...

and I have an edge from group 1 to group 2, but at the same time these
things aren't necessarily _strictly_ dependent in terms of completion

so, don't need unique instances of nodes, that's probably the easiest way
just have all references to nodes be indirect, so can have like 10 instances
of a node in 10 different places and they all update the same thing

but that doesn't really solve the "strict TODO ordering" thing, right?
could just have different kinds of edges...  the way you were thinking
of solving it _within_ a group was basically like: the group implies a
weak relation, so no need to have arrows for anything other than
strict ordering requirements. If b doesn't need to be done before a,
but a and b need to be done before c, just have both a and b have
edges to c. Can do something similar at a larger scale?

Eh, maybe fundamentally different problem/usage issue. Basically want
to show a "weak ordering" of the way you're thinking about things
through time, even if not necessarily important that one thing is done
before another / concurrent work can be done...  So could either - not
use this way, just like arrange things in space to represent weak
ordering, or not worry about weak orderings or add some kind of
_explicit_ representation of weak ordering, like have the x dimension
in any space represent time...so earlier things would come to the
left, even if no explicit dependency (and somehow this would be
explicit? like could have a labeled axis I guess...)





important things to work on soon for FPM:

- add ToJSON and FromJSON (maybe default constructor) and FromDiff? to graph
- after improving structure/splitting up files, add hierarchical nodes 
  (i.e. link to other JSON descriptions of graphs)
- have central "repo" for all nodes, so can appear in multiple places at once 
  but all are references
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





/*
- add view class that registers some callbacks to update view
- give class something that transforms points from world coords to view and back
- don't use css positioning, write a special draw function for the 
  textareas that takes into account the view, scales and translate properly
*/



// *************************************************


// TODO: really need to have a 'draw' method instead of doing in constructor
// probably pass graphdrawer to TextBox so can register redraws better?

var im = new fpm.InputManager();

var graph = new fpm.Graph();

var n1 = new fpm.TextBox({
  id: "node1",
  x: 10, y: 10, w: 50, h: 250,
  text: "Hello, how are you doing today?"
});
var n2 = new fpm.TextBox({
  id: "node2",
  x: 100, y: 80, w: 250, h: 50,
  text: "I'm doing quite well, thank you very much!",
});
var n3 = new fpm.TextBox({
  id: "node3",
  x: 160, y: 170, w: 150, h: 150,
  text: "Fortunately, I am a robot.",
});
var viewrect = new fpm.ViewRect();


graph.add_node(n1);
graph.add_node(n2);
graph.add_node(n3);
graph.add_edge(n1, n2);
graph.add_edge(n1, n3);
graph.add_edge(n2, n1);
graph.add_edge(n3, n2);
console.log(graph);

var gd = new fpm.GraphDrawer();
gd.draw_nodes(graph);
var test_redraw_lines = function() {
  gd.draw_edges(graph);
};

// TODO: don't use jquery maybe

// Add new boxes on double click
$(function(){
  $(document).dblclick(function(e){
    if (e.target.type != 'textarea') {
      // hack, should probably prevent something in textbox instead of checking
      // target
      var mouse_x = e.pageX;
      var mouse_y = e.pageY;
      new fpm.TextBox({
	id: "node"+Math.random(),
	x: mouse_x, y: mouse_y, w: 150, h: 150,
	text: "New textbox!",
      });
    }
  });
});

// get dragging to work even if dragging too fast
// TODO: need some kind of global "is_dragging" thing, maybe a map or list
// $(function(){
//   $(document).dblclick(function(e){
//     if (e.target.type != 'textarea') {
//       // hack, should probably prevent something in textbox instead of checking
//       // target
//       var mouse_x = e.pageX;
//       var mouse_y = e.pageY;
//       new TextBox({
// 	id: "node"+Math.random(),
// 	x: mouse_x, y: mouse_y, w: 150, h: 150,
// 	text: "New textbox!",
//       });
//     }
//   });
// });
