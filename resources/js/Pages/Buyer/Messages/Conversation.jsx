// Pages/Buyer/Messages/Conversation.jsx

import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { FiArrowLeft, FiSend, FiPackage, FiCheck } from 'react-icons/fi';
import { BsCheck2All } from 'react-icons/bs';

export default function Conversation() {
  const { messages, otherUser, rfq, auth } = usePage().props;

  const initialMessages = useMemo(() => (messages?.data || []), [messages]);
  const [messageList, setMessageList] = useState(initialMessages);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessageList(initialMessages);
    scrollToBottom();
  }, [initialMessages]);

  useEffect(() => {
    if (!window.Echo || !auth?.user?.id) return;

    const channel = window.Echo.private(`App.Models.User.${auth.user.id}`)
      .listen('.MessageSent', (payload) => {
        const matchesRfq = rfq?.id
          ? payload.rfq_id === rfq.id
          : payload.rfq_id == null;
        const otherUserId = otherUser?.id;
        const isForConversation =
          matchesRfq &&
          (payload.sender_id === otherUserId || payload.receiver_id === otherUserId);

        if (isForConversation) {
          setMessageList((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            return [...prev, payload];
          });
          scrollToBottom();
        }
      });

    return () => {
      if (channel) {
        channel.stopListening('.MessageSent');
      }
    };
  }, [auth?.user?.id, otherUser?.id, rfq?.id]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !otherUser?.id) return;

    setSending(true);
    router.post(route('buyer.messages.store'), {
      receiver_id: otherUser.id,
      rfq_id: rfq?.id || '',
      message: replyText.trim()
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setReplyText('');
        setSending(false);
        scrollToBottom();
      },
      onError: () => {
        setSending(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Discussion with ${otherUser?.name || 'Supplier'} | Treadmesh Buyer`} />

      <div className="max-w-4xl mx-auto space-y-4 pb-12">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={route('buyer.messages.index')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
              title="Back to All Messages"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>

            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center font-plus-jakarta shrink-0 shadow-xs">
              {otherUser?.name?.charAt(0).toUpperCase() || 'S'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 font-plus-jakarta">
                  {otherUser?.name || 'Verified Supplier'}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected"></span>
              </div>
              <p className="text-xs text-slate-500 font-inter">
                Direct procurement correspondence & negotiations
              </p>
            </div>
          </div>

          {rfq && (
            <Link
              href={route('buyer.rfqs.show', rfq.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition self-start sm:self-auto border border-indigo-100"
            >
              <FiPackage className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">Tender #{rfq.rfq_number}</span>
            </Link>
          )}
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs flex flex-col h-[520px]">
          {/* Chat Bubble List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messageList.length ? (
              messageList.map((message) => {
                const isMe = message.sender_id === auth?.user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                      }`}
                    >
                      <p className="font-inter whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <BsCheck2All className="text-brand-500" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                <FiPackage className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No messages in this thread yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Send a message below to start your conversation with the supplier.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 mt-2 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message or inquiry..."
              className="flex-1 text-xs border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              <FiSend className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}