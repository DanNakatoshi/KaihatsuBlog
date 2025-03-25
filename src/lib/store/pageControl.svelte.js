function createPrivacyDrawerManager() {
	// Use $state for reactivity
	const state = $state({
		isDrawerOpen: false
	});

	return {
		get isDrawerOpen() {
			return state.isDrawerOpen;
		},
		setDrawerState(newState) {
			state.isDrawerOpen = newState;
		},
		toggleDrawer() {
			state.isDrawerOpen = !state.isDrawerOpen;
		}
	};
}

export const privacyDrawerManager = createPrivacyDrawerManager();


let _isModalOpen = $state(false);

function createLoginModalManager() {
	return {
		get isModalOpen() {
			return _isModalOpen;
		},
		set isModalOpen(val) {
			_isModalOpen = val;
		},
		open() {
			_isModalOpen = true;
		},
		close() {
			_isModalOpen = false;
		},
		toggle() {
			_isModalOpen = !_isModalOpen;
		}
	};
}

export const loginModalManager = createLoginModalManager();
