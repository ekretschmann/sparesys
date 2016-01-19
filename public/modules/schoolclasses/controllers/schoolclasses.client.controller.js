'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$window', '$http', '$state', '$modal',
    '$stateParams', '$location', 'Authentication', 'Schoolclasses', 'Schools', 'Courses', 'CoursesService', 'Users',
    'DiagramsCalendarService', 'DiagramsTimeSpentService', 'DiagramsCardsInPlayService',
    function ($scope, $window, $http, $state, $modal, $stateParams, $location, Authentication, Schoolclasses, Schools, Courses, CoursesService, Users,
              DiagramsCalendarService, DiagramsTimeSpentService, DiagramsCardsInPlayService) {

        $scope.authentication = Authentication;

        $scope.diagrams = ['Calendar', 'Progress', 'Time spent'];
        $scope.selectedDiagram = 'Calendar';
        $scope.selectedStudent = 'All';
        $scope.selectedCourseName = 'All';
        $scope.selectedStudentName = 'All';
        $scope.studentsToCourses = {};


        $scope.selectDiagram = function (diagram) {
            $scope.selectedDiagram = diagram;
            if ($scope.selectedStudent === 'All' && $scope.selectedCourseName !== 'All') {
                $scope.selectCourse($scope.selectedCourse);
            } else {
                $scope.selectStudent($scope.selectedStudent);
            }

        };




        $scope.studentCourses = [];
        $scope.selectedStudentCourses = [];

        $scope.addStudentCourse = function (courseId, index) {

            Courses.get({
                courseId: courseId
            }, function (slaveCourse) {

                if ($scope.studentCourses.indexOf(slaveCourse._id) > -1) {
                    $scope.selectedStudentCourses.push(slaveCourse);
                }

                var res = CoursesService.serverLoadCards();
                var promise = res.get({courseId: slaveCourse._id});
                promise.$promise.then(function (cards) {

                    $scope.cards = cards;
                    var w = $window.innerWidth + 110;
                    if ($window.innerWidth > 990){
                        w = ($window.innerWidth / 2) + 60;
                    }

                    if ($scope.selectedDiagram === 'Calendar') {
                        DiagramsCalendarService.drawCalendar(cards, '#cal' + index, '#practice-date' + index, '#number-of-cards' + index, ($window.innerWidth / 2) - 130);
                    } else if ($scope.selectedDiagram === 'Time spent') {
                        DiagramsTimeSpentService.drawBarChart(cards, '#timespent'+index, '#spent-practice-date'+index, '#spent-practice-time'+index,'#spent-all-time'+index, ($window.innerWidth / 2)-130);
                    } else if ($scope.selectedDiagram === 'Progress') {
                        DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index, '#total-cards-learned'+index, w);
                    }

                    //
                });

            });
        };

        $scope.selectCourse = function (course) {

            $scope.selectedStudentCourses = [];
            $scope.selectedStudent = 'All';
            $scope.selectedCourse = course;
            $scope.selectedCourseName = course.name;


            for (var i = 0; i < course.slaves.length; i++) {

                $scope.addStudentCourse(course.slaves[i], i);
            }
        };

        $scope.selectStudent = function (student) {

            $scope.selectedStudentCourses = [];
            $scope.selectedStudent = student;
            $scope.selectedCourse = 'All';
            $scope.selectedStudentName = student.displayName;

            for (var i = 0; i < $scope.studentsToCourses[student._id].length; i++) {
                $scope.addStudentCourse($scope.studentsToCourses[student._id][i], i);
            }

        };

        $scope.addCourseToClass = function (course) {

            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course._id);
                $scope.schoolclass.$update();

            }
        };

        $scope.removeCourseFromClass = function (course) {


            for (var i in $scope.schoolclass.courses) {
                if ($scope.schoolclass.courses[i] === course._id) {
                    $scope.schoolclass.courses.splice(i, 1);
                }
            }


            $scope.schoolclass.$update();

        };

        $scope.removeSchoolclass = function (schoolclass) {
            schoolclass.$remove(function () {
                $state.go($state.$current, null, {reload: true});
            });

        };

        $scope.areYouSureToDeleteClass = function (schoolclass, school) {


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
            $scope.schoolclass.$update();
        };

        // Find a list of Schoolclasses
        $scope.find = function () {
            $scope.schoolclasses = Schoolclasses.query();
        };

        $scope.courses = [];
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


                schoolclass.students.forEach(function (student) {


                    Courses.query({
                        userId: student._id
                    }, function(courses) {



                        for(var i=0; i<courses.length; i++) {
                            if (schoolclass.courses.indexOf(courses[i].master) > -1) {
                                $scope.studentCourses.push(courses[i]._id);
                                if ( $scope.studentsToCourses[student._id]) {
                                    $scope.studentsToCourses[student._id].push([courses[i]._id]);
                                } else {
                                    $scope.studentsToCourses[student._id] = [courses[i]._id];
                                }

                            }
                        }

                    });

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
                            } else {
                                $scope.courses.push(courses[0]);
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

            if (studentId._id) {
                studentId = studentId._id;
            }

            for (var i in $scope.schoolclass.students) {
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



            //$http.post('/schoolclasses/'+$scope.schoolclass._id+'/addStudent/'+student._id).
            //    then(function(response) {
            //       console.log(response);
            //    }, function(response) {
            //        console.log(response);
            //    });


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

                    //$scope.schoolclass.courses.forEach(function (courseId) {
                    //    $scope.addCourseForStudent(student._id, courseId);
                    //});


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


            var found = false;
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                if ($scope.schoolclass.teachers[i]._id === teacher._id) {
                    found = true;
                }
            }


            if (!found) {
                $scope.schoolclass.teachers.push(teacher);


                $scope.schoolclass.$update(function () {

                }, function (err) {
                    console.log(err);
                });
            }
        };


        $scope.removeTeacherFromClass = function (teacherId) {
            for (var i = 0; i < $scope.schoolclass.teachers.length; i++) {
                //console.log($scope.schoolclass.teachers[i]);
                if ($scope.schoolclass.teachers[i]._id === teacherId) {
                    $scope.schoolclass.teachers.splice(i, 1);
                }
            }

            $scope.schoolclass.$update();
        };


        $scope.addCourseForStudent = function (studentId, courseId) {
            Courses.query({
                userId: studentId
            }).$promise.then(function (studentCourses) {

                    var setVisible = false;
                    studentCourses.forEach(function (studentCourse) {

                        // if the course existed, then just set it visible
                        if (studentCourse.master === courseId) {
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

        $scope.areYouSureToRemoveSchoolclassFromTeacher = function (schoolclass, user) {


            $modal.open({
                templateUrl: 'areYouSureToRemoveSchoolclassFromTeacher.html',
                controller: 'RemoveSchoolclassFromTeacherModalController',
                resolve: {

                    schoolclass: function () {
                        return schoolclass;
                    },
                    teacher: function () {
                        return user;
                    }
                }
            }).result.then(function () {

                    Users.get({
                        userId: user._id
                    }, function (user) {
                        $scope.otherUser = user;

                    });
                });

        };

    }
])
;
