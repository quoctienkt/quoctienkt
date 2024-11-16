import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";
import { basePath, getAssetPath } from "@/utils/assetUtil";
import { Metadata } from "next";
import Image from "next/image";

import SpaceTourismLayoutDestinationPage from "./previews/space-tourism-layout/destination/page";

export const metadata: Metadata = {
  title: "Tiến Đặng collection",
  description: "All TienDang's app",
};

export default function Home() {
  return (
    <>
      <DefaultLayout basePath={basePath}>
        <SpaceTourismLayoutDestinationPage></SpaceTourismLayoutDestinationPage>
      </DefaultLayout>
    </>
  );
}
