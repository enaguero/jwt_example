import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest } from "../services/api";


export const SignUp = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    if (store.token) {
        return <Navigate to="/profile" replace />;
    }

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
            const data = await apiRequest("/api/sign-up", {
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
                payload: `Cuenta creada para ${data.user.name}.`
            });
            navigate("/profile", { replace: true });
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
                            <p className="eyebrow">Create a user in Flask</p>
                            <h1 className="section-title">Sign up</h1>
                            <p className="section-copy">
                                Este formulario crea el usuario en la API y deja la sesion iniciada con JWT al instante.
                            </p>
                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="signup-name">Nombre</label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-name"
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Ada Lovelace"
                                    type="text"
                                    value={formData.name}
                                />

                                <label className="form-label" htmlFor="signup-email">Email</label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-email"
                                    name="email"
                                    onChange={handleChange}
                                    placeholder="ada@example.com"
                                    type="email"
                                    value={formData.email}
                                />

                                <label className="form-label" htmlFor="signup-password">Password</label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-password"
                                    name="password"
                                    onChange={handleChange}
                                    placeholder="Minimo 6 caracteres"
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
                                    {store.loading.auth ? "Creando cuenta..." : "Crear cuenta"}
                                </button>
                            </form>

                            <p className="auth-footnote mb-0">
                                Si ya tienes cuenta, puedes{" "}
                                <Link to="/sign-in">iniciar sesion aqui</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
