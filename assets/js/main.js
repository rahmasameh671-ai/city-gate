/**
 * CITY GATE NEW CAIRO — BY PROPERTIES-Z.COM
 * JavaScript Logic & Routing (Cleaned Up & Streamlined)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Form Lead Routing & Submission to Zapier Webhook
  const leadForm = document.getElementById('leadCaptureForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalLeadName = document.getElementById('modalLeadName');

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

      // Grabbing form data PLUS background data for Zapier
      const data = {
        fullName: fullName,
        phoneNumber: fullPhoneNumber,
        landingPageUrl: window.location.href,
        submissionDate: new Date().toISOString(),
        project: 'City Gate New Cairo',
        agency: 'properties-z.com'
      };

      try {
        await fetch('https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        // Store backup copy locally
        const storedLeads = JSON.parse(localStorage.getItem('properties_z_citygate_leads') || '[]');
        storedLeads.push(data);
        localStorage.setItem('properties_z_citygate_leads', JSON.stringify(storedLeads));

        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }

        // Trigger Google Analytics Lead Conversion Event
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            event_category: 'lead_form',
            event_label: 'City Gate Inquiry',
            value: 1
          });
        }

        // Show Success Modal
        successModal?.classList.add('active');
        leadForm.reset();

      } catch (error) {
        console.error('Error submitting to Zapier webhook:', error);

        // Fallback store locally and still show success so the lead is preserved
        const storedLeads = JSON.parse(localStorage.getItem('properties_z_citygate_leads') || '[]');
        storedLeads.push(data);
        localStorage.setItem('properties_z_citygate_leads', JSON.stringify(storedLeads));

        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }
        successModal?.classList.add('active');
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
