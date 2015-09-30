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
var drawer = new Drawer()
var db = new ParseController()
var formatter = new CurrencyFormatter()

/* User Controller */
/* control user login, logout status */
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
      else if (hash == 'piechart') page.showPieChart()
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
/* Change the page based on state */
function PageController() {

  statusMap = this.statusMap = {
    LOGIN: 'logInDiv',
    SIGNUP: 'signUpDiv',
    MSG: 'msgDiv',
    PRICE: 'priceDiv',
    TYPE: 'typeDiv',
    OPTION: 'optionDiv',
    LIST: 'listDiv',
    SETTING: 'settingDiv',
    PIECHART: 'pieChartDiv'
  }

  this.status = statusMap.LOGIN

  var title = document.getElementById('title')
  var titleBar = document.getElementById('titleBar')

  var msgCode = document.getElementById('msgCode')
  var msgContent = document.getElementById('msgContent')

  var parent = this

  var changePage = function(newStatus, newTitle) {
    // Hide all Page
    titleBar.classList.remove('show')
    for (key in statusMap) {
      document.getElementById(statusMap[key]).style.display = 'none'
    }

    // Set title if needed
    if (typeof newTitle !== 'undefined') {
      title.innerHTML = newTitle
      titleBar.classList.add('show')
    }

    // Show the page want to change
    document.getElementById(newStatus).style.display = 'block'
    parent.status = newStatus
  }
  this.setError = function(error) {
    msgCode.innerHTML = error.code
    msgContent.innerHTML = error.message
  }

  this.showLogIn = function() {
    changePage(statusMap.LOGIN)
  }
  this.showSignUp = function() {
    changePage(statusMap.SIGNUP, "註冊新用戶")
  }
  this.showError = function() {
    changePage(statusMap.MSG)
  }
  this.showPrice = function() {
    changePage(statusMap.PRICE)
  }
  this.showType = function() {
    changePage(statusMap.TYPE)
  }
  this.showList = function() {

    function loadRecordList(records) {

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
      document.getElementById("recordTableLoadingMessage").style.display = 'none'
      records.reverse().forEach(function (record) {
        appendToList(record.get("date"), record.get('type'), record.get('price'))
      })
    }
    changePage(statusMap.LIST, "歷史清單")
    document.getElementById("recordTable").innerHTML = ""
    document.getElementById("recordTableLoadingMessage").style.display = 'block'
    db.getRecords(loadRecordList)
  }
  this.showOption = function() {
    changePage(statusMap.OPTION, "功能列")
  }
  this.showSetting = function() {
    function loadSetting() {
      document.getElementById("screenWidth").innerHTML = window.screen.width
      document.getElementById("screenHeight").innerHTML = window.screen.height
      document.getElementById("innerWidth").innerHTML = window.innerWidth
      document.getElementById("innerHeight").innerHTML = window.innerHeight
    }
    changePage(statusMap.SETTING, "設定")
    loadSetting()
  }
  this.showPieChart = function() {
    changePage(statusMap.PIECHART, "支出圓餅圖")
    act.generatePieChartData()
  }
}

/* Router */
/* route for window location */
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
  this.toPieChart = function() {
    window.location = '#piechart'
  }
}

/* Display Handler */
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
/* Control for keyboad input and mouse click */
function ActivityController() {

  this.pressKey = function (event) {
    key = event.keyCode

    if (page.status == page.statusMap.LOGIN) return// use default action
    if (key == 8) event.preventDefault()

    if (page.status == page.statusMap.PRICE) {
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
    } else if (key == 27 || key == 8) {// ESC or backspace
      window.history.back()
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
    db.saveRecord(type)
    display.set("Sending...")
    window.history.back()
  }

  this.generatePieChartData = function(start, end) {
    start = typeof start !== 'undefined' ? start : new Date(2000, 1, 1)
    end = typeof end !== 'undefined' ? end : new Date(2100, 1, 1)

    function dataLoaded (response) {
      function appendToList(index, percent, type, price) {
        
        var table = document.getElementById("pieChartList")
        var row = table.insertRow(-1)
        var cell1 = row.insertCell(-1)
        var cell2 = row.insertCell(-1)
        var cell3 = row.insertCell(-1)
        var cell4 = row.insertCell(-1)

        cell1.innerHTML = index + '.'
        cell2.innerHTML = Math.round(percent * 100) + '%'
        cell3.innerHTML = type
        cell4.innerHTML = formatter.format(price)
      }
      /* Sort by price */
      var sortedTypes = Object.keys(response.data).sort(function(a, b) {
        return response.data[b] - response.data[a]
      })
      var data = sortedTypes.map(function(type){
        return response.data[type]
      })

      /* Draw PieChart and Update Table*/
      drawer.loadPieChart(data)

      sortedTypes.forEach(function(type, index) {
        appendToList(index + 1, response.data[type]/response.sum, type, response.data[type])
      })
    }

    db.getTypeSum(start, end, dataLoaded)
  }
}

/* Canvas Drawer */
function Drawer() {
  var toRadians = function(degree) {
    return degree * Math.PI / 180
  }
  this.loadPieChart = function(data) {

    function drawSector(x, y, radius, startDegree, endDegree, color) {
      // Create Path
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x, y, radius, startDegree, endDegree)
      ctx.lineTo(x, y)
      ctx.closePath()

      // if not given color, use random color
      if (typeof color === 'undefined') {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      }

      // Fill Space
      ctx.fillStyle = color
      ctx.fill()
    }

    DEFAULT_COLOR = [
      '#E34D4C',
      '#E8EA4F',
      '#9DCE3F',
      '#4292CA',
      '#BF66EA',
      '#D44985',
      '#9997D3',
      '#6FC4F5',
      '#35A8A6'
    ]
    var canvas = document.getElementById('pieChartDiv').getElementsByTagName('canvas')[0]
    var ctx = canvas.getContext('2d')
    var radius = 250

    /* High Resolution Setting */
    canvas.width = 2 * radius
    canvas.height = 2 * radius

    /* Draw Sectors */

    var sum = data.reduce(function(__, _){return __ + _})
    var cumulativeRatio = -0.5 * Math.PI
    data.forEach(function(datum, index) {
      var ratio = (datum / sum) * (2 * Math.PI)
      drawSector(radius, radius, radius, cumulativeRatio, cumulativeRatio + ratio, DEFAULT_COLOR[index])
      cumulativeRatio += ratio
    })

    /* Draw Center */
    drawSector(radius, radius, radius * 0.6, 0, 2 * Math.PI, 'white')
    
    /* Write Word at center */
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = radius * 0.3 + "px arial";
    ctx.fillStyle = "black";
    ctx.fillText(formatter.format(sum), radius, radius);
  }
}

function ParseController () {

  var Record = Parse.Object.extend("Record")

  this.saveRecord = function(type) {
    
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
  }
  this.getRecords = function(callback) {

    var query = new Parse.Query(Record)

    query.descending('date')
    query.limit(20)

    return query.find({
      success: function(records) {
        callback(records)
      },
      error: function(records, error) {
        page.setError(error)
        url.toError()
      }
    })
  }
  this.getTypeSum = function(start, end, callback) {
    Parse.Cloud.run('getTypeSum', {
      'start': start,
      'end': end
    }, function(response) {
      callback(response)
    })
  }
}

function CurrencyFormatter () {
  this.format = function(string) {
    return "$" + string.toFixed(0).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    })
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