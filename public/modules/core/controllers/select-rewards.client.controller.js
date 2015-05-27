'use strict';


// Courses controller
angular.module('core').controller('SelectRewardsController', ['$scope', '$state', '$document', 'Authentication', 'Users', 'Rewards', 'RewardsInventoryService',
    function ($scope, $state, $document, Authentication, Users, Rewards, RewardsInventoryService) {


        $scope.user = new Users($scope.authentication.user);
        $scope.recipies = [];
        $scope.rewards = [];
        $scope.skills = [];


        // these are Strings
        $scope.itemOffers = [];
        $scope.enabledSkills = [];
        $scope.enabledRecipies = [];

        $scope.offers = [];


        $scope.userItems = [];
        $scope.userSkills = [];
        $scope.userGoals = [];
       // $scope.userRecipies = [];
       // $scope.rewardType = 'Items';

        $scope.inventoryService = RewardsInventoryService;

        $scope.findRewards = function () {
            $scope.rewards = Rewards.query(function() {
                $scope.inventoryService.init($scope.rewards, $scope.user.inventory);
                $scope.itemOffers = $scope.inventoryService.getItemOffers();
                $scope.skillOffers = $scope.inventoryService.getSkillOffers();
                $scope.enabledRecipies = $scope.inventoryService.calculatePossibleRecipies();
                $scope.userItems = $scope.inventoryService.getUserItems();
                $scope.userSkills = $scope.inventoryService.getUserSkills();
                $scope.userGoals = $scope.inventoryService.getUserGoals();
                $scope.drawOffers();
            });


        };


        $scope.getDescription = function(name) {
            var desc = '';
            $scope.rewards.forEach(function (reward) {
                if (reward.name === name) {
                    desc = reward.description;
                }
            });
            return desc;
        };





        $scope.deleteInventory = function () {
            $scope.user.inventory = [];
            new Users($scope.user).$update(function (updatedUser) {
                $scope.user = updatedUser;

            });
        };

        $scope.drawOffers = function () {



            var skillOrItem = Math.random();
            $scope.offers = [];

            if ($scope.itemOffers.length === 0 || $scope.skillOffers.length === 1 || ($scope.skillOffers.length > 1 && skillOrItem>0.05)) {

                $scope.offers = $scope.skillOffers.slice(0);
                $scope.rewardType = 'Skills';
            } else {
                $scope.offers = $scope.itemOffers.slice(0);
                $scope.rewardType = 'Items';
            }



            while($scope.offers.length>3) {
                var index = Math.floor(Math.random()*3);
                $scope.offers.splice(index,1);
            }


        };




        $scope.removeFromInventory = function(name) {
            for (var i=0; i<$scope.user.inventory.length; i++) {
                if ($scope.user.inventory[i].name === name) {
                    $scope.user.inventory.splice(i,1);
                }
            }
        };

        $scope.getItemFromInventory = function(name) {
            var item;
            $scope.user.inventory.forEach(function (inventoryItem) {
                if (inventoryItem.name === name) {
                    item = inventoryItem;
                }
            });
            return item;
        };


        $scope.craft = function (choice) {



            RewardsInventoryService.trade(choice._id);

            $scope.itemOffers = $scope.inventoryService.getItemOffers();
            $scope.skillOffers = $scope.inventoryService.getSkillOffers();
            $scope.enabledRecipies = $scope.inventoryService.calculatePossibleRecipies();
            $scope.userItems = $scope.inventoryService.getUserItems();

            $scope.user.inventory = RewardsInventoryService.inventory;
            $scope.user.$update();
            $scope.drawOffers();

        };

        $scope.range = function(n) {
            if (n === 1) {
                return [];
            }
            return new Array(Math.min(n, 8));
        };

        $scope.processChoice = function (selection) {


            var choice = $scope.offers[selection - 1];


            $scope.inventoryService.addRewardToInventory(choice._id);
            $scope.userItems = $scope.inventoryService.getUserItems();
            $scope.userSkills = $scope.inventoryService.getUserSkills();
            $scope.userGoals = $scope.inventoryService.getUserGoals();
            $scope.itemOffers = $scope.inventoryService.getItemOffers();
            $scope.skillOffers = $scope.inventoryService.getSkillOffers();
            $scope.enabledRecipies = $scope.inventoryService.calculatePossibleRecipies();

            RewardsInventoryService.updateUsages();


            $scope.user.inventory = RewardsInventoryService.inventory;
            $scope.user.$update();
            $scope.drawOffers();


            console.log($scope.userSkills);
            $scope.$parent.recoverFromReward();


        };

        $scope.exitScreen = function() {
            $scope.$parent.recoverFromReward();

        };


        $document.bind('keypress', function (event) {


            $state.go($state.current);


            if ($scope.$parent.mode !== 'reward') {
                return;
            }


            if ($state.$current.url.source !== '/practice/:courseId') {
                return;
            }


            if (event.charCode === 49) {
                $scope.processChoice(1);
            }
            if (event.charCode === 50) {
                $scope.processChoice(2);
            }
            if (event.charCode === 51) {
                $scope.processChoice(3);
            }


        });

    }]);
