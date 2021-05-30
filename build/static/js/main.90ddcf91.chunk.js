(this["webpackJsonpcrypto-tracker"]=this["webpackJsonpcrypto-tracker"]||[]).push([[0],{29:function(e,t,n){},52:function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(0),i=n.n(o),c=n(20),s=n.n(c),l=(n(29),n(3)),a=n(11),u=n(6),d=n(8),m=n(9),b=n.n(m),f=n(23),v=n(10),p=n.n(v),j=n(21);var h=function(){var e=function(e,t){var n=Object(o.useState)((function(){try{var n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch(r){return console.log(r),t}})),r=Object(u.a)(n,2),i=r[0],c=r[1];return[i,function(t){try{var n=t instanceof Function?t(i):t;c(n),window.localStorage.setItem(e,JSON.stringify(n))}catch(r){console.log(r)}}]}("items",[]),t=Object(u.a)(e,2),n=t[0],i=t[1],c=Object(o.useMemo)((function(){var e=[{Header:"Symbol",accessor:"symbol",sticky:"left"}];return null===n||void 0===n||n.forEach((function(t,n){0!==n&&(e.push({Header:"CHG",accessor:t.timestamp.toString()+"CHG"}),e.push({Header:"VOL",accessor:t.timestamp.toString()+"VOL"})),e.push({Header:t.timestamp?p.a.unix(t.timestamp).format("HH:mm:ss"):null,accessor:t.timestamp.toString()})})),e}),[n]),s=Object(o.useMemo)((function(){var e;return null===n||void 0===n||null===(e=n[(null===n||void 0===n?void 0:n.length)-1])||void 0===e?void 0:e.data.filter((function(e){return e.symbol.includes("USDT")})).filter((function(e){return!e.symbol.includes("BULL")&&!e.symbol.includes("BEAR")&&!e.symbol.includes("UP")&&!e.symbol.includes("DOWN")})).filter((function(e){return e.symbol.endsWith("USDT")})).map((function(e){return{symbol:e.symbol.replace("USDT",""),volume:e.volume}}))}),[n]),m=Object(o.useMemo)((function(){return null===s||void 0===s?void 0:s.filter((function(e){return parseFloat(e.volume)>1e5})).sort((function(e,t){return parseFloat(t.volume)-parseFloat(e.volume)}))}),[s]),v=Object(o.useMemo)((function(){var e,t=null===n||void 0===n||null===(e=n[n.length-1])||void 0===e?void 0:e.data;return(null===t||void 0===t?void 0:t.filter((function(e){return e.symbol.includes("BTC")&&m.some((function(t){return e.symbol.includes(t.symbol)}))})))||[]}),[m,n]),h=Object(o.useMemo)((function(){return v.map((function(e){var t=e.symbol,o={symbol:Object(r.jsx)("a",{href:"https://www.binance.com/en/trade/"+e.symbol,target:"_blank",children:e.symbol})};return n.forEach((function(e,r){var i,c=e.data.find((function(e){return e.symbol===t})),s=null===(i=n[r-1])||void 0===i?void 0:i.data.find((function(e){return e.symbol===t})),l=e.timestamp.toString();(null===c||void 0===c?void 0:c.lastPrice.endsWith("000000"))?o[l]=null===c||void 0===c?void 0:c.lastPrice.replace("000000",""):o[l]=null===c||void 0===c?void 0:c.lastPrice.replace("00000000",""),o[l+"VOL"]=(Math.round((null===s||void 0===s?void 0:s.volume)/(null===c||void 0===c?void 0:c.volume)*1e3)/10-100).toFixed(1)+"%";var a=Math.round((null===s||void 0===s?void 0:s.lastPrice)/(null===c||void 0===c?void 0:c.lastPrice)*1e3)/10-100;0!==a&&(o[l+"CHG"]=a.toFixed(1)+"%")})),o}))||[]}),[n]);console.log({columns:c,data:h,filteredUSDTCoins:m,filteredItems:v,items:n});var O=Object(d.useTable)({columns:c,data:h,initialState:{sortBy:[{id:"Symbol",desc:!1}]}},d.useSortBy,j.useSticky),y=O.getTableProps,g=O.getTableBodyProps,S=O.headerGroups,x=O.rows,P=O.prepareRow;return Object(o.useEffect)((function(){b.a.defaults.baseURL="https://api.binance.com",b.a.get("/api/v3/ticker/24hr").then((function(e){return i((function(t){var n=Object(a.a)(t);return t.length>10&&n.splice(0,t.length-9),n.unshift({timestamp:p()().unix(),data:e.data.map((function(e){return{symbol:e.symbol,volume:e.quoteVolume,lastPrice:e.lastPrice}}))}),n}))}))}),[]),Object(r.jsxs)(f.a,Object(l.a)(Object(l.a)({striped:!0,bordered:!0,hover:!0,size:"sm"},y()),{},{className:"table sticky",children:[Object(r.jsx)("thead",{className:"header",children:S.map((function(e){return Object(r.jsx)("tr",Object(l.a)(Object(l.a)({},e.getHeaderGroupProps()),{},{children:e.headers.map((function(e){return Object(r.jsx)("th",{children:Object(r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(r.jsxs)("div",Object(l.a)(Object(l.a)({},e.getHeaderProps(e.getSortByToggleProps())),{},{children:[e.render("Header"),e.isSorted?e.isSortedDesc?"\ud83d\udd3d":"\ud83d\udd3c":""]})),!isNaN(e.id)&&Object(r.jsx)("a",{href:"#",onClick:function(){return i((function(t){var n=t.find((function(t){return t.timestamp===+e.id}));if(-1!==n){var r=Object(a.a)(t);return r.splice(n,1),r}}))},children:"X"})]})})}))}))}))}),Object(r.jsx)("tbody",Object(l.a)(Object(l.a)({},g()),{},{children:x.map((function(e){return P(e),Object(r.jsx)("tr",Object(l.a)(Object(l.a)({},e.getRowProps()),{},{children:e.cells.map((function(e,t){return Object(r.jsx)("td",Object(l.a)(Object(l.a)({},e.getCellProps()),{},{children:e.render("Cell")}))}))}))}))}))]}))};s.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(h,{})}),document.getElementById("root"))}},[[52,1,2]]]);
//# sourceMappingURL=main.90ddcf91.chunk.js.map