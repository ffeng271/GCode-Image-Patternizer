window.onload = function(e) {
	App.init();
	StipplingGenerator.init();
	SquiggleGenerator.init();
	CrosshatchGenerator.init();
	SpiralGenerator.init();
	CirclesGenerator.init();

};


var App = {
	drawCanvas : null,
	drawContext : null,
	imageCanvas : null,
	imageContext : null, 

	image : null,
	imageData : null, 
	showBackground : false,
	imageFile : "vlad.png", //default image 
	assetsFolder : "../assets/",
	drawMethod : "circles",

	svgController : null, 

	init : function(){
		App.drawCanvas = document.getElementById("drawCanvas");
		App.drawContext = App.drawCanvas.getContext("2d");
		App.imageCanvas = document.getElementById("imageCanvas");
		App.imageContext = App.imageCanvas.getContext("2d");


		jQuery('#svgObject').svg();
		App.svgController = jQuery('#svgObject').svg('get');
 							
		App.initGeneralOptions();

		jQuery( "#method" ).val(App.drawMethod);
		jQuery( "#method" ).selectmenu("refresh");
		jQuery(".options_panel").hide();
		jQuery('#options_'+ App.drawMethod).show();


		App.processImage();
	},

	initGeneralOptions : function(){
		jQuery("#method_menu").find("li").removeClass("selected");
		jQuery("#method_menu li[data-method="+this.drawMethod+"]").addClass("selected");
		jQuery("#method_menu li").each(function(i){
			jQuery(this).on("click", function(evt){
				var method = jQuery(this).data("method");
				jQuery("#method_menu").find("li").removeClass("selected");
				jQuery(this).addClass("selected");

				App.drawMethod = method;
				jQuery(".options_panel").hide();
				jQuery('#options_'+ method).show();
				App.processImage();
			});
		});

		App.loadAssetsFolder();

		jQuery("#toggleBackground").on("click", function(){
			StipplingGenerator.showBackground = !StipplingGenerator.showBackground;
			if (StipplingGenerator.showBackground) {
				jQuery("#imageCanvas").show();
			} else {
				jQuery("#imageCanvas").hide();
			}

			jQuery(this).toggleClass("background_on");
			
		});


		jQuery("#buttonGenerate").on("click", function(){
			App.processImage();
		});

		jQuery("#buttonGenerateSVG").on("click", function(){
			if (App.drawMethod == "stipple") {
    			StipplingGenerator.drawSVG();
    		} else if (App.drawMethod == "squiggle") {
    			SquiggleGenerator.drawSVG();
    		} else if (App.drawMethod == "crosshatch") {
    			CrosshatchGenerator.drawSVG();
    		} else if (App.drawMethod == "spiral") {
    			SpiralGenerator.drawSVG();
    		} else if (App.drawMethod == "circles") {
    			CirclesGenerator.drawSVG();
    		}
			
			App.exportSVG();
		});
	},

	processImage : function(){
		App.image= new Image();
		
    	App.image.onload = function(){

    		App.loadImageCanvas();

    		if (App.drawMethod == "stipple") {
    			StipplingGenerator.processImage();
    		} else if (App.drawMethod == "squiggle") {
    			SquiggleGenerator.processImage();
    		} else if (App.drawMethod == "crosshatch") {
    			CrosshatchGenerator.processImage();
    		} else if (App.drawMethod == "spiral") {
    			SpiralGenerator.processImage();
    		} else if (App.drawMethod == "circles") {
    			CirclesGenerator.processImage();
    		}
    	}

    	App.image.src = App.assetsFolder + App.imageFile;
	},

	loadImageCanvas: function(){
		var x = y = 0;
    	var w = App.imageContext.canvas.width;
    	var h = App.imageContext.canvas.height;

		var iw = App.image.width,
    		ih = App.image.height,
    		r = Math.min(w / iw, h / ih),
    		nw = iw * r,   // new prop. width
    		nh = ih * r,   // new prop. height
    		cx, cy, cw, ch, ar = 1;
    	if (nw < w) ar = w / nw;  
    	if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
	    nw *= ar;
	    nh *= ar;

	    // calc source rectangle
	    cw = iw / (nw / w);
	    ch = ih / (nh / h);

	    cx = (iw - cw) * 0.5;
	    cy = (ih - ch) * 0.5
	    // make sure source rectangle is valid
	    if (cx < 0) cx = 0;
	    if (cy < 0) cy = 0;
	    if (cw > iw) cw = iw;
	    if (ch > ih) ch = ih;

	    App.imageContext.drawImage(App.image, cx, cy, cw, ch,  x, y, w, h);

	},

	loadAssetsFolder : function(){

		var fileextension = ".jpg";
		var options = [];
		jQuery.ajax({
		    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
		    url: App.assetsFolder,
		    async: false,
		    success: function (data) {
		        //List all .jpg file names in the page
		        first = true;
		        console.log(jQuery(data));
		        jQuery(data).find("a:contains('.jpg'),a:contains('.png')").each(function () {
		            var filename = this.href.replace(window.location.host+"/", "").replace("http://", "");
		            console.log(filename);
		            if (first==true){
						options.push("<option value='" + filename + "' selected>" + filename + "</option>");
						App.imageFile = filename;
						first = false;
		            } else {
		            	options.push("<option value='" + filename + "'>" + filename + "</option>");
		            	
					}

    			});

    			//append after populating all options
    			$('#imageFile').append(options.join("")).selectmenu();

    			jQuery( "#imageFile" ).selectmenu({
			       change: function( event, data ) {
						App.imageFile = data.item.value;
						App.processImage();
			       }
			    });

  
		    }
		    
		});


	},


	exportSVG: function(){
		var xml = App.svgController.toSVG();
		jQuery('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

		var svgData = jQuery('#svgexport').html();

		if (svgData == '&lt;svg xmlns="http://www.w3.org/2000/svg" version="1.1"/&gt;'){
			alert("gol");
			return false;
		}
		
		jQuery.post("python/save_svg.py", {'method': App.drawMethod, 'svgData': svgData})
			.done(function( data ) {
  				console.log("SAVED SVG FILE");
			}
		);
	},	

	getPixelBrightness : function(x, y){
		var imageData = App.imageContext.getImageData(x, y, 1, 1);
		var data = imageData.data;
        return 0.299*data[0]+0.587*data[1]+ 0.114*data[2];
	}
};

