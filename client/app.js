(function(window) {
	window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
    })();

	window.onload = function(e) {
		var draggable = document.getElementById("dragged");
		var viewPort = document.querySelector(".viewport");

		for (var i = 0; i < 50; i++) {
			var el = document.createElement("div");
			el.className = "item " + ((i % 2  == 0) ? "even" : "odd");
			el.innerText = i + 1;
			draggable.appendChild(el);
		}

		draggable.addEventListener('mousedown', tap);
		draggable.addEventListener('mousemove', drag);
		draggable.addEventListener('mouseup', release);
		var offset = 0, reference = 0,min = 0, frame;
		var pressed = false;
		var max = viewPort.scrollWidth;//need to work on this
		var velocity, amplitude, target;
		var timestamp, ticker;
		var timeConstanct = 325;

		function scroll(x) {
			offset = (x > max) ? max : (x < min) ? min : x;
			viewPort.scrollLeft = offset;
		}

		function tap(e) {
			pressed = true;
			reference = e.clientX;

			velocity = amplitude = 0;
			frame = offset;
			timestamp = Date.now();
			clearInterval(ticker);
			ticker = setInterval(track, 100);

			e.preventDefault();
			e.stopPropagation();

			return false;
		}

		function track() {
			var now, elapsed, delta, v;

			now = Date.now();
			elapsed = now - timestamp;
			timestamp = now;
			delta = offset - frame;
			frame = offset;

			v = 1000 * delta / (1 + elapsed);
			velocity = 0.8 * v + 0.2 * velocity;
		}

		function release(e) {
			pressed = false;

			clearInterval(ticker);

			if (velocity > 10 || velocity < -10) {
				amplitude = 0.8 * velocity;
				target = Math.round(offset + amplitude);
				timestamp = Date.now();
				requestAnimationFrame(autoScroll);
			}

			e.preventDefault();
			e.stopPropagation();

			return false;
		}

		function autoScroll() {
			var elapsed, delta;

			if (amplitude) {
				elapsed = Date.now() - timestamp;
				delta = -amplitude * Math.exp(-elapsed / timeConstanct);
				if (delta > 0.5 || delta < -0.5) {
					scroll(target + delta);
					requestAnimationFrame(autoScroll);
				} else {
					scroll(target);
				}
			}
		}

		function drag(e) {
			var y, delta;
			if (pressed) {
				y = e.clientX;
				delta = reference - y;
				if (delta > 2 || delta < -2) {
					reference = y;
					scroll(offset + delta);

				} 
			}

			e.preventDefault();
			e.stopPropagation();

			return false;
		}
	};
}(window));