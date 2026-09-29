const TREE = {
  start: {
    q: 'tree.start.q',
    opts: [
      { icon: '🔌', text: 'tree.start.opt.no_start.text', sub: 'tree.start.opt.no_start.sub', next: 'no_start' },
      { icon: '📊', text: 'tree.start.opt.voltage_issue.text', sub: 'tree.start.opt.voltage_issue.sub', next: 'voltage_issue' },
      { icon: '⚡', text: 'tree.start.opt.speed_issue.text', sub: 'tree.start.opt.speed_issue.sub', next: 'speed_issue' },
      { icon: '🔊', text: 'tree.start.opt.noise_issue.text', sub: 'tree.start.opt.noise_issue.sub', next: 'noise_issue' },
      { icon: '🔗', text: 'tree.start.opt.connection_issue.text', sub: 'tree.start.opt.connection_issue.sub', next: 'connection_issue' },
      { icon: '🌡️', text: 'tree.start.opt.overheat.text', sub: 'tree.start.opt.overheat.sub', next: 'overheat' },
      { icon: '🔋', text: 'tree.start.opt.wireless_battery.text', sub: 'tree.start.opt.wireless_battery.sub', next: 'wireless_battery' },
    ],
  },
  no_start: {
    q: 'tree.no_start.q',
    opts: [
      { icon: '⚫', text: 'tree.no_start.opt.dead.text', next: 'no_start_dead' },
      { icon: '🟢', text: 'tree.no_start.opt.psu_ok.text', next: 'no_start_psu_ok' },
      {
        icon: '🔴',
        text: 'tree.no_start.opt.error_light.text',
        next: null,
        result: {
          level: 'service',
          icon: '⚠️',
          verdict: 'result.psu_error.verdict',
          sub: 'result.psu_error.sub',
          actions: [
            'result.psu_error.a1',
            'result.psu_error.a2',
            'result.psu_error.a3',
            'result.psu_error.a4',
          ],
        },
      },
    ],
  },
  no_start_dead: {
    q: 'tree.no_start_dead.q',
    opts: [
      {
        icon: '✅',
        text: 'tree.no_start_dead.opt.yes.text',
        next: null,
        result: {
          level: 'stop',
          icon: '🛑',
          verdict: 'result.psu_internal_fault.verdict',
          sub: 'result.psu_internal_fault.sub',
          actions: [
            'result.psu_internal_fault.a1',
            'result.psu_internal_fault.a2',
            'result.psu_internal_fault.a3',
            'result.psu_internal_fault.a4',
          ],
        },
      },
      {
        icon: '❌',
        text: 'tree.no_start_dead.opt.no.text',
        next: null,
        result: {
          level: 'ok',
          icon: '✅',
          verdict: 'result.connection_not_fault.verdict',
          sub: 'result.connection_not_fault.sub',
          actions: [
            'result.connection_not_fault.a1',
            'result.connection_not_fault.a2',
            'result.connection_not_fault.a3',
            'result.connection_not_fault.a4',
          ],
        },
      },
    ],
  },
  no_start_psu_ok: {
    q: 'tree.no_start_psu_ok.q',
    opts: [
      { icon: '🦶', text: 'tree.no_start_psu_ok.opt.yes.text', next: 'foot_pedal' },
      {
        icon: '🔌',
        text: 'tree.no_start_psu_ok.opt.no.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.check_rca_machine.verdict',
          sub: 'result.check_rca_machine.sub',
          actions: [
            'result.check_rca_machine.a1',
            'result.check_rca_machine.a2',
            'result.check_rca_machine.a3',
            'result.check_rca_machine.a4',
            'result.check_rca_machine.a5',
          ],
        },
      },
    ],
  },
  foot_pedal: {
    q: 'tree.foot_pedal.q',
    opts: [
      {
        icon: '✅',
        text: 'tree.foot_pedal.opt.yes.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.foot_pedal_fault.verdict',
          sub: 'result.foot_pedal_fault.sub',
          actions: [
            'result.foot_pedal_fault.a1',
            'result.foot_pedal_fault.a2',
            'result.foot_pedal_fault.a3',
            'result.foot_pedal_fault.a4',
          ],
        },
      },
      {
        icon: '❌',
        text: 'tree.foot_pedal.opt.no.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.machine_chain_fault.verdict',
          sub: 'result.machine_chain_fault.sub',
          actions: [
            'result.machine_chain_fault.a1',
            'result.machine_chain_fault.a2',
            'result.machine_chain_fault.a3',
            'result.machine_chain_fault.a4',
            'result.machine_chain_fault.a5',
          ],
        },
      },
    ],
  },
  voltage_issue: {
    q: 'tree.voltage_issue.q',
    opts: [
      {
        icon: '📈',
        text: 'tree.voltage_issue.opt.bouncing.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.psu_calibration.verdict',
          sub: 'result.psu_calibration.sub',
          actions: [
            'result.psu_calibration.a1',
            'result.psu_calibration.a2',
            'result.psu_calibration.a3',
            'result.psu_calibration.a4',
          ],
        },
      },
      { icon: '➡️', text: 'tree.voltage_issue.opt.steady.text', next: 'voltage_connection' },
    ],
  },
  voltage_connection: {
    q: 'tree.voltage_connection.q',
    opts: [
      {
        icon: '🔌',
        text: 'tree.voltage_connection.opt.loose.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.loose_rca.verdict',
          sub: 'result.loose_rca.sub',
          actions: [
            'result.loose_rca.a1',
            'result.loose_rca.a2',
            'result.loose_rca.a3',
            'result.loose_rca.a4',
          ],
        },
      },
      {
        icon: '✅',
        text: 'tree.voltage_connection.opt.secure.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.check_drive.verdict',
          sub: 'result.check_drive.sub',
          actions: [
            'result.check_drive.a1',
            'result.check_drive.a2',
            'result.check_drive.a3',
            'result.check_drive.a4',
            'result.check_drive.a5',
          ],
        },
      },
    ],
  },
  speed_issue: {
    q: 'tree.speed_issue.q',
    opts: [
      { icon: '🐇', text: 'tree.speed_issue.opt.faster.text', next: 'too_fast' },
      { icon: '🐢', text: 'tree.speed_issue.opt.slower.text', next: 'too_slow' },
    ],
  },
  too_fast: {
    q: 'tree.too_fast.q',
    opts: [
      {
        icon: '🖊️',
        text: 'tree.too_fast.opt.rotary.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.rotary_fast.verdict',
          sub: 'result.rotary_fast.sub',
          actions: [
            'result.rotary_fast.a1',
            'result.rotary_fast.a2',
            'result.rotary_fast.a3',
            'result.rotary_fast.a4',
            'result.rotary_fast.a5',
          ],
        },
      },
      {
        icon: '⚡',
        text: 'tree.too_fast.opt.coil.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.coil_fast.verdict',
          sub: 'result.coil_fast.sub',
          actions: [
            'result.coil_fast.a1',
            'result.coil_fast.a2',
            'result.coil_fast.a3',
            'result.coil_fast.a4',
            'result.coil_fast.a5',
          ],
        },
      },
    ],
  },
  too_slow: {
    q: 'tree.too_slow.q',
    opts: [
      {
        icon: '🖊️',
        text: 'tree.too_slow.opt.rotary.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.rotary_slow.verdict',
          sub: 'result.rotary_slow.sub',
          actions: [
            'result.rotary_slow.a1',
            'result.rotary_slow.a2',
            'result.rotary_slow.a3',
            'result.rotary_slow.a4',
            'result.rotary_slow.a5',
          ],
        },
      },
      {
        icon: '⚡',
        text: 'tree.too_slow.opt.coil.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.coil_slow.verdict',
          sub: 'result.coil_slow.sub',
          actions: [
            'result.coil_slow.a1',
            'result.coil_slow.a2',
            'result.coil_slow.a3',
            'result.coil_slow.a4',
            'result.coil_slow.a5',
          ],
        },
      },
    ],
  },
  noise_issue: {
    q: 'tree.noise_issue.q',
    opts: [
      {
        icon: '🔩',
        text: 'tree.noise_issue.opt.rattle.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.rattle.verdict',
          sub: 'result.rattle.sub',
          actions: [
            'result.rattle.a1',
            'result.rattle.a2',
            'result.rattle.a3',
            'result.rattle.a4',
            'result.rattle.a5',
          ],
        },
      },
      {
        icon: '⚙️',
        text: 'tree.noise_issue.opt.grinding.text',
        next: null,
        result: {
          level: 'stop',
          icon: '🛑',
          verdict: 'result.grinding.verdict',
          sub: 'result.grinding.sub',
          actions: [
            'result.grinding.a1',
            'result.grinding.a2',
            'result.grinding.a3',
            'result.grinding.a4',
          ],
        },
      },
      {
        icon: '📢',
        text: 'tree.noise_issue.opt.buzz.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.buzz.verdict',
          sub: 'result.buzz.sub',
          actions: [
            'result.buzz.a1',
            'result.buzz.a2',
            'result.buzz.a3',
            'result.buzz.a4',
          ],
        },
      },
      {
        icon: '🎵',
        text: 'tree.noise_issue.opt.whine.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.whine.verdict',
          sub: 'result.whine.sub',
          actions: [
            'result.whine.a1',
            'result.whine.a2',
            'result.whine.a3',
            'result.whine.a4',
          ],
        },
      },
    ],
  },
  connection_issue: {
    q: 'tree.connection_issue.q',
    opts: [
      {
        icon: '🔁',
        text: 'tree.connection_issue.opt.all.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.socket_fault.verdict',
          sub: 'result.socket_fault.sub',
          actions: [
            'result.socket_fault.a1',
            'result.socket_fault.a2',
            'result.socket_fault.a3',
            'result.socket_fault.a4',
          ],
        },
      },
      {
        icon: '1️⃣',
        text: 'tree.connection_issue.opt.one.text',
        next: null,
        result: {
          level: 'ok',
          icon: '✅',
          verdict: 'result.cable_fault.verdict',
          sub: 'result.cable_fault.sub',
          actions: [
            'result.cable_fault.a1',
            'result.cable_fault.a2',
            'result.cable_fault.a3',
            'result.cable_fault.a4',
          ],
        },
      },
      {
        icon: '❓',
        text: 'tree.connection_issue.opt.unsure.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.test_known_cable.verdict',
          sub: 'result.test_known_cable.sub',
          actions: [
            'result.test_known_cable.a1',
            'result.test_known_cable.a2',
            'result.test_known_cable.a3',
            'result.test_known_cable.a4',
          ],
        },
      },
    ],
  },
  overheat: {
    q: 'tree.overheat.q',
    opts: [
      {
        icon: '⏱️',
        text: 'tree.overheat.opt.fast.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.overheat_fast.verdict',
          sub: 'result.overheat_fast.sub',
          actions: [
            'result.overheat_fast.a1',
            'result.overheat_fast.a2',
            'result.overheat_fast.a3',
            'result.overheat_fast.a4',
            'result.overheat_fast.a5',
          ],
        },
      },
      {
        icon: '🕐',
        text: 'tree.overheat.opt.normal.text',
        next: null,
        result: {
          level: 'ok',
          icon: '✅',
          verdict: 'result.overheat_normal.verdict',
          sub: 'result.overheat_normal.sub',
          actions: [
            'result.overheat_normal.a1',
            'result.overheat_normal.a2',
            'result.overheat_normal.a3',
            'result.overheat_normal.a4',
          ],
        },
      },
    ],
  },
  wireless_battery: {
    q: 'tree.wb.q',
    opts: [
      { icon: '⚙️', text: 'tree.wb.opt.torque.text', sub: 'tree.wb.opt.torque.sub', next: 'wb_jumpstart' },
      { icon: '🔌', text: 'tree.wb.opt.power.text', sub: 'tree.wb.opt.power.sub', next: 'wb_sleep' },
      { icon: '📶', text: 'tree.wb.opt.rf.text', sub: 'tree.wb.opt.rf.sub', next: 'wb_rf' },
      { icon: '📉', text: 'tree.wb.opt.sag.text', sub: 'tree.wb.opt.sag.sub', next: 'wb_load' },
    ],
  },
  wb_jumpstart: {
    q: 'tree.wb_jumpstart.q',
    opts: [
      {
        icon: '🔄',
        text: 'tree.wb_jumpstart.opt.membrane.text',
        next: null,
        result: {
          level: 'service',
          icon: '⚡',
          verdict: 'result.wb_jumpstart_membrane.verdict',
          sub: 'result.wb_jumpstart_membrane.sub',
          actions: [
            'result.wb_jumpstart_membrane.a1',
            'result.wb_jumpstart_membrane.a2',
            'result.wb_jumpstart_membrane.a3',
            'result.wb_jumpstart_membrane.a4',
          ],
        },
      },
      {
        icon: '🛑',
        text: 'tree.wb_jumpstart.opt.seized.text',
        next: null,
        result: {
          level: 'stop',
          icon: '🔧',
          verdict: 'result.wb_motor_internal.verdict',
          sub: 'result.wb_motor_internal.sub',
          actions: [
            'result.wb_motor_internal.a1',
            'result.wb_motor_internal.a2',
            'result.wb_motor_internal.a3',
            'result.wb_motor_internal.a4',
          ],
        },
      },
    ],
  },
  wb_sleep: {
    q: 'tree.wb_sleep.q',
    opts: [
      {
        icon: '🔋',
        text: 'tree.wb_sleep.opt.recharges.text',
        next: null,
        result: {
          level: 'ok',
          icon: '✅',
          verdict: 'result.wb_cell_cutoff.verdict',
          sub: 'result.wb_cell_cutoff.sub',
          actions: [
            'result.wb_cell_cutoff.a1',
            'result.wb_cell_cutoff.a2',
            'result.wb_cell_cutoff.a3',
            'result.wb_cell_cutoff.a4',
          ],
        },
      },
      {
        icon: '⚠️',
        text: 'tree.wb_sleep.opt.wake.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔄',
          verdict: 'result.wb_dead_cell.verdict',
          sub: 'result.wb_dead_cell.sub',
          actions: [
            'result.wb_dead_cell.a1',
            'result.wb_dead_cell.a2',
            'result.wb_dead_cell.a3',
            'result.wb_dead_cell.a4',
          ],
        },
      },
      {
        icon: '🔥',
        text: 'tree.wb_sleep.opt.no_charge.text',
        next: null,
        result: {
          level: 'stop',
          icon: '🛑',
          verdict: 'result.wb_charge_fault.verdict',
          sub: 'result.wb_charge_fault.sub',
          actions: [
            'result.wb_charge_fault.a1',
            'result.wb_charge_fault.a2',
            'result.wb_charge_fault.a3',
            'result.wb_charge_fault.a4',
          ],
        },
      },
    ],
  },
  wb_rf: {
    q: 'tree.wb_rf.q',
    opts: [
      {
        icon: '📶',
        text: 'tree.wb_rf.opt.near.text',
        next: null,
        result: {
          level: 'check',
          icon: '🔍',
          verdict: 'result.wb_rf_range.verdict',
          sub: 'result.wb_rf_range.sub',
          actions: [
            'result.wb_rf_range.a1',
            'result.wb_rf_range.a2',
            'result.wb_rf_range.a3',
            'result.wb_rf_range.a4',
          ],
        },
      },
      {
        icon: '🔗',
        text: 'tree.wb_rf.opt.none.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔧',
          verdict: 'result.wb_rf_pairing.verdict',
          sub: 'result.wb_rf_pairing.sub',
          actions: [
            'result.wb_rf_pairing.a1',
            'result.wb_rf_pairing.a2',
            'result.wb_rf_pairing.a3',
            'result.wb_rf_pairing.a4',
          ],
        },
      },
    ],
  },
  wb_load: {
    q: 'tree.wb_load.q',
    opts: [
      {
        icon: '📉',
        text: 'tree.wb_load.opt.voltage_drop.text',
        next: null,
        result: {
          level: 'service',
          icon: '🔍',
          verdict: 'result.wb_internal_res.verdict',
          sub: 'result.wb_internal_res.sub',
          actions: [
            'result.wb_internal_res.a1',
            'result.wb_internal_res.a2',
            'result.wb_internal_res.a3',
            'result.wb_internal_res.a4',
          ],
        },
      },
      {
        icon: '🛑',
        text: 'tree.wb_load.opt.overload_shut.text',
        next: null,
        result: {
          level: 'stop',
          icon: '⚠️',
          verdict: 'result.wb_overload_prot.verdict',
          sub: 'result.wb_overload_prot.sub',
          actions: [
            'result.wb_overload_prot.a1',
            'result.wb_overload_prot.a2',
            'result.wb_overload_prot.a3',
            'result.wb_overload_prot.a4',
          ],
        },
      },
    ],
  },
};

