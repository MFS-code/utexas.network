import { useRef, useState } from 'react';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
    name: string;
    placeholder?: string;
}

const PRESET_COLORS = [
    { name: 'UT Orange', value: '#bf5700' },
    { name: 'Gold', value: '#f59e0b' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Slate', value: '#64748b' },
    { name: 'Indigo', value: '#6366f1' },
];

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
    const customColorInputRef = useRef<HTMLInputElement | null>(null);
    const normalizedHexValue = normalizeHex(hexValue);
    const pickerValue = normalizedHexValue || normalizeHex(placeholder) || '#bf5700';

    const selectColor = (value: string) => {
        setHexValue(value);
    };

    return (
        <div className="color-picker">
            <div className="color-picker-swatches" role="group" aria-label="Preset accent colors">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color.value}
                        type="button"
                        className={`color-picker-swatch ${normalizedHexValue === color.value ? 'color-picker-swatch-active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => selectColor(color.value)}
                        aria-label={color.name}
                        aria-pressed={normalizedHexValue === color.value}
                        title={color.name}
                    />
                ))}
                <button
                    type="button"
                    className={`color-picker-swatch color-picker-custom ${normalizedHexValue && !PRESET_COLORS.some((color) => color.value === normalizedHexValue) ? 'color-picker-swatch-active' : ''}`}
                    onClick={() => customColorInputRef.current?.click()}
                    aria-label="Choose custom accent color"
                    title="Custom color"
                >
                    <Pipette size={16} aria-hidden="true" />
                </button>
                <input
                    ref={customColorInputRef}
                    className="color-picker-native"
                    type="color"
                    value={pickerValue}
                    onChange={(event) => selectColor(event.target.value)}
                    tabIndex={-1}
                    aria-hidden="true"
                />
            </div>
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
