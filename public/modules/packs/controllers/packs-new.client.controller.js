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
        $scope.settingChanges = {};

        $scope.calendar = {};
        $scope.calendar.format = 'dd/MMMM/yyyy';
        $scope.calendar.openStartDateCalendar = false;
        $scope.calendar.openDueDateCalendar = false;

        $scope.editMode = 'data';



        $scope.selectedSetting = 'Choose setting';
        $scope.settings = [
            'Language Front',
            'Language Back',
            'Priority',
            'Start Date',
            'Due Date',
            'Checks',
            'Forward mode',
            'Reverse mode',
            'Images mode'

        ];

        $scope.chooseSetting = function(setting) {
            $scope.selectedSetting = setting;
        };

        $scope.showMode = function(mode) {
            $scope.editMode = mode;
        };

        $scope.manageImages = function (card) {


            Cards.get({
                cardId: card._id
            }, function(c) {
                $modal.open({
                    templateUrl: 'manageImages.html',
                    controller: 'ManageImagesController',
                    resolve: {
                        card: function () {
                            return c;
                        }
                    }
                }).result.then(function() {
                        card.images = c.images;

                    });
            });

        };

        $scope.openStartDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openStartDateCalendar = true;
        };

        $scope.openDueDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openDueDateCalendar = true;
        };


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
        $scope.priorities = ['highest', 'high', 'medium', 'low', 'lowest'];
        $scope.checks = ['computer', 'self', 'mixed'];



        $scope.cardOptions.languageFrontEnabled = false;
        $scope.cardOptions.languageFront = $scope.languages[0];


        $scope.cardOptions.languageBackEnabled = false;
        $scope.cardOptions.languageBack = $scope.languages[0];

        $scope.cardOptions.priorityEnabled = false;
        $scope.cardOptions.priority = $scope.priorities[2];

        $scope.cardOptions.priorityEnabled = false;
        $scope.cardOptions.checks = $scope.checks[0];

        $scope.cardOptions.startDateEnabled = false;
        $scope.cardOptions.dueDateEnabled = false;
        $scope.cardOptions.forwardEnabled = true;

        $scope.cardOptions.changeForwardEnabled = false;
        $scope.cardOptions.forwardEnabled = false;
        $scope.cardOptions.forwardReadFront = false;
        $scope.cardOptions.forwardReadBack = false;
        $scope.cardOptions.forwardSpeechRecognition = false;

        $scope.cardOptions.changeReverseEnabled = false;
        $scope.cardOptions.reverseEnabled = false;
        $scope.cardOptions.reverseReadFront = false;
        $scope.cardOptions.reverseReadBack = false;
        $scope.cardOptions.reverseSpeechRecognition = false;

        $scope.cardOptions.changeImagesEnabled = false;
        $scope.cardOptions.imagesEnabled = false;
        $scope.cardOptions.imagesReadFront = false;
        $scope.cardOptions.imagesReadBack = false;
        $scope.cardOptions.imagesSpeechRecognition = false;

        $scope.toggleLanguageFront = function() {
            $scope.cardOptions.languageFrontEnabled = !$scope.cardOptions.languageFrontEnabled;
            if (!$scope.cardOptions.languageFrontEnabled) {
                $scope.settingChanges.languageFront = undefined;
            }
        };

        $scope.setLanguageFront = function(lang) {
            $scope.cardOptions.languageFront = lang;
            $scope.settingChanges.languageFront = lang;
        };

        $scope.toggleLanguageBack = function() {
            $scope.cardOptions.languageBackEnabled = !$scope.cardOptions.languageBackEnabled;
            if (!$scope.cardOptions.languageBackEnabled) {
                $scope.settingChanges.languageBack = undefined;
            }
        };

        $scope.setLanguageBack = function(lang) {
            $scope.cardOptions.languageBack = lang;
            $scope.settingChanges.languageBack = lang;
        };

        $scope.togglePriority = function() {
            $scope.cardOptions.priorityEnabled = !$scope.cardOptions.priorityEnabled;
            if (!$scope.cardOptions.priorityEnabled) {
                $scope.settingChanges.priority = undefined;
            }
        };

        $scope.setPriority = function(priority) {
            $scope.cardOptions.priority = priority;
            $scope.settingChanges.priority = $scope.priorities.indexOf(priority)+1;
        };

        $scope.toggleChecks = function() {
            $scope.cardOptions.checksEnabled = !$scope.cardOptions.checksEnabled;
            if (!$scope.cardOptions.checksEnabled) {
                $scope.settingChanges.checks = undefined;
            }
        };

        $scope.setChecks = function(checks) {
            $scope.cardOptions.checks = checks;
            $scope.settingChanges.checks = checks;
        };

        $scope.toggleStartDate = function() {
            $scope.cardOptions.startDateEnabled = !$scope.cardOptions.startDateEnabled;
            if (!$scope.cardOptions.startDateEnabled) {
                $scope.settingChanges.startDate = undefined;
            }
        };

        //$scope.setStartDate = function() {
        //    console.log('start date'+$scope.cardOptions.startDate);
        //    $scope.settingChanges.startDate = $scope.cardOptions.startDate ;
        //};

        $scope.toggleDueDate = function() {
            $scope.cardOptions.dueDateEnabled = !$scope.cardOptions.dueDateEnabled;
            if (!$scope.cardOptions.dueDateEnabled) {
                $scope.settingChanges.dueDate = undefined;
            }
        };

        $scope.setStartDate = function() {
            $scope.settingChanges.dueDate = $scope.cardOptions.dueDate ;
        };

        $scope.toggleForward = function() {
            $scope.cardOptions.changeForwardEnabled = !$scope.cardOptions.changeForwardEnabled;
            if (!$scope.cardOptions.changeForwardEnabled) {
                $scope.settingChanges.forwardEnabled = undefined;
                $scope.settingChanges.forwardReadFront = undefined;
                $scope.settingChanges.forwardReadBack = undefined;
                $scope.settingChanges.forwardSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.forwardEnabled = $scope.cardOptions.forwardEnabled;
                $scope.settingChanges.forwardReadFront = $scope.cardOptions.forwardReadFront;
                $scope.settingChanges.forwardReadBack = $scope.cardOptions.forwardReadBack;
                $scope.settingChanges.forwardSpeechRecognition = $scope.cardOptions.forwardSpeechRecognition;
            }
            console.log($scope.settingChanges.forwardReadFront);

        };

        $scope.toggleForwardEnabled = function() {
            $scope.cardOptions.forwardEnabled = !$scope.cardOptions.forwardEnabled;
            $scope.settingChanges.forwardEnabled = $scope.cardOptions.forwardEnabled;
            if (!$scope.cardOptions.forwardEnabled) {
                $scope.settingChanges.forwardReadFront = undefined;
                $scope.settingChanges.forwardReadBack = undefined;
                $scope.settingChanges.forwardSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.forwardReadFront = $scope.cardOptions.forwardReadFront;
                $scope.settingChanges.forwardReadBack = $scope.cardOptions.forwardReadBack;
                $scope.settingChanges.forwardSpeechRecognition = $scope.cardOptions.forwardSpeechRecognition;
            }
            console.log($scope.settingChanges.forwardReadFront);
        };

        $scope.toggleForwardReadFront = function() {
            $scope.settingChanges.forwardReadFront = !$scope.settingChanges.forwardReadFront;
            $scope.cardOptions.forwardReadFront = !$scope.cardOptions.forwardReadFront;
        };

        $scope.toggleForwardReadBack = function() {
            $scope.settingChanges.forwardReadBack = !$scope.settingChanges.forwardReadBack;
            $scope.cardOptions.forwardReadBack = !$scope.cardOptions.forwardReadBack;
        };

        $scope.toggleForwardSpeechRecognition = function() {
            $scope.settingChanges.forwardSpeechRecognition = !$scope.settingChanges.forwardSpeechRecognition;
            $scope.cardOptions.forwardSpeechRecognition = !$scope.cardOptions.forwardSpeechRecognition;
        };

        $scope.toggleForwardTimed = function() {
            $scope.settingChanges.forwardTimed = !$scope.settingChanges.forwardTimed;
            $scope.cardOptions.forwardTimed = !$scope.cardOptions.forwardTimed;
        };

        $scope.toggleReverse = function() {
            $scope.cardOptions.changeReverseEnabled = !$scope.cardOptions.changeReverseEnabled;
            if (!$scope.cardOptions.changeReverseEnabled) {
                $scope.settingChanges.reverseEnabled = undefined;
                $scope.settingChanges.reverseReadFront = undefined;
                $scope.settingChanges.reverseReadBack = undefined;
                $scope.settingChanges.reverseSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.reverseEnabled = $scope.cardOptions.reverseEnabled;
                $scope.settingChanges.reverseReadFront = $scope.cardOptions.reverseReadFront;
                $scope.settingChanges.reverseReadBack = $scope.cardOptions.reverseReadBack;
                $scope.settingChanges.reverseSpeechRecognition = $scope.cardOptions.reverseSpeechRecognition;
            }
            console.log($scope.settingChanges.reverseReadFront);

        };

        $scope.toggleReverseEnabled = function() {
            $scope.cardOptions.reverseEnabled = !$scope.cardOptions.reverseEnabled;
            $scope.settingChanges.reverseEnabled = $scope.cardOptions.reverseEnabled;
            if (!$scope.cardOptions.reverseEnabled) {
                $scope.settingChanges.reverseReadFront = undefined;
                $scope.settingChanges.reverseReadBack = undefined;
                $scope.settingChanges.reverseSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.reverseReadFront = $scope.cardOptions.reverseReadFront;
                $scope.settingChanges.reverseReadBack = $scope.cardOptions.reverseReadBack;
                $scope.settingChanges.reverseSpeechRecognition = $scope.cardOptions.reverseSpeechRecognition;
            }
            console.log($scope.settingChanges.reverseReadFront);
        };

        $scope.toggleReverseReadFront = function() {
            $scope.settingChanges.reverseReadFront = !$scope.settingChanges.reverseReadFront;
            $scope.cardOptions.reverseReadFront = !$scope.cardOptions.reverseReadFront;
        };

        $scope.toggleReverseReadBack = function() {
            $scope.settingChanges.reverseReadBack = !$scope.settingChanges.reverseReadBack;
            $scope.cardOptions.reverseReadBack = !$scope.cardOptions.reverseReadBack;
        };

        $scope.toggleReverseSpeechRecognition = function() {
            $scope.settingChanges.reverseSpeechRecognition = !$scope.settingChanges.reverseSpeechRecognition;
            $scope.cardOptions.reverseSpeechRecognition = !$scope.cardOptions.reverseSpeechRecognition;
        };


        $scope.toggleImages = function() {
            $scope.cardOptions.changeImagesEnabled = !$scope.cardOptions.changeImagesEnabled;
            if (!$scope.cardOptions.changeImagesEnabled) {
                $scope.settingChanges.imagesEnabled = undefined;
                $scope.settingChanges.imagesReadFront = undefined;
                $scope.settingChanges.imagesReadBack = undefined;
                $scope.settingChanges.imagesSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.imagesEnabled = $scope.cardOptions.imagesEnabled;
                $scope.settingChanges.imagesReadFront = $scope.cardOptions.imagesReadFront;
                $scope.settingChanges.imagesReadBack = $scope.cardOptions.imagesReadBack;
                $scope.settingChanges.imagesSpeechRecognition = $scope.cardOptions.imagesSpeechRecognition;
            }

        };

        $scope.toggleImagesEnabled = function() {
            $scope.cardOptions.imagesEnabled = !$scope.cardOptions.imagesEnabled;
            $scope.settingChanges.imagesEnabled = $scope.cardOptions.imagesEnabled;
            if (!$scope.cardOptions.imagesEnabled) {
                $scope.settingChanges.imagesReadFront = undefined;
                $scope.settingChanges.imagesReadBack = undefined;
                $scope.settingChanges.imagesSpeechRecognition = undefined;
            } else {
                $scope.settingChanges.imagesReadFront = $scope.cardOptions.imagesReadFront;
                $scope.settingChanges.imagesReadBack = $scope.cardOptions.imagesReadBack;
                $scope.settingChanges.imagesSpeechRecognition = $scope.cardOptions.imagesSpeechRecognition;
            }
            console.log($scope.settingChanges.imagesReadFront);
        };

        $scope.toggleImagesReadFront = function() {
            $scope.settingChanges.imagesReadFront = !$scope.settingChanges.imagesReadFront;
            $scope.cardOptions.imagesReadFront = !$scope.cardOptions.imagesReadFront;
        };

        $scope.toggleImagesReadBack = function() {
            $scope.settingChanges.imagesReadBack = !$scope.settingChanges.imagesReadBack;
            $scope.cardOptions.imagesReadBack = !$scope.cardOptions.imagesReadBack;
        };

        $scope.toggleImagesSpeechRecognition = function() {
            $scope.settingChanges.imagesSpeechRecognition = !$scope.settingChanges.imagesSpeechRecognition;
            $scope.cardOptions.imagesSpeechRecognition = !$scope.cardOptions.imagesSpeechRecognition;
        };

        $scope.changeDefaultSettings = function() {
            if($scope.cardOptions.startDate) {
                $scope.settingChanges.startDate = $scope.cardOptions.startDate;
            }
            if($scope.cardOptions.dueDate) {
                $scope.settingChanges.dueDate = $scope.cardOptions.dueDate;
            }
            if($scope.cardOptions.checks) {
                $scope.settingChanges.checks = $scope.cardOptions.checks;
            }

           // console.log($scope.settingChanges);

            $http.post('/packs/'+$scope.pack._id+'/update-all-cards', {settings: $scope.settingChanges, id: $scope.pack._id}).
                success(function (data, status, headers, config) {
                    $scope.settingChanges = {};
                    $scope.cardOptions = {};
                    $state.go($state.$current, null, { reload: true });
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
                        $scope.prevPackId = prev;
                        if ($scope.pack.course.packs.length > i) {
                            $scope.nextPackId = $scope.pack.course.packs[i + 1];
                        }
                    } else {
                        prev = packId;
                    }
                }
                if ($scope.prevPackId) {
                    $scope.prevPack = Packs.get({
                        packId: $scope.prevPackId
                    }, function () {

                    });
                }

                if ($scope.nextPackId) {
                    $scope.nextPack = Packs.get({
                        packId: $scope.nextPackId
                    }, function () {

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

        //$scope.bulkEditPackModal = function (pack) {
        //
        //    $scope.pack = pack;
        //
        //    $modal.open({
        //        templateUrl: 'bulkEditPack.html',
        //        controller: 'BulkEditPackController',
        //        resolve: {
        //
        //            pack: function () {
        //                return $scope.pack;
        //            }
        //        }
        //    });
        //};


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
                    $scope.newCard.question = '';
                    $scope.newCard.answer = '';

                    $scope.newCard.questionExtension = '';
                    $scope.newCard.answerExtension = '';
                    $scope.scrollDown();
                });
            });

        };


    }
]);