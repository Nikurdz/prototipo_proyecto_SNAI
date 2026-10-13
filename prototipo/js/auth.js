/* Autenticación, permisos por perfil y alcance por UZDI (RF-21, RF-10, RF-12). */
(function () {
  var ALL = ['ver', 'crear', 'editar', 'eliminar'];
  var MODULES = [
    { key: 'usuarios', label: 'Usuarios', actions: ALL },
    { key: 'permisos', label: 'Permisos y perfiles', actions: ALL },
    { key: 'adolescentes', label: 'Adolescentes', actions: ALL },
    { key: 'expedientes', label: 'Expedientes', actions: ALL },
    { key: 'gdos', label: 'GDOs', actions: ALL },
    { key: 'medidas', label: 'Medidas socioeducativas', actions: ALL },
    { key: 'uzdis', label: 'UZDIs (consulta)', actions: ['ver'] },
    { key: 'informes', label: 'Informes', actions: ['ver'] }
  ];
  var MAX_INTENTOS = 3;
  var BLOQUEO_MS = 2 * 60 * 1000;
  var SUPER = 1; // id del perfil Superadministrador

  function attempts() {
    try { return JSON.parse(window.localStorage.getItem(Store.attemptsKey)) || {}; } catch (e) { return {}; }
  }
  function saveAttempts(a) {
    try { window.localStorage.setItem(Store.attemptsKey, JSON.stringify(a)); } catch (e) { }
  }

  window.Auth = {
    MODULES: MODULES, ACTIONS: ALL, SUPER: SUPER, MAX_INTENTOS: MAX_INTENTOS,

    current: function () {
      var id = Store.sessionGet();
      return id ? Store.get('usuarios', id) : null;
    },
    isSuper: function () {
      var u = this.current();
      return !!u && u.perfilId === SUPER;
    },
    perfilName: function (u) { return u ? Store.name('perfiles', u.perfilId) : ''; },

    login: function (ident, clave) {
      var key = String(ident || '').trim().toLowerCase();
      if (!key || !clave) return { ok: false, error: 'Ingrese su usuario (o correo) y su contraseña.' };
      var att = attempts();
      var rec = att[key] || { n: 0, until: 0 };
      if (rec.until > Date.now()) {
        var s = Math.ceil((rec.until - Date.now()) / 1000);
        return { ok: false, error: 'Acceso bloqueado temporalmente por intentos fallidos. Intente nuevamente en ' + s + ' s.' };
      }
      var u = Store.list('usuarios').filter(function (x) {
        return x.usuario.toLowerCase() === key || x.correo.toLowerCase() === key;
      })[0];
      var passOk = !!u && u.clave === clave;
      if (!passOk) {
        rec.n = (rec.n || 0) + 1;
        var msg;
        if (rec.n >= MAX_INTENTOS) {
          rec.until = Date.now() + BLOQUEO_MS; rec.n = 0;
          msg = 'Se superó el número de intentos permitidos. El acceso se bloqueó por 2 minutos.';
        } else {
          msg = 'Credenciales incorrectas o usuario no registrado. Intentos restantes: ' + (MAX_INTENTOS - rec.n) + '.';
        }
        att[key] = rec; saveAttempts(att);
        return { ok: false, error: msg };
      }
      if (!u.activo) return { ok: false, error: 'Su usuario está inactivo. Contacte al administrador.' };
      delete att[key]; saveAttempts(att);
      Store.sessionSet(u.id);
      var ses = Store.list('sesiones');
      if (ses.length >= 40) Store.remove('sesiones', ses[0].id);
      Store.create('sesiones', { usuarioId: u.id, fecha: new Date().toISOString(), evento: 'Inicio de sesión' });
      return { ok: true, user: u };
    },
    logout: function () { Store.sessionClear(); },

    can: function (mod, act) {
      var u = this.current();
      if (!u) return false;
      if (u.perfilId === SUPER) return true;
      var p = Store.db().permisos[u.perfilId];
      return !!(p && p[mod] && p[mod].indexOf(act || 'ver') >= 0);
    },

    /* Alcance por UZDI: el Superadministrador ve todo; el resto solo su unidad. */
    scope: function (items, key) {
      var u = this.current();
      key = key || 'uzdiId';
      if (!u || u.perfilId === SUPER || u.uzdiId == null) return items;
      return items.filter(function (x) { return x[key] === u.uzdiId; });
    },
    scopeUzdis: function () {
      var u = this.current();
      var all = Store.list('uzdis');
      if (!u || u.perfilId === SUPER || u.uzdiId == null) return all;
      return all.filter(function (x) { return x.id === u.uzdiId; });
    }
  };
})();
