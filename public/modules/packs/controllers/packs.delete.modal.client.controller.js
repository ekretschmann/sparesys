'use strict';

angular.module('packs').controller('DeletePackController', ['$scope', '$state', '$modalInstance', 'course', 'pack', 'CoursesService', 'Courses',
	function($scope, $state, $modalInstance, course, pack, CoursesService, Courses) {
        $scope.pack = pack;
        $scope.course = course;

        $scope.ok = function () {
            CoursesService.removePack(Courses, pack, function () {
                $state.go($state.$current, null, { reload: true });
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);