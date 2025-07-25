const appendLocation = '.ins-api-users';
const SESSION_FLAG = 'usersReloaded';

const main = ($) => {


  'use strict';

  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const STORAGE_KEY = 'users_cache';
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  const $wrapper = $(appendLocation);
  let usersArr = [];

  const css = `
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f3f5f7;
      margin: 0;
      padding: 30px;
    }

    .refresh-btn {
      padding: 8px 14px;
      background: #4a90e2;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .refresh-btn:hover {
      background: #3e7ac3;
    }

    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    .user-item {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      padding: 22px 20px 18px;
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .user-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #4a90e2 0%, #50b7d3 100%);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .user-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    }

    .user-item h3 {
      margin: 0 0 8px;
      font-size: 20px;
      color: #2c3e50;
    }
    .user-item p {
      margin: 2px 0;
      color: #555;
      font-size: 14px;
    }
    .user-item .delete-btn {
      position: absolute;
      top: 10px;
      right: 12px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #bbb;
      transition: color 0.2s;
    }
    .user-item .delete-btn:hover {
      color: #e74c3c;
    }

    .error-box {
      background: #ffeaea;
      color: #c0392b;
      padding: 14px 20px;
      border: 1px solid #e74c3c;
      border-radius: 8px;
      text-align: center;
      margin: 0 auto;
      max-width: 420px;
    }
  `;
  $('<style>').text(css).appendTo('head');

  const saveData = (data) => {

    const obj = { ts: Date.now(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  };

  const loadData = () => {

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.ts || !parsed.data) return null;
      if (Date.now() - parsed.ts > CACHE_TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.data;
    } catch (err) {
      console.log(err.message);
      return null;

    }

  };

  const getUsers = () =>
    fetch(API_URL).then((res) => {
      if (!res.ok) throw new Error('Veri alınamadı');
      return res.json();
    });

  const showUsers = (list) => {
    $wrapper.empty();
    const $grid = $('<div>', { class: 'user-grid' });

    $.each(list, (_, user) => {
      const $card = $(
        `<div class="user-item">
          <button class="delete-btn" title="Sil">❌</button>
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <p>${user.address.street}, ${user.address.city}</p>
        </div>`);

      $card.find('.delete-btn').on('click', () => {
        removeUser(user.id);
      });

      $grid.append($card);
    });

    $wrapper.append($grid);
  };

  const removeUser = (id) => {
    usersArr = usersArr.filter((u) => u.id !== id);
    saveData(usersArr);
    showUsers(usersArr);
  };

  const setupObserver = () => {
    const target = $wrapper[0];
    if (!target) return;

    const maybeShowReload = () => {
      const hasItems = $wrapper.find('.user-item').length > 0;
      const already = sessionStorage.getItem(SESSION_FLAG) === '1';

      if (!hasItems && !already && $wrapper.find('.reload-btn').length === 0) {
        const $btn = $('<button>', {
          class: 'refresh-btn reload-btn',
          text: 'Tekrar Yükle',
          type: 'button',
        });

        $btn.on('click', () => {
          sessionStorage.setItem(SESSION_FLAG, '1');
          localStorage.removeItem(STORAGE_KEY);
          getUsers()
            .then((data) => {
              usersArr = data;
              saveData(data);
              showUsers(data);
            })
            .catch((err) => {
              console.error(err);
              $wrapper.html('<div class="error-box">' + err.message + '</div>');
            });
          $btn.remove();
        });

        $wrapper.append($btn);
      }
    };

    const config = { childList: true, subtree: true, attributes: false };
    let obs = new MutationObserver(maybeShowReload);
    obs.observe(target, config);

    maybeShowReload();
  };

  const init = () => {
    const cached = loadData();
    if (cached) {
      usersArr = cached;
      showUsers(cached);
      setupObserver();
      return;
    }

    getUsers()
      .then((data) => {
        usersArr = data;
        saveData(data);
        showUsers(data);
        setupObserver();
      })
      .catch((err) => {
        console.error(err);
        $wrapper.html(`<div class="error-box">${err.message}</div>`);
        setupObserver();
      });
  };

  $(document).ready(() => init());
};

if (window.jQuery) {
  main(window.jQuery);
} else {
  console.log('jQuery yükleniyor');
  const sc = document.createElement('script');
  sc.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
  sc.onload = () => main(window.jQuery);
  document.head.appendChild(sc);
}