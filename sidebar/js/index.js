/*
qID == quarterID
mm == mainmenu
sm == submenu
proto == html element in which we write
*/



function getDiagramHTML(qID, mm, sm, proto) {

      var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                proto.innerHTML = this.responseText;
            }
            //draw instantly when in Viewport
            var chart = Array.prototype.slice.call(proto.getElementsByClassName("chart"));
            if (Array.prototype.slice.call(chart).length) {
              var chart_function = Array.prototype.slice.call(chart).pop().getAttribute('data-function');
              var f = new Function(chart_function);
              console.log("if i could i would call: " + chart_function);
              //f();

              proto.classList.add("drawn");
            }
        };

        xmlhttp.open("GET", "https://sqis.inwis.de/sqis/vbw/get_content.php?q=" + qID + "&mm=" + mm + "&sm=" +sm, true);

        xmlhttp.send();
}

var sbt = false;
var menubuild = false;

function toggle_sidebar() {
  var sb = document.getElementById("sidebar_menu");

  if (!sbt) {
    sb.style.visibility = "visible";
    sbt = true;
    document.getElementById("sbb_icon").classList.remove("fa-bars");
    document.getElementById("sbb_icon").classList.add("fa-times");
  } else {
    sb.style.visibility = "hidden";
    sbt = false;

    document.getElementById("sbb_icon").classList.remove("fa-times");
    document.getElementById("sbb_icon").classList.add("fa-bars");
  }
}

function toggleSet(setname) {
  var set = document.getElementsByName(setname);
  var jobdone = false;
  var unchecked = 0;
  Array.prototype.slice.call(set).forEach(function(checkbox) {
    if (checkbox.checked && !jobdone) {
      //if any checkbox is checked, uncheck all
      uncheckAll(set);
    } else {
      //else count unchecked
      unchecked++;
    }
  });
  //if all uncheck, checkALL instead
  if (unchecked == set.length) checkAll(set);
  //finally set Opacity
  setOpacity(setname);
  //...and check which boxes are checked
  var temp = document.createElement("div");
  temp.name = setname;
  readCheckboxes(temp);
}

function setOpacity(setname) {
  var icon = document.getElementById(setname + "_icon");

  var set = document.getElementsByName(setname);

  var unchecked = 0;

  Array.prototype.slice.call(set).forEach(function(checkbox) {
    if (checkbox.checked) {
    } else {
      unchecked++;
    }
  });

  var opatity = ".6";

  if (unchecked == set.length) {
    opacity = ".2";
  }
  if (unchecked < set.length) {
    opacity = ".6";
  }
  if (unchecked === 0) {
    opacity = "1";
  }
  icon.style.opacity = opacity;
}

function checkAll(set) {
  Array.prototype.slice.call(set).forEach(function(checkbox) {
    checkbox.checked = true;
  });
}

function uncheckAll(set) {
  Array.prototype.slice.call(set).forEach(function(checkbox) {
    checkbox.checked = false;
  });
}

function readCheckboxes(el) {
  var setname = el.name;
  var set = document.getElementsByName(setname);
  var containerToDraw = document.getElementById(setname + "_graphs");

  Array.prototype.slice.call(set).forEach(function(checkbox) {
    if (checkbox.checked) {
      createDiagram(containerToDraw, checkbox.value);
    } else {
      // remove DOM element here
      var element_id = checkbox.value + "_graph";
      if (document.getElementById(element_id)) {
        var element = document.getElementById(element_id);
        element.parentNode.removeChild(element);
      }
    }
  });
  setOpacity(setname);
  highlightAnchor(menuID, watchedElementID);
  if(menubuild){newURL()};
}

