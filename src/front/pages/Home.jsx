import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";


export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            dispatch({ type: "products_request" });

            try {
                const data = await apiRequest("/api/products");

                if (!isMounted) {
                    return;
                }

                dispatch({
                    type: "products_success",
                    payload: data.products
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                dispatch({
                    type: "products_failure",
                    payload: error.message
                });
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const handlePurchase = async (productId) => {
        if (!store.token) {
            dispatch({
                type: "set_notice",
                payload: "Inicia sesion para crear una orden."
            });
            navigate("/sign-in");
            return;
        }

        dispatch({ type: "checkout_request" });

        try {
            const data = await apiRequest("/api/orders", {
                method: "POST",
                headers: authHeaders(store.token),
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1
                })
            });

            dispatch({
                type: "checkout_success",
                payload: data.order
            });
            navigate("/orders");
        } catch (error) {
            if (error.status === 401) {
                dispatch({
                    type: "clear_session",
                    payload: "Tu sesion ya no es valida. Entra otra vez."
                });
                navigate("/sign-in");
                return;
            }

            dispatch({
                type: "checkout_failure",
                payload: error.message
            });
        }
    };

    return (
        <>
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7">
                            <p className="eyebrow">React protected routes + Flask JWT</p>
                            <h1 className="hero-title">
                                Catalogo publico, autenticacion real y ordenes privadas para cada usuario.
                            </h1>
                            <p className="hero-copy">
                                Este ejemplo incluye <code>sign_up</code>, <code>sign_in</code>,
                                <code> profile/me</code>, compra protegida y vistas privadas en React.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link className="btn btn-primary-soft" to={store.token ? "/orders" : "/sign-up"}>
                                    {store.token ? "Ver mis ordenes" : "Crear cuenta"}
                                </Link>
                                <Link className="btn btn-ghost" to={store.token ? "/profile" : "/sign-in"}>
                                    {store.token ? "Ir a mi perfil" : "Entrar al demo"}
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="panel-card credential-card">
                                <p className="eyebrow mb-2">Seed listo para probar</p>
                                <h2 className="section-title mb-3">Credenciales demo</h2>
                                <div className="credential-row">
                                    <span>Lara Instructor</span>
                                    <code>lara@example.com / demo123</code>
                                </div>
                                <div className="credential-row">
                                    <span>Diego Student</span>
                                    <code>diego@example.com / demo123</code>
                                </div>
                                <p className="section-copy mb-0">
                                    El catalogo es publico. Las ordenes y el perfil solo aparecen cuando hay sesion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="catalog-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <p className="eyebrow">Public products</p>
                            <h2 className="section-title">Galeria de productos</h2>
                        </div>
                        <p className="section-copy mb-0">
                            Cualquier visitante puede explorar. Comprar crea una orden protegida para el usuario autenticado.
                        </p>
                    </div>

                    {store.errors.products ? (
                        <div className="alert alert-danger">{store.errors.products}</div>
                    ) : null}
                    {store.errors.checkout ? (
                        <div className="alert alert-danger">{store.errors.checkout}</div>
                    ) : null}

                    <div className="row g-4">
                        {store.loading.products ? (
                            <div className="col-12">
                                <div className="panel-card text-center">
                                    <p className="mb-0">Cargando productos...</p>
                                </div>
                            </div>
                        ) : store.products.map((product) => (
                            <div className="col-md-6 col-xl-4" key={product.id}>
                                <article className="product-card">
                                    <img
                                        className="product-image"
                                        src={product.image_url}
                                        alt={product.name}
                                    />
                                    <div className="product-body">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <p className="product-category">{product.category}</p>
                                                <h3 className="product-title">{product.name}</h3>
                                            </div>
                                            <span className="price-pill">${product.price.toFixed(2)}</span>
                                        </div>
                                        <p className="product-copy">{product.description}</p>
                                        <button
                                            className="btn btn-primary-soft w-100"
                                            onClick={() => handlePurchase(product.id)}
                                            disabled={store.loading.checkout}
                                            type="button"
                                        >
                                            {store.token ? "Comprar ahora" : "Entrar para comprar"}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
