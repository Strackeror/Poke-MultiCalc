import{H as b,s as S,O as T,R as I,$ as O}from"./index.a23bac2e.js";const f=[];function x(e,t){return{subscribe:p(e,t).subscribe}}function p(e,t=b){let s;const r=new Set;function a(n){if(S(e,n)&&(e=n,s)){const u=!f.length;for(const l of r)l[1](),f.push(l,e);if(u){for(let l=0;l<f.length;l+=2)f[l][0](f[l+1]);f.length=0}}}function i(n){a(n(e))}function o(n,u=b){const l=[n,u];return r.add(l),r.size===1&&(s=t(a)||b),n(e),()=>{r.delete(l),r.size===0&&s&&(s(),s=null)}}return{set:a,update:i,subscribe:o}}function j(e,t,s){const r=!Array.isArray(e),a=r?[e]:e,i=t.length<2;return x(s,o=>{let n=!1;const u=[];let l=0,_=b;const g=()=>{if(l)return;_();const c=t(r?u[0]:u,o);i?o(c):_=O(c)?c:b},w=a.map((c,h)=>T(c,R=>{u[h]=R,l&=~(1<<h),n&&g()},()=>{l|=1<<h}));return n=!0,g(),function(){I(w),_(),n=!1}})}var y;const U=((y=globalThis.__sveltekit_10519rv)==null?void 0:y.base)??"/Poke-MultiCalc";var A;const L=((A=globalThis.__sveltekit_10519rv)==null?void 0:A.assets)??U,N="1682534507065",q="sveltekit:snapshot",C="sveltekit:scroll",K="sveltekit:index",k={tap:1,hover:2,viewport:3,eager:4,off:-1};function z(e){let t=e.baseURI;if(!t){const s=e.getElementsByTagName("base");t=s.length?s[0].href:e.URL}return t}function D(){return{x:pageXOffset,y:pageYOffset}}function d(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const v={...k,"":k.hover};function E(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function G(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=E(e)}}function H(e,t){let s;try{s=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,a=!s||!!r||V(s,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external")||e.hasAttribute("download");return{url:s,external:a,target:r}}function X(e){let t=null,s=null,r=null,a=null,i=null,o=null,n=e;for(;n&&n!==document.documentElement;)r===null&&(r=d(n,"preload-code")),a===null&&(a=d(n,"preload-data")),t===null&&(t=d(n,"keepfocus")),s===null&&(s=d(n,"noscroll")),i===null&&(i=d(n,"reload")),o===null&&(o=d(n,"replacestate")),n=E(n);return{preload_code:v[r??"off"],preload_data:v[a??"off"],keep_focus:t==="off"?!1:t===""?!0:null,noscroll:s==="off"?!1:s===""?!0:null,reload:i==="off"?!1:i===""?!0:null,replace_state:o==="off"?!1:o===""?!0:null}}function m(e){const t=p(e);let s=!0;function r(){s=!0,t.update(o=>o)}function a(o){s=!1,t.set(o)}function i(o){let n;return t.subscribe(u=>{(n===void 0||s&&u!==n)&&o(n=u)})}return{notify:r,set:a,subscribe:i}}function P(){const{set:e,subscribe:t}=p(!1);let s;async function r(){clearTimeout(s);const a=await fetch(`${L}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(a.ok){const o=(await a.json()).version!==N;return o&&(e(!0),clearTimeout(s)),o}else throw new Error(`Version check failed: ${a.status}`)}return{subscribe:t,check:r}}function V(e,t){return e.origin!==location.origin||!e.pathname.startsWith(t)}let $;function B(e){$=e.client}const M={url:m({}),page:m({}),navigating:p(null),updated:P()};export{K as I,k as P,C as S,q as a,H as b,X as c,D as d,U as e,G as f,z as g,B as h,V as i,j,$ as k,M as s,p as w};
