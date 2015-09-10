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
          templateUrl: 'template/template1.html'
        })
        .when('/yo', {
          templateUrl: 'template/template2.html',
          controller: SecondController
        })
        .otherwise({
          redirectTo: '/'
        })
    }])
    return app; 
  }
);
