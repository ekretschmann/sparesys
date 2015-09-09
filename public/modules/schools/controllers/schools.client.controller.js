'use strict';

// Schools controller
angular.module('schools').controller('SchoolsController', ['$window', '$scope', '$timeout', '$state', '$stateParams', '$location', '$modal',
    'Authentication', 'Schools', 'Schoolclasses', 'Users',
    function ($window, $scope, $timeout, $state, $stateParams, $location, $modal, Authentication, Schools, Schoolclasses, Users) {
        $scope.authentication = Authentication;


        $scope.scrollDown = function () {
            $window.scrollTo(0, document.body.scrollHeight);
            angular.element('.focus').trigger('focus');
        };

//        $timeout(function () {
//            angular.element('.focus').trigger('focus');
//        }, 100);
//
        $scope.registerSchoolPopup = function () {
            $modal.open({
                templateUrl: 'registerSchool.html',
                controller: 'RegisterSchoolController'
            });
        };
//
//
//        $scope.subscribeTeacher = function (user) {
//
//            if ($scope.school.teachers.indexOf(user._id) === -1) {
//
//                $scope.school.teachers.push(user._id);
//                $scope.school.$update();
//            }
//        };
//
//

        $scope.newClass = {};
        $scope.newClass.name = '';
        $scope.addSchoolclassToSchool = function () {

            console.log($scope.school);

            var schoolClass = new Schoolclasses({
                name: $scope.newClass.name,
                school: $scope.school._id

            });

            schoolClass.$save(function (sc) {

                console.log('ga create schoolclass');
                console.log('/schools/:id/addclass/:id');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/schools/:id/addclass/:id');
                    $window.ga('send', 'event', 'user creates schoolclass');
                }

                $scope.school.schoolclasses.push(schoolClass);
                $scope.school.$save(function () {

                });


            });


            this.newClass.name = '';
            angular.element('.focus').trigger('focus');

        };
//
//        $scope.setupClassPopup = function (schoolclass, school) {
//
//            $scope.schoolclass = schoolclass;
//            $scope.school = school;
//            $modal.open({
//                templateUrl: 'setupClass.html',
//                controller: 'SetupClassController',
//                resolve: {
//                    schoolclass: function () {
//                        return $scope.schoolclass;
//                    },
//                    school: function () {
//                        return $scope.school;
//                    }
//                }
//            });
//
//        };
//
//        $scope.assignCoursesPopup = function (schoolclass) {
//
//
//            $scope.schoolclass = schoolclass;
//            //$scope.school = school;
//            $modal.open({
//                templateUrl: 'assignCourses.html',
//                controller: 'AssignCoursesController',
//                resolve: {
//                    schoolclass: function () {
//                        return $scope.schoolclass;
//                    },
//                    courses: function () {
//                        return $scope.courses;
//                    }
//                }
//            });
//
//        };
//
//
//        $scope.areYouSureToDeleteClass = function (schoolclass) {
//
//            $scope.schoolclass = schoolclass;
//            $modal.open({
//                templateUrl: 'areYouSureToDeleteClass.html',
//                controller: 'DeleteClassModalController',
//                resolve: {
//
//                    schoolclass: function () {
//                        return $scope.schoolclass;
//                    },
//                    school: function () {
//                        return $scope.school;
//                    }
//
//                }
//            });
//
//        };
//
//        $scope.addTeacherToSchoolPopup = function (size) {
//            $modal.open({
//                templateUrl: 'addTeacherToSchool.html',
//                controller: 'AddTeacherToSchoolController',
//                size: size,
//                resolve: {
//                    course: function () {
//                        return $scope.school;
//                    }
//                }
//            });
//        };
//
//
        $scope.subscribeTeacherPopup = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'subscribeTeacher.html',
                controller: 'SubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            }).result.then(function () {

                    Users.get({
                        userId: $scope.authentication.user._id
                    }, function (user) {
                        $scope.authentication.user = user;

                    });

                });

        };

        $scope.unsubscribeTeacherPopup = function (school) {

            $modal.open({
                templateUrl: 'unsubscribeTeacher.html',
                controller: 'UnsubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            }).result.then(function () {


                    Users.get({
                        userId: $scope.authentication.user._id
                    }, function (user) {
                        $scope.authentication.user = user;

                    });
                });

        };
