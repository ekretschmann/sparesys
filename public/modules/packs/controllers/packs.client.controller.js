'use strict';

// Packs controller
angular.module('packs').controller('PacksController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'CoursesService',
    function ($scope, $stateParams, $location, $modal, Authentication, Courses, Packs, CoursesService) {
        $scope.authentication = Authentication;

        // Controller for popup window displayed when deleting the course
        var AreYouSureToDeletePackCtrl = function ($scope, $state, $modalInstance, pack) {

            $scope.pack = pack;

            $scope.ok = function () {
                CoursesService.removePack(pack, function () {
                    $state.go($state.$current, null, { reload: true });
                });
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        // Create new Pack
        $scope.create = function () {
            console.log('CREATING');
//        	// Create new Pack object
//            var pack = new Packs({
//                name: this.name
//            });
//
//            // Redirect after save
//            pack.$save(function(response) {
//                $location.path('packs/' + response._id);
//            }, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
//
//            // Clear form fields
//            this.name = '';
        };

        // Remove existing Pack
        $scope.remove = function (pack) {
            if (pack) {
                pack.$remove();

                for (var i in $scope.packs) {
                    if ($scope.packs[i] === pack) {
                        $scope.packs.splice(i, 1);
                    }
                }
            } else {
                $scope.pack.$remove(function () {
                    $location.path('packs');
                });
            }
        };

        // Update existing Pack
        $scope.update = function () {
            var pack = $scope.pack;

            pack.$update(function () {
                $location.path('packs/' + pack._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Packs
        $scope.find = function () {
            $scope.packs = Packs.query();
        };

        // Find existing Pack
        $scope.findOne = function () {
            $scope.pack = Packs.get({
                packId: $stateParams.packId
            });
        };

        $scope.getCourseName = function (pack) {
            Courses.query({
                _id: pack.course
            }, function (courses) {
                if (courses.length === 1) {
                    pack.courseName = courses[0].name;
                } else {
                    pack.courseName = 'undefined';
                }
            });


        };


        $scope.areYouSureToDeletePack = function (pack) {

            $scope.pack = pack;
            $modal.open({
                templateUrl: 'areYouSureToDeletePack.html',
                controller: AreYouSureToDeletePackCtrl,
                resolve: {

                    pack: function () {
                        return $scope.pack;
                    }
                }
            });
        };
    }
]);