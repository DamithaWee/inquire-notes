import Link from "next/link";
import { twMerge } from "tailwind-merge";

const PaperButton = ({ text, href, classes, funciton }) => {
  return (
    <Link href={href}>
      <button
        onClick={funciton}
        className={twMerge(
          `px-6 py-2 font-semibold rounded-lg bg-primaryLight dark:bg-primaryDark text-white dark:text-zinc-900 w-fit transition-all shadow-[3px_3px_0px_black] dark:shadow-[3px_3px_0px_white] dark:hover:shadow-none hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`,
          classes
        )}
       
      >
        {text}
      </button>
    </Link>
  );
};

export default PaperButton;
