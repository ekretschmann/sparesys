'use strict';

angular.module('schools').controller('UnsubscribeTeacherModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $window, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {


            //console.log('ga teacher unsubscribes from school');
            //console.log('/schools/unsubscribe/teacher/:id');
            //if ($window.ga) {
            //    console.log('sending to ga');
            //    $window.ga('send', 'pageview', '/schools/unsubscribe/teacher/:id');
            //    $window.ga('send', 'event', 'user unsubscribes from a school as teacher');
            //}


            for (var i in $scope.school.teachers) {
                if ($scope.school.teachers[i]._id === $scope.authentication.user._id) {
                    $scope.school.teachers.splice(i, 1);
                }
            }

            $scope.school.$update(function() {
                $modalInstance.close();
            });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
])
;