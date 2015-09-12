'use strict';

define(['angular', 'angular-route', 'StatusController', 'PriceController'],
  
  function (angular, ngRoute, StatusController, PriceController) {
  
    var app = angular.module('ezmoney', ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'template/_login.html'
        })
        .when('/message', {
          templateUrl: 'template/_message.html'
        })
        .when('/list', {
          templateUrl: 'template/_list.html'
        })
        .when('/price', {
          templateUrl: 'template/_price.html'
        })
        .when('/type', {
          templateUrl: 'template/_type.html'
        })
        .otherwise({
          redirectTo: '/'
        })
    }])

    app
      .controller("StatusController", ["$scope", "$location", StatusController])
      .controller("PriceController", ["$scope", PriceController])

    return app; 
  }
);
