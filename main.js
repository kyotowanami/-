const STORAGE_KEY = "kotoba-pet-prototype-v1";

const wordInput = document.getElementById("wordInput");
const message = document.getElementById("message");
const creature = document.getElementById("creature");
const saveStatus = document.getElementById("saveStatus");

// 登録した言葉は、性格ごとの数値をそのまま足す
const wordEffects = {
  "ばか": { aggressive: 2 },
  "きらい": { aggressive: 2 },
  "うざい": { aggressive: 2 },
  "むかつく": { aggressive: 3 },
  "ありがと": { kindness: 3 },
  "ごめん": { kindness: 2 },
  "すき": { kindness: 2 },
  "だいすき": { kindness: 3 },
  "えらい": { kindness: 2 },
  "ねむい": { calm: 2 },
  "おやすみ": { calm: 2 },
  "ゆっくり": { calm: 2 },
  "しずか": { calm: 2 },
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

function createInitialState() {
  return {
    petName: "ことばのこ",
    personality: { aggressive: 0, kindness: 0, calm: 0 },
    feedCount: 0,
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
    return {
      petName: typeof savedState.petName === "string" ? savedState.petName : "ことばのこ",
      personality: {
        aggressive: Number.isFinite(savedPersonality.aggressive) ? Math.max(0, savedPersonality.aggressive) : 0,
        kindness: Number.isFinite(savedPersonality.kindness) ? Math.max(0, savedPersonality.kindness) : 0,
        calm: Number.isFinite(savedPersonality.calm) ? Math.max(0, savedPersonality.calm) : 0,
      },
      feedCount: Number.isFinite(savedState.feedCount) ? Math.max(0, savedState.feedCount) : 0,
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

  // 未登録の言葉は文字コードの合計から、性格をひとつ選ぶ
  const codeTotal = Array.from(word).reduce((total, character) => {
    return total + character.codePointAt(0);
  }, 0);
  const traits = ["aggressive", "kindness", "calm"];
  const selectedTrait = traits[codeTotal % traits.length];

  return { effect: { [selectedTrait]: 1 }, isKnown: false };
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

function createFeedMessage(word, trait, isKnown) {
  const traitLabel = traitSettings[trait].label;
  const reaction = getReaction(trait);

  if (isKnown) {
    return `「${word}」から「${traitLabel}」を感じたよ。${reaction}`;
  }
  return `「${word}」をぼくなりに受け取ったよ。${traitLabel}な気分！${reaction}`;
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
    meaning.textContent = traitSettings[entry.trait]?.label || traitSettings.balanced.label;

    const time = document.createElement("time");
    time.className = "history-time";
    time.textContent = entry.time;

    item.dataset.trait = entry.trait;
    item.append(word, meaning, time);
    historyList.append(item);
  }
}

function render() {
  const dominantTrait = getDominantTrait();
  const settings = traitSettings[dominantTrait];
  const level = Math.floor(state.feedCount / 3) + 1;
  const progress = (state.feedCount % 3) / 3 * 100;

  document.getElementById("petName").textContent = state.petName;
  document.getElementById("personalityLabel").textContent = settings.label;
  document.getElementById("message").textContent = state.message;
  document.getElementById("levelValue").textContent = String(level);
  document.getElementById("growthText").textContent = `あと${3 - state.feedCount % 3}こでレベルアップ`;
  document.getElementById("growthMeter").style.width = `${progress}%`;
  creature.dataset.trait = dominantTrait;
  creature.style.setProperty("--creature-color", settings.color);

  for (const trait of ["kindness", "calm", "aggressive"]) {
    const score = state.personality[trait];
    document.getElementById(`${trait}Value`).textContent = String(score);
    document.getElementById(`${trait}Meter`).style.width = `${Math.min(score * 16, 100)}%`;
  }

  renderHistory();
}

function feedCreature(word) {
  const { effect, isKnown } = getWordEffect(word);
  const affectedTrait = Object.keys(effect)[0];
  state.personality[affectedTrait] += effect[affectedTrait];
  state.feedCount += 1;
  state.message = createFeedMessage(word, affectedTrait, isKnown);
  state.history.unshift({
    word,
    trait: affectedTrait,
    time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
  });
  state.history = state.history.slice(0, 8);

  render();
  saveState();
}

document.getElementById("feedForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const word = Array.from(wordInput.value.trim()).slice(0, 5).join("");

  if (!word) {
    state.message = "ひとこと入力してね。";
    render();
    wordInput.focus();
    return;
  }

  feedCreature(word);
  wordInput.value = "";
  document.getElementById("characterCount").textContent = "0 / 5";
  wordInput.focus();
});

wordInput.addEventListener("input", () => {
  const characterCount = Array.from(wordInput.value).length;
  document.getElementById("characterCount").textContent = `${characterCount} / 5`;
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

document.getElementById("resetButton").addEventListener("click", () => {
  const shouldReset = window.confirm("名前やことばの記録も、すべて消して最初から育てますか？");
  if (!shouldReset) {
    return;
  }

  state = createInitialState();
  wordInput.value = "";
  document.getElementById("characterCount").textContent = "0 / 5";
  render();
  saveState();
});

render();