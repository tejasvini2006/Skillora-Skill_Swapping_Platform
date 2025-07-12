import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  bio?: string;
  rating: number;
  totalSwaps: number;
  role: 'user' | 'admin';
  isBanned: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize with demo data if no users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@demo.com',
          location: 'Platform Administrator',
          skillsOffered: [],
          skillsWanted: [],
          availability: [],
          isPublic: true,
          bio: 'Platform administrator with full access to moderation tools.',
          rating: 5.0,
          totalSwaps: 0,
          role: 'admin',
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'user@demo.com',
          location: 'San Francisco, USA',
          skillsOffered: ['JavaScript', 'React', 'Node.js', 'Python'],
          skillsWanted: ['UI/UX Design', 'Photoshop', 'Digital Marketing'],
          availability: ['Weekends', 'Monday 6-8 PM', 'Wednesday 7-9 PM'],
          isPublic: true,
          bio: 'Full-stack developer passionate about learning new technologies.',
          rating: 4.9,
          totalSwaps: 8,
          role: 'user',
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          email: 'sarah@demo.com',
          location: 'London, UK',
          skillsOffered: ['Graphic Design', 'Photoshop', 'Illustrator', 'Branding'],
          skillsWanted: ['Web Development', 'SEO', 'Content Writing'],
          availability: ['Weekends', 'Evenings'],
          isPublic: true,
          bio: 'Creative designer with expertise in visual branding and digital art.',
          rating: 4.7,
          totalSwaps: 12,
          role: 'user',
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Mike Chen',
          email: 'mike@demo.com',
          location: 'Toronto, Canada',
          skillsOffered: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
          skillsWanted: ['Video Editing', 'Animation', 'Photography'],
          availability: ['Tuesday 6-8 PM', 'Thursday 7-9 PM', 'Weekends'],
          isPublic: true,
          bio: 'Digital marketing specialist helping businesses grow online.',
          rating: 4.6,
          totalSwaps: 6,
          role: 'user',
          isBanned: false,
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && !u.isBanned);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<User> & { password: string; role?: 'user' | 'admin' }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      location: userData.location || '',
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 5.0,
      totalSwaps: 0,
      role: userData.role || 'user',
      isBanned: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};