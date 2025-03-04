
import { ActiveSessionsSection } from "./ActiveSessionsSection";
import { EmailSection } from "./EmailSection";
import { MagicLinkSection } from "./MagicLinkSection";
import { PasswordSection } from "./PasswordSection";
import { useActiveSessionsQuery } from "@/hooks/profile/useActiveSessionsQuery";

interface ProfileContentProps {
  userEmail?: string | null;
}

export const ProfileContent = ({ userEmail }: ProfileContentProps) => {
  const { data: activeSessions } = useActiveSessionsQuery();

  return (
    <div className="space-y-8 max-w-5xl">
      <EmailSection initialEmail={userEmail} />
      <PasswordSection />
      <MagicLinkSection userEmail={userEmail} />
      <ActiveSessionsSection sessions={activeSessions} />
    </div>
  );
};
