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




                    /* jshint ignore:start */
                    if (window.SpeechSynthesisUtterance !== undefined) {


                        var msg = new SpeechSynthesisUtterance(text);
                        msg.lang = lang;
                        msg.rate = 0;
                        window.speechSynthesis.speak(msg);


                        msg = new SpeechSynthesisUtterance(extension);
                        msg.lang = lang;
                        msg.rate = 0;
                        window.speechSynthesis.speak(msg);

                    } else {
                        console.log('playing sound: '+text);
                    }
                    /* jshint ignore:end */

                };


                scope.$watch('text', function() {
                    scope.playSound(scope.language, scope.text, scope.extension);
                });
                
            },
            templateUrl: '/modules/core/views/templates/playsound.html'
        };
	}
);


