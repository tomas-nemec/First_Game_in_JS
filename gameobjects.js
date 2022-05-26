// https://html5.litten.com/understanding-save-and-restore-for-the-canvas-context/

class prekazky {        //auto,voda,skala,nic
    // Initialization
    constructor(obrazok,x,y,width,height,speed,stav) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource(obrazok);
    
        this.x = x;            
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.stav = stav;   //auto,voda,nic,skala
        
    }
  
    // pohyb auticka
    move(dt) {              //dt je premmena v hodnote od 0.15 po 0.33
        const canvas = this.canvas;
        if (this.x > canvas.width+this.width) {
            this.x = 0-(this.width/2)
            
        }
        if (this.x < 0-this.width) {
            this.x = canvas.width+(this.width/2)
        }
    
        this.x -= this.speed * dt
        
        
    }
  
    render(ctx) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.drawImage(this.image, 0, 0, this.width, this.height)
      ctx.restore()
    }
}



/////////// GLOBALNE PREMENNE

var ZabaPozicia = 1;

var GLOBAL_x = 0;   //toto si uklada poziciu predoslu ked narazi na skalu
var GLOBAL_y = 0;


class frogger {
    constructor(x, y, width, height) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('frogger');
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.uhol = 0;
        this.startX=(this.canvas.width/10)*6;
        this.startY=(this.canvas.width/10)*9;

        this.zvuk_move = new Sound("zvuk/zvuk_zaba.wav"); //tu dam iba zaba_move a prerobit kus class sound
    }
    
    
    
    //pohyb zabky
    movement(ev) {
        if(ALIVE==1){   //ak frogger zije, moze sa pohybovat
            GLOBAL_x = this.x;
            GLOBAL_y = this.y;
            if(ev.key === 'd'){
                this.image = resourceManager.getImageSource('frogger1'); //navrat na frogera po restarte 
                if(mute==1){
                    this.zvuk_move.play();
                }
    
                POHYB = 1;
                if(this.x+this.width<this.canvas.width){
                    this.x += this.canvas.width/10;
                }
                this.uhol = 0;
                this.uhol = 90 * Math.PI / 180;
                
                
    
            }
            if(ev.key === 'a'){
                this.image = resourceManager.getImageSource('frogger1'); //navrat na frogera po restarte 
                POHYB = 1;
                if(mute==1){
                    this.zvuk_move.play();
                }
                //console.log("ahoj "+this.x+this.y);
                if(this.x>0){
                    this.x -= this.canvas.width/10;
                }
                this.uhol=0;
                this.uhol = -90 * Math.PI / 180;
                
                
            }
            if(ev.key === 'w'){
                this.image = resourceManager.getImageSource('frogger1'); //navrat na frogera po restarte 
                POHYB = 1;
                if(mute==1){
                    this.zvuk_move.play();
                }
                //console.log("ahoj "+this.x+this.y);
                if(this.y>0){
                    this.y -= this.canvas.width/10;
                }
                this.uhol=0
                
    
            }
            if(ev.key === 's'){
                this.image = resourceManager.getImageSource('frogger1'); //navrat na frogera po restarte 
                POHYB = 1;
                if(mute==1){
                    this.zvuk_move.play();
                }
                //console.log("ahoj "+this.x+this.y);
                if(this.y+this.height<this.canvas.width){
                    this.y += this.canvas.width/10;
                }
                this.uhol=0;
                this.uhol = 180 * Math.PI / 180;
            }
        }
       
    }

    
    

    render(ctx) {
        ctx.save()
        ctx.translate(this.x+this.width/2,this.y+this.width/2);
        ctx.rotate(this.uhol);
        ctx.drawImage(this.image, this.width/-2, this.height / -2, this.width, this.height);
        
        ctx.restore();
    }
}








class Background {
    constructor(x,y,) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('bg');
    
        this.x = x;
        this.y = y;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    render(ctx) {
        ctx.save()
        ctx.drawImage(this.image, this.x, this.y, this.canvas.width, this.height);
        ctx.restore()
    }
}