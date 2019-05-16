(function() {
  'use strict';

  // 1. レコード詳細画面でボタンクリックした時に、旅費申請アプリにレコードを追加する
  // レコード追加関数
  var appId = 'アプリIDに書き換え'; // 旅費精算申請アプリのアプリID

  function postRecord(event) {
    // パラメータ定義
    var params = {
      app: appId,
      record: {
        申請者: {
          value: [
            {
              code: event.record.申請者.value.code
            }
          ]
        },
        上長: {
          value: [
            {
              code: event.record.承認者.value[0].code
            }
          ]
        },
        行き先: {
          value: event.record.出張先.value
        },
        出発: {
          value: event.record.出発.value
        },
        帰着: {
          value: event.record.帰着.value
        }
      }
    };

    // 成功時の関数
    function handleSuccess() {
      window.alert('旅費申請アプリにレコード登録しました！');
    }

    // 失敗時の関数
    function handleError(error) {
      window.alert('エラーが発生しました。\nエラー内容：' + error.message);
    }

    // POSTメソッドの実行
    kintone.api(kintone.api.url('/k/v1/record', true), 'POST', params, handleSuccess, handleError);
  }

  // ボタンクリックでのレコード追加関数
  function clickButton(event) {
    var button = document.createElement('button');
    button.id = 'button';
    button.innerHTML = '旅費申請アプリに登録';
    button.style.margin = '20px 0px 20px 20px';
    button.onclick = function() {
      postRecord(event);
    };
    kintone.app.record.getHeaderMenuSpaceElement().appendChild(button);
  }

  // レコード詳細画面表示イベントで clickButton 関数を実行
  kintone.events.on('app.record.detail.show', clickButton);
})();