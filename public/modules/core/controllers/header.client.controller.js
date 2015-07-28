'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Users','Menus', 'PracticeOptionsService',
	function($scope, Authentication, Users, Menus, PracticeOptionsService) {

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
        $scope.isHeadmaster = false;
        $scope.isTeacher = false;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };


        $scope.toggleHelp = function() {

            var roles = $scope.authentication.user.roles;
            if (roles.indexOf('help') === -1) {
                    roles.push('help');
            } else {
                for (var j in roles) {
                    if (roles[j] === 'help') {
                        roles.splice(j, 1);
                    }
                }
            }

            Users.get({
                userId: $scope.authentication.user._id
            }, function (result) {
                result.roles = roles;
                result.$update(function() {
                    Authentication.user = result;
                });

            });

        };

        $scope.rateHover = function(value) {
            PracticeOptionsService.rateHover(value);
        };

        $scope.rateClick = function() {
            PracticeOptionsService.rateClick();
        };
	}
]);
