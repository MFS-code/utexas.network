import { useState } from 'react';

interface ColorPickerProps {
    name: string;
    placeholder?: string;
}

function normalizeHex(value: string): string | null {
    const normalized = value.trim();
    const match = normalized.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return null;

    const hex = match[1].toLowerCase();
    return hex.length === 3
        ? `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
        : `#${hex}`;
}

export default function ColorPicker({ name, placeholder = '#bf5700' }: ColorPickerProps) {
    const [hexValue, setHexValue] = useState('');
    const pickerValue = normalizeHex(hexValue) || placeholder;

    return (
        <div className="color-picker">
            <input
                className="color-picker-swatch"
                type="color"
                value={pickerValue}
                onChange={(event) => setHexValue(event.target.value)}
                aria-label="Choose accent color"
            />
            <input
                className="join-input color-picker-hex"
                name={name}
                type="text"
                value={hexValue}
                onChange={(event) => setHexValue(event.target.value)}
                placeholder={placeholder}
                inputMode="text"
                aria-label="Accent color hex value"
            />
        </div>
    );
}
