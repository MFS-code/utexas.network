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

// Connection type for the network graph
export interface Connection {
  fromId: string;
  toId: string;
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
    profilePic: "https://scontent-dfw6-1.cdninstagram.com/v/t51.2885-19/428387567_367095602784291_9004954564172798434_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-dfw6-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2QF5JvV3vwfr9AJ4WScw8eUjXkglDBfq9aiu7zaEjAXJ9ERjuOjjO8UUD-6gRBGpVB4&_nc_ohc=Hy4lMZttZkoQ7kNvwEaUMIN&_nc_gid=BkyySvAg_Zt0cYr5N8AIIA&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfuN5XCK8Sfw5ESQ0MQa8iAdwMS2lLseeMsdZ-wyULaYSg&oe=699C478F&_nc_sid=7a9f4b",
    program: "Computer Science",
    year: "2027",
    linkedin: "https://www.linkedin.com/in/eric-zazovsky/",
    connections: ["miguel-serna", "gabriel-keller"],
  },
];

// Helper to get all connections for the network graph
export function getConnections(): Connection[] {
  const connections: Connection[] = [];
  
  members.forEach(member => {
    if (member.connections) {
      member.connections.forEach(targetId => {
        // Only add connection if target member exists
        if (members.some(m => m.id === targetId)) {
          connections.push({
            fromId: member.id,
            toId: targetId,
          });
        }
      });
    }
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
