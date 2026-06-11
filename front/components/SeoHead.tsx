import Head from 'next/head';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    noIndex?: boolean;
}

export default function SeoHead({
                                    title,
                                    description,
                                    keywords,
                                    noIndex = false
                                }: SeoHeadProps) {
    const siteTitle = 'EduSwagger - Swagger и SQL визуализатор';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const fullDescription = description || 'Визуализация Swagger схем и SQL баз данных с возможностью сохранения в избранное';
    const fullKeywords = keywords || 'swagger, sql, api, визуализация, база данных, openapi';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="keywords" content={fullKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />

            {noIndex && <meta name="robots" content="noindex,nofollow" />}
        </Head>
    );
}