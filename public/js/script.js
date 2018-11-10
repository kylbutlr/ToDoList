$(function() {
    let currentTheme = undefined
    let data = []
    let key = undefined
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
            formBtnDivClass: 'form-btn-div-light',
            themeDivClass: 'theme-div-light',
            listDivClass: 'list-div-light',
            buttonClass: 'button-light',
            textareaClass: 'textarea-light',
            devDivClass: 'dev-div-light',
            devBtnDivClass: 'dev-btn-div-light'
        },
        default: {
            headerClass: 'header-default',
            bodyClass: 'body-default',
            containerClass: 'container-default',
            formDivClass: 'form-div-default',
            formBtnDivClass: 'form-btn-div-default',
            themeDivClass: 'theme-div-default',
            listDivClass: 'list-div-default',
            buttonClass: 'button-default',
            textareaClass: 'textarea-default',
            devDivClass: 'dev-div-default',
            devBtnDivClass: 'dev-btn-div-default'
        },
        dark: {
            headerClass: 'header-dark',
            bodyClass: 'body-dark',
            containerClass: 'container-dark',
            formDivClass: 'form-div-dark',
            formBtnDivClass: 'form-btn-div-dark',
            themeDivClass: 'theme-div-dark',
            listDivClass: 'list-div-dark',
            buttonClass: 'button-dark',
            textareaClass: 'textarea-dark',
            devDivClass: 'dev-div-dark',
            devBtnDivClass: 'dev-btn-div-dark'
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
        const keys = Object.keys(themes)
        for (i=0;i<keys.length;i++) {
            $(".header").removeClass("header-"+keys[i])
            $("body").removeClass("body-"+keys[i])
            $(".container").removeClass("container-"+keys[i])
            $(".form-div").removeClass("form-div-"+keys[i])
            $(".form-btn-div").removeClass("form-btn-div-"+keys[i])
            $(".theme-div").removeClass("theme-div-"+keys[i])
            $(".list-div").removeClass("list-div-"+keys[i])
            $(".button").removeClass("button-"+keys[i])
            $(".textarea").removeClass("textarea-"+keys[i])
            $(".dev-div").removeClass("dev-div-"+keys[i])
            $(".dev-btn-div").removeClass("dev-btn-div-"+keys[i])
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
        $(".dev-div").addClass("dev-div-"+theme)
        $(".dev-btn-div").addClass("dev-btn-div-"+theme)
    }

    function saveList() {
        window.localStorage.setItem("tododata", JSON.stringify(data))
    }

    function getSavedList() {
        data = JSON.parse(window.localStorage.getItem("tododata"))
        if (!data) {
            data = []
            const dflt1 = {"key": 0, "text": "Delete this entry", "realtime": "", "date": $date.value, "done": true}
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
        const dateObject = new Date(todo.date)
        const timeObject = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000)
        const formattedDate =  days[timeObject.getDay()] + ", " + months[timeObject.getMonth()] + " " + timeObject.getDate()
        if (!todo.time && todo.date) {
            newList.textContent = todo.text + " (by " + formattedDate + ")"
        }
        else if (todo.time && !todo.date) {
            newList.textContent = todo.text + " (by " + todo.time + ")"
        }
        else if (todo.time && todo.date) {
            newList.textContent = todo.text + " (by " + todo.time + " on " + formattedDate + ")"
        }
        else {
            newList.textContent = todo.text
        }
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
            alert("Entry must have a name.")
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
            $date.valueAsDate = getDateObject(new Date)
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
        editButton.className = "edit-button button button-"+currentTheme
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
        $input.select()
        setTimeout(function() {
            e.target.parentNode.remove()
        }, 250)
    }

    function createElementDeleteButton(key) {
        const deleteButton = document.createElement("button")
        deleteButton.dataset.key = key
        deleteButton.className = "delete-button button button-"+currentTheme
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

    $time.value = "12:00"
    $date.valueAsDate = getDateObject(new Date)
    form.addEventListener("submit", onFormSubmit, false)
    clearList.addEventListener("click", onClearClick, false)
    clearLS.addEventListener("click", onClearLSClick, false)
    getSavedList()
    getSavedTheme()

    $("#date").change(function() {
        const date = getDateObject(this.value)
        const now = getDateObject(new Date)
        if (date < now) {
            alert("Entry must have a future date (or no date).")
            this.valueAsDate = now
            this.focus()
        }
    })    

    $(".container").hide().delay(500).slideToggle(1000)
    $(".container-glass").hide().delay(500).slideToggle(1000)
    $(".form-div").hide().delay(500).slideToggle(1000)
    $(".form-btn-div").hide().delay(500).slideToggle(1000)
    $(".list-div").hide().delay(500).slideToggle(1000)
    $(".theme-div").hide().delay(500).slideToggle(1000)
    $(".header").click(function(e) {
        $(".container").slideToggle(1000)
        $(".container-glass").slideToggle(1000)
        $(".form-div").slideToggle(1000)
        $(".form-btn-div").slideToggle(1000)
        $(".list-div").slideToggle(1000)
        $(".theme-div").slideToggle(1000)
    })

    $("#time").hide()
    $("#date").hide()
    $("#addToList").hide()
    $("#input").focus(function(e) {
        $("#input").css("border-radius", "10px 10px 0 0")
        $("#time").slideDown(250, function() {
        $("#date").slideDown(250, function () {
        $("#addToList").slideDown(250)})})
    })
    $("#input").blur(function(e) {
        $("#input").css("border-radius", "10px")
        $("#addToList").slideUp(250, function () {
        $("#date").slideUp(250, function () {
        $("#time").slideUp(250)})})
    })

    $(".dev-div").hover(function(e){
        $("#clearLS").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250)
        $(".dev-div").stop().animate({
            bottom: e.type=="mouseenter" ? -15 : -50
        }, 500)
        $(".dev-div-glass").stop().animate({
            top: e.type=="mouseenter" ? 15 : 50
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