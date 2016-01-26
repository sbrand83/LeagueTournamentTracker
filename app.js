(function(){

    var app = angular.module("LeagueTournamentTracker", ["ngRoute"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html'
            })
            .when('/create-tournament', {
                templateUrl: 'views/create-tournament.html',
                controller: "CreateTournamentController"
            })
            .otherwise({
                redirectTo: '/home'
            });
    });

    app.controller("CreateTournamentController", function($scope){
        console.log("create-tournament");

        $scope.getNumber = function(num) {
            return new Array(num);   
        };
    });
})();