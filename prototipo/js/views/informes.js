/* RF-16 Generación de informes / reportes estadísticos */
window.Views = window.Views || {};
Views.informes = function (root) {
  var esc = UI.esc;

  function group(items, keyFn) {
    var m = {};
    items.forEach(function (it) { var k = keyFn(it); m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  }
  function adols() { return Auth.scope(Store.list('adolescentes')).filter(function (a) { return a.estado === 'activo'; }); }
  function exps() { return Auth.scope(Store.list('expedientes')); }

  var TYPES = [
    { id: 'adol_uzdi', label: 'Adolescentes activos por UZDI', need: ['adolescentes'], head: 'UZDI', run: function () { return group(adols(), function (a) { return Store.name('uzdis', a.uzdiId); }); } },
    { id: 'adol_canton', label: 'Adolescentes activos por cantón de residencia', need: ['adolescentes'], head: 'Cantón', run: function () { return group(adols(), function (a) { return Store.name('cantones', a.cantonId); }); } },
    { id: 'adol_etnia', label: 'Adolescentes activos por etnia', need: ['adolescentes'], head: 'Etnia', run: function () { return group(adols(), function (a) { return Store.name('etnias', a.etniaId); }); } },
    { id: 'adol_gdo', label: 'Adolescentes activos por GDO asociado', need: ['adolescentes', 'gdos'], head: 'GDO', run: function () { return group(adols(), function (a) { return a.gdoId ? Store.name('gdos', a.gdoId) : 'Sin GDO'; }); } },
    { id: 'exp_estado', label: 'Expedientes por estado', need: ['expedientes'], head: 'Estado', run: function () { return group(exps(), function (e) { return e.estado === 'activo' ? 'Activo' : 'Cerrado'; }); } },
    { id: 'exp_medida', label: 'Expedientes por medida socioeducativa', need: ['expedientes'], head: 'Medida', run: function () { return group(exps(), function (e) { return Store.name('medidas', e.medidaId); }); } },
    { id: 'gdo_riesgo', label: 'GDOs por nivel de riesgo', need: ['gdos'], head: 'Nivel de riesgo', run: function () { return group(Store.list('gdos'), function (g) { return g.nivelRiesgo; }); } },
    { id: 'usr_perfil', label: 'Usuarios por perfil', need: ['usuarios'], head: 'Perfil', run: function () { return group(Auth.scope(Store.list('usuarios')), function (u) { return Store.name('perfiles', u.perfilId); }); } }
  ].filter(function (t) { return t.need.every(function (m) { return Auth.can(m, 'ver'); }); });

  if (!TYPES.length) {
    root.innerHTML = '<div class="page-head"><h1>Informes</h1></div><div class="note">Su perfil no tiene informes disponibles.</div>';
    return;
  }

  root.innerHTML =
    '<div class="page-head"><div><h1>Generación de informes</h1><p class="muted">Información consolidada según su perfil' +
    (Auth.isSuper() ? '.' : ' y su UZDI (' + esc(Store.name('uzdis', Auth.current().uzdiId)) + ').') + '</p></div></div>' +
    '<div class="card no-print"><div class="toolbar"><label class="filter grow">Tipo de informe <select id="rep-type">' +
    TYPES.map(function (t) { return '<option value="' + t.id + '">' + esc(t.label) + '</option>'; }).join('') +
    '</select></label><button class="btn primary" id="rep-gen">Generar informe</button></div></div>' +
    '<div id="rep-out"></div>';

  var out = root.querySelector('#rep-out');
  var current = null;

  function generate() {
    var t = TYPES.filter(function (x) { return x.id === root.querySelector('#rep-type').value; })[0];
    var rows = t.run();
    var total = rows.reduce(function (s, r) { return s + r[1]; }, 0);
    var max = rows.reduce(function (m, r) { return Math.max(m, r[1]); }, 0) || 1;
    var u = Auth.current();
    current = { t: t, rows: rows, total: total };
    out.innerHTML = '<div class="card report-area"><div class="report-head"><div><h3>' + esc(t.label) + '</h3><p class="muted">Generado el ' + UI.fmtDateTime(new Date().toISOString()) + ' por ' + esc(u.nombres + ' ' + u.apellidos) +
      ' para ' + esc(u.uzdiId ? Store.name('uzdis', u.uzdiId) : 'todas las UZDI') + '.</p></div>' +
      '<div class="row-actions no-print"><button class="btn sm" id="rep-csv">Exportar CSV</button><button class="btn sm" id="rep-print">Imprimir / PDF</button></div></div>' +
      (rows.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>' + esc(t.head) + '</th><th class="num">Cantidad</th><th class="num">%</th><th class="bar-col">Distribución</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td>' + esc(r[0]) + '</td><td class="num">' + r[1] + '</td><td class="num">' + (r[1] * 100 / total).toFixed(1) + '%</td><td class="bar-col"><div class="bar"><span style="width:' + (r[1] * 100 / max) + '%"></span></div></td></tr>';
        }).join('') + '<tr class="total"><td>Total</td><td class="num">' + total + '</td><td class="num">100%</td><td></td></tr></tbody></table></div>'
        : '<p class="empty">No hay información registrada para este informe.</p>') + '</div>';
    var csv = out.querySelector('#rep-csv'), pr = out.querySelector('#rep-print');
    if (csv) csv.addEventListener('click', function () {
      UI.downloadCSV('informe_' + t.id + '.csv', [[t.head, 'Cantidad', 'Porcentaje']].concat(rows.map(function (r) { return [r[0], r[1], (r[1] * 100 / total).toFixed(1) + '%']; })).concat([['Total', total, '100%']]));
      UI.toast('Informe exportado en CSV.');
    });
    if (pr) pr.addEventListener('click', function () { window.print(); });
  }
  root.querySelector('#rep-gen').addEventListener('click', generate);
  generate();
};
