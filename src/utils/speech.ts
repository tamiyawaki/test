/**
 * Web Speech API helper for Japanese Text-to-Speech and Speech Recognition.
 * Tuned with friendly, clear pitch and pace suitable for elementary school kids.
 */

class SpeechHelper {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  public speak(
    text: string,
    options?: {
      pitch?: number;
      rate?: number;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      options?.onEnd?.();
      return;
    }

    this.stop();

    // Clean text from markdown or ruby brackets if needed
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\（.+?\）/g, '') // remove inner furigana brackets for smoother reading if needed
      .replace(/\(.+?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.pitch = options?.pitch ?? 1.25; // slightly higher, friendly pitch
    utterance.rate = options?.rate ?? 0.95; // slightly relaxed pace for kids

    // Try to find a good Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(
      (v) => v.lang.includes('ja') || v.name.includes('Japanese') || v.name.includes('Kyoko') || v.name.includes('Otoya')
    );
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      options?.onError?.();
    };

    this.isSpeaking = true;
    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Voice recognition for kids
  public startListening(onResult: (text: string) => void, onEnd: () => void, onError: (err: any) => void) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError(new Error('音声認識に対応していません。キーボードやボタンで入力してね！'));
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ja-JP';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.onerror = (event: any) => {
        onError(event);
      };

      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speech = new SpeechHelper();
