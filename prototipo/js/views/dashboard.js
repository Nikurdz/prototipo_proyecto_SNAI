/* Inicio: resumen según permisos del perfil. */
window.Views = window.Views || {};
Views.dashboard = function (root) {
  var esc = UI.esc, u = Auth.current();
  var figs = [];
  if (Auth.can('adolescentes', 'ver')) {
    var n = Auth.scope(Store.list('adolescentes')).filter(function (a) { return a.estado === 'activo'; }).length;
    figs.push([n, 'Adolescentes activos', '#/adolescentes']);
  }
  var ex = [];
  if (Auth.can('expedientes', 'ver')) {
    ex = Auth.scope(Store.list('expedientes'));
    figs.push([ex.filter(function (e) { return e.estado === 'activo'; }).length, 'Expedientes activos', '#/expedientes']);
    figs.push([ex.filter(function (e) { return e.estado === 'cerrado'; }).length, 'Expedientes cerrados', '#/expedientes']);
  }
  if (Auth.can('medidas', 'ver')) figs.push([Store.list('medidas').filter(function (m) { return m.activo; }).length, 'Medidas en el catálogo', '#/medidas']);
  if (Auth.can('gdos', 'ver')) figs.push([Store.list('gdos').filter(function (g) { return g.activo; }).length, 'GDOs registrados', '#/gdos']);
  if (Auth.can('usuarios', 'ver')) figs.push([Auth.scope(Store.list('usuarios')).length, 'Usuarios del sistema', '#/usuarios']);

  var html = '<div class="page-head"><div><h1>Hola, ' + esc(u.nombres) + '</h1><p class="muted">' +
    esc(Auth.perfilName(u)) + ' en ' + esc(u.uzdiId ? Store.name('uzdis', u.uzdiId) : 'todas las UZDI') + '.</p></div></div>';

  if (figs.length) {
    html += '<div class="ledger">' + figs.map(function (f) {
      return '<a class="fig" href="' + f[2] + '"><strong>' + f[0] + '</strong><span>' + esc(f[1]) + '</span></a>';
    }).join('') + '</div>';
  }

  if (Auth.can('expedientes', 'ver')) {
    var today = new Date().toISOString().slice(0, 10);
    var limit = UI.addMonths(today, 2);
    var due = ex.filter(function (e) { return e.estado === 'activo'; }).map(function (e) {
      return { e: e, fin: UI.addMonths(e.fechaIngreso, e.duracionMeses) };
    }).filter(function (x) { return x.fin <= limit; }).sort(function (a, b) { return a.fin < b.fin ? -1 : 1; });
    html += '<div class="card"><h3>Medidas que terminan en los próximos 60 días</h3>' + (due.length ? '<ul class="plain">' + due.map(function (x) {
      var a = Store.get('adolescentes', x.e.adolescenteId);
      var late = x.fin < today;
      return '<li class="due"><span><strong>' + esc(x.e.numero) + '</strong> ' + esc(a ? a.nombres + ' ' + a.apellidos : '—') + '<br><span class="muted">' + esc(Store.name('medidas', x.e.medidaId)) + '</span></span>' +
        '<span>' + UI.badge(late ? 'Venció el ' + UI.fmtDate(x.fin) : 'Termina el ' + UI.fmtDate(x.fin), late ? 'danger' : 'warn') + '</span></li>';
    }).join('') + '</ul>' : '<p class="muted">Ninguna medida activa termina en este período.</p>') + '</div>';

    var rec = ex.slice().sort(function (a, b) { return a.fechaIngreso < b.fechaIngreso ? 1 : -1; }).slice(0, 5);
    html += '<div class="card"><h3>Expedientes recientes</h3><div class="table-wrap"><table class="table"><thead><tr><th>N° de expediente</th><th>Adolescente</th><th>Medida</th><th>Ingreso</th><th>Estado</th></tr></thead><tbody>' +
      (rec.length ? rec.map(function (e) {
        var a = Store.get('adolescentes', e.adolescenteId);
        return '<tr class="st-' + (e.estado === 'activo' ? 'ok' : 'muted') + '"><td data-label="N° de expediente"><strong>' + esc(e.numero) + '</strong></td><td data-label="Adolescente">' + esc(a ? a.nombres + ' ' + a.apellidos : '—') +
          '</td><td data-label="Medida">' + esc(Store.name('medidas', e.medidaId)) + '</td><td data-label="Ingreso">' + UI.fmtDate(e.fechaIngreso) +
          '</td><td data-label="Estado">' + UI.badge(e.estado === 'activo' ? 'Activo' : 'Cerrado', e.estado === 'activo' ? 'ok' : 'muted') + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="empty">Todavía no hay expedientes.</td></tr>') + '</tbody></table></div></div>';
  }
  if (Auth.can('usuarios', 'ver')) {
    var ses = Store.list('sesiones').reverse().slice(0, 5);
    html += '<div class="card"><h3>Últimos inicios de sesión</h3>' + (ses.length ? '<ul class="plain">' + ses.map(function (s) {
      var us = Store.get('usuarios', s.usuarioId);
      return '<li>' + esc(us ? us.nombres + ' ' + us.apellidos : '—') + ' <span class="muted">el ' + UI.fmtDateTime(s.fecha) + '</span></li>';
    }).join('') + '</ul>' : '<p class="muted">Todavía no hay inicios de sesión registrados.</p>') + '</div>';
  }
  if (!figs.length) html += '<div class="note">Su perfil no tiene módulos habilitados. Pida al administrador que revise sus permisos.</div>';
  root.innerHTML = html;
};
