'use strict';

angular.module('schools').controller('SubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $window, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            school.students.push($scope.authentication.user._id);
            school.$update();

            console.log('ga student subscribes to school');
            console.log('/schools/subscribe/student/:id');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schools/subscribe/student/:id');
                $window.ga('send', 'event', 'user subscribes to a school as student');
            }

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);