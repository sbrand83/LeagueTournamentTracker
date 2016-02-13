(function(){
    var app = angular.module("data-services", []);

    app.service("UserData", ['$http', function($http){
        this.checkNewUser = function(callback, username, email){
            $http({method: "GET", url: "php/data.php", params: {type: 'user', username: username, email: email}})
            .then(function(responce){
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };

        this.addNewUser = function(username, email, password){
            var data = {
                'type': 'user',
                'username': username,
                'email': email,
                'password': password
            };

            console.log('Data: ' + data);

            $http({method: "POST", url: "php/data.php", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }, data: data })
            .then(function(responce){
                console.log("Successfully added new user.");
                //console.log(responce.data);
            }, function(responce){
                console.log("Failed to add new user.");
            });
        };

        this.loginUser = function(callback, username, password){
            $http({method: "GET", url: "php/data.php", params: {type: 'login', username: username, password: password}})
            .then(function(responce){
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };

    }]);

    app.service("LoggedInUser", function(){
        var loggedInUser = null; //jcurrently logged in user

        this.setLoggedInUser = function(username){ //can be null for no current logged in user
            loggedInUser = username;
            //console.log('setLoggedInUser');
        };

        this.getLoggedInUser = function(){
            //console.log('getLoggedInUser');
            return loggedInUser; //returns username of user
        };
    });

    app.service("TournamentData", ['$http', function($http){
        this.getTournaments = function(callback, username){
            console.log('service get tournaments');
            $http({method: "GET", url: "php/data.php", params: {type: 'tournament', username: 'a'}})
            .then(function(responce){
                console.log(responce.data);
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };

        this.createTournament = function(name, username, callback){
            var data = {
                'type': 'tournament',
                'username': username,
                'name': name
            };

            console.log('Data: ' + data);

            $http({method: "POST", url: "php/data.php", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }, data: data })
            .then(function(responce){
                console.log("Successfully created new tournament.");
                console.log(responce.data);
                callback();
            }, function(responce){
                console.log("Failed to add new tournament.");
            });
        };
    }]);

    app.service("TeamData", ['$http', function($http){
        this.getTeamPlayers = function(callback, name){
            console.log('service get teams');
            $http({method: "GET", url: "php/data.php", params: {type: 'team', name: name}})
            .then(function(responce){
                console.log(responce.data);
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };

        this.createTeam = function(name, callback){
            var data = {
                'type': 'team',
                'name': name,
                'Wins': 0,
                'Losses': 0
            };

            console.log('Data: ' + data);

            $http({method: "POST", url: "php/data.php", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }, data: data })
            .then(function(responce){
                console.log("Successfully created new team.");
                console.log(responce.data);
                callback();
            }, function(responce){
                console.log("Failed to add new team.");
            });
        };
    }]);

    app.service("ParticipatesInData", ['$http', function($http){
        this.getParticipants = function(callback, tournament_name){
            console.log('cot finished yet, dont use this');
            //console.log('service get participants');
            $http({method: "GET", url: "php/data.php", params: {type: 'participates_in', tournament_name: tournament_name}})
            .then(function(responce){
                console.log(responce.data);
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };

        this.addParticipants = function(team_name, tournament_name){
            var data = {
                'type': 'participates_in',
                'team_name': team_name,
                'tournament_name': tournament_name
            };

            console.log('Data: ' + data);

            $http({method: "POST", url: "php/data.php", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }, data: data })
            .then(function(responce){
                console.log("Successfully created participant.");
                console.log(responce.data);
            }, function(responce){
                console.log("Failed to add participant.");
            });
        };
    }]);

    app.service('LeagueData', ['$http', function($http){
        var prefix = 'https://na.api.pvp.net/api/lol/na/v1.4/';

        var api_key = '?api_key=e04d7dac-9076-4477-bc79-569bf28d4ae3';

        this.getSummonerNames = function(namesArray, callback){
            var type = 'summoner/by-name/';
            var paramString = namesArray.join(",");
            var url = prefix + type + paramString + api_key;
            $http({method: 'GET', url: url})
            .then(function(responce){
                console.log("success");
                callback(responce.data);
            }, function(responce){
                console.log('failure');
            });
        };  
    }]);

})();