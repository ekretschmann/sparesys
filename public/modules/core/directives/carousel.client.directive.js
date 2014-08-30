'use strict';

angular.module('core').directive('imagecarousel',
	function($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                slides: '=',
                size: '='

            },
            link: function(scope, elem, attrs) {



                scope.currentIndex = 0; // Initially the index is at the first image

                scope.next = function() {
                    if (scope.currentIndex < scope.slides.length - 1) {
                        scope.currentIndex++;
                    } else {
                        scope.currentIndex = 0;
                    }
                };

                scope.prev = function() {
                    if (scope.currentIndex > 0) {
                        scope.currentIndex--;
                    } else {
                        scope.currentIndex = scope.slides.length - 1;
                    }
                };

                scope.$watch('currentIndex', function() {
                    scope.slides.forEach(function(slide) {
                        slide.visible = false; // make every image invisible
                    });

                    scope.slides[scope.currentIndex].visible = true; // make the current image visible
                });


                /* Start: For Automatic slideshow*/

                var timer;

                var sliderFunc=function(){
                    timer=$timeout(function(){
                        scope.next();
                        timer=$timeout(sliderFunc,500);
                    },5000);
                };

                sliderFunc();

                scope.$on('$destroy',function(){
                    $timeout.cancel(timer);
                });

                /* End : For Automatic slideshow*/
                
            },
            templateUrl: '/modules/core/views/templates/carousel.html'
        };
	}
);


