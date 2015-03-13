'use strict';

angular.module('schoolclasses').controller('SetupClassController', ['$scope', '$location', '$state', '$modalInstance',
    'schoolclass', 'school','Schoolclasses', 'Courses', 'Authentication', 'CoursesService',
	function($scope, $location, $state, $modalInstance, schoolclass, school, Schoolclasses, Courses, Authentication, CoursesService) {
        $scope.schoolclass = schoolclass;
        $scope.school = school;

        $scope.authentication = Authentication;



        $scope.availableTeachers = [];
        $scope.availableStudents = [];

        $scope.initSchoolclassSetup = function () {
            $scope.availableTeachers = [];
            $scope.availableStudents = [];
            for (var i = 0; i < $scope.school.teachers.length; i++) {
                var teacher = $scope.school.teachers[i];

                if ($scope.schoolclass.teachers.indexOf(teacher) === -1) {
                    $scope.availableTeachers.push(teacher);
                }
            }
            for (i = 0; i < $scope.school.students.length; i++) {
                var student = $scope.school.students[i];

                if ($scope.schoolclass.students.indexOf(student) === -1) {
                    $scope.availableStudents.push(student);
                }
            }
        };

        $scope.initSchoolclassSetup();

        $scope.ok = function () {

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addTeacherToClass = function (teacherId) {
            if ($scope.schoolclass.teachers.indexOf(teacherId) === -1) {
                $scope.schoolclass.teachers.push(teacherId);
            }
            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update(function(){
                $scope.initSchoolclassSetup();
            });
        };

        $scope.removeTeacherFromClass = function (teacherId) {
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                if ($scope.schoolclass.teachers[i] === teacherId) {
                    $scope.schoolclass.teachers.splice(i, 1);
                }
            }
            $scope.schoolclass.__v = undefined;
            new Schoolclasses($scope.schoolclass).$update(function(){
                $scope.initSchoolclassSetup();
            });
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
            new Schoolclasses($scope.schoolclass).$update(function(){
                $scope.initSchoolclassSetup();
            });
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

                $scope.initSchoolclassSetup();


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.addCourseForStudent = function (studentId, courseId) {
            Courses.query({
                userId: studentId
            }).$promise.then(function (studentCourses) {

                    var setVisible = false;
                    studentCourses.forEach(function (studentCourse) {

                        // if the course existed, then just set it visible
                        if ( studentCourse.master === courseId) {
                            studentCourse.supervised = true;
                            studentCourse.visible = true;
                            studentCourse.$update();
                            setVisible = true;
                        }
                    });
                    if (!setVisible) {
                        var res = CoursesService.copyCourseFor(studentId);
                        res.get({courseId: courseId});

                    }
                });
        };


    }
]);