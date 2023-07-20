import Image from 'next/image'
import { getAssetPath } from "../utils/AssetUtil"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tiến Đặng collection",
  description: "All TienDang's app",
};

export default function Home() {
  return (
    <>
      Index page
    </>
  )
}
