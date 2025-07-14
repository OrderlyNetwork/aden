import { Link } from "@remix-run/react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

export default function NavLink({ to, children, isActive, onClick }: NavLinkProps) {

  return (
    <Link
      to={to}
      className={`dc-h-44 dc-flex dc-items-center dc-whitespace-nowrap dc-px-24 dc-py-12 dc-text-sm dc-font-normal dc-rounded-[16px] ${isActive ? "dc-bg-[#FDB41D] dc-text-white" : "dc-text-[#898D99] dc-bg-black hover:dc-text-[#C1C1C1] hover:dc-bg-white/2"
        }`}
    >
      {children}
    </Link>
  );
} 