function createDiagram(containerToDraw, id_part) {
  // add DOM prototype (if not exists allready) and draw D3 here
  //iterate over existing dom elements, check name for number. keep a reminder of last checked.
  // if div_to_draw_num > previous_dev_num && div_to_draw_num < next_div_num : draw
  // previous_div == lastChild : draw : break
  // else continue iterating
  var new_id = id_part + "_graph";

  //check if element might exist allready
  if (!document.getElementById(new_id)) {
    //okay, then create it

    //number between the two '_' is our index
    var new_id_index = new_id.split("_")[1];
    var new_el = document.createElement("div");
    new_el.id = new_id;

    //is empty?
    if (!containerToDraw.children.length) {
      containerToDraw.appendChild(new_el);
    } else {
      //loop to find the correct position
      var children = containerToDraw.children;
      var lastindex = 0;
      //if current Index is bigger than lastChilds element, just append
      if (new_id_index > containerToDraw.lastChild.id.split("_")[1]) {
        containerToDraw.appendChild(new_el);
      } else if (containerToDraw.children.length == 1) {
        //only one element? easy...
        var currentindex = children[0].id.split("_")[1];
        if (currentindex > new_id_index) {
          containerToDraw.insertBefore(new_el, containerToDraw.childNodes[0]);
        } else {
          containerToDraw.appendChild(new_el);
        }
      } else {
        //we really need to do stuff, eh?
        for (var i = 0; i < children.length; i++) {
          currentindex = children[i].id.split("_")[1];

          if (new_id_index < currentindex && new_id_index > lastindex) {
            containerToDraw.insertBefore(new_el, containerToDraw.childNodes[i]);
          }
          lastindex = currentindex;
        }
      }
    }
    var qID = decode()[0];
    var tmp = id_part.replace("set" , "").split("_");
    var mm = tmp[0];
    var sm = tmp[1];
    console.log("qID: " + qID + ",MM: " + mm + ", SM = " + sm);
    getDiagramHTML(qID,mm,sm,document.getElementById(new_id));
  }
}

function highlightAnchor(menuname, watchedEl) {
  //menuname is the id of the menu we will watch
  //watchedEl is the id of the container we are watching

  var vlist = [];
  var container = document.getElementById(watchedEl);
  //get a list <vlist> of elements in the watchedEl which are in Viewport
  //of those elements strip the id of "_graph"
  Array.prototype.slice.call(container.getElementsByTagName("div")).forEach(function(el) {
    if (isInViewport(el)) {
      vlist.push(el.id.replace("_graph", ""));
    }
  });
  //remove .active class from all highlightable_entries
  var highlightables = document.getElementsByClassName("highlightable_entry");
  Array.prototype.slice.call(highlightables).forEach(function(el) {
    el.classList.remove("active");
  });

  //iterate through all checkboxes of the watched menu (menuname) and check if checkbox.value matches the stripped id

  var checkboxes = document
    .getElementById(menuname)
    .querySelectorAll("input[type=checkbox]");
  Array.prototype.slice.call(checkboxes).forEach(function(checkbox) {
    if (vlist.indexOf(checkbox.value) > -1) {
      //if we get a match add .active to the parent of this checkboxs container
      checkbox.parentElement.classList.add("active");
      //also add .active to the .highlightable_entry div right before the parent of the parent of the checkbox
      checkbox.parentElement.parentElement.previousSibling.classList.add(
        "active"
      );
    }
  });
}

function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  // Only completely visible elements return true:
  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  // Partially visible elements return true:
  isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
}

//set scroll listener for menuhighlighting
var menuID = "sidebar_menu";
/*calculate that here*/
var watchedElementID = "graphs";

window.onscroll = function() {
  highlightAnchor(menuID, watchedElementID);
};

highlightAnchor(menuID, watchedElementID);

/* bool if accordion or not */
var accordion = true;

