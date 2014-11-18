#pragma strict

@script ExecuteInEditMode()
import System.IO;


//preset variables
var useDarkUI : boolean = true;
var renderTex : RenderTexture;
var presetIndex : int;
private var presetUseIndex : int;
var presetOptions : String[];

var presetFileIndex : int;
var presetFileUseIndex : int;
var presetFiles : String[];

var refractShift : float = 1.0;
var refractScale : float = 1.0;
var blurSpread : float = 0.1;
var hasStarted : boolean = false;
var setShoreWaveScale : float = 1.0;
var setFlowShoreScale : float = 1.0;
var setflowOffX : float = 0.0;
var setflowOffY : float = 0.0;
var usewaveShoreHt : float = 0.0;
var waveBreakAmt : float = 1.0;
var shallowFoamAmt : float = 1.0;

var shoreOffX : float = 0.0;
var shoreOffY : float = 0.0;

var presetTransIndexFrm : int = 0;
var presetTransIndexTo : int = 0;
var presetStartTransition : boolean = false;
var presetTransitionTime : float = 3.0;
var presetTransitionCurrent : float = 1.0;
var presetSaveName : String = "my custom preset";
var presetToggleSave : boolean = false;
var presetDataArray : String[];
var presetDataString : String;
var baseDir : String = "SUIMONO - WATER SYSTEM 2";
var suimonoModuleObject : GameObject;
var suimonoModuleLibrary : SuimonoModuleLib;
var mirrorTexture : RenderTexture;

var hFoamHeight : float = 5.5;
var hFoamAmt : float = 1.0;
var hFoamSpread : float = 2.0;

var reflectionObject : GameObject;
var shorelineObject : GameObject;
var shorelineComponent : Suimono_flowGenerator;

var overallBright : float = 1.0;
var overallTransparency : float = 1.0;
var enableUnderDebris : boolean = true;
var enableUnderDebrisWrite : float = 1.0;

var waterForce : Vector2 = Vector2(0.0,0.0);
var flowForce : Vector2 = Vector2(0.0,0.0);
var convertAngle:Vector3;

//general variables
var presetFile : String = "/RESOURCES/_PRESETS.txt";
var typeIndex : int;
var typeUseIndex : int;
var typeOptions = new Array("Infinite 3D Ocean","3D Waves","Flat Plane");
var enableCustomTextures : boolean = false;

//editor variables
var showGeneral : boolean = false;
var showWaves : boolean = false;
var showSurface : boolean = false;
var showFoam : boolean = false;
var showUnderwater : boolean = false;
var showEffects : boolean = false;
var showPresets : boolean = false;
var showTess : boolean = false;
var autoTess : boolean = true;

//underwater settings
var enableUnderwaterFX : boolean = true;
var enableUnderRefraction : boolean = true;
var enableDynamicReflections : boolean = true;

var underRefractionAmount : float = 1.0;
var underRefractionScale : float = 1.0;
var underRefractionSpeed : float = 1.0;

var enableUnderBlur : boolean = true;
var underBlurAmount : float = 0.01;
var blurSamples : int = 20;
var enableUnderAutoFog : boolean = true;
var underwaterColor : Color = Color(0.2,0.2,1.0,1.0);
var enableUnderEthereal : boolean = true;
var etherealShift : float = 0.1;
var underwaterFogDist : float = 1.0;
var underwaterFogSpread : float = 1.0;

var cameraIsSet : boolean;

//wave settings
var waveHeight : float = 0.0;
var detailHeight : float = 0.0;
var waveShoreHeight : float = 0.0;
var waveScale : float = 0.0;
var detailScale : float = 0.0;
var waveShoreScale : float = 0.0;
var shoreInfluence : float = 0.0;
var normalShore : float = 0.0;
var overallScale : float = 5.0;
var lightAbsorb : float = 0.125;
var shadowAmount : float = 0.5;
var lightRefract : float = 1.0;
var foamScale : float = 0.5;
var foamAmt : float = 0.3;
var foamColor : Color = Color(0.9,0.9,0.9,0.9);
var useFoamColor : Color = Color(0.9,0.9,0.9,0.9);
var edgeSpread : float = 0.3;
var edgeBlend : float = 0.3;
var edgeColor : Color = Color(0.9,0.9,0.9,0.9);
var useEdgeColor : Color = Color(0.9,0.9,0.9,0.9);
var reflectDist : float = 0.2;
var reflectDistUnderAmt : float = 0.2;
var reflectSpread : float = 0.05;
var colorDynReflect : Color = Color(1.0,1.0,1.0,0.4);
var reflectionOffset : float = 0.35;
var reflectPlaneObject : GameObject;

var colorSurfHigh : Color = Color(0.25,0.5,1.0,0.75);
var colorSurfLow : Color = Color(0,0,0,0);
var colorHeight : float = 6.0;
var colorHeightSpread : float = 2.5;
var surfaceSmooth : float = 1.0;

//color variables
var depthColor : Color;
var depthColorR : Color;
var depthColorG : Color;
var depthColorB : Color;

var specColorH : Color;
var specColorL : Color;
var specScatterWidth : float;
var specScatterAmt : float;

//tessellation settings
var waveTessAmt : float = 8;
var waveTessMin : float = 0.0;
var waveTessSpread : float = 0.2;
var waveFac : float = 1.0;

//flowmap
var inheritColor : boolean = true;
var wave_speed : Vector2 = Vector2(0.0015,0.0015);
var shore_speed : Vector2 = Vector2(0.0015,0.0015);
var foam_speed : Vector2 = Vector2(-0.02,-0.02);

//tide
var tideColor : Color;
var tideAmount : float;
var tideSpread : float;

private var useDepthColor : Color; 

var castshadowIsOn : boolean = true;
var castshadowStrength : float;
var castshadowFade : float;
var castshadowColor : Color = Color(0,0,0,1);

//splash & collision variables
var splashIsOn : boolean = true;
var UpdateSpeed : float = 0.5;
var rippleSensitivity : float = 0.0;
var splashSensitivity :float = 0.2;
var isinwater : boolean = false;
public var isUnderwater : boolean = false;
var atDepth : float = 0.0;
private var setvolume = 0.65;
private var ringsTime = 0.0;

var objectRingsTime : float[];
var objectRingsTimes = new Array();

var CurrentColliders : Collider[];
var CurrCollPoss : Vector3[];
var CurrCollPos = new Array();
var CurrentCollider = new Array();
private var moduleSplashObject : SuimonoModule;
private var thisSuimonoObject : GameObject;
private var suimonoScaleObject : GameObject;
private var suimonoShadowObject : GameObject;

private var shoreAmt : float = 0.85;
private var shoreAmtDk : float = 1.0;
private var shoreTideTimer : float = 0.0;

var _suimono_uvx : float;
var _suimono_uvy : float;
var setWavScale : float;
var setDetScale : float;
var setDtScale : float;
var useWaveHt : float;
var useDetHt : float;
var useDpWvHt : float;
var useDtHt : float;

//wave texture animation variables
var flowSpeed : float = 0.1;
var setflowSpeed : float = 0.1;
var setshoreflowSpeed : float = 0.1;
var waveSpeed : float = 0.1;
var foamSpeed : float = 0.1;
var shoreSpeed : float = 0.1;
var flow_dir : Vector2 = Vector2(0.0015,0.0015);
var flow_dir_degrees : float = 0.0;

var shore_dir : Vector2 = Vector2(0.0015,0.0015);
var shore_dir_degrees : float = 0.0;

var wave_dir : Vector2 = Vector2(0.0015,0.0015);
var foam_dir : Vector2 = Vector2(-0.02,-0.02);
var water_dir : Vector2 = Vector2(0.0,0.0);
private var animationSpeed : float = 1.0;
private var timex : float = 0.0;
private var timey : float = 0.0;

private var shaderSurface : Shader;
private var shaderSurfaceScale : Shader;
private var shaderUnderwater : Shader;
private var shaderUnderwaterFX : Shader;

//flowmap
private var m_animationSpeed : float = 1.0;
private var systemSpeed : float = 1.0;
private var m_fFlowMapOffset0 : float = 0.0f;
private var m_fFlowMapOffset1 : float = 0.0f;
private var m_fFlowSpeed : float = 0.05f;
private var m_fCycle : float = 1.0f;
private var m_fWaveMapScale : float = 2.0f;

//infinite ocean
private var saveScale : Vector2 = Vector2(10.0,10.0);
private var oceanTimer : float = 1.0;
private var oceanHasStarted : boolean = false;

private var currentWaterLevel : float = 0.0;
private var currentSurfaceLevel : float = 0.0;

private var tempMaterial : Material;
private var tempMaterialScale : Material;
private var tempMaterialShadow : Material;

private var setPos : Vector3 = Vector3(0,0,0);
private var setSpace : Vector2 = Vector2(0.0,0.0);
private var setSpace2 : Vector2 = Vector2(0.0,0.0);
private var setSpace3 : Vector2 = Vector2(0.0,0.0);
private var setSpace4 : Vector2 = Vector2(0.0,0.0);
private var uvMult : float = 1.0;
private var uvMult2 : float = 1.0;
private var uvMult3 : float = 1.0;
private var uvMult4 : float = 1.0;		

private var currVersionIndex : int = 50;
private var shaderIsSet : boolean = false;



private var thisrendererComponent : Renderer;
private var scalerendererComponent : Renderer;
private var reflectrendererComponent : Renderer;
private var shadowrendererComponent : Renderer;



function Start () {

	//DISCONNECT FROM PREFAB
	#if UNITY_EDITOR
		PrefabUtility.DisconnectPrefabInstance(this.gameObject);
	#endif

	//SET DIRECTORIES
	#if UNITY_EDITOR
		baseDir = "SUIMONO - WATER SYSTEM 2/RESOURCES/";
		presetFile  = "_PRESETS.txt";
	#else
		baseDir = "/Resources/";
		presetFile  = "_PRESETS.txt";
	#endif
	
	//REFERENCE OBJECTS
	if (GameObject.Find("SUIMONO_Module") != null) suimonoModuleObject = GameObject.Find("SUIMONO_Module").gameObject;
	
	thisSuimonoObject = this.transform.Find("Suimono_Object").gameObject;
	suimonoScaleObject = this.transform.Find("Suimono_ObjectScale").gameObject;
	//suimonoShadowObject = this.transform.Find("Suimono_ObjectShadow").gameObject;
	reflectionObject = this.transform.Find("Suimono_reflectionObject").gameObject;
	shorelineObject = this.transform.Find("Suimono_shorelineObject").gameObject;
	shorelineComponent = shorelineObject.GetComponent(Suimono_flowGenerator) as Suimono_flowGenerator;
	
	//INIT RENDER TEXTURE FOR REFLECTION
	renderTex = new RenderTexture(512,512,16,RenderTextureFormat.ARGB32);

	//SPLASH & COLLISION SETUP
	objectRingsTime = objectRingsTimes.ToBuiltin(float) as float[];
	if (suimonoModuleObject != null){
		moduleSplashObject = suimonoModuleObject.GetComponent(SuimonoModule);
		suimonoModuleLibrary = suimonoModuleObject.GetComponent(SuimonoModuleLib);
	} else {
		Debug.Log("SUIMONO: Warning... SUIMONO_Module game object cannot be found!");
	}
	
	CurrentColliders = CurrentCollider.ToBuiltin(Collider) as Collider[];
	CurrCollPoss = CurrCollPos.ToBuiltin(Vector3) as Vector3[];
	//Save Original Scale
	saveScale.x = this.transform.localScale.x;

	//setup custom material
	if (thisSuimonoObject != null) tempMaterial = new Material(thisSuimonoObject.GetComponent(Renderer).sharedMaterial);
	thisSuimonoObject.GetComponent(Renderer).sharedMaterial = tempMaterial;
	if (suimonoScaleObject != null) tempMaterialScale = new Material(suimonoScaleObject.GetComponent(Renderer).sharedMaterial);
	suimonoScaleObject.GetComponent(Renderer).sharedMaterial = tempMaterialScale;
	//if (suimonoShadowObject != null) tempMaterialShadow = new Material(suimonoShadowObject.GetComponent(Renderer).sharedMaterial);
	//suimonoShadowObject.GetComponent(Renderer).sharedMaterial = tempMaterialShadow;	

	//store component references
	if (thisSuimonoObject != null) thisrendererComponent = thisSuimonoObject.GetComponent(Renderer);
	if (suimonoScaleObject != null) scalerendererComponent = suimonoScaleObject.GetComponent(Renderer);
	if (reflectionObject != null) reflectrendererComponent = reflectionObject.GetComponent(Renderer);
	//if (suimonoShadowObject != null) shadowrendererComponent = suimonoShadowObject.GetComponent(Renderer);

	cameraIsSet = true;
	if (moduleSplashObject.setCamera != null){
		if (moduleSplashObject.setCamera.GetComponent(Camera) != null) cameraIsSet = false;
	}

	PresetLoad();
	InvokeRepeating("StoreSurfaceHeight",0.1,0.1);
	Invoke("MarkAsStarted",0.5);
	presetStartTransition = false;

	//reset collider hax
	thisSuimonoObject.GetComponent(MeshCollider).enabled = false;
	thisSuimonoObject.GetComponent(MeshCollider).enabled = true;
	
	//shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro");
	//suimonoScaleObject.GetComponent(Renderer).sharedMaterial.shader = shaderSurfaceScale;
	
}









