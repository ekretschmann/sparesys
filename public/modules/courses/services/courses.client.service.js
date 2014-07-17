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
            createDummyPack: function(name, cardNumber) {

            },
            createDummmyCourse: function(callback) {
                var c = new Courses({name: 'Dummy Course', description: 'For Testing Purposes'});
                var p1 = new Packs({name: 'Dummy Pack (3 cards)'});
                var p2 = new Packs({name: 'Dummy Pack (1 card)'});
                var p3 = new Packs({name: 'Dummy Pack (no cards)'});
                var c1 = new Cards({question: 'q1', answer: 'a1'});
                var c2 = new Cards({question: 'q2', answer: 'a2'});
                var c3 = new Cards({question: 'q3', answer: 'a3'});
                var c4 = new Cards({question: 'q4', answer: 'a4'});


                c.$save(function(course) {
                    p1.course = course._id;
                    p1.$save(function(pack1) {
                        c1.packs=[pack1._id];
                        c2.packs=[pack1._id];
                        c3.packs=[pack1._id];
                        c1.$save(function(card1) {
                            c2.$save(function(card2){
                                c3.$save(function(card3){
                                    p1.cards = [card1._id, card2._id, card3._id];
                                    p1.$update(function() {
                                        p2.course= course._id;
                                        p2.$save(function(pack2){
                                            c4.packs=[pack2._id];
                                            c4.$save(function(card4){
                                                p2.cards = [card4._id];
                                                p3.course = course._id;
                                                p3.$save(function(pack3) {
                                                    course.packs = [pack1._id, pack2._id, pack3._id];
                                                    course.$update(function () {
                                                        callback();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

//                var course = new Courses({
//                    name: 'Dummy Course',
//                    description: 'For Testing Purposes'
//                });
//
//                // Redirect after save
//                course.$save(function (course) {
//
//                    createDummyPack('Dummy Pack 1 (3 cards)', 3)
//                    var pack1 = new Packs({
//                        name: 'Dummy Pack 1 (3 cards)',
//                        course: course._id
//                    });
//                    pack1.$save(function(pack) {
//                        new Cards({question: 'q1', answer: 'a1', packs: [pack1._id]}).$save();
//                        new Cards({question: 'q2', answer: 'a2', packs: [pack1._id]}).$save();
//                        new Cards({question: 'q3', answer: 'a3', packs: [pack1._id]}).$save();
//
//                    });
//                    var pack2 = new Packs({
//                        name: 'Dummy Pack 2 (1 card)',
//                        course: course._id
//                    });
//                    pack2.$save(function(pack) {
//                        new Cards({question: 'q4', answer: 'a4', packs: [pack2._id]}).$save();
//                    });
//                    var pack3 = new Packs({
//                        name: 'Dummy Pack 3 (no cards)',
//                        course: course._id
//                    });
//                    pack3.$save();
//                });
            },
            remove: function (course, callback) {

                if (course) {
                    course.packs.forEach(function (packId) {

                        var self = this;
                        Packs.query({
                            _id: packId
                        }, function (packs) {
                            if (packs.length === 1) {
                                packs[0].cards.forEach(function (cardId) {

                                    Cards.query({
                                        _id: cardId
                                    }, function (cards) {
                                        if (cards.length === 1) {
                                            console.log('removing card '+cards[0]);
                                            cards[0].$remove();
                                        }
                                    });
                                });
                                console.log('removing pack '+packs[0]);
                                packs[0].$remove();
                            }

                        });
                    }, this);
                    console.log('removing course '+course);
                   course.$remove(callback);
                }
                return true;
            },
            removePack: function (pack, callback) {

                if (pack) {
                    Courses.query({
                        _id: pack.course
                    }, function (courses) {
                        if (courses.length === 0) {

//                            pack.$remove(callback);
                            console.log('remove dangling pack ' + pack.name);
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
                                            console.log('remove ' + cards[0].question);
//                                            cards[0].$remove();
                                        }
                                    });
                                });
//                                pack.$remove(callback);
                                console.log('remove pack ' + pack.name);
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