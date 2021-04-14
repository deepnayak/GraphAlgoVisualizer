// Minimum Spanning Tree
// Demonstration of Prim's algorithm and Kruskal's algorithm to
// compute the minimum spanning tree of a graph.

var path;
var mid;
var midpt;
var normal;
var vertices = [];
var edges = [];
var curRun = []
var ans = 0;
var selectedVertex = [];
var verticesLayer = new Layer();
var edgesLayer = new Layer();
var mstLayer = new Layer();
var currEdgeLayer = new Layer();

// const sleep = (milliseconds) => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds))
// }

function onMouseDown(event) {
  if(!event.modifiers.shift) {
    verticesLayer.activate();
    path = new Path();
    path.strokeColor = 'white';
    var circle = new Path.Circle({
      center: event.point,
      radius: 0
    });
    var newVer = new Vertex(event.point.x, event.point.y, circle);
    var tempa = new Point(newVer.x, newVer.y);
    for(var k = 0; k < vertices.length; k++) {
      var tempb = new Point(vertices[k].x, vertices[k].y);
      // console.log(tempa.getDistance(tempb));
      if(tempa.getDistance(tempb) <= 50)
        return;
    }
    console.log("Here");

    circle = new Path.Circle({
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
    circle.strokeWidth = 3;
    circle.fillColor = 'white';


    circle.onClick = function(event) {
      if(!event.modifiers.shift) {
        this.fillColor = 'red';
        if(selectedVertex.length == 1) {
          if(!selectedVertex[0].equals(newVer)) {
            // var temp = new Edge(selectedVertex[0], newVer);
            // for(var s = 0; s < edges.length; s++) {
            //   if(edges[s].equals(temp)) {
            //     return;
            //   }
            // }


            currEdgeLayer.activate();
            var a = new Point(selectedVertex[0].x, selectedVertex[0].y);
            var b = new Point(newVer.x, newVer.y);
            var mstPath = new Path.Line(a, b);
            mstPath.strokeColor = '#98FB98';
            // mstPath.strokeColor = 'red';
            mstPath.strokeWidth = 3;
            
            var curEdge = new Edge(newVer, selectedVertex[0]);
            mid = mstPath.length/2;
            midpt = mstPath.getPointAt(mid);
            normal = mstPath.getNormalAt(mid) * 20;
            var txt = new PointText({
               point: [(midpt+normal).x , (midpt+normal).y],
               content: Math.round(curEdge.weight()),
               fillColor: '#2FF3E0',
               fontFamily: 'Courier New',
               fontWeight: 'bold',
               fontSize: 15
             });
             
            selectedVertex[0].addToAdj(new Edge(selectedVertex[0], newVer, txt));
            newVer.addToAdj(new Edge(newVer, selectedVertex[0], txt));
            edges.push(new Edge(selectedVertex[0], newVer, txt));
  
            selectedVertex.pop();
          }
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

  // Disable compute and reset buttons until animation is finished
  $('#btn-compute').attr('disabled', true);
  $('#btn-reset').attr('disabled', true);

  if (algo == PRIM) {
    primsAlgorithm(vertices, function(mst) {
      if (!mst || typeof mst == 'undefined') {
        return;
      }
      if(!ans) {
        currEdgeLayer.activate();
        currEdgeLayer.removeChildren();
        mstLayer.activate();
        mstLayer.removeChildren();
        for(var d = 0; d < edges.length; d++) {
          var a = new Point(edges[d].a.x, edges[d].a.y);
          var b = new Point(edges[d].b.x, edges[d].b.y);
          var mstPath = new Path.Line(a, b);
          mstPath.strokeColor = 'grey';
          mstPath.strokeWidth = 3;
          mid = mstPath.length/2;
          midpt = mstPath.getPointAt(mid);
          normal = mstPath.getNormalAt(mid) * 20;
          var txt = new PointText({
              point: edges[d].label.point,
              content: Math.round(edges[d].weight()),
              fillColor: 'grey',
              fontFamily: 'Courier New',
              fontWeight: 'bold',
              fontSize: 15
            });
        //edges[d].label.fillColor = 'grey';
        }
        console.log(curRun);
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
      for(var d = 0; d < edges.length; d++) {
        var a = new Point(edges[d].a.x, edges[d].a.y);
        var b = new Point(edges[d].b.x, edges[d].b.y);
        var mstPath = new Path.Line(a, b);
        mstPath.strokeColor = 'grey';
        mstPath.strokeWidth = 3;
        mid = mstPath.length/2;
        midpt = mstPath.getPointAt(mid);
        normal = mstPath.getNormalAt(mid) * 20;
        var txt = new PointText({
            point: edges[d].label.point,
            content: Math.round(edges[d].weight()),
            fillColor: 'grey',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 15
          });
        console.log(edges[d].label);
        //edges[d].label.fillColor = 'grey';
      }
      drawEdges(mst, 0);
    });
  }
  else if (algo == BORUVKA) {
    boruvkasAlgorithm(vertices, function(mst) {
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

function mstt() {
  // Get the snackbar DIV
  var y = document.getElementById("snackbarr");

  // Add the "show" class to DIV
  y.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
}

// function highlightVertex(i, j) {
//   if(curRun[i].length == j)
//     return;
//   setTimeout(function() {
//     if(j !== 0)
//     curRun[i][j-1].circle.strokeColor = 'black';
//     curRun[i][j].circle.strokeColor = '#aefd6c';
//     highlightVertex(i, j+1);
//   }, 1000);
// }



function loopThroughArray(array, firstElement, callback, interval) {
  // prevElement = firstElement;
  var newLoopTimer = new LoopTimer(function (time) {
      var element = array.shift();
      callback(prevElement, element, time - start);
      prevElement = element;
      if(array.length == 0)
        newLoopTimer.stop();
      // array.push(element);
  }, interval);
  
  // console.log(newLoopTimer);
  // console.log(array.length);
  var start = newLoopTimer.start();
};

// Timer 
function LoopTimer(render, interval) {
  var timeout;
  var lastTime;

  this.start = startLoop;
  this.stop = stopLoop;

  // Start Loop
  function startLoop() {
      timeout = setTimeout(createLoop, 0);
      lastTime = Date.now();
      return lastTime;
  }
  
  // Stop Loop
  function stopLoop() {
      clearTimeout(timeout);
      return lastTime;
  }
  
  // The actual loop
  function createLoop() {
      var thisTime = Date.now();
      var loopTime = thisTime - lastTime;
      var delay = Math.max(interval - loopTime, 0);
      timeout = setTimeout(createLoop, delay);
      lastTime = thisTime + delay;
      render(thisTime);
  }
}


// Recursively draw edges in minimum spanning tree one by one
function drawEdges(mst, i) {
  if (i >= mst.length) {
    mstt();
    $('#btn-compute').attr('disabled', false);
    $('#btn-reset').attr('disabled', false);
    return;
  }

  setTimeout(function() {
    var edge = mst[i];

    // curRun[i][0].circle.strokeColor = '#aefd6c'; 
    prevElement = curRun[i][curRun[i].length - 1];  
    
    loopThroughArray(curRun[i], curRun[i][0], function (prevElement, arrayElement, loopTime) {
      prevElement.circle.strokeColor = 'black';
      arrayElement.circle.strokeColor = '#aefd6c';
    }, 500);
    prevElement.circle.strokeColor = 'black';
    curRun[i][0].circle.strokeColor = 'black';  
    // tempVer.circle.strokeColor = 'black'; 

    setTimeout(function() {
      for(var z = 0; z < vertices.length; z++)
        vertices[z].circle.strokeColor = 'black';
      var a = new Point(edge.a.x, edge.a.y);
      var b = new Point(edge.b.x, edge.b.y);
      var mstPath = new Path.Line(a, b);
      mstPath.strokeColor = '#98FB98';
      mstPath.strokeWidth = 3;

      // mid = mstPath.length/2;
      // midpt = mstPath.getPointAt(mid);
      // normal = mstPath.getNormalAt(mid) * 20;
      var txt = new PointText({
          point: edge.label.point,
          content: Math.round(edge.weight()),
          fillColor: '#2FF3E0',
          fontFamily: 'Courier New',
          fontWeight: 'bold',
          fontSize: 15
        });
    //  edges[z].label.fillColor = '#2FF3E0';

    }, 3000);
    // highlightVertex(i, 0);
    drawEdges(mst, i+1);
  }, 5000);
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
  curRun = [];
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

  // var p = 0; 
  // var q = 0;

  // function loop1() {   

  //   setTimeout(function() {
    
  //     var minEdge = false;
  //     var minEdgeWeight = Number.MAX_VALUE;
  //     ans = 0;

  //     function loop2() {         //  create a loop function
  //       setTimeout(function() {   //  call a 3s setTimeout when the loop is called
  //         console.log(mstVertices);
  //         console.log(p);
  //         mstVertices[p].circle.strokeColor = '#a6e7ff';

  //         function loop3() {      //  create a loop function
  //           setTimeout(function() { 
  //             // await sleep(1000);
  //             if(mstVertices[p].adj[q] === undefined)
  //               console.log(p, q);
  //             var edge = mstVertices[p].adj[q];
  //             var vertex = edge.b;
  //             vertex.circle.strokeColor = '#aefd6c';

  //             // Found smaller edge weight
  //             if (edge.weight() < minEdgeWeight) {
  //               // Make sure that vertex not already in MST
  //               if (includesVertex(mstVertices, vertex)) {
  //                 if(p == mstVertices.length - 1 && q == mstVertices[p].adj.length - 1 && minEdgeWeight === Number.MAX_VALUE)
  //                   ans = 1;
  //                 vertex.circle.strokeColor = 'black';
  //                 return;
  //               }
  //               minEdge = edge;
  //               minEdgeWeight = edge.weight();
  //             }
  //             vertex.circle.strokeColor = 'black';  //  your code here
  //             q++;                    //  increment the counter
  //             if (q < mstVertices[p].adj.length) {           //  if the counter < 10, call the loop function
  //               loop3();             //  ..  again which will trigger another 
  //             }                       //  ..  setTimeout()
  //           }, 1000)
  //         }
  //         setTimeout(loop3, 1000);
  //         mstVertices[p].circle.strokeColor = 'black';
  //         p++;                    //  increment the counter
  //         if (p < mstVertices.length) {           //  if the counter < 10, call the loop function
  //           loop2();             //  ..  again which will trigger another 
  //         }                       //  ..  setTimeout()
  //       }, 2000)
  //     }

  //     setTimeout(loop2, 2000);
  //     if(ans) {
  //       not_mst();
  //       return;
  //     }
  //     mstVertices.push(minEdge.b);
  //     mst.push(minEdge);

  //     if (mstVertices.length != vertices.length) {           //  if the counter < 10, call the loop function
  //       loop1();             //  ..  again which will trigger another 
  //     }                       //  ..  setTimeout()
  //   }, 3000)
  // }
  
  // loop1();
  // callback(mst);
  // return;
  

  while (mstVertices.length != vertices.length) {
    // console.log(mstVertices);
    var minEdge = false;
    var minEdgeWeight = Number.MAX_VALUE;
    ans = 0;
    var tempRun = []

    for (var i = 0; i < mstVertices.length; i++) {
      // mstVertices[i].circle.strokeColor = '#a6e7ff';
      for (var j = 0; j < mstVertices[i].adj.length; j++) {
        // await sleep(1000);
        if(mstVertices[i].adj[j] === undefined)
          console.log(i, j);
        var edge = mstVertices[i].adj[j];
        var vertex = edge.b;
        if(!includesVertex(mstVertices, vertex) && !includesVertex(tempRun, vertex))
          tempRun.push(vertex);
        // vertex.circle.strokeColor = '#aefd6c';

        // Found smaller edge weight
        if (edge.weight() < minEdgeWeight) {
          // Make sure that vertex not already in MST
          if (includesVertex(mstVertices, vertex)) {
            if(i == mstVertices.length - 1 && j == mstVertices[i].adj.length - 1 && minEdgeWeight === Number.MAX_VALUE)
              ans = 1;
            vertex.circle.strokeColor = 'black';
            continue;
          }
          minEdge = edge;
          minEdgeWeight = edge.weight();
        }
        // vertex.circle.strokeColor = 'black';
      }
      // mstVertices[i].circle.strokeColor = 'black';
    }
      if(ans) {
        not_mst();
        break;
      }
      
      curRun.push(tempRun);
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

function boruvkasAlgorithm(vertices, callback){
  var mst = [];
  var mstVertices = [];
  
  for(var i=0; i<vertices.length; i++)
  {
    var min_edge = Number.MAX_VALUE;
    for(var j=0; j<vertices[i].adj.length; j++)
    {
      var edge = mstVertices[i].adj[j];
      var vertex = edge.b;
      if(edge.weight() < min_edge)
      {
        min_edge = edge.weight();
      }
    }
  }
}