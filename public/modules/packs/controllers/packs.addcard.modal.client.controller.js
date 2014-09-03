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

            var packs = [];
            var original = new Cards({
                question: this.question,
                answer: this.answer,
                packs: [$scope.pack._id],
                slaves: []
            });

            if (pack.slaves) {
                pack.slaves.forEach(function (slaveId) {
                    packs.push(slaveId);
                }, this);
            }

            packs.forEach(function (pId) {

                var self = {};
                self.question = this.question;
                self.answer = this.answer;

                Packs.query({
                    _id: pId
                }, function (packs) {
                    var card = new Cards({
                        question: self.question,
                        answer: self.answer,
                        packs: [pId],
                        user: packs[0].user
                    });

                    card.$save();
                    console.log(original);
                    original.slaves.push(card._id);


                    packs[0].cards.push(card._id);
                    packs[0].$update();
                });
            }, this);

            console.log('here');
            console.log(original);

            original.$save(function() {
                $state.go($state.$current, null, { reload: true });
            });

            JourneyService.cardCreated();
            this.question = '';
            this.answer = '';
            angular.element('.focus').trigger('focus');
        };
    }
]);