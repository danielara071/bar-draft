import React, { useState } from "react";
import type { ReportFilters } from "../interfaces/errorReports";

interface ReportFiltersBarProps {
  onSearch: (filters: ReportFilters) => void;
}

export const ReportFiltersBar: React.FC<ReportFiltersBarProps> = ({ onSearch }) => {
  const [pantalla, setPantalla] = useState("");
  const [fecha, setFecha] = useState("");

  const handleSearch = () => {
    onSearch({ pantalla, fecha });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="filters-bar">
      <p className="filters-label">Filtros</p>
      <div className="filters-row">
        <div className="filter-input-wrapper">
          <input
            className="filter-input"
            type="text"
            placeholder="PANTALLA"
            value={pantalla}
            onChange={(e) => setPantalla(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="filter-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        <div className="filter-input-wrapper">
          <input
            className="filter-input"
            type="date"
            placeholder="FECHA"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="filter-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
        </div>

        <button className="btn-search" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Buscar
        </button>
      </div>
    </div>
  );
};