/* RF-11 Obtención de UZDIs (consulta) */
window.Views = window.Views || {};
Views.uzdis = function (root) {
  var esc = UI.esc;
  function count(col, z) { return Store.list(col).filter(function (x) { return x.uzdiId === z.id; }).length; }
  UI.crud(root, {
    module: 'uzdis', collection: 'uzdis', readOnly: true, title: 'Unidades Zonales de Desarrollo Integral', singular: 'UZDI',
    subtitle: 'Consulta de las UZDIs registradas.',
    note: Auth.isSuper() ? '' : 'Solo se muestra la UZDI asociada a su ámbito de gestión.',
    getItems: function () { return Auth.scopeUzdis(); },
    searchText: function (z) { return [z.nombre, z.direccion, z.responsable].join(' '); },
    columns: [
      { label: 'UZDI', render: function (z) { return '<strong>' + esc(z.nombre) + '</strong>'; } },
      { label: 'Ubicación', render: function (z) { return esc(Store.name('cantones', z.cantonId) + ', ' + Store.name('provincias', z.provinciaId)); } },
      { label: 'Dirección', render: function (z) { return esc(z.direccion); } },
      { label: 'Responsable', render: function (z) { return esc(z.responsable); } }
    ],
    detailTitle: function (z) { return z.nombre; },
    detail: function (z) {
      return UI.dl([
        ['Ubicación', Store.name('cantones', z.cantonId) + ', ' + Store.name('provincias', z.provinciaId)], ['Dirección', z.direccion], ['Responsable', z.responsable],
        ['Usuarios asociados', count('usuarios', z)], ['Adolescentes registrados', count('adolescentes', z)], ['Expedientes', count('expedientes', z)]
      ]);
    }
  });
};
