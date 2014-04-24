function changeMode(){
	if(mode===0){
		mode=1;
		$("#toggle").html('Mode: Rotate<div id = "togBoxes"><input id = "togBox1" type="number" value="200"></input><br><input id = "togBox2" type="number" value=".005"></input><br></div><input class = "buttn" type= "button" value="Change Mode" onclick="changeMode()">');
	}
	else if(mode===1){
		mode=2;
		$("#toggle").html('Mode: Ring<div id = "togBoxes"><input id = "togBox1" type="number" value="200"></input><br><input id = "togBox2" type="number" value=".005"></input><br></div><input class = "buttn" type= "button" value="Change Mode" onclick="changeMode()">');
	}
	else if(mode===2){
		mode=0;
		$("#toggle").html('Mode: Full Random<div id = "togBoxes"><input id = "togBox1" type="number" value="200"><br><input id = "togBox2" type="number" value="0"></input><br></div><input class = "buttn" type= "button" value="Change Mode" onclick="changeMode()">');
	}
}

$(document).ready(function(){

	var GRAVCONST = .000006637;
	var pList = [];//new particle(5,100,0,0,5),new particle(200,50,0,0,5),new particle(150,150,0,0,5)];
	mode = 0;
	//0 = nonmove, 1 = circle, 2 = ring
	
	var relaSize = 0;
	
	$("#sizes").click(function(){
		if(relaSize===0){
			relaSize=1;
			$(this).html('Relative Size');
		}
		else{
			relaSize=0;
			$(this).html("Same Size");
		}
	});
	
	$("#reseed").click(function(){
		pList = [];
		var count = document.getElementById("pnnum").value;
		GRAVCONST = document.getElementById("gcnum").value;
		var lb = document.getElementById("mlbnum").value;
		var ub = document.getElementById("mubnum").value;
		var range = document.getElementById("togBox1").value;
		var speed = document.getElementById("togBox2").value;
		while(count>0){
			if(mode === 0){
				pList.push(new particle(200-(range)+Math.random()*(2*range),200-(range)+Math.random()*(2*range),-speed+Math.random()*(speed*2),-speed+Math.random()*(speed*2),lb+Math.random()*(ub-lb)));
			}
			else if(mode === 1){
				var angle = Math.random()*(2*Math.PI);
				var dist = Math.random()*range;
				var relativeX = 200+(dist*Math.cos(angle));
				var relativeY = 200+(dist*Math.sin(angle));
				
				var hsspeed =0;
				var vsspeed =0;
				if(relativeY<200 && relativeX>200){
					var hsspeed = speed*(dist*Math.sin(angle));
					var vsspeed = -speed*(dist*Math.cos(angle));
				}
				else if(relativeY<200 && relativeX<200){
					var hsspeed = speed*(dist*Math.sin(Math.PI-angle));
					var vsspeed = speed*(dist*Math.cos(Math.PI-angle));
				}
				else if(relativeY>200 && relativeX<200){
					var hsspeed = -speed*(dist*Math.sin(angle-Math.PI));
					var vsspeed = speed*(dist*Math.cos(angle-Math.PI));
				}
				else if(relativeY>200 && relativeX>200){
					var hsspeed = -speed*(dist*Math.sin((2*Math.PI)-angle));
					var vsspeed = -speed*(dist*Math.cos((2*Math.PI)-angle));
				}
				
				pList.push(new particle(relativeX,relativeY,hsspeed,vsspeed,lb+Math.random()*(ub-lb)));
			}
			else if(mode === 2){
				var dist = range;
				var angle = Math.random()*(2*Math.PI);
				var relativeX = 200+(dist*Math.cos(angle));
				var relativeY = 200+(dist*Math.sin(angle));
				
				var hsspeed =0;
				var vsspeed =0;
				if(relativeY<200 && relativeX>200){
					var hsspeed = speed*(dist*Math.sin(angle));
					var vsspeed = -speed*(dist*Math.cos(angle));
				}
				else if(relativeY<200 && relativeX<200){
					var hsspeed = speed*(dist*Math.sin(Math.PI-angle));
					var vsspeed = speed*(dist*Math.cos(Math.PI-angle));
				}
				else if(relativeY>200 && relativeX<200){
					var hsspeed = -speed*(dist*Math.sin(angle-Math.PI));
					var vsspeed = speed*(dist*Math.cos(angle-Math.PI));
				}
				else if(relativeY>200 && relativeX>200){
					var hsspeed = -speed*(dist*Math.sin((2*Math.PI)-angle));
					var vsspeed = -speed*(dist*Math.cos((2*Math.PI)-angle));
				}
				
				pList.push(new particle(relativeX,relativeY,hsspeed,vsspeed,lb+Math.random()*(ub-lb)));
			}
		
			count-=1;
		}
	});
	
	function distance(x1,y1,x2,y2){
		return(Math.sqrt(((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2))));
	}
	
	function particle(xPos,yPos,hspeed,vspeed,mass){
		this.xPos = xPos;
		this.yPos = yPos;
		this.hspeed = hspeed;
		this.vspeed = vspeed;
		this.mass = mass;
		this.drawSize = 1;
		
		
		this.accelerate = function(otherMass,otherX,otherY,test){
			var r = distance(this.xPos,this.yPos,otherX,otherY);
			var force = GRAVCONST * ((this.mass * otherMass)/(r*r));
			if(r<1) force = GRAVCONST*(this.mass * otherMass);
			var direction;
			if(this.xPos<otherX && this.yPos>otherY){
				direction = Math.atan((this.yPos-otherY)/(otherX-this.xPos));
				this.hspeed = this.hspeed+(Math.cos(direction)*force)/this.mass;
				this.vspeed = this.vspeed-(Math.sin(direction)*force)/this.mass;
			}
			else if(this.xPos>otherX && this.yPos<otherY){
				direction = Math.atan((otherY-this.yPos)/(this.xPos-otherX));
				this.hspeed = this.hspeed-(Math.cos(direction)*force)/this.mass;
				this.vspeed = this.vspeed+(Math.sin(direction)*force)/this.mass;
			}
			else if(this.xPos<otherX && this.yPos<otherY){
				direction = Math.atan((otherY-this.yPos)/(otherX-this.xPos));
				this.hspeed = this.hspeed+(Math.cos(direction)*force)/this.mass;
				this.vspeed = this.vspeed+(Math.sin(direction)*force)/this.mass;
			}
			else if(this.xPos>otherX && this.yPos>otherY){
				direction = Math.atan((this.yPos-otherY)/(this.xPos-otherX));
				this.hspeed = this.hspeed-(Math.cos(direction)*force)/this.mass;
				this.vspeed = this.vspeed-(Math.sin(direction)*force)/this.mass;
			}
			
		}
		
		this.move = function(){
			this.xPos = this.xPos+this.hspeed;
			this.yPos = this.yPos+this.vspeed;
			//this.hspeed=0;
			//this.vspeed=0;
		}
	}
	
	function moveParticles(){
		if(relaSize===0){
			for(var i = 0;i < pList.length;i++){
				for(var ii = 0;ii < pList.length;ii++){
					if(i!=ii){
						pList[i].accelerate(pList[ii].mass,pList[ii].xPos,pList[ii].yPos,pList[ii])
					};
				}			
			}
		}
		else{
			for(var i = 0;i < pList.length;i++){
				pList[i].drawSize=0;
				for(var ii = 0;ii < pList.length;ii++){
					if(i!=ii){
						if(pList[ii].mass>pList[i].mass){
							pList[i].drawSize+=.1;
						}
						else{
							pList[i].drawSize-=.1;
							if(pList[i].drawSize<0) pList[i].drawSize=0;
						}
						
						pList[i].accelerate(pList[ii].mass,pList[ii].xPos,pList[ii].yPos,pList[ii]);
					};
				}			
			}
		}
		
		for(var i = 0;i < pList.length;i++){
			pList[i].move();
		}
	}
	
	function redraw(){
		var can = document.getElementById("cv");
		var canX = can.getContext("2d");
		canX.clearRect(0,0,400,400);
		canX.fillStyle = "white";
		canX.fillRect(0,0,400,400);
		canX.fillStyle = "black";
		if(relaSize===1){
			for(var i = 0;i < pList.length;i++){
				canX.fillRect(pList[i].xPos-(pList[i].drawSize/2),pList[i].yPos-(pList[i].drawSize/2),pList[i].drawSize,pList[i].drawSize);
			}
		}
		else{
			for(var i = 0;i < pList.length;i++){
				canX.fillRect(pList[i].xPos,pList[i].yPos,1,1);
			}
		}
	}

	var a = setInterval(function(){moveParticles()},1);
	var b = setInterval(function(){redraw()},1);
});