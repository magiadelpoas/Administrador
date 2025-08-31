import React from "react";

export const NavBar = () => {
  return (
    <>
      <nav className="pc-sidebar">
        <div className="navbar-wrapper">
          <div
            className="m-header"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "20px",
              paddingBottom: "20px",
              gap: "15px",
            }}
          >
            <img
              src="/assets/logo.jpg"
              alt="logo image"
              style={{
                width: "75px",
                height: "75px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              className="logo-lg"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <h1
                style={{
                  color: "black",
                  fontSize: "18px",
                  fontWeight: "bold",
                  margin: "0",
                  lineHeight: "1.2",
                }}
              >
                Magia del Poas
              </h1>
              <span
                style={{
                  color: "#666",
                  fontSize: "12px",
                  fontWeight: "normal",
                  margin: "0",
                }}
              >
                Cabañas de Montaña
              </span>
            </div>
          </div>
          <div className="navbar-content">
            <ul className="pc-navbar">
              <li className="pc-item pc-caption">
                <label data-i18n="Navigation">Menu principal</label>
                <i className="ph-duotone ph-gauge"></i>
              </li>
              <li className="pc-item">
                <a href="../widget/w_statistics.html" className="pc-link">
                  <span className="pc-micon">
                    <i className="ph-duotone ph-projector-screen-chart"></i>
                  </span>
                  <span className="pc-mtext" data-i18n="Statistics">
                    Statistics
                  </span>
                </a>
              </li>
            </ul>

            <div className="card pc-user-card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <img
                      src="/assets/logo.jpg"
                      alt="user-image"
                      className="user-avtar wid-45 rounded-circle"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="dropdown">
                      <a
                        href="#"
                        className="arrow-none dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-offset="0,20"
                      >
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <h6 className="mb-0">Jhon Smith</h6>
                            <small>Administrator</small>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="btn btn-icon btn-link-secondary avtar">
                              <i className="ph-duotone ph-windows-logo"></i>
                            </div>
                          </div>
                        </div>
                      </a>
                      <div className="dropdown-menu">
                        <ul>
                          <li>
                            <a className="pc-user-links">
                              <i className="ph-duotone ph-user"></i>
                              <span>Mi cuenta</span>
                            </a>
                          </li>
                          <li>
                            <a className="pc-user-links">
                              <i className="ph-duotone ph-gear"></i>
                              <span>Configuración</span>
                            </a>
                          </li>
                          <li>
                            <a className="pc-user-links">
                              <i className="ph-duotone ph-lock-key"></i>
                              <span>Pantalla de bloqueo</span>
                            </a>
                          </li>
                          <li>
                            <a className="pc-user-links">
                              <i className="ph-duotone ph-power"></i>
                              <span>Cerrar sesión</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
