import { basePath } from "@/utils/assetUtil";
import { SpaceTourismLayout } from "../SpaceTourismLayout";
import { Moon } from "./Moon";

const appPrefix = "/previews/space-tourism-layout";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      backgroundDesktopUrl={`${basePath}${appPrefix}/assets/destination/background-destination-desktop.jpg`}
      backgroundTabletUrl={`${basePath}${appPrefix}/assets/destination/background-destination-tablet.jpg`}
    >
      <Moon></Moon>
    </SpaceTourismLayout>
  );
}
