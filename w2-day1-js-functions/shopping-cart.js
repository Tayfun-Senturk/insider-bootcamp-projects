const kullanici = {
  ad: prompt("Adınız:"),
  yas: Number(prompt("Yaşınız:")),
  meslek: prompt("Mesleğiniz:")
};
console.log("Kullanıcı:", kullanici);

let sepet = [];

function sepetiListele() {
  if (sepet.length === 0) {
    console.log("Sepet boş.");
  } else {
    sepet.forEach((item, i) =>
      console.log(`${i + 1}. ${item.name} - ${item.price} TL`)
    );
    let toplam = sepet.reduce((acc, item) => acc + item.price, 0);
    console.log("Toplam:", toplam, "TL");
  }
}

function urunEkle() {
  let urun = prompt("Ürün adı:");
  let fiyat = Number(prompt("Fiyatı:"));
  if (urun && !isNaN(fiyat)) {
    sepet.push({ name: urun, price: fiyat });
    console.log(`${urun} eklendi (${fiyat} TL)`);
  } else {
    alert("Geçerli ürün ve fiyat gir.");
  }
}

function urunSil() {
  sepetiListele();
  let silNo = prompt(`Silmek istediğin ürünün numarasını gir (1-${sepet.length}):`);
  let idx = Number(silNo) - 1;
  if (idx >= 0 && idx < sepet.length) {
    let silinen = sepet.splice(idx, 1)[0];
    console.log(`${silinen.name} silindi.`);
  } else {
    console.log("Geçersiz seçim.");
  }
}

while (true) {
  let secim = prompt(
    "İşlem seçin:\n1- Ürün ekle\n2- Sepeti göster\n3- Ürün sil\nq- Çıkış"
  );
  if (secim === "1") {
    urunEkle();
  } else if (secim === "2") {
    sepetiListele();
  } else if (secim === "3") {
    if (sepet.length === 0) {
      console.log("Sepet boş.");
    } else {
      urunSil();
    }
  } else if (secim === "q") {
    console.log("Çıkış yapıldı. Son sepet:");
    sepetiListele();
    break;
  } else {
    alert("Geçersiz seçim!");
  }
}