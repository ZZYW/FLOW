Shader "Suimono2/water_pro_dx11" {


Properties {

	_Tess ("Tessellation", Float) = 4.0
    _minDist ("TessMin", Range(-180.0, 0.0)) = 10.0
    _maxDist ("TessMax", Range(20.0, 500.0)) = 25.0
    _Displacement ("Displacement", Range(0, 8.0)) = 0.3
    _MaskAmt ("Mask Strength", Range(1, 8.0)) = 1.0

    _WaveLargeTex ("Wave Large", 2D) = "white" {}
   	_WaveHeight ("Wave Height", Range(0, 20.0)) = 0.0
   	_DetailHeight ("Detail Height", Range(0, 20.0)) = 0.0
   	_WaveShoreHeight ("Wave Shore Height", Range(0, 8.0)) = 0.0
   	_WaveScale ("Wave Scale", Range(0, 1.0)) = 0.25
	
	_CenterHeight ("Center Height", Float) = 0.0
	_MaxVariance ("Maximum Variance", Float) = 3.0

	_HighColor ("High Color", Color) = (1.0, 0.0, 0.0, 1.0)
	_LowColor ("Low Color", Color) = (0.0, 1.0, 0.0, 0.1)
		
	_Surface1 ("Surface Distortion 1", 2D) = "white" {}
	_Surface2 ("Surface Distortion 2", 2D) = "white" {}
	_WaveRamp ("Wave Ramp", 2D) = "white" {}
	
	_RefrStrength ("Refraction Strength (0.0 - 25.0)", Float) = 25.0
    _RefrSpeed ("Refraction Speed (0.0 - 0.5)", Float) = 0.5
    _RefrScale ("Refraction Scale", Float) = 0.5
	
	_SpecScatterWidth ("Specular Width", Range(1.0,10.0)) = 2.0
	_SpecScatterAmt ("Specular Scatter", Range(0.0,0.05)) = 0.02
	_SpecColorH ("Hot Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	_SpecColorL ("Reflect Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	
	_DynReflColor ("Reflection Dynamic", Color) = (1.0, 1.0, 1.0, 0.5)
	_ReflDist ("Reflection Distance", Float) = 1000.0
	_ReflBlend ("Reflection Blend", Range(0.002,0.1)) = 0.01
	_ReflBlur ("Reflection Blur", Range (0.0, 0.125)) = 0.01
	_ReflectionTex ("Reflection", 2D) = "white" {}

	_DepthAmt ("Depth Amount", Float) = 0.1
	
	_DepthColor ("Depth Over Tint", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorR ("Depth Color 1(r)", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorG ("Depth Color 2(g)", Color) = (0.25,0.25,0.5,1.0)
	_DepthColorB ("Depth Color 3(b)", Color) = (0.25,0.25,0.5,1.0)
	_DepthRamp ("Depth Color Ramp", 2D) = "white" {}
	
	_BlurSpread ("Blur Spread", Range (0.0, 0.125)) = 0.01
	_BlurRamp ("Blur Ramp", 2D) = "white" {}
	
	_FoamHeight ("Foam Height", Float) = 5.0
	_HeightFoamAmount ("Height Foam Amount", Range (0.0, 1.0)) = 1.0
	_HeightFoamSpread ("Height Foam Spread", Float) = 2.0
	
	_FoamSpread ("Foam Spread", Range (0.0, 1.0)) = 0.5
	_FoamColor ("Foam Color", Color) = (1,1,1,1)
	_FoamRamp ("Foam Ramp", 2D) = "white" {}
	_FoamOverlay ("Foam Overlay (RGB)", 2D) = "white" {}
	_FoamTex ("Foam Texture (RGB)", 2D) = "white" {}

	_EdgeBlend ("Edge Spread", Range (0.04,5.0)) = 10.0
	_EdgeSpread ("Edge Spread", Range (0.04,5.0)) = 10.0
	_EdgeColor ("Edge Color", Color) = (1,1,1,1)
	
	_BumpStrength ("Normal Strength", Float) = 0.9
	_ReflectStrength ("Reflection Strength", Float) = 1.0
		
	_CubeTex ("Cubemap", CUBE) = "white" {}
	_CubeMobile ("Cubemap Mobile", CUBE) = "white" {}
    
	_MasterScale ("Master Scale", Float) = 1.0
	_UnderReflDist ("Under Reflection", Float) = 1.0
	_UnderColor ("Underwater Color", Color) = (0.25,0.25,0.5,1.0)
	
	_WaveTex ("_WaveTex", 2D) = "white" {}
	_FlowMap ("_FlowMap", 2D) = "white" {}
	_FlowScale ("Flowmap Scale", Range(0.1,10.0)) = 0.0

	_TideColor ("Tide Color", Color) = (0.0,0.0,0.2,1.0)
	_TideAmount ("Tide Amount", Range(0.0,1.0)) = 1.0
	_TideSpread ("Tide Amount", Range(0.02,1.0)) = 0.4

	_WaveMap ("_WaveMap", 2D) = "white" {}
	
	_Ramp2D ("_BRDF Ramp", 2D) = "white" {}
	_RimPower ("RimPower", Range(0.0,10.0)) = 1.0
		
	
}



Subshader 
{ 


























// ---------------------------------
//   WATER DEPTH 
// ---------------------------------
Tags {"Queue"= "Transparent-101"}
Cull Back
Blend SrcAlpha OneMinusSrcAlpha
ZWrite On

 


CGPROGRAM


struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;
};


#pragma target 5.0
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf SuimonoDepth addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"



//float _CenterHeight;
//float _MaxVariance;
float4 _HighColor;
float4 _LowColor;
float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float _DepthAmt;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
float _OverallTrans;
float _OverallBright;

inline fixed4 LightingSuimonoDepth (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{

	half3 h = normalize (lightDir + viewDir);
	
	float NdotL = dot(s.Normal, lightDir);
	float NdotE = dot(s.Normal, viewDir);
	fixed NdotH = max(0, dot(s.Normal, h));
	float NdotS = dot(lightDir, viewDir);
	float NdotV = dot(h, viewDir);
	
	fixed diff = max (0, dot (s.Normal, lightDir));	

	//calculate final color
	fixed4 c;

	c.rgb = s.Albedo.rgb * 2.0;
	c.rgb = c.rgb * lerp(0.5,1.0,(NdotH*0.5)) * _LightColor0.rgb;

	fixed3 waveMask = saturate((1.0-NdotS*0.25)+NdotH)*h.g;
	
	c.rgb = c.rgb;
	c.a = s.Alpha;

	//fade out edges
    c.a = lerp(c.a,0.0,s.Gloss);
    
    //overcolor
    c.rgb = lerp(c.rgb,_DepthColor.rgb,_DepthColor.a);

    //back glow
    fixed3 glowColor = (_LowColor.rgb);

    
    c.rgb *= _LightColor0.a;
    
    c.rgb = lerp(c.rgb, glowColor,(saturate(h*2.0))*saturate(1.0-NdotV*2.0) * _LowColor.a * _LightColor0.a);

	//c.rgb = lerp(c.rgb*0.0, c.rgb, s.Normal.z*0.25);
	//c.a = lerp(c.a, 1.0, s.Normal.z*0.5);
	
	c = saturate(c);
	c.rgb *= (atten);
	c.rgb *= 1.2;
	
	c.rgb *= _LightColor0.a;
	c.rgb *= _OverallBright;
	c.a *= _OverallTrans;
	
	c = saturate(c);
	
	return c;
}



float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	//float4 pos;
	float4 screenPos;	
	float2 uv_Surface1;
	//float2 uv_Surface2;
	float2 uv_WaveLargeTex;
	float3 viewDir;
	float2 uv_FlowMap;
};


float _EdgeBlend;
sampler2D _CameraDepthTexture;
sampler2D _DepthRamp;


void surf (Input IN, inout SurfaceOutput o) {

	// calculate depth fogging
	float4 DepthFade = float4(1.0,(_DepthAmt * 0.01),0.0,0.0);
	float4 edgeBlendFactors = float4(0.0, 0.0, 0.0, 0.0);
	half depth = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth = LinearEyeDepth(depth);
	edgeBlendFactors = saturate(DepthFade * (depth-IN.screenPos.w));		
		
	float4 depthColor = (tex2D(_DepthRamp, float2(0.0, 0.5)) - (DepthFade.w * float4(0.15, 0.03, 0.01, 0.0)));
	float depthAmt = depthColor.a;
	
	//depthAmt *= (edgeBlendFactors.y);
	//depthAmt = edgeBlendFactors.x * depthAmt;
	depthAmt = (edgeBlendFactors.y);
	//depthAmt = edgeBlendFactors.x * depthAmt;
	
	float depthPos = depthAmt-DepthFade.w;
	
	if (depthPos > 1.0) depthPos = 1.0;
	if (depthPos < 0.0) depthPos = 0.0;
	depthColor = tex2D(_DepthRamp, float2(depthPos, 0.5));
	
	half4 setColor = half4(0,0,0,1);//_DepthColorB;// * depthColor.b;
	//setColor += _DepthColorG * depthColor.g;
	//setColor += _DepthColorR * depthColor.r;


	



	//calculate distance mask
	float mask1 = ((IN.screenPos.w - lerp(120.0,20.0,(_DepthAmt/25.0)))*0.005);
	if (mask1 > 1.0) mask1 = 1.0;
	if (mask1 < 0.0) mask1 = 0.0;
	//float mask2 = ((IN.screenPos.w + 40.0)*0.005);
	//if (mask2 > 1.0) mask2 = 1.0;
	//if (mask2 < 0.0) mask2 = 0.0;
	//float mask3 = ((IN.screenPos.w + 60.0)*0.002);
	//if (mask3 > 1.0) mask3 = 1.0;
	//if (mask3 < 0.0) mask3 = 0.0;
	
	
	
	// calculate wave height and roughness
	//half waveHeight = (_WaveHeight/10.0);
	//half detailHeight = (_DetailHeight/3.0);
	

	// calculate normals
	float _Parallax = lerp(0.0,0.06,tex2D(_Surface1, IN.uv_WaveLargeTex).r);
	float2 offset = ParallaxOffset(tex2D(_Surface1, IN.uv_Surface1).z, _Parallax, IN.viewDir);
	half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1+offset);
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex).z, _Parallax, IN.viewDir);
	half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex+offset);//uv_WaveLargeTex
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex*14.0).z, _Parallax, IN.viewDir);
	half4 n2 = tex2D(_WaveLargeTex,(IN.uv_WaveLargeTex*14.0)+offset);//uv_WaveLargeTex
	//half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1);
	//half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex);
	//half4 n2 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex*14.0);

	o.Normal = lerp(half3(0,0,1),UnpackNormal(d1),saturate(lerp(0.0,2.0,_BumpStrength)));
	o.Normal += UnpackNormal(n1) * saturate(lerp(0.0,2.0,_BumpStrength));
	o.Normal -= UnpackNormal(n2) * saturate(lerp(-1.0,1.0,_BumpStrength));
	o.Normal = normalize(o.Normal);
	
	//testnormal!
	half4 dComp = (lerp(half4(0.5,0.5,1.0,0.5),d1,saturate(_BumpStrength*4.0)));
	dComp *= ((saturate(lerp(1.0,n1,saturate(_BumpStrength*2.0)))));
	dComp *= ((saturate(lerp(1.0,n2*2.0,saturate(_BumpStrength)))));
	dComp.b = 0.5;
	dComp.a = 0.5;
	o.Normal = UnpackNormal(dComp);

	
	//depth colors and alpha
	setColor = _DepthColorB;
	setColor = lerp(setColor,_DepthColorB,depthColor.b);
	setColor = lerp(setColor,_DepthColorG*1.8,depthColor.g*_DepthColorG.a);
	setColor = lerp(setColor,_DepthColorR*1.8,depthColor.r*_DepthColorR.a);
	o.Albedo = setColor.rgb;
	
	o.Alpha = (1.0-tex2D(_FlowMap, IN.uv_FlowMap).r);
	o.Alpha += lerp(0.0,_DepthColorB.a,depthColor.b);
	o.Alpha += lerp(0.0,_DepthColorG.a,depthColor.g);
	o.Alpha += lerp(0.0, _DepthColorR.a, depthColor.r);
	
	
	
	//distance depth color
	o.Albedo = lerp(o.Albedo,_DepthColorB.rgb,mask1);
	
	//surface overcolor
	o.Albedo = lerp(o.Albedo,_DepthColor.rgb*2.5,_DepthColor.a);
	o.Alpha = lerp(o.Alpha,1.0,_DepthColor.a);

	//o.Gloss = mask1;
	
	
	//half4 x1 = tex2D(_Surface1,IN.uv_Surface1);
	//half4 x2 = tex2D(_Surface1,IN.uv_Surface1);
	//half heightFac = saturate(x1.r+x2.r);
	//o.Albedo = lerp(o.Albedo,lerp(_DepthColorB.rgb,_DepthColorG.rgb,0.5),heightFac*_DepthColorG.a);
	//o.Albedo = lerp(o.Albedo, _HighColor.rgb, heightFac*_HighColor.a);
	//half alphaFac = lerp(o.Alpha, 1.0, heightFac*_HighColor.a);
	//o.Alpha = alphaFac;


	half4 x1 = tex2D(_Surface1,IN.uv_Surface1);
	half4 x2 = tex2D(_Surface1,IN.uv_Surface1);
	half heightFac = saturate(x1.r+x2.r);
	
	o.Albedo = lerp(o.Albedo,lerp(_DepthColorB.rgb,_DepthColorG.rgb,0.5),heightFac);
	o.Albedo = lerp(o.Albedo, _HighColor.rgb, heightFac*_HighColor.a);
	
	half alphaFac = lerp(o.Alpha, 1.0, heightFac*_HighColor.a);
	o.Alpha = alphaFac;
	
	
	
	//set edge alpha
	half depth2 = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth2 = LinearEyeDepth(depth2); 
	float4 edgeFade = float4(1.0,_EdgeBlend,0.0,0.0);
	float4 edgeBlendFactors2 = float4(1.0, 0.0, 0.0, 0.0);
	edgeBlendFactors2 = saturate(edgeFade * (depth2-IN.screenPos.w));		
	float4 edgeSpread = (half4(1,0,0,1) - (edgeFade.w) * float4(0.15, 0.03, 0.01, 0.0));
	edgeSpread.a = (edgeBlendFactors2.y);
	edgeSpread.a = saturate(1.0-edgeSpread.a);
	o.Gloss = edgeSpread.a;

	
}

