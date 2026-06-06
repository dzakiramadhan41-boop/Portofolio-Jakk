// Typing Effect
const text =
"Web Developer | Programmer | Mahasiswa";

let i = 0;

function ketik() {

if(i < text.length){

document.getElementById("typing").innerHTML += text.charAt(i);

i++;

setTimeout(ketik,100);

}

}

if(document.getElementById("typing")){
ketik();
}

// Jam Real Time

function updateJam(){

const sekarang = new Date();

const jam =
sekarang.toLocaleTimeString('id-ID');

const elemen =
document.getElementById("jam");

if(elemen){
elemen.innerHTML = jam;
}

}

setInterval(updateJam,1000);

// Counter Pengunjung

let visitor =
localStorage.getItem("visitor") || 0;

visitor++;

localStorage.setItem("visitor",visitor);

const v =
document.getElementById("visitor");

if(v){
v.innerHTML = visitor;
}

// Dark Mode
function toggleDark(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }else{
        localStorage.setItem("theme","light");
    }

}

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80
    },

    color: {
      value: "#38bdf8"
    },

    shape: {
      type: "circle"
    },

    opacity: {
      value: 0.5
    },

    size: {
      value: 3
    },

    move: {
      enable: true,
      speed: 2
    },

    line_linked: {
      enable: true,
      distance: 150,
      color: "#38bdf8",
      opacity: 0.4,
      width: 1
    }
  },

  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      }
    }
  }
});