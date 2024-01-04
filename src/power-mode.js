/*
Based on Joel Besada's lovely experiment
https://twitter.com/JoelBesada/status/670343885655293952
 */

import { EditorView } from "codemirror";
import { EditorManager } from "./editor-manager.js";

const SHAKE_ENABLED = true;

let shakeTime = 0,
    shakeTimeMax = 0,
    shakeIntensity = 2,
    lastTime = 0,
    particles = [],
    particlePointer = 0,
    MAX_PARTICLES = 500,
    PARTICLE_NUM_RANGE = { min: 5, max: 10 },
    PARTICLE_GRAVITY = 0.08,
    PARTICLE_ALPHA_FADEOUT = 0.96,
    PARTICLE_VELOCITY_RANGE = {
        x: [-1, 1],
        y: [-3.5, -1.5]
    },
    w = window.innerWidth,
    h = window.innerHeight,
    effect = 1;

let codemirrors = [], cmNode;
let canvas, ctx;
let throttledShake = throttle(shake, 100);
let throttledSpawnParticles = throttle(spawnParticles, 100);

function getRGBComponents(node) {
    let color = getComputedStyle(node).color;
    if (color) {
        try {
            return color.match(/(\d+), (\d+), (\d+)/).slice(1);
        } catch (e) {
            return [255, 255, 255];
        }
    } else {
        return [255, 255, 255];
    }
}

/**
 * @param {EditorView} cm
 */
function spawnParticles(cm, type) {
    let cursor = /** @type { HTMLElement } */(cm.dom.querySelector(".cm-cursor"));
    const cursorLeft = parseInt(cursor.style.left);
    const cursorTop = parseInt(cursor.style.top);
    let node = cm.root.elementFromPoint(cursorLeft - 5, cursorTop + 5);

    let numParticles = random(PARTICLE_NUM_RANGE.min, PARTICLE_NUM_RANGE.max);
    let color = getRGBComponents(node);
    for (let i = numParticles; i--;) {
        particles[particlePointer] = createParticle(cursorLeft + 10, cursorTop, color);
        particlePointer = (particlePointer + 1) % MAX_PARTICLES;
    }
}

function createParticle(x, y, color) {
    let p = {
        x: x,
        y: y + 10,
        alpha: 1,
        color: color
    };
    if (effect === 1) {
        p.size = random(2, 4);
        p.vx = PARTICLE_VELOCITY_RANGE.x[0] + Math.random() *
            (PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]);
        p.vy = PARTICLE_VELOCITY_RANGE.y[0] + Math.random() *
            (PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0]);
    } else if (effect === 2) {
        p.size = random(2, 8);
        p.drag = 0.92;
        p.vx = random(-3, 3);
        p.vy = random(-3, 3);
        p.wander = 0.15;
        p.theta = random(0, 360) * Math.PI / 180;
    }
    return p;
}

function effect1(particle) {
    particle.vy += PARTICLE_GRAVITY;
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.alpha *= PARTICLE_ALPHA_FADEOUT;

    ctx.fillStyle = 'rgba(' + particle.color[0] + ',' + particle.color[1] + ',' + particle.color[2] + ',' + particle.alpha + ')';
    ctx.fillRect(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, particle.size);
}

// Effect based on Soulwire's demo: http://codepen.io/soulwire/pen/foktm
function effect2(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= particle.drag;
    particle.vy *= particle.drag;
    particle.theta += random(-0.5, 0.5);
    particle.vx += Math.sin(particle.theta) * 0.1;
    particle.vy += Math.cos(particle.theta) * 0.1;
    particle.size *= 0.96;

    ctx.fillStyle = 'rgba(' + particle.color[0] + ',' + particle.color[1] + ',' + particle.color[2] + ',' + particle.alpha + ')';
    ctx.beginPath();
    ctx.arc(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, 0, 2 * Math.PI);
    ctx.fill();
}

function drawParticles(timeDelta) {
    let particle;
    for (let i = particles.length; i--;) {
        particle = particles[i];
        if (!particle || particle.alpha < 0.01 || particle.size <= 0.5) { continue; }

        if (effect === 1) { effect1(particle); }
        else if (effect === 2) { effect2(particle); }
    }
}

/**
 * @param {EditorView} editor
 * @param {number} time
 */
function shake(editor, time) {
    cmNode = editor.root;
    shakeTime = shakeTimeMax = time;
}

function random(min, max) {
    if (!max) { max = min; min = 0; }
    return min + ~~(Math.random() * (max - min + 1))
}

function throttle(callback, limit) {
    let wait = false;
    return function() {
        if (!wait) {
            callback.apply(this, arguments);
            wait = true;
            setTimeout(function() {
                wait = false;
            }, limit);
        }
    }
}

const FPS_INTERVAL = 0.02;

function loop() {
    if (!EditorManager.isPowerModeOn()) { return; }

    // get the time past the previous frame
    let current_time = new Date().getTime();
    if (!lastTime) lastTime = current_time;
    let dt = (current_time - lastTime) / 1000;

    if (dt < FPS_INTERVAL) {
        requestAnimationFrame(loop);
        return;
    }
    lastTime = current_time;

    ctx.clearRect(0, 0, w, h);


    if (shakeTime > 0) {
        shakeTime -= dt;
        let magnitude = (shakeTime / shakeTimeMax) * shakeIntensity;
        let shakeX = random(-magnitude, magnitude);
        let shakeY = random(-magnitude, magnitude);
        EditorManager.getEditor().dom.style.transform = 'translate(' + shakeX + 'px,' + shakeY + 'px)';
    }
    drawParticles();
    requestAnimationFrame(loop);
}

function onCodeMirrorChange() {
    const editor = EditorManager.getEditor();
    // If shake
    if (SHAKE_ENABLED) {
        throttledShake(editor, 0.3);
    }
    throttledSpawnParticles(editor);

}


export function initPowerMode() {

    if (!canvas) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        canvas.id = 'code-blast-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "1";
        canvas.style.pointerEvents = 'none';
        canvas.width = w;
        canvas.height = h;

        document.body.appendChild(canvas);
        loop();
    }

    const inputHandler = EditorView.inputHandler.of(() => {
        onCodeMirrorChange();
        // We don't want to disrupt, only listen.
        return false;
    });

    return inputHandler;
}

export function restartPowerMode() {
    loop();
}
