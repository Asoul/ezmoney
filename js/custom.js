
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
  pageController.showPrice()
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
        this.signUpAndLogIn(username, password)
        this.status = 0
      }
    })
  }

  this.logOut = function() {
    Parse.User.logOut()
    this.status = 0
    pageController.showLogIn()
  }

  this.signUpAndLogIn = function() {
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

  this.getStatus = function() {
    return this.status
  }

  this.reload = function() {
    switch (this.status) {
      case 1:
        this.showLogIn()
      break
      case 2:
        this.showMsg()
      break
      case 3:
        this.showPrice()
      break
      case 4:
        this.showType()
      break
      default:
        this.showLogIn()
    }
  }

  this.hideAll = function() {
    this.pageLogIn.style.display = 'none'
    this.pageMsg.style.display = 'none'
    this.pagePrice.style.display = 'none'
    this.pageType.style.display = 'none'
  }
  this.showLogIn = function() {
    this.hideAll()
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

function resizeCSS() {
  var height = window.innerHeight
  var width = window.innerWidth

  if (height / width > 1) {
    // Cell phone
    var tableSpacing = parseInt(width / 25)
  } else {
    // PC
    var tableSpacing = parseInt(height / 20)
  }

  var tdWidth = parseInt((width - 4 * tableSpacing)/3)
  var tdHeight = parseInt((height - 6 * tableSpacing)/5)

  contentWidth = tdWidth * 3 + tableSpacing * 4
  contentHeight = tdHeight * 5 + tableSpacing * 6
  borderRadius = Math.round(tableSpacing / 4)

  var tables = document.getElementsByTagName('table')
  
  numOfTable = tables.length
  for (var i = 0; i < numOfTable; i++) {
    tables[i].setAttribute('style',
      'border-spacing: ' + tableSpacing + 'px;' + 
      'top: ' + Math.round((height - contentHeight)/2) + 'px;' +
      'left: ' + Math.round((width - contentWidth)/2) + 'px;'
    )
  }

  var tds = document.getElementsByTagName('td')

  numOfTd = tds.length
  for (var i = 0; i < numOfTd; i++) {
    tds[i].setAttribute('style',
      'width: ' + tdWidth + 'px;' + 
      'height: ' + tdHeight + 'px;' +
      'border-radius: ' + borderRadius + 'px;' +
      '-moz-border-radius: ' + borderRadius + 'px;' +
      '-webkit-border-radius: ' + borderRadius + 'px;'
    )
  }

  var fullDivs = document.getElementsByClassName('fullDiv')

  numOfFullDiv = fullDivs.length
  for (var i = 0; i < numOfFullDiv; i++) {
    fullDivs[i].setAttribute('style',
      'width: ' + contentWidth + 'px;' + 
      'height: ' + contentHeight + 'px;' +
      'top: ' + Math.round((height - contentHeight)/2) + 'px;' +
      'left: ' + Math.round((width - contentWidth)/2) + 'px;'
    )
  }

  pageController.reload()
}

window.onresize = function() {
  resizeCSS()
}

window.onload = function() {
  // resize everything
  resizeCSS()

  // check parse login status
  userController.checkStatus()

  // show body after loaded
  document.body.style.opacity = 1
}