'use strict';

angular.module('packs').controller('EditPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack',
	function($scope, $state, $timeout, $modalInstance, pack) {
        $scope.pack = pack;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.editPackFocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

//            $scope.pack.name = this.packname;
//            console.log($scope.pack.name);
            var courseName = pack.courseName;
            $scope.pack.$update(function() {
                pack.courseName = courseName;
            });

            $modalInstance.dismiss('cancel');
        };
	}
]);