const wizard = document.getElementById('wizard');
let stack = [];
let pathHistory = [];
let currentNodeId = 'start';
let currentResult = null;

function getTranslateFn() {
  if (typeof window !== 'undefined' && window.i18n && typeof window.i18n.t === 'function') {
    return window.i18n.t;
  }
  return (k) => k;
}

function depth() {
  const counts = {};
  function count(id, d) {
    if (!TREE[id]) return;
    counts[id] = d;
    TREE[id].opts.forEach((o) => {
      if (o.next && !counts[o.next]) count(o.next, d + 1);
    });
  }
  count('start', 0);
  return counts;
}
const DEPTHS = depth();
const MAX_DEPTH = Math.max(...Object.values(DEPTHS));

function render(nodeId) {
  currentNodeId = nodeId;
  currentResult = null;
  const t = getTranslateFn();
  const node = TREE[nodeId];
  if (!node) return;

  const d = DEPTHS[nodeId] || 0;
  const pct = Math.round((d / (MAX_DEPTH + 1)) * 100);

  const stepLabel = t('nav.step_label', { step: d + 1, total: MAX_DEPTH + 2 });
  const backLabel = t('nav.back');
  const meterLabel = t('wizard.multimeter_label');
  const meterHint = t('wizard.multimeter_hint');

  const html = `
    <div class="progress-wrap" id="progress-wrap">
      <div class="progress-label" id="progress-label">${stepLabel}</div>
      <div class="progress-bar" id="progress-bar"><div class="progress-fill" id="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="step-card" id="step-card">
      <div class="step-question" id="step-question">${t(node.q)}</div>

      <div class="multimeter-check-wrap" id="multimeter-check-wrap">
        <label class="multimeter-toggle-label" for="multimeter-confirmed-cb">
          <input type="checkbox" id="multimeter-confirmed-cb" class="multimeter-cb">
          <span class="multimeter-switch" aria-hidden="true"></span>
          <span class="multimeter-desc-wrap">
            <span class="multimeter-label-text">${meterLabel}</span>
            <span class="multimeter-hint-text">${meterHint}</span>
          </span>
        </label>
      </div>

      <div class="step-options" id="step-options">
        ${node.opts
          .map(
            (o, i) => `
          <button class="opt-btn" id="opt-btn-${i}" data-idx="${i}">
            <span class="opt-icon" aria-hidden="true">${o.icon}</span>
            <span class="opt-text">${t(o.text)}${o.sub ? `<span class="opt-sub">${t(o.sub)}</span>` : ''}</span>
          </button>`
          )
          .join('')}
      </div>
    </div>
    ${stack.length > 0 ? `<button class="back-btn" id="back-btn">${backLabel}</button>` : ''}`;
  wizard.innerHTML = html;

  wizard.querySelectorAll('.opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const opt = node.opts[parseInt(btn.dataset.idx, 10)];
      const cb = wizard.querySelector('#multimeter-confirmed-cb');
      const isMeterConfirmed = cb ? cb.checked : false;
      pathHistory.push({
        question: node.q,
        choice: opt.text,
        meterConfirmed: isMeterConfirmed
      });
      if (opt.result) {
        showResult(opt.result);
        return;
      }
      if (opt.next) {
        stack.push(nodeId);
        render(opt.next);
      }
    });
  });

  const backBtn = wizard.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      pathHistory.pop();
      render(stack.pop());
    });
  }
}

