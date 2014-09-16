'use strict';

angular.module('packs').controller('AddCardToPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'course', 'Cards', 'Packs', 'JourneyService',
    function ($scope, $state, $timeout, $modalInstance, pack, course, Cards, Packs, JourneyService) {
        $scope.pack = pack;
        $scope.course = course;
        $scope.options = {};
        $scope.options.format = 'short';
        $scope.options.answer = '';
        $scope.options.question = '';

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