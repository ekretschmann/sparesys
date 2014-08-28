'use strict';

angular.module('packs').controller('ManagePackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'Cards',
    function ($scope, $state, $timeout, $modalInstance, pack, Cards) {
        $scope.pack = pack;
        var originalDue = pack.due;
        var originalAfter = pack.after;
        $scope.validation = 'leave unchanged';
        $scope.sound = 'leave unchanged';
        $scope.direction = 'leave unchanged';

        $scope.validations = ['always computer-checked', 'always self-checked', 'self-checked for new cards'];
        $scope.readQuestions = ['yes', 'no'];
        $scope.directions = ['one way', 'both ways'];


        // dont know why I have to do this. Seems the checkboxes don't like modal windows
        $scope.changeValidation = function(value) {
            $scope.validation = value;
        };

        $scope.changeSound = function(value) {
            $scope.sound = value;
        };

        $scope.changeAsk = function(value) {
            $scope.ask = value;
        };


        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.editPackFocus').trigger('focus');
            }, 100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {


            var courseName = pack.courseName;
            $scope.pack.$update(function () {
                pack.courseName = courseName;
            });



            var cardsToUpdate = pack.cards.length;
            var cardsUpdated = 0;
            pack.cards.forEach(function (card) {
                Cards.get({
                    cardId: card
                }, function (card) {
                    if (pack.due !== originalDue) {
                        card.due = pack.due;
                    }
                    if (pack.after !== originalAfter) {
                        card.after = pack.after;
                    }
                    if ($scope.validation === 'default') {
                        card.validation = 'default';
                    } else if ($scope.validation === 'checked') {
                        card.validation = 'checked';
                    } else if ($scope.validation === 'self') {
                        card.validation = 'self';
                    }
                    if ($scope.sound === 'yes') {
                        card.sound = true;
                    } else if ($scope.sound === 'no') {
                        card.sound = false;
                    }

                    if ($scope.ask === 'both') {
                        card.bothways = true;
                    } else if ($scope.ask === 'oneway') {
                        card.bothways = false;
                    }
                    card.$update(function() {
                        cardsUpdated++;
                        if (cardsUpdated === cardsToUpdate) {
                            $state.go($state.$current, null, {reload:true});
                        }
                    });
                });
            }, this);

            $modalInstance.dismiss('cancel');
        };
    }
]);