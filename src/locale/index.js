import LocalizedStrings from 'react-native-localization';

export let locale = new LocalizedStrings({
    en: {
        language: "Ru",
        enter: "Login",
        email: "Email",
        password: "Password",
        button: "Login",
        signInErrorInput: "Enter your login details!",
        signInErrorEmail: "There is no user with mentioned e-mail!",
        signInErrorPassword: "Password does not match e-mail!",
        works: "WORKS",
        notWorking: "NOT WORKING",
        recordStart: "Zoomia started recording a call",
        recordStop: "Zoomia stopped recording call",
        lastPlay: "Play last record",
        archive: "You have no records",
        permissions_title: "Zoomia permissions",
        permissions_message: "Zoomia requires all permissions to be enabled!"
    },
    ru: {
        language: "En",
        enter: "Вход в систему",
        email: "Эл. почта",
        password: "Пароль",
        button: "Войти",
        signInErrorInput: "Введите данные для входа!",
        signInErrorEmail: "Такая эл. почта не зарегистрирована!",
        signInErrorPassword: "Пароль не соответствует эл. почте!",
        works: "РАБОТАЕТ",
        notWorking: "НЕ РАБОТАЕТ",
        recordStart: "Zoomia начала запись звонка",
        recordStop: "Zoomia прекратила запись звонка",
        lastPlay: "Проиграть последнюю запись",
        archive: "У вас нет записей",
        permissions_title: "Разрешения для Zoomia",
        permissions_message: "Для работы Zoomia требуется включить все разрешения!"
    }
});