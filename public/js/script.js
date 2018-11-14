let currentTheme
let data = []
let key
const $input = document.querySelector("#input")
const $list = document.querySelector("#list")
const $date = document.querySelector("#date")
const $time = document.querySelector("#time")
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

function saveList() {
    window.localStorage.setItem("tododata", JSON.stringify(data))
}

function getSavedList() {
    data = JSON.parse(window.localStorage.getItem("tododata"))
    if (!data) {
        data = []
        const dflt1 = {"key": 0, "text": "Delete this item", "realtime": "", "date": $date.value, "done": true}
        const dflt2 = {"key": 1, "text": "Add more to my list", "realtime": "", "date": $date.value, "done": false}
        data.push(dflt1, dflt2)
        renderTodo(dflt1, 0)
        renderTodo(dflt2, 1)
        key = 2
        saveList()
    }
    else if (data.length>0) {
        for (let i=0;i<data.length;i++) {
            data[i].key = i
            renderTodo(data[i], i)
        }
        key = data[data.length - 1].key + 1
    }
    else {
        $list.innerHTML = ""
        data = []
        key = 0
    }
}

function renderTodo(todo, key) {
    const newList = document.createElement("li")
    const h3 = document.createElement("h3")
    const dateObject = new Date(todo.date)
    const timeObject = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000)
    const formattedDate =  days[timeObject.getDay()] + ", " + months[timeObject.getMonth()] + " " + timeObject.getDate()
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
    newList.key = key
    newList.appendChild(createElementEditButton(key))
    newList.appendChild(createElementDeleteButton(key))
    newList.insertBefore(createElementCheckbox(todo, key), newList.childNodes[0])
    if (todo.done === true) {
        newList.classList.add("checked")
    }
    newList.classList.add("new-post")
    $list.appendChild(newList)
    setTimeout(function() {
        newList.classList.add("post-visible")
    })
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
            todo = {"key": key, "text": $input.value, "time": getAMPM($time.value), "realtime": $time.value, "date": $date.value, "done": false}
        }
        else {
            todo = {"key": key, "text": $input.value, "realtime": $time.value, "date": $date.value, "done": false}
        }
        data.push(todo)
        renderTodo(todo, key)
        saveList()
        key++
        $input.value = ""
        $time.value = "12:00"
        $date.valueAsDate = getDateObject(new Date())
        $input.focus()
    }
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
    data = []
    key = 0
    saveList()
}

const onClearLSClick = (e) => {
    e.preventDefault()
    $list.innerHTML = ""
    data = []
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
    const t = data.findIndex(x => x.key == e.target.dataset.key)
    $input.value = data[t].text
    $time.value = data[t].realtime
    $date.value = data[t].date
    data.splice(t, 1)
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
    e.preventDefault()
    let target = data.findIndex(x => x.key == e.target.dataset.key)
    data.splice(target, 1)
    e.target.parentNode.classList.add("post-delete")
    setTimeout(function() {
        e.target.parentNode.remove()
    }, 250)
    saveList()
}

function createElementCheckbox(todo, key) {
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "check-box"
    checkbox.dataset.key = key
    checkbox.id = "cb"+key
    checkbox.addEventListener("click", onCheckboxClick)
    if (todo.done === true) {
        checkbox.checked = true
    }
    else { 
        checkbox.checked = false
    }
    return checkbox
}

function onCheckboxClick(e) {
    const target = data.findIndex(x => x.key == e.target.dataset.key)
    if (e.target.parentNode.classList.contains("checked")) {
        e.target.parentNode.classList.remove("checked")
        e.target.checked = false
        data[target].done = false
        saveList()
    }
    else {
        e.target.parentNode.classList.add("checked")
        e.target.checked = true
        data[target].done = true
        saveList()
    }
}

function onListItemClick(e) {
    const tkey = e.target.parentNode.children[0].dataset.key
    $("#cb"+tkey).trigger("click")
}

function checkInput(key) {
    if (key != undefined) {
        $("#addToList").stop().animate({opacity:1})
    }
    if (!$("#input").val() || key != undefined) {
        if ($("#input").is(":active")||$("#time").is(":active")||$("#date").is(":active")||$("#addToList").is(":active")) {}
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
    $.get('http://localhost:3000', (data) => console.log(data));

    $("#date").change(function() {
        const date = getDateObject(this.value)
        const now = getDateObject(new Date())
        if (date < now) {
            alert("New item must have a future date (or no date).")
            this.valueAsDate = now
            this.focus()
        }
    })    

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
    $("#addToList").stop().animate({opacity:0.25})
    $("#input").focus(function(e) {
        $("#input").css("border-radius", "10px 10px 0 0")
        $("#time").stop().animate({top:0}, function() {
            $("#date").stop().animate({top:0})
        })
    })
    $("#input").on("change paste cut input", function() {
        if (!$.trim(this.value).length) {
            $("#addToList").stop().animate({opacity:0.25})
        }
        else {
            $("#addToList").stop().animate({opacity:1})
        }
    })

    $(".textarea").blur(function() {
        checkInput()
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