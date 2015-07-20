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




                scope.playSound = function (lang, text, extension) {


                    //console.log(scope.text);
  //                  console.log(scope.playwhen);
  //                  console.log(scope.language);
//                    console.log(scope.extension);

                    if (lang.name || lang.code) {
                        return;
                    }

                    /* jshint ignore:start */
                    if (window.SpeechSynthesisUtterance !== undefined) {


                        console.log(lang);


                        var msg = new SpeechSynthesisUtterance(text);
                        msg.lang = lang.code;
                        window.speechSynthesis.speak(msg);
                        console.log(msg);


                        msg = new SpeechSynthesisUtterance(extension);
                        msg.lang = lang.code;
                        window.speechSynthesis.speak(msg);

                    } else {
                        console.log('playing sound: '+text);
                    }
                    /* jshint ignore:end */

                };

                scope.playSound(scope.language, scope.text, scope.extension);

                
            },
            templateUrl: '/modules/core/views/templates/playsound.html'
        };
	}
);


