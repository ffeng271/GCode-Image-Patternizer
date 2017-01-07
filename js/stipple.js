var StipplingGenerator = {
	voronoi : new Voronoi(),
	diagram : null, 
	sites : [],
	timeoutDelay: 100, 
	boundingBox : {xl:0, xr:560, yt:0, yb:560},
	counter : 0,
	generations : 2,
	maxParticles: 2000, 
	cutOff : 0.35,
	dotSizeFactor : 2.5, 
	minDotSize : 1,
	maxDotSize : null,
	dotScale : null,
	showEdges : false,

	init : function(){
		//console.log("Initializing stippling generator...");
		this.maxDotSize = this.minDotSize * (1 + this.dotSizeFactor);
		this.dotScale = this.maxDotSize - this.minDotSize;
		this.boundingBox.xr = App.drawCanvas.width;
		this.boundingBox.yb = App.drawCanvas.height;
		this.initOptions();
	},

	initOptions: function(){
		var controls = '<span class="options"> \
							<button id="toggleEdges" class="ui-button ui-widget background_o">Toggle Vornoi edges</button>\
							<span class="options"> \
						</span>\
						<span class="options">\
							<label>No. of particles:</label>\
							<input id="spinnerParticles" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2000" min="100" max="5000" step="100"></span>\
						<span class="options">\
							<label>No. of generations (1-5):</label>\
							<input id="spinnerGenerations" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2" min="0" max="5" step="1"></span>\
						<span class="options">\
							<label>White cut off (0.1-0.9):</label>\
							<input id="spinnerCutoff" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="0.35" min="0.1" max="0.9" step="0.01"></span>\
						<span class="options">\
							<label>Min. stipple size (1-4):</label>\
							<input id="spinnerMinStippleSize" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="1" min="1" max="4" step="1"></span>\
						<span class="options">\
							<label>Stipple scale (1.1-4.0):</label>\
							<input id="spinnerStipplesScale" autocomplete="off" class="ui-spinner-input" role="spinbutton" value="2.4" min="1.1" max="4.0" step="0.1"></span>';

		jQuery("#options_stipple").append(controls);

		jQuery("#spinnerGenerations").spinner();
		jQuery("#spinnerParticles").spinner();
		jQuery("#spinnerCutoff").spinner();
		jQuery("#spinnerMinStippleSize").spinner();
		jQuery("#spinnerStipplesScale").spinner({step: 0.1, numberFormat:"n"});

		jQuery("#toggleEdges").on("click", function(){
			StipplingGenerator.showEdges = !StipplingGenerator.showEdges;
			StipplingGenerator.drawRegions(StipplingGenerator.sites);
			jQuery(this).toggleClass("background_on");
			
		});

		jQuery("#spinnerParticles").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", StipplingGenerator.maxParticles);
			} else {
				StipplingGenerator.maxParticles = jQuery(this).spinner("value");
			}
		});


		jQuery("#spinnerGenerations").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", 1);
			} else {
				StipplingGenerator.generations = jQuery(this).spinner("value");
			}
		});

		jQuery("#spinnerCutoff").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", 1);
			} else {
				StipplingGenerator.generations = jQuery(this).spinner("value");
			}
		});

		jQuery("#spinnerCutoff").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", 0.35);
			} else {
				StipplingGenerator.cutOff = jQuery(this).spinner("value");
			}
		});

		jQuery("#spinnerMinStippleSize").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", 1);
			} else {
				StipplingGenerator.minDotSize = jQuery(this).spinner("value");
			}
			StipplingGenerator.maxDotSize = StipplingGenerator.minDotSize * (1 + StipplingGenerator.dotSizeFactor);
			StipplingGenerator.dotScale = StipplingGenerator.maxDotSize - StipplingGenerator.minDotSize;
		});

		jQuery("#spinnerStipplesScale").on("blur", function(){
			if (!jQuery(this).spinner("isValid")) {
				jQuery(this).spinner("value", 0.35);
			} else {
				StipplingGenerator.dotSizeFactor = jQuery(this).spinner("value");
			}
			StipplingGenerator.maxDotSize = StipplingGenerator.minDotSize * (1 + StipplingGenerator.dotSizeFactor);
			StipplingGenerator.dotScale = StipplingGenerator.maxDotSize - StipplingGenerator.minDotSize;
		});

	},

	drawSVG: function(){
		App.svgController.clear();

		jQuery('#svgexport').html("");
		
		var iSite = StipplingGenerator.sites.length;

		while (iSite--) {
			v = StipplingGenerator.sites[iSite];
			var pixelBrightness = App.getPixelBrightness( v.x, v.y)/255;
			if (pixelBrightness < 1-this.cutOff) {
				//var radius =  Math.round(this.maxDotSize - pixelBrightness * this.dotScale);	
				var radius =  this.maxDotSize - (1-pixelBrightness) * this.dotScale;	
				App.svgController.circle(v.x-2/3, v.y-2/3, radius, {fill: 'none', stroke: "#000000", strokeWidth: 1});
			}	
		}
	},

	cellArea: function(cell) {
		var area = 0,
			halfedges = cell.halfedges,
			iHalfedge = halfedges.length,
			halfedge,
			p1, p2;

		while (iHalfedge--) {
			halfedge = halfedges[iHalfedge];
			p1 = halfedge.getStartpoint();
			p2 = halfedge.getEndpoint();
			area += p1.x * p2.y;
			area -= p1.y * p2.x;
		}

		area /= 2;
		return area;
	},

	rejectionSampling: function(){
		// Fill particles array by "rejection sampling"
		var particles = [];
		var borderWidth = 10;
		

		var mainWidth = App.drawCanvas.width;
		var mainHeight = App.drawCanvas.height

		var lowBorderX =  borderWidth;
		var hiBorderX = mainWidth - borderWidth; 
		var lowBorderY = borderWidth; 
		var hiBorderY = mainHeight - borderWidth; 


		var i = 0;

		while (i < this.maxParticles){
			var x = Math.floor(lowBorderX +  Math.random()*(hiBorderX - lowBorderX));
			var y = Math.floor(lowBorderY +  Math.random()*(hiBorderY - lowBorderY));

			//GETS FX and FY OUTSIDE OF THE RANGE!!!!!
			var pixelBrightness = App.getPixelBrightness(x,y);

			rand = Math.random()*255;
		
			if ( rand >= pixelBrightness ){
				particles.push({x, y});  
				i+=1;
			}
		}
		
		return particles;


	},

	processVornoi: function(sites) {
		this.voronoi.recycle(this.diagram);
		this.diagram = this.voronoi.compute(sites, this.boundingBox);
		this.drawRegions(sites);
		this.sites = sites;
	},

	cellCentroid: function(cell) {
		var x = 0, y = 0,
			halfedges = cell.halfedges,
			iHalfedge = halfedges.length,
			halfedge,
			v, p1, p2;
		while (iHalfedge--) {
			halfedge = halfedges[iHalfedge];
			p1 = halfedge.getStartpoint();
			p2 = halfedge.getEndpoint();
			v = p1.x*p2.y - p2.x*p1.y;
			x += (p1.x+p2.x) * v;
			y += (p1.y+p2.y) * v;
			}
		v = this.cellArea(cell) * 6;
		return {x:x/v,y:y/v};
	},


	relaxSites: function() {
		if (!this.diagram) {return;}

		var cells = this.diagram.cells,
			iCell = cells.length,
			cell,
			site, sites = [],
			again = false,
			rn, dist;
		var p = 1 / iCell * 0.1;
		while (iCell--) {
			cell = cells[iCell];
			rn = Math.random();
			// probability of apoptosis
			if (rn < p) {
				continue;
				}
			site = this.cellCentroid(cell);
			dist = this.distance(site, cell.site);
			again = again || dist > 1;
			// don't relax too fast
			if (dist > 2) {
				site.x = (site.x+cell.site.x)/2;
				site.y = (site.y+cell.site.y)/2;
				}
			// probability of mytosis
			if (rn > (1-p)) {
				dist /= 2;
				sites.push({
					x: site.x+(site.x-cell.site.x)/dist,
					y: site.y+(site.y-cell.site.y)/dist,
					});
				}
			sites.push(site);
		}
		
		this.processVornoi(sites);

		if (again && this.counter<this.generations) {
			this.counter++;
			var me = this;
			this.timeout = setTimeout(function(){
				me.relaxSites();
			}, this.timeoutDelay);
		}
	},

	distance: function(a, b) {
		var dx = a.x-b.x;
		var	dy = a.y-b.y;
		return Math.sqrt(dx*dx+dy*dy);
	},


	processImage: function(){
		var canvasSize = App.drawCanvas.width;

		this.sites = this.rejectionSampling();
		this.processVornoi(this.sites);

		// relax sites
		if (StipplingGenerator.generations>0) {
			if (StipplingGenerator.timeout) {
				clearTimeout(StipplingGenerator.timeout)
				StipplingGenerator.timeout = null;
				}

			StipplingGenerator.timeout = setTimeout(function(){
				StipplingGenerator.relaxSites();
			}, StipplingGenerator.timeoutDelay);
		
		} 

	},
	
	drawRegions: function(sites){
		
		this.drawStipples(sites);


		
	}, 

	drawStipples : function(sites){
		// background

		App.drawContext.globalAlpha = 1;
		App.drawContext.beginPath();
		App.drawContext.rect(0,0,App.drawCanvas.width,App.drawCanvas.height);
		App.drawContext.fillStyle = 'white';
		App.drawContext.fill();

		// voronoi
		if (!this.diagram) {return;}

		if (this.showEdges){
			this.drawEdges();
		}

		// sites
		//this.drawContext.beginPath();
		App.drawContext.fillStyle = '#000';
		
		var iSite = sites.length;

		while (iSite--) {
			v = sites[iSite];
			//this.drawContext.rect(v.x+canvasOffset-2/3,v.y+canvasOffset-2/3,2,2);
			App.drawContext.beginPath();

			var pixelBrightness = App.getPixelBrightness(v.x, v.y)/255;
			if (pixelBrightness < 1-this.cutOff) {

				var radius = this.maxDotSize - pixelBrightness * this.dotScale;
				radius = Math.round(radius);
				App.drawContext.ellipse(v.x-2/3, v.y-2/3, radius, radius, 0, 0, 2 * Math.PI);
			}	

			App.drawContext.fill();
		}

	}, 

	drawEdges : function(){
		//	edges
			App.drawContext.beginPath();
			App.drawContext.strokeStyle = '#CCC';
			App.drawContext.setLineDash([3, 2]);

			var edges = this.diagram.edges,
				iEdge = edges.length,
				edge, v;
			while (iEdge--) {
				edge = edges[iEdge];
				v = edge.va;
				App.drawContext.moveTo(v.x,v.y);
				v = edge.vb;
				App.drawContext.lineTo(v.x,v.y);
			}
			App.drawContext.stroke();

	}
};
