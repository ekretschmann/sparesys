'use strict';

angular.module('schools').controller('SubscribeTeacherModalController', ['$scope', '$window', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $window, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {
            school.teachers.push($scope.authentication.user._id);
            school.$update(function() {
                $modalInstance.close();
            });


            console.log('ga teacher subscribes to school');
            console.log('/schools/subscribe/teacher/:id');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schools/subscribe/teacher/:id');
                $window.ga('send', 'event', 'user subscribes to a school as teacher');
            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);