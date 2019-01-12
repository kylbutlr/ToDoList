let currentTheme;
let todos = [];
const $input = document.querySelector("#input");
const $list = document.querySelector("#list");
const $date = document.querySelector("#date");
const $time = document.querySelector("#time");
const $key = document.querySelector("#key");
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
};

const getSavedTheme = () => {
  currentTheme = JSON.parse(window.localStorage.getItem("todoTheme"));
  if (!currentTheme) {
    applyTheme("default");
    window.localStorage.setItem("todoTheme", JSON.stringify("default"));
  } else {
    applyTheme(currentTheme);
  }
};

const applyTheme = (theme) => {
  const themeList = Object.keys(themes);
  for (i=0;i<themeList.length;i++) {
    $(".header").removeClass("header-"+themeList[i]);
    $("body").removeClass("body-"+themeList[i]);
    $(".container").removeClass("container-"+themeList[i]);
    $(".form-div").removeClass("form-div-"+themeList[i]);
    $(".form-btn-div").removeClass("form-btn-div-"+themeList[i]);
    $(".theme-div").removeClass("theme-div-"+themeList[i]);
    $(".list-div").removeClass("list-div-"+themeList[i]);
    $(".button").removeClass("button-"+themeList[i]);
    $(".textarea").removeClass("textarea-"+themeList[i]);
    $(".clear-div").removeClass("clear-div-"+themeList[i]);
    $(".clear-btn-div").removeClass("clear-btn-div-"+themeList[i]);
    $(".theme-div").removeClass("theme-div-"+themeList[i]);
    $(".theme-btn-div").removeClass("theme-btn-div-"+themeList[i]);
    $("h2").removeClass("h2-"+themeList[i]);
  }
  $(".header").addClass("header-"+theme);
  $("body").addClass("body-"+theme);
  $(".container").addClass("container-"+theme);
  $(".form-div").addClass("form-div-"+theme);
  $(".form-btn-div").addClass("form-btn-div-"+theme);
  $(".theme-div").addClass("theme-div-"+theme);
  $(".list-div").addClass("list-div-"+theme);
  $(".button").addClass("button-"+theme);
  $(".textarea").addClass("textarea-"+theme);
  $(".clear-div").addClass("clear-div-"+theme);
  $(".clear-btn-div").addClass("clear-btn-div-"+theme);
  $(".theme-div").addClass("theme-div-"+theme);
  $(".theme-btn-div").addClass("theme-btn-div-"+theme);
  $("h2").addClass("h2-"+theme);
};

const getSavedList = () => {
  $.get('http://localhost:3000/todos', (data) => {
    todos = data;
    if (todos.length>0) {
      $list.innerHTML = "";
      for (i=0;i<todos.length;i++) {
        renderTodo(todos[i], todos[i].id);
      }
    } else {
      $list.innerHTML = "";
      todos = [];
    }
  },"JSON");
};

const onFormSubmit = (e) => {
  e.preventDefault();
  if ($input.value === " ") {
    alert("New item must have a name.");
    $input.value = "";
    $input.focus();
  } else {
    let time = null;
    let date = null;
    if ($time.value.length>0) {
      time = $time.value;
    }
    if ($date.value.length>0) {
      date = $date.value;
    }
    const todo = {
      "title": $input.value,  
      "date": date,
      "time": time,
      "complete": false
    };
    if ($key.value.length > 0){
      const key = parseInt($key.value);
      const t = todos.findIndex(x => x.id === key);
      todo.id = key;
      todos[t] = todo;
      $.ajax({
        url: 'http://localhost:3000/todos/'+key,
        method: 'PUT',
        data: JSON.stringify(todo),
        success: () => {
          $.get('http://localhost:3000/todos/'+key, (data) => {
            const t = todos.findIndex(x => x.id === key);
            todos[t] = data;
            renderTodo(todos[t], todos[t].id);
            $("#cancelButton").trigger("click");
          },"JSON");
        }
      });
    } else {
      $.post('http://localhost:3000/todos', JSON.stringify(todo), () => {
        $.get('http://localhost:3000/todos', (data) => { 
          todos = data;
          const newKey = todos[todos.length-1].id;
          const t = todos.findIndex(x => x.id === newKey);
          renderTodo(todos[t], todos[t].id);
        },"JSON");
      });
    }
    resetInput();
    $input.focus();
    $("#addButton").stop().animate({opacity:0.25}, 500);
    $("#addButton").prop("disabled", true);
  }
};

