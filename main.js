const STORAGE_KEY = "kotoba-pet-prototype-v1";
const MAX_WORD_LENGTH = 6;
const WORDS_PER_BATTLE = 10;

const wordInput = document.getElementById("wordInput");
const message = document.getElementById("message");
const creature = document.getElementById("creature");
const saveStatus = document.getElementById("saveStatus");

const statLabels = {
  attack: "攻撃力",
  defense: "防御力",
  maxHp: "最大HP",
  speed: "すばやさ",
};

const personalityForStat = {
  attack: "aggressive",
  defense: "calm",
  maxHp: "kindness",
  speed: "aggressive",
};

// 登録語ごとに、育成で上がる戦闘ステータスを設定する
const wordEffects = {
  "ばか": { attack: 5 },
  "きらい": { attack: 4 },
  "うざい": { attack: 5 },
  "むかつく": { attack: 7 },
  "いかり": { attack: 6 },
  "けんか": { attack: 5 },
  "つよい": { attack: 6 },
  "ゆうき": { attack: 5 },
  "ちから": { attack: 7 },
  "がんばれ": { attack: 4 },
  "まけない": { attack: 7 },
  "ファイト": { attack: 5 },
  "ガッツ": { attack: 5 },
  "まっすぐ": { attack: 4 },
  "しょうぶ": { attack: 6 },
  "ぜったい": { attack: 5 },
  "いくぞ": { attack: 6 },
  "きあい": { attack: 4 },
  "ほのお": { attack: 6, speed: 2 },
  "かみなり": { attack: 7 },
  "ひっさつ": { attack: 8 },
  "ぜんしん": { attack: 5 },
  "まけるな": { attack: 6 },
  "どりょく": { attack: 4 },
  "かちたい": { attack: 5 },
  "やっつけろ": { attack: 7 },
  "ストライク": { attack: 6 },
  "こうげき": { attack: 5 },
  "ありがとう": { defense: 5, maxHp: 4 },
  "ごめん": { defense: 4 },
  "まもる": { defense: 7 },
  "だいじょうぶ": { defense: 8 },
  "やさしい": { defense: 5 },
  "なかま": { defense: 5 },
  "しんじる": { defense: 6 },
  "あんぜん": { defense: 6 },
  "まかせて": { defense: 4 },
  "へいき": { defense: 4 },
  "おたがい": { defense: 5 },
  "てつだう": { defense: 6 },
  "ゆるす": { defense: 4 },
  "えらい": { defense: 3 },
  "ありがとうね": { defense: 7 },
  "おうえん": { defense: 5, attack: 2 },
  "がっちり": { defense: 6 },
  "かたい": { defense: 5 },
  "たすけて": { defense: 4, maxHp: 3 },
  "まもり": { defense: 5 },
  "あたたかい": { defense: 4, maxHp: 4 },
  "ほめる": { defense: 3, maxHp: 3 },
  "おたすけ": { defense: 5 },
  "ちからもち": { defense: 3, attack: 5 },
  "すき": { maxHp: 4 },
  "だいすき": { maxHp: 7 },
  "ぬくもり": { maxHp: 8 },
  "あんしん": { maxHp: 7 },
  "おやすみ": { maxHp: 6 },
  "ほっと": { maxHp: 4 },
  "いっしょ": { maxHp: 6 },
  "だいじ": { maxHp: 4 },
  "おいしい": { maxHp: 5 },
  "ごはん": { maxHp: 5 },
  "おやつ": { maxHp: 4 },
  "すてき": { maxHp: 4 },
  "にこにこ": { maxHp: 5 },
  "しあわせ": { maxHp: 7 },
  "うれしい": { maxHp: 5 },
  "たのしい": { maxHp: 5 },
  "こころ": { maxHp: 5, defense: 2 },
  "あいしてる": { maxHp: 8 },
  "おかえり": { maxHp: 5 },
  "おいで": { maxHp: 3 },
  "ごほうび": { maxHp: 6 },
  "いいこ": { maxHp: 4 },
  "またね": { maxHp: 3 },
  "だいすきだ": { maxHp: 7 },
  "あいことば": { maxHp: 5, defense: 2 },
  "はやい": { speed: 5 },
  "にげろ": { speed: 5 },
  "ぴょん": { speed: 4 },
  "かける": { speed: 5 },
  "すばやい": { speed: 7 },
  "だっしゅ": { speed: 6 },
  "はしる": { speed: 5 },
  "とべ": { speed: 4 },
  "すいすい": { speed: 5 },
  "とんでけ": { speed: 5 },
  "さっと": { speed: 4 },
  "かぜ": { speed: 4 },
  "きらきら": { speed: 4 },
  "ちょこまか": { speed: 6 },
  "おどる": { speed: 4 },
  "ダッシュ": { speed: 6 },
  "ひらり": { speed: 5 },
  "てくてく": { speed: 4 },
  "ぬきあし": { speed: 6 },
  "かけっこ": { speed: 5 },
  "スキップ": { speed: 5 },
  "ジャンプ": { speed: 6 },
  "ステップ": { speed: 5 },
  "かるい": { speed: 4 },
  "しゅっと": { speed: 5 },
  "ねむい": { maxHp: 3, defense: 2 },
  "ゆっくり": { defense: 3, maxHp: 2 },
  "しずか": { defense: 4 },
  "おちつけ": { defense: 5 },
  "のんびり": { maxHp: 4, defense: 2 },
  "すやすや": { maxHp: 5 },
  "おだやか": { defense: 4, maxHp: 2 },
};

