import { useState, useEffect, useCallback } from 'react';
import { getApuUrl } from '../utils/config';

interface DataState {
    loading: boolean;
    data: any;
    message: string;
    error: boolean;
}

export const useFetch = (endpoint: string, options: any) => {
    const url = getApuUrl(endpoint);

    const [isFetched, setIsFetched] = useState(false);

    const [dataState, setDataState] = useState<DataState>({
        data: [],
        loading: true,
        message: 'Inicializando la petición de datos',
        error: false
    });

    const handleFetch = useCallback(
        async () => {
            try {

                const response = await fetch(url, options);

                if (!response.ok) throw new Error(response.statusText);

                const dataApi: Response = await response.json();

                const { data } = dataApi as any;

                setDataState((prev: any) => ({
                    loading: false,
                    message: "Exito en la consulta",
                    error: false,
                    data
                }));

            } catch (error) {

                setDataState((prev: any) => ({
                    data: [],
                    loading: false,
                    message: (error as Error).message,
                    error: true
                }));
            } finally {
                setIsFetched(true);
            }
        },
        [options, url],
    );

    useEffect(() => {
        if (!isFetched) handleFetch();
    }, [isFetched, handleFetch]);

    return {
        ...dataState
    };
};
