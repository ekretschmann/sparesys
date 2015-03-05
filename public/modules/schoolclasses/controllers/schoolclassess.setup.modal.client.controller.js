'use strict';

angular.module('schoolclasses').controller('SetupClassController', ['$scope', '$location', '$state', '$modalInstance',
    'schoolclass', 'school','Schoolclasses', 'Courses',
	function($scope, $location, $state, $modalInstance, schoolclass, school, Schoolclasses, Courses) {
        $scope.schoolclass = schoolclass;
        $scope.school = school;


        $scope.ok = function () {




            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addTeacherToClass = function (teacherId) {
            console.log(teacherId);
            if ($scope.schoolclass.teachers.indexOf(teacherId) === -1) {
                $scope.schoolclass.teachers.push(teacherId);
            }
            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update();
        };

        $scope.removeTeacherFromClass = function (teacherId) {
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                if ($scope.schoolclass.teachers[i] === teacherId) {
                    $scope.schoolclass.teachers.splice(i, 1);
                }
            }
            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update();
        };

        $scope.removeStudentFromClass = function (studentId) {
            for (var i in $scope.schoolclass.students) {
                if ($scope.schoolclass.students[i] === studentId) {
                    $scope.schoolclass.students.splice(i, 1);
                }
            }

            Courses.query({
                userId: studentId
            }, function(courses) {
                courses.forEach(function(course) {
                    if ($scope.schoolclass.courses.indexOf(course.master) > -1) {
                        course.visble = true;
                        course.supervised = false;
                        course.$update();
                    }
                }, this);

            });

            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update();
        };

        $scope.addStudentToClass = function (studentId) {

            if ($scope.schoolclass.students.indexOf(studentId) === -1) {
                $scope.schoolclass.students.push(studentId);
            }

            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update(function () {

                $scope.schoolclass.courses.forEach(function(courseId) {
                    $scope.addCourseForStudent(studentId, courseId);
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





    }
]);