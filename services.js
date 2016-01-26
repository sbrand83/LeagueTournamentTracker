(function(){
    var app = angular.module("data-services", []);

    app.service("DataSource", ['$http', function($http){
        this.getData = function(callback){
            $http({method: "GET", url: "php/data.php"})
            .then(function(responce){
                callback(responce.data);
            }, function(responce){
                console.log("Failure");
            });
        };
    }]);
})();