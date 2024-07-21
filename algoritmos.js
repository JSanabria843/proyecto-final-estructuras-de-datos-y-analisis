document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const codeBlock = this.nextElementSibling;
            if (codeBlock.style.display === 'block') {
                codeBlock.style.display = 'none';
                this.textContent = this.textContent.replace('Ocultar', 'Mostrar');
            } else {
                codeBlock.style.display = 'block';
                this.textContent = this.textContent.replace('Mostrar', 'Ocultar');
            }
        });
    });
});
