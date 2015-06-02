'use strict';


/* global d3 */
angular.module('schoolclasses').controller('CourseProgressController',
    ['$scope', '$stateParams', 'Courses', 'CoursesService', 'Schoolclasses',
        function ($scope, $stateParams, Courses, CoursesService, Schoolclasses) {


            $scope.slaveCourses = [];
            $scope.cards = [];

            $scope.findData = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
                $scope.schoolclass = Schoolclasses.get({
                    schoolclassId: $stateParams.schoolclassId
                });

            };

            $scope.loadUsageData = function (slave) {


                $scope.slaveCourses[slave] = Courses.get({
                    courseId: slave
                });


            };


        }
    ]);
