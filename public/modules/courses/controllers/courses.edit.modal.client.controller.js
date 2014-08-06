'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course',
	function($scope, $state, $timeout, $modalInstance, course) {
        $scope.course = course;

        $scope.languages = [
            {name:'n/a', code:''},
            {name:'Chinese', code:'zh-CN'},
            {name:'English (GB)', code:'en-GB'},
            {name:'English (US)', code:'en-US'},
            {name:'French', code:'fr-FR'},
            {name:'German', code:'de-DE'},
            {name:'Italian', code:'it-IT'},
            {name:'Japanese', code:'ja-JP'},
            {name:'Korean', code:'ko-KR'},
            {name:'Spanish', code:'es-ES'}
        ];
        $scope.language = course.language;

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
            course.language = this.language;


            $scope.course.$update();
            $modalInstance.dismiss('cancel');
        };
	}
]);