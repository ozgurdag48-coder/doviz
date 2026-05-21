// 1. Elementleri seçelim
const girisKutusu = document.getElementById("dolarMiktari");
const paraBirimiSecimi = document.getElementById("paraBirimi");
const hesaplaButonu = document.getElementById("btnHesapla");
const sonucKutusu = document.getElementById("sonucAlani");

// 2. Butona tıklanma anını dinleyelim
hesaplaButonu.addEventListener("click", async function() {
    
    let girilenMiktar = girisKutusu.value; 
    let secilenIslem = paraBirimiSecimi.value; 

    if (girilenMiktar !== "" && girilenMiktar > 0) {
        
        try {
            sonucKutusu.innerText = "Güncel kur verileri çekiliyor...";
            sonucKutusu.style.color = "#ffc107"; 

            // HTTPS olmasına ve doğrudan fonksiyonun İÇİNDE çağrılmasına dikkat ediyoruz
            let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            let data = await response.json();

            let usdToTry = data.rates.TRY; // 1 Dolar kaç TL?
            let usdToEur = data.rates.EUR; // 1 Dolar kaç Euro?
            let usdToGbp = data.rates.GBP; // 1 Dolar kaç Sterlin?

            // Başlangıç değerlerini sıfır yapmıyoruz, doğrudan if-else içinde tanımlayacağız
            let guncelKur;
            let hesaplananSonuc;
            let hedefBirim = "";
            let kaynakBirim = "";

            // --- DÖVİZDEN TL'YE ÇEVİRME ---
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
            // --- TL'DEN DÖVİZE ÇEVİRME ---
            else if (secilenIslem === "TRY_TO_USD") {
                guncelKur = usdToTry; 
                hesaplananSonuc = Number(girilenMiktar) / guncelKur; 
                kaynakBirim = "TL"; hedefBirim = "USD";
            } 
            else if (secilenIslem === "TRY_TO_EUR") {
                guncelKur = usdToTry / usdToEur; 
                hesaplananSonuc = Number(girilenMiktar) / guncelKur; 
                kaynakBirim = "TL"; hedefBirim = "EUR";
            } 
            else if (secilenIslem === "TRY_TO_GBP") {
                guncelKur = usdToTry / usdToGbp; 
                hesaplananSonuc = Number(girilenMiktar) / guncelKur;
                kaynakBirim = "TL"; hedefBirim = "GBP";
            }

            // Sonucu ekrana yazdırıyoruz (Daha temiz bir görünüm için birimleri güncelledik)
            sonucKutusu.innerText = `${girilenMiktar} ${kaynakBirim} = ${hesaplananSonuc.toFixed(2)} ${hedefBirim} ediyor. (Kur: ${guncelKur.toFixed(4)})`;
            sonucKutusu.style.color = "#28a745"; 
            
            // Kutuyu temizle
            girisKutusu.value = ""; 

        } catch (hata) {
            // Eğer API'ye erişilemezse hatayı buraya basacak
            sonucKutusu.innerText = "Kur verisi alınamadı! Hata: " + hata.message;
            sonucKutusu.style.color = "#dc3545";
        }

    } else {
        alert("Lütfen geçerli bir miktar girin.");
    }       
});
