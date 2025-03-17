
import { Skeleton } from "@/components/ui/skeleton";
import { EmailSection } from "./EmailSection";
import { MagicLinkSection } from "./MagicLinkSection";
import { PasswordSection } from "./PasswordSection";

interface ProfileContentProps {
  userEmail?: string | null;
}

export const ProfileContent = ({ userEmail }: ProfileContentProps) => {
  const isLoading = !userEmail;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <EmailSection initialEmail={userEmail} />
      <PasswordSection />
      <MagicLinkSection userEmail={userEmail} />
    </div>
  );
};