ENDCG













// -------------------------------------
//   UNDERWATER REFRACTION and BLURRING 
// -------------------------------------
GrabPass {
	Tags {"Queue" = "Transparent-101"}
	Name "BlurGrab"
}

//Pass{
	Tags {"Queue"= "Transparent-101"}
	Cull Back
	Blend SrcAlpha OneMinusSrcAlpha
	ZWrite on
	



CGPROGRAM

struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;    
};


#pragma target 5.0
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf Lambert vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"


float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	float4 screenPos;
	float2 uv_Surface1;
	//float2 uv_Surface2;
	float2 uv_WaveLargeTex;  
	float3 viewDir;
    //INTERNAL_DATA
};


sampler2D _GrabTexture;

float4 _GrabTexture_TexelSize;
float _BlurSpread;
float _RefrStrength;
sampler2D _CameraDepthTexture;
sampler2D _BlurRamp;
float _DepthAmt;
float _EdgeBlend;
float _RefrShift;
float _blurSamples;
float _isForward;
float _UVReversal;
float _OverallTrans;
float _OverallBright;

void surf (Input IN, inout SurfaceOutput o) {


	//calculate edge alpha
	half depth = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth = LinearEyeDepth(depth); 
	float4 edgeFade = float4(1.0,_EdgeBlend,0.0,0.0);
	float4 edgeBlendFactors = float4(1.0, 0.0, 0.0, 0.0);
	edgeBlendFactors = saturate(edgeFade * (depth-IN.screenPos.w));		
	float4 edgeSpread = (half4(1,0,0,1) - (edgeFade.w) * float4(0.15, 0.03, 0.01, 0.0));
	edgeSpread.r = saturate(edgeBlendFactors.y);
	edgeSpread.a = saturate(0.1+edgeBlendFactors.y);
	
	// calculate normals with parallax offset
	float _Parallax = lerp(0.0,0.06,tex2D(_Surface1, IN.uv_WaveLargeTex).r);
	float2 offset = ParallaxOffset(tex2D(_Surface1, IN.uv_Surface1).z, _Parallax, IN.viewDir);
	half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1+offset);
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex).z, _Parallax, IN.viewDir);
	half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex+offset);//uv_WaveLargeTex
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex*14.0).z, _Parallax, IN.viewDir);
	half4 n2 = tex2D(_WaveLargeTex,(IN.uv_WaveLargeTex*14.0)+offset);//uv_WaveLargeTex
	//half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1);
	//half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex);
	//half4 n2 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex*14.0);
	

	half3 useNormal;
	useNormal = lerp(half3(0,0,1),UnpackNormal(d1),saturate(lerp(0.0,2.0,_BumpStrength)));
	useNormal += UnpackNormal(n1) * saturate(lerp(0.0,2.0,_BumpStrength));
	useNormal += UnpackNormal(n2) * saturate(lerp(-1.0,1.0,_BumpStrength)) * 0.16;
	useNormal = normalize(useNormal);

	//testnormal!
	half4 dComp = (lerp(half4(0.5,0.5,1.0,0.5),d1,saturate(_BumpStrength*4.0)));
	dComp *= ((saturate(lerp(1.0,n1,saturate(_BumpStrength*2.0)))));
	dComp *= ((saturate(lerp(1.0,n2*2.0,saturate(_BumpStrength)))));
	dComp.b = 0.5;
	dComp.a = 0.5;
	useNormal = UnpackNormal(dComp);
	

	//calculate texture and displace
	float4 uvs = IN.screenPos;
	
	if (_isForward == 1.0){
		uvs.y = uvs.w - uvs.y;
	}
	
	if (_UVReversal == 1.0){
		if (_isForward == 1.0){
			uvs.y = IN.screenPos.y;
		} else {
			uvs.y = uvs.w - IN.screenPos.y;
		}
	}
	
	
	float4 uv1 = uvs;
	float4 uv2 = IN.screenPos;
	float4 uvx = IN.screenPos;
		uv1.y -= (useNormal.y*_RefrStrength*edgeSpread.a);
		uvx.y -= (useNormal.y*_RefrStrength*edgeSpread.a);

	//calculated distorted depth
	half4 depth1 = tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)).r;
	half rShift = _RefrShift * (lerp(0.0,2.0,useNormal.y) * _RefrStrength * edgeSpread.a);
	depth1.r += tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(float4(uvx.x+rShift, uvx.y, uvx.z,uvx.w))).r;
	depth1.r += tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(float4(uvx.x-rShift, uvx.y, uvx.z,uvx.w))).b;
	
	//calculate distorted color
	half4 oCol = tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(uv1)) * 1.4;
	oCol.r = tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x+rShift, uv1.y, uv1.z,uv1.w))).r * 1.4;
	oCol.b = tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x-rShift, uv1.y, uv1.z,uv1.w))).b * 1.4;
	oCol.a = 1.0;

	//calculated original depth
	half4 depth2 = tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(float4(uv2.x, uv2.y, uv2.z,uv2.w))).r;
	depth2.r += tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(float4(uv2.x+rShift, uv2.y, uv2.z,uv2.w))).r;
	depth2.r += tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(float4(uv2.x-rShift, uv2.y, uv2.z,uv2.w))).b;
	
	//calculate original color
	half4 oCol2 = tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(uv1)) * 1.4;


	//calculate blur texture
	half blur = 1.0;
	half4 xCol = half4(0,0,0,0);
	half res = 1.0;
	int divsamples = _blurSamples-1;
	//if (_BlurSpread > 0.0){
		for(int i=1; i < _blurSamples; i++){
		
			res = 0.004 * i * edgeSpread.r;
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x-res*blur, uv1.y-res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x+res*blur, uv1.y-res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x-res*blur, uv1.y+res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x+res*blur, uv1.y+res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
		
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x, uv1.y-res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x, uv1.y+res*blur, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x+res*blur, uv1.y, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
			xCol += (tex2Dproj(_GrabTexture, UNITY_PROJ_COORD(float4(uv1.x-res*blur, uv1.y, uv1.z,uv1.w)))*(1.0/divsamples)*0.125);
		}
		xCol = saturate(xCol*1.2);
	//}
	
	o.Gloss = 0.0;
	o.Specular = 0.0;
	
	//blend normal texture and blur texture
	half useAlpha = 1.0;
	half3 useAlbedo = lerp(oCol.rgb,xCol.rgb,_BlurSpread);
	
	if ((depth2.r - depth1.r) > 0.05){
		useAlpha = 1.0;
		useAlbedo = oCol2.rgb;
	}

	o.Albedo = useAlbedo*1.36;
	o.Alpha = useAlpha;
	
	
	//set edge alpha
	o.Alpha *= (edgeSpread.a);
	o.Alpha *= _OverallTrans;
	
}

