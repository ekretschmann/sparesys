'use strict';

angular.module('packs').controller('AddCardToPackController', ['$window', '$scope', '$state', '$timeout', '$modalInstance', 'pack', 'course', 'Cards', 'Packs',
    function ($window, $scope, $state, $timeout, $modalInstance, pack, course, Cards, Packs) {
        $scope.pack = pack;
        $scope.course = course;
        $scope.options = {};
        $scope.options.format = 'short';
        $scope.options.answer = '';
        $scope.options.answerExtension = '';
        $scope.options.question = '';
        $scope.options.questionExtension = '';

        $scope.specialCharsFront = [];
        $scope.specialCharsBack = [];

        $scope.typeSpecialCharFront = function (c) {
            if (!$scope.options.question) {
                $scope.options.question = '';
            }

            var selectionStart = angular.element('.front')[0].selectionStart;
            var selectionEnd = angular.element('.front')[0].selectionEnd;

            $scope.options.question = $scope.options.question.substr(0, selectionStart) + c + $scope.options.question.substr(selectionEnd);
            angular.element('.front').trigger('focus');
        };

        $scope.typeSpecialCharBack = function (c) {
            if (!$scope.options.answer) {
                $scope.options.answer = '';
            }

            var selectionStart = angular.element('.back')[0].selectionStart;
            var selectionEnd = angular.element('.back')[0].selectionEnd;

            $scope.options.answer = $scope.options.answer.substr(0, selectionStart) + c + $scope.options.answer.substr(selectionEnd);
            angular.element('.back').trigger('focus');
        };

        $scope.setSpecialCharacters = function (lang) {





            $scope.specialChars = [];
            if (lang === 'Spanish') {
                $scope.specialChars = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
            } else if (lang === 'French') {
                $scope.specialChars = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
            } else if (lang === 'German') {
                $scope.specialChars = ['ä', 'é', 'ö', 'ü', 'ß'];
            }
            //
            //
            //$scope.specialCharsBack = [];
            //if (langBack === 'Spanish') {
            //    $scope.specialCharsBack = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
            //} else if (langBack === 'French') {
            //    $scope.specialCharsBack = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
            //} else if (langBack === 'German') {
            //    $scope.specialCharsBack = ['ä', 'é', 'ö', 'ü', 'ß'];
            //}
        };

        $scope.setSpecialCharacters();

        $scope.toggleFormat = function() {
            if ( $scope.options.format === 'short') {
                $scope.options.format = 'long';
            } else if ($scope.options.format === 'long') {
                $scope.options.format = 'short';
            }
        };

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addCardToPack = function () {


            var original = new Cards({
                question: $scope.options.question,
                questionExtension: $scope.options.questionExtension,
                answer: $scope.options.answer,
                answerExtension: $scope.options.answerExtension,
                packs: [$scope.pack._id],
                course: $scope.course._id,
                format:  $scope.options.format,
                slaves: []
            });

            if ($scope.course.cardDefaults) {
                if ($scope.course.cardDefaults.languageFront) {
                    original.languageFront = $scope.course.cardDefaults.languageFront;
                }
                if ($scope.course.cardDefaults.languageBack) {
                    original.languageBack = $scope.course.cardDefaults.languageBack;
                }
                if ($scope.course.cardDefaults.checks) {
                    if ($scope.course.cardDefaults.checks === 'Mixed Checks') {
                        original.check = 'mixed';
                    }
                    if ($scope.course.cardDefaults.checks === 'Self Checks') {
                        original.check = 'self';
                    }
                    if ($scope.course.cardDefaults.checks === 'Computer Checks') {
                        original.check = 'computer';
                    }
                }
                if ($scope.course.cardDefaults.forward) {
                    if($scope.course.cardDefaults.forward.enabled) {
                        if(!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('forward');
                    }
                    original.readFrontForward = $scope.course.cardDefaults.forward.readFront;
                    original.readBackForward = $scope.course.cardDefaults.forward.readBack;
                    original.speechRecognitionForward = $scope.course.cardDefaults.forward.speechRecognition;
                }

                if ($scope.course.cardDefaults.reverse) {
                    if($scope.course.cardDefaults.reverse.enabled) {
                        if(!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('reverse');
                    }
                    original.readFrontReverse = $scope.course.cardDefaults.reverse.readFront;
                    original.readBackReverse = $scope.course.cardDefaults.reverse.readBack;
                    original.speechRecognitionReverse = $scope.course.cardDefaults.reverse.speechRecognition;
                }

                if ($scope.course.cardDefaults.images) {
                    if($scope.course.cardDefaults.images.enabled) {
                        if(!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('images');
                    }
                    original.readFrontImages = $scope.course.cardDefaults.images.readFront;
                    original.readBackImages = $scope.course.cardDefaults.images.readBack;
                    original.speechRecognitionImages = $scope.course.cardDefaults.images.speechRecognition;
                }
            }

            var self = {};
            self.question = $scope.options.question;
            self.questionExtension = $scope.options.questionExtension;
            self.answer = $scope.options.answer;
            self.answerExtension = $scope.options.answerExtension;
            self.format = $scope.options.format;
            original.$save(function () {

                console.log('ga create card');
                console.log('/packs/addcardtopack');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/packs/addcardtopack');
                    $window.ga('send', 'event', 'create card');
                }

                $scope.pack.cards.push(original._id);
                $scope.pack.$update(function () {
                    $state.go($state.$current, null, { reload: true });
                });


                self.slaves = [];
                self.slavesToSave = pack.slaves.length;
                self.slavesSaved = 0;

                // take care of slaves
                pack.slaves.forEach(function (slaveId) {

                    Packs.query({
                        _id: slaveId
                    }, function (slavePacks) {
                        if (slavePacks.length === 1) {
                            var slave = slavePacks[0];
                            var card = new Cards({
                                userId: slave.user,
                                master: original._id,
                                course: slave.course,
                                supervisor: original.user,
                                question: self.question,
                                questionExtension: self.questionExtension,
                                answer: self.answer,
                                answerExtension: self.answerExtension,
                                format: self.format,
                                packs: [slaveId]
                            });
                            card.$save(function () {
                                slave.cards.push(card._id);
                                slave.$update();
                                self.slaves.push(card._id);
                                self.slavesSaved ++;

                                if(self.slavesSaved === self.slavesToSave) {
                                    original.slaves = self.slaves;
                                    original.$update();
                                }
                            });

                        }
                    });
                }, this);

            });


            $scope.options.question = '';
            $scope.options.questionExtension = '';
            $scope.options.answer = '';
            $scope.options.answerExtension = '';
            angular.element('.focus').trigger('focus');
        };
    }
]);
