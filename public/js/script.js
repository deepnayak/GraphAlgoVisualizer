// Minimum Spanning Tree
// Demonstration of Prim's algorithm and Kruskal's algorithm to
// compute the minimum spanning tree of a graph.

var path;

var vertices = [];
var edges = [];
var ans = 0;
var selectedVertex = [];
var verticesLayer = new Layer();
var edgesLayer = new Layer();
var mstLayer = new Layer();
var currEdgeLayer = new Layer();

function onMouseDown(event) {
  if(!event.modifiers.shift) {
    verticesLayer.activate();
    
    var newVer = new Vertex(event.point.x, event.point.y);
    var tempa = new Point(newVer.x, newVer.y);
    for(var k = 0; k < vertices.length; k++) {
      var tempb = new Point(vertices[k].x, vertices[k].y);
      // console.log(tempa.getDistance(tempb));
      if(tempa.getDistance(tempb) <= 50)
        return;
    }
    console.log("Here");
    path = new Path();
    path.strokeColor = 'white';

    var circle = new Path.Circle({
      center: event.point,
      radius: 25
      
    });
    newVer = new Vertex(event.point.x, event.point.y, circle);
    // var text = new PointText(new Point(event.point.x - 30, event.point.y - 30));
    // text.justification = 'center';
    // text.siz
    // text.fillColor = 'yellow';
    // text.content = vertices.length + 1;

    var text = new PointText({
      point: [event.point.x - 30, event.point.y - 30],
      content: vertices.length + 1,
      fillColor: 'yellow',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: 25
  });

    circle.strokeColor = 'black';
    circle.fillColor = 'white';


    circle.onClick = function(event) {
      if(!event.modifiers.shift) {
        this.fillColor = 'red';
        if(selectedVertex.length == 1) {
          currEdgeLayer.activate();
          var a = new Point(selectedVertex[0].x, selectedVertex[0].y);
          var b = new Point(newVer.x, newVer.y);
          var mstPath = new Path.Line(a, b);
          mstPath.strokeColor = '#98FB98';
          mstPath.strokeWidth = 3;
          selectedVertex[0].addToAdj(new Edge(selectedVertex[0], newVer));
          newVer.addToAdj(new Edge(newVer, selectedVertex[0]));
          edges.push(new Edge(selectedVertex[0], newVer));
          // edges.push();
          selectedVertex.pop();
        }
        else
          selectedVertex.push(newVer);
      }
      // console.log(selectedVertex);
    }

    vertices.push(newVer);
  }
  
};




$('#btn-compute').click(function() {
  var algo = $('#select-algo option:selected').val();

  if (typeof algo == 'undefined' || !algo) {
    return;
  }

  if (vertices.length == 0) {
    return;
  }

  // Disable computer and reset buttons until animation is finished
  $('#btn-compute').attr('disabled', true);
  $('#btn-reset').attr('disabled', true);

  if (algo == PRIM) {
    primsAlgorithm(vertices, function(mst) {
      if (!mst || typeof mst == 'undefined') {
        return;
      }
      if(!ans) {
        mstLayer.activate();
        mstLayer.removeChildren();
        currEdgeLayer.activate();
        currEdgeLayer.removeChildren();
        drawEdges(mst, 0);
      }
      else {
        $('#btn-compute').attr('disabled', false);
        $('#btn-reset').attr('disabled', false);
      }
    });
  } else if (algo == KRUSKAL) {
    kruskalsAlgorithm(vertices, function(mst) {
      if (!mst || typeof mst == 'undefined') {
        return;
      }
      if(mst.length < vertices.length - 1) {
        // console.log("F");
        //verticesLayer.removeChildren();
        not_mst();
        $('#btn-compute').attr('disabled', false);
        $('#btn-reset').attr('disabled', false);
        return;
      }
      mstLayer.activate();
      mstLayer.removeChildren();
      currEdgeLayer.activate();
      currEdgeLayer.removeChildren();
      drawEdges(mst, 0);
    });
  }
});

