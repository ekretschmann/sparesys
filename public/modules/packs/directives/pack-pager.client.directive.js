'use strict';

angular.module('cards').directive('packPager',
	function($timeout) {
        return {
            restrict: 'AE',
            transclude: true,
            link: function(scope, elem, attrs) {


            },
            templateUrl: '/modules/packs/views/templates/pager.html'
        };
	}
);


