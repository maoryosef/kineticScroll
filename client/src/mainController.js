mainModule.controller("MainController", function($scope) {
	$scope.items = [];

	for (var i = 0; i < 50; i++) {
		$scope.items.push({id: i});
	}
});