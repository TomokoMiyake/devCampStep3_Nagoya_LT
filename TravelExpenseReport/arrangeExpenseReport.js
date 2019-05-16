(function() {
  'use strict';

  // ドメイン情報
  var domain = 'ドメイン名に書き換え'; // ドメイン名(例 https://ドメイン名.cybozu.com)
  var space = 'スペースIDに書き換え'; // スペースID
  var thread = 'スレッドIDに書き換え'; // スレッドID

  // 1. レコード一覧画面の表示時に、ログインユーザーの申請中のレコードがあった場合、ステータスフィールドの背景色を変更する
  function checkRecords(event) {
    var user = kintone.getLoginUser();

    // フィールド要素を取得
    var elStatus = kintone.app.getFieldElements('ステータス');

    // 申請者とステータスチェック
    event.records.forEach(function(record, i) {
      var applicant = record.申請者.value[0].name;
      var status = record.ステータス.value;
      if (applicant.indexOf(user.name) > -1 && status === '申請中') {
        if (elStatus) {
          elStatus[i].style.backgroundColor = '#e5f0ff';
        }
      }
    });
  }

  // 2. レコード一覧画面の表示時に、ログインユーザーの申請中のレコード件数を表示する
  function getRecords(event) {
    // パラメータ定義
    var params = {
      app: event.appId,
      query: '申請者 in (LOGINUSER()) and ステータス = "申請中"'
    };

    // 成功時の関数
    function showCount(resp) {
      var countSpace = document.createElement('countSpace');
      var headerSpace = kintone.app.getHeaderSpaceElement();
      countSpace.id = 'space';
      headerSpace.id = 'headerSpace';
      countSpace.innerHTML = '<span class="deco">あなたの申請中のレコードは <span style=color:red>' + resp.records.length + ' 件</span>です</span>';
      headerSpace.style.margin = '0px 0px 20px 20px';
      headerSpace.appendChild(countSpace);
    }

    // 失敗時の関数
    function handleError(error) {
      window.alert(error.message);
    }

    // GETメソッドの実行
    kintone.api(kintone.api.url('/k/v1/records'), 'GET', params, showCount, handleError);
  }

  // 3. レコード一覧画面の表示時に、ボタンクリックで指定したスペースのスレッドに申請中ステータスのレコード件数を投稿し、承認リマインドをする
  function postSummary(event) {
    // 今月の申請中のレコード件数を取得する
    var getParams = {
      app: event.appId,
      query: '出発 = THIS_MONTH() and ステータス = "申請中"'
    };

    // GET 成功時の関数
    function handleGetSuccess(resp) {
      // 月次リマインド投稿をする
      var count = resp.records.length;
      var url = 'https://' + domain + '.cybozu.com/k/' + event.appId + '/?query=' + encodeURI('作業者 in (LOGINUSER()) and 出発=THIS_MONTH()');
      var postParams = {
        space: space,
        thread: thread,
        comment: {
          text: '今月の旅費精算申請アプリの申請中ステータスレコードは ' + count + ' 件です。\n上長メンバーは以下のリンク先を確認の上、承認をお願いします。\n' + url
        }
      };

      // POST 成功時の関数
      function handlePostSuccess() {
        window.alert('今月のサマリーをスレッドに投稿しました！');
      }

      // POST 失敗時の関数
      function handlePostError(error) {
        window.alert('エラーが発生しました。\nエラー内容: ' + error.message);
      }
      kintone.api(kintone.api.url('/k/v1/space/thread/comment', true), 'POST', postParams, handlePostSuccess, handlePostError);
    }

    // GET 失敗時の関数
    function handleGetError(error) {
      window.alert(error.message);
    }

    // GETメソッドの実行
    kintone.api(kintone.api.url('/k/v1/records'), 'GET', getParams, handleGetSuccess, handleGetError);
  }

  // ボタンクリックでスレッドに投稿
  function clickButton(event) {
    var button = document.createElement('button');
    button.id = 'button';
    button.innerHTML = 'スレッドに月次リマインド投稿';
    button.style.margin = '0px 0px 20px 20px';
    button.onclick = function() {
      postSummary(event);
    };
    kintone.app.getHeaderMenuSpaceElement().appendChild(button);
  }

  // 一覧画面の表示イベントで checkRecords, getRecords, clickButton 関数を実行
  kintone.events.on('app.record.index.show', checkRecords);
  kintone.events.on('app.record.index.show', getRecords);
  kintone.events.on('app.record.index.show', clickButton);

  // 4. レコード追加画面の保存成功後に、プロセスを次に回す
  function putRecord(event) {
    // パラメータ定義
    var params = {
      app: event.appId,
      id: event.recordId,
      action: '申請',
      assignee: event.record.上長.value[0].code
    };

    // ステータスが未処理の場合以外は何もしない
    if (event.record.ステータス.value !== '未処理') {
      return;
    }

    // 成功時の関数
    function handleSuccess() {

    }

    // 失敗時の関数
    function handleError(error) {
      window.alert('エラーが発生しました。手動で申請ボタンをクリックしてください。\nエラー内容：' + error.message);
    }

    // PUTメソッドの実行
    kintone.api(kintone.api.url('/k/v1/record/status'), 'PUT', params, handleSuccess, handleError);
  }

  // レコード追加画面と編集画面の保存成功後イベントで putRecord 関数を実行
  kintone.events.on([
    'app.record.create.submit.success',
    'app.record.edit.submit.success'
  ], putRecord);
})();