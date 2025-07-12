@@ .. @@
+export interface ChatMessage {
+  id: string;
+  senderId: string;
+  senderName: string;
+  content: string;
+  timestamp: string;
+  type: 'user';
+}
+
+export interface PlatformMessage {
+  id: string;
+  content: string;
+  timestamp: string;
+  targetUsers?: string[];
+  type: string;
+}
+
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
+  addChatMessage: (swapId: string, message: ChatMessage) => void;
+  getChatMessages: (swapId: string) => ChatMessage[];
+  getPlatformMessages: () => PlatformMessage[];
 }
@@ .. @@
   const updateUserInList = (userId: string, updates: Partial<User>) => {
     const updatedUsers = users.map(user =>
       user.id === userId ? { ...user, ...updates } : user
     );
     setUsers(updatedUsers);
     localStorage.setItem('users', JSON.stringify(updatedUsers));
   };
 
+  const addChatMessage = (swapId: string, message: ChatMessage) => {
+    const existingMessages = JSON.parse(localStorage.getItem(`chat_${swapId}`) || '[]');
+    const updatedMessages = [...existingMessages, message];
+    localStorage.setItem(`chat_${swapId}`, JSON.stringify(updatedMessages));
+  };
+
+  const getChatMessages = (swapId: string): ChatMessage[] => {
+    return JSON.parse(localStorage.getItem(`chat_${swapId}`) || '[]');
+  };
+
+  const getPlatformMessages = (): PlatformMessage[] => {
+    return JSON.parse(localStorage.getItem('platformMessages') || '[]');
+  };
+
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
+      addChatMessage,
+      getChatMessages,
+      getPlatformMessages,
     }}>
       {children}
     </DataContext.Provider>
   );