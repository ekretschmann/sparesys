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
                var state = 'answer';
                var question = '';
                var answer = '';
                var id = 0;
                $scope.error = undefined;

                    course.name = $scope.options.name;
                course.description = $scope.options.description;

                if (!course.name || course.name === '') {
                    $scope.error = 'Please fill in course name';
                    return;
                }

                if (!course.description || course.description === '') {
                    $scope.error = 'Please fill in course description';
                    return;
                }

                course.packs = [];

                var lines = $scope.text.split('\n');

                for (var i = 0; i < lines.length; i++) {

                    var line = lines[i];
                    if (line.length > 140) {
                        $scope.error = 'Maximum length of lines is 140. Line is: '+line;
                        return;
                    }


                    if (i > 10000) {
                        $scope.error = 'Maximum upload length is 5000 cards';
                        return;
                    }
                }

                for (var j = 0; j < lines.length; j++) {
                    line = lines[j];

                    if (line.indexOf('++') === 0) {
                        if (state === 'question') {
                            $scope.error = 'There is no answer for question '+ card.question;
                            return;
                        }
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
                            pack.cards.push(card);
                            state = 'answer';
                        } else {
                            card = {};
                            card.question = line;
                            card.id = id++;
                            state = 'question';
                        }
                    }
                }

//                console.log(course);
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