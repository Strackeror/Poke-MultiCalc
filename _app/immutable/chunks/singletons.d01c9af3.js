import{H as b,s as R,N as S,T as I,$ as x}from"./index.b9f1d530.js";const f=[];function N(e,t){return{subscribe:p(e,t).subscribe}}function p(e,t=b){let s;const r=new Set;function l(n){if(R(e,n)&&(e=n,s)){const u=!f.length;for(const a of r)a[1](),f.push(a,e);if(u){for(let a=0;a<f.length;a+=2)f[a][0](f[a+1]);f.length=0}}}function i(n){l(n(e))}function o(n,u=b){const a=[n,u];return r.add(a),r.size===1&&(s=t(l)||b),n(e),()=>{r.delete(a),r.size===0&&s&&(s(),s=null)}}return{set:l,update:i,subscribe:o}}function Y(e,t,s){const r=!Array.isArray(e),l=r?[e]:e,i=t.length<2;return N(s,o=>{let n=!1;const u=[];let a=0,_=b;const g=()=>{if(a)return;_();const c=t(r?u[0]:u,o);i?o(c):_=x(c)?c:b},w=l.map((c,h)=>S(c,T=>{u[h]=T,a&=~(1<<h),n&&g()},()=>{a|=1<<h}));return n=!0,g(),function(){I(w),_(),n=!1}})}var y;const O=((y=globalThis.__sveltekit_tcrlq)==null?void 0:y.base)??"/Poke-MultiCalc";var A;const U=((A=globalThis.__sveltekit_tcrlq)==null?void 0:A.assets)??O,q="1682959172171",j="sveltekit:snapshot",C="sveltekit:scroll",K="sveltekit:index",k={tap:1,hover:2,viewport:3,eager:4,off:-1};function z(e){let t=e.baseURI;if(!t){const s=e.getElementsByTagName("base");t=s.length?s[0].href:e.URL}return t}function D(){return{x:pageXOffset,y:pageYOffset}}function d(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const v={...k,"":k.hover};function E(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function G(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=E(e)}}function H(e,t){let s;try{s=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,l=!s||!!r||P(s,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external")||e.hasAttribute("download");return{url:s,external:l,target:r}}function X(e){let t=null,s=null,r=null,l=null,i=null,o=null,n=e;for(;n&&n!==document.documentElement;)r===null&&(r=d(n,"preload-code")),l===null&&(l=d(n,"preload-data")),t===null&&(t=d(n,"keepfocus")),s===null&&(s=d(n,"noscroll")),i===null&&(i=d(n,"reload")),o===null&&(o=d(n,"replacestate")),n=E(n);return{preload_code:v[r??"off"],preload_data:v[l??"off"],keep_focus:t==="off"?!1:t===""?!0:null,noscroll:s==="off"?!1:s===""?!0:null,reload:i==="off"?!1:i===""?!0:null,replace_state:o==="off"?!1:o===""?!0:null}}function m(e){const t=p(e);let s=!0;function r(){s=!0,t.update(o=>o)}function l(o){s=!1,t.set(o)}function i(o){let n;return t.subscribe(u=>{(n===void 0||s&&u!==n)&&o(n=u)})}return{notify:r,set:l,subscribe:i}}function L(){const{set:e,subscribe:t}=p(!1);let s;async function r(){clearTimeout(s);const l=await fetch(`${U}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(l.ok){const o=(await l.json()).version!==q;return o&&(e(!0),clearTimeout(s)),o}else throw new Error(`Version check failed: ${l.status}`)}return{subscribe:t,check:r}}function P(e,t){return e.origin!==location.origin||!e.pathname.startsWith(t)}let V;function B(e){V=e.client}const M={url:m({}),page:m({}),navigating:p(null),updated:L()};export{K as I,k as P,C as S,j as a,H as b,X as c,D as d,O as e,G as f,z as g,B as h,P as i,Y as j,V as k,M as s,p as w};
