type SpaceTourismLayout = {
  children: React.ReactNode;
};

export default function SpaceTourismLayout(props: SpaceTourismLayout) {
  return (
    <>
      <p>space tourism layout</p>
      <p>{props.children}</p>
    </>
  );
}
