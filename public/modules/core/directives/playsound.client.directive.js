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
                playwhen: '@',
                speed: '='
            },
            link: function(scope, elem, attrs) {


                //console.log(scope.options);

                ////scope.playSound = function (lang, text, extension, speed) {
                scope.playSound = function (lang, text, extension, speed) {

                    if (!speed) {
                        speed = 3;
                    }

                    speed = parseInt(speed);

                    /* jshint ignore:start */
                    if (window.SpeechSynthesisUtterance !== undefined) {


                        var msg = new SpeechSynthesisUtterance(text);
                        msg.lang = lang;
                        msg.rate = speed;
                        window.speechSynthesis.speak(msg);


                        msg = new SpeechSynthesisUtterance(extension);
                        msg.lang = lang;
                        msg.rate = speed;
                        window.speechSynthesis.speak(msg);

                        console.log('speaking '+msg+ ' '+ speed);


                    } else {
                        console.log('playing sound: '+text);
                    }
                    /* jshint ignore:end */

                };


                scope.$watch('text', function() {
                    scope.playSound(scope.language, scope.text, scope.extension, scope.speed);
                });
                
            },
            templateUrl: '/modules/core/views/templates/playsound.html'
        };
	}
);


