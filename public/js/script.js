$(function() {
    let theme
    const themes = {
        light: {
            headerClass: 'header-light',
            bodyClass: 'body-light',
            containerClass: 'container-light',
            formDivClass: 'form-div-light',
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
            themeDivClass: 'theme-div-dark',
            listDivClass: 'list-div-dark',
            buttonClass: 'button-dark',
            textareaClass: 'textarea-dark',
            devDivClass: 'dev-div-dark',
            devBtnDivClass: 'dev-btn-div-dark'
        }
    }
    $("#input").focus();
    $(".container").hide().delay(500).slideToggle(1000)
    $(".container-glass").hide().delay(500).slideToggle(1000)
    $(".form-div").hide().delay(500).slideToggle(1000)
    $(".list-div").hide().delay(500).slideToggle(1000)
    $(".theme-div").hide().delay(500).slideToggle(1000)
    $(".header").click(function(e) {
        $(".container").slideToggle(1000)
        $(".container-glass").slideToggle(1000)
        $(".form-div").slideToggle(1000)
        $(".list-div").slideToggle(1000)
        $(".theme-div").slideToggle(1000)
        $("#input").focus()
    });

    $(".dev-div").hover(function(e){
        $("#clsBtn").stop().animate({
            opacity: e.type=="mouseenter" ? 1 : 0.5
        }, 250);
        $(".dev-div").stop().animate({
            bottom: e.type=="mouseenter" ? 35 : 0
        }, 500);
        $(".dev-div-glass").stop().animate({
            top: e.type=="mouseenter" ? 10 : 45
        }, 500);
    });

    $("#date").change(function() {
        const date = getDate(this.value);
        const now = getDate(new Date)
        if (date < now) {
            alert("Entry must have a future date (or no date).");
            this.valueAsDate = now;
            this.focus();
        }
    });    

    function getTheme() {
        theme = JSON.parse(window.localStorage.getItem("todotheme"))
        if (!theme) {
            applyTheme("default")
        }
        else {
            applyTheme(theme)
        }
    }

    function applyTheme(theme) {
        const keys = Object.keys(themes);
        for (i=0;i<keys.length;i++) {
            $(".header").removeClass("header-"+keys[i])
            $("body").removeClass("body-"+keys[i])
            $(".container").removeClass("container-"+keys[i])
            $(".form-div").removeClass("form-div-"+keys[i])
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
        $(".theme-div").addClass("theme-div-"+theme)
        $(".list-div").addClass("list-div-"+theme)
        $(".button").addClass("button-"+theme)
        $(".textarea").addClass("textarea-"+theme)
        $(".dev-div").addClass("dev-div-"+theme)
        $(".dev-btn-div").addClass("dev-btn-div-"+theme)
    }


    $("#theme1").click(function(e) {
        applyTheme("light")
        window.localStorage.setItem("todotheme", JSON.stringify("light"));
    })

    $("#theme2").click(function(e) {
        applyTheme("default")
        window.localStorage.setItem("todotheme", JSON.stringify("default"));
    })

    $("#theme3").click(function(e) {
        applyTheme("dark")
        window.localStorage.setItem("todotheme", JSON.stringify("dark"));
    })

    
    let data = [];
    let key;
    const $input = document.querySelector("#input");
    const $list = document.querySelector("#list");
    const $date = document.querySelector("#date");
    const $time = document.querySelector("#time");
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formSubmit = (e) => {
        e.preventDefault();
        if ($input.value === " ") {
            alert("Entry must have a name.");
            $input.value = "";
            $input.focus();
        }
        else {
            let todo = {};
            const time = $time.value;
            if (time.length>0) {
                todo = {"key": key, "text": $input.value, "time": formatAMPM($time.value), "realtime": $time.value, "date": $date.value, "done": false};
            }
            else {
                todo = {"key": key, "text": $input.value, "realtime": $time.value, "date": $date.value, "done": false};
            }
            data.push(todo);
            renderTodo(todo, key);
            save();
            key++;
            $input.value = "";
            $time.value = "12:00";
            $date.valueAsDate = getDate(new Date);
        }
    }

    const clrClick = (e) => {
        e.preventDefault();
        if ($list.childElementCount>0) {
            for (i=0; i<$list.childElementCount; i++) {
                $list.childNodes[i].classList.add("post-delete");
            }
            setTimeout(function() {
                $list.innerHTML = "";
            }, 250);
        }
        else {
            $list.innerHTML = "";
        }
        data = [];
        key = 0;
        save();
    }

    const clrLS = (e) => {
        e.preventDefault();
        $list.innerHTML = "";
        data = [];
        key = 0;
        window.localStorage.clear();
        window.location.reload();
    }

    function formatAMPM(time) {
        let [h,m] = time.split(":");
        let ampm;
        if (0 < h && h < 10) {
            ampm = "am";
            h = h.substr(1);
        }
        else if (h == 12) {
            ampm = "pm";
            h = 12;
        }
        else if (12 < h && h < 24) {
            ampm = "pm";
            h -= 12;
        }   
        else {
            ampm = "am";
            h = 12;
        }
        return (h + ":" + m + " " + ampm);
    }

    function getDate(date) {
        const dateValue = new Date(date);
        const nowDate = new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60000);
        return nowDate;
    }

    function formatDate(date) {
        const dateValue = new Date(date);
        const nowDate = new Date(dateValue.getTime() + dateValue.getTimezoneOffset() * 60000);
        return days[nowDate.getDay()] + ", " + months[nowDate.getMonth()] + " " + nowDate.getDate();
    }

    function renderTodo(todo, key) {
        const newList = document.createElement("li");
        const formattedDate =  formatDate(new Date(todo.date));
        if (!todo.time && todo.date) {
            newList.textContent = todo.text + " (by " + formattedDate + ")";
        }
        else if (todo.time && !todo.date) {
            newList.textContent = todo.text + " (by " + todo.time + ")";
        }
        else if (todo.time && todo.date) {
            newList.textContent = todo.text + " (by " + todo.time + " on " + formattedDate + ")";
        }
        else {
            newList.textContent = todo.text;
        }
        newList.key = key;
        newList.appendChild(edtBtn(key));
        newList.appendChild(dltBtn(key));
        newList.insertBefore(checkbox(todo, key), newList.childNodes[0]);
        if (todo.done === true) {
            newList.classList.add("checked");
        }
        newList.classList.add("new-post");
        $list.appendChild(newList);
        setTimeout(function() {
            newList.classList.add("post-visible");
        });
    }

    function edtBtn(key) {
        const editB = document.createElement("button");
        editB.dataset.key = key;
        editB.className = "edit-button button button-"+theme;
        editB.textContent = "Edit";
        editB.addEventListener("click", editPost);
        return editB;
    }

    function editPost(e) {
        e.preventDefault();
        const t = data.findIndex(x => x.key == e.target.dataset.key);
        $input.value = data[t].text;
        $time.value = data[t].realtime;
        $date.value = data[t].date;
        data.splice(t, 1);
        e.target.parentNode.classList.add("post-delete");
        $input.select();
        setTimeout(function() {
            e.target.parentNode.remove();
        }, 250);
    }

    function checkbox(todo, key) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "check-box";
        checkbox.dataset.key = key;
        checkbox.addEventListener("click", checkPost)
        if (todo.done === true) {
            checkbox.checked = true;
        }
        else { 
            checkbox.checked = false;
        }
        return checkbox;
    }

    function checkPost(e) {
        const target = data.findIndex(x => x.key == e.target.dataset.key);
        if (e.target.parentNode.classList.contains("checked")) {
            e.target.parentNode.classList.remove("checked");
            e.target.checked = false;
            data[target].done = false;
            save();
        }
        else {
            e.target.parentNode.classList.add("checked");
            e.target.checked = true;
            data[target].done = true;
            save();
        }
    }

    function deletePost(e) {
        e.preventDefault();
        let target = data.findIndex(x => x.key == e.target.dataset.key);
        data.splice(target, 1);
        e.target.parentNode.classList.add("post-delete");
        setTimeout(function() {
            e.target.parentNode.remove();
        }, 250);
        save();
    }

    function dltBtn(key) {
        const dltBtn = document.createElement("button");
        dltBtn.dataset.key = key;
        dltBtn.className = "delete-button button button-"+theme;
        dltBtn.textContent = "Delete";
        dltBtn.addEventListener("click", deletePost);
        return dltBtn;
    }

    function save() {
        window.localStorage.setItem("tododata", JSON.stringify(data));
    }

    function getSaved() {
        data = JSON.parse(window.localStorage.getItem("tododata"));
        if (!data) {
            data = [];
            const dflt1 = {"key": 0, "text": "Delete this entry", "realtime": "", "date": $date.value, "done": true};
            const dflt2 = {"key": 1, "text": "Add more to my list", "realtime": "", "date": $date.value, "done": false};
            data.push(dflt1, dflt2);
            renderTodo(dflt1, 0);
            renderTodo(dflt2, 1);
            key = 2;
            save();
        }
        else if (data.length>0) {
            for (let i=0; i<data.length; i++) {
                data[i].key = i;
                renderTodo(data[i], i);
            }
            key = data[data.length - 1].key + 1;
        }
        else {
            $list.innerHTML = "";
            data = [];
            key = 0;
        }
    }

    $time.value = "12:00";
    $date.valueAsDate = getDate(new Date);
    form.addEventListener("submit", formSubmit, false);
    clrBtn.addEventListener("click", clrClick, false);
    clsBtn.addEventListener("click", clrLS, false);
    getSaved();
    getTheme()
});