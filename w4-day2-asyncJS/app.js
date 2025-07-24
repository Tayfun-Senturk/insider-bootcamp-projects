(function ($) {
  'use strict';

  const API_URL = 'https://jsonplaceholder.typicode.com/users';
  const STORAGE_KEY = 'users_cache';
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  const $wrapper = $('.ins-api-users');
  let usersArr = [];
  const css = `
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f3f5f7;
      margin: 0;
      padding: 30px;
    }

    .search-box {
      width: 100%;
      max-width: 400px;
      padding: 10px 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      flex: 1 1 260px;
    }

    .controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0 auto 24px;
      max-width: 1000px;
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

  function saveData(data) {
    const obj = { ts: Date.now(), data: data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function loadData() {
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
      console.warn('Cache parse error', err);
      return null;
    }
  }


  function getUsers() {
    return fetch(API_URL)
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Veri alınamadı');
        }
        return res.json();
      });
  }

  function addSearchInput() {
    const $input = $('<input>', {
      class: 'search-box',
      placeholder: 'İsim veya e-posta ara…',
      type: 'text',
    });

    $input.on('input', function () {
      const q = $(this).val().toLowerCase();
      const filtered = usersArr.filter(function (u) {
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      });
      showUsers(filtered);
    });

    const $refresh = $('<button>', {
      class: 'refresh-btn',
      text: 'Yenile',
      type: 'button',
    });

    $refresh.on('click', function () {
      $input.val('');
      localStorage.removeItem(STORAGE_KEY);
      getUsers()
        .then(function (data) {
          usersArr = data;
          saveData(data);
          showUsers(data);
        })
        .catch(function (err) {
          console.error(err);
          $wrapper.html('<div class="error-box">' + err.message + '</div>');
        });
    });

    const $controls = $('<div>', { class: 'controls' });
    $controls.append($input, $refresh);

    $wrapper.before($controls);
  }

  function showUsers(list) {
    $wrapper.empty();
    const $grid = $('<div>', { class: 'user-grid' });

    $.each(list, function (_, user) {
      const $card = $(
        `<div class="user-item">
          <button class="delete-btn" title="Sil">❌</button>
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <p>${user.address.street}, ${user.address.city}</p>
        </div>`
      );

      $card.find('.delete-btn').on('click', function () {
        removeUser(user.id);
      });

      $grid.append($card);
    });

    $wrapper.append($grid);
  }

  function removeUser(id) {
    usersArr = usersArr.filter(function (u) { return u.id !== id; });
    saveData(usersArr);
    showUsers(usersArr);
  }

  function init() {
    const cached = loadData();
    if (cached) {
      usersArr = cached;
      showUsers(cached);
      addSearchInput();
      return;
    }

    getUsers()
      .then(function (data) {
        usersArr = data;
        saveData(data);
        showUsers(data);
        addSearchInput();
      })
      .catch(function (err) {
        console.error(err);
        $wrapper.html(`<div class="error-box">${err.message}</div>`);
      });
  }

  $(document).ready(init);
})(jQuery); 