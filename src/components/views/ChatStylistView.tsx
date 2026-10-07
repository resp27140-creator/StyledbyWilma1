import React, { useState, useRef, useEffect } from 'react';
import { FullStyleDNA, WardrobeItem, ChatMessage } from '../../types/index.ts';
import { requestChatWithWilma } from '../../lib/api.ts';
import {
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Paperclip,
  Trash2,
  User,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface ChatStylistViewProps {
  styleDNA: FullStyleDNA;
  wardrobe: WardrobeItem[];
  messages: ChatMessage[];
  onUpdateMessages: (messages: ChatMessage[]) => void;
}

export const ChatStylistView: React.FC<ChatStylistViewProps> = ({
  styleDNA,
  wardrobe,
  messages,
  onUpdateMessages
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      contenido: textToSend,
      imagenUrl: attachedImage || undefined,
      createdAt: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    onUpdateMessages(newHistory);
    setInputText('');
    const currentAttachment = attachedImage;
    setAttachedImage(null);
    setLoading(true);

    try {
      const response = await requestChatWithWilma(
        textToSend,
        newHistory,
        styleDNA,
        wardrobe,
        currentAttachment || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `wilma_${Date.now()}`,
        role: 'assistant',
        contenido: response.reply,
        createdAt: new Date().toISOString(),
        suggestedActions: response.suggestedActions
      };

      onUpdateMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `wilma_err_${Date.now()}`,
        role: 'assistant',
        contenido: 'Lo siento, ha ocurrido un error al conectar con el servicio de estilismo. Por favor, inténtalo de nuevo.',
        createdAt: new Date().toISOString()
      };
      onUpdateMessages([...newHistory, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    onUpdateMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        contenido: `¡Hola ${styleDNA.user.displayName.split(' ')[0]}! ✨ Qué alegría verte. Conozco a fondo tu Style DNA (${styleDNA.color.subestacion}, proporciones equilibradas y preferencia por piezas clásicas fluidas). ¿En qué te ayudo hoy?`,
        createdAt: new Date().toISOString(),
        suggestedActions: [
          '¿Qué me pongo hoy para una cena casual?',
          'Revisar si este color verde me favorece',
          '¿Qué prenda falta en mi armario cápsula?'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 h-[calc(100vh-160px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E5E4E]" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
              Estilista Personal Wilma · En Línea
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1816]">
            Pregúntale a tu stylist
          </h1>
        </div>

        <button
          onClick={handleClearHistory}
          className="text-xs text-[#7A7062] hover:text-[#964B44] flex items-center gap-1.5 transition-colors"
          title="Reiniciar conversación"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reiniciar chat</span>
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 p-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#EADBCE] text-[#1A1816]'
                    : 'bg-[#1A1816] text-[#FAF8F5] font-editorial text-base shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-[#5E5549]" /> : 'W'}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1A1816] text-[#FAF8F5] rounded-tr-xs'
                      : 'bg-white border border-[#E2DBD0] text-[#1A1816] shadow-xs rounded-tl-xs'
                  }`}
                >
                  {msg.imagenUrl && (
                    <img
                      src={msg.imagenUrl}
                      alt="Adjunto"
                      className="w-48 h-48 object-cover rounded-xl mb-3 border border-black/10"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{msg.contenido}</p>
                </div>

                {/* Suggested Follow-up Actions */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 pl-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] px-3 py-1 rounded-full bg-[#F3EFEA] hover:bg-[#EADBCE] text-[#5E5549] hover:text-[#1A1816] transition-colors border border-[#DDD5C9]"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-9 h-9 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center shrink-0 font-editorial text-base">
              W
            </div>
            <div className="p-4 rounded-3xl bg-white border border-[#E2DBD0] text-xs text-[#7A7062] flex items-center gap-2 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#8A5B38]" />
              <span>Wilma está consultando tu Style DNA y tu armario...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white rounded-3xl p-3 border border-[#E2DBD0] shadow-sm space-y-2">
        {attachedImage && (
          <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-xl border border-[#E0D8CB] w-fit">
            <img
              src={attachedImage}
              alt="Foto adjunta"
              className="w-10 h-10 object-cover rounded-lg"
            />
            <span className="text-xs text-[#5E5549]">Imagen adjunta para Wilma</span>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-[#8C8275] hover:text-[#1A1816] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="p-2 rounded-full text-[#7A7062] hover:text-[#1A1816] hover:bg-[#FAF8F5] cursor-pointer transition-colors">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Pregúntale a Wilma (ej. ¿Cómo combinar mi blazer camel? ¿Qué me pongo mañana?)"
            className="flex-1 bg-transparent px-2 py-2 text-sm text-[#1A1816] placeholder-[#8C8275] focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || (!inputText.trim() && !attachedImage)}
            className="w-10 h-10 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center hover:bg-[#332E2A] transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