const traitSettings = {
  aggressive: {
    label: "ちょっぴり強気",
    color: "#e78568",
    replies: ["わっ、力がわいてきた！", "今日はなんだか負けない気分！", "きみの言葉、まっすぐ届いたよ。"],
  },
  kindness: {
    label: "とってもやさしい",
    color: "#e99b9a",
    replies: ["きみのこと、だいすき！", "こころがぽかぽかするね。", "その言葉、だれかにも届けたいな。"],
  },
  calm: {
    label: "おだやかでマイペース",
    color: "#8ab9a4",
    replies: ["ふう、こころが落ち着くね。", "ゆっくり一緒にすごそう。", "静かな時間っていいなあ。"],
  },
  balanced: {
    label: "まだ知らないことばだらけ",
    color: "#e8a7a5",
    replies: ["きみの言葉、ちゃんと受け取ったよ。", "次はどんな言葉に出会えるかな？", "こころに小さな色がついたみたい。"],
  },
};

const allowedBodies = ["round", "reptile", "horned"];
const allowedParts = ["tuft", "leaf", "horn", "fin", "floppy", "antenna"];
const allowedEyes = ["round", "sleepy", "sparkle"];
const allowedMarkings = ["none", "spots", "stripes"];
const allowedColors = ["#e8a7a5", "#86b79d", "#e9c46b", "#84a9c5", "#ba9bca", "#e68c60"];

const directionSettings = {
  ArrowUp: { label: "上", symbol: "↑" },
  ArrowDown: { label: "下", symbol: "↓" },
  ArrowLeft: { label: "左", symbol: "←" },
  ArrowRight: { label: "右", symbol: "→" },
};

const cpuCharacters = [
  { name: "ぺたろう", bodyType: "reptile", part: "horn", color: "#83b99e", trait: "calm" },
  { name: "もこまる", bodyType: "round", part: "tuft", color: "#e8a7a5", trait: "kindness" },
  { name: "つのすけ", bodyType: "horned", part: "horn", color: "#e8bf68", trait: "aggressive" },
  { name: "はっぱ", bodyType: "round", part: "leaf", color: "#86b79d", trait: "calm" },
  { name: "ソラノ", bodyType: "reptile", part: "leaf", color: "#84a9c5", trait: "kindness" },
];

