/* RF-05 Gestión de medidas socioeducativas */
window.Views = window.Views || {};
Views.medidas = function (root) {
  var esc = UI.esc;
  UI.crud(root, {
    module: 'medidas', collection: 'medidas', title: 'Medidas socioeducativas', singular: 'medida',
    subtitle: 'Catálogo de medidas que pueden asociarse a los expedientes.',
    note: 'Las duraciones son valores referenciales de demostración; la duración efectiva se define en cada expediente (hasta el máximo del catálogo).',
    getItems: function () { return Store.list('medidas'); },
    searchText: function (m) { return [m.nombre, m.tipo, m.descripcion].join(' '); },
    filters: [{
      key: 'tipo', label: 'Tipo', default: '',
      options: [{ value: '', label: 'Todos' }, { value: 'No privativa de libertad', label: 'No privativas' }, { value: 'Privativa de libertad', label: 'Privativas' }],
      match: function (m, v) { return m.tipo === v; }
    }],
    rowState: function (m) { return m.activo ? 'ok' : 'muted'; },
    columns: [
      { label: 'Medida', render: function (m) { return '<strong>' + esc(m.nombre) + '</strong><br><span class="muted">' + esc(m.descripcion) + '</span>'; } },
      { label: 'Tipo', render: function (m) { return UI.badge(m.tipo, m.tipo.indexOf('No') === 0 ? 'info' : 'warn'); } },
      { label: 'Duración máx.', render: function (m) { return m.duracionMaxMeses + ' mes(es)'; } },
      { label: 'Expedientes', render: function (m) { return Auth.scope(Store.list('expedientes')).filter(function (e) { return e.medidaId === m.id; }).length; } },
      { label: 'Estado', render: function (m) { return UI.badge(m.activo ? 'Activa' : 'Inactiva', m.activo ? 'ok' : 'muted'); } }
    ],
    defaults: function () { return { activo: true }; },
    fields: [
      { key: 'nombre', label: 'Nombre de la medida', required: true, maxlength: 80, full: true },
      {
        key: 'tipo', label: 'Tipo', type: 'select', required: true,
        options: function () { return ['No privativa de libertad', 'Privativa de libertad'].map(function (x) { return { value: x, label: x }; }); }
      },
      { key: 'duracionMaxMeses', label: 'Duración máxima (meses)', type: 'number', required: true, min: 1, max: 120 },
      { key: 'activo', label: 'Estado', type: 'checkbox', checkLabel: 'Medida activa' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, maxlength: 250, full: true }
    ],
    beforeSave: function (d, item) {
      var dup = Store.list('medidas').some(function (x) { return x.nombre.toLowerCase() === d.nombre.toLowerCase() && (!item || x.id !== item.id); });
      if (dup) throw new Error('Ya existe una medida con ese nombre.');
      return d;
    },
    deleteAction: {
      label: 'Eliminar', toast: 'Medida eliminada.',
      check: function (m) {
        var n = Store.list('expedientes').filter(function (e) { return e.medidaId === m.id; }).length;
        return n ? 'No se puede eliminar: ' + n + ' expediente(s) usan esta medida. Márquela como inactiva.' : null;
      },
      confirmMsg: function (m) { return '¿Eliminar la medida "' + m.nombre + '"?'; }
    }
  });
};
