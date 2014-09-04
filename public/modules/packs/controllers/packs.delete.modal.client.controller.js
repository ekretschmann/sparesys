'use strict';

angular.module('packs').controller('DeletePackController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'pack', 'CoursesService', 'Packs',
	function($scope, $location, $state, $modalInstance, course, pack, CoursesService, Packs) {
        $scope.pack = pack;
        $scope.course = course;

        $scope.ok = function () {


            var courseId = pack.course;
            pack.slaves.forEach(function(slaveId) {
                Packs.query({
                    _id: slaveId
                }, function (slavePacks) {
                    CoursesService.removePack(slavePacks[0], function () {

                    });


                });
            });

            CoursesService.removePack(pack, function () {
                if ($state.$current.url.source === '/courses/:courseId/edit') {
                    $state.go($state.$current, null, {reload:true});
                } else {
                    $location.path('courses/' + courseId + '/edit');
                }
            });





            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);