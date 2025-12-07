var Su=Object.defineProperty;var bu=(n,t,e)=>t in n?Su(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var $o=(n,t,e)=>bu(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mo="160",Eu=0,qo=1,wu=2,sh=1,rh=2,wi=3,Li=0,$e=1,Je=2,Xi=0,cn=1,Di=2,Yo=3,jo=4,Tu=5,an=100,Au=101,Cu=102,Zo=103,Ko=104,Pu=200,Ru=201,Lu=202,Du=203,Xa=204,$a=205,Iu=206,Uu=207,Fu=208,Nu=209,Ou=210,zu=211,Bu=212,Gu=213,ku=214,Hu=0,Vu=1,Wu=2,Sr=3,Xu=4,$u=5,qu=6,Yu=7,ah=0,ju=1,Zu=2,$i=0,Ku=1,Ju=2,Qu=3,oh=4,td=5,ed=6,lh=300,Yn=301,jn=302,qa=303,Ya=304,Dr=306,br=1e3,We=1001,ja=1002,Pe=1003,Jo=1004,ia=1005,si=1006,id=1007,bs=1008,qi=1009,nd=1010,sd=1011,So=1012,ch=1013,Hi=1014,Vi=1015,Es=1016,hh=1017,uh=1018,hn=1020,rd=1021,ai=1023,ad=1024,od=1025,un=1026,Zn=1027,ld=1028,dh=1029,cd=1030,fh=1031,ph=1033,na=33776,sa=33777,ra=33778,aa=33779,Qo=35840,tl=35841,el=35842,il=35843,mh=36196,nl=37492,sl=37496,rl=37808,al=37809,ol=37810,ll=37811,cl=37812,hl=37813,ul=37814,dl=37815,fl=37816,pl=37817,ml=37818,gl=37819,_l=37820,vl=37821,oa=36492,yl=36494,xl=36495,hd=36283,Ml=36284,Sl=36285,bl=36286,gh=3e3,dn=3001,ud=3200,dd=3201,_h=0,fd=1,oi="",Ce="srgb",Ii="srgb-linear",bo="display-p3",Ir="display-p3-linear",Er="linear",le="srgb",wr="rec709",Tr="p3",_n=7680,El=519,pd=512,md=513,gd=514,vh=515,_d=516,vd=517,yd=518,xd=519,Za=35044,wl="300 es",Ka=1035,Pi=2e3,Ar=2001;class gn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tl=1234567;const _s=Math.PI/180,Kn=180/Math.PI;function Ri(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]).toLowerCase()}function Re(n,t,e){return Math.max(t,Math.min(e,n))}function Eo(n,t){return(n%t+t)%t}function Md(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Sd(n,t,e){return n!==t?(e-n)/(t-n):0}function vs(n,t,e){return(1-e)*n+e*t}function bd(n,t,e,i){return vs(n,t,1-Math.exp(-e*i))}function Ed(n,t=1){return t-Math.abs(Eo(n,t*2)-t)}function wd(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Td(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Ad(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Cd(n,t){return n+Math.random()*(t-n)}function Pd(n){return n*(.5-Math.random())}function Rd(n){n!==void 0&&(Tl=n);let t=Tl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ld(n){return n*_s}function Dd(n){return n*Kn}function Ja(n){return(n&n-1)===0&&n!==0}function Id(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Cr(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ud(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),f=a((t-i)/2),p=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*h,l*u,l*f,o*c);break;case"YZY":n.set(l*f,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*f,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*p,o*c);break;case"YXY":n.set(l*p,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function gi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ee(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const oe={DEG2RAD:_s,RAD2DEG:Kn,generateUUID:Ri,clamp:Re,euclideanModulo:Eo,mapLinear:Md,inverseLerp:Sd,lerp:vs,damp:bd,pingpong:Ed,smoothstep:wd,smootherstep:Td,randInt:Ad,randFloat:Cd,randFloatSpread:Pd,seededRandom:Rd,degToRad:Ld,radToDeg:Dd,isPowerOfTwo:Ja,ceilPowerOfTwo:Id,floorPowerOfTwo:Cr,setQuaternionFromProperEuler:Ud,normalize:ee,denormalize:gi};class _t{constructor(t=0,e=0){_t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,i,s,r,a,o,l,c){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c)}set(t,e,i,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],d=s[6],y=s[1],v=s[4],x=s[7],C=s[2],T=s[5],P=s[8];return r[0]=a*_+o*y+l*C,r[3]=a*m+o*v+l*T,r[6]=a*d+o*x+l*P,r[1]=c*_+h*y+u*C,r[4]=c*m+h*v+u*T,r[7]=c*d+h*x+u*P,r[2]=f*_+p*y+g*C,r[5]=f*m+p*v+g*T,r[8]=f*d+p*x+g*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,p=c*r-a*l,g=e*u+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*c-h*i)*_,t[2]=(o*i-s*a)*_,t[3]=f*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(i*l-c*e)*_,t[8]=(a*e-i*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(la.makeScale(t,e)),this}rotate(t){return this.premultiply(la.makeRotation(-t)),this}translate(t,e){return this.premultiply(la.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const la=new qt;function yh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ws(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Fd(){const n=ws("canvas");return n.style.display="block",n}const Al={};function ys(n){n in Al||(Al[n]=!0,console.warn(n))}const Cl=new qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pl=new qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Os={[Ii]:{transfer:Er,primaries:wr,toReference:n=>n,fromReference:n=>n},[Ce]:{transfer:le,primaries:wr,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Ir]:{transfer:Er,primaries:Tr,toReference:n=>n.applyMatrix3(Pl),fromReference:n=>n.applyMatrix3(Cl)},[bo]:{transfer:le,primaries:Tr,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Pl),fromReference:n=>n.applyMatrix3(Cl).convertLinearToSRGB()}},Nd=new Set([Ii,Ir]),ie={enabled:!0,_workingColorSpace:Ii,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!Nd.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=Os[t].toReference,s=Os[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Os[n].primaries},getTransfer:function(n){return n===oi?Er:Os[n].transfer}};function Hn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ca(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vn;class xh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{vn===void 0&&(vn=ws("canvas")),vn.width=t.width,vn.height=t.height;const i=vn.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=vn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ws("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Hn(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Hn(e[i]/255)*255):e[i]=Hn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Od=0;class Mh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Ri(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ha(s[a].image)):r.push(ha(s[a]))}else r=ha(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function ha(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?xh.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zd=0;class Oe extends gn{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,i=We,s=We,r=si,a=bs,o=ai,l=qi,c=Oe.DEFAULT_ANISOTROPY,h=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=Ri(),this.name="",this.source=new Mh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ys("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===dn?Ce:oi),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case br:t.x=t.x-Math.floor(t.x);break;case We:t.x=t.x<0?0:1;break;case ja:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case br:t.y=t.y-Math.floor(t.y);break;case We:t.y=t.y<0?0:1;break;case ja:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ys("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ce?dn:gh}set encoding(t){ys("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===dn?Ce:oi}}Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=lh;Oe.DEFAULT_ANISOTROPY=1;class ce{constructor(t=0,e=0,i=0,s=1){ce.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,x=(p+1)/2,C=(d+1)/2,T=(h+f)/4,P=(u+_)/4,G=(g+m)/4;return v>x&&v>C?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=P/i):x>C?x<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),i=T/s,r=G/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=P/r,s=G/r),this.set(i,s,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(f-h)/y,this.w=Math.acos((c+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bd extends gn{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ce(0,0,t,e),this.scissorTest=!1,this.viewport=new ce(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(ys("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===dn?Ce:oi),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:si,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Oe(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Mh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends Bd{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Sh extends Oe{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=We,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gd extends Oe{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=We,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ts{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const f=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==f||c!==p||h!==g){let m=1-o;const d=l*f+c*p+h*g+u*_,y=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){const C=Math.sqrt(v),T=Math.atan2(C,d*y);m=Math.sin(m*T)/C,o=Math.sin(o*T)/C}const x=o*y;if(l=l*m+f*x,c=c*m+p*x,h=h*m+g*x,u=u*m+_*x,m===1-o){const C=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=C,c*=C,h*=C,u*=C}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*p-c*f,t[e+1]=l*g+h*f+c*u-o*p,t[e+2]=c*g+h*p+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Re(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class E{constructor(t=0,e=0,i=0){E.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ua.copy(this).projectOnVector(t),this.sub(ua)}reflect(t){return this.sub(ua.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ua=new E,Rl=new ts;class Ue{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(li.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(li.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=li.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,li):li.fromBufferAttribute(r,a),li.applyMatrix4(t.matrixWorld),this.expandByPoint(li);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zs.copy(i.boundingBox)),zs.applyMatrix4(t.matrixWorld),this.union(zs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,li),li.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ss),Bs.subVectors(this.max,ss),yn.subVectors(t.a,ss),xn.subVectors(t.b,ss),Mn.subVectors(t.c,ss),Ni.subVectors(xn,yn),Oi.subVectors(Mn,xn),Qi.subVectors(yn,Mn);let e=[0,-Ni.z,Ni.y,0,-Oi.z,Oi.y,0,-Qi.z,Qi.y,Ni.z,0,-Ni.x,Oi.z,0,-Oi.x,Qi.z,0,-Qi.x,-Ni.y,Ni.x,0,-Oi.y,Oi.x,0,-Qi.y,Qi.x,0];return!da(e,yn,xn,Mn,Bs)||(e=[1,0,0,0,1,0,0,0,1],!da(e,yn,xn,Mn,Bs))?!1:(Gs.crossVectors(Ni,Oi),e=[Gs.x,Gs.y,Gs.z],da(e,yn,xn,Mn,Bs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,li).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(li).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const xi=[new E,new E,new E,new E,new E,new E,new E,new E],li=new E,zs=new Ue,yn=new E,xn=new E,Mn=new E,Ni=new E,Oi=new E,Qi=new E,ss=new E,Bs=new E,Gs=new E,tn=new E;function da(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){tn.fromArray(n,r);const o=s.x*Math.abs(tn.x)+s.y*Math.abs(tn.y)+s.z*Math.abs(tn.z),l=t.dot(tn),c=e.dot(tn),h=i.dot(tn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const kd=new Ue,rs=new E,fa=new E;class es{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):kd.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rs.subVectors(t,this.center);const e=rs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(rs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rs.copy(t.center).add(fa)),this.expandByPoint(rs.copy(t.center).sub(fa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Mi=new E,pa=new E,ks=new E,zi=new E,ma=new E,Hs=new E,ga=new E;class Ur{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mi.copy(this.origin).addScaledVector(this.direction,e),Mi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){pa.copy(t).add(e).multiplyScalar(.5),ks.copy(e).sub(t).normalize(),zi.copy(this.origin).sub(pa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ks),o=zi.dot(this.direction),l=-zi.dot(ks),c=zi.lengthSq(),h=Math.abs(1-a*a);let u,f,p,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,p=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(pa).addScaledVector(ks,f),p}intersectSphere(t,e){Mi.subVectors(t.center,this.origin);const i=Mi.dot(this.direction),s=Mi.dot(Mi)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Mi)!==null}intersectTriangle(t,e,i,s,r){ma.subVectors(e,t),Hs.subVectors(i,t),ga.crossVectors(ma,Hs);let a=this.direction.dot(ga),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,t);const l=o*this.direction.dot(Hs.crossVectors(zi,Hs));if(l<0)return null;const c=o*this.direction.dot(ma.cross(zi));if(c<0||l+c>a)return null;const h=-o*zi.dot(ga);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class kt{constructor(t,e,i,s,r,a,o,l,c,h,u,f,p,g,_,m){kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c,h,u,f,p,g,_,m)}set(t,e,i,s,r,a,o,l,c,h,u,f,p,g,_,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new kt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Sn.setFromMatrixColumn(t,0).length(),r=1/Sn.setFromMatrixColumn(t,1).length(),a=1/Sn.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=f-_*c,e[9]=-o*l,e[2]=_-f*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-p,e[8]=f*c+_,e[1]=l*u,e[5]=_*c+f,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Hd,t,Vd)}lookAt(t,e,i){const s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),Bi.crossVectors(i,je),Bi.lengthSq()===0&&(Math.abs(i.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),Bi.crossVectors(i,je)),Bi.normalize(),Vs.crossVectors(je,Bi),s[0]=Bi.x,s[4]=Vs.x,s[8]=je.x,s[1]=Bi.y,s[5]=Vs.y,s[9]=je.y,s[2]=Bi.z,s[6]=Vs.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],y=i[3],v=i[7],x=i[11],C=i[15],T=s[0],P=s[4],G=s[8],M=s[12],b=s[1],O=s[5],$=s[9],J=s[13],L=s[2],F=s[6],I=s[10],H=s[14],B=s[3],j=s[7],W=s[11],K=s[15];return r[0]=a*T+o*b+l*L+c*B,r[4]=a*P+o*O+l*F+c*j,r[8]=a*G+o*$+l*I+c*W,r[12]=a*M+o*J+l*H+c*K,r[1]=h*T+u*b+f*L+p*B,r[5]=h*P+u*O+f*F+p*j,r[9]=h*G+u*$+f*I+p*W,r[13]=h*M+u*J+f*H+p*K,r[2]=g*T+_*b+m*L+d*B,r[6]=g*P+_*O+m*F+d*j,r[10]=g*G+_*$+m*I+d*W,r[14]=g*M+_*J+m*H+d*K,r[3]=y*T+v*b+x*L+C*B,r[7]=y*P+v*O+x*F+C*j,r[11]=y*G+v*$+x*I+C*W,r[15]=y*M+v*J+x*H+C*K,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*l*u-s*c*u-r*o*f+i*c*f+s*o*p-i*l*p)+_*(+e*l*p-e*c*f+r*a*f-s*a*p+s*c*h-r*l*h)+m*(+e*c*u-e*o*p-r*a*u+i*a*p+r*o*h-i*c*h)+d*(-s*o*h-e*l*u+e*o*f+s*a*u-i*a*f+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],y=u*m*c-_*f*c+_*l*p-o*m*p-u*l*d+o*f*d,v=g*f*c-h*m*c-g*l*p+a*m*p+h*l*d-a*f*d,x=h*_*c-g*u*c+g*o*p-a*_*p-h*o*d+a*u*d,C=g*u*l-h*_*l-g*o*f+a*_*f+h*o*m-a*u*m,T=e*y+i*v+s*x+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return t[0]=y*P,t[1]=(_*f*r-u*m*r-_*s*p+i*m*p+u*s*d-i*f*d)*P,t[2]=(o*m*r-_*l*r+_*s*c-i*m*c-o*s*d+i*l*d)*P,t[3]=(u*l*r-o*f*r-u*s*c+i*f*c+o*s*p-i*l*p)*P,t[4]=v*P,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*d+e*f*d)*P,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*d-e*l*d)*P,t[7]=(a*f*r-h*l*r+h*s*c-e*f*c-a*s*p+e*l*p)*P,t[8]=x*P,t[9]=(g*u*r-h*_*r-g*i*p+e*_*p+h*i*d-e*u*d)*P,t[10]=(a*_*r-g*o*r+g*i*c-e*_*c-a*i*d+e*o*d)*P,t[11]=(h*o*r-a*u*r-h*i*c+e*u*c+a*i*p-e*o*p)*P,t[12]=C*P,t[13]=(h*_*s-g*u*s+g*i*f-e*_*f-h*i*m+e*u*m)*P,t[14]=(g*o*s-a*_*s-g*i*l+e*_*l+a*i*m-e*o*m)*P,t[15]=(a*u*s-h*o*s+h*i*l-e*u*l-a*i*f+e*o*f)*P,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,p=r*h,g=r*u,_=a*h,m=a*u,d=o*u,y=l*c,v=l*h,x=l*u,C=i.x,T=i.y,P=i.z;return s[0]=(1-(_+d))*C,s[1]=(p+x)*C,s[2]=(g-v)*C,s[3]=0,s[4]=(p-x)*T,s[5]=(1-(f+d))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+v)*P,s[9]=(m-y)*P,s[10]=(1-(f+_))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Sn.set(s[0],s[1],s[2]).length();const a=Sn.set(s[4],s[5],s[6]).length(),o=Sn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],ci.copy(this);const c=1/r,h=1/a,u=1/o;return ci.elements[0]*=c,ci.elements[1]*=c,ci.elements[2]*=c,ci.elements[4]*=h,ci.elements[5]*=h,ci.elements[6]*=h,ci.elements[8]*=u,ci.elements[9]*=u,ci.elements[10]*=u,e.setFromRotationMatrix(ci),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=Pi){const l=this.elements,c=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s);let p,g;if(o===Pi)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ar)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Pi){const l=this.elements,c=1/(e-t),h=1/(i-s),u=1/(a-r),f=(e+t)*c,p=(i+s)*h;let g,_;if(o===Pi)g=(a+r)*u,_=-2*u;else if(o===Ar)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Sn=new E,ci=new kt,Hd=new E(0,0,0),Vd=new E(1,1,1),Bi=new E,Vs=new E,je=new E,Ll=new kt,Dl=new ts;class Fr{constructor(t=0,e=0,i=0,s=Fr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Re(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Re(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Re(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ll.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ll,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dl.setFromEuler(this),this.setFromQuaternion(Dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fr.DEFAULT_ORDER="XYZ";class wo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Wd=0;const Il=new E,bn=new ts,Si=new kt,Ws=new E,as=new E,Xd=new E,$d=new ts,Ul=new E(1,0,0),Fl=new E(0,1,0),Nl=new E(0,0,1),qd={type:"added"},Yd={type:"removed"};class Se extends gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Se.DEFAULT_UP.clone();const t=new E,e=new Fr,i=new ts,s=new E(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new kt},normalMatrix:{value:new qt}}),this.matrix=new kt,this.matrixWorld=new kt,this.matrixAutoUpdate=Se.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bn.setFromAxisAngle(t,e),this.quaternion.multiply(bn),this}rotateOnWorldAxis(t,e){return bn.setFromAxisAngle(t,e),this.quaternion.premultiply(bn),this}rotateX(t){return this.rotateOnAxis(Ul,t)}rotateY(t){return this.rotateOnAxis(Fl,t)}rotateZ(t){return this.rotateOnAxis(Nl,t)}translateOnAxis(t,e){return Il.copy(t).applyQuaternion(this.quaternion),this.position.add(Il.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ul,t)}translateY(t){return this.translateOnAxis(Fl,t)}translateZ(t){return this.translateOnAxis(Nl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ws.copy(t):Ws.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(as,Ws,this.up):Si.lookAt(Ws,as,this.up),this.quaternion.setFromRotationMatrix(Si),s&&(Si.extractRotation(s.matrixWorld),bn.setFromRotationMatrix(Si),this.quaternion.premultiply(bn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(qd)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Si.multiply(t.parent.matrixWorld)),t.applyMatrix4(Si),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,t,Xd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,$d,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Se.DEFAULT_UP=new E(0,1,0);Se.DEFAULT_MATRIX_AUTO_UPDATE=!0;Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hi=new E,bi=new E,_a=new E,Ei=new E,En=new E,wn=new E,Ol=new E,va=new E,ya=new E,xa=new E;let Xs=!1;class ri{constructor(t=new E,e=new E,i=new E){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),hi.subVectors(t,e),s.cross(hi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){hi.subVectors(s,e),bi.subVectors(i,e),_a.subVectors(t,e);const a=hi.dot(hi),o=hi.dot(bi),l=hi.dot(_a),c=bi.dot(bi),h=bi.dot(_a),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ei)===null?!1:Ei.x>=0&&Ei.y>=0&&Ei.x+Ei.y<=1}static getUV(t,e,i,s,r,a,o,l){return Xs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Xs=!0),this.getInterpolation(t,e,i,s,r,a,o,l)}static getInterpolation(t,e,i,s,r,a,o,l){return this.getBarycoord(t,e,i,s,Ei)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ei.x),l.addScaledVector(a,Ei.y),l.addScaledVector(o,Ei.z),l)}static isFrontFacing(t,e,i,s){return hi.subVectors(i,e),bi.subVectors(t,e),hi.cross(bi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hi.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),hi.cross(bi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ri.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ri.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return Xs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Xs=!0),ri.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return ri.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return ri.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ri.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;En.subVectors(s,i),wn.subVectors(r,i),va.subVectors(t,i);const l=En.dot(va),c=wn.dot(va);if(l<=0&&c<=0)return e.copy(i);ya.subVectors(t,s);const h=En.dot(ya),u=wn.dot(ya);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(En,a);xa.subVectors(t,r);const p=En.dot(xa),g=wn.dot(xa);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(wn,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Ol.subVectors(r,s),o=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Ol,o);const d=1/(m+_+f);return a=_*d,o=f*d,e.copy(i).addScaledVector(En,a).addScaledVector(wn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const bh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},$s={h:0,s:0,l:0};function Ma(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Yt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=i,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ie.workingColorSpace){if(t=Eo(t,1),e=Re(e,0,1),i=Re(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Ma(a,r,t+1/3),this.g=Ma(a,r,t),this.b=Ma(a,r,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=Ce){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ce){const i=bh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Hn(t.r),this.g=Hn(t.g),this.b=Hn(t.b),this}copyLinearToSRGB(t){return this.r=ca(t.r),this.g=ca(t.g),this.b=ca(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ce){return ie.fromWorkingColorSpace(Ie.copy(this),t),Math.round(Re(Ie.r*255,0,255))*65536+Math.round(Re(Ie.g*255,0,255))*256+Math.round(Re(Ie.b*255,0,255))}getHexString(t=Ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(Ie.copy(this),e);const i=Ie.r,s=Ie.g,r=Ie.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Ce){ie.fromWorkingColorSpace(Ie.copy(this),t);const e=Ie.r,i=Ie.g,s=Ie.b;return t!==Ce?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Gi),this.setHSL(Gi.h+t,Gi.s+e,Gi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Gi),t.getHSL($s);const i=vs(Gi.h,$s.h,e),s=vs(Gi.s,$s.s,e),r=vs(Gi.l,$s.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new Yt;Yt.NAMES=bh;let jd=0;class ji extends gn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jd++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=cn,this.side=Li,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xa,this.blendDst=$a,this.blendEquation=an,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Sr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=El,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_n,this.stencilZFail=_n,this.stencilZPass=_n,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==cn&&(i.blending=this.blending),this.side!==Li&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Xa&&(i.blendSrc=this.blendSrc),this.blendDst!==$a&&(i.blendDst=this.blendDst),this.blendEquation!==an&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Sr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==El&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_n&&(i.stencilFail=this.stencilFail),this.stencilZFail!==_n&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==_n&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ls extends ji{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const _e=new E,qs=new _t;class ue{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Za,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Vi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)qs.fromBufferAttribute(this,e),qs.applyMatrix3(t),this.setXY(e,qs.x,qs.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix4(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyNormalMatrix(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.transformDirection(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=gi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ee(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Za&&(t.usage=this.usage),t}}class Eh extends ue{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class wh extends ue{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class de extends ue{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Zd=0;const ii=new kt,Sa=new Se,Tn=new E,Ze=new Ue,os=new Ue,Ae=new E;class Zt extends gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yh(t)?wh:Eh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new qt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ii.makeRotationFromQuaternion(t),this.applyMatrix4(ii),this}rotateX(t){return ii.makeRotationX(t),this.applyMatrix4(ii),this}rotateY(t){return ii.makeRotationY(t),this.applyMatrix4(ii),this}rotateZ(t){return ii.makeRotationZ(t),this.applyMatrix4(ii),this}translate(t,e,i){return ii.makeTranslation(t,e,i),this.applyMatrix4(ii),this}scale(t,e,i){return ii.makeScale(t,e,i),this.applyMatrix4(ii),this}lookAt(t){return Sa.lookAt(t),Sa.updateMatrix(),this.applyMatrix4(Sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Tn).negate(),this.translate(Tn.x,Tn.y,Tn.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new de(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ue);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Ze.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new E,1/0);return}if(t){const i=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];os.setFromBufferAttribute(o),this.morphTargetsRelative?(Ae.addVectors(Ze.min,os.min),Ze.expandByPoint(Ae),Ae.addVectors(Ze.max,os.max),Ze.expandByPoint(Ae)):(Ze.expandByPoint(os.min),Ze.expandByPoint(os.max))}Ze.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ae));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ae.fromBufferAttribute(o,c),l&&(Tn.fromBufferAttribute(t,c),Ae.add(Tn)),s=Math.max(s,i.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ue(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<o;b++)c[b]=new E,h[b]=new E;const u=new E,f=new E,p=new E,g=new _t,_=new _t,m=new _t,d=new E,y=new E;function v(b,O,$){u.fromArray(s,b*3),f.fromArray(s,O*3),p.fromArray(s,$*3),g.fromArray(a,b*2),_.fromArray(a,O*2),m.fromArray(a,$*2),f.sub(u),p.sub(u),_.sub(g),m.sub(g);const J=1/(_.x*m.y-m.x*_.y);isFinite(J)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(J),y.copy(p).multiplyScalar(_.x).addScaledVector(f,-m.x).multiplyScalar(J),c[b].add(d),c[O].add(d),c[$].add(d),h[b].add(y),h[O].add(y),h[$].add(y))}let x=this.groups;x.length===0&&(x=[{start:0,count:i.length}]);for(let b=0,O=x.length;b<O;++b){const $=x[b],J=$.start,L=$.count;for(let F=J,I=J+L;F<I;F+=3)v(i[F+0],i[F+1],i[F+2])}const C=new E,T=new E,P=new E,G=new E;function M(b){P.fromArray(r,b*3),G.copy(P);const O=c[b];C.copy(O),C.sub(P.multiplyScalar(P.dot(O))).normalize(),T.crossVectors(G,O);const J=T.dot(h[b])<0?-1:1;l[b*4]=C.x,l[b*4+1]=C.y,l[b*4+2]=C.z,l[b*4+3]=J}for(let b=0,O=x.length;b<O;++b){const $=x[b],J=$.start,L=$.count;for(let F=J,I=J+L;F<I;F+=3)M(i[F+0]),M(i[F+1]),M(i[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ue(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const s=new E,r=new E,a=new E,o=new E,l=new E,c=new E,h=new E,u=new E;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new ue(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Zt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=t(f,i);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zl=new kt,en=new Ur,Ys=new es,Bl=new E,An=new E,Cn=new E,Pn=new E,ba=new E,js=new E,Zs=new _t,Ks=new _t,Js=new _t,Gl=new E,kl=new E,Hl=new E,Qs=new E,tr=new E;class Ne extends Se{constructor(t=new Zt,e=new Ls){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){js.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(ba.fromBufferAttribute(u,t),a?js.addScaledVector(ba,h):js.addScaledVector(ba.sub(e),h))}e.add(js)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ys.copy(i.boundingSphere),Ys.applyMatrix4(r),en.copy(t.ray).recast(t.near),!(Ys.containsPoint(en.origin)===!1&&(en.intersectSphere(Ys,Bl)===null||en.origin.distanceToSquared(Bl)>(t.far-t.near)**2))&&(zl.copy(r).invert(),en.copy(t.ray).applyMatrix4(zl),!(i.boundingBox!==null&&en.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,en)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,C=v;x<C;x+=3){const T=o.getX(x),P=o.getX(x+1),G=o.getX(x+2);s=er(this,d,t,i,c,h,u,T,P,G),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const y=o.getX(m),v=o.getX(m+1),x=o.getX(m+2);s=er(this,a,t,i,c,h,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,C=v;x<C;x+=3){const T=x,P=x+1,G=x+2;s=er(this,d,t,i,c,h,u,T,P,G),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const y=m,v=m+1,x=m+2;s=er(this,a,t,i,c,h,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Kd(n,t,e,i,s,r,a,o){let l;if(t.side===$e?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,t.side===Li,o),l===null)return null;tr.copy(o),tr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(tr);return c<e.near||c>e.far?null:{distance:c,point:tr.clone(),object:n}}function er(n,t,e,i,s,r,a,o,l,c){n.getVertexPosition(o,An),n.getVertexPosition(l,Cn),n.getVertexPosition(c,Pn);const h=Kd(n,t,e,i,An,Cn,Pn,Qs);if(h){s&&(Zs.fromBufferAttribute(s,o),Ks.fromBufferAttribute(s,l),Js.fromBufferAttribute(s,c),h.uv=ri.getInterpolation(Qs,An,Cn,Pn,Zs,Ks,Js,new _t)),r&&(Zs.fromBufferAttribute(r,o),Ks.fromBufferAttribute(r,l),Js.fromBufferAttribute(r,c),h.uv1=ri.getInterpolation(Qs,An,Cn,Pn,Zs,Ks,Js,new _t),h.uv2=h.uv1),a&&(Gl.fromBufferAttribute(a,o),kl.fromBufferAttribute(a,l),Hl.fromBufferAttribute(a,c),h.normal=ri.getInterpolation(Qs,An,Cn,Pn,Gl,kl,Hl,new E),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new E,materialIndex:0};ri.getNormal(An,Cn,Pn,u.normal),h.face=u}return h}class Ds extends Zt{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(h,3)),this.setAttribute("uv",new de(u,2));function g(_,m,d,y,v,x,C,T,P,G,M){const b=x/P,O=C/G,$=x/2,J=C/2,L=T/2,F=P+1,I=G+1;let H=0,B=0;const j=new E;for(let W=0;W<I;W++){const K=W*O-J;for(let Q=0;Q<F;Q++){const k=Q*b-$;j[_]=k*y,j[m]=K*v,j[d]=L,c.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[d]=T>0?1:-1,h.push(j.x,j.y,j.z),u.push(Q/P),u.push(1-W/G),H+=1}}for(let W=0;W<G;W++)for(let K=0;K<P;K++){const Q=f+K+F*W,k=f+K+F*(W+1),Z=f+(K+1)+F*(W+1),nt=f+(K+1)+F*W;l.push(Q,k,nt),l.push(k,Z,nt),B+=6}o.addGroup(p,B,M),p+=B,f+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Jn(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function ke(n){const t={};for(let e=0;e<n.length;e++){const i=Jn(n[e]);for(const s in i)t[s]=i[s]}return t}function Jd(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Th(n){return n.getRenderTarget()===null?n.outputColorSpace:ie.workingColorSpace}const Qd={clone:Jn,merge:ke};var t0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,e0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ui extends ji{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=t0,this.fragmentShader=e0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Jn(t.uniforms),this.uniformsGroups=Jd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Ah extends Se{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new kt,this.projectionMatrix=new kt,this.projectionMatrixInverse=new kt,this.coordinateSystem=Pi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ve extends Ah{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Kn*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(_s*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Kn*2*Math.atan(Math.tan(_s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(_s*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Rn=-90,Ln=1;class i0 extends Se{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ve(Rn,Ln,t,e);s.layers=this.layers,this.add(s);const r=new Ve(Rn,Ln,t,e);r.layers=this.layers,this.add(r);const a=new Ve(Rn,Ln,t,e);a.layers=this.layers,this.add(a);const o=new Ve(Rn,Ln,t,e);o.layers=this.layers,this.add(o);const l=new Ve(Rn,Ln,t,e);l.layers=this.layers,this.add(l);const c=new Ve(Rn,Ln,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Pi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Ch extends Oe{constructor(t,e,i,s,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Yn,super(t,e,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class n0 extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(ys("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===dn?Ce:oi),this.texture=new Ch(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:si}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ds(5,5,5),r=new Ui({name:"CubemapFromEquirect",uniforms:Jn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$e,blending:Xi});r.uniforms.tEquirect.value=e;const a=new Ne(s,r),o=e.minFilter;return e.minFilter===bs&&(e.minFilter=si),new i0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}const Ea=new E,s0=new E,r0=new qt;class sn{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Ea.subVectors(i,e).cross(s0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ea),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||r0.getNormalMatrix(t),s=this.coplanarPoint(Ea).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const nn=new es,ir=new E;class To{constructor(t=new sn,e=new sn,i=new sn,s=new sn,r=new sn,a=new sn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Pi){const i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],y=s[13],v=s[14],x=s[15];if(i[0].setComponents(l-r,f-c,m-p,x-d).normalize(),i[1].setComponents(l+r,f+c,m+p,x+d).normalize(),i[2].setComponents(l+a,f+h,m+g,x+y).normalize(),i[3].setComponents(l-a,f-h,m-g,x-y).normalize(),i[4].setComponents(l-o,f-u,m-_,x-v).normalize(),e===Pi)i[5].setComponents(l+o,f+u,m+_,x+v).normalize();else if(e===Ar)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),nn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),nn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(nn)}intersectsSprite(t){return nn.center.set(0,0,0),nn.radius=.7071067811865476,nn.applyMatrix4(t.matrixWorld),this.intersectsSphere(nn)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ir.x=s.normal.x>0?t.max.x:t.min.x,ir.y=s.normal.y>0?t.max.y:t.min.y,ir.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ir)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ph(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function a0(n,t){const e=t.isWebGL2,i=new WeakMap;function s(c,h){const u=c.array,f=c.usage,p=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,f),c.onUploadCallback();let _;if(u instanceof Float32Array)_=n.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=n.SHORT;else if(u instanceof Uint32Array)_=n.UNSIGNED_INT;else if(u instanceof Int32Array)_=n.INT;else if(u instanceof Int8Array)_=n.BYTE;else if(u instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:p}}function r(c,h,u){const f=h.array,p=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,c),p.count===-1&&g.length===0&&n.bufferSubData(u,0,f),g.length!==0){for(let _=0,m=g.length;_<m;_++){const d=g[_];e?n.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):n.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(e?n.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):n.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=i.get(c);(!f||f.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);if(u===void 0)i.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:a,remove:o,update:l}}class Ao extends Zt{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=t/o,f=e/l,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){const y=d*f-a;for(let v=0;v<c;v++){const x=v*u-r;g.push(x,-y,0),_.push(0,0,1),m.push(v/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<o;y++){const v=y+c*d,x=y+c*(d+1),C=y+1+c*(d+1),T=y+1+c*d;p.push(v,x,T),p.push(x,C,T)}this.setIndex(p),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ao(t.width,t.height,t.widthSegments,t.heightSegments)}}var o0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,l0=`#ifdef USE_ALPHAHASH
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
#endif`,c0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,h0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,d0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,f0=`#ifdef USE_AOMAP
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
#endif`,p0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,m0=`#ifdef USE_BATCHING
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
#endif`,g0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,_0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,v0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,y0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,x0=`#ifdef USE_IRIDESCENCE
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
#endif`,M0=`#ifdef USE_BUMPMAP
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
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,E0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,w0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,T0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,C0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,P0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,R0=`#define PI 3.141592653589793
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
} // validated`,L0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,D0=`vec3 transformedNormal = objectNormal;
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
#endif`,I0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,U0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,F0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,N0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,O0="gl_FragColor = linearToOutputTexel( gl_FragColor );",z0=`
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
}`,B0=`#ifdef USE_ENVMAP
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
#endif`,G0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,k0=`#ifdef USE_ENVMAP
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
#endif`,H0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V0=`#ifdef USE_ENVMAP
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
#endif`,W0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,X0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y0=`#ifdef USE_GRADIENTMAP
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
}`,j0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Z0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,K0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,J0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Q0=`uniform bool receiveShadow;
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
#endif`,tf=`#ifdef USE_ENVMAP
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
#endif`,ef=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,af=`PhysicalMaterial material;
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
#endif`,of=`struct PhysicalMaterial {
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
}`,lf=`
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
#endif`,cf=`#if defined( RE_IndirectDiffuse )
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
#endif`,hf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,df=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ff=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,pf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,mf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_f=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vf=`#if defined( USE_POINTS_UV )
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
#endif`,yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sf=`#ifdef USE_MORPHNORMALS
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
#endif`,bf=`#ifdef USE_MORPHTARGETS
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
#endif`,Ef=`#ifdef USE_MORPHTARGETS
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
#endif`,wf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rf=`#ifdef USE_NORMALMAP
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
#endif`,Lf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Df=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,If=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ff=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Of=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$f=`float getShadowMask() {
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
}`,qf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yf=`#ifdef USE_SKINNING
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
#endif`,jf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zf=`#ifdef USE_SKINNING
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
#endif`,Kf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ep=`#ifdef USE_TRANSMISSION
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
#endif`,ip=`#ifdef USE_TRANSMISSION
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
#endif`,np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ap=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const op=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lp=`uniform sampler2D t2D;
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
}`,cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`#include <common>
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
}`,pp=`#if DEPTH_PACKING == 3200
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
}`,mp=`#define DISTANCE
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
}`,gp=`#define DISTANCE
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
}`,_p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`uniform float scale;
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
}`,xp=`uniform vec3 diffuse;
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
}`,Mp=`#include <common>
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
}`,Sp=`uniform vec3 diffuse;
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
}`,bp=`#define LAMBERT
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
}`,Ep=`#define LAMBERT
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
}`,wp=`#define MATCAP
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
}`,Tp=`#define MATCAP
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
}`,Ap=`#define NORMAL
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
}`,Cp=`#define NORMAL
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
}`,Pp=`#define PHONG
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
}`,Rp=`#define PHONG
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
}`,Lp=`#define STANDARD
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
}`,Dp=`#define STANDARD
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
}`,Ip=`#define TOON
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
}`,Up=`#define TOON
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
}`,Fp=`uniform float size;
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
}`,Np=`uniform vec3 diffuse;
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
}`,Op=`#include <common>
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
}`,zp=`uniform vec3 color;
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
}`,Bp=`uniform float rotation;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Gt={alphahash_fragment:o0,alphahash_pars_fragment:l0,alphamap_fragment:c0,alphamap_pars_fragment:h0,alphatest_fragment:u0,alphatest_pars_fragment:d0,aomap_fragment:f0,aomap_pars_fragment:p0,batching_pars_vertex:m0,batching_vertex:g0,begin_vertex:_0,beginnormal_vertex:v0,bsdfs:y0,iridescence_fragment:x0,bumpmap_pars_fragment:M0,clipping_planes_fragment:S0,clipping_planes_pars_fragment:b0,clipping_planes_pars_vertex:E0,clipping_planes_vertex:w0,color_fragment:T0,color_pars_fragment:A0,color_pars_vertex:C0,color_vertex:P0,common:R0,cube_uv_reflection_fragment:L0,defaultnormal_vertex:D0,displacementmap_pars_vertex:I0,displacementmap_vertex:U0,emissivemap_fragment:F0,emissivemap_pars_fragment:N0,colorspace_fragment:O0,colorspace_pars_fragment:z0,envmap_fragment:B0,envmap_common_pars_fragment:G0,envmap_pars_fragment:k0,envmap_pars_vertex:H0,envmap_physical_pars_fragment:tf,envmap_vertex:V0,fog_vertex:W0,fog_pars_vertex:X0,fog_fragment:$0,fog_pars_fragment:q0,gradientmap_pars_fragment:Y0,lightmap_fragment:j0,lightmap_pars_fragment:Z0,lights_lambert_fragment:K0,lights_lambert_pars_fragment:J0,lights_pars_begin:Q0,lights_toon_fragment:ef,lights_toon_pars_fragment:nf,lights_phong_fragment:sf,lights_phong_pars_fragment:rf,lights_physical_fragment:af,lights_physical_pars_fragment:of,lights_fragment_begin:lf,lights_fragment_maps:cf,lights_fragment_end:hf,logdepthbuf_fragment:uf,logdepthbuf_pars_fragment:df,logdepthbuf_pars_vertex:ff,logdepthbuf_vertex:pf,map_fragment:mf,map_pars_fragment:gf,map_particle_fragment:_f,map_particle_pars_fragment:vf,metalnessmap_fragment:yf,metalnessmap_pars_fragment:xf,morphcolor_vertex:Mf,morphnormal_vertex:Sf,morphtarget_pars_vertex:bf,morphtarget_vertex:Ef,normal_fragment_begin:wf,normal_fragment_maps:Tf,normal_pars_fragment:Af,normal_pars_vertex:Cf,normal_vertex:Pf,normalmap_pars_fragment:Rf,clearcoat_normal_fragment_begin:Lf,clearcoat_normal_fragment_maps:Df,clearcoat_pars_fragment:If,iridescence_pars_fragment:Uf,opaque_fragment:Ff,packing:Nf,premultiplied_alpha_fragment:Of,project_vertex:zf,dithering_fragment:Bf,dithering_pars_fragment:Gf,roughnessmap_fragment:kf,roughnessmap_pars_fragment:Hf,shadowmap_pars_fragment:Vf,shadowmap_pars_vertex:Wf,shadowmap_vertex:Xf,shadowmask_pars_fragment:$f,skinbase_vertex:qf,skinning_pars_vertex:Yf,skinning_vertex:jf,skinnormal_vertex:Zf,specularmap_fragment:Kf,specularmap_pars_fragment:Jf,tonemapping_fragment:Qf,tonemapping_pars_fragment:tp,transmission_fragment:ep,transmission_pars_fragment:ip,uv_pars_fragment:np,uv_pars_vertex:sp,uv_vertex:rp,worldpos_vertex:ap,background_vert:op,background_frag:lp,backgroundCube_vert:cp,backgroundCube_frag:hp,cube_vert:up,cube_frag:dp,depth_vert:fp,depth_frag:pp,distanceRGBA_vert:mp,distanceRGBA_frag:gp,equirect_vert:_p,equirect_frag:vp,linedashed_vert:yp,linedashed_frag:xp,meshbasic_vert:Mp,meshbasic_frag:Sp,meshlambert_vert:bp,meshlambert_frag:Ep,meshmatcap_vert:wp,meshmatcap_frag:Tp,meshnormal_vert:Ap,meshnormal_frag:Cp,meshphong_vert:Pp,meshphong_frag:Rp,meshphysical_vert:Lp,meshphysical_frag:Dp,meshtoon_vert:Ip,meshtoon_frag:Up,points_vert:Fp,points_frag:Np,shadow_vert:Op,shadow_frag:zp,sprite_vert:Bp,sprite_frag:Gp},at={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},mi={basic:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:ke([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:ke([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:ke([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:ke([at.points,at.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:ke([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:ke([at.common,at.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:ke([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:ke([at.sprite,at.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:ke([at.common,at.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:ke([at.lights,at.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};mi.physical={uniforms:ke([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const nr={r:0,b:0,g:0};function kp(n,t,e,i,s,r,a){const o=new Yt(0);let l=r===!0?0:1,c,h,u=null,f=0,p=null;function g(m,d){let y=!1,v=d.isScene===!0?d.background:null;v&&v.isTexture&&(v=(d.backgroundBlurriness>0?e:t).get(v)),v===null?_(o,l):v&&v.isColor&&(_(v,1),y=!0);const x=n.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Dr)?(h===void 0&&(h=new Ne(new Ds(1,1,1),new Ui({name:"BackgroundCubeMaterial",uniforms:Jn(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=ie.getTransfer(v.colorSpace)!==le,(u!==v||f!==v.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,p=n.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ne(new Ao(2,2),new Ui({name:"BackgroundMaterial",uniforms:Jn(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Li,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=ie.getTransfer(v.colorSpace)!==le,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,p=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,d){m.getRGB(nr,Th(n)),i.buffers.color.setClear(nr.r,nr.g,nr.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(m,d=1){o.set(m),l=d,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(o,l)},render:g}}function Hp(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},l=m(null);let c=l,h=!1;function u(L,F,I,H,B){let j=!1;if(a){const W=_(H,I,F);c!==W&&(c=W,p(c.object)),j=d(L,H,I,B),j&&y(L,H,I,B)}else{const W=F.wireframe===!0;(c.geometry!==H.id||c.program!==I.id||c.wireframe!==W)&&(c.geometry=H.id,c.program=I.id,c.wireframe=W,j=!0)}B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(j||h)&&(h=!1,G(L,F,I,H),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function f(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function p(L){return i.isWebGL2?n.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return i.isWebGL2?n.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function _(L,F,I){const H=I.wireframe===!0;let B=o[L.id];B===void 0&&(B={},o[L.id]=B);let j=B[F.id];j===void 0&&(j={},B[F.id]=j);let W=j[H];return W===void 0&&(W=m(f()),j[H]=W),W}function m(L){const F=[],I=[],H=[];for(let B=0;B<s;B++)F[B]=0,I[B]=0,H[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:I,attributeDivisors:H,object:L,attributes:{},index:null}}function d(L,F,I,H){const B=c.attributes,j=F.attributes;let W=0;const K=I.getAttributes();for(const Q in K)if(K[Q].location>=0){const Z=B[Q];let nt=j[Q];if(nt===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(nt=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(nt=L.instanceColor)),Z===void 0||Z.attribute!==nt||nt&&Z.data!==nt.data)return!0;W++}return c.attributesNum!==W||c.index!==H}function y(L,F,I,H){const B={},j=F.attributes;let W=0;const K=I.getAttributes();for(const Q in K)if(K[Q].location>=0){let Z=j[Q];Z===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor));const nt={};nt.attribute=Z,Z&&Z.data&&(nt.data=Z.data),B[Q]=nt,W++}c.attributes=B,c.attributesNum=W,c.index=H}function v(){const L=c.newAttributes;for(let F=0,I=L.length;F<I;F++)L[F]=0}function x(L){C(L,0)}function C(L,F){const I=c.newAttributes,H=c.enabledAttributes,B=c.attributeDivisors;I[L]=1,H[L]===0&&(n.enableVertexAttribArray(L),H[L]=1),B[L]!==F&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,F),B[L]=F)}function T(){const L=c.newAttributes,F=c.enabledAttributes;for(let I=0,H=F.length;I<H;I++)F[I]!==L[I]&&(n.disableVertexAttribArray(I),F[I]=0)}function P(L,F,I,H,B,j,W){W===!0?n.vertexAttribIPointer(L,F,I,B,j):n.vertexAttribPointer(L,F,I,H,B,j)}function G(L,F,I,H){if(i.isWebGL2===!1&&(L.isInstancedMesh||H.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const B=H.attributes,j=I.getAttributes(),W=F.defaultAttributeValues;for(const K in j){const Q=j[K];if(Q.location>=0){let k=B[K];if(k===void 0&&(K==="instanceMatrix"&&L.instanceMatrix&&(k=L.instanceMatrix),K==="instanceColor"&&L.instanceColor&&(k=L.instanceColor)),k!==void 0){const Z=k.normalized,nt=k.itemSize,dt=e.get(k);if(dt===void 0)continue;const gt=dt.buffer,Et=dt.type,z=dt.bytesPerElement,ot=i.isWebGL2===!0&&(Et===n.INT||Et===n.UNSIGNED_INT||k.gpuType===ch);if(k.isInterleavedBufferAttribute){const It=k.data,U=It.stride,Tt=k.offset;if(It.isInstancedInterleavedBuffer){for(let lt=0;lt<Q.locationSize;lt++)C(Q.location+lt,It.meshPerAttribute);L.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=It.meshPerAttribute*It.count)}else for(let lt=0;lt<Q.locationSize;lt++)x(Q.location+lt);n.bindBuffer(n.ARRAY_BUFFER,gt);for(let lt=0;lt<Q.locationSize;lt++)P(Q.location+lt,nt/Q.locationSize,Et,Z,U*z,(Tt+nt/Q.locationSize*lt)*z,ot)}else{if(k.isInstancedBufferAttribute){for(let It=0;It<Q.locationSize;It++)C(Q.location+It,k.meshPerAttribute);L.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let It=0;It<Q.locationSize;It++)x(Q.location+It);n.bindBuffer(n.ARRAY_BUFFER,gt);for(let It=0;It<Q.locationSize;It++)P(Q.location+It,nt/Q.locationSize,Et,Z,nt*z,nt/Q.locationSize*It*z,ot)}}else if(W!==void 0){const Z=W[K];if(Z!==void 0)switch(Z.length){case 2:n.vertexAttrib2fv(Q.location,Z);break;case 3:n.vertexAttrib3fv(Q.location,Z);break;case 4:n.vertexAttrib4fv(Q.location,Z);break;default:n.vertexAttrib1fv(Q.location,Z)}}}}T()}function M(){$();for(const L in o){const F=o[L];for(const I in F){const H=F[I];for(const B in H)g(H[B].object),delete H[B];delete F[I]}delete o[L]}}function b(L){if(o[L.id]===void 0)return;const F=o[L.id];for(const I in F){const H=F[I];for(const B in H)g(H[B].object),delete H[B];delete F[I]}delete o[L.id]}function O(L){for(const F in o){const I=o[F];if(I[L.id]===void 0)continue;const H=I[L.id];for(const B in H)g(H[B].object),delete H[B];delete I[L.id]}}function $(){J(),h=!0,c!==l&&(c=l,p(c.object))}function J(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:$,resetDefaultState:J,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfProgram:O,initAttributes:v,enableAttribute:x,disableUnusedAttributes:T}}function Vp(n,t,e,i){const s=i.isWebGL2;let r;function a(h){r=h}function o(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,f){if(f===0)return;let p,g;if(s)p=n,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,f),e.update(u,r,f)}function c(h,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function Wp(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),d=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,x=a||t.has("OES_texture_float"),C=v&&x,T=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:x,floatVertexTextures:C,maxSamples:T}}function Xp(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new sn,o=new qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const y=r?0:i,v=y*4;let x=d.clippingState||null;l.value=x,x=h(g,f,v,p);for(let C=0;C!==v;++C)x[C]=e[C];d.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const d=p+_*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,x=p;v!==_;++v,x+=4)a.copy(u[v]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function $p(n){let t=new WeakMap;function e(a,o){return o===qa?a.mapping=Yn:o===Ya&&(a.mapping=jn),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===qa||o===Ya)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new n0(l.height/2);return c.fromEquirectangularTexture(n,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class Rh extends Ah{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Bn=4,Vl=[.125,.215,.35,.446,.526,.582],on=20,wa=new Rh,Wl=new Yt;let Ta=null,Aa=0,Ca=0;const rn=(1+Math.sqrt(5))/2,Dn=1/rn,Xl=[new E(1,1,1),new E(-1,1,1),new E(1,1,-1),new E(-1,1,-1),new E(0,rn,Dn),new E(0,rn,-Dn),new E(Dn,0,rn),new E(-Dn,0,rn),new E(rn,Dn,0),new E(-rn,Dn,0)];class $l{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Ta=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ta,Aa,Ca),t.scissorTest=!1,sr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yn||t.mapping===jn?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ta=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:si,minFilter:si,generateMipmaps:!1,type:Es,format:ai,colorSpace:Ii,depthBuffer:!1},s=ql(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ql(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qp(r)),this._blurMaterial=Yp(r,t,e)}return s}_compileMaterial(t){const e=new Ne(this._lodPlanes[0],t);this._renderer.compile(e,wa)}_sceneToCubeUV(t,e,i,s){const o=new Ve(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Wl),h.toneMapping=$i,h.autoClear=!1;const p=new Ls({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),g=new Ne(new Ds,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Wl),_=!0);for(let d=0;d<6;d++){const y=d%3;y===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):y===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const v=this._cubeSize;sr(s,y*v,d>2?v:0,v,v),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Yn||t.mapping===jn;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=jl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ne(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;sr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,wa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Xl[(s-1)%Xl.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ne(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*on-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):on;m>on&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${on}`);const d=[];let y=0;for(let P=0;P<on;++P){const G=P/_,M=Math.exp(-G*G/2);d.push(M),P===0?y+=M:P<m&&(y+=2*M)}for(let P=0;P<d.length;P++)d[P]=d[P]/y;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;const x=this._sizeLods[s],C=3*x*(s>v-Bn?s-v+Bn:0),T=4*(this._cubeSize-x);sr(e,C,T,3*x,2*x),l.setRenderTarget(e),l.render(u,wa)}}function qp(n){const t=[],e=[],i=[];let s=n;const r=n-Bn+1+Vl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Bn?l=Vl[a-n+Bn-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,y=new Float32Array(_*g*p),v=new Float32Array(m*g*p),x=new Float32Array(d*g*p);for(let T=0;T<p;T++){const P=T%3*2/3-1,G=T>2?0:-1,M=[P,G,0,P+2/3,G,0,P+2/3,G+1,0,P,G,0,P+2/3,G+1,0,P,G+1,0];y.set(M,_*g*T),v.set(f,m*g*T);const b=[T,T,T,T,T,T];x.set(b,d*g*T)}const C=new Zt;C.setAttribute("position",new ue(y,_)),C.setAttribute("uv",new ue(v,m)),C.setAttribute("faceIndex",new ue(x,d)),t.push(C),s>Bn&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function ql(n,t,e){const i=new pn(n,t,e);return i.texture.mapping=Dr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function sr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Yp(n,t,e){const i=new Float32Array(on),s=new E(0,1,0);return new Ui({name:"SphericalGaussianBlur",defines:{n:on,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Co(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Yl(){return new Ui({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Co(),fragmentShader:`

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
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function jl(){return new Ui({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Co(){return`

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
	`}function jp(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===qa||l===Ya,h=l===Yn||l===jn;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new $l(n)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new $l(n));const f=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Zp(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Kp(n,t,e,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)t.remove(_[m])}f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,d=_.length;m<d;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const y=p.array;_=p.version;for(let v=0,x=y.length;v<x;v+=3){const C=y[v+0],T=y[v+1],P=y[v+2];f.push(C,T,T,P,P,C)}}else if(g!==void 0){const y=g.array;_=g.version;for(let v=0,x=y.length/3-1;v<x;v+=3){const C=v+0,T=v+1,P=v+2;f.push(C,T,T,P,P,C)}}else return;const m=new(yh(f)?wh:Eh)(f,1);m.version=_;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Jp(n,t,e,i){const s=i.isWebGL2;let r;function a(p){r=p}let o,l;function c(p){o=p.type,l=p.bytesPerElement}function h(p,g){n.drawElements(r,g,o,p*l),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,d;if(s)m=n,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,g,o,p*l,_),e.update(g,r,_)}function f(p,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<_;d++)this.render(p[d]/l,g[d]);else{m.multiDrawElementsWEBGL(r,g,0,o,p,0,_);let d=0;for(let y=0;y<_;y++)d+=g[y];e.update(d,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function Qp(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function tm(n,t){return n[0]-t[0]}function em(n,t){return Math.abs(t[1])-Math.abs(n[1])}function im(n,t,e){const i={},s=new Float32Array(8),r=new WeakMap,a=new ce,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==_){let F=function(){J.dispose(),r.delete(h),h.removeEventListener("dispose",F)};var p=F;m!==void 0&&m.texture.dispose();const v=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,C=h.morphAttributes.color!==void 0,T=h.morphAttributes.position||[],P=h.morphAttributes.normal||[],G=h.morphAttributes.color||[];let M=0;v===!0&&(M=1),x===!0&&(M=2),C===!0&&(M=3);let b=h.attributes.position.count*M,O=1;b>t.maxTextureSize&&(O=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const $=new Float32Array(b*O*4*_),J=new Sh($,b,O,_);J.type=Vi,J.needsUpdate=!0;const L=M*4;for(let I=0;I<_;I++){const H=T[I],B=P[I],j=G[I],W=b*O*4*I;for(let K=0;K<H.count;K++){const Q=K*L;v===!0&&(a.fromBufferAttribute(H,K),$[W+Q+0]=a.x,$[W+Q+1]=a.y,$[W+Q+2]=a.z,$[W+Q+3]=0),x===!0&&(a.fromBufferAttribute(B,K),$[W+Q+4]=a.x,$[W+Q+5]=a.y,$[W+Q+6]=a.z,$[W+Q+7]=0),C===!0&&(a.fromBufferAttribute(j,K),$[W+Q+8]=a.x,$[W+Q+9]=a.y,$[W+Q+10]=a.z,$[W+Q+11]=j.itemSize===4?a.w:1)}}m={count:_,texture:J,size:new _t(b,O)},r.set(h,m),h.addEventListener("dispose",F)}let d=0;for(let v=0;v<f.length;v++)d+=f[v];const y=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(n,"morphTargetBaseInfluence",y),u.getUniforms().setValue(n,"morphTargetInfluences",f),u.getUniforms().setValue(n,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let _=i[h.id];if(_===void 0||_.length!==g){_=[];for(let x=0;x<g;x++)_[x]=[x,0];i[h.id]=_}for(let x=0;x<g;x++){const C=_[x];C[0]=x,C[1]=f[x]}_.sort(em);for(let x=0;x<8;x++)x<g&&_[x][1]?(o[x][0]=_[x][0],o[x][1]=_[x][1]):(o[x][0]=Number.MAX_SAFE_INTEGER,o[x][1]=0);o.sort(tm);const m=h.morphAttributes.position,d=h.morphAttributes.normal;let y=0;for(let x=0;x<8;x++){const C=o[x],T=C[0],P=C[1];T!==Number.MAX_SAFE_INTEGER&&P?(m&&h.getAttribute("morphTarget"+x)!==m[T]&&h.setAttribute("morphTarget"+x,m[T]),d&&h.getAttribute("morphNormal"+x)!==d[T]&&h.setAttribute("morphNormal"+x,d[T]),s[x]=P,y+=P):(m&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),d&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}const v=h.morphTargetsRelative?1:1-y;u.getUniforms().setValue(n,"morphTargetBaseInfluence",v),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:l}}function nm(n,t,e,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class Lh extends Oe{constructor(t,e,i,s,r,a,o,l,c,h){if(h=h!==void 0?h:un,h!==un&&h!==Zn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===un&&(i=Hi),i===void 0&&h===Zn&&(i=hn),super(null,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Pe,this.minFilter=l!==void 0?l:Pe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Dh=new Oe,Ih=new Lh(1,1);Ih.compareFunction=vh;const Uh=new Sh,Fh=new Gd,Nh=new Ch,Zl=[],Kl=[],Jl=new Float32Array(16),Ql=new Float32Array(9),tc=new Float32Array(4);function is(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=Zl[s];if(r===void 0&&(r=new Float32Array(s),Zl[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function be(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ee(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Nr(n,t){let e=Kl[t];e===void 0&&(e=new Int32Array(t),Kl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function sm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function rm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2fv(this.addr,t),Ee(e,t)}}function am(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;n.uniform3fv(this.addr,t),Ee(e,t)}}function om(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4fv(this.addr,t),Ee(e,t)}}function lm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;tc.set(i),n.uniformMatrix2fv(this.addr,!1,tc),Ee(e,i)}}function cm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Ql.set(i),n.uniformMatrix3fv(this.addr,!1,Ql),Ee(e,i)}}function hm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Jl.set(i),n.uniformMatrix4fv(this.addr,!1,Jl),Ee(e,i)}}function um(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function dm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2iv(this.addr,t),Ee(e,t)}}function fm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3iv(this.addr,t),Ee(e,t)}}function pm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4iv(this.addr,t),Ee(e,t)}}function mm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function gm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2uiv(this.addr,t),Ee(e,t)}}function _m(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3uiv(this.addr,t),Ee(e,t)}}function vm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4uiv(this.addr,t),Ee(e,t)}}function ym(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const r=this.type===n.SAMPLER_2D_SHADOW?Ih:Dh;e.setTexture2D(t||r,s)}function xm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Fh,s)}function Mm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Nh,s)}function Sm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Uh,s)}function bm(n){switch(n){case 5126:return sm;case 35664:return rm;case 35665:return am;case 35666:return om;case 35674:return lm;case 35675:return cm;case 35676:return hm;case 5124:case 35670:return um;case 35667:case 35671:return dm;case 35668:case 35672:return fm;case 35669:case 35673:return pm;case 5125:return mm;case 36294:return gm;case 36295:return _m;case 36296:return vm;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return xm;case 35680:case 36300:case 36308:case 36293:return Mm;case 36289:case 36303:case 36311:case 36292:return Sm}}function Em(n,t){n.uniform1fv(this.addr,t)}function wm(n,t){const e=is(t,this.size,2);n.uniform2fv(this.addr,e)}function Tm(n,t){const e=is(t,this.size,3);n.uniform3fv(this.addr,e)}function Am(n,t){const e=is(t,this.size,4);n.uniform4fv(this.addr,e)}function Cm(n,t){const e=is(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Pm(n,t){const e=is(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Rm(n,t){const e=is(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Lm(n,t){n.uniform1iv(this.addr,t)}function Dm(n,t){n.uniform2iv(this.addr,t)}function Im(n,t){n.uniform3iv(this.addr,t)}function Um(n,t){n.uniform4iv(this.addr,t)}function Fm(n,t){n.uniform1uiv(this.addr,t)}function Nm(n,t){n.uniform2uiv(this.addr,t)}function Om(n,t){n.uniform3uiv(this.addr,t)}function zm(n,t){n.uniform4uiv(this.addr,t)}function Bm(n,t,e){const i=this.cache,s=t.length,r=Nr(e,s);be(i,r)||(n.uniform1iv(this.addr,r),Ee(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Dh,r[a])}function Gm(n,t,e){const i=this.cache,s=t.length,r=Nr(e,s);be(i,r)||(n.uniform1iv(this.addr,r),Ee(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Fh,r[a])}function km(n,t,e){const i=this.cache,s=t.length,r=Nr(e,s);be(i,r)||(n.uniform1iv(this.addr,r),Ee(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Nh,r[a])}function Hm(n,t,e){const i=this.cache,s=t.length,r=Nr(e,s);be(i,r)||(n.uniform1iv(this.addr,r),Ee(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Uh,r[a])}function Vm(n){switch(n){case 5126:return Em;case 35664:return wm;case 35665:return Tm;case 35666:return Am;case 35674:return Cm;case 35675:return Pm;case 35676:return Rm;case 5124:case 35670:return Lm;case 35667:case 35671:return Dm;case 35668:case 35672:return Im;case 35669:case 35673:return Um;case 5125:return Fm;case 36294:return Nm;case 36295:return Om;case 36296:return zm;case 35678:case 36198:case 36298:case 36306:case 35682:return Bm;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Hm}}class Wm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=bm(e.type)}}class Xm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vm(e.type)}}class $m{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function ec(n,t){n.seq.push(t),n.map[t.id]=t}function qm(n,t,e){const i=n.name,s=i.length;for(Pa.lastIndex=0;;){const r=Pa.exec(i),a=Pa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){ec(e,c===void 0?new Wm(o,n,t):new Xm(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new $m(o),ec(e,u)),e=u}}}class yr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);qm(r,a,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function ic(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Ym=37297;let jm=0;function Zm(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function Km(n){const t=ie.getPrimaries(ie.workingColorSpace),e=ie.getPrimaries(n);let i;switch(t===e?i="":t===Tr&&e===wr?i="LinearDisplayP3ToLinearSRGB":t===wr&&e===Tr&&(i="LinearSRGBToLinearDisplayP3"),n){case Ii:case Ir:return[i,"LinearTransferOETF"];case Ce:case bo:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function nc(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Zm(n.getShaderSource(t),a)}else return s}function Jm(n,t){const e=Km(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Qm(n,t){let e;switch(t){case Ku:e="Linear";break;case Ju:e="Reinhard";break;case Qu:e="OptimizedCineon";break;case oh:e="ACESFilmic";break;case ed:e="AgX";break;case td:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function tg(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Gn).join(`
`)}function eg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Gn).join(`
`)}function ig(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function ng(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Gn(n){return n!==""}function sc(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rc(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qa(n){return n.replace(sg,ag)}const rg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function ag(n,t){let e=Gt[t];if(e===void 0){const i=rg.get(t);if(i!==void 0)e=Gt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Qa(e)}const og=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ac(n){return n.replace(og,lg)}function lg(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function oc(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function cg(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===sh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===rh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===wi&&(t="SHADOWMAP_TYPE_VSM"),t}function hg(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Yn:case jn:t="ENVMAP_TYPE_CUBE";break;case Dr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function ug(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case jn:t="ENVMAP_MODE_REFRACTION";break}return t}function dg(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ah:t="ENVMAP_BLENDING_MULTIPLY";break;case ju:t="ENVMAP_BLENDING_MIX";break;case Zu:t="ENVMAP_BLENDING_ADD";break}return t}function fg(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function pg(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=cg(e),c=hg(e),h=ug(e),u=dg(e),f=fg(e),p=e.isWebGL2?"":tg(e),g=eg(e),_=ig(r),m=s.createProgram();let d,y,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Gn).join(`
`),d.length>0&&(d+=`
`),y=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Gn).join(`
`),y.length>0&&(y+=`
`)):(d=[oc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gn).join(`
`),y=[p,oc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==$i?"#define TONE_MAPPING":"",e.toneMapping!==$i?Gt.tonemapping_pars_fragment:"",e.toneMapping!==$i?Qm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Jm("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Gn).join(`
`)),a=Qa(a),a=sc(a,e),a=rc(a,e),o=Qa(o),o=sc(o,e),o=rc(o,e),a=ac(a),o=ac(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const x=v+d+a,C=v+y+o,T=ic(s,s.VERTEX_SHADER,x),P=ic(s,s.FRAGMENT_SHADER,C);s.attachShader(m,T),s.attachShader(m,P),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function G($){if(n.debug.checkShaderErrors){const J=s.getProgramInfoLog(m).trim(),L=s.getShaderInfoLog(T).trim(),F=s.getShaderInfoLog(P).trim();let I=!0,H=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(I=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,T,P);else{const B=nc(s,T,"vertex"),j=nc(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+J+`
`+B+`
`+j)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(L===""||F==="")&&(H=!1);H&&($.diagnostics={runnable:I,programLog:J,vertexShader:{log:L,prefix:d},fragmentShader:{log:F,prefix:y}})}s.deleteShader(T),s.deleteShader(P),M=new yr(s,m),b=ng(s,m)}let M;this.getUniforms=function(){return M===void 0&&G(this),M};let b;this.getAttributes=function(){return b===void 0&&G(this),b};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(m,Ym)),O},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=P,this}let mg=0;class gg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new _g(t),e.set(t,i)),i}}class _g{constructor(t){this.id=mg++,this.code=t,this.usedTimes=0}}function vg(n,t,e,i,s,r,a){const o=new wo,l=new gg,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function m(M,b,O,$,J){const L=$.fog,F=J.geometry,I=M.isMeshStandardMaterial?$.environment:null,H=(M.isMeshStandardMaterial?e:t).get(M.envMap||I),B=H&&H.mapping===Dr?H.image.height:null,j=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const W=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,K=W!==void 0?W.length:0;let Q=0;F.morphAttributes.position!==void 0&&(Q=1),F.morphAttributes.normal!==void 0&&(Q=2),F.morphAttributes.color!==void 0&&(Q=3);let k,Z,nt,dt;if(j){const ze=mi[j];k=ze.vertexShader,Z=ze.fragmentShader}else k=M.vertexShader,Z=M.fragmentShader,l.update(M),nt=l.getVertexShaderID(M),dt=l.getFragmentShaderID(M);const gt=n.getRenderTarget(),Et=J.isInstancedMesh===!0,z=J.isBatchedMesh===!0,ot=!!M.map,It=!!M.matcap,U=!!H,Tt=!!M.aoMap,lt=!!M.lightMap,pt=!!M.bumpMap,ct=!!M.normalMap,Kt=!!M.displacementMap,At=!!M.emissiveMap,A=!!M.metalnessMap,S=!!M.roughnessMap,X=M.anisotropy>0,it=M.clearcoat>0,et=M.iridescence>0,st=M.sheen>0,xt=M.transmission>0,ft=X&&!!M.anisotropyMap,vt=it&&!!M.clearcoatMap,Rt=it&&!!M.clearcoatNormalMap,Ht=it&&!!M.clearcoatRoughnessMap,tt=et&&!!M.iridescenceMap,te=et&&!!M.iridescenceThicknessMap,jt=st&&!!M.sheenColorMap,Ut=st&&!!M.sheenRoughnessMap,wt=!!M.specularMap,yt=!!M.specularColorMap,Bt=!!M.specularIntensityMap,Jt=xt&&!!M.transmissionMap,fe=xt&&!!M.thicknessMap,Wt=!!M.gradientMap,rt=!!M.alphaMap,D=M.alphaTest>0,ht=!!M.alphaHash,ut=!!M.extensions,Lt=!!F.attributes.uv1,Ct=!!F.attributes.uv2,ne=!!F.attributes.uv3;let se=$i;return M.toneMapped&&(gt===null||gt.isXRRenderTarget===!0)&&(se=n.toneMapping),{isWebGL2:h,shaderID:j,shaderType:M.type,shaderName:M.name,vertexShader:k,fragmentShader:Z,defines:M.defines,customVertexShaderID:nt,customFragmentShaderID:dt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:z,instancing:Et,instancingColor:Et&&J.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:gt===null?n.outputColorSpace:gt.isXRRenderTarget===!0?gt.texture.colorSpace:Ii,map:ot,matcap:It,envMap:U,envMapMode:U&&H.mapping,envMapCubeUVHeight:B,aoMap:Tt,lightMap:lt,bumpMap:pt,normalMap:ct,displacementMap:f&&Kt,emissiveMap:At,normalMapObjectSpace:ct&&M.normalMapType===fd,normalMapTangentSpace:ct&&M.normalMapType===_h,metalnessMap:A,roughnessMap:S,anisotropy:X,anisotropyMap:ft,clearcoat:it,clearcoatMap:vt,clearcoatNormalMap:Rt,clearcoatRoughnessMap:Ht,iridescence:et,iridescenceMap:tt,iridescenceThicknessMap:te,sheen:st,sheenColorMap:jt,sheenRoughnessMap:Ut,specularMap:wt,specularColorMap:yt,specularIntensityMap:Bt,transmission:xt,transmissionMap:Jt,thicknessMap:fe,gradientMap:Wt,opaque:M.transparent===!1&&M.blending===cn,alphaMap:rt,alphaTest:D,alphaHash:ht,combine:M.combine,mapUv:ot&&_(M.map.channel),aoMapUv:Tt&&_(M.aoMap.channel),lightMapUv:lt&&_(M.lightMap.channel),bumpMapUv:pt&&_(M.bumpMap.channel),normalMapUv:ct&&_(M.normalMap.channel),displacementMapUv:Kt&&_(M.displacementMap.channel),emissiveMapUv:At&&_(M.emissiveMap.channel),metalnessMapUv:A&&_(M.metalnessMap.channel),roughnessMapUv:S&&_(M.roughnessMap.channel),anisotropyMapUv:ft&&_(M.anisotropyMap.channel),clearcoatMapUv:vt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ht&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:tt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:te&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:jt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&_(M.sheenRoughnessMap.channel),specularMapUv:wt&&_(M.specularMap.channel),specularColorMapUv:yt&&_(M.specularColorMap.channel),specularIntensityMapUv:Bt&&_(M.specularIntensityMap.channel),transmissionMapUv:Jt&&_(M.transmissionMap.channel),thicknessMapUv:fe&&_(M.thicknessMap.channel),alphaMapUv:rt&&_(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ct||X),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Lt,vertexUv2s:Ct,vertexUv3s:ne,pointsUvs:J.isPoints===!0&&!!F.attributes.uv&&(ot||rt),fog:!!L,useFog:M.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:J.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:Q,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&O.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,useLegacyLights:n._useLegacyLights,decodeVideoTexture:ot&&M.map.isVideoTexture===!0&&ie.getTransfer(M.map.colorSpace)===le,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Je,flipSided:M.side===$e,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:ut&&M.extensions.derivatives===!0,extensionFragDepth:ut&&M.extensions.fragDepth===!0,extensionDrawBuffers:ut&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&M.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function d(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const O in M.defines)b.push(O),b.push(M.defines[O]);return M.isRawShaderMaterial===!1&&(y(b,M),v(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),M.push(o.mask)}function x(M){const b=g[M.type];let O;if(b){const $=mi[b];O=Qd.clone($.uniforms)}else O=M.uniforms;return O}function C(M,b){let O;for(let $=0,J=c.length;$<J;$++){const L=c[$];if(L.cacheKey===b){O=L,++O.usedTimes;break}}return O===void 0&&(O=new pg(n,b,M,r),c.push(O)),O}function T(M){if(--M.usedTimes===0){const b=c.indexOf(M);c[b]=c[c.length-1],c.pop(),M.destroy()}}function P(M){l.remove(M)}function G(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:x,acquireProgram:C,releaseProgram:T,releaseShaderCache:P,programs:c,dispose:G}}function yg(){let n=new WeakMap;function t(r){let a=n.get(r);return a===void 0&&(a={},n.set(r,a)),a}function e(r){n.delete(r)}function i(r,a,o){n.get(r)[a]=o}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function xg(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function lc(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function cc(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,p,g,_,m){let d=n[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function o(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):e.push(d)}function l(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||xg),i.length>1&&i.sort(f||lc),s.length>1&&s.sort(f||lc)}function h(){for(let u=t,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Mg(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new cc,n.set(i,[a])):s>=r.length?(a=new cc,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Sg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new E,color:new Yt};break;case"SpotLight":e={position:new E,direction:new E,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new E,halfWidth:new E,halfHeight:new E};break}return n[t.id]=e,e}}}function bg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Eg=0;function wg(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Tg(n,t){const e=new Sg,i=bg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new E);const r=new E,a=new kt,o=new kt;function l(h,u){let f=0,p=0,g=0;for(let $=0;$<9;$++)s.probe[$].set(0,0,0);let _=0,m=0,d=0,y=0,v=0,x=0,C=0,T=0,P=0,G=0,M=0;h.sort(wg);const b=u===!0?Math.PI:1;for(let $=0,J=h.length;$<J;$++){const L=h[$],F=L.color,I=L.intensity,H=L.distance,B=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)f+=F.r*I*b,p+=F.g*I*b,g+=F.b*I*b;else if(L.isLightProbe){for(let j=0;j<9;j++)s.probe[j].addScaledVector(L.sh.coefficients[j],I);M++}else if(L.isDirectionalLight){const j=e.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity*b),L.castShadow){const W=L.shadow,K=i.get(L);K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,s.directionalShadow[_]=K,s.directionalShadowMap[_]=B,s.directionalShadowMatrix[_]=L.shadow.matrix,x++}s.directional[_]=j,_++}else if(L.isSpotLight){const j=e.get(L);j.position.setFromMatrixPosition(L.matrixWorld),j.color.copy(F).multiplyScalar(I*b),j.distance=H,j.coneCos=Math.cos(L.angle),j.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),j.decay=L.decay,s.spot[d]=j;const W=L.shadow;if(L.map&&(s.spotLightMap[P]=L.map,P++,W.updateMatrices(L),L.castShadow&&G++),s.spotLightMatrix[d]=W.matrix,L.castShadow){const K=i.get(L);K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,s.spotShadow[d]=K,s.spotShadowMap[d]=B,T++}d++}else if(L.isRectAreaLight){const j=e.get(L);j.color.copy(F).multiplyScalar(I),j.halfWidth.set(L.width*.5,0,0),j.halfHeight.set(0,L.height*.5,0),s.rectArea[y]=j,y++}else if(L.isPointLight){const j=e.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity*b),j.distance=L.distance,j.decay=L.decay,L.castShadow){const W=L.shadow,K=i.get(L);K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,K.shadowCameraNear=W.camera.near,K.shadowCameraFar=W.camera.far,s.pointShadow[m]=K,s.pointShadowMap[m]=B,s.pointShadowMatrix[m]=L.shadow.matrix,C++}s.point[m]=j,m++}else if(L.isHemisphereLight){const j=e.get(L);j.skyColor.copy(L.color).multiplyScalar(I*b),j.groundColor.copy(L.groundColor).multiplyScalar(I*b),s.hemi[v]=j,v++}}y>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=at.LTC_FLOAT_1,s.rectAreaLTC2=at.LTC_FLOAT_2):(s.rectAreaLTC1=at.LTC_HALF_1,s.rectAreaLTC2=at.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=at.LTC_FLOAT_1,s.rectAreaLTC2=at.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=at.LTC_HALF_1,s.rectAreaLTC2=at.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=g;const O=s.hash;(O.directionalLength!==_||O.pointLength!==m||O.spotLength!==d||O.rectAreaLength!==y||O.hemiLength!==v||O.numDirectionalShadows!==x||O.numPointShadows!==C||O.numSpotShadows!==T||O.numSpotMaps!==P||O.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=d,s.rectArea.length=y,s.point.length=m,s.hemi.length=v,s.directionalShadow.length=x,s.directionalShadowMap.length=x,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=x,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=T+P-G,s.spotLightMap.length=P,s.numSpotLightShadowsWithMaps=G,s.numLightProbes=M,O.directionalLength=_,O.pointLength=m,O.spotLength=d,O.rectAreaLength=y,O.hemiLength=v,O.numDirectionalShadows=x,O.numPointShadows=C,O.numSpotShadows=T,O.numSpotMaps=P,O.numLightProbes=M,s.version=Eg++)}function c(h,u){let f=0,p=0,g=0,_=0,m=0;const d=u.matrixWorldInverse;for(let y=0,v=h.length;y<v;y++){const x=h[y];if(x.isDirectionalLight){const C=s.directional[f];C.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),f++}else if(x.isSpotLight){const C=s.spot[g];C.position.setFromMatrixPosition(x.matrixWorld),C.position.applyMatrix4(d),C.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),g++}else if(x.isRectAreaLight){const C=s.rectArea[_];C.position.setFromMatrixPosition(x.matrixWorld),C.position.applyMatrix4(d),o.identity(),a.copy(x.matrixWorld),a.premultiply(d),o.extractRotation(a),C.halfWidth.set(x.width*.5,0,0),C.halfHeight.set(0,x.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){const C=s.point[p];C.position.setFromMatrixPosition(x.matrixWorld),C.position.applyMatrix4(d),p++}else if(x.isHemisphereLight){const C=s.hemi[m];C.direction.setFromMatrixPosition(x.matrixWorld),C.direction.transformDirection(d),m++}}}return{setup:l,setupView:c,state:s}}function hc(n,t){const e=new Tg(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function a(u){i.push(u)}function o(u){s.push(u)}function l(u){e.setup(i,u)}function c(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Ag(n,t){let e=new WeakMap;function i(r,a=0){const o=e.get(r);let l;return o===void 0?(l=new hc(n,t),e.set(r,[l])):a>=o.length?(l=new hc(n,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:i,dispose:s}}class Cg extends ji{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ud,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Pg extends ji{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Rg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lg=`uniform sampler2D shadow_pass;
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
}`;function Dg(n,t,e){let i=new To;const s=new _t,r=new _t,a=new ce,o=new Cg({depthPacking:dd}),l=new Pg,c={},h=e.maxTextureSize,u={[Li]:$e,[$e]:Li,[Je]:Je},f=new Ui({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:Rg,fragmentShader:Lg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Zt;g.setAttribute("position",new ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ne(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sh;let d=this.type;this.render=function(T,P,G){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),O=n.getActiveMipmapLevel(),$=n.state;$.setBlending(Xi),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const J=d!==wi&&this.type===wi,L=d===wi&&this.type!==wi;for(let F=0,I=T.length;F<I;F++){const H=T[F],B=H.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const j=B.getFrameExtents();if(s.multiply(j),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/j.x),s.x=r.x*j.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/j.y),s.y=r.y*j.y,B.mapSize.y=r.y)),B.map===null||J===!0||L===!0){const K=this.type!==wi?{minFilter:Pe,magFilter:Pe}:{};B.map!==null&&B.map.dispose(),B.map=new pn(s.x,s.y,K),B.map.texture.name=H.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const W=B.getViewportCount();for(let K=0;K<W;K++){const Q=B.getViewport(K);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),$.viewport(a),B.updateMatrices(H,K),i=B.getFrustum(),x(P,G,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===wi&&y(B,G),B.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(M,b,O)};function y(T,P){const G=t.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new pn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(P,null,G,f,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(P,null,G,p,_,null)}function v(T,P,G,M){let b=null;const O=G.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)b=O;else if(b=G.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const $=b.uuid,J=P.uuid;let L=c[$];L===void 0&&(L={},c[$]=L);let F=L[J];F===void 0&&(F=b.clone(),L[J]=F,P.addEventListener("dispose",C)),b=F}if(b.visible=P.visible,b.wireframe=P.wireframe,M===wi?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,G.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const $=n.properties.get(b);$.light=G}return b}function x(T,P,G,M,b){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===wi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld);const J=t.update(T),L=T.material;if(Array.isArray(L)){const F=J.groups;for(let I=0,H=F.length;I<H;I++){const B=F[I],j=L[B.materialIndex];if(j&&j.visible){const W=v(T,j,M,b);T.onBeforeShadow(n,T,P,G,J,W,B),n.renderBufferDirect(G,null,J,W,T,B),T.onAfterShadow(n,T,P,G,J,W,B)}}}else if(L.visible){const F=v(T,L,M,b);T.onBeforeShadow(n,T,P,G,J,F,null),n.renderBufferDirect(G,null,J,F,T,null),T.onAfterShadow(n,T,P,G,J,F,null)}}const $=T.children;for(let J=0,L=$.length;J<L;J++)x($[J],P,G,M,b)}function C(T){T.target.removeEventListener("dispose",C);for(const G in c){const M=c[G],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function Ig(n,t,e){const i=e.isWebGL2;function s(){let D=!1;const ht=new ce;let ut=null;const Lt=new ce(0,0,0,0);return{setMask:function(Ct){ut!==Ct&&!D&&(n.colorMask(Ct,Ct,Ct,Ct),ut=Ct)},setLocked:function(Ct){D=Ct},setClear:function(Ct,ne,se,we,ze){ze===!0&&(Ct*=we,ne*=we,se*=we),ht.set(Ct,ne,se,we),Lt.equals(ht)===!1&&(n.clearColor(Ct,ne,se,we),Lt.copy(ht))},reset:function(){D=!1,ut=null,Lt.set(-1,0,0,0)}}}function r(){let D=!1,ht=null,ut=null,Lt=null;return{setTest:function(Ct){Ct?z(n.DEPTH_TEST):ot(n.DEPTH_TEST)},setMask:function(Ct){ht!==Ct&&!D&&(n.depthMask(Ct),ht=Ct)},setFunc:function(Ct){if(ut!==Ct){switch(Ct){case Hu:n.depthFunc(n.NEVER);break;case Vu:n.depthFunc(n.ALWAYS);break;case Wu:n.depthFunc(n.LESS);break;case Sr:n.depthFunc(n.LEQUAL);break;case Xu:n.depthFunc(n.EQUAL);break;case $u:n.depthFunc(n.GEQUAL);break;case qu:n.depthFunc(n.GREATER);break;case Yu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ut=Ct}},setLocked:function(Ct){D=Ct},setClear:function(Ct){Lt!==Ct&&(n.clearDepth(Ct),Lt=Ct)},reset:function(){D=!1,ht=null,ut=null,Lt=null}}}function a(){let D=!1,ht=null,ut=null,Lt=null,Ct=null,ne=null,se=null,we=null,ze=null;return{setTest:function(re){D||(re?z(n.STENCIL_TEST):ot(n.STENCIL_TEST))},setMask:function(re){ht!==re&&!D&&(n.stencilMask(re),ht=re)},setFunc:function(re,Be,pi){(ut!==re||Lt!==Be||Ct!==pi)&&(n.stencilFunc(re,Be,pi),ut=re,Lt=Be,Ct=pi)},setOp:function(re,Be,pi){(ne!==re||se!==Be||we!==pi)&&(n.stencilOp(re,Be,pi),ne=re,se=Be,we=pi)},setLocked:function(re){D=re},setClear:function(re){ze!==re&&(n.clearStencil(re),ze=re)},reset:function(){D=!1,ht=null,ut=null,Lt=null,Ct=null,ne=null,se=null,we=null,ze=null}}}const o=new s,l=new r,c=new a,h=new WeakMap,u=new WeakMap;let f={},p={},g=new WeakMap,_=[],m=null,d=!1,y=null,v=null,x=null,C=null,T=null,P=null,G=null,M=new Yt(0,0,0),b=0,O=!1,$=null,J=null,L=null,F=null,I=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,j=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(W)[1]),B=j>=1):W.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),B=j>=2);let K=null,Q={};const k=n.getParameter(n.SCISSOR_BOX),Z=n.getParameter(n.VIEWPORT),nt=new ce().fromArray(k),dt=new ce().fromArray(Z);function gt(D,ht,ut,Lt){const Ct=new Uint8Array(4),ne=n.createTexture();n.bindTexture(D,ne),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let se=0;se<ut;se++)i&&(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)?n.texImage3D(ht,0,n.RGBA,1,1,Lt,0,n.RGBA,n.UNSIGNED_BYTE,Ct):n.texImage2D(ht+se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ct);return ne}const Et={};Et[n.TEXTURE_2D]=gt(n.TEXTURE_2D,n.TEXTURE_2D,1),Et[n.TEXTURE_CUBE_MAP]=gt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Et[n.TEXTURE_2D_ARRAY]=gt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Et[n.TEXTURE_3D]=gt(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),z(n.DEPTH_TEST),l.setFunc(Sr),At(!1),A(qo),z(n.CULL_FACE),ct(Xi);function z(D){f[D]!==!0&&(n.enable(D),f[D]=!0)}function ot(D){f[D]!==!1&&(n.disable(D),f[D]=!1)}function It(D,ht){return p[D]!==ht?(n.bindFramebuffer(D,ht),p[D]=ht,i&&(D===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=ht),D===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=ht)),!0):!1}function U(D,ht){let ut=_,Lt=!1;if(D)if(ut=g.get(ht),ut===void 0&&(ut=[],g.set(ht,ut)),D.isWebGLMultipleRenderTargets){const Ct=D.texture;if(ut.length!==Ct.length||ut[0]!==n.COLOR_ATTACHMENT0){for(let ne=0,se=Ct.length;ne<se;ne++)ut[ne]=n.COLOR_ATTACHMENT0+ne;ut.length=Ct.length,Lt=!0}}else ut[0]!==n.COLOR_ATTACHMENT0&&(ut[0]=n.COLOR_ATTACHMENT0,Lt=!0);else ut[0]!==n.BACK&&(ut[0]=n.BACK,Lt=!0);Lt&&(e.isWebGL2?n.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function Tt(D){return m!==D?(n.useProgram(D),m=D,!0):!1}const lt={[an]:n.FUNC_ADD,[Au]:n.FUNC_SUBTRACT,[Cu]:n.FUNC_REVERSE_SUBTRACT};if(i)lt[Zo]=n.MIN,lt[Ko]=n.MAX;else{const D=t.get("EXT_blend_minmax");D!==null&&(lt[Zo]=D.MIN_EXT,lt[Ko]=D.MAX_EXT)}const pt={[Pu]:n.ZERO,[Ru]:n.ONE,[Lu]:n.SRC_COLOR,[Xa]:n.SRC_ALPHA,[Ou]:n.SRC_ALPHA_SATURATE,[Fu]:n.DST_COLOR,[Iu]:n.DST_ALPHA,[Du]:n.ONE_MINUS_SRC_COLOR,[$a]:n.ONE_MINUS_SRC_ALPHA,[Nu]:n.ONE_MINUS_DST_COLOR,[Uu]:n.ONE_MINUS_DST_ALPHA,[zu]:n.CONSTANT_COLOR,[Bu]:n.ONE_MINUS_CONSTANT_COLOR,[Gu]:n.CONSTANT_ALPHA,[ku]:n.ONE_MINUS_CONSTANT_ALPHA};function ct(D,ht,ut,Lt,Ct,ne,se,we,ze,re){if(D===Xi){d===!0&&(ot(n.BLEND),d=!1);return}if(d===!1&&(z(n.BLEND),d=!0),D!==Tu){if(D!==y||re!==O){if((v!==an||T!==an)&&(n.blendEquation(n.FUNC_ADD),v=an,T=an),re)switch(D){case cn:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.ONE,n.ONE);break;case Yo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case jo:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case cn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Yo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case jo:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}x=null,C=null,P=null,G=null,M.set(0,0,0),b=0,y=D,O=re}return}Ct=Ct||ht,ne=ne||ut,se=se||Lt,(ht!==v||Ct!==T)&&(n.blendEquationSeparate(lt[ht],lt[Ct]),v=ht,T=Ct),(ut!==x||Lt!==C||ne!==P||se!==G)&&(n.blendFuncSeparate(pt[ut],pt[Lt],pt[ne],pt[se]),x=ut,C=Lt,P=ne,G=se),(we.equals(M)===!1||ze!==b)&&(n.blendColor(we.r,we.g,we.b,ze),M.copy(we),b=ze),y=D,O=!1}function Kt(D,ht){D.side===Je?ot(n.CULL_FACE):z(n.CULL_FACE);let ut=D.side===$e;ht&&(ut=!ut),At(ut),D.blending===cn&&D.transparent===!1?ct(Xi):ct(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),l.setFunc(D.depthFunc),l.setTest(D.depthTest),l.setMask(D.depthWrite),o.setMask(D.colorWrite);const Lt=D.stencilWrite;c.setTest(Lt),Lt&&(c.setMask(D.stencilWriteMask),c.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),c.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),X(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?z(n.SAMPLE_ALPHA_TO_COVERAGE):ot(n.SAMPLE_ALPHA_TO_COVERAGE)}function At(D){$!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),$=D)}function A(D){D!==Eu?(z(n.CULL_FACE),D!==J&&(D===qo?n.cullFace(n.BACK):D===wu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ot(n.CULL_FACE),J=D}function S(D){D!==L&&(B&&n.lineWidth(D),L=D)}function X(D,ht,ut){D?(z(n.POLYGON_OFFSET_FILL),(F!==ht||I!==ut)&&(n.polygonOffset(ht,ut),F=ht,I=ut)):ot(n.POLYGON_OFFSET_FILL)}function it(D){D?z(n.SCISSOR_TEST):ot(n.SCISSOR_TEST)}function et(D){D===void 0&&(D=n.TEXTURE0+H-1),K!==D&&(n.activeTexture(D),K=D)}function st(D,ht,ut){ut===void 0&&(K===null?ut=n.TEXTURE0+H-1:ut=K);let Lt=Q[ut];Lt===void 0&&(Lt={type:void 0,texture:void 0},Q[ut]=Lt),(Lt.type!==D||Lt.texture!==ht)&&(K!==ut&&(n.activeTexture(ut),K=ut),n.bindTexture(D,ht||Et[D]),Lt.type=D,Lt.texture=ht)}function xt(){const D=Q[K];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ft(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function vt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Rt(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ht(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function jt(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ut(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function wt(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function yt(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Bt(D){nt.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),nt.copy(D))}function Jt(D){dt.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),dt.copy(D))}function fe(D,ht){let ut=u.get(ht);ut===void 0&&(ut=new WeakMap,u.set(ht,ut));let Lt=ut.get(D);Lt===void 0&&(Lt=n.getUniformBlockIndex(ht,D.name),ut.set(D,Lt))}function Wt(D,ht){const Lt=u.get(ht).get(D);h.get(ht)!==Lt&&(n.uniformBlockBinding(ht,Lt,D.__bindingPointIndex),h.set(ht,Lt))}function rt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},K=null,Q={},p={},g=new WeakMap,_=[],m=null,d=!1,y=null,v=null,x=null,C=null,T=null,P=null,G=null,M=new Yt(0,0,0),b=0,O=!1,$=null,J=null,L=null,F=null,I=null,nt.set(0,0,n.canvas.width,n.canvas.height),dt.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:z,disable:ot,bindFramebuffer:It,drawBuffers:U,useProgram:Tt,setBlending:ct,setMaterial:Kt,setFlipSided:At,setCullFace:A,setLineWidth:S,setPolygonOffset:X,setScissorTest:it,activeTexture:et,bindTexture:st,unbindTexture:xt,compressedTexImage2D:ft,compressedTexImage3D:vt,texImage2D:wt,texImage3D:yt,updateUBOMapping:fe,uniformBlockBinding:Wt,texStorage2D:jt,texStorage3D:Ut,texSubImage2D:Rt,texSubImage3D:Ht,compressedTexSubImage2D:tt,compressedTexSubImage3D:te,scissor:Bt,viewport:Jt,reset:rt}}function Ug(n,t,e,i,s,r,a){const o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,S){return p?new OffscreenCanvas(A,S):ws("canvas")}function _(A,S,X,it){let et=1;if((A.width>it||A.height>it)&&(et=it/Math.max(A.width,A.height)),et<1||S===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const st=S?Cr:Math.floor,xt=st(et*A.width),ft=st(et*A.height);u===void 0&&(u=g(xt,ft));const vt=X?g(xt,ft):u;return vt.width=xt,vt.height=ft,vt.getContext("2d").drawImage(A,0,0,xt,ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+xt+"x"+ft+")."),vt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return Ja(A.width)&&Ja(A.height)}function d(A){return o?!1:A.wrapS!==We||A.wrapT!==We||A.minFilter!==Pe&&A.minFilter!==si}function y(A,S){return A.generateMipmaps&&S&&A.minFilter!==Pe&&A.minFilter!==si}function v(A){n.generateMipmap(A)}function x(A,S,X,it,et=!1){if(o===!1)return S;if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let st=S;if(S===n.RED&&(X===n.FLOAT&&(st=n.R32F),X===n.HALF_FLOAT&&(st=n.R16F),X===n.UNSIGNED_BYTE&&(st=n.R8)),S===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(st=n.R8UI),X===n.UNSIGNED_SHORT&&(st=n.R16UI),X===n.UNSIGNED_INT&&(st=n.R32UI),X===n.BYTE&&(st=n.R8I),X===n.SHORT&&(st=n.R16I),X===n.INT&&(st=n.R32I)),S===n.RG&&(X===n.FLOAT&&(st=n.RG32F),X===n.HALF_FLOAT&&(st=n.RG16F),X===n.UNSIGNED_BYTE&&(st=n.RG8)),S===n.RGBA){const xt=et?Er:ie.getTransfer(it);X===n.FLOAT&&(st=n.RGBA32F),X===n.HALF_FLOAT&&(st=n.RGBA16F),X===n.UNSIGNED_BYTE&&(st=xt===le?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function C(A,S,X){return y(A,X)===!0||A.isFramebufferTexture&&A.minFilter!==Pe&&A.minFilter!==si?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function T(A){return A===Pe||A===Jo||A===ia?n.NEAREST:n.LINEAR}function P(A){const S=A.target;S.removeEventListener("dispose",P),M(S),S.isVideoTexture&&h.delete(S)}function G(A){const S=A.target;S.removeEventListener("dispose",G),O(S)}function M(A){const S=i.get(A);if(S.__webglInit===void 0)return;const X=A.source,it=f.get(X);if(it){const et=it[S.__cacheKey];et.usedTimes--,et.usedTimes===0&&b(A),Object.keys(it).length===0&&f.delete(X)}i.remove(A)}function b(A){const S=i.get(A);n.deleteTexture(S.__webglTexture);const X=A.source,it=f.get(X);delete it[S.__cacheKey],a.memory.textures--}function O(A){const S=A.texture,X=i.get(A),it=i.get(S);if(it.__webglTexture!==void 0&&(n.deleteTexture(it.__webglTexture),a.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(X.__webglFramebuffer[et]))for(let st=0;st<X.__webglFramebuffer[et].length;st++)n.deleteFramebuffer(X.__webglFramebuffer[et][st]);else n.deleteFramebuffer(X.__webglFramebuffer[et]);X.__webglDepthbuffer&&n.deleteRenderbuffer(X.__webglDepthbuffer[et])}else{if(Array.isArray(X.__webglFramebuffer))for(let et=0;et<X.__webglFramebuffer.length;et++)n.deleteFramebuffer(X.__webglFramebuffer[et]);else n.deleteFramebuffer(X.__webglFramebuffer);if(X.__webglDepthbuffer&&n.deleteRenderbuffer(X.__webglDepthbuffer),X.__webglMultisampledFramebuffer&&n.deleteFramebuffer(X.__webglMultisampledFramebuffer),X.__webglColorRenderbuffer)for(let et=0;et<X.__webglColorRenderbuffer.length;et++)X.__webglColorRenderbuffer[et]&&n.deleteRenderbuffer(X.__webglColorRenderbuffer[et]);X.__webglDepthRenderbuffer&&n.deleteRenderbuffer(X.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let et=0,st=S.length;et<st;et++){const xt=i.get(S[et]);xt.__webglTexture&&(n.deleteTexture(xt.__webglTexture),a.memory.textures--),i.remove(S[et])}i.remove(S),i.remove(A)}let $=0;function J(){$=0}function L(){const A=$;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),$+=1,A}function F(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function I(A,S){const X=i.get(A);if(A.isVideoTexture&&Kt(A),A.isRenderTargetTexture===!1&&A.version>0&&X.__version!==A.version){const it=A.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(X,A,S);return}}e.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+S)}function H(A,S){const X=i.get(A);if(A.version>0&&X.__version!==A.version){nt(X,A,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+S)}function B(A,S){const X=i.get(A);if(A.version>0&&X.__version!==A.version){nt(X,A,S);return}e.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+S)}function j(A,S){const X=i.get(A);if(A.version>0&&X.__version!==A.version){dt(X,A,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+S)}const W={[br]:n.REPEAT,[We]:n.CLAMP_TO_EDGE,[ja]:n.MIRRORED_REPEAT},K={[Pe]:n.NEAREST,[Jo]:n.NEAREST_MIPMAP_NEAREST,[ia]:n.NEAREST_MIPMAP_LINEAR,[si]:n.LINEAR,[id]:n.LINEAR_MIPMAP_NEAREST,[bs]:n.LINEAR_MIPMAP_LINEAR},Q={[pd]:n.NEVER,[xd]:n.ALWAYS,[md]:n.LESS,[vh]:n.LEQUAL,[gd]:n.EQUAL,[yd]:n.GEQUAL,[_d]:n.GREATER,[vd]:n.NOTEQUAL};function k(A,S,X){if(X?(n.texParameteri(A,n.TEXTURE_WRAP_S,W[S.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,W[S.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,W[S.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,K[S.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,K[S.minFilter])):(n.texParameteri(A,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(A,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(S.wrapS!==We||S.wrapT!==We)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(A,n.TEXTURE_MAG_FILTER,T(S.magFilter)),n.texParameteri(A,n.TEXTURE_MIN_FILTER,T(S.minFilter)),S.minFilter!==Pe&&S.minFilter!==si&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Q[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const it=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===Pe||S.minFilter!==ia&&S.minFilter!==bs||S.type===Vi&&t.has("OES_texture_float_linear")===!1||o===!1&&S.type===Es&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||i.get(S).__currentAnisotropy)&&(n.texParameterf(A,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy)}}function Z(A,S){let X=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",P));const it=S.source;let et=f.get(it);et===void 0&&(et={},f.set(it,et));const st=F(S);if(st!==A.__cacheKey){et[st]===void 0&&(et[st]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,X=!0),et[st].usedTimes++;const xt=et[A.__cacheKey];xt!==void 0&&(et[A.__cacheKey].usedTimes--,xt.usedTimes===0&&b(S)),A.__cacheKey=st,A.__webglTexture=et[st].texture}return X}function nt(A,S,X){let it=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(it=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(it=n.TEXTURE_3D);const et=Z(A,S),st=S.source;e.bindTexture(it,A.__webglTexture,n.TEXTURE0+X);const xt=i.get(st);if(st.version!==xt.__version||et===!0){e.activeTexture(n.TEXTURE0+X);const ft=ie.getPrimaries(ie.workingColorSpace),vt=S.colorSpace===oi?null:ie.getPrimaries(S.colorSpace),Rt=S.colorSpace===oi||ft===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);const Ht=d(S)&&m(S.image)===!1;let tt=_(S.image,Ht,!1,s.maxTextureSize);tt=At(S,tt);const te=m(tt)||o,jt=r.convert(S.format,S.colorSpace);let Ut=r.convert(S.type),wt=x(S.internalFormat,jt,Ut,S.colorSpace,S.isVideoTexture);k(it,S,te);let yt;const Bt=S.mipmaps,Jt=o&&S.isVideoTexture!==!0&&wt!==mh,fe=xt.__version===void 0||et===!0,Wt=C(S,tt,te);if(S.isDepthTexture)wt=n.DEPTH_COMPONENT,o?S.type===Vi?wt=n.DEPTH_COMPONENT32F:S.type===Hi?wt=n.DEPTH_COMPONENT24:S.type===hn?wt=n.DEPTH24_STENCIL8:wt=n.DEPTH_COMPONENT16:S.type===Vi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===un&&wt===n.DEPTH_COMPONENT&&S.type!==So&&S.type!==Hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=Hi,Ut=r.convert(S.type)),S.format===Zn&&wt===n.DEPTH_COMPONENT&&(wt=n.DEPTH_STENCIL,S.type!==hn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=hn,Ut=r.convert(S.type))),fe&&(Jt?e.texStorage2D(n.TEXTURE_2D,1,wt,tt.width,tt.height):e.texImage2D(n.TEXTURE_2D,0,wt,tt.width,tt.height,0,jt,Ut,null));else if(S.isDataTexture)if(Bt.length>0&&te){Jt&&fe&&e.texStorage2D(n.TEXTURE_2D,Wt,wt,Bt[0].width,Bt[0].height);for(let rt=0,D=Bt.length;rt<D;rt++)yt=Bt[rt],Jt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,yt.width,yt.height,jt,Ut,yt.data):e.texImage2D(n.TEXTURE_2D,rt,wt,yt.width,yt.height,0,jt,Ut,yt.data);S.generateMipmaps=!1}else Jt?(fe&&e.texStorage2D(n.TEXTURE_2D,Wt,wt,tt.width,tt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,tt.width,tt.height,jt,Ut,tt.data)):e.texImage2D(n.TEXTURE_2D,0,wt,tt.width,tt.height,0,jt,Ut,tt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Jt&&fe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Wt,wt,Bt[0].width,Bt[0].height,tt.depth);for(let rt=0,D=Bt.length;rt<D;rt++)yt=Bt[rt],S.format!==ai?jt!==null?Jt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,tt.depth,jt,yt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,rt,wt,yt.width,yt.height,tt.depth,0,yt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,tt.depth,jt,Ut,yt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,rt,wt,yt.width,yt.height,tt.depth,0,jt,Ut,yt.data)}else{Jt&&fe&&e.texStorage2D(n.TEXTURE_2D,Wt,wt,Bt[0].width,Bt[0].height);for(let rt=0,D=Bt.length;rt<D;rt++)yt=Bt[rt],S.format!==ai?jt!==null?Jt?e.compressedTexSubImage2D(n.TEXTURE_2D,rt,0,0,yt.width,yt.height,jt,yt.data):e.compressedTexImage2D(n.TEXTURE_2D,rt,wt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,yt.width,yt.height,jt,Ut,yt.data):e.texImage2D(n.TEXTURE_2D,rt,wt,yt.width,yt.height,0,jt,Ut,yt.data)}else if(S.isDataArrayTexture)Jt?(fe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Wt,wt,tt.width,tt.height,tt.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,jt,Ut,tt.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,wt,tt.width,tt.height,tt.depth,0,jt,Ut,tt.data);else if(S.isData3DTexture)Jt?(fe&&e.texStorage3D(n.TEXTURE_3D,Wt,wt,tt.width,tt.height,tt.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,jt,Ut,tt.data)):e.texImage3D(n.TEXTURE_3D,0,wt,tt.width,tt.height,tt.depth,0,jt,Ut,tt.data);else if(S.isFramebufferTexture){if(fe)if(Jt)e.texStorage2D(n.TEXTURE_2D,Wt,wt,tt.width,tt.height);else{let rt=tt.width,D=tt.height;for(let ht=0;ht<Wt;ht++)e.texImage2D(n.TEXTURE_2D,ht,wt,rt,D,0,jt,Ut,null),rt>>=1,D>>=1}}else if(Bt.length>0&&te){Jt&&fe&&e.texStorage2D(n.TEXTURE_2D,Wt,wt,Bt[0].width,Bt[0].height);for(let rt=0,D=Bt.length;rt<D;rt++)yt=Bt[rt],Jt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,jt,Ut,yt):e.texImage2D(n.TEXTURE_2D,rt,wt,jt,Ut,yt);S.generateMipmaps=!1}else Jt?(fe&&e.texStorage2D(n.TEXTURE_2D,Wt,wt,tt.width,tt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,jt,Ut,tt)):e.texImage2D(n.TEXTURE_2D,0,wt,jt,Ut,tt);y(S,te)&&v(it),xt.__version=st.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function dt(A,S,X){if(S.image.length!==6)return;const it=Z(A,S),et=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+X);const st=i.get(et);if(et.version!==st.__version||it===!0){e.activeTexture(n.TEXTURE0+X);const xt=ie.getPrimaries(ie.workingColorSpace),ft=S.colorSpace===oi?null:ie.getPrimaries(S.colorSpace),vt=S.colorSpace===oi||xt===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Rt=S.isCompressedTexture||S.image[0].isCompressedTexture,Ht=S.image[0]&&S.image[0].isDataTexture,tt=[];for(let rt=0;rt<6;rt++)!Rt&&!Ht?tt[rt]=_(S.image[rt],!1,!0,s.maxCubemapSize):tt[rt]=Ht?S.image[rt].image:S.image[rt],tt[rt]=At(S,tt[rt]);const te=tt[0],jt=m(te)||o,Ut=r.convert(S.format,S.colorSpace),wt=r.convert(S.type),yt=x(S.internalFormat,Ut,wt,S.colorSpace),Bt=o&&S.isVideoTexture!==!0,Jt=st.__version===void 0||it===!0;let fe=C(S,te,jt);k(n.TEXTURE_CUBE_MAP,S,jt);let Wt;if(Rt){Bt&&Jt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,fe,yt,te.width,te.height);for(let rt=0;rt<6;rt++){Wt=tt[rt].mipmaps;for(let D=0;D<Wt.length;D++){const ht=Wt[D];S.format!==ai?Ut!==null?Bt?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D,0,0,ht.width,ht.height,Ut,ht.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D,yt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D,0,0,ht.width,ht.height,Ut,wt,ht.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D,yt,ht.width,ht.height,0,Ut,wt,ht.data)}}}else{Wt=S.mipmaps,Bt&&Jt&&(Wt.length>0&&fe++,e.texStorage2D(n.TEXTURE_CUBE_MAP,fe,yt,tt[0].width,tt[0].height));for(let rt=0;rt<6;rt++)if(Ht){Bt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,tt[rt].width,tt[rt].height,Ut,wt,tt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,yt,tt[rt].width,tt[rt].height,0,Ut,wt,tt[rt].data);for(let D=0;D<Wt.length;D++){const ut=Wt[D].image[rt].image;Bt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D+1,0,0,ut.width,ut.height,Ut,wt,ut.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D+1,yt,ut.width,ut.height,0,Ut,wt,ut.data)}}else{Bt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Ut,wt,tt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,yt,Ut,wt,tt[rt]);for(let D=0;D<Wt.length;D++){const ht=Wt[D];Bt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D+1,0,0,Ut,wt,ht.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,D+1,yt,Ut,wt,ht.image[rt])}}}y(S,jt)&&v(n.TEXTURE_CUBE_MAP),st.__version=et.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function gt(A,S,X,it,et,st){const xt=r.convert(X.format,X.colorSpace),ft=r.convert(X.type),vt=x(X.internalFormat,xt,ft,X.colorSpace);if(!i.get(S).__hasExternalTextures){const Ht=Math.max(1,S.width>>st),tt=Math.max(1,S.height>>st);et===n.TEXTURE_3D||et===n.TEXTURE_2D_ARRAY?e.texImage3D(et,st,vt,Ht,tt,S.depth,0,xt,ft,null):e.texImage2D(et,st,vt,Ht,tt,0,xt,ft,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),ct(S)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,it,et,i.get(X).__webglTexture,0,pt(S)):(et===n.TEXTURE_2D||et>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,it,et,i.get(X).__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Et(A,S,X){if(n.bindRenderbuffer(n.RENDERBUFFER,A),S.depthBuffer&&!S.stencilBuffer){let it=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(X||ct(S)){const et=S.depthTexture;et&&et.isDepthTexture&&(et.type===Vi?it=n.DEPTH_COMPONENT32F:et.type===Hi&&(it=n.DEPTH_COMPONENT24));const st=pt(S);ct(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,st,it,S.width,S.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,st,it,S.width,S.height)}else n.renderbufferStorage(n.RENDERBUFFER,it,S.width,S.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,A)}else if(S.depthBuffer&&S.stencilBuffer){const it=pt(S);X&&ct(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,it,n.DEPTH24_STENCIL8,S.width,S.height):ct(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,it,n.DEPTH24_STENCIL8,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,A)}else{const it=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let et=0;et<it.length;et++){const st=it[et],xt=r.convert(st.format,st.colorSpace),ft=r.convert(st.type),vt=x(st.internalFormat,xt,ft,st.colorSpace),Rt=pt(S);X&&ct(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Rt,vt,S.width,S.height):ct(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Rt,vt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,vt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function z(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),I(S.depthTexture,0);const it=i.get(S.depthTexture).__webglTexture,et=pt(S);if(S.depthTexture.format===un)ct(S)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,it,0,et):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,it,0);else if(S.depthTexture.format===Zn)ct(S)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,it,0,et):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function ot(A){const S=i.get(A),X=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");z(S.__webglFramebuffer,A)}else if(X){S.__webglDepthbuffer=[];for(let it=0;it<6;it++)e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[it]),S.__webglDepthbuffer[it]=n.createRenderbuffer(),Et(S.__webglDepthbuffer[it],A,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=n.createRenderbuffer(),Et(S.__webglDepthbuffer,A,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function It(A,S,X){const it=i.get(A);S!==void 0&&gt(it.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&ot(A)}function U(A){const S=A.texture,X=i.get(A),it=i.get(S);A.addEventListener("dispose",G),A.isWebGLMultipleRenderTargets!==!0&&(it.__webglTexture===void 0&&(it.__webglTexture=n.createTexture()),it.__version=S.version,a.memory.textures++);const et=A.isWebGLCubeRenderTarget===!0,st=A.isWebGLMultipleRenderTargets===!0,xt=m(A)||o;if(et){X.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(o&&S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer[ft]=[];for(let vt=0;vt<S.mipmaps.length;vt++)X.__webglFramebuffer[ft][vt]=n.createFramebuffer()}else X.__webglFramebuffer[ft]=n.createFramebuffer()}else{if(o&&S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer=[];for(let ft=0;ft<S.mipmaps.length;ft++)X.__webglFramebuffer[ft]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(st)if(s.drawBuffers){const ft=A.texture;for(let vt=0,Rt=ft.length;vt<Rt;vt++){const Ht=i.get(ft[vt]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&A.samples>0&&ct(A)===!1){const ft=st?S:[S];X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let vt=0;vt<ft.length;vt++){const Rt=ft[vt];X.__webglColorRenderbuffer[vt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[vt]);const Ht=r.convert(Rt.format,Rt.colorSpace),tt=r.convert(Rt.type),te=x(Rt.internalFormat,Ht,tt,Rt.colorSpace,A.isXRRenderTarget===!0),jt=pt(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,jt,te,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,X.__webglColorRenderbuffer[vt])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),Et(X.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(et){e.bindTexture(n.TEXTURE_CUBE_MAP,it.__webglTexture),k(n.TEXTURE_CUBE_MAP,S,xt);for(let ft=0;ft<6;ft++)if(o&&S.mipmaps&&S.mipmaps.length>0)for(let vt=0;vt<S.mipmaps.length;vt++)gt(X.__webglFramebuffer[ft][vt],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,vt);else gt(X.__webglFramebuffer[ft],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);y(S,xt)&&v(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(st){const ft=A.texture;for(let vt=0,Rt=ft.length;vt<Rt;vt++){const Ht=ft[vt],tt=i.get(Ht);e.bindTexture(n.TEXTURE_2D,tt.__webglTexture),k(n.TEXTURE_2D,Ht,xt),gt(X.__webglFramebuffer,A,Ht,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,0),y(Ht,xt)&&v(n.TEXTURE_2D)}e.unbindTexture()}else{let ft=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(o?ft=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ft,it.__webglTexture),k(ft,S,xt),o&&S.mipmaps&&S.mipmaps.length>0)for(let vt=0;vt<S.mipmaps.length;vt++)gt(X.__webglFramebuffer[vt],A,S,n.COLOR_ATTACHMENT0,ft,vt);else gt(X.__webglFramebuffer,A,S,n.COLOR_ATTACHMENT0,ft,0);y(S,xt)&&v(ft),e.unbindTexture()}A.depthBuffer&&ot(A)}function Tt(A){const S=m(A)||o,X=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let it=0,et=X.length;it<et;it++){const st=X[it];if(y(st,S)){const xt=A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ft=i.get(st).__webglTexture;e.bindTexture(xt,ft),v(xt),e.unbindTexture()}}}function lt(A){if(o&&A.samples>0&&ct(A)===!1){const S=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],X=A.width,it=A.height;let et=n.COLOR_BUFFER_BIT;const st=[],xt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=i.get(A),vt=A.isWebGLMultipleRenderTargets===!0;if(vt)for(let Rt=0;Rt<S.length;Rt++)e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Rt=0;Rt<S.length;Rt++){st.push(n.COLOR_ATTACHMENT0+Rt),A.depthBuffer&&st.push(xt);const Ht=ft.__ignoreDepthValues!==void 0?ft.__ignoreDepthValues:!1;if(Ht===!1&&(A.depthBuffer&&(et|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&(et|=n.STENCIL_BUFFER_BIT)),vt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ft.__webglColorRenderbuffer[Rt]),Ht===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[xt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[xt])),vt){const tt=i.get(S[Rt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,tt,0)}n.blitFramebuffer(0,0,X,it,0,0,X,it,et,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,st)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),vt)for(let Rt=0;Rt<S.length;Rt++){e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.RENDERBUFFER,ft.__webglColorRenderbuffer[Rt]);const Ht=i.get(S[Rt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Rt,n.TEXTURE_2D,Ht,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}}function pt(A){return Math.min(s.maxSamples,A.samples)}function ct(A){const S=i.get(A);return o&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Kt(A){const S=a.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}function At(A,S){const X=A.colorSpace,it=A.format,et=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Ka||X!==Ii&&X!==oi&&(ie.getTransfer(X)===le?o===!1?t.has("EXT_sRGB")===!0&&it===ai?(A.format=Ka,A.minFilter=si,A.generateMipmaps=!1):S=xh.sRGBToLinear(S):(it!==ai||et!==qi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),S}this.allocateTextureUnit=L,this.resetTextureUnits=J,this.setTexture2D=I,this.setTexture2DArray=H,this.setTexture3D=B,this.setTextureCube=j,this.rebindTextures=It,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=ot,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ct}function Fg(n,t,e){const i=e.isWebGL2;function s(r,a=oi){let o;const l=ie.getTransfer(a);if(r===qi)return n.UNSIGNED_BYTE;if(r===hh)return n.UNSIGNED_SHORT_4_4_4_4;if(r===uh)return n.UNSIGNED_SHORT_5_5_5_1;if(r===nd)return n.BYTE;if(r===sd)return n.SHORT;if(r===So)return n.UNSIGNED_SHORT;if(r===ch)return n.INT;if(r===Hi)return n.UNSIGNED_INT;if(r===Vi)return n.FLOAT;if(r===Es)return i?n.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===rd)return n.ALPHA;if(r===ai)return n.RGBA;if(r===ad)return n.LUMINANCE;if(r===od)return n.LUMINANCE_ALPHA;if(r===un)return n.DEPTH_COMPONENT;if(r===Zn)return n.DEPTH_STENCIL;if(r===Ka)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===ld)return n.RED;if(r===dh)return n.RED_INTEGER;if(r===cd)return n.RG;if(r===fh)return n.RG_INTEGER;if(r===ph)return n.RGBA_INTEGER;if(r===na||r===sa||r===ra||r===aa)if(l===le)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===na)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===sa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ra)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===aa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===na)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===sa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ra)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===aa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Qo||r===tl||r===el||r===il)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Qo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===tl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===el)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===il)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===mh)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===nl||r===sl)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===nl)return l===le?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===sl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===rl||r===al||r===ol||r===ll||r===cl||r===hl||r===ul||r===dl||r===fl||r===pl||r===ml||r===gl||r===_l||r===vl)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===rl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===al)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ol)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ll)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===cl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===hl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ul)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===dl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===fl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===pl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===ml)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===gl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===_l)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===vl)return l===le?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===oa||r===yl||r===xl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===oa)return l===le?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===yl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===xl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===hd||r===Ml||r===Sl||r===bl)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===oa)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Ml)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Sl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===bl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===hn?i?n.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}class Ng extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends Se{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Og={type:"move"};class Ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Og)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Me;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class zg extends gn{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null;const _=e.getContextAttributes();let m=null,d=null;const y=[],v=[],x=new _t;let C=null;const T=new Ve;T.layers.enable(1),T.viewport=new ce;const P=new Ve;P.layers.enable(2),P.viewport=new ce;const G=[T,P],M=new Ng;M.layers.enable(1),M.layers.enable(2);let b=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let Z=y[k];return Z===void 0&&(Z=new Ra,y[k]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(k){let Z=y[k];return Z===void 0&&(Z=new Ra,y[k]=Z),Z.getGripSpace()},this.getHand=function(k){let Z=y[k];return Z===void 0&&(Z=new Ra,y[k]=Z),Z.getHandSpace()};function $(k){const Z=v.indexOf(k.inputSource);if(Z===-1)return;const nt=y[Z];nt!==void 0&&(nt.update(k.inputSource,k.frame,c||a),nt.dispatchEvent({type:k.type,data:k.inputSource}))}function J(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",L);for(let k=0;k<y.length;k++){const Z=v[k];Z!==null&&(v[k]=null,y[k].disconnect(Z))}b=null,O=null,t.setRenderTarget(m),p=null,f=null,u=null,s=null,d=null,Q.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(x.width,x.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){o=k,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",J),s.addEventListener("inputsourceschange",L),_.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(x),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new pn(p.framebufferWidth,p.framebufferHeight,{format:ai,type:qi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Z=null,nt=null,dt=null;_.depth&&(dt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=_.stencil?Zn:un,nt=_.stencil?hn:Hi);const gt={colorFormat:e.RGBA8,depthFormat:dt,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(gt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new pn(f.textureWidth,f.textureHeight,{format:ai,type:qi,depthTexture:new Lh(f.textureWidth,f.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Et=t.properties.get(d);Et.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Q.setContext(s),Q.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function L(k){for(let Z=0;Z<k.removed.length;Z++){const nt=k.removed[Z],dt=v.indexOf(nt);dt>=0&&(v[dt]=null,y[dt].disconnect(nt))}for(let Z=0;Z<k.added.length;Z++){const nt=k.added[Z];let dt=v.indexOf(nt);if(dt===-1){for(let Et=0;Et<y.length;Et++)if(Et>=v.length){v.push(nt),dt=Et;break}else if(v[Et]===null){v[Et]=nt,dt=Et;break}if(dt===-1)break}const gt=y[dt];gt&&gt.connect(nt)}}const F=new E,I=new E;function H(k,Z,nt){F.setFromMatrixPosition(Z.matrixWorld),I.setFromMatrixPosition(nt.matrixWorld);const dt=F.distanceTo(I),gt=Z.projectionMatrix.elements,Et=nt.projectionMatrix.elements,z=gt[14]/(gt[10]-1),ot=gt[14]/(gt[10]+1),It=(gt[9]+1)/gt[5],U=(gt[9]-1)/gt[5],Tt=(gt[8]-1)/gt[0],lt=(Et[8]+1)/Et[0],pt=z*Tt,ct=z*lt,Kt=dt/(-Tt+lt),At=Kt*-Tt;Z.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(At),k.translateZ(Kt),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert();const A=z+Kt,S=ot+Kt,X=pt-At,it=ct+(dt-At),et=It*ot/S*A,st=U*ot/S*A;k.projectionMatrix.makePerspective(X,it,et,st,A,S),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}function B(k,Z){Z===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(Z.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;M.near=P.near=T.near=k.near,M.far=P.far=T.far=k.far,(b!==M.near||O!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,O=M.far);const Z=k.parent,nt=M.cameras;B(M,Z);for(let dt=0;dt<nt.length;dt++)B(nt[dt],Z);nt.length===2?H(M,T,P):M.projectionMatrix.copy(T.projectionMatrix),j(k,M,Z)};function j(k,Z,nt){nt===null?k.matrix.copy(Z.matrixWorld):(k.matrix.copy(nt.matrixWorld),k.matrix.invert(),k.matrix.multiply(Z.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(Z.projectionMatrix),k.projectionMatrixInverse.copy(Z.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Kn*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(k){l=k,f!==null&&(f.fixedFoveation=k),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=k)};let W=null;function K(k,Z){if(h=Z.getViewerPose(c||a),g=Z,h!==null){const nt=h.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let dt=!1;nt.length!==M.cameras.length&&(M.cameras.length=0,dt=!0);for(let gt=0;gt<nt.length;gt++){const Et=nt[gt];let z=null;if(p!==null)z=p.getViewport(Et);else{const It=u.getViewSubImage(f,Et);z=It.viewport,gt===0&&(t.setRenderTargetTextures(d,It.colorTexture,f.ignoreDepthValues?void 0:It.depthStencilTexture),t.setRenderTarget(d))}let ot=G[gt];ot===void 0&&(ot=new Ve,ot.layers.enable(gt),ot.viewport=new ce,G[gt]=ot),ot.matrix.fromArray(Et.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(Et.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(z.x,z.y,z.width,z.height),gt===0&&(M.matrix.copy(ot.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),dt===!0&&M.cameras.push(ot)}}for(let nt=0;nt<y.length;nt++){const dt=v[nt],gt=y[nt];dt!==null&&gt!==void 0&&gt.update(dt,Z,c||a)}W&&W(k,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Q=new Ph;Q.setAnimationLoop(K),this.setAnimationLoop=function(k){W=k},this.dispose=function(){}}}function Bg(n,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Th(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,y,v,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,x)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,y,v):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===$e&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===$e&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const y=t.get(d).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const v=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*v,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,y,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*y,m.scale.value=v*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,y){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===$e&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const y=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Gg(n,t,e,i){let s={},r={},a=[];const o=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,v){const x=v.program;i.uniformBlockBinding(y,x)}function c(y,v){let x=s[y.id];x===void 0&&(g(y),x=h(y),s[y.id]=x,y.addEventListener("dispose",m));const C=v.program;i.updateUBOMapping(y,C);const T=t.render.frame;r[y.id]!==T&&(f(y),r[y.id]=T)}function h(y){const v=u();y.__bindingPointIndex=v;const x=n.createBuffer(),C=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,x),x}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const v=s[y.id],x=y.uniforms,C=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,P=x.length;T<P;T++){const G=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,b=G.length;M<b;M++){const O=G[M];if(p(O,T,M,C)===!0){const $=O.__offset,J=Array.isArray(O.value)?O.value:[O.value];let L=0;for(let F=0;F<J.length;F++){const I=J[F],H=_(I);typeof I=="number"||typeof I=="boolean"?(O.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,$+L,O.__data)):I.isMatrix3?(O.__data[0]=I.elements[0],O.__data[1]=I.elements[1],O.__data[2]=I.elements[2],O.__data[3]=0,O.__data[4]=I.elements[3],O.__data[5]=I.elements[4],O.__data[6]=I.elements[5],O.__data[7]=0,O.__data[8]=I.elements[6],O.__data[9]=I.elements[7],O.__data[10]=I.elements[8],O.__data[11]=0):(I.toArray(O.__data,L),L+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,$,O.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,x,C){const T=y.value,P=v+"_"+x;if(C[P]===void 0)return typeof T=="number"||typeof T=="boolean"?C[P]=T:C[P]=T.clone(),!0;{const G=C[P];if(typeof T=="number"||typeof T=="boolean"){if(G!==T)return C[P]=T,!0}else if(G.equals(T)===!1)return G.copy(T),!0}return!1}function g(y){const v=y.uniforms;let x=0;const C=16;for(let P=0,G=v.length;P<G;P++){const M=Array.isArray(v[P])?v[P]:[v[P]];for(let b=0,O=M.length;b<O;b++){const $=M[b],J=Array.isArray($.value)?$.value:[$.value];for(let L=0,F=J.length;L<F;L++){const I=J[L],H=_(I),B=x%C;B!==0&&C-B<H.boundary&&(x+=C-B),$.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=x,x+=H.storage}}}const T=x%C;return T>0&&(x+=C-T),y.__size=x,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const x=a.indexOf(v.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class Oh{constructor(t={}){const{canvas:e=Fd(),context:i=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=a;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const d=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ce,this._useLegacyLights=!1,this.toneMapping=$i,this.toneMappingExposure=1;const v=this;let x=!1,C=0,T=0,P=null,G=-1,M=null;const b=new ce,O=new ce;let $=null;const J=new Yt(0);let L=0,F=e.width,I=e.height,H=1,B=null,j=null;const W=new ce(0,0,F,I),K=new ce(0,0,F,I);let Q=!1;const k=new To;let Z=!1,nt=!1,dt=null;const gt=new kt,Et=new _t,z=new E,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function It(){return P===null?H:1}let U=i;function Tt(w,N){for(let q=0;q<w.length;q++){const Y=w[q],V=e.getContext(Y,N);if(V!==null)return V}return null}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Mo}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",ht,!1),U===null){const N=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&N.shift(),U=Tt(N,w),U===null)throw Tt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let lt,pt,ct,Kt,At,A,S,X,it,et,st,xt,ft,vt,Rt,Ht,tt,te,jt,Ut,wt,yt,Bt,Jt;function fe(){lt=new Zp(U),pt=new Wp(U,lt,t),lt.init(pt),yt=new Fg(U,lt,pt),ct=new Ig(U,lt,pt),Kt=new Qp(U),At=new yg,A=new Ug(U,lt,ct,At,pt,yt,Kt),S=new $p(v),X=new jp(v),it=new a0(U,pt),Bt=new Hp(U,lt,it,pt),et=new Kp(U,it,Kt,Bt),st=new nm(U,et,it,Kt),jt=new im(U,pt,A),Ht=new Xp(At),xt=new vg(v,S,X,lt,pt,Bt,Ht),ft=new Bg(v,At),vt=new Mg,Rt=new Ag(lt,pt),te=new kp(v,S,X,ct,st,f,l),tt=new Dg(v,st,pt),Jt=new Gg(U,Kt,pt,ct),Ut=new Vp(U,lt,Kt,pt),wt=new Jp(U,lt,Kt,pt),Kt.programs=xt.programs,v.capabilities=pt,v.extensions=lt,v.properties=At,v.renderLists=vt,v.shadowMap=tt,v.state=ct,v.info=Kt}fe();const Wt=new zg(v,U);this.xr=Wt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const w=lt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=lt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(F,I,!1))},this.getSize=function(w){return w.set(F,I)},this.setSize=function(w,N,q=!0){if(Wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=w,I=N,e.width=Math.floor(w*H),e.height=Math.floor(N*H),q===!0&&(e.style.width=w+"px",e.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(F*H,I*H).floor()},this.setDrawingBufferSize=function(w,N,q){F=w,I=N,H=q,e.width=Math.floor(w*q),e.height=Math.floor(N*q),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(b)},this.getViewport=function(w){return w.copy(W)},this.setViewport=function(w,N,q,Y){w.isVector4?W.set(w.x,w.y,w.z,w.w):W.set(w,N,q,Y),ct.viewport(b.copy(W).multiplyScalar(H).floor())},this.getScissor=function(w){return w.copy(K)},this.setScissor=function(w,N,q,Y){w.isVector4?K.set(w.x,w.y,w.z,w.w):K.set(w,N,q,Y),ct.scissor(O.copy(K).multiplyScalar(H).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(w){ct.setScissorTest(Q=w)},this.setOpaqueSort=function(w){B=w},this.setTransparentSort=function(w){j=w},this.getClearColor=function(w){return w.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor.apply(te,arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha.apply(te,arguments)},this.clear=function(w=!0,N=!0,q=!0){let Y=0;if(w){let V=!1;if(P!==null){const mt=P.texture.format;V=mt===ph||mt===fh||mt===dh}if(V){const mt=P.texture.type,Mt=mt===qi||mt===Hi||mt===So||mt===hn||mt===hh||mt===uh,Pt=te.getClearColor(),Dt=te.getClearAlpha(),Vt=Pt.r,Ft=Pt.g,zt=Pt.b;Mt?(p[0]=Vt,p[1]=Ft,p[2]=zt,p[3]=Dt,U.clearBufferuiv(U.COLOR,0,p)):(g[0]=Vt,g[1]=Ft,g[2]=zt,g[3]=Dt,U.clearBufferiv(U.COLOR,0,g))}else Y|=U.COLOR_BUFFER_BIT}N&&(Y|=U.DEPTH_BUFFER_BIT),q&&(Y|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),vt.dispose(),Rt.dispose(),At.dispose(),S.dispose(),X.dispose(),st.dispose(),Bt.dispose(),Jt.dispose(),xt.dispose(),Wt.dispose(),Wt.removeEventListener("sessionstart",ze),Wt.removeEventListener("sessionend",re),dt&&(dt.dispose(),dt=null),Be.stop()};function rt(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const w=Kt.autoReset,N=tt.enabled,q=tt.autoUpdate,Y=tt.needsUpdate,V=tt.type;fe(),Kt.autoReset=w,tt.enabled=N,tt.autoUpdate=q,tt.needsUpdate=Y,tt.type=V}function ht(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ut(w){const N=w.target;N.removeEventListener("dispose",ut),Lt(N)}function Lt(w){Ct(w),At.remove(w)}function Ct(w){const N=At.get(w).programs;N!==void 0&&(N.forEach(function(q){xt.releaseProgram(q)}),w.isShaderMaterial&&xt.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,q,Y,V,mt){N===null&&(N=ot);const Mt=V.isMesh&&V.matrixWorld.determinant()<0,Pt=vu(w,N,q,Y,V);ct.setMaterial(Y,Mt);let Dt=q.index,Vt=1;if(Y.wireframe===!0){if(Dt=et.getWireframeAttribute(q),Dt===void 0)return;Vt=2}const Ft=q.drawRange,zt=q.attributes.position;let ge=Ft.start*Vt,Ye=(Ft.start+Ft.count)*Vt;mt!==null&&(ge=Math.max(ge,mt.start*Vt),Ye=Math.min(Ye,(mt.start+mt.count)*Vt)),Dt!==null?(ge=Math.max(ge,0),Ye=Math.min(Ye,Dt.count)):zt!=null&&(ge=Math.max(ge,0),Ye=Math.min(Ye,zt.count));const Te=Ye-ge;if(Te<0||Te===1/0)return;Bt.setup(V,Y,Pt,q,Dt);let yi,he=Ut;if(Dt!==null&&(yi=it.get(Dt),he=wt,he.setIndex(yi)),V.isMesh)Y.wireframe===!0?(ct.setLineWidth(Y.wireframeLinewidth*It()),he.setMode(U.LINES)):he.setMode(U.TRIANGLES);else if(V.isLine){let Xt=Y.linewidth;Xt===void 0&&(Xt=1),ct.setLineWidth(Xt*It()),V.isLineSegments?he.setMode(U.LINES):V.isLineLoop?he.setMode(U.LINE_LOOP):he.setMode(U.LINE_STRIP)}else V.isPoints?he.setMode(U.POINTS):V.isSprite&&he.setMode(U.TRIANGLES);if(V.isBatchedMesh)he.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else if(V.isInstancedMesh)he.renderInstances(ge,Te,V.count);else if(q.isInstancedBufferGeometry){const Xt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Jr=Math.min(q.instanceCount,Xt);he.renderInstances(ge,Te,Jr)}else he.render(ge,Te)};function ne(w,N,q){w.transparent===!0&&w.side===Je&&w.forceSinglePass===!1?(w.side=$e,w.needsUpdate=!0,Ns(w,N,q),w.side=Li,w.needsUpdate=!0,Ns(w,N,q),w.side=Je):Ns(w,N,q)}this.compile=function(w,N,q=null){q===null&&(q=w),m=Rt.get(q),m.init(),y.push(m),q.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),w!==q&&w.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),m.setupLights(v._useLegacyLights);const Y=new Set;return w.traverse(function(V){const mt=V.material;if(mt)if(Array.isArray(mt))for(let Mt=0;Mt<mt.length;Mt++){const Pt=mt[Mt];ne(Pt,q,V),Y.add(Pt)}else ne(mt,q,V),Y.add(mt)}),y.pop(),m=null,Y},this.compileAsync=function(w,N,q=null){const Y=this.compile(w,N,q);return new Promise(V=>{function mt(){if(Y.forEach(function(Mt){At.get(Mt).currentProgram.isReady()&&Y.delete(Mt)}),Y.size===0){V(w);return}setTimeout(mt,10)}lt.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let se=null;function we(w){se&&se(w)}function ze(){Be.stop()}function re(){Be.start()}const Be=new Ph;Be.setAnimationLoop(we),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(w){se=w,Wt.setAnimationLoop(w),w===null?Be.stop():Be.start()},Wt.addEventListener("sessionstart",ze),Wt.addEventListener("sessionend",re),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Wt.enabled===!0&&Wt.isPresenting===!0&&(Wt.cameraAutoUpdate===!0&&Wt.updateCamera(N),N=Wt.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,N,P),m=Rt.get(w,y.length),m.init(),y.push(m),gt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),k.setFromProjectionMatrix(gt),nt=this.localClippingEnabled,Z=Ht.init(this.clippingPlanes,nt),_=vt.get(w,d.length),_.init(),d.push(_),pi(w,N,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(B,j),this.info.render.frame++,Z===!0&&Ht.beginShadows();const q=m.state.shadowsArray;if(tt.render(q,w,N),Z===!0&&Ht.endShadows(),this.info.autoReset===!0&&this.info.reset(),te.render(_,w),m.setupLights(v._useLegacyLights),N.isArrayCamera){const Y=N.cameras;for(let V=0,mt=Y.length;V<mt;V++){const Mt=Y[V];Go(_,w,Mt,Mt.viewport)}}else Go(_,w,N);P!==null&&(A.updateMultisampleRenderTarget(P),A.updateRenderTargetMipmap(P)),w.isScene===!0&&w.onAfterRender(v,w,N),Bt.resetDefaultState(),G=-1,M=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function pi(w,N,q,Y){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||k.intersectsSprite(w)){Y&&z.setFromMatrixPosition(w.matrixWorld).applyMatrix4(gt);const Mt=st.update(w),Pt=w.material;Pt.visible&&_.push(w,Mt,Pt,q,z.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||k.intersectsObject(w))){const Mt=st.update(w),Pt=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),z.copy(w.boundingSphere.center)):(Mt.boundingSphere===null&&Mt.computeBoundingSphere(),z.copy(Mt.boundingSphere.center)),z.applyMatrix4(w.matrixWorld).applyMatrix4(gt)),Array.isArray(Pt)){const Dt=Mt.groups;for(let Vt=0,Ft=Dt.length;Vt<Ft;Vt++){const zt=Dt[Vt],ge=Pt[zt.materialIndex];ge&&ge.visible&&_.push(w,Mt,ge,q,z.z,zt)}}else Pt.visible&&_.push(w,Mt,Pt,q,z.z,null)}}const mt=w.children;for(let Mt=0,Pt=mt.length;Mt<Pt;Mt++)pi(mt[Mt],N,q,Y)}function Go(w,N,q,Y){const V=w.opaque,mt=w.transmissive,Mt=w.transparent;m.setupLightsView(q),Z===!0&&Ht.setGlobalState(v.clippingPlanes,q),mt.length>0&&_u(V,mt,N,q),Y&&ct.viewport(b.copy(Y)),V.length>0&&Fs(V,N,q),mt.length>0&&Fs(mt,N,q),Mt.length>0&&Fs(Mt,N,q),ct.buffers.depth.setTest(!0),ct.buffers.depth.setMask(!0),ct.buffers.color.setMask(!0),ct.setPolygonOffset(!1)}function _u(w,N,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const mt=pt.isWebGL2;dt===null&&(dt=new pn(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")?Es:qi,minFilter:bs,samples:mt?4:0})),v.getDrawingBufferSize(Et),mt?dt.setSize(Et.x,Et.y):dt.setSize(Cr(Et.x),Cr(Et.y));const Mt=v.getRenderTarget();v.setRenderTarget(dt),v.getClearColor(J),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear();const Pt=v.toneMapping;v.toneMapping=$i,Fs(w,q,Y),A.updateMultisampleRenderTarget(dt),A.updateRenderTargetMipmap(dt);let Dt=!1;for(let Vt=0,Ft=N.length;Vt<Ft;Vt++){const zt=N[Vt],ge=zt.object,Ye=zt.geometry,Te=zt.material,yi=zt.group;if(Te.side===Je&&ge.layers.test(Y.layers)){const he=Te.side;Te.side=$e,Te.needsUpdate=!0,ko(ge,q,Y,Ye,Te,yi),Te.side=he,Te.needsUpdate=!0,Dt=!0}}Dt===!0&&(A.updateMultisampleRenderTarget(dt),A.updateRenderTargetMipmap(dt)),v.setRenderTarget(Mt),v.setClearColor(J,L),v.toneMapping=Pt}function Fs(w,N,q){const Y=N.isScene===!0?N.overrideMaterial:null;for(let V=0,mt=w.length;V<mt;V++){const Mt=w[V],Pt=Mt.object,Dt=Mt.geometry,Vt=Y===null?Mt.material:Y,Ft=Mt.group;Pt.layers.test(q.layers)&&ko(Pt,N,q,Dt,Vt,Ft)}}function ko(w,N,q,Y,V,mt){w.onBeforeRender(v,N,q,Y,V,mt),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),V.onBeforeRender(v,N,q,Y,w,mt),V.transparent===!0&&V.side===Je&&V.forceSinglePass===!1?(V.side=$e,V.needsUpdate=!0,v.renderBufferDirect(q,N,Y,V,w,mt),V.side=Li,V.needsUpdate=!0,v.renderBufferDirect(q,N,Y,V,w,mt),V.side=Je):v.renderBufferDirect(q,N,Y,V,w,mt),w.onAfterRender(v,N,q,Y,V,mt)}function Ns(w,N,q){N.isScene!==!0&&(N=ot);const Y=At.get(w),V=m.state.lights,mt=m.state.shadowsArray,Mt=V.state.version,Pt=xt.getParameters(w,V.state,mt,N,q),Dt=xt.getProgramCacheKey(Pt);let Vt=Y.programs;Y.environment=w.isMeshStandardMaterial?N.environment:null,Y.fog=N.fog,Y.envMap=(w.isMeshStandardMaterial?X:S).get(w.envMap||Y.environment),Vt===void 0&&(w.addEventListener("dispose",ut),Vt=new Map,Y.programs=Vt);let Ft=Vt.get(Dt);if(Ft!==void 0){if(Y.currentProgram===Ft&&Y.lightsStateVersion===Mt)return Vo(w,Pt),Ft}else Pt.uniforms=xt.getUniforms(w),w.onBuild(q,Pt,v),w.onBeforeCompile(Pt,v),Ft=xt.acquireProgram(Pt,Dt),Vt.set(Dt,Ft),Y.uniforms=Pt.uniforms;const zt=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(zt.clippingPlanes=Ht.uniform),Vo(w,Pt),Y.needsLights=xu(w),Y.lightsStateVersion=Mt,Y.needsLights&&(zt.ambientLightColor.value=V.state.ambient,zt.lightProbe.value=V.state.probe,zt.directionalLights.value=V.state.directional,zt.directionalLightShadows.value=V.state.directionalShadow,zt.spotLights.value=V.state.spot,zt.spotLightShadows.value=V.state.spotShadow,zt.rectAreaLights.value=V.state.rectArea,zt.ltc_1.value=V.state.rectAreaLTC1,zt.ltc_2.value=V.state.rectAreaLTC2,zt.pointLights.value=V.state.point,zt.pointLightShadows.value=V.state.pointShadow,zt.hemisphereLights.value=V.state.hemi,zt.directionalShadowMap.value=V.state.directionalShadowMap,zt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,zt.spotShadowMap.value=V.state.spotShadowMap,zt.spotLightMatrix.value=V.state.spotLightMatrix,zt.spotLightMap.value=V.state.spotLightMap,zt.pointShadowMap.value=V.state.pointShadowMap,zt.pointShadowMatrix.value=V.state.pointShadowMatrix),Y.currentProgram=Ft,Y.uniformsList=null,Ft}function Ho(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=yr.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function Vo(w,N){const q=At.get(w);q.outputColorSpace=N.outputColorSpace,q.batching=N.batching,q.instancing=N.instancing,q.instancingColor=N.instancingColor,q.skinning=N.skinning,q.morphTargets=N.morphTargets,q.morphNormals=N.morphNormals,q.morphColors=N.morphColors,q.morphTargetsCount=N.morphTargetsCount,q.numClippingPlanes=N.numClippingPlanes,q.numIntersection=N.numClipIntersection,q.vertexAlphas=N.vertexAlphas,q.vertexTangents=N.vertexTangents,q.toneMapping=N.toneMapping}function vu(w,N,q,Y,V){N.isScene!==!0&&(N=ot),A.resetTextureUnits();const mt=N.fog,Mt=Y.isMeshStandardMaterial?N.environment:null,Pt=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Ii,Dt=(Y.isMeshStandardMaterial?X:S).get(Y.envMap||Mt),Vt=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ft=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),zt=!!q.morphAttributes.position,ge=!!q.morphAttributes.normal,Ye=!!q.morphAttributes.color;let Te=$i;Y.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Te=v.toneMapping);const yi=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,he=yi!==void 0?yi.length:0,Xt=At.get(Y),Jr=m.state.lights;if(Z===!0&&(nt===!0||w!==M)){const ei=w===M&&Y.id===G;Ht.setState(Y,w,ei)}let pe=!1;Y.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==Jr.state.version||Xt.outputColorSpace!==Pt||V.isBatchedMesh&&Xt.batching===!1||!V.isBatchedMesh&&Xt.batching===!0||V.isInstancedMesh&&Xt.instancing===!1||!V.isInstancedMesh&&Xt.instancing===!0||V.isSkinnedMesh&&Xt.skinning===!1||!V.isSkinnedMesh&&Xt.skinning===!0||V.isInstancedMesh&&Xt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Xt.instancingColor===!1&&V.instanceColor!==null||Xt.envMap!==Dt||Y.fog===!0&&Xt.fog!==mt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Ht.numPlanes||Xt.numIntersection!==Ht.numIntersection)||Xt.vertexAlphas!==Vt||Xt.vertexTangents!==Ft||Xt.morphTargets!==zt||Xt.morphNormals!==ge||Xt.morphColors!==Ye||Xt.toneMapping!==Te||pt.isWebGL2===!0&&Xt.morphTargetsCount!==he)&&(pe=!0):(pe=!0,Xt.__version=Y.version);let Ki=Xt.currentProgram;pe===!0&&(Ki=Ns(Y,N,V));let Wo=!1,ns=!1,Qr=!1;const Le=Ki.getUniforms(),Ji=Xt.uniforms;if(ct.useProgram(Ki.program)&&(Wo=!0,ns=!0,Qr=!0),Y.id!==G&&(G=Y.id,ns=!0),Wo||M!==w){Le.setValue(U,"projectionMatrix",w.projectionMatrix),Le.setValue(U,"viewMatrix",w.matrixWorldInverse);const ei=Le.map.cameraPosition;ei!==void 0&&ei.setValue(U,z.setFromMatrixPosition(w.matrixWorld)),pt.logarithmicDepthBuffer&&Le.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Le.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,ns=!0,Qr=!0)}if(V.isSkinnedMesh){Le.setOptional(U,V,"bindMatrix"),Le.setOptional(U,V,"bindMatrixInverse");const ei=V.skeleton;ei&&(pt.floatVertexTextures?(ei.boneTexture===null&&ei.computeBoneTexture(),Le.setValue(U,"boneTexture",ei.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}V.isBatchedMesh&&(Le.setOptional(U,V,"batchingTexture"),Le.setValue(U,"batchingTexture",V._matricesTexture,A));const ta=q.morphAttributes;if((ta.position!==void 0||ta.normal!==void 0||ta.color!==void 0&&pt.isWebGL2===!0)&&jt.update(V,q,Ki),(ns||Xt.receiveShadow!==V.receiveShadow)&&(Xt.receiveShadow=V.receiveShadow,Le.setValue(U,"receiveShadow",V.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Ji.envMap.value=Dt,Ji.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),ns&&(Le.setValue(U,"toneMappingExposure",v.toneMappingExposure),Xt.needsLights&&yu(Ji,Qr),mt&&Y.fog===!0&&ft.refreshFogUniforms(Ji,mt),ft.refreshMaterialUniforms(Ji,Y,H,I,dt),yr.upload(U,Ho(Xt),Ji,A)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(yr.upload(U,Ho(Xt),Ji,A),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Le.setValue(U,"center",V.center),Le.setValue(U,"modelViewMatrix",V.modelViewMatrix),Le.setValue(U,"normalMatrix",V.normalMatrix),Le.setValue(U,"modelMatrix",V.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const ei=Y.uniformsGroups;for(let ea=0,Mu=ei.length;ea<Mu;ea++)if(pt.isWebGL2){const Xo=ei[ea];Jt.update(Xo,Ki),Jt.bind(Xo,Ki)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ki}function yu(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function xu(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(w,N,q){At.get(w.texture).__webglTexture=N,At.get(w.depthTexture).__webglTexture=q;const Y=At.get(w);Y.__hasExternalTextures=!0,Y.__hasExternalTextures&&(Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,N){const q=At.get(w);q.__webglFramebuffer=N,q.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,q=0){P=w,C=N,T=q;let Y=!0,V=null,mt=!1,Mt=!1;if(w){const Dt=At.get(w);Dt.__useDefaultFramebuffer!==void 0?(ct.bindFramebuffer(U.FRAMEBUFFER,null),Y=!1):Dt.__webglFramebuffer===void 0?A.setupRenderTarget(w):Dt.__hasExternalTextures&&A.rebindTextures(w,At.get(w.texture).__webglTexture,At.get(w.depthTexture).__webglTexture);const Vt=w.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(Mt=!0);const Ft=At.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ft[N])?V=Ft[N][q]:V=Ft[N],mt=!0):pt.isWebGL2&&w.samples>0&&A.useMultisampledRTT(w)===!1?V=At.get(w).__webglMultisampledFramebuffer:Array.isArray(Ft)?V=Ft[q]:V=Ft,b.copy(w.viewport),O.copy(w.scissor),$=w.scissorTest}else b.copy(W).multiplyScalar(H).floor(),O.copy(K).multiplyScalar(H).floor(),$=Q;if(ct.bindFramebuffer(U.FRAMEBUFFER,V)&&pt.drawBuffers&&Y&&ct.drawBuffers(w,V),ct.viewport(b),ct.scissor(O),ct.setScissorTest($),mt){const Dt=At.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,Dt.__webglTexture,q)}else if(Mt){const Dt=At.get(w.texture),Vt=N||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Dt.__webglTexture,q||0,Vt)}G=-1},this.readRenderTargetPixels=function(w,N,q,Y,V,mt,Mt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=At.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Mt!==void 0&&(Pt=Pt[Mt]),Pt){ct.bindFramebuffer(U.FRAMEBUFFER,Pt);try{const Dt=w.texture,Vt=Dt.format,Ft=Dt.type;if(Vt!==ai&&yt.convert(Vt)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const zt=Ft===Es&&(lt.has("EXT_color_buffer_half_float")||pt.isWebGL2&&lt.has("EXT_color_buffer_float"));if(Ft!==qi&&yt.convert(Ft)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ft===Vi&&(pt.isWebGL2||lt.has("OES_texture_float")||lt.has("WEBGL_color_buffer_float")))&&!zt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-Y&&q>=0&&q<=w.height-V&&U.readPixels(N,q,Y,V,yt.convert(Vt),yt.convert(Ft),mt)}finally{const Dt=P!==null?At.get(P).__webglFramebuffer:null;ct.bindFramebuffer(U.FRAMEBUFFER,Dt)}}},this.copyFramebufferToTexture=function(w,N,q=0){const Y=Math.pow(2,-q),V=Math.floor(N.image.width*Y),mt=Math.floor(N.image.height*Y);A.setTexture2D(N,0),U.copyTexSubImage2D(U.TEXTURE_2D,q,0,0,w.x,w.y,V,mt),ct.unbindTexture()},this.copyTextureToTexture=function(w,N,q,Y=0){const V=N.image.width,mt=N.image.height,Mt=yt.convert(q.format),Pt=yt.convert(q.type);A.setTexture2D(q,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,q.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,q.unpackAlignment),N.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Y,w.x,w.y,V,mt,Mt,Pt,N.image.data):N.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Y,w.x,w.y,N.mipmaps[0].width,N.mipmaps[0].height,Mt,N.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,Y,w.x,w.y,Mt,Pt,N.image),Y===0&&q.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),ct.unbindTexture()},this.copyTextureToTexture3D=function(w,N,q,Y,V=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const mt=w.max.x-w.min.x+1,Mt=w.max.y-w.min.y+1,Pt=w.max.z-w.min.z+1,Dt=yt.convert(Y.format),Vt=yt.convert(Y.type);let Ft;if(Y.isData3DTexture)A.setTexture3D(Y,0),Ft=U.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)A.setTexture2DArray(Y,0),Ft=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,Y.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,Y.unpackAlignment);const zt=U.getParameter(U.UNPACK_ROW_LENGTH),ge=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ye=U.getParameter(U.UNPACK_SKIP_PIXELS),Te=U.getParameter(U.UNPACK_SKIP_ROWS),yi=U.getParameter(U.UNPACK_SKIP_IMAGES),he=q.isCompressedTexture?q.mipmaps[V]:q.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,he.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,he.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,w.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,w.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,w.min.z),q.isDataTexture||q.isData3DTexture?U.texSubImage3D(Ft,V,N.x,N.y,N.z,mt,Mt,Pt,Dt,Vt,he.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Ft,V,N.x,N.y,N.z,mt,Mt,Pt,Dt,he.data)):U.texSubImage3D(Ft,V,N.x,N.y,N.z,mt,Mt,Pt,Dt,Vt,he),U.pixelStorei(U.UNPACK_ROW_LENGTH,zt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ge),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ye),U.pixelStorei(U.UNPACK_SKIP_ROWS,Te),U.pixelStorei(U.UNPACK_SKIP_IMAGES,yi),V===0&&Y.generateMipmaps&&U.generateMipmap(Ft),ct.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),ct.unbindTexture()},this.resetState=function(){C=0,T=0,P=null,ct.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===bo?"display-p3":"srgb",e.unpackColorSpace=ie.workingColorSpace===Ir?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ce?dn:gh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===dn?Ce:Ii}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class kg extends Oh{}kg.prototype.isWebGL1Renderer=!0;class zh extends Se{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Hg{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Za,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Ri()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ge=new E;class Pr{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix4(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ge.fromBufferAttribute(this,e),Ge.applyNormalMatrix(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ge.fromBufferAttribute(this,e),Ge.transformDirection(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=gi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=gi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=gi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=gi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new ue(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Pr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Po extends ji{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let In;const ls=new E,Un=new E,Fn=new E,Nn=new _t,cs=new _t,Bh=new kt,rr=new E,hs=new E,ar=new E,uc=new _t,La=new _t,dc=new _t;class Gh extends Se{constructor(t=new Po){if(super(),this.isSprite=!0,this.type="Sprite",In===void 0){In=new Zt;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Hg(e,5);In.setIndex([0,1,2,0,2,3]),In.setAttribute("position",new Pr(i,3,0,!1)),In.setAttribute("uv",new Pr(i,2,3,!1))}this.geometry=In,this.material=t,this.center=new _t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Un.setFromMatrixScale(this.matrixWorld),Bh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Fn.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Un.multiplyScalar(-Fn.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;or(rr.set(-.5,-.5,0),Fn,a,Un,s,r),or(hs.set(.5,-.5,0),Fn,a,Un,s,r),or(ar.set(.5,.5,0),Fn,a,Un,s,r),uc.set(0,0),La.set(1,0),dc.set(1,1);let o=t.ray.intersectTriangle(rr,hs,ar,!1,ls);if(o===null&&(or(hs.set(-.5,.5,0),Fn,a,Un,s,r),La.set(0,1),o=t.ray.intersectTriangle(rr,ar,hs,!1,ls),o===null))return;const l=t.ray.origin.distanceTo(ls);l<t.near||l>t.far||e.push({distance:l,point:ls.clone(),uv:ri.getInterpolation(ls,rr,hs,ar,uc,La,dc,new _t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function or(n,t,e,i,s,r){Nn.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(cs.x=r*Nn.x-s*Nn.y,cs.y=s*Nn.x+r*Nn.y):cs.copy(Nn),n.copy(t),n.x+=cs.x,n.y+=cs.y,n.applyMatrix4(Bh)}class Vg extends Oe{constructor(t=null,e=1,i=1,s,r,a,o,l,c=Pe,h=Pe,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class He extends ji{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const fc=new E,pc=new E,mc=new kt,Da=new Ur,lr=new es;class qe extends Se{constructor(t=new Zt,e=new He){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)fc.fromBufferAttribute(e,s-1),pc.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=fc.distanceTo(pc);t.setAttribute("lineDistance",new de(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),lr.copy(i.boundingSphere),lr.applyMatrix4(s),lr.radius+=r,t.ray.intersectsSphere(lr)===!1)return;mc.copy(s).invert(),Da.copy(t.ray).applyMatrix4(mc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new E,h=new E,u=new E,f=new E,p=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){const d=Math.max(0,a.start),y=Math.min(g.count,a.start+a.count);for(let v=d,x=y-1;v<x;v+=p){const C=g.getX(v),T=g.getX(v+1);if(c.fromBufferAttribute(m,C),h.fromBufferAttribute(m,T),Da.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);const G=t.ray.origin.distanceTo(f);G<t.near||G>t.far||e.push({distance:G,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,a.start),y=Math.min(m.count,a.start+a.count);for(let v=d,x=y-1;v<x;v+=p){if(c.fromBufferAttribute(m,v),h.fromBufferAttribute(m,v+1),Da.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);const T=t.ray.origin.distanceTo(f);T<t.near||T>t.far||e.push({distance:T,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const gc=new E,_c=new E;class kh extends qe{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)gc.fromBufferAttribute(e,s),_c.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+gc.distanceTo(_c);t.setAttribute("lineDistance",new de(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Or extends qe{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Hh extends ji{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const vc=new kt,to=new Ur,cr=new es,hr=new E;class Wg extends Se{constructor(t=new Zt,e=new Hh){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cr.copy(i.boundingSphere),cr.applyMatrix4(s),cr.radius+=r,t.ray.intersectsSphere(cr)===!1)return;vc.copy(s).invert(),to.copy(t.ray).applyMatrix4(vc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=f,_=p;g<_;g++){const m=c.getX(g);hr.fromBufferAttribute(u,m),yc(hr,m,l,s,t,e,this)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=f,_=p;g<_;g++)hr.fromBufferAttribute(u,g),yc(hr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function yc(n,t,e,i,s,r,a){const o=to.distanceSqToPoint(n);if(o<e){const l=new E;to.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,object:a})}}class Vh extends Oe{constructor(t,e,i,s,r,a,o,l,c){super(t,e,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Fi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const h=i[s],f=i[s+1]-h,p=(a-h)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new _t:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new E,s=[],r=[],a=[],o=new E,l=new kt;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new E)}r[0]=new E,a[0]=new E;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Re(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Re(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Vn extends Fi{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e){const i=e||new _t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Xg extends Vn{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ro(){let n=0,t=0,e=0,i=0;function s(r,a,o,l){n=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,p*=h,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const ur=new E,Ia=new Ro,Ua=new Ro,Fa=new Ro;class zr extends Fi{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new E){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(ur.subVectors(s[0],s[1]).add(s[0]),c=ur);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(ur.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ur),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ia.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,_,m),Ua.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,_,m),Fa.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Ia.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Ua.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Fa.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(Ia.calc(l),Ua.calc(l),Fa.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new E().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function xc(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,l=n*o;return(2*e-2*i+r+a)*l+(-3*e+3*i-2*r-a)*o+r*n+e}function $g(n,t){const e=1-n;return e*e*t}function qg(n,t){return 2*(1-n)*n*t}function Yg(n,t){return n*n*t}function xs(n,t,e,i){return $g(n,t)+qg(n,e)+Yg(n,i)}function jg(n,t){const e=1-n;return e*e*e*t}function Zg(n,t){const e=1-n;return 3*e*e*n*t}function Kg(n,t){return 3*(1-n)*n*n*t}function Jg(n,t){return n*n*n*t}function Ms(n,t,e,i,s){return jg(n,t)+Zg(n,e)+Kg(n,i)+Jg(n,s)}class Qg extends Fi{constructor(t=new _t,e=new _t,i=new _t,s=new _t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new _t){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Ms(t,s.x,r.x,a.x,o.x),Ms(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class t1 extends Fi{constructor(t=new E,e=new E,i=new E,s=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new E){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Ms(t,s.x,r.x,a.x,o.x),Ms(t,s.y,r.y,a.y,o.y),Ms(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class e1 extends Fi{constructor(t=new _t,e=new _t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new _t){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new _t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class i1 extends Fi{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class n1 extends Fi{constructor(t=new _t,e=new _t,i=new _t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new _t){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(xs(t,s.x,r.x,a.x),xs(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wh extends Fi{constructor(t=new E,e=new E,i=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new E){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(xs(t,s.x,r.x,a.x),xs(t,s.y,r.y,a.y),xs(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class s1 extends Fi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new _t){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(xc(o,l.x,c.x,h.x,u.x),xc(o,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new _t().fromArray(s))}return this}}var r1=Object.freeze({__proto__:null,ArcCurve:Xg,CatmullRomCurve3:zr,CubicBezierCurve:Qg,CubicBezierCurve3:t1,EllipseCurve:Vn,LineCurve:e1,LineCurve3:i1,QuadraticBezierCurve:n1,QuadraticBezierCurve3:Wh,SplineCurve:s1});class Br extends Zt{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=t;const f=(e-t)/s,p=new E,g=new _t;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){const d=r+m/i*a;p.x=u*Math.cos(d),p.y=u*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const m=_*(i+1);for(let d=0;d<i;d++){const y=d+m,v=y,x=y+i+1,C=y+i+2,T=y+1;o.push(v,x,T),o.push(x,C,T)}}this.setIndex(o),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Br(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Yi extends Zt{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new E,f=new E,p=[],g=[],_=[],m=[];for(let d=0;d<=i;d++){const y=[],v=d/i;let x=0;d===0&&a===0?x=.5/e:d===i&&l===Math.PI&&(x=-.5/e);for(let C=0;C<=e;C++){const T=C/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=t*Math.cos(a+v*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(T+x,1-v),y.push(c++)}h.push(y)}for(let d=0;d<i;d++)for(let y=0;y<e;y++){const v=h[d][y+1],x=h[d][y],C=h[d+1][y],T=h[d+1][y+1];(d!==0||a>0)&&p.push(v,x,T),(d!==i-1||l<Math.PI)&&p.push(x,C,T)}this.setIndex(p),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Lo extends Zt{constructor(t=new Wh(new E(-1,-1,0),new E(-1,1,0),new E(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new E,l=new E,c=new _t;let h=new E;const u=[],f=[],p=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new de(u,3)),this.setAttribute("normal",new de(f,3)),this.setAttribute("uv",new de(p,2));function _(){for(let v=0;v<e;v++)m(v);m(r===!1?e:0),y(),d()}function m(v){h=t.getPointAt(v/e,h);const x=a.normals[v],C=a.binormals[v];for(let T=0;T<=s;T++){const P=T/s*Math.PI*2,G=Math.sin(P),M=-Math.cos(P);l.x=M*x.x+G*C.x,l.y=M*x.y+G*C.y,l.z=M*x.z+G*C.z,l.normalize(),f.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}function d(){for(let v=1;v<=e;v++)for(let x=1;x<=s;x++){const C=(s+1)*(v-1)+(x-1),T=(s+1)*v+(x-1),P=(s+1)*v+x,G=(s+1)*(v-1)+x;g.push(C,T,G),g.push(T,P,G)}}function y(){for(let v=0;v<=e;v++)for(let x=0;x<=s;x++)c.x=v/e,c.y=x/s,p.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Lo(new r1[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Wn extends ji{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_h,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}const Mc={enabled:!1,files:{},add:function(n,t){this.enabled!==!1&&(this.files[n]=t)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class a1{constructor(t,e,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const o1=new a1;class Do{constructor(t){this.manager=t!==void 0?t:o1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}Do.DEFAULT_MATERIAL_NAME="__DEFAULT";class l1 extends Do{constructor(t){super(t)}load(t,e,i,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Mc.get(t);if(a!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0),a;const o=ws("img");function l(){h(),Mc.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(u){h(),s&&s(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(t),o.src=t,o}}class Io extends Do{constructor(t){super(t)}load(t,e,i,s){const r=new Oe,a=new l1(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},i,s),r}}class Uo extends Se{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const Na=new kt,Sc=new E,bc=new E;class Xh{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.map=null,this.mapPass=null,this.matrix=new kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new To,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Sc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Sc),bc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bc),e.updateMatrixWorld(),Na.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Na),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Na)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class c1 extends Xh{constructor(){super(new Ve(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=Kn*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class h1 extends Uo{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.target=new Se,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new c1}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Ec=new kt,us=new E,Oa=new E;class u1 extends Xh{constructor(){super(new Ve(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new _t(4,2),this._viewportCount=6,this._viewports=[new ce(2,1,1,1),new ce(0,1,1,1),new ce(3,1,1,1),new ce(1,1,1,1),new ce(3,0,1,1),new ce(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),us.setFromMatrixPosition(t.matrixWorld),i.position.copy(us),Oa.copy(i.position),Oa.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(Oa),i.updateMatrixWorld(),s.makeTranslation(-us.x,-us.y,-us.z),Ec.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ec)}}class d1 extends Uo{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new u1}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class f1 extends Uo{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class p1{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=wc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=wc();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function wc(){return(typeof performance>"u"?Date:performance).now()}class Fo{constructor(t,e,i=0,s=1/0){this.ray=new Ur(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new wo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return eo(t,this,i,e),i.sort(Tc),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)eo(t[s],this,i,e);return i.sort(Tc),i}}function Tc(n,t){return n.distance-t.distance}function eo(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){const s=n.children;for(let r=0,a=s.length;r<a;r++)eo(s[r],t,e,!0)}}class m1 extends kh{constructor(t=10,e=10,i=4473924,s=8947848){i=new Yt(i),s=new Yt(s);const r=e/2,a=t/e,o=t/2,l=[],c=[];for(let f=0,p=0,g=-o;f<=e;f++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);const _=f===r?i:s;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}const h=new Zt;h.setAttribute("position",new de(l,3)),h.setAttribute("color",new de(c,3));const u=new He({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);const Ai=500,fs=20,$t=50,ye=$t*206265,R={speedExponent:0,simulationSpeed:1,planetScale:1,sunScale:1,capMoonOrbits:!0,capMagneticFields:!0,starBrightness:.6,starSaturation:.3,magnitudeLimit:6,gamma:1,showOrbits:!0,showSunOrbits:!0,showPlanetOrbits:!0,showDwarfPlanetOrbits:!0,showMoonOrbits:!0,showAxes:!1,objectInfoMode:"window",coordinateSystem:"Heliocentric",referencePlane:"Ecliptic",showZodiacs:!1,showConstellations:!1,showAsterisms:!1,showZodiacSigns:!1,showHabitableZone:!1,showMagneticFields:!1,showSunMagneticFieldBasic:!1,showSunMagneticField:!1,showPlanetColors:!1,showDwarfPlanetColors:!1,showSun:!0,showPlanets:!0,showLargestMoons:!0,showMajorMoons:!1,showSmallMoons:!1,showDwarfPlanets:!1,showMissions:{voyager1:!1,voyager2:!1,pioneer10:!1,pioneer11:!1,galileo:!1,cassini:!1,newHorizons:!1,parkerSolarProbe:!1,juno:!1,rosetta:!1,ulysses:!1},date:new Date,stop:!1,music:{enabled:!1,volume:.5,playlist:[],currentTrackName:"---",shuffle:!1},debug:!1},Ot={log:(...n)=>{R.debug&&console.log(...n)},warn:(...n)=>{R.debug&&console.warn(...n)},error:(...n)=>{console.error(...n)},info:(...n)=>{R.debug&&console.info(...n)}};class g1{constructor(){this.queue=[],this.textureLoader=new Io,this.maxConcurrent=6,this.activeRequests=0,this.priorityBodies=["Sun","Jupiter","Saturn","Neptune","Earth"],this.registry={},this.manifest=null,this.manifestLoading=!1,this.loadManifest()}async loadManifest(){if(!this.manifestLoading){this.manifestLoading=!0;try{const t=await fetch("assets/textures.json");if(!t.ok)throw new Error("Manifest not found");const e=await t.json();this.manifest=new Set(e),Ot.log(`TextureManager: Loaded manifest with ${this.manifest.size} files`)}catch(t){Ot.warn("TextureManager: Failed to load texture manifest, falling back to trial-and-error",t),this.manifest=null}finally{this.manifestLoading=!1,this.processQueue()}}}loadTexture(t,e,i,s=!1,r=null,a="map"){let o=100;const l=this.priorityBodies.indexOf(i);l!==-1?o=l:s&&r==="largest"&&(o=10),this.registry[i]={originalPath:t,material:e,priority:o,mapType:a},this.addToQueue(t,e,0,o,a),this.addToQueue(t,e,1,o,a),this.processQueue()}loadHighRes(t){const e=this.registry[t];e&&(this.addToQueue(e.originalPath,e.material,2,e.priority,e.mapType),this.processQueue())}addToQueue(t,e,i,s,r="map"){this.queue.push({originalPath:t,material:e,stage:i,priority:s,mapType:r}),this.queue.sort((a,o)=>a.stage===2&&o.stage!==2?-1:o.stage===2&&a.stage!==2?1:a.stage!==o.stage?a.stage-o.stage:a.priority-o.priority)}processQueue(){if(this.manifestLoading||this.activeRequests>=this.maxConcurrent||this.queue.length===0)return;const t=this.queue.shift();this.activeRequests++;const e=[];t.stage===0?(e.push(this.getPathForStage(t.originalPath,"lowres","webp")),e.push(this.getPathForStage(t.originalPath,"lowres"))):t.stage===1?(e.push(this.getPathForStage(t.originalPath,"midres","webp")),e.push(this.getPathForStage(t.originalPath,"midres"))):t.stage===2?(e.push(this.getPathForStage(t.originalPath,"highres","webp")),e.push(this.getPathForStage(t.originalPath,"highres"))):e.push(t.originalPath),this.tryLoadTexture(e,t),this.processQueue()}tryLoadTexture(t,e){let i=t;if(this.manifest&&(i=t.filter(r=>{const a=r.startsWith("/")?r.slice(1):r;return this.manifest.has(a)}),i.length===0&&t.length>0&&Ot.log(`TextureManager: Skipped ${e.originalPath} (Stage ${e.stage}) - No valid files in manifest`)),i.length===0){this.activeRequests--,this.processQueue();return}const s=i.shift();this.textureLoader.load(s,r=>{Ot.log(`TextureManager: Loaded ${s} successfully`),!e.material.userData.currentStage||e.stage>=e.material.userData.currentStage?(r.wrapS=br,r.wrapT=We,e.material[e.mapType]=r,e.material.color&&e.material.color.setHex(16777215),e.material.needsUpdate=!0,e.material.userData.currentStage=e.stage,Ot.log(`TextureManager: Applied ${s} to material`)):Ot.log(`TextureManager: Skipped applying ${s} (current stage ${e.material.userData.currentStage} >= ${e.stage})`),this.activeRequests--,this.processQueue()},void 0,r=>{Ot.warn(`TextureManager: Failed to load ${s}`,r),this.tryLoadTexture(t,e)})}getPathForStage(t,e,i=null){const s=t.lastIndexOf("/");if(s===-1)return t;const r=t.substring(0,s);let a=t.substring(s+1);if(i){const o=a.lastIndexOf(".");o!==-1&&(a=a.substring(0,o)+"."+i)}return`${r}/${e}/${a}`}}const Qn=new g1,_1=15,v1=2e3,y1=.35;let xe=null,Xn=!1,Gr=0;const kr=new E,Hr=new E,Vr=new E,Wr=new E,za=new E;function $h(n,t,e,i){const s=new _t;window.addEventListener("mousedown",r=>{r.button===2&&s.set(r.clientX,r.clientY)}),window.addEventListener("mouseup",r=>{if(r.button===2&&xe&&s.distanceTo(new _t(r.clientX,r.clientY))<5){const o=Ac(r.clientX,r.clientY,n,e,i);o&&(o.mesh===xe.mesh?Yh(n,t):x1(o.mesh,n,t))}}),window.addEventListener("dblclick",r=>{const a=r.clientX,o=r.clientY,l=Ac(a,o,n,e,i);l?$n(l,n,t):xe&&Ts(t)}),window.addEventListener("keydown",r=>{r.key==="Escape"&&xe&&Ts(t)})}function qh(n,t){const e=performance.now();if(Xn){const i=e-Gr,s=Math.min(i/v1,1),r=s<.5?2*s*s:1-(-2*s+2)**2/2;if(n.position.lerpVectors(kr,Vr,r),t.target.lerpVectors(Hr,Wr,r),s>=1){Xn=!1;const a=new E;xe.mesh.getWorldPosition(a),za.copy(a),t.enabled=!0}t.update();return}if(xe&&!Xn){if(!xe.mesh.visible){Ts(t);return}const i=xe.mesh,s=new E;i.getWorldPosition(s);const r=new E().subVectors(s,za);n.position.add(r),t.target.add(r),za.copy(s),t.update()}}function $n(n,t,e,i=y1){var f;xe&&xe!==n&&jh(xe),xe=n,M1(xe),(f=n.data)!=null&&f.name&&Qn.loadHighRes(n.data.name);const s=new E;n.mesh.getWorldPosition(s);const r=n.data.radius||5;let a=1;n.type==="sun"?a=R.sunScale:(n.type==="planet"||n.type==="moon")&&(a=R.planetScale);const o=r*a,l=t.fov*Math.PI/180,c=o/Math.sin(l*i/2),h=Math.PI/6,u=new E(c*Math.cos(h),c*Math.sin(h),c*Math.cos(h));kr.copy(t.position),Hr.copy(e.target),Vr.copy(s).add(u),Wr.copy(s),Xn=!0,Gr=performance.now(),e.enabled=!1,e.enablePan=!1,Xr(n.data.name)}function Yh(n,t){if(!xe)return;const e=xe.mesh,i=new E;e.getWorldPosition(i);const s=t.target.clone();new E().subVectors(s,i).lengthSq()<1e-4||(kr.copy(n.position),Hr.copy(s),Vr.copy(n.position),Wr.copy(i),Gr=performance.now(),Xn=!0,t.enabled=!1,Xr("View Recentered"))}function x1(n,t,e){const i=new E;n.getWorldPosition(i),kr.copy(t.position),Hr.copy(e.target),Vr.copy(t.position),Wr.copy(i),Gr=performance.now(),Xn=!0,e.enabled=!1,Xr("Looking at Target")}function Ts(n){xe&&(jh(xe),xe=null),n.enabled=!0,n.enablePan=!0,Xr("Focus mode deactivated")}function M1(n){if(!n||!n.mesh)return;n.originalGeometry||(n.originalGeometry=n.mesh.geometry);const t=n.data.radius||5,e=new Yi(t,128,128);n.mesh.geometry=e}function jh(n){!n||!n.mesh||!n.originalGeometry||(n.mesh.geometry.dispose(),n.mesh.geometry=n.originalGeometry,delete n.originalGeometry)}function Ac(n,t,e,i,s){const r=new Fo,a=new _t;a.x=n/window.innerWidth*2-1,a.y=-(t/window.innerHeight)*2+1,r.setFromCamera(a,e);const o=[],l=new Map;s&&(o.push(s),l.set(s.uuid,{mesh:s,data:{name:"Sun",radius:4.65},type:"sun"})),i.forEach(p=>{var g;p.mesh&&p.mesh.visible&&(o.push(p.mesh),l.set(p.mesh.uuid,{mesh:p.mesh,data:p.data,type:"planet"}),(g=p.moons)==null||g.forEach(_=>{_.mesh&&_.mesh.visible&&(o.push(_.mesh),l.set(_.mesh.uuid,{mesh:_.mesh,data:_.data,type:"moon"}))}))});const c=r.intersectObjects(o,!1);if(c.length>0){const p=c[0];return l.get(p.object.uuid)}let h=null,u=_1;const f=(p,g,_)=>{if(!p||!p.position||!p.visible)return;const m=new E;p.getWorldPosition(m);const d=m.clone().project(e);if(d.z>1||d.z<-1)return;const y=(d.x*.5+.5)*window.innerWidth,v=(-(d.y*.5)+.5)*window.innerHeight,x=n-y,C=t-v,T=Math.sqrt(x*x+C*C);T<u&&(u=T,h={mesh:p,data:g,type:_})};return f(s,{name:"Sun",radius:4.65},"sun"),i.forEach(p=>{var g;f(p.mesh,p.data,"planet"),(g=p.moons)==null||g.forEach(_=>{f(_.mesh,_.data,"moon")})}),h}function Xr(n){let t=document.getElementById("focus-notification");t||(t=document.createElement("div"),t.id="focus-notification",t.style.cssText=`
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
        `,document.body.appendChild(t)),t.textContent=n,t.style.opacity="1",setTimeout(()=>{t.style.opacity="0"},2e3)}function S1(){return xe!==null}function b1(){return xe}const Cc=Object.freeze(Object.defineProperty({__proto__:null,exitFocusMode:Ts,focusOnObject:$n,getFocusedObject:b1,isFocusModeActive:S1,recenterFocus:Yh,setupFocusMode:$h,updateFocusMode:qh},Symbol.toStringTag,{value:"Module"})),E1=`
  attribute float progress;
  varying float vProgress;
  varying vec2 vUv;
  
  void main() {
    vProgress = progress;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,w1=`
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform bool uUseGradient;
  uniform float uGlowIntensity;
  
  varying float vProgress;
  
  void main() {
    // Calculate alpha based on progress
    // progress=0 is where the object just was (brightest - the tail)
    // progress=1 is where the object is heading (more faded - the future)
    float alpha = uOpacity;
    
    if (uUseGradient) {
      // Smooth fade from recent path (bright tail) to future (dimmer but still visible)
      // The first ~15% of the orbit (the trail behind) stays fully bright
      // Then it fades smoothly but stays visible enough to almost reconnect
      float trailStart = 0.15; // Keep bright for first 15% (recent path / tail)
      float trailEnd = 0.85;   // Fade to minimum by 85%
      
      float progress = vProgress;
      float fadeFactor;
      
      if (progress < trailStart) {
        // Recent path (tail) - stay bright
        fadeFactor = 1.0;
      } else if (progress < trailEnd) {
        // Fading section - smooth falloff
        float normalizedProgress = (progress - trailStart) / (trailEnd - trailStart);
        fadeFactor = 1.0 - pow(normalizedProgress, 0.7) * 0.7; // Fade to 30% (1.0 - 0.7 = 0.3)
      } else {
        // Future path - still visible to reconnect
        fadeFactor = 0.3;
      }
      
      alpha *= fadeFactor;
      
      // Ensure minimum visibility for the full orbit to be traceable
      alpha = max(alpha, 0.15);
    }
    
    // Apply glow effect - brighten the color near the planet's recent path
    // Creates a subtle "glowing trail" effect where the planet just passed
    float glowFactor = 1.0 + uGlowIntensity * (1.0 - vProgress) * (1.0 - vProgress);
    vec3 glowColor = uColor * glowFactor;
    
    // Clamp to prevent excessive brightness
    glowColor = min(glowColor, vec3(1.5));
    
    gl_FragColor = vec4(glowColor, alpha);
  }
`;function Is(n={}){const{color:t=8960989,opacity:e=.85,useGradient:i=!0,glowIntensity:s=.4}=n,r=new Yt(t);return new Ui({uniforms:{uColor:{value:r},uOpacity:{value:e},uUseGradient:{value:i},uGlowIntensity:{value:s}},vertexShader:E1,fragmentShader:w1,transparent:!0,depthWrite:!1,blending:cn})}function Pc(n,t,e){n.uniforms?(n.uniforms.uColor.value.set(t),n.uniforms.uOpacity.value=e):n.color&&(n.color.setHex(t),n.opacity=e)}function $r(n,t=0){const e=new Float32Array(n);for(let i=0;i<n;i++){const s=(i-t+n)%n;e[i]=s/n}return e}/**
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
 */const Zh=173.1446326846693,T1=14959787069098932e-8,io=.017453292519943295,A1=365.24217,Rc=new Date("2000-01-01T12:00:00Z"),fi=2*Math.PI,ki=3600*(180/Math.PI),dr=484813681109536e-20,C1=6378.1366,P1=C1/T1,Kh=81.30056,No=.0002959122082855911,no=2825345909524226e-22,so=8459715185680659e-23,ro=1292024916781969e-23,ao=1524358900784276e-23;function Ba(n){if(!Number.isFinite(n))throw console.trace(),`Value is not a finite number: ${n}`;return n}function On(n){return n-Math.floor(n)}var bt;(function(n){n.Sun="Sun",n.Moon="Moon",n.Mercury="Mercury",n.Venus="Venus",n.Earth="Earth",n.Mars="Mars",n.Jupiter="Jupiter",n.Saturn="Saturn",n.Uranus="Uranus",n.Neptune="Neptune",n.Pluto="Pluto",n.SSB="SSB",n.EMB="EMB",n.Star1="Star1",n.Star2="Star2",n.Star3="Star3",n.Star4="Star4",n.Star5="Star5",n.Star6="Star6",n.Star7="Star7",n.Star8="Star8"})(bt||(bt={}));const R1=[bt.Star1,bt.Star2,bt.Star3,bt.Star4,bt.Star5,bt.Star6,bt.Star7,bt.Star8],L1=[{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0},{ra:0,dec:0,dist:0}];function D1(n){const t=R1.indexOf(n);return t>=0?L1[t]:null}function Oo(n){const t=D1(n);return t&&t.dist>0?t:null}var As;(function(n){n[n.From2000=0]="From2000",n[n.Into2000=1]="Into2000"})(As||(As={}));const Wi={Mercury:[[[[4.40250710144,0,0],[.40989414977,1.48302034195,26087.9031415742],[.050462942,4.47785489551,52175.8062831484],[.00855346844,1.16520322459,78263.70942472259],[.00165590362,4.11969163423,104351.61256629678],[.00034561897,.77930768443,130439.51570787099],[7583476e-11,3.71348404924,156527.41884944518]],[[26087.90313685529,0,0],[.01131199811,6.21874197797,26087.9031415742],[.00292242298,3.04449355541,52175.8062831484],[.00075775081,6.08568821653,78263.70942472259],[.00019676525,2.80965111777,104351.61256629678]]],[[[.11737528961,1.98357498767,26087.9031415742],[.02388076996,5.03738959686,52175.8062831484],[.01222839532,3.14159265359,0],[.0054325181,1.79644363964,78263.70942472259],[.0012977877,4.83232503958,104351.61256629678],[.00031866927,1.58088495658,130439.51570787099],[7963301e-11,4.60972126127,156527.41884944518]],[[.00274646065,3.95008450011,26087.9031415742],[.00099737713,3.14159265359,0]]],[[[.39528271651,0,0],[.07834131818,6.19233722598,26087.9031415742],[.00795525558,2.95989690104,52175.8062831484],[.00121281764,6.01064153797,78263.70942472259],[.00021921969,2.77820093972,104351.61256629678],[4354065e-11,5.82894543774,130439.51570787099]],[[.0021734774,4.65617158665,26087.9031415742],[.00044141826,1.42385544001,52175.8062831484]]]],Venus:[[[[3.17614666774,0,0],[.01353968419,5.59313319619,10213.285546211],[.00089891645,5.30650047764,20426.571092422],[5477194e-11,4.41630661466,7860.4193924392],[3455741e-11,2.6996444782,11790.6290886588],[2372061e-11,2.99377542079,3930.2096962196],[1317168e-11,5.18668228402,26.2983197998],[1664146e-11,4.25018630147,1577.3435424478],[1438387e-11,4.15745084182,9683.5945811164],[1200521e-11,6.15357116043,30639.856638633]],[[10213.28554621638,0,0],[.00095617813,2.4640651111,10213.285546211],[7787201e-11,.6247848222,20426.571092422]]],[[[.05923638472,.26702775812,10213.285546211],[.00040107978,1.14737178112,20426.571092422],[.00032814918,3.14159265359,0]],[[.00287821243,1.88964962838,10213.285546211]]],[[[.72334820891,0,0],[.00489824182,4.02151831717,10213.285546211],[1658058e-11,4.90206728031,20426.571092422],[1378043e-11,1.12846591367,11790.6290886588],[1632096e-11,2.84548795207,7860.4193924392],[498395e-11,2.58682193892,9683.5945811164],[221985e-11,2.01346696541,19367.1891622328],[237454e-11,2.55136053886,15720.8387848784]],[[.00034551041,.89198706276,10213.285546211]]]],Earth:[[[[1.75347045673,0,0],[.03341656453,4.66925680415,6283.0758499914],[.00034894275,4.62610242189,12566.1516999828],[3417572e-11,2.82886579754,3.523118349],[3497056e-11,2.74411783405,5753.3848848968],[3135899e-11,3.62767041756,77713.7714681205],[2676218e-11,4.41808345438,7860.4193924392],[2342691e-11,6.13516214446,3930.2096962196],[1273165e-11,2.03709657878,529.6909650946],[1324294e-11,.74246341673,11506.7697697936],[901854e-11,2.04505446477,26.2983197998],[1199167e-11,1.10962946234,1577.3435424478],[857223e-11,3.50849152283,398.1490034082],[779786e-11,1.17882681962,5223.6939198022],[99025e-10,5.23268072088,5884.9268465832],[753141e-11,2.53339052847,5507.5532386674],[505267e-11,4.58292599973,18849.2275499742],[492392e-11,4.20505711826,775.522611324],[356672e-11,2.91954114478,.0673103028],[284125e-11,1.89869240932,796.2980068164],[242879e-11,.34481445893,5486.777843175],[317087e-11,5.84901948512,11790.6290886588],[271112e-11,.31486255375,10977.078804699],[206217e-11,4.80646631478,2544.3144198834],[205478e-11,1.86953770281,5573.1428014331],[202318e-11,2.45767790232,6069.7767545534],[126225e-11,1.08295459501,20.7753954924],[155516e-11,.83306084617,213.299095438]],[[6283.0758499914,0,0],[.00206058863,2.67823455808,6283.0758499914],[4303419e-11,2.63512233481,12566.1516999828]],[[8721859e-11,1.07253635559,6283.0758499914]]],[[],[[.00227777722,3.4137662053,6283.0758499914],[3805678e-11,3.37063423795,12566.1516999828]]],[[[1.00013988784,0,0],[.01670699632,3.09846350258,6283.0758499914],[.00013956024,3.05524609456,12566.1516999828],[308372e-10,5.19846674381,77713.7714681205],[1628463e-11,1.17387558054,5753.3848848968],[1575572e-11,2.84685214877,7860.4193924392],[924799e-11,5.45292236722,11506.7697697936],[542439e-11,4.56409151453,3930.2096962196],[47211e-10,3.66100022149,5884.9268465832],[85831e-11,1.27079125277,161000.6857376741],[57056e-11,2.01374292245,83996.84731811189],[55736e-11,5.2415979917,71430.69561812909],[174844e-11,3.01193636733,18849.2275499742],[243181e-11,4.2734953079,11790.6290886588]],[[.00103018607,1.10748968172,6283.0758499914],[1721238e-11,1.06442300386,12566.1516999828]],[[4359385e-11,5.78455133808,6283.0758499914]]]],Mars:[[[[6.20347711581,0,0],[.18656368093,5.0503710027,3340.6124266998],[.01108216816,5.40099836344,6681.2248533996],[.00091798406,5.75478744667,10021.8372800994],[.00027744987,5.97049513147,3.523118349],[.00010610235,2.93958560338,2281.2304965106],[.00012315897,.84956094002,2810.9214616052],[8926784e-11,4.15697846427,.0172536522],[8715691e-11,6.11005153139,13362.4497067992],[6797556e-11,.36462229657,398.1490034082],[7774872e-11,3.33968761376,5621.8429232104],[3575078e-11,1.6618650571,2544.3144198834],[4161108e-11,.22814971327,2942.4634232916],[3075252e-11,.85696614132,191.4482661116],[2628117e-11,.64806124465,3337.0893083508],[2937546e-11,6.07893711402,.0673103028],[2389414e-11,5.03896442664,796.2980068164],[2579844e-11,.02996736156,3344.1355450488],[1528141e-11,1.14979301996,6151.533888305],[1798806e-11,.65634057445,529.6909650946],[1264357e-11,3.62275122593,5092.1519581158],[1286228e-11,3.06796065034,2146.1654164752],[1546404e-11,2.91579701718,1751.539531416],[1024902e-11,3.69334099279,8962.4553499102],[891566e-11,.18293837498,16703.062133499],[858759e-11,2.4009381194,2914.0142358238],[832715e-11,2.46418619474,3340.5951730476],[83272e-10,4.49495782139,3340.629680352],[712902e-11,3.66335473479,1059.3819301892],[748723e-11,3.82248614017,155.4203994342],[723861e-11,.67497311481,3738.761430108],[635548e-11,2.92182225127,8432.7643848156],[655162e-11,.48864064125,3127.3133312618],[550474e-11,3.81001042328,.9803210682],[55275e-10,4.47479317037,1748.016413067],[425966e-11,.55364317304,6283.0758499914],[415131e-11,.49662285038,213.299095438],[472167e-11,3.62547124025,1194.4470102246],[306551e-11,.38052848348,6684.7479717486],[312141e-11,.99853944405,6677.7017350506],[293198e-11,4.22131299634,20.7753954924],[302375e-11,4.48618007156,3532.0606928114],[274027e-11,.54222167059,3340.545116397],[281079e-11,5.88163521788,1349.8674096588],[231183e-11,1.28242156993,3870.3033917944],[283602e-11,5.7688543494,3149.1641605882],[236117e-11,5.75503217933,3333.498879699],[274033e-11,.13372524985,3340.6797370026],[299395e-11,2.78323740866,6254.6266625236]],[[3340.61242700512,0,0],[.01457554523,3.60433733236,3340.6124266998],[.00168414711,3.92318567804,6681.2248533996],[.00020622975,4.26108844583,10021.8372800994],[3452392e-11,4.7321039319,3.523118349],[2586332e-11,4.60670058555,13362.4497067992],[841535e-11,4.45864030426,2281.2304965106]],[[.00058152577,2.04961712429,3340.6124266998],[.00013459579,2.45738706163,6681.2248533996]]],[[[.03197134986,3.76832042431,3340.6124266998],[.00298033234,4.10616996305,6681.2248533996],[.00289104742,0,0],[.00031365539,4.4465105309,10021.8372800994],[34841e-9,4.7881254926,13362.4497067992]],[[.00217310991,6.04472194776,3340.6124266998],[.00020976948,3.14159265359,0],[.00012834709,1.60810667915,6681.2248533996]]],[[[1.53033488271,0,0],[.1418495316,3.47971283528,3340.6124266998],[.00660776362,3.81783443019,6681.2248533996],[.00046179117,4.15595316782,10021.8372800994],[8109733e-11,5.55958416318,2810.9214616052],[7485318e-11,1.77239078402,5621.8429232104],[5523191e-11,1.3643630377,2281.2304965106],[382516e-10,4.49407183687,13362.4497067992],[2306537e-11,.09081579001,2544.3144198834],[1999396e-11,5.36059617709,3337.0893083508],[2484394e-11,4.9254563992,2942.4634232916],[1960195e-11,4.74249437639,3344.1355450488],[1167119e-11,2.11260868341,5092.1519581158],[1102816e-11,5.00908403998,398.1490034082],[899066e-11,4.40791133207,529.6909650946],[992252e-11,5.83861961952,6151.533888305],[807354e-11,2.10217065501,1059.3819301892],[797915e-11,3.44839203899,796.2980068164],[740975e-11,1.49906336885,2146.1654164752]],[[.01107433345,2.03250524857,3340.6124266998],[.00103175887,2.37071847807,6681.2248533996],[128772e-9,0,0],[.0001081588,2.70888095665,10021.8372800994]],[[.00044242249,.47930604954,3340.6124266998],[8138042e-11,.86998389204,6681.2248533996]]]],Jupiter:[[[[.59954691494,0,0],[.09695898719,5.06191793158,529.6909650946],[.00573610142,1.44406205629,7.1135470008],[.00306389205,5.41734730184,1059.3819301892],[.00097178296,4.14264726552,632.7837393132],[.00072903078,3.64042916389,522.5774180938],[.00064263975,3.41145165351,103.0927742186],[.00039806064,2.29376740788,419.4846438752],[.00038857767,1.27231755835,316.3918696566],[.00027964629,1.7845459182,536.8045120954],[.0001358973,5.7748104079,1589.0728952838],[8246349e-11,3.5822792584,206.1855484372],[8768704e-11,3.63000308199,949.1756089698],[7368042e-11,5.0810119427,735.8765135318],[626315e-10,.02497628807,213.299095438],[6114062e-11,4.51319998626,1162.4747044078],[4905396e-11,1.32084470588,110.2063212194],[5305285e-11,1.30671216791,14.2270940016],[5305441e-11,4.18625634012,1052.2683831884],[4647248e-11,4.69958103684,3.9321532631],[3045023e-11,4.31676431084,426.598190876],[2609999e-11,1.56667394063,846.0828347512],[2028191e-11,1.06376530715,3.1813937377],[1764763e-11,2.14148655117,1066.49547719],[1722972e-11,3.88036268267,1265.5674786264],[1920945e-11,.97168196472,639.897286314],[1633223e-11,3.58201833555,515.463871093],[1431999e-11,4.29685556046,625.6701923124],[973272e-11,4.09764549134,95.9792272178]],[[529.69096508814,0,0],[.00489503243,4.2208293947,529.6909650946],[.00228917222,6.02646855621,7.1135470008],[.00030099479,4.54540782858,1059.3819301892],[.0002072092,5.45943156902,522.5774180938],[.00012103653,.16994816098,536.8045120954],[6067987e-11,4.42422292017,103.0927742186],[5433968e-11,3.98480737746,419.4846438752],[4237744e-11,5.89008707199,14.2270940016]],[[.00047233601,4.32148536482,7.1135470008],[.00030649436,2.929777887,529.6909650946],[.00014837605,3.14159265359,0]]],[[[.02268615702,3.55852606721,529.6909650946],[.00109971634,3.90809347197,1059.3819301892],[.00110090358,0,0],[8101428e-11,3.60509572885,522.5774180938],[6043996e-11,4.25883108339,1589.0728952838],[6437782e-11,.30627119215,536.8045120954]],[[.00078203446,1.52377859742,529.6909650946]]],[[[5.20887429326,0,0],[.25209327119,3.49108639871,529.6909650946],[.00610599976,3.84115365948,1059.3819301892],[.00282029458,2.57419881293,632.7837393132],[.00187647346,2.07590383214,522.5774180938],[.00086792905,.71001145545,419.4846438752],[.00072062974,.21465724607,536.8045120954],[.00065517248,5.9799588479,316.3918696566],[.00029134542,1.67759379655,103.0927742186],[.00030135335,2.16132003734,949.1756089698],[.00023453271,3.54023522184,735.8765135318],[.00022283743,4.19362594399,1589.0728952838],[.00023947298,.2745803748,7.1135470008],[.00013032614,2.96042965363,1162.4747044078],[970336e-10,1.90669633585,206.1855484372],[.00012749023,2.71550286592,1052.2683831884],[7057931e-11,2.18184839926,1265.5674786264],[6137703e-11,6.26418240033,846.0828347512],[2616976e-11,2.00994012876,1581.959348283]],[[.0127180152,2.64937512894,529.6909650946],[.00061661816,3.00076460387,1059.3819301892],[.00053443713,3.89717383175,522.5774180938],[.00031185171,4.88276958012,536.8045120954],[.00041390269,0,0]]]],Saturn:[[[[.87401354025,0,0],[.11107659762,3.96205090159,213.299095438],[.01414150957,4.58581516874,7.1135470008],[.00398379389,.52112032699,206.1855484372],[.00350769243,3.30329907896,426.598190876],[.00206816305,.24658372002,103.0927742186],[792713e-9,3.84007056878,220.4126424388],[.00023990355,4.66976924553,110.2063212194],[.00016573588,.43719228296,419.4846438752],[.00014906995,5.76903183869,316.3918696566],[.0001582029,.93809155235,632.7837393132],[.00014609559,1.56518472,3.9321532631],[.00013160301,4.44891291899,14.2270940016],[.00015053543,2.71669915667,639.897286314],[.00013005299,5.98119023644,11.0457002639],[.00010725067,3.12939523827,202.2533951741],[5863206e-11,.23656938524,529.6909650946],[5227757e-11,4.20783365759,3.1813937377],[6126317e-11,1.76328667907,277.0349937414],[5019687e-11,3.17787728405,433.7117378768],[459255e-10,.61977744975,199.0720014364],[4005867e-11,2.24479718502,63.7358983034],[2953796e-11,.98280366998,95.9792272178],[387367e-10,3.22283226966,138.5174968707],[2461186e-11,2.03163875071,735.8765135318],[3269484e-11,.77492638211,949.1756089698],[1758145e-11,3.2658010994,522.5774180938],[1640172e-11,5.5050445305,846.0828347512],[1391327e-11,4.02333150505,323.5054166574],[1580648e-11,4.37265307169,309.2783226558],[1123498e-11,2.83726798446,415.5524906121],[1017275e-11,3.71700135395,227.5261894396],[848642e-11,3.1915017083,209.3669421749]],[[213.2990952169,0,0],[.01297370862,1.82834923978,213.299095438],[.00564345393,2.88499717272,7.1135470008],[.00093734369,1.06311793502,426.598190876],[.00107674962,2.27769131009,206.1855484372],[.00040244455,2.04108104671,220.4126424388],[.00019941774,1.2795439047,103.0927742186],[.00010511678,2.7488034213,14.2270940016],[6416106e-11,.38238295041,639.897286314],[4848994e-11,2.43037610229,419.4846438752],[4056892e-11,2.92133209468,110.2063212194],[3768635e-11,3.6496533078,3.9321532631]],[[.0011644133,1.17988132879,7.1135470008],[.00091841837,.0732519584,213.299095438],[.00036661728,0,0],[.00015274496,4.06493179167,206.1855484372]]],[[[.04330678039,3.60284428399,213.299095438],[.00240348302,2.85238489373,426.598190876],[.00084745939,0,0],[.00030863357,3.48441504555,220.4126424388],[.00034116062,.57297307557,206.1855484372],[.0001473407,2.11846596715,639.897286314],[9916667e-11,5.79003188904,419.4846438752],[6993564e-11,4.7360468972,7.1135470008],[4807588e-11,5.43305312061,316.3918696566]],[[.00198927992,4.93901017903,213.299095438],[.00036947916,3.14159265359,0],[.00017966989,.5197943111,426.598190876]]],[[[9.55758135486,0,0],[.52921382865,2.39226219573,213.299095438],[.01873679867,5.2354960466,206.1855484372],[.01464663929,1.64763042902,426.598190876],[.00821891141,5.93520042303,316.3918696566],[.00547506923,5.0153261898,103.0927742186],[.0037168465,2.27114821115,220.4126424388],[.00361778765,3.13904301847,7.1135470008],[.00140617506,5.70406606781,632.7837393132],[.00108974848,3.29313390175,110.2063212194],[.00069006962,5.94099540992,419.4846438752],[.00061053367,.94037691801,639.897286314],[.00048913294,1.55733638681,202.2533951741],[.00034143772,.19519102597,277.0349937414],[.00032401773,5.47084567016,949.1756089698],[.00020936596,.46349251129,735.8765135318],[9796004e-11,5.20477537945,1265.5674786264],[.00011993338,5.98050967385,846.0828347512],[208393e-9,1.52102476129,433.7117378768],[.00015298404,3.0594381494,529.6909650946],[6465823e-11,.17732249942,1052.2683831884],[.00011380257,1.7310542704,522.5774180938],[3419618e-11,4.94550542171,1581.959348283]],[[.0618298134,.2584351148,213.299095438],[.00506577242,.71114625261,206.1855484372],[.00341394029,5.79635741658,426.598190876],[.00188491195,.47215589652,220.4126424388],[.00186261486,3.14159265359,0],[.00143891146,1.40744822888,7.1135470008]],[[.00436902572,4.78671677509,213.299095438]]]],Uranus:[[[[5.48129294297,0,0],[.09260408234,.89106421507,74.7815985673],[.01504247898,3.6271926092,1.4844727083],[.00365981674,1.89962179044,73.297125859],[.00272328168,3.35823706307,149.5631971346],[.00070328461,5.39254450063,63.7358983034],[.00068892678,6.09292483287,76.2660712756],[.00061998615,2.26952066061,2.9689454166],[.00061950719,2.85098872691,11.0457002639],[.0002646877,3.14152083966,71.8126531507],[.00025710476,6.11379840493,454.9093665273],[.0002107885,4.36059339067,148.0787244263],[.00017818647,1.74436930289,36.6485629295],[.00014613507,4.73732166022,3.9321532631],[.00011162509,5.8268179635,224.3447957019],[.0001099791,.48865004018,138.5174968707],[9527478e-11,2.95516862826,35.1640902212],[7545601e-11,5.236265824,109.9456887885],[4220241e-11,3.23328220918,70.8494453042],[40519e-9,2.277550173,151.0476698429],[3354596e-11,1.0654900738,4.4534181249],[2926718e-11,4.62903718891,9.5612275556],[349034e-10,5.48306144511,146.594251718],[3144069e-11,4.75199570434,77.7505439839],[2922333e-11,5.35235361027,85.8272988312],[2272788e-11,4.36600400036,70.3281804424],[2051219e-11,1.51773566586,.1118745846],[2148602e-11,.60745949945,38.1330356378],[1991643e-11,4.92437588682,277.0349937414],[1376226e-11,2.04283539351,65.2203710117],[1666902e-11,3.62744066769,380.12776796],[1284107e-11,3.11347961505,202.2533951741],[1150429e-11,.93343589092,3.1813937377],[1533221e-11,2.58594681212,52.6901980395],[1281604e-11,.54271272721,222.8603229936],[1372139e-11,4.19641530878,111.4301614968],[1221029e-11,.1990065003,108.4612160802],[946181e-11,1.19253165736,127.4717966068],[1150989e-11,4.17898916639,33.6796175129]],[[74.7815986091,0,0],[.00154332863,5.24158770553,74.7815985673],[.00024456474,1.71260334156,1.4844727083],[9258442e-11,.4282973235,11.0457002639],[8265977e-11,1.50218091379,63.7358983034],[915016e-10,1.41213765216,149.5631971346]]],[[[.01346277648,2.61877810547,74.7815985673],[623414e-9,5.08111189648,149.5631971346],[.00061601196,3.14159265359,0],[9963722e-11,1.61603805646,76.2660712756],[992616e-10,.57630380333,73.297125859]],[[.00034101978,.01321929936,74.7815985673]]],[[[19.21264847206,0,0],[.88784984413,5.60377527014,74.7815985673],[.03440836062,.32836099706,73.297125859],[.0205565386,1.7829515933,149.5631971346],[.0064932241,4.52247285911,76.2660712756],[.00602247865,3.86003823674,63.7358983034],[.00496404167,1.40139935333,454.9093665273],[.00338525369,1.58002770318,138.5174968707],[.00243509114,1.57086606044,71.8126531507],[.00190522303,1.99809394714,1.4844727083],[.00161858838,2.79137786799,148.0787244263],[.00143706183,1.38368544947,11.0457002639],[.00093192405,.17437220467,36.6485629295],[.00071424548,4.24509236074,224.3447957019],[.00089806014,3.66105364565,109.9456887885],[.00039009723,1.66971401684,70.8494453042],[.00046677296,1.39976401694,35.1640902212],[.00039025624,3.36234773834,277.0349937414],[.00036755274,3.88649278513,146.594251718],[.00030348723,.70100838798,151.0476698429],[.00029156413,3.180563367,77.7505439839],[.00022637073,.72518687029,529.6909650946],[.00011959076,1.7504339214,984.6003316219],[.00025620756,5.25656086672,380.12776796]],[[.01479896629,3.67205697578,74.7815985673]]]],Neptune:[[[[5.31188633046,0,0],[.0179847553,2.9010127389,38.1330356378],[.01019727652,.48580922867,1.4844727083],[.00124531845,4.83008090676,36.6485629295],[.00042064466,5.41054993053,2.9689454166],[.00037714584,6.09221808686,35.1640902212],[.00033784738,1.24488874087,76.2660712756],[.00016482741,7727998e-11,491.5579294568],[9198584e-11,4.93747051954,39.6175083461],[899425e-10,.27462171806,175.1660598002]],[[38.13303563957,0,0],[.00016604172,4.86323329249,1.4844727083],[.00015744045,2.27887427527,38.1330356378]]],[[[.03088622933,1.44104372644,38.1330356378],[.00027780087,5.91271884599,76.2660712756],[.00027623609,0,0],[.00015355489,2.52123799551,36.6485629295],[.00015448133,3.50877079215,39.6175083461]]],[[[30.07013205828,0,0],[.27062259632,1.32999459377,38.1330356378],[.01691764014,3.25186135653,36.6485629295],[.00807830553,5.18592878704,1.4844727083],[.0053776051,4.52113935896,35.1640902212],[.00495725141,1.5710564165,491.5579294568],[.00274571975,1.84552258866,175.1660598002],[.0001201232,1.92059384991,1021.2488945514],[.00121801746,5.79754470298,76.2660712756],[.00100896068,.3770272493,73.297125859],[.00135134092,3.37220609835,39.6175083461],[7571796e-11,1.07149207335,388.4651552382]]]]};function I1(n){var t,e,i,s,r,a,o;const l=2e3+(n-14)/A1;return l<-500?(t=(l-1820)/100,-20+32*t*t):l<500?(t=l/100,e=t*t,i=t*e,s=e*e,r=e*i,a=i*i,10583.6-1014.41*t+33.78311*e-5.952053*i-.1798452*s+.022174192*r+.0090316521*a):l<1600?(t=(l-1e3)/100,e=t*t,i=t*e,s=e*e,r=e*i,a=i*i,1574.2-556.01*t+71.23472*e+.319781*i-.8503463*s-.005050998*r+.0083572073*a):l<1700?(t=l-1600,e=t*t,i=t*e,120-.9808*t-.01532*e+i/7129):l<1800?(t=l-1700,e=t*t,i=t*e,s=e*e,8.83+.1603*t-.0059285*e+13336e-8*i-s/1174e3):l<1860?(t=l-1800,e=t*t,i=t*e,s=e*e,r=e*i,a=i*i,o=i*s,13.72-.332447*t+.0068612*e+.0041116*i-37436e-8*s+121272e-10*r-1699e-10*a+875e-12*o):l<1900?(t=l-1860,e=t*t,i=t*e,s=e*e,r=e*i,7.62+.5737*t-.251754*e+.01680668*i-.0004473624*s+r/233174):l<1920?(t=l-1900,e=t*t,i=t*e,s=e*e,-2.79+1.494119*t-.0598939*e+.0061966*i-197e-6*s):l<1941?(t=l-1920,e=t*t,i=t*e,21.2+.84493*t-.0761*e+.0020936*i):l<1961?(t=l-1950,e=t*t,i=t*e,29.07+.407*t-e/233+i/2547):l<1986?(t=l-1975,e=t*t,i=t*e,45.45+1.067*t-e/260-i/718):l<2005?(t=l-2e3,e=t*t,i=t*e,s=e*e,r=e*i,63.86+.3345*t-.060374*e+.0017275*i+651814e-9*s+2373599e-11*r):l<2050?(t=l-2e3,62.92+.32217*t+.005589*t*t):l<2150?(t=(l-1820)/100,-20+32*t*t-.5628*(2150-l)):(t=(l-1820)/100,-20+32*t*t)}let U1=I1;function Lc(n){return n+U1(n)/86400}class fn{constructor(t){if(t instanceof fn){this.date=t.date,this.ut=t.ut,this.tt=t.tt;return}const e=1e3*3600*24;if(t instanceof Date&&Number.isFinite(t.getTime())){this.date=t,this.ut=(t.getTime()-Rc.getTime())/e,this.tt=Lc(this.ut);return}if(Number.isFinite(t)){this.date=new Date(Rc.getTime()+t*e),this.ut=t,this.tt=Lc(this.ut);return}throw"Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date."}static FromTerrestrialTime(t){let e=new fn(t);for(;;){const i=t-e.tt;if(Math.abs(i)<1e-12)return e;e=e.AddDays(i)}}toString(){return this.date.toISOString()}AddDays(t){return new fn(this.ut+t)}}function Zi(n){return n instanceof fn?n:new fn(n)}function F1(n){var t=n.tt/36525,e=((((-434e-10*t-576e-9)*t+.0020034)*t-1831e-7)*t-46.836769)*t+84381.406;return e/3600}function N1(n,t){const e=n*io,i=Math.cos(e),s=Math.sin(e);return[t[0],t[1]*i-t[2]*s,t[1]*s+t[2]*i]}function O1(n,t){return N1(F1(n),t)}function z1(n){const t=n.tt/36525;function e(U,Tt){const lt=[];let pt;for(pt=0;pt<=Tt-U;++pt)lt.push(0);return{min:U,array:lt}}function i(U,Tt,lt,pt){const ct=[];for(let Kt=0;Kt<=Tt-U;++Kt)ct.push(e(lt,pt));return{min:U,array:ct}}function s(U,Tt,lt){const pt=U.array[Tt-U.min];return pt.array[lt-pt.min]}function r(U,Tt,lt,pt){const ct=U.array[Tt-U.min];ct.array[lt-ct.min]=pt}let a,o,l,c,h,u,f,p,g,_,m,d,y,v,x,C,T,P,G,M,b,O,$,J=i(-6,6,1,4),L=i(-6,6,1,4);function F(U,Tt){return s(J,U,Tt)}function I(U,Tt){return s(L,U,Tt)}function H(U,Tt,lt){return r(J,U,Tt,lt)}function B(U,Tt,lt){return r(L,U,Tt,lt)}function j(U,Tt,lt,pt,ct){ct(U*lt-Tt*pt,Tt*lt+U*pt)}function W(U){return Math.sin(fi*U)}f=t*t,g=0,$=0,m=0,d=3422.7;var K=W(.19833+.05611*t),Q=W(.27869+.04508*t),k=W(.16827-.36903*t),Z=W(.34734-5.37261*t),nt=W(.10498-5.37899*t),dt=W(.42681-.41855*t),gt=W(.14943-5.37511*t);for(P=.84*K+.31*Q+14.27*k+7.26*Z+.28*nt+.24*dt,G=2.94*K+.31*Q+14.27*k+9.34*Z+1.12*nt+.83*dt,M=-6.4*K-1.89*dt,b=.21*K+.31*Q+14.27*k-88.7*Z-15.3*nt+.24*dt-1.86*gt,O=P-M,p=-3332e-9*W(.59734-5.37261*t)-539e-9*W(.35498-5.37899*t)-64e-9*W(.39943-5.37511*t),y=fi*On(.60643382+1336.85522467*t-313e-8*f)+P/ki,v=fi*On(.37489701+1325.55240982*t+2565e-8*f)+G/ki,x=fi*On(.99312619+99.99735956*t-44e-8*f)+M/ki,C=fi*On(.25909118+1342.2278298*t-892e-8*f)+b/ki,T=fi*On(.82736186+1236.85308708*t-397e-8*f)+O/ki,h=1;h<=4;++h){switch(h){case 1:l=v,o=4,c=1.000002208;break;case 2:l=x,o=3,c=.997504612-.002495388*t;break;case 3:l=C,o=4,c=1.000002708+139.978*p;break;case 4:l=T,o=6,c=1;break;default:throw`Internal error: I = ${h}`}for(H(0,h,1),H(1,h,Math.cos(l)*c),B(0,h,0),B(1,h,Math.sin(l)*c),u=2;u<=o;++u)j(F(u-1,h),I(u-1,h),F(1,h),I(1,h),(U,Tt)=>(H(u,h,U),B(u,h,Tt)));for(u=1;u<=o;++u)H(-u,h,F(u,h)),B(-u,h,-I(u,h))}function Et(U,Tt,lt,pt){for(var ct={x:1,y:0},Kt=[0,U,Tt,lt,pt],At=1;At<=4;++At)Kt[At]!==0&&j(ct.x,ct.y,F(Kt[At],At),I(Kt[At],At),(A,S)=>(ct.x=A,ct.y=S));return ct}function z(U,Tt,lt,pt,ct,Kt,At,A){var S=Et(ct,Kt,At,A);g+=U*S.y,$+=Tt*S.y,m+=lt*S.x,d+=pt*S.x}z(13.902,14.06,-.001,.2607,0,0,0,4),z(.403,-4.01,.394,.0023,0,0,0,3),z(2369.912,2373.36,.601,28.2333,0,0,0,2),z(-125.154,-112.79,-.725,-.9781,0,0,0,1),z(1.979,6.98,-.445,.0433,1,0,0,4),z(191.953,192.72,.029,3.0861,1,0,0,2),z(-8.466,-13.51,.455,-.1093,1,0,0,1),z(22639.5,22609.07,.079,186.5398,1,0,0,0),z(18.609,3.59,-.094,.0118,1,0,0,-1),z(-4586.465,-4578.13,-.077,34.3117,1,0,0,-2),z(3.215,5.44,.192,-.0386,1,0,0,-3),z(-38.428,-38.64,.001,.6008,1,0,0,-4),z(-.393,-1.43,-.092,.0086,1,0,0,-6),z(-.289,-1.59,.123,-.0053,0,1,0,4),z(-24.42,-25.1,.04,-.3,0,1,0,2),z(18.023,17.93,.007,.1494,0,1,0,1),z(-668.146,-126.98,-1.302,-.3997,0,1,0,0),z(.56,.32,-.001,-.0037,0,1,0,-1),z(-165.145,-165.06,.054,1.9178,0,1,0,-2),z(-1.877,-6.46,-.416,.0339,0,1,0,-4),z(.213,1.02,-.074,.0054,2,0,0,4),z(14.387,14.78,-.017,.2833,2,0,0,2),z(-.586,-1.2,.054,-.01,2,0,0,1),z(769.016,767.96,.107,10.1657,2,0,0,0),z(1.75,2.01,-.018,.0155,2,0,0,-1),z(-211.656,-152.53,5.679,-.3039,2,0,0,-2),z(1.225,.91,-.03,-.0088,2,0,0,-3),z(-30.773,-34.07,-.308,.3722,2,0,0,-4),z(-.57,-1.4,-.074,.0109,2,0,0,-6),z(-2.921,-11.75,.787,-.0484,1,1,0,2),z(1.267,1.52,-.022,.0164,1,1,0,1),z(-109.673,-115.18,.461,-.949,1,1,0,0),z(-205.962,-182.36,2.056,1.4437,1,1,0,-2),z(.233,.36,.012,-.0025,1,1,0,-3),z(-4.391,-9.66,-.471,.0673,1,1,0,-4),z(.283,1.53,-.111,.006,1,-1,0,4),z(14.577,31.7,-1.54,.2302,1,-1,0,2),z(147.687,138.76,.679,1.1528,1,-1,0,0),z(-1.089,.55,.021,0,1,-1,0,-1),z(28.475,23.59,-.443,-.2257,1,-1,0,-2),z(-.276,-.38,-.006,-.0036,1,-1,0,-3),z(.636,2.27,.146,-.0102,1,-1,0,-4),z(-.189,-1.68,.131,-.0028,0,2,0,2),z(-7.486,-.66,-.037,-.0086,0,2,0,0),z(-8.096,-16.35,-.74,.0918,0,2,0,-2),z(-5.741,-.04,0,-9e-4,0,0,2,2),z(.255,0,0,0,0,0,2,1),z(-411.608,-.2,0,-.0124,0,0,2,0),z(.584,.84,0,.0071,0,0,2,-1),z(-55.173,-52.14,0,-.1052,0,0,2,-2),z(.254,.25,0,-.0017,0,0,2,-3),z(.025,-1.67,0,.0031,0,0,2,-4),z(1.06,2.96,-.166,.0243,3,0,0,2),z(36.124,50.64,-1.3,.6215,3,0,0,0),z(-13.193,-16.4,.258,-.1187,3,0,0,-2),z(-1.187,-.74,.042,.0074,3,0,0,-4),z(-.293,-.31,-.002,.0046,3,0,0,-6),z(-.29,-1.45,.116,-.0051,2,1,0,2),z(-7.649,-10.56,.259,-.1038,2,1,0,0),z(-8.627,-7.59,.078,-.0192,2,1,0,-2),z(-2.74,-2.54,.022,.0324,2,1,0,-4),z(1.181,3.32,-.212,.0213,2,-1,0,2),z(9.703,11.67,-.151,.1268,2,-1,0,0),z(-.352,-.37,.001,-.0028,2,-1,0,-1),z(-2.494,-1.17,-.003,-.0017,2,-1,0,-2),z(.36,.2,-.012,-.0043,2,-1,0,-4),z(-1.167,-1.25,.008,-.0106,1,2,0,0),z(-7.412,-6.12,.117,.0484,1,2,0,-2),z(-.311,-.65,-.032,.0044,1,2,0,-4),z(.757,1.82,-.105,.0112,1,-2,0,2),z(2.58,2.32,.027,.0196,1,-2,0,0),z(2.533,2.4,-.014,-.0212,1,-2,0,-2),z(-.344,-.57,-.025,.0036,0,3,0,-2),z(-.992,-.02,0,0,1,0,2,2),z(-45.099,-.02,0,-.001,1,0,2,0),z(-.179,-9.52,0,-.0833,1,0,2,-2),z(-.301,-.33,0,.0014,1,0,2,-4),z(-6.382,-3.37,0,-.0481,1,0,-2,2),z(39.528,85.13,0,-.7136,1,0,-2,0),z(9.366,.71,0,-.0112,1,0,-2,-2),z(.202,.02,0,0,1,0,-2,-4),z(.415,.1,0,.0013,0,1,2,0),z(-2.152,-2.26,0,-.0066,0,1,2,-2),z(-1.44,-1.3,0,.0014,0,1,-2,2),z(.384,-.04,0,0,0,1,-2,-2),z(1.938,3.6,-.145,.0401,4,0,0,0),z(-.952,-1.58,.052,-.013,4,0,0,-2),z(-.551,-.94,.032,-.0097,3,1,0,0),z(-.482,-.57,.005,-.0045,3,1,0,-2),z(.681,.96,-.026,.0115,3,-1,0,0),z(-.297,-.27,.002,-9e-4,2,2,0,-2),z(.254,.21,-.003,0,2,-2,0,-2),z(-.25,-.22,.004,.0014,1,3,0,-2),z(-3.996,0,0,4e-4,2,0,2,0),z(.557,-.75,0,-.009,2,0,2,-2),z(-.459,-.38,0,-.0053,2,0,-2,2),z(-1.298,.74,0,4e-4,2,0,-2,0),z(.538,1.14,0,-.0141,2,0,-2,-2),z(.263,.02,0,0,1,1,2,0),z(.426,.07,0,-6e-4,1,1,-2,-2),z(-.304,.03,0,3e-4,1,-1,2,0),z(-.372,-.19,0,-.0027,1,-1,-2,2),z(.418,0,0,0,0,0,4,0),z(-.33,-.04,0,0,3,0,2,0);function ot(U,Tt,lt,pt,ct){return U*Et(Tt,lt,pt,ct).y}_=0,_+=ot(-526.069,0,0,1,-2),_+=ot(-3.352,0,0,1,-4),_+=ot(44.297,1,0,1,-2),_+=ot(-6,1,0,1,-4),_+=ot(20.599,-1,0,1,0),_+=ot(-30.598,-1,0,1,-2),_+=ot(-24.649,-2,0,1,0),_+=ot(-2,-2,0,1,-2),_+=ot(-22.571,0,1,1,-2),_+=ot(10.985,0,-1,1,-2),g+=.82*W(.7736-62.5512*t)+.31*W(.0466-125.1025*t)+.35*W(.5785-25.1042*t)+.66*W(.4591+1335.8075*t)+.64*W(.313-91.568*t)+1.14*W(.148+1331.2898*t)+.21*W(.5918+1056.5859*t)+.44*W(.5784+1322.8595*t)+.24*W(.2275-5.7374*t)+.28*W(.2965+2.6929*t)+.33*W(.3132+6.3368*t),a=C+$/ki;let It=(1.000002708+139.978*p)*(18518.511+1.189+m)*Math.sin(a)-6.24*Math.sin(3*a)+_;return{geo_eclip_lon:fi*On((y+g/ki)/fi),geo_eclip_lat:Math.PI/(180*3600)*It,distance_au:ki*P1/(.999953253*d)}}function B1(n,t){return[n.rot[0][0]*t[0]+n.rot[1][0]*t[1]+n.rot[2][0]*t[2],n.rot[0][1]*t[0]+n.rot[1][1]*t[1]+n.rot[2][1]*t[2],n.rot[0][2]*t[0]+n.rot[1][2]*t[1]+n.rot[2][2]*t[2]]}function G1(n,t,e){const i=k1(t,e);return B1(i,n)}function k1(n,t){const e=n.tt/36525;let i=84381.406,s=((((-951e-10*e+132851e-9)*e-.00114045)*e-1.0790069)*e+5038.481507)*e,r=((((3337e-10*e-467e-9)*e-.00772503)*e+.0512623)*e-.025754)*e+i,a=((((-56e-9*e+170663e-9)*e-.00121197)*e-2.3814292)*e+10.556403)*e;i*=dr,s*=dr,r*=dr,a*=dr;const o=Math.sin(i),l=Math.cos(i),c=Math.sin(-s),h=Math.cos(-s),u=Math.sin(-r),f=Math.cos(-r),p=Math.sin(a),g=Math.cos(a),_=g*h-c*p*f,m=g*c*l+p*f*h*l-o*p*u,d=g*c*o+p*f*h*o+l*p*u,y=-p*h-c*g*f,v=-p*c*l+g*f*h*l-o*g*u,x=-p*c*o+g*f*h*o+l*g*u,C=c*u,T=-u*h*l-o*f,P=-u*h*o+f*l;if(t===As.Into2000)return new oo([[_,m,d],[y,v,x],[C,T,P]]);if(t===As.From2000)return new oo([[_,y,C],[m,v,T],[d,x,P]]);throw"Invalid precess direction"}class Qe{constructor(t,e,i,s){this.x=t,this.y=e,this.z=i,this.t=s}Length(){return Math.hypot(this.x,this.y,this.z)}}class _i{constructor(t,e,i,s,r,a,o){this.x=t,this.y=e,this.z=i,this.vx=s,this.vy=r,this.vz=a,this.t=o}}class H1{constructor(t,e,i){this.lat=Ba(t),this.lon=Ba(e),this.dist=Ba(i)}}class oo{constructor(t){this.rot=t}}function Cs(n){const t=Zi(n),e=z1(t),i=e.distance_au*Math.cos(e.geo_eclip_lat),s=[i*Math.cos(e.geo_eclip_lon),i*Math.sin(e.geo_eclip_lon),e.distance_au*Math.sin(e.geo_eclip_lat)],r=O1(t,s),a=G1(r,t,As.Into2000);return new Qe(a[0],a[1],a[2],t)}function Jh(n){const t=Zi(n),e=1e-5,i=t.AddDays(-e),s=t.AddDays(+e),r=Cs(i),a=Cs(s);return new _i((r.x+a.x)/2,(r.y+a.y)/2,(r.z+a.z)/2,(a.x-r.x)/(2*e),(a.y-r.y)/(2*e),(a.z-r.z)/(2*e),t)}function V1(n){const t=Zi(n),e=Jh(t),i=1+Kh;return new _i(e.x/i,e.y/i,e.z/i,e.vx/i,e.vy/i,e.vz/i,t)}function qn(n,t,e){let i=1,s=0;for(let r of n){let a=0;for(let[l,c,h]of r)a+=l*Math.cos(c+t*h);let o=i*a;e&&(o%=fi),s+=o,i*=t}return s}function Ga(n,t){let e=1,i=0,s=0,r=0;for(let a of n){let o=0,l=0;for(let[c,h,u]of a){let f=h+t*u;o+=c*u*Math.sin(f),r>0&&(l+=c*Math.cos(f))}s+=r*i*l-e*o,i=e,e*=t,++r}return s}const ps=365250,lo=0,co=1,ho=2;function uo(n){return new Fe(n[0]+44036e-11*n[1]-190919e-12*n[2],-479966e-12*n[0]+.917482137087*n[1]-.397776982902*n[2],.397776982902*n[1]+.917482137087*n[2])}function Qh(n,t,e){const i=e*Math.cos(t),s=Math.cos(n),r=Math.sin(n);return[i*s,i*r,e*Math.sin(t)]}function xr(n,t){const e=t.tt/ps,i=qn(n[lo],e,!0),s=qn(n[co],e,!1),r=qn(n[ho],e,!1),a=Qh(i,s,r);return uo(a).ToAstroVector(t)}function fo(n,t){const e=t/ps,i=qn(n[lo],e,!0),s=qn(n[co],e,!1),r=qn(n[ho],e,!1),a=Ga(n[lo],e),o=Ga(n[co],e),l=Ga(n[ho],e),c=Math.cos(i),h=Math.sin(i),u=Math.cos(s),f=Math.sin(s),p=+(l*u*c)-r*f*c*o-r*u*h*a,g=+(l*u*h)-r*f*h*o+r*u*c*a,_=+(l*f)+r*u*o,m=Qh(i,s,r),d=[p/ps,g/ps,_/ps],y=uo(m),v=uo(d);return new mn(t,y,v)}function fr(n,t,e,i){const s=i/(i+No),r=xr(Wi[e],t);n.x+=s*r.x,n.y+=s*r.y,n.z+=s*r.z}function W1(n){const t=new Qe(0,0,0,n);return fr(t,n,bt.Jupiter,no),fr(t,n,bt.Saturn,so),fr(t,n,bt.Uranus,ro),fr(t,n,bt.Neptune,ao),t}const po=51,X1=29200,kn=146,Ti=201,ln=[[-73e4,[-26.118207232108,-14.376168177825,3.384402515299],[.0016339372163656,-.0027861699588508,-.0013585880229445]],[-700800,[41.974905202127,-.448502952929,-12.770351505989],[.00073458569351457,.0022785014891658,.00048619778602049]],[-671600,[14.706930780744,44.269110540027,9.353698474772],[-.00210001479998,.00022295915939915,.00070143443551414]],[-642400,[-29.441003929957,-6.43016153057,6.858481011305],[.00084495803960544,-.0030783914758711,-.0012106305981192]],[-613200,[39.444396946234,-6.557989760571,-13.913760296463],[.0011480029005873,.0022400006880665,.00035168075922288]],[-584e3,[20.2303809507,43.266966657189,7.382966091923],[-.0019754081700585,.00053457141292226,.00075929169129793]],[-554800,[-30.65832536462,2.093818874552,9.880531138071],[61010603013347e-18,-.0031326500935382,-.00099346125151067]],[-525600,[35.737703251673,-12.587706024764,-14.677847247563],[.0015802939375649,.0021347678412429,.00019074436384343]],[-496400,[25.466295188546,41.367478338417,5.216476873382],[-.0018054401046468,.0008328308359951,.00080260156912107]],[-467200,[-29.847174904071,10.636426313081,12.297904180106],[-.00063257063052907,-.0029969577578221,-.00074476074151596]],[-438e3,[30.774692107687,-18.236637015304,-14.945535879896],[.0020113162005465,.0019353827024189,-20937793168297e-19]],[-408800,[30.243153324028,38.656267888503,2.938501750218],[-.0016052508674468,.0011183495337525,.00083333973416824]],[-379600,[-27.288984772533,18.643162147874,14.023633623329],[-.0011856388898191,-.0027170609282181,-.00049015526126399]],[-350400,[24.519605196774,-23.245756064727,-14.626862367368],[.0024322321483154,.0016062008146048,-.00023369181613312]],[-321200,[34.505274805875,35.125338586954,.557361475637],[-.0013824391637782,.0013833397561817,.00084823598806262]],[-292e3,[-23.275363915119,25.818514298769,15.055381588598],[-.0016062295460975,-.0023395961498533,-.00024377362639479]],[-262800,[17.050384798092,-27.180376290126,-13.608963321694],[.0028175521080578,.0011358749093955,-.00049548725258825]],[-233600,[38.093671910285,30.880588383337,-1.843688067413],[-.0011317697153459,.0016128814698472,.00084177586176055]],[-204400,[-18.197852930878,31.932869934309,15.438294826279],[-.0019117272501813,-.0019146495909842,-19657304369835e-18]],[-175200,[8.528924039997,-29.618422200048,-11.805400994258],[.0031034370787005,.0005139363329243,-.00077293066202546]],[-146e3,[40.94685725864,25.904973592021,-4.256336240499],[-.00083652705194051,.0018129497136404,.0008156422827306]],[-116800,[-12.326958895325,36.881883446292,15.217158258711],[-.0021166103705038,-.001481442003599,.00017401209844705]],[-87600,[-.633258375909,-30.018759794709,-9.17193287495],[.0032016994581737,-.00025279858672148,-.0010411088271861]],[-58400,[42.936048423883,20.344685584452,-6.588027007912],[-.00050525450073192,.0019910074335507,.00077440196540269]],[-29200,[-5.975910552974,40.61180995846,14.470131723673],[-.0022184202156107,-.0010562361130164,.00033652250216211]],[0,[-9.875369580774,-27.978926224737,-5.753711824704],[.0030287533248818,-.0011276087003636,-.0012651326732361]],[29200,[43.958831986165,14.214147973292,-8.808306227163],[-.00014717608981871,.0021404187242141,.00071486567806614]],[58400,[.67813676352,43.094461639362,13.243238780721],[-.0022358226110718,-.00063233636090933,.00047664798895648]],[87600,[-18.282602096834,-23.30503958666,-1.766620508028],[.0025567245263557,-.0019902940754171,-.0013943491701082]],[116800,[43.873338744526,7.700705617215,-10.814273666425],[.00023174803055677,.0022402163127924,.00062988756452032]],[146e3,[7.392949027906,44.382678951534,11.629500214854],[-.002193281545383,-.00021751799585364,.00059556516201114]],[175200,[-24.981690229261,-16.204012851426,2.466457544298],[.001819398914958,-.0026765419531201,-.0013848283502247]],[204400,[42.530187039511,.845935508021,-12.554907527683],[.00065059779150669,.0022725657282262,.00051133743202822]],[233600,[13.999526486822,44.462363044894,9.669418486465],[-.0021079296569252,.00017533423831993,.00069128485798076]],[262800,[-29.184024803031,-7.371243995762,6.493275957928],[.00093581363109681,-.0030610357109184,-.0012364201089345]],[292e3,[39.831980671753,-6.078405766765,-13.909815358656],[.0011117769689167,.0022362097830152,.00036230548231153]],[321200,[20.294955108476,43.417190420251,7.450091985932],[-.0019742157451535,.00053102050468554,.00075938408813008]],[350400,[-30.66999230216,2.318743558955,9.973480913858],[45605107450676e-18,-.0031308219926928,-.00099066533301924]],[379600,[35.626122155983,-12.897647509224,-14.777586508444],[.0016015684949743,.0021171931182284,.00018002516202204]],[408800,[26.133186148561,41.232139187599,5.00640132622],[-.0017857704419579,.00086046232702817,.00080614690298954]],[438e3,[-29.57674022923,11.863535943587,12.631323039872],[-.00072292830060955,-.0029587820140709,-.000708242964503]],[467200,[29.910805787391,-19.159019294,-15.013363865194],[.0020871080437997,.0018848372554514,-38528655083926e-18]],[496400,[31.375957451819,38.050372720763,2.433138343754],[-.0015546055556611,.0011699815465629,.00083565439266001]],[525600,[-26.360071336928,20.662505904952,14.414696258958],[-.0013142373118349,-.0026236647854842,-.00042542017598193]],[554800,[22.599441488648,-24.508879898306,-14.484045731468],[.0025454108304806,.0014917058755191,-.00030243665086079]],[584e3,[35.877864013014,33.894226366071,-.224524636277],[-.0012941245730845,.0014560427668319,.00084762160640137]],[613200,[-21.538149762417,28.204068269761,15.321973799534],[-.001731211740901,-.0021939631314577,-.0001631691327518]],[642400,[13.971521374415,-28.339941764789,-13.083792871886],[.0029334630526035,.00091860931752944,-.00059939422488627]],[671600,[39.526942044143,28.93989736011,-2.872799527539],[-.0010068481658095,.001702113288809,.00083578230511981]],[700800,[-15.576200701394,34.399412961275,15.466033737854],[-.0020098814612884,-.0017191109825989,70414782780416e-18]],[73e4,[4.24325283709,-30.118201690825,-10.707441231349],[.0031725847067411,.0001609846120227,-.00090672150593868]]];class Fe{constructor(t,e,i){this.x=t,this.y=e,this.z=i}clone(){return new Fe(this.x,this.y,this.z)}ToAstroVector(t){return new Qe(this.x,this.y,this.z,t)}static zero(){return new Fe(0,0,0)}quadrature(){return this.x*this.x+this.y*this.y+this.z*this.z}add(t){return new Fe(this.x+t.x,this.y+t.y,this.z+t.z)}sub(t){return new Fe(this.x-t.x,this.y-t.y,this.z-t.z)}incr(t){this.x+=t.x,this.y+=t.y,this.z+=t.z}decr(t){this.x-=t.x,this.y-=t.y,this.z-=t.z}mul(t){return new Fe(t*this.x,t*this.y,t*this.z)}div(t){return new Fe(this.x/t,this.y/t,this.z/t)}mean(t){return new Fe((this.x+t.x)/2,(this.y+t.y)/2,(this.z+t.z)/2)}neg(){return new Fe(-this.x,-this.y,-this.z)}}class mn{constructor(t,e,i){this.tt=t,this.r=e,this.v=i}clone(){return new mn(this.tt,this.r,this.v)}sub(t){return new mn(this.tt,this.r.sub(t.r),this.v.sub(t.v))}}function $1(n){let[t,[e,i,s],[r,a,o]]=n;return new mn(t,new Fe(e,i,s),new Fe(r,a,o))}function pr(n,t,e,i){const s=i/(i+No),r=fo(Wi[e],t);return n.r.incr(r.r.mul(s)),n.v.incr(r.v.mul(s)),r}function ds(n,t,e){const i=e.sub(n),s=i.quadrature();return i.mul(t/(s*Math.sqrt(s)))}class qr{constructor(t){let e=new mn(t,new Fe(0,0,0),new Fe(0,0,0));this.Jupiter=pr(e,t,bt.Jupiter,no),this.Saturn=pr(e,t,bt.Saturn,so),this.Uranus=pr(e,t,bt.Uranus,ro),this.Neptune=pr(e,t,bt.Neptune,ao),this.Jupiter.r.decr(e.r),this.Jupiter.v.decr(e.v),this.Saturn.r.decr(e.r),this.Saturn.v.decr(e.v),this.Uranus.r.decr(e.r),this.Uranus.v.decr(e.v),this.Neptune.r.decr(e.r),this.Neptune.v.decr(e.v),this.Sun=new mn(t,e.r.mul(-1),e.v.mul(-1))}Acceleration(t){let e=ds(t,No,this.Sun.r);return e.incr(ds(t,no,this.Jupiter.r)),e.incr(ds(t,so,this.Saturn.r)),e.incr(ds(t,ro,this.Uranus.r)),e.incr(ds(t,ao,this.Neptune.r)),e}}class Yr{constructor(t,e,i,s){this.tt=t,this.r=e,this.v=i,this.a=s}clone(){return new Yr(this.tt,this.r.clone(),this.v.clone(),this.a.clone())}}class tu{constructor(t,e){this.bary=t,this.grav=e}}function Rr(n,t,e,i){return new Fe(t.x+n*(e.x+n*i.x/2),t.y+n*(e.y+n*i.y/2),t.z+n*(e.z+n*i.z/2))}function Dc(n,t,e){return new Fe(t.x+n*e.x,t.y+n*e.y,t.z+n*e.z)}function mo(n,t){const e=n-t.tt,i=new qr(n),s=Rr(e,t.r,t.v,t.a),r=i.Acceleration(s).mean(t.a),a=Rr(e,t.r,t.v,r),o=t.v.add(r.mul(e)),l=i.Acceleration(a),c=new Yr(n,a,o,l);return new tu(i,c)}const q1=[];function eu(n,t){const e=Math.floor(n);return e<0?0:e>=t?t-1:e}function go(n){const t=$1(n),e=new qr(t.tt),i=t.r.add(e.Sun.r),s=t.v.add(e.Sun.v),r=e.Acceleration(i),a=new Yr(t.tt,i,s,r);return new tu(e,a)}function Y1(n,t){const e=ln[0][0];if(t<e||t>ln[po-1][0])return null;const i=eu((t-e)/X1,po-1);if(!n[i]){const r=n[i]=[];r[0]=go(ln[i]).grav,r[Ti-1]=go(ln[i+1]).grav;let a,o=r[0].tt;for(a=1;a<Ti-1;++a)r[a]=mo(o+=kn,r[a-1]).grav;o=r[Ti-1].tt;var s=[];for(s[Ti-1]=r[Ti-1],a=Ti-2;a>0;--a)s[a]=mo(o-=kn,s[a+1]).grav;for(a=Ti-2;a>0;--a){const l=a/(Ti-1);r[a].r=r[a].r.mul(1-l).add(s[a].r.mul(l)),r[a].v=r[a].v.mul(1-l).add(s[a].v.mul(l)),r[a].a=r[a].a.mul(1-l).add(s[a].a.mul(l))}}return n[i]}function Ic(n,t,e){let i=go(n);const s=Math.ceil((t-i.grav.tt)/e);for(let r=0;r<s;++r)i=mo(r+1===s?t:i.grav.tt+e,i.grav);return i}function iu(n,t){let e,i,s;const r=Y1(q1,n.tt);if(r){const a=eu((n.tt-r[0].tt)/kn,Ti-1),o=r[a],l=r[a+1],c=o.a.mean(l.a),h=Rr(n.tt-o.tt,o.r,o.v,c),u=Dc(n.tt-o.tt,o.v,c),f=Rr(n.tt-l.tt,l.r,l.v,c),p=Dc(n.tt-l.tt,l.v,c),g=(n.tt-o.tt)/kn;e=h.mul(1-g).add(f.mul(g)),i=u.mul(1-g).add(p.mul(g))}else{let a;n.tt<ln[0][0]?a=Ic(ln[0],n.tt,-kn):a=Ic(ln[po-1],n.tt,+kn),e=a.grav.r,i=a.grav.v,s=a.bary}return s||(s=new qr(n.tt)),e=e.sub(s.Sun.r),i=i.sub(s.Sun.v),new _i(e.x,e.y,e.z,i.x,i.y,i.z,n)}const j1=new oo([[.999432765338654,-.0336771074697641,0],[.0303959428906285,.902057912352809,.430543388542295],[-.0144994559663353,-.430299169409101,.902569881273754]]),mr=[{mu:282489428433814e-21,al:[1.446213296021224,3.5515522861824],a:[[.0028210960212903,0,0]],l:[[-.0001925258348666,4.9369589722645,.01358483658305],[-970803596076e-16,4.3188796477322,.01303413843243],[-8988174165e-14,1.9080016428617,.00305064867158],[-553101050262e-16,1.4936156681569,.01293892891155]],z:[[.0041510849668155,4.089939635545,-.01290686414666],[.0006260521444113,1.446188898627,3.5515522949802],[352747346169e-16,2.1256287034578,.00012727416567]],zeta:[[.0003142172466014,2.7964219722923,-.002315096098],[904169207946e-16,1.0477061879627,-.00056920638196]]},{mu:282483274392893e-21,al:[-.3735263437471362,1.76932271112347],a:[[.0044871037804314,0,0],[4324367498e-16,1.819645606291,1.7822295777568]],l:[[.0008576433172936,4.3188693178264,.01303413830805],[.0004549582875086,1.4936531751079,.01293892881962],[.0003248939825174,1.8196494533458,1.7822295777568],[-.0003074250079334,4.9377037005911,.01358483286724],[.0001982386144784,1.907986905476,.00305101212869],[.0001834063551804,2.1402853388529,.00145009789338],[-.0001434383188452,5.622214036663,.89111478887838],[-771939140944e-16,4.300272437235,2.6733443704266]],z:[[-.0093589104136341,4.0899396509039,-.01290686414666],[.0002988994545555,5.9097265185595,1.7693227079462],[.000213903639035,2.1256289300016,.00012727418407],[.0001980963564781,2.743516829265,.00067797343009],[.0001210388158965,5.5839943711203,320566149e-13],[837042048393e-16,1.6094538368039,-.90402165808846],[823525166369e-16,1.4461887708689,3.5515522949802]],zeta:[[.0040404917832303,1.0477063169425,-.0005692064054],[.0002200421034564,3.3368857864364,-.00012491307307],[.0001662544744719,2.4134862374711,0],[590282470983e-16,5.9719930968366,-3056160225e-14]]},{mu:282498184184723e-21,al:[.2874089391143348,.878207923589328],a:[[.0071566594572575,0,0],[1393029911e-15,1.1586745884981,2.6733443704266]],l:[[.0002310797886226,2.1402987195942,.00145009784384],[-.0001828635964118,4.3188672736968,.01303413828263],[.0001512378778204,4.9373102372298,.01358483481252],[-.0001163720969778,4.300265986149,2.6733443704266],[-955478069846e-16,1.4936612842567,.01293892879857],[815246854464e-16,5.6222137132535,.89111478887838],[-801219679602e-16,1.2995922951532,1.0034433456729],[-607017260182e-16,.64978769669238,.50172167043264]],z:[[.0014289811307319,2.1256295942739,.00012727413029],[.000771093122676,5.5836330003496,320643411e-13],[.0005925911780766,4.0899396636448,-.01290686414666],[.0002045597496146,5.2713683670372,-.12523544076106],[.0001785118648258,.28743156721063,.8782079244252],[.0001131999784893,1.4462127277818,3.5515522949802],[-65877816921e-15,2.2702423990985,-1.7951364394537],[497058888328e-16,5.9096792204858,1.7693227129285]],zeta:[[.0015932721570848,3.3368862796665,-.00012491307058],[.0008533093128905,2.4133881688166,0],[.0003513347911037,5.9720789850127,-3056101771e-14],[-.0001441929255483,1.0477061764435,-.00056920632124]]},{mu:282492144889909e-21,al:[-.3620341291375704,.376486233433828],a:[[.0125879701715314,0,0],[3595204947e-15,.64965776007116,.50172168165034],[27580210652e-16,1.808423578151,3.1750660413359]],l:[[.0005586040123824,2.1404207189815,.00145009793231],[-.0003805813868176,2.7358844897853,2972965062e-14],[.0002205152863262,.649796525964,.5017216724358],[.0001877895151158,1.8084787604005,3.1750660413359],[766916975242e-16,6.2720114319755,1.3928364636651],[747056855106e-16,1.2995916202344,1.0034433456729]],z:[[.0073755808467977,5.5836071576084,3206509914e-14],[.0002065924169942,5.9209831565786,.37648624194703],[.0001589869764021,.28744006242623,.8782079244252],[-.0001561131605348,2.1257397865089,.00012727441285],[.0001486043380971,1.4462134301023,3.5515522949802],[635073108731e-16,5.9096803285954,1.7693227129285],[599351698525e-16,4.1125517584798,-2.7985797954589],[540660842731e-16,5.5390350845569,.00286834082283],[-489596900866e-16,4.6218149483338,-.62695712529519]],zeta:[[.0038422977898495,2.4133922085557,0],[.0022453891791894,5.9721736773277,-3056125525e-14],[-.0002604479450559,3.3368746306409,-.00012491309972],[33211214323e-15,5.5604137742337,.00290037688507]]}];class Z1{constructor(t,e,i,s){this.io=t,this.europa=e,this.ganymede=i,this.callisto=s}}function K1(n,t,e){const i=e[0],s=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=Math.sqrt(t/(i*i*i));let h,u,f,p=s+r*Math.sin(s)-a*Math.cos(s);do h=Math.cos(p),u=Math.sin(p),f=(s-p+r*u-a*h)/(1-r*h-a*u),p+=f;while(Math.abs(f)>=1e-12);h=Math.cos(p),u=Math.sin(p);const g=a*h-r*u,_=-r*h-a*u,m=1/(1+_),y=1/(1+Math.sqrt(1-r*r-a*a)),v=i*(h-r-y*a*g),x=i*(u-a+y*r*g),C=c*m*i*(-u-y*a*_),T=c*m*i*(+h+y*r*_),P=2*Math.sqrt(1-o*o-l*l),G=1-2*l*l,M=1-2*o*o,b=2*l*o;return new _i(v*G+x*b,v*b+x*M,(o*x-v*l)*P,C*G+T*b,C*b+T*M,(o*T-C*l)*P,n)}function gr(n,t){const e=n.tt+18262.5,i=[0,t.al[0]+e*t.al[1],0,0,0,0];for(let[r,a,o]of t.a)i[0]+=r*Math.cos(a+e*o);for(let[r,a,o]of t.l)i[1]+=r*Math.sin(a+e*o);i[1]%=fi,i[1]<0&&(i[1]+=fi);for(let[r,a,o]of t.z){const l=a+e*o;i[2]+=r*Math.cos(l),i[3]+=r*Math.sin(l)}for(let[r,a,o]of t.zeta){const l=a+e*o;i[4]+=r*Math.cos(l),i[5]+=r*Math.sin(l)}const s=K1(n,t.mu,i);return s_(j1,s)}function _o(n){const t=new fn(n);return new Z1(gr(t,mr[0]),gr(t,mr[1]),gr(t,mr[2]),gr(t,mr[3]))}function ti(n,t){var e=Zi(t);if(n in Wi)return xr(Wi[n],e);if(n===bt.Pluto){const a=iu(e);return new Qe(a.x,a.y,a.z,e)}if(n===bt.Sun)return new Qe(0,0,0,e);if(n===bt.Moon){var i=xr(Wi.Earth,e),s=Cs(e);return new Qe(i.x+s.x,i.y+s.y,i.z+s.z,e)}if(n===bt.EMB){const a=xr(Wi.Earth,e),o=Cs(e),l=1+Kh;return new Qe(a.x+o.x/l,a.y+o.y/l,a.z+o.z/l,e)}if(n===bt.SSB)return W1(e);const r=Oo(n);if(r){const a=new H1(r.dec,15*r.ra,r.dist);return n_(a,e)}throw`HelioVector: Unknown body "${n}"`}function J1(n,t){let e=t,i=0;for(let s=0;s<10;++s){const r=n(e),a=r.Length()/Zh;if(a>1)throw"Object is too distant for light-travel solver.";const o=t.AddDays(-a);if(i=Math.abs(o.tt-e.tt),i<1e-9)return r;e=o}throw`Light-travel time solver did not converge: dt = ${i}`}class Q1{constructor(t,e,i,s){this.observerBody=t,this.targetBody=e,this.aberration=i,this.observerPos=s}Position(t){this.aberration&&(this.observerPos=ti(this.observerBody,t));const e=ti(this.targetBody,t);return new Qe(e.x-this.observerPos.x,e.y-this.observerPos.y,e.z-this.observerPos.z,t)}}function t_(n,t,e,i){const s=Zi(n);if(Oo(e)){const o=ti(e,s);{const l=i_(t,s),c=new Qe(o.x-l.x,o.y-l.y,o.z-l.z,s),h=Zh/c.Length();return new Qe(c.x+l.vx/h,c.y+l.vy/h,c.z+l.vz/h,s)}}let r;r=new Qe(0,0,0,s);const a=new Q1(t,e,i,r);return J1(o=>a.Position(o),s)}function Ps(n,t,e){const i=Zi(t);switch(n){case bt.Earth:return new Qe(0,0,0,i);case bt.Moon:return Cs(i);default:const s=t_(i,bt.Earth,n,e);return s.t=i,s}}function e_(n,t){return new _i(n.r.x,n.r.y,n.r.z,n.v.x,n.v.y,n.v.z,t)}function i_(n,t){const e=Zi(t);switch(n){case bt.Sun:return new _i(0,0,0,0,0,0,e);case bt.SSB:const i=new qr(e.tt);return new _i(-i.Sun.r.x,-i.Sun.r.y,-i.Sun.r.z,-i.Sun.v.x,-i.Sun.v.y,-i.Sun.v.z,e);case bt.Mercury:case bt.Venus:case bt.Earth:case bt.Mars:case bt.Jupiter:case bt.Saturn:case bt.Uranus:case bt.Neptune:const s=fo(Wi[n],e.tt);return e_(s,e);case bt.Pluto:return iu(e);case bt.Moon:case bt.EMB:const r=fo(Wi.Earth,e.tt),a=n==bt.Moon?Jh(e):V1(e);return new _i(a.x+r.r.x,a.y+r.r.y,a.z+r.r.z,a.vx+r.v.x,a.vy+r.v.y,a.vz+r.v.z,e);default:if(Oo(n)){const o=ti(n,e);return new _i(o.x,o.y,o.z,0,0,0,e)}throw`HelioState: Unsupported body "${n}"`}}var Uc;(function(n){n[n.Pericenter=0]="Pericenter",n[n.Apocenter=1]="Apocenter"})(Uc||(Uc={}));function n_(n,t){t=Zi(t);const e=n.lat*io,i=n.lon*io,s=n.dist*Math.cos(e);return new Qe(s*Math.cos(i),s*Math.sin(i),n.dist*Math.sin(e),t)}function s_(n,t){return new _i(n.rot[0][0]*t.x+n.rot[1][0]*t.y+n.rot[2][0]*t.z,n.rot[0][1]*t.x+n.rot[1][1]*t.y+n.rot[2][1]*t.z,n.rot[0][2]*t.x+n.rot[1][2]*t.y+n.rot[2][2]*t.z,n.rot[0][0]*t.vx+n.rot[1][0]*t.vy+n.rot[2][0]*t.vz,n.rot[0][1]*t.vx+n.rot[1][1]*t.vy+n.rot[2][1]*t.vz,n.rot[0][2]*t.vx+n.rot[1][2]*t.vy+n.rot[2][2]*t.vz,t.t)}var Fc;(function(n){n.Penumbral="penumbral",n.Partial="partial",n.Annular="annular",n.Total="total"})(Fc||(Fc={}));var Nc;(function(n){n[n.Invalid=0]="Invalid",n[n.Ascending=1]="Ascending",n[n.Descending=-1]="Descending"})(Nc||(Nc={}));function nu(n,t,e){const i=R.coordinateSystem,s=new E;if(i==="Geocentric"||i==="Tychonic"){const r=t.find(a=>a.data.name==="Earth");r&&s.copy(r.mesh.position)}else if(i==="Barycentric"){const r=ti(bt.SSB,R.date);s.set(r.x*$t,r.z*$t,-r.y*$t)}else s.copy(e.position);s.applyQuaternion(n.quaternion),n.position.copy(s).negate()}function r_(n,t){let e=n;for(let i=0;i<10;i++){const s=(e-t*Math.sin(e)-n)/(1-t*Math.cos(e));if(e-=s,Math.abs(s)<1e-6)break}return e}function jr(n,t){const i=new Date("2000-01-01T12:00:00Z").getTime(),s=(t.getTime()-i)/864e5,a=.9856076686/n.a**1.5;let o=n.M+a*s;o=o%360,o<0&&(o+=360);const l=Math.PI/180,c=n.a,h=n.e,u=n.i*l,f=n.Omega*l,p=n.w*l,g=o*l,_=r_(g,h),m=c*(Math.cos(_)-h),d=c*Math.sqrt(1-h*h)*Math.sin(_),y=Math.cos(f),v=Math.sin(f),x=Math.cos(p),C=Math.sin(p),T=Math.cos(u),P=Math.sin(u),G=m*(y*x-v*C*T)-d*(y*C+v*x*T),M=m*(v*x+y*C*T)+d*(v*C-y*x*T),b=m*(C*P)+d*(x*P);return{x:G,y:M,z:b}}const _r=new E,ka=new E,Ha=new E,Va=new Map,a_=1e3*60*60;function Oc(n,t,e){if(n.body){const i=ti(bt[n.body],t);e.set(i.x,i.y,i.z)}else if(n.elements){const i=jr(n.elements,t);e.set(i.x,i.y,i.z)}else e.set(0,0,0);return e}function o_(n){const e=n,i=Math.abs(1/(1/365.25-1/e)),s=e/i;return Math.max(1,s)}function l_(n,t,e,i,s,r){const a=[];for(let o=0;o<r;o++){const l=new Date(i+o/(r-1)*s*24*60*60*1e3);if(n.name==="Sun"?ka.set(0,0,0):Oc(n,l,ka),t==="Geocentric"||t==="Tychonic"){const c=e.find(h=>h.name==="Earth");Oc(c,l,Ha)}else{const c=ti(bt.SSB,l);Ha.set(c.x,c.y,c.z)}_r.subVectors(ka,Ha),a.push(new E(_r.x*$t,_r.z*$t,-_r.y*$t))}return a}function c_(n,t){return new zr(n,!1,"centripetal",.5).getPoints(t-1)}function zc(n,t){const e=n.name==="Sun",i=R.showPlanetColors,s=R.showDwarfPlanetColors,a=n.type==="dwarf"?s:i,o=8960989,l=e?n.color||16776960:a&&n.color||o,c=e?.8:a?.9:.7,h=e?.5:a?.4:.2;if(t){if(t.material.uniforms)return t.material.uniforms.uColor.value.set(l),t.material.uniforms.uOpacity.value=c,t.material.uniforms.uGlowIntensity.value=h,t.material}else return Is({color:l,opacity:c,useGradient:!0,glowIntensity:h});return t.material}function vo(n,t,e,i){const s=R.coordinateSystem;if(n.parent&&t.rotation.copy(n.parent.rotation),s==="Heliocentric"){n.visible=!0,t.visible=!1,n.children.forEach(l=>{const c=e.some(u=>u.data.type==="dwarf"&&l.name===u.data.name+"_Orbit"),h=e.some(u=>u.data.type!=="dwarf"&&l.name===u.data.name+"_Orbit");c?l.visible=R.showDwarfPlanetOrbits&&R.showDwarfPlanets:h?l.visible=R.showPlanetOrbits&&R.showPlanets:l.visible=!0});return}n.visible=!1,t.visible=!0;const r=e.map(l=>l.data),a=[...e];s==="Geocentric"||s==="Tychonic"?a.push({data:{name:"Sun",body:"Sun",color:16776960,period:365.25}}):s==="Barycentric"&&a.push({data:{name:"Sun",body:"Sun",color:16776960,period:12*365.25}});const o=R.date.getTime();a.forEach(l=>{var T;const c=l.data;let h=!0;c.type==="dwarf"?h=R.showDwarfPlanetOrbits&&R.showDwarfPlanets:c.name==="Sun"?h=R.showSunOrbits&&R.showSun:h=R.showPlanetOrbits&&R.showPlanets,(s==="Geocentric"||s==="Tychonic")&&c.name==="Earth"&&(h=!1),s==="Tychonic"&&c.name!=="Sun"&&(h=!1);let u=t.getObjectByName(c.name+"_Trail");if(!h){u&&(u.visible=!1);return}const f=c.period||730,p=o_(f),_=Math.max(50,Math.min(Math.ceil(p*(s==="Geocentric"?25:15)),3e3)),m=Math.max(300,Math.min(Math.ceil(p*50),6e3)),d=c.name+"_"+s,y=Va.get(d)||0,x=Math.abs(o-y)>a_,C=!u||(((T=u.geometry.attributes.position)==null?void 0:T.count)||0)<m;if(C){u&&(u.geometry.dispose(),u.material.dispose&&u.material.dispose(),t.remove(u));const P=new Zt,G=new Float32Array(m*3),M=new Float32Array(m);P.setAttribute("position",new ue(G,3)),P.setAttribute("progress",new ue(M,1));const b=zc(c,null);u=new qe(P,b),u.name=c.name+"_Trail",u.frustumCulled=!1,u.userData.keyPointCount=_,u.userData.renderPointCount=m,u.userData.bodyData=c,t.add(u),Va.set(d,0)}else zc(c,u);if(u.visible=!0,u.geometry.setDrawRange(0,m),x||C){const P=f/2,G=o-P*24*60*60*1e3,M=l_(c,s,r,G,f,_),b=c_(M,m),O=u.geometry.attributes.position.array;for(let $=0;$<b.length;$++)O[$*3]=b[$].x,O[$*3+1]=b[$].y,O[$*3+2]=b[$].z;u.geometry.attributes.position.needsUpdate=!0,Va.set(d,o),R.debug&&console.log(`${c.name}: ${_} key pts → ${m} render pts (${p.toFixed(1)} loops)`)}h_(u,m)}),s==="Tychonic"&&(n.visible=!0,t.visible=!0)}function h_(n,t){if(!n||!n.geometry)return;const e=n.geometry.getAttribute("progress");if(!e)return;const i=Math.min(e.count,t),s=e.array,r=Math.floor(i*.5);for(let a=0;a<i;a++){const o=(r-a+i)%i;s[a]=o/i}e.needsUpdate=!0}class u_{constructor(){this.dock=document.createElement("div"),this.dock.className="menu-dock",document.body.appendChild(this.dock),this.items=new Map}addItem(t,e,i,s){if(this.items.has(t)){const a=this.items.get(t);this.dock.removeChild(a),this.items.delete(t)}const r=document.createElement("div");r.className="dock-item",r.title=i,r.innerHTML=`<span class="dock-icon">${e}</span>`,r.addEventListener("click",()=>{s(),this.updateActiveState(t)}),this.dock.appendChild(r),this.items.set(t,r)}updateActiveState(t){}setActive(t,e){const i=this.items.get(t);i&&(e?i.classList.add("active"):i.classList.remove("active"))}}const Ci=new u_;function su(n,t){if(t)if(n==="Ecliptic"){const i=oe.degToRad(23.43928);t.rotation.x=-i}else t.rotation.x=0}function d_(n,t,e,i,s,r,a,o,l){const c=n.addFolder("Visual"),h=c.add(R,"gamma",.1,5).name("Gamma").onChange(u=>{e&&(e.toneMappingExposure=u)});h.domElement.classList.add("hide-value"),h.domElement.classList.add("full-width"),c.add(R,"objectInfoMode",{Tooltips:"tooltip",Window:"window",Off:"off"}).name("Object Info"),l&&c.add(l,"dock").name("Show Dock").onChange(u=>{Ci.dock.style.display=u?"flex":"none"}),c.close()}function ms(n,t,e){t.forEach(i=>{i.data.type!=="dwarf"?i.orbitLine&&(i.orbitLine.visible=R.showPlanetOrbits&&R.showPlanets):i.orbitLine&&(i.orbitLine.visible=R.showDwarfPlanetOrbits&&R.showDwarfPlanets),i.moons.forEach(s=>{if(s.data.orbitLine){let r=!1;(s.data.category==="largest"&&R.showLargestMoons||s.data.category==="major"&&R.showMajorMoons||s.data.category==="small"&&R.showSmallMoons)&&(r=!0),s.data.category||(r=!0),s.data.orbitLine.visible=R.showMoonOrbits&&r}})}),e&&(e.domElement.style.display=R.showMoonOrbits?"":"none")}function ru(n,t,e){t.axisLine&&(t.axisLine.visible=n),e.forEach(i=>{i.data.axisLine&&(i.data.axisLine.visible=n),i.moons.forEach(s=>{s.data.axisLine&&(s.data.axisLine.visible=n)})})}function Lr(n,t){const e=R.showZodiacs,i=R.showAsterisms;if(n){n.visible=e||i;const s=e?7842542:12307694;n.children.forEach(r=>{r.material&&(r.material.color.setHex(s),r.material.opacity=e?.45:.35)})}t&&(t.visible=i)}function f_(n){n&&(n.visible=R.showConstellations)}function au(n,t){t&&(t.visible=n)}function ou(n,t){t&&(t.visible=n)}function lu(n,t,e,i){t&&(t.visible=n,e.forEach(s=>{s.mesh.children.forEach(r=>{r.type==="Group"&&r.children.length>0&&r.children[0].type==="Line"&&(r.visible=n)}),s.moons.forEach(r=>{r.mesh.children.forEach(a=>{a.type==="Group"&&a.children.length>0&&a.children[0].type==="Line"&&(a.visible=n)})})}))}function cu(n){const t=R.planetScale*Ai;let e=1;R.capMagneticFields&&t>100&&(e=100/t),n.forEach(i=>{const s=i.mesh.getObjectByName("MagneticField");s&&s.scale.setScalar(e),i.moons.forEach(r=>{const a=r.mesh.getObjectByName("MagneticField");a&&a.scale.setScalar(e)})})}function hu(n,t){t.visible=n}function uu(n,t){t.forEach(e=>{e.data.type!=="dwarf"&&(e.mesh.visible=n,e.data.cloudMesh&&(e.data.cloudMesh.visible=n),e.orbitLine&&(e.orbitLine.visible=n&&R.showPlanetOrbits),e.group.children.forEach(i=>{i!==e.mesh&&i!==e.orbitLinesGroup&&i.type==="Mesh"&&(i.userData.isMoon||(i.visible=n))}))})}function du(n,t){t.forEach(e=>{e.data.type==="dwarf"&&(e.group.visible=n,e.orbitLine&&(e.orbitLine.visible=n&&R.showDwarfPlanetOrbits))})}function Mr(n,t,e){t.forEach(i=>{i.moons.forEach(s=>{s.data.category===e&&(s.mesh.visible=n,s.data.orbitLine&&(s.data.orbitLine.visible=n&&R.showMoonOrbits))})})}function p_(n,t,e){const i=[{configKey:"showSun",label:"Sun",icon:"☀️",updateFn:r=>hu(r,e)},{configKey:"showPlanets",label:"Planets",icon:"🪐",updateFn:r=>uu(r,t)},{configKey:"showDwarfPlanets",label:"Dwarf Planets",icon:"🪨",updateFn:r=>du(r,t)},{configKey:"showLargestMoons",label:"Largest Moons",icon:"🌕",updateFn:r=>Mr(r,t,"largest")},{configKey:"showMajorMoons",label:"Major Moons",icon:"🌖",updateFn:r=>Mr(r,t,"major")},{configKey:"showSmallMoons",label:"Small Moons",icon:"🥔",updateFn:r=>Mr(r,t,"small")}],s=document.createElement("div");s.className="object-list",i.forEach(r=>{const a=document.createElement("div");a.className="object-item",R[r.configKey]&&a.classList.add("active"),a.innerHTML=`
        <div class="object-icon">${r.icon}</div>
        <div class="object-label">${r.label}</div>
    `,a.addEventListener("click",()=>{R[r.configKey]=!R[r.configKey];const o=R[r.configKey];o?a.classList.add("active"):a.classList.remove("active"),r.updateFn(o)}),s.appendChild(a)}),n.appendChild(s)}function m_(n,t,e,i,s){const r=[{configKey:"showConstellations",label:"Constellations",icon:"🌐",updateFn:()=>f_(s)},{configKey:"showAsterisms",label:"Asterisms",icon:"☆",updateFn:()=>Lr(t,e)},{configKey:"showZodiacs",label:"Zodiacs",icon:"⁂",updateFn:()=>Lr(t,e)},{configKey:"showZodiacSigns",label:"Zodiac Signs",icon:"🦁",updateFn:o=>au(o,i)}],a=document.createElement("div");a.className="object-list",r.forEach(o=>{const l=document.createElement("div");l.className="object-item",R[o.configKey]&&l.classList.add("active"),l.innerHTML=`
        <div class="object-icon">${o.icon}</div>
        <div class="object-label">${o.label}</div>
    `,l.addEventListener("click",()=>{R[o.configKey]=!R[o.configKey];const c=R[o.configKey];c?l.classList.add("active"):l.classList.remove("active"),o.updateFn(c)}),a.appendChild(l)}),n.appendChild(a),n.appendChild(a)}function g_(n,t,e,i){const s=[{configKey:"showSunOrbits",label:"Sun",icon:"☀️",updateFn:()=>ms(t,e,null)},{configKey:"showPlanetOrbits",label:"Planets",icon:"🪐",updateFn:()=>ms(t,e,null),childToggle:{configKey:"showPlanetColors",label:"Colors",updateFn:()=>Bc(t,i,e)}},{configKey:"showDwarfPlanetOrbits",label:"Dwarf Planets",icon:"🪨",updateFn:()=>ms(t,e,null),childToggle:{configKey:"showDwarfPlanetColors",label:"Colors",updateFn:()=>Bc(t,i,e)}},{configKey:"showMoonOrbits",label:"Moons",icon:"🌕",updateFn:()=>ms(t,e,null),childToggle:{configKey:"capMoonOrbits",label:"Cap",updateFn:()=>{}}}],r=document.createElement("div");r.className="object-list",s.forEach(a=>{const o=document.createElement("div");o.className="object-item",R[a.configKey]&&o.classList.add("active");const l=document.createElement("div");l.style.display="flex",l.style.alignItems="center",l.style.flexGrow="1",l.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,o.appendChild(l);let c=null;a.childToggle&&(c=document.createElement("div"),c.className="object-toggle",R[a.childToggle.configKey]&&c.classList.add("active"),c.textContent=a.childToggle.label,c.style.display=R[a.configKey]?"flex":"none",c.addEventListener("click",h=>{h.stopPropagation(),R[a.childToggle.configKey]=!R[a.childToggle.configKey],R[a.childToggle.configKey]?c.classList.add("active"):c.classList.remove("active"),a.childToggle.updateFn&&a.childToggle.updateFn()}),o.appendChild(c)),l.addEventListener("click",()=>{R[a.configKey]=!R[a.configKey],R[a.configKey]?(o.classList.add("active"),c&&(c.style.display="flex")):(o.classList.remove("active"),c&&(c.style.display="none")),a.updateFn()}),r.appendChild(o)}),n.appendChild(r)}function __(n,t,e,i){const s=[{configKey:"showSunMagneticFieldBasic",label:"Sun",icon:"🔆",updateFn:()=>{if(i){const a=i.children.find(o=>o.name==="SunMagneticFieldBasic");a&&(a.visible=R.showSunMagneticFieldBasic)}}},{configKey:"showSunMagneticField",label:"Solar Wind",icon:"🌬️",updateFn:()=>{if(i){const a=i.children.find(o=>o.name==="MagneticField");a&&(a.visible=R.showSunMagneticField)}},childToggle:{configKey:"showSunMagneticFieldBasic",label:"Basic",updateFn:()=>{if(i){const a=i.children.find(o=>o.name==="SunMagneticFieldBasic");a&&(a.visible=R.showSunMagneticFieldBasic)}}}},{configKey:"showMagneticFields",label:"Planets, Moons",icon:"🧲",updateFn:()=>lu(R.showMagneticFields,t,e),childToggle:{configKey:"capMagneticFields",label:"Cap",updateFn:()=>cu(e)}}],r=document.createElement("div");r.className="object-list",s.forEach(a=>{const o=document.createElement("div");o.className="object-item",R[a.configKey]&&o.classList.add("active");const l=document.createElement("div");l.style.display="flex",l.style.alignItems="center",l.style.flexGrow="1",l.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,o.appendChild(l);let c=null;a.childToggle&&(c=document.createElement("div"),c.className="object-toggle",R[a.childToggle.configKey]&&c.classList.add("active"),c.textContent=a.childToggle.label,c.style.display=R[a.configKey]?"flex":"none",c.addEventListener("click",h=>{h.stopPropagation(),R[a.childToggle.configKey]=!R[a.childToggle.configKey],R[a.childToggle.configKey]?c.classList.add("active"):c.classList.remove("active"),a.childToggle.updateFn&&a.childToggle.updateFn()}),o.appendChild(c)),l.addEventListener("click",()=>{R[a.configKey]=!R[a.configKey],R[a.configKey]?(o.classList.add("active"),c&&(c.style.display="flex")):(o.classList.remove("active"),c&&(c.style.display="none")),a.updateFn()}),r.appendChild(o)}),n.appendChild(r)}function v_(n,t,e,i){const s=[{configKey:"showAxes",label:"Axes",icon:"📏",updateFn:a=>ru(a,t,e)},{configKey:"showHabitableZone",label:"Habitable Zone",icon:"🟢",updateFn:a=>ou(a,i)}],r=document.createElement("div");r.className="object-list",s.forEach(a=>{const o=document.createElement("div");o.className="object-item",R[a.configKey]&&o.classList.add("active"),o.innerHTML=`
        <div class="object-icon">${a.icon}</div>
        <div class="object-label">${a.label}</div>
    `,o.addEventListener("click",()=>{R[a.configKey]=!R[a.configKey];const l=R[a.configKey];l?o.classList.add("active"):o.classList.remove("active"),a.updateFn(l)}),r.appendChild(o)}),n.appendChild(r)}function Bc(n,t,e){const i=R.showPlanetColors,s=R.showDwarfPlanetColors,r=8960989;n.children.forEach(a=>{const o=a.name.replace("_Orbit",""),l=e.find(c=>c.data.name===o);if(l){const h=l.data.type==="dwarf"?s:i,u=h&&l.data.color||r,f=h?.9:.7;Pc(a.material,u,f),a.material.uniforms&&a.material.uniforms.uGlowIntensity&&(a.material.uniforms.uGlowIntensity.value=h?.4:.2)}}),t.children.forEach(a=>{const o=a.name.replace("_Trail","");if(o==="Sun")return;const l=e.find(c=>c.data.name===o);if(l){const h=l.data.type==="dwarf"?s:i,u=h&&l.data.color||r,f=h?.9:.7;Pc(a.material,u,f),a.material.uniforms&&a.material.uniforms.uGlowIntensity&&(a.material.uniforms.uGlowIntensity.value=h?.4:.2)}})}function y_(n,t){if(!n)return;const e=n.children.find(s=>s.name==="SunMagneticFieldBasic");e&&e.scale.setScalar(t);const i=n.children.find(s=>s.name==="MagneticField");i&&i.scale.setScalar(1)}class x_{constructor(t,e,i,s,r,a,o,l,c,h,u,f){this.planets=t,this.sun=e,this.orbitGroup=i,this.zodiacGroup=s,this.asterismsGroup=r,this.starsRef=a,this.camera=o,this.controls=l,this.zodiacSignsGroup=c,this.habitableZone=h,this.magneticFieldsGroup=u,this.universeGroup=f}getConfig(){return R}setSpeed(t){R.simulationSpeed=t}setDate(t){const[e,i,s]=t.split("-").map(Number),r=R.date;R.date=new Date(e,i-1,s,r.getHours(),r.getMinutes(),r.getSeconds())}focus(t){const e=t.toLowerCase();if(e==="sun"){$n({mesh:this.sun,data:{name:"Sun",radius:5},type:"sun"},this.camera,this.controls);return}for(const i of this.planets){if(i.data.name.toLowerCase()===e){$n(i,this.camera,this.controls);return}for(const s of i.moons)if(s.data.name.toLowerCase()===e){$n(s,this.camera,this.controls);return}}Ot.warn(`Object '${t}' not found.`)}exitFocus(){Ts(this.controls)}rotateToDarkSide(){const t=this.controls.target,e=this.camera,i=new E(0,0,0),s=t.clone(),r=new E().subVectors(s,i).normalize(),a=e.position.distanceTo(s),o=s.clone().add(r.multiplyScalar(a));e.position.copy(o),this.controls.update()}setReferencePlane(t){if(t!=="Equatorial"&&t!=="Ecliptic"){Ot.warn("Invalid plane. Use 'Equatorial' or 'Ecliptic'.");return}R.referencePlane=t,su(t,this.universeGroup)}setStarBrightness(t){R.starBrightness=Math.max(0,Math.min(1,t));const e=this.starsRef.value;e&&e.userData.manager&&e.userData.manager.setBrightness(R.starBrightness)}toggleOrbits(t){R.showOrbits=t,ms(t,this.orbitGroup,this.planets)}toggleAxes(t){R.showAxes=t,ru(t,this.sun,this.planets)}toggleZodiacs(t){R.showZodiacs=t,Lr(this.zodiacGroup,this.asterismsGroup)}toggleAsterisms(t){R.showAsterisms=t,Lr(this.zodiacGroup,this.asterismsGroup)}toggleZodiacSigns(t){R.showZodiacSigns=t,au(t,this.zodiacSignsGroup)}toggleHabitableZone(t){R.showHabitableZone=t,ou(t,this.habitableZone)}toggleMagneticFields(t){R.showMagneticFields=t,lu(t,this.magneticFieldsGroup,this.planets)}toggleSunMagneticFieldBasic(t){if(R.showSunMagneticFieldBasic=t,this.universeGroup){const e=this.universeGroup.children.find(i=>i.name==="SunMagneticFieldBasic");e&&(e.visible=t)}}toggleSunMagneticFieldSolarWind(t){if(R.showSunMagneticField=t,this.universeGroup){const e=this.universeGroup.children.find(i=>i.name==="MagneticField");e&&(e.visible=t)}}toggleSun(t){R.showSun=t,hu(t,this.sun)}togglePlanets(t){R.showPlanets=t,uu(t,this.planets)}toggleDwarfPlanets(t){R.showDwarfPlanets=t,du(t,this.planets)}toggleMoons(t,e){if(t==="largest")R.showLargestMoons=e;else if(t==="major")R.showMajorMoons=e;else if(t==="small")R.showSmallMoons=e;else{Ot.warn("Invalid moon category. Use 'largest', 'major', or 'small'.");return}Mr(e,this.planets,t)}}function M_(n,t=100){const e=n.map(s=>s.pos);return new zr(e).getPoints(t)}function Gc(n,t,e=null){const i=new Date(t);if(e){const a=jr(e,i);return new E(a.x,a.z,-a.y)}const s=bt[n];if(!s)return console.warn(`Body ${n} not found in Astronomy engine`),new E(0,0,0);const r=ti(s,i);return new E(r.x,r.z,-r.y)}function kc(n,t){const e=n*15*(Math.PI/180),i=t*(Math.PI/180),s=Math.cos(i)*Math.cos(e),r=Math.cos(i)*Math.sin(e),a=Math.sin(i);return new E(s,a,-r)}const Hc={"67P":{a:3.46,e:.641,i:7.04,Omega:50.1,w:12.7,M:303.7},Ulysses:{a:3.37,e:.603,i:79.1,Omega:337.2,w:22.4,M:0},Arrokoth:{a:44.58,e:.042,i:2.45,Omega:293,w:323,M:0}},S_=[{id:"voyager1",color:65535,exit:{ra:17.2,dec:12.1},waypoints:[{date:"1977-09-05",body:"Earth"},{date:"1979-03-05",body:"Jupiter"},{date:"1980-11-12",body:"Saturn"},{date:"2004-12-16",dist:94,label:"Termination Shock"},{date:"2012-08-25",dist:121,label:"Heliopause"},{date:"2024-01-01",dist:162,label:"Current"}]},{id:"voyager2",color:16711935,exit:{ra:20,dec:-60},waypoints:[{date:"1977-08-20",body:"Earth"},{date:"1979-07-09",body:"Jupiter"},{date:"1981-08-25",body:"Saturn"},{date:"1986-01-24",body:"Uranus"},{date:"1989-08-25",body:"Neptune"},{date:"2007-08-30",dist:84,label:"Termination Shock"},{date:"2018-11-05",dist:119,label:"Heliopause"},{date:"2024-01-01",dist:136,label:"Current"}]},{id:"pioneer10",color:16753920,exit:{ra:5.2,dec:26},waypoints:[{date:"1972-03-02",body:"Earth"},{date:"1973-12-04",body:"Jupiter"},{date:"1976-01-01",dist:9.5,label:"Saturn Orbit"},{date:"1983-06-13",dist:30.1,label:"Neptune Orbit"},{date:"2003-01-23",dist:80,label:"End of Comms"},{date:"2024-01-01",dist:135,label:"Current"}]},{id:"pioneer11",color:65280,exit:{ra:18.8,dec:-8},waypoints:[{date:"1973-04-06",body:"Earth"},{date:"1974-12-02",body:"Jupiter"},{date:"1979-09-01",body:"Saturn"},{date:"1995-11-24",dist:44,label:"End of Comms"},{date:"2024-01-01",dist:113,label:"Current"}]},{id:"galileo",color:16766720,waypoints:[{date:"1989-10-18",body:"Earth"},{date:"1990-02-10",body:"Venus"},{date:"1990-12-08",body:"Earth"},{date:"1991-10-29",label:"Gaspra"},{date:"1992-12-08",body:"Earth"},{date:"1993-08-28",label:"Ida"},{date:"1995-12-07",body:"Jupiter"},{date:"2003-09-21",body:"Jupiter"}]},{id:"cassini",color:35071,waypoints:[{date:"1997-10-15",body:"Earth"},{date:"1998-04-26",body:"Venus"},{date:"1999-06-24",body:"Venus"},{date:"1999-08-18",body:"Earth"},{date:"2000-12-30",body:"Jupiter"},{date:"2004-07-01",body:"Saturn"},{date:"2017-09-15",body:"Saturn"}]},{id:"newHorizons",color:16777215,exit:{ra:19.9,dec:-20},waypoints:[{date:"2006-01-19",body:"Earth"},{date:"2007-02-28",body:"Jupiter"},{date:"2015-07-14",body:"Pluto"},{date:"2019-01-01",customBody:"Arrokoth"},{date:"2024-01-01",dist:58,label:"Current"}]},{id:"parkerSolarProbe",color:16729344,waypoints:[{date:"2018-08-12",body:"Earth"},{date:"2018-10-03",body:"Venus"},{date:"2018-11-06",label:"Perihelion 1",pos:new E(.16,0,0)},{date:"2019-12-26",body:"Venus"},{date:"2020-07-11",body:"Venus"},{date:"2021-02-20",body:"Venus"},{date:"2021-10-16",body:"Venus"},{date:"2023-08-21",body:"Venus"},{date:"2024-11-06",body:"Venus"},{date:"2024-12-24",label:"Closest",pos:new E(.04,0,0)}]},{id:"juno",color:16738740,waypoints:[{date:"2011-08-05",body:"Earth"},{date:"2013-10-09",body:"Earth"},{date:"2016-07-04",body:"Jupiter"},{date:"2021-06-07",body:"Jupiter",label:"Ganymede Flyby"},{date:"2022-09-29",body:"Jupiter",label:"Europa Flyby"},{date:"2023-12-30",body:"Jupiter",label:"Io Flyby"},{date:"2024-01-01",body:"Jupiter"}]},{id:"rosetta",color:9055202,waypoints:[{date:"2004-03-02",body:"Earth"},{date:"2005-03-04",body:"Earth"},{date:"2007-02-25",body:"Mars"},{date:"2007-11-13",body:"Earth"},{date:"2008-09-05",label:"Steins"},{date:"2009-11-13",body:"Earth"},{date:"2010-07-10",label:"Lutetia"},{date:"2014-08-06",customBody:"67P"},{date:"2016-09-30",customBody:"67P"}]},{id:"ulysses",color:16776960,waypoints:[{date:"1990-10-06",body:"Earth"},{date:"1992-02-08",body:"Jupiter"},{date:"1994-06-26",customBody:"Ulysses"},{date:"1995-06-19",customBody:"Ulysses"},{date:"2000-09-08",customBody:"Ulysses"},{date:"2001-08-31",customBody:"Ulysses"},{date:"2007-02-07",customBody:"Ulysses"},{date:"2008-01-14",customBody:"Ulysses"},{date:"2009-06-30",customBody:"Ulysses"}]}],Ss={};function b_(n){return S_.forEach(t=>{const e=t.waypoints.map((l,c)=>l.body?{pos:Gc(l.body,l.date),date:new Date(l.date).getTime()}:l.customBody&&Hc[l.customBody]?{pos:Gc(null,l.date,Hc[l.customBody]),date:new Date(l.date).getTime()}:l.pos?{pos:l.pos,date:new Date(l.date).getTime()}:l.dist?{type:"exit",dist:l.dist,date:new Date(l.date).getTime()}:{type:"interpolate",date:new Date(l.date).getTime()}),i=[];for(let l=0;l<e.length;l++){const c=e[l];if(c.pos)i.push({pos:c.pos,date:c.date});else if(c.type==="exit")if(t.exit){const u=kc(t.exit.ra,t.exit.dec).multiplyScalar(c.dist);i.push({pos:u,date:c.date})}else if(t.exit){const u=kc(t.exit.ra,t.exit.dec).multiplyScalar(c.dist);i.push({pos:u,date:c.date})}else i.push({pos:new E(0,0,0),date:c.date});else if(c.type==="interpolate"){const h=i[l-1];let u=null;for(let f=l+1;f<e.length;f++)if(e[f].pos){u=e[f];break}if(h&&u){const f=u.date-h.date,g=(c.date-h.date)/f,_=new E().lerpVectors(h.pos,u.pos,g);i.push({pos:_,date:c.date})}else i.push({pos:new E(0,0,0),date:c.date})}}const s=M_(i,200),r=new Zt().setFromPoints(s.map(l=>l.multiplyScalar($t))),a=new He({color:t.color,linewidth:2,transparent:!0,opacity:.8}),o=new qe(r,a);o.visible=R.showMissions[t.id],n.add(o),Ss[t.id]=o}),Ss}function E_(){Object.keys(Ss).forEach(n=>{Ss[n]&&(Ss[n].visible=R.showMissions[n])})}function w_(n){const i=.95*$t,s=1.37*$t,r=new Br(i,s,64),a=new Ls({color:65280,side:Je,transparent:!0,opacity:.15,depthWrite:!1}),o=new Ne(r,a),l=23.4*(Math.PI/180);return o.rotation.x=-Math.PI/2+l,o.visible=!1,n.add(o),o}function Vc(n,t){if(!n.magneticField)return null;const{strength:e,tilt:i,color:s}=n.magneticField,r=new Me;r.name="MagneticField";const a=16,o=64,l=new He({color:s,transparent:!0,opacity:.3,blending:Di});for(let c=0;c<a;c++){const h=c/a*Math.PI*2;for(let u=1.5;u<=3;u+=.5){const f=[],p=u/3,g=t*e*p;for(let d=0;d<=o;d++){const y=.1+d/o*(Math.PI-.2),v=g*Math.sin(y)**2,x=v*Math.sin(y)*Math.cos(h),C=v*Math.sin(y)*Math.sin(h),T=v*Math.cos(y);f.push(new E(x,T,C))}const _=new Zt().setFromPoints(f),m=new qe(_,l);r.add(m)}}if(i){const c=i*(Math.PI/180);r.rotation.z=c}return r.visible=!1,r}function T_(n){const t=new Me;t.name="SunMagneticFieldBasic";const e=5;t.userData.timeOffset=Math.random()*1e3;const i=new Ls({color:16777130,transparent:!0,opacity:.9});i.onBeforeCompile=o=>{o.uniforms.uTime={value:0},t.userData.shaderUniforms=o.uniforms,o.vertexShader=`
      uniform float uTime;
      
      // Simplex 2D noise (Exact match to planets.js)
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
      
      ${o.vertexShader}
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
      `)};const s="/assets/textures/midres/sun.jpg",r=o=>new Promise((l,c)=>{const h=new Image;h.crossOrigin="Anonymous",h.onload=()=>{const u=document.createElement("canvas");u.width=h.width,u.height=h.height;const f=u.getContext("2d");f.drawImage(h,0,0);const p=f.getImageData(0,0,h.width,h.height);Ot.log("Sun texture loaded for magnetic fields:",h.width,h.height),l(p)},h.onerror=u=>{Ot.error("Error loading sun texture:",u),c(u)},h.src=o});return(async()=>{let o;try{o=await r(s)}catch(L){Ot.error("Failed to load sun texture for magnetic fields:",L);return}const{width:l,height:c,data:h}=o,u=new Yi(e,64,64),f=.45;let p=0;const g=u.attributes.position,_=u.attributes.uv,m=g.count;Ot.log(`[MagneticFields] Starting generation. Vertices: ${m}, Threshold: ${f}`);const d=[];for(let L=0;L<m;L++){const F=_.getX(L),I=_.getY(L);let H=Math.floor(F*l)%l;H<0&&(H+=l);let B=Math.floor((1-I)*c);B<0&&(B=0),B>=c&&(B=c-1);const j=(B*l+H)*4,W=(h[j]+h[j+1]+h[j+2])/(3*255);W>=f&&d.push({index:L,pos:new E(g.getX(L),g.getY(L),g.getZ(L)),intensity:W,uv:{u:F,v:I}})}Ot.log(`[MagneticFields] Found ${d.length} valid seeds.`);for(let L=d.length-1;L>0;L--){const F=Math.floor(Math.random()*(L+1));[d[L],d[F]]=[d[F],d[L]]}const y=new Set,v=.1*e,x=L=>{const F=Math.floor(L.x/v),I=Math.floor(L.y/v),H=Math.floor(L.z/v);return`${F},${I},${H}`},C=e*.1,T=e*.5,P=200;let G=0;for(let L=0;L<d.length&&!(p>=P);L++){const F=d[L];let I=null;for(let ot=1;ot<50;ot++){const It=(L+ot)%d.length,U=d[It],Tt=F.pos.distanceTo(U.pos);if(Tt>C&&Tt<T){I=U;break}}if(!I)continue;const H=F.pos,B=I.pos,j=H.clone().add(B).multiplyScalar(.5).normalize(),K=H.distanceTo(B)*(.5+Math.random()*.5),Q=j.multiplyScalar(e+K),k=[],Z=16;let nt=!1;for(let ot=0;ot<=Z;ot++){const It=ot/Z,U=H.clone().lerp(Q,It),Tt=Q.clone().lerp(B,It),lt=U.lerp(Tt,It),pt=x(lt);if(y.has(pt)){nt=!0;break}k.push(lt)}if(nt){G++;continue}for(const ot of k)y.add(x(ot));const dt=new zr(k),gt=.008+Math.random()*.007,Et=new Lo(dt,Z,gt,4,!1),z=new Ne(Et,i);t.add(z),p++}Ot.log(`[MagneticFields] Created ${p} loops. Rejected ${G} due to collision.`);const M=250,b=new He({color:16724787,transparent:!0,opacity:.6}),O=new He({color:3407667,transparent:!0,opacity:.6});let $=0;const J=[...d];for(let L=J.length-1;L>0;L--){const F=Math.floor(Math.random()*(L+1));[J[L],J[F]]=[J[F],J[L]]}for(let L=0;L<J.length&&!($>=M);L++){const I=J[L].pos,B=Math.asin(I.y/e)*(180/Math.PI);if(!(Math.abs(B)>30)&&Math.random()<.9)continue;const Q=B>=0?O:b,k=[],Z=5+Math.random()*10,nt=20,dt=.2;for(let z=0;z<=nt;z++){const ot=z/nt,It=e+ot*Z,U=Math.sin(ot*10)*.1*ot,Tt=I.clone().normalize(),lt=new E(0,1,0);Tt.applyAxisAngle(lt,ot*dt);const pt=Tt.multiplyScalar(It);pt.x+=U,k.push(pt)}const gt=new Zt().setFromPoints(k),Et=new qe(gt,Q);t.add(Et),$++}})(),t.visible=!1,t}function A_(n){const t=new Me;t.name="MagneticField";const e=100,i=100,s=e*i,r=new Float32Array(s*3),a=new Float32Array(s),o=new Float32Array(s);for(let m=0;m<e;m++)for(let d=0;d<i;d++){const y=m*i+d;r[y*3]=0,r[y*3+1]=0,r[y*3+2]=0,a[y]=m,o[y]=d/(i-1)}const l=new Zt;l.setAttribute("position",new ue(r,3)),l.setAttribute("lineIndex",new ue(a,1)),l.setAttribute("segmentRatio",new ue(o,1));const c=new Ui({uniforms:{uTime:{value:0},uColor:{value:new Yt(16776960)},uSunRadius:{value:5}},vertexShader:`
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
    `,transparent:!0,depthWrite:!1,blending:Di}),h=new Float32Array(e*(i-1)*2*3),u=new Float32Array(e*(i-1)*2),f=new Float32Array(e*(i-1)*2);let p=0;for(let m=0;m<e;m++)for(let d=0;d<i-1;d++)u[p]=m,f[p]=d/(i-1),p++,u[p]=m,f[p]=(d+1)/(i-1),p++;const g=new Zt;g.setAttribute("position",new ue(h,3)),g.setAttribute("lineIndex",new ue(u,1)),g.setAttribute("segmentRatio",new ue(f,1));const _=new kh(g,c);return _.frustumCulled=!1,t.add(_),t.userData.material=c,t}function Wc(n){return!n||!n.period?null:(n.period/365.25)**(2/3)}function C_(n){const t=new Yi(n.radius,32,32),e=new Wn({color:n.color});n.texture&&Qn.loadTexture(n.texture,e,n.name,!0,n.category);const i=new Ne(t,e);if(i.castShadow=!0,i.receiveShadow=!0,i.userData.isMoon=!0,i.scale.setScalar(R.planetScale),n.axialTilt!==void 0&&!n.tidallyLocked){const s=n.axialTilt*Math.PI/180;i.rotation.z=s}return i}function P_(n,t){const e=t.radius*2.5,i=new Zt().setFromPoints([new E(0,-e,0),new E(0,e,0)]),s=new He({color:16777215,transparent:!0,opacity:.5}),r=new qe(i,s);r.visible=R.showAxes,r.raycast=()=>{},n.add(r),t.axisLine=r}function zo(n,t){if(!n.orbitLine)return;const e=[],i=90,s=t,r=n.period||27.3;for(let a=0;a<i;a++){const o=new Date(s.getTime()+a/i*r*24*60*60*1e3);let l,c,h;if(n.type==="jovian"){const u=_o(o),f=[u.io,u.europa,u.ganymede,u.callisto][n.moonIndex];l=f.x,c=f.y,h=f.z}else if(n.type==="real"){const u=Ps(bt[n.body],o,!0);l=u.x,c=u.y,h=u.z}else return;e.push(new E(l*$t,h*$t,-c*$t))}n.orbitLine.geometry.setFromPoints(e),n.lastOrbitUpdate=t.getTime()}function R_(n,t){const e=new Zt,i=Is({color:8960989,opacity:.6,useGradient:!0,glowIntensity:.2}),s=new Or(e,i);if(t.add(s),n.orbitLine=s,zo(n,new Date),s.geometry.attributes.position){const r=s.geometry.attributes.position.count,a=$r(r,0);s.geometry.setAttribute("progress",new ue(a,1))}}function L_(n,t){const e=[],i=n.distance*$t,s=64;for(let c=0;c<s;c++){const h=c/s*Math.PI*2;e.push(new E(Math.cos(h)*i,0,Math.sin(h)*i))}n._orbitBasePoints=e;const r=new Zt().setFromPoints(e),a=$r(s,0);r.setAttribute("progress",new ue(a,1));const o=Is({color:8960989,opacity:.6,useGradient:!0,glowIntensity:.2}),l=new Or(r,o);t.add(l),n.orbitLine=l}function D_(n,t){const e=new Zt,i=Is({color:8960989,opacity:.6,useGradient:!0,glowIntensity:.2}),s=new Or(e,i);if(t.add(s),n.orbitLine=s,zo(n,new Date),s.geometry.attributes.position){const r=s.geometry.attributes.position.count,a=$r(r,0);s.geometry.setAttribute("progress",new ue(a,1))}}function I_(n,t,e){const i=[];return n.moons&&n.moons.forEach(s=>{const r=C_(s);P_(r,s),t.add(r),n.name==="Earth"?r.layers.set(1):r.layers.set(0),s.type==="jovian"?R_(s,e):s.type==="simple"?L_(s,e):D_(s,e);let a=!1;(s.category==="largest"&&R.showLargestMoons||s.category==="major"&&R.showMajorMoons||s.category==="small"&&R.showSmallMoons)&&(a=!0),s.category||(a=!0),r.visible=a,s.orbitLine&&(s.orbitLine.visible=a),i.push({mesh:r,data:s})}),i}function U_(n,t){if(!n.moons)return;const e=R.planetScale*Ai;let i=null,s=null;if(R.capMoonOrbits){i=n.data.radius*R.planetScale*1.1;let c=1/0,h=1/0;const u=Wc(n.data);if(u){t.forEach(p=>{if(p===n)return;const g=Wc(p.data);if(!g)return;const _=g-u;if(_>0)_<c&&(c=_);else{const m=Math.abs(_);m<h&&(h=m)}});const f=Math.min(c,h);f!==1/0&&(s=f/2*$t)}i&&s&&i>s&&(s=i)}const r=[];n.moons.forEach(l=>{let c;if(l.data.type==="jovian"){const h=_o(R.date),u=[h.io,h.europa,h.ganymede,h.callisto][l.data.moonIndex];c=Math.sqrt(u.x**2+u.y**2+u.z**2)*$t*e}else if(l.data.type==="real"){const h=Ps(bt[l.data.body],R.date,!0);c=Math.sqrt(h.x**2+h.y**2+h.z**2)*$t*e}else c=l.data.distance*$t*e;r.push(c)});let a=1,o=0;if(R.capMoonOrbits&&i&&s&&r.length>0){const l=Math.min(...r),c=Math.max(...r);if(c>s||l<i){const h=c-l,u=s-i;if(h>1e-4)a=u/h,o=i-l*a;else{const f=(i+s)/2;a=0,o=f}}}n.moons.forEach(l=>{let c,h,u;if(l.data.type==="jovian"){const f=_o(R.date),p=[f.io,f.europa,f.ganymede,f.callisto][l.data.moonIndex],g=Math.sqrt(p.x**2+p.y**2+p.z**2),d=(g*$t*e*a+o)/(g*$t);l.data.orbitLine&&l.data.orbitLine.scale.setScalar(d),c=p.x*$t*d,u=-p.y*$t*d,h=p.z*$t*d}else if(l.data.type==="real"){const f=Ps(bt[l.data.body],R.date,!0),p=Math.sqrt(f.x**2+f.y**2+f.z**2),m=(p*$t*e*a+o)/(p*$t);l.data.orbitLine&&l.data.orbitLine.scale.setScalar(m),c=f.x*$t*m,u=-f.y*$t*m,h=f.z*$t*m}else{const f=l.data.distance,g=f*$t*e*a+o,_=g/(f*$t),m=new Date(2e3,0,1).getTime(),v=(R.date.getTime()-m)/(24*60*60*1e3)*2*Math.PI/l.data.period;l.data.orbitLine&&l.data.orbitLine.scale.setScalar(_);const x=g;c=Math.cos(v)*x,u=Math.sin(v)*x,h=0}if(l.mesh.position.x=n.mesh.position.x+c,l.mesh.position.z=n.mesh.position.z+u,l.mesh.position.y=n.mesh.position.y+h,l.data.tidallyLocked&&(l.mesh.rotation.y=Math.atan2(c,u)+Math.PI),l.data.type!=="simple"&&l.data.orbitLine){const f=R.date.getTime(),p=l.data.lastOrbitUpdate||0,g=Math.abs(f-p),_=24*60*60*1e3;g>_&&zo(l.data,R.date)}fu(l.data.orbitLine,l.mesh.position,n.mesh.position)})}function fu(n,t,e){if(!n||!n.geometry)return;const i=n.geometry,s=i.getAttribute("position"),r=i.getAttribute("progress");if(!s||!r)return;const a=s.count,o=r.array,l=t.x-e.x,c=t.y-e.y,h=t.z-e.z,u=n.scale.x||1;let f=1/0,p=0;for(let g=0;g<a;g++){const _=s.getX(g)*u,m=s.getY(g)*u,d=s.getZ(g)*u,y=_-l,v=m-c,x=d-h,C=y*y+v*v+x*x;C<f&&(f=C,p=g)}for(let g=0;g<a;g++){const _=(p-g+a)%a;o[g]=_/a}r.needsUpdate=!0}function F_(n){n.forEach(t=>{t.moons&&t.moons.forEach(e=>{e.data.orbitLine&&fu(e.data.orbitLine,e.mesh.position,t.mesh.position)})})}class N_{constructor(){this.audio=new Audio,this.tracks=[],this.currentTrackIndex=-1,this.isPlaying=!1,this.initialized=!1,this.playHistory=[],this.handleTrackEnded=this.handleTrackEnded.bind(this),this.audio.addEventListener("ended",this.handleTrackEnded)}async init(){if(!this.initialized)try{const t=await fetch("assets/music/tracks.json");this.tracks=await t.json(),this.initialized=!0,Ot.log("Music system initialized with tracks:",this.tracks),R.music.playlist.length===0&&(R.music.playlist=this.tracks.map(e=>e.id)),Ot.log("Music ready. Click play button to start.")}catch(t){Ot.error("Failed to initialize music system:",t)}}setEnabled(t){R.music.enabled=t,t?this.audio.paused&&(this.audio.src?(this.audio.play().catch(e=>Ot.warn("Audio play failed:",e)),this.isPlaying=!0):this.playNext()):(this.audio.pause(),this.isPlaying=!1)}setPlaylist(t){R.music.playlist=t,R.music.enabled&&!this.isPlaying&&t.length>0&&this.playNext()}setVolume(t){this.audio.volume=t,R.music.volume=t,t>0&&!R.music.enabled?this.setEnabled(!0):t===0&&R.music.enabled&&this.setEnabled(!1)}playNext(){var i;if(!R.music.enabled||R.music.playlist.length===0){this.audio.pause(),this.isPlaying=!1;return}const t=this.tracks.filter(s=>R.music.playlist.includes(s.id));if(t.length===0)return;let e;if(R.music.shuffle){const s=Math.floor(Math.random()*t.length);e=t[s]}else{const s=(i=this.tracks[this.currentTrackIndex])==null?void 0:i.id,r=t.findIndex(a=>a.id===s);e=t[(r+1)%t.length]}if(this.currentTrackIndex!==-1){const s=this.tracks[this.currentTrackIndex];s&&(this.playHistory.push(s.id),this.playHistory.length>50&&this.playHistory.shift())}this.currentTrackIndex=this.tracks.findIndex(s=>s.id===e.id),this.currentTrackIndex!==-1&&this.loadAndPlay(this.tracks[this.currentTrackIndex],!0)}playPrevious(){if(this.playHistory.length>0){const t=this.playHistory.pop(),e=this.tracks.findIndex(i=>i.id===t);if(e!==-1){this.currentTrackIndex=e;const i=this.tracks[this.currentTrackIndex];this.loadAndPlay(i,!0);return}}Ot.log("No previous track in history")}loadAndPlay(t){const e="ogg";this.audio.src=`assets/music/${e}/${encodeURIComponent(t.filename)}.${e}`,this.audio.volume=R.music.volume,R.music.currentTrackName=t.title.replace(/ \[(Lyrics|Instrumental)\]/g,""),Ot.log(`Now playing: ${t.title}`),this.audio.play().then(()=>{this.isPlaying=!0}).catch(i=>{Ot.warn("Playback failed (likely autoplay blocked):",i),this.isPlaying=!1})}handleTrackEnded(){this.playNext()}}const Xe=new N_;function O_(n,t){if(!n.body&&!n.elements)return null;const e=[],i=360,s=new Date,r=n.period||365;for(let _=0;_<i;_++){const m=new Date(s.getTime()+_/i*r*24*60*60*1e3);let d;n.body?d=ti(bt[n.body],m):n.elements&&(d=jr(n.elements,m)),e.push(new E(d.x*$t,d.z*$t,-d.y*$t))}const a=new Zt().setFromPoints(e),o=$r(i,0);a.setAttribute("progress",new ue(o,1));const l=R.showPlanetColors,c=R.showDwarfPlanetColors,u=n.type==="dwarf"?c:l,f=u&&n.color||8960989,p=Is({color:f,opacity:u?.9:.6,useGradient:!0,glowIntensity:u?.4:.2}),g=new Or(a,p);return g.name=n.name+"_Orbit",g.userData.steps=i,g.userData.periodDays=r,g.userData.planetData=n,t.add(g),g}function z_(n,t){if(!n||!n.geometry)return;const e=n.geometry,i=e.getAttribute("position"),s=e.getAttribute("progress");if(!i||!s)return;const r=i.count,a=s.array;let o=1/0,l=0;for(let c=0;c<r;c++){const h=i.getX(c),u=i.getY(c),f=i.getZ(c),p=h-t.x,g=u-t.y,_=f-t.z,m=p*p+g*g+_*_;m<o&&(o=m,l=c)}for(let c=0;c<r;c++){const h=(l-c+r)%r;a[c]=h/r}s.needsUpdate=!0}function B_(n,t){n.children.forEach(e=>{if(!e.userData.planetData)return;const i=e.userData.planetData.name,s=t.find(r=>r.data.name===i);s&&s.mesh&&z_(e,s.mesh.position)})}function G_(n){const t=new zh,e=new Rh(-window.innerWidth/2,window.innerWidth/2,window.innerHeight/2,-window.innerHeight/2,.1,100);e.position.z=5;let i=null;const s={active:!0,phase:"delay",startTime:0},r={initialDelay:2,flyDuration:4,startPosition:new E(0,0,0),targetPosition:new E(0,0,0),startScale:.3,endScale:1};new Io().load("./assets/images/rabbit_spaceship.png",l=>{const c=new Po({map:l,transparent:!0,opacity:1});i=new Gh(c);const h=l.image.width/l.image.height,u=200;i.scale.set(u*h,u,1),i.position.copy(r.startPosition),t.add(i),s.startTime=performance.now()/1e3},void 0,l=>{Ot.error("An error happened loading the spaceship:",l),s.active=!1});function o(){const l=window.innerWidth,c=window.innerHeight;if(e.left=-l/2,e.right=l/2,e.top=c/2,e.bottom=-c/2,e.updateProjectionMatrix(),r.startPosition.x=l/2+100,r.startPosition.y=c/2+100,r.targetPosition.x=-l/2-100,r.targetPosition.y=-c/2-100,i&&s.phase==="fly"){const u=performance.now()/1e3-s.startTime,f=Math.min(u/r.flyDuration,1);i.position.lerpVectors(r.startPosition,r.targetPosition,f)}}return window.addEventListener("resize",o),o(),{update:()=>{if(!s.active||!i)return;const l=performance.now()/1e3,c=l-s.startTime;if(s.phase==="delay")c>=r.initialDelay&&(s.phase="fly",s.startTime=l);else if(s.phase==="fly"){const h=Math.min(c/r.flyDuration,1),u=1-(1-h)**5;i.position.lerpVectors(r.startPosition,r.targetPosition,u);const f=oe.lerp(r.startScale,r.endScale,u),p=i.material.map.image.width/i.material.map.image.height,g=200;i.scale.set(g*p*f,g*f,1),h>=1&&(s.active=!1,t.remove(i),window.removeEventListener("resize",o))}},render:()=>{s.active&&(n.autoClear=!1,n.clearDepth(),n.render(t,e),n.autoClear=!0)}}}const pu={And:"Andromeda",Ant:"Antlia",Aps:"Apus",Aqr:"Aquarius",Aql:"Aquila",Ara:"Ara",Ari:"Aries",Aur:"Auriga",Boo:"Boötes",Cael:"Caelum",Cam:"Camelopardalis",Cnc:"Cancer",CVn:"Canes Venatici",CMa:"Canis Major",CMi:"Canis Minor",Cap:"Capricornus",Car:"Carina",Cas:"Cassiopeia",Cen:"Centaurus",Cep:"Cepheus",Cet:"Cetus",Cha:"Chamaeleon",Cir:"Circinus",Col:"Columba",Com:"Coma Berenices",CrA:"Corona Australis",CrB:"Corona Borealis",crv:"Corvus",Crt:"Crater",Cru:"Crux",Cyg:"Cygnus",Del:"Delphinus",Dor:"Dorado",Dra:"Draco",Equ:"Equuleus",Eri:"Eridanus",For:"Fornax",Gem:"Gemini",Gru:"Grus",Her:"Hercules",Hor:"Horologium",Hya:"Hydra",Hyi:"Hydrus",Ind:"Indus",Lac:"Lacerta",Leo:"Leo",LMi:"Leo Minor",Lep:"Lepus",Lib:"Libra",Lup:"Lupus",Lyn:"Lynx",Lyr:"Lyra",Men:"Mensa",Mic:"Microscopium",Mon:"Monoceros",Mus:"Musca",Nor:"Norma",Oct:"Octans",Oph:"Ophiuchus",Ori:"Orion",Pav:"Pavo",Peg:"Pegasus",Per:"Perseus",Phe:"Phoenix",Pic:"Pictor",Psc:"Pisces",PsA:"Piscis Austrinus",Pup:"Puppis",Pyx:"Pyxis",Ret:"Reticulum",Sge:"Sagitta",Sgr:"Sagittarius",Sco:"Scorpius",Scl:"Sculptor",Sct:"Scutum",Ser:"Serpens",Sex:"Sextans",Tau:"Taurus",Tel:"Telescopium",Tri:"Triangulum",TrA:"Triangulum Australe",Tuc:"Tucana",UMa:"Ursa Major",UMi:"Ursa Minor",Vel:"Vela",Vir:"Virgo",Vol:"Volans",Vul:"Vulpecula"};class k_{constructor(){this.windows=new Map,this.zIndexCounter=1e3,this.container=document.body,window.addEventListener("resize",()=>this._handleResize())}createWindow(t,e,i={}){if(this.windows.has(t))return this.windows.get(t);const s=document.createElement("div");s.id=t,s.className="ui-window",s.style.zIndex=this.zIndexCounter++;let r=i.x||100,a=i.y||100,o="none",l="none";const c=20;if(i.snap){if(i.snap.x==="right"){let u=300;i.width&&typeof i.width=="string"&&i.width.endsWith("px")&&(u=parseInt(i.width)),r=window.innerWidth-u-c,o="right"}else i.snap.x==="left"&&(r=c,o="left");if(i.snap.y==="bottom"){let u=400;i.height&&typeof i.height=="string"&&i.height.endsWith("px")&&(u=parseInt(i.height)),a=window.innerHeight-u-c,l="bottom"}else i.snap.y==="top"&&(a=c,l="top")}if(s.style.transform=`translate3d(${r}px, ${a}px, 0)`,i.width&&(s.style.width=i.width),i.height&&(s.style.height=i.height),s.innerHTML=`
      <div class="window-header">
        <span class="window-title">${e||""}</span>
        <div class="window-close">×</div>
      </div>
      <div class="window-content"></div>
    `,this.container.appendChild(s),l==="bottom"){const u=s.getBoundingClientRect();a=window.innerHeight-u.height-c,s.style.transform=`translate3d(${r}px, ${a}px, 0)`}if(o==="right"){const u=s.getBoundingClientRect();r=window.innerWidth-u.width-c,s.style.transform=`translate3d(${r}px, ${a}px, 0)`}const h={id:t,element:s,header:s.querySelector(".window-header"),content:s.querySelector(".window-content"),closeBtn:s.querySelector(".window-close"),x:r,y:a,snapState:{x:o,y:l},onClose:i.onClose};return this.windows.set(t,h),this._setupInteractions(h),h}getWindow(t){return this.windows.get(t)}toggleWindow(t){const e=this.windows.get(t);e&&(e.element.style.display==="none"?this.showWindow(t):this.hideWindow(t))}showWindow(t){const e=this.windows.get(t);e&&(e.element.style.display="flex",this.bringToFront(t))}hideWindow(t){const e=this.windows.get(t);e&&(e.element.style.display="none",e.onClose&&e.onClose())}bringToFront(t){const e=this.windows.get(t);e&&(e.element.style.zIndex=++this.zIndexCounter)}_setupInteractions(t){let e=!1,i,s,r,a;const o=h=>{h.target.closest("button")||h.target.closest("input")||h.target.closest(".control-btn")||h.target.closest(".speedometer-interaction")||h.target===t.closeBtn||(e=!0,i=h.clientX,s=h.clientY,r=t.x,a=t.y,this.bringToFront(t.id))},l=h=>{if(e){const u=h.clientX-i,f=h.clientY-s;let p=r+u,g=a+f;const _=20,m=20,d=t.element.offsetWidth,y=t.element.offsetHeight,v=window.innerWidth,x=window.innerHeight;let C="none",T="none";Math.abs(p-m)<_?(p=m,C="left"):Math.abs(p-(v-d-m))<_&&(p=v-d-m,C="right"),Math.abs(g-m)<_?(g=m,T="top"):Math.abs(g-(x-y-m))<_&&(g=x-y-m,T="bottom"),t.x=p,t.y=g,t.snapState={x:C,y:T},t.element.style.transform=`translate3d(${t.x}px, ${t.y}px, 0)`,h.preventDefault()}},c=()=>{e=!1};t.element.addEventListener("mousedown",o),document.addEventListener("mousemove",l),document.addEventListener("mouseup",c),t.closeBtn.addEventListener("click",h=>{h.stopPropagation(),this.hideWindow(t.id)}),t.element.addEventListener("mousedown",()=>{this.bringToFront(t.id)}),this._setupResizeObserver(t)}_setupResizeObserver(t){const e=new ResizeObserver(i=>{for(const s of i){const r=t.element.offsetWidth,a=t.element.offsetHeight,o=window.innerWidth,l=window.innerHeight,c=20;let h=!1;t.snapState.x==="right"&&(t.x=o-r-c,h=!0),t.snapState.y==="bottom"&&(t.y=l-a-c,h=!0),h&&(t.element.style.transform=`translate3d(${t.x}px, ${t.y}px, 0)`)}});e.observe(t.element),t.resizeObserver=e}_handleResize(){const e=window.innerWidth,i=window.innerHeight;for(const s of this.windows.values()){let r=!1;const a=s.element.offsetWidth,o=s.element.offsetHeight;s.snapState.x==="right"&&(s.x=e-a-20,r=!0),s.snapState.y==="bottom"&&(s.y=i-o-20,r=!0),s.x+a>e,r&&(s.element.style.transform=`translate3d(${s.x}px, ${s.y}px, 0)`)}}}const me=new k_,H_=10;function V_(n,t,e,i,s,r){const a=document.getElementById("tooltip"),o=me.createWindow("object-info","Object Info",{x:20,y:20,width:"300px",onClose:()=>{}});me.hideWindow("object-info");const l=o.element,c=new Fo,h=new _t;window.addEventListener("mousemove",u=>{h.x=u.clientX/window.innerWidth*2-1,h.y=-(u.clientY/window.innerHeight)*2+1;const f=u.clientX,p=u.clientY;if(u.target.closest(".lil-gui")||u.target.closest(".info-window")&&R.objectInfoMode==="window"){R.objectInfoMode==="tooltip"&&(a.style.display="none"),document.body.style.cursor="default";return}if(R.objectInfoMode==="off"){a.style.display="none",l.style.display="none",document.body.style.cursor="default";return}let g=null;const _=[e];t.forEach(d=>{if(_.push(d.mesh),d.moons)for(const y of d.moons)_.push(y.mesh)}),c.setFromCamera(h,n);const m=c.intersectObjects(_,!0);if(m.length>0){const d=m[0],y=W_(d.object,t,e);y&&(g=y)}if(!g){const d=Q_(f,p,n,t,e);d&&(g=d)}if(!g){const d=i.value;if(d){const y=d.userData.manager,v=d.userData.starData;let x=[];y?x=y.getOctrees():d.userData.octree&&(x=[d.userData.octree]);let T=15,P=[];if(x.length>0){c.setFromCamera(h,n);const G=new kt().copy(d.matrixWorld).invert(),M=c.ray.clone().applyMatrix4(G);x.forEach(b=>{const O=b.queryRay(M,500);P.push(...O)})}else v&&(P=v.map((G,M)=>({data:G,index:M})));for(const G of P){const M=G.data;if(M.mag!==void 0&&R.magnitudeLimit!==void 0&&M.mag>R.magnitudeLimit)continue;let b;G.position?b=G.position.clone():b=new E(M.x*ye,M.z*ye,-M.y*ye),b.applyMatrix4(d.matrixWorld);const O=b.clone().project(n);if(O.z<1&&O.z>-1){const $=(O.x*.5+.5)*window.innerWidth,J=(-(O.y*.5)+.5)*window.innerHeight,L=f-$,F=p-J,I=Math.sqrt(L*L+F*F);I<T&&(T=I,g={data:M,type:"star"})}}}}if(!g){const d=[];s!=null&&s.visible&&d.push(s),r!=null&&r.visible&&d.push(r);let y=H_;d.forEach(v=>{v.children.forEach(x=>{if(!x.isLine)return;const C=x.geometry.attributes.position,T=new E,P=new E;for(let G=0;G<C.count-1;G++){T.fromBufferAttribute(C,G),P.fromBufferAttribute(C,G+1),T.applyMatrix4(x.matrixWorld),P.applyMatrix4(x.matrixWorld);const M=T.clone().project(n),b=P.clone().project(n);if(M.z<-1||M.z>1||b.z<-1||b.z>1)continue;const O=(M.x*.5+.5)*window.innerWidth,$=(-(M.y*.5)+.5)*window.innerHeight,J=(b.x*.5+.5)*window.innerWidth,L=(-(b.y*.5)+.5)*window.innerHeight,F=J_(f,p,O,$,J,L);F<y*y&&(y=Math.sqrt(F),g={type:"asterism",data:x.userData})}})})}if(g){document.body.style.cursor="pointer";const d=K_(g);if(R.objectInfoMode==="tooltip"){a.innerHTML=d,a.style.display="block",l.style.display="none";const y=a.offsetWidth,v=a.offsetHeight,x=15;let C=f+x,T=p+x;C+y>window.innerWidth&&(C=f-y-x),T+v>window.innerHeight&&(T=p-v-x),C<0&&(C=x),T<0&&(T=x),a.style.left=`${C}px`,a.style.top=`${T}px`}else if(R.objectInfoMode==="window"){a.style.display="none";const y=me.getWindow("object-info");if(!(y&&y.element.style.display!=="none"))return;o.content.innerHTML=d;let v="Object Info";g.type==="planet"||g.type==="moon"?v=g.data.name:g.type==="sun"?v="Sun":g.type==="star"?v=g.data.name||`HD ${g.data.id}`:g.type==="asterism"&&(v=g.data.id),o.header.querySelector(".window-title").textContent=v}}else a.style.display="none",R.objectInfoMode,document.body.style.cursor="default"})}function W_(n,t,e){if(n.userData&&n.userData.type==="asterism")return{type:"asterism",data:n.userData};if(n===e||n.parent===e)return{type:"sun",data:{}};for(const i of t){if(i.mesh===n||i.mesh===n.parent)return{type:"planet",data:i.data,worldPos:i.mesh.position};if(i.moons){for(const s of i.moons)if(s.mesh===n||s.mesh===n.parent)return{type:"moon",data:s.data,parentName:i.data.name}}}return null}function Us(n,t,e=null){let i='<div class="tooltip-container">';return i+=`<div class="tooltip-header">${n}</div>`,i+='<div class="tooltip-content">',t.length>0&&t.forEach(s=>{i+=`
        <div class="tooltip-row">
          <span class="tooltip-label">${s.label}</span>
          <span class="tooltip-value">${s.value}</span>
        </div>`}),e&&(i+=e),i+="</div></div>",i}function X_(n){if(!n.body||!(bt!=null&&bt[n.body]))return null;try{const t=R.date instanceof Date?R.date:new Date;if(Number.isNaN(t.getTime()))return{trueAnomaly:"Invalid Date",velocity:"---",distanceAU:"---",lightTime:"---"};const e=bt[n.body],i=ti(e,t),s=Ps(e,t,!0),r=1/(24*60),a=new Date(t.getTime()-6e4),o=new Date(t.getTime()+6e4),l=ti(e,a),c=ti(e,o),h=(c.x-l.x)/(2*r),u=(c.y-l.y)/(2*r),f=(c.z-l.z)/(2*r),g=(Math.sqrt(h**2+u**2+f**2)*1495978707e-1/86400).toFixed(2),_=Math.sqrt(s.x**2+s.y**2+s.z**2),m=(_*499.00478/60).toFixed(2),d=new E(i.x,i.y,i.z),y=new E(h,u,f),v=new E().crossVectors(d,y),x=.0002959122082855911,C=new E().crossVectors(y,v),T=d.length(),P=C.clone().divideScalar(x),G=d.clone().divideScalar(T),M=P.sub(G),b=M.length();let O=0;if(b>1e-6){const J=M.dot(d)/(b*T),L=Math.max(-1,Math.min(1,J));O=Math.acos(L)*180/Math.PI,d.dot(y)<0&&(O=360-O)}else O=0;return{trueAnomaly:O.toFixed(1),velocity:g,distanceAU:_.toFixed(3),lightTime:m}}catch(t){return Ot.warn(`Error calculating live data for ${n.name}`,t),null}}function $_(){try{const n=R.date instanceof Date?R.date:new Date,t=Ps(bt.Sun,n,!0),e=Math.sqrt(t.x**2+t.y**2+t.z**2),i=(e*499.00478/60).toFixed(2);return{distanceAU:e.toFixed(3),lightTime:i}}catch(n){return Ot.warn("Error calculating live data for Sun",n),null}}function mu(n){let t='<div class="tooltip-live-section"><span class="tooltip-live-title">Live Data</span>';return n.trueAnomaly&&(t+=`<div class="tooltip-row"><span class="tooltip-label">True Anomaly</span><span class="tooltip-value">${n.trueAnomaly}°</span></div>`),n.velocity&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Helio Velocity</span><span class="tooltip-value">${n.velocity} km/s</span></div>`),n.distanceAU&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Dist to Earth</span><span class="tooltip-value">${n.distanceAU} AU</span></div>`),n.lightTime&&(t+=`<div class="tooltip-row"><span class="tooltip-label">Light Time</span><span class="tooltip-value">${n.lightTime} min</span></div>`),t+="</div>",t}function q_(){const n=[{label:"Type",value:"G-type Main Sequence Star (G2V)"},{label:"Radius",value:"696,340 km (109 x Earth)"},{label:"Mass",value:"1.989 × 10³⁰ kg (333,000 x Earth)"},{label:"Density",value:"1.41 g/cm³"},{label:"Surface Gravity",value:"28 g"},{label:"Surface Temp",value:"5,500°C"},{label:"Core Temp",value:"15,000,000°C"},{label:"Rotation",value:"~27 days (Differential)"},{label:"Age",value:"4.6 Billion Years"}],t=$_(),e=t?mu(t):null;return Us("Sun",n,e)}function yo(n,t=2){if(!n)return"0";const e=n.toExponential(t),[i,s]=e.split("e"),r=parseFloat(i),a=parseInt(s),o={0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹","-":"⁻","+":""},l=a.toString().split("").map(c=>o[c]||c).join("");return`${r} × 10${l}`}function gs(n){if(typeof n!="number")return n;const t=Math.abs(n);return t>=1e3?n.toLocaleString("en-US",{maximumFractionDigits:0}):t>=10?n.toLocaleString("en-US",{maximumFractionDigits:1}):n.toLocaleString("en-US",{maximumFractionDigits:3})}function gu(n){return n?typeof n=="string"?n:typeof n=="number"?`${(n/9.807).toFixed(2)} g`:n:"N/A"}function Y_(n){let t="Planet";n.type==="dwarf"?t="Dwarf Planet":n.category&&(t=`Planet (${n.category})`);const e=[{label:"Type",value:t}],i=n.radius*6371;let s=`${gs(i)} km`;n.name!=="Earth"&&(s+=` (${gs(n.radius)} x Earth)`);let r=n.details.mass;if(typeof n.details.mass=="number"){const c=n.details.mass/597e22;if(r=`${yo(n.details.mass)} kg`,n.name!=="Earth"){let u=`${gs(c)} x Earth`;c<.01&&(u=`${yo(c)} x Earth`),r+=` (${u})`}}n.details&&(e.push({label:"Year",value:`${gs(n.period)} days`},{label:"Radius",value:s},{label:"Mass",value:r},{label:"Density",value:n.details.density},{label:"Surface Gravity",value:gu(n.details.gravity)},{label:"Albedo",value:n.details.albedo},{label:"Surface Temp",value:n.details.temp}),e.push({label:"Surface Pressure",value:n.details.pressure}),e.push({label:"Solar Day",value:n.details.solarDay},{label:"Sidereal Day",value:n.details.siderealDay},{label:"Axial Tilt",value:`${n.axialTilt}°`},{label:"Eccentricity",value:n.details.eccentricity},{label:"Inclination",value:n.details.inclination}));const a=X_(n),o=a?mu(a):null;return Us(n.name,e,o)}function j_(n,t){const e=[{label:"Type",value:"Moon"},{label:"Orbiting",value:t||"Unknown"}];if(n.diameter&&e.push({label:"Diameter",value:`${gs(n.diameter)} km`}),n.mass){const i=yo(n.mass);e.push({label:"Mass",value:`${i} kg`})}return n.gravity&&e.push({label:"Surface Gravity",value:gu(n.gravity)}),n.meanTemp&&e.push({label:"Mean Temp",value:`${n.meanTemp} K`}),e.push({label:"Orbital Period",value:`${n.period.toFixed(2)} days`}),n.discoveryYear&&e.push({label:"Discovered",value:`${n.discoveryYear} (${n.discoveredBy})`}),Us(n.name,e)}function Z_(n){const t=n.distance?(n.distance*3.26156).toLocaleString("en-US",{maximumFractionDigits:1}):"N/A",e=n.luminosity?n.luminosity.toLocaleString("en-US",{maximumFractionDigits:2}):"N/A";let i=n.name;i||(n.hd?i=`HD ${n.hd}`:n.hip?i=`HIP ${n.hip}`:i=`HR ${n.id}`);const s=n.spectralType||"Unknown",r=[{label:"Distance",value:`${t} LY`},{label:"Type",value:s},{label:"Luminosity",value:`${e} L☉`}];if(n.constellation){const a=pu[n.constellation]||n.constellation;r.push({label:"Constellation",value:`${a} (${n.constellation})`})}if(n.temperature&&r.push({label:"Temp",value:`${Math.round(n.temperature).toLocaleString("en-US")} K`}),n.mass&&r.push({label:"Mass",value:`${n.mass.toLocaleString("en-US",{maximimumFractionDigits:2})} M☉`}),n.radius&&r.push({label:"Radius",value:`${n.radius.toLocaleString("en-US",{maximimumFractionDigits:2})} R☉`}),n.mag!==void 0)r.push({label:"Apparent Mag",value:n.mag.toFixed(2)});else if(n.luminosity&&n.distance){const o=4.83-2.5*Math.log10(n.luminosity)+5*(Math.log10(n.distance)-1);r.push({label:"Apparent Mag (Est)",value:o.toFixed(2)})}return n.hip&&r.push({label:"Hipparcos ID",value:n.hip}),n.hd&&r.push({label:"HD ID",value:n.hd}),!n.hip&&!n.hd&&r.push({label:"Catalog ID",value:n.id}),Us(i,r)}function Xc(n){const t=n.id,e=pu[t]||t,i=[{label:"Code",value:t},{label:"Full Name",value:e}];return n.type==="constellation"?i.push({label:"Type",value:"Constellation Boundary"}):i.push({label:"Type",value:"Asterism"}),Us(e,i)}function K_(n){try{const t=n.data;switch(n.type){case"sun":return q_();case"planet":return Y_(t);case"moon":return j_(t,n.parentName);case"star":return Z_(t);case"constellation":return Xc(t);case"asterism":return Xc(t);default:return""}}catch(t){return Ot.error("Error formatting tooltip:",t),"Error loading data"}}function J_(n,t,e,i,s,r){const a=(e-s)*(e-s)+(i-r)*(i-r);if(a===0)return(n-e)*(n-e)+(t-i)*(t-i);let o=((n-e)*(s-e)+(t-i)*(r-i))/a;o=Math.max(0,Math.min(1,o));const l=e+o*(s-e),c=i+o*(r-i);return(n-l)*(n-l)+(t-c)*(t-c)}function Q_(n,t,e,i,s){let r=null,a=20;const o=(l,c,h,u)=>{if(!l||!l.visible)return;const f=new E;l.getWorldPosition(f);const p=f.clone().project(e);if(p.z<-1||p.z>1)return;const g=(p.x*.5+.5)*window.innerWidth,_=(-(p.y*.5)+.5)*window.innerHeight,m=n-g,d=t-_,y=Math.sqrt(m*m+d*d);y<a&&(a=y,r={type:c,data:h,parentName:u})};return o(s,"sun",{}),i.forEach(l=>{o(l.mesh,"planet",l.data),l.moons&&l.moons.forEach(c=>{o(c.mesh,"moon",c.data,l.data.name)})}),r}const tv=[{name:"Aries",index:0},{name:"Taurus",index:1},{name:"Gemini",index:2},{name:"Cancer",index:3},{name:"Leo",index:4},{name:"Virgo",index:5},{name:"Libra",index:6},{name:"Scorpio",index:7},{name:"Sagittarius",index:8},{name:"Capricorn",index:9},{name:"Aquarius",index:10},{name:"Pisces",index:11}],ev=["Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc"];function iv(n,t){const e=new Me;e.visible=R.showZodiacSigns||!1,n.add(e);const i="/assets/zodiac_signs_sheet.png";return Ot.log("ZodiacSigns: Loading texture from",i),t.load(i,s=>{Ot.log("ZodiacSigns: Texture loaded successfully"),s.colorSpace=Ce;const r=5e3;tv.forEach((a,o)=>{const l=s.clone();l.needsUpdate=!0;const c=o%4,h=2-Math.floor(o/4);l.repeat.set(.25,.333),l.offset.set(c*.25,h*.333);const u=new Po({map:l,transparent:!0,opacity:.8,color:16777215,depthWrite:!1,blending:Di}),f=new Gh(u);f.scale.set(r,r,1),f.visible=!1,f.userData={zodiacIndex:o,zodiacId:ev[o]},e.add(f)})},void 0,s=>{Ot.error("ZodiacSigns: Error loading texture",s)}),e}async function nv(n,t){if(!n)return;const e=ye*100,i=e*.08,s=23.44*Math.PI/180,r=0;n.children.forEach((a,o)=>{if(!a.isSprite)return;const l=r+o*Math.PI/6+Math.PI/12,c=e*Math.cos(l),h=e*Math.sin(l),u=0,f=c,p=h*Math.cos(s)-u*Math.sin(s),g=h*Math.sin(s)+u*Math.cos(s);a.position.set(f,g,-p),a.scale.set(i,i,1),a.visible=!0}),Ot.log("ZodiacSigns: Aligned signs in perfect circle on ecliptic")}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class vi{constructor(t,e,i,s,r="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),vi.nextNameID=vi.nextNameID||0,this.$name.id=`lil-gui-name-${++vi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",a=>a.stopPropagation()),this.domElement.addEventListener("keyup",a=>a.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class sv extends vi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function xo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const rv={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:xo,toHexString:xo},Rs={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},av={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Rs.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Rs.toHexString(s)}},ov={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Rs.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Rs.toHexString(s)}},lv=[rv,Rs,av,ov];function cv(n){return lv.find(t=>t.match(n))}class hv extends vi{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=cv(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=xo(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Wa extends vi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class uv extends vi{constructor(t,e,i,s,r,a){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(r);const o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+y),this.$input.value=this.getValue())},s=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},r=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let a=!1,o,l,c,h,u;const f=5,p=y=>{o=y.clientX,l=c=y.clientY,a=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=y=>{if(a){const v=y.clientX-o,x=y.clientY-l;Math.abs(x)>f?(y.preventDefault(),this.$input.blur(),a=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>f&&_()}if(!a){const v=y.clientY-c;u-=v*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},d=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",d)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(d,y,v,x,C)=>(d-y)/(v-y)*(C-x)+x,e=d=>{const y=this.$slider.getBoundingClientRect();let v=t(d,y.left,y.right,this._min,this._max);this._snapClampSetValue(v)},i=d=>{this._setDraggingStyle(!0),e(d.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=d=>{e(d.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let a=!1,o,l;const c=d=>{d.preventDefault(),this._setDraggingStyle(!0),e(d.touches[0].clientX),a=!1},h=d=>{d.touches.length>1||(this._hasScrollBar?(o=d.touches[0].clientX,l=d.touches[0].clientY,a=!0):c(d),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=d=>{if(a){const y=d.touches[0].clientX-o,v=d.touches[0].clientY-l;Math.abs(y)>Math.abs(v)?c(d):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else d.preventDefault(),e(d.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},p=this._callOnFinishChange.bind(this),g=400;let _;const m=d=>{if(Math.abs(d.deltaX)<Math.abs(d.deltaY)&&this._hasScrollBar)return;d.preventDefault();const v=this._normalizeMouseWheel(d)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(p,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class dv extends vi{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class fv extends vi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const pv=`.lil-gui {
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
}`;function mv(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let $c=!1;class Zr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:r="Controls",closeFolders:a=!1,injectStyles:o=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!$c&&o&&(mv(pv),$c=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=a}add(t,e,i,s,r){if(Object(i)===i)return new dv(this,t,e,i);const a=t[e];switch(typeof a){case"number":return new uv(this,t,e,i,s,r);case"boolean":return new sv(this,t,e);case"string":return new fv(this,t,e);case"function":return new Wa(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,a)}addColor(t,e,i=1){return new hv(this,t,e,i)}addFolder(t){const e=new Zr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Wa||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Wa)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function gv(n){const t=n.addFolder("About"),e=document.createElement("div");e.style.padding="15px",e.style.textAlign="center",e.innerHTML=`
        <img src="./assets/images/WhiteRabbit.png" style="max-width: 100%; margin-bottom: 10px; border-radius: 4px;">
        <br>
        <a href="https://github.com/IraGraves/white-rabbit" target="_blank" style="color: #88ccff; text-decoration: none;">GitHub Repository</a>
    `,t.domElement.querySelector(".children").appendChild(e),t.close()}const _v=[{type:"Total",date:new Date("2020-12-14T16:00:00Z")},{type:"Total",date:new Date("2021-12-04T07:00:00Z")},{type:"Total",date:new Date("2023-04-20T04:00:00Z")},{type:"Total",date:new Date("2024-04-08T18:00:00Z")},{type:"Total",date:new Date("2026-08-12T17:00:00Z")},{type:"Total",date:new Date("2027-08-02T10:00:00Z")},{type:"Total",date:new Date("2028-07-22T02:00:00Z")},{type:"Total",date:new Date("2030-11-25T06:00:00Z")},{type:"Annular",date:new Date("2020-06-21T06:00:00Z")},{type:"Annular",date:new Date("2021-06-10T10:00:00Z")},{type:"Annular",date:new Date("2023-10-14T18:00:00Z")},{type:"Annular",date:new Date("2024-10-02T18:00:00Z")},{type:"Annular",date:new Date("2026-02-17T12:00:00Z")},{type:"Annular",date:new Date("2027-02-06T16:00:00Z")},{type:"Annular",date:new Date("2028-01-26T15:00:00Z")},{type:"Annular",date:new Date("2030-06-01T06:00:00Z")}];function vv(n,t,e,i){var s;R.date=new Date(n.date),R.simulationSpeed=1,(s=window.uiState)!=null&&s.updateSpeedometer&&window.uiState.updateSpeedometer(),setTimeout(()=>{const r=i.find(a=>a.data.name==="Earth");if(!r){Ot.error("Earth not found");return}$n({...r,type:"planet"},t,e,.75),Ot.log(`Navigating to event: ${n.type} - ${n.date.toISOString()}`)},100)}function vr(n){const t=n.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`${n.type} - ${t}`}function yv(n,t,e,i,s){const r={selectedEvent:null},a=document.createElement("div");a.className="events-container",a.innerHTML=`
        <div class="events-input-wrapper">
            <label for="events-search">Solar Eclipse</label>
            <input type="text" id="events-search" placeholder="Search..." autocomplete="off">
        </div>
        <div class="events-actions">
            <button id="btn-go-to-event" disabled>Go To</button>
        </div>
        <div id="events-status"></div>
    `,n.appendChild(a);let o=document.getElementById("events-results-dropdown");o||(o=document.createElement("div"),o.id="events-results-dropdown",o.className="events-results",document.body.appendChild(o));const l=a.querySelector("#events-search"),c=a.querySelector("#btn-go-to-event"),h=a.querySelector("#events-status");function u(){const p=l.getBoundingClientRect();o.style.top=`${p.bottom+5}px`,o.style.left=`${p.left}px`,o.style.width=`${p.width}px`}l.addEventListener("input",p=>{const g=p.target.value.toLowerCase();if(g.length<1){o.style.display="none";return}const _=[];_v.forEach(m=>{vr(m).toLowerCase().includes(g)&&_.push(m)}),_.sort((m,d)=>m.date-d.date),o.innerHTML="",_.length>0?(u(),o.style.display="block",_.forEach(m=>{const d=document.createElement("div");d.className="events-result-item";const y=m.type.includes("Total")?"total-eclipse":"annular-eclipse";d.innerHTML=`<span class="event-type ${y}">${m.type}</span><span class="event-date">${m.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span>`,d.onclick=()=>{f(m),o.style.display="none"},o.appendChild(d)})):o.style.display="none"}),window.addEventListener("resize",()=>{o.style.display==="block"&&u()}),n.addEventListener("scroll",()=>{o.style.display==="block"&&u()},!0);function f(p){r.selectedEvent=p,l.value=vr(p),c.disabled=!1,h.textContent=`Selected: ${vr(p)}`}c.onclick=()=>{r.selectedEvent&&t&&e&&(vv(r.selectedEvent,t,e,i),h.textContent=`Navigating to ${vr(r.selectedEvent)}...`)}}const xv="modulepreload",Mv=function(n){return"/"+n},qc={},Yc=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(e.map(l=>{if(l=Mv(l),l in qc)return;qc[l]=!0;const c=l.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":xv,c||(u.as="script"),u.crossOrigin="",u.href=l,o&&u.setAttribute("nonce",o),document.head.appendChild(u),c)return new Promise((f,p)=>{u.addEventListener("load",f),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})};function Sv(n,t,e,i,s,r){const a={selectedObject:null},o=document.createElement("div");o.className="find-container",o.innerHTML=`
        <div class="find-input-wrapper">
            <label for="find-search">Search</label>
            <input type="text" id="find-search" placeholder="Planets, stars..." autocomplete="off">
        </div>
        <div class="find-actions">
            <button id="btn-look-at" disabled>Look At</button>
            <button id="btn-go-to" disabled>Go To</button>
        </div>
    `,n.appendChild(o);let l=document.getElementById("find-results-dropdown");l||(l=document.createElement("div"),l.id="find-results-dropdown",l.className="find-results",document.body.appendChild(l));const c=o.querySelector("#find-search"),h=o.querySelector("#btn-look-at"),u=o.querySelector("#btn-go-to");function f(){const g=c.getBoundingClientRect();l.style.top=`${g.bottom+5}px`,l.style.left=`${g.left}px`,l.style.width=`${g.width}px`}c.addEventListener("input",g=>{c.classList.remove("valid-selection"),a.selectedObject=null,h.disabled=!0,u.disabled=!0;const _=g.target.value.toLowerCase();if(_.length<2){l.style.display="none";return}const m=[];if("sun".includes(_)&&e.visible&&m.push({name:"Sun",type:"Star",object:{mesh:e,data:{name:"Sun",radius:5},type:"sun"}}),t.forEach(d=>{d.data.name.toLowerCase().includes(_)&&d.mesh.visible&&m.push({name:d.data.name,type:d.data.type==="dwarf"?"Dwarf Planet":"Planet",object:{mesh:d.mesh,data:d.data,type:"planet"}}),d.moons&&d.moons.forEach(y=>{y.data.name.toLowerCase().includes(_)&&y.mesh.visible&&m.push({name:y.data.name,type:"Moon",object:{mesh:y.mesh,data:y.data,type:"moon"}})})}),console.log("Searching stars...",i),i.value&&i.value.userData.starData){const d=i.value.userData.starData;console.log("Star data found, count:",d.length);let y=0;for(let v=0;v<d.length&&y<20;v++){const x=d[v],C=x.name||"",T=x.bayer||"",P=x.flamsteed?x.flamsteed.toString():"",G=x.hip?`hip ${x.hip}`:"",M=x.hd?`hd ${x.hd}`:"";let b=!1;if((C&&C.toLowerCase().includes(_)||G.includes(_)||M.includes(_)||T.toLowerCase().includes(_)||P&&_.includes(P)||x.hip==_||x.hd==_)&&(b=!0),b){const O=x.x*ye,$=x.z*ye,J=-x.y*ye,L=new Ne;L.position.set(O,$,J),m.push({name:C||T||`HD ${x.hd}`||`HIP ${x.hip}`,type:"Star",object:{mesh:L,data:{name:C||T||"Star",radius:x.radius||1},type:"star"}}),y++}}}l.innerHTML="",m.length>0?(f(),l.style.display="block",m.slice(0,10).forEach(d=>{const y=document.createElement("div");y.className="find-result-item",y.innerHTML=`<strong>${d.name}</strong> <span style="opacity:0.7; font-size:0.8em">(${d.type})</span>`,y.onclick=()=>{p(d),l.style.display="none"},l.appendChild(y)})):l.style.display="none"}),window.addEventListener("resize",()=>{l.style.display==="block"&&f()}),n.addEventListener("scroll",()=>{l.style.display==="block"&&f()},!0);function p(g){a.selectedObject=g.object,c.value=g.name,c.classList.add("valid-selection"),h.disabled=!1,u.disabled=!1}h.onclick=()=>{a.selectedObject&&s&&r&&Yc(()=>Promise.resolve().then(()=>Cc),void 0).then(g=>{g.isFocusModeActive()&&g.exitFocusMode(r);const _=a.selectedObject,m=new E;_.mesh.position?_.mesh.getWorldPosition(m):m.copy(_.mesh.position),r.target.copy(m),s.lookAt(m),r.update()})},u.onclick=()=>{a.selectedObject&&s&&r&&Yc(()=>Promise.resolve().then(()=>Cc),void 0).then(g=>{g.focusOnObject(a.selectedObject,s,r)})}}function bv(n,t){const e=new Zr({container:n,width:"100%"});e.domElement.classList.add("embedded-gui"),e.title("Missions");const i=e,s=e.domElement.querySelector(".title");s&&(s.style.display="none"),i.add(t.showMissions,"pioneer10").name("Pioneer 10 (1972)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("pioneer10-checkbox"),i.add(t.showMissions,"pioneer11").name("Pioneer 11 (1973)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("pioneer11-checkbox"),i.add(t.showMissions,"voyager2").name("Voyager 2 (1977)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("voyager2-checkbox"),i.add(t.showMissions,"voyager1").name("Voyager 1 (1977)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("voyager1-checkbox"),i.add(t.showMissions,"galileo").name("Galileo (1989)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("galileo-checkbox"),i.add(t.showMissions,"ulysses").name("Ulysses (1990)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("ulysses-checkbox"),i.add(t.showMissions,"cassini").name("Cassini (1997)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("cassini-checkbox"),i.add(t.showMissions,"rosetta").name("Rosetta (2004)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("rosetta-checkbox"),i.add(t.showMissions,"newHorizons").name("New Horizons (2006)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("new-horizons-checkbox"),i.add(t.showMissions,"juno").name("Juno (2011)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("juno-checkbox"),i.add(t.showMissions,"parkerSolarProbe").name("Parker Solar Probe (2018)").onChange(()=>{window.updateMissions&&window.updateMissions()}).domElement.classList.add("parker-checkbox")}function Ev(n,t){const e=n.addFolder("Mouse & Keys");e.add(t,"rotate").name("Rotate").disable(),e.add(t,"pan").name("Pan").disable(),e.add(t,"zoom").name("Zoom").disable(),e.add(t,"focusEnter").name("Focus").disable(),e.add(t,"focusExit").name("Exit Focus").disable(),e.add(t,"fullScreen").name("Full Screen").disable(),e.close()}function wv(){const n=me.createWindow("music-window","Music",{width:"240px",x:290,y:window.innerHeight-280,snap:{y:"bottom"},onClose:()=>{}}),t=n.content;t.classList.add("music-window-content");const e=document.createElement("div");e.className="volume-container";const i=document.createElement("label");i.textContent="Volume";const s=document.createElement("input");s.type="range",s.min="0",s.max="1",s.step="0.01",s.value=R.music.volume,s.className="volume-slider",s.oninput=_=>{Xe.setVolume(parseFloat(_.target.value))},e.appendChild(i),e.appendChild(s),t.appendChild(e);const r=document.createElement("div");r.className="track-display",r.textContent=R.music.currentTrackName||"---",t.appendChild(r),n.update=()=>{r.textContent!==R.music.currentTrackName&&(r.textContent=R.music.currentTrackName)};const a=document.createElement("div");a.className="control-buttons";const o=document.createElement("div");o.className="control-btn",o.textContent="⏮",o.title="Previous Track",o.onclick=()=>Xe.playPrevious();const l=document.createElement("div");l.className="control-btn";const c=R.music.volume>0&&R.music.enabled;l.textContent=c?"⏸":"▶",l.title=c?"Pause":"Play",l.onclick=()=>{const _=!R.music.enabled;Xe.setEnabled(_),l.textContent=_?"⏸":"▶",l.title=_?"Pause":"Play"};const h=n.update;n.update=()=>{h();const _=R.music.enabled,m=_?"⏸":"▶";l.textContent!==m&&(l.textContent=m,l.title=_?"Pause":"Play")};const u=document.createElement("div");u.className="control-btn",u.textContent="⏭",u.title="Next Track",u.onclick=()=>Xe.playNext();const f=document.createElement("div");f.className="control-btn";const p=`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
  `;f.innerHTML=p,f.title=R.music.shuffle?"Shuffle: ON":"Shuffle: OFF",R.music.shuffle&&f.classList.add("active"),f.onclick=()=>{R.music.shuffle=!R.music.shuffle,R.music.shuffle?(f.classList.add("active"),f.title="Shuffle: ON"):(f.classList.remove("active"),f.title="Shuffle: OFF")};const g=document.createElement("div");g.className="control-btn",g.textContent="☰",g.title="Edit Playlist",g.onclick=()=>Tv(),a.appendChild(o),a.appendChild(l),a.appendChild(u),a.appendChild(f),a.appendChild(g),t.appendChild(a),n.element.offsetHeight,n.x=290,me.hideWindow("music-window")}function Tv(){let n=document.querySelector(".playlist-modal-overlay");n||(Av(),n=document.querySelector(".playlist-modal-overlay")),Kr(),n.classList.add("active")}function Av(){const n=document.createElement("div");n.className="playlist-modal-overlay";const t=document.createElement("div");t.className="playlist-modal";const e=document.createElement("div");e.className="playlist-header",e.innerHTML="<h2>Playlist</h2>";const i=document.createElement("div");i.className="playlist-controls";const s=document.createElement("button");s.className="playlist-btn",s.textContent="All",s.onclick=()=>jc(!0);const r=document.createElement("button");r.className="playlist-btn",r.textContent="None",r.onclick=()=>jc(!1);const a=document.createElement("button");a.className="playlist-btn",a.textContent="Lyrics",a.onclick=()=>Zc("Lyrics");const o=document.createElement("button");o.className="playlist-btn",o.textContent="Instrumental",o.onclick=()=>Zc("Instrumental"),i.appendChild(s),i.appendChild(r),i.appendChild(a),i.appendChild(o);const l=document.createElement("div");l.className="playlist-tracks",l.id="playlist-tracks-container";const c=document.createElement("div");c.className="playlist-footer";const h=document.createElement("button");h.className="playlist-close-btn",h.textContent="Close",h.onclick=()=>{n.classList.remove("active")},c.appendChild(h),t.appendChild(e),t.appendChild(i),t.appendChild(l),t.appendChild(c),n.appendChild(t),document.body.appendChild(n),n.addEventListener("click",u=>{u.target===n&&n.classList.remove("active")})}function Kr(){const n=document.getElementById("playlist-tracks-container");if(n){if(n.innerHTML="",!Xe.tracks||Xe.tracks.length===0){n.innerHTML='<div style="padding:10px; color:#aaa;">Loading tracks...</div>',Xe.init().then(()=>Kr());return}Xe.tracks.forEach(t=>{const e=document.createElement("div");e.className="track-item",R.music.playlist.includes(t.id)&&e.classList.add("selected");const i=document.createElement("input");i.type="checkbox",i.checked=R.music.playlist.includes(t.id),i.onchange=r=>{Cv(t.id,r.target.checked),r.target.checked?e.classList.add("selected"):e.classList.remove("selected")};const s=document.createElement("span");s.className="track-label",s.textContent=t.title.replace(/ \[(Lyrics|Instrumental)\]/g,""),e.onclick=r=>{r.target!==i&&(i.checked=!i.checked,i.dispatchEvent(new Event("change")))},e.appendChild(i),e.appendChild(s),n.appendChild(e)})}}function Cv(n,t){t?R.music.playlist.includes(n)||R.music.playlist.push(n):R.music.playlist=R.music.playlist.filter(e=>e!==n),Xe.setPlaylist(R.music.playlist)}function jc(n){n?R.music.playlist=Xe.tracks.map(t=>t.id):R.music.playlist=[],Xe.setPlaylist(R.music.playlist),Kr()}function Zc(n){const e=Xe.tracks.filter(s=>s.title.includes(`[${n}]`)).map(s=>s.id);e.every(s=>R.music.playlist.includes(s))?R.music.playlist=R.music.playlist.filter(s=>!e.includes(s)):e.forEach(s=>{R.music.playlist.includes(s)||R.music.playlist.push(s)}),Xe.setPlaylist(R.music.playlist),Kr()}function Pv(n,t,e){n.innerHTML="";const i=document.createElement("div");i.className="system-list",n.appendChild(i);const s=y=>{const v=document.createElement("div");v.className="system-section";const x=document.createElement("div");return x.className="system-section-title",x.textContent=y,v.appendChild(x),i.appendChild(v),v},r=(y,v,x,C,T)=>{const P=document.createElement("div");P.className="system-row";const G=document.createElement("div");G.className="system-label",G.textContent=v,P.appendChild(G);const M=document.createElement("div");M.className="system-slider-container";const b=document.createElement("input");b.type="range",b.className="system-slider",b.min=0,b.max=1e3,b.value=x();const O=document.createElement("span");return O.className="system-value",O.textContent=T(),b.addEventListener("input",$=>{C(parseFloat($.target.value));const J=T();O.textContent=J}),M.appendChild(b),P.appendChild(M),P.appendChild(O),y.appendChild(P),{update:()=>{b.value=x(),O.textContent=T()}}},a=s("Settings");r(a,"Brightness",()=>R.starBrightness*1e3,y=>{const v=y/1e3;R.starBrightness=v;const x=t.value;x&&x.userData.manager&&x.userData.manager.setBrightness(v)},()=>(R.starBrightness*100).toFixed(0)+"%"),r(a,"Saturation",()=>(R.starSaturation||0)*1e3,y=>{const v=y/1e3;R.starSaturation=v;const x=t.value;x&&x.userData.manager&&x.userData.manager.setSaturation(v)},()=>(R.starSaturation!==void 0?R.starSaturation:.3).toFixed(1)+"x");const p=2,g=13;r(a,"Limit (Mag)",()=>(R.magnitudeLimit-p)/(g-p)*1e3,y=>{const v=y/1e3,x=p+v*(g-p);R.magnitudeLimit=x;const C=t.value;if(C&&C.userData.manager){const T=C.userData.manager;x>6.5&&T.loadChunk(1),x>8&&T.loadChunk(2),T.setMagnitudeLimit(x)}},()=>R.magnitudeLimit.toFixed(1))}function Rv(n,t){const e=n.addFolder("System"),i=document.createElement("div");i.style.padding="10px",i.style.fontSize="12px",i.style.lineHeight="1.4",i.style.color="#eee",i.style.fontFamily="monospace";const s=t.getContext(),r=s.getExtension("WEBGL_debug_renderer_info"),a=r?s.getParameter(r.UNMASKED_RENDERER_WEBGL):"Unknown";r&&s.getParameter(r.UNMASKED_VENDOR_WEBGL);const o=s.getParameter(s.MAX_TEXTURE_SIZE),l=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),c=s.getExtension("EXT_texture_filter_anisotropic"),h=c?s.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT):"N/A",u=navigator.hardwareConcurrency||"Unknown",f=navigator.deviceMemory?`${navigator.deviceMemory} GB`:"Unknown",p=`
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">CPU:</strong> ${u} Logical Processors<br>
      <strong style="color: #88ccff;">Memory:</strong> ${f}
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="color: #88ccff;">GPU:</strong><br>
      ${a}
    </div>
    <div>
      <strong style="color: #88ccff;">WebGL Limits:</strong><br>
      Max Texture Size: ${o}px<br>
      Max Cube Map Size: ${l}px<br>
      Max Anisotropy: ${h}x
    </div>
  `;i.innerHTML=p,e.domElement.querySelector(".children").appendChild(i),e.close()}function Lv(n,t,e,i,s,r,a){n.innerHTML="";const o=document.createElement("div");o.className="system-list",n.appendChild(o);const l=I=>{const H=document.createElement("div");H.className="system-section";const B=document.createElement("div");return B.className="system-section-title",B.textContent=I,H.appendChild(B),o.appendChild(H),H},c=(I,H,B,j,W)=>{const K=document.createElement("div");K.className="system-row";const Q=document.createElement("div");Q.className="system-label",Q.textContent=H,K.appendChild(Q);const k=document.createElement("select");k.className="system-select",Object.entries(B).forEach(([Z,nt])=>{const dt=document.createElement("option");dt.value=nt,dt.textContent=Z,nt===j()&&(dt.selected=!0),k.appendChild(dt)}),k.addEventListener("change",Z=>{W(Z.target.value)}),K.appendChild(k),I.appendChild(K)},h=(I,H,B,j,W)=>{const K=document.createElement("div");K.className="system-row";const Q=document.createElement("div");Q.className="system-label",Q.textContent=H,K.appendChild(Q);const k=document.createElement("div");k.className="system-slider-container";const Z=document.createElement("input");Z.type="range",Z.className="system-slider",Z.min=0,Z.max=1e3,Z.value=B();const nt=document.createElement("span");return nt.className="system-value",nt.textContent=W(),Z.addEventListener("input",dt=>{j(parseFloat(dt.target.value));const gt=W();nt.textContent=gt}),k.appendChild(Z),K.appendChild(k),K.appendChild(nt),I.appendChild(K),{update:()=>{Z.value=B(),nt.textContent=W()}}},u=l("Coordinate System");c(u,"Origin",{"Center of Mass (Barycentric)":"Barycentric","Earth (Geocentric)":"Geocentric","Earth (Tychonic)":"Tychonic","Sun (Heliocentric)":"Heliocentric"},()=>R.coordinateSystem,I=>{R.coordinateSystem=I,nu(s,e,i),vo(r,a,e)}),c(u,"Reference Plane",{Equatorial:"Equatorial",Ecliptic:"Ecliptic"},()=>R.referencePlane,I=>{R.referencePlane=I,su(I,s)});const p=l("Scale"),g=()=>{const I=document.createElement("div");I.className="system-row";const H=document.createElement("div");H.className="system-label",H.textContent="Preset",I.appendChild(H);const B=document.createElement("select");return B.className="system-select",Object.entries({Realistic:"Realistic",Artistic:"Artistic",Custom:"Custom"}).forEach(([W,K])=>{const Q=document.createElement("option");Q.value=K,Q.textContent=W,B.appendChild(Q)}),B.value=t.scalePreset,B.addEventListener("change",W=>{t.scalePreset=W.target.value,m(t.scalePreset)}),I.appendChild(B),p.appendChild(I),{update:()=>{B.value=t.scalePreset}}};let _=!1;const m=I=>{if(_=!0,I==="Realistic")C(1),$(0);else if(I==="Artistic"){C(1*fs);const H=(499/(Ai*5-1))**(1/3);$(H*1e3)}_=!1},d=g(),y=1,v=70,x=()=>(R.sunScale*fs-y)/(v-y)*1e3,C=I=>{const H=I/fs;R.sunScale=H,i.scale.setScalar(H),y_(s,H),G&&G.update()},G=h(p,"Sun Scale",x,I=>{const H=I/1e3,B=y+H*(v-y);C(B),!_&&t.scalePreset!=="Custom"&&(t.scalePreset="Custom",d.update())},()=>(R.sunScale*fs).toFixed(0)+"x"),M=I=>1+(Ai*5-1)*I**3,b=I=>((I-1)/(Ai*5-1))**(1/3),O=()=>{const I=R.planetScale*Ai;return b(I)*1e3},$=I=>{const H=I/1e3,j=M(H)/Ai;R.planetScale=j,e.forEach(W=>{W.mesh.scale.setScalar(j),W.moons.forEach(K=>K.mesh.scale.setScalar(j))}),cu(e),F&&F.update()},F=h(p,"Planet Scale",O,I=>{$(I),!_&&t.scalePreset!=="Custom"&&(t.scalePreset="Custom",d.update())},()=>(R.planetScale*Ai).toFixed(0)+"x");return{setScalePreset:I=>{t.scalePreset=I,d.update(),m(I)}}}class Kc{constructor(t,e,i={}){this.id=t,this.tabs=[],this.activeTabId=null,this.window=me.createWindow(t,e,{...i,onClose:()=>this.onClose()}),this.setupTabStructure(),this.setupDropZone(),me.hideWindow(this.id)}setupTabStructure(){const t=this.window.content;t.innerHTML="",this.tabHeader=document.createElement("div"),this.tabHeader.className="tab-header",t.appendChild(this.tabHeader),this.tabList=document.createElement("div"),this.tabList.className="tab-list",this.tabHeader.appendChild(this.tabList),this.tabContentArea=document.createElement("div"),this.tabContentArea.className="tab-content-area",t.appendChild(this.tabContentArea)}addTab(t,e,i,s=""){if(this.tabs.find(c=>c.id===t))return;const r=["objects","orbits","magnetic","guides","stars","asterisms","system"];i.classList.add("tab-content"),this.tabContentArea.appendChild(i);const a={id:t,title:e,contentElement:i,icon:s};let o=this.tabs.length;const l=r.indexOf(t);if(l!==-1)for(let c=0;c<this.tabs.length;c++){const h=this.tabs[c].id,u=r.indexOf(h);if(u===-1){o=c;break}else if(u>l){o=c;break}}else o=this.tabs.length;this.tabs.splice(o,0,a),this.renderTabs(),this.tabs.length===1&&this.selectTab(t)}removeTab(t){const e=this.tabs.findIndex(i=>i.id===t);if(e>-1){const i=this.tabs[e];if(i.contentElement.parentNode===this.tabContentArea&&(this.tabContentArea.removeChild(i.contentElement),i.contentElement.classList.remove("tab-content","active-content")),this.tabs.splice(e,1),this.renderTabs(),this.activeTabId===t)if(this.tabs.length>0){const s=Math.max(0,e-1);this.selectTab(this.tabs[s].id)}else this.activeTabId=null}}selectTab(t){this.tabs.find(i=>i.id===t)&&(this.activeTabId=t,this.renderTabs(),setTimeout(()=>{const i=this.tabs.findIndex(s=>s.id===t);i>-1&&this.tabList.children[i]&&this.tabList.children[i].scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},0),this.tabs.forEach(i=>{i.id===t?i.contentElement.classList.add("active-content"):i.contentElement.classList.remove("active-content")}))}renderTabs(){this.tabList.innerHTML="",this.tabs.forEach(t=>{const e=document.createElement("div");e.className="tab-item",t.id===this.activeTabId&&e.classList.add("active");const i=document.createElement("span");i.className="tab-icon",i.innerHTML=t.icon||"";const s=document.createElement("span");s.className="tab-title",s.textContent=t.title,e.appendChild(i),e.appendChild(s),e.title=t.title,e.addEventListener("mousedown",r=>this.handleTabMouseDown(r,t)),this.tabList.appendChild(e)})}handleTabMouseDown(t,e){if(t.stopPropagation(),this.tabs.length<=1)return;const i=t.clientX,s=t.clientY;let r=!1;const a=c=>{const h=c.clientX-i,u=c.clientY-s;!r&&(Math.abs(h)>10||Math.abs(u)>10)&&(r=!0,this.detachTab(e,c.clientX,c.clientY),l())},o=()=>{r||this.selectTab(e.id),l()},l=()=>{document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",o)};document.addEventListener("mousemove",a),document.addEventListener("mouseup",o)}detachTab(t,e,i){this.removeTab(t.id);const s=`window_${t.id}`,r=me.createWindow(s,t.title,{x:e-150,y:i-20,width:"300px",height:"auto",onClose:()=>{this.addTab(t.id,t.title,t.contentElement,t.icon)}});r.x=e-150,r.y=i-20,r.snapState={x:"none",y:"none"},r.element.style.transform=`translate3d(${r.x}px, ${r.y}px, 0)`,r.element.classList.add("dockable-window"),r.element.dataset.tabId=t.id,r.element.dataset.tabTitle=t.title,r.element.dataset.tabIcon=t.icon||"",t.contentElement.classList.remove("tab-content","active-content"),r.content.appendChild(t.contentElement),me.showWindow(s),me.bringToFront(s);const a=new MouseEvent("mousedown",{bubbles:!0,cancelable:!0,view:window,clientX:e,clientY:i});r.element.dispatchEvent(a)}setupDropZone(){document.addEventListener("mouseup",t=>{const e=document.querySelectorAll(".dockable-window"),i=this.tabHeader.getBoundingClientRect();e.forEach(s=>{if(s.style.display==="none")return;const r=s.getBoundingClientRect();if(!(r.right<i.left||r.left>i.right||r.bottom<i.top||r.top>i.bottom)){const o=s.dataset.tabId,l=s.dataset.tabTitle,c=s.dataset.tabIcon,h=s.querySelector(".window-content").firstElementChild;o&&h&&(this.addTab(o,l,h,c),me.hideWindow(s.id))}})})}onClose(){}toggle(){me.toggleWindow(this.id)}}function Dv(n,t,e){const i=me.createWindow("time-window","Time & Speed",{x:20,y:window.innerHeight-280,width:"250px",snap:{x:"left",y:"bottom"},onClose:()=>{}});me.hideWindow("time-window");const s=i.content;s.classList.add("time-window-content");const r=document.createElement("div");r.className="time-display",r.textContent=t.date,s.appendChild(r),r.style.cursor="pointer",r.title="Click to change date",r.onclick=()=>{Iv(e,t,p)};const a=document.createElement("div");a.className="speedometer-container",a.innerHTML=`
        <div class="gauge-arc"></div>
        <div class="gauge-needle"></div>
        <div class="digital-speed">0x</div>
        <div class="speedometer-interaction"></div>
    `,s.appendChild(a);const o=document.createElement("div");o.className="control-buttons",[{label:"<<",action:"rewind"},{label:"<",action:"reverse"},{label:"||",action:"pause"},{label:">",action:"play"},{label:">>",action:"forward"}].forEach(y=>{const v=document.createElement("div");v.className="control-btn",v.textContent=y.label,v.dataset.action=y.action,v.onclick=()=>d(y.action),o.appendChild(v)}),s.appendChild(o);const c=a.querySelector(".gauge-needle"),h=a.querySelector(".digital-speed"),u=a.querySelector(".speedometer-interaction");function f(y){if(y===0)return"PAUSED";const v=Math.abs(y);let x="";return v>=1e9?x=Math.round(v/1e9).toLocaleString()+" b":v>=1e6?x=Math.round(v/1e6).toLocaleString()+" m":v>=100?x=Math.round(v).toLocaleString()+"x":v>=10?x=v.toFixed(1)+"x":x=v.toFixed(2)+"x",x}function p(){const y=e.simulationSpeed;let v=0;if(y!==0){const x=Math.sign(y),C=Math.abs(y),T=Math.log10(C);v=Math.max(0,Math.min(10,T))/10*90*x}c.style.transform=`rotate(${v}deg)`,y===0?(h.textContent="PAUSED",h.style.color="#ffaa88"):(h.textContent=f(y),h.style.color="#aaccff"),o.querySelectorAll(".control-btn").forEach(x=>{x.classList.remove("active");const C=x.dataset.action;C==="pause"&&y===0&&x.classList.add("active"),C==="play"&&y===1&&x.classList.add("active"),C==="reverse"&&y===-1&&x.classList.add("active")}),r.textContent=t.date+" "+t.time}t.updateSpeedometer=p,p();function g(y){if(y=Math.max(-90,Math.min(90,y)),Math.abs(y)<1)e.simulationSpeed=0,t.speedFactor="0x";else{const v=Math.sign(y),C=Math.abs(y)/90*10,T=v*10**C;e.simulationSpeed=T,t.speedFactor=f(T)}p()}function _(y){const v=u.getBoundingClientRect(),x=v.left+v.width/2,C=v.bottom,T=y.clientX-x,P=C-y.clientY,M=90-Math.atan2(P,T)*180/Math.PI;g(M)}let m=!1;u.addEventListener("mousedown",y=>{m=!0,_(y)}),window.addEventListener("mousemove",y=>{m&&_(y)}),window.addEventListener("mouseup",()=>{m=!1});function d(y){const v=e.simulationSpeed,x=v===0?0:Math.log10(Math.abs(v));switch(y){case"pause":e.simulationSpeed=0;break;case"play":e.simulationSpeed=1;break;case"reverse":e.simulationSpeed=-1;break;case"forward":if(v<0){const C=Math.floor(x)-1;C<0?e.simulationSpeed=1:e.simulationSpeed=-(10**C)}else if(v===0)e.simulationSpeed=1;else{const C=Math.min(10,Math.floor(x)+1);e.simulationSpeed=10**C}break;case"rewind":if(v>0){const C=Math.floor(x)-1;C<0?e.simulationSpeed=-1:e.simulationSpeed=10**C}else if(v===0)e.simulationSpeed=-1;else{const C=Math.min(10,Math.floor(x)+1);e.simulationSpeed=-(10**C)}break}t.speedFactor=f(e.simulationSpeed),p()}return{dateCtrl:{updateDisplay:()=>{},domElement:{querySelector:()=>null}},timeCtrl:{updateDisplay:()=>{}},stardateCtrl:{updateDisplay:()=>{}},speedDisplay:{update:p}}}function Iv(n,t,e){let i=document.querySelector(".date-modal-overlay");i||(Uv(n,t,e),i=document.querySelector(".date-modal-overlay"));const s=i.querySelector('input[type="datetime-local"]');if(s){const r=new Date(n.date),a=r.getTimezoneOffset()*6e4,o=new Date(r-a).toISOString().slice(0,16);s.value=o}i.classList.add("active")}function Uv(n,t,e){const i=document.createElement("div");i.className="date-modal-overlay";const s=document.createElement("div");s.className="date-modal";const r=document.createElement("h3");r.textContent="Set Simulation Time";const a=document.createElement("input");a.type="datetime-local";const o=document.createElement("div");o.className="date-modal-buttons";const l=document.createElement("button");l.className="date-modal-btn",l.textContent="Cancel",l.onclick=()=>{i.classList.remove("active")};const c=document.createElement("button");c.className="date-modal-btn confirm",c.textContent="Set Time",c.onclick=()=>{if(a.value){const h=new Date(a.value);n.date=h,n.simulationSpeed=0,t.speedFactor="PAUSED",e(),i.classList.remove("active")}},o.appendChild(l),o.appendChild(c),s.appendChild(r),s.appendChild(a),s.appendChild(o),i.appendChild(s),document.body.appendChild(i),i.addEventListener("click",h=>{h.target===i&&i.classList.remove("active")})}function Fv(n,t,e,i,s,r,a,o,l,c,h,u,f,p,g){const _=new Zr({title:"⚙️"});_.domElement.classList.add("main-gui"),_.close();const m={speedExponent:0,date:"",time:"",stardate:"",speedFactor:"0x",planetScaleDisplay:`${(1*Ai).toFixed(0)}x`,sunScaleDisplay:`${(1*fs).toFixed(1)}x`,rotate:"Left Click + Drag",pan:"Right Click + Drag",zoom:"Scroll",focusEnter:"Double Click Object",focusExit:"Escape Key",fullScreen:"F11",scalePreset:"Artistic",timeWindow:!1,objectInfo:!1,musicWindow:!1,dock:!0,visualWindow:!1,explorerWindow:!1};let d={setScalePreset:()=>{}};Ci.addItem("objects","👆","Object Info",()=>{me.toggleWindow("object-info")}),Ci.addItem("time","⏱️","Time & Speed",()=>{me.toggleWindow("time-window")}),Ci.addItem("music","🎵","Music",()=>{me.toggleWindow("music-window")});const{dateCtrl:y,timeCtrl:v,stardateCtrl:x,speedDisplay:C}=Dv(_,m,R),T=new Kc("visual-tools","Visual Tools",{width:"320px",height:"auto",snap:{x:"right",y:"top"}}),P=(b,O,$,J)=>{let L="",F=J;if(typeof $=="function"?(F=$,L=""):L=$,typeof F!="function")return;const I=document.createElement("div");I.style.width="100%",F(I),T.addTab(b,O,I,L)};P("objects","Bodies","🪐",b=>p_(b,n,t)),P("orbits","Orbits","💫",b=>g_(b,e,n,i)),P("magnetic","Magnetism","🧲",b=>__(b,f,n,p)),P("guides","Guides","📐",b=>v_(b,t,n,u)),P("stars","Stars","✨",b=>Pv(b,a)),P("asterisms","Asterisms",'<span style="font-size:1.5em;font-weight:bold">☆</span>',b=>m_(b,s,r,h,g)),P("system","System","☀️",b=>{d=Lv(b,m,n,t,p,e,i)});const G=new Kc("explorer-window","Explorer",{width:"320px",height:"auto",snap:{x:"right",y:"bottom"}}),M=(b,O,$,J)=>{const L=document.createElement("div");L.style.width="100%",J(L),G.addTab(b,O,L,$)};return M("find","Find","🔍",b=>Sv(b,n,t,a,l,c)),M("missions","Missions","🚀",b=>bv(b,R)),M("events","Events","📅",b=>yv(b,l,c,n,d.setScalePreset)),Ci.addItem("explorer","🧭","Explorer",()=>{G.toggle()}),Ci.addItem("visuals","👁️","Visual Tools",()=>{T.toggle()}),Ci.addItem("fullscreen","⛶","Full Screen",()=>{!document.fullscreenElement&&!document.webkitFullscreenElement?document.documentElement.requestFullscreen?document.documentElement.requestFullscreen():document.documentElement.webkitRequestFullscreen&&document.documentElement.webkitRequestFullscreen():document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()}),d_(_,a,o,p,n,t,e,i,m),Ev(_,m),wv(),Rv(_,o),gv(_),{uiState:m,dateCtrl:y,timeCtrl:v,stardateCtrl:x,speedDisplay:C}}function Nv(n,t){const e=R.date.getFullYear(),i=String(R.date.getMonth()+1).padStart(2,"0"),s=String(R.date.getDate()).padStart(2,"0"),r=`${e}-${i}-${s}`;n.date=r,n.time=R.date.toLocaleTimeString();const a=new Date(R.date.getFullYear(),0,0),o=R.date-a,l=1e3*60*60*24,c=Math.floor(o/l);n.stardate=(R.date.getFullYear()+c/365).toFixed(2),R.simulationSpeed===0?n.speedFactor="0x":n.speedFactor=Math.round(R.simulationSpeed).toLocaleString()+"x";const h=t.dateCtrl.domElement.querySelector("input");h&&h.value!==r&&(h.value=r),t.dateCtrl.updateDisplay(),t.timeCtrl.updateDisplay(),t.stardateCtrl.updateDisplay(),t.speedDisplay&&t.speedDisplay.update();const u=me.getWindow("time-window");u&&(n.timeWindow=u.element.style.display!=="none");const f=me.getWindow("object-info");f&&(n.objectInfo=f.element.style.display!=="none");const p=me.getWindow("music-window");p&&(n.musicWindow=p.element.style.display!=="none",p.update&&p.update());const g=me.getWindow("visual-tools");g&&(n.visualWindow=g.element.style.display!=="none"),Ci.dock&&(n.dock=Ci.dock.style.display!=="none");const _=me.getWindow("explorer-window");_&&(n.explorerWindow=_.element.style.display!=="none")}const Jc={Earth:[{name:"Moon",body:"Moon",category:"largest",radius:.27,diameter:3474.8,color:8947848,type:"real",period:27.3,texture:"/assets/textures/moon.jpg",tidallyLocked:!0,axialTilt:6.7,mass:7342e19,gravity:1.62,meanTemp:220,discoveryYear:"Prehistoric",discoveredBy:"Unknown"}],Jupiter:[{name:"Io",category:"largest",radius:.28,diameter:3643.2,color:16776960,type:"jovian",moonIndex:0,period:1.77,texture:"/assets/textures/io.png",tidallyLocked:!0,axialTilt:0,mass:8932e19,gravity:1.796,meanTemp:110,discoveryYear:1610,discoveredBy:"Galileo Galilei"},{name:"Europa",category:"largest",radius:.24,diameter:3121.6,color:16777215,type:"jovian",moonIndex:1,period:3.55,texture:"/assets/textures/europa.png",tidallyLocked:!0,axialTilt:0,mass:48e21,gravity:1.314,meanTemp:102,discoveryYear:1610,discoveredBy:"Galileo Galilei"},{name:"Ganymede",category:"largest",radius:.41,diameter:5268.2,color:14540253,type:"jovian",moonIndex:2,period:7.15,texture:"/assets/textures/ganymede.png",tidallyLocked:!0,axialTilt:0,mass:1482e20,gravity:1.428,meanTemp:110,discoveryYear:1610,discoveredBy:"Galileo Galilei",magneticField:{strength:2,tilt:176,color:65535}},{name:"Callisto",category:"largest",radius:.37,diameter:4820.6,color:11184810,type:"jovian",moonIndex:3,period:16.7,texture:"/assets/textures/callisto.png",tidallyLocked:!0,axialTilt:0,mass:1076e20,gravity:1.235,meanTemp:134,discoveryYear:1610,discoveredBy:"Galileo Galilei"}],Saturn:[{name:"Titan",category:"largest",radius:.4,diameter:5150,distance:.00816,color:16755200,type:"simple",period:15.95,texture:"/assets/textures/titan.png",tidallyLocked:!0,axialTilt:0,mass:1345e20,gravity:1.352,meanTemp:94,discoveryYear:1655,discoveredBy:"Christiaan Huygens"}],Neptune:[{name:"Triton",category:"largest",radius:.21,diameter:2706.8,color:16764108,type:"simple",distance:.00237,period:5.88,texture:"/assets/textures/triton.jpg",tidallyLocked:!0,axialTilt:0,mass:214e20,gravity:.779,meanTemp:38,discoveryYear:1846,discoveredBy:"William Lassell"}]},Qc={Mars:[{name:"Phobos",category:"major",radius:.0018,diameter:22.2,color:8947848,type:"simple",distance:627e-7,period:.319,texture:"/assets/textures/phobos.jpg",tidallyLocked:!0,axialTilt:0,mass:10659e12,gravity:.0057,meanTemp:233,discoveryYear:1877,discoveredBy:"Asaph Hall"},{name:"Deimos",category:"major",radius:98e-5,diameter:12.4,color:10066329,type:"simple",distance:157e-6,period:1.263,texture:"/assets/textures/deimos.jpg",tidallyLocked:!0,axialTilt:0,mass:14762e11,gravity:.003,meanTemp:233,discoveryYear:1877,discoveredBy:"Asaph Hall"}],Saturn:[{name:"Mimas",category:"major",radius:.031,diameter:396.4,color:13421772,type:"simple",distance:.001239,period:.942,texture:"/assets/textures/mimas.jpg",tidallyLocked:!0,axialTilt:0,mass:375e17,gravity:.064,meanTemp:64,discoveryYear:1789,discoveredBy:"William Herschel"},{name:"Enceladus",category:"major",radius:.0397,diameter:504.2,color:16777215,type:"simple",distance:.00159,period:1.37,texture:"/assets/textures/enceladus.jpg",tidallyLocked:!0,axialTilt:0,mass:108e18,gravity:.113,meanTemp:75,discoveryYear:1789,discoveredBy:"William Herschel"},{name:"Tethys",category:"major",radius:.0835,diameter:1062.2,color:14540253,type:"simple",distance:.00197,period:1.888,texture:"/assets/textures/tethys.jpg",tidallyLocked:!0,axialTilt:0,mass:618e18,gravity:.146,meanTemp:86,discoveryYear:1684,discoveredBy:"Giovanni Cassini"},{name:"Dione",category:"major",radius:.088,diameter:1122.8,color:13421772,type:"simple",distance:.00252,period:2.737,texture:"/assets/textures/dione.jpg",tidallyLocked:!0,axialTilt:0,mass:11e20,gravity:.232,meanTemp:87,discoveryYear:1684,discoveredBy:"Giovanni Cassini"},{name:"Rhea",category:"major",radius:.12,diameter:1527.6,color:12303291,type:"simple",distance:.00352,period:4.518,texture:"/assets/textures/rhea.jpg",tidallyLocked:!0,axialTilt:0,mass:231e19,gravity:.264,meanTemp:76,discoveryYear:1672,discoveredBy:"Giovanni Cassini"},{name:"Iapetus",category:"major",radius:.115,diameter:1468.6,color:8943462,type:"simple",distance:.0238,period:79.33,texture:"/assets/textures/iapetus.jpg",tidallyLocked:!0,axialTilt:0,mass:181e19,gravity:.223,meanTemp:110,discoveryYear:1671,discoveredBy:"Giovanni Cassini"}],Uranus:[{name:"Miranda",category:"major",radius:.037,diameter:471.6,color:11184810,type:"simple",distance:866e-6,period:1.413,tidallyLocked:!0,axialTilt:0,mass:659e17,gravity:.079,meanTemp:60,discoveryYear:1948,discoveredBy:"Gerard Kuiper"},{name:"Ariel",category:"major",radius:.091,diameter:1157.8,color:13421772,type:"simple",distance:.00128,period:2.52,texture:"/assets/textures/ariel.jpg",tidallyLocked:!0,axialTilt:0,mass:135e19,gravity:.269,meanTemp:60,discoveryYear:1851,discoveredBy:"William Lassell"},{name:"Umbriel",category:"major",radius:.092,diameter:1169.4,color:7829367,type:"simple",distance:.00178,period:4.144,texture:"/assets/textures/umbriel.jpg",tidallyLocked:!0,axialTilt:0,mass:117e19,gravity:.234,meanTemp:75,discoveryYear:1851,discoveredBy:"William Lassell"},{name:"Titania",category:"major",radius:.123,diameter:1577.8,color:14535867,type:"simple",distance:.00291,period:8.706,texture:"/assets/textures/titania.jpg",tidallyLocked:!0,axialTilt:0,mass:353e19,gravity:.379,meanTemp:70,discoveryYear:1787,discoveredBy:"William Herschel"},{name:"Oberon",category:"major",radius:.119,diameter:1522.8,color:13417386,type:"simple",distance:.0039,period:13.463,texture:"/assets/textures/oberon.jpg",tidallyLocked:!0,axialTilt:0,mass:301e19,gravity:.346,meanTemp:75,discoveryYear:1787,discoveredBy:"William Herschel"}],Neptune:[{name:"Proteus",category:"major",radius:.033,diameter:420,color:8947848,type:"simple",distance:787e-6,period:1.122,texture:"/assets/textures/proteus.jpg",tidallyLocked:!0,axialTilt:0,mass:44e18,gravity:.07,meanTemp:51,discoveryYear:1989,discoveredBy:"Voyager 2"}]},th={Jupiter:[{name:"Metis",category:"small",radius:.0034,diameter:43,color:11176038,type:"simple",distance:861e-6,period:.295,tidallyLocked:!0,axialTilt:0,mass:36e15,gravity:.005,discoveryYear:1979,discoveredBy:"Voyager 1"},{name:"Adrastea",category:"small",radius:.00129,diameter:16.4,color:11176038,type:"simple",distance:861e-6,period:.298,tidallyLocked:!0,axialTilt:0,mass:2e15,gravity:.002,discoveryYear:1979,discoveredBy:"Voyager 2"},{name:"Amalthea",category:"small",radius:.0166,diameter:167,color:14518374,type:"simple",distance:.00121,period:.498,texture:"/assets/textures/amalthea.jpg",tidallyLocked:!0,axialTilt:0,mass:208e16,gravity:.02,discoveryYear:1892,discoveredBy:"Edward Barnard"},{name:"Thebe",category:"small",radius:.0077,diameter:98.6,color:11171669,type:"simple",distance:.00148,period:.675,tidallyLocked:!0,axialTilt:0,mass:43e16,gravity:.013,discoveryYear:1979,discoveredBy:"Voyager 1"}],Saturn:[{name:"Pan",category:"small",radius:.00222,diameter:28.2,color:13421772,type:"simple",distance:894e-6,period:.575,tidallyLocked:!0,axialTilt:0,mass:495e13,gravity:.006,discoveryYear:1990,discoveredBy:"Mark Showalter"},{name:"Epimetheus",category:"small",radius:.00907,diameter:115.2,color:12303291,type:"simple",distance:.001013,period:.695,tidallyLocked:!0,axialTilt:0,mass:527e15,gravity:.018,discoveryYear:1980,discoveredBy:"John Fountain, Stephen Larson"},{name:"Janus",category:"small",radius:.014,diameter:179.8,color:12303291,type:"simple",distance:.001013,period:.695,tidallyLocked:!0,axialTilt:0,mass:19e17,gravity:.027,discoveryYear:1980,discoveredBy:"Various"},{name:"Hyperion",category:"small",radius:.0212,diameter:270,color:13413e3,type:"simple",distance:.00994,period:21.277,tidallyLocked:!1,axialTilt:0,mass:558e16,gravity:.04,discoveryYear:1848,discoveredBy:"William Bond"},{name:"Phoebe",category:"small",radius:.0168,diameter:213,color:6706500,type:"simple",distance:.0865,period:550.48,texture:"/assets/textures/phoebe.jpg",tidallyLocked:!1,axialTilt:0,mass:829e16,gravity:.039,discoveryYear:1899,discoveredBy:"William Pickering"}],Uranus:[{name:"Cordelia",category:"small",radius:.0032,diameter:40.2,color:8947848,type:"simple",distance:334e-6,period:.335,tidallyLocked:!0,axialTilt:0,mass:45e15,gravity:.008,discoveryYear:1986,discoveredBy:"Voyager 2"},{name:"Ophelia",category:"small",radius:.0034,diameter:42.8,color:8947848,type:"simple",distance:357e-6,period:.376,tidallyLocked:!0,axialTilt:0,mass:53e15,gravity:.009,discoveryYear:1986,discoveredBy:"Voyager 2"},{name:"Puck",category:"small",radius:.0127,diameter:162,color:7829367,type:"simple",distance:574e-6,period:.762,texture:"/assets/textures/puck.jpg",tidallyLocked:!0,axialTilt:0,mass:29e17,gravity:.029,discoveryYear:1985,discoveredBy:"Voyager 2"}],Neptune:[{name:"Naiad",category:"small",radius:.0052,diameter:66,color:8947848,type:"simple",distance:323e-6,period:.294,tidallyLocked:!0,axialTilt:0,mass:19e16,gravity:.011,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Thalassa",category:"small",radius:.0065,diameter:82,color:8947848,type:"simple",distance:336e-6,period:.311,tidallyLocked:!0,axialTilt:0,mass:37e16,gravity:.013,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Despina",category:"small",radius:.0118,diameter:150,color:8947848,type:"simple",distance:351e-6,period:.335,tidallyLocked:!0,axialTilt:0,mass:21e17,gravity:.023,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Galatea",category:"small",radius:.0138,diameter:176,color:8947848,type:"simple",distance:413e-6,period:.429,tidallyLocked:!0,axialTilt:0,mass:212e16,gravity:.025,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Larissa",category:"small",radius:.0153,diameter:194,color:7829367,type:"simple",distance:491e-6,period:.555,texture:"/assets/textures/larissa.jpg",tidallyLocked:!0,axialTilt:0,mass:42e17,gravity:.03,discoveryYear:1989,discoveredBy:"Voyager 2"},{name:"Nereid",category:"small",radius:.0268,diameter:340,color:11184810,type:"simple",distance:.0367,period:360.14,tidallyLocked:!1,axialTilt:0,mass:31e18,gravity:.059,discoveryYear:1949,discoveredBy:"Gerard Kuiper"}]};function zn(n){const t=[];return Jc[n]&&t.push(...Jc[n]),Qc[n]&&t.push(...Qc[n]),th[n]&&t.push(...th[n]),t}const Ov=[{name:"Mercury",category:"Terrestrial",body:"Mercury",radius:.38,color:11184810,period:88,texture:"/assets/textures/mercury.jpg",rotationPeriod:1408,axialTilt:.01,details:{mass:33e22,density:"5427 kg/m³",gravity:"0.38 g",albedo:"0.12",temp:"-173°C to 427°C",pressure:"~0 bar",solarDay:"176 days",siderealDay:"58.6 days",eccentricity:"0.205",inclination:"7.0°"},magneticField:{strength:1.5,tilt:0,color:65535}},{name:"Venus",category:"Terrestrial",body:"Venus",radius:.95,color:16763904,period:225,texture:"/assets/textures/venus.jpg",rotationPeriod:5832,axialTilt:177.4,details:{mass:487e22,density:"5243 kg/m³",gravity:"0.90 g",albedo:"0.75",temp:"462°C",pressure:"92 bar",solarDay:"116.75 days",siderealDay:"243 days",eccentricity:"0.007",inclination:"3.4°"}},{name:"Earth",category:"Terrestrial",body:"Earth",radius:1,color:2241535,period:365.25,texture:"/assets/textures/earth.jpg",cloudTexture:"/assets/textures/earth_clouds.png",rotationPeriod:24,axialTilt:23.4,details:{mass:597e22,density:"5514 kg/m³",gravity:"1.0 g",albedo:"0.30",temp:"-88°C to 58°C",pressure:"1.013 bar",solarDay:"24 h",siderealDay:"23h 56m",eccentricity:"0.017",inclination:"0.0°"},moons:zn("Earth"),magneticField:{strength:10,tilt:11.5,color:65535}},{name:"Mars",category:"Terrestrial",body:"Mars",radius:.53,color:16729088,period:687,texture:"/assets/textures/mars.jpg",rotationPeriod:24.6,axialTilt:25.2,details:{mass:642e21,density:"3933 kg/m³",gravity:"0.38 g",albedo:"0.16",temp:"-153°C to 20°C",pressure:"0.006 bar",solarDay:"24h 40m",siderealDay:"24h 37m",eccentricity:"0.094",inclination:"1.85°"},moons:zn("Mars")},{name:"Jupiter",category:"Gas Giant",body:"Jupiter",radius:11,color:13808780,period:4333,texture:"/assets/textures/jupiter.jpg",rotationPeriod:9.9,axialTilt:3.1,details:{mass:1898e24,density:"1326 kg/m³",gravity:"2.53 g",albedo:"0.34",temp:"-108°C",pressure:"n/a",solarDay:"9h 56m",siderealDay:"9h 55m",eccentricity:"0.049",inclination:"1.3°"},moons:zn("Jupiter"),magneticField:{strength:65,tilt:9.6,color:65535}},{name:"Saturn",category:"Gas Giant",body:"Saturn",radius:9,color:15645576,period:10759,texture:"/assets/textures/saturn.jpg",rotationPeriod:10.7,axialTilt:26.7,ring:{inner:11,outer:18,color:11176038,texture:"/assets/textures/saturn_ring.png"},details:{mass:568e24,density:"687 kg/m³",gravity:"1.07 g",albedo:"0.34",temp:"-139°C",pressure:"n/a",solarDay:"10h 33m",siderealDay:"10h 33m",eccentricity:"0.057",inclination:"2.49°"},moons:zn("Saturn"),magneticField:{strength:20,tilt:0,color:65535}},{name:"Uranus",category:"Ice Giant",body:"Uranus",radius:4,color:5230823,period:30687,texture:"/assets/textures/uranus.jpg",rotationPeriod:17.2,axialTilt:97.8,details:{mass:868e23,density:"1271 kg/m³",gravity:"0.89 g",albedo:"0.30",temp:"-197°C",pressure:"n/a",solarDay:"17h 14m",siderealDay:"17h 14m",eccentricity:"0.046",inclination:"0.77°"},moons:zn("Uranus"),magneticField:{strength:18,tilt:59,color:65535}},{name:"Neptune",category:"Ice Giant",body:"Neptune",radius:3.9,color:4944093,period:60190,texture:"/assets/textures/neptune.jpg",rotationPeriod:16.1,axialTilt:28.3,details:{mass:102e24,density:"1638 kg/m³",gravity:"1.14 g",albedo:"0.29",temp:"-201°C",pressure:"n/a (Gas Giant)",solarDay:"16h 6m",siderealDay:"16h 6m",eccentricity:"0.011",inclination:"1.77°"},moons:zn("Neptune"),magneticField:{strength:24,tilt:47,color:65535}}],zv=[{name:"Ceres",type:"dwarf",radius:.07,color:11184810,period:1682,texture:"/assets/textures/ceres.jpg",rotationPeriod:9.1,axialTilt:4,elements:{a:2.767,e:.079,i:10.59,Omega:80.33,w:73.51,M:77.37},details:{mass:9e20,density:"2162 kg/m³",gravity:"0.03 g",albedo:"0.09",temp:"-105°C to -38°C",pressure:"0",solarDay:"9h 4m",siderealDay:"9h 4m",eccentricity:"0.079",inclination:"10.59°"}},{name:"Pluto",type:"dwarf",body:"Pluto",radius:.18,color:14527112,period:90560,texture:"/assets/textures/pluto.png",rotationPeriod:153.3,axialTilt:122.5,details:{mass:13e21,density:"1860 kg/m³",gravity:"0.06 g",albedo:"0.5",temp:"-240°C to -218°C",pressure:"0.00001 bar",solarDay:"6.39 days",siderealDay:"6.39 days",eccentricity:"0.248",inclination:"17.16°"}},{name:"Haumea",type:"dwarf",radius:.13,color:15658734,period:103468,texture:"/assets/textures/haumea.png",rotationPeriod:3.9,axialTilt:0,elements:{a:43.18,e:.195,i:28.21,Omega:122.16,w:238.78,M:219.87},details:{mass:4e21,density:"1885 kg/m³",gravity:"0.04 g",albedo:"0.7",temp:"-241°C",pressure:"0",solarDay:"3.9 h",siderealDay:"3.9 h",eccentricity:"0.195",inclination:"28.21°"}},{name:"Makemake",type:"dwarf",radius:.11,color:14531481,period:112897,texture:"/assets/textures/makemake.jpg",rotationPeriod:22.5,axialTilt:0,elements:{a:45.43,e:.161,i:28.98,Omega:79.62,w:294.84,M:200},details:{mass:3e21,density:"1700 kg/m³",gravity:"0.05 g",albedo:"0.7",temp:"-243°C",pressure:"0",solarDay:"22.5 h",siderealDay:"22.5 h",eccentricity:"0.161",inclination:"28.98°"}},{name:"Eris",type:"dwarf",radius:.18,color:16777215,period:203830,texture:"/assets/textures/eris.jpg",rotationPeriod:25.9,axialTilt:0,elements:{a:67.86,e:.436,i:44.04,Omega:35.95,w:151.64,M:200},details:{mass:16e21,density:"2520 kg/m³",gravity:"0.08 g",albedo:"0.96",temp:"-243°C to -217°C",pressure:"0",solarDay:"25.9 h",siderealDay:"25.9 h",eccentricity:"0.436",inclination:"44.04°"}}];function Bv(n){const t=new Uint8Array([255,200,0,255]),e=new Vg(t,1,1,ai);e.needsUpdate=!0;const i=new Ls({color:16777215,map:e,side:Li});return i.onBeforeCompile=s=>{s.uniforms.uTime=n.uTime,s.fragmentShader=s.fragmentShader.replace("#include <common>",`
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
      `)},i}function Gv(n,t){if(!n.ring)return;const e=new Br(n.ring.inner,n.ring.outer,128),i=e.attributes.position,s=new E;for(let o=0;o<i.count;o++){s.fromBufferAttribute(i,o);const c=(s.length()-n.ring.inner)/(n.ring.outer-n.ring.inner);e.attributes.uv.setXY(o,c,0)}let r;if(n.name==="Saturn"){const o=kv();r=new Wn({map:o,side:Je,transparent:!0,opacity:.9,roughness:.8,metalness:.2})}else n.ring.texture?(r=new Wn({side:Je,transparent:!0,opacity:1}),Qn.loadTexture(n.ring.texture,r,n.name)):r=new Wn({color:n.ring.color,side:Je,transparent:!0,opacity:.8});const a=new Ne(e,r);a.rotation.x=Math.PI/2,t.add(a)}function kv(){const n=document.createElement("canvas");n.width=1024,n.height=1;const t=n.getContext("2d"),e=t.createLinearGradient(0,0,1024,0);e.addColorStop(0,"rgba(30, 30, 30, 0.0)"),e.addColorStop(.1,"rgba(30, 30, 30, 0.1)"),e.addColorStop(.15,"rgba(40, 40, 40, 0.2)"),e.addColorStop(.25,"rgba(180, 170, 150, 0.8)"),e.addColorStop(.35,"rgba(200, 190, 170, 0.9)"),e.addColorStop(.4,"rgba(210, 200, 180, 1.0)"),e.addColorStop(.45,"rgba(190, 180, 160, 0.9)"),e.addColorStop(.5,"rgba(170, 160, 140, 0.8)"),e.addColorStop(.55,"rgba(20, 20, 20, 0.1)"),e.addColorStop(.58,"rgba(20, 20, 20, 0.1)"),e.addColorStop(.6,"rgba(160, 150, 130, 0.7)"),e.addColorStop(.7,"rgba(170, 160, 140, 0.8)"),e.addColorStop(.8,"rgba(160, 150, 130, 0.7)"),e.addColorStop(.85,"rgba(20, 20, 20, 0.2)"),e.addColorStop(.86,"rgba(20, 20, 20, 0.2)"),e.addColorStop(.88,"rgba(150, 140, 120, 0.6)"),e.addColorStop(1,"rgba(140, 130, 110, 0.0)"),t.fillStyle=e,t.fillRect(0,0,1024,1);const i=new Vh(n);return i.wrapS=We,i.wrapT=We,i}function Hv(n){const t=new Yi(4.65,64,64),e={uTime:{value:0}},i=Bv(e);Qn.loadTexture("/assets/textures/sun.jpg",i,"Sun");const s=new Ne(t,i);n.add(s),s.userData.customUniforms=e;const r=4.65*2.5,a=new Zt().setFromPoints([new E(0,-r,0),new E(0,r,0)]),o=new He({color:16777215,transparent:!0,opacity:.5}),l=new qe(a,o);return l.visible=R.showAxes,l.raycast=()=>{},s.add(l),s.axisLine=l,s}function Vv(n,t){const e=[],i=[],s=Hv(n);return[...Ov,...zv].forEach(a=>{const o=new Me;n.add(o);const l=new Yi(a.radius,32,32),c=new Wn({color:a.color});a.texture&&Qn.loadTexture(a.texture,c,a.name);const h=new Ne(l,c);if(h.castShadow=!0,h.receiveShadow=!0,o.add(h),h.scale.setScalar(R.planetScale),a.axialTilt!==void 0){const v=a.axialTilt*Math.PI/180;h.rotation.z=v}const u=a.radius*2.5,f=new Zt().setFromPoints([new E(0,-u,0),new E(0,u,0)]),p=new He({color:16777215,transparent:!0,opacity:.5}),g=new qe(f,p);if(g.visible=R.showAxes,g.raycast=()=>{},h.add(g),a.axisLine=g,a.name==="Earth"?h.layers.set(1):h.layers.set(0),a.name==="Earth"&&a.cloudTexture){const v=new Yi(a.radius*1.01,32,32),x=new Wn({transparent:!0,opacity:1,depthWrite:!1}),C=new Ne(v,x);C.visible=!1,C.layers.set(1),Qn.loadTexture(a.cloudTexture,x,"Earth Clouds",!1,null,"alphaMap"),h.add(C),a.cloudMesh=C}const _=new Me;o.add(_),Gv(a,h);const m=O_(a,t),d=I_(a,o,_),y={group:o,mesh:h,data:a,moons:d,orbitLinesGroup:_,orbitLine:m};e.push(y),a.type==="dwarf"&&i.push(y)}),{planets:e,sun:s,dwarfPlanets:i}}function Wv(n,t=null,e=null){if(t){const i=new Date("2000-01-01T12:00:00Z").getTime(),r=(R.date.getTime()-i)/(1e3*60*60),o=r/600*2*Math.PI;t.rotation.y=o,t.userData.customUniforms&&(t.userData.customUniforms.uTime.value=r*.1%1e4)}n.forEach(i=>{if(i.data.body){const a=ti(bt[i.data.body],R.date);i.mesh.position.x=a.x*$t,i.mesh.position.z=-a.y*$t,i.mesh.position.y=a.z*$t}else if(i.data.elements){const a=jr(i.data.elements,R.date);i.mesh.position.x=a.x*$t,i.mesh.position.z=-a.y*$t}if(i.data.name==="Earth"&&e){e.target=i.mesh;const a=i.data.radius*R.planetScale,o=i.mesh.position.length(),l=a*4,c=Math.atan(l/o);e.angle=c*1.2,e.shadow.camera.updateProjectionMatrix()}if(!R.stop&&i.data.cloudMesh){const a=new Date("2000-01-01T12:00:00Z").getTime(),h=(R.date.getTime()-a)/(1e3*60*60)/240*2*Math.PI;i.data.cloudMesh.rotation.y=h}if(i.orbitLinesGroup&&i.orbitLinesGroup.position.copy(i.mesh.position),i.data.rotationPeriod){const a=new Date("2000-01-01T12:00:00Z").getTime(),c=(R.date.getTime()-a)/(1e3*60*60)/i.data.rotationPeriod*2*Math.PI;i.mesh.rotation.y=c}const r=i.data.name==="Earth"?1:0;i.mesh.layers.mask!==1<<r&&i.mesh.layers.set(r),U_(i,n),i.moons.forEach(a=>{a.mesh.layers.mask!==1<<r&&a.mesh.layers.set(r)})})}const St={IDLE:Symbol(),ROTATE:Symbol(),PAN:Symbol(),SCALE:Symbol(),FOV:Symbol(),FOCUS:Symbol(),ZROTATE:Symbol(),ANIMATION_FOCUS:Symbol(),ANIMATION_ROTATE:Symbol()},Qt={NONE:Symbol(),ONE_FINGER:Symbol(),ONE_FINGER_SWITCHED:Symbol(),TWO_FINGER:Symbol(),MULT_FINGER:Symbol(),CURSOR:Symbol()},Nt={x:0,y:0},Ke={camera:new kt,gizmos:new kt},ae={type:"change"},di={type:"start"},ni={type:"end"},Xv=new Fo,ve=new E,eh=new kt,ih=new kt,ui=new E;class $v extends gn{constructor(t,e,i=null){super(),this.camera=null,this.domElement=e,this.scene=i,this.target=new E,this._currentTarget=new E,this.radiusFactor=.67,this.mouseActions=[],this._mouseOp=null,this._v2_1=new _t,this._v3_1=new E,this._v3_2=new E,this._m4_1=new kt,this._m4_2=new kt,this._quat=new ts,this._translationMatrix=new kt,this._rotationMatrix=new kt,this._scaleMatrix=new kt,this._rotationAxis=new E,this._cameraMatrixState=new kt,this._cameraProjectionState=new kt,this._fovState=1,this._upState=new E,this._zoomState=1,this._nearPos=0,this._farPos=0,this._gizmoMatrixState=new kt,this._up0=new E,this._zoom0=1,this._fov0=0,this._initialNear=0,this._nearPos0=0,this._initialFar=0,this._farPos0=0,this._cameraMatrixState0=new kt,this._gizmoMatrixState0=new kt,this._button=-1,this._touchStart=[],this._touchCurrent=[],this._input=Qt.NONE,this._switchSensibility=32,this._startFingerDistance=0,this._currentFingerDistance=0,this._startFingerRotation=0,this._currentFingerRotation=0,this._devPxRatio=0,this._downValid=!0,this._nclicks=0,this._downEvents=[],this._downStart=0,this._clickStart=0,this._maxDownTime=250,this._maxInterval=300,this._posThreshold=24,this._movementThreshold=24,this._currentCursorPosition=new E,this._startCursorPosition=new E,this._grid=null,this._gridPosition=new E,this._gizmos=new Me,this._curvePts=128,this._timeStart=-1,this._animationId=-1,this.focusAnimationTime=500,this._timePrev=0,this._timeCurrent=0,this._anglePrev=0,this._angleCurrent=0,this._cursorPosPrev=new E,this._cursorPosCurr=new E,this._wPrev=0,this._wCurr=0,this.adjustNearFar=!1,this.scaleFactor=1.1,this.dampingFactor=25,this.wMax=20,this.enableAnimations=!0,this.enableGrid=!1,this.cursorZoom=!1,this.minFov=5,this.maxFov=90,this.rotateSpeed=1,this.enabled=!0,this.enablePan=!0,this.enableRotate=!0,this.enableZoom=!0,this.enableGizmos=!0,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this._tbRadius=1,this._state=St.IDLE,this.setCamera(t),this.scene!=null&&this.scene.add(this._gizmos),this.domElement.style.touchAction="none",this._devPxRatio=window.devicePixelRatio,this.initializeMouseActions(),this._onContextMenu=Yv.bind(this),this._onWheel=Qv.bind(this),this._onPointerUp=Jv.bind(this),this._onPointerMove=Kv.bind(this),this._onPointerDown=Zv.bind(this),this._onPointerCancel=jv.bind(this),this._onWindowResize=qv.bind(this),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onWheel),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),window.addEventListener("resize",this._onWindowResize)}onSinglePanStart(t,e){if(this.enabled)switch(this.dispatchEvent(di),this.setCenter(t.clientX,t.clientY),e){case"PAN":if(!this.enablePan)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(ae)),this.updateTbState(St.PAN,!0),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement)),this.enableGrid&&(this.drawGrid(),this.dispatchEvent(ae));break;case"ROTATE":if(!this.enableRotate)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1),this.updateTbState(St.ROTATE,!0),this._startCursorPosition.copy(this.unprojectOnTbSurface(this.camera,Nt.x,Nt.y,this.domElement,this._tbRadius)),this.activateGizmos(!0),this.enableAnimations&&(this._timePrev=this._timeCurrent=performance.now(),this._angleCurrent=this._anglePrev=0,this._cursorPosPrev.copy(this._startCursorPosition),this._cursorPosCurr.copy(this._cursorPosPrev),this._wCurr=0,this._wPrev=this._wCurr),this.dispatchEvent(ae);break;case"FOV":if(!this.camera.isPerspectiveCamera||!this.enableZoom)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(ae)),this.updateTbState(St.FOV,!0),this._startCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition);break;case"ZOOM":if(!this.enableZoom)return;this._animationId!=-1&&(cancelAnimationFrame(this._animationId),this._animationId=-1,this._timeStart=-1,this.activateGizmos(!1),this.dispatchEvent(ae)),this.updateTbState(St.SCALE,!0),this._startCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition);break}}onSinglePanMove(t,e){if(this.enabled){const i=e!=this._state;switch(this.setCenter(t.clientX,t.clientY),e){case St.PAN:this.enablePan&&(i?(this.dispatchEvent(ni),this.dispatchEvent(di),this.updateTbState(e,!0),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement)),this.enableGrid&&this.drawGrid(),this.activateGizmos(!1)):(this._currentCursorPosition.copy(this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement)),this.applyTransformMatrix(this.pan(this._startCursorPosition,this._currentCursorPosition))));break;case St.ROTATE:if(this.enableRotate)if(i)this.dispatchEvent(ni),this.dispatchEvent(di),this.updateTbState(e,!0),this._startCursorPosition.copy(this.unprojectOnTbSurface(this.camera,Nt.x,Nt.y,this.domElement,this._tbRadius)),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!0);else{this._currentCursorPosition.copy(this.unprojectOnTbSurface(this.camera,Nt.x,Nt.y,this.domElement,this._tbRadius));const s=this._startCursorPosition.distanceTo(this._currentCursorPosition),r=this._startCursorPosition.angleTo(this._currentCursorPosition),a=Math.max(s/this._tbRadius,r)*this.rotateSpeed;this.applyTransformMatrix(this.rotate(this.calculateRotationAxis(this._startCursorPosition,this._currentCursorPosition),a)),this.enableAnimations&&(this._timePrev=this._timeCurrent,this._timeCurrent=performance.now(),this._anglePrev=this._angleCurrent,this._angleCurrent=a,this._cursorPosPrev.copy(this._cursorPosCurr),this._cursorPosCurr.copy(this._currentCursorPosition),this._wPrev=this._wCurr,this._wCurr=this.calculateAngularSpeed(this._anglePrev,this._angleCurrent,this._timePrev,this._timeCurrent))}break;case St.SCALE:if(this.enableZoom)if(i)this.dispatchEvent(ni),this.dispatchEvent(di),this.updateTbState(e,!0),this._startCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1);else{this._currentCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let a=1;r<0?a=1/Math.pow(this.scaleFactor,-r*8):r>0&&(a=Math.pow(this.scaleFactor,r*8)),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState),this.applyTransformMatrix(this.scale(a,this._v3_1))}break;case St.FOV:if(this.enableZoom&&this.camera.isPerspectiveCamera)if(i)this.dispatchEvent(ni),this.dispatchEvent(di),this.updateTbState(e,!0),this._startCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1);else{this._currentCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let a=1;r<0?a=1/Math.pow(this.scaleFactor,-r*8):r>0&&(a=Math.pow(this.scaleFactor,r*8)),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const o=this._v3_1.distanceTo(this._gizmos.position);let l=o/a;l=oe.clamp(l,this.minDistance,this.maxDistance);const c=o*Math.tan(oe.DEG2RAD*this._fovState*.5);let h=oe.RAD2DEG*(Math.atan(c/l)*2);h=oe.clamp(h,this.minFov,this.maxFov);const u=c/Math.tan(oe.DEG2RAD*(h/2));a=o/u,this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),this.setFov(h),this.applyTransformMatrix(this.scale(a,this._v3_2,!1)),ve.copy(this._gizmos.position).sub(this.camera.position).normalize().multiplyScalar(u/o),this._m4_1.makeTranslation(ve.x,ve.y,ve.z)}break}this.dispatchEvent(ae)}}onSinglePanEnd(){if(this._state==St.ROTATE){if(!this.enableRotate)return;if(this.enableAnimations)if(performance.now()-this._timeCurrent<120){const e=Math.abs((this._wPrev+this._wCurr)/2),i=this;this._animationId=window.requestAnimationFrame(function(s){i.updateTbState(St.ANIMATION_ROTATE,!0);const r=i.calculateRotationAxis(i._cursorPosPrev,i._cursorPosCurr);i.onRotationAnim(s,r,Math.min(e,i.wMax))})}else this.updateTbState(St.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(ae);else this.updateTbState(St.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(ae)}else(this._state==St.PAN||this._state==St.IDLE)&&(this.updateTbState(St.IDLE,!1),this.enableGrid&&this.disposeGrid(),this.activateGizmos(!1),this.dispatchEvent(ae));this.dispatchEvent(ni)}onDoubleTap(t){if(this.enabled&&this.enablePan&&this.scene!=null){this.dispatchEvent(di),this.setCenter(t.clientX,t.clientY);const e=this.unprojectOnObj(this.getCursorNDC(Nt.x,Nt.y,this.domElement),this.camera);if(e!=null&&this.enableAnimations){const i=this;this._animationId!=-1&&window.cancelAnimationFrame(this._animationId),this._timeStart=-1,this._animationId=window.requestAnimationFrame(function(s){i.updateTbState(St.ANIMATION_FOCUS,!0),i.onFocusAnim(s,e,i._cameraMatrixState,i._gizmoMatrixState)})}else e!=null&&!this.enableAnimations&&(this.updateTbState(St.FOCUS,!0),this.focus(e,this.scaleFactor),this.updateTbState(St.IDLE,!1),this.dispatchEvent(ae))}this.dispatchEvent(ni)}onDoublePanStart(){this.enabled&&this.enablePan&&(this.dispatchEvent(di),this.updateTbState(St.PAN,!0),this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2),this._startCursorPosition.copy(this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement,!0)),this._currentCursorPosition.copy(this._startCursorPosition),this.activateGizmos(!1))}onDoublePanMove(){this.enabled&&this.enablePan&&(this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2),this._state!=St.PAN&&(this.updateTbState(St.PAN,!0),this._startCursorPosition.copy(this._currentCursorPosition)),this._currentCursorPosition.copy(this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement,!0)),this.applyTransformMatrix(this.pan(this._startCursorPosition,this._currentCursorPosition,!0)),this.dispatchEvent(ae))}onDoublePanEnd(){this.updateTbState(St.IDLE,!1),this.dispatchEvent(ni)}onRotateStart(){this.enabled&&this.enableRotate&&(this.dispatchEvent(di),this.updateTbState(St.ZROTATE,!0),this._startFingerRotation=this.getAngle(this._touchCurrent[1],this._touchCurrent[0])+this.getAngle(this._touchStart[1],this._touchStart[0]),this._currentFingerRotation=this._startFingerRotation,this.camera.getWorldDirection(this._rotationAxis),!this.enablePan&&!this.enableZoom&&this.activateGizmos(!0))}onRotateMove(){if(this.enabled&&this.enableRotate){this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2);let t;this._state!=St.ZROTATE&&(this.updateTbState(St.ZROTATE,!0),this._startFingerRotation=this._currentFingerRotation),this._currentFingerRotation=this.getAngle(this._touchCurrent[1],this._touchCurrent[0])+this.getAngle(this._touchStart[1],this._touchStart[0]),this.enablePan?(this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),t=this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._v3_2)):t=new E().setFromMatrixPosition(this._gizmoMatrixState);const e=oe.DEG2RAD*(this._startFingerRotation-this._currentFingerRotation);this.applyTransformMatrix(this.zRotate(t,e)),this.dispatchEvent(ae)}}onRotateEnd(){this.updateTbState(St.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(ni)}onPinchStart(){this.enabled&&this.enableZoom&&(this.dispatchEvent(di),this.updateTbState(St.SCALE,!0),this._startFingerDistance=this.calculatePointersDistance(this._touchCurrent[0],this._touchCurrent[1]),this._currentFingerDistance=this._startFingerDistance,this.activateGizmos(!1))}onPinchMove(){if(this.enabled&&this.enableZoom){this.setCenter((this._touchCurrent[0].clientX+this._touchCurrent[1].clientX)/2,(this._touchCurrent[0].clientY+this._touchCurrent[1].clientY)/2);const t=12;this._state!=St.SCALE&&(this._startFingerDistance=this._currentFingerDistance,this.updateTbState(St.SCALE,!0)),this._currentFingerDistance=Math.max(this.calculatePointersDistance(this._touchCurrent[0],this._touchCurrent[1]),t*this._devPxRatio);const e=this._currentFingerDistance/this._startFingerDistance;let i;this.enablePan?this.camera.isOrthographicCamera?i=this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._gizmos.position):this.camera.isPerspectiveCamera&&(i=this.unprojectOnTbPlane(this.camera,Nt.x,Nt.y,this.domElement).applyQuaternion(this.camera.quaternion).add(this._gizmos.position)):i=this._gizmos.position,this.applyTransformMatrix(this.scale(e,i)),this.dispatchEvent(ae)}}onPinchEnd(){this.updateTbState(St.IDLE,!1),this.dispatchEvent(ni)}onTriplePanStart(){if(this.enabled&&this.enableZoom){this.dispatchEvent(di),this.updateTbState(St.SCALE,!0);let t=0,e=0;const i=this._touchCurrent.length;for(let s=0;s<i;s++)t+=this._touchCurrent[s].clientX,e+=this._touchCurrent[s].clientY;this.setCenter(t/i,e/i),this._startCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5),this._currentCursorPosition.copy(this._startCursorPosition)}}onTriplePanMove(){if(this.enabled&&this.enableZoom){let t=0,e=0;const i=this._touchCurrent.length;for(let f=0;f<i;f++)t+=this._touchCurrent[f].clientX,e+=this._touchCurrent[f].clientY;this.setCenter(t/i,e/i);const s=8;this._currentCursorPosition.setY(this.getCursorNDC(Nt.x,Nt.y,this.domElement).y*.5);const r=this._currentCursorPosition.y-this._startCursorPosition.y;let a=1;r<0?a=1/Math.pow(this.scaleFactor,-r*s):r>0&&(a=Math.pow(this.scaleFactor,r*s)),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const o=this._v3_1.distanceTo(this._gizmos.position);let l=o/a;l=oe.clamp(l,this.minDistance,this.maxDistance);const c=o*Math.tan(oe.DEG2RAD*this._fovState*.5);let h=oe.RAD2DEG*(Math.atan(c/l)*2);h=oe.clamp(h,this.minFov,this.maxFov);const u=c/Math.tan(oe.DEG2RAD*(h/2));a=o/u,this._v3_2.setFromMatrixPosition(this._gizmoMatrixState),this.setFov(h),this.applyTransformMatrix(this.scale(a,this._v3_2,!1)),ve.copy(this._gizmos.position).sub(this.camera.position).normalize().multiplyScalar(u/o),this._m4_1.makeTranslation(ve.x,ve.y,ve.z),this.dispatchEvent(ae)}}onTriplePanEnd(){this.updateTbState(St.IDLE,!1),this.dispatchEvent(ni)}setCenter(t,e){Nt.x=t,Nt.y=e}initializeMouseActions(){this.setMouseAction("PAN",0,"CTRL"),this.setMouseAction("PAN",2),this.setMouseAction("ROTATE",0),this.setMouseAction("ZOOM","WHEEL"),this.setMouseAction("ZOOM",1),this.setMouseAction("FOV","WHEEL","SHIFT"),this.setMouseAction("FOV",1,"SHIFT")}compareMouseAction(t,e){return t.operation==e.operation?t.mouse==e.mouse&&t.key==e.key:!1}setMouseAction(t,e,i=null){const s=["PAN","ROTATE","ZOOM","FOV"],r=[0,1,2,"WHEEL"],a=["CTRL","SHIFT",null];let o;if(!s.includes(t)||!r.includes(e)||!a.includes(i)||e=="WHEEL"&&t!="ZOOM"&&t!="FOV")return!1;switch(t){case"PAN":o=St.PAN;break;case"ROTATE":o=St.ROTATE;break;case"ZOOM":o=St.SCALE;break;case"FOV":o=St.FOV;break}const l={operation:t,mouse:e,key:i,state:o};for(let c=0;c<this.mouseActions.length;c++)if(this.mouseActions[c].mouse==l.mouse&&this.mouseActions[c].key==l.key)return this.mouseActions.splice(c,1,l),!0;return this.mouseActions.push(l),!0}unsetMouseAction(t,e=null){for(let i=0;i<this.mouseActions.length;i++)if(this.mouseActions[i].mouse==t&&this.mouseActions[i].key==e)return this.mouseActions.splice(i,1),!0;return!1}getOpFromAction(t,e){let i;for(let s=0;s<this.mouseActions.length;s++)if(i=this.mouseActions[s],i.mouse==t&&i.key==e)return i.operation;if(e!=null){for(let s=0;s<this.mouseActions.length;s++)if(i=this.mouseActions[s],i.mouse==t&&i.key==null)return i.operation}return null}getOpStateFromAction(t,e){let i;for(let s=0;s<this.mouseActions.length;s++)if(i=this.mouseActions[s],i.mouse==t&&i.key==e)return i.state;if(e!=null){for(let s=0;s<this.mouseActions.length;s++)if(i=this.mouseActions[s],i.mouse==t&&i.key==null)return i.state}return null}getAngle(t,e){return Math.atan2(e.clientY-t.clientY,e.clientX-t.clientX)*180/Math.PI}updateTouchEvent(t){for(let e=0;e<this._touchCurrent.length;e++)if(this._touchCurrent[e].pointerId==t.pointerId){this._touchCurrent.splice(e,1,t);break}}applyTransformMatrix(t){if(t.camera!=null&&(this._m4_1.copy(this._cameraMatrixState).premultiply(t.camera),this._m4_1.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.updateMatrix(),(this._state==St.ROTATE||this._state==St.ZROTATE||this._state==St.ANIMATION_ROTATE)&&this.camera.up.copy(this._upState).applyQuaternion(this.camera.quaternion)),t.gizmos!=null&&(this._m4_1.copy(this._gizmoMatrixState).premultiply(t.gizmos),this._m4_1.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.updateMatrix()),this._state==St.SCALE||this._state==St.FOCUS||this._state==St.ANIMATION_FOCUS)if(this._tbRadius=this.calculateTbRadius(this.camera),this.adjustNearFar){const e=this.camera.position.distanceTo(this._gizmos.position),i=new Ue;i.setFromObject(this._gizmos);const s=new es;i.getBoundingSphere(s);const r=Math.max(this._nearPos0,s.radius+s.center.length()),a=e-this._initialNear,o=Math.min(r,a);this.camera.near=e-o;const l=Math.min(this._farPos0,-s.radius+s.center.length()),c=e-this._initialFar,h=Math.min(l,c);this.camera.far=e-h,this.camera.updateProjectionMatrix()}else{let e=!1;this.camera.near!=this._initialNear&&(this.camera.near=this._initialNear,e=!0),this.camera.far!=this._initialFar&&(this.camera.far=this._initialFar,e=!0),e&&this.camera.updateProjectionMatrix()}}calculateAngularSpeed(t,e,i,s){const r=e-t,a=(s-i)/1e3;return a==0?0:r/a}calculatePointersDistance(t,e){return Math.sqrt(Math.pow(e.clientX-t.clientX,2)+Math.pow(e.clientY-t.clientY,2))}calculateRotationAxis(t,e){return this._rotationMatrix.extractRotation(this._cameraMatrixState),this._quat.setFromRotationMatrix(this._rotationMatrix),this._rotationAxis.crossVectors(t,e).applyQuaternion(this._quat),this._rotationAxis.normalize().clone()}calculateTbRadius(t){const e=t.position.distanceTo(this._gizmos.position);if(t.type=="PerspectiveCamera"){const i=oe.DEG2RAD*t.fov*.5,s=Math.atan(t.aspect*Math.tan(i));return Math.tan(Math.min(i,s))*e*this.radiusFactor}else if(t.type=="OrthographicCamera")return Math.min(t.top,t.right)*this.radiusFactor}focus(t,e,i=1){ve.copy(t).sub(this._gizmos.position).multiplyScalar(i),this._translationMatrix.makeTranslation(ve.x,ve.y,ve.z),eh.copy(this._gizmoMatrixState),this._gizmoMatrixState.premultiply(this._translationMatrix),this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),ih.copy(this._cameraMatrixState),this._cameraMatrixState.premultiply(this._translationMatrix),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.enableZoom&&this.applyTransformMatrix(this.scale(e,this._gizmos.position)),this._gizmoMatrixState.copy(eh),this._cameraMatrixState.copy(ih)}drawGrid(){if(this.scene!=null){let i,s,r,a;if(this.camera.isOrthographicCamera){const o=this.camera.right-this.camera.left,l=this.camera.bottom-this.camera.top;r=Math.max(o,l),a=r/20,i=r/this.camera.zoom*3,s=i/a*this.camera.zoom}else if(this.camera.isPerspectiveCamera){const o=this.camera.position.distanceTo(this._gizmos.position),l=oe.DEG2RAD*this.camera.fov*.5,c=Math.atan(this.camera.aspect*Math.tan(l));r=Math.tan(Math.max(l,c))*o*2,a=r/20,i=r*3,s=i/a}this._grid==null&&(this._grid=new m1(i,s,8947848,8947848),this._grid.position.copy(this._gizmos.position),this._gridPosition.copy(this._grid.position),this._grid.quaternion.copy(this.camera.quaternion),this._grid.rotateX(Math.PI*.5),this.scene.add(this._grid))}}dispose(){this._animationId!=-1&&window.cancelAnimationFrame(this._animationId),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),window.removeEventListener("resize",this._onWindowResize),this.scene!==null&&this.scene.remove(this._gizmos),this.disposeGrid()}disposeGrid(){this._grid!=null&&this.scene!=null&&(this.scene.remove(this._grid),this._grid=null)}easeOutCubic(t){return 1-Math.pow(1-t,3)}activateGizmos(t){const e=this._gizmos.children[0],i=this._gizmos.children[1],s=this._gizmos.children[2];t?(e.material.setValues({opacity:1}),i.material.setValues({opacity:1}),s.material.setValues({opacity:1})):(e.material.setValues({opacity:.6}),i.material.setValues({opacity:.6}),s.material.setValues({opacity:.6}))}getCursorNDC(t,e,i){const s=i.getBoundingClientRect();return this._v2_1.setX((t-s.left)/s.width*2-1),this._v2_1.setY((s.bottom-e)/s.height*2-1),this._v2_1.clone()}getCursorPosition(t,e,i){return this._v2_1.copy(this.getCursorNDC(t,e,i)),this._v2_1.x*=(this.camera.right-this.camera.left)*.5,this._v2_1.y*=(this.camera.top-this.camera.bottom)*.5,this._v2_1.clone()}setCamera(t){t.lookAt(this.target),t.updateMatrix(),t.type=="PerspectiveCamera"&&(this._fov0=t.fov,this._fovState=t.fov),this._cameraMatrixState0.copy(t.matrix),this._cameraMatrixState.copy(this._cameraMatrixState0),this._cameraProjectionState.copy(t.projectionMatrix),this._zoom0=t.zoom,this._zoomState=this._zoom0,this._initialNear=t.near,this._nearPos0=t.position.distanceTo(this.target)-t.near,this._nearPos=this._initialNear,this._initialFar=t.far,this._farPos0=t.position.distanceTo(this.target)-t.far,this._farPos=this._initialFar,this._up0.copy(t.up),this._upState.copy(t.up),this.camera=t,this.camera.updateProjectionMatrix(),this._tbRadius=this.calculateTbRadius(t),this.makeGizmos(this.target,this._tbRadius)}setGizmosVisible(t){this._gizmos.visible=t,this.dispatchEvent(ae)}setTbRadius(t){this.radiusFactor=t,this._tbRadius=this.calculateTbRadius(this.camera);const i=new Vn(0,0,this._tbRadius,this._tbRadius).getPoints(this._curvePts),s=new Zt().setFromPoints(i);for(const r in this._gizmos.children)this._gizmos.children[r].geometry=s;this.dispatchEvent(ae)}makeGizmos(t,e){const s=new Vn(0,0,e,e).getPoints(this._curvePts),r=new Zt().setFromPoints(s),a=new He({color:16744576,fog:!1,transparent:!0,opacity:.6}),o=new He({color:8454016,fog:!1,transparent:!0,opacity:.6}),l=new He({color:8421631,fog:!1,transparent:!0,opacity:.6}),c=new qe(r,a),h=new qe(r,o),u=new qe(r,l),f=Math.PI*.5;if(c.rotation.x=f,h.rotation.y=f,this._gizmoMatrixState0.identity().setPosition(t),this._gizmoMatrixState.copy(this._gizmoMatrixState0),this.camera.zoom!==1){const p=1/this.camera.zoom;this._scaleMatrix.makeScale(p,p,p),this._translationMatrix.makeTranslation(-t.x,-t.y,-t.z),this._gizmoMatrixState.premultiply(this._translationMatrix).premultiply(this._scaleMatrix),this._translationMatrix.makeTranslation(t.x,t.y,t.z),this._gizmoMatrixState.premultiply(this._translationMatrix)}this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.traverse(function(p){p.isLine&&(p.geometry.dispose(),p.material.dispose())}),this._gizmos.clear(),this._gizmos.add(c),this._gizmos.add(h),this._gizmos.add(u)}onFocusAnim(t,e,i,s){if(this._timeStart==-1&&(this._timeStart=t),this._state==St.ANIMATION_FOCUS){const a=(t-this._timeStart)/this.focusAnimationTime;if(this._gizmoMatrixState.copy(s),a>=1)this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.focus(e,this.scaleFactor),this._timeStart=-1,this.updateTbState(St.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(ae);else{const o=this.easeOutCubic(a),l=1-o+this.scaleFactor*o;this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.focus(e,l,o),this.dispatchEvent(ae);const c=this;this._animationId=window.requestAnimationFrame(function(h){c.onFocusAnim(h,e,i,s.clone())})}}else this._animationId=-1,this._timeStart=-1}onRotationAnim(t,e,i){if(this._timeStart==-1&&(this._anglePrev=0,this._angleCurrent=0,this._timeStart=t),this._state==St.ANIMATION_ROTATE){const s=(t-this._timeStart)/1e3;if(i+-this.dampingFactor*s>0){this._angleCurrent=.5*-this.dampingFactor*Math.pow(s,2)+i*s+0,this.applyTransformMatrix(this.rotate(e,this._angleCurrent)),this.dispatchEvent(ae);const a=this;this._animationId=window.requestAnimationFrame(function(o){a.onRotationAnim(o,e,i)})}else this._animationId=-1,this._timeStart=-1,this.updateTbState(St.IDLE,!1),this.activateGizmos(!1),this.dispatchEvent(ae)}else this._animationId=-1,this._timeStart=-1,this._state!=St.ROTATE&&(this.activateGizmos(!1),this.dispatchEvent(ae))}pan(t,e,i=!1){const s=t.clone().sub(e);if(this.camera.isOrthographicCamera)s.multiplyScalar(1/this.camera.zoom);else if(this.camera.isPerspectiveCamera&&i){this._v3_1.setFromMatrixPosition(this._cameraMatrixState0),this._v3_2.setFromMatrixPosition(this._gizmoMatrixState0);const r=this._v3_1.distanceTo(this._v3_2)/this.camera.position.distanceTo(this._gizmos.position);s.multiplyScalar(1/r)}return this._v3_1.set(s.x,s.y,0).applyQuaternion(this.camera.quaternion),this._m4_1.makeTranslation(this._v3_1.x,this._v3_1.y,this._v3_1.z),this.setTransformationMatrices(this._m4_1,this._m4_1),Ke}reset(){this.camera.zoom=this._zoom0,this.camera.isPerspectiveCamera&&(this.camera.fov=this._fov0),this.camera.near=this._nearPos,this.camera.far=this._farPos,this._cameraMatrixState.copy(this._cameraMatrixState0),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.up.copy(this._up0),this.camera.updateMatrix(),this.camera.updateProjectionMatrix(),this._gizmoMatrixState.copy(this._gizmoMatrixState0),this._gizmoMatrixState0.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this._gizmos.updateMatrix(),this._tbRadius=this.calculateTbRadius(this.camera),this.makeGizmos(this._gizmos.position,this._tbRadius),this.camera.lookAt(this._gizmos.position),this.updateTbState(St.IDLE,!1),this.dispatchEvent(ae)}rotate(t,e){const i=this._gizmos.position;return this._translationMatrix.makeTranslation(-i.x,-i.y,-i.z),this._rotationMatrix.makeRotationAxis(t,-e),this._m4_1.makeTranslation(i.x,i.y,i.z),this._m4_1.multiply(this._rotationMatrix),this._m4_1.multiply(this._translationMatrix),this.setTransformationMatrices(this._m4_1),Ke}copyState(){let t;this.camera.isOrthographicCamera?t=JSON.stringify({arcballState:{cameraFar:this.camera.far,cameraMatrix:this.camera.matrix,cameraNear:this.camera.near,cameraUp:this.camera.up,cameraZoom:this.camera.zoom,gizmoMatrix:this._gizmos.matrix}}):this.camera.isPerspectiveCamera&&(t=JSON.stringify({arcballState:{cameraFar:this.camera.far,cameraFov:this.camera.fov,cameraMatrix:this.camera.matrix,cameraNear:this.camera.near,cameraUp:this.camera.up,cameraZoom:this.camera.zoom,gizmoMatrix:this._gizmos.matrix}})),navigator.clipboard.writeText(t)}pasteState(){const t=this;navigator.clipboard.readText().then(function(i){t.setStateFromJSON(i)})}saveState(){this._cameraMatrixState0.copy(this.camera.matrix),this._gizmoMatrixState0.copy(this._gizmos.matrix),this._nearPos=this.camera.near,this._farPos=this.camera.far,this._zoom0=this.camera.zoom,this._up0.copy(this.camera.up),this.camera.isPerspectiveCamera&&(this._fov0=this.camera.fov)}scale(t,e,i=!0){ui.copy(e);let s=1/t;if(this.camera.isOrthographicCamera){this.camera.zoom=this._zoomState,this.camera.zoom*=t,this.camera.zoom>this.maxZoom?(this.camera.zoom=this.maxZoom,s=this._zoomState/this.maxZoom):this.camera.zoom<this.minZoom&&(this.camera.zoom=this.minZoom,s=this._zoomState/this.minZoom),this.camera.updateProjectionMatrix(),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState),this._scaleMatrix.makeScale(s,s,s),this._translationMatrix.makeTranslation(-this._v3_1.x,-this._v3_1.y,-this._v3_1.z),this._m4_2.makeTranslation(this._v3_1.x,this._v3_1.y,this._v3_1.z).multiply(this._scaleMatrix),this._m4_2.multiply(this._translationMatrix),ui.sub(this._v3_1);const r=ui.clone().multiplyScalar(s);return ui.sub(r),this._m4_1.makeTranslation(ui.x,ui.y,ui.z),this._m4_2.premultiply(this._m4_1),this.setTransformationMatrices(this._m4_1,this._m4_2),Ke}else if(this.camera.isPerspectiveCamera){this._v3_1.setFromMatrixPosition(this._cameraMatrixState),this._v3_2.setFromMatrixPosition(this._gizmoMatrixState);let r=this._v3_1.distanceTo(ui),a=r-r*s;const o=r-a;if(o<this.minDistance?(s=this.minDistance/r,a=r-r*s):o>this.maxDistance&&(s=this.maxDistance/r,a=r-r*s),ve.copy(ui).sub(this._v3_1).normalize().multiplyScalar(a),this._m4_1.makeTranslation(ve.x,ve.y,ve.z),i){const l=this._v3_2;r=l.distanceTo(ui),a=r-r*s,ve.copy(ui).sub(this._v3_2).normalize().multiplyScalar(a),this._translationMatrix.makeTranslation(l.x,l.y,l.z),this._scaleMatrix.makeScale(s,s,s),this._m4_2.makeTranslation(ve.x,ve.y,ve.z).multiply(this._translationMatrix),this._m4_2.multiply(this._scaleMatrix),this._translationMatrix.makeTranslation(-l.x,-l.y,-l.z),this._m4_2.multiply(this._translationMatrix),this.setTransformationMatrices(this._m4_1,this._m4_2)}else this.setTransformationMatrices(this._m4_1);return Ke}}setFov(t){this.camera.isPerspectiveCamera&&(this.camera.fov=oe.clamp(t,this.minFov,this.maxFov),this.camera.updateProjectionMatrix())}setTransformationMatrices(t=null,e=null){t!=null?Ke.camera!=null?Ke.camera.copy(t):Ke.camera=t.clone():Ke.camera=null,e!=null?Ke.gizmos!=null?Ke.gizmos.copy(e):Ke.gizmos=e.clone():Ke.gizmos=null}zRotate(t,e){return this._rotationMatrix.makeRotationAxis(this._rotationAxis,e),this._translationMatrix.makeTranslation(-t.x,-t.y,-t.z),this._m4_1.makeTranslation(t.x,t.y,t.z),this._m4_1.multiply(this._rotationMatrix),this._m4_1.multiply(this._translationMatrix),this._v3_1.setFromMatrixPosition(this._gizmoMatrixState).sub(t),this._v3_2.copy(this._v3_1).applyAxisAngle(this._rotationAxis,e),this._v3_2.sub(this._v3_1),this._m4_2.makeTranslation(this._v3_2.x,this._v3_2.y,this._v3_2.z),this.setTransformationMatrices(this._m4_1,this._m4_2),Ke}getRaycaster(){return Xv}unprojectOnObj(t,e){const i=this.getRaycaster();i.near=e.near,i.far=e.far,i.setFromCamera(t,e);const s=i.intersectObjects(this.scene.children,!0);for(let r=0;r<s.length;r++)if(s[r].object.uuid!=this._gizmos.uuid&&s[r].face!=null)return s[r].point.clone();return null}unprojectOnTbSurface(t,e,i,s,r){if(t.type=="OrthographicCamera"){this._v2_1.copy(this.getCursorPosition(e,i,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,0);const a=Math.pow(this._v2_1.x,2),o=Math.pow(this._v2_1.y,2),l=Math.pow(this._tbRadius,2);return a+o<=l*.5?this._v3_1.setZ(Math.sqrt(l-(a+o))):this._v3_1.setZ(l*.5/Math.sqrt(a+o)),this._v3_1}else if(t.type=="PerspectiveCamera"){this._v2_1.copy(this.getCursorNDC(e,i,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,-1),this._v3_1.applyMatrix4(t.projectionMatrixInverse);const a=this._v3_1.clone().normalize(),o=t.position.distanceTo(this._gizmos.position),l=Math.pow(r,2),c=this._v3_1.z,h=Math.sqrt(Math.pow(this._v3_1.x,2)+Math.pow(this._v3_1.y,2));if(h==0)return a.set(this._v3_1.x,this._v3_1.y,r),a;const u=c/h,f=o;let p=Math.pow(u,2)+1,g=2*u*f,_=Math.pow(f,2)-l,m=Math.pow(g,2)-4*p*_;if(m>=0&&(this._v2_1.setX((-g-Math.sqrt(m))/(2*p)),this._v2_1.setY(u*this._v2_1.x+f),oe.RAD2DEG*this._v2_1.angle()>=45)){const v=Math.sqrt(Math.pow(this._v2_1.x,2)+Math.pow(o-this._v2_1.y,2));return a.multiplyScalar(v),a.z+=o,a}p=u,g=f,_=-l*.5,m=Math.pow(g,2)-4*p*_,this._v2_1.setX((-g-Math.sqrt(m))/(2*p)),this._v2_1.setY(u*this._v2_1.x+f);const d=Math.sqrt(Math.pow(this._v2_1.x,2)+Math.pow(o-this._v2_1.y,2));return a.multiplyScalar(d),a.z+=o,a}}unprojectOnTbPlane(t,e,i,s,r=!1){if(t.type=="OrthographicCamera")return this._v2_1.copy(this.getCursorPosition(e,i,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,0),this._v3_1.clone();if(t.type=="PerspectiveCamera"){this._v2_1.copy(this.getCursorNDC(e,i,s)),this._v3_1.set(this._v2_1.x,this._v2_1.y,-1),this._v3_1.applyMatrix4(t.projectionMatrixInverse);const a=this._v3_1.clone().normalize(),o=this._v3_1.z,l=Math.sqrt(Math.pow(this._v3_1.x,2)+Math.pow(this._v3_1.y,2));let c;if(r?c=this._v3_1.setFromMatrixPosition(this._cameraMatrixState0).distanceTo(this._v3_2.setFromMatrixPosition(this._gizmoMatrixState0)):c=t.position.distanceTo(this._gizmos.position),l==0)return a.set(0,0,0),a;const h=o/l,u=c,f=-u/h,p=Math.sqrt(Math.pow(u,2)+Math.pow(f,2));return a.multiplyScalar(p),a.z=0,a}}updateMatrixState(){this._cameraMatrixState.copy(this.camera.matrix),this._gizmoMatrixState.copy(this._gizmos.matrix),this.camera.isOrthographicCamera?(this._cameraProjectionState.copy(this.camera.projectionMatrix),this.camera.updateProjectionMatrix(),this._zoomState=this.camera.zoom):this.camera.isPerspectiveCamera&&(this._fovState=this.camera.fov)}updateTbState(t,e){this._state=t,e&&this.updateMatrixState()}update(){if(this.target.equals(this._currentTarget)===!1&&(this._gizmos.position.copy(this.target),this._tbRadius=this.calculateTbRadius(this.camera),this.makeGizmos(this.target,this._tbRadius),this._currentTarget.copy(this.target)),this.camera.isOrthographicCamera){if(this.camera.zoom>this.maxZoom||this.camera.zoom<this.minZoom){const e=oe.clamp(this.camera.zoom,this.minZoom,this.maxZoom);this.applyTransformMatrix(this.scale(e/this.camera.zoom,this._gizmos.position,!0))}}else if(this.camera.isPerspectiveCamera){const e=this.camera.position.distanceTo(this._gizmos.position);if(e>this.maxDistance+1e-6||e<this.minDistance-1e-6){const s=oe.clamp(e,this.minDistance,this.maxDistance);this.applyTransformMatrix(this.scale(s/e,this._gizmos.position)),this.updateMatrixState()}(this.camera.fov<this.minFov||this.camera.fov>this.maxFov)&&(this.camera.fov=oe.clamp(this.camera.fov,this.minFov,this.maxFov),this.camera.updateProjectionMatrix());const i=this._tbRadius;if(this._tbRadius=this.calculateTbRadius(this.camera),i<this._tbRadius-1e-6||i>this._tbRadius+1e-6){const s=(this._gizmos.scale.x+this._gizmos.scale.y+this._gizmos.scale.z)/3,r=this._tbRadius/s,o=new Vn(0,0,r,r).getPoints(this._curvePts),l=new Zt().setFromPoints(o);for(const c in this._gizmos.children)this._gizmos.children[c].geometry=l}}this.camera.lookAt(this._gizmos.position)}setStateFromJSON(t){const e=JSON.parse(t);if(e.arcballState!=null){this._cameraMatrixState.fromArray(e.arcballState.cameraMatrix.elements),this._cameraMatrixState.decompose(this.camera.position,this.camera.quaternion,this.camera.scale),this.camera.up.copy(e.arcballState.cameraUp),this.camera.near=e.arcballState.cameraNear,this.camera.far=e.arcballState.cameraFar,this.camera.zoom=e.arcballState.cameraZoom,this.camera.isPerspectiveCamera&&(this.camera.fov=e.arcballState.cameraFov),this._gizmoMatrixState.fromArray(e.arcballState.gizmoMatrix.elements),this._gizmoMatrixState.decompose(this._gizmos.position,this._gizmos.quaternion,this._gizmos.scale),this.camera.updateMatrix(),this.camera.updateProjectionMatrix(),this._gizmos.updateMatrix(),this._tbRadius=this.calculateTbRadius(this.camera);const i=new kt().copy(this._gizmoMatrixState0);this.makeGizmos(this._gizmos.position,this._tbRadius),this._gizmoMatrixState0.copy(i),this.camera.lookAt(this._gizmos.position),this.updateTbState(St.IDLE,!1),this.dispatchEvent(ae)}}}function qv(){const n=(this._gizmos.scale.x+this._gizmos.scale.y+this._gizmos.scale.z)/3;this._tbRadius=this.calculateTbRadius(this.camera);const t=this._tbRadius/n,i=new Vn(0,0,t,t).getPoints(this._curvePts),s=new Zt().setFromPoints(i);for(const r in this._gizmos.children)this._gizmos.children[r].geometry=s;this.dispatchEvent(ae)}function Yv(n){if(this.enabled){for(let t=0;t<this.mouseActions.length;t++)if(this.mouseActions[t].mouse==2){n.preventDefault();break}}}function jv(){this._touchStart.splice(0,this._touchStart.length),this._touchCurrent.splice(0,this._touchCurrent.length),this._input=Qt.NONE}function Zv(n){if(n.button==0&&n.isPrimary?(this._downValid=!0,this._downEvents.push(n),this._downStart=performance.now()):this._downValid=!1,n.pointerType=="touch"&&this._input!=Qt.CURSOR)switch(this._touchStart.push(n),this._touchCurrent.push(n),this._input){case Qt.NONE:this._input=Qt.ONE_FINGER,this.onSinglePanStart(n,"ROTATE"),window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp);break;case Qt.ONE_FINGER:case Qt.ONE_FINGER_SWITCHED:this._input=Qt.TWO_FINGER,this.onRotateStart(),this.onPinchStart(),this.onDoublePanStart();break;case Qt.TWO_FINGER:this._input=Qt.MULT_FINGER,this.onTriplePanStart(n);break}else if(n.pointerType!="touch"&&this._input==Qt.NONE){let t=null;n.ctrlKey||n.metaKey?t="CTRL":n.shiftKey&&(t="SHIFT"),this._mouseOp=this.getOpFromAction(n.button,t),this._mouseOp!=null&&(window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp),this._input=Qt.CURSOR,this._button=n.button,this.onSinglePanStart(n,this._mouseOp))}}function Kv(n){if(n.pointerType=="touch"&&this._input!=Qt.CURSOR)switch(this._input){case Qt.ONE_FINGER:this.updateTouchEvent(n),this.onSinglePanMove(n,St.ROTATE);break;case Qt.ONE_FINGER_SWITCHED:if(this.calculatePointersDistance(this._touchCurrent[0],n)*this._devPxRatio>=this._switchSensibility){this._input=Qt.ONE_FINGER,this.updateTouchEvent(n),this.onSinglePanStart(n,"ROTATE");break}break;case Qt.TWO_FINGER:this.updateTouchEvent(n),this.onRotateMove(),this.onPinchMove(),this.onDoublePanMove();break;case Qt.MULT_FINGER:this.updateTouchEvent(n),this.onTriplePanMove(n);break}else if(n.pointerType!="touch"&&this._input==Qt.CURSOR){let t=null;n.ctrlKey||n.metaKey?t="CTRL":n.shiftKey&&(t="SHIFT");const e=this.getOpStateFromAction(this._button,t);e!=null&&this.onSinglePanMove(n,e)}this._downValid&&this.calculatePointersDistance(this._downEvents[this._downEvents.length-1],n)*this._devPxRatio>this._movementThreshold&&(this._downValid=!1)}function Jv(n){if(n.pointerType=="touch"&&this._input!=Qt.CURSOR){const t=this._touchCurrent.length;for(let e=0;e<t;e++)if(this._touchCurrent[e].pointerId==n.pointerId){this._touchCurrent.splice(e,1),this._touchStart.splice(e,1);break}switch(this._input){case Qt.ONE_FINGER:case Qt.ONE_FINGER_SWITCHED:window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=Qt.NONE,this.onSinglePanEnd();break;case Qt.TWO_FINGER:this.onDoublePanEnd(n),this.onPinchEnd(n),this.onRotateEnd(n),this._input=Qt.ONE_FINGER_SWITCHED;break;case Qt.MULT_FINGER:this._touchCurrent.length==0&&(window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=Qt.NONE,this.onTriplePanEnd());break}}else n.pointerType!="touch"&&this._input==Qt.CURSOR&&(window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),this._input=Qt.NONE,this.onSinglePanEnd(),this._button=-1);if(n.isPrimary)if(this._downValid)if(n.timeStamp-this._downEvents[this._downEvents.length-1].timeStamp<=this._maxDownTime)if(this._nclicks==0)this._nclicks=1,this._clickStart=performance.now();else{const e=n.timeStamp-this._clickStart,i=this.calculatePointersDistance(this._downEvents[1],this._downEvents[0])*this._devPxRatio;e<=this._maxInterval&&i<=this._posThreshold?(this._nclicks=0,this._downEvents.splice(0,this._downEvents.length),this.onDoubleTap(n)):(this._nclicks=1,this._downEvents.shift(),this._clickStart=performance.now())}else this._downValid=!1,this._nclicks=0,this._downEvents.splice(0,this._downEvents.length);else this._nclicks=0,this._downEvents.splice(0,this._downEvents.length)}function Qv(n){if(this.enabled&&this.enableZoom){let t=null;n.ctrlKey||n.metaKey?t="CTRL":n.shiftKey&&(t="SHIFT");const e=this.getOpFromAction("WHEEL",t);if(e!=null){n.preventDefault(),this.dispatchEvent(di);const i=125;let s=n.deltaY/i,r=1;switch(s>0?r=1/this.scaleFactor:s<0&&(r=this.scaleFactor),e){case"ZOOM":if(this.updateTbState(St.SCALE,!0),s>0?r=1/Math.pow(this.scaleFactor,s):s<0&&(r=Math.pow(this.scaleFactor,-s)),this.cursorZoom&&this.enablePan){let a;this.camera.isOrthographicCamera?a=this.unprojectOnTbPlane(this.camera,n.clientX,n.clientY,this.domElement).applyQuaternion(this.camera.quaternion).multiplyScalar(1/this.camera.zoom).add(this._gizmos.position):this.camera.isPerspectiveCamera&&(a=this.unprojectOnTbPlane(this.camera,n.clientX,n.clientY,this.domElement).applyQuaternion(this.camera.quaternion).add(this._gizmos.position)),this.applyTransformMatrix(this.scale(r,a))}else this.applyTransformMatrix(this.scale(r,this._gizmos.position));this._grid!=null&&(this.disposeGrid(),this.drawGrid()),this.updateTbState(St.IDLE,!1),this.dispatchEvent(ae),this.dispatchEvent(ni);break;case"FOV":if(this.camera.isPerspectiveCamera){this.updateTbState(St.FOV,!0),n.deltaX!=0&&(s=n.deltaX/i,r=1,s>0?r=1/Math.pow(this.scaleFactor,s):s<0&&(r=Math.pow(this.scaleFactor,-s))),this._v3_1.setFromMatrixPosition(this._cameraMatrixState);const a=this._v3_1.distanceTo(this._gizmos.position);let o=a/r;o=oe.clamp(o,this.minDistance,this.maxDistance);const l=a*Math.tan(oe.DEG2RAD*this.camera.fov*.5);let c=oe.RAD2DEG*(Math.atan(l/o)*2);c>this.maxFov?c=this.maxFov:c<this.minFov&&(c=this.minFov);const h=l/Math.tan(oe.DEG2RAD*(c/2));r=a/h,this.setFov(c),this.applyTransformMatrix(this.scale(r,this._gizmos.position,!1))}this._grid!=null&&(this.disposeGrid(),this.drawGrid()),this.updateTbState(St.IDLE,!1),this.dispatchEvent(ae),this.dispatchEvent(ni);break}}}}function t2(){const n=new zh,t=new Ve(60,window.innerWidth/window.innerHeight,1e-5,1e12);t.position.set(0,200,400);const e=new Oh({antialias:!0,logarithmicDepthBuffer:!0});e.setSize(window.innerWidth,window.innerHeight),e.setPixelRatio(window.devicePixelRatio),e.toneMapping=oh,e.toneMappingExposure=1,e.shadowMap.enabled=!0,e.shadowMap.type=rh,document.body.appendChild(e.domElement);const i=new $v(t,e.domElement,n);i.enableDamping=!0,i.dampingFactor=.05,i.setGizmosVisible(!1);const s=new f1(3355443,.5);s.layers.enable(1),n.add(s);const r=new d1(16777215,2,0,0);r.layers.set(0);const a=new h1(16777215,2);a.position.set(0,0,0),a.castShadow=!0,a.layers.set(1),a.shadow.mapSize.width=2048,a.shadow.mapSize.height=2048,a.shadow.bias=-1e-5,a.shadow.camera.near=.1,a.shadow.camera.far=500,a.angle=Math.PI/8,a.penumbra=.1,a.decay=0,a.distance=1e3,t.layers.enable(0),t.layers.enable(1);const o=new Me;n.add(o);const l=new Me;return n.add(l),window.addEventListener("resize",()=>{t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight)}),{scene:n,camera:t,renderer:e,controls:i,orbitGroup:o,zodiacGroup:l,sunLight:r,shadowLight:a}}const nh=new Ue;class Bo{constructor(t,e=64){this.bounds=t,this.capacity=e,this.points=[],this.children=null,this.divided=!1}insert(t){return this.bounds.containsPoint(t.position)?this.points.length<this.capacity&&!this.divided?(this.points.push(t),!0):(this.divided||this.subdivide(),this.children[0].insert(t)||this.children[1].insert(t)||this.children[2].insert(t)||this.children[3].insert(t)||this.children[4].insert(t)||this.children[5].insert(t)||this.children[6].insert(t)||this.children[7].insert(t)):!1}subdivide(){const t=this.bounds.min,e=this.bounds.max,i=new E().addVectors(t,e).multiplyScalar(.5),s=[new Ue(t,i),new Ue(new E(i.x,t.y,t.z),new E(e.x,i.y,i.z)),new Ue(new E(t.x,t.y,i.z),new E(i.x,i.y,e.z)),new Ue(new E(i.x,t.y,i.z),new E(e.x,i.y,e.z)),new Ue(new E(t.x,i.y,t.z),new E(i.x,e.y,i.z)),new Ue(new E(i.x,i.y,t.z),new E(e.x,e.y,i.z)),new Ue(new E(t.x,i.y,i.z),new E(i.x,e.y,e.z)),new Ue(i,e)];this.children=s.map(r=>new Bo(r,this.capacity)),this.divided=!0;for(const r of this.points)for(const a of this.children)if(a.insert(r))break;this.points=[]}queryRay(t,e=0,i=[]){if(e>0){if(nh.copy(this.bounds).expandByScalar(e),!t.intersectsBox(nh))return i}else if(!t.intersectsBox(this.bounds))return i;if(this.points.length>0)for(const s of this.points)i.push(s);if(this.children)for(const s of this.children)s.queryRay(t,e,i);return i}}const e2=["Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc"],i2=[{id:0,file:"stars_data_0.bin",meta:"stars_meta_0.json"},{id:1,file:"stars_data_1.bin",meta:"stars_meta_1.json"},{id:2,file:"stars_data_2.bin",meta:"stars_meta_2.json"}];function n2(){const n=document.createElement("canvas");n.width=64,n.height=64;const t=n.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255, 255, 255, 1.0)"),e.addColorStop(.15,"rgba(255, 255, 255, 1.0)"),e.addColorStop(.4,"rgba(255, 255, 255, 0.2)"),e.addColorStop(1,"rgba(0, 0, 0, 0.0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new Vh(n)}class s2{constructor(t){this.scene=t,this.starsGroup=new Me,this.starsGroup.name="StarsGroup",this.starsGroup.renderOrder=-1,this.scene.add(this.starsGroup),this.chunks=new Map,this.texture=n2(),this.allStarData=[],this.starsGroup.userData={starData:this.allStarData,manager:this},this.brightness=R.starBrightness,this.currentBrightness=this.brightness,this.currentLimit=6,this.currentLimit=6,this.saturation=R.starSaturation!==void 0?R.starSaturation:1,this.saturationUniform={value:this.saturation},this.loadingChunks=new Set}async loadChunk(t){if(this.chunks.has(t)||this.loadingChunks.has(t))return;this.loadingChunks.add(t);const e=i2[t];if(!e){this.loadingChunks.delete(t);return}try{const i=Date.now();Ot.log(`Loading star chunk ${t} (v=${i})...`);const[s,r]=await Promise.all([fetch(`/assets/${e.meta}?v=${i}`),fetch(`/assets/${e.file}?v=${i}`)]),a=await s.json(),o=await r.arrayBuffer(),l=new Float32Array(o),c=11,h=[],u=[],f=[],p=[];for(let y=0;y<a.length;y++){const v=y*c,x=l[v+0],C=l[v+1],T=l[v+2],P=l[v+3],G=l[v+4],M=l[v+5],b=l[v+6],O=l[v+7],$=l[v+8],J=l[v+9],L=l[v+10],F=Math.sqrt(x*x+C*C+T*T),I=Math.max(F,.1),H=-.921*L;let B=1,j=1;L>2&&(j=Math.max(.1,1-(L-2)*.1)),H<-6?(B=1+(H+6)*.1,B<.3&&(B=.3)):B=1+(H+6)**1.4*.3,B=Math.min(B,8),f.push(B);const[W,K,Q,k,Z,nt,dt,gt]=a[y],Et=x*ye,z=T*ye,ot=-C*ye;h.push(Et,z,ot),u.push(P*j,G*j,M*j),y===0&&console.warn(`[DEBUG Chunk ${t}] First Star Pos: ${Et}, ${z}, ${ot} | RGB: ${P}, ${G}, ${M}`),Z===11767&&console.warn(`[DEBUG] Polaris Found! Raw(x,y,z): [${x}, ${C}, ${T}]. Scene(x,y,z): [${Et}, ${z}, ${ot}]`),y<5&&console.log(`[Chunk ${t} Sample ${y}] Mag: ${L.toFixed(2)}, Lum: ${b.toFixed(2)}, Dist: ${I.toFixed(2)}, logFlux(mag): ${H.toFixed(2)}, Size: ${B.toFixed(2)}, Intensity: ${j.toFixed(2)}`),p.push({id:W,name:K,bayer:Q,flamsteed:k,hip:Z,hd:nt,spectralType:dt||"Unknown",constellation:gt,luminosity:b,radius:O,mass:$,temperature:J,mag:L,distance:I,x,y:C,z:T})}const g=new Zt;g.setAttribute("position",new de(h,3)),g.setAttribute("color",new de(u,3)),g.setAttribute("starSize",new de(f,1));const _=new Hh({size:1,map:this.texture,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Di,sizeAttenuation:!1,dithering:!0});_.onBeforeCompile=y=>{y.vertexShader=`
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
          `),_.userData.shader=y};const m=new Wg(g,_);this.updateMaterial(m,this.currentBrightness),this.starsGroup.add(m);const d=this.buildOctree(p);this.chunks.set(t,{points:m,octree:d,data:p}),this.updateAllStarData(),R.magnitudeLimit!==void 0&&this.setMagnitudeLimit(R.magnitudeLimit)}catch(i){Ot.error(`Failed to load chunk ${t}`,i)}finally{this.loadingChunks.delete(t)}}unloadChunk(t){if(!this.chunks.has(t))return;const e=this.chunks.get(t);this.starsGroup.remove(e.points),e.points.geometry.dispose(),e.points.material.dispose(),this.chunks.delete(t),this.updateAllStarData()}buildOctree(t){const e=new E(1/0,1/0,1/0),i=new E(-1/0,-1/0,-1/0);t.forEach(r=>{const a=r.x*ye,o=r.z*ye,l=-r.y*ye;e.min(new E(a,o,l)),i.max(new E(a,o,l))}),e.subScalar(100),i.addScalar(100);const s=new Bo(new Ue(e,i),64);return t.forEach((r,a)=>{const o=r.x*ye,l=r.z*ye,c=-r.y*ye;s.insert({position:new E(o,l,c),data:r,index:a})}),s}updateAllStarData(){this.allStarData.length=0,this.chunks.forEach(t=>{this.allStarData.push(...t.data)}),this.starsGroup.userData.starData=this.allStarData}getOctrees(){const t=[];return this.chunks.forEach(e=>t.push(e.octree)),t}setMagnitudeLimit(t){this.currentLimit=t,t>6.5&&this.loadChunk(1),t>8&&this.loadChunk(2),this.chunks.forEach((e,i)=>{const s=e.data;if(!s||s.length===0)return;let r=0;if(s[0].mag>t)r=0;else if(s[s.length-1].mag<t)r=s.length;else{let a=0,o=s.length-1;for(;a<=o;){const l=Math.floor((a+o)/2);s[l].mag<t?(r=l+1,a=l+1):o=l-1}}e.points&&e.points.geometry&&e.points.geometry.setDrawRange(0,r)})}setBrightness(t){this.brightness=t,this.applyBrightness(t)}applyBrightness(t){this.currentBrightness=t,this.chunks.forEach(e=>{this.updateMaterial(e.points,t)})}updateMaterial(t,e){if(!t||!t.material)return;e==null&&(e=.5);let i=0,s=0;if(e<=.5){const r=e/.5;s=.6+r*.25,i=.6+r*.6}else{const r=(e-.5)/.5;s=.85+r*.15,i=1.2+r*3.8}if(t.material.opacity=s,t.material.color.setScalar(i),e>.5){const r=(e-.5)/.5;t.material.size=1+r*.5}else t.material.size=1}setSaturation(t){this.saturation=t,this.saturationUniform.value=t}}async function r2(n){const t=new s2(n);return await t.loadChunk(0),{stars:t.starsGroup,rawData:t.allStarData,manager:t}}async function a2(n,t,e){try{const s=await(await fetch("/assets/asterisms_lines_all.json")).json(),r=new Map;e.forEach(h=>{const u=h.x*ye,f=h.z*ye,p=-h.y*ye;r.set(h.id,new E(u,f,p))});const a=new He({color:7842542,transparent:!0,opacity:.45,blending:Di,depthWrite:!1}),o=new He({color:12307694,transparent:!0,opacity:.35,blending:Di,depthWrite:!1});let l=0,c=0;for(const[h,u]of Object.entries(s)){const f=e2.includes(h),p=f?n:t,g=f?a:o;for(const _ of u){const m=[];let d=!1;for(const y of _){const v=r.get(y);v?m.push(v):d=!0}if(!d&&m.length>=2){const y=new Zt().setFromPoints(m),v=new qe(y,g);v.userData={type:"asterism",id:h},p.add(v)}}f?l++:c++}Ot.log(`Created ${l} zodiacs and ${c} other asterisms.`)}catch(i){Ot.error("Error creating asterisms",i)}}async function o2(n){try{const t=await fetch("/assets/constellations.bounds.geojson");if(!t.ok)throw new Error("Failed to fetch constellation boundaries");const e=await t.json(),i=new He({color:5596791,transparent:!0,opacity:.4,blending:Di,depthWrite:!1}),s=ye*100;e.features.forEach(r=>{if(!r.geometry)return;const a=r.geometry.type,o=[];a==="Polygon"?o.push(...r.geometry.coordinates):a==="MultiPolygon"&&r.geometry.coordinates.forEach(l=>{o.push(...l)}),o.forEach(l=>{var f;const c=[];l.forEach(([p,g])=>{const _=oe.degToRad(p),m=oe.degToRad(g),d=s*Math.cos(m)*Math.cos(_),y=s*Math.cos(m)*Math.sin(_),v=s*Math.sin(m);c.push(new E(d,v,-y))});const h=new Zt().setFromPoints(c),u=new qe(h,i);u.userData={type:"constellation",id:r.id||((f=r.properties)==null?void 0:f.id)},n.add(u)})}),Ot.log("Created constellation boundaries from GeoJSON")}catch(t){Ot.error("Failed to load constellations",t)}}class l2{constructor(){$o(this,"animate",()=>{requestAnimationFrame(this.animate);const t=this.clock.getDelta();if(!R.stop){const e=R.simulationSpeed*t;R.date.setTime(R.date.getTime()+e*1e3),this.magneticFieldTime+=t*R.simulationSpeed*25e-5}Nv(this.uiControls.uiState,this.uiControls),Wv(this.planets,this.sun,this.shadowLight),nu(this.universeGroup,this.planets,this.sun),vo(this.orbitGroup,this.relativeOrbitGroup,this.planets,this.sun),B_(this.orbitGroup,this.planets),F_(this.planets),qh(this.camera,this.controls,this.planets,this.sun),this.rabbit.update(t),this.controls.update(),this.renderer.render(this.scene,this.camera),this.updateMagneticFieldsAnimations(),this.rabbit.render()});this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.universeGroup=null,this.planets=[],this.sun=null,this.orbitGroup=null,this.relativeOrbitGroup=null,this.zodiacGroup=null,this.starsRef={value:null},this.uiControls=null,this.rabbit=null,this.clock=new p1,this.magneticFieldTime=0,this.shadowLight=null}async init(){try{Ot.log("White Rabbit Version: 1.3 (Class-based Init)");const t=document.getElementById("loading");t.textContent="Initializing... (Base: /)",t.textContent="Creating Scene...";const{scene:e,camera:i,renderer:s,controls:r,orbitGroup:a,zodiacGroup:o,sunLight:l,shadowLight:c}=t2();this.scene=e,this.camera=i,this.renderer=s,this.controls=r,this.orbitGroup=a,this.zodiacGroup=o,this.shadowLight=c,window.scene=e,this.universeGroup=new Me,e.add(this.universeGroup),this.universeGroup.add(l),this.universeGroup.add(c),this.universeGroup.add(a),this.universeGroup.add(o);const h=new Me;this.universeGroup.add(h),h.visible=R.showAsterisms,o.visible=R.showZodiacs;const u=new Me;this.universeGroup.add(u),u.visible=R.showConstellations;const f=new Io,p=iv(this.universeGroup,f),g=w_(this.universeGroup);t.textContent="Loading Planets...";const{planets:_,sun:m}=Vv(this.universeGroup,a);this.planets=_,this.sun=m,this.setupMagneticFields(),this.relativeOrbitGroup=new Me,e.add(this.relativeOrbitGroup),t.textContent="Setting up GUI...",this.uiControls=Fv(_,m,a,this.relativeOrbitGroup,o,h,this.starsRef,s,i,r,p,g,this.magneticFieldsGroup,this.universeGroup,u),V_(i,_,m,this.starsRef,o,h),$h(i,r,_,m),b_(this.universeGroup),window.updateMissions=E_,vo(a,this.relativeOrbitGroup,_,m),window.SimulationControl=new x_(_,m,a,o,h,this.starsRef,i,r,p,g,this.magneticFieldsGroup,this.universeGroup),this.rabbit=G_(s),t.style.opacity=0,t.style.pointerEvents="none",setTimeout(()=>{Xe.init()},100),r2(this.universeGroup).then(({stars:d,rawData:y})=>{d&&(this.starsRef.value=d,this.starsRef.value=d,a2(o,h,y),o2(u),nv(p,y))}).catch(d=>Ot.error("Error loading stars:",d)),this.animate()}catch(t){Ot.error("Initialization error:",t),document.getElementById("loading").textContent="Error loading simulation: "+t.message,document.getElementById("loading").style.color="red"}}setupMagneticFields(){this.magneticFieldsGroup=new Me,this.magneticFieldsGroup.visible=R.showMagneticFields,this.universeGroup.add(this.magneticFieldsGroup);const t=T_(this.sun);t&&(t.visible=R.showSunMagneticFieldBasic,this.universeGroup.add(t));const e=A_(this.sun);e&&(e.visible=R.showSunMagneticField,this.universeGroup.add(e)),this.planets.forEach(i=>{if(i.data.magneticField){const s=Vc(i.data,i.data.radius);s&&i.mesh.add(s)}i.moons.forEach(s=>{if(s.data.magneticField){const r=Vc(s.data,s.data.radius);r&&s.mesh.add(r)}})})}updateMagneticFieldsAnimations(){if(this.universeGroup){const t=this.universeGroup.children.find(i=>i.name==="MagneticField");t!=null&&t.visible&&t.userData.material&&(t.userData.material.uniforms.uTime.value=this.magneticFieldTime,this.sun&&(t.rotation.y=this.sun.rotation.y));const e=this.universeGroup.children.find(i=>i.name==="SunMagneticFieldBasic");if(e!=null&&e.visible){const i=this.magneticFieldTime+e.userData.timeOffset;if(e.userData.shaderUniforms){const s=new Date("2000-01-01T12:00:00Z").getTime(),a=(R.date.getTime()-s)/(1e3*60*60);e.userData.shaderUniforms.uTime.value=a,this.sun&&(e.rotation.y=this.sun.rotation.y)}e.children.forEach(s=>{if(s.userData.isPolar&&s.userData.basePoints){const r=s.geometry.attributes.position,a=s.userData.basePoints;for(let o=0;o<a.length;o++){const l=a[o],c=Math.sin(i*.3+o*.1)*.1,h=new E(c,0,c);r.setXYZ(o,l.x+h.x,l.y+h.y,l.z+h.z)}r.needsUpdate=!0}})}}}}window.onerror=(n,t,e,i,s)=>{const r=document.getElementById("loading");r&&(r.textContent=`Error: ${n} at ${t}:${e}`,r.style.color="red")};(async()=>await new l2().init())();
