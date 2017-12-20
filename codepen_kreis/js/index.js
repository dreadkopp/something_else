function rotate() {
  
  document.getElementById("arrow").classList.add("rotate");
  
  setTimeout(function(){
    document.getElementById("arrow").classList.remove("rotate");
  }, 2000)
}

function scale() {
  
  document.getElementById("kreis").style.transform = "scale(2)";;
  
  setTimeout(function(){
    document.getElementById("kreis").style.transform = "scale(1)";
  }, 2000)
}