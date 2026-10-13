/* Helpers de interfaz reutilizables: modal, confirmación, formulario y CRUD genérico. */
(function () {
  var UI = {};

  UI.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var esc = UI.esc;

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  UI.el = el;

  UI.fmtDate = function (iso) {
    if (!iso) return '—';
    var p = String(iso).slice(0, 10).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  };
  UI.fmtDateTime = function (iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    return UI.fmtDate(iso) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };
  UI.age = function (iso) {
    if (!iso) return '';
    var b = new Date(iso), n = new Date();
    var a = n.getFullYear() - b.getFullYear();
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
    return a;
  };
  UI.addMonths = function (iso, m) {
    var d = new Date(iso + 'T00:00:00');
    d.setMonth(d.getMonth() + Number(m));
    return d.toISOString().slice(0, 10);
  };
  UI.badge = function (text, kind) {
    return '<span class="badge ' + (kind || '') + '">' + esc(text) + '</span>';
  };
  UI.dl = function (pairs) {
    return '<dl class="dl">' + pairs.map(function (p) {
      return '<div><dt>' + esc(p[0]) + '</dt><dd>' + (p[2] ? p[1] : esc(p[1] == null || p[1] === '' ? '—' : p[1])) + '</dd></div>';
    }).join('') + '</dl>';
  };

  /* ---------- Toast ---------- */
  UI.toast = function (msg, type) {
    var root = document.getElementById('toast-root');
    var t = el('<div class="toast ' + (type || 'ok') + '" role="status">' + esc(msg) + '</div>');
    root.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, 3200);
  };

  /* ---------- Modal ---------- */
  UI.modal = function (opts) {
    var root = document.getElementById('modal-root');
    var m = el('<div class="modal-backdrop"><div class="modal' + (opts.wide ? ' wide' : '') + (opts.folder ? ' folder' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.title) + '">' +
      '<header><h2>' + esc(opts.title) + '</h2><button type="button" class="icon-btn" data-close aria-label="Cerrar">&times;</button></header>' +
      '<div class="modal-body"></div><footer></footer></div></div>');
    var bodyEl = m.querySelector('.modal-body');
    if (typeof opts.body === 'string') bodyEl.innerHTML = opts.body; else bodyEl.appendChild(opts.body);
    var foot = m.querySelector('footer');
    var api = {
      el: m, body: bodyEl,
      close: function () {
        if (!m.parentNode) return;
        m.remove();
        document.removeEventListener('keydown', onKey);
        if (opts.onClose) opts.onClose();
      }
    };
    function onKey(e) { if (e.key === 'Escape' && root.lastElementChild === m) api.close(); }
    (opts.buttons || []).forEach(function (b) {
      var btn = el('<button type="' + (b.type || 'button') + '" class="btn ' + (b.cls || '') + '"' + (b.form ? ' form="' + b.form + '"' : '') + '>' + esc(b.label) + '</button>');
      btn.addEventListener('click', function () {
        if (b.onClick) b.onClick(api); else if (b.type !== 'submit') api.close();
      });
      foot.appendChild(btn);
    });
    if (!(opts.buttons || []).length) foot.remove();
    m.querySelector('[data-close]').addEventListener('click', api.close);
    document.addEventListener('keydown', onKey);
    root.appendChild(m);
    var first = bodyEl.querySelector('input:not([type=hidden]):not([disabled]),select,textarea');
    if (first) first.focus();
    return api;
  };

  UI.confirm = function (opts) {
    return new Promise(function (resolve) {
      UI.modal({
        title: opts.title || 'Confirmar acción',
        body: '<p class="confirm-msg">' + esc(opts.message) + '</p>',
        buttons: [
          { label: 'Cancelar', cls: 'ghost' },
          { label: opts.confirmText || 'Confirmar', cls: opts.danger ? 'danger' : 'primary', onClick: function (a) { resolve(true); a.close(); } }
        ],
        onClose: function () { resolve(false); }
      });
    });
  };

  /* ---------- Formulario genérico ---------- */
  function optionsHTML(opts, cur, f) {
    var h = '<option value="">' + esc(f.placeholder || '— Seleccione —') + '</option>';
    opts.forEach(function (o) {
      h += '<option value="' + esc(o.value) + '"' + (String(o.value) === String(cur == null ? '' : cur) ? ' selected' : '') + '>' + esc(o.label) + '</option>';
    });
    return h;
  }

  function fieldHTML(f, vals, item, uid) {
    var show = f.showIf ? f.showIf(vals, item) : true;
    var v = vals[f.key];
    var id = uid + '_' + f.key;
    var ro = f.readonly && f.readonly(vals, item) ? ' disabled' : '';
    var input;
    if (f.type === 'select') {
      input = '<select id="' + id + '" name="' + f.key + '"' + ro + '>' + optionsHTML(f.options(vals, item), v, f) + '</select>';
    } else if (f.type === 'textarea') {
      input = '<textarea id="' + id + '" name="' + f.key + '" rows="3"' + ro + (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + '>' + esc(v) + '</textarea>';
    } else if (f.type === 'checkbox') {
      input = '<label class="chk"><input type="checkbox" id="' + id + '" name="' + f.key + '"' + (v ? ' checked' : '') + ro + '> ' + esc(f.checkLabel || f.label) + '</label>';
    } else {
      input = '<input id="' + id + '" name="' + f.key + '" type="' + (f.type || 'text') + '" value="' + esc(v) + '"' + ro +
        (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + (f.min != null ? ' min="' + f.min + '"' : '') +
        (f.max != null ? ' max="' + f.max + '"' : '') + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
        ' autocomplete="' + (f.type === 'password' ? 'new-password' : 'off') + '">';
    }
    return '<div class="field' + (f.full ? ' full' : '') + '" data-field="' + f.key + '"' + (show ? '' : ' hidden') + '>' +
      (f.type === 'checkbox' ? '' : '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : '') + '</label>') +
      input + (f.help ? '<small class="help">' + esc(f.help) + '</small>' : '') + '<small class="err" hidden></small></div>';
  }

  function readForm(form, fields, includeHidden) {
    var out = {};
    fields.forEach(function (f) {
      var w = form.querySelector('[data-field="' + f.key + '"]');
      if (!includeHidden && w.hidden) return;
      var inp = form.elements[f.key];
      var v = f.type === 'checkbox' ? inp.checked : inp.value;
      if (typeof v === 'string') v = v.trim();
      if ((f.type === 'number' || f.num) && f.type !== 'checkbox') v = v === '' ? null : Number(v);
      out[f.key] = v;
    });
    return out;
  }

  /* opts: {title, fields, item, values, submitText, onSave(data, modal), onChange(key, form)} */
  UI.formModal = function (opts) {
    var fields = opts.fields, item = opts.item || null;
    var vals = Object.assign({}, opts.values || item || {});
    var uid = 'f' + Math.random().toString(36).slice(2, 8);
    var html = '<form id="' + uid + '" class="form-grid" novalidate>' +
      fields.map(function (f) { return fieldHTML(f, vals, item, uid); }).join('') +
      '<div class="form-error full" data-form-error hidden></div></form>';
    var modal = UI.modal({
      title: opts.title, body: html, wide: true,
      buttons: [{ label: 'Cancelar', cls: 'ghost' }, { label: opts.submitText || 'Guardar', cls: 'primary', type: 'submit', form: uid }]
    });
    var form = modal.el.querySelector('form');

    function sync(changed) {
      var v = readForm(form, fields, true);
      fields.forEach(function (f) {
        var w = form.querySelector('[data-field="' + f.key + '"]');
        if (f.showIf) w.hidden = !f.showIf(v, item);
        if (f.dependsOn && f.type === 'select' && f.dependsOn === changed) {
          var sel = form.elements[f.key];
          sel.innerHTML = optionsHTML(f.options(v, item), sel.value, f);
        }
      });
      if (opts.onChange && changed) opts.onChange(changed, form, v);
    }
    form.addEventListener('change', function (e) { if (e.target.name) sync(e.target.name); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('.err').forEach(function (x) { x.hidden = true; x.textContent = ''; });
      var fe = form.querySelector('[data-form-error]'); fe.hidden = true;
      var data = readForm(form, fields, false);
      var ok = true, firstBad = null;
      fields.forEach(function (f) {
        var w = form.querySelector('[data-field="' + f.key + '"]');
        if (w.hidden) return;
        var v = data[f.key], msg = '';
        var empty = v === '' || v == null;
        if (f.required && f.type !== 'checkbox' && empty) msg = 'Este campo es obligatorio.';
        else if (!empty && f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Ingrese un correo válido.';
        else if (!empty && f.pattern && !f.pattern.test(String(v))) msg = f.patternMsg || 'Formato no válido.';
        else if (!empty && f.type === 'number' && f.min != null && v < f.min) msg = 'El valor mínimo es ' + f.min + '.';
        if (!msg && f.validate) msg = f.validate(v, data, item) || '';
        if (msg) {
          ok = false;
          var er = w.querySelector('.err'); er.textContent = msg; er.hidden = false;
          if (!firstBad) firstBad = form.elements[f.key];
        }
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      try { opts.onSave(data, modal); }
      catch (err) { fe.textContent = err.message; fe.hidden = false; }
    });
    return modal;
  };

  /* ---------- CRUD genérico ----------
     cfg: {module, title, subtitle, singular, columns[{label, render(item)}], fields[], getItems(),
           collection, searchText(item), filters[{key,label,options,default,match}], sort(a,b),
           detail(item), beforeSave(data,item,isNew), afterSave(), canRowEdit(item),
           deleteAction:{label, confirmMsg(item), check(item), perform(item), toast}, note, readOnly} */
  UI.crud = function (root, cfg) {
    var PAGE = 8;
    var state = { q: '', page: 1, filters: {} };
    (cfg.filters || []).forEach(function (f) { state.filters[f.key] = f.default == null ? '' : f.default; });
    var canNew = !cfg.readOnly && Auth.can(cfg.module, 'crear');

    root.innerHTML =
      '<div class="page-head"><div><h1>' + esc(cfg.title) + '</h1>' + (cfg.subtitle ? '<p class="muted">' + esc(cfg.subtitle) + '</p>' : '') + '</div>' +
      (canNew ? '<button class="btn primary" data-new>Nuevo ' + esc(cfg.singular) + '</button>' : '') + '</div>' +
      (cfg.note ? '<div class="note">' + esc(cfg.note) + '</div>' : '') +
      '<section class="list"><div class="toolbar"><input type="search" class="search" placeholder="Buscar en esta lista" aria-label="Buscar en esta lista">' +
      (cfg.filters || []).map(function (f) {
        return '<label class="filter">' + esc(f.label) + ' <select data-filter="' + f.key + '">' +
          f.options.map(function (o) { return '<option value="' + esc(o.value) + '"' + (String(o.value) === String(state.filters[f.key]) ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') +
          '</select></label>';
      }).join('') + '<span class="count muted"></span></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr>' +
      cfg.columns.map(function (c) { return '<th>' + esc(c.label) + '</th>'; }).join('') + '<th class="actions-col">Acciones</th></tr></thead><tbody></tbody></table></div>' +
      '<div class="pager"></div></section>';

    var tbody = root.querySelector('tbody');
    var pager = root.querySelector('.pager');
    var countEl = root.querySelector('.count');
    var itemsById = {};

    function filtered() {
      var q = state.q.toLowerCase();
      var arr = cfg.getItems().filter(function (it) {
        if (q && (cfg.searchText ? cfg.searchText(it) : JSON.stringify(it)).toLowerCase().indexOf(q) < 0) return false;
        return (cfg.filters || []).every(function (f) {
          var val = state.filters[f.key];
          return val === '' || f.match(it, val);
        });
      });
      if (cfg.sort) arr.sort(cfg.sort);
      return arr;
    }

    function refresh() {
      var arr = filtered();
      var pages = Math.max(1, Math.ceil(arr.length / PAGE));
      if (state.page > pages) state.page = pages;
      var slice = arr.slice((state.page - 1) * PAGE, state.page * PAGE);
      itemsById = {};
      var canEdit = !cfg.readOnly && Auth.can(cfg.module, 'editar');
      var canDel = !cfg.readOnly && cfg.deleteAction && Auth.can(cfg.module, 'eliminar');
      tbody.innerHTML = slice.length ? slice.map(function (it) {
        itemsById[it.id] = it;
        var acts = '';
        if (cfg.detail) acts += '<button class="btn sm ghost" data-act="ver" data-id="' + it.id + '">Ver</button>';
        if (canEdit && (!cfg.canRowEdit || cfg.canRowEdit(it))) acts += '<button class="btn sm" data-act="editar" data-id="' + it.id + '">Editar</button>';
        if (canDel && (!cfg.canRowDelete || cfg.canRowDelete(it))) acts += '<button class="btn sm danger-ghost" data-act="eliminar" data-id="' + it.id + '">' + esc(cfg.deleteAction.label || 'Eliminar') + '</button>';
        var st = cfg.rowState ? cfg.rowState(it) : '';
        return '<tr' + (st ? ' class="st-' + st + '"' : '') + '>' + cfg.columns.map(function (c) {
          return '<td data-label="' + esc(c.label) + '">' + c.render(it) + '</td>';
        }).join('') + '<td class="actions-col"><div class="row-actions">' + (acts || '<span class="muted">—</span>') + '</div></td></tr>';
      }).join('') : '<tr><td colspan="' + (cfg.columns.length + 1) + '" class="empty"><strong>No hay registros con estos criterios.</strong>' +
        (canNew ? 'Cambie la búsqueda o los filtros, o registre un ' + esc(cfg.singular) + ' nuevo.' : 'Cambie la búsqueda o los filtros.') + '</td></tr>';
      countEl.textContent = arr.length + (arr.length === 1 ? ' registro' : ' registros');
      pager.innerHTML = pages > 1
        ? '<button class="btn sm" data-page="-1"' + (state.page === 1 ? ' disabled' : '') + '>Anterior</button><span>Página ' + state.page + ' de ' + pages +
        '</span><button class="btn sm" data-page="1"' + (state.page === pages ? ' disabled' : '') + '>Siguiente</button>'
        : '';
    }

    function openForm(item) {
      var isNew = !item;
      UI.formModal({
        title: (isNew ? 'Nuevo ' : 'Editar ') + cfg.singular,
        fields: cfg.fields, item: item, values: isNew ? (cfg.defaults ? cfg.defaults() : {}) : item,
        onChange: cfg.onFormChange,
        onSave: function (data, modal) {
          if (cfg.beforeSave) data = cfg.beforeSave(data, item, isNew) || data;
          if (isNew) Store.create(cfg.collection, data); else Store.update(cfg.collection, item.id, data);
          modal.close();
          UI.toast('Cambios guardados.');
          if (cfg.afterSave) cfg.afterSave();
          refresh();
        }
      });
    }

    function openDetail(item) {
      var btns = [{ label: 'Cerrar', cls: 'ghost' }];
      if (!cfg.readOnly && Auth.can(cfg.module, 'editar') && (!cfg.canRowEdit || cfg.canRowEdit(item))) {
        btns.push({ label: 'Editar', cls: 'primary', onClick: function (a) { a.close(); openForm(Store.get(cfg.collection, item.id)); } });
      }
      UI.modal({ title: cfg.detailTitle ? cfg.detailTitle(item) : 'Detalle de ' + cfg.singular, body: cfg.detail(item), wide: true, folder: true, buttons: btns });
    }

    function askDelete(item) {
      var d = cfg.deleteAction;
      var block = d.check ? d.check(item) : null;
      if (block) { UI.toast(block, 'err'); return; }
      UI.confirm({ title: d.label || 'Eliminar', message: d.confirmMsg(item), confirmText: d.label || 'Eliminar', danger: true }).then(function (yes) {
        if (!yes) return;
        if (d.perform) d.perform(item); else Store.remove(cfg.collection, item.id);
        UI.toast(d.toast || 'Registro actualizado.');
        refresh();
      });
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-new')) return openForm(null);
      if (b.dataset.page) { state.page += Number(b.dataset.page); return refresh(); }
      var it = itemsById[b.dataset.id];
      if (!it) return;
      if (b.dataset.act === 'ver') openDetail(it);
      else if (b.dataset.act === 'editar') openForm(it);
      else if (b.dataset.act === 'eliminar') askDelete(it);
    });
    root.querySelector('.search').addEventListener('input', function (e) { state.q = e.target.value; state.page = 1; refresh(); });
    root.querySelectorAll('[data-filter]').forEach(function (s) {
      s.addEventListener('change', function () { state.filters[s.dataset.filter] = s.value; state.page = 1; refresh(); });
    });
    refresh();
    return { refresh: refresh };
  };

  /* ---------- CSV ---------- */
  UI.downloadCSV = function (filename, rows) {
    var csv = '﻿' + rows.map(function (r) {
      return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(';');
    }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
  };

  UI.icons = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    clip: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };
  UI.icon = function (name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (UI.icons[name] || '') + '</svg>';
  };

  window.UI = UI;
})();
