const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.height = innerHeight
canvas.width = innerWidth

const scoreUpdate = document.querySelector('#scoreUpdate')
const startGameBtn = document.querySelector('#startGameBtn')
const modalUpdate = document.querySelector('#modalUpdate')
const finalScore = document.querySelector('#finalScore')

// Centre the player on the canvas
const x = canvas.width / 2
const y = canvas.height / 2

// Create player - canvas coordinates start from top down.
let player = new Player(x, y, 10, 'white')
// Multiple bullets on screen and move independtly.
let bullets = []
// Multiple enemies on screen and move independtly.
let enemies = []
// Explosions
let particles = []

function init() {
    player = new Player(x, y, 10, 'white')
    bullets = []
    enemies = []
    particles = []
    score = 0;
    scoreUpdate.innerHTML = score
    finalScore.innerHTML = score
}


