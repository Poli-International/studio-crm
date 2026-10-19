// Optional studio password.
//
// Off by default: a studio with one trusted computer needs none. When the
// owner sets one (Settings), every device must sign in before it sees a page
// or an /api answer. On top of it, staff can have their own logins with a level
// (Settings > Staff): the sign-in page then asks who you are. The studio password
// keeps working and signs in as administrator.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const COOKIE = 'studio_session';
const SESSION_DAYS = 30;
const hashOf = (password, salt) => crypto.scryptSync(String(password), salt, 64);

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Studio CRM: sign in</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0B1120;color:#F8FAFC;font-family:system-ui,sans-serif}
form{background:#0F172A;border:1px solid #334155;border-radius:16px;padding:28px;width:min(92vw,360px)}h1{font-size:1.2rem;margin:0 0 6px}
p{color:#94A3B8;font-size:.85rem;margin:0 0 18px}input{width:100%;box-sizing:border-box;padding:11px 12px;background:#1E293B;border:1px solid #475569;border-radius:8px;color:#F8FAFC;font-size:1rem}
button{margin-top:14px;width:100%;padding:11px;background:#2563EB;color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.95rem;cursor:pointer}
#error{color:#FCA5A5;font-size:.85rem;min-height:1.2em;margin-top:10px}</style></head>
<body><form id="login-form"><h1>Studio CRM</h1><p>This studio is protected by a password.</p>
<label for="login-password" style="display:block;font-size:.8rem;color:#94A3B8;margin-bottom:4px">Studio password</label>
<div id="login-who-row" style="display:none;margin-bottom:10px;"><label for="login-who" style="display:block;font-size:.8rem;color:#94A3B8;margin-bottom:4px">Who are you?</label>
<select id="login-who" style="width:100%;box-sizing:border-box;padding:11px 12px;background:#1E293B;border:1px solid #475569;border-radius:8px;color:#F8FAFC;font-size:1rem"></select></div>
<input type="password" id="login-password" autocomplete="current-password" required autofocus>
<button type="submit" id="login-submit">Sign in</button><div id="error" role="alert"></div></form>
<script>
var WORDS = {"fr": {"This studio is protected by a password.": "Ce studio est protégé par un mot de passe.", "Studio password": "Mot de passe du studio", "Who are you?": "Qui êtes-vous ?", "Your password": "Votre mot de passe", "Sign in": "Se connecter", "Could not sign in": "Connexion impossible", "The server did not answer": "Le serveur n'a pas répondu", "Wrong password": "Mot de passe incorrect", "Too many wrong passwords. Wait half a minute and try again.": "Trop de mots de passe incorrects. Attendez une demi-minute et réessayez.", "Welcome to Studio CRM": "Bienvenue dans Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Créez le mot de passe du studio. Chaque ordinateur, tablette et téléphone le demandera une fois avant d'ouvrir le CRM, pour que personne d'autre sur votre réseau ne puisse voir ou modifier vos clients.", "Studio password (at least 8 characters)": "Mot de passe du studio (8 caractères minimum)", "The same password again": "Le même mot de passe une deuxième fois", "Create password and open the CRM": "Créer le mot de passe et ouvrir le CRM", "Continue without a password (you can set one later in Settings)": "Continuer sans mot de passe (vous pourrez en définir un plus tard dans les Paramètres)", "The two passwords are not the same": "Les deux mots de passe ne sont pas identiques", "Could not save": "Enregistrement impossible", "Use at least 8 characters": "Utilisez au moins 8 caractères"}, "de": {"This studio is protected by a password.": "Dieses Studio ist durch ein Passwort geschützt.", "Studio password": "Studio-Passwort", "Who are you?": "Wer sind Sie?", "Your password": "Ihr Passwort", "Sign in": "Anmelden", "Could not sign in": "Anmeldung nicht möglich", "The server did not answer": "Der Server hat nicht geantwortet", "Wrong password": "Falsches Passwort", "Too many wrong passwords. Wait half a minute and try again.": "Zu viele falsche Passwörter. Warten Sie eine halbe Minute und versuchen Sie es erneut.", "Welcome to Studio CRM": "Willkommen bei Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Legen Sie das Studio-Passwort an. Jeder Computer, jedes Tablet und jedes Telefon fragt einmal danach, bevor es das CRM öffnet, damit niemand sonst in Ihrem Netzwerk Ihre Kunden sehen oder ändern kann.", "Studio password (at least 8 characters)": "Studio-Passwort (mindestens 8 Zeichen)", "The same password again": "Dasselbe Passwort noch einmal", "Create password and open the CRM": "Passwort anlegen und CRM öffnen", "Continue without a password (you can set one later in Settings)": "Ohne Passwort fortfahren (Sie können später in den Einstellungen eines festlegen)", "The two passwords are not the same": "Die beiden Passwörter sind nicht gleich", "Could not save": "Speichern nicht möglich", "Use at least 8 characters": "Verwenden Sie mindestens 8 Zeichen"}, "es": {"This studio is protected by a password.": "Este estudio está protegido con una contraseña.", "Studio password": "Contraseña del estudio", "Who are you?": "¿Quién es usted?", "Your password": "Su contraseña", "Sign in": "Entrar", "Could not sign in": "No se pudo entrar", "The server did not answer": "El servidor no respondió", "Wrong password": "Contraseña incorrecta", "Too many wrong passwords. Wait half a minute and try again.": "Demasiadas contraseñas incorrectas. Espere medio minuto y vuelva a intentarlo.", "Welcome to Studio CRM": "Bienvenido a Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Cree la contraseña del estudio. Cada ordenador, tableta y teléfono la pedirá una vez antes de abrir el CRM, para que nadie más en su red pueda ver o cambiar sus clientes.", "Studio password (at least 8 characters)": "Contraseña del estudio (al menos 8 caracteres)", "The same password again": "La misma contraseña otra vez", "Create password and open the CRM": "Crear la contraseña y abrir el CRM", "Continue without a password (you can set one later in Settings)": "Continuar sin contraseña (puede establecer una más tarde en Ajustes)", "The two passwords are not the same": "Las dos contraseñas no coinciden", "Could not save": "No se pudo guardar", "Use at least 8 characters": "Use al menos 8 caracteres"}, "it": {"This studio is protected by a password.": "Questo studio è protetto da una password.", "Studio password": "Password dello studio", "Who are you?": "Chi siete?", "Your password": "La vostra password", "Sign in": "Accedi", "Could not sign in": "Accesso non riuscito", "The server did not answer": "Il server non ha risposto", "Wrong password": "Password errata", "Too many wrong passwords. Wait half a minute and try again.": "Troppe password errate. Attendete mezzo minuto e riprovate.", "Welcome to Studio CRM": "Benvenuti in Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Create la password dello studio. Ogni computer, tablet e telefono la chiederà una volta prima di aprire il CRM, così nessun altro sulla vostra rete potrà vedere o modificare i vostri clienti.", "Studio password (at least 8 characters)": "Password dello studio (almeno 8 caratteri)", "The same password again": "La stessa password di nuovo", "Create password and open the CRM": "Crea la password e apri il CRM", "Continue without a password (you can set one later in Settings)": "Continua senza password (potete impostarla più tardi nelle Impostazioni)", "The two passwords are not the same": "Le due password non coincidono", "Could not save": "Salvataggio non riuscito", "Use at least 8 characters": "Usate almeno 8 caratteri"}, "nl": {"This studio is protected by a password.": "Deze studio is beveiligd met een wachtwoord.", "Studio password": "Studiowachtwoord", "Who are you?": "Wie bent u?", "Your password": "Uw wachtwoord", "Sign in": "Aanmelden", "Could not sign in": "Aanmelden mislukt", "The server did not answer": "De server gaf geen antwoord", "Wrong password": "Verkeerd wachtwoord", "Too many wrong passwords. Wait half a minute and try again.": "Te veel verkeerde wachtwoorden. Wacht een halve minuut en probeer het opnieuw.", "Welcome to Studio CRM": "Welkom bij Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Maak het studiowachtwoord aan. Elke computer, tablet en telefoon vraagt er één keer om voordat het CRM opent, zodat niemand anders op uw netwerk uw klanten kan zien of wijzigen.", "Studio password (at least 8 characters)": "Studiowachtwoord (minstens 8 tekens)", "The same password again": "Hetzelfde wachtwoord nog een keer", "Create password and open the CRM": "Wachtwoord aanmaken en CRM openen", "Continue without a password (you can set one later in Settings)": "Doorgaan zonder wachtwoord (u kunt er later een instellen in Instellingen)", "The two passwords are not the same": "De twee wachtwoorden zijn niet hetzelfde", "Could not save": "Opslaan mislukt", "Use at least 8 characters": "Gebruik minstens 8 tekens"}, "pt": {"This studio is protected by a password.": "Este estúdio está protegido por uma palavra-passe.", "Studio password": "Palavra-passe do estúdio", "Who are you?": "Quem é?", "Your password": "A sua palavra-passe", "Sign in": "Entrar", "Could not sign in": "Não foi possível entrar", "The server did not answer": "O servidor não respondeu", "Wrong password": "Palavra-passe errada", "Too many wrong passwords. Wait half a minute and try again.": "Demasiadas palavras-passe erradas. Aguarde meio minuto e tente de novo.", "Welcome to Studio CRM": "Bem-vindo ao Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Crie a palavra-passe do estúdio. Cada computador, tablet e telemóvel vai pedi-la uma vez antes de abrir o CRM, para que mais ninguém na sua rede possa ver ou alterar os seus clientes.", "Studio password (at least 8 characters)": "Palavra-passe do estúdio (pelo menos 8 caracteres)", "The same password again": "A mesma palavra-passe outra vez", "Create password and open the CRM": "Criar a palavra-passe e abrir o CRM", "Continue without a password (you can set one later in Settings)": "Continuar sem palavra-passe (pode definir uma mais tarde nas Definições)", "The two passwords are not the same": "As duas palavras-passe não são iguais", "Could not save": "Não foi possível guardar", "Use at least 8 characters": "Use pelo menos 8 caracteres"}, "th": {"This studio is protected by a password.": "สตูดิโอนี้ป้องกันด้วยรหัสผ่าน", "Studio password": "รหัสผ่านสตูดิโอ", "Who are you?": "คุณคือใคร?", "Your password": "รหัสผ่านของคุณ", "Sign in": "เข้าสู่ระบบ", "Could not sign in": "เข้าสู่ระบบไม่ได้", "The server did not answer": "เซิร์ฟเวอร์ไม่ตอบสนอง", "Wrong password": "รหัสผ่านไม่ถูกต้อง", "Too many wrong passwords. Wait half a minute and try again.": "ใส่รหัสผ่านผิดหลายครั้งเกินไป รอครึ่งนาทีแล้วลองใหม่", "Welcome to Studio CRM": "ยินดีต้อนรับสู่ Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "สร้างรหัสผ่านสตูดิโอ คอมพิวเตอร์ แท็บเล็ต และโทรศัพท์ทุกเครื่องจะถามรหัสนี้หนึ่งครั้งก่อนเปิด CRM เพื่อไม่ให้คนอื่นในเครือข่ายของคุณเห็นหรือแก้ไขข้อมูลลูกค้าได้", "Studio password (at least 8 characters)": "รหัสผ่านสตูดิโอ (อย่างน้อย 8 ตัวอักษร)", "The same password again": "รหัสผ่านเดิมอีกครั้ง", "Create password and open the CRM": "สร้างรหัสผ่านและเปิด CRM", "Continue without a password (you can set one later in Settings)": "ดำเนินการต่อโดยไม่มีรหัสผ่าน (ตั้งภายหลังได้ในการตั้งค่า)", "The two passwords are not the same": "รหัสผ่านทั้งสองไม่ตรงกัน", "Could not save": "บันทึกไม่ได้", "Use at least 8 characters": "ใช้อย่างน้อย 8 ตัวอักษร"}};
var LANG = (function () { var l = null; try { l = localStorage.getItem('studio_crm_lang') || localStorage.getItem('poli_tools_language'); } catch (e) {}
  return (l || (navigator.language || 'en')).slice(0, 2).toLowerCase(); })();
function L(en) { return (WORDS[LANG] && WORDS[LANG][en]) || en; }
function translatePage() {
  document.documentElement.lang = LANG;
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) { var t = n.nodeValue.trim(); if (t && L(t) !== t) n.nodeValue = n.nodeValue.replace(t, L(t)); }
}
translatePage();
</script>
<script>
// staff logins: everyone signs in with their own name and password (the studio password still works)
fetch('/api/access/people').then(function (r) { return r.json(); }).then(function (people) {
  if (!people.length) return;
  var who = document.getElementById('login-who');
  // the studio password first: whoever signed in with it before keeps doing so
  who.innerHTML = '<option value="">' + L('Studio password') + '</option>' + people.map(function (p) { return '<option value="' + p.id + '">' + p.name.replace(/[<>&"]/g, '') + '</option>'; }).join('');
  document.getElementById('login-who-row').style.display = '';
  document.querySelector('label[for="login-password"]').textContent = L('Your password');
}).catch(function () {});
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var error = document.getElementById('error');
  error.textContent = '';
  try {
    var res = await fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: document.getElementById('login-password').value, staff_id: (document.getElementById('login-who') || {}).value || undefined }) });
    if (res.ok) { window.location.reload(); return; }
    error.textContent = L((await res.json()).error || 'Could not sign in');
  } catch (err) { error.textContent = L('The server did not answer'); }
});
</script></body></html>`;

// First start: the studio chooses before anything else loads. No default password: everyone
// who downloads the CRM would know it.
const SETUP_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Studio CRM: first start</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0B1120;color:#F8FAFC;font-family:system-ui,sans-serif}
form{background:#0F172A;border:1px solid #334155;border-radius:16px;padding:28px;width:min(92vw,420px)}h1{font-size:1.25rem;margin:0 0 8px}
p{color:#94A3B8;font-size:.88rem;margin:0 0 16px;line-height:1.5}label{display:block;font-size:.8rem;color:#94A3B8;margin:10px 0 4px}
input{width:100%;box-sizing:border-box;padding:11px 12px;background:#1E293B;border:1px solid #475569;border-radius:8px;color:#F8FAFC;font-size:1rem}
button{margin-top:16px;width:100%;padding:11px;background:#2563EB;color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.95rem;cursor:pointer}
.skip{display:block;margin-top:14px;background:none;border:none;color:#94A3B8;font-size:.82rem;text-decoration:underline;cursor:pointer;width:auto;padding:0;font-weight:400}
#error{color:#FCA5A5;font-size:.85rem;min-height:1.2em;margin-top:10px}</style></head>
<body><form id="setup-form"><h1>Welcome to Studio CRM</h1>
<p>Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.</p>
<label for="setup-password">Studio password (at least 8 characters)</label>
<input type="password" id="setup-password" autocomplete="new-password" required minlength="8" autofocus>
<label for="setup-again">The same password again</label>
<input type="password" id="setup-again" autocomplete="new-password" required minlength="8">
<button type="submit" id="setup-submit">Create password and open the CRM</button>
<button type="button" class="skip" id="setup-skip">Continue without a password (you can set one later in Settings)</button>
<div id="error" role="alert"></div></form>
<script>
var WORDS = {"fr": {"This studio is protected by a password.": "Ce studio est protégé par un mot de passe.", "Studio password": "Mot de passe du studio", "Who are you?": "Qui êtes-vous ?", "Your password": "Votre mot de passe", "Sign in": "Se connecter", "Could not sign in": "Connexion impossible", "The server did not answer": "Le serveur n'a pas répondu", "Wrong password": "Mot de passe incorrect", "Too many wrong passwords. Wait half a minute and try again.": "Trop de mots de passe incorrects. Attendez une demi-minute et réessayez.", "Welcome to Studio CRM": "Bienvenue dans Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Créez le mot de passe du studio. Chaque ordinateur, tablette et téléphone le demandera une fois avant d'ouvrir le CRM, pour que personne d'autre sur votre réseau ne puisse voir ou modifier vos clients.", "Studio password (at least 8 characters)": "Mot de passe du studio (8 caractères minimum)", "The same password again": "Le même mot de passe une deuxième fois", "Create password and open the CRM": "Créer le mot de passe et ouvrir le CRM", "Continue without a password (you can set one later in Settings)": "Continuer sans mot de passe (vous pourrez en définir un plus tard dans les Paramètres)", "The two passwords are not the same": "Les deux mots de passe ne sont pas identiques", "Could not save": "Enregistrement impossible", "Use at least 8 characters": "Utilisez au moins 8 caractères"}, "de": {"This studio is protected by a password.": "Dieses Studio ist durch ein Passwort geschützt.", "Studio password": "Studio-Passwort", "Who are you?": "Wer sind Sie?", "Your password": "Ihr Passwort", "Sign in": "Anmelden", "Could not sign in": "Anmeldung nicht möglich", "The server did not answer": "Der Server hat nicht geantwortet", "Wrong password": "Falsches Passwort", "Too many wrong passwords. Wait half a minute and try again.": "Zu viele falsche Passwörter. Warten Sie eine halbe Minute und versuchen Sie es erneut.", "Welcome to Studio CRM": "Willkommen bei Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Legen Sie das Studio-Passwort an. Jeder Computer, jedes Tablet und jedes Telefon fragt einmal danach, bevor es das CRM öffnet, damit niemand sonst in Ihrem Netzwerk Ihre Kunden sehen oder ändern kann.", "Studio password (at least 8 characters)": "Studio-Passwort (mindestens 8 Zeichen)", "The same password again": "Dasselbe Passwort noch einmal", "Create password and open the CRM": "Passwort anlegen und CRM öffnen", "Continue without a password (you can set one later in Settings)": "Ohne Passwort fortfahren (Sie können später in den Einstellungen eines festlegen)", "The two passwords are not the same": "Die beiden Passwörter sind nicht gleich", "Could not save": "Speichern nicht möglich", "Use at least 8 characters": "Verwenden Sie mindestens 8 Zeichen"}, "es": {"This studio is protected by a password.": "Este estudio está protegido con una contraseña.", "Studio password": "Contraseña del estudio", "Who are you?": "¿Quién es usted?", "Your password": "Su contraseña", "Sign in": "Entrar", "Could not sign in": "No se pudo entrar", "The server did not answer": "El servidor no respondió", "Wrong password": "Contraseña incorrecta", "Too many wrong passwords. Wait half a minute and try again.": "Demasiadas contraseñas incorrectas. Espere medio minuto y vuelva a intentarlo.", "Welcome to Studio CRM": "Bienvenido a Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Cree la contraseña del estudio. Cada ordenador, tableta y teléfono la pedirá una vez antes de abrir el CRM, para que nadie más en su red pueda ver o cambiar sus clientes.", "Studio password (at least 8 characters)": "Contraseña del estudio (al menos 8 caracteres)", "The same password again": "La misma contraseña otra vez", "Create password and open the CRM": "Crear la contraseña y abrir el CRM", "Continue without a password (you can set one later in Settings)": "Continuar sin contraseña (puede establecer una más tarde en Ajustes)", "The two passwords are not the same": "Las dos contraseñas no coinciden", "Could not save": "No se pudo guardar", "Use at least 8 characters": "Use al menos 8 caracteres"}, "it": {"This studio is protected by a password.": "Questo studio è protetto da una password.", "Studio password": "Password dello studio", "Who are you?": "Chi siete?", "Your password": "La vostra password", "Sign in": "Accedi", "Could not sign in": "Accesso non riuscito", "The server did not answer": "Il server non ha risposto", "Wrong password": "Password errata", "Too many wrong passwords. Wait half a minute and try again.": "Troppe password errate. Attendete mezzo minuto e riprovate.", "Welcome to Studio CRM": "Benvenuti in Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Create la password dello studio. Ogni computer, tablet e telefono la chiederà una volta prima di aprire il CRM, così nessun altro sulla vostra rete potrà vedere o modificare i vostri clienti.", "Studio password (at least 8 characters)": "Password dello studio (almeno 8 caratteri)", "The same password again": "La stessa password di nuovo", "Create password and open the CRM": "Crea la password e apri il CRM", "Continue without a password (you can set one later in Settings)": "Continua senza password (potete impostarla più tardi nelle Impostazioni)", "The two passwords are not the same": "Le due password non coincidono", "Could not save": "Salvataggio non riuscito", "Use at least 8 characters": "Usate almeno 8 caratteri"}, "nl": {"This studio is protected by a password.": "Deze studio is beveiligd met een wachtwoord.", "Studio password": "Studiowachtwoord", "Who are you?": "Wie bent u?", "Your password": "Uw wachtwoord", "Sign in": "Aanmelden", "Could not sign in": "Aanmelden mislukt", "The server did not answer": "De server gaf geen antwoord", "Wrong password": "Verkeerd wachtwoord", "Too many wrong passwords. Wait half a minute and try again.": "Te veel verkeerde wachtwoorden. Wacht een halve minuut en probeer het opnieuw.", "Welcome to Studio CRM": "Welkom bij Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Maak het studiowachtwoord aan. Elke computer, tablet en telefoon vraagt er één keer om voordat het CRM opent, zodat niemand anders op uw netwerk uw klanten kan zien of wijzigen.", "Studio password (at least 8 characters)": "Studiowachtwoord (minstens 8 tekens)", "The same password again": "Hetzelfde wachtwoord nog een keer", "Create password and open the CRM": "Wachtwoord aanmaken en CRM openen", "Continue without a password (you can set one later in Settings)": "Doorgaan zonder wachtwoord (u kunt er later een instellen in Instellingen)", "The two passwords are not the same": "De twee wachtwoorden zijn niet hetzelfde", "Could not save": "Opslaan mislukt", "Use at least 8 characters": "Gebruik minstens 8 tekens"}, "pt": {"This studio is protected by a password.": "Este estúdio está protegido por uma palavra-passe.", "Studio password": "Palavra-passe do estúdio", "Who are you?": "Quem é?", "Your password": "A sua palavra-passe", "Sign in": "Entrar", "Could not sign in": "Não foi possível entrar", "The server did not answer": "O servidor não respondeu", "Wrong password": "Palavra-passe errada", "Too many wrong passwords. Wait half a minute and try again.": "Demasiadas palavras-passe erradas. Aguarde meio minuto e tente de novo.", "Welcome to Studio CRM": "Bem-vindo ao Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "Crie a palavra-passe do estúdio. Cada computador, tablet e telemóvel vai pedi-la uma vez antes de abrir o CRM, para que mais ninguém na sua rede possa ver ou alterar os seus clientes.", "Studio password (at least 8 characters)": "Palavra-passe do estúdio (pelo menos 8 caracteres)", "The same password again": "A mesma palavra-passe outra vez", "Create password and open the CRM": "Criar a palavra-passe e abrir o CRM", "Continue without a password (you can set one later in Settings)": "Continuar sem palavra-passe (pode definir uma mais tarde nas Definições)", "The two passwords are not the same": "As duas palavras-passe não são iguais", "Could not save": "Não foi possível guardar", "Use at least 8 characters": "Use pelo menos 8 caracteres"}, "th": {"This studio is protected by a password.": "สตูดิโอนี้ป้องกันด้วยรหัสผ่าน", "Studio password": "รหัสผ่านสตูดิโอ", "Who are you?": "คุณคือใคร?", "Your password": "รหัสผ่านของคุณ", "Sign in": "เข้าสู่ระบบ", "Could not sign in": "เข้าสู่ระบบไม่ได้", "The server did not answer": "เซิร์ฟเวอร์ไม่ตอบสนอง", "Wrong password": "รหัสผ่านไม่ถูกต้อง", "Too many wrong passwords. Wait half a minute and try again.": "ใส่รหัสผ่านผิดหลายครั้งเกินไป รอครึ่งนาทีแล้วลองใหม่", "Welcome to Studio CRM": "ยินดีต้อนรับสู่ Studio CRM", "Create the studio password. Every computer, tablet and phone will ask for it once before it opens the CRM, so nobody else on your network can see or change your clients.": "สร้างรหัสผ่านสตูดิโอ คอมพิวเตอร์ แท็บเล็ต และโทรศัพท์ทุกเครื่องจะถามรหัสนี้หนึ่งครั้งก่อนเปิด CRM เพื่อไม่ให้คนอื่นในเครือข่ายของคุณเห็นหรือแก้ไขข้อมูลลูกค้าได้", "Studio password (at least 8 characters)": "รหัสผ่านสตูดิโอ (อย่างน้อย 8 ตัวอักษร)", "The same password again": "รหัสผ่านเดิมอีกครั้ง", "Create password and open the CRM": "สร้างรหัสผ่านและเปิด CRM", "Continue without a password (you can set one later in Settings)": "ดำเนินการต่อโดยไม่มีรหัสผ่าน (ตั้งภายหลังได้ในการตั้งค่า)", "The two passwords are not the same": "รหัสผ่านทั้งสองไม่ตรงกัน", "Could not save": "บันทึกไม่ได้", "Use at least 8 characters": "ใช้อย่างน้อย 8 ตัวอักษร"}};
var LANG = (function () { var l = null; try { l = localStorage.getItem('studio_crm_lang') || localStorage.getItem('poli_tools_language'); } catch (e) {}
  return (l || (navigator.language || 'en')).slice(0, 2).toLowerCase(); })();
function L(en) { return (WORDS[LANG] && WORDS[LANG][en]) || en; }
function translatePage() {
  document.documentElement.lang = LANG;
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) { var t = n.nodeValue.trim(); if (t && L(t) !== t) n.nodeValue = n.nodeValue.replace(t, L(t)); }
}
translatePage();
</script>
<script>
var error = document.getElementById('error');
async function post(url, body) {
  var res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  if (res.ok) { window.location.reload(); return; }
  error.textContent = L((await res.json().catch(function () { return {}; })).error || 'Could not save');
}
document.getElementById('setup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  error.textContent = '';
  var a = document.getElementById('setup-password').value, b = document.getElementById('setup-again').value;
  if (a !== b) { error.textContent = L('The two passwords are not the same'); return; }
  post('/api/access/password', { next: a }).catch(function () { error.textContent = L('The server did not answer'); });
});
document.getElementById('setup-skip').addEventListener('click', function () {
  post('/api/access/skip').catch(function () { error.textContent = L('The server did not answer'); });
});
</script></body></html>`;

// Staff levels, lowest to highest. What each may do is decided in needLevel() below.
// 'kiosk' is a tablet signed in with the kiosk password: it only receives forms and sends them back signed.
const LEVELS = ['kiosk', 'front_desk', 'staff', 'admin'];
const LEVEL_NAMES = { kiosk: 'Kiosk tablet', front_desk: 'Front desk', staff: 'Staff', admin: 'Administrator' };
// shared data that is studio settings: only an administrator may change it
const ADMIN_DATA = /^(studio_vat_config|studio_remote_sync_config|studio_scheduled_reports|poli_studio_profile|poli_studio_logo|poli_benchmark_studio_rates_v1|poli_kiosk_exit_pin|poli_pdf_generator_settings|poli_builder_theme_customization)$/;

// The lowest level a request needs. Checked on the server, so hiding a button is not the only guard.
export function needLevel(method, apiPath) {
  // pages and their files hold no studio data (that is all behind /api); only the CRM itself is closed to a kiosk
  if (!apiPath.startsWith('/api/')) return ['/', '/index.html'].includes(apiPath) ? 'front_desk' : 'kiosk';
  if (['/api/access', '/api/access/logout', '/api/kiosk/next', '/api/kiosk/submit', '/api/scanner/scan'].includes(apiPath)) return 'kiosk'; // a tablet's form may scan
  if (['/api/access/login', '/api/access/people'].includes(apiPath)) return 'front_desk';
  const write = method !== 'GET' && method !== 'HEAD';
  if (method === 'DELETE') return 'admin';                                        // deleting anything
  if (/^\/api\/(access|admin|database)\//.test(apiPath)) return 'admin';           // password, levels, backups, empty studio
  if (write && /import/.test(apiPath)) return 'admin';                              // CSV imports
  if (write && /^\/api\/(staff|professionals)(\/\d+)?$/.test(apiPath)) return 'admin'; // the team itself
  if (write && /^\/api\/settings/.test(apiPath)) return 'admin';
  if (write && /^\/api\/stations(\/\d+)?$/.test(apiPath)) return 'admin';              // adding, renaming the stations
  if (!write && /^\/api\/(financial|financials|staff\/commissions)/.test(apiPath)) return 'admin'; // money reports
  const data = apiPath.match(/^\/api\/app-data\/(.+)$/);
  if (data && write) {
    const key = decodeURIComponent(data[1]);
    if (ADMIN_DATA.test(key)) return 'admin';
    if (/^poli_form_builder_autosave/.test(key)) return 'staff';                   // changing the consent form designs
  }
  if (write && /^\/api\/(inventory|compliance|aftercare|sterilization|autoclave)/.test(apiPath)) return 'staff'; // stock, suppliers, compliance
  if (write && /^\/api\/staff\/(assign-shift|monthly-schedule)/.test(apiPath)) return 'staff'; // the rota
  return 'front_desk';                                                              // clients, bookings, waivers, payments
}

export function installAccess(app, sqlite, getStaff = () => []) {
  sqlite.exec('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)');
  const read = () => {
    const row = sqlite.prepare("SELECT value FROM app_state WHERE key = 'studioAccess'").get();
    try { return row ? JSON.parse(row.value) : null; } catch (e) { return null; }
  };
  const write = (value) => {
    if (!value) sqlite.prepare("DELETE FROM app_state WHERE key = 'studioAccess'").run();
    else sqlite.prepare('INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?, ?, ?)').run('studioAccess', JSON.stringify(value), new Date().toISOString());
  };

  // Forgotten password: an empty file named reset-password.txt in the data folder removes it at the next start.
  const dataDir = path.dirname(process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'studio_crm.sqlite'));
  const resetFile = path.join(dataDir, 'reset-password.txt');
  if (fs.existsSync(resetFile)) {
    write(null);
    sqlite.prepare("DELETE FROM app_state WHERE key = 'staffLogins'").run();
    try { fs.unlinkSync(resetFile); } catch (e) { /* read-only folder: the password is removed all the same */ }
    console.log('The studio password and the staff logins were removed (reset-password.txt found).');
  }

  let access = read();                 // { salt, hash } or null
  const setting = (key) => { const row = sqlite.prepare('SELECT value FROM app_state WHERE key = ?').get(key); return row ? row.value : null; };
  const setSetting = (key, value) => sqlite.prepare('INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?, ?, ?)').run(key, String(value), new Date().toISOString());
  // a studio that already had a password or skipped has made its first-start choice
  const chosen = () => !!access || setting('studioAccessChosen') === 'yes';
  // sha256(token) -> { expiry, staffId, level, kiosk }. Staff sign in again after a restart; kiosk tablets on a
  // stand do not: their sessions are saved (hashed, so a copy of the database cannot be used to sign in).
  const sessions = new Map();
  const keyOf = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');
  const saveKioskSessions = () => setSetting('kioskSessions', JSON.stringify([...sessions].filter(([, s]) => s.level === 'kiosk' && s.expiry > Date.now())));
  try { for (const [k, s] of JSON.parse(setting('kioskSessions') || '[]')) if (s.expiry > Date.now()) sessions.set(k, s); } catch (e) { /* unreadable: tablets sign in again */ }
  const logins = () => { try { return JSON.parse(setting('staffLogins') || '{}'); } catch (e) { return {}; } }; // staffId -> { salt, hash, level }
  const saveLogins = (value) => setSetting('staffLogins', JSON.stringify(value));
  // staff logins are on once anyone has one (and the studio password is set); the studio password stays the administrator's
  const loginsOn = () => !!access && Object.keys(logins()).length > 0;
  const checkHash = (password, entry) => { const given = hashOf(password, Buffer.from(entry.salt, 'hex')); const stored = Buffer.from(entry.hash, 'hex'); return given.length === stored.length && crypto.timingSafeEqual(given, stored); };
  const failures = new Map();          // address -> { count, until }

  const matches = (password) => {
    if (!access) return false;
    const given = hashOf(password, Buffer.from(access.salt, 'hex'));
    const stored = Buffer.from(access.hash, 'hex');
    return given.length === stored.length && crypto.timingSafeEqual(given, stored);
  };
  const tokenOf = (req) => {
    const found = (req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).find(([name]) => name === COOKIE);
    return found ? found[1] : '';
  };
  const session = (req) => { const s = sessions.get(keyOf(tokenOf(req))); return s && s.expiry > Date.now() ? s : null; };
  const signedIn = (req) => !!session(req);
  // without staff logins everyone who is in may do everything, as before
  const levelOf = (req) => {
    const s = session(req) || {};
    if (s.level === 'kiosk') return 'kiosk';            // a kiosk tablet stays a kiosk, with or without staff logins
    return loginsOn() ? (s.level || 'front_desk') : 'admin';
  };
  // The kiosk password: separate from the studio password, so a tablet on a stand never holds the studio's.
  const kioskAccess = () => { try { return JSON.parse(setting('kioskAccess') || 'null'); } catch (e) { return null; } };
  const startSession = (req, res, who = {}) => {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(keyOf(token), { expiry: Date.now() + SESSION_DAYS * 86400000, staffId: who.staffId || null, level: who.level || 'admin', kiosk: who.kiosk || null });
    if (who.level === 'kiosk') saveKioskSessions();
    res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${req.secure ? '; Secure' : ''}`);
  };

  // The gate: before the static files and every route.
  app.use((req, res, next) => {
    if (req.path === '/api/access' || req.path === '/api/access/skip' || (req.path === '/api/access/password' && !access)) return next();
    if (!chosen()) {
      if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Create the studio password first (or choose to continue without one)' });
      return res.status(200).set('Cache-Control', 'no-store').type('html').send(SETUP_PAGE);
    }
    // the kiosk page shows its own sign-in (the kiosk password) and must load before it
    if (!access || signedIn(req) || req.path.startsWith('/api/access') || ['/kiosk', '/kiosk.html', '/api/kiosk/login'].includes(req.path)) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Sign in with the studio password first' });
    res.status(401).set('Cache-Control', 'no-store').type('html').send(LOGIN_PAGE);
  });

  // The level check: before every route.
  app.use((req, res, next) => {
    const need = needLevel(req.method, req.path);
    const have = levelOf(req);
    // a kiosk tablet that wanders to a CRM page (the home page, an old bookmark) goes back to its own page
    if (have === 'kiosk' && !req.path.startsWith('/api/') && req.method === 'GET' && (req.path === '/index.html' || !/\.[a-z0-9]+$/i.test(req.path)) && !req.path.startsWith('/tools/') && req.path !== '/kiosk') return res.redirect('/kiosk');
    if (have === 'kiosk') req.kioskSession = session(req);   // the tablet's own name lives here: see kioskOf() in server.js
    if (LEVELS.indexOf(have) >= LEVELS.indexOf(need)) return next();
    res.status(403).json({ error: `Your level (${LEVEL_NAMES[have]}) cannot do this. Ask an administrator.`, level: have });
  });

  app.get('/api/access', (req, res) => {
    const s = session(req) || {};
    const me = s.staffId ? (getStaff().find((p) => Number(p.id) === Number(s.staffId)) || {}).name : null;
    const all = logins();
    res.json({ passwordSet: !!access, signedIn: !access || signedIn(req), chosen: chosen(),
      idleMinutes: Number(setting('studioIdleMinutes')) || 0,
      staffLogins: loginsOn(), level: levelOf(req), me: me || null, kioskPasswordSet: !!kioskAccess(),
      // who has a login and at which level: for the staff list, administrators only
      logins: levelOf(req) === 'admin' ? Object.fromEntries(Object.entries(all).map(([id, l]) => [id, l.level])) : undefined });
  });

  // The names on the sign-in page (only those with a login).
  app.get('/api/access/people', (req, res) => {
    if (!loginsOn()) return res.json([]);
    const all = logins();
    res.json(getStaff().filter((p) => all[p.id]).map((p) => ({ id: p.id, name: p.name })));
  });

  // Give a staff member a level and a login password, change them, or remove the login.
  app.post('/api/access/staff-login', (req, res) => {
    if (!access) return res.status(400).json({ error: 'Set the studio password first: staff logins come on top of it' });
    // the gate lets /api/access through: this one needs a signed-in administrator
    if (!signedIn(req)) return res.status(401).json({ error: 'Sign in first' });
    const { staff_id, level, password = '', remove } = req.body || {};
    const person = getStaff().find((p) => Number(p.id) === Number(staff_id));
    if (!person) return res.status(404).json({ error: 'Staff member not found' });
    const all = logins();
    if (remove) {
      delete all[person.id];
      saveLogins(all);
      for (const [t, s] of sessions) if (Number(s.staffId) === Number(person.id)) sessions.delete(t);
      return res.json({ ok: true, staffLogins: loginsOn() });
    }
    if (!LEVELS.includes(level)) return res.status(400).json({ error: 'Choose Administrator, Staff or Front desk' });
    if (!all[person.id] && String(password).length < 8) return res.status(400).json({ error: 'Give them a password of at least 8 characters' });
    if (password && String(password).length < 8) return res.status(400).json({ error: 'Use at least 8 characters' });
    const entry = all[person.id] || {};
    if (password) { const salt = crypto.randomBytes(16); entry.salt = salt.toString('hex'); entry.hash = hashOf(password, salt).toString('hex'); }
    entry.level = level;
    all[person.id] = entry;
    saveLogins(all);
    // a changed level or password: that person signs in again
    for (const [t, s] of sessions) if (Number(s.staffId) === Number(person.id)) sessions.delete(t);
    res.json({ ok: true, staffLogins: loginsOn() });
  });

  // First start: continue without a password (it can be set later in Settings).
  app.post('/api/access/skip', (req, res) => {
    if (chosen()) return res.status(409).json({ error: 'Already set up' });
    setSetting('studioAccessChosen', 'yes');
    res.json({ ok: true });
  });

  // Idle lock: after this many minutes without use, a device signs out (0 = off). It needs the password.
  app.post('/api/access/idle', (req, res) => {
    if (!access || !signedIn(req)) return res.status(403).json({ error: 'Set a studio password first' });
    const minutes = Number((req.body || {}).minutes);
    if (![0, 5, 10, 15, 30].includes(minutes)) return res.status(400).json({ error: 'Choose off, 5, 10, 15 or 30 minutes' });
    setSetting('studioIdleMinutes', minutes);
    res.json({ ok: true, idleMinutes: minutes });
  });

  app.post('/api/access/login', (req, res) => {
    const who = req.ip;
    const fail = failures.get(who) || { count: 0, until: 0 };
    if (fail.until > Date.now()) return res.status(429).json({ error: 'Too many wrong passwords. Wait half a minute and try again.' });
    const body = req.body || {};
    const entry = body.staff_id && loginsOn() ? logins()[body.staff_id] : null;
    const ok = entry ? checkHash(body.password, entry) : matches(body.password);
    if (!ok) {
      fail.count++;
      if (fail.count >= 5) { fail.until = Date.now() + 30000; fail.count = 0; }
      failures.set(who, fail);
      return res.status(401).json({ error: 'Wrong password' });
    }
    failures.delete(who);
    startSession(req, res, entry ? { staffId: Number(body.staff_id), level: entry.level } : { level: 'admin' });
    res.json({ ok: true });
  });

  // Set or remove the kiosk password (administrators: /api/access/ needs that level). It needs the studio password:
  // without one every device is in anyway, and the kiosk page works with no sign-in.
  app.post('/api/access/kiosk-password', (req, res) => {
    if (!access) return res.status(400).json({ error: 'Set the studio password first: the kiosk password comes on top of it' });
    if (!signedIn(req)) return res.status(401).json({ error: 'Sign in first' });   // the gate lets /api/access through
    const password = String((req.body || {}).password || '');
    for (const [t, s] of sessions) if (s.level === 'kiosk') sessions.delete(t);  // tablets sign in again
    saveKioskSessions();
    if (!password) { sqlite.prepare("DELETE FROM app_state WHERE key = 'kioskAccess'").run(); return res.json({ ok: true, kioskPasswordSet: false }); }
    if (password.length < 6) return res.status(400).json({ error: 'Use at least 6 characters' });
    if (access && matches(password)) return res.status(400).json({ error: 'Use a different password from the studio password' });
    const salt = crypto.randomBytes(16);
    setSetting('kioskAccess', JSON.stringify({ salt: salt.toString('hex'), hash: hashOf(password, salt).toString('hex') }));
    res.json({ ok: true, kioskPasswordSet: true });
  });

  // A tablet signs in as a kiosk: it can then only receive forms and send them back signed.
  app.post('/api/kiosk/login', (req, res) => {
    const who = req.ip;
    const fail = failures.get(who) || { count: 0, until: 0 };
    if (fail.until > Date.now()) return res.status(429).json({ error: 'Too many wrong passwords. Wait half a minute and try again.' });
    const entry = kioskAccess();
    if (!entry || !checkHash((req.body || {}).password, entry)) {
      fail.count++;
      if (fail.count >= 5) { fail.until = Date.now() + 30000; fail.count = 0; }
      failures.set(who, fail);
      return res.status(401).json({ error: entry ? 'Wrong password' : 'No kiosk password is set: an administrator sets one in Settings' });
    }
    failures.delete(who);
    // the sign-in belongs to this tablet's name: it cannot then ask for a form waiting on another tablet
    startSession(req, res, { level: 'kiosk', kiosk: String((req.body || {}).name || '').trim().slice(0, 40) || 'Kiosk' });
    res.json({ ok: true });
  });

  app.post('/api/access/logout', (req, res) => {
    sessions.delete(keyOf(tokenOf(req)));
    saveKioskSessions();
    res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    res.json({ ok: true });
  });

  // Set, change or remove the password. Changing or removing needs the current one.
  app.post('/api/access/password', (req, res) => {
    const { current = '', next = '' } = req.body || {};
    if (access && !matches(current)) return res.status(403).json({ error: 'The current password is wrong' });
    if (!next) {
      access = null;
      write(null);
      sessions.clear();
      saveKioskSessions();
      return res.json({ ok: true, passwordSet: false });
    }
    if (String(next).length < 8) return res.status(400).json({ error: 'Use at least 8 characters' });
    const salt = crypto.randomBytes(16);
    access = { salt: salt.toString('hex'), hash: hashOf(next, salt).toString('hex') };
    write(access);
    setSetting('studioAccessChosen', 'yes');
    sessions.clear();          // every other device signs in again
    saveKioskSessions();
    startSession(req, res);    // this one stays in
    res.json({ ok: true, passwordSet: true });
  });
}
