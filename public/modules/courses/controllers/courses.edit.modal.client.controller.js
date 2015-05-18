'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'Courses',
	function($scope, $state, $timeout, $modalInstance, course, Courses) {

        $scope.course = new Courses(course);
        $scope.initialCourseName = course.name;


        $scope.speechRecognitionOptions = ['no', 'yes'];

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

        $scope.setSpeechrecognition = function(option) {
            $scope.course.speechrecognition = option;
        };


        var selectedIndex = 0;
        var index = 0;
        if (course.language) {

            $scope.languages.forEach(function (lang) {

                if (lang.name === course.language.name) {
                    selectedIndex = index;
                }
                index++;
            });
        }
        $scope.language = $scope.languages[selectedIndex];

        if (course.languageback) {
            index = 0;
            $scope.languages.forEach(function (lang) {

                if (lang.name === course.languageback.name) {
                    selectedIndex = index;
                }
                index++;
            });
        }
        $scope.languageback = $scope.languages[selectedIndex];


        $scope.setLanguage = function(lang) {
            $scope.language = lang;
            $scope.course.language = lang;
        };

        $scope.setLanguageBack = function(lang) {
            $scope.languageback = lang;
            $scope.course.languageback = lang;
        };

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.focus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {


            $scope.course.$update(function() {
                $state.go($state.$current, null, { reload: true });
            });

            $modalInstance.dismiss('cancel');
        };
	}
]);
