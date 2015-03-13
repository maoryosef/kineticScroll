(function(window) {
    $(function() {
    	var dragger = $("#dragged");
    	var stats = $("#stats");
    	var viewPort = $(".viewport");

    	for (var i = 0; i < 50; i++) {
    		var el = $("<div></div>");
    		el.addClass("item");
    		el.addClass((i % 2  == 0) ? "even" : "odd");
    		el.text(i);
    		dragger.append(el);
    	}

		var offset = 0, reference = 0, frame = 0;
		var pressed = false;
		var MIN_SCROLL = 0, MAX_SCROLL = viewPort[0].scrollWidth - viewPort[0].offsetWidth;
		var velocity, amplitude, target;
		var timestamp, ticker;
		var TIME_CONSTANT = 325;

    	dragger.bind('mousedown', tap);
    	dragger.bind('mousemove', drag);
    	dragger.bind('mouseup', release);

		function scroll(x) {
			offset = (x > MAX_SCROLL) ? MAX_SCROLL : (x < MIN_SCROLL) ? MIN_SCROLL : x;
			viewPort.scrollLeft(offset);
			stats.text(offset);
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
				delta = -amplitude * Math.exp(-elapsed / TIME_CONSTANT);
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
    });
}(window));