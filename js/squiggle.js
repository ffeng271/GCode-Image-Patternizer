
var SquiggleGenerator = {
	ystep : 100,  //number of lines
  	detail : 30,  //detail
	ymult : 1, //Strenght/amplitude
	xstep : 0, 
	frequency : 128.00,
  	minB : 0,
  	maxB : 255,



	init : function(){
		//console.log("Initializing squiggle generator...");
  		this.xsmooth = 256-this.frequency; //frequency
  		this.xstep = 31-this.detail;
		this.initOptions();
	}, 

	initOptions : function(){
		var controls = '<span class="options"> \
						<label>No. of line (10-200):</label>\
							<input id="spinnerLines" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="100" min="10" max="200" step="10"></span>\
						<span class="options">\
							<label>Horizontal detail (1-3):</label>\
							<input id="spinnerDetail" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="30" min="1" max="30" step="1"></span>\
						<span class="options">\
							<label>Strength (0-20):</label>\
							<input id="spinnerStrength" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="1" min="0" max="20" step="1"></span>\
						<span class="options">\
							<label>Frequency(5-255):</label>\
							<input id="spinnerFrequency" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="128.0" min="5.0" max="255.0" step="0.01"></span>\
						<span class="options">\
							<label>White point:</label>\
							<input id="spinnerWhitePoint" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="255" min="1" max="256" step="1"></span>\
						<span class="options">\
							<label>Black point:</label>\
							<input id="spinnerBlackPoint" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="0" min="0" max="256" step="1"></span>';

		jQuery("#options_squiggle").append(controls);


		jQuery("#spinnerLines").spinner();
		jQuery("#spinnerDetail").spinner();
		jQuery("#spinnerFrequency").spinner({step: 0.1, numberFormat:"n"});
		jQuery("#spinnerWhitePoint").spinner();
		jQuery("#spinnerBlackPoint").spinner();
		jQuery("#spinnerStrength").spinner();


		jQuery("#spinnerLines").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.ystep);
			} else {
				SquiggleGenerator.ystep = jQuery(this).spinner("value");
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

		jQuery("#spinnerWhitePoint").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.maxB);
			} else {
				SquiggleGenerator.maxB = jQuery(this).spinner("value");
			}
		});

		jQuery("#spinnerBlackPoint").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", SquiggleGenerator.minB);
			} else {
				SquiggleGenerator.minB = jQuery(this).spinner("value");
			}
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
		console.log("processing squiggle");
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
