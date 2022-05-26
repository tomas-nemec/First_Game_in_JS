//objekty typu tlacitko, zvuk, obrazok

class BaseObject {
    constructor(x,y,width,height,) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    onClickHandler = null;
    onMouseUpHandler = null;
    onMouseDownHandler = null;

    render(ctx) {
        const {x, y, width, height} = this;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    handleEvent(ev) {
        if (this.onClickHandler && this.isClicked(ev)) {
            this.onClickHandler(ev);
        }
    }

    onClick(fn) {
        this.onClickHandler = fn;
    }
    
    isClicked(ev) {         
        if (isMouseClickEvent(ev)) {
            const mouseX = ev.offsetX;  //vracia x suradnicu mysky
            const mouseY = ev.offsetY;  //vracia y suradnicu mysky
            if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}







class ImageButton extends BaseObject {
    constructor(x,y,width,height,obrazok,) {
        super(x, y, width, height);

        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource(obrazok);
    }

    render(ctx) {
        const {image, x, y, width, height} = this;
        ctx.drawImage(image, x, y, width, height);
    }
}








class TextButton extends BaseObject {
    constructor(x,y,width,height,size,label,) 
    {
        super(x, y, width, height);
        this.label = label;
        this.size = size;
    }

   

    render(ctx) {
        const {label, x, y, width} = this;

        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(x-5,y,width+10,this.size+10);
        ctx.font = `${this.size}px Verdana`;
        ctx.fillStyle = "red";
        
        ctx.fillText(label,x,y+this.size, width);
        ctx.restore();
    }
}







//vytvorit managera
class Sound {
    constructor (src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
    }
    play(){
        this.sound.play();
    }
    stop(){
        this.sound.pause();
    }
    
}







class Pictures extends BaseObject {
    constructor(x,y,width,height,obrazok){
        super(x,y,width,height)
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource(obrazok);
    }
    
    render(ctx) {
        const {image, x, y, width, height} = this;
        ctx.drawImage(this.image, x, y, width, height);
    }
}








class ZvukButton extends BaseObject{
    constructor(x,y,width,height) {
        super(x, y, width, height);

        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('SoundOff');
    }

    

    render(ctx) {
        ctx.save()
        if(mute){
            this.image = resourceManager.getImageSource('SoundOff');
        }
        if(mute == 0){
            this.image = resourceManager.getImageSource('SoundOn');
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
