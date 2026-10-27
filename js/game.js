/*
 * game.js — Pelin ydin
 * Hoitaa pelisilmukan, tasot & vaikeustason, kentän generoinnin,
 * törmäykset ja pelitilat (aloitus → peli → game over).
 */

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const levelEl = document.getElementById('level');
  const progressEl = document.getElementById('progress');
  const goalEl = document.getElementById('goal');
  const huskyLevelEl = document.getElementById('huskyLevel');
  const gemsEl = document.getElementById('gems');
  const fishCountEl = document.getElementById('fish-count');
  const livesEl = document.getElementById('lives');
  const xpFillEl = document.getElementById('xpfill');
  const perksEl = document.getElementById('perks');
  const bannerEl = document.getElementById('banner');
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const startBtn = document.getElementById('start-btn');
  const highscoresEl = document.getElementById('highscores');
  const muteBtn = document.getElementById('mute-btn');
  const quitBtn = document.getElementById('quit-btn');
  const tempHud = document.getElementById('temp-hud');
  const tempValue = document.getElementById('temp-value');
  const hudTimeEl = document.getElementById('hud-time');
  const radarContainer = document.getElementById('radar-container');
  const radarToggleBtn = document.getElementById('radar-toggle-btn');

  // Jalokivikaupan käyttöliittymä
  const shopOverlay = document.getElementById('shop-overlay');
  const shopGemCount = document.getElementById('shop-gem-count');
  const shopSkinsList = document.getElementById('shop-skins-list');
  const shopItemsList = document.getElementById('shop-items-list');
  const shopHatsList = document.getElementById('shop-hats-list');
  const shopCompanionSkinsList = document.getElementById('shop-companion-skins-list');
  const shopCompanionHatsList = document.getElementById('shop-companion-hats-list');
  const shopCloseBtn = document.getElementById('shop-close-btn');
  const shopBtnOpen = document.getElementById('shop-btn-open');

  // Bestiariumin käyttöliittymä
  const codexOverlay = document.getElementById('codex-overlay');
  const codexGrid = document.getElementById('codex-grid');
  const codexCloseBtn = document.getElementById('codex-close-btn');
  const codexBtnOpen = document.getElementById('codex-btn-open');

  // Mökin käyttöliittymä
  const cabinOverlay = document.getElementById('cabin-overlay');
  const cabinGrid = document.getElementById('cabin-upgrades-list');
  const cabinCloseBtn = document.getElementById('cabin-close-btn');
  const cabinGemCount = document.getElementById('cabin-gem-count');

  const cabinetOverlay = document.getElementById('cabinet-overlay');
  const cabinetCloseBtn = document.getElementById('cabinet-close-btn');
  const cabinetShelvesGrid = document.getElementById('cabinet-shelves-grid');
  const cabinetLoreCard = document.getElementById('cabinet-lore-card');

  const achievementsOverlay = document.getElementById('achievements-overlay');
  const achievementsCloseBtn = document.getElementById('achievements-close-btn');
  const achievementsPanelList = document.getElementById('achievements-panel-list');

  const cookingOverlay = document.getElementById('cooking-overlay');
  const cookingCloseBtn = document.getElementById('cooking-close-btn');
  const cookingIngredientsBar = document.getElementById('cooking-ingredients-bar');
  const cookingRecipesList = document.getElementById('cooking-recipes-list');

  const diaryOverlay = document.getElementById('diary-overlay');
  const diaryCloseBtn = document.getElementById('diary-close-btn');
  const diaryAnimalList = document.getElementById('diary-animal-list');
  const diaryBtnOpen = document.getElementById('diary-btn-open');

  const gardenOverlay = document.getElementById('garden-overlay');
  const gardenCloseBtn = document.getElementById('garden-close-btn');
  const gardenSlotsList = document.getElementById('garden-slots-list');

  const gramophoneOverlay = document.getElementById('gramophone-overlay');
  const gramophoneCloseBtn = document.getElementById('gramophone-close-btn');
  const gramophoneTracksList = document.getElementById('gramophone-tracks-list');
  const gramophoneDisc = document.getElementById('gramophone-disc');
  const gramophoneTrackTitle = document.getElementById('gramophone-track-title');
  const gramophoneTrackStatus = document.getElementById('gramophone-track-status');
  const gramophoneVolumeInput = document.getElementById('gramophone-volume');

  const questsOverlay = document.getElementById('quests-overlay');
  const questsBtnOpen = document.getElementById('quests-btn-open');
  const questsCloseBtn = document.getElementById('quests-close-btn');
  const questsList = document.getElementById('quests-list');
  const questsDailyDate = document.getElementById('quests-daily-date');
  const questsMasterStatus = document.getElementById('quests-master-status');
  const questsClaimMasterBtn = document.getElementById('quests-claim-master-btn');

  const wishingWellOverlay = document.getElementById('wishing-well-overlay');
  const wishingWellCloseBtn = document.getElementById('wishing-well-close-btn');
  const wellWishBonesBtn = document.getElementById('well-wish-bones-btn');
  const wellWishGemsBtn = document.getElementById('well-wish-gems-btn');
  const wellBonesCount = document.getElementById('well-bones-count');
  const wellGemsCount = document.getElementById('well-gems-count');
  const wellResultBanner = document.getElementById('well-result-banner');

  const agilityFinishOverlay = document.getElementById('agility-finish-overlay');
  const agilityMedalDisplay = document.getElementById('agility-medal-display');
  const agilityMedalTitle = document.getElementById('agility-medal-title');
  const agilityStatTime = document.getElementById('agility-stat-time');
  const agilityStatPenalties = document.getElementById('agility-stat-penalties');
  const agilityStatFinal = document.getElementById('agility-stat-final');
  const agilityStatBest = document.getElementById('agility-stat-best');
  const agilityRewardsText = document.getElementById('agility-rewards-text');
  const agilityRetryBtn = document.getElementById('agility-retry-btn');
  const agilityExitBtn = document.getElementById('agility-exit-btn');

  const talentsOverlay = document.getElementById('talents-overlay');
  const talentsBtnOpen = document.getElementById('talents-btn-open');
  const talentsCloseBtn = document.getElementById('talents-close-btn');
  const talentsBonesCount = document.getElementById('talents-bones-count');
  const talentsGemsCount = document.getElementById('talents-gems-count');
  const talentsBranchesGrid = document.getElementById('talents-branches-grid');

  const fossilsOverlay = document.getElementById('fossils-overlay');
  const fossilsBtnOpen = document.getElementById('fossils-btn-open');
  const fossilsCloseBtn = document.getElementById('fossils-close-btn');
  const fossilsGrid = document.getElementById('fossils-grid');
  const fossilsFoundCount = document.getElementById('fossils-found-count');
  const fossilsBonusPct = document.getElementById('fossils-bonus-pct');

  const puppiesOverlay = document.getElementById('puppies-overlay');
  const puppiesBtnOpen = document.getElementById('puppies-btn-open');
  const puppiesCloseBtn = document.getElementById('puppies-close-btn');
  const puppiesGrid = document.getElementById('puppies-grid');
  const puppiesFoundCount = document.getElementById('puppies-found-count');
  const puppiesActiveName = document.getElementById('puppies-active-name');


  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      Audio.unlock();
      const on = Audio.toggle();
      muteBtn.textContent = on ? '🔊' : '🔇';
    });
  }

  if (radarToggleBtn && radarContainer) {
    radarToggleBtn.addEventListener('click', () => {
      radarContainer.classList.toggle('radar-collapsed');
      Audio.play('click');
    });
  }
  const skillOverlay = document.getElementById('skill-overlay');
  const skillCardsEl = document.getElementById('skill-cards');
  const huskyLevelUpEl = document.getElementById('huskyLevelUp');

  // Näkymän (viewportin) koko — tämä on canvasin koko, joka skaalataan ruutuun.
  // Kamera näyttää tämän kokoisen palan isommasta maailmasta.
  const viewport = { width: 960, height: 640 };
  // Pelimaailma on selvästi viewporttia isompi → kamera seuraa huskya.
  const world = { width: 1920, height: 1280 };
  const center = { x: world.width / 2, y: world.height / 2 };
  const cam = { x: 0, y: 0 };

  // --- Biomit: jokaisella tasolla oma teema (värit, esteet, eläimet) ---
  const BIOMES = [
    { id: 'forest', name: 'Metsä', emoji: '🌲', ground: '#3a5a3a', grid: 'rgba(255,255,255,0.04)',
      rockFill: '#6b6b72', rockStroke: '#4a4a50', bushFill: '#2e7d32', bushEmoji: '🌳',
      prey: ['rabbit', 'mouse', 'squirrel', 'hedgehog', 'bird', 'deer'] },
    { id: 'snow', name: 'Lumiaava', emoji: '❄️', ground: '#c2cedd', grid: 'rgba(90,110,140,0.10)',
      rockFill: '#9fb3c8', rockStroke: '#7c93ad', bushFill: '#eaf2fa', bushEmoji: '🌲',
      prey: ['rabbit', 'mouse', 'hedgehog', 'bird', 'deer'] },
    { id: 'desert', name: 'Aavikko', emoji: '🏜️', ground: '#d8c088', grid: 'rgba(120,90,40,0.08)',
      rockFill: '#b89a64', rockStroke: '#947a4c', bushFill: '#7e8b3a', bushEmoji: '🌵',
      prey: ['mouse', 'squirrel', 'bird', 'hedgehog'] },
    { id: 'swamp', name: 'Suo', emoji: '🌿', ground: '#2c3a2c', grid: 'rgba(130,170,130,0.06)',
      rockFill: '#5a6450', rockStroke: '#3e463a', bushFill: '#3a5a3a', bushEmoji: '🌿',
      prey: ['rabbit', 'mouse', 'squirrel', 'hedgehog', 'bird', 'beaver'] },
    { id: 'volcano', name: 'Tulivuorimaa', emoji: '🌋', ground: '#281816', grid: 'rgba(255,90,40,0.06)',
      rockFill: '#5a4642', rockStroke: '#3c2b29', bushFill: '#42241e', bushEmoji: '🔥',
      prey: ['rabbit', 'mouse', 'squirrel', 'bird'] },
    { id: 'river', name: 'Jokivarsi', emoji: '🌊', ground: '#2a4a2a', grid: 'rgba(100,180,100,0.06)',
      rockFill: '#5a7a5a', rockStroke: '#3a5a3a', bushFill: '#2e6e2e', bushEmoji: '🌿',
      prey: ['rabbit', 'mouse', 'squirrel', 'bird', 'beaver', 'deer'] },
    { id: 'jungle', name: 'Viidakko', emoji: '🌴', ground: '#124424', grid: 'rgba(255,255,255,0.04)',
      rockFill: '#4e563d', rockStroke: '#2d3320', bushFill: '#008a20', bushEmoji: '🌴',
      prey: ['rabbit', 'mouse', 'bird', 'monkey'] },
    { id: 'foggy_peaks', name: 'Sumuvuoret', emoji: '⛰️', ground: '#5e6b75', grid: 'rgba(255,255,255,0.03)',
      rockFill: '#7a8c99', rockStroke: '#586772', bushFill: '#414e59', bushEmoji: '🌲',
      prey: ['rabbit', 'bird', 'mountain_goat'] },
    { id: 'autumn_woods', name: 'Ruskarunsaat', emoji: '🍂', ground: '#854e17', grid: 'rgba(255,210,80,0.06)',
      rockFill: '#8b5a2b', rockStroke: '#5c3a21', bushFill: '#c0392b', bushEmoji: '🍁',
      prey: ['rabbit', 'squirrel', 'hedgehog', 'bird', 'deer', 'weasel'] },
    { id: 'crystals', name: 'Kristalliluola', emoji: '💎', ground: '#140d24', grid: 'rgba(155,93,229,0.08)',
      rockFill: '#4a2f7d', rockStroke: '#9b5de5', bushFill: '#3c165a', bushEmoji: '🔮',
      prey: ['rabbit', 'mouse', 'squirrel', 'bird', 'weasel'] },
    { id: 'aurora', name: 'Revontulilaakso', emoji: '🌌', ground: '#0c162d', grid: 'rgba(0, 229, 255, 0.08)',
      rockFill: '#1c2847', rockStroke: '#38ef7d', bushFill: '#11998e', bushEmoji: '✨',
      prey: ['rabbit', 'mouse', 'bird', 'weasel', 'deer'] },
    { id: 'outback', name: 'Outback', emoji: '🦘', ground: '#7a2b16', grid: 'rgba(255, 170, 80, 0.07)',
      rockFill: '#8c3d23', rockStroke: '#d96b43', bushFill: '#4a6b32', bushEmoji: '🌿',
      prey: ['rabbit', 'mouse', 'bird', 'kangaroo'] },
    { id: 'highlands', name: 'Ylämaat', emoji: '🏰', ground: '#2e4726', grid: 'rgba(180, 130, 220, 0.08)',
      rockFill: '#4e535c', rockStroke: '#7a828e', bushFill: '#7d3c98', bushEmoji: '🪻',
      prey: ['rabbit', 'mouse', 'bird', 'weasel', 'highland_cow', 'nessie'] }
  ];
  const WORLD_TOUR_DESTINATIONS = [
    { country: 'Suomi 🇫🇮', region: 'Lapin metsät', biomeId: 'forest' },
    { country: 'Sveitsi 🇨🇭', region: 'Lumiset Alpit', biomeId: 'snow' },
    { country: 'Egypti 🇪🇬', region: 'Saharan aavikko', biomeId: 'desert' },
    { country: 'Brasilia 🇧🇷', region: 'Amazonin sademetsä', biomeId: 'jungle' },
    { country: 'Islanti 🇮🇸', region: 'Reykjavíkin tulivuoret', biomeId: 'volcano' },
    { country: 'Louisiana 🇺🇸', region: 'Mississippi-joen suisto', biomeId: 'swamp' },
    { country: 'Kanada 🇨🇦', region: 'Rocky Mountains', biomeId: 'river' },
    { country: 'Kiina 🇨🇳', region: 'Himalajan sumuvuoret', biomeId: 'foggy_peaks' },
    { country: 'USA 🇺🇸', region: 'Uuden-Englannin ruskarunsaat', biomeId: 'autumn_woods' },
    { country: 'Japani 🇯🇵', region: 'Kioton kristalliluolat', biomeId: 'crystals' },
    { country: 'Norja 🇳🇴', region: 'Tromssan revontulilaakso', biomeId: 'aurora' },
    { country: 'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿', region: 'Ylämaat & Loch Ness', biomeId: 'highlands' }
  ];

  const ISLAND_TOUR_DESTINATIONS = [
    { country: 'Kreikka 🇬🇷', region: 'Santorini', biomeId: 'forest' },
    { country: 'Malediivit 🇲🇻', region: 'Koralliriutat', biomeId: 'river' },
    { country: 'Karibia 🇧🇸', region: 'Bahamasaaret', biomeId: 'jungle' },
    { country: 'Madagaskar 🇲🇬', region: 'Apinasaaret', biomeId: 'swamp' },
    { country: 'Pääsiäissaari 🗿', region: 'Rapa Nui', biomeId: 'foggy_peaks' },
    { country: 'Havaiji 🌋', region: 'Honolulun tulivuoret', biomeId: 'volcano' },
    { country: 'Australia 🇦🇺', region: 'Outback & Valliriutta', biomeId: 'outback' }
  ];

  function getDestinationForLevel(lv) {
    const arr = (typeof adventureMode !== 'undefined' && adventureMode === 'island') ? ISLAND_TOUR_DESTINATIONS : WORLD_TOUR_DESTINATIONS;
    const idx = (lv - 1) % arr.length;
    return arr[idx];
  }

  function biomeForLevel(lv) {
    const dest = getDestinationForLevel(lv);
    const found = BIOMES.find(b => b.id === dest.biomeId);
    return found || BIOMES[0];
  }
  let biome = BIOMES[0];

  const PASSPORT_ENTRIES = {
    'Suomi 🇫🇮': {
      title: 'Suomi 🇫🇮',
      notes: 'Matka alkoi Lapin lumoavista ruska-metsistä. Juoksin kanervikoissa ja jahtasin oravia Companionin kanssa. Ilma oli raikas ja sammal pehmeää tassujen alla.',
      collectible: 'Revontulikristalli 🌌',
      stampStyle: 'passport-stamp-design green'
    },
    'Sveitsi 🇨🇭': {
      title: 'Sveitsi 🇨🇭',
      notes: 'Nousimme lumisille Alpeille. Ilma oli hyytävän kylmä ja lumi narskui hampaissani. Paikallinen paimenkoira opetti minulle lumisilla rinteillä liukumista ja väistelin lumipalloja heittävää jättiyetiä!',
      collectible: 'Alppikello 🔔',
      stampStyle: 'passport-stamp-design'
    },
    'Egypti 🇪🇬': {
      title: 'Egypti 🇪🇬',
      notes: 'Saharan polttava hiekka meinasi kärventää tassuni, mutta Companion löysi varjoisan keitaan. Muinaiset skorpionit vartioivat hautoja, joista löysimme kimmeltäviä kultaisia skarabeita.',
      collectible: 'Kultainen skarabee 🪲',
      stampStyle: 'passport-stamp-design rect orange'
    },
    'Brasilia 🇧🇷': {
      title: 'Brasilia 🇧🇷',
      notes: 'Amazonin syvässä viidakossa satoi kaatamalla. Ilma oli trooppisen kuuma ja kostea. Vihreät leijonamakit loikkivat puissa ja löysin upean violetin viidakkokukan joen törmältä.',
      collectible: 'Amazonin orkidea 🌸',
      stampStyle: 'passport-stamp-design green'
    },
    'Islanti 🇮🇸': {
      title: 'Islanti 🇮🇸',
      notes: 'Reykjavíkin ympäristössä maa tärisi ja laava kupli purkautuvista tulivuorista. Kuumuus oli valtava, mutta löysimme kiiltävää mustaa laavalasia jäähtyneistä virtauksista.',
      collectible: 'Obsidian-lasi 🌋',
      stampStyle: 'passport-stamp-design rect red'
    },
    'Louisiana 🇺🇸': {
      title: 'Louisiana 🇺🇸',
      notes: 'Mississippi-joen sumuinen suo oli täynnä alligaattoreita ja salaperäisiä ääniä. Kahlasin mutaisessa vedessä ja löysin vanhan uponneen höyrylaivan hylystä suuren pedon hampaan.',
      collectible: 'Alligaattorinhammas 🐊',
      stampStyle: 'passport-stamp-design violet'
    },
    'Kanada 🇨🇦': {
      title: 'Kanada 🇨🇦',
      notes: 'Rocky Mountainsin kirkkaat vuoristojoet olivat täynnä hyppiviä lohia. Kalastin Companionin kanssa vedestä runsaita antimia ja leppoisat paikalliset metsästäjät antoivat minulle purkillisen aitoa vaahterasiirappia.',
      collectible: 'Vaahterasiirappi 🍁',
      stampStyle: 'passport-stamp-design rect green'
    },
    'Kiina 🇨🇳': {
      title: 'Kiina 🇨🇳',
      notes: 'Himalajan rinteillä leijui sakea ja salaperäinen usva. Bambumetsien halki kulkiessamme tunsimme muinaisten munkkien läsnäolon ja löysin kauniin vihreän jade-riipuksen vanhan pyhäkön raunioista.',
      collectible: 'Jade-riipus 📿',
      stampStyle: 'passport-stamp-design violet'
    },
    'USA 🇺🇸': {
      title: 'USA 🇺🇸',
      notes: 'Uuden-Englannin ruska oli täynnä keltaisia, punaisia ja oransseja vaahteranlehtiä. Juoksin lehtikasoissa ja söin herkullisia omenoita. Keräsin muistoksi kuivan ja kirkkaan loistavan punaisen lehden.',
      collectible: 'Punainen vaahteranlehti 🍂',
      stampStyle: 'passport-stamp-design orange'
    },
    'Japani 🇯🇵': {
      title: 'Japani 🇯🇵',
      notes: 'Kioton maanalaiset kristalliluolat loistivat kauniissa purppuran sävyissä. Kristallit murenivat ulvontani voimasta, ja luolan periltä löysin keisarillisen sakura-kuvioisen viuhkan.',
      collectible: 'Sakura-viuhka 🪭',
      stampStyle: 'passport-stamp-design rect violet'
    },
    'Norja 🇳🇴': {
      title: 'Norja 🇳🇴',
      notes: 'Tromssan lumisilla tunturihuipuilla taivas hehkui tanssivissa vihreissä ja violeteissa revontulissa. Yöilma oli viileää ja taianomaista. Juoksin revontulien valaisemilla kallioilla ja löysin muinaisen tähdenmuotoisen revontuliamuletin.',
      collectible: 'Revontuliamuletti 🌌✨',
      stampStyle: 'passport-stamp-design rect blue'
    },
    'Kreikka 🇬🇷': {
      title: 'Kreikka 🇬🇷',
      notes: 'Santorinin sinivalkoisten talojen kupeessa meri kimmelsi kauniisti. Uin rantakivikossa ja Companion kaivoi hiekasta esiin ikivanhan kreikkalaisen saviamforan palasia.',
      collectible: 'Kreikkalainen amphora 🏺',
      stampStyle: 'passport-stamp-design green'
    },
    'Malediivit 🇲🇻': {
      title: 'Malediivit 🇲🇻',
      notes: 'Koralliriutoilla uiskenteli tuhansia värikkäitä kaloja. Haiden väistely vauhditti uintiani, mutta löysin syvänteen simpukasta upean, valoa heijastavan sateenkaarihelmen.',
      collectible: 'Sateenkaarihelmi 🦪',
      stampStyle: 'passport-stamp-design rect'
    },
    'Karibia 🇧🇸': {
      title: 'Karibia 🇧🇸',
      notes: 'Bahamasaarten hiekkarannoilla kookosravut vipelsivät karkuun. Companion bongasi palmupuun juurelta vanhan hiekkaisen arkun, jonka sisällä kiilteli aito piraattien kultakolikko.',
      collectible: 'Piraattikolikko 🪙',
      stampStyle: 'passport-stamp-design orange'
    },
    'Madagaskar 🇲🇬': {
      title: 'Madagaskar 🇲🇬',
      notes: 'Apinasaarilla lemuurit ja apinat pitivät valtavaa meteliä. Yksi ilkeä apina yritti varastaa lelunikin, mutta sain sen kiinni ja löysin maasta jättimäisen baobab-puun siemenen.',
      collectible: 'Baobab-siemen 🌰',
      stampStyle: 'passport-stamp-design green'
    },
    'Pääsiäissaari 🗿': {
      title: 'Pääsiäissaari 🗿',
      notes: 'Rapa Nuin sumuisilla rannoilla valtavat moai-kivipatsaat seisoivat hiljaa tuijottaen merta. Löysin ruohikosta pienen, käsinveistetyn kivisen minipatsaan.',
      collectible: 'Mini-Moai 🗿',
      stampStyle: 'passport-stamp-design rect violet'
    },
    'Havaiji 🌋': {
      title: 'Havaiji 🌋',
      notes: 'Honolulun tulivuorisaarella pelastimme eksyneen koiranpennun jättiläishain hampaista! Paikalliset asukkaat ripustivat kaulaani tuoksuvan kukkaseppeleen kiitokseksi sankariteosta.',
      collectible: 'Kukkaseppele 🌺',
      stampStyle: 'passport-stamp-design rect red'
    },
    'Australia 🇦🇺': {
      title: 'Australia 🇦🇺',
      notes: 'Ison Valliriutan turkoosien korallivesien ja punaisen Outbackin erämaassa aurinko paistoi kirkkaasti. Juoksin kilpaa loikkivien kengurujen kanssa punaisella hiekalla. Paikalliset luonnonsuojelijat lahjoittivat minulle aidon kultaisen bumerangin.',
      collectible: 'Kultainen bumerangi 🪃',
      stampStyle: 'passport-stamp-design orange'
    },
    'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿': {
      title: 'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      notes: 'Ylämaiden sumuisten kukkuloiden, ikivanhojen linnojen ja syvien järvien maassa kanervat tuoksuivat huumaavasti. Pörröinen ylämaankarja katseli meitä lempeästi otsatukkansa alta, ja syvän Loch Nessin aalloissa näimme suuren salaperäisen hahmon! Linnan herra lahjoitti meille kultaisen säkkipillin.',
      collectible: 'Kultainen säkkipilli 🎶',
      stampStyle: 'passport-stamp-design blue'
    }
  };

  let passportCurrentIndex = 0;
  const passportList = [
    'Suomi 🇫🇮', 'Sveitsi 🇨🇭', 'Egypti 🇪🇬', 'Brasilia 🇧🇷', 'Islanti 🇮🇸',
    'Louisiana 🇺🇸', 'Kanada 🇨🇦', 'Kiina 🇨🇳', 'USA 🇺🇸', 'Japani 🇯🇵', 'Norja 🇳🇴',
    'Kreikka 🇬🇷', 'Malediivit 🇲🇻', 'Karibia 🇧🇸', 'Madagaskar 🇲🇬', 'Pääsiäissaari 🗿', 'Havaiji 🌋', 'Australia 🇦🇺', 'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿'
  ];

  function openPassport() {
    passportCurrentIndex = 0;
    updatePassportUI();
    initStickersEvents();
    const passportOverlay = document.getElementById('passport-overlay');
    if (passportOverlay) {
      passportOverlay.classList.remove('hidden');
    }
  }

  function closePassport() {
    activeSticker = null;
    const passportOverlay = document.getElementById('passport-overlay');
    if (passportOverlay) {
      passportOverlay.classList.add('hidden');
    }
    const tabBtnBook = document.getElementById('passport-tab-btn-book');
    const tabBtnPostcards = document.getElementById('passport-tab-btn-postcards');
    const tabBtnAlbum = document.getElementById('passport-tab-btn-album');
    const tabBtnMemory = document.getElementById('passport-tab-btn-memory');
    const tabBtnStats = document.getElementById('passport-tab-btn-stats');
    const tabContentBook = document.getElementById('passport-tab-content-book');
    const tabContentPostcards = document.getElementById('passport-tab-content-postcards');
    const tabContentAlbum = document.getElementById('passport-tab-content-album');
    const tabContentMemory = document.getElementById('passport-tab-content-memory');
    const tabContentStats = document.getElementById('passport-tab-content-stats');
    if (tabBtnBook && tabBtnPostcards && tabBtnAlbum && tabBtnMemory && tabBtnStats && tabContentBook && tabContentPostcards && tabContentAlbum && tabContentMemory && tabContentStats) {
      tabBtnBook.classList.add('active');
      tabBtnPostcards.classList.remove('active');
      tabBtnAlbum.classList.remove('active');
      tabBtnMemory.classList.remove('active');
      tabBtnStats.classList.remove('active');
      tabContentBook.classList.remove('hidden');
      tabContentPostcards.classList.add('hidden');
      tabContentAlbum.classList.add('hidden');
      tabContentMemory.classList.add('hidden');
      tabContentStats.classList.add('hidden');
    }
  }

  const POSTCARD_DATABASE = {
    'Suomi 🇫🇮': {
      title: 'LAPIN RUSKA',
      flag: '🇫🇮',
      artwork: '🌌🌲',
      background: 'linear-gradient(135deg, #1b5e20, #004d40)',
      letter: 'Moi perhe!\n\nLapin lumoavat metsät olivat täynnä raikasta ilmaa ja sammalta. Husky pelasti poro-vasikan ja jahtasi oravia companionin kanssa. Illalla taivas loisti upeissa revontulissa!\n\nTassuterveisin,\nCompanion & Husky 🐾'
    },
    'Sveitsi 🇨🇭': {
      title: 'ALPPIHUIPPULA',
      flag: '🇨🇭',
      artwork: '🏔️🔔',
      background: 'linear-gradient(135deg, #e53935, #b71c1c)',
      letter: 'Terveiset Alpeilta!\n\nNousimme korkeille lumihuipuille. Lumi narskui hampaissamme ja ilma oli hyytävän raikasta. Paikallinen paimenkoira opetti meitä liukumaan jyrkillä rinteillä. Sveitsiläinen juusto maistui hyvältä!\n\nYstävyydellä,\nCompanion 🏔️'
    },
    'Egypti 🇪🇬': {
      title: 'GIZAN PYRAMIDIT',
      flag: '🇪🇬',
      artwork: '🏜️🪲',
      background: 'linear-gradient(135deg, #ff9800, #ff5722)',
      letter: 'Hei kaikille!\n\nSaharan aurinko porotti kuumasti, mutta löysimme upean muinaisen keitaan. Löysimme haudan kätköistä faaraon kultaisen skarabeen! Husky meinasi polttaa tassunsa kuumassa hiekassa.\n\nTerveisin,\nCompanion 🐪'
    },
    'Brasilia 🇧🇷': {
      title: 'AMAZONIA',
      flag: '🇧🇷',
      artwork: '🌴🐒',
      background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
      letter: 'Terveisiä viidakosta!\n\nAmazonilla on satanut hurjasti! Vihreät apinat loikkivat puissa ja Husky pelasti pienen eksyneen apinanpoikanen takaisin perheensä luo. Löysimme upeita viidakkokukkia!\n\nTerveisin,\nCompanion 🐒'
    },
    'Islanti 🇮🇸': {
      title: 'TULIVUORET',
      flag: '🇮🇸',
      artwork: '🌋☄️',
      background: 'linear-gradient(135deg, #424242, #212121)',
      letter: 'Terveiset Islannista!\n\nMaa tärisee ja kuuma laava virtaa tulivuorista! Keräsimme kuuman hehkuvan laavakristallin. Paikalliset kuumat lähteet lämmittivät tassujamme hienosti seikkailun jälkeen.\n\nLämpimin terveisin,\nCompanion 🔥'
    },
    'Louisiana 🇺🇸': {
      title: 'MISSISSIPPI BAYOU',
      flag: '🇺🇸',
      artwork: '🐊🏴‍☠️',
      background: 'linear-gradient(135deg, #37474f, #263238)',
      letter: 'Moi suolta!\n\nMudassa talsiminen oli raskasta, ja saimme väistellä useita alligaattoreita sumun keskellä. Löysimme uponneen piraattiarkun ja saimme kerättyä sieltä hienon aarteen!\n\nBayou-terveisin,\nCompanion 🐊'
    },
    'Kanada 🇨🇦': {
      title: 'ROCKY MOUNTAINS',
      flag: '🇨🇦',
      artwork: '🏔️🍁',
      background: 'linear-gradient(135deg, #00796b, #004d40)',
      letter: 'Hei kotiin!\n\nKanadan kirkkaissa vuoristojoissa uiskenteli tuhansia lohia! Kalastimme Huskyn kanssa joessa ja söimme leirinuotiolla tuoretta kalaa ja makeaa vaahterasiirappia.\n\nTassuterhein,\nCompanion 🍁'
    },
    'Kiina 🇨🇳': {
      title: 'SUMUTEMPPELI',
      flag: '🇨🇳',
      artwork: '🏔️🏮',
      background: 'linear-gradient(135deg, #d32f2f, #7b1fa2)',
      letter: 'Terveisiä Himalajalta!\n\nKorkeat vuoret kylpivät sakeassa usvassa. Sytytimme suitsukkeet muinaisessa usvatemppelissä ja tunsimme historian havinaa. Rauhalliset jättiläispandat katselivat meitä sumun seasta.\n\nTerveisin,\nCompanion 🏮'
    },
    'USA 🇺🇸': {
      title: 'NEW ENGLAND',
      flag: '🇺🇸',
      artwork: '🍂⚾',
      background: 'linear-gradient(135deg, #f57c00, #d84315)',
      letter: 'Moi ruskan keskeltä!\n\nUuden-Englannin lehdet loistavat keltaisina ja punaisina. Juoksimme lehtikasoissa ja löysimme poikien kadottaman baseball-pallon lehtien seasta. Omenapiirakka täällä on todella herkkua!\n\nTerveisin,\nCompanion ⚾'
    },
    'Japani 🇯🇵': {
      title: 'KIOTON LUOLAT',
      flag: '🇯🇵',
      artwork: '🪭🗡️',
      background: 'linear-gradient(135deg, #4a148c, #1a237e)',
      letter: 'Konnichiwa Kiotosta!\n\nKristalliluolat loistivat upeissa purppuran sävyissä. Löysimme luolan syvyyksistä ikivanhan katanan ja keisarillisen viuhkan. Kirsikankukat kukkivat kauniisti luolan ulkopuolella.\n\nTerveisin,\nCompanion 🌸'
    },
    'Norja 🇳🇴': {
      title: 'TROMSSAN REVONTULET',
      flag: '🇳🇴',
      artwork: '🌌✨',
      background: 'linear-gradient(135deg, #091a3e, #00e5ff)',
      letter: 'Hei ystävät!\n\nTromssan lumisilla tuntureilla taivas leiskuu vihreissä ja violeteissa revontulissa. Kylmä tunturituuli saa turkin pöllyämään, mutta vauhti pitää meidät lämpiminä. Löysimme salaperäisen revontuliamuletin!\n\nIloisin haukuin,\nHusky & Ystävä 🐾'
    },
    'Kreikka 🇬🇷': {
      title: 'SANTORINI',
      flag: '🇬🇷',
      artwork: '🌊🌿',
      background: 'linear-gradient(135deg, #0288d1, #01579b)',
      letter: 'Terveisiä Välimereltä!\n\nSantorinin sinivalkoiset talot ja kirkas sininen vesi olivat upeita. Löysimme rannalta muinaisen oliiviseppeleen ja uimme lämpimässä merivedessä Companionin kanssa.\n\nAurinkoisin terveisin,\nCompanion 🌊'
    },
    'Malediivit 🇲🇻': {
      title: 'KORALLIRIUTAT',
      flag: '🇲🇻',
      artwork: '🐠🐢',
      background: 'linear-gradient(135deg, #00acc1, #006064)',
      letter: 'Hei paratiisista!\n\nUimme upealla koralliriutalla värikkäiden kalojen seassa. Pelastimme riuttaan juuttuneen pienen merikilpikonnan takaisin vapauteen. Vesi oli niin kirkasta, että pohjan näki upeasti!\n\nTerveisin,\nCompanion 🐢'
    },
    'Karibia 🇧🇸': {
      title: 'BAHAMASAARET',
      flag: '🇧🇸',
      artwork: '🏝️✉️',
      background: 'linear-gradient(135deg, #0097a7, #00838f)',
      letter: 'Moi aurinkorannalta!\n\nBahaman valkoinen hiekka oli todella pehmeää tassuille. Löysimme hiekkaan huuhtoutuneen salaperäisen pullopostin, jonka sisällä oli vanha aarrekartta! Ehkä seuraamme sitä huomenna.\n\nTerveisin,\nCompanion ✉️'
    },
    'Madagaskar 🇲🇬': {
      title: 'APINASAARET',
      flag: '🇲🇬',
      artwork: '🌴🥭',
      background: 'linear-gradient(135deg, #689f38, #33691e)',
      letter: 'Terveisiä Madagaskarilta!\n\nApinat ja lemuurit pitävät viidakossa kovaa meteliä! Keräsimme suuren baobab-hedelmän nuotion äärelle ja saimme väistellä alligaattoreita ja ilkeitä apinoita.\n\nLemuuriterveisin,\nCompanion 🐒'
    },
    'Pääsiäissaari 🗿': {
      title: 'RAPA NUI',
      flag: '🗿',
      artwork: '🗿🎭',
      background: 'linear-gradient(135deg, #5d4037, #3e2723)',
      letter: 'Terveiset Rapa Nuilta!\n\nValtavat kiviset Moai-patsaat seisoivat rannalla merta tuijottaen. Löysimme ruohikosta hienon vanhan heimomaskin ja saimme kuunnella tuulen huminaa ruohokukkuloilla.\n\nTerveisin,\nCompanion 🗿'
    },
    'Havaiji 🌋': {
      title: 'HONOLULU',
      flag: '🌋',
      artwork: '🌋📿',
      background: 'linear-gradient(135deg, #d84315, #bf360c)',
      letter: 'Terveisiä tulivuorisaarelta!\n\nHavaiji on upea! Noudimme kuuman laavakivi-amuletin tulivuoren rinteiltä ja saimme kaulaamme tuoksuvan kukkaseppeleet saaren asukkailta seikkailun päätteeksi.\n\nAloha-terveisin,\nCompanion 🌺'
    },
    'Australia 🇦🇺': {
      title: 'OUTBACK & RIUTTA',
      flag: '🇦🇺',
      artwork: '🪃🦘',
      background: 'linear-gradient(135deg, #bf360c, #00838f)',
      letter: 'G\'day ystävät!\n\nAustralian punainen Outback oli täynnä vauhtia! Kilpailimme loikkivien kengurujen kanssa punaisella hiekalla ja uimme Suuren Valliriutan kirkkaissa vesissä. Löysimme aidon kultaisen bumerangin!\n\nTerveisin,\nCompanion & Husky 🪃'
    },
    'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿': {
      title: 'LOCH NESS & LINNAT',
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      artwork: '🏰🦕',
      background: 'linear-gradient(135deg, #1b5e20, #004d40)',
      letter: 'Terveisiä sumuisilta Ylämailta!\n\nSkotlanti on satumainen! Juoksimme nummilla pörröisten lehmäkavereiden kanssa ja vierailimme vanhoissa linnanraunioissa. Loch Nessillä näimme Nessien iloiset aallot ja saimme kultaisen säkkipillin!\n\nTerveisin,\nCompanion & Husky 🦕'
    }
  };

  function renderPostcardsGrid() {
    const gridEl = document.getElementById('postcard-grid');
    if (!gridEl) return;
    
    const unlocked = shopData.unlockedPostcards || {};
    const stampData = shopData.unlockedStamps || {};

    gridEl.innerHTML = passportList.map(countryName => {
      const db = POSTCARD_DATABASE[countryName];
      const isUnlocked = !!unlocked[countryName];
      const stamp = stampData[countryName];
      const starsCount = stamp ? (stamp.stars || 1) : 0;
      const starString = '★'.repeat(starsCount) + '☆'.repeat(3 - starsCount);

      if (isUnlocked && db) {
        return `
          <div class="postcard-thumb" onclick="openPostcardViewer('${countryName}')" style="background: ${db.background}; border-color: #ffffff; color: #ffffff;">
            <div class="postcard-thumb-artwork" style="color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${db.artwork}</div>
            <div class="postcard-thumb-title" style="color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${db.title}</div>
            <div class="postcard-thumb-stars" style="color: #ffeb3b; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${starString}</div>
          </div>
        `;
      } else {
        return `
          <div class="postcard-thumb locked">
            <div class="postcard-thumb-artwork">🔒</div>
            <div class="postcard-thumb-title">${countryName.split(' ')[0]}</div>
            <div class="postcard-thumb-stars">${starString || '☆☆☆'}</div>
          </div>
        `;
      }
    }).join('');
  }

  function openPostcardViewer(countryName) {
    const db = POSTCARD_DATABASE[countryName];
    if (!db) return;

    const modal = document.getElementById('postcard-viewer-modal');
    const frontEl = document.getElementById('postcard-view-front');
    const titleEl = document.getElementById('postcard-view-title');
    const flagEl = document.getElementById('postcard-view-flag');
    const artworkEl = document.getElementById('postcard-view-artwork');
    const letterEl = document.getElementById('postcard-view-letter');
    const addrCountryEl = document.getElementById('postcard-view-addr-country');

    if (!modal || !frontEl || !titleEl || !flagEl || !artworkEl || !letterEl || !addrCountryEl) return;

    frontEl.style.background = db.background;
    titleEl.textContent = db.title;
    flagEl.textContent = db.flag;
    artworkEl.textContent = db.artwork;
    letterEl.textContent = db.letter;
    addrCountryEl.textContent = countryName.toUpperCase();

    const card3D = modal.querySelector('.postcard-card-3d');
    if (card3D) card3D.classList.remove('flipped');

    modal.classList.remove('hidden');
    Audio.play('map');
  }

  function closePostcardViewer() {
    const modal = document.getElementById('postcard-viewer-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  function drawPolaroidCanvas(canvas, countryName) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const db = POSTCARD_DATABASE[countryName] || {
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      flag: '🌍',
      artwork: '🌲'
    };

    let grad = ctx.createLinearGradient(0, 0, 0, h);
    if (countryName.includes('Suomi')) {
      grad.addColorStop(0, '#00112c'); grad.addColorStop(1, '#004d40');
    } else if (countryName.includes('Sveitsi')) {
      grad.addColorStop(0, '#81d4fa'); grad.addColorStop(1, '#ffffff');
    } else if (countryName.includes('Egypti')) {
      grad.addColorStop(0, '#ffcc80'); grad.addColorStop(1, '#e65100');
    } else if (countryName.includes('Brasilia')) {
      grad.addColorStop(0, '#80deea'); grad.addColorStop(1, '#1b5e20');
    } else if (countryName.includes('Islanti')) {
      grad.addColorStop(0, '#37474f'); grad.addColorStop(1, '#212121');
    } else if (countryName.includes('Louisiana')) {
      grad.addColorStop(0, '#263238'); grad.addColorStop(1, '#0d47a1');
    } else if (countryName.includes('Kanada')) {
      grad.addColorStop(0, '#b2dfdb'); grad.addColorStop(1, '#004d40');
    } else if (countryName.includes('Kiina')) {
      grad.addColorStop(0, '#b39ddb'); grad.addColorStop(1, '#4a148c');
    } else if (countryName.includes('USA')) {
      grad.addColorStop(0, '#ffe082'); grad.addColorStop(1, '#d84315');
    } else if (countryName.includes('Japani')) {
      grad.addColorStop(0, '#f8bbd0'); grad.addColorStop(1, '#880e4f');
    } else if (countryName.includes('Kreikka')) {
      grad.addColorStop(0, '#e0f7fa'); grad.addColorStop(1, '#01579b');
    } else if (countryName.includes('Malediivit') || countryName.includes('Karibia')) {
      grad.addColorStop(0, '#e0f7fa'); grad.addColorStop(1, '#006064');
    } else if (countryName.includes('Madagaskar')) {
      grad.addColorStop(0, '#c8e6c9'); grad.addColorStop(1, '#33691e');
    } else if (countryName.includes('Pääsiäissaari')) {
      grad.addColorStop(0, '#cfd8dc'); grad.addColorStop(1, '#37474f');
    } else if (countryName.includes('Havaiji')) {
      grad.addColorStop(0, '#ffcc80'); grad.addColorStop(1, '#bf360c');
    } else {
      grad.addColorStop(0, '#1e3c72'); grad.addColorStop(1, '#2a5298');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    if (countryName.includes('Egypti')) {
      ctx.fillStyle = '#ffb300';
      ctx.beginPath(); ctx.moveTo(w*0.1, h*0.75); ctx.lineTo(w*0.35, h*0.3); ctx.lineTo(w*0.6, h*0.75); ctx.fill();
      ctx.fillStyle = '#ffa000';
      ctx.beginPath(); ctx.moveTo(w*0.4, h*0.75); ctx.lineTo(w*0.65, h*0.38); ctx.lineTo(w*0.9, h*0.75); ctx.fill();
      ctx.fillStyle = '#fff59d';
      ctx.beginPath(); ctx.arc(w*0.75, h*0.2, w*0.08, 0, Math.PI*2); ctx.fill();
    } else if (countryName.includes('Suomi')) {
      ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
      ctx.lineWidth = 15;
      ctx.beginPath(); ctx.arc(w*0.5, h*0.5, w*0.4, Math.PI, Math.PI*1.8); ctx.stroke();
      ctx.strokeStyle = 'rgba(139, 195, 74, 0.3)';
      ctx.beginPath(); ctx.arc(w*0.4, h*0.6, w*0.45, Math.PI, Math.PI*1.8); ctx.stroke();
      ctx.fillStyle = '#0f2c16';
      ctx.fillRect(0, h*0.65, w, h*0.35);
      ctx.fillStyle = '#1b5e20';
      for (let xPos of [w*0.1, w*0.8, w*0.9]) {
        ctx.beginPath(); ctx.moveTo(xPos, h*0.7); ctx.lineTo(xPos - 12, h*0.85); ctx.lineTo(xPos + 12, h*0.85); ctx.fill();
        ctx.beginPath(); ctx.moveTo(xPos, h*0.75); ctx.lineTo(xPos - 16, h*0.9); ctx.lineTo(xPos + 16, h*0.9); ctx.fill();
      }
    } else if (countryName.includes('Sveitsi') || countryName.includes('Kanada')) {
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath(); ctx.moveTo(w*0.2, h*0.85); ctx.lineTo(w*0.45, h*0.25); ctx.lineTo(w*0.7, h*0.85); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.5, h*0.85); ctx.lineTo(w*0.75, h*0.3); ctx.lineTo(w*0.95, h*0.85); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(w*0.4, h*0.37); ctx.lineTo(w*0.45, h*0.25); ctx.lineTo(w*0.5, h*0.37); ctx.lineTo(w*0.45, h*0.4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.7, h*0.41); ctx.lineTo(w*0.75, h*0.3); ctx.lineTo(w*0.8, h*0.41); ctx.lineTo(w*0.75, h*0.43); ctx.fill();
    } else if (countryName.includes('Japani')) {
      ctx.fillStyle = '#546e7a';
      ctx.beginPath(); ctx.moveTo(w*0.1, h*0.85); ctx.lineTo(w*0.5, h*0.22); ctx.lineTo(w*0.9, h*0.85); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(w*0.4, h*0.38); ctx.lineTo(w*0.5, h*0.22); ctx.lineTo(w*0.6, h*0.38); ctx.lineTo(w*0.5, h*0.44); ctx.fill();
      ctx.fillStyle = '#ff80ab';
      for (let i=0; i<8; i++) {
        ctx.beginPath(); ctx.arc(w*(0.1 + i*0.12), h*(0.1 + Math.sin(i)*0.05), w*0.02, 0, Math.PI*2); ctx.fill();
      }
    } else if (countryName.includes('Islanti') || countryName.includes('Havaiji')) {
      ctx.fillStyle = '#37474f';
      ctx.beginPath(); ctx.moveTo(w*0.15, h*0.85); ctx.lineTo(w*0.5, h*0.35); ctx.lineTo(w*0.85, h*0.85); ctx.fill();
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath(); ctx.ellipse(w*0.5, h*0.36, w*0.06, w*0.02, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#ff9100'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(w*0.5, h*0.37); ctx.lineTo(w*0.46, h*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.51, h*0.37); ctx.lineTo(w*0.55, h*0.55); ctx.stroke();
    } else if (countryName.includes('Kreikka')) {
      ctx.fillStyle = '#eeeeee';
      ctx.fillRect(w*0.1, h*0.45, w*0.25, h*0.4);
      ctx.fillRect(w*0.3, h*0.55, w*0.22, h*0.3);
      ctx.fillStyle = '#1565c0';
      ctx.beginPath(); ctx.arc(w*0.225, h*0.45, w*0.125, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.arc(w*0.41, h*0.55, w*0.11, Math.PI, 0); ctx.fill();
    } else if (countryName.includes('Malediivit') || countryName.includes('Karibia') || countryName.includes('Brasilia')) {
      ctx.fillStyle = '#00acc1';
      ctx.fillRect(0, h*0.5, w, h*0.5);
      ctx.fillStyle = '#ffe082';
      ctx.beginPath(); ctx.ellipse(w*0.5, h*0.9, w*0.6, h*0.2, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(w*0.85, h*0.8); ctx.quadraticCurveTo(w*0.8, h*0.5, w*0.75, h*0.35); ctx.stroke();
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath(); ctx.ellipse(w*0.7, h*0.33, w*0.06, w*0.02, Math.PI/6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(w*0.8, h*0.33, w*0.06, w*0.02, -Math.PI/6, 0, Math.PI*2); ctx.fill();
    } else if (countryName.includes('Pääsiäissaari')) {
      ctx.fillStyle = '#263238';
      ctx.fillRect(w*0.7, h*0.35, w*0.12, h*0.5);
      ctx.beginPath();
      ctx.moveTo(w*0.7, h*0.35);
      ctx.lineTo(w*0.64, h*0.35);
      ctx.lineTo(w*0.64, h*0.42);
      ctx.lineTo(w*0.59, h*0.49);
      ctx.lineTo(w*0.65, h*0.52);
      ctx.lineTo(w*0.62, h*0.58);
      ctx.lineTo(w*0.7, h*0.62);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath(); ctx.moveTo(w*0.1, h*0.8); ctx.lineTo(w*0.5, h*0.35); ctx.lineTo(w*0.9, h*0.8); ctx.fill();
      ctx.fillStyle = '#78909c';
      ctx.beginPath(); ctx.moveTo(w*0.4, h*0.8); ctx.lineTo(w*0.7, h*0.42); ctx.lineTo(w*0.95, h*0.8); ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = countryName.includes('Sveitsi') || countryName.includes('Suomi') && !countryName.includes('Lapin') ? '#ffffff' : 'rgba(0,0,0,0.1)';
    if (countryName.includes('Sveitsi')) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, h*0.75, w, h*0.25);
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, h*0.8, w, h*0.2);
    }

    const xHusky = w * 0.35;
    const yHusky = h * 0.78;
    const xComp = w * 0.65;
    const yComp = h * 0.78;

    const dummyHusky = {
      kind: 'husky',
      x: xHusky,
      y: yHusky,
      radius: w * 0.055,
      flip: 1,
      moving: false,
      animPhase: 0,
      skin: shopData.equippedSkin || 'default',
      hat: shopData.equippedHat || 'none'
    };

    const dummyCompanion = {
      kind: 'husky',
      x: xComp,
      y: yComp,
      radius: w * 0.045,
      flip: -1,
      moving: false,
      animPhase: 0,
      skin: 'chocolate',
      hat: 'none'
    };

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath(); ctx.ellipse(xHusky, yHusky + 2, dummyHusky.radius * 1.2, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(xComp, yComp + 2, dummyCompanion.radius * 1.2, 4, 0, 0, Math.PI*2); ctx.fill();

    if (typeof Sprites !== 'undefined' && Sprites.draw) {
      Sprites.draw(ctx, dummyHusky);
      Sprites.draw(ctx, dummyCompanion);
    } else {
      ctx.font = `${w*0.12}px sans-serif`;
      ctx.fillText('🐕', xHusky - 15, yHusky + 10);
      ctx.fillText('🐶', xComp - 15, yComp + 10);
    }

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(w*0.88, h*0.18, w*0.08, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.font = `${w*0.08}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(db.flag || '🌍', w*0.88, h*0.19);
  }

  function takeVictoryPhoto() {
    if (!lastClearedDestination) return;
    const dest = lastClearedDestination;
    const countryName = dest.country;

    const overlay = document.getElementById('polaroid-camera-overlay');
    const modal = document.getElementById('polaroid-modal');
    const canvas = document.getElementById('polaroid-canvas');
    const caption = document.getElementById('polaroid-caption-text');
    const saveBtn = document.getElementById('polaroid-save-btn');
    const closeBtn = document.getElementById('polaroid-close-btn');
    const frame = modal ? modal.querySelector('.polaroid-frame') : null;

    if (!overlay || !modal || !canvas || !caption || !saveBtn || !closeBtn || !frame) return;

    Audio.play('eat'); 

    overlay.classList.remove('hidden');
    overlay.classList.add('flash');
    setTimeout(() => {
      overlay.classList.remove('flash');
      overlay.classList.add('hidden');
    }, 750);

    drawPolaroidCanvas(canvas, countryName);

    const dateStr = new Date().toLocaleDateString('fi-FI');
    caption.textContent = `${countryName} — ${dateStr}`;

    saveBtn.style.display = 'none';
    closeBtn.style.display = 'none';

    frame.classList.remove('animating');
    void frame.offsetWidth; 
    frame.classList.add('animating');

    modal.classList.remove('hidden');

    const hint = modal.querySelector('.polaroid-hint');
    if (hint) hint.textContent = 'Kuvasi kehittyy... 📸';

    setTimeout(() => {
      saveBtn.style.display = 'inline-block';
      closeBtn.style.display = 'inline-block';
      if (hint) hint.textContent = 'Valmis! 📸';
      Audio.play('catch');
    }, 3200);
  }

  function renderAlbumGrid() {
    const gridEl = document.getElementById('album-grid');
    if (!gridEl) return;

    const unlocked = shopData.unlockedPhotos || {};

    gridEl.innerHTML = passportList.map((countryName, idx) => {
      const dateStr = unlocked[countryName];
      if (dateStr) {
        const rot = (idx % 2 === 0 ? -2.5 : 2.5) + (Math.random() - 0.5) * 1.5;
        const customCap = shopData.photoCaptions && shopData.photoCaptions[countryName];
        const displayTitle = customCap ? (customCap.length > 14 ? customCap.slice(0, 12) + '..' : customCap) : countryName.split(' ')[0];
        return `
          <div class="album-photo-slot" onclick="openAlbumPhotoViewer('${countryName}')" style="--rot: ${rot}deg;">
            <canvas id="album-thumb-${idx}" width="120" height="96" style="background:#263238; border:1.5px solid #e0e0e0; border-radius:1px;"></canvas>
            <div class="album-photo-slot-title">${displayTitle}</div>
          </div>
        `;
      } else {
        return `
          <div class="album-photo-slot locked">
            <div class="album-photo-slot-img-placeholder">📷</div>
            <div style="font-size: 8px; color:rgba(93,64,55,0.4); margin-top:4px;">Locked</div>
          </div>
        `;
      }
    }).join('');

    passportList.forEach((countryName, idx) => {
      if (unlocked[countryName]) {
        const thumbCanvas = document.getElementById(`album-thumb-${idx}`);
        if (thumbCanvas) {
          drawPolaroidCanvas(thumbCanvas, countryName);
        }
      }
    });
  }

  function openAlbumPhotoViewer(countryName) {
    const unlocked = shopData.unlockedPhotos || {};
    const dateStr = unlocked[countryName] || new Date().toLocaleDateString('fi-FI');

    const modal = document.getElementById('album-viewer-modal');
    const canvas = document.getElementById('album-viewer-canvas');
    const caption = document.getElementById('album-viewer-caption-text');
    const editContainer = document.getElementById('album-viewer-caption-edit-container');

    if (!modal || !canvas || !caption) return;

    activeViewingCountry = countryName;

    drawPolaroidCanvas(canvas, countryName);
    
    const saved = shopData.photoCaptions && shopData.photoCaptions[countryName];
    caption.textContent = saved || `${countryName} — ${dateStr}`;

    caption.classList.remove('hidden');
    if (editContainer) editContainer.classList.add('hidden');

    modal.classList.remove('hidden');
    Audio.play('map');
  }

  // --- MUISTIPELI LOGIIKKA ---
  let memoryCardsData = [];
  let firstSelectedCard = null;
  let secondSelectedCard = null;
  let memoryMoves = 0;
  let memoryMatches = 0;
  let memoryLocked = false;

  function initMemoryGame() {
    const gridEl = document.getElementById('memory-grid');
    const movesEl = document.getElementById('memory-moves-val');
    const pairsEl = document.getElementById('memory-pairs-val');
    if (!gridEl || !movesEl || !pairsEl) return;

    firstSelectedCard = null;
    secondSelectedCard = null;
    memoryMoves = 0;
    memoryMatches = 0;
    memoryLocked = false;
    movesEl.textContent = '0';
    pairsEl.textContent = '0';

    const shuffledList = [...passportList].sort(() => Math.random() - 0.5);
    const chosenCountries = shuffledList.slice(0, 8);

    const cards = [];
    chosenCountries.forEach(country => {
      const db = POSTCARD_DATABASE[country] || { flag: '🌍' };
      cards.push({ country, flag: db.flag, name: country.split(' ')[0] });
      cards.push({ country, flag: db.flag, name: country.split(' ')[0] });
    });

    memoryCardsData = cards.sort(() => Math.random() - 0.5);

    gridEl.innerHTML = memoryCardsData.map((c, idx) => {
      return `
        <div class="memory-card" data-idx="${idx}" onclick="flipMemoryCard(this)">
          <div class="memory-card-front">🧭</div>
          <div class="memory-card-back">
            <div class="memory-card-flag">${c.flag}</div>
            <div class="memory-card-name">${c.name}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function flipMemoryCard(cardEl) {
    if (memoryLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    Audio.play('click');
    cardEl.classList.add('flipped');

    const idx = parseInt(cardEl.dataset.idx);
    const cardData = memoryCardsData[idx];

    if (!firstSelectedCard) {
      firstSelectedCard = { el: cardEl, data: cardData };
    } else {
      secondSelectedCard = { el: cardEl, data: cardData };
      checkMemoryMatch();
    }
  }

  function checkMemoryMatch() {
    memoryLocked = true;
    const movesEl = document.getElementById('memory-moves-val');
    const pairsEl = document.getElementById('memory-pairs-val');

    memoryMoves++;
    if (movesEl) movesEl.textContent = memoryMoves;

    const isMatch = firstSelectedCard.data.country === secondSelectedCard.data.country;

    if (isMatch) {
      setTimeout(() => {
        firstSelectedCard.el.classList.add('matched');
        secondSelectedCard.el.classList.add('matched');
        Audio.play('catch');

        memoryMatches++;
        if (pairsEl) pairsEl.textContent = memoryMatches;

        firstSelectedCard = null;
        secondSelectedCard = null;
        memoryLocked = false;

        if (memoryMatches === 8) {
          triggerMemoryVictory();
        }
      }, 300);
    } else {
      setTimeout(() => {
        firstSelectedCard.el.classList.remove('flipped');
        secondSelectedCard.el.classList.remove('flipped');

        firstSelectedCard = null;
        secondSelectedCard = null;
        memoryLocked = false;
      }, 1000);
    }
  }

  function triggerMemoryVictory() {
    shopData.totalGems += 5;
    shopData.stats.memoryWon = (shopData.stats.memoryWon || 0) + 1;
    saveShopData();

    setTimeout(() => {
      showBanner('🏆 MUISTIPELI LÄPÄISTY! +5 💎');
      Audio.play('legendary');
      
      if (typeof husky !== 'undefined') {
        spawnBurst(husky.x || 200, husky.y || 200, ['#4caf50', '#81c784', '#a5d6a7', '#fff'], 25);
      }
    }, 500);
  }

  function updatePassportUI() {
    const titleEl = document.getElementById('passport-page-title');
    const stampSlotEl = document.getElementById('passport-active-stamp');
    const diaryEl = document.getElementById('passport-diary-text');
    const collEmojiEl = document.getElementById('passport-collectible-emoji');
    const collNameEl = document.getElementById('passport-collectible-name');
    const pageNumEl = document.getElementById('passport-page-number');
    const stampsCountEl = document.getElementById('passport-stamps-count');
    const questDescEl = document.getElementById('passport-quest-desc');
    const questStateEl = document.getElementById('passport-quest-state');

    if (!titleEl || !stampSlotEl || !diaryEl || !collEmojiEl || !collNameEl || !pageNumEl || !stampsCountEl) return;

    const unlocked = shopData.unlockedStamps || {};
    const unlockedCount = Object.keys(unlocked).length;
    stampsCountEl.textContent = unlockedCount;

    const countryName = passportList[passportCurrentIndex];
    const entry = PASSPORT_ENTRIES[countryName];
    if (!entry) return;

    titleEl.textContent = entry.title;
    pageNumEl.textContent = `Sivu ${passportCurrentIndex + 1} / ${passportList.length}`;

    const stampInfo = unlocked[countryName];
    if (stampInfo) {
      const isRect = entry.stampStyle.includes('rect');
      stampSlotEl.className = entry.stampStyle;
      stampSlotEl.innerHTML = `
        <div style="font-size: 8px; margin-bottom: 2px;">PASSPORT DEPT</div>
        <div style="font-size: ${isRect ? '11px' : '9px'}; font-weight: bold; letter-spacing: 0.5px;">APPROVED</div>
        <div style="font-size: 8px; margin-top: 2px;">${stampInfo.date}</div>
      `;
      stampSlotEl.style.display = 'flex';
      diaryEl.textContent = entry.notes;
      const collParts = entry.collectible.split(' ');
      collEmojiEl.textContent = collParts[0];
      collNameEl.textContent = collParts.slice(1).join(' ');
    } else {
      stampSlotEl.className = '';
      stampSlotEl.innerHTML = `
        <div style="border: 2px dashed rgba(93,64,55,0.2); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(93,64,55,0.3); font-size: 24px; font-weight: bold;">?</div>
      `;
      diaryEl.innerHTML = `<em>Tämä sivu on vielä tyhjä. Läpäise ${countryName} -taso Matkapelissä avataksesi leiman ja matkakertomuksen!</em>`;
      collEmojiEl.textContent = '🔒';
      collNameEl.textContent = 'Lukittu';
    }

    const questDb = {
      'Suomi 🇫🇮': 'Pelasta eksynyt poro-vasikka Lapin metsästä',
      'Sveitsi 🇨🇭': 'Löydä kadonnut alppitorvi Alppien rinteiltä',
      'Egypti 🇪🇬': 'Kerää faaraon kultainen skarabee aavikolta',
      'Brasilia 🇧🇷': 'Pelasta sademetsään eksynyt apinanpoikanen',
      'Islanti 🇮🇸': 'Nouda kuuma laavakristalli tulivuoren kupeesta',
      'Louisiana 🇺🇸': 'Etsi ja avaa suolle hukkunut vanha arkku',
      'Kanada 🇨🇦': 'Löydä vuoristosta loistava kultainen vaahteranlehti',
      'Kiina 🇨🇳': 'Sytytä suitsuke vuoriston pyhässä temppelissä',
      'USA 🇺🇸': 'Etsi syksyisten lehtien seasta kadonnut pallo',
      'Japani 🇯🇵': 'Löydä kristalliluolasta vanha arvokas katana',
      'Kreikka 🇬🇷': 'Kerää muinainen oliivioksan seppele rannalta',
      'Malediivit 🇲🇻': 'Vapauta koralliriutalle juuttunut merikilpikonna',
      'Karibia 🇧🇸': 'Löydä hiekkarannalle ajautunut salaperäinen pulloposti',
      'Madagaskar 🇲🇬': 'Kerää jättimäinen baobab-puun hedelmä sademetsästä',
      'Pääsiäissaari 🗿': 'Etsi patsaiden juurelta kadonnut heimomaski',
      'Havaiji 🌋': 'Nouda pyhä tulivuoren laavakivi-amuletti'
    };

    if (questDescEl && questStateEl) {
      questDescEl.textContent = questDb[countryName] || 'Haastetta ei ole saatavilla tälle alueelle.';
      const completed = shopData.completedQuests && shopData.completedQuests[countryName];
      if (completed) {
        questStateEl.textContent = 'SUORITETTU! 🏆 (+10 💎)';
        questStateEl.className = 'completed';
      } else {
        questStateEl.textContent = 'KESKEN ❌';
        questStateEl.className = 'pending';
      }
    }

    renderStickerDrawer();
    renderPastedStickers();
    updateStickerHint();
  }

  let lastClearedDestination = null;

  function unlockStampForDestination(dest) {
    if (!dest) return;
    lastClearedDestination = dest;
    const photoBtn = document.getElementById('victory-photo-btn');
    if (photoBtn) {
      photoBtn.classList.remove('hidden');
    }
    if (!shopData.unlockedStamps) shopData.unlockedStamps = {};
    if (!shopData.unlockedPostcards) shopData.unlockedPostcards = {};
    if (!shopData.completedQuests) shopData.completedQuests = {};

    const questDone = !!shopData.completedQuests[dest.country];
    const damageTaken = maxLives - lives;
    let stars = 1;
    if (questDone && damageTaken <= 1) {
      stars = 3;
    } else if (questDone || damageTaken === 0) {
      stars = 2;
    }

    if (!shopData.unlockedStamps[dest.country]) {
      shopData.unlockedStamps[dest.country] = {
        date: new Date().toLocaleDateString('fi-FI'),
        score: score,
        gems: gemsFound,
        stars: stars
      };
      
      if (stars === 3) {
        shopData.unlockedPostcards[dest.country] = true;
        setTimeout(() => {
          showBanner(`✉️ AVASIT POSTIKORTIN: ${dest.country}!`);
          spawnBurst(husky.x, husky.y, ['#ffeb3b', '#fff', '#e57373'], 25);
          Audio.play('legendary');
        }, 1300);
      }
      
      saveShopData();
      Audio.play('legendary');
    } else {
      const prev = shopData.unlockedStamps[dest.country];
      if (!prev.stars || stars > prev.stars) {
        prev.stars = stars;
        if (stars === 3) {
          shopData.unlockedPostcards[dest.country] = true;
          setTimeout(() => {
            showBanner(`✉️ AVASIT POSTIKORTIN: ${dest.country}!`);
            spawnBurst(husky.x, husky.y, ['#ffeb3b', '#fff', '#e57373'], 25);
            Audio.play('legendary');
          }, 1300);
        }
        saveShopData();
      }
    }
  }

  function getSeasonForLevel(lv) {
    const b = biomeForLevel(lv);
    if (b.id === 'desert' || b.id === 'volcano' || b.id === 'jungle') {
      return 'summer'; // Kuumat/trooppiset biomit ovat aina kesäisiä, ei talvea/liukastelua
    }
    if (b.id === 'crystals') {
      return 'spring'; // Kristalliluola on viileä mutta neutraali
    }
    if (b.id === 'snow') {
      return 'winter';
    }
    if (b.id === 'autumn_woods') {
      return 'autumn';
    }
    const index = Math.floor((lv - 1) / 2) % 4;
    return ['spring', 'summer', 'autumn', 'winter'][index];
  }
  function seasonName(s) {
    return { spring: 'Kevät 🌱', summer: 'Kesä ☀️', autumn: 'Syksy 🍂', winter: 'Talvi ❄️' }[s] || s;
  }

  // --- Vuorokausi & sää ---
  let timeOfDay = 0.3;            // 0=keskiyö, 0.25=aamu, 0.5=keskipäivä, 0.75=ilta
  const DAY_LENGTH = 110;         // sekuntia / täysi vuorokausi
  let weather = 'clear';          // 'clear' | 'rain' | 'snow' | 'fog'
  let weatherParticles = [];

  function envLight() { return Math.max(0, Math.sin(timeOfDay * Math.PI)); } // 0 yö .. 1 päivä

  // Ympäristön näkyvyyskerroin petojen näölle (yö + sää heikentää)
  function envDetectMul() {
    let m = 1 - (1 - envLight()) * 0.4; // yöllä jopa -40 %
    if (weather === 'rain') m *= 0.85;
    else if (weather === 'fog') m *= (biome.id === 'foggy_peaks' ? 0.35 : 0.7);
    else if (weather === 'snow') m *= 0.92;
    else if (weather === 'blizzard') m *= 0.55; // Lumimyrsky heikentää näköä rajusti
    else if (weather === 'sandstorm') m *= 0.62; // Hiekkamyrsky hämärtää
    return m;
  }

  function isNightTime() {
    return timeOfDay > 0.76 || timeOfDay < 0.22;
  }

  function pickWeather(biomeId) {
    const r = Math.random();
    if (biomeId === 'desert') return r < 0.55 ? 'clear' : r < 0.82 ? 'sandstorm' : r < 0.94 ? 'fog' : 'rain';
    if (biomeId === 'snow') return r < 0.35 ? 'snow' : r < 0.62 ? 'blizzard' : r < 0.82 ? 'clear' : r < 0.94 ? 'fog' : 'rain';
    if (biomeId === 'swamp') return r < 0.4 ? 'fog' : r < 0.7 ? 'rain' : r < 0.9 ? 'clear' : 'snow';
    if (biomeId === 'volcano') return r < 0.65 ? 'ash' : r < 0.9 ? 'clear' : 'fog';
    if (biomeId === 'jungle') return r < 0.58 ? 'rain' : r < 0.85 ? 'clear' : 'fog';
    if (biomeId === 'foggy_peaks') return r < 0.82 ? 'fog' : 'rain';
    return r < 0.5 ? 'clear' : r < 0.75 ? 'rain' : r < 0.9 ? 'fog' : 'snow';
  }

  function initWeatherParticles() {
    weatherParticles = [];
    icicles = [];
    icicleTimer = 0;
    sandstormPush = { x: 0, y: 0 };
    sandstormTimer = 0;
    weatherHazardBannerCd = 0;
    if (weather === 'rain') {
      for (let i = 0; i < 150; i++) weatherParticles.push({
        x: Math.random() * viewport.width, y: Math.random() * viewport.height,
        len: 9 + Math.random() * 12, sp: 650 + Math.random() * 350 });
    } else if (weather === 'snow') {
      for (let i = 0; i < 90; i++) weatherParticles.push({
        x: Math.random() * viewport.width, y: Math.random() * viewport.height,
        r: 1.5 + Math.random() * 2.5, sp: 40 + Math.random() * 45, drift: Math.random() * Math.PI * 2 });
    } else if (weather === 'blizzard') {
      // Lumimyrsky: tiheä lumi + vahva tuuli
      for (let i = 0; i < 200; i++) weatherParticles.push({
        x: Math.random() * viewport.width, y: Math.random() * viewport.height,
        r: 1.0 + Math.random() * 3.5, sp: 130 + Math.random() * 200,
        drift: Math.random() * Math.PI * 2, windX: 260 + Math.random() * 100 });
    } else if (weather === 'ash') {
      for (let i = 0; i < 80; i++) weatherParticles.push({
        x: Math.random() * viewport.width, y: Math.random() * viewport.height,
        r: 1.0 + Math.random() * 2.2, sp: 30 + Math.random() * 35, drift: Math.random() * Math.PI * 2 });
    } else if (weather === 'sandstorm') {
      // Hiekkamyrsky: vaakahiukkaset, nopeita
      for (let i = 0; i < 180; i++) weatherParticles.push({
        x: Math.random() * viewport.width, y: Math.random() * viewport.height,
        r: 1.5 + Math.random() * 3, sp: 320 + Math.random() * 280,
        drift: Math.random() * Math.PI * 2, alpha: 0.3 + Math.random() * 0.5 });
      // Hiekkamyrskyn alkusuunta
      const ang = Math.random() * Math.PI * 2;
      sandstormPush.x = Math.cos(ang);
      sandstormPush.y = Math.sin(ang);
    } else if (weather === 'clear') {
      if (currentSeason === 'spring') {
        for (let i = 0; i < 40; i++) weatherParticles.push({
          x: Math.random() * viewport.width, y: Math.random() * viewport.height,
          type: 'spring',
          r: 2.5 + Math.random() * 2.5,
          sp: 30 + Math.random() * 30,
          drift: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: 0.5 + Math.random() * 1.5
        });
      } else if (currentSeason === 'summer') {
        for (let i = 0; i < 30; i++) weatherParticles.push({
          x: Math.random() * viewport.width, y: Math.random() * viewport.height,
          type: 'summer',
          r: 1.5 + Math.random() * 1.5,
          sp: 15 + Math.random() * 20,
          drift: Math.random() * Math.PI * 2,
          pulseSpeed: 1 + Math.random() * 2
        });
      } else if (currentSeason === 'autumn') {
        for (let i = 0; i < 40; i++) weatherParticles.push({
          x: Math.random() * viewport.width, y: Math.random() * viewport.height,
          type: 'autumn',
          w: 8 + Math.random() * 8,
          h: 5 + Math.random() * 5,
          sp: 25 + Math.random() * 30,
          drift: Math.random() * Math.PI * 2,
          color: ['#e65100', '#ff8f00', '#f57c00', '#d84315', '#8d6e63'][Math.floor(Math.random() * 5)],
          rot: Math.random() * Math.PI * 2,
          rotSpeed: 0.8 + Math.random() * 1.2
        });
      } else if (currentSeason === 'winter') {
        for (let i = 0; i < 30; i++) weatherParticles.push({
          x: Math.random() * viewport.width, y: Math.random() * viewport.height,
          type: 'winter',
          r: 1.2 + Math.random() * 1.8,
          sp: 25 + Math.random() * 25,
          drift: Math.random() * Math.PI * 2
        });
      }
    }
  }

  function weatherEmoji() {
    if (weather === 'rain') return '🌧️';
    if (weather === 'snow') return '🌨️';
    if (weather === 'fog') return '🌫️';
    if (weather === 'ash') return '🌋';
    if (weather === 'blizzard') return '🌪️';
    if (weather === 'sandstorm') return '🏜️🌪️';
    return '☀️';
  }

  let husky, prey, predators, obstacles, companion = null;
  let lostPuppy = null;        // Eksynyt huskypentu (pelastustehtävä)
  let tookDamageThisLevel = false; // Seurataan tasokohtaista vahinkoa saavutuksia varten
  let projectiles = []; // Kaikki ammutut projektilit (tulipallot, lumipallot, pistimet)
  let volcanoTimer = 0;        // Ajastin magmakivien luonnille
  let fireplaceHealTimer = 0;  // Mökin tulisijan parannusajastin
  let interiorExitCooldown = 0; // Estää heti ulos tulemisen sisään mentäessä
  let bodyTemp = 50;           // Huskyn ruumiinlämpö (0-100)
  let freezeDmgTimer = 0;      // Ajastin jäätymisvahingolle
  let currentSeason = 'spring'; // Nykyinen vuodenaika
  let icicles = [];             // Jääpuikot (Lumiaapa, blizzard)
  let icicleTimer = 0;          // Ajastin jääpuikolle
  let sandstormPush = { x: 0, y: 0 }; // Hiekkamyrskyn tuulen suunta (normalisoitu)
  let sandstormTimer = 0;       // Hiekkamyrskyn tuulisuunnanvaihtaja
  let weatherHazardBannerCd = 0; // Jottei varoitusbanneri spämmää
  // --- Combo-järjestelmä ---
  let comboCount = 0;           // Peräkkäiset nappaukset
  let comboMul = 1;             // Pistekerroin (1x, 2x, 3x)
  let comboTimer = 0;           // Aika ennen combotauon nollausta
  const COMBO_TIMEOUT = 4.5;    // Sekuntia ennen combopoistumistra
  // --- Kenttätapahtumat ---
  let fieldEvent = null;        // Aktiivinen kenttätapahtuma { type, x, y, timer, ... }
  let fieldEventTimer = 0;      // Aiassin seuraavalle tapahtumalle
  // --- Jalanjäljet ---
  let footprints = [];          // [{ x, y, age, maxAge, kind }]
  let footprintTimer = 0;       // Ajastin
  // --- Kalaveden kalastus ---
  let fishingSpots = [];        // { x, y, radius, rechargeCd }
  let fishingProgress = 0;      // Kaivamista vastaava edistymä
  let lastHuskyX = null;
  let lastHuskyY = null;
  let activeSticker = null;
  let dayTime = 0.3;
  let activeViewingCountry = null;
  let nearCabinet = false;
  let nearGramophone = false;
  let nearPlaque = false;
  let nearCookingPot = false;
  let nearPlanter = false;
  let nearDiploma = false;
  let nearFossils = false;
  let nearBackdoor = false;
  let nearQuestBoard = false;
  let nearCampfire = false;
  let nearTent = false;
  let nearTelescope = false;
  let nearAgility = false;
  let nearWishingWell = false;
  let nearPuppyNursery = false;
  let activePuppyFollower = null;
  let nearFriend = null;
  let activeFriendSpeech = null;
  let backyardCampfireState = {
    fedCount: 0,
    tentRested: false,
    telescopeUsed: false
  };

  const AGILITY_WORLD = { width: 820, height: 500 };
  let agilityState = 'idle'; // 'idle', 'countdown', 'running', 'finished'
  let agilityTimer = 0;
  let agilityPenalties = 0;
  let agilityCountdown = 3.0;
  let agilityStage = 0; // 0..5
  let agilityPoles = [];
  let agilityHurdle = { x: 500, y: 190, w: 70, h: 26, cleared: false, knocked: false };
  let agilityHoop = { x: 670, y: 190, radius: 28, cleared: false };
  let agilityTunnel = { inX: 710, inY: 310, outX: 540, outY: 370, radius: 34, used: false };
  let agilityRamp = { x1: 480, x2: 260, y: 370, h: 36, cleared: false };
  let agilityFinish = { x: 120, y: 370, crossed: false };
  let agilityPenaltyNoticeTimer = 0;
  let agilityPenaltyText = '';
  let agilityJumpTimer = 0;
  let activeTameablePrey = null;
  let selectedSouvenirIndex = -1;
  let mushrooms = [];           // Sienet kentällä: { x, y, radius, kind } (kind: 'chanterelle' | 'fly_agaric')
  let blueberries = [];         // Mustikat kentällä: { x, y, radius }
  let honeycombs = [];          // Hunajakennot: { x, y, radius, parentObstacle }
  let nests = [];               // Linnunpesät: { x, y, radius, parentObstacle }
  let beeSwarms = [];           // Mehiläisparvet: { x, y, radius, targetX, targetY, timer, speed }
  let speedBoostTimer = 0;      // Vauhtiboostin ajastin sienestä
  let confusionTimer = 0;       // Ohjaussekaannuksen ajastin sienestä
  let isFishingActive = false;
  let fishingTension = 0.4;
  let fishingFishY = 0.5;
  let fishingSuccess = 30;
  let activeFishingSpot = null;
  let fishingFishTargetY = 0.5;
  let scene = 'field';        // 'field' | 'interior' | 'dungeon' | 'island'
  let structures = [];        // talot ja kolot kentällä
  let interior = null;        // aktiivinen sisätila
  let returnPos = { x: 0, y: 0 }; // mihin husky palaa kun poistuu sisätilasta
  let level = 1;
  let score = 0;            // pyydystetyt yhteensä (koko peli)
  let caughtThisLevel = 0;  // edistyminen nykyisellä tasolla
  let goal = 8;             // montako pyydystettävä päästäkseen seuraavalle tasolle
  let lives = 3;
  let maxLives = 3;
  let running = false;
  // --- Maailmankartta ---
  let worldMapVisible = false;
  let worldMapNodes = [];
  let worldMapEdges = [];
  let worldMapDeco = []; // Kartan taustakoristeet
  let selectedMapNode = null;
  let shopOpenedFromMap = false; // onko kauppa avattu kartalta käsin
  let mapDepth = 0;               // Kuinka monta solmua on selvitetty
  let adventureMode = 'mainland'; // 'mainland' | 'island'
  let activeCodexTab = 'prey';    // 'prey' | 'predators'
  let codexAnimPhase = 0;
  let codexAnimId = null;
  // --- Aarrekammiot ---
  let treasureData = null;
  let treasureProgress = 0;
  let activeChest = null;
  // --- Päävalikon esikatselu ---
  let menuPreviewAnimId = null;
  let menuPreviewPhase = 0;
  let menuBackgroundAnimId = null;
  let menuBgTime = 0;
  let menuBgParticles = [];
  // --- Sääefektit (salamaniskut) ---
  let lightningStrikes = [];
  let lightningTimer = 5 + Math.random() * 5;
  let meteors = [];
  let meteorTimer = 3.0 + Math.random() * 4.0;
  let isMeteorShower = false;
  let screenFlashTimer = 0;
  let goldRushTimer = 0; // Kultainen kuume ajastin
  // --- Luolastot ---
  let dungeonData = null; // { traps[], chests[], portal, spikes[] }
  let dungeonSpikeCooldowns = {}; // piikkiansaesteiden cooldown
  let thrownToys = []; // heitetyt squeaky lelut { x, y, vx, vy, radius, bounceCount, maxBounces, life }
  let dungeonCoconutProjectiles = []; // kookospähkinät luolastossa
  let dungeonKeyFound = false;
  let portalCooldown = 0;
  let fishCount = 0;
  let cookingProgress = 0;
  let petTimer = 0;
  const COOK_TIME = 1.5;
  // --- Saariseikkailu ---
  let islandData = null;  // { islands[], seagulls[], crabs[] }
  let lastTime = 0;
  let invulnTimer = 0;      // lyhyt suoja-aika osuman jälkeen
  let howlRings = [];       // laajenevat ulvonta-aallot (visuaalinen)
  let particles = [];       // hiukkaset (nappauspurske ym.)
  window.spawnSparkleParticle = function(x, y, color) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 50,
      vy: (Math.random() - 0.5) * 50,
      color: color,
      radius: 2 + Math.random() * 2.5,
      alpha: 1.0,
      life: 0.4 + Math.random() * 0.4,
      maxLife: 0.8
    });
  };
  let shakeTimer = 0;       // ruudun tärinän kesto
  let flashTimer = 0;       // punaisen osumavälähdyksen kesto
  let collectibles = [];    // keräiltävät luut (aktiivisen kohtauksen)
  let fieldCollectibles = []; // kentän luut talteen sisätilassa ollessa
  let gameTime = 0;         // kulunut peliaika (luiden leijunta-animaatioon)
  let digSpots = [];        // aarrekarttojen merkitsemät kaivuupaikat [{x,y,progress,step,totalSteps}]
  let gemsFound = 0;        // löydetyt jalokivet
  let artifactsOwned = [];  // tällä pelikerralla hankitut muinaisesineet (id-lista)
  const DIG_RADIUS = 32;    // kuinka lähellä ❌:ää pitää olla kaivaakseen
  const DIG_TIME = 1.6;     // kaivamisen kesto sekunteina
  const SHIELD_RECHARGE = 11; // Muinaisen kilven latautumisaika sekunteina

  // Huskyn oma kokemustaso ja taidot
  let perks = Skills.freshPerks();
  let huskyLevel = 1;
  let huskyXp = 0;
  let xpToNext = 4;

  function xpForHuskyLevel(lv) { return 4 + (lv - 1) * 2; } // Lv1→4, Lv2→6, Lv3→8 ...

  // --- Ennätykset (localStorage) ---
  const HS_KEY = 'huskyAdventures.highscores';
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem(HS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveHighScores() {
    try { localStorage.setItem(HS_KEY, JSON.stringify(highScores)); } catch (e) { /* esim. yksityistila */ }
  }
  let highScores = loadHighScores(); // { bestLevel, bestScore, bestHuskyLevel }

  window.onBossDamage = function(boss, source) {
    let msg = '';
    if (source === 'lava') {
      msg = `🔥 Pomo ohjattiin laavaan! HP: ${boss.hp}/${boss.maxHp}`;
      spawnBurst(boss.x, boss.y, ['#ff5a00', '#ffc000', '#ff0000'], 34);
    } else {
      msg = `💥 Pomo törmäsi esteeseen! HP: ${boss.hp}/${boss.maxHp}`;
      spawnBurst(boss.x, boss.y, ['#ff9000', '#ffe8c0', '#777777'], 30);
    }
    
    if (boss.hp <= 0) {
      spawnBurst(boss.x, boss.y, ['#ffd700', '#ffffff', '#ffaa00'], 48);
      Audio.play('legendary');
      shopData.totalGems += 15;
      saveShopData();
      showBanner('👑 KUKISTIT POMON! +15 💎');
      nextLevel();
    } else {
      showBanner(msg);
      Audio.play('hurt');
    }
  };

  // --- Jalokivikaupan tiedot (localStorage) ---
  const SHOP_KEY = 'huskyAdventures.shopData';
  let shopData = {
    totalGems: 0,
    ownedSkins: ['default'],
    equippedSkin: 'default',
    ownedHats: [],
    equippedHat: 'none',
    ownedCompanionSkins: ['default'],
    equippedCompanionSkin: 'default',
    ownedCompanionHats: ['none'],
    equippedCompanionHat: 'none',
    discovered: {},
    cabinUpgrades: {
      fireplace: 0,
      trophyWall: false,
      doghouse: 0,
      bowlLvl: 0,
      toybox: 0,
      planterPots: false
    },
    gardenSlots: [null, null, null],
    achievements: {
      caughtCount: 0,
      rescuedCount: 0,
      noDamageLevel: false,
      visitedCave: false,
      unlocked: []
    },
    items: {
      heartPotion: 0,
      speedCharm: 0,
      smokeBomb: 0,
      lantern: 0,
      companion: 0
    },
    stats: {
      distanceTraveled: 0,
      damageTaken: 0,
      memoryWon: 0,
      playtimeSeconds: 0,
      mythicalsCaught: 0,
      mythicalsTamed: 0,
      campfireParty: false,
      questsCompleted: 0,
      wishesCount: 0
    },
    agilityRecord: 0,
    stickers: [],
    photoCaptions: {},
    ingredients: {
      salmon: 0,
      honey: 0,
      chanterelle: 0,
      blueberry: 0,
      feather: 0
    },
    activeBuff: '',
    trust: {},
    quests: {
      date: '',
      list: [],
      masterClaimed: false
    },
    talents: {
      speed: 0,
      dash: 0,
      magnet: 0,
      fortune: 0,
      stamina: 0,
      howl: 0
    },
    fossils: {
      trilobite: false,
      amber: false,
      mammoth: false,
      plesiosaur: false,
      t_rex_tooth: false
    },
    puppies: {
      lumi: false,
      kipina: false,
      hilla: false,
      salama: false,
      toivo: false
    },
    puppyHappiness: {
      lumi: 100,
      kipina: 100,
      hilla: 100,
      salama: 100,
      toivo: 100
    },
    activePuppy: null
  };

  function loadShopData() {
    try {
      const saved = JSON.parse(localStorage.getItem(SHOP_KEY));
      if (saved) {
        shopData = Object.assign(shopData, saved);
         if (!Array.isArray(shopData.ownedSkins)) shopData.ownedSkins = ['default'];
        if (!Array.isArray(shopData.ownedHats)) shopData.ownedHats = [];
        if (typeof shopData.equippedHat !== 'string') shopData.equippedHat = 'none';
        if (!Array.isArray(shopData.ownedCompanionSkins)) shopData.ownedCompanionSkins = ['default'];
        if (typeof shopData.equippedCompanionSkin !== 'string') shopData.equippedCompanionSkin = 'default';
        if (!Array.isArray(shopData.ownedCompanionHats)) shopData.ownedCompanionHats = ['none'];
        if (typeof shopData.equippedCompanionHat !== 'string') shopData.equippedCompanionHat = 'none';
        
        if (!shopData.ingredients || typeof shopData.ingredients !== 'object') {
          shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
        }
        if (typeof shopData.activeBuff !== 'string') shopData.activeBuff = '';
        if (!shopData.trust || typeof shopData.trust !== 'object') shopData.trust = {};
        if (typeof shopData.activeBuff !== 'string') shopData.activeBuff = '';
        
        // Varmistetaan, että achievements on oikeanlainen olio
        if (!shopData.achievements || typeof shopData.achievements !== 'object') {
          shopData.achievements = {
            caughtCount: 0,
            rescuedCount: 0,
            noDamageLevel: false,
            visitedCave: false,
            fishCaughtCount: 0,
            treasuresDugCount: 0,
            beeEscapesCount: 0,
            unlocked: []
          };
        } else {
          if (typeof shopData.achievements.caughtCount !== 'number') shopData.achievements.caughtCount = 0;
          if (typeof shopData.achievements.rescuedCount !== 'number') shopData.achievements.rescuedCount = 0;
          if (typeof shopData.achievements.noDamageLevel !== 'boolean') shopData.achievements.noDamageLevel = false;
          if (typeof shopData.achievements.visitedCave !== 'boolean') shopData.achievements.visitedCave = false;
          if (typeof shopData.achievements.fishCaughtCount !== 'number') shopData.achievements.fishCaughtCount = 0;
          if (typeof shopData.achievements.treasuresDugCount !== 'number') shopData.achievements.treasuresDugCount = 0;
          if (typeof shopData.achievements.beeEscapesCount !== 'number') shopData.achievements.beeEscapesCount = 0;
          if (!Array.isArray(shopData.achievements.unlocked)) shopData.achievements.unlocked = [];
        }
        
        // Varmistetaan, että items on oikeanlainen olio
        if (!shopData.items || typeof shopData.items !== 'object') {
          shopData.items = { heartPotion: 0, speedCharm: 0, smokeBomb: 0, lantern: 0, companion: 0 };
        } else {
          const expectedItems = ['heartPotion', 'speedCharm', 'smokeBomb', 'lantern', 'companion'];
          expectedItems.forEach(item => {
            if (typeof shopData.items[item] !== 'number') shopData.items[item] = 0;
          });
        }
        
        // Varmistetaan, että discovered on olemassa
        if (!shopData.discovered || typeof shopData.discovered !== 'object') {
          shopData.discovered = {};
        }

        // Varmistetaan, että stats-olio on olemassa
        if (!shopData.stats || typeof shopData.stats !== 'object') {
          shopData.stats = {
            distanceTraveled: 0,
            damageTaken: 0,
            memoryWon: 0,
            playtimeSeconds: 0,
            mythicalsCaught: 0,
            mythicalsTamed: 0,
            campfireParty: false
          };
        } else {
          if (typeof shopData.stats.distanceTraveled !== 'number') shopData.stats.distanceTraveled = 0;
          if (typeof shopData.stats.damageTaken !== 'number') shopData.stats.damageTaken = 0;
          if (typeof shopData.stats.memoryWon !== 'number') shopData.stats.memoryWon = 0;
          if (typeof shopData.stats.playtimeSeconds !== 'number') shopData.stats.playtimeSeconds = 0;
          if (typeof shopData.stats.mythicalsCaught !== 'number') shopData.stats.mythicalsCaught = 0;
          if (typeof shopData.stats.mythicalsTamed !== 'number') shopData.stats.mythicalsTamed = 0;
          if (typeof shopData.stats.campfireParty !== 'boolean') shopData.stats.campfireParty = false;
          if (typeof shopData.stats.questsCompleted !== 'number') shopData.stats.questsCompleted = 0;
        }

        // Varmistetaan, että unlockedStamps on olemassa
        if (!shopData.unlockedStamps || typeof shopData.unlockedStamps !== 'object') {
          shopData.unlockedStamps = {};
        }

        // Varmistetaan, että completedQuests on olemassa
        if (!shopData.completedQuests || typeof shopData.completedQuests !== 'object') {
          shopData.completedQuests = {};
        }

        // Varmistetaan, että unlockedPostcards on olemassa
        if (!shopData.unlockedPostcards || typeof shopData.unlockedPostcards !== 'object') {
          shopData.unlockedPostcards = {};
        }

        // Varmistetaan, että unlockedPhotos on olemassa
        if (!shopData.unlockedPhotos || typeof shopData.unlockedPhotos !== 'object') {
          shopData.unlockedPhotos = {};
        }

        // Varmistetaan, että cabinUpgrades on olemassa
        if (!shopData.cabinUpgrades || typeof shopData.cabinUpgrades !== 'object') {
          shopData.cabinUpgrades = { fireplace: 0, trophyWall: false, doghouse: 0, bowlLvl: 0, toybox: 0, gramophone: false, achievementsPlaque: false, planterPots: false };
        } else {
          if (typeof shopData.cabinUpgrades.fireplace !== 'number') shopData.cabinUpgrades.fireplace = 0;
          if (typeof shopData.cabinUpgrades.trophyWall !== 'boolean') shopData.cabinUpgrades.trophyWall = false;
          if (typeof shopData.cabinUpgrades.doghouse !== 'number') shopData.cabinUpgrades.doghouse = 0;
          if (typeof shopData.cabinUpgrades.bowlLvl !== 'number') shopData.cabinUpgrades.bowlLvl = 0;
          if (typeof shopData.cabinUpgrades.toybox !== 'number') shopData.cabinUpgrades.toybox = 0;
          if (typeof shopData.cabinUpgrades.gramophone !== 'boolean') shopData.cabinUpgrades.gramophone = false;
          if (typeof shopData.cabinUpgrades.achievementsPlaque !== 'boolean') shopData.cabinUpgrades.achievementsPlaque = false;
          if (typeof shopData.cabinUpgrades.planterPots !== 'boolean') shopData.cabinUpgrades.planterPots = false;
        }

        if (!Array.isArray(shopData.gardenSlots) || shopData.gardenSlots.length !== 3) {
          shopData.gardenSlots = [null, null, null];
        }

        if (typeof shopData.equippedMusicTheme !== 'string') {
          shopData.equippedMusicTheme = 'default';
        }

        if (!shopData.photoCaptions || typeof shopData.photoCaptions !== 'object') {
          shopData.photoCaptions = {};
        }

        if (!Array.isArray(shopData.stickers)) {
          shopData.stickers = [];
        }

        if (!shopData.quests || typeof shopData.quests !== 'object') {
          shopData.quests = { date: '', list: [], masterClaimed: false };
        } else {
          if (typeof shopData.quests.date !== 'string') shopData.quests.date = '';
          if (!Array.isArray(shopData.quests.list)) shopData.quests.list = [];
          if (typeof shopData.quests.masterClaimed !== 'boolean') shopData.quests.masterClaimed = false;
        }

        if (typeof shopData.agilityRecord !== 'number') shopData.agilityRecord = 0;
        if (!shopData.stats) shopData.stats = {};
        if (typeof shopData.stats.wishesCount !== 'number') shopData.stats.wishesCount = 0;

        if (!shopData.talents || typeof shopData.talents !== 'object') {
          shopData.talents = { speed: 0, dash: 0, magnet: 0, fortune: 0, stamina: 0, howl: 0 };
        } else {
          ['speed', 'dash', 'magnet', 'fortune', 'stamina', 'howl'].forEach(t => {
            if (typeof shopData.talents[t] !== 'number') shopData.talents[t] = 0;
          });
        }

        if (!shopData.fossils || typeof shopData.fossils !== 'object') {
          shopData.fossils = { trilobite: false, amber: false, mammoth: false, plesiosaur: false, t_rex_tooth: false };
        } else {
          ['trilobite', 'amber', 'mammoth', 'plesiosaur', 't_rex_tooth'].forEach(k => {
            if (typeof shopData.fossils[k] !== 'boolean') shopData.fossils[k] = false;
          });
        }

        if (!shopData.puppies || typeof shopData.puppies !== 'object') {
          shopData.puppies = { lumi: false, kipina: false, hilla: false, salama: false, toivo: false };
        } else {
          ['lumi', 'kipina', 'hilla', 'salama', 'toivo'].forEach(k => {
            if (typeof shopData.puppies[k] !== 'boolean') shopData.puppies[k] = false;
          });
        }

        if (!shopData.puppyHappiness || typeof shopData.puppyHappiness !== 'object') {
          shopData.puppyHappiness = { lumi: 100, kipina: 100, hilla: 100, salama: 100, toivo: 100 };
        } else {
          ['lumi', 'kipina', 'hilla', 'salama', 'toivo'].forEach(k => {
            if (typeof shopData.puppyHappiness[k] !== 'number') shopData.puppyHappiness[k] = 100;
          });
        }

        if (typeof shopData.activePuppy !== 'string' && shopData.activePuppy !== null) {
          shopData.activePuppy = null;
        }
      }
    } catch (e) {
      console.error("Error loading shop data, resetting:", e);
    }
  }

  function saveShopData() {
    try {
      localStorage.setItem(SHOP_KEY, JSON.stringify(shopData));
    } catch (e) {}
  }

  loadShopData();

  function renderHighScores(newRecord) {
    const hs = highScores;
    if (!hs.bestLevel && !hs.bestScore) { highscoresEl.innerHTML = ''; return; }
    highscoresEl.innerHTML =
      (newRecord ? '<div class="record-badge">🏆 Uusi ennätys!</div>' : '') +
      '<div class="hs-title">Parhaat tulokset</div>' +
      `<div class="hs-row"><span>🏆 Taso</span><b>${hs.bestLevel || 0}</b></div>` +
      `<div class="hs-row"><span>🐾 Saalis</span><b>${hs.bestScore || 0}</b></div>` +
      `<div class="hs-row"><span>🦴 Husky Lv</span><b>${hs.bestHuskyLevel || 1}</b></div>` +
      `<div class="hs-row"><span>💎 Jalokivet</span><b>${hs.bestGems || 0}</b></div>` +
      `<div class="hs-row"><span>🏺 Muinaisesineet</span><b>${hs.bestArtifacts || 0}/${ARTIFACTS.length}</b></div>`;
  }

  // Aktiivinen maailma riippuu kohtauksesta (ulkona vs. sisätila vs. luolasto vs. saari)
  function activeWorld() {
    if (scene === 'interior') return interior.world;
    if (scene === 'dungeon' && dungeonData) return { width: dungeonData.W, height: dungeonData.H };
    if (scene === 'island' && islandData) return { width: islandData.W, height: islandData.H };
    if (scene === 'treasure' && treasureData) return { width: 480, height: 360 };
    if (scene === 'agility') return AGILITY_WORLD;
    return world;
  }

  // Kamera keskittyy huskyyn, mutta ei mene maailman reunojen yli.
  // Jos maailma on viewporttia pienempi (sisätila), keskitetään se.
  function updateCamera() {
    const w = activeWorld();
    if (w.width <= viewport.width) cam.x = (w.width - viewport.width) / 2;
    else cam.x = clamp(husky.x - viewport.width / 2, 0, w.width - viewport.width);
    if (w.height <= viewport.height) cam.y = (w.height - viewport.height) / 2;
    else cam.y = clamp(husky.y - viewport.height / 2, 0, w.height - viewport.height);
  }

  // --- Canvasin skaalaus ruudun mukaan ---
  function resize() {
    const scale = Math.min(
      window.innerWidth / viewport.width,
      window.innerHeight / viewport.height
    );
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${viewport.width * scale}px`;
    canvas.style.height = `${viewport.height * scale}px`;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomPos(margin = 60) {
    return {
      x: margin + Math.random() * (world.width - margin * 2),
      y: margin + Math.random() * (world.height - margin * 2),
    };
  }

  // --- Tasokohtaiset asetukset (vaikeus kasvaa) ---
  function goalForLevel(lv) { return 6 + lv * 2; }        // L1:8, L2:10, L3:12 ...
  function preyOnField(lv) { return Math.min(7 + lv, 13); } // montako saalista isolla kentällä yhtä aikaa

  // Generoi kenttä: pusikoita (piilo) ja kiviä (näköeste). Isompi maailma → enemmän esteitä.
  // Ei mene päällekkäin esteiden, keskuksen (aloituspaikka) eikä rakennusten kanssa.
  function generateObstacles(lv) {
    const obs = [];
    const bushCount = Math.min(10 + lv * 2, 24);
    const rockCount = Math.min(6 + lv, 16);

    function tryPlace(type, rMin, rMax) {
      for (let attempt = 0; attempt < 40; attempt++) {
        const radius = rMin + Math.random() * (rMax - rMin);
        const p = randomPos(70);
        if (Math.hypot(p.x - center.x, p.y - center.y) < 110) continue; // jätä keskus vapaaksi
        // älä tuki rakennusten sisäänkäyntejä
        if (structures.some((s) => Math.hypot(p.x - s.x, p.y - s.y) < 90 + radius)) continue;
        let ok = true;
        for (const o of obs) {
          if (Math.hypot(p.x - o.x, p.y - o.y) < o.radius + radius + 28) { ok = false; break; }
        }
        if (ok) { obs.push(new Obstacle(p.x, p.y, radius, type)); return; }
      }
    }

    // Asetetaan pusikot ensin
    for (let i = 0; i < bushCount; i++) tryPlace('bush', 38, 55);

    // Biomi-spesifit esteet ja vaarat
    if (biome.id === 'swamp') {
      const mudCount = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < mudCount; i++) tryPlace('mud', 35, 50);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    } else if (biome.id === 'snow') {
      const iceCount = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < iceCount; i++) tryPlace('ice', 35, 52);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
      // Spawnaa jäälohkareita (Ice Blocks)
      const iceBlockCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < iceBlockCount; i++) tryPlace('ice_block', 20, 24);
    } else if (biome.id === 'desert') {
      const cactusCount = 4 + Math.floor(Math.random() * 5);
      for (let i = 0; i < cactusCount; i++) tryPlace('cactus', 22, 28);
      for (let i = 0; i < Math.max(2, rockCount - 4); i++) tryPlace('rock', 30, 42);
    } else if (biome.id === 'volcano') {
      const lavaCount = 4 + Math.floor(Math.random() * 4); // 4-7 laavaläiskää
      for (let i = 0; i < lavaCount; i++) tryPlace('lava', 35, 52);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    } else if (biome.id === 'river') {
      const waterCount = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < waterCount; i++) tryPlace('water', 38, 55);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    } else if (biome.id === 'crystals') {
      const crystalCount = 3 + Math.floor(Math.random() * 3); // 3-5 kristallirykelmää
      for (let i = 0; i < crystalCount; i++) tryPlace('crystal_shards', 20, 24);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    } else if (biome.id === 'aurora') {
      const crystalCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < crystalCount; i++) tryPlace('crystal_shards', 20, 24);
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    } else {
      for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    }

    // Kausikohtaiset esteet
    if (currentSeason === 'winter') {
      for (let i = 0; i < 3; i++) tryPlace('campfire', 24, 28);
    } else if (currentSeason === 'autumn') {
      for (let i = 0; i < 6; i++) tryPlace('leafpile', 28, 38);
    }

    return obs;
  }

  // --- Rakennukset: talot (🏠), kolot (🕳️) ja luolat (🪨) joihin voi mennä sisään ---
  function createStructures(lv) {
    const list = [];
    const count = 2 + Math.floor(Math.random() * 2); // 2–3 rakennusta
    for (let i = 0; i < count; i++) {
      for (let attempt = 0; attempt < 40; attempt++) {
        const p = randomPos(140);
        if (Math.hypot(p.x - center.x, p.y - center.y) < 220) continue; // ei keskelle
        if (list.some((s) => Math.hypot(p.x - s.x, p.y - s.y) < 320)) continue; // erilleen
        const kind = Math.random() < 0.35 ? 'house' : Math.random() < 0.6 ? 'den' : 'cave';
        list.push({
          x: p.x, y: p.y, radius: 42, kind, looted: false,
          hasNpc: kind === 'house' && Math.random() < 0.55,
          hasTraps: (kind === 'den' || kind === 'cave') && Math.random() < 0.6,
          npcHelped: false,
        });
        break;
      }
    }
    return list;
  }

  function isBossLevel(lv) { return lv % 5 === 0; }

  // Pedot tasoittain: enemmän ja nopeampia. Joka 5. taso on pomotaso.
  function predatorsForLevel(lv) {
    const speedMul = 1 + (lv - 1) * 0.06;
    const corners = [
      { x: 120, y: 120 },
      { x: world.width - 120, y: world.height - 120 },
      { x: world.width - 120, y: 120 },
      { x: 120, y: world.height - 120 },
    ];

    if (isBossLevel(lv)) {
      // Biomin mukainen uniikki pomovastus
      let bossKind = 'bear';
      if (biome.id === 'snow') bossKind = 'yeti';
      else if (biome.id === 'desert') bossKind = 'scorpion';
      else if (biome.id === 'swamp') bossKind = 'crocodile';
      else if (biome.id === 'river') bossKind = 'eagle'; // jättikotka
      else if (biome.id === 'forest') bossKind = 'bear'; // jättikarhu
      else if (biome.id === 'volcano') bossKind = 'wolf';
      else if (biome.id === 'jungle') bossKind = 'panther'; // jättipantteri
      else if (biome.id === 'foggy_peaks') bossKind = 'eagle'; // jättikotka
      else if (biome.id === 'crystals') bossKind = 'spider'; // kristallihämähäkki pomoksi
      else if (biome.id === 'aurora') bossKind = 'wolf'; // Revontulilaakson arktinen valiosusi

      const list = [new Predator(center.x, 120, bossKind, speedMul, true)];
      if (lv >= 10) list.push(new Predator(corners[3].x, corners[3].y, 'fox', speedMul));
      if (lv >= 15) list.push(new Predator(corners[2].x, corners[2].y, 'wolf', speedMul));
      return list;
    }

    const count = Math.min(lv, 4);
    const list = [];
    
    // Suunnitellaan petopooli tason ja vuorokaudenajan mukaan
    const pool = ['bear', 'wolf'];
    if (lv >= 3) pool.push('fox');
    if (biome.id === 'jungle') {
      if (lv >= 4) pool.push('panther');
    } else if (biome.id === 'crystals') {
      if (lv >= 3) pool.push('spider');
    } else {
      if (lv >= 4) pool.push('lynx');
    }
    if (isNightTime()) {
      pool.push('owl');
    } else {
      if (lv >= 6) pool.push('eagle');
    }

    for (let i = 0; i < count; i++) {
      let kind = pool[i % pool.length];
      let pX = corners[i].x;
      let pY = corners[i].y;
      
      // Jos peto on ilves tai pantteri, sijoitetaan se väijyyn pusikon sisälle jos mahdollista
      if ((kind === 'lynx' || kind === 'panther') && typeof obstacles !== 'undefined' && obstacles.length > 0) {
        const bushes = obstacles.filter(o => o.type === 'bush');
        if (bushes.length > 0) {
          const b = bushes[Math.floor(Math.random() * bushes.length)];
          pX = b.x;
          pY = b.y;
        }
      }
      list.push(new Predator(pX, pY, kind, speedMul));
    }
    return list;
  }

  // --- Saaliin luonti ---
  function spawnOnePrey() {
    let kind;
    if (isNightTime() && Math.random() < 0.65) {
      kind = 'bat';
    } else {
      const kinds = biome.prey;
      kind = kinds[Math.floor(Math.random() * kinds.length)];
      if (kind === 'squirrel' && Math.random() < 0.08) {
        kind = 'golden_squirrel';
      }
    }
    // Ilmesty etäälle huskysta, ettei pääse heti kiinni
    for (let attempt = 0; attempt < 30; attempt++) {
      const p = randomPos(50);
      if (Math.hypot(p.x - husky.x, p.y - husky.y) > 150) {
        return new Prey(p.x, p.y, kind);
      }
    }
    const p = randomPos(50);
    return new Prey(p.x, p.y, kind);
  }

  function refillPrey() {
    while (prey.length < preyOnField(level)) prey.push(spawnOnePrey());
  }

  // Luo kentälle keräiltäviä luita (joukossa harvoin kultainen)
  function spawnCollectibles() {
    const list = [];
    const n = 5 + Math.floor(Math.random() * 3); // 5–7 luuta isolla kentällä
    for (let i = 0; i < n; i++) {
      const p = randomPos(70);
      const gold = Math.random() < 0.2; // ~20 % kultainen
      list.push({ x: p.x, y: p.y, radius: 16, gold, phase: Math.random() * Math.PI * 2 });
    }
    return list;
  }

  // --- Sisätilat (talon/kolon sisus) ---
  // Rakenna pieni huone seinineen, uloskäynteineen ja aarteineen.
  function buildInterior(s) {
    const w = { width: 760, height: 540 };
    const walls = [
      // huonekalut/kivet esteinä, tuovat tunnelmaa
      new Obstacle(160, 150, 34, 'rock'),
      new Obstacle(w.width - 170, 160, 30, 'rock'),
      new Obstacle(w.width - 150, w.height - 170, 36, 'rock'),
    ];
    const exit = { x: w.width / 2, y: w.height - 36, r: 32 }; // ovi alareunan keskellä

    // Generoi sisältö KERRAN ja talleta rakennukseen, jotta se säilyy
    // ulos/sisään-käyntien yli (vain jo kerätyt katoavat).
    if (!s.contentBuilt) {
      const loot = [];
      if (s.kind === 'cave') {
        // Luolassa on suoraan jalokiviä kerättäväksi!
        const gemCount = 2 + Math.floor(Math.random() * 3); // 2–4 gemiä
        for (let i = 0; i < gemCount; i++) {
          const g = GEMS[Math.floor(Math.random() * GEMS.length)];
          loot.push({
            x: 130 + Math.random() * (w.width - 260),
            y: 120 + Math.random() * (w.height - 270),
            radius: 14,
            gem: true,
            color: g.color,
            phase: Math.random() * Math.PI * 2
          });
        }
      } else {
        // Päähyödyke: noin 40 % rakennuksista kätkee aarrekartan, muuten ison kultaluun
        if (Math.random() < 0.4) {
          loot.push({ x: w.width / 2, y: 150, radius: 17, map: true, phase: 0 });
        } else {
          loot.push({ x: w.width / 2, y: 150, radius: 18, gold: true, phase: 0 });
        }
        let extra = 2 + Math.floor(Math.random() * 2);
        if (s.kind === 'den') extra += 1; // kolot ovat vaarallisempia → enemmän aarretta
        for (let i = 0; i < extra; i++) {
          loot.push({
            x: 130 + Math.random() * (w.width - 260),
            y: 120 + Math.random() * (w.height - 270),
            radius: 16, gold: Math.random() < (s.kind === 'den' ? 0.4 : 0.3), phase: Math.random() * Math.PI * 2,
          });
        }
      }
      s.loot = loot;
      // Ystävällinen eläin taloissa: auttaa kerran
      s.npc = s.hasNpc
        ? { x: w.width * 0.28, y: w.height * 0.42, radius: 15, kind: 'rabbit', flip: 1, animPhase: 0, moving: false, helped: false }
        : null;
      // Ansat koloissa ja luolissa: piikit jotka satuttavat
      const traps = [];
      if (s.hasTraps) {
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) {
          traps.push({ x: 170 + Math.random() * (w.width - 340), y: 160 + Math.random() * (w.height - 300), radius: 26 });
        }
      }
      s.traps = traps;
      s.contentBuilt = true;
    }
    return { world: w, walls, exit, kind: s.kind, loot: s.loot, npc: s.npc, traps: s.traps, struct: s };
  }

  function enterStructure(s) {
    if (s.kind === 'cave') {
      shopData.achievements.visitedCave = true;
      checkAchievements();
    }
    if (s.kind === 'house') {
      const theme = shopData.equippedMusicTheme || 'default';
      Audio.setMusicTheme(theme);
      if (shopData.cabinUpgrades.fireplace > 0) {
        Audio.startCabinAmbient();
      }
    }
    returnPos = { x: s.x, y: s.y + s.radius + husky.radius + 10 }; // ulko-oven eteen
    interior = buildInterior(s);
    fieldCollectibles = collectibles; // talleta kentän luut
    collectibles = interior.loot;     // sisätilan aarteet keräiltäviksi
    husky.x = interior.world.width / 2;
    husky.y = interior.world.height - 95; // oven sisäpuolelle
    husky.hidden = false;
    scene = 'interior';
    invulnTimer = 0.6;
    interiorExitCooldown = 0.65;
    showBanner(s.kind === 'house' ? '🏠 Sisällä!' : s.kind === 'den' ? '🕳️ Kolossa!' : '🪨 Luolassa!');
    Audio.play('skill');
  }

  function exitInterior() {
    if (interior && interior.kind === 'house') {
      Audio.stopCabinAmbient();
    }
    // Tallenna jäljellä oleva (keräämättä jäänyt) tavara rakennukseen
    interior.struct.loot = collectibles;
    scene = 'field';
    interior = null;
    husky.x = clamp(returnPos.x, husky.radius, world.width - husky.radius);
    husky.y = clamp(returnPos.y, husky.radius, world.height - husky.radius);
    collectibles = fieldCollectibles; // palauta kentän luut näkyviin
    invulnTimer = 0.8;

    const dest = getDestinationForLevel(level);
    Audio.setMusicTheme(themeForCountry(dest.country));
  }

  function enterBackyard(struct) {
    const w = { width: 760, height: 540 };
    const walls = [
      new Obstacle(380, 240, 36, 'rock'),
      new Obstacle(180, 180, 42, 'rock'),
      new Obstacle(580, 180, 28, 'rock'),
      new Obstacle(180, 370, 30, 'rock'),
      new Obstacle(580, 370, 30, 'rock'),
    ];
    const exit = { x: 380, y: w.height - 36, r: 32 };
    
    const friends = [];
    if (shopData.trust) {
      const animalSpots = {
        squirrel: { name: 'Oravakaveri 🐿️', icon: '🐿️', x: 310, y: 240 },
        rabbit: { name: 'Kanikaveri 🐇', icon: '🐇', x: 450, y: 240 },
        beaver: { name: 'Majavakaveri 🦫', icon: '🦫', x: 380, y: 170 },
        deer: { name: 'Peurakaveri 🦌', icon: '🦌', x: 290, y: 180 },
        bird: { name: 'Lintukaveri 🐦', icon: '🐦', x: 470, y: 180 }
      };

      Object.keys(animalSpots).forEach(key => {
        const trust = shopData.trust[key] || 0;
        if (trust >= 1) {
          const spot = animalSpots[key];
          friends.push({
            id: key,
            name: spot.name,
            icon: spot.icon,
            x: spot.x,
            y: spot.y,
            radius: 20,
            hasGift: true
          });
        }
      });
    }

    interior = {
      world: w,
      walls: walls,
      exit: exit,
      kind: 'backyard',
      loot: [],
      npc: null,
      traps: [],
      struct: struct,
      friends: friends
    };

    husky.x = 380;
    husky.y = 440;
    interiorExitCooldown = 0.65;
    showBanner('🏕️ Mökin takapiha & Leirinuotio!');
    Audio.play('skill');
  }

  function enterHouseFromBackyard(struct) {
    interior = buildInterior(struct);
    husky.x = 620;
    husky.y = 120;
    interiorExitCooldown = 0.65;
    showBanner('🏠 Mökin sisällä!');
    Audio.play('skill');
  }

  function feedCampfire() {
    if (score < 5) {
      showBanner("Tarvitset vähintään 5 Luuta 🦴 ruokkiaksesi nuotiota!");
      Audio.play('hurt');
      return;
    }
    score -= 5;
    updateHud();
    backyardCampfireState.fedCount++;
    spawnBurst(380, 240, ['#ffd700', '#ff9800', '#ff5722', '#ffeb3b'], 30);
    gainXp(12);
    Audio.play('levelup');

    if (!shopData.stats) shopData.stats = {};
    shopData.stats.campfireParty = true;
    saveShopData();
    checkAchievements();

    showBanner("🔥 Ruokit nuotiota! Liekit leiskuvat ja sait +12 XP!");
  }

  function restInTent() {
    if (backyardCampfireState.tentRested) {
      showBanner("Olet jo levännyt teltassa tällä vierailulla! ⛺💤");
      Audio.play('tick');
      return;
    }
    backyardCampfireState.tentRested = true;
    lives = maxLives;
    perks.hasShield = true;
    updateHud();
    Audio.play('legendary');
    spawnBurst(180, 180, ['#81d4fa', '#b388ff', '#ffffff'], 25);
    spawnTextParticle(husky.x, husky.y - 20, "LEPO! ❤️ TÄYDET ELÄMÄT & KILPI!", "#81d4fa");
    showBanner("⛺ Nukuit makeat nokoset teltassa! Elämät täynnä ja sait suojakilven!");
  }

  function useTelescope() {
    if (backyardCampfireState.telescopeUsed) {
      showBanner("Olet jo katsellut tähtitaivasta tänään! 🌌");
      Audio.play('tick');
      return;
    }
    backyardCampfireState.telescopeUsed = true;
    Audio.play('gem');
    gainXp(15);
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        particles.push({
          x: 650 + Math.random() * 100,
          y: 40 + Math.random() * 40,
          vx: -220 - Math.random() * 60,
          vy: 140 + Math.random() * 40,
          color: '#fff59d',
          radius: 3.5,
          alpha: 1.0,
          life: 1.2,
          maxLife: 1.2
        });
      }, i * 280);
    }
    showBanner("🔭 Katsoit kaukoputkeen ja näit upean tähdenlennon! +15 XP! ✨");
  }

  function interactWithFriend(f) {
    const quotes = {
      squirrel: ["Pähkinät ovat parhaita! 🐿️", "Kaivetaanko aarteita metsästä? 🗺️", "Säästä mustikat piirakkaan! 🫐", "Vauhti korjaa virheet! 💨"],
      rabbit: ["Nopeus on valttia! 🐇", "Mustikat ovat suurinta herkkua! 🫐", "Juostaan kilpaa puiden lomassa! 🌲", "Loikkiminen pitää mielen virkeänä!"],
      beaver: ["Padot ovat järvien arkkitehtuuria! 🦫", "Nuotion lämpö sulattaa kylmimmänkin viiman! 🔥", "Kantarellit tekevät keitosta täydellistä! 💛", "Rauhallisuus on voimaa."],
      deer: ["Metsä on hiljainen ja kaunis. 🦌", "Nuotio kimmeltää kuin aito jalokivi! 💎", "Olet uskollinen ystävä, Husky! 💖", "Luonto kantaa meistä huolen."],
      bird: ["Tirsk! Sulkaani voit käyttää parhaissa resepteissä! 🪶", "Varo sudenkuoppia matkallasi! 🕳️", "Laula kanssani Pohjolan säveliä! 📻", "Siivet kantavat minne vain! 🕊️"]
    };
    const list = quotes[f.id] || ["Moi Husky! Kiva nähdä sinut nuotiolla! 🐾", "Hau hau! Yhdessä olemme vahvempia! ❤️"];
    const text = list[Math.floor(Math.random() * list.length)];
    activeFriendSpeech = { text: text, x: f.x, y: f.y, timer: 3.2 };
    progressQuest('tame_or_friend', 1);

    if (f.hasGift) {
      f.hasGift = false;
      const r = Math.random();
      if (r < 0.4) {
        score += 4;
        updateHud();
        showBanner(`🎁 ${f.name} ojensi sinulle lahjan: +4 Luuta! 🦴`);
        Audio.play('goldbone');
      } else if (r < 0.8) {
        if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
        const keys = ['blueberry', 'chanterelle', 'honey', 'feather'];
        const chosen = keys[Math.floor(Math.random() * keys.length)];
        shopData.ingredients[chosen] = (shopData.ingredients[chosen] || 0) + 1;
        saveShopData();
        showBanner(`🎁 ${f.name} antoi raaka-aineen: +1 ${chosen}! 🧺`);
        Audio.play('gem');
      } else {
        shopData.totalGems += 1;
        saveShopData();
        showBanner(`🎁 ${f.name} löysi sinulle pienen aarteen: +1 Jalokivi! 💎`);
        Audio.play('gem');
      }
      spawnBurst(f.x, f.y, ['#ffd700', '#ffffff', '#ff80ab'], 20);
    } else {
      Audio.play('skill');
    }
  }

  // --- Pelin alustus ---
  function init() {
    level = 1;
    score = 0;
    caughtThisLevel = 0;
    goal = goalForLevel(level);
    
    // Kaupasta ostetut edut (tavarat)
    let bonusLives = 0;
    if (shopData.items && shopData.items.heartPotion > 0) {
      bonusLives = shopData.items.heartPotion;
      shopData.items.heartPotion = 0;
    }
    let stampBonusLives = 0;
    if (shopData.unlockedStamps && shopData.unlockedStamps['Brasilia 🇧🇷']) {
      stampBonusLives = 1;
    }
    maxLives = 3 + bonusLives + stampBonusLives;
    lives = 3 + bonusLives + stampBonusLives;

    invulnTimer = 0;
    howlRings = [];
    particles = [];
    shakeTimer = 0;
    flashTimer = 0;
    collectibles = [];
    gameTime = 0;
    digSpots = [];
    gemsFound = 0;
    fishCount = 0;
    cookingProgress = 0;
    petTimer = 0;
    artifactsOwned = [];
    projectiles = [];
    volcanoTimer = 0;
    // Nollaa combot, kenttätapahtumat ja jalanjäljet
    comboCount = 0; comboMul = 1; comboTimer = 0;
    fieldEvent = null; fieldEventTimer = 0;
    footprints = []; footprintTimer = 0;
    fishingSpots = []; fishingProgress = 0;
    // Nollaa huskyn kokemustaso ja taidot
    perks = Skills.freshPerks();
    
    if (shopData.items && shopData.items.speedCharm > 0) {
      perks.speedMul *= 1.12;
      shopData.items.speedCharm = 0;
    }

    if (shopData.activeBuff) {
      if (shopData.activeBuff === 'salmon_soup') {
        maxLives += 1;
        lives = maxLives;
        showBanner('🍲 Söit Lohikeittoa! Saat +1 max sydämen tälle tasolle!');
        Audio.play('legendary');
      } else if (shopData.activeBuff === 'honey_berry_tea') {
        bodyTemp = 100;
        showBanner('☕ Joit Hunaja-marjateetä! Kehosi on lämmin ja vastustuskykyinen!');
        Audio.play('legendary');
      } else if (shopData.activeBuff === 'winged_bark_snack') {
        perks.dashSpeedMul = 2.0;
        showBanner('🍪 Söit Siivekkään kuonopalan! Väistösyöksysi on täynnä energiaa!');
        Audio.play('legendary');
      }
      shopData.activeBuff = '';
    }
    saveShopData();
    huskyLevel = 1;
    huskyXp = 0;
    xpToNext = xpForHuskyLevel(huskyLevel);
    scene = 'field';
    interior = null;
    currentSeason = getSeasonForLevel(level);
    bodyTemp = 50;
    freezeDmgTimer = 0;
    biome = biomeForLevel(level);
    meteors = [];
    isMeteorShower = (Math.random() < 0.18);
    if (isMeteorShower) {
      timeOfDay = 0.82; // yötaivas meteorikuurolle!
      weather = 'clear'; // selkeä sää jotta meteorit näkyvät
      showBanner('☄️ METEORIKUURO! Väistä tulipalloja ja kerää pudonneita Tähtisiruja 🌠!');
      Audio.play('legendary');
    } else {
      timeOfDay = 0.3; // aamupäivä
      weather = pickWeather(biome.id);
    }
    initWeatherParticles();
    structures = createStructures(level);
    obstacles = generateObstacles(level); // huom: viittaa structures-listaan
    spawnEnvironmentalObjects();
    husky = new Husky(center.x, center.y);
    husky.skin = shopData.equippedSkin;
    husky.hat = shopData.equippedHat;

    if (shopData.items && shopData.items.companion > 0) {
      const compSkin = shopData.equippedCompanionSkin || 'default';
      companion = new Companion(center.x - 45, center.y, compSkin);
      companion.hat = shopData.equippedCompanionHat || 'none';
      companion.speed = 210 + ((shopData.cabinUpgrades.doghouse || 0) * 40);
    } else {
      companion = null;
    }

    lostPuppy = null;
    if (Math.random() < 0.35) {
      let pPos = randomPos(140);
      while (Math.hypot(pPos.x - center.x, pPos.y - center.y) < 250) {
        pPos = randomPos(140);
      }
      const missingPup = typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA.find(p => !shopData.puppies || !shopData.puppies[p.id]) : null;
      const pupType = missingPup ? missingPup.id : (typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA[Math.floor(Math.random() * PUPPIES_DATA.length)].id : 'lumi');
      lostPuppy = {
        x: pPos.x, y: pPos.y, radius: 10,
        following: false, animPhase: 0, flip: 1,
        kind: 'puppy', puppyType: pupType
      };
    }

    tookDamageThisLevel = false;

    predators = predatorsForLevel(level);
    prey = [];
    refillPrey();
    collectibles = spawnCollectibles();
    renderPerks();
    updateXpBar();
    updateHud();
    renderAchievements(); // piirretään uudet saavutukset
  }

  function winGame() {
    running = false;
    Audio.stopMusic();
    Audio.stopCabinAmbient();
    Audio.play('legendary');
    
    if (typeof shopData !== 'undefined') {
      shopData.totalGems += gemsFound;
      saveShopData();
    }
    
    overlayText.textContent = (adventureMode === 'island')
      ? `🏆 ONNEKSI OLKOON! Läpäisit Saariseikkailun ja purjehdit maailman ympäri! Keräsit ${gemsFound} jalokiveä!`
      : `🏆 ONNEKSI OLKOON! Läpäisit Maailmanmatkan ja kiersit koko maapallon! Husky pyydysti ${score} eläintä ja keräsi ${gemsFound} jalokiveä!`;
    if (typeof renderHighScores === 'function') renderHighScores(true);
    if (typeof renderAchievements === 'function') renderAchievements();
    
    hideWorldMap();
    overlay.classList.remove('hidden');
  }

  function setupFieldForCurrentLevel() {
    caughtThisLevel = 0;
    goal = goalForLevel(level);
    scene = 'field';
    interior = null;

    const dest = getDestinationForLevel(level);
    Audio.setMusicTheme(themeForCountry(dest.country));

    lostPuppy = null;
    if (Math.random() < 0.35) {
      let pPos = randomPos(140);
      while (Math.hypot(pPos.x - center.x, pPos.y - center.y) < 250) {
        pPos = randomPos(140);
      }
      const missingPup = typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA.find(p => !shopData.puppies || !shopData.puppies[p.id]) : null;
      const pupType = missingPup ? missingPup.id : (typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA[Math.floor(Math.random() * PUPPIES_DATA.length)].id : 'lumi');
      lostPuppy = {
        x: pPos.x, y: pPos.y, radius: 10,
        following: false, animPhase: 0, flip: 1,
        kind: 'puppy', puppyType: pupType
      };
    }
    currentSeason = getSeasonForLevel(level);
    bodyTemp = 50;
    freezeDmgTimer = 0;
    biome = biomeForLevel(level);
    weather = pickWeather(biome.id);
    initWeatherParticles();
    digSpots = [];
    fieldEvent = null; fieldEventTimer = 15 + Math.random() * 20;
    footprints = []; footprintTimer = 0;
    fishingSpots = []; fishingProgress = 0;
    structures = createStructures(level);
    obstacles = generateObstacles(level);
    predators = predatorsForLevel(level);
    husky.x = center.x;
    husky.y = center.y;
    if (companion) {
      companion.x = center.x - 45;
      companion.y = center.y;
      companion.vx = 0;
      companion.vy = 0;
      companion.speed = 210 + ((shopData.cabinUpgrades.doghouse || 0) * 40);
    }
    prey = [];
    refillPrey();
    collectibles = spawnCollectibles();

    // Spawnaa maakohtainen matkahaasteen kohde (Quest Item)
    if (adventureMode === 'mainland') {
      const dest = getDestinationForLevel(level);
      const questDb = {
        'Suomi 🇫🇮': { emoji: '🦌', name: 'Poro-vasikka', desc: 'Pelasta eksynyt poro-vasikka Lapin metsästä' },
        'Sveitsi 🇨🇭': { emoji: '📯', name: 'Alppitorvi', desc: 'Löydä kadonnut alppitorvi Alppien rinteiltä' },
        'Egypti 🇪🇬': { emoji: '🪲', name: 'Faaraon skarabee', desc: 'Kerää faaraon kultainen skarabee aavikolta' },
        'Brasilia 🇧🇷': { emoji: '🐒', name: 'Orpo apinanpoikanen', desc: 'Pelasta sademetsään eksynyt apinanpoikanen' },
        'Islanti 🇮🇸': { emoji: '☄️', name: 'Laavakristalli', desc: 'Nouda kuuma laavakristalli tulivuoren kupeesta' },
        'Louisiana 🇺🇸': { emoji: '🏴‍☠️', name: 'Sunken chest', desc: 'Etsi ja avaa suolle hukkunut vanha arkku' },
        'Kanada 🇨🇦': { emoji: '🍁', name: 'Kultainen vaahteranlehti', desc: 'Löydä vuoristosta loistava kultainen vaahteranlehti' },
        'Kiina 🇨🇳': { emoji: '🏮', name: 'Usvatemppelin suitsuke', desc: 'Sytytä suitsuke vuoriston pyhässä temppelissä' },
        'USA 🇺🇸': { emoji: '⚾', name: 'Kadonnut baseball-pallo', desc: 'Etsi syksyisten lehtien seasta kadonnut pallo' },
        'Japani 🇯🇵': { emoji: '🗡️', name: 'Kadonnut katana-miekka', desc: 'Löydä kristalliluolasta vanha arvokas katana' }
      };

      const q = questDb[dest.country];
      if (q) {
        let qx = 250 + Math.random() * (world.width - 500);
        let qy = 250 + Math.random() * (world.height - 500);
        while (Math.hypot(qx - center.x, qy - center.y) < 200) {
          qx = 250 + Math.random() * (world.width - 500);
          qy = 250 + Math.random() * (world.height - 500);
        }
        
        collectibles.push({
          x: qx, y: qy,
          radius: 16,
          emoji: q.emoji,
          isQuest: true,
          questName: q.name,
          questDesc: q.desc,
          countryName: dest.country
        });
      }
    }

    invulnTimer = 1.0;
  }

  // --- Tasonvaihto ---
  function nextLevel() {
    if (!tookDamageThisLevel) {
      shopData.achievements.noDamageLevel = true;
      checkAchievements();
    }
    tookDamageThisLevel = false;

    // Päivitetään puutarhan viljelykset (kasvu etenee)
    if (Array.isArray(shopData.gardenSlots)) {
      let grewAny = false;
      shopData.gardenSlots.forEach(slot => {
        if (slot && slot.stage < 2) {
          slot.stage++;
          grewAny = true;
        }
      });
      if (grewAny) saveShopData();
    }

    // Mökin ruokakuppi-moniste (aloitus-XP)
    if (shopData.cabinUpgrades.bowlLvl > 0) {
      huskyXp += shopData.cabinUpgrades.bowlLvl * 20;
      updateXpBar();
    }

    // Mökin lelulaatikko-päivitys (ilmaiset varusteet)
    if (shopData.cabinUpgrades.toybox > 0) {
      if (shopData.items) {
        shopData.items.smokeBomb = 1;
        saveShopData();
      }
      if (shopData.cabinUpgrades.toybox === 2) {
        perks.hasShield = true;
      }
      showBanner('🎾 Lelulaatikko antoi ilmaisia suojavarusteita tason alussa!');
    }

    if (adventureMode === 'mainland') {
      // Merkitään nykyinen solmu suoritetuksi
      if (selectedMapNode) {
        selectedMapNode.cleared = true;
        unlockNextRow(selectedMapNode);
      }
      saveShopData();

      if (selectedMapNode && selectedMapNode.type === 'boss') {
        winGame();
      } else {
        running = false;
        level++;
        const oldDest = getDestinationForLevel(level - 1);
        unlockStampForDestination(oldDest);
        showBanner(`⚔️ ${oldDest.country} selvitetty! Palaa karttaan.`);
        Audio.play('levelup');
        updateHud();
        
        setTimeout(() => {
          overlay.classList.remove('hidden');
          showWorldMap('mainland');
        }, 1200);
      }
    } else {
      // Normaalipeli (endless)
      level++;
      setupFieldForCurrentLevel();
      showBanner(isBossLevel(level)
        ? `👑 POMOTASO ${level} — ${biome.emoji} ${biome.name} ${weatherEmoji()}`
        : `${biome.emoji} ${biome.name} ${weatherEmoji()} — Taso ${level}`);
      Audio.play(isBossLevel(level) ? 'boss' : 'levelup');
      updateHud();
    }
  }

  function showBanner(text) {
    bannerEl.textContent = text;
    bannerEl.classList.remove('show');
    void bannerEl.offsetWidth; // pakota animaation uudelleenkäynnistys
    bannerEl.classList.add('show');
  }

  function updateHud() {
    levelEl.textContent = level;
    progressEl.textContent = caughtThisLevel;
    goalEl.textContent = goal;
    huskyLevelEl.textContent = huskyLevel;
    gemsEl.textContent = gemsFound;
    if (fishCountEl) {
      fishCountEl.textContent = fishCount;
    }
    livesEl.textContent = lives;
    updateTempHud();
  }

  function updateTempHud() {
    if (currentSeason === 'winter') {
      tempHud.style.display = 'block';
      tempValue.textContent = `${Math.round(bodyTemp)}°C`;
      if (bodyTemp < 25) {
        tempValue.style.color = '#7ad0ff';
        tempHud.style.borderColor = '#7ad0ff';
      } else {
        tempValue.style.color = '#ffffff';
        tempHud.style.borderColor = 'rgba(255,255,255,0.15)';
      }
    } else if (currentSeason === 'summer') {
      tempHud.style.display = 'block';
      tempValue.textContent = `${Math.round(bodyTemp)}°C`;
      if (bodyTemp >= 100) {
        tempValue.style.color = '#ff3333';
        tempHud.style.borderColor = '#ff3333';
      } else if (bodyTemp > 80) {
        tempValue.style.color = '#ff9900';
        tempHud.style.borderColor = '#ff9900';
      } else {
        tempValue.style.color = '#ffffff';
        tempHud.style.borderColor = 'rgba(255,255,255,0.15)';
      }
    } else {
      tempHud.style.display = 'none';
    }
  }

  function updateClockHUD() {
    if (!hudTimeEl) return;
    const active = (gameState === 'play' && ['field', 'island'].includes(scene));
    if (!active) {
      hudTimeEl.style.display = 'none';
      return;
    }
    hudTimeEl.style.display = 'block';

    const hour = Math.floor(dayTime * 24);
    const minute = Math.floor((dayTime * 24 % 1) * 60);
    const padHour = String(hour).padStart(2, '0');
    const padMin = String(minute).padStart(2, '0');

    let emoji = '☀️';
    let timeLabel = 'Päivä';
    if (hour >= 5 && hour < 9) {
      emoji = '🌅';
      timeLabel = 'Aamu';
    } else if (hour >= 9 && hour < 18) {
      emoji = '☀️';
      timeLabel = 'Päivä';
    } else if (hour >= 18 && hour < 21) {
      emoji = '🌇';
      timeLabel = 'Ilta';
    } else {
      emoji = '🌙';
      timeLabel = 'Yö';
    }

    hudTimeEl.textContent = `${emoji} ${timeLabel} ${padHour}:${padMin}`;
  }

  function updateCompass() {
    const compassEl = document.getElementById('adventure-compass');
    const needleEl = document.getElementById('compass-needle');
    if (!compassEl || !needleEl) return;

    const inGame = (gameState === 'play' && ['field', 'interior', 'dungeon', 'island'].includes(scene));
    if (!inGame || !husky) {
      compassEl.classList.add('hidden');
      return;
    }

    compassEl.classList.remove('hidden');

    let target = null;
    let targetType = 'none';

    if (typeof collectibles !== 'undefined' && Array.isArray(collectibles)) {
      const activeQuest = collectibles.find(c => c.isQuest && !c.collected);
      if (activeQuest) {
        target = activeQuest;
        targetType = 'quest';
      }
    }

    if (!target) {
      if (scene === 'dungeon') {
        if (typeof dungeonData !== 'undefined' && dungeonData) {
          if (typeof dungeonKeyFound !== 'undefined' && !dungeonKeyFound) {
            const keyChest = dungeonData.chests.find(c => c.hasKey && !c.opened);
            if (keyChest) {
              target = keyChest;
              targetType = 'exit';
            }
          }
          if (!target && dungeonData.portal) {
            target = dungeonData.portal;
            targetType = 'exit';
          }
        }
      } else if (scene === 'interior') {
        if (typeof treasureData !== 'undefined' && treasureData && treasureData.portal) {
          target = treasureData.portal;
          targetType = 'exit';
        }
      } else if (scene === 'island') {
        if (typeof islandChest !== 'undefined' && islandChest && !islandChest.opened) {
          target = islandChest;
          targetType = 'exit';
        }
      }
    }

    if (!target) {
      if (scene === 'island' && typeof islandData !== 'undefined' && islandData) {
        const allPrey = [...(islandData.seagulls || []), ...(islandData.crabs || [])].filter(p => p.alive);
        let closestPrey = null;
        let minDist = Infinity;
        for (const p of allPrey) {
          const d = Math.hypot(p.x - husky.x, p.y - husky.y);
          if (d < minDist) {
            minDist = d;
            closestPrey = p;
          }
        }
        if (closestPrey) {
          target = closestPrey;
          targetType = 'prey';
        } else if (islandData.pier) {
          target = islandData.pier;
          targetType = 'exit';
        }
      } else if (typeof prey !== 'undefined' && Array.isArray(prey)) {
        let closestPrey = null;
        let minDist = Infinity;
        for (const p of prey) {
          if (!p.alive) continue;
          const d = Math.hypot(p.x - husky.x, p.y - husky.y);
          if (d < minDist) {
            minDist = d;
            closestPrey = p;
          }
        }
        if (closestPrey) {
          target = closestPrey;
          targetType = 'prey';
        }
      }
    }

    if (target) {
      const dx = target.x - husky.x;
      const dy = target.y - husky.y;
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = angleRad * (180 / Math.PI) + 90;

      needleEl.style.transform = `rotate(${angleDeg}deg)`;

      if (targetType === 'quest') {
        needleEl.className = 'seeking-quest';
      } else if (targetType === 'exit') {
        needleEl.className = 'seeking-exit';
      } else if (targetType === 'prey') {
        needleEl.className = 'seeking-prey';
      } else {
        needleEl.className = '';
      }
    } else {
      const time = Date.now() * 0.003;
      const idleAngle = Math.sin(time) * 15;
      needleEl.style.transform = `rotate(${idleAngle}deg)`;
      needleEl.className = '';
    }
  }

  function updateRadar() {
    const radarCanvas = document.getElementById('radar-canvas');
    if (!radarContainer || !radarCanvas) return;

    const active = (gameState === 'play' && ['field', 'dungeon', 'island', 'treasure'].includes(scene));
    if (!active || !husky) {
      radarContainer.classList.add('hidden');
      return;
    }

    radarContainer.classList.remove('hidden');

    if (radarContainer.classList.contains('radar-collapsed')) {
      return;
    }

    const rCtx = radarCanvas.getContext('2d');
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const rad = 56;

    rCtx.clearRect(0, 0, w, h);

    let W = 1600;
    let H = 1600;
    if (scene === 'dungeon' && typeof dungeonData !== 'undefined' && dungeonData) {
      W = dungeonData.W || 1200;
      H = dungeonData.H || 1200;
    } else if (scene === 'treasure') {
      W = 480;
      H = 360;
    } else if (scene === 'island' && typeof islandData !== 'undefined' && islandData) {
      W = islandData.W || 1000;
      H = islandData.H || 1000;
    } else if (typeof world !== 'undefined' && world) {
      W = world.width || 1600;
      H = world.height || 1600;
    }

    function toRadar(wx, wy) {
      const scale = 50; 
      const rx = cx + ((wx / W) * 2 - 1) * scale;
      const ry = cy + ((wy / H) * 2 - 1) * scale;
      return { x: rx, y: ry };
    }

    rCtx.save();
    
    rCtx.beginPath();
    rCtx.arc(cx, cy, rad, 0, Math.PI * 2);
    rCtx.clip();

    rCtx.fillStyle = 'rgba(10, 24, 12, 0.9)';
    rCtx.fillRect(0, 0, w, h);

    rCtx.strokeStyle = 'rgba(76, 175, 80, 0.25)';
    rCtx.lineWidth = 1;
    rCtx.beginPath();
    rCtx.moveTo(cx, cy - rad); rCtx.lineTo(cx, cy + rad);
    rCtx.moveTo(cx - rad, cy); rCtx.lineTo(cx + rad, cy);
    rCtx.stroke();
    
    rCtx.beginPath();
    rCtx.arc(cx, cy, rad * 0.4, 0, Math.PI * 2);
    rCtx.arc(cx, cy, rad * 0.75, 0, Math.PI * 2);
    rCtx.stroke();

    rCtx.strokeStyle = 'rgba(76, 175, 80, 0.35)';
    rCtx.lineWidth = 1.5;

    if (scene === 'dungeon' && dungeonData && Array.isArray(dungeonData.walls)) {
      for (const wl of dungeonData.walls) {
        const p1 = toRadar(wl.x, wl.y);
        const p2 = toRadar(wl.x + wl.w, wl.y + wl.h);
        rCtx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      }
    } else if (scene === 'island' && islandData && Array.isArray(islandData.islands)) {
      for (const isl of islandData.islands) {
        const p = toRadar(isl.x, isl.y);
        const r = (isl.radius / W) * 100;
        rCtx.beginPath();
        rCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
        rCtx.stroke();
      }
    }

    const sweepTime = Date.now() * 0.0022;
    const angle = sweepTime % (Math.PI * 2);
    
    rCtx.save();
    rCtx.beginPath();
    rCtx.moveTo(cx, cy);
    rCtx.arc(cx, cy, rad, angle - 0.25, angle);
    rCtx.lineTo(cx, cy);
    
    const sweepGrad = rCtx.createRadialGradient(cx, cy, 2, cx, cy, rad);
    sweepGrad.addColorStop(0, 'rgba(76, 175, 80, 0.45)');
    sweepGrad.addColorStop(1, 'rgba(76, 175, 80, 0)');
    rCtx.fillStyle = sweepGrad;
    rCtx.fill();
    rCtx.restore();

    let exitPos = null;
    if (scene === 'dungeon' && dungeonData && dungeonData.portal) {
      exitPos = dungeonData.portal;
    } else if (scene === 'treasure' && treasureData && treasureData.portal) {
      exitPos = treasureData.portal;
    } else if (scene === 'island' && islandData && islandData.pier) {
      exitPos = islandData.pier;
    }
    if (exitPos) {
      const ep = toRadar(exitPos.x, exitPos.y);
      rCtx.fillStyle = '#00e5ff';
      rCtx.shadowColor = '#00e5ff';
      rCtx.shadowBlur = 6;
      rCtx.beginPath();
      rCtx.arc(ep.x, ep.y, 4, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.shadowBlur = 0;
      
      rCtx.strokeStyle = '#00e5ff';
      rCtx.lineWidth = 1;
      rCtx.beginPath();
      rCtx.arc(ep.x, ep.y, 6 + Math.sin(Date.now() * 0.008) * 2, 0, Math.PI * 2);
      rCtx.stroke();
    }

    let activePrey = [];
    if (scene === 'island' && islandData) {
      activePrey = [...(islandData.seagulls || []), ...(islandData.crabs || [])].filter(p => p.alive);
    } else if (typeof prey !== 'undefined' && Array.isArray(prey)) {
      activePrey = prey.filter(p => p.alive);
    }
    rCtx.fillStyle = '#4caf50';
    for (const pr of activePrey) {
      const pp = toRadar(pr.x, pr.y);
      rCtx.beginPath();
      rCtx.arc(pp.x, pp.y, 3, 0, Math.PI * 2);
      rCtx.fill();
    }

    let activePredators = [];
    if (scene === 'island' && islandData && Array.isArray(islandData.sharks)) {
      activePredators = islandData.sharks;
    } else if (typeof predators !== 'undefined' && Array.isArray(predators)) {
      activePredators = predators;
    }
    for (const pd of activePredators) {
      const pp = toRadar(pd.x, pd.y);
      rCtx.fillStyle = pd.isBoss ? '#d50000' : '#ff1744';
      rCtx.beginPath();
      rCtx.arc(pp.x, pp.y, pd.isBoss ? 4.5 : 3, 0, Math.PI * 2);
      rCtx.fill();
    }

    if (typeof collectibles !== 'undefined' && Array.isArray(collectibles)) {
      const activeQuest = collectibles.find(c => c.isQuest && !c.collected);
      if (activeQuest) {
        const qp = toRadar(activeQuest.x, activeQuest.y);
        rCtx.fillStyle = '#ffeb3b';
        rCtx.shadowColor = '#ffeb3b';
        rCtx.shadowBlur = 8;
        rCtx.beginPath();
        rCtx.arc(qp.x, qp.y, 4, 0, Math.PI * 2);
        rCtx.fill();
        rCtx.shadowBlur = 0;
      }
    }

    if (companion) {
      const cp = toRadar(companion.x, companion.y);
      rCtx.fillStyle = '#29b6f6';
      rCtx.beginPath();
      rCtx.arc(cp.x, cp.y, 3.5, 0, Math.PI * 2);
      rCtx.fill();
    }

    if (husky) {
      const hp = toRadar(husky.x, husky.y);
      rCtx.fillStyle = '#ffffff';
      rCtx.shadowColor = '#ffffff';
      rCtx.shadowBlur = 6;
      rCtx.beginPath();
      rCtx.arc(hp.x, hp.y, 4, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.shadowBlur = 0;
    }

    rCtx.restore();
  }

  function updateXpBar() {
    const pct = Math.max(0, Math.min(1, huskyXp / xpToNext)) * 100;
    xpFillEl.style.width = `${pct}%`;
  }

  // Näytä opitut taidot pieninä merkkeinä (emoji + kertamäärä)
  function renderPerks() {
    perksEl.innerHTML = '';
    // Muinaisesineet ensin (kultareunaiset)
    for (const id of artifactsOwned) {
      const art = ARTIFACTS.find((a) => a.id === id);
      if (!art) continue;
      const chip = document.createElement('div');
      chip.className = 'perk-chip artifact-chip';
      chip.title = `${art.name}: ${art.desc}`;
      chip.textContent = art.emoji;
      perksEl.appendChild(chip);
    }
    for (const skill of Skills.ALL) {
      const n = perks.taken[skill.id] || 0;
      if (n === 0) continue;
      const chip = document.createElement('div');
      chip.className = 'perk-chip';
      chip.title = `${skill.name}: ${skill.desc}`;
      chip.textContent = n > 1 ? `${skill.emoji}×${n}` : skill.emoji;
      perksEl.appendChild(chip);
    }
  }

  // --- Huskyn taso & taidonvalinta ---
  const skillApi = {
    gainLife() { maxLives++; lives++; updateHud(); },
  };

  function offerSkill() {
    spawnTextParticle(husky.x, husky.y - 32, "TASO NOUSI! 🎉", "#ffd600", "bold 16px sans-serif");
    spawnBurst(husky.x, husky.y, ['#ffd700', '#bf9bff', '#ffffff', '#7ad0ff'], 36);
    
    const choices = Skills.roll(perks.taken, 3);
    if (choices.length === 0) {
      // Kaikki taidot opittu — muunna XP pienen bonuksen sijaan vain nollaa
      huskyXp -= xpToNext;
      huskyLevel++;
      xpToNext = xpForHuskyLevel(huskyLevel);
      updateHud();
      updateXpBar();
      return;
    }
    running = false;
    renderSkillCards(choices);
    huskyLevelUpEl.textContent = huskyLevel + 1;
    skillOverlay.classList.remove('hidden');
  }

  function renderSkillCards(choices) {
    skillCardsEl.innerHTML = '';
    for (const skill of choices) {
      const owned = perks.taken[skill.id] || 0;
      const card = document.createElement('button');
      card.className = 'skill-card';
      card.innerHTML =
        `<div class="skill-emoji">${skill.emoji}</div>` +
        `<div class="skill-name">${skill.name}${owned ? ` <span class="lvl">Lv ${owned + 1}</span>` : ''}</div>` +
        `<div class="skill-desc">${skill.desc}</div>`;
      card.addEventListener('click', () => chooseSkill(skill));
      skillCardsEl.appendChild(card);
    }
  }

  function chooseSkill(skill) {
    Audio.play('skill');
    skill.apply(perks, skillApi);
    perks.taken[skill.id] = (perks.taken[skill.id] || 0) + 1;
    huskyLevel++;
    huskyXp -= xpToNext;
    xpToNext = xpForHuskyLevel(huskyLevel);
    renderPerks();
    updateHud();
    updateXpBar();
    skillOverlay.classList.add('hidden');

    if (huskyXp >= xpToNext) {
      offerSkill();        // riitti vielä toiseen tasoon
    } else {
      resumeGame();
    }
  }

  function resumeGame() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  // --- Törmäystarkistus kahden ympyrän välillä ---
  function collides(a, b) {
    if (a.kind === 'eagle' && a.heightOffset > 15) return false;
    if (b.kind === 'eagle' && b.heightOffset > 15) return false;
    return Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius;
  }

  // Hiukkaspurske annetuilla väreillä (nappaus, osuma)
  function spawnBurst(x, y, colors, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 130;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.45 + Math.random() * 0.3,
        maxLife: 0.75,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }
  window.spawnBurst = spawnBurst;

  // Tekstipartikkeli (vahinko, XP, saalisnappaukset)
  function spawnTextParticle(x, y, text, color = '#ffffff', font = 'bold 12px sans-serif') {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 24,
      vy: -55 - Math.random() * 20,
      size: 0,
      color: color,
      text: text,
      font: font,
      life: 0.95,
      maxLife: 0.95
    });
  }
  window.spawnTextParticle = spawnTextParticle;

  // Husky ottaa osuman pedosta/ansasta. Muinainen kilpi torjuu yhden.
  // Palauttaa true jos peli päättyi (elämät loppuivat).
  function hurtHusky(sx, sy, sourceName = 'peto') {
    if (husky && husky.dashTimer > 0) return false; // Täydellinen väistösuoja!
    const w = activeWorld();
    const dx = husky.x - sx, dy = husky.y - sy, d = Math.hypot(dx, dy) || 1;
    if (perks.hasShield && husky.shieldReady) {
      // Kilpi torjuu: ei menetetä elämää, kilpi latautuu uudelleen
      husky.shieldReady = false;
      husky.shieldCd = SHIELD_RECHARGE;
      invulnTimer = 1.2;
      shakeTimer = 0.2;
      spawnBurst(husky.x, husky.y, ['#7ad0ff', '#bfe0ff', '#fff'], 22);
      spawnTextParticle(husky.x, husky.y - 22, "TORJUTTU! 🛡️", "#7ad0ff", "bold 14px sans-serif");
      
      let bannerText = '🛡️ Kilpi suojasi!';
      if (sourceName === 'cactus') bannerText = '🛡️ Kilpi suojasi kaktukselta!';
      else if (sourceName === 'lava') bannerText = '🛡️ Kilpi suojasi laavalta!';
      else if (sourceName === 'fireball') bannerText = '🛡️ Kilpi suojasi magmakiveltä!';
      showBanner(bannerText);
      
      Audio.play('shield');
      husky.x = clamp(husky.x + (dx / d) * 80, husky.radius, w.width - husky.radius);
      husky.y = clamp(husky.y + (dy / d) * 80, husky.radius, w.height - husky.radius);
      return false;
    }
    
    // Savupommi torjuu osuman ja pelästyttää pedot
    if (shopData.items && shopData.items.smokeBomb > 0) {
      shopData.items.smokeBomb = 0;
      saveShopData();
      invulnTimer = 2.0;
      shakeTimer = 0.25;
      spawnBurst(husky.x, husky.y, ['#ffffff', '#dddddd', '#bbbbbb', '#999999'], 40);
      spawnTextParticle(husky.x, husky.y - 22, "SAVUPOMMI! 💨", "#ffffff", "bold 14px sans-serif");
      
      let bannerText = '💨 Savupommi pelasti sinut!';
      if (sourceName === 'cactus') bannerText = '💨 Savupommi suojasi kaktukselta!';
      else if (sourceName === 'lava') bannerText = '💨 Savupommi suojasi laavalta!';
      else if (sourceName === 'fireball') bannerText = '💨 Savupommi suojasi magmakiveltä!';
      showBanner(bannerText);
      
      Audio.play('howl');
      
      // Pelästytetään kaikki lähellä olevat pedot
      let scareDur = 3.5;
      if (shopData.unlockedStamps && shopData.unlockedStamps['Kiina 🇨🇳']) scareDur = 4.5;
      if (typeof predators !== 'undefined') {
        for (const pred of predators) {
          if (Math.hypot(pred.x - husky.x, pred.y - husky.y) < 320) {
            pred.scare(scareDur);
          }
        }
      }
      
      husky.x = clamp(husky.x + (dx / d) * 80, husky.radius, w.width - husky.radius);
      husky.y = clamp(husky.y + (dy / d) * 80, husky.radius, w.height - husky.radius);
      return false;
    }

    if (sourceName === 'lava' || sourceName === 'fireball') {
      if (shopData.unlockedStamps && shopData.unlockedStamps['Islanti 🇮🇸'] && Math.random() < 0.5) {
        invulnTimer = 1.0;
        spawnTextParticle(husky.x, husky.y - 22, "SUOJATTU! 🌋", "#ff8f00", "bold 14px sans-serif");
        showBanner('🌋 Obsidian-lasi torjui tulivahingon!');
        return false;
      }
    }
    
    lives--;
    tookDamageThisLevel = true;
    shopData.stats.damageTaken = (shopData.stats.damageTaken || 0) + 1;
    saveShopData();
    comboCount = 0; comboMul = 1; // osuma katkaisee kombon
    invulnTimer = 1.6;
    shakeTimer = 0.4;
    flashTimer = 0.4;
    spawnTextParticle(husky.x, husky.y - 22, "-1 ❤️", "#ff1744", "bold 18px sans-serif");
    if (sourceName === 'cactus') {
      showBanner('🌵 Osuit kaktukseen!');
    } else if (sourceName === 'lava') {
      showBanner('🔥 Laava polttaa!');
    } else if (sourceName === 'fireball') {
      showBanner('☄️ Magmakivi osui sinuun!');
    } else if (sourceName === 'dungeon_spike') {
      showBanner('🗡️ Astuit piikkeihin!');
    }
    spawnBurst(husky.x, husky.y, ['#ff5a4a', '#ffac4a'], 14);
    Audio.play('hurt');
    husky.x = clamp(husky.x + (dx / d) * 105, husky.radius, w.width - husky.radius);
    husky.y = clamp(husky.y + (dy / d) * 105, husky.radius, w.height - husky.radius);
    updateHud();
    return lives <= 0;
  }

  // Yhteinen apu: päivitä hiukkaset ja ruutuefektien ajastimet
  function updateEffects(dt) {
    if (husky) {
      husky.trailTimer = (husky.trailTimer || 0) + dt;
      if (husky.moving && husky.trailTimer > 0.08) {
        husky.trailTimer = 0;
        let colors = [];
        if (husky.skin === 'fire') colors = ['#ff4a00', '#ff9a00', '#ffe000'];
        else if (husky.skin === 'shadow') colors = ['#221133', '#110522', '#6b1133', '#ff0033'];
        else if (husky.skin === 'arctic') colors = ['#ffffff', '#cceeff', '#8ad0ff'];
        
        if (colors.length > 0) {
          particles.push({
            x: husky.x - husky.flip * husky.radius * 0.4,
            y: husky.y + husky.radius * 0.4 + (Math.random() - 0.5) * 6,
            vx: -husky.flip * (30 + Math.random() * 30),
            vy: -10 - Math.random() * 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 2.2 + Math.random() * 2.5,
            life: 0.45,
            maxLife: 0.45
          });
        }
      }

      // Luodaan hienoja haamu-jälkiä (ghost trail) väistöliikkeen aikana
      if (husky.dashTimer > 0) {
        if (Math.random() < 0.55) {
          particles.push({
            x: husky.x,
            y: husky.y + (Math.random() - 0.5) * 6,
            vx: 0,
            vy: 0,
            color: 'rgba(122, 208, 255, 0.45)', // haalean sininen/valkoinen hehku
            size: 4 + Math.random() * 4,
            life: 0.22,
            maxLife: 0.22
          });
        }
      }

      // Tassunjäljet maahan Huskylle (ei uitaessa tai vedessä)
      husky.footprintTimer = (husky.footprintTimer || 0) + dt;
      if (husky.moving && husky.footprintTimer > 0.16 && !husky.swimming && !husky.inWater) {
        husky.footprintTimer = 0;
        
        let color = 'rgba(0,0,0,0.05)';
        if (currentSeason === 'winter') {
          color = 'rgba(180, 220, 255, 0.42)'; // lumi
        } else {
          let inMud = false;
          const obstaclesToCheck = (scene === 'field' && typeof obstacles !== 'undefined') ? obstacles : [];
          for (const o of obstaclesToCheck) {
            const dist = Math.hypot(husky.x - o.x, husky.y - o.y);
            if (o.type === 'mud' && dist < o.radius) inMud = true;
          }
          if (inMud) {
            color = 'rgba(80, 50, 30, 0.35)'; // muta
          } else if (scene === 'island') {
            color = 'rgba(210, 180, 110, 0.35)'; // saaren hiekka
          } else if (currentSeason === 'summer') {
            color = 'rgba(210, 180, 110, 0.28)'; // aavikkopöly
          } else {
            color = 'rgba(34, 139, 34, 0.08)'; // metsäruoho
          }
        }
        
        if (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0) {
          color = '#ffd700'; // kultaiset tassunjäljet
        }
        
        const angle = husky.facing || 0;
        const sideX = Math.cos(angle + Math.PI / 2) * 5;
        const sideY = Math.sin(angle + Math.PI / 2) * 5;
        const alternate = (Math.floor(gameTime * 5.5) % 2 === 0) ? 1 : -1;
        
        particles.push({
          x: husky.x - Math.cos(angle) * 6 + sideX * alternate,
          y: husky.y - Math.sin(angle) * 6 + sideY * alternate,
          vx: 0, vy: 0,
          size: 2,
          color: color,
          life: 1.8,
          maxLife: 1.8,
          isFootprint: true
        });
      }

      // Pusikoiden ja lehtikasojen läpi juokseminen pöllyttää lehtiä
      husky.rustleTimer = (husky.rustleTimer || 0) + dt;
      if (husky.moving && husky.rustleTimer > 0.08) {
        husky.rustleTimer = 0;
        const obstaclesToCheck = (scene === 'field' && typeof obstacles !== 'undefined') ? obstacles : [];
        for (const o of obstaclesToCheck) {
          if (o.type === 'bush' || o.type === 'leafpile') {
            const dist = Math.hypot(husky.x - o.x, husky.y - o.y);
            if (dist < o.radius + 6) {
              const count = Math.random() < 0.5 ? 1 : 2;
              for (let i = 0; i < count; i++) {
                particles.push({
                  x: husky.x + (Math.random() - 0.5) * 16,
                  y: husky.y + (Math.random() - 0.5) * 16,
                  vx: (Math.random() - 0.5) * 35 - (husky.vx || 0) * 0.1,
                  vy: -15 - Math.random() * 25,
                  size: 1.5 + Math.random() * 2.2,
                  color: o.type === 'bush' 
                    ? ['#2ecc71', '#27ae60', '#1abc9c'][Math.floor(Math.random() * 3)]
                    : ['#e67e22', '#d35400', '#f39c12'][Math.floor(Math.random() * 3)],
                  life: 0.45,
                  maxLife: 0.45
                });
              }
            }
          }
        }
      }
    }

    if (companion) {
      companion.trailTimer = (companion.trailTimer || 0) + dt;
      const compSkin = companion.skin || 'default';
      const compMoving = Math.hypot(companion.vx || 0, companion.vy || 0) > 10;
      if (compMoving && companion.trailTimer > 0.08) {
        companion.trailTimer = 0;
        let colors = [];
        if (compSkin === 'fire') colors = ['#ff4a00', '#ff9a00', '#ffe000'];
        else if (compSkin === 'shadow') colors = ['#221133', '#110522', '#6b1133', '#ff0033'];
        else if (compSkin === 'arctic') colors = ['#ffffff', '#cceeff', '#8ad0ff'];
        
        if (colors.length > 0) {
          particles.push({
            x: companion.x - companion.flip * companion.radius * 0.4,
            y: companion.y + companion.radius * 0.4 + (Math.random() - 0.5) * 6,
            vx: -companion.flip * (30 + Math.random() * 30),
            vy: -10 - Math.random() * 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 1.8 + Math.random() * 2.2,
            life: 0.45,
            maxLife: 0.45
          });
        }
      }

      // Tassunjäljet Kaverille (Companion)
      companion.footprintTimer = (companion.footprintTimer || 0) + dt;
      if (compMoving && companion.footprintTimer > 0.16) {
        companion.footprintTimer = 0;
        let color = 'rgba(0,0,0,0.05)';
        if (currentSeason === 'winter') {
          color = 'rgba(180, 220, 255, 0.42)';
        } else if (scene === 'island') {
          color = 'rgba(210, 180, 110, 0.35)';
        } else {
          color = 'rgba(34, 139, 34, 0.08)';
        }
        
        if (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0) {
          color = '#ffd700'; // kultaiset tassunjäljet
        }

        const angle = Math.atan2(companion.vy || 0, companion.vx || 1);
        const sideX = Math.cos(angle + Math.PI / 2) * 4;
        const sideY = Math.sin(angle + Math.PI / 2) * 4;
        const alternate = (Math.floor(gameTime * 5.5) % 2 === 0) ? 1 : -1;

        particles.push({
          x: companion.x - Math.cos(angle) * 5 + sideX * alternate,
          y: companion.y - Math.sin(angle) * 5 + sideY * alternate,
          vx: 0, vy: 0,
          size: 1.5,
          color: color,
          life: 1.5,
          maxLife: 1.5,
          isFootprint: true
        });
      }

      // Kaverin läpi juokseminen pöllyttää lehtiä
      companion.rustleTimer = (companion.rustleTimer || 0) + dt;
      if (compMoving && companion.rustleTimer > 0.08) {
        companion.rustleTimer = 0;
        const obstaclesToCheck = (scene === 'field' && typeof obstacles !== 'undefined') ? obstacles : [];
        for (const o of obstaclesToCheck) {
          if (o.type === 'bush' || o.type === 'leafpile') {
            const dist = Math.hypot(companion.x - o.x, companion.y - o.y);
            if (dist < o.radius + 5) {
              const count = Math.random() < 0.5 ? 1 : 2;
              for (let i = 0; i < count; i++) {
                particles.push({
                  x: companion.x + (Math.random() - 0.5) * 12,
                  y: companion.y + (Math.random() - 0.5) * 12,
                  vx: (Math.random() - 0.5) * 35 - (companion.vx || 0) * 0.1,
                  vy: -12 - Math.random() * 20,
                  size: 1.2 + Math.random() * 1.8,
                  color: o.type === 'bush' 
                    ? ['#2ecc71', '#27ae60', '#1abc9c'][Math.floor(Math.random() * 3)]
                    : ['#e67e22', '#d35400', '#f39c12'][Math.floor(Math.random() * 3)],
                  life: 0.4,
                  maxLife: 0.4
                });
              }
            }
          }
        }
      }
    }

    for (const pt of particles) {
      if (!pt.isFootprint) {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.9;
        pt.vy *= 0.9;
      }
      pt.life -= dt;
    }
    particles = particles.filter((pt) => pt.life > 0);
    if (shakeTimer > 0) shakeTimer -= dt;
    if (flashTimer > 0) flashTimer -= dt;
    gameTime += dt;
    // Vuorokausi etenee (kiertää 0..1)
    timeOfDay = (timeOfDay + dt / DAY_LENGTH) % 1;
  }

  // Päivitä säähiukkaset (sade/lumi/tuhka/lumimyrsky/hiekkamyrsky) ruutukoordinaatistossa
  function updateWeather(dt) {
    for (const p of weatherParticles) {
      if (weather === 'rain') {
        p.y += p.sp * dt;
        p.x -= p.sp * 0.18 * dt;
        if (p.y > viewport.height) { p.y = -10; p.x = Math.random() * viewport.width; }
        if (p.x < 0) p.x += viewport.width;
      } else if (weather === 'snow') {
        p.drift += dt;
        p.y += p.sp * dt;
        p.x += Math.sin(p.drift) * 22 * dt;
        if (p.y > viewport.height) { p.y = -5; p.x = Math.random() * viewport.width; }
        if (p.x < 0) p.x += viewport.width; else if (p.x > viewport.width) p.x -= viewport.width;
      } else if (weather === 'blizzard') {
        p.drift += dt * 2;
        p.y += p.sp * 0.45 * dt;
        p.x += (p.windX || 280) * dt + Math.sin(p.drift) * 35 * dt;
        if (p.y > viewport.height) { p.y = -5; p.x = Math.random() * (-100); }
        if (p.x > viewport.width + 10) { p.x = -10; p.y = Math.random() * viewport.height; }
      } else if (weather === 'ash') {
        p.drift += dt;
        p.y += p.sp * dt;
        p.x += Math.sin(p.drift) * 12 * dt;
        if (p.y > viewport.height) { p.y = -5; p.x = Math.random() * viewport.width; }
        if (p.x < 0) p.x += viewport.width; else if (p.x > viewport.width) p.x -= viewport.width;
      } else if (weather === 'sandstorm') {
        p.drift += dt * 1.5;
        p.x += p.sp * sandstormPush.x * dt + Math.sin(p.drift) * 30 * dt;
        p.y += p.sp * sandstormPush.y * 0.3 * dt + Math.cos(p.drift) * 25 * dt;
        if (p.x > viewport.width + 20) p.x = -20;
        if (p.x < -20) p.x = viewport.width + 20;
        if (p.y > viewport.height + 20) p.y = -20;
        if (p.y < -20) p.y = viewport.height + 20;
      } else if (weather === 'clear') {
        if (p.type === 'spring') {
          p.drift += dt;
          p.rot += p.rotSpeed * dt;
          p.y += p.sp * dt;
          p.x += Math.sin(p.drift) * 15 * dt - p.sp * 0.2 * dt;
          if (p.y > viewport.height) { p.y = -10; p.x = Math.random() * viewport.width; }
          if (p.x < 0) p.x += viewport.width;
        } else if (p.type === 'summer') {
          p.drift += dt * p.pulseSpeed;
          p.y -= p.sp * dt;
          p.x += Math.sin(p.drift) * 10 * dt;
          if (p.y < -10) { p.y = viewport.height + 10; p.x = Math.random() * viewport.width; }
          if (p.x < 0) p.x += viewport.width; else if (p.x > viewport.width) p.x -= viewport.width;
        } else if (p.type === 'autumn') {
          p.drift += dt;
          p.rot += p.rotSpeed * dt;
          p.y += p.sp * dt;
          p.x += Math.sin(p.drift) * 18 * dt - p.sp * 0.15 * dt;
          if (p.y > viewport.height) { p.y = -15; p.x = Math.random() * viewport.width; }
          if (p.x < 0) p.x += viewport.width;
        } else if (p.type === 'winter') {
          p.drift += dt;
          p.y += p.sp * dt;
          p.x += Math.sin(p.drift) * 15 * dt;
          if (p.y > viewport.height) { p.y = -10; p.x = Math.random() * viewport.width; }
          if (p.x < 0) p.x += viewport.width; else if (p.x > viewport.width) p.x -= viewport.width;
        }
      }
    }
  }

  // Säävaarat: lumimyrskyn jääpuikot, hiekkamyrskyn tuulipusku
  function updateWeatherHazards(dt) {
    if (scene !== 'field') return;
    if (weatherHazardBannerCd > 0) weatherHazardBannerCd -= dt;

    // --- Lumimyrsky: jääpuikot tippuvat rakenteista ---
    if (weather === 'blizzard') {
      icicleTimer += dt;
      const spawnInterval = Math.max(1.8, 3.2 - level * 0.08);
      if (icicleTimer > spawnInterval) {
        icicleTimer = 0;
        // Tiputa jääpuikko lähelle huskya (maailmakoordinaateissa)
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 230;
        const tx = clamp(husky.x + Math.cos(angle) * dist, 60, world.width - 60);
        const ty = clamp(husky.y + Math.sin(angle) * dist, 60, world.height - 60);
        icicles.push({ x: tx, y: ty, radius: 38, timer: 1.4, maxTime: 1.4, hit: false });
      }
      for (const ic of icicles) {
        ic.timer -= dt;
        if (ic.timer <= 0 && !ic.hit) {
          ic.hit = true;
          spawnBurst(ic.x, ic.y, ['#b0d8ff', '#ffffff', '#c8f0ff'], 18);
          Audio.play('hurt');
          shakeTimer = Math.max(shakeTimer, 0.18);
          if (invulnTimer <= 0 && Math.hypot(husky.x - ic.x, husky.y - ic.y) < ic.radius) {
            if (weatherHazardBannerCd <= 0) {
              weatherHazardBannerCd = 3;
              showBanner('🧊 Jääpuikko osui! Väistä lumimyrskyssä!');
            }
            if (hurtHusky(ic.x, ic.y, 'icicle')) { gameOver(); return; }
          }
        }
      }
      icicles = icicles.filter(ic => ic.timer > -0.4);
    }

    // --- Hiekkamyrsky: tuulipuska ajaa huskya ---
    if (weather === 'sandstorm') {
      // Tuulen suunta vaihtelee hitaasti
      sandstormTimer += dt;
      if (sandstormTimer > 6.5) {
        sandstormTimer = 0;
        const ang = Math.random() * Math.PI * 2;
        sandstormPush.x = Math.cos(ang);
        sandstormPush.y = Math.sin(ang);
        if (weatherHazardBannerCd <= 0) {
          weatherHazardBannerCd = 5;
          showBanner('🏜️ Hiekkamyrsky repii! Taistele tuulta vastaan!');
        }
      }
      // Työnnetään huskya tuulen suuntaan (heikkenee kirmauksen aikana)
      const pushForce = husky.sprinting ? 22 : 55; // px/s tuulen vaikutus
      husky.x = clamp(husky.x + sandstormPush.x * pushForce * dt, husky.radius, world.width - husky.radius);
      husky.y = clamp(husky.y + sandstormPush.y * pushForce * dt, husky.radius, world.height - husky.radius);
    }
  }

  // --- Apufunktiot bestiarialle ---
  function preyEmoji(kind) {
    return {
      highland_cow:'🐂', nessie:'🦕', kangaroo:'🦘', rabbit:'🐰', mouse:'🐭', squirrel:'🐿️', golden_squirrel:'🐿️✨', hedgehog:'🦔', bird:'🐦', deer:'🦌', beaver:'🦫', bat:'🦇', monkey:'🐒', mountain_goat:'🐐', coconut_crab:'🦀', seagull:'🐦', weasel:'🐹',
      bear:'🐻', wolf:'🐺', fox:'🦊', lynx:'🐱', eagle:'🦅', owl:'🦉', yeti:'❄️', scorpion:'🦂', crocodile:'🐊', panther:'🐆', shark:'🦈'
    }[kind] || '🐾';
  }
  function preyFinnish(kind) {
    return {
      highland_cow:'Ylämaankarja', nessie:'Loch Nessin Hirviö', kangaroo:'Kenguru', rabbit:'Jänis', mouse:'Hiiri', squirrel:'Orava', golden_squirrel:'Kultainen Orava', hedgehog:'Siili', bird:'Lintu', deer:'Hirvi', beaver:'Majava', bat:'Lepakko', monkey:'Apina', mountain_goat:'Vuorivuohi', coconut_crab:'Kookosrapu', seagull:'Lokki', weasel:'Kärppä',
      bear:'Karhu', wolf:'Susi', fox:'Kettu', lynx:'Ilves', eagle:'Jättikotka', owl:'Pöllö', yeti:'Jeti', scorpion:'Skorpioni', crocodile:'Krokotiili', panther:'Pantteri', shark:'Hai'
    }[kind] || kind;
  }

  // --- Kenttätapahtumat ---
  function spawnFieldEvent() {
    fieldEventTimer = 30 + Math.random() * 40; // seuraava tapahtuma 30-70 s päästä
    if (isBossLevel(level)) return; // ei tapahtumia pomokentissä
    const types = ['aurora', 'meteor', 'swarm', 'merchant'];
    // Valitse tapahtuma biominmukaan
    const available = biome.id === 'snow' ? ['aurora', 'swarm', 'meteor'] :
                      biome.id === 'river' ? ['swarm', 'meteor', 'merchant'] :
                      biome.id === 'volcano' ? ['meteor', 'swarm'] :
                      types;
    const type = available[Math.floor(Math.random() * available.length)];
    const pos = randomPos(120);
    fieldEvent = { type, x: pos.x, y: pos.y, timer: 0, maxTimer: 12 };
    if (type === 'aurora') {
      showBanner('🌌 Revontulet — saaliit ihmeissään!');
      fieldEvent.maxTimer = 10;
    } else if (type === 'meteor') {
      showBanner('☄️ Meteori toi jalokiviä! Bongaa törmäyspaikka!');
      fieldEvent.maxTimer = 18;
      fieldEvent.collected = false;
    } else if (type === 'swarm') {
      showBanner('🐰🐰 Saalislaumat kokoontuvat — kiirehdittävä!');
      fieldEvent.maxTimer = 14;
      // Lisää ylimääräisiä saaliita lähelle paikkaa
      for (let i = 0; i < 5; i++) {
        const kinds = biome.prey;
        const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 100;
        prey.push(new Prey(
          clamp(pos.x + Math.cos(a)*d, 50, world.width-50),
          clamp(pos.y + Math.sin(a)*d, 50, world.height-50),
          kinds[Math.floor(Math.random() * kinds.length)]
        ));
      }
    } else if (type === 'merchant') {
      showBanner('🛒 Vaelteleva kauppias! Mene hänen luokseen!');
      fieldEvent.maxTimer = 20;
      fieldEvent.helped = false;
    }
    Audio.play('skill');
  }

  function updateFieldEvent(dt) {
    if (!fieldEvent) return;
    fieldEvent.timer += dt;
    const fe = fieldEvent;
    if (fe.type === 'merchant' && !fe.helped) {
      if (Math.hypot(husky.x - fe.x, husky.y - fe.y) < 70) {
        fe.helped = true;
        // Kauppias antaa joko elämän, jalokiven tai XP:tä
        const r = Math.random();
        if (r < 0.33 && lives < maxLives) { lives++; updateHud(); showBanner('🛒 Kauppias antoi +1 ❤️!'); }
        else if (r < 0.66) { gemsFound++; updateHud(); showBanner('🛒 Kauppias antoi 💎 jalokiven!'); }
        else { huskyXp += 8; updateXpBar(); showBanner('🛒 Kauppias antoi +8 XP!'); }
        spawnBurst(fe.x, fe.y, ['#ffd700','#ff9a00','#fff'], 22);
        Audio.play('goldbone');
        fieldEvent = null; return;
      }
    } else if (fe.type === 'meteor' && !fe.collected) {
      if (Math.hypot(husky.x - fe.x, husky.y - fe.y) < 55) {
        fe.collected = true;
        const gem = GEMS[Math.floor(Math.random() * GEMS.length)];
        gemsFound++;
        huskyXp += gem.xp;
        spawnBurst(fe.x, fe.y, [gem.color, '#fff', '#ffe070'], 28);
        Audio.play('gem');
        showBanner(`☄️ ${gem.name} löytyi meteoriksesta! +${gem.xp} XP`);
        updateHud(); updateXpBar();
        fieldEvent = null; return;
      }
    } else if (fe.type === 'aurora') {
      // Revontulet: kaikki saaliit seisahtuvat (simuloidaan: älä päivitä niiden tekoälyä)
      // Tilanne hoidetaan drawFieldissä visuaalisesti — aika loppuu automaattisesti
    }
    if (fieldEvent && fe.timer >= fe.maxTimer) {
      fieldEvent = null;
      fieldEventTimer = 20 + Math.random() * 30;
    }
  }

  // --- Kalastus (Jokivarsi-biomi) ---
  function updateFishing(dt) {
    if (fishingSpots.length === 0) {
      for (let i = 0; i < 4; i++) {
        const p = randomPos(100);
        fishingSpots.push({ x: p.x, y: p.y, radius: 36, rechargeCd: 0 });
      }
    }

    if (isFishingActive) {
      // Pysäytä pelaaja paikoilleen kalastuksen ajaksi
      husky.vx = 0;
      husky.vy = 0;
      husky.moving = false;

      // Päivitä kalan tavoitepaikka ja sijainti dynaamisesti
      if (Math.random() < 0.038) {
        fishingFishTargetY = 0.15 + Math.random() * 0.7;
      }
      fishingFishY += (fishingFishTargetY - fishingFishY) * 3.8 * dt;

      // Päivitä tension-mittari (Space nostaa, painovoima vetää alas)
      fishingTension = Math.max(0, fishingTension - 0.72 * dt);
      if (Input.isSpaceHeld()) {
        fishingTension = Math.min(1.0, fishingTension + 1.35 * dt);
      }

      // Tarkista täsmäävätkö kala ja vihreä palkki (leveys 0.20)
      const isMatched = Math.abs(fishingFishY - fishingTension) <= 0.10;
      if (isMatched) {
        fishingSuccess = Math.min(100, fishingSuccess + 28 * dt);
        if (Math.random() < 0.22) {
          spawnBurst(husky.x + (Math.random() - 0.5) * 12, husky.y - 42, ['#80deea', '#ffffff'], 1);
        }
      } else {
        fishingSuccess = Math.max(0, fishingSuccess - 20 * dt);
      }

      // Minipelin lopputulos
      if (fishingSuccess >= 100) {
        isFishingActive = false;
        if (activeFishingSpot) {
          activeFishingSpot.rechargeCd = 12.0;
          spawnBurst(activeFishingSpot.x, activeFishingSpot.y, ['#7ad0ff', '#ffffff', '#c8f8ff'], 22);
        }
        
        fishCount++;
        shopData.achievements.fishCaughtCount = (shopData.achievements.fishCaughtCount || 0) + 1;
        checkAchievements();
        gainXp(12);
        progressQuest('cook_or_fish', 1);

        const dbl = Math.random() < 0.22;
        if (dbl) {
          fishCount++;
          shopData.ingredients.salmon = (shopData.ingredients.salmon || 0) + 2;
          showBanner('🎣 KAKSOISSAALIS! Pyydystit kaksi lohta! 🐟🐟');
          spawnBurst(husky.x, husky.y, ['#ffb74d', '#ffffff'], 18);
        } else {
          shopData.ingredients.salmon = (shopData.ingredients.salmon || 0) + 1;
          showBanner('🎣 Sait lohen! Voit paistaa sen nuotiolla ❤️ elämäksi!');
        }

        Audio.play('catch');
        saveShopData();
      } else if (fishingSuccess <= 0) {
        isFishingActive = false;
        if (activeFishingSpot) {
          activeFishingSpot.rechargeCd = 4.0;
          spawnBurst(activeFishingSpot.x, activeFishingSpot.y, ['#ffffff', '#b3e5fc'], 8);
        }
        showBanner('💨 Kala pääsi karkuun!');
        Audio.play('hurt');
      }
    } else {
      // Normaalitila: päivitä cd:t ja tarkista aloitus
      for (const fs of fishingSpots) {
        if (fs.rechargeCd > 0) {
          fs.rechargeCd -= dt;
          continue;
        }
        if (!husky.moving && Math.hypot(husky.x - fs.x, husky.y - fs.y) < fs.radius) {
          isFishingActive = true;
          fishingTension = 0.35;
          fishingFishY = 0.5;
          fishingSuccess = 35;
          activeFishingSpot = fs;
          fishingFishTargetY = 0.55;
          showBanner('🎣 KALA KIINNI! Pidä kala vihreän palkin kohdalla painamalla välilyöntiä! ⌨️');
          Audio.play('skill');
          break;
        }
      }
    }
  }

  // --- Jokivarsi-biomi: jokiesteet (vesiväylät) generateObstacles kutsuttuna ---
  function generateRiverObjects() {
    const rivers = [];
    // 2-3 jokiväylää
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      // Pysty- tai vaakasuuntainen joki
      const vertical = Math.random() < 0.5;
      const cx = 200 + Math.random() * (world.width - 400);
      const cy = 200 + Math.random() * (world.height - 400);
      const len = 300 + Math.random() * 400;
      rivers.push({ x: cx, y: cy, len, vertical, width: 60 + Math.random() * 40 });
    }
    return rivers;
  }

  // Yhteinen apu: kerää luut (ja aarrekartta) huskyn tai kaverin ympäriltä
  function collectBones(dt) {
    for (const c of collectibles) {
      if (c.collected) continue;
      
      const dPlayer = Math.hypot(husky.x - c.x, husky.y - c.y);
      const dComp = companion ? Math.hypot(companion.x - c.x, companion.y - c.y) : Infinity;
      
      let collectionBonus = 0;
      if (shopData.unlockedStamps && shopData.unlockedStamps['Egypti 🇪🇬']) {
        collectionBonus += 18; // 18px magnet/collection radius increase!
      }
      if (shopData.unlockedStamps && shopData.unlockedStamps['Australia 🇦🇺']) {
        collectionBonus += 14; // Bumerangin heijastama noutosäde
      }
      if (shopData.activePuppy === 'lumi') {
        collectionBonus += 16; // Lumin tarkka vainu laajentaa keräyssädettä
      }
      if (shopData.talents && shopData.talents.magnet) {
        collectionBonus += shopData.talents.magnet * 22; // Luumagneetti talent
      }
      if (dPlayer < husky.radius + c.radius + collectionBonus || dComp < companion.radius + c.radius + collectionBonus) {
        c.collected = true;
        if (companion && dComp < companion.radius + c.radius && dPlayer >= husky.radius + c.radius) {
          spawnTextParticle(companion.x, companion.y - 12, "NOUTI! 🦴", "#a0a0ff");
        }
        if (c.isQuest) {
          if (!shopData.completedQuests) shopData.completedQuests = {};
          shopData.completedQuests[c.countryName] = true;
          shopData.totalGems += 10;
          saveShopData();
          spawnBurst(c.x, c.y, ['#ffdf00', '#ffffff', '#00e5ff'], 32);
          spawnTextParticle(c.x, c.y, "HAASTE SUORITETTU! 🏆 +10 💎", "#ffd700", "bold 15px sans-serif");
          showBanner(`🏆 Haaste suoritettu: ${c.questName}!`);
          Audio.play('legendary');
          updateHud();
        } else if (c.star) {
          shopData.totalGems += 3;
          gainXp(35);
          spawnBurst(c.x, c.y, ['#00e5ff', '#ffffff', '#ffd700'], 28);
          spawnTextParticle(c.x, c.y, "TÄHTISIRU! 🌠 +3 💎 +35 XP", "#ffd700", "bold 13px sans-serif");
          Audio.play('gem');
          showBanner('🌠 Keräsit pudonneen tähtisirun! +3 💎');
          saveShopData();
          updateHud();
        } else if (c.gem) {
          gemsFound++;
          spawnBurst(c.x, c.y, [c.color, '#fff', '#ffe070'], 22);
          spawnTextParticle(c.x, c.y, "+1 Jalokivi! 💎", "#00e5ff");
          Audio.play('gem');
          showBanner('💎 Löysit jalokiven!');
          updateHud();
        } else if (c.map) {
          // ~30 % kartoista on aarreketju (2–3 vihjettä, lopussa legenda)
          const steps = Math.random() < 0.3 ? 2 + Math.floor(Math.random() * 2) : 1;
          revealDigSpot(steps);
          spawnBurst(c.x, c.y, ['#e8d8a0', '#fff', '#c8a060'], 14);
          spawnTextParticle(c.x, c.y, "KARTTA! 🗺️", "#ffb74d");
          Audio.play('map');
        } else if (c.honey) {
          gainXp(40);
          spawnBurst(c.x, c.y, ['#ffb300', '#ffd54f', '#ffffff'], 24);
          spawnTextParticle(c.x, c.y, "+40 XP! 🍯", "#ffb300");
          Audio.play('legendary');
          showBanner('🍯 Makea hunaja antoi +40 XP!');
          shopData.ingredients.honey = (shopData.ingredients.honey || 0) + 1;
          saveShopData();
        } else if (c.feather) {
          gainXp(15);
          const getGems = Math.random() < 0.6;
          if (getGems) {
            gemsFound += 2;
            spawnTextParticle(c.x, c.y, "+15 XP & +2 💎 🪶", "#e040fb");
          } else {
            spawnTextParticle(c.x, c.y, "+15 XP! 🪶", "#e040fb");
          }
          spawnBurst(c.x, c.y, ['#e040fb', '#f3e5f5', '#ffffff'], 16);
          Audio.play('artifact');
          showBanner('🪶 Keräsit hohtavan sulan!');
          shopData.ingredients.feather = (shopData.ingredients.feather || 0) + 1;
          saveShopData();
          updateHud();
        } else {
          gainXp(c.gold ? 6 : 2);
          spawnBurst(c.x, c.y,
            c.gold ? ['#ffe680', '#ffd24a', '#fff'] : ['#fff', '#e8e0d0'],
            c.gold ? 18 : 10);
          Audio.play(c.gold ? 'goldbone' : 'bone');
        }
      }
    }
    collectibles = collectibles.filter((c) => !c.collected);
  }

  function shatterIceBlock(o, isMelted = false) {
    Audio.play(isMelted ? 'gem' : 'hurt');
    Audio.play('legendary');
    
    spawnBurst(o.x, o.y, isMelted ? ['#80deea', '#ffffff'] : ['#80deea', '#b2ebf2', '#ffffff'], 26);
    
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 15 + Math.random() * 20;
      const type = Math.random() < 0.4 ? 'gem' : 'bone';
      
      collectibles.push({
        x: o.x + Math.cos(a) * d,
        y: o.y + Math.sin(a) * d,
        radius: 9,
        collected: false,
        gem: type === 'gem',
        color: '#00e5ff',
        gold: type !== 'gem' && Math.random() < 0.3
      });
    }
    
    obstacles = obstacles.filter(x => x !== o);
    showBanner(isMelted ? '🧊 Jäälohkare suli! Sait aarteet talteen!' : '🧊 Jäälohkare murtui! Sait aarteet talteen!');
  }

  function shatterCrystalShard(o) {
    Audio.play('gem');
    spawnBurst(o.x, o.y, ['#9b5de5', '#00f0ff', '#ffffff'], 24);
    
    const count = Math.random() < 0.35 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 12 + Math.random() * 15;
      collectibles.push({
        x: o.x + Math.cos(a) * d,
        y: o.y + Math.sin(a) * d,
        radius: 9,
        collected: false,
        gem: true,
        color: '#00e5ff'
      });
    }
    
    obstacles = obstacles.filter(x => x !== o);
    showBanner('💎 Kristallirykelmä murtui! Sait jalokiviä!');
  }

  // --- Aarrejahti: kartta merkitsee kaivuupaikan, jonka päältä kaivaa jalokiven ---
  const GEMS = [
    { name: 'Rubiini', emoji: '💎', color: '#ff4a6a', xp: 10 },
    { name: 'Smaragdi', emoji: '💚', color: '#3ad48a', xp: 10 },
    { name: 'Safiiri', emoji: '💙', color: '#4a9aff', xp: 10 },
    { name: 'Timantti', emoji: '💠', color: '#bfeaff', xp: 16 },
  ];

  // --- Muinaisesineet: harvinaisia reliikkejä, jotka avaavat pysyvän erikoiskyvyn ---
  const ARTIFACTS = [
    { id: 'feather', name: 'Tuulensulka', emoji: '🪶', desc: '+25 % nopeus',
      apply: (p) => { p.speedMul *= 1.25; } },
    { id: 'crystal', name: 'Näkijän kristalli', emoji: '🔮', desc: 'Pedot huomaavat sinut paljon lähempää',
      apply: (p) => { p.detectionMul *= 0.7; } },
    { id: 'amulet', name: 'Kuun amuletti', emoji: '🌙', desc: 'Voimakas ulvonta',
      apply: (p) => { p.hasHowl = true; p.howlPower += 2; } },
    { id: 'shield', name: 'Muinainen kilpi', emoji: '🛡️', desc: 'Torjuu yhden osuman, latautuu uudelleen',
      apply: (p) => { p.hasShield = true; } },
  ];

  // Myönnä satunnainen vielä hankkimaton artefakti. Palauttaa true jos jokin myönnettiin.
  function grantArtifact(x, y) {
    const available = ARTIFACTS.filter((a) => !artifactsOwned.includes(a.id));
    if (available.length === 0) return false;
    const art = available[Math.floor(Math.random() * available.length)];
    art.apply(perks);
    artifactsOwned.push(art.id);
    if (art.id === 'shield') { husky.shieldReady = true; husky.shieldCd = 0; }
    spawnBurst(x, y, ['#ffd24a', '#bf9bff', '#fff', '#7ad0ff'], 36);
    shakeTimer = Math.max(shakeTimer, 0.25);
    showBanner(`${art.emoji} MUINAISESINE: ${art.name}! ${art.desc}`);
    Audio.play('artifact');
    renderPerks();
    updateHud();
    return true;
  }

  // Arvo kaivuupaikan sijainti: kauas huskysta, pois rakennuksista ja muista paikoista
  function randomDigPos() {
    for (let attempt = 0; attempt < 40; attempt++) {
      const p = randomPos(90);
      if (Math.hypot(p.x - husky.x, p.y - husky.y) < 250) continue;
      if (structures.some((s) => Math.hypot(p.x - s.x, p.y - s.y) < 120)) continue;
      if (digSpots.some((d) => Math.hypot(p.x - d.x, p.y - d.y) < 170)) continue;
      return p;
    }
    return randomPos(90);
  }

  // Paljasta kaivuupaikka. steps>1 = aarreketju (joka kaivu paljastaa seuraavan, lopussa legenda)
  function revealDigSpot(steps = 1) {
    const p = randomDigPos();
    digSpots.push({ x: p.x, y: p.y, progress: 0, step: 1, totalSteps: steps });
    showBanner(steps > 1 ? `🗺️ Aarreketju alkoi! Vihje 1/${steps}` : '📜 Aarrekartta! Etsi ❌ ja kaiva');
  }

  // Kaivaminen: kun husky seisoo ❌:n päällä, edistyminen kasvaa. Tukee useita paikkoja & ketjuja.
  function updateDigging(dt) {
    let done = null;
    for (const d of digSpots) {
      if (Math.hypot(husky.x - d.x, husky.y - d.y) < DIG_RADIUS) {
        d.progress += dt;
        if (Math.random() < 0.4) {
          spawnBurst(d.x + (Math.random() - 0.5) * 20, d.y + 10, ['#6b4a2a', '#4a3018', '#8a6038'], 2);
        }
        if (d.progress % 0.5 < dt) Audio.play('dig');
        if (d.progress >= DIG_TIME) { done = d; break; }
      }
    }
    if (!done) return;
    digSpots = digSpots.filter((d) => d !== done);
    shopData.achievements.treasuresDugCount = (shopData.achievements.treasuresDugCount || 0) + 1;

    // Mahdollisuus löytää muinainen esihistoriallinen fossiili
    if (shopData.fossils && typeof FOSSILS_DATA !== 'undefined') {
      const missingFossils = FOSSILS_DATA.filter(f => !shopData.fossils[f.id]);
      if (missingFossils.length > 0 && Math.random() < 0.35) {
        const foundFossil = missingFossils[Math.floor(Math.random() * missingFossils.length)];
        shopData.fossils[foundFossil.id] = true;
        saveShopData();
        Audio.play('legendary');
        spawnBurst(done.x, done.y, ['#ffb74d', '#ffd54f', '#ffffff', '#8d6e63'], 36);
        spawnTextParticle(done.x, done.y - 24, `FOSSIILILÖYTÖ! ${foundFossil.icon} ${foundFossil.name}`, '#ffd54f', 'bold 14px sans-serif');
        showBanner(`🦖 LÖYSIT HARVINAISEN FOSSIILIN: ${foundFossil.name}! Vitriinisi laajenee!`);
      }
    }

    checkAchievements();
    progressQuest('dig', 1);

    if (done.step < done.totalSteps) {
      // Ketju jatkuu: pieni palkkio + seuraava vihje uuteen paikkaan
      gainXp(4);
      spawnBurst(done.x, done.y, ['#e8d8a0', '#fff', '#c8a060'], 16);
      showBanner(`🔎 Vihje ${done.step}/${done.totalSteps} kaivettu — seuraava ❌ ilmestyi!`);
      Audio.play('clue');
      const p = randomDigPos();
      digSpots.push({ x: p.x, y: p.y, progress: 0, step: done.step + 1, totalSteps: done.totalSteps });
    } else if (done.totalSteps > 1) {
      // Ketjun pää: LEGENDAARINEN aarre, joka kätkee muinaisesineen (jos jäljellä)
      gemsFound++;
      spawnTextParticle(done.x, done.y, "+1 Jalokivi! 💎", "#00e5ff");
      gainXp(30);
      maxLives++; lives++;
      spawnBurst(done.x, done.y, ['#ffd24a', '#fff', '#ff4a6a', '#4a9aff', '#3ad48a'], 44);
      shakeTimer = 0.3;
      Audio.play('legendary');
      updateHud();
      if (!grantArtifact(done.x, done.y)) {
        showBanner('👑 LEGENDAARINEN AARRE! +30 XP & ❤️');
      }
    } else {
      // Tavallinen jalokivi (pieni mahdollisuus muinaisesineeseen)
      const gem = GEMS[Math.floor(Math.random() * GEMS.length)];
      gemsFound++;
      spawnTextParticle(done.x, done.y, "+1 Jalokivi! 💎", "#00e5ff");
      gainXp(gem.xp);
      spawnBurst(done.x, done.y, [gem.color, '#fff', '#ffe070'], 26);
      Audio.play('gem');
      updateHud();
      if (Math.random() < 0.1 && grantArtifact(done.x, done.y)) {
        // artefakti löytyi & näytti bannerin
      } else {
        showBanner(`💎 ${gem.name} kaivettu maasta!`);
      }
    }
  }

  function update(dt) {
    if (['field', 'island'].includes(scene)) {
      dayTime = (dayTime + dt / 180) % 1.0;
    }
    if (scene === 'interior') { updateInterior(dt); return; }
    if (scene === 'dungeon')  { updateDungeon(dt);  return; }
    if (scene === 'island')   { updateIsland(dt);   return; }
    if (scene === 'treasure') { updateTreasure(dt); return; }
    if (scene === 'agility')  { updateAgility(dt);  return; }
    updateField(dt);
  }

  // Sisätila: aarrehuone (talot turvallisia, kolot voivat sisältää ansoja)
  function updateInterior(dt) {
    if (interiorExitCooldown > 0) interiorExitCooldown -= dt;
    if (currentSeason === 'winter') {
      if (interior.kind === 'house') {
        const nearFireplace = Math.hypot(husky.x - 380, husky.y - 120) < 85;
        const rate = nearFireplace ? 25 : 12;
        bodyTemp = Math.min(100, bodyTemp + dt * rate);
      } else {
        bodyTemp = Math.min(50, bodyTemp + dt * 8);
      }
    } else if (currentSeason === 'summer') {
      bodyTemp = Math.max(50, bodyTemp - dt * 10);
    } else {
      if (bodyTemp < 50) bodyTemp = Math.min(50, bodyTemp + dt * 10);
      else if (bodyTemp > 50) bodyTemp = Math.max(50, bodyTemp - dt * 10);
    }

    perks.isOverheating = (currentSeason === 'summer' && bodyTemp >= 100);

    const dir = Input.getDirection();
    husky.update(dt, dir, interior.world, interior.walls, perks, Input.isSprinting(), currentSeason);
    
    if (companion) {
      companion.update(dt, husky, [], interior.world, interior.walls);

    // Päivitä aktiivinen pentukaveri sisätiloissa / takapihalla
    if (shopData.activePuppy && shopData.puppies && shopData.puppies[shopData.activePuppy]) {
      if (!activePuppyFollower) {
        activePuppyFollower = {
          x: husky.x - 24, y: husky.y - 24, radius: 10,
          kind: 'puppy', puppyType: shopData.activePuppy,
          animPhase: 0, flip: 1, moving: false
        };
      }
      activePuppyFollower.puppyType = shopData.activePuppy;
      const targetX = husky.x - Math.cos(husky.rotation || 0) * 30;
      const targetY = husky.y - Math.sin(husky.rotation || 0) * 30;
      const dist = Math.hypot(targetX - activePuppyFollower.x, targetY - activePuppyFollower.y);
      if (dist > 18) {
        const angle = Math.atan2(targetY - activePuppyFollower.y, targetX - activePuppyFollower.x);
        const pupSpeed = (dist > 75) ? 250 : 175;
        activePuppyFollower.x += Math.cos(angle) * pupSpeed * dt;
        activePuppyFollower.y += Math.sin(angle) * pupSpeed * dt;
        activePuppyFollower.flip = Math.cos(angle) < 0 ? -1 : 1;
        activePuppyFollower.animPhase += dt * 14;
        activePuppyFollower.moving = true;
      } else {
        activePuppyFollower.moving = false;
      }
    } else {
      activePuppyFollower = null;
    }
    }
    Input.consumeHowl(); // kuluta painallus ettei laukea heti ulkona
    updateEffects(dt);
    collectBones(dt);
    Audio.setTension(0);
    if (invulnTimer > 0) invulnTimer -= dt;

    // Mökin tulisija (fireplace)
    if (interior.kind === 'house' && shopData.cabinUpgrades.fireplace > 0) {
      if (Math.hypot(husky.x - 380, husky.y - 120) < 65) {
        if (fireplaceHealTimer <= 0) {
          if (lives < maxLives) {
            lives++;
            updateHud();
            spawnBurst(380, 120, ['#ff4a00', '#ffd700', '#ff9ab0'], 14);
            Audio.play('goldbone');
            showBanner('🔥 Tulisijan lämpö paransi sinua! +1 ❤️');
          }
          fireplaceHealTimer = shopData.cabinUpgrades.fireplace === 2 ? 1.2 : 2.4;
        } else {
          fireplaceHealTimer -= dt;
        }
      }
    }

    // Läheisyystunnistukset
    nearCabinet = (interior.kind === 'house' && shopData.cabinUpgrades.trophyWall && Math.hypot(husky.x - 163, husky.y - 170) < 65);
    nearGramophone = (interior.kind === 'house' && shopData.cabinUpgrades.gramophone && Math.hypot(husky.x - 480, husky.y - 95) < 65);
    nearPlaque = (interior.kind === 'house' && shopData.cabinUpgrades.achievementsPlaque && Math.hypot(husky.x - 260, husky.y - 120) < 65);
    nearCookingPot = (interior.kind === 'house' && Math.hypot(husky.x - 425, husky.y - 120) < 65);
    nearPlanter = (interior.kind === 'house' && shopData.cabinUpgrades.planterPots && Math.hypot(husky.x - 320, husky.y - 120) < 65);
    nearDiploma = (interior.kind === 'house' && Math.hypot(husky.x - 350, husky.y - 100) < 55);
    nearFossils = (interior.kind === 'house' && Math.hypot(husky.x - 200, husky.y - 110) < 60);
    nearBackdoor = (interior.kind === 'house' && Math.hypot(husky.x - 620, husky.y - 85) < 55);
    nearQuestBoard = (interior.kind === 'house' && Math.hypot(husky.x - 540, husky.y - 100) < 55);

    nearCampfire = (interior.kind === 'backyard' && Math.hypot(husky.x - 380, husky.y - 240) < 55);
    nearTent = (interior.kind === 'backyard' && Math.hypot(husky.x - 180, husky.y - 180) < 55);
    nearTelescope = (interior.kind === 'backyard' && Math.hypot(husky.x - 580, husky.y - 180) < 55);
    nearAgility = (interior.kind === 'backyard' && Math.hypot(husky.x - 180, husky.y - 370) < 55);
    nearWishingWell = (interior.kind === 'backyard' && Math.hypot(husky.x - 580, husky.y - 370) < 55);
    nearPuppyNursery = (interior.kind === 'backyard' && Math.hypot(husky.x - 380, husky.y - 110) < 65);

    nearFriend = null;
    if (interior.kind === 'backyard' && interior.friends) {
      let minDist = 50;
      for (const f of interior.friends) {
        const d = Math.hypot(husky.x - f.x, husky.y - f.y);
        if (d < minDist) {
          minDist = d;
          nearFriend = f;
        }
      }
    }

    if (activeFriendSpeech) {
      activeFriendSpeech.timer -= dt;
      if (activeFriendSpeech.timer <= 0) activeFriendSpeech = null;
    }

    // E-näppäimen kuuntelu laitteille
    const hasE = Input.consumeDash();
    if (hasE) {
      if (nearCabinet) {
        openCabinet();
      } else if (nearGramophone) {
        openGramophone();
      } else if (nearPlaque) {
        openAchievementsModal();
      } else if (nearCookingPot) {
        openCookingModal();
      } else if (nearPlanter) {
        openGardenModal();
      } else if (nearDiploma) {
        openTalentsModal();
      } else if (nearFossils) {
        openFossilsModal();
      } else if (nearBackdoor) {
        enterBackyard(interior.struct);
      } else if (nearQuestBoard) {
        openQuestsModal();
      } else if (nearCampfire) {
        feedCampfire();
      } else if (nearTent) {
        restInTent();
      } else if (nearTelescope) {
        useTelescope();
      } else if (nearAgility) {
        startAgilityCourse();
      } else if (nearWishingWell) {
        openWishingWellModal();
      } else if (nearPuppyNursery) {
        openPuppiesModal();
      } else if (nearFriend) {
        interactWithFriend(nearFriend);
      }
    }

    // Astuminen suoraan takaovesta takapihalle
    if (interior.kind === 'house' && interiorExitCooldown <= 0 && Math.hypot(husky.x - 620, husky.y - 80) < 30) {
      enterBackyard(interior.struct);
    }

    // Nikkarointipöytä (workbench)
    if (interior.kind === 'house' && Math.hypot(husky.x - 160, husky.y - 320) < 38) {
      if (cabinOverlay.classList.contains('hidden')) {
        openCabinUpgrades();
      }
    }

    // Ystävällinen NPC: auttaa kerran (paranna jos vahinkoa, muuten luita)
    const npc = interior.npc;
    if (npc && !npc.helped &&
        Math.hypot(husky.x - npc.x, husky.y - npc.y) < husky.radius + npc.radius + 6) {
      npc.helped = true;
      interior.struct.npcHelped = true;
      spawnBurst(npc.x, npc.y, ['#ff9ab0', '#fff', '#aef0ae'], 16);
      Audio.play('goldbone');
      if (lives < maxLives) {
        lives++;
        showBanner('🐰 Ystävä auttoi! +1 ❤️');
      } else {
        huskyXp += 5;
        updateXpBar();
        showBanner('🐰 Ystävä antoi luita!');
      }
      updateHud();
    }

    // Ansat: piikit satuttavat (kolot)
    if (invulnTimer <= 0) {
      for (const tr of interior.traps) {
        if (Math.hypot(husky.x - tr.x, husky.y - tr.y) < husky.radius + tr.radius * 0.55) {
          if (hurtHusky(tr.x, tr.y)) { gameOver(); return; }
          break;
        }
      }
    }

    // Huskyn taso voi nousta luita keräämällä sisälläkin
    if (huskyXp >= xpToNext) { offerSkill(); if (!running) return; }

    // Uloskäynti (ovi)
    const ex = interior.exit;
    if (interiorExitCooldown <= 0 && Math.hypot(husky.x - ex.x, husky.y - ex.y) < husky.radius + ex.r) {
      if (interior.kind === 'backyard') {
        enterHouseFromBackyard(interior.struct);
      } else {
        exitInterior();
      }
    }
  }

  function updateField(dt) {
    updateEnvironmentalObjects(dt);

    // --- Lelun heitto Q-näppäimestä ---
    husky.throwCd = (husky.throwCd || 0) - dt;
    if (Input.consumeThrow() && husky.throwCd <= 0) {
      husky.throwCd = 1.6;
      const angle = husky.facing || 0;
      const speed = 420;
      Audio.play('tick');
      thrownToys.push({
        x: husky.x,
        y: husky.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 7,
        bounceCount: 0,
        maxBounces: 3,
        life: 5.0
      });
      spawnTextParticle(husky.x, husky.y - 12, "HEITTO! 🎾", "#a2e85a");
    }

    // --- Heitettyjen lelu fysiikat ja bounssit ---
    for (const toy of thrownToys) {
      toy.x += toy.vx * dt;
      toy.y += toy.vy * dt;
      
      toy.vx *= 0.95;
      toy.vy *= 0.95;
      
      if (toy.x < 15 || toy.x > world.width - 15) {
        toy.vx *= -0.75;
        toy.x = clamp(toy.x, 15, world.width - 15);
        toy.bounceCount++;
        Audio.play('tick');
      }
      if (toy.y < 15 || toy.y > world.height - 15) {
        toy.vy *= -0.75;
        toy.y = clamp(toy.y, 15, world.height - 15);
        toy.bounceCount++;
        Audio.play('tick');
      }
      
      for (const o of obstacles) {
        if (o.solid && Math.hypot(toy.x - o.x, toy.y - o.y) < toy.radius + o.radius) {
          const dx = toy.x - o.x;
          const dy = toy.y - o.y;
          const d = Math.hypot(dx, dy) || 1;
          toy.vx = (dx / d) * Math.hypot(toy.vx, toy.vy) * 0.72;
          toy.vy = (dy / d) * Math.hypot(toy.vx, toy.vy) * 0.72;
          toy.x = o.x + (dx / d) * (toy.radius + o.radius + 2);
          toy.y = o.y + (dy / d) * (toy.radius + o.radius + 2);
          toy.bounceCount++;
          Audio.play('tick');
        }
      }
      
      toy.life -= dt;
      
      if (Math.abs(toy.vx) + Math.abs(toy.vy) > 12 && Math.random() < 0.15) {
        spawnBurst(toy.x, toy.y, ['#a2e85a', '#ffffff'], 1);
      }
    }
    thrownToys = thrownToys.filter(t => t.life > 0 && t.bounceCount < t.maxBounces + 3);
    // --- Jäälohkareiden sulaminen nuotion läheisyydessä ---
    if (typeof obstacles !== 'undefined' && currentSeason === 'winter') {
      for (const o of [...obstacles]) {
        if (o.type === 'ice_block') {
          let nearCampfire = false;
          for (const other of obstacles) {
            if (other.type === 'campfire' && Math.hypot(o.x - other.x, o.y - other.y) < 85) {
              nearCampfire = true;
              break;
            }
          }
          if (nearCampfire) {
            o.meltTimer = (o.meltTimer || 0) + dt;
            if (Math.random() < 0.18) {
              spawnBurst(o.x, o.y + (Math.random() - 0.5) * o.radius, ['#ffffff', '#80deea'], 1);
            }
            if (o.meltTimer >= 2.5) {
              shatterIceBlock(o, true);
            }
          }
        }
      }
    }

    let nearFire = false;
    if (typeof obstacles !== 'undefined') {
      for (const o of obstacles) {
        if (o.type === 'campfire' && Math.hypot(husky.x - o.x, husky.y - o.y) < 65) {
          nearFire = true;
          break;
        }
      }
    }

    if (nearFire) {
      if (currentSeason === 'winter') {
        bodyTemp = Math.min(100, bodyTemp + dt * 18);
        if (Math.random() < 0.12) spawnBurst(husky.x, husky.y, ['#ffaa00', '#ffd700'], 1);
      }
      
      // Lohen paistaminen nuotiolla (Huskyn täytyy olla paikoillaan)
      if (fishCount > 0 && !husky.moving) {
        cookingProgress += dt;
        if (cookingProgress >= COOK_TIME) {
          cookingProgress = 0;
          fishCount--;
          lives = Math.min(maxLives, lives + 1);
          showBanner('🍳 Lohta paistettu nuotiolla! Sait ❤️ lisäelämän!');
          Audio.play('legendary');
          spawnBurst(husky.x, husky.y, ['#ff7043', '#ffe0b2', '#ffffff'], 20);
          spawnTextParticle(husky.x, husky.y - 12, "+1 Elämä! ❤️", "#ff1744");
          updateHud();
        }
      } else {
        cookingProgress = 0;
      }
    } else {
      cookingProgress = 0;
    }

    if (currentSeason === 'winter') {
      if (!nearFire) {
        const hasTamedBeaver = prey.some(p => p.alive && p.tamed && p.kind === 'beaver');
        const talentRes = (shopData.talents && shopData.talents.stamina) ? (1 - shopData.talents.stamina * 0.25) : 1.0;
        const norwayRes = (shopData.unlockedStamps && shopData.unlockedStamps['Norja 🇳🇴']) ? 0.75 : 1.0;
        const rateScale = (hasTamedBeaver ? 0.6 : 1.0) * talentRes * norwayRes;
        bodyTemp = Math.max(0, bodyTemp - dt * (weather === 'blizzard' ? 2.8 : 1.4) * rateScale);
      }
      if (bodyTemp <= 0) {
        freezeDmgTimer -= dt;
        if (freezeDmgTimer <= 0) {
          if (hurtHusky(husky.x, husky.y, 'freeze')) {
            gameOver();
            return;
          }
          freezeDmgTimer = 5.0;
          showBanner('❄️ Palellutit! Lämpötilasi on 0°! Etsi nuotio!');
          Audio.play('hurt');
        }
      } else {
        freezeDmgTimer = 0;
      }
    } else if (currentSeason === 'summer') {
      if (husky.inWater) {
        bodyTemp = Math.max(50, bodyTemp - dt * 14);
      } else {
        const talentRes = (shopData.talents && shopData.talents.stamina) ? (1 - shopData.talents.stamina * 0.25) : 1.0;
        bodyTemp = Math.min(100, bodyTemp + dt * (weather === 'sandstorm' ? 2.4 : 1.2) * talentRes);
      }
    } else {
      if (bodyTemp < 50) bodyTemp = Math.min(50, bodyTemp + dt * 10);
      else if (bodyTemp > 50) bodyTemp = Math.max(50, bodyTemp - dt * 10);
    }

    perks.isOverheating = (currentSeason === 'summer' && bodyTemp >= 100);

    let dir = Input.getDirection();
    if (confusionTimer > 0) {
      dir = { x: -dir.x, y: -dir.y };
    }

    let origSpeedMul = perks.speedMul || 1.0;
    if (shopData.talents && shopData.talents.speed) {
      origSpeedMul *= (1 + shopData.talents.speed * 0.08);
    }
    if (shopData.activePuppy === 'kipina') {
      origSpeedMul *= 1.06; // Kipinän vauhtitassu antaa +6% perusnopeutta
    }
    if (speedBoostTimer > 0) {
      perks.speedMul = origSpeedMul * 1.25;
    } else {
      perks.speedMul = origSpeedMul;
    }

    husky.update(dt, dir, world, obstacles, perks, Input.isSprinting(), currentSeason);
    
    perks.speedMul = origSpeedMul;

    if (companion) {
      const baseSpd = 210 + ((shopData.cabinUpgrades.doghouse || 0) * 40);
      companion.speed = baseSpd * (companion.petBoostTimer > 0 ? 1.55 : 1.0);

      // Silittely-mekaniikka (Huskyn täytyy seistä lähellä paikoillaan)
      const distToComp = Math.hypot(husky.x - companion.x, husky.y - companion.y);
      if (distToComp < 42 && !husky.moving) {
        petTimer += dt;
        if (petTimer >= 1.5) {
          petTimer = 0;
          Audio.play('pet');
          spawnTextParticle(companion.x, companion.y - 12, "RAKASTAA! ❤️", "#ff4081");
          spawnBurst(companion.x, companion.y, ['#ff4081', '#ff80ab', '#ffffff'], 18);
          companion.petBoostTimer = 5.0;
        }
      } else {
        petTimer = 0;
      }

      if (thrownToys.length > 0) {
        const targetToy = thrownToys[0];
        const distToToy = Math.hypot(companion.x - targetToy.x, companion.y - targetToy.y);
        if (distToToy < companion.radius + targetToy.radius + 12) {
          targetToy.life = 0;
          spawnTextParticle(companion.x, companion.y - 12, "NOUTI! 🎾🐕", "#ffd700");
          Audio.play('goldbone');
          
          const multiplier = 1.3;
          perks.speedMul = (perks.speedMul || 1.0) * multiplier;
          showBanner('🎾 NOUTOLEIKKI! Innostus antoi +30 % nopeutta!');
          spawnTextParticle(husky.x, husky.y - 15, "INNOSTUS! 🐾🎾", "#ffd700");
          setTimeout(() => {
            perks.speedMul /= multiplier;
          }, 3000);
          
          companion.vx = 0;
          companion.vy = 0;
        } else {
          const angle = Math.atan2(targetToy.y - companion.y, targetToy.x - companion.x);
          companion.vx = Math.cos(angle) * companion.speed * 1.35;
          companion.vy = Math.sin(angle) * companion.speed * 1.35;
          companion.x += companion.vx * dt;
          companion.y += companion.vy * dt;
          companion.moving = true;
          companion.animPhase += dt * 14;
          companion.facing = angle;
        }
      } else {
        companion.update(dt, husky, prey, world, obstacles, collectibles);

    // Päivitä aktiivinen pentukaveri seikkailukentällä
    if (shopData.activePuppy && shopData.puppies && shopData.puppies[shopData.activePuppy]) {
      if (!activePuppyFollower) {
        activePuppyFollower = {
          x: husky.x - 24, y: husky.y - 24, radius: 10,
          kind: 'puppy', puppyType: shopData.activePuppy,
          animPhase: 0, flip: 1, moving: false
        };
      }
      activePuppyFollower.puppyType = shopData.activePuppy;
      const targetX = husky.x - Math.cos(husky.rotation || 0) * 30;
      const targetY = husky.y - Math.sin(husky.rotation || 0) * 30;
      const dist = Math.hypot(targetX - activePuppyFollower.x, targetY - activePuppyFollower.y);
      if (dist > 18) {
        const angle = Math.atan2(targetY - activePuppyFollower.y, targetX - activePuppyFollower.x);
        const pupSpeed = (dist > 75) ? 250 : 175;
        activePuppyFollower.x += Math.cos(angle) * pupSpeed * dt;
        activePuppyFollower.y += Math.sin(angle) * pupSpeed * dt;
        activePuppyFollower.flip = Math.cos(angle) < 0 ? -1 : 1;
        activePuppyFollower.animPhase += dt * 14;
        activePuppyFollower.moving = true;
      } else {
        activePuppyFollower.moving = false;
      }
    } else {
      activePuppyFollower = null;
    }
      }
      for (const p of prey) {
        if (!p.alive) continue;
        const reach = companion.radius + p.radius;
        if (Math.hypot(companion.x - p.x, companion.y - p.y) < reach) {
          p.alive = false;
          shopData.achievements.caughtCount = (shopData.achievements.caughtCount || 0) + 1;
          progressQuest('catch', 1);
          if (p.elite) progressQuest('mythical', 1);

          if (!shopData.discovered) shopData.discovered = {};
          if (!shopData.discovered[p.kind]) {
            shopData.discovered[p.kind] = true;
            showBanner(`📖 Bestiarium: ${preyEmoji(p.kind)} ${preyFinnish(p.kind)} löydetty!`);
            saveShopData();
          }

          if (p.elite) {
            gemsFound += 2;
            shopData.totalGems += 2;
            if (!shopData.stats) shopData.stats = {};
            shopData.stats.mythicalsCaught = (shopData.stats.mythicalsCaught || 0) + 1;
            saveShopData();
            checkAchievements();
            spawnTextParticle(p.x, p.y, "MYYTTINEN! 🦄✨ +2 💎", "#ff00ff");
            showBanner(`☄️ Kaverisi nappasi Myyttisen eläimen: ${preyFinnish(p.kind)}! Sait +2 💎!`);
            Audio.play('legendary');
            spawnBurst(p.x, p.y, [p.eliteColor, '#ffffff', '#ffd700'], 36);
          } else {
            checkAchievements();
          }

          if (p.kind === 'golden_squirrel') {
            gemsFound++;
            spawnTextParticle(p.x, p.y, "KULTA-ORAVA! 💎", "#ffd700");
            showBanner('🐕 Kaverisi nappasi Kultaisen Oravan! Sait 💎 Jalokiven!');
            Audio.play('gem');
            spawnBurst(p.x, p.y, ['#ffd700', '#ffa000', '#ffffff'], 24);
            
            let sqPts = 5;
            if (p.elite) sqPts *= 3;
            score += sqPts;
            caughtThisLevel++;
            huskyXp += sqPts;
          } else {
            let pts = 1;
            if (p.elite) pts *= 3;
            score += pts;
            caughtThisLevel++;
            huskyXp += pts;
            spawnBurst(p.x, p.y, ['#fff', '#ffe690', '#c8b490'], 14);
            Audio.play('catch');
            showBanner('🐕 Kaverisi nappasi saaliin!');
          }
          updateHud();
          updateXpBar();
        }
      }
    } else {
      petTimer = 0;
    }

    // Päivitä eksynyt huskypentu
    if (lostPuppy) {
      if (!lostPuppy.following) {
        lostPuppy.shiverX = Math.sin(gameTime * 25) * 0.4;
        if (Math.hypot(husky.x - lostPuppy.x, husky.y - lostPuppy.y) < 60) {
          lostPuppy.following = true;
          Audio.play('levelup');
          showBanner('🐾 Löysit eksyneen pennun! Johdata se mökille tai luolalle!');
        }
      } else {
        lostPuppy.shiverX = 0;
        const dist = Math.hypot(lostPuppy.x - husky.x, lostPuppy.y - husky.y);
        if (dist > 45) {
          const angle = Math.atan2(husky.y - lostPuppy.y, husky.x - lostPuppy.x);
          lostPuppy.x += Math.cos(angle) * 190 * dt;
          lostPuppy.y += Math.sin(angle) * 190 * dt;
          lostPuppy.flip = Math.cos(angle) < 0 ? -1 : 1;
          lostPuppy.animPhase += dt * 12;
        }

        for (const s of structures) {
          if (Math.hypot(lostPuppy.x - s.x, lostPuppy.y - s.y) < s.radius + lostPuppy.radius + 12) {
            spawnBurst(s.x, s.y, ['#ffb3d9', '#ffd700', '#ffffff', '#ff80ab'], 36);
            Audio.play('legendary');
            shopData.achievements.rescuedCount = (shopData.achievements.rescuedCount || 0) + 1;

            if (!shopData.puppies) {
              shopData.puppies = { lumi: false, kipina: false, hilla: false, salama: false, toivo: false };
            }
            if (!shopData.puppyHappiness) {
              shopData.puppyHappiness = { lumi: 100, kipina: 100, hilla: 100, salama: 100, toivo: 100 };
            }

            const targetPupId = (lostPuppy && lostPuppy.puppyType && !shopData.puppies[lostPuppy.puppyType]) 
              ? lostPuppy.puppyType 
              : ((typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA.find(p => !shopData.puppies[p.id])?.id : null));

            if (targetPupId) {
              shopData.puppies[targetPupId] = true;
              shopData.puppyHappiness[targetPupId] = 100;
              if (!shopData.activePuppy) shopData.activePuppy = targetPupId;
              shopData.totalGems += 12;
              saveShopData();
              const pInfo = typeof PUPPIES_DATA !== 'undefined' ? PUPPIES_DATA.find(p => p.id === targetPupId) : null;
              const pName = pInfo ? `${pInfo.name} ${pInfo.emoji}` : 'Huskypentu';
              showBanner(`🐾 PELASTIT PENNUN: ${pName}! Pentu muutti mökin pentutarhaan! +12 💎`);
            } else {
              shopData.totalGems += 10;
              saveShopData();
              showBanner('🐾 Pelastit pienen huskypennun! Kaikki 5 pentua ovat jo turvassa pentutarhassa! +10 💎');
            }

            checkAchievements();
            lostPuppy = null;
            break;
          }
        }
      }
    }

    // Rakennukseen meno: jos husky osuu rakennuksen sisäänkäyntiin
    for (const s of structures) {
      if (Math.hypot(husky.x - s.x, husky.y - s.y) < husky.radius + s.radius * 0.7) {
        enterStructure(s);
        return; // kohtaus vaihtui
      }
    }

    // Ulvonta: pelästytä lähellä olevat pedot (jos taito opittu & jäähtynyt)
    const howlPressed = Input.consumeHowl();
    if (perks.hasHowl && howlPressed && husky.howlCd <= 0) {
      let radius = 170 + perks.howlPower * 55;
      let duration = 2.5 + perks.howlPower * 0.6;
      if (shopData.talents && shopData.talents.howl) {
        radius += shopData.talents.howl * 30;
        duration += shopData.talents.howl * 0.7;
      }
      if (shopData.unlockedStamps && shopData.unlockedStamps['Norja 🇳🇴']) {
        spawnBurst(husky.x, husky.y, ['#00e5ff', '#76ff03', '#b388ff', '#ffffff'], 36);
        spawnTextParticle(husky.x, husky.y - 25, "REVONTULTEN AALTO! 🌌✨", "#00e5ff");
      }
      if (perks.hasSmokeBomb) {
        radius *= 1.45;
        duration *= 1.5;
        spawnBurst(husky.x, husky.y, ['#888888', '#aaaaaa', '#cccccc', '#ffffff'], 40);
        showBanner('💨 Usvapommi sokeutti pedot!');
      }
      if (shopData.unlockedStamps && shopData.unlockedStamps['Kiina 🇨🇳']) {
        duration += 1.0;
      }
      if (shopData.unlockedStamps && shopData.unlockedStamps['Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿']) {
        radius += 25; // Kultaisen säkkipillin huumaava sävel!
        duration += 0.5;
      }
      husky.howlMax = Math.max(2.5, 6 - perks.howlPower * 1.0);
      let reduction = 1.0;
      if (shopData.unlockedStamps && shopData.unlockedStamps['Suomi 🇫🇮']) {
        reduction = 0.9;
      }
      husky.howlCd = husky.howlMax * reduction;
      for (const pred of predators) {
        if (Math.hypot(pred.x - husky.x, pred.y - husky.y) < radius) pred.scare(duration);
      }
      // Ulvonnan aalto murentaa jäälohkareet ja kristallit
      for (const o of [...obstacles]) {
        if (o.type === 'ice_block') {
          if (Math.hypot(o.x - husky.x, o.y - husky.y) < radius) {
            shatterIceBlock(o);
          }
        } else if (o.type === 'crystal_shards') {
          if (Math.hypot(o.x - husky.x, o.y - husky.y) < radius) {
            shatterCrystalShard(o);
          }
        }
      }
      howlRings.push({ x: husky.x, y: husky.y, t: 0, maxR: radius });
      Audio.play('howl');
      shakeTimer = Math.max(shakeTimer, 0.22); // Pieni näytön järisytys ulvoessa!

      // Kaveri avustaa ulvontaa haukkumalla (Companion Bark)
      if (companion) {
        spawnTextParticle(companion.x, companion.y - 12, "HAUK! 🐕", "#ffd700");
        for (const pred of predators) {
          if (Math.hypot(pred.x - companion.x, pred.y - companion.y) < radius * 0.75) {
            pred.scare(duration * 0.75);
          }
        }
        howlRings.push({ x: companion.x, y: companion.y, t: 0, maxR: radius * 0.75 });
      }
    }
    // Päivitä ulvonta-aaltojen animaatio
    for (const r of howlRings) r.t += dt;
    howlRings = howlRings.filter((r) => r.t < 0.6);

    updateEffects(dt);
    updateWeather(dt);
    updateWeatherHazards(dt);
    updateDigging(dt); // kaivaminen ❌:n päällä

    // --- Combo-ajastin ---
    if (comboCount > 0) {
      comboTimer -= dt;
      if (comboTimer <= 0) {
        comboCount = 0;
        comboMul = 1;
      }
    }

    // --- Kultainen kuume ajastin ---
    if (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0) {
      goldRushTimer -= dt;
      // Syntyy kultaisia taikapölyhiukkasia koiran ympärille!
      if (Math.random() < 0.26 && husky.moving) {
        spawnBurst(husky.x + (Math.random()-0.5)*24, husky.y + (Math.random()-0.5)*24, ['#ffd700', '#ffeb3b', '#ffffff'], 1);
      }
    }

    // --- Jalanjäljet (saaliiden ja petojen) ---
    footprintTimer -= dt;
    if (footprintTimer <= 0) {
      footprintTimer = 0.35;
      for (const p of prey) {
        if (!p.alive) continue;
        if (Math.random() < 0.6) footprints.push({ x: p.x + (Math.random()-0.5)*8, y: p.y + (Math.random()-0.5)*8, age: 0, maxAge: 8.0, kind: p.kind });
      }
      for (const pred of predators) {
        if (Math.random() < 0.5) footprints.push({ x: pred.x + (Math.random()-0.5)*6, y: pred.y + (Math.random()-0.5)*6, age: 0, maxAge: 6.0, kind: pred.kind });
      }
    }
    for (const f of footprints) f.age += dt;
    footprints = footprints.filter(f => f.age < f.maxAge);

    // --- Kalastus (jokivarsi) ---
    if (biome.id === 'river') updateFishing(dt);

    // --- Kenttätapahtumat ---
    fieldEventTimer -= dt;
    if (fieldEventTimer <= 0 && !fieldEvent) spawnFieldEvent();
    if (fieldEvent) updateFieldEvent(dt);

    // --- Lähimmän eläimen kesytyspäivitys & F-näppäin ---
    activeTameablePrey = null;
    let closestTameDist = 72;
    for (const p of prey) {
      if (!p.alive || p.tamed) continue;
      const d = Math.hypot(husky.x - p.x, husky.y - p.y);
      if (d < closestTameDist) {
        closestTameDist = d;
        activeTameablePrey = p;
      }
    }

    if (activeTameablePrey && Input.consumeFeed()) {
      const p = activeTameablePrey;
      const foods = {
        squirrel: { key: 'chanterelle', name: 'kantarelli', icon: '💛' },
        golden_squirrel: { key: 'chanterelle', name: 'kantarelli', icon: '💛' },
        rabbit: { key: 'blueberry', name: 'mustikka', icon: '🫐' },
        beaver: { key: 'chanterelle', name: 'kantarelli', icon: '💛' },
        deer: { key: 'blueberry', name: 'mustikka', icon: '🫐' },
        bird: { key: 'honey', name: 'hunaja', icon: '🍯' },
        seagull: { key: 'honey', name: 'hunaja', icon: '🍯' },
        monkey: { key: 'honey', name: 'hunaja', icon: '🍯' },
        mountain_goat: { key: 'chanterelle', name: 'kantarelli', icon: '💛' }
      };
      const fInfo = foods[p.kind] || { key: 'blueberry', name: 'mustikka', icon: '🫐' };

      if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
      const hasFood = (shopData.ingredients[fInfo.key] || 0) >= 1;

      if (hasFood) {
        shopData.ingredients[fInfo.key]--;
        p.tamed = true;
        p.fleeDist = 0;
        
        if (!shopData.trust) shopData.trust = {};
        const oldT = shopData.trust[p.kind] || 0;
        const addT = p.elite ? 2 : 1;
        shopData.trust[p.kind] = oldT + addT;

        if (p.elite) {
          gemsFound += 3;
          shopData.totalGems += 3;
          if (!shopData.stats) shopData.stats = {};
          shopData.stats.mythicalsTamed = (shopData.stats.mythicalsTamed || 0) + 1;
        }
        
        saveShopData();
        checkAchievements();
        progressQuest('tame_or_friend', 1);
        if (p.elite) progressQuest('mythical', 1);

        Audio.play('levelup');
        spawnBurst(p.x, p.y, p.elite ? [p.eliteColor, '#ffffff', '#ffd700'] : ['#ff4081', '#f50057', '#ffffff'], p.elite ? 36 : 24);
        spawnTextParticle(p.x, p.y, p.elite ? "KULTAINEN KAVERI! 🦄✨" : "KAVERUSTUTTU! ❤️", p.elite ? "#ffd700" : "#ff4081");

        const trustLevel = shopData.trust[p.kind];
        if (p.elite) {
          showBanner(`💖 KESYTIT MYYTTISEN ELÄIMEN: ${preyFinnish(p.kind)}! +2 Luottamusta ja +3 💎!`);
        } else if (trustLevel >= 5) {
          showBanner(`💖 YSTÄVYYS MAKSIMIT! Sait +15 💎 ja olet nyt eläimen ${p.kind} paras kaveri!`);
          shopData.totalGems += 15;
          saveShopData();
        } else {
          showBanner(`❤️ Annoit ${fInfo.icon} - eläin kesyyntyi! Ystävyys: ${trustLevel}/5`);
        }
      } else {
        showBanner(`❌ Tarvitset 1x ${fInfo.icon} ${fInfo.name} kesyttääksesi tämän eläimen!`);
        Audio.play('hurt');
      }
    }

    const hasTamedRabbit = prey.some(p => p.alive && p.tamed && p.kind === 'rabbit');
    if (hasTamedRabbit) {
      perks.speedMul *= 1.15;
    }

    for (const p of prey) {
      if (!p.alive) continue;
      p.update(dt, husky, world, obstacles, perks);

      if (p.tamed) {
        // Tamed helpers execution
        if (p.kind === 'squirrel' || p.kind === 'golden_squirrel') {
          if (!p.actionTimer) p.actionTimer = 15;
          p.actionTimer -= dt;
          if (p.actionTimer <= 0) {
            p.actionTimer = 15 + Math.random() * 5;
            const tx = p.x + (Math.random() - 0.5) * 40;
            const ty = p.y + (Math.random() - 0.5) * 40;
            digSpots.push({ x: tx, y: ty, radius: 20, count: 1, treasure: Math.random() < 0.3 });
            spawnTextParticle(p.x, p.y, "LÖYTÖ! 🐿️🔍", "#ffeb3b");
            showBanner("🐿️ Orava löysi maasta kaivupaikan!");
            Audio.play('map');
          }
        } else if (p.kind === 'deer') {
          if (!p.actionTimer) p.actionTimer = 12;
          p.actionTimer -= dt;
          if (p.actionTimer <= 0) {
            p.actionTimer = 12 + Math.random() * 4;
            collectibles.push({ x: p.x, y: p.y, radius: 10, gem: true, color: '#00e5ff', value: 1, collected: false });
            spawnTextParticle(p.x, p.y, "+1 💎! 🦌", "#00e5ff");
            showBanner("🦌 Peura tiputti kimmeltävän jalokiven!");
            Audio.play('gem');
          }
        } else if (p.kind === 'bird' || p.kind === 'seagull') {
          for (const pred of predators) {
            const distPred = Math.hypot(p.x - pred.x, p.y - pred.y);
            if (distPred < 100 && (!pred.stunTimer || pred.stunTimer <= 0)) {
              pred.stunTimer = 1.8;
              spawnTextParticle(p.x, p.y, "VAROITUS! 🐦🚨", "#ff1744");
              showBanner("🐦 Lintukaveri varoitti pedosta ja sai sen hämmentymään!");
              Audio.play('hurt');
            }
          }
        }
      }

      // Nappausetäisyyttä kasvattaa Saalistaja-taito (perks.catchBonus)
      const reach = husky.radius + p.radius + perks.catchBonus;
      if (Math.hypot(husky.x - p.x, husky.y - p.y) < reach) {
        if (p.tamed) continue;
        if (p.kind === 'monkey' && p.stolenBones === 0) {
          const stolen = Math.max(1, Math.min(score, 3));
          score = Math.max(0, score - stolen);
          p.stolenBones = stolen;
          
          const a = Math.random() * Math.PI * 2;
          p.x = clamp(p.x + Math.cos(a) * 160, 40, world.width - 40);
          p.y = clamp(p.y + Math.sin(a) * 160, 40, world.height - 40);
          p.speed *= 1.35;
          
          spawnBurst(p.x, p.y, ['#ff4a4a', '#8b5a2b'], 15);
          Audio.play('hurt');
          showBanner('🐒 Apina varasti luusi! Ota se kiinni!');
          updateHud();
          continue;
        }

        p.alive = false;
        shopData.achievements.caughtCount = (shopData.achievements.caughtCount || 0) + 1;
        progressQuest('catch', 1);
        if (p.elite) progressQuest('mythical', 1);
        // Merkitse eläin löydetyksi bestiariaan
        if (!shopData.discovered) shopData.discovered = {};
        if (!shopData.discovered[p.kind]) {
          shopData.discovered[p.kind] = true;
          showBanner(`📖 Bestiarium: ${preyEmoji(p.kind)} ${preyFinnish(p.kind)} löydetty!`);
          saveShopData();
        }

        if (p.elite) {
          gemsFound += 2;
          shopData.totalGems += 2;
          if (!shopData.stats) shopData.stats = {};
          shopData.stats.mythicalsCaught = (shopData.stats.mythicalsCaught || 0) + 1;
          saveShopData();
          checkAchievements();
          spawnTextParticle(p.x, p.y, "MYYTTINEN! 🦄✨ +2 💎", "#ff00ff");
          showBanner(`☄️ SAAVUTIT MYYTTISEN ELÄIMEN: ${preyFinnish(p.kind)}! Sait +2 💎!`);
          Audio.play('legendary');
          spawnBurst(p.x, p.y, [p.eliteColor, '#ffffff', '#ffd700'], 36);
        } else {
          checkAchievements();
        }

        // Combo
        comboCount++;
        comboTimer = COMBO_TIMEOUT;
        comboMul = Math.min(4, 1 + Math.floor(comboCount / 3));

        let isGoldRushActive = (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0);
        if (comboCount === 5 && !isGoldRushActive) {
          goldRushTimer = 7.0;
          Audio.play('legendary');
          showBanner('🌟 KULTAINEN KUUME AKTIIVINEN! Tuplapisteet & Jalokiviryntäys! 🌟');
          spawnBurst(husky.x, husky.y, ['#ffd700', '#ffffff', '#ffea00'], 35);
        }
        isGoldRushActive = (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0);

        if (p.kind === 'golden_squirrel') {
          gemsFound++;
          let bonusGems = 1;
          if (isGoldRushActive) {
            bonusGems = 2;
            shopData.totalGems++;
          }
          
          spawnTextParticle(p.x, p.y, `KULTA-ORAVA! 💎+${bonusGems}`, "#ffd700");
          showBanner(`✨ Sait kiinni Kultaisen Oravan! Löysit 💎 ${bonusGems} Jalokiveä!`);
          Audio.play('gem');
          spawnBurst(p.x, p.y, ['#ffd700', '#ffa000', '#ffffff'], 24);
          
          let sqPts = 5;
          if (p.elite) sqPts *= 3;
          if (isGoldRushActive) sqPts *= 2;
          score += sqPts;
          caughtThisLevel++;
          gainXp(sqPts);
        } else {
          let monkeyBonus = 0;
          if (p.kind === 'monkey' && p.stolenBones > 0) {
            monkeyBonus = p.stolenBones;
            showBanner('🐒 Sait apinan kiinni ja sait aarteesi takaisin!');
          }

          let pts = (p.kind === 'nessie' ? 6 : (p.kind === 'highland_cow' ? 5 : (p.kind === 'kangaroo' ? 4 : (p.kind === 'deer' ? 3 : (p.kind === 'beaver' ? 2 : 1))))) * comboMul + monkeyBonus;
          if (p.kind === 'weasel') pts *= 2;
          if (p.elite) pts *= 3;

          if (isGoldRushActive) {
            pts *= 2;
            if (Math.random() < 0.35) {
              shopData.totalGems++;
              saveShopData();
              spawnTextParticle(p.x, p.y - 14, "+1 Jalokivi! 💎", "#ffd700");
              Audio.play('gem');
            }
          }

          score += pts;
          caughtThisLevel++;

          if (shopData.talents && shopData.talents.fortune) {
            const chance = shopData.talents.fortune * 0.20;
            if (Math.random() < chance) {
              const bonusBone = Math.ceil(pts * 0.5);
              score += bonusBone;
              spawnTextParticle(p.x, p.y - 28, `ONNENTASSU! +${bonusBone} 🦴`, '#76ff03');
              if (Math.random() < 0.25) {
                shopData.totalGems++;
                saveShopData();
                spawnTextParticle(p.x, p.y - 42, "+1 Jalokivi! 💎", "#00e5ff");
              }
            }
          }

          spawnTextParticle(p.x, p.y, `+${pts} Saalis! 🐾`, '#ffd700');
          gainXp(pts);

          if (comboMul >= 2) {
            spawnBurst(p.x, p.y, ['#ffd700','#ffb800','#fff'], 20);
          } else {
            spawnBurst(p.x, p.y, ['#fff', '#ffe8c0', '#d8c4a0'], 12);
          }
          Audio.play('catch');
        }
        updateHud();
      }
    }
    prey = prey.filter((p) => p.alive);

    collectBones(dt);

    // Husky nousi tasolle → tarjoa taito (pysäyttää pelin)
    if (huskyXp >= xpToNext) {
      offerSkill();
      if (!running) return;
    }

    // Tason läpäisy?
    if (caughtThisLevel >= goal) {
      nextLevel();
      return; // kenttä vaihtui — jatketaan seuraavalla framella
    }
    refillPrey();

    // Pedot
    if (invulnTimer > 0) invulnTimer -= dt;
    const envMul = envDetectMul(); // yö/sää heikentää petojen näköä
    let chasers = 0;
    for (const pred of predators) {
      if (pred.stunTimer > 0) {
        pred.stunTimer -= dt;
        if (Math.random() < 0.22) {
          spawnBurst(pred.x, pred.y + (Math.random() - 0.5) * pred.radius, ['#00e5ff', '#ffffff'], 2);
        }
        continue;
      }
      
      // Jäälohkareen murtaminen pedon syöksystä
      if (pred.isBoss && pred.chargeState === 'lunge') {
        for (const o of [...obstacles]) {
          if (o.type === 'ice_block' && collides(pred, o)) {
            shatterIceBlock(o);
          }
        }
      }

      let targetEntity = husky;
      let nearToy = null;
      let minToyDist = 145;
      for (const toy of thrownToys) {
        const dist = Math.hypot(pred.x - toy.x, pred.y - toy.y);
        if (dist < minToyDist) {
          minToyDist = dist;
          nearToy = toy;
        }
      }
      if (nearToy) {
        targetEntity = {
          x: nearToy.x,
          y: nearToy.y,
          radius: nearToy.radius,
          swimming: false,
          inWater: false
        };
        if (minToyDist < pred.radius + nearToy.radius + 8) {
          pred.stunTimer = 2.8;
          nearToy.life = 0;
          spawnTextParticle(pred.x, pred.y - 14, "LELU! 🐾🎾", "#a2e85a");
          Audio.play('catch');
        }
      }

      pred.update(dt, targetEntity, world, obstacles, perks, envMul, projectiles, isNightTime(), predators);

      // Bestiarium-paljastus
      if (!shopData.discovered) shopData.discovered = {};
      if (!shopData.discovered[pred.kind]) {
        if (Math.hypot(pred.x - husky.x, pred.y - husky.y) < 180) {
          shopData.discovered[pred.kind] = true;
          showBanner(`📖 Bestiarium: ${preyEmoji(pred.kind)} ${preyFinnish(pred.kind)} löydetty!`);
          saveShopData();
        }
      }

      // Jännitysmusiikki: jahtaavat (ja syöksyvät pomot) nostavat tasoa
      if (pred.state === 'chase' || (pred.isBoss && pred.chargeState !== 'none')) chasers++;

      // Syöksyvaroitus-ääni kun pomo aloittaa latauksen
      if (pred.isBoss) {
        if (pred.chargeState === 'windup' && !pred._chargeSfx) {
          Audio.play('charge');
          pred._chargeSfx = true;
        } else if (pred.chargeState !== 'windup') {
          pred._chargeSfx = false;
        }
      }

      if (invulnTimer <= 0 && collides(husky, pred)) {
        if (pred.isBoss && pred.chargeState === 'recover') {
          let dmg = perks.ironBite ? 2 : 1;
          if (shopData.unlockedStamps && shopData.unlockedStamps['Louisiana 🇺🇸']) {
            if (Math.random() < 0.35) {
              dmg += 1;
              spawnTextParticle(husky.x, husky.y - 30, "ALLIGAATTORIN PURENTA! 🐊", "#388e3c", "bold 13px sans-serif");
            }
          }
          pred.hp = Math.max(0, pred.hp - dmg);
          spawnBurst(pred.x, pred.y, ['#ff4a4a', '#ffffff', '#ffd700'], 22);
          Audio.play('catch');
          if (pred.hp <= 0) {
            spawnBurst(pred.x, pred.y, ['#ffd700', '#ffffff', '#ffaa00'], 48);
            Audio.play('legendary');
            shopData.totalGems += 15;
            saveShopData();
            showBanner('👑 KUKISTIT POMON! +15 💎');
            nextLevel();
            return;
          } else {
            showBanner(perks.ironBite 
              ? `🦷 Raudankova purenta! Puraisit pomoa kahdesti! HP: ${pred.hp}/${pred.maxHp}`
              : `🐺 Puraisit pomoa! HP: ${pred.hp}/${pred.maxHp}`);
            pred.chargeState = 'none';
            pred.chargeCd = 3.2;
            invulnTimer = 1.0;
          }
        } else {
          if (hurtHusky(pred.x, pred.y)) { gameOver(); return; }
        }
      }
    }

    // Kaktustörmäykset (Aavikolla)
    if (invulnTimer <= 0) {
      for (const o of obstacles) {
        if (o.type === 'cactus' && collides(husky, o)) {
          if (hurtHusky(o.x, o.y, 'cactus')) { gameOver(); return; }
        }
      }
    }

    // Laavavahinko (Tulivuorimaa)
    if (biome.id === 'volcano') {
      let inLava = false;
      for (const o of obstacles) {
        if (o.type === 'lava' && Math.hypot(husky.x - o.x, husky.y - o.y) < o.radius) {
          inLava = true;
        }
      }
      if (inLava) {
        husky.lavaHeat = (husky.lavaHeat || 0) + dt;
        if (husky.lavaHeat > 1.2 && invulnTimer <= 0) {
          husky.lavaHeat = 0;
          if (hurtHusky(husky.x, husky.y, 'lava')) { gameOver(); return; }
        }
      } else {
        husky.lavaHeat = Math.max(0, (husky.lavaHeat || 0) - dt * 2);
      }
    }

    // Tipahtavat magmakivet (Tulivuorimaa)
    if (biome.id === 'volcano') {
      volcanoTimer += dt;
      if (volcanoTimer > 3.8) {
        volcanoTimer = 0;
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 180;
        const tx = clamp(husky.x + Math.cos(a) * d, 60, world.width - 60);
        const ty = clamp(husky.y + Math.sin(a) * d, 60, world.height - 60);
        projectiles.push({ x: tx, y: ty, radius: 48, timer: 1.6, maxTime: 1.6, type: 'volcano' });
      }
    }

    // Päivitä kaikki aktiiviset projektilit (laskeutuvat tulikivet & lentävät lumipallot/pistimet)
    for (const proj of projectiles) {
      if (proj.vx !== undefined) {
        // Lentävät projektilit (Yeti lumipallo, Skorpioni pistin)
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;
        proj.timer -= dt;

        // Osuma Huskyyn
        if (invulnTimer <= 0 && Math.hypot(husky.x - proj.x, husky.y - proj.y) < husky.radius + proj.radius) {
          proj.timer = 0; // tuhotaan heti
          if (proj.type === 'snowball') {
            husky.slowTimer = 3.5;
            spawnBurst(proj.x, proj.y, ['#ffffff', '#cbe6ff'], 14);
            Audio.play('catch');
            showBanner('❄️ Palelutit! Hidastuit 3.5 sekunniksi!');
          } else if (proj.type === 'sting') {
            spawnBurst(proj.x, proj.y, ['#ff2a4b', '#9e1b2b'], 20);
            if (hurtHusky(proj.x, proj.y, 'scorpion_sting')) { gameOver(); return; }
          } else if (proj.type === 'feather') {
            spawnBurst(proj.x, proj.y, ['#ffffff', '#bdc3c7'], 16);
            if (hurtHusky(proj.x, proj.y, 'eagle_feather')) { gameOver(); return; }
          } else if (proj.type === 'web') {
            husky.slowTimer = 2.5;
            spawnBurst(proj.x, proj.y, ['#e0f7fa', '#ffffff'], 16);
            Audio.play('catch');
            showBanner('🕸️ Takerrutit seittiin! Hidastuit 2.5 sekunniksi!');
            spawnTextParticle(husky.x, husky.y - 12, "HIDASTETTU! 🕸️", "#e0f7fa");
          }
        }
        // Osuma esteeseen (vain kiinteät)
        for (const o of obstacles) {
          if (o.solid && Math.hypot(proj.x - o.x, proj.y - o.y) < o.radius + proj.radius) {
            proj.timer = 0;
            const colors = proj.type === 'snowball' ? ['#ffffff', '#cbe6ff'] :
                           proj.type === 'web' ? ['#e0f7fa', '#ffffff'] :
                           proj.type === 'feather' ? ['#ffffff', '#bdc3c7'] :
                           ['#ff2a4b', '#9e1b2b'];
            spawnBurst(proj.x, proj.y, colors, 10);
          }
        }
      } else if (proj.type === 'shockwave') {
        // Laajeneva shokkiaalto maassa
        proj.timer -= dt;
        proj.radius = (1 - proj.timer / proj.maxTime) * proj.maxRadius;
        
        // Osuu jos Husky on piirin kehällä (+- 16px)
        const dist = Math.hypot(husky.x - proj.x, husky.y - proj.y);
        if (invulnTimer <= 0 && Math.abs(dist - proj.radius) < 18) {
          if (hurtHusky(proj.x, proj.y, 'shockwave')) { gameOver(); return; }
        }
      } else {
        // Laskeutuvat magmakivet
        proj.timer -= dt;
        if (proj.timer <= 0) {
          spawnBurst(proj.x, proj.y, ['#ff4a00', '#ff9a00', '#ffe000', '#555555'], 28);
          shakeTimer = Math.max(shakeTimer, 0.35);
          Audio.play('hurt');
          if (invulnTimer <= 0 && Math.hypot(husky.x - proj.x, husky.y - proj.y) < proj.radius) {
            if (hurtHusky(proj.x, proj.y, 'fireball')) { gameOver(); return; }
          }
        }
      }
    }
    projectiles = projectiles.filter(p => p.timer > 0);
    
    // --- Salamaniskut (sääefektien dynaaminen interaktio) ---
    if (weather === 'rain' || weather === 'blizzard') {
      lightningTimer -= dt;
      if (lightningTimer <= 0) {
        const a = Math.random() * Math.PI * 2;
        const d = 50 + Math.random() * 220;
        const tx = clamp(husky.x + Math.cos(a) * d, 40, world.width - 40);
        const ty = clamp(husky.y + Math.sin(a) * d, 40, world.height - 40);
        lightningStrikes.push({ x: tx, y: ty, radius: 34, timer: 1.3 });
        lightningTimer = 8 + Math.random() * 12;
      }
    }

    if (screenFlashTimer > 0) {
      screenFlashTimer -= dt;
    }

    for (const strike of lightningStrikes) {
      strike.timer -= dt;
      if (strike.timer <= 0) {
        screenFlashTimer = 0.08;
        Audio.play('thunder');
        shakeTimer = Math.max(shakeTimer, 0.45);
        
        spawnBurst(strike.x, strike.y, ['#00e5ff', '#ffffff', '#e0f7fa'], 24);
        
        const dPlayer = Math.hypot(husky.x - strike.x, husky.y - strike.y);
        if (dPlayer < strike.radius) {
          if (invulnTimer <= 0) {
            if (hurtHusky(strike.x, strike.y, 'lightning')) { gameOver(); return; }
          }
          const multiplier = 1.45;
          perks.speedMul = (perks.speedMul || 1.0) * multiplier;
          showBanner('⚡ SÄHKÖLATAUS! Sait +45 % nopeutta hetkeksi!');
          spawnTextParticle(husky.x, husky.y - 15, "TURBO! ⚡", "#ffd700");
          setTimeout(() => {
            perks.speedMul /= multiplier;
          }, 3500);
        }

        for (const pred of predators) {
          const dPred = Math.hypot(pred.x - strike.x, pred.y - strike.y);
          if (dPred < strike.radius) {
            pred.stunTimer = 4.0;
            spawnTextParticle(pred.x, pred.y, "STUNNED! ⚡", "#00e5ff");
            spawnBurst(pred.x, pred.y, ['#00e5ff', '#ffffff'], 16);
            showBanner('⚡ Salama iski petoon ja lamautti sen!');
          }
        }
      }
    }
    lightningStrikes = lightningStrikes.filter(s => s.timer > 0);

    // --- Meteorit (harvinainen taivaallinen sääilmiö) ---
    if (isMeteorShower) {
      meteorTimer -= dt;
      if (meteorTimer <= 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 260;
        const tx = clamp(husky.x + Math.cos(angle) * dist, 40, world.width - 40);
        const ty = clamp(husky.y + Math.sin(angle) * dist, 40, world.height - 40);
        meteors.push({ x: tx, y: ty, radius: 44, timer: 1.6, maxTimer: 1.6 });
        meteorTimer = 1.6 + Math.random() * 2.2;
      }
    }

    for (const m of meteors) {
      m.timer -= dt;
      if (m.timer <= 0) {
        screenFlashTimer = 0.08;
        Audio.play('thunder');
        shakeTimer = Math.max(shakeTimer, 0.55);
        
        spawnBurst(m.x, m.y, ['#ff3c00', '#ff9f00', '#ffea00', '#ffffff'], 32);
        
        const dPlayer = Math.hypot(husky.x - m.x, husky.y - m.y);
        if (dPlayer < m.radius && invulnTimer <= 0) {
          if (hurtHusky(m.x, m.y, 'meteor')) { gameOver(); return; }
          showBanner('☄️ Sait osuman meteorista! 🩹');
        }

        for (const pred of predators) {
          const dPred = Math.hypot(pred.x - m.x, pred.y - m.y);
          if (dPred < m.radius) {
            pred.stunTimer = 4.5;
            spawnTextParticle(pred.x, pred.y, "METEOR HIT! 💥", "#ff5500");
            spawnBurst(pred.x, pred.y, ['#ff3300', '#ffffff'], 20);
            showBanner('💥 Meteori iski petoon ja tyrmäsi sen!');
          }
        }

        if (Math.random() < 0.65) {
          collectibles.push({
            x: m.x,
            y: m.y,
            radius: 10,
            star: true,
            collected: false,
            phase: Math.random() * Math.PI
          });
        }
      }
    }
    meteors = meteors.filter(m => m.timer > 0);

    Audio.setTension(chasers > 0 ? Math.min(1, chasers * 0.5) : 0);
  }

  // Kevyt ruudukko aktiivisen maailman koon mukaan
  function drawGrid(w, color) {
    ctx.strokeStyle = color || 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w.width; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, w.height); ctx.stroke();
    }
    for (let y = 0; y < w.height; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w.width, y); ctx.stroke();
    }
  }

  function drawCollectibles() {
    for (const c of collectibles) {
      const bob = Math.sin(gameTime * 3 + (c.phase || 0)) * 3;
      if (c.isQuest) {
        ctx.save();
        ctx.beginPath();
        const pulseRadius = 22 + Math.sin(gameTime * 7) * 5;
        ctx.arc(c.x, c.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 223, 0, 0.7)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(255, 223, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.emoji, 0, 0);
        ctx.restore();
      } else if (c.map) {
        // Aarrekartta (kääröpaperi pienellä punaisella X:llä)
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.fillStyle = '#e8d8a8';
        ctx.strokeStyle = '#b89a64';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(-c.radius, -c.radius * 0.7, c.radius * 2, c.radius * 1.4);
        ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#c0463a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-4, -4); ctx.lineTo(4, 4); ctx.moveTo(4, -4); ctx.lineTo(-4, 4);
        ctx.stroke();
        ctx.restore();
      } else if (c.gem) {
        // Jalokivi
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.fillStyle = c.color || '#ff4a6a';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -c.radius);
        ctx.lineTo(c.radius, 0);
        ctx.lineTo(0, c.radius);
        ctx.lineTo(-c.radius, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      } else if (c.star) {
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌠', 0, 0);
        ctx.restore();
      } else if (c.honey) {
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍯', 0, 0);
        ctx.restore();
      } else if (c.feather) {
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪶', 0, 0);
        ctx.restore();
      } else {
        Sprites.drawBone(ctx, c.x, c.y, c.radius, c.gold, bob);
      }
    }
  }

  // Aarrekarttojen kaivuupaikat + kaivuuedistymä (tukee useita & ketjuja)
  function drawDigSpots() {
    const pulse = 0.5 + 0.5 * Math.abs(Math.sin(gameTime * 4));
    for (const d of digSpots) {
      const chain = d.totalSteps > 1;
      // Multaläiskä
      ctx.fillStyle = 'rgba(70,48,28,0.55)';
      ctx.beginPath();
      ctx.arc(d.x, d.y, DIG_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      // X (ketjuvihje sinertävä, tavallinen punainen)
      ctx.strokeStyle = chain
        ? `rgba(90,150,255,${0.6 + pulse * 0.4})`
        : `rgba(220,60,50,${0.6 + pulse * 0.4})`;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const r = DIG_RADIUS * 0.55;
      ctx.beginPath();
      ctx.moveTo(d.x - r, d.y - r); ctx.lineTo(d.x + r, d.y + r);
      ctx.moveTo(d.x + r, d.y - r); ctx.lineTo(d.x - r, d.y + r);
      ctx.stroke();
      // Kaivuuedistymä-rengas
      if (d.progress > 0) {
        ctx.strokeStyle = '#ffe070';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, DIG_RADIUS + 6,
          -Math.PI / 2, -Math.PI / 2 + (d.progress / DIG_TIME) * Math.PI * 2);
        ctx.stroke();
      }
      // Ketjun vihjenumero
      if (chain) {
        ctx.fillStyle = '#bfe0ff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${d.step}/${d.totalSteps}`, d.x, d.y - DIG_RADIUS - 12);
      }
    }
  }

  function drawHusky() {
    // Muinaisen kilven kehä huskyn ympärillä (kun valmiina)
    if (perks.hasShield && husky.shieldReady) {
      const pulse = 0.5 + 0.5 * Math.abs(Math.sin(gameTime * 3));
      ctx.strokeStyle = `rgba(120,200,255,${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(husky.x, husky.y, husky.radius + 7, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Husky vilkkuu suoja-aikana
    if (invulnTimer <= 0 || Math.floor(invulnTimer * 10) % 2 === 0) {
      husky.draw(ctx);
    }
    // Combo-ilmaisin huskyn yläpuolella
    if (comboCount > 0) {
      ctx.save();
      const pulse = 0.8 + 0.2 * Math.abs(Math.sin(gameTime * 14));
      ctx.fillStyle = comboMul >= 3 ? '#ffdf4a' : comboMul >= 2 ? '#ffb800' : '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(`COMBO x${comboMul} (${comboCount})`, husky.x, husky.y - husky.radius - 20);
      ctx.fillText(`COMBO x${comboMul} (${comboCount})`, husky.x, husky.y - husky.radius - 20);
      
      // Pieni edistymispalkki combon kestoajalle
      const barW = 34;
      const barH = 3.5;
      const bx = husky.x - barW / 2;
      const by = husky.y - husky.radius - 12;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = '#ff8f30';
      ctx.fillRect(bx, by, barW * (comboTimer / COMBO_TIMEOUT), barH);
      ctx.restore();
    }
  }

  // Talo (🏠), kolo (🕳️) tai luola (🪨) sisäänkäynteineen + "mene sisään" -vihje
  function drawStructure(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    const r = s.radius;
    if (s.kind === 'house') {
      ctx.fillStyle = '#b06a4a';
      ctx.fillRect(-r, -r * 0.4, r * 2, r * 1.4);           // seinä
      ctx.fillStyle = '#7a3f2a';
      ctx.beginPath();                                       // katto
      ctx.moveTo(-r * 1.18, -r * 0.4);
      ctx.lineTo(0, -r * 1.25);
      ctx.lineTo(r * 1.18, -r * 0.4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#3a2418';
      ctx.fillRect(-r * 0.32, r * 0.2, r * 0.64, r * 0.8);   // ovi
      ctx.fillStyle = '#f0d060';
      ctx.fillRect(r * 0.45, -r * 0.1, r * 0.35, r * 0.35);  // ikkuna
    } else if (s.kind === 'den') {
      ctx.fillStyle = '#3a2e22';
      ctx.beginPath(); ctx.ellipse(0, r * 0.3, r * 1.15, r * 0.75, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#120d08';
      ctx.beginPath(); ctx.ellipse(0, r * 0.38, r * 0.72, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    } else if (s.kind === 'cave') {
      // Luolan piirto: kasa kivenlohkareita, ja pimeä reikä keskellä
      ctx.fillStyle = '#55555c';
      ctx.beginPath(); ctx.arc(-r * 0.45, r * 0.2, r * 0.65, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.45, r * 0.2, r * 0.65, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.72, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#101015';
      ctx.beginPath(); ctx.ellipse(0, r * 0.3, r * 0.62, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // Tunnus + vihje
    const near = Math.hypot(husky.x - s.x, husky.y - s.y) < s.radius + 80;
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.kind === 'house' ? '🏠' : s.kind === 'den' ? '🕳️' : '🪨', s.x, s.y - s.radius - 18);
    if (near) {
      ctx.fillStyle = '#ffe070';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Mene sisään', s.x, s.y - s.radius - 40);
    }
  }

  function drawField() {
    // Tausta + ruudukko (biomin värit)
    ctx.fillStyle = biome.ground;
    ctx.fillRect(-40, -40, world.width + 80, world.height + 80);
    drawGrid(world, biome.grid);

    // --- Revontulilaakso: taivaalla ja maastossa loimuavat revontuliverhot ---
    if (biome.id === 'aurora') {
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const t = (typeof gameTime !== 'undefined' ? gameTime : 0) * 0.45 + i * 1.8;
        const grad = ctx.createLinearGradient(0, 0, world.width, world.height * 0.7);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.0)');
        grad.addColorStop(0.35 + Math.sin(t) * 0.12, i === 0 ? 'rgba(0, 255, 170, 0.18)' : (i === 1 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(179, 136, 255, 0.15)'));
        grad.addColorStop(0.72 + Math.cos(t * 0.8) * 0.12, 'rgba(0, 229, 255, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= world.width; x += 60) {
          const y = 80 + i * 90 + Math.sin(x * 0.005 + t) * 45 + Math.cos(x * 0.008 - t * 0.7) * 25;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(world.width, world.height * 0.65);
        ctx.lineTo(0, world.height * 0.65);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // --- Jokivarsi: piirretään jokiväylät ---
    if (biome.id === 'river') {
      for (const rv of fishingSpots) {
        // Kalastuspaikat sinertävinä pyöreä altaina
        const r2 = rv.rechargeCd > 0 ? 0.3 : 0.7;
        ctx.save();
        ctx.globalAlpha = r2;
        const wg = ctx.createRadialGradient(rv.x, rv.y, rv.radius * 0.2, rv.x, rv.y, rv.radius);
        wg.addColorStop(0, '#4ac0f8');
        wg.addColorStop(1, 'rgba(30,120,200,0)');
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.arc(rv.x, rv.y, rv.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (rv.rechargeCd <= 0) {
          ctx.fillStyle = '#fff';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🎣', rv.x, rv.y + 6);
          // Kalastusedistymä
          if (fishingProgress > 0 && Math.hypot(husky.x - rv.x, husky.y - rv.y) < rv.radius) {
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(rv.x - 22, rv.y + rv.radius + 4, 44, 7);
            ctx.fillStyle = '#7ad0ff';
            ctx.fillRect(rv.x - 22, rv.y + rv.radius + 4, 44 * (fishingProgress / 2.2), 7);
          }
        }
        ctx.restore();
      }
    }

    // --- Jalanjäljet maahan (saaliit ja pedot) ---
    for (const f of footprints) {
      const alpha = Math.max(0, (1 - f.age / f.maxAge) * 0.45);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = f.kind === 'wolf' || f.kind === 'bear' || f.kind === 'lynx' || f.kind === 'fox' ? '#ff6040' : '#a08060';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // --- Kenttätapahtumien visuaalit ---
    if (fieldEvent) {
      const fe = fieldEvent;
      const pulse = 0.5 + 0.5 * Math.abs(Math.sin(gameTime * 3));
      if (fe.type === 'aurora') {
        // Revontulet: vihreä/violetti shimmer koko ruudun yli (piirretään ruutukoord:ssa myöhemmin)
        // Paikalliset aaltokiilat maailmakoordinaateissa
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.globalAlpha = 0.12 + pulse * 0.1;
          ctx.fillStyle = ['#00ff88', '#aa44ff', '#44aaff'][i];
          ctx.beginPath();
          ctx.ellipse(fe.x + i*220 - 220, fe.y, 120 + i*60, 40, Math.sin(gameTime * 0.8 + i) * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (fe.type === 'meteor' && !fe.collected) {
        // Kraatteri: oranssi/keltainen rengas + hyppivä meteori-emoji
        ctx.save();
        ctx.globalAlpha = 0.35 + pulse * 0.3;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 5]);
        ctx.beginPath();
        ctx.arc(fe.x, fe.y, 55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.font = `${28 + Math.round(pulse * 6)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('☄️', fe.x, fe.y - 12 - pulse * 8);
        ctx.restore();
      } else if (fe.type === 'merchant' && !fe.helped) {
        // Kauppias: iloisesti kimaltava kärryn ikoni
        ctx.save();
        ctx.globalAlpha = 0.5 + pulse * 0.4;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(fe.x, fe.y, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛒', fe.x, fe.y + 8);
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('Kauppias!', fe.x, fe.y - 28);
        ctx.restore();
      } else if (fe.type === 'swarm') {
        // Lauma: pulssirengas
        ctx.save();
        ctx.globalAlpha = 0.25 + pulse * 0.25;
        ctx.strokeStyle = '#ffe070';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.arc(fe.x, fe.y, 80 + pulse * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    }
  function drawThrownToys() {
    for (const toy of thrownToys) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.arc(toy.x, toy.y + 4, toy.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#a2e85a';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(toy.x, toy.y, toy.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(toy.x - toy.radius * 0.5, toy.y, toy.radius * 0.8, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
      ctx.restore();
    }
  }

    for (const pred of predators) pred.drawVision(ctx);
    drawDigSpots(); // maahan, hahmojen alle
    drawMushrooms();
    drawBlueberries();
    drawNests();
    for (const s of structures) drawStructure(s);
    for (const o of obstacles) if (o.type !== 'bush') o.draw(ctx, biome);
    drawCollectibles();
    drawThrownToys();
    drawBeeSwarms();

    if (confusionTimer > 0) {
      ctx.save();
      const hX = husky.x;
      const hY = husky.y - husky.radius - 14;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(hX, hY);
      ctx.rotate(gameTime * 5.5);
      ctx.fillText('🌀😵🌀', 0, 0);
      ctx.restore();
    }

    for (const p of prey) p.draw(ctx);


    // Piirretään projektilit
    for (const proj of projectiles) {
      if (proj.type === 'volcano') {
        const ratio = proj.timer / proj.maxTime;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 40, 0, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 50, 0, ${(1 - ratio) * 0.28})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * (1 - ratio), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (proj.type === 'shockwave') {
        // Laajeneva maankuoren shokkiaalto
        ctx.save();
        const ratio = proj.timer / proj.maxTime; // 1 .. 0
        ctx.strokeStyle = `rgba(215, 115, 40, ${ratio})`;
        ctx.lineWidth = 5 * ratio + 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(215, 115, 40, ${ratio * 0.09})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // Lentävät projektilit (snowball, sting tai feather)
        ctx.save();
        if (proj.type === 'snowball') {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#85c3e8';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (proj.type === 'sting') {
          ctx.fillStyle = '#ff2a4b';
          ctx.strokeStyle = '#4a1010';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (proj.type === 'feather') {
          // Valkoinen-harmaa linnunsulka, suunnattu kulkusuuntaan
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#bdc3c7';
          ctx.lineWidth = 1.5;
          ctx.translate(proj.x, proj.y);
          const angle = Math.atan2(proj.vy, proj.vx);
          ctx.rotate(angle);
          ctx.beginPath();
          // Soikio sulaksi
          ctx.ellipse(0, 0, proj.radius * 2, proj.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Keskikynä (quill) viivana
          ctx.strokeStyle = '#95a5a6';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(-proj.radius * 1.8, 0);
          ctx.lineTo(proj.radius * 1.8, 0);
          ctx.stroke();
        } else if (proj.type === 'web') {
          ctx.strokeStyle = '#e0f7fa';
          ctx.lineWidth = 1.2;
          ctx.translate(proj.x, proj.y);
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * proj.radius * 1.4, Math.sin(angle) * proj.radius * 1.4);
          }
          ctx.stroke();
          
          ctx.beginPath();
          for (let rMul = 0.5; rMul <= 1.4; rMul += 0.4) {
            for (let i = 0; i <= 8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              const px = Math.cos(angle) * proj.radius * rMul;
              const py = Math.sin(angle) * proj.radius * rMul;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    for (const pred of predators) {
      // Syöksyn telegraph: latauksen aikana sykkivä punainen varoitusviiva
      if (pred.isBoss && pred.chargeState === 'windup') {
        const pulse = 0.4 + 0.5 * Math.abs(Math.sin(gameTime * 12));
        const len = 360;
        ctx.save();
        ctx.translate(pred.x, pred.y);
        ctx.rotate(Math.atan2(pred.chargeDir.y, pred.chargeDir.x));
        const g = ctx.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, `rgba(255,40,30,${pulse})`);
        g.addColorStop(1, 'rgba(255,40,30,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, -10, len, 20);
        ctx.fillStyle = `rgba(255,60,40,${pulse})`;
        ctx.beginPath();
        ctx.moveTo(len, -22);
        ctx.lineTo(len + 26, 0);
        ctx.lineTo(len, 22);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      pred.draw(ctx, isNightTime());

      // Pomolle kruunu ja punainen kehä (toipuessa himmeämpi = haavoittuvampi)
      if (pred.isBoss) {
        ctx.strokeStyle = pred.chargeState === 'recover'
          ? 'rgba(120,180,255,0.7)' : 'rgba(255,70,60,0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pred.x, pred.y, pred.radius + 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = `${pred.radius * 0.9}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', pred.x, pred.y - pred.radius - 8);

        if (pred.chargeState === 'recover') {
          const starAnim = (gameTime * 6) % (Math.PI * 2);
          ctx.fillStyle = '#ffdf4a';
          ctx.font = '11px sans-serif';
          for (let i = 0; i < 3; i++) {
            const angle = starAnim + (i / 3) * Math.PI * 2;
            const sx = pred.x + Math.cos(angle) * (pred.radius * 0.8);
            const sy = pred.y - pred.radius - 22 + Math.sin(angle) * 3;
            ctx.fillText('⭐', sx, sy);
          }
        }

        if (pred.hp !== undefined) {
          const bw = pred.radius * 1.5, bh = 4.5;
          const bx = pred.x - bw / 2, by = pred.y - pred.radius - 24;
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = pred.chargeState === 'recover' ? '#7ad0ff' : '#ff4545';
          ctx.fillRect(bx, by, bw * (pred.hp / pred.maxHp), bh);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(bx, by, bw, bh);
        }
      }
    }

    if (lostPuppy) {
      ctx.save();
      // Värise hieman jos odottaa
      const sx = lostPuppy.following ? 0 : lostPuppy.shiverX;
      ctx.translate(lostPuppy.x + sx, lostPuppy.y);
      if (lostPuppy.flip < 0) ctx.scale(-1, 1);

      // Varjo
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(0, lostPuppy.radius * 0.9, lostPuppy.radius * 1.1, lostPuppy.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Keho
      ctx.fillStyle = '#8a8a92';
      ctx.beginPath();
      ctx.ellipse(0, 0, lostPuppy.radius * 1.1, lostPuppy.radius * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Naama
      ctx.fillStyle = '#6b6b72';
      const hx = lostPuppy.radius * 0.7, hy = -lostPuppy.radius * 0.3;
      ctx.beginPath();
      ctx.arc(hx, hy, lostPuppy.radius * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      ctx.arc(hx + lostPuppy.radius * 0.4, hy + lostPuppy.radius * 0.15, lostPuppy.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4a4a50';
      ctx.beginPath();
      ctx.moveTo(hx - lostPuppy.radius * 0.35, hy - lostPuppy.radius * 0.4);
      ctx.lineTo(hx - lostPuppy.radius * 0.1, hy - lostPuppy.radius * 0.9);
      ctx.lineTo(hx + lostPuppy.radius * 0.1, hy - lostPuppy.radius * 0.4);
      ctx.fill();

      ctx.restore();

      if (!lostPuppy.following) {
        ctx.save();
        const bounce = Math.sin(gameTime * 6) * 3;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        const label = '🥺 Uik!';
        const textW = ctx.measureText(label).width;
        ctx.fillRect(lostPuppy.x - textW / 2 - 6, lostPuppy.y - lostPuppy.radius - 22 + bounce, textW + 12, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, lostPuppy.x, lostPuppy.y - lostPuppy.radius - 10 + bounce);
        ctx.restore();
      } else {
        ctx.save();
        ctx.fillStyle = '#ff4a7a';
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText('💖', lostPuppy.x, lostPuppy.y - lostPuppy.radius - 8 + Math.sin(gameTime * 8) * 2);
        ctx.restore();
      }
    }

    if (companion) companion.draw(ctx);
    if (activePuppyFollower) Sprites.draw(ctx, activePuppyFollower);
    drawHusky();

    if (isFishingActive) {
      ctx.save();
      const x = husky.x + 28;
      const y = husky.y - 65;
      const w = 18;
      const h = 80;

      // Tausta
      ctx.fillStyle = 'rgba(25, 34, 48, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
      ctx.stroke();

      // Vihreä tension-palkki
      const tensionY = y + h - (fishingTension * h);
      const greenH = 18;
      ctx.fillStyle = 'rgba(76, 175, 80, 0.75)';
      ctx.fillRect(x + 1, tensionY - greenH / 2, w - 2, greenH);

      // Kala-emoji
      const fishY = y + h - (fishingFishY * h);
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐟', x + w / 2, fishY);

      // Edistymispalkki
      const progressW = 6;
      const progressX = x - 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(progressX, y, progressW, h, 2);
      ctx.fill();

      const successH = (fishingSuccess / 100) * h;
      ctx.fillStyle = `hsl(${fishingSuccess * 1.2}, 85%, 50%)`;
      ctx.beginPath();
      ctx.roundRect(progressX, y + h - successH, progressW, successH, 2);
      ctx.fill();

      // Ohjeteksti
      ctx.fillStyle = '#ffb74d';
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 2.5;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('TÄRPPI! 🎣', x + w/2 - 4, y - 10);
      ctx.fillText('TÄRPPI! 🎣', x + w/2 - 4, y - 10);

      ctx.restore();
    }

    // --- Kesytysvihje ---
    if (activeTameablePrey) {
      const p = activeTameablePrey;
      const foods = {
        squirrel: { name: 'kantarelli', icon: '💛' },
        golden_squirrel: { name: 'kantarelli', icon: '💛' },
        rabbit: { name: 'mustikka', icon: '🫐' },
        beaver: { name: 'kantarelli', icon: '💛' },
        deer: { name: 'mustikka', icon: '🫐' },
        bird: { name: 'hunaja', icon: '🍯' },
        seagull: { name: 'hunaja', icon: '🍯' },
        monkey: { name: 'hunaja', icon: '🍯' },
        mountain_goat: { name: 'kantarelli', icon: '💛' }
      };
      const fInfo = foods[p.kind] || { name: 'mustikka', icon: '🫐' };

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
      ctx.strokeStyle = '#ff4081';
      ctx.lineWidth = 1.2;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      
      const promptText = `Paina F syöttääksesi ${fInfo.icon} (${fInfo.name})`;
      const textW = ctx.measureText(promptText).width + 12;
      const px = p.x;
      const py = p.y - p.radius - 12;
      
      ctx.beginPath();
      ctx.roundRect(px - textW / 2, py - 9, textW, 16, 4);
      ctx.fill(); ctx.stroke();
      
      ctx.fillStyle = '#ff4081';
      ctx.fillText(promptText, px, py + 2);
      ctx.restore();
    }

    if (biome.id === 'volcano') {
      for (const proj of projectiles) {
        if (proj.type !== 'volcano') continue;
        const ratio = proj.timer / proj.maxTime;
        if (ratio > 0.04) {
          ctx.save();
          const height = proj.radius * 4.5 * ratio;
          ctx.fillStyle = '#ff7c00';
          ctx.strokeStyle = '#ffe000';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y - height, 9 + (1 - ratio) * 5, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();

          ctx.fillStyle = 'rgba(100,100,100,0.55)';
          ctx.beginPath();
          ctx.arc(proj.x + Math.sin(gameTime * 10) * 3, proj.y - height - 10, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Pusikot huskyn päälle, jotta piiloutuminen näkyy visuaalisesti
    for (const o of obstacles) if (o.type === 'bush') o.draw(ctx, biome);
    drawHoneycombs();

    // Ulvonta-aallot (laajenevat renkaat)
    for (const r of howlRings) {
      const p = r.t / 0.6;
      ctx.strokeStyle = `rgba(180,210,255,${(1 - p) * 0.8})`;
      ctx.lineWidth = 4 * (1 - p) + 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.maxR * p, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Piirretään salamaniskujen varoitusympyrät
    if (typeof lightningStrikes !== 'undefined') {
      for (const s of lightningStrikes) {
        ctx.save();
        const alpha = 0.2 + 0.3 * Math.sin(s.timer * 35);
        ctx.fillStyle = `rgba(255, 30, 30, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (s.timer / 1.3), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Piirretään meteorien varoitusympyrät ja tippuvat tulipallot
    if (typeof meteors !== 'undefined') {
      for (const m of meteors) {
        ctx.save();
        const alpha = 0.25 + 0.3 * Math.sin(m.timer * 35);
        ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ff8f00';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius * (m.timer / m.maxTimer), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        const height = (m.timer / m.maxTimer) * 360;
        const mx = m.x + height * 0.45;
        const my = m.y - height;

        const grad = ctx.createLinearGradient(mx, my, m.x, m.y);
        grad.addColorStop(0, 'rgba(255, 60, 0, 0)');
        grad.addColorStop(0.4, 'rgba(255, 110, 0, 0.55)');
        grad.addColorStop(1, '#ffeb3b');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 14 * (1 - m.timer / m.maxTimer) + 6;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        ctx.fillStyle = '#4e342e';
        ctx.strokeStyle = '#ff3d00';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawInterior() {
    const iw = interior.world;
    // Tumma reunus koko näkymään (sisätila on viewporttia pienempi)
    ctx.fillStyle = '#0e0b08';
    ctx.fillRect(cam.x - 10, cam.y - 10, viewport.width + 20, viewport.height + 20);
    // Lattia
    if (interior.kind === 'backyard') {
      ctx.fillStyle = '#2e5d2b';
    } else {
      ctx.fillStyle = interior.kind === 'house' ? '#5a4636' : interior.kind === 'den' ? '#332a20' : '#141416';
    }
    ctx.fillRect(0, 0, iw.width, iw.height);
    drawGrid(iw);
    // Seinäkehys
    if (interior.kind === 'backyard') {
      ctx.strokeStyle = '#1b3b18';
    } else {
      ctx.strokeStyle = '#241a12';
    }
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, iw.width - 16, iw.height - 16);
    for (const o of interior.walls) o.draw(ctx);

    // Piirretään mökin parantelut
    if (interior.kind === 'house') {
      const upg = shopData.cabinUpgrades;

      // 1. Tulisija (fireplace)
      ctx.save();
      ctx.fillStyle = '#4a453f';
      ctx.fillRect(350, 80, 60, 45);
      ctx.strokeStyle = '#2d2925';
      ctx.lineWidth = 3;
      ctx.strokeRect(350, 80, 60, 45);

      if (upg.fireplace > 0) {
        const pulse = 0.85 + 0.15 * Math.abs(Math.sin(gameTime * 10));
        const radGrd = ctx.createRadialGradient(380, 110, 5, 380, 110, upg.fireplace === 2 ? 40 : 25);
        radGrd.addColorStop(0, `rgba(255, 220, 50, ${pulse})`);
        radGrd.addColorStop(0.4, `rgba(255, 90, 0, ${0.8 * pulse})`);
        radGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(380, 110, upg.fireplace === 2 ? 40 : 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔥', 380, 102);
      }
      ctx.restore();

      // 1b. Keittopata (Cooking Pot)
      ctx.save();
      ctx.fillStyle = '#212121';
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(425, 110, 14, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#d84315';
      ctx.beginPath();
      ctx.ellipse(425, 104, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(414, 118); ctx.lineTo(410, 124);
      ctx.moveTo(436, 118); ctx.lineTo(440, 124);
      ctx.stroke();

      const steamY = 100 - (gameTime * 20 % 16);
      const steamAlpha = 1 - (100 - steamY) / 16;
      ctx.fillStyle = `rgba(255, 255, 255, ${steamAlpha * 0.55})`;
      ctx.font = '11px sans-serif';
      ctx.fillText('♨️', 421, steamY);
      ctx.restore();

      // 2. Työpöytä (workbench)
      ctx.save();
      ctx.fillStyle = '#7c583c';
      ctx.fillRect(135, 295, 50, 42);
      ctx.strokeStyle = '#4e3320';
      ctx.lineWidth = 3;
      ctx.strokeRect(135, 295, 50, 42);
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔨', 160, 316);
      
      const pulse = 0.5 + 0.5 * Math.abs(Math.sin(gameTime * 4));
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 + pulse * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(160, 316, 26 + pulse * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2b. Mitalitaulu (achievementsPlaque)
      if (upg.achievementsPlaque) {
        ctx.save();
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(230, 70, 60, 48);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(230, 70, 60, 48);

        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(234, 74, 52, 40);

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏅', 260, 94);
        ctx.restore();
      }

      // 3. Palkintohylly (trophyWall)
      if (upg.trophyWall) {
        ctx.save();
        
        // Kaapin tausta ja runko
        ctx.fillStyle = '#4e342e'; // Tyylikäs tummanruskea puu
        ctx.fillRect(115, 75, 96, 112);
        
        // Kehykset ja syvyysvarjostus
        ctx.strokeStyle = '#27120c';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(115, 75, 96, 112);
        
        ctx.strokeStyle = '#150603';
        ctx.lineWidth = 1;
        ctx.strokeRect(117, 77, 92, 108);

        // Hyllytasot (4 kpl tasoja kaapin sisällä)
        ctx.fillStyle = '#6d4c41';
        for (let row = 0; row < 4; row++) {
          ctx.fillRect(117, 98 + row * 24, 92, 4);
        }

        // Piirretään kerätyt matkamuistot 4x4 ruudukkoon
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < 16; i++) {
          const country = passportList[i];
          const entry = PASSPORT_ENTRIES[country];
          if (!entry) continue;
          
          const row = Math.floor(i / 4);
          const col = i % 4;
          
          // Lasketaan asemointi kaapin sisällä
          const x = 127 + col * 23;
          const y = 90 + row * 24;
          
          const unlocked = shopData.unlockedStamps && shopData.unlockedStamps[country];
          if (unlocked) {
            // Poimitaan emoji esineen nimestä
            const parts = entry.collectible.split(' ');
            const emoji = parts[parts.length - 1] || '🎁';
            ctx.font = '13px sans-serif';
            ctx.fillText(emoji, x, y);
          } else {
            // Lukittu esine: piirretään himmeä kysymysmerkki/lukko
            ctx.font = '10px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.fillText('🔒', x, y);
          }
        }

        // Lasioven heijastukset (viistot lasikiillot tuomaan premium-fiilistä)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(117, 77);
        ctx.lineTo(165, 77);
        ctx.lineTo(140, 183);
        ctx.lineTo(117, 183);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(180, 77);
        ctx.lineTo(195, 77);
        ctx.lineTo(170, 183);
        ctx.lineTo(155, 183);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 4. Koiran peti (doghouse)
      if (upg.doghouse > 0) {
        ctx.save();
        ctx.fillStyle = '#8a6245';
        ctx.beginPath();
        ctx.arc(580, 150, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b88c68';
        ctx.beginPath();
        ctx.arc(580, 150, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = upg.doghouse === 2 ? '22px sans-serif' : '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(upg.doghouse === 2 ? '🏠' : '🛏️', 580, 150);
        ctx.restore();
      }

      // 5. Ruokakuppi (food bowl)
      if (upg.bowlLvl > 0) {
        ctx.save();
        ctx.fillStyle = '#4a7ab5';
        ctx.beginPath();
        ctx.arc(380, 220, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fdfdfd';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🥣', 380, 220);
        ctx.restore();
      }

      // 5. Lelulaatikko (toybox)
      if (upg.toybox > 0) {
        ctx.save();
        ctx.fillStyle = '#b87c4c';
        ctx.fillRect(480, 290, 45, 30);
        ctx.strokeStyle = '#5a3d24';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(480, 290, 45, 30);
        
        ctx.font = '13px sans-serif';
        ctx.fillText('🎾', 482, 286);
        ctx.fillText('🦴', 496, 286);
        if (upg.toybox === 2) {
          ctx.fillText('🧸', 510, 286);
        }
        ctx.restore();
      }

      // 6. Gramofoni (gramophone)
      if (upg.gramophone) {
        ctx.save();
        // Alusta/pöytä gramofonille
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(460, 100, 40, 6);
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(463, 106, 4, 12);
        ctx.fillRect(493, 106, 4, 12);

        // Gramofonin puulaatikko (runko)
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(466, 88, 28, 12);
        ctx.strokeStyle = '#27120c';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(466, 88, 28, 12);

        // Vinyylilevy
        ctx.fillStyle = '#111';
        ctx.beginPath();
        // Vinyylilevyn pieni pyörimisliike
        const rotationAngle = (gameTime * 2.5) % (Math.PI * 2);
        ctx.arc(480, 88, 10, 0, Math.PI * 2);
        ctx.fill();
        // Vinyylin keskiö ja kiilto viivoina
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(480, 88, 3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(480 + Math.cos(rotationAngle) * 9, 88 + Math.sin(rotationAngle) * 9);
        ctx.lineTo(480 - Math.cos(rotationAngle) * 9, 88 - Math.sin(rotationAngle) * 9);
        ctx.stroke();

        // Kultainen torvi (horn)
        ctx.strokeStyle = '#ff9800';
        ctx.fillStyle = '#ffc107';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(473, 88);
        ctx.quadraticCurveTo(468, 78, 462, 74);
        ctx.lineTo(458, 80);
        ctx.quadraticCurveTo(466, 82, 473, 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Torven aukko
        ctx.fillStyle = '#e65100';
        ctx.beginPath();
        ctx.arc(460, 77, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 7. Viljelylaatikko (planterPots)
      if (upg.planterPots) {
        ctx.save();
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(300, 100, 40, 14);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(300, 100, 40, 14);
        
        if (Array.isArray(shopData.gardenSlots)) {
          const plantIcons = {
            blueberry: ['🌱', '🌿', '🫐'],
            chanterelle: ['🌱', '🌿', '🍄'],
            clover: ['🌱', '🌿', '🌸']
          };
          
          for (let i = 0; i < 3; i++) {
            const slot = shopData.gardenSlots[i];
            if (slot) {
              const list = plantIcons[slot.plantType] || plantIcons.blueberry;
              const emoji = list[slot.stage] || '🌱';
              ctx.font = '10px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(emoji, 308 + i * 12, 98);
            }
          }
        }
        ctx.restore();
      }

      // Piirretään kehotteet laitteiden lähellä oltaessa
      if (nearCabinet && upg.trophyWall) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(163 - 110, 198, 220, 24);
        ctx.strokeStyle = '#ffb300';
        ctx.lineWidth = 1;
        ctx.strokeRect(163 - 110, 198, 220, 24);
        ctx.fillStyle = '#ffb300';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa avataksesi kaapin 🏆', 163, 210);
        ctx.restore();
      }
      if (nearPlaque && upg.achievementsPlaque) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(260 - 110, 138, 220, 24);
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1;
        ctx.strokeRect(260 - 110, 138, 220, 24);
        ctx.fillStyle = '#ffd54f';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa avataksesi mitalitaulun 🏅', 260, 150);
        ctx.restore();
      }
      if (nearGramophone && upg.gramophone) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(480 - 115, 128, 230, 24);
        ctx.strokeStyle = '#4db6ac';
        ctx.lineWidth = 1;
        ctx.strokeRect(480 - 115, 128, 230, 24);
        ctx.fillStyle = '#4db6ac';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa käyttääksesi soitinta 📻', 480, 140);
        ctx.restore();
      }
      if (nearCookingPot) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(425 - 110, 140, 220, 24);
        ctx.strokeStyle = '#ff7043';
        ctx.lineWidth = 1;
        ctx.strokeRect(425 - 110, 140, 220, 24);
        ctx.fillStyle = '#ff7043';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa kokkaaksesi 🍲', 425, 152);
        ctx.restore();
      }
      if (nearPlanter && upg.planterPots) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(320 - 110, 138, 220, 24);
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 1;
        ctx.strokeRect(320 - 110, 138, 220, 24);
        ctx.fillStyle = '#8d6e63';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa hoitaaksesi puutarhaa 🪴', 320, 150);
        ctx.restore();
      }

      // 8. Koirakoulun diplomi seinällä (Training Diploma)
      ctx.save();
      ctx.fillStyle = '#fff9c4';
      ctx.fillRect(338, 66, 26, 22);
      ctx.strokeStyle = '#fbc02d';
      ctx.lineWidth = 2.0;
      ctx.strokeRect(338, 66, 26, 22);
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.arc(351, 84, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎓', 351, 75);
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#ffecb3';
      ctx.fillText('Koulu 🎓', 351, 60);
      ctx.restore();

      if (nearDiploma) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(350 - 110, 138, 220, 24);
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1;
        ctx.strokeRect(350 - 110, 138, 220, 24);
        ctx.fillStyle = '#ffe082';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa: Koirakoulu 🎓', 350, 150);
        ctx.restore();
      }

      // 9. Fossiilivitriini seinällä (Fossil Showcase)
      ctx.save();
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(185, 72, 32, 24);
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = 2.0;
      ctx.strokeRect(185, 72, 32, 24);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(187, 74, 28, 20);
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦖', 201, 88);
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#ffcc80';
      ctx.fillText('Fossiilit 🏛️', 201, 66);
      ctx.restore();

      if (nearFossils) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(200 - 110, 138, 220, 24);
        ctx.strokeStyle = '#ffb74d';
        ctx.lineWidth = 1;
        ctx.strokeRect(200 - 110, 138, 220, 24);
        ctx.fillStyle = '#ffe082';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa: Fossiilit 🦖', 200, 150);
        ctx.restore();
      }

      // Takaovi takapihalle
      ctx.save();
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(600, 68, 44, 20);
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = 2.0;
      ctx.strokeRect(600, 68, 44, 20);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffecb3';
      ctx.textAlign = 'center';
      ctx.fillText('⬆ Takapiha 🏕️', 622, 60);
      ctx.restore();

      if (nearBackdoor) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(620 - 110, 105, 220, 24);
        ctx.strokeStyle = '#81c784';
        ctx.lineWidth = 1;
        ctx.strokeRect(620 - 110, 105, 220, 24);
        ctx.fillStyle = '#a5d6a7';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai astu ovesta takapihalle 🏕️', 620, 117);
        ctx.restore();
      }

      // 9. Tehtävätaulu (Quest Notice Board)
      ctx.save();
      ctx.fillStyle = '#bcaaa4';
      ctx.fillRect(525, 78, 36, 26);
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(525, 78, 36, 26);
      ctx.fillStyle = '#fff9c4';
      ctx.fillRect(529, 83, 12, 14);
      ctx.fillStyle = '#e1f5fe';
      ctx.fillRect(544, 85, 12, 14);
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📌', 535, 82);
      ctx.fillText('📌', 550, 84);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffecb3';
      ctx.fillText('Tehtävät 📜', 543, 72);
      ctx.restore();

      if (nearQuestBoard) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(540 - 110, 115, 220, 24);
        ctx.strokeStyle = '#ffb300';
        ctx.lineWidth = 1;
        ctx.strokeRect(540 - 110, 115, 220, 24);
        ctx.fillStyle = '#ffe082';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa avataksesi tehtävät 📜', 540, 127);
        ctx.restore();
      }
    }

    if (interior.kind === 'backyard') {
      // 1. Tähtitaivas & Yötehoste
      ctx.save();
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37 + 50) % 700 + 30;
        const sy = (i * 29 + 30) % 130 + 30;
        const starAlpha = 0.4 + 0.4 * Math.sin(gameTime * 2 + i);
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.restore();

      // 2. Leirinuotio (campfire) x: 380, y: 240
      ctx.save();
      ctx.fillStyle = '#424242';
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(380 + Math.cos(ang) * 26, 240 + Math.sin(ang) * 20, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(365, 232); ctx.lineTo(395, 248);
      ctx.moveTo(365, 248); ctx.lineTo(395, 232);
      ctx.stroke();

      const fPulse = 1.0 + 0.15 * Math.sin(gameTime * 12);
      const fireGrd = ctx.createRadialGradient(380, 238, 4, 380, 238, 38 * fPulse);
      fireGrd.addColorStop(0, '#fff59d');
      fireGrd.addColorStop(0.25, '#ff9800');
      fireGrd.addColorStop(0.6, '#f44336');
      fireGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fireGrd;
      ctx.beginPath();
      ctx.arc(380, 238, 40 * fPulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥', 380, 235);
      ctx.restore();

      // 3. Teltta (tent) x: 180, y: 180
      ctx.save();
      ctx.fillStyle = '#0277bd';
      ctx.beginPath();
      ctx.moveTo(180, 135);
      ctx.lineTo(135, 215);
      ctx.lineTo(225, 215);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#01579b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#0d47a1';
      ctx.beginPath();
      ctx.moveTo(180, 160);
      ctx.lineTo(160, 215);
      ctx.lineTo(200, 215);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#e1f5fe';
      ctx.textAlign = 'center';
      ctx.fillText('Teltta ⛺', 180, 130);
      ctx.restore();

      // 6. Pentutarha & Leikkipuisto (Puppy Sanctuary) x: 380, y: 110
      ctx.save();
      // Pehmeä leikkialue / aitaus
      ctx.fillStyle = '#2b521e';
      roundRect(ctx, 290, 50, 180, 110, 14);
      ctx.fill();
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2.5;
      roundRect(ctx, 290, 50, 180, 110, 14);
      ctx.stroke();

      // Pieni söpö pentukoppi
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(305, 68, 36, 28);
      ctx.beginPath();
      ctx.moveTo(300, 68);
      ctx.lineTo(323, 52);
      ctx.lineTo(346, 68);
      ctx.closePath();
      ctx.fillStyle = '#d32f2f';
      ctx.fill();
      ctx.fillStyle = '#212121';
      ctx.fillRect(317, 80, 12, 16);

      // Vesikuppi & herkkukuppi
      ctx.fillStyle = '#0288d1';
      ctx.beginPath();
      ctx.arc(445, 78, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.arc(458, 78, 7, 0, Math.PI * 2);
      ctx.fill();

      // Kyltti
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ff80ab';
      ctx.textAlign = 'center';
      ctx.fillText('🐶 Pentutarha 🍼', 380, 44);

      // Piirretään pelastetut pennut leikkimässä aitauksessa
      if (shopData.puppies && typeof PUPPIES_DATA !== 'undefined') {
        const rescuedList = PUPPIES_DATA.filter(p => shopData.puppies[p.id]);
        if (rescuedList.length === 0) {
          ctx.font = 'italic 10px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText('Pelasta pentuja seikkailuista!', 380, 115);
        } else {
          rescuedList.forEach((pup, idx) => {
            const baseAngle = (idx / rescuedList.length) * Math.PI * 2;
            const px = 380 + Math.cos(baseAngle + gameTime * 0.4) * 45;
            const py = 115 + Math.sin(baseAngle + gameTime * 0.4) * 22;
            const bounce = Math.abs(Math.sin(gameTime * 4 + idx * 1.5)) * 4;
            Sprites.draw(ctx, {
              x: px,
              y: py - bounce,
              radius: 9,
              kind: 'puppy',
              puppyType: pup.id,
              moving: true,
              animPhase: gameTime * 8 + idx
            });
          });
        }
      }
      ctx.restore();

      if (nearPuppyNursery) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(380 - 110, 166, 220, 24);
        ctx.strokeStyle = '#ff80ab';
        ctx.lineWidth = 1;
        ctx.strokeRect(380 - 110, 166, 220, 24);
        ctx.fillStyle = '#ffb2dd';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E tai klikkaa: Pentutarha 🐶', 380, 178);
        ctx.restore();
      }

      // 4. Kaukoputki (telescope) x: 580, y: 180
      ctx.save();
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(580, 185); ctx.lineTo(565, 215);
      ctx.moveTo(580, 185); ctx.lineTo(580, 215);
      ctx.moveTo(580, 185); ctx.lineTo(595, 215);
      ctx.stroke();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(565, 195); ctx.lineTo(600, 160);
      ctx.stroke();
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffecb3';
      ctx.textAlign = 'center';
      ctx.fillText('Kaukoputki 🔭', 580, 150);
      ctx.restore();

      // 5. Agility-Portti x: 180, y: 370
      ctx.save();
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(155, 340, 6, 38);
      ctx.fillRect(205, 340, 6, 38);
      ctx.fillStyle = '#ffb300';
      ctx.fillRect(152, 338, 62, 9);
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(152, 338, 62, 9);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(158, 340, 6, 5);
      ctx.fillRect(172, 340, 6, 5);
      ctx.fillRect(186, 340, 6, 5);
      ctx.fillRect(200, 340, 6, 5);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffd54f';
      ctx.textAlign = 'center';
      ctx.fillText('AGILITY 🐕🏁', 183, 330);
      if (shopData.agilityRecord > 0) {
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#a5d6a7';
        ctx.fillText(`Ennätys: ${shopData.agilityRecord.toFixed(2)}s`, 183, 395);
      }
      ctx.restore();

      // 6. Revontulien Toivomuskaivo x: 580, y: 370
      ctx.save();
      ctx.fillStyle = '#546e7a';
      ctx.beginPath();
      ctx.arc(580, 370, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 3;
      ctx.stroke();
      const wellPulse = 0.85 + 0.15 * Math.sin(gameTime * 4);
      const wellWater = ctx.createRadialGradient(580, 370, 2, 580, 370, 17 * wellPulse);
      wellWater.addColorStop(0, '#e0f7fa');
      wellWater.addColorStop(0.5, '#00e5ff');
      wellWater.addColorStop(1, '#651fff');
      ctx.fillStyle = wellWater;
      ctx.beginPath();
      ctx.arc(580, 370, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6d4c41';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(562, 370); ctx.lineTo(562, 336);
      ctx.moveTo(598, 370); ctx.lineTo(598, 336);
      ctx.stroke();
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.moveTo(580, 324);
      ctx.lineTo(554, 338);
      ctx.lineTo(606, 338);
      ctx.closePath();
      ctx.fill();
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#80d8ff';
      ctx.textAlign = 'center';
      ctx.fillText('Toivomuskaivo ⛲✨', 580, 318);
      ctx.restore();

      // 7. Kesytetyt ystävät nuotion ympärillä
      if (interior.friends) {
        for (const f of interior.friends) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath();
          ctx.ellipse(f.x, f.y + 10, 14, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.icon, f.x, f.y);

          if (f.hasGift) {
            ctx.font = '12px sans-serif';
            ctx.fillText('🎁', f.x + 10, f.y - 14);
          }
          ctx.restore();
        }
      }

      // 8. Ystävän puhekupla
      if (activeFriendSpeech) {
        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        const tw = ctx.measureText(activeFriendSpeech.text).width + 20;
        ctx.fillStyle = 'rgba(20, 20, 28, 0.9)';
        ctx.strokeStyle = '#ffb74d';
        ctx.lineWidth = 1.5;
        const bx = activeFriendSpeech.x - tw / 2;
        const by = activeFriendSpeech.y - 42;
        ctx.fillRect(bx, by, tw, 24);
        ctx.strokeRect(bx, by, tw, 24);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeFriendSpeech.text, activeFriendSpeech.x, by + 12);
        ctx.restore();
      }

      // 9. Läheisyyskehotteet takapihalla
      if (nearCampfire) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(380 - 110, 285, 220, 24);
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 1;
        ctx.strokeRect(380 - 110, 285, 220, 24);
        ctx.fillStyle = '#ffb74d';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E ruokkiaksesi nuotiota (5 🦴) 🔥', 380, 297);
        ctx.restore();
      } else if (nearTent) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(180 - 110, 225, 220, 24);
        ctx.strokeStyle = '#03a9f4';
        ctx.lineWidth = 1;
        ctx.strokeRect(180 - 110, 225, 220, 24);
        ctx.fillStyle = '#81d4fa';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E levätäksesi teltassa ⛺💤', 180, 237);
        ctx.restore();
      } else if (nearTelescope) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(580 - 110, 225, 220, 24);
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1;
        ctx.strokeRect(580 - 110, 225, 220, 24);
        ctx.fillStyle = '#fff59d';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E katsellaksesi tähtiä 🔭🌌', 580, 237);
        ctx.restore();
      } else if (nearAgility) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(180 - 110, 400, 220, 24);
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 1;
        ctx.strokeRect(180 - 110, 400, 220, 24);
        ctx.fillStyle = '#a5d6a7';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E: Aloita Agility-esterata 🐕🏁', 180, 412);
        ctx.restore();
      } else if (nearWishingWell) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(580 - 110, 400, 220, 24);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1;
        ctx.strokeRect(580 - 110, 400, 220, 24);
        ctx.fillStyle = '#80d8ff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Paina E: Heitä kolikko toivomuskaivoon ⛲✨', 580, 412);
        ctx.restore();
      } else if (nearFriend) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(nearFriend.x - 110, nearFriend.y + 22, 220, 24);
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 1;
        ctx.strokeRect(nearFriend.x - 110, nearFriend.y + 22, 220, 24);
        ctx.fillStyle = '#f48fb1';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Paina E jutellaksesi: ${nearFriend.name} ❤️`, nearFriend.x, nearFriend.y + 34);
        ctx.restore();
      }
    }


    // Ansat (piikit)
    for (const tr of interior.traps) {
      ctx.fillStyle = 'rgba(60,40,30,0.7)';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cfd2d8';
      ctx.strokeStyle = '#8a8e96';
      ctx.lineWidth = 1;
      const n = 7;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const bx = tr.x + Math.cos(a) * tr.radius * 0.5;
        const by = tr.y + Math.sin(a) * tr.radius * 0.5;
        ctx.beginPath();
        ctx.moveTo(bx - 4, by + 5);
        ctx.lineTo(bx, by - 8);
        ctx.lineTo(bx + 4, by + 5);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }

    drawCollectibles();

    // Ystävällinen NPC + sydän-ilmaisin
    const npc = interior.npc;
    if (npc && !npc.helped) {
      Sprites.draw(ctx, npc);
      ctx.fillStyle = '#ff7a9a';
      ctx.font = 'bold 18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💛', npc.x, npc.y - npc.radius - 14);
    }

    // Ovi (uloskäynti)
    const ex = interior.exit;
    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(ex.x - ex.r, ex.y - 8, ex.r * 2, 34);
    ctx.fillStyle = '#ffe070';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(interior.kind === 'backyard' ? '⬇ Mökkiin' : '⬇ Ulos', ex.x, ex.y - 18);
    
    if (companion) companion.draw(ctx);
    if (activePuppyFollower) Sprites.draw(ctx, activePuppyFollower);
    drawHusky();

    // Pimeys luolassa (Radial Gradient -maski Huskyn ympärillä)
    if (interior.kind === 'cave') {
      const hasLantern = shopData.items && shopData.items.lantern > 0;
      const lightRadius = hasLantern ? 230 : 120;
      ctx.save();
      const grd = ctx.createRadialGradient(husky.x, husky.y, 10, husky.x, husky.y, lightRadius);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(0.35, 'rgba(0,0,0,0.1)');
      grd.addColorStop(0.85, 'rgba(5,5,8,0.96)');
      grd.addColorStop(1, '#050508');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, iw.width, iw.height);
      ctx.restore();
    }
  }

  function draw() {
    const w = activeWorld();
    ctx.save();
    // Ruudun tärinä osuman jälkeen
    if (shakeTimer > 0) {
      const mag = shakeTimer * 22;
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }
    // Kamera seuraa huskya
    updateCamera();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

    if (scene === 'interior') drawInterior();
    else if (scene === 'dungeon') drawDungeon();
    else if (scene === 'island')  drawIsland();
    else if (scene === 'treasure') drawTreasure();
    else if (scene === 'agility')  drawAgility();
    else drawField();

    // Pinottavat mittarit huskyn yllä
    let barY = husky.y - husky.radius - 24;

    // Aarteen avaamisen edistymispalkki (jos aktiivinen)
    if (scene === 'treasure' && typeof treasureProgress !== 'undefined' && treasureProgress > 0) {
      const w = 38, x = husky.x - w / 2;
      const fill = Math.min(1, treasureProgress / 1.5);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#1de9b6'; // turkoosi aarrearkkupalkki
      ctx.fillRect(x, barY, w * fill, 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔑 AVAA ARKKUA', husky.x, barY - 4);
      barY -= 14;
    }

    // Kaivuun edistymispalkki (jos aktiivinen)
    let activeDig = null;
    if (typeof digSpots !== 'undefined') {
      for (const d of digSpots) {
        if (Math.hypot(husky.x - d.x, husky.y - d.y) < DIG_RADIUS && d.progress > 0) {
          activeDig = d;
          break;
        }
      }
    }
    if (activeDig) {
      const w = 38, x = husky.x - w / 2;
      const fill = Math.min(1, activeDig.progress / DIG_TIME);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#e67e22'; // oranssi kaivuupalkki
      ctx.fillRect(x, barY, w * fill, 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛏️ KAIVAA', husky.x, barY - 4);
      barY -= 14;
    }

    // Kalastuksen edistymispalkki (jos aktiivinen)
    if (typeof fishingProgress !== 'undefined' && fishingProgress > 0) {
      const w = 38, x = husky.x - w / 2;
      const fill = Math.min(1, fishingProgress / 2.2);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#2980b9'; // sininen kalastuspalkki
      ctx.fillRect(x, barY, w * fill, 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎣 KALASTAA', husky.x, barY - 4);
      barY -= 14;
    }

    // Paiston edistymispalkki (jos aktiivinen)
    if (typeof cookingProgress !== 'undefined' && cookingProgress > 0) {
      const w = 38, x = husky.x - w / 2;
      const fill = Math.min(1, cookingProgress / COOK_TIME);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#d35400'; // oranssinpunainen paistopalkki
      ctx.fillRect(x, barY, w * fill, 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍳 PAISTAA 🐟', husky.x, barY - 4);
      barY -= 14;
    }

    // Silitys edistymispalkki (jos aktiivinen)
    if (typeof petTimer !== 'undefined' && petTimer > 0) {
      const w = 38, x = husky.x - w / 2;
      const fill = Math.min(1, petTimer / 1.5);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#ff4081'; // ihana pinkki silityspalkki
      ctx.fillRect(x, barY, w * fill, 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❤️ SILITTELEE', husky.x, barY - 4);
      barY -= 14;
    }

    // Väistöliikkeen latausmittari (vain jos se on latautumassa)
    if (husky && husky.dashCooldown > 0) {
      const w = 38, x = husky.x - w / 2;
      const fill = 1 - husky.dashCooldown / 1.4;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 4);
      ctx.fillStyle = '#76ff03'; // kirkkaanvihreä väistöpalkki
      ctx.fillRect(x, barY, w * fill, 4);
      barY -= 7;
    }

    // Sprint-energiapalkki (vain jos Kirmaus opittu)
    if (perks.hasSprint) {
      const w = 38, x = husky.x - w / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 5);
      ctx.fillStyle = husky.sprinting ? '#ffd24a' : (husky.stamina > 0.25 ? '#7ad0ff' : '#ff8c5a');
      ctx.fillRect(x, barY, w * husky.stamina, 5);
      barY -= 8;
    }

    // Ulvonnan jäähdytysmittari (vain jos Ulvonta opittu)
    if (perks.hasHowl) {
      const w = 38, x = husky.x - w / 2;
      const ready = husky.howlCd <= 0;
      const fill = ready ? 1 : 1 - husky.howlCd / husky.howlMax;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 5);
      ctx.fillStyle = ready ? '#c79cff' : '#6a5a8a';
      ctx.fillRect(x, barY, w * fill, 5);
    }

    // "Piilossa"-ilmaisin huskyn yllä
    if (husky.hidden) {
      ctx.fillStyle = '#aef0ae';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🤫 Piilossa', husky.x, husky.y - husky.radius - 14);
    }

    // Hiukkaset (nappauspurske, osumaroiske, tekstipopupit) ylimmäs
    for (const pt of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife));
      if (pt.text) {
        ctx.fillStyle = pt.color;
        ctx.font = pt.font || 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(pt.text, pt.x, pt.y);
        ctx.shadowBlur = 0;
      } else if (pt.isFootprint) {
        // Piirretään suloinen tassunjälki (päätyyny + 3 varvaspistettä)
        ctx.fillStyle = pt.color;
        // Päätyyny
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        // Varpaat yläpuolella
        ctx.beginPath();
        ctx.arc(pt.x - 1.4, pt.y - 1.4, pt.size * 0.45, 0, Math.PI * 2);
        ctx.arc(pt.x, pt.y - 2.2, pt.size * 0.45, 0, Math.PI * 2);
        ctx.arc(pt.x + 1.4, pt.y - 1.4, pt.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    ctx.restore(); // lopeta kamera- ja tärinä-translaatio

    // Vuorokausi & sää (ruutukoordinaatistossa, vain ulkona)
    if (scene === 'field') {
      drawNightOverlay();
      drawWeather();
      drawMinimap();
      
      // Ukkosen salamaniskujen valkoinen välähdys
      if (typeof screenFlashTimer !== 'undefined' && screenFlashTimer > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${screenFlashTimer * 10.0})`;
        ctx.fillRect(0, 0, viewport.width, viewport.height);
        ctx.restore();
      }
      
      // Kultainen Kuume reunushohto
      if (typeof goldRushTimer !== 'undefined' && goldRushTimer > 0) {
        ctx.save();
        const pulse = 0.5 + 0.3 * Math.sin(gameTime * 12);
        const g = ctx.createRadialGradient(viewport.width / 2, viewport.height / 2, viewport.width * 0.35, viewport.width / 2, viewport.height / 2, viewport.width * 0.55);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(255, 215, 0, ${0.3 * pulse})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, viewport.width, viewport.height);
        ctx.restore();
      }
    }

    // Punainen osumavälähdys (ruutukoordinaatistossa, ei tärise eikä kameroi)
    if (flashTimer > 0) {
      ctx.fillStyle = `rgba(255,40,30,${(flashTimer / 0.4) * 0.35})`;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }
  }

  // Vuorokauden tummennus + aamun/illan lämmin hehku (ruutukoordinaatisto, radial-valomaski)
  function drawNightOverlay() {
    const light = envLight();
    const darkness = 1 - light;
    if (darkness > 0.03) {
      ctx.save();
      
      // Huskyn sijainti ruudussa (kameran siirtymän huomioon ottaen)
      const hx = husky.x - cam.x;
      const hy = husky.y - cam.y;
      
      // Lyhdyn vaikutus valokehän kokoon
      const hasLantern = shopData.items && shopData.items.lantern > 0;
      const lightRadius = hasLantern ? 280 : 145;
      
      const grd = ctx.createRadialGradient(hx, hy, 16, hx, hy, lightRadius);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(0.35, `rgba(12,18,36,${darkness * 0.12})`);
      grd.addColorStop(0.85, `rgba(8,12,28,${darkness * 0.65})`);
      grd.addColorStop(1, `rgba(5,7,18,${darkness * 0.88})`);
      
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
      ctx.restore();
    }
    // Aamun-/illankoiton lämmin sävy (voimakkain kun valo on matala mutta ei keskiyö)
    const glow = Math.max(0, 1 - Math.abs(light - 0.3) / 0.3);
    if (glow > 0.02) {
      ctx.fillStyle = `rgba(255,150,70,${glow * 0.14})`;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }
  }

  // Sää: sadeviivat / lumihiutaleet / sumuverho / tuhkasade / lumimyrsky / hiekkamyrsky (ruutukoordinaatisto)
  function drawWeather() {
    if (weather === 'rain') {
      ctx.strokeStyle = 'rgba(175,195,235,0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (const p of weatherParticles) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.len * 0.3, p.y + p.len);
      }
      ctx.stroke();
    } else if (weather === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (const p of weatherParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'blizzard') {
      // Lumimyrsky: tiheä lumi + sinertävä sumu
      ctx.fillStyle = 'rgba(190,215,255,0.18)';
      ctx.fillRect(0, 0, viewport.width, viewport.height);
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      for (const p of weatherParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Piirretään jääpuikkojen varoitusympyrät (maailmakoord → ruutukoord)
      for (const ic of icicles) {
        if (ic.hit) continue;
        const sx = ic.x - cam.x;
        const sy = ic.y - cam.y;
        const progress = 1 - ic.timer / ic.maxTime;
        const alpha = 0.15 + progress * 0.55;
        const r = ic.radius * (0.4 + progress * 0.6);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#88ccff';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = '#c8f0ff';
        ctx.fill();
        // Jääpuikko-symboli
        ctx.globalAlpha = Math.min(1, alpha + 0.3);
        ctx.setLineDash([]);
        ctx.fillStyle = '#ddeeff';
        ctx.font = `bold ${14 + Math.round(progress * 10)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('🧊', sx, sy - r * 0.2);
        ctx.restore();
      }
    } else if (weather === 'fog') {
      ctx.fillStyle = biome.id === 'foggy_peaks' ? 'rgba(215,222,230,0.58)' : 'rgba(200,205,212,0.3)';
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    } else if (weather === 'ash') {
      ctx.fillStyle = 'rgba(85,80,75,0.8)';
      for (const p of weatherParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'sandstorm') {
      // Hiekkamyrsky: ruskea/keltainen peite + lentelevät hiekanjyvät
      // Taustapeite: tiheys kasvaa reunoilta
      const grd = ctx.createRadialGradient(
        viewport.width / 2, viewport.height / 2, viewport.height * 0.1,
        viewport.width / 2, viewport.height / 2, viewport.height * 0.75);
      grd.addColorStop(0, 'rgba(200,160,70,0.12)');
      grd.addColorStop(1, 'rgba(200,140,40,0.42)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
      // Hiekanjyvät
      for (const p of weatherParticles) {
        ctx.globalAlpha = p.alpha || 0.5;
        ctx.fillStyle = `hsl(${36 + Math.round(p.r * 4)}, 72%, 52%)`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 2.5, p.r * 0.7, Math.atan2(sandstormPush.y, sandstormPush.x), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Tuulinuoli HUDissa (oikeassa yläkulmassa)
      const arrowX = 22, arrowY = viewport.height - 28;
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(Math.atan2(sandstormPush.y, sandstormPush.x));
      ctx.fillStyle = 'rgba(220,160,40,0.85)';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('💨 Tuuli', 18, 5);
      ctx.beginPath();
      ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
      ctx.moveTo(5, -6); ctx.lineTo(12, 0); ctx.lineTo(5, 6);
      ctx.strokeStyle = 'rgba(255,200,80,0.9)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    } else if (weather === 'clear') {
      for (const p of weatherParticles) {
        if (p.type === 'spring') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = 'rgba(255, 182, 193, 0.85)';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.5, p.r * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'summer') {
          const alpha = 0.3 + 0.6 * Math.abs(Math.sin(p.drift));
          ctx.fillStyle = `rgba(255, 235, 59, ${alpha})`;
          ctx.save();
          ctx.shadowColor = '#fff59d';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'autumn') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.h);
          ctx.lineTo(p.w, 0);
          ctx.lineTo(0, p.h);
          ctx.lineTo(-p.w, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'winter') {
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Revontulet ruutukoordinaateissa (jos revontulitapahtuma on käynnissä)
    if (fieldEvent && fieldEvent.type === 'aurora') {
      const pulse = 0.5 + 0.5 * Math.abs(Math.sin(gameTime * 2));
      const grd = ctx.createLinearGradient(0, 0, 0, viewport.height * 0.75);
      grd.addColorStop(0, `rgba(0, 255, 120, ${0.15 * pulse})`);
      grd.addColorStop(0.3, `rgba(170, 70, 255, ${0.12 * pulse})`);
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }
  }

  // Minikartta isoa maailmaa varten: husky, rakennukset, pedot, kulta, näkymä
  function drawMinimap() {
    const mw = 150, mh = Math.round(mw * world.height / world.width); // 150 x 100
    const ox = viewport.width - mw - 12, oy = 52; // oikea yläkulma, HUDin alle
    const sx = mw / world.width, sy = mh / world.height;
    ctx.save();
    // Tausta
    ctx.fillStyle = 'rgba(10,15,10,0.65)';
    ctx.fillRect(ox - 3, oy - 3, mw + 6, mh + 6);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ox - 3, oy - 3, mw + 6, mh + 6);
    // Rakennukset
    for (const s of structures) {
      ctx.fillStyle = s.kind === 'house' ? '#d8a060' : s.kind === 'den' ? '#7a5a3a' : '#888890';
      ctx.fillRect(ox + s.x * sx - 2.5, oy + s.y * sy - 2.5, 5, 5);
    }
    // Kultaluut
    for (const c of collectibles) {
      if (!c.gold) continue;
      ctx.fillStyle = '#ffe070';
      ctx.fillRect(ox + c.x * sx - 1, oy + c.y * sy - 1, 2, 2);
      }
      // Näkyvä alue (viewport)
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.strokeRect(ox + cam.x * sx, oy + cam.y * sy, viewport.width * sx, viewport.height * sy);
      // Husky
      ctx.fillStyle = '#7ad0ff';
      ctx.beginPath();
      ctx.arc(ox + husky.x * sx, oy + husky.y * sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function loop(time) {
      if (!running) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, 0.05)); // rajaa isot hypyt, ei negatiivinen
      lastTime = time;
      update(dt);

      if (running && typeof husky !== 'undefined' && husky) {
        if (lastHuskyX !== null && lastHuskyY !== null) {
          const dx = husky.x - lastHuskyX;
          const dy = husky.y - lastHuskyY;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < 120) {
            shopData.stats.distanceTraveled = (shopData.stats.distanceTraveled || 0) + dist * 0.05;
          }
        }
        lastHuskyX = husky.x;
        lastHuskyY = husky.y;
      } else {
        lastHuskyX = null;
        lastHuskyY = null;
      }

      if (running) {
        updateTempHud();
        updateClockHUD();
        updateCompass();
        updateRadar();
        draw();
        requestAnimationFrame(loop);
      }
    }

    // ============================================================
    // MAAILMANKARTTA (Slay the Spire -tyylinen reitinvalinta)
    // ============================================================
    const MAP_NODE_TYPES = [
      { type: 'battle',  emoji: '⚔️', label: 'Taistelu',   color: '#c0392b' },
      { type: 'dungeon', emoji: '🏛️', label: 'Luolasto',   color: '#7d3c98' },
      { type: 'rest',    emoji: '⛺',  label: 'Lepopaikka', color: '#1a8a3c' },
      { type: 'boss',    emoji: '👑',  label: 'Pomo',       color: '#b8860b' },
      { type: 'event',   emoji: '❓',  label: 'Mysteeri',   color: '#2e86c1' },
      { type: 'merchant',emoji: '🛒',  label: 'Kauppias',   color: '#e67e22' },
      { type: 'treasure',emoji: '💎',  label: 'Aarre',      color: '#1de9b6' },
    ];

    function wobblyCirclePath(cx, cy, r, segments = 8, wobbleRange = 8) {
      const points = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const wr = r + (Math.random() - 0.5) * wobbleRange;
        points.push({
          x: cx + Math.cos(angle) * wr,
          y: cy + Math.sin(angle) * wr
        });
      }
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < segments; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
      }
      d += ' Z';
      return d;
    }

    function generateWorldMapDeco(mode) {
      worldMapDeco = [];
      const isIsland = (mode === 'island');
      const ROWS = isIsland ? 7 : 12;
      const PANEL_H = ROWS * 100;
      const PANEL_W = 480;

      if (!isIsland) {
        // Generoidaan mannermaamassat dynaamisesti pitkin kartan pituutta
        const landmasses = [];
        // Asetetaan isoja maa-alueita tasaisin välein
        for (let y = 80; y < PANEL_H; y += 180) {
          const cx = 80 + Math.random() * (PANEL_W - 160);
          const cy = y;
          const r = 90 + Math.random() * 80;
          landmasses.push({ cx, cy, r, fill: '#eddba4', stroke: '#d9c792' });
        }
        // Lisätään myös reunakontinentteja
        landmasses.push({ cx: 0, cy: PANEL_H * 0.2, r: 120, fill: '#eddba4', stroke: '#d9c792' });
        landmasses.push({ cx: PANEL_W, cy: PANEL_H * 0.5, r: 140, fill: '#eddba4', stroke: '#d9c792' });
        landmasses.push({ cx: 0, cy: PANEL_H * 0.8, r: 130, fill: '#eddba4', stroke: '#d9c792' });

        for (const lm of landmasses) {
          const d = wobblyCirclePath(lm.cx, lm.cy, lm.r, 12, 18);
          worldMapDeco.push({ type: 'landmass', d, fill: lm.fill, stroke: lm.stroke });
        }

        // Vuoret (generoidaan pitkin karttaa)
        const mountCount = 6 + ROWS * 1.5;
        for (let i = 0; i < mountCount; i++) {
          const mx = 100 + Math.random() * (PANEL_W - 200);
          const my = 60 + Math.random() * (PANEL_H - 120);
          const mh = 14 + Math.random() * 10;
          const mw = 18 + Math.random() * 12;
          worldMapDeco.push({
            type: 'mountain',
            points: `${mx},${my} ${mx - mw/2},${my + mh} ${mx + mw/2},${my + mh}`,
            fill: '#c2b286',
            stroke: '#9e9069'
          });
        }

        // Puut (generoidaan pitkin karttaa maan päälle)
        const treeCount = 15 + ROWS * 3;
        for (let i = 0; i < treeCount; i++) {
          const tx = 40 + Math.random() * (PANEL_W - 80);
          const ty = 40 + Math.random() * (PANEL_H - 80);
          let onLand = false;
          for (const lm of landmasses) {
            if (Math.hypot(tx - lm.cx, ty - lm.cy) < lm.r) { onLand = true; break; }
          }
          if (onLand) {
            worldMapDeco.push({
              type: 'tree',
              cx: tx, cy: ty,
              r: 3.5 + Math.random() * 3,
              fill: '#8da660',
              stroke: '#6a7f45'
            });
          }
        }

        // Kompassi yläkulmaan
        worldMapDeco.push({ type: 'compass', cx: PANEL_W - 55, cy: 65 });
      } else {
        // Saariseikkailussa ei tarvita isoa mannerta, mutta voidaan lisätä aaltoja ja merihirviöitä
        const waveCount = 8 + ROWS * 2;
        for (let i = 0; i < waveCount; i++) {
          const wx = 40 + Math.random() * (PANEL_W - 80);
          const wy = 40 + Math.random() * (PANEL_H - 80);
          worldMapDeco.push({
            type: 'wave',
            d: `M ${wx} ${wy} Q ${wx+8} ${wy-6} ${wx+16} ${wy} Q ${wx+24} ${wy-6} ${wx+32} ${wy}`,
            stroke: 'rgba(255,255,255,0.08)'
          });
        }
        // Lisätään muutama merihirviö tai merilintu koristeeksi
        worldMapDeco.push({
          type: 'monster',
          d: `M 80 ${PANEL_H * 0.3} Q 95 ${PANEL_H * 0.3 - 15} 110 ${PANEL_H * 0.3} Q 118 ${PANEL_H * 0.3 + 10} 110 ${PANEL_H * 0.3 + 20} Q 95 ${PANEL_H * 0.3 + 12} 80 ${PANEL_H * 0.3}`,
          fill: '#081d30', stroke: '#1a4f7c'
        });
      }
    }

    function generateWorldMap(mode) {
      const isIsland = (mode === 'island');
      const ROWS = isIsland ? 7 : 12;
      const COLS = 3;
      const PANEL_W = 480;
      const PANEL_H = ROWS * 100;
      worldMapNodes = [];
      worldMapEdges = [];

      let id = 0;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          let type;
          let emoji;
          let label;
          let color;

          if (row === ROWS - 1) {
            type = 'boss';
            emoji = '👑';
            label = isIsland ? 'Pomosaari' : 'Pomo';
            color = '#f1c40f';
          } else if (row === 0) {
            const isDungeon = Math.random() < 0.45;
            type = isDungeon ? 'dungeon' : 'battle';
            emoji = isDungeon ? '🏛️' : (isIsland ? '🌴' : '⚔️');
            label = isDungeon ? (isIsland ? 'Meriluola' : 'Luolasto') : (isIsland ? 'Saaritaistelu' : 'Taistelu');
            color = isDungeon ? '#9b59b6' : (isIsland ? '#16a085' : '#e74c3c');
          } else {
            const rVal = Math.random();
            if (rVal < 0.35) {
              type = 'battle';
              emoji = isIsland ? '🌴' : '⚔️';
              label = isIsland ? 'Saaritaistelu' : 'Taistelu';
              color = isIsland ? '#16a085' : '#e74c3c';
            } else if (rVal < 0.52) {
              type = 'dungeon';
              emoji = '🏛️';
              label = isIsland ? 'Laivaluola' : 'Luolasto';
              color = '#9b59b6';
            } else if (rVal < 0.65) {
              type = 'rest';
              emoji = '⛺';
              label = isIsland ? 'Leposaari' : 'Lepopaikka';
              color = '#2ecc71';
            } else if (rVal < 0.77) {
              type = 'event';
              emoji = '❓';
              label = isIsland ? 'Mysteeriulappa' : 'Mysteeri';
              color = '#3498db';
            } else if (rVal < 0.88) {
              type = 'merchant';
              emoji = '🛒';
              label = isIsland ? 'Kauppiaslaiva' : 'Kauppias';
              color = '#e67e22';
            } else {
              type = 'treasure';
              emoji = '💎';
              label = isIsland ? 'Aarresaari' : 'Jalokivikammio';
              color = '#1de9b6';
            }
          }

          const px = 48 + col * ((PANEL_W - 96) / (COLS - 1));
          const py = 34 + row * ((PANEL_H - 68) / (ROWS - 1));
          worldMapNodes.push({
            id: id++, row, col,
            x: px, y: py,
            type, emoji, label, color,
            cleared: false, available: row === 0,
          });
        }
      }

      // Reitit: joka rivi -> seuraava
      for (let row = 0; row < ROWS - 1; row++) {
        for (let col = 0; col < COLS; col++) {
          const from = worldMapNodes[row * COLS + col];
          const targets = [col - 1, col, col + 1].filter(c => c >= 0 && c < COLS);
          for (const tc of targets) {
            const to = worldMapNodes[(row + 1) * COLS + tc];
            worldMapEdges.push({ from: from.id, to: to.id });
          }
        }
      }

      generateWorldMapDeco(mode);
    }

  function showWorldMap(mode, regenerate = false) {
    adventureMode = mode || 'mainland';
    if (regenerate) {
      generateWorldMap(adventureMode);
    }
    renderWorldMap();
    // Vaihda näkymä: piilota aloitussisltö, näytä kartta
    const overlayContent = document.getElementById('overlay-content');
    const mapPanel = document.getElementById('map-panel');
    if (overlayContent) overlayContent.classList.add('hidden');
    if (mapPanel) mapPanel.classList.remove('hidden');

    // Vieritetään kartta pehmeästi aktiivisen tason kohdalle
    setTimeout(() => {
      const activeNode = worldMapNodes.find(n => n.available && !n.cleared);
      if (activeNode) {
        const containerInner = document.getElementById('map-container-inner');
        if (containerInner) {
          containerInner.scrollTo({
            top: activeNode.y - 180, // Keskitetään pystysuunnassa (380/2 = 190)
            behavior: 'smooth'
          });
        }
      }
    }, 120);
  }

  function hideWorldMap() {
    const overlayContent = document.getElementById('overlay-content');
    const mapPanel = document.getElementById('map-panel');
    if (mapPanel) mapPanel.classList.add('hidden');
    if (overlayContent) overlayContent.classList.remove('hidden');
    const photoBtn = document.getElementById('victory-photo-btn');
    if (photoBtn) {
      photoBtn.classList.add('hidden');
    }
  }

  function renderWorldMap() {
    const container = document.getElementById('map-nodes-container');
    const svg = document.getElementById('map-svg');
    if (!container || !svg) return;

    // Päivitetään otsikko ja legend dynaamisesti tilan mukaan
    const titleEl = document.querySelector('#map-panel h2');
    if (titleEl) {
      titleEl.textContent = (adventureMode === 'island') ? '⛵ Saariseikkailukartta' : '🌍 Maailmanmatkakartta';
    }

    const maxRow = worldMapNodes.reduce((max, n) => Math.max(max, n.row), 0);
    const ROWS = maxRow + 1;
    const PANEL_H = ROWS * 100;
    const PANEL_W = 480;

    svg.setAttribute('height', PANEL_H);
    svg.style.height = `${PANEL_H}px`;
    container.style.height = `${PANEL_H}px`;

    const legendEl = document.querySelector('.map-legend');
    if (legendEl) {
      if (adventureMode === 'island') {
        legendEl.innerHTML = `
          <span>🌴 Saari</span>
          <span>🏛️ Laivaluola</span>
          <span>⛺ Leposaari</span>
          <span>👑 Pomo</span>
          <span>❓ Mysteeri</span>
          <span>🛒 Kauppias</span>
          <span>💎 Aarresaari</span>
        `;
      } else {
        legendEl.innerHTML = `
          <span>⚔️ Taistelu</span>
          <span>🏛️ Luolasto</span>
          <span>⛺ Lepo</span>
          <span>👑 Pomo</span>
          <span>❓ Mysteeri</span>
          <span>🛒 Kauppias</span>
          <span>💎 Jalokivi</span>
        `;
      }
    }

    const innerContainer = document.getElementById('map-container-inner');
    if (innerContainer) {
      if (adventureMode === 'island') {
        innerContainer.style.background = 'radial-gradient(circle, #103352 0%, #081d30 100%)';
        innerContainer.style.border = '2px solid rgba(255,255,255,0.15)';
        innerContainer.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.8)';
      } else {
        innerContainer.style.background = '#e5d5ac';
        innerContainer.style.border = '3px double #8d6e63';
        innerContainer.style.boxShadow = 'inset 0 0 25px rgba(110,80,40,0.3)';
      }
    }

    let svgHtml = '';

    if (adventureMode === 'mainland') {
      // 1. Piirretään mannermaan taustakoristeet (landmasses)
      for (const dec of worldMapDeco) {
        if (dec.type === 'landmass') {
          svgHtml += `<path d="${dec.d}" fill="${dec.fill}" stroke="${dec.stroke}" stroke-width="2" stroke-linejoin="round" />`;
        }
      }
      
      // 2. Piirretään rannikon korostusviivat (coast lines)
      for (const dec of worldMapDeco) {
        if (dec.type === 'landmass') {
          svgHtml += `<path d="${dec.d}" fill="none" stroke="rgba(188,174,140,0.4)" stroke-width="6" stroke-linejoin="round" />`;
        }
      }
      
      // 3. Piirretään solmupohjat (hand-drawn ympyrä solmujen alle)
      for (const n of worldMapNodes) {
        const d = wobblyCirclePath(n.x, n.y, 25, 8, 2);
        svgHtml += `<path d="${d}" fill="#d2c39c" stroke="#bdae8c" stroke-width="1.5" />`;
      }
    } else {
      // Saariseikkailu: piirretään saaret jokaisen solmun alle
      for (const n of worldMapNodes) {
        const sandD = wobblyCirclePath(n.x, n.y, 34, 8, 3);
        svgHtml += `<path d="${sandD}" fill="#eed392" stroke="#d5b873" stroke-width="1.5" />`;
        const grassD = wobblyCirclePath(n.x, n.y, 24, 8, 2.5);
        svgHtml += `<path d="${grassD}" fill="#7cb342" stroke="#558b2f" stroke-width="1" />`;
      }
    }

    // 4. Piirretään muut koristeet (vuoret, puut, aallot, laivat, hirviöt, kompassi)
    for (const dec of worldMapDeco) {
      if (dec.type === 'mountain') {
        svgHtml += `<polygon points="${dec.points}" fill="${dec.fill}" stroke="${dec.stroke}" stroke-width="1" />`;
      } else if (dec.type === 'tree') {
        svgHtml += `<circle cx="${dec.cx}" cy="${dec.cy}" r="${dec.r}" fill="${dec.fill}" stroke="${dec.stroke}" stroke-width="0.8" />`;
      } else if (dec.type === 'wave') {
        svgHtml += `<path d="${dec.d}" fill="none" stroke="${dec.stroke}" stroke-width="1.5" stroke-linecap="round" />`;
      } else if (dec.type === 'monster') {
        svgHtml += `<path d="${dec.d}" fill="${dec.fill}" stroke="${dec.stroke}" stroke-width="1.2" />`;
      } else if (dec.type === 'ship') {
        svgHtml += `
          <g transform="translate(${dec.x}, ${dec.y}) scale(0.9)">
            <path d="M -10 5 L 10 5 L 7 11 L -7 11 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="1" />
            <path d="M 0 5 L 0 -13 L -8 2 Z" fill="#f5f5f5" stroke="#ccc" stroke-width="0.8" />
            <path d="M 0 5 L 0 -11 L 6 2 Z" fill="#f5f5f5" stroke="#ccc" stroke-width="0.8" />
          </g>
        `;
      } else if (dec.type === 'compass') {
        svgHtml += `
          <g transform="translate(${dec.cx}, ${dec.cy}) scale(0.65)">
            <circle cx="0" cy="0" r="22" fill="none" stroke="#8d6e63" stroke-width="1" stroke-dasharray="2,2" />
            <polygon points="0,0 -4,-5 0,-25" fill="#c62828" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 4,-5 0,-25" fill="#e53935" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 -4,5 0,25" fill="#bcae8c" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 4,5 0,25" fill="#dcd0ab" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 5,-4 25,0" fill="#8d6e63" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 5,4 25,0" fill="#bcae8c" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 -5,-4 -25,0" fill="#8d6e63" stroke="#8d6e63" stroke-width="0.5" />
            <polygon points="0,0 -5,4 -25,0" fill="#bcae8c" stroke="#8d6e63" stroke-width="0.5" />
            <text x="-3" y="-28" fill="#c62828" font-family="sans-serif" font-weight="bold" font-size="10px">N</text>
          </g>
        `;
      }
    }

    if (adventureMode === 'mainland') {
      // Piirretään maamerkkien otsikot kullekin riville
      for (let row = 0; row < ROWS; row++) {
        const dest = getDestinationForLevel(row + 1);
        const py = 34 + row * ((PANEL_H - 68) / (ROWS - 1));
        svgHtml += `
          <text x="${PANEL_W / 2}" y="${py - 24}" fill="#4e342e" font-family="sans-serif" font-weight="bold" font-size="11.5px" text-anchor="middle" letter-spacing="1">
            ${row + 1}. ${dest.country} — ${dest.region}
          </text>
          <line x1="40" y1="${py - 28}" x2="440" y2="${py - 28}" stroke="rgba(93,64,55,0.15)" stroke-width="1.2" stroke-dasharray="3,3" />
        `;
      }
    }

    // 5. Piirretään reittiviivat solmujen välille (SVG edges)
    svgHtml += worldMapEdges.map(e => {
      const f = worldMapNodes.find(n => n.id === e.from);
      const t = worldMapNodes.find(n => n.id === e.to);
      
      let strokeColor, strokeWidth, dashArray;
      if (adventureMode === 'mainland') {
        const clearedRoute = f.cleared && t.available;
        strokeColor = clearedRoute ? '#a15c38' : 'rgba(141,110,99,0.3)';
        strokeWidth = clearedRoute ? '2.5' : '1.8';
        dashArray = '4,4';
      } else {
        const clearedRoute = f.cleared && t.available;
        strokeColor = clearedRoute ? '#ffe082' : 'rgba(255,255,255,0.2)';
        strokeWidth = clearedRoute ? '2.5' : '1.8';
        dashArray = clearedRoute ? '' : '5,5';
      }
      return `<line x1="${f.x}" y1="${f.y}" x2="${t.x}" y2="${t.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArray}" />`;
    }).join('');

    svg.innerHTML = svgHtml;

    // Draw nodes
    container.innerHTML = worldMapNodes.map(n => {
      const cls = n.cleared ? 'map-node cleared' : (n.available ? 'map-node available' : 'map-node locked');
      return `<div class="${cls}" data-id="${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:44px;height:44px;border-radius:50%;background:${n.color};display:flex;align-items:center;justify-content:center;font-size:20px;cursor:${n.available && !n.cleared ? 'pointer' : 'default'};border:2px solid ${n.available && !n.cleared ? '#fff' : 'rgba(255,255,255,0.3)'};opacity:${n.available || n.cleared ? '1' : '0.4'};box-shadow:${n.available && !n.cleared ? '0 0 10px #fff8' : 'none'};transition:transform 0.15s;" title="${n.label}">${n.cleared ? '✓' : n.emoji}</div>`;
    }).join('');

    // Click handlers
    container.querySelectorAll('.map-node.available').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        const node = worldMapNodes.find(n => n.id === id);
        if (!node || node.cleared) return;
        selectMapNode(node);
      });
    });
  }

  function selectMapNode(node) {
    selectedMapNode = node;
    const photoBtn = document.getElementById('victory-photo-btn');
    if (photoBtn) {
      photoBtn.classList.add('hidden');
    }
    
    if (node.type === 'rest') {
      lives = Math.min(maxLives, lives + 1);
      node.cleared = true;
      unlockNextRow(node);
      
      Audio.play('legendary');
      showBanner('⛺ Lepopaikka — Husky sai elämän! +1 ❤️');
      
      renderWorldMap();
      // Näytetään kartta (pysytään tässä näkymässä)
      const overlayContent = document.getElementById('overlay-content');
      const mapPanel = document.getElementById('map-panel');
      if (overlayContent) overlayContent.classList.add('hidden');
      if (mapPanel) mapPanel.classList.remove('hidden');
      overlay.classList.remove('hidden');
    } else if (node.type === 'event') {
      openMysteryEvent(node);
    } else if (node.type === 'merchant') {
      openMapMerchant(node);
    } else {
      // Suljetaan kartta/overlay ja aloitetaan peli
      hideWorldMap();
      overlay.classList.add('hidden');
      
      if (node.type === 'dungeon') {
        setupFieldForCurrentLevel();
        overlay.classList.add('hidden');
        Audio.startMusic();
        enterDungeon(node);
      } else if (node.type === 'treasure') {
        setupFieldForCurrentLevel();
        overlay.classList.add('hidden');
        Audio.startMusic();
        enterTreasure(node);
      } else if (node.type === 'battle' || node.type === 'boss') {
        if (adventureMode === 'island') {
          overlay.classList.add('hidden');
          Audio.startMusic();
          enterIsland(node);
        } else {
          setupFieldForCurrentLevel();
          overlay.classList.add('hidden');
          Audio.startMusic();
          const dest = getDestinationForLevel(level);
          showBanner(`${node.emoji} ${dest.country} (${dest.region}) — ${node.label}! 🌍`);
          running = true;
          lastTime = performance.now();
          requestAnimationFrame(loop);
        }
      }
    }
  }

  function openMapMerchant(node) {
    selectedMapNode = node;
    shopOpenedFromMap = true;
    openShop();
  }

  function gainXp(amount) {
    const trophyMul = shopData.cabinUpgrades.trophyWall ? 0.15 : 0.0;
    const stampXpMul = (shopData.unlockedStamps && shopData.unlockedStamps['USA 🇺🇸']) ? 0.10 : 0.0;
    const baseMult = perks.xpMultiplier || 1.0;
    const fossilXpMul = shopData.fossils ? (Object.values(shopData.fossils).filter(Boolean).length * 0.05) : 0.0;
    const xpGained = Math.round(amount * baseMult * (1.0 + trophyMul + stampXpMul + fossilXpMul));
    huskyXp += xpGained;
    
    if (husky && xpGained > 0) {
      spawnTextParticle(husky.x, husky.y - 20, `+${xpGained} XP! ✨`, '#b2fef7');
    }

    updateXpBar();
    if (huskyXp >= xpToNext) {
      offerSkill();
    }
  }

  function openMysteryEvent(node) {
    const eventDiv = document.createElement('div');
    eventDiv.id = 'event-overlay';
    eventDiv.className = 'custom-overlay';
    eventDiv.style = `
      position: absolute;
      left: 0; top: 0; width: 100%; height: 100%;
      background: rgba(10, 14, 26, 0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      color: #fff;
      font-family: sans-serif;
      text-align: center;
    `;
    
    const stories = [
      {
        title: "🏚️ Vanha tukkikämppä",
        text: "Löydät tiheiköstä hylätyn puisen kämpän. Sen raollaan olevan oven takaa kuuluu omituista rapinaa...",
        choices: [
          {
            text: "Tutki kämpän kaapit (Riski! ⚠️)",
            action: () => {
              if (Math.random() < 0.5) {
                shopData.totalGems += 8;
                saveShopData();
                Audio.play('gem');
                return "Löysit kaapista pölyisen purkin täynnä loistavia jalokiviä! (💎 +8)";
              } else {
                lives = Math.max(1, lives - 1);
                Audio.play('hurt');
                return "Vihaiset lepakot hyökkäsivät kaapista! Menetit yhden elämän. (💔 -1 ❤️)";
              }
            }
          },
          {
            text: "Lepää kuistilla (Parannus ⛺)",
            action: () => {
              if (lives < maxLives) {
                lives++;
                Audio.play('legendary');
                return "Kuisti oli mukava ja turvallinen. Sait takaisin 1 elämän! (❤️ +1)";
              } else {
                gainXp(50);
                Audio.play('level');
                return "Kaikki elämät ovat täynnä! Sait sen sijaan 50 XP-pistettä. (✨ +50 XP)";
              }
            }
          },
          {
            text: "Jatka matkaa varovasti",
            action: () => "Päätit ohittaa kämpän ja jatkaa seikkailua turvallisesti."
          }
        ]
      },
      {
        title: "🦊 Vanha Kettu",
        text: "Tapaat vanhan ystävällisen ketun, joka keittää teetä sammalmättäällä. Se tarjoaa sinulle kupillisen kuumaa kuusenkerkkäteetä.",
        choices: [
          {
            text: "Juo kuppi teetä (Nopeus ⚡)",
            action: () => {
              husky.speed *= 1.15;
              Audio.play('legendary');
              return "Tee oli mahtavaa ja virkistävää! Sait pysyvän +15% nopeusedun tämän seikkailun ajaksi! (⚡ Nopeus +15%)";
            }
          },
          {
            text: "Kieltäydy ja jutustele",
            action: () => {
              shopData.totalGems += 4;
              saveShopData();
              Audio.play('gem');
              return "Kettu arvostaa seuraasi ja antaa sinulle pienen lahjan matkaevääksi! (💎 +4)";
            }
          }
        ]
      },
      {
        title: "⛲ Toivomuslähde",
        text: "Saavut sammaleisen toivomuslähteen äärelle. Sen kirkkaan veden pohjalla kimaltelee kolikoita.",
        choices: [
          {
            text: "Heitä jalokivi lähteeseen (Maksaa 3 💎)",
            action: () => {
              if (shopData.totalGems >= 3) {
                shopData.totalGems -= 3;
                saveShopData();
                Audio.play('legendary');
                perks.xpMultiplier = (perks.xpMultiplier || 1.0) * 1.5;
                return "Lähteen henki otti jalokiven ja siunasi sinua! Saat nyt 50% enemmän XP-pisteitä tässä seikkailussa! (✨ XP +50%)";
              } else {
                return "Sinulla ei ole tarpeeksi jalokiviä heitettäväksi... (Tarvitset vähintään 3 💎)";
              }
            }
          },
          {
            text: "Koita onkia kolikko lähteestä (40% onni)",
            action: () => {
              if (Math.random() < 0.4) {
                shopData.totalGems += 6;
                saveShopData();
                Audio.play('gem');
                return "Onnistuit onkimaan kiiltävän jalokiven ilman ongelmia! (💎 +6)";
              } else {
                lives = Math.max(1, lives - 1);
                Audio.play('hurt');
                return "Liukastuit märkään reunaan ja loukkasit itsesi veteen pudotessasi! (💔 -1 ❤️)";
              }
            }
          },
          {
            text: "Ohita lähde",
            action: () => "Jätit lähteen rauhaan ja jatkoit matkaasi."
          }
        ]
      }
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];
    
    eventDiv.innerHTML = `
      <div style="max-width: 500px; background: rgba(30,40,60,0.85); border: 2px solid #5499c7; border-radius: 12px; padding: 24px; box-shadow: 0 0 20px rgba(0,0,0,0.6);">
        <h2 style="color: #5499c7; margin-top: 0; font-size: 26px;">${story.title}</h2>
        <p style="font-size: 16px; line-height: 1.5; margin: 18px 0; color: #dfe6e9;">${story.text}</p>
        <div id="choice-buttons" style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;"></div>
      </div>
    `;
    
    document.getElementById('game-container').appendChild(eventDiv);
    
    const btnContainer = eventDiv.querySelector('#choice-buttons');
    story.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.style = `
        background: #2e86c1; color: #fff; border: none; border-radius: 6px;
        padding: 12px; font-size: 14px; font-weight: bold; cursor: pointer;
        transition: background 0.15s; text-shadow: 0 1px 2px rgba(0,0,0,0.4);
      `;
      btn.textContent = c.text;
      btn.onmouseover = () => { btn.style.background = '#2471a3'; };
      btn.onmouseout = () => { btn.style.background = '#2e86c1'; };
      
      btn.onclick = () => {
        const resultText = c.action();
        eventDiv.innerHTML = `
          <div style="max-width: 500px; background: rgba(30,40,60,0.9); border: 2px solid #2ecc71; border-radius: 12px; padding: 24px; box-shadow: 0 0 20px rgba(0,0,0,0.6);">
            <h2 style="color: #2ecc71; margin-top: 0; font-size: 24px;">Tulos</h2>
            <p style="font-size: 16px; line-height: 1.5; margin: 18px 0; color: #dfe6e9;">${resultText}</p>
            <button id="close-event-btn" style="
              background: #2ecc71; color: #fff; border: none; border-radius: 6px;
              padding: 12px 24px; font-size: 15px; font-weight: bold; cursor: pointer;
              margin-top: 15px;
            ">Jatka matkaa</button>
          </div>
        `;
        eventDiv.querySelector('#close-event-btn').onclick = () => {
          eventDiv.remove();
          node.cleared = true;
          unlockNextRow(node);
          renderWorldMap();
        };
      };
      btnContainer.appendChild(btn);
    });
  }

  function unlockNextRow(clearedNode) {
    const nextRow = clearedNode.row + 1;
    
    // Lukitaan kaikki solmut
    worldMapNodes.forEach(n => { n.available = false; });
    
    const maxRow = worldMapNodes.reduce((m, n) => Math.max(m, n.row), 0);
    if (nextRow > maxRow) return;

    // Etsitään vain ne solmut, joihin on yhteys tästä solmusta
    const connectedTargets = worldMapEdges
      .filter(e => e.from === clearedNode.id)
      .map(e => e.to);

    // Avataan seuraavan rivin yhdistetyt solmut
    worldMapNodes
      .filter(n => n.row === nextRow && connectedTargets.includes(n.id))
      .forEach(n => { n.available = true; });
  }

  // ============================================================
  // LUOLASTO
  // ============================================================
  function generateDungeon() {
    const W = 1600, H = 1200;
    const TRAP_COUNT = 8 + level * 2;
    const CHEST_COUNT = 3 + Math.floor(level / 2);
    const traps = [], chests = [];

    // Sokkelon seinät (x, y, leveys, korkeus) - isompi, sokkelomaisempi alue
    const walls = [];
    const wallDefs = [
      // Pitkät rajaavat sokkeloseinät
      { x: 300, y: 0, w: 40, h: 450 },
      { x: 300, y: 650, w: 40, h: 550 },
      
      { x: 600, y: 200, w: 500, h: 40 },
      { x: 600, y: 240, w: 40, h: 450 },
      
      { x: 100, y: 900, w: 900, h: 40 },
      
      { x: 1200, y: 0, w: 40, h: 800 },
      { x: 800, y: 550, w: 400, h: 40 },
      
      { x: 1200, y: 950, w: 400, h: 40 },
      { x: 1400, y: 200, w: 40, h: 600 },
      
      { x: 400, y: 1050, w: 600, h: 40 }
    ];
    for (const wd of wallDefs) {
      walls.push(wd);
    }

    // Helper: Tarkistetaan ettei asioita luoda seinien sisälle
    function collidesWithWall(x, y, r) {
      for (const w of walls) {
        if (x + r > w.x && x - r < w.x + w.w &&
            y + r > w.y && y - r < w.y + w.h) {
          return true;
        }
      }
      return false;
    }

    const margin = 80;
    for (let i = 0; i < TRAP_COUNT; i++) {
      let tx, ty, attempts = 0;
      do {
        tx = margin + Math.random() * (W - margin * 2);
        ty = margin + Math.random() * (H - margin * 2);
        attempts++;
      } while ((collidesWithWall(tx, ty, 25) || (tx < 200 && ty < 200)) && attempts < 50);

      traps.push({
        x: tx, y: ty,
        radius: 20,
        cooldown: 0,
        active: false,
        activeTimer: 0,
      });
    }

    for (let i = 0; i < CHEST_COUNT; i++) {
      let cx, cy, attempts = 0;
      do {
        cx = margin + Math.random() * (W - margin * 2);
        cy = margin + Math.random() * (H - margin * 2);
        attempts++;
      } while ((collidesWithWall(cx, cy, 25) || (cx < 200 && cy < 200)) && attempts < 50);

      chests.push({
        x: cx, y: cy,
        radius: 18,
        opened: false,
      });
    }

    // Asetetaan yksi satunnainen arkku Portaaliavaimen sisältäväksi arkuksi
    if (chests.length > 0) {
      const keyIdx = Math.floor(Math.random() * chests.length);
      for (let i = 0; i < chests.length; i++) {
        chests[i].hasKey = (i === keyIdx);
      }
    }

    // Portaali (poistuminen) oikeassa alakulmassa
    const portal = { x: W - 100, y: H - 100, radius: 28 };

    dungeonData = { traps, chests, portal, walls, W, H };
    dungeonSpikeCooldowns = {};
    dungeonCoconutProjectiles = [];
  }

  // ============================================================
  // AARREKAMMIO / JALOKIVIKAMMIO
  // ============================================================
  function enterTreasure(node) {
    scene = 'treasure';
    running = true;
    treasureProgress = 0;
    activeChest = null;

    husky.x = 240;
    husky.y = 300;
    husky.vx = 0;
    husky.vy = 0;
    husky.moving = false;

    const chests = [
      { id: 1, x: 120, y: 140, radius: 20, type: 'gems', opened: false },
      { id: 2, x: 240, y: 140, radius: 20, type: 'xp', opened: false },
      { id: 3, x: 360, y: 140, radius: 20, type: 'heal', opened: false }
    ];

    const types = ['gems', 'xp', 'heal', 'mimic'];
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    chests[0].type = types[0];
    chests[1].type = types[1];
    chests[2].type = types[2];

    treasureData = {
      chests,
      portal: { x: 240, y: 230, radius: 24, active: false },
      openedAny: false
    };

    const dest = getDestinationForLevel(level);
    showBanner(`💎 ${dest.country} — Jalokivikammio! Seiso arkun vieressä. Voit avata vain YHDEN!`);
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function updateTreasure(dt) {
    if (!treasureData) return;

    const dir = Input.getDirection();
    const isSprinting = Input.isSprinting();
    const speed = husky.speed * (perks.speedMul || 1.0) * (isSprinting ? 1.8 : 1.0) * dt;

    let nx = husky.x + dir.x * speed;
    let ny = husky.y + dir.y * speed;

    if (dir.x !== 0 || dir.y !== 0) {
      husky.facing = Math.atan2(dir.y, dir.x);
      husky.flip = dir.x < 0 ? -1 : 1;
      husky.moving = true;
      husky.animPhase += dt * (isSprinting ? 20 : 12);
    } else {
      husky.moving = false;
    }

    husky.x = Math.max(husky.radius + 15, Math.min(480 - husky.radius - 15, nx));
    husky.y = Math.max(husky.radius + 15, Math.min(360 - husky.radius - 15, ny));
    husky.animPhase += dt;

    if (invulnTimer > 0) invulnTimer -= dt;

    if (companion) {
      const targetX = husky.x - Math.cos(husky.facing) * 32;
      const targetY = husky.y - Math.sin(husky.facing) * 32;
      companion.x += (targetX - companion.x) * 0.1;
      companion.y += (targetY - companion.y) * 0.1;
      companion.flip = husky.flip;
      companion.moving = husky.moving;
      companion.animPhase = husky.animPhase;
    }

    if (!treasureData.openedAny) {
      let nearChest = null;
      for (const c of treasureData.chests) {
        if (Math.hypot(husky.x - c.x, husky.y - c.y) < c.radius + husky.radius + 8) {
          nearChest = c;
          break;
        }
      }

      if (nearChest && !husky.moving) {
        activeChest = nearChest;
        treasureProgress += dt;
        if (treasureProgress % 0.4 < dt) Audio.play('dig');
        if (treasureProgress >= 1.5) {
          openChest(nearChest);
          treasureProgress = 0;
          activeChest = null;
        }
      } else {
        if (activeChest) {
          treasureProgress = 0;
          activeChest = null;
        }
      }
    }

    if (treasureData.openedAny && treasureData.portal.active) {
      const dp = Math.hypot(husky.x - treasureData.portal.x, treasureData.portal.y - husky.y);
      if (dp < treasureData.portal.radius + husky.radius) {
        exitTreasure();
      }
    }
  }

  function openChest(chest) {
    chest.opened = true;
    treasureData.openedAny = true;

    if (chest.type === 'gems') {
      showBanner('💎 Löysit jalokiviarkun! Sait 15 jalokiveä!');
      shopData.totalGems += 15;
      saveShopData();
      Audio.play('legendary');
      spawnBurst(chest.x, chest.y, ['#00e5ff', '#ffffff', '#ffd700'], 35);
      spawnTextParticle(chest.x, chest.y, "+15 💎!", "#00e5ff");
    } else if (chest.type === 'xp') {
      showBanner('✨ Löysit kultaisen puruluun! Sait +100 XP:tä!');
      gainXp(100);
      Audio.play('legendary');
      spawnBurst(chest.x, chest.y, ['#ff4a8f', '#ffffff', '#ffd700'], 35);
    } else if (chest.type === 'heal') {
      showBanner('❤️ Terveysarkku! Palautti elämät ja nosti maksimielämää! (+1 ❤️)');
      maxLives = Math.min(6, maxLives + 1);
      lives = maxLives;
      updateHud();
      Audio.play('levelup');
      spawnBurst(chest.x, chest.y, ['#ff1744', '#ffffff', '#ff80ab'], 35);
      spawnTextParticle(chest.x, chest.y, "+1 Max ❤️!", "#ff1744");
    } else if (chest.type === 'mimic') {
      showBanner('⚠️ APUA! Se oli Mimic-valearkku! Se puri sinua ja pakeni! (💔 -1)');
      lives = Math.max(1, lives - 1);
      updateHud();
      Audio.play('hurt');
      spawnBurst(chest.x, chest.y, ['#ff3d00', '#555555', '#2c2e35'], 30);
      spawnTextParticle(chest.x, chest.y, "MIMIC! 💥", "#ff3d00");
    }

    treasureData.portal.active = true;
  }

  function exitTreasure() {
    running = false;
    scene = 'field';
    if (selectedMapNode) {
      selectedMapNode.cleared = true;
      unlockNextRow(selectedMapNode);
    }
    saveShopData();
    const oldDest = getDestinationForLevel(level);
    unlockStampForDestination(oldDest);
    showBanner(`✨ ${oldDest.country} — Aarrekammio selvitetty! Palaa karttaan.`);
    updateHud();
    setTimeout(() => {
      overlay.classList.remove('hidden');
      showWorldMap(adventureMode);
    }, 1200);
  }

  function drawTreasure() {
    ctx.fillStyle = '#0a141e';
    ctx.fillRect(0, 0, 480, 360);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < 480; gx += 40) {
      for (let gy = 0; gy < 360; gy += 40) {
        ctx.strokeRect(gx, gy, 40, 40);
      }
    }

    ctx.strokeStyle = '#050a0f';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 464, 344);

    ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
    ctx.beginPath();
    ctx.arc(120, 140, 30, 0, Math.PI * 2);
    ctx.arc(240, 140, 30, 0, Math.PI * 2);
    ctx.arc(360, 140, 30, 0, Math.PI * 2);
    ctx.fill();

    for (const c of treasureData.chests) {
      if (c.opened) continue;
      ctx.save();
      const chestEnt = {
        kind: 'chest',
        x: c.x,
        y: c.y,
        radius: c.radius,
        animPhase: 0,
        moving: false,
        flip: 1
      };
      Sprites.draw(ctx, chestEnt);
      ctx.restore();
    }

    if (treasureData.openedAny && treasureData.portal.active) {
      ctx.save();
      const portalEnt = {
        kind: 'portal',
        x: treasureData.portal.x,
        y: treasureData.portal.y,
        radius: treasureData.portal.radius,
        animPhase: gameTime,
        moving: true,
        flip: 1,
        locked: false
      };
      Sprites.draw(ctx, portalEnt);
      ctx.restore();

      ctx.fillStyle = '#ea80fc';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔑 PORTAALI AKTIIVINEN', treasureData.portal.x, treasureData.portal.y + treasureData.portal.radius + 12);
    }

    if (companion) {
      ctx.save();
      Sprites.draw(ctx, companion);
      ctx.restore();
    }

    ctx.save();
    Sprites.draw(ctx, husky);
    ctx.restore();
    
    drawTextParticles();
    drawBursts();
  }

  function enterDungeon(node) {
    dungeonKeyFound = false;
    portalCooldown = 0;
    generateDungeon();
    scene = 'dungeon';
    husky.x = 80;
    husky.y = 80;
    running = true;
    lastTime = performance.now();
    const dest = getDestinationForLevel(level);
    showBanner(`🏛️ ${dest.country} — Luolasto! 🔑 Etsi avain arkusta ja poistu portalista!`);
    requestAnimationFrame(loop);
    if (node) { selectedMapNode = node; }
  }

  function updateDungeon(dt) {
    if (!dungeonData) return;
    const { traps, chests, portal, walls, W, H } = dungeonData;

    // Liikuta husky käyttäen Input-ohjausta
    const dir = Input.getDirection();
    const isSprinting = Input.isSprinting();
    const spd = husky.speed * (perks.speedMul || 1) * (isSprinting ? 1.8 : 1.0) * dt;
    let nx = husky.x + dir.x * spd;
    let ny = husky.y + dir.y * spd;

    nx = Math.max(husky.radius, Math.min(W - husky.radius, nx));
    ny = Math.max(husky.radius, Math.min(H - husky.radius, ny));

    if (dir.x !== 0 || dir.y !== 0) {
      husky.facing = Math.atan2(dir.y, dir.x);
      husky.flip = dir.x < 0 ? -1 : 1;
      husky.moving = true;
      husky.animPhase += dt * (isSprinting ? 20 : 12);
    } else {
      husky.moving = false;
    }

    // Seinätörmäykset
    let blocked = false;
    for (const w of walls) {
      if (nx + husky.radius > w.x && nx - husky.radius < w.x + w.w &&
          ny + husky.radius > w.y && ny - husky.radius < w.y + w.h) {
        blocked = true; break;
      }
    }
    if (!blocked) { husky.x = nx; husky.y = ny; }

    husky.animPhase += dt;

    // Piikkiansoja
    for (let i = 0; i < traps.length; i++) {
      const trap = traps[i];
      if (trap.cooldown > 0) { trap.cooldown -= dt; continue; }
      const d = Math.hypot(husky.x - trap.x, husky.y - trap.y);
      trap.active = d < trap.radius * 2.5;
      if (trap.active) {
        trap.activeTimer = (trap.activeTimer || 0) + dt;
        if (trap.activeTimer > 0.5 && d < trap.radius + husky.radius) {
          // Vahingon teko
          if (invulnTimer <= 0) {
            const dead = hurtHusky(trap.x, trap.y, 'dungeon_spike');
            if (dead) { gameOver(); return; }
          }
          trap.activeTimer = 0;
          trap.cooldown = 2.2;
        }
      } else {
        trap.activeTimer = 0;
      }
    }

    if (invulnTimer > 0) invulnTimer -= dt;

    if (portalCooldown > 0) portalCooldown -= dt;

    // Arkkujen avaus
    for (const chest of chests) {
      if (chest.opened) continue;
      const d = Math.hypot(husky.x - chest.x, husky.y - chest.y);
      if (d < chest.radius + husky.radius + 10) {
        chest.opened = true;
        if (chest.hasKey) {
          dungeonKeyFound = true;
          spawnTextParticle(chest.x, chest.y - 12, "AVAIN! 🔑", "#ffb74d");
          showBanner('🔑 Löysit Portaaliavaimen! Portaali on nyt aktiivinen!');
          Audio.play('legendary');
          spawnBurst(chest.x, chest.y, ['#ffb74d', '#ffffff'], 24);
        } else {
          // Palkinto
          const roll = Math.random();
          if (roll < 0.35) {
            gemsFound++;
            spawnTextParticle(chest.x, chest.y - 12, "+1 Jalokivi! 💎", "#00e5ff");
            showBanner('📦 Arkku auki — löysit 💎 jalokiven!');
          } else if (roll < 0.65) {
            lives = Math.min(maxLives, lives + 1);
            spawnTextParticle(chest.x, chest.y - 12, "+1 Elämä! ❤️", "#ff1744");
            showBanner('📦 Arkku auki — löysit ❤️ lisäelämän!');
          } else {
            score++;
            spawnTextParticle(chest.x, chest.y - 12, "+1 Piste! 🏆", "#ffd700");
            showBanner('📦 Arkku auki — löysit piilotetun aarteen! +1 piste');
          }
          Audio.play('legendary');
          spawnBurst(chest.x, chest.y, ['#ffd54f'], 14);
        }
      }
    }

    // Portaali: poistuminen
    const dp = Math.hypot(husky.x - portal.x, husky.y - portal.y);
    if (dp < portal.radius + husky.radius) {
      if (dungeonKeyFound) {
        exitDungeon();
      } else {
        if (portalCooldown <= 0) {
          showBanner('🔒 Portaali on lukittu! Etsi Portaaliavain 🔑 arkusta!');
          portalCooldown = 2.2;
          Audio.play('hurt');
        }
      }
    }
  }

  function exitDungeon() {
    if (selectedMapNode) {
      selectedMapNode.cleared = true;
      unlockNextRow(selectedMapNode);
    }
    saveShopData();
    scene = 'field';
    
    running = false;
    level++;
    const oldDest = getDestinationForLevel(level - 1);
    unlockStampForDestination(oldDest);
    showBanner(adventureMode === 'island' ? `✨ ${oldDest.country} — Meriluola selvitetty! Palaa karttaan.` : `✨ ${oldDest.country} — Luolasto selvitetty! Palaa karttaan.`);
    updateHud();
    setTimeout(() => {
      overlay.classList.remove('hidden');
      showWorldMap(adventureMode);
    }, 1200);
  }

  function drawDungeon() {
    if (!dungeonData) return;
    const { traps, chests, portal, walls, W, H } = dungeonData;

    // Tausta
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Kivilaattakuvio
    ctx.strokeStyle = 'rgba(80,80,100,0.35)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 48) {
      for (let gy = 0; gy < H; gy += 48) {
        ctx.strokeRect(gx, gy, 48, 48);
      }
    }

    // Seinät
    for (const w of walls) {
      const grad = ctx.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h);
      grad.addColorStop(0, '#3a3a5c');
      grad.addColorStop(1, '#2a2a44');
      ctx.fillStyle = grad;
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeStyle = '#555577';
      ctx.lineWidth = 2;
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    // Piikkiansoja
    for (const trap of traps) {
      if (trap.cooldown > 0) continue;
      // Käytetään entity-wrapper piirtämiseen
      const trapEnt = { kind: 'spikes', x: trap.x, y: trap.y, radius: trap.radius,
                        animPhase: trap.active ? gameTime : 0, moving: trap.active, flip: 1 };
      Sprites.draw(ctx, trapEnt);
    }

    // Arkkuja
    for (const chest of chests) {
      if (chest.opened) continue;
      const chestEnt = { kind: 'chest', x: chest.x, y: chest.y, radius: chest.radius,
                         animPhase: 0, moving: false, flip: 1 };
      Sprites.draw(ctx, chestEnt);
    }

    // Portaali
    const portalEnt = { kind: 'portal', x: portal.x, y: portal.y, radius: portal.radius,
                        animPhase: gameTime, moving: true, flip: 1, locked: !dungeonKeyFound };
    Sprites.draw(ctx, portalEnt);
    
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    if (dungeonKeyFound) {
      ctx.fillStyle = '#ea80fc';
      ctx.fillText('🔑 PORTAALI AKTIIVINEN', portal.x, portal.y + portal.radius + 14);
    } else {
      ctx.fillStyle = '#ff7675';
      ctx.fillText('🔒 PORTAALI LUKITTU', portal.x, portal.y + portal.radius + 14);
    }

    // Husky
    drawHusky();

    // HUD (kameran käännös pois päältä)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // nollaa transform
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🏛️ Luolasto  ❤️ ${lives}/${maxLives}  💎 ${gemsFound}  — Löydä portaali!`, 14, 24);
    ctx.restore();
  }

  // ============================================================
  // SAARISEIKKAILU
  // ============================================================
  function generateIsland() {
    const W = 1600, H = 1200;
    const ISLAND_COUNT = 6;
    const islands = [];
    
    // Luodaan saaret (varmistetaan riittävä etäisyys)
    const margin = 150;
    for (let i = 0; i < ISLAND_COUNT; i++) {
      let x, y, tooClose, attempts = 0;
      do {
        x = margin + Math.random() * (W - margin * 2);
        y = margin + Math.random() * (H - margin * 2);
        tooClose = false;
        for (const isl of islands) {
          if (Math.hypot(x - isl.x, y - isl.y) < 190) { tooClose = true; break; }
        }
        attempts++;
      } while (tooClose && attempts < 50);

      islands.push({
        x, y,
        radius: 80 + Math.random() * 50
      });
    }

    // Luodaan puusillat saarien välille (Minimum Spanning Tree -tyylinen liitos takaa yhtenäisyyden)
    const bridges = [];
    for (let i = 1; i < islands.length; i++) {
      let closest = 0;
      let minDist = Infinity;
      for (let j = 0; j < i; j++) {
        const d = Math.hypot(islands[i].x - islands[j].x, islands[i].y - islands[j].y);
        if (d < minDist) {
          minDist = d;
          closest = j;
        }
      }
      bridges.push({
        x1: islands[i].x, y1: islands[i].y,
        x2: islands[closest].x, y2: islands[closest].y
      });
    }

    // Lokki-saaliit
    const seagullCount = 4 + Math.floor(level / 2);
    const seagulls = [];
    for (let i = 0; i < seagullCount; i++) {
      const isl = islands[Math.floor(Math.random() * islands.length)];
      seagulls.push(new Prey(isl.x + (Math.random() - 0.5) * isl.radius * 0.7, isl.y + (Math.random() - 0.5) * isl.radius * 0.7, 'seagull'));
    }

    // Kookosravut
    const crabCount = 3 + Math.floor(level / 2);
    const crabs = [];
    for (let i = 0; i < crabCount; i++) {
      const isl = islands[Math.floor(Math.random() * islands.length)];
      crabs.push(new Prey(isl.x + (Math.random() - 0.5) * isl.radius * 0.7, isl.y + (Math.random() - 0.5) * isl.radius * 0.7, 'coconut_crab'));
    }

    // Nälkäiset hait veteen (3 kpl, tai 1 jättimäinen bossi pomosaarella)
    const sharks = [];
    const isBossNode = selectedMapNode && selectedMapNode.type === 'boss';
    const sharkCount = isBossNode ? 1 : 3;
    for (let i = 0; i < sharkCount; i++) {
      let sx, sy, onLand, attempts = 0;
      do {
        sx = margin + Math.random() * (W - margin * 2);
        sy = margin + Math.random() * (H - margin * 2);
        onLand = false;
        for (const isl of islands) {
          if (Math.hypot(sx - isl.x, sy - isl.y) < isl.radius + 60) { onLand = true; break; }
        }
        attempts++;
      } while (onLand && attempts < 50);

      sharks.push(new Predator(sx, sy, 'shark', 1.0, isBossNode));
    }

    // Laiturit (poistumisportti) viimeisellä saarella
    const lastIsl = islands[islands.length - 1];
    const pier = { x: lastIsl.x, y: lastIsl.y - lastIsl.radius - 12, radius: 24 };

    islandData = { islands, bridges, seagulls, crabs, sharks, pier, W, H, caughtHere: 0, goal: seagullCount + crabCount };
  }

  function enterIsland(node) {
    if (node) { selectedMapNode = node; }
    generateIsland();
    scene = 'island';
    
    // Tyhjennetään mantereelta jääneet esineet
    collectibles = [];
    
    // Spawnaa saariseikkailun matkahaasteen kohde (Quest Item)
    const dest = getDestinationForLevel(level);
    Audio.setMusicTheme(themeForCountry(dest.country));
    const questDb = {
      'Kreikka 🇬🇷': { emoji: '🌿', name: 'Oliiviseppele', desc: 'Kerää muinainen oliivioksan seppele rannalta' },
      'Malediivit 🇲🇻': { emoji: '🐢', name: 'Juuttunut kilpikonna', desc: 'Vapauta koralliriutalle juuttunut merikilpikonna' },
      'Karibia 🇧🇸': { emoji: '✉️', name: 'Pulloposti', desc: 'Löydä hiekkarannalle ajautunut salaperäinen pulloposti' },
      'Madagaskar 🇲🇬': { emoji: '🥭', name: 'Baobab-hedelmä', desc: 'Kerää jättimäinen baobab-puun hedelmä sademetsästä' },
      'Pääsiäissaari 🗿': { emoji: '🎭', name: 'Heimomaski', desc: 'Etsi patsaiden juurelta kadonnut heimomaski' },
      'Havaiji 🌋': { emoji: '📿', name: 'Laavakivi-amuletti', desc: 'Nouda pyhä tulivuoren laavakivi-amuletti' },
      'Australia 🇦🇺': { emoji: '🪃', name: 'Kultainen Bumerangi', desc: 'Löydä punaiselle hiekalle kätketty muinainen bumerangi' },
      'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿': { emoji: '🎶', name: 'Kultainen Säkkipilli', desc: 'Löydä vanhojen linnanraunioiden kätköistä kultainen säkkipilli' }
    };
    
    const q = questDb[dest.country];
    if (q && islandData && islandData.islands.length > 1) {
      // Spawnaa satunnaisesti jollekin muulle kuin ensimmäiselle saarelle
      const idx = 1 + Math.floor(Math.random() * (islandData.islands.length - 1));
      const isl = islandData.islands[idx];
      collectibles.push({
        x: isl.x, y: isl.y,
        radius: 16,
        emoji: q.emoji,
        isQuest: true,
        questName: q.name,
        questDesc: q.desc,
        countryName: dest.country
      });
    }

    const first = islandData.islands[0];
    husky.x = first.x;
    husky.y = first.y;
    husky.swimming = false;
    running = true;
    lastTime = performance.now();
    if (node && node.type === 'boss') {
      showBanner(`👑 ${dest.country} (${dest.region}) — POMOSAARI! Varo JÄTTILÄISHaita! 🦈`);
    } else {
      showBanner(`⛵ ${dest.country} (${dest.region}) — Saariseikkailu! Varo haita vedessä! 🦈`);
    }
    requestAnimationFrame(loop);
  }

  function updateIsland(dt) {
    if (!islandData) return;
    const { islands, bridges, seagulls, crabs, sharks, pier, W, H } = islandData;

    // Liikuta husky
    const dir = Input.getDirection();
    const isSprinting = Input.isSprinting();
    
    // Tarkistetaan sijainti saarella vs sillalla vs vedessä
    let onIsland = false;
    for (const isl of islands) {
      if (Math.hypot(husky.x - isl.x, husky.y - isl.y) < isl.radius) {
        onIsland = true; break;
      }
    }
    
    // Auttaja: etäisyys sillan jänteestä
    let onBridge = false;
    for (const b of bridges) {
      const l2 = Math.hypot(b.x2 - b.x1, b.y2 - b.y1) ** 2;
      if (l2 === 0) continue;
      let t = ((husky.x - b.x1) * (b.x2 - b.x1) + (husky.y - b.y1) * (b.y2 - b.y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      const projX = b.x1 + t * (b.x2 - b.x1);
      const projY = b.y1 + t * (b.y2 - b.y1);
      const dist = Math.hypot(husky.x - projX, husky.y - projY);
      if (dist < 25) { onBridge = true; break; }
    }

    husky.swimming = !(onIsland || onBridge);

    // Nopeus riippuu uimistilasta
    const speedScale = husky.swimming ? 0.44 : 1.0;
    const spd = husky.speed * (perks.speedMul || 1) * (isSprinting ? 1.8 : 1.0) * speedScale * dt;
    
    let nx = husky.x + dir.x * spd;
    let ny = husky.y + dir.y * spd;

    if (dir.x !== 0 || dir.y !== 0) {
      husky.facing = Math.atan2(dir.y, dir.x);
      husky.flip = dir.x < 0 ? -1 : 1;
      husky.moving = true;
      husky.animPhase += dt * (isSprinting ? 20 : 12);
      
      // Vesiroiskeita uitaessa
      if (husky.swimming && Math.random() < 0.35) {
        spawnBurst(husky.x, husky.y, ['#7ad0ff', '#ffffff', '#2288dd'], 3);
      }
    } else {
      husky.moving = false;
    }

    husky.x = Math.max(husky.radius, Math.min(W - husky.radius, nx));
    husky.y = Math.max(husky.radius, Math.min(H - husky.radius, ny));
    husky.animPhase += dt;

    if (invulnTimer > 0) invulnTimer -= dt;

    // Saaliin päivitys ja pyydystys
    const allPrey = [...seagulls, ...crabs].filter(p => p.alive);
    for (const p of allPrey) {
      p.update(dt, husky, { width: W, height: H }, [], perks);
      const d = Math.hypot(husky.x - p.x, husky.y - p.y);
      if (d < p.radius + husky.radius + 5) {
        p.alive = false;
        islandData.caughtHere++;
        score++;
        caughtThisLevel++;
        showBanner(`${p.kind === 'seagull' ? '🐦 Lokki' : '🦀 Kookosrapu'} pyydystetty! +1`);
        Audio.play('catch');
        spawnBurst(p.x, p.y, [p.kind === 'seagull' ? '#90caf9' : '#ff8a65'], 12);
      }
    }

    // Päivitä hait ja tarkista törmäykset
    for (const s of sharks) {
      s.update(dt, husky, { width: W, height: H }, [], perks, 1.0, [], false, [], islandData);

      // Bestiarium-paljastus hai-hahmoille
      if (!shopData.discovered) shopData.discovered = {};
      if (!shopData.discovered[s.kind]) {
        if (Math.hypot(s.x - husky.x, s.y - husky.y) < 180) {
          shopData.discovered[s.kind] = true;
          showBanner(`📖 Bestiarium: ${preyEmoji(s.kind)} ${preyFinnish(s.kind)} löydetty!`);
          saveShopData();
        }
      }
      
      const d = Math.hypot(husky.x - s.x, husky.y - s.y);
      if (invulnTimer <= 0 && d < s.radius + husky.radius) {
        // Hai vahingoittaa huskya!
        if (hurtHusky(s.x, s.y, 'shark')) { gameOver(); return; }
      }
    }

    collectBones(dt);

    // Laituri: poistuminen
    const dp = Math.hypot(husky.x - pier.x, husky.y - pier.y);
    if (dp < pier.radius + husky.radius) {
      exitIsland();
    }
    timeOfDay = (timeOfDay + dt / DAY_LENGTH) % 1;
  }

  function exitIsland() {
    if (selectedMapNode) {
      selectedMapNode.cleared = true;
      unlockNextRow(selectedMapNode);
    }
    saveShopData();
    islandData = null;

    if (selectedMapNode && selectedMapNode.type === 'boss') {
      winGame();
    } else {
      running = false;
      const oldDest = getDestinationForLevel(level - 1);
      unlockStampForDestination(oldDest);
      showBanner(`⚓ ${oldDest.country} — Saari selvitetty! Palaa karttaan.`);
      Audio.play('levelup');
      updateHud();
      setTimeout(() => {
        overlay.classList.remove('hidden');
        showWorldMap('island');
      }, 1200);
    }
  }

  function drawIsland() {
    if (!islandData) return;
    const { islands, bridges, seagulls, crabs, sharks, pier, W, H } = islandData;

    // Meri-tausta
    const seaGrad = ctx.createLinearGradient(0, 0, 0, H);
    seaGrad.addColorStop(0, '#093a80');
    seaGrad.addColorStop(1, '#1150a8');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, W, H);

    // Aaltokuvio
    ctx.save();
    const waveOff = (gameTime * 30) % 60;
    ctx.strokeStyle = 'rgba(100,180,255,0.16)';
    ctx.lineWidth = 2;
    for (let wy = -60; wy < H + 60; wy += 60) {
      ctx.beginPath();
      for (let wx = 0; wx < W; wx += 8) {
        const wvy = wy + waveOff + Math.sin((wx + gameTime * 60) * 0.04) * 8;
        wx === 0 ? ctx.moveTo(wx, wvy) : ctx.lineTo(wx, wvy);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Piirretään puiset sillat saarien välille
    for (const b of bridges) {
      ctx.save();
      // Siltojen pohjaväri
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      
      // Siltojen poikkilaudat
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = 18;
      ctx.setLineDash([5, 8]);
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Saaret
    for (const isl of islands) {
      // Hiekka
      const sandGrad = ctx.createRadialGradient(isl.x, isl.y, isl.radius * 0.3, isl.x, isl.y, isl.radius);
      sandGrad.addColorStop(0, '#ffe596');
      sandGrad.addColorStop(1, '#d8b056');
      ctx.fillStyle = sandGrad;
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, isl.radius, 0, Math.PI * 2);
      ctx.fill();
      // Varjorengas rannalle
      ctx.strokeStyle = 'rgba(110,75,20,0.22)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, isl.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Palmupuu
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(isl.x - 6, isl.y - isl.radius * 0.45, 12, isl.radius * 0.4);
      ctx.fillStyle = '#2e7d32';
      for (let leaf = 0; leaf < 5; leaf++) {
        const ang = (leaf / 5) * Math.PI * 2 + gameTime * 0.28;
        ctx.save();
        ctx.translate(isl.x, isl.y - isl.radius * 0.45);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(24, 0, 24, 7, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Laituri
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(pier.x - 20, pier.y - 12, 40, 24);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.strokeRect(pier.x - 20, pier.y - 12, 40, 24);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚓', pier.x, pier.y + 6);

    // Hait
    for (const s of sharks) {
      s.draw(ctx, isNightTime());
    }

    // Saaliseläimet
    for (const p of [...seagulls, ...crabs]) {
      if (!p.alive) continue;
      if (p.kind === 'coconut_crab') p._isHidingForDraw = p.hiding;
      Sprites.draw(ctx, p);
    }

    drawCollectibles();

    // Husky
    drawHusky();

    drawNightOverlay();

    // HUD
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0, 0, 80, 0.72)';
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    const remaining = [...seagulls, ...crabs].filter(p => p.alive).length;
    ctx.fillText(`⛵ Saariseikkailu  🦀🐦 Jäljellä: ${remaining}  ❤️ ${lives}/${maxLives}  (Palaa mantereelle ⚓ laiturilta)`, 14, 25);
    ctx.restore();
  }

  function startGame() {
    init();
    overlay.classList.add('hidden');
    Audio.unlock();
    Audio.startMusic();
    showBanner(`${biome.emoji} ${biome.name} ${weatherEmoji()} — Taso 1`);
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function gameOver() {
    running = false;
    Audio.stopMusic();
    Audio.stopCabinAmbient();
    Audio.play('gameover');
    // Päivitä ennätykset
    let newRecord = false;
    if (level > (highScores.bestLevel || 0)) { highScores.bestLevel = level; newRecord = true; }
    if (score > (highScores.bestScore || 0)) { highScores.bestScore = score; newRecord = true; }
    if (huskyLevel > (highScores.bestHuskyLevel || 0)) { highScores.bestHuskyLevel = huskyLevel; newRecord = true; }
    if (gemsFound > (highScores.bestGems || 0)) { highScores.bestGems = gemsFound; newRecord = true; }
    if (artifactsOwned.length > (highScores.bestArtifacts || 0)) { highScores.bestArtifacts = artifactsOwned.length; newRecord = true; }
    if (newRecord) saveHighScores();

    // Lisää kerätyt jalokivet pysyvään saldoon
    if (typeof shopData !== 'undefined') {
      shopData.totalGems += gemsFound;
      saveShopData();
    }

    overlayText.textContent =
      `Peli päättyi tasolla ${level}! Husky ehti tasolle ${huskyLevel} ja pyydysti yhteensä ${score} eläintä.`;
    renderHighScores(newRecord);
    renderAchievements();
    if (startBtn) {
      startBtn.textContent = 'Pelaa uudelleen';
    }
    overlay.classList.remove('hidden');
  }

  // --- Jalokivikaupan määrittely ja logiikka ---
  const SKINS = [
    { id: 'default', name: 'Alkuperäinen', emoji: '🐺', cost: 0, desc: 'Klassinen harmaa husky.' },
    { id: 'fire', name: 'Tuli', emoji: '🔥', cost: 25, desc: 'Liekkeinä loimuava husky keltaisin silmin.' },
    { id: 'shadow', name: 'Yö', emoji: '🖤', cost: 15, desc: 'Synkkä varjohusky punaisin silmin.' },
    { id: 'arctic', name: 'Napapiiri', emoji: '❄️', cost: 20, desc: 'Lumivalkoinen husky jäänsinisin silmin.' }
  ];

  const ITEMS = [
    { id: 'heartPotion', name: 'Parannusjuoma', emoji: '❤️', cost: 6, max: 2, desc: 'Aloita seuraava peli yhdellä lisäelämällä.' },
    { id: 'speedCharm', name: 'Kipinätassu', emoji: '⚡', cost: 10, max: 1, desc: 'Aloita seuraava peli +12 % nopeudella.' },
    { id: 'smokeBomb', name: 'Savupommi', emoji: '💨', cost: 8, max: 1, desc: 'Torjuu osuman, sokaisee pedot savulla.' },
    { id: 'lantern', name: 'Lyhty', emoji: '🏮', cost: 12, max: 1, desc: 'Pysyvä lyhty, joka suurentaa näkökenttää luolissa.' },
    { id: 'companion', name: 'Laumakaveri', emoji: '🐕', cost: 30, max: 1, desc: 'Seuraa pelaajaa ja saalistaa kentällä!' }
  ];

  const HATS = [
    { id: 'christmas', name: 'Tonttulakki', emoji: '🎅', cost: 15, desc: 'Punainen pehmeä tonttulakki.' },
    { id: 'detective', name: 'Etsivän hattu', emoji: '🕵️', cost: 12, desc: 'Klassinen Sherlock-salapoliisihattu.' },
    { id: 'crown', name: 'Kuninkaan kruunu', emoji: '👑', cost: 25, desc: 'Kultainen kruunu todellisille kuninkaallisille.' },
    { id: 'glasses', name: 'Aurinkolasit', emoji: '🕶️', cost: 10, desc: 'Siistit tummat lasit heijastuksella.' }
  ];

  const COMPANION_SKINS = [
    { id: 'default', name: 'Alkuperäinen (Akita)', emoji: '🐕', cost: 0, desc: 'Pörröinen oranssinvalkoinen koirakaveri.' },
    { id: 'retriever', name: 'Kultainennoutaja', emoji: '🦮', cost: 16, desc: 'Iloisen keltainen noutajakaveri.' },
    { id: 'poodle', name: 'Kihara villakoira', emoji: '🐩', cost: 12, desc: 'Tyylikäs harmaanvalkoinen puudeli.' },
    { id: 'wolf', name: 'Soturihukka', emoji: '🐺', cost: 20, desc: 'Hurja tummanruskea metsäsusi keltaisin silmin.' }
  ];

  const COMPANION_HATS = [
    { id: 'none', name: 'Ei asustetta', emoji: '❌', cost: 0, desc: 'Ei hattua kaverille.' },
    { id: 'crown', name: 'Kultakruunu', emoji: '👑', cost: 25, desc: 'Kuninkaallinen minikruunu kaverille.' },
    { id: 'fedora', name: 'Lierihattu', emoji: '🎩', cost: 12, desc: 'Hieno musta lierihattu.' },
    { id: 'bow', name: 'Punainen rusetti', emoji: '🎀', cost: 8, desc: 'Suloinen rusetti niskaan tai korvaan.' },
    { id: 'detective', name: 'Dekkarilakki', emoji: '🕵️', cost: 15, desc: 'Etsivälakki pienelle salapoliisille.' }
  ];

  function renderShop() {
    if (typeof shopData === 'undefined') return;
    shopGemCount.textContent = shopData.totalGems;

    // Renderöidään skinit
    shopSkinsList.innerHTML = SKINS.map(s => {
      const isOwned = shopData.ownedSkins.includes(s.id);
      const isEquipped = shopData.equippedSkin === s.id;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="shop-btn equipped" disabled>Käytössä</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="shop-btn equip" data-skin="${s.id}">Valitse</button>`;
      } else {
        const canAfford = shopData.totalGems >= s.cost;
        btnHtml = `<button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-skin="${s.id}" ${canAfford ? '' : 'disabled'}>Osta</button>`;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${s.emoji} ${s.name}</div>
            <div class="shop-item-desc">${s.desc}</div>
            ${isOwned ? '' : `<div class="shop-item-cost">💎 ${s.cost}</div>`}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Renderöidään tavarat
    shopItemsList.innerHTML = ITEMS.map(item => {
      const currentStock = shopData.items[item.id] || 0;
      const isMax = currentStock >= item.max;

      let btnHtml = '';
      if (isMax) {
        btnHtml = `<button class="shop-btn disabled" disabled>Täynnä</button>`;
      } else {
        const canAfford = shopData.totalGems >= item.cost;
        btnHtml = `<button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-item="${item.id}" ${canAfford ? '' : 'disabled'}>Osta</button>`;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${item.emoji} ${item.name} (${currentStock}/${item.max})</div>
            <div class="shop-item-desc">${item.desc}</div>
            <div class="shop-item-cost">💎 ${item.cost}</div>
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Renderöidään asusteet
    shopHatsList.innerHTML = HATS.map(h => {
      const isOwned = shopData.ownedHats.includes(h.id);
      const isEquipped = shopData.equippedHat === h.id;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="shop-btn equipped" data-hat="${h.id}">Käytössä</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="shop-btn equip" data-hat="${h.id}">Valitse</button>`;
      } else {
        const canAfford = shopData.totalGems >= h.cost;
        btnHtml = `<button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-hat="${h.id}" ${canAfford ? '' : 'disabled'}>Osta</button>`;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${h.emoji} ${h.name}</div>
            <div class="shop-item-desc">${h.desc}</div>
            ${isOwned ? '' : `<div class="shop-item-cost">💎 ${h.cost}</div>`}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Renderöidään kaverikoiran skinit
    shopCompanionSkinsList.innerHTML = COMPANION_SKINS.map(s => {
      const isOwned = shopData.ownedCompanionSkins.includes(s.id);
      const isEquipped = shopData.equippedCompanionSkin === s.id;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="shop-btn equipped" disabled>Käytössä</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="shop-btn equip" data-compskin="${s.id}">Valitse</button>`;
      } else {
        const canAfford = shopData.totalGems >= s.cost;
        btnHtml = `<button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-compskin="${s.id}" ${canAfford ? '' : 'disabled'}>Osta</button>`;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${s.emoji} ${s.name}</div>
            <div class="shop-item-desc">${s.desc}</div>
            ${isOwned ? '' : `<div class="shop-item-cost">💎 ${s.cost}</div>`}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Renderöidään kaverikoiran asusteet
    shopCompanionHatsList.innerHTML = COMPANION_HATS.map(h => {
      const isOwned = shopData.ownedCompanionHats.includes(h.id);
      const isEquipped = shopData.equippedCompanionHat === h.id;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="shop-btn equipped" data-comphat="${h.id}">Käytössä</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="shop-btn equip" data-comphat="${h.id}">Valitse</button>`;
      } else {
        const canAfford = shopData.totalGems >= h.cost;
        btnHtml = `<button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-comphat="${h.id}" ${canAfford ? '' : 'disabled'}>Osta</button>`;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${h.emoji} ${h.name}</div>
            <div class="shop-item-desc">${h.desc}</div>
            ${isOwned ? '' : `<div class="shop-item-cost">💎 ${h.cost}</div>`}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Tapahtumakuuntelijat skineille
    shopSkinsList.querySelectorAll('.shop-btn.equip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skinId = e.target.getAttribute('data-skin');
        shopData.equippedSkin = skinId;
        saveShopData();
        Audio.play('skill');
        renderShop();
      });
    });

    shopSkinsList.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skinId = e.target.getAttribute('data-skin');
        const s = SKINS.find(x => x.id === skinId);
        if (s && shopData.totalGems >= s.cost) {
          shopData.totalGems -= s.cost;
          shopData.ownedSkins.push(skinId);
          shopData.equippedSkin = skinId;
          saveShopData();
          Audio.play('gem');
          renderShop();
        }
      });
    });

    // Tapahtumakuuntelijat tavaroille
    shopItemsList.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-item');
        const item = ITEMS.find(x => x.id === itemId);
        if (item && shopData.totalGems >= item.cost) {
          shopData.totalGems -= item.cost;
          shopData.items[itemId] = (shopData.items[itemId] || 0) + 1;
          saveShopData();
          Audio.play('gem');
          renderShop();
        }
      });
    });

    // Tapahtumakuuntelijat asusteille
    shopHatsList.querySelectorAll('.shop-btn.equipped, .shop-btn.equip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hatId = e.target.getAttribute('data-hat');
        if (shopData.equippedHat === hatId) {
          shopData.equippedHat = 'none';
        } else {
          shopData.equippedHat = hatId;
        }
        saveShopData();
        Audio.play('skill');
        renderShop();
      });
    });

    shopHatsList.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hatId = e.target.getAttribute('data-hat');
        const h = HATS.find(x => x.id === hatId);
        if (h && shopData.totalGems >= h.cost) {
          shopData.totalGems -= h.cost;
          shopData.ownedHats.push(hatId);
          shopData.equippedHat = hatId;
          saveShopData();
          Audio.play('gem');
          renderShop();
        }
      });
    });

    // Tapahtumakuuntelijat kaverikoiran skineille
    shopCompanionSkinsList.querySelectorAll('.shop-btn.equip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skinId = e.target.getAttribute('data-compskin');
        shopData.equippedCompanionSkin = skinId;
        saveShopData();
        Audio.play('skill');
        renderShop();
      });
    });

    shopCompanionSkinsList.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skinId = e.target.getAttribute('data-compskin');
        const s = COMPANION_SKINS.find(x => x.id === skinId);
        if (s && shopData.totalGems >= s.cost) {
          shopData.totalGems -= s.cost;
          shopData.ownedCompanionSkins.push(skinId);
          shopData.equippedCompanionSkin = skinId;
          saveShopData();
          Audio.play('gem');
          renderShop();
        }
      });
    });

    // Tapahtumakuuntelijat kaverikoiran asusteille
    shopCompanionHatsList.querySelectorAll('.shop-btn.equipped, .shop-btn.equip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hatId = e.target.getAttribute('data-comphat');
        if (shopData.equippedCompanionHat === hatId) {
          shopData.equippedCompanionHat = 'none';
        } else {
          shopData.equippedCompanionHat = hatId;
        }
        saveShopData();
        Audio.play('skill');
        renderShop();
      });
    });

    shopCompanionHatsList.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hatId = e.target.getAttribute('data-comphat');
        const h = COMPANION_HATS.find(x => x.id === hatId);
        if (h && shopData.totalGems >= h.cost) {
          shopData.totalGems -= h.cost;
          shopData.ownedCompanionHats.push(hatId);
          shopData.equippedCompanionHat = hatId;
          saveShopData();
          Audio.play('gem');
          renderShop();
        }
      });
    });
  }

  function openShop() {
    renderShop();
    shopOverlay.classList.remove('hidden');
  }

  function closeShop() {
    shopOverlay.classList.add('hidden');
    if (shopOpenedFromMap) {
      shopOpenedFromMap = false;
      if (selectedMapNode) {
        selectedMapNode.cleared = true;
        unlockNextRow(selectedMapNode);
        renderWorldMap();
      }
    }
  }

  const CABIN_UPGRADES = [
    { id: 'fireplace', name: 'Tulisija 🔥', desc: 'Lataa Huskyn elämiä kun seisot sen lähellä mökissä. Taso 2 lataa nopeammin.', maxLvl: 2, cost: [10, 20] },
    { id: 'trophyWall', name: 'Palkintohylly 🏆', desc: 'Esittelee löytämäsi aarteet visualisoituina mökin seinällä. Antaa pysyvän +15% aloitus-XP-monistajan.', maxLvl: 1, cost: [15] },
    { id: 'doghouse', name: 'Koiranpeti 🛏️', desc: 'Lemmikkikaveri saa pehmeän petipaikan ja juoksee 20% kovempaa pelissä per taso.', maxLvl: 2, cost: [12, 24] },
    { id: 'bowlLvl', name: 'Ruokakuppi 🥣', desc: 'Ruokakuppi täynnä herkkuja. Antaa +20 XP joka tason alussa per taso.', maxLvl: 2, cost: [8, 16] },
    { id: 'toybox', name: 'Lelulaatikko 🎾', desc: 'Taso 1: saat ilmaisen Savupommin joka tason alussa. Taso 2: saat myös suojakilven!', maxLvl: 2, cost: [14, 28] },
    { id: 'gramophone', name: 'Gramofoni 📻', desc: 'Avaa dynaamisen musiikkisoittimen mökkiin. Soita muiden maiden teemoja rentoutuessasi.', maxLvl: 1, cost: [20] },
    { id: 'achievementsPlaque', name: 'Mitalikaappi 🏅', desc: 'Avaa mökin seinälle interaktiivisen mitalitaulun, josta näet kaikki saavutuksesi.', maxLvl: 1, cost: [15] },
    { id: 'planterPots', name: 'Viljelylaatikko 🪴', desc: 'Viljele mustikoita ja kantarelleja mökissä! Kasvit kypsyvät seikkailujen jälkeen ja antavat runsaasti satoa.', maxLvl: 1, cost: [18] }
  ];

  function renderCabinUpgrades() {
    cabinGemCount.textContent = shopData.totalGems;
    cabinGrid.innerHTML = CABIN_UPGRADES.map(upg => {
      const currentLvl = (upg.id === 'trophyWall' || upg.id === 'gramophone' || upg.id === 'achievementsPlaque' || upg.id === 'planterPots')
        ? (shopData.cabinUpgrades[upg.id] ? 1 : 0)
        : (shopData.cabinUpgrades[upg.id] || 0);

      const maxed = currentLvl >= upg.maxLvl;
      const nextCost = maxed ? 0 : upg.cost[currentLvl];
      
      let btnHtml = '';
      if (maxed) {
        btnHtml = `<span class="owned-badge" style="color: #60ff60; font-weight: bold;">Maksimi! ✨</span>`;
      } else {
        const canAfford = shopData.totalGems >= nextCost;
        btnHtml = `
          <button class="shop-btn buy ${canAfford ? '' : 'disabled'}" data-id="${upg.id}" data-cost="${nextCost}" ${canAfford ? '' : 'disabled'}>
            Paranna: 💎 ${nextCost}
          </button>
        `;
      }

      return `
        <div class="shop-item">
          <div class="shop-item-info">
            <div class="shop-item-title">${upg.name} (Taso ${currentLvl}/${upg.maxLvl})</div>
            <div class="shop-item-desc">${upg.desc}</div>
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Päivityspainikkeiden kuuntelijat
    cabinGrid.querySelectorAll('.shop-btn.buy:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const cost = parseInt(btn.getAttribute('data-cost'));
        if (shopData.totalGems >= cost) {
          shopData.totalGems -= cost;
          if (id === 'trophyWall' || id === 'gramophone' || id === 'achievementsPlaque' || id === 'planterPots') {
            shopData.cabinUpgrades[id] = true;
          } else {
            shopData.cabinUpgrades[id] = (shopData.cabinUpgrades[id] || 0) + 1;
          }
          saveShopData();
          checkAchievements();
          Audio.play('gem');
          renderCabinUpgrades();
        }
      });
    });
  }

  function openCabinUpgrades() {
    renderCabinUpgrades();
    cabinOverlay.classList.remove('hidden');
    running = false;
  }

  function closeCabinUpgrades() {
    cabinOverlay.classList.add('hidden');
    // Siirretään Huskya pois pöydän päältä
    husky.x += 62;
    resumeGame();
  }

  if (cabinCloseBtn) {
    cabinCloseBtn.addEventListener('click', () => {
      closeCabinUpgrades();
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      adventureMode = 'mainland';
      startGame();
    });
  }

  const mainlandBtn = document.getElementById('start-mainland-btn');
  if (mainlandBtn) {
    mainlandBtn.addEventListener('click', () => {
      Audio.unlock();
      adventureMode = 'mainland';
      init();
      husky = new Husky(center.x, center.y);
      husky.skin = (typeof shopData !== 'undefined') ? (shopData.equippedSkin || 'default') : 'default';
      husky.hat  = (typeof shopData !== 'undefined') ? (shopData.equippedHat  || 'none')    : 'none';
      perks = Skills.freshPerks();
      showWorldMap('mainland', true);
    });
  }

  const islandsBtn = document.getElementById('start-islands-btn');
  if (islandsBtn) {
    islandsBtn.addEventListener('click', () => {
      Audio.unlock();
      adventureMode = 'island';
      init();
      husky = new Husky(center.x, center.y);
      husky.skin = (typeof shopData !== 'undefined') ? (shopData.equippedSkin || 'default') : 'default';
      husky.hat  = (typeof shopData !== 'undefined') ? (shopData.equippedHat  || 'none')    : 'none';
      perks = Skills.freshPerks();
      showWorldMap('island', true);
    });
  }

  const mapBackBtn = document.getElementById('map-back-btn');
  if (mapBackBtn) {
    mapBackBtn.addEventListener('click', () => {
      hideWorldMap();
    });
  }

  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      Audio.unlock();
      if (confirm('Haluatko varmasti lopettaa nykyisen pelin ja palata alkuun?')) {
        gameOver();
      }
    });
  }

  if (shopBtnOpen) {
    shopBtnOpen.addEventListener('click', () => {
      Audio.unlock();
      openShop();
    });
  }

  if (shopCloseBtn) {
    shopCloseBtn.addEventListener('click', () => {
      closeShop();
    });
  }

  const CODEX_PREY = [
    { id: 'rabbit', name: 'Jänis', emoji: '🐰', desc: 'Arka pitkäkorva. Juoksee nopeasti pakoon.' },
    { id: 'mouse', name: 'Hiiri', emoji: '🐭', desc: 'Pieni tuholainen. Liikkuu nopeasti ja vikkelästi.' },
    { id: 'squirrel', name: 'Orava', emoji: '🐿️', desc: 'Pörröhäntäinen kiipeilijä, viihtyy metsässä.' },
    { id: 'golden_squirrel', name: 'Kultainen Orava', emoji: '🐿️✨', desc: 'Legendaarinen hohtava orava. Erittäin vikkelä ja antaa kiinniotettaessa 💎 jalokiven!' },
    { id: 'hedgehog', name: 'Siili', emoji: '🦔', desc: 'Piikikäs kulkija. Liikkuu melko hitaasti.' },
    { id: 'bird', name: 'Lintu', emoji: '🐦', desc: 'Mutkitteleva lentäjä, vaikea napattava.' },
    { id: 'deer', name: 'Hirvi', emoji: '🦌', desc: 'Uljas metsän kruunu. Erittäin nopea ja arka saalis.' },
    { id: 'beaver', name: 'Majava', emoji: '🦫', desc: 'Märkä uimari. Liikkuu vedessä ilman hidastuksia.' },
    { id: 'bat', name: 'Lepakko', emoji: '🦇', desc: 'Yötaivaan vikkelä kiitäjä. Ilmestyy vain pimeän tultua.' },
    { id: 'monkey', name: 'Apina', emoji: '🐒', desc: 'Viidakon ilkikurinen asukki. Tykkää varastaa luita koirilta!' },
    { id: 'mountain_goat', name: 'Vuorivuohi', emoji: '🐐', desc: 'Sumuvuorten kiipeilymestari. Juoksee kivien yli vaivattomasti.' },
    { id: 'coconut_crab', name: 'Kookosrapu', emoji: '🦀', desc: 'Saariston salaperäinen asukas. Piiloutuu hiekkaan ja ampuu kookospähkinöitä!' },
    { id: 'seagull', name: 'Lokki', emoji: '🐦', desc: 'Merisaaristot nopeasti kaartaen. Erittäin vikkelä ja lentotaitoinen lintu.' },
    { id: 'weasel', name: 'Kärppä', emoji: '🐹', desc: 'Ruskametsän vikkelä asukas. Erittäin ketterä ja antaa tupla XP:t!' },
    { id: 'kangaroo', name: 'Kenguru', emoji: '🦘', desc: 'Australian punaisen Outbackin loikkija. Erittäin nopea ja jousimainen, antaa runsaasti pisteitä ja XP:tä!' },
    { id: 'highland_cow', name: 'Ylämaankarja', emoji: '🐂', desc: 'Skotlannin Ylämaiden lempeä ja tuuheatukkainen pörrölehmä. Erittäin arvokas saalis, antaa pehmeää villaa ja maitoa!' },
    { id: 'nessie', name: 'Loch Nessin Hirviö', emoji: '🦕', desc: 'Muinaisten vesien salaperäinen ja ystävällinen asukki. Vilahtaa vain nummijokien ja sumuisten järvien aalloissa!' },
  ];

  const CODEX_PREDATORS = [
    { id: 'bear', name: 'Karhu', emoji: '🐻', desc: 'Iso ja vaarallinen korven asukas. Vartioi reviiriään ja jahtaa jos menet liian lähelle.' },
    { id: 'wolf', name: 'Susi', emoji: '🐺', desc: 'Sankojen metsien vikkelä saalistaja. Havaitessaan sinut alkaa jahdata herkeämättä.' },
    { id: 'fox', name: 'Kettu', emoji: '🦊', desc: 'Ovela korven asukas. Liikkuu nopeasti ja pyrkii koukkaamaan eteesi.' },
    { id: 'lynx', name: 'Ilves', emoji: '🐱', desc: 'Hiljainen ja ovela vaanija. Piiloutuu pensaisiin ja syöksyy sieltä yllättäen!' },
    { id: 'owl', name: 'Pöllö', emoji: '🦉', desc: 'Yötaivaan äänetön valtias. Seuraa saalista ylhäältä päin ja vaanii pimeydestä.' },
    { id: 'yeti', name: 'Jeti', emoji: '❄️', desc: 'Lumisademetsien myyttinen jättiläinen. Heittelee kylmiä ja hidastavia lumipalloja!' },
    { id: 'scorpion', name: 'Skorpioni', emoji: '🦂', desc: 'Aavikon piikikäs vaanija. Piiloutuu kuumaan hiekkaan ja ampuu myrkkypistoksia!' },
    { id: 'crocodile', name: 'Krokotiili', emoji: '🐊', desc: 'Soiden kätketty valtias. Piileskelee vesistöissä ja tekee salamannopeita syöksyjä!' },
    { id: 'panther', name: 'Pantteri', emoji: '🐆', desc: 'Viidakon vaarallinen peto. Piiloutuu tiheään lehvästöön ja loikkaa kohti hurjalla vauhdilla!' },
    { id: 'shark', name: 'Hai', emoji: '🦈', desc: 'Merenalainen uhka saarilla. Vaanii matalikoissa ja uiskentelee nopeasti uimareiden kimppuun!' },
    { id: 'eagle', name: 'Jättikotka', emoji: '🦅', desc: 'Mannerseikkailun mahtava loppupomo. Hallitsee ilmatilaa ja ampuu sulkavyöryjä kolmeen suuntaan!' },
  ];

  function openCodex() {
    renderCodex();
    codexOverlay.classList.remove('hidden');
    
    // Alustetaan ja valitaan eka välilehti
    activeCodexTab = 'prey';
    const tabs = document.querySelectorAll('.codex-tab');
    tabs.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === activeCodexTab);
      if (!t._listenerAdded) {
        t._listenerAdded = true;
        t.addEventListener('click', () => {
          activeCodexTab = t.getAttribute('data-tab');
          tabs.forEach(x => x.classList.toggle('active', x.getAttribute('data-tab') === activeCodexTab));
          renderCodex();
        });
      }
    });

    if (codexAnimId) cancelAnimationFrame(codexAnimId);
    codexAnimPhase = 0;
    updateCodexAnimation();
  }

  function closeCodex() {
    codexOverlay.classList.add('hidden');
    if (codexAnimId) {
      cancelAnimationFrame(codexAnimId);
      codexAnimId = null;
    }
  }

  function updateCodexAnimation() {
    if (codexOverlay.classList.contains('hidden')) return;
    codexAnimPhase += 0.08;

    const list = activeCodexTab === 'prey' ? CODEX_PREY : CODEX_PREDATORS;
    list.forEach(p => {
      const discovered = !!shopData.discovered[p.id];
      const canvas = document.getElementById(`codex-canvas-${p.id}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isBoss = (p.id === 'eagle' || p.id === 'yeti' || p.id === 'scorpion' || p.id === 'crocodile');
      const dummyEntity = {
        kind: p.id === 'golden_squirrel' ? 'golden_squirrel' : p.id,
        x: canvas.width / 2,
        y: canvas.height / 2 + (isBoss ? 8 : 5),
        radius: isBoss ? 11 : (p.id === 'deer' ? 14 : 18),
        flip: 1,
        moving: discovered,
        animPhase: codexAnimPhase,
        heightOffset: (p.id === 'eagle' || p.id === 'owl') ? 10 : 0
      };

      if (discovered) {
        Sprites.draw(ctx, dummyEntity);
      } else {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        Sprites.draw(tempCtx, dummyEntity);

        ctx.save();
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#2c2e35';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    });

    codexAnimId = requestAnimationFrame(updateCodexAnimation);
  }

  function renderCodex() {
    if (!shopData.discovered) shopData.discovered = {};
    const list = activeCodexTab === 'prey' ? CODEX_PREY : CODEX_PREDATORS;
    codexGrid.innerHTML = list.map(p => {
      const discovered = !!shopData.discovered[p.id];
      if (discovered) {
        return `
          <div class="codex-card discovered">
            <canvas id="codex-canvas-${p.id}" width="65" height="65"></canvas>
            <div class="codex-name">${p.name}</div>
            <div class="codex-desc">${p.desc}</div>
          </div>
        `;
      } else {
        return `
          <div class="codex-card locked">
            <canvas id="codex-canvas-${p.id}" width="65" height="65"></canvas>
            <div class="codex-name">???</div>
            <div class="codex-desc">Löydä tämä asukas seikkailulla avataksesi sen tiedot.</div>
          </div>
        `;
      }
    }).join('');
  }

  if (codexBtnOpen) {
    codexBtnOpen.addEventListener('click', () => {
      Audio.unlock();
      openCodex();
    });
  }

  if (codexCloseBtn) {
    codexCloseBtn.addEventListener('click', () => {
      closeCodex();
    });
  }

  const passportBtnOpen = document.getElementById('passport-btn-open');
  const passportCloseBtn = document.getElementById('passport-close-btn');
  const passportPrevBtn = document.getElementById('passport-prev-btn');
  const passportNextBtn = document.getElementById('passport-next-btn');

  if (passportBtnOpen) {
    passportBtnOpen.addEventListener('click', () => {
      Audio.unlock();
      openPassport();
    });
  }
  if (diaryBtnOpen) {
    diaryBtnOpen.addEventListener('click', () => {
      Audio.unlock();
      openDiaryModal();
    });
  }
  if (passportCloseBtn) {
    passportCloseBtn.addEventListener('click', () => {
      closePassport();
    });
  }
  if (diaryCloseBtn) {
    diaryCloseBtn.addEventListener('click', () => {
      closeDiaryModal();
    });
  }
  if (gardenCloseBtn) {
    gardenCloseBtn.addEventListener('click', () => {
      closeGardenModal();
    });
  }
  if (passportPrevBtn) {
    passportPrevBtn.addEventListener('click', () => {
      passportCurrentIndex = (passportCurrentIndex - 1 + passportList.length) % passportList.length;
      updatePassportUI();
      Audio.play('catch');
    });
  }
  if (passportNextBtn) {
    passportNextBtn.addEventListener('click', () => {
      passportCurrentIndex = (passportCurrentIndex + 1) % passportList.length;
      updatePassportUI();
      Audio.play('catch');
    });
  }

  const tabBtnBook = document.getElementById('passport-tab-btn-book');
  const tabBtnPostcards = document.getElementById('passport-tab-btn-postcards');
  const tabBtnAlbum = document.getElementById('passport-tab-btn-album');
  const tabBtnMemory = document.getElementById('passport-tab-btn-memory');
  const tabBtnStats = document.getElementById('passport-tab-btn-stats');
  const tabContentBook = document.getElementById('passport-tab-content-book');
  const tabContentPostcards = document.getElementById('passport-tab-content-postcards');
  const tabContentAlbum = document.getElementById('passport-tab-content-album');
  const tabContentMemory = document.getElementById('passport-tab-content-memory');
  const tabContentStats = document.getElementById('passport-tab-content-stats');

  if (tabBtnBook && tabBtnPostcards && tabBtnAlbum && tabBtnMemory && tabBtnStats && tabContentBook && tabContentPostcards && tabContentAlbum && tabContentMemory && tabContentStats) {
    tabBtnBook.addEventListener('click', () => {
      tabBtnBook.classList.add('active');
      tabBtnPostcards.classList.remove('active');
      tabBtnAlbum.classList.remove('active');
      tabBtnMemory.classList.remove('active');
      tabBtnStats.classList.remove('active');
      tabContentBook.classList.remove('hidden');
      tabContentPostcards.classList.add('hidden');
      tabContentAlbum.classList.add('hidden');
      tabContentMemory.classList.add('hidden');
      tabContentStats.classList.add('hidden');
      Audio.play('click');
    });

    tabBtnPostcards.addEventListener('click', () => {
      tabBtnPostcards.classList.add('active');
      tabBtnBook.classList.remove('active');
      tabBtnAlbum.classList.remove('active');
      tabBtnMemory.classList.remove('active');
      tabBtnStats.classList.remove('active');
      tabContentPostcards.classList.remove('hidden');
      tabContentBook.classList.add('hidden');
      tabContentAlbum.classList.add('hidden');
      tabContentMemory.classList.add('hidden');
      tabContentStats.classList.add('hidden');
      renderPostcardsGrid();
      Audio.play('click');
    });

    tabBtnAlbum.addEventListener('click', () => {
      tabBtnAlbum.classList.add('active');
      tabBtnBook.classList.remove('active');
      tabBtnPostcards.classList.remove('active');
      tabBtnMemory.classList.remove('active');
      tabBtnStats.classList.remove('active');
      tabContentAlbum.classList.remove('hidden');
      tabContentBook.classList.add('hidden');
      tabContentPostcards.classList.add('hidden');
      tabContentMemory.classList.add('hidden');
      tabContentStats.classList.add('hidden');
      renderAlbumGrid();
      Audio.play('click');
    });

    tabBtnMemory.addEventListener('click', () => {
      tabBtnMemory.classList.add('active');
      tabBtnBook.classList.remove('active');
      tabBtnPostcards.classList.remove('active');
      tabBtnAlbum.classList.remove('active');
      tabBtnStats.classList.remove('active');
      tabContentMemory.classList.remove('hidden');
      tabContentBook.classList.add('hidden');
      tabContentPostcards.classList.add('hidden');
      tabContentAlbum.classList.add('hidden');
      tabContentStats.classList.add('hidden');
      initMemoryGame();
      Audio.play('click');
    });

    tabBtnStats.addEventListener('click', () => {
      tabBtnStats.classList.add('active');
      tabBtnBook.classList.remove('active');
      tabBtnPostcards.classList.remove('active');
      tabBtnAlbum.classList.remove('active');
      tabBtnMemory.classList.remove('active');
      tabContentStats.classList.remove('hidden');
      tabContentBook.classList.add('hidden');
      tabContentPostcards.classList.add('hidden');
      tabContentAlbum.classList.add('hidden');
      tabContentMemory.classList.add('hidden');
      updateStatsUI();
      Audio.play('click');
    });
  }

  const memoryResetBtn = document.getElementById('memory-reset-btn');
  if (memoryResetBtn) {
    memoryResetBtn.addEventListener('click', () => {
      initMemoryGame();
      Audio.play('click');
    });
  }

  const card3D = document.querySelector('.postcard-card-3d');
  if (card3D) {
    card3D.addEventListener('click', () => {
      card3D.classList.toggle('flipped');
      Audio.play('click');
    });
  }

  const postcardCloseBtn = document.getElementById('postcard-viewer-close-btn');
  if (postcardCloseBtn) {
    postcardCloseBtn.addEventListener('click', () => {
      closePostcardViewer();
    });
  }

  const postcardViewerModal = document.getElementById('postcard-viewer-modal');
  if (postcardViewerModal) {
    postcardViewerModal.addEventListener('click', (e) => {
      if (e.target === postcardViewerModal) {
        closePostcardViewer();
      }
    });
  }

  const victoryPhotoBtn = document.getElementById('victory-photo-btn');
  if (victoryPhotoBtn) {
    victoryPhotoBtn.addEventListener('click', () => {
      takeVictoryPhoto();
    });
  }

  const polaroidSaveBtn = document.getElementById('polaroid-save-btn');
  if (polaroidSaveBtn) {
    polaroidSaveBtn.addEventListener('click', () => {
      if (lastClearedDestination) {
        if (!shopData.unlockedPhotos) shopData.unlockedPhotos = {};
        shopData.unlockedPhotos[lastClearedDestination.country] = new Date().toLocaleDateString('fi-FI');
        saveShopData();

        showBanner(`📸 KUVA TALLENNETTU ALBUMIIN!`);
        Audio.play('legendary');

        const modal = document.getElementById('polaroid-modal');
        if (modal) modal.classList.add('hidden');

        const photoBtn = document.getElementById('victory-photo-btn');
        if (photoBtn) photoBtn.classList.add('hidden');
      }
    });
  }

  const polaroidCloseBtn = document.getElementById('polaroid-close-btn');
  if (polaroidCloseBtn) {
    polaroidCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('polaroid-modal');
      if (modal) modal.classList.add('hidden');
    });
  }

  const albumViewerCloseBtn = document.getElementById('album-viewer-close-btn');
  if (albumViewerCloseBtn) {
    albumViewerCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('album-viewer-modal');
      if (modal) modal.classList.add('hidden');
    });
  }

  const albumViewerModal = document.getElementById('album-viewer-modal');
  if (albumViewerModal) {
    albumViewerModal.addEventListener('click', (e) => {
      if (e.target === albumViewerModal) {
        albumViewerModal.classList.add('hidden');
      }
    });
  }

  // --- Valokuvien kuvatekstin muokkaus kuuntelijat ---
  const captionText = document.getElementById('album-viewer-caption-text');
  const editContainer = document.getElementById('album-viewer-caption-edit-container');
  const captionInput = document.getElementById('album-viewer-caption-input');
  const saveBtn = document.getElementById('album-viewer-caption-save-btn');

  if (captionText && editContainer && captionInput && saveBtn) {
    captionText.addEventListener('click', () => {
      captionText.classList.add('hidden');
      editContainer.classList.remove('hidden');
      captionInput.value = (shopData.photoCaptions && shopData.photoCaptions[activeViewingCountry]) || '';
      captionInput.focus();
    });

    const saveAction = () => {
      const val = captionInput.value.trim();
      if (!shopData.photoCaptions) shopData.photoCaptions = {};

      if (val) {
        shopData.photoCaptions[activeViewingCountry] = val;
      } else {
        delete shopData.photoCaptions[activeViewingCountry];
      }

      saveShopData();
      Audio.play('levelup');

      const unlocked = shopData.unlockedPhotos || {};
      const dateStr = unlocked[activeViewingCountry] || new Date().toLocaleDateString('fi-FI');
      captionText.textContent = val || `${activeViewingCountry} — ${dateStr}`;

      editContainer.classList.add('hidden');
      captionText.classList.remove('hidden');

      renderAlbumGrid();
    };

    saveBtn.addEventListener('click', saveAction);

    captionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveAction();
      }
    });
  }

  const ACHIEVEMENTS = [
    { id: 'caught50', name: 'Suursaalistaja', desc: 'Pyydystä 50 saalista yhteensä', target: 50, reward: 10, icon: '🐿️' },
    { id: 'rescue3', name: 'Sankarikoira', desc: 'Pelasta 3 eksynyttä pentua', target: 3, reward: 15, icon: '🐾' },
    { id: 'noDamage', name: 'Varovainen vaeltaja', desc: 'Läpäise jokin taso ottamatta vahinkoa', target: 1, reward: 12, icon: '🛡️' },
    { id: 'visitCave', name: 'Luolaseikkailija', desc: 'Käy pimeässä luolassa', target: 1, reward: 8, icon: '🏮' },
    { id: 'fish5', name: 'Mestarikalastaja', desc: 'Pyydystä 5 lohta joesta', target: 5, reward: 12, icon: '🎣' },
    { id: 'dig10', name: 'Aarteenetsijä', desc: 'Kaiva ylös 10 aarrepaikkaa', target: 10, reward: 10, icon: '🗺️' },
    { id: 'beeEscapes3', name: 'Parvenpako', desc: 'Väistä mehiläisparvi 3 kertaa veteen/mutaan tai syöksyllä', target: 3, reward: 14, icon: '🐝' },
    { id: 'fireplaceUpgrade', name: 'Lämmin pirtti', desc: 'Hankkiudu tulisijan lämpöön mökissä', target: 1, reward: 10, icon: '🔥' },
    { id: 'tamed3', name: 'Eläinkuiskaaja', desc: 'Kesytä 3 villieläintä metsässä', target: 3, reward: 15, icon: '🦊' },
    { id: 'mythical1', name: 'Myytintutkija', desc: 'Pyydystä tai kesytä 1 myyttinen valioyksilö', target: 1, reward: 20, icon: '🦄' },
    { id: 'campfireParty', name: 'Yönuotion Tarinat', desc: 'Kokoonnu ystäviesi kanssa mökin takapihalla ja ruoki nuotiota', target: 1, reward: 15, icon: '⛺' },
    { id: 'questMaster', name: 'Seikkailujen Mestari', desc: 'Suorita ja lunasta 5 päivittäistä seikkailutehtävää', target: 5, reward: 25, icon: '📜' },
    { id: 'agilityMaster', name: 'Agility-Mestari', desc: 'Läpäise Agility-rata kultamitalilla alle 15 sekunnissa', target: 1, reward: 20, icon: '🐕' },
    { id: 'wishingWell5', name: 'Kaivon Taika', desc: 'Tee 5 toivomusta Revontulien Toivomuskaivoon', target: 5, reward: 15, icon: '⛲' },
    { id: 'auroraFriend', name: 'Revontulien Ystävä', desc: 'Vieraile Norjan revontulilaaksossa', target: 1, reward: 20, icon: '🌌' },
    { id: 'talentMaster5', name: 'Mestarikoira', desc: 'Avaa 5 lahjakkuustasoa Koirakoulussa', target: 5, reward: 25, icon: '🎓' },
    { id: 'outbackExplorer', name: 'Outbackin Kiertäjä', desc: 'Vieraile Australian punaisessa Outbackissa', target: 1, reward: 20, icon: '🦘' },
    { id: 'paleontologist', name: 'Paleontologikoira', desc: 'Löydä kaikki 5 muinaista fossiilia maasta kaivamalla', target: 5, reward: 30, icon: '🦖' },
    { id: 'highlandExplorer', name: 'Ylämaan Vaeltaja', desc: 'Vieraile Skotlannin nummilla ja Loch Nessillä', target: 1, reward: 20, icon: '🏰' },
    { id: 'puppyFamily', name: 'Koiraperhe', desc: 'Pelasta kaikki 5 huskypentua mökin pentutarhaan', target: 5, reward: 30, icon: '🐶' }
  ];

  function getAchievementProgress(achId) {
    if (!shopData.achievements) return 0;
    if (achId === 'caught50') return shopData.achievements.caughtCount || 0;
    if (achId === 'rescue3') return shopData.achievements.rescuedCount || 0;
    if (achId === 'noDamage') return shopData.achievements.noDamageLevel ? 1 : 0;
    if (achId === 'visitCave') return shopData.achievements.visitedCave ? 1 : 0;
    if (achId === 'fish5') return shopData.achievements.fishCaughtCount || 0;
    if (achId === 'dig10') return shopData.achievements.treasuresDugCount || 0;
    if (achId === 'beeEscapes3') return shopData.achievements.beeEscapesCount || 0;
    if (achId === 'fireplaceUpgrade') return (shopData.cabinUpgrades && shopData.cabinUpgrades.fireplace > 0) ? 1 : 0;
    if (achId === 'tamed3') {
      if (!shopData.trust) return 0;
      return Object.values(shopData.trust).reduce((a, b) => a + b, 0);
    }
    if (achId === 'mythical1') {
      const caught = shopData.stats ? (shopData.stats.mythicalsCaught || 0) : 0;
      const tamed = shopData.stats ? (shopData.stats.mythicalsTamed || 0) : 0;
      return (caught + tamed);
    }
    if (achId === 'campfireParty') {
      return (shopData.stats && shopData.stats.campfireParty) ? 1 : 0;
    }
    if (achId === 'questMaster') {
      return shopData.stats ? (shopData.stats.questsCompleted || 0) : 0;
    }
    if (achId === 'agilityMaster') {
      return (shopData.agilityRecord && shopData.agilityRecord > 0 && shopData.agilityRecord <= 15.0) ? 1 : 0;
    }
    if (achId === 'wishingWell5') {
      return shopData.stats ? (shopData.stats.wishesCount || 0) : 0;
    }
    if (achId === 'auroraFriend') {
      return (shopData.unlockedStamps && shopData.unlockedStamps['Norja 🇳🇴']) ? 1 : 0;
    }
    if (achId === 'talentMaster5') {
      if (!shopData.talents) return 0;
      return Object.values(shopData.talents).reduce((sum, lvl) => sum + (typeof lvl === 'number' ? lvl : 0), 0);
    }
    if (achId === 'outbackExplorer') {
      return (shopData.unlockedStamps && shopData.unlockedStamps['Australia 🇦🇺']) ? 1 : 0;
    }
    if (achId === 'paleontologist') {
      if (!shopData.fossils) return 0;
      return Object.values(shopData.fossils).filter(Boolean).length;
    }
    if (achId === 'highlandExplorer') {
      return (shopData.unlockedStamps && shopData.unlockedStamps['Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿']) ? 1 : 0;
    }
    if (achId === 'puppyFamily') {
      if (!shopData.puppies) return 0;
      return Object.values(shopData.puppies).filter(Boolean).length;
    }
    return 0;
  }

  function checkAchievements() {
    if (!shopData.achievements) return;
    let updated = false;
    for (const ach of ACHIEVEMENTS) {
      if (shopData.achievements.unlocked.includes(ach.id)) continue;
      
      let progressVal = getAchievementProgress(ach.id);
      
      if (progressVal >= ach.target) {
        shopData.achievements.unlocked.push(ach.id);
        shopData.totalGems += ach.reward;
        showBanner(`🏆 Saavutus: ${ach.name}! +${ach.reward} 💎`);
        Audio.play('legendary');
        updated = true;
      }
    }
    if (updated) {
      saveShopData();
      renderAchievements();
    }
  }

  function renderAchievements() {
    const listEl = document.getElementById('achievements-list');
    if (!listEl) return;
    
    listEl.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = shopData.achievements.unlocked.includes(ach.id);
      let progressVal = getAchievementProgress(ach.id);
      
      let statusHtml = '';
      if (isUnlocked) {
        statusHtml = `<span class="reward-claimed font-bold">Saavutettu!<br>+${ach.reward} 💎</span>`;
      } else {
        statusHtml = `
          <span class="reward-badge">💎 ${ach.reward}</span>
          <span class="progress-text">${Math.min(progressVal, ach.target)}/${ach.target}</span>
        `;
      }
      
      return `
        <div class="achievement-card ${isUnlocked ? 'completed' : ''}">
          <div class="achievement-icon">${ach.icon}</div>
          <div class="achievement-details">
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
          </div>
          <div class="achievement-status">${statusHtml}</div>
        </div>
      `;
    }).join('');
  }

  // --- Onnenpyörä (Lucky Spin) ---
  const luckyspinOverlay = document.getElementById('luckyspin-overlay');
  const luckyspinCanvas = document.getElementById('luckyspin-canvas');
  const luckyspinActionBtn = document.getElementById('luckyspin-action-btn');
  const luckyspinCloseBtn = document.getElementById('luckyspin-close-btn');
  const luckyspinBtnOpen = document.getElementById('luckyspin-btn-open');

  let spinAngle = 0;
  let spinSpeed = 0;
  let isSpinning = false;
  let luckyspinAnimId = null;
  let hasSpunThisSession = false;

  const SPIN_SEGMENTS = [
    { label: '💎 +5', color: '#009688', type: 'gem', value: 5, emoji: '💎' },
    { label: '🦴 +150 XP', color: '#ff9800', type: 'xp', value: 150, emoji: '🦴' },
    { label: '💎 +10', color: '#00bcd4', type: 'gem', value: 10, emoji: '💎' },
    { label: '💨 Pommi', color: '#9c27b0', type: 'item', value: 'smokeBomb', emoji: '💨' },
    { label: '💎 +5', color: '#4caf50', type: 'gem', value: 5, emoji: '💎' },
    { label: '🦴 +300 XP', color: '#ff5722', type: 'xp', value: 300, emoji: '🦴' },
    { label: '💎 +25', color: '#ffca28', textColor: '#3e2723', type: 'gem', value: 25, emoji: '👑' },
    { label: '🐕 Kaveri', color: '#03a9f4', type: 'item', value: 'companion', emoji: '🐕' }
  ];

  function drawWheel() {
    if (!luckyspinCanvas) return;
    const ctx = luckyspinCanvas.getContext('2d');
    const cx = luckyspinCanvas.width / 2;
    const cy = luckyspinCanvas.height / 2;
    const r = Math.min(cx, cy) - 10;
    
    ctx.clearRect(0, 0, luckyspinCanvas.width, luckyspinCanvas.height);
    
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.restore();

    const arc = Math.PI * 2 / SPIN_SEGMENTS.length;
    
    for (let i = 0; i < SPIN_SEGMENTS.length; i++) {
      const seg = SPIN_SEGMENTS[i];
      const startAngle = spinAngle + i * arc;
      const endAngle = startAngle + arc;
      
      ctx.fillStyle = seg.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = seg.textColor || '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(seg.label, r - 15, 0);
      ctx.restore();
    }
    
    ctx.strokeStyle = '#ffca28';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#ff1744';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r + 15);
    ctx.lineTo(cx - 10, cy - r - 8);
    ctx.lineTo(cx + 10, cy - r - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  let lastTickSegment = -1;
  
  function updateWheelAnimation() {
    if (!isSpinning) return;
    
    spinAngle += spinSpeed;
    spinSpeed *= 0.982;
    
    const currentTickSegment = Math.floor((spinAngle % (Math.PI * 2)) / (Math.PI / 4)) % 8;
    if (currentTickSegment !== lastTickSegment) {
      lastTickSegment = currentTickSegment;
      Audio.play('tick');
    }
    
    drawWheel();
    
    if (spinSpeed < 0.0006) {
      spinSpeed = 0;
      isSpinning = false;
      
      const pointerAngle = (3 * Math.PI / 2 - spinAngle) % (Math.PI * 2);
      const positivePointer = pointerAngle < 0 ? pointerAngle + Math.PI * 2 : pointerAngle;
      const winningIndex = Math.floor(positivePointer / (Math.PI / 4)) % 8;
      
      const winner = SPIN_SEGMENTS[winningIndex];
      claimSpinReward(winner);
    } else {
      luckyspinAnimId = requestAnimationFrame(updateWheelAnimation);
    }
  }

  function claimSpinReward(winner) {
    if (winner.type === 'gem') {
      shopData.totalGems += winner.value;
      showBanner(`🎉 Voitit Onnenpyörästä: ${winner.emoji} +${winner.value} Jalokiveä! 🎉`);
      Audio.play('legendary');
    } else if (winner.type === 'xp') {
      gainXp(winner.value);
      showBanner(`🎉 Voitit Onnenpyörästä: ${winner.emoji} +${winner.value} XP-kokemuspistettä! 🎉`);
      Audio.play('levelup');
    } else if (winner.type === 'item') {
      shopData.items[winner.value] = (shopData.items[winner.value] || 0) + 1;
      const itemName = winner.value === 'smokeBomb' ? 'Savupommin' : 'Laumakaverin';
      showBanner(`🎉 Voitit Onnenpyörästä: ${winner.emoji} ilmaisen ${itemName}! 🎉`);
      Audio.play('legendary');
    }
    saveShopData();
    updateHud();
    
    const cx = luckyspinCanvas.width / 2;
    const cy = luckyspinCanvas.height / 2;
    
    let confetti = [];
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      confetti.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color: ['#ffd700', '#ff2a55', '#2b7fff', '#4caf50', '#ffffff'][Math.floor(Math.random() * 5)],
        size: 3.5 + Math.random() * 4,
        alpha: 1.0
      });
    }
    
    function drawConfetti() {
      if (confetti.length === 0) return;
      drawWheel();
      const ctx = luckyspinCanvas.getContext('2d');
      let active = false;
      for (const c of confetti) {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.16;
        c.alpha -= 0.016;
        if (c.alpha > 0) {
          active = true;
          ctx.save();
          ctx.globalAlpha = c.alpha;
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      if (active) {
        requestAnimationFrame(drawConfetti);
      }
    }
    drawConfetti();
    
    luckyspinActionBtn.textContent = 'PALKINTO LUNASTETTU!';
    luckyspinActionBtn.disabled = true;
    luckyspinActionBtn.style.background = '#444';
    luckyspinActionBtn.style.color = '#888';
  }

  if (luckyspinBtnOpen) {
    luckyspinBtnOpen.addEventListener('click', () => {
      if (hasSpunThisSession) {
        luckyspinActionBtn.textContent = 'EI VUOROJA ENÄÄ';
        luckyspinActionBtn.disabled = true;
        luckyspinActionBtn.style.background = '#444';
        luckyspinActionBtn.style.color = '#888';
      } else {
        luckyspinActionBtn.textContent = 'PYÖRÄYTÄ! 🎡';
        luckyspinActionBtn.disabled = false;
        luckyspinActionBtn.style.background = 'linear-gradient(135deg, #ffd54f, #ffb300)';
        luckyspinActionBtn.style.color = '#3e2723';
      }
      luckyspinOverlay.classList.remove('hidden');
      drawWheel();
      Audio.play('skill');
    });
  }

  if (luckyspinCloseBtn) {
    luckyspinCloseBtn.addEventListener('click', () => {
      luckyspinOverlay.classList.add('hidden');
      if (luckyspinAnimId) {
        cancelAnimationFrame(luckyspinAnimId);
        luckyspinAnimId = null;
      }
      Audio.play('skill');
    });
  }

  if (luckyspinActionBtn) {
    luckyspinActionBtn.addEventListener('click', () => {
      if (isSpinning || hasSpunThisSession) return;
      isSpinning = true;
      hasSpunThisSession = true;
      spinSpeed = 0.22 + Math.random() * 0.16;
      lastTickSegment = -1;
      luckyspinActionBtn.textContent = 'PYÖRII...';
      luckyspinActionBtn.disabled = true;
      luckyspinActionBtn.style.background = '#666';
      luckyspinActionBtn.style.color = '#aaa';
      Audio.play('charge');
      updateWheelAnimation();
    });
  }

  function updateMenuHuskyPreview() {
    const canvas = document.getElementById('menu-husky-canvas');
    if (!canvas || overlay.classList.contains('hidden')) {
      if (menuPreviewAnimId) {
        cancelAnimationFrame(menuPreviewAnimId);
        menuPreviewAnimId = null;
      }
      return;
    }
    
    menuPreviewPhase += 0.06;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dummyHusky = {
      kind: 'husky',
      x: canvas.width / 2,
      y: canvas.height / 2 + 10,
      radius: 20,
      flip: 1,
      moving: true,
      animPhase: menuPreviewPhase,
      skin: (shopData && shopData.equippedSkin) || 'default',
      hat: (shopData && shopData.equippedHat) || 'none'
    };
    
    Sprites.draw(ctx, dummyHusky);
    
    menuPreviewAnimId = requestAnimationFrame(updateMenuHuskyPreview);
  }

  function updateMenuBackground() {
    const canvas = document.getElementById('game');
    if (!canvas || overlay.classList.contains('hidden')) {
      if (menuBackgroundAnimId) {
        cancelAnimationFrame(menuBackgroundAnimId);
        menuBackgroundAnimId = null;
      }
      return;
    }
    
    const ctx = canvas.getContext('2d');
    menuBgTime += 0.016;
    
    let season = 'spring';
    if (typeof level !== 'undefined') {
      season = getSeasonForLevel(level);
    }
    
    let bgColor = '#3a5a3a';
    let particleColors = ['#a2e85a', '#ffffff', '#cbe6ff'];
    if (season === 'winter') {
      bgColor = '#a5b5c9';
      particleColors = ['#ffffff', '#e1f5fe', '#e8f5e9'];
    } else if (season === 'autumn') {
      bgColor = '#783c0c';
      particleColors = ['#ffd54f', '#ffb300', '#ff8f00', '#d84315'];
    } else if (season === 'summer') {
      bgColor = '#9c8e54';
      particleColors = ['#ffeb3b', '#ffc107', '#ffffff'];
    }
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.fillRect(i, 0, 1.5, canvas.height);
    }
    for (let j = 0; j < canvas.height; j += 80) {
      ctx.fillRect(0, j, canvas.width, 1.5);
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.25, canvas.height * 0.8, canvas.width * 0.4, canvas.height * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(canvas.width * 0.75, canvas.height * 0.9, canvas.width * 0.5, canvas.height * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let x = 60; x < canvas.width; x += 180) {
      const h = 130 + Math.sin(x) * 40;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.8 - h);
      ctx.lineTo(x - 45, canvas.height * 0.8);
      ctx.lineTo(x + 45, canvas.height * 0.8);
      ctx.closePath();
      ctx.fill();
    }
    
    if (menuBgParticles.length < 32) {
      menuBgParticles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 1.5 + (season === 'winter' ? 0.8 : -0.2),
        vy: 1.0 + Math.random() * 2.0,
        size: 2.0 + Math.random() * 4.0,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08
      });
    }
    
    for (const p of menuBgParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (season === 'autumn') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (season === 'winter') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    
    const g = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    ctx.fillStyle = g;
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);
    
    menuBackgroundAnimId = requestAnimationFrame(updateMenuBackground);
  }

  const overlayObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isHidden = overlay.classList.contains('hidden');
        if (!isHidden) {
          updateMenuHuskyPreview();
          updateMenuBackground();
        } else {
          if (menuPreviewAnimId) {
            cancelAnimationFrame(menuPreviewAnimId);
            menuPreviewAnimId = null;
          }
          if (menuBackgroundAnimId) {
            cancelAnimationFrame(menuBackgroundAnimId);
            menuBackgroundAnimId = null;
          }
        }
      }
    });
  });
  if (overlay) {
    overlayObserver.observe(overlay, { attributes: true });
  }

  function updateStatsUI() {
    const distEl = document.getElementById('stats-dist-val');
    const preyEl = document.getElementById('stats-prey-val');
    const damageEl = document.getElementById('stats-damage-val');
    const questsEl = document.getElementById('stats-quests-val');
    const cardsEl = document.getElementById('stats-postcards-val');
    const photosEl = document.getElementById('stats-photos-val');
    const memoryEl = document.getElementById('stats-memory-val');
    const timeEl = document.getElementById('stats-time-val');

    if (!shopData || !shopData.stats) return;

    if (distEl) {
      const dist = shopData.stats.distanceTraveled || 0;
      if (dist >= 1000) {
        distEl.textContent = `${(dist / 1000).toFixed(2)} km`;
      } else {
        distEl.textContent = `${Math.round(dist)} m`;
      }
    }
    if (preyEl) {
      preyEl.textContent = `${shopData.achievements.caughtCount || 0} kpl`;
    }
    if (damageEl) {
      damageEl.textContent = `${shopData.stats.damageTaken || 0} osumaa`;
    }
    if (questsEl) {
      const completed = Object.keys(shopData.completedQuests || {}).length;
      questsEl.textContent = `${completed} / 10`;
    }
    if (cardsEl) {
      const cards = Object.keys(shopData.unlockedPostcards || {}).length;
      cardsEl.textContent = `${cards} / 16`;
    }
    if (photosEl) {
      const photos = Object.keys(shopData.unlockedPhotos || {}).length;
      photosEl.textContent = `${photos} / 16`;
    }
    if (memoryEl) {
      memoryEl.textContent = `${shopData.stats.memoryWon || 0} peliä`;
    }
    if (timeEl) {
      const secs = shopData.stats.playtimeSeconds || 0;
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      timeEl.textContent = `${mins} min ${remainingSecs} s`;
    }
  }

  setInterval(() => {
    if (typeof shopData !== 'undefined' && shopData.stats) {
      shopData.stats.playtimeSeconds = (shopData.stats.playtimeSeconds || 0) + 1;
      if (shopData.stats.playtimeSeconds % 15 === 0) {
        saveShopData();
      }
    }
  }, 1000);

  const STICKER_DB = [
    { country: 'Suomi 🇫🇮', stickers: ['🌲', '⛄'] },
    { country: 'Sveitsi 🇨🇭', stickers: ['🏔️', '🐮'] },
    { country: 'Egypti 🇪🇬', stickers: ['🐫', '🏜️'] },
    { country: 'Brasilia 🇧🇷', stickers: ['🐒', '🌴'] },
    { country: 'Islanti 🇮🇸', stickers: ['🌋', '🔥'] },
    { country: 'Louisiana 🇺🇸', stickers: ['🐊', '🎷'] },
    { country: 'Kanada 🇨🇦', stickers: ['🍁', '🏒'] },
    { country: 'Kiina 🇨🇳', stickers: ['🐼', '🏮'] },
    { country: 'USA 🇺🇸', stickers: ['🦅', '🏈'] },
    { country: 'Japani 🇯🇵', stickers: ['🌸', '🍣'] }
  ];

  function renderStickerDrawer() {
    const drawerEl = document.getElementById('passport-sticker-drawer');
    if (!drawerEl) return;
    drawerEl.innerHTML = '';

    const unlocked = shopData.unlockedStamps || {};

    STICKER_DB.forEach(item => {
      const isUnlocked = !!unlocked[item.country];
      item.stickers.forEach(emoji => {
        const div = document.createElement('div');
        div.className = `sticker-drawer-item ${isUnlocked ? '' : 'locked'}`;
        div.textContent = emoji;
        div.setAttribute('title', isUnlocked ? 'Valitse tarra liitettäväksi' : `Lukittu: Läpäise ${item.country}`);
        
        if (isUnlocked) {
          if (activeSticker === emoji) {
            div.classList.add('selected');
          }
          div.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeSticker === emoji) {
              activeSticker = null;
            } else {
              activeSticker = emoji;
            }
            Audio.play('click');
            renderStickerDrawer();
            updateStickerHint();
          });
        }
        drawerEl.appendChild(div);
      });
    });
  }

  function updateStickerHint() {
    const hintEl = document.getElementById('sticker-placement-hint');
    if (!hintEl) return;
    if (activeSticker) {
      hintEl.textContent = `✨ Tarran ${activeSticker} asettaminen: klikkaa passin sivua!`;
      hintEl.style.color = '#e65100';
    } else {
      hintEl.textContent = `✨ Valitse tarra ja klikkaa passia lisätäksesi sen! Poista tarra klikkaamalla sitä.`;
      hintEl.style.color = '#8d6e63';
    }
  }

  function renderPastedStickers() {
    const layerEl = document.getElementById('passport-stickers-layer');
    if (!layerEl) return;
    layerEl.innerHTML = '';

    const currentCountry = passportList[passportCurrentIndex];
    if (!currentCountry) return;

    if (!Array.isArray(shopData.stickers)) {
      shopData.stickers = [];
    }

    const pageStickers = shopData.stickers.filter(s => s.country === currentCountry);

    pageStickers.forEach((st) => {
      const el = document.createElement('div');
      el.className = 'passport-sticker';
      el.textContent = st.emoji;
      el.style.left = `${st.x}px`;
      el.style.top = `${st.y}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${st.rotate || 0}deg)`;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const globalIdx = shopData.stickers.findIndex(s => s.country === currentCountry && s.x === st.x && s.y === st.y && s.emoji === st.emoji);
        if (globalIdx !== -1) {
          shopData.stickers.splice(globalIdx, 1);
          saveShopData();
          Audio.play('tick');
          renderPastedStickers();
        }
      });

      layerEl.appendChild(el);
    });
  }

  function initStickersEvents() {
    const bookEl = document.getElementById('passport-book');
    if (!bookEl) return;

    bookEl.removeEventListener('click', handleBookStickerClick);
    bookEl.addEventListener('click', handleBookStickerClick);
  }

  function handleBookStickerClick(e) {
    if (!activeSticker) return;

    const bookEl = document.getElementById('passport-book');
    if (!bookEl) return;

    const rect = bookEl.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (relX < 15 || relX > rect.width - 15 || relY < 15 || relY > rect.height - 15) return;

    const currentCountry = passportList[passportCurrentIndex];
    if (!currentCountry) return;

    const randomRot = Math.floor(Math.random() * 30) - 15;

    if (!Array.isArray(shopData.stickers)) {
      shopData.stickers = [];
    }

    shopData.stickers.push({
      emoji: activeSticker,
      x: Math.round(relX),
      y: Math.round(relY),
      rotate: randomRot,
      country: currentCountry
    });

      saveShopData();
    Audio.play('pet');
    renderPastedStickers();
  }

  // --- Ympäristökohteiden Piirtäminen ---
  function drawMushrooms() {
    for (const m of mushrooms) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.arc(m.x, m.y + 2, m.radius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      if (m.kind === 'chanterelle') {
        ctx.fillStyle = '#ffb300';
        ctx.strokeStyle = '#f57c00';
        ctx.lineWidth = 1.2;
        ctx.fillRect(m.x - 2.5, m.y, 5, 8);
        ctx.beginPath();
        ctx.moveTo(m.x - m.radius, m.y - 3);
        ctx.quadraticCurveTo(m.x, m.y + 2, m.x + m.radius, m.y - 3);
        ctx.lineTo(m.x + m.radius - 2, m.y - 7);
        ctx.quadraticCurveTo(m.x, m.y - 3, m.x - m.radius + 2, m.y - 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(m.x - 2, m.y, 4, 8);
        
        ctx.fillStyle = '#d32f2f';
        ctx.strokeStyle = '#7f0000';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x - 4, m.y - 4, 1.2, 0, Math.PI*2);
        ctx.arc(m.x + 4, m.y - 3, 1.2, 0, Math.PI*2);
        ctx.arc(m.x, m.y - 7, 1.2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawBlueberries() {
    for (const b of blueberries) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.arc(b.x, b.y + 2, b.radius * 0.95, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4caf50';
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.ellipse(b.x - 4, b.y - 2, 7, 3, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(b.x + 4, b.y - 2, 7, 3, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      const berries = [
        { dx: -3, dy: 2, r: 4 },
        { dx: 3, dy: 2, r: 4.2 },
        { dx: 0, dy: -1, r: 4.5 }
      ];
      ctx.fillStyle = '#1a237e';
      ctx.strokeStyle = '#0d47a1';
      ctx.lineWidth = 1.0;
      for (const pt of berries) {
        ctx.beginPath();
        ctx.arc(b.x + pt.dx, b.y + pt.dy, pt.r, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(b.x + pt.dx - 1, b.y + pt.dy - 1, pt.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a237e';
      }

      ctx.restore();
    }
  }

  function drawHoneycombs() {
    for (const hc of honeycombs) {
      ctx.save();
      if (hc.status === 'intact') {
        ctx.fillStyle = '#ffb300';
        ctx.strokeStyle = '#b5651d';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(hc.x, hc.y, hc.radius * 0.85, hc.radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = '#d84315';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(hc.x - hc.radius * 0.6, hc.y - hc.radius * 0.5);
        ctx.lineTo(hc.x + hc.radius * 0.6, hc.y - hc.radius * 0.5);
        ctx.moveTo(hc.x - hc.radius * 0.75, hc.y);
        ctx.lineTo(hc.x + hc.radius * 0.75, hc.y);
        ctx.moveTo(hc.x - hc.radius * 0.6, hc.y + hc.radius * 0.5);
        ctx.lineTo(hc.x + hc.radius * 0.6, hc.y + hc.radius * 0.5);
        ctx.stroke();
        
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(hc.x, hc.y + hc.radius * 0.4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#b5651d';
        ctx.fillRect(hc.x - 3, hc.y - 10, 6, 8);
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍯', hc.x, hc.y + 4);
      }
      ctx.restore();
    }
  }

  function drawNests() {
    for (const nest of nests) {
      ctx.save();
      ctx.strokeStyle = '#5d4037';
      ctx.fillStyle = '#8d6e63';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(nest.x, nest.y, nest.radius, 0, Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(nest.x - nest.radius * 0.8, nest.y + 2);
      ctx.lineTo(nest.x + nest.radius * 0.7, nest.y + 6);
      ctx.moveTo(nest.x - nest.radius * 0.6, nest.y + 8);
      ctx.lineTo(nest.x + nest.radius * 0.5, nest.y + 1);
      ctx.stroke();

      if (nest.status === 'full') {
        ctx.fillStyle = '#80deea';
        ctx.strokeStyle = '#00acc1';
        ctx.lineWidth = 0.6;
        
        ctx.beginPath();
        ctx.ellipse(nest.x - 3, nest.y - 2, 3, 4.5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(nest.x + 3, nest.y - 2, 3.2, 4.2, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawBeeSwarms() {
    for (const s of beeSwarms) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 235, 59, 0.15)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      
      for (let i = 0; i < 8; i++) {
        const angle = (gameTime * 12 + i * (Math.PI / 4)) % (Math.PI * 2);
        const r = s.radius * (0.4 + 0.6 * Math.sin(gameTime * 4 + i));
        const bx = s.x + Math.cos(angle) * r;
        const by = s.y + Math.sin(angle) * r * 0.7;
        
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(bx - 1.5, by - 1, 3, 2);
        ctx.fillStyle = '#212121';
        ctx.fillRect(bx + 0.5, by - 1, 1, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(bx - 1, by - 2.2, 1.8, 1);
      }
      ctx.restore();
    }
  }

  // --- Interaktiiviset Ympäristökohteet Spawnaus & Päivitys ---
  function spawnEnvironmentalObjects() {
    mushrooms = [];
    blueberries = [];
    honeycombs = [];
    nests = [];
    beeSwarms = [];
    
    const isBerryBiome = (biome && (biome.id === 'forest' || biome.id === 'snow' || biome.id === 'river' || biome.id === 'autumn_woods' || biome.id === 'aurora'));
    if (isBerryBiome) {
      const count = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        const pos = randomPos(80);
        if (Math.hypot(pos.x - center.x, pos.y - center.y) < 120) continue;
        if (structures.some(s => Math.hypot(pos.x - s.x, pos.y - s.y) < 100)) continue;
        blueberries.push({ x: pos.x, y: pos.y, radius: 10 });
      }
    }
    speedBoostTimer = 0;
    confusionTimer = 0;

    // Spawnaa sieniä metsä-, suo- ja sumukentille
    const isForestOrSwamp = (biome && (biome.id === 'forest' || biome.id === 'swamp' || biome.id === 'foggy_peaks'));
    if (isForestOrSwamp) {
      const count = 4 + Math.floor(Math.random() * 5); // 4-8 sieniä
      for (let i = 0; i < count; i++) {
        const pos = randomPos(80);
        if (Math.hypot(pos.x - center.x, pos.y - center.y) < 120) continue;
        if (structures.some(s => Math.hypot(pos.x - s.x, pos.y - s.y) < 100)) continue;
        
        const kind = Math.random() < 0.6 ? 'chanterelle' : 'fly_agaric';
        mushrooms.push({ x: pos.x, y: pos.y, radius: 11, kind });
      }
    }

    // Asetetaan hunajakennot ja pesät esteiden päälle
    for (const o of obstacles) {
      if (o.type === 'bush') {
        if (Math.random() < 0.16) {
          honeycombs.push({
            x: o.x,
            y: o.y - 12,
            radius: 12,
            parent: o,
            status: 'intact'
          });
        }
      }
      
      if (o.type === 'bush' || o.type === 'rock') {
        if (Math.random() < 0.14) {
          nests.push({
            x: o.x + (Math.random() < 0.5 ? -1 : 1) * (o.radius * 0.4),
            y: o.y - o.radius * 0.5,
            radius: 13,
            parent: o,
            status: 'full'
          });
        }
      }
    }
  }

  function updateEnvironmentalObjects(dt) {
    if (scene !== 'field' && scene !== 'island') return;

    // --- Sienivauhti ja ohjaussekaannus ---
    if (speedBoostTimer > 0) speedBoostTimer -= dt;
    if (confusionTimer > 0) confusionTimer -= dt;

    // Sienien törmäys
    for (let i = mushrooms.length - 1; i >= 0; i--) {
      const m = mushrooms[i];
      if (Math.hypot(husky.x - m.x, husky.y - m.y) < husky.radius + m.radius) {
        mushrooms.splice(i, 1);
        if (m.kind === 'chanterelle') {
          speedBoostTimer = 4.0;
          Audio.play('mushroom_good');
          spawnBurst(m.x, m.y, ['#ffeb3b', '#fff59d', '#ffffff'], 16);
          spawnTextParticle(m.x, m.y - 12, "VAUHTIBOOSTI! 🏃✨", "#ffeb3b");
          showBanner('💛 Keltaisen kantarellin vauhtiboosti! +25% nopeutta!');
          shopData.ingredients.chanterelle = (shopData.ingredients.chanterelle || 0) + 1;
          saveShopData();
          progressQuest('forage', 1);
        } else {
          confusionTimer = 3.0;
          Audio.play('mushroom_bad');
          spawnBurst(m.x, m.y, ['#e53935', '#ff8a80', '#ffffff'], 18);
          spawnTextParticle(m.x, m.y - 12, "SEKAANNUS! 😵🌀", "#e53935");
          showBanner('🍄 Punainen kärpässieni sekoitti ohjauksen!');
        }
      }
    }

    // Mustikoiden törmäys
    for (let i = blueberries.length - 1; i >= 0; i--) {
      const b = blueberries[i];
      if (Math.hypot(husky.x - b.x, husky.y - b.y) < husky.radius + b.radius) {
        blueberries.splice(i, 1);
        Audio.play('pet');
        spawnBurst(b.x, b.y, ['#3f51b5', '#9c27b0', '#ffffff'], 16);
        spawnTextParticle(b.x, b.y - 12, "MUSTIKKA! 🫐", "#3f51b5");
        showBanner('🫐 Löysit villin metsämustikan! Kokkaa siitä jotain mökissä.');
        shopData.ingredients.blueberry = (shopData.ingredients.blueberry || 0) + 1;
        saveShopData();
        progressQuest('forage', 1);
      }
    }

    // --- Hunajakennot ---
    const howledAt = (x, y, maxDist = 80) => {
      return howlRings.some(r => {
        const curR = (r.t / 0.6) * r.maxR;
        const d = Math.hypot(x - r.x, y - r.y);
        return d < curR + 15 && d < maxDist;
      });
    };

    const bitten = (x, y, maxDist = 42) => {
      return (husky.dashTimer > 0 && Math.hypot(husky.x - x, husky.y - y) < maxDist);
    };

    for (const hc of honeycombs) {
      if (hc.status === 'intact' && (howledAt(hc.x, hc.y, 85) || bitten(hc.x, hc.y, 45))) {
        hc.status = 'broken';
        collectibles.push({
          x: hc.x,
          y: hc.y + 16,
          radius: 14,
          honey: true,
          phase: 0
        });
        Audio.play('levelup');
        spawnBurst(hc.x, hc.y, ['#ffb300', '#ffe082', '#8d6e63'], 22);
        
        beeSwarms.push({
          x: hc.x,
          y: hc.y,
          radius: 12,
          timer: 4.5,
          speed: 215,
          soundCd: 0
        });
        showBanner('🐝 Hunajakenno särkyi! Mehiläiset hyökkäävät! Vältä niitä tai hyppää veteen/mutaan!');
      }
    }

    // --- Linnunpesät ---
    for (const nest of nests) {
      if (nest.status === 'full' && howledAt(nest.x, nest.y, 90)) {
        nest.status = 'empty';
        Audio.play('eagle');
        spawnBurst(nest.x, nest.y, ['#b0bec5', '#8d6e63', '#ffffff'], 16);
        
        if (Math.random() < 0.5) {
          if (typeof Prey !== 'undefined') {
            prey.push(new Prey(nest.x, nest.y - 20, 'bird', 1.0));
            showBanner('🪹 Ulina pelästytti linnun pesästä! Ota se kiinni! 🐦');
          }
        } else {
          collectibles.push({
            x: nest.x,
            y: nest.y + 12,
            radius: 12,
            feather: true,
            phase: 0
          });
          showBanner('🪹 Pesästä putosi hohtava sulka kerättäväksi! 🪶');
        }
      }
    }

    // --- Mehiläisparvet ---
    for (let i = beeSwarms.length - 1; i >= 0; i--) {
      const s = beeSwarms[i];
      s.timer -= dt;
      s.soundCd -= dt;
      
      if (s.soundCd <= 0) {
        Audio.play('buzz');
        s.soundCd = 0.5 + Math.random() * 0.4;
      }

      const dx = husky.x - s.x;
      const dy = husky.y - s.y;
      const dist = Math.hypot(dx, dy) || 1;
      
      s.x += (dx / dist) * s.speed * dt;
      s.y += (dy / dist) * s.speed * dt;

      if (Math.random() < 0.35) {
        spawnBurst(s.x + (Math.random() - 0.5) * 16, s.y + (Math.random() - 0.5) * 16, ['#ffeb3b', '#212121'], 1);
      }

      if (dist < husky.radius + s.radius) {
        s.timer = 0;
        
        const safe = (husky.dashTimer > 0 || husky.inWater || husky.inMud);
        if (safe) {
          spawnTextParticle(husky.x, husky.y - 12, "VÄISTETTY! 🌊🐝", "#80deea");
          spawnBurst(husky.x, husky.y, ['#80deea', '#e0f7fa'], 12);
          Audio.play('shield');
          showBanner('💦 Pakenit mehiläisiä tai peseydyit vedessä/mudassa! 🐝');
          shopData.achievements.beeEscapesCount = (shopData.achievements.beeEscapesCount || 0) + 1;
          checkAchievements();
        } else {
          if (hurtHusky(s.x, s.y)) {
            gameOver();
            return;
          }
          showBanner('🩹 Mehiläiset pistivät! Menetit 1 ❤️');
        }
      }
    }
    
    beeSwarms = beeSwarms.filter(s => s.timer > 0);
  }

  // --- Mitalitaulu / Saavutukset ---
  function openAchievementsModal() {
    running = false;
    renderAchievementsPanelList();
    if (achievementsOverlay) {
      achievementsOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeAchievementsModal() {
    if (achievementsOverlay) {
      achievementsOverlay.classList.add('hidden');
    }
    // Siirretään Huskya vähän alemmas ettei looppaa
    husky.y += 15;
    resumeGame();
  }

  function renderAchievementsPanelList() {
    if (!achievementsPanelList) return;
    achievementsPanelList.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = shopData.achievements.unlocked.includes(ach.id);
      const progressVal = getAchievementProgress(ach.id);
      
      let statusHtml = '';
      if (isUnlocked) {
        statusHtml = `<span style="color: #60ff60; font-weight: bold;">Saavutettu!</span>`;
      } else {
        statusHtml = `<span style="color: #ffd54f;">${Math.min(progressVal, ach.target)}/${ach.target}</span>`;
      }

      return `
        <div class="achievement-card ${isUnlocked ? 'completed' : ''}" style="display: flex; align-items: center; background: rgba(0, 0, 0, 0.25); border: 1.5px solid ${isUnlocked ? '#ffd54f' : 'rgba(255,255,255,0.08)'}; border-radius: 12px; padding: 10px; text-align: left; gap: 10px; position: relative;">
          <div style="font-size: 24px; filter: ${isUnlocked ? 'none' : 'grayscale(100%) opacity(0.4)'};">${ach.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 13px; color: ${isUnlocked ? '#ffd54f' : '#ccc'};">${ach.name}</div>
            <div style="font-size: 11px; opacity: 0.75; line-height: 1.2; margin-top: 2px;">${ach.desc}</div>
          </div>
          <div style="font-size: 11px; text-align: right; font-weight: bold;">
            ${statusHtml}
            <div style="font-size: 10px; opacity: 0.7; font-weight: normal; margin-top: 2px;">💎 +${ach.reward}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Keittopata / Kokkaus järjestelmä ---
  const RECIPES = [
    {
      id: 'salmon_soup',
      name: 'Lohikeitto 🍲',
      desc: 'Täyttää kaikki sydämet ja antaa +1 lisäsydämen tälle tasolle!',
      req: { salmon: 2, chanterelle: 1 }
    },
    {
      id: 'honey_berry_tea',
      name: 'Hunaja-marjatee ☕',
      desc: 'Nostaa kehontämmön korkealle ja estää pyörtymisen kokonaan!',
      req: { honey: 2, blueberry: 1 }
    },
    {
      id: 'winged_bark_snack',
      name: 'Siivekäs kuonopala 🍪',
      desc: 'Tuplaantunut väistönopeus ja -30 % lyhyempi latausaika!',
      req: { feather: 1, chanterelle: 1, honey: 1 }
    }
  ];

  function openCookingModal() {
    running = false;
    renderCookingPanel();
    if (cookingOverlay) {
      cookingOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeCookingModal() {
    if (cookingOverlay) {
      cookingOverlay.classList.add('hidden');
    }
    husky.y += 15;
    resumeGame();
  }

  function renderCookingPanel() {
    if (!cookingIngredientsBar || !cookingRecipesList) return;

    if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
    const ing = shopData.ingredients;

    cookingIngredientsBar.innerHTML = `
      <span>🐟 Lohi: <span style="color:#64b5f6;">${ing.salmon || 0}</span></span>
      <span>🍯 Hunaja: <span style="color:#ffb74d;">${ing.honey || 0}</span></span>
      <span>💛 Kantarelli: <span style="color:#ffd54f;">${ing.chanterelle || 0}</span></span>
      <span>🫐 Mustikka: <span style="color:#90caf9;">${ing.blueberry || 0}</span></span>
      <span>🪶 Sulka: <span style="color:#ce93d8;">${ing.feather || 0}</span></span>
    `;

    cookingRecipesList.innerHTML = RECIPES.map(rec => {
      let canCook = true;
      const reqList = Object.entries(rec.req).map(([item, needed]) => {
        const has = ing[item] || 0;
        if (has < needed) canCook = false;
        const names = { salmon: '🐟 Lohi', honey: '🍯 Hunaja', chanterelle: '💛 Kantarelli', blueberry: '🫐 Mustikka', feather: '🪶 Sulka' };
        return `<span style="color: ${has >= needed ? '#a5d6a7' : '#ef9a9a'}; margin-right: 8px;">${names[item]}: ${has}/${needed}</span>`;
      }).join('');

      const activeText = shopData.activeBuff === rec.id ? '<span style="color:#4caf50; font-weight:bold; margin-left:8px;">(Aktiivinen!)</span>' : '';

      return `
        <div class="recipe-card">
          <div class="recipe-info">
            <h4>${rec.name} ${activeText}</h4>
            <p>${rec.desc}</p>
            <div style="font-size: 11px; margin-top: 4px;">Tarvitaan: ${reqList}</div>
          </div>
          <button class="recipe-cook-btn" ${canCook ? '' : 'disabled'} onclick="cookRecipe('${rec.id}')">
            ${shopData.activeBuff === rec.id ? 'Valmistettu ✔️' : 'Kokkaa 🍲'}
          </button>
        </div>
      `;
    }).join('');
  }

  window.cookRecipe = function(recipeId) {
    const rec = RECIPES.find(r => r.id === recipeId);
    if (!rec) return;

    if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
    const ing = shopData.ingredients;

    for (const [item, needed] of Object.entries(rec.req)) {
      if ((ing[item] || 0) < needed) {
        showBanner('Sinulta puuttuu raaka-aineita! ❌');
        Audio.play('hurt');
        return;
      }
    }

    for (const [item, needed] of Object.entries(rec.req)) {
      ing[item] -= needed;
    }

    shopData.activeBuff = recipeId;
    saveShopData();
    progressQuest('cook_or_fish', 1);
    Audio.play('levelup');
    showBanner(`🍲 Valmistit: ${rec.name}! Vaikutus aktivoituu seuraavalle tasolle!`);
    renderCookingPanel();
  };

  // --- Metsän Ystävät / Lemmikkialbumi Ystäväkirja ---
  const DIARY_ANIMALS = [
    { id: 'squirrel', name: 'Orava 🐿️', desc: 'Lempiruoka: Kantarelli 💛. Löytää piilotettuja kaivupaikkoja kentältä!', icon: '🐿️' },
    { id: 'rabbit', name: 'Kani 🐇', desc: 'Lempiruoka: Mustikka 🫐. Antaa Huskylle +15% liikkumisnopeuden!', icon: '🐇' },
    { id: 'beaver', name: 'Majava 🦫', desc: 'Lempiruoka: Kantarelli 💛. Hidastaa paleltumista talvipakkasilla!', icon: '🦫' },
    { id: 'deer', name: 'Peura 🦌', desc: 'Lempiruoka: Mustikka 🫐. Pudottelee arvokkaita jalokiviä maahan!', icon: '🦌' },
    { id: 'bird', name: 'Metsälintu 🐦', desc: 'Lempiruoka: Hunaja 🍯. Varoittaa pedoista ja hämmentää niitä!', icon: '🐦' }
  ];

  function openDiaryModal() {
    running = false;
    renderDiaryPanel();
    if (diaryOverlay) {
      diaryOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeDiaryModal() {
    if (diaryOverlay) {
      diaryOverlay.classList.add('hidden');
    }
    if (scene === 'interior') husky.y += 15;
    resumeGame();
  }

  function renderDiaryPanel() {
    if (!diaryAnimalList) return;
    if (!shopData.trust) shopData.trust = {};
    
    diaryAnimalList.innerHTML = DIARY_ANIMALS.map(anim => {
      const trust = shopData.trust[anim.id] || 0;
      const isMax = trust >= 5;
      const percentage = Math.min(100, (trust / 5) * 100);
      
      let titleSuffix = '';
      if (trust === 0) titleSuffix = ' (Tuntematon ❓)';
      else if (trust === 1) titleSuffix = ' (Tuttava 🌱)';
      else if (trust === 3) titleSuffix = ' (Ystävä 💖)';
      else if (trust >= 5) titleSuffix = ' (Paras Kaveri 👑)';
      else titleSuffix = ` (Yhteys: ${trust}/5)`;

      return `
        <div class="diary-card ${isMax ? 'max-trust' : ''}">
          <div class="diary-icon">${anim.icon}</div>
          <div class="diary-info">
            <h4>${anim.name}${titleSuffix}</h4>
            <p>${anim.desc}</p>
            <div style="font-size: 10px; opacity: 0.8; margin-top: 4px; color: ${isMax ? '#ffd700' : '#81c784'};">
              ${isMax ? '✨ Suhde saavuttanut huipun!' : `Luottamus: ${trust} / 5`}
            </div>
            <div class="diary-progress-bg">
              <div class="diary-progress-fill" style="width: ${percentage}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Viljelylaatikko / Puutarha ---
  function openGardenModal() {
    running = false;
    renderGardenPanel();
    if (gardenOverlay) {
      gardenOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeGardenModal() {
    if (gardenOverlay) {
      gardenOverlay.classList.add('hidden');
    }
    if (scene === 'interior') husky.y += 15;
    resumeGame();
  }

  function renderGardenPanel() {
    if (!gardenSlotsList) return;
    if (!Array.isArray(shopData.gardenSlots) || shopData.gardenSlots.length !== 3) {
      shopData.gardenSlots = [null, null, null];
    }

    gardenSlotsList.innerHTML = shopData.gardenSlots.map((slot, index) => {
      if (!slot) {
        return `
          <div class="garden-slot-card">
            <div class="garden-slot-title">Maa-alue ${index + 1}</div>
            <div class="garden-slot-icon">🟫</div>
            <div style="font-size: 10px; opacity: 0.8; text-align: center; margin-bottom: 4px;">Tyhjä viljelysmaa</div>
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
              <button class="garden-plant-btn" onclick="plantSeed(${index}, 'blueberry')">🫐 Mustikka (15🦴)</button>
              <button class="garden-plant-btn" onclick="plantSeed(${index}, 'chanterelle')">💛 Kantarelli (15🦴)</button>
              <button class="garden-plant-btn" onclick="plantSeed(${index}, 'clover')">🌸 Apila (15🦴)</button>
            </div>
          </div>
        `;
      }

      const icons = {
        blueberry: ['🌱', '🌿', '🫐'],
        chanterelle: ['🌱', '🌿', '🍄'],
        clover: ['🌱', '🌿', '🌸']
      };
      const names = {
        blueberry: 'Mustikka 🫐',
        chanterelle: 'Kantarelli 💛',
        clover: 'Apila 🌸'
      };
      const stageText = ['Taimi 🌱', 'Verso 🌿', 'Valmis! ✨'][slot.stage];
      const isReady = slot.stage >= 2;
      const currentIcon = (icons[slot.plantType] || icons.blueberry)[slot.stage];

      return `
        <div class="garden-slot-card planted ${isReady ? 'ready' : ''}">
          <div class="garden-slot-title">${names[slot.plantType]}</div>
          <div class="garden-slot-icon">${currentIcon}</div>
          <div style="font-size: 11px; font-weight: bold; color: ${isReady ? '#4caf50' : '#ffb74d'};">${stageText}</div>
          ${isReady 
            ? `<button class="garden-harvest-btn" onclick="harvestSlot(${index})">Kerää sato! 🧺</button>`
            : `<div style="font-size: 9px; opacity: 0.75; text-align: center;">Kypsyy seikkailussa (${2 - slot.stage} taso jäljellä)</div>`
          }
        </div>
      `;
    }).join('');
  }

  window.plantSeed = function(slotIndex, type) {
    if (score < 15) {
      showBanner('Sinulla ei ole tarpeeksi luita siemeniin! (Tarvitaan 15🦴) ❌');
      Audio.play('hurt');
      return;
    }
    score -= 15;
    updateHud();

    shopData.gardenSlots[slotIndex] = { plantType: type, stage: 0 };
    saveShopData();
    Audio.play('levelup');
    showBanner(`🪴 Istutit kasvin: ${type}!`);
    renderGardenPanel();
  };

  window.harvestSlot = function(slotIndex) {
    const slot = shopData.gardenSlots[slotIndex];
    if (!slot || slot.stage < 2) return;

    if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
    const ing = shopData.ingredients;

    if (slot.plantType === 'blueberry') {
      ing.blueberry = (ing.blueberry || 0) + 4;
      showBanner('🧺 Korjasit sadon: +4 🫐 Mustikkaa!');
    } else if (slot.plantType === 'chanterelle') {
      ing.chanterelle = (ing.chanterelle || 0) + 4;
      showBanner('🧺 Korjasit sadon: +4 💛 Kantarellia!');
    } else if (slot.plantType === 'clover') {
      ing.honey = (ing.honey || 0) + 2;
      ing.feather = (ing.feather || 0) + 1;
      showBanner('🧺 Korjasit sadon: +2 🍯 Hunajaa & +1 🪶 Sulka!');
    }

    shopData.gardenSlots[slotIndex] = null;
    saveShopData();
    Audio.play('gem');
    renderGardenPanel();
  };

  // --- Matkamuistokaappi ---
  function openCabinet() {
    running = false;
    selectedSouvenirIndex = -1;
    if (cabinetLoreCard) {
      cabinetLoreCard.innerHTML = '<div class="lore-placeholder">Valitse matkamuisto kaapista nähdäksesi sen tiedot.</div>';
    }
    renderCabinetGrid();
    if (cabinetOverlay) {
      cabinetOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeCabinet() {
    if (cabinetOverlay) {
      cabinetOverlay.classList.add('hidden');
    }
    // Siirretään Huskya vähän alemmas ettei looppaa
    husky.y += 15;
    resumeGame();
  }

  const SOUVENIR_LORE = {
    'Suomi 🇫🇮': {
      lore: 'Lapin lumisilla hangilla revontulien loisteessa kimaltanut mystinen kristalli. Tämän kerääminen toi Huskylle loppumattoman energian ja -10% ulvontakyvyn cooldowniin.',
      buff: '✨ Vaikutus: -10% ulvontakyvyn cooldown-aikaan.'
    },
    'Sveitsi 🇨🇭': {
      lore: 'Jylhiltä Alppien rinteiltä paimenkoiran kaulasta irronnut kello. Parantaa Huskyn pitoa ja kiihtyvyyttä liukkaalla jäällä.',
      buff: '✨ Vaikutus: Parempi pito ja kiihtyvyys jäällä.'
    },
    'Egypti 🇪🇬': {
      lore: 'Saharan polttavasta hiekasta löytynyt muinainen amuletti. Sen magneettinen vetovoima vetää luita ja aarteita puoleensa (+18px säde).',
      buff: '✨ Vaikutus: +18px luunkeräysmagneetin säde.'
    },
    'Brasilia 🇧🇷': {
      lore: 'Trooppisen viidakon syvyydestä kerätty kaunis ja harvinainen kukka. Antaa Huskylle elämänvoimaa (+1 lisäsydän tason alussa).',
      buff: '✨ Vaikutus: +1 pysyvä lisäelämä (max 6).'
    },
    'Islanti 🇮🇸': {
      lore: 'Purkautuvan tulivuoren laavasta jähmettynyt lasinsiru. Suojaa Huskya laavan ja tulen tuhoilta (50% mahdollisuus).',
      buff: '✨ Vaikutus: 50% mahdollisuus torjua laavavahinko.'
    },
    'Louisiana 🇺🇸': {
      lore: 'Mississippi-joen sumuisilta suoalueilta suuren alligaattorin hammas. Antaa +35% mahdollisuuden purema-lisävahinkoon.',
      buff: '✨ Vaikutus: +35% sauma tehdä +1 puremavahinko pomoon.'
    },
    'Kanada 🇨🇦': {
      lore: 'Rocky Mountains -vuoriston kupeesta kerätty makea siirappi. Antaa Huskylle ja Companionille +10% pysyvän nopeusboostin.',
      buff: '✨ Vaikutus: +10% pysyvä liikenopeus Huskylle.'
    },
    'Kiina 🇨🇳': {
      lore: 'Himalajan sumuvuorten kätköistä löytynyt vanha dynastiakolikko. Pidentää savupommin ja ulvonnan stunnien kestoa (+1.0 sekuntia).',
      buff: '✨ Vaikutus: +1.0 sekunti usvapommin & ulvonnan stunneihin.'
    },
    'USA 🇺🇸': {
      lore: 'Uuden-Englannin ruskarunsaissa liitäneen jättikotkan sulka. Antaa +10% lisäkokemuspisteitä kaikista saaliista.',
      buff: '✨ Vaikutus: +10% lisä-XP kaikesta kerätystä kokemuksesta.'
    },
    'Japani 🇯🇵': {
      lore: 'Kioton kristalliluolien neon-hohtoisesta kristallilohkareesta lohjennut pala. Pidentää ja nopeuttaa Huskyn syöksyvää väistöliikettä (+20% kesto/nopeus).',
      buff: '✨ Vaikutus: +20% pidempi/nopeampi syöksyvä väistöliike.'
    },
    'Kreikka 🇬🇷': {
      lore: 'Santorinin valkoisten talojen kupeessa kasvavasta oliivipuusta leikattu oksa. Antaa 20% mahdollisuuden välttää vihollisten hidastukset.',
      buff: '✨ Vaikutus: 20% mahdollisuus torjua hidastukset.'
    },
    'Malediivit 🇲🇻': {
      lore: 'Koralliriutoilta meren syvyyksistä haettu upea simpukka. Lisää lohien ja kalojen houkuttelevuutta kalastaessa.',
      buff: '✨ Vaikutus: Kalat ja lohet tarttuvat 25% nopeammin.'
    },
    'Karibia 🇧🇸': {
      lore: 'Bahamasaarten hiekkaan hautautuneesta arkusta löytynyt vanha messinkikompassi. Näyttää lähimmät aarteet tutkassa 25% suuremmalta etäisyydeltä.',
      buff: '✨ Vaikutus: Tutka näyttää kohteet 25% kauempaa.'
    },
    'Madagaskar 🇲🇬': {
      lore: 'Madagaskarin apinasaarten huipulta pudonnut kova kookospähkinä. Antaa Huskylle pysyvän +5 purentavahingon petoja vastaan.',
      buff: '✨ Vaikutus: Pysyvä +5 purentavahinko petoja vastaan.'
    },
    'Pääsiäissaari 🗿': {
      lore: 'Rapa Nuin mystisiltä rinteiltä lohjennut ikiaikainen kiviliuska. Antaa +25% XP aloitusedun joka tason alussa.',
      buff: '✨ Vaikutus: +25% XP aloitusetu joka tason alussa.'
    },
    'Havaiji 🌋': {
      lore: 'Tulivuorisaaren asukkaiden kiitokseksi antama tuoksuva kukkaseppele. Antaa 15% mahdollisuuden parantua osumasta.',
      buff: '✨ Vaikutus: 15% mahdollisuus parantua osuman ottaessa.'
    }
  };

  function renderCabinetGrid() {
    if (!cabinetShelvesGrid) return;
    
    let html = '';
    for (let r = 0; r < 4; r++) {
      html += '<div class="cabinet-shelf-row">';
      for (let c = 0; c < 4; c++) {
        const i = r * 4 + c;
        const country = passportList[i];
        const entry = PASSPORT_ENTRIES[country];
        const unlocked = shopData.unlockedStamps && shopData.unlockedStamps[country];
        
        if (unlocked && entry) {
          const parts = entry.collectible.split(' ');
          const emoji = parts[parts.length - 1] || '🎁';
          const activeClass = i === selectedSouvenirIndex ? 'active' : '';
          html += `<div class="cabinet-souvenir-item ${activeClass}" data-index="${i}">${emoji}</div>`;
        } else {
          html += `<div class="cabinet-souvenir-item locked">🔒</div>`;
        }
      }
      html += '</div>';
    }
    cabinetShelvesGrid.innerHTML = html;

    // Klikkauskuuntelijat
    cabinetShelvesGrid.querySelectorAll('.cabinet-souvenir-item:not(.locked)').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        selectedSouvenirIndex = idx;
        Audio.play('tick');
        renderCabinetGrid();
        showCabinetDetail(idx);
      });
    });
  }

  function showCabinetDetail(idx) {
    if (!cabinetLoreCard) return;
    const country = passportList[idx];
    const entry = PASSPORT_ENTRIES[country];
    const loreInfo = SOUVENIR_LORE[country] || { lore: 'Ei kuvausta.', buff: 'Ei passiivista etua.' };
    
    const parts = entry.collectible.split(' ');
    const emoji = parts[parts.length - 1] || '🎁';
    const nameOnly = parts.slice(0, parts.length - 1).join(' ') || entry.collectible;

    cabinetLoreCard.innerHTML = `
      <div class="lore-title-row">
        <span class="lore-emoji">${emoji}</span>
        <div class="lore-title-text">
          <h4>${nameOnly}</h4>
          <span>LÖYDETTY: ${country}</span>
        </div>
      </div>
      <p class="lore-story">"${loreInfo.lore}"</p>
      <div class="lore-buff-box">
        <span>💪</span>
        <span>${loreInfo.buff}</span>
      </div>
    `;
  }

  // --- Gramofoni ---
  const TRACKS = [
    { key: 'default', name: 'Pohjolan laulu 🧭', country: null },
    { key: 'finland', name: 'Lapin taikaa 🌲', country: 'Suomi 🇫🇮' },
    { key: 'switzerland', name: 'Alppien kaiku 🏔️', country: 'Sveitsi 🇨🇭' },
    { key: 'egypt', name: 'Saharan hiekka 🏜️', country: 'Egypti 🇪🇬' },
    { key: 'brazil', name: 'Sademetsän rytmi 🌴', country: 'Brasilia 🇧🇷' },
    { key: 'iceland', name: 'Tulivuoren jyrinä 🌋', country: 'Islanti 🇮🇸' },
    { key: 'japan', name: 'Kyoton kuiskaus 🌸', country: 'Japani 🇯🇵' }
  ];

  function openGramophone() {
    running = false;
    renderGramophoneTracks();
    if (gramophoneOverlay) {
      gramophoneOverlay.classList.remove('hidden');
    }
    
    // Alustetaan vinyylin animointitila ja tekstit
    updateGramophoneUI();
    
    // Voimakkuussäädin
    if (gramophoneVolumeInput) {
      gramophoneVolumeInput.value = Audio.getMusicVolume();
    }

    Audio.play('skill');
  }

  function closeGramophone() {
    if (gramophoneOverlay) {
      gramophoneOverlay.classList.add('hidden');
    }
    // Siirretään Huskya vähän kauemmas
    husky.y += 15;
    resumeGame();
  }

  function updateGramophoneUI() {
    if (!gramophoneDisc || !gramophoneTrackTitle || !gramophoneTrackStatus) return;
    
    const currentKey = Audio.getMusicTheme();
    const track = TRACKS.find(t => t.key === currentKey) || TRACKS[0];
    
    gramophoneTrackTitle.textContent = track.name;
    const enabled = Audio.isEnabled();
    
    if (enabled) {
      gramophoneDisc.classList.add('playing');
      gramophoneTrackStatus.textContent = 'Soittaa levyä...';
    } else {
      gramophoneDisc.classList.remove('playing');
      gramophoneTrackStatus.textContent = 'Mykistetty 🔇';
    }
  }

  function renderGramophoneTracks() {
    if (!gramophoneTracksList) return;
    
    const activeTheme = Audio.getMusicTheme();
    
    gramophoneTracksList.innerHTML = TRACKS.map(t => {
      const unlocked = !t.country || (shopData.unlockedStamps && shopData.unlockedStamps[t.country]);
      const isActive = t.key === activeTheme;
      const activeClass = isActive ? 'active' : '';
      const lockedClass = unlocked ? '' : 'locked';
      
      let btnHtml = '';
      if (!unlocked) {
        btnHtml = `<span style="font-size: 11px; color: #888;">🔒 Lukittu</span>`;
      } else if (isActive) {
        btnHtml = `<button class="play-btn" disabled>Soi parhaillaan</button>`;
      } else {
        btnHtml = `<button class="play-btn" data-key="${t.key}">Soita 🎶</button>`;
      }
      
      return `
        <div class="gramophone-track-item ${activeClass} ${lockedClass}">
          <span>📻 ${t.name}</span>
          ${btnHtml}
        </div>
      `;
    }).join('');

    // Soita-nappien kuuntelijat
    gramophoneTracksList.querySelectorAll('.play-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        shopData.equippedMusicTheme = key;
        saveShopData();
        
        Audio.play('levelup');
        Audio.setMusicTheme(key);
        
        renderGramophoneTracks();
        updateGramophoneUI();
      });
    });
  }

  function themeForCountry(countryName) {
    if (countryName === 'Suomi 🇫🇮') return 'finland';
    if (countryName === 'Sveitsi 🇨🇭') return 'switzerland';
    if (countryName === 'Egypti 🇪🇬') return 'egypt';
    if (countryName === 'Brasilia 🇧🇷') return 'brazil';
    if (countryName === 'Islanti 🇮🇸') return 'iceland';
    if (countryName === 'Japani 🇯🇵') return 'japan';
    if (countryName === 'Havaiji 🌋') return 'iceland';
    if (countryName === 'Norja 🇳🇴') return 'iceland';
    if (countryName === 'Australia 🇦🇺') return 'brazil';
    if (countryName === 'Skotlanti 🏴󠁧󠁢󠁳󠁣󠁴󠁿') return 'finland';
    return 'default';
  }

  // --- Päivittäiset Seikkailutehtävät & Haasteet ---
  const QUEST_TEMPLATES = [
    { type: 'catch', name: 'Villi Jahti 🐾', desc: 'Pyydystä 8 saaliseläintä missä tahansa', target: 8, rewardGems: 6, rewardBones: 15, icon: '🐾' },
    { type: 'catch', name: 'Suursaalis 🐿️', desc: 'Pyydystä 15 saaliseläintä', target: 15, rewardGems: 10, rewardBones: 25, icon: '🐿️' },
    { type: 'forage', name: 'Metsän Antimet 🫐', desc: 'Poimi 3 sientä tai mustikkaa luonnosta', target: 3, rewardGems: 6, rewardBones: 15, icon: '🫐' },
    { type: 'cook_or_fish', name: 'Eräkokki 🍲', desc: 'Kokkaa keitos mökissä tai kalasta lohi', target: 1, rewardGems: 8, rewardBones: 20, icon: '🍲' },
    { type: 'tame_or_friend', name: 'Eläinten Ystävä ❤️', desc: 'Syötä metsän eläintä tai juttele leirinuotiolla', target: 1, rewardGems: 8, rewardBones: 15, icon: '❤️' },
    { type: 'dig', name: 'Aarteenetsintä 🗺️', desc: 'Kaiva ylös 2 maahan kätkettyä aarretta', target: 2, rewardGems: 10, rewardBones: 25, icon: '🗺️' },
    { type: 'mythical', name: 'Tähtipölyä 🦄', desc: 'Pyydystä tai kesytä myyttinen valioyksilö', target: 1, rewardGems: 12, rewardBones: 30, icon: '🦄' }
  ];

  function ensureDailyQuests() {
    const today = new Date().toISOString().slice(0, 10);
    if (!shopData.quests || shopData.quests.date !== today || !Array.isArray(shopData.quests.list) || shopData.quests.list.length === 0) {
      const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, 3).map((t, idx) => ({
        id: `quest_${today}_${idx}`,
        type: t.type,
        name: t.name,
        desc: t.desc,
        target: t.target,
        current: 0,
        rewardGems: t.rewardGems,
        rewardBones: t.rewardBones,
        icon: t.icon,
        claimed: false
      }));
      shopData.quests = {
        date: today,
        list: chosen,
        masterClaimed: false
      };
      saveShopData();
    }
  }

  function progressQuest(type, amount = 1) {
    ensureDailyQuests();
    if (!shopData.quests || !Array.isArray(shopData.quests.list)) return;
    let anyChanged = false;
    let newlyFinished = null;
    shopData.quests.list.forEach(q => {
      if (q.type === type && !q.claimed && q.current < q.target) {
        q.current = Math.min(q.target, q.current + amount);
        anyChanged = true;
        if (q.current >= q.target) {
          newlyFinished = q;
        }
      }
    });

    if (anyChanged) {
      saveShopData();
      if (newlyFinished) {
        showBanner(`📜 Tehtävä suoritettu: ${newlyFinished.name}! Avaa Tehtävät ja lunasta palkinto!`);
        Audio.play('goldbone');
      }
    }
  }

  function openQuestsModal() {
    ensureDailyQuests();
    renderQuestsUI();
    if (questsOverlay) questsOverlay.classList.remove('hidden');
    Audio.play('skill');
  }

  function closeQuestsModal() {
    if (questsOverlay) questsOverlay.classList.add('hidden');
    if (scene === 'interior') husky.y += 15;
    resumeGame();
    Audio.play('tick');
  }

  function renderQuestsUI() {
    if (!questsList || !questsDailyDate) return;
    ensureDailyQuests();

    const qData = shopData.quests;
    questsDailyDate.textContent = `Päivämäärä: ${new Date().toLocaleDateString('fi-FI')} • Tehtävät uusiutuvat päivittäin ⏰`;

    questsList.innerHTML = qData.list.map(q => {
      const isReady = q.current >= q.target && !q.claimed;
      const isCompleted = q.claimed;
      const pct = Math.min(100, Math.round((q.current / q.target) * 100));

      let actionHtml = '';
      if (isCompleted) {
        actionHtml = `<span style="font-size: 12px; font-weight: bold; color: #81c784;">✓ Lunastettu</span>`;
      } else if (isReady) {
        actionHtml = `<button class="quest-claim-btn" data-id="${q.id}">Lunasta 🎁 (+${q.rewardGems}💎)</button>`;
      } else {
        actionHtml = `<span style="font-size: 11px; color: #ffb300; font-weight: bold;">+${q.rewardGems} 💎 / +${q.rewardBones} 🦴</span>`;
      }

      return `
        <div class="quest-card ${isReady ? 'ready' : ''} ${isCompleted ? 'completed' : ''}">
          <div class="quest-card-header">
            <div class="quest-card-title"><span>${q.icon}</span> ${q.name}</div>
            <div class="quest-card-rewards">${q.current}/${q.target}</div>
          </div>
          <div class="quest-card-desc">${q.desc}</div>
          <div class="quest-progress-bar-bg">
            <div class="quest-progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');

    questsList.querySelectorAll('.quest-claim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        claimQuest(btn.dataset.id);
      });
    });

    const allClaimed = qData.list.every(q => q.claimed);
    const allReady = qData.list.every(q => q.current >= q.target);
    const completedCount = qData.list.filter(q => q.claimed || q.current >= q.target).length;

    if (qData.masterClaimed) {
      questsMasterStatus.textContent = '✨ Päivän pääpalkinto on jo lunastettu! Uusi arkku huomenna!';
      questsMasterStatus.style.color = '#81c784';
      if (questsClaimMasterBtn) questsClaimMasterBtn.classList.add('hidden');
    } else if (allClaimed || allReady) {
      questsMasterStatus.textContent = '🎉 Kaikki 3 päivätehtävää suoritettu! Voit nyt avata mestariarkun!';
      questsMasterStatus.style.color = '#ffd700';
      if (questsClaimMasterBtn) questsClaimMasterBtn.classList.remove('hidden');
    } else {
      questsMasterStatus.textContent = `Suorita kaikki 3 tehtävää avataksesi suuren aarrearkun (${completedCount}/3 suoritettu)!`;
      questsMasterStatus.style.color = '#b0bec5';
      if (questsClaimMasterBtn) questsClaimMasterBtn.classList.add('hidden');
    }
  }

  function claimQuest(questId) {
    const q = shopData.quests.list.find(item => item.id === questId);
    if (!q || q.claimed || q.current < q.target) return;

    q.claimed = true;
    shopData.totalGems += q.rewardGems;
    score += q.rewardBones;
    if (!shopData.stats) shopData.stats = {};
    shopData.stats.questsCompleted = (shopData.stats.questsCompleted || 0) + 1;
    saveShopData();
    checkAchievements();
    updateHud();

    Audio.play('legendary');
    spawnBurst(viewport.width / 2, viewport.height / 2, ['#ffd700', '#4caf50', '#ffffff'], 30);
    showBanner(`🎉 Lunastit tehtävän: ${q.name}! +${q.rewardGems} 💎 ja +${q.rewardBones} 🦴!`);
    renderQuestsUI();
  }

  function claimMasterQuest() {
    if (!shopData.quests || shopData.quests.masterClaimed) return;
    const allDone = shopData.quests.list.every(q => q.current >= q.target);
    if (!allDone) return;

    shopData.quests.masterClaimed = true;
    shopData.totalGems += 15;
    score += 40;
    lives = maxLives;
    saveShopData();
    checkAchievements();
    updateHud();

    Audio.play('legendary');
    spawnBurst(viewport.width / 2, viewport.height / 2, ['#ffd700', '#ff9800', '#ffffff', '#e040fb'], 45);
    showBanner('👑 AVASIT PÄIVÄN MESTARIARKUN! +15 💎, +40 🦴 ja täydet elämät!');
    renderQuestsUI();
  }

  // --- Revontulien Toivomuskaivo ---
  function openWishingWellModal() {
    if (wellBonesCount) wellBonesCount.textContent = score;
    if (wellGemsCount) wellGemsCount.textContent = shopData.totalGems;
    if (wellResultBanner) wellResultBanner.textContent = '';
    if (wishingWellOverlay) wishingWellOverlay.classList.remove('hidden');
    Audio.play('skill');
  }

  function closeWishingWellModal() {
    if (wishingWellOverlay) wishingWellOverlay.classList.add('hidden');
    if (scene === 'interior') husky.y += 12;
    Audio.play('tick');
  }

  function makeWish(type) {
    if (type === 'bones') {
      if (score < 10) {
        if (wellResultBanner) {
          wellResultBanner.textContent = '❌ Sinulla ei ole tarpeeksi luita (vähintään 10 🦴)!';
          wellResultBanner.style.color = '#ff5252';
        }
        Audio.play('hurt');
        return;
      }
      score -= 10;
      updateHud();
      if (!shopData.stats) shopData.stats = {};
      shopData.stats.wishesCount = (shopData.stats.wishesCount || 0) + 1;

      const r = Math.random();
      let resMsg = '';
      if (r < 0.35) {
        const ingredientsKeys = ['blueberry', 'chanterelle', 'honey', 'salmon'];
        const chosen = ingredientsKeys[Math.floor(Math.random() * ingredientsKeys.length)];
        if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
        shopData.ingredients[chosen] = (shopData.ingredients[chosen] || 0) + 1;
        resMsg = `✨ Kaivo heijasti kuiskauksen: Sait raaka-aineen +1 ${chosen}! 🧺`;
        Audio.play('gem');
      } else if (r < 0.60) {
        shopData.totalGems += 2;
        resMsg = '💎 Kaivon pohjalta kimmelsi: +2 Jalokiveä lisätty reppuusi!';
        Audio.play('goldbone');
      } else if (r < 0.80) {
        lives = maxLives;
        invulnTimer = 8.0;
        updateHud();
        resMsg = '❤️ Kaivon pyhä vesi palautti kaikki elämäsi ja antoi suojakilven!';
        Audio.play('levelup');
      } else {
        score += 25;
        updateHud();
        resMsg = '🦴 Onnentuuri! Kaivosta nousi kultainen suihku: +25 Luuta!';
        Audio.play('goldbone');
      }

      saveShopData();
      checkAchievements();
      if (wellBonesCount) wellBonesCount.textContent = score;
      if (wellGemsCount) wellGemsCount.textContent = shopData.totalGems;
      if (wellResultBanner) {
        wellResultBanner.textContent = resMsg;
        wellResultBanner.style.color = '#81c784';
      }
      spawnBurst(580, 370, ['#00e5ff', '#ffffff', '#ffd700', '#651fff'], 30);
      showBanner(resMsg);
    } else if (type === 'gems') {
      if (shopData.totalGems < 2) {
        if (wellResultBanner) {
          wellResultBanner.textContent = '❌ Sinulla ei ole tarpeeksi jalokiviä (vähintään 2 💎)!';
          wellResultBanner.style.color = '#ff5252';
        }
        Audio.play('hurt');
        return;
      }
      shopData.totalGems -= 2;
      updateHud();
      if (!shopData.stats) shopData.stats = {};
      shopData.stats.wishesCount = (shopData.stats.wishesCount || 0) + 1;

      const r = Math.random();
      let resMsg = '';
      if (r < 0.45) {
        speedBoostTimer = 15.0;
        lives = Math.min(maxLives + 1, lives + 1);
        resMsg = '🌌 REVONTULTEN SIUNAUS! +30% vauhtiaura ja yliluonnollinen elämä!';
        Audio.play('legendary');
      } else if (r < 0.75) {
        shopData.totalGems += 7;
        resMsg = '💎 TIMANTTIRYÖPPY! Kaivosta purskahti valtava aarre: +7 Jalokiveä!';
        Audio.play('legendary');
      } else {
        score += 65;
        if (!shopData.ingredients) shopData.ingredients = { salmon: 0, honey: 0, chanterelle: 0, blueberry: 0, feather: 0 };
        shopData.ingredients.salmon = (shopData.ingredients.salmon || 0) + 2;
        updateHud();
        resMsg = '🐟 KUNINKAALLINEN SAALIS! +65 Luuta ja 2 Tuoretta Lohta!';
        Audio.play('legendary');
      }

      saveShopData();
      checkAchievements();
      if (wellBonesCount) wellBonesCount.textContent = score;
      if (wellGemsCount) wellGemsCount.textContent = shopData.totalGems;
      if (wellResultBanner) {
        wellResultBanner.textContent = resMsg;
        wellResultBanner.style.color = '#00e5ff';
      }
      spawnBurst(580, 370, ['#00e5ff', '#ffffff', '#e040fb', '#ffeb3b'], 45);
      showBanner(resMsg);
    }
  }

  // --- Koirakoulutus & Lahjakkuuspuu (Husky Talent Tree) ---
  const TALENTS_DATA = [
    {
      branchId: 'agility',
      branchName: 'Ketteryys & Nopeus ⚡',
      branchDesc: 'Kehittää huskyn liikkumista ja reagointia maastossa.',
      talents: [
        {
          id: 'speed',
          name: 'Kevyt Tassu 🐾',
          desc: 'Liikkumisnopeus kasvaa +8 % joka tasolla.',
          icon: '🐾',
          maxLvl: 3,
          costs: [
            { bones: 15, gems: 4 },
            { bones: 30, gems: 8 },
            { bones: 50, gems: 15 }
          ]
        },
        {
          id: 'dash',
          name: 'Salamapyrähdys ⚡',
          desc: 'Väistöliikkeen kesto pitenee ja latausaika lyhenee.',
          icon: '⚡',
          maxLvl: 3,
          costs: [
            { bones: 20, gems: 5 },
            { bones: 35, gems: 10 },
            { bones: 55, gems: 18 }
          ]
        }
      ]
    },
    {
      branchId: 'scent',
      branchName: 'Vainu & Onni 🍀',
      branchDesc: 'Auttaa löytämään ja noutamaan enemmän aarteita.',
      talents: [
        {
          id: 'magnet',
          name: 'Luumagneetti 🧲',
          desc: 'Luiden ja aarteiden noutosäde laajenee +22 px / taso.',
          icon: '🧲',
          maxLvl: 3,
          costs: [
            { bones: 15, gems: 4 },
            { bones: 30, gems: 8 },
            { bones: 50, gems: 15 }
          ]
        },
        {
          id: 'fortune',
          name: 'Onnentassu 🍀',
          desc: '+20 % / taso mahdollisuus saada lisäluita tai -jalokivi saaliista.',
          icon: '🍀',
          maxLvl: 3,
          costs: [
            { bones: 25, gems: 6 },
            { bones: 40, gems: 12 },
            { bones: 65, gems: 20 }
          ]
        }
      ]
    },
    {
      branchId: 'nature',
      branchName: 'Luonnonvoimat & Ulvonta 🐺',
      branchDesc: 'Vahvistaa selviytymistä ankarissa sääoloissa ja tehostaa ulvontaa.',
      talents: [
        {
          id: 'stamina',
          name: 'Säänkestävyys 🛡️',
          desc: 'Kylmyyden ja kuumuuden sietokyky paranee 25 % / taso.',
          icon: '🛡️',
          maxLvl: 3,
          costs: [
            { bones: 18, gems: 5 },
            { bones: 32, gems: 10 },
            { bones: 55, gems: 16 }
          ]
        },
        {
          id: 'howl',
          name: 'Kaikuva Ulvonta 🐺',
          desc: 'Ulvonnan kantama kasvaa +30 px ja lamaannus kestää +0.7 s / taso.',
          icon: '🐺',
          maxLvl: 3,
          costs: [
            { bones: 20, gems: 6 },
            { bones: 35, gems: 12 },
            { bones: 60, gems: 18 }
          ]
        }
      ]
    }
  ];

  function openTalentsModal() {
    renderTalentsUI();
    if (talentsOverlay) {
      talentsOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeTalentsModal() {
    if (talentsOverlay) {
      talentsOverlay.classList.add('hidden');
    }
    Audio.play('tick');
  }

  function renderTalentsUI() {
    if (!talentsBranchesGrid) return;
    if (talentsBonesCount) talentsBonesCount.textContent = score;
    if (talentsGemsCount) talentsGemsCount.textContent = shopData.totalGems;

    if (!shopData.talents) {
      shopData.talents = { speed: 0, dash: 0, magnet: 0, fortune: 0, stamina: 0, howl: 0 };
    }

    talentsBranchesGrid.innerHTML = TALENTS_DATA.map(branch => {
      const cardsHtml = branch.talents.map(t => {
        const lvl = shopData.talents[t.id] || 0;
        const maxed = lvl >= t.maxLvl;
        const stars = '★'.repeat(lvl) + '☆'.repeat(t.maxLvl - lvl);
        const nextCost = maxed ? null : t.costs[lvl];
        const canAfford = nextCost ? (score >= nextCost.bones && shopData.totalGems >= nextCost.gems) : false;

        let btnLabel = '';
        if (maxed) {
          btnLabel = 'Maksimitietous ⭐';
        } else {
          btnLabel = `Opi: ${nextCost.bones} 🦴 & ${nextCost.gems} 💎`;
        }

        return `
          <div class="talent-card ${maxed ? 'maxed' : ''}">
            <div class="talent-card-header">
              <span class="talent-icon">${t.icon}</span>
              <div class="talent-title-area">
                <div class="talent-name">${t.name}</div>
                <div class="talent-stars">${stars} (Taso ${lvl}/${t.maxLvl})</div>
              </div>
            </div>
            <div class="talent-desc">${t.desc}</div>
            <button class="talent-upgrade-btn ${canAfford ? 'can-afford' : ''}" 
                    ${maxed || !canAfford ? 'disabled' : ''} 
                    onclick="buyTalent('${t.id}')">
              ${btnLabel}
            </button>
          </div>
        `;
      }).join('');

      return `
        <div class="talent-branch-col">
          <div class="talent-branch-title">${branch.branchName}</div>
          <div class="talent-branch-desc">${branch.branchDesc}</div>
          <div class="talent-cards-list">
            ${cardsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  function buyTalent(talentId) {
    if (!shopData.talents) {
      shopData.talents = { speed: 0, dash: 0, magnet: 0, fortune: 0, stamina: 0, howl: 0 };
    }
    let targetTalent = null;
    for (const b of TALENTS_DATA) {
      const found = b.talents.find(t => t.id === talentId);
      if (found) { targetTalent = found; break; }
    }
    if (!targetTalent) return;

    const curLvl = shopData.talents[talentId] || 0;
    if (curLvl >= targetTalent.maxLvl) {
      showBanner('Tämä lahjakkuus on jo saavuttanut maksimitason! ⭐');
      return;
    }

    const cost = targetTalent.costs[curLvl];
    if (score < cost.bones || shopData.totalGems < cost.gems) {
      showBanner(`Tarvitset ${cost.bones} 🦴 ja ${cost.gems} 💎 kehittääksesi tätä taitoa!`);
      Audio.play('hurt');
      return;
    }

    score -= cost.bones;
    shopData.totalGems -= cost.gems;
    shopData.talents[talentId] = curLvl + 1;
    saveShopData();
    updateHud();
    renderTalentsUI();
    checkAchievements();

    Audio.play('levelup');
    showBanner(`🎓 Opit lahjakkuuden: ${targetTalent.name} (Taso ${shopData.talents[talentId]}/${targetTalent.maxLvl})!`);
    if (typeof husky !== 'undefined' && husky) {
      spawnBurst(husky.x, husky.y, ['#ffd700', '#00e5ff', '#76ff03', '#ffffff'], 24);
    }
  }
  window.buyTalent = buyTalent;

  // --- Muinaiset Fossiilit (Ancient Fossils System) ---
  const FOSSILS_DATA = [
    {
      id: 'trilobite',
      name: 'Trilobiitin Kivettynyt Kuori',
      era: 'Kambrikausi (520 milj. vuotta sitten)',
      desc: 'Muinainen niveljalkainen, jonka kova panssari on säilynyt täydellisesti kivessä.',
      icon: '🐚'
    },
    {
      id: 'amber',
      name: 'Kultainen Meripihka & Hyönteinen',
      era: 'Eoseenikausi (45 milj. vuotta sitten)',
      desc: 'Muinaisen männyn kultaiseen pihkaan ikuistunut siivekäs hyönteinen.',
      icon: '🪨'
    },
    {
      id: 'mammoth',
      name: 'Mammutin Syöksyhammas',
      era: 'Pleistoseenikausi (100 000 vuotta sitten)',
      desc: 'Jättimäinen kaareva syöksyhammas, joka kuului arktisen tundran majesteettiselle herralle.',
      icon: '🦣'
    },
    {
      id: 'plesiosaur',
      name: 'Plesiosauruksen Selkänikama',
      era: 'Jurakausi (150 milj. vuotta sitten)',
      desc: 'Valtavan muinaisen meriliskon massiivinen, merenpohjaan kivettynyt nikama.',
      icon: '🦕'
    },
    {
      id: 't_rex_tooth',
      name: 'Tyrannosauruksen Sahalaitahammas',
      era: 'Liitukausi (68 milj. vuotta sitten)',
      desc: 'Kaikkien aikojen pelätyimmän hirmuliskon 15 senttiä pitkä kivettynyt puruhammas.',
      icon: '🦖'
    }
  ];

  function openFossilsModal() {
    renderFossilsUI();
    if (fossilsOverlay) {
      fossilsOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closeFossilsModal() {
    if (fossilsOverlay) {
      fossilsOverlay.classList.add('hidden');
    }
    Audio.play('tick');
  }

  function renderFossilsUI() {
    if (!fossilsGrid) return;
    if (!shopData.fossils) {
      shopData.fossils = { trilobite: false, amber: false, mammoth: false, plesiosaur: false, t_rex_tooth: false };
    }

    const foundCount = FOSSILS_DATA.filter(f => shopData.fossils[f.id]).length;
    const bonusPct = foundCount * 5;

    if (fossilsFoundCount) fossilsFoundCount.textContent = foundCount;
    if (fossilsBonusPct) fossilsBonusPct.textContent = bonusPct;

    fossilsGrid.innerHTML = FOSSILS_DATA.map(f => {
      const isFound = !!shopData.fossils[f.id];
      return `
        <div class="fossil-card ${isFound ? 'found' : 'undiscovered'}">
          <div class="fossil-icon-wrapper">${isFound ? f.icon : '❓'}</div>
          <div class="fossil-name">${isFound ? f.name : 'Tuntematon Fossiili'}</div>
          <div class="fossil-era">${isFound ? f.era : 'Muinainen Aikakausi'}</div>
          <div class="fossil-desc">${isFound ? f.desc : 'Kaiva aarrepaikkoja (?) seikkailuissa löytääksesi tämän esihistoriallisen aarteen!'}</div>
          <div class="fossil-status-badge ${isFound ? 'found' : 'missing'}">
            ${isFound ? 'Löydetty vitriiniin ✨' : 'Ei vielä löydetty ⛏️'}
          </div>
        </div>
      `;
    }).join('');
  }
  window.openFossilsModal = openFossilsModal;
  window.closeFossilsModal = closeFossilsModal;

  // --- Koiranpennut & Mökin Pentutarha (Puppy Sanctuary System) ---
  const PUPPIES_DATA = [
    {
      id: 'lumi',
      name: 'Lumi',
      emoji: '❄️',
      trait: 'Tarkkakorva',
      desc: 'Lempeä valkoinen napahuskyn pentu. Tarkat korvat ja vainu aistivat kätketyt aarteet kaukaa.',
      perk: '+16 px Magneettisäde luihin & aarteisiin'
    },
    {
      id: 'kipina',
      name: 'Kipinä',
      emoji: '🔥',
      trait: 'Vauhtitassu',
      desc: 'Tulikettumainen, leikkisä ja rohkea pentu. Juoksee aina innokkaasti seikkailun kärjessä.',
      perk: '+6 % Liikkumisnopeus seikkailussa'
    },
    {
      id: 'hilla',
      name: 'Hilla',
      emoji: '🫐',
      trait: 'Herkkusuu',
      desc: 'Lapin kultainen marjapentu. Rakastaa metsän antimia ja osaa löytää kaikkein mehevimmät herkut.',
      perk: 'Antaa lisä-XP:tä marjoista & sienistä'
    },
    {
      id: 'salama',
      name: 'Salama',
      emoji: '⚡',
      trait: 'Akrobaatti',
      desc: 'Mustavalkoinen pikakiitäjä, joka loikkii ketterästi kivien ja esteiden yli.',
      perk: '-20 % Syöksyn (Dash) latausaika'
    },
    {
      id: 'toivo',
      name: 'Toivo',
      emoji: '🍀',
      trait: 'Onnentuoja',
      desc: 'Suloinen onnenpentu, joka kantaa mukanaan hyvää onnea kaikkialle minne menee.',
      perk: '+20 % Mahdollisuus tuplaluluihin seikkailussa'
    }
  ];

  function openPuppiesModal() {
    renderPuppiesUI();
    if (puppiesOverlay) {
      puppiesOverlay.classList.remove('hidden');
    }
    Audio.play('skill');
  }

  function closePuppiesModal() {
    if (puppiesOverlay) {
      puppiesOverlay.classList.add('hidden');
    }
    Audio.play('tick');
  }

  function setActivePuppy(puppyId) {
    if (!shopData.puppies) shopData.puppies = {};
    if (!shopData.puppies[puppyId]) return;

    if (shopData.activePuppy === puppyId) {
      shopData.activePuppy = null;
      showBanner('🐾 Pentukaveri jäi lepäämään pentutarhaan.');
    } else {
      shopData.activePuppy = puppyId;
      const pup = PUPPIES_DATA.find(p => p.id === puppyId);
      const pupName = pup ? `${pup.name} ${pup.emoji}` : 'Pentu';
      showBanner(`✨ ${pupName} lähti mukaan seikkailuusi!`);
      Audio.play('legendary');
    }
    saveShopData();
    renderPuppiesUI();
  }

  function petPuppy(puppyId) {
    if (!shopData.puppies || !shopData.puppies[puppyId]) return;
    if (!shopData.puppyHappiness) shopData.puppyHappiness = {};
    shopData.puppyHappiness[puppyId] = Math.min(100, (shopData.puppyHappiness[puppyId] || 80) + 20);
    saveShopData();
    Audio.play('artifact');
    const pup = PUPPIES_DATA.find(p => p.id === puppyId);
    showBanner(`❤️ Silitit pentua ${pup ? pup.name : ''}! Pentu heiluttaa häntää ja antaa pusuja!`);
    renderPuppiesUI();
  }

  function feedPuppy(puppyId) {
    if (!shopData.puppies || !shopData.puppies[puppyId]) return;
    if (shopData.totalBones < 5) {
      showBanner('Tarvitset 5 luuta 🦴 ostaaksesi herkkukeksin!');
      Audio.play('hurt');
      return;
    }
    shopData.totalBones -= 5;
    if (!shopData.puppyHappiness) shopData.puppyHappiness = {};
    shopData.puppyHappiness[puppyId] = 100;
    gainXp(15);
    saveShopData();
    updateHud();
    Audio.play('levelup');
    const pup = PUPPIES_DATA.find(p => p.id === puppyId);
    showBanner(`🍪 Annoit herkkukeksin pennulle ${pup ? pup.name : ''}! Pentu on onnellinen (+15 XP)!`);
    renderPuppiesUI();
  }

  function renderPuppiesUI() {
    if (!puppiesGrid) return;
    if (!shopData.puppies) {
      shopData.puppies = { lumi: false, kipina: false, hilla: false, salama: false, toivo: false };
    }
    if (!shopData.puppyHappiness) {
      shopData.puppyHappiness = { lumi: 100, kipina: 100, hilla: 100, salama: 100, toivo: 100 };
    }

    const rescuedCount = PUPPIES_DATA.filter(p => shopData.puppies[p.id]).length;
    const activePup = PUPPIES_DATA.find(p => p.id === shopData.activePuppy && shopData.puppies[p.id]);

    if (puppiesFoundCount) puppiesFoundCount.textContent = rescuedCount;
    if (puppiesActiveName) {
      puppiesActiveName.textContent = activePup ? `${activePup.name} ${activePup.emoji}` : 'Ei valittu';
      puppiesActiveName.style.color = activePup ? '#ffd54f' : '#b0bec5';
    }

    puppiesGrid.innerHTML = PUPPIES_DATA.map(p => {
      const isRescued = !!shopData.puppies[p.id];
      const isActive = isRescued && (shopData.activePuppy === p.id);
      const happiness = Math.max(20, Math.min(100, shopData.puppyHappiness[p.id] || 100));

      return `
        <div class="puppy-card ${isRescued ? 'rescued' : 'unrescued'} ${isActive ? 'active-companion' : ''}">
          <div class="puppy-avatar">${isRescued ? p.emoji : '🔒'}</div>
          <div class="puppy-name">${isRescued ? p.name : 'Eksynyt Pentu'}</div>
          <div class="puppy-trait">${isRescued ? p.trait : 'Pelastettavissa'}</div>
          <div class="puppy-desc">${isRescued ? p.desc : 'Etsi ja pelasta tämä pentu seikkailuista kotiin pentutarhaan!'}</div>
          <div class="puppy-perk-badge">${p.perk}</div>
          
          ${isRescued ? `
            <div class="puppy-happiness-wrap">
              <div class="puppy-happiness-label">
                <span>Onnellisuus</span>
                <span>${happiness}% ❤️</span>
              </div>
              <div class="puppy-happiness-bar">
                <div class="puppy-happiness-fill" style="width: ${happiness}%;"></div>
              </div>
            </div>

            <div class="puppy-buttons-row">
              <button class="puppy-btn puppy-btn-select ${isActive ? 'active' : ''}" onclick="setActivePuppy('${p.id}')">
                ${isActive ? 'Valittuna ✨' : 'Mukaan 🐾'}
              </button>
              <button class="puppy-btn puppy-btn-pet" onclick="petPuppy('${p.id}')">
                Silitä ❤️
              </button>
              <button class="puppy-btn puppy-btn-feed" onclick="feedPuppy('${p.id}')">
                Keksi 🍪 (5 🦴)
              </button>
            </div>
          ` : `
            <div class="puppy-unrescued-badge">Pelasta tasolta 🐾</div>
          `}
        </div>
      `;
    }).join('');
  }

  window.openPuppiesModal = openPuppiesModal;
  window.closePuppiesModal = closePuppiesModal;
  window.setActivePuppy = setActivePuppy;
  window.petPuppy = petPuppy;
  window.feedPuppy = feedPuppy;

  // --- Koiran Agility-Esterata (Minipeli) ---
  function startAgilityCourse() {
    scene = 'agility';
    agilityState = 'countdown';
    agilityCountdown = 3.0;
    agilityTimer = 0;
    agilityPenalties = 0;
    agilityStage = 0;
    agilityTunnelBoost = 0;
    agilityPenaltyNoticeTimer = 0;
    agilityPenaltyText = '';

    agilityPoles = [
      { x: 210, y: 190, passed: false, requireY: 'above' },
      { x: 270, y: 190, passed: false, requireY: 'below' },
      { x: 330, y: 190, passed: false, requireY: 'above' },
      { x: 390, y: 190, passed: false, requireY: 'below' }
    ];
    agilityHurdle = { x: 500, y: 190, w: 70, h: 26, cleared: false, knocked: false };
    agilityHoop = { x: 670, y: 190, radius: 28, cleared: false };
    agilityTunnel = { inX: 710, inY: 310, outX: 540, outY: 370, radius: 34, used: false };
    agilityRamp = { x1: 480, x2: 260, y: 370, h: 36, cleared: false };
    agilityFinish = { x: 120, y: 370, crossed: false };

    husky.x = 90;
    husky.y = 190;
    husky.facing = 0;
    husky.vx = 0;
    husky.vy = 0;
    invulnTimer = 0.5;

    Audio.play('whistle');
    showBanner('🐕🏁 Valmistaudu Agility-rataan! Lähtöön 3 sekuntia...');
  }

  function updateAgility(dt) {
    if (agilityState === 'countdown') {
      agilityCountdown -= dt;
      if (agilityCountdown <= 0) {
        agilityState = 'running';
        Audio.play('whistle');
        showBanner('🏃 NYT! Juokse esteet järjestyksessä maaliin!');
      }
    } else if (agilityState === 'running') {
      agilityTimer += dt;
      if (agilityPenaltyNoticeTimer > 0) agilityPenaltyNoticeTimer -= dt;

      // Hyppy / Kirmaus (Space tai Shift)
      const spacePressed = Input.consumeHowl() || Input.isSpaceHeld();
      if (spacePressed && husky.dashTimer <= 0) {
        husky.dashTimer = 0.42;
        Audio.play('skill');
        spawnBurst(husky.x, husky.y, ['#ffffff', '#a5d6a7'], 8);
      }

      if (agilityTunnelBoost > 0) agilityTunnelBoost -= dt;

      const dir = Input.getDirection();
      husky.update(dt, dir, AGILITY_WORLD, [], perks, Input.isSprinting() || agilityTunnelBoost > 0, 'summer');

      // Pidetään husky nurmialueella
      husky.x = clamp(husky.x, 40, AGILITY_WORLD.width - 40);
      husky.y = clamp(husky.y, 40, AGILITY_WORLD.height - 40);

      // 1. Slalom-kepit
      for (const p of agilityPoles) {
        if (!p.passed && Math.hypot(husky.x - p.x, husky.y - p.y) < 36) {
          const sideOk = (p.requireY === 'above' && husky.y <= p.y + 6) || (p.requireY === 'below' && husky.y >= p.y - 6);
          if (sideOk) {
            p.passed = true;
            Audio.play('tick');
            spawnBurst(p.x, p.y, ['#69f0ae', '#ffffff'], 8);
          }
        }
      }
      if (agilityPoles.every(p => p.passed)) {
        agilityStage = Math.max(agilityStage, 1);
      }

      // 2. Aita / Hyppyeste
      if (!agilityHurdle.cleared && Math.abs(husky.x - agilityHurdle.x) < 35 && Math.abs(husky.y - agilityHurdle.y) < 26) {
        if (husky.dashTimer > 0) {
          agilityHurdle.cleared = true;
          agilityStage = Math.max(agilityStage, 2);
          Audio.play('levelup');
          spawnBurst(agilityHurdle.x, agilityHurdle.y, ['#ffd700', '#ffffff', '#4caf50'], 16);
          spawnTextParticle(husky.x, husky.y - 18, "HYPPY! 🐾✨", "#69f0ae");
        } else if (!agilityHurdle.knocked) {
          agilityHurdle.knocked = true;
          agilityPenalties += 2.0;
          agilityPenaltyNoticeTimer = 1.6;
          agilityPenaltyText = '+2.0s SAKKO (Aitaan osuminen)!';
          Audio.play('hurt');
          shakeTimer = 0.22;
          spawnBurst(agilityHurdle.x, agilityHurdle.y, ['#ff5252', '#ffffff'], 14);
          agilityStage = Math.max(agilityStage, 2);
        }
      }

      // 3. Rengaseste
      if (!agilityHoop.cleared && Math.hypot(husky.x - agilityHoop.x, husky.y - agilityHoop.y) < 34) {
        agilityHoop.cleared = true;
        agilityStage = Math.max(agilityStage, 3);
        Audio.play('levelup');
        spawnBurst(agilityHoop.x, agilityHoop.y, ['#00e5ff', '#ffffff', '#ffd700'], 20);
        spawnTextParticle(husky.x, husky.y - 18, "RENGASLÄPÄISY! ⭕💫", "#00e5ff");
      }

      // 4. Agility-Tunneli
      if (!agilityTunnel.used && Math.hypot(husky.x - agilityTunnel.inX, husky.y - agilityTunnel.inY) < 32) {
        agilityTunnel.used = true;
        agilityStage = Math.max(agilityStage, 4);
        husky.x = agilityTunnel.outX;
        husky.y = agilityTunnel.outY;
        husky.facing = Math.PI;
        agilityTunnelBoost = 2.2;
        Audio.play('catch');
        spawnBurst(agilityTunnel.outX, agilityTunnel.outY, ['#ffeb3b', '#ff9800', '#ffffff'], 22);
        spawnTextParticle(husky.x, husky.y - 18, "TUNNELISPURTTI! 🌀💨", "#ffeb3b");
      }

      // 5. Tasapainosilta / Ramppi
      if (!agilityRamp.cleared && husky.x <= 280 && husky.x >= 230 && Math.abs(husky.y - agilityRamp.y) < 28) {
        agilityRamp.cleared = true;
        agilityStage = Math.max(agilityStage, 5);
        Audio.play('tick');
        spawnBurst(260, agilityRamp.y, ['#8d6e63', '#ffffff'], 8);
      }

      // 6. Maaliviiva
      if (!agilityFinish.crossed && agilityStage >= 4 && Math.abs(husky.x - agilityFinish.x) < 24 && Math.abs(husky.y - agilityFinish.y) < 40) {
        agilityFinish.crossed = true;
        finishAgilityCourse();
      }
    }

    updateEffects(dt);
  }

  function finishAgilityCourse() {
    agilityState = 'finished';
    const rawTime = agilityTimer;
    const finalTime = rawTime + agilityPenalties;

    let medal = 'participate';
    let medalTitle = 'OSALLISTUMISPALKINTO 🐾';
    let medalEmoji = '🐾';
    let rewardGems = 2;
    let rewardBones = 12;
    let rewardXp = 10;

    if (finalTime < 15.0) {
      medal = 'gold';
      medalTitle = '🥇 KULTAMITALI!';
      medalEmoji = '🥇';
      rewardGems = 15;
      rewardBones = 60;
      rewardXp = 40;
    } else if (finalTime < 20.0) {
      medal = 'silver';
      medalTitle = '🥈 HOPEAMITALI!';
      medalEmoji = '🥈';
      rewardGems = 10;
      rewardBones = 35;
      rewardXp = 25;
    } else if (finalTime < 26.0) {
      medal = 'bronze';
      medalTitle = '🥉 PRONSSIMITALI!';
      medalEmoji = '🥉';
      rewardGems = 5;
      rewardBones = 18;
      rewardXp = 15;
    }

    const prevBest = shopData.agilityRecord || 0;
    const isNewRecord = prevBest === 0 || finalTime < prevBest;
    if (isNewRecord) {
      shopData.agilityRecord = finalTime;
    }

    shopData.totalGems += rewardGems;
    score += rewardBones;
    gainXp(rewardXp);
    saveShopData();
    checkAchievements();
    updateHud();

    Audio.play('legendary');
    spawnBurst(viewport.width / 2, viewport.height / 2, ['#ffd700', '#4caf50', '#ffffff', '#00e5ff'], 40);

    if (agilityMedalDisplay) agilityMedalDisplay.textContent = medalEmoji;
    if (agilityMedalTitle) {
      agilityMedalTitle.textContent = medalTitle;
      agilityMedalTitle.style.color = (medal === 'gold' ? '#ffd700' : medal === 'silver' ? '#cfd8dc' : medal === 'bronze' ? '#ffab91' : '#a5d6a7');
    }
    if (agilityStatTime) agilityStatTime.textContent = `${rawTime.toFixed(2)}s`;
    if (agilityStatPenalties) agilityStatPenalties.textContent = `+${agilityPenalties.toFixed(1)}s`;
    if (agilityStatFinal) agilityStatFinal.textContent = `${finalTime.toFixed(2)}s`;
    if (agilityStatBest) agilityStatBest.textContent = `${(shopData.agilityRecord || finalTime).toFixed(2)}s ${isNewRecord ? '(UUSI ENNÄTYS! ✨)' : ''}`;
    if (agilityRewardsText) agilityRewardsText.textContent = `Palkinto: +${rewardGems} 💎 & +${rewardBones} 🦴 & +${rewardXp} XP!`;

    if (agilityFinishOverlay) agilityFinishOverlay.classList.remove('hidden');
  }

  function exitAgilityToBackyard() {
    if (agilityFinishOverlay) agilityFinishOverlay.classList.add('hidden');
    scene = 'interior';
    husky.x = 220;
    husky.y = 370;
    husky.facing = 0;
    Audio.play('tick');
    showBanner('🏕️ Palasit takapihan leiriin!');
  }

  function drawAgility() {
    // 1. Nurmikenttä & raidat
    ctx.save();
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, AGILITY_WORLD.width, AGILITY_WORLD.height);
    for (let x = 0; x < AGILITY_WORLD.width; x += 60) {
      if ((x / 60) % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(x, 0, 60, AGILITY_WORLD.height);
      }
    }
    // Valkoiset rajat
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, AGILITY_WORLD.width - 60, AGILITY_WORLD.height - 60);

    // Ratareitin opasviivat (katkoviiva)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(90, 190);
    ctx.lineTo(400, 190);
    ctx.lineTo(500, 190);
    ctx.lineTo(670, 190);
    ctx.arcTo(730, 190, 730, 290, 40);
    ctx.lineTo(710, 310);
    ctx.moveTo(540, 370);
    ctx.lineTo(120, 370);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Lähtöviiva (x: 90, y: 190)
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(80, 160, 10, 60);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('LÄHTÖ 🚩', 85, 150);

    // 3. Slalom-kepit
    for (let i = 0; i < agilityPoles.length; i++) {
      const p = agilityPoles[i];
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 6, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.passed ? '#4caf50' : '#d32f2f';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 6);
      ctx.lineTo(p.x, p.y - 18);
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 18, 4, 0, Math.PI * 2);
      ctx.fill();

      // Opastepiste ylös / alas
      ctx.font = '9px sans-serif';
      ctx.fillStyle = p.passed ? '#81c784' : '#ffcc80';
      ctx.fillText(p.requireY === 'above' ? '▲ ylös' : '▼ alas', p.x, p.y + (p.requireY === 'above' ? -26 : 20));
      if (p.passed) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#69f0ae';
        ctx.fillText('✓', p.x, p.y - 2);
      }
    }

    // 4. Aita / Hyppyeste (x: 500, y: 190)
    const h = agilityHurdle;
    ctx.fillStyle = '#455a64';
    ctx.fillRect(h.x - 30, h.y - 14, 6, 28);
    ctx.fillRect(h.x + 24, h.y - 14, 6, 28);
    if (h.knocked) {
      ctx.strokeStyle = '#d32f2f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(h.x - 24, h.y + 12);
      ctx.lineTo(h.x + 24, h.y + 14);
      ctx.stroke();
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ff5252';
      ctx.fillText('PUDONNUT! ❌', h.x, h.y + 28);
    } else {
      ctx.strokeStyle = h.cleared ? '#4caf50' : '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(h.x - 24, h.y - 4);
      ctx.lineTo(h.x + 24, h.y - 4);
      ctx.stroke();
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = h.cleared ? '#69f0ae' : '#ffeb3b';
      ctx.fillText(h.cleared ? 'YLITETTY! ✨' : 'HYPPÄÄ (SPACE)!', h.x, h.y - 20);
    }

    // 5. Rengaseste (x: 670, y: 190)
    const hoop = agilityHoop;
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hoop.x, hoop.y + 24); ctx.lineTo(hoop.x, hoop.y - 26);
    ctx.stroke();
    ctx.strokeStyle = hoop.cleared ? '#69f0ae' : '#00e5ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(hoop.x, hoop.y, hoop.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = hoop.cleared ? '#69f0ae' : '#80d8ff';
    ctx.fillText(hoop.cleared ? 'LÄPI! ⭕' : 'RENGAS ⭕', hoop.x, hoop.y - 34);

    // 6. Agility-Tunneli (710, 310) -> (540, 370)
    ctx.save();
    ctx.fillStyle = '#fbc02d';
    ctx.strokeStyle = '#f57f17';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(710, 286);
    ctx.quadraticCurveTo(720, 370, 540, 350);
    ctx.lineTo(540, 390);
    ctx.quadraticCurveTo(735, 390, 710, 334);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('TUNNELI 🌀', 635, 345);
    ctx.restore();

    // 7. Tasapainosilta / Ramppi (480..260, y: 370)
    ctx.save();
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(260, 358, 220, 24);
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    ctx.strokeRect(260, 358, 220, 24);
    ctx.fillStyle = '#d7ccc8';
    for (let rx = 275; rx < 475; rx += 25) {
      ctx.fillRect(rx, 360, 2, 20);
    }
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = agilityRamp.cleared ? '#69f0ae' : '#ffe0b2';
    ctx.fillText(agilityRamp.cleared ? 'RAMPPI SELVITETTY! ✓' : 'TASAPAINOSILTA 🌉', 370, 350);
    ctx.restore();

    // 8. Maalilinja (x: 120, y: 370)
    ctx.fillStyle = '#000';
    ctx.fillRect(110, 335, 20, 70);
    for (let my = 335; my < 405; my += 14) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(110, my, 10, 7);
      ctx.fillRect(120, my + 7, 10, 7);
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('MAALI 🏁', 120, 325);

    // Piirrä husky
    Sprites.draw(ctx, husky);

    // Live HUD yläreunassa
    ctx.fillStyle = 'rgba(10, 20, 15, 0.85)';
    ctx.fillRect(40, 10, AGILITY_WORLD.width - 80, 36);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 10, AGILITY_WORLD.width - 80, 36);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.textAlign = 'left';
    ctx.fillText(`⏱️ Aika: ${agilityTimer.toFixed(2)}s`, 60, 33);
    ctx.fillStyle = agilityPenalties > 0 ? '#ff5252' : '#b0bec5';
    ctx.fillText(`Sakot: +${agilityPenalties.toFixed(1)}s`, 220, 33);
    ctx.fillStyle = '#fff';
    ctx.fillText(`Yhteensä: ${(agilityTimer + agilityPenalties).toFixed(2)}s`, 360, 33);
    ctx.fillStyle = '#69f0ae';
    ctx.textAlign = 'right';
    ctx.fillText(`🏆 Ennätys: ${shopData.agilityRecord ? shopData.agilityRecord.toFixed(2) + 's' : '--'}`, AGILITY_WORLD.width - 60, 33);

    // Countdown / Penalty bannerit
    if (agilityState === 'countdown') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, AGILITY_WORLD.width, AGILITY_WORLD.height);
      ctx.font = 'bold 56px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.textAlign = 'center';
      const cSec = Math.ceil(agilityCountdown);
      ctx.fillText(cSec > 0 ? cSec : 'NYT!', AGILITY_WORLD.width / 2, AGILITY_WORLD.height / 2);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Paina SPACE hypätäksesi esteiden yli!', AGILITY_WORLD.width / 2, AGILITY_WORLD.height / 2 + 50);
    } else if (agilityPenaltyNoticeTimer > 0) {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ff5252';
      ctx.textAlign = 'center';
      ctx.fillText(agilityPenaltyText, AGILITY_WORLD.width / 2, 80);
    }

    ctx.restore();
  }

  // --- Lisätään klikkauskuuntelijat kanvakselle laitteiden klikkaamiseksi ---
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      if (scene !== 'interior' || !running) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * viewport.width + cam.x;
      const clickY = ((e.clientY - rect.top) / rect.height) * viewport.height + cam.y;
      
      // Kaappi (x: 115..211, y: 75..187)
      if (shopData.cabinUpgrades.trophyWall && clickX >= 115 && clickX <= 211 && clickY >= 75 && clickY <= 187) {
        if (Math.hypot(husky.x - 163, husky.y - 170) < 95) {
          openCabinet();
        } else {
          showBanner('Mene lähemmäs palkintokaappia! 🚶');
        }
      }
      
      // Gramofoni (x: 460..505, y: 75..118)
      if (shopData.cabinUpgrades.gramophone && clickX >= 460 && clickX <= 505 && clickY >= 75 && clickY <= 118) {
        if (Math.hypot(husky.x - 480, husky.y - 95) < 95) {
          openGramophone();
        } else {
          showBanner('Mene lähemmäs gramofonia! 🚶');
        }
      }
      
      // Mitalitaulu (x: 230..290, y: 70..120)
      if (shopData.cabinUpgrades.achievementsPlaque && clickX >= 230 && clickX <= 290 && clickY >= 70 && clickY <= 120) {
        if (Math.hypot(husky.x - 260, husky.y - 120) < 95) {
          openAchievementsModal();
        } else {
          showBanner('Mene lähemmäs mitalitaulua! 🚶');
        }
      }

      // Keittopata (x: 405..445, y: 90..130)
      if (clickX >= 405 && clickX <= 445 && clickY >= 90 && clickY <= 130) {
        if (Math.hypot(husky.x - 425, husky.y - 120) < 95) {
          openCookingModal();
        } else {
          showBanner('Mene lähemmäs keittopataa! 🚶');
        }
      }

      // Viljelylaatikko (x: 300..340, y: 90..120)
      if (shopData.cabinUpgrades.planterPots && clickX >= 300 && clickX <= 340 && clickY >= 90 && clickY <= 120) {
        if (Math.hypot(husky.x - 320, husky.y - 120) < 95) {
          openGardenModal();
        } else {
          showBanner('Mene lähemmäs viljelylaatikkoa! 🚶');
        }
      }

      // Koulutusdiplomi (x: 335..365, y: 60..90)
      if (interior.kind === 'house' && clickX >= 335 && clickX <= 365 && clickY >= 60 && clickY <= 90) {
        if (Math.hypot(husky.x - 350, husky.y - 100) < 95) {
          openTalentsModal();
        } else {
          showBanner('Mene lähemmäs koulutusdiplomia! 🚶');
        }
      }

      // Fossiilivitriini (x: 180..220, y: 65..95)
      if (interior.kind === 'house' && clickX >= 180 && clickX <= 220 && clickY >= 65 && clickY <= 95) {
        if (Math.hypot(husky.x - 200, husky.y - 110) < 95) {
          openFossilsModal();
        } else {
          showBanner('Mene lähemmäs fossiilivitriiniä! 🚶');
        }
      }

      // Tehtävätaulu (x: 520..565, y: 70..110)
      if (interior.kind === 'house' && clickX >= 520 && clickX <= 565 && clickY >= 70 && clickY <= 110) {
        if (Math.hypot(husky.x - 540, husky.y - 100) < 95) {
          openQuestsModal();
        } else {
          showBanner('Mene lähemmäs tehtävätaulua! 🚶');
        }
      }

      // Takaovi (x: 595..650, y: 55..95)
      if (interior.kind === 'house' && clickX >= 595 && clickX <= 650 && clickY >= 55 && clickY <= 95) {
        if (Math.hypot(husky.x - 620, husky.y - 85) < 95) {
          enterBackyard(interior.struct);
        } else {
          showBanner('Mene lähemmäs takaovea! 🚶');
        }
      }

      // Takapiha klikkaukset
      if (interior.kind === 'backyard') {
        // Pentutarha (380, 110)
        if (clickX >= 280 && clickX <= 480 && clickY >= 40 && clickY <= 170) {
          if (Math.hypot(husky.x - 380, husky.y - 110) < 115) {
            openPuppiesModal();
          } else {
            showBanner('Mene lähemmäs pentutarhaa! 🚶');
          }
        }
        // Nuotio (380, 240)
        if (Math.hypot(clickX - 380, clickY - 240) < 50) {
          if (Math.hypot(husky.x - 380, husky.y - 240) < 95) {
            feedCampfire();
          } else {
            showBanner('Mene lähemmäs nuotiota! 🚶');
          }
        }
        // Teltta (180, 180)
        else if (Math.hypot(clickX - 180, clickY - 180) < 55) {
          if (Math.hypot(husky.x - 180, husky.y - 180) < 95) {
            restInTent();
          } else {
            showBanner('Mene lähemmäs telttaa! 🚶');
          }
        }
        // Kaukoputki (580, 180)
        else if (Math.hypot(clickX - 580, clickY - 180) < 45) {
          if (Math.hypot(husky.x - 580, husky.y - 180) < 95) {
            useTelescope();
          } else {
            showBanner('Mene lähemmäs kaukoputkea! 🚶');
          }
        }
        // Agility-Portti (180, 370)
        else if (Math.hypot(clickX - 180, clickY - 370) < 45) {
          if (Math.hypot(husky.x - 180, husky.y - 370) < 95) {
            startAgilityCourse();
          } else {
            showBanner('Mene lähemmäs Agility-porttia! 🚶');
          }
        }
        // Toivomuskaivo (580, 370)
        else if (Math.hypot(clickX - 580, clickY - 370) < 45) {
          if (Math.hypot(husky.x - 580, husky.y - 370) < 95) {
            openWishingWellModal();
          } else {
            showBanner('Mene lähemmäs toivomuskaivoa! 🚶');
          }
        }
        // Ystävät
        else if (interior.friends) {
          for (const f of interior.friends) {
            if (Math.hypot(clickX - f.x, clickY - f.y) < 35) {
              if (Math.hypot(husky.x - f.x, husky.y - f.y) < 90) {
                interactWithFriend(f);
              } else {
                showBanner(`Mene lähemmäs: ${f.name}! 🚶`);
              }
              break;
            }
          }
        }
      }
    });
  }

  // Gramofonin sulkeminen
  if (gramophoneCloseBtn) {
    gramophoneCloseBtn.addEventListener('click', () => {
      closeGramophone();
    });
  }

  // Kaapin sulkeminen
  if (cabinetCloseBtn) {
    cabinetCloseBtn.addEventListener('click', () => {
      closeCabinet();
    });
  }

  // Mitalitaulun sulkeminen
  if (achievementsCloseBtn) {
    achievementsCloseBtn.addEventListener('click', () => {
      closeAchievementsModal();
    });
  }

  // Keittopadan sulkeminen
  if (cookingCloseBtn) {
    cookingCloseBtn.addEventListener('click', () => {
      closeCookingModal();
    });
  }

  // Volume-säädin
  if (gramophoneVolumeInput) {
    gramophoneVolumeInput.addEventListener('input', (e) => {
      Audio.setMusicVolume(parseFloat(e.target.value));
    });
  }

  // Tehtävävalikon kuuntelijat
  if (questsBtnOpen) {
    questsBtnOpen.addEventListener('click', () => {
      openQuestsModal();
    });
  }
  if (questsCloseBtn) {
    questsCloseBtn.addEventListener('click', () => {
      closeQuestsModal();
    });
  }
  if (questsClaimMasterBtn) {
    questsClaimMasterBtn.addEventListener('click', () => {
      claimMasterQuest();
    });
  }
  if (questsOverlay) {
    questsOverlay.addEventListener('click', (e) => {
      if (e.target === questsOverlay) {
        closeQuestsModal();
      }
    });
  }

  // Toivomuskaivon kuuntelijat
  if (wishingWellCloseBtn) {
    wishingWellCloseBtn.addEventListener('click', closeWishingWellModal);
  }
  if (wellWishBonesBtn) {
    wellWishBonesBtn.addEventListener('click', () => makeWish('bones'));
  }
  if (wellWishGemsBtn) {
    wellWishGemsBtn.addEventListener('click', () => makeWish('gems'));
  }
  if (wishingWellOverlay) {
    wishingWellOverlay.addEventListener('click', (e) => {
      if (e.target === wishingWellOverlay) closeWishingWellModal();
    });
  }

  // Agility-tulosten kuuntelijat
  if (agilityRetryBtn) {
    agilityRetryBtn.addEventListener('click', () => {
      if (agilityFinishOverlay) agilityFinishOverlay.classList.add('hidden');
      startAgilityCourse();
    });
  }
  if (agilityExitBtn) {
    agilityExitBtn.addEventListener('click', exitAgilityToBackyard);
  }
  if (agilityFinishOverlay) {
    agilityFinishOverlay.addEventListener('click', (e) => {
      if (e.target === agilityFinishOverlay) exitAgilityToBackyard();
    });
  }

  // Koulutus / Lahjakkuuspuun kuuntelijat
  if (talentsBtnOpen) {
    talentsBtnOpen.addEventListener('click', openTalentsModal);
  }
  if (talentsCloseBtn) {
    talentsCloseBtn.addEventListener('click', closeTalentsModal);
  }
  if (talentsOverlay) {
    talentsOverlay.addEventListener('click', (e) => {
      if (e.target === talentsOverlay) closeTalentsModal();
    });
  }

  // Fossiilit-kuuntelijat
  if (fossilsBtnOpen) {
    fossilsBtnOpen.addEventListener('click', openFossilsModal);
  }
  if (fossilsCloseBtn) {
    fossilsCloseBtn.addEventListener('click', closeFossilsModal);
  }
  if (fossilsOverlay) {
    fossilsOverlay.addEventListener('click', (e) => {
      if (e.target === fossilsOverlay) closeFossilsModal();
    });
  }

  // Pentutarha-kuuntelijat
  if (puppiesBtnOpen) {
    puppiesBtnOpen.addEventListener('click', openPuppiesModal);
  }
  if (puppiesCloseBtn) {
    puppiesCloseBtn.addEventListener('click', closePuppiesModal);
  }
  if (puppiesOverlay) {
    puppiesOverlay.addEventListener('click', (e) => {
      if (e.target === puppiesOverlay) closePuppiesModal();
    });
  }

  // Näytä tallennetut ennätykset ja saavutukset jo aloitusruudussa
  renderHighScores(false);
  renderAchievements();
  updateMenuHuskyPreview();
  updateMenuBackground();
})();
