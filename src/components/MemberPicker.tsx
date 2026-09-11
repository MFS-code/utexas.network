import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Member } from '@/data/members';

interface MemberPickerProps {
    name: string;
    members: Member[];
    required?: boolean;
    placeholder?: string;
}

function matchesQuery(member: Member, query: string): boolean {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;

    return (
        member.name?.toLowerCase().includes(normalized) ||
        member.program?.toLowerCase().includes(normalized) ||
        member.id.toLowerCase().includes(normalized)
    );
}

export default function MemberPicker({
    name,
    members,
    required = false,
    placeholder = 'Search members...',
}: MemberPickerProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const membersById = useMemo(() => {
        const map = new Map<string, Member>();
        members.forEach((member) => map.set(member.id, member));
        return map;
    }, [members]);

    const selectedMembers = useMemo(
        () => selectedIds.map((id) => membersById.get(id)).filter((member): member is Member => Boolean(member)),
        [membersById, selectedIds]
    );

    const filteredMembers = useMemo(
        () => members
            .filter((member) => matchesQuery(member, query))
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name)),
        [members, query]
    );

    const value = selectedIds.join(',');

    const toggleMember = (id: string) => {
        setSelectedIds((current) => (
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id]
        ));
    };

    const removeMember = (id: string) => {
        setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    };

    const resetPicker = () => {
        setSelectedIds([]);
        setQuery('');
        setIsOpen(false);
    };

    useEffect(() => {
        const form = rootRef.current?.closest('form');
        if (!form) return;

        form.addEventListener('reset', resetPicker);
        return () => form.removeEventListener('reset', resetPicker);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setQuery('');
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            searchRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <div className="member-picker join-input-wide" ref={rootRef}>
            <input type="hidden" name={name} value={value} required={required && selectedIds.length === 0} />

            <div className="member-picker-control">
                {selectedMembers.length > 0 && (
                    <div className="member-picker-chips">
                        {selectedMembers.map((member) => (
                            <span className="member-picker-chip" key={member.id}>
                                <span className="member-picker-chip-name">{member.name}</span>
                                <button
                                    type="button"
                                    className="member-picker-chip-remove"
                                    onClick={() => removeMember(member.id)}
                                    aria-label={`Remove ${member.name}`}
                                >
                                    <X size={12} aria-hidden="true" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    className="member-picker-trigger"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={`${name}-member-list`}
                >
                    <span className="member-picker-trigger-label">
                        {selectedMembers.length > 0
                            ? `${selectedMembers.length} selected`
                            : placeholder}
                    </span>
                    <ChevronDown size={16} aria-hidden="true" />
                </button>
            </div>

            {isOpen && (
                <div className="member-picker-dropdown" id={`${name}-member-list`}>
                    <div className="member-picker-search">
                        <Search size={16} aria-hidden="true" />
                        <input
                            ref={searchRef}
                            className="member-picker-search-input"
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                            placeholder="Type a name..."
                            aria-label="Search members"
                        />
                    </div>

                    <ul className="member-picker-options" role="listbox" aria-multiselectable="true">
                        {filteredMembers.length === 0 ? (
                            <li className="member-picker-empty">
                                {members.length === 0 ? 'no members available' : 'no members match'}
                            </li>
                        ) : (
                            filteredMembers.map((member) => {
                                const isSelected = selectedIds.includes(member.id);

                                return (
                                    <li key={member.id} role="option" aria-selected={isSelected}>
                                        <button
                                            type="button"
                                            className={`member-picker-option ${isSelected ? 'member-picker-option-selected' : ''}`}
                                            onClick={() => toggleMember(member.id)}
                                        >
                                            <span className="member-picker-check" aria-hidden="true">
                                                {isSelected && <Check size={14} />}
                                            </span>
                                            <span className="member-picker-option-copy">
                                                <span className="member-picker-option-name">{member.name}</span>
                                                {member.program && (
                                                    <span className="member-picker-option-meta">{member.program}</span>
                                                )}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
