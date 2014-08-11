'use strict';


// Courses controller
angular.module('courses').controller('UploadController',
    ['$scope', '$q','$stateParams', '$state', '$location', '$modal', 'Authentication', 'CoursesService',
        function ($scope, $q, $stateParams, $state, $location, $modal, Authentication, CoursesService) {
            $scope.authentication = Authentication;
            $scope.text = '';
            $scope.state = '';


            $scope.uploadWordList = function () {
                var course = {};
                course.packs = [];
                var pack = {};
                var card = {};
                var state = 'question';
                var question = '';
                var answer = '';
                var id = 0;

                var lines = $scope.text.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.indexOf('CN:') === 0) {
                        course.name = line.substring(3);
                    } else if (line.indexOf('CD:') === 0) {
                        course.description = line.substring(3);
                    } else if (line.indexOf('P:') === 0) {
                        pack = {};
                        pack.id = id++;
                        pack.name = line.substring(2);
                        pack.cards = [];
                        card = {};
                        card.id = id++;
                        course.packs.push(pack);
                    } else {
                        if (state === 'question') {
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

            };

            $scope.uploadTimestables = function () {
                var course = {};
                course.packs = [];
                var pack = {};
                var card = {};
                var state = 'question';
                var question = '';
                var answer = '';
                var id = 0;

                var lines = $scope.text.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.indexOf('CN:') === 0) {
                        course.name = line.substring(3);
                    } else if (line.indexOf('CD:') === 0) {
                        course.description = line.substring(3);
                    } else if (line.indexOf('P:') === 0) {
                        pack = {};
                        pack.id = id++;
                        pack.name = line.substring(2);
                        pack.cards = [];
                        card = {};
                        card.id = id++;
                        course.packs.push(pack);
                    } else {
                        if (state === 'question') {
                            card.question = line;
                            state = 'answer';
                        } else {
                            card.answer = line;
                            pack.cards.push(card);
                            card = {};
                            card.id = id++;
                            state = 'question';
                        }
                    }
                }

                var res = CoursesService.uploadCourse();
                res.post({course: course});

            };



        }
    ])
;