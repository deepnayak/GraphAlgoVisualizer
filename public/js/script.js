// Minimum Spanning Tree
// Demonstration of Prim's algorithm and Kruskal's algorithm to
// compute the minimum spanning tree of a graph.
var algo;
var path;
var mid;
var midpt;
var normal;
var snippet = new Layer();
var rec = [];
var algotext = [];
var algot = [];
var vertices = [];
var edges = [];
var curRun = [];
var ans = 0;
var selectedVertex = [];
var verticesLayer = new Layer();
var edgesLayer = new Layer();
var mstLayer = new Layer();
var currEdgeLayer = new Layer();
var drawLayer = new Layer();
var speed = 1;
var input = 1;
// const sleep = (milliseconds) => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds))
// }



function drawOnCanvas () {
  speed = $('#slider-1').slider("value");
  // var rgb =[
  //     $('#slider-1').slider("value"),
  //     $('#slider-2').slider("value"),
  //     $('#slider-3').slider("value")
  // ];
  // var c = document.getElementById("myCanvas2");
  // var ctx = c.getContext("2d");
  // var color = "rgb("+ rgb.join(',') + ")" ;
  // ctx.fillStyle = color ;
  //  console.log(rgb);
  // ctx.beginPath();
  // ctx.arc(100, 100, 100, 0, Math.PI*2, true);
  // ctx.closePath();
  // ctx.fill();
}

function createSlider(slider) {
  slider.slider({
     orientation: "horizontal",
     range: "min",
     min: 1,
     max: 5,
     value: 0,
     slide: function( event, ui ) {
       drawOnCanvas();
     }
 })
}

$(function() {
   createSlider($( "#slider-1" ));   
});

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


    console.log(event.point);
    if(input == 1) {
      document.getElementById("1").innerHTML = "edges input";
      document.getElementById("box1").style.background = 'yellow';
      document.getElementById("1").style.color = 'black';
      document.getElementById("box1").style.visibility = 'visible';
      input = 0;
    }
    
    var text = new PointText({
      point: [event.point.x - 30, event.point.y - 30],
      content: vertices.length + 1,
      fillColor: 'yellow',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: 25
    });
    newVer = new Vertex(event.point.x, event.point.y, circle, text);
    // var text = new PointText(new Point(event.point.x - 30, event.point.y - 30));
    // text.justification = 'center';
    // text.siz
    // text.fillColor = 'yellow';
    // text.content = vertices.length + 1;

    

    circle.strokeColor = 'black';
    circle.strokeWidth = 3;
    circle.fillColor = 'white';

  //   var rect = new Path.Rectangle({
  //     point: [1000, 30],
  //     size: [500, 270],
  //     strokeColor: 'red'
  // });
    // for(var y = 0; y < 5; y++) {
    //   console.log(rec[y].point)
    //   rec[y] = new Path.Rectangle({
    //     point: [1000, 30+(y*54)],
    //     size: [500, 54],
    //   });
    // }
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


