# Torn-Helper

**English** 

A Tampermonkey userscript that adds a helper panel to [Torn City](https://www.torn.com): target list with quick-attack buttons, Halloween/Mug queue, Ranked War mode, faction management tools and an abroad-price checker. The interface is available in English and Turkish.

> Unofficial fan-made tool. Not affiliated with or endorsed by Torn. It reads data through the public Torn API and never attacks, mugs or sends money for you. Every attack is a normal click on your side.

## Features

- **Halloween / Mug mode**
  - Pulls your Torn Targets list through the API, or add targets by hand / in bulk.
  - Queue mode: shows the next target and an Attack button. Optional mug mode puts high-networth targets first and skips anyone mugged in the last 12 hours.
  - Fair Fight (FF) values and estimated stats via [FF Scouter](https://ffscouter.com), easy-target finder with no repeats, networth and mug-ceiling labels.
  - Halloween treat counter (collapsed by default), energy display, "reset today" button.
- **Ranked War mode**
  - Fetches the enemy faction's members, tracks hospital time live, sorts by FF and gives you the next target.
- **Faction management**
  - War payout: per-hit fee or pool split, paid marks, one-click copy of amounts.
  - Members and inactivity list, organized crime overview (who is in which crime, who is in none).
  - Your own cooldowns, bars, travel status and money.
  - Backup and restore of all your data.
- **Abroad prices**
  - Compares abroad shop stock with Torn market values and calculates profit per flight and per hour.
- **Mini window**
  - Press Attack in the queue and the tool shrinks into a small window in the corner. The attack page opens in the same tab and the mini window shows the next target and an Attack button when you are done.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open the raw script and press **Install**:
   [torn-helper.user.js](https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js)
3. Reload torn.com. A **Torn-Helper** button appears at the bottom left.

Updates are picked up automatically by Tampermonkey.

## Setup

1. Create a **Limited Access** API key in Torn: Settings → API Key.
2. Open Torn-Helper, paste the key in the "Torn connection" section and save.
3. Optional: paste your FF Scouter key. You must be registered on ffscouter.com for FF values to work.
4. For the faction features your key needs Faction access, which usually means a leader or co-leader role.

## Privacy

- Your API keys, target list and settings are stored only in Tampermonkey's own storage on your computer. The Torn page itself cannot read them.
- Requests go only to `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk` and `yata.yt`. Your Torn key is sent only to Torn, and your FF Scouter key only to FF Scouter.
- There is no server of our own and no analytics.

## Data sources and limits

- Abroad stock and prices come from the community services Prombot (with YATA as a fallback). If they are down, that section stops working.
- The Torn side of the abroad comparison is Torn's average market value, not the cheapest current listing.
- Other players' real battle stats and cash on hand are not available through the API. FF values and networth are estimates and upper bounds.
- Some faction, organized crime and cooldown fields were implemented from the public API behaviour and are less tested than the rest. If a section looks empty, open the debug box in the Torn connection section and report the response in an issue.
- Hit-calling shared between faction members is not possible, because there is no shared server.

## Backup

Open Faction management → Backup to export all data as text or a file and restore it elsewhere. API keys are excluded unless you tick the box.

## Support

Found a bug or have an idea? Open an [issue](https://github.com/DgkYY/Torn-Helper/issues). If a section does not show data, include the response from the debug box (remove your API key first).

---

# Türkçe

[Torn City](https://www.torn.com) için bir Tampermonkey scripti: hızlı saldırı düğmeli hedef listesi, Halloween/Mug sırası, Ranked War modu, faction yönetim araçları ve yurtdışı fiyat karşılaştırıcı. Arayüz Türkçe ve İngilizce kullanılabilir.

> Resmi olmayan, hayran yapımı bir araçtır. Torn ile bağlantısı yoktur. Verileri herkese açık Torn API'si üzerinden okur, senin yerine saldırmaz, mug etmez ve para göndermez. Her saldırı senin normal tıklamandır.

## Özellikler

- **Halloween / Mug modu**
  - Torn'daki Targets listeni API ile çeker, ya da hedefleri elle / toplu ekler.
  - Sıra modu: sıradaki hedefi ve Saldır düğmesini gösterir. Mug modu açıksa networth'ü yüksek olanlar öne alınır, son 12 saatte mug ettiklerin atlanır.
  - [FF Scouter](https://ffscouter.com) ile Fair Fight (FF) ve tahmini stat, tekrar etmeyen kolay hedef bulucu, networth ve mug tavanı etiketleri.
  - Halloween tatlı sayacı (varsayılan kapalı), enerji göstergesi, "bugünü sıfırla" düğmesi.
- **Ranked War modu**
  - Rakip faction üyelerini çeker, hastane süresini canlı izler, FF'ye göre sıralar ve sıradaki hedefi verir.
- **Faction yönetimi**
  - War payout: vuruş başı ücret ya da havuz paylaşımı, ödendi işareti, tutarı tek tıkla kopyalama.
  - Üyeler ve pasiflik listesi, organized crime özeti (kim hangi crime'da, kim hiçbirinde değil).
  - Kendi cooldown, bar, seyahat ve para durumun.
  - Tüm verinin yedeklenmesi ve geri yüklenmesi.
- **Yurtdışı fiyatları**
  - Yurtdışı mağaza stoklarını Torn piyasa değeriyle karşılaştırır, uçuş başına ve saat başına kârı hesaplar.
- **Mini pencere**
  - Sıradan Saldır'a basınca araç köşede küçük bir pencereye dönüşür. Saldırı sayfası aynı sekmede açılır, saldırı bitince mini pencere sıradaki hedefi ve Saldır düğmesini gösterir.

## Kurulum

1. Tarayıcına [Tampermonkey](https://www.tampermonkey.net/) kur.
2. Ham scripti aç ve **Install**'a bas:
   [torn-helper.user.js](https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js)
3. torn.com'u yenile. Sol altta **Torn-Helper** düğmesi çıkar.

Güncellemeleri Tampermonkey kendiliğinden alır.

## Ayarlar

1. Torn'da **Limited Access** seviyesinde bir API anahtarı oluştur: Ayarlar → API Key.
2. Torn-Helper'ı aç, "Torn bağlantısı" bölümüne anahtarı yapıştırıp kaydet.
3. İsteğe bağlı: FF Scouter anahtarını da yapıştır. FF değerlerinin çalışması için ffscouter.com'da kayıtlı olman gerekir.
4. Faction özellikleri için anahtarında Faction erişimi olmalı, bu genelde lider ya da yetkili üyede bulunur.

## Gizlilik

- API anahtarların, hedef listen ve ayarların yalnızca bilgisayarındaki Tampermonkey'in kendi deposunda saklanır. Torn sayfasının kendisi bunları okuyamaz.
- İstekler yalnızca `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk` ve `yata.yt` adreslerine gider. Torn anahtarın yalnızca Torn'a, FF Scouter anahtarın yalnızca FF Scouter'a gönderilir.
- Kendi sunucumuz ve analiz aracı yoktur.

## Veri kaynakları ve sınırlar

- Yurtdışı stok ve fiyatlar Prombot (yedek olarak YATA) topluluk servislerinden gelir. Bu servisler kapalıysa o bölüm çalışmaz.
- Yurtdışı karşılaştırmasında Torn tarafı, Torn'un ortalama piyasa değeridir. En ucuz güncel ilan değildir.
- Diğer oyuncuların gerçek battle stat'ı ve cebindeki nakit API'den alınamaz. FF değerleri ve networth tahmin ve üst sınırdır.
- Bazı faction, organized crime ve cooldown alanları herkese açık API davranışına göre yazıldı ve diğer bölümlerden daha az test edildi. Bir bölüm boş görünürse Torn bağlantısı bölümündeki hata ayıklama kutusunu açıp yanıtı bir issue'da bildir.
- Faction üyeleri arasında ortak hit-call yapılamaz, çünkü ortak bir sunucu yoktur.

## Yedek

Faction yönetimi → Yedek sekmesinden tüm veriyi metin ya da dosya olarak dışa aktarıp başka yerde geri yükleyebilirsin. API anahtarları, kutuyu işaretlemedikçe yedeğe girmez.

## Destek

Hata mı buldun ya da fikrin mi var? Bir [issue](https://github.com/DgkYY/Torn-Helper/issues) aç. Bir bölüm veri göstermiyorsa hata ayıklama kutusundaki yanıtı da ekle (önce API anahtarını sil).
