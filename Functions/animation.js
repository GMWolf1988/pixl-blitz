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