'use strict';

angular.module('packs').controller('EditPackCommonController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};



        $scope.languages = [
            {name:'Leave Unchanged', code:''},
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

        $scope.options.languageFront = $scope.languages[0];
        $scope.options.languageBack = $scope.languages[0];


        $scope.options.checks = ['Leave Unchanged', 'Computer-Checked', 'Self-Checked', 'Mixed Checks'];
        $scope.options.check = 'Leave Unchanged';




        $scope.updateCards = function () {


            $scope.pack.cards.forEach(function (c) {


                var card = new Cards(c);

                if ($scope.options.checks === 'Computer-Checked') {
                    card.check = 'computer';
                }
                if ($scope.options.readFront === 'off') {
                    card.readFront = false;
                }

                if ($scope.options.readBack === 'on') {
                    card.readBack = true;
                }
                if ($scope.options.readBack === 'off') {
                    card.readBack = false;
                }

                if ($scope.options.speech === 'on') {
                    card.speechRecognitionBack = true;
                }

                if ($scope.options.speech === 'off') {
                    card.speechRecognitionBack = false;
                }

                if ($scope.options.mode === 'on') {
                    if (card.modes.indexOf('forward') === -1) {
                        card.modes.push('forward');
                    }
                }

                if ($scope.options.mode === 'off') {
                    if (card.modes.indexOf('forward') !== -1) {
                        card.modes.splice(card.modes.indexOf('forward'), 1);
                    }
                }

                card.$update();

            });


        };
    }
]);