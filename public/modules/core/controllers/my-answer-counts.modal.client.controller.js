'use strict';

angular.module('core').controller('MyAnswerCountsModalController', ['$scope', '$modalInstance', 'Cards', 'answer', 'mode', 'card',
    function ($scope, $modalInstance, Cards, answer, mode, card) {

        $scope.answer = answer;
        $scope.mode = mode;
        $scope.card = card;

        $scope.ok = function () {


            console.log($scope.mode);
            if ($scope.mode === 'reverse') {
                $scope.card.acceptedAnswersReverse.push(answer);
            } else {
                $scope.card.acceptedAnswersForward.push(answer);
            }

            new Cards($scope.card).$update();


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);