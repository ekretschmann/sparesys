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
            packs.push(this.pack._id);

            if (pack.slaves) {
                pack.slaves.forEach(function (slaveId) {
                    packs.push(slaveId);
                }, this);
            }

            packs.forEach(function (pId) {
                var card = new Cards({
                    question: this.question,
                    answer: this.answer,
                    packs: [pId]
                });
                card.$save();
                Packs.query({
                    _id: pId
                }, function (packs) {

                    packs[0].cards.push(card._id);
                    packs[0].$update(function() {
                        $state.go($state.$current, null, { reload: true });
                    });
                });
            }, this);

            JourneyService.cardCreated();
            this.question = '';
            this.answer = '';
            angular.element('.focus').trigger('focus');
        };
    }
]);