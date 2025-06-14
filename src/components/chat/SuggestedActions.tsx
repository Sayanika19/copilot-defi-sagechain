
interface SuggestedActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
}

const SuggestedActions = ({ actions, onActionClick }: SuggestedActionsProps) => {
  return (
    <div className="px-6 py-2 border-t border-purple-800/30">
      <div className="flex flex-wrap gap-2 mb-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action)}
            className="text-xs px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full hover:bg-purple-800/50 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedActions;
