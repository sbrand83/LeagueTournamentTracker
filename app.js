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
        $scope.pass1 = '';
        $scope.pass2 = '';
        $scope.username = '';
        $scope.email = '';

        $scope.validNewUserReturned = false;

        $scope.validNewUser = function(){
            console.log("valid new user");
            //var valid = false;
            DataSource.checkNewUser(function(data){
            $scope.users = data;
            console.log('controller getting data');
            console.log('checking username: ' + $scope.username + ' and email: ' + $scope.email);
            console.log(data);
            // console.log(data[0].username);
            // console.log(data[0].email);
            if($scope.users.length !== 0){
                console.log('found user with that email or username');
                return false;
            }

            console.log('can add this user');
            $scope.submitNewUser();
            return true;
            }, $scope.username, $scope.email);

            //console.log('Returning from controller: ' + valid);
            //return valid;

        };

        

        $scope.redirectToRegister = function(){
            $location.url("/register");
        };

        $scope.checkValidPassword = function(){
            if($scope.pass1 !== $scope.pass2){
                console.log('Passwords do not match.');
                return false;
            } else {
                console.log('Passwords match');
                return true;
            }
        };

        $scope.submitNewUser = function(){
            console.log("new user");
            DataSource.addNewUser($scope.username, $scope.email, $scope.pass1);

            $scope.pass1 = '';
            $scope.pass2 = '';
            $scope.username = '';
            $scope.email = '';
        };

    }]);
})();