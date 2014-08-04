'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$modal', '$stateParams', '$location', 'Authentication', 'Schoolclasses',
    function ($scope, $modal, $stateParams, $location, Authentication, Schoolclasses) {

        $scope.authentication = Authentication;


        $scope.removeCourseFromClass = function (course) {
            for (var i in $scope.schoolclass.courses) {
                if ($scope.schoolclass.courses[i] === course) {
                    $scope.schoolclass.courses.splice(i, 1);
                }
            }


            $scope.schoolclass.$update();
        };

        $scope.addCourseToClass = function (course) {
//            console.log(course);
//            console.log($scope.schoolclass);

            if ($scope.schoolclass.courses.indexOf(course._id) === -1) {
                $scope.schoolclass.courses.push(course._id);
                $scope.schoolclass.$update();
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

        $scope.addClassPopup = function (size) {

            $modal.open({
                templateUrl: 'addClass.html',
                controller: 'AddClassController',
                size: size,
                resolve: {
                    classlist: function () {
                        return $scope.schoolclasses;
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


        $scope.removeFromClass = function (student) {
            for (var i in $scope.schoolclass.students) {
                if ($scope.schoolclass.students[i] === student) {
                    $scope.schoolclass.students.splice(i, 1);
                }
            }

            $scope.schoolclass.$update(function (res) {

            }, function (err) {
                console.log(err);
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