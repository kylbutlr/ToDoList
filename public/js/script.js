let currentTheme
let todos = []
const $input = document.querySelector("#input")
const $list = document.querySelector("#list")
const $date = document.querySelector("#date")
const $time = document.querySelector("#time")
const $key = document.querySelector("#key")
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const themes = {
    light: {
        headerClass: 'header-light',
        bodyClass: 'body-light',
        containerClass: 'container-light',
        formDivClass: 'form-div-light',
        listDivClass: 'list-div-light',
        buttonClass: 'button-light',
        textareaClass: 'textarea-light',
        clearDivClass: 'clear-div-light',
        clearBtnDivClass: 'clear-btn-div-light',
        themeDivClass: 'theme-div-light',
        themeBtnDivClass: 'theme-btn-div-light',
        h2Class: 'h2-light'
    },
    default: {
        headerClass: 'header-default',
        bodyClass: 'body-default',
        containerClass: 'container-default',
        formDivClass: 'form-div-default',
        listDivClass: 'list-div-default',
        buttonClass: 'button-default',
        textareaClass: 'textarea-default',
        clearDivClass: 'clear-div-default',
        clearBtnDivClass: 'clear-btn-div-default',
        themeDivClass: 'theme-div-default',
        themeBtnDivClass: 'theme-btn-div-default',
        h2Class: 'h2-default'
    },
    dark: {
        headerClass: 'header-dark',
        bodyClass: 'body-dark',
        containerClass: 'container-dark',
        formDivClass: 'form-div-dark',
        listDivClass: 'list-div-dark',
        buttonClass: 'button-dark',
        textareaClass: 'textarea-dark',
        clearDivClass: 'clear-div-dark',
        clearBtnDivClass: 'clear-btn-div-dark',
        themeDivClass: 'theme-div-dark',
        themeBtnDivClass: 'theme-btn-div-dark',
        h2Class: 'h2-dark'
    }
}

function getSavedTheme() {
    currentTheme = JSON.parse(window.localStorage.getItem("todoTheme"))
    if (!currentTheme) {
        applyTheme("default")
        window.localStorage.setItem("todoTheme", JSON.stringify("default"))
    }
    else {
        applyTheme(currentTheme)
    }
}

function applyTheme(theme) {
    const themeList = Object.keys(themes)
    for (i=0;i<themeList.length;i++) {
        $(".header").removeClass("header-"+themeList[i])
        $("body").removeClass("body-"+themeList[i])
        $(".container").removeClass("container-"+themeList[i])
        $(".form-div").removeClass("form-div-"+themeList[i])
        $(".form-btn-div").removeClass("form-btn-div-"+themeList[i])
        $(".theme-div").removeClass("theme-div-"+themeList[i])
        $(".list-div").removeClass("list-div-"+themeList[i])
        $(".button").removeClass("button-"+themeList[i])
        $(".textarea").removeClass("textarea-"+themeList[i])
        $(".clear-div").removeClass("clear-div-"+themeList[i])
        $(".clear-btn-div").removeClass("clear-btn-div-"+themeList[i])
        $(".theme-div").removeClass("theme-div-"+themeList[i])
        $(".theme-btn-div").removeClass("theme-btn-div-"+themeList[i])
        $("h2").removeClass("h2-"+themeList[i])
    }
    $(".header").addClass("header-"+theme)
    $("body").addClass("body-"+theme)
    $(".container").addClass("container-"+theme)
    $(".form-div").addClass("form-div-"+theme)
    $(".form-btn-div").addClass("form-btn-div-"+theme)
    $(".theme-div").addClass("theme-div-"+theme)
    $(".list-div").addClass("list-div-"+theme)
    $(".button").addClass("button-"+theme)
    $(".textarea").addClass("textarea-"+theme)
    $(".clear-div").addClass("clear-div-"+theme)
    $(".clear-btn-div").addClass("clear-btn-div-"+theme)
    $(".theme-div").addClass("theme-div-"+theme)
    $(".theme-btn-div").addClass("theme-btn-div-"+theme)
    $("h2").addClass("h2-"+theme)
}

function getSavedList() {
    $.get('http://localhost:3000', (data) => { 
        todos = data.todos
        if (todos.length>0) {
            $list.innerHTML = ""
            for (let i=0;i<todos.length;i++) {
                todos[i].key = i
                renderTodo(todos[i])
            }
        }
        else {
            $list.innerHTML = ""
            todos = []
        }
    },"JSON")
}

