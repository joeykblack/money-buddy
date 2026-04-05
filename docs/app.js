const STORAGE_KEY = 'moneyBuddyMvp';

const state = loadState();

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const alertsList = document.getElementById('alerts-list');
const historyList = document.getElementById('history-list');
const nextAction = document.getElementById('next-action');
const resumeMonthlyBtn = document.getElementById('resume-monthly');
const themeSelect = document.getElementById('theme-select');
const appMessage = document.getElementById('app-message');
const appMessageText = document.getElementById('app-message-text');
const appMessageClose = document.getElementById('app-message-close');

let messageTimer = null;

const monthlyStepEls = [
  document.getElementById('monthly-step-1'),
  document.getElementById('monthly-step-2'),
  document.getElementById('monthly-step-3'),
  document.getElementById('monthly-step-4'),
];

init();

function init() {
  bindTabs();
  bindMonthlyWalkthrough();
  bindOtherBills();
  bindTaxes();
  bindHistory();
  bindSettings();
  bindMessageBanner();
  setupCurrencyFormatting();

  applyTheme(state.theme || 'light');
  themeSelect.value = state.theme || 'light';

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

  resumeMonthlyBtn.addEventListener('click', () => {
    if (state.monthly.completedAt) {
      resetMonthlyWorkflowForNewRun();
      saveState();
      renderMonthlyStep();
      renderAlerts();
      updateNextAction();
    }
    activateTab('monthly');
  });
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
    markAlertCompleted('citi');
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

  completeBtn.addEventListener('click', () => {
    if (state.monthly.needsVanguardTransfer && state.monthly.vanguardAmount > 0 && !state.monthly.vanguardPlan) {
      showMessage('Please click “Calculate Exactly What to Buy” in Step 4 before completing the month.', 'error');
      return;
    }

    const today = new Date().toISOString();
    state.monthly.completedAt = today;
    state.monthly.step = 4;
    document.getElementById('reward').classList.remove('hidden');

    logEvent('Monthly workflow complete', `Completed monthly workflow on ${new Date(today).toLocaleString()}.`);
    saveState();
    renderHistory();
    renderAlerts();
    updateNextAction();
  });

}

function bindOtherBills() {
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
    btn.addEventListener('click', () => {
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

      saveState();
      renderOtherBills();
      showMessage('Saved to history. Nice work!', 'success');
      renderHistory();
    });
  });
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
    showMessage('Tax progress saved.', 'success');
  });
}

function bindHistory() {
  document.getElementById('clear-history').addEventListener('click', () => {
    const shouldClear = confirm('Clear all history on this device?');
    if (!shouldClear) return;

    state.history = [];
    saveState();
    renderHistory();
    showMessage('History cleared on this device.', 'success');
  });
}

function bindSettings() {
  themeSelect.addEventListener('change', () => {
    const value = themeSelect.value;
    applyTheme(value);
    state.theme = value;
    saveState();
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function renderMonthlyStep() {
  const step = state.monthly.step || 1;
  monthlyStepEls.forEach((el, i) => el.classList.toggle('hidden', i + 1 !== step));

  const progressText = document.getElementById('monthly-progress');
  const progressBar = document.getElementById('progress-bar');
  progressText.textContent = `Step ${step} of 4`;
  progressBar.style.width = `${Math.max(1, step) * 25}%`;

  renderVanguardLastStep();
  updateNextAction();
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
  alertsList.innerHTML = alerts
    .map((a) => {
      const levelClass = toAlertLevelClass(a.level);
      const marker = getAlertMarker(a.level);
      return `<li class="alert-item ${levelClass}"><span class="alert-badge">${marker} ${a.level}</span> <span>${a.text}</span> <span class="alert-when">${a.when}</span></li>`;
    })
    .join('');
}

function buildAlerts() {
  const now = new Date();
  const defs = [
    {
      key: 'citi',
      name: 'Citi payment due',
      tab: 'monthly',
      getDue: () => nextMonthlyDay(9),
      getNext: (date) => nextMonthlyDayFromDate(date, 9),
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
      name: 'Tax filing deadline',
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

    if (completion && completion.completedForDue === dueKey) {
      const completedAt = new Date(completion.completedAt);
      alerts.push({
        level: 'Done',
        text: `${def.name} completed`,
        when: `Due ${dueDate.toLocaleDateString()} • Done ${completedAt.toLocaleDateString()}`,
        days: -999,
        tab: def.tab,
      });

      const nextDate = def.getNext(dueDate);
      const nextDays = diffDays(now, nextDate);
      alerts.push({
        level: getAlertLevel(nextDays),
        text: `${def.name} (next)`,
        when: `${nextDate.toLocaleDateString()} (${nextDays} day${nextDays === 1 ? '' : 's'})`,
        days: nextDays,
        tab: def.tab,
      });
      return;
    }

    const days = diffDays(now, dueDate);
    alerts.push({
      level: getAlertLevel(days),
      text: def.name,
      when: `${dueDate.toLocaleDateString()} (${days} day${days === 1 ? '' : 's'})`,
      days,
      tab: def.tab,
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
  if (level === 'Done') return 'alert-done';
  if (level === 'Urgent') return 'alert-urgent';
  if (level === 'Soon') return 'alert-soon';
  if (level === 'Coming up') return 'alert-coming-up';
  return 'alert-later';
}

function getAlertMarker(level) {
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
  if (key === 'citi') return nextMonthlyDay(9);
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
  if (state.monthly.completedAt && state.monthly.step === 4) {
    nextAction.textContent = `Monthly walkthrough completed on ${new Date(state.monthly.completedAt).toLocaleDateString()}.`;
    resumeMonthlyBtn.textContent = 'Start Next Monthly Walkthrough';
    return;
  }

  if (state.monthly.step > 1) {
    nextAction.textContent = `Monthly walkthrough in progress: Step ${state.monthly.step} of 4.`;
    resumeMonthlyBtn.textContent = 'Continue Monthly Walkthrough';
    return;
  }

  const alerts = buildAlerts();
  const first = alerts.find((a) => a.level !== 'Done') || alerts[0];
  if (first) {
    nextAction.textContent = `${first.text} is next (${first.when}).`;
  } else {
    nextAction.textContent = 'No urgent alerts right now.';
  }
  resumeMonthlyBtn.textContent = 'Start Monthly Walkthrough';
}

function renderHistory() {
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
  const reward = document.getElementById('reward');
  if (resultText) resultText.textContent = '';
  if (moveList) moveList.innerHTML = '';
  if (summary) summary.innerHTML = '';
  if (actions) actions.innerHTML = '';
  if (reward) reward.classList.add('hidden');
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const base = {
    theme: 'light',
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
      alerts: { ...base.alerts, ...(saved.alerts || {}) },
      history: Array.isArray(saved.history) ? saved.history : [],
    };
  } catch {
    return base;
  }
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
