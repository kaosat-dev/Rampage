Polymer('three-viewer', {
		applyAuthorStyles: true,
		noscript:true,
		
		width:320,
		height:240,
		bg: "#ffffff",
		
		viewAngle: 40,
		projection: "perspective",
		autoRotate:false,
		
		meshStyle:'shaded',
		meshOutlines: true,
		
		showGrid: true,
		showShadows:true,
		showStats: false,
		showControls: false,
		showAxes:true,
		
		//TODO: find a way to work with the following type of settings, while keeping the API simple 
		//These are NOT used currently
		shadows:
		{
			show:false,
			resolution:128,
			self:true
		},
		grid:{
			show:false,
        	size: 200,
        	steps: 10,
        	autoSize:false,
        	color : "0x00baff",
        	opacity: 0.1,
        	numbering: true,
        	numberingPosition : 'center'
		},
		cameraConf:{
			defaultPosition: [100,100,200],
        	position     : "diagonal",
        	projection   : "perspective",
        	viewAngle : 40,
        	autoRotate   : false
      	},
		ready: function() {
			
			/*this.shadows= this.shadows || {
				show:false,
				resolution:128,
				self:true};*/
			this.scene = new THREE.Scene();
			this.clock = new THREE.Clock();
			this.rootAssembly = new THREE.Object3D();
			this.scene.add(this.rootAssembly); //entry point to store meshes
			
			this.init();
			this.animate();
			
		},
		init: function()
		{
			this.setupRenderer();
			this.setupLights();
			this.setupScene();
			this.setupControls();
		},
		animate: function() 
		{
			this.render();		
			this.update();
			requestAnimationFrame(this.animate.bind(this))
		},
		update: function()
		{
			// delta = change in time since last call (in seconds)
			var delta = this.clock.getDelta(); 
			this.controls.update(); 
			
			if(this.showStats == true)
			{
				if(this.$.stats !== undefined)
				{
					this.$.stats.update();
				}
			}
		},
		render: function() 
		{	
			this.renderer.render( this.scene, this.camera );
		},
		setupRenderer:function()
		{
			/*if ( Detector.webgl )
				renderer = new THREE.WebGLRenderer( {antialias:true} );
			else
			*/
			renderer = new THREE.WebGLRenderer( {antialias:true} );
			//renderer = new THREE.CanvasRenderer(); 
			renderer.setSize(this.width, this.height);
			renderer.shadowMapEnabled = true;
			renderer.shadowMapAutoUpdate = true;
			renderer.shadowMapSoft = true;
			renderer.shadowMapType = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
			
			renderer.setClearColor( this.convertColor(this.bg), 1 );
			this.$.viewer.appendChild( renderer.domElement );
			this.renderer = renderer;
		},
		setupLights: function()
		{
			mainScene = 	this.scene
		  	pointLight = new THREE.PointLight(0x333333,4)
		  	pointLight.position.x = -2500
		  	pointLight.position.y = -2500
		  	pointLight.position.z = 2200
			  
		  	pointLight2 = new THREE.PointLight(0x333333,3)
		  	pointLight2.position.x = 2500
		  	pointLight2.position.y = 2500
		  	pointLight2.position.z = -5200
			
		  	ambientColor = 0x565595
		  	ambientLight = new THREE.AmbientLight(ambientColor)
			  
		  	spotLight = new THREE.SpotLight( 0xbbbbbb, 1.5)  ;  
		  	spotLight.position.x = 50;
		  	spotLight.position.y = 50;
		  	spotLight.position.z = 150;
		  	
			spotLight.shadowCameraNear = 1;
			spotLight.shadowCameraFov =60;
			spotLight.shadowMapBias = 0.0039;
			spotLight.shadowMapDarkness = 0.5;
			shadowResolution = 512 //parseInt(@settings.shadowResolution.split("x")[0])
			spotLight.shadowMapWidth = shadowResolution
			spotLight.shadowMapHeight = shadowResolution
			spotLight.castShadow = true
			  
			lights = [ambientLight,pointLight, pointLight2, spotLight]
			mainScene.lights = lights
			for (var i=0; i<lights.length; i++)
			{
				var light = lights[i]
			    mainScene.add(light)
			}
		},
		setupScene:function()
		{
			cameraSettings = this.cameraConf;
			defaultPosition = cameraSettings.defaultPosition;
			this.defaultCameraPosition = new THREE.Vector3(defaultPosition[0],defaultPosition[1],defaultPosition[2]);
			
		    ASPECT = this.width / this.height;
		      this.NEAR = 0.1;
		      this.FAR = 20000;
		      this.camera = new THREE.CombinedCamera(
		          this.width,
		          this.height,
		          this.viewAngle,
		          this.NEAR,
		          this.FAR,
		          this.NEAR,
		          this.FAR);
		
			console.log("this.defaultCameraPosition",this.defaultCameraPosition)
	      	this.camera.up = new THREE.Vector3( 0, 0, 1 );
	      	this.camera.position.copy(this.defaultCameraPosition);
	      	this.camera.defaultPosition.copy(this.defaultCameraPosition);
		    this.scene.add(this.camera);
		    
			// Sphere parameters: radius, segments along width, segments along height
			var sphereGeometry = new THREE.SphereGeometry( 25, 128, 128 ); 
			var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xff2233} ); 
			var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphere.position.set(10, 50, 30); 
			sphere.castShadow =  true;this.showShadows
        	sphere.receiveShadow = true; this.showShadows
			
			this.rootAssembly.add(sphere);
		    
		    //add grid
		    this.grid = new THREE.CustomGridHelper(200,10)
		    this.scene.add(this.grid);
		    //add axes
		    this.axes = new THREE.LabeledAxes()
		    this.scene.add(this.axes);
		    
		    /* 
		    var t1 = new THREE.TextDrawHelper();
		    var plane = t1.drawTextOnPlane("Hello world");
		    this.scene.add(plane);
		    console.log("scene setup ok",this.scene);*/
		},
		setupControls: function()
		{
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = this.autoRotate;	
		},
		convertColor: function(hex)
		{
	        hex = parseInt("0x"+hex.split('#').pop(),16)
	        return  hex 
		},
		addToScene: function ( object )
		{
			try
			{
				this.rootAssembly.add( object );
			}
			catch(error)
			{
				console.log("Failed to add object",object, "to scence: error", error)
			}
		},
		bgChanged: function() {
			console.log("bg changed");
  		},
  		autoRotateChanged:function()
  		{
  			console.log("autoRotateChanged", this.autoRotate);
  			this.controls.autoRotate = this.autoRotate;
  		},
  		showGridChanged:function()
  		{
  			console.log("showGridChanged", this.showGrid);
  			this.grid.toggle(this.showGrid)
  		},
  		showShadowsChanged:function()
  		{
  			console.log("showShadowsChanged", this.showShadows);
  			this.grid.plane.receiveShadow = this.showShadows;
  			
  			//hack for now
  			var settings = {};
  			settings.shadows = this.showShadows;
  			settings.selfShadows =this.showShadows;
  			settings.objectViewMode = "shaded";
  			updateVisuals(this.rootAssembly, settings);
  		},
  		showAxesChanged: function()
  		{
  			console.log("showAxesChanged", this.showAxes);
  			this.axes.toggle( this.showAxes ) ;
  		}
  });