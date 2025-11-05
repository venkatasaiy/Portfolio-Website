// Cinematic loader
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    // Show loader for 2.5 seconds then fade out
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2500);
    
    // Notification system
    function showNotification(title, message, type = 'success') {
        const container = document.getElementById('notifications-container');
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
                <button class="notification-close">
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
        closeBtn.addEventListener('click', removeNotification);
        
        // Auto-dismiss after 5 seconds
        setTimeout(removeNotification, 5000);
    }
    
    // Download the actual resume PDF from assets folder
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
    
    // Generate a demo PDF as fallback
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
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if(window.getComputedStyle(navLinks).display === 'block') {
                    navLinks.style.display = 'none';
                }
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Scroll top button
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if(window.pageYOffset > 400) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    mobileToggle.addEventListener('click', () => {
        if(window.getComputedStyle(navLinks).display === 'none') {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });
    
    // Resume download functionality
    document.getElementById('downloadResume').addEventListener('click', downloadResume);
    document.getElementById('footerResume').addEventListener('click', (e) => {
        e.preventDefault();
        downloadResume();
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 1000) {
                navLinks.style.display = 'none';
            }
        });
    });
    
    // Form submission with real functionality
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
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
                    // Button feedback
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.background = 'linear-gradient(90deg, var(--kalki-gold), var(--kalki-copper))';
                    
                    // Restore button after delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    const responseData = await response.json();
                    throw new Error(responseData.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Failed to Send', 'There was an error sending your message. Please try again later or contact me directly at venkatasaiyandeti@gmail.com', 'error');
                // Button feedback
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
                submitBtn.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)';
                
                // Restore button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Add scroll animations
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
    
    // Apply to sections
    document.querySelectorAll('.section-title, .section-subtitle, .project-card, .skill-card, .timeline-content, .education-card, .cert-card, .achievement-card').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Window resize handler for mobile menu
    window.addEventListener('resize', () => {
        if(window.innerWidth > 1000) {
            navLinks.style.display = 'flex';
        }
    });
    
    // Initial welcome notification
    setTimeout(() => {
        showNotification('Welcome!', 'Explore my portfolio to learn about my AI & ML projects and experience.', 'info');
    }, 3000);
    
    // Set initial scroll top button state
    if(window.pageYOffset > 400) {
        scrollTopBtn.classList.add('active');
    }
});