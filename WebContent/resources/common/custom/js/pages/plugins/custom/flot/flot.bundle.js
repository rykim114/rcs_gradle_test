"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(r){var t=function(t,e){var n=e.getElementsByClassName(t)[0];if(!n&&((n=document.createElement("canvas")).className=t,n.style.direction="ltr",n.style.position="absolute",n.style.left="0px",n.style.top="0px",e.appendChild(n),!n.getContext))throw new Error("Canvas is not available.");this.element=n;var o=this.context=n.getContext("2d");this.pixelRatio=r.plot.browser.getPixelRatio(o);var i=r(e).width(),a=r(e).height();this.resize(i,a),this.SVGContainer=null,this.SVG={},this._textCache={}};function f(e,t){e.transform.baseVal.clear(),t&&t.forEach(function(t){e.transform.baseVal.appendItem(t)})}t.prototype.resize=function(t,e){t=t<10?10:t,e=e<10?10:e;var n=this.element,o=this.context,i=this.pixelRatio;this.width!==t&&(n.width=t*i,n.style.width=t+"px",this.width=t),this.height!==e&&(n.height=e*i,n.style.height=e+"px",this.height=e),o.restore(),o.save(),o.scale(i,i)},t.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},t.prototype.render=function(){var t=this._textCache;for(var e in t)if(hasOwnProperty.call(t,e)){var n=this.getSVGLayer(e),o=t[e],i=n.style.display;for(var a in n.style.display="none",o)if(hasOwnProperty.call(o,a)){var r=o[a];for(var s in r)if(hasOwnProperty.call(r,s)){for(var l,c=r[s],u=c.positions,p=0;u[p];p++)if((l=u[p]).active)l.rendered||(n.appendChild(l.element),l.rendered=!0);else if(u.splice(p--,1),l.rendered){for(;l.element.firstChild;)l.element.removeChild(l.element.firstChild);l.element.parentNode.removeChild(l.element)}0===u.length&&(c.measured?c.measured=!1:delete r[s])}}n.style.display=i}},t.prototype.getSVGLayer=function(t){var e,n=this.SVG[t];n||(this.SVGContainer?e=this.SVGContainer.firstChild:(this.SVGContainer=document.createElement("div"),this.SVGContainer.className="flot-svg",this.SVGContainer.style.position="absolute",this.SVGContainer.style.top="0px",this.SVGContainer.style.left="0px",this.SVGContainer.style.height="100%",this.SVGContainer.style.width="100%",this.SVGContainer.style.pointerEvents="none",this.element.parentNode.appendChild(this.SVGContainer),(e=document.createElementNS("http://www.w3.org/2000/svg","svg")).style.width="100%",e.style.height="100%",this.SVGContainer.appendChild(e)),(n=document.createElementNS("http://www.w3.org/2000/svg","g")).setAttribute("class",t),n.style.position="absolute",n.style.top="0px",n.style.left="0px",n.style.bottom="0px",n.style.right="0px",e.appendChild(n),this.SVG[t]=n);return n},t.prototype.getTextInfo=function(t,e,n,o,i){var a,r,s,l;e=""+e,a="object"===_typeof(n)?n.style+" "+n.variant+" "+n.weight+" "+n.size+"px/"+n.lineHeight+"px "+n.family:n,null==(r=this._textCache[t])&&(r=this._textCache[t]={}),null==(s=r[a])&&(s=r[a]={});var c=e.replace(/0|1|2|3|4|5|6|7|8|9/g,"0");if(!(l=s[c])){var u=document.createElementNS("http://www.w3.org/2000/svg","text");if(-1!==e.indexOf("<br>"))m(e,u,-9999);else{var p=document.createTextNode(e);u.appendChild(p)}u.style.position="absolute",u.style.maxWidth=i,u.setAttributeNS(null,"x",-9999),u.setAttributeNS(null,"y",-9999),"object"===_typeof(n)?(u.style.font=a,u.style.fill=n.fill):"string"==typeof n&&u.setAttribute("class",n),this.getSVGLayer(t).appendChild(u);var h=u.getBBox();for(l=s[c]={width:h.width,height:h.height,measured:!0,element:u,positions:[]};u.firstChild;)u.removeChild(u.firstChild);u.parentNode.removeChild(u)}return l.measured=!0,l},t.prototype.addText=function(t,e,n,o,i,a,r,s,l,c){var u=this.getTextInfo(t,o,i,a,r),p=u.positions;"center"===s?e-=u.width/2:"right"===s&&(e-=u.width),"middle"===l?n-=u.height/2:"bottom"===l&&(n-=u.height),n+=.75*u.height;for(var h,d=0;p[d];d++){if((h=p[d]).x===e&&h.y===n&&h.text===o)return h.active=!0,void f(h.element,c);if(!1===h.active)return h.active=!0,-1!==(h.text=o).indexOf("<br>")?(n-=.25*u.height,m(o,h.element,e)):h.element.textContent=o,h.element.setAttributeNS(null,"x",e),h.element.setAttributeNS(null,"y",n),h.x=e,h.y=n,void f(h.element,c)}h={active:!0,rendered:!1,element:p.length?u.element.cloneNode():u.element,text:o,x:e,y:n},p.push(h),-1!==o.indexOf("<br>")?(n-=.25*u.height,m(o,h.element,e)):h.element.textContent=o,h.element.setAttributeNS(null,"x",e),h.element.setAttributeNS(null,"y",n),h.element.style.textAlign=s,f(h.element,c)};var m=function(t,e,n){var o,i,a,r=t.split("<br>");for(i=0;i<r.length;i++)e.childNodes[i]?o=e.childNodes[i]:(o=document.createElementNS("http://www.w3.org/2000/svg","tspan"),e.appendChild(o)),o.textContent=r[i],a=1*i+"em",o.setAttributeNS(null,"dy",a),o.setAttributeNS(null,"x",n)};t.prototype.removeText=function(t,e,n,o,i,a){var r,s;if(null==o){var l=this._textCache[t];if(null!=l)for(var c in l)if(hasOwnProperty.call(l,c)){var u=l[c];for(var p in u)if(hasOwnProperty.call(u,p)){var h=u[p].positions;h.forEach(function(t){t.active=!1})}}}else(h=(r=this.getTextInfo(t,o,i,a)).positions).forEach(function(t){s=n+.75*r.height,t.x===e&&t.y===s&&t.text===o&&(t.active=!1)})},t.prototype.clearCache=function(){var t=this._textCache;for(var e in t)if(hasOwnProperty.call(t,e))for(var n=this.getSVGLayer(e);n.firstChild;)n.removeChild(n.firstChild);this._textCache={}},window.Flot||(window.Flot={}),window.Flot.Canvas=t}(jQuery),function(a){a.color={},a.color.make=function(t,e,n,o){var i={};return i.r=t||0,i.g=e||0,i.b=n||0,i.a=null!=o?o:1,i.add=function(t,e){for(var n=0;n<t.length;++n)i[t.charAt(n)]+=e;return i.normalize()},i.scale=function(t,e){for(var n=0;n<t.length;++n)i[t.charAt(n)]*=e;return i.normalize()},i.toString=function(){return 1<=i.a?"rgb("+[i.r,i.g,i.b].join(",")+")":"rgba("+[i.r,i.g,i.b,i.a].join(",")+")"},i.normalize=function(){function t(t,e,n){return e<t?t:n<e?n:e}return i.r=t(0,parseInt(i.r),255),i.g=t(0,parseInt(i.g),255),i.b=t(0,parseInt(i.b),255),i.a=t(0,i.a,1),i},i.clone=function(){return a.color.make(i.r,i.b,i.g,i.a)},i.normalize()},a.color.extract=function(t,e){var n;do{if(""!==(n=t.css(e).toLowerCase())&&"transparent"!==n)break;t=t.parent()}while(t.length&&!a.nodeName(t.get(0),"body"));return"rgba(0, 0, 0, 0)"===n&&(n="transparent"),a.color.parse(n)},a.color.parse=function(t){var e,n=a.color.make;if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(t))return n(parseInt(e[1],10),parseInt(e[2],10),parseInt(e[3],10));if(e=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(t))return n(parseInt(e[1],10),parseInt(e[2],10),parseInt(e[3],10),parseFloat(e[4]));if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/.exec(t))return n(2.55*parseFloat(e[1]),2.55*parseFloat(e[2]),2.55*parseFloat(e[3]));if(e=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(t))return n(2.55*parseFloat(e[1]),2.55*parseFloat(e[2]),2.55*parseFloat(e[3]),parseFloat(e[4]));if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(t))return n(parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16));if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(t))return n(parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16));var o=a.trim(t).toLowerCase();return"transparent"===o?n(255,255,255,0):n((e=i[o]||[0,0,0])[0],e[1],e[2])};var i={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}}(jQuery),function(J){var K=window.Flot.Canvas;function $(t){var e,n=[],o=J.plot.saturated.saturate(J.plot.saturated.floorInBase(t.min,t.tickSize)),i=0,a=Number.NaN;for(o===-Number.MAX_VALUE&&(n.push(o),o=J.plot.saturated.floorInBase(t.min+t.tickSize,t.tickSize));e=a,a=J.plot.saturated.multiplyAdd(t.tickSize,i,o),n.push(a),++i,a<t.max&&a!==e;);return n}function tt(t,e,n){var o=e.tickDecimals;if(-1!==(""+t).indexOf("e"))return l(t,e,n);0<n&&(e.tickDecimals=n);var i=e.tickDecimals?parseFloat("1e"+e.tickDecimals):1,a=""+Math.round(t*i)/i;if(null!=e.tickDecimals){var r=a.indexOf("."),s=-1===r?0:a.length-r-1;if(s<e.tickDecimals)a=(s?a:a+".")+(""+i).substr(1,e.tickDecimals-s)}return e.tickDecimals=o,a}function l(t,e,n){var o=(""+t).indexOf("e"),i=parseInt((""+t).substr(o+1)),a=-1!==o?i:0<t?Math.floor(Math.log(t)/Math.LN10):0,r=parseFloat("1e"+a),s=t/r;if(n){var l=c(t,n);return(t/r).toFixed(l)+"e"+a}return 0<e.tickDecimals?s.toFixed(c(t,e.tickDecimals))+"e"+a:s.toFixed()+"e"+a}function c(t,e){var n=Math.log(Math.abs(t))*Math.LOG10E,o=Math.abs(n+e);return o<=20?Math.floor(o):20}function o(l,t,e,o){var y=[],f={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],xaxis:{show:null,position:"bottom",mode:null,font:null,color:null,tickColor:null,transform:null,inverseTransform:null,min:null,max:null,autoScaleMargin:null,autoScale:"exact",windowSize:null,growOnly:null,ticks:null,tickFormatter:null,showTickLabels:"major",labelWidth:null,labelHeight:null,reserveSpace:null,tickLength:null,showMinorTicks:null,showTicks:null,gridLines:null,alignTicksWithAxis:null,tickDecimals:null,tickSize:null,minTickSize:null,offset:{below:0,above:0},boxPosition:{centerX:0,centerY:0}},yaxis:{autoScaleMargin:.02,autoScale:"loose",growOnly:null,position:"left",showTickLabels:"major",offset:{below:0,above:0},boxPosition:{centerX:0,centerY:0}},xaxes:[],yaxes:[],series:{points:{show:!1,radius:3,lineWidth:2,fill:!0,fillColor:"#ffffff",symbol:"circle"},lines:{lineWidth:1,fill:!1,fillColor:null,steps:!1},bars:{show:!1,lineWidth:2,horizontal:!1,barWidth:.8,fill:!0,fillColor:null,align:"left",zero:!0},shadowSize:3,highlightColor:null},grid:{show:!0,aboveData:!1,color:"#545454",backgroundColor:null,borderColor:null,tickColor:null,margin:0,labelMargin:5,axisMargin:8,borderWidth:1,minBorderMargin:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:!1,hoverable:!1,autoHighlight:!0,mouseActiveRadius:15},interaction:{redrawOverlayInterval:1e3/60},hooks:{}},x=null,n=null,i=null,g=null,a=null,m=[],v=[],b={left:0,right:0,top:0,bottom:0},w=0,T=0,k={processOptions:[],processRawData:[],processDatapoints:[],processOffset:[],setupGrid:[],adjustSeriesDataRange:[],setRange:[],drawBackground:[],drawSeries:[],drawAxis:[],draw:[],axisReserveSpace:[],bindEvents:[],drawOverlay:[],resize:[],shutdown:[]},M=this,r={},s=null;M.setData=c,M.setupGrid=z,M.draw=W,M.getPlaceholder=function(){return l},M.getCanvas=function(){return x.element},M.getSurface=function(){return x},M.getEventHolder=function(){return i[0]},M.getPlotOffset=function(){return b},M.width=function(){return w},M.height=function(){return T},M.offset=function(){var t=i.offset();return t.left+=b.left,t.top+=b.top,t},M.getData=function(){return y},M.getAxes=function(){var n={};return J.each(m.concat(v),function(t,e){e&&(n[e.direction+(1!==e.n?e.n:"")+"axis"]=e)}),n},M.getXAxes=function(){return m},M.getYAxes=function(){return v},M.c2p=function(t){var e,n,o={};for(e=0;e<m.length;++e)(n=m[e])&&n.used&&(o["x"+n.n]=n.c2p(t.left));for(e=0;e<v.length;++e)(n=v[e])&&n.used&&(o["y"+n.n]=n.c2p(t.top));void 0!==o.x1&&(o.x=o.x1);void 0!==o.y1&&(o.y=o.y1);return o},M.p2c=function(t){var e,n,o,i={};for(e=0;e<m.length;++e)if((n=m[e])&&n.used&&(o="x"+n.n,null==t[o]&&1===n.n&&(o="x"),null!=t[o])){i.left=n.p2c(t[o]);break}for(e=0;e<v.length;++e)if((n=v[e])&&n.used&&(o="y"+n.n,null==t[o]&&1===n.n&&(o="y"),null!=t[o])){i.top=n.p2c(t[o]);break}return i},M.getOptions=function(){return f},M.triggerRedrawOverlay=U,M.pointOffset=function(t){return{left:parseInt(m[N(t,"x")-1].p2c(+t.x)+b.left,10),top:parseInt(v[N(t,"y")-1].p2c(+t.y)+b.top,10)}},M.shutdown=u,M.destroy=function(){u(),l.removeData("plot").empty(),y=[],m=[],v=[],M=k=a=g=i=n=x=f=null},M.resize=function(){var t=l.width(),e=l.height();x.resize(t,e),n.resize(t,e),P(k.resize,[t,e])},M.clearTextCache=function(){x.clearCache(),n.clearCache()},M.autoScaleAxis=E,M.computeRangeForDataSeries=function(t,e,n){for(var o=t.datapoints.points,i=t.datapoints.pointsize,a=t.datapoints.format,r=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY,l={xmin:r,ymin:r,xmax:s,ymax:s},c=0;c<o.length;c+=i)if(null!==o[c]&&("function"!=typeof n||n(o[c])))for(var u=0;u<i;++u){var p=o[c+u],h=a[u];null!=h&&(("function"!=typeof n||n(p))&&(e||h.computeRange)&&p!==1/0&&p!==-1/0&&(!0===h.x&&(p<l.xmin&&(l.xmin=p),p>l.xmax&&(l.xmax=p)),!0===h.y&&(p<l.ymin&&(l.ymin=p),p>l.ymax&&(l.ymax=p))))}return l},M.adjustSeriesDataRange=function(t,e){if(t.bars.show){var n,o=t.bars.barWidth[1];t.datapoints&&t.datapoints.points&&!o&&function(t){var e=[],n=t.datapoints.pointsize,o=Number.MAX_VALUE;t.datapoints.points.length<=n&&(o=1);for(var i=t.bars.horizontal?1:0;i<t.datapoints.points.length;i+=n)isFinite(t.datapoints.points[i])&&null!==t.datapoints.points[i]&&e.push(t.datapoints.points[i]);(e=e.filter(function(t,e,n){return n.indexOf(t)===e})).sort(function(t,e){return t-e});for(var i=1;i<e.length;i++){var a=Math.abs(e[i]-e[i-1]);a<o&&isFinite(a)&&(o=a)}"number"==typeof t.bars.barWidth?t.bars.barWidth=t.bars.barWidth*o:t.bars.barWidth[0]=t.bars.barWidth[0]*o}(t);var i=t.bars.barWidth[0]||t.bars.barWidth;switch(t.bars.align){case"left":n=0;break;case"right":n=-i;break;default:n=-i/2}t.bars.horizontal?(e.ymin+=n,e.ymax+=n+i):(e.xmin+=n,e.xmax+=n+i)}if(t.bars.show&&t.bars.zero||t.lines.show&&t.lines.zero){var a=t.datapoints.pointsize;a<=2&&(e.ymin=Math.min(0,e.ymin),e.ymax=Math.max(0,e.ymax))}return e},M.findNearbyItem=function(t,e,n,o,i){for(var a,r=null,s=o*o+1,l=y.length-1;0<=l;--l)if(n(l)){var c=y[l];if(!c.datapoints)return;if(c.lines.show||c.points.show){var u=_(c,t,e,o,s,i);u&&(s=u.distance,r=[l,u.dataIndex])}if(c.bars.show&&!r){var p=q(c,t,e);0<=p&&(r=[l,p])}}if(r){l=r[0],a=r[1];var h=y[l].datapoints.pointsize;return{datapoint:y[l].datapoints.points.slice(a*h,(a+1)*h),dataIndex:a,series:y[l],seriesIndex:l}}return null},M.findNearbyInterpolationPoint=function(t,e,n){var o,i,a,r,s,l,c,u=Number.MAX_VALUE;for(o=0;o<y.length;++o)if(n(o)){var p=y[o].datapoints.points;l=y[o].datapoints.pointsize;var h=p[p.length-l]<p[0]?function(t,e){return e<t}:function(t,e){return t<e};if(!h(t,p[0])){for(i=l;i<p.length&&!h(t,p[i]);i+=l);var d=p[i-l],f=p[i-l+1],m=p[i],g=p[i+1];void 0!==d&&void 0!==m&&void 0!==f&&void 0!==g&&(e=d===m?g:f+(g-f)*(t-d)/(m-d),r=Math.abs(y[o].xaxis.p2c(m)-t),s=Math.abs(y[o].yaxis.p2c(g)-e),(a=r*r+s*s)<u&&(u=a,c=[t,e,o,i]))}}if(c)return o=c[2],i=c[3],l=y[o].datapoints.pointsize,p=y[o].datapoints.points,d=p[i-l],f=p[i-l+1],m=p[i],g=p[i+1],{datapoint:[c[0],c[1]],leftPoint:[d,f],rightPoint:[m,g],seriesIndex:o};return null},M.computeValuePrecision=O,M.computeTickSize=I,M.addEventHandler=function(t,e,n,o){var i=n+t,a=r[i]||[];a.push({event:t,handler:e,eventHolder:n,priority:o}),a.sort(function(t,e){return e.priority-t.priority}),a.forEach(function(t){t.eventHolder.unbind(t.event,t.handler),t.eventHolder.bind(t.event,t.handler)}),r[i]=a},M.hooks=k;var S=J.plot.uiConstants.MINOR_TICKS_COUNT_CONSTANT,C=J.plot.uiConstants.TICK_LENGTH_CONSTANT;function P(t,e){e=[M].concat(e);for(var n=0;n<t.length;++n)t[n].apply(this,e)}function c(t){var e=y;y=function(t){for(var e=[],n=0;n<t.length;++n){var o=J.extend(!0,{},f.series);null!=t[n].data?(o.data=t[n].data,delete t[n].data,J.extend(!0,o,t[n]),t[n].data=o.data):o.data=t[n],e.push(o)}return e}(t),function(){var t,e=y.length,n=-1;for(t=0;t<y.length;++t){var o=y[t].color;null!=o&&(e--,"number"==typeof o&&n<o&&(n=o))}e<=n&&(e=n+1);var i,a=[],r=f.colors,s=r.length,l=0,c=Math.max(0,y.length-e);for(t=0;t<e;t++)i=J.color.parse(r[(c+t)%s]||"#666"),t%s==0&&t&&(l=0<=l?l<.5?-l-.2:0:-l),a[t]=i.scale("rgb",1+l);var u,p=0;for(t=0;t<y.length;++t){if(null==(u=y[t]).color?(u.color=a[p].toString(),++p):"number"==typeof u.color&&(u.color=a[u.color].toString()),null==u.lines.show){var h,d=!0;for(h in u)if(u[h]&&u[h].show){d=!1;break}d&&(u.lines.show=!0)}null==u.lines.zero&&(u.lines.zero=!!u.lines.fill),u.xaxis=A(m,N(u,"x")),u.yaxis=A(v,N(u,"y"))}}(),function(t){var e,n,o,i,a,r,s,l,c,u,p,h,d=Number.POSITIVE_INFINITY,f=Number.NEGATIVE_INFINITY;function m(t,e,n){e<t.datamin&&e!==-1/0&&(t.datamin=e),n>t.datamax&&n!==1/0&&(t.datamax=n)}function g(t,e){return t&&t[e]&&t[e].datapoints&&t[e].datapoints.points?t[e].datapoints.points:[]}for(J.each(L(),function(t,e){!0!==e.options.growOnly?(e.datamin=d,e.datamax=f):(void 0===e.datamin&&(e.datamin=d),void 0===e.datamax&&(e.datamax=f)),e.used=!1}),e=0;e<y.length;++e)(a=y[e]).datapoints={points:[]},0===a.datapoints.points.length&&(a.datapoints.points=g(t,e)),P(k.processRawData,[a,a.data,a.datapoints]);for(e=0;e<y.length;++e){if(a=y[e],p=a.data,!(h=a.datapoints.format)){if((h=[]).push({x:!0,y:!1,number:!0,required:!0,computeRange:"none"!==a.xaxis.options.autoScale,defaultValue:null}),h.push({x:!1,y:!0,number:!0,required:!0,computeRange:"none"!==a.yaxis.options.autoScale,defaultValue:null}),a.stack||a.bars.show||a.lines.show&&a.lines.fill){var x=null!=a.datapoints.pointsize?a.datapoints.pointsize:a.data&&a.data[0]&&a.data[0].length?a.data[0].length:3;2<x&&h.push({x:!1,y:!0,number:!0,required:!1,computeRange:"none"!==a.yaxis.options.autoScale,defaultValue:0})}a.datapoints.format=h}if(a.xaxis.used=a.yaxis.used=!0,null==a.datapoints.pointsize){a.datapoints.pointsize=h.length,s=a.datapoints.pointsize,r=a.datapoints.points;a.lines.show&&a.lines.steps;for(n=o=0;n<p.length;++n,o+=s){var v=null==(u=p[n]);if(!v)for(i=0;i<s;++i)l=u[i],(c=h[i])&&(c.number&&null!=l&&(l=+l,isNaN(l)&&(l=null)),null==l&&(c.required&&(v=!0),null!=c.defaultValue&&(l=c.defaultValue))),r[o+i]=l;if(v)for(i=0;i<s;++i)null!=(l=r[o+i])&&(c=h[i]).computeRange&&(c.x&&m(a.xaxis,l,l),c.y&&m(a.yaxis,l,l)),r[o+i]=null}r.length=o}}for(e=0;e<y.length;++e)a=y[e],P(k.processDatapoints,[a,a.datapoints]);for(e=0;e<y.length;++e)if(a=y[e],!(h=a.datapoints.format).every(function(t){return!t.computeRange})){var b=M.adjustSeriesDataRange(a,M.computeRangeForDataSeries(a));P(k.adjustSeriesDataRange,[a,b]),m(a.xaxis,b.xmin,b.xmax),m(a.yaxis,b.ymin,b.ymax)}J.each(L(),function(t,e){e.datamin===d&&(e.datamin=null),e.datamax===f&&(e.datamax=null)})}(e)}function N(t,e){var n=t[e+"axis"];return"object"===_typeof(n)&&(n=n.n),"number"!=typeof n&&(n=1),n}function L(){return m.concat(v).filter(function(t){return t})}function A(t,e){return t[e-1]||(t[e-1]={n:e,direction:t===m?"x":"y",options:J.extend(!0,{},t===m?f.xaxis:f.yaxis)}),t[e-1]}function u(){s&&clearTimeout(s),P(k.shutdown,[i])}function p(t){function e(t){return t}var n,o,i=t.options.transform||e,a=t.options.inverseTransform;o="x"===t.direction?(n=isFinite(i(t.max)-i(t.min))?t.scale=w/Math.abs(i(t.max)-i(t.min)):t.scale=1/Math.abs(J.plot.saturated.delta(i(t.min),i(t.max),w)),Math.min(i(t.max),i(t.min))):(n=-(n=isFinite(i(t.max)-i(t.min))?t.scale=T/Math.abs(i(t.max)-i(t.min)):t.scale=1/Math.abs(J.plot.saturated.delta(i(t.min),i(t.max),T))),Math.max(i(t.max),i(t.min))),t.p2c=i===e?function(t){return isFinite(t-o)?(t-o)*n:(t/4-o/4)*n*4}:function(t){var e=i(t);return isFinite(e-o)?(e-o)*n:(e/4-o/4)*n*4},t.c2p=a?function(t){return a(o+t/n)}:function(t){return o+t/n}}function h(n){P(k.axisReserveSpace,[n]);var t=n.labelWidth,e=n.labelHeight,o=n.options.position,i="x"===n.direction,a=n.options.tickLength,r=n.options.showTicks,s=n.options.showMinorTicks,l=n.options.gridLines,c=f.grid.axisMargin,u=f.grid.labelMargin,p=!0,h=!0,d=!1;J.each(i?m:v,function(t,e){e&&(e.show||e.reserveSpace)&&(e===n?d=!0:e.options.position===o&&(d?h=!1:p=!1))}),h&&(c=0),null==a&&(a=C),null==r&&(r=!0),null==s&&(s=!0),null==l&&(l=!!p),isNaN(+a)||(u+=r?+a:0),i?(e+=u,"bottom"===o?(b.bottom+=e+c,n.box={top:x.height-b.bottom,height:e}):(n.box={top:b.top+c,height:e},b.top+=e+c)):(t+=u,"left"===o?(n.box={left:b.left+c,width:t},b.left+=t+c):(b.right+=t+c,n.box={left:x.width-b.right,width:t})),n.position=o,n.tickLength=a,n.showMinorTicks=s,n.showTicks=r,n.gridLines=l,n.box.padding=u,n.innermost=p}function d(t,e,n){"x"===t.direction?("bottom"===t.position&&n(e.bottom)&&(t.box.top-=Math.ceil(e.bottom)),"top"===t.position&&n(e.top)&&(t.box.top+=Math.ceil(e.top))):("left"===t.position&&n(e.left)&&(t.box.left+=Math.ceil(e.left)),"right"===t.position&&n(e.right)&&(t.box.left-=Math.ceil(e.right)))}function z(a){var t,e,n=L(),o=f.grid.show;for(e in b)b[e]=0;for(e in P(k.processOffset,[b]),b)"object"===_typeof(f.grid.borderWidth)?b[e]+=o?f.grid.borderWidth[e]:0:b[e]+=o?f.grid.borderWidth:0;if(J.each(n,function(t,e){var n,o,i=e.options;e.show=null==i.show?e.used:i.show,e.reserveSpace=null==i.reserveSpace?e.show:i.reserveSpace,o=(n=e).options,n.tickFormatter||("function"==typeof o.tickFormatter?n.tickFormatter=function(){var t=Array.prototype.slice.call(arguments);return""+o.tickFormatter.apply(null,t)}:n.tickFormatter=tt),P(k.setRange,[e,a]),function(t,e){var n="number"==typeof t.options.min?t.options.min:t.min,o="number"==typeof t.options.max?t.options.max:t.max,i=t.options.offset;e&&(E(t),n=t.autoScaledMin,o=t.autoScaledMax);if(n=(null!=n?n:-1)+(i.below||0),(o=(null!=o?o:1)+(i.above||0))<n){var a=n;n=o,o=a,t.options.offset={above:0,below:0}}t.min=J.plot.saturated.saturate(n),t.max=J.plot.saturated.saturate(o)}(e,a)}),o){w=x.width-b.left-b.right,T=x.height-b.bottom-b.top;var i=J.grep(n,function(t){return t.show||t.reserveSpace});for(J.each(i,function(t,e){var n,o,i,a;!function(t){var e,n=t.options;e=D(t.direction,x,n.ticks),t.delta=J.plot.saturated.delta(t.min,t.max,e);var o=M.computeValuePrecision(t.min,t.max,t.direction,e,n.tickDecimals);t.tickDecimals=Math.max(0,null!=n.tickDecimals?n.tickDecimals:o),t.tickSize=function(t,e,n,o,i){var a;a="number"==typeof o.ticks&&0<o.ticks?o.ticks:.3*Math.sqrt("x"===n?x.width:x.height);var r=I(t,e,a,i);return null!=o.minTickSize&&r<o.minTickSize&&(r=o.minTickSize),o.tickSize||r}(t.min,t.max,t.direction,n,n.tickDecimals),t.tickGenerator||("function"==typeof n.tickGenerator?t.tickGenerator=n.tickGenerator:t.tickGenerator=$);if(null!=n.alignTicksWithAxis){var i=("x"===t.direction?m:v)[n.alignTicksWithAxis-1];if(i&&i.used&&i!==t){var a=t.tickGenerator(t,M);if(0<a.length&&(null==n.min&&(t.min=Math.min(t.min,a[0])),null==n.max&&1<a.length&&(t.max=Math.max(t.max,a[a.length-1]))),t.tickGenerator=function(t){var e,n,o=[];for(n=0;n<i.ticks.length;++n)e=(i.ticks[n].v-i.min)/(i.max-i.min),e=t.min+e*(t.max-t.min),o.push(e);return o},!t.mode&&null==n.tickDecimals){var r=Math.max(0,1-Math.floor(Math.log(t.delta)/Math.LN10)),s=t.tickGenerator(t,M);1<s.length&&/\..*0$/.test((s[1]-s[0]).toFixed(r))||(t.tickDecimals=r)}}}}(e),function(t){var e,n,o=t.options.ticks,i=[];null==o||"number"==typeof o&&0<o?i=t.tickGenerator(t,M):o&&(i=J.isFunction(o)?o(t):o);for(t.ticks=[],e=0;e<i.length;++e){var a=null,r=i[e];"object"===_typeof(r)?(n=+r[0],1<r.length&&(a=r[1])):n=+r,isNaN(n)||t.ticks.push(R(n,a,t,"major"))}}(e),o=(n=e).ticks,i=y,"loose"===n.options.autoScale&&0<o.length&&i.some(function(t){return 0<t.datapoints.points.length})&&(n.min=Math.min(n.min,o[0].v),n.max=Math.max(n.max,o[o.length-1].v)),p(e),function(e,t){if("endpoints"===e.options.showTickLabels)return!0;if("all"!==e.options.showTickLabels)return"major"!==e.options.showTickLabels&&"none"!==e.options.showTickLabels&&void 0;var n=t.filter(function(t){return t.xaxis===e}),o=n.some(function(t){return!t.bars.show});return 0===n.length||o}(a=e,y)&&(a.ticks.unshift(R(a.min,null,a,"min")),a.ticks.push(R(a.max,null,a,"max"))),function(t){for(var e=t.options,n="none"!==e.showTickLabels&&t.ticks?t.ticks:[],o="major"===e.showTickLabels||"all"===e.showTickLabels,i="endpoints"===e.showTickLabels||"all"===e.showTickLabels,a=e.labelWidth||0,r=e.labelHeight||0,s=t.direction+"Axis "+t.direction+t.n+"Axis",l="flot-"+t.direction+"-axis flot-"+t.direction+t.n+"-axis "+s,c=e.font||"flot-tick-label tickLabel",u=0;u<n.length;++u){var p=n[u],h=p.label;if(p.label&&!(!1===o&&0<u&&u<n.length-1)&&(!1!==i||0!==u&&u!==n.length-1)){"object"===_typeof(p.label)&&(h=p.label.name);var d=x.getTextInfo(l,h,c);a=Math.max(a,d.width),r=Math.max(r,d.height)}}t.labelWidth=e.labelWidth||a,t.labelHeight=e.labelHeight||r}(e)}),t=i.length-1;0<=t;--t)h(i[t]);!function(){var t,e=f.grid.minBorderMargin;if(null==e)for(t=e=0;t<y.length;++t)e=Math.max(e,2*(y[t].points.radius+y[t].points.lineWidth/2));var n,o={},i={left:e,right:e,top:e,bottom:e};for(n in J.each(L(),function(t,e){e.reserveSpace&&e.ticks&&e.ticks.length&&("x"===e.direction?(i.left=Math.max(i.left,e.labelWidth/2),i.right=Math.max(i.right,e.labelWidth/2)):(i.bottom=Math.max(i.bottom,e.labelHeight/2),i.top=Math.max(i.top,e.labelHeight/2)))}),i)o[n]=i[n]-b[n];J.each(m.concat(v),function(t,e){d(e,o,function(t){return 0<t})}),b.left=Math.ceil(Math.max(i.left,b.left)),b.right=Math.ceil(Math.max(i.right,b.right)),b.top=Math.ceil(Math.max(i.top,b.top)),b.bottom=Math.ceil(Math.max(i.bottom,b.bottom))}(),J.each(i,function(t,e){var n;"x"===(n=e).direction?(n.box.left=b.left-n.labelWidth/2,n.box.width=x.width-b.left-b.right+n.labelWidth):(n.box.top=b.top-n.labelHeight/2,n.box.height=x.height-b.bottom-b.top+n.labelHeight)})}if(f.grid.margin){for(e in b){var r=f.grid.margin||0;b[e]+="number"==typeof r?r:r[e]||0}J.each(m.concat(v),function(t,e){d(e,f.grid.margin,function(t){return null!=t})})}w=x.width-b.left-b.right,T=x.height-b.bottom-b.top,J.each(n,function(t,e){p(e)}),o&&J.each(L(),function(t,o){var e,i,a,r,s,l,c,u=o.box,n=o.direction+"Axis "+o.direction+o.n+"Axis",p="flot-"+o.direction+"-axis flot-"+o.direction+o.n+"-axis "+n,h=o.options.font||"flot-tick-label tickLabel",d={x:NaN,y:NaN,width:NaN,height:NaN},f=[],m=function(t,e,n,o,i,a,r,s){return(t<=i&&i<=n||i<=t&&t<=r)&&(e<=a&&a<=o||a<=e&&e<=s)},g=function(t,e){return!t||!t.label||t.v<o.min||t.v>o.max?d:(l=x.getTextInfo(p,t.label,h),"x"===o.direction?(r="center",i=b.left+o.p2c(t.v),"bottom"===o.position?a=u.top+u.padding-o.boxPosition.centerY:(a=u.top+u.height-u.padding+o.boxPosition.centerY,s="bottom")):(s="middle",a=b.top+o.p2c(t.v),"left"===o.position?(i=u.left+u.width-u.padding-o.boxPosition.centerX,r="right"):i=u.left+u.padding+o.boxPosition.centerX),c={x:i-l.width/2-3,y:a-3,width:l.width+6,height:l.height+6},n=c,e.some(function(t){return m(n.x,n.y,n.x+n.width,n.y+n.height,t.x,t.y,t.x+t.width,t.y+t.height)})?d:(x.addText(p,i,a,t.label,h,null,null,r,s),c));var n};if(x.removeText(p),P(k.drawAxis,[o,x]),o.show)switch(o.options.showTickLabels){case"none":break;case"endpoints":f.push(g(o.ticks[0],f)),f.push(g(o.ticks[o.ticks.length-1],f));break;case"major":for(f.push(g(o.ticks[0],f)),f.push(g(o.ticks[o.ticks.length-1],f)),e=1;e<o.ticks.length-1;++e)f.push(g(o.ticks[e],f));break;case"all":for(f.push(g(o.ticks[0],[])),f.push(g(o.ticks[o.ticks.length-1],f)),e=1;e<o.ticks.length-1;++e)f.push(g(o.ticks[e],f))}}),P(k.setupGrid,[])}function E(t){var e,n=t.options,o=n.min,i=n.max,a=t.datamin,r=t.datamax;switch(n.autoScale){case"none":o=+(null!=n.min?n.min:a),i=+(null!=n.max?n.max:r);break;case"loose":if(null!=a&&null!=r){o=a,i=r,e=J.plot.saturated.saturate(i-o);var s="number"==typeof n.autoScaleMargin?n.autoScaleMargin:.02;o=J.plot.saturated.saturate(o-e*s),i=J.plot.saturated.saturate(i+e*s),o<0&&0<=a&&(o=0)}else o=n.min,i=n.max;break;case"exact":o=null!=a?a:n.min,i=null!=r?r:n.max;break;case"sliding-window":i<r&&(i=r,o=Math.max(r-(n.windowSize||100),o))}var l=function(t,e){var n=void 0===t?null:t,o=void 0===e?null:e;if(0==o-n){var i=0===o?1:.01,a=null;null==n&&(a-=i),null!=o&&null==n||(o+=i),null!=a&&(n=a)}return{min:n,max:o}}(o,i);o=l.min,i=l.max,!0===n.growOnly&&"none"!==n.autoScale&&"sliding-window"!==n.autoScale&&(o=o<a?o:null!==a?a:o,i=r<i?i:null!==r?r:i),t.autoScaledMin=o,t.autoScaledMax=i}function O(t,e,n,o,i){var a=D(n,x,o),r=J.plot.saturated.delta(t,e,a),s=-Math.floor(Math.log(r)/Math.LN10);i&&i<s&&(s=i);var l=r/parseFloat("1e"+-s);return 2.25<l&&l<3&&s+1<=i&&++s,isFinite(s)?s:0}function I(t,e,n,o){var i=J.plot.saturated.delta(t,e,n),a=-Math.floor(Math.log(i)/Math.LN10);o&&o<a&&(a=o);var r,s=parseFloat("1e"+-a),l=i/s;return l<1.5?r=1:l<3?(r=2,2.25<l&&(null==o||a+1<=o)&&(r=2.5)):r=l<7.5?5:10,r*=s}function D(t,e,n){return"number"==typeof n&&0<n?n:.3*Math.sqrt("x"===t?e.width:e.height)}function R(t,e,n,o){if(null===e)switch(o){case"min":case"max":var i=(a=t,r=n,s=Math.floor(r.p2c(a)),l="x"===r.direction?s+1:s-1,c=r.c2p(s),u=r.c2p(l),O(c,u,r.direction,1));isFinite(i),e=n.tickFormatter(t,n,i,M);break;case"major":e=n.tickFormatter(t,n,void 0,M)}var a,r,s,l,c,u;return{v:t,label:e}}function W(){x.clear(),P(k.drawBackground,[g]);var t=f.grid;t.show&&t.backgroundColor&&(g.save(),g.translate(b.left,b.top),g.fillStyle=Z(f.grid.backgroundColor,T,0,"rgba(255, 255, 255, 0)"),g.fillRect(0,0,w,T),g.restore()),t.show&&!t.aboveData&&H();for(var e=0;e<y.length;++e)P(k.drawSeries,[g,y[e],e,Z]),V(y[e]);P(k.draw,[g]),t.show&&t.aboveData&&H(),x.render(),U()}function F(t,e){for(var n,o,i,a,r=L(),s=0;s<r.length;++s)if((n=r[s]).direction===e&&(t[a=e+n.n+"axis"]||1!==n.n||(a=e+"axis"),t[a])){o=t[a].from,i=t[a].to;break}if(t[a]||(n="x"===e?m[0]:v[0],o=t[e+"1"],i=t[e+"2"]),null!=o&&null!=i&&i<o){var l=o;o=i,i=l}return{from:o,to:i,axis:n}}function Y(t){var e=t.box,n=0,o=0;return"x"===t.direction?(n=0,o=e.top-b.top+("top"===t.position?e.height:0)):(o=0,n=e.left-b.left+("left"===t.position?e.width:0)+t.boxPosition.centerX),{x:n,y:o}}function X(t,e){return t%2!=0?Math.floor(e)+.5:e}function G(t){g.lineWidth=1;var e=Y(t),n=e.x,o=e.y;if(t.show){var i=0,a=0;g.strokeStyle=t.options.color,g.beginPath(),"x"===t.direction?i=w+1:a=T+1,"x"===t.direction?o=X(g.lineWidth,o):n=X(g.lineWidth,n),g.moveTo(n,o),g.lineTo(n+i,o+a),g.stroke()}}function B(t){var e=t.tickLength,n=t.showMinorTicks,o=S,i=Y(t),a=i.x,r=i.y,s=0;for(g.strokeStyle=t.options.color,g.beginPath(),s=0;s<t.ticks.length;++s){var l,c=t.ticks[s].v,u=0,p=0,h=0,d=0;if(!isNaN(c)&&c>=t.min&&c<=t.max&&("x"===t.direction?(a=t.p2c(c),p=e,"top"===t.position&&(p=-p)):(r=t.p2c(c),u=e,"left"===t.position&&(u=-u)),"x"===t.direction?a=X(g.lineWidth,a):r=X(g.lineWidth,r),g.moveTo(a,r),g.lineTo(a+u,r+p)),!0===n&&s<t.ticks.length-1){var f=t.ticks[s].v,m=(t.ticks[s+1].v-f)/(o+1);for(l=1;l<=o;l++){if("x"===t.direction){if(d=e/2,a=X(g.lineWidth,t.p2c(f+l*m)),"top"===t.position&&(d=-d),a<0||w<a)continue}else if(h=e/2,r=X(g.lineWidth,t.p2c(f+l*m)),"left"===t.position&&(h=-h),r<0||T<r)continue;g.moveTo(a,r),g.lineTo(a+h,r+d)}}}g.stroke()}function j(t){var e,n,o;for(g.strokeStyle=f.grid.tickColor,g.beginPath(),e=0;e<t.ticks.length;++e){var i=t.ticks[e].v,a=0,r=0,s=0,l=0;isNaN(i)||i<t.min||i>t.max||(n=i,void 0,o=f.grid.borderWidth,(!("object"===_typeof(o)&&0<o[t.position]||0<o)||n!==t.min&&n!==t.max)&&("x"===t.direction?(s=t.p2c(i),r=-(l=T)):(s=0,l=t.p2c(i),a=w),"x"===t.direction?s=X(g.lineWidth,s):l=X(g.lineWidth,l),g.moveTo(s,l),g.lineTo(s+a,l+r)))}g.stroke()}function H(){var t,e,n,o;g.save(),g.translate(b.left,b.top),function(){var t,e,n=f.grid.markings;if(n)for(J.isFunction(n)&&((t=M.getAxes()).xmin=t.xaxis.min,t.xmax=t.xaxis.max,t.ymin=t.yaxis.min,t.ymax=t.yaxis.max,n=n(t)),e=0;e<n.length;++e){var o=n[e],i=F(o,"x"),a=F(o,"y");if(null==i.from&&(i.from=i.axis.min),null==i.to&&(i.to=i.axis.max),null==a.from&&(a.from=a.axis.min),null==a.to&&(a.to=a.axis.max),!(i.to<i.axis.min||i.from>i.axis.max||a.to<a.axis.min||a.from>a.axis.max)){i.from=Math.max(i.from,i.axis.min),i.to=Math.min(i.to,i.axis.max),a.from=Math.max(a.from,a.axis.min),a.to=Math.min(a.to,a.axis.max);var r=i.from===i.to,s=a.from===a.to;if(!r||!s)if(i.from=Math.floor(i.axis.p2c(i.from)),i.to=Math.floor(i.axis.p2c(i.to)),a.from=Math.floor(a.axis.p2c(a.from)),a.to=Math.floor(a.axis.p2c(a.to)),r||s){var l=o.lineWidth||f.grid.markingsLineWidth,c=l%2?.5:0;g.beginPath(),g.strokeStyle=o.color||f.grid.markingsColor,g.lineWidth=l,r?(g.moveTo(i.to+c,a.from),g.lineTo(i.to+c,a.to)):(g.moveTo(i.from,a.to+c),g.lineTo(i.to,a.to+c)),g.stroke()}else g.fillStyle=o.color||f.grid.markingsColor,g.fillRect(i.from,a.to,i.to-i.from,a.from-a.to)}}}(),t=L(),e=f.grid.borderWidth;for(var i=0;i<t.length;++i){var a=t[i];a.show&&(G(a),!0===a.showTicks&&B(a),!0===a.gridLines&&j(a))}e&&(n=f.grid.borderWidth,o=f.grid.borderColor,"object"===_typeof(n)||"object"===_typeof(o)?("object"!==_typeof(n)&&(n={top:n,right:n,bottom:n,left:n}),"object"!==_typeof(o)&&(o={top:o,right:o,bottom:o,left:o}),0<n.top&&(g.strokeStyle=o.top,g.lineWidth=n.top,g.beginPath(),g.moveTo(0-n.left,0-n.top/2),g.lineTo(w,0-n.top/2),g.stroke()),0<n.right&&(g.strokeStyle=o.right,g.lineWidth=n.right,g.beginPath(),g.moveTo(w+n.right/2,0-n.top),g.lineTo(w+n.right/2,T),g.stroke()),0<n.bottom&&(g.strokeStyle=o.bottom,g.lineWidth=n.bottom,g.beginPath(),g.moveTo(w+n.right,T+n.bottom/2),g.lineTo(0,T+n.bottom/2),g.stroke()),0<n.left&&(g.strokeStyle=o.left,g.lineWidth=n.left,g.beginPath(),g.moveTo(0-n.left/2,T+n.bottom),g.lineTo(0-n.left/2,0),g.stroke())):(g.lineWidth=n,g.strokeStyle=f.grid.borderColor,g.strokeRect(-n/2,-n/2,w+n,T+n))),g.restore()}function V(t){t.lines.show&&J.plot.drawSeries.drawSeriesLines(t,g,b,w,T,M.drawSymbol,Z),t.bars.show&&J.plot.drawSeries.drawSeriesBars(t,g,b,w,T,M.drawSymbol,Z),t.points.show&&J.plot.drawSeries.drawSeriesPoints(t,g,b,w,T,M.drawSymbol,Z)}function _(t,e,n,o,i,a){var r=t.xaxis.c2p(e),s=t.yaxis.c2p(n),l=o/t.xaxis.scale,c=o/t.yaxis.scale,u=t.datapoints.points,p=t.datapoints.pointsize;t.xaxis.options.inverseTransform&&(l=Number.MAX_VALUE),t.yaxis.options.inverseTransform&&(c=Number.MAX_VALUE);for(var h=null,d=0;d<u.length;d+=p){var f=u[d],m=u[d+1];if(null!=f&&!(l<f-r||f-r<-l||c<m-s||m-s<-c)){var g=Math.abs(t.xaxis.p2c(f)-e),x=Math.abs(t.yaxis.p2c(m)-n),v=a?a(g,x):g*g+x*x;v<i&&(h={dataIndex:d/p,distance:i=v})}}return h}function q(t,e,n){var o,i,a=t.bars.barWidth[0]||t.bars.barWidth,r=t.xaxis.c2p(e),s=t.yaxis.c2p(n),l=t.datapoints.points,c=t.datapoints.pointsize;switch(t.bars.align){case"left":o=0;break;case"right":o=-a;break;default:o=-a/2}i=o+a;for(var u=t.bars.fillTowards||0,p=u>t.yaxis.min?Math.min(t.yaxis.max,u):t.yaxis.min,h=-1,d=0;d<l.length;d+=c){var f=l[d],m=l[d+1];null!=f&&((t.bars.horizontal?r<=Math.max(p,f)&&r>=Math.min(p,f)&&m+o<=s&&s<=m+i:f+o<=r&&r<=f+i&&s>=Math.min(p,m)&&s<=Math.max(p,m))&&(h=d/c))}return h}function U(){var t=f.interaction.redrawOverlayInterval;-1!==t?s||(s=setTimeout(function(){Q(M)},t)):Q()}function Q(t){if(s=null,a){n.clear(),P(k.drawOverlay,[a,n]);var e=new CustomEvent("onDrawingDone");t.getEventHolder().dispatchEvent(e),t.getPlaceholder().trigger("drawingdone")}}function Z(t,e,n,o){if("string"==typeof t)return t;for(var i=g.createLinearGradient(0,n,0,e),a=0,r=t.colors.length;a<r;++a){var s=t.colors[a];if("string"!=typeof s){var l=J.color.parse(o);null!=s.brightness&&(l=l.scale("rgb",s.brightness)),null!=s.opacity&&(l.a*=s.opacity),s=l.toString()}i.addColorStop(a/(r-1),s)}return i}!function(){for(var t={Canvas:K},e=0;e<o.length;++e){var n=o[e];n.init(M,t),n.options&&J.extend(!0,f,n.options)}}(),function(){l.css("padding",0).children().filter(function(){return!J(this).hasClass("flot-overlay")&&!J(this).hasClass("flot-base")}).remove(),"static"===l.css("position")&&l.css("position","relative");x=new K("flot-base",l[0]),n=new K("flot-overlay",l[0]),g=x.context,a=n.context,i=J(n.element).unbind();var t=l.data("plot");t&&(t.shutdown(),n.clear());l.data("plot",M)}(),function(t){J.extend(!0,f,t),t&&t.colors&&(f.colors=t.colors);null==f.xaxis.color&&(f.xaxis.color=J.color.parse(f.grid.color).scale("a",.22).toString());null==f.yaxis.color&&(f.yaxis.color=J.color.parse(f.grid.color).scale("a",.22).toString());null==f.xaxis.tickColor&&(f.xaxis.tickColor=f.grid.tickColor||f.xaxis.color);null==f.yaxis.tickColor&&(f.yaxis.tickColor=f.grid.tickColor||f.yaxis.color);null==f.grid.borderColor&&(f.grid.borderColor=f.grid.color);null==f.grid.tickColor&&(f.grid.tickColor=J.color.parse(f.grid.color).scale("a",.22).toString());var e,n,o,i=l.css("font-size"),a=i?+i.replace("px",""):13,r={style:l.css("font-style"),size:Math.round(.8*a),variant:l.css("font-variant"),weight:l.css("font-weight"),family:l.css("font-family")};for(o=f.xaxes.length||1,e=0;e<o;++e)(n=f.xaxes[e])&&!n.tickColor&&(n.tickColor=n.color),n=J.extend(!0,{},f.xaxis,n),(f.xaxes[e]=n).font&&(n.font=J.extend({},r,n.font),n.font.color||(n.font.color=n.color),n.font.lineHeight||(n.font.lineHeight=Math.round(1.15*n.font.size)));for(o=f.yaxes.length||1,e=0;e<o;++e)(n=f.yaxes[e])&&!n.tickColor&&(n.tickColor=n.color),n=J.extend(!0,{},f.yaxis,n),(f.yaxes[e]=n).font&&(n.font=J.extend({},r,n.font),n.font.color||(n.font.color=n.color),n.font.lineHeight||(n.font.lineHeight=Math.round(1.15*n.font.size)));for(e=0;e<f.xaxes.length;++e)A(m,e+1).options=f.xaxes[e];for(e=0;e<f.yaxes.length;++e)A(v,e+1).options=f.yaxes[e];for(var s in J.each(L(),function(t,e){e.boxPosition=e.options.boxPosition||{centerX:0,centerY:0}}),k)f.hooks[s]&&f.hooks[s].length&&(k[s]=k[s].concat(f.hooks[s]));P(k.processOptions,[f])}(e),c(t),z(!0),W(),P(k.bindEvents,[i])}J.plot=function(t,e,n){return new o(J(t),e,n,J.plot.plugins)},J.plot.version="3.0.0",J.plot.plugins=[],J.fn.plot=function(t,e){return this.each(function(){J.plot(this,t,e)})},J.plot.linearTickGenerator=$,J.plot.defaultTickFormatter=tt,J.plot.expRepTickFormatter=l}(jQuery),function(t){var a={saturate:function(t){return t===1/0?Number.MAX_VALUE:t===-1/0?-Number.MAX_VALUE:t},delta:function(t,e,n){return(e-t)/n==1/0?e/n-t/n:(e-t)/n},multiply:function(t,e){return a.saturate(t*e)},multiplyAdd:function(t,e,n){if(isFinite(t*e))return a.saturate(t*e+n);for(var o=n,i=0;i<e;i++)o+=t;return a.saturate(o)},floorInBase:function(t,e){return e*Math.floor(t/e)}};t.plot.saturated=a}(jQuery),function(t){var e={getPageXY:function(t){var e=document.documentElement;return{X:t.clientX+(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0),Y:t.clientY+(window.pageYOffset||e.scrollTop)-(e.clientTop||0)}},getPixelRatio:function(t){return(window.devicePixelRatio||1)/(t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1)},isSafari:function(){return/constructor/i.test(window.top.HTMLElement)||"[object SafariRemoteNotification]"===(!window.top.safari||void 0!==window.top.safari&&window.top.safari.pushNotification).toString()},isMobileSafari:function(){return navigator.userAgent.match(/(iPod|iPhone|iPad)/)&&navigator.userAgent.match(/AppleWebKit/)},isOpera:function(){return!!window.opr&&!!opr.addons||!!window.opera||0<=navigator.userAgent.indexOf(" OPR/")},isFirefox:function(){return"undefined"!=typeof InstallTrigger},isIE:function(){return!!document.documentMode},isEdge:function(){return!e.isIE()&&!!window.StyleMedia},isChrome:function(){return!!window.chrome&&!!window.chrome.webstore},isBlink:function(){return(e.isChrome()||e.isOpera())&&!!window.CSS}};t.plot.browser=e}(jQuery),function(s){s.plot.drawSeries=new function(){function f(t,e,n,o,i,a,r,s,l,c,u){var p,h,d,f,m=t+o,g=t+i,x=n,v=e,b=!1;p=h=d=!0,c?(b=h=d=!0,p=!1,v=e+o,x=e+i,(g=t)<(m=n)&&(f=g,g=m,m=f,h=!(p=!0))):(p=h=d=!0,b=!1,m=t+o,g=t+i,(v=e)<(x=n)&&(f=v,v=x,x=f,d=!(b=!0))),g<r.min||m>r.max||v<s.min||x>s.max||(m<r.min&&(m=r.min,p=!1),g>r.max&&(g=r.max,h=!1),x<s.min&&(x=s.min,b=!1),v>s.max&&(v=s.max,d=!1),m=r.p2c(m),x=s.p2c(x),g=r.p2c(g),v=s.p2c(v),a&&(l.fillStyle=a(x,v),l.fillRect(m,v,g-m,x-v)),0<u&&(p||h||d||b)&&(l.beginPath(),l.moveTo(m,x),p?l.lineTo(m,v):l.moveTo(m,v),d?l.lineTo(g,v):l.moveTo(g,v),h?l.lineTo(g,x):l.moveTo(g,x),b?l.lineTo(m,x):l.moveTo(m,x),l.stroke()))}function m(t,e,n,o,i){var a=t.fill;if(!a)return null;if(t.fillColor)return i(t.fillColor,n,o,e);var r=s.color.parse(e);return r.a="number"==typeof a?a:.4,r.normalize(),r.toString()}this.drawSeriesLines=function(t,e,n,o,i,a,r){e.save(),e.translate(n.left,n.top),e.lineJoin="round",t.lines.dashes&&e.setLineDash&&e.setLineDash(t.lines.dashes);var s={format:t.datapoints.format,points:t.datapoints.points,pointsize:t.datapoints.pointsize};t.decimate&&(s.points=t.decimate(t,t.xaxis.min,t.xaxis.max,o,t.yaxis.min,t.yaxis.max,i));var l=t.lines.lineWidth;e.lineWidth=l,e.strokeStyle=t.color;var c=m(t.lines,t.color,0,i,r);c&&(e.fillStyle=c,function(t,e,n,o,i,a){for(var r=t.points,s=t.pointsize,l=o>n.min?Math.min(n.max,o):n.min,c=0,u=1,p=!1,h=0,d=0,f=null,m=null;!(0<s&&c>r.length+s);){var g=r[(c+=s)-s],x=r[c-s+u],v=r[c],b=r[c+u];if(-2===s&&(x=b=l),p){if(0<s&&null!=g&&null==v){d=c,s=-s,u=2;continue}if(s<0&&c===h+s){i.fill(),p=!1,u=1,c=h=d+(s=-s);continue}}if(null!=g&&null!=v){if(a&&(null!==f&&null!==m?(v=g,b=x,g=f,x=m,m=f=null,c-=s):x!==b&&g!==v&&(f=v,m=b=x)),g<=v&&g<e.min){if(v<e.min)continue;x=(e.min-g)/(v-g)*(b-x)+x,g=e.min}else if(v<=g&&v<e.min){if(g<e.min)continue;b=(e.min-g)/(v-g)*(b-x)+x,v=e.min}if(v<=g&&g>e.max){if(v>e.max)continue;x=(e.max-g)/(v-g)*(b-x)+x,g=e.max}else if(g<=v&&v>e.max){if(g>e.max)continue;b=(e.max-g)/(v-g)*(b-x)+x,v=e.max}if(p||(i.beginPath(),i.moveTo(e.p2c(g),n.p2c(l)),p=!0),x>=n.max&&b>=n.max)i.lineTo(e.p2c(g),n.p2c(n.max)),i.lineTo(e.p2c(v),n.p2c(n.max));else if(x<=n.min&&b<=n.min)i.lineTo(e.p2c(g),n.p2c(n.min)),i.lineTo(e.p2c(v),n.p2c(n.min));else{var y=g,w=v;x<=b&&x<n.min&&b>=n.min?(g=(n.min-x)/(b-x)*(v-g)+g,x=n.min):b<=x&&b<n.min&&x>=n.min&&(v=(n.min-x)/(b-x)*(v-g)+g,b=n.min),b<=x&&x>n.max&&b<=n.max?(g=(n.max-x)/(b-x)*(v-g)+g,x=n.max):x<=b&&b>n.max&&x<=n.max&&(v=(n.max-x)/(b-x)*(v-g)+g,b=n.max),g!==y&&i.lineTo(e.p2c(y),n.p2c(x)),i.lineTo(e.p2c(g),n.p2c(x)),i.lineTo(e.p2c(v),n.p2c(b)),v!==w&&(i.lineTo(e.p2c(v),n.p2c(b)),i.lineTo(e.p2c(w),n.p2c(b)))}}else m=f=null}}(s,t.xaxis,t.yaxis,t.lines.fillTowards||0,e,t.lines.steps)),0<l&&function(t,e,n,o,i,a,r){var s=t.points,l=t.pointsize,c=null,u=null,p=0,h=0,d=0,f=0,m=null,g=null,x=0;for(a.beginPath(),x=l;x<s.length;x+=l)if(p=s[x-l],h=s[x-l+1],d=s[x],f=s[x+1],null!==p&&null!==d)if(isNaN(p)||isNaN(d)||isNaN(h)||isNaN(f))u=c=null;else{if(r&&(null!==m&&null!==g?(d=p,f=h,p=m,h=g,g=m=null,x-=l):h!==f&&p!==d&&(m=d,g=f=h)),h<=f&&h<i.min){if(f<i.min)continue;p=(i.min-h)/(f-h)*(d-p)+p,h=i.min}else if(f<=h&&f<i.min){if(h<i.min)continue;d=(i.min-h)/(f-h)*(d-p)+p,f=i.min}if(f<=h&&h>i.max){if(f>i.max)continue;p=(i.max-h)/(f-h)*(d-p)+p,h=i.max}else if(h<=f&&f>i.max){if(h>i.max)continue;d=(i.max-h)/(f-h)*(d-p)+p,f=i.max}if(p<=d&&p<o.min){if(d<o.min)continue;h=(o.min-p)/(d-p)*(f-h)+h,p=o.min}else if(d<=p&&d<o.min){if(p<o.min)continue;f=(o.min-p)/(d-p)*(f-h)+h,d=o.min}if(d<=p&&p>o.max){if(d>o.max)continue;h=(o.max-p)/(d-p)*(f-h)+h,p=o.max}else if(p<=d&&d>o.max){if(p>o.max)continue;f=(o.max-p)/(d-p)*(f-h)+h,d=o.max}p===c&&h===u||a.moveTo(o.p2c(p)+e,i.p2c(h)+n),c=d,u=f,a.lineTo(o.p2c(d)+e,i.p2c(f)+n)}else g=m=null;a.stroke()}(s,0,0,t.xaxis,t.yaxis,e,t.lines.steps),e.restore()},this.drawSeriesPoints=function(t,d,e,n,o,i,a){function r(t,e,n,o,i,a){t.moveTo(e+o,n),t.arc(e,n,o,0,i?Math.PI:2*Math.PI,!1)}r.fill=!0,d.save(),d.translate(e.left,e.top);var s={format:t.datapoints.format,points:t.datapoints.points,pointsize:t.datapoints.pointsize};t.decimatePoints&&(s.points=t.decimatePoints(t,t.xaxis.min,t.xaxis.max,n,t.yaxis.min,t.yaxis.max,o));var l,c=t.points.lineWidth,u=t.points.radius,p=t.points.symbol;"circle"===p?l=r:"string"==typeof p&&i&&i[p]?l=i[p]:"function"==typeof i&&(l=i),0===c&&(c=1e-4),d.lineWidth=c,d.fillStyle=m(t.points,t.color,null,null,a),d.strokeStyle=t.color,function(t,e,n,o,i,a,r,s){var l=t.points,c=t.pointsize;d.beginPath();for(var u=0;u<l.length;u+=c){var p=l[u],h=l[u+1];null==p||p<a.min||p>a.max||h<r.min||h>r.max||(p=a.p2c(p),h=r.p2c(h)+o,s(d,p,h,e,i,n))}s.fill&&!i&&d.fill(),d.stroke()}(s,u,!0,0,!1,t.xaxis,t.yaxis,l),d.restore()},this.drawSeriesBars=function(h,d,t,e,n,o,i){d.save(),d.translate(t.left,t.top);var a,r={format:h.datapoints.format,points:h.datapoints.points,pointsize:h.datapoints.pointsize};h.decimate&&(r.points=h.decimate(h,h.xaxis.min,h.xaxis.max,e)),d.lineWidth=h.bars.lineWidth,d.strokeStyle=h.color;var s=h.bars.barWidth[0]||h.bars.barWidth;switch(h.bars.align){case"left":a=0;break;case"right":a=-s;break;default:a=-s/2}!function(t,e,n,o,i,a){for(var r=t.points,s=t.pointsize,l=h.bars.fillTowards||0,c=l>a.min?Math.min(a.max,l):a.min,u=0;u<r.length;u+=s)if(null!=r[u]){var p=3===s?r[u+2]:c;f(r[u],r[u+1],p,e,n,o,i,a,d,h.bars.horizontal,h.bars.lineWidth)}}(r,a,a+s,h.bars.fill?function(t,e){return m(h.bars,h.color,t,e,i)}:null,h.xaxis,h.yaxis),d.restore()},this.drawBar=f}}(jQuery),function(p){function e(t,e,n,o){if(e.points.errorbars){var i=[{x:!0,number:!0,required:!0},{y:!0,number:!0,required:!0}],a=e.points.errorbars;"x"!==a&&"xy"!==a||(e.points.xerr.asymmetric&&i.push({x:!0,number:!0,required:!0}),i.push({x:!0,number:!0,required:!0})),"y"!==a&&"xy"!==a||(e.points.yerr.asymmetric&&i.push({y:!0,number:!0,required:!0}),i.push({y:!0,number:!0,required:!0})),o.format=i}}function M(t,e){var n=t.datapoints.points,o=null,i=null,a=null,r=null,s=t.points.xerr,l=t.points.yerr,c=t.points.errorbars;"x"===c||"xy"===c?s.asymmetric?(o=n[e+2],i=n[e+3],"xy"===c&&(l.asymmetric?(a=n[e+4],r=n[e+5]):a=n[e+4])):(o=n[e+2],"xy"===c&&(l.asymmetric?(a=n[e+3],r=n[e+4]):a=n[e+3])):"y"===c&&(l.asymmetric?(a=n[e+2],r=n[e+3]):a=n[e+2]),null==i&&(i=o),null==r&&(r=a);var u=[o,i,a,r];return s.show||(u[0]=null,u[1]=null),l.show||(u[2]=null,u[3]=null),u}function S(t,e,n,o,i,a,r,s,l,c,u){o+=c,i+=c,a+=c,"x"===e.err?(n+l<i?h(t,[[i,o],[Math.max(n+l,u[0]),o]]):r=!1,a<n-l?h(t,[[Math.min(n-l,u[1]),o],[a,o]]):s=!1):(i<o-l?h(t,[[n,i],[n,Math.min(o-l,u[0])]]):r=!1,o+l<a?h(t,[[n,Math.max(o+l,u[1])],[n,a]]):s=!1),l=null!=e.radius?e.radius:l,r&&("-"===e.upperCap?"x"===e.err?h(t,[[i,o-l],[i,o+l]]):h(t,[[n-l,i],[n+l,i]]):p.isFunction(e.upperCap)&&("x"===e.err?e.upperCap(t,i,o,l):e.upperCap(t,n,i,l))),s&&("-"===e.lowerCap?"x"===e.err?h(t,[[a,o-l],[a,o+l]]):h(t,[[n-l,a],[n+l,a]]):p.isFunction(e.lowerCap)&&("x"===e.err?e.lowerCap(t,a,o,l):e.lowerCap(t,n,a,l)))}function h(t,e){t.beginPath(),t.moveTo(e[0][0],e[0][1]);for(var n=1;n<e.length;n++)t.lineTo(e[n][0],e[n][1]);t.stroke()}function n(t,n){var e=t.getPlotOffset();n.save(),n.translate(e.left,e.top),p.each(t.getData(),function(t,e){e.points.errorbars&&(e.points.xerr.show||e.points.yerr.show)&&function(t,e,n){var o,i=n.datapoints.points,a=n.datapoints.pointsize,r=[n.xaxis,n.yaxis],s=n.points.radius,l=[n.points.xerr,n.points.yerr],c=!1;r[0].p2c(r[0].max)<r[0].p2c(r[0].min)&&(c=!0,o=l[0].lowerCap,l[0].lowerCap=l[0].upperCap,l[0].upperCap=o);var u=!1;r[1].p2c(r[1].min)<r[1].p2c(r[1].max)&&(u=!0,o=l[1].lowerCap,l[1].lowerCap=l[1].upperCap,l[1].upperCap=o);for(var p=0;p<n.datapoints.points.length;p+=a)for(var h=M(n,p),d=0;d<l.length;d++){var f=[r[d].min,r[d].max];if(h[d*l.length]){var m=i[p],g=i[p+1],x=[m,g][d]+h[d*l.length+1],v=[m,g][d]-h[d*l.length];if("x"===l[d].err&&(g>r[1].max||g<r[1].min||x<r[0].min||v>r[0].max))continue;if("y"===l[d].err&&(m>r[0].max||m<r[0].min||x<r[1].min||v>r[1].max))continue;var b=!0,y=!0;x>f[1]&&(b=!1,x=f[1]),v<f[0]&&(y=!1,v=f[0]),("x"===l[d].err&&c||"y"===l[d].err&&u)&&(o=v,v=x,x=o,o=y,y=b,b=o,o=f[0],f[0]=f[1],f[1]=o),m=r[0].p2c(m),g=r[1].p2c(g),x=r[d].p2c(x),v=r[d].p2c(v),f[0]=r[d].p2c(f[0]),f[1]=r[d].p2c(f[1]);var w=l[d].lineWidth?l[d].lineWidth:n.points.lineWidth,T=null!=n.points.shadowSize?n.points.shadowSize:n.shadowSize;if(0<w&&0<T){var k=T/2;e.lineWidth=k,e.strokeStyle="rgba(0,0,0,0.1)",S(e,l[d],m,g,x,v,b,y,s,k+k/2,f),e.strokeStyle="rgba(0,0,0,0.2)",S(e,l[d],m,g,x,v,b,y,s,k/2,f)}e.strokeStyle=l[d].color?l[d].color:n.color,e.lineWidth=w,S(e,l[d],m,g,x,v,b,y,s,0,f)}}}(0,n,e)}),n.restore()}p.plot.plugins.push({init:function(t){t.hooks.processRawData.push(e),t.hooks.draw.push(n)},options:{series:{points:{errorbars:null,xerr:{err:"x",show:null,asymmetric:null,upperCap:null,lowerCap:null,color:null,radius:null},yerr:{err:"y",show:null,asymmetric:null,upperCap:null,lowerCap:null,color:null,radius:null}}}},name:"errorbars",version:"1.0"})}(jQuery),jQuery.plot.uiConstants={SNAPPING_CONSTANT:20,PANHINT_LENGTH_CONSTANT:10,MINOR_TICKS_COUNT_CONSTANT:4,TICK_LENGTH_CONSTANT:10,ZOOM_DISTANCE_MARGIN:25},function(v){var b=t(Number.MAX_VALUE,10),y=t(Number.MAX_VALUE,4);function t(t,e){for(var n,o,i=Math.floor(Math.log(t)*Math.LOG10E)-1,a=[],r=-i;r<=i;r++){o=parseFloat("1e"+r);for(var s=1;s<9;s+=e)n=o*s,a.push(n)}return a}var i=function(t,e,n){var o=[],i=-1,a=-1,r=t.getCanvas(),s=b,l=w(e,t),c=e.max;n||(n=.3*Math.sqrt("x"===e.direction?r.width:r.height)),b.some(function(t,e){return l<=t&&(i=e,!0)}),b.some(function(t,e){return c<=t&&(a=e,!0)}),-1===a&&(a=b.length-1),a-i<=n/4&&s.length!==y.length&&(s=y,i*=2,a*=2);var u,p,h,d=null,f=1/n;if(n/4<=a-i){for(var m=a;i<=m;m--)u=s[m],p=(Math.log(u)-Math.log(l))/(Math.log(c)-Math.log(l)),h=u,null===d?d={pixelCoord:p,idealPixelCoord:p}:Math.abs(p-d.pixelCoord)>=f?d={pixelCoord:p,idealPixelCoord:d.idealPixelCoord-f}:h=null,h&&o.push(h);o.reverse()}else{var g=t.computeTickSize(l,c,n),x={min:l,max:c,tickSize:g};o=v.plot.linearTickGenerator(x)}return o},w=function(t,e){var n=t.min,o=t.max;return n<=0&&o<(n=null===t.datamin?t.min=.1:h(e,t))&&(t.max=null!==t.datamax?t.datamax:t.options.max,t.options.offset.below=0,t.options.offset.above=0),n},a=function(t,e,n){var o=0<t?Math.floor(Math.log(t)/Math.LN10):0;if(n)return-4<=o&&o<=7?v.plot.defaultTickFormatter(t,e,n):v.plot.expRepTickFormatter(t,e,n);if(-4<=o&&o<=7){var i=o<0?t.toFixed(-o):t.toFixed(o+2);if(-1!==i.indexOf(".")){for(var a=i.lastIndexOf("0");a===i.length-1;)a=(i=i.slice(0,-1)).lastIndexOf("0");i.indexOf(".")===i.length-1&&(i=i.slice(0,-1))}return i}return v.plot.expRepTickFormatter(t,e)},r=function(t){return t<b[0]&&(t=b[0]),Math.log(t)},s=function(t){return Math.exp(t)},l=function(t){return-t},c=function(t){return-r(t)},u=function(t){return s(-t)};function p(t,e){"log"===e.options.mode&&e.datamin<=0&&(null===e.datamin?e.datamin=.1:e.datamin=h(t,e))}function h(e,n){var t=e.getData().filter(function(t){return t.xaxis===n||t.yaxis===n}).map(function(t){return e.computeRangeForDataSeries(t,null,d)}),o="x"===n.direction?Math.min(.1,t&&t[0]?t[0].xmin:.1):Math.min(.1,t&&t[0]?t[0].ymin:.1);return n.min=o}function d(t){return 0<t}v.plot.plugins.push({init:function(t){t.hooks.processOptions.push(function(o){v.each(o.getAxes(),function(t,e){var n=e.options;"log"===n.mode?(e.tickGenerator=function(t){return i(o,t,11)},"function"!=typeof e.options.tickFormatter&&(e.options.tickFormatter=a),e.options.transform=n.inverted?c:r,e.options.inverseTransform=n.inverted?u:s,e.options.autoScaleMargin=0,o.hooks.setRange.push(p)):n.inverted&&(e.options.transform=l,e.options.inverseTransform=l)})})},options:{xaxis:{}},name:"log",version:"0.1"}),v.plot.logTicksGenerator=i,v.plot.logTickFormatter=a}(jQuery),function(t){var e=function(t,e,n,o,i){var a=o*Math.sqrt(Math.PI)/2;t.rect(e-a,n-a,a+a,a+a)},n=function(t,e,n,o,i){var a=o*Math.sqrt(Math.PI)/2;t.rect(e-a,n-a,a+a,a+a)},o=function(t,e,n,o,i){var a=o*Math.sqrt(Math.PI/2);t.moveTo(e-a,n),t.lineTo(e,n-a),t.lineTo(e+a,n),t.lineTo(e,n+a),t.lineTo(e-a,n),t.lineTo(e,n-a)},i=function(t,e,n,o,i){var a=o*Math.sqrt(2*Math.PI/Math.sin(Math.PI/3)),r=a*Math.sin(Math.PI/3);t.moveTo(e-a/2,n+r/2),t.lineTo(e+a/2,n+r/2),i||(t.lineTo(e,n-r/2),t.lineTo(e-a/2,n+r/2),t.lineTo(e+a/2,n+r/2))},a=function(t,e,n,o,i,a){i||(t.moveTo(e+o,n),t.arc(e,n,o,0,2*Math.PI,!1))},r={square:e,rectangle:n,diamond:o,triangle:i,cross:function(t,e,n,o,i){var a=o*Math.sqrt(Math.PI)/2;t.moveTo(e-a,n-a),t.lineTo(e+a,n+a),t.moveTo(e-a,n+a),t.lineTo(e+a,n-a)},ellipse:a,plus:function(t,e,n,o,i){var a=o*Math.sqrt(Math.PI/2);t.moveTo(e-a,n),t.lineTo(e+a,n),t.moveTo(e,n+a),t.lineTo(e,n-a)}};a.fill=i.fill=o.fill=n.fill=e.fill=!0,t.plot.plugins.push({init:function(t){t.drawSymbol=r},name:"symbols",version:"1.0"})}(jQuery),function(t){function e(t,e,n,o){if(!0===e.flatdata){var i=e.start||0,a="number"==typeof e.step?e.step:1;o.pointsize=2;for(var r=0,s=0;r<n.length;r++,s+=2)o.points[s]=i+r*a,o.points[s+1]=n[r];void 0!==o.points?o.points.length=2*n.length:o.points=[]}}jQuery.plot.plugins.push({init:function(t){t.hooks.processRawData.push(e)},name:"flatdata",version:"0.0.2"})}(),function(S){var C=S.plot.saturated,P=S.plot.browser,N=S.plot.uiConstants.SNAPPING_CONSTANT,L=S.plot.uiConstants.PANHINT_LENGTH_CONSTANT;function e(y,t){var s=null,i=!1,a="manual"===t.pan.mode,o="smartLock"===t.pan.mode,r=o||"smart"===t.pan.mode;var l,c="default",w=null,u=null,p={x:0,y:0},h=!1;function d(t,e){var n=Math.abs(t.originalEvent.deltaY)<=1?1+Math.abs(t.originalEvent.deltaY)/50:null;if(h&&v(t),y.getOptions().zoom.active)return t.preventDefault(),function(t,e,n){var o=P.getPageXY(t),i=y.offset();i.left=o.X-i.left,i.top=o.Y-i.top;var a=y.getPlaceholder().offset();a.left=o.X-a.left,a.top=o.Y-a.top;var r=y.getXAxes().concat(y.getYAxes()).filter(function(t){var e=t.box;if(void 0!==e)return a.left>e.left&&a.left<e.left+e.width&&a.top>e.top&&a.top<e.top+e.height});0===r.length&&(r=void 0),e?y.zoomOut({center:i,axes:r,amount:n}):y.zoom({center:i,axes:r,amount:n})}(t,e<0,n),!1}function f(t){i=!0}function m(t){i=!1}function g(t){if(!i||0!==t.button)return!1;h=!0;var e=P.getPageXY(t),n=y.getPlaceholder().offset();n.left=e.X-n.left,n.top=e.Y-n.top,0===(s=y.getXAxes().concat(y.getYAxes()).filter(function(t){var e=t.box;if(void 0!==e)return n.left>e.left&&n.left<e.left+e.width&&n.top>e.top&&n.top<e.top+e.height})).length&&(s=void 0);var o=y.getPlaceholder().css("cursor");o&&(c=o),y.getPlaceholder().css("cursor",y.getOptions().pan.cursor),r?l=y.navigationState(e.X,e.Y):a&&(p.x=e.X,p.y=e.Y)}function x(t){if(h){var e=P.getPageXY(t),n=y.getOptions().pan.frameRate;-1!==n?!u&&n&&(u=setTimeout(function(){r?y.smartPan({x:l.startPageX-e.X,y:l.startPageY-e.Y},l,s,!1,o):a&&(y.pan({left:p.x-e.X,top:p.y-e.Y,axes:s}),p.x=e.X,p.y=e.Y),u=null},1/n*1e3)):r?y.smartPan({x:l.startPageX-e.X,y:l.startPageY-e.Y},l,s,!1,o):a&&(y.pan({left:p.x-e.X,top:p.y-e.Y,axes:s}),p.x=e.X,p.y=e.Y)}}function v(t){if(h){u&&(clearTimeout(u),u=null),h=!1;var e=P.getPageXY(t);y.getPlaceholder().css("cursor",c),r?(y.smartPan({x:l.startPageX-e.X,y:l.startPageY-e.Y},l,s,!1,o),y.smartPan.end()):a&&(y.pan({left:p.x-e.X,top:p.y-e.Y,axes:s}),p.x=0,p.y=0)}}function b(t){if(y.activate(),y.getOptions().recenter.interactive){var e,n=y.getTouchedAxis(t.clientX,t.clientY);y.recenter({axes:n[0]?n:null}),e=n[0]?new S.Event("re-center",{detail:{axisTouched:n[0]}}):new S.Event("re-center",{detail:t}),y.getPlaceholder().trigger(e)}}function T(t){return y.activate(),h&&v(t),!1}y.navigationState=function(t,e){var n=this.getAxes(),o={};return Object.keys(n).forEach(function(t){var e=n[t];o[t]={navigationOffset:{below:e.options.offset.below||0,above:e.options.offset.above||0},axisMin:e.min,axisMax:e.max,diagMode:!1}}),o.startPageX=t||0,o.startPageY=e||0,o},y.activate=function(){var t=y.getOptions();t.pan.active&&t.zoom.active||(t.pan.active=!0,t.zoom.active=!0,y.getPlaceholder().trigger("plotactivated",[y]))},y.zoomOut=function(t){t||(t={}),t.amount||(t.amount=y.getOptions().zoom.amount),t.amount=1/t.amount,y.zoom(t)},y.zoom=function(t){t||(t={});var e=t.center,n=t.amount||y.getOptions().zoom.amount,o=y.width(),i=y.height(),a=t.axes||y.getAxes();e||(e={left:o/2,top:i/2});var r=e.left/o,s=e.top/i,l={x:{min:e.left-r*o/n,max:e.left+(1-r)*o/n},y:{min:e.top-s*i/n,max:e.top+(1-s)*i/n}};for(var c in a)if(a.hasOwnProperty(c)){var u=a[c],p=u.options,h=l[u.direction].min,d=l[u.direction].max,f=u.options.offset;if((p.axisZoom||!t.axes)&&(t.axes||p.plotZoom)){if(h=S.plot.saturated.saturate(u.c2p(h)),(d=S.plot.saturated.saturate(u.c2p(d)))<h){var m=h;h=d,d=m}var g=S.plot.saturated.saturate(f.below-(u.min-h)),x=S.plot.saturated.saturate(f.above-(u.max-d));p.offset={below:g,above:x}}}y.setupGrid(!0),y.draw(),t.preventEvent||y.getPlaceholder().trigger("plotzoom",[y,t])},y.pan=function(r){var s={x:+r.left,y:+r.top};isNaN(s.x)&&(s.x=0),isNaN(s.y)&&(s.y=0),S.each(r.axes||y.getAxes(),function(t,e){var n=e.options,o=s[e.direction];if((n.axisPan||!r.axes)&&(n.plotPan||r.axes)&&0!==o){var i=C.saturate(e.c2p(e.p2c(e.min)+o)-e.c2p(e.p2c(e.min))),a=C.saturate(e.c2p(e.p2c(e.max)+o)-e.c2p(e.p2c(e.max)));isFinite(i)||(i=0),isFinite(a)||(a=0),n.offset={below:C.saturate(i+(n.offset.below||0)),above:C.saturate(a+(n.offset.above||0))}}}),y.setupGrid(!0),y.draw(),r.preventEvent||y.getPlaceholder().trigger("plotpan",[y,r])},y.recenter=function(n){S.each(n.axes||y.getAxes(),function(t,e){n.axes?"x"===this.direction?e.options.offset={below:0}:"y"===this.direction&&(e.options.offset={above:0}):e.options.offset={below:0,above:0}}),y.setupGrid(!0),y.draw()};var k=null,M={x:0,y:0};y.smartPan=function(o,t,i,e,n){var a,r,s,l,c,u,p,h,d,f,m,g,x,v=!!n||(r=o,Math.abs(r.y)<N&&Math.abs(r.x)>=N||Math.abs(r.x)<N&&Math.abs(r.y)>=N),b=y.getAxes();o=n?function(t){switch(!k&&Math.max(Math.abs(t.x),Math.abs(t.y))>=N&&(k=Math.abs(t.x)<Math.abs(t.y)?"y":"x"),k){case"x":return{x:t.x,y:0};case"y":return{x:0,y:t.y};default:return{x:0,y:0}}}(o):(s=o,Math.abs(s.x)<N&&Math.abs(s.y)>=N?{x:0,y:s.y}:Math.abs(s.y)<N&&Math.abs(s.x)>=N?{x:s.x,y:0}:s),l=o,0<Math.abs(l.x)&&0<Math.abs(l.y)&&(t.diagMode=!0),v&&!0===t.diagMode&&(t.diagMode=!1,c=b,u=t,p=o,Object.keys(c).forEach(function(t){h=c[t],0===p[h.direction]&&(h.options.offset.below=u[t].navigationOffset.below,h.options.offset.above=u[t].navigationOffset.above)})),w=v?{start:{x:t.startPageX-y.offset().left+y.getPlotOffset().left,y:t.startPageY-y.offset().top+y.getPlotOffset().top},end:{x:t.startPageX-o.x-y.offset().left+y.getPlotOffset().left,y:t.startPageY-o.y-y.offset().top+y.getPlotOffset().top}}:{start:{x:t.startPageX-y.offset().left+y.getPlotOffset().left,y:t.startPageY-y.offset().top+y.getPlotOffset().top},end:!1},isNaN(o.x)&&(o.x=0),isNaN(o.y)&&(o.y=0),i&&(b=i),Object.keys(b).forEach(function(t){if(d=b[t],f=d.min,m=d.max,a=d.options,x=o[d.direction],g=M[d.direction],(a.axisPan||!i)&&(i||a.plotPan)&&0!==x){var e=C.saturate(d.c2p(d.p2c(f)-(g-x))-d.c2p(d.p2c(f))),n=C.saturate(d.c2p(d.p2c(m)-(g-x))-d.c2p(d.p2c(m)));isFinite(e)||(e=0),isFinite(n)||(n=0),d.options.offset.below=C.saturate(e+(d.options.offset.below||0)),d.options.offset.above=C.saturate(n+(d.options.offset.above||0))}}),M=o,y.setupGrid(!0),y.draw(),e||y.getPlaceholder().trigger("plotpan",[y,o,i,t])},y.smartPan.end=function(){k=w=null,M={x:0,y:0},y.triggerRedrawOverlay()},y.getTouchedAxis=function(t,e){var n=y.getPlaceholder().offset();return n.left=t-n.left,n.top=e-n.top,y.getXAxes().concat(y.getYAxes()).filter(function(t){var e=t.box;if(void 0!==e)return n.left>e.left&&n.left<e.left+e.width&&n.top>e.top&&n.top<e.top+e.height})},y.hooks.drawOverlay.push(function(t,e){if(w){e.strokeStyle="rgba(96, 160, 208, 0.7)",e.lineWidth=2,e.lineJoin="round";var n,o,i=Math.round(w.start.x),a=Math.round(w.start.y);if(s?"x"===s[0].direction?(o=Math.round(w.start.y),n=Math.round(w.end.x)):"y"===s[0].direction&&(n=Math.round(w.start.x),o=Math.round(w.end.y)):(n=Math.round(w.end.x),o=Math.round(w.end.y)),e.beginPath(),!1===w.end)e.moveTo(i,a-L),e.lineTo(i,a+L),e.moveTo(i+L,a),e.lineTo(i-L,a);else{var r=a===o;e.moveTo(i-(r?0:L),a-(r?L:0)),e.lineTo(i+(r?0:L),a+(r?L:0)),e.moveTo(i,a),e.lineTo(n,o),e.moveTo(n-(r?0:L),o-(r?L:0)),e.lineTo(n+(r?0:L),o+(r?L:0))}e.stroke()}}),y.hooks.bindEvents.push(function(t,e){var n=t.getOptions();n.zoom.interactive&&e.mousewheel(d),n.pan.interactive&&(t.addEventHandler("dragstart",g,e,0),t.addEventHandler("drag",x,e,0),t.addEventHandler("dragend",v,e,0),e.bind("mousedown",f),e.bind("mouseup",m)),e.dblclick(b),e.click(T)}),y.hooks.shutdown.push(function(t,e){e.unbind("mousewheel",d),e.unbind("mousedown",f),e.unbind("mouseup",m),e.unbind("dragstart",g),e.unbind("drag",x),e.unbind("dragend",v),e.unbind("dblclick",b),e.unbind("click",T),u&&clearTimeout(u)})}S.plot.plugins.push({init:function(t){t.hooks.processOptions.push(e)},options:{zoom:{interactive:!1,active:!1,amount:1.5},pan:{interactive:!1,active:!1,cursor:"move",frameRate:60,mode:"smart"},recenter:{interactive:!0},xaxis:{axisZoom:!0,plotZoom:!0,axisPan:!0,plotPan:!0},yaxis:{axisZoom:!0,plotZoom:!0,axisPan:!0,plotPan:!0}},name:"navigate",version:"1.3"})}(jQuery),jQuery.plot.plugins.push({init:function(t){t.hooks.processRawData.push(function(n,t,e,o){null!=t.fillBetween&&(format=o.format,format||(format=[],format.push({x:!0,number:!0,computeRange:"none"!==t.xaxis.options.autoScale,required:!0}),format.push({y:!0,number:!0,computeRange:"none"!==t.yaxis.options.autoScale,required:!0}),void 0!==t.fillBetween&&""!==t.fillBetween&&function(t){var e=n.getData();for(i=0;i<e.length;i++)if(e[i].id===t)return!0;return!1}(t.fillBetween)&&t.fillBetween!==t.id&&format.push({x:!1,y:!0,number:!0,required:!1,computeRange:"none"!==t.yaxis.options.autoScale,defaultValue:0}),o.format=format))}),t.hooks.processDatapoints.push(function(t,e,n){if(null!=e.fillBetween){var o=function(t,e){var n;for(n=0;n<e.length;++n)if(e[n].id===t.fillBetween)return e[n];return"number"==typeof t.fillBetween?t.fillBetween<0||t.fillBetween>=e.length?null:e[t.fillBetween]:null}(e,t.getData());if(o){for(var i,a,r,s,l,c,u,p,h=n.pointsize,d=n.points,f=o.datapoints.pointsize,m=o.datapoints.points,g=[],x=e.lines.show,v=2<h&&n.format[2].y,b=x&&e.lines.steps,y=!0,w=0,T=0;!(w>=d.length);){if(u=g.length,null==d[w]){for(p=0;p<h;++p)g.push(d[w+p]);w+=h}else if(T>=m.length){if(!x)for(p=0;p<h;++p)g.push(d[w+p]);w+=h}else if(null==m[T]){for(p=0;p<h;++p)g.push(null);y=!0,T+=f}else{if(i=d[w],a=d[w+1],s=m[T],l=m[T+1],c=0,i===s){for(p=0;p<h;++p)g.push(d[w+p]);c=l,w+=h,T+=f}else if(s<i){if(x&&0<w&&null!=d[w-h]){for(r=a+(d[w-h+1]-a)*(s-i)/(d[w-h]-i),g.push(s),g.push(r),p=2;p<h;++p)g.push(d[w+p]);c=l}T+=f}else{if(y&&x){w+=h;continue}for(p=0;p<h;++p)g.push(d[w+p]);x&&0<T&&null!=m[T-f]&&(c=l+(m[T-f+1]-l)*(i-s)/(m[T-f]-s)),w+=h}y=!1,u!==g.length&&v&&(g[u+2]=c)}if(b&&u!==g.length&&0<u&&null!==g[u]&&g[u]!==g[u-h]&&g[u+1]!==g[u-h+1]){for(p=0;p<h;++p)g[u+h+p]=g[u+p];g[u+1]=g[u-h+1]}}n.points=g}}})},options:{series:{fillBetween:null}},name:"fillbetween",version:"1.0"}),function(s){function e(t,e,n,o){var i="categories"===e.xaxis.options.mode,a="categories"===e.yaxis.options.mode;if(i||a){var r=o.format;if(!r){var s=e;if((r=[]).push({x:!0,number:!0,required:!0,computeRange:!0}),r.push({y:!0,number:!0,required:!0,computeRange:!0}),s.bars.show||s.lines.show&&s.lines.fill){var l=!!(s.bars.show&&s.bars.zero||s.lines.show&&s.lines.zero);r.push({y:!0,number:!0,required:!1,defaultValue:0,computeRange:l}),s.bars.horizontal&&(delete r[r.length-1].y,r[r.length-1].x=!0)}o.format=r}for(var c=0;c<r.length;++c)r[c].x&&i&&(r[c].number=!1),r[c].y&&a&&(r[c].number=!1,r[c].computeRange=!1)}}function l(t){var e=[];for(var n in t.categories){var o=t.categories[n];o>=t.min&&o<=t.max&&e.push([o,n])}return e.sort(function(t,e){return t[0]-e[0]}),e}function o(t,e,n){if("categories"===t[e].options.mode){if(!t[e].categories){var o={},i=t[e].options.categories||{};if(s.isArray(i))for(var a=0;a<i.length;++a)o[i[a]]=a;else for(var r in i)o[r]=i[r];t[e].categories=o}t[e].options.ticks||(t[e].options.ticks=l),function(t,e,n){for(var o=t.points,i=t.pointsize,a=t.format,r=e.charAt(0),s=function(t){var e=-1;for(var n in t)t[n]>e&&(e=t[n]);return e+1}(n),l=0;l<o.length;l+=i)if(null!=o[l])for(var c=0;c<i;++c){var u=o[l+c];null!=u&&a[c][r]&&(u in n||(n[u]=s,++s),o[l+c]=n[u])}}(n,e,t[e].categories)}}function n(t,e,n){o(e,"xaxis",n),o(e,"yaxis",n)}s.plot.plugins.push({init:function(t){t.hooks.processRawData.push(e),t.hooks.processDatapoints.push(n)},options:{xaxis:{categories:null},yaxis:{categories:null}},name:"categories",version:"1.0"})}(jQuery),jQuery.plot.plugins.push({init:function(t){t.hooks.processDatapoints.push(function(t,e,n){if(null!=e.stack&&!1!==e.stack){var o=e.bars.show||e.lines.show&&e.lines.fill,i=2<n.pointsize&&(y?n.format[2].x:n.format[2].y);o&&!i&&function(t,e){for(var n=[],o=0;o<e.points.length;o+=2)n.push(e.points[o]),n.push(e.points[o+1]),n.push(0);e.format.push({x:!1,y:!0,number:!0,required:!1,computeRange:"none"!==t.yaxis.options.autoScale,defaultValue:0}),e.points=n,e.pointsize=3}(e,n);var a=function(t,e){for(var n=null,o=0;o<e.length&&t!==e[o];++o)e[o].stack===t.stack&&(n=e[o]);return n}(e,t.getData());if(a){for(var r,s,l,c,u,p,h,d,f=n.pointsize,m=n.points,g=a.datapoints.pointsize,x=a.datapoints.points,v=[],b=e.lines.show,y=e.bars.horizontal,w=b&&e.lines.steps,T=!0,k=y?1:0,M=y?0:1,S=0,C=0;!(S>=m.length);){if(h=v.length,null==m[S]){for(d=0;d<f;++d)v.push(m[S+d]);S+=f}else if(C>=x.length){if(!b)for(d=0;d<f;++d)v.push(m[S+d]);S+=f}else if(null==x[C]){for(d=0;d<f;++d)v.push(null);T=!0,C+=g}else{if(r=m[S+k],s=m[S+M],c=x[C+k],u=x[C+M],p=0,r===c){for(d=0;d<f;++d)v.push(m[S+d]);v[h+M]+=u,p=u,S+=f,C+=g}else if(c<r){if(b&&0<S&&null!=m[S-f]){for(l=s+(m[S-f+M]-s)*(c-r)/(m[S-f+k]-r),v.push(c),v.push(l+u),d=2;d<f;++d)v.push(m[S+d]);p=u}C+=g}else{if(T&&b){S+=f;continue}for(d=0;d<f;++d)v.push(m[S+d]);b&&0<C&&null!=x[C-g]&&(p=u+(x[C-g+M]-u)*(r-c)/(x[C-g+k]-c)),v[h+M]+=p,S+=f}T=!1,h!==v.length&&o&&(v[h+2]+=p)}if(w&&h!==v.length&&0<h&&null!==v[h]&&v[h]!==v[h-f]&&v[h+1]!==v[h-f+1]){for(d=0;d<f;++d)v[h+f+d]=v[h+d];v[h+1]=v[h-f+1]}}n.points=v}}})},options:{series:{stack:null}},name:"stack",version:"1.2"}),function(c){var m=c.plot.uiConstants.ZOOM_DISTANCE_MARGIN;function e(u,t){var o,i,a,p,h={zoomEnable:!1,prevDistance:null,prevTapTime:0,prevPanPosition:{x:0,y:0},prevTapPosition:{x:0,y:0}},d={prevTouchedAxis:"none",currentTouchedAxis:"none",touchedAxis:null,navigationConstraint:"unconstrained",initialState:null},n=t.pan.interactive&&"manual"===t.pan.touchMode,r="smartLock"===t.pan.touchMode,s=t.pan.interactive&&(r||"smart"===t.pan.touchMode);function f(t,e,n){d.touchedAxis=function(t,e,n,o){{if("pinchstart"!==e.type)return"panstart"===e.type?t.getTouchedAxis(e.detail.touches[0].pageX,e.detail.touches[0].pageY):"pinchend"===e.type?t.getTouchedAxis(e.detail.touches[0].pageX,e.detail.touches[0].pageY):o.touchedAxis;var i=t.getTouchedAxis(e.detail.touches[0].pageX,e.detail.touches[0].pageY),a=t.getTouchedAxis(e.detail.touches[1].pageX,e.detail.touches[1].pageY);if(i.length===a.length&&i.toString()===a.toString())return i}}(u,t,0,d),g(d)?d.navigationConstraint="unconstrained":d.navigationConstraint="axisConstrained"}o={start:function(t){if(f(t,"pan",h),l(t,"pan",h,d),s){var e=y(t,"pan");d.initialState=u.navigationState(e.x,e.y)}},drag:function(t){if(f(t,"pan",h),s){var e=y(t,"pan");u.smartPan({x:d.initialState.startPageX-e.x,y:d.initialState.startPageY-e.y},d.initialState,d.touchedAxis,!1,r)}else n&&(u.pan({left:-b(t,"pan",h).x,top:-b(t,"pan",h).y,axes:d.touchedAxis}),v(t,"pan",h,d))},end:function(t){var e;f(t,"pan",h),s&&u.smartPan.end(),e=t,h.zoomEnable&&1===e.detail.touches.length&&updateprevPanPosition(t,"pan",h,d)}},i={start:function(t){var e;p&&(clearTimeout(p),p=null),f(t,"pinch",h),e=t,h.prevDistance=x(e),l(t,"pinch",h,d)},drag:function(c){p||(p=setTimeout(function(){f(c,"pinch",h),u.pan({left:-b(c,"pinch",h).x,top:-b(c,"pinch",h).y,axes:d.touchedAxis}),v(c,"pinch",h,d);var t,e,n,o,i,a,r,s,l=x(c);(h.zoomEnable||Math.abs(l-h.prevDistance)>m)&&(e=c,n=h,o=d,i=(t=u).offset(),a={left:0,top:0},r=x(e)/n.prevDistance,s=x(e),a.left=y(e,"pinch").x-i.left,a.top=y(e,"pinch").y-i.top,t.zoom({center:a,amount:r,axes:o.touchedAxis}),n.prevDistance=s,h.zoomEnable=!0),p=null},1e3/60))},end:function(t){p&&(clearTimeout(p),p=null),f(t,"pinch",h),h.prevDistance=null}},a={recenterPlot:function(t){t&&t.detail&&"touchstart"===t.detail.type&&function(t,e,n,o){if(a=t,r=e,s=o,l=a.getTouchedAxis(r.detail.firstTouch.x,r.detail.firstTouch.y),void 0!==l[0]&&(s.prevTouchedAxis=l[0].direction),void 0!==(l=a.getTouchedAxis(r.detail.secondTouch.x,r.detail.secondTouch.y))[0]&&(s.touchedAxis=l,s.currentTouchedAxis=l[0].direction),g(s)&&(s.touchedAxis=null,s.prevTouchedAxis="none",s.currentTouchedAxis="none"),"x"===o.currentTouchedAxis&&"x"===o.prevTouchedAxis||"y"===o.currentTouchedAxis&&"y"===o.prevTouchedAxis||"none"===o.currentTouchedAxis&&"none"===o.prevTouchedAxis){var i;t.recenter({axes:o.touchedAxis}),i=o.touchedAxis?new c.Event("re-center",{detail:{axisTouched:o.touchedAxis}}):new c.Event("re-center",{detail:e}),t.getPlaceholder().trigger(i)}var a,r,s,l}(u,t,0,d)}},!0!==t.pan.enableTouch&&!0!==t.zoom.enableTouch||(u.hooks.bindEvents.push(function(t,e){var n=t.getOptions();n.zoom.interactive&&n.zoom.enableTouch&&(e[0].addEventListener("pinchstart",i.start,!1),e[0].addEventListener("pinchdrag",i.drag,!1),e[0].addEventListener("pinchend",i.end,!1)),n.pan.interactive&&n.pan.enableTouch&&(e[0].addEventListener("panstart",o.start,!1),e[0].addEventListener("pandrag",o.drag,!1),e[0].addEventListener("panend",o.end,!1)),n.recenter.interactive&&n.recenter.enableTouch&&e[0].addEventListener("doubletap",a.recenterPlot,!1)}),u.hooks.shutdown.push(function(t,e){e[0].removeEventListener("panstart",o.start),e[0].removeEventListener("pandrag",o.drag),e[0].removeEventListener("panend",o.end),e[0].removeEventListener("pinchstart",i.start),e[0].removeEventListener("pinchdrag",i.drag),e[0].removeEventListener("pinchend",i.end),e[0].removeEventListener("doubletap",a.recenterPlot)}))}function g(t){return!t.touchedAxis||0===t.touchedAxis.length}function l(t,e,n,o){var i,a=y(t,e);switch(o.navigationConstraint){case"unconstrained":o.touchedAxis=null,n.prevTapPosition={x:n.prevPanPosition.x,y:n.prevPanPosition.y},n.prevPanPosition={x:a.x,y:a.y};break;case"axisConstrained":i=o.touchedAxis[0].direction,o.currentTouchedAxis=i,n.prevTapPosition[i]=n.prevPanPosition[i],n.prevPanPosition[i]=a[i]}}function x(t){var e,n,o,i,a=t.detail.touches[0],r=t.detail.touches[1];return e=a.pageX,n=a.pageY,o=r.pageX,i=r.pageY,Math.sqrt((e-o)*(e-o)+(n-i)*(n-i))}function v(t,e,n,o){var i=y(t,e);switch(o.navigationConstraint){case"unconstrained":n.prevPanPosition.x=i.x,n.prevPanPosition.y=i.y;break;case"axisConstrained":n.prevPanPosition[o.currentTouchedAxis]=i[o.currentTouchedAxis]}}function b(t,e,n){var o=y(t,e);return{x:o.x-n.prevPanPosition.x,y:o.y-n.prevPanPosition.y}}function y(t,e){return"pinch"===e?{x:(t.detail.touches[0].pageX+t.detail.touches[1].pageX)/2,y:(t.detail.touches[0].pageY+t.detail.touches[1].pageY)/2}:{x:t.detail.touches[0].pageX,y:t.detail.touches[0].pageY}}c.plot.plugins.push({init:function(t){t.hooks.processOptions.push(e)},options:{zoom:{enableTouch:!1},pan:{enableTouch:!1,touchMode:"manual"},recenter:{enableTouch:!0}},name:"navigateTouch",version:"0.3"})}(jQuery),function(y){var w=y.plot.browser,e="click",T="hover";y.plot.plugins.push({init:function(f){var n,m=[];function o(t){var e=f.getOptions(),n=new CustomEvent("mouseevent");return n.pageX=t.detail.changedTouches[0].pageX,n.pageY=t.detail.changedTouches[0].pageY,n.clientX=t.detail.changedTouches[0].clientX,n.clientY=t.detail.changedTouches[0].clientY,e.grid.hoverable&&i(n,T,30),!1}function i(t,e,n){var o=f.getData();if(void 0!==t&&0<o.length&&void 0!==o[0].xaxis.c2p&&void 0!==o[0].yaxis.c2p){var i=e+"able";c("plot"+e,t,function(t){return!1!==o[t][i]},n)}}function a(t){n=t,i(f.getPlaceholder()[0].lastMouseMoveEvent=t,T)}function r(t){n=void 0,f.getPlaceholder()[0].lastMouseMoveEvent=void 0,c("plothover",t,function(t){return!1})}function s(t){i(t,e)}function l(){f.unhighlight(),f.getPlaceholder().trigger("plothovercleanup")}function c(t,e,n,o){var i=f.getOptions(),a=f.offset(),r=w.getPageXY(e),s=r.X-a.left,l=r.Y-a.top,c=f.c2p({left:s,top:l}),u=void 0!==o?o:i.grid.mouseActiveRadius;c.pageX=r.X,c.pageY=r.Y;var p=f.findNearbyItem(s,l,n,u);if(p&&(p.pageX=parseInt(p.series.xaxis.p2c(p.datapoint[0])+a.left,10),p.pageY=parseInt(p.series.yaxis.p2c(p.datapoint[1])+a.top,10)),i.grid.autoHighlight){for(var h=0;h<m.length;++h){var d=m[h];(d.auto!==t||p&&d.series===p.series&&d.point[0]===p.datapoint[0]&&d.point[1]===p.datapoint[1])&&p||x(d.series,d.point)}p&&g(p.series,p.datapoint,t)}f.getPlaceholder().trigger(t,[c,p])}function g(t,e,n){if("number"==typeof t&&(t=f.getData()[t]),"number"==typeof e){var o=t.datapoints.pointsize;e=t.datapoints.points.slice(o*e,o*(e+1))}var i=u(t,e);-1===i?(m.push({series:t,point:e,auto:n}),f.triggerRedrawOverlay()):n||(m[i].auto=!1)}function x(t,e){if(null==t&&null==e)return m=[],void f.triggerRedrawOverlay();if("number"==typeof t&&(t=f.getData()[t]),"number"==typeof e){var n=t.datapoints.pointsize;e=t.datapoints.points.slice(n*e,n*(e+1))}var o=u(t,e);-1!==o&&(m.splice(o,1),f.triggerRedrawOverlay())}function u(t,e){for(var n=0;n<m.length;++n){var o=m[n];if(o.series===t&&o.point[0]===e[0]&&o.point[1]===e[1])return n}return-1}function p(){l(),i(n,T)}function h(){i(n,T)}function d(t,e,n){var o,i,a=t.getPlotOffset();for(e.save(),e.translate(a.left,a.top),o=0;o<m.length;++o)(i=m[o]).series.bars.show?b(i.series,i.point,e):v(i.series,i.point,e,t);e.restore()}function v(t,e,n,o){var i=e[0],a=e[1],r=t.xaxis,s=t.yaxis,l="string"==typeof t.highlightColor?t.highlightColor:y.color.parse(t.color).scale("a",.5).toString();if(!(i<r.min||i>r.max||a<s.min||a>s.max)){var c=t.points.radius+t.points.lineWidth/2;n.lineWidth=c,n.strokeStyle=l;var u=1.5*c;i=r.p2c(i),a=s.p2c(a),n.beginPath();var p=t.points.symbol;"circle"===p?n.arc(i,a,u,0,2*Math.PI,!1):"string"==typeof p&&o.drawSymbol&&o.drawSymbol[p]&&o.drawSymbol[p](n,i,a,u,!1),n.closePath(),n.stroke()}}function b(t,e,n){var o,i="string"==typeof t.highlightColor?t.highlightColor:y.color.parse(t.color).scale("a",.5).toString(),a=i,r=t.bars.barWidth[0]||t.bars.barWidth;switch(t.bars.align){case"left":o=0;break;case"right":o=-r;break;default:o=-r/2}n.lineWidth=t.bars.lineWidth,n.strokeStyle=i;var s=t.bars.fillTowards||0,l=s>t.yaxis.min?Math.min(t.yaxis.max,s):t.yaxis.min;y.plot.drawSeries.drawBar(e[0],e[1],e[2]||l,o,o+r,function(){return a},t.xaxis,t.yaxis,n,t.bars.horizontal,t.bars.lineWidth)}f.hooks.bindEvents.push(function(t,e){var n=t.getOptions();(n.grid.hoverable||n.grid.clickable)&&(e[0].addEventListener("touchevent",l,!1),e[0].addEventListener("tap",o,!1)),n.grid.clickable&&e.bind("click",s),n.grid.hoverable&&(e.bind("mousemove",a),e.bind("mouseleave",r))}),f.hooks.shutdown.push(function(t,e){e[0].removeEventListener("tap",o),e[0].removeEventListener("touchevent",l),e.unbind("mousemove",a),e.unbind("mouseleave",r),e.unbind("click",s),m=[]}),f.hooks.processOptions.push(function(t,e){t.highlight=g,t.unhighlight=x,(e.grid.hoverable||e.grid.clickable)&&(t.hooks.drawOverlay.push(d),t.hooks.processDatapoints.push(p),t.hooks.setupGrid.push(h)),n=t.getPlaceholder()[0].lastMouseMoveEvent})},options:{grid:{hoverable:!1,clickable:!1}},name:"hover",version:"0.1"})}(jQuery),function(t){function e(n,t){var o,i={twoTouches:!1,currentTapStart:{x:0,y:0},currentTapEnd:{x:0,y:0},prevTap:{x:0,y:0},currentTap:{x:0,y:0},interceptedLongTap:!1,isUnsupportedGesture:!1,prevTapTime:null,tapStartTime:null,longTapTriggerId:null},a=20,r=500;function s(t){var e=n.getOptions();(e.pan.active||e.zoom.active)&&(3<=t.touches.length?i.isUnsupportedGesture=!0:i.isUnsupportedGesture=!1,o.dispatchEvent(new CustomEvent("touchevent",{detail:t})),v(t)?l(t,"pinch"):(l(t,"pan"),x(t)||(function(t){var e=(new Date).getTime(),n=e-i.prevTapTime;if(0<=n&&n<r&&g(i.prevTap.x,i.prevTap.y,i.currentTap.x,i.currentTap.y)<a)return t.firstTouch=i.prevTap,t.secondTouch=i.currentTap,!0;return i.prevTapTime=e,!1}(t)&&l(t,"doubleTap"),l(t,"tap"),l(t,"longTap"))))}function l(t,e){switch(e){case"pan":c[t.type](t);break;case"pinch":u[t.type](t);break;case"doubleTap":p.onDoubleTap(t);break;case"longTap":h[t.type](t);break;case"tap":d[t.type](t)}}var c={touchstart:function(t){var e;i.prevTap={x:i.currentTap.x,y:i.currentTap.y},f(t),e=t,i.tapStartTime=(new Date).getTime(),i.interceptedLongTap=!1,i.currentTapStart={x:e.touches[0].pageX,y:e.touches[0].pageY},i.currentTapEnd={x:e.touches[0].pageX,y:e.touches[0].pageY},o.dispatchEvent(new CustomEvent("panstart",{detail:t}))},touchmove:function(t){var e;m(t),f(t),e=t,i.currentTapEnd={x:e.touches[0].pageX,y:e.touches[0].pageY},i.isUnsupportedGesture||o.dispatchEvent(new CustomEvent("pandrag",{detail:t}))},touchend:function(t){var e;m(t),x(t)?(o.dispatchEvent(new CustomEvent("pinchend",{detail:t})),o.dispatchEvent(new CustomEvent("panstart",{detail:t}))):(e=t).touches&&0===e.touches.length&&o.dispatchEvent(new CustomEvent("panend",{detail:t}))}},u={touchstart:function(t){o.dispatchEvent(new CustomEvent("pinchstart",{detail:t}))},touchmove:function(t){m(t),i.twoTouches=v(t),i.isUnsupportedGesture||o.dispatchEvent(new CustomEvent("pinchdrag",{detail:t}))},touchend:function(t){m(t)}},p={onDoubleTap:function(t){m(t),o.dispatchEvent(new CustomEvent("doubletap",{detail:t}))}},h={touchstart:function(t){h.waitForLongTap(t)},touchmove:function(t){},touchend:function(t){i.longTapTriggerId&&(clearTimeout(i.longTapTriggerId),i.longTapTriggerId=null)},isLongTap:function(t){return 1500<=(new Date).getTime()-i.tapStartTime&&!i.interceptedLongTap&&g(i.currentTapStart.x,i.currentTapStart.y,i.currentTapEnd.x,i.currentTapEnd.y)<20&&(i.interceptedLongTap=!0)},waitForLongTap:function(t){i.longTapTriggerId||(i.longTapTriggerId=setTimeout(function(){h.isLongTap(t)&&o.dispatchEvent(new CustomEvent("longtap",{detail:t})),i.longTapTriggerId=null},1500))}},d={touchstart:function(t){i.tapStartTime=(new Date).getTime()},touchmove:function(t){},touchend:function(t){d.isTap(t)&&(o.dispatchEvent(new CustomEvent("tap",{detail:t})),m(t))},isTap:function(t){return(new Date).getTime()-i.tapStartTime<=125&&g(i.currentTapStart.x,i.currentTapStart.y,i.currentTapEnd.x,i.currentTapEnd.y)<20}};function f(t){i.currentTap={x:t.touches[0].pageX,y:t.touches[0].pageY}}function m(t){i.isUnsupportedGesture||(t.preventDefault(),n.getOptions().propagateSupportedGesture||t.stopPropagation())}function g(t,e,n,o){return Math.sqrt((t-n)*(t-n)+(e-o)*(e-o))}function x(t){return i.twoTouches&&1===t.touches.length}function v(t){return!!(t.touches&&2<=t.touches.length&&t.touches[0].target===n.getEventHolder()&&t.touches[1].target===n.getEventHolder())}(!0===t.pan.enableTouch||t.zoom.enableTouch)&&(n.hooks.bindEvents.push(function(t,e){o=e[0],e[0].addEventListener("touchstart",s,!1),e[0].addEventListener("touchmove",s,!1),e[0].addEventListener("touchend",s,!1)}),n.hooks.shutdown.push(function(t,e){e[0].removeEventListener("touchstart",s),e[0].removeEventListener("touchmove",s),e[0].removeEventListener("touchend",s),i.longTapTriggerId&&(clearTimeout(i.longTapTriggerId),i.longTapTriggerId=null)}))}jQuery.plot.plugins.push({init:function(t){t.hooks.processOptions.push(e)},options:{propagateSupportedGesture:!1},name:"navigateTouch",version:"0.3"})}(),function(e){var y=e.plot.saturated.floorInBase,i=function(t,e){var n=new t(e),o=n.setTime.bind(n);n.update=function(t){o(t),t=Math.round(1e3*t)/1e3,this.microseconds=1e3*(t-Math.floor(t))};var i=n.getTime.bind(n);return n.getTime=function(){return i()+this.microseconds/1e3},n.setTime=function(t){this.update(t)},n.getMicroseconds=function(){return this.microseconds},n.setMicroseconds=function(t){var e=i()+t/1e3;this.update(e)},n.setUTCMicroseconds=function(t){this.setMicroseconds(t)},n.getUTCMicroseconds=function(){return this.getMicroseconds()},n.microseconds=null,n.microEpoch=null,n.update(e),n};function d(t,e,n,o){if("function"==typeof t.strftime)return t.strftime(e);var i,a=function(t,e){return e=""+(null==e?"0":e),1==(t=""+t).length?e+t:t},r=function(t,e,n){var o,i=1e3*t+e;if(n<6&&0<n){var a=parseFloat("1e"+(n-6));o=("00000"+(i=Math.round(Math.round(i*a)/a))).slice(-6,-(6-n))}else o=("00000"+(i=Math.round(i))).slice(-6);return o},s=[],l=!1,c=t.getHours(),u=c<12;n||(n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]),o||(o=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),i=12<c?c-12:0==c?12:c;for(var p=-1,h=0;h<e.length;++h){var d=e.charAt(h);if(!isNaN(Number(d))&&0<Number(d))p=Number(d);else if(l){switch(d){case"a":d=""+o[t.getDay()];break;case"b":d=""+n[t.getMonth()];break;case"d":d=a(t.getDate());break;case"e":d=a(t.getDate()," ");break;case"h":case"H":d=a(c);break;case"I":d=a(i);break;case"l":d=a(i," ");break;case"m":d=a(t.getMonth()+1);break;case"M":d=a(t.getMinutes());break;case"q":d=""+(Math.floor(t.getMonth()/3)+1);break;case"S":d=a(t.getSeconds());break;case"s":d=""+r(t.getMilliseconds(),t.getMicroseconds(),p);break;case"y":d=a(t.getFullYear()%100);break;case"Y":d=""+t.getFullYear();break;case"p":d=u?"am":"pm";break;case"P":d=u?"AM":"PM";break;case"w":d=""+t.getDay()}s.push(d),l=!1}else"%"==d?l=!0:s.push(d)}return s.join("")}function a(t){function e(t,e,n,o){t[e]=function(){return n[o].apply(n,arguments)}}var n={date:t};void 0!==t.strftime&&e(n,"strftime",t,"strftime"),e(n,"getTime",t,"getTime"),e(n,"setTime",t,"setTime");for(var o=["Date","Day","FullYear","Hours","Minutes","Month","Seconds","Milliseconds","Microseconds"],i=0;i<o.length;i++)e(n,"get"+o[i],t,"getUTC"+o[i]),e(n,"set"+o[i],t,"setUTC"+o[i]);return n}function w(t,e){var n=864e13;if(e&&"seconds"===e.timeBase?t*=1e3:"microseconds"===e.timeBase&&(t/=1e3),n<t?t=n:t<-n&&(t=-n),"browser"===e.timezone)return i(Date,t);if(e.timezone&&"utc"!==e.timezone){if("undefined"==typeof timezoneJS||void 0===timezoneJS.Date)return a(i(Date,t));var o=i(timezoneJS.Date,t);return o.setTimezone(e.timezone),o.setTime(t),o}return a(i(Date,t))}var T={microsecond:1e-6,millisecond:.001,second:1,minute:60,hour:3600,day:86400,month:2592e3,quarter:7776e3,year:525949.2*60},k={microsecond:.001,millisecond:1,second:1e3,minute:6e4,hour:36e5,day:864e5,month:2592e6,quarter:7776e6,year:525949.2*60*1e3},M={microsecond:1,millisecond:1e3,second:1e6,minute:6e7,hour:36e8,day:864e8,month:2592e9,quarter:7776e9,year:525949.2*60*1e6},t=[[1,"microsecond"],[2,"microsecond"],[5,"microsecond"],[10,"microsecond"],[25,"microsecond"],[50,"microsecond"],[100,"microsecond"],[250,"microsecond"],[500,"microsecond"],[1,"millisecond"],[2,"millisecond"],[5,"millisecond"],[10,"millisecond"],[25,"millisecond"],[50,"millisecond"],[100,"millisecond"],[250,"millisecond"],[500,"millisecond"],[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[.25,"month"],[.5,"month"],[1,"month"],[2,"month"]],S=t.concat([[3,"month"],[6,"month"],[1,"year"]]),C=t.concat([[1,"quarter"],[2,"quarter"],[1,"year"]]);function n(t){var e,n=t.options,o=[],i=w(t.min,n),a=0,r=n.tickSize&&"quarter"===n.tickSize[1]||n.minTickSize&&"quarter"===n.minTickSize[1]?C:S;e="seconds"===n.timeBase?T:"microseconds"===n.timeBase?M:k,null!==n.minTickSize&&void 0!==n.minTickSize&&(a="number"==typeof n.tickSize?n.tickSize:n.minTickSize[0]*e[n.minTickSize[1]]);for(var s=0;s<r.length-1&&!(t.delta<(r[s][0]*e[r[s][1]]+r[s+1][0]*e[r[s+1][1]])/2&&r[s][0]*e[r[s][1]]>=a);++s);var l=r[s][0],c=r[s][1];if("year"===c){if(null!==n.minTickSize&&void 0!==n.minTickSize&&"year"===n.minTickSize[1])l=Math.floor(n.minTickSize[0]);else{var u=parseFloat("1e"+Math.floor(Math.log(t.delta/e.year)/Math.LN10)),p=t.delta/e.year/u;l=p<1.5?1:p<3?2:p<7.5?5:10,l*=u}l<1&&(l=1)}t.tickSize=n.tickSize||[l,c];var h=t.tickSize[0],d=h*e[c=t.tickSize[1]];"microsecond"===c?i.setMicroseconds(y(i.getMicroseconds(),h)):"millisecond"===c?i.setMilliseconds(y(i.getMilliseconds(),h)):"second"===c?i.setSeconds(y(i.getSeconds(),h)):"minute"===c?i.setMinutes(y(i.getMinutes(),h)):"hour"===c?i.setHours(y(i.getHours(),h)):"month"===c?i.setMonth(y(i.getMonth(),h)):"quarter"===c?i.setMonth(3*y(i.getMonth()/3,h)):"year"===c&&i.setFullYear(y(i.getFullYear(),h)),d>=e.millisecond&&(d>=e.second?i.setMicroseconds(0):i.setMicroseconds(1e3*i.getMilliseconds())),d>=e.minute&&i.setSeconds(0),d>=e.hour&&i.setMinutes(0),d>=e.day&&i.setHours(0),d>=4*e.day&&i.setDate(1),d>=2*e.month&&i.setMonth(y(i.getMonth(),3)),d>=2*e.quarter&&i.setMonth(y(i.getMonth(),6)),d>=e.year&&i.setMonth(0);var f,m,g=0,x=Number.NaN;do{if(m=x,f=i.getTime(),x=n&&"seconds"===n.timeBase?f/1e3:n&&"microseconds"===n.timeBase?1e3*f:f,o.push(x),"month"===c||"quarter"===c)if(h<1){i.setDate(1);var v=i.getTime();i.setMonth(i.getMonth()+("quarter"===c?3:1));var b=i.getTime();i.setTime(x+g*e.hour+(b-v)*h),g=i.getHours(),i.setHours(0)}else i.setMonth(i.getMonth()+h*("quarter"===c?3:1));else"year"===c?i.setFullYear(i.getFullYear()+h):"seconds"===n.timeBase?i.setTime(1e3*(x+d)):"microseconds"===n.timeBase?i.setTime((x+d)/1e3):i.setTime(x+d)}while(x<t.max&&x!==m);return o}e.plot.plugins.push({init:function(t){t.hooks.processOptions.push(function(t){e.each(t.getAxes(),function(t,e){var h=e.options;"time"===h.mode&&(e.tickGenerator=n,e.tickFormatter=function(t,e){var n=w(t,e.options);if(null!=h.timeformat)return d(n,h.timeformat,h.monthNames,h.dayNames);var o,i=e.options.tickSize&&"quarter"==e.options.tickSize[1]||e.options.minTickSize&&"quarter"==e.options.minTickSize[1];o="seconds"===h.timeBase?T:"microseconds"===h.timeBase?M:k;var a,r,s=e.tickSize[0]*o[e.tickSize[1]],l=e.max-e.min,c=h.twelveHourClock?" %p":"",u=h.twelveHourClock?"%I":"%H";if(a="seconds"===h.timeBase?1:"microseconds"===h.timeBase?1e6:1e3,s<o.second){var p=-Math.floor(Math.log10(s/a));-1<String(s).indexOf("25")&&p++,r="%S.%"+p+"s"}else r=s<o.minute?u+":%M:%S"+c:s<o.day?l<2*o.day?u+":%M"+c:"%b %d "+u+":%M"+c:s<o.month?"%b %d":i&&s<o.quarter||!i&&s<o.year?l<o.year?"%b":"%b %Y":i&&s<o.year?l<o.year?"Q%q":"Q%q %Y":"%Y";return d(n,r,h.monthNames,h.dayNames)})})})},options:{xaxis:{timezone:null,timeformat:null,twelveHourClock:!1,monthNames:null,timeBase:"seconds"},yaxis:{timeBase:"seconds"}},name:"time",version:"1.0"}),e.plot.formatDate=d,e.plot.dateGenerator=w,e.plot.dateTickGenerator=n,e.plot.makeUtcWrapper=a}(jQuery),function(n){function s(t,e,n,o,i,a){this.axisName=t,this.position=e,this.padding=n,this.placeholder=o,this.axisLabel=i,this.surface=a,this.width=0,this.height=0,this.elem=null}s.prototype.calculateSize=function(){var t=this.axisName+"Label",e=t+"Layer",n=t+" axisLabels",o=this.surface.getTextInfo(e,this.axisLabel,n);this.labelWidth=o.width,this.labelHeight=o.height,"left"===this.position||"right"===this.position?(this.width=this.labelHeight+this.padding,this.height=0):(this.width=0,this.height=this.labelHeight+this.padding)},s.prototype.transforms=function(t,e,n,o){var i,a,r=[];if(0===e&&0===n||((i=o.createSVGTransform()).setTranslate(e,n),r.push(i)),0!==t){a=o.createSVGTransform();var s=Math.round(this.labelWidth/2);a.setRotate(t,s,0),r.push(a)}return r},s.prototype.calculateOffsets=function(t){var e={x:0,y:0,degrees:0};return"bottom"===this.position?(e.x=t.left+t.width/2-this.labelWidth/2,e.y=t.top+t.height-this.labelHeight):"top"===this.position?(e.x=t.left+t.width/2-this.labelWidth/2,e.y=t.top):"left"===this.position?(e.degrees=-90,e.x=t.left-this.labelWidth/2,e.y=t.height/2+t.top):"right"===this.position&&(e.degrees=90,e.x=t.left+t.width-this.labelWidth/2,e.y=t.height/2+t.top),e.x=Math.round(e.x),e.y=Math.round(e.y),e},s.prototype.cleanup=function(){var t=this.axisName+"Label",e=t+"Layer",n=t+" axisLabels";this.surface.removeText(e,0,0,this.axisLabel,n)},s.prototype.draw=function(t){var e=this.axisName+"Label",n=e+"Layer",o=e+" axisLabels",i=this.calculateOffsets(t),a={position:"absolute",bottom:"",right:"",display:"inline-block","white-space":"nowrap"},r=this.surface.getSVGLayer(n),s=this.transforms(i.degrees,i.x,i.y,r.parentNode);this.surface.addText(n,0,0,this.axisLabel,o,void 0,void 0,void 0,void 0,s),this.surface.render(),Object.keys(a).forEach(function(t){r.style[t]=a[t]})},n.plot.plugins.push({init:function(t){t.hooks.processOptions.push(function(t,e){if(e.axisLabels.show){var r={};t.hooks.axisReserveSpace.push(function(t,e){var n=e.options,o=e.direction+e.n;if(e.labelHeight+=e.boxPosition.centerY,e.labelWidth+=e.boxPosition.centerX,n&&n.axisLabel&&e.show){var i=void 0===n.axisLabelPadding?2:n.axisLabelPadding,a=r[o];a||(a=new s(o,n.position,i,t.getPlaceholder()[0],n.axisLabel,t.getSurface()),r[o]=a),a.calculateSize(),e.labelHeight+=a.height,e.labelWidth+=a.width}}),t.hooks.draw.push(function(t,e){n.each(t.getAxes(),function(t,e){var n=e.options;if(n&&n.axisLabel&&e.show){var o=e.direction+e.n;r[o].draw(e.box)}})}),t.hooks.shutdown.push(function(t,e){for(var n in r)r[n].cleanup()})}})},options:{axisLabels:{show:!0}},name:"axisLabels",version:"3.0"})}(jQuery),function(S){S.plot.plugins.push({init:function(c){var T={first:{x:-1,y:-1},second:{x:-1,y:-1},show:!1,currentMode:"xy",active:!1},i=S.plot.uiConstants.SNAPPING_CONSTANT,n={};function o(t){T.active&&(p(t),c.getPlaceholder().trigger("plotselecting",[e()]))}function a(t){var e=c.getOptions();1===t.which&&null!==e.selection.mode&&(T.currentMode="xy",document.body.focus(),void 0!==document.onselectstart&&null==n.onselectstart&&(n.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!==document.ondrag&&null==n.ondrag&&(n.ondrag=document.ondrag,document.ondrag=function(){return!1}),u(T.first,t),T.active=!0)}function r(t){return void 0!==document.onselectstart&&(document.onselectstart=n.onselectstart),void 0!==document.ondrag&&(document.ondrag=n.ondrag),T.active=!1,p(t),M()?s():(c.getPlaceholder().trigger("plotunselected",[]),c.getPlaceholder().trigger("plotselecting",[null])),!1}function e(){if(!M())return null;if(!T.show)return null;var i={},a={x:T.first.x,y:T.first.y},r={x:T.second.x,y:T.second.y};return"x"===k(c)&&(a.y=0,r.y=c.height()),"y"===k(c)&&(a.x=0,r.x=c.width()),S.each(c.getAxes(),function(t,e){if(e.used){var n=e.c2p(a[e.direction]),o=e.c2p(r[e.direction]);i[t]={from:Math.min(n,o),to:Math.max(n,o)}}}),i}function s(){var t=e();c.getPlaceholder().trigger("plotselected",[t]),t.xaxis&&t.yaxis&&c.getPlaceholder().trigger("selected",[{x1:t.xaxis.from,y1:t.yaxis.from,x2:t.xaxis.to,y2:t.yaxis.to}])}function l(t,e,n){return e<t?t:n<e?n:e}function k(t){var e=t.getOptions();return"smart"===e.selection.mode?T.currentMode:e.selection.mode}function u(t,e){var n=c.getPlaceholder().offset(),o=c.getPlotOffset();t.x=l(0,e.pageX-n.left-o.left,c.width()),t.y=l(0,e.pageY-n.top-o.top,c.height()),t!==T.first&&function(t){if(T.first){var e={x:t.x-T.first.x,y:t.y-T.first.y};Math.abs(e.x)<i?T.currentMode="y":Math.abs(e.y)<i?T.currentMode="x":T.currentMode="xy"}}(t),"y"===k(c)&&(t.x=t===T.first?0:c.width()),"x"===k(c)&&(t.y=t===T.first?0:c.height())}function p(t){null!=t.pageX&&(u(T.second,t),M()?(T.show=!0,c.triggerRedrawOverlay()):h(!0))}function h(t){T.show&&(T.show=!1,T.currentMode="",c.triggerRedrawOverlay(),t||c.getPlaceholder().trigger("plotunselected",[]))}function d(t,e){var n,o,i,a,r=c.getAxes();for(var s in r)if((n=r[s]).direction===e&&(t[a=e+n.n+"axis"]||1!==n.n||(a=e+"axis"),t[a])){o=t[a].from,i=t[a].to;break}if(t[a]||(n="x"===e?c.getXAxes()[0]:c.getYAxes()[0],o=t[e+"1"],i=t[e+"2"]),null!=o&&null!=i&&i<o){var l=o;o=i,i=l}return{from:o,to:i,axis:n}}function M(){var t=c.getOptions().selection.minSize;return Math.abs(T.second.x-T.first.x)>=t&&Math.abs(T.second.y-T.first.y)>=t}c.clearSelection=h,c.setSelection=function(t,e){var n;"y"===k(c)?(T.first.x=0,T.second.x=c.width()):(n=d(t,"x"),T.first.x=n.axis.p2c(n.from),T.second.x=n.axis.p2c(n.to)),"x"===k(c)?(T.first.y=0,T.second.y=c.height()):(n=d(t,"y"),T.first.y=n.axis.p2c(n.from),T.second.y=n.axis.p2c(n.to)),T.show=!0,c.triggerRedrawOverlay(),!e&&M()&&s()},c.getSelection=e,c.hooks.bindEvents.push(function(t,e){null!=t.getOptions().selection.mode&&(t.addEventHandler("dragstart",a,e,0),t.addEventHandler("drag",o,e,0),t.addEventHandler("dragend",r,e,0))}),c.hooks.drawOverlay.push(function(t,e){if(T.show&&M()){var n=t.getPlotOffset(),o=t.getOptions();e.save(),e.translate(n.left,n.top);var i=S.color.parse(o.selection.color),a=o.selection.visualization,r=1;"fill"===a&&(r=.8),e.strokeStyle=i.scale("a",r).toString(),e.lineWidth=1,e.lineJoin=o.selection.shape,e.fillStyle=i.scale("a",.4).toString();var s=Math.min(T.first.x,T.second.x)+.5,l=s,c=Math.min(T.first.y,T.second.y)+.5,u=c,p=Math.abs(T.second.x-T.first.x)-1,h=Math.abs(T.second.y-T.first.y)-1;"x"===k(t)&&(h+=c,c=0),"y"===k(t)&&(p+=s,s=0),"fill"===a?(e.fillRect(s,c,p,h),e.strokeRect(s,c,p,h)):(e.fillRect(0,0,t.width(),t.height()),e.clearRect(s,c,p,h),d=e,f=s,m=c,g=p,x=h,v=l,b=u,y=k(t),w=Math.max(0,Math.min(15,g/2-2,x/2-2)),d.fillStyle="#ffffff","xy"===y&&(d.beginPath(),d.moveTo(f,m+w),d.lineTo(f-3,m+w),d.lineTo(f-3,m-3),d.lineTo(f+w,m-3),d.lineTo(f+w,m),d.lineTo(f,m),d.closePath(),d.moveTo(f,m+x-w),d.lineTo(f-3,m+x-w),d.lineTo(f-3,m+x+3),d.lineTo(f+w,m+x+3),d.lineTo(f+w,m+x),d.lineTo(f,m+x),d.closePath(),d.moveTo(f+g,m+w),d.lineTo(f+g+3,m+w),d.lineTo(f+g+3,m-3),d.lineTo(f+g-w,m-3),d.lineTo(f+g-w,m),d.lineTo(f+g,m),d.closePath(),d.moveTo(f+g,m+x-w),d.lineTo(f+g+3,m+x-w),d.lineTo(f+g+3,m+x+3),d.lineTo(f+g-w,m+x+3),d.lineTo(f+g-w,m+x),d.lineTo(f+g,m+x),d.closePath(),d.stroke(),d.fill()),f=v,m=b,"x"===y&&(d.beginPath(),d.moveTo(f,m+15),d.lineTo(f,m-15),d.lineTo(f-3,m-15),d.lineTo(f-3,m+15),d.closePath(),d.moveTo(f+g,m+15),d.lineTo(f+g,m-15),d.lineTo(f+g+3,m-15),d.lineTo(f+g+3,m+15),d.closePath(),d.stroke(),d.fill()),"y"===y&&(d.beginPath(),d.moveTo(f-15,m),d.lineTo(f+15,m),d.lineTo(f+15,m-3),d.lineTo(f-15,m-3),d.closePath(),d.moveTo(f-15,m+x),d.lineTo(f+15,m+x),d.lineTo(f+15,m+x+3),d.lineTo(f-15,m+x+3),d.closePath(),d.stroke(),d.fill())),e.restore()}var d,f,m,g,x,v,b,y,w}),c.hooks.shutdown.push(function(t,e){e.unbind("dragstart",a),e.unbind("drag",o),e.unbind("dragend",r)})},options:{selection:{mode:null,visualization:"focus",color:"#888888",shape:"round",minSize:5}},name:"selection",version:"1.1"})}(jQuery),function(t){var e=-100,c=0,u=-1,p=-2,h=1,g=t.plot.browser,a=g.getPixelRatio;function n(t,e){var n=t.filter(r);h=a(e.getContext("2d"));var o,i=n.map(function(t){var f,m,e=new Image;return new Promise((m=t,(f=e).sourceDescription='<info className="'+m.className+'" tagName="'+m.tagName+'" id="'+m.id+'">',f.sourceComponent=m,function(e,t){var n,o,i,a,r,s,l,c,u,p,h,d;f.onload=function(t){f.successfullyLoaded=!0,e(f)},f.onabort=function(t){f.successfullyLoaded=!1,console.log("Can't generate temp image from "+f.sourceDescription+". It is possible that it is missing some properties or its content is not supported by this browser. Source component:",f.sourceComponent),e(f)},f.onerror=function(t){f.successfullyLoaded=!1,console.log("Can't generate temp image from "+f.sourceDescription+". It is possible that it is missing some properties or its content is not supported by this browser. Source component:",f.sourceComponent),e(f)},o=f,"CANVAS"===(n=m).tagName&&(i=n,o.src=i.toDataURL("image/png")),"svg"===n.tagName&&(a=n,r=o,g.isSafari()||g.isMobileSafari()?(s=a,l=r,p=b(p=v(x(document),s)),u=function(t){for(var e="",n=new Uint8Array(t),o=0;o<n.length;o+=16384){var i=String.fromCharCode.apply(null,n.subarray(o,o+16384));e+=i}return e}(new(TextEncoder||TextEncoderLite)("utf-8").encode(p)),c="data:image/svg+xml;base64,"+btoa(u),l.src=c):function(t,e){var n=v(x(document),t);n=b(n);var o=new Blob([n],{type:"image/svg+xml;charset=utf-8"}),i=(self.URL||self.webkitURL||self).createObjectURL(o);e.src=i}(a,r)),o.srcImgTagName=n.tagName,h=n,(d=o).genLeft=h.getBoundingClientRect().left,d.genTop=h.getBoundingClientRect().top,"CANVAS"===h.tagName&&(d.genRight=d.genLeft+h.width,d.genBottom=d.genTop+h.height),"svg"===h.tagName&&(d.genRight=h.getBoundingClientRect().right,d.genBottom=h.getBoundingClientRect().bottom)}))});return Promise.all(i).then((o=e,function(t){var e=function(t,e){var n=function(t,e){var n,o=c;if(0===t.length)o=u;else{var i=t[0].genLeft,a=t[0].genTop,r=t[0].genRight,s=t[0].genBottom,l=0;for(l=1;l<t.length;l++)i>t[l].genLeft&&(i=t[l].genLeft),a>t[l].genTop&&(a=t[l].genTop);for(l=1;l<t.length;l++)r<t[l].genRight&&(r=t[l].genRight),s<t[l].genBottom&&(s=t[l].genBottom);if(r-i<=0||s-a<=0)o=p;else{for(e.width=Math.round(r-i),e.height=Math.round(s-a),l=0;l<t.length;l++)t[l].xCompOffset=t[l].genLeft-i,t[l].yCompOffset=t[l].genTop-a;n=e,void 0!==t.find(function(t){return"svg"===t.srcImgTagName})&&h<1&&(n.width=n.width*h,n.height=n.height*h)}}return o}(t,e);if(n===c)for(var o=e.getContext("2d"),i=0;i<t.length;i++)!0===t[i].successfullyLoaded&&o.drawImage(t[i],t[i].xCompOffset*h,t[i].yCompOffset*h);return n}(t,o);return e}),s)}function r(t){var e=!0,n=!0;return null==t?n=!1:"CANVAS"===t.tagName&&(t.getBoundingClientRect().right!==t.getBoundingClientRect().left&&t.getBoundingClientRect().bottom!==t.getBoundingClientRect().top||(e=!1)),n&&e&&"visible"===window.getComputedStyle(t).visibility}function x(t){for(var e=t.styleSheets,n=[],o=0;o<e.length;o++)try{for(var i=e[o].cssRules||[],a=0;a<i.length;a++){var r=i[a];n.push(r.cssText)}}catch(t){console.log("Failed to get some css rules")}return n}function v(t,e){return['<svg class="snapshot '+e.classList+'" width="'+e.width.baseVal.value*h+'" height="'+e.height.baseVal.value*h+'" viewBox="0 0 '+e.width.baseVal.value+" "+e.height.baseVal.value+'" xmlns="http://www.w3.org/2000/svg">',"<style>","/* <![CDATA[ */",t.join("\n"),"/* ]]> */","</style>",e.innerHTML,"</svg>"].join("\n")}function b(t){var e="";return t.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)||(e=t.replace(/^<svg/,'<svg xmlns="http://www.w3.org/2000/svg"')),t.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)||(e=t.replace(/^<svg/,'<svg xmlns:xlink="http://www.w3.org/1999/xlink"')),'<?xml version="1.0" standalone="no"?>\r\n'+e}function s(){return e}t.plot.composeImages=n,t.plot.plugins.push({init:function(t){t.composeImages=n},name:"composeImages",version:"1.0"})}(jQuery),function(M){function S(t){var e="",n=t.name,o=t.xPos,i=t.yPos,a=t.fillColor,r=t.strokeColor,s=t.strokeWidth;switch(n){case"circle":e='<use xlink:href="#circle" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;case"diamond":e='<use xlink:href="#diamond" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;case"cross":e='<use xlink:href="#cross" class="legendIcon" x="'+o+'" y="'+i+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;case"rectangle":e='<use xlink:href="#rectangle" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;case"plus":e='<use xlink:href="#plus" class="legendIcon" x="'+o+'" y="'+i+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;case"bar":e='<use xlink:href="#bars" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" width="1.5em" height="1.5em"/>';break;case"area":e='<use xlink:href="#area" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" width="1.5em" height="1.5em"/>';break;case"line":e='<use xlink:href="#line" class="legendIcon" x="'+o+'" y="'+i+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>';break;default:e='<use xlink:href="#circle" class="legendIcon" x="'+o+'" y="'+i+'" fill="'+a+'" stroke="'+r+'" stroke-width="'+s+'" width="1.5em" height="1.5em"/>'}return e}var C='<defs><symbol id="line" fill="none" viewBox="-5 -5 25 25"><polyline points="0,15 5,5 10,10 15,0"/></symbol><symbol id="area" stroke-width="1" viewBox="-5 -5 25 25"><polyline points="0,15 5,5 10,10 15,0, 15,15, 0,15"/></symbol><symbol id="bars" stroke-width="1" viewBox="-5 -5 25 25"><polyline points="1.5,15.5 1.5,12.5, 4.5,12.5 4.5,15.5 6.5,15.5 6.5,3.5, 9.5,3.5 9.5,15.5 11.5,15.5 11.5,7.5 14.5,7.5 14.5,15.5 1.5,15.5"/></symbol><symbol id="circle" viewBox="-5 -5 25 25"><circle cx="0" cy="15" r="2.5"/><circle cx="5" cy="5" r="2.5"/><circle cx="10" cy="10" r="2.5"/><circle cx="15" cy="0" r="2.5"/></symbol><symbol id="rectangle" viewBox="-5 -5 25 25"><rect x="-2.1" y="12.9" width="4.2" height="4.2"/><rect x="2.9" y="2.9" width="4.2" height="4.2"/><rect x="7.9" y="7.9" width="4.2" height="4.2"/><rect x="12.9" y="-2.1" width="4.2" height="4.2"/></symbol><symbol id="diamond" viewBox="-5 -5 25 25"><path d="M-3,15 L0,12 L3,15, L0,18 Z"/><path d="M2,5 L5,2 L8,5, L5,8 Z"/><path d="M7,10 L10,7 L13,10, L10,13 Z"/><path d="M12,0 L15,-3 L18,0, L15,3 Z"/></symbol><symbol id="cross" fill="none" viewBox="-5 -5 25 25"><path d="M-2.1,12.9 L2.1,17.1, M2.1,12.9 L-2.1,17.1 Z"/><path d="M2.9,2.9 L7.1,7.1 M7.1,2.9 L2.9,7.1 Z"/><path d="M7.9,7.9 L12.1,12.1 M12.1,7.9 L7.9,12.1 Z"/><path d="M12.9,-2.1 L17.1,2.1 M17.1,-2.1 L12.9,2.1 Z"/></symbol><symbol id="plus" fill="none" viewBox="-5 -5 25 25"><path d="M0,12 L0,18, M-3,15 L3,15 Z"/><path d="M5,2 L5,8 M2,5 L8,5 Z"/><path d="M10,7 L10,13 M7,10 L13,10 Z"/><path d="M15,-3 L15,3 M12,0 L18,0 Z"/></symbol></defs>';function l(t,e){for(var n in t)if(t.hasOwnProperty(n)&&t[n]!==e[n])return!0;return!1}M.plot.plugins.push({init:function(t){t.hooks.setupGrid.push(function(t){var e=t.getOptions(),n=t.getData(),o=e.legend.labelFormatter,i=e.legend.legendEntries,a=e.legend.plotOffset,r=function(t,e,n){var a=e,o=t.reduce(function(t,e,n){var o=a?a(e.label,e):e.label;if(!e.hasOwnProperty("label")||o){var i={label:o||"Plot "+(n+1),color:e.color,options:{lines:e.lines,points:e.points,bars:e.bars}};t.push(i)}return t},[]);if(n)if(M.isFunction(n))o.sort(n);else if("reverse"===n)o.reverse();else{var i="descending"!==n;o.sort(function(t,e){return t.label===e.label?0:t.label<e.label!==i?1:-1})}return o}(n,o,e.legend.sorted),s=t.getPlotOffset();(function(t,e){if(!t||!e)return!0;if(t.length!==e.length)return!0;var n,o,i;for(n=0;n<e.length;n++){if(o=e[n],i=t[n],o.label!==i.label)return!0;if(o.color!==i.color)return!0;if(l(o.options.lines,i.options.lines))return!0;if(l(o.options.points,i.options.points))return!0;if(l(o.options.bars,i.options.bars))return!0}return!1}(i,r)||l(a,s))&&function(t,e,n,o){if(null!=e.legend.container?M(e.legend.container).html(""):n.find(".legend").remove(),e.legend.show){var i,a,r,s,l=e.legend.legendEntries=o,c=e.legend.plotOffset=t.getPlotOffset(),u=[],p=0,h="",d=e.legend.position,f=e.legend.margin,m={name:"",label:"",xPos:"",yPos:""};u[p++]='<svg class="legendLayer" style="width:inherit;height:inherit;">',u[p++]='<rect class="background" width="100%" height="100%"/>',u[p++]=C;var g=0,x=[],v=window.getComputedStyle(document.querySelector("body"));for(s=0;s<l.length;++s){var b=s%e.legend.noColumns;i=l[s],m.label=i.label;var y=t.getSurface().getTextInfo("",m.label,{style:v.fontStyle,variant:v.fontVariant,weight:v.fontWeight,size:parseInt(v.fontSize),lineHeight:parseInt(v.lineHeight),family:v.fontFamily}).width;x[b]?y>x[b]&&(x[b]=y+48):x[b]=y+48}for(s=0;s<l.length;++s)b=s%e.legend.noColumns,i=l[s],r="",m.label=i.label,m.xPos=g+3+"px",g+=x[b],(s+1)%e.legend.noColumns==0&&(g=0),m.yPos=1.5*Math.floor(s/e.legend.noColumns)+"em",i.options.lines.show&&i.options.lines.fill&&(m.name="area",m.fillColor=i.color,r+=S(m)),i.options.bars.show&&(m.name="bar",m.fillColor=i.color,r+=S(m)),i.options.lines.show&&!i.options.lines.fill&&(m.name="line",m.strokeColor=i.color,m.strokeWidth=i.options.lines.lineWidth,r+=S(m)),i.options.points.show&&(m.name=i.options.points.symbol,m.strokeColor=i.color,m.fillColor=i.options.points.fillColor,m.strokeWidth=i.options.points.lineWidth,r+=S(m)),a='<text x="'+m.xPos+'" y="'+m.yPos+'" text-anchor="start"><tspan dx="2em" dy="1.2em">'+m.label+"</tspan></text>",u[p++]="<g>"+r+a+"</g>";u[p++]="</svg>",null==f[0]&&(f=[f,f]),"n"===d.charAt(0)?h+="top:"+(f[1]+c.top)+"px;":"s"===d.charAt(0)&&(h+="bottom:"+(f[1]+c.bottom)+"px;"),"e"===d.charAt(1)?h+="right:"+(f[0]+c.right)+"px;":"w"===d.charAt(1)&&(h+="left:"+(f[0]+c.left)+"px;");var w=6;for(s=0;s<x.length;++s)w+=x[s];var T,k=1.6*Math.ceil(l.length/e.legend.noColumns);e.legend.container?(T=M(u.join("")).appendTo(e.legend.container)[0],e.legend.container.style.width=w+"px",e.legend.container.style.height=k+"em"):((T=M('<div class="legend" style="position:absolute;'+h+'">'+u.join("")+"</div>").appendTo(n)).css("width",w+"px"),T.css("height",k+"em"),T.css("pointerEvents","none"))}}(t,e,t.getPlaceholder(),r)})},options:{legend:{show:!1,noColumns:1,labelFormatter:null,container:null,position:"ne",margin:5,sorted:null}},name:"legend",version:"1.0"})}(jQuery);
//# sourceMappingURL=jquery.flot.js.map

