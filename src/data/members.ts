/**
 * UTEXAS WEBRING MEMBERS
 *
 * Member entries are manually reviewed from the join form and then added here.
 *
 * Required fields:
 * - id: Name with hyphens (e.g., "jane-doe")
 * - name: Full name
 * - website: Personal website URL
 *
 * Optional fields:
 * - program: Program or major
 * - year: Graduation year
 * - profilePic: Path to photo in /public/photos
 * - instagram: Full URL
 * - twitter: Full URL
 * - linkedin: Full URL
 * - connections: IDs of other members
 */

export interface Member {
  id: string;
  name: string;
  website: string;
  program?: string;
  year?: string;
  profilePic?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  connections?: string[]; // IDs of other members you want to connect with
}

/**
 * PROJECTS & ORGS
 *
 * Shared projects or organizations involving two or more members.
 * These appear as a separate category in the list and as distinct
 * nodes (with dotted-line edges) in the network graph.
 *
 * Required fields:
 * - id: Slug with hyphens (e.g., "cool-project")
 * - name: Display name
 * - memberIds: IDs of member participants (minimum 2)
 *
 * Optional fields:
 * - description: Short blurb
 * - website: Project / org URL
 * - profilePic: Logo or image URL
 * - instagram, twitter, linkedin, github: Social links
 */
export interface Project {
  id: string;
  name: string;
  memberIds: string[];
  description?: string;
  website?: string;
  profilePic?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

// Connection type for the network graph
export interface Connection {
  fromId: string;
  toId: string;
  dotted?: boolean;
}

export const members: Member[] = [
  // Example entry:
  // {
  //   id: "john-doe",
  //   name: "John Doe",
  //   website: "https://johndoe.com",
  //   profilePic: "/photos/john-doe.jpg",
  //   program: "Computer Science",
  //   year: "2028",
  //   twitter: "https://x.com/johndoe",
  //   linkedin: "https://linkedin.com/in/johndoe",
  //   connections: [],
  // },
  {
    id: "miguel-serna",
    name: "Miguel Serna",
    website: "https://mfserna.dev",
    profilePic: "https://www.mfserna.dev/photos/headshot.webp",
    program: "Computer Science",
    year: "2027",
    instagram: "https://www.instagram.com/mfserna_/",
    twitter: "https://x.com/miguelfserna",
    linkedin: "https://www.linkedin.com/in/mfserna/",
    connections: [],
  },
  {
    id: "gabriel-keller",
    name: "Gabriel Keller",
    website: "https://www.keller.cv/",
    profilePic: "https://pbs.twimg.com/profile_images/1954231097962663936/e-MdQDp6_400x400.jpg",
    program: "Computer Science",
    year: "2027",
    instagram: "https://www.instagram.com/atxgabe/",
    twitter: "https://x.com/gabrieljkeller",
    linkedin: "https://linkedin.com/in/gjkeller",
    connections: ["miguel-serna"],
  },
  {
    id: "eric-zazovsky",
    name: "Eric Zazovsky",
    website: "https://ezazovsky.github.io/",
    profilePic: "https://avatars.githubusercontent.com/u/70543279?v=4",
    program: "Computer Science",
    year: "2027",
    linkedin: "https://www.linkedin.com/in/eric-zazovsky/",
    connections: ["miguel-serna", "gabriel-keller"],
  },
  {
    id: "nicolas-garza",
    name: "Nicolas Garza",
    website: "https://nicolas.ai",
    profilePic: "https://i.ibb.co/q3y0Nw1R/518599989-18086923360776720-5534035868491386411-n.jpg",
    program: "Computer Science",
    year: "2027",
    instagram: "https://www.instagram.com/nicolasgarza_/",
    linkedin: "https://www.linkedin.com/in/nicolas-garza/",
    connections: ["gabriel-keller"],
  },
];

export const projects: Project[] = [
  {
    id: "agent-ops",
    name: "Agent Operations Lab",
    memberIds: ["miguel-serna", "gabriel-keller"],
    description: "Reinventing inventing agents",
    profilePic: "https://pbs.twimg.com/profile_images/2016047683505438720/aIQMt7Yy_400x400.png",
    website: "https://agentops.sh",
    twitter: "https://x.com/agentopslab",
    linkedin: "https://www.linkedin.com/company/agentopslab/",
  },
];

// Helper to get all connections for the network graph
export function getConnections(): Connection[] {
  const connections: Connection[] = [];
  
  members.forEach(member => {
    if (member.connections) {
      member.connections.forEach(targetId => {
        if (members.some(m => m.id === targetId)) {
          connections.push({
            fromId: member.id,
            toId: targetId,
          });
        }
      });
    }
  });

  projects.forEach(project => {
    project.memberIds.forEach(memberId => {
      if (members.some(m => m.id === memberId)) {
        connections.push({
          fromId: project.id,
          toId: memberId,
          dotted: true,
        });
      }
    });
  });
  
  return connections;
}

// Helper to get the next and previous members for webring navigation
export function getWebringNavigation(currentWebsite: string): { prev: Member | null; next: Member | null } {
  const index = members.findIndex(m => m.website === currentWebsite);
  if (index === -1) {
    return { prev: null, next: null };
  }
  
  const prevIndex = (index - 1 + members.length) % members.length;
  const nextIndex = (index + 1) % members.length;
  
  return {
    prev: members[prevIndex],
    next: members[nextIndex],
  };
}

// Get a random member (useful for the webring widget)
export function getRandomMember(): Member {
  return members[Math.floor(Math.random() * members.length)];
}
