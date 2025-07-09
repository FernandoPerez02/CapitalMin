import "./components-layout-home.css";
import Image from "next/image";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="layout-home-container">
      <header>
        <div className="info-page">
          <div className="content-logo">
            <Image src="/logoCM.png" alt="Icon" width={100} height={100} />
          <h1>CapitalMin</h1>
          </div>
          <div className="text-user">
            <i className="bi bi-person"></i>
            <span>Usuario</span>
          </div>
        </div>
      </header>
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="icon-tooltip">
              <i className="bi bi-bar-chart-line"/>
              <span className="tooltip-text">Dashboard</span>
            </li>
            <li className="icon-tooltip">
              <i className="bi bi-cash-stack"/>
              <span className="tooltip-text">Presupuesto</span>
            </li>
            <li className="icon-tooltip">
              <i className="bi bi-arrow-left-right"/>
              <span className="tooltip-text">Movimientos</span>
            </li>
            <li className="icon-tooltip">
              <i className="bi bi-graph-up-arrow"/>
              <span className="tooltip-text">Balance</span>
            </li>
            <li className="icon-tooltip">
              <i className="bi bi-journal-text"/>
              <span className="tooltip-text">Historial</span>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <div className="dynamic-content-container">
          {children}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[20px] flex-wrap items-center justify-center">&copy; 2025 CapitalMin. Todos los derechos reservados.</footer>
    </div>
  );
}