/* eslint-disable */
/* Flot plugin for automatically redrawing plots as the placeholder resizes.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

It works by listening for changes on the placeholder div (through the jQuery
resize event plugin) - if the size changes, it will redraw the plot.

There are no options. If you need to disable the plugin for some plots, you
can just fix the size of their placeholders.

*/

/* Inline dependency:
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,t){"$:nomunge";var i=[],n=$.resize=$.extend($.resize,{}),a,r=false,s="setTimeout",u="resize",m=u+"-special-event",o="pendingDelay",l="activeDelay",f="throttleWindow";n[o]=200;n[l]=20;n[f]=true;$.event.special[u]={setup:function(){if(!n[f]&&this[s]){return false}var e=$(this);i.push(this);e.data(m,{w:e.width(),h:e.height()});if(i.length===1){a=t;h()}},teardown:function(){if(!n[f]&&this[s]){return false}var e=$(this);for(var t=i.length-1;t>=0;t--){if(i[t]==this){i.splice(t,1);break}}e.removeData(m);if(!i.length){if(r){cancelAnimationFrame(a)}else{clearTimeout(a)}a=null}},add:function(e){if(!n[f]&&this[s]){return false}var i;function a(e,n,a){var r=$(this),s=r.data(m)||{};s.w=n!==t?n:r.width();s.h=a!==t?a:r.height();i.apply(this,arguments)}if($.isFunction(e)){i=e;return a}else{i=e.handler;e.handler=a}}};function h(t){if(r===true){r=t||1}for(var s=i.length-1;s>=0;s--){var l=$(i[s]);if(l[0]==e||l.is(":visible")){var f=l.width(),c=l.height(),d=l.data(m);if(d&&(f!==d.w||c!==d.h)){l.trigger(u,[d.w=f,d.h=c]);r=t||true}}else{d=l.data(m);d.w=0;d.h=0}}if(a!==null){if(r&&(t==null||t-r<1e3)){a=e.requestAnimationFrame(h)}else{a=setTimeout(h,n[o]);r=false}}}if(!e.requestAnimationFrame){e.requestAnimationFrame=function(){return e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t,i){return e.setTimeout(function(){t((new Date).getTime())},n[l])}}()}if(!e.cancelAnimationFrame){e.cancelAnimationFrame=function(){return e.webkitCancelRequestAnimationFrame||e.mozCancelRequestAnimationFrame||e.oCancelRequestAnimationFrame||e.msCancelRequestAnimationFrame||clearTimeout}()}})(jQuery,this);

/* eslint-enable */
(function ($) {
    var options = { }; // no options

    function init(plot) {
        function onResize() {
            var placeholder = plot.getPlaceholder();

            // somebody might have hidden us and we can't plot
            // when we don't have the dimensions
            if (placeholder.width() === 0 || placeholder.height() === 0) return;

            plot.resize();
            plot.setupGrid();
            plot.draw();
        }

        function bindEvents(plot, eventHolder) {
            plot.getPlaceholder().resize(onResize);
        }

        function shutdown(plot, eventHolder) {
            plot.getPlaceholder().unbind("resize", onResize);
        }

        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'resize',
        version: '1.0'
    });
})(jQuery);

