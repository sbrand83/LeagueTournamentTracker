(function(){
    var app = angular.module("data-services", []);

    app.service("DataSource", ['$http', function($http){
        this.checkNewUser = function(callback, username, email){
            $http({method: "GET", url: "php/data.php", params: {type: 'user', username: username, email: email}})
            .then(function(responce){
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };
    }]);
})();