function not_mst() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// Recursively draw edges in minimum spanning tree one by one
function drawEdges(mst, i) {
  if (i >= mst.length) {
    $('#btn-compute').attr('disabled', false);
    $('#btn-reset').attr('disabled', false);
    return;
  }

  setTimeout(function() {
    var edge = mst[i];
    var a = new Point(edge.a.x, edge.a.y);
    var b = new Point(edge.b.x, edge.b.y);
    var mstPath = new Path.Line(a, b);
    mstPath.strokeColor = '#98FB98';
    mstPath.strokeWidth = 3;

    drawEdges(mst, i+1);
  }, 1000);
}

$('#btn-reset').click(function() {
  verticesLayer.removeChildren();
  mstLayer.removeChildren();
  currEdgeLayer.removeChildren();
  paper.view.draw();
  vertices = [];
  edges = [];
  selectedVertex = [];
  ans = 0;
});

function primsAlgorithm(vertices, callback) {
  var mst = [];
  var mstVertices = [];

  // Initialize all adjacency lists
  // for (var i = 0; i < vertices.length; i++) {
  //   var current = vertices[i];
  //   for (var j = 0; j < vertices.length; j++) {
  //     if (j == i) {
  //       continue;
  //     }
  //     current.addToAdj(new Edge(current, vertices[j]));
  //   }
  // }

  // Find arbitrary vertex to start the algorithm, add to the minimum
  // spanning tree
  console.log(vertices);
  mstVertices.push(vertices[0]);

  while (mstVertices.length != vertices.length) {
    // console.log(mstVertices);
    var minEdge = false;
    var minEdgeWeight = Number.MAX_VALUE;
    ans = 0;

    for (var i = 0; i < mstVertices.length; i++) {
      for (var j = 0; j < mstVertices[i].adj.length; j++) {
        if(mstVertices[i].adj[j] === undefined)
          console.log(i, j);
        var edge = mstVertices[i].adj[j];
        var vertex = edge.b;

        // Found smaller edge weight
        if (edge.weight() < minEdgeWeight) {
          // Make sure that vertex not already in MST
          if (includesVertex(mstVertices, vertex)) {
            if(i == mstVertices.length - 1 && j == mstVertices[i].adj.length - 1 && minEdgeWeight === Number.MAX_VALUE)
              ans = 1;
            continue;
          }
          minEdge = edge;
          minEdgeWeight = edge.weight();
        }
      }
    }
      if(ans) {
        not_mst();
        break;
      }
      mstVertices.push(minEdge.b);
      mst.push(minEdge);
  }

  callback(mst);
  return;
}

function kruskalsAlgorithm(vertices, callback) {
  var mst = [];
  var mstVertices = [];
  // var edges = [];

  // for (var i = 0; i < vertices.length; i++) {
  //   var current = vertices[i];
  //   for (var j = 0; j < vertices.length; j++) {
  //     if (j == i) {
  //       continue;
  //     }
  //     edges.push(new Edge(current, vertices[j]));
  //   }
  // }

  var uf = new UnionFind(vertices.length);

  // This needs to be fixed by using Min Heap instead of sorting
  edges.sort(function(a, b) {
    if (a.weight() < b.weight()) {
      return -1;
    } else if (a.weight() > b.weight()) {
      return 1;
    }
    return 0;
  });

  for (var i = 0; i < edges.length; i += 1) {
    // Stop algorithm when length of MST is V-1
    if (mst.length == vertices.length - 1) {
      break;
    }

    var edge = edges[i];
    var ia = getVertexIndex(vertices, edge.a);
    var ib = getVertexIndex(vertices, edge.b);
    var incA = includesVertex(mstVertices, edge.a);
    var incB = includesVertex(mstVertices, edge.b);

    if (!includesEdge(mst, edge) &&
        (!incA || !incB) &&
         uf.find(ia) != uf.find(ib)) {

      mst.push(edge);

      // Push vertex not in mstVertices
      if (!incA) {
        mstVertices.push(edge.a);
      } else {
        mstVertices.push(edge.b);
      }

      // Add index of a and b to same union find connected component
      uf.union(ia, ib);
    }
  }

  callback(mst);
}

function includesVertex(vertices, vertex) {
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].equals(vertex)) {
      return true;
    }
  }
  return false;
}

function includesEdge(edges, edge) {
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].contains(edge.a) && edges[i].contains(edge.b)) {
      return true;
    }
  }
  return false;
}

function getVertexIndex(vertices, vertex) {
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].equals(vertex)) {
      return i;
    }
  }
  return -1;
}
