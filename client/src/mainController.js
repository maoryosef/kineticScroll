mainModule.controller("MainController", function($scope, $timeout) {
	$scope.items = [];

	$timeout(function() {
		for (var i = 0; i < 50; i++) {
			$scope.items.push({id: i});
		}
	}, 2000);
});