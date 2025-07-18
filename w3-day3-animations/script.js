$(function () {
  fetchProfiles();

  $(document).on('click', '#refreshProfiles', function () {
    var $btn = $(this);
    $btn.removeClass('shake bounce');
    var anim = Math.random() > 0.5 ? 'shake' : 'bounce';
    $btn.addClass(anim);
    setTimeout(function () { $btn.removeClass(anim); }, 700);
    fetchProfiles();
  });

  Fancybox.bind('[data-fancybox]', {});

  function fetchProfiles() {
    $('#cardGrid').empty();

    if ($('#profileSlider').hasClass('slick-initialized')) {
      $('#profileSlider').slick('unslick');
    }
    $('#profileSlider').empty();

    $(".profile-modal").remove();
    $.get('https://randomuser.me/api/?results=8', function (cevap) {
      renderCards(cevap.results);
      initSlider(cevap.results);
    });
  }

  function renderCards(kisiler) {
    kisiler.forEach(function (kisi, i) {
      var animasyonlar = ['fade-in', 'slide-down', 'twist-in'];
      var anim = animasyonlar[i % animasyonlar.length];
      var card = $(`
        <div class="profile-card ${anim}" data-fancybox data-src="#modal-${i}">
          <img src="${kisi.picture.large}" alt="${kisi.name.first} ${kisi.name.last}">
          <div class="card-body">
            <h3>${kisi.name.first} ${kisi.name.last}</h3>
            <p><b>Mail:</b> ${kisi.email}</p>
            <p><b>Ülke:</b> ${kisi.location.country}</p>
          </div>
        </div>
      `);
      setTimeout(function () {
        card.addClass(anim);
      }, i * 180);
      $('#cardGrid').append(card);

      var detay = $(`
        <div id="modal-${i}" style="display:none;" class="profile-modal">
          <img src="${kisi.picture.large}" alt="${kisi.name.first} ${kisi.name.last}">
          <h2>${kisi.name.title} ${kisi.name.first} ${kisi.name.last}</h2>
          <p><b>Mail:</b> ${kisi.email}</p>
          <p><b>Telefon:</b> ${kisi.phone}</p>
          <p><b>Adres:</b> ${kisi.location.street.number} ${kisi.location.street.name}, ${kisi.location.city}</p>
          <p><b>Ülke:</b> ${kisi.location.country}</p>
          <p><b>Posta Kodu:</b> ${kisi.location.postcode}</p>
          <p><b>Doğum Tarihi:</b> ${new Date(kisi.dob.date).toLocaleDateString('tr-TR')}</p>
        </div>
      `);
      $('body').append(detay);

      card.on('mouseenter', function () {
        const $self = $(this);
        $self.removeClass('twist-in');
        $self.addClass('bounce');
        setTimeout(() => {
          $self.removeClass('bounce');

        }, 700);
      });
      card.on('mouseleave', function () {
      });
    });
  }

  function initSlider(kisiler) {
    kisiler.forEach(function (kisi) {
      var icerik = $(`
        <div class="slider-card">
          <img src="${kisi.picture.large}" alt="${kisi.name.first} ${kisi.name.last}">
          <h3>${kisi.name.first} ${kisi.name.last}</h3>
          <p>${kisi.location.country}</p>
        </div>
      `);
      $('#profileSlider').append(icerik);
    });
    $('#profileSlider').slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      dots: true,
      responsive: [
        { breakpoint: 900, settings: { slidesToShow: 1 } }
      ]
    });
  }
});