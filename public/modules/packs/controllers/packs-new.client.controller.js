'use strict';

// Packs controller
angular.module('packs').controller('PacksControllerNew', ['$window', '$timeout','$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($window, $timeout, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards) {
        $scope.authentication = Authentication;


        $scope.priorities = ['highest', 'high', 'medium', 'low', 'lowest'];
        $scope.checks = {};
        $scope.checks.self = 'self-checked';
        $scope.checks.mixed = 'mixed';
        $scope.checks.computer = 'computer-checked';

        // Update existing Pack
        $scope.update = function () {

            $scope.pack.$update();

        };

        // Find a list of Packs
        $scope.find = function () {
            $scope.packs = Packs.query();
        };

        // Find existing Pack
        $scope.findOne = function () {

            if ($stateParams.tab) {

                $scope.activeTab = $stateParams.tab;

                $scope.tabs.forEach(function (tab) {
                    if (tab.title === $stateParams.tab) {
                        tab.active = true;
                    } else {
                        tab.active = false;
                    }
                });

            }

            $scope.pack = Packs.get({
                packId: $stateParams.packId
            }, function () {
                var prev, next;

                for (var i = 0; i < $scope.pack.course.packs.length; i++) {
                    var packId = $scope.pack.course.packs[i];
                    if (packId === $scope.pack._id) {
                        $scope.prevPack = prev;
                        if ($scope.pack.course.packs.length > i) {
                            $scope.nextPack = $scope.pack.course.packs[i + 1];
                        }
                    } else {
                        prev = packId;
                    }
                }
            });
        };


        // Find existing Pack
        $scope.findById = function (packId) {
            $scope.pack = Packs.get({
                packId: packId
            });
        };

        $scope.getCourseName = function (pack) {
            Courses.query({
                _id: pack.course
            }, function (courses) {
                if (courses.length === 1) {
                    pack.courseName = courses[0].name;
                } else {
                    pack.courseName = 'undefined';
                }
            });


        };

        $scope.bulkEditPackModal = function (pack) {

            $scope.pack = pack;

            $modal.open({
                templateUrl: 'bulkEditPack.html',
                controller: 'BulkEditPackController',
                resolve: {

                    pack: function () {
                        return $scope.pack;
                    }
                }
            });
        };


        $scope.areYouSureToDeletePack = function (pack) {

            $scope.pack = pack;

            $modal.open({
                templateUrl: 'areYouSureToDeletePack.html',
                controller: 'DeletePackController',
                resolve: {

                    pack: function () {
                        return $scope.pack;
                    },
                    course: function () {
                        return $scope.course;
                    }
                }
            });
        };


        $scope.areYouSureToDeleteCard = function (card) {

            $modal.open({
                templateUrl: 'areYouSureToDeleteCard.html',
                controller: 'DeleteCardController',
                resolve: {
                    card: function () {
                        return card;
                    },
                    pack: function () {
                        return $scope.pack;
                    }
                }
            }).result.then(function (x) {

                    var scrollpos = document.body.scrollHeight;


                    $scope.pack = Packs.get({
                        packId: $scope.pack._id
                    }, function() {
                        $timeout(function() {
                            $window.scrollTo(0, scrollpos);
                        });

                    });

                });


        };


        $scope.newCard = {};
        $scope.newCard.question = '';
        $scope.newCard.questionExtension = '';
        $scope.newCard.answer = '';
        $scope.newCard.answerExtension = '';


        $scope.scrollDown = function () {
            $window.scrollTo(0, document.body.scrollHeight);
            angular.element('.focus').trigger('focus');
        };

        $scope.addCardToPack = function () {


            var original = new Cards({
                question: $scope.newCard.question,
                questionExtension: $scope.newCard.questionExtension,
                answer: $scope.newCard.answer,
                answerExtension: $scope.newCard.answerExtension,
                packs: [$scope.pack._id],
                course: $scope.pack.course._id,
                slaves: []
            });



            if ($scope.pack.course.cardDefaults) {
                if ($scope.pack.course.cardDefaults.languageFront) {
                    original.languageFront = $scope.pack.course.cardDefaults.languageFront;
                }
                if ($scope.pack.course.cardDefaults.languageBack) {
                    original.languageBack = $scope.pack.course.cardDefaults.languageBack;
                }
                if ($scope.pack.course.cardDefaults.checks) {
                    if ($scope.pack.course.cardDefaults.checks === 'Mixed Checks') {
                        original.check = 'mixed';
                    }
                    if ($scope.pack.course.cardDefaults.checks === 'Self Checks') {
                        original.check = 'self';
                    }
                    if ($scope.pack.course.cardDefaults.checks === 'Computer Checks') {
                        original.check = 'computer';
                    }
                }
                if ($scope.pack.course.cardDefaults.forward) {
                    if ($scope.pack.course.cardDefaults.forward.enabled) {
                        if (!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('forward');
                    }
                    original.readFrontForward = $scope.pack.course.cardDefaults.forward.readFront;
                    original.readBackForward = $scope.pack.course.cardDefaults.forward.readBack;
                    original.speechRecognitionForward = $scope.pack.course.cardDefaults.forward.speechRecognition;
                }

                if ($scope.pack.course.cardDefaults.reverse) {
                    if ($scope.pack.course.cardDefaults.reverse.enabled) {
                        if (!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('reverse');
                    }
                    original.readFrontReverse = $scope.pack.course.cardDefaults.reverse.readFront;
                    original.readBackReverse = $scope.pack.course.cardDefaults.reverse.readBack;
                    original.speechRecognitionReverse = $scope.pack.course.cardDefaults.reverse.speechRecognition;
                }

                if ($scope.pack.course.cardDefaults.images) {
                    if ($scope.pack.course.cardDefaults.images.enabled) {
                        if (!original.modes) {
                            original.modes = [];
                        }
                        original.modes.push('images');
                    }
                    original.readFrontImages = $scope.pack.course.cardDefaults.images.readFront;
                    original.readBackImages = $scope.pack.course.cardDefaults.images.readBack;
                    original.speechRecognitionImages = $scope.pack.course.cardDefaults.images.speechRecognition;
                }
            }
            //
            //var self = {};
            //self.question = $scope.options.question;
            //self.questionExtension = $scope.options.questionExtension;
            //self.answer = $scope.options.answer;
            //self.answerExtension = $scope.options.answerExtension;
            //self.format = $scope.options.format;
            original.$save(function (x) {



                //console.log(x);

                //console.log('ga create card');
                //console.log('/packs/addcardtopack');
                //if ($window.ga) {
                //    console.log('sending to ga');
                //    $window.ga('send', 'pageview', '/packs/addcardtopack');
                //    $window.ga('send', 'event', 'create card');
                //}

                $scope.pack.cards.push(original);
                $scope.pack.$update(function () {
                    $scope.pack = Packs.get({
                        packId: $scope.pack._id
                    }, function() {
                        angular.element('.focus').trigger('focus');
                        $timeout(function() {
                            $window.scrollTo(0, document.body.scrollHeight);
                        });
                    });
                });


                //self.slaves = [];
                //self.slavesToSave = pack.slaves.length;
                //self.slavesSaved = 0;
                //
                //// take care of slaves
                //$scope.pack.slaves.forEach(function (slaveId) {
                //
                //    Packs.query({
                //        _id: slaveId
                //    }, function (slavePacks) {
                //        if (slavePacks.length === 1) {
                //            var slave = slavePacks[0];
                //            var card = new Cards({
                //                userId: slave.user,
                //                master: original._id,
                //                course: slave.course,
                //                supervisor: original.user,
                //                question: self.question,
                //                questionExtension: self.questionExtension,
                //                answer: self.answer,
                //                answerExtension: self.answerExtension,
                //                format: self.format,
                //                packs: [slaveId]
                //            });
                //            card.$save(function () {
                //                slave.cards.push(card._id);
                //                slave.$update();
                //                self.slaves.push(card._id);
                //                self.slavesSaved ++;
                //
                //                if(self.slavesSaved === self.slavesToSave) {
                //                    original.slaves = self.slaves;
                //                    original.$update();
                //                }
                //            });
                //
                //        }
                //    });
                //}, this);

            });

            $scope.newCard.question = '';
            $scope.newCard.questionExtension = '';
            $scope.newCard.answer = '';
            $scope.newCard.answerExtension = '';
        };


    }
]);