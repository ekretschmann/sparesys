'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', function ($scope, Authentication) {
    $scope.authentication = Authentication;

    // Set of Photos
    $scope.photos = [
        {src: '/modules/core/img/brand/superhero-girl-medium.gif', text: 'test'},
        {src: '/modules/core/img/brand/superhero-boy-medium.gif', text: 'Image 02'},
        {src: '/modules/core/img/brand/philosopher-medium.gif', text: 'Image 03'},
        {src: '/modules/core/img/brand/guru-medium.gif', text: 'Image 04'},
        {src: '/modules/core/img/brand/teacher-man-medium.gif', text: 'Image 05'},
        {src: '/modules/core/img/brand/teacher-woman-medium.gif', text: 'Image 06'}
    ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

}]);