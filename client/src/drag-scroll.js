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
})(window);
angular.module('dragScroll', []).directive('dragScroll', ['$interval', function($interval) {
	return {
		restrict: 'A',
		scope: {
			affectedElementQuery: "@"
		},
		link: function(scope, element, attrs) {
			var TIME_CONSTANT = 325;
			var viewPort = document.querySelector(scope.affectedElementQuery);
			var MIN_SCROLL = 0, MAX_SCROLL = viewPort.scrollWidth - viewPort.offsetWidth;
			var BODY_EL = angular.element(document.querySelector("body, html"));

			var offset = 0, reference = 0, frame = 0;
			var pressed = false;
			var velocity, amplitude, target;
			var timestamp, ticker;
			element.bind('mousedown', tap);

			function scroll(x) {
				offset = (x > MAX_SCROLL) ? MAX_SCROLL : (x < MIN_SCROLL) ? MIN_SCROLL : x;
				viewPort.scrollLeft = offset;
			}

			function tap(e) {
				pressed = true;
				reference = e.clientX;
	    		BODY_EL.bind('mousemove', drag);
	    		BODY_EL.bind('mouseup', release);
				velocity = amplitude = 0;
				frame = offset;
				timestamp = Date.now();
				$interval.cancel(ticker);
				ticker = $interval(track, 100);

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

				$interval.cancel(ticker);

				if (velocity > 10 || velocity < -10) {
					amplitude = 0.8 * velocity;
					target = Math.round(offset + amplitude);
					timestamp = Date.now();
					requestAnimationFrame(autoScroll);
				}

	    		BODY_EL.unbind('mousemove', drag);
	    		BODY_EL.unbind('mouseup', release);

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
		}
	};
}]);
