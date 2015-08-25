'use strict';

angular.module('core').directive('language',
	function() {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                card: '=',
                direction: '@'
            },
            link: function(scope, elem, attrs) {



                scope.languages = [
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

                scope.selectedIndex = 0;

                var languageCard;
                if(scope.direction === 'front') {
                    languageCard = scope.card.languageFront;
                } else {
                    languageCard = scope.card.languageBack;

                }
                console.log(scope.card.languageFront);
                console.log(scope.card.languageBack);
                console.log(scope.card);
                for(var i=0; i<scope.languages; i++) {
                    if (languageCard.name === scope.languages[i].name) {
                        scope.selectedIndex = i;
                    }
                }

                //console.log(scope.card);
                //console.log(scope.direction);


                scope.setLanguage = function(lang) {
                    if(scope.direction === 'front') {
                        scope.card.languageFront = lang;
                        scope.card.$update();
                    }
                };

            },
            templateUrl: '/modules/core/views/templates/languagePicker.html'
        };
	}
);


