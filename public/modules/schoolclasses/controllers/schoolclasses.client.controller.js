'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$state', '$modal', '$stateParams', '$location', 'Authentication', 'Schoolclasses', 'Schools', 'Courses', 'CoursesService','Users',
    function ($scope, $state, $modal, $stateParams, $location, Authentication, Schoolclasses, Schools, Courses, CoursesService, Users) {

        $scope.authentication = Authentication;

        $scope.addCourseForStudent = function (studentId, courseId) {
            Courses.query({
                userId: studentId
            }).$promise.then(function (studentCourses) {
                    console.log('student courses are:');
                    studentCourses.forEach(function (studentCourse) {
                        console.log(studentCourse.name);
                    });

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
                        console.log('copying course for student');
                        var res = CoursesService.copyCourseFor(studentId);
                        res.get({courseId: courseId});

                    }
                });
        };

        $scope.addCourseToClass = function (course) {

            console.log('adding '+course._id);
            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course._id);
                $scope.schoolclass.$update();

                $scope.schoolclass.students.forEach(function (studentId) {

                    console.log('adding '+course._id);
                    $scope.addCourseForStudent(studentId, course._id);

                });
            }
        };

        $scope.removeCourseFromClass = function (course) {


            for (var i in $scope.schoolclass.courses) {
                if ($scope.schoolclass.courses[i] === course._id) {
                    $scope.schoolclass.courses.splice(i, 1);
                }
            }


            $scope.schoolclass.$update();

            $scope.schoolclass.students.forEach(function (studentId) {

                Courses.query({
                    userId: studentId
                }).$promise.then(function (studentCourses) {
                        studentCourses.forEach(function (studentCourse) {
                            if (studentCourse.supervised && studentCourse.master.toString() === course._id) {
                                studentCourse.visible = false;
                                studentCourse.$update();
                            }
                        });
                    });
            }, this);

        };

        $scope.areYouSureToDeleteClass = function (schoolclass) {

            $scope.schoolclass = schoolclass;
            $modal.open({
                templateUrl: 'areYouSureToDeleteClass.html',
                controller: 'DeleteClassModalController',
                resolve: {

                    schoolclass: function () {
                        return $scope.schoolclass;
                    }
                }
            });

        };


        // Create new Schoolclass
        $scope.create = function () {
            // Create new Schoolclass object
            var schoolclass = new Schoolclasses({
                name: this.name
            });

            // Redirect after save
            schoolclass.$save(function (response) {
                $location.path('schoolclasses/' + response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.name = '';
        };

        // Remove existing Schoolclass
        $scope.remove = function (schoolclass) {
            if (schoolclass) {
                schoolclass.$remove();

                for (var i in $scope.schoolclasses) {
                    if ($scope.schoolclasses [i] === schoolclass) {
                        $scope.schoolclasses.splice(i, 1);
                    }
                }
            } else {
                $scope.schoolclass.$remove(function () {
                    $location.path('schoolclasses');
                });
            }
        };

        // Update existing Schoolclass
        $scope.update = function () {
            var schoolclass = $scope.schoolclass;

            schoolclass.$update(function () {
                $location.path('schoolclasses/' + schoolclass._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Schoolclasses
        $scope.find = function () {
            $scope.schoolclasses = Schoolclasses.query();
        };

        // Find existing Schoolclass
        $scope.findOne = function () {

            Schoolclasses.get({
                schoolclassId: $stateParams.schoolclassId
            }, function (schoolclass) {
                $scope.schoolclass = schoolclass;
                Schools.get({
                    schoolId: $scope.schoolclass.school
                }, function (school) {
                    $scope.school = school;
                });


                // remove missing courses
                // this shouldn't happen, but while I am developing
                // I like it to be self-fixing.
                schoolclass.courses.forEach(function (courseId) {
                    Courses.query({
                        _id: courseId
                    }).$promise.then(function (courses) {
                            if (courses.length === 0) {
                                console.log('Course doesnt exist. Removing from schoolclass');
                                for (var i in schoolclass.courses) {
                                    if (schoolclass.courses[i] === courseId) {
                                        schoolclass.courses.splice(i, 1);
                                    }
                                }
                                schoolclass.$update();
                            }

                        });
                });


            });
        };

        $scope.findById = function (id) {

            $scope.schoolclass = Schoolclasses.get({
                schoolclassId: id
            });
        };

        $scope.findForUser = function () {

            Schoolclasses.query({
                teachers: Authentication.user._id

            }, function (schoolclasses) {
                $scope.schoolclasses = schoolclasses;
            });
        };

        $scope.findForCourse = function (courseId) {

            $scope.schoolclass = Schoolclasses.get({
                courseId: courseId
            });
        };

        // Find list for current user
        $scope.findForTeacher = function (teacherId) {
            $scope.schoolclasses = Schoolclasses.query({
                teacher: teacherId
            }, function (schoolclasses) {
//                    console.log(schoolclasses);
//                    if (schoolclasses.length === 1) {
//                        $location.path('schools/'+schools[0]._id+'/edit');
//                    }
            });
        };

        $scope.editClassPopup = function (size) {
            $modal.open({
                templateUrl: 'editClass.html',
                controller: 'EditClassController',
                size: size,
                resolve: {
                    schoolclass: function () {
                        return $scope.schoolclass;
                    }
                }
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

            $scope.schoolclass.$update();
        };

        $scope.addStudentToClass = function (studentId) {

            if ($scope.schoolclass.students.indexOf(studentId) === -1) {
                $scope.schoolclass.students.push(studentId);
            }

            $scope.schoolclass.$update(function () {

                $scope.schoolclass.courses.forEach(function(courseId) {
                    $scope.addCourseForStudent(studentId, courseId);
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.addTeacherToClass = function (teacherId) {
            if ($scope.schoolclass.teachers.indexOf(teacherId) === -1) {
                $scope.schoolclass.teachers.push(teacherId);
            }
            $scope.schoolclass.$update(function () {
                Users.get({
                    userId: teacherId
                }, function(teacher) {
                    if (teacher.schoolclasses.indexOf($scope.schoolclass._id) === -1) {
                        teacher.schoolclasses.push($scope.schoolclass._id);
                    }
                    teacher.$update();
                });
            });
        };


        $scope.removeTeacherFromClass = function (teacherId) {
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                if ($scope.schoolclass.teachers[i] === teacherId) {
                    $scope.schoolclass.teachers.splice(i, 1);
                }
            }
            $scope.schoolclass.$update(function () {
                // update teacher
                Users.get({
                    userId: teacherId
                }, function(teacher) {
                    for (var i =0; i < teacher.schoolclasses.length; i++) {
                        if (teacher.schoolclasses[i] === $scope.schoolclass._id) {
                            teacher.schoolclasses.splice(i, 1);
                        }
                    }
                    teacher.$update();
                });
            });
        };


    }
]);