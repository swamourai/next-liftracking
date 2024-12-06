"use client"
import { usePageContext } from "@/src/contexts/breadcrumbContext";
import { useEffect } from "react";

export default function Custom404() {
  const { setBreadcrumbs } = usePageContext();

  useEffect(() => {
    setBreadcrumbs([
      { title: '404' }
    ]);
  }, [setBreadcrumbs]);

  return <h1 className="p-10 text-center">404 - Page Not Found</h1>
}