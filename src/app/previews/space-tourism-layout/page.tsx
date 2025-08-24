import { Home } from "./Home";
import { SpaceTourismLayout } from "./SpaceTourismLayout";

export default function Page() {
  return (
    <SpaceTourismLayout navItemActive={"home"}>
      <Home />
    </SpaceTourismLayout>
  );
}