/* Flot plugin for plotting textual data or categories.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

Consider a dataset like [["February", 34], ["March", 20], ...]. This plugin
allows you to plot such a dataset directly.

To enable it, you must specify mode: "categories" on the axis with the textual
labels, e.g.

    $.plot("#placeholder", data, { xaxis: { mode: "categories" } });

By default, the labels are ordered as they are met in the data series. If you
need a different ordering, you can specify "categories" on the axis options
and list the categories there:

    xaxis: {
        mode: "categories",
        categories: ["February", "March", "April"]
    }

If you need to customize the distances between the categories, you can specify
"categories" as an object mapping labels to values

    xaxis: {
        mode: "categories",
        categories: { "February": 1, "March": 3, "April": 4 }
    }

If you don't specify all categories, the remaining categories will be numbered
from the max value plus 1 (with a spacing of 1 between each).

Internally, the plugin works by transforming the input data through an auto-
generated mapping where the first category becomes 0, the second 1, etc.
Hence, a point like ["February", 34] becomes [0, 34] internally in Flot (this
is visible in hover and click events that return numbers rather than the
category labels). The plugin also overrides the tick generator to spit out the
categories as ticks instead of the values.

If you need to map a value back to its label, the mapping is always accessible
as "categories" on the axis object, e.g. plot.getAxes().xaxis.categories.

*/

