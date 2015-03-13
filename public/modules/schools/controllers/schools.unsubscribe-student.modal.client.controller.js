'use strict';

angular.module('schools').controller('UnsubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $window, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            for (var i in school.students) {
                if (school.students[i] === $scope.authentication.user._id) {
                    school.students.splice(i, 1);
                }
            }
            school.$update();

            console.log('/schools/unsubscribe/student/:id');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schools/unsubscribe/student/:id');
                $window.ga('send', 'event', 'user unsubscribes from a school as student');
            }

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);