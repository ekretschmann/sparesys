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
                    case 'woman': scope.image = '/modules/core/img/brand/hibernator.png'; break;
                    case 'girl': scope.image = '/modules/core/img/brand/investigator.png'; break;
                    case 'boy': scope.image = '/modules/core/img/brand/illustrator.gif'; break;
                    case 'man': scope.image = '/modules/core/img/brand/illuminator.png'; break;
                    case 'guru': scope.image = '/modules/core/img/brand/gator-skater.png'; break;
                    case 'philosopher': scope.image = '/modules/core/img/brand/refrigerator.png'; break;
                }
            },
            templateUrl: '/modules/core/views/templates/infobox.html'
        };
	}
);