(function ($) {
    var options = {
        xaxis: {
            categories: null
        },
        yaxis: {
            categories: null
        }
    };

    function processRawData(plot, series, data, datapoints) {
        // if categories are enabled, we need to disable
        // auto-transformation to numbers so the strings are intact
        // for later processing

        var xCategories = series.xaxis.options.mode === "categories",
            yCategories = series.yaxis.options.mode === "categories";

        if (!(xCategories || yCategories)) {
            return;
        }

        var format = datapoints.format;

        if (!format) {
            // FIXME: auto-detection should really not be defined here
            var s = series;
            format = [];
            format.push({ x: true, number: true, required: true, computeRange: true});
            format.push({ y: true, number: true, required: true, computeRange: true });

            if (s.bars.show || (s.lines.show && s.lines.fill)) {
                var autoScale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                format.push({ y: true, number: true, required: false, defaultValue: 0, computeRange: autoScale });
                if (s.bars.horizontal) {
                    delete format[format.length - 1].y;
                    format[format.length - 1].x = true;
                }
            }

            datapoints.format = format;
        }

        for (var m = 0; m < format.length; ++m) {
            if (format[m].x && xCategories) {
                format[m].number = false;
            }

            if (format[m].y && yCategories) {
                format[m].number = false;
                format[m].computeRange = false;
            }
        }
    }

    function getNextIndex(categories) {
        var index = -1;

        for (var v in categories) {
            if (categories[v] > index) {
                index = categories[v];
            }
        }

        return index + 1;
    }

    function categoriesTickGenerator(axis) {
        var res = [];
        for (var label in axis.categories) {
            var v = axis.categories[label];
            if (v >= axis.min && v <= axis.max) {
                res.push([v, label]);
            }
        }

        res.sort(function (a, b) { return a[0] - b[0]; });

        return res;
    }

    function setupCategoriesForAxis(series, axis, datapoints) {
        if (series[axis].options.mode !== "categories") {
            return;
        }

        if (!series[axis].categories) {
            // parse options
            var c = {}, o = series[axis].options.categories || {};
            if ($.isArray(o)) {
                for (var i = 0; i < o.length; ++i) {
                    c[o[i]] = i;
                }
            } else {
                for (var v in o) {
                    c[v] = o[v];
                }
            }

            series[axis].categories = c;
        }

        // fix ticks
        if (!series[axis].options.ticks) {
            series[axis].options.ticks = categoriesTickGenerator;
        }

        transformPointsOnAxis(datapoints, axis, series[axis].categories);
    }

    function transformPointsOnAxis(datapoints, axis, categories) {
        // go through the points, transforming them
        var points = datapoints.points,
            ps = datapoints.pointsize,
            format = datapoints.format,
            formatColumn = axis.charAt(0),
            index = getNextIndex(categories);

        for (var i = 0; i < points.length; i += ps) {
            if (points[i] == null) {
                continue;
            }

            for (var m = 0; m < ps; ++m) {
                var val = points[i + m];

                if (val == null || !format[m][formatColumn]) {
                    continue;
                }

                if (!(val in categories)) {
                    categories[val] = index;
                    ++index;
                }

                points[i + m] = categories[val];
            }
        }
    }

    function processDatapoints(plot, series, datapoints) {
        setupCategoriesForAxis(series, "xaxis", datapoints);
        setupCategoriesForAxis(series, "yaxis", datapoints);
    }

    function init(plot) {
        plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(processDatapoints);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'categories',
        version: '1.0'
    });
})(jQuery);

