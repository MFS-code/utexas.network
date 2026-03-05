import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "projects & orgs — utexas.network",
  description: "Things being built by people in the UT Austin network. From startups to student orgs.",
  openGraph: {
    title: "projects & orgs — utexas.network",
    description: "Things being built by people in the UT Austin network. From startups to student orgs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "projects & orgs — utexas.network",
    description: "Things being built by people in the UT Austin network. From startups to student orgs.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