const onFormSubmit = (e) => {
    e.preventDefault()
    if ($input.value === " ") {
        alert("New item must have a name.")
        $input.value = ""
        $input.focus()
    }
    else {
        let todo = {}
        const time = $time.value
        if (time.length>0) {
            todo = {"text": $input.value, "time": getAMPM($time.value), "realtime": $time.value, "date": $date.value, "done": "false"}
        }
        else {
            todo = {"text": $input.value, "realtime": $time.value, "date": $date.value, "done": "false"}
        }
        if ($key.value.length > 0){
          $.ajax({
              url: 'http://localhost:3000/todos',
              method: 'PUT',
              data: todos,
              dataType: 'JSON',
              success: function() {
                  console.log(todos)
              }
          })
          $.get('http://localhost:3000', (data) => { 
              todos = data.todos
              $list.innerHTML = ""
              for (let i=0;i<todos.length-1;i++) {
                  renderTodo(todos[i])
              }
              const newTodoKey = todos[todos.length-1].key
              renderTodo(todos[newTodoKey], newTodoKey)
          },"JSON")
        }
        else {
          $.post('http://localhost:3000/todos', todo, (data) => console.log(data))
          $.get('http://localhost:3000', (data) => { 
              todos = data.todos
              $list.innerHTML = ""
              for (let i=0;i<todos.length-1;i++) {
                  renderTodo(todos[i])
              }
              const newTodoKey = todos[todos.length-1].key
              renderTodo(todos[newTodoKey], newTodoKey)
          },"JSON")
        }
        $input.value = ""
        $time.value = "12:00"
        $date.valueAsDate = getDateObject(new Date())
        $key.value = ""
        $input.focus()
    }
}

function renderTodo(todo, newTodoKey) {
    const newList = document.createElement("li")
    const h3 = document.createElement("h3")
    const dateObject = new Date(todo.date)
    const timeObject = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000)
    const formattedDate =  days[timeObject.getDay()] + ", " + months[timeObject.getMonth()] + " " + timeObject.getDate()
    let currentKey;
    if (newTodoKey === todos.length-1){
        console.log("A", newTodoKey)
        currentKey = newTodoKey
    }
    else if (newTodoKey >= 0){
        console.log("B", newTodoKey)
        currentKey = newTodoKey
    }
    else {
        console.log("C", todo.key)
        currentKey = todo.key
    }
    if (!todo.time && todo.date) {
        h3.textContent = todo.text + " (by " + formattedDate + ")"
    }
    else if (todo.time && !todo.date) {
        h3.textContent = todo.text + " (by " + todo.time + ")"
    }
    else if (todo.time && todo.date) {
        h3.textContent = todo.text + " (by " + todo.time + " on " + formattedDate + ")"
    }
    else {
        h3.textContent = todo.text
    }
    h3.addEventListener("click", onListItemClick)
    newList.appendChild(h3)
    newList.key = currentKey
    newList.appendChild(createElementEditButton(currentKey))
    newList.appendChild(createElementDeleteButton(currentKey))
    newList.insertBefore(createElementCheckbox(todo, currentKey), newList.childNodes[0])
    if (todo.done === "true") {
        newList.classList.add("checked")
    }
    if (newTodoKey){
        newList.classList.add("new-post")
        setTimeout(function() {
            newList.classList.add("post-visible")
        })
    }
    $list.appendChild(newList)
}

function getDateObject(date) {
    const dateObject = new Date(date)
    const timeObject = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000)
    return timeObject
}

function getAMPM(time) {
    let [h,m] = time.split(":")
    let ampm
    if (0 < h && h < 10) {
        ampm = "am"
        h = h.substr(1)
    }
    else if (h == 12) {
        ampm = "pm"
        h = 12
    }
    else if (12 < h && h < 24) {
        ampm = "pm"
        h -= 12
    }   
    else {
        ampm = "am"
        h = 12
    }
    return (h + ":" + m + " " + ampm)
}

const onClearClick = (e) => {
    //NEEDS TO DELETE ALL FROM SERVER
    e.preventDefault()
    if ($list.childElementCount>0) {
        for (i=0;i<$list.childElementCount;i++) {
            $list.childNodes[i].classList.add("post-delete")
        }
        setTimeout(function() {
            $list.innerHTML = ""
        }, 250)
    }
    else {
        $list.innerHTML = ""
    }
    todos = []
    key = 0
}

const onClearLSClick = (e) => {
    //WILL REMOVE THIS BUTTON
    e.preventDefault()
    $list.innerHTML = ""
    todos = []
    key = 0
    window.localStorage.clear()
    window.location.reload()
}

function createElementEditButton(key) {
    const editButton = document.createElement("button")
    editButton.dataset.key = key
    editButton.className = "edit-button button"
    editButton.textContent = "Edit"
    editButton.addEventListener("click", onEditButtonClick)
    return editButton
}

function onEditButtonClick(e) {
    e.preventDefault()
    const t = todos.findIndex(x => x.key == e.target.dataset.key)
    $input.value = todos[t].text
    $time.value = todos[t].realtime
    $date.value = todos[t].date
    $key.value = todos[t].key
    $("#cancelButton").show()
    $("#addButton").addClass("edit")
    $("#addButton").text("Update Item")
    e.target.parentNode.classList.add("post-delete")
    $input.focus()
    checkInput(t)
    setTimeout(function() {
        e.target.parentNode.remove()
    }, 250)
}

function createElementDeleteButton(key) {
    const deleteButton = document.createElement("button")
    deleteButton.dataset.key = key
    deleteButton.className = "delete-button button"
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", onDeleteButtonClick)
    return deleteButton
}

