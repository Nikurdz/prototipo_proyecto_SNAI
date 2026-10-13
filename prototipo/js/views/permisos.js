/* RF-10 Gestión de permisos y RF-12 Gestión de perfiles / roles */
window.Views = window.Views || {};
Views.permisos = function (root) {
  var esc = UI.esc;
  var selected = Number(sessionStorageGet('snai_perfil_sel')) || 2;
  var draft = null;

  function sessionStorageGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { } }

  function loadDraft() {
    var cur = Store.db().permisos[selected] || {};
    draft = {};
    Auth.MODULES.forEach(function (m) { draft[m.key] = (cur[m.key] || []).slice(); });
  }

  function render() {
    var perfiles = Store.list('perfiles');
    if (!Store.get('perfiles', selected)) selected = perfiles[0].id;
    if (!draft) loadDraft();
    var p = Store.get('perfiles', selected);
    var locked = selected === Auth.SUPER;
    var canEdit = Auth.can('permisos', 'editar') && !locked;
    var usersCount = Store.list('usuarios').filter(function (u) { return u.perfilId === selected; }).length;

    root.innerHTML =
      '<div class="page-head"><div><h1>Permisos y perfiles</h1><p class="muted">Defina qué acciones puede realizar cada perfil en cada módulo.</p></div>' +
      (Auth.can('permisos', 'crear') ? '<button class="btn primary" data-newprofile>Nuevo perfil</button>' : '') + '</div>' +
      '<div class="split"><aside class="card profile-list"><h3>Perfiles</h3>' +
      perfiles.map(function (x) {
        var n = Store.list('usuarios').filter(function (u) { return u.perfilId === x.id; }).length;
        return '<button class="profile-item' + (x.id === selected ? ' active' : '') + '" data-sel="' + x.id + '"><strong>' + esc(x.nombre) + '</strong><span>' + n + ' usuario' + (n === 1 ? '' : 's') + '</span></button>';
      }).join('') + '</aside>' +
      '<section class="card"><div class="profile-head"><div><h3>' + esc(p.nombre) + '</h3><p class="muted">' + esc(p.descripcion || 'Sin descripción') + '</p></div><div class="row-actions">' +
      (Auth.can('permisos', 'editar') && !p.sistema ? '<button class="btn sm" data-editprofile>Editar perfil</button>' : '') +
      (Auth.can('permisos', 'eliminar') && !p.sistema ? '<button class="btn sm danger-ghost" data-delprofile>Eliminar</button>' : '') + '</div></div>' +
      (locked ? '<div class="note">El Superadministrador tiene acceso total y su configuración no puede modificarse.</div>' : '') +
      '<div class="table-wrap"><table class="table matrix"><thead><tr><th>Módulo</th>' +
      Auth.ACTIONS.map(function (a) { return '<th>' + a.charAt(0).toUpperCase() + a.slice(1) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      Auth.MODULES.map(function (m) {
        return '<tr><td><strong>' + esc(m.label) + '</strong></td>' + Auth.ACTIONS.map(function (a) {
          if (m.actions.indexOf(a) < 0) return '<td class="na">—</td>';
          var on = locked || draft[m.key].indexOf(a) >= 0;
          return '<td><input type="checkbox" data-m="' + m.key + '" data-a="' + a + '" aria-label="' + esc(m.label + ' ' + a) + '"' + (on ? ' checked' : '') + (canEdit ? '' : ' disabled') + '></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>' +
      (canEdit ? '<div class="form-actions"><button class="btn ghost" data-discard>Descartar cambios</button><button class="btn primary" data-save>Guardar permisos</button></div>' : '') +
      '<p class="muted small">' + usersCount + ' usuario(s) con este perfil. Los cambios aplican en el siguiente inicio de sesión o recarga de la página.</p></section></div>';
  }

  function profileForm(item) {
    UI.formModal({
      title: item ? 'Editar perfil' : 'Nuevo perfil', item: item,
      fields: [
        { key: 'nombre', label: 'Nombre del perfil', required: true, maxlength: 40, full: true },
        { key: 'descripcion', label: 'Descripción', type: 'textarea', maxlength: 200, full: true }
      ],
      onSave: function (d, modal) {
        var dup = Store.list('perfiles').some(function (x) { return x.nombre.toLowerCase() === d.nombre.toLowerCase() && (!item || x.id !== item.id); });
        if (dup) throw new Error('Ya existe un perfil con ese nombre.');
        if (item) Store.update('perfiles', item.id, d);
        else {
          var r = Store.create('perfiles', { nombre: d.nombre, descripcion: d.descripcion, sistema: false });
          Store.db().permisos[r.id] = {}; Store.save(); selected = r.id; sessionStorageSet('snai_perfil_sel', r.id); draft = null;
        }
        modal.close(); UI.toast('Perfil guardado.'); render();
      }
    });
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.sel) { selected = Number(b.dataset.sel); sessionStorageSet('snai_perfil_sel', selected); draft = null; render(); }
    else if (b.hasAttribute('data-newprofile')) profileForm(null);
    else if (b.hasAttribute('data-editprofile')) profileForm(Store.get('perfiles', selected));
    else if (b.hasAttribute('data-delprofile')) {
      var n = Store.list('usuarios').filter(function (u) { return u.perfilId === selected; }).length;
      if (n) { UI.toast('No se puede eliminar: hay ' + n + ' usuario(s) con este perfil.', 'err'); return; }
      UI.confirm({ title: 'Eliminar perfil', message: '¿Eliminar el perfil "' + Store.name('perfiles', selected) + '"?', confirmText: 'Eliminar', danger: true }).then(function (y) {
        if (!y) return;
        Store.remove('perfiles', selected); delete Store.db().permisos[selected]; Store.save();
        selected = Auth.SUPER + 1; draft = null; UI.toast('Perfil eliminado.'); render();
      });
    }
    else if (b.hasAttribute('data-discard')) { draft = null; render(); UI.toast('Cambios descartados.', 'info'); }
    else if (b.hasAttribute('data-save')) {
      Store.db().permisos[selected] = draft; Store.save();
      draft = null; render(); UI.toast('Permisos guardados correctamente.');
    }
  });
  root.addEventListener('change', function (e) {
    var c = e.target;
    if (c.type !== 'checkbox' || !c.dataset.m) return;
    var list = draft[c.dataset.m], a = c.dataset.a;
    function set(act, on) { var i = list.indexOf(act); if (on && i < 0) list.push(act); if (!on && i >= 0) list.splice(i, 1); }
    set(a, c.checked);
    if (a === 'ver' && !c.checked) Auth.ACTIONS.forEach(function (x) { set(x, false); });
    if (a !== 'ver' && c.checked) set('ver', true);
    render();
  });
  render();
};
