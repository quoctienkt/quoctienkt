import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";
import { basePath } from "@/utils/assetUtil";
import { Metadata } from "next";

import SpaceTourismLayoutHomepage from "./previews/space-tourism-layout/page";

export const metadata: Metadata = {
  title: "Tiến Đặng collection",
  description: "All TienDang's app",
};

export default function Home() {
  return (
    <>
      <DefaultLayout basePath={basePath}>
        <SpaceTourismLayoutHomepage></SpaceTourismLayoutHomepage>
      </DefaultLayout>
    </>
  );
}
