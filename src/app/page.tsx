'use client';

import SearchableContent from '@/components/SearchableContent';
import { members, getConnections } from '@/data/members';

export default function Home() {
  const connections = getConnections();
  
  return <SearchableContent members={members} connections={connections} />;
}
