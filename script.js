document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavigation();
    initScrollTop();
    initMobileMenu();
    initFormSubmission();
    initScrollAnimations();
    initResumeDownload();
    initSplineLazyLoad();
    initKonamiCode();
    
    // Show welcome notification after page loads
    setTimeout(showWelcomeNotification, 3000);
});

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    // Show loader for 2.5 seconds then fade out
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2500);
}

function initNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update aria-current attribute
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.removeAttribute('aria-current');
                });
                this.setAttribute('aria-current', 'page');
            }
        });
    });
}

function initScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if(window.pageYOffset > 400) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Update aria-expanded attribute
        const isExpanded = navLinks.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Keep this local resize listener to ensure menu closes if user manually resizes within component lifecycle
    window.addEventListener('resize', () => {
        if(window.innerWidth > 1000) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        const originalStyle = submitBtn.getAttribute('style') || '';
        
        // Disable button and show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                showNotification('Message Sent!', 'Your message has been successfully delivered. I will get back to you soon!', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Button success feedback
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = 'linear-gradient(90deg, var(--kalki-gold), var(--kalki-copper))';
                
                // Restore button after delay
                setTimeout(() => {
                    restoreButtonState(submitBtn, originalText, originalStyle);
                }, 3000);
            } else {
                const responseData = await response.json();
                throw new Error(responseData.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to Send', 'There was an error sending your message. Please try again later or contact me directly at venkatasaiyandeti@gmail.com', 'error');
            
            // Button error feedback
            submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
            submitBtn.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)';
            
            // Restore button after delay
            setTimeout(() => {
                restoreButtonState(submitBtn, originalText, originalStyle);
            }, 3000);
        }
    });
}

function restoreButtonState(button, originalText, originalStyle) {
    button.innerHTML = originalText;
    button.style.background = '';
    button.disabled = false;
    button.style.opacity = '';
    
    if (originalStyle) {
        button.setAttribute('style', originalStyle);
    } else {
        button.removeAttribute('style');
    }
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
    
    // Special handling for timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        // Add delay based on position
        item.style.transitionDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
        observer.observe(item);
    });
}

function initResumeDownload() {
    const downloadButtons = [
        document.getElementById('downloadResume'),
        document.getElementById('footerResume')
    ];
    
    downloadButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                downloadResume();
            });
        }
    });
}

function downloadResume() {
    // Create a link to the resume file in assets folder
    const link = document.createElement('a');
    link.href = './assets/Venkata_Sai_Yandeti_Resume.pdf';
    link.download = 'Venkata_Sai_Yandeti_Resume.pdf';
    document.body.appendChild(link);
    
    // Try to download the resume
    try {
        // First check if the file exists
        fetch(link.href, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists, proceed with download
                    link.click();
                    showNotification('Resume Downloaded', 'Your resume has been downloaded successfully!', 'success');
                } else {
                    // File doesn't exist, show error
                    throw new Error('Resume file not found');
                }
            })
            .catch(error => {
                console.error('Error downloading resume:', error);
                showNotification('Resume Not Found', 'File wasn\'t available on site. Please ensure your resume is in the assets folder.', 'error');
                // Fallback to demo PDF generation
                setTimeout(generateDemoPDF, 1000);
            })
            .finally(() => {
                // Cleanup
                document.body.removeChild(link);
            });
    } catch (error) {
        console.error('Error initiating download:', error);
        showNotification('Download Failed', 'An error occurred while downloading your resume.', 'error');
        // Fallback to demo PDF generation
        setTimeout(generateDemoPDF, 1000);
        // Cleanup
        document.body.removeChild(link);
    }
}

