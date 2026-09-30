import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Project } from '@/data/members';

interface ProjectPickerProps {
    name: string;
    projects: Project[];
    required?: boolean;
    placeholder?: string;
}

function matchesQuery(project: Project, query: string): boolean {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;

    return (
        project.name?.toLowerCase().includes(normalized) ||
        project.description?.toLowerCase().includes(normalized) ||
        project.id.toLowerCase().includes(normalized)
    );
}

export default function ProjectPicker({
    name,
    projects,
    required = false,
    placeholder = 'Search projects...',
}: ProjectPickerProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const projectsById = useMemo(() => {
        const map = new Map<string, Project>();
        projects.forEach((project) => map.set(project.id, project));
        return map;
    }, [projects]);

    const selectedProjects = useMemo(
        () => selectedIds.map((id) => projectsById.get(id)).filter((project): project is Project => Boolean(project)),
        [projectsById, selectedIds]
    );

    const filteredProjects = useMemo(
        () => projects
            .filter((project) => matchesQuery(project, query))
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name)),
        [projects, query]
    );

    const value = selectedIds.join(',');

    const toggleProject = (id: string) => {
        setSelectedIds((current) => (
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id]
        ));
    };

    const removeProject = (id: string) => {
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
                {selectedProjects.length > 0 && (
                    <div className="member-picker-chips">
                        {selectedProjects.map((project) => (
                            <span className="member-picker-chip" key={project.id}>
                                <span className="member-picker-chip-name">{project.name}</span>
                                <button
                                    type="button"
                                    className="member-picker-chip-remove"
                                    onClick={() => removeProject(project.id)}
                                    aria-label={`Remove ${project.name}`}
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
                    aria-controls={`${name}-project-list`}
                >
                    <span className="member-picker-trigger-label">
                        {selectedProjects.length > 0
                            ? `${selectedProjects.length} selected`
                            : placeholder}
                    </span>
                    <ChevronDown size={16} aria-hidden="true" />
                </button>
            </div>

            {isOpen && (
                <div className="member-picker-dropdown" id={`${name}-project-list`}>
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
                            aria-label="Search projects"
                        />
                    </div>

                    <ul className="member-picker-options" role="listbox" aria-multiselectable="true">
                        {filteredProjects.length === 0 ? (
                            <li className="member-picker-empty">
                                {projects.length === 0 ? 'no projects available' : 'no projects match'}
                            </li>
                        ) : (
                            filteredProjects.map((project) => {
                                const isSelected = selectedIds.includes(project.id);

                                return (
                                    <li key={project.id} role="option" aria-selected={isSelected}>
                                        <button
                                            type="button"
                                            className={`member-picker-option ${isSelected ? 'member-picker-option-selected' : ''}`}
                                            onClick={() => toggleProject(project.id)}
                                        >
                                            <span className="member-picker-check" aria-hidden="true">
                                                {isSelected && <Check size={14} />}
                                            </span>
                                            <span className="member-picker-option-copy">
                                                <span className="member-picker-option-name">{project.name}</span>
                                                {project.description && (
                                                    <span className="member-picker-option-meta">{project.description}</span>
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
