$(function () {
  let start = 0;
  const limit = 5;
  let loading = false;
  let allow = true;
  let hasMorePosts = true;

  const $list = $('#postList');
  const $loader = $('#loader');

  function loadPosts() {
    if (loading || !hasMorePosts) return;

    loading = true;
    $loader.removeClass('hidden');

    $.get(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
      .done(function (data) {
        if (data.length === 0) {
          hasMorePosts = false;
          return;
        }

        data.forEach(function (post) {
          $list.append(`
            <li>
              <h2>${post.title}</h2>
              <p>${post.body}</p>
            </li>
          `);
        });
        start += limit;
      })
      .fail(function () {
        alert('Gönderiler alınırken bir hata oluştu.');
      })
      .always(function () {
        setTimeout(function() {
          loading = false;
          $loader.addClass('hidden');

          if (hasMorePosts && $(document).height() <= $(window).height()) {
            loadPosts();
          }
        }, 500);
      });
  }

  function nearBottom() {
    const scrollPosition = $(window).scrollTop() + $(window).height();
    const threshold = $(document).height() - 400;
    return scrollPosition >= threshold;
  }

  $(window).on('scroll', function () {
    if (!allow) return;

    if (nearBottom()) {
      loadPosts();
    }

    allow = false;
    setTimeout(function () {
      allow = true;
    }, 500);
  });

  loadPosts();
}); 