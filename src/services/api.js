import axios from 'axios';
// import Constants from 'expo-constants';
// const { manifest } = Constants;
// baseURL: `http://${manifest.debuggerHost.split(':').shift()}:3333`

const api = axios.create({
    baseURL: 'http://10.0.0.171:3333/'
});

export default api;