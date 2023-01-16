"use strict";(self.webpackChunkbeatbracket=self.webpackChunkbeatbracket||[]).push([[222],{8415:function(e,t,a){a.r(t),a.d(t,{Head:function(){return C},default:function(){return N}});var r=a(7294),n=a(8739),s=a(8159);var o=e=>{let{children:t,image:a,cardText:n,onClick:o=(()=>{}),removeFunc:l=null}=e;return r.createElement("div",{className:"relative"},l&&a?r.createElement("button",{onClick:l,className:"border-0 p-0 w-[30px] h-[30px] bg-white text-black absolute -top-2 -right-2 rounded-full"},"✕"):null,r.createElement("button",{className:"text-center p-3",onClick:o,disabled:!a},r.createElement("div",{className:"rounded-lg w-[320px] h-[320px]"},a?r.createElement("img",{src:a,className:"w-[320px] h-[320px]",width:"320px",height:"320px",alt:n}):r.createElement(s.Z,{loadingText:"",hidden:!1})),t,r.createElement("div",{className:""},n)))},l=a(2618),i=a(5253),c=a(7066);var d=e=>{let{bracket:t,userId:a}=e;const{0:n,1:s}=(0,r.useState)(null),{0:d,1:u}=(0,r.useState)("Loading...");return r.useEffect((()=>{t.artistId&&(u(r.createElement("div",{className:"inline-flex gap-0.5"},r.createElement("span",null,t.artistName?t.artistName+" ("+t.tracks+" tracks)":"Getting brackets..."),t.completed?r.createElement("span",{className:"text-green-600 text-xs font-medium inline-flex items-center px-0.5 py-0.5 rounded-md"},r.createElement("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}))):r.createElement("div",null))),async function(){const e="https://api.spotify.com/v1/artists/"+t.artistId,a=await(0,c.g7)(e);if(1===a)return null;return a.images[0].url}().then((e=>{s(e)})))}),[t]),r.createElement(o,{image:n,cardText:d,removeFunc:async function(){window.confirm("Are you sure you want to permanently delete this "+t.artistName+" bracket?")&&(console.log("removing bracket"),0===await(0,i.nl)(t.id,a)&&window.location.reload())},onClick:()=>{(0,l.ig)(t.id,a)}})};var u=e=>{let{text:t,activeTab:a,id:n,setActiveTab:s}=e;return r.createElement("button",{className:"text-gray-600 py-4 px-6 block bg-transparent hover:bg-transparent border-transparent hover:text-blue-500 hover:border-blue-500 focus:outline-none border-b-2 border-x-0 border-t-0 rounded-none font-medium "+(a===n?"text-blue-500 border-blue-500":""),onClick:()=>s(n)},t)},m=a.p+"static/createBracket-0d50326bd56d099bd40ebec3b048bc52.png";var g={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let p;const f=new Uint8Array(16);function b(){if(!p&&(p="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!p))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return p(f)}const h=[];for(let S=0;S<256;++S)h.push((S+256).toString(16).slice(1));function v(e,t=0){return(h[e[t+0]]+h[e[t+1]]+h[e[t+2]]+h[e[t+3]]+"-"+h[e[t+4]]+h[e[t+5]]+"-"+h[e[t+6]]+h[e[t+7]]+"-"+h[e[t+8]]+h[e[t+9]]+"-"+h[e[t+10]]+h[e[t+11]]+h[e[t+12]]+h[e[t+13]]+h[e[t+14]]+h[e[t+15]]).toLowerCase()}var E=function(e,t,a){if(g.randomUUID&&!t&&!e)return g.randomUUID();const r=(e=e||{}).random||(e.rng||b)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){a=a||0;for(let e=0;e<16;++e)t[a+e]=r[e];return t}return v(r)};var x=e=>{let{artistName:t,art:a,onClick:n}=e;return r.createElement("button",{onClick:n,className:"text-l flex first:rounded-t-[inherit] last:rounded-b-[inherit] w-auto bg-white hover:bg-gray-100 focus-visible:bg-gray-100 focus:border-blue-500 focus-visible:border-blue-500 focus:bg-gray-100 cursor-pointer py-1 px-2 border border-[rgba(0,0,0,0.125)] items-center"},r.createElement("img",{src:a,alt:t,className:"h-10 w-10"})," ",t)};var y=e=>{let{setArtist:t,disabled:a}=e;const{0:n,1:s}=(0,r.useState)(""),{0:o,1:l}=(0,r.useState)([]);return(0,r.useEffect)((()=>{!async function(){if(""!==n.trim()){var e="https://api.spotify.com/v1/search/?"+new URLSearchParams({q:n,type:"artist",limit:5}).toString();let a=await(0,c.g7)(e);if(1!==a&&a.artists.items.length>0){let e=[];a.artists.items.forEach((a=>{a.images.length>0&&e.push({name:a.name,art:a.images[2].url,id:a.id,onClick:()=>{t({name:a.name,id:a.id,art:a.images[2].url}),s("")}})})),l(e)}else l([])}else l([])}()}),[n]),(0,r.useEffect)((()=>{document.getElementById("searchbar").addEventListener("keydown",(e=>{"ArrowDown"===e.key&&(e.preventDefault(),document.getElementById("artist-list").children.length>0&&document.getElementById("artist-list").firstChild.focus())})),document.getElementById("artist-list").addEventListener("keydown",(e=>{document.getElementById("artist-list").children.length>0&&("ArrowUp"===e.key?(e.preventDefault(),e.stopPropagation(),document.activeElement===document.getElementById("artist-list").firstChild?document.getElementById("searchbar").focus():document.getElementById("artist-list").contains(document.activeElement)&&document.activeElement.previousSibling.focus()):"ArrowDown"===e.key&&(e.preventDefault(),e.stopPropagation(),document.getElementById("artist-list").contains(document.activeElement)&&document.activeElement.nextSibling&&document.activeElement.nextSibling.focus()))}))}),[]),r.createElement("div",{className:"inline-flex flex-col justify-items-center mb-2 place-items-center border-black border-0 rounded-md "},r.createElement("input",{placeholder:"Search for an artist...","aria-label":"Search for an artist...",size:"search",id:"searchbar",type:"search",spellCheck:!1,autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",autoFocus:!0,value:n,onChange:e=>s(e.target.value),className:"text-black text-2xl font-bar w-full p-1 border-2 border-gray-500 rounded focus:z-10 pl-3 mousetrap focus-visible:outline-none focus-visible:border-blue-500 focus-visible:border-1",disabled:a}),r.createElement("div",{id:"artist-list",className:"m-0 p-0 list-none flex-nowrap gap-0 inline-flex flex-col text-center w-full rounded"},o.map((e=>r.createElement(x,{artistName:e.name,art:e.art,onClick:e.onClick,key:e.id})))))};var w=e=>{let{userId:t}=e;const{0:a,1:n}=(0,r.useState)(void 0),{0:s,1:i}=(0,r.useState)(!1);return(0,r.useEffect)((()=>{if(a){const e=E();console.log("Create New Bracket with id: "+e),(0,l.ig)(e,t,{artist:a})}}),[a]),r.createElement("div",null,r.createElement(o,{image:m,cardText:"Create Bracket",onClick:function(){i(!0)}}),s?r.createElement("div",{tabIndex:"-1",className:"fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 h-modal h-full bg-black bg-opacity-50"},r.createElement("div",{className:"absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-auto"},r.createElement("div",{className:"relative bg-white rounded-lg shadow"},r.createElement("button",{type:"button",className:"absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ",onClick:()=>i(!1)},r.createElement("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},r.createElement("path",{fillRule:"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",clipRule:"evenodd"})),r.createElement("span",{className:"sr-only"},"Close modal")),r.createElement("div",{className:"p-6 text-center"},r.createElement(y,{setArtist:n}))))):null)},k=a(8711),I=a(1883);var N=()=>{const{0:e,1:t}=(0,r.useState)([{id:1,userId:void 0,artistName:void 0,artistId:void 0,tracks:void 0,completed:!1}]),{0:a,1:s}=(0,r.useState)(e),{0:o,1:m}=(0,r.useState)(0),{0:g,1:p}=(0,r.useState)(void 0),{0:f,1:b}=(0,r.useState)({show:!1,message:null,type:null,timeoutId:null}),{0:h,1:v}=(0,r.useState)(!1);function E(e,t,a){void 0===t&&(t="info"),void 0===a&&(a=!0),f.timeoutId&&clearTimeout(f.timeoutId);let r=null;a&&(r=setTimeout((()=>{b({show:!1,message:null,type:null,timeoutId:null})}),5e3)),b({show:!0,message:e,type:t,timeoutId:r})}return(0,r.useEffect)((()=>{s(e.filter((e=>0===o||(1===o?!e.completed:2!==o||e.completed))))}),[o,e]),(0,r.useEffect)((()=>{(async function(){const e=await(0,l.hG)(window.location.pathname);if(e&&Object.keys(e).length>0&&e.state===sessionStorage.getItem("spotify_auth_state")&&e.access_token&&e.expires_at){sessionStorage.setItem("accessToken",e.access_token),sessionStorage.setItem("expireTime",e.expires_at);const t=await(0,c.bG)();if(1===t)return console.log("Error getting user info"),void E("Error getting user info","error",!1);if(console.log(t),1===await(0,i.YR)(t.id,e.state,e.expires_at,e.access_token))return console.log("Error authenticating"),E("Error authenticating","error",!1),void(0,I.navigate)("/");sessionStorage.setItem("sessionId",e.state),sessionStorage.setItem("userId",t.id),sessionStorage.removeItem("spotify_auth_state")}})().then((()=>{p(sessionStorage.getItem("userId")),(0,i.fe)().then((e=>{1!==e?(console.log(e),t(e),s(e)):(console.log("Error loading brackets"),E("Error loading brackets, try logging in again","error",!1),v(!0))}))}))}),[]),r.createElement(n.Z,{noChanges:()=>!0},r.createElement(k.Z,{show:f.show,close:function(){f.timeoutId&&clearTimeout(f.timeoutId),b({show:!1,message:null,type:null,timeoutId:null})},message:f.message,type:f.type}),r.createElement("div",{className:"text-center",hidden:h},r.createElement("h1",{className:"text-4xl font-extrabold"},"My Brackets"),g?r.createElement("p",{className:"text-sm text-gray-500 mb-2"},e.length+"/10 brackets used"):null,r.createElement("div",{className:""},r.createElement("nav",{className:"inline-flex flex-row"},r.createElement(u,{id:0,activeTab:o,setActiveTab:m,text:"All"}),r.createElement(u,{id:1,activeTab:o,setActiveTab:m,text:"In Progess"}),r.createElement(u,{id:2,activeTab:o,setActiveTab:m,text:"Completed"}))),r.createElement("div",{className:"pt-3 flex flex-row flex-wrap justify-center items-stretch gap-5 sm:mx-5"},0===o&&e.length<10&&g?r.createElement(w,{userId:g}):null,a.map((e=>r.createElement(d,{bracket:e,key:e.id,userId:g}))))))};function C(){return r.createElement("title",null,"Beat Bracket")}}}]);
//# sourceMappingURL=component---src-pages-my-brackets-js-304799b4f61e9d9f293d.js.map