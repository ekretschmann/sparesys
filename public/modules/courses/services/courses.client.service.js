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


angular.module('courses').service('CoursesService', ['$q', '$resource', 'Courses', 'Packs', 'Cards',
    function ($q, $resource, Courses, Packs, Cards) {
        return {

            remove: function (course, callback) {

                if (course) {

                    course.packs.forEach(function (packId) {

                        var self = this;
                        Packs.query({
                            _id: packId
                        }, function (pack) {
                            self.removePack(pack[0], function(){});
                        });
                    }, this);
                   course.$remove(callback);
                    console.log('remove cours '+course.name);
                }
                return true;
            },
            removePack: function (pack, callback) {

                if (pack) {
                    Courses.query({
                        _id: pack.course
                    }, function (courses) {
                        if (courses.length === 0) {

                            pack.$remove(callback);
                            console.log('remove dangling pack '+pack.name);
                        }
                        if (courses.length === 1) {
                            var course = courses[0];
                            for (var i in course.packs) {
                                if (course.packs[i] === pack._id) {
                                    course.packs.splice(i, 1);
                                }
                            }
                            course.$update(function () {
                                pack.cards.forEach(function (cardId) {

                                    Cards.query({
                                        _id: cardId
                                    }, function (cards) {
                                        if (cards.length === 1) {
                                            console.log('remove '+cards[0].question);
                                            cards[0].$remove();
                                        }
                                    });
                                });
                                pack.$remove(callback);
                                console.log('remove pack '+pack.name);
                            });
                        }
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
            copyCourse: function () {
                return $resource('courses/copy/:courseId', [], {
                    get: {
                        method: 'GET'
                    }
                });
            }
        };
    }
]);