function createInitialState() {
  return {
    petName: "ことばのこ",
    appearance: null,
    personality: { aggressive: 0, kindness: 0, calm: 0 },
    stats: { attack: 10, defense: 5, maxHp: 60, speed: 8 },
    feedCount: 0,
    nextBattleAt: WORDS_PER_BATTLE,
    battle: null,
    battleWins: 0,
    history: [],
    message: "どんな言葉が好きかな？",
  };
}

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!savedState || typeof savedState !== "object") {
      return createInitialState();
    }

    const savedPersonality = savedState.personality || {};
    const savedStats = savedState.stats || {};
    const feedCount = Number.isFinite(savedState.feedCount) ? Math.max(0, savedState.feedCount) : 0;
    const savedBattlePhases = ["intro", "enemyTelegraph", "wrongDodge", "dodge", "enemyStrike", "playerOpportunity", "playerAttack", "recovery", "finished"];
    const savedBattle = savedState.battle
      && typeof savedState.battle === "object"
      && savedBattlePhases.includes(savedState.battle.phase)
      ? savedState.battle
      : null;
    const savedAppearance = savedState.appearance;
    const appearanceIsValid = savedAppearance
      && allowedBodies.includes(savedAppearance.bodyType)
      && allowedParts.includes(savedAppearance.part)
      && allowedColors.includes(savedAppearance.color);

    return {
      petName: typeof savedState.petName === "string" ? savedState.petName : "ことばのこ",
      appearance: appearanceIsValid
        ? {
          ...savedAppearance,
          eyes: allowedEyes.includes(savedAppearance.eyes) ? savedAppearance.eyes : "round",
          marking: allowedMarkings.includes(savedAppearance.marking) ? savedAppearance.marking : "none",
        }
        : null,
      personality: {
        aggressive: Number.isFinite(savedPersonality.aggressive) ? Math.max(0, savedPersonality.aggressive) : 0,
        kindness: Number.isFinite(savedPersonality.kindness) ? Math.max(0, savedPersonality.kindness) : 0,
        calm: Number.isFinite(savedPersonality.calm) ? Math.max(0, savedPersonality.calm) : 0,
      },
      stats: {
        attack: Number.isFinite(savedStats.attack) ? Math.max(1, savedStats.attack) : 10,
        defense: Number.isFinite(savedStats.defense) ? Math.max(0, savedStats.defense) : 5,
        maxHp: Number.isFinite(savedStats.maxHp) ? Math.max(1, savedStats.maxHp) : 60,
        speed: Number.isFinite(savedStats.speed) ? Math.max(1, savedStats.speed) : 8,
      },
      feedCount,
      nextBattleAt: savedBattle && Number.isFinite(savedState.nextBattleAt)
        ? savedState.nextBattleAt
        : (Number.isFinite(savedState.nextBattleAt) && savedState.nextBattleAt > feedCount
          ? savedState.nextBattleAt
          : (Math.floor(feedCount / WORDS_PER_BATTLE) + 1) * WORDS_PER_BATTLE),
      battle: savedBattle,
      battleWins: Number.isFinite(savedState.battleWins) ? Math.max(0, savedState.battleWins) : 0,
      history: Array.isArray(savedState.history) ? savedState.history.slice(0, 8) : [],
      message: typeof savedState.message === "string" ? savedState.message : "どんな言葉が好きかな？",
    };
  } catch (error) {
    return createInitialState();
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveStatus.textContent = "この端末に保存済み";
  } catch (error) {
    saveStatus.textContent = "保存できませんでした";
  }
}

function getWordEffect(word) {
  if (Object.hasOwn(wordEffects, word)) {
    return { effect: wordEffects[word], isKnown: true };
  }

  // 未登録の言葉は文字コードから上がるステータスを決める
  const codeTotal = Array.from(word).reduce((total, character) => {
    return total + character.codePointAt(0);
  }, 0);
  const stats = ["attack", "defense", "maxHp", "speed"];
  const selectedStat = stats[codeTotal % stats.length];

  return { effect: { [selectedStat]: 2 + (codeTotal % 4) }, isKnown: false };
}

