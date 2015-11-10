'use strict';

var app = window.app;

/*
* $scope.configs, $scope.branch and $scope.pluginConfig, among others are available from the parent scope
* */
app.controller('TemplateController', ['$scope', function ($scope) {
	$scope.saving = false;

	$scope.$watch('configs[branch.name].gerrit-review.config', function (value) {
		$scope.config = value;
	});

	$scope.save = function () {
		$scope.saving = true;
		$scope.pluginConfig('gerrit-review', $scope.config, function () {
			$scope.saving = false;
		});
	};
}]);
