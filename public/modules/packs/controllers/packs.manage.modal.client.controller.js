'use strict';

angular.module('packs').controller('ManagePackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'Cards', 'JourneyService',
    function ($scope, $state, $timeout, $modalInstance, pack, Cards, JourneyService) {
        $scope.pack = pack;
        var originalDue = pack.due;
        var originalAfter = pack.after;
        $scope.validation = 'leave unchanged';
        $scope.sound = 'leave unchanged';
        $scope.direction = 'leave unchanged';

        $scope.validations = ['leave unchanged', 'always computer-checked', 'always self-checked', 'self-checked for new cards'];
        $scope.readQuestions = ['leave unchanged', 'yes', 'no'];
        $scope.directions = ['leave unchanged', 'one way', 'both ways'];


        // dont know why I have to do this. Seems the checkboxes don't like modal windows
        $scope.setValidation = function(value) {
            $scope.validation = value;
        };

        $scope.setSound = function(value) {
            $scope.sound = value;
        };

        $scope.setDirection = function(value) {
            $scope.direction = value;
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


            var cardsToUpdate = pack.cards.length;
            var cardsUpdated = 0;
            console.log('setting');
            JourneyService.packEdited();
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
                    if ($scope.validation === 'self-checked for new cards') {
                        card.validation = 'default';
                    } else if ($scope.validation === 'always computer-checked') {
                        card.validation = 'checked';
                    } else if ($scope.validation === 'always self-checked') {
                        card.validation = 'self';
                    }
                    if ($scope.sound === 'yes') {
                        card.sound = true;
                    } else if ($scope.sound === 'no') {
                        card.sound = false;
                    }

                    if ($scope.direction === 'both ways') {
                        card.bothways = true;
                    } else if ($scope.direction === 'one way') {
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