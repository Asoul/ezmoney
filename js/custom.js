
Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

var display = new Display(document.getElementById("display"))
var pageController = new PageController()
var userController = new UserController()
var pressTimer

/* Error Message */

function showErrorMessage(error) {
  document.getElementById('msgDivCode').innerHTML = error.code
  document.getElementById('msgDivContent').innerHTML = error.message
  pageController.showMsg()
  console.log('[' + error.code + '], ' + error.message)
}

function closeMsgDiv() {
  display.erase()
  userController.checkStatus()
}

/* User Controller */

function UserController() {

  this.status = 0

  this.checkStatus = function() {
    if (Parse.User.current()) {
      this.status = 1
      pageController.showPrice()
    } else {
      this.status = 0
      pageController.showLogIn()
    }
  }

  this.logIn = function() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value

    Parse.User.logIn(username, password, {
      success: function(user) {
        pageController.showPrice()
        this.status = 1
      },
      error: function(user, error) {
        showErrorMessage(error)
        this.status = 0
      }
    })
  }

  this.logOut = function() {
    Parse.User.logOut()
    this.status = 0
    pageController.showLogIn()
  }

  this.signUp = function() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value

    var user = new Parse.User()
    user.set('username', username)
    user.set('password', password)
    user.set('email', username)

    user.signUp(null, {
      success: function(user) {
        pageController.showPrice()
        this.status = 1
      },
      error: function(user, error) {
        showErrorMessage(error)
        this.status = 0
      }
    })
  }
}

document.getElementById('password').onkeydown = function(event) {
  if (event.keyCode == 13) {
    userController.logIn()
  }
}

/* Page Controller */
function PageController() {
  this.status = 0
  this.pageLogIn = document.getElementById('loginDiv')
  this.pageMsg = document.getElementById('msgDiv')
  this.pagePrice = document.getElementById('priceTable')
  this.pageType = document.getElementById('typeTable')
  this.pageList = document.getElementById('listDiv')

  this.getStatus = function() {
    return this.status
  }

  this.hideAll = function() {
    this.pageLogIn.style.display = 'none'
    this.pageMsg.style.display = 'none'
    this.pagePrice.style.display = 'none'
    this.pageType.style.display = 'none'
    this.pageList.style.display = 'none'
  }
  this.showLogIn = function() {
    this.hideAll()
    document.getElementById('signUpBtn').innerHTML = 'New User'
    document.getElementById('signUpBtn').onclick = function(){transformLogInPage()}
    document.getElementById('logInBtn').style.display = 'inline'
  
    this.pageLogIn.style.display = 'block'
    this.status = 1
  }
  this.showMsg = function() {
    this.hideAll()
    this.pageMsg.style.display = 'block'
    this.status = 2
  }
  this.showPrice = function() {
    this.hideAll()
    this.pagePrice.style.display = 'table'
    this.status = 3
  }
  this.showType = function() {
    this.hideAll()
    this.pageType.style.display = 'table'
    this.status = 4
  }
  this.showList = function() {
    this.hideAll()
    this.pageList.style.display = 'block'
    this.status = 5
  }
}

/* Display Handle */

function Display (dom) {
  this.dom = dom
  
  this.is = function (string) {
    return this.dom.innerHTML === string
  }
  this.startsWith = function (string) {
    return String(this.dom.innerHTML).startsWith(string)
  }

  this.toInt = function() {
    return parseInt(this.dom.innerHTML)
  }
  this.getLength = function () {
    return this.dom.innerHTML.length
  }
  
  this.set = function (string) {
    this.dom.innerHTML = string  
  }
  this.append = function (string) {
    this.dom.innerHTML += string
  }
  this.setSuccess = function (type, price) {
    this.dom.innerHTML = '✓ ' + type + ' ' + price
  }
  this.erase = function () {
    this.dom.innerHTML = '0'
  }
}

/* Main Activity */

function clickNumber(n) {
  if (display.startsWith('✓') || display.startsWith('✗')) {
    display.set(n)
  } else if (display.startsWith('Send')) {
    // do nothing
  } else if (display.getLength() < 10) {
    if (display.is('0')) {
      if (n !== 0) {
        display.set(n)
      }
    } else {
      display.append(n)
    }
  }
}

function clickType(t) {
  var Record = Parse.Object.extend("Record")
  var record = new Record()
  
  record.set("price", display.toInt())
  record.set('type', t)
  record.set('date', new Date())
  record.set('createdBy', Parse.User.current())
  record.setACL(new Parse.ACL(Parse.User.current()))

  record.save(null, {
    success:function (record) {
      display.setSuccess(record.get("type"), record.get("price"))
    },
    error:function (record, error) {
      showErrorMessage(error)
    }
  })

  display.set("Sending...")
  pageController.showPrice()
}

function transformLogInPage() {
  document.getElementById('signUpBtn').innerHTML = 'Sign Up'
  document.getElementById('signUpBtn').onclick = function() {
    userController.signUp()
  }
  document.getElementById('logInBtn').style.display = 'none'
}

function clickSend() {
  pageController.showType()
}

function clickCancel() {
  display.erase()
  pageController.showPrice()
}

function resetDown() {
  document.getElementById('logOutKey').innerHTML = '掰'
  pressTimer = setTimeout(function(){userController.logOut()}, 1500)
}

function resetUp() {
  document.getElementById('logOutKey').innerHTML = 'C'
  clearTimeout(pressTimer)
}

function loadRecordList() {
  var Record = Parse.Object.extend('Record')
  var query = new Parse.Query(Record)
  query.ascending('date')
  document.getElementById("recordTable").innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;Searching...'
  query.find({
    success: function(records) {
      console.log(records)
      document.getElementById("recordTable").innerHTML = ''
      numOfRecord = records.length
      for (var i = 0; i < numOfRecord; i++) {

        appendToList(records[i].get("date"),records[i].get('type'), records[i].get('price'))
      }
    },
    error: function(records, error) {
      console.log(error.code + ', ' + error.message)
    }
  });
}

function to2Digit(string) {
  var s = String(string)
  if (s.length < 2) 
    return '0' + s
  return s
}

function appendToList(date, type, price) {
  
  var table = document.getElementById("recordTable")
  var row = table.insertRow(0)
  var cell1 = row.insertCell(-1)
  var cell2 = row.insertCell(-1)
  var cell3 = row.insertCell(-1)
  var cell4 = row.insertCell(-1)

  cell1.innerHTML = to2Digit(date.getMonth()+1) +'/' + to2Digit(date.getDate())
  cell2.innerHTML = to2Digit(date.getHours()) + ':' + to2Digit(date.getMinutes())
  cell3.innerHTML = type
  cell4.innerHTML = price
}

document.getElementById('display').onclick = function() {
  pageController.showList()
  loadRecordList()
}

window.onload = function() {
  // check parse login status
  userController.checkStatus()

  // show body after loaded
  document.body.style.opacity = 1
}