function showResult(r, customPath = null) {
  currentResult = r;
  const t = getTranslateFn();
  const actionsTitle = t('results.actions_title');
  const restartLabel = t('nav.restart');
  const printLabel = t('ticket.print_btn');
  const logbookLabel = t('logbook.link_btn');
  const ticketHeader = t('ticket.header');
  const dateLabel = t('ticket.date_label');
  const pathLabel = t('ticket.path_label');
  const techNotesLabel = t('ticket.tech_notes');
  const techSigLabel = t('ticket.tech_sig');

  // Format local date per Ban 19 (never UTC toISOString)
  const now = new Date();
  const localDateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const currentPath = customPath || pathHistory;
  const isBenchConfirmed = currentPath && currentPath.length > 0 && currentPath.every((step) => step.meterConfirmed);

  const meterBadgeYes = t('ticket.meter_badge_yes');
  const meterBadgeNo = t('ticket.meter_badge_no');
  const confTitle = isBenchConfirmed ? t('verdict.confidence_confirmed_title') : t('verdict.confidence_limited_title');
  const confDesc = isBenchConfirmed ? t('verdict.confidence_confirmed_desc') : t('verdict.confidence_limited_desc');
  const confTag = isBenchConfirmed ? meterBadgeYes : meterBadgeNo;

  let trailHtml = '';
  if (currentPath && currentPath.length > 0) {
    trailHtml = `
      <div class="diagnosis-trail" id="diagnosis-trail">
        <div class="diagnosis-trail-title">${pathLabel}</div>
        <ul class="trail-steps" id="trail-steps">
          ${currentPath.map((step) => `
            <li class="trail-step">
              <span class="trail-step-text">${t(step.choice)}</span>
              <span class="trail-meter-badge ${step.meterConfirmed ? 'badge-meter-yes' : 'badge-meter-no'}">
                ${step.meterConfirmed ? `✓ ${meterBadgeYes}` : `👁️ ${meterBadgeNo}`}
              </span>
            </li>`).join('')}
        </ul>
      </div>`;
  }

  const isEscalation = r.level === 'stop' || r.level === 'service';
  const escalationBannerHtml = isEscalation ? `
    <div class="escalation-quick-banner level-${r.level}" id="escalation-quick-banner">
      <span class="escalation-quick-icon" aria-hidden="true">${r.level === 'stop' ? '🛑' : '⚠️'}</span>
      <span class="escalation-quick-text">${t('escalation.view_summary_link')}</span>
      <button type="button" class="escalation-quick-btn" id="escalation-quick-btn">${t('nav.tab_escalation')}</button>
    </div>` : '';

  wizard.innerHTML = `
    <!-- Print-only Ticket Header -->
    <div class="ticket-header-print" id="ticket-header-print">
      <div class="ticket-header-title">${ticketHeader}</div>
      <div class="ticket-meta">
        <span>${dateLabel}: <strong>${localDateStr}</strong></span>
        <span>Poli International Machine Diagnostics</span>
      </div>
    </div>

    <div class="result-card" id="result-card">
      <div class="result-banner level-${r.level}" id="result-banner">
        <span class="result-icon" aria-hidden="true">${r.icon}</span>
        <div>
          <div class="result-verdict level-${r.level}" id="result-verdict">${t(r.verdict)}</div>
          <div class="result-sub" id="result-sub">${t(r.sub)}</div>
        </div>
      </div>

      <div class="result-section" id="result-actions-section">
        <!-- Confidence-Limited vs Bench-Confirmed Badge Card -->
        <div class="confidence-badge-card ${isBenchConfirmed ? 'status-confirmed' : 'status-limited'}" id="confidence-badge-card">
          <div class="confidence-badge-header">
            <span class="confidence-badge-icon" aria-hidden="true">${isBenchConfirmed ? '🔬' : '⚠️'}</span>
            <span class="confidence-badge-title">${confTitle}</span>
            <span class="confidence-badge-tag">${confTag}</span>
          </div>
          <p class="confidence-badge-desc">${confDesc}</p>
        </div>

        ${trailHtml}
        <div class="result-section-title" id="result-actions-title">${actionsTitle}</div>
        <ul class="action-list" id="action-list">${r.actions.map((a) => `<li>${t(a)}</li>`).join('')}</ul>

        ${escalationBannerHtml}

        <!-- Print-only Bench Sign-off block -->
        <div class="tech-signoff-box" id="tech-signoff-box">
          <div class="tech-signoff-title">${techNotesLabel}</div>
          <div class="tech-notes-area"></div>
          <div class="tech-signoff-grid">
            <div class="tech-field"><span>Technician:</span></div>
            <div class="tech-field"><span>${techSigLabel}:</span></div>
            <div class="tech-field"><span>Machine Model / S/N:</span></div>
            <div class="tech-field"><span>${t('ticket.confidence_label')}: ${confTag}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ticket-actions-row" id="ticket-actions-row">
      <button type="button" class="ticket-btn" id="print-ticket-btn">
        <span aria-hidden="true">🖨️</span>
        <span>${printLabel}</span>
      </button>
      <a href="https://poliinternational.com/machine-maintenance-logbook/" target="_top" class="logbook-btn" id="logbook-link" rel="noopener noreferrer">
        <span aria-hidden="true">📋</span>
        <span>${logbookLabel}</span>
      </a>
      <button type="button" class="restart-btn" id="restart-btn">${restartLabel}</button>
    </div>`;

  const printBtn = wizard.querySelector('#print-ticket-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const restartBtn = wizard.querySelector('#restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      stack = [];
      pathHistory = [];
      currentResult = null;
      render('start');
    });
  }

  const escQuickBtn = wizard.querySelector('#escalation-quick-btn');
  if (escQuickBtn) {
    escQuickBtn.addEventListener('click', () => {
      switchTab('escalation');
    });
  }
}

