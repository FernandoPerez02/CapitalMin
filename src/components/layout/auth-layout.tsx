import Image from "next/image";

interface AuthFeature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: AuthFeature[] = [
  {
    icon: "bi-pie-chart-fill",
    title: "Visión clara",
    description: "Entiende tu dinero con análisis inteligentes y fáciles de usar.",
  },
  {
    icon: "bi-bullseye",
    title: "Alcanza tus metas",
    description: "Ahorra para lo que realmente importa para ti.",
  },
  {
    icon: "bi-shield-lock-fill",
    title: "100% seguro",
    description: "Tus datos están protegidos con cifrado de nivel bancario.",
  },
];

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page-bg md:flex-row">
      {/* Panel de marca: oculto en móvil (el logo ya vive en auth-content) para no
          competir con el formulario en pantallas chicas; aparece desde md. */}
      <aside className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-primary-dark py-10 px-10 text-text-inverse md:flex md:w-[42%] md:min-w-[300px] md:max-w-[480px] lg:max-w-[560px] before:absolute before:inset-[auto_-15%_-25%_auto] before:h-[420px] before:w-[420px] before:rounded-full before:bg-[radial-gradient(circle,rgba(34,197,94,0.25),transparent_70%)] before:content-[''] before:pointer-events-none">
        <div className="relative flex items-center gap-3">
          <Image src="/logoCM.png" alt="" width={40} height={40} className="rounded-[10px]" />
          <span className="text-xl font-semibold">CapitalMin</span>
        </div>

        <div className="relative max-w-[420px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(34,197,94,0.15)] py-1 px-4 text-xs font-medium text-accent">
            <i className="bi bi-shield-check" aria-hidden="true" />
            Tus finanzas, en orden
          </span>
          <h1 className="mt-4 text-[2rem] leading-tight font-semibold">
            Toma el control de tu dinero
          </h1>
          <p className="mt-3 text-base text-[rgba(255,255,255,0.7)]">
            Organiza tus ingresos, controla tus gastos y alcanza tus metas financieras.
          </p>

          <ul className="mt-8 flex list-none flex-col gap-6 p-0">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(34,197,94,0.15)] text-lg text-accent">
                  <i className={`bi ${feature.icon}`} aria-hidden="true" />
                </span>
                <div>
                  <strong className="block text-base font-semibold">{feature.title}</strong>
                  <p className="mt-1 text-sm text-[rgba(255,255,255,0.65)]">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative m-0 text-xs text-[rgba(255,255,255,0.45)]">
          © {new Date().getFullYear()} CapitalMin. Todos los derechos reservados.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center py-8 px-4 md:p-8">{children}</main>
    </div>
  );
}
