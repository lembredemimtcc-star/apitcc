import { useEffect, useRef, useState } from "react";
import "swagger-ui-dist/swagger-ui.css";

/**
 * Documentação interativa da API REST (PostgREST/Supabase) em Swagger UI.
 * Acessível em /docs — não altera a navegação do aplicativo.
 */
export function ApiDocs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ default: SwaggerUIBundle }] = await Promise.all([
          import("swagger-ui-dist/swagger-ui-bundle.js"),
        ]);
        if (cancelled || !containerRef.current) return;

        const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as
          | string
          | undefined;

        SwaggerUIBundle({
          url: "/openapi.json",
          domNode: containerRef.current,
          deepLinking: true,
          docExpansion: "list",
          defaultModelsExpandDepth: -1,
          tryItOutEnabled: true,
          requestInterceptor: (req: { headers?: Record<string, string> }) => {
            if (supabaseAnonKey) {
              req.headers = req.headers ?? {};
              req.headers["apikey"] = supabaseAnonKey;
              req.headers["Authorization"] = `Bearer ${supabaseAnonKey}`;
            }
            return req;
          },
          onComplete: () => {
            if (!supabaseAnonKey) {
              setError(
                "VITE_SUPABASE_ANON_KEY não configurada — o 'Try it out' ficará sem autenticação.",
              );
            }
          },
        });
      } catch (e) {
        console.error(e);
        setError("Falha ao carregar o Swagger UI.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <strong style={{ fontSize: 14 }}>PerceptAI — API Docs (Swagger UI)</strong>
        <a href="/" style={{ fontSize: 13, color: "#333" }}>
          ← Voltar ao site
        </a>
      </div>
      {error && (
        <div
          style={{
            padding: "10px 16px",
            background: "#fff3cd",
            color: "#664d03",
            fontSize: 13,
            borderBottom: "1px solid #ffe69c",
          }}
        >
          {error}
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
