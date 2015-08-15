
Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

var typeTable = document.getElementById('typeTable')
var screenNumber = document.getElementById("screenNumber")

/* Login */

function showErrorMessage(error) {
  console.log("Error: " + error.code + " " + error.message)
}

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

  user.signUp({
    username: username,
    password: password,
    email: username
  }, {
    success: function(user) {
      afterLogin()
    },
    error: function(user, error) {
      showErrorMessage(error)
    }
  })
}

function afterLogin() {

}

/* Main Activity */

function clickNumber(n) {
  if (String(screenNumber.innerHTML).startsWith('✓') || String(screenNumber.innerHTML).startsWith('✗')) {
    screenNumber.innerHTML = n
  } else if (String(screenNumber.innerHTML).startsWith('Send')) {
    // do nothing
  } else if (screenNumber.innerHTML.length < 10) {
    if (screenNumber.innerHTML === '0') {
      if (n !== 0) {
        screenNumber.innerHTML = n
      }
    } else {
      screenNumber.innerHTML += n
    }
  }
}

function clickType(t) {
  var Record = Parse.Object.extend("Record")
  var record = new Record()
  record.save({
    price: parseInt(screenNumber.innerHTML),
    type: t,
    date: new Date()
  }, {
    success:function (record) {
      screenNumber.innerHTML = '✓ ' + record.get("type") + ' ' + record.get("price")
    },
    error:function (record, error) {
      screenNumber.innerHTML = '✗ Error Q_Q'
    }
  })

  screenNumber.innerHTML = "Sending..."
  typeTable.style.display = 'none'
}

function clickSend() {
  typeTable.style.display = 'block'
}

function clickCancel() {
  typeTable.style.display = 'none'
  screenNumber.innerHTML = '0'
}

function eraseNumber() {
  screenNumber.innerHTML = '0'
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