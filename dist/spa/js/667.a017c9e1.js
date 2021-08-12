"use strict";(self["webpackChunktwitter"]=self["webpackChunktwitter"]||[]).push([[667],{6667:(e,t,l)=>{l.r(t),l.d(t,{default:()=>T});var o=l(3673);function a(e,t,l,a,r,n){const i=(0,o.up)("example-component"),s=(0,o.up)("q-page");return(0,o.wg)(),(0,o.j4)(s,{class:"row items-center justify-evenly"},{default:(0,o.w5)((()=>[(0,o.Wm)(i,{title:"Example component",active:""})])),_:1})}var r=l(2323);const n={class:"q-pa-md doc-container w100",style:{"align-self":"flex-start"}},i={class:"col w100 self-center flex"},s={class:"q-pa-md w100"},u={class:"w100 flex",style:{"justify-content":"space-around"}};function d(e,t,l,a,d,m){const p=(0,o.up)("q-input"),c=(0,o.up)("q-date"),w=(0,o.up)("q-time"),f=(0,o.up)("q-btn"),b=(0,o.up)("q-form"),h=(0,o.up)("q-td"),v=(0,o.up)("q-popup-edit"),y=(0,o.up)("q-tr"),g=(0,o.up)("q-table");return(0,o.wg)(),(0,o.j4)("div",n,[(0,o.Wm)("div",i,[(0,o.Wm)("div",s,[(0,o.Wm)(b,{onSubmit:e.onSubmit,onReset:e.onReset,class:"q-gutter-md"},{default:(0,o.w5)((()=>[(0,o.Wm)(p,{filled:"",modelValue:e.tweet,"onUpdate:modelValue":t[1]||(t[1]=t=>e.tweet=t),label:"Your tweet",hint:"Max 160",maxlength:"160","lazy-rules":"",rules:[e=>e&&e.length>0||"Please tweet something"]},null,8,["modelValue","rules"]),(0,o.Wm)("div",u,[(0,o.Wm)(c,{modelValue:e.days,"onUpdate:modelValue":t[2]||(t[2]=t=>e.days=t),multiple:"",events:e.events,options:e.optionsFn},null,8,["modelValue","events","options"]),(0,o.Wm)(w,{modelValue:e.time,"onUpdate:modelValue":t[3]||(t[3]=t=>e.time=t),format24h:""},null,8,["modelValue"])]),(0,o.Wm)("div",null,[(0,o.Wm)(f,{label:"Submit",type:"submit",color:"primary"}),(0,o.Wm)(f,{label:"Reset",type:"reset",color:"primary",flat:"",class:"q-ml-sm"})])])),_:1},8,["onSubmit","onReset"])])]),(0,o.Wm)(g,{class:"w100",title:"Tweets",rows:e.rows,columns:e.columns,"row-key":"tweet_id"},{body:(0,o.w5)((t=>[(0,o.Wm)(y,{props:t},{default:(0,o.w5)((()=>[(0,o.Wm)(h,{key:"tweet_id",props:t},{default:(0,o.w5)((()=>[(0,o.Wm)(f,{round:"",color:"deep-orange",onClick:l=>e.deleteTweet(t),icon:"delete"},null,8,["onClick"])])),_:2},1032,["props"]),(0,o.Wm)(h,{key:"tweet",props:t},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(t.row.tweet)+" ",1),(0,o.Wm)(v,{modelValue:t.row.tweet,"onUpdate:modelValue":e=>t.row.tweet=e},{default:(0,o.w5)((()=>[(0,o.Wm)(p,{modelValue:t.row.tweet,"onUpdate:modelValue":e=>t.row.tweet=e,dense:"",autofocus:"",counter:""},null,8,["modelValue","onUpdate:modelValue"])])),_:2},1032,["modelValue","onUpdate:modelValue"])])),_:2},1032,["props"]),(0,o.Wm)(h,{key:"date",props:t},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(t.row.date)+" ",1),(0,o.Wm)(v,{modelValue:t.row.date,"onUpdate:modelValue":e=>t.row.date=e,title:"Update date"},{default:(0,o.w5)((()=>[(0,o.Wm)(c,{options:e.optionsFn,"onUpdate:modelValue":[l=>e.refreshData(t),e=>t.row.date=e],modelValue:t.row.date},null,8,["options","onUpdate:modelValue","modelValue"])])),_:2},1032,["modelValue","onUpdate:modelValue"])])),_:2},1032,["props"]),(0,o.Wm)(h,{key:"time",props:t},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(t.row.time)+" ",1),(0,o.Wm)(v,{modelValue:t.row.time,"onUpdate:modelValue":e=>t.row.time=e,title:"Update time"},{default:(0,o.w5)((()=>[(0,o.Wm)(w,{modelValue:t.row.time,"onUpdate:modelValue":e=>t.row.time=e,format24h:""},null,8,["modelValue","onUpdate:modelValue"])])),_:2},1032,["modelValue","onUpdate:modelValue"])])),_:2},1032,["props"])])),_:2},1032,["props"])])),_:1},8,["rows","columns"])])}var m=l(8825),p=l(5777);class c{constructor(){Object.defineProperty(this,"title",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"todos",{enumerable:!0,configurable:!0,writable:!0,value:(0,p.vg)({default:()=>[]})}),Object.defineProperty(this,"meta",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"active",{enumerable:!0,configurable:!0,writable:!0,value:void 0})}}class w extends(p.w3.with(c)){constructor(){super(...arguments),Object.defineProperty(this,"clickCount",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"accept",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"$q",{enumerable:!0,configurable:!0,writable:!0,value:(0,m.Z)()}),Object.defineProperty(this,"tweet",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"days",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"time",{enumerable:!0,configurable:!0,writable:!0,value:"12:00"}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"rows",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"columns",{enumerable:!0,configurable:!0,writable:!0,value:[{name:"tweet_id",required:!0,label:"Delete",align:"left",field:e=>e.tweet_id},{name:"tweet",required:!0,label:"Tweet",align:"left",field:e=>e.tweet,format:e=>`${e}`,sortable:!0},{name:"date",align:"center",label:"date",field:"date",sortable:!0},{name:"time",align:"center",label:"time",field:"time",sortable:!0}]})}optionsFn(e){return new Date(e).getTime()>=(new Date).getTime()}increment(){this.clickCount+=1}onReset(){this.tweet=""}refreshData(e){setTimeout((()=>{const t=e.row,l=e.rowIndex;this.events[l]=t.date}),100)}deleteTweet(e){const t=e.rowIndex;this.events.splice(t,1),this.rows.splice(t,1),this.showNotif(e.row.tweet)}showNotif(e){this.$q.notify({message:"Deleted - "+e,color:"negative"})}formatDate(){}onSubmit(){this.days.forEach((e=>{this.rows.unshift({tweet_id:(new Date).getTime(),tweet:this.tweet,date:e,time:this.time})})),this.events.unshift(...this.days),this.days=[],this.time="12:00",this.tweet=""}}var f=l(8689),b=l(4842),h=l(2651),v=l(5990),y=l(4607),g=l(5816),V=l(8186),W=l(3884),j=l(1289),U=l(7518),q=l.n(U);w.render=d;const P=w;q()(w,"components",{QForm:f.Z,QInput:b.Z,QDate:h.Z,QTime:v.Z,QBtn:y.Z,QTable:g.Z,QTr:V.Z,QTd:W.Z,QPopupEdit:j.Z});var k=function(e,t,l,o){var a,r=arguments.length,n=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,l):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)n=Reflect.decorate(e,t,l,o);else for(var i=e.length-1;i>=0;i--)(a=e[i])&&(n=(r<3?a(n):r>3?a(t,l,n):a(t,l))||n);return r>3&&n&&Object.defineProperty(t,l,n),n};let O=class extends p.w3{};O=k([(0,p.Ei)({components:{ExampleComponent:P}})],O);const _=O;var x=l(4379);_.render=a;const T=_;q()(_,"components",{QPage:x.Z})}}]);