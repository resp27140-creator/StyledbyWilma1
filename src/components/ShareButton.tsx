import React, { useState } from 'react';
import { Share2, Check, Copy, Loader2 } from 'lucide-react';

export interface ShareButtonProps {
  /** URL or Data URL of the generated image (e.g. from OutfitSnapshotGenerator) */
  imageUrl?: string | null;
  /** Title of the share payload */
  title?: string;
  /** Text description / caption for social apps & messaging */
  text?: string;
  /** Target link or website URL */
  url?: string;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional custom button label */
  buttonText?: string;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'icon';
  /** Callback upon successful share */
  onShareSuccess?: () => void;
  /** Callback upon error or cancellation */
  onShareError?: (error: unknown) => void;
}

/**
 * ShareButton Component
 * Uses the Web Share API (navigator.share) with File/Image support
 * to share styled outfits on WhatsApp, Telegram, Instagram, etc.
 * Features an automatic fallback to clipboard copy.
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  imageUrl,
  title = 'Styled by Wilma · Mi Look',
  text = '¡Mira el look que armé con Styled by Wilma!',
  url = window.location.href,
  className = '',
  buttonText = 'Compartir',
  variant = 'secondary',
  onShareSuccess,
  onShareError
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      let fileToShare: File | null = null;

      // 1. Convert imageUrl (DataURL or URL) to a File if available
      if (imageUrl) {
        try {
          if (imageUrl.startsWith('data:')) {
            const arr = imageUrl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/png';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            fileToShare = new File([blob], 'outfit-styled-by-wilma.png', { type: mime });
          } else {
            // Fetch remote or local image URL
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            fileToShare = new File([blob], 'outfit-styled-by-wilma.png', { type: blob.type || 'image/png' });
          }
        } catch (imgErr) {
          console.warn('Could not prepare image file for sharing:', imgErr);
        }
      }

      // 2. Prepare Web Share API payload
      const shareData: ShareData = {
        title,
        text,
        url: url || undefined
      };

      if (fileToShare) {
        // Test if navigator.canShare supports files
        if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          shareData.files = [fileToShare];
        }
      }

      // 3. Trigger native Web Share API
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showFeedback('¡Compartido con éxito!');
          onShareSuccess?.();
          return;
        } catch (err: any) {
          // If user aborted / cancelled, do not trigger fallback error
          if (err.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
          // If file sharing failed, try sharing text and url alone
          if (shareData.files) {
            try {
              delete shareData.files;
              await navigator.share(shareData);
              showFeedback('¡Compartido con éxito!');
              onShareSuccess?.();
              return;
            } catch (fallbackErr: any) {
              if (fallbackErr.name === 'AbortError') {
                setIsSharing(false);
                return;
              }
            }
          }
        }
      }

      // 4. Fallback: Copy summary and link to clipboard
      const fallbackText = `${title}\n${text}\n${url || ''}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fallbackText);
        setCopied(true);
        showFeedback('¡Enlace y detalles copiados al portapapeles!');
        setTimeout(() => setCopied(false), 2500);
        onShareSuccess?.();
      } else {
        showFeedback('Listo para compartir');
      }
    } catch (error) {
      console.error('Error during share action:', error);
      onShareError?.(error);
      showFeedback('No se pudo compartir automáticamente.');
    } finally {
      setIsSharing(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] border border-transparent shadow-xs';
      case 'icon':
        return 'p-2 rounded-full border border-[#D9D1C5] bg-white text-[#1A1816] hover:bg-[#FAF8F5]';
      case 'secondary':
      default:
        return 'bg-white text-[#1A1816] border border-[#D9D1C5] hover:bg-[#FAF8F5] shadow-xs';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing}
        title="Compartir en WhatsApp, Instagram o mensajería"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 ${getVariantStyles()} ${className}`}
      >
        {isSharing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : copied ? (
          <Check className="w-3.5 h-3.5 text-[#2E5E4E]" />
        ) : (
          <Share2 className="w-3.5 h-3.5" />
        )}

        {variant !== 'icon' && (
          <span>
            {isSharing
              ? 'Abriendo...'
              : copied
              ? '¡Copiado!'
              : buttonText}
          </span>
        )}
      </button>

      {/* Floating toast notification */}
      {feedback && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A1816] text-[#FAF8F5] text-[11px] rounded-lg whitespace-nowrap shadow-lg z-30 animate-fadeIn pointer-events-none">
          {feedback}
        </div>
      )}
    </div>
  );
};