/* Flot plugin for rendering pie charts.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes that each series has a single data value, and that each
value is a positive integer or zero.  Negative numbers don't make sense for a
pie chart, and have unpredictable results.  The values do NOT need to be
passed in as percentages; the plugin will calculate the total and per-slice
percentages internally.

* Created by Brian Medendorp

* Updated with contributions from btburnett3, Anthony Aragues and Xavi Ivars

The plugin supports these options:

    series: {
        pie: {
            show: true/false
            radius: 0-1 for percentage of fullsize, or a specified pixel length, or 'auto'
            innerRadius: 0-1 for percentage of fullsize or a specified pixel length, for creating a donut effect
            startAngle: 0-2 factor of PI used for starting angle (in radians) i.e 3/2 starts at the top, 0 and 2 have the same result
            tilt: 0-1 for percentage to tilt the pie, where 1 is no tilt, and 0 is completely flat (nothing will show)
            offset: {
                top: integer value to move the pie up or down
                left: integer value to move the pie left or right, or 'auto'
            },
            stroke: {
                color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#FFF')
                width: integer pixel width of the stroke
            },
            label: {
                show: true/false, or 'auto'
                formatter:  a user-defined function that modifies the text/style of the label text
                radius: 0-1 for percentage of fullsize, or a specified pixel length
                background: {
                    color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#000')
                    opacity: 0-1
                },
                threshold: 0-1 for the percentage value at which to hide labels (if they're too small)
            },
            combine: {
                threshold: 0-1 for the percentage value at which to combine slices (if they're too small)
                color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#CCC'), if null, the plugin will automatically use the color of the first slice to be combined
                label: any text value of what the combined slice should be labeled
            }
            highlight: {
                opacity: 0-1
            }
        }
    }

More detail and specific examples can be found in the included HTML file.

*/

