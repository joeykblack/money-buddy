const STORAGE_KEY = 'moneyBuddyMvp';

const state = loadState();

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const alertsList = document.getElementById('alerts-list');
const urgentAlertsList = document.getElementById('urgent-alerts-list');
const historyList = document.getElementById('history-list');
const nextAction = document.getElementById('next-action');
const themeSelect = document.getElementById('theme-select');
const appMessage = document.getElementById('app-message');
const appMessageText = document.getElementById('app-message-text');
const appMessageClose = document.getElementById('app-message-close');
const siteHeader = document.getElementById('site-header');
const siteSubtitle = document.getElementById('site-subtitle');
const todayHeading = document.getElementById('today-heading');
const monthlyHeading = document.getElementById('monthly-heading');
const otherHeading = document.getElementById('other-heading');
const taxesHeading = document.getElementById('taxes-heading');
const historyHeading = document.getElementById('history-heading');

let messageTimer = null;

function buildStaticThemeImages(folder, { count = 12, extension = 'jpg' } = {}) {
  return Array.from({ length: count }, (_, index) => `${folder}/${index + 1}.${extension}`);
}

// Theme contract for adding new themes:
// 1) Add a new key under THEME_DEFINITIONS.
// 2) Fill `ui`, `messages`, and `homeCardIds`.
// 3) Choose `imageProvider.type`:
//    - 'static' for local folders (most themes)
//    - 'reddit-aww' (or another dynamic provider in future) for fetched images.
const THEME_DEFINITIONS = {
  aww: {
    ui: {
      subtitle: 'Cute, gentle steps for bills and money tasks 💖',
      header: 'Money Buddy 🐾',
      sectionHeadings: {
        today: 'Today 🌈',
        monthly: 'Monthly Bills 💸',
        other: 'Other Bills 🧾',
        taxes: 'Taxes & Annual 📅',
        history: 'History 📖',
      },
    },
    homeCardIds: {
      card: 'aww-theme-card',
      startMessage: 'aww-start-message',
      image: 'aww-image',
    },
    imageProvider: {
      type: 'reddit-aww',
    },
    messages: {
      start: [
        'Hi hi! Let’s do this together, one tiny step at a time! 🌟',
        'You are doing such a good job already! Let’s start! 🧸',
        'Okay buddy, we got this! Gentle steps and big smiles! 💛',
        'You are brave and smart. I believe in you lots! 🐣',
        'Let’s begin! Tiny steps can make giant wins! 🌈',
        'You are amazing. Let’s make today sparkle! ✨',
        'Ready, set, cozy money time! You can do it! 🐾',
        'I am cheering for you so much right now! 💕',
        'You are not alone. We can do this together! 🌸',
        'Deep breath, sweet friend. Step one starts now! 🍓',
        'You are doing great. Let’s keep it simple and kind! 🫶',
        'Gold-star energy today! Let’s go! ⭐',
      ],
      step: [
        'Yayyy! You did it! 🌟',
        'That was awesome! I am super proud of you! 🐣',
        'Great job! Tiny steps, big progress! 💛',
        'You are doing SO good. Keep going, sweet friend! 🧸',
        'Nice work! You are super brave with money stuff! 🌈',
        'Woohoo! Step complete! Happy dance time! 🐾',
        'You are doing amazing. Big high five! ✋',
        'That was a smart move. You are crushing it! 🐥',
        'You did it! I believe in you so much! 💕',
        'Gold-star moment! Keep shining bright! ⭐',
        'You made lovely progress. So proud of you! 🌸',
        'Look at you go! Another step finished! 🎉',
        'Awww yeah! You nailed that step! 🐶',
        'You are doing really, really well! 🍓',
      ],
      final: [
        'You finished everything! I am SO proud of you! 🥳',
        'All done! You took amazing care of everything today! 💖',
        'You did the whole workflow! Superstar energy! 🌟',
        'Mission complete! Calm, smart, and wonderful! 🐻',
        'You did it all! Big cozy celebration time! 🎊',
        'Great job on every step. You are incredible! 🫶',
        'Everything is done! You deserve happy vibes! 🌈',
        'You completed the whole thing. Yay yay yay you! 🐾',
        'That was beautiful work from start to finish! 💛',
        'All finished! You made today sparkle! 🌸',
        'You did such a good job. Be proud of yourself! 🍓',
        'You totally did it! Gold stars everywhere! ⭐',
      ],
    },
  },
  ryangosling: {
    ui: {
      subtitle: 'Sharp focus. Smooth execution. Let\'s handle this. 🎬',
      header: 'Money Buddy 🎬',
      sectionHeadings: {
        today: 'Status 🎯',
        monthly: 'Monthly Moves 💸',
        other: 'Other Tasks 🧾',
        taxes: 'Annual Planning 📅',
        history: 'Track Record 📖',
      },
    },
    homeCardIds: {
      card: 'ryangosling-theme-card',
      startMessage: 'ryangosling-start-message',
      image: 'ryangosling-image',
    },
    imageProvider: {
      type: 'static',
      images: [
        'ryangosling/1.jpg',
        'ryangosling/2.jpg',
        'ryangosling/3.jpg',
        'ryangosling/4.jpeg',
        'ryangosling/5.jpg',
        'ryangosling/6.jpg',
        'ryangosling/7.jpg',
        'ryangosling/8.jpg',
        'ryangosling/9.jpg',
        'ryangosling/10.jpg',
      ],
    },
    messages: {
      start: [
        'Hey. Let\'s get this handled. 🎬',
        'I believe in you. Let\'s do this. 🚗',
        'You got this. Time to take action. 💪',
        'Focus. Precision. Let\'s execute. 🎯',
        'Smooth moves. Let\'s handle business. 🎸',
        'Cool and collected. Time to begin. ❄️',
        'You\'re capable. Let\'s make it happen. 🔥',
        'Drive. Determination. Let\'s start. 🏁',
        'With finesse. Let\'s take care of this. 🥃',
        'Stay sharp. Let\'s do this right. 🔪',
        'Half smirk. Full focus. Let\'s go. 😎',
        'Calm energy. Let\'s handle it. ✨',
        'If confidence looked this good, it would be you. Let\'s start. 😉',
        'You bring the spark, I\'ll bring the soundtrack. 🎶',
        'You + momentum = dangerously impressive. Let\'s go. 🔥',
        'Looking this focused should be illegal. Proceed anyway. 😏',
        'You had me at "let\'s get this done." 💫',
        'Steal a glance, then steal this win. 🕶️',
      ],
      step: [
        'Nice. You did that. 👌',
        'That was smooth. Keep going. 🎯',
        'Executed perfectly. Well done. 💯',
        'You made that look easy. 🎬',
        'Sharp work. Keep it up. 🔥',
        'Delivered. No wasted moves. 💪',
        'That\'s how it\'s done. 🚗',
        'Precision. I like it. 🎯',
        'You\'ve got rhythm. Keep going. 🎸',
        'Clean execution. Nice. 👍',
        'You\'re in the zone. 🔥',
        'Steady hand. Steady mind. 💯',
        'Flawless move. One more to go. ✨',
        'You own this. 😎',
        'Careful, that level of charm might break the scoreboard. 😉',
        'That move? Honestly kind of irresistible. 🎬',
        'You make discipline look very attractive. 🔥',
        'Smooth, smart, and maybe a little dangerous. I like it. 😏',
        'If "effortless" had a face, we\'d be looking at it. ✨',
        'You\'re not just on track — you\'re turning heads. 🖤',
      ],
      final: [
        'You crushed it. All done. 💯',
        'Perfect execution from start to finish. 🎯',
        'That\'s what success looks like. 🏆',
        'You handled it with style. 🎬',
        'Smooth operator. Everything complete. 🚗',
        'You didn\'t miss a single step. 🔥',
        'Drive and discipline. You nailed it. 💪',
        'No hesitation. No regrets. Done. 😎',
        'You made it look effortless. ✨',
        'Excellence achieved. Mission complete. 🎯',
        'Sharp focus. Sharp execution. Nice. 👌',
        'You\'re in control. Everything handled. 🏁',
        'You finished strong and looked good doing it. 💫',
        'That was a full-on main-character finish. 🎬',
        'You just turned "responsible" into "undeniably attractive." 😉',
        'All wrapped up — cool, confident, unforgettable. 😏',
        'You\'re officially the reason this checklist blushed. 🔥',
        'Mission complete. Charm level: unfair advantage. 🖤',
      ],
    },
  },
  spiderqueen: {
    ui: {
      subtitle: 'Spin the web. Rule the checklist. 🕸️',
      header: 'Money Buddy 🕷️',
      sectionHeadings: {
        today: 'Web of Tasks 🕸️',
        monthly: 'Tributes & Tithes 💸',
        other: 'Lesser Duties 🧾',
        taxes: 'Yearly Rituals 📅',
        history: 'Chronicle of Conquests 📖',
      },
    },
    homeCardIds: {
      card: 'spiderqueen-theme-card',
      startMessage: 'spiderqueen-start-message',
      image: 'spiderqueen-image',
    },
    imageProvider: {
      type: 'static',
      images: buildStaticThemeImages('spiderqueen', { count: 10, extension: 'jpg' }),
    },
    messages: {
      start: [
        'The web trembles. Your reign begins now. 🕸️',
        'Step lightly. Rule absolutely. 👑',
        'The night is yours. Let\'s begin. 🌙',
        'Every thread obeys your command. 🕷️',
        'Gather your focus. Claim your due. 💜',
        'The ritual starts with one perfect move. 🔮',
        'No chaos, only strategy. Let\'s weave. ✨',
        'Power favors the prepared. You are prepared. ⚔️',
        'Pull the first thread. The rest will follow. 🧵',
        'Your ledger kneels tonight. 🖤',
      ],
      step: [
        'Another strand secured. Excellent. 🕸️',
        'Clean move. The web tightens. 🕷️',
        'Precision worthy of a queen. 👑',
        'A flawless thread in your design. ✨',
        'The balance shifts in your favor. ⚖️',
        'That task never stood a chance. 🔥',
        'Beautiful execution. Continue. 💜',
        'One more thread bound to your will. 🧵',
        'Control maintained. Momentum gained. ⚔️',
        'You move like prophecy. 🔮',
      ],
      final: [
        'The web is complete. Your will is law. 🕸️',
        'All tributes collected. Reign secure. 👑',
        'Every thread in place. Masterful work. 🕷️',
        'Another cycle conquered in silence and style. 🖤',
        'The ritual is finished. You prevailed. 🔮',
        'No loose ends. Only victory. ⚔️',
        'Your domain is in order. Beautiful. 💜',
        'The ledger bows. You are done. ✨',
        'Commanding. Precise. Complete. 🧵',
        'A queen\'s work, flawlessly finished. 👑',
      ],
    },
  },
  kilianmurphy: {
    ui: {
      subtitle: 'No panic. No noise. Just clean execution. 🚬',
      header: 'Money Buddy 🎩',
      sectionHeadings: {
        today: 'Today, By Order ✅',
        monthly: 'Family Accounts 💸',
        other: 'Loose Ends 🧾',
        taxes: 'Annual Books 📅',
        history: 'Ledgers & Wins 📖',
      },
    },
    homeCardIds: {
      card: 'kilianmurphy-theme-card',
      startMessage: 'kilianmurphy-start-message',
      image: 'kilianmurphy-image',
    },
    imageProvider: {
      type: 'static',
      images: [
        'kilianmurphy/1.jpg',
        'kilianmurphy/2.jpg',
        'kilianmurphy/3.jpg',
        'kilianmurphy/4.jpg',
        'kilianmurphy/5.jpg',
        'kilianmurphy/6.jpeg',
        'kilianmurphy/7.jpg',
        'kilianmurphy/8.jpg',
        'kilianmurphy/9.jpg',
        'kilianmurphy/10.jpg',
      ],
    },
    messages: {
      start: [
        'Keep your head. We move one step at a time. 🎩',
        'Quiet room, sharp plan. Let’s begin. 🧥',
        'You stay calm. I’ll call the play. ✅',
        'No fuss — just results. Start now. 📋',
        'Hands steady, mind clear. Let’s do it. ⚙️',
        'Right then. We run this list properly. 🖤',
        'By order of good decisions, we begin. 🚬',
        'One clean move now saves ten later. ⏱️',
        'You’re in control. Keep it tidy. 🧠',
        'The books won’t fix themselves. We will. 💼',
      ],
      step: [
        'Good. One item handled. ✅',
        'That was clean work. Keep going. 🎩',
        'No wasted motion. Nicely done. ⚙️',
        'Steady pace, solid result. 🧠',
        'You’re making this look easy. 💼',
        'Another box checked. Proper work. 📋',
        'Calm pressure. Great execution. ⏱️',
        'That’s exactly how to do it. 🧥',
        'Strong move. Keep the rhythm. 🖤',
        'You’re building real momentum now. 🚬',
      ],
      final: [
        'All done. Order restored. ✅',
        'Every task handled. Proper finish. 🎩',
        'Clean books, clear head, job done. 💼',
        'No chaos. Just execution. Completed. ⚙️',
        'That was controlled and precise. 🧠',
        'You closed every loop. Respect. 🖤',
        'Strong finish. Exactly what was needed. 📋',
        'Everything sorted. You ran this perfectly. 🧥',
        'Discipline all the way through. Done. ⏱️',
        'By order of you, mission complete. 🚬',
      ],
    },
  },
};