function getDominantTrait() {
  const rankedTraits = Object.keys(state.personality).sort((traitA, traitB) => {
    return state.personality[traitB] - state.personality[traitA];
  });
  const topScore = state.personality[rankedTraits[0]];
  const secondScore = state.personality[rankedTraits[1]];

  if (topScore - secondScore < 2) {
    return "balanced";
  }
  return rankedTraits[0];
}

function getReaction(trait) {
  const replies = traitSettings[trait].replies;
  return replies[state.feedCount % replies.length];
}

function createFeedMessage(word, effect, isKnown) {
  const changes = Object.entries(effect).map(([stat, amount]) => {
    return `${statLabels[stat]}が${amount}あがった`;
  });
  const dominantTrait = getDominantTrait();
  const interpretation = isKnown ? `「${word}」から` : `「${word}」をぼくなりに受け取って`;

  return `${interpretation}${changes.join("、")}！ ${getReaction(dominantTrait)}`;
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  const emptyHistory = document.getElementById("emptyHistory");
  const historyCount = document.getElementById("historyCount");
  historyList.replaceChildren();
  emptyHistory.hidden = state.history.length > 0;
  historyCount.textContent = String(state.feedCount);

  for (const entry of state.history) {
    const item = document.createElement("li");
    item.className = "history-item";

    const word = document.createElement("strong");
    word.className = "history-word";
    word.textContent = `「${entry.word}」`;

    const meaning = document.createElement("span");
    meaning.className = "history-meaning";
    meaning.textContent = entry.statSummary || traitSettings[entry.trait]?.label || traitSettings.balanced.label;

    const time = document.createElement("time");
    time.className = "history-time";
    time.textContent = entry.time;

    item.dataset.trait = entry.trait;
    item.append(word, meaning, time);
    historyList.append(item);
  }
}

function getCreatureAppearance() {
  return state.appearance || {
    bodyType: "round",
    part: "tuft",
    color: "#e8a7a5",
    eyes: "round",
    marking: "none",
  };
}

function setCreatureLook(target, appearance, trait) {
  target.dataset.body = appearance.bodyType;
  target.dataset.part = appearance.part;
  target.dataset.eyes = appearance.eyes || "round";
  target.dataset.marking = appearance.marking || "none";
  target.dataset.trait = trait;
  target.style.setProperty("--creature-color", appearance.color);
  if (trait !== "balanced") {
    target.style.setProperty("--creature-accent", traitSettings[trait].color);
  } else {
    target.style.removeProperty("--creature-accent");
  }
}

function createBattleCreature(appearance, trait) {
  const battleCreature = creature.cloneNode(true);
  battleCreature.removeAttribute("id");
  battleCreature.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  battleCreature.classList.add("battle-creature");
  setCreatureLook(battleCreature, appearance, trait);
  return battleCreature;
}

