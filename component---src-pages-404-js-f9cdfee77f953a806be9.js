"use strict";(self.webpackChunkbeatbracket=self.webpackChunkbeatbracket||[]).push([[883],{4442:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(7294),a=n(1883),o=n(8165),i=n(7066),l=n(2828);var c=e=>{let{loggedIn:t,noChanges:n}=e;const{0:c,1:s}=(0,r.useState)(!1),{0:u,1:d}=(0,r.useState)({display_name:"Guest",id:"",images:[{url:o.Z}]});return(0,r.useEffect)((()=>{t?(0,i.bG)().then((e=>{d(1!==e?e:{display_name:"Guest",id:"",images:[{url:o.Z}]})})):d({display_name:"Guest",id:"",images:[{url:o.Z}]})}),[t]),r.createElement("div",null,t?r.createElement("div",{className:"inline-block relative"},r.createElement("button",{type:"button",className:"flex items-center rounded-lg transition group shrink-0 border-0 hover:bg-transparent px-0",id:"menu-button","aria-expanded":"true","aria-haspopup":"true","data-dropdown-toggle":"dropdownNavbar",onClick:()=>{t&&s(!c)}},r.createElement("img",{className:"object-cover w-10 h-10 rounded-full",src:u.images[0].url,alt:u.display_name}),r.createElement("p",{className:"hidden ml-2 text-left sm:block"},r.createElement("strong",{className:"block text-s font-bold text-white"},u.display_name)),r.createElement("div",{hidden:!t},r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-5 h-5 ml-4 text-gray-300 transition sm:block group-hover:text-white",viewBox:"0 0 20 20",fill:"currentColor"},r.createElement("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})))),r.createElement("ul",{id:"dropdownNavbar",className:"absolute right-0 bg-white text-base z-10 list-none divide-y divide-gray-100 rounded shadow w-full cursor-pointer min-w-fit","aria-labelledby":"dropdownDefault",hidden:!c},r.createElement("li",null,r.createElement("button",{onClick:function(){var e;s(!1),e="/my-brackets",n(!0)&&(0,a.navigate)(e)},className:"py-2 px-4 items-center whitespace-nowrap flex gap-1 group-hover:bg-gray-200 border-0 w-full group"},r.createElement("span",null,"My Brackets")),r.createElement("button",{onClick:function(){n(!0)&&(s(!1),sessionStorage.clear(),localStorage.setItem("rememberMe",!1),(0,a.navigate)("/"))},className:"py-2 px-4 items-center rounded-t-none whitespace-nowrap flex gap-1 group-hover:bg-gray-200 border-0 w-full group"},r.createElement("span",null,"Sign out"),r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-secondary transition sm:block group-hover:text-secondary",viewBox:"0 0 24 24",fill:"currentColor"},r.createElement("path",{d:"M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z"})))))):r.createElement("div",{className:"border rounded"},r.createElement(l.Z,null)))};var s=e=>{let{loggedIn:t,noChanges:n}=e;return r.createElement("header",{className:"bg-black mb-4"},r.createElement("div",{className:"flex items-center min-h-fit px-4 mx-auto sm:px-6 lg:px-4 justify-between"},r.createElement("button",{className:"text-white text-2xl font-bold font-display bg-black border-0 hover:bg-black pl-0",onClick:function(){n(!0)&&(0,a.navigate)("/my-brackets")}},"Beat Bracket"),r.createElement(c,{loggedIn:t,noChanges:n})))},u=n(2618);var d=e=>{let{children:t,noChanges:n}=e;const{0:a,1:o}=(0,r.useState)(!0);return(0,r.useEffect)((()=>{(0,u.jP)()?(console.log("logged in"),o(!0)):o(!1);const e=setInterval((()=>{(0,u.jP)(e)?o(!0):o(!1)}),1e3);return()=>clearInterval(e)}),[]),r.createElement("div",{className:"text-center clear-both"},r.createElement("script",{async:!0,src:"//static.getclicky.com/101396268.js"}),r.createElement("noscript",null,r.createElement("p",null,r.createElement("img",{alt:"Clicky",width:"1",height:"1",src:"//in.getclicky.com/101396268ns.gif"}))),r.createElement("main",{className:"font-sans text-black bg-zinc-300 relative text-center min-h-screen pb-[24px]"},r.createElement(s,{loggedIn:a,noChanges:n}),t),r.createElement("div",{className:"relative h-[24px] -mt-[24px]"},"© Cooper Garren 2023"))}},2828:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(7294),a=n(2618),o=n.p+"static/Spotify_Logo_RGB_Green-0c4ae91bae23217d39c97c322a80e1fc.png";var i=()=>r.createElement("button",{onClick:function(){console.log(window.location);const e=window.location.origin+"/my-brackets",t=(0,a.zs)(16),n="true"!==localStorage.getItem("rememberMe");sessionStorage.setItem("spotify_auth_state",t);let r="https://accounts.spotify.com/authorize";r+="?response_type=token",r+="&client_id="+encodeURIComponent("fff2634975884bf88e3d3c9c2d77763d"),r+="&scope="+encodeURIComponent("playlist-modify-private playlist-modify-public user-read-private"),r+="&redirect_uri="+encodeURIComponent(e),r+="&state="+encodeURIComponent(t),r+="&show_dialog="+encodeURIComponent(n),localStorage.setItem("rememberMe",!0),window.location=r},className:"bg-black hover:bg-zinc-800 text-white border-black hover:border-zinc-800 inline-flex flex-row items-center justify-center"},r.createElement("span",null,"Login with "),r.createElement("img",{src:o,alt:"Spotify",className:"h-6 text-white"}))},429:function(e,t,n){n.r(t),n.d(t,{Head:function(){return i}});var r=n(7294),a=n(1883),o=n(4442);function i(){return r.createElement("title",null,"Page not found")}t.default=()=>r.createElement(o.Z,{noChanges:!0},r.createElement("main",{className:"text-center"},r.createElement("h1",{className:"font-bold text-2xl mb-2"},"Page not found"),r.createElement("button",{class:"border-black"},r.createElement(a.Link,{to:"/"},"Go home"))))},2618:function(e,t,n){n.d(t,{Lh:function(){return m},Sy:function(){return s},Vn:function(){return u},Yo:function(){return d},hG:function(){return i},ig:function(){return p},jP:function(){return l},oz:function(){return c},zs:function(){return o}});n(1120);var r=n(1883),a=n(7066);function o(e){let t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<e;r++)t+=n.charAt(Math.floor(Math.random()*n.length));return t}async function i(e){try{let t=function(){let e,t={},n=/([^&;=]+)=?([^&;]*)/g,r=window.location.hash.substring(1);t.raw_hash=window.location.hash;for(;e=n.exec(r);)t[e[1]]=decodeURIComponent(e[2]);return t}();return""!==t.raw_hash?(window.history.replaceState({},document.title,e),t.expires_at=Date.now()+1e3*parseInt(t.expires_in),delete t.expires_in,t):{}}catch(t){return console.error(t.message),{}}}function l(e){void 0===e&&(e=void 0);let t=new Date(parseInt(sessionStorage.getItem("expireTime")));return!(null===sessionStorage.getItem("expireTime")||null===sessionStorage.getItem("accessToken")||"Invalid Date"===t.toString()||Date.now()>t)||(e&&clearInterval(e),!1)}function c(e,t){return e.popularity>t.popularity?-1:e.popularity<t.popularity?1:e.name<t.name?-1:e.name>t.name}function s(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function u(e){let t=0,n=0;for(;t<=e;)t=2**(n+1),n++;return t}function d(e){let t=0,n=0,r=0;for(;n<=e;)t=n,n=2**(r+1),r++;return t}function m(e,t){const n=e[1],r=t[1];if("r"===n.side&&"l"===r.side)return-1;if("l"===n.side&&"r"===r.side)return 1;if("l"===n.side&&"l"===r.side)return n.col>r.col?-1:n.col<r.col||n.index>r.index?1:n.index<r.index?-1:0;if("r"===n.side&&"r"===r.side)return n.col>r.col?1:n.col<r.col?-1:n.index>r.index?1:n.index<r.index?-1:0;throw new Error("Found bracket with invalid side: "+n.side+" or "+r.side)}function p(e,t,n){void 0===t&&(t=void 0),void 0===n&&(n={}),console.log("Opening Bracket: "+e),(0,r.navigate)("/user/"+(t||(0,a.bG)().id)+"/bracket/"+e,{state:n})}},7066:function(e,t,n){n.d(t,{$t:function(){return l},bG:function(){return i},g7:function(){return o}});var r=n(8165),a=n(2618);async function o(e,t){if((0,a.jP)()){t&&(e=e+"?"+new URLSearchParams(t));const n=await fetch(e,{headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionStorage.getItem("accessToken")}});return n.ok?n.json():1}return 1}async function i(e){void 0===e&&(e=void 0);let t="https://api.spotify.com/v1/me";e&&(t="https://api.spotify.com/v1/users/"+e);const n=await o(t);return 1!==n?(0===n.images.length&&n.images.push({url:r.Z}),n):1}async function l(e){return e===(await i()).id}},8165:function(e,t,n){t.Z=n.p+"static/guestProfileImage-56ea6ecf196675a29e7b5ffca974fde1.png"}}]);
//# sourceMappingURL=component---src-pages-404-js-f9cdfee77f953a806be9.js.map