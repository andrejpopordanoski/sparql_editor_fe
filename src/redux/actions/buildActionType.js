export const buildActionType = (actionType, status) => `${actionType.entity}${actionType.action}${status}`;