function LateUpdate(){
	
	//store component references
	thisrendererComponent = thisSuimonoObject.GetComponent(Renderer);
	scalerendererComponent = suimonoScaleObject.GetComponent(Renderer);
	reflectrendererComponent = reflectionObject.GetComponent(Renderer);
	//shadowrendererComponent = suimonoShadowObject.GetComponent(Renderer);

	#if UNITY_EDITOR
	if (!Application.isPlaying){
		//get module and library objects
		suimonoModuleObject = GameObject.Find("SUIMONO_Module").gameObject;
		//moduleSplashObject = suimonoModuleObject.GetComponent(SuimonoModule);
		suimonoModuleLibrary = suimonoModuleObject.GetComponent(SuimonoModuleLib);
		thisSuimonoObject = this.transform.Find("Suimono_Object").gameObject;
		suimonoScaleObject = this.transform.Find("Suimono_ObjectScale").gameObject;
		//suimonoShadowObject = this.transform.Find("Suimono_ObjectShadow").gameObject;

		thisrendererComponent = thisSuimonoObject.GetComponent(Renderer);
		scalerendererComponent = suimonoScaleObject.GetComponent(Renderer);
		//reflectrendererComponent = reflectionObject.GetComponent(Renderer);
		//shadowrendererComponent = suimonoShadowObject.GetComponent(Renderer);

		//set default material explicitly
		if (suimonoModuleLibrary.materialSurface != null){
			thisrendererComponent.sharedMaterial = suimonoModuleLibrary.materialSurface;
			scalerendererComponent.sharedMaterial = suimonoModuleLibrary.materialSurfaceScale;
			//shadowrendererComponent.sharedMaterial = suimonoModuleLibrary.materialSurfaceShadow;
		}
	}
	#endif
	
	
	//get objects while in editor mode
	#if UNITY_EDITOR
	if (!Application.isPlaying){	
		if (moduleSplashObject == null){	
		if (GameObject.Find("SUIMONO_Module")){
			moduleSplashObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule) as SuimonoModule;
		}
		}
	}
	#endif
	
	//set UI color
	if (moduleSplashObject != null){
		useDarkUI = moduleSplashObject.useDarkUI;
	}


	if (moduleSplashObject.unityVersionIndex != currVersionIndex){
		shaderIsSet = false;
	}
	
	
	
	//SET SHADER DEFAULTS
	//if (!shaderIsSet){
	
		//avoids incompatible shader assignments in various unity/target versions
		#if UNITY_EDITOR
			//UNITY BASIC VERSION SPECIFIC
			if (moduleSplashObject.unityVersionIndex == 0){//unity basic version
				shaderSurface = Shader.Find("Suimono2/water_basic");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_basic");
				shaderUnderwater = Shader.Find("Suimono2/water_under_basic");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
			
			//UNITY BASIC DX11 VERSION SPECIFIC
			if (moduleSplashObject.unityVersionIndex == 1){//unity basic version
				shaderSurface = Shader.Find("Suimono2/water_basic_dx11");
				shaderSurfaceScale = Shader.Find("Suimono2/water_basic_dx11");
				shaderUnderwater = Shader.Find("Suimono2/water_under_basic_dx11");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}	
					
			//UNITY iOS VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 4){//iOS
				shaderSurface = Shader.Find("Suimono2/water_ios");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_ios");
				shaderUnderwater = Shader.Find("Suimono2/water_under_ios");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
			
			//UNITY ANDROID VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 5){//android
				shaderSurface = Shader.Find("Suimono2/water_android");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_android");
				shaderUnderwater = Shader.Find("Suimono2/water_under_android");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
				
			//UNITY PRO DX11 VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 3){//dx11
				shaderSurface = Shader.Find("Suimono2/water_pro_dx11");
				shaderSurfaceScale = Shader.Find("Suimono2/water_pro_dx11");
				shaderUnderwater = Shader.Find("Suimono2/water_under_pro_dx11");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_dx11");
			}
	
			//UNITY PRO VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 2){//pro
				shaderSurface = Shader.Find("Suimono2/water_pro");
				//if(!moduleSplashObject.enableRefraction) shaderSurface = Shader.Find("Suimono2/water_pro_norefract");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro");
				//if(!moduleSplashObject.enableRefraction) shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro_norefract");
				shaderUnderwater = Shader.Find("Suimono2/water_under_pro");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane");
				//if(!moduleSplashObject.enableRefraction) shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_norefract");
				//if (moduleSplashObject.setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
				//	shaderUnderwater = Shader.Find("Suimono2/water_under_pro_fwd");
				//}
			}
		
			suimonoModuleLibrary.shader1 = shaderSurface;
			suimonoModuleLibrary.shader2 = shaderUnderwater;
			suimonoModuleLibrary.shader3 = shaderUnderwaterFX;
			suimonoModuleLibrary.shader4 = shaderSurfaceScale;
		#else
			shaderSurface = suimonoModuleLibrary.shader1;
			shaderUnderwater = suimonoModuleLibrary.shader2;
			shaderUnderwaterFX = suimonoModuleLibrary.shader3;
			shaderSurfaceScale = suimonoModuleLibrary.shader4;
		#endif


	//}

		//#######  SET SHADERS  #######
		if (Application.isPlaying){
		if (moduleSplashObject != null){
			if (currentWaterLevel >= 0.0){
				thisrendererComponent.sharedMaterial.shader = shaderUnderwater;
			} else {
				thisrendererComponent.sharedMaterial.shader = shaderSurface;
			}
		}
		} else {
			thisSuimonoObject.GetComponent(Renderer).sharedMaterial.shader = shaderSurface;
		}

		//if (Application.isPlaying){
			//currVersionIndex = moduleSplashObject.unityVersionIndex;
			//shaderIsSet = true;
		//}
		
	if (!shaderIsSet){
	if (Application.isPlaying){	
		scalerendererComponent.sharedMaterial.shader = shaderSurfaceScale;
		currVersionIndex = moduleSplashObject.unityVersionIndex;
		shaderIsSet = true;
	}
	}


				



	//UPDATE PRESETS
	//get the current preset data.
	#if UNITY_EDITOR
		//if (presetFileIndex != presetFileUseIndex) PresetSetFile();
		PresetSetFile();
		PresetGetData();
		//if (presetIndex != presetUseIndex) PresetLoad();
		if (presetToggleSave) PresetSave("");
		if (presetStartTransition) PresetDoTransition();
		if (!presetStartTransition) presetTransitionCurrent = 0.0;
	#else
		if (moduleSplashObject.includePresetsInBuild){
			PresetGetData();
			//if (presetIndex != presetUseIndex) PresetLoad();
			if (presetToggleSave) PresetSave("");
			if (presetStartTransition) PresetDoTransition();
			if (!presetStartTransition) presetTransitionCurrent = 0.0;
		}
	#endif
	
	//CONVERT DEGREES to FLOW DIRECTION
	//convert 0-360 degree setting to useable Vector2 data.
	//used for the normal and foam flow/uv scrolling.
	if (moduleSplashObject != null){
		flow_dir = moduleSplashObject.SuimonoConvertAngleToDegrees(flow_dir_degrees);
		shore_dir = moduleSplashObject.SuimonoConvertAngleToDegrees(270.0);
	}

	
	//####### RESET WAVE SETTINGS ON FLAT SURFACE ##########
	if (typeIndex == 2){
		waveFac = 1.0;
	} else {
		waveFac = 1.0;
	}
	

	//#######  MANAGE LOCAL REFLECTION TEXTURE  #######
	var renderTex : boolean = true;



	//######## HANDLE FORWARD RENDERING SWITCH #######
	if (cameraIsSet){
	//if (moduleSplashObject.setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
	//	Shader.SetGlobalFloat("_isForward",1.0);
	//} else {
	//	Shader.SetGlobalFloat("_isForward",0.0);
	//}
	}
	
	//######## HANDLE HDR RENDERING SWITCH #######
	var isHDR : float = 0.0;
	if (cameraIsSet){
	//if (moduleSplashObject.setCamera.GetComponent(Camera).hdr){
		//if (moduleSplashObject.setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
		//	isHDR =1.0;
		//}
	//}
	}
	Shader.SetGlobalFloat("_isHDR",isHDR);
		
	//######## HANDLE MAC RENDERING SWITCH #######
	var isMac : float = 0.0;
	#if UNITY_STANDALONE_OSX
		isMac = 1.0;
	#endif
	Shader.SetGlobalFloat("_isMac",isMac);
	
	
	//######## HANDLE LINEAR RENDERING SWITCH #######
	var isLin : float = 0.0;
	if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		isLin = 1.0;
	}
	Shader.SetGlobalFloat("_SuimonoIsLinear",isLin);
	
	
	//set blursamples
	if (moduleSplashObject != null){
		blurSamples = moduleSplashObject.blurSamples;
		thisrendererComponent.sharedMaterial.SetFloat("_blurSamples", floatRound(blurSamples));
	}
	
	//FLOW MAP HANDLING
	m_animationSpeed = 1.0;
	m_animationSpeed = Mathf.Clamp(m_animationSpeed,0.0,1.0);
	
	//set speed limits
	setflowSpeed = Mathf.Lerp(0.0,0.3,flowSpeed);
	wave_speed.x = -flow_dir.x*(setflowSpeed);
	wave_speed.y = -flow_dir.y*(setflowSpeed);
	
	setshoreflowSpeed = Mathf.Lerp(0.0,2.0,shoreSpeed);
	shore_speed.x = -shore_dir.x*(setshoreflowSpeed);
	shore_speed.y = -shore_dir.y*(setshoreflowSpeed);

	//assign speed to shader
	thisrendererComponent.sharedMaterial.SetTextureOffset("_WaveTex",Vector2((wave_speed.x*Time.time*m_animationSpeed)%1,(wave_speed.y*Time.time*m_animationSpeed)%1));
	thisrendererComponent.sharedMaterial.SetTextureOffset("_WaveTex",Vector2((wave_speed.x*Time.time*m_animationSpeed),(wave_speed.y*Time.time*m_animationSpeed)));
	
	setflowOffX = thisrendererComponent.sharedMaterial.GetTextureOffset("_Surface2").x;
	setflowOffY = thisrendererComponent.sharedMaterial.GetTextureOffset("_Surface2").y;
	
	thisrendererComponent.sharedMaterial.SetFloat("flowOffX",floatRound(setflowOffX));
	thisrendererComponent.sharedMaterial.SetFloat("flowOffY",floatRound(setflowOffY));
	
	shoreOffX = floatRound(thisrendererComponent.sharedMaterial.GetTextureOffset("_FlowMap").x);
	shoreOffY = floatRound(thisrendererComponent.sharedMaterial.GetTextureOffset("_FlowMap").y);
	thisrendererComponent.sharedMaterial.SetFloat("shoreOffX",shoreOffX);
	thisrendererComponent.sharedMaterial.SetFloat("shoreOffY",shoreOffY);

	thisrendererComponent.sharedMaterial.SetFloat("shoreWaveOffX",floatRound(thisrendererComponent.sharedMaterial.GetTextureOffset("_WaveTex").x));
	thisrendererComponent.sharedMaterial.SetFloat("shoreWaveOffY",floatRound(thisrendererComponent.sharedMaterial.GetTextureOffset("_WaveTex").y));



	//FILL MAIN TEXTURES BY DEFAULT
	//fills default texture slots from the Module object
	if (enableCustomTextures == false){
		if (suimonoModuleLibrary){
			if (suimonoModuleLibrary.texDisplace) thisrendererComponent.sharedMaterial.SetTexture("_WaveLargeTex",suimonoModuleLibrary.texDisplace);
			if (suimonoModuleLibrary.texHeight1) thisrendererComponent.sharedMaterial.SetTexture("_Surface1",suimonoModuleLibrary.texHeight1);
			if (suimonoModuleLibrary.texHeight2) thisrendererComponent.sharedMaterial.SetTexture("_Surface2",suimonoModuleLibrary.texHeight2);
			if (suimonoModuleLibrary.texFoam) thisrendererComponent.sharedMaterial.SetTexture("_FoamTex",suimonoModuleLibrary.texFoam);
			if (suimonoModuleLibrary.texRampWave) thisrendererComponent.sharedMaterial.SetTexture("_WaveRamp",suimonoModuleLibrary.texRampWave);
			if (suimonoModuleLibrary.texRampDepth) thisrendererComponent.sharedMaterial.SetTexture("_DepthRamp",suimonoModuleLibrary.texRampDepth);
			if (suimonoModuleLibrary.texRampBlur) thisrendererComponent.sharedMaterial.SetTexture("_BlurRamp",suimonoModuleLibrary.texRampBlur);
			if (suimonoModuleLibrary.texRampFoam) thisrendererComponent.sharedMaterial.SetTexture("_FoamRamp",suimonoModuleLibrary.texRampFoam);
			if (suimonoModuleLibrary.texCube1) thisrendererComponent.sharedMaterial.SetTexture("_CubeTex",suimonoModuleLibrary.texCube1);
			if (suimonoModuleLibrary.texWave) thisrendererComponent.sharedMaterial.SetTexture("_WaveTex",suimonoModuleLibrary.texWave);
		}
	}
	

	// SET WAVE SCALE
	if (hasStarted){
		//setWavScale = (this.transform.localScale.x/(10.0-waveScale));
		//setDetScale = (this.transform.localScale.x/(20.0-detailScale));
		setWavScale = waveScale * this.transform.localScale.x;
		//var setWavScaleY : float = waveScale * this.transform.localScale.y;
		setDetScale = detailScale * this.transform.localScale.x * 10.0;
		//var setDetScaleY = detailScale * this.transform.localScale.y * 10.0;
		
		setShoreWaveScale = thisrendererComponent.sharedMaterial.GetTextureScale("_WaveTex").x;
		
		//setWavScale = setDetScale;
		//thisrendererComponent.sharedMaterial.SetTextureScale("_Surface1",Vector2(setWavScale,setWavScaleY));
		thisrendererComponent.sharedMaterial.SetFloat("waveScale",floatRound(setWavScale));
		thisrendererComponent.sharedMaterial.SetTextureScale("_Surface1",Vector2(setWavScale,setWavScale));
		thisrendererComponent.sharedMaterial.SetTextureScale("_WaveLargeTex",Vector2(setDetScale,setDetScale));
		thisrendererComponent.sharedMaterial.SetTextureScale("_Surface2",Vector2(setDetScale,setDetScale));
		thisrendererComponent.sharedMaterial.SetFloat("detailScale",floatRound(setDetScale));
		thisrendererComponent.sharedMaterial.SetFloat("normalShore",floatRound(normalShore));
		
		thisrendererComponent.sharedMaterial.SetFloat("shoreWaveScale",floatRound(setShoreWaveScale));
		
		//set shore wave breaks
		thisrendererComponent.sharedMaterial.SetTextureScale("_WaveTex",Vector2(floatRound(waveBreakAmt),0.0));
	}

	//SET SHADER TIME and SCALE
    thisrendererComponent.sharedMaterial.SetFloat("_Phase", Time.time );
    thisrendererComponent.sharedMaterial.SetFloat("_dScaleX", floatRound(thisrendererComponent.sharedMaterial.GetTextureScale("_Surface1").x));
	thisrendererComponent.sharedMaterial.SetFloat("_dScaleY", floatRound(thisrendererComponent.sharedMaterial.GetTextureScale("_Surface1").y));
	

	//TESSELLATION SETTINGS
	var setTessScale : float = waveTessAmt;
	var autoTScale : float = this.transform.localScale.x;
	if (autoTScale > 10.0) autoTScale = 10.0;
	if (autoTess) setTessScale *= autoTScale;//this.transform.localScale.x;
	thisrendererComponent.sharedMaterial.SetFloat("_Tess", floatRound(setTessScale));
	var setTessStart : float = Mathf.Lerp(-180.0,0.0,waveTessMin);
	thisrendererComponent.sharedMaterial.SetFloat("_minDist", floatRound(setTessStart));
	var setTessSpread : float = Mathf.Lerp(20.0,500.0,waveTessSpread);
	thisrendererComponent.sharedMaterial.SetFloat("_maxDist", floatRound(setTessSpread));
	thisrendererComponent.sharedMaterial.SetFloat("_Displacement", 1.0);
	

	//EDITOR MODE TWEAKS
	//certain calculations rely on depth buffer generation which the scene camera
	//won't calculate while in editor mode. The below temporarily addresses these
	//issues so the water surface doesn't look whack in editor mode.  this shouldn't
	//effect the in-game modes at all.
	useFoamColor = foamColor;
	useDepthColor = depthColor;
	useEdgeColor = edgeColor;

	if (!Application.isPlaying){
		useFoamColor.a = 0.0;
		//useDepthColor.a = 0.35;
		useEdgeColor.a = 0.0;
	}
	

	//SPLASH AND COLLISION EFFECTS
	//advance fx timer
	ringsTime += Time.deltaTime;
	if (CurrentColliders.length > 0){
		for (var cx = 0; cx < CurrentColliders.length; cx++){
			objectRingsTime[cx] += Time.deltaTime;
		}
	}

	
	
	//Read the collision function
	if (splashIsOn){
		//CallCollisionFunction();
	}
	

	if (moduleSplashObject.unityVersionIndex == 0 || moduleSplashObject.unityVersionIndex == 1) renderTex = false;
	if (moduleSplashObject.unityVersionIndex == 4 || moduleSplashObject.unityVersionIndex == 5) renderTex = false;	

	if (!moduleSplashObject.enableDynamicReflections || !enableDynamicReflections){
		renderTex = false;
	}
	if (!renderTex){
	if (Application.isPlaying){
		#if !UNITY_3_5
			if (reflectionObject != null) reflectionObject.SetActive(false);
	   	#else
			if (reflectionObject != null) reflectionObject.active = false;
	  	#endif
	}

	} else {
	
		if (reflectionObject != null && renderTex){
			//enable reflection based on distance
			var reflDist : float;
			if (moduleSplashObject.setCamera) reflDist = Vector3.Distance(transform.localPosition,moduleSplashObject.setCamera.localPosition);
			if (reflectionObject != null){
			if (Application.isPlaying){
			#if !UNITY_3_5
				//unity 4+ compilation
				if (reflDist <= (60.0*transform.localScale.x)) reflectionObject.SetActive(true);
				if (reflDist > (60.0*transform.localScale.x)) reflectionObject.SetActive(false);
	    	#else
	    		//unity 3.5 compilation
				if (reflDist <= (60.0*transform.localScale.x)) reflectionObject.active = true;
				if (reflDist > (60.0*transform.localScale.x)) reflectionObject.active = false;
	   		#endif
			}
			}
							
			//check for underwater
			isUnderwater = false;
			if (currentWaterLevel >= 0.0){
				//swap reflection coordinates underwater
				if (reflectionObject != null) reflectionObject.transform.eulerAngles = Vector3(0.0,0.0,180.0);
			} else {
				if (reflectionObject != null) reflectionObject.transform.eulerAngles = Vector3(0.0,0.0,0.0);
			}
		
		if (Application.isPlaying){	
			var getTex = reflectrendererComponent.sharedMaterial.GetTexture("_ReflectionTex");
			thisrendererComponent.sharedMaterial.SetTexture("_ReflectionTex",getTex);
		}
		}
	}
	
	
	


	
	
	
	
	if (shorelineObject != null){
	if (Application.isPlaying){
			#if !UNITY_3_5
				//unity 4+ compilation
				if (reflDist <= (60.0*transform.localScale.x)) shorelineObject.SetActive(true);
				if (reflDist > (60.0*transform.localScale.x)) shorelineObject.SetActive(false);
	    	#else
	    		//unity 3.5 compilation
				if (reflDist <= (60.0*transform.localScale.x)) shorelineObject.active = true;
				if (reflDist > (60.0*transform.localScale.x)) shorelineObject.active = false;
	   		#endif
	}
	}
	


	// ########## ASSIGN GENERAL ATTRIBUTES ############
	var useRefract : float = 1.0;
	if (!moduleSplashObject.enableRefraction) useRefract = 0.0;
	var refractScl : float = Mathf.Lerp(0.0,(2.25),refractScale);
	
	
	thisrendererComponent.sharedMaterial.SetFloat("_RefrScale",floatRound(refractScl));
	var useScale : float = (this.transform.localScale.x * refractScl);
	thisrendererComponent.sharedMaterial.SetFloat("_MasterScale",floatRound(useScale));
	thisrendererComponent.sharedMaterial.SetFloat("_WaveAmt",floatRound(useScale));
	thisrendererComponent.sharedMaterial.SetFloat("_NormalAmt",floatRound(useScale*10.0));
	
	//Calculate Shore & Wave FX
	var shoreWaveStretch : float = 4.5;
	var shoreWaveStretch2 : float = 0.0;
	shoreAmt = ((1.0-shoreWaveStretch)+Mathf.Sin(Time.time*0.75)*shoreWaveStretch);
	tideAmount = ((0.3)+Mathf.Sin(Time.time*0.45)*0.2);
	thisrendererComponent.sharedMaterial.SetFloat("_ShoreAmt",floatRound(shoreAmt));
	thisrendererComponent.sharedMaterial.SetFloat("_TideAmount",floatRound(tideAmount));
	
	//Calculate Waves
	//if (Application.isPlaying){
		useWaveHt = Mathf.Lerp(0.0001,10.0,(waveHeight/10.0)*waveFac);
		thisrendererComponent.sharedMaterial.SetFloat("_WaveHeight",floatRound(useWaveHt));
		useDetHt = Mathf.Lerp(0.0001,3.0,(detailHeight/3.0)*waveFac);
		thisrendererComponent.sharedMaterial.SetFloat("_DetailHeight",floatRound(useDetHt));
		
		usewaveShoreHt = Mathf.Lerp(0.0001,1.5,(waveShoreHeight*waveFac)/20.0);
		thisrendererComponent.sharedMaterial.SetFloat("_WaveShoreHeight",floatRound(usewaveShoreHt));
	//} else {
	//	thisrendererComponent.sharedMaterial.SetFloat("_WaveHeight",0.01);
	//	thisrendererComponent.sharedMaterial.SetFloat("_DetailHeight",0.01);
	//	thisrendererComponent.sharedMaterial.SetFloat("_WaveShoreHeight",0.01);	
	//}

	setFlowShoreScale = Mathf.Lerp(0.1,4,waveShoreScale);
	thisrendererComponent.sharedMaterial.SetFloat("_FlowShoreScale",floatRound(setFlowShoreScale));

	thisrendererComponent.sharedMaterial.SetFloat("_TimeX",thisrendererComponent.sharedMaterial.GetTextureOffset("_Surface1").x);
	thisrendererComponent.sharedMaterial.SetFloat("_TimeY",thisrendererComponent.sharedMaterial.GetTextureOffset("_Surface1").y);

	thisrendererComponent.sharedMaterial.SetFloat("_DTimeX",thisrendererComponent.sharedMaterial.GetTextureOffset("_WaveLargeTex").x);
	thisrendererComponent.sharedMaterial.SetFloat("_DTimeY",thisrendererComponent.sharedMaterial.GetTextureOffset("_WaveLargeTex").y);
	
	timex += Time.deltaTime * waveSpeed;
	timey += Time.deltaTime * waveSpeed;
	
	//Calculate Overall Brightness
	thisrendererComponent.sharedMaterial.SetFloat("_OverallBright",floatRound(overallBright));
	
	//Calculate Overall Transparency
	thisrendererComponent.sharedMaterial.SetFloat("_OverallTrans",floatRound(overallTransparency));
	
	//Calculate Light Absorption
	var absorbAmt : float = Mathf.Lerp(0.0,50.0,lightAbsorb);
	thisrendererComponent.sharedMaterial.SetFloat("_DepthAmt",floatRound(absorbAmt));
	
	//set shadow amount
	var shadowAmt : float = Mathf.Lerp(0.0,1.0,shadowAmount);
	thisrendererComponent.sharedMaterial.SetFloat("_ShadowAmt",floatRound(shadowAmt));
	
	//Calculate Refraction
	var setSCL :float = transform.localScale.x;
	var refractAmt : float = Mathf.Lerp(0.0,(500.0/setSCL),Mathf.Lerp(0.0,0.1,lightRefract));
	
	refractAmt *= (this.transform.localScale.x/10.0);
	
	thisrendererComponent.sharedMaterial.SetFloat("_RefrStrength",floatRound(refractAmt)*useRefract);
	var refractShft : float = Mathf.Lerp(0.0,0.2,refractShift);
	thisrendererComponent.sharedMaterial.SetFloat("_RefrShift",floatRound(refractShft)*useRefract);

	
	//Calculate Reflections
	if (thisrendererComponent.sharedMaterial.GetTexture("_ReflectionTex") == null){
		thisrendererComponent.sharedMaterial.SetFloat("useReflection",0.0);
	} else {
		thisrendererComponent.sharedMaterial.SetFloat("useReflection",1.0);
	}
	
	var reflectDistAmt : float = Mathf.Lerp(-200,200, reflectDist);
	var reflectSpreadAmt : float = Mathf.Lerp(0.015,0.001,reflectSpread);
	thisrendererComponent.sharedMaterial.SetFloat("_ReflDist",floatRound(reflectDistAmt));
	thisrendererComponent.sharedMaterial.SetFloat("_ReflBlend",floatRound(reflectSpreadAmt));
	thisrendererComponent.sharedMaterial.SetColor("_DynReflColor",LinearTransfer(colorDynReflect));
	var reflectAmt : float = Mathf.Lerp(0.0,100.0,reflectionOffset);
	thisrendererComponent.sharedMaterial.SetFloat("_ReflectStrength",floatRound(reflectAmt));
	
	//Calculate Underwater Reflections
	var reflectUnderDist : float = Mathf.Lerp(-30,0,reflectDistUnderAmt);
	reflectUnderDist = Mathf.Lerp(-10.0,0.0,reflectDistUnderAmt);
	thisrendererComponent.sharedMaterial.SetFloat("_UnderReflDist",floatRound(reflectUnderDist));

	//Calculate Blur
	var blurSprd : float = Mathf.Lerp(0.0,1.0,blurSpread);
	thisrendererComponent.sharedMaterial.SetFloat("_BlurSpread",floatRound(blurSprd)*useRefract);
	
	//surface smoothness
	var surfaceSmoothAmt : float = Mathf.Lerp(0.0,0.45,surfaceSmooth);
	thisrendererComponent.sharedMaterial.SetFloat("_BumpStrength",floatRound(surfaceSmoothAmt));
	
	//colors
	thisrendererComponent.sharedMaterial.SetColor("_HighColor",LinearTransfer(colorSurfHigh));
	thisrendererComponent.sharedMaterial.SetColor("_LowColor",LinearTransfer(colorSurfLow));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColor",LinearTransfer(useDepthColor));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorR",LinearTransfer(depthColorR));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorG",LinearTransfer(depthColorG));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorB",LinearTransfer(depthColorB));
	thisrendererComponent.sharedMaterial.SetColor("_UnderColor",LinearTransfer(underwaterColor));
	
	var useUnderFogDist : float = Mathf.Lerp(-0.1,0.2,underwaterFogDist);
	thisrendererComponent.sharedMaterial.SetFloat("_UnderFogDist",floatRound(useUnderFogDist));
	
	//specular
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorH",LinearTransfer(specColorH));
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorL",LinearTransfer(specColorL));
	var _SpecHotAmt : float = Mathf.Lerp(0.1,10.0,specScatterWidth);
	thisrendererComponent.sharedMaterial.SetFloat("_SpecScatterWidth",floatRound(_SpecHotAmt));
	var _SpecAmt : float = Mathf.Lerp(0.5,10.0,specScatterAmt);
	thisrendererComponent.sharedMaterial.SetFloat("_SpecScatterAmt",floatRound(_SpecAmt));
	
	//tide
	thisrendererComponent.sharedMaterial.SetColor("_TideColor",LinearTransfer(tideColor));
	thisrendererComponent.sharedMaterial.SetFloat("_TideAmount",floatRound(tideAmount));
	thisrendererComponent.sharedMaterial.SetFloat("_TideSpread",floatRound(tideSpread));

	
	// SET FOAM SCALING

	thisrendererComponent.sharedMaterial.SetFloat("suimonoHeight",this.transform.position.y);
	
	var setFoamScale : float = Mathf.Lerp(0.0001,10.0,foamScale);
	var useFoamScale : float = this.transform.localScale.x*setFoamScale;
	thisrendererComponent.sharedMaterial.SetTextureScale("_FoamTex",Vector2(useFoamScale,useFoamScale));
	thisrendererComponent.sharedMaterial.SetTextureScale("_FoamOverlay",Vector2(useFoamScale,useFoamScale));
	thisrendererComponent.sharedMaterial.SetFloat("_ShallowFoamAmt",shallowFoamAmt);
	
	var foamSpread : float = (foamAmt) + (Mathf.Sin(Time.time*1.0)*(0.05 * (1.0+foamAmt)));
	
	var useFoamHt : float = Mathf.Lerp(0.0,1.0,hFoamHeight);
	//if (QualitySettings.activeColorSpace == ColorSpace.Linear) useFoamHt = hFoamHeight*0.5;
	thisrendererComponent.sharedMaterial.SetFloat("_FoamHeight", floatRound(useFoamHt));
	
	var useHFoam : float = Mathf.Lerp(0.0,5.0,hFoamAmt);
	thisrendererComponent.sharedMaterial.SetFloat("_HeightFoamAmount", floatRound(useHFoam));
	var useHFoamSpd : float = Mathf.Lerp(0.0,15.0,hFoamSpread);
	thisrendererComponent.sharedMaterial.SetFloat("_HeightFoamSpread", floatRound(useHFoamSpd));
	
	var setFoamSpread : float = Mathf.Lerp(0.02,1.0,foamSpread);
	thisrendererComponent.sharedMaterial.SetFloat("_FoamSpread",floatRound(setFoamSpread));
	thisrendererComponent.sharedMaterial.SetColor("_FoamColor",LinearTransfer(useFoamColor));
	
	var setEdgeSpread : float = Mathf.Lerp(0.02,1.0*transform.localScale.x,edgeSpread);
	var setEdgeBlend : float = Mathf.Lerp(0.02,1.0*transform.localScale.x,edgeBlend);
	//if (edgeBlend == 0.01) setEdgeBlend = 2.0;
	thisrendererComponent.sharedMaterial.SetFloat("_EdgeBlend",floatRound(setEdgeBlend));
	thisrendererComponent.sharedMaterial.SetFloat("_EdgeSpread",floatRound(setEdgeSpread));
	thisrendererComponent.sharedMaterial.SetColor("_EdgeColor",LinearTransfer(useEdgeColor));

	//set uv reversal
	var useUVR = 0.0;
	if (moduleSplashObject.useUVReversal) useUVR = 1.0;
	//thisrendererComponent.sharedMaterial.SetFloat("_UVReversal",useUVR);
	Shader.SetGlobalFloat("_UVReversal",useUVR);
	
	//WAVE TEXTURE ANIMATION
	animationSpeed = 1.0;
	
	//set speed limits
	flow_dir.x = Mathf.Clamp(flow_dir.x,-1.0,1.0);
	flow_dir.y = Mathf.Clamp(flow_dir.y,-1.0,1.0);
	
	shore_dir.x = Mathf.Clamp(shore_dir.x,-1.0,1.0);
	shore_dir.y = Mathf.Clamp(shore_dir.y,-1.0,1.0);
	
	wave_dir.x = flow_dir.x;
	wave_dir.y = flow_dir.y;

	foam_dir.x = flow_dir.x;
	foam_dir.y = flow_dir.y;
	
	uvMult = floatRound(setDetScale) * 0.1;
	uvMult2 = floatRound(setWavScale) * 0.1;
	uvMult3 = useFoamScale * 0.1;
	uvMult4 = 0.1;	

}











