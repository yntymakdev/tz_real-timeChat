// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Send, Users, Plus, Trash2, Search, MessageSquare, UserX } from "lucide-react";

// // Main Chat Application Component
// const Main = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [channels, setChannels] = useState([]);
//   const [activeChannel, setActiveChannel] = useState(null);
//   const [messages, setMessages] = useState({});
//   const [messageInput, setMessageInput] = useState("");
//   const [showChannelModal, setShowChannelModal] = useState(false);
//   const [newChannelName, setNewChannelName] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Initialize user on mount
//   useEffect(() => {
//     initializeUser();
//     loadStoredData();

//     // Simulate real-time updates by checking storage periodically
//     const interval = setInterval(() => {
//       loadStoredData();
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, activeChannel]);

//   // Initialize or retrieve current user
//   const initializeUser = () => {
//     const storedUser = localStorage.getItem("chatUser");
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser));
//     } else {
//       const username = prompt("Enter your username:");
//       if (username) {
//         const user = {
//           id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//           name: username,
//           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
//         };
//         localStorage.setItem("chatUser", JSON.stringify(user));
//         setCurrentUser(user);
//       }
//     }
//   };

//   // Load data from storage
//   const loadStoredData = () => {
//     try {
//       const storedChannels = localStorage.getItem("chatChannels");
//       const storedMessages = localStorage.getItem("chatMessages");

//       if (storedChannels) {
//         setChannels(JSON.parse(storedChannels));
//       }

//       if (storedMessages) {
//         setMessages(JSON.parse(storedMessages));
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   // Save channels to storage
//   const saveChannels = (updatedChannels) => {
//     localStorage.setItem("chatChannels", JSON.stringify(updatedChannels));
//     setChannels(updatedChannels);
//   };

//   // Save messages to storage
//   const saveMessages = (updatedMessages) => {
//     localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
//     setMessages(updatedMessages);
//   };

//   // Create new channel
//   const createChannel = () => {
//     if (!newChannelName.trim() || !currentUser) return;

//     const newChannel = {
//       id: `channel_${Date.now()}`,
//       name: newChannelName.trim(),
//       creatorId: currentUser.id,
//       members: [currentUser],
//       createdAt: new Date().toISOString(),
//     };

//     const updatedChannels = [...channels, newChannel];
//     saveChannels(updatedChannels);
//     setNewChannelName("");
//     setShowChannelModal(false);
//     setActiveChannel(newChannel.id);
//   };

//   // Join existing channel
//   const joinChannel = (channelId) => {
//     if (!currentUser) return;

//     const updatedChannels = channels.map((channel) => {
//       if (channel.id === channelId) {
//         // Check if user is already a member
//         if (!channel.members.find((m) => m.id === currentUser.id)) {
//           return {
//             ...channel,
//             members: [...channel.members, currentUser],
//           };
//         }
//       }
//       return channel;
//     });

//     saveChannels(updatedChannels);
//     setActiveChannel(channelId);
//     setShowJoinModal(false);
//   };

//   // Remove user from channel (only creator can do this)
//   const removeUserFromChannel = (channelId, userId) => {
//     const channel = channels.find((c) => c.id === channelId);
//     if (!channel || channel.creatorId !== currentUser.id || userId === currentUser.id) return;

//     const updatedChannels = channels.map((ch) => {
//       if (ch.id === channelId) {
//         return {
//           ...ch,
//           members: ch.members.filter((m) => m.id !== userId),
//         };
//       }
//       return ch;
//     });

//     saveChannels(updatedChannels);
//   };

//   // Send message
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!messageInput.trim() || !activeChannel || !currentUser) return;

//     const newMessage = {
//       id: `msg_${Date.now()}`,
//       channelId: activeChannel,
//       userId: currentUser.id,
//       userName: currentUser.name,
//       userAvatar: currentUser.avatar,
//       text: messageInput.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     const updatedMessages = {
//       ...messages,
//       [activeChannel]: [...(messages[activeChannel] || []), newMessage],
//     };

//     saveMessages(updatedMessages);
//     setMessageInput("");
//   };

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Get current channel
//   const getCurrentChannel = () => {
//     return channels.find((c) => c.id === activeChannel);
//   };

//   // Filter users based on search
//   const getFilteredMembers = () => {
//     const channel = getCurrentChannel();
//     if (!channel) return [];

//     if (!searchQuery.trim()) return channel.members;

//     return channel.members.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()));
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//   };

