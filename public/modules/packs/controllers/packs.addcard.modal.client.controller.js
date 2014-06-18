'use strict';

angular.module('packs').controller('AddCardToPackController', ['$scope', '$state', '$modalInstance', 'pack', 'Cards',
	function($scope, $state, $modalInstance, pack, Cards) {
        $scope.pack = pack;

        $scope.setFocus = function () {
            //document.element('.hasfocus').trigger('focus');
        };

        $scope.ok = function () {
            this.name = '';
            //$state.go($state.$current, null, { reload: false });
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
                p.$update(function () {
                    $scope.name = '';
                    $state.go($state.$current, null, { reload: true });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            $scope.name = '';

        };
	}
]);