function FixedUpdate(){

	//####### MANAGE INFINITE SIZING #######
	//if (Application.isPlaying && hasStarted){
	if (Application.isPlaying){
		if (typeIndex == 0){
		
			var upStep : float = 20.0;
			var spacer : float = ((this.transform.localScale.x * 4.0)/upStep);
			var spacerUV :float = (1.0/upStep);

			//test
			upStep = 2.0;
			spacer = ((this.transform.localScale.x * 4.0)/upStep);
			spacerUV = (1.0/upStep);
			
			//set scale and intial position
			if (!oceanHasStarted){
			oceanHasStarted = true;
			var setScale : float = 1.0;
			
			if (moduleSplashObject.unityVersionIndex == 3 || moduleSplashObject.unityVersionIndex == 1){
				//scale for dx11
				setScale = moduleSplashObject.setCamera.GetComponent(Camera).farClipPlane/ 10.0;
				this.transform.localScale = Vector3(setScale,1.0,setScale);
			//} else if (moduleSplashObject.unityVersionIndex == 2){
			} else {
				//scale for dx9
				setScale = moduleSplashObject.setCamera.GetComponent(Camera).farClipPlane/ 1.0;
				this.transform.localScale = Vector3(overallScale,1.0,overallScale);
				suimonoScaleObject.transform.localScale = Vector3(overallScale,1.0,overallScale);
				//scalerendererComponent.material.CopyPropertiesFromMaterial(thisrendererComponent.sharedMaterial);
				//scalerendererComponent.sharedMaterial.SetFloat("_infScale",5.0);
			}
			
			this.transform.position = Vector3(moduleSplashObject.setTrack.position.x,this.transform.position.y,moduleSplashObject.setTrack.position.z);
			}
			
			
			var useSc : float;
			var setSc : Vector2;
			var setDpth : float;
			
			//set properties from master material in dx9
			if (moduleSplashObject.unityVersionIndex != 3 && moduleSplashObject.unityVersionIndex != 1){
				scalerendererComponent.enabled = true;
				suimonoScaleObject.transform.localScale = Vector3(overallScale,1.0,overallScale);
				scalerendererComponent.material.CopyPropertiesFromMaterial(thisrendererComponent.sharedMaterial);
				useSc = overallScale;
				setSc = scalerendererComponent.sharedMaterial.GetTextureScale("_WaveLargeTex");
				scalerendererComponent.sharedMaterial.SetTextureScale("_WaveLargeTex", setSc*useSc);
				setSc = scalerendererComponent.sharedMaterial.GetTextureScale("_Surface1");
				scalerendererComponent.sharedMaterial.SetTextureScale("_Surface1", setSc*useSc);
				setSc = scalerendererComponent.sharedMaterial.GetTextureScale("_Surface2");
				scalerendererComponent.sharedMaterial.SetTextureScale("_Surface2", setSc*useSc);
				setDpth = thisrendererComponent.sharedMaterial.GetFloat("_DepthAmt");
				scalerendererComponent.sharedMaterial.SetFloat("_DepthAmt", setDpth*useSc);
			}

			
			//set position
			var newPos : Vector3 = Vector3(moduleSplashObject.setTrack.position.x,this.transform.position.y,moduleSplashObject.setTrack.position.z);
			if (Mathf.Abs(this.transform.position.x - newPos.x) > spacer){
				var fudgex : float = (this.transform.position.x - newPos.x)/spacer;
				setSpace.x += (spacerUV*fudgex)*uvMult;
				setSpace2.x += (spacerUV*fudgex)*uvMult2;
				setSpace3.x += (spacerUV*fudgex)*uvMult3;
				setSpace4.x += (spacerUV*fudgex)*uvMult4;
				this.transform.position.x = newPos.x;
			}
			if (Mathf.Abs(this.transform.position.z - newPos.z) > spacer){
				var fudgey : float = (this.transform.position.z - newPos.z)/spacer;
				setSpace.y += (spacerUV*fudgey)*uvMult;
				setSpace2.y += (spacerUV*fudgey)*uvMult2;
				setSpace3.y += (spacerUV*fudgey)*uvMult3;
				setSpace4.y += (spacerUV*fudgey)*uvMult4;
				this.transform.position.z = newPos.z;
			}	
		} else {
			scalerendererComponent.enabled = false;
		}
	}

	//assign speed to shader
	thisrendererComponent.sharedMaterial.SetTextureOffset("_FoamTex",Vector2((foam_dir.x*Time.time*animationSpeed * foamSpeed)+setSpace3.x,(foam_dir.y*Time.time*animationSpeed * foamSpeed)+setSpace3.y));
	thisrendererComponent.sharedMaterial.SetTextureOffset("_FoamOverlay",Vector2((-foam_dir.x*Time.time*animationSpeed * foamSpeed *0.5)+setSpace3.x,(-foam_dir.y*Time.time*animationSpeed * foamSpeed *0.5)+setSpace3.y));
	//thisrendererComponent.sharedMaterial.SetTextureOffset("_Surface1",Vector2((flow_dir.x*Time.time*animationSpeed*setflowSpeed*0.2)+setSpace2.x,(flow_dir.y*Time.time*animationSpeed * setflowSpeed *0.2)+setSpace2.y));
	thisrendererComponent.sharedMaterial.SetTextureOffset("_Surface2",Vector2((shore_dir.x*Time.time*-animationSpeed*setshoreflowSpeed*0.5*(setflowSpeed*5.0))+setSpace.x,(shore_dir.y*Time.time*animationSpeed*-setshoreflowSpeed*(setflowSpeed*5.0))+setSpace.y));
	
	//thisrendererComponent.sharedMaterial.SetTextureOffset("_WaveLargeTex",Vector2((flow_dir.x*Time.time*animationSpeed*setflowSpeed)+setSpace.x,(flow_dir.y*Time.time*animationSpeed * setflowSpeed) +setSpace.y));
	thisrendererComponent.sharedMaterial.SetTextureOffset("_WaveLargeTex",Vector2((flow_dir.x)+setSpace.x,(flow_dir.y)+setSpace.y));
	
	thisrendererComponent.sharedMaterial.SetTextureOffset("_FlowMap",Vector2(setSpace4.x,setSpace4.y));
	
	//set flow uvs
	_suimono_uvx = (flow_dir.x*Time.time*animationSpeed*setflowSpeed)+setSpace.x;
	_suimono_uvy = (flow_dir.y*Time.time*animationSpeed * setflowSpeed)+setSpace.y;
	//Shader.SetGlobalFloat("_suimono_uvx",_suimono_uvx);
	//Shader.SetGlobalFloat("_suimono_uvy",_suimono_uvy);
	thisrendererComponent.sharedMaterial.SetFloat("_suimono_uvx",_suimono_uvx);
	thisrendererComponent.sharedMaterial.SetFloat("_suimono_uvy",_suimono_uvy);
	
	//set deep wave height
	useDpWvHt = Mathf.Lerp(0.0001,15.0,(waveHeight/10.0)*waveFac);
	//if (QualitySettings.activeColorSpace == ColorSpace.Gamma) useDpWvHt *= (1.0/2.2);
	
	//Shader.SetGlobalFloat("_suimono_DeepWaveHeight",floatRound(useDpWvHt));
	thisrendererComponent.sharedMaterial.SetFloat("_suimono_DeepWaveHeight",floatRound(useDpWvHt));
	
	//set detail wave height
	useDtHt = Mathf.Lerp(0.0001,3.0,(detailHeight/3.0)*waveFac);
	//if (QualitySettings.activeColorSpace == ColorSpace.Gamma) useDtHt *= (1.0/2.2);
	//Shader.SetGlobalFloat("_suimono_DetailHeight",floatRound(useDtHt));
	thisrendererComponent.sharedMaterial.SetFloat("_suimono_DetailHeight",floatRound(useDtHt));	
	
	//set detail
	setDtScale = (this.transform.localScale.x/(20.0-detailScale));
	setDtScale = detailScale * this.transform.localScale.x * 10.0;
	//Shader.SetGlobalFloat("_suimono_detScale",floatRound(setDtScale));
	thisrendererComponent.sharedMaterial.SetFloat("_suimono_detScale",floatRound(setDtScale));	
	
	
	//set dynamic reflection tag on shader
	var setDynRef : float = 0.0;
	if (moduleSplashObject.enableDynamicReflections && enableDynamicReflections) setDynRef = 1.0;
	thisrendererComponent.sharedMaterial.SetFloat("_useDynamicReflections",setDynRef);	

	//set properties for Cast Shadow Material
	/*
	var setcastShade : float = 0.0;
	if (castshadowIsOn){
		setcastShade = 1.0;
		shadowrendererComponent.enabled = true;
		tempMaterialShadow.SetFloat("suimonoHeight",this.transform.position.y);
		//Shader.SetGlobalFloat("_suimono_DeepWaveHeight",floatRound(useDpWvHt));
		//Shader.SetGlobalFloat("_suimono_DetailHeight",floatRound(useDtHt));
		shadowrendererComponent.sharedMaterial.CopyPropertiesFromMaterial(thisrendererComponent.sharedMaterial);
	} else {
		shadowrendererComponent.enabled = false;
	}
	var usecastFade : float = Mathf.Lerp(0.0,100.0,castshadowFade);
	tempMaterial.SetFloat("_castshadowEnabled",setcastShade);
	tempMaterial.SetFloat("_castshadowStrength",floatRound(castshadowStrength));
	tempMaterial.SetFloat("_castshadowFade",floatRound(usecastFade));
	tempMaterial.SetColor("_castshadowColor",LinearTransfer(castshadowColor));
	//Shader.SetGlobalFloat("_castshadowEnabled",setcastShade);
	//Shader.SetGlobalFloat("_castshadowStrength",floatRound(castshadowStrength));
	//Shader.SetGlobalColor("_castshadowColor",LinearTransfer(castshadowColor));
	*/
}











