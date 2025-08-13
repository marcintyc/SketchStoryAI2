# SketchStory AI 🎨✨

**Spersonalizowane animacje whiteboard z funkcją storytelling**

Platforma AI, która tworzy animacje whiteboard i automatycznie generuje wciągające historie na podstawie prostych danych wejściowych (tekst, obrazy, pomysł).

![SketchStory AI](https://img.shields.io/badge/Status-Ready-brightgreen) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue) ![AI Powered](https://img.shields.io/badge/AI-Powered-purple)

## 🚀 Demo na żywo

**[Wypróbuj SketchStory AI](https://yourusername.github.io/sketchstory-ai/)**

## ✨ Funkcje

### 🎯 Główne możliwości:
- **AI-Generated Stories**: Automatyczne tworzenie scenariuszy na podstawie prompta
- **Whiteboard Animations**: Płynne animacje rysowania w stylu whiteboard
- **Multiple Styles**: 5 różnych stylów wizualnych (hand-drawn, minimal, business, educational, creative)
- **Interactive Controls**: Play, pause, stop, progress tracking
- **Export Options**: Pobieranie animacji jako obrazy
- **Responsive Design**: Działa na wszystkich urządzeniach

### 🤖 Integracja AI:
- **OpenAI GPT Integration**: Generowanie historii i scenariuszy
- **Smart Visual Parsing**: Automatyczne rozpoznawanie elementów wizualnych
- **Content Optimization**: Optymalizacja przepływu narracji
- **Multi-language Support**: Wsparcie dla różnych języków

### 🎨 Style animacji:
- **Hand-drawn**: Rysowane ręcznie z naturalnym wyglądem
- **Minimal**: Czysty, minimalistyczny design
- **Business**: Profesjonalny styl korporacyjny
- **Educational**: Przyjazny dla edukacji
- **Creative**: Kreatywny i artystyczny

## 🛠️ Technologie

### Frontend:
- **HTML5 Canvas**: Dla renderowania animacji
- **Fabric.js**: Zaawansowane manipulacje canvas
- **GSAP**: Płynne animacje i przejścia
- **CSS3**: Nowoczesny design z gradientami
- **Vanilla JavaScript**: Bez zależności od frameworków

### AI & APIs:
- **OpenAI API**: Generowanie treści i scenariuszy
- **Web Speech API**: Text-to-speech (planowane)
- **Canvas API**: Eksport animacji

### Hosting:
- **GitHub Pages**: Darmowy hosting statycznych stron
- **localStorage**: Przechowywanie ustawień lokalnie
- **Progressive Web App**: Możliwość instalacji jako PWA

## 📦 Instalacja

### Opcja 1: GitHub Pages (Zalecana)
1. Fork tego repozytorium
2. Włącz GitHub Pages w Settings → Pages
3. Wybierz branch `main` jako źródło
4. Twoja aplikacja będzie dostępna pod: `https://yourusername.github.io/sketchstory-ai/`

### Opcja 2: Lokalne uruchomienie
```bash
# Sklonuj repozytorium
git clone https://github.com/yourusername/sketchstory-ai.git

# Przejdź do katalogu
cd sketchstory-ai

# Uruchom lokalny serwer (Python 3)
python -m http.server 8000

# Lub (Python 2)
python -m SimpleHTTPServer 8000

# Lub za pomocą Node.js
npx http-server

# Otwórz http://localhost:8000 w przeglądarce
```

### Opcja 3: Live Server (VS Code)
1. Zainstaluj rozszerzenie "Live Server" w VS Code
2. Otwórz folder projektu
3. Kliknij prawym na `index.html` → "Open with Live Server"

## ⚙️ Konfiguracja

### 1. Klucz OpenAI API (Opcjonalny)
Aby uzyskać pełną funkcjonalność AI:
1. Uzyskaj klucz API z [OpenAI](https://platform.openai.com/api-keys)
2. Przejdź do zakładki "Ustawienia" w aplikacji
3. Wprowadź swój klucz API
4. Klucz jest przechowywany lokalnie w przeglądarce

**Bez klucza API:** Aplikacja działa z demo scenariuszami

### 2. Ustawienia domyślne
- **Język**: Polski, Angielski, Niemiecki, Francuski
- **Jakość animacji**: Wysoka, Średnia, Niska
- **Wszystkie ustawienia** są zapisywane lokalnie

## 🎬 Jak używać

### 1. Tworzenie animacji:
1. **Wprowadź prompt**: Opisz swoją historię lub temat
2. **Wybierz styl**: Hand-drawn, Minimal, Business, Educational, Creative
3. **Ustaw długość**: 30s, 1min, 2min, 5min
4. **Wybierz narrację**: Profesjonalny, Przyjazny, Energiczny, Spokojny
5. **Kliknij "Generuj Animację"**

### 2. Kontrola animacji:
- ▶️ **Play**: Uruchom animację
- ⏸️ **Pause**: Zatrzymaj tymczasowo
- ⏹️ **Stop**: Zatrzymaj i resetuj
- 📥 **Download**: Pobierz jako obraz PNG

### 3. Przykłady promptów:
```
"Historia młodego przedsiębiorcy który zaczyna startup"
"Wyjaśnij jak działa fotosynteza w prosty sposób"
"Proces tworzenia aplikacji mobilnej krok po kroku"
"Jak zarządzać czasem efektywnie"
"Historia powstania internetu"
```

## 📁 Struktura projektu

```
sketchstory-ai/
│
├── index.html          # Główny plik HTML
├── styles.css          # Style CSS
├── script.js           # Logika JavaScript
├── README.md           # Dokumentacja
└── demo/               # Pliki demonstracyjne (opcjonalnie)
    ├── sample1.png
    └── sample2.png
```

## 🌐 Wdrożenie na GitHub Pages

### Automatyczne wdrożenie:
1. **Push do main branch** automatycznie aktualizuje stronę
2. **GitHub Actions** można skonfigurować dla CI/CD
3. **Custom domain** można ustawić w Settings

### Ręczne wdrożenie:
```bash
# Dodaj zmiany
git add .
git commit -m "Update SketchStory AI"
git push origin main

# GitHub Pages automatycznie zaktualizuje stronę
```

## 🎨 Personalizacja

### Dodawanie nowych stylów:
1. Otwórz `script.js`
2. Znajdź metodę `getStyleColor()` i `getStyleFont()`
3. Dodaj nowy styl:
```javascript
const colors = {
    'custom-style': `rgba(255, 0, 128, ${alpha})`,
    // ...existing styles
};
```

### Dostosowanie UI:
1. Edytuj `styles.css` dla zmian wizualnych
2. Modyfikuj `index.html` dla struktury
3. Aktualizuj `script.js` dla logiki

## 🔧 Rozwój

### Planowane funkcje:
- [ ] **Text-to-Speech**: Automatyczna narracja
- [ ] **Video Export**: Eksport jako MP4/WebM
- [ ] **Advanced AI**: Integracja z DALL-E dla obrazów
- [ ] **Collaboration**: Udostępnianie projektów
- [ ] **Templates**: Gotowe szablony
- [ ] **Music Integration**: Tło muzyczne
- [ ] **Voice Recording**: Własna narracja

### Techniczne ulepszenia:
- [ ] **Progressive Web App**: Pełne wsparcie PWA
- [ ] **Offline Mode**: Działanie bez internetu
- [ ] **Performance**: Optymalizacja renderowania
- [ ] **Mobile**: Lepsze wsparcie mobile
- [ ] **Accessibility**: Zgodność z WCAG

## 🤝 Wkład w rozwój

Zapraszamy do współpracy! Możesz:

1. **Zgłaszać błędy**: Użyj GitHub Issues
2. **Proponować funkcje**: GitHub Discussions
3. **Tworzyć Pull Requests**: Fork → Branch → PR
4. **Ulepszać dokumentację**: Edytuj README.md

### Jak współtworzyć:
```bash
# 1. Fork repozytorium
# 2. Utwórz branch
git checkout -b feature/new-animation-style

# 3. Wprowadź zmiany
git commit -m "Add new animation style"

# 4. Push branch
git push origin feature/new-animation-style

# 5. Utwórz Pull Request
```

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 🆘 Wsparcie

### Problemy techniczne:
- **GitHub Issues**: [Zgłoś problem](https://github.com/yourusername/sketchstory-ai/issues)
- **Dokumentacja**: Ten README
- **FAQ**: [Wiki strona](https://github.com/yourusername/sketchstory-ai/wiki)

### API Issues:
- **OpenAI API**: Sprawdź limit i billing
- **CORS**: GitHub Pages obsługuje HTTPS
- **Rate Limiting**: OpenAI ma limity requestów

## 🌟 Podziękowania

- **OpenAI**: Za API GPT
- **Fabric.js**: Za canvas manipulation
- **GSAP**: Za animacje
- **Font Awesome**: Za ikony
- **Inter Font**: Za typografię

## 📊 Statystyki

![GitHub stars](https://img.shields.io/github/stars/yourusername/sketchstory-ai)
![GitHub forks](https://img.shields.io/github/forks/yourusername/sketchstory-ai)
![GitHub issues](https://img.shields.io/github/issues/yourusername/sketchstory-ai)
![GitHub license](https://img.shields.io/github/license/yourusername/sketchstory-ai)

---

**Stworzone z ❤️ dla społeczności twórców i edukatorów**

*SketchStory AI - gdzie technologia spotyka się z kreatywnością* 🎨🤖