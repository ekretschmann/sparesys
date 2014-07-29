'use strict';

angular.module('schools').controller('AddTeacherToSchoolController', ['$scope', '$state', '$http', '$timeout', '$modalInstance', 'course', 'Authentication',
	function($scope, $state, $http, $timeout, $modalInstance, school, Authentication) {

        $scope.authentication = Authentication;
        $scope.school = school;
        $scope.credentials = {};

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.addpackfocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addTeacherToSchool = function () {

//            console.log('adding teacher');
//            console.log($scope.credentials);

            $http.post('/auth/addTeacher', $scope.credentials).success(function(user) {
//                If successful we assign the response to the global user model
                school.teachers.push(user._id);
                school.$update();


//                And redirect to the index page
            }).error(function(response) {
                $scope.error = response.message;
                console.log('ERROR');
                console.log(response);

            });

            angular.element('.addpackfocus').trigger('focus');
        };
	}
]);