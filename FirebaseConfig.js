// FirebaseConfig.js — Auth e Firestore via REST API (sem pacote firebase)

const API_KEY = "AIzaSyDrrrHrwHs-j8YYyMjyIkXPxEyCKPaXFkk";
const PROJECT_ID = "culture-explorer-ee89c";

const AUTH_BASE = `https://identitytoolkit.googleapis.com/v1/accounts`;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let currentUser = null;

// ─── AUTH ───────────────────────────────────────────────────────────────────

export async function login(email, senha) {
  const res = await fetch(`${AUTH_BASE}:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'Erro no login');
    err.code = mapAuthError(data.error?.message);
    throw err;
  }
  currentUser = {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  };
  return { uid: currentUser.uid, email: currentUser.email };
}

export async function cadastrar(email, senha) {
  const res = await fetch(`${AUTH_BASE}:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'Erro no cadastro');
    err.code = mapAuthError(data.error?.message);
    throw err;
  }
  currentUser = {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  };
  return { uid: currentUser.uid, email: currentUser.email };
}

export async function enviarResetSenha(email) {
  const res = await fetch(`${AUTH_BASE}:sendOobCode?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'Erro ao enviar email');
    err.code = mapAuthError(data.error?.message);
    throw err;
  }
}

// ★ NOVO: Atualiza a senha do usuário logado
export async function atualizarSenha(novaSenha) {
  if (!currentUser?.idToken) {
    throw new Error('Você precisa estar logado.');
  }
  const res = await fetch(`${AUTH_BASE}:update?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idToken: currentUser.idToken,
      password: novaSenha,
      returnSecureToken: true,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'Erro ao atualizar senha');
    err.code = mapAuthError(data.error?.message);
    throw err;
  }
  // Atualiza o token na sessão
  if (data.idToken) currentUser.idToken = data.idToken;
  if (data.refreshToken) currentUser.refreshToken = data.refreshToken;
}

export async function logout() {
  currentUser = null;
}

export function getCurrentUser() {
  return currentUser;
}

function mapAuthError(msg) {
  if (!msg) return '';
  if (msg.includes('EMAIL_NOT_FOUND')) return 'auth/user-not-found';
  if (msg.includes('INVALID_PASSWORD')) return 'auth/wrong-password';
  if (msg.includes('INVALID_LOGIN_CREDENTIALS')) return 'auth/invalid-credential';
  if (msg.includes('INVALID_EMAIL')) return 'auth/invalid-email';
  if (msg.includes('EMAIL_EXISTS')) return 'auth/email-already-in-use';
  if (msg.includes('WEAK_PASSWORD')) return 'auth/weak-password';
  if (msg.includes('TOO_MANY_ATTEMPTS')) return 'auth/too-many-requests';
  if (msg.includes('CREDENTIAL_TOO_OLD_LOGIN_AGAIN')) return 'auth/requires-recent-login';
  return '';
}

export const auth = {
  get currentUser() { return currentUser; },
};

// ─── FIRESTORE ──────────────────────────────────────────────────────────────

function getToken() {
  return currentUser?.idToken || null;
}

function toFirestoreFields(dados) {
  const fields = {};
  for (const [k, v] of Object.entries(dados)) {
    if (v === null || v === undefined) continue;
    if (typeof v === 'string') fields[k] = { stringValue: v };
    else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    else if (Number.isInteger(v)) fields[k] = { integerValue: String(v) };
    else if (typeof v === 'number') fields[k] = { doubleValue: v };
    else fields[k] = { stringValue: String(v) };
  }
  return fields;
}

function fromFirestoreFields(fields) {
  if (!fields) return {};
  const result = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) result[k] = v.stringValue;
    else if (v.integerValue !== undefined) result[k] = Number(v.integerValue);
    else if (v.doubleValue !== undefined) result[k] = v.doubleValue;
    else if (v.booleanValue !== undefined) result[k] = v.booleanValue;
    else result[k] = null;
  }
  return result;
}

export async function setDocument(path, docId, dados) {
  const token = getToken();
  const res = await fetch(`${FIRESTORE_BASE}/${path}/${docId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ fields: toFirestoreFields(dados) }),
  });
  if (!res.ok) throw new Error(`Firestore set erro: ${res.status}`);
  return docId;
}

export async function addDocument(path, dados) {
  const token = getToken();
  const res = await fetch(`${FIRESTORE_BASE}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ fields: toFirestoreFields(dados) }),
  });
  if (!res.ok) throw new Error(`Firestore add erro: ${res.status}`);
  const json = await res.json();
  const id = json.name.split('/').pop();
  return id;
}

export async function getDocument(path, docId) {
  const token = getToken();
  const res = await fetch(`${FIRESTORE_BASE}/${path}/${docId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore get erro: ${res.status}`);
  const json = await res.json();
  return { id: docId, ...fromFirestoreFields(json.fields) };
}

export async function listDocuments(path) {
  const token = getToken();
  const res = await fetch(`${FIRESTORE_BASE}/${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Firestore list erro: ${res.status}`);
  const json = await res.json();
  if (!json.documents) return [];
  return json.documents.map((doc) => {
    const id = doc.name.split('/').pop();
    return { id, ...fromFirestoreFields(doc.fields) };
  });
}

export async function deleteDocument(path, docId) {
  const token = getToken();
  const res = await fetch(`${FIRESTORE_BASE}/${path}/${docId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok && res.status !== 404) throw new Error(`Firestore delete erro: ${res.status}`);
}