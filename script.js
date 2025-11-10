document.addEventListener('DOMContentLoaded', () => {

    const passwordDisplay = document.getElementById('passwordDisplay');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const refreshButton = document.getElementById('refreshButton');
    const copyButton = document.getElementById('copyButton');
    const checkUppercase = document.getElementById('checkUppercase');
    const checkLowercase = document.getElementById('checkLowercase');
    const checkNumbers = document.getElementById('checkNumbers');
    const checkSymbols = document.getElementById('checkSymbols');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const copyToastElement = document.getElementById('copyToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(copyToastElement);
    
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?~';

    function randomChar(chars) {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function shufflePassword(pass) {
        return pass.split('').sort(() => Math.random() - 0.5).join('');
    }
 
    function generatePassword() {
        let length = lengthSlider.value;
        let useUpper = checkUppercase.checked;
        let useLower = checkLowercase.checked;
        let useNumber = checkNumbers.checked;
        let useSymbol = checkSymbols.checked;

        let selectedCount = [useUpper, useLower, useNumber, useSymbol].filter(Boolean).length;

        if (selectedCount === 0) {
            passwordDisplay.value = '';
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Select at least one type!';
            return;
        }

        let perType = Math.floor(length / selectedCount);
        let remaining = length;
        let password = '';

        if (useUpper) {
            for (let i = 0; i < perType; i++) password += randomChar(upper);
            remaining -= perType;
        }
        if (useLower) {
            for (let i = 0; i < perType; i++) password += randomChar(lower);
            remaining -= perType;
        }
        if (useNumber) {
            for (let i = 0; i < perType; i++) password += randomChar(numbers);
            remaining -= perType;
        }
        if (useSymbol) {
            for (let i = 0; i < perType; i++) password += randomChar(symbols);
            remaining -= perType;
        }

        let allChars = '';
        if (useUpper) allChars += upper;
        if (useLower) allChars += lower;
        if (useNumber) allChars += numbers;
        if (useSymbol) allChars += symbols;

        for (let i = 0; i < remaining; i++) {
            password += randomChar(allChars);
        }

        password = shufflePassword(password);

        passwordDisplay.value = password;
        lengthDisplay.textContent = length;

        updateStrength(password);
    }

    function updateStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        let percent = (strength / 5) * 100;

        if (percent <= 40) {
            strengthBar.className = 'progress-bar bg-danger';
            strengthText.textContent = 'Weak';
        } else if (percent <= 70) {
            strengthBar.className = 'progress-bar bg-warning';
            strengthText.textContent = 'Medium';
        } else {
            strengthBar.className = 'progress-bar bg-success';
            strengthText.textContent = 'Strong';
        }

        strengthBar.style.width = percent + '%';
    }

    function copyPassword() {
        if (passwordDisplay.value === '') return;

        navigator.clipboard.writeText(passwordDisplay.value);

        copyButton.textContent = 'Copied!';
        // copyMessage.classList.remove('d-none');

        toastBootstrap.show();

        setTimeout(() => {
            copyButton.textContent = 'Copy';
            // copyMessage.classList.add('d-none');
        }, 3000);
    }

    lengthSlider.addEventListener('input', generatePassword);
    refreshButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
    checkUppercase.addEventListener('change', generatePassword);
    checkLowercase.addEventListener('change', generatePassword);
    checkNumbers.addEventListener('change', generatePassword);
    checkSymbols.addEventListener('change', generatePassword);

    generatePassword();
});
