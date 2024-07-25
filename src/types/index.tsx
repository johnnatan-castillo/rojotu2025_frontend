declare global {

    interface ResponseAPI {
        code: number
        message: string
        data: any
        token: string
    }

    interface AuthState {
        user: string,
        nombre: string,
        token: string,
        rol: "FRONT" | "BACK" | null,
        gender: "MASCULINO" | "FEMENINO" | null,
        climate: string,
        grupo: string,
        pais: string,
        identidad: "MASCULINO" | "FEMENINO" | null,
        prendas_superiores: string,
        prendas_inferiores: string,
        prendas_otros: string,
        limits: {
            prendas_superiores: number,
            prendas_inferiores: number,
            prendas_otros: number,
        },
        total: string,
        correo: string,
        url_3d: string,
        primer_ingreso: boolean,
        administrador: boolean,
    }

    interface Filters{
        isFilteredBy: string
    }

    interface LookBook {
        id: number;
        referencia_prenda_superior: string;
        referencia_prenda_inferior: string;
        referencia_otro: string;
        image: string
        rol: string;
        clima: string;
        identidad: string;
        genero: string;
        grupo: string;
        pais: string;
    }

    interface Product {
        id: number;
        referencia: string;
        nombre_prenda: string;
        descripcion: string;
        proveedor: string;
        ubicacion_archivo: string;
        nombre_archivo: string;
        tipo: string;
        clima: string;
        segmento_Prenda: string;
        genero: string;
        identidad: string;
        tallas: string;
        dias: string;
        rol: string;
        pais: string;
        grupo: string;
        talla?: string;
        dia?: string;
        referencia_prenda_superior?: string | null;
        referencia_prenda_inferior?: string | null;
        referencia_otro?: string | null;
        id_prenda: string;
        prenda_front: boolean;
        prenda?: any
    }

    interface ProductListProps {
        itemsPerPage: number;
        showArrows: boolean;
        showQuickView: boolean;
        showSizes: boolean;
        userRole: string;
    }

    interface CardProps {
        product: Product;
        showSizes: boolean;
        showQuickView: boolean;
        index: number;
        isPLP: boolean;
    }

    interface QuickViewProps {
        product: Product;
        setproductQuickView: (product: Product) => void;
    }


}

export { };