'use strict';

angular.module('schools').controller('RemoveSchoolFromUserModalController', ['$scope', '$state', '$location', '$modalInstance', 'schoolId', 'user', 'Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, schoolId, user, Schools, Schoolclasses, Authentication) {
        $scope.schoolId = schoolId;
        $scope.user = user;

        $scope.ok = function () {

            //console.log(schoolId);
            //console.log(user);
            //

            for (var i=0; i<=user.studentInSchools.length; i++) {
                if (user.studentInSchools[i] === schoolId) {
                    user.studentInSchools.splice(i, 1);
                }
            }

            user.$update(function() {
                $modalInstance.close();
            });

            //school.schoolclasses.forEach(function(schoolclass) {
            //    new Schoolclasses(schoolclass).$remove();
            //});
            //
            ////new Schools(school).$remove(function() {
            ////    $state.go($state.current, null, { reload: true});
            ////});
            //
            //Schools.get({
            //    schoolId: $scope.school._id
            //}, function (s) {
            //
            //    s.$remove(function(result) {
            //        $modalInstance.close();
            //    });
            //
            //});


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
