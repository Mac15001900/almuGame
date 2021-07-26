let LOG_FPS=true; 
let LOG_TIME=true;

let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

//Canvas
let canvas = document.getElementById("mainCanvas");
//canvas.width = 1000;
//canvas.height = 1000;
let context = canvas.getContext('2d');

let now = Date.now()/1000;
let keysDown = {};

let init = function(){

  //Rzeczy dziejące się na początku  

};

//Logika gry (w każdej klatce)
let update = function (){
	//Update time and FPS
    let newTime=Date.now()/1000;
    let delta=(newTime-now);
    now=newTime;
    fpsCalculator.update();
    if(LOG_TIME) document.getElementById('timeLog').innerHTML = now%100000;
};

//Rysowanie klatki
let render = function (){
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
};

//Ogarnianie klawiatury
window.addEventListener("keydown", function (event) {
  if(!keysDown[event.keyCode]){
  	//Misja: aktualizacja keyCode
  	keysDown[event.keyCode] = true;
    //Tutaj wydarzenia reagujące na wciśnięcie przycisku klawiatury
  }
});

window.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
  //Tutaj wydarzenia reagujące na odciśnięcie przycisku klawiatury
});

//Ogarnianie myszki
canvas.addEventListener("mousedown", function (event){
	let mouseX = event.pageX; //Koordynaty kliknięcia
	let mouseY = event.pageY;
    //Tutaj wydarzenia reagujące na kliknięcie myszką
}, false);


//Kalkulator mierzący FPS
let fpsCalculator = {
	lastCheck: now,
	fps: 0,
	framesSinceLastCheck: 0,
	update: function () {
		this.framesSinceLastCheck++;
		if(now>this.lastCheck+1){
			this.fps=this.framesSinceLastCheck/(now-this.lastCheck);
			this.lastCheck=now;
			this.framesSinceLastCheck=0;
			if(LOG_FPS) document.getElementById('fpsLog').innerHTML = this.fps;
		}
	}
}

//Starting the game
let step = function () {
    update();
    render();
    animate(step);
};

init();
document.body.appendChild(canvas);
animate(step);