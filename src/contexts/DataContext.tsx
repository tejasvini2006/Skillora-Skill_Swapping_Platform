import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './AuthContext';

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromSkill: string;
  toSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DataContextType {
  users: User[];
  swapRequests: SwapRequest[];
  feedbacks: Feedback[];
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  deleteSwapRequest: (id: string) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getPublicUsers: () => User[];
  updateUserInList: (userId: string, updates: Partial<User>) => void;
  refreshUsers: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const refreshUsers = () => {
    const loadedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(loadedUsers);
  };

  useEffect(() => {
    refreshUsers();
    const loadedRequests = JSON.parse(localStorage.getItem('swapRequests') || '[]');
    const loadedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    
    setSwapRequests(loadedRequests);
    setFeedbacks(loadedFeedbacks);
  }, []);

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedRequests = [...swapRequests, newRequest];
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    const updatedRequests = swapRequests.map(request =>
      request.id === id
        ? { ...request, ...updates, updatedAt: new Date().toISOString() }
        : request
    );
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const deleteSwapRequest = (id: string) => {
    const updatedRequests = swapRequests.filter(request => request.id !== id);
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedFeedbacks = [...feedbacks, newFeedback];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('feedbacks', JSON.stringify(updatedFeedbacks));

    // Update user ratings
    const userFeedbacks = updatedFeedbacks.filter(f => f.toUserId === feedback.toUserId);
    const avgRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length;
    
    updateUserInList(feedback.toUserId, { 
      rating: Math.round(avgRating * 10) / 10,
      totalSwaps: userFeedbacks.length 
    });
  };

  const getPublicUsers = () => {
    return users.filter(user => user.isPublic && !user.isBanned);
  };

  const updateUserInList = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <DataContext.Provider value={{
      users,
      swapRequests,
      feedbacks,
      createSwapRequest,
      updateSwapRequest,
      deleteSwapRequest,
      addFeedback,
      getPublicUsers,
      updateUserInList,
      refreshUsers,
    }}>
      {children}
    </DataContext.Provider>
  );
};