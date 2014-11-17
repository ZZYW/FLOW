Shader "Suimono2/waterscale_basic" {


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
	_SpecScatterAmt ("Specular Scatter", Range(0.0001,0.05)) = 0.02
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
	_RimPower ("RimPower", Range(0.01,10.0)) = 1.0
		
	
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
#pragma target 3.0
#include "SuimonoFunctions.cginc"
#pragma surface surf SuimonoDepth addshadow nolightmap noambient
#pragma glsl


float _CenterHeight;
float _MaxVariance;
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
float4 _SpecColorH;
float4 _SpecColorL;
float4 _DynReflColor;
float _OverallTrans;
float _OverallBright;


inline fixed4 LightingSuimonoDepth (SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten)
{


	half3 h = normalize (lightDir + viewDir);
	
	float NdotL = dot(s.Normal, lightDir);
	fixed NdotH = max(0, dot(s.Normal, h));

	
	fixed diff = max (0, dot (s.Normal, lightDir));	

	//calculate final color
	fixed4 c;

	c.rgb = s.Albedo.rgb * 2.0;
	c.rgb = c.rgb * lerp(0.5,1.0,(NdotL*0.5)) * _LightColor0.rgb;

    //overcolor
    c.rgb = lerp(c.rgb,_DepthColor.rgb,_DepthColor.a);

    c.rgb *= _LightColor0.a;

	c = saturate(c);
	c.rgb *= (atten);
	
	//c.rgb *= NdotL;
	c.a = s.Alpha;
	c.rgb *= _OverallBright;
	c.rgb *= _LightColor0.rgb;
	c.a *= _OverallTrans;
	
	c.a *= s.Specular;
	
	return c;
	
}





struct Input {
	float4 pos;
	float4 screenPos;	
	float2 uv_Surface1;
	float2 uv_FlowMap;
	float2 uv_WaveLargeTex;
	float3 viewDir;
};



float _EdgeBlend;
sampler2D _CameraDepthTexture;
sampler2D _DepthRamp;



void surf (Input IN, inout SurfaceOutput o) {

	float mask0 = (IN.screenPos.w - 70.0)*0.1;
	if (mask0 > 1.0) mask0 = 1.0;
	if (mask0 < 0.0) mask0 = 0.0;
	
	
	// calculate normals
	float _Parallax = lerp(0.0,0.06,tex2D(_Surface1, IN.uv_WaveLargeTex).r);
	float2 offset = ParallaxOffset(tex2D(_Surface1, IN.uv_Surface1).z, _Parallax, IN.viewDir);
	half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1+offset);
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex).z, _Parallax, IN.viewDir);
	half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex+offset);//uv_WaveLargeTex
	offset = ParallaxOffset(tex2D (_Surface1, IN.uv_WaveLargeTex*14.0).z, _Parallax, IN.viewDir);
	half4 n2 = tex2D(_WaveLargeTex,(IN.uv_WaveLargeTex*14.0));//uv_WaveLargeTex
	//half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1);
	//half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex);
	//half4 n2 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex*14.0);

	o.Normal = lerp(half3(0,0,1),UnpackNormal(d1),saturate(lerp(0.0,2.0,_BumpStrength)));
	o.Normal += UnpackNormal(n1) * saturate(lerp(0.0,2.0,_BumpStrength));
	o.Normal -= UnpackNormal(n2) * saturate(lerp(-1.0,1.0,_BumpStrength));
	o.Normal = normalize(o.Normal);
	
	

	o.Albedo = lerp(_DepthColorB.rgb,_DepthColor.rgb,_DepthColor.a)*1.8;
	
	o.Alpha = saturate(_DepthColorB.a + _DepthColor.a);
	o.Alpha *= _OverallTrans;
	
	o.Gloss = 1.0;
	o.Specular = mask0;
	o.Emission = 0.0;

	
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
#pragma target 3.0
#include "SuimonoFunctions.cginc"
#pragma surface surf SuimonoSurface noambient
#pragma glsl


float _SpecScatterAmt;
float _SpecScatterWidth;
float4 _DynReflColor;
float4 _SpecColorL;
float4 _SpecColorH;
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

	c.a *= s.Specular;
	//c = saturate(c);
	return c;
	
}




struct Input {
	float4 screenPos;
	float2 uv_Surface1;
	float2 uv_Surface2;
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
float4 _DepthColorG;


void surf (Input IN, inout SurfaceOutput o) {
	 
	//calculate distance masks
	float mask = (((IN.screenPos.w + _ReflDist))*(_ReflBlend));
	if (mask > 1.0) mask = 1.0;
	if (mask < 0.0) mask = 0.0;
	float mask1 = ((IN.screenPos.w - 1600.0)*0.0005);
	if (mask1 > 1.0) mask1 = 1.0;
	if (mask1 < 0.0) mask1 = 0.0;
	float mask0 = (IN.screenPos.w - 70.0)*0.1;
	if (mask0 > 1.0) mask0 = 1.0;
	if (mask0 < 0.0) mask0 = 0.0;
		

	// calculate wave height and roughness
	half waveHeight = (_WaveHeight/10.0);
	half detailHeight = (_DetailHeight/3.0);
	
	// calculate normals
	half4 d1 = tex2D(_WaveLargeTex,IN.uv_Surface1);
	half4 n1 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex);
	half4 n2 = tex2D(_WaveLargeTex,IN.uv_WaveLargeTex*14.0);

	o.Normal = lerp(half3(0,0,1),UnpackNormal(d1),saturate(lerp(0.0,2.0,_BumpStrength)));
	o.Normal += UnpackNormal(n1) * saturate(lerp(0.0,2.0,_BumpStrength));
	o.Normal -= UnpackNormal(n2) * saturate(lerp(-1.0,1.0,_BumpStrength));
	o.Normal = normalize(o.Normal);
	
	
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

	o.Specular = mask0;
	
	//set edge alpha
	half depth = UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(IN.screenPos)));
	depth = LinearEyeDepth(depth); 
	float4 edgeFade = float4(1.0,_EdgeBlend,0.0,0.0);
	float4 edgeBlendFactors = float4(1.0, 0.0, 0.0, 0.0);
	edgeBlendFactors = saturate(edgeFade * (depth-IN.screenPos.w));		
	float4 edgeSpread = (half4(1,0,0,1) - (edgeFade.w) * float4(0.15, 0.03, 0.01, 0.0));
	edgeSpread.a = (edgeBlendFactors.y);
	edgeSpread.a = saturate(1.0-edgeSpread.a);
	o.Gloss = 0.0;//edgeSpread.a;
	

}
ENDCG







}
FallBack "Diffuse"
}