function generateDemoPDF() {
    // Base64 encoded minimal PDF file (just a text "Resume" for demo)
    const demoPdfBase64 = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFLKuZiYGLhYmBgYGRgZGRiZGJmYmFhYGRmYWJkZmRlY2JmYWFhZGZkYmRkZmVjZWFhY2FhY2VlY2NlY2VlZWVkYGBgYGFkYGRgZGRmZWdjY2dgZGVhY2JgZGNkAAB0LQgHCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago3MQplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDMgMCBSIC9SZXNvdXJjZXMgNiAwIFIgL0NvbnRlbnRzIDQgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdID4+CmVuZG9iago2IDAgb2JqCjw8IC9Qcm9jU2V0IFsgL1BERiAvVGV4dCBdIC9Db2xvclNwYWNlIDw8IC9DczEgNyAwIFIgPj4gL0ZvbnQgPDwgL1RUMSA4IDAgUiA+PiA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAyIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iago5IDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAzIDAgUiA+PgplbmRvYmoKNyAwIG9iago8PCAvVHlwZSAvQ29sb3JTcGFjZSAvQ29sb3JXYXkgMSAvQ29sb3JzIDEgPj4KZW5kb2JqCjggMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagoxIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9Db3VudCAxIC9LaWRzIFsgMiAwIFIgXSA+PgplbmRvYmoKMTAgMCBvYmoKPDwgL1Byb2R1Y2VyIChKYXZhU2NyaXB0KSAvQ3JlYXRpb25EYXRlIChEOjIwMjQwNTI1MTIzNDU2KzAwJzAwJykgL01vZERhdGUgKEQ6MjAyNDA1MjUxMjM0NTYrMDAnMDAnKSA+PgplbmRvYmoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDQ2OSAwMDAwMCBuIAowMDAwMDAwMjg5IDAwMDAwIG4gCjAwMDAwMDAzOTggMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMjcwIDAwMDAwIG4gCjAwMDAwMDAzMzEgMDAwMDAgbiAKMDAwMDAwMDU0NCAwMDAwMCBuIAowMDAwMDAwNTk3IDAwMDAwIG4gCjAwMDAwMDA0MzQgMDAwMDAgbiAKMDAwMDAwMDYzNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDExIC9Sb290IDkgMCBSIC9JbmZvIDEwIDAgUiAvSUQgWyA8NTQ3NWZhNjY4NTY5ODcyMzcwMjE0NjU1NWQ1NjcyZTQ+Cjw1NDc1ZmE2Njg1Njk4NzIzNzAyMTQ2NTU1ZDU2NzJlND4gXSA+PgpzdGFydHhyZWYKNzQ1CiUlRU9GCg==';
    
    // Create a blob from the base64 string
    const byteCharacters = atob(demoPdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const demoLink = document.createElement('a');
    demoLink.href = url;
    demoLink.download = 'Venkata_Sai_Yandeti_Resume_Demo.pdf';
    document.body.appendChild(demoLink);
    demoLink.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(demoLink);
        URL.revokeObjectURL(url);
    }, 100);
    
    showNotification('Demo Resume Downloaded', 'A demo resume has been downloaded. For your actual resume, please ensure it\'s in the assets folder.', 'info');
}

function initSplineLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const viewer = document.querySelector('spline-viewer');
                if (!viewer.getAttribute('url')) {
                    viewer.setAttribute('url', 'https://prod.spline.design/qV6sZJZv0k5qkF4B/scene.splinecode');
                }
                observer.unobserve(entry.target);
            }
        });
    });
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        observer.observe(heroVisual);
    }
}

function initKonamiCode() {
    let keys = [];
    const secret = '38,38,40,40,37,39,37,39,66,65'; // Up Up Down Down Left Right Left Right B A
    document.addEventListener('keydown', e => {
        keys.push(e.keyCode);
        if (keys.length > secret.split(',').length) {
            keys.shift();
        }
        if (keys.toString().indexOf(secret) >= 0) {
            document.body.style.filter = 'hue-rotate(180deg) brightness(1.3)';
            showNotification('KALKI MODE ACTIVATED', 'You found the secret. Now go conquer.', 'success');
            keys = [];
        }
    });
}

function showNotification(title, message, type = 'success') {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-card ${type}`;
    
    // Set icon based on type
    let icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'info') icon = 'fas fa-info-circle';
    
    // Build notification content
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${icon}"></i>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    const removeNotification = () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                container.removeChild(notification);
            }
        }, 300);
    };
    
    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', removeNotification);
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(removeNotification, 5000);
}

function showWelcomeNotification() {
    showNotification('Welcome!', 'Explore my portfolio to learn about my AI & ML projects and experience.', 'info');
}

/* ===== orientation & responsive helpers (appended) =====
   This IIFE handles:
   - closing mobile menu on orientation change
   - forcing a short reflow/repaint after orientation changes on some browsers
   - debounced resize handling to keep nav/mobile state consistent across breakpoints
   - also re-checks scroll-top button visibility on resize
*/
(function() {
  // Close mobile nav on orientation change to avoid stuck open menu
  window.addEventListener('orientationchange', function() {
    try { closeMobileMenu(); } catch(e) { /* graceful fallback if function missing */ }
    // On some mobile browsers dimensions change after orientation; force a short reflow/repaint
    setTimeout(() => { 
      document.body.style.display = 'none'; 
      // reading offsetHeight forces reflow
      document.body.offsetHeight; 
      document.body.style.display = ''; 
    }, 120);
  });

  // When window resizes quickly (desktop/devices), ensure nav state is consistent
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-check scroll-top button visibility after resize
      const scrollTopBtn = document.getElementById('scroll-top');
      if (scrollTopBtn) {
        if (window.pageYOffset > 400) {
          scrollTopBtn.classList.add('active');
        } else {
          scrollTopBtn.classList.remove('active');
        }
      }

      if (window.innerWidth > 1000) {
        try { closeMobileMenu(); } catch(e) {}
      }
    }, 150);
  });
})();
