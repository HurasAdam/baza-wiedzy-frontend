const TopicListSectionHeader = () => {
  return (
    <div className="hidden 2xl:flex items-center px-4 py-2 gap-3 bg-muted/30 border border-border  rounded-t-lg text-xs font-semibold text-muted-foreground mb-2">
      <div className="flex-1 ml-10 min-w-[490px]">Temat</div>
      <div className="flex-1 min-w-[200px]"> Notatka</div>
      <div className="w-50 text-center">Ilość odnotowań</div>
      <div className="w-30 text-center">Akcje</div>
    </div>
  );
};

export default TopicListSectionHeader;