const monthlyStepEls = [
  document.getElementById('monthly-step-1'),
  document.getElementById('monthly-step-2'),
  document.getElementById('monthly-step-3'),
  document.getElementById('monthly-step-4'),
];

init();

function init() {
  bindTabs();
  bindAlertLinks();
  bindMonthlyWalkthrough();
  bindOtherBills();
  bindTaxes();
  bindHistory();
  bindSettings();
  bindMessageBanner();
  setupCurrencyFormatting();

  state.theme = normalizeTheme(state.theme);
  applyTheme(state.theme);
  themeSelect.value = state.theme;
  updateThemeHeaders();
  updateThemeSubtitle();
  updateThemeHomeCardContent();

  renderAlerts();
  renderMonthlyStep();
  renderOtherBills();
  renderHistory();
  updateNextAction();
}

function bindMessageBanner() {
  appMessageClose?.addEventListener('click', () => {
    hideMessage();
  });
}

function bindTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const target = tab.dataset.tab;
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });
    });
  });

}

function bindAlertLinks() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.alert-link');
    if (!button) return;

    const tab = button.dataset.tab;
    const key = button.dataset.alertKey;
    openGuideForAlert(tab, key);
  });
}

function openGuideForAlert(tab, key) {
  if (!tab) return;
  if (tab === 'monthly' && state.monthly.completedAt && key === 'monthlyWorkflow') {
    resetMonthlyWorkflowForNewRun();
    saveState();
    renderMonthlyStep();
    renderAlerts();
    updateNextAction();
  }
  activateTab(tab);
}

function activateTab(name) {
  document.querySelector(`.tab[data-tab="${name}"]`)?.click();
}

