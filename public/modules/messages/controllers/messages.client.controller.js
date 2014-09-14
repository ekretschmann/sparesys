'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
    function ($scope, $stateParams, $location, Authentication, Messages) {
        $scope.authentication = Authentication;

        $scope.validationRequests = [];

        $scope.accept = function(message) {
            console.log('accept '+message.card);


        };

        $scope.decline = function(message) {
            console.log('decline '+message);
        };

        $scope.ignore = function(message) {
            console.log('ignore '+message);
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