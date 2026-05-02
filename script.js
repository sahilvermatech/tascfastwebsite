document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Slide-Up Animations
    const elementsToAnimate = document.querySelectorAll('.section-title, .bento-card, .text-block, .stat, .testimonial-container, .tools-grid, .capture-form, .final-form');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('slide-up');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you want it to happen only once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // 2. Mobile Floating Nav Visibility
    const heroSection = document.querySelector('.hero');
    const mobileNav = document.querySelector('.mobile-bottom-nav');

    if (heroSection && mobileNav) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero is NOT intersecting (i.e., we scrolled past it), show nav
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    mobileNav.classList.add('visible');
                } else {
                    mobileNav.classList.remove('visible');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        heroObserver.observe(heroSection);
    }

    // 3. Form Submission Handling (Prevent default for demo)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'SYSTEM INITIATED //';
            setTimeout(() => {
                btn.innerHTML = originalText;
                form.reset();
            }, 3000);
        });
    });

    // Capture forms (not technically <form> tags in HTML but divs)
    const captureBtns = document.querySelectorAll('.capture-form button');
    captureBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerHTML;
            btn.innerHTML = 'RECEIVED';
            setTimeout(() => {
                btn.innerHTML = originalText;
                const input = btn.previousElementSibling;
                if(input) input.value = '';
            }, 3000);
        });
    });

    // 4. Interactive Canvas Dots
    const canvas = document.getElementById('dotsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const spacing = 24;
        const dotRadius = 1;
        const dots = [];
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initDots();
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', resize);

        class Dot {
            constructor(x, y) {
                this.homeX = x;
                this.homeY = y;
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.radius = dotRadius;
                this.color = document.body.classList.contains('light-theme') ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.35)';
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                let maxDistance = 120;

                if (distance < maxDistance) {
                    let force = (maxDistance - distance) / maxDistance;
                    let angle = Math.atan2(dy, dx);
                    let pushX = Math.cos(angle) * force * 5;
                    let pushY = Math.sin(angle) * force * 5;
                    this.vx -= pushX;
                    this.vy -= pushY;
                }

                this.vx += (this.homeX - this.x) * 0.05;
                this.vy += (this.homeY - this.y) * 0.05;
                this.vx *= 0.8;
                this.vy *= 0.8;

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initDots() {
            dots.length = 0;
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    dots.push(new Dot(x, y));
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < dots.length; i++) {
                dots[i].update();
                dots[i].draw();
            }
            requestAnimationFrame(animate);
        }

        resize();
        animate();
    }

    // 5. Theme Toggle
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        // Initialize state
        checkbox.checked = document.body.classList.contains('light-theme');
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            // Trigger resize to update canvas dots
            window.dispatchEvent(new Event('resize'));
        });
    }
    
    // Liquid Cursor has been removed
});
