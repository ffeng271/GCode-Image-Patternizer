
var SpiralGenerator = {
	
	brightness : 170,
	spacing : 1, // increase this for spacing between spiral lines       
	resolution : 2, // 1 - 5

	init : function(){
  		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options">\
						<label>TURNS COUNT:</label>\
						<div id="spacing"></div></span>\
					<span class="options">\
						<label>Brightness:</label>\
						<input id="brightness" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="170" min="0" max="255" step="1"></span>\
					<span class="options">\
						<label>Resolution:</label>\
						<input id="resolution" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2" min="1" max="5" step="1"></span>\
					<br/>';

		jQuery("#options_spiral").append(controls);	


		jQuery("#brightness").spinner();	
		jQuery("#brightness").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SpiralGenerator.brightness);
			} else {
				SpiralGenerator.brightness = jQuery(this).spinner("value");
				SpiralGenerator.drawSpiral();
			}
		});		

		jQuery("#resolution").spinner();	
		jQuery("#resolution").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SpiralGenerator.resolution);
			} else {
				SpiralGenerator.resolution = jQuery(this).spinner("value");
				SpiralGenerator.drawSpiral();
			}
		});	


		jQuery( "#spacing" ).slider({
			min: 1,
      		max: 15,
      		step: 1,
      		value: 16-SpiralGenerator.spacing,
			create: function() {
				jQuery(this).find(".ui-slider-handle").text( 16-SpiralGenerator.spacing );

			},
			slide: function( event, ui ) {
				jQuery(this).find(".ui-slider-handle").text( ui.value );
				SpiralGenerator.spacing = 16-ui.value;
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
		App.drawContext.moveTo(centerX, centerY);

        var noOfTurns = Math.floor(App.drawCanvas.width/Math.PI/this.spacing);

        var theta =  (6-this.resolution)/100;
        while( theta < noOfTurns*Math.PI) {
           	var x = centerX + theta * Math.cos(theta) * this.spacing/2; 
           	var y = centerY + theta * Math.sin(theta) * this.spacing/2; 

			if (x<0 || x>App.drawCanvas.width || y<0 || y>App.drawCanvas.height){
				App.drawContext.moveTo(x,y);
				continue;
			}

			if (App.getPixelBrightness(x,y)<this.brightness){
				App.drawContext.lineTo(x,y);
				App.drawContext.stroke();
				App.drawContext.beginPath();
			} 
			
			App.drawContext.moveTo(x,y);

            theta += (6-this.resolution)/100;
        }



	},

	drawSVG : function(){
		console.log("drawing SVG for Spiral");
		App.svgController.clear();
		jQuery('#svgexport').html("");
		
	}

};
