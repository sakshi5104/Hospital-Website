/**
 * ========================================================================
 * SPANDAN HEART CLINIC - INTERACTIVE JAVASCRIPT
 * Dr. Arvind Sharma (Senior Cardiologist)
 * Features: Mobile Menu, Sticky Nav, Counter Animation, Review Carousel,
 *           FAQ Accordions, Accessibility, and Strict Form Validation.
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------------------
       1. STICKY HEADER & SCROLL SPY
    ------------------------------------------------------------------------ */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header shrink transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy: Highlight active navigation link based on current section
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky header
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on page load


    /* ---------------------------------------------------------------------
       2. MOBILE NAVIGATION DRAWER
    ------------------------------------------------------------------------ */
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    // Create Backdrop Overlay dynamically
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    const openMenu = () => {
        menuToggle.classList.add('active');
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    };

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore page scrolling
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when overlay backdrop is clicked
    overlay.addEventListener('click', closeMenu);

    // Close menu when navigation links are clicked (for smooth page jump)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    /* ---------------------------------------------------------------------
       3. ANIMATED STATISTICS COUNTERS
    ------------------------------------------------------------------------ */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 16); // ~60fps
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString('en-IN');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString('en-IN');
                }
            };

            updateCount();
        });
    };

    // IntersectionObserver to start counter only when Hero section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true; // Run only once
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }


    /* ---------------------------------------------------------------------
       4. TESTIMONIALS SLIDER / CAROUSEL
    ------------------------------------------------------------------------ */
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('carouselNext');
    const prevButton = document.getElementById('carouselPrev');
    const dotsContainer = document.getElementById('carouselDots');

    let currentIndex = 0;
    let autoSlideInterval;

    // Create Navigation Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to review slide ${index + 1}`);
        dotsContainer.appendChild(dot);

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    const dots = Array.from(dotsContainer.children);

    const updateDots = (targetIndex) => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[targetIndex].classList.add('active');
    };

    const goToSlide = (targetIndex) => {
        // Handle circular index wrapping
        if (targetIndex < 0) {
            targetIndex = slides.length - 1;
        } else if (targetIndex >= slides.length) {
            targetIndex = 0;
        }

        // Apply visual sliding effect
        track.style.transform = `translateX(-${targetIndex * 100}%)`;
        currentIndex = targetIndex;
        updateDots(currentIndex);
    };

    // Nav Button Click Actions
    nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    // Touch Swiping Support for Mobile Phones
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        pauseAutoSlide();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const diffX = e.touches[0].clientX - startX;
        
        // Threshold check to prevent accidental scrolling triggers
        if (Math.abs(diffX) > 60) {
            if (diffX > 0) {
                goToSlide(currentIndex - 1); // Swipe Right -> Prev
            } else {
                goToSlide(currentIndex + 1); // Swipe Left -> Next
            }
            isSwiping = false; // Trigger once per swipe gesture
        }
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isSwiping = false;
        startAutoSlide();
    });

    // Auto-scroll loop
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Shift slide every 5 seconds
    };

    const pauseAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    const resetAutoSlide = () => {
        pauseAutoSlide();
        startAutoSlide();
    };

    // Pause carousel on desktop hover
    track.addEventListener('mouseenter', pauseAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Initial launch of Auto-slide
    startAutoSlide();


    /* ---------------------------------------------------------------------
       5. FAQ ACCORDION INTERACTIVITY
    ------------------------------------------------------------------------ */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            const isActive = faqItem.classList.contains('active');

            // Close all other open FAQ accordions (accordion mode)
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle selected accordion
            if (isActive) {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
                faqAnswer.style.maxHeight = null;
                faqAnswer.setAttribute('aria-hidden', 'true');
            } else {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                // Set max-height to scrollHeight to animate fluid dropdown opening
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                faqAnswer.setAttribute('aria-hidden', 'false');
            }
        });
    });


    /* ---------------------------------------------------------------------
       6. APPOINTMENT FORM VALIDATION & SUBMISSION
    ------------------------------------------------------------------------ */
    const form = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('formMessage');

    // Configure Min Date picker property to "Today" (Restricts choosing past dates)
    const dateInput = document.getElementById('patientDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Field-specific DOM elements
    const fields = {
        name: {
            input: document.getElementById('patientName'),
            error: document.getElementById('nameError'),
            validate: (val) => val.trim().length >= 3
        },
        mobile: {
            input: document.getElementById('patientMobile'),
            error: document.getElementById('mobileError'),
            validate: (val) => {
                // Accepts standard Indian 10-digit formats starting with 6-9
                const indianMobileRegex = /^[6-9]\d{9}$/;
                return indianMobileRegex.test(val.trim());
            }
        },
        age: {
            input: document.getElementById('patientAge'),
            error: document.getElementById('ageError'),
            validate: (val) => {
                const ageNum = parseInt(val, 10);
                return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
            }
        },
        gender: {
            input: document.getElementById('patientGender'),
            error: document.getElementById('genderError'),
            validate: (val) => val !== ''
        },
        village: {
            input: document.getElementById('patientVillage'),
            error: document.getElementById('villageError'),
            validate: (val) => val.trim().length >= 2
        },
        date: {
            input: dateInput,
            error: document.getElementById('dateError'),
            validate: (val) => {
                if (!val) return false;
                const chosenDate = new Date(val);
                const currentDate = new Date(today);
                return chosenDate >= currentDate;
            }
        }
    };

    // Helper: Mark field as valid or invalid visually
    const showFieldError = (fieldKey, isInvalid) => {
        const field = fields[fieldKey];
        if (isInvalid) {
            field.input.classList.add('invalid');
        } else {
            field.input.classList.remove('invalid');
        }
    };

    // Live validation listener on inputs
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        const eventName = field.input.tagName === 'SELECT' ? 'change' : 'input';

        field.input.addEventListener(eventName, () => {
            const isValid = field.validate(field.input.value);
            showFieldError(key, !isValid);
        });
    });

    // Form Submit Interceptor
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Perform checks across all fields
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            const isValid = field.validate(field.input.value);
            
            showFieldError(key, !isValid);
            if (!isValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Focus on first invalid input
            const firstInvalidInput = form.querySelector('.form-control.invalid');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }

            formMessage.style.display = 'block';
            formMessage.className = 'form-feedback-message error';
            formMessage.textContent = 'Please fill all fields marked with * correctly.';
            return;
        }


        // SEND DATA TO GOOGLE SHEETS
