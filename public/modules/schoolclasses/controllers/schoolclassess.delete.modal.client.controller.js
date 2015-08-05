'use strict';

angular.module('schoolclasses').controller('DeleteClassModalController', ['$scope', '$location', '$state', '$modalInstance',
    'Schoolclasses', 'schoolclass', 'school',
    function ($scope, $location, $state, $modalInstance, Schoolclasses, schoolclass, school) {
        $scope.schoolclass = schoolclass;
        $scope.school = school;


        $scope.ok = function () {

            Schoolclasses.get({
                schoolclassId: $scope.schoolclass._id
            }, function (s) {

                s.$remove(function(result) {
                    $state.go($state.$current, null, {reload: true});
                });

            });



            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
