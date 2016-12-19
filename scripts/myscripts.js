var app = angular.module("twitterApp", ["ngRoute","ngTweets"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/main", {
        templateUrl : "partials/main.html",
      
    })
    .when("/artSearch", {
        templateUrl : "partials/art.html",
        controller : "artCtrl"
    })
    .when("/factsSearch", {
        templateUrl : "partials/facts.html",
        controller : "factsCtrl"
    });
});

app.controller("artCtrl", function ($scope, $http, tweets){

    tweets.get({
        widgetId: '810842444686389250'
    }).success(function(data){
        $scope.feed = data;
        console.log(data);
    });


});

app.controller("factsCtrl", function ($scope, $http, tweets){
   
        tweets.get({
        widgetId: '810842444686389250'
    }).success(function(data){
        $scope.feed = data;
        console.log(data);
    });
});

app.controller("homeCtrl", function ($scope, $http, tweets){
   
        tweets.get({
        widgetId: '810691191901667330'
    }).success(function(data){
        $scope.feed = data;
        console.log(data);
    });
});