# 🤖 Przewodnik po API - SketchStory AI

## 🎯 Które API wybrać?

### 🏆 **ZALECANE: Google Gemini** (DARMOWY!)
- ✅ **Bezpłatny** do 60 requestów/minutę
- ✅ **Wysoka jakość** generowania tekstu
- ✅ **Łatwa konfiguracja**
- ✅ **Nie wymaga karty kredytowej**

### 🤖 **OpenAI GPT** (Płatny)
- ✅ **Najwyższa jakość** AI
- ❌ **Wymaga płatności** (~$0.002/1k tokenów)
- ✅ **Stabilne i sprawdzone**

### 🚀 **Grok (X.AI)** (Płatny)
- ✅ **Najnowsza technologia**
- ❌ **Droższy** niż OpenAI
- ⚠️ **Beta** - może być niestabilny

### 🎭 **Demo Mode** (Darmowy)
- ✅ **Działa od razu** bez konfiguracji
- ❌ **Ograniczone** scenariusze
- ✅ **Idealne do testów**

---

## 🔧 Konfiguracja krok po kroku

### 🎉 Google Gemini (DARMOWY!) - ZALECANE

#### Krok 1: Uzyskaj klucz API
1. Idź na [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Zaloguj się kontem Google
3. Kliknij **"Create API Key"**
4. Wybierz projekt (lub utwórz nowy)
5. Skopiuj klucz (zaczyna się od `AIza...`)

**⚠️ WAŻNE:** Nowy klucz może potrzebować do 5 minut aktywacji!

#### Krok 2: Konfiguracja w aplikacji
1. Otwórz **SketchStory AI**
2. Przejdź do zakładki **"Ustawienia"**
3. Wybierz **"Google Gemini"** z listy
4. Wklej klucz API
5. Kliknij **"Zapisz Ustawienia"**
6. Status powinien pokazać: **"Google Gemini - Połączono ✓"**

#### Limity (DARMOWE):
- **60 requestów/minutę**
- **1500 requestów/dzień**
- **1 milion tokenów/miesiąc**

*To więcej niż wystarczy do codziennego użytku!*

---

### 🤖 OpenAI GPT

#### Krok 1: Uzyskaj klucz API
1. Idź na [OpenAI Platform](https://platform.openai.com/api-keys)
2. Zaloguj się lub załóż konto
3. Dodaj kartę kredytową (wymagane)
4. Kliknij **"Create new secret key"**
5. Skopiuj klucz (zaczyna się od `sk-...`)

#### Krok 2: Konfiguracja w aplikacji
1. Wybierz **"OpenAI GPT"** w ustawieniach
2. Wklej klucz API
3. Zapisz ustawienia

#### Koszty:
- **GPT-3.5-turbo**: ~$0.002/1k tokenów
- **Średni koszt na animację**: ~$0.01-0.05

---

### 🚀 Grok (X.AI)

#### Krok 1: Uzyskaj klucz API
1. Idź na [X.AI Console](https://console.x.ai/)
2. Zaloguj się kontem X (Twitter)
3. Utwórz klucz API
4. Skopiuj klucz (zaczyna się od `xai-...`)

#### Krok 2: Konfiguracja
1. Wybierz **"Grok (X.AI)"** w ustawieniach
2. Wklej klucz API
3. Zapisz ustawienia

#### Uwagi:
- **Beta version** - może być niestabilny
- **Droższy** niż OpenAI
- **Wymaga konta X Premium** (w niektórych regionach)

---

## 🛠️ Rozwiązywanie problemów

### ❌ "API error: 401 Unauthorized"
**Przyczyna:** Nieprawidłowy klucz API  
**Rozwiązanie:**
1. Sprawdź czy klucz jest prawidłowo skopiowany
2. Upewnij się, że klucz nie wygasł
3. Sprawdź czy masz środki na koncie (OpenAI/Grok)

### ❌ "API error: 429 Too Many Requests"
**Przyczyna:** Przekroczono limit requestów  
**Rozwiązanie:**
1. **Gemini:** Poczekaj minutę (60 req/min limit)
2. **OpenAI:** Zwiększ limit w billing settings
3. **Grok:** Sprawdź limity w konsoli

### ❌ "CORS error"
**Przyczyna:** Problem z bezpieczeństwem przeglądarki  
**Rozwiązanie:**
1. Upewnij się, że używasz HTTPS (GitHub Pages ✓)
2. Sprawdź czy klucz API jest dla właściwego środowiska

### ❌ "Network error"
**Przyczyna:** Problem z internetem lub blokada  
**Rozwiązanie:**
1. Sprawdź połączenie internetowe
2. Wyłącz blokady reklam na czas testu
3. Spróbuj z innej sieci

---

## 📊 Porównanie funkcjonalności

| Funkcja | Demo | Gemini | OpenAI | Grok |
|---------|------|--------|--------|------|
| **Koszt** | ✅ Darmowy | ✅ Darmowy | ❌ Płatny | ❌ Płatny |
| **Jakość AI** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Kreatywność** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Stabilność** | ✅ | ✅ | ✅ | ⚠️ Beta |
| **Setup** | ✅ Brak | ✅ Łatwy | ⚠️ Karta | ⚠️ Premium |

---

## 🎯 Zalecenia

### 👤 **Użytkownik casualowy:**
**→ Google Gemini** (darmowy, wystarczająca jakość)

### 🏢 **Użytkownik biznesowy:**
**→ OpenAI GPT** (najwyższa jakość, przewidywalne koszty)

### 🧪 **Eksperymentator:**
**→ Grok** (najnowsze tech, unikalne podejście)

### 🆓 **Bez budżetu:**
**→ Demo Mode** → potem **Gemini**

---

## 🔐 Bezpieczeństwo

### ✅ **Co robimy dobrze:**
- Klucze przechowywane **lokalnie** w przeglądarce
- **Nie wysyłamy** kluczy na nasze serwery
- **HTTPS** dla wszystkich połączeń API
- **Nie logujemy** treści animacji

### ⚠️ **Co powinieneś wiedzieć:**
- Nie udostępniaj kluczy API nikomu
- Używaj tylko na zaufanych urządzeniach
- Regularnie rotuj klucze API
- Monitoruj zużycie w dashboardach

---

## 📞 Pomoc techniczna

### 🐛 **Problemy z API:**
1. Sprawdź [Status AI Platform](https://status.openai.com/)
2. Zgłoś issue na [GitHub](https://github.com/yourusername/sketchstory-ai/issues)
3. Sprawdź konsole przeglądarki (F12)

### 💡 **Sugestie:**
- Zacznij od **Gemini** (darmowy!)
- Testuj z **Demo Mode** przed konfiguracją
- Monitoruj koszty w dashboardach
- Używaj krótszych promptów = niższe koszty

---

**Happy storytelling!** 🎨✨