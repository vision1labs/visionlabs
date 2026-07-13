document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Grab all the necessary elements from the HTML ---
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    
    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // --- 2. Real-time Email Validation ---
    emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        // If empty OR valid, remove error
        if (val === '' || emailRegex.test(val)) {
            emailInput.classList.remove('input-error');
            emailError.style.display = 'none';
        }
    });

    // --- 3. Handle "Send Inquiry" Button ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from scrolling/reloading

        // Validate Email (ONLY if they actually typed something)
        const emailValue = emailInput.value.trim();
        if (emailValue !== '' && !emailRegex.test(emailValue)) {
            emailInput.classList.add('input-error');
            emailError.style.display = 'block';
            emailInput.focus();
            return; // Stop submission if email is typed but invalid
        }

        // UI Loading State
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Prepare Data for EmailJS
        const templateParams = {
            name: document.getElementById('name').value,
            email: emailValue || 'Not Provided (WhatsApp)', 
            project: document.getElementById('project').value,
            message: document.getElementById('message').value,
            customer_name: document.getElementById('name').value,
            project_idea: document.getElementById('project').value || document.getElementById('message').value,
            business_email: 'visionlabs.tech@gmail.com', 
            website_url: 'https://visionlabs.co.in' 
        };

        try {
            // Send Emails (Only if email was provided)
            if (emailValue !== '') {
                await emailjs.send("service_ed5ldf7", "template_wx5az47", templateParams);
                await emailjs.send("service_ed5ldf7", "template_fwy6ijf", templateParams);
            }

            // Show Success Popup & Reset Form
            successModal.classList.add('active');
            form.reset();
            submitBtn.innerText = 'Send Inquiry';
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Email sending failed:', error);
            submitBtn.innerText = 'Failed. Try Again.';
            submitBtn.style.background = '#ff4d4d'; 
            
            setTimeout(() => {
                submitBtn.innerText = 'Send Inquiry';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // --- WhatsApp Auto-Message ---
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            // 1. Get the VALUES from the form
            const name = document.getElementById('name').value || 'Not Provided';
            const email = document.getElementById('email').value || 'Not Provided';
            const project = document.getElementById('project').value || 'Not Specified';
            const message = document.getElementById('message').value || 'No additional details provided.';
            
            // 2. Your WhatsApp number with country code (91 for India)
            const phoneNumber = '917093501538'; 
            
            // 3. Your custom professional message (Using backticks ` and ${} variables)
            const text = `Hello VisionLabs Team,

I recently came across your website and would like to discuss a project that I am interested in developing.

━━━━━━━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Email: ${email}

━━━━━━━━━━━━━━━━━━━━━━
PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Project Title:
${project}

Project Description:
${message}

━━━━━━━━━━━━━━━━━━━━━━
REQUEST
━━━━━━━━━━━━━━━━━━━━━━
I would appreciate it if your team could review my project requirements and provide guidance regarding:

• Technical feasibility
• Recommended approach or improvements
• Estimated development timeline
• Approximate quotation (if applicable)

If any additional information is required, please let me know and I will be happy to provide it.

Thank you for your time and consideration. I look forward to hearing from the VisionLabs team.

Kind regards,

${name}`;
            
            // 4. Encode and open WhatsApp
            const encodedText = encodeURIComponent(text);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedText}`;
            
            window.open(whatsappURL, '_blank');
        });
    }
});