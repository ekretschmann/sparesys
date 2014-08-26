'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'JourneyService',
	function($scope, $state, $timeout, $modalInstance, course, JourneyService) {
        $scope.course = course;


        $scope.languages = [
            {name:'-', code:''},
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


        var selectedIndex = 0;
        if (course.language) {
            var index = 0;
            $scope.languages.forEach(function (lang) {

                if (lang.name === course.language.name) {
                    selectedIndex = index;
                }
                index++;
            });
        }
        $scope.language = $scope.languages[selectedIndex];



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
            course.front = this.front;
            course.back = this.back;


            $scope.course.$update(function() {
                JourneyService.courseEdited();
                $state.go($state.$current, null, { reload: true });
            });

            $modalInstance.dismiss('cancel');
        };
	}
]);