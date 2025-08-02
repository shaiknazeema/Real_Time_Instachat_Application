import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const getMe = async (token) =>
  axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });

export const acceptFriendRequest = async (token, requesterId) =>
  axios.post(`${API_URL}/friends/accept`, { requesterId }, { headers: { Authorization: `Bearer ${token}` } });

export const rejectFriendRequest = async (token, requesterId) =>
  axios.post(`${API_URL}/friends/reject`, { requesterId }, { headers: { Authorization: `Bearer ${token}` } });
