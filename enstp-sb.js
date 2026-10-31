/* =====================================================================
   ENSTP — إعداد Supabase المشترك لصفحات scolarite و scolarite-admin
   ===================================================================== */
(function () {
  var CONFIG = {
    url: 'https://fynbdujbtbqsoahhsylo.supabase.co',
    key: 'sb_publishable_t1yPBiRKFGvdgQKYfZvL8w_LbloOd2f'
  };

  var u = String(CONFIG.url || '').trim().replace(/\s+/g, '');
  if (u && !/^https?:\/\//i.test(u)) u = 'https://' + u;
  u = u.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  if (/^https:\/\/[a-z0-9]{12,30}$/i.test(u)) u += '.supabase.co';
  var BASE = u, KEY = String(CONFIG.key || '').trim();

  function headers(token) {
    var h = { apikey: KEY, 'Content-Type': 'application/json' };
    var bearer = token || (KEY.indexOf('eyJ') === 0 ? KEY : '');
    if (bearer) h.Authorization = 'Bearer ' + bearer;
    return h;
  }

  async function call(path, o) {
    o = o || {};
    var h = headers(o.token);
    if (o.prefer) h.Prefer = o.prefer;
    var r = await fetch(BASE + path, { method: o.method || 'GET', headers: h, body: o.body ? JSON.stringify(o.body) : undefined });
    var t = ''; try { t = await r.text(); } catch (e) {}
    if (!r.ok) { if (/^\s*</.test(t)) throw new Error('HTML ' + r.status); throw new Error(r.status + ' ' + t); }
    return t ? JSON.parse(t) : null;
  }

  async function auth(grant, body) {
    var r = await fetch(BASE + '/auth/v1/token?grant_type=' + grant, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    var t = ''; try { t = await r.text(); } catch (e) {}
    if (!r.ok) { if (/^\s*</.test(t)) throw new Error('HTML ' + r.status); throw new Error(r.status + ' ' + t); }
    return JSON.parse(t);
  }

  function explain(e) {
    console.error('[ENSTP-SB]', e);
    var m = String((e && e.message) || e);
    if (/^HTML|<html/i.test(m)) return 'الطلب لم يصل إلى Supabase بل إلى موقعك: راجع url في ملف enstp-sb.js.';
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'تعذّر الاتصال بالخادم: تحقق من الإنترنت ومن عنوان url.';
    if (/invalid_credentials|Invalid login/i.test(m)) return 'البريد الإلكتروني أو كلمة السر غير صحيحة.';
    if (/email_not_confirmed/i.test(m)) return 'الحساب غير مؤكَّد: فعّل Auto Confirm User في Supabase.';
    if (/PGRST202|Could not find the function|does not exist/i.test(m)) return 'قاعدة البيانات غير مهيأة: شغّل ملف scolarite-setup.sql في SQL Editor.';
    if (/JWT expired|PGRST301|^401/i.test(m)) return 'انتهت الجلسة أو المفتاح غير مقبول: سجّل الدخول من جديد.';
    return 'حدث خطأ: ' + m.slice(0, 140);
  }

  window.SB = {
    ready: !!(BASE && KEY),
    base: BASE,
    rpc: function (fn, args, token) { return call('/rest/v1/rpc/' + fn, { method: 'POST', body: args || {}, token: token }); },
    rest: call,
    login: function (email, password) { return auth('password', { email: email, password: password }); },
    refresh: function (rt) { return auth('refresh_token', { refresh_token: rt }); },
    explain: explain
  };
})();
