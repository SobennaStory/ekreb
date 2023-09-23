import React, { useEffect } from 'react';
import { tsParticles } from 'tsparticles';

function Background() {
    useEffect(() => {
        tsParticles.load("tsparticles", {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                shape: {
                    type: "square"
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: false
                },
                move: {
                    random: true,
                    speed: 2,
                    direction: "none",
                    out_mode: "destroy",
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                },
                opacity: {
                    value: 0.7,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.5,
                        opacity_min: 0.1,
                    }
                },
                rotate: {
                    value: 0, // Starting rotation
                    random: true, // Random starting rotation
                    direction: "clockwise", // Can be "clockwise", "counter-clockwise", or "random"
                    animation: {
                        enable: true,
                        speed: 3, // Speed of rotation, you can adjust or make it random
                        sync: false
                    }
                }
            },
        });
    }, []);

    return <div id="tsparticles" style={{ position: 'absolute', zIndex: 1, top: 0, left: 0, width: '100%', height: '100%' }}></div>;
}

export default Background;