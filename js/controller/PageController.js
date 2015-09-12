'use strict';

define([], function () {

  function _controller($scope, $location) {
    $scope.greeting = 'Page Controller'
    $scope.logIn = function() {
      console.log('ya')
    }
  }

  return _controller;
});

// /* Page Controller */
// function PageController() {
//   this.status = 0
//   this.pageLogIn = document.getElementById('loginDiv')
//   this.pageMsg = document.getElementById('msgDiv')
//   this.pagePrice = document.getElementById('priceTable')
//   this.pageType = document.getElementById('typeTable')
//   this.pageList = document.getElementById('listDiv')

//   this.getStatus = function() {
//     return this.status
//   }

//   this.hideAll = function() {
//     this.pageLogIn.style.display = 'none'
//     this.pageMsg.style.display = 'none'
//     this.pagePrice.style.display = 'none'
//     this.pageType.style.display = 'none'
//     this.pageList.style.display = 'none'
//   }
//   this.showLogIn = function() {
//     this.hideAll()
//     document.getElementById('signUpBtn').innerHTML = 'New User'
//     document.getElementById('signUpBtn').onclick = function(){transformLogInPage()}
//     document.getElementById('logInBtn').style.display = 'inline'
  
//     this.pageLogIn.style.display = 'block'
//     this.status = 1
//   }
//   this.showMsg = function() {
//     this.hideAll()
//     this.pageMsg.style.display = 'block'
//     this.status = 2
//   }
//   this.showPrice = function() {
//     this.hideAll()
//     this.pagePrice.style.display = 'table'
//     this.status = 3
//   }
//   this.showType = function() {
//     this.hideAll()
//     this.pageType.style.display = 'table'
//     this.status = 4
//   }
//   this.showList = function() {
//     this.hideAll()
//     this.pageList.style.display = 'block'
//     this.status = 5
//   }
// }
