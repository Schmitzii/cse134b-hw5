const form = document.querySelector("form");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const commentsField = document.getElementById("comments");
const formErrorsField = document.getElementById("form-errors")
const errorOutput = document.querySelector('output[name="errors"]');
const infoOutput = document.querySelector('output[name="information"]');
const form_errors = [];


const allowedPatterns = {
    name: /^[A-Za-z\s'-]*$/, // letters, spaces, hyphens, apostrophes
    email: /^[A-Za-z0-9@._-]*$/,
    comments: /^[A-Za-z0-9 .,!?'"()\-]*$/ // letters, numbers, punctuation
};

nameField.addEventListener("input", () => {
    nameField.setCustomValidity("");

    if (!nameField.checkValidity()) {
        if (nameField.validity.valueMissing) {
            nameField.setCustomValidity("Please enter your name");
        } else {
            nameField.setCustomValidity("Invalid name.");
        }
    }
});

emailField.addEventListener("input", () => {
    emailField.setCustomValidity("");

    if (!emailField.checkValidity()) {
        if (emailField.validity.valueMissing) {
            emailField.setCustomValidity("Please enter your email address.");
        } else if (emailField.validity.typeMismatch) {
            emailField.setCustomValidity("Please enter a valid email address (e.g., name@example.com).");
        } else {
            emailField.setCustomValidity("Invalid email format.");
        }
    }
});

commentsField.addEventListener("input", () => {
    commentsField.setCustomValidity("");

    if (!commentsField.checkValidity()) {
        if (commentsField.validity.valueMissing) {
            commentsField.setCustomValidity("Please enter comment(s).");
        } else {
            commentsField.setCustomValidity("Invalid comment(s).");
        }
    }
});

function showTemporaryError(message, field) {
    errorOutput.textContent = message;
    errorOutput.style.opacity = 1;
    field.classList.add("flash");

    setTimeout(() => {
        errorOutput.style.opacity = 0;
        field.classList.remove("flash");
    }, 2000);
}

function addMasking(field, pattern, fieldName) {
    field.addEventListener("input", (event) => {
        if (!pattern.test(field.value)) {
            // Remove last illegal character
            char = field.value.slice(-1);
            field.value = field.value.slice(0, -1);

            // Flash + show error
            showTemporaryError(`Illegal character typed in ${fieldName} field.`, field);
        }
    });
}

// Add masking to name and comments
addMasking(nameField, allowedPatterns.name, "name");
addMasking(emailField, allowedPatterns.email, "email");
addMasking(commentsField, allowedPatterns.comments, "comments");

const maxChars = commentsField.getAttribute("maxlength") || 300;

function updateCharCount() {
    const remaining = maxChars - commentsField.value.length;
    infoOutput.textContent = `${remaining} characters remaining`;

    infoOutput.classList.remove("warning", "error");

    if (remaining <= 30 && remaining > 0) {
        infoOutput.classList.add("warning");
    }

    if (remaining <= 0) {
        infoOutput.classList.add("error")
        commentsField.setCustomValidity("Character limit reached!");
        commentsField.reportValidity();
        form_errors.push({
            field: "comments",
            type: "max_length_exceeded",
            value: commentsField.value.length,
            time: new Date().toISOString()
        });
        commentsField.value = commentsField.value.slice(0, maxChars);
        showTemporaryError("You reached the maximum character limit!", commentsField);
    }
}

commentsField.addEventListener("input", updateCharCount);

form.addEventListener("submit", (e) => {
    console.log("HELLO WORLD")
    formErrorsField.value = JSON.stringify(form_errors);

    if (!form.checkValidity()) {
        console.log("Form not valid.");
        e.preventDefault();

        for (const field of [nameField, emailField, commentsField]) {
            if (!field.checkValidity()) {
                form_errors.push({
                    field: field.name,
                    type: "validation_error",
                    value: field.value,
                    time: new Date().toISOString()
                });

                field.reportValidity();
            }
        }

        formErrorsField.value = JSON.stringify(form_errors);
    }
});



