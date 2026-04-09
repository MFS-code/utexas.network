'use client';

import React from 'react';
import { members, projects, Project, Member } from '@/data/members';
import { normalizeImageUrl } from '@/utils/profileImage';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import AsciiBackground from '@/components/AsciiBackground';
import Link from 'next/link';

function getMemberById(id: string): Member | undefined {
  return members.find(m => m.id === id);
}

function getAccentColor(accentItem?: string): string | undefined {
  if (typeof accentItem === 'string') {
    const hexMatch = accentItem.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) return `#${hexMatch[1]}`;
  }
  switch (accentItem) {
    case 'yellow': return '#ffb81c';
    case 'white': return '#ffffff';
    case 'black': return '#111111';
    case 'red': return '#bf5700';
    default: return undefined;
  }
}

const SUBMIT_PROJECT_HREF = '/?join=project';

export default function ProjectsPage() {
  return (
    <main className="main-container projects-page">
      <AsciiBackground />
      <div className="projects-page-content">
        <div className="projects-page-header">
          <Link href="/" className="projects-back-link">
            <ArrowLeft size={16} />
            <span>back to directory</span>
          </Link>
          <h1 className="title">projects &amp; orgs</h1>
          <p className="description" style={{ maxWidth: 600 }}>
            Things being built by people in the network. From startups to student orgs, here&apos;s what Longhorns are working on.
          </p>
          <Link href={SUBMIT_PROJECT_HREF} className="project-submit-link">
            <Plus size={15} />
            <span>submit a project</span>
          </Link>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const accent = getAccentColor(project.accentItem);
            const projectMembers = project.memberIds
              .map(getMemberById)
              .filter((m): m is Member => !!m);

            return (
              <article
                key={project.id}
                className="project-card"
                style={{ '--project-accent': accent || '#bf5700' } as React.CSSProperties}
              >
                <div className="project-card-header">
                  {project.profilePic ? (
                    <img
                      src={normalizeImageUrl(project.profilePic)}
                      alt={project.name}
                      className="project-card-logo"
                      style={accent ? { borderColor: accent } : undefined}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = '';
                      }}
                    />
                  ) : null}
                  {!project.profilePic ? (
                    <div
                      className="project-card-logo"
                      style={{ backgroundColor: '#e0e0e0', ...(accent ? { borderColor: accent } : {}) }}
                    />
                  ) : (
                    <div
                      className="project-card-logo"
                      style={{ backgroundColor: '#e0e0e0', display: 'none', ...(accent ? { borderColor: accent } : {}) }}
                    />
                  )}
                  <div className="project-card-title-group">
                    <h2 className="project-card-name">{project.name}</h2>
                    {project.description && (
                      <p className="project-card-desc">{project.description}</p>
                    )}
                  </div>
                </div>

                {project.website && (
                  <a
                    href={project.website.startsWith('http') ? project.website : `https://${project.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-website"
                  >
                    <ExternalLink size={14} />
                    <span>{project.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}</span>
                  </a>
                )}

                {projectMembers.length > 0 && (
                  <div className="project-card-members">
                    <span className="project-card-members-label">members</span>
                    <div className="project-card-members-list">
                      {projectMembers.slice(0, 3).map((member) => (
                        <Link
                          key={member.id}
                          href={`/#member-${member.id}`}
                          className="project-card-member-chip"
                        >
                          {member.profilePic && (
                            <img
                              src={normalizeImageUrl(member.profilePic)}
                              alt={member.name}
                              className="project-card-member-avatar"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span>{member.name}</span>
                        </Link>
                      ))}
                      {projectMembers.length > 3 && (
                        <span className="project-card-member-chip project-card-member-overflow">
                          +{projectMembers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="project-card-socials">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="GitHub">
                      <FaGithub size={16} />
                    </a>
                  )}
                  {project.twitter && (
                    <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Twitter/X">
                      <FaXTwitter size={16} />
                    </a>
                  )}
                  {project.instagram && (
                    <a href={project.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Instagram">
                      <FaInstagram size={16} />
                    </a>
                  )}
                  {project.linkedin && (
                    <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-link" title="LinkedIn">
                      <FaLinkedin size={16} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
