
var SpiralGenerator = {
	
	levelTreshold : 170,
	gap : 0.6, // increase this for spacing between spiral lines       
	increment : 2, // decreasing this makes the curve smoother

	init : function(){
		console.log("Initializing spiral generator...");
  		this.initOptions();
	}, 

	initOptions : function(){
			var controls = '<span class="options">\
							<label>Smoothness:</label>\
							<input id="increment" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2" min="1" max="5" step="1"></span>\
						<span class="options">\
							<label>Spacing:</label>\
							<input id="gap" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="0.6" min="0.5" max="2" step="0.1"></span>\
						<span class="options">\
							<label >Brightness:</label>\
							<input id="levelTreshold" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="120" min="0" max="255" step="1"></span>\
						<br/>';

			jQuery("#options_spiral").append(controls);	

			jQuery("#increment").spinner();	
			jQuery("#increment").on("blur", function(){
				if (!jQuery(this).spinner("isValid")) {
					jQuery(this).spinner("value", SpiralGenerator.increment);
				} else {
					SpiralGenerator.increment = jQuery(this).spinner("value");
					SpiralGenerator.drawSpiral();
				}
			});	

			jQuery("#gap").spinner();	
			jQuery("#gap").on("blur", function(){
				if (!jQuery(this).spinner("isValid")) {
					jQuery(this).spinner("value", SpiralGenerator.gap);
				} else {
					SpiralGenerator.gap = jQuery(this).spinner("value");
					SpiralGenerator.drawSpiral();
				}
			});		

			jQuery("#levelTreshold").spinner();	
			jQuery("#levelTreshold").on("blur", function(){
				if (!jQuery(this).spinner("isValid")) {
					jQuery(this).spinner("value", SpiralGenerator.levelTreshold);
				} else {
					SpiralGenerator.levelTreshold = jQuery(this).spinner("value");
					SpiralGenerator.drawSpiral();
				}
			});	
	},

	processImage : function(){
		
		this.drawSpiral();
	},

	drawSpiral : function(){
		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = 'white';
		App.drawContext.fill();
		
		centerX = App.drawCanvas.width/2;
		centerY = App.drawCanvas.height/2;

		App.drawContext.beginPath();
	
		App.drawContext.setLineDash([0, 0]);
		App.drawContext.strokeStyle='#000000';

		var drawingMode = false;
		App.drawContext.moveTo(centerX, centerY);

        var noOfTurns = Math.floor(App.drawCanvas.width/2/Math.PI/this.gap);
        var theta = this.increment/40;

        while( theta < noOfTurns*Math.PI) {
           	var x = centerX + theta * Math.cos(theta) * this.gap; 
           	var y = centerY + theta * Math.sin(theta) * this.gap; 

			if (x<0 || x>App.drawCanvas.width || y<0 || y>App.drawCanvas.height){
				App.drawContext.moveTo(x,y);
				continue;
			}

			if (App.getPixelBrightness(x,y)<this.levelTreshold){
				App.drawContext.lineTo(x,y);
				
				App.drawContext.stroke();
				App.drawContext.beginPath();
			} 
			
			App.drawContext.moveTo(x,y);

            theta = theta + this.increment/40;
        }



	},

	drawSVG : function(){
		console.log("drawing SVG for Spiral");
		App.svgController.clear();
		jQuery('#svgexport').html("");
		
	}

};
