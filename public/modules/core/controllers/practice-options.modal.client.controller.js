'use strict';

angular.module('core').controller('PracticeOptionsController', ['$scope', '$modalInstance', 'options', 'cards',
    function ($scope, $modalInstance, options, cards) {


        $scope.options = options;
        $scope.cards = cards;
        $scope.dueDateOnlyEnabled = false;

        $scope.init = function() {

            for(var i=0; i<$scope.cards.length; i++) {
                if ($scope.cards[i].dueDate) {
                    $scope.dueDateOnlyEnabled = true;
                }
            }
        };

        $scope.init();


        $scope.ok = function () {




            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
