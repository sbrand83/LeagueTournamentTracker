(function(){

    var app = angular.module("LeagueTournamentTracker", []);

    app.controller("NavbarController", function($scope){
        $scope.currentTab = 1;

        $scope.isSelected = function(checkTab){
            return this.currentTab === checkTab;
        };

        $scope.setSelected = function(tab){
            $scope.currentTab = tab;
        };
    });
})();