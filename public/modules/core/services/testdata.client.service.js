'use strict';



angular.module('core').service('TestDataService', ['$q', '$resource', 'Courses', 'Packs', 'Cards',
    function ($q, $resource, Courses, Packs, Cards) {
        return {
            createDummmyCourse: function(callback) {

                // todo: Learn how to do this with a promise chain
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
                                                p2.$update(function() {
                                                    p3.course = course._id;
                                                    p3.$save(function (pack3) {
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
                });

            }

        };
    }
]);