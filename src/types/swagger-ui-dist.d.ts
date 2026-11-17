declare module "swagger-ui-dist/swagger-ui-bundle.js" {
  export interface SwaggerUIBundleConfig {
    url?: string;
    domNode?: HTMLElement;
    deepLinking?: boolean;
    docExpansion?: string;
    defaultModelsExpandDepth?: number;
    tryItOutEnabled?: boolean;
    requestInterceptor?: (req: {
      headers?: Record<string, string>;
      url?: string;
      method?: string;
    }) => unknown;
    onComplete?: () => void;
    [key: string]: unknown;
  }

  const SwaggerUIBundle: (config: SwaggerUIBundleConfig) => {
    specActions?: { updateSpec: (spec: object) => void };
    [key: string]: unknown;
  };

  export default SwaggerUIBundle;
}
