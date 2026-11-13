const scenarios = [
  {
    away: { code: "DAL", name: "Cowboys", score: 13 },
    home: { code: "PHI", name: "Eagles", score: 17 },
    period: "3rd quarter",
    clock: "6:42",
    player: "A.J. Brown",
    stats: [
      ["Receptions", "4"],
      ["Targets", "7"],
      ["Rec. yards", "68"],
    ],
    line: "Over 6.5 receptions",
    probability: 54,
    insight: "Brown needed three more catches with more than a quarter left, but Philadelphia held a narrow lead and could lean on the run.",
  },
  {
    away: { code: "BUF", name: "Bills", score: 24 },
    home: { code: "KC", name: "Chiefs", score: 20 },
    period: "4th quarter",
    clock: "8:19",
    player: "Patrick Mahomes",
    stats: [
      ["Pass yards", "238"],
      ["Attempts", "31"],
      ["Yards needed", "38"],
    ],
    line: "Over 275.5 passing yards",
    probability: 72,
    insight: "Kansas City was trailing late, making another pass-heavy possession likely. Only 38 yards separated Mahomes from the over.",
  },
  {
    away: { code: "CIN", name: "Bengals", score: 14 },
    home: { code: "BAL", name: "Ravens", score: 17 },
    period: "2nd quarter",
    clock: "1:48",
    player: "Ja'Marr Chase",
    stats: [
      ["Receptions", "5"],
      ["Targets", "6"],
      ["Rec. yards", "71"],
    ],
    line: "Over 89.5 receiving yards",
    probability: 63,
    insight: "Chase was already within 19 yards of the line before halftime, although his early efficiency was difficult to sustain.",
  },
  {
    away: { code: "SF", name: "49ers", score: 21 },
    home: { code: "DET", name: "Lions", score: 24 },
    period: "3rd quarter",
    clock: "11:02",
    player: "Christian McCaffrey",
    stats: [
      ["Touchdowns", "1"],
      ["Red-zone touches", "3"],
      ["Team deficit", "3"],
    ],
    line: "Over 1.5 total touchdowns",
    probability: 38,
    insight: "One more touchdown would cash the over, but any single player scoring again remained less likely than not—even in a close game.",
  },
  {
    away: { code: "MIA", name: "Dolphins", score: 20 },
    home: { code: "NYJ", name: "Jets", score: 16 },
    period: "4th quarter",
    clock: "12:31",
    player: "Tyreek Hill",
    stats: [
      ["Receptions", "4"],
      ["Targets", "8"],
      ["Catches needed", "4"],
    ],
    line: "Over 7.5 receptions",
    probability: 29,
    insight: "Hill still needed four catches, and Miami could protect a lead. His target share kept the over alive, but the clock worked against it.",
  },
  {
    away: { code: "GB", name: "Packers", score: 17 },
    home: { code: "CHI", name: "Bears", score: 10 },
    period: "Halftime",
    clock: "15:00",
    player: "Jordan Love",
    stats: [
      ["Pass TDs", "2"],
      ["Completions", "13"],
      ["Team lead", "7"],
    ],
    line: "Over 2.5 passing touchdowns",
    probability: 44,
    insight: "Love needed only one more touchdown, but Green Bay's lead reduced the urgency to throw throughout the second half.",
  },
  {
    away: { code: "LAR", name: "Rams", score: 23 },
    home: { code: "SEA", name: "Seahawks", score: 27 },
    period: "4th quarter",
    clock: "3:17",
    player: "Puka Nacua",
    stats: [
      ["Rec. yards", "103"],
      ["Targets", "12"],
      ["Yards needed", "7"],
    ],
    line: "Over 109.5 receiving yards",
    probability: 81,
    insight: "Los Angeles needed a late scoring drive, Nacua was the primary target, and seven more yards would clear the line.",
  },
];

const storageKey = "oddillion-demo-001";
const app = document.querySelector("#app");
const restartButton = document.querySelector("#restartButton");

