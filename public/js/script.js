$(function() {
    let theme = JSON.parse(window.localStorage.getItem("todotheme"));
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

    $("#theme1").click(function(e) {
        $(".header").removeClass("header-dark").removeClass("header-default").addClass("header-light");
        $("body").removeClass("body-dark").removeClass("body-default").addClass("body-light");
        $(".container").removeClass("container-dark").removeClass("container-default").addClass("container-light");
        $(".form-div").removeClass("form-div-dark").removeClass("form-div-default").addClass("form-div-light");
        $(".theme-div").removeClass("theme-div-dark").removeClass("theme-div-default").addClass("theme-div-light");
        $(".list-div").removeClass("list-div-dark").removeClass("list-div-default").addClass("list-div-light");
        $(".button").removeClass("button-dark").removeClass("button-default").addClass("button-light");
        $(".ta").removeClass("ta-dark").removeClass("ta-default").addClass("ta-light");
        $(".dev-div").removeClass("dev-div-dark").removeClass("dev-div-default").addClass("dev-div-light");
        $(".dev-btn-div").removeClass("dev-btn-div-dark").removeClass("dev-btn-div-default").addClass("dev-btn-div-light");
        theme = "light";
        window.localStorage.setItem("todotheme", JSON.stringify(theme));
    })

    $("#theme2").click(function(e) {
        $(".header").removeClass("header-light").removeClass("header-dark").addClass("header-default");
        $("body").removeClass("body-light").removeClass("body-dark").addClass("body-default");
        $(".container").removeClass("container-light").removeClass("container-dark").addClass("container-default");
        $(".form-div").removeClass("form-div-light").removeClass("form-div-dark").addClass("form-div-default");
        $(".theme-div").removeClass("theme-div-light").removeClass("theme-div-dark").addClass("theme-div-default");
        $(".list-div").removeClass("list-div-light").removeClass("list-div-dark").addClass("list-div-default");
        $(".button").removeClass("button-light").removeClass("button-dark").addClass("button-default");
        $(".ta").removeClass("ta-light").removeClass("ta-dark").addClass("ta-default");
        $(".dev-div").removeClass("dev-div-light").removeClass("dev-div-dark").addClass("dev-div-default");
        $(".dev-btn-div").removeClass("dev-btn-div-light").removeClass("dev-btn-div-dark").addClass("dev-btn-div-default");
        theme = "default";
        window.localStorage.setItem("todotheme", JSON.stringify(theme));
    })

    $("#theme3").click(function(e) {
        $(".header").removeClass("header-light").removeClass("header-default").addClass("header-dark");
        $("body").removeClass("body-light").removeClass("body-default").addClass("body-dark");
        $(".container").removeClass("container-light").removeClass("container-default").addClass("container-dark");
        $(".form-div").removeClass("form-div-light").removeClass("form-div-default").addClass("form-div-dark");
        $(".theme-div").removeClass("theme-div-light").removeClass("theme-div-default").addClass("theme-div-dark");
        $(".list-div").removeClass("list-div-light").removeClass("list-div-default").addClass("list-div-dark");
        $(".button").removeClass("button-light").removeClass("button-default").addClass("button-dark");
        $(".ta").removeClass("ta-light").removeClass("ta-default").addClass("ta-dark");
        $(".dev-div").removeClass("dev-div-light").removeClass("dev-div-default").addClass("dev-div-dark");
        $(".dev-btn-div").removeClass("dev-btn-div-light").removeClass("dev-btn-div-default").addClass("dev-btn-div-dark");
        theme = "dark";
        window.localStorage.setItem("todotheme", JSON.stringify(theme));
    })

    if (!theme) {
        $("#theme2").click();
    }
    if (theme === "light") {
        $("#theme1").click();
    }
    if (theme === "default") {
        $("#theme2").click();
    }
    if (theme === "dark") {
        $("#theme3").click();
    }
    
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
            console.log("hi");
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
});