document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
  
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Basic validation for required fields
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
  
      if (!fullName || !email || !subject || !message) {
        formFeedback.textContent = 'Please fill in all required fields.';
        formFeedback.classList.remove('text-success');
        formFeedback.classList.add('text-danger');
        formFeedback.classList.remove('d-none');
        return;
      }
  
      // Simulate successful form submission
      formFeedback.textContent = 'Thank you for your message! We will get back to you soon.';
      formFeedback.classList.remove('d-none', 'text-danger');
      formFeedback.classList.add('text-success');
  
      // Clear form fields
      contactForm.reset();
  
      // Optionally hide the feedback message after 5 seconds
      setTimeout(() => {
        formFeedback.classList.add('d-none');
      }, 5000);
    });
  });
  