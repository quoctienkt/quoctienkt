import Image from 'next/image';
import { classes } from '@/utils/toggle';

type SummaryItemProps = {
  text: string;
  iconSrc: any;
  percentValue: number;
  variant: 'red' | 'yellow' | 'green' | 'blue';
};

const variantBg: Record<SummaryItemProps['variant'], string> = {
  red: 'bg-[#fff6f5]',
  yellow: 'bg-[#fffbf2]',
  green: 'bg-[#f2fafa]',
  blue: 'bg-[#f3f3fd]',
};

export function SummaryItem(props: SummaryItemProps) {
  return (
    <>
      <div
        className={classes(
          'flex flex-row items-center p-3 mt-3 rounded-lg',
          variantBg[props.variant],
        )}
      >
        <div className="w-8">
          <Image src={props.iconSrc} height={30} width={30} alt={props.text} />
        </div>
        <div className="flex-1 px-3 basis-full">{props.text}</div>
        <div className="flex flex-row">
          <div className="font-bold">{props.percentValue}</div>
          <div className="px-2 text-[#bdc0cf]">/</div>
          <div className="text-[#bdc0cf]">100</div>
        </div>
      </div>
    </>
  );
}
