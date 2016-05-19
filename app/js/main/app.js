"use strict";function paletteArrayCreator(e,o){for(var r=[],n=[],t=0;t<Object.keys(colorList).length;t++)t%7===6||t===Object.keys(colorList).length-1?(n.push(Object.keys(colorList)[t]),r.push(n),n=[]):n.push(Object.keys(colorList)[t]);r.forEach(function(o,r,n){return e[r]=n[r].slice()}),e.forEach(function(r,n,t){e[n].forEach(function(r,t,a){return e[n][t]=colorList[r][o]})}),e[e.length-1].push("#fff","#000")}function paletteConstructorArray(e){function o(e){this.id="#"+e+"ColorPicker",this.swatch=colorList[colors[e].color][colors[e].colorCode],this.value=e,this.colorPalette=colors[e].palette,-1!==e.indexOf("Night")?this.replacerClassName="nightmode":this.replacerClassName=""}var r=[];return e.forEach(function(e,n,t){return r.push(new o(t[n]))}),r}function createSpectrum(e,o){var r=arguments.length<=2||void 0===arguments[2]?null:arguments[2],n=arguments[3],t=arguments[4];$(e).spectrum({color:o,palette:r,replacerClassName:n,theme:"sp-light",showInput:!0,showInitial:!0,showPalette:!0,preferredFormat:"hex3",containerClassName:e.slice(1)+"Container"}),$(e).show(),$(e).change(function(){function o(e){var o=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;e=e.replace(o,function(e,o,r,n){return o+o+r+r+n+n});var r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:null}$(e).spectrum("set",$(e).val());var r=$(e).val();if("#primaryColorPicker"===e)$("iframe").contents().find("style").append('\n        .submit-link .morelink a,\n        .submit-text .morelink a,\n        .submit-page button[type="submit"],\n        #sr-form .save-button button,\n        .save-button>button:nth-child(1) {\n          background: '+r+' radial-gradient(circle,rgba(77,208,225,0.3) 15%,transparent 30%) no-repeat 50% 50%/0!important;\n        }\n        .login-form-side input[type="checkbox"]:checked+label::before,\n        .c-checkbox input[type="checkbox"]:checked+label::before,\n        .flairtoggle input[type="checkbox"]:checked+label::before,\n        .linefield input[type="checkbox"]:checked+label::before,\n        .roundfield-content input[type="checkbox"]:checked+label::before {\n          border-color: '+r+"!important;\n          background: "+r+" url('../../../img/sprites/spritesheet.png') -246px -138px;\n        }\n        .toggleButton.enabled {\n          background-color: "+r+";\n        }\n        #wikiactions a,\n        #moderation_tools a,\n        .footer a,\n        .bottommenu a {\n          background: linear-gradient(to top,"+r+" 50%,transparent 50%);\n          background-size: 100% 200%;\n          background-repeat: no-repeat;\n        }\n        ");else if("#darkPrimaryColorPicker"===e)$("iframe").contents().find("style").append('\n        .submit-link .morelink a:hover, .submit-text .morelink a:hover,\n        .submit-page button[type="submit"]:hover, #sr-form .save-button button:hover, .save-button > button:nth-child(1):hover,\n        .toggleButton.enabled::before {\n          background-color: '+r+" !important;\n        }\n        ");else if("#lightPrimaryColorPicker"===e){var n=o(r).r,a=o(r).g,i=o(r).b;$("iframe").contents().find("style").text($("iframe").contents().find("style").text().replace(/rgba\(77,208,225,0\.3\)/g,"rgba("+n+","+a+","+i+",0.3)"))}else if("#accentColorPicker"===e)$("iframe").contents().find("style").append("\n        .tabmenu li a:hover::after,\n        .tabmenu li #viewImagesButton:hover::after,\n        ul.tabmenu.formtab li a:hover::after {\n          border-bottom: 2px solid "+r+";\n        }\n        .tabmenu li.selected a,\n        ul.tabmenu.formtab li.selected a {\n          border-bottom-color: "+r+';\n        }\n        input[type="text"]:focus,\n        input[type="password"]:focus,\n        input[type="url"]:focus,\n        textarea:focus {\n          border-bottom-color: '+r+" !important;\n        }\n        #sr-more-link {\n          background-color: "+r+" !important;\n        }\n        #search:hover::before {\n          color: "+r+';\n        }\n        #search input[type="text"]:focus {\n          border-bottom: 1px solid'+r+";\n        }\n        label + #moresearchinfo {\n          border-color: "+r+";\n        }\n        ");else if("#darkAccentColorPicker"===e);else if("#lightAccentColorPicker"===e){var c=o(r).r,l=o(r).g,d=o(r).b;$("iframe").contents().find("style").append("\n        #header-bottom-left .tabmenu li a,\n        #header-bottom-left .tabmenu li #viewImagesButton {\n          background: transparent radial-gradient(circle, rgba("+c+", "+l+", "+d+", 0.3) 15%, transparent 30%) no-repeat 50% 50%/0 !important;\n        }\n        ")}else"#linkColorColorPicker"===e?$("iframe").contents().find("style").append("\n        body a,\n        #siteTable > .thing .title {\n          color: "+r+";\n        }\n        "):"#linkColorHoverColorPicker"===e?$("iframe").contents().find("style").append("\n        body a:hover,\n        #siteTable > .thing .title:hover {\n          color: "+r+";\n        }\n        "):"#linkColorActiveColorPicker"===e?$("iframe").contents().find("style").append("\n        body a:active,\n        #siteTable > .thing .title:active {\n          color: "+r+";\n        }\n        "):"#linkColorVisitedColorPicker"===e?$("iframe").contents().find("style").append("\n        body a:visited,\n        #siteTable > .thing .title:visited {\n          color: "+r+";\n        }\n        "):"#linkColorNightColorPicker"===e||"#linkColorHoverNightColorPicker"===e||"#linkColorActiveNightColorPicker"===e||"#linkColorVisitedNightColorPicker"===e||("#upvoteColorPicker"===e?$("iframe").contents().find("style").append("\n        .sidecontentbox .gadget .thing span.score.likes,\n        #siteTable .score.likes,\n        .thing .link .score.likes {\n          color: "+r+";\n        }\n        .arrow.upmod::before,\n        .arrow.upmod:hover::before,\n        .arrow.upmod:focus::after,\n        .arrow.up:focus::after {\n          background-color: "+r+";\n        }\n        "):"#downvoteColorPicker"===e&&$("iframe").contents().find("style").append("\n        .sidecontentbox .gadget .thing span.score.dislikes,\n        #siteTable .score.dislikes,\n        .thing .link .score.dislikes,\n        .sidecontentbox .gadget .thing span.score.dislikes {\n          color: "+r+";\n        }\n        .arrow.downmod::before,\n        .arrow.downmod:hover::before,\n        .arrow.downmod:focus::after,\n        .arrow.down:focus::after {\n          background-color: "+r+";\n        }\n        "));colors[t]=$("."+e.slice(1)+"Container input").val(),console.log(t+" = "+colors[t])})}function varEditor(e,o,r){null!==e.match(/[A-Z]/g)?!function(){var n=e.match(/[A-Z]/g);if(n.length>1)n.forEach(function(o,r,t){e=e.replace(n[r],"-"+n[r].toLowerCase())});else{var t=e.match(/[A-Z]/g),a=_slicedToArray(t,1);n=a[0],e=e.replace(n,"-"+n.toLowerCase())}r.push("(\\$"+e+": .*?;)"),o.push(e)}():(r.push("(\\$"+e+": .*?;)"),o.push(e))}function regexPatternCreator(e,o,r){return e(o,r),new RegExp(r.join("|"),"g")}function booleanCallback(e,o){return(arguments.length<=3?void 0:arguments[3])?"$"+e[0]+": "+o+";":void 0}function replacer(e,o,r){var n=arguments.length<=3||void 0===arguments[3]?null:arguments[3],t=[],a=[];return"color"===o?e=e.replace(regexPatternCreator(function(e,o){for(var r in colors)colors.hasOwnProperty(r)&&varEditor(r,e,o)},t,a),function(){for(var e=arguments.length,o=Array(e),n=0;e>n;n++)o[n]=arguments[n];for(var a=0;a<r.length;a++)if(o[a+1]){if("object"===_typeof(colors[r[a]])){var i=colors[r[a]];return"$"+t[a]+": "+colorList[i.color][i.colorCode]+";"}if("string"==typeof colors[r[a]])return"$"+t[a]+": "+colors[r[a]]+";"}}):"bool"===o?e=e.replace(regexPatternCreator(function(e,o){varEditor(n,e,o)},t,a),function(){for(var e=arguments.length,o=Array(e),n=0;e>n;n++)o[n]=arguments[n];return booleanCallback.apply(void 0,[t,r].concat(o))}):void 0}function inlineStyler(e){if("object"===("undefined"==typeof e?"undefined":_typeof(e)))for(var o in e)if(-1===inlineStyleSelectors.indexOf(o)&&inlineStyleSelectors.push(o),e.hasOwnProperty(o)){var r=e[o];for(var n in r)if(r.hasOwnProperty(n)){var t=r[n];$("iframe").contents().find(o).css(n,t)}}}function compileButtonEnabler(e){"enable"===e?($("#compile").removeClass("disabled").prop("disabled",!1),$("#compile-div").removeClass("disabled").attr("title","").tooltip("destroy")):"disable"===e&&($("#compile").addClass("disabled").prop("disabled",!0),$("#compile-div").addClass("disabled").attr("title","Please correct all errors!").tooltip())}function sidebarImageLivePreview(e){void 0!==e&&-1!==e.search(/data:image\/png;base64,/)&&(sidebarImg.URL=e),$("#sidebar-img-checkbox:checkbox").prop("checked")?(inlineStyler($("#large-header-checkbox:checkbox").prop("checked")?{".side":{top:297+sidebarImg.height+16+"px"}}:{".side":{top:223+sidebarImg.height+16+"px"}}),$("iframe").contents().find("style").append("\n      .titlebox::before {\n        position: absolute;\n        top: "+(-sidebarImg.height-16)+"px;\n        right: -330px;\n        display: block;\n        height: "+sidebarImg.height+"px;\n        width: 330px;\n        content: '';\n        border-radius: 2px;\n        background: url("+sidebarImg.URL+") center;\n        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),\n                    0px 2px 2px 0px rgba(0, 0, 0, 0.14),\n                    0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n      }\n\n      @media (max-resolution: 1dppx) and (min-width: 992px) {\n        .titlebox::before {\n          right: 0;\n        }\n      }\n      ")):(inlineStyler($("#large-header-checkbox:checkbox").prop("checked")?{".side":{top:"297px"}}:{".side":{top:"223px"}}),$("iframe").contents().find("style").append("\n      .titlebox::before {\n        display: none;\n      }\n\n      @media (max-resolution: 1dppx) and (min-width: 992px) {\n        .titlebox::before {\n          right: unset;\n        }\n      }\n      "))}function checkDimensions(e,o){var r=new Image;r.onload=function(e){o&&o(r)},r.src=e.target.result}function readImg(e,o,r){var n=new FileReader;n.onload=function(e){checkDimensions(e,function(e){if(330!==e.width){$(".header").after('<canvas id="canvas" width="0" height="0"></canvas>');var t=$("#canvas"),a=_slicedToArray(t,1),i=a[0],c=i.getContext("2d"),l=e.width/330;$("#canvas").prop({width:"330",height:""+Math.round(e.height/l)}),"sidebar"===o&&(sidebarImg.height=Math.round(e.height/l)),c.drawImage(e,0,0,330,e.height/l),r(i.toDataURL()),$("#canvas").detach()}else"sidebar"===o&&(sidebarImg.height=e.height),r(n.result)})},n.readAsDataURL(e)}function previewImg(e,o){var r=arguments.length<=2||void 0===arguments[2]?void 0:arguments[2],n=_slicedToArray(e.files,1),t=n[0];if(void 0===r)r=e;else{var a=$(r).find(".dropbox"),i=_slicedToArray(a,1);r=i[0]}if(t){var c=/^image\//;c.test(t.type)?readImg(t,o,function(e){t.size>5e5?(compileButtonEnabler("disable"),$(r).parents(".panel-default").find("h4").append('<span class="label label-warning">Error</span>'),$(r).parent().css("border-color","#f2dede"),$(r).siblings(".file-details").html('<p class="bg-danger">File size over 500kb!</p>')):(o="sidebar")&&(sidebarImageLivePreview(e),compileButtonEnabler("enable"),$(r).parents(".panel-default").find(".label-warning").detach(),$(r).parent().css("border-color","#d9edf7"),$(r).siblings(".thumb-container").html('<img src="'+e+'" width="100" alt="Image preview...">'),$(r).siblings(".file-details").html("<p><strong>"+t.name+"</strong> - "+t.size+" bytes</p>"))}):(compileButtonEnabler("disable"),$(r).parents(".panel-default").find("h4").append('<span class="label label-warning">Error</span>'),$(r).parent().css("border-color","#f2dede"),$(r).siblings(".file-details").html('<p class="bg-danger">Invalid file type!</p>'))}}function createClickableDropbox(e,o){var r=$(e).parents(".addons__checkbox-container").find(".dropbox-container"),n=_slicedToArray(r,1),t=n[0],a=$(e).parents(".addons__checkbox-container").find(".dropbox"),i=_slicedToArray(a,1),c=i[0],l=$(e).parents(".addons__checkbox-container").find(".thumb-container"),d=_slicedToArray(l,1),s=d[0],f=$(e).parents(".addons__checkbox-container").find(".file-details"),b=_slicedToArray(f,1),p=b[0];$(s).html(""),$(p).html(""),$(t).css("border-color","#d9edf7"),t.onclick=function(e){$(c).val(""),c.click()},$(c).change(function(e){previewImg(e.currentTarget,o)})}function dragAndDrop(e){var o=$("body"),r=_slicedToArray(o,1),n=r[0];for(var t in dropzone)dropzone.hasOwnProperty(t)&&"function"==typeof dropzone[t]&&("enable"===e?n.addEventListener(t,dropzone[t],!1):"disable"===e&&n.removeEventListener(t,dropzone[t],!1))}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},_slicedToArray=function(){function e(e,o){var r=[],n=!0,t=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!o||r.length!==o);n=!0);}catch(l){t=!0,a=l}finally{try{!n&&c["return"]&&c["return"]()}finally{if(t)throw a}}return r}return function(o,r){if(Array.isArray(o))return o;if(Symbol.iterator in Object(o))return e(o,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),colorList={red:{50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000"},pink:{50:"#fce4ec",100:"#f8bbd0",200:"#f48fb1",300:"#f06292",400:"#ec407a",500:"#e91e63",600:"#d81b60",700:"#c2185b",800:"#ad1457",900:"#880e4f",A100:"#ff80ab",A200:"#ff4081",A400:"#f50057",A700:"#c51162"},purple:{50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff"},deepPurple:{50:"#ede7f6",100:"#d1c4e9",200:"#b39ddb",300:"#9575cd",400:"#7e57c2",500:"#673ab7",600:"#5e35b1",700:"#512da8",800:"#4527a0",900:"#311b92",A100:"#b388ff",A200:"#7c4dff",A400:"#651fff",A700:"#6200ea"},indigo:{50:"#e8eaf6",100:"#c5cae9",200:"#9fa8da",300:"#7986cb",400:"#5c6bc0",500:"#3f51b5",600:"#3949ab",700:"#303f9f",800:"#283593",900:"#1a237e",A100:"#8c9eff",A200:"#536dfe",A400:"#3d5afe",A700:"#304ffe"},blue:{50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",A100:"#82b1ff",A200:"#448aff",A400:"#2979ff",A700:"#2962ff"},lightBlue:{50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",A100:"#80d8ff",A200:"#40c4ff",A400:"#00b0ff",A700:"#0091ea"},cyan:{50:"#e0f7fa",100:"#b2ebf2",200:"#80deea",300:"#4dd0e1",400:"#26c6da",500:"#00bcd4",600:"#00acc1",700:"#0097a7",800:"#00838f",900:"#006064",A100:"#84ffff",A200:"#18ffff",A400:"#00e5ff",A700:"#00b8d4"},teal:{50:"#e0f2f1",100:"#b2dfdb",200:"#80cbc4",300:"#4db6ac",400:"#26a69a",500:"#009688",600:"#00897b",700:"#00796b",800:"#00695c",900:"#004d40",A100:"#a7ffeb",A200:"#64ffda",A400:"#1de9b6",A700:"#00bfa5"},green:{50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853"},lightGreen:{50:"#f1f8e9",100:"#dcedc8",200:"#c5e1a5",300:"#aed581",400:"#9ccc65",500:"#8bc34a",600:"#7cb342",700:"#689f38",800:"#558b2f",900:"#33691e",A100:"#ccff90",A200:"#b2ff59",A400:"#76ff03",A700:"#64dd17"},lime:{50:"#f9fbe7",100:"#f0f4c3",200:"#e6ee9c",300:"#dce775",400:"#d4e157",500:"#cddc39",600:"#c0ca33",700:"#afb42b",800:"#9e9d24",900:"#827717",A100:"#f4ff81",A200:"#eeff41",A400:"#c6ff00",A700:"#aeea00"},yellow:{50:"#fffde7",100:"#fff9c4",200:"#fff59d",300:"#fff176",400:"#ffee58",500:"#ffeb3b",600:"#fdd835",700:"#fbc02d",800:"#f9a825",900:"#f57f17",A100:"#ffff8d",A200:"#ffff00",A400:"#ffea00",A700:"#ffd600"},amber:{50:"#fff8e1",100:"#ffecb3",200:"#ffe082",300:"#ffd54f",400:"#ffca28",500:"#ffc107",600:"#ffb300",700:"#ffa000",800:"#ff8f00",900:"#ff6f00",A100:"#ffe57f",A200:"#ffd740",A400:"#ffc400",A700:"#ffab00"},orange:{50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",A100:"#ffd180",A200:"#ffab40",A400:"#ff9100",A700:"#ff6d00"},deepOrange:{50:"#fbe9e7",100:"#ffccbc",200:"#ffab91",300:"#ff8a65",400:"#ff7043",500:"#ff5722",600:"#f4511e",700:"#e64a19",800:"#d84315",900:"#bf360c",A100:"#ff9e80",A200:"#ff6e40",A400:"#ff3d00",A700:"#dd2c00"},brown:{50:"#efebe9",100:"#d7ccc8",200:"#bcaaa4",300:"#a1887f",400:"#8d6e63",500:"#795548",600:"#6d4c41",700:"#5d4037",800:"#4e342e",900:"#3e2723"},grey:{50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121"},blueGrey:{50:"#eceff1",100:"#cfd8dc",200:"#b0bec5",300:"#90a4ae",400:"#78909c",500:"#607d8b",600:"#546e7a",700:"#455a64",800:"#37474f",900:"#263238",1000:"#11171a"}},colors={primary:{color:"cyan",colorCode:"500"},darkPrimary:{color:"cyan",colorCode:"700"},lightPrimary:{color:"cyan",colorCode:"300"},accent:{color:"orange",colorCode:"A200"},darkAccent:{color:"orange",colorCode:"A400"},lightAccent:{color:"orange",colorCode:"A100"},linkColor:{color:"blue",colorCode:"500"},linkColorHover:{color:"blue",colorCode:"300"},linkColorActive:{color:"blue",colorCode:"700"},linkColorVisited:{color:"deepPurple",colorCode:"300"},linkColorNight:{color:"blue",colorCode:"500"},linkColorHoverNight:{color:"blue",colorCode:"300"},linkColorActiveNight:{color:"blue",colorCode:"700"},linkColorVisitedNight:{color:"deepPurple",colorCode:"300"},upvote:{color:"deepOrange",colorCode:"500"},downvote:{color:"indigo",colorCode:"500"}};for(var key in colors)colors.hasOwnProperty(key)&&(colors[key].palette=[],paletteArrayCreator(colors[key].palette,colors[key].colorCode));var palettes=paletteConstructorArray(Object.keys(colors));console.log(palettes),palettes.forEach(function(e,o,r){return createSpectrum(r[o].id,r[o].swatch,r[o].colorPalette,r[o].replacerClassName,r[o].value)});var pinnedTopics,numStickiedLinks,numStickiedMenus,stickyLinkImages,stickyMenuImages;$(document).ready(function(){$.ajax({url:"style/flattish.min.css"}).done(function(e){$("#target").html(e)}).done(function(){$("#iframe-container").affix({offset:{top:$(".header").outerHeight(!0),bottom:function(){return $("#results").outerHeight(!0)+$("#addons-container").outerHeight(!0)}}})}),$(".btn-clipboard").tooltip({container:"body"}),$(".btn-clipboard").click(function(){if(document.selection){var e=document.body.createTextRange();e.moveToElementText(document.getElementById("target")),e.select()}else if(window.getSelection){var o=document.createRange();o.selectNode(document.getElementById("target")),window.getSelection().removeAllRanges(),window.getSelection().addRange(o)}try{var r=document.execCommand("copy");r?($(".btn-clipboard").trigger("copied",["Copied!"]),window.getSelection().removeAllRanges()):$(".btn-clipboard").trigger("copied",["Copy with Ctrl-c"])}catch(n){$(".btn-clipboard").trigger("copied",["Copy with Ctrl-c"])}}),$(".btn-clipboard").bind("copied",function(e,o){$(e.currentTarget).attr("title",o).tooltip("fixTitle").tooltip("show").attr("title","Copy to clipboard").tooltip("fixTitle")})});var sass=new Sass;sass.options({style:Sass.style.compressed},function(e){return console.log("set options")});for(var key in Sass.maps)Sass.maps.hasOwnProperty(key)&&(console.log("loading "+key),sass.preloadFiles(Sass.maps[key].base,Sass.maps[key].directory,Sass.maps[key].files,function(){console.log("files loaded")}));var inlineStyleSelectors=[],addonLabeler={addons:["large-header","rotating-header","sidebar-img"],enable:function(e){$("#"+e+"-label").addClass("label-info").removeClass("label-default").html("Enabled")},disable:function(e){$("#"+e+"-label").addClass("label-default").removeClass("label-info").html("Disabled")}};addonLabeler.addons.forEach(function(e,o,r){$("#"+e+"-checkbox:checkbox").change(function(){$("#"+e+"-checkbox:checkbox").prop("checked")?addonLabeler.enable(e):addonLabeler.disable(e)})}),$("#large-header-checkbox:checkbox").change(function(){$("#large-header-checkbox:checkbox").prop("checked")?(inlineStyler({"div.content":{top:"297px"},"#header-bottom-left":{top:"172px"},".side":{top:"297px"}}),$("iframe").contents().find("style").append("\n      @media (min-width: 992px) {\n        #header-bottom-left {\n          left: 48px;\n        }\n      }\n      @media (min-width: 1200px) {\n        #header-bottom-left {\n          top: 245px;\n        }\n      }\n      body::before {\n        height: 420px;\n      }\n      "),$("#pinned-topics-checkbox:checkbox").prop("checked")&&(inlineStyler({".titlebox blockquote":{top:"312px"}}),$("iframe").contents().find("style").append("\n        @media (min-width: 992px) {\n          #header-bottom-left {\n            left: 0;\n          }\n        }\n        ")),$("#sidebar-img-checkbox:checkbox").prop("checked")&&inlineStyler({".side":{top:297+sidebarImg.height+16+"px"}})):(inlineStyler({"div.content":{top:"223px"},"#header-bottom-left":{top:"86px"},".side":{top:"223px"}}),$("iframe").contents().find("style").append("\n      body::before {\n        height: 223px;\n      }\n\n      @media (min-width: 992px) {\n        #header-bottom-left {\n          left: unset;\n        }\n      }\n      @media (min-width: 1200px) {\n        #header-bottom-left {\n          top: 159px;\n        }\n      }\n      "),$("#pinned-topics-checkbox:checkbox").prop("checked")&&inlineStyler({".titlebox blockquote":{top:"239px"}}),$("#sidebar-img-checkbox:checkbox").prop("checked")&&inlineStyler({".side":{top:223+sidebarImg.height+16+"px"}}))}),$("#rotating-header-checkbox:checkbox").change(function(){var e=[.4,0,.2,1];$("#rotating-header-checkbox:checkbox").prop("checked")?($("#rotating-header__div").show(200,$.bez(e)).fadeIn(200,$.bez(e)).slideDown(200,$.bez(e)),$("#rotating-header__input").prop({disabled:!1,required:!0})):($("#rotating-header__div").hide(200,$.bez(e)).fadeOut(200,$.bez(e)).slideUp(200,$.bez(e)),$("#rotating-header__input").prop({disabled:!0,required:!1}))});var sidebarImg={height:224,URL:"",reset:function(){sidebarImg.height=224,sidebarImg.URL="../../../img/sidebar.png"}};window.File&&window.FileReader&&window.FileList&&window.Blob?console.log("All File APIS supported"):alert("The File APIs are not fully supported in this browser.");var dropzone={counter:0,location:"",dragenter:function(e){e.stopPropagation(),e.preventDefault(),dropzone.counter++},dragover:function(e){e.stopPropagation(),e.preventDefault(),$("body").hasClass("droppable")||$("body").addClass("droppable")},drop:function(e){e.stopPropagation(),e.preventDefault();var o=e.dataTransfer;$("body").hasClass("droppable")&&($("body").removeClass("droppable"),dropzone.counter=0),previewImg(o,dropzone.location,e.currentTarget)},dragleave:function(e){e.stopPropagation(),e.preventDefault(),dropzone.counter--,0===dropzone.counter&&$("body").hasClass("droppable")&&$("body").removeClass("droppable")}};$("#sidebar-img-panel").on("shown.bs.collapse",function(e){$(e.currentTarget).find("input[type=checkbox]").prop("checked")&&dragAndDrop("enable")}),$("#sidebar-img-panel").on("hidden.bs.collapse",function(e){$(e.currentTarget).find("input[type=checkbox]").prop("checked")&&dragAndDrop("disable")}),$("#sidebar-img-checkbox:checkbox").change(function(e){var o=[.4,0,.2,1];dropzone.location="sidebar",$("#sidebar-img-checkbox:checkbox").prop("checked")?(sidebarImg.reset(),createClickableDropbox(e.currentTarget,dropzone.location),dragAndDrop("enable"),$("#sidebar-img-div").show(200,$.bez(o)).fadeIn(200,$.bez(o)).slideDown(200,$.bez(o)),$("#sidebar-img-dropbox-container").show(200,$.bez(o)).prop("disabled",!1).removeClass("disabled").fadeIn(200,$.bez(o)).slideDown(200,$.bez(o))):(compileButtonEnabler("enable"),$("#sidebar-img-label").siblings(".label-warning").detach(),dragAndDrop("disable"),$("#sidebar-img-div").hide(200,$.bez(o)).fadeOut(200,$.bez(o)).slideUp(200,$.bez(o)),$("#sidebar-img-dropbox-container").hide(200,$.bez(o)).fadeOut(200,$.bez(o)).slideUp(200,$.bez(o)).prop("disabled",!0).addClass("disabled")),sidebarImageLivePreview()}),$("iframe").load(function(){}),$("#compile").click(function(){$("input").addClass("disabled").prop("disabled",!0),$(".dropbox-container").addClass("disabled"),$(".dropbox").prop("disabled",!0),$("#save-images").detach(),$(".dropbox-panel").find(".in").length>0&&dragAndDrop("disable"),sass.readFile("flattish/utils/_vars.scss",function(e){void 0!==e?(console.log("reading _vars.scss"),e=replacer(e,"color",Object.keys(colors)),$("#large-header-checkbox:checkbox").prop("checked")?(console.log("checked"),e=replacer(e,"bool",!0,"headerLarge")):(console.log("not checked"),e=replacer(e,"bool",!1,"headerLarge")),$("#rotating-header-checkbox:checkbox").prop("checked")?(console.log("checked"),e=replacer(e,"bool",!0,"randomHeader"),e=replacer(e,"bool",$("#rotating-header__input").val(),"numHeaderImages")):(console.log("not checked"),e=replacer(e,"bool",!1,"randomHeader")),$("#sidebar-img-checkbox:checkbox").prop("checked")?(console.log("checked"),e=replacer(e,"bool",!0,"sidebarImg"),e=replacer(e,"bool",sidebarImg.height+"px","sidebarImgHeight")):(console.log("not checked"),e=replacer(e,"bool",!1,"sidebarImg")),sass.writeFile("flattish/utils/_vars.scss",e,function(e){e?console.log("_vars.scss successfully written"):console.log("writeFile failed"),sass.compileFile("flattish/flattish.scss",function(e){$("input").removeClass("disabled").prop("disabled",!1),$(".dropbox-container").removeClass("disabled"),$(".dropbox").prop("disabled",!1);for(var o=0;o<inlineStyleSelectors.length;o++)$("iframe").contents().find(inlineStyleSelectors[o]+"[style]").removeAttr("style");console.log("compiled"),console.log(e),$("#target").html(e.text.trim()),$("#clipboard-input").val(e.text.trim());var r=e.text.trim();r=r.replace(/%%dropdown%%/g,"../../../img/src/sidebar/dropdown--arrow-drop-down.png").replace(/%%dropdown-night%%/g,"../../../img/src/sidebar/dropdown-night--arrow-drop-down.png").replace(/%%header%%/g,"../../../img/headers/header.png").replace(/%%spritesheet%%/g,"../../../img/sprites/spritesheet.png").replace(/%%save%%/g,"../../../img/sprites/save.png").replace(/%%hide%%/g,"../../../img/sprites/hide.png").replace(/%%sidebar%%/g,sidebarImg.URL),$("iframe").contents().find("style").html("html,body{overflow-y:hidden;}"+r),$("#sidebar-img-checkbox:checkbox").prop("checked")&&-1!==sidebarImg.URL.search(/data:image\/png;base64,/)&&$("#compile-div").append('<a id="save-images" class="btn btn-default" href="'+sidebarImg.URL+'" download="sidebar.png">Save images</a>'),$(".dropbox-panel").find(".in").length>0&&dragAndDrop("enable")})})):console.log("readFile failed")})});