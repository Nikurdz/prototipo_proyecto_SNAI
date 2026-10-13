/* RF-02 Gestión de adolescentes (apoya RF-04, RF-09, RF-17, RF-18, RF-19, RF-20) */
window.Views = window.Views || {};
Views.adolescentes = function (root) {
  var esc = UI.esc;
  function opts(col) { return function () { return Store.list(col).map(function (x) { return { value: x.id, label: x.nombre }; }); }; }
  var today = new Date().toISOString().slice(0, 10);

  UI.crud(root, {
    module: 'adolescentes', collection: 'adolescentes', title: 'Gestión de adolescentes', singular: 'adolescente',
    subtitle: 'Registro general de los adolescentes vinculados a la UZDI.',
    note: Auth.isSuper() ? '' : 'Solo se muestran los adolescentes de su UZDI (' + Store.name('uzdis', Auth.current().uzdiId) + ').',
    getItems: function () { return Auth.scope(Store.list('adolescentes')); },
    searchText: function (a) { return [a.nombres, a.apellidos, a.cedula].join(' '); },
    sort: function (a, b) { return a.apellidos.localeCompare(b.apellidos); },
    filters: [{
      key: 'estado', label: 'Estado', default: 'activo',
      options: [{ value: '', label: 'Todos' }, { value: 'activo', label: 'Activos' }, { value: 'baja', label: 'De baja' }],
      match: function (a, v) { return a.estado === v; }
    }],
    rowState: function (a) { return a.estado === 'activo' ? 'ok' : 'muted'; },
    columns: [
      { label: 'Adolescente', render: function (a) { return '<strong>' + esc(a.apellidos + ' ' + a.nombres) + '</strong><br><span class="muted">C.I. ' + esc(a.cedula) + '</span>'; } },
      { label: 'Edad', render: function (a) { return UI.age(a.fechaNacimiento) + ' años'; } },
      { label: 'Cantón', render: function (a) { return esc(Store.name('cantones', a.cantonId)); } },
      { label: 'UZDI', render: function (a) { return esc(Store.name('uzdis', a.uzdiId)); } },
      { label: 'Estado', render: function (a) { return UI.badge(a.estado === 'activo' ? 'Activo' : 'De baja', a.estado === 'activo' ? 'ok' : 'muted'); } }
    ],
    defaults: function () { return { estado: 'activo', nacionalidadId: 1 }; },
    fields: [
      { key: 'nombres', label: 'Nombres', required: true, maxlength: 60 },
      { key: 'apellidos', label: 'Apellidos', required: true, maxlength: 60 },
      { key: 'cedula', label: 'Cédula', required: true, maxlength: 10, pattern: /^\d{10}$/, patternMsg: 'La cédula debe tener 10 dígitos.' },
      {
        key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', required: true, max: today,
        validate: function (v) { var a = UI.age(v); if (a < 10 || a > 25) return 'La edad (' + a + ') está fuera del rango esperado (10–25).'; }
      },
      { key: 'sexo', label: 'Sexo', type: 'select', required: true, options: function () { return [{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }]; } },
      { key: 'nacionalidadId', label: 'Nacionalidad', type: 'select', num: true, required: true, options: opts('nacionalidades') },
      { key: 'etniaId', label: 'Etnia', type: 'select', num: true, required: true, options: opts('etnias') },
      { key: 'estadoCivilId', label: 'Estado civil', type: 'select', num: true, required: true, options: opts('estadosCiviles') },
      { key: 'provinciaId', label: 'Provincia', type: 'select', num: true, required: true, options: opts('provincias') },
      {
        key: 'cantonId', label: 'Cantón', type: 'select', num: true, required: true, dependsOn: 'provinciaId',
        options: function (v) {
          return Store.list('cantones').filter(function (c) { return String(c.provinciaId) === String(v.provinciaId); })
            .map(function (c) { return { value: c.id, label: c.nombre }; });
        }
      },
      { key: 'direccion', label: 'Dirección de domicilio', required: true, maxlength: 120, full: true },
      { key: 'telefono', label: 'Teléfono', maxlength: 10, pattern: /^\d{7,10}$/, patternMsg: 'Ingrese de 7 a 10 dígitos.' },
      {
        key: 'uzdiId', label: 'UZDI', type: 'select', num: true, required: true,
        showIf: function () { return Auth.isSuper(); },
        options: function () { return Auth.scopeUzdis().map(function (z) { return { value: z.id, label: z.nombre }; }); }
      },
      {
        key: 'gdoId', label: 'GDO asociado (opcional)', type: 'select', num: true, placeholder: '— Ninguno —',
        showIf: function () { return Auth.can('gdos', 'ver'); },
        options: function () { return Store.list('gdos').filter(function (g) { return g.activo; }).map(function (g) { return { value: g.id, label: g.nombre }; }); }
      },
      {
        key: 'estado', label: 'Estado', type: 'select', required: true, showIf: function (v, item) { return !!item; },
        options: function () { return [{ value: 'activo', label: 'Activo' }, { value: 'baja', label: 'De baja' }]; }
      },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', maxlength: 300, full: true }
    ],
    beforeSave: function (d, item) {
      var dup = Store.list('adolescentes').some(function (x) { return x.cedula === d.cedula && (!item || x.id !== item.id); });
      if (dup) throw new Error('Ya existe un adolescente registrado con esa cédula.');
      if (!Auth.isSuper()) d.uzdiId = item ? item.uzdiId : Auth.current().uzdiId;
      if (d.gdoId === undefined && item) d.gdoId = item.gdoId; // sin permiso sobre GDOs se conserva el valor
      if (d.gdoId === undefined) d.gdoId = null;
      if (!d.estado) d.estado = 'activo';
      return d;
    },
    deleteAction: {
      label: 'Dar de baja', toast: 'Adolescente dado de baja.',
      confirmMsg: function (a) { return '¿Dar de baja a ' + a.nombres + ' ' + a.apellidos + '? El registro se conserva y puede reactivarse editándolo.'; },
      check: function (a) { return a.estado === 'baja' ? 'Este adolescente ya está de baja. Edítelo para reactivarlo.' : null; },
      perform: function (a) { Store.update('adolescentes', a.id, { estado: 'baja' }); }
    },
    detailTitle: function (a) { return a.nombres + ' ' + a.apellidos; },
    detail: function (a) {
      var h = UI.dl([
        ['Cédula', a.cedula], ['Fecha de nacimiento', UI.fmtDate(a.fechaNacimiento) + ' (' + UI.age(a.fechaNacimiento) + ' años)'], ['Sexo', a.sexo],
        ['Nacionalidad', Store.name('nacionalidades', a.nacionalidadId)], ['Etnia', Store.name('etnias', a.etniaId)], ['Estado civil', Store.name('estadosCiviles', a.estadoCivilId)],
        ['Provincia / cantón', Store.name('provincias', a.provinciaId) + ' / ' + Store.name('cantones', a.cantonId)], ['Dirección', a.direccion], ['Teléfono', a.telefono],
        ['UZDI', Store.name('uzdis', a.uzdiId)],
        ['GDO asociado', Auth.can('gdos', 'ver') ? (a.gdoId ? Store.name('gdos', a.gdoId) : 'Ninguno') : 'Sin acceso a esta información'],
        ['Estado', a.estado === 'activo' ? 'Activo' : 'De baja'], ['Observaciones', a.observaciones]
      ]);
      if (Auth.can('expedientes', 'ver')) {
        var ex = Store.list('expedientes').filter(function (e) { return e.adolescenteId === a.id; });
        h += '<h4>Expedientes</h4>' + (ex.length ? '<ul class="plain">' + ex.map(function (e) {
          return '<li class="due"><span><strong>' + esc(e.numero) + '</strong> ' + esc(e.infraccion) + '<br><span class="muted">' + esc(Store.name('medidas', e.medidaId)) + '</span></span>' + UI.badge(e.estado === 'activo' ? 'Activo' : 'Cerrado', e.estado === 'activo' ? 'ok' : 'muted') + '</li>';
        }).join('') + '</ul>' : '<p class="muted">Sin expedientes registrados.</p>');
      }
      return h;
    }
  });
};
