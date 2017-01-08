
var SquiggleGenerator = {
	ystep : 100,  //number of lines
  	detail : 30,  //detail
	ymult : 1, //Strenght/amplitude
	xstep : 0, 
	frequency : 128.00,
  	minB : 30,
  	maxB : 210,



	init : function(){
		//console.log("Initializing squiggle generator...");
  		this.xsmooth = 256-this.frequency; //frequency
  		this.xstep = 31-this.detail;
		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options"> \
						<label>LINES COUNT:</label>\
							<div id="squiggleLinesCount"></div></span>\
						<span class="options">\
							<label>BRIGHTNESS</label>\
							<div id="sliderBrightness"></div></span>\
						<span class="options">\
							<label title="(1-3)">Horizontal detail:</label>\
							<input id="spinnerDetail" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="30" min="1" max="30" step="1"></span>\
						<span class="options">\
							<label title="(0-20)">Strength:</label>\
							<input id="spinnerStrength" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="1" min="0" max="20" step="1"></span>\
						<span class="options">\
							<label title="(5-255)">Frequency:</label>\
							<input id="spinnerFrequency" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="128.0" min="5.0" max="255.0" step="0.01"></span>';

		jQuery("#options_squiggle").append(controls);


		//jQuery("#spinnerLines").spinner();
		//jQuery("#spinnerLines").val(this.linesNumber);
		jQuery("#spinnerDetail").spinner();
		jQuery("#spinnerFrequency").spinner({step: 0.1, numberFormat:"n"});
		jQuery("#spinnerStrength").spinner();

		// jQuery("#spinnerLines").on("change", function() {
  //   		SquiggleGenerator.ystep = jQuery(this).val();
  //   		SquiggleGenerator.drawLines();
  //   	});


// <input id="spinnerLines" type="range" min="10" max="200" step="10" /></span>\
		jQuery( "#squiggleLinesCount" ).slider({
			min: 10,
      		max: 200,
      		step: 1,
      		value: SquiggleGenerator.ystep,
			create: function() {
				jQuery(this).find(".ui-slider-handle").text( SquiggleGenerator.ystep );
			},
			slide: function( event, ui ) {
				jQuery(this).find(".ui-slider-handle").text( ui.value );
				SquiggleGenerator.ystep = ui.value;
				SquiggleGenerator.drawLines();
			}
		});

		jQuery( "#sliderBrightness" ).slider({
			range: true,
			min: 0,
			max: 255,
			values: [ SquiggleGenerator.minB, SquiggleGenerator.maxB ],
			create: function( event, ui){
	            jQuery("#sliderBrightness").find(".ui-slider-handle:first").text(SquiggleGenerator.minB);
	            jQuery("#sliderBrightness").find(".ui-slider-handle:last").text(SquiggleGenerator.maxB);
			},
			slide: function( event, ui ) {
            	jQuery("#sliderBrightness").find(".ui-slider-handle:first").text(ui.values[0]);
                jQuery("#sliderBrightness").find(".ui-slider-handle:last").text(ui.values[1]);


				SquiggleGenerator.minB = ui.values[0];
				SquiggleGenerator.maxB = ui.values[1];
				SquiggleGenerator.drawLines();
			}
		});



	
		jQuery("#spinnerDetail").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.detail);
			} else {
				SquiggleGenerator.detail = jQuery(this).spinner("value");
			}

			SquiggleGenerator.xstep = 31 - SquiggleGenerator.detail;
		});


		jQuery("#spinnerFrequency").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.frequency);
			} else {
				SquiggleGenerator.frequency = jQuery(this).spinner("value");
			}

			SquiggleGenerator.xsmooth = 256-SquiggleGenerator.frequency;
		});

		jQuery("#spinnerStrength").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.ymult);
			} else {
				SquiggleGenerator.ymult = jQuery(this).spinner("value");
			}
		});

	},

	processImage : function(){
		SquiggleGenerator.drawLines();
	},

	drawLines : function(){
		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = 'white';
		App.drawContext.fill();
		App.drawContext.lineJoin = 'round';
		App.drawContext.lineCap = 'round';

  		App.drawContext.strokeStyle= "#000000";
  		App.drawContext.lineWidth = 1;
  		App.drawContext.setLineDash([0, 0]);


  		for ( y = 0; y < App.drawCanvas.height; y+=App.drawCanvas.height/this.ystep ){
  			App.drawContext.beginPath();

  			a = 0.0;
			startx = 0;
		    
			b = App.getPixelBrightness(1, y);
		 	z = 255.0-b;
		 	r = 5;
		 	starty = y + Math.sin(a)*r;
		    //first vertex

  			App.drawContext.moveTo(startx, y);

		 	

			for (x = 1; x<App.drawCanvas.width; x+=this.xstep) {

		 		b = App.getPixelBrightness(x, y);
		 		b = this.minB<b?b:this.minB;
		 		z = this.maxB-b<0?0:this.maxB-b;
		 		r = z/this.ystep*this.ymult;
		 		a += z/this.xsmooth;

		 		App.drawContext.lineTo(x, y+Math.sin(a)*r);
		    
		 	}
			

  			App.drawContext.lineTo(App.drawCanvas.width, y);
  			App.drawContext.stroke();
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