ENDCG









// ---------------------------------
//   SURFACE REFLECTIONS
// ---------------------------------
Tags {"RenderType"="Transparent" "Queue"= "Transparent-101"}
Cull Back
Blend SrcAlpha OneMinusSrcAlpha
ZWrite On




CGPROGRAM

struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;    
};


#pragma target 5.0
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf SuimonoSurface addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
//#pragma surface surf BlinnPhong addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap
#include "Tessellation.cginc"


float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float _DepthAmt;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
float4 _SpecColorH;
float4 _SpecColorL;
float4 _DynReflColor;
float _OverallTrans;
float _OverallBright;



inline fixed4 LightingSuimonoSurface (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{

	//calculate dots
	half3 lDir = half3(lightDir.x,lightDir.y,lightDir.z);
	half3 vDir = half3(viewDir.x,viewDir.y,viewDir.z);
	half3 h = normalize (lDir + vDir);
	float NdotL = dot(s.Normal, lDir);
	float NdotE = dot(s.Normal, vDir);
	fixed diff = max (0, dot(s.Normal, lightDir));
	
	
	//calculate specular
	float nh = max (0, dot (s.Normal, h));
	float spec = saturate(pow(nh,  _SpecScatterAmt)*1.0);
	float spec2 = pow (nh, _SpecScatterWidth*50)*(100.0);

	fixed4 c;
	//base color
	c.rgb = lerp(_DynReflColor.rgb,s.Albedo * 2.0,_DynReflColor.a);
	c.rgb *= (_LightColor0.rgb * _DynReflColor.rgb + _LightColor0.rgb);// * saturate(diff*3.0);// * diff;
	c.a = lerp(diff*_DynReflColor.a,s.Alpha,_DynReflColor.a);

	//clamp
	if (c.a > 1.0) c.a = 1.5;
	c.a = lerp(0.0,c.a,s.Alpha);
	c.a = lerp(c.a,c.a*0.3,s.Gloss);

	//edge transparency
	c.a *= (1.0-s.Gloss);

	//clamp surface colors
	c.rgb *= (atten);
	
	//add specular
	c.rgb += lerp(half3(0,0,0),(spec)*_SpecColorL.rgb,_SpecColorL.a);

	c = saturate(c);
	
	//reveal texture
	c.a *= NdotL;

	c.rgb *= _LightColor0.a;
	//c.rgb *= _OverallBright;
	c.a *= _OverallTrans;
	
	//add hot specular
	//c.rgb += lerp(half3(0,0,0),((spec2)*_SpecColorH.rgb),_SpecColorH.a);
	spec2 *= _LightColor0.a;
	_SpecColorH.rgb *= _LightColor0.a;
	//c.rgb += lerp(half3(0,0,0),(saturate(spec2)*(_SpecColorH.rgb*_LightColor0.rgb)),_SpecColorH.a*_LightColor0.a*atten);
	//c.a *= (1.0+saturate(spec2*_SpecColorH.a));
	c.rgb += lerp(half3(0,0,0),((spec2)*(_SpecColorH.rgb*_LightColor0.rgb)),_SpecColorH.a*_LightColor0.a*atten);
	c.a += ((spec2*_SpecColorH.a));
	
	
	
	
	
	//c = saturate(c);
	
	return c;
	
}





float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}

