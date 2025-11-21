class Obstacle {
    constructor(position, width, height, color) { // inicializa obstáculo
        this.position = position; // posição X e Y
        this.width = width; // largura do obstáculo
        this.height = height; // altura do obstáculo
        this.color = color; // cor do obstáculo
    }

    draw(ctx) { // renderiza o obstáculo
        ctx.fillStyle = this.color; // define cor
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // desenha retângulo
    }

    hit(projectile) { // detecta colisão com projétil
        const projLeft = projectile.position.x; // borda esquerda do projétil
        const projRight = projectile.position.x + projectile.width; // borda direita do projétil
        const projTop = projectile.position.y; // borda superior do projétil
        const projBottom = projectile.position.y + projectile.height; // borda inferior do projétil

        const obsLeft = this.position.x; // borda esquerda do obstáculo
        const obsRight = this.position.x + this.width; // borda direita do obstáculo
        const obsTop = this.position.y; // borda superior do obstáculo
        const obsBottom = this.position.y + this.height; // borda inferior do obstáculo

        return (
            projRight >= obsLeft &&
            projLeft <= obsRight &&
            projBottom >= obsTop &&
            projTop <= obsBottom
        );
    }
}

export default Obstacle;