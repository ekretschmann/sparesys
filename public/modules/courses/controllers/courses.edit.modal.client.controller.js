'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course',
	function($scope, $state, $timeout, $modalInstance, course) {
        $scope.course = course;

        $scope.languages = [
            {name:'none', code:''},
            {name:'English', code:'en-GB'},
            {name:'German', code:'de-DE'},
            {name:'Spanish', shade:'es-ES'}
        ];
        $scope.language = $scope.languages[0];

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.editCoursefocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            course.name = this.name;
            course.description = this.description;
            course.language = this.language.code;
            $scope.course.$update();
            $modalInstance.dismiss('cancel');
        };
	}
]);