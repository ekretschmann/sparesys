'use strict';

//Journeys service used to communicate Journeys REST endpoints
angular.module('journeys').factory('Journeys', ['$resource',
    function ($resource) {
        return $resource('journeys/:journeyId', { journeyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('journeys').service('JourneyService', ['$q', '$resource', 'Journeys', 'Authentication',
    function ($q, $resource, Journeys, Authentication) {

        var journey;

        if (Authentication.user) {
            Journeys.query({
                userId: Authentication.user._id
            }, function (journeys) {

                // should not happen, but you never know - a journey could be deleted
                if (journeys.length === 0) {
                    var newJourney = new Journeys();

                    newJourney.$save(function (response) {
                        journey = response;
                    });
                }
                if (journeys.length === 1) {
                    journey = journeys[0];
                }
            });
        }

        return {
            courseEdited: function() {
                if (!journey.editedCourse) {
                    journey.editedCourse = true;
                    journey.$update();
                }
            },
            courseCreated: function() {
                if (!journey.createdCourse) {
                    journey.createdCourse = true;
                    journey.$update();
                }
            },
            packCreated: function() {
                if (!journey.createdPack) {
                    journey.createdPack = true;
                    journey.$update();
                }
            },
            userHasCreatedCourseBefore: function() {
                if (journey) {
                    return journey.createdCourse;
                }
                return false;
            },
            userHasCreatedPackBefore: function() {
                if (journey) {
                    return journey.createdPack;
                }
                return false;
            },
            userHasEditedCourseBefore: function() {
                if (journey) {
                    return journey.editedCourse;
                }
                return false;
            },
            userHasCreatedCardBefore: function() {
                if (journey) {
                    return journey.createdCard;
                }
                return false;
            }

        };
    }
]);