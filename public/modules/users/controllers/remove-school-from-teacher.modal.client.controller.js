'use strict';

angular.module('schools').controller('RemoveSchoolFromTeacherModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'user',
    function ($scope, $state, $location, $modalInstance, school, user) {
        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {

            //console.log(schoolId);
            //console.log(user);
            //

            for (var i=0; i<=user.teacherInSchools.length; i++) {
                if (user.teacherInSchools[i] === school._id) {
                    user.teacherInSchools.splice(i, 1);
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
