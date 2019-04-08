import { createStackNavigator } from 'react-navigation';

import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';

export default createStackNavigator(
    {
        Initial: {
            screen: InitialScreen,
            navigationOptions: {
                header: null
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                header: null
            }
        },
        Main: {
            screen: MainScreen,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        initialRouteName: 'Initial',
    }
);