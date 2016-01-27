(function(){

    var app = angular.module("LeagueTournamentTracker", ["ngRoute", "data-services"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html'
            })
            .when('/create-tournament', {
                templateUrl: 'views/create-tournament.html',
                controller: "CreateTournamentController"
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: "RegisterController"
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

    app.controller('RegisterController', ['$http', '$location', 'DataSource', '$scope', function($http, $location, DataSource, $scope){
        console.log("register");

        $scope.users = [];

        DataSource.getData(function(data){
            $scope.users = data;
            console.log('controller getting data');
            console.log(data);
        });

        $scope.redirectToRegister = function(){
            $location.url("/register");
        };

    }]);
    //['$http', '$location', 'DataSource', '$scope', 
})();