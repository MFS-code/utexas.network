'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Member, Project, Connection } from '@/data/members';
import MembersTable from './MembersTable';
import NetworkGraph from './NetworkGraph';
import AsciiBackground from './AsciiBackground';
import { Search } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

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
const GOOGLE_OAUTH_SOURCE = 'google-oauth';
const EDU_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.edu$/i;

interface GoogleOAuthProfile {
    name: string;
    email: string;
    picture: string;
}

interface GoogleOAuthMessage {
    source: string;
    success: boolean;
    state?: string;
    error?: string;
    profile?: GoogleOAuthProfile;
}

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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const joinFormRef = useRef<HTMLFormElement | null>(null);
    const oauthPopupRef = useRef<Window | null>(null);
    const oauthPopupTimerRef = useRef<number | null>(null);
    const oauthStateRef = useRef<string | null>(null);
    
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

    const clearOAuthPopupWatcher = () => {
        if (oauthPopupTimerRef.current !== null) {
            window.clearInterval(oauthPopupTimerRef.current);
            oauthPopupTimerRef.current = null;
        }
    };

    const isEduEmail = (email: string): boolean => EDU_EMAIL_REGEX.test(email.trim());

    const setJoinInputValue = (name: string, value: string) => {
        const field = joinFormRef.current?.elements.namedItem(name);
        if (
            !field ||
            !(
                field instanceof HTMLInputElement ||
                field instanceof HTMLTextAreaElement ||
                field instanceof HTMLSelectElement
            )
        ) {
            return;
        }
        field.value = value;
    };

    useEffect(() => {
        const onOAuthMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            const data = event.data as GoogleOAuthMessage;
            if (!data || data.source !== GOOGLE_OAUTH_SOURCE) {
                return;
            }

            if (data.state && oauthStateRef.current && data.state !== oauthStateRef.current) {
                return;
            }

            clearOAuthPopupWatcher();
            oauthPopupRef.current = null;
            oauthStateRef.current = null;
            setIsGoogleLoading(false);

            if (!data.success) {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Google sign-in failed. You can still fill the form manually.',
                });
                return;
            }

            const profile = data.profile;
            if (!profile) {
                setSubmitStatus({
                    type: 'error',
                    message: 'Google profile was empty. Please fill the form manually.',
                });
                return;
            }

            setJoinInputValue('fullName', profile.name || '');
            setJoinInputValue('utEmail', profile.email || '');
            setJoinInputValue('profilePic', profile.picture || '');

            if (profile.email && !isEduEmail(profile.email)) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Google profile imported. Please use your .edu email before submitting.',
                });
                return;
            }

            setSubmitStatus({
                type: 'success',
                message: 'Google profile imported. Please complete the remaining fields.',
            });
        };

        window.addEventListener('message', onOAuthMessage);
        return () => {
            window.removeEventListener('message', onOAuthMessage);
            clearOAuthPopupWatcher();
        };
    }, []);

    const handleGoogleSignIn = () => {
        setSubmitStatus(null);

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            setSubmitStatus({
                type: 'error',
                message: 'Google sign-in is not configured yet.',
            });
            return;
        }

        const redirectUri = `${window.location.origin}/api/auth/google/callback`;
        const state = typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        oauthStateRef.current = state;

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile',
            state,
            prompt: 'select_account',
        });

        const popup = window.open(
            `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
            'google-oauth-popup',
            'width=500,height=650,menubar=no,toolbar=no,location=no,status=no'
        );

        if (!popup) {
            setSubmitStatus({
                type: 'error',
                message: 'Popup blocked. Allow popups to use Google sign-in.',
            });
            oauthStateRef.current = null;
            return;
        }

        oauthPopupRef.current = popup;
        setIsGoogleLoading(true);

        clearOAuthPopupWatcher();
        oauthPopupTimerRef.current = window.setInterval(() => {
            if (!oauthPopupRef.current || oauthPopupRef.current.closed) {
                clearOAuthPopupWatcher();
                oauthPopupRef.current = null;
                oauthStateRef.current = null;
                setIsGoogleLoading(false);
            }
        }, 500);
    };

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
                accentItem: String(formData.get('accentItem') || ''),
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

        if (formType === 'member') {
            const utEmail = (payload as { utEmail: string }).utEmail.trim();
            if (!isEduEmail(utEmail)) {
                setSubmitStatus({
                    type: 'error',
                    message: 'Please use your .edu email before submitting.',
                });
                setIsSubmitting(false);
                return;
            }
        }

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
                        {!showJoinForm && submitStatus?.type === 'error' && (
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

                        <form className="join-form" onSubmit={handleJoinSubmit} ref={joinFormRef}>
                            {formType === 'member' ? (
                                <>
                                    <div className="google-auth-cta">
                                        <button
                                            type="button"
                                            className="google-auth-btn"
                                            onClick={handleGoogleSignIn}
                                            disabled={isSubmitting || isGoogleLoading}
                                        >
                                            <FcGoogle size={20} aria-hidden="true" />
                                            <span>{isGoogleLoading ? 'connecting google...' : 'continue with google'}</span>
                                        </button>
                                        <p className="google-auth-note">Prefills name, email, and profile photo.</p>
                                    </div>
                                    {submitStatus && (
                                        <p className={`join-status join-status-${submitStatus.type} join-modal-status`}>
                                            {submitStatus.message}
                                        </p>
                                    )}
                                    <div className="join-form-grid">
                                        <input className="join-input" name="fullName" required placeholder="Full name *" />
                                        <input
                                            className="join-input"
                                            name="utEmail"
                                            required
                                            type="email"
                                            onChange={(event) => {
                                                if (isEduEmail(event.target.value) && submitStatus?.type === 'error') {
                                                    setSubmitStatus(null);
                                                }
                                            }}
                                            placeholder="UT .edu email *"
                                            title="Please use your .edu email address."
                                        />
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
                                        <input
                                            className="join-input"
                                            name="accentItem"
                                            placeholder="Accent item (default, red, yellow, white, black, or #2E4258)"
                                        />
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
