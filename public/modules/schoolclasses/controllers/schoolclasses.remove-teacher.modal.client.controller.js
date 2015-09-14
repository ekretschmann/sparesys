'use strict';

angular.module('schools').controller('RemoveTeacherFromSchoolclassModalController', ['$scope', '$state', '$location', '$modalInstance', 'teacher', 'schoolclass','Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, teacher, schoolclass, Schools, Schoolclasses, Authentication) {
        $scope.teacher = teacher;
        $scope.schoolclass = schoolclass;
        $scope.authentication = Authentication;

        $scope.ok = function () {


            for (var i=0; i<schoolclass.teachers.length; i++) {
                if (schoolclass.teachers[i] === $scope.teacher) {
                    schoolclass.teachers.splice(i, 1);
                }
            }

            schoolclass.$update(function() {
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
