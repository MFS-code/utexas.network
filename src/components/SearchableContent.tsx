'use client';

import React, { useState, useEffect } from 'react';
import { Member, Project, Connection } from '@/data/members';
import MembersTable from './MembersTable';
import NetworkGraph from './NetworkGraph';
import AsciiBackground from './AsciiBackground';
import { Search } from 'lucide-react';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface SearchableContentProps {
    members: Member[];
    projects: Project[];
    connections: Connection[];
}

const PINNED_MEMBER_ID = 'miguel-serna';

function prioritizePinnedMember(memberList: Member[]): Member[] {
    const pinnedMember = memberList.find((member) => member.id === PINNED_MEMBER_ID);
    if (!pinnedMember) return memberList;

    return [pinnedMember, ...memberList.filter((member) => member.id !== PINNED_MEMBER_ID)];
}

export default function SearchableContent({ members, projects, connections }: SearchableContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [shuffledMembers, setShuffledMembers] = useState<Member[]>(members);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [formType, setFormType] = useState<'member' | 'project'>('member');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    
    // Shuffle members only on client side after hydration
    useEffect(() => {
        setShuffledMembers(shuffleArray(members));
    }, [members]);

    const filteredMembers = searchQuery
        ? shuffledMembers.filter(member =>
            member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.program?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.website?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : shuffledMembers;
    const displayedMembers = prioritizePinnedMember(filteredMembers);

    const filteredProjects = searchQuery
        ? projects.filter(project =>
            project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.website?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : projects;

    const handleJoinSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitStatus(null);
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const payload = formType === 'project'
            ? {
                type: 'project' as const,
                projectName: String(formData.get('projectName') || ''),
                contactEmail: String(formData.get('contactEmail') || ''),
                memberIds: String(formData.get('memberIds') || ''),
                description: String(formData.get('description') || ''),
                website: String(formData.get('website') || ''),
                profilePic: String(formData.get('profilePic') || ''),
                twitter: String(formData.get('twitter') || ''),
                instagram: String(formData.get('instagram') || ''),
                linkedin: String(formData.get('linkedin') || ''),
                github: String(formData.get('github') || ''),
                notes: String(formData.get('notes') || ''),
            }
            : {
                type: 'member' as const,
                fullName: String(formData.get('fullName') || ''),
                utEmail: String(formData.get('utEmail') || ''),
                website: String(formData.get('website') || ''),
                profilePic: String(formData.get('profilePic') || ''),
                program: String(formData.get('program') || ''),
                year: String(formData.get('year') || ''),
                twitter: String(formData.get('twitter') || ''),
                instagram: String(formData.get('instagram') || ''),
                linkedin: String(formData.get('linkedin') || ''),
                connections: String(formData.get('connections') || ''),
                notes: String(formData.get('notes') || ''),
            };

        if (formType === 'project') {
            const ids = (payload as { memberIds: string }).memberIds
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
            const hasConnection = ids.some(id => members.some(m => m.id === id));
            if (!hasConnection) {
                setSubmitStatus({
                    type: 'error',
                    message: 'At least one member ID must match an existing member in the network.',
                });
                setIsSubmitting(false);
                return;
            }
        }

        try {
            const response = await fetch('/api/join-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit request');
            }

            form.reset();
            setSubmitStatus({
                type: 'success',
                message: 'Request sent. You will receive updates after a manual review.',
            });
            setShowJoinForm(false);
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Submission failed. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="main-container">
            <AsciiBackground />
            <div className="content-wrapper">
                <div className="header-section">
                    <div className="title-row">
                        <h1 className="title">utexas.network</h1>
                    </div>
                    <div className="description">
                        <p>Welcome to the unofficial webring for builders at the university of texas at austin.</p>
                        <p>
                            From engineers and founders to artists, designers, and writers, 
                            UT has people building all kinds of cool stuff online. 
                            This directory makes it easier to find and connect with fellow Longhorns and their work.
                        </p>
                        <p>
                            want to join? request access and your submission will be reviewed manually.
                        </p>
                    </div>
                    <div className="join-actions">
                        <button
                            type="button"
                            className="join-request-btn"
                            onClick={() => setShowJoinForm(true)}
                        >
                            request to join
                        </button>
                        {submitStatus && (
                            <p className={`join-status join-status-${submitStatus.type}`}>{submitStatus.message}</p>
                        )}
                    </div>
                </div>

                <div className="table-section">
                    <MembersTable members={displayedMembers} projects={filteredProjects} searchQuery={searchQuery} />
                </div>
            </div>

            <div className="graph-section">
                <div className="search-bar-container">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="search-clear-btn"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <NetworkGraph 
                    members={members}
                    projects={projects}
                    connections={connections} 
                    highlightedMemberIds={[...displayedMembers.map(m => m.id), ...filteredProjects.map(p => p.id)]}
                    searchQuery={searchQuery}
                />
            </div>

            {showJoinForm && (
                <div
                    className="join-modal-overlay"
                    onClick={() => !isSubmitting && setShowJoinForm(false)}
                    role="presentation"
                >
                    <div
                        className="join-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Request to join"
                    >
                        <div className="join-modal-header">
                            <h2>{formType === 'project' ? 'submit a project / org' : 'request to join'}</h2>
                            <button
                                type="button"
                                className="join-modal-close"
                                onClick={() => setShowJoinForm(false)}
                                disabled={isSubmitting}
                                aria-label="Close"
                            >
                                x
                            </button>
                        </div>

                        <div className="form-type-toggle">
                            <button
                                type="button"
                                className={`form-type-btn ${formType === 'member' ? 'form-type-btn-active' : ''}`}
                                onClick={() => setFormType('member')}
                            >
                                member
                            </button>
                            <button
                                type="button"
                                className={`form-type-btn ${formType === 'project' ? 'form-type-btn-active' : ''}`}
                                onClick={() => setFormType('project')}
                            >
                                project / org
                            </button>
                        </div>

                        <form className="join-form" onSubmit={handleJoinSubmit}>
                            {formType === 'member' ? (
                                <>
                                    <div className="join-form-grid">
                                        <input className="join-input" name="fullName" required placeholder="Full name *" />
                                        <input className="join-input" name="utEmail" required type="email" placeholder="UT email *" />
                                        <input className="join-input" name="website" required type="url" placeholder="Personal website URL *" />
                                        <input className="join-input" name="profilePic" required type="url" placeholder="Profile photo URL (direct link, Google Drive) *" />
                                        <input className="join-input" name="program" placeholder="Program / major" />
                                        <input className="join-input" name="year" placeholder="Graduation year" />
                                        <input className="join-input" name="twitter" type="url" placeholder="X / Twitter URL" />
                                        <input className="join-input" name="instagram" type="url" placeholder="Instagram URL" />
                                        <input className="join-input" name="linkedin" type="url" placeholder="LinkedIn URL" />
                                        <input className="join-input join-input-wide" name="connections" placeholder="Connection IDs (comma-separated, optional)" />
                                        <textarea className="join-textarea join-input-wide" name="notes" rows={4} placeholder="Anything else we should know?" />
                                    </div>
                                    <p className="join-tip">
                                        tip: IDs are generated as <code>firstname-lastname</code>, all lowercase.
                                        Any space is converted to <code>-</code>.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="join-form-grid">
                                        <input className="join-input" name="projectName" required placeholder="Project / org name *" />
                                        <input className="join-input" name="contactEmail" required type="email" placeholder="Contact email *" />
                                        <input className="join-input join-input-wide" name="memberIds" required placeholder="Member IDs (comma-separated, at least one existing member) *" />
                                        <input className="join-input join-input-wide" name="description" placeholder="Short description" />
                                        <input className="join-input" name="website" type="url" placeholder="Project website URL" />
                                        <input className="join-input" name="profilePic" type="url" placeholder="Logo / image URL" />
                                        <input className="join-input" name="twitter" type="url" placeholder="X / Twitter URL" />
                                        <input className="join-input" name="instagram" type="url" placeholder="Instagram URL" />
                                        <input className="join-input" name="linkedin" type="url" placeholder="LinkedIn URL" />
                                        <input className="join-input" name="github" type="url" placeholder="GitHub URL" />
                                        <textarea className="join-textarea join-input-wide" name="notes" rows={4} placeholder="Anything else we should know?" />
                                    </div>
                                    <p className="join-tip">
                                        at least one member ID must belong to someone already in the network.
                                        IDs follow the <code>firstname-lastname</code> format.
                                    </p>
                                </>
                            )}

                            <div className="join-form-actions">
                                <button type="submit" className="join-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit for review'}
                                </button>
                                <button
                                    type="button"
                                    className="join-cancel-btn"
                                    onClick={() => setShowJoinForm(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="template-credit">
                inspired by{' '}
                <a
                    href="https://uwaterloo.network"
                    target="_blank"
                    rel="noreferrer"
                    className="template-credit-link"
                >
                    uwaterloo.network
                </a>
            </div>
        </main>
    );
}