struct Input {
	float4 screenPos;
	float2 uv_Surface1;
	float2 uv_FlowMap;
	float3 viewDir;
	float2 uv_WaveLargeTex;  
	float3 worldRefl;
    INTERNAL_DATA
};


sampler2D _CameraDepthTexture;
float _ReflBlend;
float _ReflDist;
float _ReflectStrength; 
float useReflection;
float _EdgeBlend;
sampler2D _ReflectionTex;
samplerCUBE _CubeMobile;



void surf (Input IN, inout SurfaceOutput o) {
	 
	//calculate distance masks
	float mask = (((IN.screenPos.w + _ReflDist))*(_ReflBlend));
	if (mask > 1.0) mask = 1.0;
	if (mask < 0.0) mask = 0.0;
	float mask1 = ((IN.screenPos.w - 1600.0)*0.0005);
	if (mask1 > 1.0) mask1 = 1.0;
	if (mask1 < 0.0) mask1 = 0.0;

	// calculate wave height and roughness
	//half waveHeight = (_WaveHeight/10.0);
	//half detailHeight = (_DetailHeight/3.0);
	
	// calculate normals with parallax offset
	float _Parallax = lerp(0.0,0.06,tex2D(_Surface1, IN.uv_WaveLargeTex).r);
	float2 offset = ParallaxOffset(tex2D(_Surface1, IN.uv_Surface1).z, _Parallax, IN.viewDir);
	half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1+offset);
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex).z, _Parallax, IN.viewDir);
	half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex+offset);//uv_WaveLargeTex
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex*14.0).z, _Parallax, IN.viewDir);
	half4 n2 = tex2D(_WaveLargeTex,(IN.uv_WaveLargeTex*14.0)+offset);//uv_WaveLargeTex
	//half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1);
	//half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex);
	//half4 n2 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex*14.0);
	

	o.Normal = lerp(half3(0,0,1),UnpackNormal(d1),saturate(lerp(0.0,2.0,_BumpStrength)));
	o.Normal += UnpackNormal(n1) * saturate(lerp(0.0,2.0,_BumpStrength));
	o.Normal -= UnpackNormal(n2) * saturate(lerp(-1.0,1.0,_BumpStrength));
	o.Normal = normalize(o.Normal);
	
	//testnormal!
	half4 dComp = (lerp(half4(0.5,0.5,1.0,0.5),d1,saturate(_BumpStrength*4.0)));
	dComp *= ((saturate(lerp(1.0,n1,saturate(_BumpStrength*2.0)))));
	dComp *= ((saturate(lerp(1.0,n2*2.0,saturate(_BumpStrength)))));
	dComp.b = 0.5;
	dComp.a = 0.5;
	//o.Normal = UnpackNormal(dComp);


	//testnormal TRY 2!
	half4 dComp2 = d1+((n1*0.5)-(n2*0.25));
	//dComp2 = n1;
	//dComp *= ((saturate(lerp(1.0,n2*2.0,saturate(_BumpStrength)))));
	dComp.b = 0.5;
	dComp.a = 0.5;
	//o.Normal = UnpackNormal(dComp2);
	
	
	// decode cube / mobile reflection
	float nUV = 1.0;
	nUV += (o.Normal.y*_ReflectStrength*1.5)-(1.0*_ReflectStrength*0.25);
	half3 cubeRef = half3(0,0,1);
	cubeRef = texCUBE(_CubeMobile, WorldReflectionVector (IN, o.Normal)*float4(1.0,nUV,1.0,1.0)).rgb; 
	cubeRef = lerp(half3(0,0,0),cubeRef,mask);
	cubeRef = lerp(cubeRef,_DepthColorG.rgb,mask1); 
	cubeRef = lerp(_DynReflColor.rgb,(cubeRef.rgb*_DynReflColor.rgb*_DynReflColor.a),_DynReflColor.a);
	
	// decode dynamic reflection
	float4 uv1 = IN.screenPos; uv1.xy;
	uv1.y += (o.Normal.y*_ReflectStrength*_BumpStrength*1.5)-(1.0*_ReflectStrength*_BumpStrength*0.25);
	half4 refl = tex2Dproj( _ReflectionTex, UNITY_PROJ_COORD(uv1));
	
	// calculate dynamic reflection colors
	half3 dynRef = lerp(_DynReflColor.rgb,(refl.rgb*_DynReflColor.rgb*_DynReflColor.a),_DynReflColor.a);
	dynRef = refl.rgb;
	//dynRef = lerp(dynRef,_DepthColorG.rgb,mask1);

	// switch in cube reflection if dynamic not available
	o.Albedo = lerp(cubeRef,dynRef,useReflection);
	
	// color albedo via reflection color
	//o.Albedo = lerp(o.Albedo,_DynReflColor.rgb,_BumpStrength)*(o.Normal.z);

	// set alpha by distance
	o.Alpha = mask;

	
	//set edge alpha
	half depth = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth = LinearEyeDepth(depth); 
	float4 edgeFade = float4(1.0,_EdgeBlend,0.0,0.0);
	float4 edgeBlendFactors = float4(1.0, 0.0, 0.0, 0.0);
	edgeBlendFactors = saturate(edgeFade * (depth-IN.screenPos.w));		
	float4 edgeSpread = (half4(1,0,0,1) - (edgeFade.w) * float4(0.15, 0.03, 0.01, 0.0));
	edgeSpread.a = (edgeBlendFactors.y);
	edgeSpread.a = saturate(1.0-edgeSpread.a);
	o.Gloss = edgeSpread.a;

	
	

}
ENDCG











