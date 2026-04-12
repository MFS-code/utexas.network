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
 * - accentItem: Optional accent style for project cards/graph (named color or hex)
 * - instagram, twitter, linkedin, github: Social links
 */
export interface Project {
  id: string;
  name: string;
  memberIds: string[];
  description?: string;
  website?: string;
  profilePic?: string;
  accentItem?: string;
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
  {
    id: "anush-sonone",
    name: "anush sonone",
    website: "https://anush.wiki/",
    profilePic: "https://anush.wiki/public/about/selfie.jpeg",
    program: "Computer Science",
    year: "2028",
    instagram: "https://noinsta",
    twitter: "https://notwitter",
    linkedin: "https://www.linkedin.com/in/anushse/",
    connections: ["miguel-serna"],
  },
  {
    id: "jayden-ruddock",
    name: "Jayden Ruddock",
    website: "https://spacewalker215.github.io/MyPortfolio/",
    profilePic: "https://media.licdn.com/dms/image/v2/D4E22AQFOT7Uln_C8Mg/feedshare-shrink_800/B4EZoieajlIUAk-/0/1761514990271?e=2147483647&v=beta&t=QMtCRzVDBVrGVq2G2PSprIUYlYU-YtgG3_ZIXtxEsQs",
    program: "Computer Science",
    year: "2028",
    linkedin: "https://www.linkedin.com/in/jaydenruddock/",
    connections: ["miguel-serna"],
  },
  {
    id: "colin-angel",
    name: "Colin Angel",
    website: "https://colinangel.com",
    profilePic: "https://colinangel.com/icon.png",
    program: "Electrical & Computer Engineering",
    year: "2025",
    linkedin: "https://www.linkedin.com/in/colinjangel/",
    connections: ["miguel-serna"],
  },
  {
    id: "kaustubh-duddala",
    name: "Kaustubh Duddala",
    website: "https://kaustubh.duddala.com",
    profilePic: "https://scontent-dfw6-1.cdninstagram.com/v/t51.82787-19/588736226_18165472369383009_4175213519499641579_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=101&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy42MTMuQzMifQ%3D%3D&_nc_ohc=_C2rOfbyth8Q7kNvwHQEZk0&_nc_oc=Adrc6IzYVtIo3ryCNmM9OBzQZLDcOyaa-ENUdW-fAGukjMege7EklVcokR-xHqAeLR0&_nc_zt=24&_nc_ht=scontent-dfw6-1.cdninstagram.com&_nc_gid=IM_kC6TY8HyeDWJu5TYsSA&_nc_ss=7a289&oh=00_Af3oD4dyV6IjdDcGBpZZwZklA9nza6MSQhXESn8UeBjYMw&oe=69E0ABBC",
    program: "Statistics & Data Science",
    year: "2028",
    instagram: "https://www.instagram.com/kaustubh.duddala/",
    linkedin: "https://www.linkedin.com/in/kaustubhduddala/",
    connections: [],
  },
  {
    id: "praneel-seth",
    name: "Praneel Seth",
    website: "https://praneelseth.com",
    profilePic: "https://drive.google.com/file/d/162GAO_pzsZZ3EpkxstHXN6jT7J1Z-cny/view?usp=sharing",
    program: "Computer Science & Mathematics",
    year: "May 2027",
    instagram: "https://instagram.com/praneelseth",
    twitter: "https://x.com/praneelseth",
    linkedin: "https://linkedin.com/in/praneelseth",
    connections: ["miguel-serna", "gabriel-keller"],
  },
  {
    id: "nathan-brown",
    name: "Nathan Brown",
    website: "https://www.njbrown.com",
    profilePic: "https://drive.google.com/file/d/1vY6Q2clGgoZMVpQk4JfIU5pyIf4VZiMd/view?usp=sharing",
    program: "Mathematics",
    year: "2028",
    linkedin: "https://www.linkedin.com/in/nj-brown/",
    connections: [],
  },
  {
    id: "neev-gupta",
    name: "Neev Gupta",
    website: "https://neevgupta.com",
    profilePic: "https://drive.google.com/file/d/1ip8578b_fC5325gbgc00hFN9v6cT_di-/view?usp=drivesdk",
    program: "Computer Science",
    year: "2029",
    linkedin: "https://linkedin.com/in/neevgupta",
    connections: [],
  },
  {
    id: "parth-mehta",
    name: "Parth Mehta",
    website: "https://makistry.com",
    profilePic: "https://drive.google.com/file/d/1qsenb4ASDHonB4UTNBhgmHXyJ3RNA5fA/view?usp=sharing",
    program: "Mechanical Engineering + Economics",
    year: "2028",
    instagram: "https://www.instagram.com/parthmehta1005/",
    linkedin: "https://www.linkedin.com/in/parth-mehta100",
    connections: [],
  },
  {
    id: "ayman-mahfuz",
    name: "Ayman Mahfuz",
    website: "https://aymanmahfuzportfolio.com/",
    profilePic: "https://www.aymanmahfuzportfolio.com/Facetune_07-05-2024-16-02-47.jpg",
    program: "Computer Science",
    year: "2027",
    instagram: "https://www.instagram.com/aymanmahfuz05/",
    twitter: "https://x.com/AymanMahfuz10",
    linkedin: "https://www.linkedin.com/in/aymanmahfuz/",
    connections: ["miguel-serna"],
  },
  {
    id: "abdelgadir-osman",
    name: "Abdelgadir Osman",
    website: "https://abdelgadirosman.com/",
    profilePic: "https://drive.google.com/file/d/1RTB7V6deuVCdpgNRDmXwvEuFnrbAkL34/view?usp=sharing",
    program: "Electrical & Computer Engineering",
    year: "2027",
    linkedin: "https://www.linkedin.com/in/abdelgadir-osman/",
    connections: [],
  },
  {
    id: "karmanyaah-malhotra",
    name: "Karmanyaah Malhotra",
    website: "https://karmanyaah.com",
    profilePic: "https://drive.google.com/file/d/1u2_pzgH2nZjcgSX76PRqo_k2WqDRaMvV/view?usp=sharing",
    program: "Computer Science",
    year: "2027",
    linkedin: "https://www.linkedin.com/in/karmanyaahm/",
    connections: ["praneel-seth","nicolas-garza","nathan-brown","gabriel-keller"],
  },
  {
    id: "siddhartha-venkatayogi",
    name: "Siddhartha Venkatayogi",
    website: "https://sidvenkatayogi.github.io/",
    profilePic: "https://drive.google.com/file/d/1OYaciysUGvPgWF44bFLN63qBFv2qLDIs/view?usp=sharing",
    program: "Computer Science",
    year: "2029",
    instagram: "https://www.instagram.com/sidvenkatayogi/",
    twitter: "https://x.com/sidvenkatayogi",
    linkedin: "https://www.linkedin.com/in/sidvenkatayogi/",
    connections: ["miguel-serna"],
  },
  {
    id: "sairaja-kurelli",
    name: "Sairaja Kurelli",
    website: "https://saikurelli.github.io/",
    profilePic: "https://media.licdn.com/dms/image/v2/D5603AQHxZ9jogMj5ew/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1684681830844?e=2147483647&v=beta&t=dXjEerg8JKQUlmK8Mer1h7Hhw53EUdnLyz6HOqqKS-E",
    program: "Computer Science",
    year: "2025",
    linkedin: "https://www.linkedin.com/in/sai-kurelli",
    connections: ["gabriel-keller"],
  },
  {
    id: "nick-khami",
    name: "Nick Khami",
    website: "https://www.skeptrune.com",
    profilePic: "https://www.skeptrune.com/_astro/profile-photo-cropped.D4VqkvR7.webp",
    program: "Computer Science",
    year: "2022",
    twitter: "https://x.com/skeptrune",
    linkedin: "https://linkedin.com/in/nkhami",
    connections: [],
  },
  {
    id: "terence-dumas",
    name: "Terence Dumas",
    website: "https://www.terencedumas.com/",
    profilePic: "https://scontent-dfw5-1.cdninstagram.com/v/t51.82787-19/534309785_18285220378257836_8156068965182853089_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=111&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=eq5f3p789k4Q7kNvwGnUD4n&_nc_oc=AdrQuJw3Ha0F3i8ow-2RVSQg9-G5pjTM9mBoiZuVxvnrpMgTPqbh9uJrdW6OUTdiaHQ&_nc_zt=24&_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_gid=O6U8SnJxpXAsobP-sKv4TQ&_nc_ss=7a289&oh=00_Af1FTGiUPQFHYxpQJiY5iDuE08Im1I5ZALPjklFrFpXg_Q&oe=69E0CE6A",
    program: "Computer Science & Mathematics",
    year: "2027",
    instagram: "https://www.instagram.com/terence_le_bo/",
    linkedin: "https://www.linkedin.com/in/dumast/",
    connections: ["miguel-serna"],
  },
  {
    id: "tanner-kopel",
    name: "Tanner Kopel",
    website: "https://lumedatinggame.com/",
    profilePic: "https://lh3.googleusercontent.com/a/ACg8ocIRHTPBec_-LCQJ-rRmULjD_Um22epBS9sSjAD1Jr0wQ1zoraxL=s96-c",
    program: "Radio/Television/Film",
    year: "2027",
    instagram: "https://www.instagram.com/tankop1/",
    linkedin: "https://www.linkedin.com/in/tannerkopel/",
    connections: [],
  },
  {
    id: "aniket-chandekar",
    name: "Aniket Vinod Chandekar",
    website: "https://www.aniketchandekar.com",
    profilePic: "https://drive.google.com/file/d/1hce5GcGhbEYNtNthKL3qNKfHKyFFAZRQ/view?usp=sharing",
    program: "Information Science",
    year: "2027",
    linkedin: "https://www.linkedin.com/in/aniket-chandekar",
    connections: [],
  },
  {
    id: "arjan-suri",
    name: "Arjan Suri",
    website: "https://arjansuri.com",
    profilePic: "https://scontent-dfw5-2.cdninstagram.com/v/t51.82787-19/659108351_18081145820381723_3795411675849393288_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=108&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=LmBZGX7kXaUQ7kNvwEeFSkY&_nc_oc=AdrnkrfZqqhBRZ2BL1RJPPgejBUPl1SLiKPGrN74CMKtZ_2qtsdTj2bhbloPhLOtwzM&_nc_zt=24&_nc_ht=scontent-dfw5-2.cdninstagram.com&_nc_gid=ajiNOwEQ9pdwPO7l1MLxxQ&_nc_ss=7a289&oh=00_Af3ew9fpJSaslI_2T_8_kQiFksu1ulZY1HnPBqajV4sgZw&oe=69E0A135",
    program: "Computer Science & Math",
    instagram: "https://instagram.com/arjanssuri",
    twitter: "https://x.com/arjanssuri",
    linkedin: "https://linkedin.com/in/arjansuri",
    connections: [],
  },
  {
    id: "derek-chen",
    name: "Derek Chen",
    website: "http://derekchen.dev/",
    profilePic: "https://media.licdn.com/dms/image/v2/D5603AQF4b6xexBuGcw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1702837963429?e=2147483647&v=beta&t=8QBklMHMpLm9XJ11W9WIg8tiJq58oQYdEBPm2YhfsYA",
    program: "Computer Science & Business",
    instagram: "https://www.instagram.com/ramen__is__good/",
    twitter: "",
    linkedin: "https://www.linkedin.com/in/derekyujirchen/",
    connections: ["miguel-serna", "gabriel-keller"],
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
  {
    id: "helm-pm",
    name: "Helm PM",
    memberIds: ["ayman-mahfuz"],
    description: "An AI native product management platform",
    website: "https://helmpm.app/",
    profilePic: "https://drive.google.com/file/d/1LF8k1v9mayo-ZO01aJA-3xBFN8IK6qS0/view?usp=drive_link",
    twitter: "https://x.com/HelmPM_",
    linkedin: "https://www.linkedin.com/company/helm-pm/",
    accentItem: "#2E4258",
  },
  {
    id: "robotics-and-automation-society",
    name: "Robotics and Automation Society",
    memberIds: ["karmanyaah-malhotra"],
    description: "We support robotics competition teams and also build cool robots for fun!",
    website: "https://ras.ece.utexas.edu/",
    profilePic: "https://ras.ece.utexas.edu/images/ras_logo.png",
    instagram: "https://www.instagram.com/ut_ieee_ras/",
    linkedin: "https://www.linkedin.com/in/ut-ieee-ras/",
    github: "https://github.com/ut-ras/",
    accentItem: "#CC5500",
  },
  {
    id: "longhorn-developers",
    name: "Longhorn Developers",
    memberIds: ["derek-chen"],
    description: "Home to the UT Reg. Plus Extension! We are a student organization aimed at addressing student issues at UT through technology and design solutions.",
    website: "https://chromewebstore.google.com/detail/ut-registration-plus/hboadpjkoaieogjimneceaahlppnipaa?utm_source=item-share-cb",
    profilePic: "https://avatars.githubusercontent.com/u/71949018?s=800&v=4",
    instagram: "https://www.instagram.com/longhorndevelopers/",
    linkedin: "https://www.linkedin.com/company/longhorn-developers",
    github: "https://github.com/Longhorn-Developers",
    accentItem: "#bf5700",
  },
  {
    id: "ut-registration-plus",
    name: "UT Registration Plus",
    memberIds: ["derek-chen"],
    description: "An open-source Chrome extension that enhances UT Austin’s course registration for over 60k students",
    website: "https://chromewebstore.google.com/detail/ut-registration-plus/hboadpjkoaieogjimneceaahlppnipaa?utm_source=item-share-cb",
    profilePic: "https://raw.githubusercontent.com/Longhorn-Developers/UT-Registration-Plus/refs/heads/main/public/icons/icon_production.svg",
    instagram: "https://www.instagram.com/longhorndevelopers/",
    linkedin: "https://www.linkedin.com/company/longhorn-developers",
    github: "https://github.com/Longhorn-Developers/UT-Registration-Plus",
    accentItem: "#bf5700",
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
