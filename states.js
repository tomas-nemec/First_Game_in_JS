//vsetky states hry, ktore mozu nastat
var mute = 1; //global premenna ku zvuku



// TU sa riesia vsetky tie stavy ktore mozu nastat
const STATES = {                        //vytvorime si rozne stavy hry, ktore mozu nastat GAME OVER, START GAME, MAIN MENU, INFORMATIONS
    GAME: 'gameState',
    LEVEL1: 'level1',
    LEVEL2: 'level2',
    LEVEL3: 'level3',
    MAIN_MENU: 'mainMenu',
    INFO: 'info',
    GAME_OVER: 'gameOver',
    WIN_GAME: 'winGame',
}


class StateManager {                
    states = {};
    currentState = null;

    constructor(resourceManager, ctx) {     
        this.resourceManager = resourceManager;     //iba si priradime aby sme mohli vyuzivat na obrazky
        this.ctx = ctx;
    }

    init() {                
        const ctx = this.ctx;
        this.states = {                             //moznosti stateov, tu sa bude menit ci je to menu...
            gameState: new GameState(this, ctx),
            level1: new level1(this, ctx),
            level2: new level2(this,ctx),
            level3: new level3(this, ctx),
            mainMenu: new MainMenu(this, ctx),
            info: new InfoState(this, ctx),
            gameOver: new GameOver(this, ctx),
            winGame: new WinGame(this, ctx),
        };
        this.currentState = this.states.mainMenu;     //currentSTate je premenna pre state
    }

    changeState(state) {                            //meni stav hry
        const newState = this.states[state];        //berie si state z pola vyssie a nahradi ten aktualny to zmeni obrazovku na inu
        if (!newState) {
            throw new Error(`State '${state}' not found`)
        }
        this.currentState = newState;      //tu sa meni ten stav
    }

    update(dt) {
        this.currentState.update(dt);           //tu sa bude updatovat, inak by sa nehybalo
    }

    handleEvent(ev) {
        this.currentState.handleEvent(ev);
    }

    render() {
        this.currentState.render(this.ctx);
    }
}


class BaseState {               //zakladny stav z ktoreho budeme odvodzovat ostatne stavy

    objects = [];
    
    constructor(stateManager, ctx) {
        this.stateManager = stateManager;
        this.ctx = ctx;
    }

    render() {
        // TODO pridat logiku pre zoradovanie objektov, ktory sa ma prvy zobrazit
        this.objects.forEach(object => object.render(this.ctx));
    }
    
    update(dt) {

    }

    handleEvent(ev) {

    }
}



///     GLOBALNE PREMENNE

// CELKOVY CAS + CAS_render_zivoty
var global_time = 0;        //celkovy cas hry
var life_rednder_time = 0;  //cas ktory uplynie kym sa obnovi zivot zabicky

// ZABA smrt, ci je nazive
var ALIVE = 1;  //zije alebo nie
var PODRZ = 0;  // pocita cas po t pocita cas smrti
var ZMENA = 0;  //zapina renderovanie casu
var t = 10;     //nejaka konstanta ktora urcuje dlzku cakania na obnovenie

// ZABA
var POHYB = 0;              //ak sa aktivuje tak sa renderuje iny obrazok
var trvanie_pohybu = 5;     //dlzka kym sa prerenderuje pohyb obrazok

var zivoty = 3;         //toto je ako globalna premenna, nevedel som ako to menit v gamestate
var ok=0;   //podla tohto sa rozhoduje ci je vo vode alebo na plavajucom

//akt level
var level = 1;





class GameState extends BaseState {         // tu sa tvori uz herny state, nacitavau sa obrazky 
    constructor(manager, ctx) {
        super(manager, ctx);
       

        this.froggerImage = resourceManager.getImageSource('frogger');
        this.zivotyimage = resourceManager.getImageSource('life');

        this.zaba=new frogger(350,450,50,50);
        //  zvuky
        this.zvuk_smrt = new Sound ("zvuk/zvuk_smrt.wav");
        this.zvuk_win = new Sound("zvuk/zvuk_win.wav")
        //zivoty
        this.objects.push(new prekazky('spodok',0,canvas.width,canvas.width,50,0,'nic'));   
        
        
    }


    /*
    ak je to na vode = ok = false ak sa stretava froger s log alebo zabak potom ok = true
    na konci bude ak ok = false reset game
    */
    
