import React from 'react';
import {AppRegistry, View, Text, Button, TouchableOpacity, Image, ScrollView} from 'react-native';
import Sound from 'react-native-sound';
import SoundRecorder from 'react-native-sound-recorder';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import RNReactLogging from 'react-native-file-log';
import { PermissionsAndroid } from 'react-native';

import {inject, observer} from "mobx-react/native";

import { locale }  from '../locale';
import {LOGIN_STYLES, MAIN_STYLES} from "../styles";
import CTS from '../utils/connectToServer';

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const audioPath = RNFetchBlob.fs.dirs.MusicDir;
//const audioPath = SoundRecorder.PATH_DOCUMENT;

@inject('store')
@observer
export default class MainScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isWorking: true,
            callType: 0,
        };

        let record = {
            type: 0,
            time_unix: 0,
            number: 0,
            local_id: 0,
            duration_sec: 0,
            path: ''
        };
        let ring = false;
        let callReceived = false;
        const Rec = async (data) => {
            if(data.state === 'extra_state_ringing') {
                ring = true;
                record.time_unix = moment().unix();
                record.number = data.number;
                record.local_id = this.props.store.profile.last_record_id;
                this.props.store.incrementRecordId();

                RNReactLogging.printLog('Call recording started...');
                RNReactLogging.printLog(JSON.stringify(record));
            }
            if (data.state === 'extra_state_offhook') {
                callReceived = true;
                record.time_unix = moment().unix();
                record.number = data.number;
                record.local_id = this.props.store.profile.last_record_id;
                this.props.store.incrementRecordId();
                record.path = audioPath + '/' + record.time_unix + '.mp4';

                const profile = this.props.store.profile;
                CTS.startPhone(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, record.number).catch((err) => {
                    RNReactLogging.printLog(JSON.stringify(err));
                });

                if (this.state.isWorking) {
                    SoundRecorder.start(record.path, {
                        source: SoundRecorder.SOURCE_MIC,
                        format: SoundRecorder.FORMAT_MPEG_4,
                        encoder: SoundRecorder.AAC,
                    }).then(() => {
                        RNReactLogging.printLog('Call recording started...');
                        RNReactLogging.printLog(JSON.stringify(record));
                        Toast.show(locale.recordStart);
                    }).catch((err) => {
                        RNReactLogging.printLog(JSON.stringify(err));
                    });
                }

            } else if (data.state === 'extra_state_idle') {
                if (this.state.isWorking) {
                    if (callReceived) {
                        callReceived = false;
                        ring ? record.type = 1 : record.type = 2;
                        ring = false;
                        SoundRecorder.stop().then((result) => {
                            record.duration_sec = Math.trunc(result.duration / 1000);
                            this.props.store.addRecord(record);
                            this.setPhones();

                            RNReactLogging.printLog('Call recording is over...');
                            RNReactLogging.printLog(JSON.stringify(record));
                            Toast.show(locale.recordStop);
                        }).catch((err) => {
                            RNReactLogging.printLog(JSON.stringify(err));
                        });
                    } else {
                        ring ? record.type = 3 : record.type = 4;
                        ring = false;
                        record.duration_sec = 0;
                        record.path = '';

                        this.props.store.addRecord(record);
                        this.setPhones();
                    }
                }

            }
        };

        AppRegistry.registerHeadlessTask('Rec', () => Rec);
    }

    componentDidMount() {
        this.requestAudioPermission();
        this.setPhones();
    }

    async requestAudioPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    'title': locale.permissions_title,
                    'message': locale.permissions_message
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                this.setState({isWorking: false});
            }

            const granted1 = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.PROCESS_OUTGOING_CALLS,
                {
                    'title': locale.permissions_title,
                    'message': locale.permissions_message
                }
            );
            if (granted1 === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                this.setState({isWorking: false});
            }

            const granted2 = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                {
                    'title': locale.permissions_title,
                    'message': locale.permissions_message
                }
            );
            if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                this.setState({isWorking: false});
            }

            const granted3 = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': locale.permissions_title,
                    'message': locale.permissions_message
                }
            );
            if (granted3 === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                this.setState({isWorking: false});
            }

            const granted4 = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': locale.permissions_title,
                    'message': locale.permissions_message
                }
            );
            if (granted4 === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                this.setState({isWorking: false});
            }

        } catch (err) {
            RNReactLogging.printLog(JSON.stringify(err));
        }
    }

    setPhones() {
        const profile = this.props.store.profile;
        if(profile.records.length) {
            RNReactLogging.printLog('Connecting to Zoomia server');
            console.log(JSON.stringify(profile.records));
            CTS.getPhones(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, profile.records).then((response) => response.json())
                .then((data) => {
                    console.log("SET_PHONES",JSON.stringify(data));
                    if (data.success) {
                        let requestedRecords = data.data.requested_records;

                        this.setFiles(requestedRecords);
                    }

                    RNReactLogging.printLog('Transferred the list of calls to the server...');
                    RNReactLogging.printLog(JSON.stringify(data));
                }).catch((err) => {
                    RNReactLogging.printLog(JSON.stringify(err));
                });
        }
    }

    async setFiles(requestedRecords) {
        const profile = this.props.store.profile;
        for (let i = 0; i < requestedRecords.length; i++) {
            for (let j = 0; j < this.props.store.profile.records.length; j ++) {
                let record = this.props.store.profile.records[j];
                let range = moment.range(moment.unix(record.time_unix), moment());
                if (record.local_id == requestedRecords[i]) {
                    try{
                        RNReactLogging.printLog('Connecting to Zoomia server');
                        let response;
                        if (record.path) {
                            response = await CTS.setRecord(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, record);
                            let data = await response.json();
                            console.log("SET_FILE",JSON.stringify(data));

                            if (data.success) {
                                RNFetchBlob.fs.unlink(record.path).catch((err) => {
                                    RNReactLogging.printLog(err);
                                });
                                this.props.store.removeRecord(record);
                            }

                            RNReactLogging.printLog('Received an answer about file transfer...');
                            RNReactLogging.printLog(JSON.stringify(data));
                        } else {
                            this.props.store.removeRecord(record);
                        }
                    } catch (err) {
                        RNReactLogging.printLog(JSON.stringify(err));
                        break;
                    }
                } else if (range.diff('days') > 14) {
                    RNFetchBlob.fs.unlink(record.path).catch((err) => {
                        RNReactLogging.printLog(err);
                    });
                    this.props.store.removeRecord(record);
                }
            }
        }
    }

    onChangeLang() {
        this.props.store.changeLang();
        this.setState({});
    }

    render() {
        let working;
        if (this.state.isWorking) {
            working = <Text
                style={ MAIN_STYLES.works } >
                { locale.works }
            </Text>;
        } else {
            working = <Text
                style={ MAIN_STYLES.notWorking } >
                { locale.notWorking }
            </Text>;
        }

        return (
            <View
                style={ MAIN_STYLES.screen } >
                <ScrollView contentContainerStyle={LOGIN_STYLES.scroll}>
                <TouchableOpacity style={ MAIN_STYLES.languageButton } onPress={ this.onChangeLang.bind(this) } >
                    <Text
                        style={ MAIN_STYLES.language } >
                        { locale.language }
                    </Text>
                </TouchableOpacity>
                <Image
                    source={require('../images/logo.png')}
                    style={MAIN_STYLES.logo}
                />
                { working }
                </ScrollView>
            </View>
        );
    }
}

