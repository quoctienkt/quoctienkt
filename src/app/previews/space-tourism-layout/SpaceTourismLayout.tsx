import { NavItemActiveTypes, Navbar } from './Navbar';

const backgroundMobile =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/background-destination-mobile.jpg';
const backgroundTablet =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/background-destination-tablet.jpg';
const backgroundDesktop =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/background-destination-desktop.jpg';

type SpaceTourismLayoutProps = {
  children: React.ReactNode;
  navItemActive: NavItemActiveTypes;
};

export function SpaceTourismLayout({
  children,
  navItemActive,
}: SpaceTourismLayoutProps) {
  const backgroundMobileCss = `url(${backgroundMobile})`;
  const backgroundTabletCss = `url(${backgroundTablet})`;
  const backgroundDesktopCss = `url(${backgroundDesktop})`;

  return (
    <div className="w-full h-full relative overflow-auto text-white [color-scheme:dark]">
      <div className="w-full relative flex flex-col min-h-full">
        {/* Background layers */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover z-0 block max-sm:block sm:hidden"
          style={{ backgroundImage: backgroundMobileCss }}
        />
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover z-0 hidden sm:block lg:hidden"
          style={{ backgroundImage: backgroundTabletCss }}
        />
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover z-0 hidden lg:block"
          style={{ backgroundImage: backgroundDesktopCss }}
        />
        <Navbar navItemActive={navItemActive} />
        {children}
      </div>
    </div>
  );
}
