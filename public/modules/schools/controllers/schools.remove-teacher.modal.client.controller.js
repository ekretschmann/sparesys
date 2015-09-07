'use strict';

angular.module('schools').controller('RemoveTeacherFromSchoolModalController', ['$scope', '$state', '$location', '$modalInstance', 'teacher', 'school','Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, teacher, school, Schools, Schoolclasses, Authentication) {
        $scope.teacher = teacher;
        $scope.school = school;
        $scope.authentication = Authentication;

        $scope.ok = function () {


            for (var i=0; i<school.teachers.length; i++) {
                if (school.teachers[i] === $scope.teacher) {
                    school.teachers.splice(i, 1);
                }
            }

            school.$update(function() {
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
