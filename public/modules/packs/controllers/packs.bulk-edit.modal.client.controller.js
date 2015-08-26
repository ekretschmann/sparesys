'use strict';

angular.module('packs').controller('BulkEditPackController', ['$scope', '$location', '$state', '$modalInstance', 'pack',
    function ($scope, $location, $state, $modalInstance, pack) {
        $scope.pack = pack;


        $scope.calendar = {};
        $scope.calendar.format = 'dd/MMMM/yyyy';
        $scope.calendar.openStartDateCalendar = false;
        $scope.calendar.openDueDateCalendar = false;


        $scope.languages = [
            {name: 'do not change language', code: ''},
            {name: '-', code: ''},
            {name: 'Chinese', code: 'zh-CN'},
            {name: 'English (GB)', code: 'en-GB'},
            {name: 'English (US)', code: 'en-US'},
            {name: 'French', code: 'fr-FR'},
            {name: 'German', code: 'de-DE'},
            {name: 'Italian', code: 'it-IT'},
            {name: 'Japanese', code: 'ja-JP'},
            {name: 'Korean', code: 'ko-KR'},
            {name: 'Spanish', code: 'es-ES'}
        ];

        $scope.priorities = ['do not change priorities', 'highest', 'high', 'medium', 'low', 'lowest'];
        $scope.checks = ['do not change checks', 'computer-checked', 'self-checked', 'mixed'];


        var selectedIndex = 0;
        $scope.data = {};
        $scope.data.languageFront = $scope.languages[selectedIndex];
        $scope.data.languageBack = $scope.languages[selectedIndex];
        $scope.data.priority = $scope.priorities[selectedIndex];
        $scope.data.check = $scope.checks[selectedIndex];
        $scope.data.changeStartDate = false;
        $scope.data.changeDueDate = false;

        $scope.openStartDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openStartDateCalendar = true;
        };

        $scope.openDueDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openDueDateCalendar = true;
        };


        $scope.toggleStartDate = function () {
            $scope.data.changeStartDate = !$scope.data.changeStartDate;

            if (!$scope.data.changeStartDate) {
                $scope.data.startDate = undefined;
            }
        };

        $scope.toggleDueDate = function () {
            $scope.data.changeDueDate = !$scope.data.changeDueDate;

            if (!$scope.data.changeDueDate) {
                $scope.data.DueDate = undefined;
            }
        };


        $scope.ok = function () {

            console.log('xxxx');

            //var courseId = pack.course;
            //pack.slaves.forEach(function(slaveId) {
            //    Packs.query({
            //        _id: slaveId
            //    }, function (slavePacks) {
            //        CoursesService.removePack(slavePacks[0], function () {
            //
            //        });
            //
            //
            //    });
            //});
            //
            //for (var i=0; i<$scope.course.packs.length; i++) {
            //    var p = $scope.course.packs[i];
            //    if (p === pack._id) {
            //        $scope.course.packs.splice(i,1);
            //    }
            //}
            //
            //pack.$remove();


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);