// -----------------------------------------------------------------------------
// Tab Navigation Management
// -----------------------------------------------------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll('.tool-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Stop any synthesised audio when switching tabs
      stopAllAudio();

      tabButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach((p) => {
        const matches = p.id === 'view-' + targetTab;
        if (matches) {
          p.removeAttribute('hidden');
          p.classList.add('active');
        } else {
          p.setAttribute('hidden', '');
          p.classList.remove('active');
        }
      });
    });
  });
}

function switchTab(tabName) {
  const btn = document.querySelector(`.tool-tab[data-tab="${tabName}"]`);
  if (btn) btn.click();
}

// -----------------------------------------------------------------------------
// Bench Multimeter & Voltage-Drop Calculator
// -----------------------------------------------------------------------------
function initCalculator() {
  // 1. Duty Cycle
  const dutyClosure = document.getElementById('duty-closure-input');
  const dutyPeriod = document.getElementById('duty-period-input');
  const dutyResultVal = document.getElementById('duty-result-val');
  const dutyFormulaVal = document.getElementById('duty-formula-val');

  function updateDuty() {
    if (!dutyClosure || !dutyPeriod || !dutyResultVal || !dutyFormulaVal) return;
    const closure = parseFloat(dutyClosure.value);
    const period = parseFloat(dutyPeriod.value);
    if (isNaN(closure) || isNaN(period) || period <= 0) {
      dutyResultVal.textContent = '—';
      dutyFormulaVal.textContent = '—';
      return;
    }
    const duty = (closure / period) * 100;
    dutyResultVal.textContent = `${duty.toFixed(1)}%`;
    dutyFormulaVal.textContent = `Duty Cycle (%) = (${closure.toFixed(1)} ms / ${period.toFixed(1)} ms) × 100 = ${duty.toFixed(2)}%`;
  }

  if (dutyClosure && dutyPeriod) {
    dutyClosure.addEventListener('input', updateDuty);
    dutyPeriod.addEventListener('input', updateDuty);
    updateDuty();
  }

  // 2. Speed / Frequency
  const speedPeriod = document.getElementById('speed-period-input');
  const speedResultVal = document.getElementById('speed-result-val');
  const speedFormulaVal = document.getElementById('speed-formula-val');

  function updateSpeed() {
    if (!speedPeriod || !speedResultVal || !speedFormulaVal) return;
    const period = parseFloat(speedPeriod.value);
    if (isNaN(period) || period <= 0) {
      speedResultVal.textContent = '—';
      speedFormulaVal.textContent = '—';
      return;
    }
    const hz = 1000 / period;
    speedResultVal.textContent = `${hz.toFixed(1)} Hz`;
    speedFormulaVal.textContent = `Speed (Hz) = 1000 / ${period.toFixed(1)} ms = ${hz.toFixed(2)} Hz`;
  }

  if (speedPeriod) {
    speedPeriod.addEventListener('input', updateSpeed);
    updateSpeed();
  }

  // 3. Clip-cord Voltage Drop
  const gaugeSelect = document.getElementById('vdrop-gauge-select');
  const lengthInput = document.getElementById('vdrop-length-input');
  const currentInput = document.getElementById('vdrop-current-input');
  const psuInput = document.getElementById('vdrop-psu-input');
  const resVal = document.getElementById('vdrop-res-val');
  const dropVal = document.getElementById('vdrop-drop-val');
  const loadVal = document.getElementById('vdrop-load-val');
  const formulaVal = document.getElementById('vdrop-formula-val');

  function updateVoltageDrop() {
    if (!gaugeSelect || !lengthInput || !currentInput || !psuInput || !resVal || !dropVal || !loadVal || !formulaVal) return;
    const rPerFt = parseFloat(gaugeSelect.value);
    const length = parseFloat(lengthInput.value);
    const current = parseFloat(currentInput.value);
    const psuV = parseFloat(psuInput.value);

    if (isNaN(rPerFt) || isNaN(length) || isNaN(current) || isNaN(psuV) || length <= 0) {
      resVal.textContent = '—';
      dropVal.textContent = '—';
      loadVal.textContent = '—';
      formulaVal.textContent = '—';
      return;
    }

    const roundTripR = 2 * length * rPerFt;
    const vDrop = current * roundTripR;
    const vMachine = Math.max(0, psuV - vDrop);

    resVal.textContent = `${roundTripR.toFixed(4)} Ω`;
    dropVal.textContent = `${vDrop.toFixed(3)} V`;
    loadVal.textContent = `${vMachine.toFixed(3)} V`;
    formulaVal.textContent = `Resistance = 2 × ${length.toFixed(1)} ft × ${rPerFt} Ω/ft = ${roundTripR.toFixed(4)} Ω; Voltage Drop = ${current.toFixed(2)} A × ${roundTripR.toFixed(4)} Ω = ${vDrop.toFixed(3)} V; Machine Voltage = ${psuV.toFixed(2)} V - ${vDrop.toFixed(3)} V = ${vMachine.toFixed(3)} V`;
  }

  if (gaugeSelect && lengthInput && currentInput && psuInput) {
    gaugeSelect.addEventListener('change', updateVoltageDrop);
    lengthInput.addEventListener('input', updateVoltageDrop);
    currentInput.addEventListener('input', updateVoltageDrop);
    psuInput.addEventListener('input', updateVoltageDrop);
    updateVoltageDrop();
  }
}

