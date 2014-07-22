'use strict';

angular.module('schools').controller('AddTeacherToSchoolController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'Packs',
	function($scope, $state, $timeout, $modalInstance, school, Packs) {
        $scope.school = school;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.addpackfocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addTeacherToSchool = function () {

            console.log('adding teacher');
//            // Create new Pack object
//            var teacher = new Users({
//                name: this.name,
//                course: this.course._id
//            });
//
//
//            // Redirect after save
//            pack.$save(function (response) {
//                var packid = response._id;
//                var c = $scope.course;
//                c.packs.push(packid);
//                c.$update(function () {
//                    $scope.name = '';
//                    $state.go($state.$current, null, { reload: true });
//                }, function (errorResponse) {
//                    $scope.error = errorResponse.data.message;
//                });
//
//            }, function (errorResponse) {
//                $scope.error = errorResponse.data.message;
//            });
//            this.name = '';
            angular.element('.addpackfocus').trigger('focus');
        };
	}
]);