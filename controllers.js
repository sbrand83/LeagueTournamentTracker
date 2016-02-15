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

    app.controller("CreateTournamentController", ['$scope', '$location', 'LoggedInUser', 'TeamData', 'TournamentData', 'ParticipatesInData', 'LeagueData', 'PlayerData' , function($scope, $location, LoggedInUser, TeamData, TournamentData, ParticipatesInData, LeagueData, PlayerData){
        console.log("create-tournament");
        $scope.numberOfTeams = 2;
        $scope.teams = [];
        $scope.name = '';

        //initialize team form information
        for(var n = 0; n < $scope.numberOfTeams; n++){
            $scope.teams[n] = {};
            $scope.teams[n].validateDisabled = false;
            $scope.teams[n].players = [];
        }

        $scope.duplicateTeam = false;
        $scope.duplicatePlayer = false;

        $scope.validTeamAndPlayers = false;
        
        

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

                            //add the players on the team that are not already in the database
                            //going to just query for each name indiviually for now, but this isn't the best way probably
                            var players = currentValue.players;
                            var teamName = currentValue.teamName;
                            for(var n = 0; n < currentValue.players.length; n++){
                                PlayerData.createPlayer(players[n], teamName);
                            }
                            

                        });
                    }else{
                        ParticipatesInData.addParticipants(currentValue.teamName, $scope.name);
                    }
                });
            });

            $location.url("/tournament");
        };

        $scope.validateTeamsAndPlayers = function(){
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

            var uncheckedTeams = [];

            for(i = 0; i < $scope.teams.length; i++){
                //if the team has already been validated, continue. If it is not valid or hasn't been validated, 
                //then check one more time (this is for people who didn't click 'Verify Players' button on a team)
                
                
                //if team already exists, assume it has valid summoner names (this is a bad assumption.  
                //omeones account could have been deleted and no long valid)
                if($scope.teams[i].playersValidated || $scope.teams[i].exists){
                    continue;
                }else{
                    uncheckedTeams.push(i);
                    //check if players are real summoners
                    //$scope.validateSummonerNames(i);
                    //if not return false
                    // if(!$scope.teams[i].playersValidated){
                    //     console.log("invalid summoners on form submit");
                    //     return false;
                    // }
                }
            }

            if(uncheckedTeams.length === 0){
                console.log('all team players already validated');
                $scope.createTournament();
                //return true;
            }

            console.log("not all players already validated");
            var returnValue = null;

            // var waitFunction = function(interval){
            //     if(returnValue !== null){
            //         console.log('got return value');
            //         //clearInterval(interval);
            //     }else{
            //         console.log('still null');
            //     }

            // };

            //while(returnValue === null)

            $scope.validateSummonerNames(uncheckedTeams, function(data){
                returnValue = data;
                console.log('Return value' + returnValue);
                console.log('validateTeamsAndPlayers return value: ' + returnValue);
                if(returnValue){
                    $scope.createTournament();
                }else{
                    console.log("FAILED to create tournament: not all players validated");
                }
                
            });
            
            //var interval = setInterval(waitFunction, 100);

            //var count = 0;
            // while(returnValue === null){
            //     //wait
            //     if(count % 100 === 0){
            //         console.log('waiting');
            //     }
            // }

            //clearInterval(interval);
            
            //return false;

            //return true;
        };

        $scope.validateSummonerNames = function(indexArray, callback){
            if(indexArray.length === 0){
                returnValue = false;
                callback(returnValue);
            }

            console.log('checkSummonerNames');
            console.log(indexArray);

            var players = [];

            for(var i = 0; i < indexArray.length; i++){
                console.log(indexArray[i]);
                console.log($scope.teams[indexArray[i]].players.length);
                for(var k = 0; k < $scope.teams[indexArray[i]].players.length; k++){
                    $scope.teams[indexArray[i]].validateDisabled = true;
                    console.log($scope.teams[indexArray[i]].players);
                    players.push($scope.teams[indexArray[i]].players[k]);
                }
            }

            console.log('players in validateSummonerNames: ' + players);

            var returnValue = false;

            LeagueData.getSummonerNames(players, function(data){
                console.log(data);
                //$scope.teams[index].validateDisabled = false;

                //enable all the 'verify players' button
                for(var i = 0; i < indexArray.length; i++){
                    console.log($scope.teams[indexArray[i]].players.length);
                    for(var k = 0; k < $scope.teams[indexArray[i]].players.length; k++){
                        $scope.teams[indexArray[i]].validateDisabled = false;
                        console.log($scope.teams[indexArray[i]].players);
                    }
                }

                //the api just doesn't return anything if no infomation if found.  So if there is less than 5 per each index of team responces, 
                //then not all of the players were found to be real
                console.log('data.length ' + Object.keys(data).length);
                if(Object.keys(data).length < (5 * indexArray.length)){
                    console.log('summoner validation failed');
                    for(i = 0; i < indexArray.length; i++){
                        console.log($scope.teams[indexArray[i]].players.length);
                        for(var n = 0; n < $scope.teams[indexArray[i]].players.length; n++){
                            $scope.teams[indexArray[i]].playersValidated = false;
                            console.log($scope.teams[indexArray[i]].players);
                        }
                    }
                    // if(checkAll){
                    //     $scope.validTeamAndPlayers = false;
                    // }
                    returnValue = false;
                    //$scope.teams[index].playersValidated = false;
                } else {
                    //$scope.teams[index].playersValidated = true;
                    for(i = 0; i < indexArray.length; i++){
                        console.log($scope.teams[indexArray[i]].players.length);
                        for(var m = 0; m < $scope.teams[indexArray[i]].players.length; m++){
                            $scope.teams[indexArray[i]].playersValidated = true;
                            console.log($scope.teams[indexArray[i]].players);
                        }
                    }
                    // if(checkAll){
                    //     $scope.validTeamAndPlayers = true;
                    // }
                    returnValue = true;
                }

                callback(returnValue);
            });
        };

        $scope.isDisabled = function(index){
            if($scope.teams[index] === undefined){
                return false;
            }else{
                return $scope.teams[index].validateDisabled;
            }
        };

        //$scope.checkSummonerNames();

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

        // $scope.simple_chart_config = {
        //         chart: {
        //             container: "#tree-simple",
        //             rootOrientation: 'EAST'
        //         },

        //         nodeStructure: {
        //             text: {
        //                 name: "Parent node"
        //             },
        //             children: [
        //                 {
        //                     text: {
        //                         name: "First child"
        //                     }
        //     },
        //                 {
        //                     text: {
        //                         name: "Second child"
        //                     }
        //     }
        // ],
        //             connectors: {
        //                 type: "step"
        //             },
        //         }
        //     };
        
        var teams = [1,2,3,4,5,6,7,8];
        var numberOfTeams = teams.length;
        var numberOfMatches = numberOfTeams - 1;
        //log base 2 of numberOfMatches
        var numberOfLevels = Math.log(numberOfMatches) / Math.LN2;

        var numberInFirstLevel = Math.floor(numberOfTeams / 2);

        var matchTree = {};

        // for(var i = 0; i < numberInFirstLevel; i++){

        // }

        function match(team1, team2, child1, child2, number){
            this.team1 = team1;
            this.team2 = team2;
            this.left = child1;
            this.right = child2;
            this.number = number;
        }

        var currentMatchNumber = numberOfMatches;
        var rootMatch = null;

        //adds match in next avaliable spot
        function addMatch(root, num){
            if(root === null){
                return new match(null, null, null, null, num);
            }
             
            if(num < root.number){
                root.left = addMatch(root.left, num);
                return root;
            }else if(num > root.number){
                root.right = addMatch(root.right, num);
                return root;
            }else{
                return root;
            }

        }
        
        function postOrder(root){
            var str = '';
            if(root.left !== null){
                str += postOrder(root.left);
            }

            if(root.right !== null){
                str += postOrder(root.right);
            }

            return str + root.number;
        }

        function findOrder(array){
            if(array.length === 1 || array.length === 0){
                return array;
            }

            //console.log(array);
            var middle = parseInt(array.length / 2);
            //splits firsthalf, not including middle
            var firsthalf = array.slice(0, middle);
            //slits secondehalf, not including middle
            var secondhalf = array.slice(middle + 1, array.length);

            var returnArray = [];
            returnArray.push(array[middle]);

            return returnArray.concat(findOrder(firsthalf).concat(findOrder(secondhalf)));
        }

        var matches = 7;
        //var middle = parseInt(7/2);

        var numberArray = [];
        for(var i = 0; i < matches; i++){
            numberArray.push(i);
        }
        console.log('NumberArray: ' + numberArray);

        var insertOrder = findOrder(numberArray);
        console.log(insertOrder);
        // insertOrder.push(middle);
        // console.log('Middle: ' + middle);


        var root4 = addMatch(null, insertOrder[0]);

        for(var r = 1; r < insertOrder.length; r++){
            addMatch(root4, insertOrder[r]);
        }

        console.log(root4);
        console.log(postOrder(root4));
        // 
        //console.log([0,1].slice(2, 2));
        
        //go throught this newly created tree and build the treant json out of it (use js object first)
        var tree = {};
        //one time thing at beginning
        tree.chart = {};
        tree.chart.container = '#tree-simple';

        //start of traversing tree
        tree.nodeStructure = {};

        function buildTreantTree(root, nodeObject){
            nodeObject.text = {name: root.number};
            nodeObject.children = [];
            //var str = '';
            if(root.left !== null){
                var childObjleft = {};
                nodeObject.children.push(childObjleft);
                buildTreantTree(root.left, childObjleft);
            }

            if(root.right !== null){
                var childObjright = {};
                nodeObject.children.push(childObjright);
                buildTreantTree(root.right, childObjright);
            }

            return;
        }

        buildTreantTree(root4, tree.nodeStructure);

        console.log(tree);

        //var myChart = new Treant($scope.simple_chart_config);
        var myChart = new Treant(tree);
    });
})();