// -----------------------------------------------------------------------------
// Synthesised Audio Diagnosis Library (Web Audio API)
// Pure oscillator & noise generation; zero external assets.
// -----------------------------------------------------------------------------
let audioCtx = null;
let currentSoundId = null;
let activeAudioNodes = [];
let audioAutoStopTimer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function stopAllAudio() {
  if (audioAutoStopTimer) {
    clearTimeout(audioAutoStopTimer);
    audioAutoStopTimer = null;
  }
  activeAudioNodes.forEach((node) => {
    try {
      if (typeof node.stop === 'function') node.stop();
      if (typeof node.disconnect === 'function') node.disconnect();
    } catch (_) {}
  });
  activeAudioNodes = [];
  currentSoundId = null;

  const t = getTranslateFn();
  document.querySelectorAll('.audio-btn').forEach((btn) => {
    btn.classList.remove('playing');
    const textSpan = btn.querySelector('.btn-play-text');
    const iconSpan = btn.querySelector('.btn-play-icon');
    if (textSpan) textSpan.textContent = t('audio.play');
    if (iconSpan) iconSpan.textContent = '▶';
  });
}

function playSynthesisedSound(soundId, buttonEl) {
  if (currentSoundId === soundId) {
    stopAllAudio();
    return;
  }

  stopAllAudio();
  const ctx = getAudioContext();
  if (!ctx) return;

  currentSoundId = soundId;
  const t = getTranslateFn();

  buttonEl.classList.add('playing');
  const textSpan = buttonEl.querySelector('.btn-play-text');
  const iconSpan = buttonEl.querySelector('.btn-play-icon');
  if (textSpan) textSpan.textContent = t('audio.stop');
  if (iconSpan) iconSpan.textContent = '■';

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
  masterGain.connect(ctx.destination);
  activeAudioNodes.push(masterGain);

  if (soundId === 'coil_hum') {
    // Steady coil hum with lowpass filter
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    osc.connect(filter);
    filter.connect(masterGain);
    osc.start();
    activeAudioNodes.push(osc, filter);
  } else if (soundId === 'chatter') {
    // Sputtering hum with flutter and intermittent dropouts
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(125, ctx.currentTime);

    const tremolo = ctx.createOscillator();
    tremolo.type = 'square';
    tremolo.frequency.setValueAtTime(22, ctx.currentTime);

    const tremoloGain = ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.4, ctx.currentTime);

    const vca = ctx.createGain();
    vca.gain.setValueAtTime(0.5, ctx.currentTime);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(vca.gain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    osc.connect(vca);
    vca.connect(filter);
    filter.connect(masterGain);

    osc.start();
    tremolo.start();
    activeAudioNodes.push(osc, tremolo, tremoloGain, vca, filter);
  } else if (soundId === 'arcing') {
    // Irregular crackle and noise bursts
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1 : 0.1);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const carrier = ctx.createOscillator();
    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(110, ctx.currentTime);

    const carrierGain = ctx.createGain();
    carrierGain.gain.setValueAtTime(0.3, ctx.currentTime);

    carrier.connect(carrierGain);
    carrierGain.connect(masterGain);

    whiteNoise.connect(filter);
    filter.connect(masterGain);

    whiteNoise.start();
    carrier.start();
    activeAudioNodes.push(whiteNoise, carrier, filter, carrierGain);
  } else if (soundId === 'bearing') {
    // Rotary motor tone + friction whine modulated with wobble
    const motor = ctx.createOscillator();
    motor.type = 'sine';
    motor.frequency.setValueAtTime(95, ctx.currentTime);

    const screech = ctx.createOscillator();
    screech.type = 'triangle';
    screech.frequency.setValueAtTime(2600, ctx.currentTime);

    const wobble = ctx.createOscillator();
    wobble.type = 'sine';
    wobble.frequency.setValueAtTime(16, ctx.currentTime);

    const wobbleGain = ctx.createGain();
    wobbleGain.gain.setValueAtTime(300, ctx.currentTime);

    wobble.connect(wobbleGain);
    wobbleGain.connect(screech.frequency);

    const screechGain = ctx.createGain();
    screechGain.gain.setValueAtTime(0.12, ctx.currentTime);
    screech.connect(screechGain);

    const motorGain = ctx.createGain();
    motorGain.gain.setValueAtTime(0.4, ctx.currentTime);
    motor.connect(motorGain);

    motorGain.connect(masterGain);
    screechGain.connect(masterGain);

    motor.start();
    screech.start();
    wobble.start();
    activeAudioNodes.push(motor, screech, wobble, wobbleGain, screechGain, motorGain);
  }

  // Safety auto-stop after 6 seconds
  audioAutoStopTimer = setTimeout(() => {
    stopAllAudio();
  }, 6000);
}

