import React, { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const PARTICLE_COUNT = 60;
const LINE_DISTANCE = 100; // Maximum distance for drawing lines between particles

function randomBetween(a, b) {
     return a + Math.random() * (b - a);
}

function drawParticle(ctx, x, y, size, color) {
     ctx.beginPath();
     ctx.arc(x, y, size, 0, Math.PI * 2);
     ctx.fillStyle = color;
     ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2, color, alpha) {
     ctx.beginPath();
     ctx.moveTo(x1, y1);
     ctx.lineTo(x2, y2);
     ctx.strokeStyle = color;
     ctx.globalAlpha = alpha;
     ctx.stroke();
}

const Background = () => {
     const canvasRef = useRef(null);
     const { theme } = useTheme();

     useEffect(() => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          let width = window.innerWidth;
          let height = window.innerHeight;
          canvas.width = width;
          canvas.height = height;

          const color = theme === "dark" ? "#d1d5db" : "#374151";

          // Particle data
          const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
               x: randomBetween(0, width),
               y: randomBetween(0, height),
               size: randomBetween(2, 4),
               dx: randomBetween(-0.5, 0.5),
               dy: randomBetween(-0.5, 0.5),
               shine: randomBetween(0.3, 0.8),
               shineDir: Math.random() > 0.5 ? 1 : -1,
          }));

          function animate() {
               ctx.clearRect(0, 0, width, height);

               // Draw lines between nearby particles
               ctx.lineWidth = 0.5;
               for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                         const dx = particles[i].x - particles[j].x;
                         const dy = particles[i].y - particles[j].y;
                         const distance = Math.sqrt(dx * dx + dy * dy);
                         
                         if (distance < LINE_DISTANCE) {
                              const alpha = (1 - distance / LINE_DISTANCE) * 0.2;
                              drawLine(ctx, particles[i].x, particles[i].y, 
                                   particles[j].x, particles[j].y, color, alpha);
                         }
                    }
               }

               particles.forEach(p => {
                    // Move
                    p.x += p.dx;
                    p.y += p.dy;

                    // Bounce off edges
                    if (p.x < 0 || p.x > width) p.dx *= -1;
                    if (p.y < 0 || p.y > height) p.dy *= -1;

                    // Shine effect
                    p.shine += p.shineDir * 0.005;
                    if (p.shine > 0.8 || p.shine < 0.3) p.shineDir *= -1;

                    ctx.save();
                    ctx.globalAlpha = p.shine;
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15 * p.shine;
                    drawParticle(ctx, p.x, p.y, p.size, color);
                    ctx.restore();
               });
               requestAnimationFrame(animate);
          }

          animate();

          const handleResize = () => {
               width = window.innerWidth;
               height = window.innerHeight;
               canvas.width = width;
               canvas.height = height;
          };
          window.addEventListener("resize", handleResize);

          return () => {
               window.removeEventListener("resize", handleResize);
          };
     }, [theme]);

     return (
          <canvas
               ref={canvasRef}
               style={{
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 0,
                    pointerEvents: "none",
               }}
          />
     );
};

export default Background;
