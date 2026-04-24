// ========== お気に入り機能 ==========
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('fukuoka_ramen_favorites') || '[]'); }
  catch(e) { return []; }
}
function saveFavorites(favs) {
  localStorage.setItem('fukuoka_ramen_favorites', JSON.stringify(favs));
}
function isFavorite(id) {
  return getFavorites().some(f => String(f.id) === String(id));
}
function toggleFavorite(shop) {
  let favs = getFavorites();
  const exists = favs.some(f => String(f.id) === String(shop.id));
  if (exists) { favs = favs.filter(f => String(f.id) !== String(shop.id)); }
  else { favs.push(shop); }
  saveFavorites(favs);
  return !exists;
}
function showToast(msg) {
  let t = document.getElementById('ramen-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'ramen-toast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1a1a;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:99999;opacity:0;transition:all 0.25s ease;white-space:nowrap;font-family:"Noto Sans JP",sans-serif;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2200);
}
window.handleFavToggle = function(encodedShop) {
  const shop = JSON.parse(decodeURIComponent(encodedShop));
  const added = toggleFavorite(shop);
  const btn = document.getElementById('fav-btn-' + shop.id);
  if (btn) {
    btn.textContent = added ? '⭐ 登録済み' : '☆ お気に入り';
    btn.style.background = added ? '#c62d2d' : 'transparent';
    btn.style.color = added ? '#fff' : '#c62d2d';
    btn.style.borderColor = '#c62d2d';
  }
  showToast(added ? '⭐ ' + shop.name + ' を追加しました' : shop.name + ' を削除しました');
};
function buildInfoHTML(shop) {
  const fav = isFavorite(shop.id);
  const encoded = encodeURIComponent(JSON.stringify(shop));
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(shop.name + ' 福岡');
  return '<div style="font-family:\'Noto Sans JP\',sans-serif;width:260px;overflow:hidden;border-radius:12px;">'
    // ヘッダー
    + '<div style="background:#1a1a1a;padding:14px 16px;">'
    + '<div style="font-size:14px;font-weight:700;color:#fff;line-height:1.4;margin-bottom:4px;">' + shop.name + '</div>'
    + '<div style="font-size:11px;color:rgba(255,255,255,0.55);">' + (shop.genre || 'ラーメン') + (shop.address ? ' · ' + shop.address.replace(/〒\d{3}-\d{4}\s*/,'').split(' ')[0] : '') + '</div>'
    + '</div>'
    // ボディ
    + '<div style="padding:12px 16px;background:#fff;">'
    + (shop.hours  ? '<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#555;margin-bottom:6px;"><span style="font-size:14px;">🕐</span>' + shop.hours + '</div>' : '')
    + (shop.closed ? '<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#555;margin-bottom:6px;"><span style="font-size:14px;">🗓</span>定休日: ' + shop.closed + '</div>' : '')
    + (shop.menu   ? '<div style="font-size:11px;color:#888;margin-top:4px;padding-top:8px;border-top:0.5px solid #eee;line-height:1.7;">' + shop.menu.replace(/\//g, ' · ') + '</div>' : '')
    + '</div>'
    // アクションボタン
    + '<div style="display:flex;gap:0;border-top:0.5px solid #eee;">'
    + '<button id="fav-btn-' + shop.id + '" onclick="handleFavToggle(\'' + encoded + '\')" '
    + 'style="flex:1;padding:11px 8px;font-size:12px;font-weight:600;border:none;cursor:pointer;border-right:0.5px solid #eee;font-family:\'Noto Sans JP\',sans-serif;transition:all 0.2s;'
    + 'background:' + (fav ? '#c62d2d' : 'transparent') + ';'
    + 'color:' + (fav ? '#fff' : '#c62d2d') + ';'
    + '">' + (fav ? '⭐ 登録済み' : '☆ お気に入り') + '</button>'
    + '<a href="' + mapsUrl + '" target="_blank" '
    + 'style="flex:1;padding:11px 8px;font-size:12px;font-weight:600;color:#1a1a1a;text-decoration:none;text-align:center;font-family:\'Noto Sans JP\',sans-serif;display:flex;align-items:center;justify-content:center;gap:4px;">'
    + '地図で開く →</a>'
    + '</div></div>';
}

// ========== アイコン設定 ==========
const ICON_MAP = {
  'ラーメン':  'images/ramen-black-makaer.png',
  'つけ麺':   'images/ramen-red-makaer.png',
  'まぜそば': 'images/ramen-orange-makaer.png',
};

// ========== フィルター ==========
let allMarkers = [];
let currentFilter = 'all';

function setFilter(genre) {
  currentFilter = genre;
  document.querySelectorAll('.ramen-filter-btn').forEach(btn => {
    const active = btn.dataset.genre === genre;
    btn.style.background = active ? '#1a1a1a' : 'rgba(255,255,255,0.95)';
    btn.style.color       = active ? '#fff'    : '#444';
    btn.style.borderColor = active ? '#1a1a1a' : 'rgba(0,0,0,0.12)';
  });
  allMarkers.forEach(({ marker, shop }) => {
    marker.setVisible(genre === 'all' || shop.genre === genre);
  });
}

function createFilterBar() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:absolute;top:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10;';

  const filters = [
    { genre: 'all',      label: 'すべて' },
    { genre: 'ラーメン', label: 'ラーメン' },
    { genre: 'つけ麺',   label: 'つけ麺' },
    { genre: 'まぜそば', label: 'まぜそば' },
  ];

  filters.forEach(({ genre, label }) => {
    const btn = document.createElement('button');
    btn.className = 'ramen-filter-btn';
    btn.dataset.genre = genre;
    btn.textContent = label;
    btn.style.cssText = 'padding:7px 14px;border-radius:20px;border:1px solid rgba(0,0,0,0.12);background:rgba(255,255,255,0.95);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:"Noto Sans JP",sans-serif;color:#444;backdrop-filter:blur(4px);transition:all 0.18s;box-shadow:0 1px 4px rgba(0,0,0,0.1);';
    btn.addEventListener('click', () => setFilter(genre));
    bar.appendChild(btn);
  });

  const mapEl = document.getElementById('map');
  mapEl.style.position = 'relative';
  mapEl.appendChild(bar);
  setFilter('all');
}

// ========== マップ初期化 ==========
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 33.589205529007195, lng: 130.39978664038068 },
    zoom: 14,
    mapId: '90f87356969d889c',
    controlSize: 30,
    disableDefaultUI: false,
  });

  const infoWindow = new google.maps.InfoWindow({
    pixelOffset: new google.maps.Size(0, -8),
  });

  // 現在地ボタン
  const locationButton = document.createElement('button');
  locationButton.textContent = '現在地';
  locationButton.style.cssText = 'margin:8px;padding:8px 14px;background:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;font-family:"Noto Sans JP",sans-serif;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.15);color:#1a1a1a;';
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
  locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          infoWindow.setPosition(position);
          infoWindow.setContent('<div style="font-family:\'Noto Sans JP\',sans-serif;font-size:12px;padding:4px;">現在地</div>');
          infoWindow.open(map);
          map.setCenter(position);
          map.setZoom(16);
        },
        () => showToast('位置情報を取得できませんでした')
      );
    }
  });

  // shops.json 読み込み & マーカー作成
  fetch('data/shops.json')
    .then(res => res.json())
    .then(shops => {
      const iconSize = new google.maps.Size(36, 36);
      shops.forEach(shop => {
        if (!shop.lat || !shop.lng) return;
        const marker = new google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map,
          title: shop.name,
          optimized: false,
          icon: { url: ICON_MAP[shop.genre] || ICON_MAP['ラーメン'], scaledSize: iconSize },
        });
        marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.setContent(buildInfoHTML(shop));
          infoWindow.open(map, marker);
        });
        allMarkers.push({ marker, shop });
      });
      createFilterBar();
    })
    .catch(err => console.error('データ読み込みエラー:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
});

window.initMap = initMap;