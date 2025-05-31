import React, { useMemo, useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const SelectSearch = ({
    label,
    options = [],
    value = "",
    onChange,
    getOptionValue = (opt) => opt.value ?? opt.id,
    getOptionLabel = (opt) => opt.label ?? opt.nombre,
    placeholder = "Seleccione una opción",
    searchPlaceholder = "Buscar...",
    filterKeys = ["label", "nombre", "nombres", "documento"],
    disabled = false,
    searchThreshold = 5,
    defaultNoFilter = "No hay opciones."
}) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);

    const shouldShowSearch = options.length > searchThreshold;

    const filteredOptions = useMemo(() => {
        if (!shouldShowSearch || !query.trim()) return options;
        const lower = query.toLowerCase();
        return options.filter((opt) =>
            filterKeys.some((key) =>
                (opt[key] ?? "").toString().toLowerCase().includes(lower)
            )
        );
    }, [query, options, filterKeys, shouldShowSearch]);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setQuery("");
        setFocusedIndex(-1);
    };

    const selectedLabel = useMemo(() => {
        const selected = options.find(
            (opt) => getOptionValue(opt) === getOptionValue(value)
        );
        return selected ? getOptionLabel(selected) : placeholder;
    }, [value, options, getOptionValue, getOptionLabel, placeholder]);

    // Detecta clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);


    // Enfoca el input de búsqueda al abrir
    useEffect(() => {
        if (isOpen && shouldShowSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, shouldShowSearch]);

    // Teclas: escape, enter, flechas
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === "Escape") {
                setIsOpen(false);
                setFocusedIndex(-1);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
            } else if (e.key === "Enter" && focusedIndex >= 0) {
                e.preventDefault();
                handleSelect(filteredOptions[focusedIndex]);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredOptions, focusedIndex]);

    return (
        <div className="position-relative" ref={wrapperRef}>
            {label && <label className="form-label">{label}</label>}

            <Form.Control
                type="text"
                value={selectedLabel}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                disabled={disabled}
                placeholder={placeholder}
            />

            {isOpen && (
                <div
                    className="border rounded bg-white position-absolute w-100 shadow-sm z-3"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                    {shouldShowSearch && (
                        <Form.Control
                            className="m-2"
                            type="text"
                            ref={searchInputRef}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setFocusedIndex(-1);
                            }}
                            placeholder={searchPlaceholder}
                        />
                    )}

                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-muted">{defaultNoFilter}</div>
                    ) : (
                        filteredOptions.map((opt, index) => {
                            const isFocused = index === focusedIndex;
                            return (
                                <div
                                    key={getOptionValue(opt)}
                                    className={`px-3 py-2 ${isFocused ? "bg-light" : ""}`}
                                    onClick={() => handleSelect(opt)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {getOptionLabel(opt)}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectSearch;
