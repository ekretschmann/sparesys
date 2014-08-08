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
            removeCard: function(card, callback) {
                var id = card.packs[0];
                Packs.query({
                    _id: id
                }, function(packs) {

                    packs.forEach(function(pack) {
                        for (var i in pack.cards) {
                            if (pack.cards[i] === card._id) {
                                pack.cards.splice(i, 1);
                            }
                        }
                        pack.$update(function() {
                            card.$remove(function() {
                                callback();
                            });
                        });
                    });
                });

            },
            removeCards: function(cards) {


                var deferred = $q.defer();
                if (cards.length === 0) {
                    deferred.resolve(true);
                }
                var cardsRemoved = 0;
                cards.forEach(function (cardId) {


                    Cards.query({
                        _id: cardId
                    }, function (cards) {
                        if (cards.length === 1) {
                            cards[0].$remove();
                            cardsRemoved++;
                            if (cardsRemoved === cards.length) {
                                deferred.resolve(true);
                            }
                        }
                    });
                });
                return deferred.promise;
            },
            remove: function (course, callback) {

                if (course) {
                    course.packs.forEach(function (packId) {

                        var self = this;
                        Packs.query({
                            _id: packId
                        }, function (packs) {

                            if (packs.length === 1) {
                                self.removeCards(packs[0].cards).then(function(){
                                    packs[0].$remove();
                                });
                            }

                        });
                    }, this);
                   course.$remove(callback);
                }
                return true;
            },
            removePack: function (pack, callback) {

                var self = this;
                if (pack) {
                    Courses.query({
                        _id: pack.course
                    }, function (courses) {
                        if (courses.length === 0) {

//                           not sure this can happen?
                            self.removeCards(pack.cards).then(function(){
                                pack.$remove();
                                callback();
                            });
                        }
                        if (courses.length === 1) {
                            var course = courses[0];
                            for (var i in course.packs) {
                                if (course.packs[i] === pack._id) {
                                    course.packs.splice(i, 1);
                                }
                            }
                            course.$update(function () {
                                self.removeCards(pack.cards).then(function(){
                                    pack.$remove();
                                    callback();
                                });
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
            },
            findSchoolclasses: function () {
                return $resource('/courses/copy/:userId', {userId:'@id'});
            }
        };
    }
]);