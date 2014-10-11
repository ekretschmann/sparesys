'use strict';

angular.module('courses').controller('AddPackToCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'Packs', 'Courses', 'JourneyService',
    function ($scope, $state, $timeout, $modalInstance, course, Packs, Courses, JourneyService) {
        $scope.course = course;
        $scope.data = {};
        $scope.data.name = '';

        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addPackToCourse = function () {

            var self = {};
            self.name = this.name;
            self.slavesToSave = course.slaves.length;
            self.slavesSaved = 0;
            self.slaves = [];

            // Create new Pack object
            var pack = new Packs({
                name: $scope.data.name,
                course: this.course._id
            });


            pack.$save(function (response) {
                var packid = response._id;
                $scope.course.packs.push(packid);
                $scope.course.$update(function () {
                    $scope.data.name = '';
                    angular.element('.focus').trigger('focus');
//                    $state.go($state.$current, null, { reload: true });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });


                $scope.course.slaves.forEach(function (slaveId) {
                    Courses.query({
                        _id: slaveId
                    }, function (slaveCourses) {

                        if (slaveCourses.length === 0) {
                            // course does not exist any more
                            self.slavesSaved++;
                            for (var i in $scope.course.slaves) {
                                if ($scope.course.slaves[i] === slaveId) {
                                    $scope.course.slaves.splice(i, 1);
                                }
                            }
                        }

                        if (slaveCourses.length === 1) {
                            var slaveCourse = slaveCourses[0];

                            var slavePack = new Packs({
                                name: self.name,
                                course: slaveCourse._id
                            });

                            slavePack.$save(function () {
                                slaveCourse.packs.push(slavePack._id);
                                self.slaves.push(slavePack._id);
                                self.slavesSaved++;
                                if (self.slavesSaved === self.slavesToSave) {
                                    pack.slaves = self.slaves;
                                    pack.$update(function (err) {
//                                        console.log('updated pack '+pack);
//                                        console.log(err);
                                    });
                                    slaveCourse.$update(function (err) {
//                                        console.log('updated course '+slaveCourse);
//                                        console.log(err);
                                    });
                                    $scope.course.$update();
                                }
                            });


                        }
                    });
                });


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });


        };
    }
]);