function bindMonthlyWalkthrough() {
  const checking = document.getElementById('checking');
  const savings = document.getElementById('savings');
  const citi = document.getElementById('citi');
  const calcBtn = document.getElementById('calc-monthly');
  const resultText = document.getElementById('monthly-result-text');
  const moveList = document.getElementById('monthly-move-list');
  const step2Back = document.getElementById('monthly-step-2-back');
  const step2Done = document.getElementById('monthly-step-2-done');
  const citiConfirmation = document.getElementById('citi-confirmation');
  const step3Back = document.getElementById('monthly-step-3-back');
  const step3Done = document.getElementById('monthly-step-3-done');
  const mvSettlement = document.getElementById('mv-settlement');
  const mvVtsax = document.getElementById('mv-vtsax');
  const mvVtiax = document.getElementById('mv-vtiax');
  const mvVbtlx = document.getElementById('mv-vbtlx');
  const mvVtabx = document.getElementById('mv-vtabx');
  const monthlyCalcVanguard = document.getElementById('monthly-calc-vanguard');
  const monthlyVanguardSummary = document.getElementById('monthly-vanguard-summary');
  const monthlyVanguardActions = document.getElementById('monthly-vanguard-actions');
  const step4Back = document.getElementById('monthly-step-4-back');
  const completeBtn = document.getElementById('complete-monthly');

  checking.value = toPlainNumber(state.monthly.checking);
  savings.value = toPlainNumber(state.monthly.savings);
  citi.value = toPlainNumber(state.monthly.citi);
  citiConfirmation.value = state.monthly.citiConfirmation || '';
  mvSettlement.value = toPlainNumber(state.monthly.vanguardCurrent?.settlement);
  mvVtsax.value = toPlainNumber(state.monthly.vanguardCurrent?.VTSAX);
  mvVtiax.value = toPlainNumber(state.monthly.vanguardCurrent?.VTIAX);
  mvVbtlx.value = toPlainNumber(state.monthly.vanguardCurrent?.VBTLX);
  mvVtabx.value = toPlainNumber(state.monthly.vanguardCurrent?.VTABX);

  monthlyCalcVanguard.addEventListener('click', () => {
    if (!state.monthly.needsVanguardTransfer || state.monthly.vanguardAmount <= 0) {
      monthlyVanguardSummary.innerHTML = '<li>No Vanguard buy is needed this month.</li>';
      monthlyVanguardActions.innerHTML = '<li>You can mark the monthly workflow complete.</li>';
      return;
    }

    const current = {
      settlement: parseCurrency(mvSettlement.value),
      VTSAX: parseCurrency(mvVtsax.value),
      VTIAX: parseCurrency(mvVtiax.value),
      VBTLX: parseCurrency(mvVbtlx.value),
      VTABX: parseCurrency(mvVtabx.value),
    };

    if (Object.values(current).some((n) => Number.isNaN(n) || n < 0)) {
      showMessage('Please enter valid non-negative numbers for all Vanguard amounts.', 'error');
      return;
    }

    const amountToInvest = state.monthly.vanguardAmount;
    const plan = calculateMonthlyVanguardPlan(amountToInvest, current);

    state.monthly.vanguardCurrent = current;
    state.monthly.vanguardPlan = plan;
    saveState();

    monthlyVanguardSummary.innerHTML = [
      `<li><strong>Amount to invest this month:</strong> ${fmt(amountToInvest)}</li>`,
      `<li>Settlement fund buy: <strong>${fmt(plan.buy.settlement)}</strong></li>`,
      `<li>VTSAX buy: <strong>${fmt(plan.buy.VTSAX)}</strong></li>`,
      `<li>VTIAX buy: <strong>${fmt(plan.buy.VTIAX)}</strong></li>`,
      `<li>VBTLX buy: <strong>${fmt(plan.buy.VBTLX)}</strong></li>`,
      `<li>VTABX buy: <strong>${fmt(plan.buy.VTABX)}</strong></li>`,
      `<li><strong>Total buys:</strong> ${fmt(plan.totalBuy)}</li>`,
    ].join('');

    monthlyVanguardActions.innerHTML = [
      'Open Vanguard and sign in.',
      'Go to Buy & Sell (or Transact).',
      `Buy settlement fund: ${fmt(plan.buy.settlement)}.`,
      `Buy VTSAX: ${fmt(plan.buy.VTSAX)}.`,
      `Buy VTIAX: ${fmt(plan.buy.VTIAX)}.`,
      `Buy VBTLX: ${fmt(plan.buy.VBTLX)}.`,
      `Buy VTABX: ${fmt(plan.buy.VTABX)}.`,
      'Review all amounts, submit orders, and wait for confirmation.',
      'After confirmation, click “Mark Monthly Workflow Complete.”',
    ]
      .map((line) => `<li>${line}</li>`)
      .join('');

    logEvent('Monthly Vanguard plan calculated', `Calculated monthly Vanguard buys for ${fmt(amountToInvest)}.`);
    renderHistory();
  });

  calcBtn.addEventListener('click', () => {
    const checkingValue = parseCurrency(checking.value);
    const savingsValue = parseCurrency(savings.value);
    const citiValue = parseCurrency(citi.value);

    if ([checkingValue, savingsValue, citiValue].some((v) => Number.isNaN(v))) {
      showMessage('Please enter valid numbers for all balances.', 'error');
      return;
    }

    const result = roundMoney(checkingValue - citiValue - 4000);
    state.monthly.checking = checkingValue;
    state.monthly.savings = savingsValue;
    state.monthly.citi = citiValue;
    state.monthly.result = result;
    state.monthly.vanguardPlan = null;

    const moves = [];
    if (result < 0) {
      state.monthly.needsVanguardTransfer = false;
      state.monthly.vanguardAmount = 0;
      moves.push(`<strong>SAVINGS → CHECKING:</strong> Move ${fmt(Math.abs(result))}.`);
      moves.push('Do this first so bills can be paid safely.');
    } else if (result > 0) {
      const savingsGap = Math.max(0, roundMoney(70000 - savingsValue));
      const toSavings = roundMoney(Math.min(result, savingsGap));
      const toVanguard = roundMoney(result - toSavings);

      state.monthly.needsVanguardTransfer = toVanguard > 0;
      state.monthly.vanguardAmount = toVanguard;

      if (toSavings > 0) {
        moves.push(`<strong>CHECKING → SAVINGS:</strong> Move ${fmt(toSavings)} (to reach $70,000).`);
      }

      if (toVanguard > 0) {
        moves.push(`<strong>CHECKING → VANGUARD:</strong> Then move ${fmt(toVanguard)} in Step 4.`);
      } else {
        moves.push('No Vanguard transfer needed this month after topping up savings.');
      }
    } else {
      state.monthly.needsVanguardTransfer = false;
      state.monthly.vanguardAmount = 0;
      moves.push('No extra transfer needed. Continue to Citi payment.');
    }

    resultText.textContent = `Result = ${fmt(result)} (checking - citi - $4,000)`;
    moveList.innerHTML = moves.map((m) => `<li>${m}</li>`).join('');

    state.monthly.step = Math.max(state.monthly.step, 2);
    saveState();
    renderMonthlyStep();
  });

  step2Done.addEventListener('click', () => {
    state.monthly.step = Math.max(state.monthly.step, 3);
    logEvent('Monthly step complete', 'Move money step completed.');
    saveState();
    renderMonthlyStep();
  });

  step2Back.addEventListener('click', () => {
    state.monthly.step = 1;
    saveState();
    renderMonthlyStep();
  });

  step3Done.addEventListener('click', () => {
    const conf = citiConfirmation.value.trim();

    state.monthly.step = Math.max(state.monthly.step, 4);
    state.monthly.citiConfirmation = conf;
    if (conf) {
      logEvent('Citi payment', `Citi payment completed. Confirmation number: ${conf}.`);
    } else {
      logEvent('Citi payment', 'Citi payment completed. No confirmation number entered.');
    }
    saveState();
    renderMonthlyStep();
    renderAlerts();
  });

  step3Back.addEventListener('click', () => {
    state.monthly.step = 2;
    saveState();
    renderMonthlyStep();
  });

  step4Back.addEventListener('click', () => {
    state.monthly.step = 3;
    saveState();
    renderMonthlyStep();
  });

  completeBtn.addEventListener('click', async () => {
    if (state.monthly.needsVanguardTransfer && state.monthly.vanguardAmount > 0 && !state.monthly.vanguardPlan) {
      showMessage('Please click “Calculate Exactly What to Buy” in Step 4 before completing the month.', 'error');
      return;
    }

    const today = new Date().toISOString();
    const finalReward = await getRandomThemeRewardItem(state.theme, state.monthly.lastRewardUrl || '');
    const finalMessage = getRandomThemeRewardMessage('final', state.theme);

    state.monthly.completedAt = today;
    state.monthly.step = 5;
    state.monthly.finalReward = {
      ...(finalReward || state.monthly.finalReward || getCachedThemeImage(state.theme) || {}),
      message: finalMessage,
    };
    if (state.monthly.finalReward?.url) {
      state.monthly.lastRewardUrl = state.monthly.finalReward.url;
    }

    state.monthlyEntries = Array.isArray(state.monthlyEntries) ? state.monthlyEntries : [];
    state.monthlyEntries.unshift(createMonthlyEntrySnapshot(today));

    logEvent('Monthly workflow complete', `Completed monthly workflow on ${new Date(today).toLocaleString()}.`);
    markAlertCompleted('monthlyWorkflow');
    saveState();
    renderHistory();
    renderAlerts();
    renderMonthlyStep();
    updateNextAction();
  });

}

