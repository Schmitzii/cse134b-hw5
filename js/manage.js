const LOCAL_KEY = 'skills-local-data';
const JSONBIN_ID = '69237e83d0ea881f40fb9b43';
const JSONBIN_KEY = '$2a$10$f8hGxtjiLlYlIkdopkVYUus/igwbGzI5dEjW26B2WgNYNkb6C7u5O';

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch(e){ return []; }
}
function writeLocal(data){ try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); return true;}catch(e){return false;} }

async function readRemote() {
  try {
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'GET',
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const data = await resp.json();
    return data.record && Array.isArray(data.record) ? data.record : [];
  } catch(e){ console.error('Failed to read remote', e); return []; }
}

async function writeRemote(data) {
  try {
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error(`Update failed: ${resp.status}`);
    return true;
  } catch(e){ console.error('Failed to write remote', e); return false; }
}

function showMessage(msg, ok=true){ const el = document.getElementById('message'); el.textContent = msg; el.style.color = ok ? 'inherit' : 'crimson'; }

function findByTitle(arr, title){ return arr.findIndex(i => String(i.title).toLowerCase() === String(title).toLowerCase()); }

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('manage-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const target = document.getElementById('target').value;
    const action = document.getElementById('action').value;
    const title = document.getElementById('title').value.trim();
    if (!title) { showMessage('Title is required', false); return; }

    const item = {
      title,
      img: document.getElementById('img').value.trim() || '',
      alt: document.getElementById('alt').value.trim() || '',
      description: document.getElementById('description').value.trim() || '',
      link: document.getElementById('link').value.trim() || '',
    };

    if (target === 'local') {
      const arr = readLocal();
      const idx = findByTitle(arr, title);
      if (action === 'create') {
        if (idx !== -1) { showMessage('Item with that title already exists in local.', false); return; }
        arr.push(item);
        writeLocal(arr);
        showMessage('Created item in localStorage. Click "Load Local" on Skills page to refresh.');
      } else if (action === 'update') {
        if (idx === -1) { showMessage('Item not found in local to update.', false); return; }
        arr[idx] = Object.assign({}, arr[idx], item);
        writeLocal(arr);
        showMessage('Updated local item. Click "Load Local" on Skills page to refresh.');
      } else if (action === 'delete') {
        if (idx === -1) { showMessage('Item not found in local to delete.', false); return; }
        arr.splice(idx,1);
        writeLocal(arr);
        showMessage('Deleted local item. Click "Load Local" on Skills page to refresh.');
      }
    } else if (target === 'remote') {
      const arr = await readRemote();
      const idx = findByTitle(arr, title);
      if (action === 'create') {
        if (idx !== -1) { showMessage('Item with that title already exists in remote.', false); return; }
        arr.push(item);
        const ok = await writeRemote(arr);
        if (ok) showMessage('Created item in JSONBIN. Click "Load Remote" on Skills page to refresh.');
        else showMessage('Failed to create remote item.', false);
      } else if (action === 'update') {
        if (idx === -1) { showMessage('Item not found in remote to update.', false); return; }
        arr[idx] = Object.assign({}, arr[idx], item);
        const ok = await writeRemote(arr);
        if (ok) showMessage('Updated remote item. Click "Load Remote" on Skills page to refresh.');
        else showMessage('Failed to update remote item.', false);
      } else if (action === 'delete') {
        if (idx === -1) { showMessage('Item not found in remote to delete.', false); return; }
        arr.splice(idx,1);
        const ok = await writeRemote(arr);
        if (ok) showMessage('Deleted remote item. Click "Load Remote" on Skills page to refresh.');
        else showMessage('Failed to delete remote item.', false);
      }
    }

    form.reset();
  });
});
