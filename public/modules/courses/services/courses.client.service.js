'use strict';

//Courses service used to communicate Courses REST endpoints
angular.module('courses').factory('Courses', ['$resource', function ($resource) {
    return $resource('courses/:courseId', {
        courseId: '@_id',
        userId: '@userId'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);


angular.module('courses').factory('CoursesService', [
    function () {
        return {

            remove: function (course, callback) {

                if (course) {
//              Todo: remove the packs
                    course.$remove(callback);

                }
                return true;
            }
        };
    }
]);