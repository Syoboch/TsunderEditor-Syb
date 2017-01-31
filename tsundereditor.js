(function (){

  //変数宣言
  var i,
       TEvar = {};

       TEvar.originalEvent = {},  //自作関数オブジェクト
       TEvar.bbsHost = "",
       TEvar.resData = {},
       TEvar.threadData = {},
       TEvar.idRunk = [],
       TEvar.dlAddress = "",
       TEvar.dlClone,
       TEvar.resLength,
       TEvar.editor,
       TEvar.aa;

       TEvar.threadData.title = "";
       TEvar.threadData.url = "";
       TEvar.threadData.idorip = "ID:";

       TEvar.resData.number = [];
       TEvar.resData.name = [];
       TEvar.resData.mail = [];
       TEvar.resData.time = [];
       TEvar.resData.id = [];
       TEvar.resData.text = [];
       TEvar.resData.visibility = [];
       TEvar.resData.ng = [];
       TEvar.resData.trNode = [];

  //関数式
  TEvar.originalEvent["comment"] = function(text){
    TEvar.editor.children["TEh_status_bar"].children["TEh_serif"].innerText = text;
  };

  TEvar.originalEvent["copy"] = function(){
    TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_output_text"].select();
    if(TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_output_text"].value == "") {
      TEvar.originalEvent["comment"]("……何をコピーしろって言うわけ！？");
      return;
    }
    document.execCommand("copy");
    TEvar.originalEvent["comment"]("コピーしたよー！");
  };

  TEvar.originalEvent["reset"] = function(){
    if (window.confirm("ξﾟ⊿ﾟ)ξ＜リセットしていい？")) {
      for ( i = 0; i < TEvar.resLength; i++ ) {
        TEvar.originalEvent["visibilityChange"](i, 1);
        TEvar.originalEvent["ngChange"](i, 0);
      }
      TEvar.originalEvent["idSeatchRegister"]("");
      TEvar.originalEvent["comment"]("リセット！！！");
    }
  };

  TEvar.originalEvent["editorModeChange"] = function(modeName){
    if (TEvar.editor.className.indexOf(modeName) == -1) {
      TEvar.editor.classList.add(modeName);
      return "add";
    } else {
      TEvar.editor.classList.remove(modeName);
      return "remove";
    }
  };

  TEvar.originalEvent["visibilityChange"] = function(code, changeMode){
    if (changeMode == 1) {
        TEvar.resData.trNode[code].classList.add("hidden");
        TEvar.resData.visibility[code] = 1;
    }
    if (changeMode == 0) {
        TEvar.resData.trNode[code].classList.remove("hidden");
        TEvar.resData.visibility[code] = 0;
    }
    if (changeMode == "reverse") {
      if(TEvar.resData.visibility[code] == 0) {
        TEvar.resData.trNode[code].classList.add("hidden");
        TEvar.resData.visibility[code] = 1;
      } else {
        TEvar.resData.trNode[code].classList.remove("hidden");
        TEvar.resData.visibility[code] = 0;
      }
    }
  };

  TEvar.originalEvent["ngChange"] = function(code, changeMode){
    var firstResFlg;
    if (changeMode == 1) {
        TEvar.resData.trNode[code].classList.add("ng");
        TEvar.resData.ng[code] = 1;
        TEvar.originalEvent["comment"]("このレスは除外するね！");
    }
    if (changeMode == 0) {
        TEvar.resData.trNode[code].classList.remove("ng");
        TEvar.resData.ng[code] = 0;
        TEvar.originalEvent["comment"]("レスの除外を解除したよ！");
    }
    if (changeMode == "reverse") {
      if (TEvar.resData.ng[code] == 0) {
        TEvar.resData.trNode[code].classList.add("ng");
        TEvar.resData.ng[code] = 1;
        TEvar.originalEvent["comment"]("このレスは除外するね！");
      } else {
        TEvar.resData.trNode[code].classList.remove("ng");
        TEvar.resData.ng[code] = 0;
        TEvar.originalEvent["comment"]("レスの除外を解除したよ！");
      }
    }
    if (changeMode == "id") {
      for ( i = 0; i < TEvar.resLength; i++ ) {
        if (code == TEvar.resData.id[i] || code == "*") {
          if (firstResFlg == undefined) {
            if (TEvar.resData.ng[i] == 0) { firstResFlg = 1 } else { firstResFlg = 0 }
          }
          if (firstResFlg == 1) {
            TEvar.resData.trNode[i].classList.add("ng");
            TEvar.resData.ng[i] = 1;
          } else {
            TEvar.resData.trNode[i].classList.remove("ng");
            TEvar.resData.ng[i] = 0;
          }
        }
        if (firstResFlg == 1) {
          TEvar.originalEvent["comment"]("『 " + code + " 』のレスは除外するね！");
        } else {
          TEvar.originalEvent["comment"]("『 " + code + " 』のレスの除外を解除したよ！");
        }
      }
    }
  };

  TEvar.originalEvent["idSeatchRegister"] = function(idName){
    var idSeatchTextBox = TEvar.editor.children["TEh_tool_box"].children["TEh_id_seatch_box"],
         idList;
    if (idName == "") {
      idSeatchTextBox.value = "";
      return;
    }
    if (idSeatchTextBox.value == "") {
      idSeatchTextBox.value = idName;
      TEvar.originalEvent["comment"]("『 " + idName + " 』を抽出ID欄に入力したよ！");
    } else {
      idList = idSeatchTextBox.value.replace(/ID:/g, "").split(/ *, */);
      if (idList.indexOf(idName) == -1) {
        idList.push(idName);
        TEvar.originalEvent["comment"]("『 " + idName + " 』を抽出ID欄に入力したよ！");
      } else {
        idList.splice( idList.indexOf(idName), 1);
        TEvar.originalEvent["comment"]("『 " + idName + " 』を抽出ID欄から消去したよ！");
      }
      idSeatchTextBox.value = idList.join(" , ");
    }
    TEvar.originalEvent["idSeatchSubmit"]();
  };

  TEvar.originalEvent["idSeatchSubmit"] = function(){
    var idList = TEvar.editor.children["TEh_tool_box"].children["TEh_id_seatch_box"].value.replace(/ |ID:/g, "").split(",");
    for ( i = 0; i < TEvar.resLength; i++ ) {
      if (idList.indexOf(TEvar.resData.id[i]) != -1 || idList.indexOf("*") != -1) {
        TEvar.originalEvent["visibilityChange"](i, 0);
      } else {
        TEvar.originalEvent["visibilityChange"](i, 1);
      }
    }
  };

  TEvar.originalEvent["resSelect"] = function(){
    var code = this.dataset.code;
    //通常
    if (TEvar.editor.className.indexOf("ng_mode") == -1) {
      TEvar.originalEvent["idSeatchRegister"](TEvar.resData.id[code]);
    }
    //NGモード
    if (TEvar.editor.className.indexOf("ng_mode") != -1) {
      TEvar.originalEvent["ngChange"](code, "reverse");
    }
  };

  TEvar.originalEvent["idSelect"] = function(e){
    var selectId,
         firstResFlg;
    if (e.target.localName != "li") { return; }
    if (e.target == e.target.parentElement.children[0]) {
      selectId = "*";
    } else {
      selectId = e.target.innerText.split(/ID:|発信元:/)[1];
    }
    //通常
    if (TEvar.editor.className.indexOf("ng_mode") == -1) {
      TEvar.originalEvent["idSeatchRegister"](selectId);
    }
    //NGモード
    if (TEvar.editor.className.indexOf("ng_mode") != -1) {
      TEvar.originalEvent["ngChange"](selectId, "id")
    }
  };

  TEvar.originalEvent["go"] = function(mode){
    var afterText = new Array(),
         dokushaClassAttribute;
    for ( i = 0; i < TEvar.resLength; i++ ) {
      if (TEvar.resData.ng[i] == 1) { continue; }
      if (TEvar.resData.visibility[i] == 0 || TEvar.editor.className.indexOf("dokusha_mode") != -1) {
        if (TEvar.resData.visibility[i] == 1 && TEvar.editor.className.indexOf("dokusha_mode") != -1) {
          dokushaClassAttribute = ' class="dokusha"'
        } else {
          dokushaClassAttribute = ""
        }
        afterText[i] =
          '<dt' + dokushaClassAttribute + '>\n' +
          TEvar.resData.number[i] + ' 名前：<span class="name">' + TEvar.resData.name[i] + '</span>[' +
          TEvar.resData.mail[i] + '] 投稿日：' + TEvar.resData.time[i] + '\n' +
          "<dd>\n" + TEvar.resData.text[i];
      }
    }
    if (afterText.join("") == "") {
      TEvar.originalEvent["comment"]("……まず、抽出したいIDを選んでよね！");
    } else {
      afterText[afterText.length - 1] = afterText[afterText.length - 1].replace(/\n$/, "");
      afterText = afterText.join("");
      if (mode == "text") {
        afterText = afterText.replace(/<dt.*?>\n|<dd.*?>\n/g, "").replace(/<.+?>/g, "").replace(/\n$/, "");
      }
      TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_output_text"].value = afterText;
      TEvar.originalEvent["editorModeChange"]("popup");
      TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_output_text"].scrollTop = 0;
      TEvar.originalEvent["comment"]("出力できたよ！");
    }
  };

  TEvar.originalEvent["osawari"] = function(){
    TEvar.originalEvent["comment"]("さわらないで");
  };

  //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

  //対応ページの判断～これをしなきゃ始まらない～
  if (location.hostname.indexOf("2ch.net") != -1) {
    if (location.href.indexOf("read.cgi") != -1) { TEvar.bbsHost = "2ch-net"; }
  }
  if (location.hostname.indexOf("2ch.sc") != -1) {
    if (location.href.indexOf("read.cgi") != -1) { TEvar.bbsHost = "2ch-sc"; }
  }
  if (location.hostname.indexOf("jbbs.shitaraba.net") != -1) {
    if (location.href.indexOf("read.cgi") != -1) { TEvar.bbsHost = "shitaraba-ima"; }
    if (location.href.indexOf("read_archive.cgi") != -1) { TEvar.bbsHost = "shitaraba-kako"; }
  }
  if (TEvar.bbsHost == "") { alert("このサイトには対応してません\nξ；ﾟ⊿ﾟ)ξ＜ｺﾞﾒﾝﾈ"); return; }

  //2度目は無効
  if (document.getElementById("TEh_black_screen") != null) { return; }

  //したらば過去ログ広告の異様なz-indexを減らす
  (function (){
    if (TEvar.bbsHost == "shitaraba-kako") {
      var ad = document.getElementsByClassName("adingoFluctTracking");
      if (ad.length > 0) { ad[0].style.zIndex = "99"; }
    }
  }());

  //案内役決定
  if (1 > Math.floor(Math.random()*16) ) {
    TEvar.aa = "ξ＾ω＾)ξ＜";
  } else {
    TEvar.aa = "ξﾟ⊿ﾟ)ξ＜";
  }

  //CSS追加（読み込み表示用簡易版）
  (function (){
    var myCSS = document.createElement("style");
    myCSS.innerHTML =
      "div#TEh_black_screen" +
        "{ background-color:rgba(0,0,0,0.5); width:100%; height:100%; box-sizing:border-box; padding:8px; position:fixed; top:0px; left:0px; z-index:100; overflow:auto; }" +
      "div#TEh_loading_window" +
        "{ background-color:#fff; font-size:12px; text-align:center; max-width:200px; margin:auto; padding:4px; border:2px solid #ccc; border-radius:4px;" +
        "  box-shadow:0px 2px 8px 0px #333; display:none; }" +
      "div#TEh_tsundereditor.loading" +
        "{ display:none; }" +
      "div#TEh_tsundereditor.loading + div#TEh_loading_window" +
        "{ display:block; }" +
      "";
    document.getElementsByTagName("head")[0].appendChild(myCSS);
  }());

  //form作成（読み込み表示用簡易版）
  (function (){
    var blackScreen,
         loadingWindow;
    blackScreen = document.createElement("div");
    blackScreen.id = "TEh_black_screen";

    loadingWindow = document.createElement("div");
    loadingWindow.id = "TEh_loading_window";
    loadingWindow.innerHTML = "ξﾟ⊿ﾟ)ξ＜読み込み中！！";

    TEvar.editor = document.createElement("div");
    TEvar.editor.id = "TEh_tsundereditor";
    TEvar.editor.className = "loading";

    document.body.insertBefore(blackScreen, document.body.firstChild);
    blackScreen.insertBefore(loadingWindow, blackScreen.firstChild);
    blackScreen.insertBefore(TEvar.editor, blackScreen.firstChild);
  }());

  //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

  //読み込み表示してから処理開始、以降の処理を全てsetTimeout内で実行する
  setTimeout(function(){

    //dl読み込み
    (function (){
      var dl;
      (function (){
        dl = document.getElementById("thread-body");
        if (dl != null) { TEvar.dlAddress = dl; return; }

        dl = document.getElementById("thread");
        if (dl != null) { TEvar.dlAddress = dl; return; }

        dl = document.getElementsByClassName("thread");
        if (dl.length == 1) { TEvar.dlAddress = dl[0]; return; }

        dl = document.body.getElementsByTagName("dl");
        if (dl.length == 1) { TEvar.dlAddress = dl[0]; return; }
      }());
      TEvar.dlClone = TEvar.dlAddress.cloneNode(true);
    }());
    if (TEvar.dlAddress == "") { alert("なんかダメっぽい\nξ；ﾟ⊿ﾟ)ξ＜ｺﾞﾒﾝﾈ"); return; }

    //dl要素の分解、格納
    (function (){
      var dtList,
           ddList,
           matchPattern = {},
           dt_parts,
           idFirstResNumber,
           ipResCounter = 0,
           oldHTML = "";
      //2chのHTML構造を分類
      if (TEvar.dlAddress.tagName.toLowerCase() == "div" && TEvar.dlAddress.className == "thread") {
        oldHTML = "old";
      }
      //dtとddの抽出
      if (oldHTML == "old") {
        dtList = TEvar.dlClone.getElementsByClassName("post");
        ddList = TEvar.dlClone.getElementsByClassName("message");
      } else {
        dtList = TEvar.dlClone.getElementsByTagName("dt");
        ddList = TEvar.dlClone.getElementsByTagName("dd");
      }
      TEvar.resLength = dtList.length;
      //dtの分解パターン登録
      (function (){
        if (oldHTML == "old") {
          matchPattern = new RegExp(/^<div class="number">(\d*?) : <\/div><div class="name">(.*?)<\/div><div class="date">(.*?)<\/div>$/);
          return;
        }
        if (TEvar.bbsHost == "2ch-net" || TEvar.bbsHost == "2ch-sc") {
          matchPattern = new RegExp(/^(\d*?) ：<.*?>(<b>.*?<\/b>)<\/.*?>：(.*?)$/);
          return;
        }
        if (TEvar.bbsHost == "shitaraba-ima") {
          matchPattern = new RegExp(/^\s*?<a href="http:\/\/jbbs.shitaraba.net\/bbs\/read.*?" rel="nofollow">(\d*?)<\/a>：\s*?<.*?>\s*(.*?)\n\s*?<\/.*?>\s*?：(.*?)\n\s*?$/);
          return;
        }
        if (TEvar.bbsHost == "shitaraba-kako") {
          matchPattern = new RegExp(/^<a name="\d*?">(\d*?)<\/a> ：<.*?>(<b>.*?<\/b>)<\/.*?>：(.*?)$/);
          return;
        }
      }());
      //格納開始
      for ( i = 0; i < TEvar.resLength; i++ ) {
        //ddを変換し格納
        TEvar.resData.text[i] = ddList[i].innerHTML;
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/^\n\s*?\n/, "");  //冒頭の空白を削除
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/<br>\s$/, "<br>");  //末尾の空白を削除
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/^ *| *$|\n/g, "");
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/ *<br> */g, "<br>");
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/<!--.*?-->| *<div.+?$| *<table.+?$/g, "");
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/<a href=".+?" target="_blank">(.+?)<\/a>/g, '<a href="$1" target="_blank">$1</a>');
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/<a href=".+?" target="_blank">(\&gt;\&gt;[-\d]+?)<\/a>/g, "$1");
        TEvar.resData.text[i] = TEvar.resData.text[i].replace(/<br>/g, "<br>\n");
        if (oldHTML == "old") { TEvar.resData.text[i] = TEvar.resData.text[i] + "<br>\n<br>\n"; }
        //dtを変換し格納
        if (oldHTML == "old") {
          dt_parts = dtList[i].innerHTML.replace(/ $|<div class="message">.*$/g, "").match(matchPattern);
        } else {
          dt_parts = dtList[i].innerHTML.replace(/ $/, "").match(matchPattern);
        }
        TEvar.resData.number[i] = dt_parts[1];
        if (oldHTML == "old") {
          TEvar.resData.name[i] = dt_parts[2].replace(/<a .+?>|<\/a>/g, "");
        } else {
          TEvar.resData.name[i] = dt_parts[2];
        }
        TEvar.resData.time[i] = dt_parts[3].replace(/<.+?>/g, "");
        TEvar.resData.visibility[i] = 1;
        TEvar.resData.ng[i] = 0;
        if (dt_parts[3].indexOf(" ID:") == -1 && dt_parts[3].indexOf(" 発信元:") == -1) {
          TEvar.resData.id[i] = "---";
        } else {
          TEvar.resData.id[i] = dt_parts[3].split(/ ID:| 発信元:/)[1].replace(/<.+?>/g, "");
          if (dt_parts[3].indexOf(" 発信元:") != -1) { ipResCounter++; }
        }
        if (dt_parts[0].indexOf('<a href="mailto:') == -1) {
          TEvar.resData.mail[i] = "";
        } else {
          TEvar.resData.mail[i] = dt_parts[0].match(/<a href="mailto:(.*?)">/)[1];
        }
        //IDカウント
        idFirstResNumber = TEvar.resData.id.indexOf(TEvar.resData.id[i]);
        if (TEvar.idRunk[idFirstResNumber] == undefined) {
          TEvar.idRunk[idFirstResNumber] = { idName: TEvar.resData.id[i], idHit: 1, idFirstRes: idFirstResNumber };
        } else {
          TEvar.idRunk[idFirstResNumber].idHit++;
        }
      }
      if (ipResCounter > TEvar.resLength / 2) {
        TEvar.threadData.idorip = "発信元:";
        TEvar.originalEvent["editorModeChange"]("ip_thread");
      }
    }());

    //IDカウンターのソート
    TEvar.idRunk = TEvar.idRunk.filter(Boolean);
    TEvar.idRunk.sort( function(a,b) {
      if(b.idHit - a.idHit != 0){
        return b.idHit - a.idHit;
      } else {
        return a.idFirstRes - b.idFirstRes;
      }
    });

    //スレタイ検出
    if (document.getElementsByTagName("h1")[0] != undefined ) {
      TEvar.threadData.title = document.getElementsByTagName("h1")[0].innerText;
    } else {
      TEvar.threadData.title = document.title;
    }

    //URL検出
    (function (){
      var URLSeed = location.href.split("/");
      URLSeed.pop();
      TEvar.threadData.url = URLSeed.join("/") + "/";
    }());

    //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

    //CSS追加
    (function (){
      var myCSS = document.createElement("style");
      myCSS.innerHTML =
        "body" +
          "{ width:100%; height:100%; position:fixed; }" +

        "div#TEh_tsundereditor" +
          "{ background-color:#fff; font-size:12px; width:900px; margin:auto; padding:4px; border:2px solid #ccc; border-radius:4px;" +
          "  box-shadow:0px 2px 8px 0px #333; position:relative; }" +
        "div#TEh_tsundereditor > *" +
          "{ max-width:100%; margin:4px; box-sizing:border-box; }" +
        "div#TEh_tsundereditor::after" +
          "{ content:''; clear:both; display:block; }" +
        "div#TEh_tsundereditor.ng_mode" +
          "{ background-color:#fdd; }" +
        "div#TEh_tsundereditor.popup" +
          "{ border-color:#999; }" +

        "div#TEh_tsundereditor button" +
          "{ font:inherit; background-color:#fff; padding:2px 4px; border:1px solid #999; border-radius:4px; box-shadow:0px -4px 0px 0px #eee inset; }" +

        "div#TEh_tsundereditor > div#TEh_title_bar" +
          "{ margin:2px 4px 6px; float:left; }" +
        "div#TEh_tsundereditor > div#TEh_title_bar > a" +
          "{ color:inherit; text-decoration:none; }" +
        "div#TEh_tsundereditor > div#TEh_title_bar > a:hover" +
          "{ color:#999; }" +

        "div#TEh_tsundereditor > div#TEh_main_area" +
          "{ background-color:#eee; height:300px; border:1px solid #aaa; overflow-y:scroll; resize:vertical; clear:both; }" +

        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter" +
          "{ font:inherit; margin:-1px 0px 0px -1px; border-collapse:collapse; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr" +
          "{ background-color:#fff; cursor:pointer; }" +
        "div#TEh_tsundereditor:not(.dokusha_mode) > div#TEh_main_area > table#TEh_res_selecter > tr.hidden:not(.ng)" +
          "{ color:#666; background-color:#ddd; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr.ng" +
          "{ color:#c33; background-color:#ddd; }" +
        "div#TEh_tsundereditor.dokusha_mode > div#TEh_main_area > table#TEh_res_selecter > tr.hidden:not(.ng)" +
          "{ color:#69f; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td" +
          "{ color:inherit; background-color:inherit; margin:0px; padding:2px 4px; border:1px solid #ccc; white-space:pre; overflow:hidden; text-overflow:ellipsis; display:table-cell; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td > span.balloon" +
          "{ background-color:inherit; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.name:hover," +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.mail:hover," +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.id:hover" +
          "{ overflow:visible; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td:hover > span.balloon" +
          "{ min-width:100%; margin:-3px -5px; padding:2px 4px; border:1px solid #ccc; display:inline-block; position:relative; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.checkbox::before" +
          "{ content:'○'; }" +
        "div#TEh_tsundereditor:not(.dokusha_mode) > div#TEh_main_area > table#TEh_res_selecter > tr.hidden > td.checkbox::before," +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr.ng > td.checkbox::before" +
          "{ content:'×'; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.name" +
          "{ max-width:242px; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.name > span.balloon > span.tag" +
          "{ opacity:0.4; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.mail" +
          "{ max-width:48px; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.id" +
          "{ max-width:100px; }" +
        "div#TEh_tsundereditor.ip_thread > div#TEh_main_area > table#TEh_res_selecter > tr > td.id" +
          "{ max-width:120px; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td.text" +
          "{ max-width:960px; }" +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr > td a" +
          "{ color:inherit; text-decoration:none; }" +

        "div#TEh_tsundereditor > ul#TEh_id_selecter" +
          "{ background-color:#eee; height:164px; max-width:200px; padding:0px; border:1px solid #aaa; overflow-y:scroll; float:left; }" +
        "div#TEh_tsundereditor > ul#TEh_id_selecter > li" +
          "{ background-color:#fff; padding:2px 6px; border:1px solid #ccc; border-width:0px 0px 1px 0px; display:block; cursor:pointer; }" +
        "div#TEh_tsundereditor > ul#TEh_id_selecter > li:last-of-type" +
          "{ margin-bottom:-1px; }" +

        "div#TEh_tsundereditor > div#TEh_tool_box" +
          "{ float:left; }" +
        "div#TEh_tsundereditor > div#TEh_tool_box > *" +
          "{ margin:0px 6px 8px 0px; }" +
        "div#TEh_tsundereditor.ng_mode > div#TEh_tool_box > button#TEh_ng_mode_button" +
          "{ color:#fff; background-color:#f99; box-shadow:0px 4px 0px 0px #f88 inset; }" +
        "div#TEh_tsundereditor > div#TEh_tool_box > label#TEh_dokusha_checkbox" +
          "{ font-size:14px; padding:2px 4px; border:1px dotted #ccc; display:inline-block; }" +
        "div#TEh_tsundereditor > div#TEh_tool_box > label#TEh_dokusha_checkbox > input" +
          "{ width:14px; height:14px; margin:0px 0px 0px 2px; vertical-align:text-top; }" +
        "div#TEh_tsundereditor > div#TEh_tool_box > input#TEh_id_seatch_box" +
          "{ font:inherit; font-size:14px; width:520px; box-sizing:border-box; padding:2px 4px; border:1px solid #aaa; vertical-align:bottom; }" +
        "div#TEh_tsundereditor > div#TEh_tool_box > hr" +
          "{ margin:0px; border:none; }" +

        "div#TEh_tsundereditor > div#TEh_status_bar" +
          "{ float:left; clear:both; }" +

        "div#TEh_tsundereditor > ul#TEh_thread_data" +
          "{ color:#666; text-align:right; padding:0px 4px 4px; position:absolute; right:0px; bottom:0px; }" +
        "div#TEh_tsundereditor > ul#TEh_thread_data > li" +
          "{ margin:4px 0px 0px auto; display:table; }" +

        "div#TEh_tsundereditor > div#TEh_popup" +
          "{ background-color:rgba(0,0,0,0.25); width:100%; height:100%; position:absolute; top:-4px; left:-4px; display:none; z-index:1; }" +
        "div#TEh_tsundereditor.popup > div#TEh_popup" +
          "{ display:block; }" +

        "div#TEh_tsundereditor > div#TEh_popup > div#TEh_output_window" +
          "{ background-color:#fff; margin:auto; padding:8px 12px; border:2px solid #ccc; border-radius:4px; box-shadow:0px 2px 8px 0px #333;" +
          "  display:table; position:relative; top:12px; }" +
        "div#TEh_tsundereditor > div#TEh_popup > div#TEh_output_window > textarea#TEh_output_text" +
          "{ font:inherit; margin-bottom:8px; padding:4px; width:720px; height:320px; border:1px solid #999;" +
          "  overflow-y:scroll; display:block; word-break:break-all; vertical-align:bottom; resize:vertical; }" +
        "div#TEh_tsundereditor > div#TEh_popup > div#TEh_output_window > button" +
          "{ margin-right:4px; }" +

        "div#TEh_tsundereditor > ul#TEh_id_selecter > li:hover," +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr:hover" +
          "{ background-color:#ffc; }" +
        "div#TEh_tsundereditor:not(.dokusha_mode) > div#TEh_main_area > table#TEh_res_selecter > tr.hidden:hover," +
        "div#TEh_tsundereditor > div#TEh_main_area > table#TEh_res_selecter > tr.ng:hover" +
          "{ background-color:#ddb; }" +
        "";
      document.getElementsByTagName("head")[0].appendChild(myCSS);
    }());

    //formの中身を作成
    TEvar.editor.innerHTML =
      '<div id="TEh_popup">' +
        '<div id="TEh_output_window">' +
          '<textarea id="TEh_output_text"></textarea>' +
          '<button id="TEh_copy_button" type="button">クリップボードにコピー</button>' +
          '<button id="TEh_close_button" type="button">閉じる</button>' +
        '</div>' +
      '</div>' +
      '<div id="TEh_title_bar">■ <a href="http://buntsundo.web.fc2.com/tool/tsundereditor/top.html" target="_blank">TsunderEditor ver.0.9.1</a></div>' +
      '<div id="TEh_main_area"></div>' +
      '<ul id="TEh_id_selecter"></ul>' +
      '<div id="TEh_tool_box">' +
        '<label id="TEh_dokusha_checkbox">読者レス<input type="checkbox"></label>' +
        '<input type="text" id="TEh_id_seatch_box">' +
        '<hr>' +
        '<button id="TEh_ng_mode_button" type="button">レスの除外</button>' +
        '<button id="TEh_html_output_button" type="button">HTML出力</button>' +
        '<button id="TEh_text_output_button" type="button">テキスト出力</button>' +
        '<button id="TEh_reset_button" type="button">リセット</button>' +
      '</div>' +
      '<ul id="TEh_data_log"></ul>' +
      '<div id="TEh_status_bar">' + TEvar.aa + '<span id="TEh_serif">読み込み中！！</span></div>' +
      '<ul id="TEh_thread_data">' +
        '<li>' + TEvar.threadData.title +
        '<li>' + TEvar.threadData.url +
      '</ul>';

    //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

    //TEh_main_area出力
    (function (){
      var tableElm = document.createElement("table");
      tableElm.id = "TEh_res_selecter";
      for ( i = 0; i < TEvar.resLength; i++ ) {
        TEvar.resData.trNode[i] = document.createElement("tr");
        TEvar.resData.trNode[i].setAttribute("data-code", i);
        TEvar.resData.trNode[i].className = "hidden";
        TEvar.resData.trNode[i].innerHTML =
          '<td class="checkbox">' +
          '<td class="number">' +
          '<td class="name"><span class="balloon"></span>' +
          '<td class="mail"><span class="balloon"></span>' +
          '<td class="time">' +
          '<td class="id"><span class="balloon"></span>' +
          '<td class="text">';
        TEvar.resData.trNode[i].children[1].innerText = TEvar.resData.number[i];
        TEvar.resData.trNode[i].children[2].children[0].innerHTML = TEvar.resData.name[i].replace(/<(.+?)>/g, "<span class='tag'>&lt;$1&gt;</span>");
        TEvar.resData.trNode[i].children[3].children[0].innerHTML = "[" + TEvar.resData.mail[i] + "]";
        TEvar.resData.trNode[i].children[4].innerText = TEvar.resData.time[i].split(/ ID:| 発信元:/)[0];
        TEvar.resData.trNode[i].children[5].children[0].innerText = TEvar.threadData.idorip + TEvar.resData.id[i];
        TEvar.resData.trNode[i].children[6].innerHTML = TEvar.resData.text[i].replace(/<br>\n/g, " ").replace(/<.+?>/g, "").substring(0, 300);
        TEvar.resData.trNode[i].addEventListener("click", TEvar.originalEvent["resSelect"] );
        tableElm.appendChild(TEvar.resData.trNode[i]);
      }
      TEvar.editor.children["TEh_main_area"].appendChild(tableElm);
    }());

    //TEh_id_selecter出力
    (function (){
      var listHTML = [];
      listHTML[0] = "<li>(全" + TEvar.resLength + "レス) すべてのレス";
      for ( i = 0; i < TEvar.idRunk.length; i++ ) {
        listHTML[i + 1] = "<li>(" + TEvar.idRunk[i].idHit + "レス) " + TEvar.threadData.idorip + TEvar.idRunk[i].idName;
      }
      TEvar.editor.children["TEh_id_selecter"].innerHTML = listHTML.join("");
    }());

    //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

    //dlの軽量化
    (function (){
      for ( i = TEvar.dlAddress.children.length - 1; i >= 20; i-- ) {
        TEvar.dlAddress.removeChild(TEvar.dlAddress.children[i]);
      }
    }());

    //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

    //各種イベント設定
    TEvar.editor.children["TEh_id_selecter"].addEventListener("click", TEvar.originalEvent["idSelect"] );

    TEvar.editor.children["TEh_tool_box"].children["TEh_dokusha_checkbox"].children[0].addEventListener("click", function(){
      var commentFlg = TEvar.originalEvent["editorModeChange"]("dokusha_mode");
      if (commentFlg == "add") { TEvar.originalEvent["comment"]("読者レスあり！"); } else { TEvar.originalEvent["comment"]("読者レスなし！"); }
    });
    TEvar.editor.children["TEh_tool_box"].children["TEh_ng_mode_button"].addEventListener("click", function(){ 
      var commentFlg = TEvar.originalEvent["editorModeChange"]("ng_mode");
      if (commentFlg == "add") { TEvar.originalEvent["comment"]("レス除外するよ！"); } else { TEvar.originalEvent["comment"]("レス除外おわり！"); }
    });
    TEvar.editor.children["TEh_tool_box"].children["TEh_html_output_button"].addEventListener("click", function(){ TEvar.originalEvent["go"]("html") } );
    TEvar.editor.children["TEh_tool_box"].children["TEh_text_output_button"].addEventListener("click", function(){ TEvar.originalEvent["go"]("text") } );
    TEvar.editor.children["TEh_tool_box"].children["TEh_reset_button"].addEventListener("click", TEvar.originalEvent["reset"] );
    TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_copy_button"].addEventListener("click", TEvar.originalEvent["copy"] );
    TEvar.editor.children["TEh_popup"].children["TEh_output_window"].children["TEh_close_button"].addEventListener("click", function(){ TEvar.originalEvent["editorModeChange"]("popup"); } );
    TEvar.editor.children["TEh_status_bar"].addEventListener("click", TEvar.originalEvent["osawari"] );

    TEvar.editor.children["TEh_tool_box"].children["TEh_id_seatch_box"].addEventListener("blur", TEvar.originalEvent["idSeatchSubmit"] );
    TEvar.editor.children["TEh_tool_box"].children["TEh_id_seatch_box"].addEventListener("keyup", function(e){
      if (e.keyCode == 13) { TEvar.originalEvent["idSeatchSubmit"]() }
    });

    TEvar.editor.children["TEh_thread_data"].addEventListener("mouseup", function(e){
      var range = document.createRange();
      range.selectNodeContents(e.target);
      window.getSelection().addRange(range);
    });

    //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

    TEvar.originalEvent["comment"]("読み込み完了！");
    TEvar.originalEvent["editorModeChange"]("loading");
    console.log(TEvar);

  }, 100);  //setTimeout記述終了

  //～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

/*
  Todo
  ・---
  Memo
  ・ソースHTMLは信用できない

2ch.net（CGIモード）
2ch.sc（CGIモード）
2ch.sc（JSモード）
…<dl class="thread">
2ch.net（JSモード）
…<dl id="thread">
したらば掲示板
…<dl id="thread-body">
したらば掲示板（過去ログ）
…<dl>
2ch.net（古い板）
…<div class="thread">

*/

}());