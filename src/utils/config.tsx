const URL_BACK = process.env.REACT_APP_URL_BACK;

export const getApuUrl = (url: string) => `${URL_BACK}${url}`;