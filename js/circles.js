
var CirclesGenerator = {
	brightness : 170, 
	resolution : 2, //Min = 2, Max = 20,
	minArc : 3, //degrees
	noOfCircles : 70,  //Min = 30, Max = 100


	init : function(){
  		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options">\
							<label>CIRCLES COUNT:</label>\
							<div id="noOfCircles"></div></span>\
						<span class="options">\
							<label>Brightness:</label>\
							<input id="brightnessCircles" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="120" min="0" max="255" step="1"></span>\
						<span class="options">\
							<label>MIN ARC:</label>\
							<input id="minArc" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="3" min="1" max="7" step="1"></span>\
						<br/>';

		jQuery("#options_circles").append(controls);	

		jQuery( "#noOfCircles" ).slider({
			min: 30,
      		max: 100,
      		step: 10,
      		value: CirclesGenerator.noOfCircles,
			create: function() {
				jQuery(this).find(".ui-slider-handle").text( CirclesGenerator.noOfCircles );

			},
			slide: function( event, ui ) {
				jQuery(this).find(".ui-slider-handle").text( ui.value );
				CirclesGenerator.noOfCircles = ui.value;
				CirclesGenerator.drawCircles();
			}
		});



		jQuery("#brightnessCircles").spinner();	
		jQuery("#brightnessCircles").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.brightness);
			} else {
				CirclesGenerator.brightness = jQuery(this).spinner("value");
				CirclesGenerator.drawCircles();
			}
		});	

		jQuery("#minArc").spinner();	
		jQuery("#minArc").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", CirclesGenerator.minArc);
			} else {
				CirclesGenerator.minArc = jQuery(this).spinner("value");
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

		var distance = App.drawCanvas.width/2/this.noOfCircles;

		for (var i=1;i<=this.noOfCircles;i++){
			var drawingMode = false;
			var thetaStart;
			var thetaEnd;
			
			var step = (this.resolution/100) * 2*Math.PI/i;
			for (var theta = 0; theta<2*Math.PI; theta+=step){
				var x = Math.floor(centerX + i*distance*Math.cos(theta));
				var y = Math.floor(centerY + i*distance*Math.sin(theta));

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
						if ((thetaEnd-thetaStart)/Math.PI*180>this.minArc){
							App.drawContext.beginPath();
							
							App.drawContext.arc(centerX, centerY, i*distance, thetaStart, thetaEnd, false);
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
