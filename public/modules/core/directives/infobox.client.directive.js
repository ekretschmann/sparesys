'use strict';

angular.module('core').directive('infobox',
	function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                character: '='
            },
            link: function(scope, elem, attrs) {
                console.log('here');
                console.log(elem);
                console.log(attrs);

            },
            templateUrl: '/modules/core/views/templates/infobox.html'
        };
	}
);


