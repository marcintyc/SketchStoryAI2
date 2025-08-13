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
            alert('Wystąpił błąd podczas generowania animacji. Sprawdź klucz API i połączenie internetowe.');
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

    async generateWithGemini(prompt, duration, voiceStyle) {
        const apiKey = localStorage.getItem('gemini-api-key');
        if (!apiKey) {
            throw new Error('Brak klucza API dla Gemini');
        }

        const systemPrompt = `Jesteś ekspertem od tworzenia scenariuszy do animacji whiteboard. Twórz angażujące, wciągające historie dostosowane do stylu narracji: ${voiceStyle}. Scenariusz powinien trwać około ${duration} sekund. Podziel treść na logiczne sekcje z opisami wizualnymi.`;
        
        const userPrompt = `${systemPrompt}\n\nStwórz scenariusz animacji whiteboard dla tematu: "${prompt}". Uwzględnij opisy elementów wizualnych, które mają być narysowane w każdej scenie.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
                }
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API error: ' + response.statusText);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
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
        return `Demo Scenariusz: ${prompt}

Scena 1: Wprowadzenie
- Narysuj tytuł "${prompt}" w centrum
- Dodaj ramkę wokół tytułu
- Narysuj strzałkę wskazującą w dół

Scena 2: Główna treść
- Stwórz diagram pokazujący kluczowe elementy
- Dodaj ikony reprezentujące główne punkty
- Połącz elementy liniami

Scena 3: Podsumowanie
- Narysuj podsumowujący wykres lub diagram
- Dodaj znak zapytania zachęcający do działania
- Zakończ logo lub wezwaniem do działania

To jest przykładowy scenariusz demonstracyjny. Aby uzyskać pełną funkcjonalność AI, dodaj swój klucz OpenAI API w ustawieniach.`;
    }

    async createAnimationSteps(script, style, duration) {
        // Parse script and create animation steps
        const sections = script.split('\n\n').filter(section => section.trim());
        const stepsPerSection = Math.max(2, Math.floor(duration / sections.length / 2));
        
        const steps = [];
        let currentTime = 0;
        const stepDuration = duration / (sections.length * stepsPerSection);

        sections.forEach((section, sectionIndex) => {
            const lines = section.split('\n').filter(line => line.trim());
            
            for (let i = 0; i < stepsPerSection; i++) {
                steps.push({
                    time: currentTime,
                    duration: stepDuration,
                    type: 'draw',
                    content: lines[i % lines.length] || '',
                    section: sectionIndex,
                    style: style,
                    elements: this.generateDrawingElements(lines[i % lines.length] || '', style)
                });
                currentTime += stepDuration;
            }
        });

        return steps;
    }

    generateDrawingElements(content, style) {
        const elements = [];
        const canvas = this.fabricCanvas;
        
        // Simple keyword-based element generation
        const keywords = {
            'tytuł': () => this.createTextElement(content, 'title', style),
            'tekst': () => this.createTextElement(content, 'text', style),
            'strzałka': () => this.createArrowElement(style),
            'ramka': () => this.createBoxElement(style),
            'diagram': () => this.createDiagramElement(style),
            'ikona': () => this.createIconElement(style),
            'linia': () => this.createLineElement(style),
            'wykres': () => this.createChartElement(style)
        };

        Object.keys(keywords).forEach(keyword => {
            if (content.toLowerCase().includes(keyword)) {
                elements.push(keywords[keyword]());
            }
        });

        if (elements.length === 0) {
            elements.push(this.createTextElement(content, 'text', style));
        }

        return elements;
    }

    createTextElement(text, type, style) {
        const fontSize = type === 'title' ? 24 : 16;
        const color = this.getStyleColor(style);
        
        return {
            type: 'text',
            content: text.substring(0, 50), // Limit text length
            fontSize: fontSize,
            color: color,
            x: Math.random() * 300 + 50,
            y: Math.random() * 200 + 50,
            fontFamily: this.getStyleFont(style)
        };
    }

    createArrowElement(style) {
        return {
            type: 'arrow',
            x1: Math.random() * 200 + 100,
            y1: Math.random() * 150 + 100,
            x2: Math.random() * 200 + 300,
            y2: Math.random() * 150 + 200,
            color: this.getStyleColor(style),
            strokeWidth: 2
        };
    }

    createBoxElement(style) {
        return {
            type: 'rectangle',
            x: Math.random() * 300 + 50,
            y: Math.random() * 200 + 50,
            width: Math.random() * 150 + 100,
            height: Math.random() * 100 + 50,
            stroke: this.getStyleColor(style),
            fill: 'transparent',
            strokeWidth: 2
        };
    }

    createLineElement(style) {
        return {
            type: 'line',
            x1: Math.random() * 300 + 50,
            y1: Math.random() * 200 + 100,
            x2: Math.random() * 300 + 200,
            y2: Math.random() * 200 + 150,
            stroke: this.getStyleColor(style),
            strokeWidth: 2
        };
    }

    createDiagramElement(style) {
        return {
            type: 'circle',
            x: Math.random() * 300 + 100,
            y: Math.random() * 200 + 100,
            radius: Math.random() * 50 + 30,
            stroke: this.getStyleColor(style),
            fill: 'transparent',
            strokeWidth: 2
        };
    }

    createIconElement(style) {
        const icons = ['★', '♦', '●', '▲', '■'];
        return {
            type: 'text',
            content: icons[Math.floor(Math.random() * icons.length)],
            fontSize: 20,
            color: this.getStyleColor(style),
            x: Math.random() * 400 + 50,
            y: Math.random() * 250 + 50,
            fontFamily: 'Arial'
        };
    }

    createChartElement(style) {
        return {
            type: 'rectangle',
            x: Math.random() * 200 + 100,
            y: Math.random() * 150 + 100,
            width: Math.random() * 100 + 80,
            height: Math.random() * 80 + 40,
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
        // This would integrate with image generation APIs
        // For now, we'll use the predefined elements
        return steps;
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
        
        if (this.animationLoop) {
            clearInterval(this.animationLoop);
        }
        
        this.fabricCanvas.clear();
        this.updateProgressBar();
    }

    startAnimationLoop() {
        const totalDuration = this.animationSteps.reduce((sum, step) => sum + step.duration, 0);
        const stepInterval = 100; // ms
        
        let currentTime = 0;
        
        this.animationLoop = setInterval(() => {
            if (!this.isPlaying || this.isPaused) {
                clearInterval(this.animationLoop);
                return;
            }

            currentTime += stepInterval / 1000; // Convert to seconds
            this.progress = (currentTime / totalDuration) * 100;
            this.updateProgressBar();

            // Find current animation step
            const activeStep = this.animationSteps.find(step => 
                currentTime >= step.time && currentTime < step.time + step.duration
            );

            if (activeStep && this.currentStep !== this.animationSteps.indexOf(activeStep)) {
                this.currentStep = this.animationSteps.indexOf(activeStep);
                this.executeAnimationStep(activeStep);
            }

            // Check if animation is complete
            if (currentTime >= totalDuration) {
                this.stopAnimation();
            }
        }, stepInterval);
    }

    executeAnimationStep(step) {
        step.elements.forEach((element, index) => {
            setTimeout(() => {
                this.drawElement(element);
            }, index * 200); // Stagger element appearance
        });
    }

    drawElement(element) {
        let fabricObject;

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
        }

        if (fabricObject) {
            // Add drawing animation effect
            fabricObject.opacity = 0;
            this.fabricCanvas.add(fabricObject);
            
            // Animate appearance
            fabricObject.animate('opacity', 1, {
                duration: 500,
                easing: fabric.util.ease.easeOutCubic
            });
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
        scriptContent.innerHTML = `<p>${script.replace(/\n/g, '</p><p>')}</p>`;
    }

    hideCanvasOverlay() {
        document.getElementById('canvas-overlay').classList.add('hidden');
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sketchStoryAI = new SketchStoryAI();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SketchStoryAI;
}