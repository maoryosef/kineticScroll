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
			var scrolledAxis = attrs.axis || "x";
			var kineticScroll = attrs.kineticScroll ? attrs.kineticScroll == "true" : true;

			var viewPort = document.querySelector(scope.affectedElementQuery);
			var MIN_SCROLL = 0, MAX_SCROLL = 0;
			var BODY_EL = angular.element(document.querySelector("body, html"));

			var offset = 0, reference = 0, frame = 0;
			var pressed = false;
			var velocity, amplitude, target;
			var timestamp, ticker;
			element.bind('mousedown', tap);

			function getMaxScroll() {
				return scrolledAxis == "x" ? viewPort.scrollWidth - viewPort.clientWidth : viewPort.scrollHeight - viewPort.clientHeight;
			}

			function scroll(val) {
				offset = (val > MAX_SCROLL) ? MAX_SCROLL : (val < MIN_SCROLL) ? MIN_SCROLL : val;
				if (scrolledAxis == "x") {
					viewPort.scrollLeft = offset;
				} else if (scrolledAxis == "y") {
					viewPort.scrollTop = offset;
				}
			}

			function tap(e) {
				pressed = true;
				reference = scrolledAxis ==  "x" ? e.clientX : e.clientY;
				MAX_SCROLL = getMaxScroll();
	    		BODY_EL.bind('mousemove', drag);
	    		BODY_EL.bind('mouseup', release);
				velocity = amplitude = 0;
				frame = offset;
				timestamp = Date.now();
				if (kineticScroll) {
					$interval.cancel(ticker);
					ticker = $interval(track, 100);
				}

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

				if (kineticScroll) {
					$interval.cancel(ticker);

					if (velocity > 10 || velocity < -10) {
						amplitude = 0.8 * velocity;
						target = Math.round(offset + amplitude);
						timestamp = Date.now();
						requestAnimationFrame(autoScroll);
					}
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
				var val, delta;
				if (pressed) {
					val = scrolledAxis == "x" ? e.clientX : e.clientY;
					delta = reference - val;
					if (delta > 2 || delta < -2) {
						reference = val;
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
