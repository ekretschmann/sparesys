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
            },
            removePack: function (Courses, pack, callback) {

                if (pack) {
                    Courses.query({
                        _id: pack.course
                    }, function (courses) {
                        if (courses.length === 1) {
                            var course = courses[0];
                            for (var i in course.packs) {
                                if (course.packs[i] === pack._id) {
                                    course.packs.splice(i, 1);
                                }
                            }
                            course.$update(function() {
                                pack.$remove(callback);
                            });
                        }
                    });





                }
                return true;
            }
        };
    }
]);