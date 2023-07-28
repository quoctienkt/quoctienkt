import { basePath } from "@/utils/assetUtil";
import { Home } from "./Home";
import { SpaceTourismLayout } from "./SpaceTourismLayout";

const appPrefix = "/previews/space-tourism-layout";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      backgroundDesktopUrl={`${basePath}${appPrefix}/assets/home/background-home-desktop.jpg`}
      backgroundTabletUrl={`${basePath}${appPrefix}/assets/home/background-home-tablet.jpg`}
    >
      <Home></Home>
    </SpaceTourismLayout>
  );
}
