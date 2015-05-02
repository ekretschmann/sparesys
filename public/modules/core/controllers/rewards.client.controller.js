'use strict';


// Courses controller
angular.module('core').controller('RewardsController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {



        $scope.processChoice = function (choice) {

            console.log('you chose '+choice);
            $scope.$parent.recoverFromReward();

        };

            $document.bind('keypress', function (event) {


                $state.go($state.current);


                if ($scope.$parent.mode !== 'reward' ) {
                    return;
                }



                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }




                    if (event.charCode === 49) {
                        $scope.processChoice(1);
                    }
                    if (event.charCode === 50) {
                        $scope.processChoice(2);
                    }
                    if (event.charCode === 51) {
                        $scope.processChoice(3);
                    }


            });

    }]);