document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. PRELOADER
    // =========================================
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500); // Small timeout for smooth experience
    });

    // Fallback if window load event doesn't fire quickly
    setTimeout(() => {
        if (preloader.style.visibility !== 'hidden') {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 2000);

    // =========================================
    // 2. MOBILE HAMBURGER MENU
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // =========================================
    // 3. STICKY NAVBAR, SCROLL SPY, & PREMIUM UTILITIES
    // =========================================
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Sticky Navbar state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress indicator
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
            const scrollPercentage = (window.scrollY / scrollHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${scrollPercentage}%`;
            }
        }

        // Back to top visibility toggle
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        // Scroll Spy (Active nav item mapping)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    // Back-to-Top click handler
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // 4. TYPING EFFECT (HERO SECTION)
    // =========================================
    const typingText = document.querySelector('.typing-text');
    const words = ["Web Developer", "Full Stack Developer", "Problem Solver", "Database Designer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const eraseSpeed = 50;
    const delayBetweenWords = 2000;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add character
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            // Word completed, pause before starting deletion
            currentSpeed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word deleted, move to the next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = 500; // Small pause before typing next word
        }

        setTimeout(typeEffect, currentSpeed);
    }

    // Initialize typing effect
    if (typingText) {
        setTimeout(typeEffect, 1000);
    }

    // =========================================
    // 5. INTERSECTION OBSERVER (ANIMATE ON SCROLL)
    // =========================================
    const hiddenElements = document.querySelectorAll('.hidden');

    const observerOptions = {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset for better feel
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Unobserve once shown to prevent refiring on scroll up/down
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    hiddenElements.forEach(el => revealOnScroll.observe(el));

    // =========================================
    // 6. CONTACT FORM VALIDATION & SUBMISSION
    // =========================================
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMsg = document.getElementById('successMsg');

    // Helper functions for showing/hiding validation errors
    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error-msg');
        
        if (errorDisplay) {
            errorDisplay.textContent = message;
        }
        inputControl.classList.add('error');
    };

    const setSuccess = (element) => {
        const inputControl = element.parentElement;
        inputControl.classList.remove('error');
    };

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateInputs = () => {
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const messageValue = messageInput.value.trim();
        let isValid = true;

        if (nameValue === '') {
            setError(nameInput, 'Name is required');
            isValid = false;
        } else {
            setSuccess(nameInput);
        }

        if (emailValue === '') {
            setError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(emailInput, 'Provide a valid email address');
            isValid = false;
        } else {
            setSuccess(emailInput);
        }

        if (messageValue === '') {
            setError(messageInput, 'Message is required');
            isValid = false;
        } else {
            setSuccess(messageInput);
        }

        return isValid;
    };

    // Handle Form Submit Event
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateInputs()) {
            // Simulate form submission (e.g., via Fetch API)
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Show success message
                successMsg.classList.add('show');
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }, 1500);
        }
    });

    // Real-time validation listeners to remove error status on type
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            setSuccess(nameInput);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value.trim())) {
            setSuccess(emailInput);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            setSuccess(messageInput);
        }
    });
});
