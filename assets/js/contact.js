// ---------------------- CONTACT FROM -------------------
document.addEventListener("DOMContentLoaded", function () {
    const form       = document.getElementById("ecoContactForm");
    const submitBtn  = form ? form.querySelector(".contact-btn") : null;

    const modal      = document.getElementById("contactModal");
    const modalDialog = modal ? modal.querySelector(".contact-modal-dialog") : null;
    const modalIcon  = modal ? modal.querySelector(".contact-modal-icon ion-icon") : null;
    const modalTitle = modal ? document.getElementById("contactModalTitle") : null;
    const modalText  = modal ? document.getElementById("contactModalText") : null;
    const modalClose = modal ? modal.querySelector(".contact-modal-close") : null;
    const modalBackdrop = modal ? modal.querySelector(".contact-modal-backdrop") : null;

    if (!form || !submitBtn || !modal || !modalDialog || !modalTitle || !modalText || !modalClose) return;

    const fields = {
        fullName: form.fullName,
        email: form.email,
        subject: form.subject,
        message: form.message
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function clearFieldErrors() {
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (!field) return;

            field.classList.remove("input-error");

            const errorEl = form.querySelector(`.field-error[data-for="${key}"]`);
            if (errorEl) {
                errorEl.textContent = "";
            }
        });
    }

    function setFieldError(key, message) {
        const field = fields[key];
        if (!field) return;

        field.classList.add("input-error");

        const errorEl = form.querySelector(`.field-error[data-for="${key}"]`);
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function validateForm() {
        clearFieldErrors();
        let hasError = false;

        // Name
        if (!fields.fullName.value.trim()) {
            setFieldError("fullName", "Please enter your full name.");
            hasError = true;
        }

        // Email
        const emailVal = fields.email.value.trim();
        if (!emailVal) {
            setFieldError("email", "Please enter your email address.");
            hasError = true;
        } else if (!emailPattern.test(emailVal)) {
            setFieldError("email", "Please enter a valid email address.");
            hasError = true;
        }

        // Subject
        if (!fields.subject.value.trim()) {
            setFieldError("subject", "Please enter a subject.");
            hasError = true;
        }

        // Message
        if (!fields.message.value.trim()) {
            setFieldError("message", "Please write your message.");
            hasError = true;
        }

        return !hasError;
    }

    function showContactModal(type, title, message) {
        modalDialog.classList.remove("error");

        if (type === "error") {
            modalDialog.classList.add("error");
            if (modalIcon) {
                modalIcon.setAttribute("name", "close-circle-outline");
            }
        } else {
            if (modalIcon) {
                modalIcon.setAttribute("name", "checkmark-circle-outline");
            }
        }

        modalTitle.textContent = title;
        modalText.textContent = message;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
    }

    function hideContactModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }

    modalClose.addEventListener("click", hideContactModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", hideContactModal);
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            hideContactModal();
        }
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!validateForm()) {
            showContactModal(
                "error",
                "Please Check the Form",
                "Some required fields are missing or invalid. Please fix the highlighted fields and try again."
            );
            return;
        }

        const formData = {
            fullName: fields.fullName.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim(),
            createdAt: new Date().toISOString()
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            // ==============================
            // FUTURE: FIREBASE INTEGRATION
            // ==============================
            await new Promise(resolve => setTimeout(resolve, 700));

            showContactModal(
                "success",
                "Message Sent",
                "Thank you! Your message has been sent successfully. Our team will reach out soon."
            );

            form.reset();
            clearFieldErrors();
        } catch (err) {
            console.error("Contact form error:", err);
            showContactModal(
                "error",
                "Something Went Wrong",
                "We couldn’t send your message right now. Please try again in a moment."
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
});
