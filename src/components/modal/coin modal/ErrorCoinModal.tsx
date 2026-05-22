interface ErrorCoinModal {
  error: string;
  handleClose: () => void;
}

export const ErrorCoinModal = ({ error, handleClose }: ErrorCoinModal) => {
  return (
    <div data-testid="modalError" className="py-12 text-center space-y-3">
      <p className="text-sm text-red-400 font-medium">{error}</p>
      <button
        onClick={handleClose}
        className="text-xs text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors"
      >
        Close and try again
      </button>
    </div>
  );
};
