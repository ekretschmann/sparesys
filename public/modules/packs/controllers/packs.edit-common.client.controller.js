'use strict';

angular.module('packs').controller('EditPackCommonController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};


        $scope.languages = [
            {name: 'Leave Unchanged', code: ''},
            {name: 'Chinese', code: 'zh-CN'},
            {name: 'English (GB)', code: 'en-GB'},
            {name: 'English (US)', code: 'en-US'},
            {name: 'French', code: 'fr-FR'},
            {name: 'German', code: 'de-DE'},
            {name: 'Italian', code: 'it-IT'},
            {name: 'Japanese', code: 'ja-JP'},
            {name: 'Korean', code: 'ko-KR'},
            {name: 'Spanish', code: 'es-ES'}
        ];

        $scope.options.languageFront = $scope.languages[0];
        $scope.options.languageBack = $scope.languages[0];


        $scope.options.checks = ['Leave Unchanged', 'Computer Checks', 'Self Check', 'Mixed Checks'];
        $scope.options.check = 'Leave Unchanged';


        $scope.updateCards = function () {


            $scope.pack.cards.forEach(function (card) {


                if ($scope.options.check === 'Computer Checks') {
                    card.check = 'computer';
                }
                if ($scope.options.check === 'Self Check') {
                    card.check = 'self';
                }
                if ($scope.options.check === 'Mixed Checks') {
                    card.check = 'mixed';
                }

                if ($scope.options.languageFront.name !== 'Leave Unchanged') {
                    card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageBack.name !== 'Leave Unchanged') {
                    card.languageBack = $scope.options.languageBack;
                }


                new Cards(card).$update();

            });


        };
    }
]);