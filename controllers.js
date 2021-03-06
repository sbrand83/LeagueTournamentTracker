(function(){
    var app = angular.module("Controllers", []);

    app.controller("HomeController", ['$scope', 'LoggedInUser', 'TournamentData', function($scope, LoggedInUser, TournamentData){
        $scope.isLoggedIn = function(){
            return LoggedInUser.getLoggedInUser() !== null;
        };

        $scope.getUserTournaments = function(){
            TournamentData.getTournaments(LoggedInUser.getLoggedInUser());
        };
    }]);

    app.controller("CreateTournamentController", ['$scope', 'LoggedInUser', function($scope, LoggedInUser){
        console.log("create-tournament");

        $scope.getNumber = function(num) {
            return new Array(num);   
        };

        $scope.isLoggedIn = function(){
            return LoggedInUser.getLoggedInUser() !== null;
        };
    }]);

    app.controller('RegisterController', ['$http', '$location', 'UserData', '$scope', function($http, $location, UserData, $scope){
        console.log("register");

        $scope.users = [];
        $scope.pass1 = '';
        $scope.pass2 = '';
        $scope.username = '';
        $scope.email = '';

        $scope.success = false;
        $scope.failure = false;
        $scope.dupPass = true;

        $scope.validNewUserReturned = false;

        $scope.validNewUser = function(){
            console.log("valid new user");
            //var valid = false;
            UserData.checkNewUser(function(data){
            $scope.users = data;
            console.log('controller getting data');
            console.log('checking username: ' + $scope.username + ' and email: ' + $scope.email);
            console.log(data);
            // console.log(data[0].username);
            // console.log(data[0].email);
            if($scope.users.length !== 0){
                console.log('found user with that email or username');
                $scope.pass1 = '';
                $scope.pass2 = '';
                $scope.username = '';
                $scope.email = '';
                $scope.resetAlerts();
                $scope.failure = true;
                return false;
            }

            console.log('can add this user');
            $scope.submitNewUser();
            return true;
            }, $scope.username, $scope.email);

            //console.log('Returning from controller: ' + valid);
            //return valid;

        };

        

        

        $scope.checkValidPassword = function(){
            if($scope.pass1 !== $scope.pass2){
                console.log('Passwords do not match.');
                $scope.resetAlerts();
                $scope.dupPass = false;
                return false;
            } else {
                console.log('Passwords match');
                $scope.resetAlerts();
                return true;
            }
        };

        $scope.submitNewUser = function(){
            console.log("new user");
            UserData.addNewUser($scope.username, $scope.email, $scope.pass1);

            $scope.pass1 = '';
            $scope.pass2 = '';
            $scope.username = '';
            $scope.email = '';
            $scope.resetAlerts();
            $scope.success = true;
        };

        $scope.isSuccessful = function(){
            return $scope.success;
        };

        $scope.isFailure = function(){
            return $scope.failure;
        };

        $scope.isValidPassword = function(){
            return $scope.dupPass;
        };

        $scope.resetAlerts = function(){
            $scope.success = false;
            $scope.failure = false;
            $scope.dupPass = true;
        };

    }]);

    app.controller('NavbarController', ['$http', '$location', 'UserData', '$scope', 'LoggedInUser', function($http, $location, UserData, $scope, LoggedInUser){

        $scope.loggedIn = false;
        $scope.username = '';
        $scope.password = '';
        $scope.success = false;
        $scope.failed = false;

        $scope.loginUser = function(){
            console.log('login function');
            UserData.loginUser(function(data){
                console.log('login returned');
                console.log(data);
                if(data.length === 0){
                    console.log('login failed');
                    $scope.failed = true;
                    $scope.success = false;
                    $scope.username = "";
                    $scope.password = "";
                } else {
                    console.log('login success');
                    $scope.failed = false;
                    $scope.success = true;
                    $scope.loggedIn = true;
                    LoggedInUser.setLoggedInUser($scope.username);
                }
            }, $scope.username, $scope.password);
        };

        $scope.logoutUser = function(){
            $scope.loggedIn = false;
            $scope.username = "";
            $scope.password = "";
            $scope.success = false;
            $scope.failed = false;
            LoggedInUser.setLoggedInUser(null);
            $location.url("/home");
        };

        $scope.redirectToRegister = function(){
            $location.url("/register");
        };

        $scope.isFailure = function(){
            return $scope.failed;
        };

        $scope.isSuccessful = function(){
            return $scope.success;
        };

        $scope.isLoggedIn = function(){
            //console.log($scope.loggedIn);
            return $scope.loggedIn;
        };

    }]);

    app.controller("TournamentController", function($scope){
        console.log("tournament controller");

        $scope.simple_chart_config = {
                chart: {
                    container: "#tree-simple"
                },

                nodeStructure: {
                    text: {
                        name: "Parent node"
                    },
                    children: [
                        {
                            text: {
                                name: "First child"
                            }
            },
                        {
                            text: {
                                name: "Second child"
                            }
            }
        ],
                    connectors: {
                        type: "step"
                    },
                    collapsable: true
                }
            };

        var myChart = new Treant($scope.simple_chart_config);
    });
})();