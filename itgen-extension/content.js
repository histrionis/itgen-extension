window.onload = function(){
  checkHashChange();
  itgenSettings = loadSettings();
  applySettings(itgenSettings);
  createSettingsWindow(itgenSettings);
  hideSettingsWindow();
  setSettingsIco();

  var itgenSettings = loadSettings();
  loadSettings();
  for (var i = 0; i < settingsList.length; i++) {
    setEvent(settingsList[i][0]);
  }
}

var settingsList = [["newtheme", "Новая тема"],
["darkmode", "Тёмная темa"],
["lessonnotfinishalert", "Незавершенное занятие"],
["hotkey", "Горячие клавиши"],
["autoskypecopy", "Копировать skype"]];

function checkHashChange() {
  var oldCount = window.history.length;
  var checkHash = setInterval(function() {
    if(window.history.length > oldCount){
      itgenSettings = loadSettings();
      applySettings(itgenSettings);
      oldCount = window.history.length;
    }
  }, 5000);
}

function getLessonButton(){
  var btn2 = document.getElementsByClassName("btn btn-primary");
  alert(btn2);
  try{
    var btn = document.getElementsByClassName("btn btn-primary");
    if (btn.item(0).innerHTML.replace(/\s+/g, '') == "Завершитьзанятие") {
      return true;
    }else{
      return false;
    }
  }catch(e){
    return false;
  }
}

window.onbeforeunload = function(){
  var itgenSettings = loadSettings();
  if(itgenSettings[settingsList[2][0]] == true){
    if (getLessonButton()){
      return "Занятие не завершено";
    }
  }
}

function loadSettings(){
  var itgenSettings = {};
    var storage = localStorage.getItem("itgensettings");
    if (storage == null){
      for (var i = 0; i < settingsList.length; i++) {
        itgenSettings[settingsList[i][0]] = false;
      }
      var itgenSettingsJson = JSON.stringify(itgenSettings);
      localStorage.setItem("itgensettings", itgenSettingsJson);
    }else{
      itgenSettings = JSON.parse(storage);
    }
    return itgenSettings;
}

function applySettings(itgenSettings){
  if (itgenSettings.darkmode == true){
    removeStyle("itgenuserstyle");
    loadStyle("/styles/darkmode.css", "itgenuserstyle");
  }else if(itgenSettings.newtheme == true){
    removeStyle("itgenuserstyle");
    loadStyle("/styles/lightmode.css", "itgenuserstyle");
  }else{
    try{
      removeStyle("itgenuserstyle");
    }catch(e){

    }
  }

  if(itgenSettings.autoskypecopy == true){
    document.body.onclick = checkSkypeClick;
  }
}

function checkSkypeClick(e){
  var clickedElem = e.target;
  if(clickedElem.className == "skype"){
    var itgenSettings = loadSettings();
    if(itgenSettings[settingsList[4][0]] == true){
      var login = clickedElem.innerHTML.replace(/Skype: /, '');
      navigator.clipboard.writeText(login);
    }
  }
}

function saveSettings(itgenSettings){
  itgenSettingsJson = JSON.stringify(itgenSettings);
  localStorage.setItem("itgensettings", itgenSettingsJson);
}

function loadStyle(stylepath, className) {
  var objHead = document.head;
  var objStyleLink = document.createElement('link');
  objStyleLink.rel = "stylesheet";
  objStyleLink.type = "text/css";
  objStyleLink.href = chrome.runtime.getURL(stylepath);
  objStyleLink.className = className;
  objHead.appendChild(objStyleLink);
}

function removeStyle(className){
  var elems = document.getElementsByClassName(className)
  for(var i = 0; i < elems.length; i++){
    elems[i].remove();
  }
}

function createSettingsWindow(itgenSettings){
  var mainDiv = document.createElement("div");

  mainDiv.onclick = function(e){
    var elem = e.target;
    if(elem.id == "settingswindowmaindiv" || elem.tagName == "CENTER"){
      hideSettingsWindow();
    }
  }

  mainDiv.id = "settingswindowmaindiv";
  var settingsWindowBody = document.createElement("div");
  settingsWindowBody.id = "settingswindowbody";
  for (var i = 0; i < settingsList.length; i++) {
    var lineelem = document.createElement("div");
    lineelem.setAttribute("class", "lineelem");
    var name = document.createElement("p");
    name.innerHTML = settingsList[i][1];
    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.name = settingsList[i][0];
    inputCheckbox.id = settingsList[i][0];
    var labelCheckbox = document.createElement("label");
    labelCheckbox.setAttribute("for", settingsList[i][0]);
    inputCheckbox.checked = itgenSettings[settingsList[i][0]];

    lineelem.appendChild(name);
    lineelem.appendChild(inputCheckbox);
    lineelem.appendChild(labelCheckbox);

    settingsWindowBody.appendChild(lineelem);
  }
  var centerElem = document.createElement("center");
  centerElem.appendChild(settingsWindowBody);
  mainDiv.appendChild(centerElem);
  loadStyle("styles/settingswindow.css", "settingswindowstyle");

  var body = document.body;
  body.appendChild(mainDiv);
}

function hideSettingsWindow(){
  var settingsWindow = document.getElementById("settingswindowmaindiv");
  settingsWindow.style.display = "none";
}

function showSettingsWindow(){
  var settingsWindow = document.getElementById("settingswindowmaindiv");
  settingsWindow.style.display = "block";
}

function refreshSettings(){
  var itgenSettings = loadSettings();
  for (var i = 0; i < settingsList.length; i++) {
    var item = document.getElementById(settingsList[i][0]);
    var itemChecked = item.checked;
    itgenSettings[settingsList[i][0]] = itemChecked;
  }
  saveSettings(itgenSettings);
  applySettings(itgenSettings);
}

function setEvent(itemId){
  var item = document.getElementById(itemId);
  item.onchange = refreshSettings;
}

function setSettingsIco(){
  var settingsIcoElem = document.createElement("div");
  settingsIcoElem.id = "settingsico";
  settingsIcoElem.onclick = showSettingsWindow;
  var navBar = document.getElementsByClassName("gena-default-navbar").item(0);
  navBar.insertBefore(settingsIcoElem, navBar.getElementsByClassName("gena-navbar-item-right").item(0));
}

document.body.onkeydown = function(e){
  var itgenSettings = loadSettings();
  if(itgenSettings[settingsList[3][0]] == true){
    if(document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA"){
      var eventKeyCode = e.keyCode;
      if (eventKeyCode > 48 && eventKeyCode < 58){
        var btnMuteId = eventKeyCode - 49;
        try{
          document.getElementsByClassName("trainer-lesson-list-item list-group-item").item(btnMuteId).getElementsByClassName("btn-videochat btn-mute").item(0).click();
        }catch(ex){

        }
      }
      if(eventKeyCode == 67){
        var chatBtn = document.getElementsByClassName("chat-button");
        chatBtn.item(0).click();
      }
    }
  }
}
