document.addEventListener('DOMContentLoaded', function() {

  // ハンバーガーメニュー開閉
  $(".openbtn1").click(function () {
    $(this).toggleClass('active');
    $("#g-nav").toggleClass('panelactive');
  });

  $("#g-nav a").click(function () {
    $(".openbtn1").removeClass('active');
    $("#g-nav").removeClass('panelactive');
  });

  // splash_logo（現在コメントアウト中のため存在チェック）
  var splash_logo = document.getElementById("splash_logo");
  if (splash_logo) {
    splash_logo.onload = function() {
      setTimeout(function() {
        splash_logo.style.marginLeft = "-100px";
      }, 1000);
    };
  }

});