'use strict';

angular.module('schools').controller('SubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'Users', 'school', 'user',
    function ($scope, $location, $window, $modalInstance, Authentication, Users, school, user) {

        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {

            Users.get({
                userId: user._id
            }, function (result) {

                if (result.studentInSchools.indexOf($scope.school._id) === -1) {
                    result.studentInSchools.push($scope.school._id);

                    result.$update(function () {
                        $scope.user.studentInSchools.push($scope.school._id);
                        $modalInstance.close();
                    });
                } else {
                    $modalInstance.close();
                }
            });

            //$scope.school.students.push($scope.authentication.user._id);
            //$scope.school.$update();
            //
            //console.log('ga student subscribes to school');
            //console.log('/schools/subscribe/student/:id');
            //if ($window.ga) {
            //    console.log('sending to ga');
            //    $window.ga('send', 'pageview', '/schools/subscribe/student/:id');
            //    $window.ga('send', 'event', 'user subscribes to a school as student');
            //}
            //
            //// should be solved server sided with a rest call, really
            //if ($scope.authentication.user.studentInSchools.indexOf($scope.school._id) === -1) {
            //    $scope.authentication.user.studentInSchools.push($scope.school._id);
            //}
            //
            //
            //    Users.get({
            //        userId: $scope.authentication.user._id
            //    }, function (result) {
            //        result.studentInSchools = $scope.authentication.user.studentInSchools;
            //        result.$update(function(updatedUser) {
            //            Authentication.user = updatedUser;
            //        });
            //
            //    });




            //$modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
