'use strict';


// Courses controller
angular.module('courses').controller('CoursesAdminController',
    ['$scope', '$http', '$stateParams', '$location', '$timeout', '$window', 'Packs', 'Authentication', 'Courses',
        function ($scope, $http, $stateParams, $location, $timeout, $window, Packs, Authentication, Courses) {

            $scope.authentication = Authentication;


            $scope.packToAdd = '';

            if (!$scope.authentication.user) {
                $location.path('/');
            }

            $scope.removeSlave = function(slave, course) {
                var index = course.slaves.indexOf(slave);
                course.slaves.splice(index, 1);
                course.$update();
            };


            $scope.addPack = function() {
                $scope.course.packs.push($scope.packToAdd);
            };

            $scope.removePack = function(pack) {
                $scope.course.packs.splice($scope.course.packs.indexOf(pack, 1));
            };


            // Update existing Course
            $scope.update = function () {
                var course = $scope.course;

                if(!course.slaves) {
                    course.slaves=[];
                }

                course.$update(function () {

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };



            $scope.otherUserCourses = [];

            // Find existing Course
            $scope.findOne = function () {

                $scope.course = Courses.get({
                    courseId: $stateParams.courseId,
                    populateUser: false
                });


            };


            // Find existing Course
            $scope.findById = function (id) {

                $scope.course = Courses.get({
                    courseId: id
                });
            };

            $scope.findOtherCourse = function (id) {

                $scope.otherCourse = Courses.get({
                    courseId: id
                });
            };

            $scope.removeDanglingPackSlaves = function() {
                $http.get('/courses/'+$scope.course._id+'/removeDanglingPackSlaves').success(function(x) {

                }).error(function(response) {
                    $scope.error = response.message;

                });
            };

            $scope.addPackToCourse = function () {


                var self = {};
                self.name = this.name;
                self.slavesToSave = $scope.course.slaves.length;
                self.slavesSaved = 0;
                self.slaves = [];

                // Create new Pack object
                var pack = new Packs({
                    name: $scope.newpack.name,
                    course: $scope.course._id
                });


                pack.$save(function (response) {

                    var packid = response._id;
                    $scope.course.packs.push(packid);


                    $scope.course.$update(function () {
                        $scope.newpack.name = '';
                        angular.element('.focus').trigger('focus');

                        $scope.newpack.name = '';

                        if ($scope.course.packs.length > 3) {
                            $timeout(function () {
                                $window.scrollTo(0, document.body.scrollHeight);
                            });
                        }

                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });


                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });


            };




        }
    ]);