//-------------------
//    FOAM
//-------------------
Tags {"Queue"= "Transparent-101"}
Cull Back
Blend SrcAlpha OneMinusSrcAlpha
ZWrite On







CGPROGRAM

struct appdata {
	float4 vertex : POSITION;
	float4 tangent : TANGENT;
	float3 normal : NORMAL;
	float2 texcoord : TEXCOORD0;
};



#pragma target 5.0
#include "SuimonoFunctionsDX11.cginc"
#pragma surface surf Lambert addshadow vertex:vertexSuimonoDisplaceDX11 tessellate:tessDistance nolightmap noambient
#include "Tessellation.cginc"
#include <UnityCG.cginc>


float4 _DepthColor;
float4 _DepthColorR;
float4 _DepthColorG;
float4 _DepthColorB;
float _DepthAmt;
float _SpecScatterWidth;
float _SpecScatterAmt;
float _RimPower;
sampler2D _Ramp2D;
float4 _SpecColorH;
float4 _SpecColorL;


float4 tessDistance (appdata v0, appdata v1, appdata v2) {
	return UnityDistanceBasedTess(v0.vertex, v1.vertex, v2.vertex, _minDist, _maxDist, (_Tess));
}



struct Input {
	float2 uv_FoamTex;
	float2 uv_FoamOverlay;
	float2 uv_Surface1;
	//float2 uv_WaveLargeTex;
	float2 uv_FlowMap;
	float4 screenPos;
};



