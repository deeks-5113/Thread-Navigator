
// Magnifying Glass Effect
const imgWrapper = document.querySelector('.image-wrapper');
const img = document.querySelector('.explain-img');

if (imgWrapper && img) {
    // Create lens
    const lens = document.createElement('div');
    lens.classList.add('magnifier-lens');
    imgWrapper.appendChild(lens);

    const zoomRatio = 3; // How much to zoom

    imgWrapper.addEventListener('mousemove', (e) => {
        const rect = imgWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Lens dimensions
        const lensW = lens.offsetWidth;
        const lensH = lens.offsetHeight;

        // Move lens (centered on cursor)
        // Ensure lens doesn't go outside is mainly handled by overflow:hidden on wrapper, 
        // but we can clamp center pos if we want lens fully visible. 
        // For now, let it be clipped at edges for standard feel.
        lens.style.left = `${x - lensW / 2}px`;
        lens.style.top = `${y - lensH / 2}px`;

        // Calculate background position
        // bgPos = - (cursorPos * zoom - lensSize / 2)
        // We need the background image to be a scaled version of the main image
        lens.style.backgroundImage = `url('${img.src}')`;
        lens.style.backgroundSize = `${img.width * zoomRatio}px ${img.height * zoomRatio}px`;

        const bgX = (x * zoomRatio) - (lensW / 2);
        const bgY = (y * zoomRatio) - (lensH / 2);

        lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    });

    // Ensure background image is loaded/updated if src changes (static here so ok)
}
