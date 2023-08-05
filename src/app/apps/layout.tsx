import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";
import { basePath, getAssetPath } from "@/utils/assetUtil";
import Script from "next/script";

type AppLayoutProps = {
  children: React.ReactNode;
  basePath: string;
};

export default function AppLayout(props: AppLayoutProps) {
  return (
    <>
      <>
        <div id="basePath" className="hidden">
          {basePath}
        </div>
        <Script src={getAssetPath("js/utils.js")} strategy="beforeInteractive"></Script>
      </>
      <DefaultLayout basePath={props.basePath}>{props.children}</DefaultLayout>
    </>
  );
}
