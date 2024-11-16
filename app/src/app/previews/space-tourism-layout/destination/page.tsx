import { basePath } from "@/utils/assetUtil";
import { SpaceTourismLayout } from "../SpaceTourismLayout";
import { Destination } from "./Destination";

const appPrefix = "/previews/space-tourism-layout";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      navItemActive={"destination"}
      backgroundMobileUrl={`${appPrefix}/assets/destination/background-destination-mobile.jpg`}
      backgroundTabletUrl={`${appPrefix}/assets/destination/background-destination-tablet.jpg`}
      backgroundDesktopUrl={`${appPrefix}/assets/destination/background-destination-desktop.jpg`}
    >
      <Destination></Destination>
    </SpaceTourismLayout>
  );
}
