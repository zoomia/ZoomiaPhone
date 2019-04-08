import React from 'react';
import { View } from 'react-native';
import {inject, observer} from "mobx-react/native";

@inject('store')
@observer
export default class InitialScreen extends React.Component {

    componentDidMount() {
        setTimeout(()=>{
            this.props.navigation.replace(this.props.store.profile.initRoute);
        }, 1);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}></View>
        );
    }
}