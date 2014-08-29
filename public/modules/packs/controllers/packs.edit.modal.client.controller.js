'use strict';

angular.module('packs').controller('EditPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'Packs',
    function ($scope, $state, $timeout, $modalInstance, pack, Packs) {
        $scope.pack = new Packs(pack);
        $scope.initialPackName = pack.name;


        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.focus').trigger('focus');
            },100);
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            var courseName = pack.courseName;
            $scope.pack.$update(function () {
                pack.courseName = courseName;

                $state.go($state.$current, null, { reload: true });
            });




            $modalInstance.dismiss('cancel');
        };
    }
]);