'use strict';

angular.module('packs').controller('AddCardToPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'course', 'Cards', 'JourneyService',
	function($scope, $state, $timeout, $modalInstance, pack, course, Cards, JourneyService) {
        $scope.pack = pack;
        $scope.course = course;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.addcardfocus').trigger('focus');
            },100);
        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addCardToPack = function () {

//            Create new Pack object
            var card = new Cards({
                question: this.question,
                answer: this.answer,
                packs: [this.pack._id]
            });


            // Redirect after save
            card.$save(function (response) {
                var cardid = response._id;
                var p = $scope.pack;
                p.cards.push(cardid);
                JourneyService.cardCreated();
                p.$update(function () {
                    $state.go($state.$current, null, { reload: true });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            this.question = '';
            this.answer = '';
            angular.element('.addcardfocus').trigger('focus');
        };
	}
]);