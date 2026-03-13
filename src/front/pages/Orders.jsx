import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";


export const Orders = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const loadOrders = async () => {
            dispatch({ type: "orders_request" });

            try {
                const data = await apiRequest("/api/orders", {
                    headers: authHeaders(store.token)
                });

                if (!isMounted) {
                    return;
                }

                dispatch({
                    type: "orders_success",
                    payload: data.orders
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (error.status === 401) {
                    dispatch({
                        type: "clear_session",
                        payload: "Tu sesion ya no es valida. Entra otra vez."
                    });
                    navigate("/sign-in", { replace: true });
                    return;
                }

                dispatch({
                    type: "orders_failure",
                    payload: error.message
                });
            }
        };

        loadOrders();

        return () => {
            isMounted = false;
        };
    }, [dispatch, navigate, store.token]);

    const totalSpent = store.orders.reduce(
        (accumulator, order) => accumulator + order.total_price,
        0
    );

    return (
        <section className="private-section">
            <div className="container">
                <div className="section-header mb-4">
                    <div>
                        <p className="eyebrow">Protected page</p>
                        <h1 className="section-title">Mis ordenes</h1>
                    </div>
                    <p className="section-copy mb-0">
                        Esta pagina consulta <code>/api/orders</code> y muestra solo las compras del usuario autenticado.
                    </p>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="panel-card stat-card">
                            <span className="stat-label">Total de ordenes</span>
                            <strong className="stat-value">{store.orders.length}</strong>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="panel-card stat-card">
                            <span className="stat-label">Monto acumulado</span>
                            <strong className="stat-value">${totalSpent.toFixed(2)}</strong>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="panel-card stat-card">
                            <span className="stat-label">Usuario actual</span>
                            <strong className="stat-value">{store.user?.name}</strong>
                        </div>
                    </div>
                </div>

                {store.loading.orders ? (
                    <div className="panel-card text-center">
                        <p className="mb-0">Cargando ordenes...</p>
                    </div>
                ) : null}
                {store.errors.orders ? (
                    <div className="alert alert-danger">{store.errors.orders}</div>
                ) : null}

                {!store.loading.orders && !store.orders.length ? (
                    <div className="panel-card text-center">
                        <h2 className="section-title">Aun no tienes compras</h2>
                        <p className="section-copy">
                            Puedes volver al catalogo publico y crear una orden autenticada desde ahi.
                        </p>
                        <Link className="btn btn-primary-soft" to="/">
                            Volver al catalogo
                        </Link>
                    </div>
                ) : null}

                <div className="row g-4">
                    {store.orders.map((order) => (
                        <div className="col-12" key={order.id}>
                            <article className="order-card">
                                <img
                                    className="order-image"
                                    src={order.product.image_url}
                                    alt={order.product.name}
                                />
                                <div className="order-content">
                                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                                        <div>
                                            <p className="product-category">{order.product.category}</p>
                                            <h2 className="order-title">{order.product.name}</h2>
                                            <p className="product-copy mb-3">{order.product.description}</p>
                                        </div>
                                        <span className="status-pill">{order.status}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span>Cantidad: {order.quantity}</span>
                                        <span>Unitario: ${order.unit_price.toFixed(2)}</span>
                                        <span>Total: ${order.total_price.toFixed(2)}</span>
                                        <span>Fecha: {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
