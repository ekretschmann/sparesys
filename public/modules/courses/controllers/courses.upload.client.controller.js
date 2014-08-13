'use strict';


// Courses controller
angular.module('courses').controller('UploadController',
    ['$scope', '$q','$stateParams', '$state', '$location', '$modal', 'Authentication', 'CoursesService',
        function ($scope, $q, $stateParams, $state, $location, $modal, Authentication, CoursesService) {
            $scope.authentication = Authentication;
            $scope.text = '';
            $scope.state = '';
            $scope.options = {};

            $scope.instructions = '++Pack Name 1\nQuestion 1\nAnswewer 1\nQuestion 2\nAnswewer 2\n[more questions and answers]\n++Pack Name 2\netc.';

            $scope.uploadQA = function () {
                var course = {};
                course.packs = [];
                var pack;
                var card = {};
                var state = 'question';
                var question = '';
                var answer = '';
                var id = 0;

                course.name = $scope.options.name;
                course.description = $scope.options.description;

                if (!course.name || course.name === '') {
                    $scope.error = 'Please fill in course name';
                    return;
                }

                if (!course.desciption || course.description === '') {
                    $scope.error = 'Please fill in course description';
                    return;
                }

                course.packs = [];

                var lines = $scope.text.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];

                    if (line.indexOf('++') === 0) {

                        pack = {};
                        pack.id = id++;
                        pack.name = line.substring(2);
                        pack.cards = [];
                        card = {};
                        card.id = id++;
                        course.packs.push(pack);
                    } else {
                        if (state === 'question') {
                            if (!pack) {
                                $scope.error = 'There is no pack for question '+line;
                                return;
                            }
                            card.answer = line;
                            state = 'answer';
                        } else {
                            card.question = line;
                            pack.cards.push(card);
                            card = {};
                            card.id = id++;
                            state = 'question';
                        }
                    }
                }

                var res = CoursesService.uploadCourse();
                res.post({course: course});

                $location.path('/');
            };

//            $scope.uploadAQ = function () {
//                var course = {};
//                course.packs = [];
//                var pack = {};
//                var card = {};
//                var state = 'question';
//                var question = '';
//                var answer = '';
//                var id = 0;
//
//                var lines = $scope.text.split('\n');
//                for (var i = 0; i < lines.length; i++) {
//                    var line = lines[i];
//                    if (line.indexOf('--') === 0) {
//                        pack = {};
//                        pack.id = id++;
//                        pack.name = line.substring(2);
//                        pack.cards = [];
//                        card = {};
//                        card.id = id++;
//                        course.packs.push(pack);
//                    } else {
//                        if (state === 'question') {
//                            card.question = line;
//                            state = 'answer';
//                        } else {
//                            card.answer = line;
//                            pack.cards.push(card);
//                            card = {};
//                            card.id = id++;
//                            state = 'question';
//                        }
//                    }
//                }
//
////                var res = CoursesService.uploadCourse();
////                res.post({course: course});
//
//                console.log(course);
//            };



        }
    ])
;