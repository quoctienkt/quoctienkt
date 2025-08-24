import { SpaceTourismLayout } from "../SpaceTourismLayout";
import { Destination } from "./Destination";


export default function Page() {
  return (
    <SpaceTourismLayout
      navItemActive={"destination"}
    >
      <Destination />
    </SpaceTourismLayout>
  );
}
