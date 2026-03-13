export const Footer = () => (
    <footer className="footer-shell">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-4">
            <div>
                <p className="footer-title mb-1">JWT example con React + Flask</p>
                <p className="footer-copy mb-0">
                    Catalogo publico, autenticacion JWT y vistas privadas para perfil y ordenes.
                </p>
            </div>
            <a
                className="footer-link"
                href="https://4geeks.com/docs/start/react-flask-template"
                target="_blank"
                rel="noreferrer"
            >
                Ver documentacion base
            </a>
        </div>
    </footer>
);