    gameColllision(object, dt){
        //  ZABA
        var lavo = this.zaba.x;
        var pravo = this.zaba.x+this.zaba.width;
        var hore = this.zaba.y;
        var stred = this.zaba.x + (this.zaba.width/2);
        //  objekt
        var objektlavo = object.x;
        var objekthore = object.y;
        var objektpravo = object.x+object.width;
        
      
        if((hore == objekthore) && ((stred>=objektlavo && stred<=objektpravo) )){        //ak dojde ku kolizii, vybera sa o aky tym prekazky ide
            if(object.stav == 'auto'){
                if(mute==1){
                    this.zvuk_smrt.play();
                }
                this.zaba.image = resourceManager.getImageSource('smrt1');
                ZMENA=1;
                ALIVE = 0;
            }

            
            if(object.stav == 'voda'){      //tu sa riesi iba pohyb na veciach vo vode
                if(ALIVE){
                    ok=1;
                    //console.log(object.speed);
                    if(lavo>0 && pravo<canvas.width){
                        this.zaba.x -= object.speed * dt;
                        
                    } 
                }
                            
            }

            if(object.stav == 'skala'){         //pamatam si predposlednu adresu a nastavim tu ako aktualnu ked vojde do skaly
                console.log("TU BY SA NEMALA ZABA UZ ANI POHNUT "+GLOBAL_y+"    "+GLOBAL_x);
                this.zaba.x = GLOBAL_x;
                this.zaba.y = GLOBAL_y;
            }
                      
        }     
    }



    casovac(dt){
        if(ZMENA || POHYB){         //bud pohyb alebo smrt tak sa spusti casovac na znovu prerenderovanie    
            PODRZ += dt;
            if(POHYB){
                if(ALIVE){      //ked zomrel tak mi vykreslovalo ajtak preto if
                    if(PODRZ >= t/2){
                        this.zaba.image = resourceManager.getImageSource('frogger'); //navrat na frogera po restarte
                        POHYB = 0;
                        PODRZ = 0;   
                    }
                } 
            }
            if(ZMENA){      //ked zomrie tak sa caka nejaky cas a znovu sa prerenderuje po uplnynuti casu
                if(PODRZ > t){
                    zivoty-=1;
                    this.zaba.x = this.zaba.startX;
                    this.zaba.y = this.zaba.startY;
                    this.zaba.uhol = 0;
                    this.zaba.image = resourceManager.getImageSource('frogger'); //navrat na frogera po restarte
                    PODRZ=0;
                    ZMENA=0;
                    ALIVE = 1;
                }
            }
        }


        //////RENDER ZIVOTOV akoze animacia :D

        global_time +=dt;       //cas hry co sa vypise na konci
        life_rednder_time +=dt*2;
        if(life_rednder_time<30){
            this.zivotyimage = resourceManager.getImageSource('life');
        }
        if(life_rednder_time>=30 && life_rednder_time<60){
            this.zivotyimage = resourceManager.getImageSource('life1');
        }
        if(life_rednder_time>=60 && life_rednder_time<90){
            this.zivotyimage = resourceManager.getImageSource('life2');
        }
        if(life_rednder_time>=90 && life_rednder_time<120){
            this.zivotyimage = resourceManager.getImageSource('life3');
        }
        if(life_rednder_time>=120){
            life_rednder_time = 0;
        }  
    }

    stopky(){          // vypis casu na konci
        console.log("stane sa");
        this.ctx.font = "20px Verdana";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Cas: "+(global_time/10).toFixed(2)+" s",30, 540, 200, 40); 
    }

    watercollision(){
        var a = this.zaba.y;
        var hranica = canvas.width/10*3;
        if(a<=hranica){
            if(ok==0){
                if(mute==1){
                    this.zvuk_smrt.play();
                }
                ZMENA=1;    //spusti sa casovac, ktory vykonava smrt a vrati naspak
                this.zaba.image = resourceManager.getImageSource('smrt2');
                ALIVE=0;    //je mrtvy, aby sa nemohla hybat
                    
            }
            
        }
        
    }

    KoniecHry(){
        if(zivoty == 0){
            this.stateManager.changeState(STATES.GAME_OVER);
            zivoty = 3;
        }
    }
   


    loopa(dt){    //kontorla kolizie
        ok=0;
        this.KoniecHry();
        this.objects.forEach(object => this.gameColllision(object, dt))
        this.watercollision();
        this.casovac(dt);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
    }


    //zvuk musim vllzit do funckie s movementom lebo teraz hra vzdy ked stalcim ockolvek

    handleEvent(ev) {               //Frogger movement delta time neviem dostat
        if(isKeyPressEvent(ev)) {
            this.zaba.movement(ev);
            this.gameWinning();
        }  
    }

    update(dt) {                    //pohyb objektov, pridat froggera
        this.objects.forEach((object) => {
            object.move(dt);                      
        });
        this.loopa(dt);
        
        
    }


    zivoty_render(ctx){
        // zivoty budu menit farbu
        for(var i=0;i<30*zivoty;i+=30){
            this.ctx.drawImage(this.zivotyimage,canvas.width-30-i,canvas.width+10,30,30);
        }
    }

