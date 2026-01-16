export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}