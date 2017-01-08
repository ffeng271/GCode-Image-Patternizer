
var CrosshatchGenerator = {
	linesNumber : 150,
	resolution : 1,
	minLineLenght : 2,
	layer1Angle : 45,
	layer2Angle : 15, 
	layer3Angle : 125, 
	layer1Treshold : 180,
	layer2Treshold : 120,
	layer3Treshold : 60,
	layer1Color : "#000000",
	layer2Color : "#000000",
	layer3Color : "#000000",


	init : function(){
  		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options">\
							<label>LINES COUNT:</label>\
							<div id="rangeHatchLines"></div></span>\
						<span class="options">\
							<label>Resolution:</label>\
							<input id="spinnerResolution" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="1" min="0.5" max="5" step="0.5"></span>\
						<span class="options">\
							<label>Min. line length:</label>\
							<input id="spinnerMinLineLength" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2" min="1" max="10" step="1"></span>\
						<span class="options floating">\
							<label class="smaller_label">Layer 1:</label>\
							<input id="spinnerLayer1Treshold" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="180" min="0" max="255" step="1">\
							<div id="spinnerLayer1Angle" class="anglePicker"></div>\
							<div id="colorPicker1" class="colorPicker"></div></span>\
						<span class="options floating">\
							<label class="smaller_label">Layer 2:</label>\
							<input id="spinnerLayer2Treshold" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="120" min="0" max="255" step="1">\
							<div id="spinnerLayer2Angle" class="anglePicker"></div>\
							<div id="colorPicker2" class="colorPicker"></div></span>\
						<span class="options floating">\
							<label class="smaller_label">Layer 3:</label>\
							<input id="spinnerLayer3Treshold" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="80" min="0" max="255" step="1">\
							<div id="spinnerLayer3Angle" class="anglePicker"></div>\
							<div id="colorPicker3" class="colorPicker"></div></span><br/>';

		jQuery("#options_crosshatch").append(controls);
		jQuery( "#rangeHatchLines" ).slider({
			min: 20,
      		max: 200,
      		step: 10,
      		value: CrosshatchGenerator.linesNumber,
			create: function() {
				jQuery(this).find(".ui-slider-handle").text( CrosshatchGenerator.linesNumber);

			},
			slide: function( event, ui ) {
				jQuery(this).find(".ui-slider-handle").text( ui.value );
				CrosshatchGenerator.linesNumber= ui.value;
				CrosshatchGenerator.drawCrosshatch();
			}
		});


		jQuery("#spinnerResolution").spinner();	
		jQuery("#spinnerResolution").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CrosshatchGenerator.resolution);
			} else {
				CrosshatchGenerator.resolution = jQuery(this).spinner("value");
				CrosshatchGenerator.drawCrosshatch();
			}
		});	

		jQuery("#spinnerMinLineLength").spinner();	
		jQuery("#spinnerMinLineLength").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CrosshatchGenerator.minLineLenght);
			} else {
				CrosshatchGenerator.minLineLenght = jQuery(this).spinner("value");
				CrosshatchGenerator.drawCrosshatch();
			}
		});	

		// Hatching angles
		jQuery("#spinnerLayer1Angle").anglepicker({
		    change: function(e, ui) {
		    	CrosshatchGenerator.layer1Angle = ui.value;
		    	CrosshatchGenerator.drawCrosshatch();
		    },
		    stop: function(e, ui) {
		    },
		    value: CrosshatchGenerator.layer1Angle,
		    clockwise: true
		});

		jQuery("#spinnerLayer2Angle").anglepicker({
		    change: function(e, ui) {
		    	CrosshatchGenerator.layer2Angle = ui.value;
		    	CrosshatchGenerator.drawCrosshatch();
		    },
		    value: CrosshatchGenerator.layer2Angle,
		    clockwise: true
		});

		jQuery("#spinnerLayer3Angle").anglepicker({
		    change: function(e, ui) {
		    	CrosshatchGenerator.layer3Angle = ui.value;
		    	CrosshatchGenerator.drawCrosshatch();
		    },
		    value: CrosshatchGenerator.layer3Angle,
		    clockwise: true
		});

	

		// Brightness tresholds
		jQuery("#spinnerLayer1Treshold").spinner();
		jQuery("#spinnerLayer1Treshold").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CrosshatchGenerator.layer1Treshold);
			} else {
				CrosshatchGenerator.layer1Treshold = jQuery(this).spinner("value");
			}
		});	


		jQuery("#spinnerLayer2Treshold").spinner();
		jQuery("#spinnerLayer2Treshold").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CrosshatchGenerator.layer2Treshold);
			} else {
				CrosshatchGenerator.layer2Treshold = jQuery(this).spinner("value");
			}
		});	

		jQuery("#spinnerLayer3Treshold").spinner();
		jQuery("#spinnerLayer3Treshold").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CrosshatchGenerator.layer3Treshold);
			} else {
				CrosshatchGenerator.layer3Treshold = jQuery(this).spinner("value");
			}
		});	

		//Layer colors		
		jQuery("#colorPicker1").minicolors({ defaultValue: CrosshatchGenerator.layer1Color, change: function(hex, opacity) {CrosshatchGenerator.layer1Color = hex; CrosshatchGenerator.drawCrosshatch();}});
		jQuery("#colorPicker2").minicolors({ defaultValue: CrosshatchGenerator.layer2Color, change: function(hex, opacity) {CrosshatchGenerator.layer2Color = hex; CrosshatchGenerator.drawCrosshatch();}});
		jQuery("#colorPicker3").minicolors({ defaultValue: CrosshatchGenerator.layer3Color, change: function(hex, opacity) {CrosshatchGenerator.layer3Color = hex; CrosshatchGenerator.drawCrosshatch();}});



	},

	processImage : function(){
		CrosshatchGenerator.drawCrosshatch();
	},

	drawCrosshatch : function(){
		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = "white";
		App.drawContext.fill();
		App.drawContext.setLineDash([0, 0]);
		App.drawContext.lineWidth = 1;
		
		var offsets = [20, 20, 20];
		
		CrosshatchGenerator.drawLines(CrosshatchGenerator.layer1Angle, CrosshatchGenerator.linesNumber, offsets[0], CrosshatchGenerator.layer1Treshold, CrosshatchGenerator.layer1Color, CrosshatchGenerator.resolution);
		CrosshatchGenerator.drawLines(CrosshatchGenerator.layer2Angle, CrosshatchGenerator.linesNumber, offsets[1], CrosshatchGenerator.layer2Treshold, CrosshatchGenerator.layer2Color, CrosshatchGenerator.resolution);
		CrosshatchGenerator.drawLines(CrosshatchGenerator.layer3Angle, CrosshatchGenerator.linesNumber, offsets[2], CrosshatchGenerator.layer3Treshold, CrosshatchGenerator.layer3Color, CrosshatchGenerator.resolution);

	},

	drawLines : function(thetaAngle, lines, offset, levelTreshold, levelColor, resolution){

		
		var hatchSize = App.drawCanvas.width;
		if (thetaAngle>180){
			thetaAngle -= 180; //Transform angle to direction 
		}

		var theta = (thetaAngle) * (Math.PI/180); //In radians
		

		if (thetaAngle < 90)
			var maxDistance = Math.ceil(hatchSize * (Math.sin(theta) + Math.cos(theta))-offset); //what's the max distance to cover with the lines
		else if (thetaAngle>90)
			var maxDistance = Math.ceil(hatchSize * (Math.sin(Math.PI-theta) + Math.cos(Math.PI-theta))-offset); //what's the max distance to cover with the lines
		else
			var maxDistance = hatchSize;

		var lineCounter = 0;
		
		if (thetaAngle>90)
			theta = Math.PI - theta; //Converting obtuse to acute angle

		for (lineDistance=offset; lineDistance<maxDistance;lineDistance+=maxDistance/this.linesNumber){
			// Calculate line start and end position
			if ( thetaAngle < 90 ){
				if ( lineDistance < hatchSize * Math.cos(theta)){ 
					xStart = 0; 
					yStart = lineDistance / Math.cos(theta); 
				} else { 
					xStart = lineDistance / Math.sin(theta) - hatchSize / Math.tan(theta); 
					yStart = hatchSize;
				}

				if ( lineDistance < hatchSize * Math.sin(theta)) {
					xEnd = lineDistance / Math.sin(theta);
					yEnd = 0;
				} else {
					xEnd = hatchSize;
					yEnd = lineDistance / Math.cos(theta) - hatchSize * Math.tan(theta);
				}
			} else if (thetaAngle>90) {
				if ( lineDistance < hatchSize * Math.sin(theta) ){ // 
					xStart = hatchSize - lineDistance / Math.sin(theta); 
					yStart = 0;
				} else { 
					xStart = 0
					yStart = lineDistance / Math.cos(theta) - hatchSize * Math.tan(theta);
				}

				if ( lineDistance < hatchSize * Math.cos(theta) ) {
					xEnd = hatchSize;
					yEnd = lineDistance / Math.cos(theta);
				} else {
					xEnd = hatchSize - lineDistance / Math.sin(theta) + hatchSize / Math.tan(theta);
					yEnd = hatchSize;
				}
			} else { // Angle is exactly 90 degrees
				xStart = xEnd = lineDistance;
				yStart = 0;
				yEnd = hatchSize;
			}
			

			App.drawContext.strokeStyle = levelColor;
			var drawingMode = false;
			var xOrigin, yOrigin;

			if ( thetaAngle != 90) { //Non vertical line

				for (var x=xStart; x<=xEnd; x+=resolution){ //For each x in line
					
					// Calculate y position
					if (thetaAngle < 90) { //Acute angle


						if (lineDistance < hatchSize * Math.cos(theta)) { //Above diagonal
							y = yStart - x * Math.tan(theta); //below diagonal

							if (x!=xStart) {
								xPrev = x-resolution;
								yPrev = yStart - xPrev * Math.tan(theta);
							}

						} else {
							y = hatchSize - (x - xStart) * Math.tan(theta);

							if (x!=xStart) {
								xPrev = x-resolution;	
								yPrev = hatchSize - (xPrev - xStart) * Math.tan(theta);
							}
						}

					} else { //Obtuse angle
						if (lineDistance < hatchSize * Math.sin(theta)) { //Above diagonal
							y = (x - xStart) * Math.tan(theta); //below diagonal

							if (x!=xStart) {
								xPrev = x-resolution;
								yPrev = y = (xPrev - xStart) * Math.tan(theta);
							}

						} else {
							y = yStart + x * Math.tan(theta); 

							if (x!=xStart) {
								xPrev = x-resolution;	
								yPrev = yStart + xPrev * Math.tan(theta); 
							}
						}
					}

					if (App.getPixelBrightness(x,y)<levelTreshold){
						//Point fits threshold
						if (!drawingMode){ // I wasn't in drawing mode
							drawingMode = true; // Entering drawing mode
							xOrigin = x; // Save 
							yOrigin = y;
							App.drawContext.beginPath();
							App.drawContext.moveTo(xOrigin,yOrigin); // Move there so it starts drawing the line
						} else {
							// Do nothing 'cause it's still part of the line
						}
					} else {
						//Point doesn't fit treshold
						if (!drawingMode){ //Move to next point
							App.drawContext.moveTo(x,y);
						} else {
							//I was in drawing mode

							var lineWidth = Math.sqrt((yPrev-yOrigin)*(yPrev-yOrigin)+(xPrev-xOrigin)*(xPrev-xOrigin));
							
							if (lineWidth<this.minLineLenght){ //line is not long enough so we cancel this segment
								App.drawContext.moveTo(x,y);
								drawingMode = false;
							} else {
								App.drawContext.lineTo(xPrev, yPrev);
								App.drawContext.stroke();
								drawingMode = false;
							}


						}

					}
				}
			} else { // Vertical lines
				for (var y=yStart; y<=yEnd; y+=resolution){
					x = xStart;


					if (y!=yStart) {
						xPrev = x;
						yPrev = y-resolution;
					}


					if (App.getPixelBrightness(x,y)>levelTreshold){
						//Point fits threshold
						if (!drawingMode){ // I wasn't in drawing mode
							drawingMode = true; // Entering drawing mode
							xOrigin = x; // Save 
							yOrigin = y;
							App.drawContext.beginPath();
							App.drawContext.moveTo(xOrigin,yOrigin); // Move there so it starts drawing the line
						} else {
							// Do nothing 'cause it's still part of the line
						}
					} else {
						//Point doesn't fit treshold
						if (!drawingMode){ //Move to next point
							App.drawContext.moveTo(x,y);
						} else {
							//I was in drawing mode

							//Check if the line is long enough

							var lineWidth = Math.sqrt((yPrev-yOrigin)*(yPrev-yOrigin)+(xPrev-xOrigin)*(xPrev-xOrigin));
							
							if (lineWidth<this.minLineLenght){ //line is not long enough so we cancel this segment
								App.drawContext.moveTo(x,y);
								drawingMode = false;
							} else {
								App.drawContext.lineTo(xPrev, yPrev);
								App.drawContext.stroke();
								drawingMode = false;
							}
						}

					}

				}

			}
			
			lineCounter+=1;
		}



	}, 


	drawSVG : function(){
		console.log("drawing SVG for Squiggle");
		
		App.svgController.clear();

		jQuery('#svgexport').html("");

		// do the actuall draw
		App.svgController.circle(10, 10, 10, {fill: 'none', stroke: "#000000", strokeWidth: 1});


		
	}

};
