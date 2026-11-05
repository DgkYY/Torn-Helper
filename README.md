# Torn-Helper

**English** · [Türkçe](#türkçe)

A Tampermonkey userscript that adds a helper panel to [Torn City](https://www.torn.com): target list with quick-attack buttons, Halloween/Mug queue, Ranked War mode, faction management tools, an abroad-price checker, Item Market and chat helpers. The interface is available in English and Turkish.

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
  - **Merit Tracker:** shows your merit upgrades, unspent and spent merits, and the honors and medals closest to completion. The award list comes from the official API (honors and medals), and progress that Torn does not show (flights, finishing hits, defends, criticals, refills, bounties, OC and so on) is calculated from your personal stats through the API. On pages such as Travel, Attack, Gym, Crimes or the Stock Market, a panel under "Links" opens by itself and shows only the awards that relate to that page (on the flight page, every country with the one you picked first).
  - **Crimes:** logs average $/nerve and success rate for every option (including Hustling, Disposal per method, Forgery steps, Burglary and others) and shows it under the option name; Pickpocketing targets are colored by your logged success rate; the Hustling Gather Audience nerve is counted in the games it supports. The log can be reset per crime. Item rewards are valued at market value.
  - **Jail:** level, time and FF filters; optional automatic confirmation of the BUST dialog (it spends 5 nerve, so it is off by default).
  - **Profile:** attack history summary between you and the player, Stake out alerts when life drops below your threshold.
  - **Stock Market:** under every stock the block cost, payout frequency and daily return, a ranking (#1, #2...) and a top 5 list that marks what you can afford. Item bonuses show the item and its market value. This is data, not advice; share prices move.
  - **Faction OC:** per-crime average slot success rate, weighted success (role weights from tornprobability.com) and the weakest link.
  - **Company:** Stock Shipments auto-fill by target days and a "fill the warehouse" button.
  - **Gym:** ready-made Baldr's Ratio and Hank's Ratio targets.
  - **Home page, Battle Stats:** a second panel under Battle Stats with your effective stats including drug, booster and other temporary modifiers (updates when you take a drug or get a debuff).
  - **Missions:** a short summary of what each Duke mission objective asks for; objectives and rewards are translated.
  - **Gym:** estimated gain for the next train (Vladar formula, calibrated from your last train). Gym dots come from the official API and from the gym panels you open yourself; the script never opens gym panels on its own and never presses a purchase button.
  - **Company:** a "TRAIN ALL" button above the employee list trains every employee who can be trained, one after another.
  - **Profile:** your age is also shown as years, months and days under the Age box.
  - **Stock Market:** a "$ amount" field above each Buy and Sell box fills in the share count for you (shortcuts like 5m or 250k work).
  - **Merit Tracker extras:** pin awards on top with a star; awards whose target is reached show 100%.
  - **Items, loadout, Item Market and Bazaar:** weapon bonus descriptions written next to the bonus icon; Bazaar items show market price and estimated profit after the 5% fee, and cheap listings are highlighted (not for weapons and armor, whose price depends on stats and bonuses). NPC shop Shop Analyzer shows market price and profit.
  - **Gym extras:** the page header shows progress and the estimated energy left for the next gym; a "Lock this stat" box under each stat blocks TRAIN while it is locked.
  - **Sidebar extras:** the Energy/Nerve refill is highlighted when it is ready; your job points are added to the Job/Company tooltip (needs a key with the `user/jobpoints` selection); mini profiles show the player's last action.
  - **Properties:** market value and happiness on every property, the property you live in outlined green, leases ending within 3 days orange, and a filter by lease days left and status (occupied / leased / empty).
  - **Quick Market:** a button in the top-right corner opens a small window: type an item name, pick a result and the cheapest listings are shown by price; click one to open it in the Item Market. For weapons and armor you can filter by minimum damage, accuracy, armor and quality, and pick a bonus (the 100 cheapest listings with that bonus are loaded). The item list is fetched through the API once an hour.
  - **Inventory prices:** on the Items page every item shows the Item Market lowest listing next to its name (market value in grey until it loads), with the total when you own several. For weapons and armor the price is the cheapest listing with the same bonus and at least the same stats, shown with a leading ≥. One API request per visible item, 20 minutes cache. Energy drinks, alcohol (nerve) and candy (happy) show their real value including faction, book and company bonuses.
  - **More small helpers (all optional in Settings):**
    - *Sidebar:* TCT (Torn server time) clock, Company Addiction, Ranked War counter, OC time, virus coding counter, Nerve Refill and Bank reminders, market value next to points, clickable bars (Energy to Gym, Nerve to Alcohol, Happy to Candy, Life to Medical and so on), a shared notes box, your own links list, a collapsible Areas list, hiding of status icons and of the Gym / Newspaper highlights, and an option to left-align the Torn page.
    - *Page header:* hide the Tutorial button and tutorial boxes, Level Upgrade links and the "Leave" links.
    - *Item Market:* cheap listings (below market average) in green; a Fill button per item that types price and quantity without pressing the list button; Item Locker (lock button per item so a locked item cannot be listed); optional auto-"Yes" on the BUY confirmation (careful: a wrong click buys).
    - *Bazaar:* market average and estimated profit under every item, cheap ones outlined green, live quantity x price total in the buy panel.
    - *Items page:* weapon bonus descriptions under the name, and drug effects next to the name.
    - *Trade page:* total value of both sides (item market value + cash) and a seconds countdown with the end time.
    - *Rental Market:* when you list a property, the cheapest listing's daily price is filled in and the total follows the day count.
    - *Faction profiles and bounties:* a cross over the Attack button on a member of your own faction; a bounty filter (minimum reward, level range, status).
    - *Other:* the supply pack / crate opening animation is hidden and shortened.
  - **Books and enhancers:** on the Items page every book and Enhancer item gets a one-line effect summary next to its name (first sentence of Torn's item effect text; Turkish wording for common patterns, otherwise English; full text on hover).
  - **Top-right buttons:** Quick Market, ChatSearch and Hide chat sit in a small bar in the top-right corner. If it would cover Torn's own icons (narrow windows, for example in Opera) it moves down to free space automatically; you can also drag it by the left handle (position is remembered, double-click resets).
  - **Chat:** attack / message / bounty links next to player names; messages containing your chosen words (default: your name) are highlighted and notify when new; **ChatSearch** in the top-right corner searches the messages you have seen (kept only on this device); a Hide / Show chat button; a resize handle on the top-left corner of every chat box (size is remembered); `@name` autocomplete from players seen in that chat (pick with Tab); and in the Trade chat header a timer for the next message (interval is set in Settings). Chat features only read messages that are already on your screen.
  - **Attack page:** a "Last known equipment" box shows the latest loadout other users of this tool saw for that opponent (see Privacy for the optional shared server); without shared data it falls back to your own local record.
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
- Requests go only to `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk`, `yata.yt`, `tornprobability.com` (only the public OC role weights are requested there) and the shared loadout server `torn-helper-server.th-helper.workers.dev`. Your Torn key is sent only to Torn, and your FF Scouter key only to FF Scouter.
- **Shared loadout server (optional, asks once):** after you save a key you are asked whether to share. If you agree, the loadout of opponents you attack (opponent Torn ID, weapons, armour, level, chain count, attack result and respect) is uploaded and the attack page shows loadouts other users saw. Your identity and API key are never sent. You can turn sharing on or off at any time in the API key section of Settings.
- No analytics. Chat features only read messages that are already shown on your screen, and the chat search log stays on your device.

## Data sources and limits

- Abroad stock and prices come from the community services Prombot (with YATA as a fallback). If they are down, that section stops working.
- The Torn side of the abroad comparison is Torn's average market value, not the cheapest current listing.
- Other players' real battle stats and cash on hand are not available through the API. FF values and networth are estimates and upper bounds.
- Some faction, organized crime and cooldown fields were implemented from the public API behaviour and are less tested than the rest. If a section looks empty, open the debug box in the Torn connection section and report the response in an issue.
- Live hit-calling between faction members is not possible; the shared server only stores opponent loadouts.
- Quick Market and inventory prices come from Item Market listings at the moment of the request and can be outdated within minutes. The bonus filter of Quick Market relies on the API's bonus parameter; if no listing shows the chosen bonus a warning is displayed.
- Merit progress read from personal stats, NPC Loot estimates, stock values for item bonuses and the Crimes averages are estimates built from the public API and what Torn shows on the page. Compare them with the real values before relying on them.

## Backup

Open Faction management → Backup to export all data as text or a file and restore it elsewhere. API keys are excluded unless you tick the box.

## Support

Found a bug or have an idea? Open an [issue](https://github.com/DgkYY/Torn-Helper/issues). If a section does not show data, include the response from the debug box (remove your API key first).

---

# Türkçe

[Torn City](https://www.torn.com) için bir Tampermonkey scripti: hızlı saldırı düğmeli hedef listesi, Halloween/Mug sırası, Ranked War modu, faction yönetim araçları, yurtdışı fiyat karşılaştırıcı, Item Market ve sohbet yardımcıları. Arayüz Türkçe ve İngilizce kullanılabilir.

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
  - **Merit Tracker:** merit upgrade'lerini, boştaki ve harcanan meritlerini ve tamamlamaya en yakın honor ile medalları gösterir. Ödül listesi resmi API'den (honor ve medal) gelir; Torn'un ilerleme göstermediği ödüllerde (uçuş, finishing hit, defend, critical, refill, bounty, OC vb.) ilerleme API'den kişisel istatistiklerinle hesaplanır. Travel, Attack, Gym, Crimes ya da Borsa gibi sayfalara girince "Bağlantılar" altında bir pencere kendiliğinden açılır ve yalnızca o sayfayla ilgili ödülleri gösterir (uçuş sayfasında seçtiğin ülke en üstte olmak üzere tüm ülkeler).
  - **Crimes:** her seçenek için ortalama $/nerve ve başarı oranını (Hustling, yönteme göre Disposal, Forgery adımları, Burglary ve diğerleri dahil) kaydedip seçenek adının altında gösterir; Pickpocketing hedefleri kayıtlı başarı oranına göre renklenir; Hustling'in Gather Audience nerve'i desteklediği oyunlara dahil edilir. Kayıt her suç için sıfırlanabilir. Eşya ödülleri piyasa değeriyle hesaplanır.
  - **Hapishane:** seviye, süre ve FF filtresi; BUST onay kutusunu otomatik onaylama seçeneği (5 nerve harcar, bu yüzden varsayılan kapalı).
  - **Profil:** seninle o oyuncu arasındaki saldırı geçmişi özeti, can yüzdesi eşiğin altına inince Stake out uyarısı.
  - **Borsa:** her hissenin altında blok maliyeti, ödeme sıklığı ve günlük getiri, sıralama (#1, #2...) ve parana yetenleri işaretleyen ilk 5 listesi. Eşya bonuslarında eşya ve piyasa değeri yazılır. Bu veridir, tavsiye değildir; hisse fiyatları değişir.
  - **Faction OC:** her suç için ortalama slot başarısı, ağırlıklı başarı (rol ağırlıkları tornprobability.com'dan) ve en zayıf halka.
  - **Şirket:** hedef gün sayısına göre otomatik Stock Shipments doldurma ve "Depoyu doldur" düğmesi.
  - **Gym:** hazır Baldr's Ratio ve Hank's Ratio hedefleri.
  - **Ana sayfa, Battle Stats:** Battle Stats'ın altında ilaç, booster ve diğer geçici etkilerle güncel (efektif) statlarını gösteren ikinci bir pencere (ilaç kullanınca ya da debuff yiyince güncellenir).
  - **Missions:** her Duke görevi için ne istediğinin kısa özeti; hedefler ve ödüller Türkçeye çevrilir.
  - **Gym:** sıradaki antrenman için tahmini kazanç (Vladar formülü, son antrenmanından kalibre edilir). Gym noktaları resmi API'den ve senin kendi açtığın gym panellerinden gelir; script gym panellerini kendiliğinden açmaz ve hiçbir satın alma düğmesine basmaz.
  - **Şirket:** çalışan listesinin üstündeki "HEPSİNİ EĞİT" düğmesi, eğitilebilen her çalışanı sırayla eğitir.
  - **Profil:** Age kutusunun altında yaşın yıl, ay ve gün olarak da yazılır.
  - **Borsa:** her Buy ve Sell kutusunun üstündeki "$ miktar" alanı hisse adedini senin yerine doldurur (5m, 250k gibi kısaltmalar çalışır).
  - **Merit Tracker ekleri:** ödülleri yıldızla üste sabitleme; hedefi tamamlanmış ödüller %100 gösterilir.
  - **Eşyalar, loadout, Item Market ve Bazaar:** silah bonus açıklamaları bonus ikonunun yanında yazılır; Bazaar eşyalarında piyasa fiyatı ve %5 kesintiden sonra tahmini kâr görünür, ucuz ilanlar vurgulanır (fiyatı stat ve bonusa bağlı olan silah ve zırhlarda yapılmaz). NPC mağazalarında Shop Analyzer piyasa fiyatını ve kârı gösterir.
  - **Gym ekleri:** sayfa başlığında sıradaki gym'e ilerleme ve tahmini kalan enerji yazar; her statın altındaki "Bu statı kilitle" kutusu kilitliyken TRAIN'i engeller.
  - **Kenar çubuğu ekleri:** Energy/Nerve refill hazır olunca vurgulanır; iş puanların Job/Company ipucuna eklenir (anahtarında `user/jobpoints` seçimi gerekir); mini profillerde oyuncunun son aktiflik zamanı yazar.
  - **Mülkler:** her mülkte piyasa değeri ve happiness, oturduğun mülk yeşil çerçeveli, kirası 3 gün içinde biten turuncu; kalan kira gününe ve duruma (oturulan / kirada / boş) göre filtre.
  - **Hızlı Market:** sağ üst köşedeki düğme küçük bir pencere açar: eşya adını yaz, sonuçtan birini seç, en ucuz ilanlar fiyat sırasıyla gelir; birine tıklayınca Item Market'te açılır. Silah ve zırhta en az hasar, isabet, zırh ve kaliteye göre süzme ve bonus seçimi vardır (bonus seçince o bonuslu en ucuz 100 ilan yüklenir). Eşya listesi saatte bir API ile alınır.
  - **Envanter fiyatları:** Items sayfasında her eşyanın adının yanında Item Market'teki en ucuz ilan fiyatı görünür (yüklenene kadar gri piyasa değeri), birden çoksa toplamıyla. Silah ve zırhta fiyat, aynı bonuslu ve en az aynı statlı en ucuz ilandır ve başında ≥ yazar. Ekranda görünen her eşya için bir API isteği, 20 dk önbellek. Enerji içeceklerinde (E), alkolde (nerve) ve şekerde (happy) faction, kitap ve şirket bonuslu gerçek değer de yazar.
  - **Diğer küçük yardımcılar (hepsi Ayarlar'dan açılıp kapanır):**
    - *Kenar çubuğu:* TCT (Torn sunucu saati) saati, şirket bağımlılığı, Ranked War sayacı, OC süresi, virüs kodlama sayacı, Nerve Refill ve Bank hatırlatıcıları, puanın yanında piyasa değeri, tıklanabilir bar'lar (Energy → Gym, Nerve → Alkol, Happy → Şeker, Life → Tıbbi vb.), ortak not kutusu, kendi bağlantı listen, daraltılabilir Areas listesi, durum ikonlarını ve Gym / Newspaper vurgularını gizleme, Torn sayfasını sola yaslama.
    - *Sayfa başlığı:* Tutorial düğmesini ve öğretici kutularını, Level Upgrade bağlantılarını ve "Leave" bağlantılarını gizleme.
    - *Item Market:* piyasa ortalamasından ucuz ilanlar yeşil; her ürüne, fiyat ve adedi yazan ama listeleme düğmesine basmayan Doldur düğmesi; Item Locker (ürün başına kilit düğmesi, kilitli ürün listelenemez); BUY onayını otomatik "Yes" yapma seçeneği (dikkat: yanlış tıklama satın alır).
    - *Bazaar:* her ürünün altında piyasa ortalaması ve tahmini kâr, ucuzlar yeşil çerçeveli, satın alma panelinde canlı adet × fiyat toplamı.
    - *Eşyalar sayfası:* silah bonus açıklamaları ürün adının altında, ilaçların etkisi ürün adının yanında.
    - *Trade sayfası:* iki tarafın toplam değeri (eşya piyasa değeri + para) ve saniyeli bitiş geri sayımı ile bitiş saati.
    - *Rental Market:* mülkü kiraya koyarken en ucuz ilanın günlük fiyatı yazılır, gün sayısı değişince toplam güncellenir.
    - *Faction profilleri ve bounty:* kendi factionundan birinin Attack düğmesinin üstüne çarpı; bounty filtresi (en düşük ödül, seviye aralığı, durum).
    - *Diğer:* supply pack / kutu açma animasyonu gizlenir ve kısaltılır.
  - **Kitaplar ve enhancer'lar:** Items sayfasında her kitabın ve Enhancer eşyasının adının yanına tek satırlık etki özeti yazılır (Torn'un eşya etki metninin ilk cümlesi; bilinen kalıplar Türkçe, diğerleri İngilizce; tam metin üzerine gelince).
  - **Sağ üst düğmeler:** Hızlı Market, SohbetAra ve Sohbeti gizle sağ üst köşedeki küçük bir çubukta durur. Torn'un kendi simgelerini örtecekse (dar pencereler, örneğin Opera) kendiliğinden boş yere iner; solundaki tutamaçtan sürükleyebilirsin (konum hatırlanır, çift tık sıfırlar).
  - **Sohbet:** oyuncu adlarının yanında saldır / mesaj / ödül bağlantıları; seçtiğin kelimeleri (varsayılan adın) içeren mesajlar vurgulanır ve yeni gelince bildirilir; sağ üstteki **SohbetAra** gördüğün mesajlarda arar (yalnızca bu cihazda tutulur); Sohbeti gizle / göster düğmesi; her sohbet kutusunun sol üst köşesinde boyutlandırma tutamacı (boyut hatırlanır); o sohbette görünen oyunculardan `@isim` tamamlama (Tab ile seç); Takas sohbeti başlığında sıradaki mesaja kalan süre sayacı (aralık Ayarlar'dan). Sohbet özellikleri yalnızca ekranında zaten görünen mesajları okur.
  - **Saldırı sayfası:** "Bilinen son ekipman" kutusu, bu aracı kullanan diğer oyuncuların o rakipte gördüğü son teçhizatı gösterir (isteğe bağlı ortak sunucu için Gizlilik'e bak); ortak veri yoksa kendi yerel kaydına döner.
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
- İstekler yalnızca `api.torn.com`, `ffscouter.com`, `api.prombot.co.uk`, `yata.yt`, `tornprobability.com` (burada yalnızca herkese açık OC rol ağırlıkları istenir) ve ortak teçhizat sunucusu `torn-helper-server.th-helper.workers.dev` adreslerine gider. Torn anahtarın yalnızca Torn'a, FF Scouter anahtarın yalnızca FF Scouter'a gönderilir.
- **Ortak teçhizat sunucusu (isteğe bağlı, bir kez sorar):** anahtarı kaydettikten sonra paylaşıp paylaşmayacağın sorulur. Onaylarsan saldırdığın rakiplerin teçhizatı (rakibin Torn ID'si, silahları, zırhı, seviyesi, zincir sayısı, saldırı sonucu ve respect) yüklenir ve saldırı sayfasında diğer kullanıcıların gördüğü teçhizat görünür. Kimliğin ve API anahtarın hiçbir zaman gönderilmez. Paylaşımı Ayarlar'daki API anahtarı bölümünden istediğin zaman açıp kapatabilirsin.
- Analiz aracı yoktur. Sohbet özellikleri yalnızca ekranında zaten görünen mesajları okur, sohbet arama kaydı cihazında kalır.

## Veri kaynakları ve sınırlar

- Yurtdışı stok ve fiyatlar Prombot (yedek olarak YATA) topluluk servislerinden gelir. Bu servisler kapalıysa o bölüm çalışmaz.
- Yurtdışı karşılaştırmasında Torn tarafı, Torn'un ortalama piyasa değeridir. En ucuz güncel ilan değildir.
- Diğer oyuncuların gerçek battle stat'ı ve cebindeki nakit API'den alınamaz. FF değerleri ve networth tahmin ve üst sınırdır.
- Bazı faction, organized crime ve cooldown alanları herkese açık API davranışına göre yazıldı ve diğer bölümlerden daha az test edildi. Bir bölüm boş görünürse Torn bağlantısı bölümündeki hata ayıklama kutusunu açıp yanıtı bir issue'da bildir.
- Faction üyeleri arasında canlı hit-call yapılamaz; ortak sunucu yalnızca rakip teçhizatını saklar.
- Hızlı Market ve envanter fiyatları, istek anındaki Item Market ilanlarından gelir ve dakikalar içinde eskiyebilir. Hızlı Market'in bonus süzmesi API'nin bonus parametresine dayanır; hiçbir ilanda seçilen bonus görünmezse uyarı gösterilir.
- Kişisel istatistiklerden okunan merit ilerlemesi, NPC Loot tahminleri, eşya bonuslu hisselerin değerleri ve Crimes ortalamaları, herkese açık API'den ve Torn'un sayfada gösterdiğinden üretilmiş tahminlerdir. Güvenmeden önce gerçek değerlerle karşılaştır.

## Yedek

Faction yönetimi → Yedek sekmesinden tüm veriyi metin ya da dosya olarak dışa aktarıp başka yerde geri yükleyebilirsin. API anahtarları, kutuyu işaretlemedikçe yedeğe girmez.

## Destek

Hata mı buldun ya da fikrin mi var? Bir [issue](https://github.com/DgkYY/Torn-Helper/issues) aç. Bir bölüm veri göstermiyorsa hata ayıklama kutusundaki yanıtı da ekle (önce API anahtarını sil).
