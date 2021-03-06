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

        $scope.registerSchoolPopup = function () {
            $modal.open({
                templateUrl: 'registerSchool.html',
                controller: 'RegisterSchoolController'
            });
        };

        $scope.options = {};
        $scope.options.searchText = '';

        $scope.updateSearch = function () {

            if (!$scope.options.searchText) {
                $scope.options.searchText = '';
            }

            Schools.query({
                text: $scope.options.searchText
            }, function (schools) {
                $scope.schools = schools;

            });
        };




        $scope.newClass = {};
        $scope.newClass.name = '';
        $scope.addSchoolclassToSchool = function () {


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
                    $timeout(function () {
                        $window.scrollTo(0, document.body.scrollHeight);
                    });
                });


            });


            this.newClass.name = '';
            angular.element('.focus').trigger('focus');

        };

        $scope.subscribeTeacherPopup = function (school, user) {
            $modal.open({
                templateUrl: 'subscribeTeacher.html',
                controller: 'SubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return school;
                    },
                    user: function () {

                        return user;
                    }
                }
            });

        };

        $scope.unsubscribeTeacherPopup = function (school, user) {

            $modal.open({
                templateUrl: 'unsubscribeTeacher.html',
                controller: 'UnsubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return school;
                    },
                    user: function () {
                        return user;
                    }
                }
            });

        };

        $scope.subscribeStudentPopup = function (school, user) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'subscribeStudent.html',
                controller: 'SubscribeStudentModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    },
                    user: function () {

                        return user;
                    }
                }
            });

        };

        $scope.unsubscribeStudentPopup = function (school, user) {

            $modal.open({
                templateUrl: 'unsubscribeStudent.html',
                controller: 'UnsubscribeStudentModalController',
                resolve: {
                    school: function () {
                        return school;
                    },
                    user: function () {
                        return user;
                    }
                }
            });

        };

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


        $scope.removeDeadTeacherId = function (id) {
            $scope.school.teachers.splice($scope.school.teachers.indexOf(id), 1);
            $scope.school.$update();
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

        $scope.hasClassAssigned = function (userId) {


            var found = false;
            for (var i = 0; i < $scope.schoolclasses.length; i++) {
                for (var j = 0; j < $scope.schoolclasses[i].teachers.length; j++) {
                    if ($scope.schoolclasses[i].teachers[j] === $scope.authentication.user._id) {
                        found = true;
                    }

                }

            }
            return found;
        };


        // Update existing School
        $scope.update = function () {
            var school = $scope.school;

            school.$update();
        };


        $scope.find = function () {
            $scope.schools = Schools.query();
        };

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

        $scope.schoolclasses = [];

        $scope.populateSchoolForUser = function (schoolId, user) {

            Schools.get({
                schoolId: schoolId
            }, function (s) {
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

        // Find existing School
        $scope.findOne = function () {
            $scope.stateParamId = $stateParams.schoolId;
            $scope.school = Schools.get({
                schoolId: $stateParams.schoolId
            });
        };




    }
]);
