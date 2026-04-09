import { NextRequest, NextResponse } from 'next/server';
import { members } from '@/data/members';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// API endpoint that returns webring members for the embed widget
// If userId is provided, returns that user's connections
// Otherwise returns all members
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    
    // Find the user if specified
    const user = userId ? members.find(m => m.id === userId) : null;
    
    // Get the user's connections, or fall back to all members
    let targetMembers;
    
    if (user && user.connections && user.connections.length > 0) {
        // Return only the user's specified connections
        targetMembers = members.filter(m => 
            user.connections!.includes(m.id) && m.website && m.website.trim()
        );
    } else {
        // Fallback: return all members with valid websites (excluding the user themselves)
        targetMembers = members.filter(m => 
            m.website && m.website.trim() && m.id !== userId
        );
    }
    
    return NextResponse.json({
        members: targetMembers.map(m => ({
            id: m.id,
            name: m.name,
            website: m.website,
        })),
    }, {
        headers: corsHeaders,
    });
}
