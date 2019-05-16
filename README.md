# Overview
- [kintone devCamp Step3@名古屋](https://eventregist.com/e/devcamp-step3-190509nagoya) LT のコードサンプル
- 出張申請アプリと旅費精算申請アプリを利用
  - 出張に行く前に、「出張申請アプリ」にて申請を提出し、帰ってきてから「旅費精算申請アプリ」にて経費精算をする流れ

# Files
- 出張&旅費精算アプリテンプレ.zip(アプリテンプレート)
- TravelPreApproval（出張申請アプリに適用）
  - arrangePreApproval.js
  - arrangePreApproval.css
- TravelExpenseReport（旅費精算申請アプリに適用）
  - arrangeExpenseReport.js
  - arrangeExpenseReport.css

※ 各自の kintone 環境に合わせて、コードの編集が必要な箇所あり（アプリID/ドメイン名/スペースID/スレッドID）

# Customization
- 出張申請アプリ
  - レコード詳細画面の表示時に、「旅費申請アプリに登録」ボタンをクリックした時に、出張概要のフィールドデータを一部引き継いだ状態で「旅費申請アプリ」にレコードを新規追加する
- 旅費精算申請アプリ
  - レコード一覧画面の表示時に、ログインユーザーの申請中のレコードがあった場合、ステータスフィールドの背景色を変更する
  - レコード一覧画面の表示時に、ログインユーザーの申請中のレコード件数を表示する
  - レコード一覧画面の表示時に、「スレッドに月次リマインド投稿」ボタンをクリックした時に、指定したスペースのスレッドに「申請中」ステータスのレコード件数を投稿し、承認リマインドをする
  - レコード追加画面と編集画面の保存成功後に、プロセスを次に回す

# Reference
- [テンプレートファイルからアプリを作成する](https://jp.cybozu.help/k/ja/user/create_app/app_csv/add_app_template_file.html)
- [初めての kintone REST API 旅費精算申請アプリを "ちょっとだけ" 使いやすくしよう](https://qiita.com/Mikei/items/38660afeb658585da170)
- [スペースのスレッドにアプリの集計データを投稿する](https://developer.cybozu.io/hc/ja/articles/212152403)
