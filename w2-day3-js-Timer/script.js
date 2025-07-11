const sayimGiris = document.getElementById('countdown-input');
const sayimGosterge = document.getElementById('countdown-display');
const durumMesaj = document.getElementById('status-message');
const baslatButon = document.getElementById('start-button');
const sifirlaButon = document.getElementById('reset-button');
const progressBar = document.getElementById('progress-fill');
const tikTakSes = document.getElementById('tick-sound');
const container = document.querySelector('.container');

var sayimDegeri = 10;
var baslangicDegeri = 10;
var sayimZamanlayici;
var calisiyor = false;

window.addEventListener('load', function() {
    sayimDegeri = parseInt(sayimGiris.value);
    baslangicDegeri = sayimDegeri;
    sayimGosterge.textContent = sayimDegeri;
    progressBar.style.width = '100%';
    tikTakSes.load();
    tikTakSes.volume = 0.3;
});

sayimGiris.addEventListener('input', function() {
    if (sayimGiris.value && parseInt(sayimGiris.value) > 0) {
        sayimDegeri = parseInt(sayimGiris.value);
        baslangicDegeri = sayimDegeri;
        sayimGosterge.textContent = sayimDegeri;
        durumMesaj.textContent = '';
        progressBar.style.width = '100%';
    } else if (sayimGiris.value === '') {
        sayimGosterge.textContent = '0';
    }
});

sayimGiris.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' && !calisiyor) {
        baslatButon.click();
    }
});

baslatButon.addEventListener('click', function() {
    if (calisiyor) return;

    if (sayimGiris.value && parseInt(sayimGiris.value) > 0) {
        sayimDegeri = parseInt(sayimGiris.value);
        baslangicDegeri = sayimDegeri;
        sayimGosterge.textContent = sayimDegeri;
        calisiyor = true;
        baslatButon.disabled = true;
        sayimGiris.disabled = true;
        baslatButon.innerHTML = '<i class="fas fa-hourglass-half"></i> Sayılıyor...';
        sayimZamanlayici = setInterval(function() {
            tikTakSes.currentTime = 0;
            tikTakSes.play();
            sayimDegeri = sayimDegeri - 1;
            sayimGosterge.textContent = sayimDegeri;
            var ilerlemeDurumu = (sayimDegeri / baslangicDegeri) * 100;
            progressBar.style.width = ilerlemeDurumu + '%'; 
            if (sayimDegeri <= 0) {
                clearInterval(sayimZamanlayici);
                durumMesaj.textContent = 'Süre doldu!';
                calisiyor = false;
                baslatButon.disabled = false;
                sayimGiris.disabled = false;
                baslatButon.innerHTML = '<i class="fas fa-play"></i> Başlat';
            }
        }, 1000);
    } else {
        durumMesaj.textContent = 'Lütfen geçerli bir süre girin!';
        sayimGiris.focus();
    }
});

sifirlaButon.addEventListener('click', function() {
    clearInterval(sayimZamanlayici);
    sayimDegeri = parseInt(sayimGiris.value);
    baslangicDegeri = sayimDegeri;
    sayimGosterge.textContent = sayimDegeri;
    durumMesaj.textContent = '';
    calisiyor = false;
    baslatButon.disabled = false;
    sayimGiris.disabled = false;
    progressBar.style.width = '100%';
    baslatButon.innerHTML = '<i class="fas fa-play"></i> Başlat';
}); 