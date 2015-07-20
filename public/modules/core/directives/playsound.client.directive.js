'use strict';

angular.module('core').directive('playsound',
	function($window) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                text: '@',
                extension: '@',
                language: '@',
                playwhen: '@'
            },
            link: function(scope, elem, attrs) {




                scope.playSound = function (lang, text) {


                    console.log(scope.text);
  //                  console.log(scope.playwhen);
                    console.log(scope.language);
//                    console.log(scope.extension);

                    if (!scope.language.name || !scope.language.code) {
                        console.log('aaaaa');
                        return;
                    }

                    /* jshint ignore:start */
                    if (window.SpeechSynthesisUtterance !== undefined) {


                        console.log('aaaaa');
                        // console.log('playing sound: '+text+ ' ('+lang.code+')');

                        var msg = new SpeechSynthesisUtterance(text);
                        msg.lang = lang.code;
                        window.speechSynthesis.speak(msg);

                    } else {
                        console.log('playing sound: '+text);
                    }
                    /* jshint ignore:end */

                };

                scope.playSound('aaa',scope.text);

                
            },
            templateUrl: '/modules/core/views/templates/playsound.html'
        };
	}
);


