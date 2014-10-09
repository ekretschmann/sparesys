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


angular.module('courses').service('CoursesService', ['$q', '$resource', 'Courses',
    function ($q, $resource, Courses) {
        return {
            remove: function (course, callback) {

                if (course) {
                    course.$remove(function () {
                        callback();
                    });
                }
                return true;
            },
            removeCard: function (card, callback) {

                if (card) {
                    card.$remove(function () {
                        callback();
                    });
                }
                return true;
            },
            removeCards: function (card, callback) {

                if (card) {
                    card.$remove(function () {
                        callback();
                    });
                }
                return true;
            },
            removePack: function (pack, callback) {

                var self = this;
                if (pack) {
                    pack.$remove(function () {
                        callback();
                    });
                }


                return true;
            },
            serverLoadCards: function () {
                return $resource('courses/cards/:courseId', [], {
                    get: {
                        method: 'GET',
                        isArray: true
                    }
                });
            },
            uploadCourse: function () {
                return $resource('courses/upload', [], {
                    post: {
                        method: 'POST'
                    }
                });
            },
            copyCourse: function (target) {
                return $resource('courses/copy/:courseId', {target: target}, {
                    post: {
                        method: 'POST'
                    }
                });
            },
            copyCourseFor: function (userId) {
                return $resource('courses/copy/:courseId', {userId: userId}, {
                    post: {
                        method: 'POST'
                    }
                });
            },
            findSchoolclasses: function () {
                return $resource('/courses/copy/:userId', {userId: '@id'});
            }
        };
    }
]);