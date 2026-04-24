document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    // フォームデータを取得
    var formData = new FormData(event.target);

    // AJAXリクエストを作成してサーバーに送信
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "contact_form.php", true);
    xhr.onload = function() {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                // 送信完了のメッセージを表示
                document.getElementById("success-message").style.display = "block";
                document.querySelector("form").reset();
            } else {
                alert("Error: " + xhr.statusText);
            }
        }
    };
    xhr.onerror = function() {
        alert("Error: " + xhr.statusText);
    };
    xhr.send(formData);
});
