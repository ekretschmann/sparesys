'use strict';

(function () {
    describe('PracticeController', function () {
        //Initialize global variables
        var $scope,
            PracticeController;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            PracticeController = $controller('PracticeController', {$scope: $scope});

        }));



        //it('if priority is 1, predicted retention does not change', function () {
        //    var adjustedRetention = $scope.adjustScoreToPriority({predictedRetention: 0.2, priority: 3});
        //    expect(adjustedRetention).toBeCloseTo(0.2, 3);
        //});


        it('if priority is 2, predicted retention goes closer to 0.4', function () {
            var adjustedRetention = $scope.adjustScoreToPriority({predictedRetention: 0.2, priority: 1});

            expect(adjustedRetention).toBeGreaterThan(0.2);
        });

        it('if priority is 2, predicted retention goes closer to 0.4', function () {
            var adjustedRetention = $scope.adjustScoreToPriority({predictedRetention: 0.8, priority: 2});

            expect(adjustedRetention).toBeLessThan(0.8);
        });

        it('if priority is 3, predicted retention does not change', function () {
            var adjustedRetention = $scope.adjustScoreToPriority({predictedRetention: 0.2, priority: 3});
            expect(adjustedRetention).toBeTruthy(adjustedRetention === 0.2);
        });

        it('if due date is in the past, predicted retention does not change', function () {
            var due = new Date();
            due.setDate(due.getDate()-1);
            var adjustedRetention = $scope.adjustScoreToDueDate({predictedRetention: 0.2, dueDate: due}, new Date());
            expect(adjustedRetention).toBeCloseTo(0.2, 3);

        });

        it('if due date is today, predicted retention is 0.4', function () {
            var due = new Date();
            due.setDate(due.getDate());
            var adjustedRetention = $scope.adjustScoreToDueDate({predictedRetention: 0.2, dueDate: due}, new Date());
            expect(adjustedRetention).toBeCloseTo(0.4, 3);
        });

        it('if due date is in 2 day, predicted retention is 80% closer to 0.4', function () {
            var due = new Date();
            due.setDate(due.getDate() + 2);
            var adjustedRetention = $scope.adjustScoreToDueDate({predictedRetention: 0.2, dueDate: due}, new Date());
            expect(adjustedRetention).toBeCloseTo(0.36, 3);
        });

        it('if due date is in 1 day, predicted retention is 90% closer to 0.4', function () {
            var due = new Date();
            due.setDate(due.getDate() + 1);
            var adjustedRetention = $scope.adjustScoreToDueDate({predictedRetention: 0.5, dueDate: due}, new Date());
            expect(adjustedRetention).toBeCloseTo(0.41, 3);
        });

        it('if due date is in more than 10 days, predicted retention does not change', function () {
            var due = new Date();
            due.setDate(due.getDate() + 20);
            var adjustedRetention = $scope.adjustScoreToDueDate({predictedRetention: 0.2, dueDate: due}, new Date());
            expect(adjustedRetention).toBeCloseTo(0.2, 3);
        });
    });
})();
