let alive = true;
let LOG_FPS=true; 
let LOG_TIME=true;
let SHOW_HITBOXES = false;
let Pi = Math.PI;
let time = 0;
let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};

//Canvas
let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext('2d');

let keysDown = {};
let starttime = now;
let score = 0;
let endscore = 0;
let missiles = [];
let asteroids = [];
let points = [];
let money = 0;
let cooldownlvl = 0;
let rotatelvl = 0;
let speedlvl = 0;
let forShopThree = true;
let difficultylevel = 1;
let images = {};

let init = function(){
    //Rzeczy dziejące się na początku
    images.missileImage = new Image();
    images.missileImage.src = 'assets/pocisk.png';
    images.shipImage = new Image();
    images.shipImage.src = 'assets/statek.png';
    images.asteroidImage = new Image();
    images.asteroidImage.src = 'assets/meteoryt.png';
    images.pointImage = new Image();
    images.pointImage.src = 'assets/punkty.png';

};

//Logika gry (w każdej klatce)
let update = function (){
	//Update time and FPS
    let newTime=Date.now()/1000;
    let delta=(newTime-now);
    now=newTime;
    fpsCalculator.update();
    if(LOG_TIME) document.getElementById('timeLog').innerHTML = Math.round((now%100000)*100)/100;
    ship.update(delta);
    if(keysDown["1"] && money >= 6 && forShopOne && cooldownlvl < 10){
        cooldown = cooldown * 0.9
        money = money - 6
        forShopOne = false
        cooldownlvl++
    }
    if(!keysDown["1"]){
        forShopOne = true
    }
    if(keysDown["2"] && money >= 4 && forShopTwo && rotatelvl<10){
        shipAngleChange = shipAngleChange * 1.15
        money = money - 4
        forShopTwo = false
        rotatelvl++;
    }
    if(!keysDown["2"]){
        forShopTwo = true
    }
    if(keysDown["3"] && money >= 5 && forShopThree && speedlvl<10){
        ship.acceleration = ship.acceleration * 1.15
        ship.maxSpeed = ship.maxSpeed * 1.05
        money = money - 5
        forShopThree = false
        speedlvl++;
    }
    if(!keysDown["3"]){
        forShopThree = true
    }
    if(points.length < 20 && now >= helppoint + pointdown){
            points.push(new Point(this));
            helppoint = now;
    }
        for(let i=0; i<points.length; i++){
            if(circleCollide(ship, points[i])){
                points.splice(i,1);
                money +=1;
            }
        }
    for( let i = 0; i < missiles.length; i++) {
    	missiles[i].update(delta);
    }
    for (let i = 0; i < missiles.length;i++){
		if(missiles[i].forDeletion()){
			missiles.splice(i,1);
		}
	}
    for (let i = asteroids.length -1; i >= 0;i--){
    if(asteroids[i].Destroyed()){
        if(asteroids[i].radius <= 45){
            score += 5;
        }
        if(45 < asteroids[i].radius && asteroids[i].radius <= 90){
            score += 10;
        }
        if(asteroids[i].radius > 90){
            score += 15;
        }
        asteroids.splice(i,1);
    }
  }
    if(time > 3/difficultylevel){
        asteroids.push(new Asteroid());
        time = 0;
    }
    time += delta;
        for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update(delta,i);
        }
            if(keysDown["r"]||keysDown["R"]){
        restart();
    }
    difficultylevel = (((now - starttime)/2 - Math.sin((now-starttime)/2))/13+1)**(4/5);
};

//Rysowanie klatki
let render = function (){
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if(alive){
        for( let i = 0; i < missiles.length; i++) {
            missiles[i].render();
        }
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].render();
        }
        for(let i = 0; i < points.length; i++){
            points[i].render();
        }
        ship.render();
        context.fillStyle = "#33ff33";
        context.font = '40px serif';
        context.fillText("Poziom: " + Math.floor((now-starttime)/(4*Pi)), 690, 30);
        context.fillStyle = "#ff2222";
        context.font = '40px serif';
        context.fillText(Math.round(((now-starttime)%100000)*10)/10, 1090, 30);
        context.fillStyle = "#ff2222";
        context.font = '40px serif';
        context.fillText("czas:",1002, 30);
        context.fillStyle = "#ffaa22";
        context.font = '40px serif';
        context.fillText(Math.round(((now-starttime+score)%100000)*10)/10, 1390, 30);
        context.fillStyle = "#ffaa22";
        context.font = '40px serif';
        context.fillText("wynik:",1270, 30);
        context.fillStyle = "#aaaaaa";
        context.font = '40px serif';
        context.fillText("Mniejszy cooldown, cena - 6 (1)", 100, 65);
        context.fillText("lvl", 20, 30)
        if(cooldownlvl<10){
            context.fillText(cooldownlvl, 20, 65);
        }else{
            context.fillText("max", 20, 65);
        }
        if(rotatelvl<10){
            context.fillText(rotatelvl, 20, 100);
        }else{
            context.fillText("max", 20, 100);
        }
        context.fillText("Kasa:" + money, 100, 30)
        context.fillText("Szybsze obracanie, cena - 4 (2)", 100, 100);
        if(speedlvl<10){
            context.fillStyle = "#aaaaaa";
            context.font = '40px serif';
            context.fillText(speedlvl, 20, 135);
        }else{
            context.fillStyle = "#aaaaaa";
            context.font = '40px serif';
            context.fillText("max", 20, 135);
        }        context.fillStyle = "#aaaaaa";
        context.font = '40px serif';
        context.fillText("Wieksza predkosc statku, cena - 5 (3)", 100, 135);
    }else{
        context.fillStyle = "#ffffff";
        context.font = '100px serif';
        context.fillText("GAME OVER",600, 600);
        context.fillStyle = "#ffffff";
        context.font = '60px serif';
        context.fillText("Final Score: " + Math.floor(endscore),720, 720);
        context.font = '45px serif';
        context.fillText('Click "r" to restart',720, 800);
    }

};
//Math.round((now%100000)*100)/100




//Ogarnianie klawiatury
window.addEventListener("keydown", function (event) { 
    if(!keysDown[event.key]){
      	document.getElementById('keyCode').innerHTML = event.key;
      	keysDown[event.key] = true;
      	
        //Tutaj wydarzenia reagujące na wciśnięcie przycisku klawiatury
      }
    });

    window.addEventListener("keyup", function (event) {
      delete keysDown[event.key];
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
    			this.fps= this.framesSinceLastCheck/(now-this.lastCheck);
    			this.lastCheck=now;
    			this.framesSinceLastCheck=0;
    			if(LOG_FPS) document.getElementById('fpsLog').innerHTML = Math.round(this.fps);
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
    animate(step);
/* TODO list:
shop fix
zwiekszanie poziomu trudnosci fix
menu start
*/
