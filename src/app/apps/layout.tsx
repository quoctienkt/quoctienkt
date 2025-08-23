import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout(props: AppLayoutProps) {
  return <DefaultLayout>{props.children}</DefaultLayout>;
}