function bindOtherBills() {
  const otherBillTabs = document.querySelectorAll('.other-bill-tab');
  const otherBillPanels = document.querySelectorAll('.other-bill-panel');

  otherBillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.otherbill;

      otherBillTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      otherBillPanels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.id !== `other-bill-${selected}`);
      });
    });
  });

  const happyLawnsReceivedBtn = document.getElementById('happy-lawns-received');
  if (happyLawnsReceivedBtn) {
    happyLawnsReceivedBtn.addEventListener('click', () => {
      state.otherBills.happylawns.receivedAt = new Date().toISOString();
      saveState();
      logEvent('Happy Lawns bill received', 'Marked email bill as received.');
      renderOtherBills();
    });
  }

  document.querySelectorAll('.mark-complete').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const task = btn.dataset.task;
      const key = btn.dataset.billKey;

      if (key && state.otherBills[key]) {
        state.otherBills[key].lastDoneAt = new Date().toISOString();
        if (key === 'happylawns') {
          state.otherBills.happylawns.receivedAt = null;
        }
      }

      logEvent('Task complete', task);

      const alertKey = btn.dataset.alertKey;
      if (alertKey) {
        markAlertCompleted(alertKey);
        renderAlerts();
      }

      if (key) {
        await showOtherBillReward(key);
      }

      saveState();
      renderOtherBills();
      renderHistory();
    });
  });
}

async function showOtherBillReward(key) {
  const rewardWrap = document.getElementById(`other-reward-${key}`);
  const rewardMessage = document.getElementById(`other-reward-${key}-message`);
  const rewardImage = document.getElementById(`other-reward-${key}-image`);
  if (!rewardWrap || !rewardMessage || !rewardImage) return;

  const item = await getRandomThemeRewardItem(state.theme);
  rewardWrap.classList.remove('hidden');
  rewardMessage.textContent = getRandomThemeRewardMessage('step', state.theme);

  if (item?.url) {
    rewardImage.src = item.url;
    rewardImage.classList.remove('hidden');
  } else {
    rewardImage.classList.add('hidden');
  }
}

function renderOtherBills() {
  renderOtherBillRow('boardman', {
    statusId: 'other-boardman-status',
    datesId: 'other-boardman-dates',
  });

  renderOtherBillRow('happylawns', {
    statusId: 'other-happylawns-status',
    datesId: 'other-happylawns-dates',
  });

  renderOtherBillRow('mercury', {
    statusId: 'other-mercury-status',
    datesId: 'other-mercury-dates',
  });
}

function renderOtherBillRow(key, ids) {
  const statusEl = document.getElementById(ids.statusId);
  const datesEl = document.getElementById(ids.datesId);
  if (!statusEl || !datesEl) return;

  const schedule = getOtherBillSchedule(key);
  statusEl.className = `status-pill ${toAlertLevelClass(schedule.level)}`;
  statusEl.textContent = `${getAlertMarker(schedule.level)} ${schedule.level}`;

  datesEl.textContent = `Last done: ${schedule.lastDoneText} • Next due: ${schedule.nextDueText}`;
}

function getOtherBillSchedule(key) {
  const now = new Date();
  const item = state.otherBills[key] || { lastDoneAt: null };
  const lastDoneAt = item.lastDoneAt ? new Date(item.lastDoneAt) : null;
  const lastDoneText = lastDoneAt ? lastDoneAt.toLocaleDateString() : 'Not recorded yet';

  if (key === 'boardman') {
    let due = endOfCurrentMonthOrNext();
    if (lastDoneAt && toDateKey(lastDoneAt) === toDateKey(due)) {
      due = endOfNextMonthFromDate(due);
    }
    const days = diffDays(now, due);
    return {
      level: getAlertLevel(days),
      lastDoneText,
      nextDueText: due.toLocaleDateString(),
    };
  }

  if (key === 'mercury') {
    let due = nextFixedDate([['02-01'], ['08-01']]);
    if (lastDoneAt && toDateKey(lastDoneAt) === toDateKey(due)) {
      due = nextFixedDateFromDate(due, ['02-01', '08-01']);
    }
    const days = diffDays(now, due);
    return {
      level: getAlertLevel(days),
      lastDoneText,
      nextDueText: due.toLocaleDateString(),
    };
  }

  const receivedAt = state.otherBills.happylawns.receivedAt ? new Date(state.otherBills.happylawns.receivedAt) : null;
  const pendingEmailBill = receivedAt && (!lastDoneAt || lastDoneAt < receivedAt);
  return {
    level: pendingEmailBill ? 'Soon' : 'Later',
    lastDoneText,
    nextDueText: pendingEmailBill ? 'Now (email bill received)' : 'When next email bill arrives',
  };
}

function bindTaxes() {
  const saveTaxProgress = document.getElementById('save-tax-progress');
  const taxItems = Array.from(document.querySelectorAll('.tax-item'));

  taxItems.forEach((item) => {
    item.checked = state.taxes.completed.includes(item.value);
  });

  saveTaxProgress.addEventListener('click', () => {
    state.taxes.completed = taxItems.filter((i) => i.checked).map((i) => i.value);

    if (state.taxes.completed.includes('Taxes filed in FreeTaxUSA')) {
      markAlertCompleted('taxes');
      renderAlerts();
    }

    saveState();
    logEvent('Taxes progress saved', `${state.taxes.completed.length} tax checklist item(s) checked.`);
    renderHistory();
  });
}

function bindHistory() {
  document.getElementById('clear-history').addEventListener('click', () => {
    const shouldClear = confirm('Clear all history on this device?');
    if (!shouldClear) return;

    state.history = [];
    saveState();
    renderHistory();
  });
}

