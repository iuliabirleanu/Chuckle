// Text to speech utility with comedic pauses for punchline delivery

export interface SpeechState {
  isSpeaking: boolean;
  cancel: () => void;
}

export function speakJoke(
  setup: string,
  punchline: string,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance for setup
  const textToSpeak = `${setup} ... ... ${punchline}`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Pick an engaging English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google')))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.rate = 0.95; // Slightly measured for comedic clarity
  utterance.pitch = 1.05;

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
    onEnd?.();
  };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
