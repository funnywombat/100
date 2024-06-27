const tg = window.Telegram.WebApp;


export function useTelegram() {
    

    const onClose = () => {
        tg.close()
    }



    return {
        backButton: tg.BackButton,
        settings_button: tg.SettingsButton,
        tg,
        onClose,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
        langCode: tg.initDataUnsafe?.user?.language_code,
        startParam: tg.initDataUnsafe?.start_param,
        initData: tg.initData,
        colorScheme: tg.colorScheme,
        storage: tg.CloudStorage,
        themeParams: tg.themeParams,

    }
}