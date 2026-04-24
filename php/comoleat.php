<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ここでメール送信などの処理を行う
    // ...

    // セッションを削除してお問い合わせ完了画面を表示
    session_unset();
    session_destroy();
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>完了画面</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>お問い合わせ完了</h1>
        <p>お問い合わせありがとうございました。</p>
    </div>
</body>
</html>
