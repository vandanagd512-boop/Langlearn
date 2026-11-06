import { ITranslationService, TranslationRequest, TranslationResult } from './translation-service.interface';

export class TranslationService implements ITranslationService {
  private cache = new Map<string, string>();

  // Language mapping to ISO codes
  private langCodeMap: Record<string, string> = {
    kn: 'kn',
    hi: 'hi',
    ta: 'ta',
    te: 'te',
    ml: 'ml',
    mr: 'mr',
    bn: 'bn',
    gu: 'gu',
    pa: 'pa',
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    ja: 'ja',
  };

  // Comprehensive multi-language vocabulary dictionary for instant offline lookup
  private offlineDictionary: Record<string, Record<string, string>> = {
    // English -> Kannada
    'en:kn': {
      'hello': 'ನಮಸ್ಕಾರ (Namaskara)',
      'hi': 'ಹಲೋ (Halo)',
      'how are you': 'ನೀವು ಹೇಗಿದ್ದೀರಿ? (Neevu hegiddiri?)',
      'how are you?': 'ನೀವು ಹೇಗಿದ್ದೀರಿ? (Neevu hegiddiri?)',
      'i am fine': 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ (Naanu chennagiddene)',
      'what is your name?': 'ನಿಮ್ಮ ಹೆಸರೇನು? (Nimma hesarenu?)',
      'what is your name': 'ನಿಮ್ಮ ಹೆಸರೇನು? (Nimma hesarenu?)',
      'my name is': 'ನನ್ನ ಹೆಸರು (Nanna hesaru)',
      'thank you': 'ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)',
      'thank you very much': 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು (Tumba dhanyavadagalu)',
      'please': 'ದಯವಿಟ್ಟು (Dayavittu)',
      'welcome': 'ಸುಸ್ವಾಗತ (Suswagatha)',
      'good morning': 'ಶುಭೋದಯ (Shubhodaya)',
      'good evening': 'ಶುಭ ಸಂಜೆ (Shubha sanje)',
      'good night': 'ಶುಭ ರಾತ್ರಿ (Shubha raatri)',
      'where is': 'ಎಲ್ಲಿದೆ (Ellide)',
      'where is the station?': 'ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? (Railu nildana ellide?)',
      'how much': 'ಎಷ್ಟು (Eshtu)',
      'how much is this?': 'ಇದರ ಬೆಲೆ ಎಷ್ಟು? (Idara bele eshtu?)',
      'water': 'ನೀರು (Neeru)',
      'food': 'ಊಟ (Oota)',
      'coffee': 'ಕಾಫಿ (Kaapi)',
      'tea': 'ಚಹಾ (Chaha)',
      'help': 'ಸಹಾಯ (Sahaaya)',
      'yes': 'ಹೌದು (Haudu)',
      'no': 'ಇಲ್ಲ (Illa)',
      'goodbye': 'ಮತ್ತೆ ಸಿಗೋಣ (Matte sigona)',
      'see you later': 'ನಂತರ ಸಿಗೋಣ (Nantara sigona)',
      'i love you': 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ (Naanu ninnannu preethisuthene)',
      'where are you going?': 'ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ? (Neevu ellige hoguttiddiri?)',
      'what are you doing?': 'ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ? (Neevu enu maaduttiddiri?)',
      'what are you doing': 'ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ? (Neevu enu maaduttiddiri?)',
      'i want water': 'ನನಗೆ ನೀರು ಬೇಕು (Nanage neeru beku)',
      'i am learning kannada': 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ (Naanu Kannada kaliyuttiddene)',
      'where is the hotel?': 'ಹೋಟೆಲ್ ಎಲ್ಲಿದೆ? (Hotel ellide?)',
      'good': 'ಒಳ್ಳೆಯದು (Olleyaadu)',
      'bad': 'ಕೆಟ್ಟದ್ದು (Kettaddu)',
      'friend': 'ಸ್ನೇಹಿತ (Snehita)',
      'mother': 'ಅಮ್ಮ (Amma)',
      'father': 'ಅಪ್ಪ (Appa)',
      'brother': 'ಅಣ್ಣ (Anna)',
      'sister': 'ಅಕ್ಕ (Akka)',
    },
    // Kannada -> English
    'kn:en': {
      'ನಮಸ್ಕಾರ': 'Hello / Greetings',
      'ಹಲೋ': 'Hello',
      'ನೀವು ಹೇಗಿದ್ದೀರಿ?': 'How are you?',
      'ನೀವು ಹೇಗಿದ್ದೀರಿ': 'How are you?',
      'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ': 'I am fine',
      'ನಿಮ್ಮ ಹೆಸರೇನು?': 'What is your name?',
      'ನಿಮ್ಮ ಹೆಸರೇನು': 'What is your name?',
      'ಧನ್ಯವಾದಗಳು': 'Thank you',
      'ದಯವಿಟ್ಟು': 'Please',
      'ಸುಸ್ವಾಗತ': 'Welcome',
      'ಶುಭೋದಯ': 'Good morning',
      'ಶುಭ ರಾತ್ರಿ': 'Good night',
      'ನೀರು': 'Water',
      'ಊಟ': 'Food',
      'ಕಾಫಿ': 'Coffee',
      'ಚಹಾ': 'Tea',
      'ಸಹಾಯ': 'Help',
      'ಹೌದು': 'Yes',
      'ಇಲ್ಲ': 'No',
      'ಮತ್ತೆ ಸಿಗೋಣ': 'Goodbye / See you again',
    },
    // English -> Hindi
    'en:hi': {
      'hello': 'नमस्ते (Namaste)',
      'hi': 'नमस्ते (Namaste)',
      'how are you': 'आप कैसे हैं? (Aap kaise hain?)',
      'how are you?': 'आप कैसे हैं? (Aap kaise hain?)',
      'i am fine': 'मैं ठीक हूँ (Main theek hoon)',
      'what is your name?': 'आपका नाम क्या है? (Aapka naam kya hai?)',
      'what is your name': 'आपका नाम क्या है? (Aapka naam kya hai?)',
      'my name is': 'मेरा नाम है (Mera naam hai)',
      'thank you': 'धन्यवाद (Dhanyavaad)',
      'thank you very much': 'बहुत बहुत धन्यवाद (Bahut bahut dhanyavaad)',
      'please': 'कृपया (Kripaya)',
      'welcome': 'स्वागत है (Swagat hai)',
      'good morning': 'शुभ प्रभात (Shubh Prabhat)',
      'good night': 'शुभ रात्रि (Shubh Raatri)',
      'where is the station?': 'स्टेशन कहाँ है? (Station kahan hai?)',
      'how much is this?': 'यह कितने का है? (Yeh kitne ka hai?)',
      'water': 'पानी (Paani)',
      'food': 'खाना (Khaana)',
      'tea': 'चाय (Chai)',
      'help': 'मदद (Madad)',
      'yes': 'हाँ (Haan)',
      'no': 'नहीं (Nahi)',
      'goodbye': 'अलविदा (Alvida)',
      'where are you going?': 'आप कहाँ जा रहे हैं? (Aap kahan ja rahe hain?)',
      'what are you doing?': 'आप क्या कर रहे हैं? (Aap kya kar rahe hain?)',
    },
    // English -> Tamil
    'en:ta': {
      'hello': 'வணக்கம் (Vanakkam)',
      'how are you': 'நீங்கள் எப்படி இருக்கிறீர்கள்? (Neengal eppadi irukkeergal?)',
      'how are you?': 'நீங்கள் எப்படி இருக்கிறீர்கள்? (Neengal eppadi irukkeergal?)',
      'thank you': 'நன்றி (Nandri)',
      'welcome': 'நல்வரவு (Nalvaravu)',
      'good morning': 'காலை வணக்கம் (Kaalai vanakkam)',
      'what is your name?': 'உங்கள் பெயர் என்ன? (Ungal peyar enna?)',
      'water': 'தண்ணீர் (Thanneer)',
      'food': 'சாப்பாடு (Saapaadu)',
      'how much is this?': 'இதன் விலை என்ன? (Idhan vilai enna?)',
      'goodbye': 'போய் வருகிறேன் (Poi varugiren)',
    },
    // English -> Telugu
    'en:te': {
      'hello': 'నమస్కారం (Namaskaram)',
      'how are you': 'మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)',
      'how are you?': 'మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)',
      'i am fine': 'నేను బాగున్నాను (Nenu bagunnanu)',
      'what is your name?': 'మీ పేరు ఏమిటి? (Mee peru emiti?)',
      'thank you': 'ధన్యవాదాలు (Dhanyavadalu)',
      'water': 'నీరు / మంచి నీళ్ళు (Neeru)',
      'food': 'భోజనం (Bhojanam)',
      'coffee': 'కాఫీ (Coffee)',
      'goodbye': 'వెళ్ళివస్తాను (Velli vasthanu)',
    },
    // English -> Spanish
    'en:es': {
      'hello': 'Hola',
      'how are you': '¿Cómo estás?',
      'how are you?': '¿Cómo estás?',
      'thank you': 'Gracias',
      'please': 'Por favor',
      'water': 'Agua',
      'food': 'Comida',
      'good morning': 'Buenos días',
      'good night': 'Buenas noches',
      'goodbye': 'Adiós',
    },
  };

