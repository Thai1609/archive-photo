import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Xóa cookie 'token'
  deleteCookie('token', { req, res, path: '/' });
  
  return res.status(200).json({ message: 'Đăng xuất thành công!' });
}
