
import { UserRound } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="border-b">
      <div className="container flex-1 items-center space-y-4 py-4 sm:flex sm:space-y-0 sm:space-x-4 md:py-6">
        <div className="flex items-center space-x-2">
          <UserRound className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        </div>
      </div>
    </div>
  );
}