//   if (!currentUser) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar - Channels List */}
//       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//               <MessageSquare className="w-6 h-6 text-indigo-600" />
//               Chat App
//             </h1>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowChannelModal(true)}
//               className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Create
//             </button>
//             <button
//               onClick={() => setShowJoinModal(true)}
//               className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 text-sm font-medium"
//             >
//               <Users className="w-4 h-4" />
//               Join
//             </button>
//           </div>
//         </div>

//         <div className="p-3 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
//             <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
//             <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-3">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Your Channels</h3>
//             {channels
//               .filter((ch) => ch.members.some((m) => m.id === currentUser.id))
//               .map((channel) => (
//                 <button
//                   key={channel.id}
//                   onClick={() => setActiveChannel(channel.id)}
//                   className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition ${
//                     activeChannel === channel.id ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   <div className="font-medium"># {channel.name}</div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {channel.members.length} member{channel.members.length !== 1 ? "s" : ""}
//                   </div>
//                 </button>
//               ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {activeChannel ? (
//           <>
//             {/* Chat Header */}
//             <div className="bg-white border-b border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800"># {getCurrentChannel()?.name}</h2>
//                   <p className="text-sm text-gray-500">
//                     {getCurrentChannel()?.members.length} member{getCurrentChannel()?.members.length !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {(messages[activeChannel] || []).map((message) => (
//                 <div key={message.id} className="flex items-start gap-3">
//                   <img src={message.userAvatar} alt={message.userName} className="w-10 h-10 rounded-full" />
//                   <div className="flex-1">
//                     <div className="flex items-baseline gap-2">
//                       <span className="font-semibold text-gray-900">{message.userName}</span>
//                       <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
//                     </div>
//                     <p className="text-gray-700 mt-1">{message.text}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="bg-white border-t border-gray-200 p-4">
//               <form onSubmit={sendMessage} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={messageInput}
//                   onChange={(e) => setMessageInput(e.target.value)}
//                   placeholder={`Message # ${getCurrentChannel()?.name}`}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!messageInput.trim()}
//                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   <Send className="w-4 h-4" />
//                   Send
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             <div className="text-center">
//               <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <h3 className="text-xl font-semibold mb-2">Welcome to Chat App</h3>
//               <p>Select a channel or create a new one to start chatting</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Sidebar - Members */}
//       {activeChannel && (
//         <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//               <Users className="w-5 h-5" />
//               Members
//             </h3>
//           </div>

//           {/* Search Users */}
//           <div className="p-3 border-b border-gray-200">
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search members..."
//                 className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-3">
//             {getFilteredMembers().map((member) => (
//               <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg mb-1">
//                 <div className="flex items-center gap-2">
//                   <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-700">
//                       {member.name}
//                       {member.id === getCurrentChannel()?.creatorId && (
//                         <span className="ml-1 text-xs text-indigo-600">(Creator)</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 {getCurrentChannel()?.creatorId === currentUser.id && member.id !== currentUser.id && (
//                   <button
//                     onClick={() => removeUserFromChannel(activeChannel, member.id)}
//                     className="text-red-500 hover:text-red-700 p-1"
//                     title="Remove user"
//                   >
//                     <UserX className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Create Channel Modal */}
//       {showChannelModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-bold mb-4">Create New Channel</h2>
//             <input
//               type="text"
//               value={newChannelName}
//               onChange={(e) => setNewChannelName(e.target.value)}
//               placeholder="Channel name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               autoFocus
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={createChannel}
//                 disabled={!newChannelName.trim()}
//                 className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
//               >
//                 Create
//               </button>
//               <button
//                 onClick={() => {
//                   setShowChannelModal(false);
//                   setNewChannelName("");
//                 }}
//                 className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Join Channel Modal */}
//       {showJoinModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] flex flex-col">
//             <h2 className="text-xl font-bold mb-4">Join Channel</h2>
//             <div className="flex-1 overflow-y-auto mb-4">
//               {channels.filter((ch) => !ch.members.some((m) => m.id === currentUser.id)).length === 0 ? (
//                 <p className="text-gray-500 text-center py-8">No available channels to join</p>
//               ) : (
//                 channels
//                   .filter((ch) => !ch.members.some((m) => m.id === currentUser.id))
//                   .map((channel) => (
//                     <button
//                       key={channel.id}
//                       onClick={() => joinChannel(channel.id)}
//                       className="w-full text-left p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 transition"
//                     >
//                       <div className="font-medium"># {channel.name}</div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {channel.members.length} member{channel.members.length !== 1 ? "s" : ""}
//                       </div>
//                     </button>
//                   ))
//               )}
//             </div>
//             <button
//               onClick={() => setShowJoinModal(false)}
//               className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Main;
