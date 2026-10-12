/**
 * CITY GATE NEW CAIRO — BY PROPERTIES-Z.COM
 * JavaScript Logic & Routing (Cleaned Up & Streamlined)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Form Lead Routing & Submission (Name & Phone ONLY)
  const leadForm = document.getElementById('leadCaptureForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalWaBtn = document.getElementById('modalWaBtn');
  const modalLeadName = document.getElementById('modalLeadName');

  // Lead Destinations:
  // Rahma@irtkaz.com
  // Mostafa.a.ashmawy@gmail.com
  // Mostafa.ashmawy@irtkaz.com

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const countryCode = document.getElementById('countryCode')?.value || '+20';
      const rawPhone = document.getElementById('phoneNumber')?.value.trim();

      if (!fullName) {
        alert('Please enter your full name.');
        return;
      }
      if (!rawPhone) {
        alert('Please enter your phone number.');
        return;
      }

      const fullPhoneNumber = `${countryCode} ${rawPhone}`;

      // Disable button and show sending state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'SUBMITTING...';

      const payload = {
        name: fullName,
        phone: fullPhoneNumber,
        country_code: countryCode,
        project: 'City Gate New Cairo',
        agency: 'properties-z.com',
        _subject: `New Lead: ${fullName} - City Gate New Cairo - properties-z.com`,
        _cc: 'Mostafa.a.ashmawy@gmail.com,Mostafa.ashmawy@irtkaz.com',
        timestamp: new Date().toISOString()
      };

      try {
        // Secure Lead Routing via AJAX endpoint
        await fetch('https://formsubmit.co/ajax/Rahma@irtkaz.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Store backup copy locally
        const storedLeads = JSON.parse(localStorage.getItem('properties_z_citygate_leads') || '[]');
        storedLeads.push(payload);
        localStorage.setItem('properties_z_citygate_leads', JSON.stringify(storedLeads));

        // Prepare WhatsApp follow-up button in modal
        const waText = encodeURIComponent(
          `Hello properties-z.com, my name is ${fullName}. I just registered my interest for City Gate New Cairo. Please send me pricing, availability, and the brochure.`
        );
        modalWaBtn.href = `https://wa.me/201033373331?text=${waText}`;
        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }

        // Show Success Modal
        successModal.classList.add('active');
        leadForm.reset();

      } catch (err) {
        console.warn('Form routing fallback triggered:', err);
        // Fallback store and show modal
        const storedLeads = JSON.parse(localStorage.getItem('properties_z_citygate_leads') || '[]');
        storedLeads.push(payload);
        localStorage.setItem('properties_z_citygate_leads', JSON.stringify(storedLeads));

        const waText = encodeURIComponent(
          `Hello properties-z.com, my name is ${fullName}. I am submitting an inquiry for City Gate New Cairo (+201033373331).`
        );
        modalWaBtn.href = `https://wa.me/201033373331?text=${waText}`;
        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }
        successModal.classList.add('active');
        leadForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Close Modal
  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
