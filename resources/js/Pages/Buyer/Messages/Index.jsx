// Pages/Buyer/Messages/Index.jsx

// React - Core React imports for component functionality
import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiMessageCircle,
  FiSend,
  FiSearch,
  FiPackage,
  FiPlus
} from 'react-icons/fi';
import { BsCheck2All } from 'react-icons/bs';

export default function MessagesIndex({ conversationList, rfqs }) {

  // Destructure auth object from page props
  const { auth } = usePage().props;

  // State management for search, filters and new message form
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState(conversationList);
  const [newMessage, setNewMessage] = useState({ receiver_id: '', rfq_id: '', message: '' });

  // Filter conversations based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = conversationList.filter(conv =>
        conv.other_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.rfq?.title && conv.rfq.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversationList);
    }
  }, [searchTerm, conversationList]);

  // Update filtered conversations when conversation list changes
  useEffect(() => {
    setFilteredConversations(conversationList);
  }, [conversationList]);

  // Set up real-time Echo listener for new messages
  useEffect(() => {
    if (!window.Echo || !auth?.user?.id) return;

    const channel = window.Echo.private(`App.Models.User.${auth.user.id}`)
      .listen('.MessageSent', () => {
        // Reload conversation list when new message arrives
        router.reload({ only: ['conversationList'], preserveScroll: true, preserveState: true });
      });

    // Cleanup listener on component unmount
    return () => {
      if (channel) {
        channel.stopListening('.MessageSent');
      }
    };
  }, [auth?.user?.id]);

  // Format message time for display
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'yesterday';
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Handle new message submission
  const handleSendNewMessage = (e) => {
    e.preventDefault();
    if (!newMessage.receiver_id || !newMessage.message.trim()) return;

    router.post(route('buyer.messages.store'), newMessage, {
      onSuccess: () => {
        setShowNewMessageModal(false);
        setNewMessage({ receiver_id: '', rfq_id: '', message: '' });
        router.reload({ only: ['conversationList'] });
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title="Message - Buyer" />

      <div className="h-[calc(100vh-8rem)] flex">
        {/* Left Panel - Conversation List */}
        <div className="w-full md:w-96 bg-white border-r flex flex-col">
          {/* Header with search and new message button */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Message</h2>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                title="New message"
              >
                <FiPlus />
              </button>
            </div>

            {/* Search input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Conversation search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversation List - Scrollable area */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              // Empty state - No conversations
              <div className="p-8 text-center">
                <FiMessageCircle className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-500">No conversation</p>
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  Start a new conversation
                </button>
              </div>
            ) : (
              // List of conversations
              filteredConversations.map((conversation) => (
                <Link
                  key={conversation.key}
                  href={conversation.rfq_id
                    ? route('buyer.messages.with-rfq', [conversation.other_user_id, conversation.rfq_id])
                    : route('buyer.messages.with', conversation.other_user_id)
                  }
                  className={`block p-4 border-b hover:bg-gray-50 transition-colors ${conversation.unread_count > 0 ? 'bg-indigo-50' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {conversation.other_user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Conversation Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 truncate">
                          {conversation.other_user.name}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>

                      {/* RFQ Context - if message is about an RFQ */}
                      {conversation.rfq && (
                        <div className="flex items-center text-xs text-indigo-600 mb-1">
                          <FiPackage className="mr-1" />
                          <span className="truncate">RFQ: {conversation.rfq.title}</span>
                        </div>
                      )}

                      {/* Last Message Preview */}
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          <span className="text-xs text-gray-400 mr-1">
                            {conversation.last_message_sender}:
                          </span>
                          {conversation.last_message}
                        </p>

                        {/* Unread Count Badge */}
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>

                      {/* Read Receipt - for messages sent by current user */}
                      {conversation.last_message_sender === 'You' && (
                        <div className="flex items-center mt-1">
                          <BsCheck2All className="text-blue-500 text-xs" />
                          <span className="text-xs text-gray-400 ml-1">Sent</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Welcome/Empty State (hidden on mobile) */}
        <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMessageCircle className="text-4xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Your Messages</h3>
            <p className="text-gray-600 mb-6">
              Select a conversation from the list to chat with suppliers regarding RFQs and orders.
            </p>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <FiSend className="mr-2" />
              New message
            </button>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowNewMessageModal(false)}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">New message</h3>

              <form onSubmit={handleSendNewMessage}>
                {/* RFQ Selection (Optional) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related RFQ (Optional)
                  </label>
                  <select
                    value={newMessage.rfq_id}
                    onChange={(e) => setNewMessage({ ...newMessage, rfq_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">General messages</option>
                    {rfqs.map((rfq) => (
                      <option key={rfq.id} value={rfq.id}>
                        {rfq.title} ({rfq.rfq_number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Receiver Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Supplier Name or ID"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newMessage.receiver_id}
                    onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You may only send messages to suppliers with whom you have an active RFQ or order.
                  </p>
                </div>

                {/* Message Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows="4"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your message here..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.receiver_id || !newMessage.message.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    <FiSend className="mr-2" />
                    send message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}