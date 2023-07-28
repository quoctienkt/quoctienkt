import { basePath } from "@/utils/assetUtil";
import { Home } from "../Home";
import { SpaceTourismLayout } from "../SpaceTourismLayout";
import { Moon } from "./Moon";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      backgroundDesktopUrl={
        "/previews/space-tourism-layout/assets/destination/background-destination-desktop.jpg"
      }
    >
      <Moon></Moon>
    </SpaceTourismLayout>
  );
}
