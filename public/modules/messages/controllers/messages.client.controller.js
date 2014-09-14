'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages', 'Cards',
    function ($scope, $stateParams, $location, Authentication, Messages, Cards) {
        $scope.authentication = Authentication;

        $scope.validationRequests = [];

        $scope.accept = function(message) {

            Cards.get({
                cardId: message.card
            }, function(card) {
                if (message.direction === 'forward') {
                    card.validanswers.push(message.content);
                } else {
                    card.validreverseanswers.push(message.content);
                }

                card.$update();


                for (var i in $scope.validationRequests) {
                    var req = $scope.validationRequests[i];
                    if(req.card === message.card && req.content === message.content) {
                        $scope.validationRequests.splice(i, 1);
                        req.$remove();
                    }
                }
            });
        };

        $scope.decline = function(message) {
            Cards.get({
                cardId: message.card
            }, function(card) {
                if (message.direction === 'forward') {
                    card.invalidanswers.push(message.content);
                } else {
                    card.invalidreverseanswers.push(message.content);
                }

                card.$update();


                for (var i in $scope.validationRequests) {
                    var req = $scope.validationRequests[i];
                    if(req.card === message.card && req.content === message.content) {
                        $scope.validationRequests.splice(i, 1);
                        req.$remove();
                    }
                }
            });
        };

        $scope.ignore = function(message) {
            for (var i in $scope.validationRequests) {
                var req = $scope.validationRequests[i];
                if(req.card === message.card && req.content === message.content) {
                    $scope.validationRequests.splice(i, 1);
                    req.$remove();
                }
            }
        };

        // Create new Message
        $scope.create = function () {
            // Create new Message object
            var message = new Messages({
                name: this.name
            });

            // Redirect after save
            message.$save(function (response) {
                $location.path('messages/' + response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.name = '';
        };

        // Remove existing Message
        $scope.remove = function (message) {
            if (message) {
                message.$remove();

                for (var i in $scope.messages) {
                    if ($scope.messages [i] === message) {
                        $scope.messages.splice(i, 1);
                    }
                }
            } else {
                $scope.message.$remove(function () {
                    $location.path('messages');
                });
            }
        };

        // Update existing Message
        $scope.update = function () {
            var message = $scope.message;

            message.$update(function () {
                $location.path('messages/' + message._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Messages
        $scope.find = function () {
            $scope.messages = Messages.query();
        };

        // Find existing Message
        $scope.findOne = function () {
            $scope.message = Messages.get({
                messageId: $stateParams.messageId
            });
        };

        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                Messages.query({
                    to: $scope.authentication.user._id
                }, function(msgs) {
                    $scope.validationRequests = [];
                    msgs.forEach(function(msg){
                        if(msg.type === 'validation-request') {
                            $scope.validationRequests.push(msg);
                        }
                    }, this);


                });
            }
        };
    }
]);