import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";
import SpaceTourismLayoutDestinationPage from "./previews/space-tourism-layout/destination/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiến Đặng collection",
  description: "All TienDang's app",
};

export default function Home() {
  return (
    <DefaultLayout>
      <SpaceTourismLayoutDestinationPage></SpaceTourismLayoutDestinationPage>
    </DefaultLayout>
  );
}
