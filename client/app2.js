// Source: client/src/mainModule.js
var mainModule = angular.module('kineticScroll', ['dragScroll']);

// Source: client/src/mainController.js
mainModule.controller("MainController", function($scope, $timeout) {
	$scope.items = [];

	$timeout(function() {
		for (var i = 0; i < 50; i++) {
			$scope.items.push({id: i});
		}
	}, 2000);
});