const renderTodo = (todo, currentKey) => {
  const newTodo = document.createElement("li");
  const todoTitle = document.createElement("h3");
  const dateObject = new Date(todo.date);
  const timeObject = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000);
  const formattedDate =  days[timeObject.getDay()] + ", " + months[timeObject.getMonth()] + " " + timeObject.getDate();
  let displayTime = todo.time;
  if (displayTime != null) {
    displayTime = getAmPm(displayTime, todo);
  }
  if (!todo.time && todo.date) {
    todoTitle.textContent = todo.title + " (by " + formattedDate + ")";
  } else if (todo.time && !todo.date) {
    todoTitle.textContent = todo.title + " (by " + displayTime + ")";
  } else if (todo.time && todo.date) {
    todoTitle.textContent = todo.title + " (by " + displayTime + " on " + formattedDate + ")";
  } else {
    todoTitle.textContent = todo.title;
  }
  todoTitle.addEventListener("click", onListItemClick);
  newTodo.appendChild(todoTitle);
  newTodo.dataset.key = currentKey;
  newTodo.appendChild(createElementEditButton(currentKey));
  newTodo.appendChild(createElementDeleteButton(currentKey));
  newTodo.insertBefore(createElementCheckbox(todo, currentKey), newTodo.childNodes[0]);
  if (todo.complete === true) {
    newTodo.classList.add("checked");
  }
  if (currentKey >= 0){
    newTodo.classList.add("new-post");
    setTimeout(() => {
      newTodo.classList.add("post-visible");
    },10);
  }
  $list.appendChild(newTodo);
};

const resetInput = (delay) => {
  $input.value = "";
  $key.value = "";
  if (delay){
    setTimeout(() => {
      $time.value = "12:00";
      $date.valueAsDate = getDateObject(new Date());
    }, delay);
  } else {
    $time.value = "12:00";
    $date.valueAsDate = getDateObject(new Date());
  }
};

const getDateObject = (date) => {
  const dateObject = new Date(date);
  const timeObject = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000);
  return timeObject;
};

const getAmPm = (displayTime, todo) => {
  let AmPm;
  if (displayTime.charAt(0) == 0) {
    displayTime = todo.time.slice(1, 5);
    if (displayTime.charAt(0) == 0) {
      displayTime = "12:" + displayTime.charAt(2) + displayTime.charAt(3);
    }
    AmPm = "am";
  } else {
    displayTime = todo.time.slice(0, 5);
    const firstTwo = displayTime.charAt(0) + displayTime.charAt(1);
    if (firstTwo < 12) {
      AmPm = "am";
    }
    if (firstTwo == 12) {
      AmPm = "pm";
    }
    if (firstTwo > 12) {
      AmPm = "pm";
      displayTime = Number(firstTwo) - 12 + ":" + displayTime.charAt(3) + displayTime.charAt(4);
    }
  }
  displayTime = displayTime + AmPm;
  return displayTime;
};

const onClearClick = (e) => {
  e.preventDefault();
  todos = [];
  jQuery.ajax({
    url: 'http://localhost:3000/todos',
    method: 'DELETE'
  });
  for (i=0;i<$list.childElementCount;i++) {
    $list.childNodes[i].classList.add("post-delete");
  }
  setTimeout(() => {
    $list.innerHTML = "";
  }, 250);
};

const createElementEditButton = (key) => {
  const editButton = document.createElement("button");
  editButton.dataset.key = key;
  editButton.className = "edit-button button";
  editButton.textContent = "";
  editButton.addEventListener("click", onEditButtonClick);
  return editButton;
};

