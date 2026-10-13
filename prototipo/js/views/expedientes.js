/* RF-03 Gestión de expedientes (apoya RF-02, RF-05, RF-11) */
window.Views = window.Views || {};
Views.expedientes = function (root) {
  var esc = UI.esc;
  var today = new Date().toISOString().slice(0, 10);
  function adol(e) { return Store.get('adolescentes', e.adolescenteId); }
  function adolName(e) { var a = adol(e); return a ? a.apellidos + ' ' + a.nombres : '—'; }
  function nextNumber() {
    var max = Store.list('expedientes').reduce(function (m, e) { return Math.max(m, parseInt(String(e.numero).split('-').pop(), 10) || 0); }, 0);
    return 'EXP-' + new Date().getFullYear() + '-' + String(max + 1).padStart(3, '0');
  }

  UI.crud(root, {
    module: 'expedientes', collection: 'expedientes', title: 'Gestión de expedientes', singular: 'expediente',
    subtitle: 'Información legal y socioeducativa asociada a cada adolescente.',
    note: Auth.can('expedientes', 'editar') ? '' : 'Su perfil tiene acceso de solo consulta a este módulo.',
    getItems: function () { return Auth.scope(Store.list('expedientes')); },
    searchText: function (e) { return [e.numero, adolName(e), e.infraccion, Store.name('medidas', e.medidaId)].join(' '); },
    sort: function (a, b) { return a.fechaIngreso < b.fechaIngreso ? 1 : -1; },
    filters: [{
      key: 'estado', label: 'Estado', default: '',
      options: [{ value: '', label: 'Todos' }, { value: 'activo', label: 'Activos' }, { value: 'cerrado', label: 'Cerrados' }],
      match: function (e, v) { return e.estado === v; }
    }],
    rowState: function (e) { return e.estado === 'activo' ? 'ok' : 'muted'; },
    columns: [
      { label: 'N° expediente', render: function (e) { return '<strong>' + esc(e.numero) + '</strong>'; } },
      { label: 'Adolescente', render: function (e) { return esc(adolName(e)); } },
      { label: 'Infracción', render: function (e) { return esc(e.infraccion); } },
      { label: 'Medida', render: function (e) { return esc(Store.name('medidas', e.medidaId)) + '<br><span class="muted">' + e.duracionMeses + ' mes(es)</span>'; } },
      { label: 'Ingreso', render: function (e) { return UI.fmtDate(e.fechaIngreso); } },
      { label: 'Estado', render: function (e) { return UI.badge(e.estado === 'activo' ? 'Activo' : 'Cerrado', e.estado === 'activo' ? 'ok' : 'muted'); } }
    ],
    defaults: function () { return { estado: 'activo', fechaIngreso: today, numero: nextNumber() }; },
    onFormChange: function (key, form) {
      if (key === 'medidaId') {
        var m = Store.get('medidas', form.elements.medidaId.value);
        if (m && !form.elements.duracionMeses.value) form.elements.duracionMeses.value = Math.min(m.duracionMaxMeses, 6);
      }
    },
    fields: [
      { key: 'numero', label: 'N° de expediente', readonly: function () { return true; }, help: 'Se asigna automáticamente.' },
      {
        key: 'adolescenteId', label: 'Adolescente', type: 'select', num: true, required: true,
        options: function (v, item) {
          return Auth.scope(Store.list('adolescentes')).filter(function (a) { return a.estado === 'activo' || (item && a.id === item.adolescenteId); })
            .sort(function (a, b) { return a.apellidos.localeCompare(b.apellidos); })
            .map(function (a) { return { value: a.id, label: a.apellidos + ' ' + a.nombres }; });
        }
      },
      { key: 'infraccion', label: 'Infracción', required: true, maxlength: 100 },
      { key: 'unidadJudicial', label: 'Unidad judicial', required: true, maxlength: 120 },
      {
        key: 'medidaId', label: 'Medida socioeducativa', type: 'select', num: true, required: true,
        options: function (v, item) {
          return Store.list('medidas').filter(function (m) { return m.activo || (item && m.id === item.medidaId); })
            .map(function (m) { return { value: m.id, label: m.nombre }; });
        }
      },
      {
        key: 'duracionMeses', label: 'Duración (meses)', type: 'number', required: true, min: 1,
        validate: function (v, data) {
          var m = Store.get('medidas', data.medidaId);
          if (m && v > m.duracionMaxMeses) return 'Supera el máximo de la medida (' + m.duracionMaxMeses + ' meses).';
        }
      },
      {
        key: 'fechaIngreso', label: 'Fecha de ingreso', type: 'date', required: true, max: today
      },
      {
        key: 'estado', label: 'Estado', type: 'select', required: true,
        options: function () { return [{ value: 'activo', label: 'Activo' }, { value: 'cerrado', label: 'Cerrado' }]; }
      },
      {
        key: 'fechaCierre', label: 'Fecha de cierre', type: 'date', required: true, max: today,
        showIf: function (v) { return v.estado === 'cerrado'; },
        validate: function (v, data) { if (data.fechaIngreso && v < data.fechaIngreso) return 'No puede ser anterior a la fecha de ingreso.'; }
      },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', maxlength: 300, full: true }
    ],
    beforeSave: function (d, item) {
      var a = Store.get('adolescentes', d.adolescenteId);
      d.uzdiId = a.uzdiId;
      if (item) d.numero = item.numero; else d.numero = nextNumber();
      if (d.estado !== 'cerrado') d.fechaCierre = null;
      return d;
    },
    deleteAction: {
      label: 'Eliminar', toast: 'Expediente eliminado.',
      confirmMsg: function (e) { return '¿Eliminar el expediente ' + e.numero + '? Esta acción no se puede deshacer.'; }
    },
    detailTitle: function (e) { return 'Expediente ' + e.numero; },
    detail: function (e) {
      var a = adol(e), m = Store.get('medidas', e.medidaId);
      return UI.dl([
        ['N° de expediente', e.numero], ['Estado', e.estado === 'activo' ? 'Activo' : 'Cerrado'],
        ['Adolescente', a ? a.nombres + ' ' + a.apellidos + ' (C.I. ' + a.cedula + ')' : '—'], ['UZDI', Store.name('uzdis', e.uzdiId)],
        ['Infracción', e.infraccion], ['Unidad judicial', e.unidadJudicial],
        ['Medida socioeducativa', m ? m.nombre + ' — ' + m.tipo : '—'], ['Duración', e.duracionMeses + ' mes(es)'],
        ['Fecha de ingreso', UI.fmtDate(e.fechaIngreso)],
        [e.estado === 'cerrado' ? 'Fecha de cierre' : 'Fin previsto de la medida', UI.fmtDate(e.estado === 'cerrado' ? e.fechaCierre : UI.addMonths(e.fechaIngreso, e.duracionMeses))],
        ['Observaciones', e.observaciones]
      ]);
    }
  });
};
