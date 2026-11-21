import { AppearanceSection } from "../_components/appearance-section";
import { SubpageHeader } from "../_components/subpage-header";

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-3">
      <SubpageHeader />
      <AppearanceSection />
    </div>
  );
}
