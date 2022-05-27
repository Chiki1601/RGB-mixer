const BOTTLES = {
  RED: document.querySelector(".bottles > .bottle.red"),
  GREEN: document.querySelector(".bottles > .bottle.green"),
  BLUE: document.querySelector(".bottles > .bottle.blue")
};
const SWITCHER = document.querySelector(".switch");
const GLASS = document.querySelector(".glass");
const FILL = document.getElementById("filling");
const reset = document.getElementById("reset");

let running = false;
let timeout;
let interval;
let selected;
let selectedPour;
let currentColor;
let currentItems = [];
let mixed = false;

let red = "#e6575a";
let green = "#4DA45A";
let blue = "#4D57F3";

for (let bottle in BOTTLES) {
  BOTTLES[bottle].onclick = selectBottle;
}
reset.onclick = resetItems;
SWITCHER.onclick = shakeMixer;

function selectBottle(e) {
  if(mixed)
    resetItems();

  if (!running) {
    mixed = false;
    running = true;

    if (e.target.classList.contains("red")) {
      selected = BOTTLES.RED;
      selectedPour = selected.children[1];
      currentColor = red;
    } else if (e.target.classList.contains("green")) {
      selected = BOTTLES.GREEN;
      selectedPour = selected.children[1];
      currentColor = green;
    } else {
      selected = BOTTLES.BLUE;
      selectedPour = selected.children[1];
      currentColor = blue;
    }
    
    reset.style.display = "block";
    selected.classList.add("pour");
    selectedPour.classList.add("active");
    
    if(!currentItems.includes(currentColor))
      currentItems.push(currentColor);
    
    setBackground();

    timeout = setTimeout(() => {
      finishCurrent();
    }, 3000);
  } else {
    mixed = false;
    if (selected && selected.classList[1] !== e.target.classList[1]) {
      finishCurrent(selected, selectedPour);
      selectBottle(e);
    }
  }
}

function finishCurrent() {
  selected.classList.remove("pour");
  selectedPour.classList.remove("active");
  running = false;
  clearTimeout(timeout);
  clearInterval(interval);
  GLASS.classList.remove("shaking");
}

function setBackground() {
  FILL.style.height = `${currentItems.length*25}%`;
  
  setTimeout(() => {
    FILL.style.background = currentItems.length > 1 ? `linear-gradient(to top right, ${currentItems.toString()})` : currentItems[0];
  }, 2000);
}

function resetItems () {
  FILL.style.background = "";
  FILL.style.height = "0%";
  currentItems = [];
  currentColor = null;
  finishCurrent();
  reset.style.display = "none";
  GLASS.classList.remove("shaking");
}

function shakeMixer() {
  mixed = true;
  GLASS.classList.add("shaking");
  SWITCHER.classList.add("mixerOn");
  setTimeout(() => {
    SWITCHER.classList.remove("mixerOn");
    GLASS.classList.remove("shaking");
    FILL.style.background = getResultBackground();
  }, 1000);
}

function getResultBackground() {
  if(currentItems.length === 0)
    return "";
  if(currentItems.length === 1)
    return currentItems[0];
  if(currentItems.length === 3)
    return "#FFF";
  else {
    if(currentItems.includes(red)) {
      if(currentItems.includes(blue))
        return "#FE65FE";
      else
        return "#FDFD64";
    } else {
      return "#00FFFF";
    }
  }
}