window.addEventListener('DOMContentLoaded', function() {
  const gorevForm = document.getElementById('gorevForm');
  const gorevBaslik = document.getElementById('gorevBaslik');
  const gorevAciklama = document.getElementById('gorevAciklama');
  const gorevListesi = document.getElementById('gorevListesi');
  const baslikHata = document.getElementById('baslikHata');
  const oncelikHata = document.getElementById('oncelikHata');
  const tamamlananlariGoster = document.getElementById('tamamlananlariGoster');
  const tumunuGoster = document.getElementById('tumunuGoster');
  const onceligeGoreSirala = document.getElementById('onceligeGoreSirala');

  const uygulama = {
    gorevler: [],
    filtre: 'tumu',

    gorevEkle: function(baslik, aciklama, oncelik) {
      const yeniGorev = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        baslik: baslik,
        aciklama: aciklama,
        oncelik: oncelik,
        tamamlandi: false,
        olusturulmaTarihi: new Date()
      };
      
      this.gorevler.push(yeniGorev);
      this.kaydet();
      this.gorevleriGoster();
    },
    
    gorevSil: function(id) {
      this.gorevler = this.gorevler.filter(gorev => gorev.id !== id);
      this.kaydet();
      this.gorevleriGoster();
    },

    durumDegistir: function(id) {
      const gorev = this.gorevler.find(gorev => gorev.id === id);
      if (gorev) {
        gorev.tamamlandi = !gorev.tamamlandi;
        this.kaydet();
        this.gorevleriGoster();
      }
    },

    onceligeGoreSirala: function() {
      const oncelikDegeri = {
        'yuksek': 1,
        'orta': 2,
        'dusuk': 3
      };
      
      this.gorevler.sort((a, b) => {
        return oncelikDegeri[a.oncelik] - oncelikDegeri[b.oncelik];
      });
      
      this.gorevleriGoster();
    },

    filtrelenmisGorevleriGetir: function() {
      if (this.filtre === 'tamamlananlar') {
        return this.gorevler.filter(gorev => gorev.tamamlandi);
      }
      return this.gorevler;
    },
    
    filtreDegistir: function(yeniFiltre) {
      this.filtre = yeniFiltre;
      this.gorevleriGoster();

      if (yeniFiltre === 'tamamlananlar') {
        tamamlananlariGoster.classList.add('buton-birincil');
        tamamlananlariGoster.classList.remove('buton-ikincil');
        tumunuGoster.classList.add('buton-ikincil');
        tumunuGoster.classList.remove('buton-birincil');
      } else {
        tumunuGoster.classList.add('buton-birincil');
        tumunuGoster.classList.remove('buton-ikincil');
        tamamlananlariGoster.classList.add('buton-ikincil');
        tamamlananlariGoster.classList.remove('buton-birincil');
      }
    },
    
    gorevleriGoster: function() {
      const filtrelenmisGorevler = this.filtrelenmisGorevleriGetir();

      gorevListesi.innerHTML = '';

      if (filtrelenmisGorevler.length === 0) {
        const bosDurum = document.createElement('div');
        bosDurum.className = 'bos-durum';
        
        const mesaj = this.filtre === 'tamamlananlar' 
          ? 'Tamamlanmış görev bulunmuyor.' 
          : 'Henüz görev eklenmemiş.';
          
        bosDurum.innerHTML = `<p>${mesaj}</p>`;
        gorevListesi.appendChild(bosDurum);
        return;
      }

      filtrelenmisGorevler.forEach(gorev => {
        const gorevElementi = document.createElement('div');
        gorevElementi.className = `gorev-item ${gorev.tamamlandi ? 'tamamlandi' : ''}`;
        gorevElementi.dataset.id = gorev.id;

        const oncelikMetinleri = {
          'dusuk': 'Düşük',
          'orta': 'Orta',
          'yuksek': 'Yüksek'
        };

        gorevElementi.innerHTML = `
          <div class="gorev-baslik-alan">
            <h3 class="gorev-baslik">${gorev.baslik}</h3>
            <div class="gorev-butonlar">
              <button class="buton buton-kucuk buton-ikincil tamamla-buton" title="${gorev.tamamlandi ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}">
                ${gorev.tamamlandi ? 'Geri Al' : 'Tamamla'}
              </button>
              <button class="buton buton-kucuk buton-tehlike sil-buton" title="Görevi sil">Sil</button>
            </div>
          </div>
          ${gorev.aciklama ? `<div class="gorev-aciklama">${gorev.aciklama}</div>` : ''}
          <div class="gorev-alt-bilgi">
            <span class="gorev-oncelik oncelik-${gorev.oncelik}">${oncelikMetinleri[gorev.oncelik]}</span>
          </div>
        `;
        
        gorevListesi.appendChild(gorevElementi);
      });
    },

    kaydet: function() {
      try {
        localStorage.setItem('gorevler', JSON.stringify(this.gorevler));
      } catch (hata) {
        console.error('LocalStorage\'a kaydederken hata:', hata);
      }
    },

    yukle: function() {
      try {
        const kaydedilmisGorevler = localStorage.getItem('gorevler');
        if (kaydedilmisGorevler) {
          this.gorevler = JSON.parse(kaydedilmisGorevler);
        }
      } catch (hata) {
        console.error('LocalStorage\'dan yüklerken hata:', hata);
        this.gorevler = [];
      }
    }
  };

  uygulama.yukle();
  uygulama.gorevleriGoster();

  gorevForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
      baslikHata.textContent = '';
      oncelikHata.textContent = '';
      
      const baslik = gorevBaslik.value.trim();
      const aciklama = gorevAciklama.value.trim();
      const oncelikSecimi = document.querySelector('input[name="oncelik"]:checked');
      
      let hataVar = false;

      if (!baslik) {
        baslikHata.textContent = 'Başlık alanı boş bırakılamaz!';
        hataVar = true;
      }
      
      if (!oncelikSecimi) {
        oncelikHata.textContent = 'Lütfen bir öncelik seviyesi seçin!';
        hataVar = true;
      }
      
      if (hataVar) {
        return;
      }
      
      uygulama.gorevEkle(baslik, aciklama, oncelikSecimi.value);
      
      gorevForm.reset();
      
    } catch (hata) {
      console.error('Görev eklenirken bir hata oluştu:', hata);
      alert('Görev eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  });

  gorevListesi.addEventListener('click', function(e) {
    e.stopPropagation(); 
    
    const tiklananEleman = e.target;
    const gorevElementi = tiklananEleman.closest('.gorev-item');
    
    if (!gorevElementi) return;
    
    const gorevId = gorevElementi.dataset.id;

    if (tiklananEleman.classList.contains('tamamla-buton') || tiklananEleman.closest('.tamamla-buton')) {
      uygulama.durumDegistir(gorevId);
    }

    if (tiklananEleman.classList.contains('sil-buton') || tiklananEleman.closest('.sil-buton')) {
      uygulama.gorevSil(gorevId);
    }
  });
  
  tamamlananlariGoster.addEventListener('click', function() {
    uygulama.filtreDegistir('tamamlananlar');
  });
  
  tumunuGoster.addEventListener('click', function() {
    uygulama.filtreDegistir('tumu');
  });

  onceligeGoreSirala.addEventListener('click', function() {
    uygulama.onceligeGoreSirala();
  });
}); 