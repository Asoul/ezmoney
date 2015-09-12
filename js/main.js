'use strict';

require.config({

  baseUrl:'js',
  paths:{
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'parse': '../bower_components/parse/parse.min',
    'SecondController': 'controller/SecondController',
    'StatusController': 'controller/StatusController',
    'PriceController': 'controller/PriceController'
  },
  shim:{
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular']
    },
    'app': {
      deps: ['angular', 'angular-route']
    }
  }
});

require([
    'jquery',
    'angular',
    'app',
    'parse'
  ],
  function (jquery, angular) {
    console.log('ya');
    $(document).ready(function () {
      angular.bootstrap(document, ['ezmoney']);
    });
    console.log('ya2');
  }
);

// var display = new Display(document.getElementById("display"))
// var pageController = new PageController()
// var userController = new UserController()
// var pressTimer

// /* Error Message */

// function showErrorMessage(error) {
//   document.getElementById('msgDivCode').innerHTML = error.code
//   document.getElementById('msgDivContent').innerHTML = error.message
//   pageController.showMsg()
//   console.log('[' + error.code + '], ' + error.message)
// }

// function closeMsgDiv() {
//   display.erase()
//   userController.checkStatus()
// }

// document.getElementById('password').onkeydown = function(event) {
//   if (event.keyCode == 13) {
//     userController.logIn()
//   }
// }

// /* Main Activity */

// function clickType(t) {
//   var Record = Parse.Object.extend("Record")
//   var record = new Record()
  
//   record.set("price", display.toInt())
//   record.set('type', t)
//   record.set('date', new Date())
//   record.set('createdBy', Parse.User.current())
//   record.setACL(new Parse.ACL(Parse.User.current()))

//   record.save(null, {
//     success:function (record) {
//       display.setSuccess(record.get("type"), record.get("price"))
//     },
//     error:function (record, error) {
//       showErrorMessage(error)
//     }
//   })

//   display.set("Sending...")
//   pageController.showPrice()
// }

// function transformLogInPage() {
//   document.getElementById('signUpBtn').innerHTML = 'Sign Up'
//   document.getElementById('signUpBtn').onclick = function() {
//     userController.signUp()
//   }
//   document.getElementById('logInBtn').style.display = 'none'
// }

// function clickSend() {
//   pageController.showType()
// }

// function clickCancel() {
//   display.erase()
//   pageController.showPrice()
// }

// function loadRecordList() {
//   var Record = Parse.Object.extend('Record')
//   var query = new Parse.Query(Record)
//   query.ascending('date')
//   document.getElementById("recordTable").innerHTML = 'Searching...'
//   query.find({
//     success: function(records) {
//       console.log(records)
//       document.getElementById("recordTable").innerHTML = ''
//       numOfRecord = records.length
//       for (var i = 0; i < numOfRecord; i++) {

//         appendToList(records[i].get("date"),records[i].get('type'), records[i].get('price'))
//       }
//     },
//     error: function(records, error) {
//       console.log(error.code + ', ' + error.message)
//     }
//   });
// }

// function to2Digit(string) {
//   var s = String(string)
//   if (s.length < 2) 
//     return '0' + s
//   return s
// }

// function appendToList(date, type, price) {
  
//   var table = document.getElementById("recordTable")
//   var row = table.insertRow(0)
//   var cell1 = row.insertCell(-1)
//   var cell2 = row.insertCell(-1)
//   var cell3 = row.insertCell(-1)
//   var cell4 = row.insertCell(-1)

//   cell1.innerHTML = to2Digit(date.getMonth()+1) +'/' + to2Digit(date.getDate())
//   cell2.innerHTML = to2Digit(date.getHours()) + ':' + to2Digit(date.getMinutes())
//   cell3.innerHTML = type
//   cell4.innerHTML = price
// }

// document.getElementById('display').onclick = function() {
//   pageController.showList()
//   loadRecordList()
// }

// window.onload = function() {
//   // check parse login status
//   userController.checkStatus()

//   // show body after loaded
//   document.body.style.opacity = 1
// }