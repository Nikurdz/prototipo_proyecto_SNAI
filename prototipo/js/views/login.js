/* RF-21 Ingreso al sistema */
window.Views = window.Views || {};
Views.login = function (app) {
  var esc = UI.esc;
  var demos = Store.list('usuarios').filter(function (u) { return u.id <= 7; });
  app.innerHTML =
    '<div class="login-page">' +
    '<section class="login-brand"><div class="folder-tab">SNAI</div>' +
    '<div><h1>UZDI</h1><p>Casos de las Unidades Zonales de Desarrollo Integral: adolescentes, expedientes y medidas socioeducativas en un solo lugar.</p></div>' +
    '<p class="proto-tag">Prototipo del sprint inicial. Todos los datos son ficticios.</p></section>' +
    '<section class="login-panel"><form id="login-form" class="login-card" novalidate>' +
    '<h2>Ingreso al sistema</h2><p class="muted">Use las credenciales que le entregó el administrador.</p>' +
    '<div class="field"><label for="lu">Usuario o correo</label><input id="lu" name="u" autocomplete="username" autofocus></div>' +
    '<div class="field"><label for="lp">Contraseña</label><input id="lp" name="p" type="password" autocomplete="current-password"></div>' +
    '<div class="form-error" id="login-err" role="alert" hidden></div>' +
    '<button class="btn primary block" type="submit">Ingresar</button>' +
    '<div class="demo"><p class="muted">Para la demostración, elija un perfil. La contraseña es <code>Snai2026</code>.</p><div class="chips">' +
    demos.map(function (u) {
      return '<button type="button" class="chip" data-u="' + esc(u.usuario) + '">' + esc(Store.name('perfiles', u.perfilId)) + '</button>';
    }).join('') + '</div>' +
    '<button type="button" class="link" id="reset-demo">Restablecer datos de demostración</button></div>' +
    '</form></section></div>';

  var form = app.querySelector('#login-form');
  var err = app.querySelector('#login-err');
  app.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      form.u.value = c.dataset.u; form.p.value = 'Snai2026'; form.p.focus();
    });
  });
  app.querySelector('#reset-demo').addEventListener('click', function () {
    UI.confirm({ title: 'Restablecer datos', message: 'Se perderán los cambios hechos en el prototipo y volverán los datos de demostración.', confirmText: 'Restablecer', danger: true })
      .then(function (y) { if (y) { Store.reset(); UI.toast('Datos de demostración restablecidos.'); } });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var r = Auth.login(form.u.value, form.p.value);
    if (!r.ok) { err.textContent = r.error; err.hidden = false; form.p.value = ''; form.p.focus(); return; }
    location.hash = '#/dashboard';
    App.render();
  });
};
