var currentSection;
var profilePic;
const sections = {
  "#Projects": "projects"
}
function setContent(hash){
  if(hash in sections){
    currentSection.className = "invisible";
    currentSection = document.getElementById(sections[hash]);
  }
  else{
    currentSection.className = "invisible";
    currentSection = document.getElementById("blurb");
  }
  currentSection.className = "visible";
}
window.onload = function(e){
  if (window.location.hash in sections){
    currentSection = document.getElementById(sections[window.location.hash]);
  }
  else{
    currentSection = document.getElementById("blurb");
  }
  setContent(window.location.hash);
  initializeSquares();
  resizeContainer();
}

window.onhashchange = function(e){
  setContent(window.location.hash);
  resizeContainer();
}