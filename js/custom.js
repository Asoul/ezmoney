
Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

var typeTable = document.getElementById('typeTable')
var display = new Display(document.getElementById("display"))

/* Error Message */

function showErrorMessage(error) {
  document.getElementById('msgDivCode').innerHTML = error.code
  document.getElementById('msgDivContent').innerHTML = error.message
  document.getElementById('msgDiv').style.display = 'block'
  console.log('[' + error.code + '], ' + error.message)
}

function closeMsgDiv() {
  setScreen('0')
  document.getElementById('msgDiv').style.display = 'none'
}

/* Login */

document.getElementById('password').onkeydown = function(event) {
  if (event.keyCode == 13) {
    logIn()
  }
}

function logIn() {
  username = document.getElementById('username').value
  password = document.getElementById('password').value

  Parse.User.logIn(username, password, {
    success: function(user) {
      afterLogin()
    },
    error: function(user, error) {
      signUpAndLogIn(username, password)
    }
  })
}

function signUpAndLogIn(username, password) {
  
  var user = new Parse.User()
  user.set('username', username)
  user.set('password', password)
  user.set('email', username)

  user.signUp(null, {
    success: function(user) {
      afterLogin()
    },
    error: function(user, error) {
      showErrorMessage(error)
    }
  })
}

function afterLogin() {
  document.getElementById('loginDiv').style.display = 'none'
}

/* Display Handle */

function Display (dom) {
  this.dom = dom
  this.set = function (string) {
    this.dom.innerHTML = string  
  }
  this.startsWith = function (string) {
    return String(this.dom.innerHTML).startsWith(string)
  }
  this.append = function (string) {
    this.dom.innerHTML += string
  }
  this.getLength = function () {
    return this.dom.innerHTML.length
  }
  this.toInt = function() {
    return parseInt(this.dom.innerHTML)
  }
  this.is = function (string) {
    return this.dom.innerHTML === string
  }
  this.setSuccess = function (type, price) {
    this.dom.innerHTML = '✓ ' + type + ' ' + price
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
  // record.setACL(new Parse.ACL(Parse.User.current()))
  record.set('createdBy', Parse.User.current())

  record.save(null, {
    success:function (record) {
      display.setSuccess(record.get("type"), record.get("price"))
    },
    error:function (record, error) {
      showErrorMessage(error)
    }
  })

  setScreen("Sending...")
  typeTable.style.display = 'none'
}

function clickSend() {
  typeTable.style.display = 'block'
}

function clickCancel() {
  typeTable.style.display = 'none'
  setScreen('0')
}

window.onload = function() {
  // check parse login status
  var currentUser = Parse.User.current()
  if (currentUser) {
    console.log('user logged in')
    Parse.User.logOut()
  } else {
    console.log('user not log in yet')
  }

  // set table size
  table = document.getElementsByTagName('table')[0]
  ;(function(height, width){
    console.log(width + ', ' + height)
  })(table.clientHeight, table.clientWidth)

  // show body after loaded
  document.body.style.opacity = 1
}