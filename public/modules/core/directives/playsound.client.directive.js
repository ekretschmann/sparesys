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
                speed: '=',
                showText: '='
            },
            link: function(scope, elem, attrs) {


                //console.log(scope.options);

                ////scope.playSound = function (lang, text, extension, speed) {
                scope.playSound = function (lang, text, extension, speed) {

                    if (speed === undefined) {
                        speed = 4;
                    }

                    speed = parseInt(speed);



                    //console.log('xxxx');

                    /* jshint ignore:start */
                    if (window.SpeechSynthesisUtterance !== undefined) {


                        console.log(text);
                        var msg = new SpeechSynthesisUtterance(text);
                        msg.lang = lang;
                        //msg.rate = speed;

                        console.log(msg);

                        window.speechSynthesis.speak(msg);

                        if( extension) {

                            msg = new SpeechSynthesisUtterance(extension);
                            msg.lang = lang;
                            //msg.rate = speed;
                            window.speechSynthesis.speak(msg);


                        }
                        //console.log(text);
                        //console.log(lang);
                        //console.log(speed);
                        //console.log('speaking '+msg+ ' '+ speed);


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


