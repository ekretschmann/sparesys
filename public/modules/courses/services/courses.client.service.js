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
            removeCards: function(theCards) {

                var deferred = $q.defer();
                if (theCards.length === 0) {
                    deferred.resolve(true);
                }
                var cardsRemoved = 0;
                theCards.forEach(function (cardId) {

                    Cards.query({
                        _id: cardId
                    }, function (cards) {
                        if (cards.length === 1) {
//                            console.log('    removing card '+cards[0].question);
                            cards[0].$remove(function() {
//                                console.log('    removed card '+cards[0].question);
                                cardsRemoved++;
                                if (cardsRemoved === theCards.length) {
//                                    console.log('    all cards done');
                                    deferred.resolve(true);
                                }
                            });


                        }
                    });
                });
                return deferred.promise;
            },
            removePacks: function(thePacks) {
//                console.log('  packs length:'+thePacks.lenth);
                var self = this;
                var deferred = $q.defer();
                if (thePacks.length === 0) {
//                    console.log('  deferring packs');
                    deferred.resolve(true);
                }
                var packsRemoved = 0;
                thePacks.forEach(function (packsId) {

                    Packs.query({
                        _id: packsId
                    }, function (packs) {
                        if (packs.length === 1) {
//                            console.log('  removing pack '+packs[0].name);
                            self.removeCards(packs[0].cards).then(function(){


                                packs[0].$remove(function(){
                                    packsRemoved++;
//                                    console.log('  removed pack '+packs[0].name);
                                    if (packsRemoved === thePacks.length) {
//                                        console.log('  removed all packs');
                                        deferred.resolve(true);
                                    }
                                });

                            });


                        }
                    });
                });
                return deferred.promise;
            },
            remove: function (course, callback) {
//                console.log('removing course');
                var self = this;
                if (course) {

                    self.removePacks(course.packs).then(function() {
                        course.$remove(callback);

                    });



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
            copyCourseFor: function (userId) {
                return $resource('courses/copy/:courseId', {userId: userId}, {
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