import RNFetchBlob from 'rn-fetch-blob';

const BASE_URL = 'https://my.zoomiya.com/rapi';

const CTS  = {

    signUp (email, password) {
        let formData = [];
        formData.push(encodeURIComponent('user_email') + '=' + encodeURIComponent(email));
        formData.push(encodeURIComponent('password') + '=' + encodeURIComponent(password));
        formData = formData.join("&");
        return fetch(BASE_URL + "/public/getUserValidation",
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST",
                body: formData
            });
    },

    getPhones(key, device_uuid, owner_id, user_id, records) {
        let formData = [];
        formData.push(encodeURIComponent('activity_json') + '=' + encodeURIComponent(JSON.stringify(records)));
        formData = formData.join("&");
        return fetch(BASE_URL + "/user/setPhoneActivity",
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': key,
                    'device_uuid': device_uuid,
                    'owner_id': owner_id,
                    'user_id': user_id
                },
                method: "POST",
                body: formData
            });
    },

    setRecord(key, device_uuid, owner_id, user_id, record) {
        return RNFetchBlob.fetch('POST', BASE_URL + "/user/storePhoneRec", {
            'Content-Type' : 'multipart/form-data',
            'key': key,
            'device_uuid': device_uuid,
            'owner_id': owner_id,
            'user_id': user_id
        }, [
            { name: 'local_id', data: record.local_id + '' },
            { name: 'file', filename: record.time_unix + ".mp4", data:RNFetchBlob.wrap(record.path) }
        ]);
    },

    startPhone(key, device_uuid, owner_id, user_id, phone) {
        let formData = [];
        formData.push(encodeURIComponent('phone_no') + '=' + encodeURIComponent(phone));
        formData = formData.join("&");
        return fetch(BASE_URL + "/user/startPhoneConversation",
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': key,
                    'device_uuid': device_uuid,
                    'owner_id': owner_id,
                    'user_id': user_id
                },
                method: "POST",
                body: formData
            });
    }

};

export default CTS;