//
//
        $scope.subscribeStudentPopup = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'subscribeStudent.html',
                controller: 'SubscribeStudentModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            }).result.then(function () {
                    // do something
                });

        };
//
//        $scope.unsubscribeStudentPopup = function (school) {
//
//            //$scope.school = school;
//            $modal.open({
//                templateUrl: 'unsubscribeStudent.html',
//                controller: 'UnsubscribeStudentModalController',
//                resolve: {
//                    school: function () {
//                        return $scope.school;
//                    }
//                }
//            });
//
//        };
//
//        $scope.subscribeTeacherPopoup = function (school) {
//
//
//            $scope.school = school;
//            $modal.open({
//                templateUrl: 'subscribeTeacher.html',
//                controller: 'SubscribeTeacherModalController',    qwe

//                resolve: {
//                    school: function () {
//                        return $scope.school;
//                    }
//                }
//            });
//
//        };
//
        $scope.areYouSureToDeleteSchool = function (school) {

            //console.log($scope.authentication.user.administersSchools);
            var index = $scope.authentication.user.administersSchools.indexOf(school._id);

            $modal.open({
                templateUrl: 'areYouSureToDeleteSchool.html',
                controller: 'DeleteSchoolModalController',
                resolve: {

                    school: function () {
                        return school;
                    }
                }
            }).result.then(function () {
                    if (index > -1) {
                        $scope.authentication.user.administersSchools.splice(index, 1);
                    }
                    if ($scope.schools) {
                        $scope.schools = Schools.query();
                    }
                });

        };

        $scope.areYouSureToRemoveSchoolFromStudent = function (school, user) {

            //console.log(school);
            //console.log(user);

            $modal.open({
                templateUrl: 'areYouSureToRemoveSchoolFromStudent.html',
                controller: 'RemoveSchoolFromStudentModalController',
                resolve: {

                    school: function () {
                        return school;
                    },
                    user: function () {
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

        $scope.areYouSureToRemoveSchoolFromTeacher = function (school, user) {

            $modal.open({
                templateUrl: 'areYouSureToRemoveSchoolFromTeacher.html',
                controller: 'RemoveSchoolFromTeacherModalController',
                resolve: {

                    school: function () {
                        return school;
                    },
                    user: function () {
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

        $scope.areYouSureToRemoveStudent = function (student) {
            $modal.open({
                templateUrl: 'areYouSureToRemoveStudent.html',
                controller: 'RemoveStudentFromSchoolModalController',
                resolve: {

                    student: function () {
                        return student;
                    },
                    school: function () {
                        return $scope.school;
                    }
                }
            }).result.then(function () {

                    console.log('finished');
                });
        };

        $scope.areYouSureToRemoveTeacher = function (teacher) {
            $modal.open({
                templateUrl: 'areYouSureToRemoveTeacher.html',
                controller: 'RemoveTeacherFromSchoolModalController',
                resolve: {

                    teacher: function () {
                        return teacher;
                    },
                    school: function () {
                        return $scope.school;
                    }
                }
            }).result.then(function () {

                    Schools.get({
                        schoolId: $scope.school._id
                    }, function (updatedSchool) {
                        $scope.school = updatedSchool;

                    });
                });
        };

//
//        $scope.findForTeacher = function (teacher) {
//            $scope.schools = Schools.query({
//                teachers: teacher
//            });
//        };
//
//
//        $scope.findForStudent = function (student) {
//            $scope.schools = Schools.query({
//                student: $scope.authentication.user._id
//            });
//        };
//
//        // Find list for current user
//        $scope.findForCurrentUser = function () {
//            if ($scope.authentication.user) {
//                $scope.schools = Schools.query({
//                    userId: $scope.authentication.user._id
//                }, function (schools) {
////                    if (schools.length === 1) {
////                        $location.path('schools/' + schools[0]._id + '/edit');
////                    }
//                });
//            }
//        };
//
////        // Create new School
////        $scope.create = function () {
////            // Create new School object
////            var school = new Schools({
////                name: this.name,
////                city: this.city,
////                country: this.country
////            });
////
////            // Redirect after save
////            school.$save(function (response) {
////                $location.path('schools/' + response._id + '/edit');
////            }, function (errorResponse) {
////                $scope.error = errorResponse.data.message;
////            });
////
////            // Clear form fields
////            this.name = '';
////        };
//
//        // Remove existing School
//        $scope.remove = function (school) {
//            if (school) {
//                school.$remove();
//
//                for (var i in $scope.schools) {
//                    if ($scope.schools [i] === school) {
//                        $scope.schools.splice(i, 1);
//                    }
//                }
//            } else {
//                $scope.school.$remove(function () {
//                    $location.path('schools/admin');
//                });
//            }
//        };
//
//        $scope.removeStudentFromSchool = function(schoolId, user) {
//            var index = user.studentInSchools.indexOf(schoolId);
//            user.studentInSchools.splice(index, 1);
//            user.$update(function() {
//                $state.go($state.$current, null, {reload: true});
//            });
//        };
//
//        $scope.removeStudent = function (studentId) {
//
//            var index;
//            for (var i=0; i<$scope.school.students.length; i++) {
//                if ($scope.school.students[i]._id === studentId) {
//                    index = i;
//                }
//            }
//            $scope.school.students.splice(index, 1);
//
//
//            $scope.school.$update(function(x) {
//                console.log(x);
//            }, function (y) {
//                console.log(y);
//            });
//        };
//
//        // Update existing School
        $scope.update = function () {
            var school = $scope.school;

            school.$update();
        };
//
//        // Find a list of Schools
//        $scope.findForUser = function () {
//
//            $scope.school = Schools.query({
//                user: Authentication.user._id
//            }, function (schools) {
//                $scope.school = schools[0];
//            });
//        };
//
        $scope.find = function () {
            $scope.schools = Schools.query();
        };
//
//        // Find existing School
        $scope.findById = function (id) {
            if (id) {
                $scope.school = Schools.get({
                    schoolId: id
                }, function (s) {
                    $scope.schoolclasses = s.schoolclasses;
                }, function (err) {
                    $scope.error = 'school ' + id + ' does not exist';
                });
            }
        };
//
        $scope.schoolclasses = [];

        $scope.populateSchoolForUser = function (schoolId, user) {

            Schools.get({
                schoolId: schoolId
            }, function (s) {
                console.log(s);
                $scope.school = s;
                $scope.schoolclasses = s.schoolclasses;
                $scope.schoolclasses = [];
                for (var i = 0; i < $scope.school.schoolclasses.length; i++) {
                    var schoolclass = $scope.school.schoolclasses[i];
                    if (user.studentInClasses.indexOf(schoolclass._id) !== -1) {
                        $scope.schoolclasses.push(schoolclass);
                    }
                }
            });
        };


//
        // Find existing School
        $scope.findOne = function () {
            $scope.stateParamId = $stateParams.schoolId;
            $scope.school = Schools.get({
                schoolId: $stateParams.schoolId
            });
        };

//        $scope.editSchoolPopup = function (size) {
//            $modal.open({
//                templateUrl: 'editSchool.html',
//                controller: 'EditSchoolController',
//                size: size,
//                resolve: {
//                    school: function () {
//                        return $scope.school;
//                    }
//                }
//            });
//        };
//
//        $scope.options = {};
//
        $scope.updateSearch = function () {

            console.log($scope.options);

            Schools.query({
                text: $scope.options.searchText
            }, function (schools) {
                $scope.schools = schools;

            });
        };


    }
]);
