function createThemeData() {
    const themeData = $state(localStorage.getItem('theme') || 'light');

    return {
        get themeData() {
            return themeData;
        },
        toggleTheme() {
            themeData.value = themeData.value === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', themeData.value);
            document.documentElement.classList.toggle('dark', themeData.value === 'dark');
        },
    };
}

export const themeMgr = createThemeData();
