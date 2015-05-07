angular.module('scroller', []).directive('scroller', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			console.log(attrs.items, scope.$parent.$eval(attrs.items));
			scope.$watchCollection(attrs.items, function (newVal, oldVal) {
				console.log("here");
				if (oldVal && newVal) {
					if (oldVal.length != newVal.length) {
						$timeout(function() {
							var el = document.querySelector('.table-body-container');
							if (el && el.scrollHeight <= el.offsetHeight) {
								element.addClass(attrs.maskedClass);
							} else {
								element.removeClass(attrs.maskedClass);
							}
						}, 0);
					}
				}
			});
		}
	}
}]);


// Source: client/src/mainModule.js
var mainModule = angular.module('dynamicScroll', ['scroller']);

function calucalatedScrollbarWidth() {
 	
 	var inner = document.createElement('p');
  	inner.style.width = "100%";
  	inner.style.height = "200px";
	  
	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild (inner);

	document.body.appendChild (outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;
	if (w1 == w2) w2 = outer.clientWidth;

	document.body.removeChild (outer);

	return (w1 - w2);
}

// Source: client/src/mainController.js
mainModule.controller("MainController", function($scope, $timeout, $document) {
	$scope.items = [];

	$timeout(function() {
		for (var i = 0; i < 5; i++) {
			$scope.items.push({id: i});
		}
	}, 100);

	$scope.addItem = function() {
		$scope.items.push({id: $scope.items.length})
	};

	$scope.removeItem = function() {
		$scope.items.pop();
	};

	$scope.tableMonitor = {};

/*	$scope.$watchCollection("items", function(newVal, oldVal) {
		console.log(oldVal, newVal);
		if (oldVal && newVal) {
			if (oldVal.length != newVal.length) {
				$scope.tableMonitor.oldLength = oldVal.length;
				$scope.tableMonitor.newLength = newVal.length;

				$timeout(function() {
					var el = document.querySelector('.table-body-container');
					console.log(el.scrollHeight - el.offsetHeight, $scope.scrollBarWidth);
					if (el && el.scrollHeight <= el.offsetHeight) {
						$scope.paddedBody = $scope.scrollBarWidth;
					} else {
						$scope.paddedBody = 0;
					}
				}, 0);
			}
		}
	});*/

	$document.ready(function() {
		$scope.scrollBarWidth = calucalatedScrollbarWidth();
		$scope.tableMonitor.scrollBarWidth = calucalatedScrollbarWidth();
	});
});