(function($) {
    // Maximum redraw attempts when fitting labels within the plot

    var REDRAW_ATTEMPTS = 10;

    // Factor by which to shrink the pie when fitting labels within the plot

    var REDRAW_SHRINK = 0.95;

    function init(plot) {
        var canvas = null,
            target = null,
            options = null,
            maxRadius = null,
            centerLeft = null,
            centerTop = null,
            processed = false,
            ctx = null;

        // interactive variables

        var highlights = [];

        // add hook to determine if pie plugin in enabled, and then perform necessary operations

        plot.hooks.processOptions.push(function(plot, options) {
            if (options.series.pie.show) {
                options.grid.show = false;

                // set labels.show

                if (options.series.pie.label.show === "auto") {
                    if (options.legend.show) {
                        options.series.pie.label.show = false;
                    } else {
                        options.series.pie.label.show = true;
                    }
                }

                // set radius

                if (options.series.pie.radius === "auto") {
                    if (options.series.pie.label.show) {
                        options.series.pie.radius = 3 / 4;
                    } else {
                        options.series.pie.radius = 1;
                    }
                }

                // ensure sane tilt

                if (options.series.pie.tilt > 1) {
                    options.series.pie.tilt = 1;
                } else if (options.series.pie.tilt < 0) {
                    options.series.pie.tilt = 0;
                }
            }
        });

        plot.hooks.bindEvents.push(function(plot, eventHolder) {
            var options = plot.getOptions();
            if (options.series.pie.show) {
                if (options.grid.hoverable) {
                    eventHolder.unbind("mousemove").mousemove(onMouseMove);
                }
                if (options.grid.clickable) {
                    eventHolder.unbind("click").click(onClick);
                }
            }
        });

        plot.hooks.processDatapoints.push(function(plot, series, data, datapoints) {
            var options = plot.getOptions();
            if (options.series.pie.show) {
                processDatapoints(plot, series, data, datapoints);
            }
        });

        plot.hooks.drawOverlay.push(function(plot, octx) {
            var options = plot.getOptions();
            if (options.series.pie.show) {
                drawOverlay(plot, octx);
            }
        });

        plot.hooks.draw.push(function(plot, newCtx) {
            var options = plot.getOptions();
            if (options.series.pie.show) {
                draw(plot, newCtx);
            }
        });

        function processDatapoints(plot, series, datapoints) {
            if (!processed) {
                processed = true;
                canvas = plot.getCanvas();
                target = $(canvas).parent();
                options = plot.getOptions();
                plot.setData(combine(plot.getData()));
            }
        }

        function combine(data) {
            var total = 0,
                combined = 0,
                numCombined = 0,
                color = options.series.pie.combine.color,
                newdata = [],
                i,
                value;

            // Fix up the raw data from Flot, ensuring the data is numeric

            for (i = 0; i < data.length; ++i) {
                value = data[i].data;

                // If the data is an array, we'll assume that it's a standard
                // Flot x-y pair, and are concerned only with the second value.

                // Note how we use the original array, rather than creating a
                // new one; this is more efficient and preserves any extra data
                // that the user may have stored in higher indexes.

                if ($.isArray(value) && value.length === 1) {
                    value = value[0];
                }

                if ($.isArray(value)) {
                    // Equivalent to $.isNumeric() but compatible with jQuery < 1.7
                    if (!isNaN(parseFloat(value[1])) && isFinite(value[1])) {
                        value[1] = +value[1];
                    } else {
                        value[1] = 0;
                    }
                } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    value = [1, +value];
                } else {
                    value = [1, 0];
                }

                data[i].data = [value];
            }

            // Sum up all the slices, so we can calculate percentages for each

            for (i = 0; i < data.length; ++i) {
                total += data[i].data[0][1];
            }

            // Count the number of slices with percentages below the combine
            // threshold; if it turns out to be just one, we won't combine.

            for (i = 0; i < data.length; ++i) {
                value = data[i].data[0][1];
                if (value / total <= options.series.pie.combine.threshold) {
                    combined += value;
                    numCombined++;
                    if (!color) {
                        color = data[i].color;
                    }
                }
            }

            for (i = 0; i < data.length; ++i) {
                value = data[i].data[0][1];
                if (numCombined < 2 || value / total > options.series.pie.combine.threshold) {
                    newdata.push(
                        $.extend(data[i], {     /* extend to allow keeping all other original data values
                                                   and using them e.g. in labelFormatter. */
                            data: [[1, value]],
                            color: data[i].color,
                            label: data[i].label,
                            angle: value * Math.PI * 2 / total,
                            percent: value / (total / 100)
                        })
                    );
                }
            }

            if (numCombined > 1) {
                newdata.push({
                    data: [[1, combined]],
                    color: color,
                    label: options.series.pie.combine.label,
                    angle: combined * Math.PI * 2 / total,
                    percent: combined / (total / 100)
                });
            }

            return newdata;
        }

        function draw(plot, newCtx) {
            if (!target) {
                return; // if no series were passed
            }

            var canvasWidth = plot.getPlaceholder().width(),
                canvasHeight = plot.getPlaceholder().height(),
                legendWidth = target.children().filter(".legend").children().width() || 0;

            ctx = newCtx;

            // WARNING: HACK! REWRITE THIS CODE AS SOON AS POSSIBLE!

            // When combining smaller slices into an 'other' slice, we need to
            // add a new series.  Since Flot gives plugins no way to modify the
            // list of series, the pie plugin uses a hack where the first call
            // to processDatapoints results in a call to setData with the new
            // list of series, then subsequent processDatapoints do nothing.

            // The plugin-global 'processed' flag is used to control this hack;
            // it starts out false, and is set to true after the first call to
            // processDatapoints.

            // Unfortunately this turns future setData calls into no-ops; they
            // call processDatapoints, the flag is true, and nothing happens.

            // To fix this we'll set the flag back to false here in draw, when
            // all series have been processed, so the next sequence of calls to
            // processDatapoints once again starts out with a slice-combine.
            // This is really a hack; in 0.9 we need to give plugins a proper
            // way to modify series before any processing begins.

            processed = false;

            // calculate maximum radius and center point
            maxRadius = Math.min(canvasWidth, canvasHeight / options.series.pie.tilt) / 2;
            centerTop = canvasHeight / 2 + options.series.pie.offset.top;
            centerLeft = canvasWidth / 2;

            if (options.series.pie.offset.left === "auto") {
                if (options.legend.position.match("w")) {
                    centerLeft += legendWidth / 2;
                } else {
                    centerLeft -= legendWidth / 2;
                }
                if (centerLeft < maxRadius) {
                    centerLeft = maxRadius;
                } else if (centerLeft > canvasWidth - maxRadius) {
                    centerLeft = canvasWidth - maxRadius;
                }
            } else {
                centerLeft += options.series.pie.offset.left;
            }

            var slices = plot.getData(),
                attempts = 0;

            // Keep shrinking the pie's radius until drawPie returns true,
            // indicating that all the labels fit, or we try too many times.
            do {
                if (attempts > 0) {
                    maxRadius *= REDRAW_SHRINK;
                }
                attempts += 1;
                clear();
                if (options.series.pie.tilt <= 0.8) {
                    drawShadow();
                }
            } while (!drawPie() && attempts < REDRAW_ATTEMPTS)

            if (attempts >= REDRAW_ATTEMPTS) {
                clear();
                target.prepend("<div class='error'>Could not draw pie with labels contained inside canvas</div>");
            }

            if (plot.setSeries && plot.insertLegend) {
                plot.setSeries(slices);
                plot.insertLegend();
            }

            // we're actually done at this point, just defining internal functions at this point
            function clear() {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                target.children().filter(".pieLabel, .pieLabelBackground").remove();
            }

            function drawShadow() {
                var shadowLeft = options.series.pie.shadow.left;
                var shadowTop = options.series.pie.shadow.top;
                var edge = 10;
                var alpha = options.series.pie.shadow.alpha;
                var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

                if (radius >= canvasWidth / 2 - shadowLeft || radius * options.series.pie.tilt >= canvasHeight / 2 - shadowTop || radius <= edge) {
                    return;    // shadow would be outside canvas, so don't draw it
                }

                ctx.save();
                ctx.translate(shadowLeft, shadowTop);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = "#000";

                // center and rotate to starting position
                ctx.translate(centerLeft, centerTop);
                ctx.scale(1, options.series.pie.tilt);

                //radius -= edge;
                for (var i = 1; i <= edge; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
                    ctx.fill();
                    radius -= i;
                }

                ctx.restore();
            }

            function drawPie() {
                var startAngle = Math.PI * options.series.pie.startAngle;
                var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;
                var i;
                // center and rotate to starting position

                ctx.save();
                ctx.translate(centerLeft, centerTop);
                ctx.scale(1, options.series.pie.tilt);
                //ctx.rotate(startAngle); // start at top; -- This doesn't work properly in Opera

                // draw slices
                ctx.save();

                var currentAngle = startAngle;
                for (i = 0; i < slices.length; ++i) {
                    slices[i].startAngle = currentAngle;
                    drawSlice(slices[i].angle, slices[i].color, true);
                }

                ctx.restore();

                // draw slice outlines
                if (options.series.pie.stroke.width > 0) {
                    ctx.save();
                    ctx.lineWidth = options.series.pie.stroke.width;
                    currentAngle = startAngle;
                    for (i = 0; i < slices.length; ++i) {
                        drawSlice(slices[i].angle, options.series.pie.stroke.color, false);
                    }

                    ctx.restore();
                }

                // draw donut hole
                drawDonutHole(ctx);

                ctx.restore();

                // Draw the labels, returning true if they fit within the plot
                if (options.series.pie.label.show) {
                    return drawLabels();
                } else return true;

                function drawSlice(angle, color, fill) {
                    if (angle <= 0 || isNaN(angle)) {
                        return;
                    }

                    if (fill) {
                        ctx.fillStyle = color;
                    } else {
                        ctx.strokeStyle = color;
                        ctx.lineJoin = "round";
                    }

                    ctx.beginPath();
                    if (Math.abs(angle - Math.PI * 2) > 0.000000001) {
                        ctx.moveTo(0, 0); // Center of the pie
                    }

                    //ctx.arc(0, 0, radius, 0, angle, false); // This doesn't work properly in Opera
                    ctx.arc(0, 0, radius, currentAngle, currentAngle + angle / 2, false);
                    ctx.arc(0, 0, radius, currentAngle + angle / 2, currentAngle + angle, false);
                    ctx.closePath();
                    //ctx.rotate(angle); // This doesn't work properly in Opera
                    currentAngle += angle;

                    if (fill) {
                        ctx.fill();
                    } else {
                        ctx.stroke();
                    }
                }

                function drawLabels() {
                    var currentAngle = startAngle;
                    var radius = options.series.pie.label.radius > 1 ? options.series.pie.label.radius : maxRadius * options.series.pie.label.radius;

                    for (var i = 0; i < slices.length; ++i) {
                        if (slices[i].percent >= options.series.pie.label.threshold * 100) {
                            if (!drawLabel(slices[i], currentAngle, i)) {
                                return false;
                            }
                        }
                        currentAngle += slices[i].angle;
                    }

                    return true;

                    function drawLabel(slice, startAngle, index) {
                        if (slice.data[0][1] === 0) {
                            return true;
                        }

                        // format label text
                        var lf = options.legend.labelFormatter, text, plf = options.series.pie.label.formatter;

                        if (lf) {
                            text = lf(slice.label, slice);
                        } else {
                            text = slice.label;
                        }

                        if (plf) {
                            text = plf(text, slice);
                        }

                        var halfAngle = ((startAngle + slice.angle) + startAngle) / 2;
                        var x = centerLeft + Math.round(Math.cos(halfAngle) * radius);
                        var y = centerTop + Math.round(Math.sin(halfAngle) * radius) * options.series.pie.tilt;

                        var html = "<span class='pieLabel' id='pieLabel" + index + "' style='position:absolute;top:" + y + "px;left:" + x + "px;'>" + text + "</span>";
                        target.append(html);

                        var label = target.children("#pieLabel" + index);
                        var labelTop = (y - label.height() / 2);
                        var labelLeft = (x - label.width() / 2);

                        label.css("top", labelTop);
                        label.css("left", labelLeft);

                        // check to make sure that the label is not outside the canvas
                        if (0 - labelTop > 0 || 0 - labelLeft > 0 || canvasHeight - (labelTop + label.height()) < 0 || canvasWidth - (labelLeft + label.width()) < 0) {
                            return false;
                        }

                        if (options.series.pie.label.background.opacity !== 0) {
                            // put in the transparent background separately to avoid blended labels and label boxes
                            var c = options.series.pie.label.background.color;
                            if (c == null) {
                                c = slice.color;
                            }

                            var pos = "top:" + labelTop + "px;left:" + labelLeft + "px;";
                            $("<div class='pieLabelBackground' style='position:absolute;width:" + label.width() + "px;height:" + label.height() + "px;" + pos + "background-color:" + c + ";'></div>")
                                .css("opacity", options.series.pie.label.background.opacity)
                                .insertBefore(label);
                        }

                        return true;
                    } // end individual label function
                } // end drawLabels function
            } // end drawPie function
        } // end draw function

        // Placed here because it needs to be accessed from multiple locations

        function drawDonutHole(layer) {
            if (options.series.pie.innerRadius > 0) {
                // subtract the center
                layer.save();
                var innerRadius = options.series.pie.innerRadius > 1 ? options.series.pie.innerRadius : maxRadius * options.series.pie.innerRadius;
                layer.globalCompositeOperation = "destination-out"; // this does not work with excanvas, but it will fall back to using the stroke color
                layer.beginPath();
                layer.fillStyle = options.series.pie.stroke.color;
                layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
                layer.fill();
                layer.closePath();
                layer.restore();

                // add inner stroke
                layer.save();
                layer.beginPath();
                layer.strokeStyle = options.series.pie.stroke.color;
                layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
                layer.stroke();
                layer.closePath();
                layer.restore();

                // TODO: add extra shadow inside hole (with a mask) if the pie is tilted.
            }
        }

        //-- Additional Interactive related functions --

        function isPointInPoly(poly, pt) {
            for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
                ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) ||
                (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) &&
                (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) &&
                (c = !c);
            }
            return c;
        }

        function findNearbySlice(mouseX, mouseY) {
            var slices = plot.getData(),
                options = plot.getOptions(),
                radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius,
                x, y;

            for (var i = 0; i < slices.length; ++i) {
                var s = slices[i];
                if (s.pie.show) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(0, 0); // Center of the pie
                    //ctx.scale(1, options.series.pie.tilt);    // this actually seems to break everything when here.
                    ctx.arc(0, 0, radius, s.startAngle, s.startAngle + s.angle / 2, false);
                    ctx.arc(0, 0, radius, s.startAngle + s.angle / 2, s.startAngle + s.angle, false);
                    ctx.closePath();
                    x = mouseX - centerLeft;
                    y = mouseY - centerTop;

                    if (ctx.isPointInPath) {
                        if (ctx.isPointInPath(mouseX - centerLeft, mouseY - centerTop)) {
                            ctx.restore();
                            return {
                                datapoint: [s.percent, s.data],
                                dataIndex: 0,
                                series: s,
                                seriesIndex: i
                            };
                        }
                    } else {
                        // excanvas for IE doesn;t support isPointInPath, this is a workaround.
                        var p1X = radius * Math.cos(s.startAngle),
                            p1Y = radius * Math.sin(s.startAngle),
                            p2X = radius * Math.cos(s.startAngle + s.angle / 4),
                            p2Y = radius * Math.sin(s.startAngle + s.angle / 4),
                            p3X = radius * Math.cos(s.startAngle + s.angle / 2),
                            p3Y = radius * Math.sin(s.startAngle + s.angle / 2),
                            p4X = radius * Math.cos(s.startAngle + s.angle / 1.5),
                            p4Y = radius * Math.sin(s.startAngle + s.angle / 1.5),
                            p5X = radius * Math.cos(s.startAngle + s.angle),
                            p5Y = radius * Math.sin(s.startAngle + s.angle),
                            arrPoly = [[0, 0], [p1X, p1Y], [p2X, p2Y], [p3X, p3Y], [p4X, p4Y], [p5X, p5Y]],
                            arrPoint = [x, y];

                        // TODO: perhaps do some mathmatical trickery here with the Y-coordinate to compensate for pie tilt?

                        if (isPointInPoly(arrPoly, arrPoint)) {
                            ctx.restore();
                            return {
                                datapoint: [s.percent, s.data],
                                dataIndex: 0,
                                series: s,
                                seriesIndex: i
                            };
                        }
                    }

                    ctx.restore();
                }
            }

            return null;
        }

        function onMouseMove(e) {
            triggerClickHoverEvent("plothover", e);
        }

        function onClick(e) {
            triggerClickHoverEvent("plotclick", e);
        }

        // trigger click or hover event (they send the same parameters so we share their code)

        function triggerClickHoverEvent(eventname, e) {
            var offset = plot.offset();
            var canvasX = parseInt(e.pageX - offset.left);
            var canvasY = parseInt(e.pageY - offset.top);
            var item = findNearbySlice(canvasX, canvasY);

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto === eventname && !(item && h.series === item.series)) {
                        unhighlight(h.series);
                    }
                }
            }

            // highlight the slice

            if (item) {
                highlight(item.series, eventname);
            }

            // trigger any hover bind events

            var pos = { pageX: e.pageX, pageY: e.pageY };
            target.trigger(eventname, [pos, item]);
        }

        function highlight(s, auto) {
            //if (typeof s == "number") {
            //    s = series[s];
            //}

            var i = indexOfHighlight(s);

            if (i === -1) {
                highlights.push({ series: s, auto: auto });
                plot.triggerRedrawOverlay();
            } else if (!auto) {
                highlights[i].auto = false;
            }
        }

        function unhighlight(s) {
            if (s == null) {
                highlights = [];
                plot.triggerRedrawOverlay();
            }

            //if (typeof s == "number") {
            //    s = series[s];
            //}

            var i = indexOfHighlight(s);

            if (i !== -1) {
                highlights.splice(i, 1);
                plot.triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series === s) {
                    return i;
                }
            }
            return -1;
        }

        function drawOverlay(plot, octx) {
            var options = plot.getOptions();
            var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

            octx.save();
            octx.translate(centerLeft, centerTop);
            octx.scale(1, options.series.pie.tilt);

            for (var i = 0; i < highlights.length; ++i) {
                drawHighlight(highlights[i].series);
            }

            drawDonutHole(octx);

            octx.restore();

            function drawHighlight(series) {
                if (series.angle <= 0 || isNaN(series.angle)) {
                    return;
                }

                //octx.fillStyle = parseColor(options.series.pie.highlight.color).scale(null, null, null, options.series.pie.highlight.opacity).toString();
                octx.fillStyle = "rgba(255, 255, 255, " + options.series.pie.highlight.opacity + ")"; // this is temporary until we have access to parseColor
                octx.beginPath();
                if (Math.abs(series.angle - Math.PI * 2) > 0.000000001) {
                    octx.moveTo(0, 0); // Center of the pie
                }
                octx.arc(0, 0, radius, series.startAngle, series.startAngle + series.angle / 2, false);
                octx.arc(0, 0, radius, series.startAngle + series.angle / 2, series.startAngle + series.angle, false);
                octx.closePath();
                octx.fill();
            }
        }
    } // end init (plugin body)

    // define pie specific options and their default values
    var options = {
        series: {
            pie: {
                show: false,
                radius: "auto",    // actual radius of the visible pie (based on full calculated radius if <=1, or hard pixel value)
                innerRadius: 0, /* for donut */
                startAngle: 3 / 2,
                tilt: 1,
                shadow: {
                    left: 5,    // shadow left offset
                    top: 15,    // shadow top offset
                    alpha: 0.02    // shadow alpha
                },
                offset: {
                    top: 0,
                    left: "auto"
                },
                stroke: {
                    color: "#fff",
                    width: 1
                },
                label: {
                    show: "auto",
                    formatter: function(label, slice) {
                        return "<div style='font-size:x-small;text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
                    },    // formatter function
                    radius: 1,    // radius at which to place the labels (based on full calculated radius if <=1, or hard pixel value)
                    background: {
                        color: null,
                        opacity: 0
                    },
                    threshold: 0    // percentage at which to hide the label (i.e. the slice is too narrow)
                },
                combine: {
                    threshold: -1,    // percentage at which to combine little slices into one larger slice
                    color: null,    // color to give the new slice (auto-generated if null)
                    label: "Other"    // label to give the new slice
                },
                highlight: {
                    //color: "#fff",        // will add this functionality once parseColor is available
                    opacity: 0.5
                }
            }
        }
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "pie",
        version: "1.1"
    });
})(jQuery);