float _FoamHeight;
float _HeightFoamAmount;
float _HeightFoamSpread;


sampler2D _WaveRamp;
float4 _FoamColor;
float4 _EdgeColor;
sampler2D _FoamTex;
sampler2D _CameraDepthTexture;
float _EdgeSpread;
float _FoamSpread;
sampler2D _FoamRamp;
sampler2D _FoamOverlay;
float _ShallowFoamAmt;
float _OverallBright;


void surf (Input IN, inout SurfaceOutput o) {

	float4 foamFade = float4(1.0,_FoamSpread,0.0,0.0);
	float4 edgeBlendFactors = float4(1.0, 0.0, 0.0, 0.0);
	half depth = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth = LinearEyeDepth(depth); 
	
	edgeBlendFactors = saturate(foamFade * (depth-IN.screenPos.w));		
	float4 foamSpread = (_FoamColor - (foamFade.w) * float4(0.15, 0.03, 0.01, 0.0));
	foamSpread.a = (edgeBlendFactors.y);
	foamSpread.a = saturate(1.0-foamSpread.a);

	float4 foamFade2 = float4(1.0,_EdgeSpread,0.0,0.0);
	float4 edgeBlendFactors2 = float4(1.0, 0.0, 0.0, 0.0);
	edgeBlendFactors2 = saturate(foamFade2 * (depth-IN.screenPos.w));		
	float4 foamSpread2 = (_FoamColor - (foamFade2.w) * float4(0.15, 0.03, 0.01, 0.0));
	foamSpread2.a = 1.0-edgeBlendFactors2.y;
	half fspread2 = saturate(foamSpread2.a);
	

		
	//init foam components
	half4 getflowmap = tex2D(_FlowMap,IN.uv_FlowMap);
	half3 texwave = tex2D(_WaveMap, IN.uv_FlowMap).rgb;
	half4 foamTexture = tex2D(_FoamTex, IN.uv_FoamTex);
	half4 foamOverlay = tex2D(_FoamOverlay, IN.uv_FoamOverlay*2.0);
	half alphaCalc = 0.0;

	//new height foam
	half4 w1 = tex2D(_Surface1,IN.uv_Surface1);
	half4 w2 = tex2D(_Surface1,IN.uv_Surface1);
	half hfoam = lerp(0.0,1.0,(w2.r + (w1.r * (w2.r*_HeightFoamSpread)) *1.5))*_HeightFoamAmount * (_WaveHeight/(_FoamHeight*10.0));
	
	//CALCULATE SHORE WAVE FOAM
	float2 tex = IN.uv_FlowMap;
	float2 tex3 = IN.uv_FlowMap * shoreWaveScale;
	float4 getflowmap2 = tex2D(_FlowMap, float2(tex.x, tex.y));
 	float2 flowmap = float2(saturate(getflowmap2.r + getflowmap2.g),getflowmap2.b) * 2.0f - 1.0f;
	flowmap.x = lerp(0.0,flowmap.x,_FlowShoreScale);
	flowmap.y = lerp(0.0,flowmap.y,_FlowShoreScale);
	half4 waveTex = tex2D(_WaveTex, float2(tex3.x+flowOffX+flowmap.x,tex3.y+flowOffY+flowmap.y));
	half shorefoam = ((waveTex.g * 1.4) * (getflowmap2.r) * _ShallowFoamAmt);// + getflowmap2.g;
	half shorefoam2 = lerp(0.0,((waveTex.b * 1.4) * (getflowmap2.r) * _ShallowFoamAmt),getflowmap2.r);
	
	half shoretint = lerp(0.0,(waveTex.b * 1.0) * (getflowmap2.r),_WaveShoreHeight)*0.4;
	
	
	//edge foam
	half alphaCalc2 = 0.0;
	half fspread3 = saturate(foamSpread.a+((getflowmap.g * 0.3))*texwave.g + hfoam + (shorefoam+shorefoam2));
	alphaCalc2 = lerp(0.0,foamTexture.b,tex2D(_FoamRamp, float2(1.0-fspread3, 0.5)).b);
	alphaCalc2 += lerp(0.0,foamTexture.r,tex2D(_FoamRamp, float2(1.0-fspread3, 0.5)).r);
	alphaCalc2 += lerp(0.0,foamTexture.g,tex2D(_FoamRamp, float2(1.0-fspread3, 0.5)).g);
	if (alphaCalc2 > 1.0) alphaCalc2 = 1.0;
	alphaCalc2 *= _FoamColor.a;
	alphaCalc2 *= tex2D(_FoamRamp, float2(1.0-fspread3, 0.5)).a * 2.0;
	if (alphaCalc2 >= 0.99) alphaCalc2 = 0.99;
	if (alphaCalc2 < 0.0) alphaCalc2 = 0.0;
	
	//shore foam
	half edgeFac = lerp(-10.0,1.0,getflowmap.r)*0.5;
	if (edgeFac < 0.0) edgeFac = 0.0;
	
	//edge line
	half edgePos = ((fspread2) * _EdgeColor.a);

	
	//final color and alpha
	o.Albedo = lerp(half3(0,0,0),_DepthColorB.rgb,0.4);
	o.Alpha = shoretint;
	
	half addAlpha = (saturate(alphaCalc2)*foamOverlay.a)+(edgePos) * _FoamColor.a;
	//if (addAlpha > 0.5) addAlpha = 1.0;
	o.Alpha += addAlpha;
	if (addAlpha > 0.1){
		o.Albedo += (lerp(_FoamColor.rgb*0.5,foamOverlay.rgb*_FoamColor.rgb*2.0,o.Alpha));
		o.Albedo += (lerp(o.Albedo,_EdgeColor.rgb*1.4,edgePos) * 2.0);
	
		o.Albedo *= lerp(1.0,0.4,shoretint);
	}
	
	o.Albedo = _FoamColor*2.2;//saturate(o.Albedo)*1.8;
	o.Alpha = saturate(o.Alpha);
	
	//o.Specular = 0.05;
	//o.Gloss = 1.0;
	//_SpecColor.rgb = _FoamColor.rgb*0.8;
	
	//o.Albedo *= _OverallBright;
	

	
			
}
ENDCG






}
FallBack "Diffuse"
}
