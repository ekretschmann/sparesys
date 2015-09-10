'use strict';

angular.module('schools').controller('UnsubscribeTeacherModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'Users', 'school', 'user',
    function ($scope, $location, $window, $modalInstance, Authentication, Users, school, user) {

        $scope.user = user;
        $scope.school = school;

        $scope.ok = function () {


            Users.get({
                userId: user._id
            }, function (result) {

                result.teacherInSchools.splice(result.teacherInSchools.indexOf($scope.school._id), 1);
                result.$update(function() {
                    $scope.user.teacherInSchools.splice($scope.user.teacherInSchools.indexOf($scope.school._id), 1);
                    $modalInstance.close();
                });
            });

            //console.log('ga teacher unsubscribes from school');
            //console.log('/schools/unsubscribe/teacher/:id');
            //if ($window.ga) {
            //    console.log('sending to ga');
            //    $window.ga('send', 'pageview', '/schools/unsubscribe/teacher/:id');
            //    $window.ga('send', 'event', 'user unsubscribes from a school as teacher');
            //}




        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
])
;