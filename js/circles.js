
var CirclesGenerator = {
	
	brightness : 170, 
	distance : 4, //Min = 3, Max = 10
	resolution : 2, //Min = 2, Max = 20,
	minGap : 3, //degrees

	init : function(){
		console.log("Initializing circles generator...");
  		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options">\
							<label>Brightness:</label>\
							<input id="brightness" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="120" min="0" max="255" step="1"></span>\
						<span class="options">\
							<label>Smoothness:</label>\
							<input id="resolution" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2" min="2" max="20" step="1"></span>\
						<span class="options">\
							<label>Gap:</label>\
							<input id="mingap" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="3" min="1" max="5" step="1"></span>\
						<span class="options">\
							<label>Distance:</label>\
							<input id="distance" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="4" min="3" max="10" step="1"></span>\
						<br/>';

		jQuery("#options_circles").append(controls);	

		jQuery("#brightness").spinner();	
		jQuery("#brightness").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.brightness);
			} else {
				CirclesGenerator.brightness = jQuery(this).spinner("value");
				CirclesGenerator.drawCircles();
			}
		});	

		jQuery("#resolution").spinner();	
		jQuery("#resolution").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.resolution);
			} else {
				CirclesGenerator.resolution = jQuery(this).spinner("value");
				CirclesGenerator.drawCircles();
			}
		});	

		
		jQuery("#mingap").spinner();	
		jQuery("#mingap").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.mingap);
			} else {
				CirclesGenerator.mingap = jQuery(this).spinner("value");
				CirclesGenerator.drawCircles();
			}
		});	

		
		jQuery("#distance").spinner();	
		jQuery("#distance").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.distance);
			} else {
				CirclesGenerator.distance = jQuery(this).spinner("value");
				CirclesGenerator.drawCircles();
			}
		});	
	},

	processImage : function(){
		
		//console.log("processing circles");
		this.drawCircles();

		// App.drawContext.beginPath();
		// App.drawContext.arc(App.drawCanvas.width/2, App.drawCanvas.width/2, 100, 0/180*Math.PI, 90/180*Math.PI, false);
		// App.drawContext.stroke();
	},

	drawCircles : function(){
		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = 'white';
		App.drawContext.fill();

		App.drawContext.strokeStyle = 'black';


		centerX = App.drawCanvas.width/2;
		centerY = App.drawCanvas.height/2;

		//var noOfCircles = Math.ceil(App.drawCanvas.width*Math.sqrt(2)/2/distance)-1;
		var noOfCircles = App.drawCanvas.width/this.distance/2;

		for (var i=1;i<=noOfCircles;i++){
			var drawingMode = false;
			var thetaStart;
			var thetaEnd;
			
			var step = (this.resolution/100) * 2*Math.PI/i;
			for (var theta = 0; theta<2*Math.PI; theta+=step){
				var x = Math.floor(centerX + i*this.distance*Math.cos(theta));
				var y = Math.floor(centerY + i*this.distance*Math.sin(theta));

				if (App.getPixelBrightness(x,y)<this.brightness){ // pixel fits
					if (!drawingMode){
						thetaStart = theta;
						thetaEnd = theta;
						drawingMode = true;
					} else {
						thetaEnd = theta;
					}
				} else { // pixel doesn't fit
					if (!drawingMode){
						thetaStart = theta;
					} else {
						
						// I should draw the arc here
						// Check arc length
						if ((thetaEnd-thetaStart)/Math.PI*180>this.minGap){
							// console.log("Start:" + thetaStart/Math.PI*180);
							// console.log("End:" + thetaEnd/Math.PI*180);
							// console.log("drawing");
							App.drawContext.beginPath();
							
							App.drawContext.arc(centerX, centerY, i*this.distance, thetaStart, thetaEnd, false);
							App.drawContext.stroke();
							thetaStart = theta;
						}
						drawingMode = false;
					}

				}

			}
		}
	},

	drawCircles2 : function(){
		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = 'white';
		App.drawContext.fill();

		centerX = App.drawCanvas.width/2;
		centerY = App.drawCanvas.height/2;
		var distance = 4;
		var noOfCircles = Math.ceil(App.drawCanvas.width*Math.sqrt(2)/2/distance)-1;
		
		for (var i=1;i<=noOfCircles;i++){

			
			App.drawContext.beginPath();
			random1 = Math.random() * 2;
			random2 = Math.random() * 2;
			App.drawContext.arc(centerX, centerY, i*distance, random1*Math.PI, random2* Math.PI, true);
			App.drawContext.stroke();
		}
	},

	drawSVG : function(){
		console.log("drawing SVG for Spiral");
		
		App.svgController.clear();

		jQuery('#svgexport').html("");

		// do the actuall draw
		App.svgController.circle(10, 10, 10, {fill: 'none', stroke: "#000000", strokeWidth: 1});


		
	}

};
