CodeMirror.defineMode("markdown",function(t){function e(t,e,n){return e.f=e.inline=n,n(t,e)}function n(t,e,n){return e.f=e.block=n,n(t,e)}function i(t){return t.linkTitle=!1,t.code=!1,t.em=!1,t.strong=!1,t.quote=!1,p||t.f!=o||(t.f=f,t.block=r),null}function r(t,n){var i;if(n.list!==!1&&n.indentationDiff>=0?(n.indentationDiff<4&&(n.indentation-=n.indentationDiff),n.list=null):n.list=!1,n.indentationDiff>=4)return n.indentation-=4,t.skipToEnd(),b;if(t.eatSpace())return null;if("#"===t.peek()||x&&t.match(j))n.header=!0;else if(t.eat(">"))n.indentation++,n.quote=!0;else{if("["===t.peek())return e(t,n,s);if(t.match(O,!0))return w;(i=t.match(R,!0)||t.match(U,!0))&&(n.indentation+=4,n.list=!0)}return e(t,n,n.inline)}function o(t,e){var n=k.token(t,e.htmlState);return p&&"tag"===n&&"openTag"!==e.htmlState.type&&!e.htmlState.context&&(e.f=f,e.block=r),e.md_inside&&-1!=t.current().indexOf(">")&&(e.f=f,e.block=r,e.htmlState.context=void 0),n}function a(t){var e=[];return t.strong?e.push(t.em?E:D):t.em&&e.push(C),t.code&&e.push(b),t.header&&e.push(S),t.quote&&e.push(M),t.list!==!1&&e.push(T),e.length?e.join(" "):null}function u(t,e){return t.match(I,!0)?a(e):void 0}function f(t,i){var r=i.text(t,i);if("undefined"!=typeof r)return r;if(i.list)return i.list=null,T;var u=t.next();if("\\"===u)return t.next(),a(i);if(i.linkTitle){i.linkTitle=!1;var f=u;"("===u&&(f=")"),f=(f+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");var c="^\\s*(?:[^"+f+"\\\\]+|\\\\\\\\|\\\\.)"+f;if(t.match(new RegExp(c),!0))return y}if("`"===u){var s=a(i),d=t.pos;t.eatWhile("`");var m=1+t.pos-d;return i.code?m===g?(i.code=!1,s):a(i):(g=m,i.code=!0,a(i))}if(i.code)return a(i);if("["===u&&t.match(/.*\] ?(?:\(|\[)/,!1))return e(t,i,l);if("<"===u&&t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/,!0))return e(t,i,h(_,">"));if("<"===u&&t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/,!0))return e(t,i,h(q,">"));if("<"===u&&t.match(/^\w/,!1)){if(-1!=t.string.indexOf(">")){var p=t.string.substring(1,t.string.indexOf(">"));/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(p)&&(i.md_inside=!0)}return t.backUp(1),n(t,i,o)}if("<"===u&&t.match(/^\/\w*?>/))return i.md_inside=!1,"tag";var s=a(i);if("*"===u||"_"===u){if(i.strong===u&&t.eat(u))return i.strong=!1,s;if(!i.strong&&t.eat(u))return i.strong=u,a(i);if(i.em===u)return i.em=!1,s;if(!i.em)return i.em=u,a(i)}else if(" "===u&&(t.eat("*")||t.eat("_"))){if(" "===t.peek())return a(i);t.backUp(1)}return a(i)}function l(t,e){for(;!t.eol();){var n=t.next();if("\\"===n&&t.next(),"]"===n)return e.inline=e.f=c,$}return $}function c(t,n){if(t.eatSpace())return null;var i=t.next();return"("===i||"["===i?e(t,n,h(y,"("===i?")":"]")):"error"}function s(t,n){return t.match(/^[^\]]*\]:/,!0)?(n.f=d,$):e(t,n,f)}function d(t,e){return t.eatSpace()?null:(t.match(/^[^\s]+/,!0),void 0===t.peek()?e.linkTitle=!0:t.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/,!0),e.f=e.inline=f,y)}function m(t){return L[t]||(t=(t+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),L[t]=new RegExp("^(?:[^\\\\]|\\\\.)*?("+t+")")),L[t]}function h(t,e,n){return n=n||f,function(i,r){return i.match(m(e)),r.inline=r.f=n,t}}var p=CodeMirror.mimeModes.hasOwnProperty("text/html"),k=CodeMirror.getMode(t,p?"text/html":"text/plain"),g=0,x=!1,v=!1,S="header",b="comment",M="quote",T="string",w="hr",_="link",q="link",$="link",y="string",C="em",D="strong",E="emstrong",O=/^([*\-=_])(?:\s*\1){2,}\s*$/,R=/^[*\-+]\s+/,U=/^[0-9]+\.\s+/,j=/^(?:\={1,}|-{1,})$/,I=/^[^\[*_\\<>` "'(]+/,L=[];return{startState:function(){return{f:r,block:r,htmlState:CodeMirror.startState(k),indentation:0,inline:f,text:u,linkTitle:!1,em:!1,strong:!1,header:!1,list:!1,quote:!1}},copyState:function(t){return{f:t.f,block:t.block,htmlState:CodeMirror.copyState(k,t.htmlState),indentation:t.indentation,inline:t.inline,text:t.text,linkTitle:t.linkTitle,em:t.em,strong:t.strong,header:t.header,list:t.list,quote:t.quote,md_inside:t.md_inside}},token:function(t,e){if(t.sol()){if(t.match(/^\s*$/,!0))return x=!1,i(e);v&&(x=!0,v=!1),v=!0,e.header=!1,e.f=e.block;var n=t.match(/^\s*/,!0)[0].replace(/\t/g,"    ").length;if(e.indentationDiff=n-e.indentation,e.indentation=n,n>0)return null}return e.f(t,e)},blankLine:i,getType:a}},"xml"),CodeMirror.defineMIME("text/x-markdown","markdown");
  