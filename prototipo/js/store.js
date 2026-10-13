/* Mini base de datos sobre localStorage (simula las tablas del backend). */
(function () {
  var KEY = 'snai_proto_v1';
  var SKEY = 'snai_session_v1';
  var ATT = 'snai_attempts_v1';
  var mem = null;
  var memSession = null;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sin persistencia */ } }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) { } }

  function initSeq(d) {
    d.seq = {};
    Object.keys(d).forEach(function (c) {
      if (Array.isArray(d[c])) {
        d.seq[c] = d[c].reduce(function (m, x) { return Math.max(m, x.id || 0); }, 0);
      }
    });
    d.seq.perfiles = Math.max(d.seq.perfiles || 0, 100);
  }

  function load() {
    if (mem) return mem;
    var raw = lsGet(KEY);
    if (raw) { try { mem = JSON.parse(raw); } catch (e) { mem = null; } }
    if (!mem || mem.version !== window.SEED.version) {
      mem = clone(window.SEED);
      initSeq(mem);
      persist();
    }
    return mem;
  }
  function persist() { lsSet(KEY, JSON.stringify(mem)); }

  window.Store = {
    db: load,
    save: function () { load(); persist(); },
    reset: function () {
      mem = clone(window.SEED); initSeq(mem); persist();
      memSession = null;
      try { window.sessionStorage.removeItem(SKEY); } catch (e) { }
      lsDel(ATT);
    },
    list: function (c) { return load()[c].slice(); },
    get: function (c, id) {
      id = Number(id);
      return load()[c].filter(function (x) { return x.id === id; })[0] || null;
    },
    create: function (c, obj) {
      var d = load();
      d.seq[c] = (d.seq[c] || 0) + 1;
      var rec = Object.assign({}, obj, { id: d.seq[c] });
      d[c].push(rec);
      persist();
      return rec;
    },
    update: function (c, id, patch) {
      var rec = this.get(c, id);
      if (!rec) throw new Error('Registro no encontrado');
      Object.assign(rec, patch);
      persist();
      return rec;
    },
    remove: function (c, id) {
      var d = load();
      d[c] = d[c].filter(function (x) { return x.id !== Number(id); });
      persist();
    },
    name: function (c, id) {
      var r = this.get(c, id);
      return r ? r.nombre : '—';
    },
    sessionGet: function () {
      try { var v = window.sessionStorage.getItem(SKEY); return v ? Number(v) : memSession; } catch (e) { return memSession; }
    },
    sessionSet: function (id) {
      memSession = id;
      try { window.sessionStorage.setItem(SKEY, String(id)); } catch (e) { }
    },
    sessionClear: function () {
      memSession = null;
      try { window.sessionStorage.removeItem(SKEY); } catch (e) { }
    },
    attemptsKey: ATT
  };
})();
