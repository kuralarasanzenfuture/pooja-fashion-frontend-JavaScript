import taxService from "../services/taxService.js";

/**
 * Tax API layer re-exporting service methods.
 */
export const taxApi = { ...taxService };

export default taxApi;

