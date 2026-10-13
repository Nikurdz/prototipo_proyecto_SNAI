/* Router por hash + layout de la aplicación. */
(function () {
  var esc = UI.esc;
  var ROUTES = [
    { group: 'Principal', path: 'dashboard', label: 'Inicio', icon: 'home', view: 'dashboard' },
    { group: 'Gestión', path: 'adolescentes', label: 'Adolescentes', icon: 'user', module: 'adolescentes', view: 'adolescentes' },
    { group: 'Gestión', path: 'expedientes', label: 'Expedientes', icon: 'folder', module: 'expedientes', view: 'expedientes' },
    { group: 'Gestión', path: 'medidas', label: 'Medidas', icon: 'clip', module: 'medidas', view: 'medidas' },
    { group: 'Gestión', path: 'gdos', label: 'GDOs', icon: 'alert', module: 'gdos', view: 'gdos' },
    { group: 'Administración', path: 'usuarios', label: 'Usuarios', icon: 'users', module: 'usuarios', view: 'usuarios' },
    { group: 'Administración', path: 'permisos', label: 'Permisos y perfiles', icon: 'shield', module: 'permisos', view: 'permisos' },
    { group: 'Administración', path: 'uzdis', label: 'UZDIs', icon: 'pin', module: 'uzdis', view: 'uzdis' },
    { group: 'Reportes', path: 'informes', label: 'Informes', icon: 'chart', module: 'informes', view: 'informes' }
  ];
  var SOON = ['Fichas (RF-06)', 'Representantes / familiares (RF-07)', 'Contexto familiar (RF-08)', 'Vínculos (RF-13)', 'Talleres (RF-14)', 'Asistencia a talleres (RF-15)'];

  function currentPath() { return location.hash.replace(/^#\/?/, '') || 'dashboard'; }

  function menu(path) {
    var groups = [];
    ROUTES.forEach(function (r) {
      if (r.module && !Auth.can(r.module, 'ver')) return;
      var g = groups.filter(function (x) { return x.name === r.group; })[0];
      if (!g) { g = { name: r.group, items: [] }; groups.push(g); }
      g.items.push(r);
    });
    var h = groups.map(function (g) {
      return '<div class="nav-group"><span class="nav-title">' + esc(g.name) + '</span>' + g.items.map(function (r) {
        return '<a class="nav-link' + (r.path === path ? ' active' : '') + '" href="#/' + r.path + '">' + UI.icon(r.icon) + '<span>' + esc(r.label) + '</span></a>';
      }).join('') + '</div>';
    }).join('');
    h += '<div class="nav-group"><span class="nav-title">Próximo sprint</span>' + SOON.map(function (s) {
      return '<span class="nav-link disabled" title="Disponible en un próximo sprint">' + UI.icon('lock') + '<span>' + esc(s) + '</span></span>';
    }).join('') + '</div>';
    return h;
  }

  window.App = {
    render: function () {
      var app = document.getElementById('app');
      var user = Auth.current();
      document.getElementById('modal-root').innerHTML = '';
      if (!user) { document.body.classList.remove('in-app'); Views.login(app); return; }
      document.body.classList.add('in-app');
      var path = currentPath();
      var route = ROUTES.filter(function (r) { return r.path === path; })[0] || ROUTES[0];
      app.innerHTML =
        '<div class="layout"><aside class="sidebar" id="sidebar"><div class="side-brand"><span class="brand-mark sm">SNAI</span><div><strong>UZDI</strong><small>Sistema de casos</small></div></div>' +
        '<nav aria-label="Principal">' + menu(route.path) + '</nav>' +
        '<div class="side-foot"><button class="link light" id="reset-demo">Restablecer datos de demostración</button></div></aside>' +
        '<div class="main"><header class="topbar"><button class="icon-btn menu-btn" id="menu-btn" aria-label="Abrir menú">☰</button>' +
        '<div class="who"><strong>' + esc(user.nombres + ' ' + user.apellidos) + '</strong><span>' + esc(Auth.perfilName(user)) + '</span></div>' +
        '<span class="uzdi-pill">' + esc(user.uzdiId ? Store.name('uzdis', user.uzdiId) : 'Todas las UZDI') + '</span>' +
        '<button class="btn sm" id="logout">Cerrar sesión</button></header>' +
        '<main id="view" class="view"></main></div></div>';
      var view = app.querySelector('#view');
      if (route.module && !Auth.can(route.module, 'ver')) {
        view.innerHTML = '<div class="denied"><h1>Acceso restringido</h1><p>Su perfil no tiene autorización para ingresar a este módulo.</p><a class="btn primary" href="#/dashboard">Volver al inicio</a></div>';
      } else {
        Views[route.view](view);
      }
      app.querySelector('#logout').addEventListener('click', function () { Auth.logout(); location.hash = ''; App.render(); });
      app.querySelector('#menu-btn').addEventListener('click', function () { document.getElementById('sidebar').classList.toggle('open'); });
      app.querySelector('#reset-demo').addEventListener('click', function () {
        UI.confirm({ title: 'Restablecer datos', message: 'Se perderán los cambios y se cerrará la sesión. Volverán los datos de demostración.', confirmText: 'Restablecer', danger: true })
          .then(function (y) { if (y) { Store.reset(); location.hash = ''; App.render(); UI.toast('Datos de demostración restablecidos.'); } });
      });
    },
    start: function () {
      window.addEventListener('hashchange', App.render);
      App.render();
    }
  };
})();
