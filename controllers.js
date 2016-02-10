(function(){
    var app = angular.module("Controllers", []);

    app.controller("HomeController", ['$scope', 'LoggedInUser', 'TournamentData', '$interval', function($scope, LoggedInUser, TournamentData, $interval){
        $scope.tournaments = {};

        $scope.isLoggedIn = function(){
            if(LoggedInUser.getLoggedInUser() !== null){
                //$scope.getUserTournaments();
                return true;
            }else{
                return false;
            }
            //return LoggedInUser.getLoggedInUser() !== null;
        };

        $scope.getUserTournaments = function(){
            console.log(LoggedInUser.getLoggedInUser());
            if(LoggedInUser.getLoggedInUser() !== null){
                console.log('get tournament data: controller');
                TournamentData.getTournaments(function(data){
                    console.log('Controller: '+ data);
                    $scope.tournaments = data;
                }, LoggedInUser.getLoggedInUser());
            }else{
                console.log('not logged in, didnt get tournament');
            }
            
        };

        $interval($scope.getUserTournaments, 5000);
    }]);

    app.controller("CreateTournamentController", ['$scope', 'LoggedInUser', 'TeamData', 'TournamentData', 'ParticipatesInData', function($scope, LoggedInUser, TeamData, TournamentData, ParticipatesInData){
        console.log("create-tournament");
        $scope.numberOfTeams = 2;
        $scope.teams = [];
        $scope.name = '';

        $scope.duplicateTeam = false;
        $scope.duplicatePlayer = false;
        
        

        $scope.getNumber = function(num) {
            return new Array(num);   
        };

        $scope.isLoggedIn = function(){
            return LoggedInUser.getLoggedInUser() !== null;
        };

        $scope.getTeamPlayers = function(formNum, name){
            console.log('name: ' +name);
            $scope.teams[formNum].exists = false;
            if(name !== "" && name !== undefined){
                TeamData.getTeamPlayers(function(data){
                    console.log('got team data in controller');
                    console.log('formNum' + formNum);
                    console.log(data);
                    $scope.teams[formNum].players = [];
                    if(data.length > 0){
                        $scope.teams[formNum].exists = true;
                        for(var i = 0; i < 5; i++){
                            console.log(data[i].Username);
                            $scope.teams[formNum].players.push(data[i].Username);
                        }
                    }
                }, name);
            }else{
                //if name is undefined or an empty string then reset all player fields
                $scope.teams[formNum].players = [];
            }
            
            // for(var i = 0; i < 5; i++){
            //     console.log($scope.teams[0]);
            // }
        };

        $scope.isExisting = function(teamNum){
            if($scope.teams[teamNum] !== undefined)
                return $scope.teams[teamNum].exists;
            return false;
        };

        $scope.createTournament = function(){
            console.log('create tournament');

            //create tournament associated with the user (manager) and name
            TournamentData.createTournament($scope.name, LoggedInUser.getLoggedInUser(), function(){
                //for all the non-existing teams, add the team to db and all the players if they are not already in the db
                $scope.teams.forEach(function(currentValue, index, array){
                    //if team doesn't exist yet, add it to db
                    console.log('team: ' + currentValue.teamName);
                    if(!currentValue.exists){
                        console.log('create team');
                        TeamData.createTeam(currentValue.teamName, function(){
                            //add team and tournament to participates_in table
                            ParticipatesInData.addParticipants(currentValue.teamName, $scope.name);
                        });
                    }else{
                        ParticipatesInData.addParticipants(currentValue.teamName, $scope.name);
                    }
                });
            });

            $location.url("/tournament");
        };

        $scope.uniqueTeamsAndPlayers = function(){
            $scope.duplicateTeam = false;
            $scope.duplicatePlayer = false;
            console.log('uniqueTeamsAndPlayers');
            var teamsFound = [];
            var playersFound = [];
            for(var i = 0; i < $scope.teams.length; i++){
                if(teamsFound.indexOf($scope.teams[i].teamName) > -1){
                    //team already in array
                    console.log('duplicateTeam');
                    $scope.duplicateTeam = true;
                    return false;
                } else {
                    teamsFound.push($scope.teams[i].teamName);

                    for(var n = 0; n < $scope.teams[i].players.length; n++){
                        if(playersFound.indexOf($scope.teams[i].players[n]) > -1){
                            //player already in array (duplicate)
                            console.log('duplicatePlayer');
                            $scope.duplicatePlayer = true;
                            return false;
                        } else {
                            playersFound.push($scope.teams[i].players[n]);
                        }
                    }
                }
            }
            return true;
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