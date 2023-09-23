import { tsParticles } from "tsparticles";

export const triggerConfetti = () => {
    tsParticles.load("confetti", {
        particles: {
            number: {
                value: 300,
            },
            color: {
                value: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"], // Array of colors
            },
            shape: {
                type: ["circle", "square"],
            },
            size: {
                value: 5,
                random: true,
                anim: {
                    enable: true,
                    speed: 5,
                    size_min: 0.1,
                    sync: false,
                },
            },
            opacity: {
                anim: {
                    enable: true,
                },
            },
            move: {
                enable: true,
                speed: 20,
                direction: "top", // This will make the confetti burst upwards
                random: true,
                straight: false,
                out_mode: "destroy", // The particles will disappear after reaching the canvas edge (bottom in this case)
                bounce: false,
                gravity: {
                    enable: true, // Enabling gravity to pull the confetti back down
                    acceleration: 20
                },
                attract: {
                    enable: false,
                },
            },
            life: {
                duration: {
                    sync: true,
                    value: 2,
                },
                count: 1
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: false,
                },
                onclick: {
                    enable: false,
                },
                resize: true,
            },
        },
        retina_detect: true,
    });

    // Stop the confetti after a short duration.
    setTimeout(() => {
        tsParticles.domItem("confetti").destroy();
    }, 5000);
};