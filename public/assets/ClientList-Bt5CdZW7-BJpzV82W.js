import{q as y,F as r,C as b,U as i,B as e,c,s as k,X as o,W as d,H as C,b as x,d as f,j as V,Q as g,o as u,O as n}from"./index-fDQjJq_K.js";/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=d("EyeIcon",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
* @license lucide-vue-next v0.300.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/const w=d("PlusIcon",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
* @license lucide-vue-next v0.300.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/const z=d("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),L={class:"page-container"},M={class:"page-header"},q={class:"btn btn-primary flex-center"},I={class:"card"},_={class:"toolbar"},B={class:"search-box"},S={class:"data-table"},U={class:"font-medium"},A={class:"contact-info"},F={class:"text-sm text-muted"},J=["onClick"],D={__name:"ClientList",setup(E){const m=g(),t=r(""),h=r([{id:1,name:"John Doe",email:"john@example.com",phone:"555-0123",lastVisit:"2023-11-15"},{id:2,name:"Jane Smith",email:"jane@example.com",phone:"555-0124",lastVisit:"2023-11-20"},{id:3,name:"Mike Ross",email:"mike@example.com",phone:"555-0125",lastVisit:"2023-12-01"}]),p=b(()=>h.value.filter(s=>s.name.toLowerCase().includes(t.value.toLowerCase())||s.email.toLowerCase().includes(t.value.toLowerCase()))),v=s=>{m.push(`/clients/${s}`)};return(s,a)=>(u(),i("div",L,[e("div",M,[a[2]||(a[2]=e("div",null,[e("h1",null,"Clients"),e("p",{class:"subtitle"},"Manage your client base")],-1)),e("button",q,[c(o(w),{size:"18",style:{"margin-right":"0.5rem"}}),a[1]||(a[1]=k(" Add Client ",-1))])]),e("div",I,[e("div",_,[e("div",B,[c(o(z),{size:"18",class:"search-icon"}),C(e("input",{type:"text","onUpdate:modelValue":a[0]||(a[0]=l=>t.value=l),placeholder:"Search by name or email...",class:"form-input search-input"},null,512),[[x,t.value]])])]),e("table",S,[a[3]||(a[3]=e("thead",null,[e("tr",null,[e("th",null,"Name"),e("th",null,"Contact"),e("th",null,"Last Visit"),e("th",null,"Actions")])],-1)),e("tbody",null,[(u(!0),i(f,null,V(p.value,l=>(u(),i("tr",{key:l.id},[e("td",U,n(l.name),1),e("td",null,[e("div",A,[e("div",null,n(l.email),1),e("div",F,n(l.phone),1)])]),e("td",null,n(l.lastVisit),1),e("td",null,[e("button",{class:"btn-icon",onClick:H=>v(l.id)},[c(o(j),{size:"18"})],8,J)])]))),128))])])])]))}},O=y(D,[["__scopeId","data-v-6b76eecc"]]);export{O as default};
