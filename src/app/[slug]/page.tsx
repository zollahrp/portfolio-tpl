import { notFound } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DetailClient from "./DetailClient";

export const dynamic = 'force-dynamic';

export default async function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const q = query(collection(db, "portfolios"), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    notFound();
  }
  
  const rawProject = querySnapshot.docs[0].data();
  const project = { ...rawProject };
  
  // Convert Firebase Timestamp objects to strings to fix Next.js Server Component serialization error
  for (const key in project) {
    if (project[key] && typeof project[key].toDate === 'function') {
      project[key] = project[key].toDate().toISOString();
    }
  }

  return <DetailClient project={project} />;
}
