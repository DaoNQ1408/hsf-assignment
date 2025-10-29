import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
     setError('');
     setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (formData.password.length < 8) {
       setError('Mật khẩu phải có ít nhất 8 ký tự');
       return;
     }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/authentication/register', {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      setSuccessMessage('Đăng ký thành công');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
       if (axios.isAxiosError(err) && err.response) {
         console.error('Lỗi đăng ký API:', err.response.data);
         if (err.response.data && typeof err.response.data === 'object') {
            const apiError = Object.values(err.response.data).join('. ');
            setError(apiError || 'Đăng ký không thành công. Vui lòng thử lại.');
         } else if (typeof err.response.data?.error === 'string') {
            setError(err.response.data.error);
         } else {
            setError('Đăng ký không thành công. Vui lòng thử lại.');
         }
       } else {
         console.error('Lỗi đăng ký:', err);
         setError('Đã xảy ra lỗi mạng hoặc lỗi không xác định. Vui lòng thử lại.');
       }
       setLoading(false); 
    }
  };


  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Tạo tài khoản</h1>
          <p className="text-amber-700">Tham gia cộng đồng nhận nuôi thú cưng</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="Chọn tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="Xác nhận mật khẩu của bạn"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}


          <button
            type="submit"
            disabled={loading || !!successMessage} 
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-amber-700">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}