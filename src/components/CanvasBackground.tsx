import { memo, useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
}

const PARTICLE_COLORS = ['#3b82f6', '#8b5cf6', '#4ade80'] as const;
const PARTICLE_COUNT = 40;
const MAX_LINK_DISTANCE = 150;
const MAX_LINK_DISTANCE_SQUARED = MAX_LINK_DISTANCE * MAX_LINK_DISTANCE;
const MAX_LINK_ALPHA = 0.05;

const createParticle = (width: number, height: number): Particle => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
});

export const CanvasBackground = memo(function CanvasBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        let animationFrameId = 0;
        let resizeFrameId = 0;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width;
            canvas.height = height;

            particles = new Array(PARTICLE_COUNT);
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles[i] = createParticle(width, height);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x > width) particle.x = 0;
                else if (particle.x < 0) particle.x = width;

                if (particle.y > height) particle.y = 0;
                else if (particle.y < 0) particle.y = height;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            }

            // Draw lines between close particles.
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;

            for (let i = 0; i < particles.length - 1; i++) {
                const first = particles[i];

                for (let j = i + 1; j < particles.length; j++) {
                    const second = particles[j];
                    const dx = first.x - second.x;
                    const dy = first.y - second.y;
                    const distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < MAX_LINK_DISTANCE_SQUARED) {
                        const distance = Math.sqrt(distanceSquared);
                        ctx.beginPath();
                        ctx.globalAlpha = (1 - distance / MAX_LINK_DISTANCE) * MAX_LINK_ALPHA;
                        ctx.moveTo(first.x, first.y);
                        ctx.lineTo(second.x, second.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            cancelAnimationFrame(resizeFrameId);
            resizeFrameId = requestAnimationFrame(init);
        };

        init();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            cancelAnimationFrame(resizeFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
});
