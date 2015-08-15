
Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

var display = new Display(document.getElementById("display"))

var loginState = false

/* Error Message */

function showErrorMessage(error) {
  document.getElementById('msgDivCode').innerHTML = error.code
  document.getElementById('msgDivContent').innerHTML = error.message
  document.getElementById('msgDiv').style.display = 'block'
  console.log('[' + error.code + '], ' + error.message)
}

function closeMsgDiv() {
  display.erase()
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
  document.getElementById('typeTable').style.display = 'none'
}

function clickSend() {
  document.getElementById('typeTable').style.display = 'block'
}

function eraseDisplay() {
  display.erase()
}

function clickCancel() {
  document.getElementById('typeTable').style.display = 'none'
  display.erase()
}

window.onload = function() {
  // check parse login status
  var currentUser = Parse.User.current()
  if (currentUser) {
    afterLogin()
  }

  // set table size
  table = document.getElementsByTagName('table')[0]
  ;(function(height, width){
    console.log(width + ', ' + height)
  })(table.clientHeight, table.clientWidth)

  // show body after loaded
  document.body.style.opacity = 1
}