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

    app.service("TournamentData", function(){
        this.getTournaments = function(callback, username){
            console.log('service get tournaments');
            $http({method: "GET", url: "php/data.php", params: {type: 'tournament', username: username}})
            .then(function(responce){
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };
    });

})();