// ###################################################################
// ##### START CUSTOM FUNCTIONS ######################################
// ###################################################################
function MarkAsStarted(){
	hasStarted = true;
}



function LinearTransfer( useColor : Color) : Color{
	var outColor : Color = useColor;
    if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		//outColor.r = Mathf.GammaToLinearSpace(useColor.r)*2.2;
		//outColor.g = Mathf.GammaToLinearSpace(useColor.g)*2.2;
		//outColor.b = Mathf.GammaToLinearSpace(useColor.b)*2.2;
		//outColor.a = Mathf.GammaToLinearSpace(useColor.a);
		//outColor.r = Mathf.Pow(useColor.r,2.2);
		//outColor.g = Mathf.Pow(useColor.g,2.2);
		//outColor.b = Mathf.Pow(useColor.b,2.2);
		//outColor.a = Mathf.Pow(useColor.a,2.2);
		
	}
	return outColor;
}

function LinearVal( useValue : float) : float{
	var outValue : float = useValue;
    //if (QualitySettings.activeColorSpace == ColorSpace.Linear){
	//	outValue = Mathf.GammaToLinearSpace(useValue);
	//}
	return outValue;
}


function StoreSurfaceHeight(){
	currentWaterLevel = moduleSplashObject.currentObjectDepth;
	currentSurfaceLevel = moduleSplashObject.currentSurfaceLevel;
}


