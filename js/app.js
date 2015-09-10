'use strict';

define(['angular', 'angular-route', 'SecondController'],
  
  function (angular, ngRoute, SecondController) {
  
    var app = angular.module('ezmoney', ['ngRoute']);

    app.controller("PageController", ["$scope", function($scope) {
      $scope.greeting = 'YA'
    }])

    app.controller("SecondController", SecondController)

    app.config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'template/_login.html'
        })
        .when('/message', {
          templateUrl: 'template/_message.html',
          controller: SecondController
        })
        .when('/list', {
          templateUrl: 'template/_list.html',
          controller: SecondController
        })
        .when('/price', {
          templateUrl: 'template/_price_table.html',
          controller: SecondController
        })
        .when('/type', {
          templateUrl: 'template/_type_table.html',
          controller: SecondController
        })
        .otherwise({
          redirectTo: '/'
        })
    }])

    return app; 
  }
);
