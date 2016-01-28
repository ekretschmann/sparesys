'use strict';

angular.module('core').directive('infobox',
	function($timeout) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                logo: '@',
                title: '@',
                position: '@'
            },
            link: function(scope, elem, attrs) {


                switch (scope.logo) {
                    case 'woman': scope.image = '/modules/core/img/brand/teacher-woman-medium.gif'; break;
                    case 'girl': scope.image = '/modules/core/img/brand/superhero-girl-medium.gif'; break;
                    case 'boy': scope.image = '/modules/core/img/brand/superhero-boy-medium.gif'; break;
                    case 'man': scope.image = '/modules/core/img/brand/teacher-man-medium.gif'; break;
                    case 'guru': scope.image = '/modules/core/img/brand/gator-skater.png'; break;
                    case 'philosopher': scope.image = '/modules/core/img/brand/philosopher-medium.gif'; break;
                }
            },
            templateUrl: '/modules/core/views/templates/infobox.html'
        };
	}
);


