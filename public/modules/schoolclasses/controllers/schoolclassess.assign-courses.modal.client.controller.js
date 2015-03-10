'use strict';

angular.module('schoolclasses').controller('AssignCoursesController', ['$scope', '$location', '$state', '$modalInstance',
    'schoolclass', 'courses', 'Schoolclasses', 'Courses', 'Authentication', 'CoursesService',
    function ($scope, $location, $state, $modalInstance, schoolclass, courses, Schoolclasses, Courses, Authentication, CoursesService) {
        $scope.schoolclass = schoolclass;
        $scope.courses = courses;

        $scope.authentication = Authentication;


        $scope.availableCourses = [];
        //$scope.availableStudents = [];

        $scope.initAssignCourses = function () {
            $scope.availableCourses = [];
            //$scope.coursesTeacher = [];


            $scope.courses.forEach(function (course) {
                if (course.teaching) {

                    var coreseAssignedYet = false;
                    for (var i = 0; i < $scope.schoolclass.courses.length; i++) {

                        if ($scope.schoolclass.courses[i]._id === course._id) {
                            coreseAssignedYet = true;
                        }

                    }
                    if (!coreseAssignedYet) {
                        $scope.availableCourses.push(course);
                    }

                }
            }, this);


        };

        $scope.initAssignCourses();

        $scope.ok = function () {

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function updateSchoolclass() {


        }

        $scope.assignCourseToClass = function (course) {


            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course);
            }

            $scope.schoolclass.__v = undefined;
            $scope.schoolclass.$update();
        };

        $scope.removeCourseFromClass = function (course) {
            for (var i = 0; i < $scope.schoolclass.courses.length; i++) {
                if ($scope.schoolclass.courses[i]._id === course._id) {
                    $scope.schoolclass.courses.splice(i, i);
                }
            }

            $scope.schoolclass.__v = undefined;
            $scope.schoolclass.$update();
        };

        //
        //$scope.removeTeacherFromClass = function (teacherId) {
        //    for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
        //        if ($scope.schoolclass.teachers[i] === teacherId) {
        //            $scope.schoolclass.teachers.splice(i, 1);
        //        }
        //    }
        //    $scope.schoolclass.__v = undefined;
        //    new Schoolclasses($scope.schoolclass).$update(function(){
        //        $scope.initSchoolclassSetup();
        //    });
        //};
        //
        //$scope.removeStudentFromClass = function (studentId) {
        //    for (var i in $scope.schoolclass.students) {
        //        if ($scope.schoolclass.students[i] === studentId) {
        //            $scope.schoolclass.students.splice(i, 1);
        //        }
        //    }
        //
        //    Courses.query({
        //        userId: studentId
        //    }, function(courses) {
        //        courses.forEach(function(course) {
        //            if ($scope.schoolclass.courses.indexOf(course.master) > -1) {
        //                course.visble = true;
        //                course.supervised = false;
        //                course.$update();
        //            }
        //        }, this);
        //
        //    });
        //
        //    $scope.schoolclass.__v = undefined;
        //    new Schoolclasses($scope.schoolclass).$update(function(){
        //        $scope.initSchoolclassSetup();
        //    });
        //};
        //
        //$scope.addStudentToClass = function (studentId) {
        //
        //    if ($scope.schoolclass.students.indexOf(studentId) === -1) {
        //        $scope.schoolclass.students.push(studentId);
        //    }
        //
        //    $scope.schoolclass.__v = undefined;
        //    new Schoolclasses($scope.schoolclass).$update(function () {
        //
        //        $scope.schoolclass.courses.forEach(function(courseId) {
        //            $scope.addCourseForStudent(studentId, courseId);
        //        });
        //
        //        $scope.initSchoolclassSetup();
        //
        //
        //    }, function (errorResponse) {
        //        $scope.error = errorResponse.data.message;
        //    });
        //};
        //
        //
        //$scope.addCourseForStudent = function (studentId, courseId) {
        //    Courses.query({
        //        userId: studentId
        //    }).$promise.then(function (studentCourses) {
        //
        //            var setVisible = false;
        //            studentCourses.forEach(function (studentCourse) {
        //
        //                // if the course existed, then just set it visible
        //                if ( studentCourse.master === courseId) {
        //                    studentCourse.supervised = true;
        //                    studentCourse.visible = true;
        //                    studentCourse.$update();
        //                    setVisible = true;
        //                }
        //            });
        //            if (!setVisible) {
        //                var res = CoursesService.copyCourseFor(studentId);
        //                res.get({courseId: courseId});
        //
        //            }
        //        });
        //};


    }
]);