function initAudioLibrary() {
  document.querySelectorAll('.audio-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const soundId = btn.getAttribute('data-sound');
      playSynthesisedSound(soundId, btn);
    });
  });
}

// -----------------------------------------------------------------------------
// Searchable Symptom & Error Code Index
// -----------------------------------------------------------------------------
const SEARCH_INDEX = [
  // Common Error Codes mapped to diagnostic endpoints
  {
    code: 'E-1 / E-01',
    keywords: 'e-1 e-01 e1 err error short overload trip shutdown protect ammeter',
    nodeId: 'psu_error',
    resultKey: 'result.psu_error',
  },
  {
    code: 'OVERLOAD / HIGH CURRENT',
    keywords: 'overload current high trip bms protect shutdown short coils heat draw',
    nodeId: 'wb_load',
    resultKey: 'result.wb_overload_prot',
  },
  {
    code: 'MOTOR STALL / BIND',
    keywords: 'stall motor seized swashplate cam membrane torque resistance jumpstart',
    nodeId: 'wb_jumpstart',
    resultKey: 'result.wb_jumpstart_membrane',
  },
  {
    code: 'SLEEP / CUT-OFF',
    keywords: 'sleep cutoff battery charge dead wake bms lithium 3.7v 4.2v usb-c',
    nodeId: 'wb_sleep',
    resultKey: 'result.wb_cell_cutoff',
  },
  {
    code: 'RF / PAIRING',
    keywords: 'rf pedal wireless pairing sync unpair bluetooth footswitch switch contact',
    nodeId: 'wb_rf',
    resultKey: 'result.wb_rf_pairing',
  },
  {
    code: 'VOLTAGE DROP / SAG',
    keywords: 'voltage drop sag gauge resistance awg cord length clip-cord internal cell',
    nodeId: 'voltage_issue',
    resultKey: 'result.wb_internal_res',
  },
  {
    code: 'CHATTER / SPUTTER',
    keywords: 'chatter bounce spark contact screw spring fatigue intermittent flutter',
    nodeId: 'speed_erratic',
    resultKey: 'result.spring_fatigue',
  },
  {
    code: 'ARCING / CRACKLE',
    keywords: 'arcing capacitor burnt smell crackle smoke spark capacitor breakdown',
    nodeId: 'noise_arc',
    resultKey: 'result.capacitor_failing',
  },
];

