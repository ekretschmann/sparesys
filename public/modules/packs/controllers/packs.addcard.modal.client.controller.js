'use strict';

angular.module('packs').controller('AddCardToPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'course', 'Cards', 'Packs', 'JourneyService',
    function ($scope, $state, $timeout, $modalInstance, pack, course, Cards, Packs, JourneyService) {
        $scope.pack = pack;
        $scope.course = course;
        $scope.options = {};
        $scope.options.format = 'short';
        $scope.options.answer = '';
        $scope.options.question = '';
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

        $scope.setSpecialCharacters = function () {
            var langFront = $scope.course.language.name;
            var langBack = $scope.course.languageback.name;


            if (langFront === 'Spanish') {
                $scope.specialCharsFront = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
            } else if (langFront === 'French') {
                $scope.specialCharsFront = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
            } else if (langFront === 'German') {
                $scope.specialCharsFront = ['ä', 'é', 'ö', 'ü', 'ß'];
            } else if (langFront === 'English (GB)') {
                $scope.specialCharsFront = [];
            } else if (langFront === '') {
                $scope.specialCharsFront = [];
            }

            if (langBack === 'Spanish') {
                $scope.specialCharsBack = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
            } else if (langBack === 'French') {
                $scope.specialCharsBack = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
            } else if (langBack === 'German') {
                $scope.specialCharsBack = ['ä', 'é', 'ö', 'ü', 'ß'];
            } else if (langBack === 'English (GB)') {
                $scope.specialCharsBack = [];
            } else if (langBack === '') {
                $scope.specialCharsBack = [];
            }
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
                answer: $scope.options.answer,
                packs: [$scope.pack._id],
                course: $scope.course._id,
                format:  $scope.options.format,
                slaves: []
            });

            var self = {};
            self.question = $scope.options.question;
            self.answer = $scope.options.answer;
            self.format = $scope.options.format;
            original.$save(function () {
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
//                            console.log(slave.user);
                            var card = new Cards({
                                userId: slave.user,
                                master: original._id,
                                course: slave.course,
                                supervisor: original.user,
                                question: self.question,
                                answer: self.answer,
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


//            packs.forEach(function (pId) {
//
//                var self = {};
//                self.question = this.question;
//                self.answer = this.answer;
//
//                Packs.query({
//                    _id: pId
//                }, function (packs) {
//                    var card = new Cards({
//                        question: self.question,
//                        answer: self.answer,
//                        packs: [pId],
//                        user: packs[0].user
//                    });
//
//                    card.$save();
//                    original.slaves.push(card._id);
//                    console.log('here');
//                    console.log(original);
//
//                    original.$save(function() {
//                        $state.go($state.$current, null, { reload: true });
//                    });
//
//
//                    packs[0].cards.push(card._id);
//                    packs[0].$update();
//                });
//            }, this);


            JourneyService.cardCreated();
            $scope.options.question = '';
            $scope.options.answer = '';
            angular.element('.focus').trigger('focus');
        };
    }
]);