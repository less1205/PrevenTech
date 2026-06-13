import { useEffect, useRef, useState, useCallback } from "react";
import { obtenerAlertasRecientes } from "../services/api";
import "../styles/notification-bell.css";

const POLL_INTERVAL = 60_000; // 60 segundos
const STORAGE_KEY = "alertas_vistas_keys";

function getColorClass(color) {
  switch (color) {
    case "ROJO":    return "nb-critico";
    case "AMARILLO": return "nb-preventivo";
    case "VERDE":   return "nb-ok";
    default:        return "nb-info";
  }
}

function getIcon(color) {
  switch (color) {
    case "ROJO":    return "🔴";
    case "AMARILLO": return "🟡";
    case "VERDE":   return "🟢";
    default:        return "🔵";
  }
}

function getTipoLabel(tipo) {
  switch (tipo) {
    case "CRITICO":    return "Crítico";
    case "PREVENTIVO": return "Preventivo";
    case "AL_DIA":     return "Al día";
    default:           return tipo || "Alerta";
  }
}

function alertaKey(a) {
  return `${a.id}__${a.fechaGenerada || ""}`;
}

function getSeenKeys() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSeenKeys(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
}

function NotificationBell() {
  const [alertas, setAlertas] = useState([]);
  const [open, setOpen] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);
  const [shake, setShake] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const prevKeysRef = useRef(new Set());

  const cargarAlertas = useCallback(async () => {
    try {
      const data = await obtenerAlertasRecientes();
      setAlertas(data);

      const seenKeys = getSeenKeys();
      const nuevas = data.filter(a => !seenKeys.has(alertaKey(a)));
      setNoLeidas(nuevas.length);

      const newKeys = new Set(data.map(alertaKey));
      const hayNuevasDesdeUltimoPoll = data.some(a => !prevKeysRef.current.has(alertaKey(a)));
      if (prevKeysRef.current.size > 0 && hayNuevasDesdeUltimoPoll) {
        setShake(true);
        setTimeout(() => setShake(false), 800);
      }
      prevKeysRef.current = newKeys;
    } catch (e) {
      console.error("Error al cargar alertas:", e);
    }
  }, []);

  useEffect(() => {
    cargarAlertas();
    const interval = setInterval(cargarAlertas, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [cargarAlertas]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function togglePanel() {
    if (!open) {
      const seenKeys = getSeenKeys();
      alertas.forEach(a => seenKeys.add(alertaKey(a)));
      saveSeenKeys(seenKeys);
      setNoLeidas(0);
    }
    setOpen(prev => !prev);
  }

  return (
    <div className="nb-wrapper">
      <button
        ref={btnRef}
        className={`nb-btn ${shake ? "nb-shake" : ""}`}
        onClick={togglePanel}
        aria-label="Notificaciones"
        title="Ver alertas recientes"
      >
        <span className="nb-icon">🔔</span>
        {noLeidas > 0 && (
          <span className="nb-badge">{noLeidas}</span>
        )}
      </button>

      {open && (
        <div ref={panelRef} className="nb-panel">
          <div className="nb-panel-header">
            <span className="nb-panel-title">Alertas recientes</span>
            <span className="nb-panel-count">{alertas.length} de las últimas</span>
          </div>

          {alertas.length === 0 ? (
            <div className="nb-empty">
              <span>✅</span>
              <p>Sin alertas recientes</p>
            </div>
          ) : (
            <ul className="nb-list">
              {alertas.map(a => (
                <li key={a.id} className={`nb-item ${getColorClass(a.color)}`}>
                  <div className="nb-item-icon">{getIcon(a.color)}</div>
                  <div className="nb-item-body">
                    <span className="nb-item-tipo">{getTipoLabel(a.tipo)}</span>
                    <p className="nb-item-msg">{a.mensaje}</p>
                    {a.fechaGenerada && (
                      <span className="nb-item-fecha">{formatFecha(a.fechaGenerada)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="nb-panel-footer">
            <a href="/mantenciones" className="nb-ver-todas">Ver mantenciones →</a>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

export default NotificationBell;