function initSearch() {
  const searchInput = document.getElementById('symptom-search');
  const clearBtn = document.getElementById('search-clear-btn');
  const resultsContainer = document.getElementById('search-results');

  if (!searchInput || !clearBtn || !resultsContainer) return;

  function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q || q.length < 2) {
      clearBtn.hidden = true;
      resultsContainer.hidden = true;
      resultsContainer.innerHTML = '';
      return;
    }

    clearBtn.hidden = false;
    const t = getTranslateFn();
    const hits = [];

    // 1. Check Error Codes
    SEARCH_INDEX.forEach((item) => {
      const codeMatches = item.code.toLowerCase().includes(q) || item.keywords.includes(q);
      const verdict = t(item.resultKey + '.verdict');
      const sub = t(item.resultKey + '.sub');
      const textMatches = verdict.toLowerCase().includes(q) || sub.toLowerCase().includes(q);

      if (codeMatches || textMatches) {
        hits.push({
          type: 'code',
          badge: item.code,
          title: verdict,
          sub: sub,
          action: () => {
            switchTab('wizard');
            render(item.nodeId);
          },
        });
      }
    });

    // 2. Check Tree Nodes & Questions
    Object.keys(TREE).forEach((nodeId) => {
      const node = TREE[nodeId];
      const qText = t(node.q);
      let matchedInNode = qText.toLowerCase().includes(q);

      node.opts.forEach((opt) => {
        const optText = t(opt.text);
        const optSub = opt.sub ? t(opt.sub) : '';
        if (optText.toLowerCase().includes(q) || optSub.toLowerCase().includes(q)) {
          matchedInNode = true;
        }

        if (opt.result) {
          const v = t(opt.result.verdict);
          const s = t(opt.result.sub);
          if (v.toLowerCase().includes(q) || s.toLowerCase().includes(q)) {
            hits.push({
              type: 'result',
              badge: opt.result.level.toUpperCase(),
              title: v,
              sub: s,
              action: () => {
                switchTab('wizard');
                showResult(opt.result, [{ question: node.q, choice: opt.text }]);
              },
            });
          }
        }
      });

      if (matchedInNode && nodeId !== 'start') {
        hits.push({
          type: 'question',
          badge: 'DIAGNOSTIC STEP',
          title: qText,
          sub: `Question in diagnostic tree: ${nodeId.replace(/_/g, ' ')}`,
          action: () => {
            switchTab('wizard');
            render(nodeId);
          },
        });
      }
    });

    // Deduplicate by title
    const seen = new Set();
    const uniqueHits = hits.filter((h) => {
      if (seen.has(h.title)) return false;
      seen.add(h.title);
      return true;
    });

    if (uniqueHits.length === 0) {
      resultsContainer.innerHTML = `<div class="search-empty">${t('search.no_results')}</div>`;
      resultsContainer.hidden = false;
      return;
    }

    resultsContainer.innerHTML = uniqueHits
      .slice(0, 7)
      .map(
        (h, i) => `
      <div class="search-result-item" id="search-item-${i}" data-hit-idx="${i}" role="button" tabindex="0">
        <div class="search-result-title">
          <span class="tool-header__badge" style="font-size:0.7rem;padding:1pt 5pt;">${h.badge}</span>
          <span>${h.title}</span>
        </div>
        <div class="search-result-sub">${h.sub}</div>
      </div>`
      )
      .join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach((itemEl) => {
      const idx = parseInt(itemEl.getAttribute('data-hit-idx'), 10);
      const triggerHit = () => {
        resultsContainer.hidden = true;
        searchInput.value = '';
        clearBtn.hidden = true;
        uniqueHits[idx].action();
      };
      itemEl.addEventListener('click', triggerHit);
      itemEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerHit();
        }
      });
    });

    resultsContainer.hidden = false;
  }

  searchInput.addEventListener('input', doSearch);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.hidden = true;
    resultsContainer.hidden = true;
    resultsContainer.innerHTML = '';
    searchInput.focus();
  });

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && !clearBtn.contains(e.target)) {
      resultsContainer.hidden = true;
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resultsContainer.hidden = true;
    }
  });
}

