import React from 'react';
import Nav from '../components/Nav';
import MobileBottomNav from '../components/MobileBottomNav';

const MobileMainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="mobile-only flex flex-col justify-start dc-w-full min-h-screen text-white bg-[#111318]">
            <Nav />
            <main className="dc-w-full relative flex-1 overflow-y-auto pb-16"> {/* Add main container for content */}
                {children}
            </main>
            <MobileBottomNav />
        </div>
    )
}

export default MobileMainLayout;