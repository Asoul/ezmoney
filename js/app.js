'use strict';

define(['angular'],
  
  function (angular) {
  
    var app = angular.module('ezmoney', []);
    
    app.controller('PageController', function($scope) {
      $scope.greeting = 'Ya'
    });
    return app; 
  }
);
