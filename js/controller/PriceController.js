'use strict';

define([], function () {

  // function Display (dom) {
  //   this.dom = dom
    
  //   this.is = function (string) {
  //     return this.dom.innerHTML === string
  //   }
  //   this.startsWith = function (string) {
  //     return String(this.dom.innerHTML).startsWith(string)
  //   }

  //   this.toInt = function() {
  //     return parseInt(this.dom.innerHTML)
  //   }
  //   this.getLength = function () {
  //     return this.dom.innerHTML.length
  //   }
    
  //   this.set = function (string) {
  //     this.dom.innerHTML = string  
  //   }
  //   this.append = function (string) {
  //     this.dom.innerHTML += string
  //   }
  //   this.setSuccess = function (type, price) {
  //     this.dom.innerHTML = '✓ ' + type + ' ' + price
  //   }
  //   this.erase = function () {
  //     this.dom.innerHTML = '0'
  //   }
  // }


  function _controller($scope) {

    var pressTimer
    $scope.displayBar = "0"

    $scope.clickNumber = function(number) {
      console.log(number, typeof(number))
      if ($scope.displayBar.startsWith('✓') || $scope.displayBar.startsWith('✗')) {
        
        $scope.displayBar = String(number)
      } else if ($scope.displayBar.startsWith('Send')) {
        // do nothing
      } else if ($scope.displayBar.length < 10) {
        if ($scope.displayBar == '0') {
          if (number !== '0') {
            $scope.displayBar = String(number)
          }
        } else {
          $scope.displayBar += String(number)
        }
      }
    }

    $scope.resetDown = function() {
    }

    $scope.resetUp = function() {

    }
  }

  return _controller;
});

function resetDown() {
  document.getElementById('logOutKey').innerHTML = '掰'
  pressTimer = setTimeout(function(){userController.logOut()}, 1500)
}

function resetUp() {
  document.getElementById('logOutKey').innerHTML = 'C'
  clearTimeout(pressTimer)
}