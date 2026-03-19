'use client';

import { doc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { UserProfile } from '@/firebase/types';

/**
 * @fileOverview Servicio Enterprise para la gestión de Identidades Bio-Neurales.
 * Utiliza inicialización perezosa para evitar errores de contexto de Firebase.
 */

export class UserService {
  private static get db() {
    return getFirestore();
  }

  static async syncProfile(userId: string, data: Partial<UserProfile>) {
    const userRef = doc(this.db, 'users', userId);
    const profileData = {
      ...data,
      id: userId,
      updatedAt: serverTimestamp(),
    };
    
    // Usamos el patrón non-blocking para una UI ultra-fluida
    setDocumentNonBlocking(userRef, profileData, { merge: true });
  }

  static async toggleFollow(followerId: string, followedId: string, isFollowing: boolean) {
    const followingRef = doc(this.db, 'users', followerId, 'following', followedId);
    const followerRef = doc(this.db, 'users', followedId, 'followers', followerId);

    if (isFollowing) {
      // En un entorno real aquí se llamaría a deleteDoc o similar a través de un patrón non-blocking
    } else {
      const followData = {
        id: `${followerId}_${followedId}`,
        followerId,
        followedId,
        createdAt: serverTimestamp(),
      };
      setDocumentNonBlocking(followingRef, followData, { merge: true });
      setDocumentNonBlocking(followerRef, followData, { merge: true });
    }
  }
}
