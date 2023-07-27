import { basePath } from "@/utils/assetUtil";
import { Home } from "./Home";
import { SpaceTourismLayout } from "./SpaceTourismLayout";

export default function Page() {
  return (
    <SpaceTourismLayout
      basePath={basePath}
      backgroundDesktopUrl={
        "/previews/space-tourism-layout/assets/home/background-home-desktop.jpg"
      }
    >
      <Home></Home>
    </SpaceTourismLayout>
  );
}
