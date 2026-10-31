# Torn-Helper

**English** · [Türkçe](#türkçe)

A Tampermonkey userscript that adds a helper panel to [Torn City](https://www.torn.com): target list with quick-attack buttons, Halloween/Mug queue, Ranked War mode, faction management tools and an abroad-price checker. The interface is available in English and Turkish.

> Unofficial fan-made tool. Not affiliated with or endorsed by Torn. It reads data through the public Torn API and never attacks, mugs or sends money for you. Every attack is a normal click on your side.

## Features

- **Halloween / Mug mode**
  - Pulls your Torn Targets list through the API, or add targets by hand / in bulk.
  - Queue mode: shows the next target and an Attack button. Optional mug mode puts high-networth targets first and skips anyone mugged in the last 12 hours.
  - Fair Fight (FF) values and estimated stats via [FF Scouter](https://ffscouter.com), easy-target finder with no repeats, networth and mug-ceiling labels.
  - Halloween treat counter (collapsed by default), energy display, "reset today" button.
  - The treat counter reads your real treats collected and basket level from Torn while the Halloween event runs.
  - Optional: while the Halloween event is on and your energy is 25 or more, an Attack button appears next to the open button. It refreshes the next target's status, switches to the mini window and opens the attack page. You still press the attack on Torn yourself. Off by default (it needs one background request per minute); it disappears when the event ends.
  - Optional: Retal. Every 30 or 60 seconds the script reads your faction member list. When a member is hospitalized by someone outside the faction and that attacker is Okay, a Retal button appears under the open button and opens the attack page. Hospitalized-by-someone (hidden) attackers are skipped. Off by default (2 background requests per minute). Torn's wiki says a retaliation hit must be hospitalisation only and gives a 1.5x multiplier; the button disappears after 5 minutes.
  - Purchase log: on the abroad shop page the script notes each Buy you press (only when Torn's "purchased X / 18" counter really goes up) and the Abroad prices screen shows cost and estimated profit for this flight and the last 24 hours. Profit uses the Torn market value from the price service, not the profit column other scripts add to the page.
  - Optional alerts (Settings): a pop-up (and a system notification if you allow it) when a drug, medical or booster cooldown ends or your energy is full. Optional sound, including your own short audio file (400 KB at most, stored only in your browser). Uses 2 background requests per minute.
  - Ranked War extras: warning before the chain expires (you choose 30/60/90 s), warning shortly before an enemy leaves hospital (only for enemies inside your FF range), and a score card (both factions' score, lead, target and time left).
  - Backup: download your target list, settings and logs as one JSON file and restore them later. Your API keys are never written to the file.
  - Layout: the side panel can be resized by dragging its left edge, the mini window can be moved by dragging its title (double-click resets), and the panel can stay open after a page reload.
- **Ranked War mode**
  - Fetches the enemy faction's members, tracks hospital time live, sorts by FF and gives you the next target.
- **Faction management**
  - War payout: per-hit fee or pool split, paid marks, one-click copy of amounts.
  - Members and inactivity list, organized crime overview (who is in which crime, who is in none).
  - Your own cooldowns, bars, travel status and money.
  - Backup and restore of all your data.
- **Abroad prices**
  - Compares abroad shop stock with Torn market values and calculates profit per flight and per hour.
  - The carrying capacity is read from the item boxes on the travel page (boxes minus the locked ones); untick the option to enter it by hand.
  - Optional budget (or one click to use your wallet) limits how many items you can afford, so profit per flight reflects what you can really buy.
- **Mini window**
  - Press Attack in the queue and the tool shrinks into a small window in the corner. The attack page opens in the same tab and the mini window shows the next target and an Attack button when you are done.

- **Torn page helpers** (each can be switched off in Settings; the userscript adds small notes to Torn's own pages)
  - **Sidebar:** Merit Tracker (see below), NPC Loot (time left until Duke, Leslie, Jimmy, Fernando, Tiny and Scrooge reach loot levels 1-5, counted from hospital release; if the release was never seen, an unverified estimate from last action is shown), optional info lines and a collapsible layout.
  - **Merit Tracker:** shows your merit upgrades, unspent and spent merits, and the honors and medals closest to completion. The award data is collected in the background from the Awards pages, and progress that Torn does not show (flights, finishing hits, defends, criticals, refills, bounties, OC and so on) is calculated from your personal stats through the API. On pages such as Travel, Attack, Gym, Crimes or the Stock Market, a panel under "Links" opens by itself and shows only the awards that relate to that page (on the flight page, every country with the one you picked first).
  - **Crimes:** logs average $/nerve and success rate for every option (including Hustling, Disposal per method, Forgery steps, Burglary and others) and shows it under the option name; Pickpocketing targets are colored by your logged success rate; the Hustling Gather Audience nerve is counted in the games it supports. The log can be reset per crime. Item rewards are valued at market value.
  - **Jail:** level, time and FF filters; optional automatic confirmation of the BUST dialog (it spends 5 nerve, so it is off by default).
  - **Profile:** attack history summary between you and the player, Stake out alerts when life drops below your threshold.
  - **Stock Market:** under every stock the block cost, payout frequency and daily return, a ranking (#1, #2...) and a top 5 list that marks what you can afford. Item bonuses show the item and its market value. This is data, not advice; share prices move.
  - **Faction OC:** per-crime average slot success rate, weighted success (role weights from tornprobability.com) and the weakest link.
  - **Company:** Stock Shipments auto-fill by target days and a "fill the warehouse" button.
  - **Gym:** ready-made Baldr's Ratio and Hank's Ratio targets.
  - **Home page, Battle Stats:** a second panel under Battle Stats with your effective stats including drug, booster and other temporary modifiers (updates when you take a drug or get a debuff).
  - **Missions:** a short summary of what each Duke mission objective asks for; objectives and rewards are translated.
  - **Gym:** estimated gain for the next train (Vladar formula, calibrated from your last train). Gym dots are read from the gym panel and the API; the script quietly visits each gym once to read its dots (retried after 14 days) and never presses a purchase button.
  - **Company:** a "TRAIN ALL" button above the employee list trains every employee who can be trained, one after another.
  - **Profile:** your age is also shown as years, months and days under the Age box.
  - **Stock Market:** a "$ amount" field above each Buy and Sell box fills in the share count for you (shortcuts like 5m or 250k work).
  - **Merit Tracker extras:** pin awards on top with a star; awards whose target is reached show 100%.
  - **Items, loadout, Item Market and Bazaar:** weapon bonus descriptions written next to the bonus icon; Bazaar items show market price and estimated profit after the 5% fee, and cheap listings are highlighted (not for weapons and armor, whose price depends on stats and bonuses). NPC shop Shop Analyzer shows market price and profit.
- **Notifications:** one Settings section where you choose each alert separately (energy, drug, medical, booster, chain, hospital and more), plus sound and a pre-warning.
- **Settings:** search box, ready-made profiles (Minimal / Full, with Undo), a version indicator with "Check for updates", a health check that tells you if a Torn page change broke one of the features ("Copy report" for bug reports), and the author's contact (YinxYang [3637531] · Discord: _yinyang).
- **Phone / Torn PDA:** on screens up to 600 px wide the attack mini window shows only energy, target name and status, Attack and Skip; the flight tips panel is compact. Missing `GM_` functions are replaced by built-in fallbacks. Not every feature has been tested inside Torn PDA; please report problems.
- **Updates:** a patch-notes window opens once for each new version, says where the new option is in Settings and shows skipped versions page by page.
- **Interface**
  - Opens as a side panel; the Wide/Narrow button is remembered per mode (Faction management opens wide).
  - The home screen shows a status strip with energy, nerve, cooldowns, the target queue and the time left in the running Torn event (read from Torn's own banner), plus a small status on each mode card.
  - The Torn connection section folds away once a key is saved.
  - The open button can be dragged anywhere and remembers its place. `Alt+Shift+T` or `Esc` opens and closes the panel. Optionally the button shows a dot when your energy is full (one background request per minute, off by default).
  - The mini window can sit in any of the four corners.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open the raw script and press **Install**:
   [torn-helper.user.js](https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js)
3. Reload torn.com. A **Torn-Helper** button appears at the bottom left.

Updates are picked up automatically by Tampermonkey.

## Setup

1. Create a **Limited Access** API key in Torn: Settings → API Key.
2. Open Torn-Helper and paste the key in the "Torn connection" section of the home screen. You only enter it once there.
3. Optional: paste your FF Scouter key. You must be registered on ffscouter.com for FF values to work.
4. For the faction features your key needs Faction access, which usually means a leader or co-leader role.

## Privacy

- Your API keys, target list and settings are stored only in Tampermonkey's own storage on your computer. The Torn page itself cannot read them.
- Requests go only to `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk`, `yata.yt` and `tornprobability.com` (only the public OC role weights are requested there). Your Torn key is sent only to Torn, and your FF Scouter key only to FF Scouter.
- There is no server of our own and no analytics.

## Data sources and limits

- Abroad stock and prices come from the community services Prombot (with YATA as a fallback). If they are down, that section stops working.
- The Torn side of the abroad comparison is Torn's average market value, not the cheapest current listing.
- Other players' real battle stats and cash on hand are not available through the API. FF values and networth are estimates and upper bounds.
- Some faction, organized crime and cooldown fields were implemented from the public API behaviour and are less tested than the rest. If a section looks empty, open the debug box in the Torn connection section and report the response in an issue.
- Hit-calling shared between faction members is not possible, because there is no shared server.
- Merit progress read from personal stats, NPC Loot estimates, stock values for item bonuses and the Crimes averages are estimates built from the public API and what Torn shows on the page. Compare them with the real values before relying on them.

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
  - Halloween event'i sürerken tatlı sayacı, Torn'daki gerçek tatlı sayını ve sepet seviyeni okur.
  - İsteğe bağlı: Halloween sürerken enerjin 25 ve üstündeyse açma düğmesinin yanında Saldır butonu çıkar. Sıradaki hedefin durumunu tazeler, mini pencereye geçer ve saldırı sayfasını açar. Saldırıyı yine Torn'da sen başlatırsın. Varsayılan kapalıdır (dakikada bir arka plan isteği ister), event bitince kendiliğinden kaybolur.
  - İsteğe bağlı: Retal. Script 30 ya da 60 saniyede bir faction üye listeni okur. Bir üyen faction dışından biri tarafından hastaneye düşürülürse ve saldıran Okay durumundaysa açma düğmesinin altında Retal butonu çıkar, tıklayınca saldırı sayfasını açar. Saldıranı gizli olanlar atlanır. Varsayılan kapalıdır (dakikada 2 arka plan isteği). Torn wiki'ye göre retal vuruşu sadece hastaneye düşürme olmalı ve 1.5x çarpan verir; buton 5 dakika sonra kaybolur.
  - Alışveriş kaydı: yurtdışı mağaza sayfasında bastığın Buy'ları (yalnızca Torn'un "purchased X / 18" sayacı gerçekten artarsa) not eder. Yurtdışı fiyatları ekranı bu uçuş ve son 24 saat için maliyeti ve tahmini kârı gösterir. Kâr, sayfaya başka scriptlerin eklediği profit sütununu değil, fiyat servisindeki Torn piyasa değerini kullanır.
  - İsteğe bağlı uyarılar (Ayarlar): ilaç, medical ya da booster cooldown'ı bitince ya da enerjin dolunca ekranda kutu (izin verirsen sistem bildirimi). İsteğe bağlı ses, istersen kendi kısa ses dosyan (en fazla 400 KB, yalnızca tarayıcında saklanır). Dakikada 2 arka plan isteği kullanır.
  - Ranked War eklemeleri: chain bitmeden uyarı (30/60/90 sn seçilir), rakip hastaneden çıkmadan kısa süre önce uyarı (yalnızca FF aralığındaki rakipler için) ve skor kartı (iki faction'ın skoru, fark, hedef ve kalan süre).
  - Yedekleme: hedef listeni, ayarlarını ve kayıtlarını tek bir JSON dosyası olarak indirip sonra geri yükleyebilirsin. API anahtarların dosyaya hiç yazılmaz.
  - Yerleşim: yan panelin genişliği sol kenarından sürüklenerek ayarlanır, mini pencere başlığından sürüklenerek taşınır (çift tık sıfırlar), panel sayfa yenilenince açık kalabilir.
- **Ranked War modu**
  - Rakip faction üyelerini çeker, hastane süresini canlı izler, FF'ye göre sıralar ve sıradaki hedefi verir.
- **Faction yönetimi**
  - War payout: vuruş başı ücret ya da havuz paylaşımı, ödendi işareti, tutarı tek tıkla kopyalama.
  - Üyeler ve pasiflik listesi, organized crime özeti (kim hangi crime'da, kim hiçbirinde değil).
  - Kendi cooldown, bar, seyahat ve para durumun.
  - Tüm verinin yedeklenmesi ve geri yüklenmesi.
- **Yurtdışı fiyatları**
  - Yurtdışı mağaza stoklarını Torn piyasa değeriyle karşılaştırır, uçuş başına ve saat başına kârı hesaplar.
  - Taşıma kapasitesi uçuş sayfasındaki eşya kutularından okunur (kutu sayısı eksi kilitli kutular), elle girmek için seçeneği kapatabilirsin.
  - İsteğe bağlı bütçe (ya da tek tıkla cüzdanın) kaç ürün alabileceğini sınırlar, böylece uçuş başı kâr gerçekten alabileceğin miktara göre hesaplanır.
- **Mini pencere**
  - Sıradan Saldır'a basınca araç köşede küçük bir pencereye dönüşür. Saldırı sayfası aynı sekmede açılır, saldırı bitince mini pencere sıradaki hedefi ve Saldır düğmesini gösterir.

- **Torn sayfa yardımcıları** (hepsi Ayarlar'dan kapatılabilir; script Torn'un kendi sayfalarına küçük notlar ekler)
  - **Kenar çubuğu:** Merit Tracker (aşağıda), NPC Loot (Duke, Leslie, Jimmy, Fernando, Tiny ve Scrooge için hastaneden çıkıştan itibaren loot seviyesi 1-5'e kalan süre; çıkış zamanı hiç görülmediyse son aktiviteye göre doğrulanmamış bir tahmin gösterilir), isteğe bağlı bilgi satırları ve katlanabilir yerleşim.
  - **Merit Tracker:** merit upgrade'lerini, boştaki ve harcanan meritlerini ve tamamlamaya en yakın honor ile medalları gösterir. Ödül verisi arka planda Awards sayfalarından toplanır; Torn'un ilerleme göstermediği ödüllerde (uçuş, finishing hit, defend, critical, refill, bounty, OC vb.) ilerleme API'den kişisel istatistiklerinle hesaplanır. Travel, Attack, Gym, Crimes ya da Borsa gibi sayfalara girince "Bağlantılar" altında bir pencere kendiliğinden açılır ve yalnızca o sayfayla ilgili ödülleri gösterir (uçuş sayfasında seçtiğin ülke en üstte olmak üzere tüm ülkeler).
  - **Crimes:** her seçenek için ortalama $/nerve ve başarı oranını (Hustling, yönteme göre Disposal, Forgery adımları, Burglary ve diğerleri dahil) kaydedip seçenek adının altında gösterir; Pickpocketing hedefleri kayıtlı başarı oranına göre renklenir; Hustling'in Gather Audience nerve'i desteklediği oyunlara dahil edilir. Kayıt her suç için sıfırlanabilir. Eşya ödülleri piyasa değeriyle hesaplanır.
  - **Hapishane:** seviye, süre ve FF filtresi; BUST onay kutusunu otomatik onaylama seçeneği (5 nerve harcar, bu yüzden varsayılan kapalı).
  - **Profil:** seninle o oyuncu arasındaki saldırı geçmişi özeti, can yüzdesi eşiğin altına inince Stake out uyarısı.
  - **Borsa:** her hissenin altında blok maliyeti, ödeme sıklığı ve günlük getiri, sıralama (#1, #2...) ve parana yetenleri işaretleyen ilk 5 listesi. Eşya bonuslarında eşya ve piyasa değeri yazılır. Bu veridir, tavsiye değildir; hisse fiyatları değişir.
  - **Faction OC:** her suç için ortalama slot başarısı, ağırlıklı başarı (rol ağırlıkları tornprobability.com'dan) ve en zayıf halka.
  - **Şirket:** hedef gün sayısına göre otomatik Stock Shipments doldurma ve "Depoyu doldur" düğmesi.
  - **Gym:** hazır Baldr's Ratio ve Hank's Ratio hedefleri.
  - **Ana sayfa, Battle Stats:** Battle Stats'ın altında ilaç, booster ve diğer geçici etkilerle güncel (efektif) statlarını gösteren ikinci bir pencere (ilaç kullanınca ya da debuff yiyince güncellenir).
  - **Missions:** her Duke görevi için ne istediğinin kısa özeti; hedefler ve ödüller Türkçeye çevrilir.
  - **Gym:** sıradaki antrenman için tahmini kazanç (Vladar formülü, son antrenmanından kalibre edilir). Gym noktaları gym panelinden ve API'den okunur; script her gym'i bir kez sessizce gezip noktalarını okur (14 gün sonra tekrar dener) ve hiçbir satın alma düğmesine basmaz.
  - **Şirket:** çalışan listesinin üstündeki "HEPSİNİ EĞİT" düğmesi, eğitilebilen her çalışanı sırayla eğitir.
  - **Profil:** Age kutusunun altında yaşın yıl, ay ve gün olarak da yazılır.
  - **Borsa:** her Buy ve Sell kutusunun üstündeki "$ miktar" alanı hisse adedini senin yerine doldurur (5m, 250k gibi kısaltmalar çalışır).
  - **Merit Tracker ekleri:** ödülleri yıldızla üste sabitleme; hedefi tamamlanmış ödüller %100 gösterilir.
  - **Eşyalar, loadout, Item Market ve Bazaar:** silah bonus açıklamaları bonus ikonunun yanında yazılır; Bazaar eşyalarında piyasa fiyatı ve %5 kesintiden sonra tahmini kâr görünür, ucuz ilanlar vurgulanır (fiyatı stat ve bonusa bağlı olan silah ve zırhlarda yapılmaz). NPC mağazalarında Shop Analyzer piyasa fiyatını ve kârı gösterir.
- **Bildirimler:** her uyarıyı ayrı seçtiğin tek bir Ayarlar bölümü (enerji, ilaç, tıbbi, booster, chain, hastane vb.), ayrıca ses ve ön uyarı.
- **Ayarlar:** arama kutusu, hazır profiller (Sade / Tam, Geri al ile), sürüm göstergesi ve "Güncellemeyi kontrol et", Torn bir sayfayı değiştirip bir özelliği bozarsa haber veren sağlık kontrolü (hata bildirimi için "Raporu kopyala") ve yapımcının iletişim bilgisi (YinxYang [3637531] · Discord: _yinyang).
- **Telefon / Torn PDA:** 600 px ve altı ekranlarda saldırı mini penceresi yalnızca enerji, hedef adı ve durumu, Saldır ve Atla'yı gösterir; uçuş önerileri paneli kompakttır. Eksik `GM_` fonksiyonları yerleşik yedeklerle karşılanır. Her özellik Torn PDA içinde denenmedi; sorun görürsen bildir.
- **Güncellemeler:** her yeni sürümde bir kez açılan güncelleme notu penceresi; yeni ayarın Ayarlar'da nerede olduğunu yazar, atlanan sürümleri sayfa sayfa gösterir.
- **Arayüz**
  - Yan panel olarak açılır, Geniş/Dar düğmesi her mod için hatırlanır (Faction yönetimi geniş açılır).
  - Ana ekranda enerji, nerve, cooldown, hedef kuyruğu ve süren Torn event'inin kalan süresini (Torn'un kendi banner'ından okunur) gösteren bir durum şeridi ve her mod kartında küçük bir durum bilgisi var.
  - Torn bağlantısı bölümü anahtar kaydedilince kendiliğinden katlanır.
  - Açma düğmesi istediğin yere sürüklenir ve yerini hatırlar. `Alt+Shift+T` ya da `Esc` paneli açıp kapatır. İsteğe bağlı olarak enerjin dolunca düğmede bir nokta çıkar (dakikada bir arka plan isteği, varsayılan kapalı).
  - Mini pencere dört köşeden birine konabilir.

## Kurulum

1. Tarayıcına [Tampermonkey](https://www.tampermonkey.net/) kur.
2. Ham scripti aç ve **Install**'a bas:
   [torn-helper.user.js](https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js)
3. torn.com'u yenile. Sol altta **Torn-Helper** düğmesi çıkar.

Güncellemeleri Tampermonkey kendiliğinden alır.

## Ayarlar

1. Torn'da **Limited Access** seviyesinde bir API anahtarı oluştur: Ayarlar → API Key.
2. Torn-Helper'ı aç, ana ekrandaki "Torn bağlantısı" bölümüne anahtarı yapıştırıp kaydet. Başka sayfalarda tekrar girmen gerekmez.
3. İsteğe bağlı: FF Scouter anahtarını da yapıştır. FF değerlerinin çalışması için ffscouter.com'da kayıtlı olman gerekir.
4. Faction özellikleri için anahtarında Faction erişimi olmalı, bu genelde lider ya da yetkili üyede bulunur.

## Gizlilik

- API anahtarların, hedef listen ve ayarların yalnızca bilgisayarındaki Tampermonkey'in kendi deposunda saklanır. Torn sayfasının kendisi bunları okuyamaz.
- İstekler yalnızca `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk`, `yata.yt` ve `tornprobability.com` (burada yalnızca herkese açık OC rol ağırlıkları istenir) adreslerine gider. Torn anahtarın yalnızca Torn'a, FF Scouter anahtarın yalnızca FF Scouter'a gönderilir.
- Kendi sunucumuz ve analiz aracı yoktur.

## Veri kaynakları ve sınırlar

- Yurtdışı stok ve fiyatlar Prombot (yedek olarak YATA) topluluk servislerinden gelir. Bu servisler kapalıysa o bölüm çalışmaz.
- Yurtdışı karşılaştırmasında Torn tarafı, Torn'un ortalama piyasa değeridir. En ucuz güncel ilan değildir.
- Diğer oyuncuların gerçek battle stat'ı ve cebindeki nakit API'den alınamaz. FF değerleri ve networth tahmin ve üst sınırdır.
- Bazı faction, organized crime ve cooldown alanları herkese açık API davranışına göre yazıldı ve diğer bölümlerden daha az test edildi. Bir bölüm boş görünürse Torn bağlantısı bölümündeki hata ayıklama kutusunu açıp yanıtı bir issue'da bildir.
- Faction üyeleri arasında ortak hit-call yapılamaz, çünkü ortak bir sunucu yoktur.
- Kişisel istatistiklerden okunan merit ilerlemesi, NPC Loot tahminleri, eşya bonuslu hisselerin değerleri ve Crimes ortalamaları, herkese açık API'den ve Torn'un sayfada gösterdiğinden üretilmiş tahminlerdir. Güvenmeden önce gerçek değerlerle karşılaştır.

## Yedek

Faction yönetimi → Yedek sekmesinden tüm veriyi metin ya da dosya olarak dışa aktarıp başka yerde geri yükleyebilirsin. API anahtarları, kutuyu işaretlemedikçe yedeğe girmez.

## Destek

Hata mı buldun ya da fikrin mi var? Bir [issue](https://github.com/DgkYY/Torn-Helper/issues) aç. Bir bölüm veri göstermiyorsa hata ayıklama kutusundaki yanıtı da ekle (önce API anahtarını sil).
