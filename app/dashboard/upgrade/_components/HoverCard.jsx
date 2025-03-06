import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useTheme } from "@/configs/ThemeContext";
import { BookOpenCheck } from "lucide-react";

const HoverCard = ({ title, subtitle, Icon, href }) => {
  const { theme } = useTheme();
  return (
    <HoverBorderGradient
      containerClassName="rounded-xl"
      as="div"
      className={"bg-bgLight dark:bg-bgDark"}
      theme={theme}
    >
      <div className="w-full p-3 rounded-xl border-[1px] border-slate-300 dark:border-zinc-700 relative overflow-hidden group bg-white dark:bg-bgDark  cursor-default text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primaryLight dark:from-primaryDark to-indigo-600 dark:to-lime-600  translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

        <h3 className="text-slate-950 dark:text-white group-hover:text-white dark:group-hover:text-black relative z-10 duration-300 font-bold text-sm flex items-center gap-2 justify-center">
          <BookOpenCheck
            width={20}
            className="text-primaryLight dark:text-primaryDark group-hover:text-white dark:group-hover:text-black"
          />
          {title}
        </h3>
      </div>
    </HoverBorderGradient>
  );
};

export default HoverCard;
