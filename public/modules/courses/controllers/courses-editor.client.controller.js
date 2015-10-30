'use strict';


angular.module('courses').controller('CoursesEditorController',
    ['$window', '$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService',
        function ($window, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService) {

            $scope.authentication = Authentication;
            $scope.editMode = 'data';


            $scope.showMode = function (mode) {
                $scope.editMode = mode;
            };

            if (!$scope.authentication.user) {
                $location.path('/');
            }


            $scope.areYouSureToDeleteCourse = function (course) {

                $scope.course = course;
                $modal.open({
                    templateUrl: 'areYouSureToDeleteCourse.html',
                    controller: 'DeleteCourseModalController',
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });

            };


            $scope.change = function (card) {

                Cards.get({
                    cardId: card._id
                }, function (c) {
                    c.question = card.question;
                    c.answer = card.answer;

                    c.$update();
                });
            };


            // Find existing Course
            $scope.findOne = function () {


                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                }, function () {


                    var res = CoursesService.serverLoadCards();
                    res.get({courseId: $stateParams.courseId, packName: true}).$promise.then(function (cards) {
                        $scope.course.cards = cards;
                        $scope.course.showCards = [];
                        var showSize = Math.min(cards.length, $scope.MAX_SHOW_CARDS);
                        for (var i = 0; i < showSize; i++) {
                            $scope.course.showCards.push(cards[i]);
                        }

                    });
                });


            };


        }
    ]);
