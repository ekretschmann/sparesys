'use strict';

angular.module('packs').controller('AddCardToPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'course', 'Cards', 'Packs', 'JourneyService',
    function ($scope, $state, $timeout, $modalInstance, pack, course, Cards, Packs, JourneyService) {
        $scope.pack = pack;
        $scope.course = course;

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
                question: this.question,
                answer: this.answer,
                packs: [$scope.pack._id],
                course: $scope.course._id,
                slaves: []
            });
            var self = {};
            self.question = this.question;
            self.answer = this.answer;

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
                            var card = new Cards({
                                question: self.question,
                                answer: self.answer,
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
            this.question = '';
            this.answer = '';
            angular.element('.focus').trigger('focus');
        };
    }
]);