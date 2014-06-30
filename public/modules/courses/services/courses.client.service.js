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
                        if (courses.length === 0) {
                            pack.$remove(callback);
                        }
                        if (courses.length === 1) {
                            var course = courses[0];
                            for (var i in course.packs) {
                                if (course.packs[i] === pack._id) {
                                    course.packs.splice(i, 1);
                                }
                            }
                            course.$update(function () {
                                pack.$remove(callback);
                            });
                        }
                    });


                }
                return true;
            },
            loadCards: function (courseId, cards) {
                var deferred = $q.defer();


                Courses.get({
                    courseId: courseId
                }, function (course) {
                    course.packs.forEach(function (packId) {
                        var packs = Packs.get({
                            packId: packId
                        }, function (pack) {

                            pack.cards.forEach(function (cardId) {
                                Cards.get({
                                    cardId: cardId
                                }, function (card) {
                                    cards.push(card);
                                    deferred.resolve();
                                });
                            });

                        });
                    });
                });

                return deferred.promise;
            },
            serverLoadCards: function () {
                return $resource('courses/cards/:courseId', [], {
                    get: {
                        method: 'GET',
                        isArray: true
                    }
                });
            }
        };
    }
]);