/* Flot plugin for stacking data sets rather than overlaying them.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes the data is sorted on x (or y if stacking horizontally).
For line charts, it is assumed that if a line has an undefined gap (from a
null point), then the line above it should have the same gap - insert zeros
instead of "null" if you want another behaviour. This also holds for the start
and end of the chart. Note that stacking a mix of positive and negative values
in most instances doesn't make sense (so it looks weird).

Two or more series are stacked when their "stack" attribute is set to the same
key (which can be any number or string or just "true"). To specify the default
stack, you can set the stack option like this:

    series: {
        stack: null/false, true, or a key (number/string)
    }

You can also specify it for a single series, like this:

    $.plot( $("#placeholder"), [{
        data: [ ... ],
        stack: true
    }])

The stacking order is determined by the order of the data series in the array
(later series end up on top of the previous).

Internally, the plugin modifies the datapoints in each series, adding an
offset to the y value. For line series, extra data points are inserted through
interpolation. If there's a second y value, it's also adjusted (e.g for bar
charts or filled areas).

*/

(function ($) {
    var options = {
        series: { stack: null } // or number/string
    };

    function init(plot) {
        function findMatchingSeries(s, allseries) {
            var res = null;
            for (var i = 0; i < allseries.length; ++i) {
                if (s === allseries[i]) break;

                if (allseries[i].stack === s.stack) {
                    res = allseries[i];
                }
            }

            return res;
        }

        function addBottomPoints (s, datapoints) {
            var formattedPoints = [];
            for (var i = 0; i < datapoints.points.length; i += 2) {
                formattedPoints.push(datapoints.points[i]);
                formattedPoints.push(datapoints.points[i + 1]);
                formattedPoints.push(0);
            }

            datapoints.format.push({
                x: false,
                y: true,
                number: true,
                required: false,
                computeRange: s.yaxis.options.autoScale !== 'none',
                defaultValue: 0
            });
            datapoints.points = formattedPoints;
            datapoints.pointsize = 3;
        }

        function stackData(plot, s, datapoints) {
            if (s.stack == null || s.stack === false) return;

            var needsBottom = s.bars.show || (s.lines.show && s.lines.fill);
            var hasBottom = datapoints.pointsize > 2 && (horizontal ? datapoints.format[2].x : datapoints.format[2].y);
            // Series data is missing bottom points - need to format
            if (needsBottom && !hasBottom) {
                addBottomPoints(s, datapoints);
            }

            var other = findMatchingSeries(s, plot.getData());
            if (!other) return;

            var ps = datapoints.pointsize,
                points = datapoints.points,
                otherps = other.datapoints.pointsize,
                otherpoints = other.datapoints.points,
                newpoints = [],
                px, py, intery, qx, qy, bottom,
                withlines = s.lines.show,
                horizontal = s.bars.horizontal,
                withsteps = withlines && s.lines.steps,
                fromgap = true,
                keyOffset = horizontal ? 1 : 0,
                accumulateOffset = horizontal ? 0 : 1,
                i = 0, j = 0, l, m;

            while (true) {
                if (i >= points.length) break;

                l = newpoints.length;

                if (points[i] == null) {
                    // copy gaps
                    for (m = 0; m < ps; ++m) {
                        newpoints.push(points[i + m]);
                    }

                    i += ps;
                } else if (j >= otherpoints.length) {
                    // for lines, we can't use the rest of the points
                    if (!withlines) {
                        for (m = 0; m < ps; ++m) {
                            newpoints.push(points[i + m]);
                        }
                    }

                    i += ps;
                } else if (otherpoints[j] == null) {
                    // oops, got a gap
                    for (m = 0; m < ps; ++m) {
                        newpoints.push(null);
                    }

                    fromgap = true;
                    j += otherps;
                } else {
                    // cases where we actually got two points
                    px = points[i + keyOffset];
                    py = points[i + accumulateOffset];
                    qx = otherpoints[j + keyOffset];
                    qy = otherpoints[j + accumulateOffset];
                    bottom = 0;

                    if (px === qx) {
                        for (m = 0; m < ps; ++m) {
                            newpoints.push(points[i + m]);
                        }

                        newpoints[l + accumulateOffset] += qy;
                        bottom = qy;

                        i += ps;
                        j += otherps;
                    } else if (px > qx) {
                        // we got past point below, might need to
                        // insert interpolated extra point
                        if (withlines && i > 0 && points[i - ps] != null) {
                            intery = py + (points[i - ps + accumulateOffset] - py) * (qx - px) / (points[i - ps + keyOffset] - px);
                            newpoints.push(qx);
                            newpoints.push(intery + qy);
                            for (m = 2; m < ps; ++m) {
                                newpoints.push(points[i + m]);
                            }

                            bottom = qy;
                        }

                        j += otherps;
                    } else { // px < qx
                        if (fromgap && withlines) {
                            // if we come from a gap, we just skip this point
                            i += ps;
                            continue;
                        }

                        for (m = 0; m < ps; ++m) {
                            newpoints.push(points[i + m]);
                        }

                        // we might be able to interpolate a point below,
                        // this can give us a better y
                        if (withlines && j > 0 && otherpoints[j - otherps] != null) {
                            bottom = qy + (otherpoints[j - otherps + accumulateOffset] - qy) * (px - qx) / (otherpoints[j - otherps + keyOffset] - qx);
                        }

                        newpoints[l + accumulateOffset] += bottom;

                        i += ps;
                    }

                    fromgap = false;

                    if (l !== newpoints.length && needsBottom) {
                        newpoints[l + 2] += bottom;
                    }
                }

                // maintain the line steps invariant
                if (withsteps && l !== newpoints.length && l > 0 &&
                    newpoints[l] !== null &&
                    newpoints[l] !== newpoints[l - ps] &&
                    newpoints[l + 1] !== newpoints[l - ps + 1]) {
                    for (m = 0; m < ps; ++m) {
                        newpoints[l + ps + m] = newpoints[l + m];
                    }

                    newpoints[l + 1] = newpoints[l - ps + 1];
                }
            }

            datapoints.points = newpoints;
        }

        plot.hooks.processDatapoints.push(stackData);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stack',
        version: '1.2'
    });
})(jQuery);

