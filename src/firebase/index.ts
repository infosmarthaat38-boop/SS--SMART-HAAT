'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'

// Cache initialized SDKs to prevent re-initialization errors
const sdkCache = new Map<string, any>();

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;
  
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  const appName = firebaseApp.name;
  if (sdkCache.has(appName)) {
    return sdkCache.get(appName);
  }

  const sdks = getSdks(firebaseApp);
  sdkCache.set(appName, sdks);
  return sdks;
}

export function getSdks(firebaseApp: FirebaseApp) {
  let firestore;
  try {
    // FORCE LONG POLLING: This resolves the "Could not reach Cloud Firestore backend" timeout error
    // in restricted network environments like Cloud Workstations.
    firestore = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (e) {
    // If initializeFirestore was already called, use getFirestore instead
    firestore = getFirestore(firebaseApp);
  }

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
