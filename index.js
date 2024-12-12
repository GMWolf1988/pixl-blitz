const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.height = innerHeight
canvas.width = innerWidth

const scoreUpdate = document.querySelector('#scoreUpdate')
const startGameBtn = document.querySelector('#startGameBtn')
const modalUpdate = document.querySelector('#modalUpdate')
const finalScore = document.querySelector('#finalScore')

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    // Draw player.
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false )
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Bullet {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    // Updating classes properties.
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

    // Draw bullet.
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false )
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    // Updating classes properties.
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false )
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    // Updating classes properties.
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false )
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
}

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

// Spawn enemies
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4

        let x 
        let y

        if (Math.random() < 0.5 ) {
            x = Math.random() < 0.5 ? 0 - radius : canvas
                .width + radius
            y = Math.random() * canvas.height
    
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas
                .height + radius
        }

        // Using a temperate literal to colour enemies randomly.
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(
            canvas.height / 2 - y, 
            canvas.width / 2 - x
        )
   
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000 )
}

let animationId
let score = 0

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle,index) => {
        if (particle.alpha <= 0){
            particles.splice(index, 1)
        }else{
            particle.update()
        }
    })

    bullets.forEach((bullet, index)  => {
        bullet.update()

        // Bullet removed from game once of screen.
        if (bullet.x + bullet.radius < 0 || 
            bullet.x - bullet.radius > canvas.width ||
            bullet.y + bullet.radius < 0 ||
            bullet.y - bullet.radius > canvas.height){
            setTimeout(() => {
                bullets.splice(index, 1)
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        // End game.
        if (dist - enemy.radius - player.radius < 1 ){
            cancelAnimationFrame(animationId)
            modalUpdate.style.display = "flex"
            finalScore.innerHTML = score
        }

        bullets.forEach((bullet, bulletIndex) => {
        const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y)
            
        // Enemy and bullet colliding
        if (dist - enemy.radius - bullet.radius < 1 ){
           
            // Creating particle explosions
            for (let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(bullet.x, bullet.y, 
                    Math.random() * 2, enemy.color, 
                    {
                        x: Math.random() - 0.5 * (Math.random() * 7),
                        y: Math.random() - 0.5 * (Math.random() * 7)
                    })
                )
            }
            
            // Enemy shrinking
            if(enemy.radius - 10 > 5){

                // Increase Score
                score +=100
                scoreUpdate.innerHTML = score

                gsap.to(enemy, {
                    radius: enemy.radius - 10
                })
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1)
                    }, 0)
            }else{

                // More points for removing enemy fully.
                score += 250
                scoreUpdate.innerHTML = score

                setTimeout(() => {
                    enemies.splice(index, 1)
                    bullets.splice(bulletIndex, 1)
                    }, 0)
                }
            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2
    )
   
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    bullets.push(new Bullet(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalUpdate.style.display = 'none'
})