function renderBattle() {
  const battle = state.battle;
  const battleOverlay = document.getElementById("battleOverlay");
  battleOverlay.hidden = !battle;
  document.getElementById("creationOverlay").hidden = Boolean(state.appearance);

  const isBattling = Boolean(battle);
  document.getElementById("feedForm").querySelectorAll("input, button").forEach((control) => {
    control.disabled = isBattling || !state.appearance;
  });
  document.querySelectorAll("[data-word]").forEach((button) => {
    button.disabled = isBattling || !state.appearance;
  });
  if (!battle) {
    stopBattleClock();
    return;
  }

  const phase = battle.phase;
  document.getElementById("battlePlayerName").textContent = state.petName;
  document.getElementById("battleCpuName").textContent = battle.opponent.name;
  document.getElementById("battleRound").textContent = `ROUND ${battle.round}`;
  document.getElementById("battleLog").textContent = battle.log;
  document.getElementById("battlePlayerFighter").dataset.phase = phase;
  document.querySelector(".cpu-fighter").dataset.phase = phase;
  document.getElementById("battlePlayerHealthText").textContent = `${battle.playerHp} / ${battle.playerMaxHp} HP`;
  document.getElementById("battleCpuHealthText").textContent = `${battle.opponent.hp} / ${battle.opponent.maxHp} HP`;
  document.getElementById("battlePlayerHealth").style.width = `${battle.playerHp / battle.playerMaxHp * 100}%`;
  document.getElementById("battleCpuHealth").style.width = `${battle.opponent.hp / battle.opponent.maxHp * 100}%`;
  document.getElementById("battleControls").hidden = battle.finished;
  document.getElementById("dodgeControls").hidden = phase !== "enemyTelegraph";
  document.getElementById("actionButton").hidden = phase !== "playerOpportunity";
  const enemyCue = document.getElementById("enemyCue");
  const attackDirection = directionSettings[battle.attackDirection];
  enemyCue.textContent = attackDirection?.symbol || "!";
  enemyCue.dataset.direction = battle.attackDirection || "";
  enemyCue.hidden = !["enemyTelegraph", "wrongDodge", "enemyStrike"].includes(phase);
  const dodgeEffect = document.getElementById("dodgeEffect");
  dodgeEffect.hidden = phase !== "dodge";
  document.getElementById("comboValue").textContent = String(battle.combo || 0);
  document.getElementById("comboMeter").style.width = `${Math.min((battle.combo || 0) * 20, 100)}%`;
  document.getElementById("battleResult").hidden = !battle.finished;
  document.getElementById("battleResultTitle").textContent = battle.result === "win"
    ? `${battle.opponent.name}に勝った！` : `${battle.opponent.name}に負けちゃった…`;

  document.getElementById("battleCountdown").textContent = getBattlePrompt(phase);

  const playerLook = getCreatureAppearance();
  document.getElementById("battlePlayerCreature").replaceChildren(
    createBattleCreature(playerLook, getDominantTrait()),
    dodgeEffect,
  );
  document.getElementById("battleCpuCreature").replaceChildren(
    createBattleCreature(battle.opponent.appearance, battle.opponent.trait),
    document.getElementById("enemyCue"),
  );

  if (battle.finished) {
    stopBattleClock();
  } else {
    startBattleClock();
  }
}

function render() {
  const dominantTrait = getDominantTrait();
  const settings = traitSettings[dominantTrait];
  const appearance = getCreatureAppearance();
  const level = Math.floor(state.feedCount / 3) + 1;
  const cycleStart = state.nextBattleAt - WORDS_PER_BATTLE;
  const battleProgress = Math.max(0, Math.min(WORDS_PER_BATTLE, state.feedCount - cycleStart));
  const growthProgress = (state.feedCount % 3) / 3 * 100;

  document.getElementById("petName").textContent = state.petName;
  document.getElementById("personalityLabel").textContent = settings.label;
  message.textContent = state.message;
  document.getElementById("levelValue").textContent = String(level);
  document.getElementById("growthText").textContent = `あと${3 - state.feedCount % 3}こでレベルアップ`;
  document.getElementById("growthMeter").style.width = `${growthProgress}%`;
  document.getElementById("battleProgressText").textContent = `${battleProgress} / ${WORDS_PER_BATTLE}`;
  document.getElementById("battleProgressBar").style.width = `${battleProgress / WORDS_PER_BATTLE * 100}%`;
  setCreatureLook(creature, appearance, dominantTrait);

  document.getElementById("attackValue").textContent = String(state.stats.attack);
  document.getElementById("defenseValue").textContent = String(state.stats.defense);
  document.getElementById("maxHpValue").textContent = String(state.stats.maxHp);
  document.getElementById("speedValue").textContent = String(state.stats.speed);

  for (const trait of ["kindness", "calm", "aggressive"]) {
    const score = state.personality[trait];
    document.getElementById(`${trait}Value`).textContent = String(score);
    document.getElementById(`${trait}Meter`).style.width = `${Math.min(score * 16, 100)}%`;
  }

  renderHistory();
  renderBattle();
}

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function createBattle() {
  const cpu = cpuCharacters[randomInteger(0, cpuCharacters.length - 1)];
  const cpuLevel = Math.max(1, Math.floor((state.feedCount - 1) / WORDS_PER_BATTLE) + 1);
  const playerMaxHp = state.stats.maxHp;
  const cpuMaxHp = Math.max(42, Math.round(playerMaxHp * 0.82) + randomInteger(2, 12));

  return {
    opponent: {
      ...cpu,
      appearance: { bodyType: cpu.bodyType, part: cpu.part, color: cpu.color },
      maxHp: cpuMaxHp,
      hp: cpuMaxHp,
      attack: 7 + cpuLevel * 2 + randomInteger(0, 3),
      defense: 4 + cpuLevel + randomInteger(0, 2),
    },
    playerMaxHp,
    playerHp: playerMaxHp,
    round: 1,
    phase: "intro",
    phaseEndsAt: Date.now() + 1000,
    attackDirection: null,
    dodgeDirection: null,
    combo: 0,
    pendingDamage: 0,
    finished: false,
    result: null,
    log: `${cpu.name}があらわれた！ 10この言葉で育った力を見せよう。`,
  };
}

