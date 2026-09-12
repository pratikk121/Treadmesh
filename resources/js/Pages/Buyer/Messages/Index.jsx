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
      <Head title="Supplier Inquiries & Messaging | Treadmesh Buyer" />

      <div className="h-[calc(100vh-8rem)] flex rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        {/* Left Panel - Conversation List */}
        <div className="w-full md:w-96 bg-white border-r border-slate-200/80 flex flex-col">
          {/* Header with search and new message button */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-plus-jakarta">Supplier Messages</h2>
                <p className="text-[11px] text-slate-500">Direct negotiations & RFQ clarifications</p>
              </div>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
                title="Compose Message"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Search input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations, RFQs..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Conversation List - Scrollable area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              // Empty state - No conversations
              <div className="p-8 text-center">
                <FiMessageCircle className="mx-auto text-3xl text-slate-300 mb-3" />
                <p className="text-xs font-semibold text-slate-700">No active discussions</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Reach out to verified manufacturers regarding your RFQs.</p>
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Start New Conversation &rarr;
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
                  className={`block p-3.5 hover:bg-slate-50/80 transition-colors ${
                    conversation.unread_count > 0 ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-bold font-plus-jakarta shadow-xs">
                        {conversation.other_user?.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                    </div>

                    {/* Conversation Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold text-slate-900 truncate font-plus-jakarta">
                          {conversation.other_user?.name || 'Verified Supplier'}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap ml-2">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>

                      {/* RFQ Context - if message is about an RFQ */}
                      {conversation.rfq && (
                        <div className="flex items-center text-[10px] text-brand-600 font-medium mb-1 mt-0.5">
                          <FiPackage className="mr-1 w-3 h-3 shrink-0" />
                          <span className="truncate">RFQ: {conversation.rfq.title}</span>
                        </div>
                      )}

                      {/* Last Message Preview */}
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="text-xs text-slate-500 truncate flex-1 font-inter">
                          <span className="text-[10px] font-semibold text-slate-400 mr-1">
                            {conversation.last_message_sender}:
                          </span>
                          {conversation.last_message}
                        </p>

                        {/* Unread Count Badge */}
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 bg-brand-600 text-white text-[10px] font-mono font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>

                      {/* Read Receipt */}
                      {conversation.last_message_sender === 'You' && (
                        <div className="flex items-center mt-1">
                          <BsCheck2All className="text-brand-500 text-xs" />
                          <span className="text-[10px] text-slate-400 ml-1">Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Welcome/Empty State */}
        <div className="hidden md:flex flex-1 bg-slate-50/50 items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600 shadow-xs">
              <FiMessageCircle className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-plus-jakarta">
              Procurement Communications Center
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed font-inter">
              Select a thread from the list to negotiate pricing, request samples, or resolve freight questions with Indian manufacturers.
            </p>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-xs font-semibold inline-flex items-center gap-2 shadow-xs"
            >
              <FiSend className="w-3.5 h-3.5" />
              <span>Compose Inquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setShowNewMessageModal(false)}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-plus-jakarta">Compose Direct Inquiry</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendNewMessage} className="space-y-4 text-xs">
                {/* RFQ Selection (Optional) */}
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Associated RFQ Tender (Optional)
                  </label>
                  <select
                    value={newMessage.rfq_id}
                    onChange={(e) => setNewMessage({ ...newMessage, rfq_id: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="">General Inquiry (No Linked Tender)</option>
                    {rfqs.map((rfq) => (
                      <option key={rfq.id} value={rfq.id}>
                        {rfq.title} ({rfq.rfq_number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Receiver Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Supplier Entity ID / User <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Supplier ID or User Name"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    value={newMessage.receiver_id}
                    onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-inter">
                    Direct communication is permitted with verified suppliers who have participated in your RFQs or orders.
                  </p>
                </div>

                {/* Message Content */}
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Inquiry Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows="4"
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Provide technical specifications, delivery timeline queries, or commercial terms..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.receiver_id || !newMessage.message.trim()}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 shadow-xs transition"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    <span>Send Message</span>
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