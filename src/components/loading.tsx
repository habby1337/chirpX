export const LoadingSpinner = () => {
  return (
    <div className="flex h-1/2 items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-slate-600"></div>
    </div>
  );
};

export const LoadingButton = () => {
  return (
    <div className="flex h-1/2 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full  border-b-2 border-slate-400"></div>
    </div>
  );
};
