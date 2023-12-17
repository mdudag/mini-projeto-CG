var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 500;
var context = canvas.getContext('2d');

var esferasColetadas = 0;

var background = new Image();
background.src = "background.jpg";
var naveU = new Image();
naveU.src = "naveU.png";
var naveR = new Image();
naveR.src = "naveR.png";
var naveL = new Image();
naveL.src = "naveL.png";
var naveD = new Image();
naveD.src = "naveD.png";
var esfera = new Image();
esfera.src = "esfera.png";
var asteroide = new Image();
asteroide.src = "asteroide.png";

var sprites = [];

var mundo = {
    img: background,
    x: 0,
    y: 0,
    width: 1923,
    height: 1280
}
sprites.push(mundo);

var persona = {
    img: naveR,
    x: 0,
    y: 0,
    width: 100,
    height: 100
}
sprites.push(persona)

var esferas = [];
for (let i=0; i<20; i++) {
    esferas.push(
        {
            img: esfera,
            x: 0,
            y: 0,
            width: 50,
            height: 50,
        }
    )
}
sprites.push(esferas)

var asteroides = [];
for (let i=0; i<15; i++) {
    asteroides.push(
        {
            img: asteroide,
            x: 0,
            y: 0,
            width: 70,
            height: 69,
        }
    )
}
sprites.push(asteroides)

var cam = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    limiteL: function() {
        return this.x + (this.width * 0.25);
    },
    limiteR: function() {
        return this.x + (this.width * 0.75);
    },
    limiteU: function() {
        return this.y + (this.height * 0.25);
    },
    limiteD: function() {
        return this.y + (this.height * 0.75);
    },
}

var mvLeft = mvRight = mvUp = mvDown = false;

window.addEventListener('keydown', e => {
    var key = e.keyCode;
    switch(key) {
        case 37:
            mvLeft = true;
            break;
        case 39:
            mvRight = true;
            break;
        case 38:
            mvUp = true;
            break;
        case 40:
            mvDown = true;
            break;
    }
});

window.addEventListener('keyup', e => {
    var key = e.keyCode;
    switch(key) {
        case 37:
            mvLeft = false;
            break;
        case 39:
            mvRight = false;
            break;
        case 38:
            mvUp = false;
            break;
        case 40:
            mvDown = false;
            break;
    }
});

function atualiza() {
    if (mvUp && !mvDown) {
        persona.img = naveU;
        persona.width = 100;
        persona.height = 100;
        persona.y -= 5;
    }
    if (mvLeft && !mvRight) {
        persona.img = naveL;
        persona.width = 100;
        persona.height = 100;
        persona.x -= 5;
    }
    if (mvRight && !mvLeft) {
        persona.img = naveR;
        persona.width = 100;
        persona.height = 100;
        persona.x += 5;
    }
    if (mvDown && !mvUp) {
        persona.img = naveD;
        persona.width = 100;
        persona.height = 100;
        persona.y += 5;
    }

    if (persona.x < 0) {
        persona.x = 0;
    }
    if (persona.x + persona.width > mundo.width) {
        persona.x = mundo.width - persona.width;
    }

    if (persona.y < 0) {
        persona.y = 0;
    }
    if (persona.y + persona.height > mundo.height) {
        persona.y = mundo.height - persona.height;
    }
    
    if (cam.x < 0) {
        cam.x = 0;
    }
    if (cam.x + cam.width > mundo.width) {
        cam.x = mundo.width - cam.width;
    }
    
    if (cam.y < 0) {
        cam.y = 0;
    }
    if (cam.y + cam.height > mundo.height) {
        cam.y = mundo.height - cam.height;
    }
    
    if (persona.x < cam.limiteL()) {
        cam.x = persona.x - (cam.width * 0.25);
    }
    if (persona.x + persona.width > cam.limiteR()) {
        cam.x = persona.x + persona.width - (cam.width * 0.75);
    }
    
    if (persona.y < cam.limiteU()) {
        cam.y = persona.y - (cam.height * 0.25);
    }
    if (persona.y + persona.height > cam.limiteD()) {
        cam.y = persona.y + persona.height - (cam.height * 0.75);
    }
    
    esferas.forEach((esfera, i) => {
        if (persona.x < (esfera.x + 30) &&
            (persona.x + 70) > esfera.x &&
            persona.y < (esfera.y + 30) &&
            (persona.y + 70) > esfera.y) {
                ++esferasColetadas;
                esferas.splice(i, 1);

                if (esferas.length == 0) {
                    setTimeout(() => {
                        alert('PARABÉNS! Você coletou todas as esferas de energia.');
                        location.reload();
                    }, 200);
                }
        }
    });

    asteroides.forEach((asteroide, i) => {
        if (persona.x < (asteroide.x + 50) &&
            (persona.x + 90) > asteroide.x &&
            persona.y < (asteroide.y + 50) &&
            (persona.y + 90) > asteroide.y) {
                alert('GAME OVER: Você colidiu em um asteroide!');
                asteroides.splice(0, 15);
                location.reload();
        }
    });
}

function render() {
    context.save();
    context.translate(-cam.x, -cam.y);
    for(var i in sprites){
        var spr = sprites[i];
        if (i == 2 || i == 3) {
            spr.forEach(esfera => {
                context.drawImage(esfera.img, 0, 0, esfera.width, esfera.height, esfera.x, esfera.y, esfera.width, esfera.height);
            })
        } else {
            context.drawImage(spr.img, 0, 0, spr.width, spr.height, spr.x, spr.y, spr.width, spr.height);
        }
    }
    context.restore();
    context.font = "27px Impact";
    context.fillStyle = "#FF42AD";
    context.fillText("Esferas: "+esferasColetadas+'/'+'20', 20, 40);
    document.getElementById('musica').play();
}

function loop() {
    window.requestAnimationFrame(loop, canvas);
    atualiza();
    render();
}

cam.x = (mundo.width - cam.width)/2;
cam.y = (mundo.height - cam.height)/2;

persona.x = (mundo.width - persona.width)/2;
persona.y = (mundo.height - persona.height)/2;
persona.img = naveR;

esferas.forEach(esfera => {
    esfera.x = 50 + Math.random()*(mundo.width - 100);
    esfera.y = 50 + (Math.random()*(mundo.height - 100));
});

asteroides.forEach(asteroide => {
    asteroide.x = 70 + (Math.random()*(mundo.width - 140));
    asteroide.y = 70 + (Math.random()*(mundo.height - 140));

    if (Math.abs(persona.x - asteroide.x) < 100 && 
        Math.abs(persona.y - asteroide.y) < 100) {
        x1 = 1 - 2*Math.random();
        x2 = 1 - 2*Math.random();

        if (x1 >= 0) x1 = 1;
        else x1 = -1;
        if (x2 >= 0) x2 = 1;
        else x2 = -1;

        asteroide.x += x1*200;
        asteroide.y += x2*200;
    }
});

loop()