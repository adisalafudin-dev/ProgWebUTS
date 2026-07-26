import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

/**
 * Member Service API Helper
 * Endpoints for NestJS Member Service Integration:
 * GET /members
 * GET /members/:id
 * POST /members
 * PATCH /members/:id
 * DELETE /members/:id
 */

const client = getServiceClient(SERVICE_KEYS.MEMBER);

const unwrap = (response) => response.data;

/**
 * Fetch list of library members with optional query params
 * @param {Object} [params]
 * @returns {Promise<any>}
 */
export const getMembers = (params) =>
  client.get("/members", { params }).then(unwrap);

/**
 * Fetch details of a single member by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export const getMemberById = (id) =>
  client.get(`/members/${id}`).then(unwrap);

/**
 * Create a new library member
 * @param {Object} payload
 * @returns {Promise<any>}
 */
export const createMember = (payload) =>
  client.post("/members", payload).then(unwrap);

/**
 * Update member details by ID
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<any>}
 */
export const patchMember = (id, payload) =>
  client.patch(`/members/${id}`, payload).then(unwrap);

/**
 * Delete a member by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export const deleteMember = (id) =>
  client.delete(`/members/${id}`).then(unwrap);

export const memberApi = {
  getMembers,
  getMemberById,
  createMember,
  patchMember,
  deleteMember,
};

export default memberApi;
