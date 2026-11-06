import React, { useState, useRef, useEffect } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import {
  MessageSquare,
  Send,
  Volume2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  language: string;
  languageCode: string;
  persona: string;
  personaAvatar: string;
  situation: string;
  initialMessage: {
    native: string;
    romanized: string;
    english: string;
  };
  sampleReplies: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cafe-kn',
    title: 'Ordering at a Bengaluru Cafe',
    subtitle: 'Filter coffee, crispy dosa, and polite requests',
    icon: '☕',
    language: 'Kannada',
    languageCode: 'kn-IN',
    persona: 'Ramesh (Cafe Counter)',
    personaAvatar: '👨‍🍳',
    situation: 'You just stepped up to the busy cashier counter at a South Indian Darshini cafe.',
    initialMessage: {
      native: 'ನಮಸ್ಕಾರ ಸರ್, ನಿಮಗೆ ಏನು ಬೇಕು? ಬಿಸಿ ದೋಸೆ ಅಥವಾ ಕಾಫಿ?',
      romanized: 'Namaskara sir, nimage enu beku? Bisi dose athava coffee?',
      english: 'Hello sir, what would you like? Hot dosa or coffee?',
    },
    sampleReplies: [
      'ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ (One hot filter coffee please)',
      'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಎಷ್ಟು ಬೆಲೆ? (How much is one masala dosa?)',
      'ಚಹಾ ಇದೆಯಾ? (Do you have tea?)',
    ],
  },
  {
    id: 'auto-hi',
    title: 'Negotiating an Auto Rickshaw',
    subtitle: 'Agreeing on fare, meter, and street directions',
    icon: '🛺',
    language: 'Hindi',
    languageCode: 'hi-IN',
    persona: 'Suresh (Auto Driver)',
    personaAvatar: '🛺',
    situation: 'You are waving down an auto rickshaw on a busy avenue in Delhi.',
    initialMessage: {
      native: 'हाँजी भाईसाहब, कहाँ जाना है आपको? मीटर से चलेंगे।',
      romanized: 'Haanji bhaisahab, kahan jaana hai aapko? Meter se chalenge.',
      english: 'Yes brother, where do you want to go? We will go by meter.',
    },
    sampleReplies: [
      'कनॉट प्लेस जाना है, कितना लोगे? (Need to go to Connaught Place, how much?)',
      'भैया मीटर चालू कर दो (Brother, please turn on the meter)',
      'सीधे चलो फिर बाएं मुड़ना (Go straight then turn left)',
    ],
  },
  {
    id: 'hotel-ta',
    title: 'Heritage Hotel Check-in',
    subtitle: 'Booking confirmation, Wi-Fi, and breakfast timing',
    icon: '🏨',
    language: 'Tamil',
    languageCode: 'ta-IN',
    persona: 'Priya (Receptionist)',
    personaAvatar: '👩‍💼',
    situation: 'You have arrived at the lobby desk in Chennai for your weekend reservation.',
    initialMessage: {
      native: 'வணக்கம்! உங்கள் முன்பதிவு விவரங்களை சொல்ல முடியுமா?',
      romanized: 'Vanakkam! Ungal munpadhivu vivarangalai solla mudiyuma?',
      english: 'Welcome! Could you please tell me your booking details?',
    },
    sampleReplies: [
      'என் பெயர் ராகுல், ரூம் புக் பண்ணிருக்கேன் (My name is Rahul, I booked a room)',
      'காலை உணவு எத்தனை மணிக்கு? (What time is breakfast?)',
      'வைஃபை பாஸ்வேர்ட் என்ன? (What is the Wi-Fi password?)',
    ],
  },
];

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  native: string;
  romanized?: string;
  english?: string;
  aiFeedback?: {
    accuracy: number;
    tip: string;
  };
}

