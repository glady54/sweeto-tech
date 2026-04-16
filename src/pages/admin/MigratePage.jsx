import React, { useState } from 'react';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';

// ─────────────────────────────────────────────────────────────────
// PASTE YOUR EXISTING db.json DATA HERE (products + categories + storeSettings)
// Run this page once from the admin panel, then remove or hide it.
// ─────────────────────────────────────────────────────────────────

const MigratePage = () => {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [log, setLog] = useState([]);

  const append = (msg) => setLog(prev => [...prev, msg]);

  const runMigration = async () => {
    setStatus('running');
    setLog([]);
    try {
      // ─── 1. Fetch current data from old json-server (if still running locally)
      const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;
      append(`📡 Fetching data from ${API_URL}…`);

      const [prodRes, catRes, setRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/storeSettings`),
      ]);

      if (!prodRes.ok || !catRes.ok || !setRes.ok) {
        throw new Error('Could not reach json-server. Make sure it is running locally on port 3001.');
      }

      const products = await prodRes.json();
      const categories = await catRes.json();
      const rawSettings = await setRes.json();
      const settings = Array.isArray(rawSettings) ? rawSettings[0] : rawSettings;

      append(`✅ Fetched ${products.length} products, ${categories.length} categories, settings.`);

      // ─── 2. Write storeSettings (single doc)
      append('📝 Writing storeSettings…');
      const { id: _sid, ...settingsData } = settings || {};
      await setDoc(doc(db, 'storeSettings', 'main'), settingsData, { merge: true });
      append('✅ storeSettings saved.');

      // ─── 3. Write categories in batches
      append(`📝 Writing ${categories.length} categories…`);
      let batch = writeBatch(db);
      let count = 0;
      for (const cat of categories) {
        const { id, ...rest } = cat;
        batch.set(doc(db, 'categories', String(id)), { ...rest, id: String(id) });
        count++;
        if (count % 400 === 0) { await batch.commit(); batch = writeBatch(db); }
      }
      await batch.commit();
      append(`✅ ${categories.length} categories saved.`);

      // ─── 4. Write products in batches (images are large, so one-by-one to avoid quota)
      append(`📝 Writing ${products.length} products (this may take a moment)…`);
      for (let i = 0; i < products.length; i++) {
        const { id, ...rest } = products[i];
        await setDoc(doc(db, 'products', String(id)), { ...rest, id: String(id) }, { merge: true });
        append(`  → Product ${i + 1}/${products.length}: ${products[i].name}`);
      }
      append(`✅ All products saved.`);

      append('');
      append('🎉 MIGRATION COMPLETE! Your data is now in Firebase Firestore.');
      append('You can turn off your computer and the store will still work from anywhere!');
      setStatus('done');
    } catch (err) {
      append(`❌ Error: ${err.message}`);
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: '40px 24px', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ color: '#60a5fa', marginBottom: 8 }}>🚀 Firestore Migration Tool</h1>
        <p style={{ color: '#94a3b8', marginBottom: 32, lineHeight: 1.6 }}>
          This tool copies all your existing products, categories, and store settings from the
          local json-server into Firebase Firestore. After running this <strong>once</strong>,
          your data lives in the cloud permanently — no more json-server needed.
        </p>

        {/* Prerequisites */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h2 style={{ color: '#f59e0b', marginBottom: 12, fontSize: 16 }}>⚠️ Before you run</h2>
          <ol style={{ color: '#94a3b8', lineHeight: 2, paddingLeft: 20 }}>
            <li>Open the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>Firebase Console</a></li>
            <li>Go to <strong style={{ color: '#e2e8f0' }}>Firestore → Rules</strong></li>
            <li>Replace the rules with the ones shown below and click <strong style={{ color: '#e2e8f0' }}>Publish</strong></li>
            <li>Make sure your local json-server is running (<code style={{ color: '#34d399' }}>npm run server</code>)</li>
            <li>Click <strong style={{ color: '#e2e8f0' }}>Run Migration</strong> below</li>
          </ol>
        </div>

        {/* Rules to copy */}
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h2 style={{ color: '#7c3aed', marginBottom: 12, fontSize: 16 }}>📋 Firestore Security Rules (copy → paste → publish)</h2>
          <pre style={{ color: '#34d399', fontSize: 13, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Storefront (public reads) ──────────────────────────────────
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /storeSettings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // ── Analytics (anyone can log a visit) ────────────────────────
    match /visits/{doc} {
      allow read, write: if true;
    }

    // ── Admin-only collections ────────────────────────────────────
    match /salesRecords/{doc} {
      allow read, write: if request.auth != null;
    }
    match /stockAdjustments/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
        </div>

        {/* Run button */}
        <button
          onClick={runMigration}
          disabled={status === 'running' || status === 'done'}
          style={{
            background: status === 'done' ? '#16a34a' : status === 'running' ? '#7c3aed' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: status === 'running' || status === 'done' ? 'not-allowed' : 'pointer',
            width: '100%',
            marginBottom: 24,
          }}
        >
          {status === 'idle' && '▶ Run Migration'}
          {status === 'running' && '⏳ Migrating… please wait'}
          {status === 'done' && '✅ Migration Complete!'}
          {status === 'error' && '▶ Retry Migration'}
        </button>

        {/* Log output */}
        {log.length > 0 && (
          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 20, maxHeight: 400, overflowY: 'auto' }}>
            {log.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('❌') ? '#f87171' : line.startsWith('🎉') ? '#34d399' : '#94a3b8', marginBottom: 4, fontSize: 13 }}>
                {line || <br />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MigratePage;