let state = loadState();

function freshState() {
  return {
    screen: "intro",
    current: 0,
    selected: 50,
    revealed: false,
    answers: [],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && Array.isArray(saved.answers) ? saved : freshState();
  } catch {
    return freshState();
  }
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function scoreGuess(guess, actual) {
  return Math.max(0, 100 - Math.abs(guess - actual) * 4);
}

function totalScore() {
  return state.answers.reduce((sum, answer) => sum + answer.points, 0);
}

function render() {
  if (state.screen === "intro") renderIntro();
  else if (state.screen === "results") renderResults();
  else renderGame();
}

function renderIntro() {
  const hasProgress = state.answers.length > 0;
  app.innerHTML = `
    <section class="intro-screen">
      <p class="eyebrow">A daily game of market intuition</p>
      <h1>READ THE MOMENT.<br><span class="highlight">CALL THE ODDS.</span></h1>
      <p class="intro-copy">
        You get seven frozen moments from the middle of a game. Study the score, clock,
        and player stats—then guess what probability the market assigned to the prop.
      </p>
      <button class="primary-button" id="startButton" type="button">
        ${hasProgress ? `CONTINUE ROUND ${state.current + 1}` : "PLAY TODAY'S 7 →"}
      </button>
      <div class="intro-stats" aria-label="Game facts">
        <div class="intro-stat"><strong>07</strong><span>historical moments</span></div>
        <div class="intro-stat"><strong>700</strong><span>maximum points</span></div>
        <div class="intro-stat"><strong>±1%</strong><span>elite market read</span></div>
      </div>
    </section>
  `;

  document.querySelector("#startButton").addEventListener("click", () => {
    state.screen = "game";
    persist();
    render();
  });
}

function renderGame() {
  const scenario = scenarios[state.current];
  const currentScore = totalScore();
  const segments = scenarios
    .map((_, index) => {
      const status = index < state.current ? "done" : index === state.current ? "active" : "";
      return `<span class="progress-segment ${status}"></span>`;
    })
    .join("");

  app.innerHTML = `
    <section class="game-shell">
      <div class="game-topline">
        <span class="progress-label">Moment ${state.current + 1} of ${scenarios.length}</span>
        <span class="score-label">Score <strong>${currentScore}</strong></span>
      </div>
      <div class="progress-track" aria-hidden="true">${segments}</div>

      <article class="scenario-card">
        <div class="scenario-status">
          <span>${scenario.period} · ${scenario.clock}</span>
          <span class="moment">historical snapshot</span>
        </div>
        <div class="scoreboard">
          <div class="team">
            <span class="team-code">${scenario.away.code}</span>
            <span class="team-name">${scenario.away.name}</span>
            <div class="team-score">${scenario.away.score}</div>
          </div>
          <span class="versus">VS</span>
          <div class="team">
            <span class="team-code">${scenario.home.code}</span>
            <span class="team-name">${scenario.home.name}</span>
            <div class="team-score">${scenario.home.score}</div>
          </div>
        </div>

        <div class="stat-strip">
          ${scenario.stats.map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>

        <div class="market-prompt">
          <p class="eyebrow">${scenario.player}</p>
          <h2>${scenario.line}</h2>
          <div class="guess-box">
            <div class="guess-readout">
              <span>Your implied probability</span>
              <strong class="guess-value" id="guessValue">${state.selected}%</strong>
            </div>
            <label class="sr-only" for="probabilityRange">Choose an implied probability</label>
            <input
              id="probabilityRange"
              type="range"
              min="1"
              max="99"
              value="${state.selected}"
              ${state.revealed ? "disabled" : ""}
            />
            <div class="range-labels"><span>1% · LONG SHOT</span><span>99% · LOCK</span></div>
          </div>

          ${state.revealed ? revealMarkup(scenario) : `
            <div class="action-row">
              <button class="primary-button" id="lockButton" type="button">LOCK IN ${state.selected}%</button>
            </div>
          `}
        </div>
      </article>
    </section>
  `;

  const range = document.querySelector("#probabilityRange");
  if (!state.revealed) {
    paintRange(range);
    range.addEventListener("input", (event) => {
      state.selected = Number(event.target.value);
      document.querySelector("#guessValue").textContent = `${state.selected}%`;
      document.querySelector("#lockButton").textContent = `LOCK IN ${state.selected}%`;
      paintRange(event.target);
    });

    document.querySelector("#lockButton").addEventListener("click", submitGuess);
  } else {
    document.querySelector("#nextButton").addEventListener("click", nextRound);
  }
}

function paintRange(range) {
  const progress = ((Number(range.value) - 1) / 98) * 100;
  range.style.background = `linear-gradient(to right, var(--lime) 0%, var(--lime) ${progress}%, rgba(227, 241, 233, 0.16) ${progress}%, rgba(227, 241, 233, 0.16) 100%)`;
}

function submitGuess() {
  const scenario = scenarios[state.current];
  const points = scoreGuess(state.selected, scenario.probability);
  state.answers[state.current] = {
    guess: state.selected,
    actual: scenario.probability,
    points,
  };
  state.revealed = true;
  persist();
  render();
  document.querySelector("#nextButton").focus();
}

function revealMarkup(scenario) {
  const answer = state.answers[state.current];
  const difference = Math.abs(answer.guess - answer.actual);
  const buttonLabel = state.current === scenarios.length - 1 ? "SEE MY RESULTS →" : "NEXT MOMENT →";

  return `
    <div class="reveal-card" aria-live="polite">
      <div class="reveal-grid">
        <div class="reveal-stat"><span>Market</span><strong class="actual">${answer.actual}%</strong></div>
        <div class="reveal-stat"><span>Your error</span><strong>${difference} pt${difference === 1 ? "" : "s"}</strong></div>
        <div class="reveal-stat"><span>Score</span><strong>+${answer.points}</strong></div>
      </div>
      <p>${scenario.insight}</p>
      <div class="action-row">
        <button class="primary-button" id="nextButton" type="button">${buttonLabel}</button>
      </div>
    </div>
  `;
}

function nextRound() {
  if (state.current === scenarios.length - 1) {
    state.screen = "results";
  } else {
    state.current += 1;
    state.selected = 50;
    state.revealed = false;
  }
  persist();
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
  app.focus();
}

function getTier(score) {
  if (score >= 600) return "MARKET MAKER";
  if (score >= 500) return "SHARP";
  if (score >= 350) return "TRADER";
  if (score >= 200) return "PUBLIC MONEY";
  return "COIN FLIP";
}

function seededPopulation() {
  const scores = [];
  let seed = 8713;
  for (let i = 0; i < 420; i += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const u1 = Math.max(seed / 233280, 0.0001);
    seed = (seed * 9301 + 49297) % 233280;
    const u2 = seed / 233280;
    const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    scores.push(Math.max(40, Math.min(690, Math.round(390 + normal * 105))));
  }
  return scores;
}

function percentileFor(score, population) {
  return Math.max(1, Math.min(99, Math.round((population.filter((value) => value < score).length / population.length) * 100)));
}

function chartMarkup(score, population) {
  const bins = Array.from({ length: 14 }, () => 0);
  population.forEach((value) => {
    bins[Math.min(13, Math.floor(value / 50))] += 1;
  });
  const width = 820;
  const height = 205;
  const padX = 16;
  const chartHeight = 135;
  const maxBin = Math.max(...bins);
  const points = bins.map((value, index) => {
    const x = padX + index * ((width - padX * 2) / (bins.length - 1));
    const y = 162 - (value / maxBin) * chartHeight;
    return [x, y];
  });
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${points.at(-1)[0]},162 L${points[0][0]},162 Z`;
  const markerX = padX + (score / 700) * (width - padX * 2);

  return `
    <svg class="distribution-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Score distribution with your score marked at ${score}">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#72f1b8" stop-opacity="0.42" />
          <stop offset="100%" stop-color="#72f1b8" stop-opacity="0" />
        </linearGradient>
      </defs>
      <line x1="16" y1="162" x2="804" y2="162" stroke="rgba(227,241,233,.14)" />
      <path d="${area}" fill="url(#areaFill)" />
      <path d="${line}" fill="none" stroke="#72f1b8" stroke-width="3" stroke-linejoin="round" />
      <line x1="${markerX}" y1="17" x2="${markerX}" y2="171" stroke="#c9ff57" stroke-width="2" stroke-dasharray="5 5" />
      <circle cx="${markerX}" cy="17" r="5" fill="#c9ff57" />
      <text x="${Math.min(markerX + 9, 748)}" y="22" fill="#c9ff57" font-family="DM Mono" font-size="12">YOU · ${score}</text>
      <text x="16" y="194" fill="#8ca29a" font-family="DM Mono" font-size="10">0</text>
      <text x="392" y="194" fill="#8ca29a" font-family="DM Mono" font-size="10">350</text>
      <text x="782" y="194" fill="#8ca29a" font-family="DM Mono" font-size="10">700</text>
    </svg>
  `;
}

function renderResults() {
  const score = totalScore();
  const population = seededPopulation();
  const percentile = percentileFor(score, population);

  app.innerHTML = `
    <section class="results-shell">
      <p class="eyebrow">Daily Drop 001 · Complete</p>
      <div class="results-hero">
        <div class="result-panel">
          <span class="progress-label">Your market score</span>
          <div class="result-score">${score}<small>/700</small></div>
          <p class="result-tier">${getTier(score)}</p>
        </div>
        <div class="result-panel percentile-panel">
          <span class="progress-label" style="color: rgba(7,17,15,.62)">Community rank</span>
          <div class="percentile-number">${percentile}<sup style="font-size:.25em;letter-spacing:0">%</sup></div>
          <p>You read the market better than ${percentile}% of today's players.</p>
        </div>
      </div>

      <div class="distribution-panel">
        <div class="panel-heading">
          <div><h3>Today's distribution</h3><p>Seeded demo population · 420 players</p></div>
          <span class="score-label">Median <strong>390</strong></span>
        </div>
        ${chartMarkup(score, population)}
      </div>

      <div class="round-list" aria-label="Round results">
        ${state.answers.map((answer, index) => `
          <div class="round-row">
            <span class="round-number">0${index + 1}</span>
            <div class="round-name">
              <strong>${scenarios[index].player}</strong>
              <span>${scenarios[index].line}</span>
            </div>
            <span class="round-comparison">${answer.guess}% → ${answer.actual}%</span>
            <span class="round-points">+${answer.points}</span>
          </div>
        `).join("")}
      </div>

      <div class="results-actions">
        <button class="primary-button" id="shareButton" type="button">SHARE MY SCORE</button>
        <button class="secondary-button" id="playAgainButton" type="button">PLAY AGAIN</button>
      </div>
    </section>
  `;

  document.querySelector("#shareButton").addEventListener("click", async (event) => {
    const text = `ODDILLION 001 — ${score}/700 · ${getTier(score)} · Top ${100 - percentile}%\nRead the moment. Call the odds.`;
    try {
      await navigator.clipboard.writeText(text);
      event.target.textContent = "COPIED TO CLIPBOARD ✓";
    } catch {
      event.target.textContent = "SCORE: " + score + "/700";
    }
  });

  document.querySelector("#playAgainButton").addEventListener("click", resetGame);
}

function resetGame() {
  localStorage.removeItem(storageKey);
  state = freshState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.focus();
}

restartButton.addEventListener("click", () => {
  if (state.answers.length === 0 || window.confirm("Reset today's game and erase your score?")) {
    resetGame();
  }
});

render();
