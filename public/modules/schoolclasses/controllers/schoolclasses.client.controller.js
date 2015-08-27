'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$window', '$state', '$modal', '$stateParams', '$location', 'Authentication', 'Schoolclasses', 'Schools', 'Courses', 'CoursesService', 'Users',
    function ($scope, $window, $state, $modal, $stateParams, $location, Authentication, Schoolclasses, Schools, Courses, CoursesService, Users) {

        $scope.authentication = Authentication;


        $scope.addCourseToClass = function (course) {

            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course._id);
                $scope.schoolclass.$update();

                $scope.schoolclass.students.forEach(function (studentId) {

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

        $scope.removeSchoolclass = function (schoolclass) {
            schoolclass.$remove(function () {
                $state.go($state.$current, null, {reload: true});
            });

        };

        $scope.areYouSureToDeleteClass = function (schoolclass, school) {


            $scope.schoolclass = schoolclass;
            $scope.school = school;
            $modal.open({
                templateUrl: 'areYouSureToDeleteClass.html',
                controller: 'DeleteClassModalController',
                resolve: {

                    schoolclass: function () {
                        return $scope.schoolclass;
                    },
                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };

        $scope.removeStudent = function (studentId) {

            var index = $scope.schoolclass.students.indexOf(studentId);
            $scope.schoolclass.students.splice(index, 1);
            $scope.schoolclass.$update();
        };

        $scope.removeCourse = function (courseId) {

            var index = $scope.schoolclass.courses.indexOf(courseId);
            $scope.schoolclass.courses.splice(index, 1);
            $scope.schoolclass.$update();
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
                //
                //console.log('begi');
                //console.log($scope.schoolclass);
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


        $scope.removeAsTeacher = function (schoolclass, user) {
            var index = user.teachesClasses.indexOf(schoolclass._id);
            user.teachesClasses.splice(index, 1);
            user.$update();
        };


        $scope.removeAsStudent = function (schoolclass, user) {
            var index = user.studentInClasses.indexOf(schoolclass._id);
            user.studentInClasses.splice(index, 1);
            user.$update();
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
            console.log(studentId);
            for (var i in $scope.schoolclass.students) {
                console.log($scope.schoolclass.students[i]);
                if ($scope.schoolclass.students[i]._id === studentId) {
                    $scope.schoolclass.students.splice(i, 1);
                }
            }

            Courses.query({
                userId: studentId
            }, function (courses) {
                courses.forEach(function (course) {
                    if ($scope.schoolclass.courses.indexOf(course.master) > -1) {
                        course.visble = true;
                        course.supervised = false;
                        course.$update();
                    }
                }, this);

            });

            $scope.schoolclass.$update(function (x) {

                console.log(x);
                console.log('ga remove student from class');
                console.log('/schoolclassess/remove/student/:id');

                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/schoolclassess/remove/student/:id');
                    $window.ga('send', 'event', 'school admin removes student from class');
                }
            });
        };

        $scope.addStudentToClass = function (student) {


            var found = false;
            for (var i = 0; i < $scope.schoolclass.students.length; i++) {
                if ($scope.schoolclass.students[i]._id === student._id) {
                    found = true;
                }
            }

            if (!found) {
                $scope.schoolclass.students.push(student);


                //$scope.schoolclass.__v = undefined;
                $scope.schoolclass.$update(function () {

                    $scope.schoolclass.courses.forEach(function (courseId) {
                        $scope.addCourseForStudent(student._id, courseId);
                    });


                    //console.log('ga add student to class');
                    //console.log('/schoolclassess/add/student/:id');
                    //if ($window.ga) {
                    //    console.log('sending to ga');
                    //    $window.ga('send', 'pageview', '/schoolclassess/add/student/:id');
                    //    $window.ga('send', 'event', 'school admin adds student to class');
                    //}
                    //$scope.initSchoolclassSetup();


                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.addTeacherToClass = function (teacher) {

            console.log(teacher);



            var found = false;
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                if ($scope.schoolclass.teachers[i]._id === teacher._id) {
                    found = true;
                }
            }


            if (!found) {
                $scope.schoolclass.teachers.push(teacher);

                //console.log($scope.schoolclass.teachers);

                //console.log('end');
                //console.log($scope.schoolclass);


                $scope.schoolclass.$update(function () {


                    //console.log('ga add teacher to class');
                    //console.log('/schoolclassess/add/teacher/:id');
                    //if ($window.ga) {
                    //    console.log('sending to ga');
                    //    $window.ga('send', 'pageview', '/schoolclassess/add/teacher/:id');
                    //    $window.ga('send', 'event', 'school admin adds teacher to class');
                    //}
                    //$scope.initSchoolclassSetup();
                }, function(err) {
                    console.log(err);
                });
            }
        };


        //$scope.removeTeacherFromClass = function (teacherId) {
        //    for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
        //        if ($scope.schoolclass.teachers[i] === teacherId) {
        //            $scope.schoolclass.teachers.splice(i, 1);
        //        }
        //    }
        //    //$scope.schoolclass.__v = undefined;
        //    $scope.schoolclass.$update(function(){
        //        console.log('ga remove teacher from class');
        //        console.log('/schoolclassess/remove/teacher/:id');
        //        if ($window.ga) {
        //            console.log('sending to ga');
        //            $window.ga('send', 'pageview', '/schoolclassess/remove/teacher/:id');
        //            $window.ga('send', 'event', 'school admin removes teacher from class');
        //        }
        //        $scope.initSchoolclassSetup();
        //    });
        //};

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
