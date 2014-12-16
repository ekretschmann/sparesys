'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$stateParams', 'Courses',
    function ($scope, $stateParams, Courses) {

        $scope.initPractice = function () {


            Courses.get({
                courseId: $stateParams.courseId
            }, function (course) {
                $scope.course = course;
            });
        };



    }]);