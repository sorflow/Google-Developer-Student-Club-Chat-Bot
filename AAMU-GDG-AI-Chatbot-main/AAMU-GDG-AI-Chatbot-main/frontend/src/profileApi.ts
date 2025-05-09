import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase';
import { User } from 'firebase/auth';

const db = getFirestore();

export interface UserProfile {
  firstName: string;
  lastName: string;
  classification: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | '';
  coursesTaken: string[];
  major: string;
  degreeWorksPdf?: string;
  expectedGraduation?: string;
  academicStanding?: string;
  email?: string;
  photoURL?: string;
}

export const profileApi = {
  // Create initial profile from Google sign-in
  async createProfileFromGoogle(user: User): Promise<void> {
    if (!user) {
      throw new Error('User must be authenticated to create profile');
    }

    const names = user.displayName?.split(' ') || ['', ''];
    const initialProfile: UserProfile = {
      firstName: names[0] || '',
      lastName: names[names.length - 1] || '',
      classification: '',
      coursesTaken: [],
      major: '',
      email: user.email || '',
      photoURL: user.photoURL || '',
    };

    const profileRef = doc(db, 'profiles', user.uid);
    await setDoc(profileRef, {
      ...initialProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  // Create or update a user's profile
  async saveProfile(profile: UserProfile): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to save profile');
    }

    const profileRef = doc(db, 'profiles', user.uid);
    await setDoc(profileRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  },

  // Get a user's profile
  async getProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to get profile');
    }

    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return profileSnap.data() as UserProfile;
    }

    // If profile doesn't exist but user is authenticated via Google,
    // create a new profile from Google data
    if (user.providerData[0]?.providerId === 'google.com') {
      await this.createProfileFromGoogle(user);
      return this.getProfile();
    }

    return null;
  },

  // Update specific fields in a user's profile
  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to update profile');
    }

    const profileRef = doc(db, 'profiles', user.uid);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Upload DegreeWorks PDF
  async uploadDegreeWorks(file: File): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    // TODO: Implement file upload to Firebase Storage
    // This is a placeholder that returns the file name
    return file.name;
  }
}; 