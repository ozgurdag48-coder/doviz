// 1. Elementleri seçelim (Yeni select kutumuzu da ekledik)
const girisKutusu = document.getElementById("dolarMiktari");
const paraBirimiSecimi = document.getElementById("paraBirimi");
const hesaplaButonu = document.getElementById("btnHesapla");
const sonucKutusu = document.getElementById("sonucAlani");

// 2. Butona tıklanma anını dinleyelim
hesaplaButonu.addEventListener("click", async function() {
    
    let girilenMiktar = girisKutusu.value; 
    let secilenParaBirimi = paraBirimiSecimi.value; // "USD", "EUR" veya "GBP" değerini alır

    // Şart kontrolü: Boş değilse ve sıfırdan büyükse
    if (girilenMiktar !== "" && girilenMiktar > 0) {
        
        try {
            sonucKutusu.innerText = "Güncel kur verileri çekiliyor...";
            sonucKutusu.style.color = "#ffc107"; 

            // API'den döviz verilerini çekiyoruz
            let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            let data = await response.json();

            // Türk Lirası'nın Dolar karşısındaki değerini baz alarak hesaplama yapacağız
            let usdToTry = data.rates.TRY; 
            let guncelKur = 0;

            // Seçilen birime göre kuru hesaplayalım
            if (secilenParaBirimi === "USD") {
                guncelKur = usdToTry;
            } else if (secilenParaBirimi === "EUR") {
                // API verileri USD tabanlı olduğu için EUR/TL kurunu bu şekilde oranlayarak buluyoruz
                let usdToEur = data.rates.EUR;
                guncelKur = usdToTry / usdToEur;
            } else if (secilenParaBirimi === "GBP") {
                // Aynı şekilde Sterlin/TL kurunu oranlıyoruz
                let usdToGbp = data.rates.GBP;
                guncelKur = usdToTry / usdToGbp;
            }

            // Matematiksel hesaplama
            let tlKarsiligi = Number(girilenMiktar) * guncelKur;
            
            // Sonucu ekrana şık bir şekilde yazdıralım
            sonucKutusu.innerText = `${girilenMiktar} ${secilenParaBirimi} = ${tlKarsiligi.toFixed(2)} TL ediyor. (Güncel Kur: ${guncelKur.toFixed(4)})`;
            sonucKutusu.style.color = "#28a745"; 
            
            // Kutuyu temizle
            girisKutusu.value = ""; 

        } catch (hata) {
            sonucKutusu.innerText = "Kur verisi alınamadı, lütfen internetinizi kontrol edin.";
            sonucKutusu.style.color = "#dc3545";
        }

    } else {
        alert("Lütfen geçerli bir miktar girin.");
    }       
});