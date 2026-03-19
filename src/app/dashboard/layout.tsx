import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { PageTransition } from '@/components/layout/PageTransition';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    redirect('/login');
  }

  const farm = await prisma.farm.findFirst({
    where: { 
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  });

  if (!farm && dbUser.role === 'OWNER') {
    redirect('/onboarding');
  }

  if (!farm && dbUser.role !== 'OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-xl text-white p-8">
        <div className="glass-morphism p-12 rounded-3xl text-center max-w-md">
           <h2 className="text-2xl font-black mb-4 uppercase tracking-widest text-emerald-400">Access Restricted</h2>
           <p className="opacity-70 leading-relaxed font-medium">You are not currently linked to any farm. Please contact your administrator to receive an invitation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden selection:bg-emerald-500/30">
      {/* Decorative Floating Mesh Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s] pointer-events-none" />

      <Sidebar role={dbUser.role} />
      
      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden pl-32">
        <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar pt-6 pb-12 px-2 md:px-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
