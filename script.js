// SketchStory AI - Main Application Logic
class SketchStoryAI {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fabricCanvas = null;
        this.currentAnimation = null;
        this.animationSteps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadSettings();
        this.initAnimationEngine();
    }

    setupCanvas() {
        this.canvas = document.getElementById('whiteboard-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize Fabric.js canvas for advanced drawing capabilities
        this.fabricCanvas = new fabric.Canvas('whiteboard-canvas', {
            backgroundColor: '#ffffff',
            selection: false
        });
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        const rect = container.getBoundingClientRect();
        
        this.fabricCanvas.setDimensions({
            width: rect.width - 4,
            height: Math.min(rect.height - 4, 400)
        });
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Generate story button
        document.getElementById('generate-story').addEventListener('click', () => this.generateStory());

        // Media controls
        document.getElementById('play-btn').addEventListener('click', () => this.playAnimation());
        document.getElementById('pause-btn').addEventListener('click', () => this.pauseAnimation());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopAnimation());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadAnimation());

        // Settings
        document.querySelector('.save-settings-btn').addEventListener('click', () => this.saveSettings());
        
        // AI Provider change
        document.getElementById('ai-provider').addEventListener('change', (e) => this.onProviderChange(e.target.value));
        
        // Test API button
        document.getElementById('test-api-btn').addEventListener('click', () => this.testAPIConnection());
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async generateStory() {
        const prompt = document.getElementById('story-prompt').value;
        const style = document.getElementById('story-style').value;
        const duration = parseInt(document.getElementById('story-duration').value);
        const voiceStyle = document.getElementById('voice-style').value;
        
        const autoImages = document.getElementById('auto-images').checked;
        const autoScript = document.getElementById('auto-script').checked;
        const optimizeFlow = document.getElementById('optimize-flow').checked;

        if (!prompt.trim()) {
            alert('Proszę wprowadź temat lub pomysł na historię');
            return;
        }

        this.showLoadingOverlay();
        
        try {
            // Step 1: Generate story script using AI
            this.updateLoadingStatus('Generuję scenariusz...');
            const script = await this.generateScript(prompt, duration, voiceStyle);
            
            // Step 2: Break down script into animation steps
            this.updateLoadingStatus('Analizuję strukturę historii...');
            const animationSteps = await this.createAnimationSteps(script, style, duration);
            
            // Step 3: Generate visual elements
            if (autoImages) {
                this.updateLoadingStatus('Generuję elementy wizualne...');
                await this.generateVisualElements(animationSteps);
            }
            
            // Step 4: Create animation timeline
            this.updateLoadingStatus('Tworzę animację...');
            this.animationSteps = animationSteps;
            this.createAnimationTimeline();
            
            // Step 5: Update UI
            this.updateScriptPanel(script);
            this.hideCanvasOverlay();
            
            this.hideLoadingOverlay();
            
            // Auto-play the animation
            setTimeout(() => this.playAnimation(), 500);
            
        } catch (error) {
            console.error('Error generating story:', error);
            
            let errorMessage = 'Wystąpił błąd podczas generowania animacji.';
            
            if (error.message.includes('overloaded') || error.message.includes('503')) {
                errorMessage = '🤖 Gemini API jest przeciążone. Spróbuj ponownie za chwilę lub przełącz na Demo mode.';
            } else if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
                errorMessage = '⏰ Przekroczono limit requestów. Poczekaj minutę i spróbuj ponownie.';
            } else if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
                errorMessage = '🔑 Nieprawidłowy klucz API. Sprawdź klucz w ustawieniach.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = '🌐 Problem z połączeniem internetowym. Sprawdź internet i spróbuj ponownie.';
            }
            
            alert(errorMessage);
            this.hideLoadingOverlay();
        }
    }

    async generateScript(prompt, duration, voiceStyle) {
        const provider = localStorage.getItem('ai-provider') || 'demo';
        
        switch (provider) {
            case 'openai':
                return await this.generateWithOpenAI(prompt, duration, voiceStyle);
            case 'gemini':
                return await this.generateWithGemini(prompt, duration, voiceStyle);
            case 'grok':
                return await this.generateWithGrok(prompt, duration, voiceStyle);
            default:
                return this.getDemoScript(prompt);
        }
    }

    async generateWithOpenAI(prompt, duration, voiceStyle) {
        const apiKey = localStorage.getItem('openai-api-key');
        if (!apiKey) {
            throw new Error('Brak klucza API dla OpenAI');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: `Jesteś ekspertem od tworzenia scenariuszy do animacji whiteboard. Twórz angażujące, wciągające historie dostosowane do stylu narracji: ${voiceStyle}. Scenariusz powinien trwać około ${duration} sekund. Podziel treść na logiczne sekcje z opisami wizualnymi.`
                }, {
                    role: 'user',
                    content: `Stwórz scenariusz animacji whiteboard dla tematu: "${prompt}". Uwzględnij opisy elementów wizualnych, które mają być narysowane w każdej scenie.`
                }],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API error: ' + response.statusText);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async generateWithGemini(prompt, duration, voiceStyle, retryCount = 0) {
        const apiKey = localStorage.getItem('gemini-api-key');
        if (!apiKey) {
            throw new Error('Brak klucza API dla Gemini');
        }

        const systemPrompt = `Jesteś ekspertem od tworzenia scenariuszy do animacji whiteboard. Twórz angażujące, wciągające historie dostosowane do stylu narracji: ${voiceStyle}. Scenariusz powinien trwać około ${duration} sekund. Podziel treść na logiczne sekcje z opisami wizualnymi.`;
        
        const userPrompt = `${systemPrompt}\n\nStwórz scenariusz animacji whiteboard dla tematu: "${prompt}". Uwzględnij opisy elementów wizualnych, które mają być narysowane w każdej scenie.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: userPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1500,
                        topK: 40,
                        topP: 0.95,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API Error:', response.status, response.statusText, errorData);
                
                // Handle overload with retry or fallback
                if (response.status === 503 && retryCount < 2) {
                    console.log(`Gemini overloaded, retrying in ${(retryCount + 1) * 2} seconds...`);
                    await this.delay((retryCount + 1) * 2000);
                    return await this.generateWithGemini(prompt, duration, voiceStyle, retryCount + 1);
                }
                
                // If still overloaded after retries, fallback to demo
                if (response.status === 503) {
                    console.log('Gemini still overloaded, falling back to demo mode...');
                    this.updateLoadingStatus('Gemini przeciążone - używam demo scenariusza...');
                    return this.getDemoScript(prompt);
                }
                
                throw new Error(`Gemini API error (${response.status}): ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error('Unexpected Gemini response:', data);
                throw new Error('Gemini zwróciło nieprawidłową odpowiedź');
            }

            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.error('Gemini generation error:', error);
            
            if (error.message.includes('API_KEY_INVALID')) {
                throw new Error('Nieprawidłowy klucz API dla Gemini. Sprawdź klucz w ustawieniach.');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                throw new Error('Przekroczono limit requestów dla Gemini. Spróbuj ponownie za chwilę.');
            } else if (error.message.includes('overloaded') || error.message.includes('503')) {
                // Network error or overload - fallback to demo
                console.log('Network/overload error, falling back to demo...');
                this.updateLoadingStatus('Problem z połączeniem - używam demo scenariusza...');
                return this.getDemoScript(prompt);
            } else {
                throw error;
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async generateWithGrok(prompt, duration, voiceStyle) {
        const apiKey = localStorage.getItem('grok-api-key');
        if (!apiKey) {
            throw new Error('Brak klucza API dla Grok');
        }

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [{
                    role: 'system',
                    content: `Jesteś ekspertem od tworzenia scenariuszy do animacji whiteboard. Twórz angażujące, wciągające historie dostosowane do stylu narracji: ${voiceStyle}. Scenariusz powinien trwać około ${duration} sekund. Podziel treść na logiczne sekcje z opisami wizualnymi.`
                }, {
                    role: 'user',
                    content: `Stwórz scenariusz animacji whiteboard dla tematu: "${prompt}". Uwzględnij opisy elementów wizualnych, które mają być narysowane w każdej scenie.`
                }],
                model: 'grok-beta',
                stream: false,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Grok API error: ' + response.statusText);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    getDemoScript(prompt) {
        // Smart demo script based on prompt keywords
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('startup') || promptLower.includes('biznes') || promptLower.includes('firma')) {
            return this.getBusinessDemoScript(prompt);
        } else if (promptLower.includes('edukacj') || promptLower.includes('nauka') || promptLower.includes('jak działa')) {
            return this.getEducationalDemoScript(prompt);
        } else if (promptLower.includes('marketing') || promptLower.includes('sprzedaż') || promptLower.includes('klient')) {
            return this.getMarketingDemoScript(prompt);
        } else if (promptLower.includes('technolog') || promptLower.includes('app') || promptLower.includes('kod')) {
            return this.getTechDemoScript(prompt);
        } else {
            return this.getGenericDemoScript(prompt);
        }
    }
    
    getBusinessDemoScript(prompt) {
        return `🚀 ${prompt}

Wprowadzenie
- Narysuj ikonę żarówki reprezentującą pomysł
- Dodaj tekst "Wielka idea zaczyna się tutaj"
- Stwórz strzałkę wskazującą rozwój

Planowanie
- Narysuj diagram z kluczowymi krokami
- Dodaj ikony: zespół, finanse, produkt
- Połącz elementy liniami pokazującymi proces

Realizacja  
- Stwórz wykres wzrostu
- Dodaj tekst "Od pomysłu do sukcesu"
- Narysuj rakietę symbolizującą start

Sukces
- Narysuj gwiazdkę jako symbol osiągnięcia
- Dodaj wezwanie do działania
- Zakończ inspirującym hasłem

💡 To demo scenariusz. Dla lepszych rezultatów użyj Gemini API!`;
    }
    
    getEducationalDemoScript(prompt) {
        return `📚 ${prompt}

Definicja
- Narysuj tytuł tematu w ramce
- Dodaj ikonę książki lub żarówki
- Stwórz podkreślenie dla ważnych pojęć

Wyjaśnienie
- Narysuj diagram krok po kroku  
- Dodaj strzałki pokazujące kolejność
- Użyj prostych kształtów i ikon

Przykłady
- Stwórz ilustracje konkretnych przypadków
- Dodaj symbole ✓ dla ważnych punktów
- Połącz teoria z praktyką

Podsumowanie
- Narysuj podsumowujący diagram
- Dodaj kluczowe wnioski
- Zakończ znakiem zapytania dla refleksji

🎓 Demo tryb - upgrade do Gemini dla pełnej mocy AI!`;
    }
    
    getMarketingDemoScript(prompt) {
        return `📈 ${prompt}

Analiza
- Narysuj wykres przedstawiający sytuację
- Dodaj ikony reprezentujące targetowanie
- Stwórz strzałki pokazujące trendy

Strategia
- Narysuj diagram z kanałami marketingu
- Dodaj symbole: social media, email, content
- Połącz elementy w spójną strategię

Implementacja
- Stwórz timeline z krokami działań
- Dodaj checklistę najważniejszych zadań
- Narysuj narzędzia i platformy

Rezultaty
- Narysuj wykres ROI i konwersji
- Dodaj ikony sukcesu i wzrostu
- Zakończ call-to-action

🎯 To tylko demo! Gemini stworzy znacznie lepsze scenariusze!`;
    }
    
    getTechDemoScript(prompt) {
        return `💻 ${prompt}

Architektura
- Narysuj schemat systemu lub aplikacji
- Dodaj prostokąty reprezentujące komponenty
- Połącz elementy strzałkami danych

Funkcjonalności
- Stwórz listę głównych features
- Dodaj ikony dla różnych funkcji
- Narysuj flow użytkownika

Technologie
- Narysuj stack technologiczny
- Dodaj logo/ikony technologii
- Pokaż integracje między systemami

Wdrożenie
- Stwórz timeline projektu
- Dodaj milestones i checkpointy
- Zakończ wizją finalnego produktu

⚡ Demo mode aktywny. Gemini da ci prawdziwe AI power!`;
    }
    
    getGenericDemoScript(prompt) {
        return `✨ ${prompt}

Wprowadzenie
- Narysuj tytuł "${prompt}" w centrum
- Dodaj dekoracyjną ramkę wokół
- Stwórz strzałkę wprowadzającą w temat

Rozwój tematu
- Narysuj diagram z głównymi punktami
- Dodaj ikony dla każdego elementu
- Połącz wszystko logicznym flow

Szczegóły
- Stwórz ilustracje supporting points
- Dodaj symbole i annotations
- Pokaż relacje między elementami

Zakończenie
- Narysuj podsumowujący element
- Dodaj call-to-action lub wniosek
- Zakończ inspirującym akcentem

🎨 To podstawowy demo. Gemini API = nieograniczona kreatywność!`;
    }

    async createAnimationSteps(script, style, duration) {
        // Parse script and create animation steps
        const sections = script.split('\n\n').filter(section => section.trim());
        const maxSteps = Math.min(10, sections.length); // Limit total steps
        
        const steps = [];
        let currentTime = 0;
        const stepDuration = duration / maxSteps;

        sections.slice(0, maxSteps).forEach((section, sectionIndex) => {
            const lines = section.split('\n').filter(line => line.trim());
            const mainLine = lines.find(line => line.includes('-') || line.length > 10) || lines[0] || section;
            
            steps.push({
                time: currentTime,
                duration: stepDuration,
                type: 'draw',
                content: this.cleanContent(mainLine),
                section: sectionIndex,
                style: style,
                elements: this.generateDrawingElements(mainLine, style, sectionIndex)
            });
            currentTime += stepDuration;
        });

        console.log('Created animation steps:', steps.length);
        return steps;
    }
    
    cleanContent(content) {
        return content
            .replace(/^[-•]\s*/, '') // Remove bullet points
            .replace(/^\d+\.?\s*/, '') // Remove numbers
            .replace(/Scena \d+:?\s*/i, '') // Remove "Scena X:"
            .trim()
            .substring(0, 100); // Limit length
    }

    generateDrawingElements(content, style, stepIndex = 0) {
        const elements = [];
        const contentLower = content.toLowerCase();
        
        // Position elements based on step to avoid overlap
        const baseX = 50 + (stepIndex % 3) * 250;
        const baseY = 50 + Math.floor(stepIndex / 3) * 150;
        
        // Simple keyword-based element generation
        const keywords = {
            'tytuł': () => this.createTextElement(content, 'title', style, baseX, baseY),
            'tekst': () => this.createTextElement(content, 'text', style, baseX, baseY),
            'strzałka': () => this.createArrowElement(style, baseX, baseY),
            'ramka': () => this.createBoxElement(style, baseX, baseY),
            'diagram': () => this.createDiagramElement(style, baseX, baseY),
            'ikona': () => this.createIconElement(style, baseX, baseY),
            'linia': () => this.createLineElement(style, baseX, baseY),
            'wykres': () => this.createChartElement(style, baseX, baseY),
            'circle': () => this.createDiagramElement(style, baseX, baseY),
            'box': () => this.createBoxElement(style, baseX, baseY),
            'arrow': () => this.createArrowElement(style, baseX, baseY)
        };

        let foundElements = 0;
        Object.keys(keywords).forEach(keyword => {
            if (contentLower.includes(keyword) && foundElements < 2) {
                elements.push(keywords[keyword]());
                foundElements++;
            }
        });

        // Always add main text element
        if (elements.length === 0 || !elements.some(el => el.type === 'text')) {
            elements.push(this.createTextElement(content, 'text', style, baseX, baseY + 30));
        }

        // Add visual element based on content context
        if (contentLower.includes('wprowadz') || contentLower.includes('start')) {
            elements.push(this.createArrowElement(style, baseX + 150, baseY));
        } else if (contentLower.includes('główn') || contentLower.includes('treść')) {
            elements.push(this.createBoxElement(style, baseX + 150, baseY));
        } else if (contentLower.includes('podsumow') || contentLower.includes('zakończ')) {
            elements.push(this.createDiagramElement(style, baseX + 150, baseY));
        }

        return elements.slice(0, 3); // Limit to 3 elements max
    }

    createTextElement(text, type, style, x = null, y = null) {
        const fontSize = type === 'title' ? 20 : 14;
        const color = this.getStyleColor(style);
        
        return {
            type: 'text',
            content: text.substring(0, 60), // Limit text length
            fontSize: fontSize,
            color: color,
            x: x || (Math.random() * 200 + 50),
            y: y || (Math.random() * 150 + 50),
            fontFamily: this.getStyleFont(style)
        };
    }

    createArrowElement(style, x = null, y = null) {
        const startX = x || 100;
        const startY = y || 100;
        return {
            type: 'arrow',
            x1: startX,
            y1: startY,
            x2: startX + 80,
            y2: startY + 40,
            color: this.getStyleColor(style),
            strokeWidth: 3
        };
    }

    createBoxElement(style, x = null, y = null) {
        return {
            type: 'rectangle',
            x: x || 100,
            y: y || 100,
            width: 120,
            height: 80,
            stroke: this.getStyleColor(style),
            fill: 'transparent',
            strokeWidth: 2
        };
    }

    createLineElement(style, x = null, y = null) {
        const startX = x || 100;
        const startY = y || 100;
        return {
            type: 'line',
            x1: startX,
            y1: startY,
            x2: startX + 100,
            y2: startY,
            stroke: this.getStyleColor(style),
            strokeWidth: 2
        };
    }

    createDiagramElement(style, x = null, y = null) {
        return {
            type: 'circle',
            x: x || 150,
            y: y || 150,
            radius: 40,
            stroke: this.getStyleColor(style),
            fill: 'transparent',
            strokeWidth: 2
        };
    }

    createIconElement(style, x = null, y = null) {
        const icons = ['★', '♦', '●', '▲', '■'];
        return {
            type: 'text',
            content: icons[Math.floor(Math.random() * icons.length)],
            fontSize: 24,
            color: this.getStyleColor(style),
            x: x || 100,
            y: y || 100,
            fontFamily: 'Arial'
        };
    }

    createChartElement(style, x = null, y = null) {
        return {
            type: 'rectangle',
            x: x || 100,
            y: y || 100,
            width: 100,
            height: 60,
            stroke: this.getStyleColor(style),
            fill: this.getStyleColor(style, 0.2),
            strokeWidth: 2
        };
    }

    getStyleColor(style, alpha = 1) {
        const colors = {
            'hand-drawn': `rgba(34, 34, 34, ${alpha})`,
            'minimal': `rgba(102, 126, 234, ${alpha})`,
            'business': `rgba(59, 130, 246, ${alpha})`,
            'educational': `rgba(16, 185, 129, ${alpha})`,
            'creative': `rgba(245, 101, 101, ${alpha})`
        };
        return colors[style] || colors['minimal'];
    }

    getStyleFont(style) {
        const fonts = {
            'hand-drawn': 'Comic Sans MS, cursive',
            'minimal': 'Inter, sans-serif',
            'business': 'Arial, sans-serif',
            'educational': 'Georgia, serif',
            'creative': 'Trebuchet MS, sans-serif'
        };
        return fonts[style] || fonts['minimal'];
    }

    async generateVisualElements(steps) {
        try {
            // Generate AI images for each step if possible
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                
                // Try to generate an image based on the step content
                if (step.content && step.content.length > 10) {
                    try {
                        // For now, we'll create enhanced visual elements
                        // In the future, this could integrate with DALL-E, Midjourney, or Stable Diffusion
                        step.elements = this.generateEnhancedDrawingElements(step.content, step.style, i);
                        
                        // Add a small delay to avoid overwhelming the system
                        await this.delay(100);
                    } catch (error) {
                        console.warn(`Could not generate visual elements for step ${i}:`, error);
                        // Fallback to basic elements
                        step.elements = this.generateDrawingElements(step.content, step.style, i);
                    }
                }
            }
            
            return steps;
        } catch (error) {
            console.error('Error generating visual elements:', error);
            // Return steps with basic elements if AI generation fails
            return steps.map((step, i) => ({
                ...step,
                elements: this.generateDrawingElements(step.content, step.style, i)
            }));
        }
    }

    generateEnhancedDrawingElements(content, style, stepIndex = 0) {
        const elements = [];
        const contentLower = content.toLowerCase();
        
        // Position elements based on step to avoid overlap
        const baseX = 50 + (stepIndex % 3) * 250;
        const baseY = 50 + Math.floor(stepIndex / 3) * 150;
        
        // Enhanced keyword-based element generation
        const keywords = {
            'tytuł': () => this.createTextElement(content, 'title', style, baseX, baseY),
            'tekst': () => this.createTextElement(content, 'text', style, baseX, baseY),
            'strzałka': () => this.createArrowElement(style, baseX, baseY),
            'ramka': () => this.createBoxElement(style, baseX, baseY),
            'diagram': () => this.createDiagramElement(style, baseX, baseY),
            'ikona': () => this.createIconElement(style, baseX, baseY),
            'linia': () => this.createLineElement(style, baseX, baseY),
            'wykres': () => this.createChartElement(style, baseX, baseY),
            'circle': () => this.createCircleElement(style, baseX, baseY),
            'box': () => this.createBoxElement(style, baseX, baseY),
            'arrow': () => this.createArrowElement(style, baseX, baseY),
            'startup': () => this.createStartupElements(style, baseX, baseY),
            'biznes': () => this.createBusinessElements(style, baseX, baseY),
            'edukacj': () => this.createEducationalElements(style, baseX, baseY),
            'technolog': () => this.createTechElements(style, baseX, baseY)
        };

        let foundElements = 0;
        Object.keys(keywords).forEach(keyword => {
            if (contentLower.includes(keyword) && foundElements < 3) {
                const element = keywords[keyword]();
                if (element) {
                    elements.push(element);
                    foundElements++;
                }
            }
        });

        // Always add main text element if we don't have enough elements
        if (elements.length < 2) {
            elements.push(this.createTextElement(content, 'text', style, baseX, baseY + 30));
        }

        // Add contextual visual elements
        if (contentLower.includes('wprowadz') || contentLower.includes('start')) {
            elements.push(this.createArrowElement(style, baseX + 150, baseY));
        } else if (contentLower.includes('główn') || contentLower.includes('treść')) {
            elements.push(this.createBoxElement(style, baseX + 150, baseY));
        } else if (contentLower.includes('podsumow') || contentLower.includes('zakończ')) {
            elements.push(this.createDiagramElement(style, baseX + 150, baseY));
        }

        return elements.slice(0, 4); // Allow up to 4 elements
    }

    createAnimationTimeline() {
        this.currentStep = 0;
        this.progress = 0;
        this.updateProgressBar();
    }

    initAnimationEngine() {
        this.animationLoop = null;
    }

    playAnimation() {
        if (this.animationSteps.length === 0) {
            alert('Najpierw wygeneruj animację');
            return;
        }

        this.isPlaying = true;
        this.isPaused = false;
        this.startAnimationLoop();
        
        // Update play button
        document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
    }

    pauseAnimation() {
        this.isPaused = true;
        this.isPlaying = false;
        if (this.animationLoop) {
            clearInterval(this.animationLoop);
        }
    }

    stopAnimation() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.progress = 0;
        this.currentTime = 0;
        this.executedSteps = new Set();
        
        if (this.animationLoop) {
            clearInterval(this.animationLoop);
            this.animationLoop = null;
        }
        
        this.fabricCanvas.clear();
        this.fabricCanvas.backgroundColor = '#ffffff';
        this.fabricCanvas.renderAll();
        this.updateProgressBar();
    }

    startAnimationLoop() {
        const totalDuration = this.animationSteps.reduce((sum, step) => sum + step.duration, 0);
        const stepInterval = 500; // Slower for better control
        
        this.currentTime = 0;
        this.executedSteps = new Set(); // Track executed steps
        
        this.animationLoop = setInterval(() => {
            if (!this.isPlaying || this.isPaused) {
                clearInterval(this.animationLoop);
                return;
            }

            this.currentTime += stepInterval / 1000; // Convert to seconds
            this.progress = (this.currentTime / totalDuration) * 100;
            this.updateProgressBar();

            // Find current animation step
            const activeStepIndex = this.animationSteps.findIndex(step => 
                this.currentTime >= step.time && this.currentTime < step.time + step.duration
            );

            // Execute step only once
            if (activeStepIndex !== -1 && !this.executedSteps.has(activeStepIndex)) {
                this.executedSteps.add(activeStepIndex);
                this.executeAnimationStep(this.animationSteps[activeStepIndex]);
            }

            // Check if animation is complete
            if (this.currentTime >= totalDuration) {
                this.stopAnimation();
            }
        }, stepInterval);
    }

    executeAnimationStep(step) {
        console.log('Executing step:', step.content);
        console.log('Step elements:', step.elements);
        
        // Clear previous elements occasionally to avoid clutter
        if (this.fabricCanvas.getObjects().length > 10) {
            this.fabricCanvas.clear();
            this.fabricCanvas.backgroundColor = '#ffffff';
        }
        
        if (step.elements && step.elements.length > 0) {
            step.elements.forEach((element, index) => {
                console.log(`Drawing element ${index}:`, element);
                setTimeout(() => {
                    this.drawElement(element);
                }, index * 300); // Slower staggering
            });
        } else {
            console.warn('No elements to draw for step:', step);
        }
    }

    drawElement(element) {
        console.log('Drawing element:', element);
        let fabricObject;

        try {
            switch (element.type) {
            case 'text':
                fabricObject = new fabric.Text(element.content, {
                    left: element.x,
                    top: element.y,
                    fontSize: element.fontSize,
                    fill: element.color,
                    fontFamily: element.fontFamily,
                    selectable: false
                });
                break;

            case 'rectangle':
                fabricObject = new fabric.Rect({
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    stroke: element.stroke,
                    fill: element.fill,
                    strokeWidth: element.strokeWidth,
                    selectable: false
                });
                break;

            case 'circle':
                fabricObject = new fabric.Circle({
                    left: element.x,
                    top: element.y,
                    radius: element.radius,
                    stroke: element.stroke,
                    fill: element.fill,
                    strokeWidth: element.strokeWidth,
                    selectable: false
                });
                break;

            case 'line':
                fabricObject = new fabric.Line([element.x1, element.y1, element.x2, element.y2], {
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth,
                    selectable: false
                });
                break;

            case 'arrow':
                // Create arrow using path
                const arrowPath = this.createArrowPath(element.x1, element.y1, element.x2, element.y2);
                fabricObject = new fabric.Path(arrowPath, {
                    fill: element.color,
                    selectable: false
                });
                break;

            default:
                console.warn('Unknown element type:', element.type);
                return;
        }

        if (fabricObject) {
            console.log('Created fabric object:', fabricObject);
            // Add drawing animation effect
            fabricObject.opacity = 0;
            fabricObject.selectable = false;
            fabricObject.evented = false;
            
            this.fabricCanvas.add(fabricObject);
            console.log('Added to canvas, total objects:', this.fabricCanvas.getObjects().length);
            
            // Animate appearance with scaling effect
            fabricObject.set({
                scaleX: 0.1,
                scaleY: 0.1
            });
            
            fabricObject.animate('opacity', 1, {
                duration: 600,
                easing: fabric.util.ease.easeOutBack
            });
            
            fabricObject.animate('scaleX', 1, {
                duration: 600,
                easing: fabric.util.ease.easeOutBack
            });
            
            fabricObject.animate('scaleY', 1, {
                duration: 600,
                easing: fabric.util.ease.easeOutBack
            });
            
            this.fabricCanvas.renderAll();
        }
        } catch (error) {
            console.error('Error drawing element:', error, element);
        }
    }

    createArrowPath(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;

        const arrowX1 = x2 - arrowLength * Math.cos(angle - arrowAngle);
        const arrowY1 = y2 - arrowLength * Math.sin(angle - arrowAngle);
        const arrowX2 = x2 - arrowLength * Math.cos(angle + arrowAngle);
        const arrowY2 = y2 - arrowLength * Math.sin(angle + arrowAngle);

        return `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${arrowX1} ${arrowY1} M ${x2} ${y2} L ${arrowX2} ${arrowY2}`;
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${this.progress}%`;
    }

    updateScriptPanel(script) {
        const scriptContent = document.getElementById('script-content');
        
        // Clean up the script content - remove hashtags and format properly
        let cleanScript = script
            .replace(/#[^\s]+/g, '') // Remove hashtags
            .replace(/\n\n+/g, '\n') // Remove multiple empty lines
            .replace(/^\s+|\s+$/g, '') // Trim whitespace
            .replace(/^[-•]\s*/gm, '') // Remove bullet points at start of lines
            .replace(/^\d+\.?\s*/gm, ''); // Remove numbers at start of lines
        
        // Split into paragraphs and create HTML
        const paragraphs = cleanScript.split('\n').filter(p => p.trim().length > 0);
        const htmlContent = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
        
        scriptContent.innerHTML = htmlContent || '<p>Scenariusz został wygenerowany.</p>';
    }

    hideCanvasOverlay() {
        try {
            const overlay = document.getElementById('canvas-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                // Also ensure the canvas is visible and ready
                if (this.fabricCanvas) {
                    this.fabricCanvas.renderAll();
                }
            }
        } catch (error) {
            console.error('Error hiding canvas overlay:', error);
        }
    }

    showLoadingOverlay() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoadingOverlay() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    updateLoadingStatus(status) {
        document.getElementById('loading-status').textContent = status;
    }

    async downloadAnimation() {
        if (this.animationSteps.length === 0) {
            alert('Najpierw wygeneruj animację');
            return;
        }

        // Create downloadable content
        const canvas = this.fabricCanvas.getElement();
        const link = document.createElement('a');
        link.download = 'sketchy-story-animation.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    onProviderChange(provider) {
        // Hide all config sections
        document.getElementById('openai-config').style.display = 'none';
        document.getElementById('gemini-config').style.display = 'none';
        document.getElementById('grok-config').style.display = 'none';
        
        // Show/hide test button
        const testBtn = document.getElementById('test-api-btn');
        if (provider === 'demo') {
            testBtn.style.display = 'none';
        } else {
            testBtn.style.display = 'block';
        }
        
        // Show relevant config section
        if (provider !== 'demo') {
            document.getElementById(`${provider}-config`).style.display = 'block';
        }
        
        this.updateAPIStatus(provider);
    }

    updateAPIStatus(provider) {
        const statusElement = document.getElementById('api-status');
        const statusText = document.getElementById('api-status-text');
        
        statusElement.className = 'api-status';
        
        switch (provider) {
            case 'demo':
                statusText.textContent = 'Demo mode - podstawowe scenariusze';
                break;
            case 'openai':
                const openaiKey = localStorage.getItem('openai-api-key');
                if (openaiKey) {
                    statusElement.classList.add('connected');
                    statusText.textContent = 'OpenAI - Połączono ✓';
                } else {
                    statusText.textContent = 'OpenAI - Wymagany klucz API';
                }
                break;
            case 'gemini':
                const geminiKey = localStorage.getItem('gemini-api-key');
                if (geminiKey) {
                    statusElement.classList.add('connected');
                    statusText.textContent = 'Google Gemini - Połączono ✓ (DARMOWY!)';
                } else {
                    statusText.textContent = 'Google Gemini - Wymagany klucz API (DARMOWY!)';
                }
                break;
            case 'grok':
                const grokKey = localStorage.getItem('grok-api-key');
                if (grokKey) {
                    statusElement.classList.add('connected');
                    statusText.textContent = 'Grok - Połączono ✓';
                } else {
                    statusText.textContent = 'Grok - Wymagany klucz API';
                }
                break;
        }
    }

    saveSettings() {
        const provider = document.getElementById('ai-provider').value;
        const openaiKey = document.getElementById('openai-key').value;
        const geminiKey = document.getElementById('gemini-key').value;
        const grokKey = document.getElementById('grok-key').value;
        const defaultLanguage = document.getElementById('default-language').value;
        const defaultQuality = document.getElementById('default-quality').value;

        localStorage.setItem('ai-provider', provider);
        
        if (openaiKey) {
            localStorage.setItem('openai-api-key', openaiKey);
        }
        if (geminiKey) {
            localStorage.setItem('gemini-api-key', geminiKey);
        }
        if (grokKey) {
            localStorage.setItem('grok-api-key', grokKey);
        }
        
        localStorage.setItem('default-language', defaultLanguage);
        localStorage.setItem('default-quality', defaultQuality);

        this.updateAPIStatus(provider);
        alert('Ustawienia zostały zapisane!');
    }

    loadSettings() {
        const provider = localStorage.getItem('ai-provider') || 'demo';
        const openaiKey = localStorage.getItem('openai-api-key');
        const geminiKey = localStorage.getItem('gemini-api-key');
        const grokKey = localStorage.getItem('grok-api-key');
        const defaultLanguage = localStorage.getItem('default-language') || 'pl';
        const defaultQuality = localStorage.getItem('default-quality') || 'medium';

        document.getElementById('ai-provider').value = provider;
        
        if (openaiKey) {
            document.getElementById('openai-key').value = openaiKey;
        }
        if (geminiKey) {
            document.getElementById('gemini-key').value = geminiKey;
        }
        if (grokKey) {
            document.getElementById('grok-key').value = grokKey;
        }
        
        document.getElementById('default-language').value = defaultLanguage;
        document.getElementById('default-quality').value = defaultQuality;
        
        this.onProviderChange(provider);
    }

    async testAPIConnection() {
        const provider = localStorage.getItem('ai-provider') || 'demo';
        const testBtn = document.getElementById('test-api-btn');
        const statusElement = document.getElementById('api-status');
        const statusText = document.getElementById('api-status-text');
        
        if (provider === 'demo') return;
        
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testowanie...';
        
        try {
            // Test with a simple prompt
            const testPrompt = 'Test';
            await this.generateScript(testPrompt, 30, 'friendly');
            
            // Success
            statusElement.className = 'api-status connected';
            statusText.textContent = `${this.getProviderName(provider)} - Test połączenia udany ✓`;
            testBtn.innerHTML = '<i class="fas fa-check"></i> Test udany!';
            
            setTimeout(() => {
                testBtn.innerHTML = '<i class="fas fa-flask"></i> Testuj połączenie API';
                testBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            // Error
            statusElement.className = 'api-status error';
            statusText.textContent = `${this.getProviderName(provider)} - Błąd: ${error.message}`;
            testBtn.innerHTML = '<i class="fas fa-times"></i> Test nieudany';
            
            setTimeout(() => {
                testBtn.innerHTML = '<i class="fas fa-flask"></i> Testuj połączenie API';
                testBtn.disabled = false;
            }, 3000);
        }
    }
    
    getProviderName(provider) {
        const names = {
            'openai': 'OpenAI',
            'gemini': 'Google Gemini',
            'grok': 'Grok'
        };
        return names[provider] || provider;
    }

    // Additional element creation functions
    createCircleElement(style, x = null, y = null) {
        return {
            type: 'circle',
            x: x || 100,
            y: y || 100,
            radius: 30,
            stroke: this.getStyleColor(style),
            fill: this.getStyleColor(style, 0.2),
            strokeWidth: 2
        };
    }

    createStartupElements(style, x = null, y = null) {
        const baseX = x || 100;
        const baseY = y || 100;
        
        // Return a startup-themed element
        return this.createTextElement('🚀', 'text', style, baseX, baseY);
    }

    createBusinessElements(style, x = null, y = null) {
        const baseX = x || 100;
        const baseY = y || 100;
        
        // Return a business-themed element
        return this.createChartElement(style, baseX, baseY);
    }

    createEducationalElements(style, x = null, y = null) {
        const baseX = x || 100;
        const baseY = y || 100;
        
        // Return an educational-themed element
        return this.createDiagramElement(style, baseX, baseY);
    }

    createTechElements(style, x = null, y = null) {
        const baseX = x || 100;
        const baseY = y || 100;
        
        // Return a tech-themed element
        return this.createBoxElement(style, baseX, baseY);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sketchStoryAI = new SketchStoryAI();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SketchStoryAI;
}