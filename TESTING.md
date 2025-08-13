# 🧪 Testowanie SketchStory AI

## 🎨 Testowanie AI Image Generation

### 1. Demo Mode (Bez API)
1. Otwórz aplikację w przeglądarce
2. Upewnij się, że wybrany jest "Demo (bez klucza)"
3. Włącz "Automatyczne generowanie obrazów"
4. Wprowadź temat: "Historia o startupie technologicznym"
5. Kliknij "Generuj Animację"
6. **Oczekiwany rezultat**: Elementy wizualne z emoji i kształtami

### 2. Google Gemini + Hugging Face (Bezpłatne)
1. Uzyskaj klucz Gemini z [Google AI Studio](https://aistudio.google.com/app/apikey)
2. W ustawieniach wybierz "Google Gemini"
3. Wprowadź klucz API
4. Przetestuj połączenie
5. Włącz "Automatyczne generowanie obrazów"
6. Wprowadź temat: "Jak działa fotosynteza"
7. Kliknij "Generuj Animację"
8. **Oczekiwany rezultat**: Obrazy AI generowane przez Hugging Face

### 3. OpenAI DALL-E (Płatne)
1. Uzyskaj klucz OpenAI z [OpenAI Platform](https://platform.openai.com/api-keys)
2. W ustawieniach wybierz "OpenAI"
3. Wprowadź klucz API
4. Włącz "Automatyczne generowanie obrazów"
5. Wprowadź temat: "Historia o podróży kosmicznej"
6. Kliknij "Generuj Animację"
7. **Oczekiwany rezultat**: Obrazy AI najwyższej jakości z DALL-E

## 🔍 Debugowanie

### Console Logs
Otwórz DevTools (F12) i sprawdź console:

```
🎨 Generating AI image with provider: gemini
🤖 Using Hugging Face (Stable Diffusion) for image generation...
📝 Hugging Face prompt: Whiteboard illustration: Jak działa fotosynteza...
🌐 Sending request to Hugging Face API...
📡 Hugging Face response status: 200
✅ Hugging Face API response successful, processing image...
🖼️ Image blob created, size: 12345 bytes
✅ Generated AI image for step 0: {type: 'ai-image', url: 'blob:...', ...}
```

### Network Tab
1. Otwórz DevTools → Network
2. Kliknij "Generuj Animację"
3. Sprawdź requesty do:
   - `api-inference.huggingface.co` (Hugging Face)
   - `api.openai.com` (DALL-E)
   - `api.deepai.org` (Alternative API)

### Common Issues

#### ❌ Hugging Face Rate Limited
```
❌ Hugging Face API Error: 429 Too Many Requests
⏰ Hugging Face rate limited, trying alternative...
🔄 Trying alternative API with prompt: ...
```

**Rozwiązanie**: Poczekaj minutę i spróbuj ponownie

#### ❌ API Key Invalid
```
❌ AI image generation failed for openai: Brak klucza API dla OpenAI
```

**Rozwiązanie**: Sprawdź klucz API w ustawieniach

#### ❌ Network Error
```
💥 Error in AI image generation: fetch failed
```

**Rozwiązanie**: Sprawdź połączenie internetowe

## 📊 Test Cases

### Test Case 1: Basic Functionality
- **Input**: "Historia o kocie"
- **Expected**: Scenariusz + elementy wizualne
- **Status**: ✅ Demo mode

### Test Case 2: AI Images with Gemini
- **Input**: "Jak działa silnik spalinowy"
- **Expected**: Scenariusz + obrazy AI z Hugging Face
- **Status**: ✅ Gemini + Hugging Face

### Test Case 3: AI Images with OpenAI
- **Input**: "Historia o robotach"
- **Expected**: Scenariusz + obrazy AI z DALL-E
- **Status**: ✅ OpenAI DALL-E

### Test Case 4: Fallback System
- **Input**: "Historia o podróży"
- **Expected**: Scenariusz + fallback na enhanced elements
- **Status**: ✅ Fallback system

## 🚀 Performance Testing

### Memory Management
1. Wygeneruj kilka animacji
2. Sprawdź czy blob URLs są czyszczone
3. Monitoruj użycie pamięci w DevTools

### API Response Times
- **Hugging Face**: ~5-15 sekund
- **DALL-E**: ~3-8 sekund
- **Fallback**: ~1-2 sekundy

## 🐛 Bug Reporting

### Gdy coś nie działa:
1. **Zapisz console logs** (skopiuj z DevTools)
2. **Zapisz Network requests** (screenshot z Network tab)
3. **Opisz kroki** które prowadzą do błędu
4. **Dodaj informacje** o przeglądarce i systemie
5. **Utwórz Issue** na GitHub z tagiem `bug`

### Przykład bug report:
```
**Bug**: AI images not loading
**Steps**: 
1. Select Gemini provider
2. Enable auto-images
3. Generate story about "startup"
**Expected**: AI images appear on canvas
**Actual**: No images, console shows errors
**Console Logs**: [paste logs here]
**Browser**: Chrome 120.0.6099.109
**OS**: Windows 11
```

## 🎯 Success Criteria

Aplikacja działa poprawnie gdy:
- ✅ Scenariusze są generowane bez hashtagów
- ✅ Obrazy AI są ładowane na canvas
- ✅ Fallback system działa automatycznie
- ✅ Memory management czyszczenie blob URLs
- ✅ Console logs są czytelne i informacyjne
- ✅ Network requests są udane
- ✅ UI jest responsywny i stabilny

---

**Happy Testing! 🧪✨**