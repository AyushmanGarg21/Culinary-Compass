import axios from 'axios';
// import { baseUrl } from '../../utils/baseURL';

const axiosInstance = axios.create({
    baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(async config => {
    const storedata = await localStorage.getItem('accessToken');
    const userData = storedata ? storedata : null;

    if (userData) {
        config.headers['authorization'] = `Bearer ${userData}`;
    }
    //TODO ENABLE THIS
    //config.url = config.baseURL + config.url;

    return config;
});

export default axiosInstance;
