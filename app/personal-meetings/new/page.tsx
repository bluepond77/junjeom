import { AppShell } from "@/components/app-shell";
import { PersonalMeetingForm } from "@/components/personal-meeting-form";

export default function NewPersonalMeetingPage() {
  return (
    <AppShell requireOwner>
      <PersonalMeetingForm />
    </AppShell>
  );
}