function changeChevron(el) {

  var follow = el.parentElement.nextSibling;
  var elem = el.children[0]

  if (elem.classList.contains("fa-chevron-down")) {
    follow.classList.add("show");
    elem.classList.remove("fa-chevron-down");
    elem.classList.add("fa-chevron-up");
  }
  else {
    follow.classList.remove("show");
    elem.classList.remove("fa-chevron-up");
    elem.classList.add("fa-chevron-down");
  }

  if (accordion) {
    var main_menuentries = document.getElementsByClassName("main_menuentry");
    Array.prototype.slice.call(main_menuentries).forEach(function(entry){
      if (entry != el.parentElement) {
        entry.nextSibling.classList.remove("show");
        var chev = entry.children[1].children[0];
        chev.classList.remove("fa-chevron-up");
        if (!chev.classList.contains("fa-chevron-down")){
          chev.classList.add("fa-chevron-down");
        }

      }
    });
  }
}




/*encoding / decoding url*/


function hex2bin(hex){
    return ("000000000000" + (parseInt(hex, 16)).toString(2)).substr(-12);
}

function bin2hex(bin){
  return ("000" + parseInt(bin, 2).toString(16)).substr(-3);
}

function decode() {
  var encoded = window.location.href .split("?");
  if (encoded.length < 3) {
    console.log("missing info, abort decoding");


  }
  var quarter = encoded[encoded.length - 2];
  encoded = encoded[encoded.length - 1];
  var encarray = encoded.match(/.{3}/g);
  var decodedarray = []
  encarray.forEach(function(entry){
    decodedarray.push(hex2bin(entry));
  })
  return [quarter , decodedarray];

}

function encode (array){

  var encodedstr = "";
  var quarterid = "01";

  array.forEach(function(entry){
    encodedstr += bin2hex(entry);
  })
  var goto = "?" + quarterid + "?" + encodedstr;
  return goto;
}

function newURL(){
  var unencodedarray = [];
  var main_menuentries = document.getElementsByClassName("main_menuentry");
  Array.prototype.slice.call(main_menuentries).forEach(function(entry){
    var submenuentries = entry.nextSibling.getElementsByClassName("list-group-item");
    var binary = "";
    Array.prototype.slice.call(submenuentries).forEach(function(subentry){
      var checkbox = subentry.firstChild;
      if (checkbox.checked ){
        binary += "1";
      }
      else {
        binary += "0";
      }
    });
    while (binary.length < 12){
      binary += "0";
    }
    unencodedarray.push(binary);
  });
  var stateObj = {};
  history.pushState(stateObj, "diagrams" , encode(unencodedarray));
}

function readConfigFromURL() {
  quarter = decode()[0];
  checkboxes = decode()[1];
  var main_menuentries = document.getElementsByClassName("main_menuentry");
  Array.prototype.slice.call(main_menuentries).forEach(function(entry){
    var submenuentries = entry.nextSibling.getElementsByClassName("list-group-item");
    var code = checkboxes.shift().split("");
    Array.prototype.slice.call(submenuentries).forEach(function(subentry){
      var checkbox = subentry.firstChild;
      if (code.shift() == 1){
        checkbox.checked = true;
      }
      else {
        checkbox.checked = false;
      }

    });
    var setname = entry.children[0].children[0].id.replace("_icon","");
    setOpacity(setname);
    var temp = document.createElement("div");
    temp.name = setname;
    readCheckboxes(temp);
  });
  console.log("read config from URL and applied settings");
}


/* end en/decoding URL */

/* build menu from JSON */


function getJson(url){

  var json = "";
  var request = new XMLHttpRequest();
    request.open('GET', '/menustructure.php', true);

    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
            json = JSON.parse(this.response);
        }
    };
    request.send();

  return json;


}

/*Objects.entries polyfill*/
if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };


function buildMenu(){


  //getting the JSON
  //var json = getJson("/menustructure.php");
  var json =
  '{ \
  "Bestandsstruktur": [ \
    "Kurzbeschreibung", \
    "Impressionen", \
    "Leerstandsquote", \
    "Fluktuationsquote", \
    "Wohnungstypen", \
    "Baualtersklassen der Gebäude", \
    "Anteil am Gesamtwohnungsbestand im Stadtteil" \
  ], \
  "wasanderes": [ \
    "Kurzbeschreibung", \
    "Impressionen", \
    "Leerstandsquote", \
    "Fluktuationsquote", \
    "Wohnungstypen", \
    "Baualtersklassen der Gebäude", \
    "Anteil am Gesamtwohnungsbestand im Stadtteil" \
  ] \
  }';

  var obj = JSON.parse(json);

  var menu = Object.entries(obj);

  var menu_div = document.createElement("div");
  menu_div.id = "temp_menu";
  for(var i = 0; i < menu.length; i++){

    var mainentry = document.createElement("div");
    mainentry.id = "main_set" + (i+1);
    mainentry.classList.add("main_menuentry")
    mainentry.classList.add("highlightable_entry");
    mainentry.classList.add("list-group-item");
    mainentry.name = menu[i][0];

    var button = document.createElement("button");
    button.setAttribute('onclick','toggleSet("set'+(i+1)+'")');
    var icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-bullseye");
    icon.setAttribute('aria-hidden' , 'true');
    icon.id = "set" + (i+1) + "_icon";
    button.appendChild(icon);
    mainentry.appendChild(button);

    var link = document.createElement("a");
    link.setAttribute('href', "#set" + (i+1));
    link.setAttribute('data-toggle', 'collapse');
    link.setAttribute('data-parent', '#MainMenu');
    link.setAttribute('onclick','changeChevron(this)');

    var chevron = document.createElement("i");
    chevron.classList.add("float-right");
    chevron.classList.add( "fa");
    chevron.classList.add("fa-chevron-down");

    var label = document.createElement("label");
    label.innerHTML = menu[i][0];

    link.appendChild(chevron);
    link.appendChild(label);

    mainentry.appendChild(link);

    menu_div.appendChild(mainentry);

    var submenu = document.createElement("div");
    submenu.id = "set" + (i+1);
    submenu.classList.add("collapse");

    for(var j = 0; j < menu[i][1].length; j++){
      var label = document.createElement("label");
      label.classList.add("control");
      label.classList.add("control-checkbox");
      label.classList.add("list-group-item");
      label.classList.add("highlightable_entry");
      var input = document.createElement("input");
      input.name = "set" + (i+1);
      input.setAttribute('onclick' , 'readCheckboxes(this)');
      input.setAttribute('value', 'set'+(i+1)+"_"+(j+1));
      input.setAttribute('type', 'checkbox');
      label.appendChild(input);
      label.innerHTML += menu[i][1][j];
      var indicator = document.createElement("div");
      indicator.classList.add("control_indicator");
      label.appendChild(indicator);
      submenu.appendChild(label);
    }

    menu_div.appendChild(submenu);
    var canvas = document.createElement("div");
    canvas.id = "set" + (i+1) + "_graphs";
    document.getElementById("graphs").appendChild(canvas);

  }

  document.getElementById("MainMenu").appendChild(menu_div);
  console.log("menubuild done");
  menubuild = true;


}

window.onscroll = function() {
  drawDiagrams();
};

function drawDiagrams(){
  var mainNodes = document.getElementById("graphs").children;
  Array.prototype.slice.call(mainNodes).forEach(function(mainNode){

    //if mainNode is in is in Viewport
    if (isInViewport(mainNode)){

      var subNodes = mainNode.children;
      Array.prototype.slice.call(subNodes).forEach(function(subNode){
        //check if in Viewport and has class "drawn"
        //if not draw it using  the function stored as data-function attribute
        if (isInViewport(subNode)){
            if (!subNode.classList.contains("drawn")){
              //console.log(subNode);
              var chart = subNode.getElementsByClassName("chart");

              if (Array.prototype.slice.call(chart).length) {
                var chart_function = Array.prototype.slice.call(chart).pop().getAttribute('data-function');
                var f = new Function(chart_function);
                console.log("if i could i would call: " + chart_function);
                //f();
                subNode.classList.add("drawn");
              }
          }
        }
      });
    }
  });
}



buildMenu();

readConfigFromURL();