function feedCreature(word) {
  const { effect, isKnown } = getWordEffect(word);
  for (const [stat, amount] of Object.entries(effect)) {
    state.stats[stat] += amount;
    state.personality[personalityForStat[stat]] += amount;
  }
  state.feedCount += 1;
  state.message = createFeedMessage(word, effect, isKnown);
  state.history.unshift({
    word,
    trait: getDominantTrait(),
    statSummary: Object.entries(effect).map(([stat, amount]) => `${statLabels[stat]} +${amount}`).join(" / "),
    time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
  });
  state.history = state.history.slice(0, 8);

  if (state.feedCount >= state.nextBattleAt) {
    state.battle = createBattle();
    state.message = `${state.message} 10この言葉が集まった！たいせんだ！`;
  }

  render();
  saveState();
}

let battleClock = null;

function getBattlePrompt(phase) {
  if (phase === "intro") return "たいせん開始！";
  if (phase === "enemyTelegraph") return "同じ矢印キーで回避";
  if (phase === "wrongDodge") return "矢印がちがう！";
  if (phase === "dodge") return "回避成功！";
  if (phase === "enemyStrike") return "敵の攻撃！";
  if (phase === "playerOpportunity") return "チャンス！スペースで攻撃";
  if (phase === "playerAttack") return "攻撃！";
  if (phase === "recovery") return "攻撃が当たった！";
  return "たいせん終了";
}

function startBattleClock() {
  if (!battleClock && state.battle && !state.battle.finished) {
    battleClock = window.setInterval(updateBattleClock, 60);
  }
}

function stopBattleClock() {
  if (battleClock) {
    window.clearInterval(battleClock);
    battleClock = null;
  }
}

function startEnemyTelegraph() {
  const battle = state.battle;
  if (!battle || battle.finished) return;

  battle.phase = "enemyTelegraph";
  battle.attackDirection = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"][randomInteger(0, 3)];
  battle.telegraphStartedAt = Date.now();
  battle.phaseEndsAt = Date.now() + Math.min(3800, 2800 + state.stats.speed * 14);
  battle.log = `${battle.opponent.name}の頭上を見て！同じ矢印へよけよう！`;
  renderBattle();
  saveState();
}

function openPlayerOpportunity(log) {
  const battle = state.battle;
  battle.phase = "playerOpportunity";
  battle.phaseEndsAt = Date.now() + 2200;
  battle.log = log;
  renderBattle();
  saveState();
}

