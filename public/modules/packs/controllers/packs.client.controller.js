'use strict';

// Packs controller
angular.module('packs').controller('PacksController', ['$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards) {
        $scope.authentication = Authentication;

        $scope.showhelp = false;
        $scope.toggles = {};
        $scope.toggles = {};
        $scope.toggles.due = false;
        $scope.toggles.start = false;
        $scope.toggles.check = false;
        $scope.toggles.dir = false;
        $scope.toggles.images = false;
        $scope.cards = [];
        $scope.prevPack = undefined;
        $scope.nextPack = undefined;

        $scope.activeTab = 'Content';


        $scope.switchTab = function (activeTab) {
            $scope.activeTab = activeTab;
        };

        $scope.tabs = [
            {title: 'Pack', active: false},
            {title: 'Content', active: true},
            {title: 'Cards', active: false},
            {title: 'Forward', active: false},
            {title: 'Reverse', active: false},
            {title: 'Images', active: false}
        ];


        if (!$scope.authentication.user) {
            $location.path('/');
        }

        $scope.help = function () {
            $scope.showhelp = !$scope.showhelp;
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

            $scope.pack.$update();
            //var pack = $scope.pack;
            //
            //pack.$update(function () {
            //    $location.path('packs/' + pack._id);
            //}, function (errorResponse) {
            //    $scope.error = errorResponse.data.message;
            //});
        };

        // Find a list of Packs
        $scope.find = function () {
            $scope.packs = Packs.query();
        };

        // Find existing Pack
        $scope.findOne = function () {

            if ($stateParams.tab) {

                $scope.activeTab = $stateParams.tab;

                $scope.tabs.forEach(function (tab) {
                    if (tab.title === $stateParams.tab) {
                        tab.active = true;
                    } else {
                        tab.active = false;
                    }
                });

            }

            $scope.pack = Packs.get({
                packId: $stateParams.packId
            }, function () {
                var prev, next;

                for (var i = 0; i < $scope.pack.course.packs.length; i++) {
                    var packId = $scope.pack.course.packs[i];
                    if (packId === $scope.pack._id) {
                        $scope.prevPack = prev;
                        if ($scope.pack.course.packs.length > i) {
                            $scope.nextPack = $scope.pack.course.packs[i + 1];
                        }
                    } else {
                        prev = packId;
                    }
                }
            });
        };

        $scope.clearPacks = function () {
            $scope.packs.forEach(function (pack) {
                if (pack.courseName === 'undefined') {
                    pack.$remove(function () {
                        $state.go($state.$current, null, {reload: true});
                    });

                }
            });
        };

        // Find existing Pack
        $scope.findById = function (packId) {
            $scope.pack = Packs.get({
                packId: packId
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

        $scope.bulkEditPackModal= function (pack) {

            $scope.pack = pack;

            $modal.open({
                templateUrl: 'bulkEditPack.html',
                controller: 'BulkEditPackController',
                resolve: {

                    pack: function () {
                        return $scope.pack;
                    }
                }
            });
        };


        $scope.areYouSureToDeletePack = function (pack) {

            $scope.pack = pack;

            $modal.open({
                templateUrl: 'areYouSureToDeletePack.html',
                controller: 'DeletePackController',
                resolve: {

                    pack: function () {
                        return $scope.pack;
                    },
                    course: function () {
                        return $scope.course;
                    }
                }
            });
        };

        $scope.addCardToPackPopup = function () {


            Courses.query({
                _id: $scope.pack.course._id
            }, function (courses) {
                if (courses.length === 1) {
                    $scope.course = courses[0];

                    $modal.open({
                        templateUrl: 'addCardToPack.html',
                        controller: 'AddCardToPackController',
                        resolve: {
                            pack: function () {
                                return $scope.pack;
                            },
                            course: function () {
                                return $scope.course;
                            }
                        }
                    });
                }
            });
        };

        $scope.editPackPopup = function (size) {
            $modal.open({
                templateUrl: 'editPack.html',
                controller: 'EditPackController',
                size: size,
                resolve: {
                    pack: function () {
                        return $scope.pack;
                    }
                }
            });
        };

        $scope.managePackPopup = function (size) {
            $modal.open({
                templateUrl: 'managePack.html',
                controller: 'ManagePackController',
                size: size,
                resolve: {
                    pack: function () {
                        return $scope.pack;
                    }
                }
            });
        };


        $scope.data = ['eins', 'zwei', 'drei', 'vier'];

        $scope.sortableOptions = {

            stop: function (e, ui) {
                //var pack = $scope.pack;
                var courseName = $scope.pack.courseName;


                //console.log(e);
                //console.log(ui.item[0].innerText);
                //console.log($scope.pack);


                // there seems to be a sortable options bug when the last element
                // is sorted upwards. It introduces a null card.
                //for (var i in pack.cards) {
                //    if (!pack.cards[i]) {
                //        pack.cards.splice(i, 1);
                //    }
                //}

                //console.log(' ');
                //pack.cards.forEach(function(c) {
                //    console.log(c.question);
                //});

                $scope.pack.$update(function (e) {
                    $scope.pack.courseName = courseName;
                });

            }
        };
    }
]);