
import CryptoJS from "crypto-js"

const CRYPTO_KEY = process.env.REACT_APP_CRYPTO;

export const encryptData = (text: string) => {
    if (CRYPTO_KEY) {
        const encrypted = CryptoJS.AES.encrypt(text, CRYPTO_KEY).toString();
        return {
            error: false,
            message: "Se ha cifrado la información",
            data: encrypted
        };
    } else {
        return {
            error: true,
            message: "No se ha encontrado la clave de cifrado",
            data: ""
        }
    }
}

export const decryptData = (secret: string) => {

    if (CRYPTO_KEY) {
        const bytes = CryptoJS.AES.decrypt(secret, CRYPTO_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return {
            error: false,
            message: "Se ha desencriptado la información",
            data: originalText
        };
    } else {
        return {
            error: true,
            message: "No se ha encontrado la clave de cifrado",
            data: ""
        }
    }
}