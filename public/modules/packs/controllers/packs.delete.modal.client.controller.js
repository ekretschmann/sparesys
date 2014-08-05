'use strict';

angular.module('packs').controller('DeletePackController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'pack', 'CoursesService', 'Courses',
	function($scope, $location, $state, $modalInstance, course, pack, CoursesService, Courses) {
        $scope.pack = pack;
        $scope.course = course;

        $scope.ok = function () {


            var courseId = pack.course;
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