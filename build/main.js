function init(){window.AudioContext=window.AudioContext||window.webkitAudioContext,window.AudioContext&&(audioCtx=new window.AudioContext),state=Constants.S_INIT,cv=document.getElementById("game"),cvRect=cv.getBoundingClientRect(),(ctx=cv.getContext("2d")).webkitImageSmoothingEnabled=!1,(bg=ctx.createLinearGradient(0,0,0,720)).addColorStop(0,"#9BD8E7"),bg.addColorStop(1,"#1EADD9"),ratio=cv.width/cv.height,resize(),preload=new Preloader(this,200,32),mPos={x:0,y:0},cv.addEventListener("mousemove",msMv,!1),cv.addEventListener("mousedown",msDn,!1),cv.addEventListener("mouseup",msUp,!1),cv.addEventListener("touchmove",tMv,!1),cv.addEventListener("touchstart",tDn,!1),cv.addEventListener("touchend",tUp,!1),cv.addEventListener("keydown",onKeyDown,!1),cv.addEventListener("keyup",onKeyUp,!1),setInterval(update,1e3/Constants.FPS)}function resize(){cv.height=window.innerHeight,cv.width=cv.height*ratio,scale=cv.width/Constants.W}function print(t,s,i,h,e){var a=-1,n=i.length,r=im["a/font.png"],o=e||1,c=0;for(h&&(c=22*n*o*.5);a++<n;)ctx.drawImage(r,(i.charCodeAt(a)-32)%10*32,32*(Math.floor((i.charCodeAt(a)-32)/10)-1),32,32,(t-c)*scale+22*a*scale*o,s*scale,32*o*scale,32*o*scale)}function onKeyDown(t){state==Constants.S_GAME&&game.msDn(1)}function onKeyUp(t){state==Constants.S_GAME?game.msUp(1):state==Constants.S_MENU&&menu.click(mPos.x,mPos.y)}function msMv(t){mPos=getmPos(cv,t)}function msDn(t){state==Constants.S_GAME&&game.msDn(1)}function msUp(t){state==Constants.S_MENU?menu.click(mPos.x,mPos.y):state==Constants.S_GAME&&game.msUp(1)}function tMv(t){t.preventDefault(),mPos=tPos(cv,t)}function tDn(t){t.preventDefault(),mPos=tPos(cv,t),state==Constants.S_GAME&&(mPos.x<.5*Constants.W*scale?game.msDn(1):game.msDn(2))}function tUp(t){t.preventDefault(),mPos=tPos(cv,t),state==Constants.S_MENU?(isTouch=!0,menu.click(mPos.x,mPos.y)):state==Constants.S_GAME&&(mPos.x<.5*Constants.W*scale?game.msUp(1):game.msUp(2))}function tPos(t,s){return{x:s.changedTouches[0].pageX-t.offsetLeft,y:s.changedTouches[0].pageY-t.offsetTop}}function getmPos(t,s){return{x:s.pageX-t.offsetLeft,y:s.pageY-t.offsetTop}}function loadAllImages(t){tImg=t.length;for(var s in t)loadImage(t[s])}function loadImage(t){im[t]=new Image,im[t].onload=function(){ldImg+=1,preload.update(ldImg,tImg)},im[t].src=t}function startGame(t){numPlayers=t,transFunc=onTransGame,trans.start()}function quitGame(){transFunc=onTransQuit,trans.start()}function onTransQuit(){game.cleanUp(),game=null,menu=new Menu,state=Constants.S_MENU}function onTransGame(){(game=new Game).init(),state=Constants.S_GAME,menu.cleanUp(),menu=null}function rnd(){return Math.random()}function update(){switch(ctx.clearRect(0,0,cv.width,cv.height),state){case Constants.S_INIT:preload.isReady&&(loadAllImages(sources),state=Constants.S_LOAD);break;case Constants.S_LOAD:preload.draw(),preload.isComplete&&(menu=new Menu,trans=new Transition,state=Constants.S_MENU);break;case Constants.S_MENU:menu.update(mPos.x,mPos.y);break;case Constants.S_GAME:game.update(mPos.x,mPos.y)}trans&&trans.update(),state>Constants.S_LOAD&&print(235,16,"BEST "+hiscore,!0)}var Player=function(t,s){this.x=t,this.y=s,this.w=this.h=0,this.ox=this.oy=0,this.sx=this.sy=1,this.img=im["a/p2.png"],this.isAlive=!0,this.v=!0,this.dx=this.dy=0,this.aDir=1,this.hop=0,this.isJump=!1,this.isFall=!1,this.currPlatform=null,target=this};Player.prototype={getX:function(){return this.x+this.ox},getY:function(){return this.y+this.oy},setScale:function(t,s){this.sx=t,this.sy=s,this.w=this.img.width*this.sx,this.h=this.img.height*this.sy,this.ox=-.5*this.w,this.oy=-1*this.h},jump:function(t){this.isJump||(this.dy=-18*t,this.isJump=!0,this.setScale(.95,1.1),this.hop=0,this.currPlatform=null)},land:function(){this.isJump=!1,this.dy=0,this.setScale(1.05,.9),this.aDir=1,this.hop=0},walk:function(){this.aDir>0?this.sy<1.1?(this.sy+=.01,this.sx-=.005,this.hop-=.5):(this.sx=.95,this.sy=1.1,this.aDir=-1):this.sy>.9?(this.sy-=.01,this.sx+=.005,this.hop+=.5):(this.sx=1.05,this.sy=.9,this.aDir=1,this.hop=0),this.setScale(this.sx,this.sy)},update:function(t,s){this.isJump||this.walk(),this.v&&(ctx.drawImage(this.img,(this.x+this.ox-.5*this.img.width*this.sx)*scale,(this.y+this.oy+this.hop)*scale,this.img.width*this.sx*scale,this.img.height*this.sy*scale),ctx.scale(-1,1),ctx.drawImage(this.img,(this.x+this.ox+.5*this.img.width*this.sx)*-scale,(this.y+this.oy+this.hop)*scale,-this.img.width*this.sx*scale,this.img.height*this.sy*scale),ctx.setTransform(1,0,0,1,0,0))}};var Button=function(t,s,i){this.x=t||0,this.y=s||0,this.w=64,this.h=64,this.v=!0,this.isOver=!1,this.t=i||"",this.c=2*Math.PI,target=this};Button.prototype={click:function(t,s){return t>this.getX()&&t<this.getX()+this.getW()&&s>this.getY()&&s<this.getY()+this.getH()},getX:function(){return this.x*scale},getY:function(){return this.y*scale},getW:function(){return this.w*scale},getH:function(){return this.h*scale},update:function(t,s){this.isOver?(t<this.getX()||t>this.getX()+this.getW()||s<this.getY()||s>this.getY()+this.getH())&&(this.isOver=!1):t>this.getX()&&t<this.getX()+this.getW()&&s>this.getY()&&s<this.getY()+this.getH()&&(this.isOver=!0)},draw:function(){if(this.v){var t=0;this.isOver?t=4:(ctx.globalAlpha=.25,ctx.beginPath(),ctx.arc((this.x+32)*scale,(this.y+36)*scale,32*scale,0,this.c),ctx.fillStyle="#000000",ctx.fill(),ctx.globalAlpha=1),ctx.beginPath(),ctx.arc((this.x+32)*scale,(this.y+32+t)*scale,32*scale,0,this.c),ctx.fillStyle="#FFFFFF",ctx.fill(),ctx.beginPath(),ctx.arc((this.x+32)*scale,(this.y+32+t)*scale,27*scale,0,this.c),ctx.fillStyle="#EA1C5A",ctx.fill(),print(this.x+26,this.y+t+15,this.t,!0,1.2)}}};var Platform=function(t){this.x=this.y=0,this.by=0,this.scale=1,this.ox=0,this.drop=0,this.img=im[t],this.spr=im["a/spr2.png"],this.v=!0,this.w=this.img.width,this.h=this.img.height,this.type="basic",this.isOff=!1,this.isUsed=!0,this.isSpr=!1,this.sw=this.spr.width,this.sh=this.spr.height,this.sox=-.5*this.sw,this.soy=-.65*this.sh};Platform.prototype={getX:function(){return this.x+this.ox},getY:function(){return this.y},setScale:function(t){this.scale=t,this.w=this.img.width*this.scale,this.h=this.img.height*this.scale,this.ox=.72*this.w*-.5},draw:function(){this.v&&this.isUsed&&(ctx.drawImage(this.img,(this.x+this.ox)*scale,(this.y+this.drop)*scale,this.img.width*this.scale*scale*.72,this.img.height*this.scale*scale*.72),this.isSpr&&(ctx.drawImage(this.spr,(this.x+this.sox-.5*this.spr.width)*scale,(this.y+this.drop+this.soy)*scale,this.spr.width*scale,this.spr.height*scale),ctx.scale(-1,1),ctx.drawImage(this.spr,(this.x+this.sox+.5*this.spr.width)*-scale,(this.y+this.drop+this.soy)*scale,-this.spr.width*scale,this.spr.height*scale),ctx.setTransform(1,0,0,1,0,0)))}};var Wall=function(t){this.x=this.y=0,this.by=0,this.ox=this.oy=0,this.sx=this.sy=1,this.init(t),this.isFront=!0,this.v=!0,this.sv=!1,this.as=1,rnd()<.3&&(this.as=0),this.ft=im["a/w.png"],this.sd=im["a/shade.png"]};Wall.prototype={init:function(t){this.sv=!1,t&&(this.sv=!0)},getX:function(){return this.x+this.ox},getY:function(){return this.y+this.oy},setScale:function(t){this.sx=t,this.ox=.48*this.ft.width*this.sx*-.5},draw:function(){this.v&&this.isFront&&(ctx.drawImage(this.ft,0,100*this.as,100,100,(this.x+this.ox)*scale,(this.y+this.oy)*scale,100*this.sx*scale*.48,100*this.sy*scale*.48),this.sv&&ctx.drawImage(this.sd,(this.x+this.ox)*scale,(this.y+this.oy)*scale,this.sd.width*this.sx*scale*.48,this.sd.height*this.sy*scale*.48))}};var HUD=function(){this.score=0,this.btn=new Button(Constants.W-74,10,"<"),this.bar=im["a/bar.png"],this.bBs=im["a/bar_base.png"],this.bS=0,this.help=!0,isFT||(this.help=!1),target=this};HUD.prototype={setScore:function(t){this.score=t},click:function(t,s){this.btn.click(t,s)&&(game.music.stop(),quitGame())},draw:function(){this.help&&(isTouch?print(240,315,"TOUCH SCREEN TO CHARGE",!0,.8):print(240,315,"HOLD ANY KEY TO CHARGE",!0,.8),print(240,350,"THEN RELEASE TO JUMP",!0,.8)),this.btn.draw(),print(240,64,""+this.score,!0,1.5),ctx.fillStyle="#FFFFFF",ctx.fillRect(26*scale,577*scale+114*(1-this.bS)*scale,36*scale,114*this.bS*scale),ctx.drawImage(this.bBs,20*scale,570*scale,this.bBs.width*scale,this.bBs.height*scale)},update:function(t,s){this.btn.update(t,s)}};var Transition=function(){this.v=!1,this.w=!1,this.p=Constants.H,this.speed=60,this.isTop=!0,target=this};Transition.prototype={start:function(){this.p=Constants.H,this.v=!0,this.w=!1,this.isTop=!0},onComplete:function(){this.v=!1},onHidden:function(){this.w=!0;var t=this;setTimeout(function(){t.w=!1,transFunc()},100)},update:function(){if(this.v){this.w||(this.p-=this.speed,this.p<=0&&this.isTop?(this.onHidden(),this.isTop=!1):this.p<=-1*Constants.H&&this.onComplete());var t=0;this.p>0&&(t=this.p*scale),ctx.clearRect(0,t,cv.width,(this.p+Constants.H)*scale)}}};var Particle=function(t){this.img=t,this.x=this.y=0,this.scale=1,this.ox=-.5*this.img.width,this.oy=-.5*this.img.height,this.v=!1,this.life=this.maxLife=1,this.fade=0,this.dx=this.dy=0,this.scaling=1};Particle.prototype={setScale:function(t){this.scale=t,this.ox=this.img.width*this.scale*-.5,this.oy=this.img.height*this.scale*-.5},draw:function(){this.v&&ctx.drawImage(this.img,(this.x+this.ox)*scale,(this.y+this.oy)*scale,this.img.width*this.scale*scale,this.img.height*this.scale*scale)}};var Preloader=function(t,s,i){this.root=t,this.w=s,this.h=i,this.p=0,this.total=0,this.loaded=0,this.isReady=!0,this.isComplete=!1,target=this};Preloader.prototype={draw:function(){ctx.fillStyle="#FFFFFF",ctx.fillRect(Constants.w/2-this.w/2,Constants.h/2-this.h/2,this.w*this.p,this.h)},update:function(t,s){this.loaded=t,this.total=s,this.p=this.loaded/this.total,this.total>0&&1==this.p&&(this.isComplete=!0)}};var Beam=function(t,s,i,h){this.x=t,this.y=s,this.img=im["a/ray.png"],this.sx=i/this.img.width,this.sy=1,this.r=h,this.v=!0};Beam.prototype={draw:function(){this.v&&(ctx.translate(this.x*scale,this.y*scale),ctx.rotate(this.r),ctx.drawImage(this.img,this.x*scale,this.y*scale,this.img.width*this.sx*scale,this.img.height*this.sy*scale),ctx.rotate(-this.r),ctx.translate(-this.x*scale,-this.y*scale))}};var Tree=function(t,s){this.x=t,this.y=0,this.sx=s/64,this.sy=720,this.v=!0};Tree.prototype={draw:function(){this.v&&(ctx.fillStyle="#3D81C2",ctx.fillRect(this.x*scale,this.y*scale,64*this.sx*scale,this.sy*scale))}},Constants={S_INIT:0,S_LOAD:1,S_MENU:2,S_GAME:3,W:480,H:720,FPS:60};var Game=function(){this.isCharge=!1,this.pow=0,this.score=0,this.p=null,this.cx=240,this.cy=-144,this.co=0,this.rad=120,this.circ=Math.PI*this.rad*2,this.ang=0,this.lev=[],this.walls=[],this.plats=[],this.sets=[["1110011100111100","1100111001110011","1001110011111001","1111001111001111","1100111111001100"]],this.nxSet=0,this.currLev=0,this.sp=.01;var t=Math.PI/8;this.trees=[new Tree(50,32),new Tree(150,48),new Tree(280,64),new Tree(400,32),new Tree(550,64)],this.beams=[new Beam(100,-100,40,t),new Beam(150,-100,60,t),new Beam(170,-120,100,t),new Beam(250,-100,60,t),new Beam(350,-80,100,t),new Beam(390,-120,60,t),new Beam(500,-80,100,t)],this.hud=new HUD,this.lf=new ParticleSys,this.lf2=new ParticleSys,this.music=new Music,target=this};Game.prototype={init:function(){this.score=0,this.hud.setScore(this.score),this.lf.init(im["a/leaf.png"],15,100,0,-2,2,2,0,.2,50,0,.98),this.lf2.init(im["a/leaf.png"],20,500,0,0,2,2,0,.1,720,0,.995),this.lf2.x=240,this.lf2.setSpawnInt(50),this.lf2.start();var t,s=[];for(t=0;t<18;t+=3)s.push([],[],[]),this.fillRow(s[t],0),this.fillRow(s[t+1],1),this.fillRow(s[t+2],0);for(t=0;t<s.length;t++){for(var i=0;i<16;i++){var h=2*Math.PI/16*i,e=new Wall;if(this.walls.push(e),e.a=h,e.x=this.cx+Math.sin(h)*this.rad,e.y=this.cy-48*t,e.by=48*(t+2),1==s[t][i]){var a=new Platform("a/plat.png");this.lev.push(a),this.plats.push(a),a.a=h,a.setScale(1+.5*rnd()),a.x=this.cx+Math.sin(h)*(this.rad+64),a.y=this.cy-48*(t+1),a.by=48*(t+1),a.wall=e}}this.p=new Player(240,750),this.p.setScale(1,1),this.p.jump(1),10==t||7==t||4==t||1==t?this.setRow(48*(t+1)):16==t&&this.setRow(48*(t+1),!0)}},onKeyDown:function(t){1==t&&this.msDn()},onKeyUp:function(t){1==t&&this.msUp()},msDn:function(t){this.hud.btn.isOver||this.p.isAlive&&(this.isCharge=!0)},msUp:function(t){this.hud.btn.isOver?this.hud.click(mPos.x,mPos.y):this.p.isAlive&&(this.isCharge=!1,this.p.jump(this.pow),this.music.jump(),this.pow=0,this.hud.bS=0,this.hud.help=!1,isFT=!1)},fillRow:function(t,s){for(var i=0;i<16;i++)t[i]=s},setRow:function(t,s){for(var i=this.sets[this.currLev][this.nxSet].split(""),h=0,e=0;e<this.lev.length;e++){var a=this.lev[e];a.by==t&&(a.isUsed=!1,1!=parseInt(i[h])||s||(a.isUsed=!0,a.setScale(1+.5*rnd()),a.wall.init(!0)),h++)}s||++this.nxSet>4&&(this.nxSet=0)},updateLevel:function(){for(h=0;h<this.lev.length;h++){var t=64,s=this.lev[h];"branch"==s.type&&(t=24),s.a+=this.sp,s.d=Math.cos(s.a)*(this.rad+t)+s.y,s.x=this.cx+Math.sin(s.a)*(this.rad+t),Math.cos(s.a)*(this.rad+t)>0?s.isOff=!0:s.isOff=!1}for(h=0;h<this.walls.length;h++){var i=this.walls[h];i.a+=this.sp,i.d=Math.cos(i.a)*this.rad+i.y,i.x=this.cx+Math.sin(i.a)*this.rad,i.setScale(Math.cos(i.a)*this.rad/this.rad),Math.cos(i.a)*this.rad<0?i.isFront=!0:i.isFront=!1}var h,e=[];for(h=0;h<this.lev.length;h++)e.push(this.lev[h]);for(h=0;h<this.walls.length;h++)e.push(this.walls[h]);for(e.sort(function(t,s){return t.d-s.d}),h=e.length-1;--h>0;)e[h].draw()},checkFall:function(t){var s=this.p.x,i=this.p.y+this.p.h;return!(this.colPtPlat(s,i+1,t)&&t.isUsed&&!t.isOff)||(this.p.currPlatform=t,!1)},colPtPlat:function(t,s,i){if(!i.v)return!1;var h=i.x-i.w/2,e=i.x+i.w/2;return t>h&&t<e&&s>i.y&&s<i.y+i.h},update:function(t,s){ctx.fillStyle=bg,ctx.fillRect(0,0,480*scale,720*scale);var i,h=this.cy;for(i=0;i<this.trees.length;i++)this.trees[i].x+=100*this.sp,this.trees[i].x>600&&(this.trees[i].x-=800),this.trees[i].draw();for(this.hud.update(t,s),this.isCharge&&(this.pow+=.02,this.pow>1&&(this.pow=0),this.hud.bS=this.pow),this.p.isJump&&(this.p.dy<0&&this.p.y<=Constants.H/2?(this.cy-=this.p.dy,this.co-=this.p.dy):this.p.y+=this.p.dy,this.p.dy+=.5,this.p.dy>16&&(this.p.dy=16)),i=0;i<this.lev.length;i++)this.lev[i].y=this.lev[i].by+this.cy;for(i=0;i<this.walls.length;i++)this.walls[i].y=this.walls[i].by+this.cy;var e=this.p.x,a=this.p.y;if(this.p.isJump){for(i=0;i<this.plats.length;i++)if((m=this.plats[i]).v&&!this.p.isFall&&!m.isOff&&m.isUsed&&this.p.dy>0){var n=m.x-m.w/2,r=m.x+m.w/2;if(e>n&&e<r&&a>m.y&&a<m.y+m.h&&a-this.p.dy<m.y){var o=this.p.y-m.y;this.p.dy<0&&this.p.y<=Constants.H/2?(this.cy+=o,this.co+=o):this.p.y-=o,this.p.land(),this.lf.burst(5,this.cy),this.music.land();break}this.p.y>Constants.H+20&&this.p.isAlive&&(this.p.isAlive=!1,this.music.stop(),quitGame())}}else if(0==this.p.dy)for(i=0;i<this.plats.length;i++){if(!this.checkFall(this.plats[i])){this.p.isJump=!1;break}this.p.isJump=!0}for(i=0;i<this.walls.length;i++)this.walls[i].y>Constants.H&&(this.walls[i].by-=864,this.walls[i].init(!1));for(i=0;i<this.lev.length;i++)if(this.lev[i].y>Constants.H){for(var c=this.lev[i].by,l=this.sets[this.currLev][this.nxSet].split(""),p=0,u=!1,f=0;f<this.lev.length;f++){var d=this.lev[f];d.by==c&&(d.by-=864,d.y=this.cy+d.by,d.isUsed=!1,d.isSpr=!1,1==parseInt(l[p])&&(d.isUsed=!0,d.setScale(1+.5*rnd()),rnd()<.05&&!u&&(d.isSpr=!0,u=!0),d.wall.init(!0)),p++)}++this.nxSet>4&&(this.nxSet=0)}for(i=0;i<this.plats.length;i++){var m=this.plats[i];m==this.p.currPlatform?(m.drop=0,m.isSpr&&this.p.jump(1.4)):m.drop=-4}this.updateLevel(),this.p.update();h-=this.cy;for(this.lf.x=this.p.x,this.lf.y=this.p.y,this.lf.update(-100*this.sp,-h),this.lf2.update(-100*this.sp,-h),i=0;i<this.beams.length;i++)this.beams[i].x-=100*this.sp,this.beams[i].x<-200&&(this.beams[i].x+=750),this.beams[i].draw();for(;this.co>48;)this.score++,this.hud.setScore(this.score),this.music.setLev(this.score),this.co-=48;this.score>hiscore&&(hiscore=this.score),this.hud.draw()},cleanUp:function(){}};var sources=["a/font.png","a/bar_base.png","a/p2.png","a/leaf.png","a/plat.png","a/spr2.png","a/w.png","a/shade.png","a/ray.png"],im={},ldImg=0,tImg=0,preload,menu,game,trans,transFunc,cv=null,cvRect=null,ctx=null,audioCtx=null,state,scale,ratio,mPos,buttons=[],target=this;window.onload=init,window.addEventListener("resize",resize,!1);var hiscore=0,isFT=!0,isTouch=!1,bg=null,Music=function(){this.buffers=[],this.loaded=0,this.currStep=-1,this.percStep=-1,this.bassStep=-1;var t=99;for(this.lev=0,this.seq=[];this.seq.length<64;)this.seq.push(t);for(;this.seq.length<96;)this.seq.push(4,t,t,t,7,t,t,t,5,t,t,t,9,t,t,t,7,t,9,t,11,t,12,t,t,t,t,t,t,t,t,t);for(;this.seq.length<128;)this.seq.push(t);for(this.perc=[];this.perc.length<64;)this.perc.push(0,t,t,t,t,t,t,t,1,1,t,t,t,t,t,t);for(this.bass=[];this.bass.length<64;)this.bass.push(-8,t,t,t,t,t,t,t,-7,t,t,t,t,t,t,t,-5,t,t,t,t,t,t,t,0,t,t,t,t,t,t,t);this.freq=[130.8,138.6,146.8,155.6,164.8,174.6,185,196,207.7,220,233.1,246.9,261.6,277.2,293.7,311.1,329.6,349.2,367,392,415.3,440,466.2,493.9,523.3],this.freqOffset=12,this.interval=100,this.jumpSFX=null,this.jumpInt=null,this.load("a/trumpet.mp3",0),this.load("a/hat.mp3",1)};Music.prototype={load:function(t,s){var i=this,h=new XMLHttpRequest;h.open("GET",t,!0),h.responseType="arraybuffer",h.onload=function(){audioCtx.decodeAudioData(h.response,function(t){i.buffers[s]=t,2==++i.loaded&&i.onLoad()},function(t){})},h.send()},onLoad:function(){this.play()},getFreq:function(t){return this.freq[this.freqOffset+t]/this.freq[this.freqOffset]},note:function(t,s){if(99!=s){var i=audioCtx.createBufferSource();i.buffer=this.buffers[t],i.connect(audioCtx.destination),i.start(0),i.playbackRate.value=this.getFreq(s)}if(1==t){var h=this;setTimeout(function(){h.onNote()},this.interval)}},jump:function(){this.jumpSFX=audioCtx.createBufferSource(),this.jumpSFX.buffer=this.buffers[0],this.jumpSFX.connect(audioCtx.destination),this.jumpSFX.start(0),this.jumpSFX.playbackRate.value=1;var t=this;clearInterval(this.jumpInt),this.jumpInt=setInterval(function(){t.jumpFreq()},10)},jumpFreq:function(){this.jumpSFX.playbackRate.value+=.1},land:function(){var t=audioCtx.createBufferSource();t.buffer=this.buffers[1],t.connect(audioCtx.destination),t.start(0),t.playbackRate.value=this.getFreq(-8)},onNote:function(){this.currStep>=0&&(this.currStep++,this.percStep++,this.bassStep++,this.currStep>this.seq.length-1&&(this.currStep=0,this.interval=Math.max(60,100-this.lev/10)),this.percStep>this.perc.length-1&&(this.percStep=0),this.bassStep>this.bass.length-1&&(this.bassStep=0),this.note(0,this.seq[this.currStep]),this.note(0,this.bass[this.bassStep]),this.note(1,this.perc[this.percStep]))},play:function(){this.currStep=this.percStep=this.bassStep=0,this.note(0,this.seq[0]),this.note(0,this.bass[0]),this.note(1,this.perc[0])},stop:function(){this.currStep=this.percStep=this.bassStep=-1},setLev:function(t){this.lev=t}};var Menu=function(){this.lev=[],this.walls=[],this.cx=240,this.cy=730,this.rad=120,this.circ=Math.PI*this.rad*2,this.ang=0,this.layouts=["0000000011110000","0000111000111100","0001111111100000"],this.nextLayout=0,this.buildLevel(),this.p=new Player(240,0),this.p.setScale(1,1),this.p.jump(0);var t=Math.PI/8;this.trees=[new Tree(50,32),new Tree(400,48)],this.beams=[new Beam(100,-100,60,t),new Beam(120,-120,100,t),new Beam(200,-100,60,t)],target=this,this.int=null,this.flashOn=!0};Menu.prototype={click:function(t,s){if(audioCtx){var i=audioCtx.createBuffer(1,1,22050),h=audioCtx.createBufferSource();h.buffer=i,h.connect(audioCtx.destination),h.start&&h.start(0)}clearInterval(this.int),this.int=null,startGame()},flash:function(){this.flashOn=!this.flashOn},buildLevel:function(){var t,s=[];for(t=0;t<18;t++)s[t]=[],7==t||10==t||13==t?this.fillRow(s[t],1):this.fillRow(s[t],0);for(t=0;t<s.length;t++){for(var i=0;i<16;i++){var h=2*Math.PI/16*i,e=new Wall;if(this.walls.push(e),e.a=h,e.y=this.cy-48*t,e.by=48*(t+2),1==s[t][i]||3==s[t][i]){var a=new Platform("a/plat.png");this.lev.push(a),a.a=h,a.setScale(1+.5*rnd()),a.y=this.cy-48*(t+1),a.by=48*(t+1),a.wall=e}}7!=t&&10!=t&&13!=t||this.setRow(48*(t+1))}for(t=0;t<this.lev.length;t++){var n=64,r=this.lev[t];"branch"==r.type&&(n=24),r.d=Math.cos(r.a)*(this.rad+n)+r.y,r.x=this.cx+Math.sin(r.a)*(this.rad+n)}for(t=0;t<this.walls.length;t++)(e=this.walls[t]).d=Math.cos(e.a)*this.rad+e.y,e.x=this.cx+Math.sin(e.a)*this.rad,e.setScale(Math.cos(e.a)*this.rad/this.rad),Math.cos(e.a)*this.rad<0?e.isFront=!0:e.isFront=!1;var o=this;this.int=setInterval(function(){o.flash()},800)},fillRow:function(t,s){for(var i=0;i<16;i++)t[i]=s},setRow:function(t){for(var s=this.layouts[this.nextLayout].split(""),i=0,h=0;h<this.lev.length;h++){var e=this.lev[h];e.by==t&&(e.isUsed=!1,1==parseInt(s[i])&&(e.isUsed=!0,e.setScale(1+.5*rnd()),e.wall.init(!0)),i++)}this.nextLayout++},drawLevel:function(){var t,s=[];for(t=0;t<this.lev.length;t++)s.push(this.lev[t]);for(t=0;t<this.walls.length;t++)s.push(this.walls[t]);for(s.sort(function(t,s){return t.d-s.d}),t=s.length-1;--t>0;)s[t].draw()},update:function(t,s){ctx.fillStyle=bg,ctx.fillRect(0,0,480*scale,720*scale);var i;for(i=0;i<this.trees.length;i++)this.trees[i].draw();this.drawLevel(),ctx.fillStyle="#3FAB92",ctx.fillRect(0,650*scale,480*scale,70*scale);this.p.y;for(this.p.isJump&&(this.p.y+=this.p.dy,this.p.dy+=.5,this.p.dy>16&&(this.p.dy=16),this.p.y>650&&this.p.land()),this.p.update(),i=0;i<this.beams.length;i++)this.beams[i].draw();print(235,200,"BACK",!0,1.3),print(230,240,"UP ",!0,1.6),print(272,242,":",!0,1.3),print(273,281,";",!0,1.3),this.flashOn&&(isTouch?print(235,500,"TAP TO PLAY",!0,1):print(235,500,"PRESS ANY KEY",!0,1))},cleanUp:function(){}};var ParticleSys=function(){this.x=this.y=0,this.v=!0,this.isRun=!1,this.p=[],this.num=0,this.ls=this.lr=0,this.dx=this.dy=0,this.dxR=this.dyR=0,this.scaling=1,this.fX=this.fY=0,this.spI=1,this.spN=0,this.spW=this.spH=0,this.fo=0,this.dur=0,this.wc=this.ic=!1,this.rt=0};ParticleSys.prototype={init:function(t,s,i,h,e,a,n,r,o,c,l,p){this.num=s,this.ls=i,this.dx=h||0,this.dy=e||0,this.dxR=a||0,this.dyR=n||0,this.fX=r||0,this.fY=o||0,this.spW=c||0,this.spH=l||0,this.scaling=p||0;for(var u=this.num;u-- >0;)this.p.push(new Particle(t))},start:function(t){this.dur=t||0,this.isRun=!0,this.dur>0?this.wc=!0:this.wc=!1,this.ic=!1;for(var s=this.fo;s-- >0;)this.update()},stop:function(){this.isRun=!1},burst:function(t,s){for(var i=t;i-- >0;)this.add(this.rSpd(this.dx,this.dxR),this.rSpd(this.dy,this.dyR),this.rLf(this.ls));this.rt=s||0,this.wc=!0,this.ic=!1},add:function(t,s,i){for(var h=this.num;h-- >0;){var e=this.p[h];if(!e.v)break}e.x=this.x,e.y=this.y,0!=this.spW&&(e.x+=rnd()*this.spW-.5*this.spW),0!=this.spH&&(e.y+=rnd()*this.spH-.5*this.spH),e.setScale(1),e.maxLife=i,e.life=i,e.fade=1/i,e.dx=t,e.dy=s,e.scaling=this.scaling,e.v=!0},rSpd:function(t,s){return t+=s=(t+1)*s*rnd()-(t+1)*s*.5},rLf:function(t){return t-=(t+1)*this.lr*rnd()},setLfR:function(t){this.lr=t},setSpawnInt:function(t){this.spI=t},update:function(t,s){this.dur>0&&0==--this.dur&&this.stop(),this.isRun&&(this.spN>=this.spI&&(this.add(this.rSpd(this.dx,this.dxR),this.rSpd(this.dy,this.dyR),this.rLf(this.ls)),this.spN=0),this.spN++);for(var i=this.num;i-- >0;){var h=this.p[i];h.v&&(--h.life<=0?h.v=!1:(h.dy<8&&(h.dy+=this.fY),h.dx+=this.fX,h.x+=h.dx,h.y+=h.dy,h.x+=t,h.y+=s,h.setScale(h.scale*h.scaling)))}if(this.wc&&!this.ic){var e=!0;for(i=this.num;i-- >0;)if(this.p[i].v){e=!1;break}e&&(this.ic=!0)}for(i=this.num;i-- >0;)this.p[i].draw()},cleanUp:function(){this.p=null},reset:function(){for(var t=this.num;t-- >0;)this.p[t].v=!1}};