// ########## SPLASH / COLLISION FUNCTIONS ##########
function CallCollisionFunction(){

	for (var cx : int = 0; cx < CurrentColliders.length; cx++){
		var ckSpeed = UpdateSpeed;
		if (CurrentColliders[cx] == null){
			CurrentCollider.RemoveAt(cx);
			CurrCollPos.RemoveAt(cx);
			CurrentColliders = CurrentCollider.ToBuiltin(Collider) as Collider[];
			CurrCollPoss = CurrCollPos.ToBuiltin(Vector3) as Vector3[];
			
		} else {
		
			//get optional parameters
			var alwaysEmit : boolean = false;
			var addSize : float = 0.2;
			var addRot : float = Random.Range(0.0,359.0);
			var addVel : Vector3 = Vector3(0.0,0.0,0.0);
			
			var hitVeloc = Vector3(1.0,1.0,1.0);
			
			if (CurrentColliders[cx].gameObject.GetComponent(Rigidbody)){
				hitVeloc = CurrentColliders[cx].gameObject.GetComponent(Rigidbody).velocity;
			}
			
			//calculate rotation
			if (Mathf.Abs(hitVeloc.x) >= rippleSensitivity || Mathf.Abs(hitVeloc.z) >= rippleSensitivity){
				var tempPointer : GameObject;
				var tempDetector : GameObject;
				tempPointer = new GameObject ("tempPointer");
				tempDetector = new GameObject ("tempDetector");
				
				tempPointer.transform.position = CurrentColliders[cx].transform.position + (hitVeloc*10.0);
				tempDetector.transform.position = CurrentColliders[cx].transform.position;
				tempDetector.transform.LookAt(tempPointer.transform.position);
				addRot = tempDetector.transform.eulerAngles.y+40.0;	
				gameObject.Destroy(tempPointer);
				gameObject.Destroy(tempDetector);
			}
				
			
			var CollSplashFX_component : fx_splashEffects = CurrentColliders[cx].gameObject.GetComponent(fx_splashEffects);
			if (CollSplashFX_component != null){
				ckSpeed = CollSplashFX_component.setSplashRingsTimer;
				addSize = CollSplashFX_component.splashRingsSize;
				if (CollSplashFX_component.splashRingsRotation != 0.0){
					addRot = CollSplashFX_component.splashRingsRotation;
				}
				if (CollSplashFX_component.alwaysEmitRipples || moduleSplashObject.alwaysEmitRipples){
					alwaysEmit = true;
				}
			}

			
			if (objectRingsTime[cx] > ckSpeed){
				objectRingsTime[cx] = 0.0;
				var checkColl : Collider = CurrentColliders[cx];
				var collsetpos : Vector3 = checkColl.transform.position;
				
				//calculate Y-Height
				collsetpos.y = moduleSplashObject.SuimonoGetHeight(collsetpos,"surfaceLevel");
				var sizeScale : float = 0.12;
				
				//check for movement and init splash effects
				if (sizeScale > 0.0 && CurrCollPoss[cx].ToString("F4") != collsetpos.ToString("F4")){
					sizeScale = Mathf.Clamp(sizeScale,0.1,0.3) * 2.0;
					//moduleSplashObject.AddEffect("rings",collsetpos,1,addSize*sizeScale,addRot,addVel);
					//moduleSplashObject.AddEffect("ringfoam",collsetpos,1,addSize*sizeScale,addRot,addVel);
					if ((addSize*sizeScale*10.0) >= 0.45){
						//moduleSplashObject.AddEffect("splash",collsetpos,4,addSize*sizeScale*10.0,addRot,addVel);
					}
					if ((addSize*sizeScale*10.0) >= 0.5){
						//moduleSplashObject.AddEffect("splashDrop",collsetpos,40,addSize*0.25,0.0,addVel);
					}
					//add sound
					var soundVol : float = 0.35;
					if ((addSize*sizeScale*10.0) >= 0.45){
						soundVol = 0.7;
					}
					if ((addSize*sizeScale*10.0) >= 0.5){
						soundVol = 1.0;
					}
					moduleSplashObject.AddSound("splash",collsetpos,Vector3(0,0,soundVol));
				}
			}
		}
	}
}









function OnApplicationQuit(){

	#if UNITY_EDITOR
	thisrendererComponent.sharedMaterial.shader = shaderSurface;
	#endif
	
	if (reflectionObject != null){
		#if !UNITY_3_5
			//unity 4+ compilation
			reflectionObject.SetActive(true);
		#else
			//unity 3.5 compilation
			reflectionObject.active = true;
		#endif
	}
}








// ########## PUBLIC FUNCTIONS ##########
function SetPreset( useIndex : int){
	if (useIndex < presetDataArray.Length){
		presetIndex = useIndex;
	}
}

function SetPresetTransition( frmIndex : int, toIndex : int, setDuration : float){
	if (frmIndex < presetDataArray.Length && toIndex < presetDataArray.Length){
		presetTransIndexFrm = frmIndex;
		presetTransIndexTo = toIndex;
		presetTransitionTime = setDuration;
		presetStartTransition = true;
	}
}

function SetLerpTransition( frmIndex : int, toIndex : int, setLerp : float){
	if (frmIndex < presetDataArray.Length && toIndex < presetDataArray.Length){
		presetTransIndexFrm = frmIndex;
		presetTransIndexTo = toIndex;
		presetTransitionTime = setLerp;
		PresetDoTransition();
	}
}








// ########## PRESET FUNCTIONS ##########

function PresetSetFile(){
	var showDebug : boolean = false;
	if (presetFileUseIndex != presetFileIndex){
		//presetUseIndex = 0;
		showDebug = true;
		presetFileUseIndex = presetFileIndex;
		//presetUseIndex = -1;
		presetIndex += 1;
		PresetLoad();
	}
	
	
	var presetFilesArr = new Array();
	var dir : String = Application.dataPath + "/" + baseDir;
	var info = new DirectoryInfo(dir);
	if (info != null){
		var fileInfo : FileInfo[] = info.GetFiles("SUIMONO_PRESET_*.txt");
		for (var f : int = 0; f < fileInfo.Length; f++){
			presetFilesArr.Add(fileInfo[f].ToString());
		}
		
		if (presetFiles.length != presetFilesArr.length) presetFiles = new String[presetFilesArr.length];
		for (var n : int = 0; n < presetFilesArr.length; n++){
			if (presetFiles[n] != null){
				presetFiles[n] = presetFilesArr[n].ToString();
				presetFiles[n] = presetFiles[n].Remove(0,dir.length);
				presetFiles[n] = presetFiles[n].Replace("SUIMONO_PRESET_","");
				presetFiles[n] = presetFiles[n].Replace(".txt","");
			}
		}
	}
	presetFile = "SUIMONO_PRESET_"+presetFiles[presetFileUseIndex]+".txt";
	if (showDebug) Debug.Log("Using Preset File: "+presetFile);
}




