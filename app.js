/* ==========================================================================
   BREW HAVEN CAFÉ - INTERACTIVE LOGIC (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY NAV HEADER ON SCROLL
    // ==========================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check


    // ==========================================
    // 2. MOBILE HAMBURGER MENU
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 3. SCROLL SPY - ACTIVE NAVIGATION LINK
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for sticky nav
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);


    // ==========================================
    // 4. INTERACTIVE FEATURED MENU TABS
    // ==========================================
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from other buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                // Get the main card element's category
                const cardCategory = card.getAttribute('data-category');

                // Clear any inline styles so transitions work
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';

                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        // Trigger reflow to run transition
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });


    // ==========================================
    // 5. CUSTOMER REVIEWS CAROUSEL SLIDER
    // ==========================================
    const slider = document.getElementById('reviews-slider');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    let currentIndex = 0;
    const totalReviews = document.querySelectorAll('.review-card').length;
    let autoSlideInterval;

    const updateSlider = (index) => {
        currentIndex = index;
        
        // Slide standard translation
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const nextSlide = () => {
        let index = currentIndex + 1;
        if (index >= totalReviews) {
            index = 0;
        }
        updateSlider(index);
    };

    const prevSlide = () => {
        let index = currentIndex - 1;
        if (index < 0) {
            index = totalReviews - 1;
        }
        updateSlider(index);
    };

    // Click controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Dot indicators click
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            updateSlider(index);
            resetAutoSlide();
        });
    });

    // Auto sliding setup
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 6000); // 6s duration
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    if (slider) {
        startAutoSlide();
    }


    // ==========================================
    // 6. IMAGE GALLERY MODAL LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden'; // Stop background scrolling
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // ==========================================
    // 7. PREMIUM CONTACT & RESERVATION FORM
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract input values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone-input').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Stylized feedback
            const submitBtn = document.getElementById('form-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                // Success message
                alert(`Thank you, ${name}! Your request regarding "${subject}" has been received. Brew Haven Café hosts will reach out shortly.`);
                
                // Reset Form
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 1200);
        });
    }

    // ==========================================
    // 8. NEWSLETTER SUBSCRIPTION FORM
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const emailValue = emailInput.value.trim();

            if (emailValue) {
                alert(`Welcome to the sanctuary! "${emailValue}" is now subscribed to the Brew Haven Newsletter.`);
                emailInput.value = '';
            }
        });
    }

});
