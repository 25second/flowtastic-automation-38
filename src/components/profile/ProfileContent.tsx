
import { EmailSection } from "./EmailSection";
import { MagicLinkSection } from "./MagicLinkSection";
import { PasswordSection } from "./PasswordSection";

interface ProfileContentProps {
  userEmail?: string | null;
}

export const ProfileContent = ({ userEmail }: ProfileContentProps) => {
  return (
    <div className="space-y-8 max-w-5xl">
      <EmailSection initialEmail={userEmail} />
      <PasswordSection />
      <MagicLinkSection userEmail={userEmail} />
    </div>
  );
};
