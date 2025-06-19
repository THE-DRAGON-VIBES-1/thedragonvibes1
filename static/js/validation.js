// Real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select');
    
    // Email validation regex
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    
    // Brazilian phone validation regex
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    
    // Name validation regex (only letters and spaces)
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    
    // Phone mask function
    function maskPhone(value) {
        // Remove all non-digits
        value = value.replace(/\D/g, '');
        
        // Apply mask based on length
        if (value.length <= 2) {
            return value;
        } else if (value.length <= 6) {
            return `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length <= 10) {
            return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else {
            return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }
    
    // Real-time validation functions
    function validateName(input) {
        const value = input.value.trim();
        const isValid = value.length >= 2 && nameRegex.test(value);
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else if (value.length > 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-valid', 'is-invalid');
        }
        
        return isValid;
    }
    
    function validateEmail(input) {
        const value = input.value.trim();
        const isValid = emailRegex.test(value);
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else if (value.length > 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-valid', 'is-invalid');
        }
        
        return isValid;
    }
    
    function validatePhone(input) {
        const value = input.value.trim();
        const isValid = phoneRegex.test(value);
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else if (value.length > 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-valid', 'is-invalid');
        }
        
        return isValid;
    }
    
    function validateSelect(input) {
        const isValid = input.value !== '';
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        
        return isValid;
    }
    
    // Add event listeners
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const interesseSelect = document.getElementById('interesse');
    
    // Name validation
    nomeInput.addEventListener('blur', function() {
        validateName(this);
    });
    
    nomeInput.addEventListener('input', function() {
        // Remove invalid characters in real-time
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
        if (this.value.length >= 2) {
            validateName(this);
        }
    });
    
    // Email validation
    emailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
    
    emailInput.addEventListener('input', function() {
        if (this.value.length > 5) {
            validateEmail(this);
        }
    });
    
    // Phone validation and masking
    telefoneInput.addEventListener('input', function() {
        this.value = maskPhone(this.value);
        if (this.value.length >= 10) {
            validatePhone(this);
        }
    });
    
    telefoneInput.addEventListener('blur', function() {
        validatePhone(this);
    });
    
    // Interest validation
    interesseSelect.addEventListener('change', function() {
        validateSelect(this);
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        let isFormValid = true;
        
        // Validate all fields
        if (!validateName(nomeInput)) {
            isFormValid = false;
        }
        
        if (!validateEmail(emailInput)) {
            isFormValid = false;
        }
        
        if (!validatePhone(telefoneInput)) {
            isFormValid = false;
        }
        
        if (!validateSelect(interesseSelect)) {
            isFormValid = false;
        }
        
        if (!isFormValid) {
            e.preventDefault();
            
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Show error message
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger alert-dismissible fade show';
            errorAlert.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                Por favor, corrija os erros no formulário antes de enviar.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            form.insertBefore(errorAlert, form.firstChild);
            
            // Auto-remove error after 5 seconds
            setTimeout(() => {
                if (errorAlert.parentNode) {
                    errorAlert.remove();
                }
            }, 5000);
        }
    });
    
    // Remove existing alerts when user starts typing
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const existingAlert = form.querySelector('.alert-danger');
            if (existingAlert) {
                existingAlert.remove();
            }
        });
    });
});
