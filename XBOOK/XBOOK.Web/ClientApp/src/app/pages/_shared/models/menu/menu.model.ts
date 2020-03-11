export interface MenuViewModel {
    title: string;
    icon: string;
    link?: string;
    children?: Children[];
}

export interface Children {
    title: string;
    link: string;
}