/* Flot plugin for showing crosshairs when the mouse hovers over the plot.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

    crosshair: {
        mode: null or "x" or "y" or "xy"
        color: color
        lineWidth: number
    }

Set the mode to one of "x", "y" or "xy". The "x" mode enables a vertical
crosshair that lets you trace the values on the x axis, "y" enables a
horizontal crosshair and "xy" enables them both. "color" is the color of the
crosshair (default is "rgba(170, 0, 0, 0.80)"), "lineWidth" is the width of
the drawn lines (default is 1).

The plugin also adds four public methods:

  - setCrosshair( pos )

    Set the position of the crosshair. Note that this is cleared if the user
    moves the mouse. "pos" is in coordinates of the plot and should be on the
    form { x: xpos, y: ypos } (you can use x2/x3/... if you're using multiple
    axes), which is coincidentally the same format as what you get from a
    "plothover" event. If "pos" is null, the crosshair is cleared.

  - clearCrosshair()

    Clear the crosshair.

  - lockCrosshair(pos)

    Cause the crosshair to lock to the current location, no longer updating if
    the user moves the mouse. Optionally supply a position (passed on to
    setCrosshair()) to move it to.

    Example usage:

    var myFlot = $.plot( $("#graph"), ..., { crosshair: { mode: "x" } } };
    $("#graph").bind( "plothover", function ( evt, position, item ) {
        if ( item ) {
            // Lock the crosshair to the data point being hovered
            myFlot.lockCrosshair({
                x: item.datapoint[ 0 ],
                y: item.datapoint[ 1 ]
            });
        } else {
            // Return normal crosshair operation
            myFlot.unlockCrosshair();
        }
    });

  - unlockCrosshair()

    Free the crosshair to move again after locking it.
*/

(function ($) {
    var options = {
        crosshair: {
            mode: null, // one of null, "x", "y" or "xy",
            color: "rgba(170, 0, 0, 0.80)",
            lineWidth: 1
        }
    };

    function init(plot) {
        // position of crosshair in pixels
        var crosshair = {x: -1, y: -1, locked: false, highlighted: false};

        plot.setCrosshair = function setCrosshair(pos) {
            if (!pos) {
                crosshair.x = -1;
            } else {
                var o = plot.p2c(pos);
                crosshair.x = Math.max(0, Math.min(o.left, plot.width()));
                crosshair.y = Math.max(0, Math.min(o.top, plot.height()));
            }

            plot.triggerRedrawOverlay();
        };

        plot.clearCrosshair = plot.setCrosshair; // passes null for pos

        plot.lockCrosshair = function lockCrosshair(pos) {
            if (pos) {
                plot.setCrosshair(pos);
            }

            crosshair.locked = true;
        };

        plot.unlockCrosshair = function unlockCrosshair() {
            crosshair.locked = false;
            crosshair.rect = null;
        };

        function onMouseOut(e) {
            if (crosshair.locked) {
                return;
            }

            if (crosshair.x !== -1) {
                crosshair.x = -1;
                plot.triggerRedrawOverlay();
            }
        }

        function onMouseMove(e) {
            var offset = plot.offset();
            if (crosshair.locked) {
                var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
                var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));

                if ((mouseX > crosshair.x - 4) && (mouseX < crosshair.x + 4) && (mouseY > crosshair.y - 4) && (mouseY < crosshair.y + 4)) {
                    if (!crosshair.highlighted) {
                        crosshair.highlighted = true;
                        plot.triggerRedrawOverlay();
                    }
                } else {
                    if (crosshair.highlighted) {
                        crosshair.highlighted = false;
                        plot.triggerRedrawOverlay();
                    }
                }
                return;
            }

            if (plot.getSelection && plot.getSelection()) {
                crosshair.x = -1; // hide the crosshair while selecting
                return;
            }

            crosshair.x = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
            crosshair.y = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
            plot.triggerRedrawOverlay();
        }

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            if (!plot.getOptions().crosshair.mode) {
                return;
            }

            eventHolder.mouseout(onMouseOut);
            eventHolder.mousemove(onMouseMove);
        });

        plot.hooks.drawOverlay.push(function (plot, ctx) {
            var c = plot.getOptions().crosshair;
            if (!c.mode) {
                return;
            }

            var plotOffset = plot.getPlotOffset();

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            if (crosshair.x !== -1) {
                var adj = plot.getOptions().crosshair.lineWidth % 2 ? 0.5 : 0;

                ctx.strokeStyle = c.color;
                ctx.lineWidth = c.lineWidth;
                ctx.lineJoin = "round";

                ctx.beginPath();
                if (c.mode.indexOf("x") !== -1) {
                    var drawX = Math.floor(crosshair.x) + adj;
                    ctx.moveTo(drawX, 0);
                    ctx.lineTo(drawX, plot.height());
                }
                if (c.mode.indexOf("y") !== -1) {
                    var drawY = Math.floor(crosshair.y) + adj;
                    ctx.moveTo(0, drawY);
                    ctx.lineTo(plot.width(), drawY);
                }
                if (crosshair.locked) {
                    if (crosshair.highlighted) ctx.fillStyle = 'orange';
                    else ctx.fillStyle = c.color;
                    ctx.fillRect(Math.floor(crosshair.x) + adj - 4, Math.floor(crosshair.y) + adj - 4, 8, 8);
                }
                ctx.stroke();
            }
            ctx.restore();
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mouseout", onMouseOut);
            eventHolder.unbind("mousemove", onMouseMove);
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'crosshair',
        version: '1.0'
    });
})(jQuery);

/*
Axis label plugin for flot

Derived from:
Axis Labels Plugin for flot.
http://github.com/markrcote/flot-axislabels

Original code is Copyright (c) 2010 Xuan Luo.
Original code was released under the GPLv3 license by Xuan Luo, September 2010.
Original code was rereleased under the MIT license by Xuan Luo, April 2012.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($) {
    "use strict";

    var options = {
        axisLabels: {
            show: true
        }
    };

    function AxisLabel(axisName, position, padding, placeholder, axisLabel, surface) {
        this.axisName = axisName;
        this.position = position;
        this.padding = padding;
        this.placeholder = placeholder;
        this.axisLabel = axisLabel;
        this.surface = surface;
        this.width = 0;
        this.height = 0;
        this.elem = null;
    }

    AxisLabel.prototype.calculateSize = function() {
        var axisId = this.axisName + 'Label',
            layerId = axisId + 'Layer',
            className = axisId + ' axisLabels';

        var info = this.surface.getTextInfo(layerId, this.axisLabel, className);
        this.labelWidth = info.width;
        this.labelHeight = info.height;

        if (this.position === 'left' || this.position === 'right') {
            this.width = this.labelHeight + this.padding;
            this.height = 0;
        } else {
            this.width = 0;
            this.height = this.labelHeight + this.padding;
        }
    };

    AxisLabel.prototype.transforms = function(degrees, x, y, svgLayer) {
        var transforms = [], translate, rotate;
        if (x !== 0 || y !== 0) {
            translate = svgLayer.createSVGTransform();
            translate.setTranslate(x, y);
            transforms.push(translate);
        }
        if (degrees !== 0) {
            rotate = svgLayer.createSVGTransform();
            var centerX = Math.round(this.labelWidth / 2),
                centerY = 0;
            rotate.setRotate(degrees, centerX, centerY);
            transforms.push(rotate);
        }

        return transforms;
    };

    AxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = {
            x: 0,
            y: 0,
            degrees: 0
        };
        if (this.position === 'bottom') {
            offsets.x = box.left + box.width / 2 - this.labelWidth / 2;
            offsets.y = box.top + box.height - this.labelHeight;
        } else if (this.position === 'top') {
            offsets.x = box.left + box.width / 2 - this.labelWidth / 2;
            offsets.y = box.top;
        } else if (this.position === 'left') {
            offsets.degrees = -90;
            offsets.x = box.left - this.labelWidth / 2;
            offsets.y = box.height / 2 + box.top;
        } else if (this.position === 'right') {
            offsets.degrees = 90;
            offsets.x = box.left + box.width - this.labelWidth / 2;
            offsets.y = box.height / 2 + box.top;
        }
        offsets.x = Math.round(offsets.x);
        offsets.y = Math.round(offsets.y);

        return offsets;
    };

    AxisLabel.prototype.cleanup = function() {
        var axisId = this.axisName + 'Label',
            layerId = axisId + 'Layer',
            className = axisId + ' axisLabels';
        this.surface.removeText(layerId, 0, 0, this.axisLabel, className);
    };

    AxisLabel.prototype.draw = function(box) {
        var axisId = this.axisName + 'Label',
            layerId = axisId + 'Layer',
            className = axisId + ' axisLabels',
            offsets = this.calculateOffsets(box),
            style = {
                position: 'absolute',
                bottom: '',
                right: '',
                display: 'inline-block',
                'white-space': 'nowrap'
            };

        var layer = this.surface.getSVGLayer(layerId);
        var transforms = this.transforms(offsets.degrees, offsets.x, offsets.y, layer.parentNode);

        this.surface.addText(layerId, 0, 0, this.axisLabel, className, undefined, undefined, undefined, undefined, transforms);
        this.surface.render();
        Object.keys(style).forEach(function(key) {
            layer.style[key] = style[key];
        });
    };

    function init(plot) {
        plot.hooks.processOptions.push(function(plot, options) {
            if (!options.axisLabels.show) {
                return;
            }

            var axisLabels = {};
            var defaultPadding = 2; // padding between axis and tick labels

            plot.hooks.axisReserveSpace.push(function(plot, axis) {
                var opts = axis.options;
                var axisName = axis.direction + axis.n;

                axis.labelHeight += axis.boxPosition.centerY;
                axis.labelWidth += axis.boxPosition.centerX;

                if (!opts || !opts.axisLabel || !axis.show) {
                    return;
                }

                var padding = opts.axisLabelPadding === undefined
                    ? defaultPadding
                    : opts.axisLabelPadding;

                var axisLabel = axisLabels[axisName];
                if (!axisLabel) {
                    axisLabel = new AxisLabel(axisName,
                        opts.position, padding,
                        plot.getPlaceholder()[0], opts.axisLabel, plot.getSurface());
                    axisLabels[axisName] = axisLabel;
                }

                axisLabel.calculateSize();

                // Incrementing the sizes of the tick labels.
                axis.labelHeight += axisLabel.height;
                axis.labelWidth += axisLabel.width;
            });

            // TODO - use the drawAxis hook
            plot.hooks.draw.push(function(plot, ctx) {
                $.each(plot.getAxes(), function(flotAxisName, axis) {
                    var opts = axis.options;
                    if (!opts || !opts.axisLabel || !axis.show) {
                        return;
                    }

                    var axisName = axis.direction + axis.n;
                    axisLabels[axisName].draw(axis.box);
                });
            });

            plot.hooks.shutdown.push(function(plot, eventHolder) {
                for (var axisName in axisLabels) {
                    axisLabels[axisName].cleanup();
                }
            });
        });
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '3.0'
    });
})(jQuery);
