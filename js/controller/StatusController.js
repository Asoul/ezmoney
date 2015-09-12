'use strict';

define(['parse', 'jquery'], function (Parse, $) {

  function _controller($scope, $location) {
    
    Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

    $scope.status = 0

    $scope.checkStatus = function() {
      if (Parse.User.current()) {
        $scope.status = 1
        $location.path('/price')
      } else {
        $scope.status = 0
        $location.path('/')
      }
    }

    $scope.logIn = function() {
      var username = $("#username").val()
      var password = $("#password").val()

      Parse.User.logIn(username, password, {
        success: function(user) {
          $scope.checkStatus()
        },
        error: function(user, error) {
          $scope.checkStatus()
        }
      })
    }

    $scope.logOut = function() {
      Parse.User.logOut()
      $scope.checkStatus()
    }

    $scope.signUp = function() {
      var username = $("#username").val()
      var password = $("#password").val()

      var user = new Parse.User()
      user.set('username', username)
      user.set('password', password)
      user.set('email', username)

      user.signUp(null, {
        success: function(user) {
          $scope.checkStatus()
        },
        error: function(user, error) {
          $scope.checkStatus()
        }
      })
    }
  }

  return _controller;
});
