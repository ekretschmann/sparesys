'use strict';


// Courses controller
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

            $scope.loadUsageData =function(slave) {


                $scope.slaveCourses[slave] = Courses.get({
                    courseId: slave
                });


                var res = CoursesService.serverLoadCards();
                var promise = res.get({courseId: $stateParams.courseId});
                promise.$promise.then(function (cards) {
                    $scope.cards[slave] = cards;

                });
            };

        }
    ]);
