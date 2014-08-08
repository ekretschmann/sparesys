'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$modal', '$stateParams', '$location', 'Authentication', 'Schoolclasses', 'Schools','Courses', 'CoursesService',
    function ($scope, $modal, $stateParams, $location, Authentication, Schoolclasses, Schools, Courses, CoursesService) {

        $scope.authentication = Authentication;


        $scope.removeCourseFromClass = function (course) {
            for (var i in $scope.schoolclass.courses) {
                if ($scope.schoolclass.courses[i] === course) {
                    $scope.schoolclass.courses.splice(i, 1);
                }
            }


            $scope.schoolclass.$update();

            $scope.schoolclass.students.forEach(function (studentId) {

                Courses.query({
                    userId: studentId
                }).$promise.then(function (studentCourses) {
                        studentCourses.forEach(function (studentCourse) {
                            if (studentCourse.master.toString() === course.toString()) {
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


        $scope.addCourseToClass = function (course) {


            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course._id);
                $scope.schoolclass.$update();

                $scope.schoolclass.students.forEach(function (studentId) {


                    Courses.query({
                        userId: studentId
                    }).$promise.then(function (studentCourses) {
                            var setVisible = false;
                            studentCourses.forEach(function (studentCourse) {

                                // if the course existed, then just set it visible

                                if (studentCourse.master.toString() === course._id) {
                                    studentCourse.visible = true;
                                    studentCourse.$update();
                                    setVisible = true;
                                }
                            });
                            if (!setVisible) {
//                                create the course
                                var res = CoursesService.copyCourse(course._id);
                                var promise = res.get({courseId: course._id}).$promise;

                                promise.then(function (returnedCourse) {

                                    Courses.get({
                                        courseId: returnedCourse._id
                                    }).$promise.then(function (copiedCourse) {
                                            copiedCourse.user = studentId;
                                            copiedCourse.master = course._id;
                                            copiedCourse.$save(function () {
                                            });
                                        });

                                });
                            }
                        });


                });
            }
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

            $scope.schoolclass = Schoolclasses.get({
                schoolclassId: $stateParams.schoolclassId
            }, function() {
                $scope.school = Schools.get({
                    schoolId: $scope.schoolclass.school
                });
            });
        };

        $scope.findById = function (id) {

            $scope.schoolclass = Schoolclasses.get({
                schoolclassId: id
            });
        };

        $scope.findForCourse = function (courseId) {

            $scope.schoolclass = Schoolclasses.get({
                courseId: courseId
            });
        };

        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                $scope.schoolclasses = Schoolclasses.query({
                    userId: $scope.authentication.user._id
                }, function (schoolclasses) {
//                    console.log(schoolclasses);
//                    if (schoolclasses.length === 1) {
//                        $location.path('schools/'+schools[0]._id+'/edit');
//                    }
                });
            }
        };

        $scope.editClassPopup = function(size) {
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






        $scope.removeTeacherFromClass = function (teacher) {
            for (var i in $scope.schoolclass.teachers) {
                if ($scope.schoolclass.teachers[i] === teacher) {
                    $scope.schoolclass.teachers.splice(i, 1);
                }
            }

            $scope.schoolclass.$update(function (res) {

            }, function (err) {
//                console.log(err);
            });
        };

        $scope.removeFromClass = function (student) {
            for (var i in $scope.schoolclass.students) {
                if ($scope.schoolclass.students[i] === student) {
                    $scope.schoolclass.students.splice(i, 1);
                }
            }

            $scope.schoolclass.$update(function (res) {

            }, function (err) {
//                console.log(err);
            });
        };


        $scope.addTeacherToClass = function(teacher) {
            if ($scope.schoolclass.teachers.indexOf(teacher._id) === -1) {
                $scope.schoolclass.teachers.push(teacher._id);
            }

            $scope.schoolclass.$update(function () {
                //$location.path('schoolclasses/' + schoolclass._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.addToClass = function (student) {

            if ($scope.schoolclass.students.indexOf(student._id) === -1) {
                $scope.schoolclass.students.push(student._id);
            }

            $scope.schoolclass.$update(function () {
                //$location.path('schoolclasses/' + schoolclass._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
//            $scope.schoolclass.$update();
        };


    }
]);