export const ConversationPage: React.FC = () => {
  const { notify } = useNotification();

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      native: SCENARIOS[0].initialMessage.native,
      romanized: SCENARIOS[0].initialMessage.romanized,
      english: SCENARIOS[0].initialMessage.english,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [completedTurns, setCompletedTurns] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectScenario = (sc: Scenario) => {
    setActiveScenario(sc);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        native: sc.initialMessage.native,
        romanized: sc.initialMessage.romanized,
        english: sc.initialMessage.english,
      },
    ]);
    setCompletedTurns(0);
    setIsCompleted(false);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      native: text,
      aiFeedback: {
        accuracy: 94 + Math.floor(Math.random() * 6),
        tip: '✨ Excellent natural sentence structure! Tone is polite and well-received.',
      },
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const nextTurn = completedTurns + 1;
    setCompletedTurns(nextTurn);

    // AI Simulated Dynamic Response
    setTimeout(() => {
      setIsTyping(false);

      let aiReply: ChatMessage;
      if (nextTurn >= 3) {
        setIsCompleted(true);
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          native: 'ಬಹಳ ಸಂತೋಷ! ನಿಮ್ಮ ಆರ್ಡರ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ. ತುಂಬಾ ಧನ್ಯವಾದಗಳು! 🎉',
          romanized: 'Bahala santhosha! Nimma order siddhavaguttide. Tumba dhanyavadagalu!',
          english: 'Wonderful! Your order is being prepared. Thank you very much!',
        };
        notify({
          type: 'success',
          title: 'Scenario Completed! 🏆',
          message: 'You completed the dialogue scenario with 96% fluency. Earned +40 XP!',
        });
      } else {
        const replies = [
          {
            native: 'ಸರಿ ಸರ್, ೨ ನಿಮಿಷದಲ್ಲಿ ಬಿಸಿ ಬಿಸಿಯಾಗಿ ರೆಡಿ ಮಾಡ್ತೀನಿ. ಸಕ್ಕರೆ ಕಡಿಮೆ ಬೇಕಾ?',
            romanized: 'Sari sir, 2 nimishadalli bisi bisiyagi ready maadtini. Sakkare kadime beka?',
            english: 'Alright sir, ready in 2 minutes hot. Do you want less sugar?',
          },
          {
            native: 'ಖಂಡಿತ! ಬಿಲ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಾವತಿ ಮಾಡಿ. ರಶೀದಿ ಇಲ್ಲಿದೆ.',
            romanized: 'Khanditha! Bill counter-nalli paavathi maadi. Rasheedi illide.',
            english: 'Sure! Please pay at the bill counter. Here is your receipt.',
          },
        ];
        const pick = replies[(nextTurn - 1) % replies.length];
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          native: pick.native,
          romanized: pick.romanized,
          english: pick.english,
        };
      }

      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const handleSpeak = (text: string) => {
    SpeechService.speak(text, activeScenario.languageCode);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      <ModuleHeader
        title="AI Roleplay Conversation Partner"
        subtitle="Practice spontaneous dialogue with intelligent native character personas."
        icon={MessageSquare}
        badge="Interactive AI Coach"
      />

      {/* Scenario Selector Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {SCENARIOS.map((sc) => {
          const isActive = sc.id === activeScenario.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 shrink-0 transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{sc.icon}</span>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {sc.title}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {sc.persona} • {sc.language}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Roleplay Chat Window */}
      <Card className="p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800 flex flex-col h-[480px] shadow-lg">
        {/* Chat Room Header */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-lg">
              {activeScenario.personaAvatar}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {activeScenario.persona}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Fluency Coach Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">
              Turn {Math.min(3, completedTurns)}/3
            </span>
            <button
              onClick={() => handleSelectScenario(activeScenario)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Restart Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Situation Context Pill */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-medium">
              📍 {activeScenario.situation}
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-relaxed block">
                      {msg.native}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.native)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 shrink-0"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {msg.romanized && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {msg.romanized}
                    </div>
                  )}

                  {msg.english && (
                    <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-1 italic">
                      "{msg.english}"
                    </div>
                  )}
                </div>

                {/* AI Instant Grammar & Politeness Feedback Badge */}
                {msg.aiFeedback && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Fluency: {msg.aiFeedback.accuracy}% • {msg.aiFeedback.tip}</span>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1 text-slate-400 text-xs p-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-semibold ml-1.5">{activeScenario.persona} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Replies */}
        {!isCompleted && (
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1">
              Suggested Replies (Tap to speak)
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {activeScenario.sampleReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl whitespace-nowrap transition"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            disabled={isCompleted}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isCompleted ? 'Scenario complete! Tap Restart to try again.' : 'Type your reply in native script or English...'}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isCompleted}
            className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};