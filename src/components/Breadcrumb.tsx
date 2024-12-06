// components/Breadcrumb.tsx
import React from 'react';
import Link from 'next/link'; // Assurez-vous que vous utilisez `next/link` pour la navigation
import { usePageContext } from '../contexts/breadcrumbContext';

const Breadcrumb = () => {
    const { breadcrumbs } = usePageContext();

    return (
        <nav aria-label="breadcrumb">
            <ol className="flex space-x-2 text-gray-500">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                        {breadcrumb.url ? (
                            <Link href={breadcrumb.url}>
                                <span className="hover:text-blue-500">{breadcrumb.title}</span>
                            </Link>
                        ) : (
                            <span>{breadcrumb.title}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <span className="mx-2">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
