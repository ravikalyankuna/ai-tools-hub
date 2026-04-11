const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const particles = [];

    function sizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    sizeCanvas();

    for (let i = 0; i < 40; i += 1) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            d: Math.random() * 1 + 0.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(124, 224, 211, 0.55)";

        particles.forEach((particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();

            particle.y += particle.d;
            if (particle.y > canvas.height) {
                particle.y = 0;
            }
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", sizeCanvas);
    draw();
}
