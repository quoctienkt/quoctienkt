import { basePath } from "@/utils/assetUtil";
import { Home } from "./Home";
import { SpaceTourismLayout } from "./SpaceTourismLayout";

const appPrefix = "/previews/space-tourism-layout";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      navItemActive={"home"}
      backgroundMobileUrl={`${appPrefix}/assets/home/background-home-mobile.jpg`}
      backgroundTabletUrl={`${appPrefix}/assets/home/background-home-tablet.jpg`}
      backgroundDesktopUrl={`${appPrefix}/assets/home/background-home-desktop.jpg`}
    >
      <Home></Home>
    </SpaceTourismLayout>
  );
}
