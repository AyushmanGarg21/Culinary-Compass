import axios from 'axios';
// import { baseUrl } from '../../utils/baseURL';

// Guard against missing baseUrl; default to empty string so axios uses relative URLs.
const axiosInstance = axios.create({
        baseURL: (typeof baseUrl !== 'undefined') ? baseUrl : '',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const storedata = await localStorage.getItem('accessToken');
        const userData = storedata ? storedata : null;

        if (userData) {
            config.headers = config.headers || {};
            config.headers['authorization'] = `Bearer ${userData}`;
        }
        // TODO ENABLE THIS
        // config.url = config.baseURL + config.url;

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
