'use strict';

angular.module('schoolclasses').controller('AssignCoursesController', ['$scope', '$window', '$location', '$state', '$modalInstance',
    'schoolclass', 'courses', 'Schoolclasses', 'Courses', 'Authentication', 'CoursesService',
    function ($scope, $window, $location, $state, $modalInstance, schoolclass, courses, Schoolclasses, Courses, Authentication, CoursesService) {
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

        $scope.updateSchoolclass = function () {



            var originalCourses = $scope.schoolclass.courses;
            //$scope.schoolclass.__v = undefined;
            var courses = $scope.schoolclass.courses;
            $scope.schoolclass.courses = [];


            for (var i = 0; i < courses.length; i++) {
                $scope.schoolclass.courses.push(courses[i]._id);
            }

            var students = $scope.schoolclass.students;
            $scope.schoolclass.students = [];
            for (i = 0; i < students.length; i++) {
                $scope.schoolclass.students.push(students[i]._id);
            }

            $scope.schoolclass.$update(function () {
                $scope.schoolclass.courses = originalCourses;
                $scope.schoolclass.students = students;
                $scope.initAssignCourses();
            });

        };

        $scope.assignCourseToClass = function (course) {

            console.log('ga assign course to class');
            console.log('/schoolclassess/:id/assigncourse/:id');

            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schoolclassess/:id/assigncourse/:id');
                $window.ga('send', 'event', 'teacher assigns course to class');
            }


            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course);
            }

            //$scope.schoolclass.__v = undefined;
            $scope.updateSchoolclass();


            for (var i = 0; i < $scope.schoolclass.students.length; i++) {


                $scope.assignCourseToStudent($scope.schoolclass.students[i], course);


            }

        };

        $scope.assignCourseToStudent = function(studentId, masterCourse) {
            Courses.query({
                userId: studentId
            }, function(courses) {
                var studentHasCourse = false;
                for (var i=0; i<courses.length; i++) {
                    var c = courses[i];
                    //console.log(masterCourse.slaves);
                    //console.log(c._id);
                    //console.log(masterCourse.slaves.indexOf(c._id));
                    if (masterCourse.slaves.indexOf(c._id) !== -1) {
                        c.visible = true;
                        c.$update();
                        studentHasCourse = true;
                    }
                }

                console.log(studentHasCourse);

                if (!studentHasCourse) {
                    var res = CoursesService.copyCourseFor(studentId);
                    res.get({courseId: masterCourse._id});
                }
            });
        };


        $scope.removeCourseFromClass = function (course) {

            console.log('ga removes course to class');
            console.log('/schoolclassess/:id/removecourse/:id');

            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schoolclassess/:id/removecourse/:id');
                $window.ga('send', 'event', 'teacher removes course from class');
            }


            for (var i = 0; i < $scope.schoolclass.courses.length; i++) {
                if ($scope.schoolclass.courses[i]._id === course._id) {
                    $scope.schoolclass.courses.splice(i, 1);
                }
            }

            var hideCourse = function (id) {
                Courses.get({
                    courseId: id
                }, function (slaveCourse) {
                    slaveCourse.visible = false;
                    slaveCourse.$update();
                });
            };

            $scope.updateSchoolclass();


            for (i = 0; i < course.slaves.length; i++) {
                var slaveId = course.slaves[i];
                hideCourse(slaveId);
            }
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