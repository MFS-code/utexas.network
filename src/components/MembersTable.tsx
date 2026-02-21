import React from 'react';
import { Member, Project } from '@/data/members';
import { normalizeImageUrl } from '@/utils/profileImage';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface MembersTableProps {
    members: Member[];
    projects: Project[];
    searchQuery?: string;
}

export default function MembersTable({ members, projects, searchQuery }: MembersTableProps) {
    const getProjectAccentColor = (accentItem?: Project['accentItem']) => {
        if (typeof accentItem === 'string') {
            const hexMatch = accentItem.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
            if (hexMatch) {
                return `#${hexMatch[1]}`;
            }
        }
        switch (accentItem) {
            case 'yellow':
                return '#ffb81c';
            case 'white':
                return '#ffffff';
            case 'black':
                return '#111111';
            case 'red':
                return '#bf5700';
            default:
                return undefined;
        }
    };

    const highlightText = (text: string | null | undefined) => {
        if (!text || !searchQuery) return text || '';
        
        const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === searchQuery.toLowerCase() 
                ? <mark key={i} style={{ background: '#ffd54f', padding: '0 2px' }}>{part}</mark>
                : part
        );
    };

    return (
        <div className="members-table-container">
            {searchQuery && (
                <div className="search-results-info">
                    {members.length === 0 && projects.length === 0
                        ? `No results found for "${searchQuery}"`
                        : [
                            members.length > 0 ? `${members.length} member${members.length !== 1 ? 's' : ''}` : '',
                            projects.length > 0 ? `${projects.length} project${projects.length !== 1 ? 's' : ''}` : '',
                          ].filter(Boolean).join(', ')}
                </div>
            )}
            <table className="members-table">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>program</th>
                        <th>site</th>
                        <th>links</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={member.id}>
                            <td className="user-cell">
                                {member.profilePic ? (
                                    <img 
                                        src={normalizeImageUrl(member.profilePic)} 
                                        alt={member.name || 'Member'} 
                                        className={`avatar ${searchQuery && index === 0 ? 'avatar-highlighted' : ''}`}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                            if (fallback) fallback.style.display = '';
                                        }}
                                    />
                                ) : null}
                                {!member.profilePic ? (
                                    <div 
                                        className={`avatar ${searchQuery && index === 0 ? 'avatar-highlighted' : ''}`}
                                        style={{ backgroundColor: '#e0e0e0' }} 
                                    />
                                ) : (
                                    <div 
                                        className={`avatar ${searchQuery && index === 0 ? 'avatar-highlighted' : ''}`}
                                        style={{ backgroundColor: '#e0e0e0', display: 'none' }} 
                                    />
                                )}
                                {member.website && member.website.trim() ? (
                                    <a 
                                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="name-link"
                                    >
                                        {highlightText(member.name) || 'No name'}
                                    </a>
                                ) : (
                                <span>{highlightText(member.name) || 'No name'}</span>
                                )}
                            </td>
                            <td>{highlightText(member.program) || '—'}</td>
                            <td>
                                {member.website && member.website.trim() ? (
                                    <a 
                                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="site-link"
                                    >
                                        {member.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}
                                    </a>
                                ) : (
                                    <span className="table-placeholder">—</span>
                                )}
                            </td>
                            <td>
                                <div className="social-icons">
                                    {member.instagram && (
                                        <a 
                                            href={member.instagram} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="social-icon-link"
                                            title="Instagram"
                                        >
                                            <FaInstagram size={16} />
                                        </a>
                                    )}
                                    {member.twitter && (
                                        <a 
                                            href={member.twitter} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="social-icon-link"
                                            title="Twitter/X"
                                        >
                                            <FaXTwitter size={16} />
                                        </a>
                                    )}
                                    {member.linkedin && (
                                        <a 
                                            href={member.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="social-icon-link"
                                            title="LinkedIn"
                                        >
                                            <FaLinkedin size={16} />
                                        </a>
                                    )}
                                    {!member.instagram && !member.twitter && !member.linkedin && (
                                        <span className="table-placeholder">—</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {projects.length > 0 && (
                <>
                    <div className="projects-section-divider" />
                    <table className="members-table projects-table">
                        <thead>
                            <tr>
                                <th>project / org</th>
                                <th>description</th>
                                <th>site</th>
                                <th>links</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td className="user-cell">
                                        {project.profilePic ? (
                                            <img
                                                src={normalizeImageUrl(project.profilePic)}
                                                alt={project.name}
                                                className="avatar avatar-project"
                                                style={{ borderColor: getProjectAccentColor(project.accentItem) }}
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                    if (fallback) fallback.style.display = '';
                                                }}
                                            />
                                        ) : null}
                                        {!project.profilePic ? (
                                            <div
                                                className="avatar avatar-project"
                                                style={{ backgroundColor: '#e0e0e0', borderColor: getProjectAccentColor(project.accentItem) }}
                                            />
                                        ) : (
                                            <div
                                                className="avatar avatar-project"
                                                style={{ backgroundColor: '#e0e0e0', display: 'none', borderColor: getProjectAccentColor(project.accentItem) }}
                                            />
                                        )}
                                        {project.website ? (
                                            <a
                                                href={project.website.startsWith('http') ? project.website : `https://${project.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="name-link"
                                            >
                                                {highlightText(project.name)}
                                            </a>
                                        ) : (
                                            <span>{highlightText(project.name)}</span>
                                        )}
                                    </td>
                                    <td>{highlightText(project.description) || '—'}</td>
                                    <td>
                                        {project.website ? (
                                            <a
                                                href={project.website.startsWith('http') ? project.website : `https://${project.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="site-link"
                                            >
                                                {project.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}
                                            </a>
                                        ) : (
                                            <span className="table-placeholder">—</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="social-icons">
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="GitHub">
                                                    <FaGithub size={16} />
                                                </a>
                                            )}
                                            {project.instagram && (
                                                <a href={project.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Instagram">
                                                    <FaInstagram size={16} />
                                                </a>
                                            )}
                                            {project.twitter && (
                                                <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Twitter/X">
                                                    <FaXTwitter size={16} />
                                                </a>
                                            )}
                                            {project.linkedin && (
                                                <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="LinkedIn">
                                                    <FaLinkedin size={16} />
                                                </a>
                                            )}
                                            {!project.github && !project.instagram && !project.twitter && !project.linkedin && (
                                                <span className="table-placeholder">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
