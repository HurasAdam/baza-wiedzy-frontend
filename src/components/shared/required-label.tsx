export const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span>
    {children}
    <span className="text-primary ml-0.5">*</span>
  </span>
);
