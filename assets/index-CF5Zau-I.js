var tg=Object.defineProperty;var eg=(i,t,e)=>t in i?tg(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var nt=(i,t,e)=>eg(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xu="160",Cs={ROTATE:0,DOLLY:1,PAN:2},Ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ng=0,Th=1,ig=2,_f=1,yf=2,yi=3,ai=0,_n=1,mn=2,Xi=0,ar=1,Ai=2,Ah=3,Ch=4,sg=5,us=100,rg=101,og=102,Ph=103,Rh=104,ag=200,cg=201,lg=202,ug=203,Ol=204,Fl=205,hg=206,dg=207,fg=208,pg=209,mg=210,gg=211,_g=212,yg=213,vg=214,xg=0,Mg=1,bg=2,ka=3,Sg=4,wg=5,Eg=6,Tg=7,Mu=0,Ag=1,Cg=2,ji=0,Pg=1,Rg=2,Lg=3,vf=4,Dg=5,Ig=6,Lh="attached",Ng="detached",xf=300,pr=301,mr=302,Ul=303,zl=304,sc=306,Ms=1e3,ln=1001,Ba=1002,qe=1003,kl=1004,Ra=1005,fn=1006,Mf=1007,bs=1008,$i=1009,Og=1010,Fg=1011,bu=1012,bf=1013,Hi=1014,bi=1015,po=1016,Sf=1017,wf=1018,ms=1020,Ug=1021,Sn=1023,zg=1024,kg=1025,gs=1026,gr=1027,Bg=1028,Ef=1029,Gg=1030,Tf=1031,Af=1033,Fc=33776,Uc=33777,zc=33778,kc=33779,Dh=35840,Ih=35841,Nh=35842,Oh=35843,Cf=36196,Fh=37492,Uh=37496,zh=37808,kh=37809,Bh=37810,Gh=37811,Hh=37812,Vh=37813,Wh=37814,Xh=37815,jh=37816,$h=37817,qh=37818,Yh=37819,Kh=37820,Zh=37821,Bc=36492,Jh=36494,Qh=36495,Hg=36283,td=36284,ed=36285,nd=36286,mo=2300,_r=2301,Gc=2302,id=2400,sd=2401,rd=2402,Vg=2500,Wg=0,Pf=1,Bl=2,Rf=3e3,_s=3001,Xg=3200,jg=3201,Su=0,$g=1,Nn="",be="srgb",Ve="srgb-linear",wu="display-p3",rc="display-p3-linear",Ga="linear",Me="srgb",Ha="rec709",Va="p3",Rs=7680,od=519,qg=512,Yg=513,Kg=514,Lf=515,Zg=516,Jg=517,Qg=518,t1=519,Gl=35044,ad="300 es",Hl=1035,Si=2e3,Wa=2001;class Ji{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let cd=1234567;const oo=Math.PI/180,yr=180/Math.PI;function jn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]+"-"+nn[t&255]+nn[t>>8&255]+"-"+nn[t>>16&15|64]+nn[t>>24&255]+"-"+nn[e&63|128]+nn[e>>8&255]+"-"+nn[e>>16&255]+nn[e>>24&255]+nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]).toLowerCase()}function Be(i,t,e){return Math.max(t,Math.min(e,i))}function Eu(i,t){return(i%t+t)%t}function e1(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function n1(i,t,e){return i!==t?(e-i)/(t-i):0}function ao(i,t,e){return(1-e)*i+e*t}function i1(i,t,e,n){return ao(i,t,1-Math.exp(-e*n))}function s1(i,t=1){return t-Math.abs(Eu(i,t*2)-t)}function r1(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function o1(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function a1(i,t){return i+Math.floor(Math.random()*(t-i+1))}function c1(i,t){return i+Math.random()*(t-i)}function l1(i){return i*(.5-Math.random())}function u1(i){i!==void 0&&(cd=i);let t=cd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function h1(i){return i*oo}function d1(i){return i*yr}function Vl(i){return(i&i-1)===0&&i!==0}function f1(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Xa(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function p1(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*u,c*h,c*d,a*l);break;case"YZY":i.set(c*d,a*u,c*h,a*l);break;case"ZXZ":i.set(c*h,c*d,a*u,a*l);break;case"XZX":i.set(a*u,c*m,c*f,a*l);break;case"YXY":i.set(c*f,a*u,c*m,a*l);break;case"ZYZ":i.set(c*m,c*f,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Qn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const fe={DEG2RAD:oo,RAD2DEG:yr,generateUUID:jn,clamp:Be,euclideanModulo:Eu,mapLinear:e1,inverseLerp:n1,lerp:ao,damp:i1,pingpong:s1,smoothstep:r1,smootherstep:o1,randInt:a1,randFloat:c1,randFloatSpread:l1,seededRandom:u1,degToRad:h1,radToDeg:d1,isPowerOfTwo:Vl,ceilPowerOfTwo:f1,floorPowerOfTwo:Xa,setQuaternionFromProperEuler:p1,normalize:ge,denormalize:Qn};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class te{constructor(t,e,n,s,r,o,a,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],f=n[5],m=n[8],_=s[0],g=s[3],p=s[6],y=s[1],v=s[4],x=s[7],M=s[2],S=s[5],T=s[8];return r[0]=o*_+a*y+c*M,r[3]=o*g+a*v+c*S,r[6]=o*p+a*x+c*T,r[1]=l*_+u*y+h*M,r[4]=l*g+u*v+h*S,r[7]=l*p+u*x+h*T,r[2]=d*_+f*y+m*M,r[5]=d*g+f*v+m*S,r[8]=d*p+f*x+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,d=a*c-u*r,f=l*r-o*c,m=e*h+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=h*_,t[1]=(s*l-u*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(u*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Hc.makeScale(t,e)),this}rotate(t){return this.premultiply(Hc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Hc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Hc=new te;function Df(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function go(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function m1(){const i=go("canvas");return i.style.display="block",i}const ld={};function co(i){i in ld||(ld[i]=!0,console.warn(i))}const ud=new te().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),hd=new te().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ko={[Ve]:{transfer:Ga,primaries:Ha,toReference:i=>i,fromReference:i=>i},[be]:{transfer:Me,primaries:Ha,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[rc]:{transfer:Ga,primaries:Va,toReference:i=>i.applyMatrix3(hd),fromReference:i=>i.applyMatrix3(ud)},[wu]:{transfer:Me,primaries:Va,toReference:i=>i.convertSRGBToLinear().applyMatrix3(hd),fromReference:i=>i.applyMatrix3(ud).convertLinearToSRGB()}},g1=new Set([Ve,rc]),he={enabled:!0,_workingColorSpace:Ve,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!g1.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=ko[t].toReference,s=ko[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return ko[i].primaries},getTransfer:function(i){return i===Nn?Ga:ko[i].transfer}};function cr(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vc(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ls;class If{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ls===void 0&&(Ls=go("canvas")),Ls.width=t.width,Ls.height=t.height;const n=Ls.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ls}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=go("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=cr(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(cr(e[n]/255)*255):e[n]=cr(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let _1=0;class Nf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_1++}),this.uuid=jn(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Wc(s[o].image)):r.push(Wc(s[o]))}else r=Wc(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Wc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?If.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let y1=0;class Ye extends Ji{constructor(t=Ye.DEFAULT_IMAGE,e=Ye.DEFAULT_MAPPING,n=ln,s=ln,r=fn,o=bs,a=Sn,c=$i,l=Ye.DEFAULT_ANISOTROPY,u=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:y1++}),this.uuid=jn(),this.name="",this.source=new Nf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(co("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===_s?be:Nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==xf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ms:t.x=t.x-Math.floor(t.x);break;case ln:t.x=t.x<0?0:1;break;case Ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ms:t.y=t.y-Math.floor(t.y);break;case ln:t.y=t.y<0?0:1;break;case Ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return co("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===be?_s:Rf}set encoding(t){co("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===_s?be:Nn}}Ye.DEFAULT_IMAGE=null;Ye.DEFAULT_MAPPING=xf;Ye.DEFAULT_ANISOTROPY=1;class ue{constructor(t=0,e=0,n=0,s=1){ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],m=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,x=(f+1)/2,M=(p+1)/2,S=(u+d)/4,T=(h+_)/4,I=(m+g)/4;return v>x&&v>M?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=S/n,r=T/n):x>M?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=S/s,r=I/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=T/r,s=I/r),this.set(n,s,r,e),this}let y=Math.sqrt((g-m)*(g-m)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(h-_)/y,this.z=(d-u)/y,this.w=Math.acos((l+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class v1 extends Ji{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(co("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===_s?be:Nn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ye(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Nf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ss extends v1{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Of extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class x1 extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],f=r[o+1],m=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(h!==_||c!==d||l!==f||u!==m){let g=1-a;const p=c*d+l*f+u*m+h*_,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const M=Math.sqrt(v),S=Math.atan2(M,p*y);g=Math.sin(g*S)/M,a=Math.sin(a*S)/M}const x=a*y;if(c=c*g+d*x,l=l*g+f*x,u=u*g+m*x,h=h*g+_*x,g===1-a){const M=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=M,l*=M,u*=M,h*=M}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+u*h+c*f-l*d,t[e+1]=c*m+u*d+l*h-a*f,t[e+2]=l*m+u*f+a*d-c*h,t[e+3]=u*m-a*h-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),h=a(r/2),d=c(n/2),f=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=d*u*h+l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h+d*f*m;break;case"YZX":this._x=d*u*h+l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h-d*f*m;break;case"XZY":this._x=d*u*h-l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Be(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-e)*u)/l,d=Math.sin(e*u)/l;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class E{constructor(t=0,e=0,n=0){E.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(dd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(dd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+c*l+o*h-a*u,this.y=n+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xc.copy(this).projectOnVector(t),this.sub(Xc)}reflect(t){return this.sub(Xc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xc=new E,dd=new qn;class Ee{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,zn):zn.fromBufferAttribute(r,o),zn.applyMatrix4(t.matrixWorld),this.expandByPoint(zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bo.copy(n.boundingBox)),Bo.applyMatrix4(t.matrixWorld),this.union(Bo)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,zn),zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),Go.subVectors(this.max,Wr),Ds.subVectors(t.a,Wr),Is.subVectors(t.b,Wr),Ns.subVectors(t.c,Wr),Ii.subVectors(Is,Ds),Ni.subVectors(Ns,Is),ss.subVectors(Ds,Ns);let e=[0,-Ii.z,Ii.y,0,-Ni.z,Ni.y,0,-ss.z,ss.y,Ii.z,0,-Ii.x,Ni.z,0,-Ni.x,ss.z,0,-ss.x,-Ii.y,Ii.x,0,-Ni.y,Ni.x,0,-ss.y,ss.x,0];return!jc(e,Ds,Is,Ns,Go)||(e=[1,0,0,0,1,0,0,0,1],!jc(e,Ds,Is,Ns,Go))?!1:(Ho.crossVectors(Ii,Ni),e=[Ho.x,Ho.y,Ho.z],jc(e,Ds,Is,Ns,Go))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(di),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const di=[new E,new E,new E,new E,new E,new E,new E,new E],zn=new E,Bo=new Ee,Ds=new E,Is=new E,Ns=new E,Ii=new E,Ni=new E,ss=new E,Wr=new E,Go=new E,Ho=new E,rs=new E;function jc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){rs.fromArray(i,r);const a=s.x*Math.abs(rs.x)+s.y*Math.abs(rs.y)+s.z*Math.abs(rs.z),c=t.dot(rs),l=e.dot(rs),u=n.dot(rs);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const M1=new Ee,Xr=new E,$c=new E;class En{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):M1.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);const e=Xr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):($c.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add($c)),this.expandByPoint(Xr.copy(t.center).sub($c))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const fi=new E,qc=new E,Vo=new E,Oi=new E,Yc=new E,Wo=new E,Kc=new E;class Nr{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fi.copy(this.origin).addScaledVector(this.direction,e),fi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){qc.copy(t).add(e).multiplyScalar(.5),Vo.copy(e).sub(t).normalize(),Oi.copy(this.origin).sub(qc);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Vo),a=Oi.dot(this.direction),c=-Oi.dot(Vo),l=Oi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,m;if(u>0)if(h=o*c-a,d=o*a-c,m=r*u,h>=0)if(d>=-m)if(d<=m){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-m?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l):d<=m?(h=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(qc).addScaledVector(Vo,d),f}intersectSphere(t,e){fi.subVectors(t.center,this.origin);const n=fi.dot(this.direction),s=fi.dot(fi)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,fi)!==null}intersectTriangle(t,e,n,s,r){Yc.subVectors(e,t),Wo.subVectors(n,t),Kc.crossVectors(Yc,Wo);let o=this.direction.dot(Kc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Oi.subVectors(this.origin,t);const c=a*this.direction.dot(Wo.crossVectors(Oi,Wo));if(c<0)return null;const l=a*this.direction.dot(Yc.cross(Oi));if(l<0||c+l>o)return null;const u=-a*Oi.dot(Kc);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pt{constructor(t,e,n,s,r,o,a,c,l,u,h,d,f,m,_,g){Pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,u,h,d,f,m,_,g)}set(t,e,n,s,r,o,a,c,l,u,h,d,f,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Os.setFromMatrixColumn(t,0).length(),r=1/Os.setFromMatrixColumn(t,1).length(),o=1/Os.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,m=a*u,_=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=f+m*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*u,f=c*h,m=l*u,_=l*h;e[0]=d+_*a,e[4]=m*a-f,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-m,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*u,f=c*h,m=l*u,_=l*h;e[0]=d-_*a,e[4]=-o*h,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*u,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*u,f=o*h,m=a*u,_=a*h;e[0]=c*u,e[4]=m*l-f,e[8]=d*l+_,e[1]=c*h,e[5]=_*l+d,e[9]=f*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,m=a*c,_=a*l;e[0]=c*u,e[4]=_-d*h,e[8]=m*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=f*h+m,e[10]=d-_*h}else if(t.order==="XZY"){const d=o*c,f=o*l,m=a*c,_=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+_,e[5]=o*u,e[9]=f*h-m,e[2]=m*h-f,e[6]=a*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(b1,t,S1)}lookAt(t,e,n){const s=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Fi.crossVectors(n,vn),Fi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Fi.crossVectors(n,vn)),Fi.normalize(),Xo.crossVectors(vn,Fi),s[0]=Fi.x,s[4]=Xo.x,s[8]=vn.x,s[1]=Fi.y,s[5]=Xo.y,s[9]=vn.y,s[2]=Fi.z,s[6]=Xo.z,s[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],f=n[13],m=n[2],_=n[6],g=n[10],p=n[14],y=n[3],v=n[7],x=n[11],M=n[15],S=s[0],T=s[4],I=s[8],b=s[12],w=s[1],O=s[5],G=s[9],$=s[13],R=s[2],F=s[6],H=s[10],U=s[14],B=s[3],Y=s[7],X=s[11],tt=s[15];return r[0]=o*S+a*w+c*R+l*B,r[4]=o*T+a*O+c*F+l*Y,r[8]=o*I+a*G+c*H+l*X,r[12]=o*b+a*$+c*U+l*tt,r[1]=u*S+h*w+d*R+f*B,r[5]=u*T+h*O+d*F+f*Y,r[9]=u*I+h*G+d*H+f*X,r[13]=u*b+h*$+d*U+f*tt,r[2]=m*S+_*w+g*R+p*B,r[6]=m*T+_*O+g*F+p*Y,r[10]=m*I+_*G+g*H+p*X,r[14]=m*b+_*$+g*U+p*tt,r[3]=y*S+v*w+x*R+M*B,r[7]=y*T+v*O+x*F+M*Y,r[11]=y*I+v*G+x*H+M*X,r[15]=y*b+v*$+x*U+M*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+r*c*h-s*l*h-r*a*d+n*l*d+s*a*f-n*c*f)+_*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*u-r*c*u)+g*(+e*l*h-e*a*f-r*o*h+n*o*f+r*a*u-n*l*u)+p*(-s*a*u-e*c*h+e*a*d+s*o*h-n*o*d+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],y=h*g*l-_*d*l+_*c*f-a*g*f-h*c*p+a*d*p,v=m*d*l-u*g*l-m*c*f+o*g*f+u*c*p-o*d*p,x=u*_*l-m*h*l+m*a*f-o*_*f-u*a*p+o*h*p,M=m*h*c-u*_*c-m*a*d+o*_*d+u*a*g-o*h*g,S=e*y+n*v+s*x+r*M;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=y*T,t[1]=(_*d*r-h*g*r-_*s*f+n*g*f+h*s*p-n*d*p)*T,t[2]=(a*g*r-_*c*r+_*s*l-n*g*l-a*s*p+n*c*p)*T,t[3]=(h*c*r-a*d*r-h*s*l+n*d*l+a*s*f-n*c*f)*T,t[4]=v*T,t[5]=(u*g*r-m*d*r+m*s*f-e*g*f-u*s*p+e*d*p)*T,t[6]=(m*c*r-o*g*r-m*s*l+e*g*l+o*s*p-e*c*p)*T,t[7]=(o*d*r-u*c*r+u*s*l-e*d*l-o*s*f+e*c*f)*T,t[8]=x*T,t[9]=(m*h*r-u*_*r-m*n*f+e*_*f+u*n*p-e*h*p)*T,t[10]=(o*_*r-m*a*r+m*n*l-e*_*l-o*n*p+e*a*p)*T,t[11]=(u*a*r-o*h*r-u*n*l+e*h*l+o*n*f-e*a*f)*T,t[12]=M*T,t[13]=(u*_*s-m*h*s+m*n*d-e*_*d-u*n*g+e*h*g)*T,t[14]=(m*a*s-o*_*s-m*n*c+e*_*c+o*n*g-e*a*g)*T,t[15]=(o*h*s-u*a*s+u*n*c-e*h*c-o*n*d+e*a*d)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,h=a+a,d=r*l,f=r*u,m=r*h,_=o*u,g=o*h,p=a*h,y=c*l,v=c*u,x=c*h,M=n.x,S=n.y,T=n.z;return s[0]=(1-(_+p))*M,s[1]=(f+x)*M,s[2]=(m-v)*M,s[3]=0,s[4]=(f-x)*S,s[5]=(1-(d+p))*S,s[6]=(g+y)*S,s[7]=0,s[8]=(m+v)*T,s[9]=(g-y)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Os.set(s[0],s[1],s[2]).length();const o=Os.set(s[4],s[5],s[6]).length(),a=Os.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],kn.copy(this);const l=1/r,u=1/o,h=1/a;return kn.elements[0]*=l,kn.elements[1]*=l,kn.elements[2]*=l,kn.elements[4]*=u,kn.elements[5]*=u,kn.elements[6]*=u,kn.elements[8]*=h,kn.elements[9]*=h,kn.elements[10]*=h,e.setFromRotationMatrix(kn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Si){const c=this.elements,l=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),d=(n+s)/(n-s);let f,m;if(a===Si)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===Wa)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Si){const c=this.elements,l=1/(e-t),u=1/(n-s),h=1/(o-r),d=(e+t)*l,f=(n+s)*u;let m,_;if(a===Si)m=(o+r)*h,_=-2*h;else if(a===Wa)m=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Os=new E,kn=new Pt,b1=new E(0,0,0),S1=new E(1,1,1),Fi=new E,Xo=new E,vn=new E,fd=new Pt,pd=new qn;class oc{constructor(t=0,e=0,n=0,s=oc.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Be(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Be(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Be(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Be(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Be(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return fd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return pd.setFromEuler(this),this.setFromQuaternion(pd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oc.DEFAULT_ORDER="XYZ";class Tu{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let w1=0;const md=new E,Fs=new qn,pi=new Pt,jo=new E,jr=new E,E1=new E,T1=new qn,gd=new E(1,0,0),_d=new E(0,1,0),yd=new E(0,0,1),A1={type:"added"},C1={type:"removed"};class Ae extends Ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:w1++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ae.DEFAULT_UP.clone();const t=new E,e=new oc,n=new qn,s=new E(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Pt},normalMatrix:{value:new te}}),this.matrix=new Pt,this.matrixWorld=new Pt,this.matrixAutoUpdate=Ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Tu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fs.setFromAxisAngle(t,e),this.quaternion.multiply(Fs),this}rotateOnWorldAxis(t,e){return Fs.setFromAxisAngle(t,e),this.quaternion.premultiply(Fs),this}rotateX(t){return this.rotateOnAxis(gd,t)}rotateY(t){return this.rotateOnAxis(_d,t)}rotateZ(t){return this.rotateOnAxis(yd,t)}translateOnAxis(t,e){return md.copy(t).applyQuaternion(this.quaternion),this.position.add(md.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(gd,t)}translateY(t){return this.translateOnAxis(_d,t)}translateZ(t){return this.translateOnAxis(yd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?jo.copy(t):jo.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),jr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(jr,jo,this.up):pi.lookAt(jo,jr,this.up),this.quaternion.setFromRotationMatrix(pi),s&&(pi.extractRotation(s.matrixWorld),Fs.setFromRotationMatrix(pi),this.quaternion.premultiply(Fs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(A1)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(C1)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),pi.multiply(t.parent.matrixWorld)),t.applyMatrix4(pi),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jr,t,E1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jr,T1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ae.DEFAULT_UP=new E(0,1,0);Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bn=new E,mi=new E,Zc=new E,gi=new E,Us=new E,zs=new E,vd=new E,Jc=new E,Qc=new E,tl=new E;let $o=!1;class Dn{constructor(t=new E,e=new E,n=new E){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Bn.subVectors(t,e),s.cross(Bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Bn.subVectors(s,e),mi.subVectors(n,e),Zc.subVectors(t,e);const o=Bn.dot(Bn),a=Bn.dot(mi),c=Bn.dot(Zc),l=mi.dot(mi),u=mi.dot(Zc),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,m=(o*u-a*c)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getUV(t,e,n,s,r,o,a,c){return $o===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$o=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,gi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,gi.x),c.addScaledVector(o,gi.y),c.addScaledVector(a,gi.z),c)}static isFrontFacing(t,e,n,s){return Bn.subVectors(n,e),mi.subVectors(t,e),Bn.cross(mi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),Bn.cross(mi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Dn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return $o===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$o=!0),Dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return Dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Us.subVectors(s,n),zs.subVectors(r,n),Jc.subVectors(t,n);const c=Us.dot(Jc),l=zs.dot(Jc);if(c<=0&&l<=0)return e.copy(n);Qc.subVectors(t,s);const u=Us.dot(Qc),h=zs.dot(Qc);if(u>=0&&h<=u)return e.copy(s);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(n).addScaledVector(Us,o);tl.subVectors(t,r);const f=Us.dot(tl),m=zs.dot(tl);if(m>=0&&f<=m)return e.copy(r);const _=f*l-c*m;if(_<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(n).addScaledVector(zs,a);const g=u*m-f*h;if(g<=0&&h-u>=0&&f-m>=0)return vd.subVectors(r,s),a=(h-u)/(h-u+(f-m)),e.copy(s).addScaledVector(vd,a);const p=1/(g+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Us,o).addScaledVector(zs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ff={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},qo={h:0,s:0,l:0};function el(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class At{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=Eu(t,1),e=Be(e,0,1),n=Be(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=el(o,r,t+1/3),this.g=el(o,r,t),this.b=el(o,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=be){const n=Ff[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}copyLinearToSRGB(t){return this.r=Vc(t.r),this.g=Vc(t.g),this.b=Vc(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=be){return he.fromWorkingColorSpace(sn.copy(this),t),Math.round(Be(sn.r*255,0,255))*65536+Math.round(Be(sn.g*255,0,255))*256+Math.round(Be(sn.b*255,0,255))}getHexString(t=be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace(sn.copy(this),e);const n=sn.r,s=sn.g,r=sn.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace(sn.copy(this),e),t.r=sn.r,t.g=sn.g,t.b=sn.b,t}getStyle(t=be){he.fromWorkingColorSpace(sn.copy(this),t);const e=sn.r,n=sn.g,s=sn.b;return t!==be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ui),this.setHSL(Ui.h+t,Ui.s+e,Ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ui),t.getHSL(qo);const n=ao(Ui.h,qo.h,e),s=ao(Ui.s,qo.s,e),r=ao(Ui.l,qo.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new At;At.NAMES=Ff;let P1=0;class On extends Ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:P1++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=ar,this.side=ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ol,this.blendDst=Fl,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new At(0,0,0),this.blendAlpha=0,this.depthFunc=ka,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=od,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ar&&(n.blending=this.blending),this.side!==ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ol&&(n.blendSrc=this.blendSrc),this.blendDst!==Fl&&(n.blendDst=this.blendDst),this.blendEquation!==us&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ka&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==od&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ei extends On{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new At(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ue=new E,Yo=new ht;class Pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Yo.fromBufferAttribute(this,e),Yo.applyMatrix3(t),this.setXY(e,Yo.x,Yo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Qn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Qn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Qn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Qn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Qn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gl&&(t.usage=this.usage),t}}class Uf extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class zf extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class xe extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let R1=0;const An=new Pt,nl=new Ae,ks=new E,xn=new Ee,$r=new Ee,$e=new E;class ce extends Ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:R1++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Df(t)?zf:Uf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new te().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return nl.lookAt(t),nl.updateMatrix(),this.applyMatrix4(nl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ks).negate(),this.translate(ks.x,ks.y,ks.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new xe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ee);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];xn.setFromBufferAttribute(r),this.morphTargetsRelative?($e.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint($e),$e.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint($e)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new En);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new E,1/0);return}if(t){const n=this.boundingSphere.center;if(xn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];$r.setFromBufferAttribute(a),this.morphTargetsRelative?($e.addVectors(xn.min,$r.min),xn.expandByPoint($e),$e.addVectors(xn.max,$r.max),xn.expandByPoint($e)):(xn.expandByPoint($r.min),xn.expandByPoint($r.max))}xn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)$e.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared($e));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)$e.fromBufferAttribute(a,l),c&&(ks.fromBufferAttribute(t,l),$e.add(ks)),s=Math.max(s,n.distanceToSquared($e))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],u=[];for(let w=0;w<a;w++)l[w]=new E,u[w]=new E;const h=new E,d=new E,f=new E,m=new ht,_=new ht,g=new ht,p=new E,y=new E;function v(w,O,G){h.fromArray(s,w*3),d.fromArray(s,O*3),f.fromArray(s,G*3),m.fromArray(o,w*2),_.fromArray(o,O*2),g.fromArray(o,G*2),d.sub(h),f.sub(h),_.sub(m),g.sub(m);const $=1/(_.x*g.y-g.x*_.y);isFinite($)&&(p.copy(d).multiplyScalar(g.y).addScaledVector(f,-_.y).multiplyScalar($),y.copy(f).multiplyScalar(_.x).addScaledVector(d,-g.x).multiplyScalar($),l[w].add(p),l[O].add(p),l[G].add(p),u[w].add(y),u[O].add(y),u[G].add(y))}let x=this.groups;x.length===0&&(x=[{start:0,count:n.length}]);for(let w=0,O=x.length;w<O;++w){const G=x[w],$=G.start,R=G.count;for(let F=$,H=$+R;F<H;F+=3)v(n[F+0],n[F+1],n[F+2])}const M=new E,S=new E,T=new E,I=new E;function b(w){T.fromArray(r,w*3),I.copy(T);const O=l[w];M.copy(O),M.sub(T.multiplyScalar(T.dot(O))).normalize(),S.crossVectors(I,O);const $=S.dot(u[w])<0?-1:1;c[w*4]=M.x,c[w*4+1]=M.y,c[w*4+2]=M.z,c[w*4+3]=$}for(let w=0,O=x.length;w<O;++w){const G=x[w],$=G.start,R=G.count;for(let F=$,H=$+R;F<H;F+=3)b(n[F+0]),b(n[F+1]),b(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new E,r=new E,o=new E,a=new E,c=new E,l=new E,u=new E,h=new E;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),a.add(u),c.add(u),l.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)$e.fromBufferAttribute(t,e),$e.normalize(),t.setXYZ(e,$e.x,$e.y,$e.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,m=0;for(let _=0,g=c.length;_<g;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*u;for(let p=0;p<u;p++)d[m++]=l[f++]}return new Pe(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ce,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],h=r[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xd=new Pt,os=new Nr,Ko=new En,Md=new E,Bs=new E,Gs=new E,Hs=new E,il=new E,Zo=new E,Jo=new ht,Qo=new ht,ta=new ht,bd=new E,Sd=new E,wd=new E,ea=new E,na=new E;class Oe extends Ae{constructor(t=new ce,e=new ei){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Zo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],h=r[c];u!==0&&(il.fromBufferAttribute(h,t),o?Zo.addScaledVector(il,u):Zo.addScaledVector(il.sub(e),u))}e.add(Zo)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ko.copy(n.boundingSphere),Ko.applyMatrix4(r),os.copy(t.ray).recast(t.near),!(Ko.containsPoint(os.origin)===!1&&(os.intersectSphere(Ko,Md)===null||os.origin.distanceToSquared(Md)>(t.far-t.near)**2))&&(xd.copy(r).invert(),os.copy(t.ray).applyMatrix4(xd),!(n.boundingBox!==null&&os.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,os)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),v=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,M=v;x<M;x+=3){const S=a.getX(x),T=a.getX(x+1),I=a.getX(x+2);s=ia(this,p,t,n,l,u,h,S,T,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=a.getX(g),v=a.getX(g+1),x=a.getX(g+2);s=ia(this,o,t,n,l,u,h,y,v,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),v=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,M=v;x<M;x+=3){const S=x,T=x+1,I=x+2;s=ia(this,p,t,n,l,u,h,S,T,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=g,v=g+1,x=g+2;s=ia(this,o,t,n,l,u,h,y,v,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function L1(i,t,e,n,s,r,o,a){let c;if(t.side===_n?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===ai,a),c===null)return null;na.copy(a),na.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(na);return l<e.near||l>e.far?null:{distance:l,point:na.clone(),object:i}}function ia(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Bs),i.getVertexPosition(c,Gs),i.getVertexPosition(l,Hs);const u=L1(i,t,e,n,Bs,Gs,Hs,ea);if(u){s&&(Jo.fromBufferAttribute(s,a),Qo.fromBufferAttribute(s,c),ta.fromBufferAttribute(s,l),u.uv=Dn.getInterpolation(ea,Bs,Gs,Hs,Jo,Qo,ta,new ht)),r&&(Jo.fromBufferAttribute(r,a),Qo.fromBufferAttribute(r,c),ta.fromBufferAttribute(r,l),u.uv1=Dn.getInterpolation(ea,Bs,Gs,Hs,Jo,Qo,ta,new ht),u.uv2=u.uv1),o&&(bd.fromBufferAttribute(o,a),Sd.fromBufferAttribute(o,c),wd.fromBufferAttribute(o,l),u.normal=Dn.getInterpolation(ea,Bs,Gs,Hs,bd,Sd,wd,new E),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:l,normal:new E,materialIndex:0};Dn.getNormal(Bs,Gs,Hs,h.normal),u.face=h}return u}class Eo extends ce{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new xe(l,3)),this.setAttribute("normal",new xe(u,3)),this.setAttribute("uv",new xe(h,2));function m(_,g,p,y,v,x,M,S,T,I,b){const w=x/T,O=M/I,G=x/2,$=M/2,R=S/2,F=T+1,H=I+1;let U=0,B=0;const Y=new E;for(let X=0;X<H;X++){const tt=X*O-$;for(let et=0;et<F;et++){const j=et*w-G;Y[_]=j*y,Y[g]=tt*v,Y[p]=R,l.push(Y.x,Y.y,Y.z),Y[_]=0,Y[g]=0,Y[p]=S>0?1:-1,u.push(Y.x,Y.y,Y.z),h.push(et/T),h.push(1-X/I),U+=1}}for(let X=0;X<I;X++)for(let tt=0;tt<T;tt++){const et=d+tt+F*X,j=d+tt+F*(X+1),Q=d+(tt+1)+F*(X+1),st=d+(tt+1)+F*X;c.push(et,j,st),c.push(j,Q,st),B+=6}a.addGroup(f,B,b),f+=B,d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function vr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function cn(i){const t={};for(let e=0;e<i.length;e++){const n=vr(i[e]);for(const s in n)t[s]=n[s]}return t}function D1(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kf(i){return i.getRenderTarget()===null?i.outputColorSpace:he.workingColorSpace}const Au={clone:vr,merge:cn};var I1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,N1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ci extends On{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=I1,this.fragmentShader=N1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=vr(t.uniforms),this.uniformsGroups=D1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Bf extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pt,this.projectionMatrix=new Pt,this.projectionMatrixInverse=new Pt,this.coordinateSystem=Si}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rn extends Bf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=yr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(oo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return yr*2*Math.atan(Math.tan(oo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(oo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vs=-90,Ws=1;class O1 extends Ae{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(Vs,Ws,t,e);s.layers=this.layers,this.add(s);const r=new rn(Vs,Ws,t,e);r.layers=this.layers,this.add(r);const o=new rn(Vs,Ws,t,e);o.layers=this.layers,this.add(o);const a=new rn(Vs,Ws,t,e);a.layers=this.layers,this.add(a);const c=new rn(Vs,Ws,t,e);c.layers=this.layers,this.add(c);const l=new rn(Vs,Ws,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Wa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Gf extends Ye{constructor(t,e,n,s,r,o,a,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:pr,super(t,e,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class F1 extends Ss{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(co("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===_s?be:Nn),this.texture=new Gf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:fn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Eo(5,5,5),r=new Ci({name:"CubemapFromEquirect",uniforms:vr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:_n,blending:Xi});r.uniforms.tEquirect.value=e;const o=new Oe(s,r),a=e.minFilter;return e.minFilter===bs&&(e.minFilter=fn),new O1(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const sl=new E,U1=new E,z1=new te;class Bi{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=sl.subVectors(n,e).cross(U1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(sl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||z1.getNormalMatrix(t),s=this.coplanarPoint(sl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const as=new En,sa=new E;class Cu{constructor(t=new Bi,e=new Bi,n=new Bi,s=new Bi,r=new Bi,o=new Bi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Si){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],u=s[5],h=s[6],d=s[7],f=s[8],m=s[9],_=s[10],g=s[11],p=s[12],y=s[13],v=s[14],x=s[15];if(n[0].setComponents(c-r,d-l,g-f,x-p).normalize(),n[1].setComponents(c+r,d+l,g+f,x+p).normalize(),n[2].setComponents(c+o,d+u,g+m,x+y).normalize(),n[3].setComponents(c-o,d-u,g-m,x-y).normalize(),n[4].setComponents(c-a,d-h,g-_,x-v).normalize(),e===Si)n[5].setComponents(c+a,d+h,g+_,x+v).normalize();else if(e===Wa)n[5].setComponents(a,h,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),as.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),as.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(as)}intersectsSprite(t){return as.center.set(0,0,0),as.radius=.7071067811865476,as.applyMatrix4(t.matrixWorld),this.intersectsSphere(as)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(sa.x=s.normal.x>0?t.max.x:t.min.x,sa.y=s.normal.y>0?t.max.y:t.min.y,sa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(sa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Hf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function k1(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,u){const h=l.array,d=l.usage,f=h.byteLength,m=i.createBuffer();i.bindBuffer(u,m),i.bufferData(u,h,d),l.onUploadCallback();let _;if(h instanceof Float32Array)_=i.FLOAT;else if(h instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=i.SHORT;else if(h instanceof Uint32Array)_=i.UNSIGNED_INT;else if(h instanceof Int32Array)_=i.INT;else if(h instanceof Int8Array)_=i.BYTE;else if(h instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,u,h){const d=u.array,f=u._updateRange,m=u.updateRanges;if(i.bindBuffer(h,l),f.count===-1&&m.length===0&&i.bufferSubData(h,0,d),m.length!==0){for(let _=0,g=m.length;_<g;_++){const p=m[_];e?i.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}u.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),u.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);u&&(i.deleteBuffer(u.buffer),n.delete(l))}function c(l,u){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);if(h===void 0)n.set(l,s(l,u));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,l,u),h.version=l.version}}return{get:o,remove:a,update:c}}class Pu extends ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,h=t/a,d=e/c,f=[],m=[],_=[],g=[];for(let p=0;p<u;p++){const y=p*d-o;for(let v=0;v<l;v++){const x=v*h-r;m.push(x,-y,0),_.push(0,0,1),g.push(v/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<a;y++){const v=y+l*p,x=y+l*(p+1),M=y+1+l*(p+1),S=y+1+l*p;f.push(v,x,S),f.push(x,M,S)}this.setIndex(f),this.setAttribute("position",new xe(m,3)),this.setAttribute("normal",new xe(_,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pu(t.width,t.height,t.widthSegments,t.heightSegments)}}var B1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,G1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,H1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,V1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,W1=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,X1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,q1=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Y1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,K1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Z1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,J1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Q1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,t2=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,e2=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,n2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,i2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,s2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,r2=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,o2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,a2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,c2=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,l2=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,u2=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,h2=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,d2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,f2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,p2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,m2=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,g2="gl_FragColor = linearToOutputTexel( gl_FragColor );",_2=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,y2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,v2=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,x2=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,M2=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,b2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,S2=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,w2=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,E2=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,T2=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,A2=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,C2=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,P2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,R2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,L2=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,D2=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,I2=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,N2=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,O2=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,F2=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,U2=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,z2=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,k2=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,B2=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,G2=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,H2=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,V2=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,W2=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,X2=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,j2=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,$2=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,q2=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y2=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,K2=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Z2=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,J2=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Q2=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,t_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,e_=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,n_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,i_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,s_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,r_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,c_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,l_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,u_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,d_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,f_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,p_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,m_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,g_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,__=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,y_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,v_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,x_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,M_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,b_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,S_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,w_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,E_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,T_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,A_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,C_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,P_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,R_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,L_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,D_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,I_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,N_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,O_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,F_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,U_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,z_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const k_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,B_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,j_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,$_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,q_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,K_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,J_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Q_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ty=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ey=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ny=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ry=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,oy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ay=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ly=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,uy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,py=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,my=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_y=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kt={alphahash_fragment:B1,alphahash_pars_fragment:G1,alphamap_fragment:H1,alphamap_pars_fragment:V1,alphatest_fragment:W1,alphatest_pars_fragment:X1,aomap_fragment:j1,aomap_pars_fragment:$1,batching_pars_vertex:q1,batching_vertex:Y1,begin_vertex:K1,beginnormal_vertex:Z1,bsdfs:J1,iridescence_fragment:Q1,bumpmap_pars_fragment:t2,clipping_planes_fragment:e2,clipping_planes_pars_fragment:n2,clipping_planes_pars_vertex:i2,clipping_planes_vertex:s2,color_fragment:r2,color_pars_fragment:o2,color_pars_vertex:a2,color_vertex:c2,common:l2,cube_uv_reflection_fragment:u2,defaultnormal_vertex:h2,displacementmap_pars_vertex:d2,displacementmap_vertex:f2,emissivemap_fragment:p2,emissivemap_pars_fragment:m2,colorspace_fragment:g2,colorspace_pars_fragment:_2,envmap_fragment:y2,envmap_common_pars_fragment:v2,envmap_pars_fragment:x2,envmap_pars_vertex:M2,envmap_physical_pars_fragment:I2,envmap_vertex:b2,fog_vertex:S2,fog_pars_vertex:w2,fog_fragment:E2,fog_pars_fragment:T2,gradientmap_pars_fragment:A2,lightmap_fragment:C2,lightmap_pars_fragment:P2,lights_lambert_fragment:R2,lights_lambert_pars_fragment:L2,lights_pars_begin:D2,lights_toon_fragment:N2,lights_toon_pars_fragment:O2,lights_phong_fragment:F2,lights_phong_pars_fragment:U2,lights_physical_fragment:z2,lights_physical_pars_fragment:k2,lights_fragment_begin:B2,lights_fragment_maps:G2,lights_fragment_end:H2,logdepthbuf_fragment:V2,logdepthbuf_pars_fragment:W2,logdepthbuf_pars_vertex:X2,logdepthbuf_vertex:j2,map_fragment:$2,map_pars_fragment:q2,map_particle_fragment:Y2,map_particle_pars_fragment:K2,metalnessmap_fragment:Z2,metalnessmap_pars_fragment:J2,morphcolor_vertex:Q2,morphnormal_vertex:t_,morphtarget_pars_vertex:e_,morphtarget_vertex:n_,normal_fragment_begin:i_,normal_fragment_maps:s_,normal_pars_fragment:r_,normal_pars_vertex:o_,normal_vertex:a_,normalmap_pars_fragment:c_,clearcoat_normal_fragment_begin:l_,clearcoat_normal_fragment_maps:u_,clearcoat_pars_fragment:h_,iridescence_pars_fragment:d_,opaque_fragment:f_,packing:p_,premultiplied_alpha_fragment:m_,project_vertex:g_,dithering_fragment:__,dithering_pars_fragment:y_,roughnessmap_fragment:v_,roughnessmap_pars_fragment:x_,shadowmap_pars_fragment:M_,shadowmap_pars_vertex:b_,shadowmap_vertex:S_,shadowmask_pars_fragment:w_,skinbase_vertex:E_,skinning_pars_vertex:T_,skinning_vertex:A_,skinnormal_vertex:C_,specularmap_fragment:P_,specularmap_pars_fragment:R_,tonemapping_fragment:L_,tonemapping_pars_fragment:D_,transmission_fragment:I_,transmission_pars_fragment:N_,uv_pars_fragment:O_,uv_pars_vertex:F_,uv_vertex:U_,worldpos_vertex:z_,background_vert:k_,background_frag:B_,backgroundCube_vert:G_,backgroundCube_frag:H_,cube_vert:V_,cube_frag:W_,depth_vert:X_,depth_frag:j_,distanceRGBA_vert:$_,distanceRGBA_frag:q_,equirect_vert:Y_,equirect_frag:K_,linedashed_vert:Z_,linedashed_frag:J_,meshbasic_vert:Q_,meshbasic_frag:ty,meshlambert_vert:ey,meshlambert_frag:ny,meshmatcap_vert:iy,meshmatcap_frag:sy,meshnormal_vert:ry,meshnormal_frag:oy,meshphong_vert:ay,meshphong_frag:cy,meshphysical_vert:ly,meshphysical_frag:uy,meshtoon_vert:hy,meshtoon_frag:dy,points_vert:fy,points_frag:py,shadow_vert:my,shadow_frag:gy,sprite_vert:_y,sprite_frag:yy},ft={common:{diffuse:{value:new At(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new At(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new At(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new At(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},pn={basic:{uniforms:cn([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:cn([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new At(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:cn([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new At(0)},specular:{value:new At(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:cn([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new At(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:cn([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new At(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:cn([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:cn([ft.points,ft.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:cn([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:cn([ft.common,ft.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:cn([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:cn([ft.sprite,ft.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:cn([ft.common,ft.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:cn([ft.lights,ft.fog,{color:{value:new At(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};pn.physical={uniforms:cn([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new At(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new At(0)},specularColor:{value:new At(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ra={r:0,b:0,g:0};function vy(i,t,e,n,s,r,o){const a=new At(0);let c=r===!0?0:1,l,u,h=null,d=0,f=null;function m(g,p){let y=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?_(a,c):v&&v.isColor&&(_(v,1),y=!0);const x=i.xr.getEnvironmentBlendMode();x==="additive"?n.buffers.color.setClear(0,0,0,1,o):x==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===sc)?(u===void 0&&(u=new Oe(new Eo(1,1,1),new Ci({name:"BackgroundCubeMaterial",uniforms:vr(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(M,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,u.material.toneMapped=he.getTransfer(v.colorSpace)!==Me,(h!==v||d!==v.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=v,d=v.version,f=i.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Oe(new Pu(2,2),new Ci({name:"BackgroundMaterial",uniforms:vr(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=he.getTransfer(v.colorSpace)!==Me,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,f=i.toneMapping),l.layers.enableAll(),g.unshift(l,l.geometry,l.material,0,0,null))}function _(g,p){g.getRGB(ra,kf(i)),n.buffers.color.setClear(ra.r,ra.g,ra.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(g,p=1){a.set(g),c=p,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(g){c=g,_(a,c)},render:m}}function xy(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=g(null);let l=c,u=!1;function h(R,F,H,U,B){let Y=!1;if(o){const X=_(U,H,F);l!==X&&(l=X,f(l.object)),Y=p(R,U,H,B),Y&&y(R,U,H,B)}else{const X=F.wireframe===!0;(l.geometry!==U.id||l.program!==H.id||l.wireframe!==X)&&(l.geometry=U.id,l.program=H.id,l.wireframe=X,Y=!0)}B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(Y||u)&&(u=!1,I(R,F,H,U),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(R){return n.isWebGL2?i.bindVertexArray(R):r.bindVertexArrayOES(R)}function m(R){return n.isWebGL2?i.deleteVertexArray(R):r.deleteVertexArrayOES(R)}function _(R,F,H){const U=H.wireframe===!0;let B=a[R.id];B===void 0&&(B={},a[R.id]=B);let Y=B[F.id];Y===void 0&&(Y={},B[F.id]=Y);let X=Y[U];return X===void 0&&(X=g(d()),Y[U]=X),X}function g(R){const F=[],H=[],U=[];for(let B=0;B<s;B++)F[B]=0,H[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:H,attributeDivisors:U,object:R,attributes:{},index:null}}function p(R,F,H,U){const B=l.attributes,Y=F.attributes;let X=0;const tt=H.getAttributes();for(const et in tt)if(tt[et].location>=0){const Q=B[et];let st=Y[et];if(st===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(st=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(st=R.instanceColor)),Q===void 0||Q.attribute!==st||st&&Q.data!==st.data)return!0;X++}return l.attributesNum!==X||l.index!==U}function y(R,F,H,U){const B={},Y=F.attributes;let X=0;const tt=H.getAttributes();for(const et in tt)if(tt[et].location>=0){let Q=Y[et];Q===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor));const st={};st.attribute=Q,Q&&Q.data&&(st.data=Q.data),B[et]=st,X++}l.attributes=B,l.attributesNum=X,l.index=U}function v(){const R=l.newAttributes;for(let F=0,H=R.length;F<H;F++)R[F]=0}function x(R){M(R,0)}function M(R,F){const H=l.newAttributes,U=l.enabledAttributes,B=l.attributeDivisors;H[R]=1,U[R]===0&&(i.enableVertexAttribArray(R),U[R]=1),B[R]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,F),B[R]=F)}function S(){const R=l.newAttributes,F=l.enabledAttributes;for(let H=0,U=F.length;H<U;H++)F[H]!==R[H]&&(i.disableVertexAttribArray(H),F[H]=0)}function T(R,F,H,U,B,Y,X){X===!0?i.vertexAttribIPointer(R,F,H,B,Y):i.vertexAttribPointer(R,F,H,U,B,Y)}function I(R,F,H,U){if(n.isWebGL2===!1&&(R.isInstancedMesh||U.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const B=U.attributes,Y=H.getAttributes(),X=F.defaultAttributeValues;for(const tt in Y){const et=Y[tt];if(et.location>=0){let j=B[tt];if(j===void 0&&(tt==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),tt==="instanceColor"&&R.instanceColor&&(j=R.instanceColor)),j!==void 0){const Q=j.normalized,st=j.itemSize,yt=e.get(j);if(yt===void 0)continue;const Mt=yt.buffer,Nt=yt.type,W=yt.bytesPerElement,mt=n.isWebGL2===!0&&(Nt===i.INT||Nt===i.UNSIGNED_INT||j.gpuType===bf);if(j.isInterleavedBufferAttribute){const Vt=j.data,k=Vt.stride,Ft=j.offset;if(Vt.isInstancedInterleavedBuffer){for(let pt=0;pt<et.locationSize;pt++)M(et.location+pt,Vt.meshPerAttribute);R.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Vt.meshPerAttribute*Vt.count)}else for(let pt=0;pt<et.locationSize;pt++)x(et.location+pt);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let pt=0;pt<et.locationSize;pt++)T(et.location+pt,st/et.locationSize,Nt,Q,k*W,(Ft+st/et.locationSize*pt)*W,mt)}else{if(j.isInstancedBufferAttribute){for(let Vt=0;Vt<et.locationSize;Vt++)M(et.location+Vt,j.meshPerAttribute);R.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Vt=0;Vt<et.locationSize;Vt++)x(et.location+Vt);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let Vt=0;Vt<et.locationSize;Vt++)T(et.location+Vt,st/et.locationSize,Nt,Q,st*W,st/et.locationSize*Vt*W,mt)}}else if(X!==void 0){const Q=X[tt];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(et.location,Q);break;case 3:i.vertexAttrib3fv(et.location,Q);break;case 4:i.vertexAttrib4fv(et.location,Q);break;default:i.vertexAttrib1fv(et.location,Q)}}}}S()}function b(){G();for(const R in a){const F=a[R];for(const H in F){const U=F[H];for(const B in U)m(U[B].object),delete U[B];delete F[H]}delete a[R]}}function w(R){if(a[R.id]===void 0)return;const F=a[R.id];for(const H in F){const U=F[H];for(const B in U)m(U[B].object),delete U[B];delete F[H]}delete a[R.id]}function O(R){for(const F in a){const H=a[F];if(H[R.id]===void 0)continue;const U=H[R.id];for(const B in U)m(U[B].object),delete U[B];delete H[R.id]}}function G(){$(),u=!0,l!==c&&(l=c,f(l.object))}function $(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:h,reset:G,resetDefaultState:$,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfProgram:O,initAttributes:v,enableAttribute:x,disableUnusedAttributes:S}}function My(i,t,e,n){const s=n.isWebGL2;let r;function o(u){r=u}function a(u,h){i.drawArrays(r,u,h),e.update(h,r,1)}function c(u,h,d){if(d===0)return;let f,m;if(s)f=i,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,u,h,d),e.update(h,r,d)}function l(u,h,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<d;m++)this.render(u[m],h[m]);else{f.multiDrawArraysWEBGL(r,u,0,h,0,d);let m=0;for(let _=0;_<d;_++)m+=h[_];e.update(m,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function by(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),g=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,x=o||t.has("OES_texture_float"),M=v&&x,S=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:m,maxAttributes:_,maxVertexUniforms:g,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:x,floatVertexTextures:M,maxSamples:S}}function Sy(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Bi,a=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const m=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,p=i.get(h);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{const y=r?0:n,v=y*4;let x=p.clippingState||null;c.value=x,x=u(m,d,v,f);for(let M=0;M!==v;++M)x[M]=e[M];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,m){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const p=f+_*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let v=0,x=f;v!==_;++v,x+=4)o.copy(h[v]).applyMatrix4(y,a),o.normal.toArray(g,x),g[x+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function wy(i){let t=new WeakMap;function e(o,a){return a===Ul?o.mapping=pr:a===zl&&(o.mapping=mr),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ul||a===zl)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new F1(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ac extends Bf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const er=4,Ed=[.125,.215,.35,.446,.526,.582],hs=20,rl=new ac,Td=new At;let ol=null,al=0,cl=0;const ls=(1+Math.sqrt(5))/2,Xs=1/ls,Ad=[new E(1,1,1),new E(-1,1,1),new E(1,1,-1),new E(-1,1,-1),new E(0,ls,Xs),new E(0,ls,-Xs),new E(Xs,0,ls),new E(-Xs,0,ls),new E(ls,Xs,0),new E(-ls,Xs,0)];class Cd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ol=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),cl=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ld(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ol,al,cl),t.scissorTest=!1,oa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===pr||t.mapping===mr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ol=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),cl=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:po,format:Sn,colorSpace:Ve,depthBuffer:!1},s=Pd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pd(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ey(r)),this._blurMaterial=Ty(r,t,e)}return s}_compileMaterial(t){const e=new Oe(this._lodPlanes[0],t);this._renderer.compile(e,rl)}_sceneToCubeUV(t,e,n,s){const a=new rn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(Td),u.toneMapping=ji,u.autoClear=!1;const f=new ei({name:"PMREM.Background",side:_n,depthWrite:!1,depthTest:!1}),m=new Oe(new Eo,f);let _=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(Td),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):y===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const v=this._cubeSize;oa(s,y*v,p>2?v:0,v,v),u.setRenderTarget(s),_&&u.render(m,a),u.render(t,a)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===pr||t.mapping===mr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ld()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rd());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Oe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;oa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,rl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ad[(s-1)%Ad.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Oe(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*hs-1),_=r/m,g=isFinite(r)?1+Math.floor(u*_):hs;g>hs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${hs}`);const p=[];let y=0;for(let T=0;T<hs;++T){const I=T/_,b=Math.exp(-I*I/2);p.push(b),T===0?y+=b:T<g&&(y+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=m,d.mipInt.value=v-n;const x=this._sizeLods[s],M=3*x*(s>v-er?s-v+er:0),S=4*(this._cubeSize-x);oa(e,M,S,3*x,2*x),c.setRenderTarget(e),c.render(h,rl)}}function Ey(i){const t=[],e=[],n=[];let s=i;const r=i-er+1+Ed.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-er?c=Ed[o-i+er-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*f),v=new Float32Array(g*m*f),x=new Float32Array(p*m*f);for(let S=0;S<f;S++){const T=S%3*2/3-1,I=S>2?0:-1,b=[T,I,0,T+2/3,I,0,T+2/3,I+1,0,T,I,0,T+2/3,I+1,0,T,I+1,0];y.set(b,_*m*S),v.set(d,g*m*S);const w=[S,S,S,S,S,S];x.set(w,p*m*S)}const M=new ce;M.setAttribute("position",new Pe(y,_)),M.setAttribute("uv",new Pe(v,g)),M.setAttribute("faceIndex",new Pe(x,p)),t.push(M),s>er&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Pd(i,t,e){const n=new Ss(i,t,e);return n.texture.mapping=sc,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function oa(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ty(i,t,e){const n=new Float32Array(hs),s=new E(0,1,0);return new Ci({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Rd(){return new Ci({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Ld(){return new Ci({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Ru(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ay(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Ul||c===zl,u=c===pr||c===mr;if(l||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=t.get(a);return e===null&&(e=new Cd(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),t.set(a,h),h.texture}else{if(t.has(a))return t.get(a).texture;{const h=a.image;if(l&&h&&h.height>0||u&&h&&s(h)){e===null&&(e=new Cd(i));const d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Cy(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Py(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(h){const d=h.attributes;for(const m in d)t.update(d[m],i.ARRAY_BUFFER);const f=h.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],i.ARRAY_BUFFER)}}function l(h){const d=[],f=h.index,m=h.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let v=0,x=y.length;v<x;v+=3){const M=y[v+0],S=y[v+1],T=y[v+2];d.push(M,S,S,T,T,M)}}else if(m!==void 0){const y=m.array;_=m.version;for(let v=0,x=y.length/3-1;v<x;v+=3){const M=v+0,S=v+1,T=v+2;d.push(M,S,S,T,T,M)}}else return;const g=new(Df(d)?zf:Uf)(d,1);g.version=_;const p=r.get(h);p&&t.remove(p),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function Ry(i,t,e,n){const s=n.isWebGL2;let r;function o(f){r=f}let a,c;function l(f){a=f.type,c=f.bytesPerElement}function u(f,m){i.drawElements(r,m,a,f*c),e.update(m,r,1)}function h(f,m,_){if(_===0)return;let g,p;if(s)g=i,p="drawElementsInstanced";else if(g=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[p](r,m,a,f*c,_),e.update(m,r,_)}function d(f,m,_){if(_===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<_;p++)this.render(f[p]/c,m[p]);else{g.multiDrawElementsWEBGL(r,m,0,a,f,0,_);let p=0;for(let y=0;y<_;y++)p+=m[y];e.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=h,this.renderMultiDraw=d}function Ly(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Dy(i,t){return i[0]-t[0]}function Iy(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Ny(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new ue,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,u,h){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const m=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,_=m!==void 0?m.length:0;let g=r.get(u);if(g===void 0||g.count!==_){let F=function(){$.dispose(),r.delete(u),u.removeEventListener("dispose",F)};var f=F;g!==void 0&&g.texture.dispose();const v=u.morphAttributes.position!==void 0,x=u.morphAttributes.normal!==void 0,M=u.morphAttributes.color!==void 0,S=u.morphAttributes.position||[],T=u.morphAttributes.normal||[],I=u.morphAttributes.color||[];let b=0;v===!0&&(b=1),x===!0&&(b=2),M===!0&&(b=3);let w=u.attributes.position.count*b,O=1;w>t.maxTextureSize&&(O=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const G=new Float32Array(w*O*4*_),$=new Of(G,w,O,_);$.type=bi,$.needsUpdate=!0;const R=b*4;for(let H=0;H<_;H++){const U=S[H],B=T[H],Y=I[H],X=w*O*4*H;for(let tt=0;tt<U.count;tt++){const et=tt*R;v===!0&&(o.fromBufferAttribute(U,tt),G[X+et+0]=o.x,G[X+et+1]=o.y,G[X+et+2]=o.z,G[X+et+3]=0),x===!0&&(o.fromBufferAttribute(B,tt),G[X+et+4]=o.x,G[X+et+5]=o.y,G[X+et+6]=o.z,G[X+et+7]=0),M===!0&&(o.fromBufferAttribute(Y,tt),G[X+et+8]=o.x,G[X+et+9]=o.y,G[X+et+10]=o.z,G[X+et+11]=Y.itemSize===4?o.w:1)}}g={count:_,texture:$,size:new ht(w,O)},r.set(u,g),u.addEventListener("dispose",F)}let p=0;for(let v=0;v<d.length;v++)p+=d[v];const y=u.morphTargetsRelative?1:1-p;h.getUniforms().setValue(i,"morphTargetBaseInfluence",y),h.getUniforms().setValue(i,"morphTargetInfluences",d),h.getUniforms().setValue(i,"morphTargetsTexture",g.texture,e),h.getUniforms().setValue(i,"morphTargetsTextureSize",g.size)}else{const m=d===void 0?0:d.length;let _=n[u.id];if(_===void 0||_.length!==m){_=[];for(let x=0;x<m;x++)_[x]=[x,0];n[u.id]=_}for(let x=0;x<m;x++){const M=_[x];M[0]=x,M[1]=d[x]}_.sort(Iy);for(let x=0;x<8;x++)x<m&&_[x][1]?(a[x][0]=_[x][0],a[x][1]=_[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Dy);const g=u.morphAttributes.position,p=u.morphAttributes.normal;let y=0;for(let x=0;x<8;x++){const M=a[x],S=M[0],T=M[1];S!==Number.MAX_SAFE_INTEGER&&T?(g&&u.getAttribute("morphTarget"+x)!==g[S]&&u.setAttribute("morphTarget"+x,g[S]),p&&u.getAttribute("morphNormal"+x)!==p[S]&&u.setAttribute("morphNormal"+x,p[S]),s[x]=T,y+=T):(g&&u.hasAttribute("morphTarget"+x)===!0&&u.deleteAttribute("morphTarget"+x),p&&u.hasAttribute("morphNormal"+x)===!0&&u.deleteAttribute("morphNormal"+x),s[x]=0)}const v=u.morphTargetsRelative?1:1-y;h.getUniforms().setValue(i,"morphTargetBaseInfluence",v),h.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function Oy(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Vf extends Ye{constructor(t,e,n,s,r,o,a,c,l,u){if(u=u!==void 0?u:gs,u!==gs&&u!==gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===gs&&(n=Hi),n===void 0&&u===gr&&(n=ms),super(null,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:qe,this.minFilter=c!==void 0?c:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Wf=new Ye,Xf=new Vf(1,1);Xf.compareFunction=Lf;const jf=new Of,$f=new x1,qf=new Gf,Dd=[],Id=[],Nd=new Float32Array(16),Od=new Float32Array(9),Fd=new Float32Array(4);function Or(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Dd[s];if(r===void 0&&(r=new Float32Array(s),Dd[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function We(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function cc(i,t){let e=Id[t];e===void 0&&(e=new Int32Array(t),Id[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Fy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Uy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2fv(this.addr,t),Xe(e,t)}}function zy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;i.uniform3fv(this.addr,t),Xe(e,t)}}function ky(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4fv(this.addr,t),Xe(e,t)}}function By(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Fd.set(n),i.uniformMatrix2fv(this.addr,!1,Fd),Xe(e,n)}}function Gy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Od.set(n),i.uniformMatrix3fv(this.addr,!1,Od),Xe(e,n)}}function Hy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Nd.set(n),i.uniformMatrix4fv(this.addr,!1,Nd),Xe(e,n)}}function Vy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Wy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2iv(this.addr,t),Xe(e,t)}}function Xy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3iv(this.addr,t),Xe(e,t)}}function jy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4iv(this.addr,t),Xe(e,t)}}function $y(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function qy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2uiv(this.addr,t),Xe(e,t)}}function Yy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3uiv(this.addr,t),Xe(e,t)}}function Ky(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4uiv(this.addr,t),Xe(e,t)}}function Zy(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Xf:Wf;e.setTexture2D(t||r,s)}function Jy(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||$f,s)}function Qy(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||qf,s)}function tv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||jf,s)}function ev(i){switch(i){case 5126:return Fy;case 35664:return Uy;case 35665:return zy;case 35666:return ky;case 35674:return By;case 35675:return Gy;case 35676:return Hy;case 5124:case 35670:return Vy;case 35667:case 35671:return Wy;case 35668:case 35672:return Xy;case 35669:case 35673:return jy;case 5125:return $y;case 36294:return qy;case 36295:return Yy;case 36296:return Ky;case 35678:case 36198:case 36298:case 36306:case 35682:return Zy;case 35679:case 36299:case 36307:return Jy;case 35680:case 36300:case 36308:case 36293:return Qy;case 36289:case 36303:case 36311:case 36292:return tv}}function nv(i,t){i.uniform1fv(this.addr,t)}function iv(i,t){const e=Or(t,this.size,2);i.uniform2fv(this.addr,e)}function sv(i,t){const e=Or(t,this.size,3);i.uniform3fv(this.addr,e)}function rv(i,t){const e=Or(t,this.size,4);i.uniform4fv(this.addr,e)}function ov(i,t){const e=Or(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function av(i,t){const e=Or(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function cv(i,t){const e=Or(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function lv(i,t){i.uniform1iv(this.addr,t)}function uv(i,t){i.uniform2iv(this.addr,t)}function hv(i,t){i.uniform3iv(this.addr,t)}function dv(i,t){i.uniform4iv(this.addr,t)}function fv(i,t){i.uniform1uiv(this.addr,t)}function pv(i,t){i.uniform2uiv(this.addr,t)}function mv(i,t){i.uniform3uiv(this.addr,t)}function gv(i,t){i.uniform4uiv(this.addr,t)}function _v(i,t,e){const n=this.cache,s=t.length,r=cc(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Wf,r[o])}function yv(i,t,e){const n=this.cache,s=t.length,r=cc(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||$f,r[o])}function vv(i,t,e){const n=this.cache,s=t.length,r=cc(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||qf,r[o])}function xv(i,t,e){const n=this.cache,s=t.length,r=cc(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||jf,r[o])}function Mv(i){switch(i){case 5126:return nv;case 35664:return iv;case 35665:return sv;case 35666:return rv;case 35674:return ov;case 35675:return av;case 35676:return cv;case 5124:case 35670:return lv;case 35667:case 35671:return uv;case 35668:case 35672:return hv;case 35669:case 35673:return dv;case 5125:return fv;case 36294:return pv;case 36295:return mv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return _v;case 35679:case 36299:case 36307:return yv;case 35680:case 36300:case 36308:case 36293:return vv;case 36289:case 36303:case 36311:case 36292:return xv}}class bv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ev(e.type)}}class Sv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Mv(e.type)}}class wv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const ll=/(\w+)(\])?(\[|\.)?/g;function Ud(i,t){i.seq.push(t),i.map[t.id]=t}function Ev(i,t,e){const n=i.name,s=n.length;for(ll.lastIndex=0;;){const r=ll.exec(n),o=ll.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ud(e,l===void 0?new bv(a,i,t):new Sv(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new wv(a),Ud(e,h)),e=h}}}class La{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Ev(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function zd(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Tv=37297;let Av=0;function Cv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Pv(i){const t=he.getPrimaries(he.workingColorSpace),e=he.getPrimaries(i);let n;switch(t===e?n="":t===Va&&e===Ha?n="LinearDisplayP3ToLinearSRGB":t===Ha&&e===Va&&(n="LinearSRGBToLinearDisplayP3"),i){case Ve:case rc:return[n,"LinearTransferOETF"];case be:case wu:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function kd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Cv(i.getShaderSource(t),o)}else return s}function Rv(i,t){const e=Pv(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Lv(i,t){let e;switch(t){case Pg:e="Linear";break;case Rg:e="Reinhard";break;case Lg:e="OptimizedCineon";break;case vf:e="ACESFilmic";break;case Ig:e="AgX";break;case Dg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Dv(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(nr).join(`
`)}function Iv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(nr).join(`
`)}function Nv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ov(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function nr(i){return i!==""}function Bd(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Fv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wl(i){return i.replace(Fv,zv)}const Uv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function zv(i,t){let e=Kt[t];if(e===void 0){const n=Uv.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wl(e)}const kv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hd(i){return i.replace(kv,Bv)}function Bv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vd(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Gv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_f?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===yf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yi&&(t="SHADOWMAP_TYPE_VSM"),t}function Hv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case pr:case mr:t="ENVMAP_TYPE_CUBE";break;case sc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Vv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case mr:t="ENVMAP_MODE_REFRACTION";break}return t}function Wv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Mu:t="ENVMAP_BLENDING_MULTIPLY";break;case Ag:t="ENVMAP_BLENDING_MIX";break;case Cg:t="ENVMAP_BLENDING_ADD";break}return t}function Xv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function jv(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Gv(e),l=Hv(e),u=Vv(e),h=Wv(e),d=Xv(e),f=e.isWebGL2?"":Dv(e),m=Iv(e),_=Nv(r),g=s.createProgram();let p,y,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(nr).join(`
`),p.length>0&&(p+=`
`),y=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(nr).join(`
`),y.length>0&&(y+=`
`)):(p=[Vd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(nr).join(`
`),y=[f,Vd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ji?"#define TONE_MAPPING":"",e.toneMapping!==ji?Kt.tonemapping_pars_fragment:"",e.toneMapping!==ji?Lv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Rv("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(nr).join(`
`)),o=Wl(o),o=Bd(o,e),o=Gd(o,e),a=Wl(a),a=Bd(a,e),a=Gd(a,e),o=Hd(o),a=Hd(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ad?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ad?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const x=v+p+o,M=v+y+a,S=zd(s,s.VERTEX_SHADER,x),T=zd(s,s.FRAGMENT_SHADER,M);s.attachShader(g,S),s.attachShader(g,T),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function I(G){if(i.debug.checkShaderErrors){const $=s.getProgramInfoLog(g).trim(),R=s.getShaderInfoLog(S).trim(),F=s.getShaderInfoLog(T).trim();let H=!0,U=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,S,T);else{const B=kd(s,S,"vertex"),Y=kd(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Program Info Log: `+$+`
`+B+`
`+Y)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(R===""||F==="")&&(U=!1);U&&(G.diagnostics={runnable:H,programLog:$,vertexShader:{log:R,prefix:p},fragmentShader:{log:F,prefix:y}})}s.deleteShader(S),s.deleteShader(T),b=new La(s,g),w=Ov(s,g)}let b;this.getUniforms=function(){return b===void 0&&I(this),b};let w;this.getAttributes=function(){return w===void 0&&I(this),w};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(g,Tv)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Av++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=T,this}let $v=0;class qv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Yv(t),e.set(t,n)),n}}class Yv{constructor(t){this.id=$v++,this.code=t,this.usedTimes=0}}function Kv(i,t,e,n,s,r,o){const a=new Tu,c=new qv,l=[],u=s.isWebGL2,h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return b===0?"uv":`uv${b}`}function g(b,w,O,G,$){const R=G.fog,F=$.geometry,H=b.isMeshStandardMaterial?G.environment:null,U=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),B=U&&U.mapping===sc?U.image.height:null,Y=m[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const X=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,tt=X!==void 0?X.length:0;let et=0;F.morphAttributes.position!==void 0&&(et=1),F.morphAttributes.normal!==void 0&&(et=2),F.morphAttributes.color!==void 0&&(et=3);let j,Q,st,yt;if(Y){const Ie=pn[Y];j=Ie.vertexShader,Q=Ie.fragmentShader}else j=b.vertexShader,Q=b.fragmentShader,c.update(b),st=c.getVertexShaderID(b),yt=c.getFragmentShaderID(b);const Mt=i.getRenderTarget(),Nt=$.isInstancedMesh===!0,W=$.isBatchedMesh===!0,mt=!!b.map,Vt=!!b.matcap,k=!!U,Ft=!!b.aoMap,pt=!!b.lightMap,bt=!!b.bumpMap,gt=!!b.normalMap,re=!!b.displacementMap,zt=!!b.emissiveMap,P=!!b.metalnessMap,A=!!b.roughnessMap,q=b.anisotropy>0,at=b.clearcoat>0,rt=b.iridescence>0,ct=b.sheen>0,Ct=b.transmission>0,xt=q&&!!b.anisotropyMap,Tt=at&&!!b.clearcoatMap,kt=at&&!!b.clearcoatNormalMap,qt=at&&!!b.clearcoatRoughnessMap,it=rt&&!!b.iridescenceMap,le=rt&&!!b.iridescenceThicknessMap,Zt=ct&&!!b.sheenColorMap,Wt=ct&&!!b.sheenRoughnessMap,Ot=!!b.specularMap,St=!!b.specularColorMap,L=!!b.specularIntensityMap,ut=Ct&&!!b.transmissionMap,Lt=Ct&&!!b.thicknessMap,Et=!!b.gradientMap,ot=!!b.alphaMap,N=b.alphaTest>0,dt=!!b.alphaHash,vt=!!b.extensions,Gt=!!F.attributes.uv1,Ut=!!F.attributes.uv2,ee=!!F.attributes.uv3;let ne=ji;return b.toneMapped&&(Mt===null||Mt.isXRRenderTarget===!0)&&(ne=i.toneMapping),{isWebGL2:u,shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:j,fragmentShader:Q,defines:b.defines,customVertexShaderID:st,customFragmentShaderID:yt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:W,instancing:Nt,instancingColor:Nt&&$.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Mt===null?i.outputColorSpace:Mt.isXRRenderTarget===!0?Mt.texture.colorSpace:Ve,map:mt,matcap:Vt,envMap:k,envMapMode:k&&U.mapping,envMapCubeUVHeight:B,aoMap:Ft,lightMap:pt,bumpMap:bt,normalMap:gt,displacementMap:d&&re,emissiveMap:zt,normalMapObjectSpace:gt&&b.normalMapType===$g,normalMapTangentSpace:gt&&b.normalMapType===Su,metalnessMap:P,roughnessMap:A,anisotropy:q,anisotropyMap:xt,clearcoat:at,clearcoatMap:Tt,clearcoatNormalMap:kt,clearcoatRoughnessMap:qt,iridescence:rt,iridescenceMap:it,iridescenceThicknessMap:le,sheen:ct,sheenColorMap:Zt,sheenRoughnessMap:Wt,specularMap:Ot,specularColorMap:St,specularIntensityMap:L,transmission:Ct,transmissionMap:ut,thicknessMap:Lt,gradientMap:Et,opaque:b.transparent===!1&&b.blending===ar,alphaMap:ot,alphaTest:N,alphaHash:dt,combine:b.combine,mapUv:mt&&_(b.map.channel),aoMapUv:Ft&&_(b.aoMap.channel),lightMapUv:pt&&_(b.lightMap.channel),bumpMapUv:bt&&_(b.bumpMap.channel),normalMapUv:gt&&_(b.normalMap.channel),displacementMapUv:re&&_(b.displacementMap.channel),emissiveMapUv:zt&&_(b.emissiveMap.channel),metalnessMapUv:P&&_(b.metalnessMap.channel),roughnessMapUv:A&&_(b.roughnessMap.channel),anisotropyMapUv:xt&&_(b.anisotropyMap.channel),clearcoatMapUv:Tt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:kt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:qt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:le&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Zt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Wt&&_(b.sheenRoughnessMap.channel),specularMapUv:Ot&&_(b.specularMap.channel),specularColorMapUv:St&&_(b.specularColorMap.channel),specularIntensityMapUv:L&&_(b.specularIntensityMap.channel),transmissionMapUv:ut&&_(b.transmissionMap.channel),thicknessMapUv:Lt&&_(b.thicknessMap.channel),alphaMapUv:ot&&_(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(gt||q),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Gt,vertexUv2s:Ut,vertexUv3s:ee,pointsUvs:$.isPoints===!0&&!!F.attributes.uv&&(mt||ot),fog:!!R,useFog:b.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:$.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:et,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:ne,useLegacyLights:i._useLegacyLights,decodeVideoTexture:mt&&b.map.isVideoTexture===!0&&he.getTransfer(b.map.colorSpace)===Me,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===mn,flipSided:b.side===_n,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:vt&&b.extensions.derivatives===!0,extensionFragDepth:vt&&b.extensions.fragDepth===!0,extensionDrawBuffers:vt&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:vt&&b.extensions.shaderTextureLOD===!0,extensionClipCullDistance:vt&&b.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()}}function p(b){const w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(const O in b.defines)w.push(O),w.push(b.defines[O]);return b.isRawShaderMaterial===!1&&(y(w,b),v(w,b),w.push(i.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function y(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function v(b,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),b.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),b.push(a.mask)}function x(b){const w=m[b.type];let O;if(w){const G=pn[w];O=Au.clone(G.uniforms)}else O=b.uniforms;return O}function M(b,w){let O;for(let G=0,$=l.length;G<$;G++){const R=l[G];if(R.cacheKey===w){O=R,++O.usedTimes;break}}return O===void 0&&(O=new jv(i,w,b,r),l.push(O)),O}function S(b){if(--b.usedTimes===0){const w=l.indexOf(b);l[w]=l[l.length-1],l.pop(),b.destroy()}}function T(b){c.remove(b)}function I(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:M,releaseProgram:S,releaseShaderCache:T,programs:l,dispose:I}}function Zv(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Jv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Wd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Xd(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,f,m,_,g){let p=i[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:m,renderOrder:h.renderOrder,z:_,group:g},i[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=h.renderOrder,p.z=_,p.group=g),t++,p}function a(h,d,f,m,_,g){const p=o(h,d,f,m,_,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(h,d,f,m,_,g){const p=o(h,d,f,m,_,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(h,d){e.length>1&&e.sort(h||Jv),n.length>1&&n.sort(d||Wd),s.length>1&&s.sort(d||Wd)}function u(){for(let h=t,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function Qv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Xd,i.set(n,[o])):s>=r.length?(o=new Xd,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function tx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new E,color:new At};break;case"SpotLight":e={position:new E,direction:new E,color:new At,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new At,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new At,groundColor:new At};break;case"RectAreaLight":e={color:new At,position:new E,halfWidth:new E,halfHeight:new E};break}return i[t.id]=e,e}}}function ex(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let nx=0;function ix(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function sx(i,t){const e=new tx,n=ex(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new E);const r=new E,o=new Pt,a=new Pt;function c(u,h){let d=0,f=0,m=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let _=0,g=0,p=0,y=0,v=0,x=0,M=0,S=0,T=0,I=0,b=0;u.sort(ix);const w=h===!0?Math.PI:1;for(let G=0,$=u.length;G<$;G++){const R=u[G],F=R.color,H=R.intensity,U=R.distance,B=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=F.r*H*w,f+=F.g*H*w,m+=F.b*H*w;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(R.sh.coefficients[Y],H);b++}else if(R.isDirectionalLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity*w),R.castShadow){const X=R.shadow,tt=n.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,s.directionalShadow[_]=tt,s.directionalShadowMap[_]=B,s.directionalShadowMatrix[_]=R.shadow.matrix,x++}s.directional[_]=Y,_++}else if(R.isSpotLight){const Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(F).multiplyScalar(H*w),Y.distance=U,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,s.spot[p]=Y;const X=R.shadow;if(R.map&&(s.spotLightMap[T]=R.map,T++,X.updateMatrices(R),R.castShadow&&I++),s.spotLightMatrix[p]=X.matrix,R.castShadow){const tt=n.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,s.spotShadow[p]=tt,s.spotShadowMap[p]=B,S++}p++}else if(R.isRectAreaLight){const Y=e.get(R);Y.color.copy(F).multiplyScalar(H),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),s.rectArea[y]=Y,y++}else if(R.isPointLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity*w),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){const X=R.shadow,tt=n.get(R);tt.shadowBias=X.bias,tt.shadowNormalBias=X.normalBias,tt.shadowRadius=X.radius,tt.shadowMapSize=X.mapSize,tt.shadowCameraNear=X.camera.near,tt.shadowCameraFar=X.camera.far,s.pointShadow[g]=tt,s.pointShadowMap[g]=B,s.pointShadowMatrix[g]=R.shadow.matrix,M++}s.point[g]=Y,g++}else if(R.isHemisphereLight){const Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(H*w),Y.groundColor.copy(R.groundColor).multiplyScalar(H*w),s.hemi[v]=Y,v++}}y>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_FLOAT_1,s.rectAreaLTC2=ft.LTC_FLOAT_2):(s.rectAreaLTC1=ft.LTC_HALF_1,s.rectAreaLTC2=ft.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_FLOAT_1,s.rectAreaLTC2=ft.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_HALF_1,s.rectAreaLTC2=ft.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=m;const O=s.hash;(O.directionalLength!==_||O.pointLength!==g||O.spotLength!==p||O.rectAreaLength!==y||O.hemiLength!==v||O.numDirectionalShadows!==x||O.numPointShadows!==M||O.numSpotShadows!==S||O.numSpotMaps!==T||O.numLightProbes!==b)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=y,s.point.length=g,s.hemi.length=v,s.directionalShadow.length=x,s.directionalShadowMap.length=x,s.pointShadow.length=M,s.pointShadowMap.length=M,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=x,s.pointShadowMatrix.length=M,s.spotLightMatrix.length=S+T-I,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=I,s.numLightProbes=b,O.directionalLength=_,O.pointLength=g,O.spotLength=p,O.rectAreaLength=y,O.hemiLength=v,O.numDirectionalShadows=x,O.numPointShadows=M,O.numSpotShadows=S,O.numSpotMaps=T,O.numLightProbes=b,s.version=nx++)}function l(u,h){let d=0,f=0,m=0,_=0,g=0;const p=h.matrixWorldInverse;for(let y=0,v=u.length;y<v;y++){const x=u[y];if(x.isDirectionalLight){const M=s.directional[d];M.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),d++}else if(x.isSpotLight){const M=s.spot[m];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),m++}else if(x.isRectAreaLight){const M=s.rectArea[_];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),a.identity(),o.copy(x.matrixWorld),o.premultiply(p),a.extractRotation(o),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(x.isPointLight){const M=s.point[f];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){const M=s.hemi[g];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(p),g++}}}return{setup:c,setupView:l,state:s}}function jd(i,t){const e=new sx(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(h){n.push(h)}function a(h){s.push(h)}function c(h){e.setup(n,h)}function l(h){e.setupView(n,h)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function rx(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new jd(i,t),e.set(r,[c])):o>=a.length?(c=new jd(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class ox extends On{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ax extends On{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const cx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ux(i,t,e){let n=new Cu;const s=new ht,r=new ht,o=new ue,a=new ox({depthPacking:jg}),c=new ax,l={},u=e.maxTextureSize,h={[ai]:_n,[_n]:ai,[mn]:mn},d=new Ci({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:cx,fragmentShader:lx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new ce;m.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Oe(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_f;let p=this.type;this.render=function(S,T,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=i.getRenderTarget(),w=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Xi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const $=p!==yi&&this.type===yi,R=p===yi&&this.type!==yi;for(let F=0,H=S.length;F<H;F++){const U=S[F],B=U.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Y=B.getFrameExtents();if(s.multiply(Y),r.copy(B.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Y.x),s.x=r.x*Y.x,B.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Y.y),s.y=r.y*Y.y,B.mapSize.y=r.y)),B.map===null||$===!0||R===!0){const tt=this.type!==yi?{minFilter:qe,magFilter:qe}:{};B.map!==null&&B.map.dispose(),B.map=new Ss(s.x,s.y,tt),B.map.texture.name=U.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const X=B.getViewportCount();for(let tt=0;tt<X;tt++){const et=B.getViewport(tt);o.set(r.x*et.x,r.y*et.y,r.x*et.z,r.y*et.w),G.viewport(o),B.updateMatrices(U,tt),n=B.getFrustum(),x(T,I,B.camera,U,this.type)}B.isPointLightShadow!==!0&&this.type===yi&&y(B,I),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(b,w,O)};function y(S,T){const I=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ss(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,I,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,I,f,_,null)}function v(S,T,I,b){let w=null;const O=I.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(O!==void 0)w=O;else if(w=I.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const G=w.uuid,$=T.uuid;let R=l[G];R===void 0&&(R={},l[G]=R);let F=R[$];F===void 0&&(F=w.clone(),R[$]=F,T.addEventListener("dispose",M)),w=F}if(w.visible=T.visible,w.wireframe=T.wireframe,b===yi?w.side=T.shadowSide!==null?T.shadowSide:T.side:w.side=T.shadowSide!==null?T.shadowSide:h[T.side],w.alphaMap=T.alphaMap,w.alphaTest=T.alphaTest,w.map=T.map,w.clipShadows=T.clipShadows,w.clippingPlanes=T.clippingPlanes,w.clipIntersection=T.clipIntersection,w.displacementMap=T.displacementMap,w.displacementScale=T.displacementScale,w.displacementBias=T.displacementBias,w.wireframeLinewidth=T.wireframeLinewidth,w.linewidth=T.linewidth,I.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const G=i.properties.get(w);G.light=I}return w}function x(S,T,I,b,w){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===yi)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,S.matrixWorld);const $=t.update(S),R=S.material;if(Array.isArray(R)){const F=$.groups;for(let H=0,U=F.length;H<U;H++){const B=F[H],Y=R[B.materialIndex];if(Y&&Y.visible){const X=v(S,Y,b,w);S.onBeforeShadow(i,S,T,I,$,X,B),i.renderBufferDirect(I,null,$,X,S,B),S.onAfterShadow(i,S,T,I,$,X,B)}}}else if(R.visible){const F=v(S,R,b,w);S.onBeforeShadow(i,S,T,I,$,F,null),i.renderBufferDirect(I,null,$,F,S,null),S.onAfterShadow(i,S,T,I,$,F,null)}}const G=S.children;for(let $=0,R=G.length;$<R;$++)x(G[$],T,I,b,w)}function M(S){S.target.removeEventListener("dispose",M);for(const I in l){const b=l[I],w=S.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}function hx(i,t,e){const n=e.isWebGL2;function s(){let N=!1;const dt=new ue;let vt=null;const Gt=new ue(0,0,0,0);return{setMask:function(Ut){vt!==Ut&&!N&&(i.colorMask(Ut,Ut,Ut,Ut),vt=Ut)},setLocked:function(Ut){N=Ut},setClear:function(Ut,ee,ne,Le,Ie){Ie===!0&&(Ut*=Le,ee*=Le,ne*=Le),dt.set(Ut,ee,ne,Le),Gt.equals(dt)===!1&&(i.clearColor(Ut,ee,ne,Le),Gt.copy(dt))},reset:function(){N=!1,vt=null,Gt.set(-1,0,0,0)}}}function r(){let N=!1,dt=null,vt=null,Gt=null;return{setTest:function(Ut){Ut?W(i.DEPTH_TEST):mt(i.DEPTH_TEST)},setMask:function(Ut){dt!==Ut&&!N&&(i.depthMask(Ut),dt=Ut)},setFunc:function(Ut){if(vt!==Ut){switch(Ut){case xg:i.depthFunc(i.NEVER);break;case Mg:i.depthFunc(i.ALWAYS);break;case bg:i.depthFunc(i.LESS);break;case ka:i.depthFunc(i.LEQUAL);break;case Sg:i.depthFunc(i.EQUAL);break;case wg:i.depthFunc(i.GEQUAL);break;case Eg:i.depthFunc(i.GREATER);break;case Tg:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}vt=Ut}},setLocked:function(Ut){N=Ut},setClear:function(Ut){Gt!==Ut&&(i.clearDepth(Ut),Gt=Ut)},reset:function(){N=!1,dt=null,vt=null,Gt=null}}}function o(){let N=!1,dt=null,vt=null,Gt=null,Ut=null,ee=null,ne=null,Le=null,Ie=null;return{setTest:function(oe){N||(oe?W(i.STENCIL_TEST):mt(i.STENCIL_TEST))},setMask:function(oe){dt!==oe&&!N&&(i.stencilMask(oe),dt=oe)},setFunc:function(oe,Fe,Yn){(vt!==oe||Gt!==Fe||Ut!==Yn)&&(i.stencilFunc(oe,Fe,Yn),vt=oe,Gt=Fe,Ut=Yn)},setOp:function(oe,Fe,Yn){(ee!==oe||ne!==Fe||Le!==Yn)&&(i.stencilOp(oe,Fe,Yn),ee=oe,ne=Fe,Le=Yn)},setLocked:function(oe){N=oe},setClear:function(oe){Ie!==oe&&(i.clearStencil(oe),Ie=oe)},reset:function(){N=!1,dt=null,vt=null,Gt=null,Ut=null,ee=null,ne=null,Le=null,Ie=null}}}const a=new s,c=new r,l=new o,u=new WeakMap,h=new WeakMap;let d={},f={},m=new WeakMap,_=[],g=null,p=!1,y=null,v=null,x=null,M=null,S=null,T=null,I=null,b=new At(0,0,0),w=0,O=!1,G=null,$=null,R=null,F=null,H=null;const U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Y=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(X)[1]),B=Y>=1):X.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),B=Y>=2);let tt=null,et={};const j=i.getParameter(i.SCISSOR_BOX),Q=i.getParameter(i.VIEWPORT),st=new ue().fromArray(j),yt=new ue().fromArray(Q);function Mt(N,dt,vt,Gt){const Ut=new Uint8Array(4),ee=i.createTexture();i.bindTexture(N,ee),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ne=0;ne<vt;ne++)n&&(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)?i.texImage3D(dt,0,i.RGBA,1,1,Gt,0,i.RGBA,i.UNSIGNED_BYTE,Ut):i.texImage2D(dt+ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ut);return ee}const Nt={};Nt[i.TEXTURE_2D]=Mt(i.TEXTURE_2D,i.TEXTURE_2D,1),Nt[i.TEXTURE_CUBE_MAP]=Mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Nt[i.TEXTURE_2D_ARRAY]=Mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Nt[i.TEXTURE_3D]=Mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),W(i.DEPTH_TEST),c.setFunc(ka),zt(!1),P(Th),W(i.CULL_FACE),gt(Xi);function W(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function mt(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function Vt(N,dt){return f[N]!==dt?(i.bindFramebuffer(N,dt),f[N]=dt,n&&(N===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=dt)),!0):!1}function k(N,dt){let vt=_,Gt=!1;if(N)if(vt=m.get(dt),vt===void 0&&(vt=[],m.set(dt,vt)),N.isWebGLMultipleRenderTargets){const Ut=N.texture;if(vt.length!==Ut.length||vt[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,ne=Ut.length;ee<ne;ee++)vt[ee]=i.COLOR_ATTACHMENT0+ee;vt.length=Ut.length,Gt=!0}}else vt[0]!==i.COLOR_ATTACHMENT0&&(vt[0]=i.COLOR_ATTACHMENT0,Gt=!0);else vt[0]!==i.BACK&&(vt[0]=i.BACK,Gt=!0);Gt&&(e.isWebGL2?i.drawBuffers(vt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(vt))}function Ft(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const pt={[us]:i.FUNC_ADD,[rg]:i.FUNC_SUBTRACT,[og]:i.FUNC_REVERSE_SUBTRACT};if(n)pt[Ph]=i.MIN,pt[Rh]=i.MAX;else{const N=t.get("EXT_blend_minmax");N!==null&&(pt[Ph]=N.MIN_EXT,pt[Rh]=N.MAX_EXT)}const bt={[ag]:i.ZERO,[cg]:i.ONE,[lg]:i.SRC_COLOR,[Ol]:i.SRC_ALPHA,[mg]:i.SRC_ALPHA_SATURATE,[fg]:i.DST_COLOR,[hg]:i.DST_ALPHA,[ug]:i.ONE_MINUS_SRC_COLOR,[Fl]:i.ONE_MINUS_SRC_ALPHA,[pg]:i.ONE_MINUS_DST_COLOR,[dg]:i.ONE_MINUS_DST_ALPHA,[gg]:i.CONSTANT_COLOR,[_g]:i.ONE_MINUS_CONSTANT_COLOR,[yg]:i.CONSTANT_ALPHA,[vg]:i.ONE_MINUS_CONSTANT_ALPHA};function gt(N,dt,vt,Gt,Ut,ee,ne,Le,Ie,oe){if(N===Xi){p===!0&&(mt(i.BLEND),p=!1);return}if(p===!1&&(W(i.BLEND),p=!0),N!==sg){if(N!==y||oe!==O){if((v!==us||S!==us)&&(i.blendEquation(i.FUNC_ADD),v=us,S=us),oe)switch(N){case ar:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ai:i.blendFunc(i.ONE,i.ONE);break;case Ah:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ch:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ar:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ai:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ah:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ch:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,M=null,T=null,I=null,b.set(0,0,0),w=0,y=N,O=oe}return}Ut=Ut||dt,ee=ee||vt,ne=ne||Gt,(dt!==v||Ut!==S)&&(i.blendEquationSeparate(pt[dt],pt[Ut]),v=dt,S=Ut),(vt!==x||Gt!==M||ee!==T||ne!==I)&&(i.blendFuncSeparate(bt[vt],bt[Gt],bt[ee],bt[ne]),x=vt,M=Gt,T=ee,I=ne),(Le.equals(b)===!1||Ie!==w)&&(i.blendColor(Le.r,Le.g,Le.b,Ie),b.copy(Le),w=Ie),y=N,O=!1}function re(N,dt){N.side===mn?mt(i.CULL_FACE):W(i.CULL_FACE);let vt=N.side===_n;dt&&(vt=!vt),zt(vt),N.blending===ar&&N.transparent===!1?gt(Xi):gt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),c.setFunc(N.depthFunc),c.setTest(N.depthTest),c.setMask(N.depthWrite),a.setMask(N.colorWrite);const Gt=N.stencilWrite;l.setTest(Gt),Gt&&(l.setMask(N.stencilWriteMask),l.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),l.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),q(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?W(i.SAMPLE_ALPHA_TO_COVERAGE):mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function zt(N){G!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),G=N)}function P(N){N!==ng?(W(i.CULL_FACE),N!==$&&(N===Th?i.cullFace(i.BACK):N===ig?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):mt(i.CULL_FACE),$=N}function A(N){N!==R&&(B&&i.lineWidth(N),R=N)}function q(N,dt,vt){N?(W(i.POLYGON_OFFSET_FILL),(F!==dt||H!==vt)&&(i.polygonOffset(dt,vt),F=dt,H=vt)):mt(i.POLYGON_OFFSET_FILL)}function at(N){N?W(i.SCISSOR_TEST):mt(i.SCISSOR_TEST)}function rt(N){N===void 0&&(N=i.TEXTURE0+U-1),tt!==N&&(i.activeTexture(N),tt=N)}function ct(N,dt,vt){vt===void 0&&(tt===null?vt=i.TEXTURE0+U-1:vt=tt);let Gt=et[vt];Gt===void 0&&(Gt={type:void 0,texture:void 0},et[vt]=Gt),(Gt.type!==N||Gt.texture!==dt)&&(tt!==vt&&(i.activeTexture(vt),tt=vt),i.bindTexture(N,dt||Nt[N]),Gt.type=N,Gt.texture=dt)}function Ct(){const N=et[tt];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function xt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function kt(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function qt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function le(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Zt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Wt(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function L(N){st.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),st.copy(N))}function ut(N){yt.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),yt.copy(N))}function Lt(N,dt){let vt=h.get(dt);vt===void 0&&(vt=new WeakMap,h.set(dt,vt));let Gt=vt.get(N);Gt===void 0&&(Gt=i.getUniformBlockIndex(dt,N.name),vt.set(N,Gt))}function Et(N,dt){const Gt=h.get(dt).get(N);u.get(dt)!==Gt&&(i.uniformBlockBinding(dt,Gt,N.__bindingPointIndex),u.set(dt,Gt))}function ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},tt=null,et={},f={},m=new WeakMap,_=[],g=null,p=!1,y=null,v=null,x=null,M=null,S=null,T=null,I=null,b=new At(0,0,0),w=0,O=!1,G=null,$=null,R=null,F=null,H=null,st.set(0,0,i.canvas.width,i.canvas.height),yt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:W,disable:mt,bindFramebuffer:Vt,drawBuffers:k,useProgram:Ft,setBlending:gt,setMaterial:re,setFlipSided:zt,setCullFace:P,setLineWidth:A,setPolygonOffset:q,setScissorTest:at,activeTexture:rt,bindTexture:ct,unbindTexture:Ct,compressedTexImage2D:xt,compressedTexImage3D:Tt,texImage2D:Ot,texImage3D:St,updateUBOMapping:Lt,uniformBlockBinding:Et,texStorage2D:Zt,texStorage3D:Wt,texSubImage2D:kt,texSubImage3D:qt,compressedTexSubImage2D:it,compressedTexSubImage3D:le,scissor:L,viewport:ut,reset:ot}}function dx(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,A){return f?new OffscreenCanvas(P,A):go("canvas")}function _(P,A,q,at){let rt=1;if((P.width>at||P.height>at)&&(rt=at/Math.max(P.width,P.height)),rt<1||A===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){const ct=A?Xa:Math.floor,Ct=ct(rt*P.width),xt=ct(rt*P.height);h===void 0&&(h=m(Ct,xt));const Tt=q?m(Ct,xt):h;return Tt.width=Ct,Tt.height=xt,Tt.getContext("2d").drawImage(P,0,0,Ct,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+Ct+"x"+xt+")."),Tt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function g(P){return Vl(P.width)&&Vl(P.height)}function p(P){return a?!1:P.wrapS!==ln||P.wrapT!==ln||P.minFilter!==qe&&P.minFilter!==fn}function y(P,A){return P.generateMipmaps&&A&&P.minFilter!==qe&&P.minFilter!==fn}function v(P){i.generateMipmap(P)}function x(P,A,q,at,rt=!1){if(a===!1)return A;if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ct=A;if(A===i.RED&&(q===i.FLOAT&&(ct=i.R32F),q===i.HALF_FLOAT&&(ct=i.R16F),q===i.UNSIGNED_BYTE&&(ct=i.R8)),A===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(ct=i.R8UI),q===i.UNSIGNED_SHORT&&(ct=i.R16UI),q===i.UNSIGNED_INT&&(ct=i.R32UI),q===i.BYTE&&(ct=i.R8I),q===i.SHORT&&(ct=i.R16I),q===i.INT&&(ct=i.R32I)),A===i.RG&&(q===i.FLOAT&&(ct=i.RG32F),q===i.HALF_FLOAT&&(ct=i.RG16F),q===i.UNSIGNED_BYTE&&(ct=i.RG8)),A===i.RGBA){const Ct=rt?Ga:he.getTransfer(at);q===i.FLOAT&&(ct=i.RGBA32F),q===i.HALF_FLOAT&&(ct=i.RGBA16F),q===i.UNSIGNED_BYTE&&(ct=Ct===Me?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function M(P,A,q){return y(P,q)===!0||P.isFramebufferTexture&&P.minFilter!==qe&&P.minFilter!==fn?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function S(P){return P===qe||P===kl||P===Ra?i.NEAREST:i.LINEAR}function T(P){const A=P.target;A.removeEventListener("dispose",T),b(A),A.isVideoTexture&&u.delete(A)}function I(P){const A=P.target;A.removeEventListener("dispose",I),O(A)}function b(P){const A=n.get(P);if(A.__webglInit===void 0)return;const q=P.source,at=d.get(q);if(at){const rt=at[A.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&w(P),Object.keys(at).length===0&&d.delete(q)}n.remove(P)}function w(P){const A=n.get(P);i.deleteTexture(A.__webglTexture);const q=P.source,at=d.get(q);delete at[A.__cacheKey],o.memory.textures--}function O(P){const A=P.texture,q=n.get(P),at=n.get(A);if(at.__webglTexture!==void 0&&(i.deleteTexture(at.__webglTexture),o.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(q.__webglFramebuffer[rt]))for(let ct=0;ct<q.__webglFramebuffer[rt].length;ct++)i.deleteFramebuffer(q.__webglFramebuffer[rt][ct]);else i.deleteFramebuffer(q.__webglFramebuffer[rt]);q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer[rt])}else{if(Array.isArray(q.__webglFramebuffer))for(let rt=0;rt<q.__webglFramebuffer.length;rt++)i.deleteFramebuffer(q.__webglFramebuffer[rt]);else i.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&i.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let rt=0;rt<q.__webglColorRenderbuffer.length;rt++)q.__webglColorRenderbuffer[rt]&&i.deleteRenderbuffer(q.__webglColorRenderbuffer[rt]);q.__webglDepthRenderbuffer&&i.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let rt=0,ct=A.length;rt<ct;rt++){const Ct=n.get(A[rt]);Ct.__webglTexture&&(i.deleteTexture(Ct.__webglTexture),o.memory.textures--),n.remove(A[rt])}n.remove(A),n.remove(P)}let G=0;function $(){G=0}function R(){const P=G;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),G+=1,P}function F(P){const A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function H(P,A){const q=n.get(P);if(P.isVideoTexture&&re(P),P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){const at=P.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(q,P,A);return}}e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+A)}function U(P,A){const q=n.get(P);if(P.version>0&&q.__version!==P.version){st(q,P,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+A)}function B(P,A){const q=n.get(P);if(P.version>0&&q.__version!==P.version){st(q,P,A);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+A)}function Y(P,A){const q=n.get(P);if(P.version>0&&q.__version!==P.version){yt(q,P,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+A)}const X={[Ms]:i.REPEAT,[ln]:i.CLAMP_TO_EDGE,[Ba]:i.MIRRORED_REPEAT},tt={[qe]:i.NEAREST,[kl]:i.NEAREST_MIPMAP_NEAREST,[Ra]:i.NEAREST_MIPMAP_LINEAR,[fn]:i.LINEAR,[Mf]:i.LINEAR_MIPMAP_NEAREST,[bs]:i.LINEAR_MIPMAP_LINEAR},et={[qg]:i.NEVER,[t1]:i.ALWAYS,[Yg]:i.LESS,[Lf]:i.LEQUAL,[Kg]:i.EQUAL,[Qg]:i.GEQUAL,[Zg]:i.GREATER,[Jg]:i.NOTEQUAL};function j(P,A,q){if(q?(i.texParameteri(P,i.TEXTURE_WRAP_S,X[A.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,X[A.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,X[A.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,tt[A.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,tt[A.minFilter])):(i.texParameteri(P,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(P,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(A.wrapS!==ln||A.wrapT!==ln)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(P,i.TEXTURE_MAG_FILTER,S(A.magFilter)),i.texParameteri(P,i.TEXTURE_MIN_FILTER,S(A.minFilter)),A.minFilter!==qe&&A.minFilter!==fn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,et[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const at=t.get("EXT_texture_filter_anisotropic");if(A.magFilter===qe||A.minFilter!==Ra&&A.minFilter!==bs||A.type===bi&&t.has("OES_texture_float_linear")===!1||a===!1&&A.type===po&&t.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||n.get(A).__currentAnisotropy)&&(i.texParameterf(P,at.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy)}}function Q(P,A){let q=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",T));const at=A.source;let rt=d.get(at);rt===void 0&&(rt={},d.set(at,rt));const ct=F(A);if(ct!==P.__cacheKey){rt[ct]===void 0&&(rt[ct]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),rt[ct].usedTimes++;const Ct=rt[P.__cacheKey];Ct!==void 0&&(rt[P.__cacheKey].usedTimes--,Ct.usedTimes===0&&w(A)),P.__cacheKey=ct,P.__webglTexture=rt[ct].texture}return q}function st(P,A,q){let at=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(at=i.TEXTURE_3D);const rt=Q(P,A),ct=A.source;e.bindTexture(at,P.__webglTexture,i.TEXTURE0+q);const Ct=n.get(ct);if(ct.version!==Ct.__version||rt===!0){e.activeTexture(i.TEXTURE0+q);const xt=he.getPrimaries(he.workingColorSpace),Tt=A.colorSpace===Nn?null:he.getPrimaries(A.colorSpace),kt=A.colorSpace===Nn||xt===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const qt=p(A)&&g(A.image)===!1;let it=_(A.image,qt,!1,s.maxTextureSize);it=zt(A,it);const le=g(it)||a,Zt=r.convert(A.format,A.colorSpace);let Wt=r.convert(A.type),Ot=x(A.internalFormat,Zt,Wt,A.colorSpace,A.isVideoTexture);j(at,A,le);let St;const L=A.mipmaps,ut=a&&A.isVideoTexture!==!0&&Ot!==Cf,Lt=Ct.__version===void 0||rt===!0,Et=M(A,it,le);if(A.isDepthTexture)Ot=i.DEPTH_COMPONENT,a?A.type===bi?Ot=i.DEPTH_COMPONENT32F:A.type===Hi?Ot=i.DEPTH_COMPONENT24:A.type===ms?Ot=i.DEPTH24_STENCIL8:Ot=i.DEPTH_COMPONENT16:A.type===bi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===gs&&Ot===i.DEPTH_COMPONENT&&A.type!==bu&&A.type!==Hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=Hi,Wt=r.convert(A.type)),A.format===gr&&Ot===i.DEPTH_COMPONENT&&(Ot=i.DEPTH_STENCIL,A.type!==ms&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=ms,Wt=r.convert(A.type))),Lt&&(ut?e.texStorage2D(i.TEXTURE_2D,1,Ot,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Ot,it.width,it.height,0,Zt,Wt,null));else if(A.isDataTexture)if(L.length>0&&le){ut&&Lt&&e.texStorage2D(i.TEXTURE_2D,Et,Ot,L[0].width,L[0].height);for(let ot=0,N=L.length;ot<N;ot++)St=L[ot],ut?e.texSubImage2D(i.TEXTURE_2D,ot,0,0,St.width,St.height,Zt,Wt,St.data):e.texImage2D(i.TEXTURE_2D,ot,Ot,St.width,St.height,0,Zt,Wt,St.data);A.generateMipmaps=!1}else ut?(Lt&&e.texStorage2D(i.TEXTURE_2D,Et,Ot,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,Zt,Wt,it.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,it.width,it.height,0,Zt,Wt,it.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){ut&&Lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Ot,L[0].width,L[0].height,it.depth);for(let ot=0,N=L.length;ot<N;ot++)St=L[ot],A.format!==Sn?Zt!==null?ut?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,St.width,St.height,it.depth,Zt,St.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ot,Ot,St.width,St.height,it.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ut?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,St.width,St.height,it.depth,Zt,Wt,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ot,Ot,St.width,St.height,it.depth,0,Zt,Wt,St.data)}else{ut&&Lt&&e.texStorage2D(i.TEXTURE_2D,Et,Ot,L[0].width,L[0].height);for(let ot=0,N=L.length;ot<N;ot++)St=L[ot],A.format!==Sn?Zt!==null?ut?e.compressedTexSubImage2D(i.TEXTURE_2D,ot,0,0,St.width,St.height,Zt,St.data):e.compressedTexImage2D(i.TEXTURE_2D,ot,Ot,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ut?e.texSubImage2D(i.TEXTURE_2D,ot,0,0,St.width,St.height,Zt,Wt,St.data):e.texImage2D(i.TEXTURE_2D,ot,Ot,St.width,St.height,0,Zt,Wt,St.data)}else if(A.isDataArrayTexture)ut?(Lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Ot,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,Zt,Wt,it.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,it.width,it.height,it.depth,0,Zt,Wt,it.data);else if(A.isData3DTexture)ut?(Lt&&e.texStorage3D(i.TEXTURE_3D,Et,Ot,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,Zt,Wt,it.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,it.width,it.height,it.depth,0,Zt,Wt,it.data);else if(A.isFramebufferTexture){if(Lt)if(ut)e.texStorage2D(i.TEXTURE_2D,Et,Ot,it.width,it.height);else{let ot=it.width,N=it.height;for(let dt=0;dt<Et;dt++)e.texImage2D(i.TEXTURE_2D,dt,Ot,ot,N,0,Zt,Wt,null),ot>>=1,N>>=1}}else if(L.length>0&&le){ut&&Lt&&e.texStorage2D(i.TEXTURE_2D,Et,Ot,L[0].width,L[0].height);for(let ot=0,N=L.length;ot<N;ot++)St=L[ot],ut?e.texSubImage2D(i.TEXTURE_2D,ot,0,0,Zt,Wt,St):e.texImage2D(i.TEXTURE_2D,ot,Ot,Zt,Wt,St);A.generateMipmaps=!1}else ut?(Lt&&e.texStorage2D(i.TEXTURE_2D,Et,Ot,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Zt,Wt,it)):e.texImage2D(i.TEXTURE_2D,0,Ot,Zt,Wt,it);y(A,le)&&v(at),Ct.__version=ct.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function yt(P,A,q){if(A.image.length!==6)return;const at=Q(P,A),rt=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+q);const ct=n.get(rt);if(rt.version!==ct.__version||at===!0){e.activeTexture(i.TEXTURE0+q);const Ct=he.getPrimaries(he.workingColorSpace),xt=A.colorSpace===Nn?null:he.getPrimaries(A.colorSpace),Tt=A.colorSpace===Nn||Ct===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const kt=A.isCompressedTexture||A.image[0].isCompressedTexture,qt=A.image[0]&&A.image[0].isDataTexture,it=[];for(let ot=0;ot<6;ot++)!kt&&!qt?it[ot]=_(A.image[ot],!1,!0,s.maxCubemapSize):it[ot]=qt?A.image[ot].image:A.image[ot],it[ot]=zt(A,it[ot]);const le=it[0],Zt=g(le)||a,Wt=r.convert(A.format,A.colorSpace),Ot=r.convert(A.type),St=x(A.internalFormat,Wt,Ot,A.colorSpace),L=a&&A.isVideoTexture!==!0,ut=ct.__version===void 0||at===!0;let Lt=M(A,le,Zt);j(i.TEXTURE_CUBE_MAP,A,Zt);let Et;if(kt){L&&ut&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,St,le.width,le.height);for(let ot=0;ot<6;ot++){Et=it[ot].mipmaps;for(let N=0;N<Et.length;N++){const dt=Et[N];A.format!==Sn?Wt!==null?L?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N,0,0,dt.width,dt.height,Wt,dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N,St,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N,0,0,dt.width,dt.height,Wt,Ot,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N,St,dt.width,dt.height,0,Wt,Ot,dt.data)}}}else{Et=A.mipmaps,L&&ut&&(Et.length>0&&Lt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Lt,St,it[0].width,it[0].height));for(let ot=0;ot<6;ot++)if(qt){L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,it[ot].width,it[ot].height,Wt,Ot,it[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,St,it[ot].width,it[ot].height,0,Wt,Ot,it[ot].data);for(let N=0;N<Et.length;N++){const vt=Et[N].image[ot].image;L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N+1,0,0,vt.width,vt.height,Wt,Ot,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N+1,St,vt.width,vt.height,0,Wt,Ot,vt.data)}}else{L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Wt,Ot,it[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,St,Wt,Ot,it[ot]);for(let N=0;N<Et.length;N++){const dt=Et[N];L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N+1,0,0,Wt,Ot,dt.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,N+1,St,Wt,Ot,dt.image[ot])}}}y(A,Zt)&&v(i.TEXTURE_CUBE_MAP),ct.__version=rt.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function Mt(P,A,q,at,rt,ct){const Ct=r.convert(q.format,q.colorSpace),xt=r.convert(q.type),Tt=x(q.internalFormat,Ct,xt,q.colorSpace);if(!n.get(A).__hasExternalTextures){const qt=Math.max(1,A.width>>ct),it=Math.max(1,A.height>>ct);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,ct,Tt,qt,it,A.depth,0,Ct,xt,null):e.texImage2D(rt,ct,Tt,qt,it,0,Ct,xt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),gt(A)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,rt,n.get(q).__webglTexture,0,bt(A)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,rt,n.get(q).__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(P,A,q){if(i.bindRenderbuffer(i.RENDERBUFFER,P),A.depthBuffer&&!A.stencilBuffer){let at=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(q||gt(A)){const rt=A.depthTexture;rt&&rt.isDepthTexture&&(rt.type===bi?at=i.DEPTH_COMPONENT32F:rt.type===Hi&&(at=i.DEPTH_COMPONENT24));const ct=bt(A);gt(A)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,at,A.width,A.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,at,A.width,A.height)}else i.renderbufferStorage(i.RENDERBUFFER,at,A.width,A.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,P)}else if(A.depthBuffer&&A.stencilBuffer){const at=bt(A);q&&gt(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,at,i.DEPTH24_STENCIL8,A.width,A.height):gt(A)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,i.DEPTH24_STENCIL8,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,P)}else{const at=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let rt=0;rt<at.length;rt++){const ct=at[rt],Ct=r.convert(ct.format,ct.colorSpace),xt=r.convert(ct.type),Tt=x(ct.internalFormat,Ct,xt,ct.colorSpace),kt=bt(A);q&&gt(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,Tt,A.width,A.height):gt(A)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,Tt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function W(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),H(A.depthTexture,0);const at=n.get(A.depthTexture).__webglTexture,rt=bt(A);if(A.depthTexture.format===gs)gt(A)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(A.depthTexture.format===gr)gt(A)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function mt(P){const A=n.get(P),q=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");W(A.__webglFramebuffer,P)}else if(q){A.__webglDepthbuffer=[];for(let at=0;at<6;at++)e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[at]),A.__webglDepthbuffer[at]=i.createRenderbuffer(),Nt(A.__webglDepthbuffer[at],P,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=i.createRenderbuffer(),Nt(A.__webglDepthbuffer,P,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(P,A,q){const at=n.get(P);A!==void 0&&Mt(at.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&mt(P)}function k(P){const A=P.texture,q=n.get(P),at=n.get(A);P.addEventListener("dispose",I),P.isWebGLMultipleRenderTargets!==!0&&(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=A.version,o.memory.textures++);const rt=P.isWebGLCubeRenderTarget===!0,ct=P.isWebGLMultipleRenderTargets===!0,Ct=g(P)||a;if(rt){q.__webglFramebuffer=[];for(let xt=0;xt<6;xt++)if(a&&A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer[xt]=[];for(let Tt=0;Tt<A.mipmaps.length;Tt++)q.__webglFramebuffer[xt][Tt]=i.createFramebuffer()}else q.__webglFramebuffer[xt]=i.createFramebuffer()}else{if(a&&A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer=[];for(let xt=0;xt<A.mipmaps.length;xt++)q.__webglFramebuffer[xt]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(ct)if(s.drawBuffers){const xt=P.texture;for(let Tt=0,kt=xt.length;Tt<kt;Tt++){const qt=n.get(xt[Tt]);qt.__webglTexture===void 0&&(qt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&P.samples>0&&gt(P)===!1){const xt=ct?A:[A];q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let Tt=0;Tt<xt.length;Tt++){const kt=xt[Tt];q.__webglColorRenderbuffer[Tt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[Tt]);const qt=r.convert(kt.format,kt.colorSpace),it=r.convert(kt.type),le=x(kt.internalFormat,qt,it,kt.colorSpace,P.isXRRenderTarget===!0),Zt=bt(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Zt,le,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,q.__webglColorRenderbuffer[Tt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(q.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),j(i.TEXTURE_CUBE_MAP,A,Ct);for(let xt=0;xt<6;xt++)if(a&&A.mipmaps&&A.mipmaps.length>0)for(let Tt=0;Tt<A.mipmaps.length;Tt++)Mt(q.__webglFramebuffer[xt][Tt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Tt);else Mt(q.__webglFramebuffer[xt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0);y(A,Ct)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){const xt=P.texture;for(let Tt=0,kt=xt.length;Tt<kt;Tt++){const qt=xt[Tt],it=n.get(qt);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),j(i.TEXTURE_2D,qt,Ct),Mt(q.__webglFramebuffer,P,qt,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,0),y(qt,Ct)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let xt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(a?xt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(xt,at.__webglTexture),j(xt,A,Ct),a&&A.mipmaps&&A.mipmaps.length>0)for(let Tt=0;Tt<A.mipmaps.length;Tt++)Mt(q.__webglFramebuffer[Tt],P,A,i.COLOR_ATTACHMENT0,xt,Tt);else Mt(q.__webglFramebuffer,P,A,i.COLOR_ATTACHMENT0,xt,0);y(A,Ct)&&v(xt),e.unbindTexture()}P.depthBuffer&&mt(P)}function Ft(P){const A=g(P)||a,q=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let at=0,rt=q.length;at<rt;at++){const ct=q[at];if(y(ct,A)){const Ct=P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,xt=n.get(ct).__webglTexture;e.bindTexture(Ct,xt),v(Ct),e.unbindTexture()}}}function pt(P){if(a&&P.samples>0&&gt(P)===!1){const A=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],q=P.width,at=P.height;let rt=i.COLOR_BUFFER_BIT;const ct=[],Ct=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xt=n.get(P),Tt=P.isWebGLMultipleRenderTargets===!0;if(Tt)for(let kt=0;kt<A.length;kt++)e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let kt=0;kt<A.length;kt++){ct.push(i.COLOR_ATTACHMENT0+kt),P.depthBuffer&&ct.push(Ct);const qt=xt.__ignoreDepthValues!==void 0?xt.__ignoreDepthValues:!1;if(qt===!1&&(P.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),Tt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,xt.__webglColorRenderbuffer[kt]),qt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ct]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ct])),Tt){const it=n.get(A[kt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,q,at,0,0,q,at,rt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Tt)for(let kt=0;kt<A.length;kt++){e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,xt.__webglColorRenderbuffer[kt]);const qt=n.get(A[kt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}}function bt(P){return Math.min(s.maxSamples,P.samples)}function gt(P){const A=n.get(P);return a&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function re(P){const A=o.render.frame;u.get(P)!==A&&(u.set(P,A),P.update())}function zt(P,A){const q=P.colorSpace,at=P.format,rt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===Hl||q!==Ve&&q!==Nn&&(he.getTransfer(q)===Me?a===!1?t.has("EXT_sRGB")===!0&&at===Sn?(P.format=Hl,P.minFilter=fn,P.generateMipmaps=!1):A=If.sRGBToLinear(A):(at!==Sn||rt!==$i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),A}this.allocateTextureUnit=R,this.resetTextureUnits=$,this.setTexture2D=H,this.setTexture2DArray=U,this.setTexture3D=B,this.setTextureCube=Y,this.rebindTextures=Vt,this.setupRenderTarget=k,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=mt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=gt}function fx(i,t,e){const n=e.isWebGL2;function s(r,o=Nn){let a;const c=he.getTransfer(o);if(r===$i)return i.UNSIGNED_BYTE;if(r===Sf)return i.UNSIGNED_SHORT_4_4_4_4;if(r===wf)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Og)return i.BYTE;if(r===Fg)return i.SHORT;if(r===bu)return i.UNSIGNED_SHORT;if(r===bf)return i.INT;if(r===Hi)return i.UNSIGNED_INT;if(r===bi)return i.FLOAT;if(r===po)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Ug)return i.ALPHA;if(r===Sn)return i.RGBA;if(r===zg)return i.LUMINANCE;if(r===kg)return i.LUMINANCE_ALPHA;if(r===gs)return i.DEPTH_COMPONENT;if(r===gr)return i.DEPTH_STENCIL;if(r===Hl)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Bg)return i.RED;if(r===Ef)return i.RED_INTEGER;if(r===Gg)return i.RG;if(r===Tf)return i.RG_INTEGER;if(r===Af)return i.RGBA_INTEGER;if(r===Fc||r===Uc||r===zc||r===kc)if(c===Me)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Fc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Uc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===zc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===kc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Fc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Uc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===zc)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===kc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Dh||r===Ih||r===Nh||r===Oh)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Dh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ih)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Nh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Oh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Cf)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Fh||r===Uh)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Fh)return c===Me?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Uh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===zh||r===kh||r===Bh||r===Gh||r===Hh||r===Vh||r===Wh||r===Xh||r===jh||r===$h||r===qh||r===Yh||r===Kh||r===Zh)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===zh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===kh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Bh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Gh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Hh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Vh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Wh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Xh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===jh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===$h)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===qh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Yh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Kh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Zh)return c===Me?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Bc||r===Jh||r===Qh)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Bc)return c===Me?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Jh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Qh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Hg||r===td||r===ed||r===nd)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Bc)return a.COMPRESSED_RED_RGTC1_EXT;if(r===td)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ed)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===nd)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ms?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class px extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Se extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mx={type:"move"};class ul{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Se,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Se,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Se,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(mx)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Se;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class gx extends Ji{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,m=null;const _=e.getContextAttributes();let g=null,p=null;const y=[],v=[],x=new ht;let M=null;const S=new rn;S.layers.enable(1),S.viewport=new ue;const T=new rn;T.layers.enable(2),T.viewport=new ue;const I=[S,T],b=new px;b.layers.enable(1),b.layers.enable(2);let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let Q=y[j];return Q===void 0&&(Q=new ul,y[j]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(j){let Q=y[j];return Q===void 0&&(Q=new ul,y[j]=Q),Q.getGripSpace()},this.getHand=function(j){let Q=y[j];return Q===void 0&&(Q=new ul,y[j]=Q),Q.getHandSpace()};function G(j){const Q=v.indexOf(j.inputSource);if(Q===-1)return;const st=y[Q];st!==void 0&&(st.update(j.inputSource,j.frame,l||o),st.dispatchEvent({type:j.type,data:j.inputSource}))}function $(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",R);for(let j=0;j<y.length;j++){const Q=v[j];Q!==null&&(v[j]=null,y[j].disconnect(Q))}w=null,O=null,t.setRenderTarget(g),f=null,d=null,h=null,s=null,p=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(M),t.setSize(x.width,x.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(g=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",$),s.addEventListener("inputsourceschange",R),_.xrCompatible!==!0&&await e.makeXRCompatible(),M=t.getPixelRatio(),t.getSize(x),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Q={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new Ss(f.framebufferWidth,f.framebufferHeight,{format:Sn,type:$i,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Q=null,st=null,yt=null;_.depth&&(yt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=_.stencil?gr:gs,st=_.stencil?ms:Hi);const Mt={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};h=new XRWebGLBinding(s,e),d=h.createProjectionLayer(Mt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new Ss(d.textureWidth,d.textureHeight,{format:Sn,type:$i,depthTexture:new Vf(d.textureWidth,d.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Nt=t.properties.get(p);Nt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function R(j){for(let Q=0;Q<j.removed.length;Q++){const st=j.removed[Q],yt=v.indexOf(st);yt>=0&&(v[yt]=null,y[yt].disconnect(st))}for(let Q=0;Q<j.added.length;Q++){const st=j.added[Q];let yt=v.indexOf(st);if(yt===-1){for(let Nt=0;Nt<y.length;Nt++)if(Nt>=v.length){v.push(st),yt=Nt;break}else if(v[Nt]===null){v[Nt]=st,yt=Nt;break}if(yt===-1)break}const Mt=y[yt];Mt&&Mt.connect(st)}}const F=new E,H=new E;function U(j,Q,st){F.setFromMatrixPosition(Q.matrixWorld),H.setFromMatrixPosition(st.matrixWorld);const yt=F.distanceTo(H),Mt=Q.projectionMatrix.elements,Nt=st.projectionMatrix.elements,W=Mt[14]/(Mt[10]-1),mt=Mt[14]/(Mt[10]+1),Vt=(Mt[9]+1)/Mt[5],k=(Mt[9]-1)/Mt[5],Ft=(Mt[8]-1)/Mt[0],pt=(Nt[8]+1)/Nt[0],bt=W*Ft,gt=W*pt,re=yt/(-Ft+pt),zt=re*-Ft;Q.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(zt),j.translateZ(re),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const P=W+re,A=mt+re,q=bt-zt,at=gt+(yt-zt),rt=Vt*mt/A*P,ct=k*mt/A*P;j.projectionMatrix.makePerspective(q,at,rt,ct,P,A),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function B(j,Q){Q===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(Q.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;b.near=T.near=S.near=j.near,b.far=T.far=S.far=j.far,(w!==b.near||O!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),w=b.near,O=b.far);const Q=j.parent,st=b.cameras;B(b,Q);for(let yt=0;yt<st.length;yt++)B(st[yt],Q);st.length===2?U(b,S,T):b.projectionMatrix.copy(S.projectionMatrix),Y(j,b,Q)};function Y(j,Q,st){st===null?j.matrix.copy(Q.matrixWorld):(j.matrix.copy(st.matrixWorld),j.matrix.invert(),j.matrix.multiply(Q.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(Q.projectionMatrix),j.projectionMatrixInverse.copy(Q.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=yr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)};let X=null;function tt(j,Q){if(u=Q.getViewerPose(l||o),m=Q,u!==null){const st=u.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let yt=!1;st.length!==b.cameras.length&&(b.cameras.length=0,yt=!0);for(let Mt=0;Mt<st.length;Mt++){const Nt=st[Mt];let W=null;if(f!==null)W=f.getViewport(Nt);else{const Vt=h.getViewSubImage(d,Nt);W=Vt.viewport,Mt===0&&(t.setRenderTargetTextures(p,Vt.colorTexture,d.ignoreDepthValues?void 0:Vt.depthStencilTexture),t.setRenderTarget(p))}let mt=I[Mt];mt===void 0&&(mt=new rn,mt.layers.enable(Mt),mt.viewport=new ue,I[Mt]=mt),mt.matrix.fromArray(Nt.transform.matrix),mt.matrix.decompose(mt.position,mt.quaternion,mt.scale),mt.projectionMatrix.fromArray(Nt.projectionMatrix),mt.projectionMatrixInverse.copy(mt.projectionMatrix).invert(),mt.viewport.set(W.x,W.y,W.width,W.height),Mt===0&&(b.matrix.copy(mt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),yt===!0&&b.cameras.push(mt)}}for(let st=0;st<y.length;st++){const yt=v[st],Mt=y[st];yt!==null&&Mt!==void 0&&Mt.update(yt,Q,l||o)}X&&X(j,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),m=null}const et=new Hf;et.setAnimationLoop(tt),this.setAnimationLoop=function(j){X=j},this.dispose=function(){}}}function _x(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,kf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,y,v,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),h(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,y,v):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===_n&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===_n&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p).envMap;if(y&&(g.envMap.value=y,g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap){g.lightMap.value=p.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,g.lightMapTransform)}p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,y,v){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=v*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),t.get(p).envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===_n&&g.clearcoatNormalScale.value.negate())),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function yx(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(y,v){const x=v.program;n.uniformBlockBinding(y,x)}function l(y,v){let x=s[y.id];x===void 0&&(m(y),x=u(y),s[y.id]=x,y.addEventListener("dispose",g));const M=v.program;n.updateUBOMapping(y,M);const S=t.render.frame;r[y.id]!==S&&(d(y),r[y.id]=S)}function u(y){const v=h();y.__bindingPointIndex=v;const x=i.createBuffer(),M=y.__size,S=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,M,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const v=s[y.id],x=y.uniforms,M=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let S=0,T=x.length;S<T;S++){const I=Array.isArray(x[S])?x[S]:[x[S]];for(let b=0,w=I.length;b<w;b++){const O=I[b];if(f(O,S,b,M)===!0){const G=O.__offset,$=Array.isArray(O.value)?O.value:[O.value];let R=0;for(let F=0;F<$.length;F++){const H=$[F],U=_(H);typeof H=="number"||typeof H=="boolean"?(O.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,G+R,O.__data)):H.isMatrix3?(O.__data[0]=H.elements[0],O.__data[1]=H.elements[1],O.__data[2]=H.elements[2],O.__data[3]=0,O.__data[4]=H.elements[3],O.__data[5]=H.elements[4],O.__data[6]=H.elements[5],O.__data[7]=0,O.__data[8]=H.elements[6],O.__data[9]=H.elements[7],O.__data[10]=H.elements[8],O.__data[11]=0):(H.toArray(O.__data,R),R+=U.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,v,x,M){const S=y.value,T=v+"_"+x;if(M[T]===void 0)return typeof S=="number"||typeof S=="boolean"?M[T]=S:M[T]=S.clone(),!0;{const I=M[T];if(typeof S=="number"||typeof S=="boolean"){if(I!==S)return M[T]=S,!0}else if(I.equals(S)===!1)return I.copy(S),!0}return!1}function m(y){const v=y.uniforms;let x=0;const M=16;for(let T=0,I=v.length;T<I;T++){const b=Array.isArray(v[T])?v[T]:[v[T]];for(let w=0,O=b.length;w<O;w++){const G=b[w],$=Array.isArray(G.value)?G.value:[G.value];for(let R=0,F=$.length;R<F;R++){const H=$[R],U=_(H),B=x%M;B!==0&&M-B<U.boundary&&(x+=M-B),G.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=x,x+=U.storage}}}const S=x%M;return S>0&&(x+=M-S),y.__size=x,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function g(y){const v=y.target;v.removeEventListener("dispose",g);const x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class Lu{constructor(t={}){const{canvas:e=m1(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),m=new Int32Array(4);let _=null,g=null;const p=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=be,this._useLegacyLights=!1,this.toneMapping=ji,this.toneMappingExposure=1;const v=this;let x=!1,M=0,S=0,T=null,I=-1,b=null;const w=new ue,O=new ue;let G=null;const $=new At(0);let R=0,F=e.width,H=e.height,U=1,B=null,Y=null;const X=new ue(0,0,F,H),tt=new ue(0,0,F,H);let et=!1;const j=new Cu;let Q=!1,st=!1,yt=null;const Mt=new Pt,Nt=new ht,W=new E,mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Vt(){return T===null?U:1}let k=n;function Ft(C,V){for(let Z=0;Z<C.length;Z++){const J=C[Z],K=e.getContext(J,V);if(K!==null)return K}return null}try{const C={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${xu}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",N,!1),e.addEventListener("webglcontextcreationerror",dt,!1),k===null){const V=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&V.shift(),k=Ft(V,C),k===null)throw Ft(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&k instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let pt,bt,gt,re,zt,P,A,q,at,rt,ct,Ct,xt,Tt,kt,qt,it,le,Zt,Wt,Ot,St,L,ut;function Lt(){pt=new Cy(k),bt=new by(k,pt,t),pt.init(bt),St=new fx(k,pt,bt),gt=new hx(k,pt,bt),re=new Ly(k),zt=new Zv,P=new dx(k,pt,gt,zt,bt,St,re),A=new wy(v),q=new Ay(v),at=new k1(k,bt),L=new xy(k,pt,at,bt),rt=new Py(k,at,re,L),ct=new Oy(k,rt,at,re),Zt=new Ny(k,bt,P),qt=new Sy(zt),Ct=new Kv(v,A,q,pt,bt,L,qt),xt=new _x(v,zt),Tt=new Qv,kt=new rx(pt,bt),le=new vy(v,A,q,gt,ct,d,c),it=new ux(v,ct,bt),ut=new yx(k,re,bt,gt),Wt=new My(k,pt,re,bt),Ot=new Ry(k,pt,re,bt),re.programs=Ct.programs,v.capabilities=bt,v.extensions=pt,v.properties=zt,v.renderLists=Tt,v.shadowMap=it,v.state=gt,v.info=re}Lt();const Et=new gx(v,k);this.xr=Et,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const C=pt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=pt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(C){C!==void 0&&(U=C,this.setSize(F,H,!1))},this.getSize=function(C){return C.set(F,H)},this.setSize=function(C,V,Z=!0){if(Et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=C,H=V,e.width=Math.floor(C*U),e.height=Math.floor(V*U),Z===!0&&(e.style.width=C+"px",e.style.height=V+"px"),this.setViewport(0,0,C,V)},this.getDrawingBufferSize=function(C){return C.set(F*U,H*U).floor()},this.setDrawingBufferSize=function(C,V,Z){F=C,H=V,U=Z,e.width=Math.floor(C*Z),e.height=Math.floor(V*Z),this.setViewport(0,0,C,V)},this.getCurrentViewport=function(C){return C.copy(w)},this.getViewport=function(C){return C.copy(X)},this.setViewport=function(C,V,Z,J){C.isVector4?X.set(C.x,C.y,C.z,C.w):X.set(C,V,Z,J),gt.viewport(w.copy(X).multiplyScalar(U).floor())},this.getScissor=function(C){return C.copy(tt)},this.setScissor=function(C,V,Z,J){C.isVector4?tt.set(C.x,C.y,C.z,C.w):tt.set(C,V,Z,J),gt.scissor(O.copy(tt).multiplyScalar(U).floor())},this.getScissorTest=function(){return et},this.setScissorTest=function(C){gt.setScissorTest(et=C)},this.setOpaqueSort=function(C){B=C},this.setTransparentSort=function(C){Y=C},this.getClearColor=function(C){return C.copy(le.getClearColor())},this.setClearColor=function(){le.setClearColor.apply(le,arguments)},this.getClearAlpha=function(){return le.getClearAlpha()},this.setClearAlpha=function(){le.setClearAlpha.apply(le,arguments)},this.clear=function(C=!0,V=!0,Z=!0){let J=0;if(C){let K=!1;if(T!==null){const wt=T.texture.format;K=wt===Af||wt===Tf||wt===Ef}if(K){const wt=T.texture.type,Dt=wt===$i||wt===Hi||wt===bu||wt===ms||wt===Sf||wt===wf,Ht=le.getClearColor(),Xt=le.getClearAlpha(),Jt=Ht.r,jt=Ht.g,Yt=Ht.b;Dt?(f[0]=Jt,f[1]=jt,f[2]=Yt,f[3]=Xt,k.clearBufferuiv(k.COLOR,0,f)):(m[0]=Jt,m[1]=jt,m[2]=Yt,m[3]=Xt,k.clearBufferiv(k.COLOR,0,m))}else J|=k.COLOR_BUFFER_BIT}V&&(J|=k.DEPTH_BUFFER_BIT),Z&&(J|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",N,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Tt.dispose(),kt.dispose(),zt.dispose(),A.dispose(),q.dispose(),ct.dispose(),L.dispose(),ut.dispose(),Ct.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",Ie),Et.removeEventListener("sessionend",oe),yt&&(yt.dispose(),yt=null),Fe.stop()};function ot(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const C=re.autoReset,V=it.enabled,Z=it.autoUpdate,J=it.needsUpdate,K=it.type;Lt(),re.autoReset=C,it.enabled=V,it.autoUpdate=Z,it.needsUpdate=J,it.type=K}function dt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function vt(C){const V=C.target;V.removeEventListener("dispose",vt),Gt(V)}function Gt(C){Ut(C),zt.remove(C)}function Ut(C){const V=zt.get(C).programs;V!==void 0&&(V.forEach(function(Z){Ct.releaseProgram(Z)}),C.isShaderMaterial&&Ct.releaseShaderCache(C))}this.renderBufferDirect=function(C,V,Z,J,K,wt){V===null&&(V=mt);const Dt=K.isMesh&&K.matrixWorld.determinant()<0,Ht=Km(C,V,Z,J,K);gt.setMaterial(J,Dt);let Xt=Z.index,Jt=1;if(J.wireframe===!0){if(Xt=rt.getWireframeAttribute(Z),Xt===void 0)return;Jt=2}const jt=Z.drawRange,Yt=Z.attributes.position;let Ne=jt.start*Jt,yn=(jt.start+jt.count)*Jt;wt!==null&&(Ne=Math.max(Ne,wt.start*Jt),yn=Math.min(yn,(wt.start+wt.count)*Jt)),Xt!==null?(Ne=Math.max(Ne,0),yn=Math.min(yn,Xt.count)):Yt!=null&&(Ne=Math.max(Ne,0),yn=Math.min(yn,Yt.count));const je=yn-Ne;if(je<0||je===1/0)return;L.setup(K,J,Ht,Z,Xt);let hi,Ce=Wt;if(Xt!==null&&(hi=at.get(Xt),Ce=Ot,Ce.setIndex(hi)),K.isMesh)J.wireframe===!0?(gt.setLineWidth(J.wireframeLinewidth*Vt()),Ce.setMode(k.LINES)):Ce.setMode(k.TRIANGLES);else if(K.isLine){let Qt=J.linewidth;Qt===void 0&&(Qt=1),gt.setLineWidth(Qt*Vt()),K.isLineSegments?Ce.setMode(k.LINES):K.isLineLoop?Ce.setMode(k.LINE_LOOP):Ce.setMode(k.LINE_STRIP)}else K.isPoints?Ce.setMode(k.POINTS):K.isSprite&&Ce.setMode(k.TRIANGLES);if(K.isBatchedMesh)Ce.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else if(K.isInstancedMesh)Ce.renderInstances(Ne,je,K.count);else if(Z.isInstancedBufferGeometry){const Qt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Dc=Math.min(Z.instanceCount,Qt);Ce.renderInstances(Ne,je,Dc)}else Ce.render(Ne,je)};function ee(C,V,Z){C.transparent===!0&&C.side===mn&&C.forceSinglePass===!1?(C.side=_n,C.needsUpdate=!0,zo(C,V,Z),C.side=ai,C.needsUpdate=!0,zo(C,V,Z),C.side=mn):zo(C,V,Z)}this.compile=function(C,V,Z=null){Z===null&&(Z=C),g=kt.get(Z),g.init(),y.push(g),Z.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),C!==Z&&C.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),g.setupLights(v._useLegacyLights);const J=new Set;return C.traverse(function(K){const wt=K.material;if(wt)if(Array.isArray(wt))for(let Dt=0;Dt<wt.length;Dt++){const Ht=wt[Dt];ee(Ht,Z,K),J.add(Ht)}else ee(wt,Z,K),J.add(wt)}),y.pop(),g=null,J},this.compileAsync=function(C,V,Z=null){const J=this.compile(C,V,Z);return new Promise(K=>{function wt(){if(J.forEach(function(Dt){zt.get(Dt).currentProgram.isReady()&&J.delete(Dt)}),J.size===0){K(C);return}setTimeout(wt,10)}pt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let ne=null;function Le(C){ne&&ne(C)}function Ie(){Fe.stop()}function oe(){Fe.start()}const Fe=new Hf;Fe.setAnimationLoop(Le),typeof self<"u"&&Fe.setContext(self),this.setAnimationLoop=function(C){ne=C,Et.setAnimationLoop(C),C===null?Fe.stop():Fe.start()},Et.addEventListener("sessionstart",Ie),Et.addEventListener("sessionend",oe),this.render=function(C,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(V),V=Et.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,V,T),g=kt.get(C,y.length),g.init(),y.push(g),Mt.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),j.setFromProjectionMatrix(Mt),st=this.localClippingEnabled,Q=qt.init(this.clippingPlanes,st),_=Tt.get(C,p.length),_.init(),p.push(_),Yn(C,V,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(B,Y),this.info.render.frame++,Q===!0&&qt.beginShadows();const Z=g.state.shadowsArray;if(it.render(Z,C,V),Q===!0&&qt.endShadows(),this.info.autoReset===!0&&this.info.reset(),le.render(_,C),g.setupLights(v._useLegacyLights),V.isArrayCamera){const J=V.cameras;for(let K=0,wt=J.length;K<wt;K++){const Dt=J[K];xh(_,C,Dt,Dt.viewport)}}else xh(_,C,V);T!==null&&(P.updateMultisampleRenderTarget(T),P.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,V),L.resetDefaultState(),I=-1,b=null,y.pop(),y.length>0?g=y[y.length-1]:g=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Yn(C,V,Z,J){if(C.visible===!1)return;if(C.layers.test(V.layers)){if(C.isGroup)Z=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(V);else if(C.isLight)g.pushLight(C),C.castShadow&&g.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||j.intersectsSprite(C)){J&&W.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Mt);const Dt=ct.update(C),Ht=C.material;Ht.visible&&_.push(C,Dt,Ht,Z,W.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||j.intersectsObject(C))){const Dt=ct.update(C),Ht=C.material;if(J&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),W.copy(C.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),W.copy(Dt.boundingSphere.center)),W.applyMatrix4(C.matrixWorld).applyMatrix4(Mt)),Array.isArray(Ht)){const Xt=Dt.groups;for(let Jt=0,jt=Xt.length;Jt<jt;Jt++){const Yt=Xt[Jt],Ne=Ht[Yt.materialIndex];Ne&&Ne.visible&&_.push(C,Dt,Ne,Z,W.z,Yt)}}else Ht.visible&&_.push(C,Dt,Ht,Z,W.z,null)}}const wt=C.children;for(let Dt=0,Ht=wt.length;Dt<Ht;Dt++)Yn(wt[Dt],V,Z,J)}function xh(C,V,Z,J){const K=C.opaque,wt=C.transmissive,Dt=C.transparent;g.setupLightsView(Z),Q===!0&&qt.setGlobalState(v.clippingPlanes,Z),wt.length>0&&Ym(K,wt,V,Z),J&&gt.viewport(w.copy(J)),K.length>0&&Uo(K,V,Z),wt.length>0&&Uo(wt,V,Z),Dt.length>0&&Uo(Dt,V,Z),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function Ym(C,V,Z,J){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;const wt=bt.isWebGL2;yt===null&&(yt=new Ss(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")?po:$i,minFilter:bs,samples:wt?4:0})),v.getDrawingBufferSize(Nt),wt?yt.setSize(Nt.x,Nt.y):yt.setSize(Xa(Nt.x),Xa(Nt.y));const Dt=v.getRenderTarget();v.setRenderTarget(yt),v.getClearColor($),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear();const Ht=v.toneMapping;v.toneMapping=ji,Uo(C,Z,J),P.updateMultisampleRenderTarget(yt),P.updateRenderTargetMipmap(yt);let Xt=!1;for(let Jt=0,jt=V.length;Jt<jt;Jt++){const Yt=V[Jt],Ne=Yt.object,yn=Yt.geometry,je=Yt.material,hi=Yt.group;if(je.side===mn&&Ne.layers.test(J.layers)){const Ce=je.side;je.side=_n,je.needsUpdate=!0,Mh(Ne,Z,J,yn,je,hi),je.side=Ce,je.needsUpdate=!0,Xt=!0}}Xt===!0&&(P.updateMultisampleRenderTarget(yt),P.updateRenderTargetMipmap(yt)),v.setRenderTarget(Dt),v.setClearColor($,R),v.toneMapping=Ht}function Uo(C,V,Z){const J=V.isScene===!0?V.overrideMaterial:null;for(let K=0,wt=C.length;K<wt;K++){const Dt=C[K],Ht=Dt.object,Xt=Dt.geometry,Jt=J===null?Dt.material:J,jt=Dt.group;Ht.layers.test(Z.layers)&&Mh(Ht,V,Z,Xt,Jt,jt)}}function Mh(C,V,Z,J,K,wt){C.onBeforeRender(v,V,Z,J,K,wt),C.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),K.onBeforeRender(v,V,Z,J,C,wt),K.transparent===!0&&K.side===mn&&K.forceSinglePass===!1?(K.side=_n,K.needsUpdate=!0,v.renderBufferDirect(Z,V,J,K,C,wt),K.side=ai,K.needsUpdate=!0,v.renderBufferDirect(Z,V,J,K,C,wt),K.side=mn):v.renderBufferDirect(Z,V,J,K,C,wt),C.onAfterRender(v,V,Z,J,K,wt)}function zo(C,V,Z){V.isScene!==!0&&(V=mt);const J=zt.get(C),K=g.state.lights,wt=g.state.shadowsArray,Dt=K.state.version,Ht=Ct.getParameters(C,K.state,wt,V,Z),Xt=Ct.getProgramCacheKey(Ht);let Jt=J.programs;J.environment=C.isMeshStandardMaterial?V.environment:null,J.fog=V.fog,J.envMap=(C.isMeshStandardMaterial?q:A).get(C.envMap||J.environment),Jt===void 0&&(C.addEventListener("dispose",vt),Jt=new Map,J.programs=Jt);let jt=Jt.get(Xt);if(jt!==void 0){if(J.currentProgram===jt&&J.lightsStateVersion===Dt)return Sh(C,Ht),jt}else Ht.uniforms=Ct.getUniforms(C),C.onBuild(Z,Ht,v),C.onBeforeCompile(Ht,v),jt=Ct.acquireProgram(Ht,Xt),Jt.set(Xt,jt),J.uniforms=Ht.uniforms;const Yt=J.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Yt.clippingPlanes=qt.uniform),Sh(C,Ht),J.needsLights=Jm(C),J.lightsStateVersion=Dt,J.needsLights&&(Yt.ambientLightColor.value=K.state.ambient,Yt.lightProbe.value=K.state.probe,Yt.directionalLights.value=K.state.directional,Yt.directionalLightShadows.value=K.state.directionalShadow,Yt.spotLights.value=K.state.spot,Yt.spotLightShadows.value=K.state.spotShadow,Yt.rectAreaLights.value=K.state.rectArea,Yt.ltc_1.value=K.state.rectAreaLTC1,Yt.ltc_2.value=K.state.rectAreaLTC2,Yt.pointLights.value=K.state.point,Yt.pointLightShadows.value=K.state.pointShadow,Yt.hemisphereLights.value=K.state.hemi,Yt.directionalShadowMap.value=K.state.directionalShadowMap,Yt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Yt.spotShadowMap.value=K.state.spotShadowMap,Yt.spotLightMatrix.value=K.state.spotLightMatrix,Yt.spotLightMap.value=K.state.spotLightMap,Yt.pointShadowMap.value=K.state.pointShadowMap,Yt.pointShadowMatrix.value=K.state.pointShadowMatrix),J.currentProgram=jt,J.uniformsList=null,jt}function bh(C){if(C.uniformsList===null){const V=C.currentProgram.getUniforms();C.uniformsList=La.seqWithValue(V.seq,C.uniforms)}return C.uniformsList}function Sh(C,V){const Z=zt.get(C);Z.outputColorSpace=V.outputColorSpace,Z.batching=V.batching,Z.instancing=V.instancing,Z.instancingColor=V.instancingColor,Z.skinning=V.skinning,Z.morphTargets=V.morphTargets,Z.morphNormals=V.morphNormals,Z.morphColors=V.morphColors,Z.morphTargetsCount=V.morphTargetsCount,Z.numClippingPlanes=V.numClippingPlanes,Z.numIntersection=V.numClipIntersection,Z.vertexAlphas=V.vertexAlphas,Z.vertexTangents=V.vertexTangents,Z.toneMapping=V.toneMapping}function Km(C,V,Z,J,K){V.isScene!==!0&&(V=mt),P.resetTextureUnits();const wt=V.fog,Dt=J.isMeshStandardMaterial?V.environment:null,Ht=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ve,Xt=(J.isMeshStandardMaterial?q:A).get(J.envMap||Dt),Jt=J.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,jt=!!Z.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Yt=!!Z.morphAttributes.position,Ne=!!Z.morphAttributes.normal,yn=!!Z.morphAttributes.color;let je=ji;J.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(je=v.toneMapping);const hi=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ce=hi!==void 0?hi.length:0,Qt=zt.get(J),Dc=g.state.lights;if(Q===!0&&(st===!0||C!==b)){const Tn=C===b&&J.id===I;qt.setState(J,C,Tn)}let De=!1;J.version===Qt.__version?(Qt.needsLights&&Qt.lightsStateVersion!==Dc.state.version||Qt.outputColorSpace!==Ht||K.isBatchedMesh&&Qt.batching===!1||!K.isBatchedMesh&&Qt.batching===!0||K.isInstancedMesh&&Qt.instancing===!1||!K.isInstancedMesh&&Qt.instancing===!0||K.isSkinnedMesh&&Qt.skinning===!1||!K.isSkinnedMesh&&Qt.skinning===!0||K.isInstancedMesh&&Qt.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Qt.instancingColor===!1&&K.instanceColor!==null||Qt.envMap!==Xt||J.fog===!0&&Qt.fog!==wt||Qt.numClippingPlanes!==void 0&&(Qt.numClippingPlanes!==qt.numPlanes||Qt.numIntersection!==qt.numIntersection)||Qt.vertexAlphas!==Jt||Qt.vertexTangents!==jt||Qt.morphTargets!==Yt||Qt.morphNormals!==Ne||Qt.morphColors!==yn||Qt.toneMapping!==je||bt.isWebGL2===!0&&Qt.morphTargetsCount!==Ce)&&(De=!0):(De=!0,Qt.__version=J.version);let ns=Qt.currentProgram;De===!0&&(ns=zo(J,V,K));let wh=!1,Vr=!1,Ic=!1;const en=ns.getUniforms(),is=Qt.uniforms;if(gt.useProgram(ns.program)&&(wh=!0,Vr=!0,Ic=!0),J.id!==I&&(I=J.id,Vr=!0),wh||b!==C){en.setValue(k,"projectionMatrix",C.projectionMatrix),en.setValue(k,"viewMatrix",C.matrixWorldInverse);const Tn=en.map.cameraPosition;Tn!==void 0&&Tn.setValue(k,W.setFromMatrixPosition(C.matrixWorld)),bt.logarithmicDepthBuffer&&en.setValue(k,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&en.setValue(k,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,Vr=!0,Ic=!0)}if(K.isSkinnedMesh){en.setOptional(k,K,"bindMatrix"),en.setOptional(k,K,"bindMatrixInverse");const Tn=K.skeleton;Tn&&(bt.floatVertexTextures?(Tn.boneTexture===null&&Tn.computeBoneTexture(),en.setValue(k,"boneTexture",Tn.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}K.isBatchedMesh&&(en.setOptional(k,K,"batchingTexture"),en.setValue(k,"batchingTexture",K._matricesTexture,P));const Nc=Z.morphAttributes;if((Nc.position!==void 0||Nc.normal!==void 0||Nc.color!==void 0&&bt.isWebGL2===!0)&&Zt.update(K,Z,ns),(Vr||Qt.receiveShadow!==K.receiveShadow)&&(Qt.receiveShadow=K.receiveShadow,en.setValue(k,"receiveShadow",K.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(is.envMap.value=Xt,is.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Vr&&(en.setValue(k,"toneMappingExposure",v.toneMappingExposure),Qt.needsLights&&Zm(is,Ic),wt&&J.fog===!0&&xt.refreshFogUniforms(is,wt),xt.refreshMaterialUniforms(is,J,U,H,yt),La.upload(k,bh(Qt),is,P)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(La.upload(k,bh(Qt),is,P),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&en.setValue(k,"center",K.center),en.setValue(k,"modelViewMatrix",K.modelViewMatrix),en.setValue(k,"normalMatrix",K.normalMatrix),en.setValue(k,"modelMatrix",K.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const Tn=J.uniformsGroups;for(let Oc=0,Qm=Tn.length;Oc<Qm;Oc++)if(bt.isWebGL2){const Eh=Tn[Oc];ut.update(Eh,ns),ut.bind(Eh,ns)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ns}function Zm(C,V){C.ambientLightColor.needsUpdate=V,C.lightProbe.needsUpdate=V,C.directionalLights.needsUpdate=V,C.directionalLightShadows.needsUpdate=V,C.pointLights.needsUpdate=V,C.pointLightShadows.needsUpdate=V,C.spotLights.needsUpdate=V,C.spotLightShadows.needsUpdate=V,C.rectAreaLights.needsUpdate=V,C.hemisphereLights.needsUpdate=V}function Jm(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,V,Z){zt.get(C.texture).__webglTexture=V,zt.get(C.depthTexture).__webglTexture=Z;const J=zt.get(C);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=Z===void 0,J.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,V){const Z=zt.get(C);Z.__webglFramebuffer=V,Z.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(C,V=0,Z=0){T=C,M=V,S=Z;let J=!0,K=null,wt=!1,Dt=!1;if(C){const Xt=zt.get(C);Xt.__useDefaultFramebuffer!==void 0?(gt.bindFramebuffer(k.FRAMEBUFFER,null),J=!1):Xt.__webglFramebuffer===void 0?P.setupRenderTarget(C):Xt.__hasExternalTextures&&P.rebindTextures(C,zt.get(C.texture).__webglTexture,zt.get(C.depthTexture).__webglTexture);const Jt=C.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(Dt=!0);const jt=zt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(jt[V])?K=jt[V][Z]:K=jt[V],wt=!0):bt.isWebGL2&&C.samples>0&&P.useMultisampledRTT(C)===!1?K=zt.get(C).__webglMultisampledFramebuffer:Array.isArray(jt)?K=jt[Z]:K=jt,w.copy(C.viewport),O.copy(C.scissor),G=C.scissorTest}else w.copy(X).multiplyScalar(U).floor(),O.copy(tt).multiplyScalar(U).floor(),G=et;if(gt.bindFramebuffer(k.FRAMEBUFFER,K)&&bt.drawBuffers&&J&&gt.drawBuffers(C,K),gt.viewport(w),gt.scissor(O),gt.setScissorTest(G),wt){const Xt=zt.get(C.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+V,Xt.__webglTexture,Z)}else if(Dt){const Xt=zt.get(C.texture),Jt=V||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Xt.__webglTexture,Z||0,Jt)}I=-1},this.readRenderTargetPixels=function(C,V,Z,J,K,wt,Dt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=zt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Dt!==void 0&&(Ht=Ht[Dt]),Ht){gt.bindFramebuffer(k.FRAMEBUFFER,Ht);try{const Xt=C.texture,Jt=Xt.format,jt=Xt.type;if(Jt!==Sn&&St.convert(Jt)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Yt=jt===po&&(pt.has("EXT_color_buffer_half_float")||bt.isWebGL2&&pt.has("EXT_color_buffer_float"));if(jt!==$i&&St.convert(jt)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_TYPE)&&!(jt===bi&&(bt.isWebGL2||pt.has("OES_texture_float")||pt.has("WEBGL_color_buffer_float")))&&!Yt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=C.width-J&&Z>=0&&Z<=C.height-K&&k.readPixels(V,Z,J,K,St.convert(Jt),St.convert(jt),wt)}finally{const Xt=T!==null?zt.get(T).__webglFramebuffer:null;gt.bindFramebuffer(k.FRAMEBUFFER,Xt)}}},this.copyFramebufferToTexture=function(C,V,Z=0){const J=Math.pow(2,-Z),K=Math.floor(V.image.width*J),wt=Math.floor(V.image.height*J);P.setTexture2D(V,0),k.copyTexSubImage2D(k.TEXTURE_2D,Z,0,0,C.x,C.y,K,wt),gt.unbindTexture()},this.copyTextureToTexture=function(C,V,Z,J=0){const K=V.image.width,wt=V.image.height,Dt=St.convert(Z.format),Ht=St.convert(Z.type);P.setTexture2D(Z,0),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,Z.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,Z.unpackAlignment),V.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,J,C.x,C.y,K,wt,Dt,Ht,V.image.data):V.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,J,C.x,C.y,V.mipmaps[0].width,V.mipmaps[0].height,Dt,V.mipmaps[0].data):k.texSubImage2D(k.TEXTURE_2D,J,C.x,C.y,Dt,Ht,V.image),J===0&&Z.generateMipmaps&&k.generateMipmap(k.TEXTURE_2D),gt.unbindTexture()},this.copyTextureToTexture3D=function(C,V,Z,J,K=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const wt=C.max.x-C.min.x+1,Dt=C.max.y-C.min.y+1,Ht=C.max.z-C.min.z+1,Xt=St.convert(J.format),Jt=St.convert(J.type);let jt;if(J.isData3DTexture)P.setTexture3D(J,0),jt=k.TEXTURE_3D;else if(J.isDataArrayTexture||J.isCompressedArrayTexture)P.setTexture2DArray(J,0),jt=k.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,J.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,J.unpackAlignment);const Yt=k.getParameter(k.UNPACK_ROW_LENGTH),Ne=k.getParameter(k.UNPACK_IMAGE_HEIGHT),yn=k.getParameter(k.UNPACK_SKIP_PIXELS),je=k.getParameter(k.UNPACK_SKIP_ROWS),hi=k.getParameter(k.UNPACK_SKIP_IMAGES),Ce=Z.isCompressedTexture?Z.mipmaps[K]:Z.image;k.pixelStorei(k.UNPACK_ROW_LENGTH,Ce.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Ce.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,C.min.x),k.pixelStorei(k.UNPACK_SKIP_ROWS,C.min.y),k.pixelStorei(k.UNPACK_SKIP_IMAGES,C.min.z),Z.isDataTexture||Z.isData3DTexture?k.texSubImage3D(jt,K,V.x,V.y,V.z,wt,Dt,Ht,Xt,Jt,Ce.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),k.compressedTexSubImage3D(jt,K,V.x,V.y,V.z,wt,Dt,Ht,Xt,Ce.data)):k.texSubImage3D(jt,K,V.x,V.y,V.z,wt,Dt,Ht,Xt,Jt,Ce),k.pixelStorei(k.UNPACK_ROW_LENGTH,Yt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Ne),k.pixelStorei(k.UNPACK_SKIP_PIXELS,yn),k.pixelStorei(k.UNPACK_SKIP_ROWS,je),k.pixelStorei(k.UNPACK_SKIP_IMAGES,hi),K===0&&J.generateMipmaps&&k.generateMipmap(jt),gt.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?P.setTextureCube(C,0):C.isData3DTexture?P.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?P.setTexture2DArray(C,0):P.setTexture2D(C,0),gt.unbindTexture()},this.resetState=function(){M=0,S=0,T=null,gt.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===wu?"display-p3":"srgb",e.unpackColorSpace=he.workingColorSpace===rc?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===be?_s:Rf}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===_s?be:Ve}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class vx extends Lu{}vx.prototype.isWebGL1Renderer=!0;class Du extends Ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Iu{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Gl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const an=new E;class Xn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Qn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Qn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Qn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Qn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Xn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Nu extends On{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new At(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let js;const qr=new E,$s=new E,qs=new E,Ys=new ht,Yr=new ht,Yf=new Pt,aa=new E,Kr=new E,ca=new E,$d=new ht,hl=new ht,qd=new ht;class Kf extends Ae{constructor(t=new Nu){if(super(),this.isSprite=!0,this.type="Sprite",js===void 0){js=new ce;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Iu(e,5);js.setIndex([0,1,2,0,2,3]),js.setAttribute("position",new Xn(n,3,0,!1)),js.setAttribute("uv",new Xn(n,2,3,!1))}this.geometry=js,this.material=t,this.center=new ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),$s.setFromMatrixScale(this.matrixWorld),Yf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),qs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&$s.multiplyScalar(-qs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;la(aa.set(-.5,-.5,0),qs,o,$s,s,r),la(Kr.set(.5,-.5,0),qs,o,$s,s,r),la(ca.set(.5,.5,0),qs,o,$s,s,r),$d.set(0,0),hl.set(1,0),qd.set(1,1);let a=t.ray.intersectTriangle(aa,Kr,ca,!1,qr);if(a===null&&(la(Kr.set(-.5,.5,0),qs,o,$s,s,r),hl.set(0,1),a=t.ray.intersectTriangle(aa,ca,Kr,!1,qr),a===null))return;const c=t.ray.origin.distanceTo(qr);c<t.near||c>t.far||e.push({distance:c,point:qr.clone(),uv:Dn.getInterpolation(qr,aa,Kr,ca,$d,hl,qd,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function la(i,t,e,n,s,r){Ys.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Yr.x=r*Ys.x-s*Ys.y,Yr.y=s*Ys.x+r*Ys.y):Yr.copy(Ys),i.copy(t),i.x+=Yr.x,i.y+=Yr.y,i.applyMatrix4(Yf)}const Yd=new E,Kd=new ue,Zd=new ue,xx=new E,Jd=new Pt,ua=new E,dl=new En,Qd=new Pt,fl=new Nr;class Mx extends Oe{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Lh,this.bindMatrix=new Pt,this.bindMatrixInverse=new Pt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ee),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ua),this.boundingBox.expandByPoint(ua)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new En),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ua),this.boundingSphere.expandByPoint(ua)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dl.copy(this.boundingSphere),dl.applyMatrix4(s),t.ray.intersectsSphere(dl)!==!1&&(Qd.copy(s).invert(),fl.copy(t.ray).applyMatrix4(Qd),!(this.boundingBox!==null&&fl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,fl)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new ue,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Lh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ng?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;Kd.fromBufferAttribute(s.attributes.skinIndex,t),Zd.fromBufferAttribute(s.attributes.skinWeight,t),Yd.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const o=Zd.getComponent(r);if(o!==0){const a=Kd.getComponent(r);Jd.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(xx.copy(Yd).applyMatrix4(Jd),o)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}}class Zf extends Ae{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Jf extends Ye{constructor(t=null,e=1,n=1,s,r,o,a,c,l=qe,u=qe,h,d){super(null,o,a,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const t0=new Pt,bx=new Pt;class Ou{constructor(t=[],e=[]){this.uuid=jn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Pt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Pt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){const a=t[r]?t[r].matrixWorld:bx;t0.multiplyMatrices(a,e[r]),t0.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Ou(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Jf(e,t,t,Sn,bi);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Zf),this.bones.push(o),this.boneInverses.push(new Pt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const o=e[s];t.bones.push(o.uuid);const a=n[s];t.boneInverses.push(a.toArray())}return t}}class Xl extends Pe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ks=new Pt,e0=new Pt,ha=[],n0=new Ee,Sx=new Pt,Zr=new Oe,Jr=new En;class wx extends Oe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Xl(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Sx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ee),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ks),n0.copy(t.boundingBox).applyMatrix4(Ks),this.boundingBox.union(n0)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new En),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ks),Jr.copy(t.boundingSphere).applyMatrix4(Ks),this.boundingSphere.union(Jr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Zr.geometry=this.geometry,Zr.material=this.material,Zr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Jr.copy(this.boundingSphere),Jr.applyMatrix4(n),t.ray.intersectsSphere(Jr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ks),e0.multiplyMatrices(n,Ks),Zr.matrixWorld=e0,Zr.raycast(t,ha);for(let o=0,a=ha.length;o<a;o++){const c=ha[o];c.instanceId=r,c.object=this,e.push(c)}ha.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Xl(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class hn extends On{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new At(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const i0=new E,s0=new E,r0=new Pt,pl=new Nr,da=new En;class wn extends Ae{constructor(t=new ce,e=new hn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)i0.fromBufferAttribute(e,s-1),s0.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=i0.distanceTo(s0);t.setAttribute("lineDistance",new xe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(s),da.radius+=r,t.ray.intersectsSphere(da)===!1)return;r0.copy(s).invert(),pl.copy(t.ray).applyMatrix4(r0);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new E,u=new E,h=new E,d=new E,f=this.isLineSegments?2:1,m=n.index,g=n.attributes.position;if(m!==null){const p=Math.max(0,o.start),y=Math.min(m.count,o.start+o.count);for(let v=p,x=y-1;v<x;v+=f){const M=m.getX(v),S=m.getX(v+1);if(l.fromBufferAttribute(g,M),u.fromBufferAttribute(g,S),pl.distanceSqToSegment(l,u,d,h)>c)continue;d.applyMatrix4(this.matrixWorld);const I=t.ray.origin.distanceTo(d);I<t.near||I>t.far||e.push({distance:I,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),y=Math.min(g.count,o.start+o.count);for(let v=p,x=y-1;v<x;v+=f){if(l.fromBufferAttribute(g,v),u.fromBufferAttribute(g,v+1),pl.distanceSqToSegment(l,u,d,h)>c)continue;d.applyMatrix4(this.matrixWorld);const S=t.ray.origin.distanceTo(d);S<t.near||S>t.far||e.push({distance:S,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const o0=new E,a0=new E;class Fu extends wn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)o0.fromBufferAttribute(e,s),a0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+o0.distanceTo(a0);t.setAttribute("lineDistance",new xe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ex extends wn{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Uu extends On{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new At(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const c0=new Pt,jl=new Nr,fa=new En,pa=new E;class Qf extends Ae{constructor(t=new ce,e=new Uu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(s),fa.radius+=r,t.ray.intersectsSphere(fa)===!1)return;c0.copy(s).invert(),jl.copy(t.ray).applyMatrix4(c0);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=d,_=f;m<_;m++){const g=l.getX(m);pa.fromBufferAttribute(h,g),l0(pa,g,c,s,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let m=d,_=f;m<_;m++)pa.fromBufferAttribute(h,m),l0(pa,m,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function l0(i,t,e,n,s,r,o){const a=jl.distanceSqToPoint(i);if(a<e){const c=new E;jl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}class tp extends Ye{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ri{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ht:new E);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new E,s=[],r=[],o=[],a=new E,c=new Pt;for(let f=0;f<=t;f++){const m=f/t;s[f]=this.getTangentAt(m,new E)}r[0]=new E,o[0]=new E;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Be(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Be(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class lr extends Ri{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Tx extends lr{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function zu(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,h){let d=(o-r)/l-(a-r)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const ma=new E,ml=new zu,gl=new zu,_l=new zu;class lc extends Ri{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new E){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(ma.subVectors(s[0],s[1]).add(s[0]),l=ma);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ma.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ma),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),ml.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,m,_,g),gl.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,m,_,g),_l.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,m,_,g)}else this.curveType==="catmullrom"&&(ml.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),gl.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),_l.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return n.set(ml.calc(c),gl.calc(c),_l.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new E().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function u0(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Ax(i,t){const e=1-i;return e*e*t}function Cx(i,t){return 2*(1-i)*i*t}function Px(i,t){return i*i*t}function lo(i,t,e,n){return Ax(i,t)+Cx(i,e)+Px(i,n)}function Rx(i,t){const e=1-i;return e*e*e*t}function Lx(i,t){const e=1-i;return 3*e*e*i*t}function Dx(i,t){return 3*(1-i)*i*i*t}function Ix(i,t){return i*i*i*t}function uo(i,t,e,n,s){return Rx(i,t)+Lx(i,e)+Dx(i,n)+Ix(i,s)}class Nx extends Ri{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(uo(t,s.x,r.x,o.x,a.x),uo(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ox extends Ri{constructor(t=new E,e=new E,n=new E,s=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new E){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(uo(t,s.x,r.x,o.x,a.x),uo(t,s.y,r.y,o.y,a.y),uo(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fx extends Ri{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ux extends Ri{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zx extends Ri{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(lo(t,s.x,r.x,o.x),lo(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ep extends Ri{constructor(t=new E,e=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new E){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(lo(t,s.x,r.x,o.x),lo(t,s.y,r.y,o.y),lo(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kx extends Ri{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(u0(a,c.x,l.x,u.x,h.x),u0(a,c.y,l.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Bx=Object.freeze({__proto__:null,ArcCurve:Tx,CatmullRomCurve3:lc,CubicBezierCurve:Nx,CubicBezierCurve3:Ox,EllipseCurve:lr,LineCurve:Fx,LineCurve3:Ux,QuadraticBezierCurve:zx,QuadraticBezierCurve3:ep,SplineCurve:kx});class uc extends ce{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],u=[];let h=t;const d=(e-t)/s,f=new E,m=new ht;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){const p=r+g/n*o;f.x=h*Math.cos(p),f.y=h*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,u.push(m.x,m.y)}h+=d}for(let _=0;_<s;_++){const g=_*(n+1);for(let p=0;p<n;p++){const y=p+g,v=y,x=y+n+1,M=y+n+2,S=y+1;a.push(v,x,S),a.push(x,M,S)}}this.setIndex(a),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(l,3)),this.setAttribute("uv",new xe(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class qi extends ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new E,d=new E,f=[],m=[],_=[],g=[];for(let p=0;p<=n;p++){const y=[],v=p/n;let x=0;p===0&&o===0?x=.5/e:p===n&&c===Math.PI&&(x=-.5/e);for(let M=0;M<=e;M++){const S=M/e;h.x=-t*Math.cos(s+S*r)*Math.sin(o+v*a),h.y=t*Math.cos(o+v*a),h.z=t*Math.sin(s+S*r)*Math.sin(o+v*a),m.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),g.push(S+x,1-v),y.push(l++)}u.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const v=u[p][y+1],x=u[p][y],M=u[p+1][y],S=u[p+1][y+1];(p!==0||o>0)&&f.push(v,x,S),(p!==n-1||c<Math.PI)&&f.push(x,M,S)}this.setIndex(f),this.setAttribute("position",new xe(m,3)),this.setAttribute("normal",new xe(_,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ku extends ce{constructor(t=new ep(new E(-1,-1,0),new E(-1,1,0),new E(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new E,c=new E,l=new ht;let u=new E;const h=[],d=[],f=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new xe(h,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function _(){for(let v=0;v<e;v++)g(v);g(r===!1?e:0),y(),p()}function g(v){u=t.getPointAt(v/e,u);const x=o.normals[v],M=o.binormals[v];for(let S=0;S<=s;S++){const T=S/s*Math.PI*2,I=Math.sin(T),b=-Math.cos(T);c.x=b*x.x+I*M.x,c.y=b*x.y+I*M.y,c.z=b*x.z+I*M.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+n*c.x,a.y=u.y+n*c.y,a.z=u.z+n*c.z,h.push(a.x,a.y,a.z)}}function p(){for(let v=1;v<=e;v++)for(let x=1;x<=s;x++){const M=(s+1)*(v-1)+(x-1),S=(s+1)*v+(x-1),T=(s+1)*v+x,I=(s+1)*(v-1)+x;m.push(M,S,I),m.push(S,T,I)}}function y(){for(let v=0;v<=e;v++)for(let x=0;x<=s;x++)l.x=v/e,l.y=x/s,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ku(new Bx[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Gx extends ce{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new E,r=new E;if(t.index!==null){const o=t.attributes.position,a=t.index;let c=t.groups;c.length===0&&(c=[{start:0,count:a.count,materialIndex:0}]);for(let l=0,u=c.length;l<u;++l){const h=c[l],d=h.start,f=h.count;for(let m=d,_=d+f;m<_;m+=3)for(let g=0;g<3;g++){const p=a.getX(m+g),y=a.getX(m+(g+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,y),h0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,c=o.count/3;a<c;a++)for(let l=0;l<3;l++){const u=3*a+l,h=3*a+(l+1)%3;s.fromBufferAttribute(o,u),r.fromBufferAttribute(o,h),h0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new xe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function h0(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class $n extends On{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new At(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Su,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Li extends $n{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ht(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Be(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new At(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new At(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new At(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class d0 extends On{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new At(16777215),this.specular=new At(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Su,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}function ga(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Hx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Vx(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function f0(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=e[r]*t;for(let c=0;c!==t;++c)s[o++]=i[a+c]}return s}function np(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push.apply(e,o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=i[s++];while(r!==void 0)}class To{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){const a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){const a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Wx extends To{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:id,endingEnd:id}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case sd:r=t,a=2*e-n;break;case rd:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case sd:o=t,c=2*n-e;break;case rd:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}const l=(n-e)*.5,u=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-e)/(s-e),_=m*m,g=_*m,p=-d*g+2*d*_-d*m,y=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*m+1,v=(-1-f)*g+(1.5+f)*_+.5*m,x=f*g-f*_;for(let M=0;M!==a;++M)r[M]=p*o[u+M]+y*o[l+M]+v*o[c+M]+x*o[h+M];return r}}class Xx extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=(n-e)/(s-e),h=1-u;for(let d=0;d!==a;++d)r[d]=o[l+d]*h+o[c+d]*u;return r}}class jx extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class ui{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ga(e,this.TimeBufferType),this.values=ga(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ga(t.times,Array),values:ga(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new jx(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Xx(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Wx(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case mo:e=this.InterpolantFactoryMethodDiscrete;break;case _r:e=this.InterpolantFactoryMethodLinear;break;case Gc:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return mo;case this.InterpolantFactoryMethodLinear:return _r;case this.InterpolantFactoryMethodSmooth:return Gc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Hx(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Gc,r=t.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=t[a],u=t[a+1];if(l!==u&&(a!==1||l!==t[0]))if(s)c=!0;else{const h=a*n,d=h-n,f=h+n;for(let m=0;m!==n;++m){const _=e[h+m];if(_!==e[d+m]||_!==e[f+m]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];const h=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[h+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}ui.prototype.TimeBufferType=Float32Array;ui.prototype.ValueBufferType=Float32Array;ui.prototype.DefaultInterpolation=_r;class Fr extends ui{}Fr.prototype.ValueTypeName="bool";Fr.prototype.ValueBufferType=Array;Fr.prototype.DefaultInterpolation=mo;Fr.prototype.InterpolantFactoryMethodLinear=void 0;Fr.prototype.InterpolantFactoryMethodSmooth=void 0;class ip extends ui{}ip.prototype.ValueTypeName="color";class xr extends ui{}xr.prototype.ValueTypeName="number";class $x extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e);let l=t*a;for(let u=l+a;l!==u;l+=4)qn.slerpFlat(r,0,o,l-a,o,l,c);return r}}class ws extends ui{InterpolantFactoryMethodLinear(t){return new $x(this.times,this.values,this.getValueSize(),t)}}ws.prototype.ValueTypeName="quaternion";ws.prototype.DefaultInterpolation=_r;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Ur extends ui{}Ur.prototype.ValueTypeName="string";Ur.prototype.ValueBufferType=Array;Ur.prototype.DefaultInterpolation=mo;Ur.prototype.InterpolantFactoryMethodLinear=void 0;Ur.prototype.InterpolantFactoryMethodSmooth=void 0;class Mr extends ui{}Mr.prototype.ValueTypeName="vector";class qx{constructor(t,e=-1,n,s=Vg){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=jn(),this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(Kx(n[o]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,o=n.length;r!==o;++r)e.push(ui.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const u=Vx(c);c=f0(c,1,u),l=f0(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new xr(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){const l=t[a],u=l.name.match(r);if(u&&u.length>1){const h=u[1];let d=s[h];d||(s[h]=d=[]),d.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,d,f,m,_){if(f.length!==0){const g=[],p=[];np(f,g,p,m),g.length!==0&&_.push(new h(d,g,p))}},s=[],r=t.name||"default",o=t.fps||30,a=t.blendMode;let c=t.length||-1;const l=t.hierarchy||[];for(let h=0;h<l.length;h++){const d=l[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let _=0;_<d[m].morphTargets.length;_++)f[d[m].morphTargets[_]]=-1;for(const _ in f){const g=[],p=[];for(let y=0;y!==d[m].morphTargets.length;++y){const v=d[m];g.push(v.time),p.push(v.morphTarget===_?1:0)}s.push(new xr(".morphTargetInfluence["+_+"]",g,p))}c=f.length*o}else{const f=".bones["+e[h].name+"]";n(Mr,f+".position",d,"pos",s),n(ws,f+".quaternion",d,"rot",s),n(Mr,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,c,s,a)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function Yx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return xr;case"vector":case"vector2":case"vector3":case"vector4":return Mr;case"color":return ip;case"quaternion":return ws;case"bool":case"boolean":return Fr;case"string":return Ur}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Kx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=Yx(i.type);if(i.times===void 0){const e=[],n=[];np(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}const Vi={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Zx{constructor(t,e,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){const h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=l.length;h<d;h+=2){const f=l[h],m=l[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null}}}const Jx=new Zx;class As{constructor(t){this.manager=t!==void 0?t:Jx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}As.DEFAULT_MATERIAL_NAME="__DEFAULT";const _i={};class Qx extends Error{constructor(t,e){super(t),this.response=e}}class ja extends As{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=Vi.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(_i[t]!==void 0){_i[t].push({onLoad:e,onProgress:n,onError:s});return}_i[t]=[],_i[t].push({onLoad:e,onProgress:n,onError:s});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const u=_i[t],h=l.body.getReader(),d=l.headers.get("Content-Length")||l.headers.get("X-File-Size"),f=d?parseInt(d):0,m=f!==0;let _=0;const g=new ReadableStream({start(p){y();function y(){h.read().then(({done:v,value:x})=>{if(v)p.close();else{_+=x.byteLength;const M=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let S=0,T=u.length;S<T;S++){const I=u[S];I.onProgress&&I.onProgress(M)}p.enqueue(x),y()}})}}});return new Response(g)}else throw new Qx(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a===void 0)return l.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{Vi.add(t,l);const u=_i[t];delete _i[t];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onLoad&&f.onLoad(l)}}).catch(l=>{const u=_i[t];if(u===void 0)throw this.manager.itemError(t),l;delete _i[t];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}}class t3 extends As{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Vi.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;const a=go("img");function c(){u(),Vi.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(h){u(),s&&s(h),r.manager.itemError(t),r.manager.itemEnd(t)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}}class hc extends As{constructor(t){super(t)}load(t,e,n,s){const r=new Ye,o=new t3(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class dc extends Ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new At(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const yl=new Pt,p0=new E,m0=new E;class Bu{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new Pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cu,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;p0.setFromMatrixPosition(t.matrixWorld),e.position.copy(p0),m0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(m0),e.updateMatrixWorld(),yl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class e3 extends Bu{constructor(){super(new rn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=yr*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class sp extends dc{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new e3}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const g0=new Pt,Qr=new E,vl=new E;class n3 extends Bu{constructor(){super(new rn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new ue(2,1,1,1),new ue(0,1,1,1),new ue(3,1,1,1),new ue(1,1,1,1),new ue(3,0,1,1),new ue(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Qr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Qr),vl.copy(n.position),vl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(vl),n.updateMatrixWorld(),s.makeTranslation(-Qr.x,-Qr.y,-Qr.z),g0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(g0)}}class rp extends dc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new n3}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class i3 extends Bu{constructor(){super(new ac(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Da extends dc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new i3}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class op extends dc{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class ho{static decodeText(t){if(typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,s=t.length;n<s;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}class s3 extends ce{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class r3 extends As{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Vi.get(t);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{e&&e(l),r.manager.itemEnd(t)}).catch(l=>{s&&s(l)});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Vi.add(t,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){s&&s(l),Vi.remove(t),r.manager.itemError(t),r.manager.itemEnd(t)});Vi.add(t,c),r.manager.itemStart(t)}}class o3{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=_0();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function _0(){return(typeof performance>"u"?Date:performance).now()}const Gu="\\[\\]\\.:\\/",a3=new RegExp("["+Gu+"]","g"),Hu="[^"+Gu+"]",c3="[^"+Gu.replace("\\.","")+"]",l3=/((?:WC+[\/:])*)/.source.replace("WC",Hu),u3=/(WCOD+)?/.source.replace("WCOD",c3),h3=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hu),d3=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hu),f3=new RegExp("^"+l3+u3+h3+d3+"$"),p3=["material","materials","bones","map"];class m3{constructor(t,e,n){const s=n||pe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class pe{constructor(t,e,n){this.path=e,this.parsedPath=n||pe.parseTrackName(e),this.node=pe.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new pe.Composite(t,e,n):new pe(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(a3,"")}static parseTrackName(t){const e=f3.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);p3.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===e||a.uuid===e)return a;const c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=pe.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}const o=t[s];if(o===void 0){const l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}pe.Composite=m3;pe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};pe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};pe.prototype.GetterByBindingType=[pe.prototype._getValue_direct,pe.prototype._getValue_array,pe.prototype._getValue_arrayElement,pe.prototype._getValue_toArray];pe.prototype.SetterByBindingTypeAndVersioning=[[pe.prototype._setValue_direct,pe.prototype._setValue_direct_setNeedsUpdate,pe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pe.prototype._setValue_array,pe.prototype._setValue_array_setNeedsUpdate,pe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pe.prototype._setValue_arrayElement,pe.prototype._setValue_arrayElement_setNeedsUpdate,pe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pe.prototype._setValue_fromArray,pe.prototype._setValue_fromArray_setNeedsUpdate,pe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class $l extends Iu{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class fc{constructor(t,e,n=0,s=1/0){this.ray=new Nr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Tu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ql(t,this,n,e),n.sort(y0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ql(t[s],this,n,e);return n.sort(y0),n}}function y0(i,t){return i.distance-t.distance}function ql(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)ql(s[r],t,e,!0)}}let v0=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Be(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};const x0=new E,_a=new E;class g3{constructor(t=new E,e=new E){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){x0.subVectors(t,this.start),_a.subVectors(this.end,this.start);const n=_a.dot(_a);let r=_a.dot(x0)/n;return e&&(r=Be(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class _3 extends Fu{constructor(t=10,e=10,n=4473924,s=8947848){n=new At(n),s=new At(s);const r=e/2,o=t/e,a=t/2,c=[],l=[];for(let d=0,f=0,m=-a;d<=e;d++,m+=o){c.push(-a,0,m,a,0,m),c.push(m,0,-a,m,0,a);const _=d===r?n:s;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const u=new ce;u.setAttribute("position",new xe(c,3)),u.setAttribute("color",new xe(l,3));const h=new hn({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xu);const y3="modulepreload",v3=function(i){return"/"+i},M0={},Ei=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(e.map(c=>{if(c=v3(c),c in M0)return;M0[c]=!0;const l=c.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const h=document.createElement("link");if(h.rel=l?"stylesheet":y3,l||(h.as="script"),h.crossOrigin="",h.href=c,a&&h.setAttribute("nonce",a),document.head.appendChild(h),l)return new Promise((d,f)=>{h.addEventListener("load",d),h.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})},In=500,no=20,_t=50,ke=_t*206265,D={speedExponent:0,simulationSpeed:1,planetScale:1,sunScale:1,capMoonOrbits:!0,capMagneticFields:!0,starBrightness:.6,starSaturation:.3,magnitudeLimit:6,gamma:1,showOrbits:!0,showSunOrbits:!0,showPlanetOrbits:!0,showDwarfPlanetOrbits:!0,showMoonOrbits:!0,showAxes:!1,objectInfoMode:"window",coordinateSystem:"Heliocentric",referencePlane:"Ecliptic",showZodiacs:!1,showConstellations:!1,showAsterisms:!1,showZodiacSigns:!1,showHabitableZone:!1,showMagneticFields:!1,showSunMagneticFieldBasic:!1,showSunMagneticField:!1,showPlanetColors:!1,showDwarfPlanetColors:!1,showSun:!0,showPlanets:!0,showLargestMoons:!0,showMajorMoons:!1,showSmallMoons:!1,showDwarfPlanets:!1,showMissions:{voyager1:!1,voyager2:!1,pioneer10:!1,pioneer11:!1,galileo:!1,cassini:!1,newHorizons:!1,parkerSolarProbe:!1,juno:!1,rosetta:!1,ulysses:!1,teslaRoadster:!1},date:new Date,stop:!1,music:{enabled:!1,volume:.5,playlist:[],currentTrackName:"---",shuffle:!1},debug:!1},Yl={"67P":{a:3.46,e:.641,i:7.04,Omega:50.1,w:12.7,M:303.7},Ulysses:{a:3.37,e:.603,i:79.1,Omega:337.2,w:22.4,M:0},Arrokoth:{a:44.58,e:.042,i:2.45,Omega:293,w:323,M:0},Gaspra:{a:2.21,e:.173,i:4.11,Omega:252.99,w:129.88,M:173.1,epoch:24602005e-1},Ida:{a:2.861,e:.0444,i:1.13,Omega:323.59,w:113.88,M:205.36,epoch:24602005e-1},Steins:{a:2.363,e:.146,i:9.94,Omega:55.37,w:251.08,M:182.24,epoch:24582005e-1},Lutetia:{a:2.436,e:.164,i:3.06,Omega:80.84,w:250.3,M:38.89,epoch:24602005e-1},"Tesla Roadster":{a:1.3249,e:.25855,i:1.088,Omega:317.35,w:177.32,M:355,epoch:24581645e-1}},Yi=[{id:"voyager1",name:"Voyager 1",launchYear:1977,agency:"NASA",color:65535,summary:"Launched in 1977, Voyager 1 is the farthest human-made object from Earth. After visiting Jupiter and Saturn, it crossed the heliopause in 2012, becoming the first spacecraft to enter interstellar space.",image:"assets/missions/voyager.jpg",modelPath:"assets/models/voyager.glb",wikiUrl:"https://en.wikipedia.org/wiki/Voyager_1",exit:{ra:17.2,dec:12.1},timeline:[{date:"1977-09-05T13:00:00Z",label:"Launch"},{date:"1979-03-05",label:"Jupiter Flyby"},{date:"1980-11-12",label:"Saturn Flyby"},{date:"1990-02-14",label:"Pale Blue Dot"},{date:"2012-08-25",label:"Interstellar Space"}],waypoints:[{date:"1977-09-05T13:00:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1979-03-05",body:"Jupiter",offset:{x:.0028,y:.001,z:0}},{date:"1980-11-12",body:"Saturn",offset:{x:.0012,y:5e-4,z:2e-4}},{date:"1990-02-14",dist:40.11,label:"Pale Blue Dot"},{date:"2004-12-16",dist:94,label:"Termination Shock"},{date:"2012-08-25",dist:121,label:"Heliopause"},{date:"2024-01-01",dist:162,label:"Current"},{date:"2050-01-01",dist:255,label:"Future"}]},{id:"voyager2",name:"Voyager 2",launchYear:1977,agency:"NASA",color:16711935,summary:'Voyager 2 is the only spacecraft to have visited Uranus and Neptune. Launched shortly before Voyager 1, it completed the "Grand Tour" of the outer solar system and entered interstellar space in 2018.',image:"assets/missions/voyager.jpg",modelPath:"assets/models/voyager.glb",wikiUrl:"https://en.wikipedia.org/wiki/Voyager_2",exit:{ra:20,dec:-60},timeline:[{date:"1977-08-20T14:33:00Z",label:"Launch"},{date:"1979-07-09",label:"Jupiter Flyby"},{date:"1981-08-25",label:"Saturn Flyby"},{date:"1986-01-24",label:"Uranus Flyby"},{date:"1989-08-25",label:"Neptune Flyby"},{date:"2018-11-05",label:"Interstellar Space"}],waypoints:[{date:"1977-08-20T14:33:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1979-07-09",body:"Jupiter",offset:{x:.005,y:0,z:0}},{date:"1981-08-25",body:"Saturn",offset:{x:0,y:.0011,z:5e-4}},{date:"1986-01-24",body:"Uranus",offset:{x:.001,y:5e-4,z:0}},{date:"1989-08-25",body:"Neptune",offset:{x:5e-4,y:2e-4,z:0}},{date:"2007-08-30",dist:84,label:"Termination Shock"},{date:"2018-11-05",dist:119,label:"Heliopause"},{date:"2024-01-01",dist:136,label:"Current"},{date:"2050-01-01",dist:215,label:"Future"}]},{id:"pioneer10",name:"Pioneer 10",launchYear:1972,agency:"NASA",color:16753920,summary:"Pioneer 10 was the first spacecraft to travel through the asteroid belt and visit Jupiter. It sent back the first close-up images of the giant planet and carried a famous golden plaque with a message for extraterrestrial life.",image:"assets/missions/pioneer.jpg",modelPath:"assets/models/pioneer_10.glb",wikiUrl:"https://en.wikipedia.org/wiki/Pioneer_10",exit:{ra:5.2,dec:26},timeline:[{date:"1972-03-03T01:05:00Z",label:"Launch"},{date:"1973-12-04",label:"Jupiter Flyby"},{date:"1983-06-13",label:"Neptune Orbit"},{date:"2003-01-23",label:"End of Mission (Signal Lost)"}],waypoints:[{date:"1972-03-03T01:05:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1973-12-04",body:"Jupiter",offset:{x:9e-4,y:0,z:0}},{date:"1976-01-01",dist:9.5,label:"Saturn Orbit"},{date:"1983-06-13",dist:30.1,label:"Neptune Orbit"},{date:"2003-01-23",dist:80,label:"End of Comms"},{date:"2024-01-01",dist:135,label:"Current"},{date:"2050-01-01",dist:200,label:"Future"}]},{id:"pioneer11",name:"Pioneer 11",launchYear:1973,agency:"NASA",color:65280,summary:"Pioneer 11 was the second mission to investigate Jupiter and the outer solar system and the first to explore Saturn and its main rings.",image:"assets/missions/pioneer.jpg",modelPath:"assets/models/pioneer_10.glb",wikiUrl:"https://en.wikipedia.org/wiki/Pioneer_11",exit:{ra:18.8,dec:-8},timeline:[{date:"1973-04-06T01:26:00Z",label:"Launch"},{date:"1974-12-02",label:"Jupiter Flyby"},{date:"1979-09-01",label:"Saturn Flyby"},{date:"1995-11-24",label:"End of Mission (Signal Lost)"}],waypoints:[{date:"1973-04-06T01:26:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1974-12-02",body:"Jupiter",offset:{x:28e-5,y:4e-4,z:0}},{date:"1979-09-01",body:"Saturn",offset:{x:14e-5,y:1e-4,z:1e-4}},{date:"1995-11-24",dist:44,label:"End of Comms"},{date:"2024-01-01",dist:113,label:"Current"},{date:"2050-01-01",dist:175,label:"Future"}]},{id:"galileo",name:"Galileo",launchYear:1989,agency:"NASA",color:16766720,summary:"Galileo was an unmanned spacecraft that studied the planet Jupiter and its moons, as well as several other Solar System bodies. It was the first spacecraft to orbit an outer planet.",image:"assets/missions/galileo.jpg",modelPath:"assets/models/Galileo.glb",wikiUrl:"https://en.wikipedia.org/wiki/Galileo_(spacecraft)",timeline:[{date:"1989-10-19T00:30:00Z",label:"Launch"},{date:"1990-02-10",label:"Venus Flyby"},{date:"1990-12-08",label:"Earth Flyby 1"},{date:"1991-10-29",label:"Gaspra Flyby"},{date:"1992-12-08",label:"Earth Flyby 2"},{date:"1993-08-28",label:"Ida Flyby"},{date:"1995-12-07",label:"Jupiter Arrival"},{date:"2003-09-21",label:"Impact into Jupiter"}],waypoints:[{date:"1989-10-19T00:30:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1990-02-10",body:"Venus",offset:{x:11e-5,y:0,z:0}},{date:"1990-12-08",body:"Earth",offset:{x:5e-5,y:0,z:0}},{date:"1991-10-29",customBody:"Gaspra",label:"Gaspra"},{date:"1992-12-08",body:"Earth",offset:{x:45e-6,y:0,z:1e-5}},{date:"1993-08-28",customBody:"Ida",label:"Ida"},{date:"1995-12-07",body:"Jupiter",offset:{x:.003,y:0,z:0}},{date:"2003-09-21",body:"Jupiter",label:"Impact"}]},{id:"cassini",name:"Cassini",launchYear:1997,agency:"NASA/ESA/ASI",color:35071,summary:"Cassini-Huygens was a collaboration between NASA, ESA, and ASI to send a probe to study the planet Saturn and its system, including its rings and natural satellites.",image:"assets/missions/cassini.jpg",modelPath:"assets/models/cassini.glb",wikiUrl:"https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens",timeline:[{date:"1997-10-15T07:28:00Z",label:"Launch"},{date:"1998-04-26",label:"Venus Flyby 1"},{date:"1999-06-24",label:"Venus Flyby 2"},{date:"1999-08-18",label:"Earth Flyby"},{date:"2000-12-30",label:"Jupiter Flyby"},{date:"2004-07-01",label:"Saturn Arrival"},{date:"2017-09-15",label:"Grand Finale"}],waypoints:[{date:"1997-10-15T07:28:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1998-04-26",body:"Venus",offset:{x:42e-6,y:1e-5,z:0}},{date:"1999-06-24",body:"Venus",offset:{x:44e-6,y:1e-5,z:0}},{date:"1999-08-18",body:"Earth",offset:{x:5e-5,y:1e-5,z:0}},{date:"2000-12-30",body:"Jupiter",offset:{x:.065,y:.01,z:0}},{date:"2004-07-01",body:"Saturn",offset:{x:5e-4,y:0,z:0}},{date:"2017-09-15",body:"Saturn",label:"Grand Finale"}]},{id:"newHorizons",name:"New Horizons",launchYear:2006,agency:"NASA",color:16777215,summary:"New Horizons performed the first flyby of Pluto in 2015 and the first flyby of a Kuiper Belt object (Arrokoth) in 2019.",image:"assets/missions/new_horizons.jpg",wikiUrl:"https://en.wikipedia.org/wiki/New_Horizons",exit:{ra:19.9,dec:-20},timeline:[{date:"2006-01-19T18:52:00Z",label:"Launch"},{date:"2007-02-28",label:"Jupiter Flyby"},{date:"2015-07-14",label:"Pluto Flyby"},{date:"2019-01-01",label:"Arrokoth Flyby"}],waypoints:[{date:"2006-01-19T18:52:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"2007-02-28",body:"Jupiter",offset:{x:.002,y:0,z:0}},{date:"2015-07-14",body:"Pluto",offset:{x:1e-4,y:0,z:0}},{date:"2019-01-01",customBody:"Arrokoth"},{date:"2024-01-01",dist:58,label:"Current"},{date:"2050-01-01",dist:140,label:"Future"}]},{id:"parkerSolarProbe",name:"Parker Solar Probe",launchYear:2018,agency:"NASA",color:16729344,summary:"Parker Solar Probe is a NASA robotic spacecraft launched in 2018, with the mission of making observations of the outer corona of the Sun.",image:"assets/missions/parker.jpg",modelPath:"assets/models/parker_solar_probe.glb",wikiUrl:"https://en.wikipedia.org/wiki/Parker_Solar_Probe",timeline:[{date:"2018-08-12T06:17:00Z",label:"Launch"},{date:"2018-10-03",label:"Venus Flyby 1"},{date:"2018-11-06",label:"First Perihelion"},{date:"2024-12-24",label:"Closest Approach"}],waypoints:[{date:"2018-08-12T06:17:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"2018-10-03",body:"Venus"},{date:"2018-11-06",label:"Perihelion 1",pos:new E(.16,0,0)},{date:"2019-12-26",body:"Venus"},{date:"2020-07-11",body:"Venus"},{date:"2021-02-20",body:"Venus"},{date:"2021-10-16",body:"Venus"},{date:"2023-08-21",body:"Venus"},{date:"2024-11-06",body:"Venus"},{date:"2024-12-24",label:"Closest",pos:new E(.04,0,0)}]},{id:"juno",name:"Juno",launchYear:2011,agency:"NASA",color:16738740,summary:"Juno is a NASA space probe orbiting the planet Jupiter. It was built by Lockheed Martin and is operated by NASA's Jet Propulsion Laboratory.",image:"assets/missions/juno.jpg",wikiUrl:"https://en.wikipedia.org/wiki/Juno_(spacecraft)",timeline:[{date:"2011-08-05T15:20:00Z",label:"Launch"},{date:"2013-10-09",label:"Earth Flyby"},{date:"2016-07-04",label:"Jupiter Arrival"},{date:"2021-06-07",label:"Ganymede Flyby"},{date:"2022-09-29",label:"Europa Flyby"}],waypoints:[{date:"2011-08-05T15:20:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"2013-10-09",body:"Earth",offset:{x:46e-6,y:0,z:1e-5}},{date:"2016-07-04",body:"Jupiter"},{date:"2021-06-07",body:"Jupiter",label:"Ganymede Flyby"},{date:"2022-09-29",body:"Jupiter",label:"Europa Flyby"},{date:"2023-12-30",body:"Jupiter",label:"Io Flyby"},{date:"2024-01-01",body:"Jupiter"}]},{id:"rosetta",name:"Rosetta",launchYear:2004,agency:"ESA",color:9055202,summary:"Rosetta was a space probe built by the European Space Agency which performed a detailed study of comet 67P/Churyumov–Gerasimenko.",image:"assets/missions/rosetta.jpg",modelPath:"assets/models/ibex.glb",wikiUrl:"https://en.wikipedia.org/wiki/Rosetta_(spacecraft)",timeline:[{date:"2004-03-02T08:27:00Z",label:"Launch"},{date:"2005-03-04",label:"Earth Flyby 1"},{date:"2007-02-25",label:"Mars Flyby"},{date:"2007-11-13",label:"Earth Flyby 2"},{date:"2008-09-05",label:"Steins Flyby"},{date:"2009-11-13",label:"Earth Flyby 3"},{date:"2010-07-10",label:"Lutetia Flyby"},{date:"2014-08-06",label:"Comet Arrival"},{date:"2016-09-30",label:"End of Mission"}],waypoints:[{date:"2004-03-02T08:27:00Z",body:"Earth",lat:5.2,lon:-52.7},{date:"2005-03-04",body:"Earth",offset:{x:55e-6,y:0,z:0}},{date:"2007-02-25",body:"Mars",offset:{x:25e-6,y:0,z:0}},{date:"2007-11-13",body:"Earth",offset:{x:78e-6,y:0,z:0}},{date:"2008-09-05",customBody:"Steins"},{date:"2009-11-13",body:"Earth",offset:{x:59e-6,y:0,z:0}},{date:"2010-07-10",customBody:"Lutetia"},{date:"2014-08-06",customBody:"67P"},{date:"2016-09-30",customBody:"67P"}]},{id:"ulysses",name:"Ulysses",launchYear:1990,agency:"NASA/ESA",color:16776960,summary:"Ulysses was a robotic space probe designed to study the Sun at all latitudes. It used a gravity assist from Jupiter to leave the ecliptic plane.",image:"assets/missions/ulysses.jpg",modelPath:"assets/models/Ulysses.glb",wikiUrl:"https://en.wikipedia.org/wiki/Ulysses_(spacecraft)",timeline:[{date:"1990-10-06T18:05:00Z",label:"Launch"},{date:"1992-02-08",label:"Jupiter Flyby"},{date:"1994-06-26",label:"South Pole Pass 1"},{date:"1995-06-19",label:"North Pole Pass 1"},{date:"2009-06-30",label:"End of Mission"}],waypoints:[{date:"1990-10-06T18:05:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"1992-02-08",body:"Jupiter",offset:{x:.0025,y:.001,z:.001}},{date:"1994-06-26",customBody:"Ulysses"},{date:"1995-06-19",customBody:"Ulysses"},{date:"2000-09-08",customBody:"Ulysses"},{date:"2001-08-31",customBody:"Ulysses"},{date:"2007-02-07",customBody:"Ulysses"},{date:"2008-01-14",customBody:"Ulysses"},{date:"2009-06-30",customBody:"Ulysses"}]},{id:"teslaRoadster",name:"Tesla Roadster",launchYear:2018,agency:"SpaceX",color:14883127,summary:"Elon Musk's personal Tesla Roadster, served as the dummy payload for the February 2018 Falcon Heavy test flight and is now an artificial satellite of the Sun. 'Starman', a mannequin dressed in a spacesuit, occupies the driver's seat.",image:"assets/missions/tesla_roadster.jpg",modelPath:"assets/models/tesla_roadster.glb",wikiUrl:"https://en.wikipedia.org/wiki/Elon_Musk%27s_Tesla_Roadster",timeline:[{date:"2018-02-06T20:45:00Z",label:"Launch"},{date:"2018-02-08",label:"Moon Flyby"},{date:"2020-10-07",label:"Mars Flyby"},{date:"2035-04-22",label:"Mars Flyby"},{date:"2047-01-11",label:"Earth Flyby"},{date:"2050-03-19",label:"Earth Flyby"},{date:"2052-09-05",label:"Mars Flyby"},{date:"2067-04-15",label:"Mars Flyby"},{date:"2084-09-17",label:"Mars Flyby"},{date:"2085-01-01",label:"Earth Flyby"},{date:"2088-03-09",label:"Earth Flyby"}],waypoints:[{date:"2018-02-06T20:45:00Z",body:"Earth",lat:28.5,lon:-80.5},{date:"2018-02-08",body:"Moon",offset:{x:9e-4,y:1e-4,z:0}},{date:"2020-10-07",body:"Mars",offset:{x:.05,y:0,z:0}},{date:"2024-01-01",dist:1.5,label:"Current"}]}],Bt={log:(...i)=>{D.debug&&console.log(...i)},warn:(...i)=>{D.debug&&console.warn(...i)},error:(...i)=>{console.error(...i)},info:(...i)=>{D.debug&&console.info(...i)}};class x3{constructor(){nt(this,"queue");nt(this,"textureLoader");nt(this,"maxConcurrent");nt(this,"activeRequests");nt(this,"priorityBodies");nt(this,"registry");nt(this,"manifest");nt(this,"manifestLoading");this.queue=[],this.textureLoader=new hc,this.maxConcurrent=6,this.activeRequests=0,this.priorityBodies=["Sun","Jupiter","Saturn","Neptune","Earth"],this.registry={},this.manifest=null,this.manifestLoading=!1,this.loadManifest()}async loadManifest(){if(!this.manifestLoading){this.manifestLoading=!0;try{const t=await fetch("assets/textures.json");if(!t.ok)throw new Error("Manifest not found");const e=await t.json();this.manifest=new Set(e),Bt.log(`TextureManager: Loaded manifest with ${this.manifest.size} files`)}catch(t){Bt.warn("TextureManager: Failed to load texture manifest, falling back to trial-and-error",t),this.manifest=null}finally{this.manifestLoading=!1,this.processQueue()}}}loadTexture(t,e,n,s=!1,r=null,o="map"){let a=100;const c=this.priorityBodies.indexOf(n);c!==-1?a=c:s&&r==="largest"&&(a=10),this.registry[n]={originalPath:t,material:e,priority:a,mapType:o},this.addToQueue(t,e,0,a,o),this.addToQueue(t,e,1,a,o),this.processQueue()}loadHighRes(t){const e=this.registry[t];e&&(this.addToQueue(e.originalPath,e.material,2,e.priority,e.mapType),this.processQueue())}addToQueue(t,e,n,s,r="map"){this.queue.push({originalPath:t,material:e,stage:n,priority:s,mapType:r}),this.queue.sort((o,a)=>o.stage===2&&a.stage!==2?-1:a.stage===2&&o.stage!==2?1:o.stage!==a.stage?o.stage-a.stage:o.priority-a.priority)}processQueue(){if(this.manifestLoading||this.activeRequests>=this.maxConcurrent||this.queue.length===0)return;const t=this.queue.shift();if(!t)return;this.activeRequests++;const e=[];t.stage===0?(e.push(this.getPathForStage(t.originalPath,"lowres","webp")),e.push(this.getPathForStage(t.originalPath,"lowres"))):t.stage===1?(e.push(this.getPathForStage(t.originalPath,"midres","webp")),e.push(this.getPathForStage(t.originalPath,"midres"))):t.stage===2?(e.push(this.getPathForStage(t.originalPath,"highres","webp")),e.push(this.getPathForStage(t.originalPath,"highres"))):e.push(t.originalPath),this.tryLoadTexture(e,t),this.processQueue()}tryLoadTexture(t,e){let n=t;if(this.manifest){const r=this.manifest;n=t.filter(o=>{const a=o.startsWith("/")?o.slice(1):o;return r.has(a)}),n.length===0&&t.length>0&&Bt.log(`TextureManager: Skipped ${e.originalPath} (Stage ${e.stage}) - No valid files in manifest`)}if(n.length===0){this.activeRequests--,this.processQueue();return}const s=n.shift();s&&this.textureLoader.load(s,r=>{Bt.log(`TextureManager: Loaded ${s} successfully`),!e.material.userData.currentStage||e.stage>=e.material.userData.currentStage?(r.wrapS=Ms,r.wrapT=ln,e.material[e.mapType]=r,e.material.color&&e.material.color.setHex(16777215),e.material.needsUpdate=!0,e.material.userData.currentStage=e.stage,Bt.log(`TextureManager: Applied ${s} to material`)):Bt.log(`TextureManager: Skipped applying ${s} (current stage ${e.material.userData.currentStage} >= ${e.stage})`),this.activeRequests--,this.processQueue()},void 0,r=>{Bt.warn(`TextureManager: Failed to load ${s}`,r),this.tryLoadTexture(t,e)})}getPathForStage(t,e,n=null){const s=t.lastIndexOf("/");if(s===-1)return t;const r=t.substring(0,s);let o=t.substring(s+1);if(n){const a=o.lastIndexOf(".");a!==-1&&(o=`${o.substring(0,a)}.${n}`)}return`${r}/${e}/${o}`}}const br=new x3,b0=new Ee,ya=new E;class ap extends s3{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new xe(t,3)),this.setAttribute("uv",new xe(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new $l(e,6,1);return this.setAttribute("instanceStart",new Xn(n,3,0)),this.setAttribute("instanceEnd",new Xn(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new $l(e,6,1);return this.setAttribute("instanceColorStart",new Xn(n,3,0)),this.setAttribute("instanceColorEnd",new Xn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Gx(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ee);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),b0.setFromBufferAttribute(e),this.boundingBox.union(b0))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new En),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ya.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ya)),ya.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(ya));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}ft.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ht(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};pn.line={uniforms:Au.merge([ft.common,ft.fog,ft.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Ao extends Ci{constructor(t){super({type:"LineMaterial",uniforms:Au.clone(pn.line.uniforms),vertexShader:pn.line.vertexShader,fragmentShader:pn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}}const S0=new E,w0=new E,Je=new ue,Qe=new ue,Kn=new ue,xl=new E,Ml=new Pt,tn=new g3,E0=new E,va=new Ee,xa=new En,Zn=new ue;let ti,ys;function T0(i,t,e){return Zn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),Zn.multiplyScalar(1/Zn.w),Zn.x=ys/e.width,Zn.y=ys/e.height,Zn.applyMatrix4(i.projectionMatrixInverse),Zn.multiplyScalar(1/Zn.w),Math.abs(Math.max(Zn.x,Zn.y))}function M3(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,c=o;a<c;a++){tn.start.fromBufferAttribute(s,a),tn.end.fromBufferAttribute(r,a),tn.applyMatrix4(e);const l=new E,u=new E;ti.distanceSqToSegment(tn.start,tn.end,u,l),u.distanceTo(l)<ys*.5&&t.push({point:u,pointOnLine:l,distance:ti.origin.distanceTo(u),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function b3(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,c=a.attributes.instanceStart,l=a.attributes.instanceEnd,u=Math.min(a.instanceCount,c.count),h=-t.near;ti.at(1,Kn),Kn.w=1,Kn.applyMatrix4(t.matrixWorldInverse),Kn.applyMatrix4(n),Kn.multiplyScalar(1/Kn.w),Kn.x*=r.x/2,Kn.y*=r.y/2,Kn.z=0,xl.copy(Kn),Ml.multiplyMatrices(t.matrixWorldInverse,o);for(let d=0,f=u;d<f;d++){if(Je.fromBufferAttribute(c,d),Qe.fromBufferAttribute(l,d),Je.w=1,Qe.w=1,Je.applyMatrix4(Ml),Qe.applyMatrix4(Ml),Je.z>h&&Qe.z>h)continue;if(Je.z>h){const v=Je.z-Qe.z,x=(Je.z-h)/v;Je.lerp(Qe,x)}else if(Qe.z>h){const v=Qe.z-Je.z,x=(Qe.z-h)/v;Qe.lerp(Je,x)}Je.applyMatrix4(n),Qe.applyMatrix4(n),Je.multiplyScalar(1/Je.w),Qe.multiplyScalar(1/Qe.w),Je.x*=r.x/2,Je.y*=r.y/2,Qe.x*=r.x/2,Qe.y*=r.y/2,tn.start.copy(Je),tn.start.z=0,tn.end.copy(Qe),tn.end.z=0;const _=tn.closestPointToPointParameter(xl,!0);tn.at(_,E0);const g=fe.lerp(Je.z,Qe.z,_),p=g>=-1&&g<=1,y=xl.distanceTo(E0)<ys*.5;if(p&&y){tn.start.fromBufferAttribute(c,d),tn.end.fromBufferAttribute(l,d),tn.start.applyMatrix4(o),tn.end.applyMatrix4(o);const v=new E,x=new E;ti.distanceSqToSegment(tn.start,tn.end,x,v),e.push({point:x,pointOnLine:v,distance:ti.origin.distanceTo(x),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}class S3 extends Oe{constructor(t=new ap,e=new Ao({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,c=e.count;o<c;o++,a+=2)S0.fromBufferAttribute(e,o),w0.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+S0.distanceTo(w0);const r=new $l(s,2,1);return t.setAttribute("instanceDistanceStart",new Xn(r,1,0)),t.setAttribute("instanceDistanceEnd",new Xn(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;ti=t.ray;const o=this.matrixWorld,a=this.geometry,c=this.material;ys=c.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),xa.copy(a.boundingSphere).applyMatrix4(o);let l;if(n)l=ys*.5;else{const h=Math.max(s.near,xa.distanceToPoint(ti.origin));l=T0(s,h,c.resolution)}if(xa.radius+=l,ti.intersectsSphere(xa)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),va.copy(a.boundingBox).applyMatrix4(o);let u;if(n)u=ys*.5;else{const h=Math.max(s.near,va.distanceToPoint(ti.origin));u=T0(s,h,c.resolution)}va.expandByScalar(u),ti.intersectsBox(va)!==!1&&(n?M3(this,e):b3(this,s,e))}}class Qi extends ap{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}fromLine(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}}class zr extends S3{constructor(t=new Qi,e=new Ao({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}}function w3(i){const t=new Ao({color:i.color,linewidth:i.linewidth||1.5,dashed:!0,transparent:!0,depthWrite:!1,depthTest:!0,worldUnits:!1,resolution:i.resolution||new ht(window.innerWidth,window.innerHeight)});return t.transparent=!0,t.depthWrite=!0,t.dashSize=1e10,t.gapSize=0,t.uniforms.uCurrentTime={value:0},t.uniforms.uDashSize={value:10},t.uniforms.uTotalLength={value:1},t.onBeforeCompile=e=>{e.uniforms.uCurrentTime=t.uniforms.uCurrentTime,e.uniforms.uDashSize=t.uniforms.uDashSize,e.uniforms.uTotalLength=t.uniforms.uTotalLength,e.fragmentShader=`
      uniform float uCurrentTime;
      uniform float uDashSize;
      uniform float uTotalLength;
      ${e.fragmentShader}
    `;const n=`
      #ifdef USE_DASH
      // --- CUSTOM MISSION LOGIC ---
      
      // Calculate progress (0.0 to 1.0)
      float progress = vLineDistance / uTotalLength;
      
      if (progress > uCurrentTime) {
          // --- FUTURE (Stippled) ---
          
          // Screen-Space Stipple
          float stipple = mod(gl_FragCoord.x + gl_FragCoord.y, 16.0); // 16px period
          
          // Hard cut
          if (stipple > 8.0) discard; 
          
          // Dim the rest
          alpha *= 0.3; 
          
      } else {
          // --- PAST (Gradient Trail) ---
          
          float trailProgress = 0.0;
          if (uCurrentTime > 0.0001) {
              trailProgress = progress / uCurrentTime;
          }
          
          // Fade In: Tail (0.0) -> Head (1.0)
          float fadeFactor = 0.35 + (0.65 * trailProgress);
          
          // Multiply final alpha
          alpha *= fadeFactor;
      }

      #endif

      // Final Output
      gl_FragColor = vec4( diffuseColor.rgb, alpha );
    `;e.fragmentShader=e.fragmentShader.replace("gl_FragColor = vec4( diffuseColor.rgb, alpha );",n)},t}const dn=class dn{static async load(t){if(dn.cache[t])return dn.cache[t];if(dn.loading[t])return dn.loading[t];const e=(async()=>{try{const n=await fetch(`data/missions/binary/${t}.bin?v=${Date.now()}`);if(!n.ok)return console.warn(`Failed to load trajectory for ${t}: ${n.statusText}`),null;const s=await n.arrayBuffer(),r=new Float64Array(s);return dn.cache[t]=r,r}catch(n){return console.error(`Error loading trajectory for ${t}:`,n),null}finally{delete dn.loading[t]}})();return dn.loading[t]=e,e}static getPositionAtTime(t,e){const n=dn.cache[t];if(!n)return null;const s=4,r=n.length/s;if(r===0)return null;const o=n[0],a=n[(r-1)*s];if(e<o||e>a)return null;let c=0,l=r-1,u=-1;for(;c<=l;){const x=Math.floor((c+l)/2),M=n[x*s];if(M===e){u=x;break}else M<e?(u=x,c=x+1):l=x-1}if(u===-1||u>=r-1)return null;const h=n[u*s],d=u*s,f=n[(u+1)*s],m=(u+1)*s,_=f-h;if(_<=0)return new E(n[d+1],n[d+2],n[d+3]);const g=(e-h)/_,p=n[d+1]+(n[m+1]-n[d+1])*g,y=n[d+2]+(n[m+2]-n[d+2])*g,v=n[d+3]+(n[m+3]-n[d+3])*g;return new E(p,y,v)}static getGeometryData(t){const e=dn.cache[t];if(!e)return null;const n=[],s=4,r=e.length/s;for(let o=0;o<r;o++)n.push(e[o*s+1],e[o*s+2],e[o*s+3]);return n}static getDetailedRange(t){const e=dn.cache[t];if(!e||e.length<4)return null;const n=4,s=e.length/n;return{start:e[0],end:e[(s-1)*n]}}};nt(dn,"cache",{}),nt(dn,"loading",{});let Jn=dn;/**
    @preserve

    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*//**
 * @fileoverview Astronomy calculation library for browser scripting and Node.js.
 * @author Don Cross <cosinekitty@gmail.com>
 * @license MIT
 */const pc=173.1446326846693,ye=14959787069098932e-8,cp=63241.07708807546,lt=.017453292519943295,Kl=.26179938779914946,Re=57.29577951308232,Vu=3.819718634205488,E3=71492,T3=66854,A3=69911,C3=1821.6,P3=1560.8,R3=2631.2,L3=2410.3,lp=365.24217,A0=new Date("2000-01-01T12:00:00Z"),Vn=2*Math.PI,zi=3600*(180/Math.PI),ir=484813681109536e-20,up=180*60*60,D3=2*up,C0=7292115e-11,I3=up/Math.PI,N3=-.17-5*Math.log10(I3),$a=29.530588,mc=24*3600,O3=mc*1e3,hp=.9972695717592592,io=695700,dp=io/ye,ni=.996647180302104,sr=ni*ni,Pi=6378.1366,F3=Pi/ye,U3=Pi*ni,fp=6371,z3=88,k3=fp+z3,B3=1738.1,G3=B3/ye,Ln=1737.4,pp=1736,H3=pp/ye,V3=34/60,Wu=81.30056,Co=.0002959122082855911,Zl=4912547451450812e-26,Jl=7243452486162703e-25,_o=8887692390113509e-25,Ql=9549535105779258e-26,Sr=2825345909524226e-22,wr=8459715185680659e-23,Er=1292024916781969e-23,Tr=1524358900784276e-23,W3=218869976542597e-26,qa=_o/Wu;function tu(i){switch(i){case z.Sun:return Co;case z.Mercury:return Zl;case z.Venus:return Jl;case z.Earth:return _o;case z.Moon:return qa;case z.EMB:return _o+qa;case z.Mars:return Ql;case z.Jupiter:return Sr;case z.Saturn:return wr;case z.Uranus:return Er;case z.Neptune:return Tr;case z.Pluto:return W3;default:throw`Do not know mass product for body: ${i}`}}function Ya(i){if(i!==!0&&i!==!1)throw console.trace(),`Value is not boolean: ${i}`;return i}function se(i){if(!Number.isFinite(i))throw console.trace(),`Value is not a finite number: ${i}`;return i}function Zs(i){return i-Math.floor(i)}function gc(i,t){const e=i.x*i.x+i.y*i.y+i.z*i.z;if(Math.abs(e)<1e-8)throw"AngleBetween: first vector is too short.";const n=t.x*t.x+t.y*t.y+t.z*t.z;if(Math.abs(n)<1e-8)throw"AngleBetween: second vector is too short.";const s=(i.x*t.x+i.y*t.y+i.z*t.z)/Math.sqrt(e*n);return s<=-1?180:s>=1?0:Re*Math.acos(s)}var z;(function(i){i.Sun="Sun",i.Moon="Moon",i.Mercury="Mercury",i.Venus="Venus",i.Earth="Earth",i.Mars="Mars",i.Jupiter="Jupiter",i.Saturn="Saturn",i.Uranus="Uranus",i.Neptune="Neptune",i.Pluto="Pluto",i.SSB="SSB",i.EMB="EMB",i.Star1="Star1",i.Star2="Star2",i.Star3="Star3",i.Star4="Star4",i.Star5="Star5",i.Star6="Star6",i.Star7="Star7",i.Star8="Star8"})(z||(z={}));const X3=[z.Star1,z.Star2,z.Star3,z.Star4,z.Star5,z.Star6,z.Star7,z.Star8],j3=[{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0}];function mp(i){const t=X3.indexOf(i);return t>=0?j3[t]:null}function _c(i){const t=mp(i);return t&&t.dist>0?t:null}function $3(i,t,e,n){const s=mp(i);if(!s)throw`Invalid star body: ${i}`;if(se(t),se(e),se(n),t<0||t>=24)throw`Invalid right ascension for star: ${t}`;if(e<-90||e>90)throw`Invalid declination for star: ${e}`;if(n<1)throw`Invalid star distance: ${n}`;s.ra=t,s.dec=e,s.dist=n*cp}var we;(function(i){i[i.From2000=0]="From2000",i[i.Into2000=1]="Into2000"})(we||(we={}));const ci={Mercury:{OrbitalPeriod:87.969},Venus:{OrbitalPeriod:224.701},Earth:{OrbitalPeriod:365.256},Mars:{OrbitalPeriod:686.98},Jupiter:{OrbitalPeriod:4332.589},Saturn:{OrbitalPeriod:10759.22},Uranus:{OrbitalPeriod:30685.4},Neptune:{OrbitalPeriod:60189},Pluto:{OrbitalPeriod:90560}};function q3(i){if(i in ci)return ci[i].OrbitalPeriod;throw`Unknown orbital period for: ${i}`}const un={Mercury:[[[[4.40250710144,0,0],[.40989414977,1.48302034195,26087.9031415742],[.050462942,4.47785489551,52175.8062831484],[.00855346844,1.16520322459,78263.70942472259],[.00165590362,4.11969163423,104351.61256629678],[.00034561897,.77930768443,130439.51570787099],[7583476e-11,3.71348404924,156527.41884944518]],[[26087.90313685529,0,0],[.01131199811,6.21874197797,26087.9031415742],[.00292242298,3.04449355541,52175.8062831484],[.00075775081,6.08568821653,78263.70942472259],[.00019676525,2.80965111777,104351.61256629678]]],[[[.11737528961,1.98357498767,26087.9031415742],[.02388076996,5.03738959686,52175.8062831484],[.01222839532,3.14159265359,0],[.0054325181,1.79644363964,78263.70942472259],[.0012977877,4.83232503958,104351.61256629678],[.00031866927,1.58088495658,130439.51570787099],[7963301e-11,4.60972126127,156527.41884944518]],[[.00274646065,3.95008450011,26087.9031415742],[.00099737713,3.14159265359,0]]],[[[.39528271651,0,0],[.07834131818,6.19233722598,26087.9031415742],[.00795525558,2.95989690104,52175.8062831484],[.00121281764,6.01064153797,78263.70942472259],[.00021921969,2.77820093972,104351.61256629678],[4354065e-11,5.82894543774,130439.51570787099]],[[.0021734774,4.65617158665,26087.9031415742],[.00044141826,1.42385544001,52175.8062831484]]]],Venus:[[[[3.17614666774,0,0],[.01353968419,5.59313319619,10213.285546211],[.00089891645,5.30650047764,20426.571092422],[5477194e-11,4.41630661466,7860.4193924392],[3455741e-11,2.6996444782,11790.6290886588],[2372061e-11,2.99377542079,3930.2096962196],[1317168e-11,5.18668228402,26.2983197998],[1664146e-11,4.25018630147,1577.3435424478],[1438387e-11,4.15745084182,9683.5945811164],[1200521e-11,6.15357116043,30639.856638633]],[[10213.28554621638,0,0],[.00095617813,2.4640651111,10213.285546211],[7787201e-11,.6247848222,20426.571092422]]],[[[.05923638472,.26702775812,10213.285546211],[.00040107978,1.14737178112,20426.571092422],[.00032814918,3.14159265359,0]],[[.00287821243,1.88964962838,10213.285546211]]],[[[.72334820891,0,0],[.00489824182,4.02151831717,10213.285546211],[1658058e-11,4.90206728031,20426.571092422],[1378043e-11,1.12846591367,11790.6290886588],[1632096e-11,2.84548795207,7860.4193924392],[498395e-11,2.58682193892,9683.5945811164],[221985e-11,2.01346696541,19367.1891622328],[237454e-11,2.55136053886,15720.8387848784]],[[.00034551041,.89198706276,10213.285546211]]]],Earth:[[[[1.75347045673,0,0],[.03341656453,4.66925680415,6283.0758499914],[.00034894275,4.62610242189,12566.1516999828],[3417572e-11,2.82886579754,3.523118349],[3497056e-11,2.74411783405,5753.3848848968],[3135899e-11,3.62767041756,77713.7714681205],[2676218e-11,4.41808345438,7860.4193924392],[2342691e-11,6.13516214446,3930.2096962196],[1273165e-11,2.03709657878,529.6909650946],[1324294e-11,.74246341673,11506.7697697936],[901854e-11,2.04505446477,26.2983197998],[1199167e-11,1.10962946234,1577.3435424478],[857223e-11,3.50849152283,398.1490034082],[779786e-11,1.17882681962,5223.6939198022],[99025e-10,5.23268072088,5884.9268465832],[753141e-11,2.53339052847,5507.5532386674],[505267e-11,4.58292599973,18849.2275499742],[492392e-11,4.20505711826,775.522611324],[356672e-11,2.91954114478,.0673103028],[284125e-11,1.89869240932,796.2980068164],[242879e-11,.34481445893,5486.777843175],[317087e-11,5.84901948512,11790.6290886588],[271112e-11,.31486255375,10977.078804699],[206217e-11,4.80646631478,2544.3144198834],[205478e-11,1.86953770281,5573.1428014331],[202318e-11,2.45767790232,6069.7767545534],[126225e-11,1.08295459501,20.7753954924],[155516e-11,.83306084617,213.299095438]],[[6283.0758499914,0,0],[.00206058863,2.67823455808,6283.0758499914],[4303419e-11,2.63512233481,12566.1516999828]],[[8721859e-11,1.07253635559,6283.0758499914]]],[[],[[.00227777722,3.4137662053,6283.0758499914],[3805678e-11,3.37063423795,12566.1516999828]]],[[[1.00013988784,0,0],[.01670699632,3.09846350258,6283.0758499914],[.00013956024,3.05524609456,12566.1516999828],[308372e-10,5.19846674381,77713.7714681205],[1628463e-11,1.17387558054,5753.3848848968],[1575572e-11,2.84685214877,7860.4193924392],[924799e-11,5.45292236722,11506.7697697936],[542439e-11,4.56409151453,3930.2096962196],[47211e-10,3.66100022149,5884.9268465832],[85831e-11,1.27079125277,161000.6857376741],[57056e-11,2.01374292245,83996.84731811189],[55736e-11,5.2415979917,71430.69561812909],[174844e-11,3.01193636733,18849.2275499742],[243181e-11,4.2734953079,11790.6290886588]],[[.00103018607,1.10748968172,6283.0758499914],[1721238e-11,1.06442300386,12566.1516999828]],[[4359385e-11,5.78455133808,6283.0758499914]]]],Mars:[[[[6.20347711581,0,0],[.18656368093,5.0503710027,3340.6124266998],[.01108216816,5.40099836344,6681.2248533996],[.00091798406,5.75478744667,10021.8372800994],[.00027744987,5.97049513147,3.523118349],[.00010610235,2.93958560338,2281.2304965106],[.00012315897,.84956094002,2810.9214616052],[8926784e-11,4.15697846427,.0172536522],[8715691e-11,6.11005153139,13362.4497067992],[6797556e-11,.36462229657,398.1490034082],[7774872e-11,3.33968761376,5621.8429232104],[3575078e-11,1.6618650571,2544.3144198834],[4161108e-11,.22814971327,2942.4634232916],[3075252e-11,.85696614132,191.4482661116],[2628117e-11,.64806124465,3337.0893083508],[2937546e-11,6.07893711402,.0673103028],[2389414e-11,5.03896442664,796.2980068164],[2579844e-11,.02996736156,3344.1355450488],[1528141e-11,1.14979301996,6151.533888305],[1798806e-11,.65634057445,529.6909650946],[1264357e-11,3.62275122593,5092.1519581158],[1286228e-11,3.06796065034,2146.1654164752],[1546404e-11,2.91579701718,1751.539531416],[1024902e-11,3.69334099279,8962.4553499102],[891566e-11,.18293837498,16703.062133499],[858759e-11,2.4009381194,2914.0142358238],[832715e-11,2.46418619474,3340.5951730476],[83272e-10,4.49495782139,3340.629680352],[712902e-11,3.66335473479,1059.3819301892],[748723e-11,3.82248614017,155.4203994342],[723861e-11,.67497311481,3738.761430108],[635548e-11,2.92182225127,8432.7643848156],[655162e-11,.48864064125,3127.3133312618],[550474e-11,3.81001042328,.9803210682],[55275e-10,4.47479317037,1748.016413067],[425966e-11,.55364317304,6283.0758499914],[415131e-11,.49662285038,213.299095438],[472167e-11,3.62547124025,1194.4470102246],[306551e-11,.38052848348,6684.7479717486],[312141e-11,.99853944405,6677.7017350506],[293198e-11,4.22131299634,20.7753954924],[302375e-11,4.48618007156,3532.0606928114],[274027e-11,.54222167059,3340.545116397],[281079e-11,5.88163521788,1349.8674096588],[231183e-11,1.28242156993,3870.3033917944],[283602e-11,5.7688543494,3149.1641605882],[236117e-11,5.75503217933,3333.498879699],[274033e-11,.13372524985,3340.6797370026],[299395e-11,2.78323740866,6254.6266625236]],[[3340.61242700512,0,0],[.01457554523,3.60433733236,3340.6124266998],[.00168414711,3.92318567804,6681.2248533996],[.00020622975,4.26108844583,10021.8372800994],[3452392e-11,4.7321039319,3.523118349],[2586332e-11,4.60670058555,13362.4497067992],[841535e-11,4.45864030426,2281.2304965106]],[[.00058152577,2.04961712429,3340.6124266998],[.00013459579,2.45738706163,6681.2248533996]]],[[[.03197134986,3.76832042431,3340.6124266998],[.00298033234,4.10616996305,6681.2248533996],[.00289104742,0,0],[.00031365539,4.4465105309,10021.8372800994],[34841e-9,4.7881254926,13362.4497067992]],[[.00217310991,6.04472194776,3340.6124266998],[.00020976948,3.14159265359,0],[.00012834709,1.60810667915,6681.2248533996]]],[[[1.53033488271,0,0],[.1418495316,3.47971283528,3340.6124266998],[.00660776362,3.81783443019,6681.2248533996],[.00046179117,4.15595316782,10021.8372800994],[8109733e-11,5.55958416318,2810.9214616052],[7485318e-11,1.77239078402,5621.8429232104],[5523191e-11,1.3643630377,2281.2304965106],[382516e-10,4.49407183687,13362.4497067992],[2306537e-11,.09081579001,2544.3144198834],[1999396e-11,5.36059617709,3337.0893083508],[2484394e-11,4.9254563992,2942.4634232916],[1960195e-11,4.74249437639,3344.1355450488],[1167119e-11,2.11260868341,5092.1519581158],[1102816e-11,5.00908403998,398.1490034082],[899066e-11,4.40791133207,529.6909650946],[992252e-11,5.83861961952,6151.533888305],[807354e-11,2.10217065501,1059.3819301892],[797915e-11,3.44839203899,796.2980068164],[740975e-11,1.49906336885,2146.1654164752]],[[.01107433345,2.03250524857,3340.6124266998],[.00103175887,2.37071847807,6681.2248533996],[128772e-9,0,0],[.0001081588,2.70888095665,10021.8372800994]],[[.00044242249,.47930604954,3340.6124266998],[8138042e-11,.86998389204,6681.2248533996]]]],Jupiter:[[[[.59954691494,0,0],[.09695898719,5.06191793158,529.6909650946],[.00573610142,1.44406205629,7.1135470008],[.00306389205,5.41734730184,1059.3819301892],[.00097178296,4.14264726552,632.7837393132],[.00072903078,3.64042916389,522.5774180938],[.00064263975,3.41145165351,103.0927742186],[.00039806064,2.29376740788,419.4846438752],[.00038857767,1.27231755835,316.3918696566],[.00027964629,1.7845459182,536.8045120954],[.0001358973,5.7748104079,1589.0728952838],[8246349e-11,3.5822792584,206.1855484372],[8768704e-11,3.63000308199,949.1756089698],[7368042e-11,5.0810119427,735.8765135318],[626315e-10,.02497628807,213.299095438],[6114062e-11,4.51319998626,1162.4747044078],[4905396e-11,1.32084470588,110.2063212194],[5305285e-11,1.30671216791,14.2270940016],[5305441e-11,4.18625634012,1052.2683831884],[4647248e-11,4.69958103684,3.9321532631],[3045023e-11,4.31676431084,426.598190876],[2609999e-11,1.56667394063,846.0828347512],[2028191e-11,1.06376530715,3.1813937377],[1764763e-11,2.14148655117,1066.49547719],[1722972e-11,3.88036268267,1265.5674786264],[1920945e-11,.97168196472,639.897286314],[1633223e-11,3.58201833555,515.463871093],[1431999e-11,4.29685556046,625.6701923124],[973272e-11,4.09764549134,95.9792272178]],[[529.69096508814,0,0],[.00489503243,4.2208293947,529.6909650946],[.00228917222,6.02646855621,7.1135470008],[.00030099479,4.54540782858,1059.3819301892],[.0002072092,5.45943156902,522.5774180938],[.00012103653,.16994816098,536.8045120954],[6067987e-11,4.42422292017,103.0927742186],[5433968e-11,3.98480737746,419.4846438752],[4237744e-11,5.89008707199,14.2270940016]],[[.00047233601,4.32148536482,7.1135470008],[.00030649436,2.929777887,529.6909650946],[.00014837605,3.14159265359,0]]],[[[.02268615702,3.55852606721,529.6909650946],[.00109971634,3.90809347197,1059.3819301892],[.00110090358,0,0],[8101428e-11,3.60509572885,522.5774180938],[6043996e-11,4.25883108339,1589.0728952838],[6437782e-11,.30627119215,536.8045120954]],[[.00078203446,1.52377859742,529.6909650946]]],[[[5.20887429326,0,0],[.25209327119,3.49108639871,529.6909650946],[.00610599976,3.84115365948,1059.3819301892],[.00282029458,2.57419881293,632.7837393132],[.00187647346,2.07590383214,522.5774180938],[.00086792905,.71001145545,419.4846438752],[.00072062974,.21465724607,536.8045120954],[.00065517248,5.9799588479,316.3918696566],[.00029134542,1.67759379655,103.0927742186],[.00030135335,2.16132003734,949.1756089698],[.00023453271,3.54023522184,735.8765135318],[.00022283743,4.19362594399,1589.0728952838],[.00023947298,.2745803748,7.1135470008],[.00013032614,2.96042965363,1162.4747044078],[970336e-10,1.90669633585,206.1855484372],[.00012749023,2.71550286592,1052.2683831884],[7057931e-11,2.18184839926,1265.5674786264],[6137703e-11,6.26418240033,846.0828347512],[2616976e-11,2.00994012876,1581.959348283]],[[.0127180152,2.64937512894,529.6909650946],[.00061661816,3.00076460387,1059.3819301892],[.00053443713,3.89717383175,522.5774180938],[.00031185171,4.88276958012,536.8045120954],[.00041390269,0,0]]]],Saturn:[[[[.87401354025,0,0],[.11107659762,3.96205090159,213.299095438],[.01414150957,4.58581516874,7.1135470008],[.00398379389,.52112032699,206.1855484372],[.00350769243,3.30329907896,426.598190876],[.00206816305,.24658372002,103.0927742186],[792713e-9,3.84007056878,220.4126424388],[.00023990355,4.66976924553,110.2063212194],[.00016573588,.43719228296,419.4846438752],[.00014906995,5.76903183869,316.3918696566],[.0001582029,.93809155235,632.7837393132],[.00014609559,1.56518472,3.9321532631],[.00013160301,4.44891291899,14.2270940016],[.00015053543,2.71669915667,639.897286314],[.00013005299,5.98119023644,11.0457002639],[.00010725067,3.12939523827,202.2533951741],[5863206e-11,.23656938524,529.6909650946],[5227757e-11,4.20783365759,3.1813937377],[6126317e-11,1.76328667907,277.0349937414],[5019687e-11,3.17787728405,433.7117378768],[459255e-10,.61977744975,199.0720014364],[4005867e-11,2.24479718502,63.7358983034],[2953796e-11,.98280366998,95.9792272178],[387367e-10,3.22283226966,138.5174968707],[2461186e-11,2.03163875071,735.8765135318],[3269484e-11,.77492638211,949.1756089698],[1758145e-11,3.2658010994,522.5774180938],[1640172e-11,5.5050445305,846.0828347512],[1391327e-11,4.02333150505,323.5054166574],[1580648e-11,4.37265307169,309.2783226558],[1123498e-11,2.83726798446,415.5524906121],[1017275e-11,3.71700135395,227.5261894396],[848642e-11,3.1915017083,209.3669421749]],[[213.2990952169,0,0],[.01297370862,1.82834923978,213.299095438],[.00564345393,2.88499717272,7.1135470008],[.00093734369,1.06311793502,426.598190876],[.00107674962,2.27769131009,206.1855484372],[.00040244455,2.04108104671,220.4126424388],[.00019941774,1.2795439047,103.0927742186],[.00010511678,2.7488034213,14.2270940016],[6416106e-11,.38238295041,639.897286314],[4848994e-11,2.43037610229,419.4846438752],[4056892e-11,2.92133209468,110.2063212194],[3768635e-11,3.6496533078,3.9321532631]],[[.0011644133,1.17988132879,7.1135470008],[.00091841837,.0732519584,213.299095438],[.00036661728,0,0],[.00015274496,4.06493179167,206.1855484372]]],[[[.04330678039,3.60284428399,213.299095438],[.00240348302,2.85238489373,426.598190876],[.00084745939,0,0],[.00030863357,3.48441504555,220.4126424388],[.00034116062,.57297307557,206.1855484372],[.0001473407,2.11846596715,639.897286314],[9916667e-11,5.79003188904,419.4846438752],[6993564e-11,4.7360468972,7.1135470008],[4807588e-11,5.43305312061,316.3918696566]],[[.00198927992,4.93901017903,213.299095438],[.00036947916,3.14159265359,0],[.00017966989,.5197943111,426.598190876]]],[[[9.55758135486,0,0],[.52921382865,2.39226219573,213.299095438],[.01873679867,5.2354960466,206.1855484372],[.01464663929,1.64763042902,426.598190876],[.00821891141,5.93520042303,316.3918696566],[.00547506923,5.0153261898,103.0927742186],[.0037168465,2.27114821115,220.4126424388],[.00361778765,3.13904301847,7.1135470008],[.00140617506,5.70406606781,632.7837393132],[.00108974848,3.29313390175,110.2063212194],[.00069006962,5.94099540992,419.4846438752],[.00061053367,.94037691801,639.897286314],[.00048913294,1.55733638681,202.2533951741],[.00034143772,.19519102597,277.0349937414],[.00032401773,5.47084567016,949.1756089698],[.00020936596,.46349251129,735.8765135318],[9796004e-11,5.20477537945,1265.5674786264],[.00011993338,5.98050967385,846.0828347512],[208393e-9,1.52102476129,433.7117378768],[.00015298404,3.0594381494,529.6909650946],[6465823e-11,.17732249942,1052.2683831884],[.00011380257,1.7310542704,522.5774180938],[3419618e-11,4.94550542171,1581.959348283]],[[.0618298134,.2584351148,213.299095438],[.00506577242,.71114625261,206.1855484372],[.00341394029,5.79635741658,426.598190876],[.00188491195,.47215589652,220.4126424388],[.00186261486,3.14159265359,0],[.00143891146,1.40744822888,7.1135470008]],[[.00436902572,4.78671677509,213.299095438]]]],Uranus:[[[[5.48129294297,0,0],[.09260408234,.89106421507,74.7815985673],[.01504247898,3.6271926092,1.4844727083],[.00365981674,1.89962179044,73.297125859],[.00272328168,3.35823706307,149.5631971346],[.00070328461,5.39254450063,63.7358983034],[.00068892678,6.09292483287,76.2660712756],[.00061998615,2.26952066061,2.9689454166],[.00061950719,2.85098872691,11.0457002639],[.0002646877,3.14152083966,71.8126531507],[.00025710476,6.11379840493,454.9093665273],[.0002107885,4.36059339067,148.0787244263],[.00017818647,1.74436930289,36.6485629295],[.00014613507,4.73732166022,3.9321532631],[.00011162509,5.8268179635,224.3447957019],[.0001099791,.48865004018,138.5174968707],[9527478e-11,2.95516862826,35.1640902212],[7545601e-11,5.236265824,109.9456887885],[4220241e-11,3.23328220918,70.8494453042],[40519e-9,2.277550173,151.0476698429],[3354596e-11,1.0654900738,4.4534181249],[2926718e-11,4.62903718891,9.5612275556],[349034e-10,5.48306144511,146.594251718],[3144069e-11,4.75199570434,77.7505439839],[2922333e-11,5.35235361027,85.8272988312],[2272788e-11,4.36600400036,70.3281804424],[2051219e-11,1.51773566586,.1118745846],[2148602e-11,.60745949945,38.1330356378],[1991643e-11,4.92437588682,277.0349937414],[1376226e-11,2.04283539351,65.2203710117],[1666902e-11,3.62744066769,380.12776796],[1284107e-11,3.11347961505,202.2533951741],[1150429e-11,.93343589092,3.1813937377],[1533221e-11,2.58594681212,52.6901980395],[1281604e-11,.54271272721,222.8603229936],[1372139e-11,4.19641530878,111.4301614968],[1221029e-11,.1990065003,108.4612160802],[946181e-11,1.19253165736,127.4717966068],[1150989e-11,4.17898916639,33.6796175129]],[[74.7815986091,0,0],[.00154332863,5.24158770553,74.7815985673],[.00024456474,1.71260334156,1.4844727083],[9258442e-11,.4282973235,11.0457002639],[8265977e-11,1.50218091379,63.7358983034],[915016e-10,1.41213765216,149.5631971346]]],[[[.01346277648,2.61877810547,74.7815985673],[623414e-9,5.08111189648,149.5631971346],[.00061601196,3.14159265359,0],[9963722e-11,1.61603805646,76.2660712756],[992616e-10,.57630380333,73.297125859]],[[.00034101978,.01321929936,74.7815985673]]],[[[19.21264847206,0,0],[.88784984413,5.60377527014,74.7815985673],[.03440836062,.32836099706,73.297125859],[.0205565386,1.7829515933,149.5631971346],[.0064932241,4.52247285911,76.2660712756],[.00602247865,3.86003823674,63.7358983034],[.00496404167,1.40139935333,454.9093665273],[.00338525369,1.58002770318,138.5174968707],[.00243509114,1.57086606044,71.8126531507],[.00190522303,1.99809394714,1.4844727083],[.00161858838,2.79137786799,148.0787244263],[.00143706183,1.38368544947,11.0457002639],[.00093192405,.17437220467,36.6485629295],[.00071424548,4.24509236074,224.3447957019],[.00089806014,3.66105364565,109.9456887885],[.00039009723,1.66971401684,70.8494453042],[.00046677296,1.39976401694,35.1640902212],[.00039025624,3.36234773834,277.0349937414],[.00036755274,3.88649278513,146.594251718],[.00030348723,.70100838798,151.0476698429],[.00029156413,3.180563367,77.7505439839],[.00022637073,.72518687029,529.6909650946],[.00011959076,1.7504339214,984.6003316219],[.00025620756,5.25656086672,380.12776796]],[[.01479896629,3.67205697578,74.7815985673]]]],Neptune:[[[[5.31188633046,0,0],[.0179847553,2.9010127389,38.1330356378],[.01019727652,.48580922867,1.4844727083],[.00124531845,4.83008090676,36.6485629295],[.00042064466,5.41054993053,2.9689454166],[.00037714584,6.09221808686,35.1640902212],[.00033784738,1.24488874087,76.2660712756],[.00016482741,7727998e-11,491.5579294568],[9198584e-11,4.93747051954,39.6175083461],[899425e-10,.27462171806,175.1660598002]],[[38.13303563957,0,0],[.00016604172,4.86323329249,1.4844727083],[.00015744045,2.27887427527,38.1330356378]]],[[[.03088622933,1.44104372644,38.1330356378],[.00027780087,5.91271884599,76.2660712756],[.00027623609,0,0],[.00015355489,2.52123799551,36.6485629295],[.00015448133,3.50877079215,39.6175083461]]],[[[30.07013205828,0,0],[.27062259632,1.32999459377,38.1330356378],[.01691764014,3.25186135653,36.6485629295],[.00807830553,5.18592878704,1.4844727083],[.0053776051,4.52113935896,35.1640902212],[.00495725141,1.5710564165,491.5579294568],[.00274571975,1.84552258866,175.1660598002],[.0001201232,1.92059384991,1021.2488945514],[.00121801746,5.79754470298,76.2660712756],[.00100896068,.3770272493,73.297125859],[.00135134092,3.37220609835,39.6175083461],[7571796e-11,1.07149207335,388.4651552382]]]]};function Xu(i){var t,e,n,s,r,o,a;const c=2e3+(i-14)/lp;return c<-500?(t=(c-1820)/100,-20+32*t*t):c<500?(t=c/100,e=t*t,n=t*e,s=e*e,r=e*n,o=n*n,10583.6-1014.41*t+33.78311*e-5.952053*n-.1798452*s+.022174192*r+.0090316521*o):c<1600?(t=(c-1e3)/100,e=t*t,n=t*e,s=e*e,r=e*n,o=n*n,1574.2-556.01*t+71.23472*e+.319781*n-.8503463*s-.005050998*r+.0083572073*o):c<1700?(t=c-1600,e=t*t,n=t*e,120-.9808*t-.01532*e+n/7129):c<1800?(t=c-1700,e=t*t,n=t*e,s=e*e,8.83+.1603*t-.0059285*e+13336e-8*n-s/1174e3):c<1860?(t=c-1800,e=t*t,n=t*e,s=e*e,r=e*n,o=n*n,a=n*s,13.72-.332447*t+.0068612*e+.0041116*n-37436e-8*s+121272e-10*r-1699e-10*o+875e-12*a):c<1900?(t=c-1860,e=t*t,n=t*e,s=e*e,r=e*n,7.62+.5737*t-.251754*e+.01680668*n-.0004473624*s+r/233174):c<1920?(t=c-1900,e=t*t,n=t*e,s=e*e,-2.79+1.494119*t-.0598939*e+.0061966*n-197e-6*s):c<1941?(t=c-1920,e=t*t,n=t*e,21.2+.84493*t-.0761*e+.0020936*n):c<1961?(t=c-1950,e=t*t,n=t*e,29.07+.407*t-e/233+n/2547):c<1986?(t=c-1975,e=t*t,n=t*e,45.45+1.067*t-e/260-n/718):c<2005?(t=c-2e3,e=t*t,n=t*e,s=e*e,r=e*n,63.86+.3345*t-.060374*e+.0017275*n+651814e-9*s+2373599e-11*r):c<2050?(t=c-2e3,62.92+.32217*t+.005589*t*t):c<2150?(t=(c-1820)/100,-20+32*t*t-.5628*(2150-c)):(t=(c-1820)/100,-20+32*t*t)}function Y3(i){return Xu(Math.min(i,17*lp))}let gp=Xu;function K3(i){gp=i}function P0(i){return i+gp(i)/86400}class Fn{constructor(t){if(t instanceof Fn){this.date=t.date,this.ut=t.ut,this.tt=t.tt;return}const e=1e3*3600*24;if(t instanceof Date&&Number.isFinite(t.getTime())){this.date=t,this.ut=(t.getTime()-A0.getTime())/e,this.tt=P0(this.ut);return}if(Number.isFinite(t)){this.date=new Date(A0.getTime()+t*e),this.ut=t,this.tt=P0(this.ut);return}throw"Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date."}static FromTerrestrialTime(t){let e=new Fn(t);for(;;){const n=t-e.tt;if(Math.abs(n)<1e-12)return e;e=e.AddDays(n)}}toString(){return this.date.toISOString()}AddDays(t){return new Fn(this.ut+t)}}function Z3(i,t,e){return new Fn(i.ut+e*(t.ut-i.ut))}function Rt(i){return i instanceof Fn?i:new Fn(i)}function J3(i){function t(d){return d%D3*ir}const e=i.tt/36525,n=t(128710479305e-5+e*1295965810481e-4),s=t(335779.526232+e*17395272628478e-4),r=t(107226070369e-5+e*1602961601209e-3),o=t(450160.398036-e*69628905431e-4);let a=Math.sin(o),c=Math.cos(o),l=(-172064161-174666*e)*a+33386*c,u=(92052331+9086*e)*c+15377*a,h=2*(s-r+o);return a=Math.sin(h),c=Math.cos(h),l+=(-13170906-1675*e)*a-13696*c,u+=(5730336-3015*e)*c-4587*a,h=2*(s+o),a=Math.sin(h),c=Math.cos(h),l+=(-2276413-234*e)*a+2796*c,u+=(978459-485*e)*c+1374*a,h=2*o,a=Math.sin(h),c=Math.cos(h),l+=(2074554+207*e)*a-698*c,u+=(-897492+470*e)*c-291*a,a=Math.sin(n),c=Math.cos(n),l+=(1475877-3633*e)*a+11817*c,u+=(73871-184*e)*c-1924*a,{dpsi:-135e-6+l*1e-7,deps:388e-6+u*1e-7}}function _p(i){var t=i.tt/36525,e=((((-434e-10*t-576e-9)*t+.0020034)*t-1831e-7)*t-46.836769)*t+84381.406;return e/3600}var Ma;function ts(i){if(!Ma||Math.abs(Ma.tt-i.tt)>1e-6){const t=J3(i),e=_p(i),n=e+t.deps/3600;Ma={tt:i.tt,dpsi:t.dpsi,deps:t.deps,ee:t.dpsi*Math.cos(e*lt)/15,mobl:e,tobl:n}}return Ma}function yp(i,t){const e=i*lt,n=Math.cos(e),s=Math.sin(e);return[t[0],t[1]*n-t[2]*s,t[1]*s+t[2]*n]}function Q3(i,t){return yp(_p(i),t)}let vp=0;function Wi(i){++vp;const t=i.tt/36525;function e(k,Ft){const pt=[];let bt;for(bt=0;bt<=Ft-k;++bt)pt.push(0);return{min:k,array:pt}}function n(k,Ft,pt,bt){const gt=[];for(let re=0;re<=Ft-k;++re)gt.push(e(pt,bt));return{min:k,array:gt}}function s(k,Ft,pt){const bt=k.array[Ft-k.min];return bt.array[pt-bt.min]}function r(k,Ft,pt,bt){const gt=k.array[Ft-k.min];gt.array[pt-gt.min]=bt}let o,a,c,l,u,h,d,f,m,_,g,p,y,v,x,M,S,T,I,b,w,O,G,$=n(-6,6,1,4),R=n(-6,6,1,4);function F(k,Ft){return s($,k,Ft)}function H(k,Ft){return s(R,k,Ft)}function U(k,Ft,pt){return r($,k,Ft,pt)}function B(k,Ft,pt){return r(R,k,Ft,pt)}function Y(k,Ft,pt,bt,gt){gt(k*pt-Ft*bt,Ft*pt+k*bt)}function X(k){return Math.sin(Vn*k)}d=t*t,m=0,G=0,g=0,p=3422.7;var tt=X(.19833+.05611*t),et=X(.27869+.04508*t),j=X(.16827-.36903*t),Q=X(.34734-5.37261*t),st=X(.10498-5.37899*t),yt=X(.42681-.41855*t),Mt=X(.14943-5.37511*t);for(T=.84*tt+.31*et+14.27*j+7.26*Q+.28*st+.24*yt,I=2.94*tt+.31*et+14.27*j+9.34*Q+1.12*st+.83*yt,b=-6.4*tt-1.89*yt,w=.21*tt+.31*et+14.27*j-88.7*Q-15.3*st+.24*yt-1.86*Mt,O=T-b,f=-3332e-9*X(.59734-5.37261*t)-539e-9*X(.35498-5.37899*t)-64e-9*X(.39943-5.37511*t),y=Vn*Zs(.60643382+1336.85522467*t-313e-8*d)+T/zi,v=Vn*Zs(.37489701+1325.55240982*t+2565e-8*d)+I/zi,x=Vn*Zs(.99312619+99.99735956*t-44e-8*d)+b/zi,M=Vn*Zs(.25909118+1342.2278298*t-892e-8*d)+w/zi,S=Vn*Zs(.82736186+1236.85308708*t-397e-8*d)+O/zi,u=1;u<=4;++u){switch(u){case 1:c=v,a=4,l=1.000002208;break;case 2:c=x,a=3,l=.997504612-.002495388*t;break;case 3:c=M,a=4,l=1.000002708+139.978*f;break;case 4:c=S,a=6,l=1;break;default:throw`Internal error: I = ${u}`}for(U(0,u,1),U(1,u,Math.cos(c)*l),B(0,u,0),B(1,u,Math.sin(c)*l),h=2;h<=a;++h)Y(F(h-1,u),H(h-1,u),F(1,u),H(1,u),(k,Ft)=>(U(h,u,k),B(h,u,Ft)));for(h=1;h<=a;++h)U(-h,u,F(h,u)),B(-h,u,-H(h,u))}function Nt(k,Ft,pt,bt){for(var gt={x:1,y:0},re=[0,k,Ft,pt,bt],zt=1;zt<=4;++zt)re[zt]!==0&&Y(gt.x,gt.y,F(re[zt],zt),H(re[zt],zt),(P,A)=>(gt.x=P,gt.y=A));return gt}function W(k,Ft,pt,bt,gt,re,zt,P){var A=Nt(gt,re,zt,P);m+=k*A.y,G+=Ft*A.y,g+=pt*A.x,p+=bt*A.x}W(13.902,14.06,-.001,.2607,0,0,0,4),W(.403,-4.01,.394,.0023,0,0,0,3),W(2369.912,2373.36,.601,28.2333,0,0,0,2),W(-125.154,-112.79,-.725,-.9781,0,0,0,1),W(1.979,6.98,-.445,.0433,1,0,0,4),W(191.953,192.72,.029,3.0861,1,0,0,2),W(-8.466,-13.51,.455,-.1093,1,0,0,1),W(22639.5,22609.07,.079,186.5398,1,0,0,0),W(18.609,3.59,-.094,.0118,1,0,0,-1),W(-4586.465,-4578.13,-.077,34.3117,1,0,0,-2),W(3.215,5.44,.192,-.0386,1,0,0,-3),W(-38.428,-38.64,.001,.6008,1,0,0,-4),W(-.393,-1.43,-.092,.0086,1,0,0,-6),W(-.289,-1.59,.123,-.0053,0,1,0,4),W(-24.42,-25.1,.04,-.3,0,1,0,2),W(18.023,17.93,.007,.1494,0,1,0,1),W(-668.146,-126.98,-1.302,-.3997,0,1,0,0),W(.56,.32,-.001,-.0037,0,1,0,-1),W(-165.145,-165.06,.054,1.9178,0,1,0,-2),W(-1.877,-6.46,-.416,.0339,0,1,0,-4),W(.213,1.02,-.074,.0054,2,0,0,4),W(14.387,14.78,-.017,.2833,2,0,0,2),W(-.586,-1.2,.054,-.01,2,0,0,1),W(769.016,767.96,.107,10.1657,2,0,0,0),W(1.75,2.01,-.018,.0155,2,0,0,-1),W(-211.656,-152.53,5.679,-.3039,2,0,0,-2),W(1.225,.91,-.03,-.0088,2,0,0,-3),W(-30.773,-34.07,-.308,.3722,2,0,0,-4),W(-.57,-1.4,-.074,.0109,2,0,0,-6),W(-2.921,-11.75,.787,-.0484,1,1,0,2),W(1.267,1.52,-.022,.0164,1,1,0,1),W(-109.673,-115.18,.461,-.949,1,1,0,0),W(-205.962,-182.36,2.056,1.4437,1,1,0,-2),W(.233,.36,.012,-.0025,1,1,0,-3),W(-4.391,-9.66,-.471,.0673,1,1,0,-4),W(.283,1.53,-.111,.006,1,-1,0,4),W(14.577,31.7,-1.54,.2302,1,-1,0,2),W(147.687,138.76,.679,1.1528,1,-1,0,0),W(-1.089,.55,.021,0,1,-1,0,-1),W(28.475,23.59,-.443,-.2257,1,-1,0,-2),W(-.276,-.38,-.006,-.0036,1,-1,0,-3),W(.636,2.27,.146,-.0102,1,-1,0,-4),W(-.189,-1.68,.131,-.0028,0,2,0,2),W(-7.486,-.66,-.037,-.0086,0,2,0,0),W(-8.096,-16.35,-.74,.0918,0,2,0,-2),W(-5.741,-.04,0,-9e-4,0,0,2,2),W(.255,0,0,0,0,0,2,1),W(-411.608,-.2,0,-.0124,0,0,2,0),W(.584,.84,0,.0071,0,0,2,-1),W(-55.173,-52.14,0,-.1052,0,0,2,-2),W(.254,.25,0,-.0017,0,0,2,-3),W(.025,-1.67,0,.0031,0,0,2,-4),W(1.06,2.96,-.166,.0243,3,0,0,2),W(36.124,50.64,-1.3,.6215,3,0,0,0),W(-13.193,-16.4,.258,-.1187,3,0,0,-2),W(-1.187,-.74,.042,.0074,3,0,0,-4),W(-.293,-.31,-.002,.0046,3,0,0,-6),W(-.29,-1.45,.116,-.0051,2,1,0,2),W(-7.649,-10.56,.259,-.1038,2,1,0,0),W(-8.627,-7.59,.078,-.0192,2,1,0,-2),W(-2.74,-2.54,.022,.0324,2,1,0,-4),W(1.181,3.32,-.212,.0213,2,-1,0,2),W(9.703,11.67,-.151,.1268,2,-1,0,0),W(-.352,-.37,.001,-.0028,2,-1,0,-1),W(-2.494,-1.17,-.003,-.0017,2,-1,0,-2),W(.36,.2,-.012,-.0043,2,-1,0,-4),W(-1.167,-1.25,.008,-.0106,1,2,0,0),W(-7.412,-6.12,.117,.0484,1,2,0,-2),W(-.311,-.65,-.032,.0044,1,2,0,-4),W(.757,1.82,-.105,.0112,1,-2,0,2),W(2.58,2.32,.027,.0196,1,-2,0,0),W(2.533,2.4,-.014,-.0212,1,-2,0,-2),W(-.344,-.57,-.025,.0036,0,3,0,-2),W(-.992,-.02,0,0,1,0,2,2),W(-45.099,-.02,0,-.001,1,0,2,0),W(-.179,-9.52,0,-.0833,1,0,2,-2),W(-.301,-.33,0,.0014,1,0,2,-4),W(-6.382,-3.37,0,-.0481,1,0,-2,2),W(39.528,85.13,0,-.7136,1,0,-2,0),W(9.366,.71,0,-.0112,1,0,-2,-2),W(.202,.02,0,0,1,0,-2,-4),W(.415,.1,0,.0013,0,1,2,0),W(-2.152,-2.26,0,-.0066,0,1,2,-2),W(-1.44,-1.3,0,.0014,0,1,-2,2),W(.384,-.04,0,0,0,1,-2,-2),W(1.938,3.6,-.145,.0401,4,0,0,0),W(-.952,-1.58,.052,-.013,4,0,0,-2),W(-.551,-.94,.032,-.0097,3,1,0,0),W(-.482,-.57,.005,-.0045,3,1,0,-2),W(.681,.96,-.026,.0115,3,-1,0,0),W(-.297,-.27,.002,-9e-4,2,2,0,-2),W(.254,.21,-.003,0,2,-2,0,-2),W(-.25,-.22,.004,.0014,1,3,0,-2),W(-3.996,0,0,4e-4,2,0,2,0),W(.557,-.75,0,-.009,2,0,2,-2),W(-.459,-.38,0,-.0053,2,0,-2,2),W(-1.298,.74,0,4e-4,2,0,-2,0),W(.538,1.14,0,-.0141,2,0,-2,-2),W(.263,.02,0,0,1,1,2,0),W(.426,.07,0,-6e-4,1,1,-2,-2),W(-.304,.03,0,3e-4,1,-1,2,0),W(-.372,-.19,0,-.0027,1,-1,-2,2),W(.418,0,0,0,0,0,4,0),W(-.33,-.04,0,0,3,0,2,0);function mt(k,Ft,pt,bt,gt){return k*Nt(Ft,pt,bt,gt).y}_=0,_+=mt(-526.069,0,0,1,-2),_+=mt(-3.352,0,0,1,-4),_+=mt(44.297,1,0,1,-2),_+=mt(-6,1,0,1,-4),_+=mt(20.599,-1,0,1,0),_+=mt(-30.598,-1,0,1,-2),_+=mt(-24.649,-2,0,1,0),_+=mt(-2,-2,0,1,-2),_+=mt(-22.571,0,1,1,-2),_+=mt(10.985,0,-1,1,-2),m+=.82*X(.7736-62.5512*t)+.31*X(.0466-125.1025*t)+.35*X(.5785-25.1042*t)+.66*X(.4591+1335.8075*t)+.64*X(.313-91.568*t)+1.14*X(.148+1331.2898*t)+.21*X(.5918+1056.5859*t)+.44*X(.5784+1322.8595*t)+.24*X(.2275-5.7374*t)+.28*X(.2965+2.6929*t)+.33*X(.3132+6.3368*t),o=M+G/zi;let Vt=(1.000002708+139.978*f)*(18518.511+1.189+g)*Math.sin(o)-6.24*Math.sin(3*o)+_;return{geo_eclip_lon:Vn*Zs((y+m/zi)/Vn),geo_eclip_lat:Math.PI/(180*3600)*Vt,distance_au:zi*F3/(.999953253*p)}}class xp{constructor(t,e,n,s,r,o){this.elat=t,this.elon=e,this.mlat=n,this.mlon=s,this.dist_km=r,this.diam_deg=o}}function tM(i){const t=Rt(i),e=t.tt/36525,n=e*e,s=n*e,r=n*n,o=Wi(t),a=o.geo_eclip_lon,c=o.geo_eclip_lat,l=o.distance_au*ye,u=lt*1.543,h=lt*Qs(93.272095+483202.0175233*e-.0036539*n-s/3526e3+r/86331e4),d=lt*Qs(125.0445479-1934.1362891*e+.0020754*n+s/467441-r/60616e3),f=lt*Qs(357.5291092+35999.0502909*e-1536e-7*n+s/2449e4),m=lt*Qs(134.9633964+477198.8675055*e+.0087414*n+s/69699-r/14712e3),_=lt*Qs(297.8501921+445267.1114034*e-.0018819*n+s/545868-r/113065e3),g=1-.002516*e-74e-7*n,p=a-d,y=Math.atan2(Math.sin(p)*Math.cos(c)*Math.cos(u)-Math.sin(c)*Math.sin(u),Math.cos(p)*Math.cos(c)),v=Gr(Re*(y-h)),x=Math.asin(-Math.sin(p)*Math.cos(c)*Math.sin(u)-Math.sin(c)*Math.cos(u)),M=lt*(119.75+131.849*e),S=lt*(72.56+20.186*e),T=-.02752*Math.cos(m)+-.02245*Math.sin(h)+.00684*Math.cos(m-2*h)+-.00293*Math.cos(2*h)+-85e-5*Math.cos(2*h-2*_)+-54e-5*Math.cos(m-2*_)+-2e-4*Math.sin(m+h)+-2e-4*Math.cos(m+2*h)+-2e-4*Math.cos(m-h)+14e-5*Math.cos(m+2*h-2*_),I=-.02816*Math.sin(m)+.02244*Math.cos(h)+-.00682*Math.sin(m-2*h)+-.00279*Math.sin(2*h)+-83e-5*Math.sin(2*h-2*_)+69e-5*Math.sin(m-2*_)+4e-4*Math.cos(m+h)+-25e-5*Math.sin(2*m)+-23e-5*Math.sin(m+2*h)+2e-4*Math.cos(m-h)+19e-5*Math.sin(m-h)+13e-5*Math.sin(m+2*h-2*_)+-1e-4*Math.cos(m-3*h),w=-(.0252*g*Math.sin(f)+.00473*Math.sin(2*m-2*h)+-.00467*Math.sin(m)+.00396*Math.sin(M)+.00276*Math.sin(2*m-2*_)+.00196*Math.sin(d)+-.00183*Math.cos(m-h)+.00115*Math.sin(m-2*_)+-96e-5*Math.sin(m-_)+46e-5*Math.sin(2*h-2*_)+-39e-5*Math.sin(m-h)+-32e-5*Math.sin(m-f-_)+27e-5*Math.sin(2*m-f-2*_)+23e-5*Math.sin(S)+-14e-5*Math.sin(2*_)+14e-5*Math.cos(2*m-2*h)+-12e-5*Math.sin(m-2*h)+-12e-5*Math.sin(2*m)+11e-5*Math.sin(2*m-2*f-2*_))+(T*Math.cos(y)+I*Math.sin(y))*Math.tan(x),O=I*Math.cos(y)-T*Math.sin(y),G=2*Re*Math.atan(Ln/Math.sqrt(l*l-Ln*Ln));return new xp(Re*x+O,v+w,Re*c,Re*a,l,G)}function Mp(i,t){return[i.rot[0][0]*t[0]+i.rot[1][0]*t[1]+i.rot[2][0]*t[2],i.rot[0][1]*t[0]+i.rot[1][1]*t[1]+i.rot[2][1]*t[2],i.rot[0][2]*t[0]+i.rot[1][2]*t[1]+i.rot[2][2]*t[2]]}function Ar(i,t,e){const n=yc(t,e);return Mp(n,i)}function R0(i,t,e){const n=yc(t,e);return Sc(n,i)}function yc(i,t){const e=i.tt/36525;let n=84381.406,s=((((-951e-10*e+132851e-9)*e-.00114045)*e-1.0790069)*e+5038.481507)*e,r=((((3337e-10*e-467e-9)*e-.00772503)*e+.0512623)*e-.025754)*e+n,o=((((-56e-9*e+170663e-9)*e-.00121197)*e-2.3814292)*e+10.556403)*e;n*=ir,s*=ir,r*=ir,o*=ir;const a=Math.sin(n),c=Math.cos(n),l=Math.sin(-s),u=Math.cos(-s),h=Math.sin(-r),d=Math.cos(-r),f=Math.sin(o),m=Math.cos(o),_=m*u-l*f*d,g=m*l*c+f*d*u*c-a*f*h,p=m*l*a+f*d*u*a+c*f*h,y=-f*u-l*m*d,v=-f*l*c+m*d*u*c-a*m*h,x=-f*l*a+m*d*u*a+c*m*h,M=l*h,S=-h*u*c-a*d,T=-h*u*a+d*c;if(t===we.Into2000)return new Ke([[_,g,p],[y,v,x],[M,S,T]]);if(t===we.From2000)return new Ke([[_,y,M],[g,v,S],[p,x,T]]);throw"Invalid precess direction"}function eM(i){const t=.779057273264+.00273781191135448*i.ut,e=i.ut%1;let n=360*((t+e)%1);return n<0&&(n+=360),n}let ba;function Di(i){if(!ba||ba.tt!==i.tt){const t=i.tt/36525;let e=15*ts(i).ee;const n=eM(i);let r=((e+.014506+((((-368e-10*t-29956e-9)*t-44e-8)*t+1.3915817)*t+4612.156534)*t)/3600+n)%360/15;r<0&&(r+=24),ba={tt:i.tt,st:r}}return ba.st}function ju(i){const t=Rt(i);return Di(t)}function nM(i,t){const e=i[0]*ye,n=i[1]*ye,s=i[2]*ye,r=Math.hypot(e,n);let o,a,c;if(r<1e-6)o=0,a=s>0?90:-90,c=Math.abs(s)-U3;else{const l=Math.atan2(n,e);for(o=Re*l-15*t;o<=-180;)o+=360;for(;o>180;)o-=360;let u=Math.atan2(s,r),h,d,f,m=0;for(;;){if(++m>10)throw"inverse_terra failed to converge.";h=Math.cos(u),d=Math.sin(u);const g=(sr-1)*Pi,p=h*h,y=d*d,v=p+sr*y;f=Math.sqrt(v);const x=g*d*h/f-s*h+r*d;if(Math.abs(x)<1e-8)break;const M=g*((p-y)/f-y*p*(sr-1)/(g*v))+s*d+r*h;u-=x/M}a=Re*u;const _=Pi/f;Math.abs(d)>Math.abs(h)?c=s/d-sr*_:c=r/h-_}return new Yu(a,o,1e3*c)}function $u(i,t){const e=i.latitude*lt,n=Math.sin(e),s=Math.cos(e),r=1/Math.hypot(s,ni*n),o=sr*r,a=i.height/1e3,c=Pi*r+a,l=Pi*o+a,u=(15*t+i.longitude)*lt,h=Math.sin(u),d=Math.cos(u);return{pos:[c*s*d/ye,c*s*h/ye,l*n/ye],vel:[-C0*c*s*h*86400/ye,C0*c*s*d*86400/ye,0]}}function Cr(i,t,e){const n=vc(t,e);return Mp(n,i)}function L0(i,t,e){const n=vc(t,e);return Sc(n,i)}function vc(i,t){const e=ts(i),n=e.mobl*lt,s=e.tobl*lt,r=e.dpsi*ir,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r),d=u,f=-h*o,m=-h*a,_=h*c,g=u*o*c+a*l,p=u*a*c-o*l,y=h*l,v=u*o*l-a*c,x=u*a*l+o*c;if(t===we.From2000)return new Ke([[d,_,y],[f,g,v],[m,p,x]]);if(t===we.Into2000)return new Ke([[d,f,m],[_,g,p],[y,v,x]]);throw"Invalid precess direction"}function xc(i,t,e){return e===we.Into2000?Ar(Cr(i,t,e),t,e):Cr(Ar(i,t,e),t,e)}function iM(i,t,e){return e===we.Into2000?R0(L0(i,t,e),t,e):L0(R0(i,t,e),t,e)}function bp(i,t){const e=Di(i),n=$u(t,e).pos;return xc(n,i,we.Into2000)}class ae{constructor(t,e,n,s){this.x=t,this.y=e,this.z=n,this.t=s}Length(){return Math.hypot(this.x,this.y,this.z)}}class He{constructor(t,e,n,s,r,o,a){this.x=t,this.y=e,this.z=n,this.vx=s,this.vy=r,this.vz=o,this.t=a}}class kr{constructor(t,e,n){this.lat=se(t),this.lon=se(e),this.dist=se(n)}}class Ka{constructor(t,e,n,s){this.ra=se(t),this.dec=se(e),this.dist=se(n),this.vec=s}}function sM(i){if(!(i instanceof Array)||i.length!==3)return!1;for(let t=0;t<3;++t){if(!(i[t]instanceof Array)||i[t].length!==3)return!1;for(let e=0;e<3;++e)if(!Number.isFinite(i[t][e]))return!1}return!0}class Ke{constructor(t){this.rot=t}}function rM(i){if(!sM(i))throw"Argument must be a [3][3] array of numbers";return new Ke(i)}class Sp{constructor(t,e,n,s){this.azimuth=se(t),this.altitude=se(e),this.ra=se(n),this.dec=se(s)}}class wp{constructor(t,e,n){this.vec=t,this.elat=se(e),this.elon=se(n)}}function qu(i,t){return new ae(i[0],i[1],i[2],t)}function D0(i,t){const e=qu(i,t),n=e.x*e.x+e.y*e.y,s=Math.sqrt(n+e.z*e.z);if(n===0){if(e.z===0)throw"Indeterminate sky coordinates";return new Ka(0,e.z<0?-90:90,s,e)}let r=Vu*Math.atan2(e.y,e.x);r<0&&(r+=24);const o=Re*Math.atan2(i[2],Math.sqrt(n));return new Ka(r,o,s,e)}function ur(i,t){const e=i*lt,n=Math.cos(e),s=Math.sin(e);return[n*t[0]+s*t[1],n*t[1]-s*t[0],t[2]]}function Mc(i,t,e,n,s){let r=Rt(i);Br(t),se(e),se(n);const o=Math.sin(t.latitude*lt),a=Math.cos(t.latitude*lt),c=Math.sin(t.longitude*lt),l=Math.cos(t.longitude*lt),u=Math.sin(n*lt),h=Math.cos(n*lt),d=Math.sin(e*Kl),f=Math.cos(e*Kl);let m=[a*l,a*c,o],_=[-o*l,-o*c,a],g=[c,-l,0];const p=-15*Di(r);let y=ur(p,m),v=ur(p,_),x=ur(p,g),M=[h*f,h*d,u];const S=M[0]*y[0]+M[1]*y[1]+M[2]*y[2],T=M[0]*v[0]+M[1]*v[1]+M[2]*v[2],I=M[0]*x[0]+M[1]*x[1]+M[2]*x[2];let b=Math.hypot(T,I),w;b>0?(w=-Re*Math.atan2(I,T),w<0&&(w+=360)):w=0;let O=Re*Math.atan2(b,S),G=e,$=n;if(s){let R=O,F=bo(s,90-O);if(O-=F,F>0&&O>3e-4){const H=Math.sin(O*lt),U=Math.cos(O*lt),B=Math.sin(R*lt),Y=Math.cos(R*lt),X=[];for(let tt=0;tt<3;++tt)X.push((M[tt]-Y*y[tt])/B*H+y[tt]*U);b=Math.hypot(X[0],X[1]),b>0?(G=Vu*Math.atan2(X[1],X[0]),G<0&&(G+=24)):G=0,$=Re*Math.atan2(X[2],b)}}return new Sp(w,90-O,G,$)}function Br(i){if(!(i instanceof Yu))throw`Not an instance of the Observer class: ${i}`;if(se(i.latitude),se(i.longitude),se(i.height),i.latitude<-90||i.latitude>90)throw`Latitude ${i.latitude} is out of range. Must be -90..+90.`;return i}class Yu{constructor(t,e,n){this.latitude=t,this.longitude=e,this.height=n,Br(this)}}function Ep(i){const t=Rt(i).AddDays(-1/pc),e=hr(un.Earth,t),n=[-e.x,-e.y,-e.z],[s,r,o]=xc(n,t,we.From2000),a=lt*ts(t).tobl,c=Math.cos(a),l=Math.sin(a),u=new ae(s,r,o,t);return Ku(u,c,l)}function Po(i,t,e,n,s){Br(e),Ya(n),Ya(s);const r=Rt(t),o=bp(r,e),a=on(i,r,s),c=[a.x-o[0],a.y-o[1],a.z-o[2]];if(!n)return D0(c,r);const l=xc(c,r,we.From2000);return D0(l,r)}function oM(i,t,e){const n=Rt(i),s=Di(n);let r=$u(t,s).pos;return e||(r=xc(r,n,we.Into2000)),qu(r,n)}function aM(i,t,e){const n=Rt(i),s=Di(n),r=$u(t,s),o=new He(r.pos[0],r.pos[1],r.pos[2],r.vel[0],r.vel[1],r.vel[2],n);return e?o:iM(o,n,we.Into2000)}function cM(i,t){const e=Di(i.t);let n=[i.x,i.y,i.z];return t||(n=Ar(n,i.t,we.From2000),n=Cr(n,i.t,we.From2000)),nM(n,e)}function lM(i,t){const e=Math.sin(i*lt),n=e*e;return 9.7803253359*(1+.00193185265241*n)/Math.sqrt(1-.00669437999013*n)*(1-(315704e-12-210269e-14*n)*t+737452e-19*t*t)}function Ku(i,t,e){const n=i.x,s=i.y*t+i.z*e,r=-i.y*e+i.z*t,o=Math.hypot(n,s);let a=0;o>0&&(a=Re*Math.atan2(s,n),a<0&&(a+=360));let c=Re*Math.atan2(r,o),l=new ae(n,s,r,i.t);return new wp(l,c,a)}function yo(i){const t=ts(i.t),e=[i.x,i.y,i.z],n=Ar(e,i.t,we.From2000),[s,r,o]=Cr(n,i.t,we.From2000),a=new ae(s,r,o,i.t),c=t.tobl*lt;return Ku(a,Math.cos(c),Math.sin(c))}function li(i){const t=Rt(i),e=Wi(t),n=e.distance_au*Math.cos(e.geo_eclip_lat),s=[n*Math.cos(e.geo_eclip_lon),n*Math.sin(e.geo_eclip_lon),e.distance_au*Math.sin(e.geo_eclip_lat)],r=Q3(t,s),o=Ar(r,t,we.Into2000);return new ae(o[0],o[1],o[2],t)}function Ia(i){const t=Rt(i),e=Wi(t),n=e.distance_au*Math.cos(e.geo_eclip_lat),s=[n*Math.cos(e.geo_eclip_lon),n*Math.sin(e.geo_eclip_lon),e.distance_au*Math.sin(e.geo_eclip_lat)],r=ts(t),o=yp(r.mobl,s),a=Cr(o,t,we.From2000),c=qu(a,t),l=r.tobl*lt,u=Math.cos(l),h=Math.sin(l),d=Ku(c,u,h);return new kr(d.elat,d.elon,e.distance_au)}function Ro(i){const t=Rt(i),e=1e-5,n=t.AddDays(-e),s=t.AddDays(+e),r=li(n),o=li(s);return new He((r.x+o.x)/2,(r.y+o.y)/2,(r.z+o.z)/2,(o.x-r.x)/(2*e),(o.y-r.y)/(2*e),(o.z-r.z)/(2*e),t)}function Zu(i){const t=Rt(i),e=Ro(t),n=1+Wu;return new He(e.x/n,e.y/n,e.z/n,e.vx/n,e.vy/n,e.vz/n,t)}function vs(i,t,e){let n=1,s=0;for(let r of i){let o=0;for(let[c,l,u]of r)o+=c*Math.cos(l+t*u);let a=n*o;e&&(a%=Vn),s+=a,n*=t}return s}function bl(i,t){let e=1,n=0,s=0,r=0;for(let o of i){let a=0,c=0;for(let[l,u,h]of o){let d=u+t*h;a+=l*h*Math.sin(d),r>0&&(c+=l*Math.cos(d))}s+=r*n*c-e*a,n=e,e*=t,++r}return s}const rr=365250,eu=0,nu=1,Za=2;function iu(i){return new Te(i[0]+44036e-11*i[1]-190919e-12*i[2],-479966e-12*i[0]+.917482137087*i[1]-.397776982902*i[2],.397776982902*i[1]+.917482137087*i[2])}function Tp(i,t,e){const n=e*Math.cos(t),s=Math.cos(i),r=Math.sin(i);return[n*s,n*r,e*Math.sin(t)]}function hr(i,t){const e=t.tt/rr,n=vs(i[eu],e,!0),s=vs(i[nu],e,!1),r=vs(i[Za],e,!1),o=Tp(n,s,r);return iu(o).ToAstroVector(t)}function vo(i,t){const e=t/rr,n=vs(i[eu],e,!0),s=vs(i[nu],e,!1),r=vs(i[Za],e,!1),o=bl(i[eu],e),a=bl(i[nu],e),c=bl(i[Za],e),l=Math.cos(n),u=Math.sin(n),h=Math.cos(s),d=Math.sin(s),f=+(c*h*l)-r*d*l*a-r*h*u*o,m=+(c*h*u)-r*d*u*a+r*h*l*o,_=+(c*d)+r*h*a,g=Tp(n,s,r),p=[f/rr,m/rr,_/rr],y=iu(g),v=iu(p);return new ii(t,y,v)}function Sa(i,t,e,n){const s=n/(n+Co),r=hr(un[e],t);i.x+=s*r.x,i.y+=s*r.y,i.z+=s*r.z}function uM(i){const t=new ae(0,0,0,i);return Sa(t,i,z.Jupiter,Sr),Sa(t,i,z.Saturn,wr),Sa(t,i,z.Uranus,Er),Sa(t,i,z.Neptune,Tr),t}const su=51,hM=29200,or=146,vi=201,fs=[[-73e4,[-26.118207232108,-14.376168177825,3.384402515299],[.0016339372163656,-.0027861699588508,-.0013585880229445]],[-700800,[41.974905202127,-.448502952929,-12.770351505989],[.00073458569351457,.0022785014891658,.00048619778602049]],[-671600,[14.706930780744,44.269110540027,9.353698474772],[-.00210001479998,.00022295915939915,.00070143443551414]],[-642400,[-29.441003929957,-6.43016153057,6.858481011305],[.00084495803960544,-.0030783914758711,-.0012106305981192]],[-613200,[39.444396946234,-6.557989760571,-13.913760296463],[.0011480029005873,.0022400006880665,.00035168075922288]],[-584e3,[20.2303809507,43.266966657189,7.382966091923],[-.0019754081700585,.00053457141292226,.00075929169129793]],[-554800,[-30.65832536462,2.093818874552,9.880531138071],[61010603013347e-18,-.0031326500935382,-.00099346125151067]],[-525600,[35.737703251673,-12.587706024764,-14.677847247563],[.0015802939375649,.0021347678412429,.00019074436384343]],[-496400,[25.466295188546,41.367478338417,5.216476873382],[-.0018054401046468,.0008328308359951,.00080260156912107]],[-467200,[-29.847174904071,10.636426313081,12.297904180106],[-.00063257063052907,-.0029969577578221,-.00074476074151596]],[-438e3,[30.774692107687,-18.236637015304,-14.945535879896],[.0020113162005465,.0019353827024189,-20937793168297e-19]],[-408800,[30.243153324028,38.656267888503,2.938501750218],[-.0016052508674468,.0011183495337525,.00083333973416824]],[-379600,[-27.288984772533,18.643162147874,14.023633623329],[-.0011856388898191,-.0027170609282181,-.00049015526126399]],[-350400,[24.519605196774,-23.245756064727,-14.626862367368],[.0024322321483154,.0016062008146048,-.00023369181613312]],[-321200,[34.505274805875,35.125338586954,.557361475637],[-.0013824391637782,.0013833397561817,.00084823598806262]],[-292e3,[-23.275363915119,25.818514298769,15.055381588598],[-.0016062295460975,-.0023395961498533,-.00024377362639479]],[-262800,[17.050384798092,-27.180376290126,-13.608963321694],[.0028175521080578,.0011358749093955,-.00049548725258825]],[-233600,[38.093671910285,30.880588383337,-1.843688067413],[-.0011317697153459,.0016128814698472,.00084177586176055]],[-204400,[-18.197852930878,31.932869934309,15.438294826279],[-.0019117272501813,-.0019146495909842,-19657304369835e-18]],[-175200,[8.528924039997,-29.618422200048,-11.805400994258],[.0031034370787005,.0005139363329243,-.00077293066202546]],[-146e3,[40.94685725864,25.904973592021,-4.256336240499],[-.00083652705194051,.0018129497136404,.0008156422827306]],[-116800,[-12.326958895325,36.881883446292,15.217158258711],[-.0021166103705038,-.001481442003599,.00017401209844705]],[-87600,[-.633258375909,-30.018759794709,-9.17193287495],[.0032016994581737,-.00025279858672148,-.0010411088271861]],[-58400,[42.936048423883,20.344685584452,-6.588027007912],[-.00050525450073192,.0019910074335507,.00077440196540269]],[-29200,[-5.975910552974,40.61180995846,14.470131723673],[-.0022184202156107,-.0010562361130164,.00033652250216211]],[0,[-9.875369580774,-27.978926224737,-5.753711824704],[.0030287533248818,-.0011276087003636,-.0012651326732361]],[29200,[43.958831986165,14.214147973292,-8.808306227163],[-.00014717608981871,.0021404187242141,.00071486567806614]],[58400,[.67813676352,43.094461639362,13.243238780721],[-.0022358226110718,-.00063233636090933,.00047664798895648]],[87600,[-18.282602096834,-23.30503958666,-1.766620508028],[.0025567245263557,-.0019902940754171,-.0013943491701082]],[116800,[43.873338744526,7.700705617215,-10.814273666425],[.00023174803055677,.0022402163127924,.00062988756452032]],[146e3,[7.392949027906,44.382678951534,11.629500214854],[-.002193281545383,-.00021751799585364,.00059556516201114]],[175200,[-24.981690229261,-16.204012851426,2.466457544298],[.001819398914958,-.0026765419531201,-.0013848283502247]],[204400,[42.530187039511,.845935508021,-12.554907527683],[.00065059779150669,.0022725657282262,.00051133743202822]],[233600,[13.999526486822,44.462363044894,9.669418486465],[-.0021079296569252,.00017533423831993,.00069128485798076]],[262800,[-29.184024803031,-7.371243995762,6.493275957928],[.00093581363109681,-.0030610357109184,-.0012364201089345]],[292e3,[39.831980671753,-6.078405766765,-13.909815358656],[.0011117769689167,.0022362097830152,.00036230548231153]],[321200,[20.294955108476,43.417190420251,7.450091985932],[-.0019742157451535,.00053102050468554,.00075938408813008]],[350400,[-30.66999230216,2.318743558955,9.973480913858],[45605107450676e-18,-.0031308219926928,-.00099066533301924]],[379600,[35.626122155983,-12.897647509224,-14.777586508444],[.0016015684949743,.0021171931182284,.00018002516202204]],[408800,[26.133186148561,41.232139187599,5.00640132622],[-.0017857704419579,.00086046232702817,.00080614690298954]],[438e3,[-29.57674022923,11.863535943587,12.631323039872],[-.00072292830060955,-.0029587820140709,-.000708242964503]],[467200,[29.910805787391,-19.159019294,-15.013363865194],[.0020871080437997,.0018848372554514,-38528655083926e-18]],[496400,[31.375957451819,38.050372720763,2.433138343754],[-.0015546055556611,.0011699815465629,.00083565439266001]],[525600,[-26.360071336928,20.662505904952,14.414696258958],[-.0013142373118349,-.0026236647854842,-.00042542017598193]],[554800,[22.599441488648,-24.508879898306,-14.484045731468],[.0025454108304806,.0014917058755191,-.00030243665086079]],[584e3,[35.877864013014,33.894226366071,-.224524636277],[-.0012941245730845,.0014560427668319,.00084762160640137]],[613200,[-21.538149762417,28.204068269761,15.321973799534],[-.001731211740901,-.0021939631314577,-.0001631691327518]],[642400,[13.971521374415,-28.339941764789,-13.083792871886],[.0029334630526035,.00091860931752944,-.00059939422488627]],[671600,[39.526942044143,28.93989736011,-2.872799527539],[-.0010068481658095,.001702113288809,.00083578230511981]],[700800,[-15.576200701394,34.399412961275,15.466033737854],[-.0020098814612884,-.0017191109825989,70414782780416e-18]],[73e4,[4.24325283709,-30.118201690825,-10.707441231349],[.0031725847067411,.0001609846120227,-.00090672150593868]]];class Te{constructor(t,e,n){this.x=t,this.y=e,this.z=n}clone(){return new Te(this.x,this.y,this.z)}ToAstroVector(t){return new ae(this.x,this.y,this.z,t)}static zero(){return new Te(0,0,0)}quadrature(){return this.x*this.x+this.y*this.y+this.z*this.z}add(t){return new Te(this.x+t.x,this.y+t.y,this.z+t.z)}sub(t){return new Te(this.x-t.x,this.y-t.y,this.z-t.z)}incr(t){this.x+=t.x,this.y+=t.y,this.z+=t.z}decr(t){this.x-=t.x,this.y-=t.y,this.z-=t.z}mul(t){return new Te(t*this.x,t*this.y,t*this.z)}div(t){return new Te(this.x/t,this.y/t,this.z/t)}mean(t){return new Te((this.x+t.x)/2,(this.y+t.y)/2,(this.z+t.z)/2)}neg(){return new Te(-this.x,-this.y,-this.z)}}class ii{constructor(t,e,n){this.tt=t,this.r=e,this.v=n}clone(){return new ii(this.tt,this.r,this.v)}sub(t){return new ii(this.tt,this.r.sub(t.r),this.v.sub(t.v))}}function dM(i){let[t,[e,n,s],[r,o,a]]=i;return new ii(t,new Te(e,n,s),new Te(r,o,a))}function Rn(i,t,e,n){const s=n/(n+Co),r=vo(un[e],t);return i.r.incr(r.r.mul(s)),i.v.incr(r.v.mul(s)),r}function to(i,t,e){const n=e.sub(i),s=n.quadrature();return n.mul(t/(s*Math.sqrt(s)))}class Lo{constructor(t){let e=new ii(t,new Te(0,0,0),new Te(0,0,0));this.Jupiter=Rn(e,t,z.Jupiter,Sr),this.Saturn=Rn(e,t,z.Saturn,wr),this.Uranus=Rn(e,t,z.Uranus,Er),this.Neptune=Rn(e,t,z.Neptune,Tr),this.Jupiter.r.decr(e.r),this.Jupiter.v.decr(e.v),this.Saturn.r.decr(e.r),this.Saturn.v.decr(e.v),this.Uranus.r.decr(e.r),this.Uranus.v.decr(e.v),this.Neptune.r.decr(e.r),this.Neptune.v.decr(e.v),this.Sun=new ii(t,e.r.mul(-1),e.v.mul(-1))}Acceleration(t){let e=to(t,Co,this.Sun.r);return e.incr(to(t,Sr,this.Jupiter.r)),e.incr(to(t,wr,this.Saturn.r)),e.incr(to(t,Er,this.Uranus.r)),e.incr(to(t,Tr,this.Neptune.r)),e}}class Do{constructor(t,e,n,s){this.tt=t,this.r=e,this.v=n,this.a=s}clone(){return new Do(this.tt,this.r.clone(),this.v.clone(),this.a.clone())}}class Ap{constructor(t,e){this.bary=t,this.grav=e}}function Pr(i,t,e,n){return new Te(t.x+i*(e.x+i*n.x/2),t.y+i*(e.y+i*n.y/2),t.z+i*(e.z+i*n.z/2))}function ru(i,t,e){return new Te(t.x+i*e.x,t.y+i*e.y,t.z+i*e.z)}function ou(i,t){const e=i-t.tt,n=new Lo(i),s=Pr(e,t.r,t.v,t.a),r=n.Acceleration(s).mean(t.a),o=Pr(e,t.r,t.v,r),a=t.v.add(r.mul(e)),c=n.Acceleration(o),l=new Do(i,o,a,c);return new Ap(n,l)}const fM=[];function Cp(i,t){const e=Math.floor(i);return e<0?0:e>=t?t-1:e}function au(i){const t=dM(i),e=new Lo(t.tt),n=t.r.add(e.Sun.r),s=t.v.add(e.Sun.v),r=e.Acceleration(n),o=new Do(t.tt,n,s,r);return new Ap(e,o)}function pM(i,t){const e=fs[0][0];if(t<e||t>fs[su-1][0])return null;const n=Cp((t-e)/hM,su-1);if(!i[n]){const r=i[n]=[];r[0]=au(fs[n]).grav,r[vi-1]=au(fs[n+1]).grav;let o,a=r[0].tt;for(o=1;o<vi-1;++o)r[o]=ou(a+=or,r[o-1]).grav;a=r[vi-1].tt;var s=[];for(s[vi-1]=r[vi-1],o=vi-2;o>0;--o)s[o]=ou(a-=or,s[o+1]).grav;for(o=vi-2;o>0;--o){const c=o/(vi-1);r[o].r=r[o].r.mul(1-c).add(s[o].r.mul(c)),r[o].v=r[o].v.mul(1-c).add(s[o].v.mul(c)),r[o].a=r[o].a.mul(1-c).add(s[o].a.mul(c))}}return i[n]}function I0(i,t,e){let n=au(i);const s=Math.ceil((t-n.grav.tt)/e);for(let r=0;r<s;++r)n=ou(r+1===s?t:n.grav.tt+e,n.grav);return n}function Ju(i,t){let e,n,s;const r=pM(fM,i.tt);if(r){const o=Cp((i.tt-r[0].tt)/or,vi-1),a=r[o],c=r[o+1],l=a.a.mean(c.a),u=Pr(i.tt-a.tt,a.r,a.v,l),h=ru(i.tt-a.tt,a.v,l),d=Pr(i.tt-c.tt,c.r,c.v,l),f=ru(i.tt-c.tt,c.v,l),m=(i.tt-a.tt)/or;e=u.mul(1-m).add(d.mul(m)),n=h.mul(1-m).add(f.mul(m))}else{let o;i.tt<fs[0][0]?o=I0(fs[0],i.tt,-or):o=I0(fs[su-1],i.tt,+or),e=o.grav.r,n=o.grav.v,s=o.bary}return t&&(s||(s=new Lo(i.tt)),e=e.sub(s.Sun.r),n=n.sub(s.Sun.v)),new He(e.x,e.y,e.z,n.x,n.y,n.z,i)}const mM=new Ke([[.999432765338654,-.0336771074697641,0],[.0303959428906285,.902057912352809,.430543388542295],[-.0144994559663353,-.430299169409101,.902569881273754]]),wa=[{mu:282489428433814e-21,al:[1.446213296021224,3.5515522861824],a:[[.0028210960212903,0,0]],l:[[-.0001925258348666,4.9369589722645,.01358483658305],[-970803596076e-16,4.3188796477322,.01303413843243],[-8988174165e-14,1.9080016428617,.00305064867158],[-553101050262e-16,1.4936156681569,.01293892891155]],z:[[.0041510849668155,4.089939635545,-.01290686414666],[.0006260521444113,1.446188898627,3.5515522949802],[352747346169e-16,2.1256287034578,.00012727416567]],zeta:[[.0003142172466014,2.7964219722923,-.002315096098],[904169207946e-16,1.0477061879627,-.00056920638196]]},{mu:282483274392893e-21,al:[-.3735263437471362,1.76932271112347],a:[[.0044871037804314,0,0],[4324367498e-16,1.819645606291,1.7822295777568]],l:[[.0008576433172936,4.3188693178264,.01303413830805],[.0004549582875086,1.4936531751079,.01293892881962],[.0003248939825174,1.8196494533458,1.7822295777568],[-.0003074250079334,4.9377037005911,.01358483286724],[.0001982386144784,1.907986905476,.00305101212869],[.0001834063551804,2.1402853388529,.00145009789338],[-.0001434383188452,5.622214036663,.89111478887838],[-771939140944e-16,4.300272437235,2.6733443704266]],z:[[-.0093589104136341,4.0899396509039,-.01290686414666],[.0002988994545555,5.9097265185595,1.7693227079462],[.000213903639035,2.1256289300016,.00012727418407],[.0001980963564781,2.743516829265,.00067797343009],[.0001210388158965,5.5839943711203,320566149e-13],[837042048393e-16,1.6094538368039,-.90402165808846],[823525166369e-16,1.4461887708689,3.5515522949802]],zeta:[[.0040404917832303,1.0477063169425,-.0005692064054],[.0002200421034564,3.3368857864364,-.00012491307307],[.0001662544744719,2.4134862374711,0],[590282470983e-16,5.9719930968366,-3056160225e-14]]},{mu:282498184184723e-21,al:[.2874089391143348,.878207923589328],a:[[.0071566594572575,0,0],[1393029911e-15,1.1586745884981,2.6733443704266]],l:[[.0002310797886226,2.1402987195942,.00145009784384],[-.0001828635964118,4.3188672736968,.01303413828263],[.0001512378778204,4.9373102372298,.01358483481252],[-.0001163720969778,4.300265986149,2.6733443704266],[-955478069846e-16,1.4936612842567,.01293892879857],[815246854464e-16,5.6222137132535,.89111478887838],[-801219679602e-16,1.2995922951532,1.0034433456729],[-607017260182e-16,.64978769669238,.50172167043264]],z:[[.0014289811307319,2.1256295942739,.00012727413029],[.000771093122676,5.5836330003496,320643411e-13],[.0005925911780766,4.0899396636448,-.01290686414666],[.0002045597496146,5.2713683670372,-.12523544076106],[.0001785118648258,.28743156721063,.8782079244252],[.0001131999784893,1.4462127277818,3.5515522949802],[-65877816921e-15,2.2702423990985,-1.7951364394537],[497058888328e-16,5.9096792204858,1.7693227129285]],zeta:[[.0015932721570848,3.3368862796665,-.00012491307058],[.0008533093128905,2.4133881688166,0],[.0003513347911037,5.9720789850127,-3056101771e-14],[-.0001441929255483,1.0477061764435,-.00056920632124]]},{mu:282492144889909e-21,al:[-.3620341291375704,.376486233433828],a:[[.0125879701715314,0,0],[3595204947e-15,.64965776007116,.50172168165034],[27580210652e-16,1.808423578151,3.1750660413359]],l:[[.0005586040123824,2.1404207189815,.00145009793231],[-.0003805813868176,2.7358844897853,2972965062e-14],[.0002205152863262,.649796525964,.5017216724358],[.0001877895151158,1.8084787604005,3.1750660413359],[766916975242e-16,6.2720114319755,1.3928364636651],[747056855106e-16,1.2995916202344,1.0034433456729]],z:[[.0073755808467977,5.5836071576084,3206509914e-14],[.0002065924169942,5.9209831565786,.37648624194703],[.0001589869764021,.28744006242623,.8782079244252],[-.0001561131605348,2.1257397865089,.00012727441285],[.0001486043380971,1.4462134301023,3.5515522949802],[635073108731e-16,5.9096803285954,1.7693227129285],[599351698525e-16,4.1125517584798,-2.7985797954589],[540660842731e-16,5.5390350845569,.00286834082283],[-489596900866e-16,4.6218149483338,-.62695712529519]],zeta:[[.0038422977898495,2.4133922085557,0],[.0022453891791894,5.9721736773277,-3056125525e-14],[-.0002604479450559,3.3368746306409,-.00012491309972],[33211214323e-15,5.5604137742337,.00290037688507]]}];class Pp{constructor(t,e,n,s){this.io=t,this.europa=e,this.ganymede=n,this.callisto=s}}function gM(i,t,e){const n=e[0],s=e[1],r=e[2],o=e[3],a=e[4],c=e[5],l=Math.sqrt(t/(n*n*n));let u,h,d,f=s+r*Math.sin(s)-o*Math.cos(s);do u=Math.cos(f),h=Math.sin(f),d=(s-f+r*h-o*u)/(1-r*u-o*h),f+=d;while(Math.abs(d)>=1e-12);u=Math.cos(f),h=Math.sin(f);const m=o*u-r*h,_=-r*u-o*h,g=1/(1+_),y=1/(1+Math.sqrt(1-r*r-o*o)),v=n*(u-r-y*o*m),x=n*(h-o+y*r*m),M=l*g*n*(-h-y*o*_),S=l*g*n*(+u+y*r*_),T=2*Math.sqrt(1-a*a-c*c),I=1-2*c*c,b=1-2*a*a,w=2*c*a;return new He(v*I+x*w,v*w+x*b,(a*x-v*c)*T,M*I+S*w,M*w+S*b,(a*S-M*c)*T,i)}function Ea(i,t){const e=i.tt+18262.5,n=[0,t.al[0]+e*t.al[1],0,0,0,0];for(let[r,o,a]of t.a)n[0]+=r*Math.cos(o+e*a);for(let[r,o,a]of t.l)n[1]+=r*Math.sin(o+e*a);n[1]%=Vn,n[1]<0&&(n[1]+=Vn);for(let[r,o,a]of t.z){const c=o+e*a;n[2]+=r*Math.cos(c),n[3]+=r*Math.sin(c)}for(let[r,o,a]of t.zeta){const c=o+e*a;n[4]+=r*Math.cos(c),n[5]+=r*Math.sin(c)}const s=gM(i,t.mu,n);return Sc(mM,s)}function Ja(i){const t=new Fn(i);return new Pp(Ea(t,wa[0]),Ea(t,wa[1]),Ea(t,wa[2]),Ea(t,wa[3]))}function de(i,t){var e=Rt(t);if(i in un)return hr(un[i],e);if(i===z.Pluto){const o=Ju(e,!0);return new ae(o.x,o.y,o.z,e)}if(i===z.Sun)return new ae(0,0,0,e);if(i===z.Moon){var n=hr(un.Earth,e),s=li(e);return new ae(n.x+s.x,n.y+s.y,n.z+s.z,e)}if(i===z.EMB){const o=hr(un.Earth,e),a=li(e),c=1+Wu;return new ae(o.x+a.x/c,o.y+a.y/c,o.z+a.z/c,e)}if(i===z.SSB)return uM(e);const r=_c(i);if(r){const o=new kr(r.dec,15*r.ra,r.dist);return bc(o,e)}throw`HelioVector: Unknown body "${i}"`}function xs(i,t){const e=_c(i);if(e)return e.dist;const n=Rt(t);return i in un?vs(un[i][Za],n.tt/rr,!1):de(i,n).Length()}function Rp(i,t){let e=t,n=0;for(let s=0;s<10;++s){const r=i(e),o=r.Length()/pc;if(o>1)throw"Object is too distant for light-travel solver.";const a=t.AddDays(-o);if(n=Math.abs(a.tt-e.tt),n<1e-9)return r;e=a}throw`Light-travel time solver did not converge: dt = ${n}`}class _M{constructor(t,e,n,s){this.observerBody=t,this.targetBody=e,this.aberration=n,this.observerPos=s}Position(t){this.aberration&&(this.observerPos=de(this.observerBody,t));const e=de(this.targetBody,t);return new ae(e.x-this.observerPos.x,e.y-this.observerPos.y,e.z-this.observerPos.z,t)}}function Lp(i,t,e,n){Ya(n);const s=Rt(i);if(_c(e)){const a=de(e,s);if(n){const l=Qa(t,s),u=new ae(a.x-l.x,a.y-l.y,a.z-l.z,s),h=pc/u.Length();return new ae(u.x+l.vx/h,u.y+l.vy/h,u.z+l.vz/h,s)}const c=de(t,s);return new ae(a.x-c.x,a.y-c.y,a.z-c.z,s)}let r;n?r=new ae(0,0,0,s):r=de(t,s);const o=new _M(t,e,n,r);return Rp(a=>o.Position(a),s)}function on(i,t,e){Ya(e);const n=Rt(t);switch(i){case z.Earth:return new ae(0,0,0,n);case z.Moon:return li(n);default:const s=Lp(n,z.Earth,i,e);return s.t=n,s}}function ds(i,t){return new He(i.r.x,i.r.y,i.r.z,i.v.x,i.v.y,i.v.z,t)}function yM(i,t){const e=Rt(t);if(i===z.SSB)return new He(0,0,0,0,0,0,e);if(i===z.Pluto)return Ju(e,!1);const n=new Lo(e.tt);switch(i){case z.Sun:return ds(n.Sun,e);case z.Jupiter:return ds(n.Jupiter,e);case z.Saturn:return ds(n.Saturn,e);case z.Uranus:return ds(n.Uranus,e);case z.Neptune:return ds(n.Neptune,e);case z.Moon:case z.EMB:const s=vo(un[z.Earth],e.tt),r=i===z.Moon?Ro(e):Zu(e);return new He(r.x+n.Sun.r.x+s.r.x,r.y+n.Sun.r.y+s.r.y,r.z+n.Sun.r.z+s.r.z,r.vx+n.Sun.v.x+s.v.x,r.vy+n.Sun.v.y+s.v.y,r.vz+n.Sun.v.z+s.v.z,e)}if(i in un){const s=vo(un[i],e.tt);return new He(n.Sun.r.x+s.r.x,n.Sun.r.y+s.r.y,n.Sun.r.z+s.r.z,n.Sun.v.x+s.v.x,n.Sun.v.y+s.v.y,n.Sun.v.z+s.v.z,e)}throw`BaryState: Unsupported body "${i}"`}function Qa(i,t){const e=Rt(t);switch(i){case z.Sun:return new He(0,0,0,0,0,0,e);case z.SSB:const n=new Lo(e.tt);return new He(-n.Sun.r.x,-n.Sun.r.y,-n.Sun.r.z,-n.Sun.v.x,-n.Sun.v.y,-n.Sun.v.z,e);case z.Mercury:case z.Venus:case z.Earth:case z.Mars:case z.Jupiter:case z.Saturn:case z.Uranus:case z.Neptune:const s=vo(un[i],e.tt);return ds(s,e);case z.Pluto:return Ju(e,!0);case z.Moon:case z.EMB:const r=vo(un.Earth,e.tt),o=i==z.Moon?Ro(e):Zu(e);return new He(o.x+r.r.x,o.y+r.r.y,o.z+r.r.z,o.vx+r.v.x,o.vy+r.v.y,o.vz+r.v.z,e);default:if(_c(i)){const a=de(i,e);return new He(a.x,a.y,a.z,0,0,0,e)}throw`HelioState: Unsupported body "${i}"`}}function vM(i,t,e,n,s){let r=(s+e)/2-n,o=(s-e)/2,a=n,c;if(r==0){if(o==0||(c=-a/o,c<-1||c>1))return null}else{let h=o*o-4*r*a;if(h<=0)return null;let d=Math.sqrt(h),f=(-o+d)/(2*r),m=(-o-d)/(2*r);if(-1<=f&&f<=1){if(-1<=m&&m<=1)return null;c=f}else if(-1<=m&&m<=1)c=m;else return null}let l=i+c*t,u=(2*r*c+o)/t;return{t:l,df_dt:u}}function Ze(i,t,e,n){const s=se(n&&n.dt_tolerance_seconds||1),r=Math.abs(s/mc);let o=n&&n.init_f1||i(t),a=n&&n.init_f2||i(e),c=NaN,l=0,u=n&&n.iter_limit||20,h=!0;for(;;){if(++l>u)throw"Excessive iteration in Search()";let d=Z3(t,e,.5),f=d.ut-t.ut;if(Math.abs(f)<r)return d;h?c=i(d):h=!0;let m=vM(d.ut,e.ut-d.ut,o,c,a);if(m){let _=Rt(m.t),g=i(_);if(m.df_dt!==0){if(Math.abs(g/m.df_dt)<r)return _;let p=1.2*Math.abs(g/m.df_dt);if(p<f/10){let y=_.AddDays(-p),v=_.AddDays(+p);if((y.ut-t.ut)*(y.ut-e.ut)<0&&(v.ut-t.ut)*(v.ut-e.ut)<0){let x=i(y),M=i(v);if(x<0&&M>=0){o=x,a=M,t=y,e=v,c=g,h=!1;continue}}}}}if(o<0&&c>=0){e=d,a=c;continue}if(c<0&&a>=0){t=d,o=c;continue}return null}}function Gr(i){let t=i;for(;t<=-180;)t+=360;for(;t>180;)t-=360;return t}function Qs(i){for(;i<0;)i+=360;for(;i>=360;)i-=360;return i}function Dp(i,t,e){function n(o){let a=Ep(o);return Gr(a.elon-i)}se(i),se(e);let s=Rt(t),r=s.AddDays(e);return Ze(n,s,r,{dt_tolerance_seconds:.01})}function Qu(i,t,e){if(i===z.Earth||t===z.Earth)throw"The Earth does not have a longitude as seen from itself.";const n=Rt(e),s=on(i,n,!1),r=yo(s),o=on(t,n,!1),a=yo(o);return Qs(r.elon-a.elon)}function Rr(i,t){if(i==z.Earth)throw"The Earth does not have an angle as seen from itself.";const e=Rt(t),n=on(z.Sun,e,!0),s=on(i,e,!0);return gc(n,s)}function Es(i,t){if(i===z.Sun)throw"Cannot calculate heliocentric longitude of the Sun.";const e=de(i,t);return yo(e).elon}function xM(i,t,e,n){let s,r=0,o=0,a=0;switch(i){case z.Mercury:s=-.6,r=4.98,o=-4.88,a=3.02;break;case z.Venus:t<163.6?(s=-4.47,r=1.03,o=.57,a=.13):(s=.98,r=-1.02);break;case z.Mars:s=-1.52,r=1.6;break;case z.Jupiter:s=-9.4,r=.5;break;case z.Uranus:s=-7.19,r=.25;break;case z.Neptune:s=-6.87;break;case z.Pluto:s=-1,r=4;break;default:throw`VisualMagnitude: unsupported body ${i}`}const c=t/100;let l=s+c*(r+c*(o+c*a));return l+=5*Math.log10(e*n),l}function MM(i,t,e,n,s){const r=yo(n),o=lt*28.06,a=lt*(169.51+382e-7*s.tt),c=lt*r.elat,l=lt*r.elon,u=Math.asin(Math.sin(c)*Math.cos(o)-Math.cos(c)*Math.sin(o)*Math.sin(l-a)),h=Math.sin(Math.abs(u));let d=-9+.044*i;return d+=h*(-2.6+1.2*h),d+=5*Math.log10(t*e),{mag:d,ring_tilt:Re*u}}function bM(i,t,e){let n=i*lt,s=n*n,r=s*s,o=-12.717+1.49*Math.abs(n)+.0431*r;const a=385000.6/ye;let c=e/a;return o+=5*Math.log10(t*c),o}class Ip{constructor(t,e,n,s,r,o,a,c){this.time=t,this.mag=e,this.phase_angle=n,this.helio_dist=s,this.geo_dist=r,this.gc=o,this.hc=a,this.ring_tilt=c,this.phase_fraction=(1+Math.cos(lt*n))/2}}function Na(i,t){if(i===z.Earth)throw"The illumination of the Earth is not defined.";const e=Rt(t),n=hr(un.Earth,e);let s,r,o,a;i===z.Sun?(o=new ae(-n.x,-n.y,-n.z,e),r=new ae(0,0,0,e),s=0):(i===z.Moon?(o=li(e),r=new ae(n.x+o.x,n.y+o.y,n.z+o.z,e)):(r=de(i,t),o=new ae(r.x-n.x,r.y-n.y,r.z-n.z,e)),s=gc(o,r));let c=o.Length(),l=r.Length(),u;if(i===z.Sun)a=N3+5*Math.log10(c);else if(i===z.Moon)a=bM(s,l,c);else if(i===z.Saturn){const h=MM(s,l,c,o,e);a=h.mag,u=h.ring_tilt}else a=xM(i,s,l,c);return new Ip(e,a,s,l,c,o,r,u)}function xo(i){if(i===z.Earth)throw"The Earth does not have a synodic period as seen from itself.";if(i===z.Moon)return $a;let t=ci[i];if(!t)throw`Not a valid planet name: ${i}`;const e=ci.Earth.OrbitalPeriod,n=t.OrbitalPeriod;return Math.abs(e/(e/n-1))}function Lr(i,t,e){se(t);const n=ci[i];if(!n)throw`Cannot search relative longitude because body is not a planet: ${i}`;if(i===z.Earth)throw"Cannot search relative longitude for the Earth (it is always 0)";const s=n.OrbitalPeriod>ci.Earth.OrbitalPeriod?1:-1;function r(l){const u=Es(i,l),h=Es(z.Earth,l),d=s*(h-u);return Gr(d-t)}let o=xo(i),a=Rt(e),c=r(a);c>0&&(c-=360);for(let l=0;l<100;++l){let u=-c/360*o;if(a=a.AddDays(u),Math.abs(u)*mc<1)return a;let h=c;if(c=r(a),Math.abs(h)<30&&h!==c){let d=h/(h-c);d>.5&&d<2&&(o*=d)}}throw`Relative longitude search failed to converge for ${i} near ${a.toString()} (error_angle = ${c}).`}function th(i){return Qu(z.Moon,z.Sun,i)}function Io(i,t,e){function n(d){let f=th(d);return Gr(f-i)}se(i),se(e);const s=1.5,r=Rt(t);let o=n(r),a,c,l;if(e<0){if(o<0&&(o+=360),a=-($a*o)/360,l=a+s,l<e)return null;c=Math.max(e,a-s)}else{if(o>0&&(o-=360),a=-($a*o)/360,c=a-s,c>e)return null;l=Math.min(e,a+s)}const u=r.AddDays(c),h=r.AddDays(l);return Ze(n,u,h,{dt_tolerance_seconds:.1})}class Np{constructor(t,e){this.quarter=t,this.time=e}}function Op(i){let t=th(i),n=(Math.floor(t/90)+1)%4,s=Io(90*n,i,10);if(!s)throw"Cannot find moon quarter";return new Np(n,s)}function SM(i){let t=new Date(i.time.date.getTime()+6*O3);return Op(t)}class Fp{constructor(t,e,n){this.pressure=t,this.temperature=e,this.density=n}}function Up(i){if(!Number.isFinite(i)||i<-500||i>1e5)throw`Invalid elevation: ${i}`;let s,r;i<=11e3?(s=288.15-.0065*i,r=101325*Math.pow(288.15/s,-5.25577)):i<=2e4?(s=216.65,r=22632*Math.exp(-.00015768832*(i-11e3))):(s=216.65+.001*(i-2e4),r=5474.87*Math.pow(216.65/s,34.16319));const o=r/s/(101325/288.15);return new Fp(r,s,o)}function wM(i,t){const e=i.latitude*lt,n=Math.sin(e),s=Math.cos(e),r=1/Math.hypot(s,n*ni),o=r*(ni*ni),a=(i.height-t)/1e3,c=Pi*r+a,l=Pi*o+a,u=1e3*Math.hypot(c*s,l*n),h=.175*Math.pow(1-.0065/283.15*(i.height-2/3*t),3.256);return Re*-(Math.sqrt(2*(1-h)*t/u)/(1-h))}function EM(i){switch(i){case z.Sun:return dp;case z.Moon:return G3;default:return 0}}function TM(i,t,e,n,s,r=0){if(!Number.isFinite(r)||r<0)throw`Invalid value for metersAboveGround: ${r}`;const o=EM(i),a=Up(t.height-r),l=wM(t,r)-V3*a.density;return zp(i,t,e,n,s,o,l)}function AM(i,t,e,n,s,r){if(!Number.isFinite(r)||r<-90||r>90)throw`Invalid altitude angle: ${r}`;return zp(i,t,e,n,s,0,r)}class CM{constructor(t,e,n,s){this.tx=t,this.ty=e,this.ax=n,this.ay=s}}function cu(i,t,e,n,s,r,o){if(r<0&&o>=0)return new CM(n,s,r,o);if(r>=0&&o<0)return null;if(i>17)throw"Excessive recursion in rise/set ascent search.";const a=s.ut-n.ut;if(a*mc<1||Math.min(Math.abs(r),Math.abs(o))>e*(a/2))return null;const l=new Fn((n.ut+s.ut)/2),u=t(l);return cu(1+i,t,e,n,l,r,u)||cu(1+i,t,e,l,s,u,o)}function PM(i,t){if(t<-90||t>90)throw`Invalid geographic latitude: ${t}`;let e,n;switch(i){case z.Moon:e=4.5,n=8.2;break;case z.Sun:e=.8,n=.5;break;case z.Mercury:e=-1.6,n=1;break;case z.Venus:e=-.8,n=.6;break;case z.Mars:e=-.5,n=.4;break;case z.Jupiter:case z.Saturn:case z.Uranus:case z.Neptune:case z.Pluto:e=-.2,n=.2;break;case z.Star1:case z.Star2:case z.Star3:case z.Star4:case z.Star5:case z.Star6:case z.Star7:case z.Star8:e=-.008,n=.008;break;default:throw`Body not allowed for altitude search: ${i}`}const s=lt*t;return Math.abs((360/hp-e)*Math.cos(s))+Math.abs(n*Math.sin(s))}function zp(i,t,e,n,s,r,o){if(Br(t),se(s),se(r),se(o),o<-90||o>90)throw`Invalid target altitude angle: ${o}`;const a=PM(i,t.latitude);function c(m){const _=Po(i,m,t,!0,!0),p=Mc(m,t,_.ra,_.dec).altitude+Re*Math.asin(r/_.dist);return e*(p-o)}const l=Rt(n);let u=l,h=l,d=c(u),f=d;for(;;){s<0?(u=h.AddDays(-.42),d=c(u)):(h=u.AddDays(.42),f=c(h));const m=cu(0,c,a,u,h,d,f);if(m){const _=Ze(c,m.tx,m.ty,{dt_tolerance_seconds:.1,init_f1:m.ax,init_f2:m.ay});if(_){if(s<0){if(_.ut<l.ut+s)return null}else if(_.ut>l.ut+s)return null;return _}throw`Rise/set search failed after finding ascent: t1=${u}, t2=${h}, a1=${d}, a2=${f}`}if(s<0){if(u.ut<l.ut+s)return null;h=u,f=d}else{if(h.ut>l.ut+s)return null;u=h,d=f}}}class kp{constructor(t,e){this.time=t,this.hor=e}}function RM(i,t,e,n,s=1){Br(t);let r=Rt(n),o=0;if(i===z.Earth)throw"Cannot search for hour angle of the Earth.";if(se(e),e<0||e>=24)throw`Invalid hour angle ${e}`;if(se(s),s===0)throw"Direction must be positive or negative.";for(;;){++o;let a=Di(r),c=Po(i,r,t,!0,!0),l=(e+c.ra-t.longitude/15-a)%24;if(o===1?s>0?l<0&&(l+=24):l>0&&(l-=24):l<-12?l+=24:l>12&&(l-=24),Math.abs(l)*3600<.1){const h=Mc(r,t,c.ra,c.dec,"normal");return new kp(r,h)}let u=l/24*hp;r=r.AddDays(u)}}function LM(i,t,e){const n=Rt(t),s=ju(n),r=Po(i,n,e,!0,!0);let o=(e.longitude/15+s-r.ra)%24;return o<0&&(o+=24),o}class Bp{constructor(t,e,n,s){this.mar_equinox=t,this.jun_solstice=e,this.sep_equinox=n,this.dec_solstice=s}}function DM(i){function t(o,a,c){let l=new Date(Date.UTC(i,a-1,c)),u=Dp(o,l,20);if(!u)throw`Cannot find season change near ${l.toISOString()}`;return u}if(i instanceof Date&&Number.isFinite(i.getTime())&&(i=i.getUTCFullYear()),!Number.isSafeInteger(i))throw`Cannot calculate seasons because year argument ${i} is neither a Date nor a safe integer.`;let e=t(0,3,10),n=t(90,6,10),s=t(180,9,10),r=t(270,12,10);return new Bp(e,n,s,r)}class Gp{constructor(t,e,n,s){this.time=t,this.visibility=e,this.elongation=n,this.ecliptic_separation=s}}function Hp(i,t){let e=Rt(t),n=Qu(i,z.Sun,e),s;n>180?(s="morning",n=360-n):s="evening";let r=Rr(i,e);return new Gp(e,s,r,n)}function IM(i,t){function n(c){const l=c.AddDays(-.005),u=c.AddDays(.01/2);let h=Rr(i,l),d=Rr(i,u);return(h-d)/.01}let s=Rt(t);const o={Mercury:{s1:50,s2:85},Venus:{s1:40,s2:50}}[i];if(!o)throw"SearchMaxElongation works for Mercury and Venus only.";let a=0;for(;++a<=2;){let c=Es(i,s),l=Es(z.Earth,s),u=Gr(c-l),h,d,f;u>=-o.s1&&u<+o.s1?(f=0,h=+o.s1,d=+o.s2):u>=+o.s2||u<-o.s2?(f=0,h=-o.s2,d=-o.s1):u>=0?(f=-xo(i)/4,h=+o.s1,d=+o.s2):(f=-xo(i)/4,h=-o.s2,d=-o.s1);let m=s.AddDays(f),_=Lr(i,h,m),g=Lr(i,d,_),p=n(_);if(p>=0)throw`SearchMaxElongation: internal error: m1 = ${p}`;let y=n(g);if(y<=0)throw`SearchMaxElongation: internal error: m2 = ${y}`;let v=Ze(n,_,g,{init_f1:p,init_f2:y,dt_tolerance_seconds:10});if(!v)throw`SearchMaxElongation: failed search iter ${a} (t1=${_.toString()}, t2=${g.toString()})`;if(v.tt>=s.tt)return Hp(i,v);s=g.AddDays(1)}throw"SearchMaxElongation: failed to find event after 2 tries."}function NM(i,t){if(i!==z.Venus)throw"SearchPeakMagnitude currently works for Venus only.";const e=.01;function n(o){const a=o.AddDays(-e/2),c=o.AddDays(+e/2),l=Na(i,a).mag;return(Na(i,c).mag-l)/e}let s=Rt(t),r=0;for(;++r<=2;){let o=Es(i,s),a=Es(z.Earth,s),c=Gr(o-a),l,u,h;c>=-10&&c<10?(h=0,l=10,u=30):c>=30||c<-30?(h=0,l=-30,u=-10):c>=0?(h=-xo(i)/4,l=10,u=30):(h=-xo(i)/4,l=-30,u=-10);let d=s.AddDays(h),f=Lr(i,l,d),m=Lr(i,u,f),_=n(f);if(_>=0)throw`SearchPeakMagnitude: internal error: m1 = ${_}`;let g=n(m);if(g<=0)throw`SearchPeakMagnitude: internal error: m2 = ${g}`;let p=Ze(n,f,m,{init_f1:_,init_f2:g,dt_tolerance_seconds:10});if(!p)throw`SearchPeakMagnitude: failed search iter ${r} (t1=${f.toString()}, t2=${m.toString()})`;if(p.tt>=s.tt)return Na(i,p);s=m.AddDays(1)}throw"SearchPeakMagnitude: failed to find event after 2 tries."}var Ki;(function(i){i[i.Pericenter=0]="Pericenter",i[i.Apocenter=1]="Apocenter"})(Ki||(Ki={}));class Mo{constructor(t,e,n){this.time=t,this.kind=e,this.dist_au=n,this.dist_km=n*ye}}function Vp(i){function e(c){let l=c.AddDays(-5e-4),u=c.AddDays(.001/2),h=Wi(l).distance_au;return(Wi(u).distance_au-h)/.001}function n(c){return-e(c)}let s=Rt(i),r=e(s);const o=5;for(var a=0;a*o<2*$a;++a){let c=s.AddDays(o),l=e(c);if(r*l<=0){if(r<0||l>0){let u=Ze(e,s,c,{init_f1:r,init_f2:l});if(!u)throw"SearchLunarApsis INTERNAL ERROR: perigee search failed!";let h=Wi(u).distance_au;return new Mo(u,0,h)}if(r>0||l<0){let u=Ze(n,s,c,{init_f1:-r,init_f2:-l});if(!u)throw"SearchLunarApsis INTERNAL ERROR: apogee search failed!";let h=Wi(u).distance_au;return new Mo(u,1,h)}throw"SearchLunarApsis INTERNAL ERROR: cannot classify apsis event!"}s=c,r=l}throw"SearchLunarApsis INTERNAL ERROR: could not find apsis within 2 synodic months of start date."}function OM(i){let e=Vp(i.time.AddDays(11));if(e.kind+i.kind!==1)throw`NextLunarApsis INTERNAL ERROR: did not find alternating apogee/perigee: prev=${i.kind} @ ${i.time.toString()}, next=${e.kind} @ ${e.time.toString()}`;return e}function N0(i,t,e,n){const s=t===Ki.Apocenter?1:-1,r=10;for(;;){const o=n/(r-1);if(o<1/1440){const l=e.AddDays(o/2),u=xs(i,l);return new Mo(l,t,u)}let a=-1,c=0;for(let l=0;l<r;++l){const u=e.AddDays(l*o),h=s*xs(i,u);(l==0||h>c)&&(a=l,c=h)}e=e.AddDays((a-1)*o),n=2*o}}function FM(i,t){const n=t.AddDays(ci[i].OrbitalPeriod*-.08333333333333333),s=t.AddDays(ci[i].OrbitalPeriod*(270/360));let r=n,o=n,a=-1,c=-1;const l=(s.ut-n.ut)/99;for(let d=0;d<100;++d){const f=n.AddDays(d*l),m=xs(i,f);d===0?c=a=m:(m>c&&(c=m,o=f),m<a&&(a=m,r=f))}const u=N0(i,0,r.AddDays(-2*l),4*l),h=N0(i,1,o.AddDays(-2*l),4*l);if(u.time.tt>=t.tt)return h.time.tt>=t.tt&&h.time.tt<u.time.tt?h:u;if(h.time.tt>=t.tt)return h;throw"Internal error: failed to find Neptune apsis."}function Wp(i,t){if(t=Rt(t),i===z.Neptune||i===z.Pluto)return FM(i,t);function e(c){let u=c.AddDays(-5e-4),h=c.AddDays(.001/2),d=xs(i,u);return(xs(i,h)-d)/.001}function n(c){return-e(c)}const s=ci[i].OrbitalPeriod,r=s/6;let o=t,a=e(o);for(let c=0;c*r<2*s;++c){const l=o.AddDays(r),u=e(l);if(a*u<=0){let h,d;if(a<0||u>0)h=e,d=Ki.Pericenter;else if(a>0||u<0)h=n,d=Ki.Apocenter;else throw"Internal error with slopes in SearchPlanetApsis";const f=Ze(h,o,l);if(!f)throw"Failed to find slope transition in planetary apsis search.";const m=xs(i,f);return new Mo(f,d,m)}o=l,a=u}throw"Internal error: should have found planetary apsis within 2 orbital periods."}function UM(i,t){if(t.kind!==Ki.Pericenter&&t.kind!==Ki.Apocenter)throw`Invalid apsis kind: ${t.kind}`;const e=.25*ci[i].OrbitalPeriod,n=t.time.AddDays(e),s=Wp(i,n);if(s.kind+t.kind!==1)throw`Internal error: previous apsis was ${t.kind}, but found ${s.kind} for next apsis.`;return s}function Hr(i){return new Ke([[i.rot[0][0],i.rot[1][0],i.rot[2][0]],[i.rot[0][1],i.rot[1][1],i.rot[2][1]],[i.rot[0][2],i.rot[1][2],i.rot[2][2]]])}function es(i,t){return new Ke([[t.rot[0][0]*i.rot[0][0]+t.rot[1][0]*i.rot[0][1]+t.rot[2][0]*i.rot[0][2],t.rot[0][1]*i.rot[0][0]+t.rot[1][1]*i.rot[0][1]+t.rot[2][1]*i.rot[0][2],t.rot[0][2]*i.rot[0][0]+t.rot[1][2]*i.rot[0][1]+t.rot[2][2]*i.rot[0][2]],[t.rot[0][0]*i.rot[1][0]+t.rot[1][0]*i.rot[1][1]+t.rot[2][0]*i.rot[1][2],t.rot[0][1]*i.rot[1][0]+t.rot[1][1]*i.rot[1][1]+t.rot[2][1]*i.rot[1][2],t.rot[0][2]*i.rot[1][0]+t.rot[1][2]*i.rot[1][1]+t.rot[2][2]*i.rot[1][2]],[t.rot[0][0]*i.rot[2][0]+t.rot[1][0]*i.rot[2][1]+t.rot[2][0]*i.rot[2][2],t.rot[0][1]*i.rot[2][0]+t.rot[1][1]*i.rot[2][1]+t.rot[2][1]*i.rot[2][2],t.rot[0][2]*i.rot[2][0]+t.rot[1][2]*i.rot[2][1]+t.rot[2][2]*i.rot[2][2]]])}function zM(){return new Ke([[1,0,0],[0,1,0],[0,0,1]])}function kM(i,t,e){if(t!==0&&t!==1&&t!==2)throw`Invalid axis ${t}. Must be [0, 1, 2].`;const n=se(e)*lt,s=Math.cos(n),r=Math.sin(n),o=(t+1)%3,a=(t+2)%3,c=t;let l=[[0,0,0],[0,0,0],[0,0,0]];return l[o][o]=s*i.rot[o][o]-r*i.rot[o][a],l[o][a]=r*i.rot[o][o]+s*i.rot[o][a],l[o][c]=i.rot[o][c],l[a][o]=s*i.rot[a][o]-r*i.rot[a][a],l[a][a]=r*i.rot[a][o]+s*i.rot[a][a],l[a][c]=i.rot[a][c],l[c][o]=s*i.rot[c][o]-r*i.rot[c][a],l[c][a]=r*i.rot[c][o]+s*i.rot[c][a],l[c][c]=i.rot[c][c],new Ke(l)}function bc(i,t){t=Rt(t);const e=i.lat*lt,n=i.lon*lt,s=i.dist*Math.cos(e);return new ae(s*Math.cos(n),s*Math.sin(n),i.dist*Math.sin(e),t)}function eh(i){const t=nh(i);return new Ka(t.lon/15,t.lat,t.dist,i)}function nh(i){const t=i.x*i.x+i.y*i.y,e=Math.sqrt(t+i.z*i.z);let n,s;if(t===0){if(i.z===0)throw"Zero-length vector not allowed.";s=0,n=i.z<0?-90:90}else s=Re*Math.atan2(i.y,i.x),s<0&&(s+=360),n=Re*Math.atan2(i.z,Math.sqrt(t));return new kr(n,s,e)}function Xp(i){return i=360-i,i>=360?i-=360:i<0&&(i+=360),i}function BM(i,t){const e=nh(i);return e.lon=Xp(e.lon),e.lat+=bo(t,e.lat),e}function GM(i,t,e){t=Rt(t);const n=Xp(i.lon),s=i.lat+jp(e,i.lat),r=new kr(s,n,i.dist);return bc(r,t)}function bo(i,t){let e;if(se(t),t<-90||t>90)return 0;if(i==="normal"||i==="jplhor"){let n=t;n<-1&&(n=-1),e=1.02/Math.tan((n+10.3/(n+5.11))*lt)/60,i==="normal"&&t<-1&&(e*=(t+90)/89)}else if(!i)e=0;else throw`Invalid refraction option: ${i}`;return e}function jp(i,t){if(t<-90||t>90)return 0;let e=t-bo(i,t);for(;;){let n=e+bo(i,e)-t;if(Math.abs(n)<1e-14)return e-t;e-=n}}function fo(i,t){return new ae(i.rot[0][0]*t.x+i.rot[1][0]*t.y+i.rot[2][0]*t.z,i.rot[0][1]*t.x+i.rot[1][1]*t.y+i.rot[2][1]*t.z,i.rot[0][2]*t.x+i.rot[1][2]*t.y+i.rot[2][2]*t.z,t.t)}function Sc(i,t){return new He(i.rot[0][0]*t.x+i.rot[1][0]*t.y+i.rot[2][0]*t.z,i.rot[0][1]*t.x+i.rot[1][1]*t.y+i.rot[2][1]*t.z,i.rot[0][2]*t.x+i.rot[1][2]*t.y+i.rot[2][2]*t.z,i.rot[0][0]*t.vx+i.rot[1][0]*t.vy+i.rot[2][0]*t.vz,i.rot[0][1]*t.vx+i.rot[1][1]*t.vy+i.rot[2][1]*t.vz,i.rot[0][2]*t.vx+i.rot[1][2]*t.vy+i.rot[2][2]*t.vz,t.t)}function $p(){return new Ke([[1,0,0],[0,.9174821430670688,-.3977769691083922],[0,.3977769691083922,.9174821430670688]])}function HM(){return new Ke([[1,0,0],[0,.9174821430670688,.3977769691083922],[0,-.3977769691083922,.9174821430670688]])}function wc(i){i=Rt(i);const t=yc(i,we.From2000),e=vc(i,we.From2000);return es(t,e)}function VM(i){const t=Rt(i),e=wc(t),n=tm(t);return es(e,n)}function WM(i){const t=Rt(i),e=Qp(t),n=Ec(t);return es(e,n)}function Ec(i){i=Rt(i);const t=vc(i,we.Into2000),e=yc(i,we.Into2000);return es(t,e)}function ih(i,t){i=Rt(i);const e=Math.sin(t.latitude*lt),n=Math.cos(t.latitude*lt),s=Math.sin(t.longitude*lt),r=Math.cos(t.longitude*lt),o=[n*r,n*s,e],a=[-e*r,-e*s,n],c=[s,-r,0],l=-15*Di(i),u=ur(l,o),h=ur(l,a),d=ur(l,c);return new Ke([[h[0],d[0],u[0]],[h[1],d[1],u[1]],[h[2],d[2],u[2]]])}function qp(i,t){const e=ih(i,t);return Hr(e)}function Yp(i,t){i=Rt(i);const e=qp(i,t),n=Ec(i);return es(e,n)}function XM(i,t){const e=Yp(i,t);return Hr(e)}function Kp(i){const t=Ec(i),e=$p();return es(t,e)}function Zp(i){const t=Kp(i);return Hr(t)}function Jp(i,t){i=Rt(i);const e=Zp(i),n=ih(i,t);return es(e,n)}function jM(i,t){const e=Jp(i,t);return Hr(e)}function $M(){return new Ke([[-.0548624779711344,.4941095946388765,-.8676668813529025],[-.8734572784246782,-.4447938112296831,-.1980677870294097],[-.483800052994852,.7470034631630423,.4559861124470794]])}function qM(){return new Ke([[-.0548624779711344,-.8734572784246782,-.483800052994852],[.4941095946388765,-.4447938112296831,.7470034631630423],[-.8676668813529025,-.1980677870294097,.4559861124470794]])}function Qp(i){const e=ts(Rt(i)).tobl*lt,n=Math.cos(e),s=Math.sin(e);return new Ke([[1,0,0],[0,+n,+s],[0,-s,+n]])}function tm(i){const e=ts(Rt(i)).tobl*lt,n=Math.cos(e),s=Math.sin(e);return new Ke([[1,0,0],[0,+n,-s],[0,+s,+n]])}const YM=[["And","Andromeda"],["Ant","Antila"],["Aps","Apus"],["Aql","Aquila"],["Aqr","Aquarius"],["Ara","Ara"],["Ari","Aries"],["Aur","Auriga"],["Boo","Bootes"],["Cae","Caelum"],["Cam","Camelopardis"],["Cap","Capricornus"],["Car","Carina"],["Cas","Cassiopeia"],["Cen","Centaurus"],["Cep","Cepheus"],["Cet","Cetus"],["Cha","Chamaeleon"],["Cir","Circinus"],["CMa","Canis Major"],["CMi","Canis Minor"],["Cnc","Cancer"],["Col","Columba"],["Com","Coma Berenices"],["CrA","Corona Australis"],["CrB","Corona Borealis"],["Crt","Crater"],["Cru","Crux"],["Crv","Corvus"],["CVn","Canes Venatici"],["Cyg","Cygnus"],["Del","Delphinus"],["Dor","Dorado"],["Dra","Draco"],["Equ","Equuleus"],["Eri","Eridanus"],["For","Fornax"],["Gem","Gemini"],["Gru","Grus"],["Her","Hercules"],["Hor","Horologium"],["Hya","Hydra"],["Hyi","Hydrus"],["Ind","Indus"],["Lac","Lacerta"],["Leo","Leo"],["Lep","Lepus"],["Lib","Libra"],["LMi","Leo Minor"],["Lup","Lupus"],["Lyn","Lynx"],["Lyr","Lyra"],["Men","Mensa"],["Mic","Microscopium"],["Mon","Monoceros"],["Mus","Musca"],["Nor","Norma"],["Oct","Octans"],["Oph","Ophiuchus"],["Ori","Orion"],["Pav","Pavo"],["Peg","Pegasus"],["Per","Perseus"],["Phe","Phoenix"],["Pic","Pictor"],["PsA","Pisces Austrinus"],["Psc","Pisces"],["Pup","Puppis"],["Pyx","Pyxis"],["Ret","Reticulum"],["Scl","Sculptor"],["Sco","Scorpius"],["Sct","Scutum"],["Ser","Serpens"],["Sex","Sextans"],["Sge","Sagitta"],["Sgr","Sagittarius"],["Tau","Taurus"],["Tel","Telescopium"],["TrA","Triangulum Australe"],["Tri","Triangulum"],["Tuc","Tucana"],["UMa","Ursa Major"],["UMi","Ursa Minor"],["Vel","Vela"],["Vir","Virgo"],["Vol","Volans"],["Vul","Vulpecula"]],KM=[[83,0,8640,2112],[83,2880,5220,2076],[83,7560,8280,2068],[83,6480,7560,2064],[15,0,2880,2040],[10,3300,3840,1968],[15,0,1800,1920],[10,3840,5220,1920],[83,6300,6480,1920],[33,7260,7560,1920],[15,0,1263,1848],[10,4140,4890,1848],[83,5952,6300,1800],[15,7260,7440,1800],[10,2868,3300,1764],[33,3300,4080,1764],[83,4680,5952,1680],[13,1116,1230,1632],[33,7350,7440,1608],[33,4080,4320,1596],[15,0,120,1584],[83,5040,5640,1584],[15,8490,8640,1584],[33,4320,4860,1536],[33,4860,5190,1512],[15,8340,8490,1512],[10,2196,2520,1488],[33,7200,7350,1476],[15,7393.2,7416,1462],[10,2520,2868,1440],[82,2868,3030,1440],[33,7116,7200,1428],[15,7200,7393.2,1428],[15,8232,8340,1418],[13,0,876,1404],[33,6990,7116,1392],[13,612,687,1380],[13,876,1116,1368],[10,1116,1140,1368],[15,8034,8232,1350],[10,1800,2196,1344],[82,5052,5190,1332],[33,5190,6990,1332],[10,1140,1200,1320],[15,7968,8034,1320],[15,7416,7908,1316],[13,0,612,1296],[50,2196,2340,1296],[82,4350,4860,1272],[33,5490,5670,1272],[15,7908,7968,1266],[10,1200,1800,1260],[13,8232,8400,1260],[33,5670,6120,1236],[62,735,906,1212],[33,6120,6564,1212],[13,0,492,1200],[62,492,600,1200],[50,2340,2448,1200],[13,8400,8640,1200],[82,4860,5052,1164],[13,0,402,1152],[13,8490,8640,1152],[39,6543,6564,1140],[33,6564,6870,1140],[30,6870,6900,1140],[62,600,735,1128],[82,3030,3300,1128],[13,60,312,1104],[82,4320,4350,1080],[50,2448,2652,1068],[30,7887,7908,1056],[30,7875,7887,1050],[30,6900,6984,1044],[82,3300,3660,1008],[82,3660,3882,960],[8,5556,5670,960],[39,5670,5880,960],[50,3330,3450,954],[0,0,906,882],[62,906,924,882],[51,6969,6984,876],[62,1620,1689,864],[30,7824,7875,864],[44,7875,7920,864],[7,2352,2652,852],[50,2652,2790,852],[0,0,720,840],[44,7920,8214,840],[44,8214,8232,828],[0,8232,8460,828],[62,924,978,816],[82,3882,3960,816],[29,4320,4440,816],[50,2790,3330,804],[48,3330,3558,804],[0,258,507,792],[8,5466,5556,792],[0,8460,8550,770],[29,4440,4770,768],[0,8550,8640,752],[29,5025,5052,738],[80,870,978,736],[62,978,1620,736],[7,1620,1710,720],[51,6543,6969,720],[82,3960,4320,696],[30,7080,7530,696],[7,1710,2118,684],[48,3558,3780,684],[29,4770,5025,684],[0,0,24,672],[80,507,600,672],[7,2118,2352,672],[37,2838,2880,672],[30,7530,7824,672],[30,6933,7080,660],[80,690,870,654],[25,5820,5880,648],[8,5430,5466,624],[25,5466,5820,624],[51,6612,6792,624],[48,3870,3960,612],[51,6792,6933,612],[80,600,690,600],[66,258,306,570],[48,3780,3870,564],[87,7650,7710,564],[77,2052,2118,548],[0,24,51,528],[73,5730,5772,528],[37,2118,2238,516],[87,7140,7290,510],[87,6792,6930,506],[0,51,306,504],[87,7290,7404,492],[37,2811,2838,480],[87,7404,7650,468],[87,6930,7140,460],[6,1182,1212,456],[75,6792,6840,444],[59,2052,2076,432],[37,2238,2271,420],[75,6840,7140,388],[77,1788,1920,384],[39,5730,5790,384],[75,7140,7290,378],[77,1662,1788,372],[77,1920,2016,372],[23,4620,4860,360],[39,6210,6570,344],[23,4272,4620,336],[37,2700,2811,324],[39,6030,6210,308],[61,0,51,300],[77,2016,2076,300],[37,2520,2700,300],[61,7602,7680,300],[37,2271,2496,288],[39,6570,6792,288],[31,7515,7578,284],[61,7578,7602,284],[45,4146,4272,264],[59,2247,2271,240],[37,2496,2520,240],[21,2811,2853,240],[61,8580,8640,240],[6,600,1182,238],[31,7251,7308,204],[8,4860,5430,192],[61,8190,8580,180],[21,2853,3330,168],[45,3330,3870,168],[58,6570,6718.4,150],[3,6718.4,6792,150],[31,7500,7515,144],[20,2520,2526,132],[73,6570,6633,108],[39,5790,6030,96],[58,6570,6633,72],[61,7728,7800,66],[66,0,720,48],[73,6690,6792,48],[31,7308,7500,48],[34,7500,7680,48],[61,7680,7728,48],[61,7920,8190,48],[61,7800,7920,42],[20,2526,2592,36],[77,1290,1662,0],[59,1662,1680,0],[20,2592,2910,0],[85,5280,5430,0],[58,6420,6570,0],[16,954,1182,-42],[77,1182,1290,-42],[73,5430,5856,-78],[59,1680,1830,-96],[59,2100,2247,-96],[73,6420,6468,-96],[73,6570,6690,-96],[3,6690,6792,-96],[66,8190,8580,-96],[45,3870,4146,-144],[85,4146,4260,-144],[66,0,120,-168],[66,8580,8640,-168],[85,5130,5280,-192],[58,5730,5856,-192],[3,7200,7392,-216],[4,7680,7872,-216],[58,6180,6468,-240],[54,2100,2910,-264],[35,1770,1830,-264],[59,1830,2100,-264],[41,2910,3012,-264],[74,3450,3870,-264],[85,4260,4620,-264],[58,6330,6360,-280],[3,6792,7200,-288.8],[35,1740,1770,-348],[4,7392,7680,-360],[73,6180,6570,-384],[72,6570,6792,-384],[41,3012,3090,-408],[58,5856,5895,-438],[41,3090,3270,-456],[26,3870,3900,-456],[71,5856,5895,-462],[47,5640,5730,-480],[28,4530,4620,-528],[85,4620,5130,-528],[41,3270,3510,-576],[16,600,954,-585.2],[35,954,1350,-585.2],[26,3900,4260,-588],[28,4260,4530,-588],[47,5130,5370,-588],[58,5856,6030,-590],[16,0,600,-612],[11,7680,7872,-612],[4,7872,8580,-612],[16,8580,8640,-612],[41,3510,3690,-636],[35,1692,1740,-654],[46,1740,2202,-654],[11,7200,7680,-672],[41,3690,3810,-700],[41,4530,5370,-708],[47,5370,5640,-708],[71,5640,5760,-708],[35,1650,1692,-720],[58,6030,6336,-720],[76,6336,6420,-720],[41,3810,3900,-748],[19,2202,2652,-792],[41,4410,4530,-792],[41,3900,4410,-840],[36,1260,1350,-864],[68,3012,3372,-882],[35,1536,1650,-888],[76,6420,6900,-888],[65,7680,8280,-888],[70,8280,8400,-888],[36,1080,1260,-950],[1,3372,3960,-954],[70,0,600,-960],[36,600,1080,-960],[35,1392,1536,-960],[70,8400,8640,-960],[14,5100,5370,-1008],[49,5640,5760,-1008],[71,5760,5911.5,-1008],[9,1740,1800,-1032],[22,1800,2370,-1032],[67,2880,3012,-1032],[35,1230,1392,-1056],[71,5911.5,6420,-1092],[24,6420,6900,-1092],[76,6900,7320,-1092],[53,7320,7680,-1092],[35,1080,1230,-1104],[9,1620,1740,-1116],[49,5520,5640,-1152],[63,0,840,-1156],[35,960,1080,-1176],[40,1470,1536,-1176],[9,1536,1620,-1176],[38,7680,7920,-1200],[67,2160,2880,-1218],[84,2880,2940,-1218],[35,870,960,-1224],[40,1380,1470,-1224],[63,0,660,-1236],[12,2160,2220,-1260],[84,2940,3042,-1272],[40,1260,1380,-1276],[32,1380,1440,-1276],[63,0,570,-1284],[35,780,870,-1296],[64,1620,1800,-1296],[49,5418,5520,-1296],[84,3042,3180,-1308],[12,2220,2340,-1320],[14,4260,4620,-1320],[49,5100,5418,-1320],[56,5418,5520,-1320],[32,1440,1560,-1356],[84,3180,3960,-1356],[14,3960,4050,-1356],[5,6300,6480,-1368],[78,6480,7320,-1368],[38,7920,8400,-1368],[40,1152,1260,-1380],[64,1800,1980,-1380],[12,2340,2460,-1392],[63,0,480,-1404],[35,480,780,-1404],[63,8400,8640,-1404],[32,1560,1650,-1416],[56,5520,5911.5,-1440],[43,7320,7680,-1440],[64,1980,2160,-1464],[18,5460,5520,-1464],[5,5911.5,5970,-1464],[18,5370,5460,-1526],[5,5970,6030,-1526],[64,2160,2460,-1536],[12,2460,3252,-1536],[14,4050,4260,-1536],[27,4260,4620,-1536],[14,4620,5232,-1536],[18,4860,4920,-1560],[5,6030,6060,-1560],[40,780,1152,-1620],[69,1152,1650,-1620],[18,5310,5370,-1620],[5,6060,6300,-1620],[60,6300,6480,-1620],[81,7920,8400,-1620],[32,1650,2370,-1680],[18,4920,5310,-1680],[79,5310,6120,-1680],[81,0,480,-1800],[42,1260,1650,-1800],[86,2370,3252,-1800],[12,3252,4050,-1800],[55,4050,4920,-1800],[60,6480,7680,-1800],[43,7680,8400,-1800],[81,8400,8640,-1800],[81,270,480,-1824],[42,0,1260,-1980],[17,2760,4920,-1980],[2,4920,6480,-1980],[52,1260,2760,-2040],[57,0,8640,-2160]];let Sl,O0;class em{constructor(t,e,n,s){this.symbol=t,this.name=e,this.ra1875=n,this.dec1875=s}}function ZM(i,t){if(se(i),se(t),t<-90||t>90)throw"Invalid declination angle. Must be -90..+90.";i%=24,i<0&&(i+=24),Sl||(Sl=wc(new Fn(-45655.74141261017)),O0=new Fn(0));const e=new kr(t,15*i,1),n=bc(e,O0),s=fo(Sl,n),r=eh(s),o=10/(4*60),a=o/15;for(let c of KM){const l=c[3]*o,u=c[1]*a,h=c[2]*a;if(l<=r.dec&&u<=r.ra&&r.ra<h){const d=YM[c[0]];return new em(d[0],d[1],r.ra,r.dec)}}throw"Unable to find constellation for given coordinates."}var Un;(function(i){i.Penumbral="penumbral",i.Partial="partial",i.Annular="annular",i.Total="total"})(Un||(Un={}));class nm{constructor(t,e,n,s,r,o){this.kind=t,this.obscuration=e,this.peak=n,this.sd_penum=s,this.sd_partial=r,this.sd_total=o}}class JM{constructor(t,e,n,s,r,o,a){this.time=t,this.u=e,this.r=n,this.k=s,this.p=r,this.target=o,this.dir=a}}function No(i,t,e,n){const s=(n.x*e.x+n.y*e.y+n.z*e.z)/(n.x*n.x+n.y*n.y+n.z*n.z),r=s*n.x-e.x,o=s*n.y-e.y,a=s*n.z-e.z,c=ye*Math.hypot(r,o,a),l=+io-(1+s)*(io-i),u=-io+(1+s)*(io+i);return new JM(t,s,c,l,u,e,n)}function tc(i){const t=on(z.Sun,i,!0),e=new ae(-t.x,-t.y,-t.z,t.t),n=li(i);return No(k3,i,n,e)}function F0(i){const t=on(z.Sun,i,!0),e=li(i),n=new ae(-e.x,-e.y,-e.z,e.t);return e.x-=t.x,e.y-=t.y,e.z-=t.z,No(Ln,i,n,e)}function lu(i,t){const e=bp(i,t),n=on(z.Sun,i,!0),s=li(i),r=new ae(e[0]-s.x,e[1]-s.y,e[2]-s.z,i);return s.x-=n.x,s.y-=n.y,s.z-=n.z,No(Ln,i,r,s)}function ec(i,t,e){const n=on(i,e,!0),s=on(z.Sun,e,!0),r=new ae(n.x-s.x,n.y-s.y,n.z-s.z,e);return s.x=-n.x,s.y=-n.y,s.z=-n.z,No(t,e,s,r)}function sh(i,t){const e=11574074074074073e-21,n=t.AddDays(-e),s=t.AddDays(+e),r=i(n);return(i(s).r-r.r)/e}function QM(i,t,e){const n=11574074074074073e-21,s=ec(i,t,e.AddDays(-n));return(ec(i,t,e.AddDays(+n)).r-s.r)/n}function tb(i){const t=i.AddDays(-.03),e=i.AddDays(.03),n=Ze(s=>sh(tc,s),t,e);if(!n)throw"Failed to find peak Earth shadow time.";return tc(n)}function eb(i){const t=i.AddDays(-.03),e=i.AddDays(.03),n=Ze(s=>sh(F0,s),t,e);if(!n)throw"Failed to find peak Moon shadow time.";return F0(n)}function nb(i,t,e){const n=e.AddDays(-1),s=e.AddDays(1),r=Ze(o=>QM(i,t,o),n,s);if(!r)throw"Failed to find peak planet shadow time.";return ec(i,t,r)}function ib(i,t){const e=i.AddDays(-.2),n=i.AddDays(.2);function s(o){return lu(o,t)}const r=Ze(o=>sh(s,o),e,n);if(!r)throw`PeakLocalMoonShadow: search failure for search_center_time = ${i}`;return lu(r,t)}function wl(i,t,e){const n=e/1440,s=i.AddDays(-n),r=i.AddDays(+n),o=Ze(c=>-(tc(c).r-t),s,i),a=Ze(c=>+(tc(c).r-t),i,r);if(!o||!a)throw"Failed to find shadow semiduration";return(a.ut-o.ut)*(24*60/2)}function rh(i){const t=Wi(i);return Re*t.geo_eclip_lat}function im(i,t,e){if(i<=0)throw"Radius of first disc must be positive.";if(t<=0)throw"Radius of second disc must be positive.";if(e<0)throw"Distance between discs is not allowed to be negative.";if(e>=i+t)return 0;if(e==0)return i<=t?1:t*t/(i*i);const n=(i*i-t*t+e*e)/(2*e),s=i*i-n*n;if(s<=0)return i<=t?1:t*t/(i*i);const r=Math.sqrt(s),o=i*i*Math.acos(n/i)-n*r,a=t*t*Math.acos((e-n)/t)-(e-n)*r;return(o+a)/(Math.PI*i*i)}function sm(i,t){const e=new ae(i.x+t.x,i.y+t.y,i.z+t.z,i.t),n=Math.asin(dp/e.Length()),s=Math.asin(H3/t.Length()),r=gc(t,e),o=im(n,s,r*lt);return Math.min(.9999,o)}function rm(i){let e=Rt(i);for(let n=0;n<12;++n){const s=Io(180,e,40);if(!s)throw"Cannot find full moon.";const r=rh(s);if(Math.abs(r)<1.8){const o=tb(s);if(o.r<o.p+Ln){let a=Un.Penumbral,c=0,l=0,u=0,h=wl(o.time,o.p+Ln,200);return o.r<o.k+Ln&&(a=Un.Partial,u=wl(o.time,o.k+Ln,h),o.r+Ln<o.k?(a=Un.Total,c=1,l=wl(o.time,o.k-Ln,u)):c=im(Ln,o.k,o.r)),new nm(a,c,o.time,h,u,l)}}e=s.AddDays(10)}throw"Failed to find lunar eclipse within 12 full moons."}class om{constructor(t,e,n,s,r,o){this.kind=t,this.obscuration=e,this.peak=n,this.distance=s,this.latitude=r,this.longitude=o}}function am(i){return i>.014?Un.Total:Un.Annular}function sb(i){let t=Un.Partial,e=i.time,n=i.r,s,r;const o=wc(i.time),a=fo(o,i.dir),c=fo(o,i.target);a.x*=ye,a.y*=ye,a.z*=ye/ni,c.x*=ye,c.y*=ye,c.z*=ye/ni;const l=Pi,u=a.x*a.x+a.y*a.y+a.z*a.z,h=-2*(a.x*c.x+a.y*c.y+a.z*c.z),d=c.x*c.x+c.y*c.y+c.z*c.z-l*l,f=h*h-4*u*d;let m;if(f>0){const _=(-h-Math.sqrt(f))/(2*u),g=_*a.x-c.x,p=_*a.y-c.y,y=(_*a.z-c.z)*ni,v=Math.hypot(g,p)*sr;v==0?s=y>0?90:-90:s=Re*Math.atan(y/v);const x=Di(e);r=(Re*Math.atan2(p,g)-15*x)%360,r<=-180?r+=360:r>180&&(r-=360);const M=Hr(o);let S=new ae(g/ye,p/ye,y/ye,i.time);S=fo(M,S),S.x+=i.target.x,S.y+=i.target.y,S.z+=i.target.z;const T=No(pp,i.time,S,i.dir);if(T.r>1e-9||T.r<0)throw`Unexpected shadow distance from geoid intersection = ${T.r}`;t=am(T.k),m=t===Un.Total?1:sm(i.dir,S)}else m=void 0;return new om(t,m,e,n,s,r)}function rb(i){i=Rt(i);const t=i.AddDays(10);return rm(t)}function cm(i){i=Rt(i);const t=1.8;let e=i,n;for(n=0;n<12;++n){const s=Io(0,e,40);if(!s)throw"Cannot find new moon";const r=rh(s);if(Math.abs(r)<t){const o=eb(s);if(o.r<o.p+fp)return sb(o)}e=s.AddDays(10)}throw"Failed to find solar eclipse within 12 full moons."}function ob(i){i=Rt(i);const t=i.AddDays(10);return cm(t)}class lm{constructor(t,e){this.time=t,this.altitude=e}}class um{constructor(t,e,n,s,r,o,a){this.kind=t,this.obscuration=e,this.partial_begin=n,this.total_begin=s,this.peak=r,this.total_end=o,this.partial_end=a}}function U0(i){return i.p-i.r}function z0(i){return Math.abs(i.k)-i.r}function ab(i,t){const e=hm(t,i.time);let n=i.time.AddDays(-.2),s=i.time.AddDays(.2);const r=Ta(t,1,U0,n,i.time),o=Ta(t,-1,U0,i.time,s);let a,c,l;i.r<Math.abs(i.k)?(n=i.time.AddDays(-.01),s=i.time.AddDays(.01),a=Ta(t,1,z0,n,i.time),c=Ta(t,-1,z0,i.time,s),l=am(i.k)):l=Un.Partial;const u=l===Un.Total?1:sm(i.dir,i.target);return new um(l,u,r,a,e,c,o)}function Ta(i,t,e,n,s){function r(a){const c=lu(a,i);return t*e(c)}const o=Ze(r,n,s);if(!o)throw"Local eclipse transition search failed.";return hm(i,o)}function hm(i,t){const e=cb(t,i);return new lm(t,e)}function cb(i,t){const e=Po(z.Sun,i,t,!0,!0);return Mc(i,t,e.ra,e.dec,"normal").altitude}function dm(i,t){i=Rt(i),Br(t);const e=1.8;let n=i;for(;;){const s=Io(0,n,40);if(!s)throw"Cannot find next new moon";const r=rh(s);if(Math.abs(r)<e){const o=ib(s,t);if(o.r<o.p){const a=ab(o,t);if(a.partial_begin.altitude>0||a.partial_end.altitude>0)return a}}n=s.AddDays(10)}}function lb(i,t){i=Rt(i);const e=i.AddDays(10);return dm(e,t)}class fm{constructor(t,e,n,s){this.start=t,this.peak=e,this.finish=n,this.separation=s}}function ub(i,t,e,n){const s=ec(t,e,i);return n*(s.r-s.p)}function k0(i,t,e,n,s){const r=Ze(o=>ub(o,i,t,s),e,n);if(!r)throw"Planet transit boundary search failed";return r}function pm(i,t){t=Rt(t);const e=.4;let n;switch(i){case z.Mercury:n=2439.7;break;case z.Venus:n=6051.8;break;default:throw`Invalid body: ${i}`}let s=t;for(;;){const r=Lr(i,0,s);if(Rr(i,r)<e){const a=nb(i,n,r);if(a.r<a.p){const c=a.time.AddDays(-1),l=k0(i,n,c,a.time,-1),u=a.time.AddDays(1),h=k0(i,n,a.time,u,1),d=60*Rr(i,a.time);return new fm(l,a.time,h,d)}}s=r.AddDays(10)}}function hb(i,t){t=Rt(t);const e=t.AddDays(100);return pm(i,e)}var wi;(function(i){i[i.Invalid=0]="Invalid",i[i.Ascending=1]="Ascending",i[i.Descending=-1]="Descending"})(wi||(wi={}));class mm{constructor(t,e){this.kind=t,this.time=e}}const gm=10;function _m(i){let t=Rt(i),e=Ia(t);for(;;){const n=t.AddDays(gm),s=Ia(n);if(e.lat*s.lat<=0){const r=s.lat>e.lat?wi.Ascending:wi.Descending,o=Ze(a=>r*Ia(a).lat,t,n);if(!o)throw"Could not find moon node.";return new mm(r,o)}t=n,e=s}}function db(i){const t=i.time.AddDays(gm),e=_m(t);switch(i.kind){case wi.Ascending:if(e.kind!==wi.Descending)throw`Internal error: previous node was ascending, but this node was: ${e.kind}`;break;case wi.Descending:if(e.kind!==wi.Ascending)throw`Internal error: previous node was descending, but this node was: ${e.kind}`;break;default:throw`Previous node has an invalid node kind: ${i.kind}`}return e}class oh{constructor(t,e,n,s){this.ra=t,this.dec=e,this.spin=n,this.north=s}}function fb(i){const t=Cr([0,0,1],i,we.Into2000),e=Ar(t,i,we.Into2000),n=new ae(e[0],e[1],e[2],i),s=eh(n),r=190.41375788700253+360.9856122880876*i.ut;return new oh(s.ra,s.dec,r,n)}function pb(i,t){const e=Rt(t),n=e.tt,s=n/36525;let r,o,a;switch(i){case z.Sun:r=286.13,o=63.87,a=84.176+14.1844*n;break;case z.Mercury:r=281.0103-.0328*s,o=61.4155-.0049*s,a=329.5988+6.1385108*n+.01067257*Math.sin(lt*(174.7910857+4.092335*n))-.00112309*Math.sin(lt*(349.5821714+8.18467*n))-1104e-7*Math.sin(lt*(164.3732571+12.277005*n))-2539e-8*Math.sin(lt*(339.1643429+16.36934*n))-571e-8*Math.sin(lt*(153.9554286+20.461675*n));break;case z.Venus:r=272.76,o=67.16,a=160.2-1.4813688*n;break;case z.Earth:return fb(e);case z.Moon:const d=lt*(125.045-.0529921*n),f=lt*(250.089-.1059842*n),m=lt*(260.008+13.0120009*n),_=lt*(176.625+13.3407154*n),g=lt*(357.529+.9856003*n),p=lt*(311.589+26.4057084*n),y=lt*(134.963+13.064993*n),v=lt*(276.617+.3287146*n),x=lt*(34.226+1.7484877*n),M=lt*(15.134-.1589763*n),S=lt*(119.743+.0036096*n),T=lt*(239.961+.1643573*n),I=lt*(25.053+12.9590088*n);r=269.9949+.0031*s-3.8787*Math.sin(d)-.1204*Math.sin(f)+.07*Math.sin(m)-.0172*Math.sin(_)+.0072*Math.sin(p)-.0052*Math.sin(M)+.0043*Math.sin(I),o=66.5392+.013*s+1.5419*Math.cos(d)+.0239*Math.cos(f)-.0278*Math.cos(m)+.0068*Math.cos(_)-.0029*Math.cos(p)+9e-4*Math.cos(y)+8e-4*Math.cos(M)-9e-4*Math.cos(I),a=38.3213+(13.17635815-14e-13*n)*n+3.561*Math.sin(d)+.1208*Math.sin(f)-.0642*Math.sin(m)+.0158*Math.sin(_)+.0252*Math.sin(g)-.0066*Math.sin(p)-.0047*Math.sin(y)-.0046*Math.sin(v)+.0028*Math.sin(x)+.0052*Math.sin(M)+.004*Math.sin(S)+.0019*Math.sin(T)-.0044*Math.sin(I);break;case z.Mars:r=317.269202-.10927547*s+68e-6*Math.sin(lt*(198.991226+19139.4819985*s))+238e-6*Math.sin(lt*(226.292679+38280.8511281*s))+52e-6*Math.sin(lt*(249.663391+57420.7251593*s))+9e-6*Math.sin(lt*(266.18351+76560.636795*s))+.419057*Math.sin(lt*(79.398797+.5042615*s)),o=54.432516-.05827105*s+51e-6*Math.cos(lt*(122.433576+19139.9407476*s))+141e-6*Math.cos(lt*(43.058401+38280.8753272*s))+31e-6*Math.cos(lt*(57.663379+57420.7517205*s))+5e-6*Math.cos(lt*(79.476401+76560.6495004*s))+1.591274*Math.cos(lt*(166.325722+.5042615*s)),a=176.049863+350.891982443297*n+145e-6*Math.sin(lt*(129.071773+19140.0328244*s))+157e-6*Math.sin(lt*(36.352167+38281.0473591*s))+4e-5*Math.sin(lt*(56.668646+57420.929536*s))+1e-6*Math.sin(lt*(67.364003+76560.2552215*s))+1e-6*Math.sin(lt*(104.79268+95700.4387578*s))+.584542*Math.sin(lt*(95.391654+.5042615*s));break;case z.Jupiter:const b=lt*(99.360714+4850.4046*s),w=lt*(175.895369+1191.9605*s),O=lt*(300.323162+262.5475*s),G=lt*(114.012305+6070.2476*s),$=lt*(49.511251+64.3*s);r=268.056595-.006499*s+117e-6*Math.sin(b)+938e-6*Math.sin(w)+.001432*Math.sin(O)+3e-5*Math.sin(G)+.00215*Math.sin($),o=64.495303+.002413*s+5e-5*Math.cos(b)+404e-6*Math.cos(w)+617e-6*Math.cos(O)-13e-6*Math.cos(G)+926e-6*Math.cos($),a=284.95+870.536*n;break;case z.Saturn:r=40.589-.036*s,o=83.537-.004*s,a=38.9+810.7939024*n;break;case z.Uranus:r=257.311,o=-15.175,a=203.81-501.1600928*n;break;case z.Neptune:const R=lt*(357.85+52.316*s);r=299.36+.7*Math.sin(R),o=43.46-.51*Math.cos(R),a=249.978+541.1397757*n-.48*Math.sin(R);break;case z.Pluto:r=132.993,o=-6.163,a=302.695+56.3625225*n;break;default:throw`Invalid body: ${i}`}const c=o*lt,l=r*lt,u=Math.cos(c),h=new ae(u*Math.cos(l),u*Math.sin(l),Math.sin(c),e);return new oh(r/15,o,a,h)}function mb(i,t,e,n){const s=Rt(t),r=tu(e),o=tu(n);let a,c;return e===z.Earth&&n===z.Moon?(a=new He(0,0,0,0,0,0,s),c=Ro(s)):(a=Qa(e,s),c=Qa(n,s)),ym(i,a,r,c,o)}function ym(i,t,e,n,s){if(i<1||i>5)throw`Invalid lagrange point ${i}`;if(!Number.isFinite(e)||e<=0)throw"Major mass must be a positive number.";if(!Number.isFinite(s)||s<=0)throw"Minor mass must be a negative number.";let o=n.x-t.x,a=n.y-t.y,c=n.z-t.z;const l=o*o+a*a+c*c,u=Math.sqrt(l),h=n.vx-t.vx,d=n.vy-t.vy,f=n.vz-t.vz;let m;if(i===4||i===5){const _=a*f-c*d,g=c*h-o*f,p=o*d-a*h;let y=g*c-p*a,v=p*o-_*c,x=_*a-g*o;const M=Math.sqrt(y*y+v*v+x*x);y/=M,v/=M,x/=M,o/=u,a/=u,c/=u;const S=i==4?.8660254037844386:-.8660254037844386,T=.5*o+S*y,I=.5*a+S*v,b=.5*c+S*x,w=.5*y-S*o,O=.5*v-S*a,G=.5*x-S*c,$=u*T,R=u*I,F=u*b,H=h*o+d*a+f*c,U=h*y+d*v+f*x,B=H*T+U*w,Y=H*I+U*O,X=H*b+U*G;m=new He($,R,F,B,Y,X,t.t)}else{const _=-u*(s/(e+s)),g=+u*(e/(e+s)),p=(e+s)/(l*u);let y,v,x;if(i===1||i===2)y=e/(e+s)*Math.cbrt(s/(3*e)),v=-e,i==1?(y=1-y,x=+s):(y=1+y,x=-s);else if(i===3)y=(7/12*s-e)/(s+e),v=+e,x=+s;else throw`Invalid Langrage point ${i}. Must be an integer 1..5.`;let M=u*y-_,S;do{const T=M-_,I=M-g,b=p*M+v/(T*T)+x/(I*I),w=p-2*v/(T*T*T)-2*x/(I*I*I);S=b/w,M-=S}while(Math.abs(S/u)>1e-14);y=(M-_)/u,m=new He(y*o,y*a,y*c,y*h,y*d,y*f,t.t)}return m}class bn{constructor(t,e,n){const s=Rt(e);this.originBody=t;for(let c of n)if(c.t.tt!==s.tt)throw"Inconsistent times in bodyStates";const r=[],o=bn.CalcSolarSystem(s);this.curr=new B0(s,o,r);const a=this.InternalBodyState(t);for(let c of n){const l=new Te(c.x+a.r.x,c.y+a.r.y,c.z+a.r.z),u=new Te(c.vx+a.v.x,c.vy+a.v.y,c.vz+a.v.z),h=Te.zero();r.push(new Do(s.tt,l,u,h))}this.CalcBodyAccelerations(),this.prev=this.Duplicate()}get OriginBody(){return this.originBody}get Time(){return this.curr.time}Update(t){const e=Rt(t),n=e.tt-this.curr.time.tt;if(n===0)this.prev=this.Duplicate();else{this.Swap(),this.curr.time=e,this.curr.gravitators=bn.CalcSolarSystem(e);for(let o=0;o<this.curr.bodies.length;++o){const a=this.prev.bodies[o];this.curr.bodies[o].r=Pr(n,a.r,a.v,a.a)}this.CalcBodyAccelerations();for(let o=0;o<this.curr.bodies.length;++o){const a=this.prev.bodies[o],c=this.curr.bodies[o],l=a.a.mean(c.a);c.tt=e.tt,c.r=Pr(n,a.r,a.v,l),c.v=ru(n,a.v,l)}this.CalcBodyAccelerations()}const s=[],r=this.InternalBodyState(this.originBody);for(let o of this.curr.bodies)s.push(new He(o.r.x-r.r.x,o.r.y-r.r.y,o.r.z-r.r.z,o.v.x-r.v.x,o.v.y-r.v.y,o.v.z-r.v.z,e));return s}Swap(){const t=this.curr;this.curr=this.prev,this.prev=t}SolarSystemBodyState(t){const e=this.InternalBodyState(t),n=this.InternalBodyState(this.originBody);return ds(e.sub(n),this.curr.time)}InternalBodyState(t){if(t===z.SSB)return new ii(this.curr.time.tt,Te.zero(),Te.zero());const e=this.curr.gravitators[t];if(e)return e;throw`Invalid body: ${t}`}static CalcSolarSystem(t){const e={},n=new ii(t.tt,Te.zero(),Te.zero());e[z.Mercury]=Rn(n,t.tt,z.Mercury,Zl),e[z.Venus]=Rn(n,t.tt,z.Venus,Jl),e[z.Earth]=Rn(n,t.tt,z.Earth,_o+qa),e[z.Mars]=Rn(n,t.tt,z.Mars,Ql),e[z.Jupiter]=Rn(n,t.tt,z.Jupiter,Sr),e[z.Saturn]=Rn(n,t.tt,z.Saturn,wr),e[z.Uranus]=Rn(n,t.tt,z.Uranus,Er),e[z.Neptune]=Rn(n,t.tt,z.Neptune,Tr);for(let s in e)e[s].r.decr(n.r),e[s].v.decr(n.v);return e[z.Sun]=new ii(t.tt,n.r.neg(),n.v.neg()),e}CalcBodyAccelerations(){for(let t of this.curr.bodies)t.a=Te.zero(),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Sun].r,Co),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Mercury].r,Zl),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Venus].r,Jl),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Earth].r,_o+qa),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Mars].r,Ql),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Jupiter].r,Sr),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Saturn].r,wr),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Uranus].r,Er),bn.AddAcceleration(t.a,t.r,this.curr.gravitators[z.Neptune].r,Tr)}static AddAcceleration(t,e,n,s){const r=n.x-e.x,o=n.y-e.y,a=n.z-e.z,c=r*r+o*o+a*a,l=s/(c*Math.sqrt(c));t.x+=r*l,t.y+=o*l,t.z+=a*l}Duplicate(){const t={};for(let n in this.curr.gravitators)t[n]=this.curr.gravitators[n].clone();const e=[];for(let n of this.curr.bodies)e.push(n.clone());return new B0(this.curr.time,t,e)}}class B0{constructor(t,e,n){this.time=t,this.gravitators=e,this.bodies=n}}const gb=Object.freeze(Object.defineProperty({__proto__:null,AU_PER_LY:cp,AngleBetween:gc,AngleFromSun:Rr,Apsis:Mo,get ApsisKind(){return Ki},AstroTime:Fn,Atmosphere:Up,AtmosphereInfo:Fp,AxisInfo:oh,BackdatePosition:Lp,BaryState:yM,get Body(){return z},CALLISTO_RADIUS_KM:L3,C_AUDAY:pc,get CalcMoonCount(){return vp},CombineRotation:es,Constellation:ZM,ConstellationInfo:em,CorrectLightTravel:Rp,DEG2RAD:lt,DefineStar:$3,DeltaT_EspenakMeeus:Xu,DeltaT_JplHorizons:Y3,EUROPA_RADIUS_KM:P3,EclipseEvent:lm,get EclipseKind(){return Un},Ecliptic:yo,EclipticCoordinates:wp,EclipticGeoMoon:Ia,EclipticLongitude:Es,Elongation:Hp,ElongationEvent:Gp,Equator:Po,EquatorFromVector:eh,EquatorialCoordinates:Ka,GANYMEDE_RADIUS_KM:R3,GeoEmbState:Zu,GeoMoon:li,GeoMoonState:Ro,GeoVector:on,GlobalSolarEclipseInfo:om,GravitySimulator:bn,HOUR2RAD:Kl,HelioDistance:xs,HelioState:Qa,HelioVector:de,Horizon:Mc,HorizonFromVector:BM,HorizontalCoordinates:Sp,HourAngle:LM,HourAngleEvent:kp,IO_RADIUS_KM:C3,IdentityMatrix:zM,Illumination:Na,IlluminationInfo:Ip,InverseRefraction:jp,InverseRotation:Hr,JUPITER_EQUATORIAL_RADIUS_KM:E3,JUPITER_MEAN_RADIUS_KM:A3,JUPITER_POLAR_RADIUS_KM:T3,JupiterMoons:Ja,JupiterMoonsInfo:Pp,KM_PER_AU:ye,LagrangePoint:mb,LagrangePointFast:ym,Libration:tM,LibrationInfo:xp,LocalSolarEclipseInfo:um,LunarEclipseInfo:nm,MakeRotation:rM,MakeTime:Rt,MassProduct:tu,MoonPhase:th,MoonQuarter:Np,NextGlobalSolarEclipse:ob,NextLocalSolarEclipse:lb,NextLunarApsis:OM,NextLunarEclipse:rb,NextMoonNode:db,NextMoonQuarter:SM,NextPlanetApsis:UM,NextTransit:hb,NodeEventInfo:mm,get NodeEventKind(){return wi},Observer:Yu,ObserverGravity:lM,ObserverState:aM,ObserverVector:oM,PairLongitude:Qu,Pivot:kM,PlanetOrbitalPeriod:q3,RAD2DEG:Re,RAD2HOUR:Vu,Refraction:bo,RotateState:Sc,RotateVector:fo,RotationAxis:pb,RotationMatrix:Ke,Rotation_ECL_EQD:Zp,Rotation_ECL_EQJ:HM,Rotation_ECL_HOR:Jp,Rotation_ECT_EQD:Qp,Rotation_ECT_EQJ:WM,Rotation_EQD_ECL:Kp,Rotation_EQD_ECT:tm,Rotation_EQD_EQJ:Ec,Rotation_EQD_HOR:ih,Rotation_EQJ_ECL:$p,Rotation_EQJ_ECT:VM,Rotation_EQJ_EQD:wc,Rotation_EQJ_GAL:$M,Rotation_EQJ_HOR:XM,Rotation_GAL_EQJ:qM,Rotation_HOR_ECL:jM,Rotation_HOR_EQD:qp,Rotation_HOR_EQJ:Yp,Search:Ze,SearchAltitude:AM,SearchGlobalSolarEclipse:cm,SearchHourAngle:RM,SearchLocalSolarEclipse:dm,SearchLunarApsis:Vp,SearchLunarEclipse:rm,SearchMaxElongation:IM,SearchMoonNode:_m,SearchMoonPhase:Io,SearchMoonQuarter:Op,SearchPeakMagnitude:NM,SearchPlanetApsis:Wp,SearchRelativeLongitude:Lr,SearchRiseSet:TM,SearchSunLongitude:Dp,SearchTransit:pm,SeasonInfo:Bp,Seasons:DM,SetDeltaTFunction:K3,SiderealTime:ju,SphereFromVector:nh,Spherical:kr,StateVector:He,SunPosition:Ep,TransitInfo:fm,Vector:ae,VectorFromHorizon:GM,VectorFromSphere:bc,VectorObserver:cM,e_tilt:ts},Symbol.toStringTag,{value:"Module"}));function _b(i,t){let e=i;for(let n=0;n<10;n++){const s=(e-t*Math.sin(e)-i)/(1-t*Math.cos(e));if(e-=s,Math.abs(s)<1e-6)break}return e}function Zi(i,t){let n=new Date("2000-01-01T12:00:00Z").getTime();i.epoch&&(typeof i.epoch=="number"?n=(i.epoch-24405875e-1)*864e5:n=new Date(i.epoch).getTime());const s=(t.getTime()-n)/864e5,o=.9856076686/i.a**1.5;let a=i.M+o*s;a=a%360,a<0&&(a+=360);const c=Math.PI/180,l=i.a,u=i.e,h=i.i*c,d=i.Omega*c,f=i.w*c,m=a*c,_=_b(m,u),g=l*(Math.cos(_)-u),p=l*Math.sqrt(1-u*u)*Math.sin(_),y=Math.cos(d),v=Math.sin(d),x=Math.cos(f),M=Math.sin(f),S=Math.cos(h),T=Math.sin(h),I=g*(y*x-v*M*S)-p*(y*M+v*x*S),b=g*(v*x+y*M*S)+p*(y*x*S-v*M),w=g*(M*T)+p*(x*T),O=23.4392911*(Math.PI/180),G=Math.cos(O),$=Math.sin(O),R=b*G-w*$,F=b*$+w*G;return{x:I,y:R,z:F}}const tr=gb;function ah(i){return i.dist&&!i.body&&!i.customBody&&!i.pos?"exit":!i.body&&!i.customBody&&!i.pos&&!i.dist?"interpolate":"fixed"}function ch(i,t=100){if(!i||i.length<2)return i||[];const e=i.map(o=>o.pos),n=new lc(e,!1,"centripetal"),s=[],r=i.length;for(let o=0;o<=t;o++){const a=o/t,c=n.getPoint(a),l=a*(r-1),u=Math.floor(l);if(u<0){s.push({pos:c,date:i[0].date});continue}const h=Math.min(u+1,r-1),d=Math.max(0,l-u),f=i[u].date+(i[h].date-i[u].date)*d;s.push({pos:c,date:f})}return s}function Wn(i,t,e=null){const n=new Date(t);if(e){const o=Zi(e,n);return new E(o.x,o.z,-o.y)}if(!i)return new E(0,0,0);if(!tr||!tr.Body)return console.error("[Trajectory Error] Astronomy Engine not loaded correctly!",tr),new E(0,0,0);const s=tr.Body[i];if(!s)return new E(0,0,0);const r=tr.HelioVector(s,n);return r?new E(r.x,r.z,-r.y):(console.warn(`Failed to calculate vector for ${i} at ${n}`),new E(0,0,0))}function lh(i,t){const e=i*15*(Math.PI/180),n=t*(Math.PI/180),s=Math.cos(n)*Math.cos(e),r=Math.cos(n)*Math.sin(e),o=Math.sin(n);return new E(s,o,-r)}function uh(i){let t=new E(0,0,0);if(i.body)t=Wn(i.body,i.date);else if(i.customBody&&Yl[i.customBody])t=Wn(null,i.date,Yl[i.customBody]);else if(i.pos)t=i.pos.clone();else if(i.dist)return new E(0,0,0);if(i.offset){let e=1;(i.body||i.customBody)&&(e=Math.max(1,D.planetScale*In));const n=new E(i.offset.x||0,i.offset.y||0,i.offset.z||0);t.add(n.multiplyScalar(e))}else if(i.lat!==void 0&&i.lon!==void 0&&i.body){const e=Math.max(1,D.planetScale*In),n=new Date(i.date),s=tr.SiderealTime(n),r=i.lon/15,o=(s+r+24)%24,a=i.lat,c=o*15*Math.PI/180,l=a*Math.PI/180,u=Math.cos(l)*Math.cos(c),h=Math.cos(l)*Math.sin(c),d=Math.sin(l),m=new E(u,d,-h).multiplyScalar(45e-6*e);t.add(m)}return t}function vm(i,t){const e=[],n=.2*_t;for(let s=0;s<i.length;s++){const r=i[s];if(t[s].body&&s>0&&s<i.length-1){const a=i[s-1],c=i[s+1],l=new E().subVectors(r.pos,a.pos),u=l.length(),h=Math.min(u*.1,n),d=r.pos.clone().sub(l.normalize().multiplyScalar(h)),f=h/u,m=r.date-(r.date-a.date)*f,_=new E().subVectors(c.pos,r.pos),g=_.length(),p=Math.min(g*.1,n),y=r.pos.clone().add(_.normalize().multiplyScalar(p)),v=p/g,x=r.date+(c.date-r.date)*v,M=8;for(let S=0;S<=M;S++){const T=S/M,I=d,b=r.pos,w=y,O=new E().copy(I).multiplyScalar((1-T)*(1-T)).add(b.clone().multiplyScalar(2*(1-T)*T)).add(w.clone().multiplyScalar(T*T)),G=m+(x-m)*T;e.push({pos:O,date:G})}}else e.push(r)}return e}const yb={teslaRoadster:"Tesla Roadster"},si={};function hh(i,t){const e=typeof t=="string"||t instanceof Date?new Date(t).getTime():t,n=yb[i];if(n){const v=Yl[n];if(v){const x=new Date(e),M=Zi(v,x),S=new E(M.x*_t,M.z*_t,-M.y*_t),T=3600*1e3,I=Zi(v,new Date(e+T)),b=new E(I.x*_t,I.z*_t,-I.y*_t),w=new E().subVectors(b,S).normalize();return{position:S,direction:w}}}let s=Jn.getPositionAtTime(i,e);if(!s){const v=Jn.getDetailedRange(i);v&&(e>=v.start-864e5&&e<=v.start?s=Jn.getPositionAtTime(i,v.start):e>=v.end&&e<=v.end+864e5&&(s=Jn.getPositionAtTime(i,v.end)))}if(s){const v=s.clone().multiplyScalar(_t),x=10*1e3,M=D.coordinateSystem,S=new E(0,0,0);if(M==="Geocentric"||M==="Tychonic"){const w=Wn("Earth",new Date(e));S.copy(w).multiplyScalar(_t)}else if(M==="Barycentric"){const w=de(z.SSB,new Date(e));S.set(w.x,w.z,-w.y).multiplyScalar(_t)}const T=e+x,I=Jn.getPositionAtTime(i,T),b=new E(0,0,1);if(I){const w=I.clone().multiplyScalar(_t),O=new E(0,0,0);if(M==="Geocentric"||M==="Tychonic"){const $=Wn("Earth",new Date(T));O.copy($).multiplyScalar(_t)}else if(M==="Barycentric"){const $=de(z.SSB,new Date(T));O.set($.x,$.z,-$.y).multiplyScalar(_t)}w.sub(O);const G=v.clone().sub(S);b.subVectors(w,G).normalize()}else{const w=e-x,O=Jn.getPositionAtTime(i,w);if(O){const G=O.clone().multiplyScalar(_t),$=new E(0,0,0);if(M==="Geocentric"||M==="Tychonic"){const F=Wn("Earth",new Date(w));$.copy(F).multiplyScalar(_t)}else if(M==="Barycentric"){const F=de(z.SSB,new Date(w));$.set(F.x,F.z,-F.y).multiplyScalar(_t)}G.sub($);const R=v.clone().sub(S);b.subVectors(R,G).normalize()}}return v.sub(S),{position:v,direction:b}}const r=si[i];if(!r||!r.userData.trajectoryData)return null;const o=r.userData.trajectoryData;if(!o||o.length<2)return null;let a=-1;for(let v=0;v<o.length-1;v++)if(o[v].date<=e&&o[v+1].date>=e){a=v;break}if(a===-1)return e<o[0].date||e>o[o.length-1].date,null;const c=o[a],l=o[a+1],u=(e-c.date)/(l.date-c.date),h=new E().lerpVectors(c.pos,l.pos,u),d=D.coordinateSystem,f=new E(0,0,0);if(d==="Geocentric"||d==="Tychonic"){const v=Wn("Earth",new Date(e));f.copy(v).multiplyScalar(_t)}else if(d==="Barycentric"){const v=de(z.SSB,new Date(e));f.set(v.x,v.z,-v.y).multiplyScalar(_t)}h.sub(f);const m=new E(0,0,0),_=new E(0,0,0);if(d==="Geocentric"||d==="Tychonic"){const v=new Date(c.date),x=new Date(l.date);m.copy(Wn("Earth",v)).multiplyScalar(_t),_.copy(Wn("Earth",x)).multiplyScalar(_t)}else if(d==="Barycentric"){const v=new Date(c.date),x=new Date(l.date),M=de(z.SSB,v),S=de(z.SSB,x);m.set(M.x,M.z,-M.y).multiplyScalar(_t),_.set(S.x,S.z,-S.y).multiplyScalar(_t)}const g=c.pos.clone().sub(m),p=l.pos.clone().sub(_),y=new E().subVectors(p,g).normalize();return{position:h,direction:y}}let G0=null;function dh(){Object.keys(si).forEach(i=>{const t=i;si[i]&&(si[i].visible=D.showMissions[t])})}window.updateMissions=dh;function Ts(i,t=!1){const e=D.coordinateSystem;G0===e&&!t||(G0=e,Yi.forEach(n=>{const s=si[n.id];if(!s)return;if(s.userData.hasBinaryData&&s.userData.originalPoints){const h=[],d=x=>{const M=new E(0,0,0);if(e==="Geocentric"||e==="Tychonic"){const S=Wn("Earth",new Date(x));M.copy(S).multiplyScalar(_t)}else if(e==="Barycentric"){const S=de(z.SSB,new Date(x));M.set(S.x,S.z,-S.y).multiplyScalar(_t)}return M},f=s.userData.trajectoryData;if(f)for(let x=0;x<f.length;x++){const M=f[x],S=d(M.date),I=M.pos.clone().sub(S);h.push({pos:I,date:M.date})}s.userData.correctedTrajectory=h;const m=new Qi,_=[];let g=null;const p=s.parent?s.parent.position:new E(0,0,0);if(h.forEach(x=>{if(g&&x.pos.distanceToSquared(g)<.0025)return;const M=x.pos.x-p.x,S=x.pos.y-p.y,T=x.pos.z-p.z;_.push(M,S,T),g=x.pos}),_.length<6)return;m.setPositions(_),s.geometry.dispose(),s.geometry=m,s.computeLineDistances();let y=0;for(let x=0;x<_.length/3-1;x++){const M=x*3,S=(x+1)*3,T=_[S]-_[M],I=_[S+1]-_[M+1],b=_[S+2]-_[M+2];y+=Math.sqrt(T*T+I*I+b*b)}s.userData.totalLength=y,s.material instanceof Ao&&s.material.uniforms.uTotalLength&&(s.material.uniforms.uTotalLength.value=y);const v=[];for(let x=0;x<_.length;x+=3)v.push(new E(_[x],_[x+1],_[x+2]).add(p));s.userData.originalPoints=v,m.computeBoundingSphere&&m.computeBoundingSphere(),s.frustumCulled=!1,s.updateMatrix(),s.updateMatrixWorld(!0);return}const r=n.waypoints.map(h=>{let d=new E;const f=new Date(h.date);if(d=uh(h),h.dist&&n.exit&&!h.body&&!h.customBody&&!h.pos&&(d=lh(n.exit.ra,n.exit.dec).multiplyScalar(h.dist),h.offset)){const g=new E(h.offset.x||0,h.offset.y||0,h.offset.z||0);d.add(g)}const m=new E(0,0,0);if(e==="Geocentric"||e==="Tychonic"){const _=Wn("Earth",h.date);m.copy(_)}else if(e==="Barycentric"){const _=de(z.SSB,f);m.set(_.x,_.z,-_.y)}return d.sub(m),{pos:d,date:f.getTime(),type:ah(h),dist:h.dist}}),o=[];for(let h=0;h<r.length;h++){const d=r[h];if(d.type==="interpolate"){const f=o[h-1];let m=null;for(let _=h+1;_<r.length;_++)if(r[_].type!=="interpolate"){m=r[_];break}if(f&&m){const _=m.date-f.date,p=(d.date-f.date)/_,y=new E().lerpVectors(f.pos,m.pos,p);o.push({pos:y,date:d.date})}else o.push({pos:new E(0,0,0),date:d.date})}else o.push({pos:d.pos,date:d.date})}let a;try{a=ch(o,12e3)}catch(h){console.warn(`Failed to update path for mission ${n.id}:`,h);return}if(!a||a.length<2)return;const c=[a[0]];for(let h=1;h<a.length;h++){const d=c[c.length-1],f=a[h];d.pos.distanceToSquared(f.pos)>1e-6&&c.push(f)}if(c.length<2)return;a=c;const l=s.geometry,u=[];a.forEach(h=>{const d=h.pos.clone().multiplyScalar(_t);u.push(d.x,d.y,d.z)}),l.setPositions(u),s.computeLineDistances(),s.userData.originalPoints=a.map(h=>h.pos.clone().multiplyScalar(_t)),s.userData.trajectoryData=a.map(h=>({pos:h.pos.clone().multiplyScalar(_t),date:h.date})),l.computeBoundingSphere(),s.userData.localOrigin.set(0,0,0),s.position.set(0,0,0),s.userData.totalLength=null}))}function xm(i){try{const t=Object.values(si);if(t.length===0)return;const e=new ht(window.innerWidth,window.innerHeight),n=t[0].parent;if(!n||!n.parent)return;const r=n.parent.position.clone().negate();if(n.position.distanceTo(r)>5e3){n.position.copy(r),n.userData.rebaseCount===void 0&&(n.userData.rebaseCount=0),n.userData.rebaseCount++;const o=n.parent;o&&Ts(o,!0)}t.forEach(o=>{var u,h;const a=o.material;if(a.resolution&&a.resolution.copy(e),!o.visible)return;const c=o.userData.startTime,l=o.userData.duration;if(!o.userData.totalLength){let d=0;const f=o.userData.originalPoints;for(let m=1;m<f.length;m++)d+=f[m].distanceTo(f[m-1]);o.userData.totalLength=d,(u=a.uniforms)!=null&&u.uTotalLength&&(a.uniforms.uTotalLength.value=d)}if(c!==void 0&&l>0){let d=(i-c)/l;d=Math.max(0,Math.min(1,d)),(h=a.uniforms)!=null&&h.uCurrentTime&&(a.uniforms.uCurrentTime.value=d)}})}catch(t){window._suppressMissionErrors||(console.warn("Mission update error:",t),window._suppressMissionErrors=!0)}}const vb=new ht(window.innerWidth,window.innerHeight);function uu(i,t){vb.set(i,t)}async function Mm(i){const t=["teslaRoadster"],e=Yi.map(async n=>{if(t.includes(n.id))return;const s=await Jn.load(n.id);let r;if(s){const f=Jn.getGeometryData(n.id);if(f&&f.length>=6){r=[];const m=s,_=4,g=m.length/_;for(let p=0;p<g;p++){const y=m[p*_],v=m[p*_+1],x=m[p*_+2],M=m[p*_+3];r.push({pos:new E(v,x,M),date:y})}}}if(!r){const f=n.waypoints.map(g=>{const p=uh(g),y=ah(g);return{pos:p,date:new Date(g.date).getTime(),type:y,dist:g.dist}}),m=[];for(let g=0;g<f.length;g++){const p=f[g];if(p.pos)m.push({pos:p.pos,date:p.date});else if(p.type==="exit")if(n.exit){const v=lh(n.exit.ra,n.exit.dec).multiplyScalar(p.dist||0);m.push({pos:v,date:p.date})}else m.push({pos:new E(0,0,0),date:p.date});else if(p.type==="interpolate"){const y=m[g-1];let v=null;for(let x=g+1;x<f.length;x++)if(f[x].type!=="interpolate"){v=f[x];break}if(y&&v){const x=v.date-y.date,S=(p.date-y.date)/x,T=new E().lerpVectors(y.pos,v.pos,S);m.push({pos:T,date:p.date})}else m.push({pos:new E(0,0,0),date:p.date})}else m.push({pos:p.pos,date:p.date})}const _=vm(m,n.waypoints);try{r=ch(_,12e3)}catch(g){console.warn(`Failed to create path for mission ${n.id}:`,g);return}}if(!r||r.length<2)return;if(!s){const f=[r[0]];for(let m=1;m<r.length;m++){const _=f[f.length-1],g=r[m];_.pos.distanceToSquared(g.pos)>1e-10&&f.push(g)}if(f.length<2)return;r=f}const o=new Qi,a=[];r.forEach(f=>{const m=f.pos.clone().multiplyScalar(_t);a.push(m.x,m.y,m.z)}),o.setPositions(a);const c=w3({color:n.color??16777215,linewidth:3,resolution:new ht(window.innerWidth,window.innerHeight)}),l=new zr(o,c);l.computeLineDistances();const u=r[0].date,h=r[r.length-1].date,d=h-u;l.userData.id=n.id,l.userData.startTime=u,l.userData.duration=d,l.visible=D.showMissions[n.id],l.userData.hasBinaryData=!!s,l.frustumCulled=!1,l.name=`Trajectory: ${n.name}`,l.userData.missionName=n.name,l.userData.pointCount=r.length,l.userData.dateRange=`${new Date(u).toISOString()} to ${new Date(h).toISOString()}`,l.userData.originalPoints=r.map(f=>f.pos.clone().multiplyScalar(_t)),l.userData.trajectoryData=r.map(f=>({pos:f.pos.clone().multiplyScalar(_t),date:f.date})),l.userData.localOrigin=new E(0,0,0),i.add(l),si[n.id]=l});return await Promise.all(e),Ts(i,!0),si}function bm(i,t,e){const n=new fc,s=new ht;n.params.Line.threshold=.5;const r=o=>{const a=e.getBoundingClientRect();s.x=(o.clientX-a.left)/a.width*2-1,s.y=-((o.clientY-a.top)/a.height)*2+1,n.setFromCamera(s,i);const c=t.children.filter(u=>u.visible),l=n.intersectObjects(c,!1);if(l.length>0){const h=l[0].object.userData.id;if(h){Ei(async()=>{const{windowManager:f}=await Promise.resolve().then(()=>yS);return{windowManager:f}},void 0).then(({windowManager:f})=>{const m=f.getWindow("explorer-window");m&&(f.showWindow("explorer-window"),m.controller&&m.controller.selectTab("mission-details"))});const d=new CustomEvent("mission-selected",{detail:{missionId:h}});window.dispatchEvent(d)}}};return e.addEventListener("click",r),()=>{e.removeEventListener("click",r)}}const ri={};let Oa=null,hu=null;function Sm(i){Oa=i}function wm(i){hu=i}function fh(i){window._mainMissionScene=i}async function xb(i,t){const e=window._mainMissionScene;if(!e||ri[i])return;const{ModelPreview:n}=await Ei(async()=>{const{ModelPreview:l}=await Promise.resolve().then(()=>Uw);return{ModelPreview:l}},void 0),{GLTFLoader:s}=await Ei(async()=>{const{GLTFLoader:l}=await Promise.resolve().then(()=>Fw);return{GLTFLoader:l}},void 0),{DRACOLoader:r}=await Ei(async()=>{const{DRACOLoader:l}=await Promise.resolve().then(()=>nw);return{DRACOLoader:l}},void 0),o=1e-6;if(n.modelCache.has(t)){const u=n.modelCache.get(t).scene.clone();u.name=`probe_${i}`,u.scale.setScalar(o),u.traverse(d=>{var f;if(d.isMesh&&d.material){const m=d.material;Array.isArray(m)?m.forEach(_=>{const g=_;g.color&&(g.emissive=g.color.clone(),g.emissiveIntensity=.5)}):(m.emissive=((f=m.color)==null?void 0:f.clone())||new At(1,1,1),m.emissiveIntensity=.5)}});const h=new Se;h.add(u),e.add(h),ri[i]=h;return}const a=new s,c=new r;c.setDecoderPath("/draco/"),c.setDecoderConfig({type:"js"}),a.setDRACOLoader(c),a.load(t,l=>{n.modelCache.set(t,l);const u=l.scene.clone();u.name=`probe_${i}`,u.scale.setScalar(o),l.scene.traverse(d=>{var f;if(d.isMesh&&d.material){const m=d.material;Array.isArray(m)?m.forEach(_=>{var g;(_ instanceof $n||_ instanceof d0)&&(_.emissive=((g=_.color)==null?void 0:g.clone())||new At(1,1,1),_.emissiveIntensity=.5)}):(m instanceof $n||m instanceof d0)&&(m.emissive=((f=m.color)==null?void 0:f.clone())||new At(1,1,1),m.emissiveIntensity=.5)}});const h=new Se;h.add(u),e.add(h),ri[i]=h},void 0,l=>{console.warn(`Failed to load probe model for ${i}:`,l)})}function ph(i){if(!window._mainMissionScene||!Oa)return;const e=i.getTime();Object.keys(ri).forEach(n=>{var o,a;const s=ri[n];if(!s)return;if(!D.showMissions[n]){s.visible=!1;return}if(!Oa)return;const r=Oa(n,e);if(r){s.visible=!0;let c=new E(0,0,0);if(hu){const u=hu[n];(o=u==null?void 0:u.userData)!=null&&o.localOrigin&&(c=u.userData.localOrigin)}const l=r.position.clone().sub(c);if(s.position.copy(l),n==="teslaRoadster"){const u=window.SimulationControl;if(u!=null&&u.planets){const h=u.planets.find(d=>d.data.name==="Tesla Roadster");if((a=h==null?void 0:h.orbitLine)!=null&&a.geometry){const f=h.orbitLine.geometry.getAttribute("position");if(f&&f.count>2){const m=new E;h.mesh.getWorldPosition(m),h.orbitLine.parent&&h.orbitLine.parent.updateMatrixWorld(!0),h.orbitLine.updateMatrixWorld(!0);const _=m.clone();h.orbitLine.worldToLocal(_);let g=1/0;const p=new E;for(let x=0;x<f.count;x++){const M=(x+1)%f.count,S=new E(f.getX(x),f.getY(x),f.getZ(x)),T=new E(f.getX(M),f.getY(M),f.getZ(M)),I=new E().subVectors(T,S),b=I.length();if(b<1e-10)continue;I.divideScalar(b);let O=new E().subVectors(_,S).dot(I);O=Math.max(0,Math.min(b,O));const G=S.clone().add(I.multiplyScalar(O)),$=_.distanceTo(G);$<g&&(g=$,p.copy(G))}const y=p.clone();h.orbitLine.localToWorld(y);const v=y.clone();s.parent&&s.parent.worldToLocal(v),s.position.copy(v)}}}}if(r.direction){const u=s.position.clone().add(r.direction);s.lookAt(u)}}else s.visible=!1})}function mh(){Yi.forEach(i=>{D.showMissions[i.id]&&!ri[i.id]&&i.modelPath&&xb(i.id,i.modelPath)})}function Em(i){const t=ri[i];if(!t)return null;const e=Yi.find(n=>n.id===i);return e?{mesh:t,data:{id:i,name:e.name,radius:2e-6},type:"probe"}:null}async function Tm(i){if(ri[i])return!0;const t=Yi.find(r=>r.id===i);if(!t||!t.modelPath)return!1;D.showMissions[i]=!0,window.updateMissions&&window.updateMissions();const e=5e3,n=100;let s=0;for(;!ri[i]&&s<e;)await new Promise(r=>setTimeout(r,n)),s+=n;return!!ri[i]}const Mb=Object.freeze(Object.defineProperty({__proto__:null,ensureProbeLoaded:Tm,getProbeForFocus:Em,setGetMissionStateFunc:Sm,setMissionLinesRef:wm,setMissionProbeScene:fh,syncMissionProbes:mh,updateMissionProbes:ph},Symbol.toStringTag,{value:"Module"}));Sm(hh);wm(si);const bb=Object.freeze(Object.defineProperty({__proto__:null,createSmoothPath:ch,densifyMissionPoints:vm,ensureProbeLoaded:Tm,getAbsoluteMissionWaypointPosition:uh,getBodyPosition:Wn,getExitVector:lh,getMissionPointType:ah,getMissionState:hh,getProbeForFocus:Em,initializeMissions:Mm,missionLines:si,resizeMissionVisuals:uu,setMissionProbeScene:fh,setupMissionInteraction:bm,syncMissionProbes:mh,updateMissionProbes:ph,updateMissionTrajectories:Ts,updateMissionVisuals:xm,updateMissions:dh},Symbol.toStringTag,{value:"Module"})),Sb=15,wb=2e3,Eb=.35;let Ge=null,dr=!1,Tc=0;const Ti=new E,Dr=new E,Ac=new E,Cc=new E,El=new E;function Am(i,t,e,n){const s=new ht;window.addEventListener("mousedown",r=>{r.button===2&&s.set(r.clientX,r.clientY)}),window.addEventListener("mouseup",r=>{if(r.button===2&&Ge&&s.distanceTo(new ht(r.clientX,r.clientY))<5){const a=H0(r.clientX,r.clientY,i,t,e,n);a&&(a.mesh===Ge.mesh?Cm(i,t):Ab(a.mesh,i,t))}}),window.addEventListener("dblclick",r=>{const o=H0(r.clientX,r.clientY,i,t,e,n);o?ps(o,i,t):Ge&&Ir(t)}),window.addEventListener("keydown",r=>{r.key==="Escape"&&Ge&&Ir(t)})}function Tb(i){return typeof i=="number"?i.toFixed(2):String(i)}function du(i,t){const e=performance.now();if(dr){const n=e-Tc,s=Math.min(n/wb,1),r=s<.5?2*s*s:1-(-2*s+2)**2/2,o=new E().lerpVectors(Ti,Ac,r),a=new E().lerpVectors(Dr,Cc,r);t.setVirtualPosition?(t.setVirtualPosition(o),t.setVirtualTarget(a)):(i.position.copy(o),t.target.copy(a)),s>=1&&(dr=!1,El.copy(So(Ge.mesh,t)),t.resetMomentum&&t.resetMomentum(),t.enabled=!0);return}if(Ge&&!dr){if(!Ge.mesh.visible){Ir(t);return}const n=So(Ge.mesh,t),s=new E().subVectors(n,El);if(s.lengthSq()>0&&s.lengthSq()<1e6)if(t.setVirtualPosition){const r=t.getVirtualPosition(),o=t.getVirtualTarget();r.add(s),o.add(s),t.setVirtualPosition(r),t.setVirtualTarget(o)}else i.position.add(s),t.target.add(s);El.copy(n)}}function So(i,t){const e=new E;return i.getWorldPosition(e),t.localToWorld?t.localToWorld(e):e}function ps(i,t,e,n=Eb){var h;if(!i)return;Ge&&Ge!==i&&Pm(Ge),Ge=i,i.type!=="probe"&&(Cb(Ge),(h=i.data)!=null&&h.name&&br.loadHighRes(i.data.name));const s=So(i.mesh,e),r=i.data.radius||5;let o=1;i.type==="sun"?o=D.sunScale:(i.type==="planet"||i.type==="moon")&&(o=D.planetScale);const a=r*o,c=t.fov*Math.PI/180;let l=a/Math.sin(c*n/2);i.type==="probe"&&(l=Math.max(l,2e-6));let u;if(i.type==="probe"){const d=hh(i.data.id,D.date),f=new E(0,0,1);d!=null&&d.direction&&f.copy(d.direction);const m=l*1,_=l*.3,g=new E(0,1,0);Math.abs(f.dot(g))>.99&&g.set(1,0,0),u=f.clone().multiplyScalar(-m).add(g.multiplyScalar(_))}else{const d=Math.PI/6;u=new E(l*Math.cos(d),l*Math.sin(d),l*Math.cos(d))}e.getVirtualPosition?(Ti.copy(e.getVirtualPosition()),Dr.copy(e.getVirtualTarget())):(Ti.copy(t.position),Dr.copy(e.target)),Ac.copy(s).add(u),Cc.copy(s),dr=!0,Tc=performance.now(),e.enabled=!1,e.enablePan=!1,Pc(i.data.name)}function Cm(i,t){if(!Ge)return;const e=So(Ge.mesh,t);let n;t.getVirtualTarget?n=t.getVirtualTarget():n=t.target.clone(),!(new E().subVectors(n,e).lengthSq()<1e-4)&&(t.getVirtualPosition?Ti.copy(t.getVirtualPosition()):Ti.copy(i.position),Dr.copy(n),Ac.copy(Ti),Cc.copy(e),Tc=performance.now(),dr=!0,t.enabled=!1,Pc("View Recentered"))}function Ab(i,t,e){const n=So(i,e);e.getVirtualPosition?(Ti.copy(e.getVirtualPosition()),Dr.copy(e.getVirtualTarget())):(Ti.copy(t.position),Dr.copy(e.target)),Ac.copy(Ti),Cc.copy(n),Tc=performance.now(),dr=!0,e.enabled=!1,Pc("Looking at Target")}function Ir(i,t=!1){Ge&&(Pm(Ge),Ge=null),i.enabled=!0,i.enablePan=!0,t||Pc("Focus mode deactivated")}function Cb(i){if(!i||!i.mesh)return;i.originalGeometry||(i.originalGeometry=i.mesh.geometry);const t=i.data.radius||5,e=new qi(t,128,128);i.mesh.geometry=e}function Pm(i){!i||!i.mesh||!i.originalGeometry||(i.mesh.geometry.dispose(),i.mesh.geometry=i.originalGeometry,delete i.originalGeometry)}function H0(i,t,e,n,s,r){const o=new fc,a=new ht;a.x=i/window.innerWidth*2-1,a.y=-(t/window.innerHeight)*2+1,o.setFromCamera(a,e);const c=[],l=new Map;r&&(c.push(r),l.set(r.uuid,{mesh:r,data:{name:"Sun",radius:4.65},type:"sun"})),s.forEach(m=>{var _,g;(_=m.mesh)!=null&&_.visible&&(c.push(m.mesh),l.set(m.mesh.uuid,{mesh:m.mesh,data:m.data,type:"planet"}),(g=m.moons)==null||g.forEach(p=>{var y;(y=p.mesh)!=null&&y.visible&&(c.push(p.mesh),l.set(p.mesh.uuid,{mesh:p.mesh,data:p.data,type:"moon"}))}))});const u=o.intersectObjects(c,!1);if(u.length>0)return l.get(u[0].object.uuid);let h=null,d=Sb;const f=(m,_,g)=>{if(!m||!m.position||!m.visible)return;const p=new E;m.getWorldPosition(p);const y=p.clone().project(e);if(y.z>1||y.z<-1)return;const v=(y.x*.5+.5)*window.innerWidth,x=(-(y.y*.5)+.5)*window.innerHeight,M=i-v,S=t-x,T=Math.sqrt(M*M+S*S);T<d&&(d=T,h={mesh:m,data:_,type:g})};return r&&f(r,{name:"Sun",radius:4.65},"sun"),s.forEach(m=>{var _;f(m.mesh,m.data,"planet"),(_=m.moons)==null||_.forEach(g=>{f(g.mesh,g.data,"moon")})}),h}function Pc(i){let t=document.getElementById("focus-notification");t||(t=document.createElement("div"),t.id="focus-notification",t.style.cssText=`
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `,document.body.appendChild(t)),t.textContent=i,t.style.opacity="1",setTimeout(()=>{t.style.opacity="0"},2e3)}function Fa(){return Ge!==null}function Pb(){return Ge}const fu=Object.freeze(Object.defineProperty({__proto__:null,exitFocusMode:Ir,focusOnObject:ps,formatDecimal:Tb,getFocusedObject:Pb,isFocusModeActive:Fa,recenterFocus:Cm,setupFocusMode:Am,updateFocusMode:du},Symbol.toStringTag,{value:"Module"}));function V0(i,t,e){"uniforms"in i?(i.uniforms.uColor.value.set(t),i.uniforms.uOpacity.value=e):"color"in i&&"opacity"in i&&(i.color.set(t),i.opacity=e)}class Rb{constructor(){nt(this,"dock");nt(this,"items");this.dock=document.createElement("div"),this.dock.className="menu-dock",document.body.appendChild(this.dock),this.items=new Map}addItem(t,e,n,s){if(this.items.has(t)){const o=this.items.get(t);o&&this.dock.removeChild(o),this.items.delete(t)}const r=document.createElement("div");r.className="dock-item",r.title=n,r.innerHTML=`<span class="dock-icon">${e}</span>`,r.addEventListener("click",()=>{s(),this.updateActiveState(t)}),this.dock.appendChild(r),this.items.set(t,r)}updateActiveState(t){}setActive(t,e){const n=this.items.get(t);n&&(e?n.classList.add("active"):n.classList.remove("active"))}}const Mi=new Rb;function Rm(i,t){if(t)if(i==="Ecliptic"){const n=fe.degToRad(23.43928);t.rotation.x=-n}else t.rotation.x=0}function Lb(i,t,e,n,s,r,o,a,c){const l=i.addFolder("Visual"),u=l.add(D,"gamma",.1,5).name("Gamma").onChange(h=>{e&&(e.toneMappingExposure=h)});u.domElement.classList.add("hide-value"),u.domElement.classList.add("full-width"),l.add(D,"objectInfoMode",{Tooltips:"tooltip",Window:"window",Off:"off"}).name("Object Info"),c&&l.add(c,"dock").name("Show Dock").onChange(h=>{Mi.dock.style.display=h?"flex":"none"}),l.close()}function so(i,t,e){t.forEach(n=>{var s;n.data.type!=="dwarf"?n.orbitLine&&(n.orbitLine.visible=D.showPlanetOrbits&&D.showPlanets):n.orbitLine&&n.data.name!=="Tesla Roadster"&&(n.orbitLine.visible=D.showDwarfPlanetOrbits&&D.showDwarfPlanets),(s=n.moons)==null||s.forEach(r=>{if(r.data.orbitLine){let o=!1;(r.data.category==="largest"&&D.showLargestMoons||r.data.category==="major"&&D.showMajorMoons||r.data.category==="small"&&D.showSmallMoons)&&(o=!0),r.data.category||(o=!0),r.data.orbitLine.visible=D.showMoonOrbits&&o}})})}function Lm(i,t,e){t.axisLine&&(t.axisLine.visible=i),e.forEach(n=>{var s;n.data.axisLine&&(n.data.axisLine.visible=i),(s=n.moons)==null||s.forEach(r=>{r.data.axisLine&&(r.data.axisLine.visible=i)})})}function nc(i,t){const e=D.showZodiacs,n=D.showAsterisms;if(i){i.visible=e||n;const s=e?7842542:12307694;i.children.forEach(r=>{r.material&&(r.material.color.setHex(s),r.material.opacity=e?.45:.35)})}t&&(t.visible=n)}function Db(i){i&&(i.visible=D.showConstellations)}function Dm(i,t){t&&(t.visible=i)}function Im(i,t){t&&(t.visible=i)}function Nm(i,t,e,n){t&&(t.visible=i,e.forEach(s=>{var r;s.mesh.children.forEach(o=>{o.type==="Group"&&o.children.length>0&&o.children[0].type==="Line"&&(o.visible=i)}),(r=s.moons)==null||r.forEach(o=>{o.mesh.children.forEach(a=>{a.type==="Group"&&a.children.length>0&&a.children[0].type==="Line"&&(a.visible=i)})})}))}function gh(i){const t=D.planetScale*In;let e=1;D.capMagneticFields&&t>100&&(e=100/t),i.forEach(n=>{const s=n.mesh.getObjectByName("MagneticField");s&&s.scale.setScalar(e),(n.moons??[]).forEach(r=>{const o=r.mesh.getObjectByName("MagneticField");o&&o.scale.setScalar(e)})})}function Om(i,t){t.visible=i}function Fm(i,t){t.forEach(e=>{e.data.type!=="dwarf"&&(e.mesh.visible=i,e.data.cloudMesh&&(e.data.cloudMesh.visible=i),e.orbitLine&&(e.orbitLine.visible=i&&D.showPlanetOrbits),e.group.children.forEach(n=>{n!==e.mesh&&n!==e.orbitLinesGroup&&n.type==="Mesh"&&(n.userData.isMoon||(n.visible=i))}))})}function Um(i,t){t.forEach(e=>{e.data.type==="dwarf"&&e.data.name!=="Tesla Roadster"&&(e.group&&(e.group.visible=i),e.orbitLine&&(e.orbitLine.visible=i&&D.showDwarfPlanetOrbits))})}function Ua(i,t,e){t.forEach(n=>{(n.moons??[]).forEach(s=>{s.data.category===e&&(s.mesh.visible=i,s.data.orbitLine&&(s.data.orbitLine.visible=i&&D.showMoonOrbits))})})}function Ib(i,t,e){const n=D,s=[{configKey:"showSun",label:"Sun",icon:"☀️",updateFn:o=>Om(o,e)},{configKey:"showPlanets",label:"Planets",icon:"🪐",updateFn:o=>Fm(o,t)},{configKey:"showDwarfPlanets",label:"Dwarf Planets",icon:"🪨",updateFn:o=>Um(o,t)},{configKey:"showLargestMoons",label:"Largest Moons",icon:"🌕",updateFn:o=>Ua(o,t,"largest")},{configKey:"showMajorMoons",label:"Major Moons",icon:"🌖",updateFn:o=>Ua(o,t,"major")},{configKey:"showSmallMoons",label:"Small Moons",icon:"🥔",updateFn:o=>Ua(o,t,"small")}],r=document.createElement("div");r.className="object-list",s.forEach(o=>{const a=document.createElement("div");a.className="object-item",n[o.configKey]&&a.classList.add("active"),a.innerHTML=`
        <div class="object-icon">${o.icon}</div>
        <div class="object-label">${o.label}</div>
    `,a.addEventListener("click",()=>{n[o.configKey]=!n[o.configKey];const c=n[o.configKey];c?a.classList.add("active"):a.classList.remove("active"),o.updateFn(c)}),r.appendChild(a)}),i.appendChild(r)}function Nb(i,t,e,n,s){const r=D,o=[{configKey:"showConstellations",label:"Constellations",icon:"🌐",updateFn:()=>Db(s)},{configKey:"showAsterisms",label:"Asterisms",icon:"☆",updateFn:()=>nc(t,e)},{configKey:"showZodiacs",label:"Zodiacs",icon:"⁂",updateFn:()=>nc(t,e)},{configKey:"showZodiacSigns",label:"Zodiac Signs",icon:"🦁",updateFn:c=>Dm(c,n)}],a=document.createElement("div");a.className="object-list",o.forEach(c=>{const l=document.createElement("div");l.className="object-item",r[c.configKey]&&l.classList.add("active"),l.innerHTML=`
        <div class="object-icon">${c.icon}</div>
        <div class="object-label">${c.label}</div>
    `,l.addEventListener("click",()=>{r[c.configKey]=!r[c.configKey];const u=r[c.configKey];u?l.classList.add("active"):l.classList.remove("active"),c.updateFn(u)}),a.appendChild(l)}),i.appendChild(a),i.appendChild(a)}function Ob(i,t,e,n){const s=D,r=[{configKey:"showSunOrbits",label:"Sun",icon:"☀️",updateFn:()=>so(t,e)},{configKey:"showPlanetOrbits",label:"Planets",icon:"🪐",updateFn:()=>so(t,e),childToggle:{configKey:"showPlanetColors",label:"Colors",updateFn:()=>W0(t,n,e)}},{configKey:"showDwarfPlanetOrbits",label:"Dwarf Planets",icon:"🪨",updateFn:()=>so(t,e),childToggle:{configKey:"showDwarfPlanetColors",label:"Colors",updateFn:()=>W0(t,n,e)}},{configKey:"showMoonOrbits",label:"Moons",icon:"🌕",updateFn:()=>so(t,e),childToggle:{configKey:"capMoonOrbits",label:"Cap",updateFn:()=>{}}}],o=document.createElement("div");o.className="object-list",r.forEach(a=>{const c=document.createElement("div");c.className="object-item",s[a.configKey]&&c.classList.add("active");const l=document.createElement("div");l.style.display="flex",l.style.alignItems="center",l.style.flexGrow="1",l.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,c.appendChild(l);let u=null;a.childToggle&&(u=document.createElement("div"),u.className="object-toggle",s[a.childToggle.configKey]&&u.classList.add("active"),u.textContent=a.childToggle.label,u.style.display=s[a.configKey]?"flex":"none",u.addEventListener("click",h=>{h.stopPropagation(),s[a.childToggle.configKey]=!s[a.childToggle.configKey];const d=s[a.childToggle.configKey];u&&(d?u.classList.add("active"):u.classList.remove("active")),a.childToggle.updateFn&&a.childToggle.updateFn()}),c.appendChild(u)),l.addEventListener("click",()=>{s[a.configKey]=!s[a.configKey],s[a.configKey]?(c.classList.add("active"),u&&(u.style.display="flex")):(c.classList.remove("active"),u&&(u.style.display="none")),a.updateFn()}),o.appendChild(c)}),i.appendChild(o)}function Fb(i,t,e,n){const s=D,r=[{configKey:"showSunMagneticFieldBasic",label:"Sun",icon:"🔆",updateFn:()=>{if(n){const a=n.children.find(c=>c.name==="SunMagneticFieldBasic");a&&(a.visible=D.showSunMagneticFieldBasic)}}},{configKey:"showSunMagneticField",label:"Solar Wind",icon:"🌬️",updateFn:()=>{if(n){const a=n.children.find(c=>c.name==="MagneticField");a&&(a.visible=D.showSunMagneticField)}},childToggle:{configKey:"showSunMagneticFieldBasic",label:"Basic",updateFn:()=>{if(n){const a=n.children.find(c=>c.name==="SunMagneticFieldBasic");a&&(a.visible=D.showSunMagneticFieldBasic)}}}},{configKey:"showMagneticFields",label:"Planets, Moons",icon:"🧲",updateFn:()=>Nm(D.showMagneticFields,t,e),childToggle:{configKey:"capMagneticFields",label:"Cap",updateFn:()=>gh(e)}}],o=document.createElement("div");o.className="object-list",r.forEach(a=>{const c=document.createElement("div");c.className="object-item",s[a.configKey]&&c.classList.add("active");const l=document.createElement("div");l.style.display="flex",l.style.alignItems="center",l.style.flexGrow="1",l.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,c.appendChild(l);let u=null;a.childToggle&&(u=document.createElement("div"),u.className="object-toggle",s[a.childToggle.configKey]&&u.classList.add("active"),u.textContent=a.childToggle.label,u.style.display=s[a.configKey]?"flex":"none",u.addEventListener("click",h=>{h.stopPropagation(),s[a.childToggle.configKey]=!s[a.childToggle.configKey];const d=s[a.childToggle.configKey];u&&(d?u.classList.add("active"):u.classList.remove("active")),a.childToggle.updateFn&&a.childToggle.updateFn()}),c.appendChild(u)),l.addEventListener("click",()=>{s[a.configKey]=!s[a.configKey],s[a.configKey]?(c.classList.add("active"),u&&(u.style.display="flex")):(c.classList.remove("active"),u&&(u.style.display="none")),a.updateFn()}),o.appendChild(c)}),i.appendChild(o)}function Ub(i,t,e,n){const s=D,r=[{configKey:"showAxes",label:"Axes",icon:"📏",updateFn:a=>Lm(a,t,e)},{configKey:"showHabitableZone",label:"Habitable Zone",icon:"🟢",updateFn:a=>Im(a,n)}],o=document.createElement("div");o.className="object-list",r.forEach(a=>{const c=document.createElement("div");c.className="object-item",s[a.configKey]&&c.classList.add("active"),c.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,c.addEventListener("click",()=>{s[a.configKey]=!s[a.configKey];const l=s[a.configKey];l?c.classList.add("active"):c.classList.remove("active"),a.updateFn(l)}),o.appendChild(c)}),i.appendChild(o)}function W0(i,t,e){const n=D.showPlanetColors,s=D.showDwarfPlanetColors,r=8960989;i.children.forEach(o=>{var l;const a=o.name.replace("_Orbit",""),c=e.find(u=>u.data.name===a);if(c){const h=c.data.type==="dwarf"?s:n,d=h&&c.data.color||r,f=h?.9:.7;V0(o.material,d,f),(l=o.material.uniforms)!=null&&l.uGlowIntensity&&(o.material.uniforms.uGlowIntensity.value=h?.4:.2)}}),t.children.forEach(o=>{var l;const a=o.name.replace("_Trail","");if(a==="Sun")return;const c=e.find(u=>u.data.name===a);if(c){const h=c.data.type==="dwarf"?s:n,d=h&&c.data.color||r,f=h?.9:.7;V0(o.material,d,f),(l=o.material.uniforms)!=null&&l.uGlowIntensity&&(o.material.uniforms.uGlowIntensity.value=h?.4:.2)}})}function zb(i,t){if(!i)return;const e=i.children.find(s=>s.name==="SunMagneticFieldBasic");e&&e.scale.setScalar(t);const n=i.children.find(s=>s.name==="MagneticField");n&&n.scale.setScalar(1)}class kb{constructor(t,e,n,s,r,o,a,c,l,u,h,d,f){nt(this,"planets");nt(this,"sun");nt(this,"orbitGroup");nt(this,"zodiacGroup");nt(this,"asterismsGroup");nt(this,"starsRef");nt(this,"camera");nt(this,"controls");nt(this,"zodiacSignsGroup");nt(this,"habitableZone");nt(this,"magneticFieldsGroup");nt(this,"universeGroup");nt(this,"jumpToDateFn");this.planets=t,this.sun=e,this.orbitGroup=n,this.zodiacGroup=s,this.asterismsGroup=r,this.starsRef=o,this.camera=a,this.controls=c,this.zodiacSignsGroup=l,this.habitableZone=u,this.magneticFieldsGroup=h,this.universeGroup=d,this.jumpToDateFn=f}setPlanetScale(t){const e=t/In;D.planetScale=e,this.planets.forEach(n=>{var s;n.mesh.scale.setScalar(e),(s=n.moons)==null||s.forEach(r=>{r.mesh.scale.setScalar(e)})}),gh(this.planets),Ts(void 0,!0),window.dispatchEvent(new CustomEvent("planet-scale-changed"))}jumpToDate(t,e=!0){this.jumpToDateFn?this.jumpToDateFn(t,e):Bt.warn("jumpToDate function not provided to SimulationControl.")}async jumpToMissionLocation(t,e,n=!0,s=!0){const r=Yi.find(o=>o.id===t);if(r){const o=new Date(e).getTime(),a=r.waypoints.find(c=>Math.abs(new Date(c.date).getTime()-o)<36e5);a&&(a.body||a.customBody)&&(this.setPlanetScale(1),Bt.info(`Flyby detected at ${a.body||a.customBody}. Resetting planet scale to 1x.`))}if(this.jumpToDate(e,n),D.showMissions[t]||(D.showMissions[t]=!0,window.dispatchEvent(new CustomEvent("mission-visibility-changed",{detail:{missionId:t}})),window.updateMissions&&window.updateMissions()),!s){Fa!=null&&Fa()&&Ir(this.controls,!0);return}try{const{ensureProbeLoaded:o,getProbeForFocus:a}=await Ei(async()=>{const{ensureProbeLoaded:l,getProbeForFocus:u}=await Promise.resolve().then(()=>Mb);return{ensureProbeLoaded:l,getProbeForFocus:u}},void 0);if(await o(t)){const l=a(t);l?(ps(l,this.camera,this.controls),Bt.info(`Focused on mission ${t}`)):Bt.warn(`Probe wrapper not found for ${t}`)}else Bt.warn(`Failed to ensure probe loaded for ${t}`)}catch(o){Bt.error("Error focusing on mission:",o)}}getConfig(){return D}setSpeed(t){D.simulationSpeed=t}setDate(t){const[e,n,s]=t.split("-").map(Number),r=D.date;D.date=new Date(e,n-1,s,r.getHours(),r.getMinutes(),r.getSeconds())}focus(t){const e=t.toLowerCase();if(e==="sun"){ps({mesh:this.sun,data:{name:"Sun",radius:5},type:"sun"},this.camera,this.controls);return}for(const n of this.planets){if(n.data.name.toLowerCase()===e){ps(n,this.camera,this.controls);return}for(const s of n.moons??[])if(s.data.name.toLowerCase()===e){ps(s,this.camera,this.controls);return}}Bt.warn(`Object '${t}' not found.`)}exitFocus(){Ir(this.controls)}rotateToDarkSide(){const t=this.controls.target,e=this.camera,n=new E(0,0,0),s=t.clone(),r=new E().subVectors(s,n).normalize(),o=e.position.distanceTo(s),a=s.clone().add(r.multiplyScalar(o));e.position.copy(a),this.controls.update()}setReferencePlane(t){if(t!=="Equatorial"&&t!=="Ecliptic"){Bt.warn("Invalid plane. Use 'Equatorial' or 'Ecliptic'.");return}D.referencePlane=t,Rm(t,this.universeGroup)}setStarBrightness(t){var n;D.starBrightness=Math.max(0,Math.min(1,t));const e=this.starsRef.value;(n=e==null?void 0:e.userData)!=null&&n.manager&&e.userData.manager.setBrightness(D.starBrightness)}toggleOrbits(t){D.showOrbits=t,so(this.orbitGroup,this.planets)}toggleAxes(t){D.showAxes=t,Lm(t,this.sun,this.planets)}toggleZodiacs(t){D.showZodiacs=t,nc(this.zodiacGroup,this.asterismsGroup)}toggleAsterisms(t){D.showAsterisms=t,nc(this.zodiacGroup,this.asterismsGroup)}toggleZodiacSigns(t){D.showZodiacSigns=t,Dm(t,this.zodiacSignsGroup)}toggleHabitableZone(t){D.showHabitableZone=t,Im(t,this.habitableZone)}toggleMagneticFields(t){D.showMagneticFields=t,Nm(t,this.magneticFieldsGroup,this.planets)}toggleSunMagneticFieldBasic(t){if(D.showSunMagneticFieldBasic=t,this.universeGroup){const e=this.universeGroup.children.find(n=>n.name==="SunMagneticFieldBasic");e&&(e.visible=t)}}toggleSunMagneticFieldSolarWind(t){if(D.showSunMagneticField=t,this.universeGroup){const e=this.universeGroup.children.find(n=>n.name==="MagneticField");e&&(e.visible=t)}}toggleSun(t){D.showSun=t,Om(t,this.sun)}togglePlanets(t){D.showPlanets=t,Fm(t,this.planets)}toggleDwarfPlanets(t){D.showDwarfPlanets=t,Um(t,this.planets)}toggleMoons(t,e){if(t==="largest")D.showLargestMoons=e;else if(t==="major")D.showMajorMoons=e;else if(t==="small")D.showSmallMoons=e;else{Bt.warn("Invalid moon category. Use 'largest', 'major', or 'small'.");return}Ua(e,this.planets,t)}}const It={IDLE:Symbol(),ROTATE:Symbol(),PAN:Symbol(),SCALE:Symbol(),FOV:Symbol(),FOCUS:Symbol(),ZROTATE:Symbol(),ANIMATION_FOCUS:Symbol(),ANIMATION_ROTATE:Symbol()},me={NONE:Symbol(),ONE_FINGER:Symbol(),ONE_FINGER_SWITCHED:Symbol(),TWO_FINGER:Symbol(),MULT_FINGER:Symbol(),CURSOR:Symbol()},$t={x:0,y:0},Mn={camera:new Pt,gizmos:new Pt},_e={type:"change"},Hn={type:"start"},Cn={type:"end"},Bb=new fc,ze=new E,X0=new Pt,j0=new Pt,Gn=new E;class Gb extends Ji{constructor(t,e,n=null){super(),this.camera=null,this.domElement=e,this.scene=n,this.target=new E,this._currentTarget=new E,this.radiusFactor=.67,this.mouseActions=[],this._mouseOp=null,this._v2_1=new ht,this._v3_1=new E,this._v3_2=new E,this._m4_1=new Pt,this._m4_2=new Pt,this._quat=new qn,this._translationMatrix=new Pt,this._rotationMatrix=new Pt,this._scaleMatrix=new Pt,this._rotationAxis=new E,this._cameraMatrixState=new Pt,this._cameraProjectionState=new Pt,this._fovState=1,this._upState=new E,this._zoomState=1,this._nearPos=0,this._farPos=0,this._gizmoMatrixState=new Pt,this._up0=new E,this._zoom0=1,this._fov0=0,this._initialNear=0,this._nearPos0=0,this._initialFar=0,this._farPos0=0,this._cameraMatrixState0=new Pt,this._gizmoMatrixState0=new Pt,this._button=-1,this._touchStart=[],this._touchCurrent=[],this._input=me.NONE,this._switchSensibility=32,this._startFingerDistance=0,this._currentFingerDistance=0,this._startFingerRotation=0,this._currentFingerRotation=0,this._devPxRatio=0,this._downValid=!0,this._nclicks=0,this._downEvents=[],this._downStart=0,this._clickStart=0,this._maxDownTime=250,this._maxInterval=300,this._posThreshold=24,this._movementThreshold=24,this._currentCursorPosition=new E,this._startCursorPosition=new E,this._grid=null,this._gridPosition=new E,this._gizmos=new Se,this._curvePts=128,this._timeStart=-1,this._animationId=-1,this.focusAnimationTime=500,this._timePrev=0,this._timeCurrent=0,this._anglePrev=0,this._angleCurrent=0,this._cursorPosPrev=new E,this._cursorPosCurr=new E,this._wPrev=0,this._wCurr=0,this.adjustNearFar=!1,this.scaleFactor=1.1,this.dampingFactor=25,this.wMax=20,this.enableAnimations=!0,this.enableGrid=!1,this.cursorZoom=!1,this.minFov=5,this.maxFov=90,this.rotateSpeed=1,this.enabled=!0,this.enablePan=!0,this.enableRotate=!0,this.enableZoom=!0,this.enableGizmos=!0,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this._tbRadius=1,this._state=It.IDLE,this.setCamera(t),this.scene!=null&&this.scene.add(this._gizmos),this.domElement.style.touchAction="none",this._devPxRatio=window.devicePixelRatio,this.initializeMouseActions(),this._onContextMenu=Vb.bind(this),this._onWheel=qb.bind(this),this._onPointerUp=$b.bind(this),this._onPointerMove=jb.bind(this),this._onPointerDown=Xb.bind(this),this._onPointerCancel=Wb.bind(this),this._onWindowResize=Hb.bind(this),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onWheel),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),window.addEventListener("resize",this._onWindowResize)}onSinglePanStart(t,e){if(this.enabled)switch(this.dispatchEvent(Hn),this.setCenter(t.clientX,t.clientY),e){case"PAN":if(!this.enablePan)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(_e)),this.updateTbState(It.PAN,!0),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement)),this.enableGrid&&(this.drawGrid(),this.dispatchEvent(_e));break;case"ROTATE":if(!this.enableRotate)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1),this.updateTbState(It.ROTATE,!0),this._startCursorPosition.copy(this.unprojectOnTbSurface(this.camera,$t.x,$t.y,this.domElement,this._tbRadius)),this.activateGizmos(!0),this.enableAnimations&&(this._timePrev=this._timeCurrent=performance.now(),this._angleCurrent=this._anglePrev=0,this._cursorPosPrev.copy(this._startCursorPosition),this._cursorPosCurr.copy(this._cursorPosPrev),this._wCurr=0,this._wPrev=this._wCurr),this.dispatchEvent(_e);break;case"FOV":if(!this.camera.isPerspectiveCamera||!this.enableZoom)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(_e)),this.updateTbState(It.FOV,!0),this._startCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition);break;case"ZOOM":if(!this.enableZoom)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(_e)),this.updateTbState(It.SCALE,!0),this._startCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition);break}}onSinglePanMove(t,e){if(this.enabled){const n=e!=this._state;switch(this.setCenter(t.clientX,t.clientY),e){case It.PAN:this.enablePan&&(n?(this.dispatchEvent(Cn),this.dispatchEvent(Hn),this.updateTbState(e,!0),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement)),this.enableGrid&&this.drawGrid(),this.activateGizmos(!1)):(this._currentCursorPosition.copy(this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement)),this.applyTransformMatrix(this.pan(this._startCursorPosition,this._currentCursorPosition))));break;case It.ROTATE:if(this.enableRotate)if(n)this.dispatchEvent(Cn),this.dispatchEvent(Hn),this.updateTbState(e,!0),this._startCursorPosition.copy(this.unprojectOnTbSurface(this.camera,$t.x,$t.y,this.domElement,this._tbRadius)),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!0);else{this._currentCursorPosition.copy(this.unprojectOnTbSurface(this.camera,$t.x,$t.y,this.domElement,this._tbRadius));const s=this._startCursorPosition.distanceTo(this._currentCursorPosition),r=this._startCursorPosition.angleTo(this._currentCursorPosition),o=Math.max(s/this._tbRadius,r)*this.rotateSpeed;this.applyTransformMatrix(this.rotate(this.calculateRotationAxis(this._startCursorPosition,this._currentCursorPosition),o)),this.enableAnimations&&(this._timePrev=this._timeCurrent,this._timeCurrent=performance.now(),this._anglePrev=this._angleCurrent,this._angleCurrent=o,this._cursorPosPrev.copy(this._cursorPosCurr),this._cursorPosCurr.copy(this._currentCursorPosition),this._wPrev=this._wCurr,this._wCurr=this.calculateAngularSpeed(this._anglePrev,this._angleCurrent,this._timePrev,this._timeCurrent))}break;case It.SCALE:if(this.enableZoom)if(n)this.dispatchEvent(Cn),this.dispatchEvent(Hn),this.updateTbState(e,!0),this._startCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1);else{this._currentCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let o=1;r<0?o=1/Math.pow(this.scaleFactor,-r*8):r>0&&(o=Math.pow(this.scaleFactor,r*8)),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState),this.applyTransformMatrix(this.scale(o,this._v3_1))}break;case It.FOV:if(this.enableZoom&&this.camera.isPerspectiveCamera)if(n)this.dispatchEvent(Cn),this.dispatchEvent(Hn),this.updateTbState(e,!0),this._startCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1);else{this._currentCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let o=1;r<0?o=1/Math.pow(this.scaleFactor,-r*8):r>0&&(o=Math.pow(this.scaleFactor,r*8)),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const a=this._v3_1.distanceTo(this._gizmos.position);let c=a/o;c=fe.clamp(c,this.minDistance,this.maxDistance);const l=a*Math.tan(fe.DEG2RAD*this._fovState*.5);let u=fe.RAD2DEG*(Math.atan(l/c)*2);u=fe.clamp(u,this.minFov,this.maxFov);const h=l/Math.tan(fe.DEG2RAD*(u/2));o=a/h,this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),this.setFov(u),this.applyTransformMatrix(this.scale(o,this._v3_2,!1)),ze.copy(this._gizmos.position).sub(this.camera.position).normalize().multiplyScalar(h/a),this._m4_1.makeTranslation(ze.x,ze.y,ze.z)}break}this.dispatchEvent(_e)}}onSinglePanEnd(){if(this._state==It.ROTATE){if(!this.enableRotate)return;if(this.enableAnimations)if(performance.now()-this._timeCurrent<120){const e=Math.abs((this._wPrev+this._wCurr)/2),n=this;this._animationId=window.requestAnimationFrame(function(s){n.updateTbState(It.ANIMATION_ROTATE,!0);const r=n.calculateRotationAxis(n._cursorPosPrev,n._cursorPosCurr);n.onRotationAnim(s,r,Math.min(e,n.wMax))})}else this.updateTbState(It.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(_e);else this.updateTbState(It.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(_e)}else(this._state==It.PAN||this._state==It.IDLE)&&(this.updateTbState(It.IDLE,!1),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1),this.dispatchEvent(_e));this.dispatchEvent(Cn)}onDoubleTap(t){if(this.enabled&&this.enablePan&&this.scene!=null){this.dispatchEvent(Hn),this.setCenter(t.clientX,t.clientY);const e=this.unprojectOnObj(this.getCursorNDC($t.x,$t.y,this.domElement),this.camera);if(e!=null&&this.enableAnimations){const n=this;this._animationId!=-1&&window.cancelAnimationFrame(this._animationId),this._timeStart=-1,this._animationId=window.requestAnimationFrame(function(s){n.updateTbState(It.ANIMATION_FOCUS,!0),n.onFocusAnim(s,e,n._cameraMatrixState,n._gizmoMatrixState)})}else e!=null&&!this.enableAnimations&&(this.updateTbState(It.FOCUS,!0),this.focus(e,this.scaleFactor),this.updateTbState(It.IDLE,!1),this.dispatchEvent(_e))}this.dispatchEvent(Cn)}onDoublePanStart(){this.enabled&&this.enablePan&&(this.dispatchEvent(Hn),this.updateTbState(It.PAN,!0),this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement,!0)),this._currentCursorPosition.copy(this._startCursorPosition),this.activateGizmos(!1))}onDoublePanMove(){this.enabled&&this.enablePan&&(this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2),this._state!=It.PAN&&(this.updateTbState(It.PAN,!0),this._startCursorPosition.copy(this._currentCursorPosition)),this._currentCursorPosition.copy(this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement,!0)),this.applyTransformMatrix(this.pan(this._startCursorPosition,this._currentCursorPosition,!0)),this.dispatchEvent(_e))}onDoublePanEnd(){this.updateTbState(It.IDLE,!1),this.dispatchEvent(Cn)}onRotateStart(){this.enabled&&this.enableRotate&&(this.dispatchEvent(Hn),this.updateTbState(It.ZROTATE,!0),this._startFingerRotation=this.getAngle(this._touchCurrent[1],this._touchCurrent[0])+this.getAngle(this._touchStart[1],this._touchStart[0]),this._currentFingerRotation=this._startFingerRotation,this.camera.getWorldDirection(this._rotationAxis),!this.enablePan&&!this.enableZoom&&this.activateGizmos(!0))}onRotateMove(){if(this.enabled&&this.enableRotate){this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2);let t;this._state!=It.ZROTATE&&(this.updateTbState(It.ZROTATE,!0),this._startFingerRotation=this._currentFingerRotation),this._currentFingerRotation=this.getAngle(this._touchCurrent[1],this._touchCurrent[0])+this.getAngle(this._touchStart[1],this._touchStart[0]),this.enablePan?(this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),t=this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._v3_2)):t=new E().setFromMatrixPosition(this._gizmoMatrixState);const e=fe.DEG2RAD*(this._startFingerRotation-this._currentFingerRotation);this.applyTransformMatrix(this.zRotate(t,e)),this.dispatchEvent(_e)}}onRotateEnd(){this.updateTbState(It.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(Cn)}onPinchStart(){this.enabled&&this.enableZoom&&(this.dispatchEvent(Hn),this.updateTbState(It.SCALE,!0),this._startFingerDistance=this.calculatePointersDistance(this._touchCurrent[0],this._touchCurrent[1]),this._currentFingerDistance=this._startFingerDistance,this.activateGizmos(!1))}onPinchMove(){if(this.enabled&&this.enableZoom){this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2);const t=12;this._state!=It.SCALE&&(this._startFingerDistance=this._currentFingerDistance,this.updateTbState(It.SCALE,!0)),this._currentFingerDistance=Math.max(this.calculatePointersDistance(this._touchCurrent[0],this._touchCurrent[1]),t*this._devPxRatio);const e=this._currentFingerDistance/this._startFingerDistance;let n;this.enablePan?this.camera.isOrthographicCamera?n=this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._gizmos.position):this.camera.isPerspectiveCamera&&(n=this.unprojectOnTbPlane(this.camera,$t.x,$t.y,this.domElement).applyQuaternion(this.camera.quaternion).add(this._gizmos.position)):n=this._gizmos.position,this.applyTransformMatrix(this.scale(e,n)),this.dispatchEvent(_e)}}onPinchEnd(){this.updateTbState(It.IDLE,!1),this.dispatchEvent(Cn)}onTriplePanStart(){if(this.enabled&&this.enableZoom){this.dispatchEvent(Hn),this.updateTbState(It.SCALE,!0);let t=0,e=0;const n=this._touchCurrent.length;for(let s=0;s<n;s++)t+=this._touchCurrent[s].clientX,e+=this._touchCurrent[s].clientY;this.setCenter(t/n,e/n),this._startCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition)}}onTriplePanMove(){if(this.enabled&&this.enableZoom){let t=0,e=0;const n=this._touchCurrent.length;for(let d=0;d<n;d++)t+=this._touchCurrent[d].clientX,e+=this._touchCurrent[d].clientY;this.setCenter(t/n,e/n);const s=8;this._currentCursorPosition.setY(this.getCursorNDC($t.x,$t.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let o=1;r<0?o=1/Math.pow(this.scaleFactor,-r*s):r>0&&(o=Math.pow(this.scaleFactor,r*s)),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const a=this._v3_1.distanceTo(this._gizmos.position);let c=a/o;c=fe.clamp(c,this.minDistance,this.maxDistance);const l=a*Math.tan(fe.DEG2RAD*this._fovState*.5);let u=fe.RAD2DEG*(Math.atan(l/c)*2);u=fe.clamp(u,this.minFov,this.maxFov);const h=l/Math.tan(fe.DEG2RAD*(u/2));o=a/h,this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),this.setFov(u),this.applyTransformMatrix(this.scale(o,this._v3_2,!1)),ze.copy(this._gizmos.position).sub(this.camera.position).normalize().multiplyScalar(h/a),this._m4_1.makeTranslation(ze.x,ze.y,ze.z),this.dispatchEvent(_e)}}onTriplePanEnd(){this.updateTbState(It.IDLE,!1),this.dispatchEvent(Cn)}setCenter(t,e){$t.x=t,$t.y=e}initializeMouseActions(){this.setMouseAction("PAN",0,"CTRL"),this.setMouseAction("PAN",2),this.setMouseAction("ROTATE",0),this.setMouseAction("ZOOM","WHEEL"),this.setMouseAction("ZOOM",1),this.setMouseAction("FOV","WHEEL","SHIFT"),this.setMouseAction("FOV",1,"SHIFT")}compareMouseAction(t,e){return t.operation==e.operation?t.mouse==e.mouse&&t.key==e.key:!1}setMouseAction(t,e,n=null){const s=["PAN","ROTATE","ZOOM","FOV"],r=[0,1,2,"WHEEL"],o=["CTRL","SHIFT",null];let a;if(!s.includes(t)||!r.includes(e)||!o.includes(n)||e=="WHEEL"&&t!="ZOOM"&&t!="FOV")return!1;switch(t){case"PAN":a=It.PAN;break;case"ROTATE":a=It.ROTATE;break;case"ZOOM":a=It.SCALE;break;case"FOV":a=It.FOV;break}const c={operation:t,mouse:e,key:n,state:a};for(let l=0;l<this.mouseActions.length;l++)if(this.mouseActions[l].mouse==c.mouse&&this.mouseActions[l].key==c.key)return this.mouseActions.splice(l,1,c),!0;return this.mouseActions.push(c),!0}unsetMouseAction(t,e=null){for(let n=0;n<this.mouseActions.length;n++)if(this.mouseActions[n].mouse==t&&this.mouseActions[n].key==e)return this.mouseActions.splice(n,1),!0;return!1}getOpFromAction(t,e){let n;for(let s=0;s<this.mouseActions.length;s++)if(n=this.mouseActions[s],n.mouse==t&&n.key==e)return n.operation;if(e!=null){for(let s=0;s<this.mouseActions.length;s++)if(n=this.mouseActions[s],n.mouse==t&&n.key==null)return n.operation}return null}getOpStateFromAction(t,e){let n;for(let s=0;s<this.mouseActions.length;s++)if(n=this.mouseActions[s],n.mouse==t&&n.key==e)return n.state;if(e!=null){for(let s=0;s<this.mouseActions.length;s++)if(n=this.mouseActions[s],n.mouse==t&&n.key==null)return n.state}return null}getAngle(t,e){return Math.atan2(e.clientY-t.clientY,e.clientX-t.clientX)*180/Math.PI}updateTouchEvent(t){for(let e=0;e<this._touchCurrent.length;e++)if(this._touchCurrent[e].pointerId==t.pointerId){this._touchCurrent.splice(e,1,t);break}}applyTransformMatrix(t){if(t.camera!=null&&(this._m4_1.copy(this._cameraMatrixState).premultiply(t.camera),this._m4_1.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.updateMatrix(),(this._state==It.ROTATE||this._state==It.ZROTATE||this._state==It.ANIMATION_ROTATE)&&this.camera.up.copy(this._upState).applyQuaternion(this.camera.quaternion)),t.gizmos!=null&&(this._m4_1.copy(this._gizmoMatrixState).premultiply(t.gizmos),this._m4_1.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.updateMatrix()),this._state==It.SCALE||this._state==It.FOCUS||this._state==It.ANIMATION_FOCUS)if(this._tbRadius=this.calculateTbRadius(this.camera),this.adjustNearFar){const e=this.camera.position.distanceTo(this._gizmos.position),n=new Ee;n.setFromObject(this._gizmos);const s=new En;n.getBoundingSphere(s);const r=Math.max(this._nearPos0,s.radius+s.center.length()),o=e-this._initialNear,a=Math.min(r,o);this.camera.near=e-a;const c=Math.min(this._farPos0,-s.radius+s.center.length()),l=e-this._initialFar,u=Math.min(c,l);this.camera.far=e-u,this.camera.updateProjectionMatrix()}else{let e=!1;this.camera.near!=this._initialNear&&(this.camera.near=this._initialNear,e=!0),this.camera.far!=this._initialFar&&(this.camera.far=this._initialFar,e=!0),e&&this.camera.updateProjectionMatrix()}}calculateAngularSpeed(t,e,n,s){const r=e-t,o=(s-n)/1e3;return o==0?0:r/o}calculatePointersDistance(t,e){return Math.sqrt(Math.pow(e.clientX-t.clientX,2)+Math.pow(e.clientY-t.clientY,2))}calculateRotationAxis(t,e){return this._rotationMatrix.extractRotation(this._cameraMatrixState),this._quat.setFromRotationMatrix(this._rotationMatrix),this._rotationAxis.crossVectors(t,e).applyQuaternion(this._quat),this._rotationAxis.normalize().clone()}calculateTbRadius(t){const e=t.position.distanceTo(this._gizmos.position);if(t.type=="PerspectiveCamera"){const n=fe.DEG2RAD*t.fov*.5,s=Math.atan(t.aspect*Math.tan(n));return Math.tan(Math.min(n,s))*e*this.radiusFactor}else if(t.type=="OrthographicCamera")return Math.min(t.top,t.right)*this.radiusFactor}focus(t,e,n=1){ze.copy(t).sub(this._gizmos.position).multiplyScalar(n),this._translationMatrix.makeTranslation(ze.x,ze.y,ze.z),X0.copy(this._gizmoMatrixState),this._gizmoMatrixState.premultiply(this._translationMatrix),this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),j0.copy(this._cameraMatrixState),this._cameraMatrixState.premultiply(this._translationMatrix),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.enableZoom&&this.applyTransformMatrix(this.scale(e,this._gizmos.position)),this._gizmoMatrixState.copy(X0),this._cameraMatrixState.copy(j0)}drawGrid(){if(this.scene!=null){let n,s,r,o;if(this.camera.isOrthographicCamera){const a=this.camera.right-this.camera.left,c=this.camera.bottom-this.camera.top;r=Math.max(a,c),o=r/20,n=r/this.camera.zoom*3,s=n/o*this.camera.zoom}else if(this.camera.isPerspectiveCamera){const a=this.camera.position.distanceTo(this._gizmos.position),c=fe.DEG2RAD*this.camera.fov*.5,l=Math.atan(this.camera.aspect*Math.tan(c));r=Math.tan(Math.max(c,l))*a*2,o=r/20,n=r*3,s=n/o}this._grid==null&&(this._grid=new _3(n,s,8947848,8947848),this._grid.position.copy(this._gizmos.position),this._gridPosition.copy(this._grid.position),this._grid.quaternion.copy(this.camera.quaternion),this._grid.rotateX(Math.PI*.5),this.scene.add(this._grid))}}dispose(){this._animationId!=-1&&window.cancelAnimationFrame(this._animationId),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),window.removeEventListener("resize",this._onWindowResize),this.scene!==null&&this.scene.remove(this._gizmos),this.disposeGrid()}disposeGrid(){this._grid!=null&&this.scene!=null&&(this.scene.remove(this._grid),this._grid=null)}easeOutCubic(t){return 1-Math.pow(1-t,3)}activateGizmos(t){const e=this._gizmos.children[0],n=this._gizmos.children[1],s=this._gizmos.children[2];t?(e.material.setValues({opacity:1}),n.material.setValues({opacity:1}),s.material.setValues({opacity:1})):(e.material.setValues({opacity:.6}),n.material.setValues({opacity:.6}),s.material.setValues({opacity:.6}))}getCursorNDC(t,e,n){const s=n.getBoundingClientRect();return this._v2_1.setX((t-s.left)/s.width*2-1),this._v2_1.setY((s.bottom-e)/s.height*2-1),this._v2_1.clone()}getCursorPosition(t,e,n){return this._v2_1.copy(this.getCursorNDC(t,e,n)),this._v2_1.x*=(this.camera.right-this.camera.left)*.5,this._v2_1.y*=(this.camera.top-this.camera.bottom)*.5,this._v2_1.clone()}setCamera(t){t.lookAt(this.target),t.updateMatrix(),t.type=="PerspectiveCamera"&&(this._fov0=t.fov,this._fovState=t.fov),this._cameraMatrixState0.copy(t.matrix),this._cameraMatrixState.copy(this._cameraMatrixState0),this._cameraProjectionState.copy(t.projectionMatrix),this._zoom0=t.zoom,this._zoomState=this._zoom0,this._initialNear=t.near,this._nearPos0=t.position.distanceTo(this.target)-t.near,this._nearPos=this._initialNear,this._initialFar=t.far,this._farPos0=t.position.distanceTo(this.target)-t.far,this._farPos=this._initialFar,this._up0.copy(t.up),this._upState.copy(t.up),this.camera=t,this.camera.updateProjectionMatrix(),this._tbRadius=this.calculateTbRadius(t),this.makeGizmos(this.target,this._tbRadius)}setGizmosVisible(t){this._gizmos.visible=t,this.dispatchEvent(_e)}setTbRadius(t){this.radiusFactor=t,this._tbRadius=this.calculateTbRadius(this.camera);const n=new lr(0,0,this._tbRadius,this._tbRadius).getPoints(this._curvePts),s=new ce().setFromPoints(n);for(const r in this._gizmos.children)this._gizmos.children[r].geometry=s;this.dispatchEvent(_e)}makeGizmos(t,e){const s=new lr(0,0,e,e).getPoints(this._curvePts),r=new ce().setFromPoints(s),o=new hn({color:16744576,fog:!1,transparent:!0,opacity:.6}),a=new hn({color:8454016,fog:!1,transparent:!0,opacity:.6}),c=new hn({color:8421631,fog:!1,transparent:!0,opacity:.6}),l=new wn(r,o),u=new wn(r,a),h=new wn(r,c),d=Math.PI*.5;if(l.rotation.x=d,u.rotation.y=d,this._gizmoMatrixState0.identity().setPosition(t),this._gizmoMatrixState.copy(this._gizmoMatrixState0),this.camera.zoom!==1){const f=1/this.camera.zoom;this._scaleMatrix.makeScale(f,f,f),this._translationMatrix.makeTranslation(-t.x,-t.y,-t.z),this._gizmoMatrixState.premultiply(this._translationMatrix).premultiply(this._scaleMatrix),this._translationMatrix.makeTranslation(t.x,t.y,t.z),this._gizmoMatrixState.premultiply(this._translationMatrix)}this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.traverse(function(f){f.isLine&&(f.geometry.dispose(),f.material.dispose())}),this._gizmos.clear(),this._gizmos.add(l),this._gizmos.add(u),this._gizmos.add(h)}onFocusAnim(t,e,n,s){if(this._timeStart==-1&&(this._timeStart=t),this._state==It.ANIMATION_FOCUS){const o=(t-this._timeStart)/this.focusAnimationTime;if(this._gizmoMatrixState.copy(s),o>=1)this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.focus(e,this.scaleFactor),this._timeStart=-1,this.updateTbState(It.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(_e);else{const a=this.easeOutCubic(o),c=1-a+this.scaleFactor*a;this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.focus(e,c,a),this.dispatchEvent(_e);const l=this;this._animationId=window.requestAnimationFrame(function(u){l.onFocusAnim(u,e,n,s.clone())})}}else this._animationId=-1,this._timeStart=-1}onRotationAnim(t,e,n){if(this._timeStart==-1&&(this._anglePrev=0,this._angleCurrent=0,this._timeStart=t),this._state==It.ANIMATION_ROTATE){const s=(t-this._timeStart)/1e3;if(n+-this.dampingFactor*s>0){this._angleCurrent=.5*-this.dampingFactor*Math.pow(s,2)+n*s+0,this.applyTransformMatrix(this.rotate(e,this._angleCurrent)),this.dispatchEvent(_e);const o=this;this._animationId=window.requestAnimationFrame(function(a){o.onRotationAnim(a,e,n)})}else this._animationId=-1,this._timeStart=-1,this.updateTbState(It.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(_e)}else this._animationId=-1,this._timeStart=-1,this._state!=It.ROTATE&&(this.activateGizmos(!1),this.dispatchEvent(_e))}pan(t,e,n=!1){const s=t.clone().sub(e);if(this.camera.isOrthographicCamera)s.multiplyScalar(1/this.camera.zoom);else if(this.camera.isPerspectiveCamera&&n){this._v3_1.setFromMatrixPosition(this._cameraMatrixState0),this._v3_2.setFromMatrixPosition(this._gizmoMatrixState0);const r=this._v3_1.distanceTo(this._v3_2)/this.camera.position.distanceTo(this._gizmos.position);s.multiplyScalar(1/r)}return this._v3_1.set(s.x,s.y,0).applyQuaternion(this.camera.quaternion),this._m4_1.makeTranslation(this._v3_1.x,this._v3_1.y,this._v3_1.z),this.setTransformationMatrices(this._m4_1,this._m4_1),Mn}reset(){this.camera.zoom=this._zoom0,this.camera.isPerspectiveCamera&&(this.camera.fov=this._fov0),this.camera.near=this._nearPos,this.camera.far=this._farPos,this._cameraMatrixState.copy(this._cameraMatrixState0),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.up.copy(this._up0),this.camera.updateMatrix(),this.camera.updateProjectionMatrix(),this._gizmoMatrixState.copy(this._gizmoMatrixState0),this._gizmoMatrixState0.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.updateMatrix(),this._tbRadius=this.calculateTbRadius(this.camera),this.makeGizmos(this._gizmos.position,this._tbRadius),this.camera.lookAt(this._gizmos.position),this.updateTbState(It.IDLE,!1),this.dispatchEvent(_e)}rotate(t,e){const n=this._gizmos.position;return this._translationMatrix.makeTranslation(-n.x,-n.y,-n.z),this._rotationMatrix.makeRotationAxis(t,-e),this._m4_1.makeTranslation(n.x,n.y,n.z),this._m4_1.multiply(this._rotationMatrix),this._m4_1.multiply(this._translationMatrix),this.setTransformationMatrices(this._m4_1),Mn}copyState(){let t;this.camera.isOrthographicCamera?t=JSON.stringify({arcballState:{cameraFar:this.camera.far,cameraMatrix:this.camera.matrix,cameraNear:this.camera.near,cameraUp:this.camera.up,cameraZoom:this.camera.zoom,gizmoMatrix:this._gizmos.matrix}}):this.camera.isPerspectiveCamera&&(t=JSON.stringify({arcballState:{cameraFar:this.camera.far,cameraFov:this.camera.fov,cameraMatrix:this.camera.matrix,cameraNear:this.camera.near,cameraUp:this.camera.up,cameraZoom:this.camera.zoom,gizmoMatrix:this._gizmos.matrix}})),navigator.clipboard.writeText(t)}pasteState(){const t=this;navigator.clipboard.readText().then(function(n){t.setStateFromJSON(n)})}saveState(){this._cameraMatrixState0.copy(this.camera.matrix),this._gizmoMatrixState0.copy(this._gizmos.matrix),this._nearPos=this.camera.near,this._farPos=this.camera.far,this._zoom0=this.camera.zoom,this._up0.copy(this.camera.up),this.camera.isPerspectiveCamera&&(this._fov0=this.camera.fov)}scale(t,e,n=!0){Gn.copy(e);let s=1/t;if(this.camera.isOrthographicCamera){this.camera.zoom=this._zoomState,this.camera.zoom*=t,this.camera.zoom>this.maxZoom?(this.camera.zoom=this.maxZoom,s=this._zoomState/this.maxZoom):this.camera.zoom<this.minZoom&&(this.camera.zoom=this.minZoom,s=this._zoomState/this.minZoom),this.camera.updateProjectionMatrix(),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState),this._scaleMatrix.makeScale(s,s,s),this._translationMatrix.makeTranslation(-this._v3_1.x,-this._v3_1.y,-this._v3_1.z),this._m4_2.makeTranslation(this._v3_1.x,this._v3_1.y,this._v3_1.z).multiply(this._scaleMatrix),this._m4_2.multiply(this._translationMatrix),Gn.sub(this._v3_1);const r=Gn.clone().multiplyScalar(s);return Gn.sub(r),this._m4_1.makeTranslation(Gn.x,Gn.y,Gn.z),this._m4_2.premultiply(this._m4_1),this.setTransformationMatrices(this._m4_1,this._m4_2),Mn}else if(this.camera.isPerspectiveCamera){this._v3_1.setFromMatrixPosition(this._cameraMatrixState),this._v3_2.setFromMatrixPosition(this._gizmoMatrixState);let r=this._v3_1.distanceTo(Gn),o=r-r*s;const a=r-o;if(a<this.minDistance?(s=this.minDistance/r,o=r-r*s):a>this.maxDistance&&(s=this.maxDistance/r,o=r-r*s),ze.copy(Gn).sub(this._v3_1).normalize().multiplyScalar(o),this._m4_1.makeTranslation(ze.x,ze.y,ze.z),n){const c=this._v3_2;r=c.distanceTo(Gn),o=r-r*s,ze.copy(Gn).sub(this._v3_2).normalize().multiplyScalar(o),this._translationMatrix.makeTranslation(c.x,c.y,c.z),this._scaleMatrix.makeScale(s,s,s),this._m4_2.makeTranslation(ze.x,ze.y,ze.z).multiply(this._translationMatrix),this._m4_2.multiply(this._scaleMatrix),this._translationMatrix.makeTranslation(-c.x,-c.y,-c.z),this._m4_2.multiply(this._translationMatrix),this.setTransformationMatrices(this._m4_1,this._m4_2)}else this.setTransformationMatrices(this._m4_1);return Mn}}setFov(t){this.camera.isPerspectiveCamera&&(this.camera.fov=fe.clamp(t,this.minFov,this.maxFov),this.camera.updateProjectionMatrix())}setTransformationMatrices(t=null,e=null){t!=null?Mn.camera!=null?Mn.camera.copy(t):Mn.camera=t.clone():Mn.camera=null,e!=null?Mn.gizmos!=null?Mn.gizmos.copy(e):Mn.gizmos=e.clone():Mn.gizmos=null}zRotate(t,e){return this._rotationMatrix.makeRotationAxis(this._rotationAxis,e),this._translationMatrix.makeTranslation(-t.x,-t.y,-t.z),this._m4_1.makeTranslation(t.x,t.y,t.z),this._m4_1.multiply(this._rotationMatrix),this._m4_1.multiply(this._translationMatrix),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState).sub(t),this._v3_2.copy(this._v3_1).applyAxisAngle(this._rotationAxis,e),this._v3_2.sub(this._v3_1),this._m4_2.makeTranslation(this._v3_2.x,this._v3_2.y,this._v3_2.z),this.setTransformationMatrices(this._m4_1,this._m4_2),Mn}getRaycaster(){return Bb}unprojectOnObj(t,e){const n=this.getRaycaster();n.near=e.near,n.far=e.far,n.setFromCamera(t,e);const s=n.intersectObjects(this.scene.children,!0);for(let r=0;r<s.length;r++)if(s[r].object.uuid!=this._gizmos.uuid&&s[r].face!=null)return s[r].point.clone();return null}unprojectOnTbSurface(t,e,n,s,r){if(t.type=="OrthographicCamera"){this._v2_1.copy(this.getCursorPosition(e,n,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,0);const o=Math.pow(this._v2_1.x,2),a=Math.pow(this._v2_1.y,2),c=Math.pow(this._tbRadius,2);return o+a<=c*.5?this._v3_1.setZ(Math.sqrt(c-(o+a))):this._v3_1.setZ(c*.5/Math.sqrt(o+a)),this._v3_1}else if(t.type=="PerspectiveCamera"){this._v2_1.copy(this.getCursorNDC(e,n,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,-1),this._v3_1.applyMatrix4(t.projectionMatrixInverse);const o=this._v3_1.clone().normalize(),a=t.position.distanceTo(this._gizmos.position),c=Math.pow(r,2),l=this._v3_1.z,u=Math.sqrt(Math.pow(this._v3_1.x,2)+Math.pow(this._v3_1.y,2));if(u==0)return o.set(this._v3_1.x,this._v3_1.y,r),o;const h=l/u,d=a;let f=Math.pow(h,2)+1,m=2*h*d,_=Math.pow(d,2)-c,g=Math.pow(m,2)-4*f*_;if(g>=0&&(this._v2_1.setX((-m-Math.sqrt(g))/(2*f)),this._v2_1.setY(h*this._v2_1.x+d),fe.RAD2DEG*this._v2_1.angle()>=45)){const v=Math.sqrt(Math.pow(this._v2_1.x,2)+Math.pow(a-this._v2_1.y,2));return o.multiplyScalar(v),o.z+=a,o}f=h,m=d,_=-c*.5,g=Math.pow(m,2)-4*f*_,this._v2_1.setX((-m-Math.sqrt(g))/(2*f)),this._v2_1.setY(h*this._v2_1.x+d);const p=Math.sqrt(Math.pow(this._v2_1.x,2)+Math.pow(a-this._v2_1.y,2));return o.multiplyScalar(p),o.z+=a,o}}unprojectOnTbPlane(t,e,n,s,r=!1){if(t.type=="OrthographicCamera")return this._v2_1.copy(this.getCursorPosition(e,n,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,0),this._v3_1.clone();if(t.type=="PerspectiveCamera"){this._v2_1.copy(this.getCursorNDC(e,n,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,-1),this._v3_1.applyMatrix4(t.projectionMatrixInverse);const o=this._v3_1.clone().normalize(),a=this._v3_1.z,c=Math.sqrt(Math.pow(this._v3_1.x,2)+Math.pow(this._v3_1.y,2));let l;if(r?l=this._v3_1.setFromMatrixPosition(this._cameraMatrixState0).distanceTo(this._v3_2.setFromMatrixPosition(this._gizmoMatrixState0)):l=t.position.distanceTo(this._gizmos.position),c==0)return o.set(0,0,0),o;const u=a/c,h=l,d=-h/u,f=Math.sqrt(Math.pow(h,2)+Math.pow(d,2));return o.multiplyScalar(f),o.z=0,o}}updateMatrixState(){this._cameraMatrixState.copy(this.camera.matrix),this._gizmoMatrixState.copy(this._gizmos.matrix),this.camera.isOrthographicCamera?(this._cameraProjectionState.copy(this.camera.projectionMatrix),this.camera.updateProjectionMatrix(),this._zoomState=this.camera.zoom):this.camera.isPerspectiveCamera&&(this._fovState=this.camera.fov)}updateTbState(t,e){this._state=t,e&&this.updateMatrixState()}update(){if(this.target.equals(this._currentTarget)===!1&&(this._gizmos.position.copy(this.target),this._tbRadius=this.calculateTbRadius(this.camera),this.makeGizmos(this.target,this._tbRadius),this._currentTarget.copy(this.target)),this.camera.isOrthographicCamera){if(this.camera.zoom>this.maxZoom||this.camera.zoom<this.minZoom){const e=fe.clamp(this.camera.zoom,this.minZoom,this.maxZoom);this.applyTransformMatrix(this.scale(e/this.camera.zoom,this._gizmos.position,!0))}}else if(this.camera.isPerspectiveCamera){const e=this.camera.position.distanceTo(this._gizmos.position);if(e>this.maxDistance+1e-6||e<this.minDistance-1e-6){const s=fe.clamp(e,this.minDistance,this.maxDistance);this.applyTransformMatrix(this.scale(s/e,this._gizmos.position)),this.updateMatrixState()}(this.camera.fov<this.minFov||this.camera.fov>this.maxFov)&&(this.camera.fov=fe.clamp(this.camera.fov,this.minFov,this.maxFov),this.camera.updateProjectionMatrix());const n=this._tbRadius;if(this._tbRadius=this.calculateTbRadius(this.camera),n<this._tbRadius-1e-6||n>this._tbRadius+1e-6){const s=(this._gizmos.scale.x+this._gizmos.scale.y+this._gizmos.scale.z)/3,r=this._tbRadius/s,a=new lr(0,0,r,r).getPoints(this._curvePts),c=new ce().setFromPoints(a);for(const l in this._gizmos.children)this._gizmos.children[l].geometry=c}}this.camera.lookAt(this._gizmos.position)}setStateFromJSON(t){const e=JSON.parse(t);if(e.arcballState!=null){this._cameraMatrixState.fromArray(e.arcballState.cameraMatrix.elements),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.up.copy(e.arcballState.cameraUp),this.camera.near=e.arcballState.cameraNear,this.camera.far=e.arcballState.cameraFar,this.camera.zoom=e.arcballState.cameraZoom,this.camera.isPerspectiveCamera&&(this.camera.fov=e.arcballState.cameraFov),this._gizmoMatrixState.fromArray(e.arcballState.gizmoMatrix.elements),this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.camera.updateMatrix(),this.camera.updateProjectionMatrix(),this._gizmos.updateMatrix(),this._tbRadius=this.calculateTbRadius(this.camera);const n=new Pt().copy(this._gizmoMatrixState0);this.makeGizmos(this._gizmos.position,this._tbRadius),this._gizmoMatrixState0.copy(n),this.camera.lookAt(this._gizmos.position),this.updateTbState(It.IDLE,!1),this.dispatchEvent(_e)}}}function Hb(){const i=(this._gizmos.scale.x+this._gizmos.scale.y+this._gizmos.scale.z)/3;this._tbRadius=this.calculateTbRadius(this.camera);const t=this._tbRadius/i,n=new lr(0,0,t,t).getPoints(this._curvePts),s=new ce().setFromPoints(n);for(const r in this._gizmos.children)this._gizmos.children[r].geometry=s;this.dispatchEvent(_e)}function Vb(i){if(this.enabled){for(let t=0;t<this.mouseActions.length;t++)if(this.mouseActions[t].mouse==2){i.preventDefault();break}}}function Wb(){this._touchStart.splice(0,this._touchStart.length),this._touchCurrent.splice(0,this._touchCurrent.length),this._input=me.NONE}function Xb(i){if(i.button==0&&i.isPrimary?(this._downValid=!0,this._downEvents.push(i),this._downStart=performance.now()):this._downValid=!1,i.pointerType=="touch"&&this._input!=me.CURSOR)switch(this._touchStart.push(i),this._touchCurrent.push(i),this._input){case me.NONE:this._input=me.ONE_FINGER,this.onSinglePanStart(i,"ROTATE"),window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp);break;case me.ONE_FINGER:case me.ONE_FINGER_SWITCHED:this._input=me.TWO_FINGER,this.onRotateStart(),this.onPinchStart(),this.onDoublePanStart();break;case me.TWO_FINGER:this._input=me.MULT_FINGER,this.onTriplePanStart(i);break}else if(i.pointerType!="touch"&&this._input==me.NONE){let t=null;i.ctrlKey||i.metaKey?t="CTRL":i.shiftKey&&(t="SHIFT"),this._mouseOp=this.getOpFromAction(i.button,t),this._mouseOp!=null&&(window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp),this._input=me.CURSOR,this._button=i.button,this.onSinglePanStart(i,this._mouseOp))}}function jb(i){if(i.pointerType=="touch"&&this._input!=me.CURSOR)switch(this._input){case me.ONE_FINGER:this.updateTouchEvent(i),this.onSinglePanMove(i,It.ROTATE);break;case me.ONE_FINGER_SWITCHED:if(this.calculatePointersDistance(this._touchCurrent[0],i)*this._devPxRatio>=this._switchSensibility){this._input=me.ONE_FINGER,this.updateTouchEvent(i),this.onSinglePanStart(i,"ROTATE");break}break;case me.TWO_FINGER:this.updateTouchEvent(i),this.onRotateMove(),this.onPinchMove(),this.onDoublePanMove();break;case me.MULT_FINGER:this.updateTouchEvent(i),this.onTriplePanMove(i);break}else if(i.pointerType!="touch"&&this._input==me.CURSOR){let t=null;i.ctrlKey||i.metaKey?t="CTRL":i.shiftKey&&(t="SHIFT");const e=this.getOpStateFromAction(this._button,t);e!=null&&this.onSinglePanMove(i,e)}this._downValid&&this.calculatePointersDistance(this._downEvents[this._downEvents.length-1],i)*this._devPxRatio>this._movementThreshold&&(this._downValid=!1)}function $b(i){if(i.pointerType=="touch"&&this._input!=me.CURSOR){const t=this._touchCurrent.length;for(let e=0;e<t;e++)if(this._touchCurrent[e].pointerId==i.pointerId){this._touchCurrent.splice(e,1),this._touchStart.splice(e,1);break}switch(this._input){case me.ONE_FINGER:case me.ONE_FINGER_SWITCHED:window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=me.NONE,this.onSinglePanEnd();break;case me.TWO_FINGER:this.onDoublePanEnd(i),this.onPinchEnd(i),this.onRotateEnd(i),this._input=me.ONE_FINGER_SWITCHED;break;case me.MULT_FINGER:this._touchCurrent.length==0&&(window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=me.NONE,this.onTriplePanEnd());break}}else i.pointerType!="touch"&&this._input==me.CURSOR&&(window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=me.NONE,this.onSinglePanEnd(),this._button=-1);if(i.isPrimary)if(this._downValid)if(i.timeStamp-this._downEvents[this._downEvents.length-1].timeStamp<=this._maxDownTime)if(this._nclicks==0)this._nclicks=1,this._clickStart=performance.now();else{const e=i.timeStamp-this._clickStart,n=this.calculatePointersDistance(this._downEvents[1],this._downEvents[0])*this._devPxRatio;e<=this._maxInterval&&n<=this._posThreshold?(this._nclicks=0,this._downEvents.splice(0,this._downEvents.length),this.onDoubleTap(i)):(this._nclicks=1,this._downEvents.shift(),this._clickStart=performance.now())}else this._downValid=!1,this._nclicks=0,this._downEvents.splice(0,this._downEvents.length);else this._nclicks=0,this._downEvents.splice(0,this._downEvents.length)}function qb(i){if(this.enabled&&this.enableZoom){let t=null;i.ctrlKey||i.metaKey?t="CTRL":i.shiftKey&&(t="SHIFT");const e=this.getOpFromAction("WHEEL",t);if(e!=null){i.preventDefault(),this.dispatchEvent(Hn);const n=125;let s=i.deltaY/n,r=1;switch(s>0?r=1/this.scaleFactor:s<0&&(r=this.scaleFactor),e){case"ZOOM":if(this.updateTbState(It.SCALE,!0),s>0?r=1/Math.pow(this.scaleFactor,s):s<0&&(r=Math.pow(this.scaleFactor,-s)),this.cursorZoom&&this.enablePan){let o;this.camera.isOrthographicCamera?o=this.unprojectOnTbPlane(this.camera,i.clientX,i.clientY,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._gizmos.position):this.camera.isPerspectiveCamera&&(o=this.unprojectOnTbPlane(this.camera,i.clientX,i.clientY,this.domElement).applyQuaternion(this.camera.quaternion).add(this._gizmos.position)),this.applyTransformMatrix(this.scale(r,o))}else this.applyTransformMatrix(this.scale(r,this._gizmos.position));this._grid!=null&&(this.disposeGrid(),this.drawGrid()),this.updateTbState(It.IDLE,!1),this.dispatchEvent(_e),this.dispatchEvent(Cn);break;case"FOV":if(this.camera.isPerspectiveCamera){this.updateTbState(It.FOV,!0),i.deltaX!=0&&(s=i.deltaX/n,r=1,s>0?r=1/Math.pow(this.scaleFactor,s):s<0&&(r=Math.pow(this.scaleFactor,-s))),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const o=this._v3_1.distanceTo(this._gizmos.position);let a=o/r;a=fe.clamp(a,this.minDistance,this.maxDistance);const c=o*Math.tan(fe.DEG2RAD*this.camera.fov*.5);let l=fe.RAD2DEG*(Math.atan(c/a)*2);l>this.maxFov?l=this.maxFov:l<this.minFov&&(l=this.minFov);const u=c/Math.tan(fe.DEG2RAD*(l/2));r=o/u,this.setFov(l),this.applyTransformMatrix(this.scale(r,this._gizmos.position,!1))}this._grid!=null&&(this.disposeGrid(),this.drawGrid()),this.updateTbState(It.IDLE,!1),this.dispatchEvent(_e),this.dispatchEvent(Cn);break}}}}class Yb extends Gb{constructor(e,n,s,r){const o=e.clone();super(o,n,s);nt(this,"_realCamera");nt(this,"_virtualCamera");nt(this,"universeGroup");nt(this,"originAwareEnabled");this.setGizmosVisible(!1),this._realCamera=e,this._virtualCamera=o,this.universeGroup=r,this.originAwareEnabled=!0,this._syncState()}worldToLocal(e){return e.clone().sub(this._virtualCamera.position)}localToWorld(e){return e.clone().add(this._virtualCamera.position)}update(){this.originAwareEnabled?this.object=this._virtualCamera:this.object=this._realCamera,super.update(),this._syncState()}applyTransformMatrix(e){const n=Object.getPrototypeOf(Object.getPrototypeOf(this));n&&typeof n.applyTransformMatrix=="function"&&n.applyTransformMatrix.call(this,e),this._syncState()}_syncState(){if(!this.originAwareEnabled){this.universeGroup.position.lengthSq()>0&&this.universeGroup.position.set(0,0,0);return}this._realCamera.quaternion.copy(this._virtualCamera.quaternion),this._realCamera.zoom=this._virtualCamera.zoom,this._realCamera.updateProjectionMatrix(),this._realCamera.position.set(0,0,0),this._realCamera.updateMatrix(),this.universeGroup.position.copy(this._virtualCamera.position).negate(),this._gizmos}getVirtualPosition(){return this._virtualCamera.position.clone()}setVirtualPosition(e){this._virtualCamera.position.copy(e),this._virtualCamera.lookAt(this.target),this._virtualCamera.updateMatrix(),this._cameraMatrixState&&this._cameraMatrixState.copy(this._virtualCamera.matrix),this._gizmoMatrixState&&this._gizmos&&(this._gizmos.position.copy(this.target),this._gizmos.updateMatrix(),this._gizmoMatrixState.copy(this._gizmos.matrix)),this._syncState()}getVirtualTarget(){return this.target.clone()}setVirtualTarget(e){this.target.copy(e),this._virtualCamera.lookAt(this.target),this._virtualCamera.updateMatrix(),this._cameraMatrixState&&this._cameraMatrixState.copy(this._virtualCamera.matrix),this._gizmoMatrixState&&this._gizmos&&(this._gizmos.position.copy(this.target),this._gizmos.updateMatrix(),this._gizmoMatrixState.copy(this._gizmos.matrix)),this._syncState()}disableOriginAware(){this.originAwareEnabled&&(this.originAwareEnabled=!1,this._realCamera.position.copy(this._virtualCamera.position),this._realCamera.quaternion.copy(this._virtualCamera.quaternion),this._realCamera.updateMatrix(),this.universeGroup.position.set(0,0,0),this.object=this._realCamera,this.setGizmosVisible(!0))}enableOriginAware(){this.originAwareEnabled||(this.originAwareEnabled=!0,this._virtualCamera.position.copy(this._realCamera.position),this._virtualCamera.quaternion.copy(this._realCamera.quaternion),this.target.copy(this.target),this.object=this._virtualCamera,this._syncState(),this.setGizmosVisible(!1))}resetMomentum(){this._animationId!==-1&&(window.cancelAnimationFrame(this._animationId),this._animationId=-1);const e=this.enableDamping;this.enableDamping=!1,this._timeStart=-1,this._angleCurrent=0,this._w0=0,this.updateTbState?this.updateTbState(0,!1):this._state=0,typeof this.calculateTbRadius=="function"&&(this._tbRadius=this.calculateTbRadius(this.object)),this.makeGizmos&&this._gizmos&&this.makeGizmos(this._gizmos.position,this._tbRadius),this.activateGizmos&&this.activateGizmos(!1),this.enableDamping=e}setGizmosVisible(e){typeof super.setGizmosVisible=="function"?super.setGizmosVisible(e):this._gizmos&&(this._gizmos.visible=e,this.dispatchEvent({type:"change"}))}}function pu(i,t,e){const n=D.coordinateSystem,s=new E;if(n==="Geocentric"||n==="Tychonic"){const r=t.find(o=>o.data.name==="Earth");r&&s.copy(r.mesh.position)}else if(n==="Barycentric"){const r=de(z.SSB,D.date);s.set(r.x*_t,r.z*_t,-r.y*_t)}else s.copy(e.position);s.applyQuaternion(i.quaternion),i.position.copy(s).negate()}function Kb(i){const n=.95*_t,s=1.37*_t,r=new uc(n,s,64),o=new ei({color:65280,side:mn,transparent:!0,opacity:.15,depthWrite:!1}),a=new Oe(r,o),c=23.4*(Math.PI/180);return a.rotation.x=-Math.PI/2+c,a.visible=!1,i.add(a),a}function $0(i,t){if(!i.magneticField)return null;const{strength:e,tilt:n,color:s}=i.magneticField,r=new Se;r.name="MagneticField";const o=16,a=64,c=new hn({color:s,transparent:!0,opacity:.3,blending:Ai});for(let l=0;l<o;l++){const u=l/o*Math.PI*2;for(let h=1.5;h<=3;h+=.5){const d=[],f=h/3,m=t*e*f;for(let p=0;p<=a;p++){const y=.1+p/a*(Math.PI-.2),v=m*Math.sin(y)**2,x=v*Math.sin(y)*Math.cos(u),M=v*Math.sin(y)*Math.sin(u),S=v*Math.cos(y);d.push(new E(x,S,M))}const _=new ce().setFromPoints(d),g=new wn(_,c);r.add(g)}}if(n){const l=n*(Math.PI/180);r.rotation.z=l}return r.visible=!1,r}function Zb(i){const t=new Se;t.name="SunMagneticFieldBasic";const e=5;t.userData.timeOffset=Math.random()*1e3;const n=new ei({color:16777130,transparent:!0,opacity:.9});n.onBeforeCompile=a=>{a.uniforms.uTime={value:0},t.userData.shaderUniforms=a.uniforms,a.vertexShader=`
      uniform float uTime;
      
      // Simplex 2D noise (Exact match to planets.ts)
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      ${a.vertexShader}
    `.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      
      // Calculate "Sphere UV" for this vertex position
      vec3 sphereNormal = normalize(transformed);
      
      // Standard UV mapping
      float u = 0.5 + atan(sphereNormal.z, sphereNormal.x) / (2.0 * 3.14159265);
      float v = 0.5 + asin(sphereNormal.y) / 3.14159265;
      
      // Match Sun Shader Parameters
      float timeScale = uTime * 0.15;
      float noiseScale = 0.005; 
      
      // Use 2D Noise on UVs (Exact match to surface)
      float n1 = snoise(vec2(u * 25.0 + timeScale, v * 25.0 + timeScale));
      float n2 = snoise(vec2(u * 30.0 - timeScale * 0.5, v * 30.0 - timeScale * 0.5));
      
      // Apply displacement
      vec3 displacement = vec3(n1, n2, n1 * n2) * 0.5; 
      
      // Small wiggle to match boiling
      transformed += displacement * 0.1; 
      `)};const s="/assets/textures/midres/sun.jpg",r=a=>new Promise((c,l)=>{const u=new Image;u.crossOrigin="Anonymous",u.onload=()=>{const h=document.createElement("canvas");h.width=u.width,h.height=u.height;const d=h.getContext("2d");if(!d)return;d.drawImage(u,0,0);const f=d.getImageData(0,0,u.width,u.height);Bt.log("Sun texture loaded for magnetic fields:",u.width,u.height),c(f)},u.onerror=h=>{Bt.error("Error loading sun texture:",h),l(h)},u.src=a});return(async()=>{let a;try{a=await r(s)}catch(R){Bt.error("Failed to load sun texture for magnetic fields:",R);return}const{width:c,height:l,data:u}=a,h=new qi(e,64,64),d=.45;let f=0;const m=h.attributes.position,_=h.attributes.uv,g=m.count;Bt.log(`[MagneticFields] Starting generation. Vertices: ${g}, Threshold: ${d}`);const p=[];for(let R=0;R<g;R++){const F=_.getX(R),H=_.getY(R);let U=Math.floor(F*c)%c;U<0&&(U+=c);let B=Math.floor((1-H)*l);B<0&&(B=0),B>=l&&(B=l-1);const Y=(B*c+U)*4,X=(u[Y]+u[Y+1]+u[Y+2])/(3*255);X>=d&&p.push({index:R,pos:new E(m.getX(R),m.getY(R),m.getZ(R)),intensity:X,uv:{u:F,v:H}})}Bt.log(`[MagneticFields] Found ${p.length} valid seeds.`);for(let R=p.length-1;R>0;R--){const F=Math.floor(Math.random()*(R+1));[p[R],p[F]]=[p[F],p[R]]}const y=new Set,v=.1*e,x=R=>{const F=Math.floor(R.x/v),H=Math.floor(R.y/v),U=Math.floor(R.z/v);return`${F},${H},${U}`},M=e*.1,S=e*.5,T=200;let I=0;for(let R=0;R<p.length&&!(f>=T);R++){const F=p[R];let H=null;for(let mt=1;mt<50;mt++){const Vt=(R+mt)%p.length,k=p[Vt],Ft=F.pos.distanceTo(k.pos);if(Ft>M&&Ft<S){H=k;break}}if(!H)continue;const U=F.pos,B=H.pos,Y=U.clone().add(B).multiplyScalar(.5).normalize(),tt=U.distanceTo(B)*(.5+Math.random()*.5),et=Y.multiplyScalar(e+tt),j=[],Q=16;let st=!1;for(let mt=0;mt<=Q;mt++){const Vt=mt/Q,k=U.clone().lerp(et,Vt),Ft=et.clone().lerp(B,Vt),pt=k.lerp(Ft,Vt),bt=x(pt);if(y.has(bt)){st=!0;break}j.push(pt)}if(st){I++;continue}for(const mt of j)y.add(x(mt));const yt=new lc(j),Mt=.008+Math.random()*.007,Nt=new ku(yt,Q,Mt,4,!1),W=new Oe(Nt,n);t.add(W),f++}Bt.log(`[MagneticFields] Created ${f} loops. Rejected ${I} due to collision.`);const b=250,w=new hn({color:16724787,transparent:!0,opacity:.6}),O=new hn({color:3407667,transparent:!0,opacity:.6});let G=0;const $=[...p];for(let R=$.length-1;R>0;R--){const F=Math.floor(Math.random()*(R+1));[$[R],$[F]]=[$[F],$[R]]}for(let R=0;R<$.length&&!(G>=b);R++){const H=$[R].pos,B=Math.asin(H.y/e)*(180/Math.PI);if(!(Math.abs(B)>30)&&Math.random()<.9)continue;const et=B>=0?O:w,j=[],Q=5+Math.random()*10,st=20,yt=.2;for(let W=0;W<=st;W++){const mt=W/st,Vt=e+mt*Q,k=Math.sin(mt*10)*.1*mt,Ft=H.clone().normalize(),pt=new E(0,1,0);Ft.applyAxisAngle(pt,mt*yt);const bt=Ft.multiplyScalar(Vt);bt.x+=k,j.push(bt)}const Mt=new ce().setFromPoints(j),Nt=new wn(Mt,et);t.add(Nt),G++}})(),t.visible=!1,t}function Jb(i){const t=new Se;t.name="MagneticField";const e=100,n=100,s=e*n,r=new Float32Array(s*3),o=new Float32Array(s),a=new Float32Array(s);for(let g=0;g<e;g++)for(let p=0;p<n;p++){const y=g*n+p;r[y*3]=0,r[y*3+1]=0,r[y*3+2]=0,o[y]=g,a[y]=p/(n-1)}const c=new ce;c.setAttribute("position",new Pe(r,3)),c.setAttribute("lineIndex",new Pe(o,1)),c.setAttribute("segmentRatio",new Pe(a,1));const l=new Ci({uniforms:{uTime:{value:0},uColor:{value:new At(16776960)},uSunRadius:{value:5}},vertexShader:`
      uniform float uTime;
      uniform float uSunRadius;
      attribute float lineIndex;
      attribute float segmentRatio;
      varying float vOpacity;

      // Simplex 3D Noise function (simplified)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        // Basic Parker Spiral parameters
        float r = uSunRadius + segmentRatio * 2000.0; // Extend to 2000 units (40 AU)
        
        // Randomize starting angles based on lineIndex
        float phi0 = lineIndex * 123.45; 
        float theta0 = lineIndex * 67.89;
        
        // Spiral equation: phi increases with radius
        // Solar wind speed / rotation rate factor
        float spiralFactor = 0.1; 
        float phi = phi0 + (r - uSunRadius) * spiralFactor;
        
        // Convert spherical to cartesian
        // Distribute lines roughly spherically using theta0
        // We use a pseudo-random distribution for theta
        float theta = acos(2.0 * fract(theta0 * 0.1) - 1.0); // -1 to 1 mapped to 0 to PI
        
        float x = r * sin(theta) * cos(phi);
        float y = r * cos(theta); // Up axis
        float z = r * sin(theta) * sin(phi);
        
        // Add chaotic noise (turbulence)
        // Noise moves with time and varies by position
        float noiseScale = 0.05 * r; // Turbulence increases with distance
        float timeScale = uTime * 0.5;
        
        vec3 noisePos = vec3(x * 0.05, y * 0.05, z * 0.05 + timeScale);
        float nX = snoise(noisePos);
        float nY = snoise(noisePos + vec3(100.0));
        float nZ = snoise(noisePos + vec3(200.0));
        
        vec3 pos = vec3(x, y, z) + vec3(nX, nY, nZ) * noiseScale;

        // Pass opacity to fragment shader
        // Fade out at the start (near sun surface) and at the end
        float fadeStart = smoothstep(0.0, 0.1, segmentRatio);
        float fadeEnd = 1.0 - smoothstep(0.8, 1.0, segmentRatio);
        vOpacity = fadeStart * fadeEnd * 0.03; // Max opacity reduced to 0.03

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      varying float vOpacity;

      void main() {
        gl_FragColor = vec4(uColor, vOpacity);
      }
    `,transparent:!0,depthWrite:!1,blending:Ai}),u=new Float32Array(e*(n-1)*2*3),h=new Float32Array(e*(n-1)*2),d=new Float32Array(e*(n-1)*2);let f=0;for(let g=0;g<e;g++)for(let p=0;p<n-1;p++)h[f]=g,d[f]=p/(n-1),f++,h[f]=g,d[f]=(p+1)/(n-1),f++;const m=new ce;m.setAttribute("position",new Pe(u,3)),m.setAttribute("lineIndex",new Pe(h,1)),m.setAttribute("segmentRatio",new Pe(d,1));const _=new Fu(m,l);return _.frustumCulled=!1,t.add(_),t.userData.material=l,t}function mu(i,t=null){i.userData.originPatched=!1}function Oo(i){const t=new Ao({color:i.color,linewidth:i.linewidth||4,dashed:!0,transparent:!0,depthWrite:!1,depthTest:!0,worldUnits:!1,resolution:i.resolution||new ht(window.innerWidth,window.innerHeight),opacity:i.opacity??.8});return t.transparent=!0,t.depthWrite=!1,t.dashSize=1e10,t.gapSize=0,t.uniforms.uTotalLength={value:1},t.uniforms.uCenterDistance={value:.5},t.onBeforeCompile=e=>{e.uniforms.uTotalLength=t.uniforms.uTotalLength,e.uniforms.uCenterDistance=t.uniforms.uCenterDistance,e.fragmentShader=`
      uniform float uTotalLength;
      uniform float uCenterDistance;
      ${e.fragmentShader}
    `;const n=`
      #ifdef USE_DASH
      // --- CUSTOM ORBIT LOGIC ---
      
      // Calculate signed distance from "current" position
      // negative = past, positive = future
      float dist = vLineDistance - uCenterDistance;
      
      float alphaFade = 0.0;
      
      if (dist > 0.0) {
          // Future Path
          // User requested NO glow/visibility in front.
          // Strictly cut off.
          alphaFade = 0.0;
      } else {
          // Past Trail
          // Fade from 1.0 at center to 0.0 at tail start
          float pastProg = 1.0 - (abs(dist) / uCenterDistance);
          // Very slow fade (root curve) to keep trail visible almost to the end
          alphaFade = pow(max(0.0, pastProg), 0.4); 
      }
      
      // Asymmetric Glow
      // Only diffuse into the past to create a comet-like head
      float glow = 0.0;
      
      if (dist <= 0.0) {
           // Back glow: smooth
           glow = exp(-abs(dist) * 5.0); 
      }
      glow = max(0.0, glow);

      // Apply base opacity
      alpha *= alphaFade;
      
      // Mix glow
      // Additive boost
      if (alphaFade > 0.0 || glow > 0.0) {
         // Boost color at the head
         diffuseColor.rgb += vec3(0.5) * glow; 
         alpha += glow * 0.8;
      }
      
      // Max alpha clamp
      alpha = min(alpha, 1.0);
      #endif
      
      // Final Output
      gl_FragColor = vec4( diffuseColor.rgb, alpha );
    `;e.fragmentShader=e.fragmentShader.replace("gl_FragColor = vec4( diffuseColor.rgb, alpha );",n)},t}const Rc=new ht(window.innerWidth,window.innerHeight);function Qb(i,t){Rc.set(i,t)}function q0(i){return!i||!i.period?null:(i.period/365.25)**(2/3)}function tS(i){const t=new qi(i.radius,32,32),e=new $n({color:i.color});mu(e),i.texture&&br.loadTexture(i.texture,e,i.name,!0,i.category);const n=new Oe(t,e);if(n.castShadow=!0,n.receiveShadow=!0,n.userData.isMoon=!0,n.scale.setScalar(D.planetScale),i.axialTilt!==void 0&&!i.tidallyLocked){const s=i.axialTilt*Math.PI/180;n.rotation.z=s}return n}function eS(i,t){const e=t.radius*2.5,n=new ce().setFromPoints([new E(0,-e,0),new E(0,e,0)]),s=new hn({color:16777215,transparent:!0,opacity:.5}),r=new wn(n,s);r.visible=D.showAxes,r.raycast=()=>{},i.add(r),t.axisLine=r}function _h(i,t){const e=i.orbitLine,n=t.getTime(),s=i.period||27.3,r=[],o=90;for(let h=0;h<o;h++){const f=(-.9+h/(o-1))*s*24*60*60*1e3,m=new Date(n+f);let _,g,p;if(i.type==="jovian"){const y=Ja(m),v=[y.io,y.europa,y.ganymede,y.callisto][i.moonIndex];_=v.x,g=v.y,p=v.z}else if(i.type==="real"){const y=on(z[i.body],m,!0);_=y.x,g=y.y,p=y.z}else return;r.push(_*_t,p*_t,-g*_t)}e.geometry.setPositions(r),e.computeLineDistances();let c=0;for(let h=3;h<r.length;h+=3){const d=r[h]-r[h-3],f=r[h+1]-r[h-2],m=r[h+2]-r[h-1];c+=Math.sqrt(d*d+f*f+m*m)}if(e.material.uniforms.uTotalLength.value=c||1,e.material.uniforms.uCenterDistance){let h=0;const f=Math.floor((90-1)*.9);for(let m=3;m<r.length;m+=3){const _=r[m]-r[m-3],g=r[m+1]-r[m-2],p=r[m+2]-r[m-1],y=Math.sqrt(_*_+g*g+p*p);m/3<=f&&(h+=y)}e.material.uniforms.uCenterDistance.value=h}const l=i.color||8960989,u=D.showPlanetColors?new At(l):new At(8960989);e.material.color.equals(u)||e.material.color.copy(u),i.lastOrbitUpdate=t.getTime()}function nS(i,t){const e=new Qi,n=Oo({color:8960989,opacity:.6,linewidth:3,resolution:Rc}),s=new zr(e,n);t.add(s),i.orbitLine=s,_h(i,new Date)}function iS(i,t){const e=[],n=i.distance*_t,s=90;for(let l=0;l<=s;l++){const u=l/s*Math.PI*2;e.push(Math.cos(u)*n,0,Math.sin(u)*n)}const r=new Qi;r.setPositions(e);const o=Oo({color:8960989,opacity:.6,linewidth:2,resolution:Rc}),a=new zr(r,o);a.computeLineDistances();let c=0;for(let l=3;l<e.length;l+=3){const u=e[l]-e[l-3],h=e[l+1]-e[l-2],d=e[l+2]-e[l-1];c+=Math.sqrt(u*u+h*h+d*d)}o.uniforms.uTotalLength.value=c||1,t.add(a),i.orbitLine=a,i.isSimpleScale=!0}function sS(i,t){const e=new Qi,n=Oo({color:8960989,opacity:.6,linewidth:3,resolution:Rc}),s=new zr(e,n);t.add(s),i.orbitLine=s,_h(i,new Date)}function rS(i,t,e){const n=[];return i.moons&&i.moons.forEach(s=>{const r=tS(s);eS(r,s),t.add(r),i.name==="Earth"?r.layers.set(1):r.layers.set(0),s.type==="jovian"?nS(s,e):s.type==="simple"?iS(s,e):sS(s,e);let o=!1;(s.category==="largest"&&D.showLargestMoons||s.category==="major"&&D.showMajorMoons||s.category==="small"&&D.showSmallMoons)&&(o=!0),s.category||(o=!0),r.visible=o,s.orbitLine&&(s.orbitLine.visible=o),n.push({mesh:r,data:s})}),n}function oS(i,t){if(!i.moons)return;const e=D.planetScale*In;let n=null,s=null;if(D.capMoonOrbits){n=i.data.radius*D.planetScale*1.1;let l=1/0,u=1/0;const h=q0(i.data);if(h){t.forEach(f=>{if(f===i)return;const m=q0(f.data);if(!m)return;const _=m-h;if(_>0)_<l&&(l=_);else{const g=Math.abs(_);g<u&&(u=g)}});const d=Math.min(l,u);d!==1/0&&(s=d/2*_t)}n&&s&&n>s&&(s=n)}const r=[];i.moons.forEach(c=>{let l;if(c.data.type==="jovian"){const u=Ja(D.date),h=[u.io,u.europa,u.ganymede,u.callisto][c.data.moonIndex];l=Math.sqrt(h.x**2+h.y**2+h.z**2)*_t*e}else if(c.data.type==="real"){const u=on(z[c.data.body],D.date,!0);l=Math.sqrt(u.x**2+u.y**2+u.z**2)*_t*e}else l=c.data.distance*_t*e;r.push(l)});let o=1,a=0;if(D.capMoonOrbits&&n&&s&&r.length>0){const c=Math.min(...r),l=Math.max(...r);if(l>s||c<n){const u=l-c,h=s-n;if(u>1e-4)o=h/u,a=n-c*o;else{const d=(n+s)/2;o=0,a=d}}}i.moons.forEach(c=>{let l,u,h;if(c.data.type==="jovian"){const d=Ja(D.date),f=[d.io,d.europa,d.ganymede,d.callisto][c.data.moonIndex],m=Math.sqrt(f.x**2+f.y**2+f.z**2),p=(m*_t*e*o+a)/(m*_t);c.data.orbitLine&&c.data.orbitLine.scale.setScalar(p),l=f.x*_t*p,h=-f.y*_t*p,u=f.z*_t*p}else if(c.data.type==="real"){const d=on(z[c.data.body],D.date,!0),f=Math.sqrt(d.x**2+d.y**2+d.z**2),g=(f*_t*e*o+a)/(f*_t);c.data.orbitLine&&c.data.orbitLine.scale.setScalar(g),l=d.x*_t*g,h=-d.y*_t*g,u=d.z*_t*g}else{const d=c.data.distance,m=d*_t*e*o+a,_=m/(d*_t),g=new Date(2e3,0,1).getTime(),v=(D.date.getTime()-g)/(24*60*60*1e3)*2*Math.PI/c.data.period;c.data.orbitLine&&c.data.orbitLine.scale.setScalar(_);const x=m;l=Math.cos(v)*x,h=Math.sin(v)*x,u=0}c.mesh.position.x=i.mesh.position.x+l,c.mesh.position.z=i.mesh.position.z+h,c.mesh.position.y=i.mesh.position.y+u,c.data.tidallyLocked&&(c.mesh.rotation.y=Math.atan2(l,h)+Math.PI),c.data.type!=="simple"&&c.data.orbitLine&&_h(c.data,D.date)})}class aS{constructor(){nt(this,"audio");nt(this,"tracks");nt(this,"currentTrackIndex");nt(this,"isPlaying");nt(this,"initialized");nt(this,"playHistory");this.audio=new Audio,this.tracks=[],this.currentTrackIndex=-1,this.isPlaying=!1,this.initialized=!1,this.playHistory=[],this.audio.addEventListener("ended",()=>this.handleTrackEnded())}async init(){if(!this.initialized)try{const t=await fetch("assets/music/tracks.json");this.tracks=await t.json(),this.initialized=!0,Bt.log("Music system initialized with tracks:",this.tracks),D.music.playlist.length===0&&(D.music.playlist=this.tracks.map(e=>e.id)),Bt.log("Music ready. Click play button to start.")}catch(t){Bt.error("Failed to initialize music system:",t)}}setEnabled(t){D.music.enabled=t,t?this.audio.paused&&(this.audio.src?(this.audio.play().catch(e=>Bt.warn("Audio play failed:",e)),this.isPlaying=!0):this.playNext()):(this.audio.pause(),this.isPlaying=!1)}setPlaylist(t){D.music.playlist=t,D.music.enabled&&!this.isPlaying&&t.length>0&&this.playNext()}setVolume(t){this.audio.volume=t,D.music.volume=t,t>0&&!D.music.enabled?this.setEnabled(!0):t===0&&D.music.enabled&&this.setEnabled(!1)}playNext(){var n;if(!D.music.enabled||D.music.playlist.length===0){this.audio.pause(),this.isPlaying=!1;return}const t=this.tracks.filter(s=>D.music.playlist.includes(s.id));if(t.length===0)return;let e;if(D.music.shuffle){const s=Math.floor(Math.random()*t.length);e=t[s]}else{const s=(n=this.tracks[this.currentTrackIndex])==null?void 0:n.id,r=t.findIndex(o=>o.id===s);e=t[(r+1)%t.length]}if(this.currentTrackIndex!==-1){const s=this.tracks[this.currentTrackIndex];s&&(this.playHistory.push(s.id),this.playHistory.length>50&&this.playHistory.shift())}this.currentTrackIndex=this.tracks.findIndex(s=>s.id===e.id),this.currentTrackIndex!==-1&&this.loadAndPlay(this.tracks[this.currentTrackIndex],!0)}playPrevious(){if(this.playHistory.length>0){const t=this.playHistory.pop(),e=this.tracks.findIndex(n=>n.id===t);if(e!==-1){this.currentTrackIndex=e;const n=this.tracks[this.currentTrackIndex];this.loadAndPlay(n,!0);return}}Bt.log("No previous track in history")}loadAndPlay(t,e=!1){const n="ogg";this.audio.src=`assets/music/${n}/${encodeURIComponent(t.filename)}.${n}`,this.audio.volume=D.music.volume,D.music.currentTrackName=t.title.replace(/ \[(Lyrics|Instrumental)\]/g,""),Bt.log(`Now playing: ${t.title}`),this.audio.play().then(()=>{this.isPlaying=!0}).catch(s=>{Bt.warn("Playback failed (likely autoplay blocked):",s),this.isPlaying=!1})}handleTrackEnded(){this.playNext()}}const gn=new aS,zm=new ht(window.innerWidth,window.innerHeight);function cS(i,t){zm.set(i,t)}function lS(i,t){if(!i.body&&!i.elements)return null;const e=[],n=360,s=new Date,r=i.period||365,o=-.5*r*24*60*60*1e3;for(let p=0;p<n;p++){const y=p/(n-1),v=o+y*r*24*60*60*1e3,x=new Date(s.getTime()+v);let M;if(i.body){const S=de(i.body,x);M=new E(S.x*_t,S.z*_t,-S.y*_t)}else i.elements&&(M=Zi(i.elements,x));M&&e.push(M.x,M.y,M.z)}for(let p=0;p<=n;p++){const v=(p/n-.5)*r*24*60*60*1e3,x=new Date(s.getTime()+v);let M;i.body?M=de(z[i.body],x):i.elements&&(M=Zi(i.elements,x)),e.push(M.x*_t,M.z*_t,-M.y*_t)}const a=new Qi;a.setPositions(e);const c=D.showPlanetColors,l=D.showDwarfPlanetColors,u=i.type==="dwarf",h=i.name==="Tesla Roadster",d=(u?l:c)||h,f=d&&i.color||8960989,m=Oo({color:f,opacity:d?.9:.6,linewidth:4,resolution:zm}),_=new zr(a,m);_.name=`${i.name}_Orbit`,_.computeLineDistances();let g=0;for(let p=3;p<e.length;p+=3){const y=e[p-3],v=e[p-2],x=e[p-1],M=e[p],S=e[p+1],T=e[p+2],I=M-y,b=S-v,w=T-x;g+=Math.sqrt(I*I+b*b+w*w)}return m.uniforms.uTotalLength.value=g||1,i.visible===!1&&(_.visible=!1),_.userData.planetData=i,_.userData.periodDays=r,_.userData.lastUpdateTime=s.getTime(),t.add(_),_}function uS(i,t){i.children.forEach(e=>{if(!e.userData.planetData)return;const n=e.userData.planetData,s=e.userData.periodDays||365,r=[],o=360,a=.9,c=-a*s*24*60*60*1e3,l=D.date.getTime();for(let g=0;g<o;g++){const p=g/(o-1),y=c+p*s*24*60*60*1e3,v=new Date(l+y);let x;n.body?x=de(z[n.body],v):n.elements&&(x=Zi(n.elements,v)),x&&r.push(x.x*_t,x.z*_t,-x.y*_t)}e.geometry.setPositions(r),e.computeLineDistances();let h=0,d=0;const f=Math.floor((o-1)*a);for(let g=3;g<r.length;g+=3){const p=r[g]-r[g-3],y=r[g+1]-r[g-2],v=r[g+2]-r[g-1],x=Math.sqrt(p*p+y*y+v*v);h+=x,g/3<=f&&(d+=x)}const m=e.material;m.uniforms&&(m.uniforms.uTotalLength&&(m.uniforms.uTotalLength.value=h||1),m.uniforms.uCenterDistance&&(m.uniforms.uCenterDistance.value=d));const _=D.showPlanetColors?new At(n.color):new At(8960989);m.color.equals(_)||m.color.copy(_)})}function hS(i){const t=new Du,e=new ac(-window.innerWidth/2,window.innerWidth/2,window.innerHeight/2,-window.innerHeight/2,.1,100);e.position.z=5;let n=null;const s={active:!0,phase:"delay",startTime:0},r={initialDelay:2,flyDuration:4,startPosition:new E(0,0,0),targetPosition:new E(0,0,0),startScale:.3,endScale:1};new hc().load("./assets/images/rabbit_spaceship.png",c=>{const l=new Nu({map:c,transparent:!0,opacity:1});n=new Kf(l);const u=c.image.width/c.image.height,h=200;n.scale.set(h*u,h,1),n.position.copy(r.startPosition),t.add(n),s.startTime=performance.now()/1e3},void 0,c=>{Bt.error("An error happened loading the spaceship:",c),s.active=!1});function a(){const c=window.innerWidth,l=window.innerHeight;if(e.left=-c/2,e.right=c/2,e.top=l/2,e.bottom=-l/2,e.updateProjectionMatrix(),r.startPosition.x=c/2+100,r.startPosition.y=l/2+100,r.targetPosition.x=-c/2-100,r.targetPosition.y=-l/2-100,n&&s.phase==="fly"){const h=performance.now()/1e3-s.startTime,d=Math.min(h/r.flyDuration,1);n.position.lerpVectors(r.startPosition,r.targetPosition,d)}}return window.addEventListener("resize",a),a(),{update:()=>{if(!s.active||!n)return;const c=performance.now()/1e3,l=c-s.startTime;if(s.phase==="delay")l>=r.initialDelay&&(s.phase="fly",s.startTime=c);else if(s.phase==="fly"){const u=Math.min(l/r.flyDuration,1),h=1-(1-u)**5;n.position.lerpVectors(r.startPosition,r.targetPosition,h);const d=fe.lerp(r.startScale,r.endScale,h),f=n&&n.material&&n.material.map&&n.material.map.image?n.material.map.image.width/n.material.map.image.height:1,m=200;n.scale.set(m*f*d,m*d,1),u>=1&&(s.active=!1,t.remove(n),window.removeEventListener("resize",a))}},render:()=>{s.active&&(i.autoClear=!1,i.clearDepth(),i.render(t,e),i.autoClear=!0)}}}const Aa=new E,Tl=new E,Al=new E,Cl=new Map,dS=1e3*60*60,km=new ht(window.innerWidth,window.innerHeight);function fS(i,t){km.set(i,t)}function Y0(i,t,e){if(i.body){const n=de(z[i.body],t);e.set(n.x,n.y,n.z)}else if(i.elements){const n=Zi(i.elements,t);e.set(n.x,n.y,n.z)}else e.set(0,0,0);return e}function pS(i){const e=i,n=Math.abs(1/(1/365.25-1/e)),s=e/n;return Math.max(1,s)}function mS(i,t,e,n,s,r){const o=[];for(let a=0;a<r;a++){const c=new Date(n+a/(r-1)*s*24*60*60*1e3);if(i.name==="Sun"?Tl.set(0,0,0):Y0(i,c,Tl),t==="Geocentric"||t==="Tychonic"){const l=e.find(u=>u.name==="Earth");l&&Y0(l,c,Al)}else{const l=de(z.SSB,c);Al.set(l.x,l.y,l.z)}Aa.subVectors(Tl,Al),o.push(new E(Aa.x*_t,Aa.z*_t,-Aa.y*_t))}return o}function gS(i,t){return new lc(i,!1,"centripetal",.5).getPoints(t-1)}function K0(i,t){const e=i.name==="Sun",n=D.showPlanetColors,s=D.showDwarfPlanetColors,r=i.type==="dwarf",a=i.name==="Tesla Roadster"?!0:r?s:n,l=e?i.color||16776960:a?i.color||8960989:8960989,u=e?.8:a?.9:.7;if(t){const h=t.material,d=new At(l);return h.color.equals(d)||h.color.copy(d),h}return Oo({color:l,opacity:u,linewidth:e?6:4,resolution:km})}function za(i,t,e,n){const s=D.coordinateSystem;if(i.parent&&t.rotation.copy(i.parent.rotation),s==="Heliocentric"){i.visible=!0,t.visible=!1,i.children.forEach(c=>{const l=e.some(d=>d.data.type==="dwarf"&&c.name===`${d.data.name}_Orbit`),u=e.some(d=>d.data.type!=="dwarf"&&c.name===`${d.data.name}_Orbit`);c.name==="Tesla Roadster_Orbit"?c.visible=D.showMissions.teslaRoadster:l?c.visible=D.showDwarfPlanetOrbits&&D.showDwarfPlanets:u?c.visible=D.showPlanetOrbits&&D.showPlanets:c.visible=!0});return}i.visible=!1,t.visible=!0;const r=e.map(c=>c.data),o=[...e];s==="Geocentric"||s==="Tychonic"?o.push({data:{name:"Sun",body:"Sun",color:16776960,period:365.25}}):s==="Barycentric"&&o.push({data:{name:"Sun",body:"Sun",color:16776960,period:12*365.25}});const a=D.date.getTime();o.forEach(c=>{var I;const l=c.data;let u=!0;l.name==="Tesla Roadster"?u=D.showMissions.teslaRoadster:l.type==="dwarf"?u=D.showDwarfPlanetOrbits&&D.showDwarfPlanets:l.name==="Sun"?u=D.showSunOrbits&&D.showSun:u=D.showPlanetOrbits&&D.showPlanets,(s==="Geocentric"||s==="Tychonic")&&l.name==="Earth"&&(u=!1),s==="Tychonic"&&l.name!=="Sun"&&(u=!1);let h=t.getObjectByName(`${l.name}_Trail`);if(!u){h&&(h.visible=!1);return}const d=l.period||730,f=pS(d),_=Math.max(50,Math.min(Math.ceil(f*(s==="Geocentric"?25:15)),3e3)),g=Math.max(300,Math.min(Math.ceil(f*50),6e3)),p=`${l.name}_${s}`,y=Cl.get(p)||0,x=Math.abs(a-y)>dS,M=!h,S=h?(I=h.geometry.attributes.instanceStart)==null?void 0:I.count:0,T=h&&S!==g-1;if(M||T){h&&(h.geometry.dispose(),h.material.dispose(),t.remove(h));const b=new Qi,w=K0(l,null);h=new zr(b,w),h.name=`${l.name}_Trail`,h.frustumCulled=!1,t.add(h),Cl.set(p,0)}else K0(l,h);if(h.visible=!0,x||M||T){const w=d*.9,O=a-w*24*60*60*1e3,G=mS(l,s,r,O,d,_),$=gS(G,g),R=[];for(let B=0;B<$.length;B++)R.push($[B].x,$[B].y,$[B].z);h.geometry.setPositions(R),h.computeLineDistances();let H=0;for(let B=1;B<$.length;B++)H+=$[B].distanceTo($[B-1]);const U=h.material;if(U.uniforms){U.uniforms.uTotalLength&&(U.uniforms.uTotalLength.value=H||1);let B=0;const Y=Math.floor($.length*.9);for(let X=1;X<=Y&&X<$.length;X++)B+=$[X].distanceTo($[X-1]);U.uniforms.uCenterDistance&&(U.uniforms.uCenterDistance.value=B)}Cl.set(p,a)}}),s==="Tychonic"&&(i.visible=!0,t.visible=!0)}const Bm={And:"Andromeda",Ant:"Antlia",Aps:"Apus",Aqr:"Aquarius",Aql:"Aquila",Ara:"Ara",Ari:"Aries",Aur:"Auriga",Boo:"Boötes",Cael:"Caelum",Cam:"Camelopardalis",Cnc:"Cancer",CVn:"Canes Venatici",CMa:"Canis Major",CMi:"Canis Minor",Cap:"Capricornus",Car:"Carina",Cas:"Cassiopeia",Cen:"Centaurus",Cep:"Cepheus",Cet:"Cetus",Cha:"Chamaeleon",Cir:"Circinus",Col:"Columba",Com:"Coma Berenices",CrA:"Corona Australis",CrB:"Corona Borealis",crv:"Corvus",Crt:"Crater",Cru:"Crux",Cyg:"Cygnus",Del:"Delphinus",Dor:"Dorado",Dra:"Draco",Equ:"Equuleus",Eri:"Eridanus",For:"Fornax",Gem:"Gemini",Gru:"Grus",Her:"Hercules",Hor:"Horologium",Hya:"Hydra",Hyi:"Hydrus",Ind:"Indus",Lac:"Lacerta",Leo:"Leo",LMi:"Leo Minor",Lep:"Lepus",Lib:"Libra",Lup:"Lupus",Lyn:"Lynx",Lyr:"Lyra",Men:"Mensa",Mic:"Microscopium",Mon:"Monoceros",Mus:"Musca",Nor:"Norma",Oct:"Octans",Oph:"Ophiuchus",Ori:"Orion",Pav:"Pavo",Peg:"Pegasus",Per:"Perseus",Phe:"Phoenix",Pic:"Pictor",Psc:"Pisces",PsA:"Piscis Austrinus",Pup:"Puppis",Pyx:"Pyxis",Ret:"Reticulum",Sge:"Sagitta",Sgr:"Sagittarius",Sco:"Scorpius",Scl:"Sculptor",Sct:"Scutum",Ser:"Serpens",Sex:"Sextans",Tau:"Taurus",Tel:"Telescopium",Tri:"Triangulum",TrA:"Triangulum Australe",Tuc:"Tucana",UMa:"Ursa Major",UMi:"Ursa Minor",Vel:"Vela",Vir:"Virgo",Vol:"Volans",Vul:"Vulpecula"},_S={fields:[{label:"Type",value:"G-type Main Sequence Star (G2V)"},{label:"Radius",value:"696,340 km (109 x Earth)"},{label:"Mass",value:"1.989 × 10³⁰ kg (333,000 x Earth)"},{label:"Density",value:"1.41 g/cm³"},{label:"Surface Gravity",value:"28 g"},{label:"Surface Temp",value:"5,500°C"},{label:"Core Temp",value:"15,000,000°C"},{label:"Rotation",value:"~27 days (Differential)"},{label:"Age",value:"4.6 Billion Years"}]};class Gm{constructor(){nt(this,"windows");nt(this,"zIndexCounter");nt(this,"container");this.windows=new Map,this.zIndexCounter=1e3,this.container=document.body,window.addEventListener("resize",()=>this._handleResize())}createWindow(t,e,n={}){if(this.windows.has(t))return this.windows.get(t);const s=document.createElement("div");s.id=t,s.className="ui-window",s.style.zIndex=this.zIndexCounter+++"";let r=n.x||100,o=n.y||100,a="none",c="none";const l=20;if(n.snap){if(n.snap.x==="right"){let h=300;n.width&&typeof n.width=="string"&&n.width.endsWith("px")&&(h=parseInt(n.width,10)),r=window.innerWidth-h-l,a="right"}else n.snap.x==="left"&&(r=l,a="left");if(n.snap.y==="bottom"){let h=400;n.height&&typeof n.height=="string"&&n.height.endsWith("px")&&(h=parseInt(n.height,10)),o=window.innerHeight-h-l,c="bottom"}else n.snap.y==="top"&&(o=l,c="top")}if(s.style.transform=`translate3d(${r}px, ${o}px, 0)`,n.width&&(s.style.width=n.width),n.height&&(s.style.height=n.height),s.innerHTML=`
      <div class="window-header">
        <span class="window-title">${e||""}</span>
        <div class="window-close">×</div>
      </div>
      <div class="window-content"></div>
    `,this.container.appendChild(s),c==="bottom"){const h=s.getBoundingClientRect();o=window.innerHeight-h.height-l,s.style.transform=`translate3d(${r}px, ${o}px, 0)`}if(a==="right"){const h=s.getBoundingClientRect();r=window.innerWidth-h.width-l,s.style.transform=`translate3d(${r}px, ${o}px, 0)`}const u={id:t,element:s,header:s.querySelector(".window-header"),content:s.querySelector(".window-content"),closeBtn:s.querySelector(".window-close"),x:r,y:o,snapState:{x:a,y:c},onClose:n.onClose};return this.windows.set(t,u),this._setupInteractions(u),u}getWindow(t){return this.windows.get(t)}toggleWindow(t){const e=this.windows.get(t);e&&(e.element.style.display==="none"?this.showWindow(t):this.hideWindow(t))}showWindow(t){const e=this.windows.get(t);e&&(e.element.style.display="flex",this.bringToFront(t))}hideWindow(t){const e=this.windows.get(t);e&&(e.element.style.display="none",e.onClose&&e.onClose())}bringToFront(t){const e=this.windows.get(t);e&&(e.element.style.zIndex=++this.zIndexCounter+"")}_setupInteractions(t){let e=!1,n=0,s=0,r=0,o=0;const a=u=>{const h=u.target;!h||h.closest("button")||h.closest("input")||h.closest(".control-btn")||h.closest(".speedometer-interaction")||h===t.closeBtn||(e=!0,n=u.clientX,s=u.clientY,r=t.x,o=t.y,this.bringToFront(t.id),document.body.style.cursor="default")},c=u=>{if(e){const h=u.clientX-n,d=u.clientY-s;let f=r+h,m=o+d;const _=20,g=20,p=t.element.offsetWidth,y=t.element.offsetHeight,v=window.innerWidth,x=window.innerHeight;let M="none",S="none";Math.abs(f-g)<_?(f=g,M="left"):Math.abs(f-(v-p-g))<_&&(f=v-p-g,M="right"),Math.abs(m-g)<_?(m=g,S="top"):Math.abs(m-(x-y-g))<_&&(m=x-y-g,S="bottom"),t.x=f,t.y=m,t.snapState={x:M,y:S},t.element.style.transform=`translate3d(${t.x}px, ${t.y}px, 0)`,u.preventDefault()}},l=()=>{e=!1};t.element.addEventListener("mousedown",a),document.addEventListener("mousemove",c),document.addEventListener("mouseup",l),t.closeBtn.addEventListener("click",u=>{u.stopPropagation(),this.hideWindow(t.id)}),t.element.addEventListener("mousedown",()=>{this.bringToFront(t.id)}),this._setupResizeObserver(t)}_setupResizeObserver(t){const e=new ResizeObserver(n=>{for(const s of n){const r=t.element.offsetWidth,o=t.element.offsetHeight,a=window.innerWidth,c=window.innerHeight,l=20;let u=!1;t.snapState.x==="right"&&(t.x=a-r-l,u=!0),t.snapState.y==="bottom"&&(t.y=c-o-l,u=!0),u&&(t.element.style.transform=`translate3d(${t.x}px, ${t.y}px, 0)`)}});e.observe(t.element),t.resizeObserver=e}_handleResize(){const e=window.innerWidth,n=window.innerHeight;for(const s of this.windows.values()){let r=!1;const o=s.element.offsetWidth,a=s.element.offsetHeight;s.snapState.x==="right"&&(s.x=e-o-20,r=!0),s.snapState.y==="bottom"&&(s.y=n-a-20,r=!0),r&&(s.element.style.transform=`translate3d(${s.x}px, ${s.y}px, 0)`)}}}const ve=new Gm,yS=Object.freeze(Object.defineProperty({__proto__:null,WindowManager:Gm,windowManager:ve},Symbol.toStringTag,{value:"Module"}));function gu(i,t=2){if(!i)return"0";const e=i.toExponential(t),[n,s]=e.split("e"),r=parseFloat(n),o=parseInt(s,10),a={0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹","-":"⁻","+":""},c=o.toString().split("").map(l=>a[l]||l).join("");return`${r} × 10${c}`}function ro(i){if(typeof i!="number")return i;const t=Math.abs(i);return t>=1e3?i.toLocaleString("en-US",{maximumFractionDigits:0}):t>=10?i.toLocaleString("en-US",{maximumFractionDigits:1}):i.toLocaleString("en-US",{maximumFractionDigits:3})}function Hm(i){return i?typeof i=="string"?i:typeof i=="number"?`${(i/9.807).toFixed(2)} g`:i:"N/A"}function vS(i,t){const e=i.clone().project(t);if(e.z<-1||e.z>1)return null;const n=(e.x*.5+.5)*window.innerWidth,s=(-(e.y*.5)+.5)*window.innerHeight;return{x:n,y:s,z:e.z}}function xS(i,t,e,n,s,r){const o=(e-s)*(e-s)+(n-r)*(n-r);if(o===0)return(i-e)*(i-e)+(t-n)*(t-n);let a=((i-e)*(s-e)+(t-n)*(r-n))/o;a=Math.max(0,Math.min(1,a));const c=e+a*(s-e),l=n+a*(r-n);return(i-c)*(i-c)+(t-l)*(t-l)}function MS(i,t,e,n,s,r=20){let o=null,a=r;const c=(l,u,h,d)=>{if(!l||!l.visible)return;const f=new E;l.getWorldPosition(f);const m=vS(f,e);if(!m)return;const _=i-m.x,g=t-m.y,p=Math.sqrt(_*_+g*g);p<a&&(a=p,o={type:u,data:h,parentName:d})};return s&&c(s,"sun",{}),n.forEach(l=>{c(l.mesh,"planet",l.data),l.moons&&l.moons.forEach(u=>{c(u.mesh,"moon",u.data,l.data.name)})}),o}const bS=10;function SS(i,t,e,n,s,r){const o=document.getElementById("tooltip"),a=ve.createWindow("object-info","Object Info",{x:20,y:20,width:"300px",onClose:()=>{}});ve.hideWindow("object-info");const c=a==null?void 0:a.element,l=new fc,u=new ht;window.addEventListener("mousemove",h=>{u.x=h.clientX/window.innerWidth*2-1,u.y=-(h.clientY/window.innerHeight)*2+1;const d=h.clientX,f=h.clientY,m=h.target;if(m&&(m.closest(".lil-gui")||m.closest(".info-window")&&D.objectInfoMode==="window")){D.objectInfoMode==="tooltip"&&o&&(o.style.display="none"),document.body.style.cursor="default",document.body.style.cursor="default";return}if(!o)return;if(D.objectInfoMode==="off"){o.style.display="none",c&&(c.style.display="none"),document.body.style.cursor="default";return}let _=null;const g=[e];t.forEach(y=>{if(g.push(y.mesh),y.moons)for(const v of y.moons)g.push(v.mesh)}),l.setFromCamera(u,i);const p=l.intersectObjects(g,!0);if(p.length>0){const y=p[0],v=wS(y.object,t,e);v&&(_=v)}if(!_){const y=MS(d,f,i,t,e);y&&(_=y)}if(!_){const y=n.value;if(y){const v=y.userData.manager,x=y.userData.starData;let M=[];v?M=v.getOctrees():y.userData.octree&&(M=[y.userData.octree]);let T=15,I=[];if(M.length>0){l.setFromCamera(u,i);const b=new Pt().copy(y.matrixWorld).invert(),w=l.ray.clone().applyMatrix4(b);M.forEach(O=>{const G=O.queryRay(w,500);I.push(...G)})}else x&&(I=x.map((b,w)=>({data:b,index:w})));for(const b of I){const w=b.data;if(w.mag!==void 0&&D.magnitudeLimit!==void 0&&w.mag>D.magnitudeLimit)continue;let O;b.position?O=b.position.clone():O=new E(w.x*ke,w.z*ke,-w.y*ke),O.applyMatrix4(y.matrixWorld);const G=O.clone().project(i);if(G.z<1&&G.z>-1){const $=(G.x*.5+.5)*window.innerWidth,R=(-(G.y*.5)+.5)*window.innerHeight,F=d-$,H=f-R,U=Math.sqrt(F*F+H*H);U<T&&(T=U,_={data:w,type:"star"})}}}}if(!_){const y=[];s!=null&&s.visible&&y.push(s),r!=null&&r.visible&&y.push(r);let v=bS;y.forEach(x=>{x.children.forEach(M=>{if(!M.isLine)return;const S=M.geometry.attributes.position,T=new E,I=new E;for(let b=0;b<S.count-1;b++){T.fromBufferAttribute(S,b),I.fromBufferAttribute(S,b+1),T.applyMatrix4(M.matrixWorld),I.applyMatrix4(M.matrixWorld);const w=T.clone().project(i),O=I.clone().project(i);if(w.z<-1||w.z>1||O.z<-1||O.z>1)continue;const G=(w.x*.5+.5)*window.innerWidth,$=(-(w.y*.5)+.5)*window.innerHeight,R=(O.x*.5+.5)*window.innerWidth,F=(-(O.y*.5)+.5)*window.innerHeight,H=xS(d,f,G,$,R,F);H<v*v&&(v=Math.sqrt(H),_={type:"asterism",data:M.userData})}})})}if(_){document.body.style.cursor="pointer";const y=LS(_);if(D.objectInfoMode==="tooltip"){o.innerHTML=y,o.style.display="block",c.style.display="none";const v=o.offsetWidth,x=o.offsetHeight,M=15;let S=d+M,T=f+M;S+v>window.innerWidth&&(S=d-v-M),T+x>window.innerHeight&&(T=f-x-M),S<0&&(S=M),T<0&&(T=M),o.style.left=`${S}px`,o.style.top=`${T}px`}else if(D.objectInfoMode==="window"){o.style.display="none";const v=ve.getWindow("object-info");if(v&&v.element.style.display!=="none")a&&a.content&&(a.content.innerHTML=y);else return;let x="Object Info";if(_.type==="planet"||_.type==="moon"?x=_.data.name:_.type==="sun"?x="Sun":_.type==="star"?x=_.data.name||`HD ${_.data.id}`:_.type==="asterism"&&(x=_.data.id),a&&a.header){const M=a.header.querySelector(".window-title");M&&(M.textContent=x)}}}else o.style.display="none",D.objectInfoMode,document.body.style.cursor="default"})}function wS(i,t,e){if(i.userData&&i.userData.type==="asterism")return{type:"asterism",data:i.userData};if(i===e||i.parent===e)return{type:"sun",data:{}};for(const n of t){if(n.mesh===i||n.mesh===i.parent)return{type:"planet",data:n.data,worldPos:n.mesh.position};if(n.moons){for(const s of n.moons)if(s.mesh===i||s.mesh===i.parent)return{type:"moon",data:s.data,parentName:n.data.name}}}return null}function Fo(i,t,e=null){let n='<div class="tooltip-container">';return n+=`<div class="tooltip-header">${i}</div>`,n+='<div class="tooltip-content">',t.length>0&&t.forEach(s=>{n+=`
        <div class="tooltip-row">
          <span class="tooltip-label">${s.label}</span>
          <span class="tooltip-value">${s.value}</span>
        </div>`}),e&&(n+=e),n+="</div></div>",n}function ES(i){if(!i.body||!z||!z[i.body])return null;try{const t=D.date instanceof Date?D.date:new Date;if(Number.isNaN(t.getTime()))return{trueAnomaly:"Invalid Date",velocity:"---",distanceAU:"---",lightTime:"---"};const e=z[i.body],n=de(e,t),s=on(e,t,!0),r=1/(24*60),o=new Date(t.getTime()-6e4),a=new Date(t.getTime()+6e4),c=de(e,o),l=de(e,a),u=(l.x-c.x)/(2*r),h=(l.y-c.y)/(2*r),d=(l.z-c.z)/(2*r),m=(Math.sqrt(u**2+h**2+d**2)*1495978707e-1/86400).toFixed(2),_=Math.sqrt(s.x**2+s.y**2+s.z**2),g=(_*499.00478/60).toFixed(2),p=new E(n.x,n.y,n.z),y=new E(u,h,d),v=new E().crossVectors(p,y),x=.0002959122082855911,M=new E().crossVectors(y,v),S=p.length(),T=M.clone().divideScalar(x),I=p.clone().divideScalar(S),b=T.sub(I),w=b.length();let O=0;if(w>1e-6){const $=b.dot(p)/(w*S),R=Math.max(-1,Math.min(1,$));O=Math.acos(R)*180/Math.PI,p.dot(y)<0&&(O=360-O)}else O=0;return{trueAnomaly:O.toFixed(1),velocity:m,distanceAU:_.toFixed(3),lightTime:g}}catch(t){return Bt.warn(`Error calculating live data for ${i.name}`,t),null}}function TS(){try{const i=D.date instanceof Date?D.date:new Date,t=on(z.Sun,i,!0),e=Math.sqrt(t.x**2+t.y**2+t.z**2),n=(e*499.00478/60).toFixed(2);return{distanceAU:e.toFixed(3),lightTime:n}}catch(i){return Bt.warn("Error calculating live data for Sun",i),null}}function Vm(i){let t='<div class="tooltip-live-section"><span class="tooltip-live-title">Live Data</span>';return i.trueAnomaly&&(t+=`<div class="tooltip-row"><span class="tooltip-label">True Anomaly</span><span class="tooltip-value">${i.trueAnomaly}°</span></div>`),i.velocity&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Helio Velocity</span><span class="tooltip-value">${i.velocity} km/s</span></div>`),i.distanceAU&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Dist to Earth</span><span class="tooltip-value">${i.distanceAU} AU</span></div>`),i.lightTime&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Light Time</span><span class="tooltip-value">${i.lightTime} min</span></div>`),t+="</div>",t}function AS(){const i=_S.fields,t=TS(),e=t?Vm(t):null;return Fo("Sun",i,e)}function CS(i){let t="Planet";i.type==="dwarf"?t="Dwarf Planet":i.category&&(t=`Planet (${i.category})`);const e=[{label:"Type",value:t}],n=i.radius*6371;let s=`${ro(n)} km`;i.name!=="Earth"&&(s+=` (${ro(i.radius)} x Earth)`);let r=i.details.mass;if(typeof i.details.mass=="number"){const l=i.details.mass/597e22;if(r=`${gu(i.details.mass)} kg`,i.name!=="Earth"){let h=`${ro(l)} x Earth`;l<.01&&(h=`${gu(l)} x Earth`),r+=` (${h})`}}i.details&&(e.push({label:"Year",value:`${ro(i.period)} days`},{label:"Radius",value:s},{label:"Mass",value:r},{label:"Density",value:i.details.density},{label:"Surface Gravity",value:Hm(i.details.gravity)},{label:"Albedo",value:i.details.albedo},{label:"Surface Temp",value:i.details.temp}),e.push({label:"Surface Pressure",value:i.details.pressure}),e.push({label:"Solar Day",value:i.details.solarDay},{label:"Sidereal Day",value:i.details.siderealDay},{label:"Axial Tilt",value:`${i.axialTilt}°`},{label:"Eccentricity",value:i.details.eccentricity},{label:"Inclination",value:i.details.inclination}));const o=ES(i),a=o?Vm(o):null;return Fo(i.name,e,a)}function PS(i,t){const e=[{label:"Type",value:"Moon"},{label:"Orbiting",value:t||"Unknown"}];if(i.diameter&&e.push({label:"Diameter",value:`${ro(i.diameter)} km`}),i.mass){const n=gu(i.mass);e.push({label:"Mass",value:`${n} kg`})}return i.gravity&&e.push({label:"Surface Gravity",value:Hm(i.gravity)}),i.meanTemp&&e.push({label:"Mean Temp",value:`${i.meanTemp} K`}),e.push({label:"Orbital Period",value:`${i.period.toFixed(2)} days`}),i.discoveryYear&&e.push({label:"Discovered",value:`${i.discoveryYear} (${i.discoveredBy})`}),Fo(i.name,e)}function RS(i){const t=i.distance?(i.distance*3.26156).toLocaleString("en-US",{maximumFractionDigits:1}):"N/A",e=i.luminosity?i.luminosity.toLocaleString("en-US",{maximumFractionDigits:2}):"N/A";let n=i.name;n||(i.hd?n=`HD ${i.hd}`:i.hip?n=`HIP ${i.hip}`:n=`HR ${i.id}`);const s=i.spectralType||"Unknown",r=[{label:"Distance",value:`${t} LY`},{label:"Type",value:s},{label:"Luminosity",value:`${e} L☉`}];if(i.constellation){const o=Bm[i.constellation]||i.constellation;r.push({label:"Constellation",value:`${o} (${i.constellation})`})}if(i.temperature&&r.push({label:"Temp",value:`${Math.round(i.temperature).toLocaleString("en-US")} K`}),i.mass&&r.push({label:"Mass",value:`${i.mass.toLocaleString("en-US",{maximimumFractionDigits:2})} M☉`}),i.radius&&r.push({label:"Radius",value:`${i.radius.toLocaleString("en-US",{maximimumFractionDigits:2})} R☉`}),i.mag!==void 0)r.push({label:"Apparent Mag",value:i.mag.toFixed(2)});else if(i.luminosity&&i.distance){const a=4.83-2.5*Math.log10(i.luminosity)+5*(Math.log10(i.distance)-1);r.push({label:"Apparent Mag (Est)",value:a.toFixed(2)})}return i.hip&&r.push({label:"Hipparcos ID",value:i.hip}),i.hd&&r.push({label:"HD ID",value:i.hd}),!i.hip&&!i.hd&&r.push({label:"Catalog ID",value:i.id}),Fo(n,r)}function Z0(i){const t=i.id,n=Bm[t]||t,s=[{label:"Code",value:t},{label:"Full Name",value:n}];return i.type==="constellation"?s.push({label:"Type",value:"Constellation Boundary"}):s.push({label:"Type",value:"Asterism"}),Fo(n,s)}function LS(i){try{const t=i.data;switch(i.type){case"sun":return AS();case"planet":return CS(t);case"moon":return PS(t,i.parentName);case"star":return RS(t);case"constellation":return Z0(t);case"asterism":return Z0(t);default:return""}}catch(t){return Bt.error("Error formatting tooltip:",t),"Error loading data"}}const DS=[{name:"Aries",index:0},{name:"Taurus",index:1},{name:"Gemini",index:2},{name:"Cancer",index:3},{name:"Leo",index:4},{name:"Virgo",index:5},{name:"Libra",index:6},{name:"Scorpio",index:7},{name:"Sagittarius",index:8},{name:"Capricorn",index:9},{name:"Aquarius",index:10},{name:"Pisces",index:11}],Wm=["Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc"];function IS(i,t){const e=new Se;e.visible=D.showZodiacSigns||!1,i.add(e);const n="/assets/zodiac_signs_sheet.png";return Bt.log("ZodiacSigns: Loading texture from",n),t.load(n,s=>{Bt.log("ZodiacSigns: Texture loaded successfully"),s.colorSpace=be;const r=5e3;DS.forEach((o,a)=>{const c=s.clone();c.needsUpdate=!0;const l=a%4,u=2-Math.floor(a/4);c.repeat.set(.25,.333),c.offset.set(l*.25,u*.333);const h=new Nu({map:c,transparent:!0,opacity:.8,color:16777215,depthWrite:!1,blending:Ai}),d=new Kf(h);d.scale.set(r,r,1),d.visible=!1,d.userData={zodiacIndex:a,zodiacId:Wm[a]},e.add(d)})},void 0,s=>{Bt.error("ZodiacSigns: Error loading texture",s)}),e}async function NS(i){if(!i)return;const t=ke*100,e=t*.08,n=23.44*Math.PI/180,s=0;i.children.forEach((r,o)=>{if(!r.isSprite)return;const a=s+o*Math.PI/6+Math.PI/12,c=t*Math.cos(a),l=t*Math.sin(a),u=0,h=c,d=l*Math.cos(n)-u*Math.sin(n),f=l*Math.sin(n)+u*Math.cos(n);r.position.set(h,f,-d),r.scale.set(e,e,1),r.visible=!0}),Bt.log("ZodiacSigns: Aligned signs in perfect circle on ecliptic")}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class oi{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),oi.nextNameID=oi.nextNameID||0,this.$name.id=`lil-gui-name-${++oi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class OS extends oi{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function _u(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const FS={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:_u,toHexString:_u},wo={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},US={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=wo.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return wo.toHexString(s)}},zS={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=wo.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return wo.toHexString(s)}},kS=[FS,wo,US,zS];function BS(i){return kS.find(t=>t.match(i))}class GS extends oi{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=BS(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=_u(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Pl extends oi{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class HS extends oi{constructor(t,e,n,s,r,o){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},n=y=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+y),this.$input.value=this.getValue())},s=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),n(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),n(this._step*this._arrowKeyMultiplier(y)*-1))},r=y=>{this._inputFocused&&(y.preventDefault(),n(this._step*this._normalizeMouseWheel(y)))};let o=!1,a,c,l,u,h;const d=5,f=y=>{a=y.clientX,c=l=y.clientY,o=!0,u=this.getValue(),h=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=y=>{if(o){const v=y.clientX-a,x=y.clientY-c;Math.abs(x)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>d&&_()}if(!o){const v=y.clientY-l;h-=v*this._step*this._arrowKeyMultiplier(y),u+h>this._max?h=this._max-u:u+h<this._min&&(h=this._min-u),this._snapClampSetValue(u+h)}l=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,v,x,M)=>(p-y)/(v-y)*(M-x)+x,e=p=>{const y=this.$slider.getBoundingClientRect();let v=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(v)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=p=>{e(p.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},u=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",h,{passive:!1}),window.addEventListener("touchend",d))},h=p=>{if(o){const y=p.touches[0].clientX-a,v=p.touches[0].clientY-c;Math.abs(y)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",h),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",h),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,m)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",u,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class VS extends oi{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class WS extends oi{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const XS=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function jS(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let J0=!1;class yh{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!J0&&a&&(jS(XS),J0=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new VS(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new HS(this,t,e,n,s,r);case"boolean":return new OS(this,t,e);case"string":return new WS(this,t,e);case"function":return new Pl(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new GS(this,t,e,n)}addFolder(t){const e=new yh({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Pl||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Pl)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function $S(i){const t=i.addFolder("About"),e=document.createElement("div");e.style.padding="15px",e.style.textAlign="center",e.innerHTML=`
        <img src="./assets/images/WhiteRabbit.png" style="max-width: 100%; margin-bottom: 10px; border-radius: 4px;">
        <br>
        <a href="https://github.com/IraGraves/white-rabbit" target="_blank" style="color: #88ccff; text-decoration: none;">GitHub Repository</a>
    `,t.domElement.querySelector(".children").appendChild(e),t.close()}function qS(i){const t=i.addFolder("Credit"),e=`
    <div style="padding: 20px; color: #eee; line-height: 1.6; font-size: 14px;">
      <h2 style="margin-top: 0; color: #fff;">Third-Party Content Notices</h2>
      <p>This project includes textures, models, and data from various sources.</p>
      
      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Textures</h3>
      <h4 style="color: #ddd;">Celestia Content</h4>
      <p>The following attributions apply to textures used in this application, sourced from the <a href="https://github.com/CelestiaProject/CelestiaContent" target="_blank" style="color: #88ccff;">Celestia Content Repository</a>.</p>
      
      <h5 style="color: #ccc; margin-bottom: 5px;">Moon Textures</h5>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Phobos & Deimos</strong>: Models and textures are from Ernst et al. 2023 (<a href="https://doi.org/10.1186/s40623-023-01814-7" target="_blank" style="color: #88ccff;">doi.org...</a>).</li>
        <li><strong>Mimas, Enceladus, Tethys, Dione, Rhea, Iapetus</strong>: Textures derived from enhanced color maps by Paul Schenk (NASA).</li>
        <li><strong>Phoebe</strong>: Derived from John Van Vliet (JVV).</li>
        <li><strong>Ariel, Umbriel, Titania, Oberon</strong>: Created by Ivan Rivera from JPL data.</li>
        <li><strong>Triton</strong>: Based on Voyager 2 imagery.</li>
        <li><strong>Proteus, Larissa</strong>: Based on Phil Stooke's maps.</li>
        <li><strong>Amalthea</strong>: Shaded relief by Phil Stooke, colored by Wm. Robert Johnston.</li>
      </ul>
      
      <h5 style="color: #ccc; margin-bottom: 5px;">Planetary Textures</h5>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Earth</strong>: Derived from <a href="https://www.earthstartsbeating.com/2019/01/16/mappamondo/" target="_blank" style="color: #88ccff;">Earth Starts Beating</a> and improved by Tom Patterson.</li>
        <li><strong>Titan</strong>: Composite of Cassini ISS and Radar maps from USGS, created by FarGetaNik and modified by Askaniy.</li>
      </ul>
      
      <p>For full license details, see the <a href="https://github.com/CelestiaProject/CelestiaContent/blob/master/README" target="_blank" style="color: #88ccff;">Celestia Content README</a>.</p>

      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Models</h3>
      
      <h4 style="color: #ddd;">NASA Probe Models</h4>
      <p>Sourced from NASA, public domain:</p>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Cassini</li>
        <li>Galileo</li>
        <li>IBEX</li>
        <li>Parker Solar Probe</li>
        <li>Pioneer 10</li>
        <li>Ulysses</li>
        <li>Voyager</li>
      </ul>

      <h4 style="color: #ddd;">Third-Party Models</h4>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Tesla Roadster</strong>: <a href="https://skfb.ly/6ZzXy" target="_blank" style="color: #88ccff;">"Tesla Roadster 2020"</a> by metarex.4d is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" style="color: #88ccff;">CC BY 4.0</a>.</li>
      </ul>

      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Fonts</h3>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Outfit</strong>: SIL Open Font License 1.1.</li>
        <li><strong>Space Mono</strong>: SIL Open Font License 1.1.</li>
      </ul>
      <p>See <code>public/fonts/OFL.txt</code>.</p>
    </div>
  `,n=ve.createWindow("credits-window","Credits / Notices",{width:"500px",height:"600px",x:100,y:100,onClose:()=>{}});n.content.style.overflowY="auto",n.content.innerHTML=e,ve.hideWindow("credits-window");const s={showCredits:()=>{ve.toggleWindow("credits-window")}};t.add(s,"showCredits").name("Show Notices"),t.close()}const YS=[{type:"Total",date:new Date("2020-12-14T16:00:00Z")},{type:"Total",date:new Date("2021-12-04T07:00:00Z")},{type:"Total",date:new Date("2023-04-20T04:00:00Z")},{type:"Total",date:new Date("2024-04-08T18:00:00Z")},{type:"Total",date:new Date("2026-08-12T17:00:00Z")},{type:"Total",date:new Date("2027-08-02T10:00:00Z")},{type:"Total",date:new Date("2028-07-22T02:00:00Z")},{type:"Total",date:new Date("2030-11-25T06:00:00Z")},{type:"Annular",date:new Date("2020-06-21T06:00:00Z")},{type:"Annular",date:new Date("2021-06-10T10:00:00Z")},{type:"Annular",date:new Date("2023-10-14T18:00:00Z")},{type:"Annular",date:new Date("2024-10-02T18:00:00Z")},{type:"Annular",date:new Date("2026-02-17T12:00:00Z")},{type:"Annular",date:new Date("2027-02-06T16:00:00Z")},{type:"Annular",date:new Date("2028-01-26T15:00:00Z")},{type:"Annular",date:new Date("2030-06-01T06:00:00Z")}];function KS(i,t,e,n){var s;D.date=new Date(i.date),D.simulationSpeed=1,(s=window.uiState)!=null&&s.updateSpeedometer&&window.uiState.updateSpeedometer(),setTimeout(()=>{const r=n.find(o=>o.data.name==="Earth");if(!r){Bt.error("Earth not found");return}ps({...r,type:"planet"},t,e,.75),Bt.log(`Navigating to event: ${i.type} - ${i.date.toISOString()}`)},100)}function Ca(i){const t=i.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`${i.type} - ${t}`}function ZS(i,t,e,n,s){const r={selectedEvent:null},o=document.createElement("div");o.className="events-container",o.innerHTML=`
        <div class="events-input-wrapper">
            <label for="events-search">Solar Eclipse</label>
            <input type="text" id="events-search" placeholder="Search..." autocomplete="off">
        </div>
        <div class="events-actions">
            <button id="btn-go-to-event" disabled>Go To</button>
        </div>
        <div id="events-status"></div>
    `,i.appendChild(o);let a=document.getElementById("events-results-dropdown");a||(a=document.createElement("div"),a.id="events-results-dropdown",a.className="events-results",document.body.appendChild(a));const c=o.querySelector("#events-search"),l=o.querySelector("#btn-go-to-event"),u=o.querySelector("#events-status");function h(){const f=c.getBoundingClientRect();a.style.top=`${f.bottom+5}px`,a.style.left=`${f.left}px`,a.style.width=`${f.width}px`}c.addEventListener("input",f=>{const m=f.target.value.toLowerCase();if(m.length<1){a.style.display="none";return}const _=[];YS.forEach(g=>{Ca(g).toLowerCase().includes(m)&&_.push(g)}),_.sort((g,p)=>g.date-p.date),a.innerHTML="",_.length>0?(h(),a.style.display="block",_.forEach(g=>{const p=document.createElement("div");p.className="events-result-item";const y=g.type.includes("Total")?"total-eclipse":"annular-eclipse";p.innerHTML=`<span class="event-type ${y}">${g.type}</span><span class="event-date">${g.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span>`,p.onclick=()=>{d(g),a.style.display="none"},a.appendChild(p)})):a.style.display="none"}),window.addEventListener("resize",()=>{a.style.display==="block"&&h()}),i.addEventListener("scroll",()=>{a.style.display==="block"&&h()},!0);function d(f){r.selectedEvent=f,c.value=Ca(f),l.disabled=!1,u.textContent=`Selected: ${Ca(f)}`}l.onclick=()=>{r.selectedEvent&&t&&e&&(KS(r.selectedEvent,t,e,n),u.textContent=`Navigating to ${Ca(r.selectedEvent)}...`)}}function JS(i,t,e,n,s,r){const o={selectedObject:null},a=document.createElement("div");a.className="find-container",a.innerHTML=`
        <div class="find-input-wrapper">
            <label for="find-search">Search</label>
            <input type="text" id="find-search" placeholder="Planets, stars..." autocomplete="off">
        </div>
        <div class="find-actions">
            <button id="btn-look-at" disabled>Look At</button>
            <button id="btn-go-to" disabled>Go To</button>
        </div>
    `,i.appendChild(a);let c=document.getElementById("find-results-dropdown");c||(c=document.createElement("div"),c.id="find-results-dropdown",c.className="find-results",document.body.appendChild(c));const l=a.querySelector("#find-search"),u=a.querySelector("#btn-look-at"),h=a.querySelector("#btn-go-to");function d(){if(!l||!c)return;const m=l.getBoundingClientRect();c.style.top=`${m.bottom+5}px`,c.style.left=`${m.left}px`,c.style.width=`${m.width}px`}l.addEventListener("input",m=>{var p;l.classList.remove("valid-selection"),o.selectedObject=null,u.disabled=!0,h.disabled=!0;const _=m.target.value.toLowerCase();if(_.length<2){c&&(c.style.display="none");return}const g=[];if("sun".includes(_)&&e.visible&&g.push({name:"Sun",type:"Star",object:{mesh:e,data:{name:"Sun",radius:5},type:"sun"}}),t.forEach(y=>{y.data.name.toLowerCase().includes(_)&&y.mesh.visible&&g.push({name:y.data.name,type:y.data.type==="dwarf"?"Dwarf Planet":"Planet",object:{mesh:y.mesh,data:y.data,type:"planet"}}),y.moons&&y.moons.forEach(v=>{v.data.name.toLowerCase().includes(_)&&v.mesh.visible&&g.push({name:v.data.name,type:"Moon",object:{mesh:v.mesh,data:v.data,type:"moon"}})})}),(p=n.value)!=null&&p.userData.starData){const y=n.value.userData.starData;let v=0;for(let x=0;x<y.length&&v<20;x++){const M=y[x],S=M.name||"",T=M.bayer||"",I=M.flamsteed?M.flamsteed.toString():"",b=M.hip?`hip ${M.hip}`:"",w=M.hd?`hd ${M.hd}`:"";let O=!1;if((S!=null&&S.toLowerCase().includes(_)||b.includes(_)||w.includes(_)||T.toLowerCase().includes(_)||I&&_.includes(I)||M.hip===_||M.hd===_)&&(O=!0),O){const G=M.x*ke,$=M.z*ke,R=-M.y*ke,F=new Oe;F.position.set(G,$,R),g.push({name:S||T||`HD ${M.hd}`||`HIP ${M.hip}`,type:"Star",object:{mesh:F,data:{name:S||T||"Star",radius:M.radius||1},type:"star"}}),v++}}}c.innerHTML="",g.length>0?(d(),c.style.display="block",g.slice(0,10).forEach(y=>{const v=document.createElement("div");v.className="find-result-item",v.innerHTML=`<strong>${y.name}</strong> <span style="opacity:0.7; font-size:0.8em">(${y.type})</span>`,v.onclick=()=>{f(y),c.style.display="none"},c.appendChild(v)})):c.style.display="none"}),window.addEventListener("resize",()=>{c.style.display==="block"&&d()}),i.addEventListener("scroll",()=>{c.style.display==="block"&&d()},!0);function f(m){o.selectedObject=m.object,l.value=m.name,l.classList.add("valid-selection"),u.disabled=!1,h.disabled=!1}u.onclick=()=>{o.selectedObject&&s&&r&&Ei(()=>Promise.resolve().then(()=>fu),void 0).then(m=>{m.isFocusModeActive()&&m.exitFocusMode(r);const _=o.selectedObject,g=new E;if(_&&_.mesh&&(_.mesh.getWorldPosition?_.mesh.getWorldPosition(g):g.copy(_.mesh.position)),r.setVirtualTarget){const p=r.localToWorld(g);r.setVirtualTarget(p),r.update()}else r.target.copy(g),s.lookAt(g),r.update()})},h.onclick=()=>{o.selectedObject&&s&&r&&Ei(()=>Promise.resolve().then(()=>fu),void 0).then(m=>{m.focusOnObject(o.selectedObject,s,r)})}}const Q0={type:"change"},Rl={type:"start"},tf={type:"end"},Pa=new Nr,ef=new Bi,QS=Math.cos(70*fe.DEG2RAD);class tw extends Ji{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new E,this.cursor=new E,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Cs.ROTATE,MIDDLE:Cs.DOLLY,RIGHT:Cs.PAN},this.touches={ONE:Ps.ROTATE,TWO:Ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",kt),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",kt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Q0),n.update(),r=s.NONE},this.update=function(){const L=new E,ut=new qn().setFromUnitVectors(t.up,new E(0,1,0)),Lt=ut.clone().invert(),Et=new E,ot=new qn,N=new E,dt=2*Math.PI;return function(Gt=null){const Ut=n.object.position;L.copy(Ut).sub(n.target),L.applyQuaternion(ut),a.setFromVector3(L),n.autoRotate&&r===s.NONE&&G(w(Gt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let ee=n.minAzimuthAngle,ne=n.maxAzimuthAngle;isFinite(ee)&&isFinite(ne)&&(ee<-Math.PI?ee+=dt:ee>Math.PI&&(ee-=dt),ne<-Math.PI?ne+=dt:ne>Math.PI&&(ne-=dt),ee<=ne?a.theta=Math.max(ee,Math.min(ne,a.theta)):a.theta=a.theta>(ee+ne)/2?Math.max(ee,a.theta):Math.min(ne,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&S||n.object.isOrthographicCamera?a.radius=X(a.radius):a.radius=X(a.radius*l),L.setFromSpherical(a),L.applyQuaternion(Lt),Ut.copy(n.target).add(L),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),u.set(0,0,0));let Le=!1;if(n.zoomToCursor&&S){let Ie=null;if(n.object.isPerspectiveCamera){const oe=L.length();Ie=X(oe*l);const Fe=oe-Ie;n.object.position.addScaledVector(x,Fe),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const oe=new E(M.x,M.y,0);oe.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Le=!0;const Fe=new E(M.x,M.y,0);Fe.unproject(n.object),n.object.position.sub(Fe).add(oe),n.object.updateMatrixWorld(),Ie=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Ie!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Ie).add(n.object.position):(Pa.origin.copy(n.object.position),Pa.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Pa.direction))<QS?t.lookAt(n.target):(ef.setFromNormalAndCoplanarPoint(n.object.up,n.target),Pa.intersectPlane(ef,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Le=!0);return l=1,S=!1,Le||Et.distanceToSquared(n.object.position)>o||8*(1-ot.dot(n.object.quaternion))>o||N.distanceToSquared(n.target)>0?(n.dispatchEvent(Q0),Et.copy(n.object.position),ot.copy(n.object.quaternion),N.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",le),n.domElement.removeEventListener("pointerdown",P),n.domElement.removeEventListener("pointercancel",q),n.domElement.removeEventListener("wheel",ct),n.domElement.removeEventListener("pointermove",A),n.domElement.removeEventListener("pointerup",q),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",kt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new v0,c=new v0;let l=1;const u=new E,h=new ht,d=new ht,f=new ht,m=new ht,_=new ht,g=new ht,p=new ht,y=new ht,v=new ht,x=new E,M=new ht;let S=!1;const T=[],I={};let b=!1;function w(L){return L!==null?2*Math.PI/60*n.autoRotateSpeed*L:2*Math.PI/60/60*n.autoRotateSpeed}function O(L){const ut=Math.abs(L*.01);return Math.pow(.95,n.zoomSpeed*ut)}function G(L){c.theta-=L}function $(L){c.phi-=L}const R=function(){const L=new E;return function(Lt,Et){L.setFromMatrixColumn(Et,0),L.multiplyScalar(-Lt),u.add(L)}}(),F=function(){const L=new E;return function(Lt,Et){n.screenSpacePanning===!0?L.setFromMatrixColumn(Et,1):(L.setFromMatrixColumn(Et,0),L.crossVectors(n.object.up,L)),L.multiplyScalar(Lt),u.add(L)}}(),H=function(){const L=new E;return function(Lt,Et){const ot=n.domElement;if(n.object.isPerspectiveCamera){const N=n.object.position;L.copy(N).sub(n.target);let dt=L.length();dt*=Math.tan(n.object.fov/2*Math.PI/180),R(2*Lt*dt/ot.clientHeight,n.object.matrix),F(2*Et*dt/ot.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(R(Lt*(n.object.right-n.object.left)/n.object.zoom/ot.clientWidth,n.object.matrix),F(Et*(n.object.top-n.object.bottom)/n.object.zoom/ot.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function U(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function B(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(L,ut){if(!n.zoomToCursor)return;S=!0;const Lt=n.domElement.getBoundingClientRect(),Et=L-Lt.left,ot=ut-Lt.top,N=Lt.width,dt=Lt.height;M.x=Et/N*2-1,M.y=-(ot/dt)*2+1,x.set(M.x,M.y,1).unproject(n.object).sub(n.object.position).normalize()}function X(L){return Math.max(n.minDistance,Math.min(n.maxDistance,L))}function tt(L){h.set(L.clientX,L.clientY)}function et(L){Y(L.clientX,L.clientX),p.set(L.clientX,L.clientY)}function j(L){m.set(L.clientX,L.clientY)}function Q(L){d.set(L.clientX,L.clientY),f.subVectors(d,h).multiplyScalar(n.rotateSpeed);const ut=n.domElement;G(2*Math.PI*f.x/ut.clientHeight),$(2*Math.PI*f.y/ut.clientHeight),h.copy(d),n.update()}function st(L){y.set(L.clientX,L.clientY),v.subVectors(y,p),v.y>0?U(O(v.y)):v.y<0&&B(O(v.y)),p.copy(y),n.update()}function yt(L){_.set(L.clientX,L.clientY),g.subVectors(_,m).multiplyScalar(n.panSpeed),H(g.x,g.y),m.copy(_),n.update()}function Mt(L){Y(L.clientX,L.clientY),L.deltaY<0?B(O(L.deltaY)):L.deltaY>0&&U(O(L.deltaY)),n.update()}function Nt(L){let ut=!1;switch(L.code){case n.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?$(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,n.keyPanSpeed),ut=!0;break;case n.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?$(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,-n.keyPanSpeed),ut=!0;break;case n.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(n.keyPanSpeed,0),ut=!0;break;case n.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(-n.keyPanSpeed,0),ut=!0;break}ut&&(L.preventDefault(),n.update())}function W(L){if(T.length===1)h.set(L.pageX,L.pageY);else{const ut=St(L),Lt=.5*(L.pageX+ut.x),Et=.5*(L.pageY+ut.y);h.set(Lt,Et)}}function mt(L){if(T.length===1)m.set(L.pageX,L.pageY);else{const ut=St(L),Lt=.5*(L.pageX+ut.x),Et=.5*(L.pageY+ut.y);m.set(Lt,Et)}}function Vt(L){const ut=St(L),Lt=L.pageX-ut.x,Et=L.pageY-ut.y,ot=Math.sqrt(Lt*Lt+Et*Et);p.set(0,ot)}function k(L){n.enableZoom&&Vt(L),n.enablePan&&mt(L)}function Ft(L){n.enableZoom&&Vt(L),n.enableRotate&&W(L)}function pt(L){if(T.length==1)d.set(L.pageX,L.pageY);else{const Lt=St(L),Et=.5*(L.pageX+Lt.x),ot=.5*(L.pageY+Lt.y);d.set(Et,ot)}f.subVectors(d,h).multiplyScalar(n.rotateSpeed);const ut=n.domElement;G(2*Math.PI*f.x/ut.clientHeight),$(2*Math.PI*f.y/ut.clientHeight),h.copy(d)}function bt(L){if(T.length===1)_.set(L.pageX,L.pageY);else{const ut=St(L),Lt=.5*(L.pageX+ut.x),Et=.5*(L.pageY+ut.y);_.set(Lt,Et)}g.subVectors(_,m).multiplyScalar(n.panSpeed),H(g.x,g.y),m.copy(_)}function gt(L){const ut=St(L),Lt=L.pageX-ut.x,Et=L.pageY-ut.y,ot=Math.sqrt(Lt*Lt+Et*Et);y.set(0,ot),v.set(0,Math.pow(y.y/p.y,n.zoomSpeed)),U(v.y),p.copy(y);const N=(L.pageX+ut.x)*.5,dt=(L.pageY+ut.y)*.5;Y(N,dt)}function re(L){n.enableZoom&&gt(L),n.enablePan&&bt(L)}function zt(L){n.enableZoom&&gt(L),n.enableRotate&&pt(L)}function P(L){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(L.pointerId),n.domElement.addEventListener("pointermove",A),n.domElement.addEventListener("pointerup",q)),Zt(L),L.pointerType==="touch"?qt(L):at(L))}function A(L){n.enabled!==!1&&(L.pointerType==="touch"?it(L):rt(L))}function q(L){Wt(L),T.length===0&&(n.domElement.releasePointerCapture(L.pointerId),n.domElement.removeEventListener("pointermove",A),n.domElement.removeEventListener("pointerup",q)),n.dispatchEvent(tf),r=s.NONE}function at(L){let ut;switch(L.button){case 0:ut=n.mouseButtons.LEFT;break;case 1:ut=n.mouseButtons.MIDDLE;break;case 2:ut=n.mouseButtons.RIGHT;break;default:ut=-1}switch(ut){case Cs.DOLLY:if(n.enableZoom===!1)return;et(L),r=s.DOLLY;break;case Cs.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enablePan===!1)return;j(L),r=s.PAN}else{if(n.enableRotate===!1)return;tt(L),r=s.ROTATE}break;case Cs.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enableRotate===!1)return;tt(L),r=s.ROTATE}else{if(n.enablePan===!1)return;j(L),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Rl)}function rt(L){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Q(L);break;case s.DOLLY:if(n.enableZoom===!1)return;st(L);break;case s.PAN:if(n.enablePan===!1)return;yt(L);break}}function ct(L){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(L.preventDefault(),n.dispatchEvent(Rl),Mt(Ct(L)),n.dispatchEvent(tf))}function Ct(L){const ut=L.deltaMode,Lt={clientX:L.clientX,clientY:L.clientY,deltaY:L.deltaY};switch(ut){case 1:Lt.deltaY*=16;break;case 2:Lt.deltaY*=100;break}return L.ctrlKey&&!b&&(Lt.deltaY*=10),Lt}function xt(L){L.key==="Control"&&(b=!0,document.addEventListener("keyup",Tt,{passive:!0,capture:!0}))}function Tt(L){L.key==="Control"&&(b=!1,document.removeEventListener("keyup",Tt,{passive:!0,capture:!0}))}function kt(L){n.enabled===!1||n.enablePan===!1||Nt(L)}function qt(L){switch(Ot(L),T.length){case 1:switch(n.touches.ONE){case Ps.ROTATE:if(n.enableRotate===!1)return;W(L),r=s.TOUCH_ROTATE;break;case Ps.PAN:if(n.enablePan===!1)return;mt(L),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Ps.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;k(L),r=s.TOUCH_DOLLY_PAN;break;case Ps.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ft(L),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Rl)}function it(L){switch(Ot(L),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;pt(L),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;bt(L),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;re(L),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;zt(L),n.update();break;default:r=s.NONE}}function le(L){n.enabled!==!1&&L.preventDefault()}function Zt(L){T.push(L.pointerId)}function Wt(L){delete I[L.pointerId];for(let ut=0;ut<T.length;ut++)if(T[ut]==L.pointerId){T.splice(ut,1);return}}function Ot(L){let ut=I[L.pointerId];ut===void 0&&(ut=new ht,I[L.pointerId]=ut),ut.set(L.pageX,L.pageY)}function St(L){const ut=L.pointerId===T[0]?T[1]:T[0];return I[ut]}n.domElement.addEventListener("contextmenu",le),n.domElement.addEventListener("pointerdown",P),n.domElement.addEventListener("pointercancel",q),n.domElement.addEventListener("wheel",ct,{passive:!1}),document.addEventListener("keydown",xt,{passive:!0,capture:!0}),this.update()}}const Ll=new WeakMap;class Xm extends As{constructor(t){super(t),this.decoderPath="",this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(t){return this.decoderPath=t,this}setDecoderConfig(t){return this.decoderConfig=t,this}setWorkerLimit(t){return this.workerLimit=t,this}load(t,e,n,s){const r=new ja(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(t,o=>{this.parse(o,e,s)},n,s)}parse(t,e,n=()=>{}){this.decodeDracoFile(t,e,null,null,be).catch(n)}decodeDracoFile(t,e,n,s,r=Ve,o=()=>{}){const a={attributeIDs:n||this.defaultAttributeIDs,attributeTypes:s||this.defaultAttributeTypes,useUniqueIDs:!!n,vertexColorSpace:r};return this.decodeGeometry(t,a).then(e).catch(o)}decodeGeometry(t,e){const n=JSON.stringify(e);if(Ll.has(t)){const c=Ll.get(t);if(c.key===n)return c.promise;if(t.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let s;const r=this.workerNextTaskID++,o=t.byteLength,a=this._getWorker(r,o).then(c=>(s=c,new Promise((l,u)=>{s._callbacks[r]={resolve:l,reject:u},s.postMessage({type:"decode",id:r,taskConfig:e,buffer:t},[t])}))).then(c=>this._createGeometry(c.geometry));return a.catch(()=>!0).then(()=>{s&&r&&this._releaseTask(s,r)}),Ll.set(t,{key:n,promise:a}),a}_createGeometry(t){const e=new ce;t.index&&e.setIndex(new Pe(t.index.array,1));for(let n=0;n<t.attributes.length;n++){const s=t.attributes[n],r=s.name,o=s.array,a=s.itemSize,c=new Pe(o,a);r==="color"&&(this._assignVertexColorSpace(c,s.vertexColorSpace),c.normalized=!(o instanceof Float32Array)),e.setAttribute(r,c)}return e}_assignVertexColorSpace(t,e){if(e!==be)return;const n=new At;for(let s=0,r=t.count;s<r;s++)n.fromBufferAttribute(t,s).convertSRGBToLinear(),t.setXYZ(s,n.r,n.g,n.b)}_loadLibrary(t,e){const n=new ja(this.manager);return n.setPath(this.decoderPath),n.setResponseType(e),n.setWithCredentials(this.withCredentials),new Promise((s,r)=>{n.load(t,s,void 0,r)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;const t=typeof WebAssembly!="object"||this.decoderConfig.type==="js",e=[];return t?e.push(this._loadLibrary("draco_decoder.js","text")):(e.push(this._loadLibrary("draco_wasm_wrapper.js","text")),e.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(e).then(n=>{const s=n[0];t||(this.decoderConfig.wasmBinary=n[1]);const r=ew.toString(),o=["/* draco decoder */",s,"","/* worker */",r.substring(r.indexOf("{")+1,r.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([o]))}),this.decoderPending}_getWorker(t,e){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){const s=new Worker(this.workerSourceURL);s._callbacks={},s._taskCosts={},s._taskLoad=0,s.postMessage({type:"init",decoderConfig:this.decoderConfig}),s.onmessage=function(r){const o=r.data;switch(o.type){case"decode":s._callbacks[o.id].resolve(o);break;case"error":s._callbacks[o.id].reject(o);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+o.type+'"')}},this.workerPool.push(s)}else this.workerPool.sort(function(s,r){return s._taskLoad>r._taskLoad?-1:1});const n=this.workerPool[this.workerPool.length-1];return n._taskCosts[t]=e,n._taskLoad+=e,n})}_releaseTask(t,e){t._taskLoad-=t._taskCosts[e],delete t._callbacks[e],delete t._taskCosts[e]}debug(){console.log("Task load: ",this.workerPool.map(t=>t._taskLoad))}dispose(){for(let t=0;t<this.workerPool.length;++t)this.workerPool[t].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}}function ew(){let i,t;onmessage=function(o){const a=o.data;switch(a.type){case"init":i=a.decoderConfig,t=new Promise(function(u){i.onModuleLoaded=function(h){u({draco:h})},DracoDecoderModule(i)});break;case"decode":const c=a.buffer,l=a.taskConfig;t.then(u=>{const h=u.draco,d=new h.Decoder;try{const f=e(h,d,new Int8Array(c),l),m=f.attributes.map(_=>_.array.buffer);f.index&&m.push(f.index.array.buffer),self.postMessage({type:"decode",id:a.id,geometry:f},m)}catch(f){console.error(f),self.postMessage({type:"error",id:a.id,error:f.message})}finally{h.destroy(d)}});break}};function e(o,a,c,l){const u=l.attributeIDs,h=l.attributeTypes;let d,f;const m=a.GetEncodedGeometryType(c);if(m===o.TRIANGULAR_MESH)d=new o.Mesh,f=a.DecodeArrayToMesh(c,c.byteLength,d);else if(m===o.POINT_CLOUD)d=new o.PointCloud,f=a.DecodeArrayToPointCloud(c,c.byteLength,d);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!f.ok()||d.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+f.error_msg());const _={index:null,attributes:[]};for(const g in u){const p=self[h[g]];let y,v;if(l.useUniqueIDs)v=u[g],y=a.GetAttributeByUniqueId(d,v);else{if(v=a.GetAttributeId(d,o[u[g]]),v===-1)continue;y=a.GetAttribute(d,v)}const x=s(o,a,d,g,p,y);g==="color"&&(x.vertexColorSpace=l.vertexColorSpace),_.attributes.push(x)}return m===o.TRIANGULAR_MESH&&(_.index=n(o,a,d)),o.destroy(d),_}function n(o,a,c){const u=c.num_faces()*3,h=u*4,d=o._malloc(h);a.GetTrianglesUInt32Array(c,h,d);const f=new Uint32Array(o.HEAPF32.buffer,d,u).slice();return o._free(d),{array:f,itemSize:1}}function s(o,a,c,l,u,h){const d=h.num_components(),m=c.num_points()*d,_=m*u.BYTES_PER_ELEMENT,g=r(o,u),p=o._malloc(_);a.GetAttributeDataArrayForAllPoints(c,h,g,_,p);const y=new u(o.HEAPF32.buffer,p,m).slice();return o._free(p),{name:l,array:y,itemSize:d}}function r(o,a){switch(a){case Float32Array:return o.DT_FLOAT32;case Int8Array:return o.DT_INT8;case Int16Array:return o.DT_INT16;case Int32Array:return o.DT_INT32;case Uint8Array:return o.DT_UINT8;case Uint16Array:return o.DT_UINT16;case Uint32Array:return o.DT_UINT32}}}const nw=Object.freeze(Object.defineProperty({__proto__:null,DRACOLoader:Xm},Symbol.toStringTag,{value:"Module"}));function nf(i,t){if(t===Wg)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(t===Bl||t===Pf){let e=i.getIndex();if(e===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);i.setIndex(o),e=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=e.count-2,s=[];if(t===Bl)for(let o=1;o<=n;o++)s.push(e.getX(0)),s.push(e.getX(o)),s.push(e.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(e.getX(o)),s.push(e.getX(o+1)),s.push(e.getX(o+2))):(s.push(e.getX(o+2)),s.push(e.getX(o+1)),s.push(e.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),i}class jm extends As{constructor(t){super(t),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new aw(e)}),this.register(function(e){return new gw(e)}),this.register(function(e){return new _w(e)}),this.register(function(e){return new yw(e)}),this.register(function(e){return new lw(e)}),this.register(function(e){return new uw(e)}),this.register(function(e){return new hw(e)}),this.register(function(e){return new dw(e)}),this.register(function(e){return new ow(e)}),this.register(function(e){return new fw(e)}),this.register(function(e){return new cw(e)}),this.register(function(e){return new mw(e)}),this.register(function(e){return new pw(e)}),this.register(function(e){return new sw(e)}),this.register(function(e){return new vw(e)}),this.register(function(e){return new xw(e)})}load(t,e,n,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=ho.extractUrlBase(t);o=ho.resolveURL(l,this.path)}else o=ho.extractUrlBase(t);this.manager.itemStart(t);const a=function(l){s?s(l):console.error(l),r.manager.itemError(t),r.manager.itemEnd(t)},c=new ja(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(t,function(l){try{r.parse(l,o,function(u){e(u),r.manager.itemEnd(t)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(t){return this.dracoLoader=t,this}setDDSLoader(){throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".')}setKTX2Loader(t){return this.ktx2Loader=t,this}setMeshoptDecoder(t){return this.meshoptDecoder=t,this}register(t){return this.pluginCallbacks.indexOf(t)===-1&&this.pluginCallbacks.push(t),this}unregister(t){return this.pluginCallbacks.indexOf(t)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t),1),this}parse(t,e,n,s){let r;const o={},a={},c=new TextDecoder;if(typeof t=="string")r=JSON.parse(t);else if(t instanceof ArrayBuffer)if(c.decode(new Uint8Array(t,0,4))===$m){try{o[ie.KHR_BINARY_GLTF]=new Mw(t)}catch(h){s&&s(h);return}r=JSON.parse(o[ie.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(t));else r=t;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Nw(r,{path:e||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(h){case ie.KHR_MATERIALS_UNLIT:o[h]=new rw;break;case ie.KHR_DRACO_MESH_COMPRESSION:o[h]=new bw(r,this.dracoLoader);break;case ie.KHR_TEXTURE_TRANSFORM:o[h]=new Sw;break;case ie.KHR_MESH_QUANTIZATION:o[h]=new ww;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(t,e){const n=this;return new Promise(function(s,r){n.parse(t,e,s,r)})}}function iw(){let i={};return{get:function(t){return i[t]},add:function(t,e){i[t]=e},remove:function(t){delete i[t]},removeAll:function(){i={}}}}const ie={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class sw{constructor(t){this.parser=t,this.name=ie.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const t=this.parser,e=this.parser.json.nodes||[];for(let n=0,s=e.length;n<s;n++){const r=e[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&t._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(t){const e=this.parser,n="light:"+t;let s=e.cache.get(n);if(s)return s;const r=e.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[t];let l;const u=new At(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],Ve);const h=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Da(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new rp(u),l.distance=h;break;case"spot":l=new sp(u),l.distance=h,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,Gi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=e.createUniqueName(c.name||"light_"+t),s=Promise.resolve(l),e.cache.add(n,s),s}getDependency(t,e){if(t==="light")return this._loadLight(e)}createNodeAttachment(t){const e=this,n=this.parser,r=n.json.nodes[t],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(e.cache,a,c)})}}class rw{constructor(){this.name=ie.KHR_MATERIALS_UNLIT}getMaterialType(){return ei}extendParams(t,e,n){const s=[];t.color=new At(1,1,1),t.opacity=1;const r=e.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;t.color.setRGB(o[0],o[1],o[2],Ve),t.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(t,"map",r.baseColorTexture,be))}return Promise.all(s)}}class ow{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(t,e){const s=this.parser.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(e.emissiveIntensity=r),Promise.resolve()}}class aw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_CLEARCOAT}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];if(o.clearcoatFactor!==void 0&&(e.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(e.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(e,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new ht(a,a)}return Promise.all(r)}}class cw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_IRIDESCENCE}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.iridescenceFactor!==void 0&&(e.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(e.iridescenceIOR=o.iridescenceIor),e.iridescenceThicknessRange===void 0&&(e.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(e.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(e.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(e,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}}class lw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_SHEEN}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[];e.sheenColor=new At(0,0,0),e.sheenRoughness=0,e.sheen=1;const o=s.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;e.sheenColor.setRGB(a[0],a[1],a[2],Ve)}return o.sheenRoughnessFactor!==void 0&&(e.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(e,"sheenColorMap",o.sheenColorTexture,be)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(e,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}}class uw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_TRANSMISSION}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.transmissionFactor!==void 0&&(e.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(e,"transmissionMap",o.transmissionTexture)),Promise.all(r)}}class hw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_VOLUME}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];e.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(e,"thicknessMap",o.thicknessTexture)),e.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return e.attenuationColor=new At().setRGB(a[0],a[1],a[2],Ve),Promise.all(r)}}class dw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_IOR}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const s=this.parser.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return e.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class fw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_SPECULAR}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];e.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(e,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return e.specularColor=new At().setRGB(a[0],a[1],a[2],Ve),o.specularColorTexture!==void 0&&r.push(n.assignTexture(e,"specularColorMap",o.specularColorTexture,be)),Promise.all(r)}}class pw{constructor(t){this.parser=t,this.name=ie.EXT_MATERIALS_BUMP}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return e.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(e,"bumpMap",o.bumpTexture)),Promise.all(r)}}class mw{constructor(t){this.parser=t,this.name=ie.KHR_MATERIALS_ANISOTROPY}getMaterialType(t){const n=this.parser.json.materials[t];return!n.extensions||!n.extensions[this.name]?null:Li}extendMaterialParams(t,e){const n=this.parser,s=n.json.materials[t];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.anisotropyStrength!==void 0&&(e.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(e.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(e,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}}class gw{constructor(t){this.parser=t,this.name=ie.KHR_TEXTURE_BASISU}loadTexture(t){const e=this.parser,n=e.json,s=n.textures[t];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=e.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return e.loadTextureImage(t,r.source,o)}}class _w{constructor(t){this.parser=t,this.name=ie.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(t){const e=this.name,n=this.parser,s=n.json,r=s.textures[t];if(!r.extensions||!r.extensions[e])return null;const o=r.extensions[e],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(s.extensionsRequired&&s.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){const e=new Image;e.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}}class yw{constructor(t){this.parser=t,this.name=ie.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(t){const e=this.name,n=this.parser,s=n.json,r=s.textures[t];if(!r.extensions||!r.extensions[e])return null;const o=r.extensions[e],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(t,o.source,c);if(s.extensionsRequired&&s.extensionsRequired.indexOf(e)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(t)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(t){const e=new Image;e.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",e.onload=e.onerror=function(){t(e.height===1)}})),this.isSupported}}class vw{constructor(t){this.name=ie.EXT_MESHOPT_COMPRESSION,this.parser=t}loadBufferView(t){const e=this.parser.json,n=e.bufferViews[t];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=s.byteOffset||0,l=s.byteLength||0,u=s.count,h=s.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,d,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(f),u,h,d,s.mode,s.filter),f})})}else return null}}class xw{constructor(t){this.name=ie.EXT_MESH_GPU_INSTANCING,this.parser=t}createNodeMesh(t){const e=this.parser.json,n=e.nodes[t];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=e.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==Pn.TRIANGLES&&l.mode!==Pn.TRIANGLE_STRIP&&l.mode!==Pn.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(t)),Promise.all(a).then(l=>{const u=l.pop(),h=u.isGroup?u.children:[u],d=l[0].count,f=[];for(const m of h){const _=new Pt,g=new E,p=new qn,y=new E(1,1,1),v=new wx(m.geometry,m.material,d);for(let x=0;x<d;x++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,x),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,x),c.SCALE&&y.fromBufferAttribute(c.SCALE,x),v.setMatrixAt(x,_.compose(g,p,y));for(const x in c)if(x==="_COLOR_0"){const M=c[x];v.instanceColor=new Xl(M.array,M.itemSize,M.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&m.geometry.setAttribute(x,c[x]);Ae.prototype.copy.call(v,m),this.parser.assignFinalMaterial(v),f.push(v)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const $m="glTF",eo=12,sf={JSON:1313821514,BIN:5130562};class Mw{constructor(t){this.name=ie.KHR_BINARY_GLTF,this.content=null,this.body=null;const e=new DataView(t,0,eo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(t.slice(0,4))),version:e.getUint32(4,!0),length:e.getUint32(8,!0)},this.header.magic!==$m)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-eo,r=new DataView(t,eo);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===sf.JSON){const l=new Uint8Array(t,eo+o,a);this.content=n.decode(l)}else if(c===sf.BIN){const l=eo+o;this.body=t.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class bw{constructor(t,e){if(!e)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ie.KHR_DRACO_MESH_COMPRESSION,this.json=t,this.dracoLoader=e,this.dracoLoader.preload()}decodePrimitive(t,e){const n=this.json,s=this.dracoLoader,r=t.extensions[this.name].bufferView,o=t.extensions[this.name].attributes,a={},c={},l={};for(const u in o){const h=yu[u]||u.toLowerCase();a[h]=o[u]}for(const u in t.attributes){const h=yu[u]||u.toLowerCase();if(o[u]!==void 0){const d=n.accessors[t.attributes[u]],f=fr[d.componentType];l[h]=f.name,c[h]=d.normalized===!0}}return e.getDependency("bufferView",r).then(function(u){return new Promise(function(h,d){s.decodeDracoFile(u,function(f){for(const m in f.attributes){const _=f.attributes[m],g=c[m];g!==void 0&&(_.normalized=g)}h(f)},a,l,Ve,d)})})}}class Sw{constructor(){this.name=ie.KHR_TEXTURE_TRANSFORM}extendTexture(t,e){return(e.texCoord===void 0||e.texCoord===t.channel)&&e.offset===void 0&&e.rotation===void 0&&e.scale===void 0||(t=t.clone(),e.texCoord!==void 0&&(t.channel=e.texCoord),e.offset!==void 0&&t.offset.fromArray(e.offset),e.rotation!==void 0&&(t.rotation=e.rotation),e.scale!==void 0&&t.repeat.fromArray(e.scale),t.needsUpdate=!0),t}}class ww{constructor(){this.name=ie.KHR_MESH_QUANTIZATION}}class qm extends To{constructor(t,e,n,s){super(t,e,n,s)}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s*3+s;for(let o=0;o!==s;o++)e[o]=n[r+o];return e}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-e,h=(n-e)/u,d=h*h,f=d*h,m=t*l,_=m-l,g=-2*f+3*d,p=f-d,y=1-g,v=p-d+h;for(let x=0;x!==a;x++){const M=o[_+x+a],S=o[_+x+c]*u,T=o[m+x+a],I=o[m+x]*u;r[x]=y*M+v*S+g*T+p*I}return r}}const Ew=new qn;class Tw extends qm{interpolate_(t,e,n,s){const r=super.interpolate_(t,e,n,s);return Ew.fromArray(r).normalize().toArray(r),r}}const Pn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},fr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},rf={9728:qe,9729:fn,9984:kl,9985:Mf,9986:Ra,9987:bs},of={33071:ln,33648:Ba,10497:Ms},Dl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},yu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ki={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Aw={CUBICSPLINE:void 0,LINEAR:_r,STEP:mo},Il={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Cw(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new $n({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ai})),i.DefaultMaterial}function cs(i,t,e){for(const n in e.extensions)i[n]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[n]=e.extensions[n])}function Gi(i,t){t.extras!==void 0&&(typeof t.extras=="object"?Object.assign(i.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function Pw(i,t,e){let n=!1,s=!1,r=!1;for(let l=0,u=t.length;l<u;l++){const h=t[l];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const o=[],a=[],c=[];for(let l=0,u=t.length;l<u;l++){const h=t[l];if(n){const d=h.POSITION!==void 0?e.getDependency("accessor",h.POSITION):i.attributes.position;o.push(d)}if(s){const d=h.NORMAL!==void 0?e.getDependency("accessor",h.NORMAL):i.attributes.normal;a.push(d)}if(r){const d=h.COLOR_0!==void 0?e.getDependency("accessor",h.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const u=l[0],h=l[1],d=l[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=h),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function Rw(i,t){if(i.updateMorphTargets(),t.weights!==void 0)for(let e=0,n=t.weights.length;e<n;e++)i.morphTargetInfluences[e]=t.weights[e];if(t.extras&&Array.isArray(t.extras.targetNames)){const e=t.extras.targetNames;if(i.morphTargetInfluences.length===e.length){i.morphTargetDictionary={};for(let n=0,s=e.length;n<s;n++)i.morphTargetDictionary[e[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Lw(i){let t;const e=i.extensions&&i.extensions[ie.KHR_DRACO_MESH_COMPRESSION];if(e?t="draco:"+e.bufferView+":"+e.indices+":"+Nl(e.attributes):t=i.indices+":"+Nl(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)t+=":"+Nl(i.targets[n]);return t}function Nl(i){let t="";const e=Object.keys(i).sort();for(let n=0,s=e.length;n<s;n++)t+=e[n]+":"+i[e[n]]+";";return t}function vu(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Dw(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}const Iw=new Pt;class Nw{constructor(t={},e={}){this.json=t,this.extensions={},this.plugins={},this.options=e,this.cache=new iw,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=!1,r=-1;typeof navigator<"u"&&(n=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)===!0,s=navigator.userAgent.indexOf("Firefox")>-1,r=s?navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]:-1),typeof createImageBitmap>"u"||n||s&&r<98?this.textureLoader=new hc(this.options.manager):this.textureLoader=new r3(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ja(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(t){this.extensions=t}setPlugins(t){this.plugins=t}parse(t,e){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return cs(r,a,s),Gi(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){t(a)})}).catch(e)}_markDefs(){const t=this.json.nodes||[],e=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=e.length;s<r;s++){const o=e[s].joints;for(let a=0,c=o.length;a<c;a++)t[o[a]].isBone=!0}for(let s=0,r=t.length;s<r;s++){const o=t[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(t,e){e!==void 0&&(t.refs[e]===void 0&&(t.refs[e]=t.uses[e]=0),t.refs[e]++)}_getNodeRef(t,e,n){if(t.refs[e]<=1)return n;const s=n.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,u]of o.children.entries())r(u,a.children[l])};return r(n,s),s.name+="_instance_"+t.uses[e]++,s}_invokeOne(t){const e=Object.values(this.plugins);e.push(this);for(let n=0;n<e.length;n++){const s=t(e[n]);if(s)return s}return null}_invokeAll(t){const e=Object.values(this.plugins);e.unshift(this);const n=[];for(let s=0;s<e.length;s++){const r=t(e[s]);r&&n.push(r)}return n}getDependency(t,e){const n=t+":"+e;let s=this.cache.get(n);if(!s){switch(t){case"scene":s=this.loadScene(e);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(e)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(e)});break;case"accessor":s=this.loadAccessor(e);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(e)});break;case"buffer":s=this.loadBuffer(e);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(e)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(e)});break;case"skin":s=this.loadSkin(e);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(e)});break;case"camera":s=this.loadCamera(e);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(t,e)}),!s)throw new Error("Unknown type: "+t);break}this.cache.add(n,s)}return s}getDependencies(t){let e=this.cache.get(t);if(!e){const n=this,s=this.json[t+(t==="mesh"?"es":"s")]||[];e=Promise.all(s.map(function(r,o){return n.getDependency(t,o)})),this.cache.add(t,e)}return e}loadBuffer(t){const e=this.json.buffers[t],n=this.fileLoader;if(e.type&&e.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+e.type+" buffer type is not supported.");if(e.uri===void 0&&t===0)return Promise.resolve(this.extensions[ie.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){n.load(ho.resolveURL(e.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+e.uri+'".'))})})}loadBufferView(t){const e=this.json.bufferViews[t];return this.getDependency("buffer",e.buffer).then(function(n){const s=e.byteLength||0,r=e.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(t){const e=this,n=this.json,s=this.json.accessors[t];if(s.bufferView===void 0&&s.sparse===void 0){const o=Dl[s.type],a=fr[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new Pe(l,o,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=Dl[s.type],l=fr[s.componentType],u=l.BYTES_PER_ELEMENT,h=u*c,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0;let _,g;if(f&&f!==h){const p=Math.floor(d/f),y="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let v=e.cache.get(y);v||(_=new l(a,p*f,s.count*f/u),v=new Iu(_,f/u),e.cache.add(y,v)),g=new Xn(v,c,d%f/u,m)}else a===null?_=new l(s.count*c):_=new l(a,d,s.count*c),g=new Pe(_,c,m);if(s.sparse!==void 0){const p=Dl.SCALAR,y=fr[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,x=s.sparse.values.byteOffset||0,M=new y(o[1],v,s.sparse.count*p),S=new l(o[2],x,s.sparse.count*c);a!==null&&(g=new Pe(g.array.slice(),g.itemSize,g.normalized));for(let T=0,I=M.length;T<I;T++){const b=M[T];if(g.setX(b,S[T*c]),c>=2&&g.setY(b,S[T*c+1]),c>=3&&g.setZ(b,S[T*c+2]),c>=4&&g.setW(b,S[T*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}}return g})}loadTexture(t){const e=this.json,n=this.options,r=e.textures[t].source,o=e.images[r];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(t,r,a)}loadTextureImage(t,e,n){const s=this,r=this.json,o=r.textures[t],a=r.images[e],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(e,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const d=(r.samplers||{})[o.sampler]||{};return u.magFilter=rf[d.magFilter]||fn,u.minFilter=rf[d.minFilter]||bs,u.wrapS=of[d.wrapS]||Ms,u.wrapT=of[d.wrapT]||Ms,s.associations.set(u,{textures:t}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(t,e){const n=this,s=this.json,r=this.options;if(this.sourceCache[t]!==void 0)return this.sourceCache[t].then(h=>h.clone());const o=s.images[t],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(h){l=!0;const d=new Blob([h],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+t+" is missing URI and bufferView");const u=Promise.resolve(c).then(function(h){return new Promise(function(d,f){let m=d;e.isImageBitmapLoader===!0&&(m=function(_){const g=new Ye(_);g.needsUpdate=!0,d(g)}),e.load(ho.resolveURL(h,r.path),m,void 0,f)})}).then(function(h){return l===!0&&a.revokeObjectURL(c),h.userData.mimeType=o.mimeType||Dw(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),h});return this.sourceCache[t]=u,u}assignTexture(t,e,n,s){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ie.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[ie.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[ie.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),t[e]=o,o})}assignFinalMaterial(t){const e=t.geometry;let n=t.material;const s=e.attributes.tangent===void 0,r=e.attributes.color!==void 0,o=e.attributes.normal===void 0;if(t.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Uu,On.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(t.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new hn,On.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}t.material=n}getMaterialType(){return $n}loadMaterial(t){const e=this,n=this.json,s=this.extensions,r=n.materials[t];let o;const a={},c=r.extensions||{},l=[];if(c[ie.KHR_MATERIALS_UNLIT]){const h=s[ie.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),l.push(h.extendParams(a,r,e))}else{const h=r.pbrMetallicRoughness||{};if(a.color=new At(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Ve),a.opacity=d[3]}h.baseColorTexture!==void 0&&l.push(e.assignTexture(a,"map",h.baseColorTexture,be)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(e.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(e.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(t)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(t,a)})))}r.doubleSided===!0&&(a.side=mn);const u=r.alphaMode||Il.OPAQUE;if(u===Il.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Il.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==ei&&(l.push(e.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new ht(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;a.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&o!==ei&&(l.push(e.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==ei){const h=r.emissiveFactor;a.emissive=new At().setRGB(h[0],h[1],h[2],Ve)}return r.emissiveTexture!==void 0&&o!==ei&&l.push(e.assignTexture(a,"emissiveMap",r.emissiveTexture,be)),Promise.all(l).then(function(){const h=new o(a);return r.name&&(h.name=r.name),Gi(h,r),e.associations.set(h,{materials:t}),r.extensions&&cs(s,h,r),h})}createUniqueName(t){const e=pe.sanitizeNodeName(t||"");return e in this.nodeNamesUsed?e+"_"+ ++this.nodeNamesUsed[e]:(this.nodeNamesUsed[e]=0,e)}loadGeometries(t){const e=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[ie.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,e).then(function(c){return af(c,a,e)})}const o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a],u=Lw(l),h=s[u];if(h)o.push(h.promise);else{let d;l.extensions&&l.extensions[ie.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=af(new ce,l,e),s[u]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(t){const e=this,n=this.json,s=this.extensions,r=n.meshes[t],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const u=o[c].material===void 0?Cw(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(e.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),u=c[c.length-1],h=[];for(let f=0,m=u.length;f<m;f++){const _=u[f],g=o[f];let p;const y=l[f];if(g.mode===Pn.TRIANGLES||g.mode===Pn.TRIANGLE_STRIP||g.mode===Pn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new Mx(_,y):new Oe(_,y),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===Pn.TRIANGLE_STRIP?p.geometry=nf(p.geometry,Pf):g.mode===Pn.TRIANGLE_FAN&&(p.geometry=nf(p.geometry,Bl));else if(g.mode===Pn.LINES)p=new Fu(_,y);else if(g.mode===Pn.LINE_STRIP)p=new wn(_,y);else if(g.mode===Pn.LINE_LOOP)p=new Ex(_,y);else if(g.mode===Pn.POINTS)p=new Qf(_,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&Rw(p,r),p.name=e.createUniqueName(r.name||"mesh_"+t),Gi(p,r),g.extensions&&cs(s,p,g),e.assignFinalMaterial(p),h.push(p)}for(let f=0,m=h.length;f<m;f++)e.associations.set(h[f],{meshes:t,primitives:f});if(h.length===1)return r.extensions&&cs(s,h[0],r),h[0];const d=new Se;r.extensions&&cs(s,d,r),e.associations.set(d,{meshes:t});for(let f=0,m=h.length;f<m;f++)d.add(h[f]);return d})}loadCamera(t){let e;const n=this.json.cameras[t],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?e=new rn(fe.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(e=new ac(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(e.name=this.createUniqueName(n.name)),Gi(e,n),Promise.resolve(e)}loadSkin(t){const e=this.json.skins[t],n=[];for(let s=0,r=e.joints.length;s<r;s++)n.push(this._loadNodeShallow(e.joints[s]));return e.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",e.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){const h=o[l];if(h){a.push(h);const d=new Pt;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',e.joints[l])}return new Ou(a,c)})}loadAnimation(t){const e=this.json,n=this,s=e.animations[t],r=s.name?s.name:"animation_"+t,o=[],a=[],c=[],l=[],u=[];for(let h=0,d=s.channels.length;h<d;h++){const f=s.channels[h],m=s.samplers[f.sampler],_=f.target,g=_.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,y=s.parameters!==void 0?s.parameters[m.output]:m.output;_.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",y)),l.push(m),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(h){const d=h[0],f=h[1],m=h[2],_=h[3],g=h[4],p=[];for(let y=0,v=d.length;y<v;y++){const x=d[y],M=f[y],S=m[y],T=_[y],I=g[y];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const b=n._createAnimationTracks(x,M,S,T,I);if(b)for(let w=0;w<b.length;w++)p.push(b[w])}return new qx(r,void 0,p)})}createNodeMesh(t){const e=this.json,n=this,s=e.nodes[t];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(t){const e=this.json,n=this,s=e.nodes[t],r=n._loadNodeShallow(t),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(n.getDependency("node",a[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const u=l[0],h=l[1],d=l[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Iw)});for(let f=0,m=h.length;f<m;f++)u.add(h[f]);return u})}_loadNodeShallow(t){const e=this.json,n=this.extensions,s=this;if(this.nodeCache[t]!==void 0)return this.nodeCache[t];const r=e.nodes[t],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(t)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(t)}).forEach(function(l){a.push(l)}),this.nodeCache[t]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Zf:l.length>1?u=new Se:l.length===1?u=l[0]:u=new Ae,u!==l[0])for(let h=0,d=l.length;h<d;h++)u.add(l[h]);if(r.name&&(u.userData.name=r.name,u.name=o),Gi(u,r),r.extensions&&cs(n,u,r),r.matrix!==void 0){const h=new Pt;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);return s.associations.has(u)||s.associations.set(u,{}),s.associations.get(u).nodes=t,u}),this.nodeCache[t]}loadScene(t){const e=this.extensions,n=this.json.scenes[t],s=this,r=new Se;n.name&&(r.name=s.createUniqueName(n.name)),Gi(r,n),n.extensions&&cs(e,r,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,h=c.length;u<h;u++)r.add(c[u]);const l=u=>{const h=new Map;for(const[d,f]of s.associations)(d instanceof On||d instanceof Ye)&&h.set(d,f);return u.traverse(d=>{const f=s.associations.get(d);f!=null&&h.set(d,f)}),h};return s.associations=l(r),r})}_createAnimationTracks(t,e,n,s,r){const o=[],a=t.name?t.name:t.uuid,c=[];ki[r.path]===ki.weights?t.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(ki[r.path]){case ki.weights:l=xr;break;case ki.rotation:l=ws;break;case ki.position:case ki.scale:l=Mr;break;default:switch(n.itemSize){case 1:l=xr;break;case 2:case 3:default:l=Mr;break}break}const u=s.interpolation!==void 0?Aw[s.interpolation]:_r,h=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const m=new l(c[d]+"."+ki[r.path],e.array,h,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),o.push(m)}return o}_getArrayFromAccessor(t){let e=t.array;if(t.normalized){const n=vu(e.constructor),s=new Float32Array(e.length);for(let r=0,o=e.length;r<o;r++)s[r]=e[r]*n;e=s}return e}_createCubicSplineTrackInterpolant(t){t.createInterpolant=function(n){const s=this instanceof ws?Tw:qm;return new s(this.times,this.values,this.getValueSize()/3,n)},t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Ow(i,t,e){const n=t.attributes,s=new Ee;if(n.POSITION!==void 0){const a=e.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new E(c[0],c[1],c[2]),new E(l[0],l[1],l[2])),a.normalized){const u=vu(fr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=t.targets;if(r!==void 0){const a=new E,c=new E;for(let l=0,u=r.length;l<u;l++){const h=r[l];if(h.POSITION!==void 0){const d=e.json.accessors[h.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){const _=vu(fr[d.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;const o=new En;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function af(i,t,e){const n=t.attributes,s=[];function r(o,a){return e.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(const o in n){const a=yu[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(t.indices!==void 0&&!i.index){const o=e.getDependency("accessor",t.indices).then(function(a){i.setIndex(a)});s.push(o)}return he.workingColorSpace!==Ve&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${he.workingColorSpace}" not supported.`),Gi(i,t),Ow(i,t,e),Promise.all(s).then(function(){return t.targets!==void 0?Pw(i,t.targets,e):i})}const Fw=Object.freeze(Object.defineProperty({__proto__:null,GLTFLoader:jm},Symbol.toStringTag,{value:"Module"})),xi=class xi{constructor(t){nt(this,"instanceId");nt(this,"container");nt(this,"width");nt(this,"height");nt(this,"scene");nt(this,"camera");nt(this,"renderer");nt(this,"controls");nt(this,"boundAnimate");nt(this,"animationId");nt(this,"isVisible");nt(this,"resizeObserver");nt(this,"intersectionObserver");xi.instanceCount++,this.instanceId=xi.instanceCount,this.container=t,this.width=t.clientWidth,this.height=t.clientHeight||250,this.scene=new Du,this.scene.background=null,this.camera=new rn(45,this.width&&this.height?this.width/this.height:1,.1,1e3),this.camera.position.set(2,2,4),this.renderer=new Lu({antialias:!0,alpha:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(window.devicePixelRatio),this.container.appendChild(this.renderer.domElement),this.renderer.domElement.addEventListener("pointerdown",o=>o.stopPropagation()),this.renderer.domElement.addEventListener("mousedown",o=>o.stopPropagation()),this.controls=new tw(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=2,this.controls.enableZoom=!0;const e=new op(16777215,2);this.scene.add(e);const n=new Da(16777215,2.5);n.position.set(5,5,5),this.scene.add(n);const s=new Da(16777215,1.5);s.position.set(-5,3,-5),this.scene.add(s);const r=new Da(16777215,1);r.position.set(0,-5,0),this.scene.add(r),this.boundAnimate=this.animate.bind(this),this.animationId=null,this.isVisible=!0,this.start(),this.resizeObserver=new ResizeObserver(()=>this.onResize()),this.resizeObserver.observe(this.container),this.onResize(),this.intersectionObserver=new IntersectionObserver(o=>{o.forEach(a=>{this.isVisible=a.isIntersecting,this.isVisible?this.start():this.stop()})},{threshold:0}),this.intersectionObserver.observe(this.container)}loadModel(t){if(xi.modelCache.has(t)){const s=xi.modelCache.get(t);this.displayModel(s.scene.clone());return}const e=new jm,n=new Xm;n.setDecoderPath("/draco/"),n.setDecoderConfig({type:"js"}),e.setDRACOLoader(n),e.load(t,s=>{xi.modelCache.set(t,s),this.displayModel(s.scene.clone())},void 0,s=>{console.error("Error loading 3D model:",s),this.renderError()})}displayModel(t){const e=this.scene.getObjectByName("previewModel");e&&this.scene.remove(e),t.name="previewModel";const n=new Ee().setFromObject(t),s=n.getCenter(new E),r=n.getSize(new E),a=3/Math.max(r.x,r.y,r.z);t.scale.setScalar(a),t.position.sub(s.multiplyScalar(a)),this.scene.add(t)}renderError(){const t=document.createElement("div");t.textContent="Failed to load model",t.style.color="red",t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",this.container.appendChild(t)}start(){this.animationId||this.animate()}stop(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}animate(){this.animationId=requestAnimationFrame(this.boundAnimate),this.controls.update(),this.renderer.render(this.scene,this.camera)}onResize(){if(!this.container)return;const t=this.container.clientWidth,e=this.container.clientHeight;(Math.abs(t-this.width)>1||Math.abs(e-this.height)>1)&&(this.width=t,this.height=e,this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e))}dispose(){this.stop(),this.resizeObserver.disconnect(),this.intersectionObserver.disconnect(),this.controls.dispose(),this.renderer.dispose(),this.container.contains(this.renderer.domElement)&&this.container.removeChild(this.renderer.domElement)}};nt(xi,"instanceCount",0),nt(xi,"modelCache",new Map);let ic=xi;const Uw=Object.freeze(Object.defineProperty({__proto__:null,ModelPreview:ic},Symbol.toStringTag,{value:"Module"})),zw=`
  .mission-ui-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow-y: auto;
    padding: 10px;
    position: relative; /* For absolute positioning if needed */
  }

  /* List Styles */
  .mission-list-item {
    display: flex;
    align-items: center;
    padding: 3px 8px; /* Compact padding */
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.9em; /* Slightly smaller text */
    gap: 8px;
  }
  .mission-list-item:hover {
    background: rgba(255,255,255,0.1);
  }
  
  .mission-list-name {
    flex-grow: 1;
    font-size: 0.95em;
    user-select: none;
  }

  .mission-list-year {
    font-size: 0.85em;
    color: #888;
    font-family: monospace;
    min-width: 40px;
    text-align: right;
  }

  .mission-list-agency {
    font-size: 0.8em;
    color: #666;
    background: rgba(255, 255, 255, 0.08);
    padding: 1px 6px;
    border-radius: 3px;
    width: 80px;
    text-align: center;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .story-btn {
    opacity: 0;
    pointer-events: none;
    transform: translateX(10px);
    transition: all 0.2s;
    background: none;
    border: none;
    font-size: 1.1em;
    cursor: pointer;
    padding: 1px 4px;
    margin-left: 5px;
  }

  .mission-list-item:hover .story-btn {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }

  .mission-color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .mission-color-dot:hover {
    transform: scale(1.2);
    border-color: rgba(255,255,255,0.8);
  }

  /* Header Styles (Details View) */
  .mission-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .back-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.2em;
    cursor: pointer;
    padding: 4px 8px;
    margin-right: 8px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .back-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }

  .mission-title {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    flex-grow: 1;
  }

  /* Detail Content */
  .mission-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 15px;
    background-color: #000;
    display: block;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .mission-summary {
    font-size: 0.9em;
    line-height: 1.6;
    color: #ddd;
    margin-bottom: 20px;
    padding: 0 4px;
  }

  .mission-details-grid {
    display: flex;
    flex-direction: row;
    gap: 30px; /* Increased gap */
  }
  
  .overview-col {
    flex: 1;
    min-width: 0;
  }
  
  .timeline-col {
    flex: 1;
    min-width: 0;
    max-height: 400px;
    overflow-y: auto;
    padding-left: 5px; /* Extra safety buffer */
  }

  /* Timeline Styles */
  .mission-timeline {
    position: relative;
    padding-left: 12px; /* Reduced from 20px */
    margin-top: 0;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    margin-left: 0; /* Moved to left (was 10px) */
  }

  .timeline-event {
    position: relative;
    padding: 0 0 8px 6px;
    /* cursor: pointer; -- Moved to children */
    transition: opacity 0.2s;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 6px;
  }
  
  .timeline-event:last-child {
    padding-bottom: 0;
  }

  .timeline-event:hover {
    opacity: 1;
  }
  .timeline-event:hover .timeline-dot {
    background: #fff;
    box-shadow: 0 0 8px rgba(255,255,255,0.8);
  }

  .timeline-dot {
    position: absolute;
    left: -19px;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #555;
    border: 2px solid #222;
    transition: all 0.2s ease;
  }

  .event-date {
    font-family: monospace;
    font-size: 0.85em;
    color: #888;
    min-width: 78px;
    flex-shrink: 0;
    cursor: pointer; /* Clickable */
    transition: color 0.2s;
  }
  .event-date:hover {
    color: #fff;
  }

  .event-label {
    font-size: 0.95em;
    font-weight: 500;
    color: #eee;
    cursor: pointer; /* Clickable */
  }
  
  .event-label:hover {
    text-decoration: underline;
    color: #fff;
  }
`;function kw(i){const t=document.createElement("style");t.textContent=zw,i.appendChild(t)}function Bw(i,t){i.innerHTML="",i.className="mission-ui-container",kw(i);const e=document.createElement("div");e.style.flexGrow="1",e.style.display="flex",e.style.flexDirection="column",i.appendChild(e);let n=null;const s=[],r=()=>{s.forEach(l=>l()),s.length=0,n&&(n.dispose(),n=null)},o=()=>{r(),e.innerHTML="";const l=document.createElement("div");l.className="mission-list",[...Yi].sort((h,d)=>{var _,g;const f=(_=h.waypoints[0])!=null&&_.date?new Date(h.waypoints[0].date).getTime():0,m=(g=d.waypoints[0])!=null&&g.date?new Date(d.waypoints[0].date).getTime():0;return f-m}).forEach(h=>{const d=document.createElement("div");d.className="mission-list-item";const f=document.createElement("div");f.className="mission-color-dot";const m=()=>{if(t.showMissions[h.id]){const v=`#${(h.color||16777215).toString(16).padStart(6,"0")}`;f.style.backgroundColor=v,f.style.boxShadow=`0 0 8px ${v}`,f.style.borderColor="rgba(255,255,255,0.5)"}else f.style.backgroundColor="#444",f.style.boxShadow="none",f.style.borderColor="rgba(255,255,255,0.2)"};m(),f.onclick=y=>{y.stopPropagation(),t.showMissions[h.id]=!t.showMissions[h.id],m(),window.dispatchEvent(new CustomEvent("mission-visibility-changed",{detail:{missionId:h.id}})),window.updateMissions&&window.updateMissions()};const _=document.createElement("span");if(_.className="mission-list-name",_.textContent=h.name||h.id,d.appendChild(f),d.appendChild(_),h.launchYear){const y=document.createElement("span");y.className="mission-list-year",y.textContent=String(h.launchYear),d.appendChild(y)}if(h.agency){const y=document.createElement("span");y.className="mission-list-agency",y.textContent=h.agency,d.appendChild(y)}const g=document.createElement("button");g.className="story-btn",g.textContent="🛰️",g.title="Focus on Probe",g.onclick=async y=>{y.stopPropagation(),t.showMissions[h.id]||(t.showMissions[h.id]=!0,m(),window.dispatchEvent(new CustomEvent("mission-visibility-changed",{detail:{missionId:h.id}})),window.updateMissions&&window.updateMissions());const{ensureProbeLoaded:v,getProbeForFocus:x,updateMissionProbes:M}=await Ei(async()=>{const{ensureProbeLoaded:I,getProbeForFocus:b,updateMissionProbes:w}=await Promise.resolve().then(()=>bb);return{ensureProbeLoaded:I,getProbeForFocus:b,updateMissionProbes:w}},void 0),{focusOnObject:S}=await Ei(async()=>{const{focusOnObject:I}=await Promise.resolve().then(()=>fu);return{focusOnObject:I}},void 0);if(await v(h.id)){M(t.date),m();const I=x(h.id);if(I){const{camera:b,controls:w}=window.SimulationControl||{};b&&w&&S(I,b,w)}}},d.appendChild(g),d.onclick=()=>{a(h)};const p=y=>{y.detail.missionId===h.id&&document.body.contains(d)&&m()};window.addEventListener("mission-visibility-changed",p),s.push(()=>window.removeEventListener("mission-visibility-changed",p)),l.appendChild(d)}),e.appendChild(l)},a=l=>{r(),e.innerHTML="";const u=document.createElement("div");u.className="mission-header";const h=document.createElement("button");h.className="back-btn",h.textContent="❮",h.title="Back to Mission List",h.onclick=()=>{o()};const d=document.createElement("div");d.className="mission-color-dot";const f=()=>{if(t.showMissions[l.id]){const M=`#${(l.color||16777215).toString(16).padStart(6,"0")}`;d.style.backgroundColor=M,d.style.boxShadow=`0 0 8px ${M}`,d.style.borderColor="rgba(255,255,255,0.5)"}else d.style.backgroundColor="#444",d.style.boxShadow="none",d.style.borderColor="rgba(255,255,255,0.2)"};f(),d.onclick=()=>{t.showMissions[l.id]=!t.showMissions[l.id],f(),window.dispatchEvent(new CustomEvent("mission-visibility-changed",{detail:{missionId:l.id}})),window.updateMissions&&window.updateMissions()};const m=x=>{x.detail.missionId===l.id&&f()};window.addEventListener("mission-visibility-changed",m),s.push(()=>window.removeEventListener("mission-visibility-changed",m));const _=document.createElement("h3");_.className="mission-title",_.textContent=l.name||l.id,u.appendChild(h),u.appendChild(d),u.appendChild(_),e.appendChild(u);const g=document.createElement("div");g.style.animation="fadeIn 0.3s ease";const p=document.createElement("div");p.className="mission-details-grid",g.appendChild(p);const y=document.createElement("div");y.className="overview-col",p.appendChild(y);const v=document.createElement("div");if(v.className="timeline-col",p.appendChild(v),l.modelPath){const x=document.createElement("div");x.style.width="100%",x.style.height="180px",x.style.minHeight="180px",x.style.position="relative",y.appendChild(x),n=new ic(x),n.loadModel(l.modelPath)}else if(l.image){const x=document.createElement("img");x.className="mission-image",x.src=l.image,x.onerror=()=>{x.style.display="none"},y.appendChild(x)}if(l.timeline&&l.timeline.length>0){const x=document.createElement("h4");x.textContent="Mission Timeline",x.style.margin="0 0 10px 0",x.style.color="#fff",x.style.opacity="0.8",v.appendChild(x);const M=document.createElement("div");M.className="mission-timeline",l.timeline.forEach(S=>{const T=document.createElement("div");T.className="timeline-event";const I=S.date instanceof Date?S.date.toISOString():S.date;T.dataset.date=I,T.dataset.color=`#${(l.color||16777215).toString(16).padStart(6,"0")}`;const b=document.createElement("div");b.className="timeline-dot";const w=new Date(S.date),O=t.date,G=w>O,$=T.dataset.color;G?(b.style.backgroundColor="transparent",b.style.border="2px solid transparent",b.style.boxShadow=`inset 0 0 0 1px ${$}`):(b.style.backgroundColor=$,b.style.border="2px solid #222",b.style.boxShadow="none"),T.appendChild(b);const R=document.createElement("span");R.className="event-date",R.textContent=I.split("T")[0],R.onclick=H=>{H.stopPropagation();const U=window.SimulationControl;U!=null&&U.jumpToMissionLocation&&U.jumpToMissionLocation(l.id,S.date,!0,!1)},T.appendChild(R);const F=document.createElement("span");F.className="event-label",F.textContent=S.label,F.onclick=H=>{H.stopPropagation();const U=window.SimulationControl;U!=null&&U.jumpToMissionLocation&&U.jumpToMissionLocation(l.id,S.date,!0,!0)},T.appendChild(F),M.appendChild(T)}),v.appendChild(M)}if(l.summary){const x=document.createElement("div");x.className="mission-summary",x.textContent=l.summary,x.style.marginTop="15px",x.style.borderTop="1px solid rgba(255,255,255,0.1)",x.style.paddingTop="10px",g.appendChild(x)}e.appendChild(g)},c=l=>{const u=l.detail.missionId,h=Yi.find(d=>d.id===u);h&&a(h)};window.addEventListener("mission-selected",c),o()}function Gw(i){const t=document.querySelectorAll(".mission-timeline .timeline-event");if(t.length===0)return;const e=i.date;t.forEach(n=>{const s=n,r=s.dataset.date;if(!r)return;const o=new Date(r),a=s.dataset.color||"#fff",c=s.querySelector(".timeline-dot");if(!c)return;o>e?(c.style.backgroundColor="transparent",c.style.border="2px solid transparent",c.style.boxShadow=`inset 0 0 0 1px ${a}`):(c.style.backgroundColor=a,c.style.border="2px solid #222",c.style.boxShadow="none")})}function Hw(i,t){const e=i.addFolder("Mouse & Keys");e.add(t,"rotate").name("Rotate").disable(),e.add(t,"pan").name("Pan").disable(),e.add(t,"zoom").name("Zoom").disable(),e.add(t,"focusEnter").name("Focus").disable(),e.add(t,"focusExit").name("Exit Focus").disable(),e.add(t,"fullScreen").name("Full Screen").disable(),e.close()}function Vw(){const i=ve.createWindow("music-window","Music",{width:"240px",x:290,y:window.innerHeight-280,snap:{y:"bottom"},onClose:()=>{}});if(!i)return;const t=i.content;t.classList.add("music-window-content");const e=document.createElement("div");e.className="volume-container";const n=document.createElement("label");n.textContent="Volume";const s=document.createElement("input");s.type="range",s.min="0",s.max="1",s.step="0.01",s.value=D.music.volume.toString(),s.className="volume-slider",s.oninput=_=>{gn.setVolume(parseFloat(_.target.value))},e.appendChild(n),e.appendChild(s),t.appendChild(e);const r=document.createElement("div");r.className="track-display",r.textContent=D.music.currentTrackName||"---",t.appendChild(r),i.update=()=>{r.textContent!==D.music.currentTrackName&&(r.textContent=D.music.currentTrackName)};const o=document.createElement("div");o.className="control-buttons";const a=document.createElement("div");a.className="control-btn",a.textContent="⏮",a.title="Previous Track",a.onclick=()=>gn.playPrevious();const c=document.createElement("div");c.className="control-btn";const l=D.music.volume>0&&D.music.enabled;c.textContent=l?"⏸":"▶",c.title=l?"Pause":"Play",c.onclick=()=>{const _=!D.music.enabled;gn.setEnabled(_),c.textContent=_?"⏸":"▶",c.title=_?"Pause":"Play"};const u=i.update;i.update=()=>{u&&u();const _=D.music.enabled,g=_?"⏸":"▶";c.textContent!==g&&(c.textContent=g,c.title=_?"Pause":"Play")};const h=document.createElement("div");h.className="control-btn",h.textContent="⏭",h.title="Next Track",h.onclick=()=>gn.playNext();const d=document.createElement("div");d.className="control-btn";const f=`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
  `;d.innerHTML=f,d.title=D.music.shuffle?"Shuffle: ON":"Shuffle: OFF",D.music.shuffle&&d.classList.add("active"),d.onclick=()=>{D.music.shuffle=!D.music.shuffle,D.music.shuffle?(d.classList.add("active"),d.title="Shuffle: ON"):(d.classList.remove("active"),d.title="Shuffle: OFF")};const m=document.createElement("div");m.className="control-btn",m.textContent="☰",m.title="Edit Playlist",m.onclick=()=>Ww(),o.appendChild(a),o.appendChild(c),o.appendChild(h),o.appendChild(d),o.appendChild(m),t.appendChild(o),i.x=290,ve.hideWindow("music-window")}function Ww(){let i=document.querySelector(".playlist-modal-overlay");i||(Xw(),i=document.querySelector(".playlist-modal-overlay")),Lc(),i&&i.classList.add("active")}function Xw(){const i=document.createElement("div");i.className="playlist-modal-overlay";const t=document.createElement("div");t.className="playlist-modal";const e=document.createElement("div");e.className="playlist-header",e.innerHTML="<h2>Playlist</h2>";const n=document.createElement("div");n.className="playlist-controls";const s=document.createElement("button");s.className="playlist-btn",s.textContent="All",s.onclick=()=>cf(!0);const r=document.createElement("button");r.className="playlist-btn",r.textContent="None",r.onclick=()=>cf(!1);const o=document.createElement("button");o.className="playlist-btn",o.textContent="Lyrics",o.onclick=()=>lf("Lyrics");const a=document.createElement("button");a.className="playlist-btn",a.textContent="Instrumental",a.onclick=()=>lf("Instrumental"),n.appendChild(s),n.appendChild(r),n.appendChild(o),n.appendChild(a);const c=document.createElement("div");c.className="playlist-tracks",c.id="playlist-tracks-container";const l=document.createElement("div");l.className="playlist-footer";const u=document.createElement("button");u.className="playlist-close-btn",u.textContent="Close",u.onclick=()=>{i.classList.remove("active")},l.appendChild(u),t.appendChild(e),t.appendChild(n),t.appendChild(c),t.appendChild(l),i.appendChild(t),document.body.appendChild(i),i.addEventListener("click",h=>{h.target===i&&i.classList.remove("active")})}function Lc(){const i=document.getElementById("playlist-tracks-container");if(i){if(i.innerHTML="",!gn.tracks||gn.tracks.length===0){i.innerHTML='<div style="padding:10px; color:#aaa;">Loading tracks...</div>',gn.init().then(()=>Lc());return}gn.tracks.forEach(t=>{const e=document.createElement("div");e.className="track-item",D.music.playlist.includes(t.id)&&e.classList.add("selected");const n=document.createElement("input");n.type="checkbox",n.checked=D.music.playlist.includes(t.id),n.onchange=r=>{const o=r.target.checked;jw(t.id,o),o?e.classList.add("selected"):e.classList.remove("selected")};const s=document.createElement("span");s.className="track-label",s.textContent=t.title.replace(/ \[(Lyrics|Instrumental)\]/g,""),e.onclick=r=>{r.target!==n&&(n.checked=!n.checked,n.dispatchEvent(new Event("change")))},e.appendChild(n),e.appendChild(s),i.appendChild(e)})}}function jw(i,t){t?D.music.playlist.includes(i)||D.music.playlist.push(i):D.music.playlist=D.music.playlist.filter(e=>e!==i),gn.setPlaylist(D.music.playlist)}function cf(i){i?D.music.playlist=gn.tracks.map(t=>t.id):D.music.playlist=[],gn.setPlaylist(D.music.playlist),Lc()}function lf(i){const e=gn.tracks.filter(s=>s.title.includes(`[${i}]`)).map(s=>s.id);e.every(s=>D.music.playlist.includes(s))?D.music.playlist=D.music.playlist.filter(s=>!e.includes(s)):e.forEach(s=>{D.music.playlist.includes(s)||D.music.playlist.push(s)}),gn.setPlaylist(D.music.playlist),Lc()}function $w(i,t,e){i.innerHTML="";const n=document.createElement("div");n.className="system-list",i.appendChild(n);const s=y=>{const v=document.createElement("div");v.className="system-section";const x=document.createElement("div");return x.className="system-section-title",x.textContent=y,v.appendChild(x),n.appendChild(v),v},r=(y,v,x,M,S)=>{const T=document.createElement("div");T.className="system-row";const I=document.createElement("div");I.className="system-label",I.textContent=v,T.appendChild(I);const b=document.createElement("div");b.className="system-slider-container";const w=document.createElement("input");w.type="range",w.className="system-slider",w.min="0",w.max="1000",w.value=x().toString();const O=document.createElement("span");return O.className="system-value",O.textContent=S(),w.addEventListener("input",G=>{M(parseFloat(G.target.value));const $=S();O.textContent=$}),b.appendChild(w),T.appendChild(b),T.appendChild(O),y.appendChild(T),{update:()=>{w.value=x().toString(),O.textContent=S()}}},o=s("Settings");r(o,"Brightness",()=>D.starBrightness*1e3,y=>{const v=y/1e3;D.starBrightness=v;const x=t.value;x!=null&&x.userData.manager&&x.userData.manager.setBrightness(v)},()=>`${(D.starBrightness*100).toFixed(0)}%`),r(o,"Saturation",()=>(D.starSaturation||0)*1e3,y=>{const v=y/1e3;D.starSaturation=v;const x=t.value;x!=null&&x.userData.manager&&x.userData.manager.setSaturation(v)},()=>`${(D.starSaturation!==void 0?D.starSaturation:.3).toFixed(1)}x`);const f=2,m=13;r(o,"Limit (Mag)",()=>(D.magnitudeLimit-f)/(m-f)*1e3,y=>{const v=y/1e3,x=f+v*(m-f);D.magnitudeLimit=x;const M=t.value;if(M!=null&&M.userData.manager){const S=M.userData.manager;x>6.5&&S.loadChunk(1),x>8&&S.loadChunk(2),S.setMagnitudeLimit(x)}},()=>D.magnitudeLimit.toFixed(1))}function qw(i,t){const e=i.addFolder("System"),n=document.createElement("div");n.style.padding="10px",n.style.fontSize="12px",n.style.lineHeight="1.4",n.style.color="#eee",n.style.fontFamily="monospace";const s=t.getContext();if(!s)return;const r=s.getExtension("WEBGL_debug_renderer_info"),o=r?s.getParameter(r.UNMASKED_RENDERER_WEBGL):"Unknown";r&&s.getParameter(r.UNMASKED_VENDOR_WEBGL);const a=s.getParameter(s.MAX_TEXTURE_SIZE),c=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),l=s.getExtension("EXT_texture_filter_anisotropic"),u=l?s.getParameter(l.MAX_TEXTURE_MAX_ANISOTROPY_EXT):"N/A",h=navigator.hardwareConcurrency||"Unknown",d=navigator.deviceMemory?`${navigator.deviceMemory} GB`:"Unknown",f=`
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">CPU:</strong> ${h} Logical Processors<br>
      <strong style="color: #88ccff;">Memory:</strong> ${d}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">GPU:</strong><br>
      ${o}
    </div>
    <div>
      <strong style="color: #88ccff;">WebGL Limits:</strong><br>
      Max Texture Size: ${a}px<br>
      Max Cube Map Size: ${c}px<br>
      Max Anisotropy: ${u}x
    </div>
  `;n.innerHTML=f;const m=e.domElement.querySelector(".children");m&&m.appendChild(n),e.close()}function Yw(i,t,e,n,s,r,o){i.innerHTML="";const a=document.createElement("div");a.className="system-list",i.appendChild(a);const c=U=>{const B=document.createElement("div");B.className="system-section";const Y=document.createElement("div");return Y.className="system-section-title",Y.textContent=U,B.appendChild(Y),a.appendChild(B),B},l=(U,B,Y,X,tt)=>{const et=document.createElement("div");et.className="system-row";const j=document.createElement("div");j.className="system-label",j.textContent=B,et.appendChild(j);const Q=document.createElement("select");Q.className="system-select",Object.entries(Y).forEach(([st,yt])=>{const Mt=document.createElement("option");Mt.value=yt,Mt.textContent=st,yt===X()&&(Mt.selected=!0),Q.appendChild(Mt)}),Q.addEventListener("change",st=>{tt(st.target.value)}),et.appendChild(Q),U.appendChild(et)},u=(U,B,Y,X,tt)=>{const et=document.createElement("div");et.className="system-row";const j=document.createElement("div");j.className="system-label",j.textContent=B,et.appendChild(j);const Q=document.createElement("div");Q.className="system-slider-container";const st=document.createElement("input");st.type="range",st.className="system-slider",st.min="0",st.max="1000",st.value=Y().toString();const yt=document.createElement("span");return yt.className="system-value",yt.textContent=tt(),st.addEventListener("input",Mt=>{X(parseFloat(Mt.target.value));const Nt=tt();yt.textContent=Nt}),Q.appendChild(st),et.appendChild(Q),et.appendChild(yt),U.appendChild(et),{update:()=>{st.value=Y().toString(),yt.textContent=tt()}}},h=c("Coordinate System");l(h,"Origin",{"Center of Mass (Barycentric)":"Barycentric","Earth (Geocentric)":"Geocentric","Earth (Tychonic)":"Tychonic","Sun (Heliocentric)":"Heliocentric"},()=>D.coordinateSystem,U=>{D.coordinateSystem=U,pu(s,e,n),za(r,o,e)}),l(h,"Reference Plane",{Equatorial:"Equatorial",Ecliptic:"Ecliptic"},()=>D.referencePlane,U=>{D.referencePlane=U,Rm(U,s)});const f=c("Scale"),m=()=>{const U=document.createElement("div");U.className="system-row";const B=document.createElement("div");B.className="system-label",B.textContent="Preset",U.appendChild(B);const Y=document.createElement("select");return Y.className="system-select",Object.entries({Realistic:"Realistic",Artistic:"Artistic",Custom:"Custom"}).forEach(([tt,et])=>{const j=document.createElement("option");j.value=et,j.textContent=tt,Y.appendChild(j)}),Y.value=t.scalePreset,Y.addEventListener("change",tt=>{t.scalePreset=tt.target.value,g(t.scalePreset)}),U.appendChild(Y),f.appendChild(U),{update:()=>{Y.value=t.scalePreset}}};let _=!1;const g=U=>{if(_=!0,U==="Realistic")M(1),G(0);else if(U==="Artistic"){M(1*no);const B=(499/(In*5-1))**(1/3);G(B*1e3)}_=!1},p=m(),y=1,v=70,x=()=>(D.sunScale*no-y)/(v-y)*1e3,M=U=>{const B=U/no;D.sunScale=B,n.scale.setScalar(B),zb(s,B),I&&I.update()},I=u(f,"Sun Scale",x,U=>{const B=U/1e3,Y=y+B*(v-y);M(Y),!_&&t.scalePreset!=="Custom"&&(t.scalePreset="Custom",p.update())},()=>`${(D.sunScale*no).toFixed(0)}x`),b=U=>1+(In*5-1)*U**3,w=U=>((U-1)/(In*5-1))**(1/3),O=()=>{const U=D.planetScale*In;return w(U)*1e3},G=U=>{const B=U/1e3,X=b(B)/In;D.planetScale=X,e.forEach(tt=>{var et;tt.mesh.scale.setScalar(X),(et=tt.moons)==null||et.forEach(j=>{j.mesh.scale.setScalar(X)})}),gh(e),Ts(void 0,!0),F&&F.update()},F=u(f,"Planet Scale",O,U=>{G(U),!_&&t.scalePreset!=="Custom"&&(t.scalePreset="Custom",p.update())},()=>`${(D.planetScale*In).toFixed(0)}x`),H={setScalePreset:U=>{t.scalePreset=U,p.update(),g(U)}};return window.addEventListener("planet-scale-changed",()=>{F&&F.update(),t.scalePreset!=="Custom"&&(t.scalePreset="Custom",p&&p.update())}),H}class uf{constructor(t,e,n={}){nt(this,"id");nt(this,"tabOrder");nt(this,"tabs");nt(this,"activeTabId");nt(this,"window");nt(this,"tabHeader");nt(this,"tabList");nt(this,"tabContentArea");this.id=t,this.tabOrder=n.tabOrder||[],this.tabs=[],this.activeTabId=null,this.window=ve.createWindow(t,e,{...n,onClose:()=>this.onClose()}),this.window.controller=this,this.setupTabStructure(),this.setupDropZone(),ve.hideWindow(this.id)}setupTabStructure(){const t=this.window.content;t.innerHTML="",this.tabHeader=document.createElement("div"),this.tabHeader.className="tab-header",t.appendChild(this.tabHeader),this.tabList=document.createElement("div"),this.tabList.className="tab-list",this.tabHeader.appendChild(this.tabList),this.tabContentArea=document.createElement("div"),this.tabContentArea.className="tab-content-area",t.appendChild(this.tabContentArea)}addTab(t,e,n,s=""){if(this.tabs.find(l=>l.id===t))return;const r=this.tabOrder;n.classList.add("tab-content"),this.tabContentArea.appendChild(n);const o={id:t,title:e,contentElement:n,icon:s};let a=this.tabs.length;const c=r.indexOf(t);if(c!==-1)for(let l=0;l<this.tabs.length;l++){const u=this.tabs[l].id,h=r.indexOf(u);if(h===-1){a=l;break}else if(h>c){a=l;break}}else a=this.tabs.length;this.tabs.splice(a,0,o),this.renderTabs(),this.tabs.length===1&&this.selectTab(t)}removeTab(t){const e=this.tabs.findIndex(n=>n.id===t);if(e>-1){const n=this.tabs[e];if(n.contentElement.parentNode===this.tabContentArea&&(this.tabContentArea.removeChild(n.contentElement),n.contentElement.classList.remove("tab-content","active-content")),this.tabs.splice(e,1),this.renderTabs(),this.activeTabId===t)if(this.tabs.length>0){const s=Math.max(0,e-1);this.selectTab(this.tabs[s].id)}else this.activeTabId=null}}selectTab(t){this.tabs.find(n=>n.id===t)&&(this.activeTabId=t,this.renderTabs(),setTimeout(()=>{const n=this.tabs.findIndex(s=>s.id===t);n>-1&&this.tabList.children[n]&&this.tabList.children[n].scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},0),this.tabs.forEach(n=>{n.id===t?n.contentElement.classList.add("active-content"):n.contentElement.classList.remove("active-content")}))}renderTabs(){this.tabList.innerHTML="",this.tabs.forEach(t=>{const e=document.createElement("div");e.className="tab-item",t.id===this.activeTabId&&e.classList.add("active");const n=document.createElement("span");n.className="tab-icon",n.innerHTML=t.icon||"";const s=document.createElement("span");s.className="tab-title",s.textContent=t.title,e.appendChild(n),e.appendChild(s),e.title=t.title,e.addEventListener("mousedown",r=>this.handleTabMouseDown(r,t)),this.tabList.appendChild(e)})}handleTabMouseDown(t,e){if(t.stopPropagation(),this.tabs.length<=1)return;const n=t.clientX,s=t.clientY;let r=!1;const o=l=>{const u=l.clientX-n,h=l.clientY-s;!r&&(Math.abs(u)>10||Math.abs(h)>10)&&(r=!0,this.detachTab(e,l.clientX,l.clientY),c())},a=()=>{r||this.selectTab(e.id),c()},c=()=>{document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",a)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",a)}detachTab(t,e,n){this.removeTab(t.id);const s=`window_${t.id}`,r=ve.createWindow(s,t.title,{x:e-150,y:n-20,width:"300px",height:"auto",onClose:()=>{this.addTab(t.id,t.title,t.contentElement,t.icon)}});r.x=e-150,r.y=n-20,r.snapState={x:"none",y:"none"},r.element.style.transform=`translate3d(${r.x}px, ${r.y}px, 0)`,r.element.classList.add("dockable-window"),r.element.dataset.tabId=t.id,r.element.dataset.tabTitle=t.title,r.element.dataset.tabIcon=t.icon||"",t.contentElement.classList.remove("tab-content","active-content"),r.content.appendChild(t.contentElement),ve.showWindow(s),ve.bringToFront(s);const o=new MouseEvent("mousedown",{bubbles:!0,cancelable:!0,view:window,clientX:e,clientY:n});r.element.dispatchEvent(o)}setupDropZone(){document.addEventListener("mouseup",()=>{const t=document.querySelectorAll(".dockable-window"),e=this.tabHeader.getBoundingClientRect();t.forEach(n=>{var a;const s=n;if(s.style.display==="none")return;const r=s.getBoundingClientRect();if(!(r.right<e.left||r.left>e.right||r.bottom<e.top||r.top>e.bottom)){const c=s.dataset.tabId,l=s.dataset.tabTitle,u=s.dataset.tabIcon,h=(a=s.querySelector(".window-content"))==null?void 0:a.firstElementChild;c&&l&&h&&(this.addTab(c,l,h,u),ve.hideWindow(s.id))}})})}onClose(){}toggle(){ve.toggleWindow(this.id)}}function Kw(i,t,e){const n=ve.createWindow("time-window","Time & Speed",{x:20,y:window.innerHeight-280,width:"250px",snap:{x:"left",y:"bottom"},onClose:()=>{}});ve.hideWindow("time-window");const s=n.content;s.classList.add("time-window-content");const r=document.createElement("div");r.className="time-display",r.textContent=t.date,s.appendChild(r),r.style.cursor="pointer",r.title="Click to change date",r.onclick=()=>{Zw(e,t,f)};const o=document.createElement("div");o.className="speedometer-container",o.innerHTML=`
        <div class="gauge-arc"></div>
        <div class="gauge-needle"></div>
        <div class="digital-speed">0x</div>
        <div class="speedometer-interaction"></div>
    `,s.appendChild(o);const a=document.createElement("div");a.className="control-buttons",[{label:"<<",action:"rewind"},{label:"<",action:"reverse"},{label:"||",action:"pause"},{label:">",action:"play"},{label:">>",action:"forward"}].forEach(y=>{const v=document.createElement("div");v.className="control-btn",v.textContent=y.label,v.dataset.action=y.action,v.onclick=()=>p(y.action),a.appendChild(v)}),s.appendChild(a);const l=o.querySelector(".gauge-needle"),u=o.querySelector(".digital-speed"),h=o.querySelector(".speedometer-interaction");function d(y){if(y===0)return"PAUSED";const v=Math.abs(y);let x="";return v>=1e9?x=`${Math.round(v/1e9).toLocaleString()} b`:v>=1e6?x=`${Math.round(v/1e6).toLocaleString()} m`:v>=100?x=`${Math.round(v).toLocaleString()}x`:v>=10?x=`${v.toFixed(1)}x`:x=`${v.toFixed(2)}x`,x}function f(){const y=e.simulationSpeed;let v=0;if(y!==0){const x=Math.sign(y),M=Math.abs(y),S=Math.log10(M);v=Math.max(0,Math.min(10,S))/10*90*x}l.style.transform=`rotate(${v}deg)`,y===0?(u.textContent="PAUSED",u.style.color="#ffaa88"):(u.textContent=d(y),u.style.color="#aaccff"),a.querySelectorAll(".control-btn").forEach(x=>{x.classList.remove("active");const M=x.dataset.action;M==="pause"&&y===0&&x.classList.add("active"),M==="play"&&y===1&&x.classList.add("active"),M==="reverse"&&y===-1&&x.classList.add("active")}),r.textContent=`${t.date} ${t.time}`}t.updateSpeedometer=f,f();function m(y){if(y=Math.max(-90,Math.min(90,y)),Math.abs(y)<1)e.simulationSpeed=0,t.speedFactor="0x";else{const v=Math.sign(y),M=Math.abs(y)/90*10,S=v*10**M;e.simulationSpeed=S,t.speedFactor=d(S)}f()}function _(y){const v=h.getBoundingClientRect(),x=v.left+v.width/2,M=v.bottom,S=y.clientX-x,T=M-y.clientY,b=90-Math.atan2(T,S)*180/Math.PI;m(b)}let g=!1;h.addEventListener("mousedown",y=>{g=!0,_(y)}),window.addEventListener("mousemove",y=>{g&&_(y)}),window.addEventListener("mouseup",()=>{g=!1});function p(y){const v=e.simulationSpeed,x=v===0?0:Math.log10(Math.abs(v));switch(y){case"pause":e.simulationSpeed=0;break;case"play":e.simulationSpeed=1;break;case"reverse":e.simulationSpeed=-1;break;case"forward":if(v<0){const M=Math.floor(x)-1;M<0?e.simulationSpeed=1:e.simulationSpeed=-(10**M)}else if(v===0)e.simulationSpeed=1;else{const M=Math.min(10,Math.floor(x)+1);e.simulationSpeed=10**M}break;case"rewind":if(v>0){const M=Math.floor(x)-1;M<0?e.simulationSpeed=-1:e.simulationSpeed=10**M}else if(v===0)e.simulationSpeed=-1;else{const M=Math.min(10,Math.floor(x)+1);e.simulationSpeed=-(10**M)}break}t.speedFactor=d(e.simulationSpeed),f()}return{dateCtrl:{updateDisplay:()=>{},domElement:{querySelector:()=>null}},timeCtrl:{updateDisplay:()=>{}},stardateCtrl:{updateDisplay:()=>{}},speedDisplay:{update:f}}}function Zw(i,t,e){let n=document.querySelector(".date-modal-overlay");n||(Jw(i,t,e),n=document.querySelector(".date-modal-overlay"));const s=n.querySelector('input[type="datetime-local"]');if(s){const r=new Date(i.date),o=r.getTimezoneOffset()*6e4,a=new Date(r.getTime()-o).toISOString().slice(0,16);s.value=a}n.classList.add("active")}function Jw(i,t,e){const n=document.createElement("div");n.className="date-modal-overlay";const s=document.createElement("div");s.className="date-modal";const r=document.createElement("h3");r.textContent="Set Simulation Time";const o=document.createElement("input");o.type="datetime-local";const a=document.createElement("div");a.className="date-modal-buttons";const c=document.createElement("button");c.className="date-modal-btn",c.textContent="Cancel",c.onclick=()=>{n.classList.remove("active")};const l=document.createElement("button");l.className="date-modal-btn confirm",l.textContent="Set Time",l.onclick=()=>{if(o.value){const u=new Date(o.value);i.date=u,i.simulationSpeed=0,t.speedFactor="PAUSED",e(),n.classList.remove("active")}},a.appendChild(c),a.appendChild(l),s.appendChild(r),s.appendChild(o),s.appendChild(a),n.appendChild(s),document.body.appendChild(n),n.addEventListener("click",u=>{u.target===n&&n.classList.remove("active")})}function Qw(i,t,e,n,s,r,o,a,c,l,u,h,d,f,m){const _=new yh({title:"⚙️"});_.domElement.classList.add("main-gui"),_.close();const g={speedExponent:0,date:"",time:"",stardate:"",speedFactor:"0x",planetScaleDisplay:`${(1*In).toFixed(0)}x`,sunScaleDisplay:`${(1*no).toFixed(1)}x`,rotate:"Left Click + Drag",pan:"Right Click + Drag",zoom:"Scroll",focusEnter:"Double Click Object",focusExit:"Escape Key",fullScreen:"F11",scalePreset:"Artistic",timeWindow:!1,objectInfo:!1,musicWindow:!1,dock:!0,visualWindow:!1,explorerWindow:!1};let p={setScalePreset:w=>{}};Mi.addItem("objects","👆","Object Info",()=>{ve.toggleWindow("object-info")}),Mi.addItem("time","⏱️","Time & Speed",()=>{ve.toggleWindow("time-window")}),Mi.addItem("music","🎵","Music",()=>{ve.toggleWindow("music-window")});const{dateCtrl:y,timeCtrl:v,stardateCtrl:x,speedDisplay:M}=Kw(_,g,D),S=new uf("visual-tools","Visual Tools",{width:"320px",height:"auto",snap:{x:"right",y:"top"},tabOrder:["objects","orbits","magnetic","guides","stars","asterisms","system"]}),T=(w,O,G,$)=>{let R="",F=$;if(typeof G=="function"?(F=G,R=""):R=G,typeof F!="function")return;const H=document.createElement("div");H.style.width="100%",F(H),S.addTab(w,O,H,R)};T("objects","Bodies","🪐",w=>Ib(w,i,t)),T("orbits","Orbits","💫",w=>Ob(w,e,i,n)),T("magnetic","Magnetism","🧲",w=>Fb(w,d,i,f)),T("guides","Guides","📐",w=>Ub(w,t,i,h)),T("stars","Stars","✨",w=>$w(w,o)),T("asterisms","Asterisms",'<span style="font-size:1.5em;font-weight:bold">☆</span>',w=>Nb(w,s,r,u,m)),T("system","System","☀️",w=>{p=Yw(w,g,i,t,f,e,n)});const I=new uf("explorer-window","Explorer",{width:"500px",height:"auto",snap:{x:"right",y:"bottom"},tabOrder:["find","missions","events"]}),b=(w,O,G,$)=>{const R=document.createElement("div");R.style.width="100%",$(R),I.addTab(w,O,R,G)};return b("find","Find","🔍",w=>JS(w,i,t,o,c,l)),b("missions","Missions","🚀",w=>Bw(w,D)),b("events","Events","📅",w=>ZS(w,c,l,i,p.setScalePreset)),Mi.addItem("explorer","🧭","Explorer",()=>{I.toggle()}),Mi.addItem("visuals","👁️","Visual Tools",()=>{S.toggle()}),Mi.addItem("fullscreen","⛶","Full Screen",()=>{const w=document,O=document.documentElement;!w.fullscreenElement&&!w.webkitFullscreenElement?O.requestFullscreen?O.requestFullscreen():O.webkitRequestFullscreen&&O.webkitRequestFullscreen():w.exitFullscreen?w.exitFullscreen():w.webkitExitFullscreen&&w.webkitExitFullscreen()}),Lb(_,o,a,f,i,t,e,n,g),Hw(_,g),Vw(),qw(_,a),qS(_),$S(_),{uiState:g,dateCtrl:y,timeCtrl:v,stardateCtrl:x,speedDisplay:M}}function hf(i,t){const e=D.date.getFullYear(),n=String(D.date.getMonth()+1).padStart(2,"0"),s=String(D.date.getDate()).padStart(2,"0"),r=`${e}-${n}-${s}`;i.date=r,i.time=D.date.toLocaleTimeString();const o=new Date(D.date.getFullYear(),0,0),a=D.date.getTime()-o.getTime(),c=1e3*60*60*24,l=Math.floor(a/c);i.stardate=(D.date.getFullYear()+l/365).toFixed(2),D.simulationSpeed===0?i.speedFactor="0x":i.speedFactor=`${Math.round(D.simulationSpeed).toLocaleString()}x`;const u=t.dateCtrl.domElement.querySelector("input");u&&u.value!==r&&(u.value=r),t.dateCtrl.updateDisplay(),t.timeCtrl.updateDisplay(),t.stardateCtrl.updateDisplay(),t.speedDisplay&&t.speedDisplay.update();const h=ve.getWindow("time-window");h&&(i.timeWindow=h.element.style.display!=="none");const d=ve.getWindow("object-info");d&&(i.objectInfo=d.element.style.display!=="none");const f=ve.getWindow("music-window");f&&(i.musicWindow=f.element.style.display!=="none",f.update&&f.update());const m=ve.getWindow("visual-tools");m&&(i.visualWindow=m.element.style.display!=="none"),Mi.dock&&(i.dock=Mi.dock.style.display!=="none");const _=ve.getWindow("explorer-window");_&&(i.explorerWindow=_.element.style.display!=="none",i.explorerWindow&&Gw(D))}const df={Earth:[{name:"Moon",body:"Moon",category:"largest",radius:.27,diameter:3474.8,color:8947848,type:"real",period:27.3,texture:"/assets/textures/moon.jpg",tidallyLocked:!0,axialTilt:6.7,mass:7342e19,gravity:1.62,meanTemp:220,discoveryYear:"Prehistoric",discoveredBy:"Unknown"}],Jupiter:[{name:"Io",category:"largest",radius:.28,diameter:3643.2,color:16776960,type:"jovian",moonIndex:0,period:1.77,texture:"/assets/textures/io.png",tidallyLocked:!0,axialTilt:0,mass:8932e19,gravity:1.796,meanTemp:110,discoveryYear:1610,discoveredBy:"Galileo Galilei"},{name:"Europa",category:"largest",radius:.24,diameter:3121.6,color:16777215,type:"jovian",moonIndex:1,period:3.55,texture:"/assets/textures/europa.png",tidallyLocked:!0,axialTilt:0,mass:48e21,gravity:1.314,meanTemp:102,discoveryYear:1610,discoveredBy:"Galileo Galilei"},{name:"Ganymede",category:"largest",radius:.41,diameter:5268.2,color:14540253,type:"jovian",moonIndex:2,period:7.15,texture:"/assets/textures/ganymede.png",tidallyLocked:!0,axialTilt:0,mass:1482e20,gravity:1.428,meanTemp:110,discoveryYear:1610,discoveredBy:"Galileo Galilei",magneticField:{strength:2,tilt:176,color:65535}},{name:"Callisto",category:"largest",radius:.37,diameter:4820.6,color:11184810,type:"jovian",moonIndex:3,period:16.7,texture:"/assets/textures/callisto.png",tidallyLocked:!0,axialTilt:0,mass:1076e20,gravity:1.235,meanTemp:134,discoveryYear:1610,discoveredBy:"Galileo Galilei"}],Saturn:[{name:"Titan",category:"largest",radius:.4,diameter:5150,distance:.00816,color:16755200,type:"simple",period:15.95,texture:"/assets/textures/titan.png",tidallyLocked:!0,axialTilt:0,mass:1345e20,gravity:1.352,meanTemp:94,discoveryYear:1655,discoveredBy:"Christiaan Huygens"}],Neptune:[{name:"Triton",category:"largest",radius:.21,diameter:2706.8,color:16764108,type:"simple",distance:.00237,period:5.88,texture:"/assets/textures/triton.jpg",tidallyLocked:!0,axialTilt:0,mass:214e20,gravity:.779,meanTemp:38,discoveryYear:1846,discoveredBy:"William Lassell"}]},ff={Mars:[{name:"Phobos",category:"major",radius:.0018,diameter:22.2,color:8947848,type:"simple",distance:627e-7,period:.319,texture:"/assets/textures/phobos.jpg",tidallyLocked:!0,axialTilt:0,mass:10659e12,gravity:.0057,meanTemp:233,discoveryYear:1877,discoveredBy:"Asaph Hall"},{name:"Deimos",category:"major",radius:98e-5,diameter:12.4,color:10066329,type:"simple",distance:157e-6,period:1.263,texture:"/assets/textures/deimos.jpg",tidallyLocked:!0,axialTilt:0,mass:14762e11,gravity:.003,meanTemp:233,discoveryYear:1877,discoveredBy:"Asaph Hall"}],Saturn:[{name:"Mimas",category:"major",radius:.031,diameter:396.4,color:13421772,type:"simple",distance:.001239,period:.942,texture:"/assets/textures/mimas.jpg",tidallyLocked:!0,axialTilt:0,mass:375e17,gravity:.064,meanTemp:64,discoveryYear:1789,discoveredBy:"William Herschel"},{name:"Enceladus",category:"major",radius:.0397,diameter:504.2,color:16777215,type:"simple",distance:.00159,period:1.37,texture:"/assets/textures/enceladus.jpg",tidallyLocked:!0,axialTilt:0,mass:108e18,gravity:.113,meanTemp:75,discoveryYear:1789,discoveredBy:"William Herschel"},{name:"Tethys",category:"major",radius:.0835,diameter:1062.2,color:14540253,type:"simple",distance:.00197,period:1.888,texture:"/assets/textures/tethys.jpg",tidallyLocked:!0,axialTilt:0,mass:618e18,gravity:.146,meanTemp:86,discoveryYear:1684,discoveredBy:"Giovanni Cassini"},{name:"Dione",category:"major",radius:.088,diameter:1122.8,color:13421772,type:"simple",distance:.00252,period:2.737,texture:"/assets/textures/dione.jpg",tidallyLocked:!0,axialTilt:0,mass:11e20,gravity:.232,meanTemp:87,discoveryYear:1684,discoveredBy:"Giovanni Cassini"},{name:"Rhea",category:"major",radius:.12,diameter:1527.6,color:12303291,type:"simple",distance:.00352,period:4.518,texture:"/assets/textures/rhea.jpg",tidallyLocked:!0,axialTilt:0,mass:231e19,gravity:.264,meanTemp:76,discoveryYear:1672,discoveredBy:"Giovanni Cassini"},{name:"Iapetus",category:"major",radius:.115,diameter:1468.6,color:8943462,type:"simple",distance:.0238,period:79.33,texture:"/assets/textures/iapetus.jpg",tidallyLocked:!0,axialTilt:0,mass:181e19,gravity:.223,meanTemp:110,discoveryYear:1671,discoveredBy:"Giovanni Cassini"}],Uranus:[{name:"Miranda",category:"major",radius:.037,diameter:471.6,color:11184810,type:"simple",distance:866e-6,period:1.413,tidallyLocked:!0,axialTilt:0,mass:659e17,gravity:.079,meanTemp:60,discoveryYear:1948,discoveredBy:"Gerard Kuiper"},{name:"Ariel",category:"major",radius:.091,diameter:1157.8,color:13421772,type:"simple",distance:.00128,period:2.52,texture:"/assets/textures/ariel.jpg",tidallyLocked:!0,axialTilt:0,mass:135e19,gravity:.269,meanTemp:60,discoveryYear:1851,discoveredBy:"William Lassell"},{name:"Umbriel",category:"major",radius:.092,diameter:1169.4,color:7829367,type:"simple",distance:.00178,period:4.144,texture:"/assets/textures/umbriel.jpg",tidallyLocked:!0,axialTilt:0,mass:117e19,gravity:.234,meanTemp:75,discoveryYear:1851,discoveredBy:"William Lassell"},{name:"Titania",category:"major",radius:.123,diameter:1577.8,color:14535867,type:"simple",distance:.00291,period:8.706,texture:"/assets/textures/titania.jpg",tidallyLocked:!0,axialTilt:0,mass:353e19,gravity:.379,meanTemp:70,discoveryYear:1787,discoveredBy:"William Herschel"},{name:"Oberon",category:"major",radius:.119,diameter:1522.8,color:13417386,type:"simple",distance:.0039,period:13.463,texture:"/assets/textures/oberon.jpg",tidallyLocked:!0,axialTilt:0,mass:301e19,gravity:.346,meanTemp:75,discoveryYear:1787,discoveredBy:"William Herschel"}],Neptune:[{name:"Proteus",category:"major",radius:.033,diameter:420,color:8947848,type:"simple",distance:787e-6,period:1.122,texture:"/assets/textures/proteus.jpg",tidallyLocked:!0,axialTilt:0,mass:44e18,gravity:.07,meanTemp:51,discoveryYear:1989,discoveredBy:"Voyager 2"}]},pf={Jupiter:[{name:"Metis",category:"small",radius:.0034,diameter:43,color:11176038,type:"simple",distance:861e-6,period:.295,tidallyLocked:!0,axialTilt:0,mass:36e15,gravity:.005,discoveryYear:1979,discoveredBy:"Voyager 1"},{name:"Adrastea",category:"small",radius:.00129,diameter:16.4,color:11176038,type:"simple",distance:861e-6,period:.298,tidallyLocked:!0,axialTilt:0,mass:2e15,gravity:.002,discoveryYear:1979,discoveredBy:"Voyager 2"},{name:"Amalthea",category:"small",radius:.0166,diameter:167,color:14518374,type:"simple",distance:.00121,period:.498,texture:"/assets/textures/amalthea.jpg",tidallyLocked:!0,axialTilt:0,mass:208e16,gravity:.02,discoveryYear:1892,discoveredBy:"Edward Barnard"},{name:"Thebe",category:"small",radius:.0077,diameter:98.6,color:11171669,type:"simple",distance:.00148,period:.675,tidallyLocked:!0,axialTilt:0,mass:43e16,gravity:.013,discoveryYear:1979,discoveredBy:"Voyager 1"}],Saturn:[{name:"Pan",category:"small",radius:.00222,diameter:28.2,color:13421772,type:"simple",distance:894e-6,period:.575,tidallyLocked:!0,axialTilt:0,mass:495e13,gravity:.006,discoveryYear:1990,discoveredBy:"Mark Showalter"},{name:"Epimetheus",category:"small",radius:.00907,diameter:115.2,color:12303291,type:"simple",distance:.001013,period:.695,tidallyLocked:!0,axialTilt:0,mass:527e15,gravity:.018,discoveryYear:1980,discoveredBy:"John Fountain, Stephen Larson"},{name:"Janus",category:"small",radius:.014,diameter:179.8,color:12303291,type:"simple",distance:.001013,period:.695,tidallyLocked:!0,axialTilt:0,mass:19e17,gravity:.027,discoveryYear:1980,discoveredBy:"Various"},{name:"Hyperion",category:"small",radius:.0212,diameter:270,color:13413e3,type:"simple",distance:.00994,period:21.277,tidallyLocked:!1,axialTilt:0,mass:558e16,gravity:.04,discoveryYear:1848,discoveredBy:"William Bond"},{name:"Phoebe",category:"small",radius:.0168,diameter:213,color:6706500,type:"simple",distance:.0865,period:550.48,texture:"/assets/textures/phoebe.jpg",tidallyLocked:!1,axialTilt:0,mass:829e16,gravity:.039,discoveryYear:1899,discoveredBy:"William Pickering"}],Uranus:[{name:"Cordelia",category:"small",radius:.0032,diameter:40.2,color:8947848,type:"simple",distance:334e-6,period:.335,tidallyLocked:!0,axialTilt:0,mass:45e15,gravity:.008,discoveryYear:1986,discoveredBy:"Voyager 2"},{name:"Ophelia",category:"small",radius:.0034,diameter:42.8,color:8947848,type:"simple",distance:357e-6,period:.376,tidallyLocked:!0,axialTilt:0,mass:53e15,gravity:.009,discoveryYear:1986,discoveredBy:"Voyager 2"},{name:"Puck",category:"small",radius:.0127,diameter:162,color:7829367,type:"simple",distance:574e-6,period:.762,texture:"/assets/textures/puck.jpg",tidallyLocked:!0,axialTilt:0,mass:29e17,gravity:.029,discoveryYear:1985,discoveredBy:"Voyager 2"}],Neptune:[{name:"Naiad",category:"small",radius:.0052,diameter:66,color:8947848,type:"simple",distance:323e-6,period:.294,tidallyLocked:!0,axialTilt:0,mass:19e16,gravity:.011,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Thalassa",category:"small",radius:.0065,diameter:82,color:8947848,type:"simple",distance:336e-6,period:.311,tidallyLocked:!0,axialTilt:0,mass:37e16,gravity:.013,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Despina",category:"small",radius:.0118,diameter:150,color:8947848,type:"simple",distance:351e-6,period:.335,tidallyLocked:!0,axialTilt:0,mass:21e17,gravity:.023,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Galatea",category:"small",radius:.0138,diameter:176,color:8947848,type:"simple",distance:413e-6,period:.429,tidallyLocked:!0,axialTilt:0,mass:212e16,gravity:.025,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Larissa",category:"small",radius:.0153,diameter:194,color:7829367,type:"simple",distance:491e-6,period:.555,texture:"/assets/textures/larissa.jpg",tidallyLocked:!0,axialTilt:0,mass:42e17,gravity:.03,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Nereid",category:"small",radius:.0268,diameter:340,color:11184810,type:"simple",distance:.0367,period:360.14,tidallyLocked:!1,axialTilt:0,mass:31e18,gravity:.059,discoveryYear:1949,discoveredBy:"Gerard Kuiper"}]};function Js(i){const t=[];return df[i]&&t.push(...df[i]),ff[i]&&t.push(...ff[i]),pf[i]&&t.push(...pf[i]),t}const tE=[{name:"Mercury",category:"Terrestrial",body:"Mercury",radius:.38,color:11184810,period:88,texture:"/assets/textures/mercury.jpg",rotationPeriod:1408,axialTilt:.01,details:{mass:33e22,density:"5427 kg/m³",gravity:"0.38 g",albedo:"0.12",temp:"-173°C to 427°C",pressure:"~0 bar",solarDay:"176 days",siderealDay:"58.6 days",eccentricity:"0.205",inclination:"7.0°"},magneticField:{strength:1.5,tilt:0,color:65535}},{name:"Venus",category:"Terrestrial",body:"Venus",radius:.95,color:16763904,period:225,texture:"/assets/textures/venus.jpg",rotationPeriod:5832,axialTilt:177.4,details:{mass:487e22,density:"5243 kg/m³",gravity:"0.90 g",albedo:"0.75",temp:"462°C",pressure:"92 bar",solarDay:"116.75 days",siderealDay:"243 days",eccentricity:"0.007",inclination:"3.4°"}},{name:"Earth",category:"Terrestrial",body:"Earth",radius:1,color:2241535,period:365.25,texture:"/assets/textures/earth.jpg",cloudTexture:"/assets/textures/earth_clouds.png",rotationPeriod:24,axialTilt:23.4,details:{mass:597e22,density:"5514 kg/m³",gravity:"1.0 g",albedo:"0.30",temp:"-88°C to 58°C",pressure:"1.013 bar",solarDay:"24 h",siderealDay:"23h 56m",eccentricity:"0.017",inclination:"0.0°"},moons:Js("Earth"),magneticField:{strength:10,tilt:11.5,color:65535}},{name:"Mars",category:"Terrestrial",body:"Mars",radius:.53,color:16729088,period:687,texture:"/assets/textures/mars.jpg",rotationPeriod:24.6,axialTilt:25.2,details:{mass:642e21,density:"3933 kg/m³",gravity:"0.38 g",albedo:"0.16",temp:"-153°C to 20°C",pressure:"0.006 bar",solarDay:"24h 40m",siderealDay:"24h 37m",eccentricity:"0.094",inclination:"1.85°"},moons:Js("Mars")},{name:"Jupiter",category:"Gas Giant",body:"Jupiter",radius:11,color:13808780,period:4333,texture:"/assets/textures/jupiter.jpg",rotationPeriod:9.9,axialTilt:3.1,details:{mass:1898e24,density:"1326 kg/m³",gravity:"2.53 g",albedo:"0.34",temp:"-108°C",pressure:"n/a",solarDay:"9h 56m",siderealDay:"9h 55m",eccentricity:"0.049",inclination:"1.3°"},moons:Js("Jupiter"),magneticField:{strength:65,tilt:9.6,color:65535}},{name:"Saturn",category:"Gas Giant",body:"Saturn",radius:9,color:15645576,period:10759,texture:"/assets/textures/saturn.jpg",rotationPeriod:10.7,axialTilt:26.7,ring:{inner:11,outer:18,color:11176038,texture:"/assets/textures/saturn_ring.png"},details:{mass:568e24,density:"687 kg/m³",gravity:"1.07 g",albedo:"0.34",temp:"-139°C",pressure:"n/a",solarDay:"10h 33m",siderealDay:"10h 33m",eccentricity:"0.057",inclination:"2.49°"},moons:Js("Saturn"),magneticField:{strength:20,tilt:0,color:65535}},{name:"Uranus",category:"Ice Giant",body:"Uranus",radius:4,color:5230823,period:30687,texture:"/assets/textures/uranus.jpg",rotationPeriod:17.2,axialTilt:97.8,details:{mass:868e23,density:"1271 kg/m³",gravity:"0.89 g",albedo:"0.30",temp:"-197°C",pressure:"n/a",solarDay:"17h 14m",siderealDay:"17h 14m",eccentricity:"0.046",inclination:"0.77°"},moons:Js("Uranus"),magneticField:{strength:18,tilt:59,color:65535}},{name:"Neptune",category:"Ice Giant",body:"Neptune",radius:3.9,color:4944093,period:60190,texture:"/assets/textures/neptune.jpg",rotationPeriod:16.1,axialTilt:28.3,details:{mass:102e24,density:"1638 kg/m³",gravity:"1.14 g",albedo:"0.29",temp:"-201°C",pressure:"n/a (Gas Giant)",solarDay:"16h 6m",siderealDay:"16h 6m",eccentricity:"0.011",inclination:"1.77°"},moons:Js("Neptune"),magneticField:{strength:24,tilt:47,color:65535}}],eE=[{name:"Ceres",type:"dwarf",radius:.07,color:11184810,period:1682,texture:"/assets/textures/ceres.jpg",rotationPeriod:9.1,axialTilt:4,elements:{a:2.767,e:.079,i:10.59,Omega:80.33,w:73.51,M:77.37},details:{mass:9e20,density:"2162 kg/m³",gravity:"0.03 g",albedo:"0.09",temp:"-105°C to -38°C",pressure:"0",solarDay:"9h 4m",siderealDay:"9h 4m",eccentricity:"0.079",inclination:"10.59°"}},{name:"Pluto",type:"dwarf",body:"Pluto",radius:.18,color:14527112,period:90560,texture:"/assets/textures/pluto.png",rotationPeriod:153.3,axialTilt:122.5,details:{mass:13e21,density:"1860 kg/m³",gravity:"0.06 g",albedo:"0.5",temp:"-240°C to -218°C",pressure:"0.00001 bar",solarDay:"6.39 days",siderealDay:"6.39 days",eccentricity:"0.248",inclination:"17.16°"}},{name:"Haumea",type:"dwarf",radius:.13,color:15658734,period:103468,texture:"/assets/textures/haumea.png",rotationPeriod:3.9,axialTilt:0,elements:{a:43.18,e:.195,i:28.21,Omega:122.16,w:238.78,M:219.87},details:{mass:4e21,density:"1885 kg/m³",gravity:"0.04 g",albedo:"0.7",temp:"-241°C",pressure:"0",solarDay:"3.9 h",siderealDay:"3.9 h",eccentricity:"0.195",inclination:"28.21°"}},{name:"Makemake",type:"dwarf",radius:.11,color:14531481,period:112897,texture:"/assets/textures/makemake.jpg",rotationPeriod:22.5,axialTilt:0,elements:{a:45.43,e:.161,i:28.98,Omega:79.62,w:294.84,M:200},details:{mass:3e21,density:"1700 kg/m³",gravity:"0.05 g",albedo:"0.7",temp:"-243°C",pressure:"0",solarDay:"22.5 h",siderealDay:"22.5 h",eccentricity:"0.161",inclination:"28.98°"}},{name:"Eris",type:"dwarf",radius:.18,color:16777215,period:203830,texture:"/assets/textures/eris.jpg",rotationPeriod:25.9,axialTilt:0,elements:{a:67.86,e:.436,i:44.04,Omega:35.95,w:151.64,M:200},details:{mass:16e21,density:"2520 kg/m³",gravity:"0.08 g",albedo:"0.96",temp:"-243°C to -217°C",pressure:"0",solarDay:"25.9 h",siderealDay:"25.9 h",eccentricity:"0.436",inclination:"44.04°"}},{name:"Tesla Roadster",type:"dwarf",radius:1e-5,color:14883127,period:557,texture:"",rotationPeriod:4,axialTilt:0,elements:{a:1.3249,e:.25855,i:1.088,Omega:317.35,w:177.32,M:355,epoch:24581645e-1},details:{mass:"1250 kg",density:"n/a",gravity:"0 g",albedo:"Variable",temp:"Variable",pressure:"0",solarDay:"n/a",siderealDay:"n/a",eccentricity:"0.259",inclination:"1.09°"},visible:!1}];function nE(i){const t=new Uint8Array([255,200,0,255]),e=new Jf(t,1,1,Sn);e.needsUpdate=!0;const n=new ei({color:16777215,map:e,side:ai});return n.onBeforeCompile=s=>{s.uniforms.uTime=i.uTime,s.fragmentShader=s.fragmentShader.replace("#include <common>",`
      #include <common>
      uniform float uTime;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      `),s.fragmentShader=s.fragmentShader.replace("#include <map_fragment>",`
      #ifdef USE_MAP
        // Tweak parameters for more realistic "granulation" / boiling effect
        float timeScale = uTime * 0.15; // Slower animation
        float noiseScale = 0.005; // Subtle distortion to avoid "wobble"
        
        // Check if vMapUv is available, otherwise try vUv
        vec2 uvToUse = vMapUv; 
        
        // Higher frequency for smaller details (granules)
        float n1 = snoise(uvToUse * 25.0 + timeScale);
        float n2 = snoise(uvToUse * 30.0 - timeScale * 0.5);
        
        vec2 distortedUv = uvToUse + vec2(n1, n2) * noiseScale;
        
        vec4 sampledDiffuseColor = texture2D( map, distortedUv );
        diffuseColor *= sampledDiffuseColor;
      #endif
      `)},n}function iE(i,t){if(!i.ring)return;const e=new uc(i.ring.inner,i.ring.outer,128),n=e.attributes.position,s=new E;for(let a=0;a<n.count;a++){s.fromBufferAttribute(n,a);const l=(s.length()-i.ring.inner)/(i.ring.outer-i.ring.inner);e.attributes.uv.setXY(a,l,0)}let r;if(i.name==="Saturn"){const a=sE();r=new $n({map:a,side:mn,transparent:!0,opacity:.9,roughness:.8,metalness:.2})}else i.ring.texture?(r=new $n({side:mn,transparent:!0,opacity:1}),br.loadTexture(i.ring.texture,r,i.name)):r=new $n({color:i.ring.color,side:mn,transparent:!0,opacity:.8});const o=new Oe(e,r);o.rotation.x=Math.PI/2,t.add(o)}function sE(){const i=document.createElement("canvas");i.width=1024,i.height=1;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,1024,0);e.addColorStop(0,"rgba(30, 30, 30, 0.0)"),e.addColorStop(.1,"rgba(30, 30, 30, 0.1)"),e.addColorStop(.15,"rgba(40, 40, 40, 0.2)"),e.addColorStop(.25,"rgba(180, 170, 150, 0.8)"),e.addColorStop(.35,"rgba(200, 190, 170, 0.9)"),e.addColorStop(.4,"rgba(210, 200, 180, 1.0)"),e.addColorStop(.45,"rgba(190, 180, 160, 0.9)"),e.addColorStop(.5,"rgba(170, 160, 140, 0.8)"),e.addColorStop(.55,"rgba(20, 20, 20, 0.1)"),e.addColorStop(.58,"rgba(20, 20, 20, 0.1)"),e.addColorStop(.6,"rgba(160, 150, 130, 0.7)"),e.addColorStop(.7,"rgba(170, 160, 140, 0.8)"),e.addColorStop(.8,"rgba(160, 150, 130, 0.7)"),e.addColorStop(.85,"rgba(20, 20, 20, 0.2)"),e.addColorStop(.86,"rgba(20, 20, 20, 0.2)"),e.addColorStop(.88,"rgba(150, 140, 120, 0.6)"),e.addColorStop(1,"rgba(140, 130, 110, 0.0)"),t.fillStyle=e,t.fillRect(0,0,1024,1);const n=new tp(i);return n.wrapS=ln,n.wrapT=ln,n}function rE(i){const t=new qi(4.65,64,64),e={uTime:{value:0}},n=nE(e);br.loadTexture("/assets/textures/sun.jpg",n,"Sun");const s=new Oe(t,n);i.add(s),s.userData.customUniforms=e;const r=4.65*2.5,o=new ce().setFromPoints([new E(0,-r,0),new E(0,r,0)]),a=new hn({color:16777215,transparent:!0,opacity:.5}),c=new wn(o,a);return c.visible=D.showAxes,c.raycast=()=>{},s.add(c),s.axisLine=c,s}function oE(i,t){const e=[],n=[],s=rE(i);return[...tE,...eE].forEach(o=>{const a=new Se;o.visible===!1&&(a.visible=!1),i.add(a);const c=o.radius||1,l=new qi(c,32,32),u=new $n({color:o.color});mu(u),o.texture&&br.loadTexture(o.texture,u,o.name);const h=new Oe(l,u);if(h.castShadow=!0,h.receiveShadow=!0,a.add(h),o.name==="Tesla Roadster"&&(h.visible=!1),h.scale.setScalar(D.planetScale),o.axialTilt!=null){const x=o.axialTilt*Math.PI/180;h.rotation.z=x,o.name==="Earth"&&(h.rotation.z=0)}const d=c*2.5,f=new ce().setFromPoints([new E(0,-d,0),new E(0,d,0)]),m=new hn({color:16777215,transparent:!0,opacity:.5}),_=new wn(f,m);if(_.visible=D.showAxes,_.raycast=()=>{},h.add(_),h.axisLine=_,o.name==="Earth"?h.layers.set(1):h.layers.set(0),o.name==="Earth"&&o.cloudTexture&&o.radius){const x=new qi(o.radius*1.01,32,32),M=new $n({transparent:!0,opacity:1,depthWrite:!1});mu(M);const S=new Oe(x,M);S.visible=!1,S.layers.set(1),br.loadTexture(o.cloudTexture,M,"Earth Clouds",!1,null,"alphaMap"),h.add(S),o.cloudMesh=S}const g=new Se;a.add(g),iE(o,h);const p=lS(o,t),y=rS(o,a,g),v={group:a,mesh:h,data:o,moons:y,orbitLinesGroup:g,orbitLine:p};e.push(v),o.type==="dwarf"&&n.push(v)}),{planets:e,sun:s,dwarfPlanets:n}}function mf(i,t=null,e=null,n=null){var o;let s={x:0,y:0,z:0};if(D.coordinateSystem==="Geocentric"||D.coordinateSystem==="Tychonic"){const a=de(z.Earth,D.date);s={x:a.x,y:a.y,z:a.z}}else if(D.coordinateSystem==="Barycentric"){const a=de(z.SSB,D.date);s={x:a.x,y:a.y,z:a.z}}if(t){t.position.set(-s.x*_t,s.z*_t,s.y*_t),t.position.set(-s.x*_t,-s.z*_t,s.y*_t),n&&n.position.copy(t.position),e&&e.position.copy(t.position);const a=new Date("2000-01-01T12:00:00Z").getTime(),l=(D.date.getTime()-a)/(1e3*60*60),h=l/600*2*Math.PI;t.rotation.y=h,t.userData.customUniforms&&(t.userData.customUniforms.uTime.value=l*.1%1e4)}const r=(o=i.find(a=>a.orbitLine))==null?void 0:o.orbitLine;if(r&&r.parent){const a=r.parent;t&&a.position.copy(t.position)}i.forEach(a=>{let c={x:0,y:0,z:0};if(a.data.body){const m=a.data.body;c=de(z[m],D.date)}else a.data.elements&&(c=Zi(a.data.elements,D.date));const l=c.x-s.x,u=c.y-s.y,h=c.z-s.z;if(a.mesh.position.x=l*_t,a.mesh.position.z=-u*_t,a.mesh.position.y=h*_t,a.data.name==="Earth"&&e){e.target=a.mesh;const _=(a.data.radius||1)*D.planetScale,g=a.mesh.position.length(),p=_*4,y=Math.atan(p/g);e.angle=y*1.2,e.shadow.camera.updateProjectionMatrix()}if(!D.stop&&a.data.cloudMesh){const m=new Date("2000-01-01T12:00:00Z").getTime(),y=(D.date.getTime()-m)/(1e3*60*60)/240*2*Math.PI;a.data.cloudMesh.rotation.y=y}if(a.orbitLinesGroup&&a.orbitLinesGroup.position.copy(a.mesh.position),a.data.name==="Earth"){const _=ju(D.date)/24*2*Math.PI;a.mesh.rotation.y=_}else if(a.data.rotationPeriod){const m=new Date("2000-01-01T12:00:00Z").getTime(),p=(D.date.getTime()-m)/(1e3*60*60)/a.data.rotationPeriod*2*Math.PI;a.mesh.rotation.y=p}const f=a.data.name==="Earth"?1:0;a.mesh.layers.mask!==1<<f&&a.mesh.layers.set(f),oS(a,i),a.moons&&a.moons.forEach(m=>{m.mesh.layers.mask!==1<<f&&m.mesh.layers.set(f)})})}function aE(){const i=new Du,t=new rn(60,window.innerWidth/window.innerHeight,1e-7,1e12);t.position.set(0,200,400);const e=new Lu({antialias:!0,logarithmicDepthBuffer:!0});e.setSize(window.innerWidth,window.innerHeight),e.setPixelRatio(window.devicePixelRatio),e.toneMapping=vf,e.toneMappingExposure=1,e.shadowMap.enabled=!0,e.shadowMap.type=yf,document.body.appendChild(e.domElement);const n=new op(3355443,.5);n.layers.enable(1),i.add(n);const s=new rp(16777215,2,0,0);s.layers.set(0);const r=new sp(16777215,2);r.position.set(0,0,0),r.castShadow=!0,r.layers.set(1),r.shadow.mapSize.width=2048,r.shadow.mapSize.height=2048,r.shadow.bias=-1e-5,r.shadow.camera.near=.1,r.shadow.camera.far=500,r.angle=Math.PI/8,r.penumbra=.1,r.decay=0,r.distance=1e3,t.layers.enable(0),t.layers.enable(1);const o=new Se;i.add(o);const a=new Se;return i.add(a),window.addEventListener("resize",()=>{t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight)}),{scene:i,camera:t,renderer:e,orbitGroup:o,zodiacGroup:a,sunLight:s,shadowLight:r}}const gf=new Ee;class vh{constructor(t,e=64){nt(this,"bounds");nt(this,"capacity");nt(this,"points");nt(this,"children");nt(this,"divided");this.bounds=t,this.capacity=e,this.points=[],this.children=null,this.divided=!1}insert(t){return this.bounds.containsPoint(t.position)?this.points.length<this.capacity&&!this.divided?(this.points.push(t),!0):(this.divided||this.subdivide(),this.children?this.children[0].insert(t)||this.children[1].insert(t)||this.children[2].insert(t)||this.children[3].insert(t)||this.children[4].insert(t)||this.children[5].insert(t)||this.children[6].insert(t)||this.children[7].insert(t):!1):!1}subdivide(){const t=this.bounds.min,e=this.bounds.max,n=new E().addVectors(t,e).multiplyScalar(.5),s=[new Ee(t,n),new Ee(new E(n.x,t.y,t.z),new E(e.x,n.y,n.z)),new Ee(new E(t.x,t.y,n.z),new E(n.x,n.y,e.z)),new Ee(new E(n.x,t.y,n.z),new E(e.x,n.y,e.z)),new Ee(new E(t.x,n.y,t.z),new E(n.x,e.y,n.z)),new Ee(new E(n.x,n.y,t.z),new E(e.x,e.y,n.z)),new Ee(new E(t.x,n.y,n.z),new E(n.x,e.y,e.z)),new Ee(n,e)];this.children=s.map(r=>new vh(r,this.capacity)),this.divided=!0;for(const r of this.points)for(const o of this.children)if(o.insert(r))break;this.points=[]}queryRay(t,e=0,n=[]){if(e>0){if(gf.copy(this.bounds).expandByScalar(e),!t.intersectsBox(gf))return n}else if(!t.intersectsBox(this.bounds))return n;if(this.points.length>0)for(const s of this.points)n.push(s);if(this.children)for(const s of this.children)s.queryRay(t,e,n);return n}}const cE=[{id:0,file:"stars_data_0.bin",meta:"stars_meta_0.json"},{id:1,file:"stars_data_1.bin",meta:"stars_meta_1.json"},{id:2,file:"stars_data_2.bin",meta:"stars_meta_2.json"}];function lE(){const i=document.createElement("canvas");i.width=64,i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255, 255, 255, 1.0)"),e.addColorStop(.15,"rgba(255, 255, 255, 1.0)"),e.addColorStop(.4,"rgba(255, 255, 255, 0.2)"),e.addColorStop(1,"rgba(0, 0, 0, 0.0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new tp(i)}class uE{constructor(t){nt(this,"scene");nt(this,"starsGroup");nt(this,"chunks");nt(this,"texture");nt(this,"allStarData");nt(this,"brightness");nt(this,"currentBrightness");nt(this,"currentLimit");nt(this,"saturation");nt(this,"saturationUniform");nt(this,"loadingChunks");this.scene=t,this.starsGroup=new Se,this.starsGroup.name="StarsGroup",this.starsGroup.renderOrder=-1,this.scene.add(this.starsGroup),this.chunks=new Map,this.texture=lE(),this.allStarData=[],this.starsGroup.userData={starData:this.allStarData,manager:this},this.brightness=D.starBrightness,this.currentBrightness=this.brightness,this.currentLimit=6,this.saturation=D.starSaturation!==void 0?D.starSaturation:1,this.saturationUniform={value:this.saturation},this.loadingChunks=new Set}async loadChunk(t){if(this.chunks.has(t)||this.loadingChunks.has(t))return;this.loadingChunks.add(t);const e=cE[t];if(!e){this.loadingChunks.delete(t);return}try{const n=Date.now();Bt.log(`Loading star chunk ${t} (v=${n})...`);const[s,r]=await Promise.all([fetch(`/assets/${e.meta}?v=${n}`),fetch(`/assets/${e.file}?v=${n}`)]),o=await s.json(),a=await r.arrayBuffer(),c=new Float32Array(a),l=11,u=[],h=[],d=[],f=[];for(let y=0;y<o.length;y++){const v=y*l,x=c[v+0],M=c[v+1],S=c[v+2],T=c[v+3],I=c[v+4],b=c[v+5],w=c[v+6],O=c[v+7],G=c[v+8],$=c[v+9],R=c[v+10],F=Math.sqrt(x*x+M*M+S*S),H=Math.max(F,.1),U=-.921*R;let B=1,Y=1;R>2&&(Y=Math.max(.1,1-(R-2)*.1)),U<-6?(B=1+(U+6)*.1,B<.3&&(B=.3)):B=1+(U+6)**1.4*.3,B=Math.min(B,8),d.push(B);const[X,tt,et,j,Q,st,yt,Mt]=o[y],Nt=x*ke,W=S*ke,mt=-M*ke;u.push(Nt,W,mt),h.push(T*Y,I*Y,b*Y),f.push({id:X,name:tt,bayer:et,flamsteed:j,hip:Q,hd:st,spectralType:yt||"Unknown",constellation:Mt,luminosity:w,radius:O,mass:G,temperature:$,mag:R,distance:H,x,y:M,z:S})}const m=new ce;m.setAttribute("position",new xe(u,3)),m.setAttribute("color",new xe(h,3)),m.setAttribute("starSize",new xe(d,1));const _=new Uu({size:1,map:this.texture,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Ai,sizeAttenuation:!1,dithering:!0});_.onBeforeCompile=y=>{y.vertexShader=`
                    attribute float starSize;
                    ${y.vertexShader}
                `,y.vertexShader=y.vertexShader.replace("gl_PointSize = size;","gl_PointSize = starSize * size;"),y.uniforms.saturation=this.saturationUniform,y.fragmentShader=`
          uniform float saturation;
          ${y.fragmentShader}
        `,y.fragmentShader=y.fragmentShader.replace("#include <fog_fragment>",`
          #include <fog_fragment>
          
          // Saturation Boost "Bimodal Separation" Algorithm
          // Goal: Create distinct Red/Blue stars (Sci-Fi aesthetic) removing "muddy" middle ground.
          vec3 col = gl_FragColor.rgb;
          
          if (saturation > 0.1) {
             // 1. Analyze Spectral Bias (Red vs Blue channel dominance)
             // Green is usually the "luminance" anchor, so we pivot around it.
             float bias = col.r - col.b; // + is Warm (Red), - is Cool (Blue)
             
             // 2. Apply Divergence (Push colors apart)
             // As saturation increases, we force stars to "pick a side".
             float strength = saturation * 0.5; // Tunable power
             
             if (bias > 0.0) {
                 // WARN STAR -> Push Red/Gold
                 col.r *= (1.0 + strength * 0.6); 
                 col.g *= (1.0 + strength * 0.1); // Keep some gold
                 col.b *= (1.0 - strength * 0.8); // Kill Blue
             } else {
                 // COOL STAR -> Push Blue/Cyan
                 col.b *= (1.0 + strength * 1.2); // Blue needs more help to be visible
                 col.r *= (1.0 - strength * 0.8); // Kill Red
                 col.g *= (1.0 - strength * 0.2);
             }
             
             // 3. Global Saturation (Clean up grayness)
             // Standard vibrance pass to finish
             float lum = dot(col, vec3(0.299, 0.587, 0.114));
             col = mix(vec3(lum), col, 1.0 + saturation * 0.3);
             
             // 4. Energy Conservation (Prevent Darkening)
             // If we killed a channel, we lost brightness. Add it back.
             // We just enforce a floor based on original max intensity.
             float oldMax = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
             float newMax = max(col.r, max(col.g, col.b));
             if (newMax > 0.001) {
                col *= (oldMax / newMax);
             }
             
             // 5. Final Boost (Make colors pop)
             col *= 1.1; 
             
             gl_FragColor.rgb = col;
          }
          `),_.userData.shader=y};const g=new Qf(m,_);this.updateMaterial(g,this.currentBrightness),this.starsGroup.add(g);const p=this.buildOctree(f);this.chunks.set(t,{points:g,octree:p,data:f}),this.updateAllStarData(),D.magnitudeLimit!==void 0&&this.setMagnitudeLimit(D.magnitudeLimit)}catch(n){Bt.error(`Failed to load chunk ${t}`,n)}finally{this.loadingChunks.delete(t)}}unloadChunk(t){if(!this.chunks.has(t))return;const e=this.chunks.get(t);e&&(this.starsGroup.remove(e.points),e.points.geometry.dispose(),Array.isArray(e.points.material)?e.points.material.forEach(n=>n.dispose()):e.points.material.dispose()),this.chunks.delete(t),this.updateAllStarData()}buildOctree(t){const e=new E(1/0,1/0,1/0),n=new E(-1/0,-1/0,-1/0);t.forEach(r=>{const o=r.x*ke,a=r.z*ke,c=-r.y*ke;e.min(new E(o,a,c)),n.max(new E(o,a,c))}),e.subScalar(100),n.addScalar(100);const s=new vh(new Ee(e,n),64);return t.forEach((r,o)=>{const a=r.x*ke,c=r.z*ke,l=-r.y*ke;s.insert({position:new E(a,c,l),data:r,index:o})}),s}updateAllStarData(){this.allStarData.length=0,this.chunks.forEach(t=>{this.allStarData.push(...t.data)}),this.starsGroup.userData.starData=this.allStarData}getOctrees(){const t=[];return this.chunks.forEach(e=>{t.push(e.octree)}),t}setMagnitudeLimit(t){this.currentLimit=t,t>6.5&&this.loadChunk(1),t>8&&this.loadChunk(2),this.chunks.forEach((e,n)=>{var o;const s=e.data;if(!s||s.length===0)return;let r=0;if(s[0].mag>t)r=0;else if(s[s.length-1].mag<t)r=s.length;else{let a=0,c=s.length-1;for(;a<=c;){const l=Math.floor((a+c)/2);s[l].mag<t?(r=l+1,a=l+1):c=l-1}}(o=e.points)!=null&&o.geometry&&e.points.geometry.setDrawRange(0,r)})}setBrightness(t){this.brightness=t,this.applyBrightness(t)}applyBrightness(t){this.currentBrightness=t,this.chunks.forEach(e=>{this.updateMaterial(e.points,t)})}updateMaterial(t,e){if(!t||!t.material)return;e==null&&(e=.5);let n=0,s=0;if(e<=.5){const o=e/.5;s=.6+o*.25,n=.6+o*.6}else{const o=(e-.5)/.5;s=.85+o*.15,n=1.2+o*3.8}const r=t.material;if(r.opacity=s,r.color.setScalar(n),e>.5){const o=(e-.5)/.5;r.size=1+o*.5}else r.size=1}setSaturation(t){this.saturation=t,this.saturationUniform.value=t}}async function hE(i){const t=new uE(i);return await t.loadChunk(0),{stars:t.starsGroup,rawData:t.allStarData,manager:t}}async function dE(i,t,e){try{const s=await(await fetch("/assets/asterisms_lines_all.json")).json(),r=new Map;e.forEach(u=>{const h=u.x*ke,d=u.z*ke,f=-u.y*ke;r.set(u.id,new E(h,d,f))});const o=new hn({color:7842542,transparent:!0,opacity:.45,blending:Ai,depthWrite:!1}),a=new hn({color:12307694,transparent:!0,opacity:.35,blending:Ai,depthWrite:!1});let c=0,l=0;for(const[u,h]of Object.entries(s)){const d=Wm.includes(u),f=d?i:t,m=d?o:a;for(const _ of h){const g=[];let p=!1;for(const y of _){const v=r.get(y);v?g.push(v):p=!0}if(!p&&g.length>=2){const y=new ce().setFromPoints(g),v=new wn(y,m);v.userData={type:"asterism",id:u},f.add(v)}}d?c++:l++}Bt.log(`Created ${c} zodiacs and ${l} other asterisms.`)}catch(n){Bt.error("Error creating asterisms",n)}}async function fE(i){try{const t=await fetch("/assets/constellations.bounds.geojson");if(!t.ok)throw new Error("Failed to fetch constellation boundaries");const e=await t.json(),n=new hn({color:5596791,transparent:!0,opacity:.4,blending:Ai,depthWrite:!1}),s=ke*100;e.features.forEach(r=>{if(!r.geometry)return;const o=r.geometry.type,a=[];o==="Polygon"?a.push(...r.geometry.coordinates):o==="MultiPolygon"&&r.geometry.coordinates.forEach(c=>{a.push(...c)}),a.forEach(c=>{var d;const l=[];c.forEach(([f,m])=>{const _=fe.degToRad(f),g=fe.degToRad(m),p=s*Math.cos(g)*Math.cos(_),y=s*Math.cos(g)*Math.sin(_),v=s*Math.sin(g);l.push(new E(p,v,-y))});const u=new ce().setFromPoints(l),h=new wn(u,n);h.userData={type:"constellation",id:r.id||((d=r.properties)==null?void 0:d.id)},i.add(h)})}),Bt.log("Created constellation boundaries from GeoJSON")}catch(t){Bt.error("Failed to load constellations",t)}}class pE{constructor(){nt(this,"scene");nt(this,"camera");nt(this,"renderer");nt(this,"controls");nt(this,"universeGroup");nt(this,"config");nt(this,"planets");nt(this,"sun");nt(this,"orbitGroup");nt(this,"relativeOrbitGroup");nt(this,"zodiacGroup");nt(this,"starsRef");nt(this,"uiControls");nt(this,"rabbit");nt(this,"clock");nt(this,"magneticFieldTime");nt(this,"shadowLight");nt(this,"sunLight");nt(this,"magneticFieldsGroup");nt(this,"missionGroup");nt(this,"cleanupMissionInteraction");nt(this,"animate",()=>{requestAnimationFrame(this.animate),this.update()});nt(this,"jumpToDate",(t,e=!0)=>{const n=new Date(t);if(Number.isNaN(n.getTime())){Bt.error("Invalid date passed to jumpToDate:",t);return}D.date=n,e&&(D.simulationSpeed=0),mf(this.planets,this.sun,this.shadowLight),pu(this.universeGroup,this.planets,this.sun),za(this.orbitGroup,this.relativeOrbitGroup,this.planets,this.sun),Ts(this.scene,!0),du(this.camera,this.controls),this.uiControls&&hf(this.uiControls.uiState,this.uiControls),Bt.log(`Jumped to date: ${n.toISOString()}`)});this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.universeGroup=null,this.config=D,this.planets=[],this.sun=null,this.orbitGroup=null,this.relativeOrbitGroup=null,this.zodiacGroup=null,this.starsRef={value:null},this.uiControls=null,this.rabbit=null,this.clock=new o3,this.magneticFieldTime=0,this.shadowLight=null,this.sunLight=null,this.magneticFieldsGroup=null,this.missionGroup=null,this.cleanupMissionInteraction=null}onWindowResize(){!this.camera||!this.renderer||(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),uu(window.innerWidth,window.innerHeight),fS(window.innerWidth,window.innerHeight),cS(window.innerWidth,window.innerHeight),Qb(window.innerWidth,window.innerHeight))}async init(){try{Bt.log("White Rabbit Version: 1.3 (Class-based Init)");const t=document.getElementById("loading");t.textContent="Initializing... (Base: /)",t.textContent="Creating Scene...";const{scene:e,camera:n,renderer:s,orbitGroup:r,zodiacGroup:o,sunLight:a,shadowLight:c}=aE();this.scene=e,this.camera=n,this.renderer=s,this.orbitGroup=r,this.zodiacGroup=o,this.shadowLight=c,this.sunLight=a,window.scene=e,this.universeGroup=new Se,e.add(this.universeGroup),this.universeGroup.add(a),this.universeGroup.add(c),this.universeGroup.add(r),this.universeGroup.add(o),this.controls=new Yb(n,s.domElement,e,this.universeGroup),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,typeof this.controls.setGizmosVisible=="function"&&this.controls.setGizmosVisible(!1),window.controls=this.controls;const l=new Se;this.universeGroup.add(l),l.visible=D.showAsterisms,o.visible=D.showZodiacs;const u=new Se;this.universeGroup.add(u),u.visible=D.showConstellations;const h=new hc,d=IS(this.universeGroup,h),f=Kb(this.universeGroup);t.textContent="Loading Planets...";const{planets:m,sun:_}=oE(this.universeGroup,r);this.planets=m,this.sun=_,this.setupMagneticFields(),this.relativeOrbitGroup=new Se,this.universeGroup.add(this.relativeOrbitGroup),t.textContent="Setting up GUI...",this.uiControls=Qw(m,_,r,this.relativeOrbitGroup,o,l,this.starsRef,s,n,this.controls,d,f,this.magneticFieldsGroup,this.universeGroup,u),SS(n,m,_,this.starsRef,o,l),Am(n,this.controls,m,_),this.missionGroup=new Se,this.universeGroup.add(this.missionGroup),Mm(this.missionGroup),fh(this.missionGroup),this.cleanupMissionInteraction=bm(this.camera,this.missionGroup,this.renderer.domElement),window.updateMissions=()=>{dh(),mh()},window.addEventListener("mission-visibility-changed",g=>{const p=g.detail;if(p&&p.missionId==="teslaRoadster"){const y=this.planets.find(v=>v.data.name==="Tesla Roadster");if(y){const v=D.showMissions.teslaRoadster;y.group&&(y.group.visible=v),y.orbitLine&&(y.orbitLine.visible=v)}}}),za(r,this.relativeOrbitGroup,m,_),window.SimulationControl=new kb(m,_,r,o,l,this.starsRef,n,this.controls,d,f,this.magneticFieldsGroup,this.universeGroup,this.jumpToDate),uu(window.innerWidth,window.innerHeight),this.rabbit=hS(s),t.style.opacity="0",t.style.pointerEvents="none",setTimeout(()=>{gn.init()},100),hE(this.universeGroup).then(({stars:g,rawData:p})=>{g&&(this.starsRef.value=g,this.starsRef.value=g,dE(o,l,p),fE(u),NS(d))}).catch(g=>Bt.error("Error loading stars:",g)),this.animate()}catch(t){Bt.error("Initialization error:",t);const e=document.getElementById("loading");e&&(e.textContent=`Error loading simulation: ${t instanceof Error?t.message:"Unknown error"}`,e.style.color="red")}}setupMagneticFields(){if(this.magneticFieldsGroup=new Se,this.magneticFieldsGroup.visible=D.showMagneticFields,!this.universeGroup)return;this.universeGroup.add(this.magneticFieldsGroup);const t=Zb(this.sun);t&&(t.visible=D.showSunMagneticFieldBasic,this.universeGroup.add(t));const e=Jb(this.sun);e&&(e.visible=D.showSunMagneticField,this.universeGroup.add(e)),this.planets.forEach(n=>{if(n.data.magneticField){const s=$0(n.data,n.data.radius);s&&n.mesh.add(s)}n.moons.forEach(s=>{if(s.data.magneticField){const r=$0(s.data,s.data.radius);r&&s.mesh.add(r)}})})}update(){var e;if(!this.scene||!this.camera||!this.renderer)return;const t=this.clock.getDelta();if(!D.stop){const n=D.simulationSpeed*t;D.date.setTime(D.date.getTime()+n*1e3),this.magneticFieldTime+=t*D.simulationSpeed*25e-5}hf(this.uiControls.uiState,this.uiControls),mf(this.planets,this.sun,this.shadowLight,this.sunLight),pu(this.universeGroup,this.planets,this.sun),za(this.orbitGroup,this.relativeOrbitGroup,this.planets,this.sun),uS(this.orbitGroup,this.planets),this.planets,this.rabbit.update(t),this.controls.update(),this.config.coordinateSystem&&(((e=this.missionGroup)==null?void 0:e.children.length)??0)>0&&(Ts(this.scene),xm(this.config.date.getTime()),ph(this.config.date)),du(this.camera,this.controls),this.renderer.render(this.scene,this.camera),this.updateMagneticFieldsAnimations(),this.rabbit.render()}updateMagneticFieldsAnimations(){if(this.universeGroup){const t=this.universeGroup.children.find(n=>n.name==="MagneticField");t!=null&&t.visible&&t.userData.material&&(t.userData.material.uniforms.uTime.value=this.magneticFieldTime,this.sun&&(t.rotation.y=this.sun.rotation.y));const e=this.universeGroup.children.find(n=>n.name==="SunMagneticFieldBasic");if(e!=null&&e.visible){const n=this.magneticFieldTime+e.userData.timeOffset;if(e.userData.shaderUniforms){const s=new Date("2000-01-01T12:00:00Z").getTime(),o=(D.date.getTime()-s)/(1e3*60*60);e.userData.shaderUniforms.uTime.value=o,this.sun&&(e.rotation.y=this.sun.rotation.y)}e.children.forEach(s=>{if(s.userData.isPolar&&s.userData.basePoints){const r=s.geometry.attributes.position,o=s.userData.basePoints;for(let a=0;a<o.length;a++){const c=o[a],l=Math.sin(n*.3+a*.1)*.1,u=new E(l,0,l);r.setXYZ(a,c.x+u.x,c.y+u.y,c.z+u.z)}r.needsUpdate=!0}})}}}}window.onerror=(i,t,e,n,s)=>{const r=document.getElementById("loading");r&&(r.textContent=`Error: ${i} at ${t}:${e}`,r.style.color="red")};(async()=>await new pE().init())();
