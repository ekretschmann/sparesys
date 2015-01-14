'use strict';

angular.module('cards').directive('cardPager',
	function($timeout) {
        return {
            restrict: 'AE',
            transclude: true,
            link: function(scope, elem, attrs) {


            },
            templateUrl: '/modules/cards/views/templates/pager.html'
        };
	}
);


