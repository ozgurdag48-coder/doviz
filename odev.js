// 1. Elementleri seçelim
const girisKutusu = document.getElementById("dolarMiktari");
const paraBirimiSecimi = document.getElementById("paraBirimi");
const hesaplaButonu = document.getElementById("btnHesapla");
const sonucKutusu = document.getElementById("sonucAlani");

// 2. Butona tıklanma anını dinleyelim
hesaplaButonu.addEventListener("click", async function() {
    
    let girilenMiktar = girisKutusu.value; 
    let secilenIslem = paraBirimiSecimi.value; // Örn: "TRY_TO_USD" veya "USD_TO_TRY"

    if (girilenMiktar !== "" && girilenMiktar > 0) {
        
        try {
            sonucKutusu.innerText = "Güncel kur verileri çekiliyor...";
            sonucKutusu.style.color = "#ffc107"; 

            // API'den döviz verilerini çekiyoruz (Base: USD)
            let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            let data = await response.json();

            let usdToTry = data.rates.TRY; // 1 Dolar kaç TL?
            let usdToEur = data.rates.EUR; // 1 Dolar kaç Euro?
            let usdToGbp = data.rates.GBP; // 1 Dolar kaç Sterlin?

            let guncelKur = 0;
            let hesaplananSonuc = 0;
            let hedefBirim = "";
            let kaynakBirim = "";

            // --- HESAPLAMA MANTIĞI ---
            
            if (secilenIslem === "USD_TO_TRY") {
                guncelKur = usdToTry;
                hesaplananSonuc = Number(girilenMiktar) * guncelKur;
                kaynakBirim = "USD"; hedefBirim = "TL";
            } 
            else if (secilenIslem === "EUR_TO_TRY") {
                guncelKur = usdToTry / usdToEur;
                hesaplananSonuc = Number(girilenMiktar) * guncelKur;
                kaynakBirim = "EUR"; hedefBirim = "TL";
            } 
            else if (secilenIslem === "GBP_TO_TRY") {
                guncelKur = usdToTry / usdToGbp;
                hesaplananSonuc = Number(girilenMiktar) * guncelKur;
                kaynakBirim = "GBP"; hedefBirim = "TL";
            } 
            // --- TL'DEN DÖVİZE ÇEVİRME (YENİ EKLENEN KISIM) ---
            else if (secilenIslem === "TRY_TO_USD") {
                guncelKur = usdToTry; 
                hesaplananSonuc = Number(girilenMiktar) / guncelKur; // Çarpmak yerine böldük
                kaynakBirim = "TL"; hedefBirim = "USD";
            } 
            else if (secilenIslem === "TRY_TO_EUR") {
                guncelKur = usdToTry / usdToEur; // Euro/TL kuru
                hesaplananSonuc = Number(girilenMiktar) / guncelKur; // TL'yi kura bölüyoruz
                kaynakBirim = "TL"; hedefBirim = "EUR";
            } 
            else if (secilenIslem === "TRY_TO_GBP") {
                guncelKur = usdToTry / usdToGbp; // Sterlin/TL kuru
                hesaplananSonuc = Number(girilenMiktar) / guncelKur;
                kaynakBirim = "TL"; hedefBirim = "GBP";
            }

            // Sonucu ekrana yazdırıyoruz
            sonucKutusu.innerText = `${girilenMiktar} ${kaynakBirim} = ${hesaplananSonuc.toFixed(2)} ${hedefBirim} ediyor. (Kur: ${guncelKur.toFixed(4)})`;
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
