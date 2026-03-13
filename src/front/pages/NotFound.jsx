import { Link } from "react-router-dom";


export const NotFound = () => (
    <section className="auth-section">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="panel-card text-center">
                        <p className="eyebrow">404</p>
                        <h1 className="section-title">Ruta no encontrada</h1>
                        <p className="section-copy">
                            La pagina que buscas no existe o requiere una navegacion distinta.
                        </p>
                        <Link className="btn btn-primary-soft" to="/">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
