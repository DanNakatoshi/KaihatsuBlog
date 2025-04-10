let Viewer;

export async function initPano360(root = document) {
	if (typeof window === 'undefined') return;

	if (!Viewer) {
		const module = await import('@photo-sphere-viewer/core');
		Viewer = module.Viewer;
		await import('@photo-sphere-viewer/core/index.css');
	}

	const figures = root.querySelectorAll('figure.pano-360');

	figures.forEach((figure) => {
		const img = figure.querySelector('img');
		if (!img) return;

		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.className = 'pano-360';
		wrapper.style.width = '100%';
		wrapper.style.aspectRatio = '2 / 1';
		wrapper.style.maxHeight = '80vh';
		wrapper.style.background = '#000';
		wrapper.style.overflow = 'hidden';
		wrapper.style.position = 'relative';

		figure.replaceWith(wrapper);

		// Create overlay with Japanese text
		const overlay = document.createElement('div');
		overlay.className = 'pano-overlay';
		overlay.textContent = 'クリックして画像を動かそう';
		wrapper.appendChild(overlay);

		// Inject styles once
		if (!document.getElementById('pano-style')) {
			const style = document.createElement('style');
			style.id = 'pano-style';
			style.textContent = `
				.pano-360 canvas {
					display: block;
					width: 100% !important;
					height: 100% !important;
				}
				.pano-overlay {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-size: 1rem;
					color: white;
					background: rgba(0, 0, 0, 0.5);
					padding: 0.5rem 1rem;
					border-radius: 9999px;
					backdrop-filter: blur(4px);
					pointer-events: none;
					user-select: none;
					z-index: 10;
					font-weight: 500;
					transition: opacity 0.4s ease;
				}
				.pano-overlay.fade-out {
					opacity: 0;
				}
			`;
			document.head.appendChild(style);
		}

		// Init viewer
		const viewer = new Viewer({
			container: wrapper,
			panorama: img.src,
			navbar: false,
			defaultYaw: '130deg',
			maxFov: 120,
			minFov: 30,
			mousewheel: true,
			touchmoveTwoFingers: true
		});

		// viewer.startAutoRotate(1.2);

		// Hide the overlay on first click or tap
		function hideOverlay() {
			overlay.classList.add('fade-out');
			setTimeout(() => overlay.remove(), 400);
			viewer.container.removeEventListener('click', hideOverlay);
			viewer.container.removeEventListener('touchstart', hideOverlay);
		}
		viewer.container.addEventListener('click', hideOverlay);
		viewer.container.addEventListener('touchstart', hideOverlay);

		// Resize handling
		const resizeObserver = new ResizeObserver(() => {
			viewer.autoSize();
		});
		resizeObserver.observe(wrapper);
	});
}
