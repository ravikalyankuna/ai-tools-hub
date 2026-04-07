const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 40; i++) {
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*2,
        d: Math.random()*1
    });
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="rgba(99,102,241,0.5)";

    particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();

        p.y+=p.d;

        if(p.y>canvas.height){
            p.y=0;
        }
    });

    requestAnimationFrame(draw);
}

draw();