class Obstacle {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    hit(projectile) {
    const projLeft = projectile.position.x;
    const projRight = projectile.position.x + projectile.width;
    const projTop = projectile.position.y;
    const projBottom = projectile.position.y + projectile.height;

    const obsLeft = this.position.x;
    const obsRight = this.position.x + this.width;
    const obsTop = this.position.y;
    const obsBottom = this.position.y + this.height;

    return (
        projRight >= obsLeft &&
        projLeft <= obsRight &&
        projBottom >= obsTop &&
        projTop <= obsBottom
    );
}

}

export default Obstacle;