function onDeleteButtonClick(e) {
    //NEEDS TO DELETE ONE FROM SERVER
    e.preventDefault()
    let target = todos.findIndex(x => x.key == e.target.dataset.key)
    todos.splice(target, 1)
    e.target.parentNode.classList.add("post-delete")
    setTimeout(function() {
        e.target.parentNode.remove()
    }, 250)
}

function createElementCheckbox(todo, key) {
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "check-box"
    checkbox.dataset.key = key
    checkbox.id = "cb"+key
    checkbox.addEventListener("click", onCheckboxClick)
    if (todo.done === "true") {
        checkbox.checked = true
    }
    else { 
        checkbox.checked = false
    }
    return checkbox
}

function onCheckboxClick(e) {
    const target = todos.findIndex(x => x.key == e.target.dataset.key)
    if (e.target.parentNode.classList.contains("checked")) {
        e.target.parentNode.classList.remove("checked")
        e.target.checked = false
        todos[target].done = "false"
    }
    else {
        e.target.parentNode.classList.add("checked")
        e.target.checked = true
        todos[target].done = "true"
    }
}

function onListItemClick(e) {
    const tkey = e.target.parentNode.children[0].dataset.key
    $("#cb"+tkey).trigger("click")
}

function checkInput(key) {
    if (key != undefined) {
        $("#addButton").stop().animate({opacity:1})
    }
    if (!$("#input").val() || key != undefined) {
        if ($("#input").is(":active")||$("#time").is(":active")||$("#date").is(":active")||$("#addButton").is(":active")) {}
        else {
            $("#date").stop().animate({top:-65}, function() {
                $("#time").stop().animate({top:-35}, function() {
                    $("#input").css("border-radius", "10px")
                })
            })
        }
    }
    else {
        $("#input").css("border-radius", "10px 10px 0 0")
        $("#time").stop().animate({top:0}, function() {
            $("#date").stop().animate({top:0})
        })
    }
}

$time.value = "12:00"
$date.valueAsDate = getDateObject(new Date())
form.addEventListener("submit", onFormSubmit, false)
clearList.addEventListener("click", onClearClick, false)
clearLS.addEventListener("click", onClearLSClick, false)
getSavedList()
getSavedTheme()

$(function() {
    $("#cancelButton").hide()
    $(".container").hide().delay(500).slideToggle(1000)
    $(".container-glass").hide().delay(500).slideToggle(1000)
    $(".form-div").hide().delay(500).slideToggle(1000)
    $(".list-div").hide().delay(500).slideToggle(1000)
    $(".header").click(function(e) {
        $(".container").slideToggle(1000)
        $(".container-glass").slideToggle(1000)
        $(".form-div").slideToggle(1000)
        $(".list-div").slideToggle(1000)
    })

    $("#time").stop().animate({top:-35})
    $("#date").stop().animate({top:-65})
    $("#addButton").stop().animate({opacity:0.25})
    $("#input").focus(function(e) {
        $("#input").css("border-radius", "10px 10px 0 0")
        $("#time").stop().animate({top:0}, function() {
            $("#date").stop().animate({top:0})
        })
    })
    
    $("#input").on("change paste cut input", function() {
        if (!$.trim(this.value).length) {
            $("#addButton").stop().animate({opacity:0.25})
        }
        else {
            $("#addButton").stop().animate({opacity:1})
        }
    })

    $(".textarea").blur(function() {
        checkInput()
    })

    $("#date").change(function() {
        const date = getDateObject(this.value)
        const now = getDateObject(new Date())
        if (date < now) {
            alert("New item must have a future date (or no date).")
            this.valueAsDate = now
            this.focus()
        }
    }) 

    $(".clear-div").hover(function(e){
        $("#clearList").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $("#clearLS").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $(".clear-div").stop().animate({
            bottom: e.type=="mouseenter" ? -10 : -46
        }, 500)
        $(".clear-div-glass").stop().animate({
            top: e.type=="mouseenter" ? 10 : 46
        }, 500)
    })

    $(".theme-div").hover(function(e){
        $("#theme1").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $("#theme2").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $("#theme3").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $(".theme-div").stop().animate({
            bottom: e.type=="mouseenter" ? -10 : -46
        }, 500)
        $(".theme-div-glass").stop().animate({
            top: e.type=="mouseenter" ? 10 : 46
        }, 500)
    })

    $("#theme1").click(function(e) {
        const themeName = "light"
        applyTheme(themeName)
        currentTheme = themeName
        window.localStorage.setItem("todoTheme", JSON.stringify(themeName))
    })

    $("#theme2").click(function(e) {
        const themeName = "default"
        applyTheme(themeName)
        currentTheme = themeName
        window.localStorage.setItem("todoTheme", JSON.stringify(themeName))
    })

    $("#theme3").click(function(e) {
        const themeName = "dark"
        applyTheme(themeName)
        currentTheme = themeName
        window.localStorage.setItem("todoTheme", JSON.stringify(themeName))
    })
})