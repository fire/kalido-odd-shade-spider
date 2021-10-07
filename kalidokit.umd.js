var et=Object.defineProperty;var it=(u,x,f)=>x in u?et(u,x,{enumerable:!0,configurable:!0,writable:!0,value:f}):u[x]=f;var P=(u,x,f)=>(it(u,typeof x!="symbol"?x+"":x,f),f);(function(u,x){typeof exports=="object"&&typeof module!="undefined"?x(exports):typeof define=="function"&&define.amd?define(["exports"],x):(u=typeof globalThis!="undefined"?globalThis:u||self,x(u.Kalidokit={}))})(this,function(u){"use strict";const x=(i,t,e)=>Math.max(Math.min(i,e),t),f=(i,t,e)=>(x(i,t,e)-t)/(e-t),m={Face:{eye:{l:1,r:1},mouth:{x:0,y:0,shape:{A:0,E:0,I:0,O:0,U:0}},head:{x:0,y:0,z:0,width:.3,height:.6,position:{x:.5,y:.5,z:0}},brow:0,pupil:{x:0,y:0}},Pose:{RightUpperArm:{x:0,y:0,z:-1.25},LeftUpperArm:{x:0,y:0,z:1.25},RightLowerArm:{x:0,y:0,z:0},LeftLowerArm:{x:0,y:0,z:0},LeftUpperLeg:{x:0,y:0,z:0},RightUpperLeg:{x:0,y:0,z:0},RightLowerLeg:{x:0,y:0,z:0},LeftLowerLeg:{x:0,y:0,z:0},LeftHand:{x:0,y:0,z:0},RightHand:{x:0,y:0,z:0},Spine:{x:0,y:0,z:0},Hips:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}}},RightHand:{RightWrist:{x:-.1315541586772754,y:-.07882867526197412,z:-1.0417476769631682},RightRingProximal:{x:0,y:0,z:-.13224515812536933},RightRingIntermediate:{x:0,y:0,z:-.4068258603832122},RightRingDistal:{x:0,y:0,z:-.04950943047275125},RightIndexProximal:{x:0,y:0,z:-.24443519921597368},RightIndexIntermediate:{x:0,y:0,z:-.25695509972035424},RightIndexDistal:{x:0,y:0,z:-.06699515077992313},RightMiddleProximal:{x:0,y:0,z:-.09663436414575077},RightMiddleIntermediate:{x:0,y:0,z:-.44945038168605306},RightMiddleDistal:{x:0,y:0,z:-.06660398263230727},RightThumbProximal:{x:-.2349819227955754,y:-.33498192279557526,z:-.12613225518081256},RightThumbIntermediate:{x:-.2,y:-.19959491036565571,z:-.013996364546896928},RightThumbDistal:{x:-.2,y:.002005509674788991,z:.1510027548373945},RightLittleProximal:{x:0,y:0,z:-.09045147788376662},RightLittleIntermediate:{x:0,y:0,z:-.22559206415066682},RightLittleDistal:{x:0,y:0,z:-.10080630460393536}},LeftHand:{LeftWrist:{x:-.1315541586772754,y:-.07882867526197412,z:-1.0417476769631682},LeftRingProximal:{x:0,y:0,z:.13224515812536933},LeftRingIntermediate:{x:0,y:0,z:.4068258603832122},LeftRingDistal:{x:0,y:0,z:.04950943047275125},LeftIndexProximal:{x:0,y:0,z:.24443519921597368},LeftIndexIntermediate:{x:0,y:0,z:.25695509972035424},LeftIndexDistal:{x:0,y:0,z:.06699515077992313},LeftMiddleProximal:{x:0,y:0,z:.09663436414575077},LeftMiddleIntermediate:{x:0,y:0,z:.44945038168605306},LeftMiddleDistal:{x:0,y:0,z:.06660398263230727},LeftThumbProximal:{x:-.2349819227955754,y:.33498192279557526,z:.12613225518081256},LeftThumbIntermediate:{x:-.2,y:.2506506391005022,z:.05046474221464442},LeftThumbDistal:{x:-.2,y:.17880674636490754,z:-.06059662681754624},LeftLittleProximal:{x:0,y:0,z:.1748998529912705},LeftLittleIntermediate:{x:0,y:0,z:.4065799037713114},LeftLittleDistal:{x:0,y:0,z:.10080630460393536}}};class n{constructor(t,e,r){if(!!t&&t.constructor===Array){this.x=t[0]||0,this.y=t[1]||0,this.z=t[2]||0;return}if(!!t&&t.constructor===Object){this.x=t.x||0,this.y=t.y||0,this.z=t.z||0;return}this.x=t||0,this.y=e||0,this.z=r||0}negative(){return new n(-this.x,-this.y,-this.z)}add(t){return t instanceof n?new n(this.x+t.x,this.y+t.y,this.z+t.z):new n(this.x+t,this.y+t,this.z+t)}subtract(t){return t instanceof n?new n(this.x-t.x,this.y-t.y,this.z-t.z):new n(this.x-t,this.y-t,this.z-t)}multiply(t){return t instanceof n?new n(this.x*t.x,this.y*t.y,this.z*t.z):new n(this.x*t,this.y*t,this.z*t)}divide(t){return t instanceof n?new n(this.x/t.x,this.y/t.y,this.z/t.z):new n(this.x/t,this.y/t,this.z/t)}equals(t){return this.x==t.x&&this.y==t.y&&this.z==t.z}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){return new n(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}length(){return Math.sqrt(this.dot(this))}distance(t,e=3){return Math.sqrt(e===2?Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2):Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2)+Math.pow(this.z-t.z,2))}lerp(t,e){return t.subtract(this).multiply(e).add(this)}unit(){return this.divide(this.length())}min(){return Math.min(Math.min(this.x,this.y),this.z)}max(){return Math.max(Math.max(this.x,this.y),this.z)}toAngles(){return{theta:Math.atan2(this.z,this.x),phi:Math.asin(this.y/this.length())}}angleTo(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}toArray(t){return[this.x,this.y,this.z].slice(0,t||3)}clone(){return new n(this.x,this.y,this.z)}init(t,e,r){return this.x=t,this.y=e,this.z=r,this}static negative(t,e){return e.x=-t.x,e.y=-t.y,e.z=-t.z,e}static add(t,e,r){return e instanceof n?(r.x=t.x+e.x,r.y=t.y+e.y,r.z=t.z+e.z):(r.x=t.x+e,r.y=t.y+e,r.z=t.z+e),r}static subtract(t,e,r){return e instanceof n?(r.x=t.x-e.x,r.y=t.y-e.y,r.z=t.z-e.z):(r.x=t.x-e,r.y=t.y-e,r.z=t.z-e),r}static multiply(t,e,r){return e instanceof n?(r.x=t.x*e.x,r.y=t.y*e.y,r.z=t.z*e.z):(r.x=t.x*e,r.y=t.y*e,r.z=t.z*e),r}static divide(t,e,r){return e instanceof n?(r.x=t.x/e.x,r.y=t.y/e.y,r.z=t.z/e.z):(r.x=t.x/e,r.y=t.y/e,r.z=t.z/e),r}static cross(t,e,r){return r.x=t.y*e.z-t.z*e.y,r.y=t.z*e.x-t.x*e.z,r.z=t.x*e.y-t.y*e.x,r}static unit(t,e){let r=t.length();return e.x=t.x/r,e.y=t.y/r,e.z=t.z/r,e}static fromAngles(t,e){return new n(Math.cos(t)*Math.cos(e),Math.sin(e),Math.sin(t)*Math.cos(e))}static randomDirection(){return n.fromAngles(Math.random()*Math.PI*2,Math.asin(Math.random()*2-1))}static min(t,e){return new n(Math.min(t.x,e.x),Math.min(t.y,e.y),Math.min(t.z,e.z))}static max(t,e){return new n(Math.max(t.x,e.x),Math.max(t.y,e.y),Math.max(t.z,e.z))}static lerp(t,e,r){return e instanceof n?e.subtract(t).multiply(r).add(t):(e-t)*r+t}static fromArray(t){return!!t&&t.constructor===Array?new n(t[0],t[1],t[2]):new n(t.x,t.y,t.z)}static angleBetween(t,e){return t.angleTo(e)}static angleBetweenVertices(t,e,r){t.subtract(e),r.subtract(e)}static distance(t,e,r){return Math.sqrt(r===2?Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2):Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2))}static toDegrees(t){return t*(180/Math.PI)}static normalizeAngle(t){let e=Math.PI*2,r=t%e;return r=r>Math.PI?r-e:r<-Math.PI?e+r:r,r/Math.PI}static normalizeRadians(t){return t>=Math.PI/2&&(t-=2*Math.PI),t<=-Math.PI/2&&(t+=2*Math.PI,t=Math.PI-t),t/Math.PI}static find2DAngle(t,e,r,s){var a=s-e,l=r-t,o=Math.atan2(a,l);return o}static findRotation(t,e,r=!0){return r?new n(n.normalizeRadians(n.find2DAngle(t.z,t.x,e.z,e.x)),n.normalizeRadians(n.find2DAngle(t.z,t.y,e.z,e.y)),n.normalizeRadians(n.find2DAngle(t.x,t.y,e.x,e.y))):new n(n.find2DAngle(t.z,t.x,e.z,e.x),n.find2DAngle(t.z,t.y,e.z,e.y),n.find2DAngle(t.x,t.y,e.x,e.y))}static rollPitchYaw(t,e,r){if(!r)return new n(n.normalizeAngle(n.find2DAngle(t.z,t.y,e.z,e.y)),n.normalizeAngle(n.find2DAngle(t.z,t.x,e.z,e.x)),n.normalizeAngle(n.find2DAngle(t.x,t.y,e.x,e.y)));let s=e.subtract(t),a=r.subtract(t),o=s.cross(a).unit(),y=s.unit(),h=o.cross(y),z=Math.asin(o.x)||0,g=Math.atan2(-o.y,o.z)||0,p=Math.atan2(-h.x,y.x)||0;return new n(n.normalizeAngle(g),n.normalizeAngle(z),n.normalizeAngle(p))}static angleBetween3DCoords(t,e,r){t instanceof n||(t=new n(t),e=new n(e),r=new n(r));const s=t.subtract(e),a=r.subtract(e),l=s.unit(),o=a.unit(),y=l.dot(o),h=Math.acos(y);return n.normalizeRadians(h)}}const H=i=>{let t={r:n.findRotation(i[11],i[13]),l:n.findRotation(i[12],i[14])};t.r.y=n.angleBetween3DCoords(i[12],i[11],i[13]),t.l.y=n.angleBetween3DCoords(i[11],i[12],i[14]);let e={r:n.findRotation(i[13],i[15]),l:n.findRotation(i[14],i[16])};e.r.y=n.angleBetween3DCoords(i[11],i[13],i[15]),e.l.y=n.angleBetween3DCoords(i[12],i[14],i[16]),e.r.z=x(e.r.z,-2.14,0),e.l.z=x(e.l.z,-2.14,0);let r={r:n.findRotation(n.fromArray(i[15]),n.lerp(n.fromArray(i[17]),n.fromArray(i[19]),.5)),l:n.findRotation(n.fromArray(i[16]),n.lerp(n.fromArray(i[18]),n.fromArray(i[20]),.5))},s=B(t.r,e.r,r.r,"Right"),a=B(t.l,e.l,r.l,"Left");return{UpperArm:{r:s.UpperArm,l:a.UpperArm},LowerArm:{r:s.LowerArm,l:a.LowerArm},Hand:{r:s.Hand,l:a.Hand},Unscaled:{UpperArm:t,LowerArm:e,Hand:r}}},B=(i,t,e,r="right")=>{const s=r==="Right"?1:-1;return i.z*=-2.3*s,i.y*=Math.PI*s,i.y-=Math.max(t.x),i.y-=-s*Math.max(t.z,0),i.x-=.3*s,t.z*=-2.14*s,t.y*=2.14*s,t.x*=2.14*s,i.x=x(i.x,-.5,Math.PI),t.x=x(t.x,-.3,.3),e.y=x(e.z*2,-.6,.6),e.z=e.z*-2.3*s,{UpperArm:i,LowerArm:t,Hand:e}},U=(i,t)=>{let e=n.fromArray(t[23]),r=n.fromArray(t[24]),s=n.fromArray(t[11]),a=n.fromArray(t[12]),l=e.lerp(r),o=s.lerp(a),y=l.distance(o),h={position:{x:x(-1*(l.x-.65),-1,1),y:0,z:x(y-1,-2,0)},rotation:null};h.rotation=n.rollPitchYaw(i[23],i[24]),h.rotation.y>.5&&(h.rotation.y-=2),h.rotation.y+=.5,h.rotation.z>0&&(h.rotation.z=1-h.rotation.z),h.rotation.z<0&&(h.rotation.z=-1-h.rotation.z);let z=f(Math.abs(h.rotation.y),.2,.4);h.rotation.z*=1-z,h.rotation.x=0;let g=n.rollPitchYaw(i[11],i[12]);g.y>.5&&(g.y-=2),g.y+=.5,g.z>0&&(g.z=1-g.z),g.z<0&&(g.z=-1-g.z);let p=f(Math.abs(g.y),.2,.4);return g.z*=1-p,g.x=0,S(h,g)},S=(i,t)=>(i.rotation.x*=Math.PI,i.rotation.y*=Math.PI,i.rotation.z*=Math.PI,i.worldPosition={x:i.position.x*(.5+1.8*-i.position.z),y:0,z:i.position.z*(.1+i.position.z*-2)},t.x*=Math.PI,t.y*=Math.PI,t.z*=Math.PI,{Hips:i,Spine:t}),C=i=>{let t={r:n.findRotation(i[23],i[25]),l:n.findRotation(i[24],i[26])};t.r.z=x(t.r.z-.5,-.5,0),t.r.y=0,t.l.z=x(t.l.z-.5,-.5,0),t.l.y=0;let e={r:n.findRotation(i[25],i[27]),l:n.findRotation(i[26],i[28])};e.r.x=n.angleBetween3DCoords(i[23],i[25],i[27]),e.r.y=0,e.r.z=0,e.l.x=n.angleBetween3DCoords(i[24],i[26],i[28]),e.l.y=0,e.l.z=0;let r=T(t.r,e.r,"Right"),s=T(t.l,e.l,"Left");return{UpperLeg:{r:r.UpperLeg,l:s.UpperLeg},LowerLeg:{r:r.LowerLeg,l:s.LowerLeg},Unscaled:{UpperArm:t,LowerLeg:e}}},T=(i,t,e="right")=>{let r=e==="Right"?1:-1;return i.z=i.z*-2.3*r,i.x=x(i.z*.1*r,-.5,Math.PI),t.x=t.x*-2.14*1.3,{UpperLeg:i,LowerLeg:t}};class A{constructor(){}static solve(t,e,{runtime:r="mediapipe",video:s=null,imageSize:a=null,enableLegs:l=!0}={}){if(!t&&!e){console.error("Need both World Pose and Pose Landmarks");return}if(s){let c=s;typeof s=="string"&&(c=document.querySelector(s)),a={width:c.videoWidth,height:c.videoHeight}}r==="tfjs"&&a&&(t.forEach((c,D)=>{c.visibility=c.score}),e.forEach((c,D)=>{c.x/=a.width,c.y/=a.height,c.z=0,c.visibility=c.score}));let o=H(t),y=U(t,e),h=C(t),z=t[15].y>-.1||t[15].visibility<.23||.995<e[15].y,g=t[16].y>-.1||t[16].visibility<.23||.995<e[16].y,p=t[23].visibility<.63||y.Hips.position.z>-.4,d=t[24].visibility<.63||y.Hips.position.z>-.4;return o.UpperArm.l=o.UpperArm.l.multiply(g?0:1),o.UpperArm.l.z=g?m.Pose.LeftUpperArm.z:o.UpperArm.l.z,o.UpperArm.r=o.UpperArm.r.multiply(z?0:1),o.UpperArm.r.z=z?m.Pose.RightUpperArm.z:o.UpperArm.r.z,o.LowerArm.l=o.LowerArm.l.multiply(g?0:1),o.LowerArm.r=o.LowerArm.r.multiply(z?0:1),o.Hand.l=o.Hand.l.multiply(g?0:1),o.Hand.r=o.Hand.r.multiply(z?0:1),h.UpperLeg.l=h.UpperLeg.l.multiply(d?0:1),h.UpperLeg.r=h.UpperLeg.r.multiply(p?0:1),h.LowerLeg.l=h.LowerLeg.l.multiply(d?0:1),h.LowerLeg.r=h.LowerLeg.r.multiply(p?0:1),{RightUpperArm:o.UpperArm.r,RightLowerArm:o.LowerArm.r,LeftUpperArm:o.UpperArm.l,LeftLowerArm:o.LowerArm.l,RightHand:o.Hand.r,LeftHand:o.Hand.l,RightUpperLeg:h.UpperLeg.r,RightLowerLeg:h.LowerLeg.r,LeftUpperLeg:h.UpperLeg.l,LeftLowerLeg:h.LowerLeg.l,Hips:y.Hips,Spine:y.Spine}}}P(A,"calcArms",H),P(A,"calcHips",U),P(A,"calcLegs",C);class X{constructor(){}static solve(t,e="Right"){if(!t){console.error("Need Hand Landmarks");return}let r=[new n(t[0]),new n(t[e==="Right"?17:5]),new n(t[e==="Right"?5:17])],s=n.rollPitchYaw(r[0],r[1],r[2]);s.y=s.z,s.y-=.4;let a={};return a[e+"Wrist"]={x:s.x,y:s.y,z:s.z},a[e+"RingProximal"]={x:0,y:0,z:n.angleBetween3DCoords(t[0],t[13],t[14])},a[e+"RingIntermediate"]={x:0,y:0,z:n.angleBetween3DCoords(t[13],t[14],t[15])},a[e+"RingDistal"]={x:0,y:0,z:n.angleBetween3DCoords(t[14],t[15],t[16])},a[e+"IndexProximal"]={x:0,y:0,z:n.angleBetween3DCoords(t[0],t[5],t[6])},a[e+"IndexIntermediate"]={x:0,y:0,z:n.angleBetween3DCoords(t[5],t[6],t[7])},a[e+"IndexDistal"]={x:0,y:0,z:n.angleBetween3DCoords(t[6],t[7],t[8])},a[e+"MiddleProximal"]={x:0,y:0,z:n.angleBetween3DCoords(t[0],t[9],t[10])},a[e+"MiddleIntermediate"]={x:0,y:0,z:n.angleBetween3DCoords(t[9],t[10],t[11])},a[e+"MiddleDistal"]={x:0,y:0,z:n.angleBetween3DCoords(t[10],t[11],t[12])},a[e+"ThumbProximal"]={x:0,y:0,z:n.angleBetween3DCoords(t[0],t[1],t[2])},a[e+"ThumbIntermediate"]={x:0,y:0,z:n.angleBetween3DCoords(t[1],t[2],t[3])},a[e+"ThumbDistal"]={x:0,y:0,z:n.angleBetween3DCoords(t[2],t[3],t[4])},a[e+"LittleProximal"]={x:0,y:0,z:n.angleBetween3DCoords(t[0],t[17],t[18])},a[e+"LittleIntermediate"]={x:0,y:0,z:n.angleBetween3DCoords(t[17],t[18],t[19])},a[e+"LittleDistal"]={x:0,y:0,z:n.angleBetween3DCoords(t[18],t[19],t[20])},a=N(a,e),a}}const N=(i,t="Right")=>{const e=t==="Right"?1:-1;let r=["Ring","Index","Little","Thumb","Middle"],s=["Proximal","Intermediate","Distal"];return i[t+"Wrist"].x=x(i[t+"Wrist"].x*2*e,-.3,.3),i[t+"Wrist"].y=x(i[t+"Wrist"].y*2.3,t==="Right"?-1:-.6,t==="Right"?.6:1),i[t+"Wrist"].z=x(i[t+"Wrist"].z*-2.3*e),r.forEach(a=>{s.forEach(l=>{let o=i[t+a+l];if(a==="Thumb"){let y={x:l==="Proximal"?2.2:0,y:l==="Proximal"?2.2:l==="Intermediate"?.7:1,z:.5},h={x:l==="Proximal"?1.2:-.2,y:l==="Proximal"?1.1*e:.1*e,z:.2*e},z={x:0,y:0,z:0};l==="Proximal"?(z.z=x(h.z+o.z*-Math.PI*y.z*e,t==="Right"?-.6:-.1,t==="Right"?.1:.6),z.x=x(h.x+o.z*-Math.PI*y.x,-.6,.1),z.y=x(h.y+o.z*-Math.PI*y.y*e,t==="Right"?-1.6:-.1,t==="Right"?.1:1.6)):(z.z=x(h.z+o.z*-Math.PI*y.z*e,-2,2),z.x=x(h.x+o.z*-Math.PI*y.x,-2,2),z.y=x(h.y+o.z*-Math.PI*y.y*e,-2,2)),o.x=z.x,o.y=z.y,o.z=z.z}else o.z=x(o.z*-Math.PI*e,t==="Right"?-2.3:0,t==="Right"?0:2.3)})}),i},K=i=>{let t=new n(i[21]),e=new n(i[251]),r=new n(i[397]),s=new n(i[172]),a=r.lerp(s,.5);return{vector:[t,e,a],points:[t,e,r,s]}},Z=i=>{let t=n.rollPitchYaw(i[0],i[1],i[2]),e=i[0].lerp(i[1],.5),r=i[0].distance(i[1]),s=e.distance(i[2]);return t.x*=-1,t.z*=-1,{y:t.y*Math.PI,x:t.x*Math.PI,z:t.z*Math.PI,width:r,height:s,position:e.lerp(i[2],.5),normalized:{y:t.y,x:t.x,z:t.z},degrees:{y:t.y*180,x:t.x*180,z:t.z*180}}},G=i=>{const t=K(i);return Z(t.vector)},w={eye:{left:[130,133,160,159,158,144,145,153],right:[263,362,387,386,385,373,374,380]},brow:{left:[35,244,63,105,66,229,230,231],right:[265,464,293,334,296,449,450,451]},pupil:{right:[468,469,470,471,472],left:[473,474,475,476,477]}},W=(i,t="left")=>{let e=w.brow[t],r=O(i[e[0]],i[e[1]],i[e[2]],i[e[3]],i[e[4]],i[e[5]],i[e[6]],i[e[7]]),s=1.15,a=.125,l=.07,o=r/s-1;return(x(o,l,a)-l)/(a-l)},E=(i,t="left")=>{let e=w.eye[t],r=O(i[e[0]],i[e[1]],i[e[2]],i[e[3]],i[e[4]],i[e[5]],i[e[6]],i[e[7]]),s=.285,a=.85,l=.55,o=x(r/s,0,2);return{norm:f(o,l,a),raw:o}},O=(i,t,e,r,s,a,l,o)=>{i=new n(i),t=new n(t),e=new n(e),r=new n(r),s=new n(s),a=new n(a),l=new n(l),o=new n(o);const y=i.distance(t,2),h=e.distance(a,2),z=r.distance(l,2),g=s.distance(o,2);return(h+z+g)/3/y},Y=(i,t="left")=>{const e=new n(i[w.eye[t][0]]),r=new n(i[w.eye[t][1]]),s=e.distance(r,2),a=e.lerp(r,.5),l=new n(i[w.pupil[t][0]]),o=a.x-l.x,y=a.y-s*.075-l.y;let h=o/(s/2),z=y/(s/4);return h*=4,z*=4,{x:h,y:z}},J=(i,t,e=!1,r=12)=>{i.r=x(i.r,0,1),i.l=x(i.l,0,1);const s=Math.abs(i.l-i.r),a=e?1.1:.8,l=i.l<.3&&i.r<.3,o=i.l>.6&&i.r>.6;return t>r?{l:i.r,r:i.r}:t<-1*r?{l:i.l,r:i.l}:{l:s>=a&&!l&&!o?i.l:i.r>i.l?n.lerp(i.r,i.l,.95):n.lerp(i.r,i.l,.05),r:s>=a&&!l&&!o?i.r:i.r>i.l?n.lerp(i.r,i.l,.95):n.lerp(i.r,i.l,.05)}},Q=i=>{if(i.length<=468)return{eye:{l:1,r:1},brow:0};const t=E(i,"left"),e=E(i,"right");return{l:t.norm,r:e.norm}},$=i=>{if(i.length<=468)return{x:0,y:0};{const t=Y(i,"left"),e=Y(i,"right");return{x:(t.x+e.x)*.5,y:(t.y+e.y)*.5}}},j=i=>{if(i.length<=468)return 0;{const t=W(i,"left"),e=W(i,"right");return(t+e)/2}},v=(i,t,e="mediapipe")=>{const r=new n(i[133]),s=new n(i[362]),a=new n(i[130]),l=new n(i[263]),o=r.distance(s),y=a.distance(l),h=new n(i[13]),z=new n(i[14]),g=new n(i[61]),p=new n(i[291]),d=h.distance(z),c=g.distance(p);let D=c/d,I=d/o,L=c/y;I=f(I,.17,.5),L=f(L,.45,.9),L=(L-.3)*2;const R=I,F=e==="facemesh"?1.3:0;let M=f(D,1.3+F*.8,2.6+F)*f(R,.7,1),V=R*.2+R*(1-M)*.8,k=R*f(1-M,0,.3)*.1,_=f(k,.2,1)*(1-M)*.3,tt=(1-M)*f(R,.5,1)*.2;return{x:L,y:I,shape:{A:V,E:_,I:M,O:tt,U:k}}},b=(i,t,e)=>v(i,t,e);class q{constructor(){this.head={x:0,y:0,z:0},this.mouth={x:0,y:0},this.eye={l:1,r:1,indep:{l:1,r:1}},this.brow=0,this.pupil={x:0,y:0}}static solve(t,{runtime:e="mediapipe"}={}){if(!t){console.error("Need Face Landmarks");return}const r=G(t),s=Q(t),a=$(t),l=b(t,r.x,e),o=j(t,r.x);return{head:r,eye:s,brow:o,pupil:a,mouth:l}}}P(q,"stabilizeBlink",J),u.Face=q,u.Hand=X,u.Pose=A,u.Vector=n,Object.defineProperty(u,"__esModule",{value:!0}),u[Symbol.toStringTag]="Module"});
