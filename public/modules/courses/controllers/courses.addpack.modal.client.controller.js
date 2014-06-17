'use strict';

angular.module('courses').controller('AddPackToCourseCtroller', ['$scope', '$state', '$modalInstance', 'course', 'Packs',
	function($scope, $state, $modalInstance, course, Packs) {
        $scope.course = course;

        $scope.setFocus = function () {
            //document.element('.hasfocus').trigger('focus');
        };

        $scope.ok = function () {
            this.name = '';
            //$state.go($state.$current, null, { reload: false });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addPackToCourse = function () {

            // Create new Pack object
            var pack = new Packs({
                name: this.name,
                course: this.course._id
            });


            console.log(this.name);
            // Redirect after save
            pack.$save(function (response) {
                var packid = response._id;
                var c = $scope.course;
                c.packs.push(packid);
                c.$update(function () {
                    $scope.name = '';
                    $state.go($state.$current, null, { reload: true });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            $scope.name = '';

        };
	}
]);