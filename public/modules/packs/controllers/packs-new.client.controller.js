'use strict';

// Packs controller
angular.module('packs').controller('PacksControllerNew', ['$window', '$http','$timeout','$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($window, $http, $timeout, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards) {
        $scope.authentication = Authentication;


        $scope.priorities = ['highest', 'high', 'medium', 'low', 'lowest'];
        $scope.checks = {};
        $scope.checks.self = 'self-checked';
        $scope.checks.mixed = 'mixed';
        $scope.checks.computer = 'computer-checked';
        $scope.cardOptions = {};


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



        $scope.cardOptions.languageFrontEnabled = false;
        $scope.cardOptions.languageFront = $scope.languages[0];


        $scope.cardOptions.languageBackEnabled = false;
        $scope.cardOptions.languageBack = $scope.languages[0];


        $scope.toggleLanguageFront = function() {

            $scope.cardOptions.languageFrontEnabled = !$scope.cardOptions.languageFrontEnabled;
        };

        $scope.setLanguageFront = function(lang) {
            $http({ method: 'GET',
                url: '/packs/'+$scope.pack._id+'/update-all-cards',
                body: {'languageFront': lang}}).
                success(function (data, status, headers, config) {
                   console.log('done');
                });
        };

        // Update existing Pack
        $scope.update = function () {

            $scope.pack.$update();

        };


        $scope.options = {};
        $scope.updateSearch = function () {

            if (!$scope.options.searchText) {
                $scope.options.searchText = '';
            }

            Packs.query({
                text: $scope.options.searchText
            }, function(packs) {
                console.log(packs);
                $scope.packs = packs;

            });
        };

        $scope.removeDanglingPacks = function() {
            $http.get('/packs/removeDanglingPacks').success(function(x) {

            }).error(function(response) {
                $scope.error = response.message;
//                console.log('ERROR');
//                console.log(response);

            });
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

        $scope.bulkEditPackModal = function (pack) {

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


        $scope.areYouSureToDeleteCard = function (card) {

            $modal.open({
                templateUrl: 'areYouSureToDeleteCard.html',
                controller: 'DeleteCardController',
                resolve: {
                    card: function () {
                        return card;
                    },
                    pack: function () {
                        return $scope.pack;
                    }
                }
            }).result.then(function (x) {

                    var scrollpos = document.body.scrollHeight;


                    $scope.pack = Packs.get({
                        packId: $scope.pack._id
                    }, function() {
                        $timeout(function() {
                            $window.scrollTo(0, scrollpos);
                        });

                    });

                });


        };


        $scope.newCard = {};
        $scope.newCard.question = '';
        $scope.newCard.questionExtension = '';
        $scope.newCard.answer = '';
        $scope.newCard.answerExtension = '';


        $scope.scrollDown = function () {
            $window.scrollTo(0, document.body.scrollHeight);
            angular.element('.focus').trigger('focus');
        };

        $scope.addCardToPack = function () {



            var original = new Cards({
                question: $scope.newCard.question,
                questionExtension: $scope.newCard.questionExtension,
                answer: $scope.newCard.answer,
                answerExtension: $scope.newCard.answerExtension,
                packs: [$scope.pack._id],
                course: $scope.pack.course._id,
                slaves: []
            });

            original.$save(function (x) {
                var scrollpos = document.body.scrollHeight;
                $scope.pack = Packs.get({
                    packId: $scope.pack._id
                }, function() {
                    $timeout(function() {
                        $window.scrollTo(0, scrollpos);
                    });

                });
            });

        };


    }
]);