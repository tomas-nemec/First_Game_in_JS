/*
Opytat sa:
ovladanie cez sipky
ako citat zdroj pomocou resourceManagera do zvuku(objects)
ako porovnavat vsetky tie objekty s froggerom( cez each?), funkcia collision
*/

const IMAGES = [
    //bg
    {name: 'bg1', src: 'obrazky/bg/bg_level1.png'},
    {name: 'bg2', src: 'obrazky/bg/bg_level2.png'},
    {name: 'bg3', src: 'obrazky/bg/bg_level3.png'},
    {name: 'spodok', src: 'obrazky/bg/bg_spodok.png'},
    {name: 'bg_menu', src: 'obrazky/bg/bg_menu.png'},

    //zivoty
    {name: 'life', src: 'obrazky/others/zivot.png'},
    {name: 'life1', src: 'obrazky/others/zivot1.png'},
    {name: 'life2', src: 'obrazky/others/zivot2.png'},
    {name: 'life3', src: 'obrazky/others/zivot3.png'},

    
    {name: 'auto1', src: 'obrazky/auta/autak2.png'},
    {name: 'frogger', src: 'obrazky/zabicka/frogger_stoj.png'},
    {name: 'skala', src: 'obrazky/bg/bg_prekazka.png'},
    {name: 'frogger1', src: 'obrazky/zabicka/frogger_pohyb.png'},
    {name: 'smrt1', src: 'obrazky/zabicka/frogger_auto_smrt.png'},
    {name: 'smrt2', src: 'obrazky/zabicka/frogger_voda_smrt.png'},
    {name: 'auto2', src: 'obrazky/auta/autak3.png'},
    {name: 'auto3', src: 'obrazky/auta/autak4.png'},
    {name: 'auto4', src: 'obrazky/auta/autak5.png'},
    {name: 'drevo', src: 'obrazky/voda/drevo.png'},
    {name: 'pancier', src: 'obrazky/voda/zelva.png'},
    
    //exit
    {name: 'Close', src: 'obrazky/others/close.png'},
    
    //zvuk
    {name: 'SoundOff', src: 'obrazky/others/SoundOff.png'},
    {name: 'SoundOn', src: 'obrazky/others/SoundOn.png'},
    

    //GAME OVER WIN GAME states
    {name: 'Instruc', src: 'obrazky/others/info.png'},
    {name: 'Blackout', src: 'obrazky/others/gameover.png'},
    {name: 'Uspech', src: 'obrazky/others/winning.png'},
    
];
/*
const SOUNDS = [
    {name: 'death', src: 'zvuk/zvuk_smrt.wav', count: 10},
    {name: 'win', src: 'zvuk/zvuk_win.wav', count: 10},
    {name: 'zvuk_move', src: 'zvuk/zvuk_zaba.wav', count: 10},
];*/


class Game {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.stateManager = new StateManager(resourceManager, this.ctx);
    }

    
    async start() {     //tato funkcia sa vola v html
        console.log('starting game');
        await resourceManager.init();   //toto nacita vsetky zdroje - obrazky, hudba...
        console.log('resouces loaded');
        this.stateManager.init();       //nacita stavy hry, ktore mozu nastat
        this.initEventSystem();         //nacitanie event listenerov na kliknutie mysky a vstupu z klavesnice

        this.startLoop();   //spusta sa nekonecna loopa
    }
    

    initEventSystem() {                     //caka na stlacenie tlacidla alebo kliknutie
        this.canvas.addEventListener('click', (ev) => {
            this.handleEvent(ev);
        });
        
        this.canvas.addEventListener('keypress', (ev) => {
            this.handleEvent(ev);
        });
    }

    handleEvent(ev) {
        this.stateManager.handleEvent(ev);
    }
    
    // spusta nekonecnu slučku
    startLoop() {
        this.time = Date.now();
        this.step();
    }

    // 
    step() {
        const now = Date.now();
        const dt = (now - this.time) / 100; // dt nadobuda hodnoty <0.15;az 0.33> 
        this.time = now;
      
        this.update(dt);
        this.render(dt);
      
        // tu treba pouzit lambda funkciu -> ktora automaticky nabinduje this pre volanu funkciu
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        requestAnimationFrame(() => this.step());
    }

    update(dt) {
        this.stateManager.update(dt);
    }

    // render len zobrazuje a obrazok sa nacita raz pri inicializacii
    render(dt) {
        this.clearCtx();
        this.stateManager.render(dt);
    }

    
    clearCtx() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}