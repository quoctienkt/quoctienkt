import type { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = {
  title: "Hand Writing Classification",
};

export default function Page() {
  return <View />;
}