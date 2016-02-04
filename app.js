(function(){

    var app = angular.module("LeagueTournamentTracker", ["ngRoute", "data-services", "Controllers"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: "HomeController"
            })
            .when('/create-tournament', {
                templateUrl: 'views/create-tournament.html',
                controller: "CreateTournamentController"
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: "RegisterController"
            })
            .when('/tournament', {
                templateUrl: 'views/view-tournament.html',
                controller: "TournamentController"
            })
            .otherwise({
                redirectTo: '/home'
            });
    });

    
})();