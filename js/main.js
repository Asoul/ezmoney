/*
The MIT License (MIT)

Copyright (c) 2015 Asoul Yang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

Parse.initialize("xsnQLFaIBlCIfCYe9VY0Xtk3dXHaTccX8a7Eo9Ot", "AvveAFmdsVc3Il5ttxI8eKDf8P898LncIGjvHRMW")

var display = new Display(document.getElementById("display"))
var page = new PageController()
var user = new UserController()
var url = new Router()
var act = new ActivityController()

/* User Controller */
function UserController() {

  this.checkStatus = function() {
    var hash = window.location.hash.slice(1)

    if (Parse.User.current()) {
      if (hash == 'price') page.showPrice()
      else if (hash == 'signup') page.showSignUp()
      else if (hash == 'error') page.showError()
      else if (hash == 'type') page.showType()
      else if (hash == 'option') page.showOption()
      else if (hash == 'setting') page.showSetting()
      else if (hash == 'list') page.showList()
      else page.showPrice()
      
    } else {

      if (hash == 'signup') page.showSignUp()
      else if (hash == 'error') page.showError()
      else page.showLogIn()
    }
  }

  this.logIn = function(event) {
    event.preventDefault()
    var loginDiv = document.getElementById('logInDiv')
    var username = loginDiv.querySelector('input[type=text]').value
    var password = loginDiv.querySelector('input[type=password]').value

    Parse.User.logIn(username, password, {
      success: function(user) {
        url.toPrice()
      },
      error: function(user, error) {
        page.setError(error)
        url.toError()
      }
    })
  }

  this.logOut = function() {
    Parse.User.logOut()
    url.toHome()
  }

  this.signUp = function(event) {
    event.preventDefault()
    var signUpDiv = document.getElementById('signUpDiv')
    var username = signUpDiv.querySelector('input[type=text]').value
    var password = signUpDiv.querySelector('input[type=password]').value
    var email = signUpDiv.querySelector('input[type=email]').value

    var user = new Parse.User()
    user.set('username', username)
    user.set('password', password)
    user.set('email', email)

    user.signUp(null, {
      success: function(user) {
        url.toPrice()
      },
      error: function(user, error) {
        page.setError(error)
        url.toError()
      }
    })
  }
}

