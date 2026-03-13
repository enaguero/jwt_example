import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest } from "../services/api";


export const SignIn = () => {
    const { store, dispatch } = useGlobalReducer();
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "lara@example.com",
        password: "demo123"
    });

    if (store.token) {
        return <Navigate to="/profile" replace />;
    }

    const redirectTarget = location.state?.from?.pathname || "/profile";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch({ type: "auth_request" });

        try {
            const data = await apiRequest("/api/sign-in", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            dispatch({
                type: "auth_success",
                payload: {
                    token: data.access_token,
                    user: data.user
                }
            });
            dispatch({
                type: "set_notice",
                payload: `Bienvenido otra vez, ${data.user.name}.`
            });
            navigate(redirectTarget, { replace: true });
        } catch (error) {
            dispatch({
                type: "auth_failure",
                payload: error.message
            });
        }
    };

    return (
        <section className="auth-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="panel-card auth-card">
                            <p className="eyebrow">Access private pages</p>
                            <h1 className="section-title">Sign in</h1>
                            <p className="section-copy">
                                Al iniciar sesion podras consultar <code>/api/me</code> y tus ordenes en <code>/api/orders</code>.
                            </p>
                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="signin-email">Email</label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signin-email"
                                    name="email"
                                    onChange={handleChange}
                                    type="email"
                                    value={formData.email}
                                />

                                <label className="form-label" htmlFor="signin-password">Password</label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signin-password"
                                    name="password"
                                    onChange={handleChange}
                                    type="password"
                                    value={formData.password}
                                />

                                {store.errors.auth ? (
                                    <div className="alert alert-danger mb-0">{store.errors.auth}</div>
                                ) : null}

                                <button
                                    className="btn btn-primary-soft btn-lg w-100"
                                    disabled={store.loading.auth}
                                    type="submit"
                                >
                                    {store.loading.auth ? "Entrando..." : "Entrar"}
                                </button>
                            </form>

                            <p className="auth-footnote mb-0">
                                Si aun no tienes cuenta, puedes{" "}
                                <Link to="/sign-up">crear un usuario nuevo</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
