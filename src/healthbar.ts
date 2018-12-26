import { Actor, Color } from "excalibur";

class HealthBar extends Actor{
    health: number;
    maxHealth: number;
    // how far above player the health bar is displayed
    above: number = -15;
    sizeMultiplier = 1.5;
    vertHeight: number = 5;
    
    setDimension() {
        this.setWidth(this.health * this.sizeMultiplier)
    }
    
    getHealth():number {
        return this.health;
    }

    empty(): boolean {
        return this.health <=0;
    }

    change(health: number) {
        this.health += health;
        if (this.health > this.maxHealth)
            this.health = this.maxHealth;
        else if (this.health < 0)
            this.health = 0;
    }

    getHealthRatio(): number {
        return this.health/this.maxHealth;
    }
    
    getHealthPercent(): number {
        return this.getHealthRatio() * 100;
    }
    
    setColor() {
        let r = 255 - 255 * this.getHealthRatio();
        let g = 255 * this.getHealthRatio();
        this.color.r = r;
        this.color.g = g;
        this.color.b = 0;
    }
    
    constructor(health: number) {
        super()
        this.health = health;
        this.maxHealth = health;
        this.color = new Color(0,255,0);
        this.setDimension();
        this.setHeight(this.vertHeight);
        this.x = 0;
        this.y = this.above;
    }
    
    update() {
        this.setColor();
        this.setDimension();
    }
}

export default HealthBar;