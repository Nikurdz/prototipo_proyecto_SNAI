/* RF-01 Gestión de usuarios (apoya RF-11 Obtención de UZDIs) */
window.Views = window.Views || {};
Views.usuarios = function (root) {
  var esc = UI.esc;
  UI.crud(root, {
    module: 'usuarios', collection: 'usuarios', title: 'Gestión de usuarios', singular: 'usuario',
    subtitle: 'Personas autorizadas a utilizar el sistema.',
    note: Auth.isSuper() ? '' : 'Solo se muestran los usuarios de su UZDI.',
    getItems: function () { return Auth.scope(Store.list('usuarios')); },
    searchText: function (u) { return [u.nombres, u.apellidos, u.usuario, u.correo, u.cedula, Store.name('perfiles', u.perfilId)].join(' '); },
    sort: function (a, b) { return a.apellidos.localeCompare(b.apellidos); },
    filters: [{
      key: 'perfil', label: 'Perfil', default: '',
      options: [{ value: '', label: 'Todos' }].concat(Store.list('perfiles').map(function (p) { return { value: p.id, label: p.nombre }; })),
      match: function (u, v) { return String(u.perfilId) === String(v); }
    }],
    rowState: function (u) { return u.activo ? 'ok' : 'muted'; },
    columns: [
      { label: 'Nombre', render: function (u) { return '<strong>' + esc(u.nombres + ' ' + u.apellidos) + '</strong><br><span class="muted">' + esc(u.correo) + '</span>'; } },
      { label: 'Usuario', render: function (u) { return esc(u.usuario); } },
      { label: 'Perfil', render: function (u) { return UI.badge(Store.name('perfiles', u.perfilId), 'info'); } },
      { label: 'UZDI', render: function (u) { return esc(u.uzdiId ? Store.name('uzdis', u.uzdiId) : 'Todas'); } },
      { label: 'Estado', render: function (u) { return UI.badge(u.activo ? 'Activo' : 'Inactivo', u.activo ? 'ok' : 'muted'); } }
    ],
    defaults: function () { return { activo: true, uzdiId: Auth.current().uzdiId }; },
    fields: [
      { key: 'nombres', label: 'Nombres', required: true, maxlength: 60 },
      { key: 'apellidos', label: 'Apellidos', required: true, maxlength: 60 },
      { key: 'cedula', label: 'Cédula', required: true, maxlength: 10, pattern: /^\d{10}$/, patternMsg: 'La cédula debe tener 10 dígitos.' },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'usuario', label: 'Nombre de usuario', required: true, maxlength: 30, pattern: /^[A-Za-z0-9._-]{3,}$/, patternMsg: 'Mínimo 3 caracteres (letras, números, . _ -).' },
      {
        key: 'clave', label: 'Contraseña', type: 'password', maxlength: 40,
        help: 'En edición, déjela vacía para conservar la actual.',
        validate: function (v, data, item) { if (!item && !v) return 'Este campo es obligatorio.'; if (v && v.length < 6) return 'Mínimo 6 caracteres.'; }
      },
      {
        key: 'perfilId', label: 'Perfil / rol', type: 'select', num: true, required: true,
        options: function () {
          return Store.list('perfiles').filter(function (p) { return Auth.isSuper() || p.id !== Auth.SUPER; })
            .map(function (p) { return { value: p.id, label: p.nombre }; });
        }
      },
      {
        key: 'uzdiId', label: 'UZDI', type: 'select', num: true, required: true,
        showIf: function (v) { return Number(v.perfilId) !== Auth.SUPER; },
        options: function () { return Auth.scopeUzdis().map(function (z) { return { value: z.id, label: z.nombre }; }); }
      },
      { key: 'activo', label: 'Estado', type: 'checkbox', checkLabel: 'Usuario activo' }
    ],
    beforeSave: function (d, item) {
      var others = Store.list('usuarios').filter(function (x) { return !item || x.id !== item.id; });
      if (others.some(function (x) { return x.usuario.toLowerCase() === d.usuario.toLowerCase(); })) throw new Error('El nombre de usuario ya está registrado.');
      if (others.some(function (x) { return x.correo.toLowerCase() === d.correo.toLowerCase(); })) throw new Error('El correo ya está registrado.');
      if (others.some(function (x) { return x.cedula === d.cedula; })) throw new Error('La cédula ya está registrada.');
      if (item && !d.clave) d.clave = item.clave;
      if (d.perfilId === Auth.SUPER) d.uzdiId = null;
      if (item && item.id === Auth.current().id && !d.activo) throw new Error('No puede desactivar su propio usuario.');
      return d;
    },
    deleteAction: {
      label: 'Eliminar', toast: 'Usuario eliminado.',
      check: function (u) { return u.id === Auth.current().id ? 'No puede eliminar su propio usuario.' : null; },
      confirmMsg: function (u) { return '¿Eliminar al usuario ' + u.nombres + ' ' + u.apellidos + '? Esta acción no se puede deshacer.'; }
    },
    detail: function (u) {
      return UI.dl([
        ['Nombre completo', u.nombres + ' ' + u.apellidos], ['Cédula', u.cedula], ['Correo', u.correo], ['Usuario', u.usuario],
        ['Perfil', Store.name('perfiles', u.perfilId)], ['UZDI', u.uzdiId ? Store.name('uzdis', u.uzdiId) : 'Todas'], ['Estado', u.activo ? 'Activo' : 'Inactivo']
      ]);
    },
    detailTitle: function (u) { return u.nombres + ' ' + u.apellidos; }
  });
};
