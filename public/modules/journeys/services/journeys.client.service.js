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

        Journeys.query({
            userId: Authentication.user._id
        }, function (journeys) {
            if (journeys.length === 1) {
                journey = journeys[0];
            }
        });

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
            }
        };
    }
]);