function finishBattle(result, log) {
  const battle = state.battle;
  battle.finished = true;
  battle.phase = "finished";
  battle.result = result;
  battle.log = log;
  if (result === "win") {
    state.battleWins += 1;
  }
  renderBattle();
  saveState();
}

function updateBattleClock() {
  const battle = state.battle;
  if (!battle || battle.finished) {
    stopBattleClock();
    return;
  }

  const remaining = Math.max(0, battle.phaseEndsAt - Date.now());
  const secondsLeft = (remaining / 1000).toFixed(1);
  if (battle.phase === "enemyTelegraph" || battle.phase === "playerOpportunity") {
    document.getElementById("battleCountdown").textContent = `${getBattlePrompt(battle.phase)} ${secondsLeft}`;
  }

  if (remaining > 0) return;

  if (battle.phase === "intro") {
    startEnemyTelegraph();
  } else if (battle.phase === "enemyTelegraph") {
    battle.phase = "enemyStrike";
    battle.phaseEndsAt = Date.now() + 420;
    battle.log = `${directionSettings[battle.attackDirection].label}方向から攻撃！`;
    renderBattle();
    saveState();
  } else if (battle.phase === "wrongDodge") {
    battle.phase = "enemyStrike";
    battle.phaseEndsAt = Date.now() + 420;
    battle.log = `${directionSettings[battle.attackDirection].label}方向から攻撃！`;
    renderBattle();
    saveState();
  } else if (battle.phase === "dodge") {
    const comboText = battle.combo > 0 ? ` コンボ${battle.combo}！` : "";
    openPlayerOpportunity(`${state.petName}は${battle.dodgeDirection}によけた！${comboText}敵にスキができた！`);
  } else if (battle.phase === "enemyStrike") {
    const damage = Math.max(1, battle.opponent.attack + randomInteger(0, 4) - state.stats.defense);
    battle.playerHp = Math.max(0, battle.playerHp - damage);
    if (battle.playerHp === 0) {
      finishBattle("lose", `${battle.opponent.name}の攻撃！ ${damage}ダメージ…たおれてしまった。`);
    } else {
      openPlayerOpportunity(`${battle.opponent.name}の攻撃！ ${damage}ダメージ。敵に！ スペースキーで反撃！`);
    }
  } else if (battle.phase === "playerOpportunity") {
    battle.combo = 0;
    startEnemyTelegraph();
  } else if (battle.phase === "playerAttack") {
    battle.opponent.hp = Math.max(0, battle.opponent.hp - battle.pendingDamage);
    if (battle.opponent.hp === 0) {
      finishBattle("win", `${battle.log}\n${battle.opponent.name}をたおした！`);
    } else {
      battle.phase = "recovery";
      battle.phaseEndsAt = Date.now() + 520;
      battle.round += 1;
      renderBattle();
      saveState();
    }
  } else if (battle.phase === "recovery") {
    startEnemyTelegraph();
  }
}

function dodge(direction) {
  const battle = state.battle;
  if (!battle || battle.finished || battle.phase !== "enemyTelegraph") return;

  if (direction !== battle.attackDirection) {
    battle.phase = "wrongDodge";
    battle.phaseEndsAt = Date.now() + 300;
    battle.log = `矢印がちがう！${directionSettings[battle.attackDirection].label}へよけて！`;
    renderBattle();
    saveState();
    return;
  }

  const reactionTime = Date.now() - battle.telegraphStartedAt;
  battle.combo = reactionTime <= 1100 ? Math.min(5, (battle.combo || 0) + 1) : 0;
  battle.phase = "dodge";
  battle.phaseEndsAt = Date.now() + 500;
  battle.dodgeDirection = directionSettings[direction].label;
  renderBattle();
  saveState();
}

