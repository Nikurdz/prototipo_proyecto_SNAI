/* RF-04 Gestión de GDOs (grupos de delincuencia organizada) */
window.Views = window.Views || {};
Views.gdos = function (root) {
  var esc = UI.esc;
  var riesgoKind = { Alto: 'danger', Medio: 'warn', Bajo: 'info' };
  function linked(g) { return Auth.scope(Store.list('adolescentes')).filter(function (a) { return a.gdoId === g.id; }).length; }
  UI.crud(root, {
    module: 'gdos', collection: 'gdos', title: 'Gestión de GDOs', singular: 'GDO',
    subtitle: 'Datos de apoyo sobre grupos de delincuencia organizada asociables a un adolescente.',
    note: Auth.can('gdos', 'editar') ? '' : 'Su perfil tiene acceso de solo consulta a este módulo.',
    getItems: function () { return Store.list('gdos'); },
    searchText: function (g) { return [g.nombre, g.descripcion, g.ambito].join(' '); },
    sort: function (a, b) { return a.nombre.localeCompare(b.nombre); },
    rowState: function (g) { return !g.activo ? 'muted' : { Alto: 'danger', Medio: 'warn', Bajo: 'ok' }[g.nivelRiesgo]; },
    columns: [
      { label: 'GDO', render: function (g) { return '<strong>' + esc(g.nombre) + '</strong><br><span class="muted">' + esc(g.descripcion) + '</span>'; } },
      { label: 'Ámbito', render: function (g) { return esc(g.ambito); } },
      { label: 'Riesgo', render: function (g) { return UI.badge(g.nivelRiesgo, riesgoKind[g.nivelRiesgo]); } },
      { label: 'Adolescentes', render: function (g) { return linked(g); } },
      { label: 'Estado', render: function (g) { return UI.badge(g.activo ? 'Activo' : 'Inactivo', g.activo ? 'ok' : 'muted'); } }
    ],
    defaults: function () { return { activo: true }; },
    fields: [
      { key: 'nombre', label: 'Nombre del GDO', required: true, maxlength: 60 },
      { key: 'ambito', label: 'Ámbito / zona de influencia', required: true, maxlength: 80 },
      {
        key: 'nivelRiesgo', label: 'Nivel de riesgo', type: 'select', required: true,
        options: function () { return ['Bajo', 'Medio', 'Alto'].map(function (x) { return { value: x, label: x }; }); }
      },
      { key: 'activo', label: 'Estado', type: 'checkbox', checkLabel: 'GDO activo' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, maxlength: 250, full: true }
    ],
    beforeSave: function (d, item) {
      var dup = Store.list('gdos').some(function (x) { return x.nombre.toLowerCase() === d.nombre.toLowerCase() && (!item || x.id !== item.id); });
      if (dup) throw new Error('Ya existe un GDO con ese nombre.');
      return d;
    },
    deleteAction: {
      label: 'Eliminar', toast: 'GDO eliminado.',
      check: function (g) {
        var n = Store.list('adolescentes').filter(function (a) { return a.gdoId === g.id; }).length;
        return n ? 'No se puede eliminar: ' + n + ' adolescente(s) están asociados a este GDO. Márquelo como inactivo.' : null;
      },
      confirmMsg: function (g) { return '¿Eliminar el GDO "' + g.nombre + '"?'; }
    }
  });
};