function PresetLoad(){

	presetUseIndex = presetIndex;
	
	if (presetIndex < 0){
		presetUseIndex += 1;
	} else {
	//presetIndex += 1;
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetUseIndex) break;
	}
	presetUseIndex += 1;
	//presetIndex = presetUseIndex;
	 
	//set data
	var pName : String = workData.Substring(0,20);

	//set colors
	var sK : int = 21;
	depthColor = Color(float.Parse(workData.Substring((sK*1)+1,4)),float.Parse(workData.Substring((sK*1)+6,4)),float.Parse(workData.Substring((sK*1)+11,4)),float.Parse(workData.Substring((sK*1)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColor",depthColor);
	colorSurfHigh = Color(float.Parse(workData.Substring((sK*2)+1,4)),float.Parse(workData.Substring((sK*2)+6,4)),float.Parse(workData.Substring((sK*2)+11,4)),float.Parse(workData.Substring((sK*2)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_HighColor",colorSurfHigh);
	colorSurfLow = Color(float.Parse(workData.Substring((sK*3)+1,4)),float.Parse(workData.Substring((sK*3)+6,4)),float.Parse(workData.Substring((sK*3)+11,4)),float.Parse(workData.Substring((sK*3)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_LowColor",colorSurfLow);
	depthColorR = Color(float.Parse(workData.Substring((sK*4)+1,4)),float.Parse(workData.Substring((sK*4)+6,4)),float.Parse(workData.Substring((sK*4)+11,4)),float.Parse(workData.Substring((sK*4)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorR",depthColorR);
	depthColorG = Color(float.Parse(workData.Substring((sK*5)+1,4)),float.Parse(workData.Substring((sK*5)+6,4)),float.Parse(workData.Substring((sK*5)+11,4)),float.Parse(workData.Substring((sK*5)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorG",depthColorG);
	depthColorB = Color(float.Parse(workData.Substring((sK*6)+1,4)),float.Parse(workData.Substring((sK*6)+6,4)),float.Parse(workData.Substring((sK*6)+11,4)),float.Parse(workData.Substring((sK*6)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorB",depthColorB);		
	specColorH = Color(float.Parse(workData.Substring((sK*7)+1,4)),float.Parse(workData.Substring((sK*7)+6,4)),float.Parse(workData.Substring((sK*7)+11,4)),float.Parse(workData.Substring((sK*7)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorH",specColorH);
	specColorL = Color(float.Parse(workData.Substring((sK*8)+1,4)),float.Parse(workData.Substring((sK*8)+6,4)),float.Parse(workData.Substring((sK*8)+11,4)),float.Parse(workData.Substring((sK*8)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorL",specColorL);
	colorDynReflect = Color(float.Parse(workData.Substring((sK*9)+1,4)),float.Parse(workData.Substring((sK*9)+6,4)),float.Parse(workData.Substring((sK*9)+11,4)),float.Parse(workData.Substring((sK*9)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DynReflColor",colorDynReflect);
	foamColor = Color(float.Parse(workData.Substring((sK*10)+1,4)),float.Parse(workData.Substring((sK*10)+6,4)),float.Parse(workData.Substring((sK*10)+11,4)),float.Parse(workData.Substring((sK*10)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_FoamColor",useFoamColor);
	edgeColor = Color(float.Parse(workData.Substring((sK*11)+1,4)),float.Parse(workData.Substring((sK*11)+6,4)),float.Parse(workData.Substring((sK*11)+11,4)),float.Parse(workData.Substring((sK*11)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_EdgeColor",useEdgeColor);			
	underwaterColor = Color(float.Parse(workData.Substring((sK*12)+1,4)),float.Parse(workData.Substring((sK*12)+6,4)),float.Parse(workData.Substring((sK*12)+11,4)),float.Parse(workData.Substring((sK*12)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_UnderColor",underwaterColor);	
	tideColor = Color(float.Parse(workData.Substring((sK*13)+1,4)),float.Parse(workData.Substring((sK*13)+6,4)),float.Parse(workData.Substring((sK*13)+11,4)),float.Parse(workData.Substring((sK*13)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_TideColor",tideColor);	
	castshadowColor = Color(float.Parse(workData.Substring((sK*14)+1,4)),float.Parse(workData.Substring((sK*14)+6,4)),float.Parse(workData.Substring((sK*14)+11,4)),float.Parse(workData.Substring((sK*14)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_castshadowColor",castshadowColor);	
	
	//set attributes
	lightAbsorb = float.Parse(workData.Substring((sK*15)+(8*1)+1,6));
	lightRefract = float.Parse(workData.Substring((sK*15)+(8*2)+1,6));
	refractShift = float.Parse(workData.Substring((sK*15)+(8*3)+1,6));

	blurSpread = float.Parse(workData.Substring((sK*15)+(8*5)+1,6));
	surfaceSmooth = float.Parse(workData.Substring((sK*15)+(8*6)+1,6));
	reflectDist = float.Parse(workData.Substring((sK*15)+(8*7)+1,6));
	reflectSpread = float.Parse(workData.Substring((sK*15)+(8*8)+1,6));
	reflectionOffset = float.Parse(workData.Substring((sK*15)+(8*9)+1,6));
	edgeBlend = float.Parse(workData.Substring((sK*15)+(8*10)+1,6));
	normalShore = float.Parse(workData.Substring((sK*15)+(8*11)+1,6));
	specScatterAmt = float.Parse(workData.Substring((sK*15)+(8*12)+1,6));
	specScatterWidth = float.Parse(workData.Substring((sK*15)+(8*13)+1,6));
	hFoamHeight = float.Parse(workData.Substring((sK*15)+(8*14)+1,6));
	hFoamAmt = float.Parse(workData.Substring((sK*15)+(8*15)+1,6));
	hFoamSpread = float.Parse(workData.Substring((sK*15)+(8*16)+1,6));
	foamAmt = float.Parse(workData.Substring((sK*15)+(8*17)+1,6));
	foamScale = float.Parse(workData.Substring((sK*15)+(8*18)+1,6));
	edgeSpread = float.Parse(workData.Substring((sK*15)+(8*19)+1,6));
	detailHeight = float.Parse(workData.Substring((sK*15)+(8*20)+1,6));
	detailScale = float.Parse(workData.Substring((sK*15)+(8*21)+1,6));
	UpdateSpeed = float.Parse(workData.Substring((sK*15)+(8*22)+1,6));
	rippleSensitivity = float.Parse(workData.Substring((sK*15)+(8*23)+1,6));
	splashSensitivity = float.Parse(workData.Substring((sK*15)+(8*24)+1,6));
	reflectDistUnderAmt = float.Parse(workData.Substring((sK*15)+(8*25)+1,6));
	underRefractionAmount = float.Parse(workData.Substring((sK*15)+(8*26)+1,6));
	underBlurAmount = float.Parse(workData.Substring((sK*15)+(8*27)+1,6));
	etherealShift = float.Parse(workData.Substring((sK*15)+(8*28)+1,6));

	underwaterFogDist = float.Parse(workData.Substring((sK*15)+(8*29)+1,6));	
	underwaterFogSpread = float.Parse(workData.Substring((sK*15)+(8*30)+1,6));

	waveHeight = float.Parse(workData.Substring((sK*15)+(8*31)+1,6));
	waveShoreHeight = float.Parse(workData.Substring((sK*15)+(8*32)+1,6));
	waveScale = float.Parse(workData.Substring((sK*15)+(8*33)+1,6));		
											
	waveShoreScale = float.Parse(workData.Substring((sK*15)+(8*34)+1,6));	
	shoreSpeed = float.Parse(workData.Substring((sK*15)+(8*35)+1,6));	

    enableUnderDebrisWrite = float.Parse(workData.Substring((sK*15)+(8*36)+1,6));	
    enableUnderDebris = false;
    if (enableUnderDebrisWrite == 1.0) enableUnderDebris = true;
    
	tideAmount = float.Parse(workData.Substring((sK*15)+(8*37)+1,6));	
    tideSpread = float.Parse(workData.Substring((sK*15)+(8*38)+1,6));	

	underRefractionScale = float.Parse(workData.Substring((sK*15)+(8*39)+1,6));
	underRefractionSpeed = float.Parse(workData.Substring((sK*15)+(8*40)+1,6));

	waveBreakAmt = float.Parse(workData.Substring((sK*15)+(8*42)+1,6));
	shallowFoamAmt = float.Parse(workData.Substring((sK*15)+(8*43)+1,6));

	overallBright = float.Parse(workData.Substring((sK*15)+(8*44)+1,6));
	overallTransparency = float.Parse(workData.Substring((sK*15)+(8*45)+1,6));

	flow_dir_degrees = float.Parse(workData.Substring((sK*15)+(8*46)+1,6));
	flowSpeed = float.Parse(workData.Substring((sK*15)+(8*47)+1,6));

	foamSpeed = float.Parse(workData.Substring((sK*15)+(8*48)+1,6));
	
	shadowAmount = float.Parse(workData.Substring((sK*15)+(8*49)+1,6));
	
	//castshadowIsOn = float.Parse(workData.Substring((sK*15)+(8*50)+1,6));
	castshadowStrength = float.Parse(workData.Substring((sK*15)+(8*51)+1,6));
	castshadowFade = float.Parse(workData.Substring((sK*15)+(8*52)+1,6));

	
	
	}
}





function PresetGetColor( presetCheck : int, presetKey : String) : Color {
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetCheck) break;
	}
	
	var retCol : Color = Color(0,0,0,1);
	
	//set data
	var pName : String = workData.Substring(0,20);
	
	//set colors
	var sK : int = 21;
	
	if (presetKey == "_DepthColor") retCol = Color(float.Parse(workData.Substring(sK+1,4)),float.Parse(workData.Substring(sK+6,4)),float.Parse(workData.Substring(sK+11,4)),float.Parse(workData.Substring(sK+16,4)));
	if (presetKey == "_HighColor") retCol = Color(float.Parse(workData.Substring((sK*2)+1,4)),float.Parse(workData.Substring((sK*2)+6,4)),float.Parse(workData.Substring((sK*2)+11,4)),float.Parse(workData.Substring((sK*2)+16,4)));
	if (presetKey == "_LowColor") retCol = Color(float.Parse(workData.Substring((sK*3)+1,4)),float.Parse(workData.Substring((sK*3)+6,4)),float.Parse(workData.Substring((sK*3)+11,4)),float.Parse(workData.Substring((sK*3)+16,4)));
	if (presetKey == "_DepthColorR") retCol = Color(float.Parse(workData.Substring((sK*4)+1,4)),float.Parse(workData.Substring((sK*4)+6,4)),float.Parse(workData.Substring((sK*4)+11,4)),float.Parse(workData.Substring((sK*4)+16,4)));
	if (presetKey == "_DepthColorG") retCol = Color(float.Parse(workData.Substring((sK*5)+1,4)),float.Parse(workData.Substring((sK*5)+6,4)),float.Parse(workData.Substring((sK*5)+11,4)),float.Parse(workData.Substring((sK*5)+16,4)));
	if (presetKey == "_DepthColorB") retCol = Color(float.Parse(workData.Substring((sK*6)+1,4)),float.Parse(workData.Substring((sK*6)+6,4)),float.Parse(workData.Substring((sK*6)+11,4)),float.Parse(workData.Substring((sK*6)+16,4)));
	if (presetKey == "_SpecColorH") retCol = Color(float.Parse(workData.Substring((sK*7)+1,4)),float.Parse(workData.Substring((sK*7)+6,4)),float.Parse(workData.Substring((sK*7)+11,4)),float.Parse(workData.Substring((sK*7)+16,4)));
	if (presetKey == "_SpecColorL") retCol = Color(float.Parse(workData.Substring((sK*8)+1,4)),float.Parse(workData.Substring((sK*8)+6,4)),float.Parse(workData.Substring((sK*8)+11,4)),float.Parse(workData.Substring((sK*8)+16,4)));
	if (presetKey == "_DynReflColor") retCol = Color(float.Parse(workData.Substring((sK*9)+1,4)),float.Parse(workData.Substring((sK*9)+6,4)),float.Parse(workData.Substring((sK*9)+11,4)),float.Parse(workData.Substring((sK*9)+16,4)));
	if (presetKey == "_FoamColor") retCol = Color(float.Parse(workData.Substring((sK*10)+1,4)),float.Parse(workData.Substring((sK*10)+6,4)),float.Parse(workData.Substring((sK*10)+11,4)),float.Parse(workData.Substring((sK*10)+16,4)));
	if (presetKey == "_EdgeColor") retCol = Color(float.Parse(workData.Substring((sK*11)+1,4)),float.Parse(workData.Substring((sK*11)+6,4)),float.Parse(workData.Substring((sK*11)+11,4)),float.Parse(workData.Substring((sK*11)+16,4)));
	if (presetKey == "_UnderwaterColor") retCol = Color(float.Parse(workData.Substring((sK*12)+1,4)),float.Parse(workData.Substring((sK*12)+6,4)),float.Parse(workData.Substring((sK*12)+11,4)),float.Parse(workData.Substring((sK*12)+16,4)));
	if (presetKey == "_TideColor") retCol = Color(float.Parse(workData.Substring((sK*13)+1,4)),float.Parse(workData.Substring((sK*13)+6,4)),float.Parse(workData.Substring((sK*13)+11,4)),float.Parse(workData.Substring((sK*13)+16,4)));
	if (presetKey == "_CastShadowColor") retCol = Color(float.Parse(workData.Substring((sK*53)+1,4)),float.Parse(workData.Substring((sK*53)+6,4)),float.Parse(workData.Substring((sK*53)+11,4)),float.Parse(workData.Substring((sK*53)+16,4)));

	
	return retCol;
}




function PresetGetFloat( presetCheck : int, presetKey : String) : float {
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetCheck) break;
	}
	
	var retVal : float = 0.0;
	
	//set data
	var pName : String = workData.Substring(0,20);

	//set attributes
	var sK : int = 21;
	if (presetKey == "_MasterScale") retVal = float.Parse(workData.Substring((sK*15)+1,6));
	if (presetKey == "_LightAbsorb") retVal = float.Parse(workData.Substring((sK*15)+(8*1)+1,6));
	if (presetKey == "_LightRefract") retVal = float.Parse(workData.Substring((sK*15)+(8*2)+1,6));
	if (presetKey == "_RefractShift") retVal = float.Parse(workData.Substring((sK*15)+(8*3)+1,6));
	if (presetKey == "_BlurSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*5)+1,6));
	if (presetKey == "_SurfaceSmooth") retVal = float.Parse(workData.Substring((sK*15)+(8*6)+1,6));
	if (presetKey == "_ReflectDist") retVal = float.Parse(workData.Substring((sK*15)+(8*7)+1,6));
	if (presetKey == "_ReflectSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*8)+1,6));
	if (presetKey == "_ReflectionOffset") retVal = float.Parse(workData.Substring((sK*15)+(8*9)+1,6));
	if (presetKey == "_EdgeBlend") retVal = float.Parse(workData.Substring((sK*15)+(8*10)+1,6));
	if (presetKey == "_NormalShore") retVal = float.Parse(workData.Substring((sK*15)+(8*11)+1,6));
	if (presetKey == "_SpecScatterAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*12)+1,6));
	if (presetKey == "_SpecScatterWidth") retVal = float.Parse(workData.Substring((sK*15)+(8*13)+1,6));
	if (presetKey == "_HFoamHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*14)+1,6));
	if (presetKey == "_HFoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*15)+1,6));
	if (presetKey == "_HFoamSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*16)+1,6));
	if (presetKey == "_FoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*17)+1,6));
	if (presetKey == "_FoamScale") retVal = float.Parse(workData.Substring((sK*15)+(8*18)+1,6));
	if (presetKey == "_EdgeSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*19)+1,6));
	if (presetKey == "_DetailHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*20)+1,6));
	if (presetKey == "_DetailScale") retVal = float.Parse(workData.Substring((sK*15)+(8*21)+1,6));
	if (presetKey == "_UpdateSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*22)+1,6));
	if (presetKey == "_RippleSensitivity") retVal = float.Parse(workData.Substring((sK*15)+(8*23)+1,6));
	if (presetKey == "_SplashSensitivity") retVal = float.Parse(workData.Substring((sK*15)+(8*24)+1,6));
	if (presetKey == "_ReflectDistUnderAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*25)+1,6));
	if (presetKey == "_UnderRefractionAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*26)+1,6));
	if (presetKey == "_UnderBlurAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*27)+1,6));
	if (presetKey == "_EtherealShift") retVal = float.Parse(workData.Substring((sK*15)+(8*28)+1,6));
	
	if (presetKey == "_UnderwaterFogDist") retVal = float.Parse(workData.Substring((sK*15)+(8*29)+1,6));
	if (presetKey == "_UnderwaterFogSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*30)+1,6));

	if (presetKey == "_WaveHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*31)+1,6));
	if (presetKey == "_WaveShoreHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*32)+1,6));
	if (presetKey == "_WaveScale") retVal = float.Parse(workData.Substring((sK*15)+(8*33)+1,6));

	if (presetKey == "_WaveShoreScale") retVal = float.Parse(workData.Substring((sK*15)+(8*34)+1,6));
	if (presetKey == "_ShoreSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*35)+1,6));

    if (presetKey == "_EnableUnderDebris") retVal = float.Parse(workData.Substring((sK*15)+(8*36)+1,6));
    
	if (presetKey == "_TideAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*37)+1,6));
	if (presetKey == "_TideSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*38)+1,6));

	if (presetKey == "_UnderRefractionScale") retVal = float.Parse(workData.Substring((sK*15)+(8*39)+1,6));
	if (presetKey == "_UnderRefractionSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*40)+1,6));

	if (presetKey == "_TypeIndex") retVal = float.Parse(workData.Substring((sK*15)+(8*41)+1,6));

	if (presetKey == "_WaveBreakAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*42)+1,6));
	if (presetKey == "_ShallowFoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*43)+1,6));

	if (presetKey == "_OverallBright") retVal = float.Parse(workData.Substring((sK*15)+(8*44)+1,6));
	if (presetKey == "_OverallTransparency") retVal = float.Parse(workData.Substring((sK*15)+(8*45)+1,6));

	if (presetKey == "_Flow_dir_degrees") retVal = float.Parse(workData.Substring((sK*15)+(8*46)+1,6));
	if (presetKey == "_FlowSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*47)+1,6));

	if (presetKey == "_FoamSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*48)+1,6));

	if (presetKey == "_ShadowAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*49)+1,6));

	//if (presetKey == "_CastShadowIsOn") retVal = float.Parse(workData.Substring((sK*15)+(8*50)+1,6));
	if (presetKey == "_CastShadowStrength") retVal = float.Parse(workData.Substring((sK*15)+(8*51)+1,6));
	if (presetKey == "_CastShadowFade") retVal = float.Parse(workData.Substring((sK*15)+(8*52)+1,6));


	
	return retVal;
}


	
	

function PresetSave( useName : String ){
	var pName : String;
	pName = useName;
	presetToggleSave = false;
	var workCol : Color;
	var pL : int = pName.Length;
	
	PresetGetData();
	
	//check name
	if (pName == "") pName = "my custom preset"+(presetDataArray.length+1);
	if (pL < 20) pName = pName.PadRight(20);
	if (pL > 20) pName = pName.Substring(0,20);

	//SET COLORS
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColor");
	var useDepthCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_HighColor");
	var useHighCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_LowColor");
	var useLowCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorR");
	var useDepthColR : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorG");
	var useDepthColG : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorB");
	var useDepthColB : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";	
	workCol = thisrendererComponent.sharedMaterial.GetColor("_SpecColorH");
	var useSpecColorH : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_SpecColorL");
	var useSpecColorL : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DynReflColor");
	var useDynRefCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_FoamColor");
	var useFoamCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_EdgeColor");
	var useEdgeCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = underwaterColor;
	var useUnderCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = tideColor;
	var useTideCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = castshadowColor;
	var usecastshadowColor : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";

	
		
			
					
	
	//SET ATTRIBUTES
	var useMScale : String = "("+overallScale.ToString("00.000")+")";
	var useAbsorb : String = "("+lightAbsorb.ToString("00.000")+")";
	var useRefractAmt : String = "("+lightRefract.ToString("00.000")+")";
	var userefractShift : String = "("+refractShift.ToString("00.000")+")";
	var useblurSpread : String = "("+blurSpread.ToString("00.000")+")";
	var usesurfaceSmooth : String = "("+surfaceSmooth.ToString("00.000")+")";
	var usereflectDist : String = "("+reflectDist.ToString("00.000")+")";
	var usereflectSpread : String = "("+reflectSpread.ToString("00.000")+")";
	var usereflectionOffset : String = "("+reflectionOffset.ToString("00.000")+")";
	var useedgeBlend : String = "("+edgeBlend.ToString("00.000")+")";
	var usenormalShore : String = "("+normalShore.ToString("00.000")+")";
	var usespecScatterAmt : String = "("+specScatterAmt.ToString("00.000")+")";
	var usespecScatterWidth : String = "("+specScatterWidth.ToString("00.000")+")";
	var usehFoamHeight : String = "("+hFoamHeight.ToString("00.000")+")";
	var usehFoamAmt : String = "("+hFoamAmt.ToString("00.000")+")";
	var usehFoamSpread : String = "("+hFoamSpread.ToString("00.000")+")";
	var usefoamAmt : String = "("+foamAmt.ToString("00.000")+")";
	var usefoamScale : String = "("+foamScale.ToString("00.000")+")";
	var useedge : String = "("+edgeSpread.ToString("00.000")+")";
	var usedetailHeight : String = "("+detailHeight.ToString("00.000")+")";
	var usedetailScale : String = "("+detailScale.ToString("00.000")+")";
	var useUpdateSpeed : String = "("+UpdateSpeed.ToString("00.000")+")";
	var userippleSensitivity : String = "("+rippleSensitivity.ToString("00.000")+")";
	var usesplashSensitivity : String = "("+splashSensitivity.ToString("00.000")+")";
	var usereflectDistUnderAmt : String = "("+reflectDistUnderAmt.ToString("00.000")+")";
	var useunderRefractionAmount : String = "("+underRefractionAmount.ToString("00.000")+")";
	var useunderBlurAmount : String = "("+underBlurAmount.ToString("00.000")+")";
	var useetherealShift : String = "("+etherealShift.ToString("00.000")+")";
	var useunderwaterFogDist : String = "("+underwaterFogDist.ToString("00.000")+")";
	var useunderwaterFogSpread : String = "("+underwaterFogSpread.ToString("00.000")+")";																																						

	var usewaveHeight : String = "("+waveHeight.ToString("00.000")+")";	
	var usewaveShoreHeight : String = "("+waveShoreHeight.ToString("00.000")+")";	
	var usewaveScale : String = "("+waveScale.ToString("00.000")+")";	

	var usewaveShoreScale : String = "("+waveShoreScale.ToString("00.000")+")";
	var useshoreSpeed : String = "("+shoreSpeed.ToString("00.000")+")";

	enableUnderDebrisWrite = 0.0;
    if (enableUnderDebris) enableUnderDebrisWrite = 1.0;
    var useenableUnderDebris : String = "("+enableUnderDebrisWrite.ToString("00.000")+")";
    
	var useTideAmount : String = "("+tideAmount.ToString("00.000")+")";
	var useTideSpread : String = "("+tideSpread.ToString("00.000")+")";

	var useUnderRefractionScale : String = "("+underRefractionScale.ToString("00.000")+")";
	var useUnderRefractionSpeed : String = "("+underRefractionSpeed.ToString("00.000")+")";

	var usetypeIndex : String = "("+typeIndex.ToString("00.000")+")";
	var useWaveBreakAmt : String = "("+waveBreakAmt.ToString("00.000")+")";
	var useshallowFoamAmt : String = "("+shallowFoamAmt.ToString("00.000")+")";

	var useoverallBright : String = "("+overallBright.ToString("00.000")+")";
	var useoverallTransparency : String = "("+overallTransparency.ToString("00.000")+")";

	var useflow_dir_degrees : String = "("+flow_dir_degrees.ToString("00.000")+")";
	var useflowSpeed : String = "("+flowSpeed.ToString("00.000")+")";

	var usefoamSpeed : String = "("+foamSpeed.ToString("00.000")+")";

	var useshadowAmount : String = "("+shadowAmount.ToString("00.000")+")";

	//var usecastshadowIsOn : String = "("+castshadowIsOn.ToString("00.000")+")";
	var usecastshadowStrength : String = "("+castshadowStrength.ToString("00.000")+")";
	var usecastshadowFade : String = "("+castshadowFade.ToString("00.000")+")";



	//SAVE DATA																																																																																																																									
	var saveData : String = pName+" "+useDepthCol+useHighCol+useLowCol+useDepthColR+useDepthColG+useDepthColB+useSpecColorH+useSpecColorL+useDynRefCol+useFoamCol+useEdgeCol+useUnderCol+useTideCol+usecastshadowColor;
	saveData += useMScale+useAbsorb+useRefractAmt+userefractShift+"(00.000)"+useblurSpread+usesurfaceSmooth+usereflectDist+usereflectSpread+usereflectionOffset;
	saveData += useedgeBlend+usenormalShore+usespecScatterAmt+usespecScatterWidth+usehFoamHeight+usehFoamAmt+usehFoamSpread+usefoamAmt+usefoamScale+useedge;
	saveData += usedetailHeight+usedetailScale+useUpdateSpeed+userippleSensitivity+usesplashSensitivity+usereflectDistUnderAmt+useunderRefractionAmount+useunderBlurAmount;
	saveData += useetherealShift+useunderwaterFogDist+useunderwaterFogSpread+usewaveHeight+usewaveShoreHeight+usewaveScale;
	saveData += usewaveShoreScale+useshoreSpeed+useenableUnderDebris+useTideAmount+useTideSpread+useUnderRefractionScale+useUnderRefractionSpeed;
	
	//add padding for future variables
	saveData += usetypeIndex + useWaveBreakAmt + useshallowFoamAmt + useoverallBright + useoverallTransparency + useflow_dir_degrees + useflowSpeed + usefoamSpeed;
	saveData += useshadowAmount + "(00.000)" + usecastshadowStrength + usecastshadowFade;
	saveData += "(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)";
	
	//check for already existing preset match and insert data
	var ckNme : boolean = false;
	var workData : String;
	var rName : String;
	var rL : int;
	for (var cx = 0; cx < (presetDataArray.length); cx++){
		workData = presetDataArray[cx];
		rName = workData.Substring(0,20);
		rL = rName.Length;
		if (rL < 20) rName = rName.PadRight(20);
		if (rL > 20) rName = rName.Substring(0,20);
		if (rName == pName){
			ckNme = true;
			presetDataArray[cx] = saveData;
			break;
		}
	}
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	for (var px = 0; px < (presetDataArray.length); px++){
		sw.Write(presetDataArray[px]);
		if (px != presetDataArray.length-1) sw.Write("\n");
	}
	if (ckNme == false){
		sw.Write("\n"+saveData);
	}
    sw.Close();
	Debug.Log("Preset '"+presetSaveName+"' has been saved!"); 
}









function PresetRename( oldName : String, newName : String ){
	var oName : String;
	oName = oldName;
	var nName : String;
	nName = newName;

	PresetGetData();
	
	//check name
	if (oName.Length < 20) oName = oName.PadRight(20);
	if (oName.Length > 20) oName = oName.Substring(0,20);
	if (nName.Length < 20) nName = nName.PadRight(20);
	if (nName.Length > 20) nName = nName.Substring(0,20);
	
	//check for already existing preset match and insert data
	var workData : String;
	var rName : String;
	for (var cx = 0; cx < (presetDataArray.length); cx++){
		workData = presetDataArray[cx];
		rName = workData.Substring(0,20);
		if (rName == oName){
			var repString : String = presetDataArray[cx];
			repString = nName + workData.Substring(20,(workData.length-20));
			presetDataArray[cx] = repString;
		}
	}
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	for (var px = 0; px < (presetDataArray.length); px++){
		sw.Write(presetDataArray[px]);
		if (px != presetDataArray.length-1) sw.Write("\n");
	}
    sw.Close();
	Debug.Log("Preset '"+oldName+"' has been renamed to "+newName+"!"); 
}











function PresetDelete( preName : String ){
	var oName : String;
	oName = preName;

	PresetGetData();
	
	//check name
	if (oName.Length < 20) oName = oName.PadRight(20);
	if (oName.Length > 20) oName = oName.Substring(0,20);
	var workData : String;
	var workData2 : String;
	var rName : String;
	var xName : String;
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	
	//remove line
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		rName = workData.Substring(0,20);
		if (rName != oName){
			sw.Write(presetDataArray[px]);

			if (px < presetDataArray.length-2) sw.Write("\n");
			if (px == presetDataArray.length-2){
				
				workData2 = presetDataArray[px+1];
				xName = workData2.Substring(0,20);
				
				if (xName != oName){
					sw.Write("\n");
				}
			}
		}
	}
    sw.Close();
    
    
    //reset list
    PresetGetData();

 
	Debug.Log("Preset '"+preName+"' has been deleted!"); 
}










function PresetDoTransition(){
	
	//waterStartState = currentState;
	presetTransitionCurrent += (Time.deltaTime/presetTransitionTime);
	
	//transition
	depthColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColor"),PresetGetColor(presetTransIndexTo,"_DepthColor"),presetTransitionCurrent);
	colorSurfHigh = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_HighColor"),PresetGetColor(presetTransIndexTo,"_HighColor"),presetTransitionCurrent);
	colorSurfLow = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_LowColor"),PresetGetColor(presetTransIndexTo,"_LowColor"),presetTransitionCurrent);
	depthColorR = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorR"),PresetGetColor(presetTransIndexTo,"_DepthColorR"),presetTransitionCurrent);
	depthColorG = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorG"),PresetGetColor(presetTransIndexTo,"_DepthColorG"),presetTransitionCurrent);
	depthColorB = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorB"),PresetGetColor(presetTransIndexTo,"_DepthColorB"),presetTransitionCurrent);
	specColorH = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_SpecColorH"),PresetGetColor(presetTransIndexTo,"_SpecColorH"),presetTransitionCurrent);
	specColorL = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_SpecColorL"),PresetGetColor(presetTransIndexTo,"_SpecColorL"),presetTransitionCurrent);
	colorDynReflect = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DynReflColor"),PresetGetColor(presetTransIndexTo,"_DynReflColor"),presetTransitionCurrent);
	foamColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_FoamColor"),PresetGetColor(presetTransIndexTo,"_FoamColor"),presetTransitionCurrent);
	edgeColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_EdgeColor"),PresetGetColor(presetTransIndexTo,"_EdgeColor"),presetTransitionCurrent);
	underwaterColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_UnderwaterColor"),PresetGetColor(presetTransIndexTo,"_UnderwaterColor"),presetTransitionCurrent);
	tideColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_TideColor"),PresetGetColor(presetTransIndexTo,"_TideColor"),presetTransitionCurrent);
	castshadowColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_CastShadowColor"),PresetGetColor(presetTransIndexTo,"_CastShadowColor"),presetTransitionCurrent);

	
	lightAbsorb = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_LightAbsorb"),PresetGetFloat(presetTransIndexTo,"_LightAbsorb"),presetTransitionCurrent);
	lightRefract = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_LightRefract"),PresetGetFloat(presetTransIndexTo,"_LightRefract"),presetTransitionCurrent);
	refractShift = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_RefractShift"),PresetGetFloat(presetTransIndexTo,"_RefractShift"),presetTransitionCurrent);
	blurSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_BlurSpread"),PresetGetFloat(presetTransIndexTo,"_BlurSpread"),presetTransitionCurrent);
	surfaceSmooth = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_SurfaceSmooth"),PresetGetFloat(presetTransIndexTo,"_SurfaceSmooth"),presetTransitionCurrent);
	reflectDist = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ReflectDist"),PresetGetFloat(presetTransIndexTo,"_ReflectDist"),presetTransitionCurrent);
	reflectSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ReflectSpread"),PresetGetFloat(presetTransIndexTo,"_ReflectSpread"),presetTransitionCurrent);
	reflectionOffset = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ReflectionOffset"),PresetGetFloat(presetTransIndexTo,"_ReflectionOffset"),presetTransitionCurrent);
	edgeBlend = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_EdgeBlend"),PresetGetFloat(presetTransIndexTo,"_EdgeBlend"),presetTransitionCurrent);
	normalShore = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_NormalShore"),PresetGetFloat(presetTransIndexTo,"_NormalShore"),presetTransitionCurrent);
	specScatterAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_SpecScatterAmt"),PresetGetFloat(presetTransIndexTo,"_SpecScatterAmt"),presetTransitionCurrent);
	specScatterWidth = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_SpecScatterWidth"),PresetGetFloat(presetTransIndexTo,"_SpecScatterWidth"),presetTransitionCurrent);
	hFoamHeight = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_HFoamHeight"),PresetGetFloat(presetTransIndexTo,"_HFoamHeight"),presetTransitionCurrent);
	hFoamAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_HFoamAmt"),PresetGetFloat(presetTransIndexTo,"_HFoamAmt"),presetTransitionCurrent);
	hFoamSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_HFoamSpread"),PresetGetFloat(presetTransIndexTo,"_HFoamSpread"),presetTransitionCurrent);
	foamAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_FoamAmt"),PresetGetFloat(presetTransIndexTo,"_FoamAmt"),presetTransitionCurrent);
	foamScale = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_FoamScale"),PresetGetFloat(presetTransIndexTo,"_FoamScale"),presetTransitionCurrent);
	edgeSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_EdgeSpread"),PresetGetFloat(presetTransIndexTo,"_EdgeSpread"),presetTransitionCurrent);
	detailHeight = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_DetailHeight"),PresetGetFloat(presetTransIndexTo,"_DetailHeight"),presetTransitionCurrent);
	UpdateSpeed = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UpdateSpeed"),PresetGetFloat(presetTransIndexTo,"_UpdateSpeed"),presetTransitionCurrent);
	rippleSensitivity = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_RippleSensitivity"),PresetGetFloat(presetTransIndexTo,"_RippleSensitivity"),presetTransitionCurrent);
	splashSensitivity = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_SplashSensitivity"),PresetGetFloat(presetTransIndexTo,"_SplashSensitivity"),presetTransitionCurrent);
	reflectDistUnderAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ReflectDistUnderAmt"),PresetGetFloat(presetTransIndexTo,"_ReflectDistUnderAmt"),presetTransitionCurrent);
	underRefractionAmount = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UnderRefractionAmount"),PresetGetFloat(presetTransIndexTo,"_UnderRefractionAmount"),presetTransitionCurrent);
	underBlurAmount = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UnderBlurAmount"),PresetGetFloat(presetTransIndexTo,"_UnderBlurAmount"),presetTransitionCurrent);
	etherealShift = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_EtherealShift"),PresetGetFloat(presetTransIndexTo,"_EtherealShift"),presetTransitionCurrent);
	underwaterFogDist = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UnderwaterFogDist"),PresetGetFloat(presetTransIndexTo,"_UnderwaterFogDist"),presetTransitionCurrent);
	underwaterFogSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UnderwaterFogSpread"),PresetGetFloat(presetTransIndexTo,"_UnderwaterFogSpread"),presetTransitionCurrent);

	waveHeight = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_WaveHeight"),PresetGetFloat(presetTransIndexTo,"_WaveHeight"),presetTransitionCurrent);
	waveShoreHeight = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_WaveShoreHeight"),PresetGetFloat(presetTransIndexTo,"_WaveShoreHeight"),presetTransitionCurrent);
	waveShoreScale = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_WaveShoreScale"),PresetGetFloat(presetTransIndexTo,"_WaveShoreScale"),presetTransitionCurrent);
	shoreSpeed = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ShoreSpeed"),PresetGetFloat(presetTransIndexTo,"_ShoreSpeed"),presetTransitionCurrent);

	tideAmount = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_TideAmount"),PresetGetFloat(presetTransIndexTo,"_TideAmount"),presetTransitionCurrent);
	tideSpread = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_TideSpread"),PresetGetFloat(presetTransIndexTo,"_TideSpread"),presetTransitionCurrent);
	underRefractionSpeed = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_UnderRefractionSpeed"),PresetGetFloat(presetTransIndexTo,"_UnderRefractionSpeed"),presetTransitionCurrent);
	
	waveBreakAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_WaveBreakAmt"),PresetGetFloat(presetTransIndexTo,"_WaveBreakAmt"),presetTransitionCurrent);
	shallowFoamAmt = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ShallowFoamAmt"),PresetGetFloat(presetTransIndexTo,"ShallowFoamAmt"),presetTransitionCurrent);
		

	overallBright = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_OverallBright"),PresetGetFloat(presetTransIndexTo,"_OverallBright"),presetTransitionCurrent);
	overallTransparency = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_OverallTransparency"),PresetGetFloat(presetTransIndexTo,"_OverallTransparency"),presetTransitionCurrent);
	
	flow_dir_degrees = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_Flow_dir_degrees"),PresetGetFloat(presetTransIndexTo,"_Flow_dir_degrees"),presetTransitionCurrent);
	flowSpeed = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_FlowSpeed"),PresetGetFloat(presetTransIndexTo,"_FlowSpeed"),presetTransitionCurrent);
	
	
	flowSpeed = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_FoamSpeed"),PresetGetFloat(presetTransIndexTo,"_FoamSpeed"),presetTransitionCurrent);
	shadowAmount = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_ShadowAmount"),PresetGetFloat(presetTransIndexTo,"_ShadowAmount"),presetTransitionCurrent);
		
	//castshadowIsOn = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_CastShadowIsOn"),PresetGetFloat(presetTransIndexTo,"_CastShadowIsOn"),presetTransitionCurrent);
	castshadowStrength = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_CastShadowStrength"),PresetGetFloat(presetTransIndexTo,"_CastShadowStrength"),presetTransitionCurrent);
	castshadowFade = Mathf.Lerp(PresetGetFloat(presetTransIndexFrm,"_CastShadowFade"),PresetGetFloat(presetTransIndexTo,"_CastShadowFade"),presetTransitionCurrent);
		


			
	//set final
	if (presetTransitionCurrent >= 1.0){
		//reset
		presetIndex = presetTransIndexTo;
		presetStartTransition = false;
		presetTransitionCurrent = 0.0;
	}	

}




function PresetGetData(){


	var fileName = baseDir+presetFile;
	var sr = new StreamReader(Application.dataPath + "/" + fileName);
    presetDataString = sr.ReadToEnd();
    sr.Close();

    presetDataArray = presetDataString.Split("\n"[0]);
	var workOptions = presetDataString.Split("\n"[0]);
	presetOptions = workOptions;
	
	for (var ax = 0; ax < (presetOptions.length); ax++){
		presetOptions[ax] = workOptions[ax].Substring(0,20);
		presetOptions[ax] = presetOptions[ax].Trim();
	}

}




function floatRound(inFloat : float){

	var retFloat : float = 0.0;
	retFloat = Mathf.Round(inFloat*1000.0)/1000.0;
	
	retFloat = LinearVal(retFloat);
	
	return retFloat;

}

