(function(window) {
	window.onload = function(e) {
		var draggable = document.getElementById("dragged");
		var viewPort = document.querySelector(".viewport");

		for (var i = 0; i < 50; i++) {
			var el = document.createElement("div");
			el.className = "item";
			el.innerText = i + 1;
			draggable.appendChild(el);
		}

		draggable.addEventListener('mousedown', tap);
		draggable.addEventListener('mousemove', drag);
		draggable.addEventListener('mouseup', release);
		var offset = 0, reference = 0,min = 0;
		var pressed = false;
		var max = viewPort.scrollWidth;//need to work on this

		function scroll(x) {
			offset = (x > max) ? max : (x < min) ? min : x;
			viewPort.scrollLeft = offset;
		}

		function tap(e) {
			pressed = true;
			reference = e.clientX;
			e.preventDefault();
			e.stopPropogation();

			return false;
		}

		function release(e) {
			pressed = false;
			e.preventDefault();
			e.stopPropogation();

			return false;
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
			e.stopPropogation();

			return false;
		}
	};
}(window));