function attackDuringOpening() {
  const battle = state.battle;
  if (!battle || battle.finished || battle.phase !== "playerOpportunity") return;

  const criticalChance = Math.min(0.3, 0.05 + state.stats.speed / 100);
  const isCritical = Math.random() < criticalChance;
  const comboBonus = (battle.combo || 0) * Math.max(1, Math.floor(state.stats.attack * 0.2));
  const baseDamage = Math.max(1, state.stats.attack + comboBonus + randomInteger(0, 4) - battle.opponent.defense);
  const damage = isCritical ? baseDamage * 2 : baseDamage;
  battle.pendingDamage = damage;
  battle.combo = 0;

  const attackMessage = isCritical
    ? `クリティカル！${comboBonus ? ` コンボ+${comboBonus}！` : ""} ${damage}ダメージ！`
    : `${comboBonus ? `コンボ+${comboBonus}！ ` : ""}${damage}ダメージ！`;

  battle.phase = "playerAttack";
  battle.phaseEndsAt = Date.now() + 340;
  battle.log = `${state.petName}が踏み込んだ！ ${attackMessage}`;
  renderBattle();
  saveState();
}

document.getElementById("appearanceForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  state.appearance = {
    bodyType: formData.get("bodyType"),
    color: formData.get("color"),
    part: formData.get("part"),
    eyes: formData.get("eyes"),
    marking: formData.get("marking"),
  };
  state.message = "よろしくね！どんな言葉をくれるの？";
  render();
  saveState();
  wordInput.focus();
});

document.getElementById("feedForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const word = Array.from(wordInput.value.trim()).slice(0, MAX_WORD_LENGTH).join("");

  if (!word) {
    state.message = "ひとこと入力してね。";
    render();
    wordInput.focus();
    return;
  }

  feedCreature(word);
  wordInput.value = "";
  document.getElementById("characterCount").textContent = `0 / ${MAX_WORD_LENGTH}`;
  if (!state.battle) {
    wordInput.focus();
  }
});

wordInput.addEventListener("input", () => {
  const characterCount = Array.from(wordInput.value).length;
  document.getElementById("characterCount").textContent = `${characterCount} / ${MAX_WORD_LENGTH}`;
});

document.querySelectorAll("[data-word]").forEach((button) => {
  button.addEventListener("click", () => {
    wordInput.value = button.dataset.word;
    wordInput.dispatchEvent(new Event("input"));
    wordInput.focus();
  });
});

document.getElementById("nameForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("nameInput");
  const newName = nameInput.value.trim();
  if (!newName) {
    nameInput.focus();
    return;
  }

  state.petName = Array.from(newName).slice(0, 12).join("");
  state.message = `${state.petName}って、すてきな名前！`;
  nameInput.value = "";
  render();
  saveState();
});

document.querySelectorAll("[data-dodge]").forEach((button) => {
  button.addEventListener("click", () => dodge(button.dataset.dodge));
});

document.getElementById("actionButton").addEventListener("click", attackDuringOpening);

document.addEventListener("keydown", (event) => {
  if (!state.battle || state.battle.finished || event.repeat) return;
  if (event.target instanceof HTMLElement && event.target.matches("input, textarea, select")) return;

  if (event.code === "Space" && state.battle.phase === "playerOpportunity") {
    event.preventDefault();
    attackDuringOpening();
    return;
  }

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
    && state.battle.phase === "enemyTelegraph") {
    event.preventDefault();
    dodge(event.code);
  }
});

document.getElementById("continueButton").addEventListener("click", () => {
  state.nextBattleAt = state.feedCount + WORDS_PER_BATTLE;
  state.message = "つぎのたいせんまで、また言葉を集めよう。";
  state.battle = null;
  render();
  saveState();
  wordInput.focus();
});

document.getElementById("resetButton").addEventListener("click", () => {
  const shouldReset = window.confirm("名前や見た目、ことばの記録もすべて消して最初から育てますか？");
  if (!shouldReset) {
    return;
  }

  state = createInitialState();
  wordInput.value = "";
  document.getElementById("characterCount").textContent = `0 / ${MAX_WORD_LENGTH}`;
  render();
  saveState();
});

render();