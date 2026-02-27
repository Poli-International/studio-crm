import{e as d,_ as v,r as u,f as y,c as l,a as e,g as i,h as x,i as c,d as b,v as k,F as f,j as C,u as L,o as r,t as o}from"./index-CDUqUUsz.js";/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=d("EyeIcon",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=d("PlusIcon",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=d("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),M={class:"page-container"},z={class:"page-header"},I={class:"btn btn-primary flex-center"},S={class:"card"},j={class:"toolbar"},N={class:"search-box"},B={class:"data-table"},D={class:"font-medium"},E={class:"contact-info"},q={class:"text-sm text-muted"},A=["onClick"],F={__name:"ClientList",setup(J){const m=L(),n=u(""),h=u([{id:1,name:"John Doe",email:"john@example.com",phone:"555-0123",lastVisit:"2023-11-15"},{id:2,name:"Jane Smith",email:"jane@example.com",phone:"555-0124",lastVisit:"2023-11-20"},{id:3,name:"Mike Ross",email:"mike@example.com",phone:"555-0125",lastVisit:"2023-12-01"}]),p=y(()=>h.value.filter(a=>a.name.toLowerCase().includes(n.value.toLowerCase())||a.email.toLowerCase().includes(n.value.toLowerCase()))),_=a=>{m.push(`/clients/${a}`)};return(a,t)=>(r(),l("div",M,[e("div",z,[t[2]||(t[2]=e("div",null,[e("h1",null,"Clients"),e("p",{class:"subtitle"},"Manage your client base")],-1)),e("button",I,[i(c(g),{size:"18",style:{"margin-right":"0.5rem"}}),t[1]||(t[1]=x(" Add Client ",-1))])]),e("div",S,[e("div",j,[e("div",N,[i(c(w),{size:"18",class:"search-icon"}),b(e("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=s=>n.value=s),placeholder:"Search by name or email...",class:"form-input search-input"},null,512),[[k,n.value]])])]),e("table",B,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",null,"Name"),e("th",null,"Contact"),e("th",null,"Last Visit"),e("th",null,"Actions")])],-1)),e("tbody",null,[(r(!0),l(f,null,C(p.value,s=>(r(),l("tr",{key:s.id},[e("td",D,o(s.name),1),e("td",null,[e("div",E,[e("div",null,o(s.email),1),e("div",q,o(s.phone),1)])]),e("td",null,o(s.lastVisit),1),e("td",null,[e("button",{class:"btn-icon",onClick:P=>_(s.id)},[i(c(V),{size:"18"})],8,A)])]))),128))])])])]))}},T=v(F,[["__scopeId","data-v-6b76eecc"]]);export{T as default};
