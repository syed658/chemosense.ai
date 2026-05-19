/* ==========================================
   CHEMOSENSE — Ultra-Premium Interactive JS
   Version 2.0 — Immersive Experience Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (window.innerWidth > 768 && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects
        const hoverables = document.querySelectorAll('a, button, .tilt-card, .btn, .nav-link, .interactive-row, .badge-card, .fv-item, .dash-nav-item, .dash-chart-tabs span');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    // ==========================================
    // 2. SCROLL PROGRESS BAR
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = percent + '%';
        }, { passive: true });
    }

    // ==========================================
    // 3. NAVIGATION
    // ==========================================
    const navbar = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==========================================
    // 4. ECG CANVAS ANIMATION
    // ==========================================
    const ecgCanvas = document.getElementById('ecg-canvas');
    if (ecgCanvas) {
        const ctx = ecgCanvas.getContext('2d');
        let width, height;

        function resizeECG() {
            width = ecgCanvas.width = window.innerWidth;
            height = ecgCanvas.height = window.innerHeight;
        }
        resizeECG();
        window.addEventListener('resize', resizeECG);

        const lines = Array.from({ length: 5 }, (_, i) => ({
            y: 0, offset: i * 180,
            speed: 1.2 + Math.random() * 0.6,
            color: i % 2 === 0 ? [0, 240, 255] : [123, 97, 255],
            opacity: 0.25 + Math.random() * 0.35,
            amplitude: 18 + Math.random() * 28
        }));

        function ecgPoint(x, baseY, amp) {
            const cycle = 280;
            const p = ((x % cycle) + cycle) % cycle;
            if (p < 90) return baseY;
            if (p < 105) return baseY - amp * 0.3 * ((p - 90) / 15);
            if (p < 115) return baseY - amp * 0.3 + amp * 1.3 * ((p - 105) / 10);
            if (p < 125) return baseY + amp - amp * 2.3 * ((p - 115) / 10);
            if (p < 140) return baseY - amp * 1.3 + amp * 1.3 * ((p - 125) / 15);
            if (p < 170) return baseY;
            if (p < 190) return baseY + amp * 0.12 * Math.sin(((p - 170) / 20) * Math.PI);
            return baseY;
        }

        let time = 0;
        function drawECG() {
            ctx.clearRect(0, 0, width, height);
            lines.forEach((line, i) => {
                line.y = (height / 6) * (i + 1);
                ctx.beginPath();
                const [r, g, b] = line.color;
                ctx.strokeStyle = `rgba(${r},${g},${b},${line.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.lineJoin = 'round';
                for (let x = 0; x < width + 2; x += 2) {
                    const y = ecgPoint(x + time * line.speed + line.offset, line.y, line.amplitude);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            });
            time += 1;
            requestAnimationFrame(drawECG);
        }
        drawECG();
    }

    // ==========================================
    // 5. INTERACTIVE PARTICLE CONSTELLATION
    // ==========================================
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        const pCtx = particlesCanvas.getContext('2d');
        let pW, pH;
        const particles = [];
        const particleCount = 60;
        let pmx = 0, pmy = 0;

        function resizeParticles() {
            pW = particlesCanvas.width = window.innerWidth;
            pH = particlesCanvas.height = window.innerHeight;
        }
        resizeParticles();
        window.addEventListener('resize', resizeParticles);

        particlesCanvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = particlesCanvas.getBoundingClientRect();
            pmx = e.clientX - rect.left;
            pmy = e.clientY - rect.top;
        });

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * pW, y: Math.random() * pH,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                r: 1 + Math.random() * 1.5,
                color: Math.random() > 0.5 ? 'rgba(0,240,255,' : 'rgba(123,97,255,',
            });
        }

        function drawParticles() {
            pCtx.clearRect(0, 0, pW, pH);
            particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > pW) p.vx *= -1;
                if (p.y < 0 || p.y > pH) p.vy *= -1;

                // Mouse attraction
                const dx = pmx - p.x;
                const dy = pmy - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    p.x += dx * 0.002;
                    p.y += dy * 0.002;
                }

                // Draw particle
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                pCtx.fillStyle = p.color + '0.5)';
                pCtx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const d = Math.hypot(p2.x - p.x, p2.y - p.y);
                    if (d < 120) {
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(p2.x, p2.y);
                        pCtx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - d / 120)})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ==========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('animated'), parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // ==========================================
    // 7. COUNTER ANIMATIONS
    // ==========================================
    function animateCounter(el, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        function update() {
            current += increment;
            if (current >= target) { el.textContent = target; return; }
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    }

    // Hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number[data-count]').forEach(counter => {
                        animateCounter(counter, parseInt(counter.dataset.count));
                    });
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObs.observe(heroStats);
    }

    // All counter-up elements
    const counterUpObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (target) animateCounter(entry.target, target, 1500);
                counterUpObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter-up').forEach(el => counterUpObs.observe(el));

    // ==========================================
    // 8. AI SCORE RING + PARAM BARS
    // ==========================================
    const scoreCard = document.querySelector('.score-card');
    if (scoreCard) {
        const scoreRing = scoreCard.querySelector('.score-ring-fill');
        const scoreCounter = document.getElementById('score-counter');
        const paramFills = scoreCard.querySelectorAll('.param-fill');

        const scoreObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate ring
                    const targetScore = 87;
                    const circ = 2 * Math.PI * 85;
                    const offset = circ - (targetScore / 100) * circ;
                    setTimeout(() => {
                        scoreRing.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        scoreRing.style.strokeDashoffset = offset;
                    }, 200);
                    animateCounter(scoreCounter, targetScore, 2500);

                    // Animate param bars
                    paramFills.forEach((bar, i) => {
                        setTimeout(() => {
                            bar.style.width = bar.dataset.pw + '%';
                        }, 400 + i * 200);
                    });

                    scoreObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        scoreObs.observe(scoreCard);
    }

    // ==========================================
    // 9. TRACK BARS ANIMATION
    // ==========================================
    const trackBarObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.animated-bar');
                bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width + '%';
                    }, i * 200);
                });
                trackBarObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.tracks-grid').forEach(g => trackBarObs.observe(g));

    // ==========================================
    // 10. 3D TILT + SHINE EFFECT ON CARDS
    // ==========================================
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
            card.style.boxShadow = `${-x * 20}px ${-y * 20}px 60px rgba(0,0,0,0.25), 0 0 1px rgba(0,240,255,0.1)`;

            // Shine effect
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.setProperty('--shine-x', (e.clientX - rect.left - 100) + 'px');
                shine.style.setProperty('--shine-y', (e.clientY - rect.top - 100) + 'px');
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // ==========================================
    // 11. MAGNETIC BUTTONS
    // ==========================================
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transition = 'transform 0.15s ease-out';
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.transform = '';
        });
    });

    // ==========================================
    // 12. RIPPLE EFFECT ON BUTTONS
    // ==========================================
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ==========================================
    // 13. PARALLAX HERO
    // ==========================================
    const heroContent = document.querySelector('.hero-content');
    const heroOrbs = document.querySelector('.hero-gradient-orbs');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const s = window.scrollY;
            if (s < window.innerHeight) {
                heroContent.style.transform = `translateY(${s * 0.35}px)`;
                heroContent.style.opacity = 1 - s / (window.innerHeight * 0.75);
                if (heroOrbs) heroOrbs.style.transform = `translateY(${s * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ==========================================
    // 14. HERO CURSOR GLOW
    // ==========================================
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const glow = document.createElement('div');
        glow.style.cssText = `position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,240,255,0.04),transparent 70%);pointer-events:none;z-index:1;`;
        heroSection.appendChild(glow);
        heroSection.addEventListener('mousemove', (e) => {
            glow.style.left = (e.clientX - 250) + 'px';
            glow.style.top = (e.clientY - 250) + 'px';
        });
    }

    // ==========================================
    // 15. DASHBOARD INTERACTIVE 3D
    // ==========================================
    const dashFrame = document.getElementById('dashboard-frame');
    if (dashFrame) {
        dashFrame.addEventListener('mousemove', (e) => {
            const rect = dashFrame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            dashFrame.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        dashFrame.addEventListener('mouseleave', () => {
            dashFrame.style.transform = 'rotateX(4deg)';
        });
    }

    // Dashboard tabs
    document.querySelectorAll('.dash-chart-tabs span').forEach(tab => {
        tab.addEventListener('click', function() {
            this.parentElement.querySelectorAll('span').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ==========================================
    // 16. HOW-IT-WORKS PROGRESS LINE
    // ==========================================
    const howLine = document.getElementById('how-line-progress');
    const howSteps = document.querySelectorAll('.how-step');
    if (howLine && howSteps.length) {
        window.addEventListener('scroll', () => {
            const timelineEl = document.querySelector('.how-timeline');
            if (!timelineEl) return;
            const rect = timelineEl.getBoundingClientRect();
            const viewH = window.innerHeight;
            const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (rect.height + viewH * 0.3)));
            howLine.style.height = (progress * 100) + '%';

            howSteps.forEach(step => {
                const stepRect = step.getBoundingClientRect();
                if (stepRect.top < viewH * 0.7) {
                    step.classList.add('is-active');
                }
            });
        }, { passive: true });
    }

    // ==========================================
    // 17. ACTIVE NAV LINK HIGHLIGHT
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-link-cta)');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 250) current = sec.getAttribute('id');
        });
        navLinkEls.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) link.style.color = 'var(--accent-cyan)';
        });
    }, { passive: true });

    // ==========================================
    // 18. PRODUCT DEVICE SCROLL ROTATION
    // ==========================================
    const productDevice = document.getElementById('product-device');
    if (productDevice) {
        window.addEventListener('scroll', () => {
            const rect = productDevice.getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.top < viewH && rect.bottom > 0) {
                const progress = (viewH - rect.top) / (viewH + rect.height);
                const rotation = (progress - 0.5) * 12;
                productDevice.style.transform = `rotateY(${rotation}deg) rotateX(${rotation * 0.3}deg)`;
            }
        }, { passive: true });
    }

    // ==========================================
    // 19. TEXT REVEAL: HERO BADGE
    // ==========================================
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(12px) scale(0.95)';
        setTimeout(() => {
            heroBadge.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0) scale(1)';
        }, 400);
    }

    // ==========================================
    // 20. COMPARISON TABLE ROW HOVER
    // ==========================================
    const compTable = document.getElementById('comparison-table');
    if (compTable) {
        compTable.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.2s ease';
                this.querySelectorAll('td').forEach(td => {
                    td.style.background = 'rgba(255,255,255,0.02)';
                });
                const hlCell = this.querySelector('.highlight-col');
                if (hlCell) hlCell.style.background = 'rgba(0,240,255,0.06)';
            });
            row.addEventListener('mouseleave', function() {
                this.querySelectorAll('td').forEach(td => { td.style.background = ''; });
                const hlCell = this.querySelector('.highlight-col');
                if (hlCell) hlCell.style.background = 'rgba(0,240,255,0.03)';
            });
        });
    }

    // ==========================================
    // 21. ROADMAP STEP INTERACTION
    // ==========================================
    document.querySelectorAll('.roadmap-step').forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.querySelector('.rs-dot').style.transform = 'scale(1.4)';
            step.querySelector('.rs-label').style.color = 'var(--accent-cyan)';
        });
        step.addEventListener('mouseleave', () => {
            step.querySelector('.rs-dot').style.transform = '';
            step.querySelector('.rs-label').style.color = '';
        });
    });

    // ==========================================
    // 22. SMOOTH PAGE LOAD
    // ==========================================
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    });

    // ==========================================
    // 23. SPLIT TEXT ANIMATION (HERO)
    // ==========================================
    document.querySelectorAll('.split-text').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px) rotateX(-40deg)';
            span.style.transition = `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.03}s`;
            el.appendChild(span);
        });

        const splitObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('span').forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0) rotateX(0)';
                    });
                    splitObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        splitObs.observe(el);
    });

    // ==========================================
    // 24. STAGGERED GRID ANIMATION
    // ==========================================
    const staggerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    setTimeout(() => {
                        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, i * 80);
                });
                staggerObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Apply to grids
    document.querySelectorAll('.team-grid, .impact-grid').forEach(grid => {
        Array.from(grid.children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
        });
        staggerObs.observe(grid);
    });

    // ==========================================
    // 25. DASH PATIENT ROW HOVER EXPAND
    // ==========================================
    document.querySelectorAll('.dash-patient-row').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0,240,255,0.03)';
            this.style.borderRadius = '8px';
            this.style.transform = 'translateX(4px)';
            this.style.transition = 'all 0.2s ease';
        });
        row.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.transform = '';
        });
    });

});
