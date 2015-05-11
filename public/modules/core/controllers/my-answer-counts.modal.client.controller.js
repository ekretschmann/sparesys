'use strict';

angular.module('core').controller('MyAnswerCountsModalController', ['$scope', '$modalInstance', 'Cards', 'answer', 'mode', 'card', 'supervised','RetentionCalculatorService', 'Messages', 'Authentication',
    function ($scope, $modalInstance, Cards, answer, mode, card, supervised, RetentionCalculatorService, Messages, Authentication) {

        $scope.answer = answer;
        $scope.mode = mode;
        $scope.card = card;

        $scope.ok = function () {


            console.log('answer '+$scope.answer);

            $scope.card.history.splice(-1,1);
            var time = Date.now();
            var newHrt = RetentionCalculatorService.calculateFor($scope.card, Date.now(), 3);
            $scope.card.history.push({when: time, assessment: 3, hrt:newHrt});

            if (supervised) {
                var msg = new Messages({
                    sender: Authentication.user.displayName,
                    direction: $scope.mode,
                    card: $scope.card.master,
                    content: $scope.answer,
                    to: [$scope.card.supervisor]
                });

                console.log(msg);
                msg.$save();
            } else {
                console.log('xxxxxx');
            }
            //new Cards($scope.card).$update();


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);