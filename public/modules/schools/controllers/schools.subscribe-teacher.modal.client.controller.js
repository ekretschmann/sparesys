'use strict';

angular.module('schools').controller('SubscribeTeacherModalController', ['$scope', '$window', '$location', '$modalInstance', 'Authentication', 'Users', 'school', 'user',
    function ($scope, $window, $location, $modalInstance, Authentication, Users, school, user) {

        //$scope.authentication = Authentication;
        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {


            console.log(user);
            Users.get({
                userId: user._id
            }, function (result) {

                result.teacherInSchools.push($scope.school._id);
                result.$update(function() {
                    $scope.user.teacherInSchools.push($scope.school._id);
                    $modalInstance.close();
                });
            });



            //
            //
            //console.log('ga teacher subscribes to school');
            //console.log('/schools/subscribe/teacher/:id');
            //if ($window.ga) {
            //    console.log('sending to ga');
            //    $window.ga('send', 'pageview', '/schools/subscribe/teacher/:id');
            //    $window.ga('send', 'event', 'user subscribes to a school as teacher');
            //}

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);