'use client';

import React, { useState, useEffect } from 'react';
import { Member, Connection } from '@/data/members';
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
    connections: Connection[];
}

export default function SearchableContent({ members, connections }: SearchableContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [shuffledMembers, setShuffledMembers] = useState<Member[]>(members);
    const [showJoinForm, setShowJoinForm] = useState(false);
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

    const handleJoinSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitStatus(null);
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = {
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
                        <p>welcome to the official webring for university of texas at austin students.</p>
                        <p>
                            UT is home to ambitious engineers, builders, makers, artists, designers, and
                            writers. this directory helps you discover other longhorns building cool things
                            on the internet.
                        </p>
                        <p>
                            want to join? request access and we will review your submission manually.
                        </p>
                    </div>
                    <div className="join-actions">
                        {!showJoinForm && (
                            <button
                                type="button"
                                className="join-request-btn"
                                onClick={() => setShowJoinForm(true)}
                            >
                                request to join
                            </button>
                        )}
                        {submitStatus && (
                            <p className={`join-status join-status-${submitStatus.type}`}>{submitStatus.message}</p>
                        )}
                    </div>

                    {showJoinForm && (
                        <form className="join-form" onSubmit={handleJoinSubmit}>
                            <div className="join-form-grid">
                                <input className="join-input" name="fullName" required placeholder="Full name *" />
                                <input className="join-input" name="utEmail" required type="email" placeholder="UT email *" />
                                <input className="join-input" name="website" required type="url" placeholder="Personal website URL *" />
                                <input className="join-input" name="profilePic" required type="url" placeholder="Profile photo URL *" />
                                <input className="join-input" name="program" placeholder="Program / major" />
                                <input className="join-input" name="year" placeholder="Graduation year" />
                                <input className="join-input" name="twitter" type="url" placeholder="X / Twitter URL" />
                                <input className="join-input" name="instagram" type="url" placeholder="Instagram URL" />
                                <input className="join-input" name="linkedin" type="url" placeholder="LinkedIn URL" />
                                <input className="join-input join-input-wide" name="connections" placeholder="Connection IDs (comma-separated, optional)" />
                                <textarea className="join-textarea join-input-wide" name="notes" rows={4} placeholder="Anything else we should know?" />
                            </div>

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
                    )}
                </div>

                <div className="table-section">
                    <MembersTable members={filteredMembers} searchQuery={searchQuery} />
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
                    connections={connections} 
                    highlightedMemberIds={filteredMembers.map(m => m.id)}
                    searchQuery={searchQuery}
                />
            </div>
        </main>
    );
}
