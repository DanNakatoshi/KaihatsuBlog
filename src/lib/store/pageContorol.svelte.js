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
