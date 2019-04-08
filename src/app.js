import React from 'react';
import { Provider } from 'mobx-react';

import RNReactLogging from 'react-native-file-log';

import MainStore from './store';
import MainNavigator from './navigators';

RNReactLogging.setConsoleLogEnabled(false);
RNReactLogging.setFileLogEnabled(true);

export default class App extends React.Component {

    render() {
        return (
            <Provider store={MainStore}>
                <MainNavigator />
            </Provider>
        );
    }

}