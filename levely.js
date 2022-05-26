class level1 extends GameState{
    constructor(manager,ctx,zaba,zvuk_move,bg_image){
        super(manager,ctx,zaba,zvuk_move,bg_image);
        this.bgImage = resourceManager.getImageSource('bg1');
        //auta
        for (let i = 0; i < 400; i+=250) {
            this.objects.push(new prekazky('auto1',500-i,250,50,50,2,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto2',0+i,300,50,50,-1,'auto'));
            this.objects.push(new prekazky('auto3',450-i,350,50,50,2,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto4',50+i,400,50,50,-1,'auto'));     
        }
        //voda
        for(let i = 0;i<=300;i+=150){
            this.objects.push(new prekazky('drevo',300-i*1.5,150,100,50,-2,'voda')); 
            this.objects.push(new prekazky('drevo',500-i,50,100,50,2,'voda'));
        }
        //korytnacka
        for(let i=0;i<=400;i+=100){
            this.objects.push(new prekazky('pancier',0+i,100,50,50,-3,'voda'));
        }
    }




    
    gameWinning(){
        if(this.zaba.y<=0){
            console.log("dosiahol si dalsi level");
            if(mute==1){
                this.zvuk_win.play();
            }
            level+=1;
            console.log(level+"a zivoty: "+this.zivoty);
            this.zaba.x=this.zaba.startX;
            this.zaba.y=this.zaba.startY;
            console.log(global_time);
            this.stateManager.changeState(STATES.LEVEL2);           //tu by som nejako iba menil premennukonecne cislo alebo osobitne winning funkcia pre kazdy level
        }
    }
       
}










class level2 extends GameState{
    constructor(manager,ctx,zaba,zvuk_move){
        super(manager,ctx,zaba,zvuk_move);
        this.bgImage = resourceManager.getImageSource('bg2');
        //auta
        for (let i = 0; i <= 300; i+=150) {
            this.objects.push(new prekazky('auto1',500-i,250,50,50,8,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto2',0+i,300,50,50,-6,'auto'));
            this.objects.push(new prekazky('auto3',450-i,350,50,50,8,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto4',50+i,400,50,50,-6,'auto'));     
        }
        //voda
        for(let i = 0;i<=300;i+=150){
            this.objects.push(new prekazky('drevo',300-i*1.5,150,100,50,-8,'voda')); 
            this.objects.push(new prekazky('drevo',500-i,50,100,50,8,'voda'));
        }
        //korytnacka
        for(let i=0;i<=400;i+=100){
            this.objects.push(new prekazky('pancier',0+i,100,50,50,-12,'voda'));
        }

        // skala
        this.objects.push(new prekazky('skala',300,200,50,50,0,'skala'));
    }




    gameWinning(){
        if(this.zaba.y<=0 && ((this.zaba.x<=canvas.width/10) || (this.zaba.x>=canvas.width/10*8) || ((this.zaba.x<=canvas.width/10*6) && (this.zaba.x>=canvas.width/10*4)) )){
            console.log("dosiahol si dalsi level");
            level+=1;
            if(mute==1){
                this.zvuk_win.play();
            }
            
            this.zaba.x=this.zaba.startX;
            this.zaba.y=this.zaba.startY;
            this.stateManager.changeState(STATES.LEVEL3);           //tu by som nejako iba menil premennukonecne cislo alebo osobitne winning funkcia pre kazdy level
        }
    }

}






class level3 extends GameState{
    constructor(manager,ctx,zaba,zvuk_move){
        super(manager,ctx,zaba,zvuk_move);
        this.bgImage = resourceManager.getImageSource('bg3');
        //auto
        for (let i = 0; i <= 300; i+=150) {
            this.objects.push(new prekazky('auto1',500-i,250,50,50,15,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto2',0+i,300,50,50,-12,'auto'));
            this.objects.push(new prekazky('auto3',450-i,350,50,50,15,'auto'));    //vklada do pola objekty
            this.objects.push(new prekazky('auto4',50+i,400,50,50,-12,'auto'));     
        }
        //voda
        for(let i = 0;i<=300;i+=150){
            this.objects.push(new prekazky('drevo',300-i*1.5,150,100,50,-16,'voda')); 
            this.objects.push(new prekazky('drevo',500-i,50,100,50,16,'voda'));
        }
        //korytnacka
        for(let i=0;i<=400;i+=100){
            this.objects.push(new prekazky('pancier',0+i,100,50,50,-22,'voda'));
        }
        
        //skaly
        this.objects.push(new prekazky('skala',100,200,50,50,0,'skala'));
        this.objects.push(new prekazky('skala',300,200,50,50,0,'skala'));
    }




    gameWinning(){
        if(this.zaba.y<=0 && (((this.zaba.x<=canvas.width/10*6) && (this.zaba.x>=canvas.width/10*4)) )) {
            console.log("dosiahol si dalsi level");
            level=1;
            if(mute==1){
                this.zvuk_win.play();
            }
            
            
            this.zaba.x=this.zaba.startX;
            this.zaba.y=this.zaba.startY;
            console.log(global_time+"    "+level);
            
            this.stateManager.changeState(STATES.WIN_GAME);           //tu by som nejako iba menil premennukonecne cislo alebo osobitne winning funkcia pre kazdy level
        }
    }
  
}