const onEditButtonClick = (e) => {
  e.preventDefault();
  const key = Number(e.target.dataset.key);
  const t = todos.findIndex(x => x.id === key);
  const timeString = todos[t].time;
  const dateString = todos[t].date;
  if (dateString != null) {
    $date.value = dateString.toDateFormat();
  } else {
    $date.value = dateString;
  }
  $input.value = todos[t].title;
  $time.value = timeString;
  $key.value = todos[t].id;
  $("#cancelButton").show();
  $("#addButton").addClass("edit");
  $("#addButton").text("Update");
  e.target.parentNode.classList.add("post-delete");
  checkInput(t);
  $input.focus();
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const createElementDeleteButton = (key) => {
  const deleteButton = document.createElement("button");
  deleteButton.dataset.key = key;
  deleteButton.className = "delete-button button";
  deleteButton.textContent = "";
  deleteButton.addEventListener("click", onDeleteButtonClick);
  return deleteButton;
};

const onDeleteButtonClick = (e) => {
  e.preventDefault();
  const key = Number(e.target.dataset.key);
  const t = todos.findIndex(x => x.id === key);
  todos.splice(t,1);
  jQuery.ajax({
    url: 'http://localhost:3000/todos/'+key,
    method: 'DELETE',
    data: JSON.stringify(key),
    success: () => {
      $.get('http://localhost:3000/todos', (data) => {
        todos = data;
      },"JSON");
    }
  });
  e.target.parentNode.classList.add("post-delete");
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const createElementCheckbox = (todo, key) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "check-box";
  checkbox.dataset.key = key;
  checkbox.id = "cb"+key;
  checkbox.addEventListener("click", onCheckboxClick);
  if (todo.complete === "true") {
    checkbox.checked = true;
  } else { 
    checkbox.checked = false;
  }
  return checkbox;
};

const onCheckboxClick = (e) => {
  const key = Number(e.target.dataset.key);
  const t = todos.findIndex(x => x.id === key);
  if (e.target.parentNode.classList.contains("checked")) {
    e.target.parentNode.classList.remove("checked");
    e.target.checked = false;
    todos[t].complete = false;
    $.ajax({
      url: 'http://localhost:3000/todos/'+key,
      method: 'PUT',
      data: JSON.stringify(todos[t])
    });
  } else {
    e.target.parentNode.classList.add("checked");
    e.target.checked = true;
    todos[t].complete = true;
    $.ajax({
      url: 'http://localhost:3000/todos/'+key,
      method: 'PUT',
      data: JSON.stringify(todos[t])
    });
  }
};

const onListItemClick = (e) => {
  const tkey = e.target.parentNode.children[0].dataset.key;
  $("#cb"+tkey).trigger("click");
};

const checkInput = (key) => {
  if (key>=0) {
    $("#cancelButton").css("opacity", "0.25").stop().animate({opacity:1}, 500);
    $("#addButton").stop().animate({opacity:1}, 500);
    $("#addButton").prop("disabled", false);
  }
  if ($("#input").val().length === 0 || key>=0) {
    if ($("#input").is(":active")||$("#time").is(":active")||$("#date").is(":active")||$("#addButton").is(":active")) { //Do nothing
    } else {
      $("#date").stop().animate({top:-65},250, () => {
        $("#time").stop().animate({top:-35},125, () => {
          $("#input").css("border-radius", "10px");
        });
      });
    }
  } else {
    $("#input").css("border-radius", "10px 10px 0 0");
    $("#time").stop().animate({top:0},250);
    $("#date").stop().animate({top:0},500);
  }
};

String.prototype.toDateFormat = function () {
  const dateObj = new Date(this);
  const year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();
  if (month < 10) { month = "0" + month; }
  if (date < 10) { date = "0" + date; }
  return year + "-" + month + "-" + date;
};

$time.value = "12:00";
$date.valueAsDate = getDateObject(new Date());
form.addEventListener("submit", onFormSubmit, false);
clearList.addEventListener("click", onClearClick, false);
getSavedList();
getSavedTheme();

$(() => {
  $(".header").hide().delay(500).fadeToggle(1000);
  $(".header-glass").hide().delay(500).fadeToggle(1000);
  $(".clear-div").hide().delay(500).fadeToggle(1000);
  $(".clear-div-glass").hide().delay(500).fadeToggle(1000);
  $(".theme-div").hide().delay(500).fadeToggle(1000);
  $(".theme-div-glass").hide().delay(500).fadeToggle(1000);
  $(".container").hide().delay(1500).slideToggle(1000);
  $(".container-glass").hide().delay(1500).slideToggle(1000);
  $(".form-div").hide().delay(1500).slideToggle(1000);
  $(".list-div").hide().delay(1500).slideToggle(1000);

  $(".header").click(() => {
    $(".container").slideToggle(1000);
    $(".container-glass").slideToggle(1000);
    $(".form-div").slideToggle(1000);
    $(".list-div").slideToggle(1000);
  });

  $("#time").stop().animate({top:-35},0);
  $("#date").stop().animate({top:-65},0);
  $("#addButton").stop().animate({opacity:0.25},0);
  $("#addButton").prop("disabled", true);
    
  $("#input").focus(() => {
    $("#input").css("border-radius", "10px 10px 0 0");
    $("#time").stop().animate({top:0},250);
    $("#date").stop().animate({top:0},500);
  });
    
  $("#input").on("change paste cut input", () => {
    if ($.trim($input.value).length === 0) {
      $("#addButton").stop().animate({opacity:0.25}, 250);
      $("#addButton").prop("disabled", true);
    } else {
      $("#addButton").stop().animate({opacity:1}, 500);
      $("#addButton").prop("disabled", false);
    }
  });

  $(".textarea").blur(() => {
    checkInput();
  });

  $("#date").change(() => {
    const date = getDateObject(this.value);
    const now = getDateObject(new Date());
    if (date < now) {
      alert("New item must have a future date (or no date).");
      this.valueAsDate = now;
      this.focus();
    }
  });

  $(".clear-div").hover((e) => {
    $("#clearList").stop().animate({
      opacity: e.type==="mouseenter" ? 1 : 0.5
    }, 250);

    $(".clear-div").stop().animate({
      bottom: e.type==="mouseenter" ? -10 : -60
    }, 500);
    $(".clear-div-glass").stop().animate({
      top: e.type==="mouseenter" ? 10 : 60
    }, 500);
  });

  $(".theme-div").hover((e) => {
    $("#theme1").stop().animate({
      opacity: e.type==="mouseenter" ? 1 : 0.5
    }, 250);
    $("#theme2").stop().animate({
      opacity: e.type==="mouseenter" ? 1 : 0.5
    }, 250);
    $("#theme3").stop().animate({
      opacity: e.type==="mouseenter" ? 1 : 0.5
    }, 250);
    $(".theme-div").stop().animate({
      bottom: e.type==="mouseenter" ? -10 : -60
    }, 500);
    $(".theme-div-glass").stop().animate({
      top: e.type==="mouseenter" ? 10 : 60
    }, 500);
  });

  $("#theme1").click(() => {
    const themeName = "light";
    applyTheme(themeName);
    currentTheme = themeName;
    window.localStorage.setItem("todoTheme", JSON.stringify(themeName));
  });

  $("#theme2").click(() => {
    const themeName = "default";
    applyTheme(themeName);
    currentTheme = themeName;
    window.localStorage.setItem("todoTheme", JSON.stringify(themeName));
  });

  $("#theme3").click(() => {
    const themeName = "dark";
    applyTheme(themeName);
    currentTheme = themeName;
    window.localStorage.setItem("todoTheme", JSON.stringify(themeName));
  });

  $("#cancelButton").click(() => {
    resetInput(500);
    checkInput(1);
    $("#input").focus();
    $("#addButton").stop().animate({opacity:0.25}, 250);
    $("#addButton").prop("disabled", true);
    $("#cancelButton").hide();
    $("#addButton").text("Add to List");
    $("#addButton").removeClass("edit");
    $list.innerHTML = "";
    for (i=0;i<todos.length;i++) {
      renderTodo(todos[i], todos[i].id);
    }
  });
});