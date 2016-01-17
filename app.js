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

    app.controller("CreateTournamentController", function(){
        console.log("create-tournament");
    });
})();