/* Page Controller */
function PageController() {

  this.statusEnum = {
    LOGIN: 0,
    SIGNUP: 1,
    ERRMSG: 2,
    PRICE: 3,
    TYPE: 4,
    OPTION: 5,
    LIST: 6,
    SETTING: 7
  }

  var status = this.statusEnum.LOGIN

  var title = document.getElementById('title')
  var titleBar = document.getElementById('titleBar')

  var pageMsg = document.getElementById('msgDiv')
  var msgCode = document.getElementById('msgCode')
  var msgContent = document.getElementById('msgContent')

  var pageLogIn = document.getElementById('logInDiv')
  var pageSignUp = document.getElementById('signUpDiv')
  var pagePrice = document.getElementById('priceDiv')
  var pageType = document.getElementById('typeDiv')
  var pageList = document.getElementById('listDiv')
  var pageOption = document.getElementById('optionDiv')
  var pageSetting = document.getElementById('settingDiv')

  var setTitle = function(string) {
    title.innerHTML = string
  }

  var hideAll = function() {
    titleBar.classList.remove('show')
    pageLogIn.style.display = 'none'
    pageSignUp.style.display = 'none'
    pageMsg.style.display = 'none'
    pagePrice.style.display = 'none'
    pageType.style.display = 'none'
    pageList.style.display = 'none'
    pageOption.style.display = 'none'
    pageSetting.style.display = 'none'
  }
  this.showLogIn = function() {
    hideAll()
  
    pageLogIn.style.display = 'block'
    this.status = this.statusEnum.LOGIN
  }
  this.showSignUp = function() {
    hideAll()
    setTitle("註冊新用戶")
    titleBar.classList.add('show')
    pageSignUp.style.display = 'block'
    this.status = this.statusEnum.SIGNUP
  }
  this.setError = function(error) {
    msgCode.innerHTML = error.code
    msgContent.innerHTML = error.message
  }
  this.showError = function() {
    hideAll()
    pageMsg.style.display = 'block'
    this.status = this.statusEnum.ERRMSG
  }
  this.showPrice = function() {
    hideAll()
    pagePrice.style.display = 'table'
    this.status = this.statusEnum.PRICE
  }
  this.showType = function() {
    hideAll()
    pageType.style.display = 'table'
    this.status = this.statusEnum.TYPE
  }
  this.showList = function() {

    function loadRecordList() {

      function appendToList(date, type, price) {
        
        function to2Digit(string) {
          var s = String(string)
          if (s.length < 2) {
            return '0' + s
          }
          return s
        }

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
      var Record = Parse.Object.extend('Record')
      var query = new Parse.Query(Record)
      query.descending('date')
      document.getElementById("recordTable").innerHTML = ""
      document.getElementById("recordTableLoadingMessage").style.display = 'block'
      query.find({
        success: function(records) {
          document.getElementById("recordTableLoadingMessage").style.display = 'none'
          records.reverse().forEach(function (record) {
            appendToList(record.get("date"),record.get('type'), record.get('price'))
          })
        },
        error: function(records, error) {
          page.setError(error)
          url.toError()
        }
      })
    }
    hideAll()
    pageList.style.display = 'block'
    setTitle("歷史清單")
    titleBar.classList.add('show')
    loadRecordList()
    this.status = this.statusEnum.LIST
  }
  this.showOption = function() {
    hideAll()
    pageOption.style.display = 'table'
    setTitle("功能列")
    titleBar.classList.add('show')
    this.status = this.statusEnum.OPTION
  }
  this.showSetting = function() {
    function loadSetting() {
      document.getElementById("screenWidth").innerHTML = window.screen.width
      document.getElementById("screenHeight").innerHTML = window.screen.height
      document.getElementById("innerWidth").innerHTML = window.innerWidth
      document.getElementById("innerHeight").innerHTML = window.innerHeight
    }
    hideAll()
    pageSetting.style.display = 'block'
    setTitle("設定")
    titleBar.classList.add('show')
    this.status = this.statusEnum.SETTING
    loadSetting()
  }
}

/* Router */
function Router () {
  this.toHome = function() {
    window.location = ''
  }
  this.toSignUp = function() {
    window.location = '#signup'
  }
  this.toError = function() {
    window.location = '#error'
  }
  this.toPrice = function() {
    window.location = '#price'
  }
  this.toType = function() {
    window.location = '#type' 
  }
  this.toList = function() {
    window.location = '#list'
  }
  this.toOption = function() {
    window.location = '#option'
  }
  this.toSetting = function() {
    window.location = '#setting'
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

  this.value = function() {
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
  this.backspace = function() {
    if (this.is("0")) {
      // do nothing
    } else if (this.getLength() == 1) {
      this.set('0')
    } else {
      this.set(this.dom.innerHTML.slice(0, -1))
    }
  }
  this.setSuccess = function (type, price) {
    this.dom.innerHTML = '✓ ' + type + ' ' + price
  }
  this.erase = function () {
    this.set("0")
  }
}

/* Activity Controller */

function ActivityController() {

  this.pressKey = function (event) {
    key = event.keyCode

    if (key == 8) event.preventDefault()

    if (page.status == page.statusEnum.PRICE) {
      if (key >= 48 && key <= 57) {// number 0 ~ 9
        this.clickNumber(key-48)
      } else if (key == 27 || key == 67) {// ESC or c
        display.erase()
      } else if (key == 13) {// enter
        url.toType()
      } else if (key == 79) {// O
        url.toOption()
      } else if (key == 8) {// backspace
        display.backspace()
      }
    } else if (page.status == page.statusEnum.TYPE) {
      if (key == 27 || key == 67) {// ESC or c
        url.toPrice()
      } else if (key == 8) {// backspace
        window.history.back()
      }
    } else if (page.status == page.statusEnum.LIST) {
      if (key == 27 || key == 67) {// ESC or c
        url.toOption()
      } else if (key == 8) {// backspace
        window.history.back()
      }
    } else if (page.status == page.statusEnum.OPTION) {
      if (key == 8) {// backspace
        window.history.back()
      }
    } else if (page.status == page.statusEnum.SETTING) {
      if (key == 8) {// backspace
        window.history.back()
      }
    }
  }

  this.clickNumber = function (number) {

    if (display.startsWith('✓') || display.startsWith('✗')) {
      display.set(number)
    } else if (display.startsWith('Send')) {
      // do nothing
    } else if (display.getLength() < 7) {
      if (display.is('0')) {
        if (number !== 0) {
          display.set(number)
        }
      } else {
        display.append(number)
      }
    }
  }

  this.clickType = function(type) {
    var Record = Parse.Object.extend("Record")
    var record = new Record()
    
    record.set("price", display.value())
    record.set('type', type)
    record.set('date', new Date())
    record.set('createdBy', Parse.User.current())
    record.setACL(new Parse.ACL(Parse.User.current()))

    record.save(null, {
      success:function (record) {
        display.setSuccess(record.get("type"), record.get("price"))
      },
      error:function (record, error) {
        page.setError(error)
        url.toError()
      }
    })
    display.set("Sending...")
    window.history.back()
  }
}

window.onload = function() {

  // check parse login status
  user.checkStatus()

  // show body after loaded
  document.body.style.display = 'block'
}

window.onhashchange = function() {
  user.checkStatus()
}