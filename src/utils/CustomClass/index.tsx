interface CustomClassProps {
    component: string;
    version: string;
    customClass: string;
}

const CustomClass = ({ component, version, customClass }: CustomClassProps): string => (`rojo-tu-${component}-${version}-x-${component}-${customClass}`)

export default CustomClass;
