'use strict';

angular.module('packs').controller('DeletePackController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'pack', 'CoursesService', 'Packs',
	function($scope, $location, $state, $modalInstance, course, pack, CoursesService, Packs) {
        $scope.pack = pack;
        $scope.course = course;

        $scope.ok = function () {


            //var courseId = pack.course;
            //pack.slaves.forEach(function(slaveId) {
            //    Packs.query({
            //        _id: slaveId
            //    }, function (slavePacks) {
            //        CoursesService.removePack(slavePacks[0], function () {
            //
            //        });
            //
            //
            //    });
            //});
            //
            for (var i=0; i<$scope.course.packs.length; i++) {
                var p = $scope.course.packs[i];
                if (p === pack._id) {
                    $scope.course.packs.splice(i,1);
                }
            }

            pack.$remove();


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);