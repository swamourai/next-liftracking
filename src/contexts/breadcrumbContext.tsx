import React, { createContext, ReactNode, useState, useContext } from 'react';

interface Breadcrumb {
    title: string;
    url?: string; // URL optionnelle, donc le lien est facultatif
}

interface PageContextType {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
}

const PageContext = createContext<PageContextType>({
    breadcrumbs: [],
    setBreadcrumbs: () => { }
});

export const PageProvider = ({ children }: { children: ReactNode }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    return (
        <PageContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = (): PageContextType => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
};