  /**
   * Main Translation Engine:
   * 1. Check local cache
   * 2. Try Google Translate API (Global, fast, handles all languages without 500-char limits)
   * 3. Try MyMemory API with strict error protection (never output "query length limit" errors)
   * 4. Try Lingva API fallback
   * 5. Match against Comprehensive offline dictionary
   * 6. Intelligent token-level translation
   */
  public async translate(request: TranslationRequest): Promise<TranslationResult> {
    const { text, sourceLanguage, targetLanguage } = request;
    const cleanText = text.trim();

    if (!cleanText) {
      return {
        originalText: text,
        translatedText: '',
        sourceLanguage,
        targetLanguage,
        confidence: 1.0,
      };
    }

    if (sourceLanguage === targetLanguage) {
      return {
        originalText: text,
        translatedText: cleanText,
        sourceLanguage,
        targetLanguage,
        confidence: 1.0,
      };
    }

    const cacheKey = `${sourceLanguage}:${targetLanguage}:${cleanText.toLowerCase()}`;
    if (this.cache.has(cacheKey)) {
      return {
        originalText: text,
        translatedText: this.cache.get(cacheKey)!,
        sourceLanguage,
        targetLanguage,
        confidence: 0.99,
      };
    }

    const srcCode = this.langCodeMap[sourceLanguage] || sourceLanguage;
    const tgtCode = this.langCodeMap[targetLanguage] || targetLanguage;

    // 1. Check offline dictionary for instant exact phrase match
    const dictKey = `${sourceLanguage}:${targetLanguage}`;
    const dictMatch = this.offlineDictionary[dictKey]?.[cleanText.toLowerCase()];
    if (dictMatch) {
      this.cache.set(cacheKey, dictMatch);
      return {
        originalText: text,
        translatedText: dictMatch,
        sourceLanguage,
        targetLanguage,
        confidence: 0.99,
      };
    }

    // 2. Primary Engine: Google Translate GTX Web API
    try {
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(cleanText)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(gtxUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => (item && item[0] ? item[0] : ''))
            .join('')
            .trim();

          if (translated && !translated.toLowerCase().includes('query length')) {
            this.cache.set(cacheKey, translated);
            return {
              originalText: text,
              translatedText: translated,
              sourceLanguage,
              targetLanguage,
              confidence: 0.98,
            };
          }
        }
      }
    } catch {
      // Proceed to secondary engine
    }

    // 3. Secondary Engine: MyMemory Neural Translation (Safe 400-char truncated chunks)
    try {
      const safeText = cleanText.slice(0, 400);
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(safeText)}&langpair=${srcCode}|${tgtCode}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(myMemoryUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
          const t: string = data.responseData.translatedText.trim();
          // STRICT FILTER: Never output any API error / query limit message
          const isError = /query length|limit exceed|mymemory warning|quota|invalid|please select/i.test(t);
          if (!isError && t !== safeText) {
            this.cache.set(cacheKey, t);
            return {
              originalText: text,
              translatedText: t,
              sourceLanguage,
              targetLanguage,
              confidence: 0.92,
            };
          }
        }
      }
    } catch {
      // Proceed to tertiary engine
    }

    // 4. Tertiary Engine: Lingva open mirror API
    try {
      const lingvaUrl = `https://lingva.ml/api/v1/${srcCode}/${tgtCode}/${encodeURIComponent(cleanText.slice(0, 300))}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(lingvaUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.translation) {
          const t: string = data.translation.trim();
          if (t && !/error|limit/i.test(t)) {
            this.cache.set(cacheKey, t);
            return {
              originalText: text,
              translatedText: t,
              sourceLanguage,
              targetLanguage,
              confidence: 0.90,
            };
          }
        }
      }
    } catch {
      // Proceed to dictionary
    }

    // 5. Fallback: Intelligent Tokenized Translation
    const words = cleanText.split(/\s+/);
    const translatedTokens: string[] = [];
    const directDict = this.offlineDictionary[dictKey] || {};

    for (const w of words) {
      const normalizedWord = w.toLowerCase().replace(/[.,!?;:]/g, '');
      if (directDict[normalizedWord]) {
        const cleanMatch = directDict[normalizedWord].split('(')[0].trim();
        translatedTokens.push(cleanMatch);
      } else {
        translatedTokens.push(w);
      }
    }

    const tokenResult = translatedTokens.join(' ');
    // Cache and return
    this.cache.set(cacheKey, tokenResult);

    return {
      originalText: text,
      translatedText: tokenResult,
      sourceLanguage,
      targetLanguage,
      confidence: 0.85,
    };
  }

  public async detectLanguage(text: string): Promise<string> {
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi / Marathi
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
    if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'ja'; // Japanese
    return 'en';
  }
}

export const translationService = new TranslationService();
