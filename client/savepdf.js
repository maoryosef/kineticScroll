'use strict';

function saveToPdf() {
	var doc = new jsPDF("p", "pt");
	doc.addFont('HPSimplifiedLight', 'HPSimplifiedLight', 'normal');

	var notes = $("#notes").val();

	var saveGraphPromise = save(drawChart()); 

	$.when(saveGraphPromise).then(function(graphImage) {

		var img = document.createElement("IMG");

		img.src = graphImage;
		document.querySelector("#svgdataurl").appendChild(img);

		console.log(graphImage);

		//doc.rect(0.6, 10, 140.5, 100);
		var lines = doc.setFont("HPSimplifiedLight").splitTextToSize(notes, parseInt($("#line").val()));
		doc.text(0.9, 14, lines);

		doc.addImage(graphImage, 'PNG', 10, 10, 337.5, 187.5);
		doc.save('test.pdf');	
	});
}

function save(el) {
	var deferred = $.Deferred();

	svgAsDataUri(el, {}, function(uri) {
      	var image = new Image();
      	image.src = uri;
      	image.onload = function() {
        	var canvas = document.createElement('canvas');
        	canvas.width = image.width;
        	canvas.height = image.height;
        	console.log(image.width, image.height);
        	var context = canvas.getContext('2d');
        	context.drawImage(image, 0, 0);
        	deferred.resolve(canvas.toDataURL('image/png'));
    	}
	});

	return deferred.promise();
}

function drawChart() {
	var width = 450, height = 250;

	var xDomain = [1414800000000 , 1422748800000 , 1430438400000 ];
	

	var data = [100, 8000, 6000];

	var minVal = Math.min.apply(null, data);
	var maxVal = Math.max.apply(null, data);

	minVal = Math.floor(minVal / 1000) * 1000;
	maxVal = Math.ceil(maxVal / 1000) * 1000;

	minVal = minVal || 0;
	maxVal = maxVal || 1000;

	if (minVal == maxVal) {
		if (maxVal < 0) {
			maxVal *= -1
		} else {
			maxVal *= 1.5
		}
	}

	var yDomain = [minVal, maxVal];

	d3.select("#stats").html(yDomain);

	var margin = {top: 60, right: 30, bottom: 30, left: 80};
	var innerWidth = width - margin.right - margin.left,
		innerHeight = height - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangePoints([10, innerWidth - 25])
		.domain(xDomain);

	var y = d3.scale.linear()
		.range([innerHeight - 30, 0])
		.domain(yDomain);

	var getFirstNotNullValuePosition = function(data, index, goUp) {
		if (index == data.length) {
			return getFirstNotNullValuePosition(data, index - 1, false);
		}

		if (data[index] !== null) {
			return {x : x(xDomain[index]), y : y(data[index])}
		}

		if (index == 0 && !goUp) {
			return {x: null, y : null};
		}

		return getFirstNotNullValuePosition(data, goUp ? index + 1 : index - 1, goUp);
	}

	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(xDomain.length)
		.tickSize(-innerHeight)
		.orient("bottom")
		.tickPadding(10);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickSize(-innerWidth)

	    var el = document.createElement("svg");
	    el.className += "chart";
	    el.tagName = "svg";
	var chart = d3.select(el)
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (innerHeight - 20) + ")")
		.call(xAxis);

		chart.append("g")
  		.attr("class", "y axis")
  		.call(yAxis);

	chart.append("g")
		.attr("class", "first-tick")
		.attr("transform", "translate(0, " + y(yDomain[0]) + ")")
		.append("line")
		.attr("x2", innerWidth);

  	var graphHolder = chart.append("g")
  		.attr("class", "graph-holder");

  	var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d, i) {
                            return getFirstNotNullValuePosition(data, i, true).x;
                        })
                        .y(function (d, i) {
                            return getFirstNotNullValuePosition(data, i, true).y;
                        })(data);


  	graphHolder.append("path")
  		.attr("class", "rootElt line")
        .attr("opacity", "1")
        .attr("d", line);


	var dots = graphHolder.selectAll("dot")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("class", function(d,i) { return "rootElt cross-line-wrap avTick-"+i; })
                        .attr("opacity", "1");


	dots.append("circle")
        .attr("r", 4)
        .attr("class", function(d) {return d == null ? "hide" : ""})
        .attr("cx", function(d,i) { return x(i);})
        .attr("cy", function(d) { return y(d);})                            

	dots.append("circle")
        .attr("r", 6)
        .attr("class", "outer")
        .attr("cx", function(d,i) { return x(i);})
        .attr("cy", function(d) { return y(d);}) 

    function generatePath(d, i) {
    	var xCord = x(i);
    	var yCord = y(d);

    	var valLength = (d + "").length;

    	var toolTipLength = valLength * 10;


    	return "M " + xCord + ", " + (yCord - 5) + " l -5,-5 l -10,0 l 0,-15 l " + toolTipLength + ",0 l 0,15 l -" + (toolTipLength - 20) + ",0 z";
    }

    dots.append("path")
    	.attr("stroke", "black")
    	.attr("fill", "white")
    	.attr("d", generatePath);

    dots.append("text")
    	.attr("width", "30px")
    	.attr("height", "20px")
    	.attr("x", function(d, i) { return x(i) + 4})
    	.attr("y", function(d, i) {return y(d) - 14})
    	.attr("cy", "5px")

    	.text(function(d) { return d});

return el;
}