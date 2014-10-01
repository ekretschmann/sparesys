'use strict';

// Schools controller
angular.module('schools').controller('SchoolsController', ['$scope', '$timeout','$stateParams', '$location', '$modal', 'Authentication', 'Schools',
    function ($scope, $timeout, $stateParams, $location, $modal, Authentication, Schools) {
        $scope.authentication = Authentication;


        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

        $scope.registerSchoolPopup = function() {
            $modal.open({
                templateUrl: 'registerSchool.html',
                controller: 'RegisterSchoolController'
            });
        };


        $scope.subscribeTeacher = function (user) {

            if ($scope.school.teachers.indexOf(user._id) === -1) {

                $scope.school.teachers.push(user._id);
                $scope.school.$update();
            }
        };


        $scope.addClassPopup = function (size) {

            $modal.open({
                templateUrl: 'addClass.html',
                controller: 'AddClassController',
                size: size,
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            });

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

        $scope.addTeacherToSchoolPopup = function (size) {
            $modal.open({
                templateUrl: 'addTeacherToSchool.html',
                controller: 'AddTeacherToSchoolController',
                size: size,
                resolve: {
                    course: function () {
                        return $scope.school;
                    }
                }
            });
        };


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
            });

        };

        $scope.unsubscribeTeacherPopup = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'unsubscribeTeacher.html',
                controller: 'UnsubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };



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
            });

        };

        $scope.unsubscribeStudentPopup = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'unsubscribeStudent.html',
                controller: 'UnsubscribeStudentModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };

        $scope.subscribeTeacherPopoup = function (school) {


            $scope.school = school;
            $modal.open({
                templateUrl: 'subscribeTeacher.html',
                controller: 'SubscribeTeacherModalController',
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };

        $scope.areYouSureToDeleteSchool = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'areYouSureToDeleteSchool.html',
                controller: 'DeleteSchoolModalController',
                resolve: {

                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };

        $scope.findForTeacher = function (teacher) {
            $scope.schools = Schools.query({
                teachers: teacher
            });
        };

        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                $scope.schools = Schools.query({
                    userId: $scope.authentication.user._id
                }, function (schools) {
//                    if (schools.length === 1) {
//                        $location.path('schools/' + schools[0]._id + '/edit');
//                    }
                });
            }
        };

//        // Create new School
//        $scope.create = function () {
//            // Create new School object
//            var school = new Schools({
//                name: this.name,
//                city: this.city,
//                country: this.country
//            });
//
//            // Redirect after save
//            school.$save(function (response) {
//                $location.path('schools/' + response._id + '/edit');
//            }, function (errorResponse) {
//                $scope.error = errorResponse.data.message;
//            });
//
//            // Clear form fields
//            this.name = '';
//        };

        // Remove existing School
        $scope.remove = function (school) {
            if (school) {
                school.$remove();

                for (var i in $scope.schools) {
                    if ($scope.schools [i] === school) {
                        $scope.schools.splice(i, 1);
                    }
                }
            } else {
                $scope.school.$remove(function () {
                    $location.path('schools');
                });
            }
        };

        // Update existing School
        $scope.update = function () {
            var school = $scope.school;

            school.$update(function () {
                $location.path('schools/' + school._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Schools
        $scope.findForUser = function () {

            $scope.school = Schools.query({
                user: Authentication.user._id
            }, function (schools) {
                $scope.school = schools[0];
            });
        };

        $scope.find = function () {
            $scope.schools = Schools.query();
        };

        // Find existing School
        $scope.findById = function (id) {
            if (id) {
                $scope.school = Schools.get({
                    schoolId: id
                });
            }
        };

        // Find existing School
        $scope.findOne = function () {
            $scope.school = Schools.get({
                schoolId: $stateParams.schoolId
            });
        };

        $scope.editSchoolPopup = function (size) {
            $modal.open({
                templateUrl: 'editSchool.html',
                controller: 'EditSchoolController',
                size: size,
                resolve: {
                    school: function () {
                        return $scope.school;
                    }
                }
            });
        };
    }
]);