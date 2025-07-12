@@ .. @@
   const stats = [
     {
       label: 'Total Users',
-      value: users.length,
+      value: users.filter(u => u.role !== 'admin').length,
       icon: Users,
       color: 'bg-blue-500',
       bgColor: 'bg-blue-50',
       textColor: 'text-blue-700',
     },
@@ .. @@
   const sendBroadcast = () => {
-    alert(`✅ Platform-wide message sent successfully to ${users.filter(u => !u.isBanned && u.role !== 'admin').length} active users!\n\nMessage: "${broadcastMessage}"`);
+    const targetUsers = users.filter(u => !u.isBanned && u.role !== 'admin').map(u => u.id);
+    
+    // Add platform message to data context
+    const platformMessage = {
+      id: Date.now().toString(),
+      content: broadcastMessage,
+      timestamp: new Date().toISOString(),
+      targetUsers: targetUsers,
+      type: 'announcement'
+    };
+    
+    // Save to localStorage for platform messages
+    const existingMessages = JSON.parse(localStorage.getItem('platformMessages') || '[]');
+    existingMessages.push(platformMessage);
+    localStorage.setItem('platformMessages', JSON.stringify(existingMessages));
+    
+    alert(`✅ Platform-wide message sent successfully to ${targetUsers.length} active users!\n\nMessage: "${broadcastMessage}"`);
     setBroadcastMessage('');
     setShowBroadcastModal(false);
   };
@@ .. @@
               <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                 <h3 className="font-semibold text-white mb-4">User Activity Summary</h3>
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-300">Total Registered</span>
-                    <span className="text-sm font-medium text-cyan-400">{users.length}</span>
+                    <span className="text-sm font-medium text-cyan-400">{users.filter(u => u.role !== 'admin').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-300">Active Users</span>
-                    <span className="text-sm font-medium text-green-400">{users.filter(u => !u.isBanned).length}</span>
+                    <span className="text-sm font-medium text-green-400">{users.filter(u => !u.isBanned && u.role !== 'admin').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-300">Public Profiles</span>
-                    <span className="text-sm font-medium text-purple-400">{users.filter(u => u.isPublic).length}</span>
+                    <span className="text-sm font-medium text-purple-400">{users.filter(u => u.isPublic && u.role !== 'admin').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-300">Banned Users</span>
-                    <span className="text-sm font-medium text-red-400">{users.filter(u => u.isBanned).length}</span>
+                    <span className="text-sm font-medium text-red-400">{users.filter(u => u.isBanned && u.role !== 'admin').length}</span>
                   </div>
                 </div>
               </div>