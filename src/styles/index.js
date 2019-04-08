import { StyleSheet } from 'react-native';

export const LOGIN_STYLES = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    scroll: {
        flexGrow: 1,
        justifyContent : 'center',
        width: 250
    },
    language: {
        textAlign: 'right',
        width: 40,
        height: 40,
        fontSize: 27,
    },
    languageButton: {
        alignSelf: 'flex-end'
    },
    logo: {
        marginTop: 10,
        width: 250,
        height: 100,
        resizeMode: 'contain'
    },
    title: {
        marginTop: 10,
        width: 250,
        fontSize: 27,
        color: "#2b2a29",
        textAlign: "center"
    },
    input: {
        marginTop: 10,
        width: 250,
    },
    spinner: {
        marginTop: 60
    }
});

export const MAIN_STYLES = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    scroll: {
        flexGrow: 1,
        justifyContent : 'center',
        width: 250
    },
    language: {
        width: 40,
        height: 40,
        fontSize: 27,
    },
    languageButton: {
        alignSelf: 'flex-end'
    },
    logo: {
        marginTop: 20,
        width: 250,
        height: 100,
        resizeMode: 'contain'
    },
    works: {
        marginTop: 20,
        width: 250,
        fontSize: 35,
        color: "#85ce36",
        textAlign: "center"
    },
    notWorking: {
        marginTop: 20,
        width: 250,
        fontSize: 35,
        color: "#CC3030",
        textAlign: "center"
    },
});