var ele;

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
    // for(var v = 1; v < 5; v++)
    // {
    //   ele = document.getElementById("box"+v);
    //   ele.style.visibility = 'visible';
    // }

    ele = document.getElementById("2");
    ele.innerHTML = "while (total edges < vertices - 1)";
    ele = document.getElementById("3");
    ele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if edge from vertex in list has min weight and no cycle :";
    ele = document.getElementById("4");
    ele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;add edge to mst";


    primsAlgorithm(vertices, function(mst) {
      algo = $('#select-algo option:selected').val();
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
        document.getElementById("box1").style.background = 'black';
        document.getElementById("1").style.color = 'white';
        
        document.getElementById("box2").style.background = 'yellow';
        document.getElementById("2").style.color = 'black';
        document.getElementById("box2").style.visibility = 'visible';
        drawEdges(mst, 0, algo);
        // snippet.removeChildren();
      }
      else {
        $('#btn-compute').attr('disabled', false);
        $('#btn-reset').attr('disabled', false);
      }
    });
  } else if (algo == KRUSKAL) {

    ele = document.getElementById("2");
    ele.innerHTML = "while (total edges < vertices - 1)";
    ele = document.getElementById("3");
    ele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if edge with minimum weight available and no cycle :";
    ele = document.getElementById("4");
    ele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;add edge to mst";



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
      // speed = 5;
      document.getElementById("box1").style.background = 'black';
      document.getElementById("1").style.color = 'white';
      
      document.getElementById("box2").style.background = 'yellow';
      document.getElementById("2").style.color = 'black';
      document.getElementById("box2").style.visibility = 'visible';
      drawEdges(mst, 0, algo);
      // snippet.removeChildren();
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
      // curRun = [];
      // curRun = processingorder;

      
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

      drawEdges(mst, 0, algo);
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
function drawEdges(mst, i, algo) {
  
  if (i >= mst.length) {
    mstt();
    $('#btn-compute').attr('disabled', false);
    $('#btn-reset').attr('disabled', false);
    return;
  }

  setTimeout(function() {
    var edge = mst[i];
    mst[0].a.circle.strokeColor = '#66ff00';

    // curRun[i][0].circle.strokeColor = '#aefd6c'; 
    edge.b.circle.strokeColor = '#66ff00';
    if(algo == PRIM) {
      prevElement = curRun[i][curRun[i].length - 1];  
      
      document.getElementById("box2").style.background = 'black';
      document.getElementById("2").style.color = 'white';
      ele = document.getElementById("box3");
      ele.style.visibility = 'visible';
      document.getElementById("box3").style.background = 'yellow';
      document.getElementById("3").style.color = 'black';//'#F52828';
      document.getElementById("box4").style.background = 'black';
      document.getElementById("4").style.color = 'white';//'#F52828';
      loopThroughArray(curRun[i], curRun[i][0], function (prevElement, arrayElement, loopTime) {
        prevElement.circle.strokeColor = 'black';
        arrayElement.circle.strokeColor = '#0096FF';
      }, 500/speed);
      prevElement.circle.strokeColor = 'black';
      curRun[i][0].circle.strokeColor = 'black';  
      // tempVer.circle.strokeColor = 'black'; 
    }
    console.log(speed);

    setTimeout(function() {
      for(var z = 0; z < vertices.length; z++)
        if(vertices[z].circle.strokeColor != '#66ff00')
          vertices[z].circle.strokeColor = 'black';
      edge.b.circle.strokeColor = '#66ff00';
      if(algo == KRUSKAL)
      {
        document.getElementById("box2").style.background = 'black';
        document.getElementById("2").style.color = 'white';
        ele = document.getElementById("box3");
        ele.style.visibility = 'visible';
        document.getElementById("box3").style.background = 'yellow';
        document.getElementById("3").style.color = 'black';//'#F52828';
        document.getElementById("box4").style.background = 'black';
        document.getElementById("4").style.color = 'white';//'#F52828';
      }
      mst[0].a.circle.strokeColor = '#66ff00';
      var a = new Point(edge.a.x, edge.a.y);
      var b = new Point(edge.b.x, edge.b.y);
      var mstPath = new Path.Line(a, b);
      mstPath.strokeColor = '#98FB98';
      mstPath.strokeWidth = 3;

      ele = document.getElementById("box4");
      ele.style.visibility = 'visible';
      document.getElementById("box3").style.background = 'black';
      document.getElementById("3").style.color = 'white';//'#F52828';
      if (i < mst.length - 1)
      {
        document.getElementById("box4").style.background = 'yellow';//'#F52828';
        document.getElementById("4").style.color = 'black';//'#F52828';
      }
      else
      {
        document.getElementById("box4").style.background = 'black';
        document.getElementById("4").style.color = 'white';
      }
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

    }, 3000/speed);
    // highlightVertex(i, 0);
    drawEdges(mst, i+1, algo);
  }, 5000/speed);
}

$('#btn-reset').click(function() {
  input = 1;
  for(var v = 1; v < 7; v++)
    {
      ele = document.getElementById("box"+v);
      ele.style.visibility = 'hidden';
      ele.style.background = 'black';
      ele = document.getElementById(v);
      ele.style.color = 'white';
    }
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

function notinMST(mst, edge)
{
  var flag = true;
  // console.log("MST length", mst.length);
  for(var i=0; i<mst.length; i++)
  {
    if (mst[i].equals(edge)) {
      flag = false;
      break;
    }
  }
  return flag;
}

function notinanyoftheSets(sets, vtex)
{
  var flag = -1;
  for(var i=0; i<sets.length; i++)
  {
    for(var j=0; j<sets[i].length; j++)
    {
      if(sets[i][j] != 0 && sets[i][j].equals(vtex))
      {
        flag = i;
      }
    }
  }
  return flag;
}

function boruvkasAlgorithm(vertices, callback) {
    var V = vertices.length;
    var E = edges.length;

    // edges.sort(function(a, b) {
    //   if (a.weight() < b.weight()) {
    //     return -1;
    //   } else if (a.weight() > b.weight()) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // Allocate memory for creating V subsets.
    // struct subset *subsets = new subset[V];
    var uf1 = new UnionFind(vertices.length);
  
    // An array to store index of the cheapest edge of
    // subset.  The stored index for indexing array 'edge[]'
    // int *cheapest = new int[V];
    var cheapest = [];
    var mst = [];
  
    // Create V subsets with single elements
    for (var v = 0; v < vertices.length; v++)
        cheapest.push(-1);
  
    // Initially there are V different trees.
    // Finally there will be one tree that will be MST
    var numTrees = V;
    var MSTweight = 0;

    while (numTrees > 1) {
          for (var v = 0; v < vertices.length; v++)
               cheapest[v] = -1;

        for (var i = 0; i < E; i++)
        {
            // Find components (or sets) of two corners
            // of current edge
            var set1 = uf1.find(getVertexIndex(vertices, edges[i].a));
            var set2 = uf1.find(getVertexIndex(vertices, edges[i].b));
  
            // If two corners of current edge belong to
            // same set, ignore current edge
            // for(var te = 0; te < V; te++)
              // console.log(uf1.id);
            if (set1 == set2)
                continue;
  
            // Else check if current edge is closer to previous
            // cheapest edges of set1 and set2
            else
            {
                console.log(i, set1, cheapest[set1]);
                console.log(i, set2, cheapest[set2]);
                if(cheapest[set1] !== -1)
                  console.log(edges[cheapest[set1]].weight(), edges[i].weight(), Math.round(edges[cheapest[set1]].weight()) > Math.round(edges[i].weight()));
                if(cheapest[set2] !== -1)
                  console.log(edges[cheapest[set2]].weight(), edges[i].weight(), Math.round(edges[cheapest[set2]].weight()) > Math.round(edges[i].weight()));
               if (cheapest[set1] == -1 || Math.round(edges[cheapest[set1]].weight()) > Math.round(edges[i].weight()))
                 cheapest[set1] = i;
  
               if (cheapest[set2] == -1 || Math.round(edges[cheapest[set2]].weight()) > Math.round(edges[i].weight()))
                 cheapest[set2] = i;
            }
        }
        // console.log("hello", cheapest);
  
        // Consider the above picked cheapest edges and add them
        // to MST
        for (var i=0; i<V; i++)
        {
            // Check if cheapest for current set exists
            if (cheapest[i] != -1)
            {
                // int set1 = find(subsets, edge[cheapest[i]].src);
                // int set2 = find(subsets, edge[cheapest[i]].dest);
                var set1 = uf1.find(getVertexIndex(vertices, edges[cheapest[i]].a));
                var set2 = uf1.find(getVertexIndex(vertices, edges[cheapest[i]].b));
  
                if (set1 == set2)
                    continue;
                MSTweight += edges[cheapest[i]].weight();
                mst.push(edges[cheapest[i]]);

                // printf("Edge %d-%d included in MST\n",
                //        edge[cheapest[i]].src, edge[cheapest[i]].dest);
  
                // Do a union of set1 and set2 and decrease number
                // of trees
                // Union(subsets, set1, set2);
                uf1.union(getVertexIndex(vertices, edges[cheapest[i]].a), getVertexIndex(vertices, edges[cheapest[i]].b));
                numTrees--;
            }
        }
    }
  
    // console.log(uf1.id);
    // printf("Weight of MST is %d\n", MSTweight);
    callback(mst);
}

// function boruvkasAlgorithm(vertices, callback){
//   var mst = [];
//   var mstVertices = [];
//   var sets = [];
//   var indexkeeper = 0;
//   var position;
//   curRun = [];
//   var uf1 = new UnionFind(vertices.length);
//   sets[indexkeeper] = [];
//   sets[indexkeeper].push(vertices[0]);
//   indexkeeper++;
//   for(var i=0; i<vertices.length; i++)
//   {
//     var min_edge = Number.MAX_VALUE;
//     var lightestEdge = undefined;
//     curRun[i] =[];
//     for(var j=0; j<vertices[i].adj.length; j++) {
//       var edge = vertices[i].adj[j];
//       curRun[i].push(edge.b);
//       if(edge.weight() < min_edge) {
//         min_edge = edge.weight();
//         lightestEdge = edge;
//       }
//     }
//     if(lightestEdge!= undefined && notinMST(mst, lightestEdge)) {
//       mst.push(lightestEdge);
//       console.log("lightestEdge", getVertexIndex(vertices, lightestEdge.a), getVertexIndex(vertices, lightestEdge.b))
//       var ia = getVertexIndex(vertices, edge.a);
//       var ib = getVertexIndex(vertices, edge.b);
//       uf1.union(ia, ib);
//       mstVertices.push(edge.b);
//       if ((position = notinanyoftheSets(sets, edge.a)) != -1){
//         sets[position].push(edge.b);
//       }
//       else{
//         sets[indexkeeper] =[];
//         sets[indexkeeper].push(edge.a);
//         sets[indexkeeper].push(edge.b);
//         indexkeeper++;  
//       }
//     }
//     // sets[i].addToAdj(edge.b);
//   }                                         
//   if (mst.length <= vertices.length-1) {
//     for(var i=0; i<sets.length; i++) {
//       var min_edge = Number.MAX_VALUE;
//       var lightestEdge = undefined;
//       for(var j=0; j<sets[i].length; j++)
//       {
//         if (sets[i][j]!=0){
//           for(var k=0; k<sets[i][j].adj.length; k++)
//           {
            
//               var edge = sets[i][j].adj[k];
              
//               if(edge.weight() < min_edge && !includesEdge(mst, lightestEdge))
//               {
//                 min_edge = edge.weight();
//                 lightestEdge = edge;
//               }
            
//           }
//         }
//       }
//       if(lightestEdge != undefined){
//         mst.push(lightestEdge);
//         console.log("lightestEdge", getVertexIndex(vertices, lightestEdge.a), getVertexIndex(vertices, lightestEdge.b))
             
//         var ia = getVertexIndex(vertices, edge.a);
//         var ib = getVertexIndex(vertices, edge.b);
//         uf1.union(ia, ib);
//         mstVertices.push(edge.b);
//         var pos2 =undefined;
//         if ((position = notinanyoftheSets(sets, edge.a)) != -1 && (pos2 = notinanyoftheSets(sets, edge.b)) != -1 && position != pos2){
          
//           console.log("Edge", edge.a.label, edge.b.label);
//           console.log("Positions", position, pos2);
//           for(var k=0; k<sets[pos2].length; k++)
//           {
//             sets[position].push(sets[pos2][k]);
//           }
//           for(var k=0; k<sets[pos2].length; k++)
//           {
//             sets[pos2][k] = 0;
//           }
//         }
//         else{
//           sets[indexkeeper] =[];
//           sets[indexkeeper].push(edge.b);
//           indexkeeper++;  
//         }
//       }
//     }
//   }
//   callback(mst);
// }