'use strict';

// Packs controller
angular.module('packs').controller('PacksController', ['$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards) {
        $scope.authentication = Authentication;

        $scope.showhelp = false;
        $scope.toggles = {};
        $scope.toggles.due = false;
        $scope.toggles.start = false;
        $scope.toggles.check = false;
        $scope.toggles.dir = false;
        $scope.toggles.images = false;
        $scope.cards = [];


        $scope.check = 'self-checked for new cards';

        $scope.languages = [
            {name:'-', code:''},
            {name:'Chinese', code:'zh-CN'},
            {name:'English (GB)', code:'en-GB'},
            {name:'English (US)', code:'en-US'},
            {name:'French', code:'fr-FR'},
            {name:'German', code:'de-DE'},
            {name:'Italian', code:'it-IT'},
            {name:'Japanese', code:'ja-JP'},
            {name:'Korean', code:'ko-KR'},
            {name:'Spanish', code:'es-ES'}
        ];

        $scope.modes = ['forward', 'reverse', 'images', 'multiple choice'];

        $scope.checks = ['always computer-checked', 'always self-checked', 'self-checked for new cards'];

        var selectedIndex = 0;
        $scope.language = $scope.languages[selectedIndex];




        if (!$scope.authentication.user) {
            $location.path('/');
        }

        $scope.help = function() {
            $scope.showhelp = ! $scope.showhelp;
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
            }, function(pack) {
                console.log('xxx');
                console.log(pack);
//                Courses.query({
//                    _id: pack.course
//                }, function (courses) {
//                    if (courses.length === 1) {
//                        $scope.course = courses[0];
//                    }
//                });
//
//                $scope.pack.cards.forEach(function (cardId) {
//                    Cards.get({
//                        cardId: cardId
//                    }, function (card) {
//                        $scope.cards.push(card);
//                    });
//                }, this);
            });
        };

        $scope.clearPacks = function() {
            $scope.packs.forEach(function(pack) {
                if (pack.courseName === 'undefined') {
                    pack.$remove(function() {
                        $state.go($state.$current, null, { reload: true });
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


        $scope.areYouSureToDeletePack = function (pack) {

            $scope.pack = pack;

            Courses.query({
                _id: pack.course
            }, function (courses) {
                if (courses.length === 1) {
                    $scope.course = courses[0];

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
                }
            });


        };

        $scope.addCardToPackPopup = function () {



            Courses.query({
                _id: $scope.pack.course
            }, function (courses) {
                console.log(courses);
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


        $scope.sortableOptions = {

            stop: function (e, ui) {
                var pack = $scope.pack;
                var courseName = pack.courseName;
                pack.$update(function() {
                    $scope.pack.courseName = courseName;
                });

            }
        };
    }
]);