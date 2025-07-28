// src/components/Header.tsx
const Header = () => {
  return (
    <header className="w-full h-20 bg-gray-100 flex items-center justify-between px-8">
      <div className="text-red-600 text-3xl font-extrabold">Check.On</div>
      <nav className="flex space-x-6 text-gray-800 font-semibold">
        <a href="#">Check</a>
        <span>|</span>
        <a href="#">Information</a>
        <span>|</span>
        <a href="#">Record</a>
        <span>|</span>
        <a href="#">Review</a>
        <span>|</span>
        <a href="#">Advice</a>
      </nav>
      <div className="space-x-4 text-gray-600">
        <a href="#">로그인</a>
        <span>|</span>
        <a href="#">회원가입</a>
      </div>
    </header>
  );
};

export default Header;