    render(ctx) {
        this.ctx.drawImage(this.bgImage,0,0,canvas.width,canvas.width);
        this.objects.forEach(object =>object.render(this.ctx));
        this.zaba.render(this.ctx);
        this.zivoty_render(this.ctx);
        this.stopky();
    }
     
}




class MainMenu extends BaseState {              //main menu 
    constructor(manager, ctx) {
        super(manager, ctx);
        
        const menuimage = new Pictures(0,0,canvas.width,canvas.height,'bg_menu');

        const startGameButton = new TextButton(50, 120, 200, 40, 40, 'Start Game');
        startGameButton.onClick((ev) => {
            this.stateManager.changeState(STATES.LEVEL1);
            
        });

        const infoButton = new TextButton(50, 200, 200, 40, 40, 'Instructions');
        infoButton.onClick((ev) => {
            this.stateManager.changeState(STATES.INFO);
        });
        
        this.SoundOffButton = new ZvukButton(0,canvas.height/10*9,50,50);
        

        this.SoundOffButton.onClick((ev) => {
            if(mute==1){
                mute=0;
            }
            else if(mute==0){
                mute=1;
            }
            console.log("Sound stav "+mute);
        });
       


        this.objects = [
            menuimage,
            startGameButton,
            infoButton,
        ];
    }


    
    handleEvent(ev) {
        this.objects.forEach((object) => {
            object.handleEvent(ev);
        });
        
        this.SoundOffButton.handleEvent(ev);
        
        if (isKeyPressEvent(ev) && ev.key === 'g') {
            this.stateManager.changeState(STATES.LEVEL1);
        }
    }



    render(ctx){
        this.objects.forEach(object =>object.render(this.ctx));
        this.SoundOffButton.render(this.ctx);
    }

    



}

class InfoState extends BaseState {
    constructor(manager, ctx) {
        super(manager, ctx);
        const CloseInfo = new ImageButton(0,0,20,20,'Close');
        const Inst = new Pictures(0,0,canvas.width,canvas.height,'Instruc');
        CloseInfo.onClick((ev) => {
            this.stateManager.changeState(STATES.MAIN_MENU);
        });
        this.objects = [                                        //vlozime si objekty do pola
            Inst,
            CloseInfo,
        ];
    }
    handleEvent(ev) {               // kazdy prvok spracujeme
        this.objects.forEach((object) => {
            object.handleEvent(ev);
        });  
    }
}

class GameOver extends BaseState {
    constructor(manager, ctx) {
        super(manager, ctx)

        const black = new Pictures(100,100,300,300,'Blackout');
        const backtoMenu = new TextButton(120, 150, 200, 40, 40, 'Main Menu');
        const backtoGame = new TextButton(120, 200, 200, 40, 40, 'Play Again');
        backtoMenu.onClick((ev) =>{
            this.stateManager.changeState(STATES.MAIN_MENU);
            global_time = 0;
        });
        backtoGame.onClick((ev) => {
            this.stateManager.changeState(STATES.LEVEL1);
            global_time = 0;
        });
        this.objects = [
            black,
            backtoGame,
            backtoMenu,
        ]
    }
        
    handleEvent(ev) {               // kazdy prvok spracujeme
            this.objects.forEach((object) => {
                object.handleEvent(ev);
            });  
    }
    
    infoLEVEL(){
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("Level: "+level+"/3",150, 300, 200, 40);
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Prehral si",150, 350, 200, 40);
    }
    
    
    render(ctx){
        this.objects.forEach(object =>object.render(this.ctx));
        this.infoLEVEL(); 
    }
}


class WinGame extends BaseState {
    constructor(manager, ctx) {
        super(manager, ctx)

        const win = new Pictures(100,100,300,300,'Uspech');
        const backtoMenu = new TextButton(150, 250, 200, 40, 40, 'Back to Menu');
        const backtoGame = new TextButton(150, 300, 200, 40, 40, 'Play Again');

        backtoMenu.onClick((ev) =>{
            this.stateManager.changeState(STATES.MAIN_MENU);
            global_time = 0;
        });
        backtoGame.onClick((ev) => {
            this.stateManager.changeState(STATES.LEVEL1);
            global_time = 0;
        });
        this.objects = [
            win,
            backtoGame,
            backtoMenu,
        ]
    }
        
    handleEvent(ev) {               // kazdy prvok spracujeme
            this.objects.forEach((object) => {
                object.handleEvent(ev);
            });
            console.log("ahoj");  
    }


    vypiscasu(){
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("Tvoj cas: "+(global_time/10).toFixed(2)+" s",150, 200, 200, 40);
        
    }

    render(ctx){
        this.objects.forEach(object =>object.render(this.ctx));
        this.vypiscasu();
    }
    
    

    
}

