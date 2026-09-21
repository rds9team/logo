class Rds9 extends HTMLElement {
    static get observedAttributes() { return ['muted']; }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAnim = true;
        this.ctx = null;
        this.t = [];
        this.muted = false;
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this._onClick = (e) => this.tap(e);
        this._onMouseEnter = () => this.hov();
        this._onVis = () => this.vis();
    }

    attributeChangedCallback(name, _old, val) {
        if (name === 'muted') this.muted = val !== null;
    }

    connectedCallback() {
        const sub = this.getAttribute('subtitle') || 'STUDENT ENGINEER';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                    user-select: none;
                }
                .wp {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .lg {
                    display: flex;
                    align-items: baseline;
                    font-size: 72px;
                    font-weight: 900;
                    letter-spacing: -0.05em;
                    cursor: pointer;
                }
                .tx { color: #e3e6eb; }
                .c9 {
                    display: inline-block;
                    width: 0px;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.36, 0, 0.66, -0.56);
                }
                .dt {
                    color: #e3e6eb;
                    display: inline-block;
                    transform-origin: bottom center;
                    transition: color 0.15s ease;
                }
                .an .c9 {
                    width: 48px;
                    opacity: 1;
                    margin-right: 2px;
                    transition: all 4.0s cubic-bezier(0.1, 1, 0.2, 1);
                }
                .an .dt {
                    animation: b 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    color: #a855f7;
                }
                .rt .c9 {
                    width: 0px;
                    opacity: 0;
                    transition: all 0.25s cubic-bezier(0.36, 0, 0.66, -0.56);
                }
                .hv .dt {
                    animation: b 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    color: #a855f7;
                }
                .sh .c9 { width: 48px; opacity: 1; margin-right: 2px; }
                @keyframes b {
                    0%   { transform: translateY(0)    scale(1)    rotate(0deg); }
                    30%  { transform: translateY(-24px) scaleY(1.15) scaleX(0.85) rotate(-4deg); }
                    50%  { transform: translateY(-24px) scale(1)    rotate(0deg); }
                    75%  { transform: translateY(0)    scaleY(0.9)  scaleX(1.1)  rotate(2deg); }
                    100% { transform: translateY(0)    scale(1)    rotate(0deg); }
                }
                .sw {
                    display: flex;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.35em;
                    color: #5d6275;
                    text-transform: uppercase;
                    height: 14px;
                    padding-left: 0.35em;
                }
                .sc {
                    display: inline-block;
                    transform: translateY(8px);
                    opacity: 0;
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
                }
                .sc.ac { transform: translateY(0); opacity: 1; }
                @media (prefers-reduced-motion: reduce) {
                    .c9, .dt, .sc { transition: none !important; animation: none !important; }
                    .an .c9 { width: 48px; opacity: 1; }
                    .sc { transform: none; opacity: 1; }
                }
            </style>
            <div class="wp">
                <div class="lg" id="l"><span class="tx">rds</span><span class="c9 tx">9</span><span class="dt">.</span></div>
                <div class="sw" id="s"></div>
            </div>
        `;

        this.el  = this.shadowRoot.getElementById('l');
        this.dt  = this.shadowRoot.querySelector('.dt');
        this.tgt = this.shadowRoot.getElementById('s');

        this.initSub(sub);

        this.el.addEventListener('click', this._onClick);
        this.el.addEventListener('touchstart', this._onClick, { passive: false });
        this.el.addEventListener('mouseenter', this._onMouseEnter);
        this.dt.addEventListener('animationend', () => this.ed());
        document.addEventListener('visibilitychange', this._onVis);

        if (this.reduced) {
            this.el.classList.add('sh');
            this.trigSub(true);
            this.isAnim = false;
        } else {
            this.st(() => this.go(), 1500);
        }
    }

    initSub(txt) {
        this.tgt.innerHTML = '';
        [...txt].forEach((c, i) => {
            const s = document.createElement('span');
            s.textContent = c === ' ' ? '\u00A0' : c;
            s.className = 'sc';
            s.style.transitionDelay = `${300 + i * 30}ms`;
            this.tgt.appendChild(s);
        });
    }

    trigSub(show, immediate = false) {
        const items = this.tgt.querySelectorAll('.sc');
        if (show) {
            items.forEach(c => c.classList.add('ac'));
        } else {
            items.forEach(c => {
                c.style.transitionDelay = immediate ? '0ms' : c.style.transitionDelay;
                c.classList.remove('ac');
            });
            this.st(() => {
                this.initSub(this.getAttribute('subtitle') || 'STUDENT ENGINEER');
            }, 250);
        }
    }

    aud() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (_) {
                return null;
            }
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    playBass() {
        if (this.muted) return;
        const ctx = this.aud();
        if (!ctx) return;

        const n = ctx.currentTime, dur = 4.0;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();

        o.type = 'sine';
        o.frequency.setValueAtTime(55.0, n);
        o.frequency.exponentialRampToValueAtTime(28.0, n + dur);

        f.type = 'lowpass';
        f.frequency.setValueAtTime(100, n);
        f.frequency.exponentialRampToValueAtTime(40, n + dur);

        o.connect(f); f.connect(g); g.connect(ctx.destination);

        g.gain.setValueAtTime(0, n);
        g.gain.linearRampToValueAtTime(0.65, n + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, n + dur);

        o.start(n); o.stop(n + dur);
    }

    playBell() {
        if (this.muted) return;
        const ctx = this.aud();
        if (!ctx) return;

        const n = ctx.currentTime, dur = 1.1;
        const nt = (d, fr, v, de) => {
            const t = n + (d / 1000);
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(fr, t);
            o.detune.setValueAtTime(de, t);
            o.connect(g); g.connect(ctx.destination);
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(v, t + 0.012);
            g.gain.linearRampToValueAtTime(v * 0.15, t + 0.1);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.start(t); o.stop(t + dur);
        };
        nt(0, 1318.51, 0.025, -4);
        nt(15, 1760.0, 0.03, 0);
        nt(30, 2637.02, 0.015, 5);
    }

    st(fn, d) { this.t.push(setTimeout(fn, d)); }
    clr() { this.t.forEach(clearTimeout); this.t = []; }

    go() {
        if (document.hidden) return;
        this.el.classList.remove('rt');
        void this.el.offsetWidth;
        this.el.classList.add('an');
        this.playBass();
        this.st(() => this.playBell(), 350);
        this.st(() => this.trigSub(true), 50);
    }

    ed() {
        if (this.el.classList.contains('an')) {
            this.el.classList.remove('an');
            this.el.classList.add('sh');
            this.isAnim = false;
        } else if (this.el.classList.contains('hv')) {
            this.el.classList.remove('hv');
            this.isAnim = false;
        }
    }

    rep() {
        this.isAnim = true;
        this.clr();
        this.trigSub(false);
        this.el.classList.remove('an', 'hv', 'sh');
        this.el.classList.add('rt');
        this.st(() => this.go(), 450);
    }

    hov() {
        if (!this.isAnim && this.el.classList.contains('sh')) {
            this.isAnim = true;
            this.el.classList.add('hv');
            this.st(() => this.playBell(), 100);
        }
    }

    tap(e) {
        if (e) e.preventDefault();
        this.aud();
        if (!this.isAnim) this.rep();
    }

    vis() {
        if (document.hidden) {
            this.clr();
        } else if (this.isAnim) {
            this.clr();
            this.rep();
        }
    }

    disconnectedCallback() {
        this.clr();
        document.removeEventListener('visibilitychange', this._onVis);
    }
}

customElements.define('rds9-logo', Rds9);
