'use strict';

// Courses controller
angular.module('courses').controller('CoursesController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'CoursesService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, Packs, CoursesService) {
            $scope.authentication = Authentication;


            // Controller for popup window displayed when deleting the course
            var AreYouSureToDeleteCourseCtrl = function ($scope, $state, $modalInstance, course) {

                $scope.course = course;

                $scope.ok = function () {
                    CoursesService.remove(course, function () {

                        if ($state.current.name === 'adminCourses') {
                            $state.go($state.$current, null, { reload: true });
                        } else {

                            $location.path('courses');
                        }
                    });


                    $modalInstance.close();

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            // Create new Course
            $scope.create = function () {
                // Create new Course object
                var course = new Courses({
                    name: this.name,
                    description: this.description
                });

                // Redirect after save
                course.$save(function (response) {
                    $location.path('courses/' + response._id + '/edit');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                // Clear form fields
                this.name = '';
            };

            // Remove existing Course
            $scope.remove = function (course) {
                if (course) {
                    course.$remove();

                    for (var i in $scope.courses) {
                        if ($scope.courses[i] === course) {
                            $scope.courses.splice(i, 1);
                        }
                    }
                } else {
                    $scope.course.$remove(function () {
                        $location.path('courses');
                    });
                }
            };

            // Update existing Course
            $scope.update = function () {
                var course = $scope.course;

                course.$update(function () {
                    $location.path('courses');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Find a list of Courses
            $scope.find = function () {
                $scope.courses = Courses.query();
            };

            // Find list for current user
            $scope.findForCurrentUser = function () {
                $scope.courses = Courses.query({
                    userId: $scope.authentication.user._id
                });
            };

            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };

            // Find existing Course
            $scope.findById = function (id) {
                $scope.course = Courses.get({
                    courseId: id
                });
            };

            $scope.infoCreateCourse = function () {
                // Todo: implement me
            };

            $scope.areYouSureToDeleteCourse = function (course) {

                $scope.course = course;
                var modalInstance = $modal.open({
                    templateUrl: 'areYouSureToDeleteCourse.html',
                    controller: AreYouSureToDeleteCourseCtrl,
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });
            };



            var AddPackToCourseCtrl = function ($scope, $state, $modalInstance, course) {

                $scope.course = course;

                $scope.ok = function () {
                    console.log('ok');
//                    angular.element('.hasfocus').trigger('focus');
                    $scope.addPackToCourse();
                };

                $scope.cancel = function () {
                    console.log('Cancel');
                    $modalInstance.dismiss('cancel');
                };

                $scope.addPackToCourse = function () {

                    console.log('ADDING');
                    // Create new Pack object
                    var pack = new Packs({
                        name: this.name,
                        course: this.course._id
                    });


                    // Redirect after save
                    pack.$save(function (response) {
                        var packid = response._id;

                        var c = $scope.course;
                        c.packs.push(packid);

                        c.$update(function (response) {
//                        console.log(c);
//                        console.log(c.packs);
                            $state.go($state.$current, null, { reload: true });
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });

                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                    $scope.name = '';

                };
            };


            $scope.addPackToCoursePopup = function (size) {

                $modal.open({
                    templateUrl: 'addPackToCourse.html',
                    controller: AddPackToCourseCtrl,
                    size: size,
                    resolve: {
                        course: function () {
                            return $scope.course;
                        }
                    }
                });

            };
        }
    ]);