// -----------------------------------------------------------------------------
// Escalation Summary Directory (Technician & Manufacturer Conditions)
// -----------------------------------------------------------------------------
function getEscalationList() {
  const items = [];
  const visitedVerdicts = new Set();
  function traverse(nodeId, breadcrumb) {
    const node = TREE[nodeId];
    if (!node) return;
    node.opts.forEach((o) => {
      const currentCrumb = breadcrumb.concat([{ q: node.q, choice: o.text }]);
      if (o.result && (o.result.level === 'stop' || o.result.level === 'service')) {
        if (!visitedVerdicts.has(o.result.verdict)) {
          visitedVerdicts.add(o.result.verdict);
          items.push({
            level: o.result.level,
            icon: o.result.icon,
            verdict: o.result.verdict,
            sub: o.result.sub,
            actions: o.result.actions,
            breadcrumb: currentCrumb,
            rawResult: o.result
          });
        }
      } else if (o.next) {
        traverse(o.next, currentCrumb);
      }
    });
  }
  traverse('start', []);
  return items;
}

let activeEscalationFilter = 'all';

function renderEscalationGrid(filter = activeEscalationFilter) {
  activeEscalationFilter = filter;
  const container = document.getElementById('escalation-grid');
  if (!container) return;
  const t = getTranslateFn();
  const allItems = getEscalationList();
  const items = allItems.filter((item) => {
    if (filter === 'stop') return item.level === 'stop';
    if (filter === 'service') return item.level === 'service';
    return true;
  });

  const jumpLabel = t('escalation.jump_btn');
  const badgeStop = t('escalation.badge_stop');
  const badgeService = t('escalation.badge_service');
  const pathLabel = t('ticket.path_label');
  const actionsTitle = t('results.actions_title');

  container.innerHTML = items
    .map(
      (item, idx) => `
    <article class="escalation-card level-${item.level}" id="escalation-card-${idx}">
      <div class="escalation-card-header">
        <div class="escalation-badge-wrap">
          <span class="escalation-level-badge level-${item.level}">
            ${item.icon} ${item.level === 'stop' ? badgeStop : badgeService}
          </span>
        </div>
        <h3 class="escalation-card-title">${t(item.verdict)}</h3>
        <p class="escalation-card-sub">${t(item.sub)}</p>
      </div>

      <div class="escalation-card-body">
        <div class="escalation-trail-preview">
          <span class="trail-preview-label">${pathLabel}:</span>
          <span class="trail-preview-text">${item.breadcrumb.map((b) => t(b.choice)).join(' → ')}</span>
        </div>
        <div class="escalation-actions-label">${actionsTitle}:</div>
        <ul class="escalation-action-list">
          ${item.actions.map((a) => `<li>${t(a)}</li>`).join('')}
        </ul>
      </div>

      <div class="escalation-card-footer">
        <button type="button" class="escalation-jump-btn" data-idx="${idx}">
          <span aria-hidden="true">🎯</span>
          <span>${jumpLabel}</span>
        </button>
      </div>
    </article>`
    )
    .join('');

  container.querySelectorAll('.escalation-jump-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const targetItem = items[idx];
      if (targetItem) {
        switchTab('wizard');
        const customPath = targetItem.breadcrumb.map((b) => ({
          question: b.q,
          choice: b.choice,
          meterConfirmed: false
        }));
        showResult(targetItem.rawResult, customPath);
      }
    });
  });
}

function initEscalationFilters() {
  const filterBtns = document.querySelectorAll('.escalation-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderEscalationGrid(filter);
    });
  });
}

// -----------------------------------------------------------------------------
// Internationalization & Initialisation
// -----------------------------------------------------------------------------
function applyStaticTranslations() {
  const t = getTranslateFn();
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

function initLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem('poli_tools_language');
  } catch (_) {}
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const target = saved || urlLang || document.documentElement.lang || 'en';

  if (window.i18n && typeof window.i18n.setLang === 'function') {
    window.i18n.setLang(target);
  }
  document.documentElement.lang = target;

  const select = document.getElementById('lang-select');
  if (select) {
    select.value = target;
    select.addEventListener('change', (e) => {
      const chosen = e.target.value;
      try {
        localStorage.setItem('poli_tools_language', chosen);
      } catch (_) {}
      if (window.i18n && typeof window.i18n.setLang === 'function') {
        window.i18n.setLang(chosen);
      }
      document.documentElement.lang = chosen;
      applyStaticTranslations();
      stopAllAudio();
      renderEscalationGrid(activeEscalationFilter);
      if (currentResult) {
        showResult(currentResult);
      } else {
        render(currentNodeId || 'start');
      }
    });
  }
}

let initialized = false;
function init() {
  if (initialized) return;
  initialized = true;
  initLanguage();
  applyStaticTranslations();
  initTabs();
  initCalculator();
  initAudioLibrary();
  initEscalationFilters();
  renderEscalationGrid('all');
  initSearch();
  render('start');
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