function bindSettings() {
  themeSelect.addEventListener('change', () => {
    const value = normalizeTheme(themeSelect.value);
    applyTheme(value);
    state.theme = value;
    saveState();
    updateThemeHeaders();
    updateThemeSubtitle();
    updateThemeHomeCardContent();
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getThemeDefinition(theme = state.theme) {
  const normalized = normalizeTheme(theme);
  return THEME_DEFINITIONS[normalized] || THEME_DEFINITIONS.aww;
}

function getThemeHomeCardElements(theme = state.theme) {
  const def = getThemeDefinition(theme);
  const ids = def?.homeCardIds;
  if (!ids) return null;
  return {
    card: document.getElementById(ids.card),
    startMessage: document.getElementById(ids.startMessage),
    image: document.getElementById(ids.image),
  };
}

function getCachedThemeImage(theme = state.theme) {
  const normalized = normalizeTheme(theme);

  if (normalized === 'aww') {
    return state.awwImage || null;
  }

  const url = state.themeImages?.[normalized] || '';
  return url ? { url } : null;
}

function cacheThemeImage(theme, item) {
  if (!item?.url) return;

  const normalized = normalizeTheme(theme);
  if (normalized === 'aww') {
    state.awwImage = item;
  } else {
    state.themeImages = state.themeImages || {};
    state.themeImages[normalized] = item.url;
  }
  saveState();
}

function setThemeImage(imageEl, item) {
  if (!imageEl) return;

  if (!item?.url) {
    imageEl.classList.add('hidden');
    return;
  }

  imageEl.src = item.url;
  imageEl.classList.remove('hidden');
}

async function updateThemeHomeCardContent() {
  const activeTheme = normalizeTheme(state.theme);

  Object.keys(THEME_DEFINITIONS).forEach((themeKey) => {
    const elements = getThemeHomeCardElements(themeKey);
    if (!elements?.card) return;
    elements.card.classList.toggle('hidden', themeKey !== activeTheme);
  });

  const activeElements = getThemeHomeCardElements(activeTheme);
  if (!activeElements?.card || !activeElements?.startMessage || !activeElements?.image) return;

  activeElements.startMessage.textContent = getRandomThemeRewardMessage('start', activeTheme);

  const cached = getCachedThemeImage(activeTheme);
  setThemeImage(activeElements.image, cached);

  try {
    const randomItem = await getRandomThemeRewardItem(activeTheme, cached?.url || '');
    if (!randomItem?.url) {
      if (!cached?.url) activeElements.image.classList.add('hidden');
      return;
    }
    cacheThemeImage(activeTheme, randomItem);
    setThemeImage(activeElements.image, randomItem);
  } catch {
    if (!cached?.url) activeElements.image.classList.add('hidden');
  }
}

function pickRandomAwwItem(items, excludeUrl = '') {
  if (!Array.isArray(items) || !items.length) return null;
  const filtered = excludeUrl ? items.filter((item) => item.url !== excludeUrl) : items;
  const source = filtered.length ? filtered : items;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

function pickRandomStaticImage(images, excludeUrl = '') {
  if (!Array.isArray(images) || !images.length) return '';
  const filtered = excludeUrl ? images.filter((url) => url !== excludeUrl) : images;
  const source = filtered.length ? filtered : images;
  const index = Math.floor(Math.random() * source.length);
  return source[index] || '';
}

function getRandomThemeRewardMessage(kind = 'step', theme = state.theme) {
  const messages = getThemeDefinition(theme)?.messages?.[kind] || getThemeDefinition('aww')?.messages?.[kind] || [];
  if (!messages.length) return 'Great job!';
  return messages[Math.floor(Math.random() * messages.length)];
}

async function getRandomThemeRewardItem(theme = state.theme, excludeUrl = '') {
  const normalized = normalizeTheme(theme);
  const provider = getThemeDefinition(normalized)?.imageProvider;

  if (!provider) return null;

  if (provider.type === 'reddit-aww') {
    const items = await getAwwFeedItems();
    if (!items.length) return getCachedThemeImage(normalized);
    return pickRandomAwwItem(items, excludeUrl);
  }

  if (provider.type === 'static') {
    const previous = excludeUrl || getCachedThemeImage(normalized)?.url || '';
    const url = pickRandomStaticImage(provider.images, previous);
    return url ? { url } : null;
  }

  return null;
}

function updateThemeSubtitle() {
  if (!siteSubtitle) return;

  const subtitle = getThemeDefinition(state.theme)?.ui?.subtitle || getThemeDefinition('aww')?.ui?.subtitle;
  siteSubtitle.textContent = subtitle;
}

function updateThemeHeaders() {
  const themeUi = getThemeDefinition(state.theme)?.ui || getThemeDefinition('aww')?.ui;
  const headings = themeUi?.sectionHeadings || {};

  if (siteHeader && themeUi?.header) {
    siteHeader.textContent = themeUi.header;
  }
  if (todayHeading && headings.today) {
    todayHeading.textContent = headings.today;
  }
  if (monthlyHeading && headings.monthly) {
    monthlyHeading.textContent = headings.monthly;
  }
  if (otherHeading && headings.other) {
    otherHeading.textContent = headings.other;
  }
  if (taxesHeading && headings.taxes) {
    taxesHeading.textContent = headings.taxes;
  }
  if (historyHeading && headings.history) {
    historyHeading.textContent = headings.history;
  }
}

async function getAwwFeedItems() {
  const maxAgeMs = 1000 * 60 * 60 * 6;
  const cachedFeed = state.awwFeed;
  const isFeedFresh = cachedFeed?.fetchedAt && Date.now() - new Date(cachedFeed.fetchedAt).getTime() < maxAgeMs;

  if (isFeedFresh && Array.isArray(cachedFeed?.items) && cachedFeed.items.length) {
    return cachedFeed.items;
  }

  const items = await fetchRecentAwwImages();
  if (items.length) {
    state.awwFeed = {
      items,
      fetchedAt: new Date().toISOString(),
    };
    saveState();
    return items;
  }

  return Array.isArray(cachedFeed?.items) ? cachedFeed.items : [];
}

async function fetchRecentAwwImages() {
  const data = await fetchAwwListingJson();
  if (!data) return [];

  const posts = data?.data?.children?.map((c) => c.data) || [];

  return posts
    .filter((p) => {
      if (!p || p.over_18) return false;
      const url = p.url_overridden_by_dest || p.url || '';
      if (!/^https?:\/\//i.test(url)) return false;
      return /(\.(jpg|jpeg|png|webp))(\?.*)?$/i.test(url);
    })
    .map((p) => ({
      title: p.title,
      url: p.url_overridden_by_dest || p.url,
      permalink: p.permalink ? `https://www.reddit.com${p.permalink}` : '',
    }));
}

async function fetchAwwListingJson() {
  const redditUrl = 'https://www.reddit.com/r/aww/hot.json?limit=60&raw_json=1';

  // Try direct Reddit request first.
  try {
    const direct = await fetch(redditUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (direct.ok) {
      return await direct.json();
    }
  } catch {
    // Continue to fallback below.
  }

  // Fallback through a CORS-friendly public proxy.
  try {
    const proxied = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(redditUrl)}`);
    if (!proxied.ok) return null;
    return await proxied.json();
  } catch {
    return null;
  }
}

function renderMonthlyStep() {
  const step = state.monthly.step || 1;
  monthlyStepEls.forEach((el, i) => el.classList.toggle('hidden', i + 1 !== step));

  const completeScreen = document.getElementById('monthly-complete-screen');
  if (completeScreen) {
    completeScreen.classList.toggle('hidden', step !== 5);
  }

  const progressText = document.getElementById('monthly-progress');
  const progressBar = document.getElementById('progress-bar');
  if (step >= 5) {
    progressText.textContent = 'Complete';
    progressBar.style.width = '100%';
  } else {
    progressText.textContent = `Step ${step} of 4`;
    progressBar.style.width = `${Math.max(1, step) * 25}%`;
  }

  renderVanguardLastStep();
  renderMonthlyStepReward(step);
  renderMonthlyFinalReward(step);
  updateNextAction();
}

function createMonthlyEntrySnapshot(completedAt) {
  const checking = Number(state.monthly.checking || 0);
  const savings = Number(state.monthly.savings || 0);
  const citi = Number(state.monthly.citi || 0);
  const result = Number(state.monthly.result || 0);
  const savingsGap = Math.max(0, roundMoney(70000 - savings));
  const toSavings = result > 0 ? roundMoney(Math.min(result, savingsGap)) : 0;
  const toVanguard = result > 0 ? roundMoney(result - toSavings) : 0;

  return {
    completedAt,
    checking,
    savings,
    citi,
    result,
    toSavings,
    toVanguard,
    fromSavingsToChecking: result < 0 ? Math.abs(result) : 0,
    citiConfirmation: state.monthly.citiConfirmation || '',
    vanguardCurrent: {
      settlement: Number(state.monthly.vanguardCurrent?.settlement || 0),
      VTSAX: Number(state.monthly.vanguardCurrent?.VTSAX || 0),
      VTIAX: Number(state.monthly.vanguardCurrent?.VTIAX || 0),
      VBTLX: Number(state.monthly.vanguardCurrent?.VBTLX || 0),
      VTABX: Number(state.monthly.vanguardCurrent?.VTABX || 0),
    },
    vanguardBuy: {
      settlement: Number(state.monthly.vanguardPlan?.buy?.settlement || 0),
      VTSAX: Number(state.monthly.vanguardPlan?.buy?.VTSAX || 0),
      VTIAX: Number(state.monthly.vanguardPlan?.buy?.VTIAX || 0),
      VBTLX: Number(state.monthly.vanguardPlan?.buy?.VBTLX || 0),
      VTABX: Number(state.monthly.vanguardPlan?.buy?.VTABX || 0),
    },
  };
}

function renderMonthlyEntriesTables() {
  const container = document.getElementById('monthly-entries-container');
  if (!container) return;

  const entries = Array.isArray(state.monthlyEntries) ? state.monthlyEntries : [];
  if (!entries.length) {
    container.innerHTML = '<div class="card muted">No Monthly Bills entries yet.</div>';
    return;
  }

  container.innerHTML = entries
    .map((entry, idx) => {
      const rows = buildMonthlyEntryRows(entry)
        .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
        .join('');

      const dateText = new Date(entry.completedAt).toLocaleString();
      return `
        <details class="card" ${idx === 0 ? 'open' : ''}>
          <summary><strong>Monthly Bills Entry — ${dateText}</strong></summary>
          <div class="table-wrap">
            <table class="values-table" aria-label="Monthly bill values entry ${idx + 1}">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>
      `;
    })
    .join('');
}

function buildMonthlyEntryRows(entry) {
  return [
    ['Completed At', new Date(entry.completedAt).toLocaleString()],
    ['VyStar Checking', fmt(Number(entry.checking || 0))],
    ['VyStar Savings', fmt(Number(entry.savings || 0))],
    ['Citi Balance', fmt(Number(entry.citi || 0))],
    ['Reserve in Checking', fmt(4000)],
    ['Result (checking - citi - 4000)', fmt(Number(entry.result || 0))],
    ['Move Checking → Savings', fmt(Number(entry.toSavings || 0))],
    ['Move Checking → Vanguard', fmt(Number(entry.toVanguard || 0))],
    ['Move Savings → Checking (if negative result)', fmt(Number(entry.fromSavingsToChecking || 0))],
    ['Citi Confirmation #', entry.citiConfirmation || 'Not entered'],
    ['Vanguard Input: Settlement Current', fmt(Number(entry.vanguardCurrent?.settlement || 0))],
    ['Vanguard Input: VTSAX Current', fmt(Number(entry.vanguardCurrent?.VTSAX || 0))],
    ['Vanguard Input: VTIAX Current', fmt(Number(entry.vanguardCurrent?.VTIAX || 0))],
    ['Vanguard Input: VBTLX Current', fmt(Number(entry.vanguardCurrent?.VBTLX || 0))],
    ['Vanguard Input: VTABX Current', fmt(Number(entry.vanguardCurrent?.VTABX || 0))],
    ['Vanguard Buy: Settlement', fmt(Number(entry.vanguardBuy?.settlement || 0))],
    ['Vanguard Buy: VTSAX', fmt(Number(entry.vanguardBuy?.VTSAX || 0))],
    ['Vanguard Buy: VTIAX', fmt(Number(entry.vanguardBuy?.VTIAX || 0))],
    ['Vanguard Buy: VBTLX', fmt(Number(entry.vanguardBuy?.VBTLX || 0))],
    ['Vanguard Buy: VTABX', fmt(Number(entry.vanguardBuy?.VTABX || 0))],
  ];
}

async function renderMonthlyStepReward(step) {
  const rewardCard = document.getElementById('monthly-step-reward');
  const rewardTitle = document.getElementById('monthly-step-reward-title');
  const rewardImage = document.getElementById('monthly-step-reward-image');

  if (!rewardCard || !rewardTitle || !rewardImage) return;

  if (step <= 1 || step >= 5) {
    rewardCard.classList.add('hidden');
    return;
  }

  rewardCard.classList.remove('hidden');
  const completedStep = step - 1;
  const theme = normalizeTheme(state.theme);

  state.monthly.stepRewards = state.monthly.stepRewards || {};
  let rewardItem = state.monthly.stepRewards[String(completedStep)] || null;

  if (!rewardItem?.url) {
    rewardItem = await getRandomThemeRewardItem(theme, state.monthly.lastRewardUrl || '');
    if (rewardItem?.url) {
      rewardItem = {
        ...rewardItem,
        message: getRandomThemeRewardMessage('step', theme),
      };
      state.monthly.stepRewards[String(completedStep)] = rewardItem;
      state.monthly.lastRewardUrl = rewardItem.url;
      saveState();
    }
  } else if (!rewardItem.message) {
    rewardItem.message = getRandomThemeRewardMessage('step', theme);
    state.monthly.stepRewards[String(completedStep)] = rewardItem;
    saveState();
  }

  rewardTitle.textContent = rewardItem?.message || `Great job finishing Step ${completedStep}!`;

  if (!rewardItem?.url) {
    rewardImage.classList.add('hidden');
    return;
  }

  rewardImage.src = rewardItem.url;
  rewardImage.classList.remove('hidden');
}

function renderMonthlyFinalReward(step) {
  const finalImage = document.getElementById('monthly-final-reward-image');
  const finalMessage = document.getElementById('monthly-final-reward-message');
  if (!finalImage || !finalMessage) return;

  if (step !== 5) {
    finalImage.classList.add('hidden');
    finalMessage.textContent = '';
    return;
  }

  const theme = normalizeTheme(state.theme);
  let rewardItem = state.monthly.finalReward || getCachedThemeImage(theme);

  if (!rewardItem?.url) {
    const provider = getThemeDefinition(theme)?.imageProvider;
    if (provider?.type === 'static') {
      const url = pickRandomStaticImage(provider.images, state.monthly.lastRewardUrl || '');
      if (url) {
        rewardItem = { url };
        state.monthly.finalReward = rewardItem;
        state.monthly.lastRewardUrl = url;
        cacheThemeImage(theme, rewardItem);
        saveState();
      }
    }
  }

  if (rewardItem?.url) {
    finalImage.src = rewardItem.url;
    finalImage.classList.remove('hidden');
    finalMessage.textContent = rewardItem.message || getRandomThemeRewardMessage('final', theme);
  } else {
    finalImage.classList.add('hidden');
    finalMessage.textContent = getRandomThemeRewardMessage('final', theme);
  }
}

function renderVanguardLastStep() {
  const vanguardText = document.getElementById('monthly-vanguard-text');
  const vanguardSteps = document.getElementById('monthly-vanguard-steps');
  const monthlyVanguardFormWrap = document.getElementById('monthly-vanguard-form-wrap');
  const monthlyVanguardSummary = document.getElementById('monthly-vanguard-summary');
  const monthlyVanguardActions = document.getElementById('monthly-vanguard-actions');
  if (!vanguardText || !vanguardSteps) return;

  if (state.monthly.needsVanguardTransfer && state.monthly.vanguardAmount > 0) {
    vanguardText.textContent = `Move ${fmt(state.monthly.vanguardAmount)} to Vanguard now.`;
    monthlyVanguardFormWrap?.classList.remove('hidden');
    vanguardSteps.innerHTML = '';

    if (state.monthly.vanguardPlan) {
      const plan = state.monthly.vanguardPlan;
      monthlyVanguardSummary.innerHTML = [
        `<li><strong>Amount to invest this month:</strong> ${fmt(state.monthly.vanguardAmount)}</li>`,
        `<li>Settlement fund buy: <strong>${fmt(plan.buy.settlement)}</strong></li>`,
        `<li>VTSAX buy: <strong>${fmt(plan.buy.VTSAX)}</strong></li>`,
        `<li>VTIAX buy: <strong>${fmt(plan.buy.VTIAX)}</strong></li>`,
        `<li>VBTLX buy: <strong>${fmt(plan.buy.VBTLX)}</strong></li>`,
        `<li>VTABX buy: <strong>${fmt(plan.buy.VTABX)}</strong></li>`,
        `<li><strong>Total buys:</strong> ${fmt(plan.totalBuy)}</li>`,
      ].join('');

      monthlyVanguardActions.innerHTML = [
        'Open Vanguard and sign in.',
        'Go to Buy & Sell (or Transact).',
        `Buy settlement fund: ${fmt(plan.buy.settlement)}.`,
        `Buy VTSAX: ${fmt(plan.buy.VTSAX)}.`,
        `Buy VTIAX: ${fmt(plan.buy.VTIAX)}.`,
        `Buy VBTLX: ${fmt(plan.buy.VBTLX)}.`,
        `Buy VTABX: ${fmt(plan.buy.VTABX)}.`,
        'Review and submit orders.',
      ]
        .map((line) => `<li>${line}</li>`)
        .join('');
    } else {
      monthlyVanguardSummary.innerHTML = '';
      monthlyVanguardActions.innerHTML = '';
    }
  } else {
    vanguardText.textContent = 'No Vanguard move is needed this month. This is your final monthly step.';
    monthlyVanguardFormWrap?.classList.add('hidden');
    if (monthlyVanguardSummary) monthlyVanguardSummary.innerHTML = '';
    if (monthlyVanguardActions) monthlyVanguardActions.innerHTML = '';
    vanguardSteps.innerHTML = '<li>Review your work, then mark monthly workflow complete.</li>';
  }
}

function calculateMonthlyVanguardPlan(amountToInvest, current) {
  const weights = {
    VTSAX: 0.5,
    VTIAX: 0.3,
    VBTLX: 0.15,
    VTABX: 0.05,
  };

  const settlementNeed = Math.max(0, roundMoney(30000 - current.settlement));
  const buySettlement = roundMoney(Math.min(amountToInvest, settlementNeed));
  let remaining = roundMoney(amountToInvest - buySettlement);

  const currentCoreTotal = roundMoney(current.VTSAX + current.VTIAX + current.VBTLX + current.VTABX);
  const finalCoreTotal = roundMoney(currentCoreTotal + remaining);

  const target = {
    VTSAX: roundMoney(finalCoreTotal * weights.VTSAX),
    VTIAX: roundMoney(finalCoreTotal * weights.VTIAX),
    VBTLX: roundMoney(finalCoreTotal * weights.VBTLX),
    VTABX: roundMoney(finalCoreTotal * weights.VTABX),
  };

  const deficits = {
    VTSAX: Math.max(0, roundMoney(target.VTSAX - current.VTSAX)),
    VTIAX: Math.max(0, roundMoney(target.VTIAX - current.VTIAX)),
    VBTLX: Math.max(0, roundMoney(target.VBTLX - current.VBTLX)),
    VTABX: Math.max(0, roundMoney(target.VTABX - current.VTABX)),
  };

  const deficitSum = roundMoney(deficits.VTSAX + deficits.VTIAX + deficits.VBTLX + deficits.VTABX);

  let buy = { VTSAX: 0, VTIAX: 0, VBTLX: 0, VTABX: 0 };

  if (remaining > 0) {
    if (deficitSum > 0) {
      buy = {
        VTSAX: roundMoney((remaining * deficits.VTSAX) / deficitSum),
        VTIAX: roundMoney((remaining * deficits.VTIAX) / deficitSum),
        VBTLX: roundMoney((remaining * deficits.VBTLX) / deficitSum),
        VTABX: roundMoney((remaining * deficits.VTABX) / deficitSum),
      };
    } else {
      buy = {
        VTSAX: roundMoney(remaining * weights.VTSAX),
        VTIAX: roundMoney(remaining * weights.VTIAX),
        VBTLX: roundMoney(remaining * weights.VBTLX),
        VTABX: roundMoney(remaining * weights.VTABX),
      };
    }

    const sumCoreBuy = roundMoney(buy.VTSAX + buy.VTIAX + buy.VBTLX + buy.VTABX);
    const correction = roundMoney(remaining - sumCoreBuy);
    buy.VTSAX = roundMoney(buy.VTSAX + correction);
  }

  const totalBuy = roundMoney(buySettlement + buy.VTSAX + buy.VTIAX + buy.VBTLX + buy.VTABX);

  return {
    buy: {
      settlement: buySettlement,
      VTSAX: buy.VTSAX,
      VTIAX: buy.VTIAX,
      VBTLX: buy.VBTLX,
      VTABX: buy.VTABX,
    },
    totalBuy,
  };
}

function renderAlerts() {
  const alerts = buildAlerts();
  const urgentAlerts = alerts.filter((a) => a.level === 'Urgent' || a.level === 'Soon');
  const topAlerts = [...urgentAlerts];

  if (state.monthly.step > 1 && state.monthly.step < 5) {
    topAlerts.unshift({
      key: 'monthlyWorkflow',
      level: 'In Progress',
      text: 'Monthly Bills',
      when: `Step ${state.monthly.step} of 4`,
      tab: 'monthly',
      lastDone: state.monthly.completedAt ? new Date(state.monthly.completedAt).toLocaleDateString() : null,
    });
  }

  if (urgentAlertsList) {
    urgentAlertsList.innerHTML = topAlerts.length
      ? topAlerts.map((a) => renderAlertItem(a, true)).join('')
      : '<li class="muted">No urgent alerts right now.</li>';
  }

  alertsList.innerHTML = alerts.map((a) => renderAlertItem(a, false)).join('');
}

function renderAlertItem(a, compact = false) {
  const levelClass = toAlertLevelClass(a.level);
  const marker = getAlertMarker(a.level);
  const doneText = a.lastDone ? `<span class="alert-last-done">Last done: ${a.lastDone}</span>` : '<span class="alert-last-done">Last done: Not recorded</span>';
  const guideLabel = 'Get Started ✨';
  const guideButton = a.level === 'Done' ? '' : `<button class="alert-link" data-tab="${a.tab}" data-alert-key="${a.key}">${guideLabel}</button>`;
  return `<li class="alert-item ${levelClass}">
    <span class="alert-badge">${marker} ${a.level}</span>
    <span>${a.text}</span>
    <span class="alert-when">Due: ${a.when}</span>
    ${doneText}
    ${guideButton}
  </li>`;
}

function buildAlerts() {
  const now = new Date();
  const defs = [
    {
      key: 'monthlyWorkflow',
      name: 'Monthly Bills',
      tab: 'monthly',
      getDue: () => nextMonthlyDay(1),
      getNext: (date) => nextMonthlyDayFromDate(date, 1),
    },
    {
      key: 'mercury',
      name: 'Mercury insurance',
      tab: 'other',
      getDue: () => nextFixedDate([['02-01'], ['08-01']]),
      getNext: (date) => nextFixedDateFromDate(date, ['02-01', '08-01']),
    },
    {
      key: 'taxes',
      name: 'File Taxes',
      tab: 'taxes',
      getDue: () => nextAnnualDate('04-15'),
      getNext: (date) => nextAnnualDateFromDate(date, '04-15'),
    },
    {
      key: 'boardman',
      name: 'Boardman lawn care check',
      tab: 'other',
      getDue: () => endOfCurrentMonthOrNext(),
      getNext: (date) => endOfNextMonthFromDate(date),
    },
  ];

  const alerts = [];

  defs.forEach((def) => {
    const dueDate = def.getDue();
    const dueKey = toDateKey(dueDate);
    const completion = state.alerts?.[def.key];
    const lastDone = completion?.completedAt ? new Date(completion.completedAt).toLocaleDateString() : null;

    if (completion && completion.completedForDue === dueKey) {
      const completedAt = new Date(completion.completedAt);
      alerts.push({
        key: def.key,
        level: 'Done',
        text: `${def.name} completed`,
        when: `Due ${dueDate.toLocaleDateString()} • Done ${completedAt.toLocaleDateString()}`,
        days: -999,
        tab: def.tab,
        lastDone,
      });

      const nextDate = def.getNext(dueDate);
      const nextDays = diffDays(now, nextDate);
      alerts.push({
        key: def.key,
        level: getAlertLevel(nextDays),
        text: `${def.name} (next)`,
        when: `${nextDate.toLocaleDateString()} (${nextDays} day${nextDays === 1 ? '' : 's'})`,
        days: nextDays,
        tab: def.tab,
        lastDone,
      });
      return;
    }

    const days = diffDays(now, dueDate);
    alerts.push({
      key: def.key,
      level: getAlertLevel(days),
      text: def.name,
      when: `${dueDate.toLocaleDateString()} (${days} day${days === 1 ? '' : 's'})`,
      days,
      tab: def.tab,
      lastDone,
    });
  });

  return alerts.sort((a, b) => a.days - b.days).slice(0, 12);
}

function getAlertLevel(days) {
  if (days <= 0) return 'Urgent';
  if (days <= 14) return 'Soon';
  if (days <= 30) return 'Coming up';
  return 'Later';
}

function toAlertLevelClass(level) {
  if (level === 'In Progress') return 'alert-in-progress';
  if (level === 'Done') return 'alert-done';
  if (level === 'Urgent') return 'alert-urgent';
  if (level === 'Soon') return 'alert-soon';
  if (level === 'Coming up') return 'alert-coming-up';
  return 'alert-later';
}

function getAlertMarker(level) {
  if (level === 'In Progress') return '🔄';
  if (level === 'Done') return '✅';
  if (level === 'Urgent') return '⚠️';
  if (level === 'Soon') return '🔔';
  if (level === 'Coming up') return '🗓️';
  return '📌';
}

function markAlertCompleted(key) {
  const dueDate = getCurrentDueDateForAlert(key);
  if (!dueDate) return;

  state.alerts = state.alerts || {};
  state.alerts[key] = {
    completedAt: new Date().toISOString(),
    completedForDue: toDateKey(dueDate),
  };
  saveState();
}

function getCurrentDueDateForAlert(key) {
  if (key === 'monthlyWorkflow') return nextMonthlyDay(1);
  if (key === 'mercury') return nextFixedDate([['02-01'], ['08-01']]);
  if (key === 'taxes') return nextAnnualDate('04-15');
  if (key === 'boardman') return endOfCurrentMonthOrNext();
  return null;
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function nextMonthlyDayFromDate(date, day) {
  const base = new Date(date.getFullYear(), date.getMonth(), day);
  return new Date(base.getFullYear(), base.getMonth() + 1, day);
}

function nextAnnualDateFromDate(date, mmdd) {
  const [month, day] = mmdd.split('-').map(Number);
  return new Date(date.getFullYear() + 1, month - 1, day);
}

function nextFixedDateFromDate(date, mmddList) {
  const after = new Date(date);
  after.setDate(after.getDate() + 1);
  const year = after.getFullYear();

  const candidates = mmddList
    .map((mmdd) => {
      const [m, d] = mmdd.split('-').map(Number);
      const thisYear = new Date(year, m - 1, d);
      if (thisYear >= after) return thisYear;
      return new Date(year + 1, m - 1, d);
    })
    .sort((a, b) => a - b);

  return candidates[0];
}

function endOfNextMonthFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth() + 2, 0);
}

function updateNextAction() {
  nextAction.textContent = '';
}

function renderHistory() {
  renderMonthlyEntriesTables();

  if (!state.history.length) {
    historyList.innerHTML = '<li>No history yet.</li>';
    return;
  }

  historyList.innerHTML = state.history
    .slice()
    .reverse()
    .map((entry) => `<li><strong>${new Date(entry.time).toLocaleString()}</strong> — ${entry.type}: ${entry.details}</li>`)
    .join('');
}

function logEvent(type, details) {
  state.history.push({
    time: new Date().toISOString(),
    type,
    details,
  });
  saveState();
}

function resetMonthlyWorkflowForNewRun() {
  state.monthly.step = 1;
  state.monthly.checking = '';
  state.monthly.savings = '';
  state.monthly.citi = '';
  state.monthly.result = 0;
  state.monthly.citiConfirmation = '';
  state.monthly.needsVanguardTransfer = false;
  state.monthly.vanguardAmount = 0;
  state.monthly.vanguardCurrent = {
    settlement: '',
    VTSAX: '',
    VTIAX: '',
    VBTLX: '',
    VTABX: '',
  };
  state.monthly.vanguardPlan = null;
  state.monthly.stepRewards = {};
  state.monthly.lastRewardUrl = '';
  state.monthly.finalReward = null;
  state.monthly.completedAt = null;

  const idsToClear = [
    'checking',
    'savings',
    'citi',
    'citi-confirmation',
    'mv-settlement',
    'mv-vtsax',
    'mv-vtiax',
    'mv-vbtlx',
    'mv-vtabx',
  ];

  idsToClear.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const resultText = document.getElementById('monthly-result-text');
  const moveList = document.getElementById('monthly-move-list');
  const summary = document.getElementById('monthly-vanguard-summary');
  const actions = document.getElementById('monthly-vanguard-actions');
  const rewardCard = document.getElementById('monthly-step-reward');
  const rewardTitle = document.getElementById('monthly-step-reward-title');
  const rewardImage = document.getElementById('monthly-step-reward-image');
  const finalRewardImage = document.getElementById('monthly-final-reward-image');
  const finalRewardMessage = document.getElementById('monthly-final-reward-message');
  const completeScreen = document.getElementById('monthly-complete-screen');
  if (resultText) resultText.textContent = '';
  if (moveList) moveList.innerHTML = '';
  if (summary) summary.innerHTML = '';
  if (actions) actions.innerHTML = '';
  if (rewardCard) rewardCard.classList.add('hidden');
  if (rewardTitle) rewardTitle.textContent = 'Reward';
  if (rewardImage) rewardImage.classList.add('hidden');
  if (finalRewardImage) finalRewardImage.classList.add('hidden');
  if (finalRewardMessage) finalRewardMessage.textContent = '';
  if (completeScreen) completeScreen.classList.add('hidden');
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const base = {
    theme: 'aww',
    monthly: {
      step: 1,
      checking: '',
      savings: '',
      citi: '',
      result: 0,
      citiConfirmation: '',
      needsVanguardTransfer: false,
      vanguardAmount: 0,
      vanguardCurrent: {
        settlement: '',
        VTSAX: '',
        VTIAX: '',
        VBTLX: '',
        VTABX: '',
      },
      vanguardPlan: null,
      stepRewards: {},
      lastRewardUrl: '',
      finalReward: null,
      completedAt: null,
    },
    taxes: {
      completed: [],
    },
    otherBills: {
      boardman: { lastDoneAt: null },
      happylawns: { lastDoneAt: null, receivedAt: null },
      mercury: { lastDoneAt: null },
    },
    monthlyEntries: [],
    awwImage: null,
    awwFeed: null,
    themeImages: {},
    alerts: {},
    history: [],
  };

  if (!raw) return base;

  try {
    const saved = JSON.parse(raw);
    return {
      ...base,
      ...saved,
      monthly: { ...base.monthly, ...(saved.monthly || {}) },
      taxes: { ...base.taxes, ...(saved.taxes || {}) },
      otherBills: {
        ...base.otherBills,
        ...(saved.otherBills || {}),
        boardman: { ...base.otherBills.boardman, ...(saved.otherBills?.boardman || {}) },
        happylawns: { ...base.otherBills.happylawns, ...(saved.otherBills?.happylawns || {}) },
        mercury: { ...base.otherBills.mercury, ...(saved.otherBills?.mercury || {}) },
      },
      monthlyEntries: Array.isArray(saved.monthlyEntries) ? saved.monthlyEntries : [],
      themeImages: { ...base.themeImages, ...(saved.themeImages || {}) },
      alerts: { ...base.alerts, ...(saved.alerts || {}) },
      history: Array.isArray(saved.history) ? saved.history : [],
    };
  } catch {
    return base;
  }
}

function normalizeTheme(theme) {
  const valid = Object.keys(THEME_DEFINITIONS);
  return valid.includes(theme) ? theme : 'aww';
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showMessage(text, kind = 'success') {
  if (!appMessage || !appMessageText) return;

  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  appMessageText.textContent = text;
  appMessage.classList.remove('hidden', 'is-success', 'is-error');
  appMessage.classList.add(kind === 'error' ? 'is-error' : 'is-success');

  if (kind === 'success') {
    messageTimer = setTimeout(() => {
      hideMessage();
    }, 5000);
  }
}

function hideMessage() {
  if (!appMessage || !appMessageText) return;
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }
  appMessage.classList.add('hidden');
  appMessage.classList.remove('is-success', 'is-error');
  appMessageText.textContent = '';
}

function setupCurrencyFormatting() {
  const ids = [
    'checking',
    'savings',
    'citi',
    'mv-settlement',
    'mv-vtsax',
    'mv-vtiax',
    'mv-vbtlx',
    'mv-vtabx',
  ];

  ids
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach((input) => {
      input.addEventListener('focus', () => {
        const n = parseCurrency(input.value);
        if (!Number.isNaN(n)) {
          input.value = toPlainNumber(n);
        }
      });

      input.addEventListener('blur', () => {
        formatCurrencyInput(input);
      });

      formatCurrencyInput(input);
    });
}

function formatCurrencyInput(input) {
  const raw = (input.value || '').trim();
  if (!raw) {
    input.value = '';
    return;
  }

  const n = parseCurrency(raw);
  if (Number.isNaN(n)) return;
  input.value = fmt(n);
}

function parseCurrency(value) {
  if (typeof value !== 'string') return Number(value);
  const n = Number(value.replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function fmt(amount) {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function roundMoney(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function toPlainNumber(value) {
  if (value === '' || value === null || value === undefined) return '';
  return String(value);
}

function nextMonthlyDay(day) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), day);
  if (date < now) return new Date(now.getFullYear(), now.getMonth() + 1, day);
  return date;
}

function nextAnnualDate(mmdd) {
  const [month, day] = mmdd.split('-').map(Number);
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  return thisYear >= now ? thisYear : new Date(now.getFullYear() + 1, month - 1, day);
}

function nextFixedDate(mmddList) {
  const now = new Date();
  const candidates = mmddList.map(([mmdd]) => nextAnnualDate(mmdd));
  return candidates.sort((a, b) => a - b)[0];
}

function endOfCurrentMonthOrNext() {
  const now = new Date();
  const endThis = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  if (endThis >= now) return endThis;
  return new Date(now.getFullYear(), now.getMonth() + 2, 0);
}

function diffDays(from, to) {
  const ms = to.setHours(0, 0, 0, 0) - new Date(from).setHours(0, 0, 0, 0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