const patientData = {
    name: fields.name.input.value.trim(),
    mobile: fields.mobile.input.value.trim(),
    age: fields.age.input.value,
    gender: fields.gender.input.value,
    village: fields.village.input.value,
    date: fields.date.input.value
};

fetch("https://script.google.com/macros/s/AKfycbyi81gLRuYA5ayzzki9X5UULcr386vgsoDHCii5HDGaunoQfnFeN3Bv78cCliZkH3jP/exec", {
    method: "POST",
    body: JSON.stringify(patientData)
})
.catch(error => console.error(error));

        // Mock Submission Success (Demo Simulation)
        const patientName = fields.name.input.value.trim();
        const patientMobile = fields.mobile.input.value.trim();
        const tokenNumber = 'SPN-' + Math.floor(100 + Math.random() * 900); // Random demo token number

        formMessage.style.display = 'block';
        formMessage.className = 'form-feedback-message success';
        formMessage.innerHTML = `
            <strong>Booking Request Sent Successfully!</strong><br>
            <span style="font-size: 1.1rem; display: block; margin: 0.5rem 0;">
                Patient: <strong>${patientName}</strong><br>
                Demo Token Number: <strong style="color: var(--secondary-dark);">${tokenNumber}</strong>
            </span>
            A confirmation call will be sent to <strong>${patientMobile}</strong> by our clinic receptionist within 1 hour. Please bring your old reports during your visit.
        `;

        // Clear form elements
        form.reset();
        
        // Remove valid/invalid borders
        Object.keys(fields).forEach(key => {
            fields[key].input.classList.remove('invalid');
        });

        // Scroll to form message alert box smoothly
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

});
