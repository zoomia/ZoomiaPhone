import DeviceInfo from 'react-native-device-info';
import { AsyncStorage } from 'react-native';

import { observable, action } from 'mobx';
import { locale } from "./locale";

class MainStore {

    constructor() {
        AsyncStorage.getItem('profile').then(action((data) => {
            if (data && data.length) {
                let savedProfile = JSON.parse(data);
                this.profile.language = savedProfile.language;
                locale.setLanguage(savedProfile.language);
                this.profile.initRoute = savedProfile.initRoute;
                this.profile.user_id = savedProfile.user_id;
                this.profile.access_key = savedProfile.access_key;
                if(savedProfile.owners) savedProfile.owners.forEach((owner) => {
                    this.profile.owners.push(owner);
                });
                this.profile.last_record_id = savedProfile.last_record_id;
                if(savedProfile.records) savedProfile.records.forEach((record) => {
                    this.profile.records.push(record);
                });
            }
        }));
    }

    @observable profile = {
        language: 'en',
        initRoute: 'Login',
        user_id: '',
        access_key: '',
        owners: [],
        device_id: DeviceInfo.getDeviceId(),
        last_record_id: 1,
        records: []
    };

    @action setInitialRoute(route) {
        this.profile.initRoute = route;
        this.saveData();
    }

    @action changeLang() {
        if(locale.getLanguage() == 'en') {
            this.profile.language = 'ru';
            locale.setLanguage(this.profile.language);
        } else {
            this.profile.language = 'en';
            locale.setLanguage(this.profile.language);
        }
        this.saveData();
    }

    @action addRecord(record) {
        this.profile.records.push(record);
        this.saveData();
    }

    @action removeRecord(record) {
        let newRecords = [];
        this.profile.records.forEach( (rec) => {
            if (record.local_id != rec.local_id) {
                newRecords.push(rec);
            }
        });
        this.profile.records = newRecords;
        this.saveData();
    }

    @action incrementRecordId() {
        this.profile.last_record_id++;
        this.saveData();
    }

    @action addData(user_id, access_key, owners) {
        this.profile.user_id = user_id;
        this.profile.access_key = access_key;
        owners.forEach((owner) => {
            this.profile.owners.push(owner);
        });
        this.saveData();
    }

    saveData() {
        AsyncStorage.setItem('profile', JSON.stringify(this.profile));
    }

}

export default new MainStore();