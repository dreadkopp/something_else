var sbt = false;

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
  Array.from(set).forEach(function(checkbox) {
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

  Array.from(set).forEach(function(checkbox) {
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
  Array.from(set).forEach(function(checkbox) {
    checkbox.checked = true;
  });
}

function uncheckAll(set) {
  Array.from(set).forEach(function(checkbox) {
    checkbox.checked = false;
  });
}

function readCheckboxes(el) {
  var setname = el.name;
  var set = document.getElementsByName(setname);
  var containerToDraw = document.getElementById(setname + "_graphs");

  Array.from(set).forEach(function(checkbox) {
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
    //paint diagram (dummyfunction)
    document.getElementById(new_id).style.width = "500px";

    document.getElementById(new_id).style.backgroundColor = "cyan";

    document.getElementById(new_id).style.margin = "20px";

    document.getElementById(new_id).innerHTML = "<h3>" + new_id + "</h3>";
    document.getElementById(new_id).style.height = "200px";
  }
}

function highlightAnchor(menuname, watchedEl) {
  //menuname is the id of the menu we will watch
  //watchedEl is the id of the container we are watching

  var vlist = [];
  var container = document.getElementById(watchedEl);
  //get a list <vlist> of elements in the watchedEl which are in Viewport
  //of those elements strip the id of "_graph"
  Array.from(container.getElementsByTagName("div")).forEach(function(el) {
    if (isInViewport(el)) {
      vlist.push(el.id.replace("_graph", ""));
    }
  });
  //remove .active class from all highlightable_entries
  var highlightables = document.getElementsByClassName("highlightable_entry");
  Array.from(highlightables).forEach(function(el) {
    el.classList.remove("active");
  });

  //iterate through all checkboxes of the watched menu (menuname) and check if checkbox.value matches the stripped id

  var checkboxes = document
    .getElementById(menuname)
    .querySelectorAll("input[type=checkbox]");
  Array.from(checkboxes).forEach(function(checkbox) {
    if (vlist.indexOf(checkbox.value) > -1) {
      //if we get a match add .active to the parent of this checkboxs container
      checkbox.parentElement.classList.add("active");
      //also add .active to the .highlightable_entry div right before the parent of the parent of the checkbox
      checkbox.parentElement.parentElement.previousSibling.previousSibling.classList.add(
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

  var follow = el.parentElement.nextSibling.nextSibling;
  var elem = el.children[0]

  if (elem.classList.contains("fa-chevron-down")) {
    console.log("expanding...");
    follow.classList.add("show");
    elem.classList.remove("fa-chevron-down");
    elem.classList.add("fa-chevron-up");
  }
  else {
    console.log("collapsing...");
    follow.classList.remove("show");
    elem.classList.remove("fa-chevron-up");
    elem.classList.add("fa-chevron-down");
  }

  if (accordion) {
    var main_menuentries = document.getElementsByClassName("main_menuentry");
    Array.from(main_menuentries).forEach(function(entry){
      if (entry != el.parentElement) {
        entry.nextSibling.nextSibling.classList.remove("show");
        var chev = entry.children[1].children[0];
        chev.classList.remove("fa-chevron-up");
        if (!chev.classList.contains("fa-chevron-down")){
          chev.classList.add("fa-chevron-down");
        }

      }
    });
  }

}
